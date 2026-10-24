#!/usr/bin/env python3
"""Versioning for learner-facing content.

Every learner-facing file lives in a topic's `learner/` folder, next to the
research it was written from, and starts with a front-matter block:

    ---
    content_id: ballet.the-shoe
    title: The shoe
    kind: page
    topic: ballet
    version: 0.3.0
    status: draft
    updated: 2026-10-21
    authors: Claude Fable 5.1 (draft); six-reader board (review)
    claims_register: modules/F1-histories-of-making/atlas/data/register/units/ballet.yaml
    body_sha256: <filled by the tool>
    derived_from:
      - modules/F1-histories-of-making/topics/ballet/research/pass2_body.md@<git blob sha>
    changes:
      - 0.3.0 | 2026-10-21 | Third board round: ...
      - 0.2.0 | 2026-10-21 | ...
    ---

Rules the tool enforces:
  * the body may not change without a new version (`body_sha256` must match);
  * every earlier version in `changes` has a snapshot in `history/<version>.md`;
  * every research file in `derived_from` exists; if it changed after this
    version was written, the content is reported as stale (a warning: the
    writer decides whether the change matters, then bumps or re-confirms).

Commands (run from the repository root):
  python tools/content_versions.py check            # all content; exit 1 on errors
  python tools/content_versions.py index            # writes CONTENT_INDEX.md per topic
  python tools/content_versions.py manifest         # writes MANIFEST.md per topic: every research,
                                                    # planning and learner file, its size and last change
  python tools/content_versions.py bump FILE --part minor --summary "what changed"
  python tools/content_versions.py confirm FILE     # sources re-read, no text change: refresh their shas
  python tools/content_versions.py init FILE --id ID --title T --kind K --topic TOPIC --sources P [P ...]

Standard library only. Paths in front matter are relative to the repository root.
"""
from __future__ import annotations

import argparse
import datetime as _dt
import hashlib
import pathlib
import re
import subprocess
import sys

STATUSES = ("draft", "in-review", "approved", "published", "superseded")
KINDS = ("page", "walk", "chapter", "object-study", "card", "wall", "unit", "brief")
REQUIRED = ("content_id", "title", "kind", "topic", "version", "status", "updated", "body_sha256")
LIST_KEYS = ("derived_from", "changes")
SEMVER = re.compile(r"^\d+\.\d+\.\d+$")


def repo_root(start: pathlib.Path | None = None) -> pathlib.Path:
    p = (start or pathlib.Path.cwd()).resolve()
    for q in [p, *p.parents]:
        if (q / ".git").exists():
            return q
    return p


ROOT = repo_root(pathlib.Path(__file__).parent)


# ---------- front matter ----------

def split(text: str) -> tuple[dict, str]:
    """Return (meta, body). Meta values are strings; list keys are lists of strings."""
    if not text.startswith("---\n"):
        return {}, text
    end = text.find("\n---\n", 4)
    if end < 0:
        return {}, text
    head, body = text[4:end], text[end + 5:]
    meta: dict = {}
    current = None
    for line in head.splitlines():
        if not line.strip():
            continue
        if line.startswith("  - ") and current in LIST_KEYS:
            meta[current].append(line[4:].strip())
            continue
        if ":" in line and not line.startswith(" "):
            k, v = line.split(":", 1)
            k, v = k.strip(), v.strip()
            if k in LIST_KEYS:
                meta[k] = []
                current = k
            else:
                meta[k] = v
                current = k
    return meta, body


def join(meta: dict, body: str) -> str:
    order = list(REQUIRED[:-1]) + ["authors", "claims_register", "body_sha256"]
    lines = ["---"]
    for k in order + [k for k in meta if k not in order and k not in LIST_KEYS]:
        if k in meta and k not in LIST_KEYS:
            lines.append(f"{k}: {meta[k]}")
    for k in LIST_KEYS:
        lines.append(f"{k}:")
        for item in meta.get(k, []):
            lines.append(f"  - {item}")
    lines.append("---")
    return "\n".join(lines) + "\n" + body


def body_hash(body: str) -> str:
    return hashlib.sha256(body.encode("utf8")).hexdigest()


def blob_sha(path: pathlib.Path) -> str:
    """The git blob sha of a file as it is on disk now (same as `git hash-object`)."""
    data = path.read_bytes()
    return hashlib.sha1(b"blob %d\0" % len(data) + data).hexdigest()


def parse_change(line: str) -> tuple[str, str, str]:
    parts = [p.strip() for p in line.split("|", 2)]
    while len(parts) < 3:
        parts.append("")
    return parts[0], parts[1], parts[2]


def bump_version(v: str, part: str) -> str:
    major, minor, patch = (int(x) for x in v.split("."))
    if part == "major":
        return f"{major + 1}.0.0"
    if part == "minor":
        return f"{major}.{minor + 1}.0"
    return f"{major}.{minor}.{patch + 1}"


# ---------- discovery ----------

def content_files(root: pathlib.Path = ROOT) -> list[pathlib.Path]:
    out = []
    for p in sorted(root.glob("modules/*/topics/*/learner/**/*.md")):
        if "history" in p.relative_to(root).parts:
            continue
        meta, _ = split(p.read_text(encoding="utf8"))
        if meta.get("content_id"):
            out.append(p)
    return out


# ---------- check ----------

def check_file(p: pathlib.Path, root: pathlib.Path = ROOT) -> tuple[list[str], list[str]]:
    errors, warnings = [], []
    rel = p.relative_to(root)
    meta, body = split(p.read_text(encoding="utf8"))
    for k in REQUIRED:
        if not meta.get(k):
            errors.append(f"{rel}: missing '{k}'")
    if errors:
        return errors, warnings
    if not SEMVER.match(meta["version"]):
        errors.append(f"{rel}: version '{meta['version']}' is not MAJOR.MINOR.PATCH")
    if meta["status"] not in STATUSES:
        errors.append(f"{rel}: status '{meta['status']}' not one of {', '.join(STATUSES)}")
    if meta["kind"] not in KINDS:
        errors.append(f"{rel}: kind '{meta['kind']}' not one of {', '.join(KINDS)}")
    if meta["body_sha256"] != body_hash(body):
        errors.append(f"{rel}: the text changed but version {meta['version']} was not bumped "
                      f"(run: python tools/content_versions.py bump {rel} --part patch|minor|major --summary \"...\")")
    changes = meta.get("changes", [])
    if not changes:
        errors.append(f"{rel}: no 'changes' entries")
    else:
        first_v = parse_change(changes[0])[0]
        if first_v != meta["version"]:
            errors.append(f"{rel}: first 'changes' entry is {first_v}, but version is {meta['version']}")
        for line in changes[1:]:
            v = parse_change(line)[0]
            if not (p.parent / "history" / f"{v}.md").exists():
                warnings.append(f"{rel}: no snapshot history/{v}.md for earlier version {v}")
    if not meta.get("derived_from"):
        warnings.append(f"{rel}: no 'derived_from' research files listed")
    for item in meta.get("derived_from", []):
        path, _, sha = item.rpartition("@")
        src = root / path
        if not src.exists():
            errors.append(f"{rel}: source not found: {path}")
        elif sha and blob_sha(src) != sha:
            warnings.append(f"{rel}: STALE: {path} changed after version {meta['version']} was written")
    reg = meta.get("claims_register")
    if reg and not (root / reg).exists():
        errors.append(f"{rel}: claims register not found: {reg}")
    return errors, warnings


def cmd_check(args) -> int:
    files = [pathlib.Path(f).resolve() for f in args.files] if args.files else content_files()
    errs, warns = [], []
    for p in files:
        e, w = check_file(p)
        errs += e
        warns += w
    for w in warns:
        print("WARN ", w)
    for e in errs:
        print("ERROR", e)
    print(f"{len(files)} content file(s); {len(errs)} error(s), {len(warns)} warning(s)")
    return 1 if errs else 0


# ---------- bump, confirm, init ----------

def git_head_text(p: pathlib.Path) -> str | None:
    try:
        rel = p.resolve().relative_to(ROOT)
        return subprocess.run(["git", "show", f"HEAD:{rel.as_posix()}"], cwd=ROOT, capture_output=True,
                              text=True, check=True).stdout
    except Exception:
        return None


def refresh_sources(meta: dict, root: pathlib.Path = ROOT) -> None:
    fresh = []
    for item in meta.get("derived_from", []):
        path = item.rpartition("@")[0] or item
        src = root / path
        fresh.append(f"{path}@{blob_sha(src)}" if src.exists() else path)
    meta["derived_from"] = fresh


def cmd_bump(args) -> int:
    p = pathlib.Path(args.file).resolve()
    meta, body = split(p.read_text(encoding="utf8"))
    if not meta.get("version"):
        print("ERROR no front matter; use init first")
        return 1
    old = meta["version"]
    snap = p.parent / "history" / f"{old}.md"
    if not snap.exists():
        prev = git_head_text(p)
        if prev is None:
            prev = p.read_text(encoding="utf8")
        snap.parent.mkdir(parents=True, exist_ok=True)
        snap.write_text(prev, encoding="utf8")
    new = bump_version(old, args.part)
    today = args.date or _dt.date.today().isoformat()
    meta["version"] = new
    meta["updated"] = today
    if args.status:
        meta["status"] = args.status
    meta["changes"] = [f"{new} | {today} | {args.summary}"] + meta.get("changes", [])
    refresh_sources(meta)
    meta["body_sha256"] = body_hash(body)
    p.write_text(join(meta, body), encoding="utf8")
    cid = meta["content_id"]
    print(f"{cid}: {old} -> {new}; snapshot {snap.relative_to(ROOT)}; tag suggestion: {cid}@{new}")
    return 0


def cmd_confirm(args) -> int:
    p = pathlib.Path(args.file).resolve()
    meta, body = split(p.read_text(encoding="utf8"))
    if meta.get("body_sha256") != body_hash(body):
        print("ERROR the text changed; use bump, not confirm")
        return 1
    refresh_sources(meta)
    p.write_text(join(meta, body), encoding="utf8")
    print(f"{meta['content_id']}: sources re-confirmed for version {meta['version']}")
    return 0


def cmd_init(args) -> int:
    p = pathlib.Path(args.file).resolve()
    text = p.read_text(encoding="utf8")
    meta, body = split(text)
    if meta:
        print("ERROR front matter already present")
        return 1
    today = args.date or _dt.date.today().isoformat()
    meta = {
        "content_id": args.id, "title": args.title, "kind": args.kind, "topic": args.topic,
        "version": args.version, "status": args.status, "updated": today,
        "derived_from": list(args.sources or []),
        "changes": [f"{args.version} | {today} | {args.summary}"],
    }
    if args.authors:
        meta["authors"] = args.authors
    if args.claims:
        meta["claims_register"] = args.claims
    refresh_sources(meta)
    meta["body_sha256"] = body_hash(text)
    p.write_text(join(meta, text), encoding="utf8")
    print(f"{args.id}: initialised at {args.version}")
    return 0


# ---------- index ----------

def cmd_index(args) -> int:
    by_topic: dict[pathlib.Path, list[pathlib.Path]] = {}
    for p in content_files():
        topic_dir = p
        while topic_dir.name != "learner":
            topic_dir = topic_dir.parent
        by_topic.setdefault(topic_dir.parent, []).append(p)
    for topic_dir, files in by_topic.items():
        rows = ["# Content index", "",
                "Written by `tools/content_versions.py index`. Do not edit by hand.", "",
                "| Content | Kind | Version | Status | Updated | Earlier versions | Stale sources |",
                "|---|---|---|---|---|---|---|"]
        for p in files:
            meta, _ = split(p.read_text(encoding="utf8"))
            _, warns = check_file(p)
            stale = sum(1 for w in warns if "STALE" in w)
            earlier = ", ".join(parse_change(c)[0] for c in meta.get("changes", [])[1:]) or "none"
            rel = p.relative_to(topic_dir).as_posix()
            rows.append(f"| [{meta['title']}]({rel}) `{meta['content_id']}` | {meta['kind']} | {meta['version']} | "
                        f"{meta['status']} | {meta['updated']} | {earlier} | {stale} |")
        (topic_dir / "CONTENT_INDEX.md").write_text("\n".join(rows) + "\n", encoding="utf8")
        print("wrote", (topic_dir / "CONTENT_INDEX.md").relative_to(ROOT))
    return 0


def last_change(p: pathlib.Path) -> str:
    try:
        out = subprocess.run(["git", "log", "-1", "--format=%h %ad", "--date=short", "--", str(p)],
                             cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
        return out or "not committed"
    except Exception:
        return "unknown"


def cmd_manifest(args) -> int:
    for topic_dir in sorted(ROOT.glob("modules/*/topics/*")):
        if not topic_dir.is_dir() or topic_dir.name.startswith("_"):
            continue
        rows = ["# Manifest", "",
                "Written by `tools/content_versions.py manifest`. Do not edit by hand. "
                "Research and planning files are versioned by git (the commit and date of their last change); "
                "learner files carry their own version (see CONTENT_INDEX.md).", ""]
        for layer in ("research", "planning", "learner"):
            files = sorted(f for f in (topic_dir / layer).rglob("*") if f.is_file())
            if not files:
                continue
            rows += [f"## {layer.capitalize()} ({len(files)} files)", "",
                     "| File | Words | Version or last change |", "|---|---|---|"]
            for f in files:
                rel = f.relative_to(topic_dir).as_posix()
                words = len(f.read_text(encoding="utf8", errors="ignore").split()) if f.suffix in (".md", ".yaml", ".csv", ".txt") else "-"
                ver = last_change(f)
                if layer == "learner" and f.suffix == ".md":
                    meta, _ = split(f.read_text(encoding="utf8"))
                    if meta.get("version"):
                        ver = f"v{meta['version']} ({meta['status']})"
                    elif "history" in f.parts:
                        ver = f"snapshot of v{f.stem}"
                rows.append(f"| `{rel}` | {words} | {ver} |")
            rows.append("")
        (topic_dir / "MANIFEST.md").write_text("\n".join(rows), encoding="utf8")
        print("wrote", (topic_dir / "MANIFEST.md").relative_to(ROOT))
    return 0


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("check"); c.add_argument("files", nargs="*"); c.set_defaults(fn=cmd_check)
    i = sub.add_parser("index"); i.set_defaults(fn=cmd_index)
    m = sub.add_parser("manifest"); m.set_defaults(fn=cmd_manifest)
    b = sub.add_parser("bump"); b.add_argument("file"); b.add_argument("--part", choices=("patch", "minor", "major"), required=True)
    b.add_argument("--summary", required=True); b.add_argument("--status", choices=STATUSES); b.add_argument("--date"); b.set_defaults(fn=cmd_bump)
    f = sub.add_parser("confirm"); f.add_argument("file"); f.set_defaults(fn=cmd_confirm)
    n = sub.add_parser("init"); n.add_argument("file"); n.add_argument("--id", required=True); n.add_argument("--title", required=True)
    n.add_argument("--kind", choices=KINDS, required=True); n.add_argument("--topic", required=True)
    n.add_argument("--version", default="0.1.0"); n.add_argument("--status", choices=STATUSES, default="draft")
    n.add_argument("--summary", default="First version."); n.add_argument("--authors"); n.add_argument("--claims")
    n.add_argument("--sources", nargs="*"); n.add_argument("--date"); n.set_defaults(fn=cmd_init)
    args = ap.parse_args(argv)
    return args.fn(args)


if __name__ == "__main__":
    sys.exit(main())

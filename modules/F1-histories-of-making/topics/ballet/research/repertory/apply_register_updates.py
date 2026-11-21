"""Apply the register-update blocks at the end of each dossier file to register.yaml.

A correction is applied only when the register still holds the value the dossier saw ("old"),
or the field is empty. Anything else is a conflict and is left for a person. New rows are added
when their id is not in the register. Every decision is written to register_updates_<date>.md.

    python3 apply_register_updates.py 2026-11-21          # dry run
    python3 apply_register_updates.py 2026-11-21 --write  # change register.yaml
"""
import glob
import re
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
LISTS = {"choreographer", "composer", "scenario", "designer", "threads"}


def norm(v) -> str:
    if isinstance(v, list):
        v = ", ".join(str(x) for x in v)
    return re.sub(r"[\s\[\]\"']+", " ", str(v or "")).strip().lower()


def as_value(field, new):
    if field.split(".")[-1] in LISTS:
        if isinstance(new, list):
            return new
        s = str(new).strip()
        if s.startswith("["):
            try:
                v = yaml.safe_load(s)
                if isinstance(v, list):
                    return v
            except yaml.YAMLError:
                pass
            # a list followed by a remark: keep the remark as the last item
            m = re.match(r"\[(.*?)\](.*)", s)
            if m:
                items = [x.strip() for x in m.group(1).split(",") if x.strip()]
                rest = m.group(2).strip(" ;,")
                return items + ([rest] if rest else [])
        return [s]
    return new


def get(row, path):
    cur = row
    for part in path.split("."):
        if not isinstance(cur, dict):
            return None
        cur = cur.get(part)
    return cur


def put(row, path, value):
    parts = path.split(".")
    cur = row
    for part in parts[:-1]:
        cur = cur.setdefault(part, {})
    cur[parts[-1]] = value


def main():
    date = sys.argv[1]
    write = "--write" in sys.argv
    text = (HERE / "register.yaml").read_text(encoding="utf8")
    header = text.split("\nworks:", 1)[0]
    works = yaml.safe_load(text)["works"]
    by_id = {w["id"]: w for w in works}
    log = {"applied": [], "settled": [], "conflict": [], "added": [], "skipped": []}

    for f in sorted(glob.glob(str(HERE / "dossiers" / "*.md"))):
        name = Path(f).name
        for block in re.findall(r"```ya?ml\n(.*?)```", Path(f).read_text(encoding="utf8"), re.S):
            data = yaml.safe_load(block)
            items = []
            if isinstance(data, list):
                items = data
            elif isinstance(data, dict):
                for v in data.values():
                    if isinstance(v, list):
                        items += v
            for it in items:
                if not isinstance(it, dict):
                    continue
                if "field" not in it:
                    if it.get("id") and it["id"] not in by_id and it.get("premiere"):
                        row = {k: v for k, v in it.items() if k not in ("source", "sources_note")}
                        row.setdefault("sources", [f"repertory/dossiers/{name}"])
                        works.append(row)
                        by_id[row["id"]] = row
                        log["added"].append((name, row["id"]))
                    continue
                wid, field = str(it.get("id", "")), str(it["field"])
                row = by_id.get(wid)
                if row is None or field.startswith(("new row", "file path")):
                    log["skipped"].append((name, wid, field, "not a register field or unknown id"))
                    continue
                if field == "note (add)":
                    old_note = str(row.get("note") or "")
                    addition = str(it.get("new", "")).strip()
                    if addition and addition not in old_note:
                        row["note"] = (old_note + " | " if old_note else "") + addition
                    log["applied"].append((name, wid, "note", "added"))
                    continue
                if field == "premiere" and isinstance(it.get("new"), str):
                    field = "premiere.note"
                current = get(row, field)
                old = it.get("old")
                if current in (None, "", []) or norm(current) == norm(old) or old is None:
                    put(row, field, as_value(field, it.get("new")))
                    log["applied"].append((name, wid, field, str(it.get("source", ""))[:120]))
                elif field == "note":
                    # The dossier quoted the note in part: keep the note and add the correction to it.
                    row["note"] = str(current) + " | " + str(it.get("new"))
                    log["settled"].append((name, wid, field, "appended to the note"))
                elif isinstance(current, dict) and isinstance(it.get("new"), dict):
                    current.update(it["new"])
                    log["settled"].append((name, wid, field, "merged; earlier keys kept"))
                elif norm(old) and norm(old) in norm(current):
                    # The dossier saw a shortened form of the same value: take the fuller, sourced value
                    # and keep the earlier one in the note.
                    put(row, field, as_value(field, it.get("new")))
                    row["note"] = (str(row.get("note") or "") + f" | earlier {field}: {current}").strip(" |")
                    log["settled"].append((name, wid, field, "replaced; earlier value kept in note"))
                else:
                    log["conflict"].append((name, wid, field, norm(current)[:80], norm(old)[:80], str(it.get("new"))[:120]))

    lines = [f"# Register updates, {date}", "",
             "Written by `apply_register_updates.py` from the register-update blocks of the dossier files. "
             "A correction was applied only where the register still held the value the dossier saw. "
             "Conflicts are for a person to settle against the sources the dossier names.", ""]
    for key, title in (("added", "New rows"), ("applied", "Applied"), ("settled", "Settled by rule (partial quotes of the old value)"), ("conflict", "Conflicts (not applied)"),
                       ("skipped", "Skipped")):
        lines += [f"## {title} ({len(log[key])})", ""]
        lines += ["- " + " · ".join(str(x) for x in r) for r in log[key]] or ["- none"]
        lines.append("")
    (HERE / f"register_updates_{date}.md").write_text("\n".join(lines), encoding="utf8")
    print({k: len(v) for k, v in log.items()})
    if write:
        body = yaml.safe_dump({"works": works}, allow_unicode=True, sort_keys=False, width=140,
                              default_flow_style=None)
        (HERE / "register.yaml").write_text(header + "\n" + body, encoding="utf8")
        yaml.safe_load((HERE / "register.yaml").read_text(encoding="utf8"))
        print("register.yaml written:", len(works), "works")


if __name__ == "__main__":
    main()

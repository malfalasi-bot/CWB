"""Propose Wikidata identifiers for canon rows. Proposals only: a person accepts each one.

    python harvest/wikidata_match.py --kinds civilisation-as-commonly-named polity --limit 200

Writes data/matches/wikidata_candidates.csv: canon id, canon name, and up to three candidates
(QID, label, description). Rows already in data/matches/wikidata_accepted.csv are skipped.
Identifiers are never typed by hand (Scope v2, Q34); this file is where they come from.
Wikidata content is CC0.
"""
from __future__ import annotations

import csv
import glob
import json
import os
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = "https://www.wikidata.org/w/api.php"
UA = "F1-atlas-harvester/0.3 (educational project, Creative World; " + ("https://github.com/" + __import__("os").environ["GITHUB_REPOSITORY"] if __import__("os").environ.get("GITHUB_REPOSITORY") else "no repository URL") + ")"


def search(name: str, opener=None) -> list[dict]:
    q = {"action": "wbsearchentities", "search": name, "language": "en", "format": "json", "limit": 3, "type": "item"}
    url = API + "?" + urllib.parse.urlencode(q)
    if opener:
        return json.loads(opener(url)).get("search", [])
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8")).get("search", [])


def main(argv: list[str]) -> int:
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--kinds", nargs="*", help="canon kinds to match (default: all)")
    ap.add_argument("--limit", type=int, default=300, help="max rows per run (be polite)")
    ap.add_argument("--pause", type=float, default=1.0, help="seconds between requests")
    a = ap.parse_args(argv)
    mdir = os.path.join(ROOT, "data", "matches")
    os.makedirs(mdir, exist_ok=True)
    accepted = set()
    acc_path = os.path.join(mdir, "wikidata_accepted.csv")
    if os.path.exists(acc_path):
        accepted = {r["canon_id"] for r in csv.DictReader(open(acc_path, encoding="utf-8"))}
    cand_path = os.path.join(mdir, "wikidata_candidates.csv")
    done = set()
    if os.path.exists(cand_path):
        done = {r["canon_id"] for r in csv.DictReader(open(cand_path, encoding="utf-8"))}
    new = []
    for f in sorted(glob.glob(os.path.join(ROOT, "data", "canon", "canon_*.csv"))):
        for r in csv.DictReader(open(f, encoding="utf-8")):
            if a.kinds and r["kind"] not in a.kinds:
                continue
            if r["id"] in accepted or r["id"] in done:
                continue
            if len(new) >= a.limit:
                break
            try:
                hits = search(r["name"])
            except Exception as e:  # keep going
                print(f"{r['id']}: {e}", file=sys.stderr)
                continue
            row = {"canon_id": r["id"], "canon_name": r["name"], "kind": r["kind"]}
            for i, h in enumerate(hits[:3], 1):
                row[f"q{i}"] = h.get("id", "")
                row[f"label{i}"] = h.get("label", "")
                row[f"desc{i}"] = h.get("description", "")
            new.append(row)
            time.sleep(a.pause)
    fields = ["canon_id", "canon_name", "kind"] + [f"{k}{i}" for i in (1, 2, 3) for k in ("q", "label", "desc")]
    exists = os.path.exists(cand_path)
    with open(cand_path, "a", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=fields)
        if not exists:
            w.writeheader()
        w.writerows(new)
    print(f"{len(new)} rows proposed -> {cand_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

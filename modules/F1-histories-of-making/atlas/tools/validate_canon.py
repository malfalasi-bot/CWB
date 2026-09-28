"""Validate the canon CSVs: schema, codes, dates, flags and the writing lint.

    python tools/validate_canon.py            # all files in data/canon
    python tools/validate_canon.py --strict   # warnings also fail (use before a release)

Errors fail the run (CI blocks the change). Warnings are printed for a person to review.
"""
from __future__ import annotations

import csv
import glob
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from codes import (BANNED_PHRASES, COERCION_WORDS, CONFIDENCE, FUNCTIONS, HEADER, SENSITIVITY,  # noqa: E402
                   SUB_REGIONS, TIERS, WORLDS)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
YEAR = re.compile(r"-?\d+")


def split(v: str) -> list[str]:
    return [x.strip() for x in (v or "").split(";") if x.strip()]


def check_row(r: dict) -> tuple[list[str], list[str]]:
    err, warn = [], []
    if not r["id"] or not r["name"]:
        err.append("missing id or name")
    for s in split(r["sub_regions"]):
        if s not in SUB_REGIONS:
            err.append(f"unknown sub-region {s!r}")
    for w in split(r["world"]):
        if w not in WORLDS and not re.fullmatch(r"F1\.\d+[a-z]?", w):
            err.append(f"unknown world {w!r}")
    for f in split(r["functions"]):
        if f not in FUNCTIONS:
            warn.append(f"function not in the twelve: {f!r}")
    for s in split(r["sensitivity"]):
        if s not in SENSITIVITY:
            err.append(f"unknown sensitivity {s!r}")
    if r["tier"] not in TIERS:
        err.append(f"tier {r['tier']!r}")
    if r["confidence"] not in CONFIDENCE:
        err.append(f"confidence {r['confidence']!r}")
    for k in ("start", "end"):
        if r[k].strip() and not YEAR.fullmatch(r[k].strip()):
            err.append(f"{k} is not a signed year: {r[k]!r}")
    if r["start"].strip() and r["end"].strip() and YEAR.fullmatch(r["start"].strip()) and YEAR.fullmatch(r["end"].strip()):
        if int(r["start"]) > int(r["end"]):
            err.append("start after end")
    if "human-flow" not in r["sensitivity"]:
        if any(w in r["making_significance"].lower() for w in COERCION_WORDS):
            warn.append("prose names coerced labour but the human-flow flag is missing")
        elif any(w in r["leaves_out"].lower() for w in COERCION_WORDS):
            warn.append("review: leaves_out names coerced labour; decide whether the row needs human-flow")
    for p in BANNED_PHRASES:
        if re.search(rf"\b{re.escape(p)}\b", r["making_significance"].lower()):
            warn.append(f"banned phrase in making_significance: {p!r}")
    if r["kind"] in ("civilisation-as-commonly-named", "polity", "movement") and not r["leaves_out"].strip():
        err.append("leaves_out is required for this kind")
    if re.search(r"\bQ\d{3,}\b", r["other_names"] + r["notes"]):
        warn.append("looks like a typed Wikidata id; identifiers come from the harvest only")
    return err, warn


def main(argv: list[str]) -> int:
    strict = "--strict" in argv
    files = sorted(glob.glob(os.path.join(ROOT, "data", "canon", "canon_*.csv")))
    ids: dict[str, str] = {}
    n_err = n_warn = n_rows = 0
    for f in files:
        name = os.path.basename(f)
        with open(f, encoding="utf-8", newline="") as fh:
            rd = csv.DictReader(fh)
            if rd.fieldnames != HEADER:
                print(f"ERROR {name}: header differs from the schema")
                n_err += 1
                continue
            for r in rd:
                n_rows += 1
                if r["id"] in ids:
                    print(f"ERROR {name} {r['id']}: duplicate id (also in {ids[r['id']]})")
                    n_err += 1
                ids[r["id"]] = name
                e, w = check_row(r)
                for m in e:
                    print(f"ERROR {name} {r['id']}: {m}")
                for m in w:
                    print(f"warn  {name} {r['id']}: {m}")
                n_err += len(e)
                n_warn += len(w)
    print(f"{n_rows} rows in {len(files)} files: {n_err} errors, {n_warn} warnings")
    return 1 if n_err or (strict and n_warn) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

"""Coverage report: canon nodes, and verified open objects, per sub-region and period band.

    python tools/coverage.py      # writes reports/coverage.md and reports/coverage.json

A node counts in every band its date range touches. Objects come from data/harvested/objects.json
(written by harvest/candidates.py) when it exists; only records whose licence class is safe to host count.
"""
from __future__ import annotations

import csv
import glob
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from codes import BANDS, NO_PEOPLE_YET, SUB_REGIONS  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def bands_for(start: int, end: int) -> list[str]:
    return [code for code, _, a, b in BANDS if start < b and end >= a]


def canon_grid() -> dict:
    grid = {s: {b[0]: 0 for b in BANDS} for s in SUB_REGIONS if s != "GL"}
    for f in glob.glob(os.path.join(ROOT, "data", "canon", "canon_*.csv")):
        for r in csv.DictReader(open(f, encoding="utf-8")):
            if not r["start"].strip():
                continue
            st = int(r["start"])
            en = int(r["end"]) if r["end"].strip() else 2100
            for s in [x.strip() for x in r["sub_regions"].split(";")]:
                if s in grid:
                    for b in bands_for(st, en):
                        grid[s][b] += 1
    return grid


def object_grid() -> dict | None:
    path = os.path.join(ROOT, "data", "harvested", "objects.json")
    if not os.path.exists(path):
        return None
    grid = {s: {b[0]: 0 for b in BANDS} for s in SUB_REGIONS if s != "GL"}
    for o in json.load(open(path, encoding="utf-8")):
        if o.get("licence_class") not in ("PD-CC0", "NATIONAL-OPEN", "ATTRIBUTION"):
            continue
        if o.get("start") is None:
            continue
        for s in o.get("sub_regions", []):
            if s in grid:
                for b in bands_for(o["start"], o.get("end") if o.get("end") is not None else o["start"]):
                    grid[s][b] += 1
    return grid


def render(grid: dict, title: str) -> list[str]:
    out = [f"## {title}", "", "| Sub-region | " + " | ".join(b[0] for b in BANDS) + " |",
           "|---|" + "---|" * len(BANDS)]
    empty = thin = 0
    for s, row in grid.items():
        cells = []
        for b in BANDS:
            n = row[b[0]]
            if (s, b[0]) in NO_PEOPLE_YET:
                cells.append("·")
            elif n == 0:
                cells.append("**0**")
                empty += 1
            else:
                cells.append(str(n))
                thin += n < 3
        out.append(f"| {s} {SUB_REGIONS[s]} | " + " | ".join(cells) + " |")
    out += ["", f"Gaps (0): {empty}. Thin (1-2): {thin}. '·' = no people there yet.", ""]
    return out


def main() -> int:
    cg, og = canon_grid(), object_grid()
    lines = ["# Coverage report", "", "Bands: " + "; ".join(f"{c} {l}" for c, l, _, _ in BANDS), ""]
    lines += render(cg, "Canon nodes per cell")
    if og:
        lines += render(og, "Verified open objects per cell (licence safe to host)")
    else:
        lines += ["## Verified open objects per cell", "", "No harvest yet (data/harvested/objects.json missing).", ""]
    os.makedirs(os.path.join(ROOT, "reports"), exist_ok=True)
    open(os.path.join(ROOT, "reports", "coverage.md"), "w", encoding="utf-8").write("\n".join(lines))
    json.dump({"canon": cg, "objects": og}, open(os.path.join(ROOT, "reports", "coverage.json"), "w"), indent=1)
    print("wrote reports/coverage.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())

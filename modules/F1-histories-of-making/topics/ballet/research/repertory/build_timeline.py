"""Build the whole-history ballet timeline from the register and the events file.

Reads   register.yaml           (works: one row per version)
        timeline_events.yaml    (dated events that are not premieres)
        dossiers/*.md           (which works have a dossier, and where)
        ../works/W*.md          (which works are taken apart in the W files)
Writes  timeline.json           (eras, lanes, works, events, families, threads)

Run from anywhere:  python3 build_timeline.py
Standard library plus PyYAML.
"""
import json
import re
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent

ERAS = [
    {"id": "court", "label": "Court ballet", "from": 1581, "to": 1680},
    {"id": "enlightenment", "label": "Academy and action ballet", "from": 1680, "to": 1820},
    {"id": "romantic", "label": "Romantic ballet", "from": 1820, "to": 1865},
    {"id": "imperial", "label": "Imperial grand ballet", "from": 1865, "to": 1908},
    {"id": "modernist", "label": "Ballets Russes and modernism", "from": 1909, "to": 1943},
    {"id": "postwar", "label": "States, companies and the Cold War", "from": 1944, "to": 1975},
    {"id": "late20", "label": "Remaking and new forms", "from": 1976, "to": 1999},
    {"id": "c21", "label": "The twenty-first century", "from": 2000, "to": 2026},
]

# Lanes group the world by where the work was made.
LANE_OF_REGION = [
    ("france", "France"), ("italy", "Italy and Europe"), ("denmark", "Italy and Europe"),
    ("sweden", "Italy and Europe"), ("germany", "Italy and Europe"), ("netherlands", "Italy and Europe"),
    ("switzerland", "Italy and Europe"), ("belgium", "Italy and Europe"), ("monaco", "France"),
    ("russia", "Russia and the Soviet Union"), ("ussr", "Russia and the Soviet Union"),
    ("azerbaijan", "Russia and the Soviet Union"), ("armenia", "Russia and the Soviet Union"),
    ("georgia", "Russia and the Soviet Union"), ("tatar", "Russia and the Soviet Union"),
    ("united kingdom", "Britain"), ("england", "Britain"), ("britain", "Britain"),
    ("united states", "The Americas"), ("usa", "The Americas"), ("mexico", "The Americas"),
    ("argentina", "The Americas"), ("cuba", "The Americas"), ("canada", "The Americas"), ("brazil", "The Americas"),
    ("china", "Asia, Africa and the Middle East"), ("japan", "Asia, Africa and the Middle East"),
    ("korea", "Asia, Africa and the Middle East"), ("philippines", "Asia, Africa and the Middle East"),
    ("turkey", "Asia, Africa and the Middle East"), ("egypt", "Asia, Africa and the Middle East"),
    ("south africa", "Asia, Africa and the Middle East"), ("senegal", "Asia, Africa and the Middle East"),
    ("australia", "Asia, Africa and the Middle East"),
]
LANES = ["France", "Italy and Europe", "Russia and the Soviet Union", "Britain", "The Americas",
         "Asia, Africa and the Middle East"]


def lane_for(region: str) -> str:
    r = (region or "").split("/")[0].lower()  # the first place named is where it was made
    for key, lane in LANE_OF_REGION:
        if key in r:
            return lane
    return "Italy and Europe"


def year_of(date) -> int:
    m = re.match(r"(\d{4})", str(date))
    return int(m.group(1)) if m else 0


def dossier_index():
    """Map register id -> where the work is taken apart (W file or D dossier)."""
    where = {}
    for path in sorted((HERE / "dossiers").glob("*.md")):
        for m in re.finditer(r"`id: ([a-z0-9-]+)`", path.read_text(encoding="utf8")):
            where.setdefault(m.group(1), []).append(f"repertory/dossiers/{path.name}")
    return where


def main():
    reg = yaml.safe_load((HERE / "register.yaml").read_text(encoding="utf8"))["works"]
    events_path = HERE / "timeline_events.yaml"
    events = yaml.safe_load(events_path.read_text(encoding="utf8"))["events"] if events_path.exists() else []
    dossiers = dossier_index()

    works = []
    for w in reg:
        prem = w.get("premiere") or {}
        y = year_of(prem.get("date"))
        based = str(w.get("based_on") or "")
        parent = based.split("remake of ", 1)[1].split()[0].strip(";,.") if "remake of " in based else None
        depth = []
        if w.get("w_file"):
            depth.append(f"works/{w['w_file']}")
        depth += dossiers.get(w["id"], [])
        works.append({
            "id": w["id"],
            "title": (w.get("title") or {}).get("en") or w["id"],
            "orig": (w.get("title") or {}).get("orig"),
            "year": y,
            "date": str(prem.get("date")),
            "place": prem.get("place"),
            "company": prem.get("company"),
            "choreographer": w.get("choreographer") or [],
            "composer": w.get("composer") or [],
            "designer": w.get("designer") or [],
            "premise": w.get("premise"),
            "era": w.get("period"),
            "lane": lane_for(w.get("region")),
            "region": w.get("region"),
            "threads": w.get("threads") or [],
            "parent": parent,
            "tier": w.get("tier"),
            "confidence": w.get("confidence"),
            "depth": depth,
        })
    works.sort(key=lambda x: (x["year"], x["id"]))

    ids = {w["id"] for w in works}
    families = {}
    for w in works:
        root = w["id"]
        seen = set()
        while True:
            parent = next((x["parent"] for x in works if x["id"] == root), None)
            if not parent or parent not in ids or parent in seen:
                break
            seen.add(root)
            root = parent
        if root != w["id"] or any(x["parent"] == w["id"] for x in works):
            families.setdefault(root, []).append(w["id"])

    out = {
        "built_from": ["register.yaml", "timeline_events.yaml", "dossiers/", "../works/"],
        "eras": ERAS,
        "lanes": LANES,
        "works": works,
        "events": sorted(events, key=lambda e: (year_of(e.get("year")), e.get("title", ""))),
        "families": {k: v for k, v in families.items() if len(v) > 1},
    }
    (HERE / "timeline.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf8")
    deep = sum(1 for w in works if w["depth"])
    print(f"timeline.json: {len(works)} works ({deep} taken apart), {len(out['events'])} events, "
          f"{len(out['families'])} families")


if __name__ == "__main__":
    main()

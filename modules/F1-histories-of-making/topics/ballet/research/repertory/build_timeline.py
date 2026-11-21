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

# Ten eras, each named for the change it carries (REPERTORY_BENCHMARK.md §5.3). The benchmark lets
# eras overlap; the timeline draws them end to end, so the boundaries below are the drawn ones.
ERAS = [
    {"id": "E0", "label": "Before ballet: the dance masters", "from": 1450, "to": 1580, "chapters": [0, 1]},
    {"id": "E1", "label": "The court designs a world", "from": 1581, "to": 1671, "chapters": [1]},
    {"id": "E2", "label": "The Opéra makes professionals", "from": 1672, "to": 1759, "chapters": [1, 2]},
    {"id": "E3", "label": "The ballet tells a story", "from": 1760, "to": 1829, "chapters": [1, 2]},
    {"id": "E4", "label": "The theatre sells a dream", "from": 1830, "to": 1864, "chapters": [3]},
    {"id": "E5", "label": "The empire specifies", "from": 1865, "to": 1904, "chapters": [4, 5]},
    {"id": "E6", "label": "The committee and the painter's stage", "from": 1905, "to": 1928, "chapters": [7]},
    {"id": "E7", "label": "States, schools and the bare stage", "from": 1929, "to": 1955, "chapters": [7, 8]},
    {"id": "E8", "label": "Routes and rivalries", "from": 1956, "to": 1974, "chapters": [8]},
    {"id": "E9", "label": "Remaking the canon", "from": 1975, "to": 2004, "chapters": [10]},
    {"id": "E10", "label": "Screens, the world stage and repair", "from": 2005, "to": 2026, "chapters": [9, 10, 11]},
]

# Event lanes (the benchmark's lanes 2 to 6); works sit above them in rows by where they were made.
EVENT_LANES = ["Who paid and who ran it", "Bodies and training", "Stage, design and light",
               "Music, record and media", "The world outside"]


def era_of(year: int) -> str:
    for e in ERAS:
        if e["from"] <= year <= e["to"]:
            return e["id"]
    return ERAS[-1]["id"]

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
            "era": era_of(y),
            "period": w.get("period"),
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
        "event_lanes": EVENT_LANES,
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

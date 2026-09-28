"""Find open objects for canon groupings: the candidate pools behind world hubs and the coverage floor.

    python harvest/candidates.py --tiers R1 R2 --kinds archaeological-culture polity --limit 60

For each canon row, searches Cleveland (CC0 filter) and the Art Institute of Chicago (public-domain
filter) by the row's name, checks every hit's licence at record level, and appends them to
data/harvested/objects.json with the canon id, the row's sub-regions, a date range and a licence class.
The Met is left to harvest.py because its search filter returns non-public-domain records.

Candidates are not exemplars. A person promotes an object after the 1970 test, the protocol screen
and the attribution check (template v3, step 6).
"""
from __future__ import annotations

import csv
import glob
import json
import os
import sys
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "tools"))
from harvest import Fetcher  # noqa: E402
from licence_class import classify  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "harvested", "objects.json")


def cleveland(name: str, fetch: Fetcher, n: int = 5) -> list[dict]:
    q = {"q": name, "cc0": "1", "limit": n,
         "fields": "id,accession_number,title,creation_date,creation_date_earliest,creation_date_latest,culture,share_license_status,url"}
    data = fetch.get_json("https://openaccess-api.clevelandart.org/api/artworks/?" + urllib.parse.urlencode(q)).get("data", [])
    out = []
    for d in data:
        lic = d.get("share_license_status") or ""
        out.append({"holder": "Cleveland", "accession": d.get("accession_number", ""), "title": d.get("title", ""),
                    "date": d.get("creation_date", ""), "start": d.get("creation_date_earliest"),
                    "end": d.get("creation_date_latest"), "culture": "; ".join(d.get("culture") or []),
                    "licence": lic, "licence_class": classify(lic),
                    "record_url": d.get("url") or f"https://clevelandart.org/art/{d.get('accession_number', '')}"})
    return out


def aic(name: str, fetch: Fetcher, n: int = 5) -> list[dict]:
    q = {"q": name, "query[term][is_public_domain]": "true", "limit": n,
         "fields": "id,main_reference_number,title,date_display,date_start,date_end,place_of_origin,is_public_domain"}
    data = fetch.get_json("https://api.artic.edu/api/v1/artworks/search?" + urllib.parse.urlencode(q)).get("data", [])
    out = []
    for d in data:
        lic = "Public domain" if d.get("is_public_domain") else "Not public domain"
        out.append({"holder": "AIC", "accession": d.get("main_reference_number", ""), "title": d.get("title", ""),
                    "date": d.get("date_display", ""), "start": d.get("date_start"), "end": d.get("date_end"),
                    "culture": d.get("place_of_origin") or "", "licence": lic, "licence_class": classify(lic),
                    "record_url": f"https://www.artic.edu/artworks/{d.get('id', '')}"})
    return out


def main(argv: list[str]) -> int:
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--tiers", nargs="*", default=["R1", "R2"])
    ap.add_argument("--kinds", nargs="*")
    ap.add_argument("--limit", type=int, default=50, help="canon rows per run")
    a = ap.parse_args(argv)
    fetch = Fetcher()
    have = json.load(open(OUT, encoding="utf-8")) if os.path.exists(OUT) else []
    seen_rows = {o["canon_id"] for o in have}
    seen_obj = {(o["holder"], o["accession"], o["canon_id"]) for o in have}
    done = 0
    for f in sorted(glob.glob(os.path.join(ROOT, "data", "canon", "canon_*.csv"))):
        for r in csv.DictReader(open(f, encoding="utf-8")):
            if done >= a.limit:
                break
            if r["tier"] not in a.tiers or (a.kinds and r["kind"] not in a.kinds) or r["id"] in seen_rows:
                continue
            subs = [s.strip() for s in r["sub_regions"].split(";") if s.strip()]
            for src in (cleveland, aic):
                try:
                    hits = src(r["name"], fetch)
                except Exception as e:
                    print(f"{r['id']} {src.__name__}: {e}", file=sys.stderr)
                    continue
                for h in hits:
                    key = (h["holder"], h["accession"], r["id"])
                    if key in seen_obj:
                        continue
                    h.update({"canon_id": r["id"], "canon_name": r["name"], "sub_regions": subs, "status": "candidate"})
                    have.append(h)
                    seen_obj.add(key)
            done += 1
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(have, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{done} canon rows searched; {len(have)} candidate objects in {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

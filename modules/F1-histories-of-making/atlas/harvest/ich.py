"""UNESCO intangible heritage: take listing facts from UNESCO's own data, never from typing (Q34).

    python harvest/ich.py                      # fetch graph_en.json, write the files below
    python harvest/ich.py --graph saved.json   # use a saved copy (tests, or when offline)

Writes
  data/harvested/ich_elements.csv   one row per inscribed element: id, name, list, year, states, url
  reports/ich_matches.md            canon practices matched to elements by name, for a person to confirm

Source: https://ich.unesco.org/dive/data/graph_en.json ("updated once a year after the session of the
Intergovernmental Committee"). UNESCO states no licence for this file, so only facts (names, years, list,
states) are kept, each with a link back to UNESCO; no descriptions or images are copied.
"""
from __future__ import annotations

import csv
import difflib
import glob
import json
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = "https://ich.unesco.org/dive/data/graph_en.json"
UA = "F1-atlas-harvester/0.3 (educational project, Creative World; " + ("https://github.com/" + __import__("os").environ["GITHUB_REPOSITORY"] if __import__("os").environ.get("GITHUB_REPOSITORY") else "no repository URL") + ")"


def load_graph(path: str | None) -> dict:
    if path:
        return json.load(open(path, encoding="utf-8"))
    req = urllib.request.Request(URL, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read().decode("utf-8"))


def elements(graph: dict) -> list[dict]:
    """The graph's node schema is not documented; read it defensively and keep only element nodes."""
    nodes = graph.get("nodes") if isinstance(graph, dict) else graph
    if isinstance(nodes, dict):
        nodes = list(nodes.values())
    out = []
    for n in nodes or []:
        if not isinstance(n, dict):
            continue
        typ = str(n.get("type") or n.get("category") or n.get("group") or "").lower()
        label = n.get("label") or n.get("name") or n.get("title") or ""
        if "element" not in typ or not label:
            continue
        meta = n.get("meta") or n.get("data") or n
        year = str(meta.get("year") or meta.get("date") or "")
        m = re.search(r"(19|20)\d\d", year)
        out.append({
            "id": str(n.get("id", "")),
            "name": label.strip(),
            "list": str(meta.get("list") or meta.get("type_list") or ""),
            "year": m.group(0) if m else "",
            "states": "; ".join(meta.get("countries") or meta.get("states") or []) if isinstance(
                meta.get("countries") or meta.get("states"), list) else str(meta.get("countries") or ""),
            "url": str(meta.get("link") or meta.get("url") or ""),
        })
    return out


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9 ]", " ", s.lower()).replace("  ", " ").strip()


def match_practices(els: list[dict]) -> list[tuple[str, str, str, float]]:
    names = {norm(e["name"]): e for e in els}
    rows = []
    for f in glob.glob(os.path.join(ROOT, "data", "canon", "canon_practices.csv")):
        for r in csv.DictReader(open(f, encoding="utf-8")):
            best = difflib.get_close_matches(norm(r["name"]), list(names), n=1, cutoff=0.6)
            if best:
                e = names[best[0]]
                score = difflib.SequenceMatcher(None, norm(r["name"]), best[0]).ratio()
                rows.append((r["id"], r["name"], f"{e['name']} ({e['list']} {e['year']})".strip(), round(score, 2)))
    return rows


def main(argv: list[str]) -> int:
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--graph")
    a = ap.parse_args(argv)
    els = elements(load_graph(a.graph))
    os.makedirs(os.path.join(ROOT, "data", "harvested"), exist_ok=True)
    with open(os.path.join(ROOT, "data", "harvested", "ich_elements.csv"), "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=["id", "name", "list", "year", "states", "url"])
        w.writeheader()
        w.writerows(els)
    rows = match_practices(els)
    lines = ["# Canon practices matched to UNESCO elements", "",
             "Proposed by name similarity only. A person confirms each before a canon row's UNESCO status changes.", "",
             "| Canon id | Canon name | UNESCO element (list, year) | Similarity |", "|---|---|---|---|"]
    lines += [f"| {a} | {b} | {c} | {d} |" for a, b, c, d in rows]
    os.makedirs(os.path.join(ROOT, "reports"), exist_ok=True)
    open(os.path.join(ROOT, "reports", "ich_matches.md"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print(f"{len(els)} elements; {len(rows)} proposed matches")
    if not els:
        print("warning: no element nodes recognised; the graph's schema may have changed", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

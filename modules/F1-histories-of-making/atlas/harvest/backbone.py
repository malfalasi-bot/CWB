"""F1 Atlas backbone harvest: open structural data for movements, periods and places, matched to the canon.

    python harvest/backbone.py movements [--limit N] [--fixture saved_sparql.json]
    python harvest/backbone.py periods   [--limit N] [--fixture saved_dataset.json]
    python harvest/backbone.py places    [--limit N] [--fixture saved.csv | saved.csv.gz | pleiades_gis_data.zip]
    python harvest/backbone.py getty     [--limit N] [--kinds style movement school place] [--fixture saved.json] [--pause S]
    python harvest/backbone.py match
    python harvest/backbone.py all       [--limit N]   # the four harvests, then the match

Writes (facts only, each with the source's own identifier; no prose is copied from any source)
  data/backbone/movements_wikidata.csv   one row per Wikidata item: qid, labels, dates, countries, influences, AAT id, enwiki
  data/backbone/periods_periodo.csv      one row per PeriodO period definition, with its authority and its four bounds
  data/backbone/places_pleiades.csv      one row per Pleiades place: id, title, place types, point, time periods, uri
  data/backbone/getty_ids.csv            Getty AAT and TGN candidates for canon movement/style/school and place rows
  reports/backbone_matches.md            canon rows matched to all of the above by name similarity, for a person to confirm

Nothing here changes the canon. A person confirms each proposal before a canon row gains an identifier or a date
range (Scope v2, Q34: identifiers are never typed). Dates are compared and disagreements flagged in the report.

Sources (all opened and read on 4 October 2026)
  Wikidata SPARQL   https://query.wikidata.org/sparql      CC0
    Classes used (each QID read from wikidata.org, not typed from memory):
      Q968159  "art movement", with its subclasses (wdt:P31/wdt:P279*; 1,983 items on 4 Oct 2026). Design movements have
               no class of their own: the Arts and Crafts movement (Q330369), for example, is an instance of Q968159 and
               of Q32880, so this class carries them.
      Q32880   "architectural style", with its subclasses (1,900 items). Design and architectural styles sit here.
      Q1792644 "art style", direct instances only (469 items). Period styles such as "geometric art" (Q852337) are
               instances of this class and not of Q968159; its subclass tree is not followed because Q968159 is one of
               its subclasses and is already covered.
      Q2198855 "cultural movement" (the other parent of Q968159) is not used: it mixes in political and religious
               movements.
    Dates: Wikidata movements carry either inception/dissolved (P571/P576) or start/end time (P580/P582); both pairs are
    read and the first present is kept. The RDF export numbers BCE years astronomically (year 0 = 1 BCE), so
    "-0899-01-01" means 900 BCE; wd_year() converts to the canon's signed years (900 BCE = -900).
  PeriodO           https://data.perio.do/dataset/           CC0 (dcterms:license in https://data.perio.do/.well-known/void;
                    9,446 period definitions in 501 authorities, modified 2026-09-24). The same file is named by the ARK
                    http://n2t.net/ark:/99152/p0d.json on https://perio.do/technical-overview/. Bounds are xsd:gYear with
                    year 0 = 1 BCE; the CSV keeps PeriodO's values and the match converts.
  Pleiades          https://atlantides.org/downloads/pleiades/dumps/pleiades-places-latest.csv.gz   CC BY 3.0
                    The "latest places CSV" named on https://pleiades.stoa.org/downloads. Pleiades marks this legacy dump
                    deprecated ("still in operation for backward compatibility"); the GIS package it recommends instead,
                    https://atlantides.org/downloads/pleiades/gis/pleiades_gis_data.zip (places.csv + places_place_types.csv),
                    is also accepted by --fixture/--url, but it carries no time periods. Columns read: id, title,
                    featureTypes, reprLat, reprLong, timePeriods, path (documented in the dumps README and used by
                    pleiades-geojson); the legacy header was not read directly, so columns are looked up by name.
                    timePeriods codes per the README: A 1000-550 BC, C 550-330 BC, H 330-30 BC, R AD 30-300, L AD 300-640.
  Getty SPARQL      https://vocab.getty.edu/sparql (JSON results at https://vocab.getty.edu/sparql.json?query=...)
                    ODC-By 1.0. Query form from https://vocab.getty.edu/doc/queries/ sections 2.8 (luc:term full-text
                    search limited to one scheme, gvp:prefLabelGVP/xl:literalForm for the preferred label) and 4.2
                    (coalesce the English label with the GVP label for TGN, whose preferred labels are vernacular).
                    Attribution line required: "Contains information from the J. Paul Getty Trust, Getty Research
                    Institute, Art & Architecture Thesaurus [or Getty Thesaurus of Geographic Names], which is made
                    available under the ODC Attribution License".

Standard library only. Python 3.9+.
"""
from __future__ import annotations

import csv
import difflib
import glob
import gzip
import io
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import zipfile
from typing import Callable, Optional

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "data", "backbone")
REPORT = os.path.join(ROOT, "reports", "backbone_matches.md")

WIKIDATA_SPARQL = "https://query.wikidata.org/sparql"
PERIODO_DATASET = "https://data.perio.do/dataset/"
PLEIADES_PLACES_CSV = "https://atlantides.org/downloads/pleiades/dumps/pleiades-places-latest.csv.gz"
PLEIADES_SITE = "https://pleiades.stoa.org"
GETTY_SPARQL_JSON = "https://vocab.getty.edu/sparql.json"

UA = "F1-atlas-harvester/0.3 (educational project, Creative World; " + ("https://github.com/" + os.environ["GITHUB_REPOSITORY"] if os.environ.get("GITHUB_REPOSITORY") else "no repository URL") + ")"

# Wikidata classes: (QID, label as read from wikidata.org, follow subclasses?)
WD_CLASSES = [("Q968159", "art movement", True), ("Q32880", "architectural style", True), ("Q1792644", "art style", False)]
WD_PAGE = 500

# Pleiades legacy time-period codes (dumps README), as signed years in the canon's convention.
PLEIADES_PERIODS = {"A": (-1000, -550), "C": (-550, -330), "H": (-330, -30), "R": (30, 300), "L": (300, 640)}

MOVEMENT_FIELDS = ["qid", "label_en", "description_en", "inception", "end", "inception_year", "end_year", "country",
                   "influenced_by", "aat_id", "enwiki", "wd_classes"]
PERIOD_FIELDS = ["periodo_id", "label", "authority_id", "authority", "start_earliest", "start_latest", "stop_earliest",
                 "stop_latest", "start_label", "stop_label", "spatial_coverage", "spatial_description", "language", "uri"]
PLACE_FIELDS = ["pleiades_id", "title", "place_types", "lat", "lon", "time_periods", "period_start", "period_end", "uri"]
GETTY_FIELDS = ["canon_id", "canon_name", "kind", "vocabulary", "rank", "getty_id", "getty_uri", "pref_label", "parents",
                "place_type", "similarity"]


# --------------------------------------------------------------------------- fetching

def fetch(url: str, timeout: int = 300) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/sparql-results+json, application/json, text/csv, */*"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def sparql_json(endpoint: str, query: str, opener: Optional[Callable[[str], bytes]] = None) -> dict:
    url = endpoint + "?" + urllib.parse.urlencode({"format": "json", "query": query})
    return json.loads((opener or fetch)(url).decode("utf-8"))


def bindings(result: dict) -> list[dict]:
    """Flatten a SPARQL JSON result to plain dicts of strings (missing variables become '')."""
    out = []
    for b in result.get("results", {}).get("bindings", []):
        out.append({k: v.get("value", "") for k, v in b.items()})
    return out


# --------------------------------------------------------------------------- years

def wd_year(xsd: str) -> Optional[int]:
    """xsd:dateTime from Wikidata's RDF (astronomical years: 0000 = 1 BCE) to the canon's signed year."""
    m = re.match(r"^(-?\d+)-", xsd or "")
    return astro_to_canon(int(m.group(1))) if m else None


def gyear(s: str) -> Optional[int]:
    """xsd:gYear as PeriodO writes it ("-0899", "0400", "1453"), kept in PeriodO's own convention."""
    m = re.match(r"^(-?\d+)$", (s or "").strip())
    return int(m.group(1)) if m else None


def astro_to_canon(y: Optional[int]) -> Optional[int]:
    """Astronomical year numbering (0 = 1 BCE) to the canon's (no year 0; 1 BCE = -1)."""
    if y is None:
        return None
    return y if y > 0 else y - 1


def canon_year(s: str) -> Optional[int]:
    s = (s or "").strip()
    return int(s) if re.fullmatch(r"-?\d+", s) else None


# --------------------------------------------------------------------------- movements (Wikidata)

def wd_query(qid: str, subclasses: bool, limit: int, offset: int) -> str:
    path = "wdt:P31/wdt:P279*" if subclasses else "wdt:P31"
    return f"""SELECT ?item ?label ?description
  (SAMPLE(?inception) AS ?inception) (SAMPLE(?start) AS ?start)
  (SAMPLE(?end) AS ?end) (SAMPLE(?dissolved) AS ?dissolved)
  (GROUP_CONCAT(DISTINCT ?countryLabel; separator="; ") AS ?countries)
  (GROUP_CONCAT(DISTINCT ?inflQ; separator="; ") AS ?influenced_by)
  (SAMPLE(?aat) AS ?aat_id) (SAMPLE(?enwiki) AS ?enwiki)
WHERE {{
  {{ SELECT DISTINCT ?item WHERE {{ ?item {path} wd:{qid} . }} ORDER BY ?item LIMIT {limit} OFFSET {offset} }}
  OPTIONAL {{ ?item rdfs:label ?label FILTER(LANG(?label) = "en") }}
  OPTIONAL {{ ?item schema:description ?description FILTER(LANG(?description) = "en") }}
  OPTIONAL {{ ?item wdt:P571 ?inception }}
  OPTIONAL {{ ?item wdt:P580 ?start }}
  OPTIONAL {{ ?item wdt:P582 ?end }}
  OPTIONAL {{ ?item wdt:P576 ?dissolved }}
  OPTIONAL {{ ?item (wdt:P495|wdt:P17) ?country . ?country rdfs:label ?countryLabel FILTER(LANG(?countryLabel) = "en") }}
  OPTIONAL {{ ?item wdt:P737 ?infl . BIND(STRAFTER(STR(?infl), "/entity/") AS ?inflQ) }}
  OPTIONAL {{ ?item wdt:P1014 ?aat }}
  OPTIONAL {{ ?enwiki schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> }}
}}
GROUP BY ?item ?label ?description"""


def movement_row(b: dict, cls: str) -> dict:
    inception = b.get("inception") or b.get("start") or ""
    end = b.get("dissolved") or b.get("end") or ""
    return {
        "qid": b.get("item", "").rsplit("/", 1)[-1], "label_en": b.get("label", ""), "description_en": b.get("description", ""),
        "inception": inception, "end": end,
        "inception_year": "" if wd_year(inception) is None else wd_year(inception),
        "end_year": "" if wd_year(end) is None else wd_year(end),
        "country": b.get("countries", ""), "influenced_by": b.get("influenced_by", ""), "aat_id": b.get("aat_id", ""),
        "enwiki": b.get("enwiki", ""), "wd_classes": cls,
    }


def harvest_movements(limit: Optional[int] = None, fixture: Optional[str] = None, opener=None, pause: float = 1.0) -> list[dict]:
    rows: dict[str, dict] = {}
    if fixture:
        for b in bindings(json.load(open(fixture, encoding="utf-8"))):
            r = movement_row(b, "fixture")
            rows[r["qid"]] = r
        return list(rows.values())[: limit or None]
    for qid, label, subclasses in WD_CLASSES:
        offset = 0
        while True:
            page = WD_PAGE if limit is None else max(1, min(WD_PAGE, limit - len(rows)))
            if limit is not None and len(rows) >= limit:
                break
            got = bindings(sparql_json(WIKIDATA_SPARQL, wd_query(qid, subclasses, page, offset), opener))
            for b in got:
                r = movement_row(b, f"{qid} {label}")
                if r["qid"] in rows:
                    rows[r["qid"]]["wd_classes"] += "; " + r["wd_classes"]
                else:
                    rows[r["qid"]] = r
            if len(got) < page:
                break
            offset += page
            time.sleep(pause)
    return list(rows.values())


# --------------------------------------------------------------------------- periods (PeriodO)

def citation(source: dict) -> str:
    """A short citation from a PeriodO source object, whichever of its documented shapes it takes."""
    if not isinstance(source, dict):
        return str(source or "")
    if source.get("citation"):
        return str(source["citation"]).strip()
    inner = source.get("partOf")
    if isinstance(inner, dict):
        base = citation(inner)
        return f"{base}, {source['locator']}" if source.get("locator") else base
    names = [p.get("name", "") for p in (source.get("creators") or source.get("contributors") or []) if isinstance(p, dict)]
    bits = ["; ".join(n for n in names if n), str(source.get("title") or ""), str(source.get("yearPublished") or "")]
    text = ""
    for b in bits:
        if b:
            text = b if not text else text + (" " if text.endswith(".") else ". ") + b
    if not text:
        text = str(inner or source.get("id") or "")
    return text


def interval(v: dict) -> tuple[Optional[int], Optional[int], str]:
    """A PeriodO start/stop interval to (earliest, latest, label) in PeriodO's year convention."""
    if not isinstance(v, dict):
        return None, None, ""
    inside = v.get("in") or {}
    if "year" in inside:
        y = gyear(inside["year"])
        return y, y, v.get("label", "")
    return gyear(inside.get("earliestYear", "")), gyear(inside.get("latestYear", "")), v.get("label", "")


def period_rows(dataset: dict, limit: Optional[int] = None) -> list[dict]:
    auths = dataset.get("authorities") if isinstance(dataset, dict) else None
    if auths is None and isinstance(dataset, dict) and "periods" in dataset:  # a single authority file
        auths = {dataset.get("id", ""): dataset}
    out = []
    for aid, a in (auths or {}).items():
        cite = citation(a.get("source") or {})
        for pid, p in (a.get("periods") or {}).items():
            s0, s1, slab = interval(p.get("start") or {})
            e0, e1, elab = interval(p.get("stop") or {})
            labels = p.get("localizedLabels") or {}
            label = p.get("label") or (labels.get("en") or [""])[0]
            src = p.get("source") or {}
            cite_p = cite + (f", {src['locator']}" if isinstance(src, dict) and src.get("locator") else "")
            out.append({
                "periodo_id": p.get("id") or pid, "label": label, "authority_id": a.get("id") or aid, "authority": cite_p,
                "start_earliest": "" if s0 is None else s0, "start_latest": "" if s1 is None else s1,
                "stop_earliest": "" if e0 is None else e0, "stop_latest": "" if e1 is None else e1,
                "start_label": slab, "stop_label": elab,
                "spatial_coverage": "; ".join(x.get("label", "") for x in (p.get("spatialCoverage") or []) if isinstance(x, dict)),
                "spatial_description": p.get("spatialCoverageDescription", ""),
                "language": p.get("languageTag") or p.get("language", ""),
                "uri": "http://n2t.net/ark:/99152/" + (p.get("id") or pid),
            })
            if limit is not None and len(out) >= limit:
                return out
    return out


def harvest_periods(limit: Optional[int] = None, fixture: Optional[str] = None, opener=None) -> list[dict]:
    if fixture:
        data = json.load(open(fixture, encoding="utf-8"))
    else:
        data = json.loads((opener or fetch)(PERIODO_DATASET).decode("utf-8"))
    return period_rows(data, limit)


# --------------------------------------------------------------------------- places (Pleiades)

def pleiades_codes(s: str) -> tuple[list[str], Optional[int], Optional[int]]:
    codes = [c for c in re.split(r"[\s,;]+", (s or "").strip().upper()) if c]
    spans = [PLEIADES_PERIODS[c] for c in codes if c in PLEIADES_PERIODS]
    if not spans:
        return codes, None, None
    return codes, min(a for a, _ in spans), max(b for _, b in spans)


def _col(row: dict, *names: str) -> str:
    for n in names:
        if n in row and row[n] is not None:
            return str(row[n]).strip()
    return ""


def place_row(row: dict, types: Optional[str] = None) -> dict:
    pid = _col(row, "id")
    codes, p0, p1 = pleiades_codes(_col(row, "timePeriods"))
    uri = _col(row, "uri") or (PLEIADES_SITE + _col(row, "path") if _col(row, "path") else "")
    return {
        "pleiades_id": pid, "title": _col(row, "title"),
        "place_types": types if types is not None else "; ".join(t.strip() for t in _col(row, "featureTypes").split(",") if t.strip()),
        "lat": _col(row, "reprLat", "representative_latitude"), "lon": _col(row, "reprLong", "representative_longitude"),
        "time_periods": "; ".join(codes), "period_start": "" if p0 is None else p0, "period_end": "" if p1 is None else p1,
        "uri": uri,
    }


def _csv_rows(text: str):
    return csv.DictReader(io.StringIO(text.lstrip("﻿")))


def place_rows(raw: bytes, name: str, limit: Optional[int] = None) -> list[dict]:
    """Rows from the legacy places dump (CSV, gzipped or not) or from the GIS package zip."""
    out = []
    if name.lower().endswith(".zip"):
        with zipfile.ZipFile(io.BytesIO(raw)) as z:
            members = {os.path.basename(n): n for n in z.namelist()}
            types: dict[str, list[str]] = {}
            if "places_place_types.csv" in members:
                for r in _csv_rows(z.read(members["places_place_types.csv"]).decode("utf-8")):
                    types.setdefault(_col(r, "place_id"), []).append(_col(r, "place_type"))
            for r in _csv_rows(z.read(members["places.csv"]).decode("utf-8")):
                out.append(place_row(r, "; ".join(types.get(_col(r, "id"), []))))
                if limit is not None and len(out) >= limit:
                    break
        return out
    if name.lower().endswith(".gz") or raw[:2] == b"\x1f\x8b":
        raw = gzip.decompress(raw)
    for r in _csv_rows(raw.decode("utf-8")):
        out.append(place_row(r))
        if limit is not None and len(out) >= limit:
            break
    return out


def harvest_places(limit: Optional[int] = None, fixture: Optional[str] = None, opener=None, url: str = PLEIADES_PLACES_CSV) -> list[dict]:
    if fixture:
        return place_rows(open(fixture, "rb").read(), fixture, limit)
    return place_rows((opener or fetch)(url), url, limit)


# --------------------------------------------------------------------------- getty (AAT and TGN)

def aat_query(name: str) -> str:
    return f"""select ?Subject ?Term ?Parents {{
  ?Subject a skos:Concept; luc:term {json.dumps(name)}; skos:inScheme aat: ;
     gvp:prefLabelGVP [xl:literalForm ?Term].
  optional {{?Subject gvp:parentStringAbbrev ?Parents}}
}} limit 5"""


def tgn_query(name: str) -> str:
    return f"""select ?Subject (coalesce(?labEn,?labGVP) as ?Term) ?Parents ?Type {{
  ?Subject luc:term {json.dumps(name)}; skos:inScheme tgn: .
  optional {{?Subject xl:prefLabel [xl:literalForm ?labEn; dct:language gvp_lang:en]}}
  optional {{?Subject gvp:prefLabelGVP [xl:literalForm ?labGVP]}}
  optional {{?Subject gvp:parentStringAbbrev ?Parents}}
  optional {{?Subject gvp:placeTypePreferred [gvp:prefLabelGVP [xl:literalForm ?Type]]}}
}} limit 5"""


def search_term(name: str) -> str:
    """The canon name without its bracketed qualifier, which luc:term would treat as more required words."""
    return re.sub(r"\s*\(.*?\)\s*", " ", name).strip() or name


def getty_lookup(name: str, vocab: str, opener=None, fixture: Optional[dict] = None) -> list[dict]:
    term = search_term(name)
    if fixture is not None:
        result = (fixture.get(vocab) or {}).get(term) or (fixture.get(vocab) or {}).get(name) or {}
    else:
        url = GETTY_SPARQL_JSON + "?" + urllib.parse.urlencode({"query": aat_query(term) if vocab == "aat" else tgn_query(term)})
        result = json.loads((opener or fetch)(url).decode("utf-8"))
    out = []
    for b in bindings(result):
        label = b.get("Term", "")
        out.append({"vocabulary": vocab, "getty_uri": b.get("Subject", ""), "getty_id": vocab + ":" + b.get("Subject", "").rsplit("/", 1)[-1],
                    "pref_label": label, "parents": b.get("Parents", ""), "place_type": b.get("Type", ""),
                    "similarity": round(best_similarity(name, label), 2)})
    out.sort(key=lambda r: -r["similarity"])
    for i, r in enumerate(out[:3], 1):
        r["rank"] = i
    return out[:3]


def harvest_getty(limit: int = 300, kinds: Optional[list[str]] = None, fixture: Optional[str] = None, opener=None,
                  pause: float = 1.0, done: Optional[set] = None) -> list[dict]:
    fx = json.load(open(fixture, encoding="utf-8")) if fixture else None
    done = done or set()
    files = [("canon_movements_styles_schools.csv", "aat"), ("canon_places.csv", "tgn")]
    new, searched = [], 0
    for fname, vocab in files:
        path = os.path.join(ROOT, "data", "canon", fname)
        if not os.path.exists(path):
            continue
        for r in csv.DictReader(open(path, encoding="utf-8")):
            if kinds and r["kind"] not in kinds:
                continue
            if r["id"] in done:
                continue
            if searched >= limit:
                break
            try:
                hits = getty_lookup(r["name"], vocab, opener, fx)
            except Exception as e:  # keep going; one bad lookup should not stop the run
                print(f"{r['id']} {vocab}: {e}", file=sys.stderr)
                continue
            searched += 1
            if not hits:
                hits = [{"vocabulary": vocab, "rank": 0, "getty_id": "", "getty_uri": "", "pref_label": "", "parents": "",
                         "place_type": "", "similarity": ""}]
            for h in hits:
                new.append(dict(canon_id=r["id"], canon_name=r["name"], kind=r["kind"], **h))
            if fx is None:
                time.sleep(pause)
    return new


# --------------------------------------------------------------------------- matching

# Head words that most names in a kind share; left in, "Predynastic period" would score 0.72 against "Hellenistic Period".
GENERIC = {"period", "periods", "age", "era", "phase", "style", "styles", "art", "arts", "movement", "school", "culture",
           "tradition", "horizon", "the", "of", "and"}


def norm(s: str) -> str:
    """Lower-case, no bracketed qualifier, no punctuation, generic head words dropped (unless nothing else is left)."""
    s = re.sub(r"\s*\(.*?\)", "", s or "")
    words = re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", s.lower())).split()
    kept = [w for w in words if w not in GENERIC]
    return " ".join(kept or words)


def similarity(candidate: str, query: str) -> float:
    """Scored the way difflib.get_close_matches scores: the candidate is seq1, the query seq2."""
    return difflib.SequenceMatcher(None, norm(candidate), norm(query)).ratio()


def best_similarity(canon_name: str, other: str) -> float:
    return similarity(other, canon_name)


def keys(s: str) -> set:
    """Index keys for a name: its words and their first four letters, so 'Carthage' meets 'Carthago'."""
    out = set()
    for w in norm(s).split():
        if len(w) >= 3:
            out.add(w)
            out.add(w[:4])
    return out


class NameIndex:
    """Fuzzy lookup (difflib, as ich.py) over a bucketed name list, so 1,000 canon rows x 40,000 names stays quick."""

    def __init__(self, rows: list[dict], field: str):
        self.rows, self.field = rows, field
        self.buckets: dict[str, set] = {}
        for i, r in enumerate(rows):
            for k in keys(r.get(field, "")):
                self.buckets.setdefault(k, set()).add(i)

    def candidates(self, canon_row: dict, n: int = 3, cutoff: float = 0.6) -> list[tuple[float, dict]]:
        names = [canon_row.get("name", "")] + [x.strip() for x in (canon_row.get("other_names") or "").split(";") if x.strip()]
        found: dict[int, float] = {}
        for name in names:
            idx = set()
            for k in keys(name):
                idx |= self.buckets.get(k, set())
            pool = {norm(self.rows[i][self.field]): i for i in idx}
            for hit in difflib.get_close_matches(norm(name), list(pool), n=n, cutoff=cutoff):
                i = pool[hit]
                score = difflib.SequenceMatcher(None, hit, norm(name)).ratio()
                found[i] = max(found.get(i, 0.0), score)
        return sorted(((round(s, 2), self.rows[i]) for i, s in found.items()), key=lambda t: -t[0])[:n]


def date_flag(c0: Optional[int], c1: Optional[int], h0: Optional[int], h1: Optional[int]) -> str:
    """'' when the harvested bounds agree with the canon's within max(50 years, 10% of the canon span)."""
    if c0 is None and c1 is None:
        return "canon undated"
    if h0 is None and h1 is None:
        return "source undated"
    span = abs((c1 if c1 is not None else c0) - (c0 if c0 is not None else c1))
    tol = max(50, 0.1 * span)
    if None not in (c0, c1, h0, h1) and (h1 < c0 or h0 > c1):
        return "no overlap"
    diffs = [abs(a - b) for a, b in ((c0, h0), (c1, h1)) if a is not None and b is not None]
    return "dates differ" if any(d > tol for d in diffs) else ""


def fmt_years(a, b) -> str:
    a = "" if a is None else a
    b = "" if b is None else b
    return f"{a}..{b}" if a != "" or b != "" else "-"


def load_csv(path: str) -> list[dict]:
    return list(csv.DictReader(open(path, encoding="utf-8"))) if os.path.exists(path) else []


def canon_rows(*files: str) -> list[dict]:
    out = []
    for f in files:
        out += load_csv(os.path.join(ROOT, "data", "canon", f))
    return out


def match_report(movements: list[dict], periods: list[dict], places: list[dict], getty: list[dict],
                 canon_mov: list[dict], canon_per: list[dict], canon_plc: list[dict]) -> str:
    lines = ["# Canon rows matched to the open backbone", "",
             "Proposed by name similarity only; a person confirms each before a canon row gains an id or a date range.",
             "Canon dates are signed years (BCE negative). Source dates are converted to the same convention. 'dates differ'",
             "means a bound is more than 50 years or 10% of the canon span away; 'no overlap' means the ranges do not meet.",
             "Candidates whose name similarity is under 0.8 and whose dates do not overlap the canon's are left out as noise.", ""]
    getty_best: dict[tuple, dict] = {}
    for g in getty:
        if str(g.get("rank")) == "1":
            getty_best[(g["canon_id"], g["vocabulary"])] = g

    # movements, styles, schools -> Wikidata (+ AAT via P1014 and the Getty search)
    idx = NameIndex(movements, "label_en")
    lines += ["## Movements, styles and schools: Wikidata, with AAT", "",
              "| Canon id | Canon name | Canon dates | Wikidata | Similarity | Wikidata dates | AAT (P1014) | AAT (Getty search) | Flags |",
              "|---|---|---|---|---|---|---|---|---|"]
    n_mov = 0
    for r in canon_mov:
        c0, c1 = canon_year(r["start"]), canon_year(r["end"])
        g = getty_best.get((r["id"], "aat"))
        g_text = f"{g['getty_id']} {g['pref_label']} ({g['similarity']})" if g and g.get("getty_id") else ""
        for score, m in idx.candidates(r):
            h0, h1 = canon_year(str(m["inception_year"])), canon_year(str(m["end_year"]))
            flags = [date_flag(c0, c1, h0, h1)]
            if score < 0.8 and flags[0] == "no overlap":
                continue
            if g and g.get("getty_id") and m.get("aat_id"):
                flags.append("AAT agrees" if g["getty_id"] == "aat:" + m["aat_id"] else "AAT differs")
            lines.append(f"| {r['id']} | {r['name']} | {fmt_years(c0, c1)} | {m['qid']} {m['label_en']} | {score} | "
                         f"{fmt_years(h0, h1)} | {m.get('aat_id', '')} | {g_text} | {'; '.join(f for f in flags if f)} |")
            n_mov += 1
    lines.append("")

    # periods -> PeriodO (several definitions kept)
    idx = NameIndex(periods, "label")
    lines += ["## Periods: PeriodO (several definitions of one period are kept)", "",
              "| Canon id | Canon name | Canon dates | PeriodO definition | Authority | Where | Similarity | PeriodO bounds (start; stop) | Flags |",
              "|---|---|---|---|---|---|---|---|---|"]
    n_per = 0
    for r in canon_per:
        c0, c1 = canon_year(r["start"]), canon_year(r["end"])
        for score, p in idx.candidates(r, n=5):
            s0, s1 = astro_to_canon(canon_year(str(p["start_earliest"]))), astro_to_canon(canon_year(str(p["start_latest"])))
            e0, e1 = astro_to_canon(canon_year(str(p["stop_earliest"]))), astro_to_canon(canon_year(str(p["stop_latest"])))
            flag = date_flag(c0, c1, s0 if s0 is not None else s1, e1 if e1 is not None else e0)
            if score < 0.8 and flag == "no overlap":
                continue
            where = p.get("spatial_coverage") or p.get("spatial_description") or ""
            lines.append(f"| {r['id']} | {r['name']} | {fmt_years(c0, c1)} | {p['periodo_id']} {p['label']} | {p['authority']} | {where} | {score} | "
                         f"{fmt_years(s0, s1)}; {fmt_years(e0, e1)} | {flag} |")
            n_per += 1
    lines.append("")

    # places, polities, civilisations, cultures, networks -> Pleiades and TGN
    idx = NameIndex(places, "title")
    lines += ["## Places, polities, civilisations, cultures and networks: Pleiades and TGN", "",
              "| Canon id | Kind | Canon name | Canon dates | Pleiades | Similarity | Pleiades types | Pleiades periods | TGN (Getty search) | Flags |",
              "|---|---|---|---|---|---|---|---|---|---|"]
    n_plc = 0
    for r in canon_plc:
        c0, c1 = canon_year(r["start"]), canon_year(r["end"])
        g = getty_best.get((r["id"], "tgn"))
        g_text = f"{g['getty_id']} {g['pref_label']} [{g['parents']}] ({g['similarity']})" if g and g.get("getty_id") else ""
        hits = idx.candidates(r)
        if not hits and not g_text:
            continue
        for score, p in (hits or [(None, None)]):
            if p is None:
                lines.append(f"| {r['id']} | {r['kind']} | {r['name']} | {fmt_years(c0, c1)} | | | | | {g_text} | |")
            else:
                h0, h1 = canon_year(str(p["period_start"])), canon_year(str(p["period_end"]))
                flag = date_flag(c0, c1, h0, h1)
                if score < 0.8 and flag == "no overlap":
                    continue
                lines.append(f"| {r['id']} | {r['kind']} | {r['name']} | {fmt_years(c0, c1)} | {p['pleiades_id']} {p['title']} | {score} | "
                             f"{p['place_types']} | {p['time_periods'] or '-'} ({fmt_years(h0, h1)}) | {g_text} | {flag} |")
            n_plc += 1
    lines += ["", f"Proposals: {n_mov} movement/style/school, {n_per} period, {n_plc} place-like. "
              f"Harvested rows: {len(movements)} Wikidata, {len(periods)} PeriodO, {len(places)} Pleiades, {len(getty)} Getty candidates.", ""]
    return "\n".join(lines)


# --------------------------------------------------------------------------- driver

def write_csv(path: str, fields: list[str], rows: list[dict], append: bool = False) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    exists = os.path.exists(path)
    with open(path, "a" if append else "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=fields, extrasaction="ignore")
        if not (append and exists):
            w.writeheader()
        w.writerows(rows)


def main(argv: list[str]) -> int:
    import argparse
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("command", choices=["movements", "periods", "places", "getty", "match", "all"])
    ap.add_argument("--limit", type=int, help="rows to harvest this run (getty: canon rows to look up; default 300)")
    ap.add_argument("--fixture", help="a saved response or dump to read instead of the network")
    ap.add_argument("--kinds", nargs="*", help="getty: canon kinds to look up (default: all movement/style/school and place rows)")
    ap.add_argument("--pause", type=float, default=1.0, help="seconds between requests to one service")
    ap.add_argument("--url", help="places: an alternative dump URL, e.g. the GIS package zip")
    a = ap.parse_args(argv)
    os.makedirs(OUT_DIR, exist_ok=True)
    cmd = a.command
    if cmd in ("movements", "all"):
        rows = harvest_movements(a.limit, a.fixture if cmd == "movements" else None, pause=a.pause)
        write_csv(os.path.join(OUT_DIR, "movements_wikidata.csv"), MOVEMENT_FIELDS, rows)
        print(f"{len(rows)} Wikidata movements/styles -> data/backbone/movements_wikidata.csv")
    if cmd in ("periods", "all"):
        rows = harvest_periods(a.limit, a.fixture if cmd == "periods" else None)
        write_csv(os.path.join(OUT_DIR, "periods_periodo.csv"), PERIOD_FIELDS, rows)
        print(f"{len(rows)} PeriodO period definitions -> data/backbone/periods_periodo.csv")
    if cmd in ("places", "all"):
        rows = harvest_places(a.limit, a.fixture if cmd == "places" else None, url=a.url or PLEIADES_PLACES_CSV)
        write_csv(os.path.join(OUT_DIR, "places_pleiades.csv"), PLACE_FIELDS, rows)
        print(f"{len(rows)} Pleiades places -> data/backbone/places_pleiades.csv")
    if cmd in ("getty", "all"):
        path = os.path.join(OUT_DIR, "getty_ids.csv")
        done = {r["canon_id"] for r in load_csv(path)}
        rows = harvest_getty(a.limit or 300, a.kinds, a.fixture if cmd == "getty" else None, pause=a.pause, done=done)
        write_csv(path, GETTY_FIELDS, rows, append=True)
        print(f"{len(rows)} Getty candidates appended -> data/backbone/getty_ids.csv ({len(done)} canon rows were already done)")
    if cmd in ("match", "all"):
        text = match_report(load_csv(os.path.join(OUT_DIR, "movements_wikidata.csv")),
                            load_csv(os.path.join(OUT_DIR, "periods_periodo.csv")),
                            load_csv(os.path.join(OUT_DIR, "places_pleiades.csv")),
                            load_csv(os.path.join(OUT_DIR, "getty_ids.csv")),
                            canon_rows("canon_movements_styles_schools.csv"), canon_rows("canon_periods.csv"),
                            canon_rows("canon_places.csv", "canon_polities.csv", "canon_civilisations.csv",
                                       "canon_cultures_horizons.csv", "canon_networks.csv"))
        os.makedirs(os.path.dirname(REPORT), exist_ok=True)
        open(REPORT, "w", encoding="utf-8").write(text)
        print(text.rstrip().splitlines()[-1] + " -> reports/backbone_matches.md")
    return 0


ERRORS = os.path.join(ROOT, "reports", "backbone_errors.md")


def _record_error(cmd: str, exc: BaseException) -> None:
    """A failed harvest is written where the pull request will show it, not only to a runner log nobody can open."""
    import datetime
    import traceback
    os.makedirs(os.path.dirname(ERRORS), exist_ok=True)
    first = not os.path.exists(ERRORS)
    with open(ERRORS, "a", encoding="utf-8") as fh:
        if first:
            fh.write("# Backbone harvest errors\n\nOne entry per failed step, newest last. Delete this file once the cause is fixed.\n")
        fh.write(f"\n## {cmd} · {datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}\n\n")
        detail = getattr(exc, "reason", None) or getattr(exc, "code", None)
        fh.write(f"{type(exc).__name__}: {exc}" + (f" ({detail})" if detail else "") + "\n\n```\n")
        fh.write("".join(traceback.format_exception(type(exc), exc, exc.__traceback__))[-3000:])
        fh.write("```\n")


if __name__ == "__main__":
    try:
        sys.exit(main(sys.argv[1:]))
    except SystemExit:
        raise
    except BaseException as e:  # noqa: BLE001 - any failure is recorded for the pull request, then re-raised
        _record_error(sys.argv[1] if len(sys.argv) > 1 else "?", e)
        raise

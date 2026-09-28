"""F1 world-set harvester, v0.

Fetches object records from three open-access museum APIs, checks the licence
record by record, reads provenance, applies the 1970 test, and writes the
fields the world-set register needs.

    python harvest/harvest.py data/register/world_set_v0.csv --out data/harvested/register_check.json

Sources
  Cleveland Museum of Art  https://openaccess-api.clevelandart.org  (CC0 per record: share_license_status)
  The Met                  https://collectionapi.metmuseum.org      (isPublicDomain per record; provenance
                                                                     only on the object web page)
  Art Institute of Chicago https://api.artic.edu                    (is_public_domain per record)

Rules carried from the F1 workflow
  * A licence is checked per record, never assumed from age or anonymity (rights finding 3.3).
  * The 1970 test: pass if the object was in a museum or a documented collection outside its
    country of origin before 17 November 1970, or was excavated with a record, or was exported
    with a documented licence. Otherwise it is an enquiry or a fail, and a failing object is
    taught as a case, never used as an exemplar.
  * Objects that are not archaeological (European decorative art, signed modern work) are "n/a";
    objects made after 1800 in colonised regions get the colonial-context screen instead.

Standard library only, so it runs anywhere Python 3.9+ runs.
"""
from __future__ import annotations

import csv
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass, field, asdict
from datetime import date
from typing import Callable, Optional

sys.path.insert(0, __import__("os").path.join(__import__("os").path.dirname(__import__("os").path.dirname(__import__("os").path.abspath(__file__))), "tools"))
from licence_class import classify  # noqa: E402

THRESHOLD = date(1970, 11, 17)
USER_AGENT = "F1-atlas-harvester/0.3 (educational project, Creative World; " + ("https://github.com/" + __import__("os").environ["GITHUB_REPOSITORY"] if __import__("os").environ.get("GITHUB_REPOSITORY") else "no repository URL") + ")"


# --------------------------------------------------------------------------- rate limiting

class RateLimiter:
    """At most `per_minute` calls per host, spaced evenly. Clock and sleep are injectable for tests."""

    def __init__(self, per_minute: float = 10, clock: Callable[[], float] = time.monotonic,
                 sleep: Callable[[float], None] = time.sleep):
        self.interval = 60.0 / per_minute
        self.clock, self.sleep = clock, sleep
        self.last: dict[str, float] = {}

    def wait(self, host: str) -> float:
        now = self.clock()
        due = self.last.get(host, -1e9) + self.interval
        waited = max(0.0, due - now)
        if waited:
            self.sleep(waited)
        self.last[host] = max(now, due)
        return waited


# --------------------------------------------------------------------------- fetching

class Fetcher:
    """Polite HTTP GET with per-host rate limits and retry on 429/5xx. Swap `opener` in tests."""

    LIMITS = {"openaccess-api.clevelandart.org": 20, "collectionapi.metmuseum.org": 20,
              "www.metmuseum.org": 6, "api.artic.edu": 20}

    def __init__(self, opener: Optional[Callable[[str], str]] = None, limiter: Optional[RateLimiter] = None,
                 retries: int = 3):
        self.opener = opener or self._urlopen
        self.limiters = {h: RateLimiter(n) for h, n in self.LIMITS.items()}
        self.default = limiter or RateLimiter(10)
        self.retries = retries

    @staticmethod
    def _urlopen(url: str) -> str:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json, text/html"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read().decode("utf-8")

    def get(self, url: str) -> str:
        host = urllib.parse.urlparse(url).netloc
        limiter = self.limiters.get(host, self.default)
        for attempt in range(self.retries + 1):
            limiter.wait(host)
            try:
                return self.opener(url)
            except urllib.error.HTTPError as e:  # type: ignore[attr-defined]
                if e.code in (429, 500, 502, 503, 504) and attempt < self.retries:
                    limiter.sleep(2 ** attempt * 5)
                    continue
                raise
        raise RuntimeError("unreachable")

    def get_json(self, url: str) -> dict:
        return json.loads(self.get(url))


# --------------------------------------------------------------------------- normalised record

@dataclass
class Harvested:
    holder: str
    accession: str
    source_id: str
    title: str = ""
    date: str = ""
    licence: str = ""
    is_open: bool = False
    provenance_text: str = ""
    provenance_entries: list = field(default_factory=list)
    accession_date: str = ""          # ISO date if known, else a year
    credit_line: str = ""
    record_url: str = ""
    image_url: str = ""
    checked_on: str = field(default_factory=lambda: date.today().isoformat())
    test: str = ""
    test_basis: str = ""


# --------------------------------------------------------------------------- Cleveland

CMA_FIELDS = "id,accession_number,title,creation_date,share_license_status,provenance,creditline,accession_date,images,url,culture,find_spot"


def cleveland_by_accession(acc: str, fetch: Fetcher) -> Optional[Harvested]:
    url = ("https://openaccess-api.clevelandart.org/api/artworks/?" +
           urllib.parse.urlencode({"q": acc, "fields": CMA_FIELDS, "limit": 10}))
    data = fetch.get_json(url).get("data", [])
    hit = next((d for d in data if d.get("accession_number") == acc), None)  # q= is fuzzy; insist on exact
    return normalise_cleveland(hit) if hit else None


def normalise_cleveland(d: dict) -> Harvested:
    entries = [{"text": p.get("description", ""), "date": p.get("date") or ""} for p in (d.get("provenance") or [])]
    text = "; ".join(f"{e['text']} ({e['date']})" if e["date"] else e["text"] for e in entries)
    img = ((d.get("images") or {}).get("web") or {}).get("url", "")
    lic = d.get("share_license_status") or ""
    return Harvested(
        holder="Cleveland", accession=d.get("accession_number", ""), source_id=str(d.get("id", "")),
        title=d.get("title", ""), date=d.get("creation_date", ""), licence=lic, is_open=(lic == "CC0"),
        provenance_text=text, provenance_entries=entries,
        accession_date=(d.get("accession_date") or "")[:10], credit_line=d.get("creditline", ""),
        record_url=d.get("url", "") or f"https://clevelandart.org/art/{d.get('accession_number', '')}",
        image_url=img if lic == "CC0" else "")


# --------------------------------------------------------------------------- The Met

def met_by_object_id(object_id: int, fetch: Fetcher, with_provenance: bool = True) -> Harvested:
    d = fetch.get_json(f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{object_id}")
    h = normalise_met(d)
    if with_provenance:
        page = fetch.get(f"https://www.metmuseum.org/art/collection/search/{object_id}")
        h.provenance_text = met_provenance(page) or ""
    return h


def normalise_met(d: dict) -> Harvested:
    pd = bool(d.get("isPublicDomain"))
    return Harvested(
        holder="Met", accession=d.get("accessionNumber", ""), source_id=str(d.get("objectID", "")),
        title=d.get("title", ""), date=d.get("objectDate", ""), licence="Public domain" if pd else "Not public domain",
        is_open=pd, accession_date=str(d.get("accessionYear", "")), credit_line=d.get("creditLine", ""),
        record_url=d.get("objectURL", ""), image_url=d.get("primaryImageSmall", "") if pd else "")


def met_provenance(raw_html: str) -> Optional[str]:
    """The Met's open API has no provenance field; the object page ships it in its server-rendered payload."""
    s = raw_html.replace('\\"', '"')
    m = re.search(r'"name":"Provenance","body":.*?"__html":"(.*?)"\}', s, re.S)
    if not m:
        return None
    t = m.group(1)
    for a, b in (("\\u003c", "<"), ("\\u003e", ">"), ("\\u0026", "&")):
        t = t.replace(a, b)
    t = re.sub(r"<br\s*/?>", " ", t)
    t = re.sub(r"<[^>]+>", "", t)
    return re.sub(r"\s+", " ", t).strip() or None


# --------------------------------------------------------------------------- Art Institute of Chicago

AIC_FIELDS = "id,main_reference_number,title,date_display,is_public_domain,provenance_text,credit_line,image_id,fiscal_year"


def aic_by_reference(ref: str, fetch: Fetcher) -> Optional[Harvested]:
    q = {"query[term][main_reference_number]": ref, "fields": AIC_FIELDS, "limit": 5}
    data = fetch.get_json("https://api.artic.edu/api/v1/artworks/search?" + urllib.parse.urlencode(q)).get("data", [])
    hit = next((d for d in data if d.get("main_reference_number") == ref), None)
    return normalise_aic(hit) if hit else None


def normalise_aic(d: dict) -> Harvested:
    pd = bool(d.get("is_public_domain"))
    img = f"https://www.artic.edu/iiif/2/{d['image_id']}/full/843,/0/default.jpg" if pd and d.get("image_id") else ""
    return Harvested(
        holder="AIC", accession=d.get("main_reference_number", ""), source_id=str(d.get("id", "")),
        title=d.get("title", ""), date=d.get("date_display", ""), licence="Public domain" if pd else "Not public domain",
        is_open=pd, provenance_text=d.get("provenance_text") or "", accession_date=str(d.get("fiscal_year") or ""),
        credit_line=d.get("credit_line", ""), record_url=f"https://www.artic.edu/artworks/{d.get('id', '')}", image_url=img)


# --------------------------------------------------------------------------- the 1970 test

def _parse_when(s: str) -> Optional[date]:
    s = (s or "").strip()
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", s):
        y, m, d = map(int, s.split("-"))
        return date(y, m, d)
    if re.fullmatch(r"\d{4}", s):
        return date(int(s), 12, 31)  # a bare year counts only if the whole year is before the threshold
    return None


def provenance_test(h: Harvested, category: str = "archaeological", excavated: bool = False) -> tuple[str, str]:
    """Return (result, basis). category: archaeological | not-archaeological | colonial-era."""
    if category == "not-archaeological":
        return "n/a", "Not archaeological; the 1970 test does not apply"
    if excavated:
        return "pass", "Excavated with a record"
    acc = _parse_when(h.accession_date)
    if acc and acc < THRESHOLD:
        where = {"Cleveland": "Cleveland", "Met": "the Met", "AIC": "the Art Institute"}.get(h.holder, h.holder)
        return "pass", f"In {where} since {h.accession_date}"
    # earliest year mentioned in the provenance text, if it is dated before 1970
    years = [int(y) for y in re.findall(r"\b(1[5-9]\d\d)\b", h.provenance_text)]
    years += [int(d) + 9 for d in re.findall(r"\b(1[5-9]\d0)s\b", h.provenance_text)]  # "1960s" counts as 1969
    early = [y for y in years if y < 1970]
    if early:
        return "pass-caveat", f"Provenance mentions {min(early)}; confirm the object was outside its country of origin then"
    if category == "colonial-era":
        return "colonial-gap", "Made in a colonised region; collection circumstances not recorded"
    if not h.provenance_text:
        return "fail", "No provenance published and acquired after 1970"
    return "enquiry", "Provenance published but no step dated before 1970"


# --------------------------------------------------------------------------- register driver

def harvest_row(row: dict, fetch: Fetcher) -> Optional[Harvested]:
    holder, acc = row.get("holder", ""), row.get("accession", "")
    if holder == "Cleveland" and acc:
        h = cleveland_by_accession(acc, fetch)
    elif holder == "Met" and row.get("met_object_id"):
        h = met_by_object_id(int(row["met_object_id"]), fetch)
    elif holder == "AIC" and acc:
        h = aic_by_reference(acc, fetch)
    else:
        return None
    if h:
        cat = "not-archaeological" if row.get("provenance_test") == "n/a" else (
            "colonial-era" if row.get("provenance_test") == "colonial-gap" else "archaeological")
        h.test, h.test_basis = provenance_test(h, cat, excavated="xcavated" in row.get("test_basis", ""))
    return h


def diff(row: dict, h: Harvested) -> list[str]:
    """What changed since the register was last checked; these are what a human reviews."""
    out = []
    was_open = row.get("licence") in ("CC0", "Public domain")
    if was_open != h.is_open:
        out.append(f"licence changed: register says {row.get('licence')}, source says {h.licence}")
    if row.get("provenance_test") not in ("", "n/a") and h.test and h.test != row.get("provenance_test"):
        out.append(f"1970 test: register {row.get('provenance_test')} -> harvest {h.test} ({h.test_basis})")
    return out


def main(argv: list[str]) -> int:
    import argparse
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("register")
    ap.add_argument("--out", default="harvested.json")
    ap.add_argument("--only", nargs="*", help="register ids to harvest")
    a = ap.parse_args(argv)
    fetch = Fetcher()
    rows = list(csv.DictReader(open(a.register, encoding="utf-8")))
    results, report = {}, {}
    for row in rows:
        if a.only and row["id"] not in a.only:
            continue
        if row.get("kind") != "object":
            continue
        try:
            h = harvest_row(row, fetch)
        except Exception as e:  # keep going; one bad record should not stop a harvest
            report[row["id"]] = [f"error: {e}"]
            continue
        if h:
            results[row["id"]] = dict(asdict(h), licence_class=classify(h.licence))
            changes = diff(row, h)
            if changes:
                report[row["id"]] = changes
    json.dump({"harvested": results, "review": report}, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(results)} records harvested; {len(report)} need review -> {a.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

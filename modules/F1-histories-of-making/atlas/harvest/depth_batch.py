"""Depth-map batch for the F1 object lens, v0.

Reads the world-set register, keeps the open rows (CC0 or public domain) whose holder record gives an
open image URL, downloads each image, runs monocular depth estimation, and writes one 8-bit greyscale
PNG per object plus a manifest. The object page's 2.5D parallax beat reads these maps, so no model
runs in the learner's browser.

    python harvest/depth_batch.py data/register/world_set_specs_v1.csv --limit 40
    python harvest/depth_batch.py --fixture            # offline: synthetic image, stubbed pipeline

Outputs (relative to the atlas folder)
  data/derived/depth/<holder>_<accession>.png   relative depth, 8-bit greyscale, bright = near
  data/derived/depth/depth_manifest.csv         id, image_url, licence, depth_path, model, date
  data/derived/depth/depth_skipped.csv          id, holder, accession, reason   (why a row was not processed)
  reports/depth_errors.md                       written only when a step fails (the pattern of backbone.py)

Model
  depth-anything/Depth-Anything-V2-Small-hf   Apache 2.0 weights (verified on huggingface.co, 4 October 2026);
  the Base, Large and Giant variants are CC BY-NC and are never used here.

Rules carried from the F1 workflow
  * Licence per record: a row is processed only if the register says CC0 or public domain AND the holder's
    own record, fetched now, still says so (harvest.py's fetchers do that check and return image_url="" otherwise).
  * Holder records are fetched with harvest.py's polite fetchers (rate limits, User-Agent, retries).
  * Nothing is altered in the image; the depth map is a derived file and carries the image's licence.
  * Rows the fetchers do not cover (British Museum, Rijksmuseum, link-outs, held or excluded rows) are
    skipped with a reason, never guessed at.

Standard library for the driver and the fixture mode. The real run needs pillow, torch and transformers.
"""
from __future__ import annotations

import csv
import io
import os
import re
import struct
import sys
import time
import urllib.parse
import urllib.request
import zlib
from dataclasses import dataclass
from datetime import date, datetime, timezone
from typing import Callable, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(ROOT, "tools"))
import harvest as H  # noqa: E402
from licence_class import classify  # noqa: E402

MODEL_ID = "depth-anything/Depth-Anything-V2-Small-hf"
OUT_DIR = os.path.join(ROOT, "data", "derived", "depth")
ERRORS = os.path.join(ROOT, "reports", "depth_errors.md")
IMAGE_HOSTS = {"openaccess-cdn.clevelandart.org": 20, "images.metmuseum.org": 20, "www.artic.edu": 20}

# The register spells holders several ways; harvest.py knows three short names.
HOLDER_ALIASES = {
    "cleveland": "Cleveland", "cleveland museum of art": "Cleveland", "the cleveland museum of art": "Cleveland",
    "met": "Met", "the met": "Met", "the metropolitan museum of art": "Met", "metropolitan museum of art": "Met",
    "aic": "AIC", "art institute of chicago": "AIC", "the art institute of chicago": "AIC",
}
HOLDER_SLUG = {"Cleveland": "cleveland", "Met": "met", "AIC": "aic"}


# --------------------------------------------------------------------------- selection

def normalise_holder(name: str) -> Optional[str]:
    return HOLDER_ALIASES.get((name or "").strip().lower())


def select(row: dict) -> tuple[bool, str]:
    """Decide whether a register row is a candidate, and why not if it is not."""
    if row.get("kind", "object") != "object":
        return False, "not an object row"
    if row.get("status", "open") != "open":
        return False, f"status is {row.get('status')!r}, not open"
    if classify(row.get("licence", "")) != "PD-CC0":
        return False, f"licence {row.get('licence') or '(blank)'!r} is not CC0 or public domain"
    holder = normalise_holder(row.get("holder", ""))
    if not holder:
        return False, f"holder {row.get('holder') or '(blank)'!r} has no fetcher in harvest.py"
    if holder == "Met" and not row.get("met_object_id"):
        return False, "Met row without met_object_id"
    if holder != "Met" and not row.get("accession"):
        return False, "no accession number"
    return True, ""


def harvest_record(row: dict, fetch: H.Fetcher) -> Optional[H.Harvested]:
    """harvest.py's fetchers, keyed by the normalised holder; no provenance page for the Met (one call fewer)."""
    holder = normalise_holder(row.get("holder", ""))
    if holder == "Cleveland":
        return H.cleveland_by_accession(row["accession"], fetch)
    if holder == "Met":
        return H.met_by_object_id(int(row["met_object_id"]), fetch, with_provenance=False)
    if holder == "AIC":
        return H.aic_by_reference(row["accession"], fetch)
    return None


def depth_filename(holder: str, accession: str) -> str:
    acc = re.sub(r"[^A-Za-z0-9.\-]+", "-", accession.strip()).strip("-")
    return f"{HOLDER_SLUG.get(holder, holder.lower())}_{acc}.png"


# --------------------------------------------------------------------------- images

class ImageFetcher:
    """GET bytes politely: the same limiter and User-Agent as the record fetchers. `opener` is injectable."""

    def __init__(self, opener: Optional[Callable[[str], bytes]] = None):
        self.opener = opener or self._urlopen
        self.limiters = {h: H.RateLimiter(n) for h, n in IMAGE_HOSTS.items()}
        self.default = H.RateLimiter(10)

    @staticmethod
    def _urlopen(url: str) -> bytes:
        req = urllib.request.Request(url, headers={"User-Agent": H.USER_AGENT, "Accept": "image/*"})
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.read()

    def get(self, url: str) -> bytes:
        host = urllib.parse.urlparse(url).netloc
        self.limiters.get(host, self.default).wait(host)
        return self.opener(url)


def png_bytes(width: int, height: int, rows: list[bytes], colour_type: int) -> bytes:
    """A PNG from raw scanlines with the standard library: colour_type 0 = 8-bit grey, 2 = 8-bit RGB.
    Used by the fixture path; the real run lets PIL save the pipeline's own image."""
    def chunk(tag: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    raw = b"".join(b"\x00" + r for r in rows)
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, colour_type, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))


def synthetic_image(width: int = 96, height: int = 64) -> bytes:
    """A warm ground with a brighter disc in the middle: enough for a depth stub to find a 'near' object."""
    rows = []
    cx, cy, r = width / 2, height / 2, min(width, height) * 0.3
    for y in range(height):
        row = bytearray()
        for x in range(width):
            inside = (x - cx) ** 2 + (y - cy) ** 2 < r * r
            row += bytes((217, 162, 92) if inside else (60 + y // 2, 54 + y // 2, 46 + y // 2))
        rows.append(bytes(row))
    return png_bytes(width, height, rows, 2)


# --------------------------------------------------------------------------- the pipeline

@dataclass
class DepthResult:
    width: int
    height: int
    save: Callable[[str], None]


class StubPipeline:
    """Offline stand-in: depth = luminance of the synthetic image, bright disc read as near. No model, no network."""

    model_id = "stub (fixture mode; no model run)"

    def __call__(self, image_bytes: bytes) -> DepthResult:
        width, height = struct.unpack(">II", image_bytes[16:24])
        raw = zlib.decompress(image_bytes[image_bytes.index(b"IDAT") + 4: image_bytes.index(b"IEND") - 4])
        stride = width * 3 + 1
        rows = []
        for y in range(height):
            line = raw[y * stride + 1:(y + 1) * stride]
            rows.append(bytes(min(255, (line[i] * 299 + line[i + 1] * 587 + line[i + 2] * 114) // 1000) for i in range(0, len(line), 3)))

        def save(path: str, rows=rows) -> None:
            with open(path, "wb") as fh:
                fh.write(png_bytes(width, height, rows, 0))
        return DepthResult(width, height, save)


class HFPipeline:
    """transformers' depth-estimation pipeline on the Apache-2.0 Small weights; loaded once, lazily."""

    model_id = MODEL_ID

    def __init__(self) -> None:
        from transformers import pipeline  # type: ignore
        self.pipe = pipeline("depth-estimation", model=MODEL_ID)

    def __call__(self, image_bytes: bytes) -> DepthResult:
        from PIL import Image  # type: ignore
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        out = self.pipe(img)
        depth = out["depth"].convert("L")   # the pipeline's 8-bit relative depth, bright = near
        return DepthResult(depth.width, depth.height, depth.save)


# --------------------------------------------------------------------------- driver

def _rel(path: str) -> str:
    """Paths inside the atlas folder are recorded relative to it; anywhere else, as given."""
    ap = os.path.abspath(path)
    return ap[len(ROOT) + 1:].replace(os.sep, "/") if ap.startswith(ROOT + os.sep) else ap


def run(rows: list[dict], fetch: H.Fetcher, images: ImageFetcher, pipe, out_dir: str, limit: int = 0,
        force: bool = False, only: Optional[list[str]] = None, log: Callable[[str], None] = print) -> dict:
    os.makedirs(out_dir, exist_ok=True)
    today = date.today().isoformat()
    manifest_path = os.path.join(out_dir, "depth_manifest.csv")
    skipped_path = os.path.join(out_dir, "depth_skipped.csv")
    manifest: dict[str, dict] = {}
    if os.path.exists(manifest_path):
        with open(manifest_path, encoding="utf-8") as fh:
            manifest = {r["id"]: r for r in csv.DictReader(fh)}
    skipped: list[dict] = []
    done = 0
    for row in rows:
        rid = row.get("id", "")
        if only and rid not in only:
            continue
        ok, reason = select(row)
        if not ok:
            skipped.append({"id": rid, "holder": row.get("holder", ""), "accession": row.get("accession", ""), "reason": reason})
            continue
        holder = normalise_holder(row["holder"])
        fname = depth_filename(holder, row.get("accession") or row.get("met_object_id", ""))
        path = os.path.join(out_dir, fname)
        if os.path.exists(path) and not force and rid in manifest:
            continue  # already done; a monthly run only fills gaps
        if limit and done >= limit:
            skipped.append({"id": rid, "holder": row["holder"], "accession": row.get("accession", ""), "reason": f"over this run's --limit {limit}"})
            continue
        try:
            rec = harvest_record(row, fetch)
        except Exception as e:  # one bad record never stops the batch
            skipped.append({"id": rid, "holder": row["holder"], "accession": row.get("accession", ""), "reason": f"record fetch failed: {e}"})
            continue
        if rec is None:
            skipped.append({"id": rid, "holder": row["holder"], "accession": row.get("accession", ""), "reason": "holder record not found"})
            continue
        if not rec.is_open or not rec.image_url:
            skipped.append({"id": rid, "holder": row["holder"], "accession": row.get("accession", ""),
                            "reason": f"holder record gives no open image URL (licence now {rec.licence or 'blank'!r})"})
            continue
        try:
            data = images.get(rec.image_url)
            result = pipe(data)
            result.save(path)
        except Exception as e:
            skipped.append({"id": rid, "holder": row["holder"], "accession": row.get("accession", ""), "reason": f"depth failed: {e}"})
            continue
        manifest[rid] = {"id": rid, "image_url": rec.image_url, "licence": rec.licence,
                         "depth_path": _rel(path),
                         "model": getattr(pipe, "model_id", MODEL_ID), "date": today}
        done += 1
        log(f"{rid}: {fname} ({result.width}x{result.height})")
    with open(manifest_path, "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=["id", "image_url", "licence", "depth_path", "model", "date"])
        w.writeheader()
        for rid in sorted(manifest):
            w.writerow(manifest[rid])
    with open(skipped_path, "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=["id", "holder", "accession", "reason"])
        w.writeheader()
        w.writerows(skipped)
    log(f"{done} depth maps written this run; {len(manifest)} in the manifest; {len(skipped)} rows skipped -> {os.path.relpath(out_dir, ROOT)}")
    return {"done": done, "manifest": manifest, "skipped": skipped}


# --------------------------------------------------------------------------- fixture mode

FIXTURE_ROWS = [
    {"id": "FX-01", "kind": "object", "status": "open", "holder": "Cleveland Museum of Art", "accession": "1952.115", "licence": "CC0"},
    {"id": "FX-02", "kind": "object", "status": "open", "holder": "The Met", "accession": "1988.433.1", "licence": "Public domain", "met_object_id": "329081"},
    {"id": "FX-03", "kind": "object", "status": "open", "holder": "Art Institute of Chicago", "accession": "1986.1043", "licence": "Public domain (CC0 image)"},
    {"id": "FX-04", "kind": "object", "status": "open", "holder": "British Museum", "accession": "1887,0516.1", "licence": "Not open"},
    {"id": "FX-05", "kind": "object", "status": "link-out", "holder": "Rijksmuseum", "accession": "SK-A-1", "licence": "CC0"},
    {"id": "FX-06", "kind": "object", "status": "open", "holder": "Met", "accession": "2002.201.110", "licence": "Public domain"},
    {"id": "FX-07", "kind": "object", "status": "open", "holder": "Cleveland", "accession": "1935.306", "licence": "To check"},
    {"id": "FX-08", "kind": "object", "status": "open", "holder": "Rijksmuseum", "accession": "SK-A-2", "licence": "CC0"},
]


def fixture_opener(url: str) -> str:
    """Record responses shaped like the live APIs, for the fixture run. Cleveland's mirrors the 1952.115 record
    as read on 4 October 2026; the AIC one is a not-public-domain record, to exercise the skip path."""
    import json
    u = urllib.parse.urlparse(url)
    q = urllib.parse.parse_qs(u.query)
    if u.netloc == "openaccess-api.clevelandart.org":
        acc = q["q"][0]
        return json.dumps({"data": [{"id": 129223, "accession_number": acc, "title": "Belt Buckle with Animals",
                                     "creation_date": "202 BCE–9 CE", "share_license_status": "CC0", "creditline": "John L. Severance Fund",
                                     "accession_date": "1952-04-28T00:00:00", "url": "https://clevelandart.org/art/" + acc,
                                     "provenance": [{"description": "(Dr. Vladimir G. Simkhovitch [1874–1959], New York, NY, sold to the Cleveland Museum of Art)", "date": "?–1952"},
                                                    {"description": "The Cleveland Museum of Art, Cleveland, OH", "date": "1952–"}],
                                     "images": {"web": {"url": f"https://openaccess-cdn.clevelandart.org/{acc}/{acc}_web.jpg", "width": 1263, "height": 814}}}]})
    if u.netloc == "collectionapi.metmuseum.org":
        return json.dumps({"objectID": 329081, "accessionNumber": "1988.433.1", "isPublicDomain": True, "title": "Proto-cuneiform tablet",
                           "objectDate": "ca. 3100–2900 BCE", "accessionYear": "1988", "creditLine": "Purchase, Raymond and Beverly Sackler Gift, 1988",
                           "objectURL": "https://www.metmuseum.org/art/collection/search/329081",
                           "primaryImageSmall": "https://images.metmuseum.org/CRDImages/an/web-large/DP293243.jpg"})
    if u.netloc == "api.artic.edu":
        return json.dumps({"data": [{"id": 1, "main_reference_number": "1986.1043", "title": "test", "is_public_domain": False, "image_id": "x"}]})
    raise AssertionError(f"fixture mode has no record for {url}")


def fixture_run(out_dir: str, log: Callable[[str], None] = print) -> dict:
    fetch = H.Fetcher(opener=fixture_opener)
    for lim in list(fetch.limiters.values()) + [fetch.default]:
        lim.sleep = lambda s: None
    png = synthetic_image()
    images = ImageFetcher(opener=lambda url: png)
    for lim in list(images.limiters.values()) + [images.default]:
        lim.sleep = lambda s: None
    return run(FIXTURE_ROWS, fetch, images, StubPipeline(), out_dir, log=log)


# --------------------------------------------------------------------------- errors, as backbone.py records them

def _record_error(cmd: str, exc: BaseException) -> None:
    """A failed batch is written where the pull request will show it, not only to a runner log nobody can open."""
    import traceback
    os.makedirs(os.path.dirname(ERRORS), exist_ok=True)
    first = not os.path.exists(ERRORS)
    with open(ERRORS, "a", encoding="utf-8") as fh:
        if first:
            fh.write("# Depth batch errors\n\nOne entry per failed run, newest last. Delete this file once the cause is fixed.\n")
        fh.write(f"\n## {cmd} · {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}\n\n")
        detail = getattr(exc, "reason", None) or getattr(exc, "code", None)
        fh.write(f"{type(exc).__name__}: {exc}" + (f" ({detail})" if detail else "") + "\n\n```\n")
        fh.write("".join(traceback.format_exception(type(exc), exc, exc.__traceback__))[-3000:])
        fh.write("```\n")


def main(argv: list[str]) -> int:
    import argparse
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("register", nargs="?", default=os.path.join(ROOT, "data", "register", "world_set_specs_v1.csv"))
    ap.add_argument("--out-dir", default=OUT_DIR)
    ap.add_argument("--limit", type=int, default=0, help="depth maps to compute this run (0 = all)")
    ap.add_argument("--only", nargs="*", help="register ids to process")
    ap.add_argument("--force", action="store_true", help="recompute maps that already exist")
    ap.add_argument("--fixture", action="store_true", help="offline: synthetic image, stubbed pipeline, no network")
    a = ap.parse_args(argv)
    if a.fixture:
        import tempfile
        out = a.out_dir if a.out_dir != OUT_DIR else tempfile.mkdtemp(prefix="depth_fixture_")  # never inside the repository
        r = fixture_run(out)
        return 0 if r["done"] else 1
    with open(a.register, encoding="utf-8") as fh:
        rows = list(csv.DictReader(fh))
    run(rows, H.Fetcher(), ImageFetcher(), HFPipeline(), a.out_dir, limit=a.limit, force=a.force, only=a.only)
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main(sys.argv[1:]))
    except SystemExit:
        raise
    except BaseException as e:  # noqa: BLE001 - any failure is recorded for the pull request, then re-raised
        _record_error("depth_batch " + " ".join(sys.argv[1:]), e)
        raise

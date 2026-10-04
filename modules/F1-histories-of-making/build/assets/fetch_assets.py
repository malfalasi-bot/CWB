#!/usr/bin/env python3
"""Fetch open-licence images listed in a manifest and save web-sized copies beside it.

Usage: fetch_assets.py <manifest.csv> [--max 1600]
Writes <id>.jpg (longest side <= max px, quality 85) and <id>.thumb.jpg (longest side 480) next to the
manifest, plus fetch_report.csv (id, status, bytes, width, height). Only rows whose licence column starts
with CC0, "Public domain" or "CC BY" are fetched; the rest are reported as skipped. Runs in GitHub Actions,
which has the network this project's authoring shell lacks.
"""
import csv, io, sys, time, urllib.request
from pathlib import Path

from PIL import Image

OPEN = ("cc0", "public domain", "cc by", "pd")


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__); sys.exit(2)
    manifest = Path(args[0]); out = manifest.parent
    mx = 1600
    if "--max" in args:
        mx = int(args[args.index("--max") + 1])
    rows = list(csv.DictReader(open(manifest, encoding="utf-8")))
    report = []
    for r in rows:
        lic = (r.get("licence") or "").strip().lower()
        if not lic.startswith(OPEN):
            report.append((r["id"], "skipped: licence not open", 0, 0, 0)); continue
        try:
            req = urllib.request.Request(r["url"], headers={"User-Agent": "creative-world-f1-assets/1.0 (open-access fetch)"})
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = resp.read()
            im = Image.open(io.BytesIO(data)).convert("RGB")
            w, h = im.size
            for suffix, side in ((".jpg", mx), (".thumb.jpg", 480)):
                c = im.copy(); c.thumbnail((side, side), Image.LANCZOS)
                c.save(out / f"{r['id']}{suffix}", "JPEG", quality=85, optimize=True, progressive=True)
            report.append((r["id"], "ok", len(data), w, h))
            print("ok", r["id"], w, h, len(data))
        except Exception as e:  # noqa: BLE001
            report.append((r["id"], f"error: {e}", 0, 0, 0)); print("error", r["id"], e)
        time.sleep(1.0)
    with open(out / "fetch_report.csv", "w", newline="", encoding="utf-8") as f:
        wr = csv.writer(f); wr.writerow(["id", "status", "source_bytes", "source_w", "source_h"]); wr.writerows(report)


if __name__ == "__main__":
    main()

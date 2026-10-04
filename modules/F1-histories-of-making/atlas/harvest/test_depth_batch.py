"""Offline tests for depth_batch.py: the fixture mode (synthetic image, stubbed pipeline, no network) and the
selection rules. Run from this folder: python test_depth_batch.py"""
import csv
import os
import shutil
import struct
import tempfile
import unittest
import zlib

import depth_batch as D


def read_png_grey(path):
    data = open(path, "rb").read()
    assert data[:8] == b"\x89PNG\r\n\x1a\n"
    w, h, depth, ctype = struct.unpack(">IIBB", data[16:26])
    raw = zlib.decompress(data[data.index(b"IDAT") + 4: data.index(b"IEND") - 4])
    return w, h, depth, ctype, raw


class TestSelection(unittest.TestCase):
    def test_holder_spellings_normalise(self):
        for name in ("Cleveland", "Cleveland Museum of Art", "the cleveland museum of art"):
            self.assertEqual(D.normalise_holder(name), "Cleveland")
        for name in ("Met", "The Met", "The Metropolitan Museum of Art"):
            self.assertEqual(D.normalise_holder(name), "Met")
        self.assertEqual(D.normalise_holder("Art Institute of Chicago"), "AIC")
        self.assertIsNone(D.normalise_holder("British Museum"))

    def test_only_open_cc0_rows_with_a_fetcher(self):
        ok, _ = D.select({"kind": "object", "status": "open", "holder": "Cleveland", "accession": "1952.115", "licence": "CC0"})
        self.assertTrue(ok)
        for row, why in (
            ({"kind": "object", "status": "link-out", "holder": "Cleveland", "accession": "x", "licence": "CC0"}, "status"),
            ({"kind": "object", "status": "open", "holder": "Cleveland", "accession": "x", "licence": "Not open"}, "licence"),
            ({"kind": "object", "status": "open", "holder": "Cleveland", "accession": "x", "licence": "To check"}, "licence"),
            ({"kind": "object", "status": "open", "holder": "British Museum", "accession": "x", "licence": "CC0"}, "fetcher"),
            ({"kind": "object", "status": "open", "holder": "The Met", "accession": "x", "licence": "Public domain"}, "met_object_id"),
            ({"kind": "claim", "status": "open", "holder": "Cleveland", "accession": "x", "licence": "CC0"}, "object"),
        ):
            ok, reason = D.select(row)
            self.assertFalse(ok, row)
            self.assertIn(why, reason)

    def test_depth_filename_is_safe(self):
        self.assertEqual(D.depth_filename("Cleveland", "1952.115"), "cleveland_1952.115.png")
        self.assertEqual(D.depth_filename("Met", "24.174.7"), "met_24.174.7.png")
        self.assertEqual(D.depth_filename("AIC", "1999.556 a/b"), "aic_1999.556-a-b.png")

    def test_register_rows_select_as_expected(self):
        reg = os.path.join(D.ROOT, "data", "register", "world_set_specs_v1.csv")
        with open(reg, encoding="utf-8") as fh:
            rows = list(csv.DictReader(fh))
        chosen = [r for r in rows if D.select(r)[0]]
        self.assertGreater(len(chosen), 150)                         # most open Cleveland, Met and AIC rows qualify
        self.assertIn("F1.25-O01", [r["id"] for r in chosen])          # the buckle
        self.assertNotIn("F1.25-O08", [r["id"] for r in chosen])       # excluded Met spare
        self.assertNotIn("F1.1-O07", [r["id"] for r in chosen])        # British Museum link-out


class TestFixtureRun(unittest.TestCase):
    def setUp(self):
        self.out = tempfile.mkdtemp(prefix="depth_fixture_")

    def tearDown(self):
        shutil.rmtree(self.out, ignore_errors=True)

    def test_fixture_writes_maps_manifest_and_skips(self):
        logged = []
        r = D.fixture_run(self.out, log=logged.append)
        self.assertEqual(r["done"], 2)                                 # Cleveland CC0 and Met public domain
        self.assertEqual(sorted(r["manifest"]), ["FX-01", "FX-02"])
        m = r["manifest"]["FX-01"]
        self.assertEqual(m["image_url"], "https://openaccess-cdn.clevelandart.org/1952.115/1952.115_web.jpg")
        self.assertEqual(m["licence"], "CC0")
        self.assertTrue(m["depth_path"].endswith("cleveland_1952.115.png"))
        self.assertIn("stub", m["model"])
        # the PNG is 8-bit greyscale, the synthetic image's size, with the disc brighter (nearer) than the ground
        w, h, bits, ctype, raw = read_png_grey(os.path.join(self.out, "cleveland_1952.115.png"))
        self.assertEqual((w, h, bits, ctype), (96, 64, 8, 0))
        stride = w + 1
        centre = raw[32 * stride + 1 + 48]
        corner = raw[2 * stride + 1 + 2]
        self.assertGreater(centre, corner)
        # every unprocessed row has a reason
        reasons = {s["id"]: s["reason"] for s in r["skipped"]}
        self.assertEqual(sorted(reasons), ["FX-03", "FX-04", "FX-05", "FX-06", "FX-07", "FX-08"])
        self.assertIn("no open image URL", reasons["FX-03"])          # AIC record says not public domain
        self.assertIn("licence", reasons["FX-04"])                    # British Museum, not open
        self.assertIn("no fetcher", reasons["FX-08"])                 # Rijksmuseum CC0, but no fetcher yet
        self.assertIn("status", reasons["FX-05"])
        self.assertIn("met_object_id", reasons["FX-06"])
        self.assertIn("licence", reasons["FX-07"])
        # manifest and skip files on disk, with the required columns
        with open(os.path.join(self.out, "depth_manifest.csv"), encoding="utf-8") as fh:
            rows = list(csv.DictReader(fh))
        self.assertEqual(list(rows[0].keys()), ["id", "image_url", "licence", "depth_path", "model", "date"])
        self.assertEqual(len(rows), 2)
        self.assertTrue(os.path.exists(os.path.join(self.out, "depth_skipped.csv")))

    def test_second_run_fills_only_gaps(self):
        D.fixture_run(self.out, log=lambda s: None)
        r = D.fixture_run(self.out, log=lambda s: None)
        self.assertEqual(r["done"], 0)
        self.assertEqual(len(r["manifest"]), 2)


if __name__ == "__main__":
    unittest.main(verbosity=2)

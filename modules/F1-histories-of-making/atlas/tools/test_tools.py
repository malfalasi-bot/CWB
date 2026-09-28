"""Offline tests for the tools. Run: python -m pytest -q tools harvest  (or python tools/test_tools.py)"""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(__file__))
from licence_class import allowed, classify  # noqa: E402
from validate_canon import check_row  # noqa: E402
from codes import HEADER  # noqa: E402
from coverage import bands_for  # noqa: E402


def row(**kw):
    r = {h: "" for h in HEADER}
    r.update(id="X001", name="Test", kind="technique", tier="R3", confidence="high", sensitivity="none")
    r.update(kw)
    return r


class Licence(unittest.TestCase):
    def test_classes(self):
        self.assertEqual(classify("CC0"), "PD-CC0")
        self.assertEqual(classify("Public domain"), "PD-CC0")
        self.assertEqual(classify("Not public domain"), "LINK-ONLY")
        self.assertEqual(classify("CC BY-NC-SA 4.0"), "PERMISSION-NC")
        self.assertEqual(classify("CC BY-SA 3.0"), "ATTRIBUTION")
        self.assertEqual(classify("KOGL Type 1"), "NATIONAL-OPEN")
        self.assertEqual(classify("CC BY-ND 4.0"), "LINK-ONLY")
        self.assertEqual(classify(""), "LINK-ONLY")

    def test_switch(self):
        self.assertEqual(allowed("PD-CC0", "commercial"), "host")
        self.assertEqual(allowed("PERMISSION-NC", "open", has_grant=True), "host")
        self.assertEqual(allowed("PERMISSION-NC", "commercial", has_grant=True), "link")
        self.assertEqual(allowed("LINK-ONLY", "open"), "link")


class Validate(unittest.TestCase):
    def test_good(self):
        e, w = check_row(row(sub_regions="AF-GUI", start="-500", end="200", world="F1.6"))
        self.assertEqual(e, [])

    def test_bad_code_and_dates(self):
        e, _ = check_row(row(sub_regions="AF-XXX", start="200", end="-500"))
        self.assertTrue(any("sub-region" in m for m in e))
        self.assertTrue(any("start after end" in m for m in e))

    def test_human_flow_lint(self):
        _, w = check_row(row(making_significance="Enslaved potters made these jars."))
        self.assertTrue(any("human-flow" in m for m in w))
        _, w = check_row(row(making_significance="Enslaved potters made these jars.", sensitivity="human-flow"))
        self.assertFalse(any("human-flow" in m for m in w))

    def test_leaves_out_required(self):
        e, _ = check_row(row(kind="polity"))
        self.assertTrue(any("leaves_out" in m for m in e))


class Coverage(unittest.TestCase):
    def test_bands(self):
        self.assertEqual(bands_for(-2600, -1900), ["B03", "B04"])
        self.assertEqual(bands_for(1950, 2100), ["B11"])


if __name__ == "__main__":
    unittest.main()

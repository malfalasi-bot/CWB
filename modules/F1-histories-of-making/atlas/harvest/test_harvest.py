"""Offline tests for harvest.py. Fixtures are real responses saved on 2026-09-28 (trimmed), except met_not_pd.json,
which is shaped like the real API to test the negative path."""
import json
import os
import unittest
import urllib.parse

import harvest as H

FX = os.path.join(os.path.dirname(__file__), "fixtures")


def fx(name):
    with open(os.path.join(FX, name), encoding="utf-8") as f:
        return f.read()


class FakeOpener:
    """Maps URLs to fixture files and records every call."""

    def __init__(self):
        self.calls = []

    def __call__(self, url):
        self.calls.append(url)
        u = urllib.parse.urlparse(url)
        q = urllib.parse.parse_qs(u.query)
        if u.netloc == "openaccess-api.clevelandart.org":
            return fx(f"cma_{q['q'][0]}.json")
        if u.netloc == "collectionapi.metmuseum.org":
            oid = u.path.rsplit("/", 1)[-1]
            return fx("met_329081.json" if oid == "329081" else "met_not_pd.json")
        if u.netloc == "www.metmuseum.org":
            return fx(f"met_{u.path.rsplit('/', 1)[-1]}_page.html")
        if u.netloc == "api.artic.edu":
            return fx("aic_1986.1043.json")
        raise AssertionError(f"unexpected URL {url}")


def fetcher(opener=None):
    f = H.Fetcher(opener=opener or FakeOpener())
    for lim in list(f.limiters.values()) + [f.default]:
        lim.sleep = lambda s: None  # no real waiting in tests
    return f


class TestRateLimiter(unittest.TestCase):
    def test_spaces_calls_per_host(self):
        t = [0.0]
        slept = []
        rl = H.RateLimiter(per_minute=10, clock=lambda: t[0], sleep=lambda s: slept.append(s))
        self.assertEqual(rl.wait("a"), 0.0)          # first call goes at once
        self.assertAlmostEqual(rl.wait("a"), 6.0)    # second waits the full interval
        self.assertEqual(rl.wait("b"), 0.0)          # another host is independent
        t[0] = 100.0
        self.assertEqual(rl.wait("a"), 0.0)          # after a long gap, no wait
        self.assertEqual(slept, [6.0])


class TestCleveland(unittest.TestCase):
    def test_exact_accession_match_not_fuzzy(self):
        h = H.cleveland_by_accession("1957.36", fetcher())
        self.assertEqual(h.accession, "1957.36")   # not 1957.36.b, which the fuzzy search also returns
        self.assertEqual(h.provenance_text, "Men-chu Wang, Seller's no. 12")

    def test_licence_checked_per_record(self):
        h = H.cleveland_by_accession("1970.16", fetcher())
        self.assertTrue(h.is_open)
        self.assertEqual(h.licence, "CC0")
        self.assertTrue(h.record_url.endswith("1970.16"))

    def test_1970_test_on_accession_date(self):
        h = H.cleveland_by_accession("1970.16", fetcher())
        self.assertEqual(H.provenance_test(h)[0], "pass")   # accessioned 9 March 1970
        h = H.cleveland_by_accession("1980.102", fetcher())
        self.assertEqual(H.provenance_test(h)[0], "fail")   # no provenance, acquired 1980

    def test_colonial_era_screen(self):
        h = H.cleveland_by_accession("2015.156", fetcher())
        self.assertEqual(H.provenance_test(h, "colonial-era")[0], "colonial-gap")


class TestMet(unittest.TestCase):
    def test_public_domain_and_provenance_from_page(self):
        h = H.met_by_object_id(329081, fetcher())
        self.assertTrue(h.is_open)
        self.assertEqual(h.accession, "1988.433.1")
        self.assertIn("Erlenmeyer", h.provenance_text)
        self.assertIn("lot 21", h.provenance_text)

    def test_provenance_parser_on_real_pages(self):
        self.assertEqual(
            H.met_provenance(fx("met_675980_page.html")),
            "[André Emmerich Gallery, New York, 1960s]; Guido and Nelly di Tella, Buenos Aires, "
            "ca. 1960s–2013; Claudia Quentin, New York, 2013–2021")
        self.assertIn("Brugsch", H.met_provenance(fx("met_444375_page.html")))
        self.assertIsNone(H.met_provenance("<html>no tabs here</html>"))

    def test_not_public_domain_gets_no_image(self):
        h = H.normalise_met(json.loads(fx("met_not_pd.json")))
        self.assertFalse(h.is_open)
        self.assertEqual(h.image_url, "")

    def test_bracketed_1960s_step_is_a_caveat(self):
        h = H.Harvested(holder="Met", accession="2021.146", source_id="675980", accession_date="2021",
                        provenance_text=H.met_provenance(fx("met_675980_page.html")))
        # "1960s" has no four-digit year before 1970 on its own; the test must not pass it silently
        self.assertEqual(H.provenance_test(h)[0], "pass-caveat")


class TestAIC(unittest.TestCase):
    def test_not_public_domain_flagged(self):
        h = H.aic_by_reference("1986.1043", fetcher())
        self.assertFalse(h.is_open)
        self.assertEqual(h.image_url, "")


class TestDriver(unittest.TestCase):
    def test_diff_reports_licence_and_test_changes(self):
        row = {"id": "WS-X", "kind": "object", "holder": "Cleveland", "accession": "1980.102",
               "licence": "CC0", "provenance_test": "pass", "test_basis": ""}
        h = H.harvest_row(row, fetcher())
        changes = H.diff(row, h)
        self.assertTrue(any("1970 test" in c for c in changes))
        self.assertFalse(any("licence" in c for c in changes))

    def test_not_archaeological_is_na(self):
        row = {"id": "WS-Y", "kind": "object", "holder": "Cleveland", "accession": "1957.36",
               "licence": "CC0", "provenance_test": "n/a", "test_basis": ""}
        self.assertEqual(H.harvest_row(row, fetcher()).test, "n/a")

    def test_one_call_per_record_plus_page_for_met(self):
        op = FakeOpener()
        H.met_by_object_id(329081, fetcher(op))
        self.assertEqual(len(op.calls), 2)


if __name__ == "__main__":
    unittest.main(verbosity=2)

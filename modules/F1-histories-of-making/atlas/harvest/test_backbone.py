"""Offline tests for backbone.py. Fixtures under fixtures/backbone/ are real responses read on 2026-10-04 (trimmed):
the Wikidata SPARQL rows, one PeriodO authority (p05krdx) in the dataset's shape, four Pleiades places in the legacy
dump's column layout, and the Getty AAT/TGN responses for "Art Nouveau" and "Carthage"."""
import csv
import gzip
import io
import json
import os
import tempfile
import unittest
import urllib.parse
import zipfile

import backbone as B

FX = os.path.join(os.path.dirname(__file__), "fixtures", "backbone")
WD = os.path.join(FX, "wikidata_movements.json")
PO = os.path.join(FX, "periodo_dataset.json")
PL = os.path.join(FX, "pleiades_places_sample.csv")
GT = os.path.join(FX, "getty_responses.json")


def by(rows, key, value):
    return next(r for r in rows if r[key] == value)


def load(path, mode="r"):
    with open(path, mode, **({"encoding": "utf-8"} if mode == "r" else {})) as f:
        return json.load(f) if path.endswith(".json") else f.read()


class TestYears(unittest.TestCase):
    def test_wikidata_rdf_shifts_bce_by_one(self):
        self.assertEqual(B.wd_year("-0899-01-01T00:00:00Z"), -900)   # 900 BCE in Wikidata's JSON
        self.assertEqual(B.wd_year("1890-01-01T00:00:00Z"), 1890)
        self.assertEqual(B.wd_year("0000-01-01T00:00:00Z"), -1)
        self.assertIsNone(B.wd_year(""))

    def test_periodo_gyear_to_canon(self):
        self.assertEqual(B.gyear("-0899"), -899)
        self.assertEqual(B.astro_to_canon(-899), -900)
        self.assertEqual(B.astro_to_canon(0), -1)
        self.assertEqual(B.astro_to_canon(1453), 1453)
        self.assertIsNone(B.gyear("ca. 900 B.C."))


class TestMovements(unittest.TestCase):
    def test_fixture_rows_and_date_preference(self):
        rows = B.harvest_movements(fixture=WD)
        self.assertEqual(len(rows), 10)
        an = by(rows, "qid", "Q34636")
        self.assertEqual(an["label_en"], "Art Nouveau")
        self.assertEqual(an["aat_id"], "300021430")
        self.assertEqual(an["inception_year"], 1890)   # P571 preferred over P580 (1880)
        self.assertEqual(an["end_year"], 1910)         # P582, since there is no P576
        self.assertEqual(an["enwiki"], "https://en.wikipedia.org/wiki/Art_Nouveau")
        self.assertEqual(by(rows, "qid", "Q124354")["end_year"], 1933)   # Bauhaus: P576
        geo = by(rows, "qid", "Q852337")
        self.assertEqual((geo["inception_year"], geo["end_year"]), (-900, -751))
        self.assertIn("Q207103", by(rows, "qid", "Q207445")["influenced_by"])
        self.assertEqual(by(rows, "qid", "Q1273221")["aat_id"], "")

    def test_limit(self):
        self.assertEqual(len(B.harvest_movements(limit=3, fixture=WD)), 3)

    def test_paged_queries_per_class(self):
        fx = load(WD)["results"]["bindings"]
        calls = []

        def opener(url):
            q = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)["query"][0]
            calls.append(q)
            if "wd:Q968159" in q:
                page = fx[:2] if "OFFSET 0 " in q else fx[2:3]
            else:
                page = []
            return json.dumps({"results": {"bindings": page}}).encode("utf-8")

        old = B.WD_PAGE
        B.WD_PAGE = 2
        try:
            rows = B.harvest_movements(opener=opener, pause=0)
        finally:
            B.WD_PAGE = old
        self.assertEqual(len(rows), 3)
        self.assertEqual(rows[0]["wd_classes"], "Q968159 art movement")
        self.assertTrue(any("wdt:P31/wdt:P279* wd:Q968159" in q and "OFFSET 2 " in q for q in calls))
        self.assertTrue(any("wdt:P31/wdt:P279* wd:Q32880" in q for q in calls))
        self.assertTrue(any("?item wdt:P31 wd:Q1792644" in q for q in calls))   # art style: direct instances only
        self.assertFalse(any("wdt:P279* wd:Q1792644" in q for q in calls))
        self.assertTrue(all("wdt:P1014" in q and "wdt:P737" in q and "wdt:P495|wdt:P17" in q for q in calls))


class TestPeriods(unittest.TestCase):
    def test_fixture_rows(self):
        rows = B.harvest_periods(fixture=PO)
        self.assertEqual(len(rows), 9)
        geo = by(rows, "periodo_id", "p05krdx2khc")
        self.assertEqual(geo["label"], "Geometric Period")
        self.assertEqual((geo["start_earliest"], geo["start_latest"], geo["stop_earliest"], geo["stop_latest"]), (-899, -899, -699, -699))
        self.assertIn("Sandy Pylos", geo["authority"])
        self.assertTrue(geo["authority"].endswith("page 308"))
        self.assertEqual(geo["spatial_coverage"], "Messenia")
        self.assertEqual(geo["language"], "en")
        self.assertEqual(geo["uri"], "http://n2t.net/ark:/99152/p05krdx2khc")
        myc = by(rows, "periodo_id", "p05krdxpb2m")   # a range on both ends
        self.assertEqual((myc["start_earliest"], myc["start_latest"]), (-1699, -1600))
        self.assertEqual(myc["start_label"], "seventeenth century B.C.")

    def test_citation_shapes(self):
        self.assertEqual(B.citation({"citation": "Salazar, J. (2017). The yungas."}), "Salazar, J. (2017). The yungas.")
        nested = {"partOf": {"title": "Life in biblical Israel", "yearPublished": 2001, "creators": [{"name": "King, Philip"}]}, "locator": "page 25"}
        self.assertEqual(B.citation(nested), "King, Philip. Life in biblical Israel. 2001, page 25")
        self.assertEqual(B.citation({"id": "http://www.worldcat.org/oclc/37663433"}), "http://www.worldcat.org/oclc/37663433")

    def test_single_authority_file_and_limit(self):
        auth = load(PO)["authorities"]["p05krdx"]
        self.assertEqual(len(B.period_rows(auth)), 9)
        self.assertEqual(len(B.period_rows(auth, limit=4)), 4)


class TestPlaces(unittest.TestCase):
    def test_legacy_csv(self):
        rows = B.harvest_places(fixture=PL)
        self.assertEqual(len(rows), 4)
        pom = by(rows, "pleiades_id", "433032")
        self.assertEqual(pom["title"], "Pompeii")
        self.assertEqual(pom["place_types"], "urban; settlement")
        self.assertEqual((pom["lat"], pom["lon"]), ("40.74941", "14.485429"))
        self.assertEqual(pom["time_periods"], "A; C; H; R")
        self.assertEqual((pom["period_start"], pom["period_end"]), (-1000, 300))
        self.assertEqual(pom["uri"], "https://pleiades.stoa.org/places/433032")
        gal = by(rows, "pleiades_id", "993")
        self.assertEqual((gal["time_periods"], gal["period_start"]), ("", ""))

    def test_gzip_and_limit(self):
        raw = gzip.compress(load(PL, "rb"))
        rows = B.place_rows(raw, "pleiades-places-latest.csv.gz", limit=2)
        self.assertEqual([r["title"] for r in rows], ["Pompeii", "Carthago"])

    def test_gis_package_zip(self):
        places = ("﻿created,description,details,provenance,title,uri,id,representative_latitude,representative_longitude,bounding_box_wkt,location_precision\r\n"
                  '2021-11-14T03:44:08Z,"An ancient region.", The Barrington Atlas Directory notes: FRA,Barrington Atlas: BAtlas 1 D1 Gallia,Gallia,https://pleiades.stoa.org/places/993,993,46.360953305773286,1.6706144893053327,"POLYGON ((9.6708805 31.937048, 9.6708805 51.9019, -19.665682 51.9019, -19.665682 31.937048, 9.6708805 31.937048))",rough\r\n')
        types = "﻿place_id,place_type\r\n993,region\r\n993,people\r\n"
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w") as z:
            z.writestr("pleiades_gis_data/places.csv", places.encode("utf-8"))
            z.writestr("pleiades_gis_data/places_place_types.csv", types.encode("utf-8"))
        rows = B.place_rows(buf.getvalue(), "pleiades_gis_data.zip")
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["pleiades_id"], "993")
        self.assertEqual(rows[0]["place_types"], "region; people")
        self.assertEqual(rows[0]["lat"], "46.360953305773286")
        self.assertEqual(rows[0]["uri"], "https://pleiades.stoa.org/places/993")
        self.assertEqual(rows[0]["time_periods"], "")   # the GIS package carries no time periods


class TestGetty(unittest.TestCase):
    def test_query_forms(self):
        q = B.aat_query("Art Nouveau")
        self.assertIn('luc:term "Art Nouveau"', q)
        self.assertIn("skos:inScheme aat:", q)
        self.assertIn("gvp:prefLabelGVP [xl:literalForm ?Term]", q)
        t = B.tgn_query("Carthage")
        self.assertIn("skos:inScheme tgn:", t)
        self.assertIn("coalesce(?labEn,?labGVP)", t)
        self.assertIn("gvp:placeTypePreferred", t)
        self.assertEqual(B.search_term("Set Maat (Deir el-Medina)"), "Set Maat")

    def test_lookup_ranks_by_similarity(self):
        hits = B.getty_lookup("Art Nouveau", "aat", fixture=load(GT))
        self.assertEqual([h["getty_id"] for h in hits], ["aat:300021430", "aat:300403932", "aat:300112105"])
        self.assertEqual(hits[0]["similarity"], 1.0)
        self.assertEqual(hits[0]["rank"], 1)
        self.assertEqual(hits[0]["getty_uri"], "http://vocab.getty.edu/aat/300021430")

    def test_live_url_form_with_fake_opener(self):
        calls = []

        def opener(url):
            calls.append(url)
            return json.dumps(load(GT)["tgn"]["Carthage"]).encode("utf-8")

        hits = B.getty_lookup("Carthage", "tgn", opener=opener)
        self.assertTrue(calls[0].startswith(B.GETTY_SPARQL_JSON + "?query="))
        self.assertEqual(len(hits), 3)
        self.assertTrue(all(h["pref_label"] == "Carthage" for h in hits))
        self.assertIn("South Dakota", hits[0]["parents"])          # the person needs the parent string to choose
        self.assertEqual(hits[0]["place_type"], "inhabited places")

    def test_harvest_marks_rows_without_hits_as_done(self):
        rows = B.harvest_getty(limit=1000, kinds=["style", "place"], fixture=GT)
        sty = [r for r in rows if r["canon_id"] == "STY036"]
        self.assertEqual(sty[0]["getty_id"], "aat:300021430")
        plc = [r for r in rows if r["canon_id"] == "PLC021"]
        self.assertEqual(plc[0]["vocabulary"], "tgn")
        self.assertTrue(plc[0]["getty_id"].startswith("tgn:"))
        empty = [r for r in rows if r["getty_id"] == ""]
        self.assertTrue(empty and all(str(r["rank"]) == "0" for r in empty))
        again = B.harvest_getty(limit=1000, kinds=["style", "place"], fixture=GT, done={r["canon_id"] for r in rows})
        self.assertEqual(again, [])


class TestMatching(unittest.TestCase):
    def test_generic_words_do_not_count(self):
        self.assertEqual(B.norm("Predynastic period (Egypt)"), "predynastic")
        self.assertEqual(B.norm("Art Deco"), "deco")
        self.assertEqual(B.norm("Classical period"), "classical")
        self.assertEqual(B.norm("Period"), "period")   # nothing else left, so the word stays
        self.assertLess(B.similarity("Hellenistic Period", "Predynastic period (Egypt)"), 0.6)
        self.assertEqual(B.similarity("Geometric Period", "Geometric period (Greece)"), 1.0)

    def test_index_meets_spelling_variants(self):
        idx = B.NameIndex([{"title": "Carthago"}, {"title": "Pompeii"}, {"title": "Gallia"}], "title")
        hits = idx.candidates({"name": "Carthage", "other_names": ""})
        self.assertEqual(hits[0][1]["title"], "Carthago")
        self.assertEqual(idx.candidates({"name": "Punic city", "other_names": "Carthago"})[0][1]["title"], "Carthago")
        self.assertEqual(idx.candidates({"name": "Memphis", "other_names": ""}), [])

    def test_date_flag(self):
        self.assertEqual(B.date_flag(-1050, -700, -900, -700), "dates differ")
        self.assertEqual(B.date_flag(-323, -31, -323, -31), "")
        self.assertEqual(B.date_flag(1300, 1700, 30, 300), "no overlap")
        self.assertEqual(B.date_flag(1000, 2000, 1090, 2000), "")      # within 10% of the span
        self.assertEqual(B.date_flag(1900, 1910, 1860, None), "")       # within 50 years, one bound only
        self.assertEqual(B.date_flag(None, None, 1, 2), "canon undated")
        self.assertEqual(B.date_flag(1, 2, None, None), "source undated")

    def test_report(self):
        movements = B.harvest_movements(fixture=WD)
        periods = B.harvest_periods(fixture=PO)
        places = B.harvest_places(fixture=PL)
        getty = B.harvest_getty(limit=1000, kinds=["style", "place"], fixture=GT)
        canon_mov = [{"id": "STY036", "name": "Art Nouveau", "other_names": "", "kind": "style", "start": "1890", "end": "1914"},
                     {"id": "STY001", "name": "Greek Geometric style", "other_names": "Geometric period art", "kind": "style", "start": "-900", "end": "-700"},
                     {"id": "MOV999", "name": "Nothing like it", "other_names": "", "kind": "movement", "start": "", "end": ""}]
        canon_per = [{"id": "PRD061", "name": "Hellenistic period", "other_names": "Hellenistic age", "kind": "period", "start": "-323", "end": "-31"},
                     {"id": "PRD058", "name": "Geometric period (Greece)", "other_names": "", "kind": "period", "start": "-1050", "end": "-700"},
                     {"id": "PRD001", "name": "Predynastic period (Egypt)", "other_names": "", "kind": "period", "start": "-5300", "end": "-3000"}]
        canon_plc = [{"id": "PLC320", "name": "Pompeii", "other_names": "", "kind": "place", "start": "-80", "end": "79"},
                     {"id": "PLC021", "name": "Carthage", "other_names": "Qart-hadasht; Carthago", "kind": "place", "start": "-814", "end": "698"},
                     {"id": "POL999", "name": "Kingdom of Nowhere", "other_names": "", "kind": "polity", "start": "", "end": ""}]
        text = B.match_report(movements, periods, places, getty, canon_mov, canon_per, canon_plc)
        self.assertIn("a person confirms each", text)
        an = next(l for l in text.splitlines() if l.startswith("| STY036 "))
        self.assertIn("Q34636 Art Nouveau | 1.0 | 1890..1910 | 300021430 | aat:300021430 Art Nouveau (1.0) | AAT agrees |", an)
        geo = next(l for l in text.splitlines() if l.startswith("| STY001 "))
        self.assertIn("dates differ", geo)
        hel = next(l for l in text.splitlines() if l.startswith("| PRD061 "))
        self.assertIn("| 1.0 | -323..-323; -31..-31 |  |", hel)
        self.assertIn("Messenia", hel)
        self.assertIn("dates differ", next(l for l in text.splitlines() if l.startswith("| PRD058 ")))
        self.assertNotIn("| PRD001 ", text)      # weak name and no date overlap: left out
        self.assertNotIn("| MOV999 ", text)
        self.assertNotIn("| POL999 ", text)
        pom = next(l for l in text.splitlines() if l.startswith("| PLC320 "))
        self.assertIn("433032 Pompeii | 1.0 | urban; settlement | A; C; H; R (-1000..300)", pom)
        car = next(l for l in text.splitlines() if l.startswith("| PLC021 "))
        self.assertIn("314921 Carthago", car)
        self.assertIn("tgn:", car)


class TestDriver(unittest.TestCase):
    def test_cli_writes_the_declared_files(self):
        tmp = tempfile.mkdtemp()
        old = B.OUT_DIR, B.REPORT
        B.OUT_DIR, B.REPORT = os.path.join(tmp, "backbone"), os.path.join(tmp, "backbone_matches.md")
        try:
            self.assertEqual(B.main(["movements", "--fixture", WD, "--limit", "5"]), 0)
            self.assertEqual(B.main(["periods", "--fixture", PO]), 0)
            self.assertEqual(B.main(["places", "--fixture", PL]), 0)
            self.assertEqual(B.main(["getty", "--fixture", GT, "--kinds", "style", "--limit", "1000"]), 0)
            self.assertEqual(B.main(["getty", "--fixture", GT, "--kinds", "style", "--limit", "1000"]), 0)   # resumes: nothing new
            self.assertEqual(B.main(["match"]), 0)
            heads = {f: next(csv.reader(io.StringIO(load(os.path.join(B.OUT_DIR, f))))) for f in
                     ("movements_wikidata.csv", "periods_periodo.csv", "places_pleiades.csv", "getty_ids.csv")}
            self.assertEqual(heads["movements_wikidata.csv"], B.MOVEMENT_FIELDS)
            self.assertEqual(heads["periods_periodo.csv"], B.PERIOD_FIELDS)
            self.assertEqual(heads["places_pleiades.csv"], B.PLACE_FIELDS)
            self.assertEqual(heads["getty_ids.csv"], B.GETTY_FIELDS)
            self.assertEqual(len(list(csv.DictReader(io.StringIO(load(os.path.join(B.OUT_DIR, "movements_wikidata.csv")))))), 5)
            getty = list(csv.DictReader(io.StringIO(load(os.path.join(B.OUT_DIR, "getty_ids.csv")))))
            self.assertEqual(len({r["canon_id"] for r in getty}), len([r for r in getty if r["rank"] in ("0", "1")]))
            self.assertTrue(load(B.REPORT).startswith("# Canon rows matched to the open backbone"))
        finally:
            B.OUT_DIR, B.REPORT = old


if __name__ == "__main__":
    unittest.main(verbosity=2)

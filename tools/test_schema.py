"""Checks that the program schema is valid JSON, in sync with the canon vocabularies, and matches the data."""
import csv, glob, json, os, re, subprocess, sys, unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANON = os.path.join(ROOT, "modules", "F1-histories-of-making", "atlas", "data", "canon")

class SchemaTests(unittest.TestCase):
    def test_json_files_parse(self):
        for f in glob.glob(os.path.join(ROOT, "schema", "*.json")):
            json.load(open(f, encoding="utf-8"))

    def test_canon_schema_in_sync(self):
        r = subprocess.run([sys.executable, os.path.join(ROOT, "tools", "build_schema.py"), "--check"])
        self.assertEqual(r.returncode, 0)

    def test_canon_rows_match_schema(self):
        s = json.load(open(os.path.join(ROOT, "schema", "canon-node.schema.json"), encoding="utf-8"))
        pat = re.compile(s["properties"]["id"]["pattern"])
        for f in glob.glob(os.path.join(CANON, "canon_*.csv")):
            for row in csv.DictReader(open(f, encoding="utf-8")):
                self.assertRegex(row["id"], pat)
                self.assertIn(row["kind"], s["x-prefixes"][row["id"][:3]], row["id"])
                self.assertEqual(list(row.keys()), s["x-column-order"], f)

    def test_program_modules_have_unique_codes(self):
        p = json.load(open(os.path.join(ROOT, "schema", "program.json"), encoding="utf-8"))
        codes = [m["code"] for lvl in p["levels"] for m in lvl["modules"]]
        self.assertEqual(len(codes), len(set(codes)))
        for lvl in p["levels"]:
            for m in lvl["modules"]:
                if "folder" in m:
                    self.assertTrue(os.path.isdir(os.path.join(ROOT, m["folder"])), m["folder"])

if __name__ == "__main__":
    unittest.main()

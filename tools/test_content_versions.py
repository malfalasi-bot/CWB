"""Offline tests for tools/content_versions.py (standard library only)."""
import pathlib
import sys
import tempfile
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).parent))
import content_versions as cv  # noqa: E402


class ContentVersionsTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = pathlib.Path(self.tmp.name)
        (self.root / ".git").mkdir()
        self.topic = self.root / "modules/M/topics/t"
        (self.topic / "research").mkdir(parents=True)
        (self.topic / "learner/page").mkdir(parents=True)
        self.src = self.topic / "research/notes.md"
        self.src.write_text("facts\n", encoding="utf8")
        self.page = self.topic / "learner/page/page.md"
        body = "# A page\n\nSome text.\n"
        meta = {
            "content_id": "t.page", "title": "A page", "kind": "page", "topic": "t",
            "version": "0.1.0", "status": "draft", "updated": "2026-10-25",
            "derived_from": ["modules/M/topics/t/research/notes.md"],
            "changes": ["0.1.0 | 2026-10-25 | First version."],
        }
        cv.refresh_sources(meta, self.root)
        meta["body_sha256"] = cv.body_hash(body)
        self.page.write_text(cv.join(meta, body), encoding="utf8")

    def tearDown(self):
        self.tmp.cleanup()

    def test_round_trip(self):
        meta, body = cv.split(self.page.read_text(encoding="utf8"))
        self.assertEqual(meta["version"], "0.1.0")
        self.assertEqual(body, "# A page\n\nSome text.\n")
        self.assertEqual(len(meta["derived_from"]), 1)

    def test_clean_file_passes(self):
        errors, warnings = cv.check_file(self.page, self.root)
        self.assertEqual(errors, [])
        self.assertEqual(warnings, [])

    def test_edit_without_bump_is_an_error(self):
        self.page.write_text(self.page.read_text(encoding="utf8") + "More.\n", encoding="utf8")
        errors, _ = cv.check_file(self.page, self.root)
        self.assertTrue(any("not bumped" in e for e in errors))

    def test_changed_research_is_stale(self):
        self.src.write_text("facts, corrected\n", encoding="utf8")
        errors, warnings = cv.check_file(self.page, self.root)
        self.assertEqual(errors, [])
        self.assertTrue(any("STALE" in w for w in warnings))

    def test_missing_snapshot_warns(self):
        meta, body = cv.split(self.page.read_text(encoding="utf8"))
        meta["version"] = "0.2.0"
        meta["changes"] = ["0.2.0 | 2026-10-26 | Second."] + meta["changes"]
        self.page.write_text(cv.join(meta, body), encoding="utf8")
        _, warnings = cv.check_file(self.page, self.root)
        self.assertTrue(any("history/0.1.0.md" in w for w in warnings))

    def test_bump_versions(self):
        self.assertEqual(cv.bump_version("0.3.0", "patch"), "0.3.1")
        self.assertEqual(cv.bump_version("0.3.1", "minor"), "0.4.0")
        self.assertEqual(cv.bump_version("0.4.0", "major"), "1.0.0")

    def test_blob_sha_matches_git(self):
        import subprocess
        out = subprocess.run(["git", "hash-object", str(self.src)], capture_output=True, text=True)
        if out.returncode == 0:
            self.assertEqual(cv.blob_sha(self.src), out.stdout.strip())

if __name__ == "__main__":
    unittest.main()

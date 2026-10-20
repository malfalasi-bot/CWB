#!/usr/bin/env python3
"""lint_prose.py — the learner-view prose lint of hom-writing §4 and §10.

Usage: lint_prose.py FILE [FILE ...] [--editor-ok]
  FILE: an .html (the learner view is <body> minus <svg>, <script>, <style> and any element
        with class/id containing editor, apparatus, colophon, sources, credit), a .md or .txt.
Reports (fixed format, one per line): <CODE> <file>:<n>: <what the text says>
  E-SENTENCE-LONG   a sentence over 40 words
  W-SENTENCE-MEDIAN median sentence length outside 14–24 words
  W-FIRST-SENTENCE  the first sentence of the text over 16 words
  E-APPARATUS-WORD  a tooling word in the learner view (tick, tile, lens, station, instrument,
                    focus mask, register, claim, record id, beat, scene player, stepper,
                    component, build, placeholder, "as defined by", "membership confidence")
  E-PROJECT-VOICE   "we write", "we hold", "this unit", "the course", "the register"
  J-PRIORITY        a possible priority claim for the judge: "first" / "invented" / "the origin of"
                    outside a quoted title or name (reported, not failed: the judge decides)
  E-DOUBLED-LABEL   "circa c.", "c. about", "ca. c."
  E-DECIMAL-YEAR    a decimal year in prose (1842.5)
  E-CODE-IN-PROSE   a record id or claim id in the learner view (f13-e-jar, F1.13-C02, c1 as superscript)
  W-WORDS           the reading is outside 400–900 words (per page) — a warning, the brief decides
Exit 1 on any E-code.
"""
import re, sys, os, statistics

APPARATUS = ["tick", "tile", "lens", "station", "instrument", "focus mask", "register", "claim",
             "record id", "beat", "scene player", "stepper", "component", "build", "placeholder",
             "as defined by", "membership confidence", "documented"]
VOICE = ["we write", "we hold", "this unit", "the course", "the register", "we draw", "we show"]
PRIORITY = re.compile(r"\b(first|invented|the origin of|the birth of)\b", re.I)
QUOTED = re.compile(r"[\"“‘'][^\"”’']{0,80}\bfirst\b[^\"”’']{0,80}[\"”’']", re.I)
DOUBLED = re.compile(r"\b(circa\s+c\.|c\.\s+about|ca\.\s+c\.)", re.I)
DECIMAL = re.compile(r"(?<![\d.])1[0-9]{3}\.[0-9]{1,2}(?![.\d])")  # a pos like 1842.5; accessions have 3+ digits after the point
CODE = re.compile(r"\b(f1[\w-]*-[a-z]{1,3}-[\w-]+|F1\.\d+[a-z]?-C\d+|[A-Z]{3}\d{3})\b")

def learner_text(path):
    s = open(path, encoding="utf8").read()
    if path.endswith(".html"):
        i = s.lower().find("<body"); s = s[i:] if i >= 0 else s
        s = re.sub(r"<(svg|script|style)\b.*?</\1>", " ", s, flags=re.S | re.I)
        # drop editor/apparatus elements by class or id (shallow: the element's own tag block)
        s = re.sub(r"<(\w+)[^>]*(class|id)=\"[^\"]*(editor|apparatus|colophon|sources|credit|honesty|waits)[^\"]*\"[^>]*>.*?</\1>", " ", s, flags=re.S | re.I)
        s = re.sub(r"<[^>]+>", " ", s)
        s = re.sub(r"&nbsp;", " ", s)
    return re.sub(r"[ \t]+", " ", s)

def sentences(t):
    t = re.sub(r"\s+", " ", t)
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z\"“])", t)
    return [p.strip() for p in parts if len(p.split()) >= 3]

def main(argv):
    files = [a for a in argv if not a.startswith("--")]
    errors = 0
    for f in files:
        t = learner_text(f)
        lines = t.split("\n")
        sents = sentences(t)
        if sents:
            lens = [len(s.split()) for s in sents]
            med = statistics.median(lens)
            if not 14 <= med <= 24:
                print(f"W-SENTENCE-MEDIAN {f}: median sentence {med:.0f} words, outside 14–24")
            if lens[0] > 16:
                print(f"W-FIRST-SENTENCE {f}: first sentence {lens[0]} words: \"{sents[0][:80]}…\"")
            for s in sents:
                if len(s.split()) > 40:
                    print(f"E-SENTENCE-LONG {f}: {len(s.split())} words: \"{s[:90]}…\""); errors += 1
        words = len(t.split())
        if f.endswith(".html") and not 400 <= words <= 900:
            print(f"W-WORDS {f}: {words} words in the learner view (400–900 expected per page)")
        for n, line in enumerate(lines, 1):
            low = line.lower()
            for w in APPARATUS:
                if re.search(r"\b" + re.escape(w) + r"\b", low):
                    print(f"E-APPARATUS-WORD {f}:{n}: \"{w}\" in \"{line.strip()[:90]}\""); errors += 1
            for w in VOICE:
                if w in low:
                    print(f"E-PROJECT-VOICE {f}:{n}: \"{w}\" in \"{line.strip()[:90]}\""); errors += 1
            for m in PRIORITY.finditer(line):
                span = line[max(0, m.start() - 60): m.end() + 60]
                if not QUOTED.search(span):
                    print(f"J-PRIORITY {f}:{n}: \"{m.group(0)}\" in \"{line.strip()[:90]}\" (judge: is this a claim of priority?)")
            if DOUBLED.search(line):
                print(f"E-DOUBLED-LABEL {f}:{n}: \"{line.strip()[:90]}\""); errors += 1
            if DECIMAL.search(line):
                print(f"E-DECIMAL-YEAR {f}:{n}: \"{line.strip()[:90]}\""); errors += 1
            if CODE.search(line):
                print(f"E-CODE-IN-PROSE {f}:{n}: \"{CODE.search(line).group(0)}\" in \"{line.strip()[:90]}\""); errors += 1
    print(f"\n{errors} errors in {len(files)} file(s)")
    return 1 if errors else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

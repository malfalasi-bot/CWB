#!/usr/bin/env python3
"""lint_claims.py — the claims-register lint of claims.md §3, for unit F1.13.

Usage:
    python3 lint_claims.py claims.yaml FILE [FILE ...] [--out REPORT] [--clock]

FILE may be .html, .yaml/.yml or .json (a lecture file such as f1-13.json).

What it checks
  1. Every four-digit year in prose must be a value, alternate or display year
     of a record (E-DATE-UNREGISTERED). Prose is: HTML text outside <svg>,
     <script> and <style>; YAML string values under prose keys; and in a
     lecture JSON the captions, notes, predict questions and reveals, stamps,
     type lines, object fields, map and timeline labels and the closing
     questions (options are distractors and are not scanned).
     Excluded from the year scan: accession numbers (1962.154, 12.3.1),
     source ids (huffman-2007, AK-RBK-16385), long digit runs, anything
     inside an <svg> element, and citation years: a year directly after an
     author-style token ("Jiang et al. 2020", "(Hecht, 2003)", "and Bhan
     1991", "after Engseng Ho, 2006", a listed surname with a comma), after
     a journal, holder or publisher name ("PNAS 2020", "UNESCO 2021", "The
     Met, 2023"), a counting or verifying date ("counted … 20 October 2026",
     "verified at source 3 Oct 2026"), and any year inside an element whose
     class or id contains sources, cite, credit, counted, verified or
     colophon (or under a YAML key of those names). A claim's day-date
     ("On 17 October 1132 he freed …") stays strict.
  2. A year that matches only a sourced alternate of a documented or probable
     record disagrees with its display (E-DATE-MISMATCH). For a contested or
     argued record the alternates are what is argued and may be named.
  3. A probable, contested or argued record needs its word in the same
     sentence (E-CONF-MISSING).
  4. No argued or contested record may appear on a tick, tile or clock
     (E-ARGUED-TICK): in HTML, an element whose class contains 'tick', 'tile'
     or 'clock' or that carries data-tick; in YAML, a mapping under ticks/
     tiles/clock(s) or whose kind says so; in a lecture JSON, timeline.mark
     and timeline.span commands. A record is found by the element's declared
     ids (data-claim, data-record, claim, claims, record) or, failing that, by
     its years.
  5. A YAML beat's `year` must equal a used record's pos or value (E-CLOCK);
     with --clock a lecture's timeline.scrub years are checked the same way.
  6. YAML events need `claim:` (E-EVENT-NOCLAIM); YAML people need a record on
     born/died (E-PERSON-NOCLAIM).
  7. A record whose alternate names a canon disagreement is reported once
     (W-CANON-DISAGREES).

Message format, fixed: <CODE> <where>[ ← <record id>]: <what the file says>, <what the register says>
Exit status 1 when any E-code is reported.
"""
import argparse
import json
import re
import sys
from html.parser import HTMLParser

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.exit("lint_claims.py needs PyYAML (pip install pyyaml)")

# A four-digit year: not preceded by a word char, '.', ',', '$' or '-' (so
# 1962.154, huffman-2007, AK-RBK-16385 and 2018371864 do not match), not
# followed by a digit, and not followed by '.', ',' or '-' plus a word char
# (so 1962.154 and 12,520,000 do not match). A trailing 's' (1300s) is taken.
YEAR_RE = re.compile(r"(?<![\w.,$£€-])(\d{4})(s?)(?!\d)(?![\w.,-]\w)")
SENTENCE_SPLIT = re.compile(r"(?<=[.!?])\s+|\n+")
CONF_RANK = {"documented": 0, "probable": 1, "contested": 2, "argued": 3}
HOW_RANK = {"value": 0, "display": 1, "as_of": 2, "alternate": 3}

CONF_WORDS = {
    "probable": re.compile(r"\bprobabl[ey]\b", re.I),
    "contested": re.compile(r"\bcontested\b", re.I),
    "argued": re.compile(r"\bargued\b", re.I),
}
MARKED = ("probable", "contested", "argued")
TICK_WORDS = ("tick", "tile", "clock")

# Citation years are not claims. A year is skipped when it directly follows an
# author-style token ("Jiang et al. 2020", "(Hecht, 2003)", "and Bhan 1991",
# "after Engseng Ho, 2006", a listed surname with a comma), a journal, holder
# or publisher name ("PNAS 2020", "UNESCO 2021", "The Met, 2023"), or when it
# is the year of a counting or verifying date ("counted … 20 October 2026",
# "verified at source 3 Oct 2026", "read 3 October 2026"). A day-date that is
# a claim ("On 17 October 1132 he freed …", "bought 30 June 2017") stays
# strict. Years inside an element whose class or id contains sources, cite,
# credit, counted, verified or colophon (HTML), or under a YAML key of those
# names, are skipped as well.
CITE_NAMES = ("Jiang", "Colomban", "Ho", "Hecht", "Willmann", "Seijas", "Bloom",
              "Jameson", "Flecker", "Carfantan", "Barnes", "Shaikh", "Kenoyer",
              "Vidale", "Bhan", "Goitein", "Whitehouse", "Schoff", "Talhami",
              "Shaban", "Chittick", "Horton", "Chami", "Chaudhuri", "Sheriff",
              "Rao", "Busuttil")
CITE_HOLDERS = ("PNAS", "Minerals", "Wikipedia", "UNESCO", "The Met", "the Met",
                "Smithsonian", "NCpedia", "Ashmolean", "ToposText", "DocSouth",
                "American Historical Review", "Journal", "Press", "Review",
                "Library of Congress", "Rijksmuseum", "Cleveland", "SlaveVoyages",
                "Trafficking Culture", "SEACS", "Block Museum", "Gallica", "BnF",
                "Northwestern", "Columbia", "Princeton", "Sotheby's", "Sotheby’s",
                "Current World Archaeology", "World Heritage List", "ICH")
CITE_BEFORE = re.compile(
    r"(?:"
    r"\bet\s+al\.?,?"                                   # et al. 2020 / et al., (2020)
    r"|\band\s+[A-Z][\w'’-]+,?"                         # and Bhan 1991
    r"|\bafter\s+(?:[A-Z][\w'’-]+\s+){0,2}[A-Z][\w'’-]+,?"   # after Engseng Ho, 2006
    r"|\b(?:" + "|".join(re.escape(n) for n in CITE_NAMES) + r"),?"      # Hecht, 2003
    r"|\b(?:" + "|".join(re.escape(h) for h in CITE_HOLDERS) + r")"
    r"(?:\s+(?:World\s+Heritage(?:\s+List)?|ICH|Open\s+Access|essay|record))?,?"   # UNESCO 2021 · UNESCO World Heritage List, 1561
    r"|\(\s*(?:The\s+)?[A-Z][^()]{0,60}?,"             # (The Met, 2023) (Jameson, 1925)
    r")\s*\(?\s*$")
MONTHS = r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?"
DAY_DATE_BEFORE = re.compile(r"\b\d{1,2}\s+" + MONTHS + r"\s*$")
COUNT_VERBS = re.compile(r"\b(?:counted|re-?counted|verified|read|re-?read|fetched|checked|fact-?checked|re-?sourced|corrected|accessed|retrieved|as\s+of|generated|built|rendered)\b(?:[^.;]|\.(?=\d)){0,60}$", re.I)
SKIP_CONTEXT_WORDS = ("sources", "cite", "credit", "counted", "verified", "colophon", "editor", "chip", "apparatus", "waits")

YAML_PROSE_KEYS = {"text", "caption", "note", "reveal", "question", "prompt",
                   "body", "label", "title", "sub", "idea", "narration",
                   "deck", "aside", "bridge", "focus", "threshold"}
YAML_ID_KEYS = {"claim", "claims", "record", "records", "data-claim"}

# ----------------------------------------------------------------------------
# The register
# ----------------------------------------------------------------------------

def years_in(s):
    if s is None:
        return set()
    return {int(m.group(1)) for m in YEAR_RE.finditer(str(s))}


def value_years(v):
    out = set()
    if isinstance(v, (list, tuple)):
        for x in v:
            out |= value_years(x)
    elif isinstance(v, bool):
        pass
    elif isinstance(v, (int, float)):
        if 100 <= abs(v) <= 9999 and float(v).is_integer():
            out.add(int(v))
    elif isinstance(v, str):
        out |= years_in(v)
    return out


class Register:
    def __init__(self, path):
        with open(path, encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}
        # a unit register has a header, `sources:` and `records:`; an older flat file is records only
        if isinstance(data.get("records"), dict):
            self.header = {k: v for k, v in data.items() if k not in ("records", "sources", "objects")}
            self.sources_meta = data.get("sources") or {}
            self.records = {k: v for k, v in data["records"].items() if isinstance(v, dict)}
        else:
            self.header, self.sources_meta = {}, {}
            self.records = {k: v for k, v in data.items() if isinstance(v, dict)}
        self.by_source = {}
        self.index = {}  # year -> list of (id, how) where how in value|display|alternate
        self.pos = {}
        for rid, r in self.records.items():
            if r.get("kind") in ("date", "span"):
                for y in value_years(r.get("value")):
                    self.index.setdefault(y, []).append((rid, "value"))
            for y in years_in(r.get("display")):
                self.index.setdefault(y, []).append((rid, "display"))
            for y in value_years(r.get("as_of")):
                self.index.setdefault(y, []).append((rid, "as_of"))
            for alt in r.get("alternates") or []:
                for y in value_years(alt.get("value")):
                    self.index.setdefault(y, []).append((rid, "alternate"))
            for s in r.get("sources") or []:
                self.by_source.setdefault(str(s), set()).add(rid)
            p = r.get("pos")
            if p is None and r.get("kind") in ("date", "span"):
                v = r.get("value")
                if isinstance(v, (list, tuple)) and len(v) == 2:
                    p = (v[0] + v[1]) / 2
                elif isinstance(v, (int, float)):
                    p = v
            if p is not None:
                self.pos[rid] = float(p)

    def confidence(self, rid):
        return self.records[rid].get("confidence", "documented")

    def display(self, rid):
        return self.records[rid].get("display", "")

    def matches(self, year, allowed=None):
        """[(rid, how)] for a year, restricted to `allowed` ids when given."""
        hits = self.index.get(year, [])
        if allowed is not None:
            hits = [h for h in hits if h[0] in allowed]
        # one entry per record; value > display > as_of > alternate, then the
        # documented record before a marked one, so a year two records share
        # is read as the documented claim unless the element declares otherwise
        best = {}
        for rid, how in hits:
            if rid not in best or HOW_RANK[how] < HOW_RANK[best[rid]]:
                best[rid] = how
        return sorted(best.items(),
                      key=lambda kv: (HOW_RANK[kv[1]], CONF_RANK.get(self.confidence(kv[0]), 9), kv[0]))

    def ids_for_declared(self, declared):
        """Record ids for a list of declared ids: record ids as given, or
        register claim numbers / ids ('2', 'C02', 'F1.13-C02') via sources."""
        out = set()
        for d in declared:
            d = str(d).strip()
            if not d:
                continue
            if d in self.records:
                out.add(d)
                continue
            m = re.fullmatch(r"(?:F1\.13-)?C?0*(\d{1,2})", d)
            if m:
                key = "F1.13-C%02d" % int(m.group(1))
                out |= self.by_source.get(key, set())
            else:
                out |= self.by_source.get(d, set())
        return out


# ----------------------------------------------------------------------------
# Findings
# ----------------------------------------------------------------------------

class Report:
    def __init__(self):
        self.lines = []
        self.errors = 0
        self.warnings = 0
        self.years_checked = 0
        self.years_skipped = 0

    def add(self, code, where, says, register, rid=None):
        arrow = " ← %s" % rid if rid else ""
        line = "%s %s%s: %s, %s" % (code, where, arrow, says, register)
        if line in self.lines:
            return
        self.lines.append(line)
        if code.startswith("E-"):
            self.errors += 1
        else:
            self.warnings += 1


def sentence_of(text, start):
    """The sentence of `text` that contains offset `start`."""
    pos = 0
    for sent in SENTENCE_SPLIT.split(text):
        idx = text.find(sent, pos)
        if idx < 0:
            idx = pos
        if idx <= start < idx + len(sent):
            return sent.strip()
        pos = idx + len(sent)
    return text.strip()


def short(s, n=70):
    s = " ".join(str(s).split())
    return s if len(s) <= n else s[: n - 1] + "…"


def is_citation(text, start):
    """True when the year at `start` is a publication or counting year."""
    before = text[:start]
    if CITE_BEFORE.search(before):
        return True
    dd = DAY_DATE_BEFORE.search(before)
    if dd and COUNT_VERBS.search(before[: dd.start()]):
        return True
    return False


def check_prose(reg, rep, where, text, declared=None, is_tick=False, segments=None):
    """Years in one run of prose. `declared`: record ids the element names;
    `segments`: [(start, end, declared, tick)] when ids vary within the run."""
    if not text:
        return
    run_declared, run_tick = declared, is_tick
    for m in YEAR_RE.finditer(text):
        if is_citation(text, m.start()):
            rep.years_skipped += 1
            continue
        declared, is_tick = run_declared, run_tick
        if segments:
            for start, end, d, t in segments:
                if start <= m.start() < end:
                    declared, is_tick = d or None, t
                    break
        allowed = reg.ids_for_declared(declared) if declared else None
        if declared and not allowed:
            allowed = None  # the declared ids name no record (a group id, say): judged by year
        year = int(m.group(1))
        token = m.group(0)
        rep.years_checked += 1
        sent = sentence_of(text, m.start())
        hits = reg.matches(year, allowed)
        if not hits and allowed is not None:
            elsewhere = reg.matches(year)
            if elsewhere:
                rep.add("E-DATE-UNREGISTERED", where,
                        '"%s" under claim(s) %s' % (token, ", ".join(map(str, declared))),
                        "no record under that claim holds %d; %s does (%s)" % (
                            year, elsewhere[0][0], reg.display(elsewhere[0][0])))
                continue
        if not hits:
            rep.add("E-DATE-UNREGISTERED", where, '"%s" in "%s"' % (token, short(sent)),
                    "no record holds %d" % year)
            continue
        rid, how = hits[0]
        conf = reg.confidence(rid)
        if is_tick and declared:
            continue  # the tick's declared record was judged by check_tick_ids
        if how == "alternate" and conf not in ("contested", "argued"):
            alt_note = ""
            for alt in reg.records[rid].get("alternates") or []:
                if year in value_years(alt.get("value")):
                    alt_note = alt.get("note", "")
                    break
            rep.add("E-DATE-MISMATCH", where, '"%s" in "%s"' % (token, short(sent)),
                    'display "%s" (%d is a sourced alternate%s)' % (
                        reg.display(rid), year, ": " + short(alt_note, 60) if alt_note else ""),
                    rid)
        if conf in MARKED and not CONF_WORDS[conf].search(sent):
            rep.add("E-CONF-MISSING", where, '"%s" without the word' % short(sent),
                    '%s; "%s" needs "%s" in the sentence' % (conf, reg.display(rid), conf), rid)
        if is_tick and conf in ("contested", "argued"):
            rep.add("E-ARGUED-TICK", where, '"%s" on a tick, tile or clock' % short(sent),
                    "%s is %s and may drive no tick, tile or clock (display \"%s\")" % (
                        rid, conf, reg.display(rid)), rid)


def check_tick_ids(reg, rep, where, declared):
    for rid in reg.ids_for_declared(declared):
        conf = reg.confidence(rid)
        if conf in ("contested", "argued"):
            rep.add("E-ARGUED-TICK", where, "record %s on a tick, tile or clock" % rid,
                    '%s; display "%s"; alternates stay in the argued panel' % (conf, reg.display(rid)), rid)


def check_clock(reg, rep, where, year, declared=None):
    allowed = reg.ids_for_declared(declared) if declared else None
    try:
        y = float(year)
    except (TypeError, ValueError):
        return
    for rid, p in reg.pos.items():
        if allowed is not None and rid not in allowed:
            continue
        if abs(p - y) < 1e-9 or y in value_years(reg.records[rid].get("value")):
            if reg.confidence(rid) in ("contested", "argued"):
                rep.add("E-ARGUED-TICK", where, "clock at %s" % year,
                        "%s is %s and may not drive a clock" % (rid, reg.confidence(rid)), rid)
            return
    rep.add("E-CLOCK", where, "year %s" % year, "matches no record's pos%s" % (
        " among the declared claims" if allowed is not None else ""))


# ----------------------------------------------------------------------------
# HTML
# ----------------------------------------------------------------------------

BLOCK_TAGS = {"p", "li", "figcaption", "caption", "td", "th", "h1", "h2", "h3",
              "h4", "h5", "h6", "dd", "dt", "blockquote", "div", "section",
              "article", "aside", "header", "footer", "summary", "details",
              "label", "legend", "button", "a", "span", "small", "em", "strong",
              "i", "b", "time", "cite", "q"}
INLINE_TAGS = {"a", "span", "small", "em", "strong", "i", "b", "time", "cite", "q"}


class HTMLProse(HTMLParser):
    """Collects runs of prose, one per block element, with the declared claim
    ids and tick context of every inline segment, so a <span data-claim> keeps
    the sentence around it for the confidence-word check."""

    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.stack = []     # [tag, attrs]
        self.skip = 0       # depth inside svg/script/style
        self.runs = []      # (where, text, segments) with segments [(start, end, declared, tick)]
        self.cur = None     # [line, parts]; parts are (text, declared, tick, cite)

    @staticmethod
    def _tick(attrs):
        cls = (attrs.get("class") or "").lower()
        if any(w in cls for w in TICK_WORDS):
            return True
        return any(k.lower() in ("data-tick", "data-tile", "data-clock") for k in attrs)

    @staticmethod
    def _cite(attrs):
        ctx = ((attrs.get("class") or "") + " " + (attrs.get("id") or "")).lower()
        return any(w in ctx for w in SKIP_CONTEXT_WORDS)

    @staticmethod
    def _declared(attrs):
        out = []
        for k in ("data-claim", "data-claims", "data-record", "data-records"):
            if attrs.get(k):
                out += re.split(r"[\s,;]+", attrs[k].strip())
        return [x for x in out if x]

    def _context(self):
        declared, tick, cite = [], False, False
        for _, attrs in self.stack:
            declared += self._declared(attrs)
            tick = tick or self._tick(attrs)
            cite = cite or self._cite(attrs)
        return declared, tick, cite

    def _flush(self):
        if self.cur:
            line, parts = self.cur
            text, segs, pos = "", [], 0
            for t, declared, tick, cite in parts:
                if cite:
                    t = " " * len(t)  # a citation segment is blanked, not scanned
                text += t
                segs.append((pos, pos + len(t), declared, tick))
                pos += len(t)
            if text.strip():
                self.runs.append(("%s:%d" % (self.path, line), text, segs))
        self.cur = None

    def handle_starttag(self, tag, attrs):
        attrs = dict((k.lower(), v or "") for k, v in attrs)
        if tag in ("svg", "script", "style"):
            self.skip += 1
        self.stack.append((tag, attrs))
        if self.skip:
            return
        if tag not in INLINE_TAGS:
            self._flush()
        if self.cur is None:
            self.cur = [self.getpos()[0], []]

    def handle_startendtag(self, tag, attrs):
        if tag == "br" and self.cur:
            self.cur[1].append(("\n", [], False, False))

    def handle_endtag(self, tag):
        if self.skip and tag in ("svg", "script", "style"):
            self.skip -= 1
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                if not self.skip and tag not in INLINE_TAGS:
                    self._flush()
                break

    def handle_data(self, data):
        if self.skip:
            return
        if self.cur is None:
            self.cur = [self.getpos()[0], []]
        declared, tick, cite = self._context()
        self.cur[1].append((data, declared, tick, cite))

    def close(self):
        super().close()
        self._flush()


def lint_html(reg, rep, path):
    with open(path, encoding="utf-8") as f:
        p = HTMLProse(path)
        p.feed(f.read())
        p.close()
    for where, text, segs in p.runs:
        seen = set()
        for start, end, declared, tick in segs:
            key = (tuple(declared), tick)
            if tick and declared and key not in seen:
                seen.add(key)
                check_tick_ids(reg, rep, where, declared)
        check_prose(reg, rep, where, text, segments=segs)


# ----------------------------------------------------------------------------
# YAML (beats, scenes, lectures, people, timeline)
# ----------------------------------------------------------------------------

def lint_yaml(reg, rep, path):
    with open(path, encoding="utf-8") as f:
        data = yaml.safe_load(f)

    def declared_of(node):
        out = []
        for k in YAML_ID_KEYS:
            v = node.get(k)
            if isinstance(v, list):
                out += [str(x) for x in v]
            elif v not in (None, ""):
                out += re.split(r"[\s,;]+", str(v))
        return out

    def walk(node, where, declared, tick, key=None):
        if key is not None and any(w in str(key).lower() for w in SKIP_CONTEXT_WORDS):
            return  # sources, credits, counted-by lines: citation years, not claims
        if isinstance(node, dict):
            d = declared + declared_of(node)
            kind = str(node.get("kind", "")).lower()
            t = (tick or any(w in kind for w in TICK_WORDS) or bool(node.get("tick"))
                 or str(key).lower() in ("ticks", "tiles", "clock", "clocks"))
            if t and declared_of(node):
                check_tick_ids(reg, rep, where, declared_of(node))
            if "year" in node and "claims" in node:
                check_clock(reg, rep, where + ".year", node["year"], node.get("claims"))
            if key == "events" and "claim" not in node and ("year" in node or "date" in node or "value" in node):
                rep.add("E-EVENT-NOCLAIM", where, "event %s" % short(node.get("id") or node.get("name") or "", 40),
                        "every event carries claim: <id>")
            if key == "people":
                for life in ("born", "died"):
                    v = node.get(life)
                    if v not in (None, "") and str(v) not in reg.records:
                        rep.add("E-PERSON-NOCLAIM", where + "." + life, "%s: %s" % (life, v),
                                "born and died name a record id; the build writes the value")
            for k, v in node.items():
                walk(v, "%s.%s" % (where, k), d, t, key=k)
        elif isinstance(node, list):
            for i, v in enumerate(node):
                walk(v, "%s[%d]" % (where, i), declared, tick, key=key)
        elif isinstance(node, str):
            if key in YAML_PROSE_KEYS:
                check_prose(reg, rep, where, node, declared or None, is_tick=tick)

    walk(data, path, [], False)


# ----------------------------------------------------------------------------
# Lecture JSON (build/lectures/src/lectures/*.json)
# ----------------------------------------------------------------------------

JSON_LABEL_CMDS = {"map.place", "map.route", "map.people", "map.peopleMark",
                   "timeline.mark", "timeline.span", "map.stamp"}
JSON_TICK_CMDS = {"timeline.mark", "timeline.span"}


def lint_lecture_json(reg, rep, path, clock=False):
    with open(path, encoding="utf-8") as f:
        d = json.load(f)
    base = path.rsplit("/", 1)[-1]

    def claims_of(cmd, station_claims):
        c = cmd.get("claim")
        if c in (None, ""):
            return None
        return [x.strip() for x in str(c).split(",") if x.strip()]

    def commands(cmds, prefix):
        for cmd in cmds:
            do = cmd.get("do", "")
            at = cmd.get("at", "")
            where = "%s %s.%s@%s" % (base, prefix, do, at)
            declared = claims_of(cmd, None)
            tick = do in JSON_TICK_CMDS
            if do == "caption" or do == "note":
                check_prose(reg, rep, where, cmd.get("text", ""), declared)
            elif do == "predict":
                check_prose(reg, rep, where + ".question", cmd.get("question", ""), declared)
                rv = cmd.get("reveal") or {}
                check_prose(reg, rep, where + ".reveal", rv.get("text", ""), claims_of(rv, None))
            elif do == "type":
                check_prose(reg, rep, where, "\n".join(cmd.get("lines", [])), declared)
            elif do == "object":
                for k in ("title", "date", "maker", "note"):
                    check_prose(reg, rep, where + "." + k, cmd.get(k, ""), declared)
            elif do == "chain":
                for link in cmd.get("links", []):
                    check_prose(reg, rep, where + ".link:" + str(link.get("id")),
                                " ".join(str(link.get(k, "")) for k in ("label", "sub")), declared)
            elif do in JSON_LABEL_CMDS:
                label = cmd.get("label") or cmd.get("text") or ""
                w = where + (":" + str(cmd["id"]) if cmd.get("id") else "")
                if tick and declared:
                    check_tick_ids(reg, rep, w, declared)
                check_prose(reg, rep, w, label, declared, is_tick=tick)
            elif do == "timeline.scrub" and clock:
                check_clock(reg, rep, where, cmd.get("year"))

    for st in d.get("stations", []):
        commands(st.get("commands", []), st.get("id", "?"))
    closing = d.get("closing") or {}
    for q in closing.get("questions", []):
        qid = "closing.%s" % q.get("id", "?")
        check_prose(reg, rep, "%s %s.question" % (base, qid), q.get("question", ""),
                    claims_of(q, None))
        commands(q.get("show", []), qid)


# ----------------------------------------------------------------------------

def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("register", help="claims.yaml")
    ap.add_argument("files", nargs="+", help="HTML, YAML or lecture JSON files")
    ap.add_argument("--out", help="write the report here as well as to stdout")
    ap.add_argument("--clock", action="store_true", help="also check a lecture's timeline.scrub years (E-CLOCK)")
    args = ap.parse_args(argv)

    reg = Register(args.register)
    rep = Report()

    # W-CANON-DISAGREES: an alternate that names a canon disagreement
    for rid, r in reg.records.items():
        for alt in r.get("alternates") or []:
            note = str(alt.get("note", ""))
            if "W-CANON-DISAGREES" in note or "canon" in note.lower() and "disagree" in note.lower():
                rep.add("W-CANON-DISAGREES", args.register + ":" + rid,
                        "alternate %s (%s)" % (alt.get("value"), ", ".join(map(str, alt.get("sources", [])))),
                        'display "%s"' % r.get("display", ""), rid)

    for path in args.files:
        low = path.lower()
        if low.endswith((".html", ".htm")):
            lint_html(reg, rep, path)
        elif low.endswith((".yaml", ".yml")):
            lint_yaml(reg, rep, path)
        elif low.endswith(".json"):
            lint_lecture_json(reg, rep, path, clock=args.clock)
        else:
            rep.add("E-FILE", path, "unknown file type", "html, yaml or json expected")

    summary = "%d error%s, %d warning%s; %d record%s in the register; %d year token%s checked in %d file%s (%d citation or counting year%s skipped)" % (
        rep.errors, "" if rep.errors == 1 else "s", rep.warnings, "" if rep.warnings == 1 else "s",
        len(reg.records), "" if len(reg.records) == 1 else "s",
        rep.years_checked, "" if rep.years_checked == 1 else "s", len(args.files), "" if len(args.files) == 1 else "s",
        rep.years_skipped, "" if rep.years_skipped == 1 else "s")
    out = "\n".join(rep.lines + ["", summary]) + "\n"
    sys.stdout.write(out)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(out)
    return 1 if rep.errors else 0


if __name__ == "__main__":
    sys.exit(main())

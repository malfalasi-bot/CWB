---
name: hom-constitution
description: The invariants every page, record and dossier of the F1 "Histories of making" course obeys: records with sources and confidence, no invention, open licences, protocol for living and coerced content, disputes as two readings, counts with their counter, what the sources leave out, apparatus behind the content, a human gate. Load first for any work on the course; the other hom- skills assume it.
---

# The constitution

Twelve rules. Each is true of every page in every unit and can be checked. Everything else in the course is a tool a unit may use or not.

1. **Every date, number and attribution is a record** in the unit's register (`atlas/data/register/units/<unit>.yaml`, one store per unit, one id scheme) with its value, precision, calendar, confidence, sources and alternates. Prose never carries a date or number the register lacks; a missing one is a change request to the editor, not a number typed in.
2. **Confidence is one of four words.** Documented (a holder's record, a primary source, a peer-reviewed paper, or two independent sources) is unmarked. Probable, contested and argued carry their word in the sentence the reader reads, as a word, not a bracket or a code. A contested or argued value never drives a tick, a tile or a clock. No priority claim: "earliest known", never "first", "invented" or "the origin of" (the word "first" inside a quoted title or name is not a claim).
3. **Nothing is invented**: no date, place, placement, route, count, quotation, image, or drawing of a subject that the sources do not give. An approximate place is a soft blot with a line that says so. "Not found" and "not known" are written where they are true.
4. **Open licences only**, as the holder states them: CC0, Public Domain Mark, CC BY, CC BY-SA, ODC-By. Every object record carries `rights_uri` and `rights_checked` (date, by whom, at the holder's record). An accession that does not resolve at the holder to the object named is a stop. A restricted holder is linked, with the reason, never embedded. No OSM/ODbL data; map data and fonts with their licence recorded.
5. **Every image carries, under it and never over it:** holder · accession · date · materials · licence, and the maker as the record names them, or "maker unknown".
6. **Protocol before display.** Anything tied to a living community, a sacred use, a funerary context, coerced labour or a seizure carries a level (1 Notice · 2 content note · 3 display basis · 4 link-out · 5 excluded · 6 held) before it is drawn, and the page draws it. The course notices (Local Contexts Notices, unaltered) and never labels. People moved by force are people: a name or a people card, a content note once, counts as ranges with their counter; never the grammar of goods, never a glyph on a leg. A held item is unpublished and its gap is said in words.
7. **A dispute is two sourced readings**, one above the other, neither coloured, never marked right; the reader's lean is a position.
8. **Every count names who counted and when.** A company's, a fundraiser's or an institution's own figure is labelled as theirs.
9. **Every page says what its sources leave out**: the unnamed makers, the places the record does not reach, the dates it cannot give.
10. **The apparatus is a tap away and never in the reader's path.** Record ids, "as defined by", membership confidence, rights lines, editor notes and build notes render in the editor view or behind a control; the learner view carries the fact, the source's name where it helps ("the Met's record says"), and the confidence word only when it is not documented.
11. **No page that a captioned photograph could beat.** A globe, a scene, a chart or an interactive is built only when it explains something prose and a picture cannot; a listable set of places is a list; an undated journey is a bar with a line that says so. No points, badges, streaks, timers, leaderboards or confetti; nothing auto-advances past five seconds without a control; reduced motion keeps every caption and end state.
12. **A human gate.** A unit ships only after a named person has read the learner view and signed the register (`signed_by`, `date`, `spotcheck` sample and result). Until then every page carries the colophon: which model drafted it, which checks ran, what no human has yet read. Every page shows "originally published / last revised" and has a corrections route; every unit keeps a `CHANGELOG.md`.

## How to use it

Load this first. For research, load `hom-research`; for writing the page, `hom-writing`; for building it, the one family of `hom-design-toolbox` the page needs; run `hom-lint` before anything is called done. If a rule here and a rule anywhere else disagree, this one wins and the other is a bug to report.

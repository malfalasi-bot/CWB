---
name: hom-lint
description: The lints of the F1 "Histories of making" course as code, run by authors and by the eval harness alike: the claims lint (every date and number a register record; confidence words; no contested value on a tick, tile or clock; citation years skipped) and the prose lint (sentence lengths, the apparatus and project-voice bans, priority claims for the judge, doubled labels, codes in the learner view). Run before any page, scene, beat or dossier is called done.
---

# The lints

Two scripts in `scripts/`. Both print one message per finding in the fixed form `<CODE> <where>[ ← <record id>]: <what the file says>, <what the register says>` and exit 1 on any E-code.

- `lint_claims.py REGISTER FILE…` (hom-constitution rule 1–2). Every four-digit year in prose or YAML captions is a value, alternate or display year of a record; a probable, contested or argued value has its word in the sentence; no contested or argued record sits on an element whose class or data attribute marks a tick, tile or clock; accession numbers, citation years ("Jiang et al. 2020", "counted 20 October 2026"), and years inside `<svg>` and sources/cite/credit/colophon elements are skipped. Codes: E-DATE-UNREGISTERED, E-DATE-MISMATCH, E-CONF-MISSING, E-ARGUED-TICK, E-CLOCK, E-EVENT-NOCLAIM, E-PERSON-NOCLAIM, W-CANON-DISAGREES. Three-digit years are scanned when a unit reaches them (`--three-digit`, to add).
- `lint_prose.py FILE…` (hom-writing §4, §10). The learner view only (`<body>` minus svg, script, style and any element classed editor/apparatus/colophon/sources/credit/honesty/waits). Sentence lengths (E over 40; W median outside 14–24; W first sentence over 16); banned apparatus words and the project's voice (E); priority claims reported for the judge (J-PRIORITY: "First Day's Vases" passes, "first made in Berlin" fails at the judge, not here); doubled labels, decimal years and record codes in prose (E); word count outside 400–900 (W).

Still to write, in this order: the scene lint (hom-design-toolbox `scenes.md` §8), the beat lint (hom-writing `beats.md` §6), the protocol lint (every flagged row has a level and the page draws it), the rights lint (every image has `rights_uri` and `rights_checked`), the source lint (every source has `date_accessed`; a dead link warns; no archive for a dead link fails). Each gets a known-good and a known-bad fixture in `fixtures/`.

Fixtures: `fixtures/` holds one known-good and one known-bad page per lint; a change to a lint runs both before it lands.

# The workflow (current, 20 October 2026)

This is the one description of how work on the course is done. It replaces the seven-step method of `skills/hom-design-toolbox/references/method.md` and the four resets before it; each change to it is a `CHANGELOG.md` entry that says what it replaces.

## The loop, for one unit

1. **Research** (`hom-research`). Read `specs/F1.N.md` first; it is the source of truth for the unit's question and success criteria. Pass one: the dossier in twelve kinds. Pass two: verify at the holder, fill the gaps, study how the subject is already presented. Write the unit's register (`atlas/data/register/units/<unit>.yaml`, the only store) and the benchmark of what the content can carry.
2. **Brief** (`hom-research` §6). One page: thesis, claims, objects, argument, living maker, counts, what is left out, the spine, the learner's path, what is still needed. The human reads the brief and decides the spine.
3. **One page** (`hom-writing`, then one reference of `hom-design-toolbox`). The learner view as prose first; then dressed. No system, no fan-out, no second page until the first is read.
4. **Lint** (`hom-lint`): claims and prose; the editor view shows what waits.
5. **The human read.** A named person reads the learner view on a phone, says the thesis back, names the first thing learned and where they stopped. Changes go back to step 3. Where possible a five-reader think-aloud (`research_notes/Reader tests/`, protocol to write).
6. **Freeze and sign.** Spot-check (link works · page is about this · page says this value) on a sample and every documented record on a tick; the editor signs the register header; tag `claims-<unit>-v1`; the colophon switches from "unreviewed" to the reviewer's name and date; the spec's rows are updated to say what now exists.
7. **Then the rest of the unit**, page by page, and only then the Atlas links, scenes and tools the brief said earn their place.

## Standing rules

- Every page: colophon (model, checks run, what no human has read), "originally published / last revised", a corrections route; every unit: `CHANGELOG.md`.
- Every source: kind, URL, date accessed, archive copy; a dead link warns; a dead link with no archive fails.
- Every object: `rights_uri`, `rights_checked` at the holder; a mismatch is a stop.
- Sensitive content: a protocol level before display; a named reader for each held community; nothing on forced movement publishes without the reader.
- Two views from one source: learner and editor. Build notes never reach the learner.
- Evals (`skills/EVALS.md`) run behind the human gate, not in front of it; three seeds; same access for both arms; runner-captured timing.

## Build order (the audit's recommendation; the user decides)

1. Fix the harness (`skills/EVALS.md` §harness) and re-baseline.
2. Three syllabus units to a readable page: F1.13 (fetch its five open images, fix its eight lint errors, write its learner view from the brief), F1.25 (the only written tour), F1.8 with the Edo unit folded in as its case. The ballet brief is ready as the writing skill's first instance and can go first or fourth.
3. Data: the canon's source column on R1/R2 rows; the Pleiades join for the 495 places; the two sweeps ("Smithsonian (CC0)" wording; "First" rows); protocol levels on the flagged R1/R2 rows; the register migration into one store; `coverage.py` fixed; README counts by script.
4. The 21 decisions of 3 October answered; readers named for the 13 held communities.
5. Only then: more framework.

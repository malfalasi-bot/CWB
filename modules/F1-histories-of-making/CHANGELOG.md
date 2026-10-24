# Changelog

## 25 October 2026, topics and the Atlas concept unit

- **Decisions** (`DECISIONS_2026-10-25.md`): history first for every subject and concept; Prediction first dropped (35 of 38 specs open on a one-tap reveal; each is rewritten when its unit is next written); Object first only for an object, widened to its story; the long version is the Atlas concept unit; design E for the worked example and the macro view (default, awaiting the owner).
- **Topics** (`topics/`): one folder per Atlas concept unit, with `research/`, `planning/` and `learner/` side by side. Ballet moved in from `research_notes/Ballet/` and `build/units/ballet/` (a notice stays at the old path). `topics/README.md` sets the layout and the versioning rules; `topics/_template/` starts a new topic.
- **Versioning** (`tools/content_versions.py`, program level, standard library only): front matter with version, status, body hash, sources with git blob shas and a change list; `history/<version>.md` snapshots; `check`, `bump`, `confirm`, `init`, `index`, `manifest`. Run by CI in the new `content-versions` job. Tags `<content_id>@<version>`.
- **Template** `briefs/ATLAS_CONCEPT_UNIT_TEMPLATE_v2.md`: twelve research angles, three review gates, the unit's shape (history-first chapters, a returning worked example, motif walls, object studies, three paths), writing, placement, quality and versioning. Extends `PAGE_TEMPLATES_v1.md` §1, which stays as the record layer.
- **Ballet:** gap research G1 to G4; `planning/BLUEPRINT.md` (13 chapters, about 41 hours); `planning/decisions/EXEMPLAR_STUDY.md`.
- `hom-writing` §1 gains the history-first rule and points to the concept-unit template.

## 21 October 2026, the ballet loop

- `WORKFLOW.md` gains step 5, the board of six personas before the human read, with the round files under `research_notes/<unit>/board/`. Replaces nothing; it fills the gap between lint and the human gate that the ballet page exposed (lints clean, eleven faults).
- `hom-writing`: guess before the paragraph it tests and no answer in the next heading or figure key; objectives in sayable words and checked against the finished page; told figures with the teller in the sentence and the register rule "a told figure, labelled as the teller's in the sentence"; negatives scoped to what was read; schematic figures with a numbered key when no photograph is free; people named from press sources carry provenance and a removal undertaking; a named person stays only with a number or a line of their own.
- `hom-lint`: `lint_claims.py` reads the header + sources + records register shape; `lint_prose.py` strips hidden chips, apparatus, aside and footer. Known gap: the claims lint checks years only; told numbers and names are checked by the board, not by script.
- Register `atlas/data/register/units/ballet.yaml` to revision 3: 34 records, 28 sources, 14 people, `spotcheck_sample` filled from the board's checks. Page `build/units/ballet/the-shoe.md` v3 (v1 and v2 kept beside it).


Format: Keep a Changelog. Each entry says what changed and what it replaces.

## 2026-10-20 — ecosystem v2

### Added
- `skills/hom-constitution` (twelve invariants; the human gate; the colophon), `skills/hom-writing` (the learner, objectives, reading orders, paragraph, captions, leaving out, guesses, when not to build, two views), `skills/hom-research` (two passes, twelve kinds, source tiers, verification, spot-checks, access dates, the register, thresholds, the brief), `skills/hom-lint` (claims lint, prose lint).
- `WORKFLOW.md`, this changelog, `skills/EVALS.md`.
- `research_notes/Ecosystem review/` (four audits and `FINDINGS.md`).

### Changed
- `skills/histories-of-making-design` → `skills/hom-design-toolbox` (a router SKILL.md; the v3 SKILL.md kept as `references/overview-v3.md`; `beats.md` moved to `hom-writing`). The old name is a one-paragraph router.
- Contradictions resolved in the toolbox references: confidence words in captions (allowed with the word in the sentence); the accents as Edo L5/L6 colours (exception written beside the rule); no clock on dateless pages; 1.2 s per leg; 2.5–4 s per tick; ≤ 9 ticks per focus; 3–7 shots; "no first" is a priority-claim rule; scene schema gains `content_note` and `clock.claim`; seven highlight kinds; "68 characters" is the measure; eras take no colour.
- The single register store is `atlas/data/register/units/<unit>.yaml` (migration of `claims_specs_v1.csv`, `claims_v0.csv`, Edo's `content.json` sources and F1.13's `claims.yaml` is a task).

### Replaced
- The seven-step method (`method.md`) by the loop in `WORKFLOW.md`.
- The research schema (events, journeys, objects, groups, people, arguments) by twelve kinds.
- The eval harness's keyword assertions by the evals in `skills/EVALS.md` (to implement).

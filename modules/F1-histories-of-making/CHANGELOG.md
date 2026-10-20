# Changelog

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

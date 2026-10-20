# Published links (claude.ai Artifacts)

| Piece | Folder | Link |
|---|---|---|
| Edo and the floating world (v4; includes the Desks, Workshop and Views rooms) | build/units/edo | https://claude.ai/artifact/73RSURL2MWqJpyJuh4mdh6 |
| Atlas of Making (the hub) | build/atlas-hub | https://claude.ai/artifact/EpQh77TKiuqa5ot5dMowQ8 |

| Edo Concept Composer (all versions, feasibility, teaching methods, final brief) | build/compiler | https://claude.ai/artifact/FztXX3RBg7D8KcR2AQ14Aa |

Superseded on 4 October 2026 (published by an earlier pass that planned separate pieces; their content now lives inside the Edo unit and the Atlas above):
The Print Desks https://claude.ai/artifact/Qu4AiUxBdmiaycRs9AcjKp · Edo Print Workshop https://claude.ai/artifact/UMadfVGh6pAasUYG1UdRFX · Atlas of Making (first version) https://claude.ai/artifact/KofGwdTPrtaCgLG8ykoBYi.

## Hand-off between pieces
Each artifact has its own origin and storage, so pieces pass progress in the link.
Only a plain `#token` (letters, digits, `.` `_` `~` `-`) reaches `location.hash`.

Format: `#ink.<unit>.<items>` where `<unit>` is a short unit code (`edo`) and `<items>` is a `~`-joined list of
node or step codes the learner engaged, e.g. `#ink.edo.tsutaya~hokusai~e1842~desk-seal~wave`.
- Atlas reads `#ink.*`, stores it in its own localStorage (try/catch), and inks the matching nodes and the unit territory.
- The Atlas links into a piece with `#from.atlas` (the piece shows a "Back to the Atlas" link).
- Pieces link to each other with a plain anchor of a scene id, e.g. `.../73RSURL2MWqJpyJuh4mdh6#b4-3`.

## Study (12 October 2026)
- Edo motion, layers and focus: https://claude.ai/artifact/ScB2y7em7CwFptFwphxbgR (page) · `reports/Edo motion, layers and focus.md` · inputs in `research_notes/Motion layers and focus/`
- The decisions of 12 October are recorded in the Composer's db (`decisions/<dimension>`) and in `research_notes/Motion layers and focus/STUDY.md` §1.
- Edo scenes and the framework (study 2): https://claude.ai/artifact/PBGj46jyL1YK6BZaVnpJ3L (page) · `reports/Edo scene framework.md` · `research_notes/Motion layers and focus/{scenes.md, scenes.json, FRAMEWORK.md, beats_study.md, editorial_process.md}`
- Answers of 12 October (late): instrument guesses cover the checks; lectures as a side panel and a room; Atlas lectures by chapter; v4's look is the finish.

## Design language (20 October 2026)
- Reference study (twenty references): https://claude.ai/artifact/RocimpNhz1XZMAF4bGPt2c · `research_notes/Design language references/references_study.md` · images in `refs/`
- The skill: `skills/histories-of-making-design/` (SKILL.md, references/components.md, tokens.css, checklist.md); evals in `evals/`; grading script in `skills/histories-of-making-design-workspace/grade.py`
- Expandability study (the language against all 38 units and 21 grouping kinds): https://claude.ai/artifact/9U6KpHe1678oe9KH1d6FpR · `research_notes/Design language expandability/` · the skill is now version 2 (28 components, scripts/calendars/protocol/identities/method references)

## Design language v3 (20 October 2026)
- Skill: `skills/histories-of-making-design/` — v3 folds in the motion/layers/focus study and the scene framework (`references/scenes.md`), the beats study (`references/beats.md`) and the editorial process (`references/claims.md`); components 29–33 (scene player, lane chart with focus, scene sheet, station player, inline widget).
- Evals 6–8 (journey scene, beats from stations, claims register + lane chart): `skills/histories-of-making-design-workspace/iteration-3/` — review.html, benchmark.md.

## F1.13 method run (20 October 2026)
- `research_notes/F1.13 method run/` — research, benchmark, inventory, claims.yaml (94 records) + lint, plan, STUDY.md.
- `build/units/f1-13-method/` — scenes (S2 galleons, S3 Omar ibn Said mocks), text (lectures.yaml, beats.yaml, scene sheet), lane-chart (+ arguments), grouping-indian-ocean.

## Ballet (20 October 2026)
- `research_notes/Ballet/` — pass1_dossier.md, pass2_verify.md, pass2_body.md, pass2_presentation.md, BRIEF.md (the teaching brief), RETHINK.md (the constitution and the new loop).

## Ecosystem v2 (20 October 2026)
- `WORKFLOW.md`, `CHANGELOG.md`, `skills/EVALS.md`; skills `hom-constitution`, `hom-research`, `hom-writing`, `hom-design-toolbox` (was histories-of-making-design), `hom-lint`.
- `research_notes/Ecosystem review/` — audit_repo.md, critique_content.md, best_practice.md, critique_skill.md, FINDINGS.md.

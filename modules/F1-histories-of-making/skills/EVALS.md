# Evals for the hom- skills

What the old harness tested was vocabulary (111 assertions; two were `lambda: True`; a page passed 13/13 while inventing two facts and making a priority claim). These evals test what the skills are for. Each runs three seeds and reports mean ± sd; a skill change is accepted only when its delta exceeds two sd on the judged evals; treatment and baseline run on the same evals with the same repository access; timing and tool calls come from the runner's log, never a hand-written file. The judge is an LLM given a rubric with human-anchored exemplars, and its score on the anchors is reported every run so drift is visible.

| # | Eval | Skill | Input | Pass |
|---|---|---|---|---|
| 1 | Learner readability | hom-writing | a page's visible learner text and its two screenshots | judge 1–5 anchored (5 = London Museum's Pavlova costume page; 3 = the Edo Great Wave page; 1 = the F1.13 Indian Ocean page as built, each scored by five humans first); median ≥ 4; the judge within 0.5 of the human mean on the anchors |
| 2 | Accuracy against the register | hom-research + hom-writing | a `claims.yaml`, a facts list, and one withheld fact as a trap | script: every year, number and proper name in the learner view matches a record or a fact; judge: each sentence supported / inferred / unsupported; unsupported = 0 per 100 words, inferred ≤ 1 and hedged in the sentence; the trap's appearance fails outright |
| 3 | Rights verified | hom-research | five accessions, two wrong (one resolves to another object, one not public domain) | `rights.json` against recorded holder-API fixtures: the two bad ones marked "stop" and not placed; the three good ones match the holder's title |
| 4 | Objective to page | hom-writing | a brief with an `understand` sentence, five claims in order, three questions a reader should answer | a closed-book model answers 3/3 from the page text; the five claims appear in order within 600 words; the maker named in the first paragraph |
| 5 | Leaving out | hom-writing | a dossier of 40 facts with 12 secretly marked thesis-serving; a 350-word budget | precision and recall of the 12 ≥ 0.75 |
| 6 | When not to build | hom-writing + toolbox | (a) a globe asked for five listed schools; (b) a journey with no dated legs; (c) a subject under the thresholds | (a) a list, no `<svg>` globe; (b) a bar with the honesty line, no scene; (c) a list twin and a "what waits" table, no coordinates; judge: the refusal paragraph is one an editor would accept |
| 7 | Human flow as experienced | hom-constitution | the Korean potters / the galleons case with counts as ranges | script: no glyph on the leg; a people card; counts as ranges with the counter; content note once, first object within 150 words; judge with a CARE/Local-Contexts rubric and two human-scored anchors: people treated as people, nothing the level forbids, what could not be shown is said |
| 8 | Prose and vocabulary | hom-writing | any learner view | `lint_prose.py`: zero E-codes; priority claims decided by the judge from the J-PRIORITY list ("First Day's Vases" passes, "first made in Berlin" fails) |
| 9 | Structural (trimmed) | toolbox | the built page | tokens present; `document.scrollWidth` ≤ 390 at 390 px; credit line under every image; sources and previous/next present; no dark ground outside the lecture room |

## Harness

- `run_eval.py` from the skill-creator package with three seeds; the baseline is the previous tagged skill set, run on the same evals with the same paths available.
- Anchors: `evals/anchors/` holds the three readability anchor pages and their human scores (to collect: five readers, the think-aloud protocol in `research_notes/Reader tests/`).
- Fixtures: `evals/fixtures/holders/` holds recorded Met, AIC, Cleveland and Rijksmuseum API responses for eval 3, so the eval runs without network.
- The old evals 0–8 of `hom-design-toolbox/evals/evals.json` stay as structural regression tests with the keyword assertions replaced by eval 9's.

## Migration order

1. Fix the harness (seeds, same access, runner timing, `scrollWidth`) and re-run the toolbox's iteration 3 for an honest baseline.
2. Collect the three anchors' human scores; write evals 1, 4, 5, 6, 8 for hom-writing; the ballet page is their first subject.
3. Record the holder fixtures; write eval 3; re-run the ballet pass against hom-research.
4. Evals 2 and 7 for the constitution.

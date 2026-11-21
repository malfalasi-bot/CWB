# R. Independent review of `PLAN_v1.md`

22 November 2026. Reviewer read `architecture/PLAN_v1.md` (cited as PLAN:line), the three studies A1 to A3, `README.md`, `modules/F1-histories-of-making/DECISIONS_2026-10-25.md`, and the ballet topic file by file. Counts were re-measured with scripts over the files. Nothing was committed.

## Verdict

The diagnosis is right and the four-layer model is the right answer. Records, writing, structures and views separate what the Atlas runs together today, and the plan follows the benchmark faithfully. The plan is not yet safe to approve as written. It has three gaps. Its back end would not serve the surfaces it promises under the repository's own runtime rules. It gives one body of unchecked research two destinations, one of them learner-facing. And "nothing is lost" is not yet true for several kinds of ballet material. Seven items must be fixed before the owner decides. None of them needs the model to change.

## 1. Must fix

### M1. The serving path does not work in the runtime the program uses
- **Evidence.** PLAN:183 publishes every surface as an Artifact, and PLAN:179 makes Supabase serve retrieval, Search and Ask. The repository's own runtime note says: "No runtime fetch from other hosts; same-origin fetch of published files works" (`modules/F1-histories-of-making/build/units/edo/ARCH_V4.md:19`). Every Supabase table has row-level security on and no policies, so "nothing can be served from it" (A1 L10). PLAN:34 says learner data "lives only in the database", but no surface can write to it. "Ask" needs a language model, and the plan names none and gives no cost for it, which bears on working rule 2, zero cost (README:42).
- **Fix.** Pick the serving path before P1. One option that works at zero cost is a lexical (and, if wanted, vector) index shipped as published files with each surface, with the partner voice running through the Artifact's own model capability. Supabase then becomes the analysis and rebuild copy, not the server. The other option is a non-Artifact host (A3 §4.1 suggests a static site) with anonymous read policies. In both cases, say where learner data lives until a backend can be reached, and how the voice is paid for.

### M2. The claim about Supabase pausing is wrong
- **Evidence.** PLAN:179: "a free project pauses after a week without activity; the monthly harvest can keep it awake." A monthly job cannot prevent a weekly pause. Supabase's own guidance asks for "a few user requests to the database each day over the previous week". Restoring a paused project is manual, from the dashboard ([Supabase, project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)). The workflows run on the 1st and the 8th of the month (`harvest.yml:7`, `backbone.yml:9`). The error comes from A3 §4.1.
- **Fix.** Add a daily or weekly keep-alive workflow, or accept a paused copy and make sure no surface depends on it (this follows from M1). The CI load also needs a database password stored as a repository secret. The earlier load failed for want of exactly that "direct route" (`supabase/README.md:28`), so list it as a P1 dependency.

### M3. Research and teaching are not kept apart for the 118 deep dives, and the human check comes last
- **Evidence.** PLAN:79 turns the dossiers into documents of form `deep-dive`. PLAN:89 turns the same research, "text untouched", into documents of form `research`. That is two destinations for about 167,000 words, which means either a copy that drifts or a split that edits research files. `topics/README.md:42` forbids editing research files silently. PLAN:41 says research "is never presented as teaching", yet `deep-dive` is a teaching form. The material is largely unchecked. The register has 76 of its 156 rows marked `probable`, and the research marks sources inline as "[documented: Wikipedia]". The Repertory plan puts the human check before cards are written ("Before step 2", `REPERTORY_PLAN.md:134`, §9). The blueprint puts "Before writing: to check at source" before writing (`BLUEPRINT.md:167`). The plan puts the check at B8, after B7 writes learner content (PLAN:135–136), and its pilot writes the *Giselle* card at step 4 (PLAN:98).
- **Fix.** Keep the dossiers as `research`. Anchor each work's section in place, with `about:` per section, rather than copying them. The learner Deep tier and the deep-dive document are then written from the research and versioned. Move the human check ahead of B7 and of pilot step 4. Every script-made claim enters as `status: draft` with no reviewer until a person accepts it.

### M4. Not everything in ballet has a destination yet
The walk in Appendix B finds these gaps in PLAN §6.1:
- **Cross-history synthesis, about 11,000 words.** W1 §11, W2 §0 and §12, W3 §12, and the "Across these works" section that closes each of D1 to D8 (11 sections found). These are the owner's "comparisons across the whole of ballet history". The split test at PLAN:79 drops them, because they are not works.
- **The 17 lessons for world-builders** (`BLUEPRINT.md:134–153`). A2 §3.3 finds about 70 per cent of them reused outside the topic, the highest reuse of any ballet item.
- **Placements.** The ballet links to other modules live in `review/R1_curriculum_fit.md` (§2.1: about twenty F1 tiles; §5.4: thirteen link rows), in the blueprint's Placements section and in the "Linked from" column of its object-studies table. PLAN:90 leaves all of these in `planning/` as "not content". P4 (PLAN:193) generates the link register only "from the 38 specs and the topic READMEs", so the rows would never reach it.
- **From `ballet.yaml`.** Its 28 sources, 14 people, 2 objects and 15-item spot-check sample. The plan maps only the 34 records.
- **Repertory parts.** The 11 era cards; the 18 design-idea cards (the plan makes them essays); the production flag "the version most often seen today"; the inclusion rule with the criterion recorded on each card, and the D8 candidates (`REPERTORY_PLAN.md:57–64, 120`); the debates strip and the poster version.
- **Open images.** Each dossier's "Sources and open images" section has no step that turns it into asset records, though PLAN:149 creates `assets/`.
- **The working Line.** `planning/repertory_page/` (`timeline_widget.js`, `threads.json`, `build_page.py`) and the published Repertory Artifact. Nothing says whether the Line view replaces them or what happens to their links.
- **The claim map in code.** The 40-phrase dictionary in `build/units/ballet/build.py`, and how it becomes inline claim ids. Changing the body forces a version bump under `topics/README.md:27`.
- **Smaller items.** The field-atlas entries in `EXEMPLAR_STUDY.md` §4.2 (the `field` facet exists, but no step fills it); `SPOTCHECK_2026-11-21.md`, which should become review records on claims.
- **Fix.** Add these rows to §6.1, with a "how", and add a check at the end of B4 that every file in the topic is either mapped or explicitly left as planning.

### M5. Ordering and hidden dependencies
- **The pilot depends on later steps.** Pilot steps 5 and 6 (hub page, Line strip, Historian answers; PLAN:99–100) need the schemas, the compiler, the views and retrieval, which are B5, B6 and P1. The pilot that is meant to come "before converting everything" therefore needs most of the infrastructure built first. Either shrink the pilot to layers 1 to 3 plus one generated page, or say plainly that P1's tooling comes first.
- **The move breaks code, and a redirect file does not help code.** PLAN:163 and §10 decision 3 move `atlas/` and `topics/`, but no step says when this happens relative to B2–B6. Paths are hard-coded in `ci.yml:27`, `harvest.yml:29`, `backbone.yml:36`, `depth.yml:29`, `tools/build_schema.py:10`, the discovery glob `modules/*/topics/*/learner/**` (`tools/content_versions.py:145`), and the shoe page's `claims_register` and `derived_from` paths (`the-shoe.md:10–16`). Add an explicit "move" step listing these edits, run before B2, so that generated files land once.
- **Owner decisions are presumed.** The blueprint is "awaiting approval" (ballet `README.md:6`). The Repertory's four decisions are open, among them the eleven eras and R1 as an optional route or a sub-unit (`REPERTORY_PLAN.md:136–141`). Design E is a default only. B4 and the era set assume all of them. List them in §10 as prerequisites.

### M6. The work and production model misapplies its own precedent, and the *Giselle* example does not match the register
- **Evidence.** PLAN:77 folds "Swan Lake 1877, 1895, Ek, Bourne, Masilo" into one work with productions. The Royal Opera House precedent (A3 §2.5) defines a work by "the unchanging elements", including the choreographer. Bourne's *Swan Lake* is a new work in a family, not a production of Petipa and Ivanov's. Folding them together erases the authorship question the unit teaches (chapter 10; the X1 debate "who is the author"). The register has six *Giselle* rows: 1841, Alonso, Ek, Creole, Khan and Masilo. It has no 1884 or 1924 row, yet PLAN:25 and PLAN:96 promise "the work and four productions" from register rows. *Swan Lake* 1877 and 1895 are a single row (`swan-lake-1877-1895`), which a script cannot split.
- **Fix.** Use three things. A `work`. A `production` (a staging of the same work). A `remake_of` relation between works, which carries the family. Then derive the 1884 and 1924 productions by hand from W1 §5 and D7. Restate B2's outcome as about 136 original works plus 20 remake works, with productions added by hand.

### M7. Contradictions with the program's rules
- **One hub** (README:41). PLAN:226 records decisions 1 to 9 in "the module's decisions file". Decisions 1, 2, 3, 5 and 6 are program-level, so recording them in F1's file contradicts both working rule 1 and the plan's own decision 1. Record them in the Hub and export them.
- **Documents are exported, not edited here** (README:45). Decision 4's "voice guide gets a table by form" and any change to template v3 have to be made in Claude Docs. Say so.
- **The confidence vocabulary.** Decision 5 (PLAN:220) picks documented, probable, contested and argued. The program schema says the four levels are "documented, probable, contested (give both readings), interpretive" (`schema/registers.md:35`). The voice guide's W5 uses "argued" as the display word for contested (`docs/02-program/voice-guide/index.md:88`). The 799 spec claims use "interpretive". Choose against the schema, or put the change to it to the owner as a decision.
- **The partner voices' reach.** PLAN:206 says partner voices "answer from the whole Atlas, research included". The Stranger "knows nothing the artifact does not say" (`docs/03-partner-voices/stranger/index.md:7`), and A2 §1.7 rules out the Mirror and the Stranger too. Scope that line to the Historian, the Fabricator, the Client and the Planet.

## 2. Should fix

- **S1. The lecture is only gestured at.** The owner asked for "a full lecture". The plan has "lecture" as a writing form (PLAN:26) and "lecture run" as a structure (PLAN:27), but never says which part goes where: narration versus stations with seconds. No ballet lecture appears in B1–B8. The Motion Canvas pipeline (`build/lectures/`, `build-lecture-json.py`) appears only as "the lecture player" (PLAN:28). F1.13 is one line in P2. Fix: define the lecture as a document (narration with anchors and claim ids) plus a composition (stations, seconds, scenes). Show it on one ballet chapter in B7.
- **S2. Questions from A2 that the plan leaves open.** A2 §6.7 lists seven first decisions. The plan omits M2's comparison (*Giselle* or the Bauhaus, P5a to P5d; A2 items 12 and 13) and the history-first openers outside F1 (item 8). It also leaves out the rule for which concepts get a unit (item 5; P6 names topics without one), the overreach of chapter 12's Apply into fields M2 and R3 own (item 9), the five-minute and reference forms, and the 18-hour Practice path against the template's 12–15 (item 6). Among authors it drops R2, the author of rights and protocol records, and every module's regional slot (A2 §4.3; PLAN:13 and PLAN:63). It also leaves out the packs that are titled "for F1" (item 20).
- **S3. Decision 9 rewrites a principle approved at G1.** Principle 5 has four invariants: "a lab or simulation, an Apply step by lane, a partner step, and a log entry" (`docs/01-structure/final-structure-v3/index.md:108`). "The lab is the Apply" (PLAN:224) merges two of them and drops the log entry. This is a Hub decision and should be put to the owner as an amendment, not as a default.
- **S4. Edo breaks the plan's own layer rule.** PLAN:27 says compositions "never hold knowledge". PLAN:191 says Edo's "story stays a composition", but its 71 beats are 4,083 words of prose. Split the prose into documents and the order into a manifest, or record Edo as an exception.
- **S5. Ids will not survive Artifact links.** Only "letters, digits, `.` `_` `~` `-`" reach `location.hash` (ARCH_V4.md:19). The plan's `work:giselle`, `doc-id#section` and saved views with filters (`REPERTORY_PLAN.md:50`, "every era, work and filter has its own link") need a URL-safe encoding. Rule 2 (PLAN:35) also leaves open which scheme is canonical for new kinds: canon prefix and number with an alias, or `kind:slug`. The new entity kind `document` collides with layer 2's Documents, and the 130 primary texts already have TXT ids. Rename the kind (for example `primary-text`) and reuse the TXT ids. A2 §5.2's `script` kind is also missing.
- **S6. The register cannot yield claims with a source and a locator.** Confidence and `sources` sit on the row, not the field (the register header). So 934 field claims inherit one confidence and a section-level source each. The per-sentence markers in the W files are richer, and the plan does not use them. Say how claims are drafted from them, and how a reviewer's load is estimated.
- **S7. The compiler's toolchain is unstated.** README:57 says "standard library only". The compiler needs a YAML parser (as `build_timeline.py` already does), a JSON Schema validator, Markdown parsing and, for CI embeddings, an ML runtime. Lifting the Edo zod lint into a Python tool means rewriting it or keeping Node in CI. CI minutes are free only if the repository is public. Name the dependencies, and cache embeddings by chunk hash.
- **S8. The industries lens is asserted rather than shown.** Several practice-area mappings are weak: music goes to "F3, S6", training to "F3, R" (R is not a module), and the program has no music module (PLAN:111, 120). "Already researched" is approximate: the Boléro ruling sits in `dossiers/D2` (`bolero-nijinska-1928`), not "Scope 05, G4" (PLAN:121). The owner said "industries, skills and knowledge". Skills (scene painting, pattern cutting, notation, machinery, shoemaking) have no facet, and the ten object studies and the 17 lessons are not linked to the lens. Fix: add a `skill` facet or a column for it, map every object study and lesson, and give a sample of the lens composition for one industry.
- **S9. No effort, capacity or acceptance criteria.** The plan measures pilot time (PLAN:102) but sets no threshold and no decision rule if the time is too high. It gives no hours for B2–B8 or P1–P6, and no human-review load: about 1,100 claims, about 125,000 planned learner words (A2 §3.1), and 390,000 research words to check. The owner is the human gate. Give a range per step and a stop rule.

## 3. Consider

- **C1.** Store the ROH-style "performance" level only if casts are wanted. The plan is silent on it.
- **C2.** The E0–E10 to B01–B11 mapping (PLAN:84) is many-to-many at the edges (E0 spans 1450–1580). State the rule.
- **C3.** The shoe page is called "the template for the others" (PLAN:80), but it opens with "Before you read on, choose one" (`the-shoe.md:30`), close to what decision 2 forbids (`DECISIONS_2026-10-25.md:10`). The blueprint also re-kinds it as `object-study` at 1.0.0. Call it the data template, not the writing template.
- **C4.** Generating seeds by CI and committing them (PLAN:160) bloats git. The repository already holds 601,955 words of SQL. Load from CI without committing.
- **C5.** The content graph as one data file will hit the 16 MB cap once several topics exist. Shard it by topic and kind from the start.
- **C6.** The Composer's decisions live in an Artifact database outside git (A1 L11). Under rule 1, git is the source, so say whether this is an exception.
- **C7.** The SRC schema change that lets learners cite Atlas ids (A2 gap 19) appears in no step. Add it to P4.

## 4. What a sceptical owner would push back on

1. "You are replacing a limiting map with a limiting schema." Answer with M3 and S9: show one *Giselle* hub, card and Line strip built from the files, with the hours it took.
2. "Where is the lecture I asked for?" (S1).
3. "Bourne is not a production of Petipa." (M6.)
4. "Who checks 1,100 claims, and when?" (M3, S9).
5. "Will Ask work without paying for anything?" (M1).
6. "What happens to the Repertory page I already have?" (M4).

Is the plan concrete enough to act on? For ballet, §6 mostly is. P2–P6 are one line each, and the plan has no sample file: no claim YAML, no front matter for a deep dive, no unit manifest. One worked sample of each, for *Giselle*, would make the plan checkable and answer most of the questions above.

## Appendix A. Coverage of the owner's request

| Part of the request | Where | Verdict |
|---|---|---|
| The format cannot hold the data; the structure is too limiting | §1, §4 | Answered |
| Any size, from card to lecture to unit, not all on a map | §4.1 rule 3, §7.4 | Answered for cards and units; the lecture only gestured at (S1) |
| Study the back end, repository, Atlas, units, lectures and timelines | §2, §7 | Back end answered but not workable as designed (M1, M2); lectures thin |
| Benchmark | §2, A3 | Answered; the ROH precedent misapplied (M6) |
| How it can be done; benefit to other units and lectures | §7, §9 | Benefits stated in one line each; no effort (S9) |
| How much belongs in the Atlas, how much elsewhere | §5 | Answered qualitatively; no projected Atlas size |
| A plan for everything, starting from ballet | §6, §8 | Ballet concrete; the rest one line each |
| Lose nothing from ballet (blueprint, timeline, Repertory) | §6.1 | Gaps (M4) |
| Design and art | X2 row, §6.3 | Covered; open images and design-idea cards missing (M4) |
| Ballet as a world of industries, skills and knowledge | §6.3 | Industries yes; skills no (S8) |

## Appendix B. Walk of `topics/ballet/` (95 files)

There is no top-level `repertory/` folder. The Repertory lives in `research/repertory/` and `planning/repertory_page/`.

| Material | Destination in §6.1 |
|---|---|
| `README.md`, `CHANGELOG.md`, `MANIFEST.md`, `CONTENT_INDEX.md` | Implicit (moved with the topic; counts by script) |
| `learner/the-shoe/` and `history/0.1.0`, `0.2.0` | Kept; the history snapshots and the re-kinding not mentioned (C3) |
| `research/` passes, scope, scope2, products, `RESEARCH_SCHEMA.md`, briefs | Research documents |
| `works/W1`–`W3` (35 works) | Deep dives "combined with D7". **Untested:** the W files use numbered bold labels (Premise, Roots, …), not the 13 headings, and some sections hold two works (W1 §3, W2 §10, W3 §5, §7) |
| W1 §11, W2 §0, §12, W3 §12; D1–D8 "Across these works" | **None** (M4) |
| `works/W4` | Research |
| `dossiers/D1`–`D6`, `D8` | Deep dives; also research (M3) |
| D5 and D8 "Register update", D8 "Candidates" | **None** (M4) |
| `register.yaml`, `register_updates_2026-11-21.md` | Entities and claims (M6, S6) |
| `timeline_events.yaml`, `timeline.json`, `build_timeline.py` | Events and the Line view |
| `apply_register_updates.py`, `SPOTCHECK_2026-11-21.md`, `CENSUS.md` | The census goes to walls; the spot-check has none |
| `X1`, `X2` | Disputes, myths and essays; X2's 7 design disputes are left out of the B3 count; design-idea cards none |
| `planning/BLUEPRINT.md` | Composition; the 17 lessons, object-study links and placements none |
| `planning/REPERTORY_PLAN.md` | Compositions; era cards, the inclusion rule and the debates strip none |
| `review/R1`–`R3`, `REVIEW.md`, `decisions/`, earlier plans, `board/` | "Stay in planning"; the R1 link rows and the EXEMPLAR field-atlas entries are lost (M4) |
| `planning/*_page/` (4 HTML pages, the timeline widget, `threads.json`) | None (M4) |
| `atlas/data/register/units/ballet.yaml` | 34 records only (M4) |

## Appendix C. Spot-checks

| # | Statement | Result |
|---|---|---|
| 1 | `register.yaml` has 156 rows (PLAN:77) | Correct |
| 2 | 20 rows are marked remakes | Correct (`based_on: remake of …`) |
| 3 | About 135 works | Consistent (156 − 20 = 136) |
| 4 | 82 D-file works split into all 13 sections (PLAN:79) | Correct; median measured at 1,646.5 words against 1,663 stated |
| 5 | 35 W-file works plus D7 | D7 has 35 entries; the W structure differs (Appendix B) |
| 6 | 155 events | Correct |
| 7 | X1: 18 debates, 38 myths, 13 cross-currents | Correct |
| 8 | Fourteen blueprint walls | Correct (counted chapter by chapter) |
| 9 | The unit is about 41 hours | Correct (2+3+3+4+3+4+3+4+3+3+3+4+2) |
| 10 | `ballet.yaml` holds 34 records | Correct; also 28 sources, 14 people, 2 objects |
| 11 | 934 register fields | Reproducible as 6 fields × rows that have them; confidence is per row (S6) |
| 12 | 137 corrections of 21 November | Correct (`register_updates…`, "Applied (137)") |
| 13 | `atlas/tools/codes.py`, `validate_canon.py`, `build-content.mjs`, `lint_claims.py` exist | Correct |
| 14 | 54 seed files never loaded | Correct (`supabase/README.md:28`) |
| 15 | 255 files and 16 MB per Artifact | Correct, but the same source forbids runtime fetch (M1) |
| 16 | *Giselle*: the work and four productions from register rows | **Incorrect**: 6 rows, and no 1884 or 1924 row (M6) |
| 17 | "works" among the canon rows that never reach the learner (PLAN:7) | **Incorrect**: no `work` kind exists |
| 18 | The monthly harvest keeps Supabase awake (PLAN:179) | **Incorrect** (M2) |
| 19 | The Boléro ruling is in "Scope 05, G4" (PLAN:121) | **Incorrect**: it is in D2 |
| 20 | "Materials, crafts and design movements … 30 to 50 per cent" (PLAN:13) | Loose: A2 gives crafts 25–35 |
| 21 | The confidence vocabulary of decision 5 | Conflicts with `schema/registers.md:35` (M7) |
| 22 | `content_versions.py` covers one folder pattern | Correct (line 145) |

# Atlas concept unit, template v2

25 October 2026. Every novel concept in the Atlas (an art form, a movement, a school, a style, a network) is taught as a comprehensive unit of its own, so that the Atlas is itself a course a learner can take. Ballet is the first instance and the worked example of this template (`topics/ballet/`).

This template extends the movement page of `PAGE_TEMPLATES_v1.md` §1. That page's responsibility block, facts block, claims, nodes, open objects, people and credit, visual plan, readings and risks, and fact-check list stay, as the unit's **record layer**. What is new is the research it requires, the shape of the unit the learner reads, how the writing is done, and how the content is versioned.

## 1. The decisions it rests on

1. **History first.** Every subject, concept and newly introduced topic opens with its history, lineage and stories, and demonstrates its concepts and elements through them (course owner, 25 October 2026). There are no prediction or quiz openers.
2. **Object first only for an object.** When a chapter teaches something specific about an object, it may open on the object, and it then widens to the object's history, making, technique and methods, told as a story.
3. **One worked example and a macro view.** Each unit follows one work through every chapter where it has a version (the worked example), and sets many works side by side on comparison walls (the macro view). Comparison after a worked example is what transfers (Gentner and others 2003; Alfieri and others 2013; Paas and van Merriënboer 1994).
4. **Records are not teaching.** Research fields stay as the record behind each Atlas card. What the learner reads is written in sentences, in the voice guide's tiers, with causes ("because", "so that") and one question at the top.
5. **Content sits next to its research, and is versioned.** Every learner file lives in the topic's `learner/` folder beside `research/`, names the research it was written from, and cannot change without a new version (`topics/README.md`).

## 2. The three layers

| Layer | What it holds | Who reads it |
|---|---|---|
| **Record** | Research by angle; the works or members register; the claims register; people; products and collections; open objects; the facts and responsibility blocks | Editors, the partner voices, the Atlas jobs |
| **Atlas cards** | Every node of the topic (work, person, object, place, institution) in the voice guide's four tiers: Line (16 words), Label (50 to 60), Story (150 to 250), Deep (600 to 1,200) | Learners browsing; units that link to a node |
| **The unit** | Chapters of walks, object stories and comparison walls, written from the record | Learners taking the topic as a course |

## 3. The research: twelve angles

A concept unit is not written until every angle has a scope file. Each scope file holds: a knowledge map in three tiers (must, should, could know); the lineage (a dated sequence, global where the record allows); eight to fifteen sourced stories; the concepts and debates; lessons for world-builders; objects, documents and open images with their licences; gaps and traps. Claims are marked documented, probable, contested (both readings) or argued.

| Angle | What it must find | Ballet's files |
|---|---|---|
| **A. Lineage, institutions and patrons** | Where the concept began and how it was carried: courts, academies, schools, states, firms | `scope/01` |
| **B. Makers, bodies and technique** | Who makes it and how they are trained; the hands, the body, the method | `scope/02` |
| **C. The works as made concepts** | Each major work as a concept someone had: idea, sources, team, world rules, look, family, launch, afterlife | `works/W1`–`W3` |
| **D. The internal grammar** | The concept's own vocabulary, components and composition (for ballet: music, mime, the pas de deux and the corps) | `scope2/G1` |
| **E. Objects, materials and workshops** | The things made for it, their materials, their makers, their workshops | `scope/03` |
| **F. Space and setting** | The stage, the building, the site | `scope/04`, `scope2/G2` |
| **G. The experience and the audience** | What it is like to be there; who could attend; the ritual; access | `scope2/G2` |
| **H. Money, labour and ownership** | Who pays, who is paid, who owns the work | `scope/05` |
| **I. The record, media and handover** | How it survives and travels: documents, images, film, notation, technology and AI | `scope/06`, `scope2/G3`, `scope2/G4` |
| **J. Routes and reach** | How it spread beyond its centre, and who was kept out; the regional slot's structure | `scope/01` §F, `works/W3` |
| **K. Afterlives, products and collections** | Remakes; translations into fashion, film, toys and brands; product families | `products/`, `works/W3` |
| **L. Scholarship, archives and teaching** | The scholarly base, the archives, open images, how it is taught elsewhere, how it is presented online | `scope/06`, `pass2_presentation.md` |

Alongside the angles: a **works or members register** (every work or member at index depth, the core at short-card depth; `repertory/register.yaml`), **motif walls** (recurring ideas across many works; `repertory/CENSUS.md` §4), the **theories of the concept** (how its makers described making it; `works/W4`), and the **claims register** (`atlas/data/register/units/<topic>.yaml`).

**Review gates before any learner text is written:** curriculum fit (does it use the program's units, cards and voice), subject gaps (what a historian and a designer would miss), and writing (does it read as teaching). Each review is run by a reader who has not seen the planner's conclusions. Ballet's are `planning/review/R1`–`R3`.

## 4. The unit

### 4.1 Shape

- **An opening chapter** that tells the concept's whole lineage as one story walk (six to nine steps, earliest known to now), and the worked example in miniature.
- **Eight to twelve chapters**, each two to four hours, in historical order unless the subject demands otherwise. Each chapter:
  1. **opens on history**: a dated moment, a named person, what happened and why (Story first);
  2. **demonstrates the concept and its elements** through that story and the works of its period;
  3. **takes one or two works apart** as made concepts (walks in the order of a design job: brief, sources, idea, world rules, execution, launch, afterlife);
  4. **holds its object studies** where the object first mattered (object stories in making order, widened to history, technique, method, the product family, and life off the stage), linked from any other chapter or module that needs them;
  5. **sets works side by side** on one motif wall, entered through a pair;
  6. **says what it teaches a world-builder**, in plain sentences;
  7. **ends with a say-back** (one sentence saved to the learner's record, never scored), an **Apply** task in each lane, and a **closing contribution** to the learner's sources record.
- **The worked example** returns in every chapter where it has a version, so the learner sees one concept made, remade and handed on. A counter-example returns at fixed points.
- **A closing chapter**: the lessons for world-builders gathered, the field-atlas entries the topic supplies, and the learner's own world placed in a lineage.

### 4.2 Paths through the unit

| Path | What it covers | About |
|---|---|---|
| Orientation | The opening chapter, one chapter's walk, the lessons | 2 hours |
| Practice | The opening, four to six chapters chosen by the learner's route, the walls | 12 to 15 hours |
| The full unit | Every chapter, every object study, every wall | 35 to 45 hours |

Units elsewhere in the program link to a chapter, a walk or a card; they never re-tell the history.

### 4.3 Forms

| Content | Form (program numbers) | Notes |
|---|---|---|
| A lineage or a period | Scrollytelling (1) or a timeline scrub (11) | Opens every chapter |
| A work as a made concept | A walk as a step-through (2), with one design drawing as an object story (3) | Seven steps in design-job order |
| An object | An object story (3), the build as sequential illustration (14), a before-and-after (5) | One idea first, parts before steps, one step per screen |
| A motif across many works | A pair, then a comparison wall (10), then a map (12) or timeline (11) | The principle is named after the comparison |
| A product family | A step-through (2) that builds the family; an explorable (4) where a naming grammar exists | Anchor, what may vary, what may not, naming, life off the stage |
| A dispute | An argument card (13) | Both readings, equal grammar |
| Motion, sound, touch | Video (7) or audio (8), only where motion, sound or touch carries the meaning | Link out where the licence requires |

## 5. Writing

The program voice guide applies in full (`docs/02-program/voice-guide/`). In addition, for concept units:

- **One through-question and one theme sentence** on the first screen of every chapter, walk and object study.
- **Every fact earns a cause or a consequence.** Join facts that the research holds in different places (a director in a hurry, so the set was reused).
- **At most three new names per screen**, each with a role on first mention. Names that carry no idea in a step stay in the record.
- **Attribution lives in the structure**: tombstone captions under images, a source line per step, the claims register. Sentences stay short and still honest.
- **Headings say the claim** ("The idea came before the shoe"), not the field ("Built from").
- **Retrieval after, never before**: say-backs, Apply tasks that fill a second record from given sources, and the worked example's returns.

## 6. Placement in the program

- **F1:** lead placements where the topic answers a unit's essential question; tiles elsewhere, each beside a case from another world chapter. Ballet's map is `planning/review/R1_curriculum_fit.md` §2.1.
- **Method and practice areas:** cases handed on through the link register (premise and bibles to M1.11a; the Concept DNA reading to M2; collection logics to M3; remaking to M4; space and experience to S1; product families to S2; wearables to S3; identity to S5).
- **The regional slot:** the program supplies structure and documented institutions as Atlas cards; a local author writes the slot (F1.31).

## 7. Quality and versioning

1. Research complete: twelve angles, register, walls, theories, claims.
2. Reviews R1 to R3, by readers who have not seen the plan.
3. Blueprint approved: chapters, opening stories, works, objects, walls, paths.
4. Writing, chapter by chapter, each file initialised at 0.1.0 with its sources.
5. Checks: the program's prose and claims lints; `tools/content_versions.py check`; a read by the program's four personas; the fact-check list at source.
6. The human read, then status `approved`, a version bump and a git tag.

## 8. Size

Ballet's research is about 208,000 words across 26 research files. A comparable topic needs eight to twelve research passes, three reviews, a blueprint, and about 40,000 words of learner text at full depth, of which about 10,000 are Atlas card tiers.

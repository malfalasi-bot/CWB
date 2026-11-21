# One knowledge base, many ways in: the content architecture plan

22 November 2026. Version 1, for the course owner's decision. Built on three studies in `study-2026-11/`: the repository inventory (A1), the curriculum's use of the Atlas (A2) and a benchmark of content architectures (A3). It keeps everything made so far, starting with ballet.

## 1. The problem in one paragraph

The Atlas was built as a map of short records. Each canon row holds one or two sentences (median 17 words, maximum 60), and the longest text the Atlas design allows is a 1,200-word Deep card. Anything longer, whether a chapter, a lecture, a deep dive, a whole unit or a timeline, has no type in the Atlas. So it piles up in folders the Atlas cannot see: ballet's 390,000 words of research and 156 works have no canon row at all. The map is also the only way in, and only things with a place can stand on a map. About 3,900 of the 4,666 canon rows (people, techniques, periods, styles, movements, works) never reach the learner. Each surface (the Atlas hub, the Edo unit, the F1.13 lecture, the ballet page, the grouping pages) invented its own format. Facts are kept in ten claim stores with four confidence vocabularies. The database is a stale copy of flat text. The owner's sense that the format keeps limiting the content is correct, and the cause is structural (A1 §3).

## 2. What the studies found

**The repository (A1).** 1.6 million words of Markdown and 0.7 million in registers, almost all research, planning and specification. Learner text is small: one ballet page, the Edo unit, one lecture, the grouping pages. The design for a full Atlas record, decided in Deep Dives 1 (four text tiers, typed relations, media, rights, upkeep), was never built. Twelve limits are ranked in A1 §3. The things that already work and must be kept are listed in A1 §5. They include the harvest discipline, the licence switch, the 1970 provenance test, the claims register's record shape, content versioning, the CI checks, the Edo content lint, the learner and editor views from one source, the topic folder, and the hub's honesty rules.

**The curriculum (A2).** Outside F1, about 80 of the program's roughly 425 other units need historical, cultural or material knowledge. They take small pieces: a card at Label or Story depth, one document, part of an object study, part of a comparison wall, a set of claims, a saved timeline view. No placement takes a whole chapter. For ballet, about 85 to 88 per cent of the material lives only in the topic, and 15 to 20 per cent of its knowledge items are used elsewhere. Materials, crafts and design movements are reused most (30 to 50 per cent); civilisations least. Eight modules should write history into the Atlas, not only read from it: F1, F2, F4, S1, S3, S4, S5 and S6, plus M2 for the field atlas. The documents disagree about whose Atlas it is, F1's or the program's (twenty gaps and contradictions, A2 §6).

**The benchmark (A3).** No mature system lets the display hold the content. Museums (Linked Art, the Royal Opera House's work, production and performance), encyclopaedias (Wikipedia and Wikidata, Britannica, Oxford Reference), publishers (DITA, OpenStax, MDN), broadcasters (NPR's COPE, the BBC) and course platforms (Open edX) all keep four things apart. These are records of what is true, documents of any length, compositions that put documents in order for a reader, and views generated from the three. Britannica writes each reading level separately, tied to one topic, so the Atlas's four tiers should be written by a person and bound to one entity, not generated. All of it can be done at zero cost with git as the source and Postgres as a rebuilt copy.

## 3. The decision this plan asks for

**The Atlas becomes the program's knowledge base, and the map becomes one way into it.** Everything the program knows about the history of making is held once, at any length, in four layers, and every surface (the map, the line of time, a card, a lecture, a full unit, a partner voice) is built from those layers. F1 is the Atlas's first author, not its owner. Every module may cite it, and eight modules write into it.

## 4. The four layers

| Layer | What it holds | Form | Example from ballet |
|---|---|---|---|
| **1. Records**: what is true, and how we know | **Entities** (anything the course talks about: a work, a production, a person, an object, a place, an institution, an event, an era, a technique, a material, a movement, a document); **claims** (one citable statement each, with subject, value, source and locator, confidence, rank, reviewer); **sources**; **assets** (images, clips, designs, each with its licence class) | YAML and CSV in git | `work:giselle`; its productions 1841 Paris, 1884 St Petersburg, 1924 Paris from notation, Alonso's Havana; the claim "Gautier wrote 'Les Wilis, a ballet' on a sheet in 1841", documented, with its source |
| **2. Writing**: what we say | **Documents** of any length, each about one or more entities, in a declared **form**: card, deep dive, chapter, lecture, essay, dispute, myth, object study, page, activity, research. Length belongs to the form, not to the Atlas | Markdown with front matter, sections with permanent anchors, facts cited by claim id | The *Giselle* card (Line, Label, Story, Deep); its deep dive in thirteen sections; chapter 3 of the unit; the debate "Who is the author?"; the myth "Taglioni was the first on pointe" |
| **3. Structures**: how it is put together for a learner | **Compositions**: ordered lists of references with framing, time and audience: unit, chapter, session, lecture run, route, wall, timeline, map layer, exhibition, path | YAML manifests in git; they hold order and transitions, never knowledge | The thirteen-chapter unit with its sessions and minutes; the Repertory's eight routes; the 24 motif walls; the line's eras and lanes |
| **4. Views**: how it is seen | Generated surfaces: **the Map**, **the Line** (time), **Connections**, **Hubs** (one page per entity), **the Library** (topics, units and lectures to read in order), **Compare** (walls), **Search**, **Ask** (the partner voices), the lecture player | Built by scripts from layers 1 to 3; never written by hand | The *Giselle* hub page: its card, deep dive, productions on the line, the disputes about it, its claims with sources, the chapters that use it, its family of remakes |

Two registers sit beside the layers. **The link register** records every place a module uses an Atlas id, and whether it pins a version or follows the latest. **The learner's record** (the Concept DNA and the sources record) cites Atlas ids, so borrowings can be counted.

### 4.1 Rules

1. **Git is the source; the database is a rebuilt copy.** Only learner data lives only in the database.
2. **Every addressable thing has a permanent id.** Entities keep the canon's id scheme (prefix and number from `atlas/tools/codes.py`) and gain a readable alias. New kinds are added: work, production, era, document, building, identity. Documents use `topic.slug` ids, as *The shoe* already does (`ballet.the-shoe`). Sections take `doc-id#section`, claims a slug id with a subject, compositions `kind:slug`. Ids are never reused or renamed, only redirected.
3. **A document is as long as its argument needs.** The four tiers stay exactly as the voice guide sets them, as the form "card". Every other form has its own size guidance and no cap.
4. **Records own fact; documents own argument; compositions own order, framing and time.** A chapter never re-tells a card; a card never re-tells a chapter's argument (template v2.1 §4.4, now enforceable).
5. **Facts a view shows are claims, cited by id from the prose.** CI checks that every cited claim exists and is not deprecated, so the deep dive and the timeline cannot disagree on a date.
6. **Licence and status travel with the smallest unit.** The build computes each composition's licence class from its parts and fails the commercial build on a conflict.
7. **Views are generated.** The map shows what has a place; the line shows what has a date; hubs show everything.
8. **Partner voices retrieve, then cite.** Every answer links to a section or a claim. Research documents are retrievable by the Historian but are never presented as teaching.

### 4.2 Shared facets

Every entity and document may carry facets. A facet is a filter and a way to build views and lenses, never a place where text lives.

| Facet | Values | Used for |
|---|---|---|
| `world` | Program-wide: F1 world chapters, other modules' worlds, THEME | The map's worlds; widened from F1-only |
| `era` | Program bands B01–B11 by default; a topic may add its own era set (ballet's E0–E10), mapped to the bands | The line, at program or topic scale |
| `industry` | The creative industries (§6.3) | "The world of ballet" lens; practice areas' openers |
| `field` | Concept DNA field codes | M2's field atlas, built as a view, not written twice |
| `thread` | The six program threads | The program's own meaning of "thread" |
| `motif` | Recurring ideas across works (ballet's 24, formerly called "threads") | Walls and routes |
| `lane`, `depth` | Maker, Briefer; Orientation, Practice, Mastery | Which reader a document serves |

## 5. The curriculum: what lives in the Atlas and what is used elsewhere

| Holder | Holds | Cites |
|---|---|---|
| **The Atlas** | The history of making: works, people, objects, places, institutions, events, techniques and materials as history, movements; claims and sources; the concept units and their Repertories (taken whole as courses); disputes and myths; primary documents with reading notes; design and art knowledge | Nothing outside itself except sources |
| **Each module** | Method, technique and procedure; labs, simulations, briefs, activities and assessments; its own units' compositions | Atlas ids, through the link register, at the size it needs: a card tier, a claim, a section, a wall with chosen members, a saved view |
| **Eight authoring modules** (F1, F2, F4, S1, S3, S4, S5, S6; M2 for the field atlas) | Write their lineage knowledge into the Atlas as entities, cards and documents | Their units compose it |

**What this means in numbers [argued, A2 §1–§4].** The Atlas is consumed in two ways. Taken whole, the concept units are courses in their own right. Taken in pieces, the rest of the curriculum (about 80 units outside F1) pulls cards, claims, sections and views by id. The material that only the concept unit uses, about 85 per cent of ballet's, is not waste. It is the course a learner who wants ballet can take, and it is the depth the Historian voice answers from.

**Where concept units sit in hours.** F1 stays at its planned hours, with ballet's lead placements (F1.23, F1.4, F1.17) taking pieces. The full ballet unit (about 41 hours) and the Repertory's routes are **Atlas courses**: program-level electives with their own Orientation, Practice and full paths. The Hub records them as such (resolves A2 gap 4).

## 6. Ballet first: everything kept, everything findable

### 6.1 What exists, and what each becomes

Nothing is deleted. Research stays as research. Learner writing is derived from it and versioned.

| Ballet material now | Becomes | How |
|---|---|---|
| `register.yaml`, 156 rows, one per version | **Entities**: about 135 works and 156 or more productions, each `production_of` a work (20 register rows are marked as remakes today; more families will be joined); premiere, team and place as **claims** | Script; the families (Swan Lake 1877, 1895, Ek, Bourne, Masilo) become one work with productions, so a remake family is a query |
| Register fields with confidence and sources; 137 corrections of 21 November | **Claims** with source and locator; the corrections become dated claim revisions | Script from the register and `register_updates_2026-11-21.md` |
| 118 works taken apart: 35 in W1–W3 plus D7 supplements, 82 in D1–D6 and D8 | **Documents**, form `deep-dive`, one file per work, about the work, the 13 headings as anchored sections | Script. Tested on 22 November: all 82 D-file works split cleanly into all 13 sections (median 1,663 words). W-file works are combined with their D7 supplement |
| *The shoe* (page 0.3.0) | **Document**, form `page`; already in the target shape | Kept; it is the template for the others |
| The 13-chapter blueprint (about 41 hours) | **Composition** `unit:ballet-made-world`: 13 chapters, sessions with minutes, each item a reference (a chapter document, a walk, an object study, a wall, an activity, a Concept DNA write) | Written by hand from `BLUEPRINT.md`; minutes must add up to 41 hours, so the plan becomes checkable |
| The Repertory plan: line, cards, eight routes | **Compositions**: `view:ballet-line` (a timeline view over productions and events), `route:r0` to `route:r7`; work **cards** as documents | Hand-written manifests over generated ids |
| `timeline_events.yaml` (155 events) | **Entities** of kind event, with their claims | Script; `build_timeline.py` becomes the general Line view |
| Eras E0–E10 | An **era set** in the vocabulary, each era mapped to program bands B01–B11 | Resolves the clash between the two timelines (A2 gap 18) |
| X1: 18 debates, 38 myths, 13 cross-currents | **Documents**: `dispute` (both readings, each citing claims with a reading label), `myth` (the story, the record, the verdict), `essay` (cross-currents) | Split by script, checked by hand |
| X2: 10 eras of the stage picture, 65 designers, 18 design ideas, 7 design disputes | **Entities** for designers, scene painters and workshops, each with a card; **essays** for the eras and the ideas; **disputes** | Split by script; designer entities matched to canon people where they exist |
| 24 motif walls (census) and 14 blueprint walls | **Compositions**, form `wall` (pair, members, principle), one set, reconciled | Hand; resolves A2 gaps 10 and 11 |
| Ballet claims register (`ballet.yaml`, 34 records) | The model for all claims | Kept as the schema's base |
| Scope, works and gap research (about 390,000 words) | **Documents**, form `research`, chunked for the Historian; claims extracted over time | Front matter added; text untouched |
| Planning, reviews, decisions, benchmarks, pages | Stay in `planning/`; not content | Unchanged |

### 6.2 The *Giselle* pilot

Before converting everything, one work goes through every layer:
1. split its register rows into the work and four productions;
2. move its facts into claims;
3. cut its W1 section and D7 supplement into one deep-dive document with anchored sections;
4. write its card (four tiers) from the deep dive, accepted by a person;
5. build its hub page, its strip on the line, and its place in chapter 3's composition;
6. ask the Historian three questions and check that each answer cites a claim or a section.

The pilot measures authoring time per work before the other 155 are committed (A3 §4.7).

### 6.3 Ballet as a world of creative industries

A ballet is made by many industries at once. The plan makes that visible as a lens. Every ballet entity and document carries an `industry` facet, and a composition, "The world of ballet", shows the topic industry by industry. Each industry has its works, makers, objects, disputes and lessons, and links to the practice area that teaches the skill.

| Industry | In ballet | Already researched | Practice area |
|---|---|---|---|
| Choreography and performance | The steps, the dancer, the corps, the class | Scope 02, G1, all deep dives | (the topic itself) |
| Music and sound | The score, the commission, the conductor's cuts | G1; every deep dive's "world it built" | F3, S6 |
| Architecture and venue | Opera houses, the staircase, access | Scope 04, G2 | S1 |
| Scenography and light | Machines, gas, the painted cloth, LED | Scope 04, X2 eras | S1, S4 |
| Costume, fashion and textiles | Tutu, costume families, stage to street, couture galas | Scope 03, products, X2 | S3 |
| Objects and products | The pointe shoe, the music box, merchandise, *The Nutcracker* as a product world | Scope 03, products | S2 |
| Visual art | Painters as designers: Bakst, Picasso, Chagall, Noguchi | X2 (65 designers and artists) | S4 |
| Identity and communication | Posters, programmes, the ballerina as a brand, companies' identities | Products, X2 | S5 |
| Media and digital | Prints, photography, film, television, relays, social media, AI | Scope 06, G3, G4 | S6 |
| Writing and story | Librettos, scenarios, sources in literature | Works W1–W4, deep dives | M1 |
| Training and education | Schools, syllabi, exams, competitions | Scope 02, G3 | F3, R |
| Money, law and institutions | Patronage, the state, unions, copyright, the Boléro ruling | Scope 05, G4 | R1, R2 |

The research already holds every row; nothing new has to be researched before the lens exists. The lens answers the owner's point that ballet is a world combining all of these industries, skills and knowledge, and it becomes the pattern every Atlas topic follows (Bauhaus, Art Deco, Edo).

### 6.4 Ballet steps in order

| Step | What | Outcome |
|---|---|---|
| B1 | The *Giselle* pilot (§6.2) | The model proven on one work; authoring time measured |
| B2 | Convert the register, claims and events by script | About 135 works, 156 or more productions, 155 events, about 1,100 claims (934 register fields plus the events), all with ids |
| B3 | Split the 118 deep dives, X1 and X2 into documents by script | About 118 deep dives, 18 disputes, 38 myths, 13 cross-currents, about 30 essays, 65 designer entities |
| B4 | Write the compositions: the unit, the line view, the eight routes, the reconciled walls, the industries lens | Every plan in `planning/` becomes checkable data |
| B5 | Build the views: hub pages, the Line, the card browser, the Library reader for the unit | Ballet reachable without the map |
| B6 | Database v2 and retrieval; the Historian answers with citations | The research becomes usable depth |
| B7 | Write learner content in the agreed order: chapters 0 and 3; the shoe study at 1.0.0; the 35 classic cards; the Repertory's R0 | Learner text, versioned, citing claims |
| B8 | The human check of the research before any card reaches a learner (probable items, date conflicts, licences) | The research's confidence words honoured |

## 7. The repository and the back end

### 7.1 Layout

```
atlas/                           the program's knowledge base (moved up from modules/F1-histories-of-making/atlas)
  records/
    entities/                    the canon CSVs as now, plus one YAML file per new kind (works, productions, eras, events, documents)
    relations.csv                typed edges, each with source and confidence (generated first from the 2,360 ids in canon notes)
    claims/                      one scheme, one file per topic or domain
    sources/                     routes, primary texts, bibliographies (CSL)
    assets/                      manifests with licence class
  vocab/                         kinds, relations, confidence words, eras, industries, fields, motifs
  topics/<topic>/                moved from modules/F1-histories-of-making/topics
    research/  planning/         as now
    writing/                     cards/ deep-dives/ chapters/ lectures/ essays/ disputes/ myths/ objects/ pages/ (versioned, anchored)
    structures/                  unit, routes, walls, views, lenses (manifests)
  surfaces/                      the hub, the Line, hubs, the Library reader, the card browser (moved from F1's build/)
  harvest/  tools/               as now, plus the compiler
modules/<module>/                specs, the module's own writing and structures; cites Atlas ids
links/register.yaml              the link register: generated from specs and topic READMEs, with curated rows
schema/                          entity, claim, source, asset, document, composition, view, link schemas (JSON Schema)
supabase/                        migration v2; seeds generated by CI
```

Everything moves with `git mv`, so history is kept. A redirect file maps old paths to new ones, and the old READMEs say where things went.

### 7.2 The compiler

One program-level tool, `tools/atlas_compile.py`, runs in CI on every push:
1. **Validates** every record, document front matter and manifest against `schema/`. Every cited id must resolve, every anchor must exist, every cited claim must be live, and every licence must be computed upward.
2. **Assigns anchors** once to sections and long paragraphs, and never reuses them.
3. **Builds the content graph**: one set of JSON files that every surface reads (entities, claims, documents indexed by section, resolved compositions, views).
4. **Checks versions**, extending `content_versions.py` from one folder to every document and manifest: body hash, sources with git blob shas, history snapshots, stale warnings.
5. **Writes counts** into READMEs by script, so no hand-typed count drifts again.
6. **Exports the database seeds** with checksums.

It absorbs what works now: `validate_canon.py`, the Edo zod lint (lifted out of Edo), `lint_claims.py`, `build_timeline.py` (as the general Line view) and the build of *The shoe*'s learner and editor views.

### 7.3 The database

Supabase stays a copy rebuilt from git by CI. Its tables are entities, relations, claims, claim anchors, sources, assets, documents, sections, compositions, composition items, link register, and a chunks table with a full-text index and a 384-dimension vector column for retrieval. Embeddings come from an open model, run in the CI build or with Supabase's built-in small model, so retrieval needs no paid service. A3 §4.1 estimates the whole program at tens of megabytes, well inside the free plan. The real constraint is that a free project pauses after a week without activity; the monthly harvest can keep it awake. The 54 seed files never loaded are replaced by the generated seeds. Learner tables (Concept DNA, sources record, progress) come later and are the only data edited in the database.

### 7.4 Surfaces

The Atlas gets one front door with several ways in: **Map** (as now), **Line**, **Connections**, **Library** (topics, units, lectures and routes to read in order), **Compare** (walls), **Search** and **Ask**. Every entity gets a **hub page**, so a person, a technique, a movement or a work can be opened even though it has no place on the map. Artifact limits (255 files, 16 MB a file, A1 L11) are met by publishing each surface as one page that loads the content graph as data. Cards then do not need one file each.

## 8. The program, after ballet

| Phase | What | Outcome |
|---|---|---|
| P0 Decide | The owner's decisions (§10); the Hub records them | Whose Atlas, the layers, the move |
| P1 Foundations, built with ballet | Schemas, vocabulary, compiler, CI, database v2; steps B1 to B6 | One working topic on the new model |
| P2 Bring the rest in, without rewriting | Edo (its people, events, places and sources become entities and claims; its story stays a composition), the F1.13 lecture (one shape instead of three), the 28 grouping pages (documents, with their facts blocks as claims), the ten claim stores (one scheme; old ids kept as aliases) | Every existing surface reads one graph |
| P3 Enrich the canon | Typed relations generated from the 2,360 ids in notes; cards for Ring 1 nodes; hub pages for the 3,900 nodes the map leaves out; the `work` kind for every movement's works | The Atlas reachable beyond the map |
| P4 The link register as data | Generated from the 38 specs and the topic READMEs; checked at each gate; F1 specs cite ids | Consumers can point at pieces |
| P5 Other modules | M2's field atlas as a view; F2, F4 and S-area lineage units authored into the Atlas; module openers drawn from it | The program shares one knowledge base |
| P6 Next topics | Concept units for the movements already in grouping pages (Bauhaus, Art Deco, Arts and Crafts), each with its industries lens and Repertory where it has many works | The template applied beyond ballet |

## 9. What it gives each part of the program

| Part | What changes |
|---|---|
| **The Atlas** | Holds a card, a lecture, a deep dive or a full unit with no limit set by the map; every node has a page; the map, line and library are ways in |
| **F1** | Specs cite ids instead of re-telling; the Edo unit, the lecture and ballet share one pipeline (A1 L7); per-unit effort falls as the Edo report predicted |
| **Method (M1–M4)** | M1.11a gets *Giselle*'s documents by id; M2's field atlas is a filter over existing cards; M3 and M4 get walls and remake families as compositions |
| **Practice areas (S1–S6)** | Each opens on its industry's lens of a topic (S3 on costume and fashion in ballet, S1 on the house and the stage) and writes its lineage units into the Atlas |
| **Tools and Venture (T, R)** | Cases cited by id; R2 gets the Boléro ruling and the authorship disputes as claims; R3 gets handover documents |
| **Partner voices** | Answer from the whole Atlas, research included, and cite a section or a claim every time |
| **Writers** | Write Markdown once; ids, anchors, counts and views are made by script; a date fixed in one claim is fixed everywhere |
| **Learners** | Reach anything from many doors; cite the Atlas in their own record |

## 10. Decisions for the owner

Each has a default that stands unless the owner says otherwise.

| # | Decision | Default |
|---|---|---|
| 1 | **Whose Atlas.** The program's knowledge base, with F1 as its first author | Yes |
| 2 | **Four layers and generated views.** Records, writing, structures, views; the map as one view | Yes |
| 3 | **The move.** `atlas/` and `topics/` move up from F1 to the program level, with history kept and redirects left | Yes, after the *Giselle* pilot proves the model |
| 4 | **Length.** The four tiers stay for cards only; every other form has guidance, not a cap; the voice guide gets a table by form | Yes |
| 5 | **One claim scheme** with one confidence vocabulary (documented, probable, contested, argued); the canon's high, medium and low mapped onto it | Yes |
| 6 | **Concept units as Atlas courses**, outside F1's hours, with their own paths; F1 takes pieces | Yes |
| 7 | **The industries facet and lens** for every topic, starting with ballet | Yes |
| 8 | **Names.** Ballet's 24 "threads" become motifs (and the walls motif walls), so "thread" keeps its program meaning; the 14 blueprint walls and the 24 census walls are reconciled into one set | Yes |
| 9 | **The lab invariant (principle 5) for concept units.** Each chapter keeps its Apply in each lane and adds a partner step with the Historian; the lab is the Apply | Yes, recorded in the Hub |

The Hub and the final structure live in Claude Docs, so decisions 1, 6 and 9 are recorded there by the owner. This repository records them in the module's decisions file.

## 11. Risks and how the plan meets them

| Risk | Answer |
|---|---|
| Over-modelling: forty types nobody can maintain | Six record and writing types (entity, claim, source, asset, document, composition), with `kind` and `form` doing the rest; a new type only when a view cannot be built without it |
| Authoring burden | Writers write Markdown; scripts add ids, anchors and counts; claims are drafted with help and accepted by a person; the validator warns rather than blocks except where a view or a licence would break; the pilot measures the cost first |
| Drift between prose and data | Facts that a view shows are claims cited by id; CI checks them; a report lists dates and names in prose that match no claim |
| Broken links when content changes | Permanent ids; compositions pin versions; the link register lists every consumer of a changed section |
| Licence leakage into the commercial build | Licence class on the smallest unit, computed upward; the commercial build fails on a conflict |
| AI treating research as teaching | Every chunk carries status and confidence; learner-facing voices retrieve reviewed documents by default; the Historian says when it draws on research |
| Two sources of truth | The database is rebuilt from git; nothing but learner data is edited there |
| Losing what works | A1 §5's list is carried into the compiler and schemas, item by item |
| A big move breaks paths | `git mv`, a redirect file, READMEs that say where things went, and the move only after the pilot |

## 12. Sources

- `study-2026-11/A1_REPOSITORY_INVENTORY.md`: how content is stored, structured and served; twelve limits; duplication; what to keep; numbers.
- `study-2026-11/A2_CURRICULUM_CONSUMPTION.md`: what every module needs, the consumption matrix, ballet as the test case, generalisation, addressability, twenty gaps.
- `study-2026-11/A3_CONTENT_ARCHITECTURE_BENCHMARK.md`: separation models, close precedents, recurring patterns, fit at zero cost, the ballet mapping.
- The ballet topic: `modules/F1-histories-of-making/topics/ballet/` (README, BLUEPRINT, REPERTORY_PLAN, research, the shoe).

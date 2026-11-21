# One knowledge base, many ways in: the content architecture plan

Version 1.1, 22 November 2026, for the course owner's decision. Built on three studies in `study-2026-11/`: the repository inventory (A1), the curriculum's use of the Atlas (A2) and a benchmark of content architectures (A3). Revised after an independent review (`study-2026-11/R_PLAN_REVIEW.md`); every must-fix item is answered, and the changes are listed at the end. It keeps everything made so far, starting with ballet.

## 1. The problem

The Atlas was built as a map of short records. Each canon row holds one or two sentences (median 17 words, maximum 60), and the longest text the Atlas design allows is a 1,200-word Deep card. Anything longer, whether a chapter, a lecture, a deep dive, a whole unit or a timeline, has no type in the Atlas, so it piles up in folders the Atlas cannot see. Ballet's 390,000 words of research and 156 works have no canon row. The map is also the only way in, and only things with a place can stand on it. About 3,900 of the 4,666 canon rows (people, techniques, periods, styles, movements) never reach the learner. Each surface (the Atlas hub, the Edo unit, the F1.13 lecture, the ballet page, the grouping pages) has invented its own format. Facts are kept in ten claim stores with four confidence vocabularies, and the database is a stale copy of flat text. The owner's sense that the format keeps limiting the content is correct, and the cause is structural (A1 §3).

## 2. What the studies found

**The repository (A1).** It holds 1.6 million words of Markdown and 0.7 million in registers, almost all research, planning and specification. The learner text is small: one ballet page, the Edo unit, one lecture and the grouping pages. Deep Dives 1 designed a full Atlas record, with four text tiers, typed relations, media, rights and upkeep, but it was never built. A1 §3 ranks twelve limits. A1 §5 lists the things that already work and must be kept:
- the harvest discipline
- the licence switch
- the 1970 provenance test
- the claims register's record shape
- content versioning
- the CI checks
- the Edo content lint
- the learner and editor views built from one source
- the topic folder
- the hub's honesty rules

**The curriculum (A2).** Outside F1, about 80 of the program's roughly 425 other units need historical, cultural or material knowledge. Each takes a small piece: a card at Label or Story depth, one document, part of an object study or a comparison wall, a set of claims, or a saved timeline view. No placement takes a whole chapter. About 85 to 88 per cent of ballet's material lives only in the topic, and 15 to 20 per cent of its knowledge items are used elsewhere. Reuse is highest for materials and design movements (30 to 50 per cent), lower for crafts (25 to 35) and lowest for civilisations. Nine modules should write history into the Atlas, not only read from it: F1, F2, F4, S1, S3, S4, S5, S6 and R2 (rights and protocol records), together with M2 for the field atlas and every module's regional slot. The program's documents disagree about whose Atlas it is, F1's or the program's. A2 §6 lists twenty such gaps and contradictions.

**The benchmark (A3).** No mature system lets the display hold the content. Museums (Linked Art; the Royal Opera House's work, production and performance), encyclopaedias (Wikipedia with Wikidata, Britannica, Oxford Reference), publishers (DITA, OpenStax, MDN), broadcasters (NPR, the BBC) and course platforms (Open edX) all keep four things apart:
- records of what is true
- documents of any length
- compositions that put documents in order for a reader
- views generated from the other three

Britannica writes each reading level separately and ties each one to a single topic. That is the model for the Atlas's four tiers: written by a person, bound to one entity, not generated.

## 3. The decision this plan asks for

**The Atlas becomes the program's knowledge base, and the map becomes one way into it.** Everything the program knows about the history of making is held once, at any length, in four layers. Every surface is built from those layers: the map, the line of time, a card, a lecture, a full unit, a partner voice. F1 is the Atlas's first author, not its owner. Every module may cite it, and nine modules write into it.

## 4. The four layers

| Layer | What it holds | Form | Example from ballet |
|---|---|---|---|
| **1. Records**: what is true, and how we know | **Entities**: anything the course talks about, such as a work, a production, a person, an object, a place, an institution, an event, an era, a technique, a material, a movement or a primary text. **Claims**: one citable statement each, with subject, value, source and locator, confidence, status and reviewer. **Sources**. **Assets**: images, clips and designs, each with its licence class | YAML and CSV in git | The work *Giselle*; its productions (Paris 1841, St Petersburg 1884, Paris 1924 from notation, Havana under Alonso); its remakes (Ek, *Creole Giselle*, Khan, Masilo) as works of their own linked by `remake_of`; the claim that it premiered on 28 June 1841 at the Salle Le Peletier, with its source |
| **2. Writing**: what we say | **Documents** of any length, each about one or more entities and each in a declared **form**: card, deep dive, chapter, lecture, essay, dispute, myth, lesson, object study, page, activity or research. Length belongs to the form, not to the Atlas | Markdown with front matter; sections carry permanent anchors; facts are cited by claim id | The *Giselle* card (Line, Label, Story, Deep); chapter 3 of the unit; the debate "Who is the author?"; the myth "Taglioni was the first on pointe"; the lesson "Remaking is how a concept stays alive"; the research file W1 §5 |
| **3. Structures**: how it is put together for a learner | **Compositions**: ordered references with framing, time and audience. They come as units, chapters, sessions, lecture runs, routes, walls, timelines, map layers, lenses, exhibitions and paths. They hold order and short transitions, never knowledge | YAML manifests in git | The thirteen-chapter unit with its sessions and minutes; the Repertory's eight routes; the motif walls; the line's eras and lanes; the "world of ballet" lens |
| **4. Views**: how it is seen | Generated surfaces: **the Map**, **the Line** (time), **Connections**, **Hubs** (one page per entity), **the Library** (topics, units and lectures read in order), **Compare** (walls), **Search**, **Ask** (the partner voices) and the lecture player | Built by scripts from layers 1 to 3; never written by hand | The *Giselle* hub page: its card, its productions and remakes on the line, the disputes about it, its claims with sources, and the chapters that use it |

Two registers sit beside the layers:
- **The link register** records every place a module uses an Atlas id, and whether it pins a version or follows the latest.
- **The learner's record** (the Concept DNA and the sources record) cites Atlas ids, so that borrowings can be counted.

### 4.1 Rules

1. **Git is the source.** Every other copy, whether published data files or the database, is rebuilt from it. Learner data is the only exception (§7.3).
2. **Every addressable thing has a permanent, link-safe id.** Ids use only letters, digits, `.`, `_`, `~` and `-`, because only those survive an Artifact link (`build/units/edo/ARCH_V4.md`).
   - **Entities** keep the canon's scheme, a prefix and a number from `atlas/tools/codes.py`. They gain a readable alias, and new kinds get new prefixes: work, production, era, building, identity and script. Primary texts keep their `TXT` ids.
   - **Documents** take `topic.slug` (`ballet.giselle-card`), as *The shoe* already does (`ballet.the-shoe`).
   - **Sections** take `document~section` (`ballet.giselle-card~story`).
   - **Claims** take a prefix and a slug (`bal-giselle-premiere`), each with a subject.
   - **Compositions** take `kind.slug` (`unit.ballet-made-world`).
   - Ids are never reused or renamed, only redirected.
3. **A document is as long as its argument needs.** The four tiers stay exactly as the voice guide sets them, for the form "card". Every other form has size guidance and no cap.
4. **Records own fact; documents own argument; compositions own order, framing and time.** A chapter never retells a card, and a card never retells a chapter's argument (template v2.1 §4.4, now enforceable).
5. **Facts a view shows are claims, cited by id from the prose.** CI checks that every cited claim exists and is live, so a document and the timeline cannot disagree on a date.
6. **Research is never teaching.** Research files stay as they are, as documents of form `research`, with an anchor on each section, and are never copied. Learner documents (cards, deep dives, chapters) are written from the research, cite it through `derived_from`, and carry their own versions. A claim made by script enters as `status: draft` with no reviewer. It reaches a learner view only after a person accepts it.
7. **Licence and status travel with the smallest unit.** The build computes each composition's licence class from its parts and fails the commercial build on a conflict.
8. **Views are generated.** The map shows what has a place, the line shows what has a date, and hubs show everything.
9. **Partner voices retrieve, then cite.** Every answer links to a section or a claim. The Historian may draw on research and must say when it does. The Fabricator, the Client and the Planet draw on accepted claims and learner documents, as far as their packs allow. The Mirror and the Stranger read only the learner's own artifact and never the Atlas (`docs/03-partner-voices/stranger/`).

### 4.2 Works, productions and remakes

The Royal Opera House defines a work by its unchanging elements, and the choreography is one of them. So:
- A **work** is a ballet as made by its makers, such as *Giselle* by Coralli, Perrot and Adam, 1841.
- A **production** is a staging of the same work. Examples are Petipa's St Petersburg revival in 1884, Sergeyev's Paris staging from notation in 1924 and Alonso's Havana *Giselle*.
- A **remake** is a new work linked to its source by `remake_of`. Examples are Ek's *Giselle*, Bourne's *Swan Lake* and Masilo's *Giselle*. This keeps the authorship question the unit teaches (chapter 10, and the debate "Who is the author?").
- Where a remake keeps the old choreography in a new setting, as *Creole Giselle* does, a reviewer decides whether it is a production or a remake. The decision is recorded as a claim.
- A **performance** (a dated cast) is stored only where a view needs it.

### 4.3 Shared facets

Every entity and document may carry facets. A facet is a filter and a way to build views and lenses, never a place where text lives.

| Facet | Values | Used for |
|---|---|---|
| `world` | Program-wide: F1 world chapters, other modules' worlds, THEME | The map's worlds; widened from F1 only |
| `era` | The program bands B01–B11 by default. A topic may add its own era set (ballet's E0–E10), with each era mapped to the band its midpoint falls in and its span kept as its own dates | The line, at program or topic scale |
| `industry` | The creative industries (§6.3) | The "world of ballet" lens; practice areas' openers |
| `skill` | Crafts and techniques (scene painting, pattern cutting, shoemaking, notation, stage machinery, lighting, lithography) | Linking a topic to Tools and practice areas |
| `field` | Concept DNA field codes | M2's field atlas, built as a view, not written twice |
| `thread` | The six program threads | The program's own meaning of "thread" |
| `motif` | Recurring ideas across works (ballet's 24, formerly called "threads") | Walls and routes |
| `lane`, `depth` | Maker, Briefer; Orientation, Practice, Mastery | Which reader a document serves |

## 5. The curriculum: what lives in the Atlas and what is used elsewhere

| Holder | Holds | Cites |
|---|---|---|
| **The Atlas** | The history of making: works, people, objects, places, institutions, events; techniques and materials as history; movements. Also claims and sources; concept units and their Repertories; disputes, myths and lessons; primary texts with reading notes; design and art knowledge | Sources |
| **Each module** | Method, technique and procedure; labs, simulations, briefs, activities and assessments; the compositions of its own units | Atlas ids, through the link register, at the size it needs: a card tier, a claim, a section, a wall with chosen members, or a saved view |
| **Nine authoring modules** (F1, F2, F4, S1, S3, S4, S5, S6, R2), with M2 and every module's regional slot | Write their lineage, rights and protocol knowledge into the Atlas as entities, claims, cards and documents | Their units compose it |

**How the Atlas is consumed [argued, A2 §1–§4].** There are two ways. A learner can take a concept unit whole, as a course in its own right. The rest of the curriculum, about 80 units outside F1, pulls cards, claims, sections and views by id. The material that only the concept unit uses (about 85 per cent of ballet's) is not waste: it is the course a learner who wants ballet can take, and the depth the Historian answers from.

**How big the Atlas will be [argued].** Ballet alone yields about 800 entities: about 135 works, 156 or more productions, about 300 people and designers, 155 events, 11 eras and objects. It also yields about 1,100 claims, about 300 documents and about 40 compositions. Twenty topics of that size, with the canon, give roughly 20,000 entities and 25,000 claims. That is tens of megabytes of text, well inside every limit in §7.

**Where concept units sit in hours.** F1 stays at its planned hours, and its lead placements for ballet (F1.23, F1.4 and F1.17) take pieces. The full ballet unit (about 41 hours) and the Repertory's routes become **Atlas courses**: program-level electives with their own paths. Each Atlas course also gets the forms the program requires of every unit, a five-minute form (the card and the line) and a reference form (the hub pages).

**Which concepts get a full unit.** The rule is published, and a concept qualifies on any one of three grounds:
1. three or more units in at least two modules use it;
2. it has a repertory of 50 or more works or objects;
3. the program names it as a module opener or a historical twin.

Ballet qualifies on all three. The next candidates are the movements already in grouping pages, such as the Bauhaus, Art Deco, and Arts and Crafts (§8, P6).

## 6. Ballet first: everything kept, everything findable

### 6.1 What exists, and what each becomes

Nothing is deleted. Research stays as research, and learner writing is derived from it and versioned. A check at the end of step B4 confirms that every file in the topic is either mapped below or left on purpose as planning.

| Ballet material now | Becomes | How |
|---|---|---|
| `register.yaml`: 156 rows, one per version, 20 marked as remakes | **Entities**: about 136 works, 20 remake works linked by `remake_of`, and productions added by hand where the research names them (*Giselle* 1884 and 1924; *Swan Lake* 1877 and 1895, now one row and split by hand). **Claims** for premiere, team and place | Script for works and remakes; productions by hand from W1 §5, D7 and the deep dives |
| Register confidence and sources, which sit on the row, not the field; the 137 corrections of 21 November; `SPOTCHECK_2026-11-21.md` | **Claims** drafted from the dossiers' per-sentence markers, which are richer than the row, with source and locator. Each correction becomes a dated claim revision, and the spot-check becomes review records | Script drafts, a person accepts (§6.4, B2) |
| `ballet.yaml`: 34 claim records, 28 sources, 14 people, 2 objects, a 15-item spot-check sample | The **base schema for all claims**; its sources become source records, its people and objects entities, its spot-check review records | Kept and extended |
| 118 works taken apart: 35 in W1–W3 with D7 supplements; 82 in D1–D6 and D8 | **Research documents**, left in place, with an anchor and an `about:` on each work's section. In the W files, which use numbered bold labels and sometimes treat two works in one section, the anchors are placed by hand. The learner **deep dive** and **card** for each work are written from this research, not copied (rule 6) | Anchors by script for the D files (tested: all 82 split into all 13 sections); by hand for the W files |
| Cross-history synthesis, about 11,000 words: W1 §11, W2 §0 and §12, W3 §12, and the "Across these works" section of each of D1–D8 | **Research documents** anchored in place, and the source of **essay** documents about eras and motifs. These are the owner's "comparisons across the whole history" | Anchors by script; essays written in B7 |
| X1: 18 debates, 38 myths, 13 cross-currents, 98 events | Research anchored in place; learner **dispute**, **myth** and **essay** documents written from it; events become **entities** | Anchors by script; documents in B7 |
| X2: 10 eras of the stage picture, 65 designers and artists, 18 design ideas, 7 design disputes, 60 events | Designers, scene painters and workshops become **entities** with cards. The 18 design ideas become concept **entities**, each with a card and an essay. The 7 disputes become **dispute** documents and the eras **essays** | Entities by script, matched to canon people; documents in B7 |
| The 17 lessons for world-builders (`BLUEPRINT.md`) | **Lesson** documents, one each, tagged with Concept DNA fields and linked to the chapters that teach them. They are the most reused ballet items (about 70 per cent, A2 §3.3) | By hand |
| *The shoe* (page 0.3.0) and its history | **Page** document. It is the data template for the others, not the writing template, because its opener predates the decision against question openers. It is rebuilt as the object study at 1.0.0 | Kept. The 40-phrase claim map in `build/units/ballet/build.py` becomes inline claim ids, released as a patch version (0.3.1) |
| The 13-chapter blueprint (about 41 hours) | **Composition** `unit.ballet-made-world`: 13 chapters, each a list of sessions with minutes. Each item references a chapter document, a walk, an object study, a wall, an activity or a lesson. The minutes must add up | By hand from `BLUEPRINT.md` (sample in Appendix A) |
| The ten object studies and their "Linked from" column; the placements in `review/R1_curriculum_fit.md` §2.1 and §5.4 and in the blueprint's Placements section | **Object-study documents**; **link register rows** for every placement | Link rows by script from the review and the blueprint, curated |
| The field-atlas entries in `decisions/EXEMPLAR_STUDY.md` §4.2 | The `field` facet on the cards and lessons concerned | By hand |
| The Repertory: the line, eleven era cards, eight routes, the inclusion rule with its criterion on each card, the "version most often seen today" flag, the debates strip and the poster | **Compositions**: `view.ballet-line`, `route.ballet-r0` to `r7`. Era **entities** with **cards**. The inclusion criterion becomes a field on each work, "most seen today" a field on the production, and the debates strip and the poster further views | Manifests by hand over generated ids |
| D8's gap candidates (Iran, India, Indonesia, Brazil, West Africa) | **Entities** with `status: candidate` | Script |
| `timeline_events.yaml`, 155 events; eras E0–E10 | **Event entities** with claims; an **era set** mapped to B01–B11 | Script; `build_timeline.py` becomes the general Line view |
| The 24 motif walls (census) and the 14 blueprint walls | One reconciled set of **wall** compositions, each with a pair, its members and a principle | By hand |
| Each dossier's "Sources and open images" section | **Asset** records, each hosted only after its licence is checked at the holder, otherwise link-only | Script drafts, a person accepts |
| The working Repertory page (`planning/repertory_page/`) and its published link | It stays live. It becomes the first version of the Line view, republished to the same link from the new data | Rebuilt in B5 |
| Scope, works and gap research (about 390,000 words) | **Research documents**: front matter added, text untouched, chunked for the Historian | Script |
| Planning, reviews, decisions, benchmarks and pages | Stay in `planning/`. They are not content, except for the rows above that are drawn from them | Unchanged |

### 6.2 The *Giselle* pilot

One work goes through layers 1 to 3 with the minimum tooling, before the rest is converted:
1. create the work, its four productions (1841, 1884, 1924, Alonso) and its remake works (Ek, *Creole Giselle* as the reviewer decides, Khan, Masilo);
2. draft its claims from the research, and have a person check them **before** any learner text uses them;
3. anchor W1 §5 and its D7 supplement in place;
4. write its card (four tiers) from the accepted claims;
5. place it in chapter 3's composition;
6. generate one static hub page from those files.

Retrieval and the full views come later, in B5 and B6. Appendix A shows what each pilot file looks like.

**Stop rule.** The pilot measures the owner's checking time per work. If accepting one work's claims and card takes more than about three hours, B2 changes before it starts: more of the drafting is automated, the check moves to sampling (below), or cards are limited to the 35 classics first.

### 6.3 Ballet as a world of creative industries, skills and knowledge

A ballet is made by many industries at once. Every ballet entity and document carries an `industry` facet and, where it applies, a `skill` facet. A lens composition, "The world of ballet", shows the topic one industry at a time. For each industry it shows the works, makers, objects, object studies, disputes and lessons, and it links to the parts of the program that teach the skill.

| Industry | In ballet | Skills (examples) | Already researched | Program parts |
|---|---|---|---|---|
| Choreography and performance | The steps, the dancer, the corps, the class | Choreographic craft, notation, rehearsal | Scope 02, G1, all deep dives | F3, the topic itself |
| Music and sound | The score, the commission, the conductor's cuts | Commissioning to a plan, editing a score | G1; each deep dive's "world it built" | F3 (the senses); S4 (sound in installation). The program has no music area |
| Architecture and venue | Opera houses, the staircase, access | Front of house, service design, access design | Scope 04, G2 | S1 |
| Scenography and light | Machines, gas, the painted cloth, LED | Scene painting, stage machinery, lighting | Scope 04, X2 eras | S1, S4, T4 |
| Costume, fashion and textiles | The tutu, costume families, stage to street, couture galas | Pattern cutting, dyeing, costume families | Scope 03, products, X2 | S3, F4 |
| Objects and products | The pointe shoe, the music box, merchandise, *The Nutcracker* as a product world | Shoemaking, product families, naming | Scope 03, products | S2, F4, T10 |
| Visual art | Painters as designers: Bakst, Picasso, Chagall, Noguchi | Design drawing, the painted curtain | X2 (65 designers and artists) | S4, T1 |
| Identity and communication | Posters, programmes, the ballerina as a brand, company identities | Lithography, typography, brand | Products, X2 | S5 |
| Media and digital | Prints, photography, film, television, relays, social media, AI | Photography, film, capture, data | Scope 06, G3, G4 | S6, T3, T6, T7 |
| Writing and story | Librettos, scenarios, literary sources | Adapting a source, writing a scenario | W1–W4, deep dives | M1, M3 |
| Training and the body | Schools, syllabi, exams, competitions, the body ideal | Teaching method, syllabus design | Scope 02, G3 | F3, R4 |
| Money, law and institutions | Patronage, the state, unions, copyright, the *Boléro* ruling of 2024 | Commissioning, contracts, rights | Scope 05, G4, D2 | R1, R2, F5 |
| Handover and archives | Notation, the répétiteur, revival packages, reconstructions | Notation, documentation, archiving | Scope 06, G4 | R3, M4 |

Every row is already researched, so the lens needs no new research. Appendix A shows the lens entry for one industry. The same pattern applies to every Atlas topic.

### 6.4 Ballet steps, in order

| Step | What | Outcome | Effort [argued] |
|---|---|---|---|
| B0 | The move (§7.1) and the minimum schemas and validator | Files land once, in their final place | 1 to 2 build sessions |
| B1 | The *Giselle* pilot (§6.2) | The model proven on one work; checking time measured | 1 build session; 2 to 3 hours of the owner's checking |
| B2 | Convert the register, events, `ballet.yaml` and the corrections by script. Draft claims from the research. **The human check runs here**: probable items, date conflicts, licences | About 800 entities, about 1,100 claims drafted and checked | 2 to 3 build sessions. Checking is by sampling: every claim a learner view shows is checked in full, the rest by a 10 per cent sample per batch, as the board did for the shoe (15 sampled, none failed). About 15 to 25 hours of the owner's time |
| B3 | Anchor the research in place; enter X1, X2 and the lessons as entities | Every section addressable; research chunked | 1 build session |
| B4 | Write the compositions (the unit, the line view, the eight routes, the reconciled walls, the industries lens) and the link register rows. Run the coverage check of §6.1 | Every plan in `planning/` becomes checkable data | 2 build sessions; 3 to 5 hours of the owner's review |
| B5 | Build the views: hub pages, the Line (republishing the Repertory page), the card browser, the Library reader | Ballet reachable without the map | 2 to 3 build sessions |
| B6 | Search and Ask (§7.3); the Historian answers with citations, tested on a short question set | The research becomes usable depth | 1 to 2 build sessions |
| B7 | Write learner content in the agreed order: chapters 0 and 3, the lecture for chapter 0 (narration plus run, §7.4), the shoe study at 1.0.0, the 35 classic cards, then R0, the essays, disputes, myths and lessons | Learner text, versioned, citing accepted claims | About 125,000 learner words in all (A2 §3.1). Each chapter is reviewed by the owner before the next |

## 7. The repository, the back end and the surfaces

### 7.1 Layout and the move

```
atlas/                           the program's knowledge base (moved up from modules/F1-histories-of-making/atlas)
  records/
    entities/                    the canon CSVs as now, plus one YAML file per new kind (works, productions, eras, events)
    relations.csv                typed edges with source and confidence (first generated from the 2,360 ids in canon notes)
    claims/                      one scheme, one file per topic or domain
    sources/                     routes, primary texts, bibliographies
    assets/                      manifests with licence class
  vocab/                         kinds, relations, confidence levels, eras, industries, skills, fields, motifs
  topics/<topic>/                moved from modules/F1-histories-of-making/topics
    research/  planning/         as now
    writing/                     cards/ deep-dives/ chapters/ lectures/ essays/ disputes/ myths/ lessons/ objects/ pages/
    structures/                  unit, routes, walls, views, lenses, lecture runs
  surfaces/                      the hub, the Line, hubs, the Library reader, the card browser (moved from F1's build/)
  harvest/  tools/               as now, plus the compiler
modules/<module>/                specs, and the module's own writing and structures; cites Atlas ids
links/register.yaml              the link register
schema/                          entity, claim, source, asset, document, composition, view and link schemas
supabase/                        migration v2; seeds generated by CI and not committed
```

**The move (step B0)** happens before any file is generated, so that generated files land once. Everything moves with `git mv`, which keeps history. The old READMEs say where things went. A redirect file maps old paths to new ones for people. Code needs edits, made in the same commit:
- `.github/workflows/ci.yml`, `harvest.yml`, `backbone.yml`, `depth.yml` and `assets.yml`;
- `tools/build_schema.py`;
- the discovery pattern in `tools/content_versions.py` (`modules/*/topics/*/learner/**`), which becomes a list of content roots;
- the shoe page's `claims_register` and `derived_from` paths, released as patch 0.3.1;
- `build/units/ballet/build.py`, `build/atlas-hub/` and `build/units/shared/LINKS.md`;
- every path in `skills/` and in the topic READMEs.

CI must pass before and after the move.

### 7.2 The compiler

One program-level tool, `tools/atlas_compile.py`, runs in CI on every push:
1. **Validates** every record, every document's front matter and every manifest against `schema/`. Every cited id must resolve, every anchor must exist and every cited claim must be live. Licences are computed upward. It warns rather than blocks, except where a view or a licence would break.
2. **Assigns anchors** once and never reuses them.
3. **Builds the content graph**: JSON files sharded by topic and kind, each well under the 16 MB file cap, which every surface reads.
4. **Checks versions.** It extends `content_versions.py` to every document and manifest: body hash, sources with git blob shas, history snapshots and stale warnings.
5. **Writes counts** into READMEs by script, so that no hand-typed count drifts again.
6. **Loads the database copy** from CI, using a password held as a repository secret. The earlier load failed for want of that route (`supabase/README.md`).

It absorbs what already works: `validate_canon.py`, `lint_claims.py`, `build_timeline.py` (as the general Line view) and the shoe page's learner and editor build. The Edo zod lint keeps running in Node inside CI. **Dependencies:** Python with PyYAML, jsonschema and markdown-it-py (all MIT or BSD); Node for the Edo build; no paid service. CI minutes are free for public repositories and within the free allowance for a private one. The compiler is the first program tool to need packages, so its README records that it is an exception to the "standard library only" note.

### 7.3 Serving: two stages

**Stage 1, now: Artifacts, at zero cost.** Each surface is published as an Artifact, and its slice of the content graph is published with it as data files. Same-origin fetch of published files works, but fetching from other hosts does not (`ARCH_V4.md`). So:
- **Search** is a prebuilt lexical index shipped as files with the surface.
- **Ask** uses the Artifact runtime's own capability for asking Claude, where it is offered to the viewer. The surface retrieves the sections from the shipped index and passes them with the question, so the voice can cite them. This costs the program nothing; whether the capability is available is confirmed when B6 is built.
- **Learner records** (say-backs, sources records, the Concept DNA) use the Artifact runtime's own storage capability. They are exported when the program has its own host. The Concept Composer already keeps its decisions this way, as an exception to rule 1 that is now recorded.
- **Supabase** is the analysis and rebuild copy, not a server. No surface depends on it, so its pause after a week without activity does no harm. The monthly harvest cannot prevent the pause, and the plan no longer relies on it.

**Stage 2, when the program has its own host (a later decision).** A static site serves the same content graph, and Supabase serves search and the partner voices with read policies, authentication for learner data, and vectors for retrieval. That stage needs either a daily keep-alive or a paid plan, which will be decided then. The tables are already listed: entities, relations, claims, claim anchors, sources, assets, documents, sections, compositions, composition items, the link register, and chunks with a full-text index and a vector column.

### 7.4 Surfaces, and the lecture

The Atlas gets one front door with several ways in: **Map** (as now), **Line**, **Connections**, **Library**, **Compare**, **Search** and **Ask**. Every entity gets a **hub page**, so a person, a technique, a movement or a work can be opened even though it has no place on the map.

**A lecture** is two things:
- a **document** of form `lecture`, holding the narration with anchored stations and claim ids on every sentence that states a fact;
- a **composition** of form `lecture-run`, listing the stations in order, each with its seconds, its scene and its assets.

The Motion Canvas player (`build/lectures/`) reads the run. F1.13's three hand-kept shapes become one document and one run. Ballet's first lecture, for chapter 0, is written in this shape in B7.

## 8. The program, after ballet

| Phase | What | Outcome |
|---|---|---|
| P0 Decide | The owner's decisions (§10), recorded in the Hub | Whose Atlas, the layers, the move |
| P1 Foundations, built with ballet | Steps B0 to B6 | One working topic on the new model |
| P2 Bring the rest in, without rewriting | **Edo**: its people, events, places and sources become entities and claims, the prose of its 71 beats becomes one document with anchored beats, and the order and instrument states become a composition. **The F1.13 lecture**: one document and one run. **The 28 grouping pages**: documents, with their facts blocks drafted as claims. **The ten claim stores**: one scheme, with the old ids kept as aliases | Every existing surface reads one graph |
| P3 Enrich the canon | Typed relations generated from the 2,360 ids in notes; cards for Ring 1 nodes; hub pages for the 3,900 nodes the map leaves out; the new kinds (work, production, era, building, identity, script) | The Atlas reachable beyond the map |
| P4 Links and learners | The link register generated from the 38 specs, the topic READMEs and the placement reviews, and checked at each gate. The sources-record schema gains Atlas ids, so learners can cite the Atlas (A2 gap 19) | Consumers point at pieces; borrowings can be counted |
| P5 Other modules | M2's field atlas as a view. F2, F4, the S areas and R2 author into the Atlas. Module openers are drawn from it. The partner-voice packs titled "for F1" are retitled program-wide | The program shares one knowledge base |
| P6 Next topics | Concept units, under the rule of §5, for the movements in the grouping pages (the Bauhaus, Art Deco, Arts and Crafts), each with its industries lens and, where it has many works, its Repertory | The template applied beyond ballet |

## 9. What it gives each part of the program

| Part | What changes |
|---|---|
| **The Atlas** | It holds a card, a lecture, a deep dive or a full unit with no limit set by the map. Every node has a page, and the map, the line and the library are all ways in |
| **F1** | Specs cite ids instead of retelling. The Edo unit, the lecture and ballet share one pipeline. Per-unit effort falls, as the Edo report predicted |
| **Method (M1–M4)** | M1.11a gets *Giselle*'s documents by id. M2's field atlas is a filter over existing cards. M3 and M4 get walls and remake families as compositions |
| **Practice areas (S1–S6)** | Each opens on its industry's lens of a topic (S3 on costume and fashion in ballet, S1 on the house and the stage), and each writes its lineage units into the Atlas |
| **Tools and Venture (T, R)** | Cases are cited by id. R2 gets the *Boléro* ruling and the authorship disputes as claims, and R3 gets the handover documents |
| **Partner voices** | The Historian answers from the whole Atlas, research included, and cites a section or a claim every time. The other voices stay inside their packs (rule 9) |
| **Writers** | They write Markdown once. Ids, anchors, counts and views are made by script, and a date fixed in one claim is fixed everywhere |
| **Learners** | They reach anything through many doors, and can cite the Atlas in their own record |

## 10. Decisions for the owner

The program documents live in Claude Docs, so the owner records the program-level decisions in the Hub, and the voice guide's table by form and any template change are made there too. This repository records them in `architecture/DECISIONS.md` once they are taken, not in F1's decisions file.

**Already open, needed before the steps that use them:**
- the ballet blueprint's approval (B4);
- the Repertory's four decisions: where it sits, R1 as an optional route or a sub-unit, the eleven eras, and the template (B4);
- design E and M2's comparison, *Giselle* or the Bauhaus (P5a to P5d; P5).

**New, each with a default that stands unless the owner says otherwise:**

| # | Decision | Default |
|---|---|---|
| 1 | **Whose Atlas.** The program's knowledge base, with F1 as its first author | Yes |
| 2 | **Four layers and generated views.** Records, writing, structures and views, with the map as one view | Yes |
| 3 | **The move.** `atlas/` and `topics/` move up from F1 to the program level at step B0, with history kept, paths edited and old READMEs pointing on | Yes |
| 4 | **Length.** The four tiers stay for cards only. Every other form has guidance, not a cap, and the voice guide gains a table by form | Yes |
| 5 | **One claim scheme**, using the program's four levels as `schema/registers.md` states them: documented, probable, contested, interpretive. The voice guide's W5 words are display words: "argued" for contested, "we read it as" for interpretive. Research files that wrote "argued" for an interpretation map to interpretive. The canon's high, medium and low are mapped by a person, row by row, when the canon is enriched | Yes |
| 6 | **Concept units as Atlas courses**, outside F1's hours and with their own paths, a five-minute form and a reference form. F1 takes pieces. A published rule decides which concepts get a unit (§5) | Yes |
| 7 | **The industries and skills facets** and the "world of" lens for every topic, starting with ballet | Yes |
| 8 | **Names.** Ballet's 24 "threads" become motifs, and the walls motif walls, so that "thread" keeps its program meaning. The 14 blueprint walls and the 24 census walls are reconciled into one set | Yes |
| 9 | **The unit invariants (principle 5) for concept units.** Principle 5, approved at G1, requires a lab or simulation, an Apply by lane, a partner step and a log entry in every unit. Concept units could meet all four (each chapter gains a short lab and a partner step with the Historian, and its say-back is the log entry). Alternatively the owner amends principle 5 for Atlas courses | No default: this is the owner's call, in the Hub |
| 10 | **Serving, stage 1.** Artifacts with published data, search and Ask in the page, learner records in the Artifact's storage, and Supabase as the copy. Stage 2 (an own host) is decided later | Yes |
| 11 | **Chapter 12's closing Apply** contributes to the sources record only, and points forward to the fields M2 and R3 own (rule, handover, commission), instead of writing them. **The Practice path** for concept units becomes 12 to 18 hours in the template, to fit ballet's 18 | Yes |
| 12 | **History-first openers outside F1** (decision 6 of 25 October). They apply to every module, so F2, F4, M2, M3, S1, S2, S3 and S5 each open on an Atlas lens; the Final Structure's other opening moves remain moves inside a unit | Yes, recorded in the Hub |

## 11. Risks and how the plan meets them

| Risk | Answer |
|---|---|
| Over-modelling: forty types nobody can maintain | Six types (entity, claim, source, asset, document, composition), with `kind` and `form` doing the rest. A new type is added only when a view cannot be built without it |
| Authoring and checking burden | Writers write Markdown, and scripts add ids, anchors and counts. Claims are drafted with help and accepted by a person, by sampling where a learner view does not show them. The pilot measures the cost against a stop rule (§6.2) |
| Research presented as teaching | Rule 6. Script-made claims stay drafts until accepted, and the human check comes before learner writing |
| Drift between prose and data | Facts that a view shows are claims cited by id, and CI checks them. A report lists the dates and names in prose that match no claim |
| Broken links when content changes | Permanent, link-safe ids. Compositions pin versions, and the link register lists every consumer of a changed section |
| Licence leakage into the commercial build | Licence class on the smallest unit, computed upward. The commercial build fails on a conflict |
| A surface that cannot reach its data | Stage 1 ships its data with each surface. Nothing depends on the database being awake |
| Two sources of truth | Everything is rebuilt from git. The two stated exceptions are learner records and the Composer's decisions |
| Losing what works | A1 §5's list is carried into the compiler and the schemas, item by item |
| A big move breaks paths | The move is one step (B0), with every hard-coded path listed and CI passing before and after |

## 12. Sources

- `study-2026-11/A1_REPOSITORY_INVENTORY.md`: how content is stored and served; twelve limits; duplication; what to keep; numbers.
- `study-2026-11/A2_CURRICULUM_CONSUMPTION.md`: what every module needs, the consumption matrix, ballet as the test case, generalisation, addressability, twenty gaps.
- `study-2026-11/A3_CONTENT_ARCHITECTURE_BENCHMARK.md`: separation models, close precedents, recurring patterns, fit at zero cost, the ballet mapping.
- `study-2026-11/R_PLAN_REVIEW.md`: the independent review of version 1.0.
- The ballet topic: `modules/F1-histories-of-making/topics/ballet/` (README, BLUEPRINT, REPERTORY_PLAN, research, the shoe).

## Appendix A. What the pilot's files look like

Illustrative. The ids, fields and values are drafts, and every claim stays a draft until a person accepts it.

**An entity** (`atlas/records/entities/works.yaml`):
```yaml
- id: WRK0001
  alias: giselle
  kind: work
  title: {orig: "Giselle, ou les Wilis", en: Giselle}
  makers:                       # each maker is also a claim with a source
    - {role: choreography, who: [PER-coralli, PER-perrot]}
    - {role: music, who: [PER-adam]}
    - {role: scenario, who: [PER-gautier, PER-saint-georges]}
  facets: {era: [E4], world: [THEME], motif: [M01, M02, M07, M15], industry: [choreography, music, costume, scenography]}
  inclusion: [living-repertory, remake-family]
  research: [ballet.research.w1~s5, ballet.research.d7~giselle]
```

**A claim** (`atlas/records/claims/ballet.yaml`; the shape of `ballet.yaml`):
```yaml
bal-giselle-premiere:
  subject: PRD0001              # the 1841 Paris production
  kind: date
  value: 1841-06-28
  display: "28 June 1841"
  place: "Paris Opéra, Salle Le Peletier"
  confidence: documented
  sources: [{id: w1-s5, locator: "W1 §5"}]
  status: draft                 # becomes accepted, with reviewer and date
  reviewer: null
  used_by: []                   # filled from the link register
```

**A card** (`atlas/topics/ballet/writing/cards/giselle.md`):
```markdown
---
content_id: ballet.giselle-card
form: card
about: [WRK0001]
version: 0.1.0
status: draft
lane: [maker, briefer]
derived_from: [atlas/topics/ballet/research/works/W1_court_to_imperial.md@<blob>]
claims: [bal-giselle-premiere, bal-giselle-team]
---
## Line {#line}
## Label {#label}
## Story {#story}
## Deep {#deep}
```

**A unit composition** (`atlas/topics/ballet/structures/unit.ballet-made-world.yaml`, excerpt):
```yaml
id: unit.ballet-made-world
form: unit
title: "Ballet as a made world"
hours: 41
chapters:
  - id: ch03
    title: "The theatre sells a dream: Paris, 1820 to 1870"
    minutes: 240
    opens_on: ballet.ch03~opening        # the tenor's idea, 12 March 1832
    items:
      - {ref: ballet.ch03, role: chapter, minutes: 90}
      - {ref: ballet.giselle-deep, role: worked-example, minutes: 60}
      - {ref: ballet.tutu-study~bell, role: object-study, minutes: 30}
      - {ref: wall.ballet-two-worlds, role: wall, minutes: 30}
      - {ref: ballet.ch03~apply, role: activity, minutes: 30}
```

**A lecture run** (`atlas/topics/ballet/structures/run.ballet-ch00.yaml`, excerpt):
```yaml
id: run.ballet-ch00
form: lecture-run
narration: ballet.lecture-ch00
stations:
  - {ref: ballet.lecture-ch00~heine, seconds: 75, scene: scene.reading-room, assets: [AST-heine-1835]}
  - {ref: ballet.lecture-ch00~the-sheet, seconds: 60, scene: scene.desk}
```

**A lens entry** (`atlas/topics/ballet/structures/lens.ballet-world.yaml`, one industry):
```yaml
id: lens.ballet-world
form: lens
industries:
  - industry: costume
    title: "Costume, fashion and textiles"
    question: "How did dress make the world readable, and how did it leave the stage?"
    entities: [OBJ-tutu, PER-karinska, PER-bakst]
    documents: [ballet.tutu-study, ballet.stage-to-street, ballet.dispute-costume-and-body]
    walls: [wall.ballet-costume-families]
    lessons: [ballet.lesson-collection-holds-object]
    teaches_in: [S3, F4]
```

## Changes from version 1.0

After the independent review (`study-2026-11/R_PLAN_REVIEW.md`):
- **Serving.** A two-stage serving path (§7.3), because Artifacts cannot fetch from other hosts. The wrong claim that the monthly harvest keeps Supabase awake is removed.
- **Research and teaching.** Research stays research, anchored in place and never copied. Script-made claims are drafts, and the human check moves before learner writing (rule 6; B2).
- **Coverage of the ballet material.** Rows added for the cross-history synthesis, the 17 lessons, the placements, `ballet.yaml`'s sources, people and objects, the era cards, the inclusion rule, the D8 candidates, the open images, the working Line page, the claim map in code, the field-atlas entries and the spot-check. A coverage check is added at B4.
- **Works and productions.** Work, production and remake are separated (§4.2), and *Giselle* is corrected to the register's six rows plus two productions added by hand.
- **Order of work.** The move is now step B0, with the hard-coded paths listed. The pilot is limited to layers 1 to 3 and one page. The open owner decisions are listed as prerequisites.
- **The program's own rules.** Decisions are recorded in the Hub and in `architecture/`, not F1's file. The confidence vocabulary follows `schema/registers.md`. The partner voices' reach is limited by voice.
- **Additions.** The lecture is defined as a document plus a run. Effort, a stop rule and a sampling check are added. A skills facet joins the industries lens, with corrected program mappings. The toolchain is named. Edo's prose moves out of its composition. Ids are link-safe. Authors now include R2 and the regional slot. The rule for which concepts get a unit, the forms each unit needs, chapter 12's Apply, the Practice path and openers outside F1 are added. Appendix A gives worked samples.

# A2. Curriculum consumption: what the Atlas must hold, and what the rest of the curriculum takes from it

Study: `architecture/study-2026-11`. Written 22 November 2026. Status: draft for the course owner.

The question, in the owner's words: relook at the full curriculum, see how much of the information needs to be within the Atlas, its expanded and extensive aspects, and how much of it is consumed or covered within the other parts of the curriculum (units, lectures, method modules, practice areas, tools, venture).

## 0. Summary and method

### 0.1 What "the Atlas" means here

The repository uses "Atlas" for four things. This study keeps them apart, because each is consumed differently.

| Layer | What it is | Where it is defined |
|---|---|---|
| **Record** | The canon register (4,666 rows in `atlas/data/canon/` today, 4,228 in the README), the world set (77 objects in `world_set_v0.csv`, 374 rows in `world_set_specs_v1.csv`), the claims (110 in `claims_v0.csv`, 799 in `claims_specs_v1.csv`), practices, 198 source routes, 130 primary texts | `schema/registers.md`; `schema/canon-node.schema.json`; `modules/F1-histories-of-making/atlas/` |
| **Cards** | Every node in the voice guide's four tiers: Line (16 words), Label (50 to 60), Story (150 to 250), Deep (600 to 1,200) | `docs/02-program/voice-guide/index.md` §3; `briefs/ATLAS_CONCEPT_UNIT_TEMPLATE_v2.md` §2 |
| **Surfaces** | Place, Time, Connections, Compare and grouping pages, with a story layer and lenses (eleven views merged into five) | `docs/06-atlas-logic/index.md` §5–§7; `docs/02-program/hub/index.md` decision 16 |
| **Topic units** | The Atlas concept unit (chapters, walks, object studies, motif walls) and, for concepts with many works, the Repertory (a line, cards, arguments, myths, routes) | `briefs/ATLAS_CONCEPT_UNIT_TEMPLATE_v2.md` §4; `DECISIONS_2026-10-25.md` decision 4; `topics/ballet/planning/BLUEPRINT.md`, `REPERTORY_PLAN.md` |

All paths under `modules/F1-histories-of-making/` are given from that folder unless they start with `docs/`, `schema/` or `architecture/`.

### 0.2 Method

1. Every unit in the register (`docs/01-structure/master-structure-v2.1-pass-1/index.md`, with the v3.0 additions in `docs/01-structure/final-structure-v3/index.md` §7) was read for the knowledge it needs: its concept, its delivery codes (L lecture, C case, I lab, S simulation, P partner), its media and its interactive. A unit with a C code or a history, lineage, culture or vernacular concept was marked as a consumer of historical or cultural knowledge.
2. F1's own specs (`specs/F1.*.md`) were read for what each unit takes from the Atlas (sections 1 "Responsibility block" and 4 "Nodes", the "Reference pages opened" row) and for forward links to other modules.
3. Every proposal that places ballet somewhere was collected from the ballet planning files and the decisions.
4. Shares are estimates, labelled **[argued]**. They are given three ways where it matters: research words, learner words and knowledge items, because the three give different answers.

### 0.3 Findings in eight lines

1. **Outside F1, about 80 of the program's roughly 425 other units need historical, cultural or material-history knowledge.** About 65 carry a case code (C) and about 15 are lineage or history units (F2.4 to F2.8, F4.9, S1.10, S3.2, S3.11 to S3.14, S4.11, S5.11, S6.9). Most of the rest of the program needs technical, procedural or method knowledge that the module itself must hold.
2. **The consumers take small pieces.** A case is one object story or one card at Label or Story tier; a lineage unit takes a timeline state and five to ten cards; a Method unit takes one document or one comparison. No placement found in any document takes a whole chapter.
3. **Ballet: about 85 to 88 per cent of the research lives only in the topic and the Atlas.** About 6 to 7 per cent feeds F1 units and about 6 to 7 per cent feeds other modules [argued, §3.3]. By knowledge items (works, object studies, walls, debates, designers) the share used outside the topic is 15 to 20 per cent; it rises to about 20 to 25 per cent if decision 6's module openers are adopted (*The Nutcracker* opens M3, the Ballets Russes open S3).
4. **Materials, crafts and design movements are the most reused kinds of Atlas concept** (30 to 50 per cent of their knowledge has a consumer outside the topic); civilisations are the least (5 to 10 per cent) [argued, §4].
5. **Eight modules should author into the Atlas, not only read from it:** F1, F2, F4, S1, S3, S4, S5 and S6 each have lineage units whose knowledge is history, plus M2 for the field-atlas layer and every module's regional slot (§4.3).
6. **The architecture must address knowledge below the page:** the claim, the card tier, the walk step, the wall with a member filter, the timeline state, the object detail, the document. Today only the canon node has a stable id that another module could cite (§5).
7. **The Atlas must support at least twelve content kinds beyond the map** (§5.3), most of which ballet has already produced as research and none of which has a schema.
8. **The program documents disagree about whose the Atlas is.** The glossary, the canon schema and the database tables say F1's; the engine list, the registers, decision 6 and the concept-unit template say the program's. Twenty gaps and contradictions are listed in §6.

## 1. The curriculum's knowledge needs, module by module

### 1.1 How to read the table

- **Knowledge** names the historical, cultural, material, technical or design knowledge the module needs, by unit.
- **Form** uses the program's words: card (with tier), case (an object story, form 3), worked example, lecture (storyboard and narration, `briefs/TEMPLATE_v3.1_AMENDMENT.md` §1), full unit, data for an engine or a partner voice, brief, reference set (images, drawings, packs).
- **Depth** is the card tier or depth the module needs (O, P or M; Line, Label, Story or Deep).
- **Holder** says where the knowledge should live: **Atlas** (record, cards, surfaces), **Topic** (an Atlas concept unit or Repertory), or **Module** (the module's own text, labs and data).
- **Atlas share** estimates how much of the module's knowledge is Atlas-held [argued].

### 1.2 Orientation and Foundations

| Module | Knowledge it needs | Form | Depth | Holder | Atlas share |
|---|---|---|---|---|---|
| **O1 How to see** (4 units) | O1.1: a handful of made things that "tell you what to do, what to feel, who you are" (L, C, img) | Three to five cases as object stories; Label cards | O; Label | Atlas (world-set records and Label tier); Module (the framing and the Read-a-Room lab, O1.2) | about 30% |
| **F1 world chapters** (F1.5 to F1.13, eleven units) | Objects, places, polities, communities, techniques, materials, networks, living practices of each world; the chapter's device (metallurgy, fibre, the workshop, cotton, routes and the waqf, the guild, navigation, the horse) | Walks over Place and Time; grouping pages; object stories; world-band cards; lecture of 6 to 12 stations | P; Label to Deep | Atlas for nearly everything; Module for the device, the Apply and the partner step | 80 to 90% |
| **F1 thematic units** (F1.1 to F1.4, F1.14 to F1.24) | Cases chosen to answer one question (copying, ornament, ritual, commissioning, women's work, industry, the designer, modernisms, the platform, extraction, use, credit, the museum); the concept passage of 400 to 700 words | Three cases as object stories; a lab (Spectrum Sort, credit map, comparison wall); concept passage; tiles from topics | P; Label and Story, Deep for claims | Atlas for cases and nodes; Topic for tiles (ballet supplies about twenty); Module for the concept, lab, Apply, partner and closing contribution | 50 to 60% |
| **F1 method units** (F1.25 to F1.31) | Reading an object in five layers; protocol on CARE; counter-history; primary sources; reconstruction; vernacular sources; calendars; counterfactuals; the regional slot | Tools that run on Atlas records (Object Autopsy, Practice Reading, Source Grader, Oral History Kit, Calendars, Lineage authoring) | M; Deep and claims | Module for the method; Atlas for the records the tools run on; the learner's own Lineage layer | 30 to 40% |
| **F2 Form** (15) | F2.4 typology theory; F2.5 classical, Renaissance and modular proportion; F2.6 Islamic geometry as a generative system (the same Owen Jones plates as F1.15, per the link register); F2.7 tatami and ken, the *Yingzao Fashi*; F2.8 Andean and West African weaving grids. Decision 6 (default) opens F2 on the Bauhaus | Cases with drawings (drw); pattern families as data for the Pattern Generator; one argument card (F2.4); a history opener from the cast | P; Story; Deep for F2.6 | Atlas for the plates, texts, objects, techniques and the Bauhaus home card; Module for the rule labs (Typology Dismantler, Grid Lab, Pattern Generator) | about 25% |
| **F3 Body and senses** (13) | F3.7 colour across cultures (overlays in the Colour Lab); F3.11 proxemics (Hall); F3.3 anthropometrics (data, not history); the body-and-access lens from F1 (link register: "Level 1 of the thread starts in F1") | Cultural overlay data with sources and confidence; cases; one ballet tile on the made body | P; Label | Module for perception and data; Atlas only for sourced colour-meaning claims and the access lens's cases | about 10% |
| **F4 Material and meaning** (14) | F4.1 Material Card Deck; F4.4 provenance and sourcing ethics; F4.6 patina; F4.7 semiotics and collective memory; F4.9 scripts of the world; F4.12 material dossier (reuses the Object Autopsy's material layer, per the link register). Decision 6 opens F4 on Morris & Co. | Material cards with images; claims on sourcing; before-and-after for patina; script history cases | P; Label and Story | Atlas for material histories, origins and extraction (138 `material` nodes, 247 `technique` nodes); Module for behaviour and properties (F4.3, F4.5), type and voice | about 35% |
| **F5 Systems and consequences** (11) | F5.5 and F5.5a climate, land and water as actors; F5.8 what design cannot fix (cases); open datasets (Our World in Data, World Bank, UN) | Data sets; a few cases; the Planetary Ledger | P; Label | Module and open data; Atlas only for historical extraction cases (from F1.22) | 10 to 15% |

### 1.3 Method

| Module | Knowledge it needs | Form | Depth | Holder | Atlas share |
|---|---|---|---|---|---|
| **M1 Research and premise** (16) | M1.3 research routes (worked case); M1.4 credibility and the limits of evidence (Source Grader, the same tool as F1.28); M1.5 ethics and consent (F1.26 and F1.29); M1.11 stakes, archetypes, rituals; **M1.11a world bibles from film, games and performance** (Bible Anatomy lab; the link register already sends F1.4's Jukebox recordings there); M1.14 field sprint (Historian; F1.28a "prepares"); M1.15 archive work: catalogues, primary texts, collections APIs | Documents to dissect (bibles, livrets, plans); the source-route and primary-text registers as a reference set; the confidence vocabulary | P to M; Deep for documents | Atlas for the documents and the research apparatus (routes, texts, source tiers); Module for the moves | 25 to 30% |
| **M2 Concept DNA** (20) | The exemplar DNA (Salt Road, fictional, `docs/02-program/phase-4-foundations/index.md` §4); a historical comparison read field by field (*Giselle* in R1 §5.4; the Bauhaus in `EXEMPLAR_STUDY.md` §6.1 and decision 6's default); the **field atlas**: three to five real worlds per Concept DNA field (`EXEMPLAR_STUDY.md` §4.2) | A DNA reading (a worked example); field-atlas entries as comparison walls; M2.2 images for the Boundary Test Arena | P to M; Story | Module for the exemplar and the seed worlds; Atlas for the field-atlas entries and the twin's sources; the twin's reading itself is an open question (§6, item 7) | 15 to 20% |
| **M3 World architecture** (10) | M3.3 roles in a collection (case, img); collection logics from real worlds (the divertissement, the season, costume families, Morris & Co.'s families, the Bauhaus workshops); decision 6 opens M3 on *The Nutcracker*'s economy | Cases; one opener story; the field atlas's "Collection map" row | P; Story | Module for the Collection Matrix; Atlas and Topic for the cases | about 15% |
| **M4 Make and test** (12) | M4.4 construction logic (drw case); M4.5 rituals and use; M4.7 abandoned directions and revision history; the five modes of remaking (ballet W3) | Cases; one wall of remakes | P; Label and Story | Module; Topic for the remake cases | about 10% |

### 1.4 Practice areas

| Area | Knowledge it needs | Form | Depth | Holder | Atlas share |
|---|---|---|---|---|---|
| **S1 Space and experience** (34, 38 at v3.0) | S1.5 and S1.14 reuse and palimpsest; S1.8a exhibition, museum and cultural district; S1.8b service script; S1.9 phenomenology (argument card); **S1.10 lineages of typology and regional modernisms** (Courtyard-to-Tower morph; the Atlas engine per the link register); S1.15 heritage and retrofit; S1.19 climatic vernacular and thermal mass; S1.21 scent and culinary dossiers; S1.24a the outdoor room. Decision 6 opens S1 on the Sydney Opera House. Everything from S1.13 to S1.33 is technical (egress, services, yield, tenancy, handover) | Cases with plans and sections; a Timeline state for S1.10; vernacular techniques; site packs (OSM, CC0 buildings) | P to M; Story; drawings | Atlas for typology lineages, vernacular techniques and building histories; Module for every technical and economic layer of the World Engine | 20 to 25% |
| **S2 Object and product** (40) | S2.2 object as agent; S2.6 making routes from craft to industry; S2.10 critical design; **S2.11 craft lineages and non-extractive translation** (the Historian; living practices; F1.26's protocol); S2.12 emotional durability; S2.25 mass manufacture against singular craft; S2.37 patina; S2.40 a local craft. The rest (fit, BOM, tolerances, certification, IoT) is technical | Cases; living-practice records; the Craft-to-Industry Ladder; object packs | P to M; Story and Deep for S2.11 | Atlas for craft lineages, practices and their protocol; Module for engineering, cost and lifecycle | 15 to 20% |
| **S3 Body and wearables** (46) | The most history-heavy area: S3.2 silhouette and power; S3.6 semiotics of dress; S3.11 historiography of silhouette (Timeline Atlas); S3.12 avant-garde lineages; S3.13 subcultural vernacular (F1.4's ODJB record, per the link register); S3.14 world dress histories and the textile trade (Route Map, textile layer); S3.15 modesty as architecture (the Historian); S3.20, S3.26, S3.28, S3.29; S3.46 a local dress system. Decision 6 opens S3 on the Ballets Russes | Timeline and route layers; cases; garments from open collections; argument cards | P to M; Story and Deep | Atlas for dress histories, textile routes and dress systems (authored there, §4.3); Module for pattern, drape, grading, tech-pack | about 30% |
| **S4 Art and installation** (37) | S4.2 and S4.10 the container and its ideology; **S4.11 lineages: land art, light and space, situationists, institutional critique**; S4.12 relational theory; S4.13 mythologies without pastiche; S4.22 semantic materiality; S4.29, S4.33 | Cases (mostly link-only, since the works are in copyright); movement grouping pages; argument cards | M; Story | Atlas for movements and their works; Module for site, scale, light, sound, sponsorship | about 25% |
| **S5 Identity and communication** (24) | S5.2 the brand as a world; S5.11 identity histories: railways, airlines, institutions, cities, start-ups (Timeline Atlas, comparison wall); S5.12 semiotics of the mark; S5.4, S5.8, S5.15 type and scripts (F4.9's history); S5.23 a public-domain identity to re-world | Cases; a wall; a Timeline state; a brand pack | P to M; Story | Atlas for identity histories (new institution and identity nodes, §4.3); Module for the systems labs | about 20% |
| **S6 Digital product and interface** (20) | S6.9 histories of the interface (img, vid; Timeline Atlas); S6.11 interaction patterns, with game interfaces (via M1.11a); S6.17 data, privacy and sovereignty | Cases; a Timeline state; argument card | M; Story | Atlas for S6.9; Module for everything else | about 10% |

### 1.5 Tools

| Module | Knowledge it needs | Form | Holder | Atlas share |
|---|---|---|---|---|
| **T1 Seeing and drawing** (5) | Subjects to draw: open objects and buildings | Reference set (world-set images, 3D scans) | Atlas records as a reference set; Module for the method | under 5% |
| **T2 Parametric thinking** (5) | None historical; F2.6's pattern families are a possible input to "one rule, many outputs" | Data | Module | under 5% |
| **T3 Working with AI** (5) | T3.5 bias, data sovereignty and surveillance (the Attribution thread; CARE); the rule against generated images of historical objects, people or places (Q32) | Argument card; protocol | Atlas for the protocol and the cases; Module for prompts and drift | about 5% |
| **T4 Simulation** (6) and **T6 Reality capture** (3) | Open 3D scans and point clouds as inputs | Reference set | Atlas-style asset records (licence, holder) | under 5% |
| **T5 Honest evidence** (5) | What a render claims; representation ethics; the visual rules of F1 (`specs` section 7) | Rule set; cases | Module, citing F1's rules | under 5% |
| **T7 Data visualisation** (4) | A real dataset to parse and encode; the Route Map | The Atlas's own data as a teaching dataset | Atlas as data | about 10% |
| **T8, T9, T10** (9) | Sensors, climate, LCA, toolpaths, failure cases | Data; cases from engineering | Module and open data | 0% |

### 1.6 Venture and release

| Module | Knowledge it needs | Form | Holder | Atlas share |
|---|---|---|---|---|
| **R1 The world as venture** (16) | R1.2 masterbrand codes (case); R1.6 ritual and tribal signifiers; R1.10c the flagship as media (case); R1.12a expos, festivals, civic events (world's fairs are Atlas events: EVT001 Great Exhibition, EVT002 Vienna 1873) | Cases; one wall | Atlas for historical exhibitions and brand histories; Module for the Orbital Mapper and the Venture Console | about 10% |
| **R2 Money, law and rights** (13) | R2.3 patronage, grants, public-private partnership (F1.17's regimes); R2.5 and R2.6 IP and licensing (F1.14 "prepares"); **R2.7 cultural sovereignty and defensive protocols** (the Historian; F1.14 sends OCC258 the Carpets case and OCC253 the Indian Arts and Crafts Act "to R2"); R2.8 is F1.26's protocol at a second depth | Cases with claims; the protocol; rights-status records | Atlas for the cases, claims and protocol; Module for the IP Decision Tree, the Runway Simulator and the Clause Explorer | about 25% |
| **R3 Making it real** (13) | R3.8 the anatomy of the handover (historical handover documents: notation, revival packages, the *Utzon Design Principles*); R3.10 the brief as artifact (F1.17's six regimes are the vocabulary, per the link register) | Two or three documents as cases | Module; Atlas for the documents | 5 to 10% |
| **R4 Responsibility** (9) | F1.22a's use-life of the anchor (link register "prepares"); makers' pay and waste cases | Cases; data | Module and the Planetary Ledger; Atlas for the cases | 5 to 10% |
| **R5 Defence and dossier** (9) | The learner's own lineage and sources record; the six threads as six chapters of the dossier | The learner's Lineage layer and SRC entries | The learner's record, citing Atlas ids | about 5% |

### 1.7 Partner voices and engines

| Consumer | What it needs | Form | Holder |
|---|---|---|---|
| **The Historian** (F1 in 27 units; M1.14, S2.11, S3.15, R2.7 per Final Structure §9) | "The pack is the Atlas's own data plus a short brief per world"; "the Historian's reach is exactly as wide as the pack" (`docs/03-partner-voices/historian/index.md`, "What it knows"). Context blocks are assembled per request: a world-set slice, a claims slice, a practices slice, the protocol, the world brief | Data slices queried by unit, node and sensitivity flag; one brief per world or topic | Atlas, entirely |
| **The Fabricator** (F1.19, F1.19a, F1.28a; M4.8, studio briefs, R3.6, T10) | Materials and processes per area; reconstruction method | Data; technique records | Atlas for historical techniques; Module packs for current processes and tolerances |
| **The Client** (F1.17, F1.21; briefs, M1.16, R3.3, R3.6a, S4.8) | The commissioning regimes as vocabulary | Six regime cards; historical briefs as examples | Atlas (F1.17's cases); Module for venture fields |
| **The Planet** (F1.22; F5; Sx circularity; R4) | Extraction cases with each count labelled as its counter's | Claims; data | Atlas for historical cases; the Ledger for data |
| **The Mirror, the Stranger, the CFO** | The learner's artifact; "its knowledge is method, not history" (Stranger pack); cost norms (no pack yet) | — | Not the Atlas. The Stranger must never be fed a real world (Q32; `DECISIONS_2026-10-25.md`) |
| **Timeline Atlas** (engine 1; F1; S1.10; S3.11; S3.14; S5.11; S6.9) | Dated nodes, relations, events, lanes, eras, filters; "every lineage unit opens the Atlas, not its own timeline" (link register) | View states over the Time, Place and Connections surfaces | Atlas |
| **Sense Engine, World Engine, Object Line, Capsule, Identity Engine** | Small historical layers: colour overlays (F3.7); climatic vernacular (S1.19); craft-to-industry routes (S2.11, S2.25); the textile layer (S3.14); scripts (S5.15) | Data, each record sourced | Atlas for the historical layer only |
| **Stranger Lab, Product Loop, Site Work, Venture Console** | None | — | Module |

### 1.8 What the table adds up to

- **Demand outside F1 is concentrated.** About 65 case units, about 15 lineage units, four Historian appearances, one engine reused by five S units and the field atlas in M2. That is roughly 18 per cent of the non-F1 units. Weighted by the Atlas share above, the Atlas holds an estimated 12 to 15 per cent of the knowledge the rest of the program needs [argued].
- **What the Atlas must never hold** is the larger part of the program: egress and life safety (S1.27), BOM and value engineering (S2.34), the tech-pack (S3.8, S3.40), WCAG (S6.16), funding and dilution (R2.2), toolpaths (T10.1), the twelve grammars (M2.6). This knowledge has no history the units teach; it belongs in each module and its engine.
- **The history the rest of the program needs is design history,** which F1 does not centre: typology (S1.10), silhouette (S3.11), the avant-garde (S3.12), land art and institutional critique (S4.11), corporate identity (S5.11), the interface (S6.9), the Bauhaus (F2, M2), Morris & Co. (F4, M3). The canon holds some of these as nodes (116 movements, 47 schools, 198 styles), but almost all of it at Ring 2 or 3 and keyed to F1's world chapters (`world` enum; §6 item 1). The Final Structure's research plan already names these units as "historical and cultural" research (Final Structure §10, "Research plan by module type": F1, F4, M1.11a, Sx lineage units, S5.11, S6.9).
- **Three rules follow** [argued]:
  1. **All historical and cultural knowledge is authored once, in the Atlas,** even when its first need is in S3 or S5. Template v2's rule ("Units elsewhere in the program link to a chapter, a walk or a card; they never re-tell the history", §4.2) becomes a program rule.
  2. **A module holds its method, its labs, its Apply by lane, its partner step and one framing passage per case** (the "Concept passage" surface of the voice guide), and links to the Atlas for the case.
  3. **A topic unit is written for the learner who takes it whole; the Atlas cards are written for everyone else.** The cards, not the chapters, are what other modules consume (§3).

## 2. Content kinds by consumer

### 2.1 The matrix

Key: **A** authors or holds it; **H** heavy use (most units of that consumer); **U** regular use; **o** occasional (one to three units); **·** none.

| Content kind | Atlas browse | F1 units | M1–M4 | S1–S6 | T1–T10 | R1–R5 | Partner voices | Engines |
|---|---|---|---|---|---|---|---|---|
| Card, Line tier (16 words) | A, H | H | o | U | · | o | U | H (pins, hovers, list views) |
| Card, Label tier (50–60) | A, H | H | U | H | o | U | U | U |
| Card, Story tier (150–250) | A, U | H | U | H | · | U | o | o |
| Card, Deep tier (600–1,200) | A, o | U (Mastery) | o | o (Mastery lineage units) | · | o | H (claims inside it) | · |
| Claim (with confidence and both readings) | A | H | U (M1.4, M1.15) | U | o (T3.5) | U (R2.7) | H | U (edge confidence) |
| Object record (world set, licence, IIIF) | A | H | o | H | U (T1, T6 as subjects) | o | H (world-set slice) | U |
| Grouping page (card, walk, members, neighbours, afterlives, argued) | A, H | H | o | U (S3.12, S4.11, S5.11) | · | o | U | U (Story layer) |
| Long-form chapter (concept unit) | A (Topic) | o (tiles link to it) | o | o | · | · | · | · |
| Lecture (storyboard of stations, narration with claim ids) | · | H (every unit) | o | U (lineage units) | · | · | · | U (stations play over surfaces) |
| Walk / a work taken apart (seven steps in design-job order) | A (Topic) | U | U (M1.11a, M2) | o | · | o | · | o |
| Object study (making order, family, life off the stage) | A (Topic) | U | o (M3) | U (S2, S3) | · | o | · | · |
| Comparison or motif wall (pair, members, principle) | A | H (form 10 in F1.4, world chapters) | U (field atlas in M2) | H (every judged set; S5.11) | · | o | · | U (Compare surface) |
| Argument card (claim, counter-claim, case) | A | U (Writing thread: one per module) | U | U (S1.9, S2.10, S4.12) | o (T3.5) | U | U | · |
| Myth card (the myth, the record, the verdict) | A (Topic) | o | · | o | · | · | U | · |
| Timeline segment (era, lanes, filter, highlighted nodes) | A, H | H | o | U (S1.10, S3.11, S5.11, S6.9) | o (T7) | o | · | H |
| Map or route layer | A, H | H (F1.10, F1.13) | · | o (S3.14, S1.24) | o (T7) | o (R2.4b) | · | H |
| Primary document (letter, livret, plan, treatise, manifesto) with reading notes | A | U (F1.28, F1.28a) | H (M1.11a, M1.15, M2 twin) | o | · | U (R3.8 handover documents) | U | · |
| Worked example (a credit map, a DNA reading, a patron's brief) | o | H | H | U | · | U | · | · |
| Field-atlas entry (world × Concept DNA field) | U (a view) | o | H (M2, M3) | U (openers) | · | U (R2, R3 rows) | o | · |
| Data for partner voices (world brief, claims slice, practices slice, protocol) | · | H | o (M1.14) | o (S2.11, S3.15) | · | o (R2.7) | H | · |
| Data for engines (dated nodes, relations, overlays, layers) | · | H | · | U (five engines) | o (T7) | · | · | H |
| Brief (designed brief, historical commissions as models) | · | U (F1.17) | U (M1.16) | H (every studio brief, Commission variant) | · | H (R3.10) | U (Client) | · |
| Reference set (image sets, packs, the glossary's "say it to a designer") | A (glossary links) | U | U | H (site, object, body, brand packs) | U | U | · | U |
| Route (a curated sequence of existing cards) | A (Topic) | o | · | o | · | · | · | · |
| Learner's own layer (Lineage, SRC entries citing nodes) | U | H (F1.1 onward) | H (M1) | U | · | H (R5 dossier) | H (the Mirror and Historian read it) | U (Timeline authoring) |

### 2.2 What the matrix shows

- **The Atlas authors fourteen of the twenty-four kinds.** Only the lecture, the worked example, the brief and the data for partner voices are authored mainly by units, and even those cite Atlas ids.
- **Cards at Label and Story tier are the currency of reuse.** They are the only kinds with heavy use in F1, the S areas and the engines at once. The Deep tier matters most to the partner voices, which read claims, not prose.
- **The long-form chapter and the route are consumed almost only inside their topic.** Every placement in the ballet files points other modules at a card, a document, an object study or a wall, never at a chapter (§3.1). This matches the template's own rule (§4.4: "chapters never re-tell a card; cards never re-tell a chapter's argument").
- **Method modules consume documents and comparisons, not narratives.** M1.11a needs the *Giselle* documents; M2 needs field-atlas entries; M3 needs collection logics. None needs a chapter of ballet history.
- **S areas consume three things:** cases (Story card plus object record), timeline states for their lineage units, and walls for their judged sets.
- **Tools and venture consume least,** and mostly the apparatus: the protocol (T3.5, R2.7, R2.8), the source tiers (M1.4), the licence classes and the visual rules (T5).
- **The partner voices consume structured data, not text.** They need claims, records and briefs addressable by unit, node and sensitivity flag (`docs/03-partner-voices/historian/index.md`, "Context blocks").

## 3. Ballet as the test case

### 3.1 What exists

| Body | Size | Where |
|---|---|---|
| Research | 412,600 words in the topic's `research/` folder (counted this pass): six scope files (55,300), four scope2 files (41,500), five works files (63,000), eight repertory dossiers (167,200), the readings and design passes X1 and X2 (27,000), the register, census and timeline events (27,600), products (8,200), the first two passes (19,700) | `topics/ballet/research/` |
| The unit ("Ballet as a made world") | Thirteen chapters, 0 to 12, about 41 hours; ten object studies; fourteen motif walls; seventeen lessons for world-builders | `planning/BLUEPRINT.md` |
| The Repertory | 156 works on one line (11 eras, 6 lanes of works, 5 of events); 118 works taken apart; 18 debates, 38 myths, 13 cross-currents; 65 designers, 18 design ideas; 24 thread walls; eight routes (R0 to R7); about 85,000 learner words planned | `planning/REPERTORY_PLAN.md`; `research/repertory/` |
| Learner text written | One page, *The shoe* (`ballet.the-shoe` 0.3.0, in review) | `learner/the-shoe/`; `CONTENT_INDEX.md` |
| Claims | One store keyed `bal-…`, outside the claims register's id scheme | `atlas/data/register/units/ballet.yaml` |
| Canon nodes | None. The canon holds no ballet work, company or technique; there is no `work` kind | `atlas/data/canon/`; `schema/canon-node.schema.json` |

The template sets the size of the learner text at about 40,000 words for the unit, of which about 10,000 are card tiers (template v2 §8). With the Repertory's 85,000, the topic plans about 125,000 learner words.

### 3.2 Every place ballet is used or proposed

"Share" is the share of the ballet research that the placement draws on, estimated by the research files it names [argued]. Sources for each row are in the last column.

| Place | What it takes | Form | Depth | Time | Share of research | Proposed in |
|---|---|---|---|---|---|---|
| **The topic: the unit** | Everything in chapters 0 to 12 | Long-form chapters: story walks, works taken apart, object studies, motif walls, say-backs, Apply by lane | Full | about 41 h (Orientation 2 h; Practice about 18 h) | about 45% (scope, scope2, works, products) | `BLUEPRINT.md` |
| **The topic: the Repertory** | 156 works, debates, myths, designers, eras | The line; cards in four tiers; production, era, wall, argument, myth, cross-current, designer cards; eight routes | Full | R0 45 min; R1 12 to 15 h; others 1 to 3 h each | about 55% (dossiers, register, X1, X2) | `REPERTORY_PLAN.md` |
| **Atlas browse** | Every work, person, company, theatre and object as a node | Line for all 156, Label for all, Story for 118, Deep for the 35 W-file works first | Line to Deep | — | the card tiers of the two rows above | `REPERTORY_PLAN.md` §4.2; R1 §5.3; `REVIEW.md` §6.1 |
| **F1.23 Obscured labour** (lead) | The shoe page as a worked credit map: benches by mark, the finishing room, satin and net makers unrecorded, the firm's name and the dancer on the poster; "choreography by Coralli" with Perrot uncredited | Worked example in the lab; 4 to 6 claims | P; Story | 8 to 10 min | about 1.5% | R1 §5.1; `BLUEPRINT.md` "Placements" |
| **F1.4 Interdisciplinary** (lead) | A fifth method, notation; Feuillet's *Chorégraphie* (1700) as a wall tile; *Giselle*'s documents as a repertoire case beside the Noh *honmen* | Wall tile; case; GRM.n rule in the Apply | P; Story | 10 min | about 1% | R1 §5.1 |
| **F1.17 Who commissions** (lead) | "One art through three regimes": Mazarin 1653, Pillet 1841, Diaghilev 1909; Vsevolozhsky's letter (1888) as the worked patron's brief | Side panel in the step-through; worked example for the briefer | P; Story | 10 min | about 1% | R1 §5.1 |
| **About twenty F1 tiles** (F1.1, F1.2, F1.3, F1.5, F1.7, F1.8, F1.11, F1.13, F1.14, F1.15, F1.18, F1.19, F1.19a, F1.19b, F1.20, F1.21, F1.22, F1.22a, F1.24, F1.25, F1.26, F1.30) | One card or one sort case each, beside a case from another world chapter | Label or Story card; one wall row; one sort card | P; Label and Story | 5 min each, about 1.5 to 2 h in all | about 2.5% | R1 §2.1 and §5.2 |
| **F1 Mastery "ballet lens"** (optional) | F1.27 the pointe counter-history; F1.28 grading the chain behind Petipa's plan; F1.28a reconstructing a Feuillet track drawing; F1.29 a consented interview; F1.30a a counterfactual house's brief | Worked examples inside the units' own tools | M; Deep and claims | 6 to 8 h | about 1% | R1 §5.2; `REVIEW.md` §6.2 |
| **F1 closing test and Writing thread** | One ballet case in the briefer's eight-case sort; one argument card, "Who invented the dance: the dancer, or the person who wrote it down?" (1704) | Sort card; argument card | P | under 10 min | under 0.5% | R1 §5.2 |
| **F1.31 regional slot and F1.30a** | Structure prompts for how dance training and presenting reached a place; documented Gulf institutions as canon nodes; *El-Leila El-Kebira* as a canon row; the commission a Gulf house could issue, labelled as an exercise | Structure; Line and Label cards | M | — | under 0.5% | R1 §5.5; `BLUEPRINT.md` ch. 8 |
| **M1.11a World bibles** | Gautier's account, the livret, Petipa's plan for *The Sleeping Beauty*, dissected as world bibles | Documents with reading notes in the Bible Anatomy lab | P; Deep | one sitting | about 1.5% | R1 §5.4; template v2 §6 |
| **M2 Concept DNA** | Fokine's five principles as anti-DNA; Petipa's plan as obligations; *Giselle* read field by field beside Salt Road (R1) **or** *Giselle* moved to the field atlas and the Bauhaus as the twin (`EXEMPLAR_STUDY.md` §6.1, decision 6 default) | DNA reading, or field-atlas entries | P; Story | 1 to 3 sittings | 1 to 2% | R1 §5.4; `EXEMPLAR_STUDY.md` §4.2, §6.1 |
| **M3 World architecture** | The divertissement, the season, the mixed bill, costume families, the repertory with an anchor work; under decision 6, *The Nutcracker*'s economy as M3's opener | Cases; one opener story; field-atlas "Collection map" row | P; Story | 1 to 3 sittings (more as opener) | about 1% (2% as opener) | R1 §5.4; `DECISIONS_2026-10-25.md` 6 |
| **M4 Make and test** | The five modes of remaking, each on at least two works | Wall; cases | P; Story | 1 to 2 sittings | about 1% | R1 §5.4 |
| **S1 Space and experience** | Gas and the white act, the machine stage, the bare stage; the night and the house (Garnier's staircase, access) | Cases beside a non-theatre space | P to M; Story | 1 to 3 sittings | about 1.5% | R1 §5.4; `BLUEPRINT.md` ch. 6 |
| **S2 Object and product** | The pointe shoe as a product line (three ways to name variants; the brown and bronze range); the ballet flat | Object study, part; naming grammar | P; Story | 1 to 2 sittings | about 1% | R1 §5.4; `BLUEPRINT.md` object studies |
| **S3 Body and wearables** | Tutu families; Karinska; skin tone; the *Train Bleu* jersey; under decision 6, the Ballets Russes as S3's opener | Object studies, part; opener story | M; Story | 1 to 3 sittings (more as opener) | about 1% (2% as opener) | R1 §5.4; `EXEMPLAR_STUDY.md` §6.1.5 |
| **S5 Identity and communication** | Posters, programmes, the NYCB lyre, the RBO wordmark; the ballerina's name as a brand | Cases; wall | M; Story | 1 sitting | about 0.5% | R1 §5.4; `BLUEPRINT.md` object studies |
| **S6 and T3** | Notation as an interaction specification; Forsythe's choreographic objects; McGregor's thinking tools; Cunningham's software | Cases | M; Story | 1 sitting | about 0.5% | R1 §5.4 |
| **F3 and the Accessibility thread** | The made body: injury, the narrow body type, disability | One tile cited by level 1 of the thread | P; Label | 5 min | about 0.5% | R1 §4.1, §5.4 |
| **F4 and F5** | Paste, hessian, polyester satin, nylon net, rosin; counts labelled as their counters' | Material cards | P; Label | 5 min | under 0.5% | R1 §5.4 |
| **R2 Money, law and rights** | Copyright, the Balanchine Trust, the Graham ruling; *Nutcracker* licensing; the 1987 *Rite* reconstruction as a rights case | Cases with claims | P; Story | 1 sitting | about 1% | R1 §5.4; `BLUEPRINT.md` ch. 11 |
| **R3 Making it real** | Handover documents: notation, the répétiteur, production bibles, revival packages | Documents as cases | P; Story | 1 sitting | about 0.5% | `BLUEPRINT.md` ch. 11; `EXEMPLAR_STUDY.md` §4.2 (Handover row: Sergeyev's notations). Not yet in R1's link rows |
| **R4 Responsibility** | Makers' pay; waste; the Paris Opéra's 2021 report | Cases | P | 1 sitting | under 0.5% | R1 §5.4 |
| **Field atlas** (a view of the Atlas, by Concept DNA field) | *Giselle* in Premise, Rules, Sources and Lifecycle rows; *The Nutcracker* in Collection map and Rights and money; the Ballets Russes in Adjacent translation and Handover | Entries tagged by field | Story | — | about 1% | `EXEMPLAR_STUDY.md` §4.2, §6.1.4 |
| **Glossary** | Livret, divertissement, répétiteur, corps, turnout, pointe, notation, with "say it to a designer" lines | Glossary entries | Reference | — | negligible | R1 §4.1 |
| **The Historian** | The ballet claims as a claims slice; a world brief for the topic | Data | — | — | all claims, read in slices | `docs/03-partner-voices/historian/index.md`; R1 §1.1 (the misassignment it corrects) |
| **Timeline Atlas** | The 156 works and 155 events, eleven eras, six lanes; filters by wall, region, era and designer | Data and view states | — | — | the register and events | `REPERTORY_PLAN.md` §4.1; `planning/repertory_page/` |

### 3.3 How much of ballet lives only in the topic

**By research words** [argued]. Each research group is counted once, at the share its outside consumers draw on.

| Research group | Words | Outside consumers | Share used outside the topic | Words used outside |
|---|---|---|---|---|
| scope/01 history and institutions | 9,900 | F1.3, F1.11, F1.13, F1.19a, F1.20, F1.31 | 30% | 3,000 |
| scope/02 and pass2 body | 14,400 | F1.27, F1.29, F3, Accessibility thread | 20% | 2,900 |
| scope/03 objects, makers, materials | 8,300 | F1.7, F1.18, F1.19, F1.22, F1.22a, F1.23, F1.25, F4, S2, S3 | 50% | 4,150 |
| scope/04 stage design | 9,000 | F1.19, F1.19b, S1 | 25% | 2,250 |
| scope/05 money, labour, ownership | 12,500 | F1.14, F1.17, F1.18, R2, R4 | 35% | 4,400 |
| scope/06 scholarship and archives | 8,300 | F1.3, F1.24, F1.28 | 20% | 1,650 |
| scope2/G1 music, mime, craft | 8,300 | M1.11a | 5% | 400 |
| scope2/G2 the night and the house | 11,500 | S1, S1.8a, S1.8b | 20% | 2,300 |
| scope2/G3 media, childhood, popular culture | 12,200 | F1.21, S5 | 10% | 1,200 |
| scope2/G4 AI and handover | 9,500 | R3.8, T3, S6 | 20% | 1,900 |
| works/W1 court to imperial | 14,800 | F1.4, F1.17, F1.28, F1.30, M1.11a | 20% | 3,000 |
| works/W2 modernism | 14,200 | F1.15, F1.19b, F1.20, S3 | 15% | 2,100 |
| works/W3 remaking and global | 14,400 | F1.8, F1.13, F1.26, F1.28a, M4 | 20% | 2,900 |
| works/W4 theories of the concept | 11,600 | M1.11a, M2, S6 | 30% | 3,500 |
| products | 8,200 | F1.21, M3, S2, S3, S5, R2 | 40% | 3,300 |
| repertory dossiers D1 to D8 | 167,200 | a few works in F1 tiles and M4 | 5% | 8,400 |
| X1 readings, disputes, myths | 12,300 | F1 argument card, F1.14, F1.27 | 8% | 1,000 |
| X2 design and art | 14,800 | F1.19b, S1, S3, S5 | 10% | 1,500 |
| register, census, timeline events | 27,600 | Timeline Atlas; F1.20's national-ballet wall | 10% | 2,750 |
| pass1, pass2 presentation and verify | 12,500 | F1.23 | 10% | 1,250 |
| structure study and briefs | about 11,000 | planning evidence, not learner knowledge | 0% | 0 |
| **Total** | **about 412,600** | | **about 13%** | **about 53,900** |

Of the 13 per cent, about 23,600 words (5.7 per cent) feed F1 units and about 30,300 (7.3 per cent) feed other modules. **About 87 per cent of the research is read only through the topic and its Atlas cards.**

**By knowledge items** [argued]:

| Item | Count | With an outside consumer | Share |
|---|---|---|---|
| Works | 156 | about 30 (*Giselle* and its remakes, *The Sleeping Beauty*, *Swan Lake*, *The Nutcracker*, *The Firebird*, *The Rite of Spring* and its 1987 reconstruction, *Le Train Bleu*, *Schéhérazade*, *Cleopatra*, *La Bayadère*, *Ballet royal de la Nuit*, *The Flames of Paris*, *Agon*, the *Triadic Ballet*, *The Red Detachment of Women*, the seven national ballets, *El-Leila El-Kebira*) | 19% |
| Object studies | 10 | 10 linked, each consumed in part | 100% linked; about 40% of their content |
| Motif or thread walls | 24 | 4 (the exotic other, folk as national idiom, the remake, two worlds) | 17% |
| Debates | 18 | 4 (who invented the notation; reconstruction as evidence; Orientalism; who is the author) | 22% |
| Myths | 38 | 2 (Taglioni as first on pointe; the 1991 broadcast) | 5% |
| Cross-currents | 13 | 1 or 2 (who paid) | 10% |
| Designers | 65 | 7 (Bakst, Golovin, Sapunov, Picasso, Shervashidze, Karinska, Schlemmer) | 11% |
| Design ideas | 18 | 4 (designer and executant; stage to street; gas and the white act; the bare stage) | 22% |
| Lessons for world-builders | 17 | about 12, each the lesson of a Method or practice unit (documents to M1.11a; rules and refusals to M2; the collection to M3; remaking to M4; the building to S1; media to S5; the credit line to F1.23) | 70% |
| Chapters | 13 | none taken whole; sections of seven are drawn on | 0% whole |
| **All items except lessons and chapters** | **342** | **about 62** | **about 18%** |

**By learner time.** The topic plans about 55 to 60 hours (the unit plus R1). Placements outside it reach about 2.5 hours in F1 Practice, 6 to 8 optional hours in F1 Mastery, and 6 to 10 hours across eleven other modules. A learner on a persona route meets 30 minutes to an hour of ballet outside the topic (Amara: F1.23, F1.19b, S1; Daniel: F1.17, F1.14, F1.26 and the glossary; Mei: F1.17, F1.14, F1.24, F1.26, S2, M3), and Omar, who takes every Mastery unit, about 8 to 10 hours (R1 §5.9).

**What the three measures say together.**

1. **The topic is the authoring home for about 85 per cent of ballet's knowledge, and that is right.** The dossiers alone are 40 per cent of the research and serve only the Repertory.
2. **What other modules consume is the transferable layer.** The lessons for world-builders are 70 per cent reused; the object studies are all linked; the works are 19 per cent reused. Consumers take the idea, the document and the object, and leave the history.
3. **The share depends on open decisions.** If decision 6's openers stand (*The Nutcracker* for M3, the Ballets Russes for S3) and *Giselle* enters the field atlas, the outside share rises to about 16 to 18 per cent of research words and 22 to 25 per cent of items. If the Hub instead keeps *Giselle* as M2's comparison (R1's decision 3), M2's draw doubles and M3's and S3's halve.
4. **The share is already lower than the plans assume in one place:** `CASE_WORLD_PLAN.md` §4 said "a shared ballet case world … which F1 and about a dozen other modules draw on". Twelve modules do draw on it, but at one to three sittings each; the case world is 87 per cent topic.

### 3.4 What ballet shows about the consumption pattern

- **Consumers address cards, documents, object-study sections and walls.** Every row in §3.2 outside the topic names a card ("one card or one sort case each"), a document (Petipa's plan, Vsevolozhsky's letter, Feuillet's *Chorégraphie*), an object study's part ("the pointe shoe, part 2: a product line today"), a wall with a subset ("the exotic other … paired"), a claim set ("4 to 6 claims moved … as F1.23 claims") or a timeline state ("open the line at E5, following the exotic other", `REPERTORY_PLAN.md` §4.1).
- **Each consumer wants a different slice of the same object.** The pointe shoe serves F1.23 (the credit), F1.19 (the machine against the hand), F1.22 (extraction), F1.22a (use), F1.25 (the living practice), S2 (the product line) and F4 (materials). One object study is cut seven ways. The study must be addressable by section, and each section must be true on its own (W12).
- **The research was built for the topic, so the consuming modules' questions are partly unanswered.** R1 found no ballet material for S6 in the first plans; `EXEMPLAR_STUDY.md` found the field atlas only once the Method question was asked. The consuming modules should be able to put questions to the topic, not only take what it offers (§5.4).
- **The borrowing rule is a pedagogy rule, not a data rule.** "One to three sittings per module, each ballet card beside a non-ballet case … a 'what do these share?' task, the principle given after" (`CASE_WORLD_PLAN.md` §4, kept in R1 §5.4). The architecture must make the pairing possible: a ballet card and a card from another topic in the same wall, which requires one card format across topics.

## 4. Generalising to other Atlas concepts

### 4.1 The candidates

The template says "every novel concept in the Atlas (an art form, a movement, a school, a style, a network)" gets a concept unit (template v2, opening paragraph; `DECISIONS_2026-10-25.md` decision 4). The canon already holds 116 movements, 47 schools, 198 styles and 68 networks, plus 93 civilisation names, 107 maker communities, 225 living practices, 169 institutions, 138 materials and 247 techniques (counted this pass from `atlas/data/canon/`). The kinds behave differently when the rest of the program consumes them.

### 4.2 Estimates by kind of concept

Shares are of the concept's knowledge (research and cards) with a consumer outside its own topic [argued]. "F1" counts F1 units other than the world chapter that carries the concept.

| Kind of concept | Examples | Who consumes it, beyond the topic | Outside share | Of which F1 | Protocol load |
|---|---|---|---|---|---|
| **Performance and art forms** (ballet is the instance) | Noh, opera, gamelan, kabuki, shadow theatre (Sbek Thom, Karagöz) | F1.4, F1.16, F1.17, F1.23; M1.11a; M2 or the field atlas; M3, M4; S1, S3, S5 | 12 to 20% | about half | Medium: living performers; sacred repertories in some forms |
| **Design movements and schools** | The Bauhaus, Arts and Crafts, Mingei, De Stijl, Constructivism, Memphis, the Ulm school | F1.15, F1.18 (Bauhaus women weavers), F1.19, F1.19b, F1.20; F2 (opener; proportion and grids); F4 (Morris & Co. as opener); M2 (the Bauhaus as twin, worked fully in thirteen fields); M3 (workshops, book series, Morris's families); S1.10; S2.11, S2.25; S3.12; S5.4, S5.11 (typography and identity); R2 (the Bauhaus trademark, 1960 and 1971) | 30 to 40% (the Bauhaus nearer 45%) | about a third | Low to medium: copyright of twentieth-century images; living-brand rule for retailers named after movements |
| **Art movements** | Land art, light and space, the situationists, institutional critique, Fluxus, Tropicália | S4.11 (named), S4.10, S4.12, S4.33; F1.4 ("the Atlas carries instead": GAP017 Fluxus, MOV065 Tropicália); S6 and M1.11a for digital and net art | 20 to 30% | under a fifth | Medium: almost all images link-only |
| **Civilisations and cultures** | Indus Valley, Edo (Benin), Maya, Wari and Tiwanaku, Nok | F1 world chapters (they are its home); F1.3 (the word as an argument); F2.6 to F2.8 (geometry and grids); F3.7 (colour); F4.9 (scripts); S1.19 (vernacular); S3.14 (dress and textile trade); R2.7 (sovereignty) | 5 to 10% | most of it | High: Notices, restitution, ancestral material, the 1970 test, names (H18) |
| **Crafts and living practices** | Al Sadu (PR-001), kente, Jingdezhen porcelain (PR-014), Diné weaving (PR-013), compagnonnage (PR-016), pointe-shoe making | F1.25 (Practice Reading), F1.29, the world chapters' endings; F4 (materials); S2.6, S2.11, S2.25, S2.40; S3.46; R2.7; the Historian and the Fabricator | 25 to 35% | about half | Highest: consent; "it reaches the record only on their terms" (F1.29); living makers named as their sources name them (F1 decision 10) |
| **Institutions** | Academies and guilds (the Académie Royale de Danse, the Florentine Arti), museums (South Kensington), companies (the VOC, Freed), waqf, opera houses, railways and airlines | F1.11, F1.17, F1.24; S1.8a (museums); S5.11 (identity histories); R1.2 (masterbrands); R1.12a (expositions); R2.3 (patronage) | 20 to 30% | about half | Medium: self-descriptions labelled as such ("described as the first") |
| **Materials** | Cotton, shellac, celluloid, porcelain, indigo, salt, copper | F1 world chapters; F1.4; F1.22 (extraction); F4.1, F4.4, F4.12 (the material deck and dossier); F5; S2, S3 (sourcing, S3.43); R4; the Planet and the Fabricator; Salt Road's researched lineage (`EXEMPLAR_STUDY.md` §6.1.2) | 40 to 50% | about a third | Medium: counts labelled as their counters'; people never described as goods |
| **Techniques and technologies** | Lost-wax casting, movable type, the fly shuttle, dance notation, photography | F1.5 (recurrences), F1.19, F1.28a (reconstruction); F2.x; M4.4; S2.6 (making routes); S3 (draping, knitting); T6 and T10 only as precedents | 20 to 25% | about half | Low |
| **Networks and routes** | The Indian Ocean, the Silk Roads, trans-Saharan, the Manila galleon | F1.13 (home); F1.10; S3.14 (the textile layer); T7 (route data as a teaching dataset); R2.4b (weakly) | 10 to 15% | most of it | High: "human movement is never drawn as goods" |

**The pattern** [argued]. A concept is reused in proportion to how close it sits to a Concept DNA field or a practice area's medium. Materials map onto GRM.m and PLW; design movements onto GRM.f, GRM.v and the whole DNA; crafts onto GRM.k and S2; performance forms onto GRM.n and GRM.t. Civilisations map onto SRC only, and the program teaches them almost entirely inside F1. The concept units the rest of the program needs most are therefore not the ones F1 needs most.

**What this implies for which concept units to build.** By outside demand, the order is roughly: the Bauhaus (twin, opener, five areas), Morris & Co. and Arts and Crafts (F4 opener, M3, S2), *The Nutcracker* and the Ballets Russes (already researched as ballet; M3 and S3 openers), the Sydney Opera House (S1 opener; handover), and the material topics (cotton, porcelain, indigo, salt). This is close to `EXEMPLAR_STUDY.md`'s "fixed cast of eight" (§6.1.4), which was chosen for the Method side and turns out to serve the practice areas too.

### 4.3 Which modules author and which only consume

| Role | Modules | What they author into the Atlas |
|---|---|---|
| **Author, at scale** | **F1** (every unit) | Nodes, claims, objects, grouping pages, world-band cards, concept units, Repertories |
| **Author, for their lineage units** | **F2** (F2.5 to F2.8: proportion systems, Islamic geometry, East Asian modules, textile grids) | Pattern and module systems as technique and text nodes, with the geometric rule as data for the Pattern Generator |
| | **F4** (F4.1, F4.4, F4.6, F4.9) | Material histories and origins; script histories (no canon kind for scripts today) |
| | **S1** (S1.5, S1.10, S1.14, S1.15, S1.19, S1.21) | Building typologies, regional modernisms, vernacular climate techniques, scent and culinary dossiers |
| | **S3** (S3.2, S3.6, S3.11 to S3.15, S3.46) | Dress histories, silhouette lineages, textile routes, dress systems |
| | **S4** (S4.11, S4.13) | Art movements and their works (mostly link-only) |
| | **S5** (S5.11, S5.12) | Identity histories: railways, airlines, institutions, cities, start-ups (new institution and identity nodes) |
| | **S6** (S6.9) | The history of the interface |
| **Author, of a layer** | **M2** | The field atlas: Concept DNA field tags on existing cards and claims, plus the twin's reading |
| | **Every module's regional slot** (principle 11; F1.31's rule) | Local authors write the slot; the program supplies structure and documented institutions as Atlas cards |
| **Author of rights and protocol records** | **R2** (R2.7, R2.8) | Rights status and protocol cases, shared with F1.26 ("one protocol, two depths; changes are made once") |
| **Consume only** | O1; F3; F5; M1 (the apparatus: source tiers, primary texts, source routes); M3; M4; S2 (except craft lineages, where it consumes F1's practices); T1 to T10; R1; R3; R4; R5 | — |
| **Consume as data** | The Historian, the Fabricator, the Client, the Planet; the Timeline Atlas and five other engines | — |

The S areas author more than their place in the build order suggests. S3 alone has about a dozen history units; if each writes its own history, the program will have several timelines, several dress histories and several claim sets that disagree. The link register's last row already forbids that for timelines ("every lineage unit opens the Atlas, not its own timeline"). The same rule is needed for cards and claims.

## 5. Implications for the architecture

(pending)

## 6. Gaps and contradictions in the program documents

(pending)

## Sources read

(pending)

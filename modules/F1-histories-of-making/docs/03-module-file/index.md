# F1 Module File — Histories of making

2026-09-27 · @Mohammad AlFalasi

## Status, and whether research or structure comes first

F1 is at structure v3.6 after research sprints 2 to 6, past gate G1 (2026-09-28) and in phase 4 of workflow v3.2; and the answer to your question is that both directions are real and necessary, that the danger is whichever one is silent, and that the fix is a rule that makes each turn of the loop explicit.

**What actually happened in F1.** The structure came first: the original syllabus set 23 units before any research. Sprint 1 then changed the structure (pivots became recurrences, continents became worlds joined by networks, five units were added), which is research determining structure. Sprint 2 then went looking for objects, dates and frameworks for those units, which is structure determining research. That loop is correct. It becomes a problem in two ways:

| Failure | What it looks like | Why it is dangerous |
|---|---|---|
| Structure silently determines research | Research only fills predetermined units; nobody asks whether "Africa" is the right unit, only which objects go in it | The module confirms itself; the original syllabus's blind spots become permanent |
| Research silently determines structure | The module bends to whatever sources are rich in; CC0 collections are strong on Europe, East Asia, the Islamic world and the Americas, thin on Oceania and early Africa | The structure quietly reproduces the bias of the record, which is exactly what F1 teaches against |

**The rule adopted: two budgets per sprint.** Every research sprint splits its effort between filling and testing, and reports both.

1. Filling (directed by the structure): find objects, dates, sources and frameworks for the units as they stand. Output: registers and claims.
2. Testing (directed against the structure): build a blind map of the subject from benchmarks without looking at our units (tables of contents, course structures, readers' sections, the field's own debates); compare it with the units in a coverage matrix; hunt for what sources are rich in that we have no unit for, and what we have units for that sources are poor in. Output: findings that argue for structural change.

The split is about 70/30 in the first two sprints of a module and about 85/15 afterwards. A testing finding changes the structure only through a versioned entry, and only with evidence: two independent sources, or one benchmark plus one source. After gate G3 (specs and data approved) structural changes stop reopening the module and go to a next-version backlog, so production is not destabilised; research continues, the changes queue.

**Two detectors run permanently.** The coverage report per world shows when the structure is bending to sources (a world with many objects and few units, or many units and few objects). The blind-map matrix (§3) shows when the structure is ignoring the field.

**For the program as a whole.** The same rule applies at the level of the Master Structure: each module's testing budget can propose changes to other modules and to the levels, through the same versioned path; and the first module of each level runs testing at the higher share, because it is the one most likely to find that the level's shape is wrong.

## Research log

Sprint 2 answered three of sprint 1's six open questions, verified the collection pipeline end to end, and produced one finding that changes a unit and one that changes the Atlas; sprint 1's log stays in F1 Pass 2 v1 §3 and is not repeated here.

**Sprint 2 findings**

| # | Finding | Evidence | Effect |
|---|---|---|---|
| 2.1 | The number of independent inventions of writing is itself contested: <cite index="49-1">most scholars hold that writing was invented independently at least four times — Mesopotamia, Egypt, China and Mesoamerica — with the count able to fall if Egypt is shown to have borrowed the idea from Mesopotamia, or rise if other symbol systems are deciphered</cite>, while a recent quantitative study <cite index="50-1">counts four documented independent inventions but acknowledges the total is sensitive to whether Egyptian hieroglyphs are reclassified as stimulus diffusion from Mesopotamia, which would reduce it to three</cite>, and other scholarship <cite index="51-1">names three: the Near East, China and Mesoamerica</cite> | Three sources disagreeing in a documented way | F1.5 teaches the recurrence through the disagreement: the unit's first claim is shown with the confidence grammar (contested), and the learner sees why the count moves. Dates as ranges: <cite index="52-1">Mesopotamia between 3400 and 3300 BCE, Egypt about 3200 BCE, China about 1200 BCE, Mesoamerica between 900 and 600 BCE</cite> |
| 2.2 | The Cleveland Museum of Art open-access API is a complete pipeline for Ring 1: <cite index="64-1">every record carries a share_license_status of CC0, Copyrighted or Other, all metadata is CC0, and only CC0 works also provide CC0 images; the search endpoint takes a keyword and a cc0 filter</cite>. A live test returned records with creation_date_earliest and creation_date_latest (our date ranges, native), provenance chains as dated entries, exhibition histories, bibliographic citations, image URLs at three sizes, and Wikidata links per object | Direct API call, 27 September 2026 | The Atlas record schema maps onto real data with no transformation; provenance and exhibition fields become edges; Wikidata links join Ring 1 to Ring 2 without our own matching |
| 2.3 | Cleveland's open access covers <cite index="62-1">more than half of the museum's collection, updated every January as works enter the public domain</cite>, with <cite index="66-1">rich metadata including authored text, exhibition history, bibliographic citations and provenance information for each artwork</cite> | Museum statements | Cleveland is the first collection to be harvested for Ring 1; the Met, Art Institute of Chicago and Smithsonian follow the same pattern, to be tested next |
| 2.4 | The consultation protocol has a ready frame: <cite index="43-1">the CARE Principles — Collective Benefit, Authority to Control, Responsibility, Ethics — shift the focus from regulated consultation to value-based relationships that position data approaches within Indigenous cultures and knowledge systems</cite>; <cite index="39-1">Traditional Knowledge and Biocultural Labels, developed by the Local Contexts initiative, are metadata labels attached to collection items to communicate community-defined permissions, attribution requirements and cultural protocols; they are governance signals, not legal instruments</cite>; <cite index="44-1">institutions can implement Notices as placeholders while a community develops its Labels</cite> | Three sources | F1.26 is built on CARE; the world-set record gains a Notice or Label field; the sensitivity rule is rewritten in CARE's terms (§5). Checked with Local Contexts (SRC142): Labels are free and for Indigenous communities only, so the programme can never apply a Label; Notices need an institutional Hub subscription from 2025, with free Individual and Collections Care tiers |
| 2.5 | The decolonial critique has a specific warning for a global module: <cite index="30-1">the ready adoption of American and European readings in places like Pakistan and India, and foreign practices displacing local ones</cite> | Sprint 1 source, re-read against v3.3 | The regional slot (F1.31) must be authored locally, not translated from the global units; recorded as a design constraint |

**Sprint 3 plan** (filling 70%, testing 30%)

- Filling: harvest Cleveland for the 60 Atlas v1 objects across all worlds and record coverage; test the Met, AIC and Smithsonian endpoints the same way; date the public-domain primary texts per world (§5); locate public-domain sound and performance sources for F1.4 (United States recordings published before 1923 entered the public domain in 2022, to be verified; the Library of Congress and Internet Archive collections are the candidates).
- Testing: build the blind map for the three units added in v3.4 (§3) and for the world chapters (what a specialist of each world would insist on); run the coverage report per world after the harvest.

**Open questions after sprint 2**

1. Whether Traditional Knowledge Labels can be used by a small program without a licensing agreement, and whether Notices alone are the right first step.
2. Which worlds have fewer than three CC0 objects available at item level (expected: Oceania, early Africa), and which community-published sources can fill them.
3. Which public-domain translations exist for the non-European primary texts (Yingzao Fashi, the Muqaddimah, the Vastu texts), and where paraphrase must replace quotation.
4. Whether Egypt is taught as a third or fourth independent invention, or, as proposed, as the contested case itself.

**Sprint 3 findings** (filling: the Met and Art Institute of Chicago pipelines, audio sources; testing: the pipeline's own limits and what they do to coverage)

| # | Finding | Evidence | Effect |
|---|---|---|---|
| 3.1 | The Metropolitan Museum API is a second verified Ring 1 pipeline: a public-domain search for cuneiform returned 688 objects, and a single record carried objectBeginDate and objectEndDate (−3100 to −2900 for a proto-cuneiform tablet), culture, period, region and sub-region, medium, an isPublicDomain flag, a primary image, subject tags each linked to Getty AAT and Wikidata, and an object-level Wikidata URL; it carries no provenance or exhibition history | Two live calls, 28 September 2026 | The Met supplies dates, places, images and the Ring 2 join; provenance and exhibitions come from Cleveland and AIC where the same object type exists; the first Atlas v1 record is that tablet, for F1.5 |
| 3.2 | The Art Institute of Chicago API is a third pipeline with IIIF deep zoom native, date_start and date_end, place_of_origin, exhibition_history and provenance_text fields, controlled vocabularies for style, technique and material, and a licence split: <cite index="71-1">the description field is CC BY 4.0 and all other data is CC0</cite> | Live calls | Object stories may quote AIC descriptions only with attribution; everything else is free; the Object Story form uses AIC's IIIF directly |
| 3.3 | Twentieth-century objects by community makers are not public domain in these collections: the Kente Wrapper, made 1901–1950 by Asante weavers in Ghana, is flagged is_public_domain false at AIC despite having no named author | Live record | Africa's coverage problem is a rights problem as much as a collecting one: the world set for F1.6 must lean on objects made before about 1900 (Benin, Ife, Nok, Ethiopian manuscripts, older textiles) or on community-published and Wikimedia material; the same rule applies to Oceania and to twentieth-century Indigenous American material; F1.3 teaches this as the record's second bias |
| 3.4 | Public-domain audio for F1.4 exists in quantity: <cite index="74-1">under the Music Modernization Act all sound recordings published before 1 January 1923 entered the United States public domain on 1 January 2022</cite>; <cite index="77-1">recordings published between 1923 and 1946 are then protected for 100 years</cite>, so 1923 to 1926 recordings have since followed; the Library of Congress publishes <cite index="82-1">a National Jukebox dataset of 5,882 recordings from 1900 to 1922 as CSV, JSON and JSONL with metadata and audio files</cite>, and the Jukebox as a whole <cite index="74-1">holds over 16,000 early twentieth-century recordings from the Victor, Columbia and Harmony labels</cite> | Three sources | F1.4's sound strand and F1.21's early consumer culture get a dataset, not a search; performance recordings (vaudeville, spoken word) are in the same set; non-United States jurisdictions differ and are noted per item |
| 3.5 | Bulk harvesting and counting cannot be done from this conversation: the fetch tool strips or caches query parameters on some hosts (Cleveland returned its default listing for every query; a second Met count returned the first query's cached result), and the workspace shell has no route to these hosts | Repeated attempts | Data building needs a runtime outside the chat — a script in the app's build environment or a scheduled job — and counts reported here are single-record verifications, not coverage numbers; this is a workflow change (Hub §3, v3.1) |

**Sprint 3 testing: blind maps for the three new units and the world chapters** (what a specialist of each would insist on, compared with the units)

| Unit | The specialist's insistence | Present in v3.4 | Action |
|---|---|---|---|
| F1.19a War, crisis and making | Utility schemes and rationing; military procurement as the largest patron; camouflage and dazzle as applied ornament; reconstruction and prefabrication; propaganda and typography; refugee and displaced making; the arms trade as a network | Named in the concept line | Cases to draw from Smithsonian NMAH and public-domain government prints; camouflage links to F1.15; procurement links to F1.17 |
| F1.22a Use and consumption | Wear as evidence; repair traditions (kintsugi, darning, visible mending); second-hand trades; inheritance and dowry; advertising and the invention of the consumer; the household as a site of making | Named | Kintsugi and darning link to R4; advertising links to F1.21 |
| F1.30a Counterfactual history | The method must be disciplined: one changed variable, consequences traced with sources, the exercise labelled as fiction; the Narrative Environments tradition and design fiction as models | Named | Spec must include the discipline; the Stranger voice tests whether the counterfactual world's rules hold |
| F1.6 Africa | Metallurgy (iron, Benin brass, Akan gold weights) as technology; textile trades across the Sahara and the Indian Ocean; the colonial museum as the frame of most surviving objects; the twentieth-century rights gap found in 3.3 | Partly | The unit's device becomes metallurgy; the rights gap is stated in the unit |
| F1.7 The Americas | Fibre before pottery in the Andes; the khipu as record-keeping without writing (a recurrence question for F1.5); Mesoamerican writing and the codex; post-contact syncretism | Partly | Khipu joins F1.5's contested list; the unit's device becomes fibre |
| F1.8 East Asia | Bronze casting and the workshop system; porcelain as the world's first global industrial product; the Yingzao Fashi as a modular code; mingei and the twentieth-century craft revival | Partly | The unit's device becomes the workshop; porcelain links to F1.14 |
| F1.9 South and Southeast Asia | Cotton and the chintz trade; the temple as commission; the Mughal karkhana; Indonesian textiles as social documents | Partly | The unit's device becomes cotton; the karkhana links to F1.17 |
| F1.10 The Islamic world | Trade as the engine (Hormuz, Cairo, Córdoba, Samarkand); the astrolabe as science and object; calligraphy as the highest art; the madrasa and the waqf as commissioning institutions | Present as a network | The waqf joins F1.17's regimes |
| F1.11 Europe | The guild system; the printing press as recurrence not origin; the Great Exhibition; the invention of the designer | Present | The unit's device becomes the guild, linking to F1.17 |
| F1.12 Oceania and the Pacific | Navigation as making (stick charts, canoes); tapa and fibre; the sensitivity of most surviving material; contemporary Pacific making as the living tradition | Partly | The unit's device becomes navigation; the rights gap stated |

**Sprint 4 plan** (testing 30%: personas' blind maps — what a maker and a briefer would each insist a history module gives them; filling 70%: harvest in the build runtime once it exists; primary-text dating completed; audio selection from the Jukebox dataset).

**Sprint 4 findings** (testing: the four personas' blind maps, built by asking what each would insist a history module gives them before reading our units; filling: the audio selection rule and the primary-text status completed)

| # | Persona insistence | Present in v3.4 | Effect |
|---|---|---|---|
| 4.1 | Maker: "how was it made" — technique and process as a reading of the object, and how skills travelled (apprenticeship, pattern books, migrating craftsmen), not only how objects travelled | Partly: the Object Autopsy reads material, labour, trade, meaning; F1.13 traces objects | F1.25's full autopsy gains a fifth layer, technique; F1.13's concept becomes "objects, materials and skills"; F1.1 keeps three readings at Orientation. Structure v3.5, minor |
| 4.2 | Maker: "how do I mine history for form without copying" | F1.14 (copying), F1.2 and F1.26 (the line), F1.15 (ornament) | Covered; F1.14's maker Apply is reworded to ask for the transformation, not the source, and links forward to F2.13 |
| 4.3 | Briefer: "how do I check a designer's historical claims" and "what does 'inspired by' cost, legally and ethically" | F1.28 (sources), F1.26 (protocol), F1.14 (licensing forward to R2) | Covered; F1.28's briefer Apply becomes "grade the sources in a designer's presentation" |
| 4.4 | Founder: "heritage as a brand asset, and its risks" | Partly: F1.24 (provenance), F1.21 (platforms) | Cases added to F1.24 and F1.17 (a heritage brand's claims and a restitution case); no new unit; the venture side lives in R1 |
| 4.5 | Student: "a spine I can hold in my head" | The learning designer's recall deck was proposed, not specified | The F1 recall deck (60 Atlas v1 objects, spaced) is specified as a component of the reference form; it is the Introduction slice's memory |
| 4.6 | All four: "where is my own place in this" | F1.31 regional slot; the Lineage view | Covered; the Lineage view opens at F1.1, not at the end, so the learner's own object is the first node |
| 4.7 | Audio selection rule for F1.4 and F1.21 | New | From the National Jukebox dataset: one vaudeville or spoken-word recording (performance), one early jazz or blues recording (subculture to mainstream, forward to S3.13), one advertising or novelty recording (the consumer, forward to F1.21), one opera aria (the commissioned art, forward to F1.17); each with its date, label and matrix number, and each checked against the 1923 line; non-United States status noted per item |
| 4.8 | Primary-text status | §5 table | Confirmed as the working list; no further public-domain English translation found for the Yingzao Fashi or the Muqaddimah; both stay as paraphrase with citation |

**Research status after sprint 4.** F1: Sprinted (4). Filling is complete to the point that the build runtime allows; testing has run against the field, the sources, the pipeline and the personas. Research continues inside phase 4 at about 85/15 as unit specs are written, with findings logged here.

**Sprint 5 findings** (sources and alternative routes of knowledge; testing budget raised to 50% because the question was what the record itself leaves out)

| # | Finding | Evidence | Effect |
|---|---|---|---|
| 5.1 | Making knowledge is also held in living practices, and a major open archive documents it: the British Museum's Endangered Material Knowledge Programme <cite index="84-1">funds work recording threatened knowledge of making, use, repair and repurposing of objects, architectures and environments, in close collaboration with source communities, and publishes the results under a Creative Commons licence in an open-access repository shared with in-country institutions and communities</cite>; <cite index="86-1">documentation includes film, audio, photographs, notes, maps, 3D models and drawings</cite>; current projects include <cite index="85-1">dry-stone masonry at Great Zimbabwe</cite> | Three sources | A source for the technique layer (finding 4.1) and for the Africa and Oceania gaps that CC0 museum collections cannot fill; a model for F1.29's documentation method; Great Zimbabwe masonry becomes a case in F1.6. The licence is CC BY-NC-SA 4.0 (SRC104, verified), which is not open under our rule |
| 5.2 | Living practices exist as open, structured data: UNESCO's intangible heritage dataset is <cite index="104-1">released as a full JSON graph with CSV subsets and updated once a year after the Intergovernmental Committee's session</cite>, organised as <cite index="105-1">a semantic graph whose main nodes are the inscribed elements, linked to projects, NGOs, countries, regions and concepts from UNESCO's thesaurus</cite>; inscribed crafts include <cite index="109-1">Chinese timber-framed architectural craftsmanship, Nanjing Yunjin brocade, mechanical watchmaking in Switzerland and France, Aleppo Ghar soap and kente weaving</cite>, and the 2025 Register of Good Safeguarding Practices includes <cite index="113-1">a safeguarding programme for Al Sadu weaving in the United Arab Emirates</cite> | Four sources | A new Atlas entity, Practice (a living tradition with holders, places and transmission), sourced from this graph and from EMKP; it bypasses the twentieth-century rights gap (finding 3.3) by showing the practice, not the museum object. F1.3 gains a third bias of the record: heritage lists are nominated by states, so they are a state's account of a community's practice. Al Sadu is noted as the first regional-vertical case. Dataset licence to verify |
| 5.3 | Europe and the Pacific have aggregators with open metadata: Europeana's <cite index="100-1">metadata is published under CC0</cite>, <cite index="94-1">its APIs are free without throttling, and a reusability filter restricts results to openly licensed content</cite>, drawing on <cite index="96-1">more than 2,500 institutions and over 32 million records</cite>; a federated library shows the same pattern exists for <cite index="99-1">the Digital Public Library of America, Australia's Trove and DigitalNZ</cite> | Four sources | Europeana for F1.11 and F1.15; DigitalNZ and Trove as candidate sources for F1.12 Oceania, with Māori and Aboriginal material handled under CARE and the providers' own rights terms, to verify |
| 5.4 | The Atlantic network has a scholarly open dataset that must be handled differently from any object data: SlaveVoyages is <cite index="98-1">a multi-source, open-access dataset and interactive site of trans-Atlantic and intra-American slave-trade voyages, built to account for double-counting and regional under-representation</cite> | One source, to be verified for licence | F1.13 gains a rule: human flows are never drawn with the visual grammar of goods flows; enslaved people appear as people, with a content note, and the cotton, sugar and textile flows that the trade financed are linked from F1.19 and F1.22 |
| 5.5 | The Atlas as designed holds objects, not the people and practices that carry knowledge forward | Findings 5.1–5.2 | Two entity types added: Practice and Living maker (with consent, from EMKP and community-published sources); each world chapter (F1.6–F1.12) ends on a living practice; the Object Autopsy gains a sibling, Practice Reading (who holds it, how it is taught, what it needs to continue) |

**Sprint 6 findings** (angles from adjacent disciplines)

| # | Discipline and angle | Evidence | Effect |
|---|---|---|---|
| 6.1 | History of science: reconstruction as a way of knowing. The Making and Knowing Project's open critical edition of a sixteenth-century workshop manuscript holds <cite index="119-1">over 900 recipes for making art objects, remedies and household and workshop materials</cite> (a figure not found on any page opened on 2 October 2026), presented as <cite index="114-1">facsimile images, diplomatic and normalised French transcriptions, and an English translation</cite>, with <cite index="115-1">over 100 essays on the hands-on reconstruction of its processes in the Making and Knowing Laboratory</cite>, and <cite index="118-1">an open teaching companion with syllabi and student activities</cite> | Benchmark and source | New unit F1.28a Reconstruction: making to know (Mastery). The maker reconstructs one historical technique from a primary text and records what the text did not say; the briefer judges a "traditional technique" claim by the evidence a reconstruction would need. The edition's content is CC BY-NC-SA 4.0, which is not open under our rule; MIT covers only its software, EditionCrafter |
| 6.2 | Anthropology of technique: the operational sequence (chaîne opératoire, after Leroi-Gourhan and Lemonnier) — a technique read as an ordered chain of gestures, tools, materials and knowledge | Grounding references, to be cited from open sources | The fifth autopsy layer (technique, finding 4.1) is built as an operational-sequence strip: the learner orders the steps, then sees the reconstruction or the documented practice |
| 6.3 | Material culture studies: the object biography and the social life of things (Kopytoff, Appadurai) | Grounding references | F1.22a and the provenance chain are framed as the object's biography; the Atlas's held-by edges are its chapters |
| 6.4 | Disability history: assistive and adapted objects, and making by disabled makers, are absent from F1 | Gap against the Accessibility thread | A body-and-access lens is added to the Atlas; cases added to F1.22a (use) and F1.23 (credit); level 1 of the Accessibility thread now starts in F1, not F3 |
| 6.5 | Sensory history: how making sounded, smelled and felt | Partly covered by F1.4 audio | Story view uses sound wherever the record has it (workshop recordings in EMKP, Jukebox recordings of trades); no new unit |
| 6.6 | Foodways as making: utensils, vessels and ritual meals | Present in the intangible heritage graph | Cases in F1.16 (ritual) and F1.22a (use); no new unit |
| 6.7 | Digital humanities: minimal computing — the Making and Knowing Project <cite index="118-1">keeps its content openly and sustainably available by favouring durable, basic technologies and workflows</cite> | Benchmark | Confirms the Atlas data rule (static, versioned JSON per world) and adds one: every Ring 1 record also exported as plain CSV, so the world set outlives the app |

**Where sprints stand.** Six run. Sprint 6 produced one new unit and several layers and lenses; sprints 5 and 6 together produced more sources than concepts. That is the signal that standalone sprints are reaching diminishing returns for F1. The two tests that remain cannot run here: a specialist of each world reading their chapter, and five learners using the first units. Both belong in phase 5 (test), with a lighter version possible now through the partner's Historian voice briefed as a regional specialist.

**Deep Dives 1 (28 September 2026), findings for this log.** (1) Read against 43 sub-regions, F1 covers 9 strongly, 13 partly, 5 thinly and 16 not at all; the whole of West Asia before Islam, Mediterranean antiquity, the steppe, Australia, Amazonia and the Caribbean are gaps. (2) Only objects had a record; eight other node types had none. (3) Licence is not provenance: 3 of 17 live-verified candidates failed on provenance or date, all of them licensed. (4) Benin's brass came mainly from Rhineland manillas (Skowronek et al. 2023). (5) Firecrawl reaches the museum APIs with query parameters intact, at 11 requests a minute: enough for deep dives, not for the harvest. (6) The Met's API has no provenance field. Details and sources are in F1 Deep Dives 1.

**Deep Dives 2 and Atlas Logic (28 September 2026), findings for this log.** (1) The Met's public-domain search filter returns objects whose own records are not public domain; every hit is now checked at record level. (2) Cleveland's CC0 set has no barkcloth, chintz, batik or ikat (it does hold Ordos bronzes: nine CC0 records, including 1952.115, 1962.46 and 1916.1189); the Pacific, South Asian textile and steppe units need other sources (Te Papa, the Rijksmuseum, the Smithsonian, and image permissions from the Hermitage). (3) The Botai horse-domestication claim has been revised by genetics; modern domestic horses spread from the Volga–Don about 2000 BCE. (4) Early Chinese cobalt most likely came from Anarak, not Kashan. (5) Three "Mamluk" glass pieces in Cleveland are 19th-century European work. (6) Coverage after the round: 21 sub-regions strong, 12 partial, 6 thin, 4 absent. (7) No major resource groups world making by civilisation; the Atlas uses twenty grouping kinds and keeps civilisation names as searchable labels.

**Groundwork round (28 September 2026), findings for this log.** (1) Of 16 records read at source, 10 pass the 1970 test, 1 needs an enquiry, 4 fail (WS-005, WS-042, WS-091, WS-101) and 1 falls outside it (WS-015); the flags had mixed history gaps with test failures. (2) The Met's provenance is on its object pages, not its open API; the harvester reads it there. (3) Cleveland's search is fuzzy (1957.36 also returns 1957.36.a and .b); the harvester keeps exact matches only. (4) F1.1's anchor tablet and its sibling were in the Erlenmeyer collection by the early 1960s; how they left Iraq is not recorded. (5) Registers v0 exist as files: 77 world-set records, 110 claims (95 documented, 11 contested, 4 probable, 0 interpretive), 12 practices; only 9 claims name their node. (6) Open exemplars per chapter: F1.12 has none, the steppe one, South Asia three. (7) The Historian pre-read found 42 risks; the cross-cutting ones are "first", an unevenly applied funerary rule, claims leaning on "documented", success criteria that take sides, a pack behind the deep dives, and names in the Gulf. (8) Mingei's named makers are in copyright, while the anonymous work it collected is open. Details: [F1 Groundwork](https://claude.ai/code/artifact/6d02bdf9-1689-4a2b-b1fe-258e11817b83).

## Coverage matrix

The blind map was built from what the field itself organises the subject by — Margolin's chronology, geography and cross-cutting themes; the Design History Reader's sections; Smarthistory's reframed global textbook; the Narrative Environments course's order of operations; Ansari's critique — without looking at our units; compared with F1 v3.3 it shows twelve of fifteen field themes covered and three missing, which v3.4 adds.

| Field theme (from benchmarks) | Where the field states it | F1 v3.3 coverage | Verdict |
|---|---|---|---|
| Chronology from pre-human toolmaking to the present | Margolin's deep start; the pivots tradition | F1.5 recurrences; F1.19–F1.22 | Covered |
| Geography: every region as a site of design | Margolin's geographic chapters; Reframing Art History | F1.6–F1.12 worlds | Covered, reframed as worlds and networks |
| Cross-cutting themes: exhibitions | Margolin's age-of-exhibitions chapters | F1.15 | Covered |
| Cross-cutting themes: colonialism and its repercussions | Margolin; the Reader's decolonising section | F1.2, F1.24, F1.26 | Covered |
| Cross-cutting themes: war | Margolin's extended World War chapters | Only as Occurrences data | Missing as a unit: war, crisis and making (rationing, military production, reconstruction, propaganda, displacement) |
| Historiography: how design history is written; design history versus design studies | The Reader's sections; Margolin–Forty debate | F1.3 | Covered |
| Modes of production | The Reader's section | F1.17, F1.18, F1.19 | Covered |
| Gender | The Reader's section | F1.18 | Covered, textiles-led; the unit's cases must reach beyond textiles |
| Consumption, use and the life of things in households and hands | The Reader's consumption strand; Forty's Objects of Desire | Not present; F1 is production-led | Missing as a unit: use and consumption, how things were lived with |
| Local, regional, national, global; glocal teaching | The Reader; the Arab graphic-design study | F1.31 and the regional slot rule | Covered, on condition of local authorship |
| Sustainability and the material record | The Reader; the planetary thread | F1.22 | Covered |
| Demythologise, deconstruct, decolonise, decommodify | Narrative Environments' first move | F1.3, F1.15, F1.24 | Covered |
| Systems mapping through counterfactuals and speculative histories | Narrative Environments' second move | Not present | Missing at Mastery: counterfactual history, a history that did not happen, as a maker's and briefer's exercise and a bridge to M1's speculative research |
| Pluralism is not decolonisation | Ansari | F1.3, F1.30 | Covered, and made a design constraint |
| The object read as a document | Smarthistory's form; 100 Objects | F1.1, F1.25 | Covered |

**Where sources are rich and we have no unit.** Exhibition histories and provenance chains arrive with every Cleveland record; v3.3 uses them in two units (F1.15, F1.24). A third use is added without a new unit: the Occurrences view gets an exhibitions layer from the records themselves.

**Where we have units and sources are poor.** Oceania (F1.12) and early Africa (F1.6) in CC0 collections; sound and performance for F1.4. These are tracked in the coverage report, not solved by cutting the units.

**Changes adopted into v3.4.** Three units added (F1.19a War, crisis and making; F1.22a Use and consumption; F1.30a Counterfactual history at Mastery); F1.5 rebuilt around the contested count of writing's inventions; F1.18's case set widened beyond textiles; F1.26 rebuilt on CARE with a Notice or Label field. Evidence threshold met for each: at least one benchmark and one source.

## F1 structure v3.4

Thirty-four units, about 4 / 22 / 20 hours; this table is now the live list for F1 (the v3.3 table in Pass 2 v1 is superseded), and the Δ column marks what sprint 2 changed. Columns as before: opening move and forms (1 scrollytelling, 2 step-through, 3 object story, 4 explorable, 5 before/after, 7 video, 8 audio, 10 comparison wall, 11 timeline scrub, 12 map, 13 argument card, 14 sequential illustration, 15 prediction prompt); Apply M = maker, B = briefer.

| Unit | Concept | Depth | Field | Opening · forms | Apply (M / B) | Voice | Δ |
|---|---|---|---|---|---|---|---|
| F1.1 | One object, three readings: material, labour, meaning | O | SRC | Object first · 3 | M: read an object you own / B: write its attribution line | Historian | — |
| F1.2 | The reference-to-appropriation spectrum | O | SRC | Prediction first · 15, 3 | Both: sort six cases on the plane; B: flag the one you would stop | Historian | plane, not line |
| F1.3 | How histories get written: canons, periods, the timeline as an argument; design history versus design studies | P | SRC | Argument first · 13, 11 | Both: annotate a canonical timeline for what it excludes | Mirror | widened |
| F1.4 | Interdisciplinary discourse: film, performance, sound, gaming and digital culture as teachers of making | P | SRC, GRM.n | Story first · 10, 7, 8 | Both: extract one method for your world | Mirror | audio sources pending |
| F1.5 | Recurrences: writing was invented three or four times; cities, metallurgy, weaving and printing many times | P | SRC | Data first · 1, 11 (simultaneity view) | Both: place three objects on parallel rows as ranges; state the count you accept and why | Historian | rebuilt on the contested count |
| F1.6 | Worlds of making: Africa | P | SRC | Object first · 3, 10 | M: reference note / B: reference note with consultation flag | Historian | coverage flagged |
| F1.7 | Worlds of making: the Americas | P | SRC | Object first · 3, 10 | same | Historian | — |
| F1.8 | Worlds of making: East Asia | P | SRC | Object first · 3, 10 | same | Historian | — |
| F1.9 | Worlds of making: South and Southeast Asia | P | SRC | Object first · 3, 10 | same | Historian | — |
| F1.10 | The Islamic world as a network: a world made of routes | P | SRC | Data first · 12, 3 | same, plus a route your world could use | Historian | — |
| F1.11 | Europe as one world among several | P | SRC | Object first · 3, 10 | same | Historian | — |
| F1.12 | Worlds of making: Oceania and the Pacific | P | SRC | Object first · 3, 10 | same, with the sensitivity notice explained | Historian | coverage flagged |
| F1.13 | Networks: Silk Roads, Indian Ocean, trans-Saharan, Mediterranean, Atlantic, Pacific | P | SRC | Data first · 12, 1 | Both: trace one object's route end to end | Historian | — |
| F1.14 | Copying, transfer and counterfeit | P | SRC, RGT | Object first · 5, 3 | M: the copy in your references / B: the clause it would have needed | Historian | — |
| F1.15 | Ornament as a global language; the exhibition as taxonomy | P | GRM.f, SRC | Prediction first · 3, 10 | Both: Pattern Comparer; B: name what was extracted and from whom | Historian | exhibitions layer from records |
| F1.16 | Ritual and belief as drivers of making | P | GRM.n, SRC | Object first · 3, 8 | Both: the ritual your world serves | Historian | — |
| F1.17 | Who commissions: patrons, guilds, merchants, industry, agencies, platforms | P | SRC, CMB | Argument first · 2, 13 | M: your place in the chain / B: the patron's brief | Client | exemplar spec |
| F1.18 | Textiles and the making called women's work; women's making beyond textiles | P | SRC, GRM.m | Making first · 3, 7 | Both: a credit line | Historian | cases widened |
| F1.19 | Industry, the machine and the exhibition | P | SRC | Story first · 1, 3 | Both: what the machine changed in your medium | Fabricator | — |
| F1.19a | War, crisis and making: rationing, military production, reconstruction, propaganda, displacement | P | SRC, PER | Story first · 1, 12 | Both: what a crisis would do to your world's supply, materials and message | Fabricator | added |
| F1.20 | Modernisms, plural | P | SRC | Object first · 10, 13 | Both: the modernism your world descends from, and refuses | Historian | — |
| F1.21 | Consumer society, the digital and the platform | P | SRC | Story first · 1, 7 | Both: the platform your world lives on | Client | — |
| F1.22 | The planetary present: making as extraction | P | SRC, PLW | Data first · 12, 4 | Both: the material chain of one object you own | Planet | — |
| F1.22a | Use and consumption: how things were lived with, worn out, repaired, resold, inherited | P | SRC, LCY | Object first · 3, 5 | M: the use-life of your anchor / B: what the brief must say about use | Mirror | added |
| F1.23 | Obscured labour: the credit map | P | SRC | Object first · 3 | Both: credit map of your own project | Historian | — |
| F1.24 | The museum as author: collecting, provenance, restitution | P | SRC | Argument first · 13, 3 | M: a provenance chain / B: what to ask a museum partner | Historian | provenance from records |
| F1.25 | Reading an object as history: slow looking and the autopsy | P | SRC | Lab first · Object Autopsy, full | Both: a full autopsy | Mirror | — |
| F1.26 | Attribution and consultation as protocol, on the CARE principles | P | SRC | Problem first · 2, 15 | Both: draft the protocol; B: apply it to a real brief | Historian | rebuilt on CARE |
| F1.27 | Counter-history research piece on one lineage | M | SRC, DOS | Artifact first · Atlas authoring | Both: the piece with an attribution record | Historian | — |
| F1.28 | Primary sources and archives | M | SRC | Problem first · Source Grader | Both: five sources graded, one translation dated | Historian | text list in §5 |
| F1.29 | Vernacular intelligence: oral history, folktale, local taxonomy, with consent | M | SRC | Making first · Oral History Kit | Both: one consented account | Historian | Notice or Label field |
| F1.30 | Re-timing the Atlas: other calendars and periodisations | M | SRC | Data first · Calendars | Both: your lineage on another calendar | Historian | — |
| F1.30a | Counterfactual history: a history of making that did not happen | M | SRC, PRM | Problem first · 1, 13 | M: one object from the counterfactual, made / B: the brief that world would have issued | Stranger | added |
| F1.31 | Regional slot: the learner's own place, authored locally | M | SRC | Artifact first · Lineage | Both: the slot filled | Historian | local authorship constraint |

**Closing test.** Unchanged from v3.3: the maker's Object Autopsy on an unseen object with attribution line and material origin; the briefer's sort of eight cases on the plane with reasons and consultation notices; one line into the sources record.

**Changes since v3.4** (the full v3.6 list, with the Was mapping, was merged into the Master Structure register on 2026-09-28; the table above stays at v3.4 as the record of sprint 2)

| Version | Change | From |
|---|---|---|
| v3.5 | F1.25's autopsy gains a fifth layer, technique; F1.13 becomes "objects, materials and skills"; F1.14's maker Apply asks for the transformation; F1.28's briefer Apply grades a designer's sources; heritage-brand and restitution cases in F1.24 and F1.17; the recall deck specified; the Lineage view opens at F1.1 | Sprint 4 |
| v3.6 | F1.28a Reconstruction: making to know (M) added; Atlas entities Practice and Living maker; each world chapter ends on a living practice; Practice Reading as the autopsy's sibling; F1.3 adds the state-authored heritage list as a bias of the record; F1.13 human-flow rule and SlaveVoyages; body-and-access lens; accessibility level 1 moves into F1; every record exported as CSV | Sprints 5 and 6 |

Unit count after v3.6: 35. Hours: 4 / 22 / 22 (the descriptor's hours update with the register).

## Data and sources

The pipeline from an open collection to an Atlas record is verified; the remaining data work is harvesting, checking coverage, dating the primary texts and settling the protocol labels.

**How a collection record becomes an Atlas record** (verified on Cleveland; the same mapping to be tested on the Met, AIC and Smithsonian)

| Atlas field | Collection field | Note |
|---|---|---|
| Title, accession, collection | title, accession_number, creditline | credit line reproduced as the collection requires |
| Date range with uncertainty | creation_date_earliest, creation_date_latest, creation_date (text) | native ranges; never drawn as a point |
| Place and world | culture, find_spot, department | world assigned by us; place resolved to Getty TGN or Pleiades where possible |
| Materials | technique, support_materials | material origins added by our research, not in the record |
| Makers and labour | creators (name, role, dates) | unnamed workshops recorded as such; community field added by us |
| Provenance chain | provenance (dated entries) | each entry becomes a held-by edge |
| Exhibited at | exhibitions (current and legacy) | each becomes an exhibited-at edge and an Occurrences entry |
| Sources | citations | grade assigned by the Source Grader |
| Image and licence | images (web, print, full), share_license_status | only CC0 status yields images; status re-checked each January when collections update |
| Ring 2 join | external_resources.wikidata | the object's Wikidata id links movements, people, places without our own matching |
| Sensitivity and Notice or Label | not in the record | added by our review; default exclusion for sacred, ancestral and funerary material |
| Story, alt text, audio description | not in the record | written by us; museum label text used only for facts |

**Collections status**

| Collection | Access | Status | Next |
|---|---|---|---|
| Cleveland Museum of Art | Keyless API; CC0 filter; provenance, exhibitions, citations, Wikidata links | Verified live | Harvest the 60 Atlas v1 objects; coverage report |
| Metropolitan Museum | Public API; public-domain flag | Known, untested this sprint | Test the same mapping |
| Art Institute of Chicago | Public API; public-domain images | Known, untested | Test |
| Smithsonian Open Access | API with key; licence varies by record (CC0 only where marked) | Known, untested; key needed | Register and test |
| Rijksmuseum, National Gallery of Art, Cooper Hewitt | APIs or open data dumps | Known, untested | After the first four |
| Archnet | Item-level terms | Known | Terms per item for F1.10 |
| Wikimedia Commons | Item-level licence | Known | Gap filling for Oceania and early Africa |

**Update after sprint 3.** The Met and AIC rows above move to Verified live; the Met supplies dates, places, images, AAT and Wikidata links but no provenance or exhibitions; AIC supplies dates, places, provenance, exhibitions and IIIF, with descriptions CC BY and the rest CC0. Rights finding 3.3 adds a rule to the world-set register: an object's licence is checked per record, never assumed from its maker being anonymous or its date being old, and the coverage report counts licensed objects, not objects. The Library of Congress National Jukebox dataset joins the sources list for F1.4 and F1.21.

**Protocol frameworks adopted for F1.26, F1.29 and the world-set record**

| Framework | What it gives | How F1 uses it |
|---|---|---|
| CARE Principles for Indigenous Data Governance | Collective Benefit, Authority to Control, Responsibility, Ethics as the frame for handling data and heritage of Indigenous Peoples | F1.26's protocol is structured on the four principles; the briefer's version becomes a checklist for any brief that references a living tradition |
| Local Contexts Traditional Knowledge and Biocultural Labels, and Notices | Community-defined permissions, attribution and cultural protocols carried as metadata; Notices as institutional placeholders | A Notice or Label field on every world-set record; Notices applied by default to material from Indigenous communities until a community's own Labels exist; Labels are applied only by communities, never by the programme; Notices need an institutional Hub subscription from 2025 (free Individual and Collections Care tiers), and the icons may not be altered (SRC142) |
| Free, prior and informed consent | The standard for oral-history and community material | The Oral History Kit's consent flow (F1.29) |
| UNESCO 2003 convention on intangible heritage | The international frame for craft and oral traditions | Referenced in F1.26; to be verified for citation |

**Sensitivity rule, restated in CARE terms.** Authority to control rests with the source community: material that is sacred, ancestral or funerary is excluded by default; material from Indigenous communities carries a Notice; a Label replaces the Notice when the community has issued one; any exception is recorded with its source and reviewed.

**Primary texts per world, with public-domain status** (originals and translations differ; every entry to be confirmed before use)

| Text | World and unit | Status |
|---|---|---|
| Vitruvius, De architectura (Morgan translation, 1914) | Europe; F1.11, F1.28 | Public domain, original and translation |
| Theophilus, On Divers Arts (Hendrie translation, 1847) | Europe; F1.17, F1.18 | Public domain |
| Cennini, Il Libro dell'Arte (Herringham translation, 1899) | Europe; F1.17 | Public domain; later translations in copyright |
| Vasari, Lives (De Vere translation, 1912–15) | Europe; F1.3 | Public domain |
| Li Jie, Yingzao Fashi (1103) | East Asia; F1.8 | Original public domain; no complete public-domain English translation known; paraphrase with citation |
| Ibn Khaldun, Muqaddimah | Islamic world; F1.10, F1.17 | Original public domain; the 1958 English translation in copyright; a nineteenth-century French translation is public domain; paraphrase for English |
| Vastu and Shilpa texts | South Asia; F1.9 | Originals public domain; translations vary; verify each |
| Owen Jones, The Grammar of Ornament (1856) | Exhibitions; F1.15 | Public domain |
| Great Exhibition catalogues and reports (1851) | F1.15, F1.19 | Public domain |
| Ruskin, Morris, Dresser, Pugin | Europe; F1.19 | Public domain |
| Semper, Der Stil (1860s) | Europe; F1.18 | German original public domain; English translations in copyright |
| Loos, Ornament and Crime (1908–10) | Europe; F1.15 | German original public domain; translations vary |
| Gropius, Bauhaus manifesto (1919) | Modernisms; F1.20 | Public domain in the United States by date; not yet in life-plus-seventy jurisdictions; quote by jurisdiction rule |
| Sullivan, The Tall Office Building Artistically Considered (1896) | F1.19 | Public domain |
| Guild records, merchant ledgers, pattern books | F1.17 | Public domain by date; sourced from Internet Archive and national archives |

## Atlas and interactives: what sprint 2 changes

The Atlas design in F1 Pass 2 v2 stands; sprint 2 changes four things in it, all because the collection records turned out to carry more structure than the design assumed.

| Change | Why | Effect on the design |
|---|---|---|
| Exhibited-at edges and an exhibitions layer in the Occurrences view | Every record carries its exhibition history, dated | F1.15 and F1.24 gain data without new research; the Coverage Mirror can show how often an object has been exhibited and where |
| Provenance chains as first-class edges | Records carry dated provenance entries | The Connections view can trace ownership across centuries; F1.24's provenance chain is a query, not a drawing |
| Ring 1 to Ring 2 join through the record's own Wikidata id | Cleveland records link to Wikidata | Movements, people and places attach to objects without our matching; the two-relation rule applies from those ids |
| Date ranges native | Records carry earliest and latest dates | The Timeline's range bars need no transformation; uncertainty is the record's own |

**Interactives affected.** Connect Two Things gains provenance and exhibition edges; What Was Happening Elsewhere gains exhibitions; the Object Autopsy's provenance layer reads the record; the Spectrum Sort becomes the Spectrum Plane (two axes, reference-to-appropriation and harm) as decided in Pass 2 v2.

**Registers to open in phase 4** (as tabs of this file or sheets)

| Register | Columns | First entries |
|---|---|---|
| World set | the Atlas record schema plus world, units, sensitivity, Notice or Label, coverage flag | the 60 Atlas v1 objects, from the Cleveland harvest first |
| Claims | subject, relation, object, source, confidence (documented, probable, contested, interpretive), unit | the writing-inventions count (contested) as entry 1 |
| Assets | asset, type, source, licence, units, alt text status | Owen Jones plates; exhibition prints |
| Coverage | world, objects verified, units served, gap flag | after the first harvest |
| Partner prompts | voice, unit, prompt, tested on, drift notes | the Historian for F1.5 and F1.26 first |

## Audit across all versions, after the sprints

Every section of every earlier document was checked for whether F1 now carries what it should; four items were orphaned and are pulled in here, and one program-level requirement — a module descriptor — had never been written for F1, so it is written below.

**Section-by-section audit** (source → where it lives now for F1 → status)

| Source | What it asked of F1 | Lives now | Status |
|---|---|---|---|
| Original syllabus 1.1 (six units) | Global discourse, historiography, vernacular intelligence, ethics of reference, obscured labour, regional centering | F1.4, F1.3, F1.29, F1.2 and F1.26, F1.23, F1.31 | Carried |
| Analysis §3 (F1 essential question, resources, method, interactives, evidence) | The question "whose history is our design history"; timeline, spectrum, credit map, atlas; annotated counter-history and case rulings | §4; the Atlas; F1.27; the closing test | Carried; the analysis's Regional Material-Culture Atlas became the Atlas as a whole |
| Analysis §8–§9 (patterns; unit anatomy; threshold concept 1) | Layered Timeline, Spectrum Sort, Guess-and-Reveal; "history is a web, not a line" | Pass 2 v2 §4; the descriptor below | Carried; the threshold concept now leads the descriptor |
| Concept v1 §3 (F1 as first drafted for two lanes) | Object Autopsy; nine pivots; centres and peripheries; Apply for both lanes | Rebuilt: pivots to recurrences; centres to worlds and networks | Superseded by design |
| Concept v1 §7 (research plan by module type; the four files) | Historical modules need world sets, scholarship, primary sources; source list, case library, claims sheet, open questions | §2 log; §6 registers | Carried; the four files are the world-set, claims, asset and coverage registers plus the log |
| Concept v2 §4 (vocabulary) | Precise terms, no adjectives; terms named after the lab | Unit names in §4; the rules apply | Carried |
| Final Structure §5 (twelve principles), §8 (threads), §9 (voices), presentation forms, consumption matrix | Opening moves; Attribution thread checkpoints; the Historian and Planet voices; forms per unit; three consumption forms per unit | Opening moves and forms in §4; voices in §4 | Partly: consumption forms are specified only for F1.17; the rule is now that every unit spec carries them (pulled in) |
| Final Structure §6 (module-level program) | A module descriptor: aims, three to five outcomes, evidence, hours, prerequisites; the closing test | Closing test and hours in §4 | Orphaned until now: the descriptor is written below |
| Master Structure §2–§3 (artifact schema; F1's 23 units) | SRC as the field; unit rows | §4 with the mapping | Carried; the register itself still holds the 23-unit list and must be updated to v3.4 (Hub action) |
| Master Structure §9–§11 (Timeline Atlas engine; media; lecture rules) | Layers by version; media codes; lecture conversion | Pass 2 v2 §2–§3; §6 here | Carried and extended |
| F1 Pass 2 v1 §2 (benchmarks), §4 (expert round), §7 (rights and media plan), §8 (exemplar unit) | Benchmarks; 26 flaws; five rights rules; media counts; the F1.17 standard | Referenced from this file | Carried as frozen reference; the rights rules are restated in CARE terms in §5, the media plan stands and gains the audio dataset |
| F1 Pass 2 v1 §6 (world-set candidates; Atlas spec v1) | Candidates by unit; layers by version | Superseded by Pass 2 v2's Atlas and by §5 here | Superseded; candidates list remains the harvest's shopping list |
| F1 Pass 2 v2 §5 (scenarios), §6 (UI and front end), §7 (staging, risks, questions) | Seven archetypes; layout and components; four Atlas versions; five questions | Referenced; questions consolidated in the Hub | Carried; one orphan pulled in: the world chapters' distinct devices are now assigned in the sprint 3 testing table |
| Program Hub §6 (open questions) | Groups B and C for F1 | Hub | Open |

**Orphans pulled in.** Consumption forms as a required row in every unit spec; the world chapters' devices (metallurgy, fibre, the workshop, cotton, the waqf and route, the guild, navigation); the rights-per-record rule; the module descriptor.

**F1 module descriptor** (the format Final Structure §6 requires of every module)

| Element | Content |
|---|---|
| Aim | To give a maker or a briefer a working history of making across the whole world and timeline, read as a web of objects, routes, makers and institutions rather than a line, and to make them able to reference, credit and consult with authority |
| Threshold concept | Design history is a web with obscured strands, not a line |
| Outcomes | 1. Read any object as a document of material, labour, trade and meaning, and write its attribution line · 2. Place an object on the Atlas by world, network, recurrence and date range, and say what else was happening · 3. Distinguish reference, quotation, adaptation, translation and appropriation on a case, including the harm to a source community, and act on the difference in a brief · 4. Trace how the brief has changed hands across commissioning regimes and locate your own work in that chain · 5. Run the attribution and consultation protocol on your own project |
| Evidence | Maker: Object Autopsy on an unseen object with attribution line and material origin. Briefer: sort of eight cases on the plane with reasons and consultation notices. Both: the sources record |
| Hours | 4 / 22 / 20 |
| Prerequisites | None; O1 recommended first |
| Threads served | Attribution and Authority (owner module); Planetary Weight (F1.22); Writing and Argument (one argument card answered) |
| Nine-angle check | Lane: both Apply steps in every unit. Depth: 2 / 24 / 8 units. Artifact: SRC, with GRM.f, GRM.n, CMB, PLW, LCY, RGT touched. Medium: none; every area's lineage unit points back here. Knowledge type: historical and cultural, with two method units. Traditional versus innovative: about 45/55 by time. Geography: global, with a regional slot authored locally. Career stage: student takes O then P in order; mid-career takes P fast and the Mastery research; founder takes O plus F1.17, F1.14, F1.24, F1.26. Time budget: five hours is F1.1, F1.2, F1.17 and F1.26 at Orientation and Practice |

## Stage, next actions, and what this file supersedes

F1 is at structure v3.6 (35 units), with v3.7 proposed (Q6) and two new chapters proposed (Q1, Q13, Q14), which would make 37 units at about 4 / 24 / 22 hours. All nine world chapters and the networks unit have deep dives: [F1 Deep Dives 1](https://claude.ai/code/artifact/fb8b1156-e84f-49b2-a97b-ff5fdadba58d) and [F1 D](https://claude.ai/code/artifact/ea3719e4-78b1-4ba2-bd3d-3c7bff9388ce)[eep ](https://claude.ai/code/artifact/ea3719e4-78b1-4ba2-bd3d-3c7bff9388ce)[D](https://claude.ai/code/artifact/ea3719e4-78b1-4ba2-bd3d-3c7bff9388ce)[ive](https://claude.ai/code/artifact/ea3719e4-78b1-4ba2-bd3d-3c7bff9388ce)[s ](https://claude.ai/code/artifact/ea3719e4-78b1-4ba2-bd3d-3c7bff9388ce)[2](https://claude.ai/code/artifact/ea3719e4-78b1-4ba2-bd3d-3c7bff9388ce). The Atlas's logic is in [F1 Atlas Logic](https://claude.ai/code/artifact/d60856d8-7c8e-4a13-b844-36c328f13067). The groundwork round (provenance, registers v0, pre-read, grouping pages) is in F1 Groundwork. Decisions Q1–Q26 are open in the Program Hub.

**Supersessions.** This file's §4 replaces the unit list in F1 Pass 2 v1 §5. This file's §2 continues the research log from F1 Pass 2 v1 §3, which remains sprint 1's record. The Program Hub's F1 module section now points here.

**Next actions, in order**

1. Your answers to Q1–Q6 (F1 Deep Dives 1) and P1–P11 (Phase 4 Foundations).
2. The Atlas views pass: nodes and views, merged views, a grouping view for movements and other groupings.
3. Provenance checks on the five flagged records, including F1.1's anchor tablet (Met 1988.433.1).
4. Deep dives F1.13, F1.12, F1.10, F1.7, F1.8, F1.9 and F1.11 on template v2, each with a Historian pre-read and a reciprocal reviewer; the two new chapters if Q1 is agreed.
5. About 16 standard and 10 light specs in batches; research inside them at 85/15; then G3.

**What proceeds without you.** Shortlisting objects and drafting claims for F1.5 and F1.6; everything else waits on P1–P11.

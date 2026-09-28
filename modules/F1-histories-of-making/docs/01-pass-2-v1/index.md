# F1 Histories of making — Pass 2, v1

2026-09-27 · @Mohammad AlFalasi

## The workflow as run, and the verdict

Your sequence is better at the front (benchmark and critique before redesign) and the Module Factory is better at the back (specs, engines, copy, prototypes, checks in a fixed order), so the merged workflow v2 below is what this document follows and what every later module will run.

| Step | Your sequence | Module Factory (v3.0) | Verdict |
|---|---|---|---|
| Study and benchmark comparable treatments of the subject | First | Absent | Adopt; the benchmark changes the design (see §2) |
| Research, uncapped and logged | Second | First | Same step; keep the log format |
| Evaluate the existing structure | Third | Absent as a step | Adopt; the factory assumed the structure was right |
| Expert round critique | After improvement | Absent | Adopt, but before redesign, not after: critique of the old version is what the redesign answers |
| Improve and redesign, versioned | Fourth | Second (structure update) | Same step |
| Unit specs with opening moves, forms, lanes, partner | — | Third | Keep |
| World set and engine layers | — | Fourth | Keep |
| Copy, prototypes, partner prompts, checks, review, test | — | Fifth to ninth | Keep, unchanged |

**Workflow v2** (full mode, run on the first module of each level; light mode, steps 1 and 4 shortened, for the rest)

1. Study and benchmark
2. Research sprint, uncapped, logged
3. Evaluate the structure as written
4. Expert round critique
5. Redesign, versioned
6. Unit specs
7. World set and engine layers
8. Copy in the program voice
9. Prototypes
10. Partner prompts
11. Checks: accessibility, claims, licences
12. Your review
13. Test with people

This document covers steps 1–7 for F1 and specifies one unit fully as the exemplar for step 6; steps 8–13 follow once you have reviewed it.

## Benchmarks

The strongest models for a global, object-based history module already exist in open form; F1 should borrow Smarthistory's object-first conversational essay, Margolin's chronology-with-geography-and-themes, the Design History Reader's section logic, and the 100-objects format's discipline of one object per idea, and add what none of them has: the maker's and briefer's Apply step and the Atlas.

| Benchmark | What it does | What F1 takes | What F1 must do differently |
|---|---|---|---|
| Smarthistory | <cite index="21-1">A leading open educational resource with thousands of free videos and essays by experts, designed for schools, museums and home use, under a CC BY-NC-SA 4.0 licence</cite>; <cite index="26-1">launched Reframing Art History in 2022, a free online art history textbook by leading scholars</cite> | Object-first, conversational essays; two voices in dialogue in front of the object; a global reframed textbook as a model for our own reader | The NC licence means we link to it and learn from its form but cannot reuse its text or video inside a program that sells anything; and Smarthistory is art-first, ours is making-first (tools, textiles, vessels, buildings, dress, interfaces) |
| Margolin, World History of Design | <cite index="32-1">Progresses chronologically but is divided into chapters by geography, covering all parts of the globe, with special chapters on phenomena such as the age of exhibitions and colonialism</cite>; <cite index="34-1">begins with pre-human toolmaking and rock art so that design is seen as part of an evolutionary process with deep roots</cite> | The three-way structure: time, place, and cross-cutting themes (exhibitions, colonialism, war); the deep start | Not free; we cannot summarise it in a way that replaces it; our own reader must be written from open sources with Margolin as grounding only |
| The Design History Reader, 2nd edition | <cite index="37-1">Covers the international history of design from the 17th century, with primary texts by theorists, designers and reformers and secondary texts, addressing decolonisation, sustainability, historiography, gender and globalisation</cite>, with sections on modes of production and on local, regional, national and global decolonising | Section logic: modes of production, gender, historiography, decolonising as named strands, not footnotes | Ours must start before the 17th century and outside Europe |
| The decolonial critique itself | Ansari's keynote <cite index="30-1">holds the decolonial turn up to critical appraisal, pointing to co-optation and a lack of nuance, and to the failure to distinguish liberal pluralism and cosmopolitanism from decolonisation and pluriversality</cite>; he warns of <cite index="30-1">foreign practices displacing local ones and the unquestioned adoption of American and European readings in places like Pakistan and India</cite> | A warning built into F1: adding regions to a Western timeline is pluralism, not decolonisation; the module must let other frames set the timeline | This is the hardest design problem in F1 and the reason the pivots are rebuilt as recurrences (§4, §5) |
| Glocal graphic design history in Arab institutions | A study found <cite index="31-1">most graphic design history courses in Arab institutions predominantly focus on Eurocentric content and methodologies</cite> and recommends <cite index="31-1">linking local histories with global narratives</cite> | Evidence that the regional slot is needed and that the regional vertical has a market | The slot must be authored by local voices when it is built |
| A History of the World in 100 Objects (BBC and British Museum) | One object, one idea, fifteen minutes; the object is the argument | The discipline of one object per unit idea; audio-first narration as a consumption form | British Museum images are not open; our objects come from CC0 collections |
| Open textbooks in African and world art (for example The Bright Continent) and Open Arts Objects films | Regional open textbooks and short object films exist under CC licences | Models for the regional readers; a check that open regional scholarship exists to cite | Licences are mostly NC; cite and link, do not reuse |

**What no benchmark does.** None teaches a reader to use history in a brief, an attribution line or a consultation; none has a stranger test; none puts the learner's own lineage on the same map as the canon. Those are F1's additions.

## Research log v1

Research is open; this first sprint found the frames, the open sources and the licence problems, and produced six findings that change the module's structure.

**Open questions** (carried into sprint 2)

1. Which independent inventions of writing, urbanism, metallurgy, weaving and the wheel are securely dated enough to show as recurrences on the Atlas, and from which open sources?
2. Which CC0 collections hold objects for each unit at item level, and which units have no CC0 coverage (early Africa and Oceania are the likely gaps)?
3. What do Indigenous data and cultural protocols (the CARE principles, Traditional Knowledge labels, the 2003 UNESCO convention on intangible heritage) require of a consultation protocol, and which of them can be adopted verbatim? To verify.
4. Which public-domain primary texts exist per pivot, beyond the European canon (translations of Ibn Khaldun, the Yingzao Fashi, the Vastu texts, Arabic craft treatises)? To verify translation copyright.
5. Whether Smarthistory's NC licence blocks any use, or only reuse inside paid slices.
6. Which public-domain audio exists for the sound and performance strand of F1.3a.

**Sources found in sprint 1**

| Source | Type | Licence | Grade | Use |
|---|---|---|---|---|
| Smarthistory, including Reframing Art History | Essays, videos, open textbook | CC BY-NC-SA 4.0 | A for form and scholarship | Model; link; do not reuse in paid slices |
| Margolin, World History of Design (2015) | Two-volume survey | Copyright | A | Grounding for structure; never summarised for learners |
| The Design History Reader, 2nd ed. (2025) | Primary and secondary texts | Copyright | A | Grounding; its primary texts checked one by one for public-domain status |
| Ansari, Decolonisation, the History of Design, and the Designs of History | Keynote, open on ResearchGate | Author-shared | A | The warning built into F1.3 and the pivots redesign |
| Towards a Glocal Teaching of the History of Graphic Design | Article | Author-shared | B | Evidence for the regional slot |
| Metropolitan Museum, Smithsonian, Cleveland, Art Institute of Chicago, Rijksmuseum, National Gallery of Art open access | Collections with APIs | CC0 | A | The world set; item-level licence still checked |
| Archnet | Islamic architecture archive | Varies by item | A | F1.8 and the Islamic-world network chapter |
| Owen Jones, The Grammar of Ornament (1856) | Plates | Public domain | A | F1.12 and the world's-fair case; also the case for taxonomy as appropriation |
| Project Gutenberg, Internet Archive, Wikisource | Primary texts | Public domain | A for the texts, B for the translations | Primary-source units; translation dates checked |
| Our World in Data, UN and World Bank data | Datasets | Open | A | F1.15 and the planetary present |
| Wikimedia Commons | Images | Item by item | B | Fills gaps; licence per file |

**Findings that change the structure** (applied in §5)

1. A single sequence of pivots is itself a dominant narrative. The pivots become recurrences: things that happened many times in many places (writing, cities, metallurgy, weaving, printing), shown on parallel regional rows with a simultaneity view.
2. Continent chapters reproduce colonial cartography. Regional chapters are kept as worlds of making and joined by network chapters (Indian Ocean, Silk Roads, trans-Saharan, Mediterranean, Atlantic, Pacific), because the exchange of forms lives on the networks.
3. The briefer lane has nothing in F1 about commissioning. A unit on who commissions (patrons, guilds, merchants, industry, agencies, platforms) is the briefer's own history.
4. World's fairs and museums are history-making machines and the source of our own world set. Two units: exhibitions as taxonomy, and the museum as author (collecting, provenance, restitution).
5. Gender, religion and copying are absent as named strands. Three units: textiles and the making that was called women's work; ritual and belief as drivers of making; copying, transfer and counterfeit as the engine of exchange.
6. The Orientation layer cannot be nine pivots in five minutes. Orientation becomes one object read three ways.

**Research status.** F1: Sprinted (1 of at least 3). Sprint 2 targets questions 1–3; sprint 3 targets item-level world-set verification.

## Evaluation and expert round

F1 as written in the register has a good spine (object reading, attribution, obscured labour, the Atlas) and three structural faults: it reproduces the linear timeline it claims to critique, it organises the world by continents, and it gives the briefer nothing to do; the eleven-voice round below finds twenty-six further flaws and gaps.

**Evaluation of F1 as written** (Master Structure v2.1, 23 units)

| Aspect | Judgement |
|---|---|
| Coverage | Strong on ethics, labour and method; weak on commissioning, institutions, gender, religion, copying; the digital and platform eras compressed into one unit |
| Structure | Pivots are linear; centres are continental; no network chapters; the Orientation layer is impossible as written |
| Depth | 23 units in 14 Practice hours is 35 minutes a unit including seven case units; Practice should be 20 hours or the unit count should fall |
| Lanes | Maker Apply implied; briefer Apply absent from every unit |
| Making | Almost no K; a module about making with nothing made |
| Forms | Only the Atlas and three labs; no scrollytelling, object stories or audio assigned |
| Rights | Assumes open access equals usable; ignores culturally restricted material and NC licences |
| Test | Object Autopsy on an unseen object is right; it lacks the attribution line and the briefer's sort |

**Expert round** (eleven voices; each names what would go wrong and what is missing)

| Voice | Flaws found | Gaps and additions |
|---|---|---|
| The historian | Anachronism risk in "pivots"; periodisation borrowed from Europe; dates presented as points when they are ranges | Show dates as ranges with uncertainty; show independent origins as recurrences; add a unit on how periods get named |
| The decolonial scholar | Adding regions to the Western line is pluralism, not decolonisation; the module could be co-opted as a diversity tour | Let other frames set the timeline (lunar, dynastic, seasonal, genealogical calendars in the Atlas); name who authored each unit; keep the regional slot for local authorship; add a unit on the museum as author |
| The museum educator | Reading before looking; too many objects per unit; no slow looking | Object-first openings; three objects per unit maximum at Practice; a slow-looking protocol in F1.17 |
| The learning designer | Cognitive overload at 23 units; no retrieval practice; the Orientation layer overloaded | Fewer, longer units; a spaced recall deck of objects; Orientation as one object read three ways |
| The briefer | Nothing to take into a meeting | The commissioning history unit; a reference note and an attribution line as the briefer's Apply; the sort as the closing test |
| The maker | History with no hands | Making-first openings in three units: a paper loom or strip weave, a stamp or seal, a paper-fold module; the Object Autopsy on the learner's own possession |
| The rights lawyer | CC0 is not the same as culturally usable; Smarthistory and most open textbooks are NC; translations of public-domain texts may be in copyright | A sensitivity flag in the world set; exclusion of ancestral, sacred and funerary material unless the source community has published it for use; NC content linked, never reused; translation dates checked |
| The engineer | The Atlas is specified as an engine before there is content; 1,200 records is a data-entry project; museum APIs have rate limits and changing terms | Atlas v1 as static JSON and SVG with 60 objects; a record schema now; API terms recorded per collection |
| The regional scholar | The Gulf slot is one unit at the end; the Islamic world is treated as a region, not a network | The Islamic world as the model network chapter; the regional slot built with local authors; pearling, dhow building, sadu and gypsum carving as future cases |
| The planet | Materials history is extraction history and the module does not say so | A thread checkpoint: every object story names where the material came from and what it cost the place |
| The accessibility reviewer | An image-heavy module with no alt text policy; timelines that depend on colour | Alt text and audio description for every object; colour-independent Atlas layers; audio companions for the narrative units |

**Flaws that would only appear later.** The world set's regional balance will skew to what CC0 collections hold (Europe, East Asia, the Islamic world, the Americas well; Africa and Oceania poorly), which would quietly reproduce the bias the module critiques; the mitigation is to track coverage per region and to fill gaps with Wikimedia and community-published material, with the gap itself taught in F1.3.

## F1 v3.3 redesign

Thirty-one units: two at Orientation, twenty-four at Practice, five at Mastery; about 4 / 20 / 18 hours; the pivots become recurrences, the continents become worlds joined by networks, and every unit now has an opening move, assigned forms, an Apply for each lane and a partner voice. F1 is renumbered because it is the first module through the factory; the Was column maps every old number.

Forms are numbered as in Final Structure §Presentation forms (1 scrollytelling, 2 step-through, 3 object story, 4 explorable, 5 before/after, 7 video, 8 audio, 10 comparison wall, 11 timeline scrub, 12 map, 13 argument card, 14 sequential illustration, 15 prediction prompt). Apply: M = maker, B = briefer.

| Unit | Concept | Depth | Field | Opening · forms | Apply (M / B) | Voice · media | Was |
|---|---|---|---|---|---|---|---|
| F1.1 | One object, three readings: material, labour, meaning | O | SRC | Object first · 3 | M: read an object you own / B: write its attribution line | Historian · img | new |
| F1.2 | The reference-to-appropriation spectrum | O | SRC | Prediction first · 15, 3 | Both: sort six cases; B: flag the one you would stop in a brief | Historian · img | F1.2 |
| F1.3 | How histories get written: canons, periods, the timeline as an argument | P | SRC | Argument first · 13, 11 | Both: annotate one canonical timeline for what it excludes | Mirror · ani | F1.3 |
| F1.4 | Interdisciplinary discourse: what film, performance, sound, gaming and digital culture teach making | P | SRC, GRM.n | Story first · 10, 7 | Both: extract one method from a non-design discipline for your world | Mirror · vid, aud | F1.3a |
| F1.5 | Recurrences: writing, cities, metallurgy, weaving and printing happened many times in many places | P | SRC | Data first · 1, 11 (Atlas simultaneity view) | Both: place three objects on parallel regional rows and date them as ranges | Historian · img, dat | F1.1 |
| F1.6 | Worlds of making: Africa | P | SRC | Object first · 3, 10 | M: a reference note / B: a reference note with a consultation flag | Historian · img | F1.4 |
| F1.7 | Worlds of making: the Americas | P | SRC | Object first · 3, 10 | same | Historian · img | F1.5 |
| F1.8 | Worlds of making: East Asia | P | SRC | Object first · 3, 10 | same | Historian · img | F1.6 |
| F1.9 | Worlds of making: South and Southeast Asia | P | SRC | Object first · 3, 10 | same | Historian · img | F1.7 |
| F1.10 | The Islamic world as a network: a world made of routes | P | SRC | Data first · 12, 3 | same, plus: name a route your world could use | Historian · img, drw (Archnet) | F1.8 |
| F1.11 | Europe as one world among several | P | SRC | Object first · 3, 10 | same | Historian · img | F1.9 |
| F1.12 | Worlds of making: Oceania and the Pacific | P | SRC | Object first · 3, 10 | same, with the sensitivity flag explained | Historian · img | F1.10 |
| F1.13 | Networks: Silk Roads, Indian Ocean, trans-Saharan, Mediterranean, Atlantic, Pacific | P | SRC | Data first · 12, 1 | Both: trace one object's route end to end | Historian · dat, img | F1.11 |
| F1.14 | Copying, transfer and counterfeit: porcelain, chintz, lacquer, print | P | SRC, RGT | Object first · 5, 3 | M: find the copy in your own references / B: what a licensing clause would have said (to R2) | Historian · img | new |
| F1.15 | Ornament as a global language; the exhibition as taxonomy (1851 and the Grammar of Ornament) | P | GRM.f, SRC | Prediction first (guess the region of a pattern) · 3, 10 | Both: run the Pattern Comparer; B: name what was extracted and from whom | Historian · public-domain plates | F1.12 |
| F1.16 | Ritual and belief as drivers of making | P | GRM.n, SRC | Object first · 3, 8 | Both: name the ritual your world serves | Historian · img, aud | new |
| F1.17 | Who commissions: patrons, guilds, merchants, industry, agencies, platforms | P | SRC, CMB | Argument first · 2, 13 | M: place your work in the commissioning chain / B: write the brief a patron would have given | Client · ani | new |
| F1.18 | Textiles and the making that was called women's work | P | SRC, GRM.m | Making first (a paper strip weave) · 3, 7 | Both: write a credit line for a textile | Historian · img | new |
| F1.19 | Industry, the machine and the exhibition | P | SRC | Story first · 1, 3 | Both: what the machine changed in your medium | Fabricator · img | F1.13 |
| F1.20 | Modernisms, plural | P | SRC | Object first (three modernisms side by side) · 10, 13 | Both: which modernism your world descends from, and which it refuses | Historian · img | F1.14 |
| F1.21 | Consumer society, the digital and the platform | P | SRC | Story first · 1, 7 | Both: the platform your world lives on | Client · img, vid | F1.15 |
| F1.22 | The planetary present: making as extraction | P | SRC, PLW | Data first · 12, 4 | Both: the material chain of one object you own | Planet · dat | F1.15 |
| F1.23 | Obscured labour: the credit map | P | SRC | Object first · 3 | Both: credit map of your own project | Historian · img | F1.16 |
| F1.24 | The museum as author: collecting, provenance, restitution | P | SRC | Argument first · 13, 3 | M: provenance chain of one world-set object / B: what to ask a museum partner | Historian · img | new |
| F1.25 | Reading an object as history: slow looking and the autopsy | P | SRC | Lab first · Object Autopsy, full | Both: a full autopsy | Mirror · img | F1.17 |
| F1.26 | Attribution and consultation as protocol | P | SRC | Problem first (a brief that references a tradition) · 2, 15 | Both: draft the protocol; B: apply it to a real brief | Historian · template | F1.18 |
| F1.27 | Counter-history research piece on one lineage | M | SRC, DOS | Artifact first · Atlas authoring | Both: the piece, with an attribution record | Historian · learner's material | F1.19 |
| F1.28 | Primary sources and archives: how to read them | M | SRC | Problem first · Source Grader, archive walkthroughs | Both: five sources graded, one translated text dated | Historian · img | F1.20 |
| F1.29 | Vernacular intelligence: oral history, folktale and local taxonomy, with consent | M | SRC | Making first (record a maker or elder) · Oral History Kit | Both: one recorded, transcribed, consented account | Historian · aud | F1.20a |
| F1.30 | Re-timing the Atlas: other calendars and periodisations | M | SRC | Data first · Atlas calendar layer | Both: your lineage on a non-Gregorian timeline | Historian · dat | new |
| F1.31 | Regional slot: the learner's own place on the map | M | SRC | Artifact first · Atlas regional layer | Both: the slot filled | Historian · learner's material | F1.21 |

**Closing test.** Maker: an Object Autopsy on an unseen object, with an attribution line and the material's origin named. Briefer: a sort of eight cases on the spectrum with reasons, plus the consultation flag on the ones that need it. Both: one line added to the artifact's sources record.

**What changed and why** (versioned as structure v3.3 in the Master Structure): pivots to recurrences (finding 1); worlds and networks (finding 2); commissioning unit (finding 3); exhibitions and the museum as author (finding 4); textiles, ritual and copying (finding 5); Orientation as one object (finding 6); making-first openings in F1.18 and F1.29 (the maker's critique); the calendar unit (the decolonial critique); Practice hours from 14 to 20 (the learning designer's critique).

## World set v1 and the Timeline Atlas

The world set for F1 targets 60 verified objects for the Atlas v1 and about 90 for the unit cases, all from CC0 collections at item level; the candidates below are object types with target collections, to be verified item by item in sprint 3, and the Atlas starts as a static layered timeline of those 60, not as an engine.

**World set candidates by unit** (type · target collection · caution)

| Unit | Candidates |
|---|---|
| F1.1, F1.25 | The learner's own object; a spare set of five everyday objects from Cooper Hewitt or Smithsonian NMAH (CC0) |
| F1.5 Recurrences | Cuneiform tablets (Met) · oracle bone or early bronze inscription (Met, Cleveland) · Maya glyph object (Cleveland, AIC; codices are facsimiles) · Indus seal (Met, to verify) · Egyptian papyrus (Met) · early metallurgy: Anatolian, Andean, West African bronze (Met, Cleveland, Smithsonian NMAfA) · loom weights and early textiles (Met) · movable type and block prints: Chinese, Korean, European (Met, Rijksmuseum) |
| F1.6 Africa | Benin plaques and heads (Met, Cleveland; provenance taught in F1.24) · Kente and Ewe strip cloth (Smithsonian NMAfA) · Nok terracotta (Met, to verify) · Ethiopian manuscripts (Met) · Kuba textiles (Cleveland) · Yoruba beadwork (Met) · Great Zimbabwe photographs (Wikimedia) |
| F1.7 The Americas | Paracas and Nasca textiles (Met, Cleveland) · khipu (Met; AMNH is not CC0) · Moche vessels (Met) · Olmec, Maya, Aztec stone and ceramics (Met, Cleveland, AIC) · Pueblo and Plains material (Smithsonian NMAI, with sensitivity checks) · Inuit tools (Smithsonian) |
| F1.8 East Asia | Shang bronzes (Met, Cleveland) · Song ceramics (Met) · Japanese lacquer and prints (Met, AIC) · Korean celadon (Met) · Yingzao Fashi plates (public domain, Wikisource) · mingei objects (Met) |
| F1.9 South and Southeast Asia | Indus material (Met) · Chola bronzes (Met, Cleveland) · Mughal textiles and manuscripts (Met) · Kashmir shawls (Met) · Indonesian batik and ikat (Met, Cleveland) · Khmer sculpture (Met) |
| F1.10 The Islamic world | Astrolabes (Met) · Iznik ceramics (Met) · Mamluk metalwork and glass (Met) · Qur'an folios (Met) · Nasrid and Mughal architecture (Archnet, Wikimedia) · Andalusian textiles (Cleveland) |
| F1.11 Europe | Medieval tools and manuscripts (Met) · Renaissance workshop objects (Met, NGA) · Delftware (Rijksmuseum) · Wedgwood (Met) · Thonet chair (Met, Cooper Hewitt) · Bauhaus objects (Cooper Hewitt; check rights on 20th-century works) |
| F1.12 Oceania and the Pacific | Tapa cloth (Met, Smithsonian) · navigation charts (Smithsonian) · Māori and Hawaiian objects (Met, with sensitivity checks and community-published sources preferred) · Papua New Guinea shields (Met) |
| F1.13 Networks | Sogdian and Silk Road textiles (Cleveland) · Swahili coast objects (Smithsonian NMAfA) · Roman-Indian trade material (Met) · Atlantic trade objects (Smithsonian NMAAHC, with care) · Manila galleon goods (AIC) |
| F1.14 Copying | Chinese blue-and-white, Iznik, Delft and Meissen side by side (Met, Rijksmuseum) · Indian chintz and European copies (Met) · Japanese export lacquer (Rijksmuseum) · chinoiserie and japonisme (Met, AIC) |
| F1.15 Ornament and exhibitions | Owen Jones plates (public domain) · Great Exhibition prints and the Crystal Palace (public domain) · colonial exposition posters (public domain by date, check) |
| F1.16 Ritual | Temple, mosque, church and shrine objects across worlds (Met, Cleveland, Archnet) · calligraphy (Met) · ritual vessels (Met) |
| F1.17 Commissioning | Guild records and pattern books (public domain) · merchant ledgers (Internet Archive) · early advertising (Smithsonian NMAH, Library of Congress) · a platform interface screenshot (own capture) |
| F1.18 Textiles | Andean, West African, Coptic, Indian, Central Asian textiles (Met, Cleveland) · Bauhaus weaving (Cooper Hewitt; rights check) · sadu weaving (regional slot, later) |
| F1.19 Industry | Singer machine (Smithsonian NMAH) · Wedgwood (Met) · Thonet (Met) · Great Exhibition material (public domain) |
| F1.20 Modernisms | Bauhaus, Constructivist, mingei, Fathy, Mexican and Indian modernisms (Cooper Hewitt, Met, Archnet; posters by date; 20th-century rights checked) |
| F1.21 Consumer, digital, platform | Post-war appliances and early computers (Smithsonian NMAH, CC0 where marked) · own captures of interfaces |
| F1.22 Planetary | Material-chain data (Our World in Data) · e-waste and extraction photographs (Wikimedia, CC) |
| F1.23, F1.24 | Objects with documented workshops and provenance chains (Met and Cleveland records carry both) |

**Coverage tracking.** A count per world and per unit, updated every sprint; a unit below three verified objects is flagged; gaps taught in F1.3 as evidence.

**Timeline Atlas v1 spec** (the engine, built in the order the units need it)

| Layer | What it shows | Data needed | Built for | Version |
|---|---|---|---|---|
| Base | Parallel regional rows on one time axis; objects as points with date ranges and uncertainty | 60 records | F1.5 | v1, static SVG |
| Strands | Dominant and obscured strands toggled per object | strand tag per record | F1.3 | v1 |
| Routes | Flows between places with dates; an object's route traced | route records (from, to, date range, goods) | F1.10, F1.13, F1.14 | v2 |
| Simultaneity | Align a recurrence across rows (all first writing, all first cities) | recurrence tag per record | F1.5 | v2 |
| Calendars | Re-time the axis by lunar, dynastic, genealogical or seasonal calendars | calendar mappings | F1.30 | v3 |
| Authoring | The learner adds objects and a lineage; export to the artifact | learner records | F1.27, F1.31 | v3 |
| Reading mode | Scrub, object story on click, audio | forms 3, 8, 11 | every narrative unit | v1 |

**Record schema** (one per object): id · title · date range and uncertainty · place (coordinates, modern and historical names) · world · network tags · recurrence tags · materials and their origins · makers and labour (named, unnamed, community) · provenance chain · collection and accession · image URL and licence · sensitivity flag and source-community note · story (150–300 words) · units that use it · alt text and audio description.

## Rights, ethics and media plan

F1 is the module most exposed to rights and cultural-sensitivity mistakes, because its material is other people's heritage; five rules govern it and are checked before any unit is Drafted.

**Rules**

1. Open is not the same as usable. A CC0 image of an ancestral, sacred or funerary object is not used unless the source community has published it for use or the object is widely exhibited by its own institutions; the record carries a sensitivity flag and a note of the source. The CARE principles and Traditional Knowledge labels are adopted as reference frameworks once verified (research question 3).
2. NC content is linked, never reused. Smarthistory, most open textbooks and many regional films are CC BY-NC; because the Practitioner and Comprehensive slices may be sold, none of their text or video is copied into units. Their form is a model; their pages are links.
3. Public domain applies to the work, not the translation. Translations of primary texts are dated and checked; where no public-domain translation exists, the unit paraphrases and cites.
4. Every object carries a story we wrote. No museum label text is reused beyond the facts; stories are written in the program voice from the record, cited to the collection.
5. Provenance is content. Every world-set record has a provenance chain, and objects with contested provenance (Benin, Maqdala, Pacific material) are taught as such in F1.24 rather than shown without comment.

**Media plan for F1**

| Asset | Count | Source | Notes |
|---|---|---|---|
| Object images | about 150 | CC0 collections; Wikimedia for gaps | licence, alt text and audio description per image |
| Public-domain plates and prints | about 30 | Owen Jones, exhibition prints, pattern books | high-resolution scans from Internet Archive or the collections |
| Scrollytelling pages | 5 | built: F1.5, F1.13, F1.19, F1.21 and one for F1.15 | layers carry time, route and strata |
| Object stories (deep zoom) | about 90 | IIIF where the collection serves it, else static | one story each |
| Route and map data | 6 networks | assembled from open sources, dates as ranges | F1.10, F1.13 |
| Audio | about 25 | synthesised narration of argument cards and object stories; public-domain recordings for F1.4 to verify | audio companion for every narrative unit |
| Argument cards | 8 | F1.3, F1.17, F1.20, F1.24, F1.26 and three more | claim, counter-claim, case |
| Step-through explainers | 3 | F1.17 commissioning chain; F1.26 protocol; F1.3 how a canon forms | SVG |
| Making kits on paper | 2 | F1.18 strip weave; F1.29 recording guide | printable |
| Partner prompts | 6 voices' packs for F1 | Historian leads; Mirror, Client, Fabricator, Planet appear | tested against units before Drafted |

**Accessibility.** Alt text for every image; audio description for the 60 Atlas objects; the Atlas readable without colour (strand by line style, world by row label); every scrollytelling page has a reduced-motion linear version; every unit's Orientation form complete on a phone.

## Exemplar unit spec, open questions, next steps

One unit specified to the standard every unit will meet, so you can judge the standard before I write thirty more; then the questions only you can answer.

**F1.17 Who commissions: patrons, guilds, merchants, industry, agencies, platforms** (Practice, about 60 minutes)

| Element | Content |
|---|---|
| Essential question | Who has told makers what to make, and how did the brief change hands across history? |
| Opening move | Argument first: "The designer is a recent invention; for most of history the person who decided what got made was the one paying for it." Counter-claim: "Makers have always shaped the brief from below; guild rules, workshop conventions and material limits decided more than any patron." One case: a Renaissance commissioning contract specifying pigments, sizes and the master's own hand (public-domain text), set beside a modern platform's design guidelines |
| Lab | Step-through explainer: the commissioning chain across six regimes (patron, guild, merchant, industry, agency, platform); at each step the learner drags who holds the brief, who holds the money, who holds the credit; the explainer shows how the three separate and recombine |
| Concept | 500 words: the brief as a historical object; the rise of the professional designer; what each regime made possible and impossible; the platform as the newest patron |
| Cases | Three, one object story each: a guild-regulated object with its rules; a merchant-commissioned export ware; a platform-native product with its guideline document. Regional slot: a Gulf pearl-trade commission, later |
| Apply — maker | Place your own project on the chain: who briefs you, who pays, who is credited; write two sentences on what the regime lets you do and stops you doing; export to the artifact's SRC and CMB fields |
| Apply — briefer | Write the brief a patron in one of the six regimes would have given for your world's anchor, in that regime's terms (contract, guild rule, purchase order, platform guideline); then rewrite it as your own brief; note what changed |
| Partner | The Client: "Which regime are you actually in, and which one are you pretending to be in?" ends with a test: give the Stranger your regime's brief and see what it builds |
| Forms | 2 step-through; 13 argument card; 3 object stories; 8 audio of the argument card |
| Consumption forms | Five-minute: the argument card and the first two steps of the chain · Session: full unit · Reference: the six-regime glossary entry with "say it to a designer" |
| Media | Three object images (CC0); one public-domain contract text; one platform guideline screenshot (own capture); the explainer's SVG |
| Artifact fields | SRC (the commissioning history of the learner's medium); CMB (the regime brief) |
| Threads | Attribution and Authority (who is credited); Writing and Argument (the two sentences) |
| Closing contribution | One line in the sources record: the regime the learner's world belongs to |
| Claims sheet | Every dated claim in the concept text with its source; the contract text cited to its public-domain edition |

**Open questions for you**

1. Renumbering: accept that F1 is renumbered with a mapping, or keep old numbers and letter the new units?
2. Hours: Practice at 20 hours (about 50 minutes a unit), or cut back to 18 units and 14 hours?
3. The Islamic world as the model network chapter: agree, or treat it as a world like the others?
4. Sensitivity rule: is rule 1 (exclude sacred, ancestral and funerary material unless community-published) the right line for you, or too cautious?
5. The exemplar unit: is F1.17 at the depth and voice you want for every unit?

**Next steps** (workflow v2, steps 8–13, after your review)

- Sprint 2 of research: recurrences data, the protocol frameworks, item-level world-set verification for F1.5 and F1.10 first.
- Unit specs for the remaining thirty units at the F1.17 standard, in three batches (Orientation and F1.3–F1.12; F1.13–F1.26; Mastery).
- Atlas v1 as a working page with 60 records.
- Copy for the first batch in the program voice, once the voice guide exists.
- The Master Structure updated to v3.3 with the renumbered F1 and the six findings.

# Teaching methods for F1: a catalogue mapped to the units and archetypes

Compiled 6 October 2026 for the F1 design lead. Answers the request: "also perhaps adding the different types of learning/educational methods to display the content we've already established for the whole course can be added?"

**What this is.** Thirty learning methods (presentation and pedagogy formats) that could carry F1's existing content, each with what it suits, how strong the evidence is, named exemplars, zero-cost production effort, one concrete rendering of the Edo unit, and fit ratings for the seven page archetypes A–G (Pass 2 v2, "Scenarios: from consumed material to simulation"). A machine-readable twin is `methods.json` in this folder (same 30 records, plus `f1Forms` and `cautions`).

**What it builds on and does not repeat.** Segment length, narration vs text, pretesting placement, scrollytelling layout and MOOC structure are in `research/edo-redesign-2026-10-04/learning_design_evidence.md`. Gamification, overjustification, game meta-analyses, intrinsic integration and painful-history ethics are in `research_notes/Atlas 3D map and game mechanics/learning_games_evidence.md`. Those findings are cited here by name only.

**Method of this pass.** Consensus (peer-reviewed index) for meta-analyses; web search and fetch for exemplars and figures; the F1 specs (all 38 essential questions, labs and forms rows; F1.1, F1.6, F1.13, F1.23, F1.25, F1.28a and F1.30a in detail), Pass 2 v2, the Edo `story.yaml` and `ARCH_V4.md`. Numbers were read in the source or its abstract this session unless marked "recalled" or "uncertain". Consensus quota ran out mid-pass, so some links are Consensus record pages rather than DOIs.

## 1. How to use this

1. **Per unit:** find the unit in section 6. It gives the archetype, the forms the spec already uses, and the two or three methods to add.
2. **Per archetype:** section 5 gives a method mix (core, add, optional, avoid) with a time budget for a 45–60 minute session.
3. **Per content type:** section 7 maps kinds of content (an object, a route, a contested claim, a process, a quantity, coerced labour) to methods.
4. **To compare methods:** the matrix in section 4, or filter `methods.json` by `archetypes.X >= 2`, `evidence.strength`, `cost`.

The programme already names fifteen presentation forms (spec brief: 1 scrollytelling, 2 step-through, 3 object story, 4 explorable, 5 before/after, 7 video, 8 audio, 10 comparison wall, 11 timeline scrub, 12 map, 13 argument card, 14 sequential illustration, 15 prediction prompt). Forms are surfaces; methods are what the learner does on them. Each method below lists the forms it runs on. Three methods have no form of their own: the Socratic partner (it lives in the partner drawer), role-play and peer review. Five more borrow a form but mostly live in the Apply lanes and the Mastery units: oral history, making, field trips, collaborative annotation and project work.

## 2. The frameworks used to classify

| Framework | What it gives this catalogue | Source |
|---|---|---|
| Laurillard's six learning types (ABC Learning Design, UCL): acquisition, inquiry (ABC: "investigation"), discussion, practice, collaboration, production | The `family` field; a balance check per archetype (section 5) | [ABC LD: the 6 learning types](https://abc-ld.org/6-learning-types/); Laurillard 2002, 2012 |
| ICAP (Chi & Wylie 2014): Interactive > Constructive > Active > Passive | The `icapLevel` field; a sequence rule (move each unit at least once from P/A to C) | [Chi & Wylie 2014](https://doi.org/10.1080/00461520.2014.965823). Critique: the order is not universal and overt behaviour is an ambiguous signal ([Thurn et al. 2023](https://consensus.app/papers/details/96f9b7cefee9570a961905b526654cd6/)); constructive beat active in classrooms ([Chi et al. 2018](https://consensus.app/papers/details/937395c3469f5779a09d82646fa194ed/)) |
| Seixas & Morton's Big Six: significance, evidence, continuity and change, cause and consequence, historical perspectives, ethical dimension | The `suits` field: which historical-thinking concept a method exercises | [Big Six summary](https://www.thecanadianencyclopedia.ca/en/article/historical-thinking-concepts) |
| Bloom (revised) | Coarse level in `suits` | — |
| Merrill's First Principles: problem-centred; activation, demonstration, application, integration | The order inside each archetype mix (section 5) | [Merrill 2002](https://doi.org/10.1007/BF02505024) |
| Dunlosky et al. 2013 utility ratings: high = practice testing, distributed practice; moderate = elaborative interrogation, self-explanation, interleaving; low = summarising, highlighting, keyword mnemonic, imagery, rereading | Evidence anchor for practice methods | [Dunlosky et al. 2013](https://doi.org/10.1177/1529100612453266) |
| Fiorella & Mayer's eight generative strategies (summarising, mapping, drawing, imagining, self-testing, self-explaining, teaching, enacting) | Evidence anchor for production methods. Their per-strategy median effect sizes (recalled as about d = 0.4–0.8) were **not verified** this session | [Fiorella & Mayer 2016](https://consensus.app/papers/details/00814a2a523555679bdeb93403953693/) |

**Evidence strength, as used here.** *Strong:* at least one large meta-analysis with a moderate effect that holds in rigorous subsets, plus no major contrary finding. *Moderate:* meta-analytic or multiple controlled support with caveats (age, domain, small n, author-run). *Mixed:* controlled studies point both ways, or the benefit is engagement rather than learning. *Weak:* practice wisdom, design precedent or qualitative work only. Nearly all evidence is from school or university students in formal courses, mostly STEM or health; almost none is from adult, self-paced design-history learners. Treat every rating as a prior to test, not a verdict.

## 3. The catalogue (30 methods)

Fit ratings: 3 = a natural core method for that archetype; 2 = a good addition; 1 = possible in one station; 0 = poor fit or ruled out by the sensitivity rules. Archetypes: **A** one-object (F1.1, F1.25) · **B** world chapter (F1.6–F1.12, F1.9a, F1.12a) · **C** network (F1.10, F1.13, F1.14) · **D** recurrence (F1.5, F1.30) · **E** thematic argument (F1.3, F1.4, F1.15–F1.24 incl. F1.19a, F1.19b, F1.22a) · **F** method (F1.2, F1.26, F1.28, F1.28a, F1.30a) · **G** Mastery research (F1.27, F1.29, F1.31). F1.4, F1.28a and F1.30a postdate the archetype table; the assignments above are this note's proposal. The Edo build is a B/E hybrid (a world-chapter walk carrying a credit argument).

### 1. Scrollytelling narrative walk `scrolly`

- **What:** A learner-paced story in short text steps that drives a pinned map, timeline or object beside it.
- **Laurillard type:** acquisition · **ICAP:** passive · **F1 forms:** 1 · **Cost:** M
- **Suits:** acquisition of a narrative with a time or route spine; Bloom: remember, understand; Seixas: continuity and change; cause and consequence (as told); content whose argument is spatial or chronological
- **Evidence (mixed):** Raises engagement and perceived understanding reliably; measured recall is neutral to slightly positive. Stepped layouts with explicit text-to-visual linking beat continuous vertical scroll on comprehension. Its strongest backing is indirect: spatial and temporal contiguity are among the largest multimedia effects. Pair with retrieval to convert engagement into memory. Sources: [Zhi, Ottley & Metoyer 2019, linking and layout in narrative visualization (CGF), N=180](https://onlinelibrary.wiley.com/doi/10.1111/cgf.13719); [Schneiders 2020, scrollytelling vs video vs audio vs text explainers (Media and Communication), N=381](https://consensus.app/papers/details/cd639afb2ae5543cb568ef6eeb00d7d9/); [Mayer 2017, Using multimedia for e-learning (J. Comput. Assist. Learn.): segmenting d=0.70, contiguity d=0.79/1.30](https://consensus.app/papers/details/5ca62b3d23f75783a489de775688f399/); [Zdanovic et al. 2022, data storytelling vs traditional visualization: no recall difference (CHIIR)](https://consensus.app/papers/details/3e679fb9cb1c5fe390689f259171e502/)
- **Exemplars:** [NYT, Snow Fall (2012), the reference scrollytelling piece](https://www.nytimes.com/projects/2012/snow-fall/); [Google Arts & Culture story: Emakimono, Tokugawa Art Museum](https://artsandculture.google.com/story/emakimono-illustrated-handscrolls-the-tokugawa-art-museum/QQVRePrklPIhJg?hl=en)
- **Edo, rendered this way:** Already the Edo spine: e.g. Act I beat b1-2, the three Meireki fires drawn in sequence on the 1859 map as the text names Hongo, Koishikawa and Kojimachi; one instrument state per beat.
- **Fit (0-3):** A1 B3 C3 D2 E2 F1 G0 · **Units:** F1.5, F1.6, F1.7, F1.8, F1.9, F1.9a, F1.10, F1.11, F1.12, F1.12a, F1.13, F1.19, F1.19a, F1.21, F1.30a
- **Cautions:** Never let essential content live only behind an optional interaction; a text-list fallback for every instrument state.

### 2. Lecture or video explainer `video`

- **What:** A short, segmented, narrated video (talking head, object close-up, or animated process) of 2-8 minutes.
- **Laurillard type:** acquisition · **ICAP:** passive · **F1 forms:** 7 · **Cost:** L
- **Suits:** acquisition of processes that unfold in time (casting, carving, weaving); Bloom: understand; Seixas: evidence (when it shows the maker's hands); phone five-minute form
- **Evidence (moderate):** Adding video to existing teaching g=0.80; replacing other teaching with video g=0.28. Segmenting and coherence matter more than length; benefits concentrate in lower-level processing. Expensive to make at zero cost, so link to open or holder-made films where licences allow and make our own only for silent animated processes. Sources: [Noetel et al. 2020, Video improves learning in higher education (Rev. Educ. Res.): g=0.80 added, g=0.28 swapped](https://consensus.app/papers/details/668daad647b05fbda55adfc0c0b62cef/); [Mayer 2017, Using multimedia for e-learning (J. Comput. Assist. Learn.): segmenting d=0.70, contiguity d=0.79/1.30](https://consensus.app/papers/details/5ca62b3d23f75783a489de775688f399/); [Rey et al. 2019, segmenting meta-analysis (Educ. Psychol. Rev.)](https://consensus.app/papers/details/af8dc817f0875ce4b8d2d9da27b24741/)
- **Exemplars:** [Smarthistory: unscripted expert conversations in front of the object](https://smarthistory.org/); [Crash Course World History (10-12 min episodes)](https://en.wikipedia.org/wiki/Crash_Course_(web_series))
- **Edo, rendered this way:** A 60-90 s captioned animation of the Wave's colour blocks dropping onto the kento marks (the peel layers already in the build), reused as the phone five-minute form; no narration needed.
- **Fit (0-3):** A1 B2 C1 D1 E2 F1 G1 · **Units:** F1.4, F1.18, F1.21, F1.28a, F1.19
- **Cautions:** Smarthistory is CC BY-NC-SA: linkable, not embeddable into a remixed artifact without checking terms. No generated images of historical objects (Scope v2 Q32).

### 3. Step-through explainer or narrated slideshow `stepthrough`

- **What:** A fixed sequence of 4-9 frames the learner advances, each with one idea and one manipulation (drag a token, reveal a layer).
- **Laurillard type:** acquisition · **ICAP:** active · **F1 forms:** 2, 8 · **Cost:** S
- **Suits:** a chain or procedure (commissioning chain, protocol steps, operational sequence); Bloom: understand, apply; Seixas: cause and consequence (as a chain)
- **Evidence (moderate):** Learner-paced segmenting is one of the better-supported multimedia principles (segmenting d=0.70); slideshow layouts beat vertical scroll on comprehension in one controlled study. Narration helps mainly when material is system-paced, so keep text primary and narration optional. Sources: [Mayer 2017, Using multimedia for e-learning (J. Comput. Assist. Learn.): segmenting d=0.70, contiguity d=0.79/1.30](https://consensus.app/papers/details/5ca62b3d23f75783a489de775688f399/); [Rey et al. 2019, segmenting meta-analysis (Educ. Psychol. Rev.)](https://consensus.app/papers/details/af8dc817f0875ce4b8d2d9da27b24741/); [Zhi, Ottley & Metoyer 2019, linking and layout in narrative visualization (CGF), N=180](https://onlinelibrary.wiley.com/doi/10.1111/cgf.13719); [Wang et al. 2016, modality meta-analysis: d=0.24 overall, larger only when system-paced](https://consensus.app/papers/details/0dda3eb1b36b51aa8d1da62aa4e65b67/)
- **Exemplars:** [Google Arts & Culture story: Emakimono, Tokugawa Art Museum](https://artsandculture.google.com/story/emakimono-illustrated-handscrolls-the-tokugawa-art-museum/QQVRePrklPIhJg?hl=en); [Nicky Case, Explorable Explanations (design notes)](https://blog.ncase.me/explorable-explanations)
- **Edo, rendered this way:** 'One sheet, many hands' (b1-6) as four frames: publisher, designer, carver, printer; at each the learner drags brief, money and credit tokens onto the hands, then the record's answer: credit stops at designer and publisher.
- **Fit (0-3):** A2 B2 C2 D1 E3 F3 G1 · **Units:** F1.17, F1.26, F1.28a, F1.29, F1.19, F1.23

### 4. Podcast, audio essay or audio walk `audio`

- **What:** Listening formats: a 10-15 minute object-centred audio essay, or a walk narrated against a map or a real street.
- **Laurillard type:** acquisition · **ICAP:** passive · **F1 forms:** 8 · **Cost:** S
- **Suits:** acquisition on the move; commuting learners; voice and testimony; Seixas: historical perspectives (when voices are primary); accessibility (audio description)
- **Evidence (mixed):** In a direct comparison audio produced less recall than scrollytelling or video; the modality advantage holds mainly for short system-paced material. Value is reach, accessibility and voice, not efficiency. Text-to-speech is allowed under the programme's 'AI inside the rules' if a person checks it. Sources: [Schneiders 2020, scrollytelling vs video vs audio vs text explainers (Media and Communication), N=381](https://consensus.app/papers/details/cd639afb2ae5543cb568ef6eeb00d7d9/); [Wang et al. 2016, modality meta-analysis: d=0.24 overall, larger only when system-paced](https://consensus.app/papers/details/0dda3eb1b36b51aa8d1da62aa4e65b67/)
- **Exemplars:** [BBC Radio 4 / British Museum, A History of the World in 100 Objects (100 x 15-min audio)](https://en.wikipedia.org/wiki/A_History_of_the_World_in_100_Objects); [British Library Sounds, National Life Stories: Crafts Lives (makers' oral histories)](https://sounds.bl.uk/oral-history/crafts)
- **Edo, rendered this way:** A 12-minute audio walk 'Nihonbashi to the quarter's gate, 1790' keyed to the 1859 map pins (publishers' street, Tsutaya's shop, the theatres), with the content note spoken before the Yoshiwara stop and nothing dramatised there.
- **Fit (0-3):** A2 B2 C2 D1 E2 F0 G2 · **Units:** F1.4, F1.13, F1.16, F1.17, F1.21, F1.29

### 5. Case study (decision case) `case`

- **What:** One documented situation told up to a decision point; the learner judges what the actor should weigh, then reads what happened.
- **Laurillard type:** inquiry · **ICAP:** constructive · **F1 forms:** 3, 13 · **Cost:** S
- **Suits:** briefer lane: commissioning, regulation, restitution decisions; Bloom: analyse, evaluate; Seixas: ethical dimension; historical perspectives
- **Evidence (mixed):** Single cases are less effective than paired cases: case comparison beats single-case study (d=0.50 across 57 experiments). Use cases in pairs or with a stated principle after them. Direct evidence for case teaching outside professional schools is thin (marked uncertain). Sources: [Alfieri, Nokes-Malach & Schunn 2013, Learning through case comparisons (Educ. Psychol.): d=0.50, 57 experiments](https://consensus.app/papers/details/aa29d4d385a85293b72bb516e0000abf/); [Schwartz & Bransford 1998, A time for telling (Cognition and Instruction 16(4))](https://doi.org/10.1207/s1532690xci1604_4)
- **Exemplars:** [MIT Case Studies in Social and Ethical Responsibilities of Computing (open, peer-reviewed cases)](https://mit-serc.pubpub.org/); [Smarthistory: unscripted expert conversations in front of the object](https://smarthistory.org/)
- **Edo, rendered this way:** 'Tsutaya's fine, 1791': the facts to the moment Kyoden is manacled and half his estate is fined; the learner weighs comply, retreat or go luxury, then reads b2-6 (mica busts, then Sharaku).
- **Fit (0-3):** A2 B2 C2 D1 E3 F3 G2 · **Units:** F1.17, F1.19, F1.19a, F1.23, F1.24, F1.26, F1.2

### 6. Worked example, then faded practice `worked`

- **What:** An expert reading shown step by step, then a second with steps removed, then the learner alone (modelling, coaching, fading).
- **Laurillard type:** practice · **ICAP:** active · **F1 forms:** 3, 4 · **Cost:** S
- **Suits:** learning a reading method: autopsy, sourcing, provenance, seal dating; Bloom: apply; Seixas: evidence; Merrill: demonstration then application
- **Evidence (strong):** Worked examples g=0.48 (maths); they also beat problem-solving in ill-structured legal reasoning, so the effect is not only for algorithms. Fading steps plus self-explanation prompts improves transfer. Matches Merrill's demonstration-application principles and Chernikova's finding that novices learn best from examples. Sources: [Barbieri et al. 2023, worked examples meta-analysis (Educ. Psychol. Rev.): g=0.48](https://consensus.app/papers/details/d59268ae831952f597db8ed574c9c1ed/); [Nievelstein et al. 2013, worked examples in ill-structured legal reasoning (Contemp. Educ. Psychol.)](https://consensus.app/papers/details/b097912b94af57218e5a6dfdec2a451a/); [Atkinson, Renkl & Merrill 2003, fading worked-out steps plus self-explanation prompts (J. Educ. Psychol. 95(4))](https://doi.org/10.1037/0022-0663.95.4.774); [Merrill 2002, First principles of instruction (ETR&D 50(3))](https://doi.org/10.1007/BF02505024); [Chernikova et al. 2020, Simulation-based learning in higher education (Rev. Educ. Res.): g=0.85, 145 studies; examples help novices](https://consensus.app/papers/details/453910073fb35715b83cc5e5d21d1f41/)
- **Exemplars:** [Historical Thinking Matters (Wineburg et al.): videos of historians reading documents aloud](https://historicalthinkingmatters.org/why/); [Digital Inquiry Group (formerly Stanford History Education Group): Reading Like a Historian](https://www.inquirygroup.org/)
- **Edo, rendered this way:** The Historian reads Utamaro's sheet (b2-4) mark by mark: signature, Tsutaya's ivy leaf, kiwame seal, what each proves; then a Hiroshige of 1856 with two marks pre-read and two left; then an unlabelled Kuniyoshi read alone.
- **Fit (0-3):** A3 B1 C2 D2 E2 F3 G3 · **Units:** F1.1, F1.25, F1.24, F1.28, F1.28a, F1.27, F1.9a, F1.12a

### 7. Object-based learning and slow looking `obl`

- **What:** Prolonged, structured looking at one object before any label (See-Think-Wonder, Ten Times Two), then the record.
- **Laurillard type:** inquiry · **ICAP:** constructive · **F1 forms:** 3, 15 · **Cost:** S
- **Suits:** observation and noticing; separating seen from inferred; Bloom: understand, analyse; Seixas: evidence; material culture, technique traces
- **Evidence (weak):** Widely practised in museums and UCL/Harvard teaching, but evidence is mostly qualitative case studies; no controlled effect sizes for slow looking itself were found. The nearest experimental evidence (one museum visit) gives small effects (+0.06 to +0.09 SD) that are larger for less-advantaged learners. Still the module's signature method; measure it. Sources: [Chatterjee & Hannan (eds) 2015, Engaging the Senses: Object-Based Learning in Higher Education (review)](https://scholarworks.iu.edu/journals/index.php/mar/article/download/23048/28982/52511); [Object-based learning and research-based education: case studies from UCL curricula (qualitative)](https://discovery.ucl.ac.uk/id/eprint/10051332/7/Blum_Chapter%2011_Teaching-and-Learning-in-Higher-Education.pdf); [Greene, Kisida & Bowen 2014, art-museum field-trip RCT, N=10,912: critical thinking +0.09 SD, historical empathy +0.06, tolerance +0.07; ~2-3x for rural/high-poverty](https://www.educationnext.org/wp-content/uploads/2013/09/ednext_XIV_1_greene.pdf)
- **Exemplars:** [Project Zero thinking routine: See Think Wonder](https://pz.harvard.edu/sites/default/files/2026-03/See%20think%20wonder.pdf); [Project Zero, Out of Eden Learn: slow looking and global peer exchange online](https://learn.outofedenwalk.com/)
- **Edo, rendered this way:** Before any label, two minutes on JP1847: ten words, look again, ten more; then deep zoom on the foam fingers and the Prussian-blue sky, revealing which marks the carver cut and which the printer's bokashi made.
- **Fit (0-3):** A3 B2 C1 D0 E2 F2 G2 · **Units:** F1.1, F1.25, F1.22a, F1.18, F1.6, F1.8, F1.15

### 8. Primary-source analysis (document-based inquiry) `dbq`

- **What:** A question answered from 2-6 sources the learner sources, contextualises, close-reads and corroborates.
- **Laurillard type:** inquiry · **ICAP:** constructive · **F1 forms:** 4, 13 · **Cost:** S
- **Suits:** Bloom: analyse, evaluate; Seixas: evidence; historical perspectives; texts, contracts, edicts, catalogues, labels
- **Evidence (moderate):** Reading Like a Historian (6 months, 236 students) improved historical thinking, transfer, factual knowledge and reading comprehension; multiple texts beat a textbook. Without scaffolds learners slip into binary reliable/unreliable judgements. Sources: [Reisman 2012, Reading Like a Historian intervention (Cognition and Instruction), 236 students, 6 months](https://consensus.app/papers/details/24ebc232b74354ca93c70847c281a93c/); [Nokes, Dole & Hacker 2007, multiple texts vs textbook in history (J. Educ. Psychol.)](https://consensus.app/papers/details/34544af030fc5324a018263454f9bba4/); [Jay 2021, trained students treat sources as binary reliable/unreliable (Cognition and Instruction)](https://consensus.app/papers/details/b4addb8bfa765571919b13eb3e5195f3/)
- **Exemplars:** [Digital Inquiry Group (formerly Stanford History Education Group): Reading Like a Historian](https://www.inquirygroup.org/); [Library of Congress, Teaching with Primary Sources: historical thinking guide](https://www.loc.gov/static/programs/teachers/about-this-program/teaching-with-primary-sources-partner-program/documents/historical_thinking.pdf)
- **Edo, rendered this way:** The packing-paper story (b7-2): the 1905 Bracquemond memoir set beside two later retellings; the learner dates each, measures distance from 1856, and finds where 'a small oddly bound book' became 'wrapping paper'.
- **Fit (0-3):** A2 B2 C2 D2 E3 F3 G3 · **Units:** F1.3, F1.9a, F1.11, F1.12a, F1.24, F1.28, F1.29, F1.27

### 9. Prediction prompt (guess, then reveal) `predict`

- **What:** A one-tap commitment on the instrument (slider, map, timeline, marks) before the fact is shown.
- **Laurillard type:** practice · **ICAP:** active · **F1 forms:** 15 · **Cost:** S
- **Suits:** surprising facts; misconceptions; Bloom: remember; Seixas: cause and consequence (testing a prior); every opening move
- **Evidence (moderate):** Prequestions help the asked content (g=0.54) but barely anything else (g=0.04); predictions help most for expectancy-violating outcomes. Target the one fact you most want remembered; reveal at once. Sources: [St. Hilaire, Carpenter & Jonsson 2023, prequestions meta-analysis: g=0.54 specific, g=0.04 general](https://consensus.app/papers/details/ae47f3256d405351ba11ef75d04f388d/); [Brod, Hasselhorn & Bunge 2018, predictions boost memory for surprising outcomes (Learning and Instruction)](https://consensus.app/papers/details/dbb6eb136ec658568e53fdb7bb2d5544/)
- **Exemplars:** [NYT Upshot, You Draw It (predict the curve, then see the data)](https://www.nytimes.com/interactive/2015/05/28/upshot/you-draw-it-how-family-income-affects-childrens-college-chances.html); [F1 Edo unit (v4), internal](https://claude.ai/artifact/73RSURL2MWqJpyJuh4mdh6)
- **Edo, rendered this way:** Existing: the log slider 'how many lived in Edo in 1721?' (truth about 1.3 million) and 'how many Great Waves survive?' (113 by 2024).
- **Fit (0-3):** A3 B3 C3 D3 E2 F2 G0 · **Units:** F1.2, F1.5, F1.6, F1.9a, F1.12, F1.12a, F1.13, F1.25, F1.26, F1.28, F1.28a, F1.30, F1.30a
- **Cautions:** Never on sensitive content (no guessing a woman's contract term or a death toll as a game).

### 10. Chronology and map building (timeline and route placement) `chrono`

- **What:** The learner places events, objects or stops on a timeline with ranges, or on a map, then sees the record.
- **Laurillard type:** practice · **ICAP:** active · **F1 forms:** 11, 12 · **Cost:** M
- **Suits:** Bloom: remember, understand; Seixas: continuity and change; significance (what gets a place on the line); simultaneity; dates as ranges; routes
- **Evidence (weak):** Little direct experimental evidence on timeline or map building for adults (marked uncertain). It earns its place by proxy: it is retrieval practice with feedback (strong) and a spatial-temporal organiser (contiguity). F1.3's point that the timeline is an argument makes building one a method, not a quiz. Sources: [Yang et al. 2021, classroom quizzing meta-analysis (Psychol. Bull.): g=0.499, 222 studies](https://consensus.app/papers/details/d5865595581856df817e7452b18cbdc4/); [Mayer 2017, Using multimedia for e-learning (J. Comput. Assist. Learn.): segmenting d=0.70, contiguity d=0.79/1.30](https://consensus.app/papers/details/5ca62b3d23f75783a489de775688f399/)
- **Exemplars:** [Knight Lab TimelineJS (free, open-source timeline authoring)](https://timeline.knightlab.com/); [The Met, Heilbrunn Timeline of Art History](https://www.metmuseum.org/essays/timeline-of-art-history)
- **Edo, rendered this way:** Existing 'Rebuild' at each act end: six tiles to the timeline (Act I, 1635-1794) or to the map (Act IV: Paris, Tokyo, Boston, Chicago, Washington), plus the coda ordering of six events across 1790-2024.
- **Fit (0-3):** A1 B2 C3 D3 E1 F1 G2 · **Units:** F1.3, F1.5, F1.13, F1.19a, F1.30, F1.27, F1.10

### 11. Concept map and knowledge-graph exploration `graph`

- **What:** Exploring or building node-link structures: the Atlas Connections view, Connect Two Things, or the learner's own map.
- **Laurillard type:** inquiry · **ICAP:** constructive · **F1 forms:** 4, 12 · **Cost:** M
- **Suits:** relations, networks, influence as claim; Bloom: analyse, create; Seixas: cause and consequence; significance; the threshold concept (a web, not a line)
- **Evidence (strong):** Concept and knowledge maps g=0.58 across 142 effects; creating maps (g=0.72) beats studying given maps (g=0.43); effective in non-STEM domains; also improves critical thinking (g=0.53). Browsing a large graph without a question is not the same thing: give every view one question. Sources: [Schroeder et al. 2018, concept maps meta-analysis (Educ. Psychol. Rev.): g=0.58; creating 0.72, studying 0.43; non-STEM too](https://consensus.app/papers/details/5b2e2d1f20b05887a0d28f8a2249010d/); [Nesbit & Adesope 2006, Learning with concept and knowledge maps (Rev. Educ. Res.), 55 studies](https://consensus.app/papers/details/be2bc5f0b65059f5843d1a9011102744/); [Barta et al. 2022, concept mapping and critical thinking meta-analysis (Educ. Res. Rev.): g=0.53](https://consensus.app/papers/details/79647c2fc2ee5b02bcd96fa71b1caf94/)
- **Exemplars:** [Kindred Britain (Stanford): a network of 30,000 related people](https://kindred.stanford.edu/); [Stanford, Mapping the Republic of Letters](http://republicofletters.stanford.edu/)
- **Edo, rendered this way:** Connect Two Things: the Wave and Van Gogh's Hiroshige copies; the chain runs through Hayashi's 218 shipments and Bing's shop; the learner challenges the 'influenced by' edge and must name the source that would change its confidence.
- **Fit (0-3):** A2 B1 C3 D1 E2 F1 G3 · **Units:** F1.13, F1.14, F1.19b, F1.20, F1.27, F1.31, F1.15

### 12. Comparison and contrasting cases `compare`

- **What:** Two to seven cases side by side (before/after slider, comparison wall); the learner finds what differs and what is shared, then hears the principle.
- **Laurillard type:** inquiry · **ICAP:** constructive · **F1 forms:** 5, 10 · **Cost:** S
- **Suits:** Bloom: analyse; Seixas: continuity and change; perspectives; copies, impressions, states, techniques across worlds; 'a time for telling': compare first, explain after
- **Evidence (strong):** Case comparison d=0.50 (57 experiments, 336 tests); larger when learners look for similarities, when the principle comes after the comparison, and with perceptual content. Contrasting cases prepare learners to learn from a later explanation. Sources: [Alfieri, Nokes-Malach & Schunn 2013, Learning through case comparisons (Educ. Psychol.): d=0.50, 57 experiments](https://consensus.app/papers/details/aa29d4d385a85293b72bb516e0000abf/); [Schwartz & Bransford 1998, A time for telling (Cognition and Instruction 16(4))](https://doi.org/10.1207/s1532690xci1604_4)
- **Exemplars:** [Ukiyo-e.org (John Resig): finds the same print across museums for side-by-side comparison](https://ukiyo-e.org/); [Mirador IIIF viewer: side-by-side comparison of open museum images](https://projectmirador.org/)
- **Edo, rendered this way:** Three Great Waves (Met JP1847, Met JP10, AIC) aligned in the viewer: the learner marks differences in the sky, the boat outlines and the fading of Prussian blue, then learns about states, block wear and light.
- **Fit (0-3):** A2 B3 C3 D1 E3 F2 G1 · **Units:** F1.4, F1.7, F1.9, F1.11, F1.12, F1.14, F1.15, F1.20, F1.22a, F1.28

### 13. Structured academic controversy (and the solo argued card) `sac`

- **What:** Pairs argue one reading from evidence, swap sides, then write a consensus; solo version: weigh evidence against two sourced readings.
- **Laurillard type:** discussion · **ICAP:** interactive · **F1 forms:** 13 · **Cost:** S
- **Suits:** contested claims with two sourced readings; Bloom: evaluate; Seixas: evidence; ethical dimension; perspectives
- **Evidence (moderate):** Johnson & Johnson's meta-analysis: controversy beats concurrence seeking (ES 0.70, n=12), debate (0.62, n=4) and individual work (0.76, n=13) on achievement. The studies are older, small and mostly the authors' own, so treat as moderate. The solo argued card has no direct test; its basis is the multiple-texts evidence. Sources: [Johnson & Johnson 2009, Energizing learning (Educ. Researcher): controversy vs concurrence ES 0.70 (n=12), vs debate 0.62 (n=4), vs individualistic 0.76 (n=13)](https://doi.org/10.3102/0013189X08330540); [Nokes, Dole & Hacker 2007, multiple texts vs textbook in history (J. Educ. Psychol.)](https://consensus.app/papers/details/34544af030fc5324a018263454f9bba4/); [Reisman 2012, Reading Like a Historian intervention (Cognition and Instruction), 236 students, 6 months](https://consensus.app/papers/details/24ebc232b74354ca93c70847c281a93c/)
- **Exemplars:** [Digital Inquiry Group: New Deal Structured Academic Controversy lesson](https://www.inquirygroup.org/history-lessons/new-deal-sac); [Digital Inquiry Group (formerly Stanford History Education Group): Reading Like a Historian](https://www.inquirygroup.org/)
- **Edo, rendered this way:** 'Exchange or appropriation?' (b7-6): cohort pairs argue from Hayashi's shipments (A) and Japonisme's naming (B), swap, then co-write one sentence; the unit's verdict 'mostly A for this evidence; B still holds for display and credit' is shown after.
- **Fit (0-3):** A1 B2 C2 D1 E3 F3 G1 · **Units:** F1.2, F1.3, F1.6, F1.13, F1.15, F1.20, F1.24, F1.28a, F1.12

### 14. Socratic dialogue or AI tutor (partner voices) `socratic`

- **What:** A questioning partner with a declared agenda (Historian, Mirror, Fabricator, Stranger) that asks rather than tells and ends on a test.
- **Laurillard type:** discussion · **ICAP:** interactive · **F1 forms:** none yet · **Cost:** M
- **Suits:** Bloom: evaluate, create; Seixas: evidence (who says so?); checking the learner's own artifact; any unit's partner row
- **Evidence (mixed):** A pedagogy-designed AI tutor beat in-class active learning in one RCT; unrestricted chat raised practice scores but lowered later unaided scores by 17%, while a guardrailed tutor removed most of that harm; a scaffolded tutor gave the same learning as no AI in a CS1 RCT. Design (hints first, no answers, test at the end) decides the sign. Inference is not free, which strains the zero-cost rule. Sources: [Kestin et al. 2025, AI tutor vs in-class active learning RCT (Scientific Reports)](https://consensus.app/papers/details/f12731c50ae651e59469569386ea8ed9/); [Bastani et al. 2025, Generative AI without guardrails can harm learning (PNAS): -17% after access removed; tutor guardrails mitigate](https://consensus.app/papers/details/3fa1c5bedc1a5530bb7ef15044cb4b28/); [Bassner et al. 2025, scaffolded vs unrestricted AI in CS1 RCT: higher scores, same learning](https://consensus.app/papers/details/4ba657dd763c5dd0b39ce09ededdebba/)
- **Exemplars:** [Khanmigo (Khan Academy's tutor that asks rather than tells)](https://www.khanmigo.ai/); [Historical Thinking Matters (Wineburg et al.): videos of historians reading documents aloud](https://historicalthinkingmatters.org/why/)
- **Edo, rendered this way:** The Historian on the Wave: 'Who is named on this sheet, and who cut the foam?' It presses until the learner cites the 1889 Tokuno set as the first record naming carver Kido; it never speaks as Hokusai or any courtesan.
- **Fit (0-3):** A2 B2 C2 D1 E2 F3 G3 · **Units:** F1.1, F1.6, F1.13, F1.23, F1.25, F1.28a, F1.30a, F1.27, F1.31
- **Cautions:** No impersonating historical people; no AI voice for living communities; offline fallback is the written test.

### 15. Role-play and perspective-taking `roleplay`

- **What:** The learner takes the position of a historical office (publisher, censor, commissioner, curator) facing a real, documented choice.
- **Laurillard type:** practice · **ICAP:** constructive · **F1 forms:** none yet · **Cost:** M
- **Suits:** Bloom: apply, evaluate; Seixas: historical perspectives; ethical dimension; institutional decisions, regimes, briefs
- **Evidence (weak):** Reacting to the Past raised self-efficacy and engagement but not measured perspective taking (N=201, quasi-experimental). Game fiction moderates behaviour during play only. Use roles that serve a decision; never roles of coerced or exploited people. Sources: [Bledsoe & Richardson 2022, Reacting to the Past quasi-experiment, N=201: self-efficacy up, perspective taking unchanged (IJTLHE)](https://files.eric.ed.gov/fulltext/EJ1366192.pdf); [Mission US research and outcomes (EDC studies 2011, 2016, 2025 efficacy study)](https://www.mission-us.org/about/proven-impact/research-and-outcomes/)
- **Exemplars:** [Reacting to the Past (Barnard): role-immersion games set in historical moments](https://reacting.barnard.edu/); [Mission US (THIRTEEN/WNET): branching role-play history games](https://www.mission-us.org/)
- **Edo, rendered this way:** At the Censor's Desk in 1842 the learner is the guild examiner applying the Tenpo rules to six sheets (actors and courtesans banned, 16-mon cap); the role is the office, never the women or the actors.
- **Fit (0-3):** A0 B1 C1 D0 E2 F2 G0 · **Units:** F1.17, F1.21, F1.26, F1.24, F1.19b
- **Cautions:** Yoshiwara: read, not played. No role for enslaved, indentured or displaced people (F1.13, F1.19a, F1.23).

### 16. Branching scenario or interactive fiction `branching`

- **What:** A short text story with 2-4 decision points; every branch ends on 'What actually happened' with sources.
- **Laurillard type:** practice · **ICAP:** active · **F1 forms:** 1 · **Cost:** M
- **Suits:** contingency: the choices actors faced; Bloom: apply; Seixas: cause and consequence; perspectives
- **Evidence (weak):** EDC studies of Mission US report gains over comparison classes (1,118 students, 2011; 15% vs under 1% gain, 2016) but they are quasi-experimental and K-12. Games show effects only over several sessions (one session g=0.08). Treat as a motivator for contingency, not a knowledge vehicle. Sources: [Mission US research and outcomes (EDC studies 2011, 2016, 2025 efficacy study)](https://www.mission-us.org/about/proven-impact/research-and-outcomes/); [Clark, Tanner-Smith & Killingsworth 2016, digital games meta-analysis (Rev. Educ. Res.): g=0.33; one session g=0.08](https://doi.org/10.3102/0034654315582065)
- **Exemplars:** [Mission US (THIRTEEN/WNET): branching role-play history games](https://www.mission-us.org/); [Twine: free open-source tool for branching interactive fiction](https://twinery.org/)
- **Edo, rendered this way:** 'Eijudo's bet, 1830': three choices (a beauty series, a Fuji series in imported blue, reprints); each branch ends on the Fuji series of 1831 and the price lane, with sources; no score.
- **Fit (0-3):** A0 B1 C1 D0 E2 F2 G0 · **Units:** F1.17, F1.21, F1.26, F1.30a, F1.19
- **Cautions:** Not for war, coercion or the quarter; no outcomes, scores or timers.

### 17. Simulation, sandbox or explorable `sim`

- **What:** A rule-based model the learner can manipulate (route costs, block wear, calendar conversion, supply chain) to see consequences.
- **Laurillard type:** practice · **ICAP:** active · **F1 forms:** 4 · **Cost:** L
- **Suits:** systems and trade-offs: routes, supply chains, process splits, calendars; Bloom: apply, analyse; Seixas: cause and consequence
- **Evidence (moderate):** Simulations g=0.85 for complex professional skills, with examples helping novices; intrinsically integrated mechanics produce more learning and seven times more voluntary play. Evidence is from medicine, teacher education and STEM; transfer to history is plausible but untested (marked uncertain). A realist 3D history tour underperformed a short lecture. Sources: [Chernikova et al. 2020, Simulation-based learning in higher education (Rev. Educ. Res.): g=0.85, 145 studies; examples help novices](https://consensus.app/papers/details/453910073fb35715b83cc5e5d21d1f41/); [Habgood & Ainsworth 2011, intrinsic integration (J. Learning Sciences)](https://shura.shu.ac.uk/3556/1/Habgood_Ainsworth_final.pdf); [Assassin's Creed Discovery Tour study: 44% knowledge gain vs 51% after a 12-min lecture (Variety report of Montreal study)](https://variety.com/2018/gaming/news/assassins-creed-origins-discovery-tour-effectiveness-1202861325)
- **Exemplars:** [ORBIS: Stanford geospatial network model of the Roman world (route cost simulator)](https://orbis.stanford.edu/); [Nicky Case & Vi Hart, Parable of the Polygons (explorable simulation)](https://ncase.me/polygons/)
- **Edo, rendered this way:** The edition lab: set block wear and run size and watch impressions degrade; the learner finds why 'up to 8,000 printed' is an inference from wear while 113 is a count.
- **Fit (0-3):** A1 B1 C3 D2 E2 F3 G1 · **Units:** F1.13, F1.19, F1.22, F1.30, F1.30a, F1.14, F1.10

### 18. Evidence or deduction game (Obra Dinn-style) `deduction`

- **What:** A set of unlabelled items to identify or date from evidence, confirmed in batches so guessing does not pay.
- **Laurillard type:** inquiry · **ICAP:** constructive · **F1 forms:** 4, 15 · **Cost:** M
- **Suits:** Bloom: analyse, evaluate; Seixas: evidence; dating, attribution, provenance, seen/recorded/guessed
- **Evidence (weak):** No learning evaluations of commercial deduction games were found; the archival-mystery model (Great Unsolved Mysteries) has awards, not trials. The mechanism is sound by proxy: the mechanic is the historian's practice (intrinsic integration) and it is retrieval with feedback. Sources: [Habgood & Ainsworth 2011, intrinsic integration (J. Learning Sciences)](https://shura.shu.ac.uk/3556/1/Habgood_Ainsworth_final.pdf); [Yang et al. 2021, classroom quizzing meta-analysis (Psychol. Bull.): g=0.499, 222 studies](https://consensus.app/papers/details/d5865595581856df817e7452b18cbdc4/)
- **Exemplars:** [Return of the Obra Dinn (Lucas Pope, 2018): deduce identities from evidence, confirmed in threes](https://obradinn.com/); [Great Unsolved Mysteries in Canadian History: archive-based historical mysteries](https://www.canadashistory.ca/awards/governor-general-s-history-awards/award-recipients/2008/great-unsolved-mysteries-in-canadian-history)
- **Edo, rendered this way:** The Seal Timeline desk: date nine unlabelled sheets from their censor seals (kiwame 1790-1842, nanushi pairs, aratame and date seals); results confirm three at a time.
- **Fit (0-3):** A2 B1 C2 D1 E2 F3 G1 · **Units:** F1.1, F1.14, F1.23, F1.24, F1.28, F1.9a, F1.15

### 19. Making and reconstruction (making to know) `making`

- **What:** Rebuilding a technique at kitchen-table scale from a source, logging each step as text says / object shows / holder says / I decided.
- **Laurillard type:** production · **ICAP:** constructive · **F1 forms:** 2, 3 · **Cost:** M
- **Suits:** tacit knowledge; technique; the gap between recipe and practice; Bloom: apply, create; Seixas: evidence (what a remake can and cannot show); maker lane
- **Evidence (mixed):** Enacting is one of Fiorella and Mayer's eight generative strategies; the Making and Knowing Project documents rich learning qualitatively. No controlled studies of reconstruction for history learning were found (marked uncertain). Sources: [Fiorella & Mayer 2016, Eight ways to promote generative learning (Educ. Psychol. Rev.) incl. enacting and teaching](https://consensus.app/papers/details/00814a2a523555679bdeb93403953693/)
- **Exemplars:** [Making and Knowing Project: Secrets of Craft and Nature, Research and Teaching Companion](https://teaching640.makingandknowing.org/); [Making and Knowing Project, digital critical edition of BnF Ms. Fr. 640 (announcement)](https://scienceandsociety.columbia.edu/news/making-and-knowing-project-published-digital-critical-edition)
- **Edo, rendered this way:** A two-block print with eraser or lino blocks and paper kento marks: register a key block and one colour; log three trials, one variable each (paper damp or dry); label the result 'Reconstruction, an interpretation'.
- **Fit (0-3):** A2 B1 C1 D0 E1 F3 G2 · **Units:** F1.28a, F1.18, F1.7, F1.6, F1.19, F1.25
- **Cautions:** Excluded: toxic materials, live animals, sacred or restricted techniques (F1.28a).

### 20. Field trip or virtual tour `tour`

- **What:** Visiting a place or collection, physically or through open 360 views and museum stories, with one question to carry.
- **Laurillard type:** inquiry · **ICAP:** active · **F1 forms:** 12 · **Cost:** S
- **Suits:** place, scale, display context, the museum as author; Bloom: understand; Seixas: significance
- **Evidence (weak):** A large RCT of one art-museum visit found small gains (critical thinking +0.09 SD, historical empathy +0.06), two to three times larger for rural and high-poverty pupils. No comparable evidence for virtual tours was found. Sources: [Greene, Kisida & Bowen 2014, art-museum field-trip RCT, N=10,912: critical thinking +0.09 SD, historical empathy +0.06, tolerance +0.07; ~2-3x for rural/high-poverty](https://www.educationnext.org/wp-content/uploads/2013/09/ednext_XIV_1_greene.pdf)
- **Exemplars:** [Google Arts & Culture: museum Street View tours and stories](https://artsandculture.google.com/); [Project Zero, Out of Eden Learn: slow looking and global peer exchange online](https://learn.outofedenwalk.com/)
- **Edo, rendered this way:** 'Step into the View': three Hiroshige Hundred Views placed on the 1859 map at their viewpoints; locally, the learner visits any print room or open collection and logs one impression's label as the museum wrote it.
- **Fit (0-3):** A1 B3 C2 D0 E1 F0 G2 · **Units:** F1.6, F1.7, F1.8, F1.9, F1.10, F1.11, F1.12, F1.24, F1.31

### 21. Oral history and interview `oral`

- **What:** Recording what living makers and users know, under consent that is free, prior, informed and asked again at review.
- **Laurillard type:** inquiry · **ICAP:** interactive · **F1 forms:** 8 · **Cost:** M
- **Suits:** living practice; vernacular knowledge; use and meaning; Bloom: create; Seixas: perspectives; ethical dimension; G-archetype field work
- **Evidence (weak):** Strong professional standards (OHA) and rich archives, but no controlled learning evidence was found; value is method and ethics, not measured recall. Sources: [Oral History Association principles (standards, not outcome evidence)](https://oralhistory.org/principles-and-best-practices-revised-2018/)
- **Exemplars:** [British Library Sounds, National Life Stories: Crafts Lives (makers' oral histories)](https://sounds.bl.uk/oral-history/crafts); [1947 Partition Archive (crowd-sourced, consented oral histories)](https://www.1947partitionarchive.org/)
- **Edo, rendered this way:** Under the F1.29 kit, ask three people what the Wave means on the thousand-yen note (or interview a mokuhanga printer, with consent); tag each statement as told-by, never as fact.
- **Fit (0-3):** A0 B1 C0 D0 E1 F1 G3 · **Units:** F1.29, F1.31, F1.12, F1.18, F1.22a, F1.4

### 22. Problem- or project-based research `pbl`

- **What:** A driving question answered over weeks with a public product (research piece, regional slot, lineage).
- **Laurillard type:** production · **ICAP:** constructive · **F1 forms:** 4 · **Cost:** M
- **Suits:** Bloom: create; Seixas: all six; Mastery depth; the artifact
- **Evidence (mixed):** PBL helps skills robustly but not knowledge (Dochy 2003); a second-order meta-analysis gives ES 0.60 with effects shrinking in higher-quality studies. Minimal guidance underperforms, so worked cases come first. Sources: [Dochy et al. 2003, PBL meta-analysis (Learning and Instruction): skills robustly positive, knowledge non-robust negative](https://consensus.app/papers/details/5161b1f431af5f81a5f6ca8fc62a9da6/); [Erdem et al. 2025, PBL second-order meta-analysis (Studies in Higher Education): ES=0.60, moderated by research quality](https://consensus.app/papers/details/799d68570a8d5998b4b6eb6f39075a5e/)
- **Exemplars:** [National History Day: year-long student history research projects](https://www.nhd.org/); [Smithsonian Learning Lab: learners build and annotate their own collections](https://learninglab.si.edu/)
- **Edo, rendered this way:** 'Who made this impression?': pick one open-access Hiroshige or Hokusai impression, trace its provenance chain to the dealer (Hayashi, Wright, the Spauldings), and produce a credit map and attribution line.
- **Fit (0-3):** A1 B0 C1 D0 E1 F2 G3 · **Units:** F1.27, F1.31, F1.29, F1.24

### 23. Retrieval practice and spaced prompts `retrieval`

- **What:** Short recall items at segment ends and again days later, embedded in the page rather than a separate quiz.
- **Laurillard type:** practice · **ICAP:** active · **F1 forms:** 15 · **Cost:** S
- **Suits:** Bloom: remember; facts that later reasoning needs: dates, names, techniques; returning learners
- **Evidence (strong):** Practice testing and distributed practice are the two high-utility techniques in Dunlosky et al.; classroom quizzing g=0.499. Recall beats recognition, so prefer place-on-map or order-on-timeline items over multiple choice. Sources: [Dunlosky et al. 2013, Improving students' learning with effective learning techniques (PSPI): practice testing and distributed practice high utility](https://doi.org/10.1177/1529100612453266); [Yang et al. 2021, classroom quizzing meta-analysis (Psychol. Bull.): g=0.499, 222 studies](https://consensus.app/papers/details/d5865595581856df817e7452b18cbdc4/)
- **Exemplars:** [Quantum Country (Matuschak & Nielsen): essay with embedded spaced-repetition prompts](https://quantum.country/qcvc); [Orbit: open-source spaced-repetition prompts embeddable in any web page](https://github.com/andymatuschak/orbit)
- **Edo, rendered this way:** On return a week later, three cards resurface: 'What did the kiwame seal certify, and from when?' 'What did the 1842 reforms cap?' 'Who was first recorded as the Wave's carver, and in what year?'
- **Fit (0-3):** A2 B3 C2 D3 E2 F1 G0 · **Units:** F1.5, F1.6, F1.7, F1.8, F1.9, F1.10, F1.11, F1.12, F1.13, F1.30, F1.3
- **Cautions:** No streaks, points or completion badges (see learning_games_evidence.md).

### 24. Self-explanation prompts `selfexp`

- **What:** After a reveal, the learner states which clue decided it (one tap among reasons, or one line).
- **Laurillard type:** practice · **ICAP:** constructive · **F1 forms:** 15 · **Cost:** S
- **Suits:** Bloom: understand, analyse; Seixas: evidence; converting a guess into a principle
- **Evidence (moderate):** Self-explanation prompts g=0.55 (69 effects); rated moderate utility by Dunlosky. With learning time held constant one study found no gain and higher load; prompts work best when scaffolded and aimed at correct information. Sources: [Bisra et al. 2018, Inducing self-explanation meta-analysis (Educ. Psychol. Rev.): g=0.55, 69 effects](https://consensus.app/papers/details/541078a2cfb75a72ace8edd9e9a6a153/); [Beege et al. 2024, self-explanation prompts gave no gain with time controlled (Instr. Sci.)](https://consensus.app/papers/details/800d6cf11c165211844e27dbc94a036b/); [Rittle-Johnson, Loehr & Durkin 2017, constraints on when self-explanation helps (Psychon. Bull. Rev.)](https://consensus.app/papers/details/b05e4379247953918631822146d8854b/)
- **Exemplars:** [Historical Thinking Matters (Wineburg et al.): videos of historians reading documents aloud](https://historicalthinkingmatters.org/why/); [Digital Inquiry Group (formerly Stanford History Education Group): Reading Like a Historian](https://www.inquirygroup.org/)
- **Edo, rendered this way:** After the tap on Utamaro's marks: 'Which clue showed the carver is missing?' Options: no carver's seal; the law named three people; the key block was destroyed. Then the record's reason.
- **Fit (0-3):** A3 B2 C2 D2 E3 F3 G2 · **Units:** F1.1, F1.2, F1.14, F1.23, F1.25, F1.26, F1.28

### 25. Peer review and critique `peer`

- **What:** Learners review each other's artifacts against a short rubric (every hand sourced, confidence words used) and respond.
- **Laurillard type:** collaboration · **ICAP:** interactive · **F1 forms:** none yet · **Cost:** M
- **Suits:** Bloom: evaluate; the design-studio crit; Mastery outputs; the briefer's brief
- **Evidence (moderate):** Peer assessment g=0.31 against no assessment and 0.28 against teacher assessment (54 studies), robust across contexts; peer grades in MOOCs track staff grades when rubrics are calibrated. Sources: [Double, McGrane & Hopfenbeck 2020, peer assessment meta-analysis (Educ. Psychol. Rev.): g=0.31, 54 studies](https://consensus.app/papers/details/3772c7204f665da992607fd1ca80b621/); [Kulkarni et al. 2013, Peer and self assessment in massive online classes (ACM TOCHI)](https://doi.org/10.1145/2505057)
- **Exemplars:** [Project Zero, Out of Eden Learn: slow looking and global peer exchange online](https://learn.outofedenwalk.com/); [Smithsonian Learning Lab: learners build and annotate their own collections](https://learninglab.si.edu/)
- **Edo, rendered this way:** Learners swap credit maps of one Wave impression; the reviewer marks any hand without a source or confidence word and any edge that names a dealer but no maker.
- **Fit (0-3):** A1 B0 C1 D0 E2 F2 G3 · **Units:** F1.27, F1.31, F1.26, F1.30a, F1.23
- **Cautions:** Needs a cohort and moderation; never rank individuals.

### 26. Portfolio and learning journal (the Lineage layer) `portfolio`

- **What:** The learner's own accumulating record: nodes, edges, sourced lines and reflections exported to the artifact (SRC).
- **Laurillard type:** production · **ICAP:** constructive · **F1 forms:** 4 · **Cost:** S
- **Suits:** Bloom: create; Seixas: significance (what the learner keeps); continuity across 38 units
- **Evidence (mixed):** Self-regulated-learning programmes help (g=0.36) and self-assessment helps strategy use and self-efficacy; no direct evidence for portfolios as such was retrieved (marked uncertain). Value is integration across units and the artifact itself. Sources: [Theobald 2021, self-regulated learning training meta-analysis (Contemp. Educ. Psychol.): g=0.36](https://consensus.app/papers/details/2e0d442b368d516eaf2a5ead29bcccb8/); [Panadero et al. 2017, self-assessment meta-analyses (Educ. Res. Rev.)](https://consensus.app/papers/details/18ce0e2e359e54438f4abfec1cc83261/)
- **Exemplars:** [Smithsonian Learning Lab: learners build and annotate their own collections](https://learninglab.si.edu/); [Europeana: galleries and stories built from open heritage records](https://www.europeana.eu/)
- **Edo, rendered this way:** The coda inks Edo people and places in the Atlas (#from-edo); the learner adds one object of their own influenced by Japonisme with a sourced 'copied from' or 'adapted from' edge and a confidence word.
- **Fit (0-3):** A2 B2 C2 D1 E2 F2 G3 · **Units:** F1.1, F1.13, F1.27, F1.30, F1.31, F1.25

### 27. Comics and sequential illustration `comics`

- **What:** A narrative told in drawn panels (our own drawings), useful where sequence and hands matter.
- **Laurillard type:** acquisition · **ICAP:** passive · **F1 forms:** 14 · **Cost:** M
- **Suits:** process and sequence; a sheet's life; labour made visible; Bloom: understand; Seixas: perspectives
- **Evidence (mixed):** Comics beat text for understanding and retention in one climate-change experiment, matched text for skilled adult readers (read faster), and helped medium but not high achievers in another. Expect efficiency and access gains rather than deeper learning. Sources: [Budke 2023, comics vs text on climate change, comic better for understanding and retention (Sustainability Science)](https://consensus.app/papers/details/12eddc84dd405bb1bc63a86ceab4747c/); [Rasamimanana et al. 2025, comics vs text in skilled adults: same comprehension, faster reading (Cognitive Science)](https://consensus.app/papers/details/7d850cc4729b51b19926f2979fdebe5d/); [Lin et al. 2016, science comic vs text booklet, N=697: helps medium achievers, not high achievers (IJSE)](https://consensus.app/papers/details/3327df062fe5529dacaa29c6f56b9c9f/)
- **Exemplars:** [Graphic History Collective: comics of labour and working-class history](https://graphichistorycollective.com/); [Hokusai Manga (1814-78) as a sequential-image precedent; see the Met record of volumes](https://www.metmuseum.org/search-results?q=hokusai+manga)
- **Edo, rendered this way:** Six panels, 'One sheet's life' (b9-1): mulberry paper in Echizen, the carver at Eijudo, the printer's second blue pass, a shop wall, a Havemeyer crate, Met gallery JP1847; drawn by us, every panel captioned with its source.
- **Fit (0-3):** A1 B2 C1 D1 E2 F1 G0 · **Units:** F1.25, F1.21, F1.19, F1.23, F1.8
- **Cautions:** Never draw the quarter's women, shunga, or coerced labour as spectacle; no generated images of historical people or objects.

### 28. Data storytelling and visual essay `datastory`

- **What:** An argument carried by quantities drawn honestly: counts, ranges, uncertainty, with the reading beside the chart.
- **Laurillard type:** acquisition · **ICAP:** passive · **F1 forms:** 1, 11, 12 · **Cost:** M
- **Suits:** scale, survival, trade volumes, extraction; Bloom: understand, analyse; Seixas: significance; evidence (counts are someone's)
- **Evidence (mixed):** Data stories raise engagement but showed no recall advantage over traditional charts; text-visual linking is what helps. Use for quantities that change an argument, not decoration. Sources: [Zdanovic et al. 2022, data storytelling vs traditional visualization: no recall difference (CHIIR)](https://consensus.app/papers/details/3e679fb9cb1c5fe390689f259171e502/); [Zhi, Ottley & Metoyer 2019, linking and layout in narrative visualization (CGF), N=180](https://onlinelibrary.wiley.com/doi/10.1111/cgf.13719)
- **Exemplars:** [The Pudding: visual essays built on data](https://pudding.cool/); [SlaveVoyages database and maps (Trans-Atlantic and Intra-American)](https://www.slavevoyages.org/)
- **Edo, rendered this way:** '113 survivors': the runs lane set up to 8,000 estimated printed against 113 located, Red Fuji's 93, and Hayashi's 166,000 vs 300,000 prints (argued) as a range bar, with each count labelled by who counted.
- **Fit (0-3):** A0 B1 C3 D2 E3 F0 G0 · **Units:** F1.13, F1.22, F1.5, F1.19, F1.21, F1.10

### 29. Counterfactual history exercise `counterfactual`

- **What:** Change one documented variable, hold the rest, and trace sourced consequences until the sources stop; label it fiction.
- **Laurillard type:** inquiry · **ICAP:** constructive · **F1 forms:** 13, 4 · **Cost:** S
- **Suits:** causation; testing a claimed cause; Bloom: analyse, create; Seixas: cause and consequence
- **Evidence (weak):** Argued for in history-education theory and reported in practitioner studies (Year 7 causal diagrams); no controlled outcome studies found. Sources: [Bennett 2019, counterfactual diagrams for Year 7 causal reasoning (Teaching History 174), practitioner study](https://eric.ed.gov/?id=EJ1214242); [Towards bad history? A call for the use of counterfactual historical reasoning in history education (theoretical)](https://www.researchgate.net/publication/281866251_Towards_bad_history_A_call_for_the_use_of_counterfactual_reasoning_in_history_education)
- **Exemplars:** [F1 Edo unit (v4), internal](https://claude.ai/artifact/73RSURL2MWqJpyJuh4mdh6)
- **Edo, rendered this way:** Rule Card: 'Remove the 1842 ban. Does the landscape print still boom?' Held fixed: the Fuji series (1831), the Tokaido (1833), cheap Prussian blue; the learner finds the ban protected a genre already selling (the act III argued card).
- **Fit (0-3):** A0 B1 C1 D2 E1 F3 G2 · **Units:** F1.30a, F1.5, F1.13, F1.14, F1.19
- **Cautions:** Atrocity is never the variable (F1.30a).

### 30. Collaborative annotation `annotate`

- **What:** A cohort marks up a shared primary text or image (claims, sources, questions) in a layer others can read.
- **Laurillard type:** collaboration · **ICAP:** interactive · **F1 forms:** 4 · **Cost:** S
- **Suits:** close reading of primary texts and labels; Bloom: analyse; Seixas: evidence; perspectives
- **Evidence (mixed):** Reviews find promising but thin evidence; team annotation improved comprehension and metacognition but not critical thinking; assigned roles raise participation. Free tools exist but need accounts and moderation. Sources: [Novak, Razzouk & Johnson 2012, social annotation tools in HE: literature review, 16 studies (Internet & Higher Education)](https://consensus.app/papers/details/9e07ec1c0c445ded8d2378391006dd62/); [Johnson, Archibald & Tenenbaum 2010, individual vs team social annotation: team annotation improved comprehension and metacognition (Comput. Hum. Behav.)](https://consensus.app/papers/details/1a2a32378b12566c92ee89c2a90794e3/); [Zhu et al. 2023, roles (facilitator, synthesizer, summarizer) with Hypothesis (Internet & Higher Education)](https://consensus.app/papers/details/92ae6048a42b58d9a20b59c3eb969b3f/)
- **Exemplars:** [Hypothesis: free, open-source web annotation (groups, public or private)](https://web.hypothes.is/); [Smithsonian Learning Lab: learners build and annotate their own collections](https://learninglab.si.edu/)
- **Edo, rendered this way:** A shared layer on a public-domain issue of Bing's Le Japon artistique (1888-91): the cohort tags every claim about who made the prints, and every place Japanese makers are named or left out.
- **Fit (0-3):** A2 B1 C1 D0 E2 F3 G2 · **Units:** F1.28, F1.9a, F1.24, F1.3, F1.11, F1.29
- **Cautions:** Shunga and restricted material excluded from any shared corpus.

### Considered and dropped or merged

| Candidate | Decision | Reason |
|---|---|---|
| Microlearning | Dropped as a method; kept as packaging | It is a delivery size, not a way of learning. Its evidence is weak (one meta-analysis: 5 studies, I² = 98%, high risk of bias; [Senadheera et al. 2024](https://journals.kln.ac.lk/jmtr/media/attachments/2025/12/11/jmtr_24_22.pdf)). F1 already has a five-minute consumption form per unit; every method above should name its five-minute cut. |
| Narrated slideshow | Merged into step-through (form 2) and audio (form 8) | Same mechanism: learner-paced segments; narration optional. |
| Timeline building and map building | Merged into one placement method | Same mechanism (place, then see the record); Edo's Rebuild already switches between time and map modes. |
| Debate (competitive) | Folded into structured academic controversy | Controversy beat debate on achievement (ES 0.62, n = 4; Johnson & Johnson 2009), and competition is the weakest game configuration (games note). |
| Learning by teaching (learner-made explainers) | Folded into peer review and the Apply lanes | Teaching is a generative strategy (Fiorella & Mayer 2016) but needs an audience; the Stranger test in F1.30a is already a form of it. |
| Realist 3D or VR walk-throughs | Dropped | Covered in the games note: a high-fidelity tour underperformed a 12-minute lecture; 3D only where space is the argument. |
| Quiz gates, points, badges, streaks | Dropped | Covered in the games note (overjustification, streak breaks, quiz-gate avoidance). |

## 4. Matrix: methods × archetypes

Columns A–G are fit ratings (0–3). Generated from `methods.json`.

| Method | Family | ICAP | Evidence | Cost | A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Scrollytelling narrative walk | acquisition | passive | mixed | M | 1 | 3 | 3 | 2 | 2 | 1 | 0 |
| Lecture or video explainer | acquisition | passive | moderate | L | 1 | 2 | 1 | 1 | 2 | 1 | 1 |
| Step-through explainer or narrated slideshow | acquisition | active | moderate | S | 2 | 2 | 2 | 1 | 3 | 3 | 1 |
| Podcast, audio essay or audio walk | acquisition | passive | mixed | S | 2 | 2 | 2 | 1 | 2 | 0 | 2 |
| Case study (decision case) | inquiry | constructive | mixed | S | 2 | 2 | 2 | 1 | 3 | 3 | 2 |
| Worked example, then faded practice | practice | active | strong | S | 3 | 1 | 2 | 2 | 2 | 3 | 3 |
| Object-based learning and slow looking | inquiry | constructive | weak | S | 3 | 2 | 1 | 0 | 2 | 2 | 2 |
| Primary-source analysis (document-based inquiry) | inquiry | constructive | moderate | S | 2 | 2 | 2 | 2 | 3 | 3 | 3 |
| Prediction prompt (guess, then reveal) | practice | active | moderate | S | 3 | 3 | 3 | 3 | 2 | 2 | 0 |
| Chronology and map building (timeline and route placement) | practice | active | weak | M | 1 | 2 | 3 | 3 | 1 | 1 | 2 |
| Concept map and knowledge-graph exploration | inquiry | constructive | strong | M | 2 | 1 | 3 | 1 | 2 | 1 | 3 |
| Comparison and contrasting cases | inquiry | constructive | strong | S | 2 | 3 | 3 | 1 | 3 | 2 | 1 |
| Structured academic controversy (and the solo argued card) | discussion | interactive | moderate | S | 1 | 2 | 2 | 1 | 3 | 3 | 1 |
| Socratic dialogue or AI tutor (partner voices) | discussion | interactive | mixed | M | 2 | 2 | 2 | 1 | 2 | 3 | 3 |
| Role-play and perspective-taking | practice | constructive | weak | M | 0 | 1 | 1 | 0 | 2 | 2 | 0 |
| Branching scenario or interactive fiction | practice | active | weak | M | 0 | 1 | 1 | 0 | 2 | 2 | 0 |
| Simulation, sandbox or explorable | practice | active | moderate | L | 1 | 1 | 3 | 2 | 2 | 3 | 1 |
| Evidence or deduction game (Obra Dinn-style) | inquiry | constructive | weak | M | 2 | 1 | 2 | 1 | 2 | 3 | 1 |
| Making and reconstruction (making to know) | production | constructive | mixed | M | 2 | 1 | 1 | 0 | 1 | 3 | 2 |
| Field trip or virtual tour | inquiry | active | weak | S | 1 | 3 | 2 | 0 | 1 | 0 | 2 |
| Oral history and interview | inquiry | interactive | weak | M | 0 | 1 | 0 | 0 | 1 | 1 | 3 |
| Problem- or project-based research | production | constructive | mixed | M | 1 | 0 | 1 | 0 | 1 | 2 | 3 |
| Retrieval practice and spaced prompts | practice | active | strong | S | 2 | 3 | 2 | 3 | 2 | 1 | 0 |
| Self-explanation prompts | practice | constructive | moderate | S | 3 | 2 | 2 | 2 | 3 | 3 | 2 |
| Peer review and critique | collaboration | interactive | moderate | M | 1 | 0 | 1 | 0 | 2 | 2 | 3 |
| Portfolio and learning journal (the Lineage layer) | production | constructive | mixed | S | 2 | 2 | 2 | 1 | 2 | 2 | 3 |
| Comics and sequential illustration | acquisition | passive | mixed | M | 1 | 2 | 1 | 1 | 2 | 1 | 0 |
| Data storytelling and visual essay | acquisition | passive | mixed | M | 0 | 1 | 3 | 2 | 3 | 0 | 0 |
| Counterfactual history exercise | inquiry | constructive | weak | S | 0 | 1 | 1 | 2 | 1 | 3 | 2 |
| Collaborative annotation | collaboration | interactive | mixed | S | 2 | 1 | 1 | 0 | 2 | 3 | 2 |

**Reading the matrix.**
- **Broad-fit methods** (2 or 3 in at least five archetypes): prediction, self-explanation, retrieval, primary-source analysis, worked example then fading, comparison, case study, slow looking, step-through, audio, the Socratic partner and the portfolio. These are the module's grammar; every unit should carry prediction, self-explanation and one spaced retrieval item.
- **The strong-evidence four** are comparison, concept/graph mapping, worked examples and retrieval. All four are cheap (S or M). F1 already uses comparison heavily (form 10) and the Atlas makes graph work native. Worked examples and spaced retrieval are the two most under-used relative to their evidence.
- **Narrow-fit methods** (0 in two or more archetypes): role-play, branching, field trip, oral history, project work, peer review and data storytelling. Use them where they fit and nowhere else.
- **Laurillard balance across F1 as specified today** leans to acquisition and inquiry (object stories, walks, walls). Discussion and collaboration appear only through the AI partner and the cohort overlay. If the programme gains a cohort, structured controversy, peer review and collaborative annotation are the cheapest ways to add them.

## 5. Method mix per archetype

Order follows Merrill (problem, activate, demonstrate, apply, integrate) and climbs ICAP (passive to constructive; interactive where a cohort or partner exists). Minutes are for the desk session; the phone form keeps the first two and the last item.

| Archetype | Core sequence (minutes) | Add | Optional | Avoid | Laurillard balance (approx.) |
|---|---|---|---|---|---|
| **A One-object** (F1.1, F1.25) | Slow looking (5) → prediction (2) → worked reading: the Historian's autopsy, all layers tagged (8) → faded practice: second object half-read (8) → self-explanation on the reveal (2) → own autopsy into SRC (10) → partner test (3) | Comparison of two objects doing the same job (tablet and khipu; buckle and a second casting) | Process video or reconstruction clip; a short making demo | Long scroll; branching; role-play | inquiry 35, practice 35, production 20, acquisition 10 |
| **B World chapter** (F1.6–F1.12, 9a, 12a) | Prediction on the map (2) → scrollytelling walk with that chapter's device (20–25) → comparison wall (8) → argued card, solo or cohort controversy (5) → Rebuild placement (3) → reference note (8) | Virtual tour to holder or community pages; audio walk as the phone form; source reading on "how this world is usually told" | Making demo only for non-restricted techniques (Haya smelt watched, not made) | Role-play of living communities; any game on sacred or coerced material; a second scrollytelling in the same unit | acquisition 40, inquiry 35, practice 15, production 10 |
| **C Network** (F1.10, F1.13, F1.14) | Prediction on the globe (2) → time-lapse walk (8) → sandbox: carry an object or route tracer (12) → graph: Connect Two Things, challenge an edge (8) → data story on volumes, with who counted (5) → own route into SRC (8) | Controversy (routes made objects, or objects made routes?); counterfactual one-variable test (F1.14 copies) | Audio walk of a route | Simulating the movement of enslaved or forced people; people drawn as goods | practice 35, inquiry 35, acquisition 20, production 10 |
| **D Recurrence** (F1.5, F1.30) | Prediction placed on parallel rows (3) → chronology building with ranges (10) → short cards per recurrence (10) → sandbox: re-time in another calendar (10) → spaced retrieval set for the next visit (2) → three objects placed with ranges into SRC (8) | Counterfactual (remove one origin; does the recurrence still happen?); data story on dating uncertainty | Audio explainer of one calendar | One canonical line drawn as fact; points for ranges | practice 45, acquisition 25, inquiry 20, production 10 |
| **E Thematic argument** (F1.3, F1.4, F1.15–F1.24) | Argument card with a prediction (3) → paired cases (12) → step-through of the chain or regime (8) → comparison or credit/driver overlay (10) → controversy, solo or cohort (6) → self-explanation (2) → two-sentence position or brief (8) | Primary-source reading (catalogues, edicts, labels); data story where quantity is the argument (F1.19, F1.21, F1.22) | Branching or role-play for regimes only (commissioner, counters, protocol briefer) | Role-play or branching on war, displacement or coerced labour (F1.19a, F1.23, F1.13 people layer) | inquiry 35, discussion 20, acquisition 20, practice 15, production 10 |
| **F Method** (F1.2, F1.26, F1.28, F1.28a, F1.30a) | Problem or prediction first (3) → worked example of the method (8) → faded practice in the tool: sort, grader, log, rule card (15) → self-explanation (2) → partner test (5) → peer check if a cohort exists (5) → export (7) | Deduction-game batch for grading or dating; collaborative annotation of a primary text; making (F1.28a); counterfactual (F1.30a) | Case pairs from the briefer's world | Passive acquisition blocks; untagged reconstructions | practice 45, inquiry 25, production 20, discussion 10 |
| **G Mastery research** (F1.27, F1.29, F1.31) | Two worked cases of the finished product (10) → project brief and plan (10) → field work: archive, oral history or making (off-platform) → Lineage authoring (portfolio) → peer critique → partner test | Graph authoring in the Atlas; local field visit (F1.31) | Collaborative annotation of the community's own sources, with consent | Games of any kind; scrollytelling as the main surface | production 45, inquiry 30, collaboration 15, discussion 10 |

**Two cross-cutting rules carried from the earlier notes.** Guess before reveal wherever a fact is shown; export wherever a judgement is made. Add a third from this pass: **every unit ends with one recall item that comes back on the learner's next visit** (spaced retrieval is the cheapest strong-evidence method F1 does not yet use).

## 6. Per-unit recommendations

"Forms now" is the spec's Forms row. "Add" lists the methods (by id, see section 3) with the best evidence-to-cost ratio for that unit. Sensitive units carry their restriction.

| Unit | Arch. | Forms now | Lab now (method it already is) | Add |
|---|---|---|---|---|
| F1.1 One object, three readings | A | 3 | Three lenses (obl + worked) | `selfexp` on the seen/recorded/guessed sort; `compare` tablet vs khipu as two accounts; `retrieval` of the three readings next visit |
| F1.2 Reference-to-appropriation plane | F | 15, 3 | The plane (sort + cohort heatmap) | `sac` on the two cards the cohort split on; `case` pairs; `selfexp` per placement |
| F1.3 How histories get written | E | 13, 11 | Timeline scrub, "the canonical line" | `chrono` (build your own line, then compare with Vasari's); `dbq` on one canon-maker's text; `annotate` |
| F1.4 Interdisciplinary discourse | E | 10, 7, 8 | Comparison wall | `audio` and `video` as primary sources, not explainers; `oral` (a performer or musician on method) |
| F1.5 Recurrences | D | 15, 11, 1, 13, 3 | Simultaneity view | `retrieval` spaced; `counterfactual` (remove one origin); `datastory` on dating confidence |
| F1.6 Africa, metallurgy | B | 3, 10, 12, 13, 15 | Nine-step walk | `sac` on iron's invention (both readings sourced); `tour` to holder and Igun Street sources; `retrieval`. 1897 content note first; no game on looted objects |
| F1.7 Americas, fibre | B | 3, 10, 15, 12, 11 | Technique-layer wall (compare) | `making` (ply and knot remake; the reading cannot be remade); `obl` on one cloth |
| F1.8 East Asia, workshop | B | 15, 3, 10, 12 | Chain of Hands (step-through) | `worked` (read Song Yingxing's stages, then a second object faded); `comics` of the hands; `tour` |
| F1.9 South and Southeast Asia, cotton | B | 10, 3 | Made at / found at wall | `dbq` (holder's words vs findspot); `chrono` map placement |
| F1.9a West Asia before Islam, the account | B | 15, 4, 3, 12 | Account Reader (dbq) | `worked` then faded across the five records; `annotate`; `deduction` (who appears only as a number) |
| F1.10 Islamic world, routes and waqf | B/C | 12, 3 | Two Routes (map) | `sim` (route cost by season, ORBIS-style); `datastory`; `chrono` |
| F1.11 Europe, the guild | B | 10, 3 | Rule wall (compare) | `dbq` on the *Livre des métiers*; `annotate`; `roleplay` as guild examiner (an office) |
| F1.12 Australia and the Pacific, navigation | B | 3, 15, 13, 10, 12, 11 | Country and record wall | `sac` on Madjedbebe only from published readings; `oral` only if community-authored; `tour` to community-published pages. No making or role-play of restricted knowledge |
| F1.12a Steppe, the horse | B | 15, 4, 12, 3, 11 | Horse Reader (dbq) | `chrono` with contested ranges; `sac` on where the horse story begins |
| F1.13 Networks | C | 12, 15, 3, 4 | Route Tracer (sim + graph) | `graph` (challenge an edge); `datastory`; `audio` walk. People layer read, never simulated |
| F1.14 Copying, transfer, counterfeit | C | 5, 3 | Three layers slider (compare) | `deduction` (copy or original?); `counterfactual`; `sac` |
| F1.15 Ornament; the exhibition as taxonomy | E | 3, 10 | Pattern Comparer (predict + compare) | `dbq` on the exhibition catalogue; `selfexp` on related / not related |
| F1.16 Ritual and belief | E | 3, 8 | Driver overlay | `case` pairs; `obl`. No making, game or role-play of rites; sacred material excluded by default |
| F1.17 Who commissions | E | 2, 13, 3, 8 | Commissioning chain (step-through) | `case` (decision cases per regime); `roleplay` as commissioner; `branching` |
| F1.18 Textiles and "women's work" | E | 3, 7 | — | `making` (a weave sample); `oral`; `obl`; credit map from F1.23 |
| F1.19 Industry, the machine | E | 1, 3 | Process split | `sim` (which steps the machine takes); `datastory`; `video` of the process |
| F1.19a War, crisis and making | E | 1, 12 | Crisis ledger (map) | `dbq` on propaganda and rationing documents; `case`. No role-play or branching on displacement |
| F1.19b The designer | E | 13, 3, 12 | Lineage map (graph) | `graph` authoring; `dbq` on curricula; `peer` |
| F1.20 Modernisms, plural | E | 10, 13 | Comparison wall | `graph` (movement ripple); `sac` |
| F1.21 Consumer society, the platform | E | 1, 7 | Five counters (scroll) | `branching` (the maker at each counter); `roleplay`; `datastory` |
| F1.22 Making as extraction | E | 12, 4 | Chain explorer (sim) | `datastory`; `pbl` (the learner's own object) |
| F1.22a Use and consumption | E | 3, 5 | Use-life scrub (compare) | `obl`; `oral` (owners and repairers) |
| F1.23 Obscured labour: credit map | E | 3, 4 | Credit map | `deduction` (whose name is this?); `peer` review of credit maps; `case`. Coerced makers read, never played |
| F1.24 The museum as author | E | 13, 3 | Provenance query | `worked` provenance reading then faded; `deduction`; `sac` on restitution; `annotate` museum labels |
| F1.25 Reading an object: autopsy | A | 15, 1, 4, 3, 14, 12, 11 | Object Autopsy, reading mode (worked) | `selfexp` on re-tagging; `retrieval`; `compare` (B and C objects) |
| F1.26 Attribution and consultation protocol | F | 15, 2, 3, 10 | Protocol Builder (step-through) | `case`; `roleplay` as briefer; `peer` |
| F1.27 Counter-history research piece | G | 4, 13, 3, 12, 11 | Atlas authoring (graph) | `pbl`; `peer`; `portfolio` |
| F1.28 Primary sources and archives | F | 15, 4, 5, 3 | Source Grader (dbq) | `worked` then faded; `annotate`; `deduction` batch grading |
| F1.28a Reconstruction | F | 15, 2, 3, 13 | Reconstruction Log (making) | `video` of holder demonstrations; `socratic` (Fabricator) already present |
| F1.29 Vernacular intelligence: oral history | G | 2, 3, 8, 10, 13 | Oral History Kit (oral) | `peer` review of consent records; `stepthrough` of the kit |
| F1.30 Re-timing the Atlas | D | 15, 4, 11, 3 | Calendars (sim) | `chrono`; `retrieval` |
| F1.30a Counterfactual history | F | 1, 13 | Rule Card and branch view (counterfactual) | `socratic` (Stranger) already present; `peer` |
| F1.31 Regional slot | G | 4, 10, 12, 13 | Slot Builder (pbl) | `oral`; `tour` (local); `peer` |

**The Edo unit against this catalogue.** Edo already uses scrollytelling, prediction, placement (Rebuild), comparison (three Waves), deduction (the seal desks), sandbox (Print the Wave, editions), the solo argued card and the Cast cards. It lacks four cheap, well-evidenced methods: an explicit **worked example then fading** at the desks (read one sheet with the Historian, then two half-read, then one alone); **self-explanation** after each reveal (one tap among reasons); **spaced retrieval** when the learner returns (three cards from the coda); and **portfolio** export beyond the Atlas hand-off (one sourced Lineage edge of the learner's own).

## 7. Methods by content type

| Content type in F1 | Best methods (in order) | Why |
|---|---|---|
| A single object with a record | obl → predict → worked → selfexp | Seeing vs recorded vs guessed is a reading skill: model it, then fade it |
| Two or more objects that look alike | compare → selfexp → sac | Contrasting cases before telling; similarities first |
| A route, trade or network | scrolly (time-lapse) → sim → graph → datastory | The argument is spatial and relational |
| Dates, ranges, periods, calendars | predict → chrono → retrieval → sim (re-time) | Placement is retrieval; ranges need drawing, not points |
| A contested claim with two sourced readings | sac (or solo argued card) → dbq | Controversy beats debate and solo work; multiple texts beat one |
| A process or technique | stepthrough → video → making (where allowed) | Sequence plus hands; tacit gaps show only when remade |
| An institution, regime or commission | case pairs → stepthrough → roleplay (office) | Decisions under constraint; the office, not a victim |
| A quantity (survivors, volumes, extraction) | datastory → predict | Who counted is part of the fact |
| A primary text (contract, edict, catalogue, memoir) | dbq → worked → annotate | Sourcing and corroboration need modelling |
| Coerced, enslaved or indentured labour; the Yoshiwara | scrolly text with content note → dbq → solo argued card | Read, not played: no prediction, game, role-play, branching, comics depiction or simulation |
| Sacred, restricted or community-held knowledge | community-published sources → oral (community-authored only) | Exclusion by default; consultation overrides all |
| The learner's own object, lineage or place | portfolio → pbl → peer → socratic | Production with critique |

## 8. Sensitivity rules by method

- **Yoshiwara and any coerced labour (Edo b2-3; F1.13 people layer; F1.19a; F1.23):** allowed methods are scrollytelling text with a content note first, primary-source reading (the contract read clause by clause), the solo argued card with two scholarly readings, audio without dramatisation, and annotation in a moderated layer. Ruled out: prediction prompts about the women's terms or outcomes, role-play, branching, simulation, deduction games, comics or sequential drawings of the women, any collection or score.
- **Shunga:** named only. Excluded from object-based looking, comparison walls, annotation corpora, data stories and every image-led method.
- **Historical people:** no AI partner speaks as a historical person; partners keep declared agendas (Historian, Mirror, Fabricator, Stranger).
- **Reconstructions:** always labelled "Reconstruction, an interpretation"; toxic materials, live animals and sacred techniques excluded (F1.28a).
- **Counterfactuals:** atrocity is never the variable (F1.30a).

## 9. Zero-cost production notes

| Cost | Methods | What it takes at zero cost |
|---|---|---|
| S (hours per unit; reuses existing instruments) | stepthrough, audio, case, worked, obl, dbq, predict, compare, sac, tour, retrieval, selfexp, portfolio, counterfactual, annotate | Writing plus the existing Edo components (guess wrapper, argued card, viewer, Rebuild). Audio by checked text-to-speech under the programme's AI rule. Annotation via Hypothesis (free; needs learner accounts). |
| M (days per unit; new component or cohort) | scrolly, chrono, graph, socratic, roleplay, branching, deduction, making, oral, pbl, peer, comics, datastory | Scrollytelling and placement already exist in the Edo build and generalise. Branching can be authored in Twine or inkle's ink; the partner voices need model inference, which strains the zero-cost rule (a fallback written test is required). Comics need our own drawings (no generated historical images). Peer review needs a cohort and moderation. |
| L (weeks; specialised build or footage) | video, sim | Video: link to holder-made films where licences allow; make only silent animated processes. Simulations: one per archetype C/D unit, built as intrinsically integrated instruments (the mechanic is the historian's practice). |

**Licence flags for the build (code must be MIT, BSD, ISC or Apache):** inkle's ink is MIT; Mirador and OpenSeadragon are permissive; Twine itself is GPL-3 (fine as an authoring tool, check the story format before bundling its output); TimelineJS is MPL-2.0 and Orbit's licence was not checked, so neither should be bundled without review. These licence statements are recalled, not verified this session, apart from those already in the build.

## 10. Gaps and uncertain claims

- **Domain gap.** Almost no controlled study tests these methods with adult, self-paced, design-history learners. Comparison, concept mapping, worked examples, retrieval and simulation evidence comes mostly from STEM, health and school history.
- **Weak-evidence methods that F1 relies on.** Object-based learning and slow looking (the module's signature) have practice wisdom and qualitative support, not effect sizes. The nearest experimental evidence is one museum visit, with small effects. Worth instrumenting: delayed recall and transfer for units that open with slow looking against units that do not.
- **Unverified figures.** Fiorella & Mayer's per-strategy effect sizes; licences of TimelineJS and Orbit; the Hokusai Manga exemplar link is a Met search page, not a record.
- **AI tutor evidence is moving fast** (2025–26 RCTs disagree); the guardrail design (hints before answers, a test at the end, no answers given) is what the evidence supports, not AI tutoring as such.
- **Not retrieved:** case-based learning reviews outside health professions; evidence on timelines specifically for adult chronology; virtual field-trip trials; portfolio or learning-journal meta-analyses; Mission US's 2025 efficacy effect sizes (study listed, numbers not given on the page).

# Exemplar study: one worked example, a macro view, or both

Status: complete for this pass, 25 October 2026. Prepared for the course owner's question on decision P5 (Salt Road as the program's worked exemplar).

Evidence labels used throughout:

- **Documented**: stated in a source I name, or in a file in this repository.
- **Probable**: inferred from documented evidence, with reasons given.
- **Contested**: the literature or the record disagrees.
- **Argued**: my own judgment for this program; open to challenge.

No URLs are composed here. Sources are named by author, title and year; where a repository file is the source, its path is given.

## 0. In short

- **The two directions are not rivals.** The learning science asks for a worked example first, then varied cases set side by side (Collins, Brown and Newman's "increasing diversity"; Paas and van Merriënboer 1994; Gentner et al. 2003; Alfieri et al. 2013). One exemplar alone teaches fast and narrowly and gets copied; many examples alone give fragments.
- **Recommended: a layered design.** Keep **one fully worked spine** (Salt Road, because the spine must be built forwards and fed to the engines, which a real world cannot be) but **give it a researched lineage**; add **one historical twin** worked fully in M2 (the Bauhaus); build a **field atlas** from a **fixed cast of eight real worlds**, three to five per Concept DNA field, as a view of the existing Atlas; **open every module with history** from its lead world in the cast; let the **regional slot** add a regional world to each module's atlas pages; use living brands **as text only**.
- **The three strongest real candidates:** the Bauhaus, *The Nutcracker*, the Sydney Opera House. Reserves: Morris & Co. and *One Thousand and One Nights*.
- **Main limits:** no regional recognition data exist (a ten-minute tester check fixes that); the Bauhaus's best images are link-only; the atlas must stay small and recurring or it fragments; the living-brand rule needs a legal review, because the UAE teaching exception does not cover a paid course.

The course owner's challenge, in his terms: Salt Road (a fictional coastal salt cooperative, chosen as the program's worked exemplar under decision P5) is not internationally known; teaching from one narrow example may lose the **macro view**, in which the relevant examples come from the relevant worlds; "we need one fully worked example, but perhaps we are forgetting the macro perspective as well"; and every subject should open with histories, lineages and stories.

This study asks three things: what one fully worked example gives and costs; what a macro view across many worlds gives and costs; and how the two fit together. It ends with a recommendation and the three strongest exemplar candidates.

## 1. What the program has already decided, and why (documented in the repository)

| Item | What it says | Where |
|---|---|---|
| Hub A5 | "The exemplar world the method is taught on: invented, or something of yours?" Answer applied: "Invented, so it can be wrong in public and revised; yours as a second, real case later" | `docs/02-program/hub/index.md` |
| P4, P5 | Three fictional seed worlds (Salt Road, Night Library, Second Skin); Salt Road as the worked exemplar "because it touches F1 most directly"; option C (a real brand or institution) rejected for "intellectual-property and consent problems; the program cannot vouch for it" | `docs/02-program/phase-4-foundations/index.md`, Item 4 |
| Principle 4 | The Concept DNA is the through-line; it grows each unit, is tested each module, defended at the end | `docs/01-structure/final-structure-v3/index.md` |
| Frameworks | "cognitive apprenticeship (worked exemplar, then the learner's own)"; threshold concepts include "a concept is a generative system", "the collection precedes the object", "history is a web" | same, Frameworks and threshold concepts |
| Program asset | "The exemplar Concept DNA and three seed worlds … Now, before M2"; Method research needs "exemplar grammars and collection logic; the program's worked world", read from "public brand and design-system guidelines, game bibles and pattern languages" | same, Research plan and program-produced assets |
| Schema | `learner_world.kind` is `own` or `seed`; `seed` is an enum of the three fictional worlds. A real world cannot be entered as a seed without a schema change | `schema/concept-dna.schema.json` |
| Licence switch | Six licence classes; one dataset makes an open build and a **commercial build**; in the commercial build PERMISSION-NC items are link-only; "no generated images of historical objects, people or places" | `schema/licence-classes.json` |
| Ballet review | *Giselle* as a second exemplar was proposed and withdrawn: it would conflict with P5 and the schema, and "a finished, famous work read backwards into DNA fields teaches that a DNA describes a finished work"; recommended *Giselle* read field by field **beside** Salt Road in M2 | `../REVIEW.md` §6, `../review/R1_curriculum_fit.md` |
| Ballet benchmarks | Decision 1 already argued for a historical exemplar paired with a contemporary one, on the comparison evidence (Gentner et al. 2003; Alfieri et al. 2013) | `BENCHMARKS.md` Decision 1 |
| Ballet field map | W4 Part 5 already maps every Concept DNA field to a ballet theory, a document and a prompt, across many works: in effect a one-art "field atlas" | `../works/W4_theories_of_concept_and_process.md` Part 5 |
| Ballet motifs | 24 cross-work motifs (two worlds, the white act, the remake, folk as national idiom…), each with a comparison wall of 6–10 works across three centuries and three regions | `../repertory/CENSUS.md` §4 |

**Reading [argued].** The program did not forget the macro view by accident; it chose a fictional exemplar for two stated reasons (it can be wrong in public; no rights or consent problem) and deferred the real case ("yours as a second, real case later"). What is missing is not a decision against breadth but a **container** for breadth on the Method side: F1 has the Atlas and the world set, ballet has motif walls and a field map, but nothing yet puts several real worlds beside the exemplar field by field. The owner's challenge lands exactly on that gap.

## 2. The evidence

Findings already logged in this folder are cited, not repeated (`../works/S_structure_study.md` §1 and logs; `BENCHMARKS.md` L1–L3). New findings from this pass carry their source; "seen" means the abstract, a publisher record or a faithful summary was read in this pass.

### 2.1 For one fully worked example

| Finding | Label | Source | Bearing on this program [argued] |
|---|---|---|---|
| Novices learn more from studying worked examples than from solving problems; the effect holds for recognising designers' styles, an ill-defined visual task | Documented | Sweller and Cooper 1985; Rourke and Sweller 2009, *Learning and Instruction* 19 (logged in `S_structure_study.md` Log 4) | A learner who has never written a Concept DNA should see one written, field by field, before writing their own |
| Examples teach best when learners **self-explain** them; most learners self-explain passively unless prompted; examples should highlight structural features and show the reasoning, not only the result | Documented | Chi, Bassok, Lewis, Reimann and Glaser 1989, *Cognitive Science* 13(2); Renkl 1997, *Cognitive Science* 21(1); Renkl 2014, in Mayer (ed.), *Cambridge Handbook of Multimedia Learning*, 2nd ed., 391–412 (as summarised in the Wikipedia "Worked-example effect" article, seen) | A filled field is the answer key. The exemplar must show *why* each entry was written, and the learner must be asked to explain an entry before writing their own |
| **Fading**: removing worked steps one at a time moves learners from examples to their own problems better than an abrupt switch | Documented | Renkl, Atkinson and Maier 2000 (CogSci); Renkl, Atkinson and Große 2004, *Instructional Science* 32 | The exemplar should not stay fully worked all program long: worked in M2, partly worked in M3–M4, a prompt only in the areas |
| **Expertise reversal**: worked examples lose value, and can hurt, as learners gain knowledge | Documented; less universal than first claimed | Kalyuga, Ayres, Chandler and Sweller 2003, *Educational Psychologist* 38(1); Nievelstein et al. 2013 found benefits for advanced law students on ill-structured tasks | Amara and Mei (practising) need less of the exemplar than Omar (graduate); the depth dials can carry this |
| **Cognitive apprenticeship**: modelling, coaching, scaffolding and fading, articulation, reflection, exploration; sequenced by **increasing complexity, increasing diversity, and global before local skills** | Documented (framework; the sequencing labels seen in a course summary; definitions not read at source this pass) | Collins, Brown and Newman 1989, "Cognitive apprenticeship: teaching the crafts of reading, writing and mathematics", in Resnick (ed.), *Knowing, Learning and Instruction* | The program cites cognitive apprenticeship as "worked exemplar, then the learner's own". The framework itself asks for **increasing diversity** of cases, not one case: the modelled exemplar is the start of the sequence, not all of it |
| Depth beats breadth in a large observational study: students whose high-school science spent a month or more on one topic earned higher college grades than those who covered every topic | Documented (observational, 8,310 students; controlled for background) | Schwartz, Sadler, Sonnert and Tai 2009, *Science Education* (ScienceDaily release, March 2009, seen) | Supports a spine studied deeply. It compares depth on *a topic*, not one example against many; it is indirect here |

### 2.2 For many varied examples (the macro view)

| Finding | Label | Source | Bearing [argued] |
|---|---|---|---|
| Comparing two cases doubles transfer over studying the same cases separately; separate study can equal no training | Documented | Gentner, Loewenstein and Thompson 2003; Loewenstein, Thompson and Gentner 2003 (logged in `BENCHMARKS.md` L1) | The macro view only works if worlds are **set side by side and compared**, not shown one after another |
| Across 57 experiments, case comparison beats single-case and sequential study, d = 0.50; larger when learners look for similarities and the principle is given **after** the comparison | Documented | Alfieri, Nokes-Malach and Schunn 2013, *Educational Psychologist* 48(2) (L1) | The field atlas should ask "what do these worlds share in this field?" and name the principle afterwards |
| Contrasting cases prepare learners for later telling; analysing cases twice without new telling is weak | Documented | Schwartz and Bransford 1998 (L1) | A contrast set placed before the exemplar's explanation of a field makes the explanation land |
| Variation theory: to discern an aspect the learner must see it vary against a background that stays the same; then generalise across instances | Documented (mostly small quasi-experiments) | Marton and Pang 2006; Kullberg, Runesson Kempe and Marton 2017 (L3) | **Hold the field constant and vary the world** (the atlas), or **hold the world constant and vary the field** (the spine). Both are variation designs; they teach different things |
| **High-variability worked examples** transferred better than low-variability ones, and did so when cognitive load was low (worked examples), not when learners were problem-solving | Documented (the finding as summarised; the paper's own abstract not read this pass) | Paas and van Merriënboer 1994, *Journal of Educational Psychology* 86(1), 122–133 | Variety helps **after** the learner has a worked scaffold, and hurts if piled on top of open problem-solving. This is the strongest single argument for "spine first, atlas beside it" |
| Low-variability input is learned fast and generalises poorly; variable input is slower and generalises better | Documented | Raviv, Lupyan and Green 2022 (L3) | One exemplar alone makes a fast, vivid, narrow idea of what a world is |
| Ill-structured domains need multiple cases and perspectives ("criss-crossing the landscape"); early simplification produces reductive biases (additivity, discreteness, compartmentalisation) | Documented (theory; evidence mainly from medical and literary hypertext studies) | Spiro, Feltovich, Jacobson and Coulson 1991/1996; summarised in EduTech Wiki "Cognitive flexibility hypertext" (seen) | World-building is ill-structured. A single exemplar risks teaching that every field has one right shape |
| Interleaving helps tell visual styles apart (paintings g = 0.67) but not expository argument | Documented | Brunmair and Richter 2019 (`S_structure_study.md` Log 2) | Interleave worlds when the learner is learning to **see** a grammar; block when they are learning an **argument** |
| 4C/ID: whole learning tasks in task classes, with **variability across tasks** and support that is heavy at the start of a class and gone by its end | Documented (model; summary seen) | van Merriënboer 1997; van Merriënboer and Kirschner, *Ten Steps to Complex Learning*; EduTech Wiki "4C/ID" (seen) | The program's whole-task model already exists (the DNA); 4C/ID says to vary the worlds the learner works through as support fades |

### 2.3 Against copying: what a single exemplar costs designers

| Finding | Label | Source | Bearing [argued] |
|---|---|---|---|
| **Design fixation**: engineering students shown one example solution reproduced its features, including obvious flaws | Documented (classic; summarised in a TU Delft thesis chapter, seen) | Jansson and Smith 1991, *Design Studies* 12(1) | A single fully worked world becomes the template learners copy. Salt Road's cooperative, its salt and its route would reappear in learners' worlds |
| A **familiar** example caused **more** fixation than an unfamiliar one | Documented (abstract seen) | Viswanathan, Tomko and Linsey 2016, *AI EDAM* 30(2), 171–184 | Recognition cuts both ways: a famous exemplar (Disney, LEGO, *The Nutcracker*) is easier to read and harder to get away from |
| Results on examples are mixed: in 25 comparable studies, 14 manipulated variables, wide variation in methods and outcomes | Documented (abstract seen) | Vasconcelos and Crilly 2016, "Inspiration and fixation", *Design Studies* 42 | Examples are not simply good or bad for design; their number, distance, timing and framing matter |
| Examples can inspire as well as fixate; a meta-analysis weighs both | Probable (title and venue seen; findings not read at source this pass) | Sio, Kotovsky and Cagan 2015, "Fixation or inspiration? A meta-analytic review of the role of examples on design processes", *Design Studies* 39 | Treat the moderators as the design brief for the atlas: several distant examples, shown with the instruction to extract the principle |

### 2.4 Fictional and real exemplars

No study was found that compares a fictional with a real **exemplar world** in design education. The nearest evidence:

| Finding | Label | Source | Bearing [argued] |
|---|---|---|---|
| Generic (abstract) instantiations transferred to a new situation; concrete, familiar instantiations did not, and starting concrete did not help | Documented for maths; contested in reach | Kaminski, Sloutsky and Heckler 2008, *Science* 320 (BPS Research Digest summary, seen); concreteness fading (Fyfe, McNeil, Son and Goldstone 2014, *Educational Psychology Review* 26) argues for moving from concrete to abstract instead | A plain fictional exemplar, built for its structure, may transfer better than a vivid real one. But the learner here must later handle real, vivid worlds; concreteness fading (real worlds first, the abstract field after) fits the program's "history first" request |
| Interesting but irrelevant details carry a small-to-medium cost to learning in the laboratory; in a large classroom trial they did no harm and were remembered | Documented | Rey 2012 meta-analysis (as cited); Maloy, Fries, Laski and Ramirez 2019, *CBE—Life Sciences Education* 18(3), N = 754 (seen) | A real world's famous stories are memorable hooks, but every story beyond the field being taught competes with it. Real exemplars need tighter editing than invented ones |
| Fictional shared worlds across a curriculum (Ardcalloch in law; virtual families in nursing and medicine) are liked and help learners link modules; outcome evidence is weak | Documented (levels 1–2) | `BENCHMARKS.md` L1 | The fictional-world pattern is established in professional education; its benefit is coherence, not recognition |

### 2.5 How design schools teach from many precedents

| Practice | Label | Source | Bearing [argued] |
|---|---|---|---|
| **Precedent analysis** with one fixed set of diagrams across many buildings: Clark and Pause analyse **118 buildings by 38 architects** through the same eleven issues (structure, natural light, massing, plan to section, circulation to use-space, unit to whole, repetitive to unique, symmetry and balance, geometry, additive and subtractive, hierarchy) and aim at "the development of theory to generate ideas with which to design architecture" | Documented (front matter of the 4th edition, Wiley 2012, seen) | Clark and Pause, *Precedents in Architecture* | The exact shape of a field atlas: the **fields** are fixed (the Concept DNA), the **worlds** vary, and every world is drawn in the same notation so they can be compared |
| Precedent knowledge is part of design expertise; experts hold libraries of precedents and "gambits" | Probable (not read at source this pass) | Lawson 2004, "Schemata, gambits and precedent", *Design Studies* 25(5); Lawson, *What Designers Know* (2004); Oxman 1994, "Precedents in design", *Design Studies* 15(2) | The macro view is not a teaching trick; it is what a professional's head contains |
| Case libraries work when every case has one template and is indexed by the issues met | Probable | Kolodner et al. (`S_structure_study.md` Log 2) | Index every world in the atlas by Concept DNA field |
| A pattern language: 253 patterns, each a problem, a context and a solution, cross-referenced | Probable (working knowledge) | Alexander, Ishikawa and Silverstein, *A Pattern Language* (1977) | A second model for the atlas: entries by **move** ("the anchor that funds the repertory"), not by world |
| Recurring problems in design studio (the nine-square grid at Texas and Cooper Union) return transformed at a higher level | Documented | `BENCHMARKS.md` L1 | Design education's own spine is a problem that returns, not a world described once |

### 2.6 What the evidence adds up to [argued]

1. The worked example and the macro view are **not rivals in the literature**. Cognitive apprenticeship asks for a modelled case and then increasing diversity; Paas and van Merriënboer found variability helps once learners have worked examples; Alfieri and Gentner found that comparison, not exposure, produces transfer.
2. Each alone fails in a known way. **One exemplar alone** gives fast, narrow learning and invites copying (Raviv; Jansson and Smith). **Many examples alone**, seen one after another, give vivid fragments that do not transfer (Loewenstein: separate cases equal no training) and overload novices with no scaffold (Kirschner; Paas).
3. So the design question is not "one or many" but **which thing is held constant while the other varies**, and **when** each is shown: the spine first, to scaffold; the contrasts beside it, field by field; the principle named after the comparison; support faded as the learner's own world takes over.

## 3. Direction 1: one fully worked example. Sixteen candidates assessed

### 3.1 Criteria

Each candidate was read against the owner's list plus two criteria the evidence in §2 adds:

- **Recognition** worldwide, in the Gulf and MENA, and in Asia. **No survey of recognition by region was found for any candidate**; ratings below rest on proxies (performance counts, operating presence, translations, adaptations) and are marked probable or argued. A ten-minute recognition check with the phase-5 testers would replace them with data (§6).
- **Documentation and open images**, read against the licence switch: what can be **hosted in the commercial build** (PD-CC0, NATIONAL-OPEN, ATTRIBUTION, OWN) and what is **link-only**.
- **Rights and permission risk** in a paid course. Two documented facts frame this. The UAE copyright law's teaching exception (Federal Decree-Law 38 of 2021, art. 22(8)) covers short extracts only where "the copying entity must not seek profit" and no licence is reasonably obtainable, so **a paid course cannot rely on it**; quotation for criticism with attribution (art. 22(5)) remains. UAE term is life plus 50 (art. 20(1)); the EU's is life plus 70; the program sells worldwide, so the stricter term governs what is hosted [documented: AGIP English text of the decree, seen]. The program's own rule bars generated images of historical objects, people or places (Q32, `schema/licence-classes.json`).
- **Fit with every Concept DNA field** named by the owner (premise, perimeter, rules, anti-DNA, obligations, collection map, anchor, adjacent translation, rights and money, handover, lifecycle, grammars, sources).
- **Prospective documents** [argued criterion]: does the world leave documents written *before* its outcome (a manifesto, a brief, a competition programme, a scenario, a set of principles)? With them, a real world can be walked **forwards in making order**, which answers the R1 reviewer's objection that a finished work "read backwards into DNA fields teaches that a DNA describes a finished work".
- **History and lineage**, **cultural risk**, and **both lanes** (can it model the Maker's work *and* the Briefer's: a brief, a judged set, a commission?).
- **Fixation risk**: familiar examples fixate more (Viswanathan et al. 2016, §2.3).

### 3.2 Summary table

H high, M medium, L low. Rights risk is for the **commercial build**. "Fields" counts the thirteen owner-named fields with documented material (S) for each; the matrix in §3.4 gives them one by one for the front-runners.

| # | Candidate | Kind | Recognition: world / Gulf-MENA / Asia | Open images (commercial build) | Rights risk | Fields strong (of 13) | Prospective documents | Both lanes | Cultural risk | Fixation risk |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Salt Road** | Fictional seed | none / none / none (by design) | OWN only, unlimited | None | 13 by construction, none by evidence | Written by us | Yes, by construction | Low (but invented heritage must not impersonate a real community) | Low (unknown); high once it is the only model |
| 2 | ***The Nutcracker*** | Public-domain story world → ballet → product economy | H / M–H / H | 1892 photographs, Hoffmann and Dumas texts, early editions: PD | Low for the core; high for named productions (Balanchine, Disney 2018) | 11 | Petipa's scenario plans (probable for this work); Vsevolozhsky's commissions | Yes (commission, licensing) | Medium: Christmas frame; "Coffee" (Arabian) and "Tea" (Chinese) dances as stereotypes | Medium–high |
| 3 | ***One Thousand and One Nights*** | Public-domain story world | H / H / H | Galland, Lane, Burton texts; 19th–early-20th-century illustrations: largely PD | Low (modern translations and Disney's *Aladdin* excepted) | 9 | None for the whole; the frame is its own rule | Maker yes; Briefer weak | High: Orientalism, the "Arabian" exotic, sexual content; regional heritage needs regional authority | Medium |
| 4 | **Sherlock Holmes** | Public-domain story world | H / M–H / H | Paget's *Strand* illustrations: PD | Low (US PD since 1 Jan 2023); estate trademark claims probable | 8 | Serial commission (probable) | Partly | Medium: colonial depictions (probable) | High |
| 5 | ***Alice*** | Public-domain story world | H / M / H | Carroll's manuscript and Tenniel: PD | Low (Disney 1951 excepted) | 7 | The manuscript gift book (probable) | Weak Briefer | Medium: Dodgson–Liddell readings contested | High |
| 6 | ***The Wizard of Oz*** | Public-domain story world | H (US) / L–M / M | Denslow 1900: PD | Medium: film elements protected (below) | 7 | None | Weak Briefer | Medium–high: Baum's 1890–91 editorials (probable) | High |
| 7 | **The Ballets Russes** (1909–29) | Historical creative world | M (specialist) / L / L–M | Bakst PD; Picasso, Goncharova, Larionov, Chanel, Cocteau in copyright in life+70 states; V&A charges for commercial use | Medium–high | 11 | Committee scenarios; Diaghilev's commissions | **Strong** (the impresario as briefer) | Medium–high: Orientalism; queer history must be told, not hidden | Low |
| 8 | **The Bauhaus** (1919–33 and diaspora) | Historical creative world | H (designers) M (public) / M / M–H | Klee, Kandinsky, Schlemmer, Moholy-Nagy PD in life+70 states; Gropius, Breuer, Albers, Bayer, Brandt, Wagenfeld in copyright; buildings via freedom of panorama | Medium; the name is a DIY retailer's trademark since 1960 | **13** | **Strong**: 1919 manifesto, 1923 programme, workshop contracts, three directors' briefs | **Strong** | Medium: Tel Aviv's "White City" is politically charged in the region; gender policy; 1933 | Medium |
| 9 | **Morris & Co. / Arts and Crafts** | Historical creative world | M (UK, US, designers) / L–M / M | Morris d. 1896: designs PD; large CC0 holdings (probable: Met, Art Institute of Chicago, Cooper Hewitt) | **Low**; "Morris & Co." is a live trademark (Sanderson) | 12 | **Strong**: the 1861 prospectus | Strong (commissions, the shop) | Low–medium | Low |
| 10 | **Japonisme** | Historical reception movement | M / L / H (Japan) | Ukiyo-e: CC0 widely | Low | 3 | None | No | High: a lesson in appropriation, not a model world | Low |
| 11 | **Disney** | Living brand world | H / H / H | None hostable; Steamboat Willie (1928) PD in US since 2024 | **High** | 13 | 1957 strategy chart (probable); Imagineering principles (probable) | Yes | Medium–high: *Aladdin* lyrics (below) | **Very high** |
| 12 | **LEGO** | Living brand world | H / H / H | None hostable | **High**: Fair Play policy | 12 | **Strong**: "10 LEGO characteristics" (1963) | Yes | Low | Very high |
| 13 | **IKEA** | Living brand world | H / H / H | None hostable | **High** | 11 | *Testament of a Furniture Dealer* (1976, probable) | Yes (the franchised concept) | Medium: the 2012 Saudi catalogue (below) | High |
| 14 | **Studio Ghibli** | Living film world | H / M–H (probable) / H | 2020 stills "freely within the scope of common sense"; profit use not addressed | Medium–high | 8 | Essays (in copyright) | Partly | Low–medium | High |
| 15 | **Palais Garnier** | Building and place | H / M / M–H | Building PD (Garnier d. 1898); Chagall's 1964 ceiling in copyright | Low (ceiling excepted) | 10 | **Strong**: the 1860–61 competition | **Strong** (competition, jury) | Low–medium: colonial copies of the type | Medium |
| 16 | **Sydney Opera House** | Building and place | H / H / H | Photographs under Australian freedom of panorama, many CC BY-SA; Utzon d. 2008, drawings in copyright | Medium; the Trust's image rules (probable) | 11 | **Strong**: 1955 "Brown Book" conditions, competition drawings, 1962 "Yellow Book", 2002 *Design Principles* | **Strong** (233-entry competition) | Low–medium: Bennelong Point is Gadigal country; an opportunity as much as a risk | Medium |

Also considered and placed only in the atlas: **the Alhambra** (recognition H everywhere and strongest in MENA; buildings PD; Owen Jones's plates already in the Assets register as AS-001; weak for briefer, collection, rights and money; Quranic inscriptions need care), and **Louvre Abu Dhabi** (a world built on a licensed name; living institution, images in copyright; a regional-slot case for local authors, not a program exemplar).

### 3.3 Candidate notes (history, lineage, documented facts, limits)

**1. Salt Road (fictional).** *For:* chosen so it "can be wrong in public and revised" (Hub A5); carries every field by construction; no rights, no consent, no living stakeholder; F1's heritage, labour and extraction land on its first page; and, decisively for the engines, **it may be generated**. The Stranger Lab, World Engine and Object Line will produce images, objects and briefs from the exemplar DNA; done with a real historical world, that breaks Q32 ("no generated images of historical objects, people or places") and manufactures fake Bauhaus lamps or fake Nutcracker productions [documented rule; argued consequence]. *Against:* nobody knows it; it has **no history of its own**, which collides with the owner's rule that every subject opens with histories, lineages and stories; every fact in it is our invention, so it can teach structure but not evidence; and as the **only** model it will be copied (Jansson and Smith 1991). *Fix that keeps it:* give Salt Road a **researched lineage** of real salt worlds, chosen for reach: the Salt March (1930, known across South Asia and worldwide), Saharan salt caravans to Timbuktu, Guérande's salt-workers and their cooperative, the community salt pans of Maras (Peru), the salt of Hormuz and the Gulf's sabkha. Each is a real precedent Salt Road's makers "studied", so the exemplar opens with history like every other subject [argued; all lineage facts to be verified before use; marked probable now].

**2. *The Nutcracker*.** *Lineage:* nutcracker figures in the Erzgebirge before the tale; Hoffmann's tale (1816); Dumas's French adaptation (1844); Vsevolozhsky's commission, Petipa's scenario, Ivanov's choreography and Tchaikovsky's score (St Petersburg, 1892); the Suite (1892); Disney's *Fantasia* (1940); Balanchine's New York production (1954) that made it an annual American ritual; *Barbie in the Nutcracker* (2001); Morris's *The Hard Nut* (1991) and Bourne's remake [documented in `../products/PRODUCTS_AND_COLLECTIONS.md` and `../works/`; some dates probable]. *For:* the most performed ballet in the world (Bachtrack 2024) [documented in `../repertory/CENSUS.md`]; it is a **world that became a product economy**: holiday runs are on average 48% of surveyed US companies' season revenue (Dance/USA, 2017 data) and about 45% of New York City Ballet's ticket revenue (NPR, 22 Dec 2025) [documented in repo]; the Bolshoi's *Nutcracker* is "a Dubai Opera tradition" [documented in `BENCHMARKS.md` L5]; the core (tale, score, 1892 production) is public domain; and the program has already done the research. *Against:* a performing and narrative world, weaker for space, object and digital fields; credit is diffuse (no single concept holder); the Christmas frame; the national dances' stereotypes. The last is also a lesson: since 2017 many companies have redesigned "Tea" under the Final Bow for Yellowface pledge [documented in repo], and "Coffee" is the Arab world as Europe pictured it, which Gulf learners will read differently from Europeans (R2's lesson 10, "the same world is read differently by different audiences").

**3. *One Thousand and One Nights*.** *Lineage:* a frame tale with Persian, Indian and Arabic layers (probable); Galland's French *Mille et une nuits* (1704–17); Hanna Diyab, a Maronite storyteller from Aleppo, met Galland in Paris on 17 March 1709 and told him "Aladdin" and "Ali Baba", among others; Galland's diary calls him "Hanna from Aleppo" and his published volumes do not credit him; Diyab's own memoir (1763, Vatican MS Sbath 254) was published in French in 2015 and English in 2021; Horta and Bottigheimer argue he should be read as an author of those tales [documented: Wikipedia "Hanna Diyab", seen]. Then Lane and Burton in English; Rimsky-Korsakov's *Scheherazade* (1888); the Ballets Russes' *Schéhérazade* (1910, in `../repertory/register.yaml`); Disney's *Aladdin* (1992), whose opening lyric was changed after protest by the American-Arab Anti-Discrimination Committee (Disney agreed to change two lines; July 1993) [documented: NCAC wiki, seen]. *For:* recognition is high everywhere and strongest in the Gulf and MENA; the texts are public domain; it is the best credit story the program could tell (the source unnamed for three centuries) and the frame is a literal **collection map**: a world that admits stories under one rule. *Against:* a story world with no documented maker, so weak for obligations, handover and the Briefer lane; Orientalism runs through its European life; it is regional heritage, and principle 11 and F1.31 assign the regional slot to **local authors**. It belongs in the atlas with regional authority, not as a spine written by the program.

**4. Sherlock Holmes.** All Holmes stories entered the US public domain on 1 January 2023; *Klinger v. Conan Doyle Estate* (7th Cir. 2014) held that characters in public-domain stories are free, and later stories protect only their own "increment of expression" [documented: Wikipedia, seen]. A clean rights lesson and a strong verbal and narrative grammar; recognition is very high in Japan (probable). Weak for space, object and handover; high fixation (the deerstalker, which came from the illustrator, not the text: probable).

**5. *Alice*** and **6. *The Wizard of Oz*.** Both public domain at source, both with a famous protected film version. *Warner Bros. v. X One X Productions* (8th Cir. 2011) held that publicity photographs of the 1939 film were public domain, yet products tying them to the film's characters infringed the film's added "increments of expression" [documented: Harvard JOLT Digest, seen]. Excellent atlas entries for **rights and money** and **adjacent translation**; too narrow as spines.

**7. The Ballets Russes.** *For:* the program's richest case of a **briefer** (Diaghilev's committee, "astonish me"), a **season as collection map**, design crossing into fashion (Bakst and Poiret), a refusal as anti-DNA (*Le Train Bleu*), and a **failed handover** (most collaborations went "to museum heaven") [documented in `../works/W2_modernism.md`, `../REVIEW.md`]. *Against:* little known outside the arts; in the Gulf, low (argued); images split by designer death dates; the V&A permits teaching use but charges for commercial use, caps digital images at 768 pixels and limits V&A content to 25% of a project [documented: V&A website terms, seen]; Orientalism and queer history must both be told.

**8. The Bauhaus.** *Lineage:* the English Arts and Crafts movement and the Deutscher Werkbund (probable); Weimar 1919 (Gropius's manifesto and programme); the 1923 turn to "art and technology, a new unity"; Dessau 1925–32 (the school building, workshops selling designs to industry); Berlin 1932–33 and closure; then the diaspora: Black Mountain College, the New Bauhaus in Chicago, Ulm (probable). Three directors (Gropius, Meyer, Mies van der Rohe) rewrote its brief, so it has a real **version history**. In Asia: Mizutani Takehiko, the first Japanese student (1927–29); Yamawaki Iwao and Michiko (1930–32; she wove under Stölzl and Albers); Kawakita Renshichirō's Shinkenchiku Kōgei Gakuin (1932) taught Bauhaus ideas in Tokyo [documented: Bauhaus Kooperation, "From Dessau to Tokyo", seen]. In the region: Gropius and TAC designed the University of Baghdad, planned for 12,000 students, after a 1954 visit; work outlived two coups; a faculty tower, classroom buildings and the "Open Mind" arch were built before his death in 1969 [documented: Boston Globe, 2 Aug 2014, seen]. It reaches the ballet research through Schlemmer's *Triadic Ballet* (1922, in the register). *For:* apart from Disney, which cannot be shown, the only candidate strong in all thirteen fields, and strong in four of the six practice areas (space, object, body, identity), with prospective documents for walking it forwards. *Rights:* the name "Bauhaus" has been a DIY retailer's registered trademark since 1960; the Bauhaus-Archiv lost a challenge in 1971 [documented: Wikipedia "Bauhaus (company)", seen]; a 1999 Hamburg judgment made Wagenfeld sole author of the "Bauhaus lamp", and Tecnolumen makes the licensed re-edition while copies abound [documented: Rams Foundation, seen]. Those are teaching cases, but they also mean the commercial build hosts only the PD masters and the program's own drawings. *Cultural:* Tel Aviv's modernist "White City" is often called Bauhaus and is politically charged for Gulf and Arab learners [argued; handle by naming it, not by hiding it]; women were steered towards the weaving workshop (probable; well attested in secondary literature); the school's closure under the Nazis.

**9. Morris & Co. / Arts and Crafts.** Founded 1861 as Morris, Marshall, Faulkner & Co., "Fine Art Workmen in Painting, Carving, Furniture and the Metals", whose **prospectus** listed carving, stained glass, metalwork, paper-hangings, chintzes and carpets; reorganised as Morris & Co. in 1875; closed in 1940; designs still sold under licence, the brand held by Sanderson [documented: Wikipedia "Morris & Co.", seen]. *For:* the lowest rights risk of any real world (Morris died 1896; large CC0 museum holdings, probable); product families and a shop; a pricing contradiction (art for all, bought by the rich) for rights and money; a handover that worked for 44 years after the founder's death; and a regional thread through Morris's study of Persian carpets (probable: his role in the South Kensington Museum's purchase of the Ardabil carpet). *Against:* recognition outside Britain, America and Japan is low; Victorian and English.

**10. Japonisme.** Not a world but a reception; a strong atlas entry for **sources** (and its harms), not an exemplar.

**11–13. Disney, LEGO, IKEA (living brands).** Each is the most complete brand world a learner could name, and each is a **legal and ethical trap as a spine**. LEGO's Fair Play policy allows the word mark only "in a non-commercial manner to refer to LEGO products", forbids the logo on unofficial sites, treats copying catalogue and package photos as infringement, and says "a disclaimer will not serve to undo an improper trademark use" [documented: lego.com Fair Play, seen]. Disney says Mickey's association with its brand "will not change" now that *Steamboat Willie* is public domain (1 January 2024) and that it will "safeguard against consumer confusion" [documented: Disney statement as reported, seen]. Writing any of them "a Concept DNA" in a paid course risks presenting our reconstruction as the company's own system, which the program's rule on impersonating organisations forbids. Their public documents are superb atlas material, cited and labelled as readings: LEGO's "10 LEGO characteristics" defined by Godtfred Kirk Christiansen in 1963 [documented: lego.com history, seen]; the CJEU's 2010 refusal to let the brick's shape be a trademark because it performs a technical function (*Lego Juris v OHIM*, C-48/09 P, 14 Sep 2010) [documented: IPKat, seen]; IKEA's apology after women were erased from its Saudi catalogue in 2012 ("in conflict with the IKEA Group values") [documented: NPR, 2 Oct 2012, seen]; Al-Futtaim's operation of IKEA in the UAE, Qatar, Oman and Egypt [documented: Al-Futtaim, seen]. **Text only, no images, no logos, no reconstructed DNA presented as theirs.**

**14. Studio Ghibli.** Asia's strongest living film world; in 2020 its producer released stills to "use them freely within the scope of common sense" [documented: AWN, 22 Sep 2020, seen], which does not settle use in a paid course. Atlas only.

**15. Palais Garnier.** A competition announced 30 December 1860 drew about 170 entrants; Garnier was fifth in the first round and won the second on 29 May 1861; the building opened on 5 January 1875 after a flooded site and the Siege of Paris; asked its style by the Empress, Garnier is said to have answered "Napoléon III" [documented: Wikipedia "Charles Garnier", seen; the anecdote is "said to" in the source]. *For:* the brief and judged set make a fine **Briefer** case; the building is public domain; it is the home of the Paris Opéra Ballet, so it plugs straight into the ballet research; its copies (Hanoi; the opera house type in Cairo) carry a colonial lineage (probable). *Against:* Chagall's 1964 ceiling is in copyright; one building is thin for collection map and venture.

**16. Sydney Opera House.** The 1955 "Brown Book" set the competition conditions; the 1956 competition drew **233 entries**; Utzon won on 29 January 1957; construction ran 1959–73; the 1962 "Yellow Book" holds Utzon's plans; competition drawings are in State Archives NSW (NRS 12825) [documented: Museums of History NSW, seen]. In May 2002 Utzon and the Trust issued the ***Utzon Design Principles***, "intended as a permanent reference for the conservation of the building and its setting", to clarify design intent and guide review of proposals for change [documented: the PDF, seen]. *For:* the single best real **handover** document found: a maker writing his world's rules for strangers who will change it after him, which is exactly the Stranger test; global recognition, including the Gulf and Asia (probable). *Against:* one building, so collection map and adjacent translation are thin; Utzon's drawings in copyright; the Trust guards the building's image (probable; to verify).

### 3.4 Field fit for the front-runners

S strong (documented material exists), M possible (our reading needed), W weak or absent. [argued, from §3.3 and the repository's research]

| Field | Salt Road | *Nutcracker* | *Nights* | Ballets Russes | Bauhaus | Morris & Co. | Garnier | Sydney |
|---|---|---|---|---|---|---|---|---|
| Premise (PRM) | S* | M | S (the frame) | S (committee scenarios) | S (1919 manifesto) | S (1861 prospectus) | M | S (Brown Book; competition entry) |
| Perimeter (PER) | S* | M | S | S | S | M | M | M |
| Rules (RUL) | S* | S (two worlds) | S (dawn ends the tale) | S | S (preliminary course; 1923 programme) | S (hand block printing, truth to material) | M | S (*Design Principles*) |
| Anti-DNA (ANT) | S* | S (refused: Hoffmann's darkness; yellowface since 2017) | M | S (*Le Train Bleu*) | S | S | W | M |
| Obligations (OBL) | S* | S (scenario to composer, probable) | M | M | M (state funding, politics) | M | S (competition programme) | S (two halls on a small point) |
| Collection map (COL) | S* | S (divertissement; the holiday economy) | S (frame and recensions) | S (season, mixed bill) | S (workshops, product catalogue, book series) | S (wallpaper, textile, glass families) | M | M |
| Anchor (ANC) | S* | S (the score) | S (Scheherazade) | M | S (Dessau building; the lamp) | M (a pattern) | S (the grand staircase) | S (the shells) |
| Adjacent translation (ADJ) | S* | S (Suite, *Fantasia*, Barbie) | S (Rimsky, ballet, film, television) | S (fashion) | S (ballet, typography, diaspora) | S (licensing, Liberty) | S (*Phantom*; copies) | M |
| Rights and money (RGT) | S* | S (revenue share; PD core vs owned productions) | S (Diyab's lost credit) | S (Diaghilev's debts; credit disputes) | S (licensing to industry; the 1999 judgment; the trademark) | S (pricing; the brand today) | M | S (lottery funding, cost: probable) |
| Handover (HND) | S* | M (notation) | M (manuscripts) | W (lost) | S (diaspora, method) | S (the firm outlived Morris) | M | **S** (*Design Principles*) |
| Lifecycle (LCY) | S* | S | S | S | S (three directors; closure; re-editions) | S (1861–1940; licence) | S (Bastille 1989) | S (Utzon's exit and return: probable) |
| Grammars (GRM) | S* | S (classical vocabulary) | M (narrative, verbal) | S | S (all twelve touched) | S (pattern) | S (spatial, atmospheric) | S (geometry of the shells) |
| Sources (SRC) | **W** (invented) | S | S | S | S | S | S | M |
| Maker lane | S* | S | S | S | S | S | S | S |
| Briefer lane | S* | M | W | **S** | S | S | **S** | **S** |

S\* means strong only because we write it. Salt Road is the only candidate whose Sources field is empty of real evidence, which is the owner's objection in schema terms.

## 4. Direction 2: the macro view

### 4.1 What it would be

A **field atlas**: for each Concept DNA field, a page (or a wall, in the program's form 10) that shows how three to five contrasting worlds answered that field, each in the same notation, with a comparison prompt first and the principle named after (Alfieri et al. 2013). It is Clark and Pause's method (eleven fixed issues, 118 buildings) applied to world-building: **the fields are the fixed issues; the worlds vary**.

The program already holds two pieces of it:
- **W4 Part 5** maps every field to a ballet theory, a document and a prompt (`../works/W4_theories_of_concept_and_process.md`).
- **The 24 motif walls** compare 6–10 works across three centuries and three regions (`../repertory/CENSUS.md` §4).

### 4.2 A first draft of the atlas, from the candidates above [argued; every fact must be checked before use]

| Field | Contrasting worlds (3–5) | The contrast the learner should find |
|---|---|---|
| Premise | Bauhaus 1919 manifesto (a school as a programme) · Morris 1861 prospectus (a firm as a promise) · the *Nights* frame (a rule that generates stories) · Gautier's *Giselle* letter (a story) · LEGO's 1963 characteristics (a system) | A premise can be a theme, a story, a business or a rule set; which one generates the most? (W4's prompt) |
| Perimeter | Ménestrier's "unity of design" · the Holmes "Canon" against pastiche · IKEA's range (text only) | What lets many things belong to one world without one plot? |
| Rules | *Giselle*'s two worlds · the *Nights*' dawn · the Bauhaus preliminary course · Utzon's *Design Principles* · LEGO's clutch and compatibility (text only) | Narrative, structural and generative rules; only generative rules let strangers extend a world |
| Anti-DNA | Fokine's five principles · *Le Train Bleu* · Morris against the machine · LEGO's refusals (text only) · the Final Bow pledge | Refusals chosen by makers against refusals imposed from outside |
| Obligations | Petipa's plan to the composer · Garnier's competition programme · Sydney's two halls on Bennelong Point | Obligations as specification, not enemy |
| Collection map | *The Nutcracker*'s holiday economy · the Ballets Russes season · Morris & Co.'s families · the Bauhaus workshops and book series · Disney's strategy chart (text only) | The anchor that funds the rest; the collection that precedes the object (a threshold concept) |
| Anchor | Tchaikovsky's score · Sydney's shells · the LEGO brick (text only) · Scheherazade | What must survive any remake? |
| Adjacent translation | *Nights* → Rimsky-Korsakov → *Schéhérazade* (1910) → Disney · Bakst → Poiret · *Alice* → Tenniel → film · Schlemmer's *Triadic Ballet* | What the mechanism of translation keeps and drops |
| Rights and money | Diyab and Galland · *Klinger* (Holmes) · *X One X* (Oz) · *Lego Juris* (2010) · *Steamboat Willie* (2024) · the Bauhaus trademark (1960/1971) · the 48% holiday share | Credit, copyright, trademark and revenue are design decisions with long tails |
| Handover | Utzon's *Design Principles* · Sergeyev's notations · Morris & Co. after Morris · the Bauhaus diaspora · the Ballets Russes' lost works | A world that cannot be handed over dies with its makers |
| Lifecycle | Garnier → Bastille · Morris & Co. 1861–1940 then licence · Holmes killed and revived · *Giselle* lost in Paris, returned from St Petersburg | Preserved, re-imagined, retired: who decides |
| Grammars | Morris's pattern · Bauhaus typography and Schlemmer's figures · Owen Jones's Alhambra plates · the classical ballet vocabulary | A shared grammar and each world's dialect |
| Sources | Diyab · Hoffmann → Dumas → Petipa · Morris and Persian carpets · Gropius in Baghdad · Japonisme as a warning | Name the source and whoever could object |

Eight worlds recur across most rows. That is deliberate (§4.4).

### 4.3 What the macro view gives

- **Transfer.** Comparison across contrasting cases is the best-supported route to transfer in §2.2 (d = 0.50; far transfer d = 0.98 with the principle given after).
- **Recognition and stories.** Every field opens on worlds learners may know, told as stories, which meets the owner's rule and the narrative evidence (Mar et al. 2021, `S_structure_study.md`).
- **Less copying.** Several distant examples reduce reliance on any one (Jansson and Smith; the moderators in Vasconcelos and Crilly 2016).
- **What professionals actually hold**: a library of precedents (Lawson; Clark and Pause).
- **Reuse.** The Atlas, the world set, the motif walls and the products research are already built for this.

### 4.4 What it costs

| Cost | Why it happens | Evidence | Mitigation [argued] |
|---|---|---|---|
| **Fragmentation** | Each world met once, in one field, is a "separate case"; learners keep vivid fragments | Loewenstein et al. 2003: separate study equals no training; the NGA exhibition rebuilt 1909–29 three times (`S_structure_study.md` §2) | A **fixed cast** of six to eight worlds that recur across fields, each introduced once with a story-first "home card"; every atlas page sets worlds side by side with a "what do these share?" prompt |
| **No coherence** | No single world shows how the fields fit together; learners never see one concept whole | The ballet REVIEW's finding on the angle structure ("the learner never sees one concept whole") | The spine (§5) supplies the whole; the atlas supplies the range |
| **Load** | Each new world costs its context before its lesson | Cowan 2001 (about four new items); seductive details (Rey 2012) | Three worlds per field at Orientation, five at Mastery; context lives on the home card, not on the atlas page |
| **Recognition is uneven** | What is famous in London is not famous in Riyadh or Osaka | No regional data found (§3.1) | Choose the cast for reach (at least one MENA world, one Asian world, one building, one living brand by text only) and test recognition with the testers |
| **Canon capture** | Famous worlds are mostly European and American | The ballet research's own "canon line" warning | Regional slot worlds enter the atlas; the motif walls already pair Orientalist works with works made from inside |
| **Rights** | Many worlds, many licences | §3 | Living brands text-only; images only in hostable classes; own drawings for diagrams |
| **Maintenance** | 13 fields × 3–5 worlds = 40–65 entries, each with an image and a rights check, rechecked every January | The refresh cycle (Phase 4 item 14) | Entries are Atlas cards (Line and Label tiers) tagged by field, not a parallel library; the January recheck covers them |
| **No apprenticeship** | Many finished worlds never show a world being built step by step | Cognitive apprenticeship needs modelling of the process; Paas and van Merriënboer: variety pays only on top of worked examples | The atlas cannot replace the worked spine; it rides beside it |

## 5. Both together: five designs and their limits

### 5.1 The designs

| Design | What it is | Evidence it rests on |
|---|---|---|
| **A. Spine plus field atlas** | One fully worked exemplar (Salt Road) runs through every module and fades; beside it, a field atlas of three to five contrasting real worlds per field, drawn from a fixed cast | Worked examples, then variability (Paas and van Merriënboer 1994); comparison (Gentner; Alfieri); precedent analysis (Clark and Pause) |
| **B. Two exemplars, historical and contemporary** | Salt Road as the spine, plus one real historical world worked fully as a "twin" in the Method modules, compared field by field | Comparison of two worked cases (Gentner et al. 2003); already argued in `BENCHMARKS.md` Decision 1 |
| **C. Rotating exemplar per module** | Each module has its own lead world chosen for its subject (F2 Form: the Bauhaus; F4 Material: Morris & Co.; M3: *The Nutcracker*'s economy; S1: Sydney or Garnier; S3: the Ballets Russes; S2 and S5: LEGO and IKEA by text) | Fit of case to subject; recognition; history-first openers |
| **D. A real spine** | Replace Salt Road with a real world (the Bauhaus or *The Nutcracker*) as the one worked exemplar; the seeds stay for learners | Recognition; history; real evidence in Sources |
| **E. Layered (A + B + C, each kept small)** | Four layers: a **history-first opener** per module from its lead world (C); a **field atlas** from a fixed cast (A); **one spine** worked forwards and faded (Salt Road, given a lineage); **one historical twin** worked fully only where the DNA is taught (M2), read forwards from its own documents | All of the above; each layer does one job |

### 5.2 Limitations, design by design [argued unless marked]

| | A. Spine + atlas | B. Two exemplars | C. Rotating | D. Real spine | E. Layered |
|---|---|---|---|---|---|
| **Learner load** | Low on the spine; moderate per atlas page (cap at 3–5 worlds) | Moderate: two full DNAs to hold in M2 | High: a new world's context each module | Low (one world) but heavy context (real history is dense) | Moderate; each layer small, but four kinds of thing to learn to read |
| **Maintenance** | One DNA + 40–65 atlas cards | Two DNAs + their revisions | One lead world per module × 30 modules; drift between modules | One DNA, but a real world's facts and rights change and must be rechecked | One DNA + one twin (one module) + the atlas cards + openers; the openers reuse atlas worlds |
| **Rights** | Spine free; atlas per card | Twin must be hostable or drawn (Bauhaus: PD masters and own drawings only) | Each module's world carries its own rights; living brands impossible as leads | Highest: the spine appears in every unit, every engine and every export | Spine free; twin and atlas as A and B; living brands text-only |
| **Engines and Q32** | Spine may be generated | Twin must **never** be fed to generative engines | Real lead worlds cannot be generated from | **Breaks Q32**: the Stranger Lab and the area engines would generate objects, images and briefs "of" a real historical world | Engines run on the spine and the learner's world only |
| **Coherence** | High (one whole world) | High; the comparison adds a second whole | **Low**: no world seen whole across the program; this is the angle-structure failure again | High | High: one whole (spine), one whole for comparison (twin), many parts (atlas) |
| **Copying and fixation** | Reduced by the atlas | Two models are better than one; still risk of "Bauhaus style" | Low | High, and higher if famous (Viswanathan et al. 2016) | Low |
| **Cultural reach** | Depends on the cast | One European twin unless chosen otherwise | Can be tuned per module | One culture's history at the centre of everything | Cast chosen for reach; regional slot feeds the atlas |
| **The regional slot** | The slot's local world becomes one atlas entry per module | Unchanged | Tempting to make the regional world the lead; but F1.31 says local authors write it | Unchanged | Regional slot worlds join the atlas each module; written by local authors |
| **The Atlas** | The field atlas is a **view** of the existing Atlas (cards tagged by field), not a new library | Twin as an Atlas collection | Leads as Atlas collections | Spine as an Atlas collection | All as views of the one Atlas |
| **Schema** | No change | The twin is a program asset; storing it in the learner schema needs a new `learner_world.kind` (for example `reading`) or a separate file | No change | `seed` enum changes; a real world is not a seed | As B |
| **History-first rule** | Met by the atlas, not by the spine | Met in M2 | Met everywhere | Met by the spine | Met everywhere: openers, twin and the spine's lineage |
| **Evidence fit** | Good | Good | Weak (no invariant: variation theory needs one) | Good for apprenticeship, poor for transfer | Best fit, at the cost of complexity |

### 5.3 What breaks each design

- **A** breaks if the atlas grows into a list: more than five worlds per field, or worlds that appear once and never return.
- **B** breaks if the twin is used as a second model to copy, or if it is read backwards from its outcome instead of forwards from its documents.
- **C** breaks on coherence: a learner who meets thirty lead worlds meets none of them whole.
- **D** breaks on the engines and on rights: a real world cannot be generated, extended or sold through, and a famous one fixates.
- **E** breaks if all four layers are built at once. It must be built in order: spine lineage and twin first (they are needed before M2), the atlas as F1 and M2 are written, openers module by module.

## 6. Recommendation [argued]

### 6.1 Take design E, built small

1. **Keep one fully worked spine, and keep it fictional: Salt Road.** The spine is the world the learner watches being *built forwards*, through Method, the practice areas and Venture and Release, and fed to the Stranger Lab and the area engines. A real world cannot do that job: it is finished, it cannot be generated from (Q32), and a famous one is the most likely to be copied. Recognition matters for hooks, and the hooks move to the atlas and the openers.
2. **Answer the owner's objection inside Salt Road: give it a history.** Write its **lineage** from real salt worlds chosen for global reach (§3.3), so it opens with histories, lineages and stories like every other subject, and so its Sources field holds real evidence rather than invention. This also makes Salt Road a worked example of the F1 move "place your world in a lineage".
3. **Add one historical twin, worked fully only where the DNA is taught (M2), read forwards from its own documents: the Bauhaus.** Apart from Disney, which cannot be shown, it is the only candidate strong in all thirteen fields and both lanes; it spans four of the six practice areas, its brief was rewritten by three directors (a real version history), and it reaches Japan and Baghdad. Its DNA is labelled as the program's reading of public documents, never fed to generative engines, and illustrated only with public-domain masters, buildings under freedom of panorama and the program's own drawings. This replaces *Giselle* as the M2 comparison proposed in `../REVIEW.md` §8.3; *Giselle* moves to the atlas, where its two-world rule and its versions are strongest. (A new Hub decision; it changes the ballet review's recommendation 3.)
4. **Build a field atlas from a fixed cast of eight worlds**, each with one story-first home card in the Atlas and entries tagged by Concept DNA field: the Bauhaus, *The Nutcracker*, *One Thousand and One Nights* (written with regional readers), Morris & Co., the Sydney Opera House, the Ballets Russes, and LEGO and IKEA **as text only**. Three worlds per field at Orientation, up to five at Mastery; every page asks "what do these share?" before it names the principle. The atlas is a **view of the existing Atlas**, not a new library.
5. **Open each module with history from its lead world in the cast** (the C layer, kept to the cast so that worlds recur): F1 ballet and the *Nights*; F2 the Bauhaus; F4 Morris & Co.; M2 the twin; M3 *The Nutcracker*'s economy; S1 Sydney; S3 the Ballets Russes; S2 and S5 LEGO and IKEA by text.
6. **Let the regional slot feed the atlas.** Each module's regional slot, written by local authors under F1.31, adds one regional world to that module's atlas pages; the *Nights* and the Gulf's opera houses are the first candidates; *Al Sadu* (PR-001) is already in the Practices register.
7. **A rule for living brands**: public documents only, quoted briefly with attribution, no logos, no product images, no reconstructed DNA presented as the company's, and a legal review before launch (the UAE teaching exception does not cover a paid course).

### 6.2 Why this order

It follows the evidence in §2.6: a worked example first, because novices need one; variety beside it, because variety after worked examples improves transfer; comparison rather than exposure; the principle after the comparison; support faded as the learner's own world takes over. It meets the owner's two demands at once: one fully worked example (Salt Road, with a twin where the DNA is taught) and a macro view (the cast and the atlas) that opens every subject with histories.

### 6.3 The three strongest exemplar candidates

1. **The Bauhaus** (historical creative world). Strong in all thirteen fields and both lanes (only Disney matches it, and Disney cannot be shown); prospective documents; four practice areas; Japan and Baghdad in its lineage. *Limits:* commercial-build images limited to PD masters and own drawings; the name is a retailer's trademark; Tel Aviv's "White City" and the school's gender policy must be named; recognition is high among designers, moderate among briefers.
2. ***The Nutcracker*** (public-domain story world turned product economy). The most performed ballet, a public-domain core, the clearest collection-and-money case in the program, a Gulf presence, and the research already done. *Limits:* a performing, narrative world, weaker for space and digital; credit is diffuse; the Christmas frame and the national dances need care. **The reserve twin** if the Bauhaus is refused.
3. **The Sydney Opera House** (building and place). A 233-entry competition for the Briefer lane, the *Utzon Design Principles* as the best real handover document found, and recognition in every region. *Limits:* one building, so collection map and translation are thin; Utzon's drawings in copyright; the Trust's image rules to verify.

Reserves: **Morris & Co.** (lowest rights risk of any real world, weakest recognition) and ***One Thousand and One Nights*** (strongest recognition in the Gulf and MENA, but a story world without a brief, and regional heritage that local authors should write).

### 6.4 Risks of the recommendation

| Risk | Label | Mitigation |
|---|---|---|
| The owner's recognition concern persists, because the spine is still unknown | Probable | Recognition moves to the openers and the atlas; the testers' recognition check (below) shows whether the cast lands in each persona's region |
| The Bauhaus becomes a style to copy ("make it look Bauhaus") | Probable | Always shown beside Salt Road and two atlas worlds; the Stranger test run on both DNAs in M2 |
| Rights: the twin's best images are link-only | Documented (§3.3) | Own drawings of the workshop structure, timelines and plans; PD masters; link-out to Harvard, Bauhaus-Archiv and Dessau collections |
| Load: four layers to learn to read | Argued | Each layer has one form: the opener is a story (form 1 or 3), the atlas a comparison wall (form 10), the spine and twin the DNA Builder's read mode |
| Maintenance of 40–65 atlas cards | Argued | They are Atlas cards in Line and Label tiers; the January recheck covers them |
| Living-brand text still draws a complaint | Probable | Text-only rule; legal review; any entry can be withdrawn without breaking a unit, because no unit depends on one brand |
| Regional reach depends on regional authors who are not yet recruited | Documented (principle 11; F1.31) | The *Nights* and the Gulf opera houses enter the atlas as structure first, the regional text later |
| Schema change for the twin | Documented (`learner_world.kind`) | Store the twin outside the learner schema, or add `kind: reading` with a versioned change note |

### 6.5 Decisions for the Hub

- **P5 (amended):** Salt Road stays the worked exemplar, with a researched lineage.
- **P5a (new):** the historical twin in M2 is the Bauhaus (reserve: *The Nutcracker*); *Giselle* moves to the atlas.
- **P5b (new):** a field atlas from a fixed cast of eight, as a view of the Atlas.
- **P5c (new):** the living-brand rule (§6.1.7).
- **P5d (new):** module openers drawn from the cast; the regional slot adds a regional world to each module's atlas pages.

### 6.6 Next steps

1. A **recognition check** with the phase-5 testers: sixteen names, "know it / heard of it / never", by persona and region, ten minutes. It replaces every recognition rating in §3.2 with data.
2. **Verify** every fact marked probable before it reaches a learner: Salt Road's lineage; the Bauhaus manifesto, GmbH licensing and gender policy at source; Sydney's lottery funding and image rules; Morris and the Ardabil carpet; Petipa's *Nutcracker* plan.
3. **Read at source** Sio, Kotovsky and Cagan 2015 and Collins, Brown and Newman 1989 (definitions of the sequencing principles), not reached in this pass.
4. **Draft one atlas page** (Rights and money is the richest) and one Bauhaus twin field (Premise, from the 1919 manifesto, walked forwards) and test both against Daniel and Omar.
5. **Legal review** of the living-brand rule before any LEGO, IKEA or Disney text is published.

## 7. Sources

**Repository.** `README.md`; `docs/02-program/phase-4-foundations/index.md` (Item 4, P4, P5); `docs/02-program/hub/index.md` (A5, P5, Q3); `docs/01-structure/final-structure-v3/index.md`; `schema/concept-dna.schema.json`; `schema/licence-classes.json`; in this folder: `../REVIEW.md`, `../review/R1_curriculum_fit.md`, `../works/S_structure_study.md`, `../works/W4_theories_of_concept_and_process.md`, `../repertory/CENSUS.md`, `../products/PRODUCTS_AND_COLLECTIONS.md`, `BENCHMARKS.md`.

**Learning science (new in this pass; earlier ones are cited from the files above).** Chi, Bassok, Lewis, Reimann and Glaser 1989, *Cognitive Science* 13(2); Renkl 1997, *Cognitive Science* 21(1); Renkl, Atkinson and Große 2004, *Instructional Science* 32; Renkl 2014, in Mayer (ed.), *Cambridge Handbook of Multimedia Learning*, 2nd ed.; Kalyuga, Ayres, Chandler and Sweller 2003, *Educational Psychologist* 38(1); Nievelstein et al. 2013, *Contemporary Educational Psychology* 38(2) (all as summarised in the Wikipedia article "Worked-example effect"); Collins, Brown and Newman 1989 (sequencing labels as summarised in a Georgia Tech course page); Paas and van Merriënboer 1994, *Journal of Educational Psychology* 86(1), 122–133 (University of Twente record; finding as summarised in a public research note); Spiro, Feltovich, Jacobson and Coulson 1991 and 1996 (EduTech Wiki, "Cognitive flexibility hypertext"); van Merriënboer, 4C/ID (EduTech Wiki, "4C/ID"); Schwartz, Sadler, Sonnert and Tai 2009, *Science Education* (ScienceDaily release, 5 March 2009); Jansson and Smith 1991, *Design Studies* 12(1) (as summarised in a TU Delft thesis chapter); Viswanathan, Tomko and Linsey 2016, *AI EDAM* 30(2), 171–184; Vasconcelos and Crilly 2016, *Design Studies* 42; Sio, Kotovsky and Cagan 2015, *Design Studies* 39 (title and venue only); Kaminski, Sloutsky and Heckler 2008, *Science* 320 (BPS Research Digest); Fyfe, McNeil, Son and Goldstone 2014, *Educational Psychology Review* 26 (record only); Maloy, Fries, Laski and Ramirez 2019, *CBE—Life Sciences Education* 18(3), citing Rey 2012; Clark and Pause, *Precedents in Architecture*, 4th ed. (Wiley 2012), front matter; Lawson 2004 and Oxman 1994 (not read at source).

**Candidates.** UAE Federal Decree-Law No. 38 of 2021 on Copyright and Neighbouring Rights, arts. 20–22 (English text published by AGIP); Wikipedia: "Klinger v. Conan Doyle Estate, Ltd.", "Hanna Diyab", "Charles Garnier (architect)", "Morris & Co.", "Bauhaus (company)"; Harvard JOLT Digest on *Warner Bros. Entertainment v. X One X Productions* (8th Cir. 2011); WDWNT report of Disney's statement on *Steamboat Willie* (December 2023); NCAC wiki, "'Arabian Nights' (Song)"; LEGO Group, "Fair Play" legal notice and history article "Further development of the system"; IPKat, "Lego brick hits a wall" (14 September 2010) on C-48/09 P; NPR, 2 October 2012, on IKEA's Saudi catalogue; Al-Futtaim Group, IKEA brand page; AWN, 22 September 2020, on Studio Ghibli's stills; V&A websites terms and conditions; Rams Foundation, "Bauhaus lamp"; Boston Globe, 2 August 2014, on Gropius and the University of Baghdad; Bauhaus Kooperation, "From Dessau to Tokyo"; Museums of History NSW, "The Sydney Opera House drawings"; Sydney Opera House Trust, *Utzon Design Principles* (May 2002).

No URL in this file was composed; sources are named so they can be found, and the ones checked in this pass are marked "seen" where used.

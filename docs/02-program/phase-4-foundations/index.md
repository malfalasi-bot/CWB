# Phase 4 Foundations — personas, schemas, policies and plans

2026-09-28 · @Mohammad AlFalasi

## What was approved, and what this document settles

You approved the compiled structure (Final Structure v3.2 with F1 at v3.6), so gate G1 is passed; this document does the groundwork phase 4 needs before unit specs begin — personas, the sources-record schema, seed worlds, registers, the link register, and proposals for the stack, data policy, success criteria, refresh cycle, sensitivity reading and testing — each with options and a recommendation, and every choice gathered in §9 so you can answer in one pass.

**Companion outputs made alongside this document:** the Glossary (the program's networked compendium, F1 terms first), the Historian Knowledge Pack (the voice F1 depends on), and the F1 mockups (desk and phone, three unit archetypes). The Hub is updated to point to all of them.

**Still assumed, not yet answered:** the remaining gate questions in the Hub §6 (groups A, C, D, E) are being applied as recommended; tell me if any should change.

## Personas

The research says personas and jobs-to-be-done are compatible, not rival, tools, so the recommended option combines them: four people with names and contexts for the team, each carrying one primary job, with the jobs doubling as the app's named routes; all four are proto-personas built from research and assumption, to be corrected by the five testers in phase 5.

**What the benchmark says**

| Finding | Source | What it means here |
|---|---|---|
| <cite index="130-1">Jobs-to-be-done focus on user problems and needs, while well-executed personas include the same information and add behavioural and attitudinal details</cite>; the call to drop personas rests on <cite index="130-1">mistaking them for demographic representations and missing the behavioural considerations that guide interaction design</cite> | Nielsen Norman Group | Personas here carry goals, contexts and consumption habits, not demographics |
| <cite index="131-1">Archetypes are abstract while personas wear a human face; realistic personas invite empathy and are more memorable because people remember characters and plots</cite> | Nielsen Norman Group | Faces for the team writing units; abstract jobs for the app's routes |
| Research on design briefs found <cite index="133-1">little common guidance on how to write and structure such a vital document, and that writing briefs is often not a prominent part of design instruction</cite> | Design Society paper | The briefer persona's core need is real and under-served |
| A survey of 500 clients found <cite index="141-1">nearly three quarters believe their design agency could provide more added value</cite> | Design Business Council, reporting UK research | Briefers want to judge value, not only to commission |

**Option 1 — four role personas** (Maker, Briefer, Founder, Student): faces and contexts, no explicit job. Easy to write for; risks sorting people by title rather than need.

**Option 2 — five job archetypes, no faces:** make a world cohere · brief and judge it · build a venture around it · enter the field with a method · translate a world across media. Precise and route-ready; hard to empathise with while writing 450 units.

**Option 3 — personas carrying jobs (recommended):** the four people below, each with one primary job; the fifth job (translate across media) is a secondary job every maker persona holds, so it is not a separate person.

|  | Amara Okafor | Daniel Reyes | Mei Tanaka | Omar Haddad |
|---|---|---|---|---|
| Situation | 31, interior and spatial designer at a mid-size studio in Lagos; six years in practice | 38, brand and marketing lead at a consumer company in Mexico City; commissions agencies and freelancers | 34, founder of a small online homeware brand in Osaka; trained in business, taught herself product | 24, architecture graduate in Amman, moving into interaction and product design |
| Primary job | Make my work cohere as a world, and defend it | Brief better, and judge work with confidence | Build a brand world that holds without me in every decision | Enter the field with a method, not a portfolio of guesses |
| Lane and default route | Maker; Practice through Foundations, Mastery in Method and S1 | Briefer; Orientation through Foundations, Practice in Method, S5 lens, venture | Both lanes; Practice in Method, S2 lens, Mastery in R1–R3 | Maker; Orientation then Practice in order; S6 lens |
| What F1 must give them | Lineages to place her work in; attribution she can put in a client deck; the credit map for her own studio | Enough history to catch a lazy reference; the spectrum and the consultation protocol for briefs; the commissioning regimes | Heritage as asset and risk; copying and licensing; the museum and restitution cases before a collaboration | A spine to hold in his head (the recall deck); the recurrences; confidence to talk history with seniors |
| How they consume | Phone on the commute, 10 minutes; desk two evenings a week, an hour | Twenty-minute blocks between meetings; reference form before a pitch review; audio when travelling | Late evenings in bursts; skims theory, plays simulators; wants the partner to be blunt | Long desk sessions; reads everything; takes every Mastery unit he can |
| Frustrations | Courses that are either beginner fluff or academic walls; no time for either | Jargon; being talked down to by designers; not knowing what to ask | Content that assumes a team she does not have | History taught as a list of names to memorise |
| Would quit if | A unit takes longer than it says | He cannot use something in a meeting within a week | Nothing connects to her actual product | It feels like school |
| Success looks like | A client says her concept is the clearest they have seen | His next brief produces work that needs one round, not four | Her collaborators build on-brand without asking her | He can defend a design choice with a lineage and a source |

**How the personas are used.** Every unit spec names the persona its Apply step was tested against; the consumption forms are checked against the four "how they consume" rows; the routes in the app are the four primary jobs. The personas are revised after the first test round, with a versioned change note.

## The sources record (SRC) schema

SRC is the learner's own record of everything their world draws on — objects, texts, practices, people — with rights, cultural protocol, their relation to it and whether consultation is needed; it borrows the heritage sector's rights vocabulary and Local Contexts' protocol labels so a learner's record reads the same way a museum's does, and it grows with depth: nine fields at Orientation, the full set at Mastery.

**Standards it borrows from**

| Standard | What it contributes | Source |
|---|---|---|
| RightsStatements.org | <cite index="142-1">Twelve standardised rights statements for online cultural heritage, supported by the Digital Public Library of America and Europeana, designed for people and machines</cite>, <cite index="144-1">in three categories: in copyright, not in copyright, and unclear status</cite>; they <cite index="146-1">complement rather than replace detailed rights information, and exist for cases where Creative Commons licences cannot be used</cite> | Rights field uses a Creative Commons licence or a RightsStatements.org statement, never free text |
| Local Contexts Notices and Labels; CARE | Community-defined protocols carried as metadata (sprint 2) | Protocol field |
| Oral History Association practice | Consent, narrator review, restrictions (§5 below) | Consultation and consent fields |
| Getty vocabularies, Pleiades, Wikidata | Controlled names for places, makers, object types | Place and identifier fields |
| Dublin Core and citation styles | Title, creator, date, publisher, identifier as the minimum any record needs | Core fields |

**Fields**

| Field | Values | Orientation | Practice | Mastery |
|---|---|---|---|---|
| What it is | Object, text, image, recording, practice, person or interview, dataset, site | ● | ● | ● |
| Title or name | Text | ● | ● | ● |
| Made or held by | Named maker, unnamed workshop, community (with its own name for itself), institution | ● | ● | ● |
| When | Date range: earliest, latest, as written | ● | ● | ● |
| Where | Place, with historical and modern names; identifier when known | ● | ● | ● |
| Found at | Link, accession number, DOI or Wikidata identifier | ● | ● | ● |
| Rights | A Creative Commons licence or a RightsStatements.org statement; date checked | ● | ● | ● |
| Relation to my work | Reference, quotation, adaptation, translation, or appropriation risk (the F1.2 plane), plus the harm axis | ● | ● | ● |
| Consultation needed? | No; yes, not yet asked; asked; granted; declined | ● | ● | ● |
| Attribution line | Generated from the fields above, editable | — | ● | ● |
| Cultural protocol | Local Contexts Notice or Label; sensitivity (sacred, ancestral, funerary, restricted); CARE note | — | ● | ● |
| Credibility | Source Grader result: provenance, bias, distance, corroboration | — | ● | ● |
| Used in | The artifact fields and units that draw on it | — | ● | ● |
| Consent record | For people and practices: form or recorded statement, review status, restrictions, withdrawal route | — | — | ● |
| Consultation record | Who, when, what was agreed, how credited, what was given back | — | — | ● |
| Version and notes | Change history | — | — | ● |

**Options**

| Option | What it is | Trade-off |
|---|---|---|
| A. Lean only | The nine Orientation fields for everyone | Fast; too thin for the Mastery research units and for briefers auditing designers |
| B. Full only | All sixteen fields from the first entry | Complete; heavy for a newcomer, and most fields would be left empty |
| C. Grows with depth (recommended) | Nine fields at Orientation, thirteen at Practice, sixteen at Mastery, as above | Matches the depth dials; the record a learner started at F1.1 becomes their Mastery record without re-entry |

## Items 4–6: seed worlds, registers, the link register

These three were jargon in the last message: a seed world is a ready-made world a learner can use when they have no project of their own; the registers are the tables that hold F1's data; the link register tracks every place one module depends on another, so a change in one does not silently break the other.

### Item 4 — seed worlds

F1's Apply steps say "your world" from the first unit, so a learner without a project needs one on day one. Game jams, design competitions and studio schools solve the same problem with a set brief; the difference here is that the seed must carry through all four levels, so it needs a premise, a medium mix and room to fail.

| Option | What it is | Strength | Weakness |
|---|---|---|---|
| A. Three seed worlds (recommended) | Three fictional worlds, each spanning two or three media, the learner picks one | Choice by interest; covers objects, spaces, bodies, identity and digital | Three worlds to maintain |
| B. One shared seed world | Everyone without a project uses the same world | Peer overlays compare like with like; one set of examples | Dull for many; everyone's work looks similar |
| C. A real brand or institution | The learner adopts a public organisation | Motivating and concrete | Intellectual-property and consent problems; the program cannot vouch for it |

**The three seeds proposed for option A** (fictional, global, placeable anywhere; one becomes the program's worked exemplar, gate question A5)

| Seed | Premise | Media it spans | Why it teaches well |
|---|---|---|---|
| Salt Road | A coastal salt-making cooperative revives a trade route and becomes a homeware, food and guesthouse world | Object, space, identity | Heritage, labour and extraction are built in; F1's history lands on its first page |
| Night Library | A public library in a hot city that opens only after dark, for reading, repair and making | Space, digital product, identity | Public institution, access and time; strong briefer case |
| Second Skin | A repair-first clothing label for delivery riders, owned by its riders | Body, object, venture | Use, wear, labour and circularity; strong founder case |

**Recommendation.** Option A, with Salt Road as the worked exemplar the program teaches on (it touches F1 most directly), and a "bring your own" path always open.

### Item 5 — the registers, opened

They live as tables in the F1 Module File now, move to the app's database when it exists, and are exported as CSV every release (the minimal-computing rule from sprint 6). First entries are the ones already verified.

| Register | Columns | First entries |
|---|---|---|
| World set | id · title · date range · place · world · networks · recurrences · materials and origins · makers and labour · provenance · collection and accession · image and licence (rights statement) · sensitivity and Notice or Label · story · units · alt text · audio description · checked on | WS-001 Proto-cuneiform tablet with seal impressions, Metropolitan Museum 1988.433.1, about 3100–2900 BCE, probably Uruk, Mesopotamia, public domain, Wikidata Q29384572, units F1.5 and F1.3 · WS-X01 Kente Wrapper, Art Institute of Chicago 1986.1043, 1901–1950, Asante, Ghana, not public domain: recorded as an excluded example for F1.3's rights lesson |
| Claims | id · subject · relation · object · source · confidence (documented, probable, contested, interpretive) · both readings if contested · unit | CL-001 Writing was invented independently three or four times; contested; readings: four (Mesopotamia, Egypt, China, Mesoamerica) and three (Egypt as stimulus diffusion); sources from sprint 2; F1.5 |
| Assets | id · type · source · licence · units · alt text status · checked on | AS-001 Owen Jones, The Grammar of Ornament (1856), plates, public domain, F1.15 · AS-002 Library of Congress National Jukebox dataset (1900–1922), public domain in the United States, F1.4 and F1.21 |
| Coverage | world · licensed objects verified · units served · practices recorded · gap flag | Mesopotamia and the ancient Near East 1; all other worlds 0; gap flags on all until the harvest |
| Practices (new, sprint 5) | id · practice · holders · places · transmission · source (UNESCO, EMKP, community) · licence · consent · units | PR-001 Al Sadu weaving, United Arab Emirates, UNESCO Register of Good Safeguarding Practices 2025, regional slot · PR-002 Dry-stone masonry at Great Zimbabwe, EMKP project, F1.6 |

### Item 6 — the cross-module link register

F1 already points forward to other modules; if those modules change, F1's promises break without anyone noticing. Curriculum mapping in schools solves this with a map of prerequisites and forward references; here it is a table checked at every gate.

| From | To | Kind | What must stay true |
|---|---|---|---|
| F1.14 Copying | R2.5, R2.6 IP and licensing | Prepares | R2 opens with the licensing clause F1.14's briefer drafted |
| F1.15 Ornament | F2.6 Islamic geometry | Reuses case | The same pattern plates; F2 rebuilds the rule F1 compared |
| F1.17 Commissioning | R1, S5.10, R3.10 briefs | Prepares | The six regimes are the vocabulary the brief units use |
| F1.22a Use | R4 Responsibility | Prepares | The use-life of the anchor becomes R4's lifecycle input |
| F1.25 Autopsy | F4.12 Material dossier | Reuses engine | The material layer's fields match the dossier's |
| F1.28a Reconstruction | M1.14 Field sprint | Prepares | Reconstruction is offered as a research route in M1 |
| F1.30a Counterfactual | M1.9, M1.10 Stance and scenario | Prepares | Counterfactual worlds can seed a premise |
| F1.4 Interdisciplinary | S3.13 Subculture, M1.11a Film and games | Reuses case | The Jukebox recordings reappear |
| F1.26 Protocol | R2.8, the Attribution thread | Depends on | One protocol, two depths; changes are made once |
| F1 body-and-access lens | F3.3, the Accessibility thread | Depends on | Level 1 of the thread starts in F1 |
| Atlas engine | S1.10, S3.11, S3.14, S5.11, S6.9 | Reuses engine | Every lineage unit opens the Atlas, not its own timeline |

**Options.** A: a table maintained by hand, checked at each gate (now). B: generated automatically from the unit register once it lives in a database (later). Recommended: A now, B when the app exists.

## Item 11 — where harvest jobs and the app run

Split the problem: the world-set data is public, slow-changing and must outlive any app, so it should be harvested by scheduled jobs into plain versioned files; the learner-facing app is private and fast-changing, so it should sit on a hosted database with accounts; one free-tier stack does each well, and both are ones I can build with the tools connected here.

| Option | What runs where | Strengths | Weaknesses |
|---|---|---|---|
| A. One app does everything | Lovable front end on Supabase; harvests as scheduled database functions | One place; fastest to a working prototype | The world set lives inside an app's database; hard to review changes; tied to the app's fate |
| B. Static data pipeline plus app (recommended) | Harvest scripts run as scheduled jobs in a code repository and write JSON and CSV files per world, reviewed as changes; the app (Lovable on Supabase) reads those files and stores only learner data | Every change to the world set is a reviewable diff; data survives the app; free public hosting for the files; matches the minimal-computing rule | Two things to set up instead of one |
| C. All-in-one builder | Base44 or similar for app and data | Least setup | Least control over data export and review; weakest fit for an open world set |
| D. Static site only for now | Files plus a static site; no accounts until later | Zero running cost; fastest to show the Atlas | No artifact, no partner, no overlays until accounts exist |

**Recommendation.** B, built in two steps: the data pipeline and a static Atlas first (it unblocks the harvest and lets testers see F1), then the app layer for learners. Free-tier limits of every service change and are checked at build time; each has a named fallback (another scheduled-job runner, another static host, another hosted database).

## Item 12 — learner data policy

The program will hold three kinds of personal data — the learner's account, the learner's work (including what the AI partner reads), and, in F1.29 and M1.14, other people's words and images recorded by learners — and the third is the dangerous one; the recommended policy is consent-first by design, private by default, and for version 1 the program does not store other people's recordings at all.

**What the rules require** (this is a design brief, not legal advice; a lawyer should review before public launch)

| Source | Requirement | Design consequence |
|---|---|---|
| UAE PDPL (Federal Decree-Law 45 of 2021) | <cite index="152-1">Personal data may be processed only with the data subject's consent, save for prescribed exceptions; the controller must be able to prove consent; consent must be clear, simple, unambiguous and accessible, electronic or written, and must explain how to withdraw it</cite>; <cite index="152-1">before processing, a privacy notice must state the purposes, third parties the data is shared with, and the protections for cross-border transfers</cite> | A consent log per learner, per purpose; withdrawal in two taps; a plain privacy notice naming the hosting and AI providers and their countries |
| UAE PDPL scope and transfers | <cite index="154-1">It covers onshore UAE, excluding the DIFC and ADGM free zones</cite>; <cite index="159-1">transfers abroad need an adequate destination or an approved mechanism such as contractual clauses, and a higher category of sensitive data — including religious beliefs — requires explicit consent</cite>; one government guide noted that <cite index="160-1">as of September 2024 the implementing regulations had not yet been published</cite>, so current status must be verified | Provider contracts with transfer clauses; F1.16 (ritual and belief) never asks learners to record their own or others' beliefs as data; status check before launch |
| GDPR (for learners in Europe) | The same consent, notice, minimisation, access and erasure principles | One policy meets both, written to the stricter reading |
| Oral History Association practice | <cite index="161-1">Informed consent before the interview; clear communication of goals, risks and possible uses; the narrator's right to refuse questions; and, after the interview, narrator review and approval of what is released</cite>; <cite index="167-1">review options include deleting, restricting or redacting parts, adding clarifications, and keeping the interview closed for a period</cite>; <cite index="163-1">oral histories are co-created, and copyright is usually held by both interviewer and narrator until they agree otherwise</cite> | The Oral History Kit (F1.29) builds all of this in: consent before recording, a review step, restrictions, and co-ownership stated on the form |

**The policy, in eight rules**

1. Collect the minimum: an email, a display name, the learner's work. No age, gender, nationality or employer fields.
2. Consent per purpose, logged and withdrawable: account; the AI partner reading the learner's work; the learner's anonymised choices joining the pooled overlays.
3. The AI partner: the provider is named in the notice; the learner's work is not used to train models, under the provider's terms chosen for that reason; the partner never sees another learner's work.
4. Pooled overlays use only anonymised judgements (a sort, a threshold, a rating), never text or images.
5. Other people's data (F1.29, M1.14): in version 1 recordings stay on the learner's own device; the learner uploads only a transcript excerpt they have cleared with the narrator, and the consent record's existence, not its contents. Version 2 may store recordings once a lawyer has reviewed the flow.
6. Adults only (18 and over), to avoid the separate rules for minors.
7. Export and deletion: the learner can download their whole artifact at any time; deletion completes within 30 days.
8. A breach plan: who is told, by when, and how; written before launch.

**Options.** A: the eight rules with recordings kept on-device (recommended for version 1). B: the eight rules with recordings stored by the program under consent (only after legal review). C: no personal data at all — a static site with no accounts (possible for a first public preview of F1).

## Items 13–14 — success criteria and the refresh cycle

A unit succeeds when learners finish it in about the time it claims, produce the Apply output, pass or improve on its test, and use what it gave them later; thresholds start as provisional and are reset after the first real cohort. The world set needs a yearly recheck every January, when new works enter the public domain and collections update their licences, plus lighter quarterly and per-release checks.

### Item 13 — success criteria per unit

Built on the four levels educators commonly use to evaluate training (reaction, learning, behaviour, results), translated into what the app can observe.

| Level | Measure | Provisional target | How it is observed |
|---|---|---|---|
| Reaction | Clarity and usefulness, one tap at the end of the unit | 4 of 5 or better | End-of-unit prompt, optional |
| Engagement | Completion of those who start | 70% or more at Practice | App events |
| Engagement | Time taken against the time stated | Within 30% either way | App events |
| Learning | Apply output submitted | 80% of completers | Artifact field written |
| Learning | The unit's test or check (the sort's agreement with the reasoned ruling on key cases; the autopsy's layers filled with sources; drift reduced in a Stranger test) | Improvement from first to second attempt; 70% agreement on key cases | Interactive results |
| Behaviour | The unit's output reused later (a source, a rule, a brief) | Referenced in a later artifact field by half of completers | Artifact links |
| Results | The persona's success statement (§1) reported true | Asked at module end and at the dossier | Short survey |

**Options.** A: metrics only. B: metrics plus the qualitative findings of each test round (recommended). C: qualitative only until there is a cohort. Every unit spec now carries its own row: which test it uses and what counts as success.

### Item 14 — the refresh cycle

| When | What is checked | Why |
|---|---|---|
| Every January | Every world-set record's rights; newly public-domain works added to candidates; the next year of sound recordings in the United States | <cite index="62-1">Cleveland updates its open-access collection every January as works enter the public domain</cite>, and <cite index="76-1">each year until 2046, recordings older than 100 years enter the United States public domain</cite> |
| After each UNESCO committee session | The Practices register against the intangible heritage dataset | <cite index="104-1">The dataset is updated once a year after the committee's session</cite> |
| Every quarter | API terms of each collection; broken links; Wikidata changes to Ring 2 records used on the timeline | Terms and records change quietly |
| Every release | CSV export of all registers; coverage report | Durability; bias tracking |
| On request, at once | A takedown request is honoured within 48 hours; a community request under CARE hides the record pending review | Authority to control rests with the community |

The refresh runs as scheduled jobs once the pipeline exists (item 11) and as a scheduled reminder until then.

## Items 15–16 — sensitivity reading and testers

Sensitivity reading is a paid profession with published rates, and the chapters that most need it (Atlantic, Pacific, Africa) cannot wait for a budget, so the recommendation is a reciprocal-reviewer network now with a paid read later for the three highest-risk chapters; testing needs only five people per round, three rounds, recruited through networks rather than paid panels.

### Item 15 — sensitivity reading

| Finding | Source |
|---|---|
| A sensitivity read is <cite index="173-1">a professional assessment by a reader with relevant lived experience and subject expertise; it is advisory: the reader identifies issues, explains why, and recommends</cite> | Industry guide |
| The Editorial Freelancers Association's rate sheet lists <cite index="170-1">sensitivity and authenticity reads at $31–35 an hour, or one to two cents a word</cite>; experienced specialists charge <cite index="170-1">more than $100 an hour</cite>, and <cite index="170-1">honoraria suit informal advice such as a call or a pitch session</cite> | Reynolds Journalism Institute |
| Some readers set <cite index="171-1">a minimum of $250 per read regardless of length</cite> | A sensitivity-reading service |
| The practice is contested: critics describe <cite index="176-1">overzealous gatekeeping</cite> | Reason |

For F1 the risk sits in about 20,000 words across seven world chapters and the networks unit; at published minimums a paid read per chapter would cost roughly $250–350 each, about $2,000–2,500 for all eight.

| Option | How | Cost | Risk |
|---|---|---|---|
| A. Paid readers per chapter | One reader with lived experience and subject expertise per world | About $2,000–2,500 for F1 | Needs budget |
| B. Reciprocal reviewer network (recommended now) | Invite readers from university departments, museum education teams, community organisations and documentation programmes (EMKP grantees, Local Contexts partners); offer credit on the chapter, founding access, and a copy of the chapter for their own teaching | Time only | Slower; coverage uneven |
| C. "Under review" publishing | Chapters marked as open for review, with a feedback route for source communities and a 48-hour response rule | None | Only safe for chapters without sacred or contested material |
| D. The Historian voice briefed as a regional specialist | An AI pre-read before any human read | None | Never sufficient on its own |

**Recommendation.** D as a pre-read for every chapter, B for every chapter, C only for chapters B has cleared, and A for F1.13 (Atlantic), F1.12 (Pacific) and F1.6 (Africa) as soon as any budget exists. Readers are advisory; the program records what it changed and why.

### Item 16 — tester recruitment

| Finding | Source |
|---|---|
| <cite index="179-1">The best results come from testing no more than 5 users and running as many small tests as you can afford; three studies of five users each beat one of fifteen</cite> | Nielsen Norman Group |
| <cite index="184-1">Five users per audience segment uncovers roughly 85% of usability problems</cite>, and the rule holds only when problems are fairly easy to hit | A 2026 review of the rule |

**The plan**

| Round | Tests | Who (five each) | When |
|---|---|---|---|
| 1 | F1.1–F1.5 and Atlas v1 (static) | Two makers, two briefers, one student | When Atlas v1 and the first five units exist |
| 2 | The same, fixed, plus F1.6 and F1.13 | Five new people, including a founder | Two weeks after round 1 |
| 3 | The full Orientation and Practice tier of F1 | Five new people, balanced across the four personas | After the batch-2 specs are built |

**Recruitment without budget:** your own network first; design communities and mentoring platforms; university design and history departments; brand and marketing groups for briefers; a short public call. Offer founding-tester credit, free access for life, and their own Concept DNA kept. Sessions are 45 minutes, remote, moderated, think-aloud, recorded only with consent under the §5 policy. I write the screener, the task script and the synthesis; you recruit and sit in.

**Options.** A: three rounds of five (recommended). B: one round of fifteen (cheaper in effort, weaker in effect). C: unmoderated tests only (easier to schedule, loses the why).

## The choices to make

Eleven choices; each has a recommendation, so "agree" or a list of exceptions is enough.

| # | Choice | Options | Recommended |
|---|---|---|---|
| P1 | Personas | 1 roles · 2 job archetypes · 3 personas carrying jobs | 3 |
| P2 | Persona names and places (Amara, Daniel, Mei, Omar) | Keep · change | Keep, revise after round 1 |
| P3 | SRC schema | A lean · B full · C grows with depth | C |
| P4 | Seed worlds | A three seeds · B one shared · C real brands | A |
| P5 | The worked exemplar world | Salt Road · Night Library · Second Skin · something of yours | Salt Road |
| P6 | Registers | Tables in the module file now, database later | Yes |
| P7 | Link register | A by hand now · B generated later | A now, B later |
| P8 | Stack | A one app · B static data plus app · C all-in-one · D static only | B, data pipeline first |
| P9 | Data policy | A on-device recordings · B stored recordings · C no accounts | A; C for a public preview |
| P10 | Success criteria | A metrics · B metrics plus test rounds · C qualitative only | B |
| P11 | Sensitivity reading and testing | As recommended in §8 | Yes |

The refresh cycle (item 14) needs no choice; it starts as a scheduled reminder each January once you approve it.

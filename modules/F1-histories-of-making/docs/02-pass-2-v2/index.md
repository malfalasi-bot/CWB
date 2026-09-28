# F1 — Pass 2, v2: experience design and the Atlas

2026-09-27 · @Mohammad AlFalasi

## Evaluation of F1 as an experience

F1 v3.3 is sound as a syllabus and weak as an experience: it has 31 unit pages and one engine with no stated relationship between them, six labs specified by name only, no navigation model, and a real risk of reading as a beautiful catalogue; the fix is to make the Atlas the room the module happens in, with units as walks through it, and to specify every lab as an interaction, not a title.

| Aspect | As specified | Problem | Direction |
|---|---|---|---|
| Module architecture | 31 units in sequence, the Atlas as one lab among others | The Atlas is the module's one durable object but is entered like any widget; the learner leaves the world every time a unit ends | The Atlas is persistent: the module opens inside it, each unit is a saved view plus a walk, the unit page sits as a panel beside the Atlas, and the learner's own layer accumulates across all 31 units |
| Unit page | Opening move, lab, concept, cases, Apply, partner, log | Correct parts, no layout; the risk is a long scroll with a widget in the middle | Two-pane at desk (Atlas left, unit panel right); stacked on phone with the Atlas as a collapsible strip; the Apply step writes visibly to the artifact panel |
| The labs | Six named: Object Autopsy, Spectrum Sort, Credit Map, Pattern Comparer, Route Map, Source Grader | Each is a noun; none says what the hand does, what changes, what is exported, or what happens on a phone | §4 specifies each as interaction, feedback, export, phone form |
| Navigation | Linear numbering | Thirty-one steps feels like a textbook; the worlds chapters (F1.6–F1.12) are seven similar pages in a row | Navigation by the Atlas: the worlds are places you go, the recurrences are moments you jump to, the threads are lenses you switch on; the linear order stays available as a route |
| Content density | Three objects per unit at Practice, 90 stories | Right, but seven world chapters with the same shape will feel repetitive | Vary the archetype: each world chapter gets a different structural device (a route, a material, a maker, a technique, an institution, a ritual, a copy) |
| The artifact | SRC field written at the end of units | Invisible during the module | A live sources record panel that grows on screen; the learner sees their world set forming |
| Consumption forms | Five-minute, session, reference | Not yet designed for F1 | Five-minute form is an Atlas object card with one question; reference form is the record itself; audio walks for the networks |
| Partner | Historian voice named | No conversational surface | The Historian sits in the unit panel; on the Atlas it can be asked about any node ("who made this, whom did you ask"); its knowledge pack is the world set |
| The dry-learning risk | Long object lists, scholarly captions | High in the worlds chapters | Story first with scrollytelling where time or route is the content; objects that answer a question, never lists; every screen has one thing to do |
| Front end | Unspecified | Nothing to build from | §6 |

**What is already right and must be protected.** Object-first openings; the four-reading autopsy; the spectrum sort with the cohort overlay; the attribution line as the briefer's smallest deliverable; the making-first units; the sensitivity rules; the closing test.

**The one sentence for the front-end team.** F1 is a place, the Atlas, that the learner learns to read; the units are guided walks through it; the artifact is the map they draw of their own lineage on the way.

## The Atlas as a knowledge system

The Atlas stops being a timeline and becomes a graph of the history of making with eleven views onto it; objects, people, places, movements, inventions, materials, events and institutions are nodes, and the relations between them (made by, made of, copied from, traded along, commissioned by, influenced by, enabled by, disrupted by) are what the learner learns to see and to add.

*[Embedded: node/9409a4aa-dffb — Atlas architecture · rings, graph, views, units]*

The learner never sees the rings; they see views, and a unit hands them a view already set: a place, a time span, a lens switched on, a question. The rings keep the scope honest: Ring 1 is what we wrote and stand behind; Ring 2 is structured context imported from open knowledge bases and pruned to what links to Ring 1; Ring 3 is the open graph the curious can walk into, marked as unreviewed.

**Entities** (node types)

| Type | Examples | Ring |
|---|---|---|
| Object | a Song bowl, a Thonet chair, a kente cloth, a platform interface | 1 |
| Person or workshop | a named maker, an anonymous workshop, a guild, a studio | 1–2 |
| Community | a weaving community, a caste of smiths, a diaspora | 1, with consultation notes |
| Place | a city, a kiln site, a port, a mine, a factory | 2 (Pleiades, Getty TGN) |
| Material and its source | cobalt from Kashan, cotton from Gujarat, mahogany from Honduras | 1–2 |
| Technique and invention | the drop spindle, movable type, the fly shuttle, injection moulding, the transistor | 2 |
| Movement and style | mingei, Bauhaus, Arts and Crafts, Art Deco, Memphis, brutalism, streetwear | 2, pruned to what touches Ring 1 |
| Event | a war, a plague, a famine, an exhibition, a treaty, a shipwreck, a discovery | 2 |
| Institution | a museum, a court, a company, a school, a platform | 2 |
| Text and image | a treatise, a pattern book, a catalogue, a manifesto | 1–2 |
| Route | Silk Roads, the Indian Ocean monsoon circuit, trans-Saharan, the Atlantic triangle, the Manila galleon | 1 |
| Idea and belief | a religion, a cosmology, a theory of ornament | 2 |

**Relations** (edge types, each carrying a source and a confidence): made by · made at · made of · material from · commissioned by · held by, then held by (provenance) · exhibited at · copied from · adapted from · traded along · influenced by · responded to · enabled by (invention) · disrupted by (event) · taught by · belongs to (movement) · described in (text) · same recurrence as.

**The eleven views**

| View | What it answers | Interaction | Serves |
|---|---|---|---|
| Map | Where were things made, moved, mined, sold? | Pan, zoom, time scrub, layers by relation | F1.6–F1.13, F1.22 |
| Globe | The same without a projection's bias; time-lapse | Rotate; play through time | F1.3, F1.5, F1.13 |
| Timeline | When, on parallel regional rows, as ranges with uncertainty | Scrub; toggle strands; align recurrences | F1.5, F1.19–F1.21 |
| Occurrences | What else was happening: wars, plagues, exhibitions, inventions, discoveries, climate events | A feed filtered by place and span; a "what was happening elsewhere" panel on any object | F1.5, F1.19, F1.21 |
| Connections | How are these two things linked? | Pick two nodes; the shortest chains of relations appear, each edge with its source and confidence | F1.13, F1.14, F1.25 |
| Movements | Which movements touched which objects, garments and spaces, and how strongly? | Choose a movement; its influence fans out over objects by medium and decade | F1.20, S3.11, S5.11 |
| Inventions | What did a technique or material make possible, and what did it end? | Choose an invention; the objects enabled after it light up; a technology tree by material | F1.5, F1.19, F1.22 |
| Compare | Two objects side by side across time or place | Split view with shared lenses (material, labour, meaning) | F1.14, F1.20, F1.25 |
| Story | A curated walk through the graph as layered pages | Scrollytelling that moves the map and the timeline as you read | every narrative unit |
| Lineage | The learner's own layer | Add objects, people and routes; export to the artifact | F1.27, F1.31 |
| Calendars | The same time by another reckoning | Switch the axis: lunar, dynastic, genealogical, seasonal | F1.30 |

**Lenses** (filters that cut across every view and match the threads): labour and credit · material and extraction · gender · ritual and belief · commissioning regime · copying and transfer · provenance and restitution.

**Why this is not Wikipedia.** The Atlas is a landscape; the units are walks. Nothing in Ring 2 or 3 appears without a link back to a Ring 1 object; every influence edge is a sourced claim with a confidence the learner can see; and every view a unit opens comes with one question. Comprehensiveness lives in the graph; the curriculum lives in the walks.

## Data sources for a comprehensive Atlas

A comprehensive Atlas is feasible without budget because the structured context — movements, inventions, wars, people, places, dates — already exists as open linked data; the work is pruning it to what touches the curated objects and sourcing every influence claim, not collecting it.

| Source | What it gives | Licence | Ring | Caution |
|---|---|---|---|---|
| Wikidata | Structured records for movements, people, inventions, events, wars, institutions, with dates, places and links to museum records; a query endpoint | CC0 | 2, 3 | Quality varies by topic and region; every record used in Ring 2 is reviewed once; dates re-checked against a second source before they appear on the timeline |
| Getty vocabularies: AAT (art and architecture terms), ULAN (artist names), TGN (places) | Controlled vocabulary for object types, techniques, materials, makers and historical place names | Open (ODC-By) | 2 | Attribution required; Western vocabulary bias to be noted where it shapes a term |
| Pleiades | Ancient places with coordinates and time spans | CC BY | 2 | Ancient Mediterranean and Near East strongest; other regions thinner |
| Museum open-access APIs (Met, Smithsonian, Cleveland, AIC, Rijksmuseum, NGA, Cooper Hewitt) | Object records with images, dates, materials, provenance, places | CC0 | 1 | Terms of use per API; rate limits; caching under their rules |
| Archnet | Islamic architecture and urbanism, with drawings | Varies | 1–2 | Item-level terms |
| OpenStreetMap and Natural Earth | Base map and historical-boundary cautions | ODbL, public domain | views | Historical borders never drawn as modern ones; use places, not states |
| Our World in Data, World Bank, UN | Material, population, trade and energy series for the Occurrences and Inventions views | Open | 2 | Attribution |
| Public-domain texts (Project Gutenberg, Internet Archive, Wikisource) | Treatises, pattern books, catalogues, contracts | Public domain | 1–2 | Translation dates |
| Historical climate and epidemic datasets (open science repositories) | Events for the Occurrences view | Varies | 2 | Verify each dataset's licence |

**Rules that keep the Atlas bounded and honest**

1. Ring 2 imports only nodes within two relations of a Ring 1 object; a movement with no curated object attached does not exist in the Atlas until one does.
2. Every influence, copying, commissioning or enabling edge is a claim: it carries a source, a confidence (documented, probable, contested, interpretive) and, where contested, both readings.
3. Dates are ranges; the interface never draws a point for a range.
4. Places are places, not modern states; the Map shows historical names alongside modern ones and never colours by current borders.
5. Ring 3 is visibly unreviewed: a different surface, a label, and no export to the artifact without the learner marking it as their own claim.
6. Imported records keep their provenance: the learner can always see that a date came from Wikidata and a story from us.
7. Coverage is tracked per world; where open data is thin (Oceania, much of Africa before 1500), the thinness is shown, not hidden, and taught in F1.3.

**What the sources make possible that the timeline could not.** The Movements view (from Wikidata's movement and style records linked to museum objects); the Inventions view (technique and material records with dates, linked to objects that use them); the Occurrences view (wars, plagues, exhibitions, treaties with places and spans); the Connections view (any two nodes, shortest sourced path); and the Calendars view (Wikidata carries calendar systems and dynastic eras).

## The interactives, evaluated and upgraded

Every F1 lab is specified below as an interaction (what the hand does, what changes, what is exported, what it becomes on a phone) rather than a name, and seven new interactives are added because the graph makes them possible; each existing lab also gains a link into the Atlas so nothing in F1 is a widget on its own.

**Existing labs**

| Lab | As named | What the hand does | Feedback | Export | Phone form | Upgrade |
|---|---|---|---|---|---|---|
| Object Autopsy | Peel an object into material, labour, trade, meaning | Guess first: the learner writes one line per layer before revealing; then drags the layers apart; taps any layer to open its Atlas node | Each layer reveals the record's facts against the guess; the material layer shows the source place on the Map | A four-line reading into the sources record; the attribution line | The four guesses, then the reveal; deep zoom deferred | Add sound: a maker's-process audio where one exists; add the "what was happening elsewhere" panel on the date; full autopsy in F1.25 adds the provenance chain |
| Spectrum Sort | Place cases on reference to appropriation | Drag eight cards along a scale; write one reason per card | The cohort heatmap appears after; the Historian asks about the two cards the cohort disagreed on most | The learner's sort with reasons into the test record | Full, with cards as swipes | Add a second axis (harm to the source community, none to severe) so the sort becomes a plane; add "what would make this acceptable" as a slider that reveals the consultation protocol |
| Credit Map | Deconstruct one object into contributors | Pull contributors out of an object: designer, workshop, material extractors, transporters, retailers, uncredited communities | Each contributor becomes a node; named versus unnamed ratio shown; links to Ring 2 people and places | The credit map of the learner's own project | Full | Add a "credit line generator" that writes the attribution from the map, for the briefer |
| Pattern Comparer | Compare ornament across regions | Side by side and overlay; a motif family tree; the learner guesses region before the reveal | Region and date revealed; the exhibition-catalogue caption shown as an artefact of extraction | A pattern note into the formal grammar candidates | Side by side only | Link to F2.6's generator: rebuild the motif's rule |
| Route Map | Trace an object's route | "Carry an object": pick a Ring 1 object and drag it along its route; ports and dates appear as you pass | Materials joined en route; taxes and transformations at each stop; the object at the end shown as it arrived | The route into the learner's world set | A tap-through of the stops | Time-lapse mode: play a route with the Globe; branching routes for copies |
| Source Grader | Grade five sources | Rate each on provenance, bias, distance from the event, corroboration; find the bias prompt asks for the sentence that gives it away | A graded list with the class's spread | Into the sources record with grades | Full | Add translation-date check as a field |
| Oral History Kit | Record, transcribe, consent | A consent flow first (who owns the recording, right to withdraw, labels); then recording; transcription with review; tagging to the Atlas | A consented, labelled record | A community node and a story into Lineage | Recording on phone is the natural form | Add Traditional Knowledge labels once verified; a "what not to publish" review step |
| Bible Anatomy (F1.4) | Dissect a public world bible | Tag the sections of a bible: rules, stakes, time, place, characters | Shows which sections map onto Concept DNA fields | A note into GRM.n | Reading only | Link to M2.6 grammars |

**New interactives the graph makes possible**

| Interactive | What it does | Serves | The learning it makes possible |
|---|---|---|---|
| Connect Two Things | Pick any two nodes (a Song bowl and a Delft tile; a Bauhaus chair and a Kuba cloth); the shortest sourced chains appear; the learner can challenge an edge | F1.13, F1.14, F1.20, closing test | History as relations, not lists; the habit of asking what the link is and who says so |
| What Was Happening Elsewhere | On any object, a panel of concurrent events, inventions and objects across all worlds | F1.5, every world chapter | Simultaneity; the end of the single line |
| Movement Ripple | Choose a movement; watch its influence fan out over objects by medium and decade, with confidence shading | F1.20, later S3.11 and S5.11 | Influence as claim with strength, not as fact |
| Invention Ripple | Choose a technique or material; objects enabled after it light up; objects ended by it fade | F1.5, F1.19, F1.22 | Technology as enabler and eraser |
| Copy Chain | An object and its copies across four stops, as before-and-after steps | F1.14 | Transfer as the engine of exchange; the licensing question before R2 |
| Re-time | Switch the timeline's calendar; watch the same objects regroup | F1.30, F1.3 | Periodisation as a choice |
| Coverage Mirror | The Atlas shows the learner where its own data is thin, by world and century | F1.3, F1.24 | The bias of the record itself |

**Two rules for all of them.** Guess before reveal wherever a fact is shown; export to the artifact wherever a judgement is made.

## Scenarios: from consumed material to simulation

F1's 31 units fall into seven archetypes; each has a different shape on screen, a different Atlas view, and a different balance of reading, looking, doing and testing, so the module never repeats one page design thirty-one times.

| Archetype | Units | Opens on | Atlas view handed over | Consumed material | Doing | Test or export | Phone form |
|---|---|---|---|---|---|---|---|
| A. The one-object unit | F1.1, F1.25 | A single object filling the screen | Compare (later), Object view | Nothing before the guess; the story after | Object Autopsy | A reading and an attribution line | Complete |
| B. The world chapter | F1.6–F1.12 | Story view: a scrollytelling walk through one world, each with its own device (a route, a material, a maker, a technique, an institution, a ritual, a copy) | Map, set to that world and span | Three object stories; an argument card on how that world is usually told | Reference note; consultation flag | The note into sources | Object cards and the walk in linear form |
| C. The network unit | F1.10, F1.13, F1.14 | Globe in time-lapse, then Map | Map with routes; Connections | Route stories; the copy chain | Carry an object; Connect Two Things; Copy Chain | The route into the world set | Tap-through stops |
| D. The recurrence unit | F1.5, F1.30 | Timeline with parallel rows | Timeline; Occurrences; Calendars | Short cards per recurrence | Align recurrences; Re-time; What Was Happening Elsewhere | Three objects placed with ranges | Timeline scrub only |
| E. The thematic argument unit | F1.3, F1.15–F1.24 | An argument card | Movements, Inventions, Occurrences or the lens that matches (labour, gender, ritual, commissioning, provenance) | Argument card; three objects; a step-through where there is a chain | Movement Ripple, Invention Ripple, Credit Map, the commissioning chain | The two-sentence position; the briefer's regime brief | Card plus the first two steps |
| F. The method unit | F1.2, F1.26, F1.28 | A problem or a prediction | Connections; Source Grader | Almost none; the method is the interactive | Spectrum Sort; the protocol builder; grading | The sort, the protocol, the graded sources | Complete |
| G. The Mastery research unit | F1.27, F1.29, F1.31 | The learner's own layer, empty | Lineage; Atlas authoring | Archive walkthroughs; the kit | Research; recording; authoring | The piece; the account; the slot | Recording on the phone; authoring at the desk |

**One scenario in full: F1.13 Networks, at the desk, about 60 minutes**

1. The unit opens on the Globe, dark, turning slowly; a single dot at a kiln in Jingdezhen glows in the 1300s. A line reads: "This bowl will travel for three hundred years. Guess where it ends." The learner types a guess.
2. Time-lapse: the globe plays forward and the dot's line grows — Jingdezhen to the coast, the Indian Ocean monsoon circuit, Hormuz, Cairo, then the Cape route, Amsterdam. Other dots light as it passes: cobalt from Kashan going the other way; chintz from Gujarat; Swahili coast ports. The learner's guess is scored against the route.
3. The unit panel on the right shows the argument card: "Objects made the routes" against "Routes made the objects", with one case each.
4. Carry an Object: the learner drags the bowl along its route; at each port a stop card opens (what joined it, what tax it paid, what it was called there). The Map shows historical names beside modern ones.
5. Concept text (500 words) on the six networks, read with the Map open; each network named in the text is a link that sets the Map.
6. Connect Two Things: the learner picks two objects from different networks and challenges one edge in the chain; the Historian asks what evidence would change the confidence.
7. Apply, maker: trace one object from your own world set end to end and write where it changed hands. Apply, briefer: the same, then note which stop a commissioning brief would have been written at.
8. Log: one line; the route joins the sources record and appears in the learner's Lineage view.

**The same scenario on a phone, ten minutes.** The Globe time-lapse as a video-like play with the guess before it; the stop cards as a tap-through; the argument card; the log. Connect Two Things and the full concept text wait for the desk session, flagged as such.

**What the scenarios reveal.** Seven distinct page shapes are enough; the world chapters must each have a different device or they will read as one page seven times; every archetype has a complete phone form except G, which is meant for the desk and the field.

## UI and front-end design direction

The interface is one persistent canvas (the Atlas) with a unit panel, an artifact panel and a partner drawer around it; the design language is an archive rather than a dashboard; the front end is a React app with a graph store, a vector map, a 3D globe and a timeline renderer, with every view state encoded in the URL so that a unit can open the Atlas exactly where it wants.

**Layout**

| Region | Desk | Phone |
|---|---|---|
| Atlas canvas | Left two thirds; view switcher top-left (eleven views as icons with names); time scrubber along the bottom; lenses as toggles top-right | Top third, collapsible to a strip; one view at a time; scrubber below |
| Unit panel | Right third; scrolls independently; the opening move, the concept, cases, Apply and log in order chosen per unit | Below the Atlas, full width |
| Artifact panel | A drawer from the right edge showing the sources record growing; opens automatically on export | A tab in the bottom bar |
| Partner drawer | A drawer from the bottom of the unit panel; the Historian by default; can be pointed at any node | Bottom sheet |
| Node card | Appears over the canvas on tap: image, one-line story, four readings, relations, sources, confidence, sensitivity note | Full-screen sheet |
| Route and progress | A thin band across the top showing the current walk and the module's 31 units as a path, with the six threads as coloured ticks | Same, compressed |

**Design language.** An archive, not a dashboard: warm paper tones with a dark canvas for the Globe; serif for stories and argument cards, a humanist sans for interface and captions; type set for Arabic and Latin from the first component (mirrored layouts, script-aware line heights); objects always shown on neutral grounds with their collection credit; motion slow and meaningful (routes draw, time plays, layers lift); no gamified confetti; the cohort overlay drawn as quiet density, not leaderboards. Uncertainty has a visual grammar: date ranges as bars with soft ends, contested claims as dashed edges, unreviewed Ring 3 as a lighter surface.

**Components** (the F1 set of the pattern library): view switcher; time scrubber with range handles; lens toggles; node card; relation edge with source popover; scrollytelling page with pinned canvas; object story with deep zoom; argument card; step-through explainer; spectrum plane; credit map; route player; connect-two-things path panel; ripple views (movement, invention); calendar switch; lineage editor; sources record; partner drawer; guess-then-reveal wrapper; reduced-motion switch.

**Technical architecture**

| Layer | Choice | Reason |
|---|---|---|
| App | React and TypeScript; state in a graph store (nodes, edges, claims) with derived views | One store, eleven views |
| Map | An open-source vector map library on OpenStreetMap tiles, with historical place layers from Pleiades and Getty TGN | Free; supports custom layers and RTL labels |
| Globe | three.js with a lightweight sphere, route arcs and time-lapse | Free; already in the program's toolkit |
| Timeline | d3 for the parallel-row timeline with ranges and the calendar transforms | Precision with ranges |
| Objects | An IIIF deep-zoom viewer where collections serve IIIF; static images otherwise | Free; museum standard |
| Graph queries | Pre-computed for Ring 1 and 2 (shortest paths, ripples) at build time; live queries to Wikidata only for Ring 3 | Speed on phones; no rate-limit surprises |
| Data pipeline | Scripts that pull museum APIs and Wikidata, review queues for Ring 2, a claims table with sources and confidence, coverage reports per world | The research log feeds it directly |
| URL state | Every view, span, lens and selection in the URL | Units link into exact Atlas states; learners share states |
| Storage | Supabase for learners, artifacts, sorts and overlays; static JSON for Rings 1 and 2 | Free tier; static content is cacheable |
| Offline | The current unit's pack (objects, stories, audio) cached for field units | G-archetype units happen away from Wi-Fi |

**Performance and accessibility.** Rings 1 and 2 as static, versioned JSON split per world; images served at three sizes; the Globe off by default on low-power devices with the Map as fallback; every view keyboard-navigable; a text list view of any Atlas state for screen readers; alt text and audio description on every object; colour never the only carrier; a reduced-motion mode that replaces time-lapse with stepped frames; RTL mirrored layouts tested from the first build.

## Staging, effort, risks and open questions

The Atlas is built in four versions that track the units, never ahead of them; the risk that matters most is scope, and the rings, the two-relation rule and the claims table are the controls.

| Version | Contains | Units it unblocks | Effort (small team, part time) |
|---|---|---|---|
| Atlas v1 | Ring 1 with 60 objects; Map and Timeline views; node cards; Object Autopsy; Spectrum plane; Story view for two walks; URL state; text list view | F1.1–F1.5, F1.25, F1.2 | 6–8 weeks |
| Atlas v2 | Ring 1 to 150; Ring 2 for places, materials, events; Globe with time-lapse; Routes and Carry an Object; Connections; Occurrences and What Was Happening Elsewhere; Coverage Mirror | F1.6–F1.15, F1.22 | 8–10 weeks |
| Atlas v3 | Ring 2 for movements, inventions, people; Movement and Invention Ripples; Copy Chain; Credit Map; Compare; lenses across views | F1.16–F1.24 | 6–8 weeks |
| Atlas v4 | Lineage authoring; Calendars and Re-time; Oral History Kit; Ring 3 browse; export to the artifact from every view | F1.26–F1.31 and the regional slot | 6–8 weeks |

**Risks and controls**

| Risk | Control |
|---|---|
| Scope: the Atlas becomes the product and F1 never ships | Versions tied to units; nothing built ahead of a unit that needs it |
| Ring 2 quality: bad Wikidata dates on the timeline | Review queue; two-source rule for any date drawn; provenance shown per fact |
| Influence edges read as facts | Confidence grammar in the UI; contested claims carry both readings; the Historian asks for evidence |
| Regional imbalance of the world set | Coverage Mirror public; gaps taught; community-published sources preferred for thin regions |
| Sensitivity mistakes | The five rules from Pass 2 v1; a sensitivity flag on every record; exclusion by default for sacred, ancestral and funerary material |
| Performance on phones | Static JSON per world; Globe optional; pre-computed paths |
| Rights drift as APIs change terms | Terms recorded per collection; images referenced by link where required; a swap procedure per record |
| The module reads as a catalogue | Seven page archetypes; every screen one thing to do; guess before reveal |

**Open questions for you**

1. The eleven views: keep all, or ship with six (Map, Timeline, Occurrences, Connections, Story, Lineage) and add Movements, Inventions, Compare, Globe and Calendars in later versions?
2. Design language: archive-warm as proposed, or something of your own; do you want Figma mockups of the desk and phone layouts next?
3. Ring 3: allow live browsing into Wikidata inside the app, or keep learners inside Rings 1 and 2 with outbound links only?
4. The confidence grammar: four levels (documented, probable, contested, interpretive), or fewer?
5. Which comes first after your review: the Atlas v1 as a working page with 60 records, or the Figma mockups, or the remaining thirty unit specs?

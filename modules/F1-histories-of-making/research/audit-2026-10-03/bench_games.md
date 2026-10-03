# Benchmarks: games, 3D objects and interactives for a history of making — plus the evidence on "predict, then reveal"

Prepared 3 October 2026 for the F1 "Histories of making" content audit. Group: games, 3D object viewers and interactive essays, and the learning-science evidence on "guess then find out". Written to the shared brief (BENCH_BRIEF.md). All products below were opened where a page could be read; where only a JavaScript shell or a search excerpt was available this is stated in the record and in the Sources list.

Scope note on the four concerns in the brief: (1) object-heavy, thin on movements/civilisations/events; (2) doubt about typed "guess then find out"; (3) dense content for everyone; (4) zero-cost, open-licence only. Each record ends with "borrow / avoid" lines written against those concerns.

---

## At a glance

| # | Benchmark | Maker · year · status | Core interaction | Density | Licence / cost |
|---|---|---|---|---|---|
| 1 | Discovery Tour: Ancient Egypt | Ubisoft Montreal · 2018 · live | Walk a marked route; stop at narrated stations | High (≈2,000 narrated words per tour × 75 tours) | Commercial ($19.99 standalone) |
| 2 | Discovery Tour: Ancient Greece | Ubisoft · 2019 · live | Themed station tours + end-of-tour quiz; Discovery Sites | High (30 tours, 5 themes) | Commercial; free with Odyssey |
| 3 | Discovery Tour: Viking Age | Ubisoft · 2021 · live | Play 8 character quests; dialogue choices; codex unlocks | Medium (quests short) | Commercial; bundled with Valhalla |
| 4 | Civilization VI Civilopedia + Great Works/Wonders | Firaxis/2K · 2016– · live | Click any game entity → gameplay data + long historical essay, hyperlinked | Very high (≈2,500-word civ essays) | Commercial; text copyrighted |
| 5 | Humankind encyclopedia | Amplitude/Sega · 2021– · live | Browse by era → culture → traits; short blurbs | Low–medium (reference) | Commercial; web encyclopedia free to read |
| 6 | Minecraft Education history lessons | Mojang/Microsoft + partners · 2016– · live | Explore built world, talk to NPCs, read boards, build | Medium (3-week unit for Egypt) | ≈$5/user/yr; worlds proprietary |
| 7 | 80 Days | inkle · 2014 · live | Tap-to-choose prose; globe map; routes; trading | Very high (500k+ words) but paced in short beats | Commercial; ink engine open-source (not opened) |
| 8 | Pentiment | Obsidian/Xbox · 2022 · live | Point-and-click; dialogue; tap underlined terms → glossary | High (period detail in every screen) | Commercial |
| 9 | Smithsonian Voyager + Open Access 3D | Smithsonian DPO · 2018– · live | Orbit/zoom 3D; annotations; articles; step-through tours | Tunable (author sets steps) | Apache 2.0; 2,000+ CC0 models |
| 10 | Sketchfab cultural heritage (British Museum) | Sketchfab (Epic→KitBash 2026) · 2012– · live, at risk | Orbit; numbered annotations as a hotspot tour | Low–medium per object | Free tier; models CC0…CC BY-NC-SA (varies) |
| 11 | Scan the World / MyMiniFactory | MyMiniFactory · 2014– · live | Browse/download printable scans | Low (file + blurb) | Mostly CC BY-NC-SA; some CC0 |
| 12 | Google model-viewer | Google · 2018– · live (v4.3.1, Jun 2026) | `<model-viewer>` tag; hotspots; click-to-camera | n/a (component) | Apache 2.0 |
| 13 | Ciechanowski explainers | B. Ciechanowski · 2019– · live | Drag to rotate; scrub a slider; read | Very high (thousands of words, dozens of demos) | Free to read; no reuse licence |
| 14 | Nicky Case / Explorable Explanations | N. Case · 2014– · live | Play tiny sims; tap-to-continue; choose | Medium (3,300 words in Trust) | Trust is CC0; hub lists many open works |
| 15 | Brilliant | Brilliant · 2012– · live | Tap/drag/choose; math keyboard for expressions; instant feedback | Low per screen, many screens | Subscription |
| 16 | NYT "Snow Fall" | NYT · 2012 · live | Scroll; media triggers in flow; chapter breaks | Very high (13,800+ words, 6 parts) | Paywalled; copyrighted |
| 17 | The Pudding (menus essay, 2026) | The Pudding · 2017– · live | Scroll-driven steps; pan/zoom archive explorer | High | Free to read; copyrighted |
| 18 | SBS "The Boat" | SBS · 2015 · live | Scroll (or auto-scroll); parallax panels; sound | Medium (⅓ of a 49-page story; 300 drawings) | Free to view; copyrighted |
| 19 | Google Arts & Culture: Art Camera + Pocket Gallery | Google · 2016/2018 · live | Deep zoom to brushstroke; walk 3D rooms; audio tour | Medium | Free to view; partner-owned images |
| 20 | IIIF + OpenSeadragon | IIIF Consortium / OSD community · 2011–/2013– · live (OSD 6.1.0) | Pan/zoom tiled images; annotations; multi-image | n/a (infrastructure) | Open spec; open-source viewer |
| 21 | BBC/British Museum "A History of the World in 100 Objects" | BBC + BM · 2010 · archived | Filter objects by time/place/material/theme; deep zoom; 15-min audio | High (100 × 15-min programmes + 1,000s of objects) | BBC archive; Flash explorer defunct |

---

## Benchmark records

### 1. Discovery Tour by Assassin's Creed: Ancient Egypt

| Field | Record |
|---|---|
| Maker, year, status | Ubisoft Montreal; 20 Feb 2018; live (Steam standalone, $19.99; also inside AC Origins). |
| What it is | Combat-free "living museum" mode of the Origins open world of Ptolemaic Egypt. |
| How it is structured | 75 tours curated by historians, grouped by theme (landmarks, daily life, geography, famous people such as Cleopatra and Caesar). A tour is a marked route with a series of **stations**; each station is a narrated stop with a text panel and, often, a museum image of the real artefact or source. Historians' 5,000-word manuscripts were cut to ≈2,000 narrated words per tour; a tour runs 5–20 minutes. Roughly one "Behind the Scenes" station per tour explains reconstruction choices. All 75 tours are unlocked from the start; free roam of the whole map; fast travel between tours from the map or menu. |
| Interaction model | Walk/ride to the next station; press to hear narration; read panel; look at artefact image; optional free roam. Nothing to type, no scoring. |
| Content density | High and narrative-reference hybrid: a tour is a short lecture delivered in place. The map is the index; stations are the paragraphs. |
| Borrow for F1 | The **station tour** as the unit: a path of 6–12 narrated stops, each with one idea, one real source image, and one "how we know" stop. The map-as-index with everything unlocked. The 2,000-word budget per tour is a useful density target for an "animated lecture". |
| Avoid | Narration without any check: nothing asks the learner to commit to anything, so retention relies on the walk. Cost of 3D world is irrelevant to F1; the pacing is the lesson. |
| Licence / cost | Commercial software and content; no reuse. |
| Opened | Ubisoft historian Q&A (news.ubisoft.com); Steam store page. |

### 2. Discovery Tour: Ancient Greece

| Field | Record |
|---|---|
| Maker, year, status | Ubisoft; 10 Sep 2019; live; free for Odyssey owners, standalone on Uplay. |
| What it is | Same mode for the Odyssey world. |
| How it is structured | 30 tours in five themes — Philosophy, Architecture, Daily Life, War, Mythology — "hosted" by five period guides (Aspasia, Herodotos, Leonidas…). Each tour ends with an **interactive quiz**. Separate **Discovery Sites** (e.g., Keryneian Hind, Ships, Euboean banner, Workshops and Metal Workers) are standalone encyclopedia stops with 150–250 words plus a cited image; several read as "behind the scenes" sourcing notes. Avatars and mounts unlock as progression reward. |
| Interaction model | As Egypt, plus end-of-tour multiple-choice quiz and collectible Discovery Sites found by exploring. |
| Content density | High; the Discovery Site texts are the densest single screens in the series (one workshop entry gives excavation data, workshop sizes, slave labour). |
| Borrow for F1 | Themed tour sets (Daily Life / Politics / Art, Religion & Myth / Battles / Cities) are exactly the "movements, civilisations, events" layer F1 lacks. A quiz **after** each tour (retrieval), not before. Guides as period voices. |
| Avoid | Unlockable cosmetics are a motivation layer that F1 does not need. |
| Licence / cost | Commercial. |
| Opened | Assassin's Creed wiki page listing tours and Discovery Sites (Ubisoft's own curriculum guide page is a JS shell; not readable). |

### 3. Discovery Tour: Viking Age

| Field | Record |
|---|---|
| Maker, year, status | Ubisoft; Oct 2021; live; bundled with Valhalla, also standalone. |
| What it is | Third Discovery Tour; the format changed from narrated station tours to playable quests. |
| How it is structured | Eight quests, each embodying a historical figure (two Norse traders, a Saxon monk, King Aelfred), playable in any order, forming an overarching story across England, Norway, Jotunheim and Asgard. Historical **Discovery Sites** attached to buildings remain readable without interrupting the quest. **Learnings** (codex entries) unlock as quests complete. Behind-the-scenes sites explain creative liberties. Real manuscripts supplied by a historian are woven into the monastery quest. |
| Interaction model | Walk, talk, choose dialogue (e.g., persuade clergy to back Aelfred's burh plan), collect codex entries. |
| Content density | Lower per minute than Egypt/Greece: a reviewer finished Aelfred's arc in a lunch break; the makers say the shift was prompted by teachers asking for "empathy and player agency", and that markers were kept "not too heavy on text". |
| Borrow for F1 | Role-perspective stops ("you are the journeyman/merchant/monk") for civilisations and events; codex that fills as you go. |
| Avoid | The trade-off is explicit: more dialogue and animation per fact, fewer facts. For a dense programme this is the wrong direction unless the quest wraps a reference layer. |
| Licence / cost | Commercial. |
| Opened | PCGamesN review; TheGamer developer interview. |

### 4. Civilization VI — Civilopedia, Great Works and Wonders

| Field | Record |
|---|---|
| Maker, year, status | Firaxis / 2K; 2016 with expansions; live; web mirror at civilopedia.net (11 languages, three rulesets). |
| What it is | The in-game encyclopedia; every unit, building, wonder, civic, technology, Great Person, civilisation and leader has an entry. |
| How it is structured | Two-part entry: **gameplay** (ability, units, infrastructure, numbers) then **Historical Context**, a long essay — the China entry runs ≈2,500 words from the Warring States to 1912. Entries hyperlink to leaders, units, districts, wonders. Top-level categories: Civilizations/Leaders, Districts, Buildings, Wonders, Units, Technologies, Civics, Great People, Concepts. Opened in-game from a "?" and from any object. Great Works (writing, art, music, relics, artefacts) and Wonders are the game's "objects"; each wonder entry also carries a real-world history. |
| Interaction model | Click anything in the world → its entry; read; follow links. No quizzes. |
| Content density | Very high, reference-style; essays are narrative but the system is a lookup. |
| Borrow for F1 | The two-layer entry (facts block + essay) and the rule that **every** civilisation, movement, event and concept has a page as rich as an object page — the direct remedy for "object-heavy, movements thin". Hyperlink discipline: leader → civ → wonder → era. |
| Avoid | The essay is unillustrated and unpaced; it is a text wall. F1 should segment such essays into steps with signalled visuals (see evidence, Mayer). |
| Licence / cost | Commercial; text © Firaxis. Pattern only. |
| Opened | civilopedia.net China entry; Civilization wiki page on the Civilopedia. |

### 5. Humankind — encyclopedia

| Field | Record |
|---|---|
| Maker, year, status | Amplitude Studios / Sega; 2021 (consoles 2023); live; official web encyclopedia at humankind-encyclopedia.games2gether.com. |
| What it is | Reference for a 4X in which a civilisation changes culture each of six eras (Neolithic → Contemporary), choosing from ~10 cultures per era (60+ with DLC). |
| How it is structured | Era → Culture → one-line historical blurb + affinity (Builder, Merchant, Aesthete…) + emblematic unit + emblematic district. Wonders, technologies and civics in parallel lists. |
| Interaction model | Browse; filter by era; no narrative. |
| Content density | Low per entry (one sentence of history each), high in breadth. |
| Borrow for F1 | The **era × culture matrix** as a navigation device for the world timeline: six rows (eras) × many columns (cultures) with one emblematic object, one emblematic place and one "affinity" tag each — a compact way to show civilisations side-by-side in time. |
| Avoid | Gameplay-first blurbs tell you almost nothing historical; F1's version must carry real content behind each cell. |
| Licence / cost | Commercial; encyclopedia free to read, copyrighted. |
| Opened | Humankind Encyclopedia cultures page; Wikipedia article. |

### 6. Minecraft Education — history lessons

| Field | Record |
|---|---|
| Maker, year, status | Mojang/Microsoft and partners (Phygital Labs "Egypt Toybox"; Block Builders / Sir John Soane's Museum "Portals to the Past", Jan 2026); live. |
| What it is | Downloadable lesson worlds with lesson plans. |
| How it is structured | A lesson = world file + intro video + objectives + guiding questions + educator slides + activities + performance expectations + estimated time. Egypt: five lessons over three weeks of 60-minute sessions (Nile geography; build/carve pyramids with code; day-in-the-life of social classes; tomb exploration guided by Howard Carter's journal; research a queen and design her tomb). Soane: museum → three portals (Karnak, Olympia, Pantheon) → architectural puzzles → a Design Studio to build your own. NPCs carry dialogue with an immersive reader (read-aloud, translation). |
| Interaction model | Walk, right-click NPCs, read boards, solve pillar/colour puzzles, build, journal in-game. |
| Content density | Medium; reviewers note students may prioritise play over content and some lessons lack clear instructions. |
| Borrow for F1 | "Portal" structure (one hub → three civilisations → compare → make your own); role-taking across social classes; **build/sort challenges that make the learner reproduce a structure** (column orders, pyramid chambers) — a form of "find out by making" that needs no typing. |
| Avoid | Teacher-dependent; heavy learning curve; worlds are not open-licence. |
| Licence / cost | ≈$5 per user per year; worlds © Microsoft/partners. |
| Opened | World History Commons review; Minecraft Education Egypt and Soane blog posts and Block Builders case study (search excerpts). |

### 7. 80 Days (inkle)

| Field | Record |
|---|---|
| Maker, year, status | inkle, writer Meg Jayanth; 2014; live (iOS/Android/PC/Switch). |
| What it is | Steampunk Verne: circumnavigate in 80 days as Passepartout. |
| How it is structured | A globe with 150+ cities and transport routes; in each city, prose scenes; a market for trading items that unlock routes; a clock. 500,000+ words, but any one playthrough sees a sliver. Jon Ingold calls it "a self-narrating boardgame". |
| Interaction model | Read a short passage → tap one of 2–4 choices → next passage; drag routes on the map; buy/sell. The designers describe a conversational rhythm: the game says something, you say something, and short, frequent choices stop text from feeling like a wall. |
| Content density | Very high in total, deliberately low per screen. |
| Borrow for F1 | The **beat structure**: 60–120 words, then one tap; the map as the macro-structure and the prose as the micro-structure. For F1's "networks" and "places" layer, city-to-city routes with trade goods are a ready model (Silk Road, Indian Ocean, Atlantic). |
| Avoid | Alternate-history content; choices that change facts. In F1 the tap should choose what to look at or predict, never rewrite the past. |
| Licence / cost | Commercial game. inkle's **ink** scripting language is open-source (widely used; not opened in this pass). |
| Opened | Game Developer article "Building the perfect text adventure for mobile". |

### 8. Pentiment (Obsidian)

| Field | Record |
|---|---|
| Maker, year, status | Obsidian Entertainment / Xbox; Nov 2022; live (PC, Xbox, PS, Switch). |
| What it is | Narrative adventure in a Bavarian town across 1518, 1525 and 1543: artist Andreas Maler, a murder, the Peasants' War, the printing press. |
| How it is structured | Three acts years apart; one town explored on foot; manuscript-illumination art style; dialogue with villagers; a journal. Underlined terms, places and people open a **glossary** overlay that keeps the scene visible. Speech is set in **typefaces by social group** (scratchy hand for peasants, blackletter for clergy, print for the press) — the materiality of writing is part of the UI. Accessibility toggles for ligatures, long-s, "easy read" fonts. |
| Interaction model | Walk, talk, choose dialogue, tap glossary terms, inspect manuscripts and ruins. |
| Content density | High: period life, estates, religion and media change in every scene; educators (Oldenburg game lab) recommend playing selected scenes alongside primary sources. |
| Borrow for F1 | The **in-place glossary** (tap → definition without leaving the scene) and **typography as evidence** (show a movement or civilisation by its letterforms, materials and tools, not only its objects). Microhistory as a route into a movement (the Reformation via one town). |
| Avoid | 15–20 hours of play; not segmentable without curation. |
| Licence / cost | Commercial. |
| Opened | Middle Ages in Modern Games teaching note (June 2025); Game Rant on glossary/fonts. |

### 9. Smithsonian Voyager (Explorer, Story, Mini) and Smithsonian Open Access 3D

| Field | Record |
|---|---|
| Maker, year, status | Smithsonian Digitization Program Office; 2018–; live, actively released. |
| What it is | Open-source web 3D viewer (Explorer), authoring tool (Story) and lightweight viewer (Mini); plus "The Cook" processing server. SI Open Access released 2,000+ 3D models as CC0 in glTF/OBJ (Apollo 11 command module, sculptures, specimens). |
| How it is structured | A **scene file** per object holds the model, lights, **annotations** (pinned labels), **articles** (HTML with images) and **tours**. A tour is a sequence of **steps**; each step snapshots camera, visible annotations, article, material/lighting, slicer plane, measurement; the viewer interpolates between steps with a curve and duration. The learner can leave the tour and orbit at any step. Explorer embeds as a web component with an API; works offline. |
| Interaction model | Orbit, zoom; tap an annotation; step through a tour with next/previous; read an article panel; optional slice/measure tools. |
| Content density | Author-set: a tour step can carry a paragraph; articles can be long. |
| Borrow for F1 | **This is the object-interaction stack**: self-hosted, Apache-2.0, CC0 models, with tours = "stations around an object". Combined with an article per step it gives the "dense but paced" object lecture the lead wants. |
| Avoid | Scene authoring in Story takes time per object; budget it (one tour of 6–10 steps per key object, not for every object). |
| Licence / cost | Apache 2.0 software; CC0 models. |
| Opened | GitHub repo; Voyager docs (Tours task; Explorer); 3d.si.edu open-source page; CG Channel on the 2020 release. |

### 10. Sketchfab cultural-heritage models and annotation tours (British Museum)

| Field | Record |
|---|---|
| Maker, year, status | Sketchfab (acquired by Epic 2021; **sold to KitBash on 10 Aug 2026**); live; store closed Oct 2024 when Fab launched; free uploads and view-only models continue "for now". |
| What it is | The de-facto host for museum 3D; British Museum account (e.g., Rosetta Stone: 480k triangles, 650k views, 14.8k downloads). Sketchfab's 2020 CC0 programme released 1,700 models from 27 institutions in 12 countries. |
| How it is structured | One page per model: viewer, description, licence, numbered **annotations** which act as a hotspot tour (click 1→2→3; camera flies to each). Collections and tags group models. Embeddable iframe. |
| Interaction model | Orbit/zoom; click numbered hotspots; read side text. |
| Content density | Low–medium per object; annotation text is short. |
| Borrow for F1 | The numbered-hotspot convention (learners understand it instantly). Use Sketchfab as a **source of models**, filtered to CC0 / CC BY / CC BY-SA, downloaded and re-hosted. |
| Avoid | Hosting or embedding from Sketchfab. The UK "Heritage 3D Data at Risk" report (Aug 2026) finds 83% of surveyed UK heritage bodies on Sketchfab, 44% undecided and 31% unaware of the Fab transition, and no preservation guarantee; Fab does not support CC0/BY-SA/BY-NC licences. Also note that many museum uploads (the Rosetta Stone included) are **CC BY-NC-SA**, which fails F1's open-licence list. |
| Licence / cost | Free tier for uploads/viewing; model licences vary per upload. |
| Opened | Rosetta Stone model page; Hyperallergic on the CC0 launch; Sketchfab blog posts on Fab (Oct 2024) and the KitBash sale (Aug 2026); MDPI Heritage paper (Mar 2025); UK H3DAR final report (Aug 2026) — the last five as search excerpts. |

### 11. Scan the World / MyMiniFactory

| Field | Record |
|---|---|
| Maker, year, status | MyMiniFactory (London); 2014–; live; 17,000+ printable scans (2021 figure), 50+ institutions, Google Arts & Culture partner. |
| What it is | Community photogrammetry archive of sculpture and artefacts, optimised for 3D printing (STL). |
| How it is structured | Object page = files + short blurb + museum + licence badge; collections by museum/place. |
| Interaction model | Browse, preview, download, print. Little on-page learning. |
| Content density | Low. |
| Borrow for F1 | A second source of models; **print-at-home** as a making activity for a history of making (a student prints and handles a replica). |
| Avoid | Licence is **mostly CC BY-NC-SA** (object pages show "BY-NC-SA"); the FAQ says only "many" are CC0 — check every file. |
| Licence / cost | Free downloads; per-object CC licence. |
| Opened | 3Dnatives overview; Scan the World FAQ, About and sample object pages (search excerpts). |

### 12. Google `<model-viewer>`

| Field | Record |
|---|---|
| Maker, year, status | Google; 2018–; live; v4.3.1 (4 Jun 2026); 120 contributors. |
| What it is | A web component that shows a glTF/GLB with one HTML tag, with AR and hotspots. |
| How it is structured | Child elements whose `slot` starts with `hotspot` become annotations, positioned by `data-position` and `data-normal` (or `data-surface` on animated models); hotspots fade when facing away; `hotspot-visibility` events; hotspots can carry click handlers that **move the camera** (camera-target/orbit) — i.e., a tour in a dozen lines. An online editor places hotspots by clicking and emits the attributes. Dimension overlays and SVG leader lines are shown as examples. |
| Interaction model | Drag to orbit, pinch to zoom, tap hotspot, AR on phones. |
| Content density | n/a; text is ordinary HTML, so accessible and translatable. |
| Borrow for F1 | The lightest possible object viewer for the 38 units: one tag per object, hotspot labels in plain HTML, click-to-camera for a 5-stop mini-tour. Use Voyager where a longer authored tour is needed. |
| Avoid | No built-in tour authoring UI; no slicing/measuring. |
| Licence / cost | Apache 2.0. |
| Opened | modelviewer.dev annotations examples; GitHub repo. |

### 13. Bartosz Ciechanowski's interactive explainers (Mechanical Watch, Bicycle, GPS…)

| Field | Record |
|---|---|
| Maker, year, status | B. Ciechanowski; 2019–2024 (17 articles); live; Patreon-funded (543 members in Aug 2026). |
| What it is | Long-form explanations of one machine or phenomenon each, with dozens of live WebGL models in the text. |
| How it is structured | Opens with the whole object and an instruction to touch it ("drag to change viewing angle… slider to peek inside"). Then ramps from the simplest part to the real thing: Watch goes spring → barrel → arbor → train; Bicycle starts with a wooden box and a force slider. Parts are colour-coded so names need not be memorised. Every demo is one idea with one control. Global pause for all animations; units toggle; "click" becomes "tap" on touch. Ends with "Final words" returning the object to daily life. |
| Interaction model | Drag to rotate, scrub a slider, occasionally press a key; read between demos. Nothing to answer. |
| Content density | Very high; thousands of words; months of work per article; built in hand-written WebGL with no libraries (author's own statement, via Hacker News). |
| Borrow for F1 | The grammar of a **3D-object lecture**: whole → part → whole; one control per idea; colour-coding instead of jargon; prose that says what to do and what to notice; global pause. This is the model for "show ideas visually" on an object (loom, press, kiln, lathe). |
| Avoid | The production cost. F1 can approximate with model-viewer/Voyager steps plus CSS/SVG sliders; it cannot build bespoke simulations per unit. |
| Licence / cost | Free to read; no reuse licence stated. Pattern only. |
| Opened | Mechanical Watch; Bicycle; learn-ui.com chapter and Hacker News thread for method (search excerpts). |

### 14. Nicky Case and Explorable Explanations

| Field | Record |
|---|---|
| Maker, year, status | N. Case; explorabl.es hub 2015–; The Evolution of Trust 2017; live. |
| What it is | Playable essays ("learning through play"); a hub of hundreds by others, sorted by subject and with tool links for makers. |
| How it is structured | Trust: ≈3,300 words of UI text + 1,100 of footnotes; a sequence of tiny games (play against a character, set a slider, watch a tournament), each followed by a short explanation; tap-to-continue. Case's explaining rules (Stanford talk): show what made you care; **show, then tell** (pictures, examples, analogy before definitions); link ideas with "therefore/but", not "and then"; cut 10%; test early with real people. Case also lists a 2019 web experiment "does guessing first improve memory?" (not opened; results not located). |
| Interaction model | Play a 10–30-second mini-sim → tap next → read 2–4 lines → repeat; occasional choice. |
| Content density | Medium; deliberately short lines between plays. |
| Borrow for F1 | Show-then-tell ordering for every concept page; the **tap-to-continue beat**; translation via forks (Trust has 38 fan translations because the words are one HTML file). |
| Avoid | Simulations suit systems (trust, segregation, epidemics) more than chronology; use for concepts (guilds, patronage, supply chains), not for timelines. |
| Licence / cost | The Evolution of Trust is **CC0** (code, text; music and sounds CC0/CC BY-NC listed); PIXI.js, Howler.js, Tween.js open-source. |
| Opened | explorabl.es; ncase.me; Trust page and GitHub; projects list; Stanford talk transcript (search excerpt). |

### 15. Brilliant.org

| Field | Record |
|---|---|
| Maker, year, status | Brilliant; 2012–; live; subscription with limited free preview; "Koji" tutor added. |
| What it is | Interactive STEM courses; "learn by doing, not reading". |
| How it is structured | Course → lesson (≈15 minutes) → a sequence of single-screen problems, each a small interactive (drag tiles, set a slider, pick an option) with an explanation revealed after answering; ≥20 problem variants per concept; difficulty ramp; Learning Paths. Authoring: designers specify the "aha" and progression; an internal AI tool generates the interactive asset and variants; human review of every problem. |
| Interaction model | Mostly **tap, drag, choose**; but note Brilliant's own help page: a **math keyboard** is used "whenever you need to enter a number or an expression". So "never typed" is not accurate — typing exists but only for numeric/symbolic answers, never prose. Instant correctness feedback (box turns green). |
| Content density | Low per screen; many screens; no long reading. |
| Borrow for F1 | The screen rule: one question, one interaction, instant explanation; 20 variants per concept if F1 wants practice. Drag-to-sort (order these objects by date; place this on the map) is the F1 equivalent of Brilliant's tile-dragging. |
| Avoid | STEM-style "solve" framing; and Brilliant's own claim that it is "6x more effective" is marketing, not evidence. |
| Licence / cost | Proprietary; subscription. |
| Opened | Brilliant blog "Hand-crafted, machine-made" (Jan 2025); help page on interactives; FAQ (search excerpts). |

### 16. NYT "Snow Fall: The Avalanche at Tunnel Creek"

| Field | Record |
|---|---|
| Maker, year, status | New York Times, John Branch; 20 Dec 2012; live; Pulitzer. |
| What it is | The reference scrollytelling feature. |
| How it is structured | Six parts (Tunnel Creek; To the Peak; Descent Begins; Blur of White; Discovery; Word Spreads); 13,800–15,000+ words; full-screen looping video opener; terrain flyover; skier-path animation **driven by the reader's scroll**; a data-driven real-time avalanche simulation that autoplays when reached; videos and photos in flow; a click-through between chapters that acts as a breath. The team's account: one story, not assets hung off text; each animation paced to its job (quick airbag, slow flyover); elements that felt duplicative or flashy were cut. |
| Interaction model | Scroll; optional click to play; chapter buttons. |
| Content density | Very high; the chapter breaks and cliffhangers carry readers through 17,000 words. |
| Borrow for F1 | Scroll-bound reveals for **events and timelines** (the path drawn as you read); chapter breaks every 2,000–3,000 words; media only where words fail (terrain, path, duration). |
| Avoid | Desktop-only layout (critics note it fails below ~10-inch screens); autoplaying heavy media. |
| Licence / cost | © NYT; paywall. |
| Opened | MDPI Information (2018) case study; Source/OpenNews "How we made Snow Fall"; CSU critical review (2024); NYT 10-year retrospective (search excerpts). |

### 17. The Pudding — "A History of Menus is a Menu of History" (June 2026)

| Field | Record |
|---|---|
| Maker, year, status | The Pudding (est. 2017); essay #220/221, June 2026; live. |
| What it is | Visual essay on 5,000 NYPL Buttolph Collection menus, 1880–1920, told in ten dishes (Soup, Celery, Vol-au-vent… Baked Alaska), with a companion archive explorer. |
| How it is structured | Scroll-driven steps that zoom and highlight items on menu scans; an explorer that lets the reader pan and zoom a map of all 5,000 artefacts and open one (an 1897 Plaza menu). The index page shows a cadence of one essay a month; the Pudding's own process posts describe a workflow of data → sketch → scrollytelling. |
| Interaction model | Scroll; hover/tap; pan-zoom explorer. |
| Content density | High (an essay plus a 5,000-item archive). |
| Borrow for F1 | The **"ten objects, one history"** essay shape — ten dishes become ten tools, ten garments, ten typefaces; and the pairing of a paced story with a free explorer of the whole archive. |
| Avoid | Nothing structural; the essay page itself is JS-rendered and was not readable by the fetch tools (a reminder to keep F1 pages readable without JS for indexing and accessibility). |
| Licence / cost | Free to read; © The Pudding. |
| Opened | pudding.cool index; Pudding process post; Digital Humanities Now summary; Adafruit note (search excerpt); the essay URL returned a shell only. |

### 18. SBS "The Boat"

| Field | Record |
|---|---|
| Maker, year, status | SBS (Australia), illustrated by Matt Huynh from Nam Le's story; April 2015; live. |
| What it is | Interactive graphic novel on a 1975 refugee voyage; SBS's most successful interactive. |
| How it is structured | Six ink-panel chapters; 300 illustrations, 59 with animation/FX/layering; about a third of the 49-page story's text; archival photos and footage as side trips; sound (Sam Petty) and a song. Designed as a 20-minute experience. Built with scanned 2D art treated as 3D layers in a Three.js/WebGL engine; hand-lettered custom fonts; a multichannel sound engine that responds to scroll and lingering. |
| Interaction model | Scroll at your own pace or auto-scroll; panels sway with the sea; tap for archive; sound responds to position. |
| Content density | Medium; images do the heavy lifting; text cut hard. |
| Borrow for F1 | The exact **2.5D parallax grammar** the lead asked for — flat art on layers, scroll-driven, 20-minute chapters — applied to civilisations and movements (a workshop, a port, a salon). Archive side-trips as the "how we know". |
| Avoid | Cutting text to a third is right for a story, wrong for a dense reference; pair every Boat-style chapter with a reference page. |
| Licence / cost | Free to view; © SBS. Three.js is MIT (not opened here). |
| Opened | SBS page (shell only); Distil Immersive case study; SBS "sound and vision" feature (2015); Public Media Alliance note (search excerpts). |

### 19. Google Arts & Culture — Art Camera and Pocket Gallery

| Field | Record |
|---|---|
| Maker, year, status | Google; Art Camera 2016, Pocket Gallery 2018 (web version Oct 2021); live; 2,000+ partner institutions. |
| What it is | Gigapixel robotic capture (a 1 m² painting in ≈30 minutes) with zoom to brushstroke; curated 3D rooms ("impossible exhibitions": all 36 Vermeers, lost Bauhaus buildings, Chauvet cave, Indian miniatures with 75+ in-painting tours) with audio tours. |
| How it is structured | Partner → collection → item (zoomable) → "stories" (slide-like narratives); Pocket Galleries as walkable rooms with wall labels; the app adds AR placement, time and colour browsing. |
| Interaction model | Pinch/scroll zoom; walk a room; tap a work; listen. |
| Content density | Medium; stories are short slides; items carry museum labels. |
| Borrow for F1 | **In-painting tours** (a sequence of zoom targets on one high-resolution image with a sentence each) — the 2D twin of the 3D station tour; good for textiles, manuscripts, prints, maps. |
| Avoid | Content is partner-owned and not downloadable or re-usable, so GA&C is a reference, not a source; building Pocket-Gallery-style 3D rooms is expensive. |
| Licence / cost | Free to view; images under partner copyright. |
| Opened | Google blog posts on Pocket Gallery on the web (2021) and Indian miniatures (2020); Shutterbug on Art Camera (2016) (search excerpts); GA&C Pocket Gallery project page (excerpt). |

### 20. IIIF and OpenSeadragon

| Field | Record |
|---|---|
| Maker, year, status | IIIF Consortium (Image API, Presentation API; 2011–); OpenSeadragon community viewer (6.1.0); live. |
| What it is | The open standard for delivering zoomable images and their structure/annotations, and the standard JavaScript viewer for them. |
| How it is structured | Image API: pixels by URL (region, size, rotation); Presentation API: manifests describing sequence (pages), structure and annotations, portable across viewers (OSD, Mirador, UniversalViewer). OSD supports DZI, IIIF, Zoomify, OSM/TMS tiles, multi-image layouts, custom UI and plugins. |
| Interaction model | Pan/zoom; page through; overlay annotations. |
| Content density | n/a. |
| Borrow for F1 | Serve every high-resolution open image (Smithsonian, Met, Rijksmuseum, Wikimedia Commons CC0 scans) through IIIF/OSD and author zoom-target tours over them — the open equivalent of Art Camera. Many museums already publish IIIF manifests, so no re-hosting is needed for those. |
| Avoid | Tile generation and hosting for images that are not already IIIF-served; keep to institutions with manifests. |
| Licence / cost | Open specification; OSD is open-source (licence file not opened). |
| Opened | openseadragon.github.io; iiif.io "How IIIF works". |

### 21. BBC / British Museum — "A History of the World in 100 Objects" (2010)

| Field | Record |
|---|---|
| Maker, year, status | BBC Radio 4 + British Museum; 2010; site archived (lists and audio still available; the Flash 3D "object explorer" is defunct). |
| What it is | 100 × 15-minute programmes by Neil MacGregor, each on one object, from the earliest tool to a solar lamp; the site added 1,000+ objects from 500+ UK museums and 5,000+ from the public. |
| How it is structured | Object page = deep-zoom image + the programme audio + text; browse the 100 by series; filter all objects by culture, material, time, theme and colour; the original explorer placed objects in a 3D time tunnel with morphing filters, keyboard-navigable, with an HTML fallback. Schools' "Relic Challenge" asked students to add their own objects. |
| Interaction model | Filter, click, zoom while listening. |
| Content density | High: 15 minutes of narrative per object plus the long tail. |
| Borrow for F1 | The **filter set** (culture · material · time · theme · colour) across all objects; "zoom while you listen"; and a learner-contributed object layer. Note that the format is object-led — F1 should pair each object with its civilisation/movement page so the object is a door, not the destination. |
| Avoid | Platform lock-in (Flash killed the explorer); plan HTML-first. |
| Licence / cost | BBC/BM © ; audio free to stream. |
| Opened | BBC "About" page and 100-objects list; developer's write-up of the explorer (search excerpts). |

---

## The evidence on "guess, then find out"

Six source sets were opened (full citations in Sources). The question for F1 is narrow: should a unit ask learners to predict or guess before a reveal, and if so in what form?

**(a) Guided versus minimally guided instruction.** Kirschner, Sweller and Clark (2006) argue from working-memory limits that novices learn less from unguided search than from direct guidance (worked examples, explanations), and that the advantage of guidance recedes only once prior knowledge is high (expertise reversal). Alfieri, Brooks, Aldrich and Tenenbaum's 2011 meta-analysis (164 studies) quantifies it: unassisted discovery loses to explicit instruction (d = −0.38 across 580 comparisons), while **enhanced discovery** — discovery with feedback, worked examples, scaffolding or elicited explanation — beats other instruction (d = +0.30 across 360 comparisons). The dividing line is not "active vs passive" but "supported vs unsupported". A typed, open-ended "work it out" lab with no scaffold is on the wrong side of that line; a brief prompt followed immediately by the answer is on the right side.

**(b) Pretesting and prediction.** Richland, Kornell and Kao (2009) showed, across five experiments with a science text, that attempting questions before reading improved later recall even though almost every pretest answer was wrong. Pan and Carpenter's 2023 review of 60+ papers confirms the effect for facts, texts, videos and lectures, reports an 8–9% final-exam gain on pretested content in a real course, and sets out the boundary conditions that matter for F1:

- The benefit is reliable for the **directly tested item**; for untested content it is inconsistent. With *text*, prequestions can narrow attention so non-prequestioned material suffers (Peeck 1970; Sagaria & Di Vesta 1978; summarised in Pan & Carpenter and in a 2018 JEP:Applied manuscript on conceptual pretests). With *video/lecture* the benefit tends to spread to untested content, probably because viewers cannot skip.
- **Multiple-choice pretests** with plausible lures (Little & Bjork 2016) extend the benefit to related information that cued-recall pretests do not reach — a point directly in favour of tap-to-choose over typed answers.
- **Feedback timing**: for paired associates the correct answer must follow immediately or the effect vanishes (Grimaldi & Karpicke 2012); for richer material the effect survives delays (Kornell 2014; Mera et al. 2025, where immediate feedback was still better than 24–48 h). Mera et al. report a consistent advantage of pretesting over read-only study.
- **Conceptual pretests** ("why did X happen?") did not improve conceptual understanding in the 2018 study; feedback turned them into memorised facts. Prediction works for facts, dates, places, materials, causes stated in the material — not for open interpretation.
- Learners **under-rate** pretesting even after benefiting (Huelser & Metcalfe 2012, in Pan & Carpenter), so the lead's worry that learners will not want to guess is real as a *perception*; it is not evidence that guessing fails.
- Across adulthood the effect is medium (d ≈ 0.35) and not moderated by age or by how content people are with their memory (a 2025 study in *Learning and Individual Differences*, read as an excerpt).

Brod (2021, *Psychonomic Bulletin & Review*) separates **predicting** from guessing: a prediction is a committed expectation about an outcome the learner has some basis for; its distinctive mechanism is **surprise** at a wrong answer, which pupil-dilation studies tie to better encoding (Brod et al. 2018; Breitwieser & Brod 2021 — generating examples did not produce the effect, only predicting). Brod et al. (2022) found a U-shape: memory is best for outcomes that were highly expected or highly unexpected, and the benefit over post-hoc "what did you think?" appears only when the prediction is made *before* the reveal. Practical reading: the prompt must come first, must ask for a commitment (one option, one marker, a confidence tap), and the reveal must be immediate and visible so the surprise lands.

**(c) Mayer's multimedia principles.** Mayer's 2024 review restates 15 principles from 200+ experiments. Four bear on the "animated lecture" plan: **segmenting** (break continuous animation into learner-paced steps), **signalling** (highlight what matters at each step), **coherence** (cut decorative material), **pre-training** (name the parts before the mechanism). Noetel et al.'s 2021 overview of 29 meta-analyses (1,189 studies) finds the largest effects for contiguity and signalling and robust effects for coherence and segmentation, and that good design matters most for complex material and for system-paced media (lectures, autoplay video) rather than self-paced pages. Cromley & Chen's 2025 meta-analysis of Mayer's corpus (g = 0.37 overall) finds large consistent effects for text + diagram, less consistent effects for animation, games and simulations on factual learning, and none for VR. Implication: 2.5D animation is justified where it shows a mechanism or a change over time (transfer outcomes), and should be segmented and signalled; it is not a substitute for a well-labelled still.

**(d) Retrieval practice.** Yang et al. (2021, *Psychological Bulletin*; 222 classroom studies, 48,478 students) put the classroom testing effect at g = 0.50; format did not moderate it significantly (multiple choice g = 0.57, short answer g = 0.64, free recall g = 0.24), feedback and repetition increase it, and benefits grow with duration. Adesope et al. (2017) and Agarwal et al. (2021) agree that practice tests beat restudy across levels and formats. So a short **post-segment quiz** (as in Discovery Tour: Ancient Greece) is the surest gain, and multiple choice is not a lesser form of it.

### What this says for F1, plainly

- **"Guess then find out" helps** when the guess is about a specific, stated fact or outcome; when the learner commits (one tap, a marker on a map or timeline, a choice among plausible options); when the answer follows within seconds and is shown, not just stated; and when the prompt targets the very segment that follows. Expect a small-to-medium gain on the asked item and some spill-over if options are plausible and the medium is video/animation rather than text.
- **It hurts, or is wasted,** when the prompt is open-ended or conceptual, when answers are typed prose (cost without added benefit; the evidence base is almost entirely choice or single-word responses), when the reveal is delayed past the segment, when prompts are so frequent that reading becomes a hunt for answers (text-narrowing), and when it replaces explanation rather than preceding it. Unassisted "work backwards" labs are the one form the meta-analytic evidence argues against.
- **The form it must take:** brief (one line), low-cost (one tap or one drag), one per segment or station, immediate visual feedback, then the explanation; followed later by a short retrieval quiz in the same format. Learners will not like it as much as it works; keep it light so dislike never becomes abandonment.

---

## Synthesis (≈550 words)

**Patterns across the set.** Every strong benchmark here shares the same skeleton: a *macro-structure that is spatial* (a map, a globe, a timeline, a room, a gallery, an object) and a *micro-structure that is a paced sequence of stops*. Discovery Tour calls them stations; Voyager calls them tour steps; Sketchfab numbers them; Snow Fall and The Boat use scroll positions; 80 Days and Brilliant use one screen per beat; Ciechanowski uses one demo per idea; Google's in-painting tours use zoom targets. Density is handled not by cutting content but by **chunking it** — ≈2,000 narrated words per Discovery tour, 2,000–3,000 words per Snow Fall chapter, 60–120 words per 80 Days beat, a paragraph per Voyager step — and by letting the reader set the pace. This is exactly what the segmenting and signalling evidence predicts should work, and it reconciles the lead's two demands: dense content, shown visually.

The second pattern is the **reference layer behind the story layer**. Civilopedia pairs every object with a long historical essay and hyperlinks; Discovery Tour: Greece pairs tours with Discovery Sites; Pentiment pairs scenes with a glossary; The Pudding pairs the essay with the whole archive; 100 Objects pairs each object with filters across culture, time, material and theme. Games that dropped the reference layer for agency (Viking Age) got thinner. F1's "object-heavy, movements thin" problem is a missing reference layer for non-objects: the fix is Civilopedia-style pages for civilisations, movements, places and events, each with its facts block, essay and links, and each reachable from the Atlas.

Third: **the interaction models that suit a dense visual programme are scrub, tap and step** — not type. Drag-to-rotate and slider-to-reveal (Ciechanowski, Voyager), tap-a-hotspot (Sketchfab, model-viewer), tap-to-choose (80 Days, Brilliant, Trust), scroll-to-reveal (Snow Fall, The Boat), step-through tours (Voyager, Discovery Tour). The pretesting evidence says these are also the *right* forms for prediction: one committed tap before a reveal, immediate visible feedback, then a short retrieval quiz after the segment. Typed prose answers and open "work backwards" labs have the worst evidence and the highest friction; multiple-choice with plausible lures has the best spill-over.

**Adopt first (in order):**

1. **Rebuild the unit method as "station tours" with one-tap predictions.** Each unit = a spatial frame (map/timeline/object) + 6–12 stations; a station = one idea, one visual, 100–200 words or 60–90 s narration, optionally preceded by a one-tap prediction and closed by one retrieval question in the same format. This keeps the lead's visual-first wish and the evidence's "brief, committed, immediate" conditions. Drop typed answers.

2. **Stand up the open 3D/2D object stack now and stop depending on Sketchfab.** Smithsonian Voyager (Apache 2.0) for authored object tours; `<model-viewer>` (Apache 2.0) for light hotspot views; IIIF/OpenSeadragon for deep-zoom images; models and images only from CC0/CC BY/CC BY-SA sources (Smithsonian Open Access 3D, museum IIIF manifests, Wikimedia Commons), downloaded and self-hosted. The August 2026 sale of Sketchfab to KitBash and the UK H3DAR report make this urgent; many museum uploads are BY-NC and ineligible anyway.

3. **Add the reference layer for non-objects**: Civilopedia-style pages for every civilisation, movement, place and event, with the 100-Objects filter set (culture · material · time · theme · place) across the Atlas, and the Humankind era × culture matrix as the timeline's navigation.

4. **Use 2.5D scroll chapters (The Boat / Snow Fall grammar) for events, movements and civilisations**, segmented into reader-paced steps with signalled highlights, 20 minutes per chapter, each chapter linked to its reference page and ending with a short quiz. Use Ciechanowski-style scrub sliders only where a mechanism or change over time must be *seen* — looms, presses, kilns, trade routes — since animation's advantage is on transfer, not facts.

---

## Sources opened

All opened on 3 October 2026. "Excerpt" means the page was read through a search tool's returned extract rather than a full fetch.

| URL | What it is |
|---|---|
| https://news.ubisoft.com/en-us/article/46PlC3yAeikjDI652TayLm/assassins-creed-origins-discovery-tour-qa-with-historian-maxime-durand | Ubisoft Q&A with historian Maxime Durand on Discovery Tour: Ancient Egypt (tours, stations, word budgets) |
| https://store.steampowered.com/app/775430/Discovery_Tour_by_Assassins_Creed_Ancient_Egypt/ | Steam store page (price, release date, 75 tours) |
| https://assassinscreed.fandom.com/wiki/Discovery_Tour:_Ancient_Greece | Wiki page listing 30 tours, themes, guides, quizzes and Discovery Site texts |
| https://www.pcgamesn.com/assassins-creed-valhalla/discovery-tour-review-viking-age | Review of Discovery Tour: Viking Age (quest structure, pacing) |
| https://www.thegamer.com/assassins-creed-valhalla-interview-discovery-tour-viking-age/ | Developer interview on the move to quests |
| https://www.civilopedia.net/en-US/gathering-storm/civilizations/civilization_china/ | Civilopedia China entry (gameplay + historical context structure) |
| https://civilization.fandom.com/wiki/Civilopedia | Wiki page on the Civilopedia in Civ VI |
| https://humankind-encyclopedia.games2gether.com/en-us/fame-cultures/game-content/cultures | Humankind Encyclopedia cultures page |
| https://en.wikipedia.org/wiki/Humankind_(video_game) | Wikipedia article (eras, culture choice) |
| https://worldhistorycommons.org/minecraft-education | World History Commons review of Minecraft Education for history |
| https://education.minecraft.net/en-us/blog/sift-through-the-sands-of-time-with-new-egyptian-history-lessons | Minecraft Education Egypt Toybox lessons (excerpt) |
| https://education.minecraft.net/en-us/blog/soanes-museum-portals-to-the-past | Soane's Portals to the Past world (Jan 2026) (excerpt) |
| https://www.blockbuilders.co.uk/projects/portals-to-the-past | Block Builders case study (excerpt) |
| https://www.gamedeveloper.com/business/-i-80-days-i-building-the-perfect-text-adventure-for-mobile | Game Developer on 80 Days' structure and pacing |
| https://middleagesinmoderngames.net/mamg25/teaching-the-16th-century-with-pentiment/ | Teaching note on Pentiment (June 2025) |
| https://gamerant.com/pentiment-accessibility-features-good-fonts-glossary/ | Pentiment glossary and typeface features |
| https://github.com/Smithsonian/dpo-voyager | Voyager repository (Apache 2.0; components) |
| https://smithsonian.github.io/dpo-voyager/story/usage/tours-task/ | Voyager Story docs: Tours task |
| https://smithsonian.github.io/dpo-voyager/explorer/ | Voyager Explorer docs index |
| https://3d.si.edu/open-source-resources | Smithsonian 3D open-source resources (Voyager, Cook, 3D API) |
| https://www.cgchannel.com/2020/03/get-2000-free-3d-models-from-the-smithsonian-collection/ | CG Channel on the 2020 CC0 3D release |
| https://sketchfab.com/3d-models/the-rosetta-stone-1e03509704a3490e99a173e53b93e282 | British Museum Rosetta Stone model page (CC BY-NC-SA) |
| https://hyperallergic.com/1700-3d-models-of-cultural-heritage-objects-now-available-in-public-domain/ | Hyperallergic on Sketchfab's CC0 cultural-heritage launch (2020) |
| https://sketchfab.com/blogs/community/sketchfab-update-what-you-need-to-know-now-that-fabs-live/ | Sketchfab blog, Oct 2024 (excerpt) |
| https://sketchfab.com/blogs/community/fab-publishing-portal-open-for-sketchfab-migration/ | Sketchfab blog on licences not supported on Fab (excerpt) |
| https://sketchfab.com/blogs/community/kitbash-acquires-sketchfab-and-artstation/ | Sketchfab blog on the KitBash acquisition, 10 Aug 2026 (excerpt) |
| https://www.mdpi.com/2571-9408/8/3/99 | Heritage (MDPI) 2025 paper on the post-Sketchfab era (excerpt) |
| https://commons.wikimedia.org/wiki/Commons:UK_Heritage_3D_Data_at_Risk/UK_Heritage_3D_Data_at_Risk_Final_Report_August_2026 | UK Heritage 3D Data at Risk final report, Aug 2026 (excerpt) |
| https://www.3dnatives.com/en/scan-the-world-open-source-3d-models-of-cultural-artifacts-230420215/ | 3Dnatives on Scan the World (2021) |
| https://www.myminifactory.com/scantheworld/faq/ | Scan the World FAQ on licences (excerpt) |
| https://www.myminifactory.com/object/3d-print-statue-52582 | Sample Scan the World object page showing BY-NC-SA (excerpt) |
| https://modelviewer.dev/examples/annotations/ | model-viewer annotations/hotspot examples |
| https://github.com/google/model-viewer | model-viewer repository (Apache 2.0; v4.3.1) |
| https://ciechanow.ski/mechanical-watch/ | Ciechanowski, Mechanical Watch (2022) |
| https://ciechanow.ski/bicycle/ | Ciechanowski, Bicycle (2023) |
| https://learn-ui.com/chapters/explaining/explorable-explanations | Chapter analysing Ciechanowski's method (excerpt) |
| https://news.ycombinator.com/item?id=27000223 | Hacker News thread quoting the author on bare WebGL (excerpt) |
| https://explorabl.es/ | Explorable Explanations hub |
| https://ncase.me/ | Nicky Case homepage |
| https://ncase.me/trust/ | The Evolution of Trust |
| https://github.com/ncase/trust | Trust repository (CC0; libraries) |
| https://ncase.me/projects/ | Case's project list (incl. the 2019 guessing experiment, not opened) |
| https://ncase.me/StanfordTalk/transcript.html | "How to explain things real good" transcript (excerpt) |
| https://blog.brilliant.org/hand-crafted-machine-made/ | Brilliant blog on learning-game authoring (Jan 2025) (excerpt) |
| https://brilliant.org/help/features/how-do-i-use-interactives-on-brilliant/ | Brilliant help: interactives and math keyboard (excerpt) |
| https://brilliant.org/faq/ | Brilliant FAQ (excerpt) |
| https://www.mdpi.com/2078-2489/9/5/123 | Information (MDPI) 2018 case study of Snow Fall (excerpt) |
| https://source.opennews.org/articles/how-we-made-snow-fall/ | Source/OpenNews "How we made Snow Fall" (excerpt) |
| https://thinkspace.csu.edu.au/readreflectreimagine/2024/08/12/snow-fall-a-critical-review/ | Critical review of Snow Fall (2024) (excerpt) |
| https://www.nytimes.com/2022/12/23/insider/snow-fall-at-10-how-it-changed-journalism.html | NYT retrospective (excerpt) |
| https://pudding.cool/ | The Pudding index (essay cadence and topics) |
| https://pudding.cool/process/how-to-make-dope-shit-part-1/ | Pudding process post on workflow |
| https://pudding.cool/2026/06/menu-story/ | Menu-history essay — JS shell only, not readable |
| https://digitalhumanitiesnow.org/2026/07/5000-restaurant-menus-years-1880-1920/ | Digital Humanities Now summary of the menus explorer |
| https://blog.adafruit.com/2026/07/15/the-pudding-presents-a-history-of-restaurant-menus/ | Adafruit note listing the ten dishes (excerpt) |
| https://www.sbs.com.au/theboat/ | The Boat — shell only |
| https://distil.im/projects/the-boat | Distil Immersive case study (tech, structure) (excerpt) |
| https://www.sbs.com.au/whats-on/article/the-sound-and-vision-of-the-boat/67xsuhjh5 | SBS feature on making The Boat (2015) (excerpt) |
| https://www.publicmediaalliance.org/best-psm-boat-sbs/ | Public Media Alliance note (chapters, archive) (excerpt) |
| https://blog.google/company-news/outreach-and-initiatives/arts-culture/explore-impossible-exhibitions-3d/ | Google on Pocket Galleries on the web (2021) (excerpt) |
| https://blog.google/company-news/inside-google/around-the-globe/google-asia/india-miniature-masterpieces/ | Google on Indian miniatures (Art Camera, in-painting tours) (excerpt) |
| https://www.shutterbug.com/content/google%E2%80%99s-new-gigapixel-camera-digitizes-fine-artworks-greater-detail-ever | Shutterbug on Art Camera (2016) (excerpt) |
| https://artsandculture.google.com/project/pocket-gallery | GA&C Pocket Gallery project page (excerpt) |
| https://openseadragon.github.io/ | OpenSeadragon home (6.1.0; tile sources) |
| https://iiif.io/get-started/how-iiif-works/ | IIIF plain-language guide |
| https://www.bbc.co.uk/ahistoryoftheworld/about/ | BBC "A History of the World" About page (excerpt) |
| https://www.bbc.com/ahistoryoftheworld/about/british-museum-objects/ | List of the 100 objects (excerpt) |
| https://www.spikything.com/blog/index.php/2010/01/19/a-history-of-the-world/ | Developer write-up of the object explorer (excerpt) |
| https://www.corelearn.com/files/Archer/Constructivism-discov_learn.pdf | Kirschner, Sweller & Clark 2006, PDF copy (excerpt) |
| https://app.nova.edu/toolbox/instructionalproducts/edd8124/articles/2011-Alfieri_et_al.pdf | Alfieri et al. 2011 meta-analysis, PDF (excerpt) |
| https://pubmed.ncbi.nlm.nih.gov/19751074 | Richland, Kornell & Kao 2009 abstract (excerpt) |
| https://pmc.ncbi.nlm.nih.gov/articles/PMC8642250/ | Brod 2021, "Predicting as a learning strategy" (excerpt) |
| https://link.springer.com/article/10.3758/s13423-022-02124-x | Brod et al. 2022 on explicit prediction and expectancy violation (excerpt) |
| https://link.springer.com/article/10.1007/s10648-023-09814-5 | Pan & Carpenter 2023 review of prequestioning/pretesting (opened) |
| https://pmc.ncbi.nlm.nih.gov/articles/PMC12292081 | Mera, Dianova & Marin-Garcia 2025 on feedback timing (opened) |
| https://sc-pan.github.io/pdf/PS_2021.pdf | Pan & Sana 2021, pretesting vs posttesting (excerpt) |
| https://psycnet.apa.org/manuscript/2018-19972-001.pdf | JEP: Applied 2018 manuscript on conceptual pretests (excerpt; authorship inferred from citing sources) |
| https://www.ingentaconnect.com/content/routledg/pmem/2019/00000027/00000009/art00003 | St. Hilaire, Carpenter & Jennings 2019 on integrative prequestions (excerpt) |
| https://www.sciencedirect.com/science/article/abs/pii/S1041608025000597 | 2025 study: pretesting effect across adulthood (d = 0.35) (excerpt) |
| https://link.springer.com/article/10.1007/s10648-023-09842-1 | Mayer 2024 review of the cognitive theory of multimedia learning (excerpt) |
| https://sage.cnpereading.com/doi/10.3102/00346543211052329 | Noetel et al. 2021 overview of reviews on multimedia design (excerpt) |
| https://exa.ai/library/publication/zvzhjczpdf1 | Cromley & Chen 2025 meta-analysis of Mayer's corpus (excerpt) |
| https://link.springer.com/article/10.1186/s40561-022-00200-2 | Çeken & Taşkın 2022 systematic review of multimedia principles (excerpt) |
| https://gwern.net/doc/psychology/spaced-repetition/2021-yang.pdf | Yang et al. 2021 classroom testing meta-analysis (excerpt) |
| https://journals.sagepub.com/doi/10.3102/0034654316689306 | Adesope et al. 2017 practice-testing meta-analysis (excerpt) |
| https://link.springer.com/article/10.1007/s10648-021-09595-9 | Agarwal et al. 2021 classroom retrieval-practice review (excerpt) |

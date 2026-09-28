# F1 Atlas Logic — nodes, views and groupings

2026-09-28 · @Mohammad AlFalasi

## Scope

This pass settles the Atlas's logic before the next deep dives fill it. It answers five questions:

1. Should F1 group the world by civilisation?
2. What other groupings exist, and which should the Atlas use?
3. What is a node, and what is a view?
4. Which of the eleven views can merge?
5. Should movements and other groupings get their own storytelling view?

It also sets how much each view shows at each depth.

It starts from the node model in [F1 Deep Dives 1 §3](https://claude.ai/code/artifact/fb8b1156-e84f-49b2-a97b-ff5fdadba58d). There, every node shares one card, and era, material, function and movement are relations between nodes rather than properties of an object. The eleven views under review are those listed in decision 16: map, globe, timeline, occurrences, connections, movements, inventions, compare, story, lineage and calendars.

**Assumed while the questions are open.** Q1–Q6 from Deep Dives 1 and P1–P11 from the groundwork are applied as recommended. In particular, the coverage floor and the two new world chapters (Q1) are assumed, because the groupings have to reach them.

## How others group the world's making

No major resource groups world making by civilisation alone. Museums group by region and period. Datasets group by polity, period definition or entity class. Historians group by network, horizon or culture area. Each grouping answers a different question and hides something else, so the Atlas needs several kinds of grouping, each labelled for what it is.

| Resource | Groups by | Good for | Weak for | What F1 takes |
|---|---|---|---|---|
| The Met's [Heilbrunn Timeline](https://www.metmuseum.org/toah/chronology) | Region × period: about fifty sub-regions, each with its own chronology | Coverage; seeing what was made at the same time elsewhere | Each cell hides the routes between cells | The coverage grid (Deep Dives 1 §2); a "meanwhile elsewhere" list on every period |
| [Smarthistory](https://smarthistory.org/) | Place (six continents), then chronology, plus curated guides; written by over 850 specialists | Readable expert essays | Continents as containers | Ring 2 links for Practice-depth reading |
| The British Museum and BBC, [*A History of the World in 100 Objects*](https://en.wikipedia.org/wiki/A_History_of_the_World_in_100_Objects) (2010) | Twenty time bands of five objects, each band framed as a question for the whole world | One object per place per era; a global question per band | A hundred objects is sparse | The time band with a question, as a story form for period nodes |
| [Google Arts & Culture](https://artsandculture.google.com/explore) | Facets: artists, mediums, art movements, historical events, historical figures, places | Faceted browsing across millions of items | "Art movements" follows Western art history | Facets become lenses; movement becomes one grouping kind among many |
| [Linked Art](https://linked.art/model/) (CIDOC-CRM) | Entities and events: objects, people and groups, places, concepts, periods, production activities | A shared data backbone with museum records | Not a teaching structure | The relation model (Deep Dives 1 §3) |
| [PeriodO](https://perio.do/en/) | Periods as scholarly definitions, each tied to the source that defined it, with its own place and span | Treating periods as claims, not facts; public domain | Not a narrative | The period node is a definition by a source; one label can have several definitions |
| [Seshat](https://seshat-db.com/) and [Cliopatria](https://zenodo.org/records/13363121) | Polities: Seshat codes over 500; Cliopatria maps polity borders from 3400 BCE to 2024 CE | A political map that changes over time | States only; stateless peoples and their making drop out | A polity grouping and a borders layer, with that limit stated on screen |
| Wikidata | Classes: civilisation, archaeological culture, art movement, historical period, dynasty, historical country | Identifiers that join every dataset above | Classes used inconsistently | Identifiers and Ring 3 browsing |
| Culture areas (Wissler and Kroeber, early 20th century) | Contiguous regions sharing traits and environments; the idea [began as a way to arrange museum displays](https://en.wikipedia.org/wiki/Cultural_area) | Linking making to environment | Boundaries criticised as arbitrary and static | An environment lens (biomes), not territory boxes |
| Archaeological [horizons](https://en.wikipedia.org/wiki/Horizon_(archaeology)) | A style found across a wide area within a short time, such as the Andes' Early, Middle and Late Horizons (Chavín; Wari and Tiwanaku; Inca) | Influence across polities | Tells little about makers | A "horizon" grouping kind |
| World-systems history, e.g. Abu-Lughod, [*Before European Hegemony*](https://www.english.upenn.edu/sites/www.english.upenn.edu/files/AbuLughod-TheWorldSystem.pdf) (1989) | Overlapping trade circuits linking Flanders to China, about 1250–1350 | Networks as the unit of history | Makers appear as traders' goods | The network grouping behind F1.13 |
| Civilisational schemes: Toynbee (21 civilisations and five "arrested" ones); Huntington (the "highest cultural grouping of people") | Large, bounded cultural wholes | Familiar words; the big picture | Essentialist, ranked, prone to "rise and fall" | Taught in F1.3 as historiography, not used to structure the Atlas |
| [Graeber and Wengrow, ](https://en.wikipedia.org/wiki/The_Dawn_of_Everything)[*The Dawn of Everything*](https://en.wikipedia.org/wiki/The_Dawn_of_Everything) (2021) | No single grouping: they argue there was "no single original form of human society" and that neighbours often defined themselves against each other | Groupings as relations people chose, not containers | Not a data model | Membership in any grouping is a claim with a confidence, and may be contested |

**What the benchmarks agree on.** The strongest resources group in more than one way at once. Place and time come first, and every grouping beyond them is labelled for what kind of grouping it is and who defined it.

## Civilisations

The word belongs in F1, but as a label learners search for and a subject F1 teaches, not as the frame the Atlas is built on. Used as a frame, it would drop exactly the makers F1 is meant to recover: the foragers who made pottery 20,000 years ago, Pacific navigators, steppe metalworkers, Nok's farming communities.

**The case for it**

- Learners, museums and heritage listings use it: "Maya civilisation", "Indus Valley civilisation". A learner who cannot find those names will think they are missing.
- It names something real at a large scale: scripts, cities, monumental building and styles that lasted for centuries across many polities.
- It gives newcomers a first handhold before the finer groupings.

**The case against it**

- **It was built to rank.** The word was coined in French in 1757 and set against "barbarism". It was later used to justify colonial rule; settlers in Australia, for example, claimed Indigenous Australians were "not civilised enough" to own the land ([summary with sources](https://en.wikipedia.org/wiki/Civilization)).
- **It makes cities and writing the entry ticket.** Childe's criteria for civilisation (cities, surplus, writing, specialists) turn the recurrences of F1.5 into a test some peoples pass and others fail.
- **It excludes great makers.** The Frankfurt project found that Nok was made by semi-sedentary farming communities organised mainly around families, not by a complex state ([DFG summary](https://gepris.dfg.de/gepris/projekt/107422281?language=en&selectedSubTab=2)). Nok still produced one of Africa's great sculptural traditions. Making does not need a civilisation.
- **It implies bounded wholes that rise and fall.** That hides the networks (F1.13) and the living practices that outlast any state (Igun Street, Great Zimbabwe's masonry).
- **Recent scholarship moved away from it.** Graeber and Wengrow argue there was "no single original form of human society", and that large, complex societies lived for millennia without central rulers.

**Three ways F1 could use the word**

| Option | What it means | Gains | Costs |
|---|---|---|---|
| A. Civilisation as the main organiser | The Atlas and the world chapters are built from named civilisations | Familiar; easy to search | Ranks and excludes; contradicts F1.3, F1.5 and F1.6 |
| B. A labelled grouping kind and a search name (recommended) | Well-known names exist as "civilisation, as commonly named" and open onto the groupings underneath; F1.3 teaches the word's history | Learners find what they look for, then see how it is built | Needs a caveat card and careful copy |
| C. Drop the word | Only the precise groupings are used | Clean | Learners cannot find "Maya civilisation"; the history of the word goes untaught |

**How option B works.** Each common civilisation name opens a card that shows what it is made of and what it leaves out.

| Common name | What sits underneath | What the card says is left out |
|---|---|---|
| Indus Valley civilisation | An archaeological culture (Harappan) and its phases; cities; an undeciphered script (F1.5) | Its neighbours; whether the signs are writing |
| Egyptian civilisation | A polity with dynasties; periods defined by Egyptologists; the Nile valley | Nubia and Kush, which Egypt fought, traded with and was ruled by |
| Maya civilisation | A culture area of city-states, a writing system, periods (Preclassic to Postclassic) | Present-day Maya communities and their making |
| Andean civilisation | Horizons (Chavín; Wari and Tiwanaku; Inca) and the polities between them | The coast and the Amazon slopes (the Upano cities) |
| Chinese civilisation | Many polities and dynasties, with a script that ran through them | Peoples at the edges, and the steppe |
| Islamic civilisation | A belief tradition and a network of cities and routes (F1.10) | Non-Muslim makers within it, and its African and Asian peripheries |
| Greek and Roman civilisation | Polities, a shared material horizon around the Mediterranean | Enslaved makers; the North African and West Asian halves of the Roman world |
| Swahili civilisation | A coastal network of towns trading across the Indian Ocean | The interior that supplied it (Great Zimbabwe's gold) |

**The rules that go with it.** A civilisation card is never ranked against another. It carries no "rise and fall" story unless the evidence supports that story. It always links to the peoples next to it who were not part of it. And the word never appears in the Atlas's own navigation, only as a searchable label.

## The grouping families

F1 can use twenty kinds of grouping, in seven families. Every grouping is a node with the common card, plus four things of its own: its **kind**; **who defined it** (an archaeologist, a museum, the members themselves); **membership** as a relation with its own confidence; and **what it leaves out**. Groupings overlap and nest. One Benin plaque belongs at once to a polity (the Kingdom of Benin), a maker community (the Igun Eronmwon guild), a material family (copper alloy), a technique (lost-wax casting), a network (the Atlantic brass route) and a period (1500s–1600s).

| Family | Kind | Membership rule | Defined by | Example in F1 | Shown in |
|---|---|---|---|---|---|
| Place | World region and sub-region | Where the thing was made or found | F1, after the Heilbrunn regions | West Africa: Guinea Coast | Map; coverage grid |
| Place | Culture area | Shared traits within a contiguous area | Anthropologists and museums | The Maya area | Map; grouping view |
| Place | Environment (biome) | The setting that shaped the making: desert, steppe, rainforest, ocean, mountain, river, ice | F1, from environmental data | Pacific ocean making; steppe felt | Map lens |
| Time | Period | A span defined by a named source for a named region | Specialists; gazetteered by PeriodO | Heian; Classic Maya; Nok's three phases | Timeline |
| Time | Period band | F1's eleven global bands, for coverage and comparison only | F1 | 1000 BCE–1 CE | Timeline; coverage grid |
| Time | Age | A technology sequence (Stone, Bronze, Iron), always tied to the region it was defined for | Archaeologists, region by region | The Iron Age of the Sahel | Timeline, with its region shown |
| Time | Horizon | One style spread widely in a short time | Archaeologists | The Andes' Middle Horizon (Wari, Tiwanaku) | Map and timeline together |
| People | Polity | Ruled by, or living under, a state, kingdom, empire or city-state | Historians; Seshat and Cliopatria | The Kingdom of Benin; the Kushite kingdom | Map borders layer |
| People | Dynasty | Made under a ruling house | Historians | Shang; Mamluk | Timeline |
| People | Archaeological culture | Shared material traits in excavated sites | Archaeologists | Nok; Vinča; Lapita | Map; grouping view |
| People | Community or people | Self-identified group, named in its own terms first | The community | The Edo; the Haya | Grouping view, with protocol |
| People | Maker community | Trained or working together: guild, workshop, caste, lineage, cooperative | The makers, or records of them | The Igun Eronmwon guild; the Mughal karkhana | Lineage; grouping view |
| People | Belief tradition | Made for or within a religion or practice | Specialists and practitioners | Buddhist printing; Ethiopian Christianity | Grouping view |
| Ideas | Movement | Declared itself, with a programme and members | Its members | Arts and Crafts; Mingei; the Bauhaus | Grouping view |
| Ideas | Style | A formal family, usually named later | Historians | Gothic; Chavín style | Compare; grouping view |
| Ideas | School | Passed from teacher to pupil | Records and practitioners | Kano school painting | Lineage |
| Connections | Network | Linked by routes of goods, materials, skills or people | Historians | The Indian Ocean; the Atlantic | Globe; connections |
| Connections | Interaction sphere or diaspora | Linked by shared exchange or by people who moved | Archaeologists and historians | Swahili coast towns; the Sogdian merchants | Connections; grouping view |
| Things | Material, technique, function and object type | Made of, made with, made for, made as | Getty AAT; F1's function list | Copper alloy; lost-wax casting; storage; bowls | Lenses on every view |
| Composite | Civilisation, as commonly named | A searchable name that opens onto the groupings beneath it (§3) | Common usage | Indus Valley civilisation | Search; grouping view with a caveat card |

**Two rules that keep groupings honest**

- **Ages belong to regions.** The Stone, Bronze and Iron Age sequence was built on European evidence. Indigenous American makers did not smelt iron before European contact, and F1.6 shows iron following stone in much of Africa. An age label always carries the region it was defined for, like any other period.
- **Membership can be contested.** Cleveland's Nok head is placed in a "Nok-culture style region", yet its date falls after Nok ends. When membership is argued, the relation shows the contested line, exactly as a claim would.

**Functions deserve their own list.** You asked about grouping by function, and no standard list fits making across all of history. F1's working list has twelve: shelter, clothing and adornment, food and storage, tools, record and writing, exchange and value, ritual and belief, rule and display, war, play and music, care and access, and transport. It is used as a lens and tested in the deep dives.

## Nodes, groupings, views, lenses and stories

Your question was whether nodes and views play different roles. They do. Nodes are the content: things, places, people and ideas, each with its own card. Views are layouts of that content. Groupings sit in between: they are nodes in their own right, and they also gather other nodes, so a grouping can be read as a page and used as a filter.

| Term | What it is | Example |
|---|---|---|
| Node | One thing with its own identity and card | The Benin plaque; Meroë; lost-wax casting |
| Grouping | A node whose members are other nodes; any of the twenty kinds in §4 | The Igun Eronmwon guild; Mingei; the Indian Ocean |
| Relation | A typed link between two nodes, with its own source and confidence | Made of copper alloy (documented) |
| Surface | A layout of nodes by one kind of relation (what decision 16 called a view) | Place lays out "made at" |
| Mode | A setting of a surface | Time in "first known" mode |
| Lens | A filter or colouring applied to any surface | Function: storage |
| Story | An authored walk through nodes that plays over any surface | F1.6's eight steps |

**Which views merge.** Most of the eleven views are the same layout with different settings. Merging them gives learners fewer places to learn and fewer screens to build.

*[Embedded: node/dbd1ec39-f029 — the eleven views of decision 16 mapped onto the proposed surfaces]*

- **Place** joins the map and the globe. They show the same relation ("made at", "found at", "held at") in two projections; the globe is the projection for oceans and long routes.
- **Time** joins the timeline, occurrences, inventions and calendars. Occurrences are events on the same scale; inventions become a "first known" mode that obeys the "earliest known" rule; calendars are a change of scale. F1.5's simultaneity view is Time with one row per region.
- **Connections** joins connections and lineage. Both are graphs; lineage filters to "learned from", "copied from" and "descends from".
- **Compare** stays as it is: two to six nodes side by side, read through the same six readings.
- **Grouping pages** replace the movements view, and they cover every kind of grouping, not only movements (§6).
- **Story** becomes a layer rather than a view: the same walk can move across the map, down the timeline and into a grouping page.
- **Lenses** apply everywhere. They carry the groupings of the Things family (material, technique, function, object type), plus belief, environment and the body-and-access lens from sprint 6.

**What ships first.** Place, Time (objects and events), Connections (routes), Story and Grouping pages. The globe projection, Compare, the "first known" and calendar modes, and lineage follow by version. This replaces gate question C1's "six views first", and it stays within the same build size.

**On the phone.** Place, Time, Grouping pages and Story. Connections becomes a list of links, and Compare is kept for the desk.

## The grouping page: a story for every grouping

Yes, major movements should have their own view, and so should cultures, networks, guilds, horizons and civilisation names. One page design serves all of them. Each page tells its grouping as a story, and each step lights up the grouping's members on a small map and timeline beside the text.

**What every grouping page holds**

1. **The card.** Its kind, who defined it and when, its span and places, how sure membership is, and what it leaves out.
2. **The walk.** 6–9 authored steps through its members, in order. Each step moves the small map and timeline, and any step can open the full Place, Time or Connections surface.
3. **Members.** Every member node as a grid, filterable by any lens (material, function, belief…), with contested members marked.
4. **Neighbours and counterparts.** The groupings it defined itself against, and the parallel groupings elsewhere.
5. **Afterlives.** Revivals, living practice, and how it is sold or remembered today.
6. **What is argued.** The claims under dispute, both readings shown.
7. **Apply hook.** The task in the unit that uses it.

**Worked example: Mingei, a movement**

| Part | Content |
|---|---|
| Card | Movement; named by Yanagi Sōetsu in the mid-1920s; Japan, 1920s–1950s and after; members documented; leaves out the anonymous makers it championed, who did not choose the label |
| 1 | Korean ceramics, 1910s: Yanagi and fellow collectors value Joseon wares; the movement's first ideas are formed on another country's craft |
| 2 | The word, mid-1920s: *mingei*, "folk crafts"; a 1926 prospectus for a museum |
| 3 | The unknown maker: the ideal of beauty in everyday things by anonymous rural craftspeople |
| 4 | Named makers: the potters Hamada Shōji and Kawai Kanjirō, and the potter Bernard Leach, as the movement's public faces |
| 5 | The museum, 1936: the Japan Folk Crafts Museum in Komaba, Tokyo, designed by Yanagi |
| 6 | Collecting across an empire: journeys to Korea (1936–37) and Okinawa (1938–39) |
| 7 | The argument: historians such as Kim Brandt read Mingei as entangled with Japanese imperial policy; others stress its resistance to industrial uniformity |
| Neighbours | Arts and Crafts in Britain (its acknowledged source); parallel craft revivals elsewhere, set side by side in Compare |
| Afterlives | Studio pottery worldwide; "mingei" as a design and retail label today |
| Sources | [SamuraiWiki summary with references](http://samurai-archives.com/w/index.php?mobileaction=toggle_view_mobile&title=Mingei); [review of Brandt, ](https://asian.fiu.edu/jsr/combined.pdf)[*Kingdom of Beauty*](https://asian.fiu.edu/jsr/combined.pdf) (to be replaced by the museum's own and scholarly sources in the unit spec) |

The tension between step 3 and step 4 carries the lesson: a movement that praised the unknown maker became famous through named ones. Brandt's reviewer flags the same conflict.

**The same page, other kinds**

| Grouping | Kind | Where the walk goes | What the card warns |
|---|---|---|---|
| Nok | Archaeological culture | From the tin mines where terracottas were first found, to the Frankfurt excavations, to the three phases, to the looting | Membership of museum pieces is often contested; the date of Cleveland's head falls outside Nok |
| The Igun Eronmwon guild | Maker community | Oral history of its founding, the Oba's patronage, 1897, the return to Igun Street, the guild today | The guild's own account comes first; museum records second |
| The Middle Horizon | Horizon | Wari and Tiwanaku, the tapestry tunic (the Met's Wari tunic, WS-007), roads and shared imagery | A horizon is a spread of style, not an empire |
| Indus Valley civilisation | Civilisation, as commonly named | Its cities, weights and seals, the signs and the argument over them, then its neighbours | What the name hides; the card links to the groupings underneath (§3) |
| The Indian Ocean | Network | The monsoon, ports, cotton and ceramics, people who moved, and those moved by force | Human movement is never drawn as goods (the sprint 5 rule) |

**Which groupings get a page.** Ring 1 gets full pages, with a walk, for every grouping a unit teaches: about 60 across F1, counting roughly five per world chapter, a dozen movements and schools, six networks and a dozen civilisation cards. Ring 2 gets a card and a member grid without a walk, for any grouping with at least five verified members and a source. Ring 3 gets a card that links out to Wikidata or PeriodO.

## How much each surface shows at each depth

The Atlas grows with the learner rather than showing everything at once. At Orientation it shows a few dozen things with a line each. At Mastery it shows everything, with its sources and arguments. The rule underneath is the node card's four tiers (Deep Dives 1 §3): Orientation reads the line and label, Practice adds the story, Mastery adds the deep text and the claims.

| Surface | Orientation | Practice | Mastery |
|---|---|---|---|
| Place | The 60 Ring 1 objects as pins, a line on hover | Ring 2 nodes added; labels; one lens at a time | Ring 3 through search; the polity borders layer; each relation's source and confidence |
| Time | Eleven period bands with two or three anchor objects each | Every Ring 1 and 2 node; events; rows by region | Competing period definitions (PeriodO); "first known" mode with its claims; other calendars |
| Connections | Three routes, told as F1.13's story | Networks with goods, materials, skills and people as separate layers | The full graph; lineage; provenance edges; export |
| Compare | Not shown | Two or three nodes, three readings | Up to six nodes, six readings, with claims |
| Grouping pages | The card, the line and three members | The walk, the members and the neighbours | What is argued; sources; membership confidence; links out |
| Story | Walks of five steps | Walks of six to nine steps | Learners write their own walks (F1.27, Atlas authoring) |

**Rules that keep it readable**

- No more than seven colours or categories on screen at once.
- One lens at a time at Orientation; up to three at Mastery.
- Each Orientation unit introduces at most one new surface.
- Pins cluster beyond about 60 on screen, and clusters open on tap.
- Every surface has a list alternative with the same content, for screen readers and for anyone who prefers reading to looking (the Accessibility thread).

## Decisions and what changes

| # | Decision | Recommendation |
|---|---|---|
| Q7 | How F1 uses "civilisation" | As a labelled grouping kind and a search name, never as the Atlas's frame; F1.3 teaches the word's history (option B, §3) |
| Q8 | The grouping families | Adopt the twenty kinds, each with its kind, who defined it, membership confidence and what it leaves out; ages always tied to a region (§4) |
| Q9 | Merging the views | Eleven views become five surfaces (Place, Time, Connections, Compare, Grouping pages), a story layer and lenses. Ship first: Place, Time, Connections, Story and Grouping pages. This replaces C1 (§5) |
| Q10 | Grouping pages | One page design for every kind of grouping, not only movements; about 60 full pages at Ring 1 (§6) |
| Q11 | Grouping by function | Adopt the twelve-function list as a lens, tested in the deep dives (§4) |
| Q12 | Density by depth | Adopt the table and the five readability rules (§7) |

**What changes if these are agreed**

- The Atlas design moves to v2. The parts of F1 Pass 2 v2 §2–§3 that list eleven views are marked superseded.
- The mockups get a new iteration: the view switcher becomes Place, Time, Connections and Groupings, and a grouping-page artboard is added (Mingei on the desk, Nok on the phone).
- F1.3 gains a case, "civilisation as an argument", running from 1757 to Huntington to Graeber and Wengrow.
- The Glossary gains grouping, surface, lens, horizon, culture area, polity, archaeological culture and period definition.
- PeriodO and Cliopatria join the data sources as Ring 2 and Ring 3.
- The deep dives in F1 Deep Dives 2 already use the grouping kinds, so each world names its groupings by kind.

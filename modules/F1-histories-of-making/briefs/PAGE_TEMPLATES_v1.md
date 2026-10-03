# Brief: the three F1 page templates, v1 (movement; civilisation and network; world band)

2026-10-04 · draft v1 for @Mohammad AlFalasi · follows AUDIT_CONTENT_2026-10-03 decision 3 and next step 2

The object got its rigour from the Historian's rules; the other three strands never did. This brief gives each of them a page type with rules of its own. It builds on the template-v3 standard of F1.17 and the grouping-page design of the Atlas doc. The worked model for the movement type is `grouping-pages/movements/mingei.md`. The Indus page and the band "1000 to 1400, Islamic world" follow as the models for the other two.

## 0. What the three types share

**Rings.** Ring 1 is a full page with a lecture storyboard. Ring 2 is a card: the facts block, three members, the neighbours line and one "argued" line, with no storyboard. Ring 3 is a link-out card: name, kind, the backbone ids and one line, linking to Wikidata, PeriodO, Pleiades or the holder. A page is written once at Ring 1; the card and the link-out are cut from its facts block, never written separately.

**Lenses.** The Movements lens opens movement pages. The Place lens opens civilisation and network pages; the Connections surface opens network pages too. The Time lens opens world band cards; a band card opens movement and civilisation pages from its bars and lines. Every page can also open from an object card, through the relation that joins them.

**Blocks every Ring-1 page carries, in this order.** Lead sentence · responsibility block · facts block · the page's own sections (§1.5, §2.5, §3.5) · members · claims table · nodes · open objects · people and credit · visual plan · lecture storyboard · success criteria · readings and risks (the reader screen) · sources · fact-check list · lint line. Bold labels, not headings, as in F1.17.

**Confidence words.** Every fact carries one: documented · probable ("probably", "most specialists") · contested ("argued", with both readings and a source for each) · interpretive ("we read it as"). Gaps carry one of three words: "not recorded" (the archive is silent), "disputed", "not knowable" (W11). A fact a checker could not reach is "unverified", never silently kept.

**Backbone ids.** Four fields on every facts block: Wikidata QID; Getty AAT id (concepts, movements, techniques) or Getty TGN id (places); PeriodO id (period definitions); Pleiades id (ancient places). "None found" is an allowed value and says which day it was searched. An id comes from the backbone harvest or from opening the record; never from memory (H19). Where an id's own classification differs from ours (AAT files Mingei as an art genre, not a movement), the facts block says so.

**Sources.** Only pages opened. Holder record or official page first; scholarly article second; Wikipedia for coverage only, never for text (CC BY-SA would bind ours). Quote 25 words or fewer from any source. Never compose a URL by hand: use the URL a search, a fetch or a documented API returned.

**Open objects.** Only CC0, public domain, CC BY, CC BY-SA and KOGL Type 1 count as open; the Met's `isPublicDomain` is checked per record. Works by named makers still in copyright are link-out. No generated images of historical objects, people or places; our own drawings, maps and diagrams are allowed and say so.

**The lecture storyboard.** Six to twelve stations. Each station is one idea and one visual, in 100 to 200 words or 60 to 90 seconds of narration. Each names the lens it plays on (Time, Place, Movements, Objects) so the canvas can move, and the claims it draws by id, as the v3.1 amendment's storyboard row does (briefs/TEMPLATE_v3.1_AMENDMENT.md). The narration script, when written, follows that amendment: about 170 words a minute, every factual sentence ending with its claim id. A chapter is a run of stations the learner can stop after. A one-tap prediction may precede at most one station per chapter, and the answer shows on the canvas within seconds. A one-tap retrieval question may follow any station. The tour ends with five to eight one-tap closing questions in the same form. None takes a side in a live debate (H20). The lens stays live when the tour ends. Visuals: shapes, a legend, one narrator and one map in the house system (Motion Canvas; Kokoro narration; no voice cloning of real people). Animation only where something moves: a route, a border, a loom, a kiln. Every visual names its licence or "our own drawing". The storyboard replaces the Atlas doc's walk; after the lecture the stations stay as the walk, and any station can open the full surface.

**The reader screen.** The protocol screen of the spec brief applies: never human remains, sacred or secret material, or anything a descendant community asks not to show; grave goods and altar objects only with origin and a content note; a Cultural note on every living community's material (ai-reader §4, our own wording, no Local Contexts icon or text); people never described as goods (H9). Items that concern a living community are held until the AI reader pass has run. The pass records one of four outcomes: CLEAR, REVISE, LINK-OUT or REMOVE. Where no community guidance is found, the cautious default is LINK-OUT. The withdrawal link sits at the foot of every page.

**The fact-check list.** One row per item a checker must confirm at source before G3, in the fact-check brief's priority: UNESCO claims; living people and endonyms; licences; claims resting on weak sources; then dates, numbers, names and every "earliest". Each row is marked in place: `✔ verified <date> — <URL>` · `✎ corrected <date> — <what changed> — <URL>` · `? unverified <date> — <why>`. The item's original text is kept.

**The lint.** Script checks 1 to 13 and person checks 14 to 21 of the voice guide §6 run on every page, plus the type's own lines below. The lint line at the foot of the page records the run, its fixes and what was kept.

**Writing standard.** The voice guide, every word. Object, place or person first; first sentence of a paragraph 16 words or fewer; sentences under 25; makers named by role even when unnamed; dates as ranges with the source's qualifier; confidence in the sentence; violence named plainly with the perpetrators' terms quoted and attributed; the community's own name first; nothing from the §5 avoid list; "earliest known", never "first".

**Files.** `grouping-pages/movements/<slug>.md`, `grouping-pages/civilisations/<slug>.md`, `grouping-pages/networks/<slug>.md`, `grouping-pages/bands/<band>_<chapter>.md` (for example `B08_F1.10.md`). The five existing pages stay where they are until they are re-cut to these templates.

## 1. The movement page

### 1.1 Purpose and where it appears

A movement page teaches a movement as the thing itself. It says who named it, who was in it, what it was against, what it left out, and what became of it. It serves art, design, craft, media, fashion, games and advertising alike; the rules below name the differences where they matter. It opens from the Movements lens, by a tap on the movement's bar in the stream. It also opens from the Time lens (its fuzzy bar on a band card), from any member's object card, and from the units that teach it. Ring 1: full page with a three-to-eight-minute lecture, for every movement a unit teaches (about 60). Ring 2: card, for any movement with at least five verified members and a source. Ring 3: link-out to Wikidata and the AAT.

### 1.2 Responsibility block

Which canon rows the page must reach (MOV, STY, SCH, INS, MKR, PER, EVT, TXT ids, with tier); which world chapters it reaches with a case (a movement page reaches at least two, and names the ones it does not); which units teach it and which only link; which sub-regions and periods it covers; what the Atlas carries instead (the members and neighbours that get no step on this page). Proposed canon rows are listed by name and kind.

### 1.3 Facts block

Named fields, each with a confidence word and the source that carries it.

| Field | What goes in it |
|---|---|
| Kind | Movement, style or school, in the Atlas doc's sense; the AAT's own class if it differs |
| Own name | The members' term in its own script and romanisation, glossed once in plain English; never italicised when it is a community's name |
| Outside names | Every other label, each with who used it (historians, dealers, museums, critics) and when |
| Named by, when, where | Who coined the name, the date of the earliest documented use, and whether the name came from inside (members), from outsiders, or from critics, with the source |
| Earliest bound | The earliest documented act: a coining, a manifesto, an exhibition, a founding |
| Latest bound | The last documented act of the members, or "continues", dated to its source |
| Competing definitions | The span and membership as the canon, Wikidata, the AAT or Grove, and at least one historian give them, side by side |
| Members documented | Count by type, and the key names; "documented" means a record shows them signing, exhibiting, publishing, joining or being listed |
| Members contested | Those attached by historians, dealers or museums without such a record; each with the source that attaches them |
| Championed, not named | The makers whose work the movement held up, sold or copied and who did not choose the label; named where any source names them, else the role and "the record does not give their names" |
| Against | The counter-position in the members' own words (25 words or fewer, attributed) and in ours; the counter-movement nodes |
| Leaves out | The voice guide's "leaves out" line: at least three concrete groups |
| Places | Founded, worked, sold, collected: a dated list, each place with a TGN id or "none found" |
| Afterlives | Revivals, retail labels and trademarks (with the owner), museums, the word in marketing; living practice dated to its source |
| Argued | The live arguments, one line each, both readings |
| Backbone ids | Wikidata QID; Getty AAT; Getty TGN for the places; PeriodO; Pleiades ("none found" with the date searched) |
| Rights line | What may be shown and from where; what is link-out |
| Reader status | Held, or the AI reader outcome with its log id |
| Canon and units | The ids and units of §1.2 |

### 1.4 The movement page's own rules

1. **M1 Who named it.** State who coined the name, when, and whether it came from inside, from outsiders or from critics. Give the earliest documented use with its source. If this is not known, write "not recorded"; never infer a founder from fame.
2. **M2 Own name first.** The members' own term and script come first. The English or outside name comes second. The market's or museum's label comes last, marked as theirs.
3. **M3 Members in two lists.** Documented members and contested members are never merged. Each member carries a membership confidence; a maker a dealer attached is "contested" until a record shows otherwise.
4. **M4 The makers it championed but did not name.** Every page lists the makers whose work the movement used as models, sold or praised. These makers did not choose the label. Name them where any source does. Otherwise give the role, the place and "the record does not give their names". The gap sits in the archive, not on the maker.
5. **M5 What it was against.** Quote the members' own statement of what they opposed, in 25 words or fewer, attributed. Say in our words what the opposition was. Link the counter-movement or institution as a node.
6. **M6 What it left out.** The "leaves out" line names at least three concrete groups. The candidates: gendered or waged labour under the movement's name; colonised or distant makers it drew on; the buyers who could not afford it; the industries, states or markets it used while claiming to oppose them.
7. **M7 Span with bounds.** The span is two documented bounds, never a single year. Competing definitions are listed with who defines them. "Earliest known" and "earliest documented", never "first".
8. **M8 Places, dated.** Founding, working, selling and collecting places as a dated list; each with a TGN id or "none found". Where the movement collected across a border or an empire, the map draws that reach as a dated extent with soft edges.
9. **M9 Afterlives dated to source.** Revivals, retail labels, trademarks and museums are named with their owner and a date read. A living practice is dated to its source (W10). Commercial use is reported, never endorsed.
10. **M10 Argued, both readings.** At least two live arguments, each with both readings and a source per reading. The page never rules; success criteria and closing questions never take a side (H20).
11. **M11 Living people.** Named only with a published name. A living person's own words are not reproduced until the consent route in the spec has been used. Until then, link to where they were published.
12. **M12 Entanglement named plainly.** Where a movement worked with a state, an empire, a war effort or a colonial administration, say so with dates. Quote the body's own words and attribute them (W7). Where it protested, say that too, with the same care. Both sit in the claims, not in the tone.
13. **M13 Creative-industries scope.** For film, music, games, advertising, fashion and publishing, a studio, label, agency or house is a member only when a record shows it. Credits name the roles (writer, cutter, pattern-maker, animator, copywriter) and not only the house. The people the credit leaves out are listed (M6).
14. **M14 Two directions.** At least one object the movement made, and one it collected, claimed or copied. The page then shows what went out and what came in.
15. **M15 Copyright and images.** Works by named members still in copyright are link-out. The open objects are the earlier things the movement collected, our own drawings, and public records. No generated images.

### 1.5 Section list

Lead sentence (the point, 25 words or fewer) · responsibility block · facts block · **Before the name** (the things and places the movement looked at before it had a word) · **The name** (M1, M2) · **The makers it championed** (M4) · **Named hands** (the public faces, M3) · **Institutions** (museum, magazine, shop, school, exhibition, guild, with dates) · **Reach** (where it collected and sold; the dated extent, M8, M12) · **Against** (M5) · **What is argued** (M10, both readings) · **Neighbours and counterparts** · **Afterlives** (M9) · members · claims · nodes · open objects · people and credit · visual plan · lecture storyboard · success criteria · readings and risks · sources · fact-check list · lint line. Prose for the named sections: 900 to 1,400 words at Ring 1.

### 1.6 Lecture storyboard

Six to twelve stations, 60 to 90 seconds each, in the shape of §0. A movement lecture usually runs eight to ten stations in two chapters. The default shape, which the page may vary with a reason:

| Station | Idea | Lens it plays on | Visual |
|---|---|---|---|
| 1 | The thing before the name: one object or place the members looked at | Objects or Place | An open object, or our drawing |
| 2 | The naming: who, where, when, inside or outside | Time | A text card: the word, its script, its gloss |
| 3 | The makers it championed, and did not name | Objects | A grid of the unnamed makers' things; roles as captions |
| 4 | The named hands: the public faces | Movements | Member pins light on Place and Time |
| 5 | The institution: the museum, magazine, shop or school | Place | The building or the page, licence stated |
| 6 | Reach: where it collected and sold, as a dated extent | Place (morph) | A soft-edged extent drawing itself over the years |
| 7 | Against: the counter-movement on the same screen | Movements (before and after) | Two bars, two statements, attributed |
| 8 | What is argued: both readings | Movements | A two-column card; no verdict |
| 9 | Afterlives, dated | Time | The bar runs to now; labels and museums as marks |
| Closing | Five to eight one-tap questions | Any | The answer shown on the canvas |

One one-tap prediction at most per chapter, placed before station 2 or station 6 in this shape. Narration follows the voice guide: third person, "you" only to direct looking, confidence in the words.

### 1.7 Claims table

Twelve to twenty rows: `#` · claim in plain words · confidence (documented / probable / contested, both readings / interpretive) · source opened (URL) · depth (full text / abstract / summary / holder record / search extract). Row 1 declares the page's framing as interpretive. Every "argued" row gives both readings with a source for each. Every date, number, name and "earliest" has its own row or sits in one.

### 1.8 Sources

Pages opened, as `[title](url)`, holder and official pages first. A closing line lists works cited through another source and not opened ("cited but not opened").

### 1.9 Reader screen

The §0 reader screen, applied: which members' material is in copyright (link-out); which objects came from colonised, occupied or Indigenous makers and carry a Cultural note; which content needs a content note (war, forced labour, massacre, looting); which items are held for the AI reader pass and which outcome applies by the cautious default. A note that the page was drafted with an AI system and what a human should check.

### 1.10 Fact-check list

Rows, in the fact-check brief's priority, each marked in place: the coining date and the earliest documented use; every founding, opening and closing date; the membership of each named member; the living people named; endonyms and scripts; licences of every open object and the copyright status of every member's work shown or linked; the backbone ids; the dates of afterlives (trademarks, museums, exhibitions); the "leaves out" claims; the quoted words.

### 1.11 Lint

The voice guide §6 checks, plus: (a) the facts block says who named it and whether from inside or outside; (b) "argued" appears only where two readings follow in the same section; (c) no member is listed without a confidence; (d) the "championed, not named" field is filled or says "not recorded"; (e) no afterlife, trademark or living practice lacks a date read; (f) the words "pioneer", "father of", "founder" in our own voice are flagged (a founder is a documented role, not an honorific); (g) "anonymous" outside quotation marks is replaced by "unnamed" or "the record does not give their names".

## 2. The civilisation page, with the network variant

### 2.1 Purpose and where it appears

A civilisation page teaches a commonly named civilisation as a label. The label opens onto what sits beneath it: the archaeological cultures, polities, phases and places, their making, their neighbours, and who speaks for them now. It never ranks and tells no rise-and-fall story the claims do not support (H18). The network variant teaches a set of routes, ports and communities linked by goods, materials, skills and people. Both open from the Place lens, by a tap on a region at a date. They also open from the Time lens (a band card's lines), from any object made or found inside them, and from the units that teach them. Networks open from the Connections surface too. Ring 1: full page with a lecture and a dated extent, for every civilisation or network a unit teaches (about 60). Ring 2: card, for any grouping with at least five verified members and a source. Ring 3: link-out to Wikidata, PeriodO and Pleiades.

### 2.2 Responsibility block

The canon rows the page must reach (CIV, ARC, HOR, POL, DYN, PRD, PLC, NET, ISP, DIA, COM, TEC, MAT, OBT, INV ids with tier); the world chapter it belongs to and the chapters it touches; the units that teach it and those that link; the sub-regions and bands; what the Atlas carries instead; proposed rows by name and kind.

### 2.3 Facts block

| Field | What goes in it |
|---|---|
| Kind | "Civilisation, as commonly named" (a search label), or network, interaction sphere or diaspora |
| Common name | The label learners search for, with who gave it and when |
| Own name | The makers' or members' own name, or "not recorded" / "unknown; the script is unread" |
| Names beneath | The archaeological cultures, polities, dynasties and phases the label gathers, with their ids |
| Span | Conventional range with its definer; the phases beneath; PeriodO definitions with their disagreement |
| Extent | The dated polygon: date range drawn, source (OpenHistoricalMap, Seshat or Cliopatria, our own from the site list), and a certainty per edge: attested, inferred, argued |
| What the name hides | The makers' own name; the neighbours; the hinterland and its suppliers; the present-day people; the phases told as "collapse" |
| Making | Materials; techniques; object types; makers named or "not recorded"; who organised the work, both readings where argued |
| Key events | Dated rows: date range, what happened, who says so, confidence; excavation, damage and looting as events too |
| Neighbours and counterparts | Groupings beside it, not inside it; parallel labels elsewhere, with no ranking |
| Who speaks for it now | Descendant communities by their own name; states and their heritage bodies; museums; each with a published page where one exists |
| Export-law line | The source country's law, its name and date, and what it controls; "not verified" where it is not |
| Protocol flags | Funerary (Q21), sacred, ancestral, human-flow, conflict-looting, living-community, as the canon's sensitivity field has them |
| Backbone ids | Wikidata; AAT (for the culture or style); TGN and Pleiades for the places; PeriodO for the periods |
| Rights line | What may be shown and from where; what is link-out |
| Reader status | Held, or the AI reader outcome with its log id |
| Canon and units | As §2.2 |

**Network variant, extra fields.** Named by, when, from outside (the historians who made it a unit of study); nodes as a dated table (ports, markets, workshops, with Pleiades or TGN ids); goods, materials and skills as three separate layers, each with its evidence type; people as people: who moved, who was moved by force, with a content note and never as a flow of goods (H9); routes with a source per segment; who carried and who profited, both readings.

### 2.4 The civilisation page's own rules

1. **C1 A label, not a frame.** The kind field says "civilisation, as commonly named". The page opens onto the groupings beneath it, never ranks it against another, and tells no rise-and-fall story unless the claims support it. The word never appears in the Atlas's navigation (H18).
2. **C2 Span with bounds.** The conventional range names who defined it; PeriodO definitions are listed with their disagreement; the phases beneath have their own ranges. Ages (Stone, Bronze, Iron) always carry the region they were defined for. "Earliest known", never "first".
3. **C3 Extent as a dated polygon with soft edges.** The map draws extent for a stated date range, from a stated source, with a certainty per edge. The caption says "sites attested; borders inferred". No hard border for a pre-modern grouping. Where a polity's border is attested by a text, the text is the source.
4. **C4 What the name hides.** The facts block and the lead say what the label leaves out, in the Atlas doc's Indus manner. The candidates: the makers' own name and language; whether the signs are writing; the neighbours; the hinterland; the present-day people; the late phases told as collapse.
5. **C5 Its making, by role.** Materials, techniques and object types with their ids. Makers named where a record names them; else the role (seal cutter, bead driller, mason) and "not recorded". Where who organised the work is argued (households, workshops, a state), both readings.
6. **C6 Key events as dated rows.** Each event has a date range, a source and a confidence. Excavation, railway building, damage and looting are events, with the actor and the verb; the rule under which collecting happened is named (colonial, occupation, post-independence).
7. **C7 Neighbours beside, not inside.** The groupings next to it that were not part of it get a line each. Parallel labels elsewhere are listed with no ranking (Dilmun beside Indus, not under it).
8. **C8 Who speaks for it now.** Descendant communities by their own name, with their own published page where one exists. Then the state and its heritage body, and the museums that hold it. The export-law line names the law and its date, or says "not verified". Living communities' material goes through the reader protocol and carries a Cultural note.
9. **C9 Protocol.** Never human remains, burials, mummy bundles, tomb photographs, sacred or secret material. Grave goods only with origin and a content note, never where a descendant community objects (Q21). Objects that may be ancestors or altar pieces and came out of documented looting are link-out at least.
10. **C10 Open objects pass the 1970 test.** Findspot and "attributed by style" are kept apart. Modern fakes in holder collections are noted. A seal labelled only by region is "probable" membership.
11. **C11 Networks: people are people.** Anyone moved along a route is written as a person, with a content note, never as cargo, shipment or flow. The Atlas never draws human movement as a goods arc (the sprint 5 rule, H9). Where an old source lists people among goods, the source's word is quoted as the source's and not repeated in our noun.
12. **C12 Networks: evidence per segment.** A find shows where a thing ended, not the ships it took. Each route segment has its own source and confidence; find-spot evidence and route evidence are never merged.
13. **C13 Networks: who carried, who profited.** Both readings, with sources. Sailors, caulkers, porters, dyers and the inland suppliers are named by role in the "leaves out" line.
14. **C14 The name's history.** Who made this a unit of study and when (Marshall 1924; Chaudhuri and Sheriff for the Indian Ocean). Which other names exist and who uses them, including politically contested ones, each attributed.

### 2.5 Section list

Lead sentence · responsibility block · facts block · **A place to stand** (one site or object the learner can see) · **The name, and who gave it** (C14, C1) · **Span and phases** (C2) · **Extent** (C3, with the morph) · **Its making** (C5) · **Key events** (C6, as a table) · **What the name hides** (C4) · **Neighbours and counterparts** (C7) · **Who speaks for it now** (C8, with the export-law line) · **What is argued** (both readings) · **Afterlives** (living practice dated to source; how it is sold and remembered) · members · claims · nodes · open objects · people and credit · visual plan · lecture storyboard · success criteria · readings and risks · sources · fact-check list · lint line. Networks replace **Extent** with **Nodes and routes** and add **People who moved** (C11) before **What is argued**. Prose: 900 to 1,400 words at Ring 1.

### 2.6 Lecture storyboard

Six to twelve stations in the shape of §0. The default for a civilisation:

| Station | Idea | Lens | Visual |
|---|---|---|---|
| 1 | A place to stand: one street, one drain, one wall | Place (camera at the site) | Open photograph or our drawing |
| 2 | Who gave the name, and when; what the makers called themselves is not recorded | Time | Text card; the excavation as a dated event |
| 3 | Span and phases, with PeriodO's disagreement side by side | Time | Two or three period bars, each with its definer |
| 4 | Extent: sites attested, borders inferred, over the span | Place (morph) | The soft-edged polygon redrawing by date |
| 5 | Its making: one mechanism that moves | Objects | A drill, a kiln, a loom, animated; roles as captions |
| 6 | An object's chain: findspot to museum | Objects | The provenance strip, tappable |
| 7 | Neighbours beside it, with no ranking | Place | Neighbour extents lit together |
| 8 | What is argued: both readings | Any | Two-column card |
| 9 | Who speaks for it now, and the export-law line | Place | The present-day map; community and state pages linked |
| Closing | Five to eight one-tap questions | Any | Answers shown on map or timeline |

The network default swaps stations 4 and 7 for **Nodes and routes** and **People who moved**. In the one, arcs draw themselves, one segment per source. In the other, a content note comes first, people are people, and there is no goods arc. One prediction per chapter at most, before station 4 (where was its reach?) or station 6 (where did this object end?).

### 2.7 Claims table

As §1.7. Every extent, span and "collapse" claim has a row. Every excavation and removal has a row with the actor. Every export-law line has a row with the law's name and date.

### 2.8 Sources

As §1.8, with UNESCO listings, heritage laws and community pages named as such.

### 2.9 Reader screen

As §0, with: the Q21 funerary rule applied to every object; the colonial screen on each object (rule of removal; history gap; export law); the Cultural note for each living community by its own name; the content note for any looting, forced labour or forced movement; the human-flow flag on every network.

### 2.10 Fact-check list

UNESCO listings and inscription dates; export laws by name and date; endonyms and community names; licences and `isPublicDomain` per record; excavation dates and excavators; period bounds against PeriodO; the extent's source and date; the "largest", "earliest" and "collapse" claims; every living person named.

### 2.11 Lint

The voice guide §6 checks, plus: (a) "rise", "fall", "collapse", "flourished", "declined", "golden age" in our own voice are flagged unless a claim row carries them with a source; (b) the kind field reads "as commonly named"; (c) every extent caption contains "borders inferred" or names the attesting text; (d) "discovered" for a known place is replaced by "excavated by [team] in [years]"; (e) no human movement is written with "cargo", "shipment", "flow" or "traffic" outside quotation marks; (f) every grave good carries a content note; (g) the export-law line exists, or reads "not verified".

## 3. The world band card

### 3.1 Purpose and where it appears

A band card is one cell of the Time lens: one band × one world chapter. The bands are B01 (before 8000 BCE) to B11 (1900 to now), as `atlas/tools/codes.py` sets them. The chapters are F1.6 Africa, F1.7 the Americas, F1.8 East Asia, F1.9 South and Southeast Asia, F1.9a West Asia before Islam, F1.10 the Islamic world, F1.11 Europe and the Mediterranean, F1.12 Australia and the Pacific, and F1.12a the steppe and Central Asia. Ninety-nine cells, plus eleven world rows that join them. It answers "who was making what here, then", in the Met chronology's cell shape, and links sideways to "elsewhere at this date". It opens from the Time lens (a tap on a band), from a chapter's simultaneity station, and from F1.5. A cell is Ring 1 when its chapter teaches the band in a station, Ring 2 otherwise; the eleven world rows are always Ring 1. Ring 3 does not apply: a cell with no people yet says so (`NO_PEOPLE_YET`) and stays a card.

### 3.2 Responsibility block

The band code and label; the chapter and its sub-regions (the `SUB_REGIONS` codes); the canon rows the cell must carry (CIV, ARC, POL, DYN, PRD, MOV, STY, HOR, OCC, EVT, INV, PRA ids with tier) and those the Atlas carries instead; the units whose stations open it; the F1.5 recurrence rows that fall in the band.

### 3.3 Facts block

| Field | What goes in it |
|---|---|
| Cell | Band code and label; chapter; sub-regions covered |
| Who was making what | Three to five lines by role and community, each with a place and a canon id; named makers where a record names them |
| Key events | Dated rows: date range, the event, who says so, confidence, OCC or EVT id; events that straddle a band edge appear in both cells, marked "straddles" |
| Groupings active | Movements, styles, horizons, workshops and polities with their start and end bounds (fuzzy bars) and ids; for pre-modern bands "styles, horizons and workshops", not "movements" |
| Anchor objects | Two: holder, accession, title, date range in the holder's words, licence, 1970 status, record URL; at least one open; if none exists, our own drawing or a link-out, stated |
| Period definitions | The period labels that overlap the band in this region, each with its PeriodO id and defining source; where definitions differ, both are shown; ages carry their region |
| Elsewhere at this date | Eight links, one per other chapter's card for the same band, each with that card's own one-line "who was making what" (copied from the card, not written anew) |
| Recurrences | The F1.5 rows that fall in the band, by id |
| Absence line | "No people yet" where the coverage report says so; otherwise what the record is thin on and why: no excavation, perishable materials, colonial collecting, a script unread |
| Backbone ids | Wikidata for the groupings; PeriodO for the periods; TGN and Pleiades for the places named; "none found" with the date |
| Rights line | The two anchor objects' licences; what is link-out |
| Reader status | Held, or the AI reader outcome with its log id |

### 3.4 The band card's own rules

1. **B1 The cell shape.** About 300 words of overview plus the facts block. The overview opens on an object or a place. It says who was making what by role and community, names two or three groupings active, and ends with one gap. It is true on its own (W12).
2. **B2 The band is a counting device.** Say so once. A band is F1's device for coverage and comparison; the makers did not know it. Never write "the B08 period".
3. **B3 By role, not by polity.** "Potters at Jingdezhen", "Diné weavers", "the casters of the Igun guild", never "civilisation X flourished". A polity is a setting; the makers are the subject.
4. **B4 Events as dated rows.** From the canon, with confidence and ids. Edge events appear in both cells, marked "straddles". Colonial and violent events are named plainly with actor and verb; people are never goods (H9).
5. **B5 Groupings as fuzzy bars.** Every grouping has two bounds, never a point. A style named later says who named it. Horizons and ages carry their region.
6. **B6 Two anchor objects.** At least one is open, with the licence as the holder states it and `isPublicDomain` checked. Both pass the 1970 test or carry the colonial screen. No funerary object without origin and a content note (Q21). Where none exists, say so and use our drawing or a link-out.
7. **B7 PeriodO with its disagreement.** List every PeriodO definition for the region that overlaps the band, with its id and defining source. Where two definitions differ by more than a generation, both are shown and the difference is stated in one sentence. Never one date for a period that has several.
8. **B8 Elsewhere at this date.** Eight sideways links, each with the other card's own line. The line is copied, so a correction in one card propagates; a card that does not yet exist is linked as "not yet written".
9. **B9 Absences are stated.** "No people yet" where the coverage report says so. A thin record is explained (no excavation, perishable materials, collecting under colonial rule, an unread script), never read as "nothing was made".
10. **B10 Living practice in B11.** Every B11 cell names at least one living practice from the practices register, dated to its source (W10).
11. **B11 Dates.** Ranges, with the source's qualifier; "earliest known"; BCE and CE; other calendars in the Identity field beside the CE range.
12. **B12 Nothing new is argued here.** A band card carries the claims of the pages it links; it does not open a new argument. Where it must name a live debate, it names both readings in one line and links the page that holds them.

### 3.5 Section list

Lead sentence · responsibility block · **Overview** (about 300 words: a thing to see; who was making what; groupings active; the gap) · facts block (who was making what · key events · groupings active · anchor objects · period definitions · elsewhere at this date · recurrences · absence line) · claims (six to twelve rows; each line of the facts block has one) · nodes · open objects (the two anchors) · people and credit · visual plan · the station (its contribution to the row's storyboard, §3.6) · success criteria (for the row) · readings and risks · sources · fact-check list · lint line.

### 3.6 Lecture storyboard

A cell contributes one station; the storyboard belongs to the band row. The row tour runs nine stations, one per chapter card, 60 to 90 seconds each, in a fixed order the learner can change. It opens with the band's question (the *100 Objects* device: one question for the whole world in that band). It closes with the five-to-eight-question check.

| Station | Idea | Lens | Visual |
|---|---|---|---|
| 0 | The band's question, and that the band is our device | Time | The eleven bands; this one lit |
| 1 to 9 | One chapter's card: a thing to see, who was making what, the groupings active, the gap | Time (the row), Place (the chapter's map lit) | The anchor object; the chapter's extent at the band's midpoint, soft-edged |
| Between | The morph: the world map redrawing from this band to the next (TimeMaps, Chronas) | Place | Extents and routes moving; "borders inferred" |
| Closing | Five to eight one-tap questions, answers on the row | Time | — |

One prediction at most per chapter of the tour. The natural place is "when was this made?" on a timeline before station 1, with the answer shown as a range. A chapter's own lecture reuses its cell's station as its simultaneity station.

### 3.7 Claims table

Six to twelve rows at Ring 1, fewer at Ring 2. One per line of "who was making what"; one per event; one per anchor object; one per period definition that differs; one for the absence line. Confidence words as §0; sources as opened.

### 3.8 Sources

The canon rows by id; PeriodO definitions by id; the two holder records; the pages opened for any line not already in the canon. Wikidata for dates only; Seshat for polity lists, with its licence per release.

### 3.9 Reader screen

As §0: the two anchor objects pass the protocol screen; events of forced movement carry a content note and name people as people; Indigenous and living communities' material carries a Cultural note and is held for the reader pass; B11 cells name no living person without a published name.

### 3.10 Fact-check list

Every PeriodO id and bound; every OCC and EVT date against the canon's source; both anchor objects' licences and provenance; the "earliest" rows; the copied "elsewhere" lines against their source cards; the absence line against `coverage.md`; the living practice's source date in B11.

### 3.11 Lint

The voice guide §6 checks, plus: (a) the band is never called a period or an age; (b) no "flourished", "rose", "fell", "golden age"; (c) each "who was making what" line names a role; (d) every grouping bar has two bounds; (e) the overview is 250 to 350 words; (f) eight "elsewhere" links exist, or say "not yet written"; (g) at least one open anchor object, or the gap is stated.

### 3.12 Skeleton

```
## Band card: B08 1000 to 1400 · F1.10 The Islamic world
<lead sentence>
**Responsibility block** …
**Overview** (about 300 words) …
**Facts block**
| Field | Value | Confidence | Source |
| Cell | B08 1000–1400 · F1.10 · WA-MES; WA-IRN; WA-LEV; AF-EGY; AF-MAG; EU-IBE | — | codes.py |
| Who was making what | … | documented | … |
| Key events | … (rows) | … | … |
| Groupings active | … (bars with bounds) | … | … |
| Anchor objects | 1 … · 2 … | documented | holder records |
| Period definitions | … (PeriodO ids; the disagreement in one sentence) | … | PeriodO |
| Elsewhere at this date | F1.6 … · F1.7 … · F1.8 … · F1.9 … · F1.9a … · F1.11 … · F1.12 … · F1.12a … | — | the cards |
| Recurrences | F1.5 … | — | F1.5 |
| Absence line | … | — | coverage.md |
| Backbone ids | … | — | harvest |
| Rights line | … | — | holders |
| Reader status | … | — | AI_READER_LOG |
**Claims** … **Nodes** … **Open objects** … **People and credit** … **Visual plan** … **Station** … **Success criteria** … **Readings and risks** … **Sources** … **Fact-check list** … **Lint** …
```

## 4. Production, and what counts as done

Draft against the template. Run the script lint. Fact-check every row of section 10 at source and mark it. Run the AI reader pass on every held item and record the outcome. Run the person lint. Then the Historian pre-read, for a Ring-1 page. A page is done when seven things hold. Every facts-block field is filled or says "not recorded" or "none found". Every claim has a confidence word and an opened source. Both readings stand wherever "argued" appears. The storyboard has six to twelve stations, each with a lens and a licensed visual. The fact-check list is marked in full. The lint line is written. No held item is shown before its reader outcome.

**Decisions this brief leaves to you.** (1) Whether the five existing grouping pages are re-cut now or when their units are rebuilt. (2) The folder names in §0, which this brief proposes and the Mingei model uses. (3) Whether Ring-2 cards are cut by a script from the facts block, which §0 assumes. (4) Whether a band row's nine stations run in a fixed order or in the learner's.

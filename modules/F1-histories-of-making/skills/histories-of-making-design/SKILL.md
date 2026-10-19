---
name: histories-of-making-design
description: The design language of the F1 "Histories of making" course (the Edo unit, the Atlas of Making hub, all 38 units and 21 kinds of grouping). Use it whenever you design, build, review or redesign any course surface — a unit page, a lecture, a scene, a map or globe view, a timeline, an object page or gallery, a grouping page (movement, style, school, culture, civilisation, community, polity, dynasty, network, material, technique), a comparison, a lineage or relation graph, an argument card, a credit map, a provenance chain, a counterfactual, a protocol sheet for a living practice, a character sheet, a chapter or unit card, a scene or storyboard, a timeline or lane chart, the scene sheet's beats, a lecture's stations, a claims register, a composer or study page — or whenever the user asks for "the course look", "the washi/sumi finish", "like v4", or to plan, research and benchmark a new unit before designing it. Also use it to judge screenshots of course pages. It carries the tokens, type, page rhythm, 33 components in eight families, the motion and layer rules (moments, the clock, the scene schema, glyphs, labels), the text rules (lectures at full volume, beats as hinges in seven kinds, people in three layers), the claims register, the rules for scripts, names, calendars, protocols and identities, a review checklist, and the method for taking on a new unit. Do not skip it for "quick" pages.
---

# Histories of making: the design language

A course page is a gallery wall, not a dashboard. One thing large; the smallest apparatus that explains it; time given the shape the content has; a map that highlights one kind of thing at a time; every claim with its source and its confidence; every grouping with who defined it and what it leaves out. Everything below exists to make that happen on every surface, for every kind of knowledge, by anyone.

The language was fixed in four studies (October 2026): the motion, layers and focus study and its scene framework, beats study and editorial process (`research_notes/Motion layers and focus/`); the v4 finish and twenty design references (`research_notes/Design language references/`); and the expandability study that tested it against all 38 units and the Atlas's 21 kinds of grouping (`research_notes/Design language expandability/`). This file is the operating summary. The references folder carries the full rules: `components.md` (33 components), `tokens.css`, `scenes.md` (motion, layers, the clock, the scene schema), `beats.md` (lectures, beats, people), `claims.md` (the register), `scripts.md`, `calendars.md`, `protocol.md`, `identities.md`, `checklist.md`, `method.md`.

## 1. The ground: washi, sumi, two accents

The page is paper. Text is ink. Only two things get colour: the trade (indigo) and the state (seal red). Everything else earns attention by size and placement.

- Paper `#F1EADB` with the grain (`--tex`). Dark is the lecture room only: sumi `#16140F`, washi text, the two accents lifted.
- Ink `#1D1A15`; `--ink-2`, `--ink-3` for secondary and tertiary. Body text is always `--ink` on `--paper` (4.5:1 or better).
- Indigo `#233C6B` for routes, journeys, prices, anything trade carried. Seal red `#B3301E` for the state, incidents, the "now" cursor. Nothing else is red; nothing else is blue.
- A unit's lectures (or cases) each own one muted colour and one motif, derived by the rule in `identities.md`; the colour appears only on that lecture's own elements. Groupings, places and objects take no colour.
- Season colours exist for the Hundred Views and the Tōkaidō only. Kraft is the learner's workbench and the learner's own layer.

Why so strict: on paper a third colour reads as an alert, and the references that used colour freely were the ones that fought the objects.

## 2. Type and scripts

- Body and captions: **Source Serif 4**, 17/1.55 (16 on phones), paragraphs ≤ 68 characters. Display for Japanese: **Shippori Mincho**. UI and annotations: **IBM Plex Sans** (`600 12px` name over `400 12px` one sentence). Eyebrows and readouts: **IBM Plex Mono**.
- Titles pair a roman with an italic in one line ("A bet *on blue*"); the italic carries the idea. Decks are one italic sentence. One pull-fact per page (26 px serif, the number in 600).
- Other scripts keep the pairing and add one serif and one sans each, loaded only where the script occurs: Arabic, Hebrew, Devanagari, Chinese, Korean, Cyrillic and Greek stacks are in `scripts.md`, with the bidi rules (UI stays LTR; quoted runs `dir="auto"`; axes and steppers never mirror; no faux italic; a script without italic sets the title's idea-half in `--ink-2`).
- Names: as the community writes them (family-first where that is the custom; Arabic chains uncut); the own name first and the record's exonym after it in quotation marks ("Diné; the record: 'Navajo'").

## 3. The page rhythm

Every page: **band · one large thing · a row of objects with captions under · the reading · sources · previous/next · nothing.** The band carries the clock (the live year, span or "clock held") at the top right on every surface with a date. Captions sit under images, never over. One tag per element at most ("argued", "approximate", "reconstruction, an interpretation"). White space is the structure; rules, boxes and shadows appear only over maps and images. Every surface has a list twin.

## 4. Kinds of knowledge and the page each gets

The course teaches far more than objects. The Atlas groups its 4,666 canon rows into 21 kinds in seven families; the units run in seven archetypes. Every kind has one page type and one time device; pick from this table before designing anything.

| Kind of knowledge | Page type (component) | Time device | Map device | Always carries |
|---|---|---|---|---|
| An object | Annotated object page (1) | the clock, point or circa | location thumb | holder · accession · date · materials · licence; confidence |
| A demonstration (how it was made) | Exploded view (2) or step-strip (19) | reader-stepped, clock held | — | "reconstruction, an interpretation" when it is one |
| A class of things (seals, formats, vessels) | Typology plate (3) | ranges under objects | — | one scale |
| A material | Material biography (5) + journey | chain with dates | the route | sample credits |
| A technique | Step-strip (19) + exploded view | clock held | made-at thumb | who records it; restricted techniques watched, not made |
| A period, age, era, dynasty | Span list (4) | the row is a bar | the region it was defined for | "as defined by [source, date]"; the source's calendar beside CE |
| A run of objects or a life's work | Works wall (6) | the lane chart's axis | — | run counts with who counted |
| A process with stages, not dates | Phase strip (7) | none | — | the sources' own stage names |
| A journey, route, trade, migration | Scene with the journey bar (8) | span / step / crawl | the globe turns to follow | dashed undated legs; honesty line |
| A network, an interaction sphere, a diaspora | Grouping page (21) with the globe; people as a separate layer | span | arcs for the selected thing only | who defined it; what it leaves out |
| A movement, style or school | Grouping page (21) | span list row | one-colour map of where its members made | members tagged "argued" where contested; no origin line, no rise-and-fall curve |
| A culture, horizon, polity | Grouping page (21); polity turns on the borders lens ("states only") | span | the one-colour map | the archaeologist's or historian's name and date |
| A civilisation, as commonly named | Grouping page (21) with the caveat card first | span | the groupings beneath it | the word never in navigation |
| A living community and its practice | Grouping page (21) with the Protocol sheet (28) first | span, open-ended ("1860 – …") | territory as a wash, never a border | Notice; content note once; display basis; community review line |
| A person | Character sheet (20) | dates with confidence | — | own name first; "appears in" |
| A lineage (taught by, copied from, descends from) | Relation graph (22) | edge dates | — | every edge typed, sourced, with its confidence |
| A comparison (2–6 things, same readings) | Compare sheet (23) | — | — | "not known" cells; "what this comparison leaves out" |
| An argument with two readings | Argument card (24) | — | — | both readings sourced; neither coloured; never marked right |
| Who did the work (credit) | Credit map (25) | — | — | "unnamed" and "not known" rows never deleted |
| Where the record is thick or thin | Coverage grid (26) | bands | chapters | who counted and when; empty cells say "none open" |
| A counterfactual | Branch view (27) | the documented tick, held | — | the ghost gains no date, place or glyph; atrocity never the variable |
| Provenance and restitution | Journey bar (8) bound to holders | the chain's dates | holders on the globe | dashed "not recorded" gaps; restitution as a process, not one event |
| A calendar or reckoning | Span list (4) with a lane per reckoning | both reckonings | — | the correlation named; nothing converted the register lacks |
| The learner's own layer | Kraft workbench + relation graph (22) + stepper | — | — | beside the record, never over it; a consent record where people are involved |

If a request fits none of these, say so and propose the smallest new component with its references rather than improvising: one-offs are how the finish was lost between v1 and v3.

## 5. The components, in eight families

Full anatomy and rules in `components.md`. Build the anatomy in the order given; stop at the budget.

- **Objects:** 1 annotated object page · 2 exploded view · 3 typology plate · 19 step-strip and comparison box · 20 character sheet.
- **Time:** 4 span list · 5 material biography · 6 works wall · 7 phase strip · 15 progress bar per item.
- **Place and motion:** 8 journey bar · 9 list · globe · panel · 10 anchored label · 11 sized legend · 12 route callout · 14 one-colour map.
- **Groupings and relations:** 21 grouping page (one design, kind variants) · 22 relation graph · 23 compare sheet · 26 coverage grid.
- **Arguments and methods:** 24 argument card (and its prediction-card variant) · 25 credit map · 27 branch view.
- **Protocol:** 28 protocol sheet (Notice, content note, display basis, kit mode, brief mode, review line).
- **Frame:** 13 stepper · 16 frosted panel · 17 gallery rhythm · 18 lecture identity.
- **Story:** 29 scene player · 30 lane chart with focus · 31 scene sheet (beats on the ink thread) · 32 station player (the lectures layer) · 33 inline widget.

## 6. Motion, layers, focus and scenes

Animation goes only where it explains. Six kinds of moment, each with one surface, one trigger, one moving thing and a pace: **opener** (one 6–8 s push-in on a still map, then the title card), **journey** (a route drawn stop by stop, 1.2 s per leg, held at each stop), **incident** (settle, one pulse, the caption carries the date), **demonstration** (an object taken apart on the stage in steps the reader takes; never on a map), **run** (the lane chart zooms to the span and ticks fire in order, 2.5–4 s with a pause bar), **still** (most of the unit; a crossfade at most). One focus per beat; the camera settles before the caption lands; dim, don't hide; the reader holds the pace; the timeline is the only clock; reduced motion keeps every caption and end state; toggles exist only in Explore; an opener that explains nothing is cut.

A layer (washes, routes, places, journeys, events, lectures, lenses, the learner's ink, the focus mask) never switches on: it arrives because the clock reached it, because a scene asked for it, or because the learner inked it, and leaves the same way. The lane chart is the clock of every surface: no fast sweep; a focus never narrower than ten years; stop-and-play with a pause bar; arrows step, space pauses, Escape leaves.

A scene is data in `content/scenes.yaml` (kind, span, claims, honesty, ends_on an object; shots with one camera move, one clock mode, actors, one primary label and ≤ 3 others, dim, a sourced caption, duration, reduced), played alike by the unit stage, the timeline focus and the Atlas. The globe turns before a leg draws; undated legs dashed; six highlight kinds that never look alike (journey · incident · lecture place · object holder · person · mentioned place), at most two on screen; five clock modes (point · span · step · crawl · held); glyphs from the shared 14-glyph library only, each demanded by a quoted content line; labels 18 px apart, close pairs in sequence or on one leader; three templates (journey, incident, run); a scene lint. Territories that are not countries (an ocean, a steppe) are a soft-edged `--land-2` extent with the globe centred on the water, no borders lens. Full rules in `scenes.md`.

## 6a. Text: lectures, beats and people

The lecture carries the argument, the instrument carries the evidence, the beat is the hinge. Each unit's lectures run at full volume through the station player (`content/lectures.yaml`: thesis, prediction, stations each with one instrument state and one showable claim; stations are the lane chart's ticks). Beats are derived from the stations, never drafted: seven kinds with fixed lengths (threshold 20–45 words carrying the scene's thesis · caption 25–60 naming the instrument first · focus 15–40 with one number or date and one mark · bridge 20–50 naming both ends · note 25–70 where the confidence words live · prompt, answered on the instrument with no reveal beat · aside ≤ 1 per scene, labelled, off the thread). Every beat names its subject, date and station in its own words, with no antecedent in another beat, and is read cold, out of order, before it ships. People appear in three layers: the inline card at first mention, the linked entity sheet, the character cards and Cast deck. Full rules and lints in `beats.md`.

## 6b. The claims register

Every date and number on any surface is a record in `content/claims.yaml`, keyed by the claim, not the year: value, precision, calendar, confidence, sources, every published alternate sourced, one display string, where used, an editor note. Documented is unmarked; probable, contested and argued carry their word in the sentence. A range is a bar, a circa a halo, an argued value never a tick, a tile or a clock. The register is frozen before any beat, scene, tick or card is authored; a date it lacks is a change request to the editor, not a number typed into prose; the lint (`E-DATE-UNREGISTERED`, `E-DATE-MISMATCH`, `E-CONF-MISSING`, `E-CLOCK`, `E-ARGUED-TICK`, …) fails the shortcut. Writer drafts the spine, specialist fills the records, editor owns the register. Full rules in `claims.md`.

## 7. What every grouping carries

No chip, card, lens, label or page for a grouping without: **as defined by** [who, when] on tap; **membership** with its confidence word (contested members tagged "argued"); **what it leaves out** on its page; the **region** an age or period was defined for; **who counted and when** on every count. The civilisation word never appears in navigation. Movements are never drawn as a line from one origin; polities never as a succession chain; restitution never as one event.

## 8. Living practices: the protocol

The Yoshiwara rule ("read, not played; a content note once; no interior") generalises to six levels, drawn by the protocol sheet: Notice (the community's own name first) · content note once, before the object · display basis in mono ("made for sale"; "not shown: sacred") · link-out only · excluded, named in text with no thumbnail and no drawing of our own · held for a named reader, unpublished. Plus: the course may *notice* but never *label* (labels are the community's); restricted stays discoverable but inaccessible, with the reason; no interior of a sacred or domestic space; restricted techniques watched, not made; no recitation of sacred text; no generated image; consent is a process shown as who consented to what, when. Full rules in `protocol.md`.

## 9. Dates and calendars

The clock readout is CE · the source's reckoning: "1842 · Tenpō 13", "868 · Xiantong 9", "1585–95 · 993–1004 AH"; a lunar year across two CE years is written as both; a Long Count in its five places with the correlation named; a conversion the register lacks is not shown. A range is a bar, never a point; a circa gets a halo; an argued date never drives a tick, a tile or a clock. A period is an assertion by a source for a region: show the source, the region, the range and the alternates (`calendars.md`).

## 10. What is never done

No fast sweep of the cursor, no auto-advance past 5 s without a control, no second clock, no toggle in the story, no decorative glyph, no drift inside a scene, no reveal beat, no beat whose subject lives in another beat, no date typed into prose that the register does not hold; no flags, emoji, icon rows, slogans; no points, badges, streaks, leaderboards, timers, confetti, completion percentages; no dark ground outside the lecture room, no glow, neon or scan lines; no illustration of the subjects (the objects themselves, credited; illustration only in motifs and glyphs); no invented placement, burnt area, route or date the sources do not give; no caption over an image, no label over a label, no third colour; no "first" (write "earliest known"); no date below documented without its confidence word; no grouping without who defined it; no living practice without its protocol; no generated image of a person, a place or an object.

## 11. How to work

For a page: name the surface, find its row in section 4, open the component, start from `tokens.css`, put the object or the map first, caption under, apparatus last, set the clock, run `checklist.md` at 1440 and 390 px.

For a new unit or grouping, follow `method.md` before any page: (1) **research** the content from the unit spec, the canon rows, the claims register and open collections; (2) **benchmark** it: count the dated rows, the sourced rows, the open objects, the placed rows, and compare with the thresholds (≥ 15 claims, ≥ 5 open objects, ≥ 60 % dated, every count with who counted); say which surfaces the content can carry now and which must wait; (3) **inventory** the events, journeys, objects, groups, people and arguments into the inventory schema; (4) **register** every date and number as a claim with its confidence (`claims.md`) and freeze it; (5) **choose** the page types from section 4, the identity by `identities.md`, the scripts by `scripts.md`, the protocol level by `protocol.md`; (6) **storyboard** the scenes from the content lines that demand them (`scenes.md`) and write the lectures as stations, then derive the beats (`beats.md`); (7) **build**, then lint (claims, scenes, beats, checklist). A unit under the thresholds gets its list twin and its grouping cards first, and its scenes when the data arrives.

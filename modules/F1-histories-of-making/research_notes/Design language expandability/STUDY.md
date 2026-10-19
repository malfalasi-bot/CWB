# Is the design language expandable? A test against everything the Atlas has to teach

The design language (the `histories-of-making-design` skill) was written from one unit, Edo, a world chapter about printed pictures. The Atlas has 38 units in seven archetypes and 4,666 canon rows in 25 kinds: movements and styles, archaeological cultures and civilisations, living communities and their practices, polities and dynasties, materials and techniques, networks, lineages, periods and calendars, arguments, methods, and the learner's own layer. This study asked whether the language stretches to all of that, found where it did not, extended it, and tested the extension on three pages that have nothing to do with Edo.

Inputs, in this folder: `knowledge_inventory.md` and `.json` (what the Atlas holds, counted); `precedents.md` (how twenty institutions show each kind of knowledge); `gap_analysis.md` (the skill against 41 surfaces the course needs). Output: the skill at `skills/histories-of-making-design/`, version 2.

## 1. What the Atlas has to teach

- 4,666 canon rows in seven families: People 2,044 (persons, communities, makers, polities, dynasties, cultures), Things 958 (materials, techniques, object types, practices), Time 631 (periods, events, firsts), Place 495, Ideas 361 (movements, styles, schools, beliefs), Composite 93 (civilisations as commonly named), Connections 84 (networks).
- 38 units in seven archetypes: 2 one-object, 8 world chapters, 2 networks, 2 recurrences, 15 thematic arguments, 5 methods, 3 mastery research. **The commonest archetype, the thematic argument, had no component at all.**
- 799 claims in the register, 18–25 per unit; 374 world-set objects, 235 open; 1,218 nodes pinned or listed on the hub; 51 routes; 219 dated periods; 174 "first known" rows.
- Kinds of knowledge that are not objects, listed from the specs: an argument with two readings, a borrowed method, a protocol, a comparison, a lineage, a counterfactual, a calendar, a canon critique, a credit map, a provenance chain, an oral history, the learner's own place. Of these, only the comparison box and the phase strip had a component.

## 2. Benchmark: where the content can carry the full set now

Dense enough now: F1.13 Networks (283 nodes, 51 routes, 48 provenance arcs); F1.24 the museum as author; the big world chapters F1.6, F1.7, F1.8, F1.9, F1.11 (116–208 nodes, 8–11 open objects each); F1.5 recurrences (174 dated firsts); the Time data behind F1.3 and F1.30 (219 periods, all dated).

Thin: F1.26, F1.31, F1.30a, F1.25, F1.12, F1.29, F1.15, F1.19b, F1.27 (fewer than 15 nodes or fewer than 5 open objects). No civilisation reaches 5 open objects, which confirms the earlier decision: civilisations and movements are grouping pages, not chapters.

The three data gaps that limit design: **place** (no canon file holds coordinates; events, polities, cultures and communities have no map presence; 422 nodes are listed but not pinned); **time** (end dates on 53 % of rows; living practices 12 % dated); **images** (no per-row image or licence field; nine units under five open objects). The method now carries thresholds for each (≥ 15 claims, ≥ 5 open objects, ≥ 60 % dated, ≥ 50 % placed) and says what waits when a unit is under them.

## 3. What the precedents converge on

Twenty institutions were read for each kind of knowledge. The Met's chronology pages are the strongest composition (works strip · map thumb · overlapping dynasty band · overview · dated events · neighbours · keywords); Smarthistory's explicit "Periods / Cultures / Styles" split and Google Arts & Culture's open-ended "1860 – …" are small conventions worth copying; the World Historical Gazetteer's record anatomy (every name, type, place, timespan and relation with its source, certainty and timespan, conflicting attestations side by side) is the on-screen model for "assertion with source"; PeriodO's model (a period is an assertion by an authority, for a region, with a range) is the data model for every period; Mukurtu, Local Contexts and CARE give the protocol for living communities; Digital Benin's documentation page is the model for "what this leaves out". No museum precedent exists for counterfactuals; the teaching literature supports them only after the evidence and visually distinct.

What fails, across them: infobox clutter, flags as culture, single dates for spans, "first" claims, movements drawn as one line from one origin, polities as succession chains, deterministic models shown as evidence, the institution's term before the community's, restitution as one event.

## 4. The gap analysis

41 surfaces and page types the course needs were matched against the 18 components: 6 covered as is, 14 covered as variants (the unit opening, simultaneity rows, the calendars view, lens overlays, the provenance chain, the reconstruction log, the learner's layer), **8 needed new components**, and 8 rule families were missing because the skill was written from Edo.

What stays unchanged, because it transfers: the paper ground and the two accents, the type pairing, the scene/objects/scene rhythm, the five-mode clock, the label budget, the glyph discipline, the stepper and sources, confidence words. None of the eight unit specs read asked for a third colour or broke the rhythm.

## 5. What the skill gained

**A knowledge-kind map (SKILL.md §4).** Twenty-four kinds of knowledge, each with its page type, its time device, its map device and what it always carries. The first thing a designer consults.

**Eight new components (21–28):** the grouping page (one design for all 21 kinds, with variants for civilisation, community, polity, dynasty, network), the relation graph, the compare sheet, the argument card (with the prediction-card variant), the credit map, the coverage grid, the branch view, the protocol sheet.

**Five new reference files:** `scripts.md` (fonts and bidi rules for Arabic, Hebrew, Devanagari, Chinese, Korean, Cyrillic, Greek and diacritic Latin, within the same pairing; names as the community writes them, own name first); `calendars.md` (the readout as CE · the source's reckoning; periods as assertions with source, region, range and alternates); `protocol.md` (six display levels generalising the Yoshiwara rule; the course notices but never labels; consent as a process); `identities.md` (the derivation of a unit's colours from its materials, with hue spacing across chapters); `method.md` (research → benchmark → inventory → register → choose → storyboard → build, with thresholds and what waits).

**Rules every grouping carries:** as defined by whom and when; membership confidence; what it leaves out; the region an age was defined for; who counted and when. The civilisation word never in navigation. No movement as an arrow from one origin.

## 6. The test

Three pages with nothing of Edo in them, built by agents that had not seen this work, with the extended skill and with the first version:

- **A movement:** the Arts and Crafts grouping page (canon row MOV005). v2: 16 of 16 checks. v1: 14 of 16; it improvised a page from object-page parts and omitted "as defined by" and the apply hook.
- **A comparison:** a proto-cuneiform tablet beside an Inka khipu, six readings (F1.1). Both 15 of 15; v2's sheet carries the fixed readings and the claim register, v1's a looser table.
- **A living practice:** Diné weaving with its protocol before any object (F1.7). Both 18 of 18 on the script; v2 adds the six levels, who controls the data and the consent route. v2 also checked the accessions in the prompt against the Met's record and found one wrong; the error was in the test prompt, and the rule that caught it (holder · accession on every object) is now a stop in the method.

Over the two rounds: 100 % of checks with the skill against 60 % without it (round 1) and 100 % against 96 % with the first version (round 2). The round-2 gap is small on the script because the finish transferred; the structural differences are what the review file shows.

## 7. What this means for the course

The language is expandable: the finish is the same on a Japanese print, an English wallpaper, a Sumerian tablet and a Diné blanket, and the components now cover every kind of knowledge the Atlas groups. What limits the build is data, not design: coordinates for the four thousand rows that have none, end dates for the half that lack them, open images for nine units, and protocol levels for every living practice before any of it is shown. The method's benchmark is there so that no unit is designed past its evidence.

Next: run the method on one dense unit outside Edo (F1.13 Networks, or F1.6 Africa) end to end, as the second worked example; derive F1.6's identity colours with its specialist; and add the "who defined it" and "leaves out" fields to the 40 % of canon rows that lack them.

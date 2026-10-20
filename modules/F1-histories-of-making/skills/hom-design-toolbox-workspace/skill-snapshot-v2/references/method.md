# The method for a new unit or grouping

Design follows content. Before any page for a unit, grouping or scene, do the seven steps. Each writes a file into the unit's `research_notes/` so the next person can see what was found.

## 1. Research

Read, in this order: the unit spec (`docs/*/NN-f1-N-*.md`); the canon rows the unit reaches (`atlas/data/canon/*.csv`, filtered by unit or world); the claims register (`atlas/data/register/claims_specs_v1.csv`); the world set (`world_set_specs_v1.csv`) for its open objects; the grouping-page drafts where they exist; the open collections the spec names (Met, AIC, Cleveland, BM, Smithsonian, Rijksmuseum, Europeana, Wikimedia Commons with licence). Note every open object (holder, accession, licence), every dated row, every placed row, every source. Verify every accession against the holder's own record before it goes on a page (the Met, AIC, Cleveland and the BM all expose records by accession); an accession that does not resolve to the object named is a stop, not a note: the round-2 test found one that pointed at a different object. Where the course's data is thin, research outside it with the deep-research tool and record what was found with its sources; never invent a date, a place or a quotation.

## 2. Benchmark

Count and compare with the thresholds. The counts are written with who counted and when.

| Measure | Threshold to build the full set | Below it |
|---|---|---|
| Claims in the register | ≥ 15 | the argument card and the lectures wait |
| Open objects (CC0 / PD, image in hand) | ≥ 5 | the object pages and galleries wait; cards only |
| Rows with a start date | ≥ 60 % | span lists and works walls wait |
| Rows with coordinates or a gazetteer match | ≥ 50 % of place-anchored rows | the one-colour map and journeys wait; the list twin ships |
| Journeys with dated legs | ≥ 1 | scenes wait |
| Groupings with "as defined by" | 100 % of those shown | a grouping without it is not shown |
| Living-practice rows with a protocol level | 100 % | nothing from that community is shown |

Say which surfaces the content can carry now and which must wait, in one table.

## 3. Inventory

Fill the inventory schema used for Edo (`research_notes/Motion layers and focus/inventory.json`): events, journeys (with legs), objects (with holders), groups (runs), people, arguments, each with ids, years, scale, places, confidence and sources. The counts in the inventory are the counts the pages use.

## 4. Register

Every date and number on any page is a claim in the register (`content/claims.yaml`: id, claim, value, precision, calendar, confidence, sources, alternates, display, where_used). The lint refuses a year in prose the register does not hold. Resolve alternates before any tick is authored; name the outside source needed where the repo cannot settle it.

## 5. Choose

From SKILL.md §4, the page type for each kind of knowledge the unit carries; from `identities.md`, the unit's colours and motifs; from `scripts.md`, the fonts and bidi rules for its scripts; from `protocol.md`, the level for every living-practice row; from `calendars.md`, the reckonings to show beside CE. Write the choices as a one-page plan: surfaces, components, what waits.

## 6. Storyboard

For each scene, quote the content line that demands each element (a ship, a seal, flames), then the shot list with camera, clock, actors, labels, caption with sources, and the honesty line, as in `research_notes/Motion layers and focus/scenes.md`. Rank the unit's journeys and runs by significance, density, assets, visual potential and sourcing before choosing which get scenes.

## 7. Build and lint

Build from `tokens.css` and `components.md`; run `checklist.md` at 1440 and 390 px; run the content lint (claims, lengths, confidence words, "earliest known", names, protocol levels). A unit under the thresholds ships its list twin and its grouping cards first and its scenes when the data arrives; it never ships a map with invented placement to look complete.

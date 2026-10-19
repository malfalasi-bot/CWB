# Knowledge inventory and benchmark: what F1 and its Atlas have to teach

2026-10-20 · read-only pass. Every number was counted from the files named; where a file lacks a field, it says so. All counts are in `knowledge_inventory.json`.

Read: `docs/06-atlas-logic/index.md`; the 20 canon CSVs (4,666 rows); `register/claims_specs_v1.csv` (799 claims) and `world_set_specs_v1.csv` (374 objects); `build/compiler/data/model.json` (38 units, 7 archetypes, 30 methods); `atlas-hub/public/data/atlas.json` and `nodes.json` (1,218 nodes); TASK_26 and TASK_27; the eight batch-1 specs in full and the lab and forms rows of all 38 specs in `specs/`; FRAMEWORK §4; SKILL §5 and `components.md`.

## 1. The 21 grouping kinds

Atlas-logic names 21 kinds in 7 families; the canon uses 25 `kind` values. Sixteen of the 21 exist as canon kinds (Things is three kinds plus a `functions` column). Five do not: world region (a `sub_regions` column, 100% filled, not a node), culture area, environment, period band (one band page exists) and age (held as period rows such as PRD070). The remaining 2,055 rows are node kinds outside the list: person 609, place 495, event 383, living-practice 225, first-known 174, institution 169.

`free_sources` is filled on every row, so "share with a source" is 100% everywhere; the useful measure is rows naming an open image source (CC0, public domain, Commons, open access): 3,418 of 4,666, with 494 link-out only. No file holds coordinates. Units are from the canon `units` column, R1 and R2 rows.

| Family · kind | Rows | Start | End | Surface (atlas-logic) | In hub today | Units | Component |
|---|---|---|---|---|---|---|---|
| Place · world region | 0 (column) | — | — | Map; coverage grid | 9 territory washes | all world chapters | One-colour map (14); List·globe·panel (9) |
| Place · culture area | 0 | — | — | Map; grouping view | no | — | One-colour map, if rows existed |
| Place · environment | 0 | — | — | Map lens | no | — | none fits (a wash) |
| Time · period | 219 | 100% | 97% | Timeline | Edo eras only | F1.30 54, F1.3 13 | Span list (4); Works wall (6) |
| Time · period band | 0 | — | — | Timeline; grid | no | F1.5 | Span list |
| Time · age | 0 | — | — | Timeline with region | no | F1.3 | Span list; needs a region twin |
| Time · horizon | 17 | 100% | 100% | Map and timeline | no | F1.30 2 | none fits (map and span together) |
| Time · calendar or era | 12 | 58% | 8% | Timeline, original date beside CE | retime layer (nengō, Hijri) | F1.30 1, F1.14 1 | Span list as text twin; clock readout |
| People · polity | 241 | 100% | 90% | Map borders layer | no | F1.13 62, F1.5 34, F1.24 34 | One-colour map wash; no borders component |
| People · dynasty | 97 | 100% | 95% | Timeline | no | F1.24 12, F1.16 11, F1.13 10 | Span list |
| People · archaeological culture | 232 | 100% | 100% | Map; grouping view | no | F1.5 23, F1.24 7, F1.18 6 | Typology plate (3); One-colour map |
| People · community | 308 | 98% | 1% | Grouping view, with protocol | no | F1.18 42, F1.24 33, F1.26 17 | none fits (Character sheet is a person) |
| People · maker community | 107 | 95% | 45% | Lineage; grouping view | 107 maker nodes | F1.23 11, F1.17 11, F1.18 9 | Phase strip (7); hub marker |
| People · belief tradition | 56 | 100% | 14% | Grouping view | ritual lens | F1.16 37, F1.24 16 | none fits (a lens) |
| Ideas · movement | 116 | 100% | 75% | Grouping view | no; 11 page drafts | F1.20 16, F1.17 6 | Works wall; grouping page has no component |
| Ideas · style | 198 | 99% | 77% | Compare; grouping view | no | F1.3 16, F1.30 13, F1.13 11 | Typology plate; Comparison box (19) |
| Ideas · school | 47 | 100% | 68% | Lineage | no | F1.26 6, F1.17 3 | none fits (needs a graph) |
| Connections · network | 68 | 96% | 74% | Globe; connections | 51 routes, 111 stops | F1.13 23, F1.14 6 | Journey bar (8); Route callout (12); Sized legend (11) |
| Connections · interaction sphere / diaspora | 3 + 13 | 100% | 50% | Connections; grouping view | no | F1.13 7, F1.23 2 | none fits (people never drawn as goods) |
| Things · material / technique / object type | 138 / 247 / 399 | 70 / 87 / 54% | 2 / 6 / 4% | Lenses on every view | 7 lenses; 327 objects at holders | F1.13, F1.22, F1.18, F1.5, F1.29 | Material biography (5); Exploded view (2); Typology plate; Phase strip |
| Composite · civilisation, as commonly named | 93 | 100% | 87% | Search; caveat card | no; 11 page drafts | F1.3 12, F1.5 7, F1.24 6 | none fits (needs a caveat card) |

Confidence is on every row (high 3,413, medium 1,201, low 52); `leaves_out` on 59.6% (Time 89%, Composite 100%, Things 13%); tier R1 269, R2 1,269, R3 3,128. Grouping-page drafts on disk: 28 (11 movements, 11 civilisations, 5 networks and horizons, 1 band).

## 2. The 38 units

Archetype from `model.json`; device and status from `atlas.json`; nodes = `atlas.json` `units[].nodes`, with the hub's unit-tagged pinned count in brackets; claims from the register; objects = `world_set_specs_v1.csv` open / total, with TASK_26's chapter count in brackets where it gives one; surfaces = the forms the spec asks for (1 scrollytelling, 2 step-through, 3 object story, 4 explorable, 5 before/after, 7 video, 8 audio, 10 comparison wall, 11 timeline scrub, 12 map, 13 argument card, 15 prediction; form 14 is not named in the files read). All 38 are "in development" and all have 18–25 claims, so neither flag fires. **Thin** = fewer than 5 open objects.

| Unit | Arch | Device | Nodes (pinned) | Claims | Objects (T26) | Surfaces | Flag |
|---|---|---|---|---|---|---|---|
| F1.1 | A | Three lenses | 14 (13) | 20 | 7/11 | 3; overlays; Lineage drag | |
| F1.2 | F | The plane | 11 (9) | 20 | 6/6 | 15, 3; two-axis board | |
| F1.3 | E | Timeline scrub | 27 (18) | 20 | 5/6 | 13, 11; record strip | |
| F1.4 | E | Comparison wall | 23 (17) | 20 | 10/15 | 10, 7, 8 | |
| F1.5 | D | Simultaneity view | 98 (47) | 25 | 11/18 (7) | 15, 11 rows, 1, 13, 3 | |
| F1.6 | B | Nine-step walk | 204 (16) | 23 | 9/17 (7) | 3, 10, 12, 13, 15 | |
| F1.7 | B | Technique-layer wall | 180 (10) | 25 | 8/13 (5) | 3, 10, 15, 12, 11 | |
| F1.8 | B | Chain of Hands | 120 (33) | 25 | 10/14 (3) | 15, 3, 10, 12; Edo built | |
| F1.9 | B | Made at / found at wall | 116 (15) | 25 | 9/16 (4) | 10, 3 | |
| F1.9a | B | Account Reader | 87 (17) | 25 | 9/17 (8) | 15, 4, 3, 12 | |
| F1.10 | B/C | Two Routes | 98 (15) | 25 | 9/14 (5) | 12, 3 | |
| F1.11 | B | Rule wall | 208 (14) | 23 | 11/18 (3) | 10, 3 | |
| F1.12 | B | Country and record wall | 77 (9) | 23 | 2/11 (5) | 3, 15, 13, 10, 12, 11 | thin; 6 link-out |
| F1.12a | B | Horse Reader | 66 (11) | 23 | 7/13 (4) | 15, 4, 12, 3, 11 | |
| F1.13 | C | Route Tracer | 283 (199) | 25 | 5/11 (4) | 12 four layers, 15, 3, 4 | |
| F1.14 | C | Three layers | 54 (35) | 20 | 11/13 | 5, 3 | |
| F1.15 | E | Pattern Comparer | 12 (10) | 20 | 4/8 | 3, 10; three layers | thin |
| F1.16 | E | Driver overlay | 41 (19) | 20 | 4/12 | 3, 8; two readings | thin; 5 link-out |
| F1.17 | E | Commissioning chain | 63 (27) | 20 | 6/9 | 2, 13, 3, 8 | |
| F1.18 | E | Every hand | 70 (30) | 20 | 6/10 | 3, 7; making first | |
| F1.19 | E | Process split | 47 (24) | 20 | 8/9 | 1, 3; five columns | |
| F1.19a | E | Crisis ledger | 31 (18) | 20 | 5/8 | 1, 12 two layers | |
| F1.19b | E | Lineage map | 13 (11) | 20 | 8/8 | 13, 3, 12 graph | |
| F1.20 | E | Comparison wall | 57 (38) | 20 | 6/8 | 10, 13 | |
| F1.21 | E | Five counters | 26 (18) | 19 | 10/12 | 1, 7, 3, 8 | |
| F1.22 | E | Chain explorer | 67 (32) | 20 | 4/6 | 12, 4 | thin |
| F1.22a | E | Use-life scrub | 18 (16) | 20 | 11/12 | 3, 5 | |
| F1.23 | E | Credit map | 89 (45) | 20 | 6/7 | 3, 4 rings | |
| F1.24 | E | Provenance query | 117 (70) | 20 | 6/11 | 13, 3; dated links | |
| F1.25 | A | Object Autopsy | 9 (8) | 19 | 7/9 | 15, 1, 4, 3, 14, 12, 11 | |
| F1.26 | F | Protocol Builder | 39 (14) | 18 | 1/3 | 15, 2, 3, 10 | thin |
| F1.27 | G | Atlas authoring | 14 (10) | 19 | 5/9 | 4, 13, 3, 12, 11 | |
| F1.28 | F | Source Grader | 39 (19) | 20 | 4/7 | 15, 4, 5, 3 | thin |
| F1.28a | F | Reconstruction Log | 21 (13) | 20 | 5/6 | 15, 2, 3, 13 | |
| F1.29 | G | Oral History Kit | 40 (15) | 19 | 3/6 | 2, 3, 8, 10, 13 | thin |
| F1.30 | D | Calendars | 9 (7) | 20 | 4/7 | 15, 4, 11 dual-axis, 3 | thin |
| F1.30a | F | Rule Card and branch view | 8 (7) | 20 | 5/6 | 1, 13 | |
| F1.31 | G | Slot Builder | 7 (6) | 20 | 2/7 | 4, 10, 12, 13 | thin; 5 link-out |

Claims are allocated almost flat (documented 631, contested 80, interpretive 50, probable 38), so the register does not yet reflect density; nodes do (F1.13 283, F1.31 7).

## 3. The seven archetypes

| Arch | Learner sees first | Core loop (model.json) | Components today | Missing |
|---|---|---|---|---|
| A One-object (F1.1, F1.25) | A single object filling the screen | Slow looking → prediction → worked reading, layers tagged → faded second object → self-explanation → own autopsy → partner test | Annotated object page (1), Exploded view (2), Comparison box (19), Stepper (13) | Switchable overlays per reading; seen / recorded / guessed tagger; a faded page; drag onto Lineage |
| B World chapter (F1.6–F1.12a, 9 units) | A scrollytelling walk through one world | Prediction on the map → walk with the chapter's device → comparison wall → argued card → Rebuild placement → reference note | Gallery rhythm (17), One-colour map (14), Journey bar (8), Anchored label (10), Route callout (12), Frosted panel (16), Lecture identity (18), Span list (4) | Comparison wall grid (cells cite a claim or "not recorded"); argued card with two readings; Rebuild; reference note |
| C Network (F1.10, F1.13, F1.14) | Globe in time-lapse, then Map | Prediction on the globe → time-lapse walk → sandbox (route tracer) → graph: challenge an edge → data story → own route | Journey bar, Route callout, Sized legend (11), List·globe·panel (9), Material biography (5); 51 routes in data | Four-layer tracer (object, material, skill, people); editable sourced edge; data story; before/after slider |
| D Recurrence (F1.5, F1.30) | Timeline with parallel rows | Prediction on rows → chronology with ranges → cards per recurrence → re-time in another calendar → spaced retrieval → three objects with ranges | Span list, Works wall (6), clock readout (five modes) | Rows by region with ranges drawn by confidence (solid, dashed, hatched); pinned guess; eleven-calendar conversion; retrieval set |
| E Thematic argument (F1.3, F1.4, F1.15–F1.24, 15 units) | An argument card | Argument card with prediction → paired cases → step-through of the chain or regime → comparison or credit/driver overlay → controversy → self-explanation → position | Comparison box, Phase strip (7), Process step-strip (19), Character sheet (20), Typology plate (3) | Argument card (claim, counter-claim, case); overlay tagger (drivers, process split, credit rings); provenance link splitter; position brief |
| F Method (F1.2, F1.26, F1.28, F1.28a, F1.30a) | A problem or a prediction | Problem → worked example → faded practice in the tool → self-explanation → partner test → peer check → export | Stepper, Phase strip, Progress bar per item (15) | The tool shells: two-axis sort board, four-criteria grader, operational-sequence log, rule card with branch view; faded practice; export |
| G Mastery research (F1.27, F1.29, F1.31) | The learner's own layer, empty | Two worked cases → brief and plan → field work off-platform → Lineage authoring → peer critique → partner test | List·globe·panel as a read surface only | Graph authoring (no edge saves without a source); consent record; slot template with gaps register; peer critique |

## 4. Kinds of knowledge the course teaches that are not objects

From the specs' lab, opening and apply rows.

| Knowledge | Unit(s) | Surface the spec asks for |
|---|---|---|
| An argument (claim, counter-claim, case; the learner picks a side) | F1.3, F1.17, F1.19b, F1.20, F1.24, F1.28a, F1.30a; openers in F1.5, F1.6, F1.12 | Argument card (form 13) that returns at the end; two readings, each sourced |
| A method from another discipline | F1.4 | Comparison-wall tile that hides a method; prediction, then the record's evidence; saved as a GRM.n rule |
| A protocol | F1.26 (eight CARE-tagged steps, each with evidence or "not done"); F1.29 (seven-step kit) | Step-through with a record per step, placed first on the F1.2 plane |
| A comparison across records | F1.7, F1.9, F1.11, F1.12, F1.20, F1.4, F1.8 | Wall where every cell cites a claim or reads "not recorded"; lenses as rows |
| A lineage | F1.19b (dated, sourced transfers between schools); F1.27 (edges: made at, learned from, copied from, descends from, traded to, credited to, contested by); F1.1 | Graph with sourced edges and confidence; no edge saves without a source |
| A counterfactual | F1.30a; adds in F1.5, F1.13, F1.14, F1.19 | Rule Card (one variable, what stays fixed, three consequences, label "Fiction") and a branch view that greys the changed node |
| A calendar | F1.30; hub retime layer | Dual-axis scrub; each date "as written" converted into eleven calendars, recording what each conversion kept or lost |
| A canon critique | F1.3 | Timeline scrub with "as defined by [source, date]" on every band; a CC0 record-count strip; Thomsen's ages scrubbed region by region |
| A credit map | F1.23 (rings: named, grouped, not recorded; who took the credit); F1.18 (role cards on one object); F1.1 (attribution line with "not known") | Ledger or ring overlay beside the holder's own label, so the gaps show |
| A provenance chain | F1.24 (made, held, removed, sold, given, returned; silences marked); F1.9a, F1.12a, F1.10; 48 hub arcs | Dated links split from the provenance field; a reverse route on the map |
| An oral history, with consent | F1.29; oral adds in F1.4, F1.18, F1.22a, F1.31 | Recording on the learner's device; consent asked twice; a names wall |
| The learner's own place | F1.31 | Slot Builder: own name first, scope, source ladder, one living practice, consultation record, edges to canon, gaps register, status and tier |
| An overlay checked against the record | F1.16 (six drivers), F1.19 (five columns before and after the machine), F1.22a (seven stages), F1.8 (chain of hands), F1.28a (text says / object shows / holder says / I decided) | Tags checked against record text, never opinion; grey cells marked "unknown" |
| A sort, a grade, a ledger, a clause | F1.2 (plane: relation × harm, both positions kept); F1.28 (four criteria); F1.19a (people and goods as layers that never merge); every briefer Apply | Board, grader, two-layer map; a clause into CMB or RGT naming one party it leaves out |

Only the comparison box and the phase strip have a component today. The grouping page itself (card, walk, members, neighbours, afterlives, what is argued, apply hook) has 28 drafts and no component.

## 5. Benchmark

**Dense enough to build the full set of surfaces now.** F1.13 (283 nodes, 199 pinned, 51 routes, 48 provenance arcs, 111 stops): Place, Connections, Story and the journey bar can be fed from data today. F1.24 (117 nodes, 70 pinned, the arcs). The big world chapters F1.6, F1.7, F1.11, F1.8, F1.9 (116–208 nodes, 8–11 open objects each, territory washes), and F1.8's Edo case, already built (2 pieces, 8 pins, 41 eras, 18 Edo nodes). F1.5 (98 nodes; 174 first-known rows, 97% dated) can fill the simultaneity rows. F1.3 and F1.30 have the Time data (219 periods, all dated; 93 civilisation rows) though their own node counts are 27 and 9. F1.14 and F1.22a have 11 open objects each for before/after.

**Thin.** F1.26 (3 objects, 1 open), F1.31 (7 nodes, 2 open), F1.30a (8 nodes), F1.25 (9 nodes), F1.12 (2 open of 11, most content protocol-held), F1.29 (3 open), F1.15 (12 nodes, 4 open), F1.19b (13 nodes), F1.27 (14 nodes). The F and G archetypes are thin by design (the learner supplies the content), but their tool shells have no component and no worked-case data beyond the specs' prose. TASK_27's finding stands: no civilisation has 5 open objects (Nok 1 excluded, Chola 2, Iznik 2, Jingdezhen 1, Benin 2), so civilisations and movements must be grouping pages, not chapters.

**The three biggest data gaps.**

1. **Place.** No canon file holds coordinates. The hub geocodes three kinds (place, maker-community, institution) plus objects at their holders and route stops: 1,218 of 4,666 rows, and 422 of those are "sub-region only, listed not pinned"; geocodes are "proposals, not confirmed identifications" (atlas.json meta). Events (383 rows, 99% dated) have no pin except 8 exhibitions and the Edo ticks; polities (241) have no borders; archaeological cultures (232), horizons (17) and communities (308) have no map presence.
2. **Time.** Start dates cover 87.5% of rows, end dates 52.9%. Living practices are 12% dated, object types 54%, calendars 58%, materials 70%. Four grouping kinds (culture area, environment, period band, age) have no rows and world region is a code, so Time cannot yet show rows by region from canon alone.
3. **Images.** The canon has no per-row image URL or licence field; 494 rows are link-out only. The world set has 374 objects: 235 open, 89 link-out, 31 held, 19 excluded; only 327 reach the hub. Nine units have fewer than 5 open objects, and TASK_26 counts production tools (2) and living practices (1) as critical gaps. The Annotated object page, the course's commonest component, has data for 235 pages.

A smaller fourth gap: `claims_specs_v1.csv` has no node-id column, so claims cannot yet light members on a grouping page.

## Counts

Canon 4,666 rows, 20 files, 22 columns, 25 kinds, 7 families (People 2,044; Things 958; Time 631; Place 495; Ideas 361; Composite 93; Connections 84); primary world F1.11 815, F1.7 809, F1.6 665, F1.8 531, F1.9 454, F1.10 295, F1.12 285, THEME 279, F1.9a 256, F1.12a 159, F1.13 118; start 87.5%, end 52.9%, other_names 84.1%, leaves_out 59.6%, units 92.0%, sources 100%, coordinates 0. Register 799 claims, 38 units. World set 374 objects. Model 38 units; archetypes A 2, B 8 (+ F1.10 as B/C), C 2, D 2, E 15, F 5, G 3; 30 methods. Hub 1,218 nodes (pinned 796: exact 459, approximate 337; listed 422); 51 routes (46 route, 3 copy, 2 extraction); 48 provenance arcs; 8 exhibitions; 9 territories; 7 lenses; 7 families. Grouping-page drafts 28. Design language 18 components (20 numbered sections, one holding two), 6 highlight kinds. Specs 38, batch 1 is 8.

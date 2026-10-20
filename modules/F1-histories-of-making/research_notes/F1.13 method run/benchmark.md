# F1.13 Networks: step 2 — benchmark

Counts by Claude Fable 5.1, 20 October 2026, from `atlas/data/canon/*.csv`, `atlas/data/register/claims_specs_v1.csv`, `atlas/data/register/world_set_specs_v1.csv` and `build/lectures/src/lectures/f1-13.json` (`benchmark.json` beside this file holds the raw counts).

| Measure | Threshold | F1.13 | Verdict |
|---|---|---|---|
| Claims in the register | ≥ 15 | 25 (21 documented, 2 contested, 2 interpretive) | passes; the argument card and the lectures can be built |
| Open objects (CC0 / PD, image in hand) | ≥ 5 | 5 open by licence (4 CC0/PD images not yet in the repo; 1 manuscript) · 0 images in hand | **passes on licence, fails on images**: object pages and galleries are built as frames that say "the holder's photograph, placed at build"; nothing is drawn or generated in their place |
| Rows with a start date | ≥ 60 % | 685 of 743 = 92 % (end dates 461 = 62 %) | passes; span lists, the lane chart and works walls can be built |
| Rows with coordinates or a gazetteer match | ≥ 50 % of place-anchored rows | canon: 0 of 125 place rows; the lecture's gazetteer places 33 points with a source line each | **fails for the unit map**; passes for the nine stations' scenes, which use only gazetteer points. The one-colour map of the whole unit and the Atlas unit tier wait for the coordinate fill; the list twin ships |
| Journeys with dated legs | ≥ 1 | 5 (galleons 1565–1815; gold 1324–25; papermaking by the late 700s; Korean potters 1592–98; cobalt by the 1300s with undated legs between dated ends) | passes; scenes can be built |
| Groupings with "as defined by" | 100 % of those shown | 743 of 743 rows carry `defined_by`; 467 (63 %) carry `leaves_out` | passes for "as defined by"; a grouping without `leaves_out` shows the card without that line and is listed for the editor (276 rows) |
| Living-practice rows with a protocol level | 100 % | 24 rows carry a sensitivity flag; 0 carry a level 1–6 | **fails**: the levels are assigned in `claims.yaml` for the rows the surfaces use (lenj building PRA143; the Siddi COM203; the Korean potters DIA012; Omar ibn Said's text) before any of them is drawn; the other living-practice rows are not shown until assigned |

## What the content can carry now

- The lectures layer (nine stations, already as data) and the beats derived from it.
- The claims register for the unit: 25 register claims plus the dated spans the lecture draws (about 20 more records).
- The lane chart with focus (the unit's spans are dated; three focuses: the blue 1175–1435; the galleons 1565–1815; the Atlantic 1501–1866).
- Four scenes over the lecture's gazetteer (`scenes.md` §7 ranking, below).
- The grouping page for the Indian Ocean (NET005), from the draft, with the human-flow content note and protocol levels assigned.
- The argument card (the cobalt mine, C04; demand or routes, C14).
- The compare sheet is not needed by this unit's spec.

## What waits

- The unit-wide one-colour map and the Atlas unit tier: 125 place rows need coordinates (a gazetteer match against GeoNames is the small job; the lecture already did it for 33).
- Object pages with photographs: the four CC0/PD images need fetching from the holders (not reachable from here); until then, frames with the credit line and a placeholder that says why.
- Grouping pages for the other five networks the lecture names (Silk Roads NET001, trans-Saharan NET010, the galleon NET036, the Atlantic NET035, the Cape Route NET033): the canon rows exist with `defined_by`; the walks are not drafted.
- Protocol levels for the remaining 20 living-practice rows and the 174 human-flow rows that are not used by the surfaces built here.
- A Historian pre-read and the reciprocal reviewer the scope names for F1.13 before anything on the Atlantic or the Indian Ocean's enslaved people is published (`docs/08-scope-v2` §156).

# F1.13 Networks: the method run end to end

The second worked example of the design language's method (`skills/histories-of-making-design/references/method.md`), after Edo. Run on 20 October 2026 on the unit the expandability study found densest. Files in this folder: `research.md` (step 1), `benchmark.md` + `benchmark.json` (step 2), `inventory.json` (step 3), `claims.yaml` + `lint_claims.py` + `register.md` (step 4), `plan.md` (step 5); the builds under `build/units/f1-13-method/` (steps 6–7): `scenes/` (four scenes, two shot mocks), `text/` (the lecture as stations, two scenes' beats, the scene sheet), `lane-chart/` (the lane chart with focus; the two argument cards), `grouping-indian-ocean/` (the network grouping page). `lint_build.txt` is the final lint over all nine built files.

## What the method produced

| Step | Output | Figure |
|---|---|---|
| 1 Research | the unit's sources listed in the method's order; no unit spec yet, so the scope row, the module file, the lecture and the grouping draft stand in | 743 canon rows, 25 register claims, 11 world-set objects, 33 placed points |
| 2 Benchmark | the thresholds table with verdicts and what waits | passes on claims (25), dates (92 %), journeys (5), "as defined by" (100 %); fails on images in hand (0 of 5), coordinates in the canon (0 of 125), protocol levels (0 of 24) |
| 3 Inventory | events, journeys, objects, groups, people, arguments | 25 · 9 · 7 · 5 · 6 · 4 |
| 4 Register | `claims.yaml`, keyed by the claim; the lint | 94 records (86 documented, 5 probable, 3 contested); protocol levels on 26; the human-flow rule on 16 |
| 5 Choose | page types, the identity (cobalt-grey `#4A6472`, the jar motif), scripts (Latin, Arabic, Chinese), protocol levels, reckonings (CE only) | the ranking of nine journeys and runs; four scenes chosen |
| 6 Storyboard, lectures, beats | `scenes.yaml` (4 scenes, 27 shots), `storyboard.md`, `lectures.yaml` (9 stations), `beats.yaml` (2 scenes, 12 beats from 24 captions) | every glyph quoted to its line; the human-flow rule tested on Omar ibn Said's scene |
| 7 Build and lint | six pages at 1440 and 390; the lint over the build | 0 errors, 1 warning (the canon's 1525–1867 against SlaveVoyages' 1501–1866) |

## What the lint caught (and would have shipped without it)

A contested death year driving a scene clock; "the 1590s" in a caption against the register's "1592–98"; a decimal cursor position shown as a readout; the Arita sentence without its confidence word; about fifty dates on the Indian Ocean page that the draft walk carried and the register did not; the neighbours' canon spans unregistered. The lecture build itself (`lint_lecture.txt`) still carries eight errors of the same kinds, which are the lecture author's to fix.

## What the run taught the skill (folded in)

- The scene schema gains `content_note` (once, before the first shot) and `clock.claim`; a caption may list two claim ids.
- A seventh highlight kind, the people card, for unnamed groups moved by force; never a glyph on a leg.
- The lint skips citation and counting years, scans three-digit years, needs `claim` on every mark and route in a lecture build, and reads a grouping page's neighbours through canon-span records.
- Grouping drafts must come with their register records: a walk is a list of claims.
- The benchmark's "image in hand" is the binding constraint for a unit with open licences but no fetched photographs; the frames say so and nothing is drawn in their place.

## What waits, in order

1. The editor freezes `claims-v1` (94 records; eight outside sources named in `register.md`).
2. Coordinates for the 125 place rows (a GeoNames match, as the lecture did for 33), then the unit map and the Atlas tier.
3. The four open images fetched from the holders; then the object pages.
4. The other five grouping walks (Silk Roads, trans-Saharan, galleon, Atlantic, Cape Route), each with its records.
5. The Historian pre-read and the reciprocal reviewer before the Atlantic and the Indian Ocean's forced movements are published; S3 and S4 stay held until then.

# Edo case · UX prototype (4 October 2026)

Six screens of the Edo case as a learner meets it, built as a clickable prototype on the Claude Design canvas
(artifact "Edo Case — UX Prototype") and kept here as source:

| Screen | What it tests |
|---|---|
| `Main.dc.html` | The case page as hub: thesis, figures, the system diagram as index (tap a box, the lectures and interactives that touch it light up), eight lecture cards, ten interactive tiles, cast by role, the object set, the closing checklist, the content note. |
| `Lecture.dc.html` | Lecture 5 "Blue" as a station tour: eight stations, narration with claim ids, one one-tap prediction, one argued station with both readings, two closing one-tap questions. |
| `Margin.dc.html` | I1 Read the margin: five hotspots on Hiroshige's Sudden Shower (Met JP2522), each opening its reading; the check dates the sheet from its seals to one of four censor bands. |
| `Ban.dc.html` | I7 Before and after the ban: a year scrubber 1835–1850; the banned genre fades, the warriors rise, the edict's words appear at 1842, the magistrate's 1847 count at 1847. |
| `Atlas.dc.html` | The Atlas filtered to the case: Time (six proportional era bands and events), Place (schematic map), Movements (schools), Objects (grid); one node card opens from every lens. |
| `Cost.dc.html` | I5 What a sheet cost: seven years, a sheet against a bowl of soba, each figure with its source and confidence; the 1842 cap drawn on the line. |

Images are the open set fetched by `.github/workflows/assets.yml` from the holders' records into `build/assets/edo/` (17 of 20; the three Art Institute IIIF URLs returned 403). In the canvas they are referenced as uploaded assets (`/_blob/<id>`); to run these files elsewhere, point the `src` attributes at `../../assets/edo/<id>.jpg`.

Design: paper ground #F4F2EC, ink #15161A, Prussian blue #1C3E8C as the one accent, seal red #B3301D reserved for predictions and checks; Shippori Mincho for display (kanji-capable), IBM Plex Sans JP for body. The lecture stage is dark (#0F1522) so the prints carry the light.

# The scene framework

One schema, one glyph set, one highlight vocabulary, one clock, one label rule, played by the unit stage, the timeline focus and the Atlas alike. It templates what the eight treatments in `scenes.md` do by hand, so every unit in F1 can author scenes the same way. It answers the brief's point 6: the globe turns to follow, the content decides the elements, time is always shown passing, places are highlighted selectively and differently, nothing overlaps.

## 1. The scene schema

A scene is data in `content/scenes.yaml`, built into `content.json` by `build-content.mjs` (with its own lints, section 9) and copied into the Atlas by `build_data.py`. The same file drives three players: the unit stage (a scene bound to a beat), the timeline focus (a scene opened from a span) and the Atlas (a scene opened from a chapter's lecture list).

```yaml
- id: blue                      # scene id; the Atlas opens it with #sc-blue, the unit with #sc-blue or from a beat
  kind: journey                 # journey | incident | run | demonstration | opener
  title: The blue
  span: [1704, 1831]            # what the clock covers
  claims: [ed-blue-berlin, ed-blue-nagasaki-price, ed-fuji-advert]   # register ids the captions may use
  surfaces: [globe-world, timeline, stage]
  understand: One sentence the learner should be able to say at the end.
  honesty: Four of six legs are undated and drawn dashed; the 1829 fan is shown by an early-1830s sheet.
  guess: b3-2g                  # an existing guess id, or none
  ends_on: { object: redfuji }  # every scene ends on an object on the stage
  shots:
    - n: 1
      surface: globe-world
      camera: { move: settle, keep: [berlin, edo] }        # settle | follow | push | cut | hold
      clock: { mode: point, readout: "c. 1704" }           # point | span | step | crawl | held
      actors:
        - { glyph: pigment, at: berlin }
      labels: { primary: berlin, others: [edo] }           # one primary, at most three others
      dim: [routes, marks]                                 # what fades to a quarter
      caption: { text: "...", sources: [fitzhugh, smith-blue], claim: ed-blue-berlin }
      duration: held                                       # held | <seconds> (auto-step only inside a run, with pause)
      reduced: cut                                         # what reduced motion does: cut | fade | still
    - n: 2
      surface: globe-world
      camera: { move: follow, legs: [[berlin, amsterdam], [amsterdam, cape], [cape, batavia], [batavia, nagasaki]], per_leg: 1.2 }
      clock: { mode: span, readout: "1704–1824" }
      actors:
        - { glyph: ship, follow: legs, dated: false }      # dashed legs, glyph rides the line
      labels: { primary: nagasaki, others: [amsterdam, cape, batavia], ink_as_drawn: true }
      ...
```

Rules the schema enforces: one `camera` move per shot; one `primary` label; `claims` on every caption that carries a date or a number; `honesty` present; `reduced` present; a `journey` has at least one `follow` shot; a `run` has at most nine ticks; an `incident` has a `before` shot held before anything moves.

## 2. The camera: the globe turns to follow

- **Follow.** Before a leg draws, the globe turns so that both ends of the leg are within 70° of the view centre, then the leg draws at 1.2 s regardless of distance. The leading stop stays inside the central 60% of the view. A leg never draws behind the limb; if a leg would, the turn comes first and takes up to 2 s. The map (2D fallback) pans the same way.
- **Settle.** One move that brings a named set of places into view with 12% margin, ≤ 2 s city, ≤ 4 s continental, then 400 ms still before the caption lands.
- **Push.** A slow push-in on one place, 6–8 s, used only by openers and by the last shot before a stage object.
- **Cut.** No motion; used between surfaces (globe → sheet → stage) and for every move under reduced motion.
- **Hold.** The camera is still; only actors, the clock and captions change.
- **Inset.** Any cut from world to region shows the locator inset (the Atlas's globe at 120 px) with the full route at a quarter, until the scene returns to world scale.
- **Ambient.** No drift inside a scene. Drift (≤ 4°/s) exists only in Explore and the Atlas world view when no scene is playing.

## 3. The clock: time always shown passing

The v4 bar's live year and era readout becomes the clock of every scene and sits in the same place (top right) on every surface. Five modes:

| Mode | Readout | When |
|---|---|---|
| point | `1842 · Tenpō 13` | one dated tick |
| span | `1704–1824` with a bar on the timeline strip | undated legs between two dated ends; the readout does not move, the bar shows the extent |
| step | `1824 → 1825 → … 1828`, one year per tick, 1–2 s each | a dated run of ticks (the price falling) |
| crawl | the year advances continuously with a pause bar; the caption's counter climbs | a long span with a count (218 shipments over eleven years; 408,000 sheets over eight months) |
| held | `1833 · clock held` in the readout's muted style | a spatial stepper where nothing is dated (the Tōkaidō's stations) |

The timeline strip under every map surface shows the scene span, the ticks and the cursor; the lane chart in the unit is the same component at full size. Months and days use the source's calendar as written ("sixth month 1842", "day 2 · morning"); Gregorian conversion is never shown unless the register holds it.

## 4. The highlight vocabulary

Six kinds of thing can be highlighted on the globe, the map or the sheet. They differ in shape, colour and motion together, never in colour alone, and a scene uses at most two kinds at once.

| Kind | Mark | Colour | Motion | Label | Opens |
|---|---|---|---|---|---|
| **Journey** | a line with a glyph riding it; dated stops as solid dots, undated as dashes | indigo | draws, glyph moves | the leading stop, inked as reached | the stop's card |
| **Incident** | a single pulse ring that settles to a dot; approximate places are soft blots | seal red | one pulse of 600 ms | the place and the date | the event's card |
| **Lecture place** | a folded-paper mark | ink | none | the lecture's title | the lecture (panel or room) |
| **Object holder** | a small frame | ink, pale | none | the museum, on tap | the object |
| **Person** | the v4 chip | ink | none | the name | the character sheet |
| **Mentioned place** | a pale hollow dot | ink-3 | none | none unless tapped | the place card |

Rules: a lecture does not highlight every place it mentions; mentioned places stay pale and unlabelled. A place becomes a journey stop only when a leg reaches it, an incident only when a tick fires. The washes (chapters) and lenses recolour the ground, never the marks. The learner's ink (what they have engaged) darkens a mark's fill and nothing else.

## 5. The glyph library

Fourteen micro-elements, own drawings in the washi/sumi style, CC0, 24 px grid, two weights of sumi line, one wash colour each (indigo for trade, seal red for the state, ink for objects). Each is drawn only where a content line demands it (`scenes.md` quotes the line next to each). None is decorative.

| Glyph | Demanded by | Motion (reduced: still) |
|---|---|---|
| ship | Dutch legs (Amsterdam → Nagasaki) | rides the leg; a two-frame bob |
| junk | the Chinese junks from 1824 | rides the leg; batten sails |
| steamer | Messageries Maritimes, Pacific Mail | rides the leg; smoke trails back |
| crate | shipments of prints; the 1867 exhibit | rides the leg; a counter beside it |
| pavilion | Japan's pavilion in Paris 1867; the three theatres | a roof that settles at the stop |
| shop | Tsutaya's, Eijudō, Hayashi's | a curtain that drops once |
| book | Le Japon artistique; the Manga | a page that turns once |
| fan | the all-blue fan, 1829 | opens once |
| pigment | the blue made in Berlin | a drop that blooms |
| coin | prices in mon, monme | a flip; the number rides the caption |
| soba bowl | the price of a sheet against a bowl | steam, two frames |
| flame | the three fires of 1657 | three tongues, 600 ms loop, on an approximate blot |
| seal (one cut, three stamped) | kiwame 1790; nanushi 1843; aratame 1853 | the cut one is carved into the block; the stamped ones press once |
| bubble | print runs (8,000; 15,000; 408,000) | grows to its size |

A flag, a theatre on fire or a person walking is not in the set because no line in the content demands them. The set grows only when a new unit's content demands a new glyph, and the glyph is added to the shared library, not to the unit.

## 6. Labels: nothing overlaps

- Budget per shot: one primary label and at most three others. The primary is the stop being reached, the place pulsing, or the object's holder.
- Placement: the Atlas's greedy placer (`labels.js`) with priority primary > reached stop > others, a minimum of 18 px between any two labels, and a leader line when the label has to move more than 24 px from its mark.
- Close pairs (Sakai-chō / Fukiya-chō, Kanagawa / Yokohama, Berlin / Amsterdam, Asakusa / Shin-Yoshiwara / Saruwaka-chō, Boston / New York) are labelled one at a time as their leg draws or their tick fires; never both at once. On a sheet, two places closer than 18 px share one leader and one label ("Sakai-chō · Fukiya-chō").
- Captions never cross a label: the caption sits in a fixed slot (bottom left on maps, beside the object on the stage) and the placer treats the slot as occupied.
- Scene labels survive the per-frame label pass: the Atlas's `updateLabels` takes the scene's set first.

## 7. Pace

From the first study and the precedents: settle ≤ 2 s city / ≤ 4 s continental; 400 ms before a caption; 1.2 s per leg; one 600 ms pulse; auto-step 2.5–4 s with a pause bar, only inside a run; crawl ≤ 22 s with a pause bar; nothing auto-advances past 5 s without a control; 3–7 shots and ≤ 9 ticks per scene; every scene playable with arrows and space; reduced motion is the same scene with cuts and fades.

## 8. The three templates

**Journey.** Guess (if existing) → settle on the first place, clock point → follow the legs with the glyph, clock span or step, labels ink as reached, other routes at a quarter → the count or price on the caption, clock step or crawl → push to the last stop → cut to the object on the stage. Honesty line names the undated legs and any stand-in image.

**Incident.** Settle on the sheet with the "before" state held 2 s, clock point → tick: the pulse and the glyph at the place, the caption with the date and figure → further ticks in order, each with its own readout, close pairs labelled in sequence → the consequence as one leg (a move) or one card (a count as a range) → cut to the object. Honesty line names the approximate blots and the map's date against the event's.

**Run.** The lane chart zooms to the span, ticks listed, the "before" held → ticks fire in order, each changing one lane or one mark; a sheet or map cut when a tick has a place, with the inset → a crawl for the one count that climbs → the argued station offered after the evidence → cut to the object. Twelve ticks at most; longer runs split.

## 9. Lints for `build-content.mjs`

Every scene: kind, span, claims, honesty, ends_on, reduced per shot. Every caption ≤ 25 words with sources and, if it carries a year or a number, a claim id that the register holds. One primary label per shot; others ≤ 3; no two labelled places closer than 18 px on the surface's projection unless they share a leader. A journey has a follow shot; a follow shot's legs all have both ends in `places.yaml`; undated legs are marked `dated: false`. An incident's first shot is a hold with `before: true`. A run has ≤ 9 ticks. A glyph id is in the library. A guess id exists in the story. Every surface named exists for the unit.

## 10. The v4 finish

Carried over unchanged: the washi ground and paper grain, the sumi line weights, indigo for the trade and seal red for the state only, the ink-bleed reveal, the motion tokens `--d-*` and `--e-*`, the scene sheets on the ink thread, the bar with the live year and era (now the clock), the Cast chip and sheet, the labs' workbench frame. Retired: the nine-shot overture as an opener; its two WebGL shots become stage demonstrations (study 1, S6).

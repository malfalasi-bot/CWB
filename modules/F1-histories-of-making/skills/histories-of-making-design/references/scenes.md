# Motion, layers, focus and scenes

From the first two studies (`research_notes/Motion layers and focus/STUDY.md`, `FRAMEWORK.md`, `scenes.md`). Animation goes only where it explains: openers, demonstrations, journeys, incidents, runs. Everything else holds still. In Edo, 47 of 71 beats do not move at all, and the whole animation budget is spent on 20 journeys, 16 runs, a dozen placed incidents and six object demonstrations.

## 1. The concept these rules serve

| Decision | Choice |
|---|---|
| Spine | Acts on the unit's own bets (Edo: five publishers' bets); no 3D overture as an opener; the Coda Rebuild stays |
| Layout | Pinned stage + scene sheets on an ink thread + full-screen rooms |
| Navigation | Act numerals + live year/era (the clock) + Explore; rooms menu and Cast deck kept |
| Tools | The in-lecture interactives inline, where the story needs them; the labs (Desks, Workshop, Views) as linked rooms |
| Motion | Scoped, redistributed: openers, demonstrations, journeys, scenes; nothing else |
| Map | A three-scale ink map in the unit; the Atlas globe as the hub, completed first, then layered with scenes |
| Timeline | The lane chart (v3/v4), reactivated; the fast sweep dropped; stop-and-play focus on one event, object, journey or run |
| People | Three layers: inline card at first mention → linked entity sheet → character cards and the Cast deck |
| Text | Beats on the stage as hinges; the full lectures as a linked layer through the station player (`beats.md`) |

## 2. The moment grammar

Six kinds of moment. Each has one surface, one trigger, one thing that moves and a pace. A beat has at most one.

| Moment | Where | Trigger | What moves | Pace |
|---|---|---|---|---|
| **A. Opener** (act, lecture, chapter) | the stage; the map at the act's scale | entering the act | one slow push-in on a still map, then the title card lands; nothing else | 6–8 s, then held |
| **B. Journey** | map or globe | the beat that names it; the Atlas layer | a route drawn stop by stop; each stop gets a date and a number; the rest dims | 1–1.5 s per leg, held at each stop |
| **C. Incident** | a dated sheet or the regional map | the beat; a timeline tick | the camera settles on the place, the mark pulses once, the caption carries the date | 2 s settle, one pulse, held |
| **D. Demonstration** | the stage (an object), never the map | the beat; a room | an object taken apart or rebuilt in steps the reader takes | reader-stepped, never auto |
| **E. Run of events** | the timeline focus, the map answering | selecting a group; an act's Rebuild | the lane chart zooms to the span; items tick in order; each tick changes one thing | 2.5–4 s per tick, with a pause bar |
| **F. Still** | the stage | default | nothing; a crossfade at most | — |

Ten rules:

1. One focus per beat. A beat that needs two things to move is two beats.
2. The camera settles before the caption lands. A caption is never read during a flight.
3. Dim, don't hide. Other routes and marks fade to a quarter; the context stays.
4. Every journey steps at dated stops at a constant time per leg. Distance never sets duration.
5. The reader holds the pace. Auto-step exists only inside a focus (E) and shows a pause control; nothing auto-advances longer than five seconds without one.
6. The timeline is the clock. Anything with a date moves the "now" cursor, and the cursor moves the map. There is no second clock.
7. Reduced motion keeps every caption and every end state and replaces every flight and draw with a cut or a fade.
8. Toggles live only in Explore. In the story a layer arrives because a moment needs it and leaves when the moment ends.
9. Ambient motion (globe drift, paper grain) stays under 4° a second and exists only in Explore and the Atlas world view with no scene playing.
10. An opener that explains nothing is cut.

## 3. The layers

A layer is a set of marks with one meaning. The year is the master switch; a scene or a lens is the second; the learner's ink is the third. Nothing is a toggle in the story.

| Layer | Holds | Driven by |
|---|---|---|
| Washes | the world chapters as brushed territories, always faint on the globe | nothing |
| Routes | schematic routes with start and end years, drawn to the year | year, lens |
| Places | pinned nodes, clustered at world tier, marks at region tier | year, tier |
| Journeys | dated, stepped movements, one at a time, as a scene | scene, timeline focus |
| Events | dated incidents with a place; marks pulse at their tick | timeline focus |
| Lectures | each lecture pinned to the place it is about (a folded-paper mark) | the Atlas layer menu; the lecture layer in the unit |
| Lenses | thematic units that recolour the marks, never the ground | lens (Atlas only) |
| Ink | what the learner has engaged: a darker fill on a mark, nothing else; the only persistent change | hand-off tokens |
| Focus mask | dims everything outside the current moment, on every surface | scene, focus |

A layer never switches on. It arrives in one of three ways and leaves the same way: **because the clock reached it** (the cursor crosses 1824 and the junks' arc draws; leaves the span and it fades to a quarter, then out); **because a scene asked for it** (the scene brings one route, the mask around it, one lane under it, nothing else; the mask lifts when the scene ends); **because the learner inked it** (a place read stays inked in every view).

Two layers are data a unit must hold before any scene: journeys with dated legs, and events with coordinates. Where a unit lacks them, its scenes wait (`method.md` §2).

## 4. The timeline as the clock

The lane chart (lanes for the state, the makers, the objects, the world, the afterlife; a price lane; run bubbles; a calendar lane for the source's reckoning) is the only timeline. Three rules:

1. **No fast sweep.** Nothing runs the cursor across centuries in seconds; nothing can be read at that speed.
2. **Focus.** Selecting an event, a group or a journey (from the chart, a beat, the Atlas) zooms the chart to that span, never narrower than ten years, and lists the items in the span as ticks. The map and the stage answer the cursor. Inside a focus the chart dims outside the span and the map dims outside the focus's places.
3. **Stop-and-play.** Inside a focus, Play steps the cursor tick to tick, holds 2.5–4 s at each (longer for a longer caption) and shows a pause bar; Step moves one tick; Hold stays; Escape leaves the focus and restores the full span. Arrows step, space pauses, Escape leaves.

A **group** is a focus with a story (the censor regimes: four seals, four ticks); a **journey** is a focus whose ticks are stops; an **event** is a focus with one tick that settles the map and holds. The cursor carries the date caption and the era name. The lecture player's stations are the same ticks, so a station can move the map.

## 5. The scene schema

A scene is data (`content/scenes.yaml`), built into the unit's content and copied to the Atlas, and played by three players alike: the unit stage (bound to a beat), the timeline focus (opened from a span) and the Atlas (opened from a chapter's lecture list).

```yaml
- id: blue
  kind: journey                 # journey | incident | run | demonstration | opener
  title: The blue
  span: [1704, 1831]            # what the clock covers
  claims: [ed-blue-berlin, ed-blue-nagasaki-price, ed-fuji-advert]   # register ids the captions may use
  surfaces: [globe-world, timeline, stage]
  understand: One sentence the learner should be able to say at the end.
  honesty: Four of six legs are undated and drawn dashed; the 1829 fan is shown by an early-1830s sheet.
  guess: b3-2g                  # an existing prompt id, or none
  ends_on: { object: redfuji }  # every scene ends on an object on the stage
  shots:
    - n: 1
      surface: globe-world
      camera: { move: settle, keep: [berlin, edo] }        # settle | follow | push | cut | hold
      clock: { mode: point, readout: "c. 1704" }           # point | span | step | crawl | held
      actors: [ { glyph: pigment, at: berlin } ]
      labels: { primary: berlin, others: [edo] }           # one primary, at most three others
      dim: [routes, marks]                                 # what fades to a quarter
      caption: { text: "…", sources: [fitzhugh, smith-blue], claim: ed-blue-berlin }
      duration: held                                       # held | <seconds>; auto-step only inside a run, with pause
      reduced: cut                                         # cut | fade | still
    - n: 2
      surface: globe-world
      camera: { move: follow, legs: [[berlin, amsterdam], [amsterdam, cape], [cape, batavia], [batavia, nagasaki]], per_leg: 1.2 }
      clock: { mode: span, readout: "1704–1824" }
      actors: [ { glyph: ship, follow: legs, dated: false } ]   # dashed legs; the glyph rides the line
      labels: { primary: nagasaki, others: [amsterdam, cape, batavia], ink_as_drawn: true }
```

The schema enforces: one `camera` move per shot; one `primary` label; a `claim` on every caption that carries a date or a number; `honesty` present; `reduced` on every shot; `ends_on` an object; a journey has at least one `follow` shot; a run has at most nine ticks; an incident has a `before` shot held before anything moves.

### The camera: the globe turns to follow

- **Follow.** Before a leg draws, the globe turns so both ends of the leg are within 70° of the view centre, then the leg draws at 1.2 s regardless of distance; the leading stop stays inside the central 60 % of the view. A leg never draws behind the limb; if it would, the turn comes first (up to 2 s). The 2D map pans the same way.
- **Settle.** One move bringing a named set of places into view with 12 % margin: ≤ 2 s city, ≤ 4 s continental, then 400 ms still before the caption lands.
- **Push.** A slow push-in on one place, 6–8 s; only in openers and in the last shot before a stage object.
- **Cut.** No motion; between surfaces (globe → sheet → stage) and for every move under reduced motion.
- **Hold.** The camera is still; only actors, the clock and captions change.
- **Inset.** Any cut from world to region shows the locator inset (the globe at 120 px) with the full route at a quarter until the scene returns to world scale.
- **Ambient.** No drift inside a scene.

### The clock: time always shown passing

The readout sits top right on every surface (`calendars.md` for its form).

| Mode | Readout | When |
|---|---|---|
| point | `1842 · Tenpō 13` | one dated tick |
| span | `1704–1824` with a bar on the strip | undated legs between two dated ends; the readout holds, the bar shows the extent |
| step | `1824 → 1825 → … 1828`, 1–2 s per tick | a dated run of ticks (a price falling) |
| crawl | the year advances continuously with a pause bar; the caption's counter climbs | a long span with a count (218 shipments over eleven years) |
| held | `1833 · clock held`, muted | a spatial stepper where nothing is dated (the stations of a road) |

The timeline strip under every map surface shows the scene span, the ticks and the cursor; the lane chart is the same component at full size. Months and days use the source's calendar as written.

### The highlight vocabulary

Six kinds, differing in shape, colour and motion together, never in colour alone; at most two kinds on screen at once.

| Kind | Mark | Colour | Motion | Label | Opens |
|---|---|---|---|---|---|
| Journey | a line with a glyph riding it; dated stops solid dots, undated dashes | indigo | draws; the glyph moves | the leading stop, inked as reached | the stop's card |
| Incident | one pulse ring settling to a dot; approximate places as soft blots | seal red | one 600 ms pulse | the place and the date | the event's card |
| Lecture place | a folded-paper mark | ink | none | the lecture's title | the lecture |
| Object holder | a small frame | ink, pale | none | the museum, on tap | the object |
| Person | the chip | ink | none | the name | the character sheet |
| Mentioned place | a pale hollow dot | ink-3 | none | none unless tapped | the place card |

A lecture does not highlight every place it mentions; mentioned places stay pale and unlabelled. A place becomes a journey stop only when a leg reaches it, an incident only when a tick fires. Washes and lenses recolour the ground, never the marks.

### The glyph library

Own drawings in the washi/sumi style, CC0, 24 px grid, two weights of sumi line, one wash colour each (indigo for trade, seal red for the state, ink for objects). Each is drawn only where a content line demands it; the storyboard quotes the line beside the glyph. None is decorative. The set grows only when a new unit's content demands a glyph, and the glyph joins the shared library, never the unit.

| Glyph | Demanded by (Edo) | Motion (reduced: still) |
|---|---|---|
| ship | the Dutch legs | rides the leg; a two-frame bob |
| junk | the Chinese junks from 1824 | rides the leg; batten sails |
| steamer | the mail lines of the 1860s | rides the leg; smoke trails back |
| crate | shipments of prints; the 1867 exhibit | rides the leg; a counter beside it |
| pavilion | the pavilion in Paris 1867; the three theatres | a roof that settles at the stop |
| shop | a publisher's shop | a curtain that drops once |
| book | a book that travels | a page that turns once |
| fan | the all-blue fan, 1829 | opens once |
| pigment | the blue made in Berlin | a drop that blooms |
| coin | prices in mon, monme | a flip; the number rides the caption |
| soba bowl | a price against a bowl | steam, two frames |
| flame | the three fires of 1657 | three tongues, 600 ms loop, on an approximate blot |
| seal | kiwame 1790; nanushi 1843; aratame 1853 | the cut one is carved; the stamped ones press once |
| bubble | print runs | grows to its size |

Not in the set, because no content line demands them: a flag, a building on fire, a person walking. No person glyph rides a coerced or trade leg; punishments are named with their verbs and no glyph.

### Labels: nothing overlaps

One primary label and at most three others per shot; the primary is the stop being reached, the place pulsing, or the object's holder. A greedy placer with priority primary > reached stop > others, 18 px minimum between labels, a leader when a label moves more than 24 px from its mark. Close pairs are labelled one at a time as their leg draws or tick fires, never both at once; on a sheet, two places closer than 18 px share one leader and one label ("Sakai-chō · Fukiya-chō"). The caption sits in a fixed slot (bottom left on maps, beside the object on the stage) and the placer treats the slot as occupied. Scene labels take precedence over the per-frame label pass.

### Pace

Settle ≤ 2 s city / ≤ 4 s continental; 400 ms before a caption; 1.2 s per leg; one 600 ms pulse; auto-step 2.5–4 s with a pause bar, only inside a run; crawl ≤ 22 s with a pause bar; nothing auto-advances past 5 s without a control; 3–7 shots and ≤ 9 ticks per scene (a longer run splits); every scene playable with arrows and space; reduced motion is the same scene with cuts and fades.

## 6. The three templates

**Journey.** Prompt (if one exists) → settle on the first place, clock point → follow the legs with the glyph, clock span or step, labels inked as reached, other routes at a quarter → the count or price on the caption, clock step or crawl → push to the last stop → cut to the object on the stage. The honesty line names the undated legs and any stand-in image.

**Incident.** Settle on the sheet with the "before" state held 2 s, clock point → tick: the pulse and the glyph at the place, the caption with the date and figure → further ticks in order, each with its own readout, close pairs labelled in sequence → the consequence as one leg (a move) or one card (a count as a range) → cut to the object. The honesty line names the approximate blots and the map's date against the event's.

**Run.** The lane chart zooms to the span, ticks listed, the "before" held → ticks fire in order, each changing one lane or one mark; a sheet or map cut when a tick has a place, with the inset → a crawl for the one count that climbs → the argued station offered after the evidence → cut to the object.

Openers follow moment A; demonstrations moment D (an exploded view or step-strip on the stage, reader-stepped, never on a map).

## 7. Choosing which journeys and runs get scenes

Rank a unit's journeys and runs by five things before any storyboard: significance to the unit's argument; density (dated stops, counts, prices); assets in hand (open objects to end on); visual potential (does the globe have to turn; does anything count up); sourcing (every leg's date in the register). The top four get scenes first; the rest get the journey bar and the list twin until their data arrives.

## 8. Lints for scenes

Every scene: kind, span, claims, honesty, ends_on, reduced per shot. Every caption ≤ 25 words with sources and, if it carries a year or a number, a claim id the register holds. One primary label per shot; others ≤ 3; no two labelled places closer than 18 px on the surface's projection unless they share a leader. A journey has a follow shot; a follow shot's legs all have both ends in `places.yaml`; undated legs are marked `dated: false`. An incident's first shot is a hold with `before: true`. A run has ≤ 9 ticks. A glyph id is in the library. A prompt id exists in the story. Every surface named exists for the unit.

## 9. What each surface does with this

- **The unit stage.** Beats keep the scene sheets on the ink thread. Each act opens with a moment A over its map scale. The in-lecture interactives return as inline widgets placed where the story needs them, each with a "What this shows" line and no autoplay. Any former overture shot that explains something becomes a stage demonstration; the rest are cut.
- **The dated sheet and regional map.** Tick order for incidents and moves; stop-and-play; no new placement invented; approximate places stay blots.
- **The unit timeline.** The lane chart with focus, stop-and-play and the calendar lane; the cursor is the only clock; every map beat and widget listens to it.
- **The Atlas globe.** Completed first; then the scene system and the two data layers; then the lecture and journey layer menu at world tier. Choosing a lecture flies to its places, lands the chapter card (two or three sentences, one date, one number), plays its scenes stop by stop with the step control and the strip, and hands off to the unit at any stop.
- **Rooms.** Unchanged; linked from beats and demonstrations.
- **Lectures.** The full lectures through the station player, as a layer opened from the act bar and the Atlas; stations bound to ticks (`beats.md`).

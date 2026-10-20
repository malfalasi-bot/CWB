# Review checklist

Run against a screenshot at 1440 px and at 390 px (and in the dark room if the surface has one). Each line is a yes or a no; a no is a fix, not a note.

## Ground and colour
- [ ] Paper ground with the grain; no dark surface outside the lecture room.
- [ ] Only indigo (trade) and seal red (state, incidents, the cursor) beyond ink; the lecture colour appears only on the lecture's own elements.
- [ ] Body text is `--ink` on `--paper` (4.5:1 or better); no grey on grey.
- [ ] No flags, emoji, icon rows, slogans, glow, neon, scan lines.

## Type
- [ ] Source Serif 4 body at 17/1.55 (16 on phones), lines ≤ 68 characters (the measure, not the paragraph).
- [ ] Titles pair roman and italic; decks are one italic sentence.
- [ ] Annotations: `600 12px` name over `400 12px` one sentence, ≤ 25 words.
- [ ] One pull-fact per page, the number in 600; eyebrows and readouts in mono.

## Rhythm
- [ ] Band · one large thing · a row of objects with captions under · the reading · sources · stepper.
- [ ] Captions under images, never over; one tag per element at most.
- [ ] Space separates; rules, boxes and shadows appear only over maps and images.

## Objects
- [ ] Every object has holder · accession · date · materials · licence; a date below documented carries its confidence word.
- [ ] Annotated object page: 3–7 leaders, no crossings, no overlaps, scale figure, location thumb, "appears in", sources.
- [ ] Exploded view: one axis, true relative sizes, reader-stepped, reduced motion shows the exploded state.
- [ ] Typology plate: ranges under objects, one scale, undated at the row's end.

## Time
- [ ] The clock readout at the top right on every surface that has a date (a compare sheet or an argument card has none and shows no clock); mode fits the content (point · span · step · crawl · held).
- [ ] Ranges are bars, never points; argued dates never drive a tick, a tile or a clock.
- [ ] A route scene has the journey bar; a run or a focus has ≤ 9 ticks; a scene has 3–7 shots; a span list has both ends per row.
- [ ] No fast sweep; auto-step only inside a focus, with a pause control, ≤ 5 s between controls.

## Maps and scenes
- [ ] At most two highlight kinds on screen; mentioned places pale and unlabelled.
- [ ] One primary label and ≤ 3 others; second line under the name; 18 px between labels; close pairs in sequence or one leader.
- [ ] The globe turns before a leg draws; no leg behind the limb; 1.2 s per leg; undated legs dashed.
- [ ] Nothing drifts inside a scene; dim, don't hide; the inset locator on a region cut.
- [ ] Glyphs from the shared library only, each demanded by a content line; no invented placement; approximate places as soft blots with the honesty line.

## Lists, panels, cards
- [ ] List · globe · panel: the panel ends with sources and previous / next; arcs for the selected thing only.
- [ ] Cards carry a real object, a place as a wash, a date; a 4 px lecture bar and motif where the card is a lecture's.
- [ ] Frosted panels only over maps and images, never stacked more than two deep.

## Access and rules
- [ ] Keyboard: every stepper, bar, card and label reachable; arrows step scenes; Escape leaves a focus.
- [ ] Reduced motion: the same page with cuts and fades; captions and end states identical.
- [ ] Quotes ≤ 25 words; no priority claim ("earliest known", never "first", "invented", "the origin of"; the word inside a quoted title or name is not a claim); names as the community writes them; the Yoshiwara read, not played.
- [ ] No points, badges, streaks, leaderboards, timers, confetti, completion percentages.

## Groupings, relations and arguments
- [ ] Every grouping shows "as defined by [who, when]", its membership confidence, "what it leaves out", and the region an age or period was defined for; the civilisation word is not in navigation.
- [ ] No movement drawn as a line from one origin; no polity as a succession chain; no rise-and-fall curve without a source; groupings carry no identity colour.
- [ ] Relation graph: every edge typed and sourced; documented solid, probable dotted, contested dashed; ≤ 40 nodes; no drifting layout; a list twin on phones.
- [ ] Compare sheet: the same six readings; "not known" cells; one scale; the "leaves out" row; nothing coloured or ranked.
- [ ] Argument card: two readings, neither coloured, both sourced, never marked right; the card returns at the end.
- [ ] Credit map and coverage grid: "unnamed" / "not known" / "none open" rows kept; counts say who counted and when.
- [ ] Branch view: one variable, the ghost in `--ghost` with no date, place or glyph; atrocity never the variable; posed after the evidence.

## Scripts, names, calendars
- [ ] Each script loads its own serif and sans with `lang`; RTL runs isolated; axes and steppers never mirror; no faux italic or bold.
- [ ] Names as the community writes them; the own name first, the record's exonym after it in quotation marks; transliteration named once.
- [ ] The readout is CE · the source's reckoning; lunar years across two CE years written as both; Long Count with its correlation; no conversion the register lacks; BCE written out.

## Protocol
- [ ] Every living-practice, sacred, coerced or seized item carries a protocol level (1–6) and the page draws it: Notice first, content note once, display basis, link-out, excluded in words, or held.
- [ ] The course notices but never labels; restricted stays discoverable but inaccessible with the reason; consent shown as who, what, when; no generated image; no interior; never a game.

## Scenes and the clock
- [ ] Every scene has a kind, a span, claims, an honesty line, `ends_on` an object, and `reduced` on every shot; 3–7 shots; a journey has a follow shot; an incident opens on a held "before"; a run has ≤ 9 ticks.
- [ ] One camera move per shot; the camera settles 400 ms before the caption; no fast sweep; a focus never narrower than ten years; stop-and-play with a pause bar; arrows step, space pauses, Escape leaves.
- [ ] A layer arrives because the clock reached it, a scene asked for it or the learner inked it; no toggle in the story; no second clock; nothing drifts inside a scene.
- [ ] Every glyph is in the shared library and the storyboard quotes the content line that demands it; no person glyph on a trade or coerced leg.

## Lectures, beats and people
- [ ] Lectures are stations (one instrument state, one showable claim each) in `lectures.yaml`; stations are the lane chart's ticks; the player never auto-plays.
- [ ] Beats are derived from stations: one threshold first, 3–7 after; each of one kind at its length; a station chip on every beat except asides; ≤ 1 aside, ≤ 1 prompt, neither first nor last; no reveal beat.
- [ ] Every beat names its subject and date in its own words; no dependent opening; a focus has one number or date and one mark; a caption names the instrument first; confidence words only in notes and a prompt's `say`.
- [ ] People in three layers: inline card at first mention, entity sheet, character cards and Cast; a person never rides a leg.

## The claims register
- [ ] Every date and number on the surface is a record in `claims.yaml` with value, precision, calendar, confidence, sources, alternates and one display string; the register is frozen before authoring.
- [ ] Documented unmarked; probable, contested and argued carry the word in the sentence; a range is a bar, a circa a halo, an argued value never a tick, a tile or a clock.
- [ ] The lint reports no E-codes; every canon disagreement is fixed or carries an editor note.

## Method (for a new unit)
- [ ] Research, benchmark, inventory, register, choose, storyboard, build: each step has its file in the unit's research notes, and the benchmark table says what waits.

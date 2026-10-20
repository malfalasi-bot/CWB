---
name: histories-of-making-design
description: The design language of the F1 "Histories of making" course (the Edo unit, the Atlas of Making hub, every later unit). Use it whenever you design, build, review or redesign any course surface — a unit page, a lecture, a scene, a map or globe view, a timeline, an object or object gallery, a character sheet, a chapter or unit card, a composer or study page — or whenever the user asks for "the course look", "the washi/sumi finish", "make it look like v4", an annotated object page, an exploded view, a typology plate, a span list, a journey bar, or a list–globe–panel layout. Also use it to judge screenshots or mockups of course pages. It carries the tokens, the type, the page rhythm, eighteen components with their rules, and a review checklist. Do not skip it for "quick" pages: the quick pages are where the finish gets lost.
---

# Histories of making: the design language

A course page is a gallery wall, not a dashboard. One object large; the smallest apparatus that explains it; time given the shape the content has; a map that highlights one kind of thing at a time. Everything below exists to make that happen on every surface, by anyone, including on the days nobody is thinking about design.

The language was fixed in three studies (October 2026): the v4 finish the lead chose; the motion, layers and scene framework (`research_notes/Motion layers and focus/`); and twenty design references (`research_notes/Design language references/references_study.md`). This file is the operating summary. `references/components.md` has the full component rules, `references/tokens.css` the tokens, `references/checklist.md` the review.

## 1. The ground: washi, sumi, two accents

The page is paper. Text is ink. Only two things get colour: the trade (indigo) and the state (seal red). Everything else earns attention by size and placement, not colour.

- Paper `#F1EADB`, with the grain texture (`--tex`) at low opacity. Dark mode is the lecture room only: sumi ground `#16140F`, washi text `#EFE8D8`, and the same two accents lifted (`--indigo #9CB4E6`, `--seal #E2583F`).
- Ink `#1D1A15`, with `--ink-2` and `--ink-3` for secondary and tertiary text. Never grey on grey: body text is always `--ink` on `--paper` (4.5:1 or better).
- Indigo `#233C6B` for routes, journeys, prices and anything the trade carried. Seal red `#B3301E` for the censor, the state, incidents, and the "now" cursor. Nothing else is red. A fire is seal red because it is an incident; a sale is indigo because it is trade.
- Four season colours (`--spring --summer --autumn --winter`) exist for the Hundred Views and the Tōkaidō only.
- Each lecture has one muted colour and one motif (`--lecture-N`, section 4). That colour appears only where the lecture itself appears: its card, its threshold, its tick, its panel header, its journey bar. It never colours a route or a mark.

Why so strict: on a paper ground, a third colour reads as an alert. The references that used colour freely (travel pastels, dashboard lime) were the ones that would have fought the objects.

## 2. Type

- Body and captions: **Source Serif 4** (fallback Iowan Old Style, Georgia). 17 px body at 1.55 on desktop, 16 on phones. Paragraphs at most 68 characters wide.
- Display: **Shippori Mincho** for titles that carry Japanese and for act numerals; Source Serif 4 for everything else. Titles pair a roman with an italic in one line: "A bet *on blue*", "City *Unplugged*". The italic carries the idea, the roman the subject.
- UI, labels, annotations: **IBM Plex Sans**. Annotation labels are 600 12 px (the name) over 400 12 px (one sentence). Eyebrows and readouts: **IBM Plex Mono** 500 11–12 px, letter-spaced, uppercase for eyebrows, never for body.
- Decks (the one-line summary under a title) are italic serif, 18–20 px, one sentence.
- Numbers that matter are set larger than the words around them: the pull-fact pattern (26 px serif, the number in 600). One per page.

## 3. The page rhythm

Every page alternates **scene / objects / scene**, in the manner of a gallery wall:

1. A band at the top (the act bar in a unit; the chapter list in the Atlas) with the live year and era at the right. This is the clock; it is on every surface.
2. One large thing: a photograph, an object, the map at the act's scale.
3. A row of framed objects with one-line captions **under** them (never over them), at the smallest size.
4. The reading: scene sheets, the lecture panel, or the object's annotation.
5. Sources, then previous / next, then nothing.

Captions sit under images. Tags ("New arrival", "argued", "approximate") are the only decoration, and at most one per element. White space is the structure; do not add rules, boxes or shadows to separate things that spacing already separates. Cards get a 1 px `--line` hairline and `--shadow` only when they sit over a map or an image.

## 4. Lecture identity

Each lecture or chapter owns one colour and one motif, and nothing else does:

| Lecture (Edo) | Colour | Motif |
|---|---|---|
| L1 A city of a million | slate `#5C6B7A` | a bridge |
| L2 Four hands, one sheet | cherry-wood `#8A5A3C` | a baren |
| L3 Colour, calendars, poets | safflower `#B85C76` | a fan |
| L4 The publisher | ivy `#4F7A5A` | an ivy leaf |
| L5 Blue | Prussian blue `#233C6B` | a drop |
| L6 The ban and the road | seal `#B3301E` | a seal |
| L7 Afterlife | Paris grey `#7A7A86` | a crate |
| L8 Money | banknote ochre `#B08A3E` | a banknote |

Other units pick eight colours the same way: muted, named after a material in the unit, never two within 20° of hue of each other, all passing 4.5:1 as text on paper. The motif is a 24 px sumi-line glyph from the shared glyph library (add to the library, not to the unit).

## 5. The components

Eighteen components. Full rules in `references/components.md`; the ones you will reach for most:

- **Annotated object page.** The most common page in the course and the one to build first for any new object. One object large; title and italic deck; 3–7 leaders ending in a bold name and one sentence; a scale figure; a location thumb; a line with date, holder, accession and licence; one pull-fact; "appears in" links; sources. Nothing else. If the object needs more than seven annotations, it needs two pages.
- **Exploded view.** For a demonstration: the parts pulled apart on one axis, labelled at one side, stepped by the reader. Reduced motion shows the exploded state at once.
- **Typology plate.** Rows by class, a shelf of objects per row, a date range under each object (a range, never a point). Tapping an object opens its page.
- **Span list.** A row per period: start at the left, end at the right, a rule between, the name on the rule. Use it where the lane chart is too much (eras, regimes, acts, era names).
- **Material biography.** A chain of circular samples, each cut from a real object, each with a date and its confidence word, joined by a dotted line.
- **Works wall.** Thumbnails stacked over the lane chart's axis by year, run bubbles beneath, the cursor selects a year.
- **Phase strip.** Named phases on one line; artefacts above, tools and people below; four to eight per phase. For processes that have stages, not dates.
- **Journey bar.** One bar under any route scene: the two ends with their dates, stops as marks, dated events as glyphs, "now" at the cursor. It is the scene's clock and its contents list at once.
- **List · globe · panel.** The Atlas layout: a list with counts at the left, the globe in the middle, a panel at the right that always ends with sources and previous / next.
- **Anchored label.** A name with a second line (the date, the count, the elevation), a 90° leader, at most one primary and three others per view.
- **Stepper.** Previous / next with "n of N", at the foot of every panel and scene.
- **Frosted panel.** Paper at 86 % with a 6 px blur behind it, for any card over a map; it never hides the route under it.
- **One-colour map.** A territory as one wash, marks as one ink, a card rising from the selected mark, a vertical time index at the left.

Also: sized legend, route callout, progress bar per item, gallery rhythm, lecture identity, process step-strip, comparison box.

## 6. Maps, globes and scenes

The highlight vocabulary and the scene grammar are fixed in `research_notes/Motion layers and focus/FRAMEWORK.md`; in short:

- Six kinds of highlight that never look alike: journey (indigo line, glyph riding it), incident (seal-red pulse, once), lecture place (folded-paper mark), object holder (pale frame), person (chip), mentioned place (pale hollow dot, unlabelled). At most two kinds on screen at once.
- The globe turns to follow a route before a leg draws; a leg never draws behind the limb; 1.2 s per leg regardless of distance; undated legs dashed.
- Time is always visible: the clock readout at the top right in one of five modes (point, span, step, crawl, held), and the journey bar under the map.
- Labels: one primary, three others, a second line under the name, close pairs labelled in sequence or sharing one leader, 18 px minimum between labels, the caption slot reserved.
- Dim, don't hide. Nothing drifts inside a scene. Reduced motion is the same scene with cuts and fades.
- Glyphs come from the shared library (ship, junk, steamer, crate, pavilion, shop, book, fan, pigment, coin, soba bowl, flame, seals, bubble, procession), each drawn only where a content line demands it.

## 7. What is never done

- No flags, no emoji, no icon rows, no slogans. A tradition is a place and a people, drawn as a wash on the globe.
- No points, badges, streaks, leaderboards, timers, confetti or completion percentages.
- No dark ground outside the lecture room; no glow, no scan lines, no neon.
- No illustration of the subjects: the course shows the objects themselves (CC0 or public domain, credited with holder and licence). Illustration is confined to the lecture motifs and the glyph library.
- No invented placement: approximate places are soft blots and say so; no burnt areas, no routes, no dates the sources do not give.
- No caption over an image, no label over a label, no third colour, no date without its confidence word where it is less than documented, no "first" (write "earliest known").
- The Yoshiwara is read, not played: a labelled district and a mark that moves, a content note once, no interior.

## 8. How to work

1. Name the surface you are making (object page, scene, Atlas panel, unit opening, timeline view, card) and open its component in `references/components.md`.
2. Start from the tokens in `references/tokens.css`; do not restyle them.
3. Put the object or the map first; write the caption under it; add the apparatus (leaders, labels, bar) last, and stop at the budget.
4. Set the clock: every surface with a date shows it in the top-right readout, with its confidence.
5. Before you call it done, run `references/checklist.md` against a screenshot at 1440 and at 390 px, light and dark where the surface has dark.

When a request does not fit any component, say so, and propose the smallest new component with its references, rather than improvising a one-off: one-offs are how the finish was lost between v1 and v3.

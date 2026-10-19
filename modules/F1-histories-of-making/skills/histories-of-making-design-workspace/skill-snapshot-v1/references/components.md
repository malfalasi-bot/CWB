# Components

Eighteen components, each with its references (numbers refer to `research_notes/Design language references/references_study.md`), its surface, its anatomy, its rules, and its first Edo instance. Build the anatomy in the order given; stop at the budget.

Contents: 1 Annotated object page · 2 Exploded view · 3 Typology plate · 4 Span list · 5 Material biography · 6 Works wall · 7 Phase strip · 8 Journey bar · 9 List · globe · panel · 10 Anchored label · 11 Sized legend · 12 Route callout · 13 Stepper · 14 One-colour map · 15 Progress bar per item · 16 Frosted panel · 17 Gallery rhythm · 18 Lecture identity · 19 Process step-strip and comparison box (two small ones) · 20 Character sheet

## 1. Annotated object page (refs 08, 09, 03)

The most common page in the course. One object, explained.

Anatomy, top to bottom:
1. Header band: the act bar or chapter band with the era colour tab and the clock readout (the object's date, with its confidence word if less than documented).
2. Title (serif, roman + italic) and a one-line italic deck.
3. The object, as large as the viewport allows, on paper with the grain. On desktop the object takes the right 60 % and the text column the left 40 %; on phones the object comes first, full width.
4. Leaders: 3–7, each a 1 px sumi line with one 90° elbow, a 6 px dot at the object end, ending in a label of `600 12px` name over `400 12px` one sentence (≤ 25 words). Leaders never cross; labels never overlap; the placer treats the title and the caption slot as occupied.
5. The scale figure: a 1.7 m human silhouette (or a hand, for small objects) beside a bar of the object's height; and the location thumb: a 120 px map with one dot.
6. The credit line in mono: holder · accession · date · materials · licence (e.g. "The Metropolitan Museum of Art · JP1847 · c. 1830–32 · woodblock print, ink and colour on paper · CC0").
7. One pull-fact: 26 px serif, the number or two words in 600. One only.
8. The reading: 150–400 words in the text column, with claim ids on every date and number.
9. "Appears in": links to the beats, scenes and lectures that show the object.
10. Sources.

Rules: one object per page; more than seven annotations means two pages; the photograph is the holder's, credited; no annotation says what the eye can see ("a wave") but what it cannot ("Prussian blue mixed with indigo in the dark stripes"); the confidence word appears on every date and attribution below documented.

Edo first: the Great Wave (Met JP1847). Then the key-block proof, the Tenpō order, the 1859 map, each Hundred Views sheet the unit shows.

## 2. Exploded view (ref 03)

For moment D demonstrations. The parts of one thing pulled apart on one axis.

Anatomy: the parts stacked on the vertical (or, for a sheet, on the horizontal), 24–40 px apart, each with a label at the right (bold name, one sentence); a step control (reader-stepped: each step separates one more part); a "whole" button that collapses it; the credit line; the honesty line when the parts are a reconstruction.

Rules: the axis is one direction only; parts keep their true relative size; labels in reading order top to bottom; reduced motion shows the exploded state immediately; it lives on the stage, never on a map.

Edo first: the block stack of Print the Wave (key block, four colour blocks, paper, baren); the Wave's five depth planes.

## 3. Typology plate (ref 04)

A page per material class: everything of one kind on one sheet, dated.

Anatomy: a row per class with the class name at the left in small caps; a shelf of objects per row, drawn or photographed at one scale, 6–12 per row; under each object its type number or name and its date range (a bar when the row is dense, a "1790–1843" when not); a scale note; tapping an object opens its page.

Rules: the range is a range (never a point); undated objects go at the row's end with "undated"; one scale per plate; rows ordered by the sequence the class follows (date, size, or process).

Edo first: seals by regime (none / kiwame / nanushi / aratame); print formats and their prices (ōban, chūban, hosoban, triptych); the nine Tōkaidō print stations.

## 4. Span list (ref 05)

The compact timeline. One row per period.

Anatomy: start year at the left (mono), a rule, the name centred on the rule (serif), a rule, end year at the right; rows 28–32 px tall; the current period's rule in ink, the others in `--line-2`; a cursor tick when the list is bound to the clock.

Rules: every row has both ends or says "to the present"; overlapping periods are allowed and read as overlapping; at most 30 rows; the list is navigable by keyboard and each row is a link to its focus.

Edo first: the six eras; the four censor regimes; the five acts; the 41 era names as the nengō lane's text twin.

## 5. Material biography (ref 06)

A material told as a chain of samples.

Anatomy: 4–8 circles of 64–96 px, each a crop from a real object (credited on tap), joined by a dotted line; under each: the date (with confidence), the place, one sentence; the chain reads left to right, wrapping on phones to a column; a "follow the route" link opens the material's journey scene.

Rules: samples are cut from objects the course holds (CC0/PD), never stock; the date under each is a register claim; the chain's order is chronological; at most one sentence per sample.

Edo first: Prussian blue (Berlin c. 1704 → Nagasaki 1824 → the fan 1829 → the Wave c. 1830–32); Echizen paper; safflower; cherry wood.

## 6. Works wall (ref 10)

The timeline focus for a run of objects.

Anatomy: the lane chart's axis along the bottom; thumbnails (64 px wide) stacked in columns above the years they belong to; the run bubbles beneath the axis as the chart already draws them; the cursor selects a year and that column lifts; a count at the top of each column.

Rules: a thumbnail is a real object; columns cap at 8 (then "+n"); dates are the register's; season colour may tint the thumbnail border for the Hundred Views only.

Edo first: the Hundred Views, 1856–58; Hokusai's series of the 1830s; Tsutaya's publications 1774–97.

## 7. Phase strip (ref 11)

For processes that have stages, not dates.

Anatomy: one horizontal line; vertical rules dividing it into 4–7 named phases (small caps at the foot); artefacts above the line, tools and people below; 4–8 images per phase; the current phase lifted.

Rules: never used for dated sequences (use the span list or the works wall); the phase names are verbs or nouns the sources use; phases read left to right and stack on phones.

Edo first: the workshop (drawing → key block → proofs → colour blocks → registration → printing → the sheet); the life of a print (design → censor → carving → printing → sale → afterlife).

## 8. Journey bar (refs 12, 20)

Under every route scene; the clock and the contents at once.

Anatomy: a 2 px line between two labelled ends (place and date at each end, serif name over mono date); stops as 6 px dots with their names on tap or on reach; dated events as 20 px glyphs on the line; the "now" mark (the riding glyph, or a seal-red tick) at the cursor; the span bar in `--indigo-soft` behind the travelled part; a pause control when the scene auto-steps.

Rules: the bar's length is the scene's span, not its distance; undated stretches are dashed; the bar is keyboard-operable (arrows step stops); it replaces the generic timeline strip when a journey is playing and hands back when it ends.

Edo first: the blue (1704–1831); the afterlife (1865–1895).

## 9. List · globe · panel (refs 13, 18)

The Atlas layout on paper.

Anatomy: left column 260 px: chapters with counts, then the selected chapter's lectures with their colour dot and motif; centre: the globe or the map; right panel 360 px: the selected thing's name (serif), its one-line deck, its paragraph (≤ 120 words), its relations as linked lists ("read in", "shares routes with", "appears in"), two figures set large (a date, a count), its sources (publication names, never bare URLs), and the stepper. On phones the list becomes a sheet from the bottom and the panel a sheet from the right.

Rules: the panel always ends with sources and previous / next; arcs draw only for the selected thing; the list's counts are counts of things, never scores; the globe never drifts while a panel is open.

Edo first: the Atlas world view with the Edo chapter selected.

## 10. Anchored label (refs 14, 17)

Anatomy: name (`600 12px` sans) over a second line (`400 11px` mono: the date, the count, the elevation); a 1 px leader with one elbow from the mark; a paper backing at 86 % when over an image.

Rules: one primary and at most three others per view; 18 px minimum between labels; close pairs in sequence or sharing one leader ("Sakai-chō · Fukiya-chō"); the primary is the stop being reached or the place pulsing; labels ink as their leg draws; a mentioned place has no label until tapped.

## 11. Sized legend (ref 16)

Anatomy: the key draws the sizes it uses (a circle of each size with its value), the line styles it uses (solid dated, dashed undated), and the six highlight kinds with their marks; placed bottom-left on maps, collapsible on phones.

Rules: every size on the map appears in the key; values are counts or quantities with their unit; never a colour ramp without labelled stops.

## 12. Route callout (ref 17)

Anatomy: a paper card on the line at a station: number, name, the one figure the content gives (an elevation, a price, a print's title), a hairline border, a 4 px tail to the line.

Rules: at most one callout open at a time; the others collapse to numbered dots; the figure is a register claim.

Edo first: the Tōkaidō's nine print stations; Hakone's pass as the one elevation.

## 13. Stepper (ref 18)

Anatomy: previous / next buttons (40 px, round, hairline) with "n of N" between them, at the foot of a panel or scene; arrow keys bound to it.

Rules: it never auto-advances; disabled at the ends rather than wrapping, except in a gallery; the count is of things, never progress.

## 14. One-colour map (ref 19)

The Atlas unit tier and any map of one territory.

Anatomy: the territory as one wash (`--land`), the water as paper, marks as one ink, the selected mark's card rising 240 ms with `--e-enter` (a crop, a line, a figure); a vertical time index at the left (acts, eras, seasons) as the only navigation; zoom at the bottom right.

Rules: no second colour except the current highlight kind; the index entries are links to focuses; the card is one per selection.

Edo first: F1.8 East Asia; the 1859 sheet with the five acts as the index.

## 15. Progress bar per item (ref 20)

Anatomy: a 2 px bar between two mono dates with the current position as a 6 px dot; the item's name above in serif; an optional figure at the right.

Rules: for lectures (minutes), journeys (dates) and a learner's own reading (positions, never percentages); never for completion.

## 16. Frosted panel (ref 20)

Anatomy: `--paper` at 86 % with `backdrop-filter: blur(6px)`, 1 px `--line`, 12 px radius, 14–18 px padding; the route under it stays visible.

Rules: used only over maps and images; never stacked more than two deep; captions and counters use it; the clock readout uses a smaller version.

## 17. Gallery rhythm (ref 01)

Scene / objects / scene. The unit opening: the act bar; one photograph or the act's object full width (or two side by side); a row of four framed objects with one-line captions under them; the first scene sheet. Objects in frames: a 10 px paper mat, a 1 px `--line-2` frame, `--shadow`. Captions under, 14 px, `--ink-2`. One tag at most.

## 18. Lecture identity (ref 02)

One colour and one motif per lecture (SKILL.md section 4). Where it appears: the lecture's card (a 4 px colour bar at the left and the motif at 24 px), the threshold beat (the motif as a drop-cap-sized mark), its tick on the timeline (a dot in its colour), its panel header in the Atlas (the colour as the header rule), its journey bar (the travelled part). Where it never appears: on a route, a mark, a map wash, body text.

## 19. Process step-strip and comparison box (ref 09)

Step-strip: 3–6 steps as small drawings or crops in a row, numbered, one sentence each; for the printing sequence and the seal-reading sequence. Comparison box: two objects side by side at one scale with a shared caption and one line on what differs; for the three Waves, the Wave and its Van Gogh copy, a print and its manuscript source.

## 20. Character sheet (refs 08, 13)

The third people layer. Portrait (credited), name in Japanese order with kanji, dates (register claims with confidence), one paragraph (≤ 120 words), "appears in" links, the one object most tied to the person, sources, stepper. The inline card (first layer) is the portrait, name, dates and one line; the entity sheet (second layer) adds the paragraph.

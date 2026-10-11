# Beats: what they are, what they should be, how to curate them from the lectures

For the Edo unit, after the decision of 12 October 2026 that the eight v0 lectures return at full volume (station player, side panel, full-screen room) beside the scene sheets. Inputs: `story.yaml` (71 beats), `EDO_FULL_CASE.md` §5–§6, `inventory.md` §5–§6, `STUDY.md` §3 and §5, `ARCH_V4.md`, `build-content.mjs`.

## 1. Diagnosis: what a v4 beat is

A v4 beat is 40–100 words of prose (`text`) bound to one instrument state (`stage`: map, time, object or tool), with optional `show`, `people`, `note: quarter`, `guess`, `argued`, `figure`, `links`, a `year` and `sources`. Written when there was no lecture, each beat had to do everything at once: tell the story, say what the instrument shows, carry the confidence word, ask the question and stand in for a station. The lint sizes beats and checks references; it says nothing about what a beat is *for*.

Classified by what each beat mainly does (one class per beat; the nine guess/reveal pairs counted as (e)):

| Class | Count | Example (≤ 25 words) |
|---|---|---|
| (a) narrates in its own voice | 14 | b2-7: "Osaka ran the same medium another way. In the eighth month of 1793 the publisher Shioya won the sole right to publish actor likenesses." |
| (b) captions the instrument | 6 | b4-3: "Here the Met's image is separated by colour, one layer per ink. Lay them down in order." |
| (c) bridges two instrument states | 3 | b5-1: "The price lane on the timeline is about to change." · b2-8: "What would a publisher dare to bet on next?" |
| (d) content note, confidence word or contested reading | 7 | b3-4: "Historians agree the blue came by sea. They disagree about when Edo's printers could afford it." |
| (e) sets up or answers a guess | 18 | b3-2g: "The Fuji series would be sold on a colour Edo could not make." → b3-3: "Prussian blue was first made in Berlin around 1704." |
| (f) duplicates a lecture station in fewer words | 23 | b3-5: "In 1829 the fan-maker Iseya put out a fan by Eisen printed in light and dark shades of the new blue alone." (L5 S3) · b4-2: "The deep hollow is pure Prussian blue, printed twice." (L5 S5) |
| | **71** | |

Across classes: 21 beats contain an instrument-pointing sentence ("This is…", "Watch…"); 10 carry a parenthetical confidence word; 18 contain no four-digit year.

**Why it reads as fragments.** Three mechanics, all visible in the file.

1. *Each beat is a miniature of a station, not a hinge to one.* The 23 class-(f) beats compress L1–L7 to a third of their storyboard length and a twentieth of their narration (inventory §6). No lecture's thesis sentence ("the most famous Japanese picture is a European pigment's price curve") appears; the reader gets a station's facts without the argument that orders them.
2. *Antecedents live in the previous beat.* b2-5 opens "The law named three people" (which law: b2-4); b2-6 "Tsutaya answered the fine" (b2-5); b3-4 "the blue came by sea" (b3-3); b3-6 "Then, Tōho says" (Tōho and "the fans" are b3-5); b4-1r "Two scientists who studied the picture"; b4-5 "Two readings of authorship meet in this sheet"; b5-3 "In the eleventh month came the price" (of which year: b5-2); b5-6 "The ban made warriors the safest genre"; b5-8 "The edict named actors"; b7-2 "The packing-paper story's earliest printed source"; b9-2 "The census goes on." Reached from the timeline, the Atlas hand-off or a Cast card, each is a sentence without a subject.
3. *The guess doubles.* Nine guesses take 18 beats, a quarter of the unit. The `say` field already answers, so the reveal beat repeats it (b4-1r repeats b4-1's `say` nearly word for word); scroll past the guess and the reveal answers nothing that was asked.

The result: 7–10 cards per scene that work only in order, too short to argue and too long to caption.

## 2. The role of beats once the lectures exist

Principle: **the lecture carries the argument, the instrument carries the evidence, the beat is the hinge.** A beat says what the stage shows now, in one claim, and points to the station that argues it. It is not a second telling. Built that way, one text serves wherever the instrument is: the scene sheet while scrolling; the caption of a timeline tick inside a focus (STUDY §5); a journey's stop caption (moment B); the chapter card over the Atlas globe (S8); a Rebuild tile's hint; a Cast sheet, listing the focus beats that name the person.

Seven candidate kinds: six kept, one capped, and one current practice rejected.

| Kind | Purpose | Activated by (STUDY §3 moment) | Lecture tie | Where | Length | Rule that makes it coherent alone |
|---|---|---|---|---|---|---|
| **threshold** | Opens an act or scene with its bet | A | Names the lecture and station span ("Lecture 5 · Blue, 1–4") | Title card over the stage; the Atlas chapter card | 20–45 words; one date, one number | Carries the scene's thesis sentence, lifted from the lecture |
| **caption** | What the instrument shows now, and why it matters | C, D, F; any instrument change | Station id required | Scene sheet beside the stage | 25–60 | First sentence names the instrument and its object, place or span; no confidence word (that is a note) |
| **focus** | One claim, one number or date, one mark | C, E (it *is* the tick caption), D | Near-verbatim from a station | Over the stage at the mark; short card on the sheet | 15–40; ≤ 2 sentences | One claim; `mark` required; subject and date in the first sentence |
| **bridge** | Why we leave this place or year for the next | B; scene end | Destination's station | Last card on the sheet; the route-draw caption | 20–50 | Names both ends (`from`, `to`); the only kind that changes map scale |
| **note** | Content note, confidence, contested reading (keeps `argued`) | F | The station it qualifies | Scene sheet, marked | 25–70 | Names the claim it qualifies in its first sentence; confidence words live only here and in prompt `say` |
| **prompt** | The optional guess, answered on the instrument | On the instrument | The lecture's prediction, or marked "adjacent" | Scene sheet; the reveal is drawn as truth ink, never a beat | q ≤ 22; `say` ≤ 40 | Never first or last in a scene; the next beat may not restate the truth |
| **aside** (capped) | An adjacent fact the lecture does not carry | F | None; labelled "Aside" | Margin of the sheet, off the ink thread | 25–60; ≤ 1 per scene | Own year, proper noun and source; never opens, closes or bridges |

Rejected: the **reveal beat** (`say` is the answer and renders on the instrument; nine beats go) and narration (class a) as a kind: a fact in no lecture and not adjacent enough for an aside goes into the lecture script or the Cast card.

Common rules: subject and date in the beat's own words; no pronoun or definite noun ("the fine", "the edict") whose antecedent is another beat; one claim per beat except threshold and note; a station chip on every beat opens the player at that station in the side panel, and the player highlights the beats of the station it is on.

## 3. Curation method: lectures first

1. **Station list.** For each lecture, its stations with thesis, prediction and argued pair, as data: `content/lectures.yaml` (`L5: {title, thesis, stations: [{n, title, claim, instrument, objects, sources}]}`), from EDO_FULL_CASE §5.
2. **Instrument state per station.** Map scale and route, timeline span and lane, object and marks, or tool. Two states means two ticks and two beats.
3. **The claim worth a beat.** The one sentence of the station the instrument can show: a number on a line, a date on a tick, a mark on a sheet. No showable claim: a caption. Only argument: stays in the lecture.
4. **Kind.** threshold for the scene's first station; focus if the claim has a number or date and a mark; caption if the state changed and the claim is "what you see"; note if it carries a confidence word or an argued block; prompt if the lecture's prediction lands here; bridge if the next station changes place or scale.
5. **Write to length,** subject first, date in the first sentence, no antecedent outside the beat.
6. **Sources:** the station's ids only.
7. **Map it:** `station: L5.4`, `mark`, and for a prompt the prediction id. Rebuild tiles are generated from the act's focus beats.
8. **Lint,** then read every beat cold, out of order, from the timeline.

Lints to add to `build-content.mjs` (the 40–100 rule and the `opener`/`argued` kinds go):

| Lint | Check |
|---|---|
| kind | `kind ∈ {threshold, caption, focus, bridge, note, prompt, aside}`; length per kind as in §2 |
| scene shape | exactly one threshold, first; 3–7 beats after; aside ≤ 1, never first or last |
| coherence | text has a year (`\b1[5-9]\d\d\b|\b20\d\d\b`) and a proper noun (a `[[link]]`, a place or event id, or a capitalised token not at sentence start) |
| no dependent opening | first word not in {It, Its, He, His, She, Her, They, Their, That, Those, These, Then, And, But, So, Both, Here}; a first sentence beginning "The" must contain a year or a proper noun |
| station | `station` resolves in `lectures.yaml` and belongs to the act's lectures; required on caption, focus, note, prompt; forbidden on aside |
| focus | ≤ 2 sentences; exactly one number or date; `mark` resolves to MARKS, a place or an event |
| caption | first sentence contains an instrument word (`map, sheet, timeline, lane, line, layer, block, loupe, slider, proof, impression`) |
| confidence | `(probable|argued|contested|documented)` only in note text and prompt `say` |
| prompt | `say` ≤ 40 words; no later beat in the scene contains `truth`/`truthLabel` |
| bridge | `from` and `to` both resolve; text names two years or two places |
| sources | every id is in the station's source list |

## 4. Act II worked example: Lecture 5 "Blue" against s3 and s4

Lecture 5 has eight stations. s3 (7 beats, 411 words) covers 1–4 and 8; s4 (10 beats, 546 words) covers 5–7 plus L2 stations 3, 7, 8 and L6 station 7.

| Beat | Was | Becomes | Station · state |
|---|---|---|---|
| b3-1 Hokusai's youth; the 1807 guild | (a) | **retired** to the Cast card and L2 S6; Rebuild tile r2-a "guild 1807" replaced by "Tōkaidō 1833" (b4-8) | — |
| *new* T3 | — | **threshold** (below) | L5 1–4 · time 1755–1855 |
| b3-2 the Manga, 1814 | (a) | **aside**, cut to 55 words | none (adjacent to L7 argued) · object `manga` |
| b3-2g where was the blue made | (e) | **prompt**; its text dropped (the threshold carries it); reveal in `say` | L5 prediction · map world |
| b3-3 Berlin 1704, the sea route | (e) reveal | **caption** of the route draw, 45 words, opening "The world map draws the pigment's road…" | L5 S1 · map world, route `blue` (B) |
| *new* F3a | — | **focus** (below) | L5 S2 · time 1780–1840, `blueprice`, mark e1824 |
| b3-4 when the blue reached the printers | (d) | **note**, keeps `argued`; opens "When Prussian blue became a print colour in Edo is argued." | L5 S2 · same, tick e1829 |
| b3-5 Eisen's fan, 1829 | (f) | **caption**, 50 words | L5 S3 · object `eisen-aizuri` |
| *new* F3b | — | **focus** (below) | L5 S4 · time, mark e1831 |
| b3-6 Red Fuji | (f) | **caption**, 40 words: the series' earliest sheets, "thirty-six became forty-six" | L5 S8 · object `redfuji` |
| b4-0 inside the wave | opener | **threshold**, 45 words, adds "Lecture 5 · 5–7; Lecture 2 · 3, 7–8" | L5 S5 · object `hi-wave` |
| b4-1 tsunami or storm wave | (e) | **prompt**, marked adjacent; `say` is the whole answer | adjacent · map kanto |
| b4-1r the scientists' reading | (e) reveal | **retired** (it is the `say`) | — |
| b4-2 the Met's spectrometer | (f) | **focus**, 30 words: the hollow printed twice, mark `wave-blues[1]`; the signature is already b4-5's evidence | L5 S5 / L2 S8 · object, marks |
| b4-3 peel the colours | (b) | **caption**, 45 words | L2 S3 · tool `peel` |
| b4-4 no single Great Wave | (f) | **caption**, 50 words; "(argued)" and the 8,000 estimate move to b9-1g's `say` | L5 S7 · tool `waves` |
| *new* F4 | — | **focus** (below) | L5 S6 · tool `waves`, new loupe spot "foam" |
| b4-5 who made the Great Wave | (d) | **note**, keeps `argued`; opens "Authorship of the Great Wave is argued." | L2 argued · time 1755–1855 |
| b4-6 Katsushika Ōi | (d) | **note** (content note + probable), 55 words | adjacent to L2 argued · object `oi-night` |
| b4-7 Hokusai's letter, 1835 | (f) | **focus**, 35 words: the one surviving pay record, mark e1835 | L2 S7 · time 1820–1850 |
| b4-8 Hiroshige's Tōkaidō | (f) | **bridge** Edo 1831 → the road 1833 → Act III; `from: edo`, `to: kyoto` | L6 S7 · map japan, route `tokaido` |

**Before: 17 beats, 957 words. After: 19 beats, about 580 words; kept 15 (re-kinded, most shortened), retired 2, new 4.** The count rises by two because S2, S6 and the scene's threshold had no beat; the words fall by two fifths.

The four new beats:

**T3 · threshold** (31 words; L5 1–4; sources: fitzhugh, smith-blue)
> Around 1704 a Berlin colour-maker's red came out blue. A century later Chinese junks made the pigment cheap at Nagasaki, and a publisher in Bakuro-chō bet a Fuji series on it. *Lecture 5 · Blue, stations 1–4.*

**F3a · focus** (30 words; L5 S2; mark e1824 on the `blueprice` line; sources: smith-blue)
> Nagasaki, 1824: Chinese Prussian blue cost 87 monme of silver a kin. By 1828 it cost 31. Henry Smith's price line is the curve the Fuji series was printed on.

**F3b · focus** (35 words; L5 S4; mark e1831; sources: smith-blue, vermeulen)
> For New Year 1831 Nishimuraya Yohachi advertised Hokusai's *Thirty-six Views of Mount Fuji*: one view to a sheet, "more than one hundred, without being limited to thirty-six". Forty-six were issued; the Met holds all forty-six.

**F4 · focus** (35 words; L5 S6; mark: a sixth loupe spot in the foam; sources: bm-spot, korenberg)
> Every original Great Wave carries a tiny dark sliver in the foam, left by a splinter the carver never removed around 1831. No facsimile cut from other blocks has it. Find it under the loupe.

F4 needs a sixth spot in the compare lab (foam), the L5 S6 item the inventory lists as dropped.

## 5. For the other 37 units

Write the lectures first, at full volume, as stations with one instrument state and one showable claim each. Derive the beats, never draft them: one threshold per scene carrying the lecture's thesis sentence and station span; a focus wherever a station has a number or date the instrument can mark; a caption wherever the instrument state changes; a note wherever a confidence word or an argued pair lives; at most one prompt per scene, answered on the instrument with no reveal beat; at most one labelled aside per scene; a bridge only where place or scale changes. Every beat names its subject, date and station in its own words, cites only its station's sources, and is read cold, out of order, before it ships. Narration that is neither a station nor an aside goes into the lecture or the Cast. The §3 lint holds these rules for every unit: the specialist writes to the kinds and the build refuses anything else.

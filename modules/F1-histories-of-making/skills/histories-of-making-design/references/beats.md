# Text: lectures, beats and people

From `research_notes/Motion layers and focus/beats_study.md` and `STUDY.md` §1, §8. The principle: **the lecture carries the argument, the instrument carries the evidence, the beat is the hinge.** A beat says what the stage shows now, in one claim, and points to the station that argues it. It is never a second telling.

## 1. The lectures layer

Each unit's lectures run at full volume (Edo: eight lectures, about an hour) through the station player, opened from the act bar ("Lecture") and from the Atlas. A lecture is data: `content/lectures.yaml` holds, per lecture, its title, its thesis sentence, its prediction (the one guess it poses) and its stations, each with `n`, `title`, `claim`, `instrument` (map scale and route; timeline span and lane; object and marks; or tool), `objects` and `sources`. The player's stations are the same ticks as the timeline focus, so a station can move the map. The player opens in a side panel beside the stage or as a full-screen room; it highlights the beats of the station it is on, and every beat's station chip opens the player at that station.

## 2. Why a beat is not a short lecture

The v4 diagnosis, which any unit written beats-first will repeat: beats that compress stations to a third of their length lose the thesis that orders the facts; antecedents live in the previous beat ("the fine", "the edict"), so a beat reached from the timeline, the Atlas or a Cast card is a sentence without a subject; guesses double, the reveal beat repeating the answer the instrument already drew. The result reads as fragments: 7–10 cards per scene that work only in order, too short to argue and too long to caption.

## 3. The seven kinds

| Kind | Purpose | Moment | Lecture tie | Where | Length | Rule that makes it coherent alone |
|---|---|---|---|---|---|---|
| **threshold** | opens an act or scene with its bet | A | names the lecture and station span ("Lecture 5 · Blue, 1–4") | the title card over the stage; the Atlas chapter card | 20–45 words; one date, one number | carries the scene's thesis sentence, lifted from the lecture |
| **caption** | what the instrument shows now, and why it matters | C, D, F; any instrument change | station required | the scene sheet beside the stage | 25–60 | the first sentence names the instrument and its object, place or span; no confidence word |
| **focus** | one claim, one number or date, one mark | C, E (it *is* the tick caption), D | near-verbatim from a station | over the stage at the mark; a short card on the sheet | 15–40; ≤ 2 sentences | one claim; `mark` required; subject and date in the first sentence |
| **bridge** | why we leave this place or year for the next | B; scene end | the destination's station | the last card on the sheet; the route-draw caption | 20–50 | names both ends (`from`, `to`); the only kind that changes map scale |
| **note** | content note, confidence word, contested reading (keeps `argued`) | F | the station it qualifies | the scene sheet, marked | 25–70 | names the claim it qualifies in its first sentence; confidence words live only here and in a prompt's `say` |
| **prompt** | the optional guess, answered on the instrument | on the instrument | the lecture's prediction, or marked "adjacent" | the scene sheet; the answer is drawn as truth ink on the instrument, never as a beat | question ≤ 22; `say` ≤ 40 | never first or last in a scene; the next beat may not restate the answer |
| **aside** (capped) | an adjacent fact the lecture does not carry | F | none; labelled "Aside" | the margin of the sheet, off the ink thread | 25–60; ≤ 1 per scene | its own year, proper noun and source; never opens, closes or bridges |

Rejected: the reveal beat (the `say` is the answer and renders on the instrument) and narration as a kind (a fact in no lecture and not adjacent enough for an aside goes into the lecture script or the Cast card).

Common rules: subject and date in the beat's own words; no pronoun or definite noun whose antecedent is another beat; one claim per beat except threshold and note; a station chip on every beat except asides; each beat read cold, out of order, from the timeline before it ships.

One text serves wherever the instrument is: the scene sheet while scrolling; the caption of a timeline tick inside a focus; a journey's stop caption; the chapter card over the Atlas globe; a Rebuild tile's hint; a Cast sheet listing the focus beats that name the person.

## 4. Scene shape

Exactly one threshold, first; 3–7 beats after it; at most one aside, never first or last; at most one prompt, never first or last; a bridge only where place or scale changes. Rebuild tiles are generated from the act's focus beats, never written separately.

## 5. Curation: lectures first, beats derived

1. **Station list.** Each lecture's stations with thesis, prediction and argued pair, as data in `lectures.yaml`.
2. **Instrument state per station.** Map scale and route; timeline span and lane; object and marks; or tool. Two states means two ticks and two beats.
3. **The claim worth a beat.** The one sentence of the station the instrument can show: a number on a line, a date on a tick, a mark on a sheet. No showable claim: a caption. Only argument: it stays in the lecture.
4. **Kind.** Threshold for the scene's first station; focus if the claim has a number or date and a mark; caption if the state changed and the claim is "what you see"; note if it carries a confidence word or an argued pair; prompt if the lecture's prediction lands here; bridge if the next station changes place or scale.
5. **Write to length**, subject first, date in the first sentence, no antecedent outside the beat.
6. **Sources:** the station's ids only.
7. **Map it:** `station: L5.4`, `mark`, and for a prompt the prediction id.
8. **Lint**, then read every beat cold, out of order, from the timeline.

Worked on Edo Act II (Lecture 5 "Blue"): 17 beats of 957 words became 19 of about 580 (15 re-kinded and shortened, 2 retired to the Cast and the lecture, 4 new where a station had no beat). Two examples at length:

> **threshold** (31 words; L5 1–4): Around 1704 a Berlin colour-maker's red came out blue. A century later Chinese junks made the pigment cheap at Nagasaki, and a publisher in Bakuro-chō bet a Fuji series on it. *Lecture 5 · Blue, stations 1–4.*

> **focus** (30 words; L5 S2; mark e1824 on the price line): Nagasaki, 1824: Chinese Prussian blue cost 87 monme of silver a kin. By 1828 it cost 31. Henry Smith's price line is the curve the Fuji series was printed on.

## 6. Lints for beats

| Lint | Check |
|---|---|
| kind | `kind ∈ {threshold, caption, focus, bridge, note, prompt, aside}`; length per kind as in §3 |
| scene shape | exactly one threshold, first; 3–7 beats after; aside ≤ 1, never first or last |
| coherence | the text has a year and a proper noun (a link, a place or event id, or a capitalised token not at sentence start) |
| no dependent opening | the first word is not in {It, Its, He, His, She, Her, They, Their, That, Those, These, Then, And, But, So, Both, Here}; a first sentence beginning "The" contains a year or a proper noun |
| station | `station` resolves in `lectures.yaml` and belongs to the act's lectures; required on caption, focus, note, prompt; forbidden on aside |
| focus | ≤ 2 sentences; exactly one number or date; `mark` resolves to a mark, a place or an event |
| caption | the first sentence contains an instrument word (map, globe, sheet, stage, timeline, lane, line, layer, block, loupe, slider, proof, impression, or the unit's own object words) |
| confidence | `(probable|argued|contested|documented)` only in note text and a prompt's `say` |
| prompt | `say` ≤ 40 words; no later beat in the scene restates the answer |
| bridge | `from` and `to` both resolve; the text names two years or two places |
| sources | every id is in the station's source list |
| claims | every year and number in the text is a register claim (`claims.md`) |

## 7. People in three layers

1. **Inline card** at first mention: the portrait (credited), the name as the community writes it, dates with their confidence, one line. In the prose, never over it.
2. **Entity sheet**, linked from the card: adds the paragraph (≤ 120 words), "appears in", the one object most tied to the person, sources, stepper. This is the character sheet (component 20).
3. **Character cards and the Cast deck**: the unit's people as a deck, each card the first layer plus the focus beats that name the person; the Cast chip in the act bar opens it. A person on the globe is the chip of the highlight vocabulary; a person never rides a leg.

The same three layers serve a maker community (the card names the community, the sheet carries the protocol line) and a polity (the card names the ruler as the record names them, the sheet carries "as defined by").

## 8. For every other unit

Write the lectures first, at full volume, as stations with one instrument state and one showable claim each. Derive the beats, never draft them. Narration that is neither a station nor an aside goes into the lecture or the Cast. The lint holds these rules for every unit: the specialist writes to the kinds and the build refuses anything else.

# Dates and claims: the editorial process, worked on the Edo unit

Companion to inventory.md §8; the unit's rules on confidence words, "earliest known", quotes and sources apply.

## 1. The principle: one claims register

Every dated or numbered claim in a unit lives in one file, `content/claims.yaml`; `timeline.yaml`, `people.yaml`, the Atlas's Edo items and the prose are derived from it or checked against it. Prose never carries a date or count the register does not hold.

A record is keyed by the claim, not the year. Twenty-three `born`/`died` fields in `people.yaml` share a year with an event that is a different fact (Eisen born 1790; the kiwame seal 1790); matching by year alone is the error the lint must refuse.

```yaml
# content/claims.yaml — one record per dated or numbered claim
<id>:                      # ed-<topic>-<aspect>; stable once frozen
  claim: ""                # one sentence, no date in it
  kind: date | number | span
  value: 1842              # a year, [from, to], or a number
  precision: year | month | circa | range
  calendar: gregorian | lunar   # lunar: "6th month"; never converted in prose
  pos: 1842.5              # decimal year for the timeline cursor; derived if absent
  confidence: documented | probable | contested | argued
  sources: [kato-tenpo]    # sources.yaml ids or "objects_events.md §2 r40"
  alternates:              # every other published value, each sourced
    - {value: 1841, sources: [ndl-saruwaka], note: ""}
  display: "1842"          # the one rendered string: "1841–43" · "c. 1830–32" · "around 1704"
  where_used: {beats: [], events: [], people: [], atlas: [], objects: []}   # person.field; Atlas or canon id; images.json id
  editor_note: ""          # why this value; what would change it
```

Six records:

```yaml
ed-tsutaya-age-at-death:
  claim: Tsutaya's age when he died
  kind: number
  value: 47
  precision: year
  confidence: probable
  sources: [wiki-tsutaya, suntory-tsutaya]
  alternates:
    - {value: 48, sources: ["objects_events.md §2 r27", sumida-producers], note: "Japanese count; probable"}
  display: "aged 47 (48 by the Japanese count)"
  where_used: {beats: [b2-8], people: [tsutaya.story]}
  editor_note: "From born 13 Feb 1750, died 1797; needs the death day. AIC 1934.239: born 1748."

ed-theatres-saruwakacho:
  claim: The three theatres are moved to Saruwaka-chō
  kind: date
  value: [1841, 1843]
  precision: range
  confidence: documented
  sources: [ndl-saruwaka, "people_system.md §4"]
  alternates:
    - {value: [1841, 1842], sources: [ndl-saruwaka], note: "the page title"}
  display: "1841–43"
  where_used: {beats: [b5-4], events: [e1842t], people: [tadakuni.story], atlas: [e1842t]}
  editor_note: "A per-theatre year needs the NDL page re-read."

ed-fuji-series-issued:
  claim: Eijudō issues the Thirty-six Views of Mount Fuji
  kind: date
  value: [1830, 1832]
  precision: circa
  confidence: documented
  sources: [met-wave-record, vermeulen, "objects_events.md §2 r36"]
  alternates:
    - {value: [1830, 1833], sources: ["notes_objects.md, AIC 1925.3245"], note: "AIC: 1830/33"}
  display: "c. 1830–32"
  where_used: {beats: [p-1, b9-1], events: [e1831], people: [hokusai.highlights], objects: [hi-wave, redfuji]}
  editor_note: "The sheet's date; the advertisement is the next record."

ed-fuji-advert:
  claim: Eijudō's advertisement for the Fuji series
  kind: date
  value: 1831
  precision: month          # New Year
  calendar: lunar
  confidence: documented
  sources: [smith-blue, "people_system.md §1"]
  alternates: []
  display: "New Year 1831"
  where_used: {beats: [b3-6, b4-0, b5-7], events: [e1831], people: [nishimuraya.life]}
  editor_note: "The series' one point date; ticks and tiles use it."

ed-blue-at-printers:
  claim: Prussian blue is in use by Edo's printers
  kind: date
  value: [1824, 1829]
  precision: range
  confidence: argued
  sources: [smith-blue, fitzhugh]
  alternates:
    - {value: 1790, sources: [artelino-aizuri], note: "via Dejima; probable"}
    - {value: 1820, sources: ["people_system.md §1"], note: "from Holland"}
  display: "late 1820s (argued)"
  where_used: {beats: [b3-4]}
  editor_note: "Drives no tick; b3-4's clock is the price fall, 1824–28."

ed-bracquemond-find:
  claim: Bracquemond finds a Manga volume at Delâtre's print shop
  kind: date
  value: 1856
  precision: year
  confidence: argued
  sources: [ota-packing, "objects_events.md §2 r56"]
  alternates:
    - {value: null, sources: ["objects_events.md §2 r56"], note: "Eidelberg 1981 doubts the find"}
  display: "1856 (argued)"
  where_used: {beats: [b7-1, b7-2]}
  editor_note: "Not a tick; the tick is the 1905 memoir, documented."
```

## 2. Display rules

Documented is unmarked; the other three are the word in brackets. `display` renders verbatim; a surface adds only the bracket and the alternates.

| Surface | Point | Circa | Range | Argued or contested |
|---|---|---|---|---|
| Caption, beat prose | "1842" | "c. 1830–32" in captions, "about 1830–32" in prose | "1841–43" | display plus "(argued)"; alternates in the argued panel |
| Timeline tick | a point; hollow if probable | a point with a halo the width of the span | a bar from `value[0]` to `value[1]`, never a point | a dotted bar across the alternates |
| Cursor readout | "1842 · 6th month" | "c. 1830–32" | "1841–43" anywhere in the bar | the display; tap lists the alternates, sourced |
| Character sheet | born/died as display; "~" only for circa | "c. 1753" | "fl. 1830s", a shorter bar | the conf word on the highlight; never a life tick |
| Atlas card | `display + ": " + label`, never `int(year)` | same | same | the conf word; alternates on expand |
| Scene clock | the beat's `year` equals a used record's `pos` | shows the display, not the decimal | shows the range; `pos` is the midpoint | shows the documented record the beat rests on |

Lunar months stay as written, "the sixth month of 1842"; `pos` places only. Guess and rebuild tiles use point records only.

## 3. The lint

Additions to `build-content.mjs`, mirrored in `build_data.py`:

1. Every four-digit year in beat text, guess, argued texts and figure caption belongs to a record in the beat's new `claims` list and agrees with its display.
2. Every `born`, `died` and `life.y` in `people.yaml` names a record (`born: {ref: ed-kuniyoshi-born}`); the build writes the value.
3. Every event, price, run and band boundary carries `claim: <id>`; the build copies `value`, `pos`, `display` and `conf`, so `timeline.yaml` keeps ids, lanes, labels and images only.
4. `build_data.py` reads `claims.yaml` for every Edo item and emits `display` and `conf`; it warns where a linked canon row's `date_note` disagrees (MAT054 "Berlin c.1706" against "around 1704").

```js
const YEAR = /(?<![\d.])(1[5-9]\d\d|20[0-2]\d)(?![\d.]\d)/g;   // skips accession numbers
for (const b of beats) {
  const recs = (b.claims || []).map((id) => claims[id]).filter(Boolean);
  for (const id of b.claims || []) if (!claims[id]) errors.push(`E-CLAIM-UNKNOWN ${b.id}: ${id}`);
  const text = plain([b.text, b.guess?.q, b.guess?.say, b.figure?.cap, ...arguedTexts(b)].join(' '));
  for (const m of text.matchAll(YEAR)) {
    const y = +m[1];
    const hit = recs.find((r) => yearsOf(r).includes(y));          // value, alternates, display
    if (!hit) errors.push(`E-DATE-UNREGISTERED ${b.id}: "${y}" has no record in claims [${(b.claims || []).join(', ') || 'none'}]`);
    else if (!displayYears(hit).includes(y)) errors.push(`E-DATE-MISMATCH ${b.id} ← ${hit.id}: prose says "${y}", register displays "${hit.display}"`);
    else if (hit.confidence !== 'documented' && !confWordNear(text, m.index, hit.confidence))
      errors.push(`E-CONF-MISSING ${b.id} ← ${hit.id}: "${y}" is ${hit.confidence}; write it in the sentence`);
  }
  if (!recs.some((r) => Math.abs((r.pos ?? mid(r.value)) - b.year) < 0.05))
    errors.push(`E-CLOCK ${b.id}: beat year ${b.year} matches no claim's pos`);
}
```

Message format, fixed: `<CODE> <where>[ ← <record id>]: <what the file says>, <what the register says>`. Codes: E-DATE-UNREGISTERED, E-DATE-MISMATCH, E-CONF-MISSING, E-CLOCK, E-EVENT-NOCLAIM, E-PERSON-NOCLAIM, E-ARGUED-TICK (argued or contested on a tick, tile or clock), W-CANON-DISAGREES.

Effort: the Edo register, about 160 dated records and some 30 counts, two to three days for an editor; the lint, about 150 lines, half a day; the Atlas change, two hours; the §4 edits, a day. A week for Edo; two to three days a unit after.

## 4. The known cases

| Case | What the repo's sources say | Register: value · precision · confidence · display | Edits |
|---|---|---|---|
| 1 Tsutaya's age | objects_events.md §2 r27: "Tsutaya dies aged 48 · Sumida Hokusai Museum · documented". people.yaml: born 13 Feb 1750, died 1797, "aged 47". notes_objects.md: AIC 1934.239 "(1748-1797)". | 47 · year · probable · "aged 47 (48 by the Japanese count)" | Drop the number from b2-8 and tsutaya.story. **Needs a source**: the death day, from a museum biography. |
| 2 Theatres' move | people_system.md §4: "ordered all three to Shōten-chō in Asakusa, renamed Saruwaka-chō, in 1841–43". ndl-saruwaka's title: "the 1841–42 relocation". | [1841, 1843] · range · documented · "1841–43" | e1842t becomes a bar; b5-4 keeps `pos` 1842, its clock reads "1841–43"; tadakuni.story: "moved to Saruwaka-chō, 1841–43". |
| 3 Fuji series | objects_events.md §2 r36: "ca. 1830–32 · Met records; Vermeulen et al. · documented"; r37: Red Fuji "first printed in 1831" (Korenberg). notes_objects.md: AIC "1830/33". people_system.md: advertised "for New Year 1831". | series [1830, 1832] · circa · documented · "c. 1830–32"; advertisement 1831 · month · documented · "New Year 1831" | e1831 keeps the advert point and gains a bar. p-1, b9-1 "around 1831" → "about 1830–32"; overture shot 2 → "In 1831 a publisher advertised"; b5-7 → "advertised for 1831"; hokusai.life 1831 → "Fuji series advertised"; the case's "c. 1830–33" → "c. 1830–32". |
| 4 The blue's arrival | people_system.md §1: "Its arrival date is contested: Artelino says it reached Japan via Dejima around 1790"; Fitzhugh after Smith: "increasingly available after the 1820s". | [1824, 1829] · range · argued · "late 1820s (argued)"; alternates 1790, 1820 | None; the beat is argued by design. The price fall (1824–28, smith-blue, documented) is b3-4's clock. |
| 5 Bracquemond 1856 | objects_events.md §2 r56: finds the volume "allegedly"; "story first told by Bénédite in 1905; Eidelberg (1981) points out discrepancies"; contested. | 1856 · year · argued · "1856 (argued)"; 1905 · year · documented (ota-packing) | b7-2 "disputed" → "(argued)"; 1856 is never a tick. **Needs a source**: Eidelberg 1981 or the Met Bulletin 1985, read. |
| Kuniyoshi 1798/1797 | people.yaml "1 January 1798" (wiki-kuniyoshi); people_system.md §2 "(1797–1861)". | 1798 · year · documented · "1798"; alternate 1797 | A 1 January date against a Japanese year: the usual lunar-year offset (probable); the case takes 1798. **Needs a source**: a reference work with the Japanese date. |
| Sadanobu 1759/1758 | people.yaml "15 January 1759"; people_system.md §2 "(1758/59–1829)". | 1759 · year · documented · "1759"; alternate 1758 | Same offset, note and source need. |
| Prussian blue 1704 | people_system.md §1: "first made in Germany in 1704". MAT054: "Berlin c.1706". EDO_FULL_CASE L5: "1704–06". | [1704, 1706] · circa · probable · "c. 1704–06" | b3-3, the b3-2g reveal and r4-z "around 1704" → "about 1704–06"; MAT054 takes the same display (one owner, linked by `canon: MAT054`). **Needs a source**: a pigment reference work. |
| e1672, e1800, e1804 | objects_events.md §2 r11, r29, r30: each "probable". | 1672; 1800 · month; 1804 · year; all probable | Events gain `conf: probable`; b1-5, b2-5, b2-8 add "(probable)"; utamaro.highlights likewise. |
| Tokunō proofs | notes_objects.md: right sheet "23 impressions from 13 printing surfaces on 7 blocks"; centre 25, left 24. Unit: "over a hundred". | 23 · number · documented (nmah-proof), one sheet; the gift's total **needs a source**: the Smithsonian's object list (si-tokuno) | b8-5 and tokuno.highlights → "progressive proofs, twenty-three for one sheet". |
| Reading objects | cma-utamaro: "Publisher: Tsutaya Jūzaburo (emblem). Censorship Seal: kiwame."; notes_objects.md: AIC 1925.3030 "Publisher Matsumura Yahei; Censor's seal KIWAME". | Not a date; the seal record carries `objects:` | None; b2-4 and the case's I1 use different sheets, both correct. |
| The acts' spans | Kickers 1603–1806, 1807–1835, 1841–1868, 1865–1928, 2020–2024. | kind span, one per act, no source, note "editorial" | Declare the gaps (1836–40, 1929–2019) and the 1865–68 overlap so the acts band draws them; the lint checks every event sits in an act or a declared gap. |

## 5. The process for the other 37 units

**Who.** The *writer* drafts the spine: events, people, objects, each a claim sentence without a date. The *specialist* (the unit's researcher, or the reader a case names, as EDO_FULL_CASE §8 names a Japanese reader) fills each record from `sources.yaml`, adds alternates, and marks the calendar. The *editor* owns `claims.yaml`: sets confidence and display, writes the editor_note, and decides which alternates are resolved (preferred for a stated reason) and which make a record argued.

**When.** The register is frozen, tagged `claims-v1`, before any beat is authored; scenes, cards, ticks and tiles are written against ids. A date the register lacks is a change request to the editor, not a number typed into prose; the lint fails the shortcut. Re-freeze as `claims-v2` before the Atlas build and before narration is recorded.

**Acceptance.** A unit passes when the lint reports no E-codes and no record with an unresolved alternate drives a tick, a tile or a scene's clock. Argued and contested records live only inside beats of kind `argued`, every alternate sourced, and place nothing on the timeline. Each W-CANON-DISAGREES is fixed in the canon or carries an editor_note. The specialist signs calendars and names; the editor signs the register.

## Report

Counted, accession numbers excluded: `timeline.yaml` holds 66 dated items on 55 distinct years; `people.yaml` 50 born/died fields and 62 life ticks on 74 years; beat and card prose mention 101 distinct years, 26 held by nothing structured; 120 distinct year values in all. Keyed by claim (1842 alone is four), the Edo unit needs about 160 dated records, about 190 with the counts and prices the prose carries.

Cases needing a source outside the repo: Tsutaya's death day (a museum biography); the theatres' per-theatre years (the NDL page re-read, or a kabuki chronology); Bracquemond's find (Eidelberg 1981 or the Met Bulletin 1985, read); Kuniyoshi's and Sadanobu's Japanese-calendar birth dates (a reference work); Prussian blue's year of invention (a pigment reference work); the Tokunō gift's total proof count (the Smithsonian's object list); Utamaro's 1804 manacling, to raise it from probable (a museum biography). The Fuji series, the theatres' range, the blue's arrival and the reading objects are settled by what the repo holds.

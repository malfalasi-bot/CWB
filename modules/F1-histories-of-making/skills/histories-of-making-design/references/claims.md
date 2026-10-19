# The claims register

From `research_notes/Motion layers and focus/editorial_process.md`. Every dated or numbered claim in a unit lives in one file, `content/claims.yaml`; the timeline, the people, the Atlas items and the prose are derived from it or checked against it. Prose never carries a date or count the register does not hold. Dates and numbers are never typed into prose, captions, ticks, tiles or clocks directly.

## 1. A record is keyed by the claim, not the year

Twenty-three birth and death years in the Edo unit share a year with an event that is a different fact (Eisen born 1790; the kiwame seal 1790). Matching by year alone is the error the lint refuses: a record is the claim sentence, and the year is its value.

```yaml
# content/claims.yaml — one record per dated or numbered claim
<id>:                      # <unit>-<topic>-<aspect>; stable once frozen
  claim: ""                # one sentence, no date in it
  kind: date | number | span
  value: 1842              # a year, [from, to], or a number
  precision: year | month | circa | range
  calendar: gregorian | lunar | hijri | regnal | long-count   # lunar: "6th month"; never converted in prose
  pos: 1842.5              # decimal year for the timeline cursor; derived if absent
  confidence: documented | probable | contested | argued
  sources: [kato-tenpo]    # sources.yaml ids, or a research-note citation
  alternates:              # every other published value, each sourced
    - {value: 1841, sources: [ndl-saruwaka], note: ""}
  display: "1842"          # the one rendered string, without the confidence word: "1841–43" · "c. 1830–32" · "around 1704"
  where_used: {beats: [], events: [], people: [], atlas: [], objects: []}
  editor_note: ""          # why this value; what would change it
```

Two records at length:

```yaml
ed-theatres-saruwakacho:
  claim: The three theatres are moved to Saruwaka-chō
  kind: date
  value: [1841, 1843]
  precision: range
  confidence: documented
  sources: [ndl-saruwaka]
  alternates:
    - {value: [1841, 1842], sources: [ndl-saruwaka], note: "the page title"}
  display: "1841–43"
  where_used: {beats: [b5-4], events: [e1842t], people: [tadakuni.story], atlas: [e1842t]}
  editor_note: "A per-theatre year needs the NDL page re-read."

ed-blue-at-printers:
  claim: Prussian blue is in use by Edo's printers
  kind: date
  value: [1824, 1829]
  precision: range
  confidence: argued
  sources: [smith-blue, fitzhugh]
  alternates:
    - {value: 1790, sources: [artelino-aizuri], note: "via Dejima; probable"}
    - {value: 1820, sources: [people-system], note: "from Holland"}
  display: "late 1820s"            # the surface adds "(argued)"
  where_used: {beats: [b3-4]}
  editor_note: "Drives no tick; the beat's clock is the price fall, 1824–28, documented."
```

## 2. Display rules

Documented is unmarked; the other three confidence words appear in brackets after the display, or as the word in the sentence in prose. `display` is the bare string and renders verbatim; a surface adds only the bracket and the alternates.

| Surface | Point | Circa | Range | Argued or contested |
|---|---|---|---|---|
| Caption, beat prose | "1842" | "c. 1830–32" in captions, "about 1830–32" in prose | "1841–43" | display plus "(argued)"; alternates in the argued panel |
| Timeline tick | a point; hollow if probable | a point with a halo the width of the span | a bar from `value[0]` to `value[1]`, never a point | a dotted bar across the alternates; never a tick of its own |
| Cursor readout | "1842 · 6th month" | "c. 1830–32" | "1841–43" anywhere in the bar | the display; tap lists the alternates, sourced |
| Character sheet | born/died as display; "~" only for circa | "c. 1753" | "fl. 1830s", a shorter bar | the confidence word on the highlight; never a life tick |
| Atlas card | `display + ": " + label`, never a bare integer year | same | same | the confidence word; alternates on expand |
| Scene clock | the beat's `year` equals a used record's `pos` | shows the display, not the decimal | shows the range; `pos` is the midpoint | shows the documented record the beat rests on |

Lunar and other reckonings stay as written ("the sixth month of 1842"); `pos` places only. Prompts and Rebuild tiles use point records only. The clock readout's form (CE · the source's reckoning) is in `calendars.md`.

## 3. The lint

1. Every four-digit year in beat text, prompt, argued text and figure caption belongs to a record in the beat's `claims` list and agrees with its display.
2. Every `born`, `died` and life tick in `people.yaml` names a record; the build writes the value.
3. Every event, price, run and band boundary carries `claim: <id>`; the build copies `value`, `pos`, `display` and `confidence`, so the timeline file keeps ids, lanes, labels and images only.
4. The Atlas build reads the register for every unit item and emits `display` and `confidence`; it warns where a linked canon row's date note disagrees.

Message format, fixed: `<CODE> <where>[ ← <record id>]: <what the file says>, <what the register says>`. Codes: `E-DATE-UNREGISTERED` (a year in prose with no record), `E-DATE-MISMATCH` (prose disagrees with the display), `E-CONF-MISSING` (a probable, contested or argued value without its word in the sentence), `E-CLOCK` (a beat's year matches no record's `pos`), `E-EVENT-NOCLAIM`, `E-PERSON-NOCLAIM`, `E-ARGUED-TICK` (an argued or contested record driving a tick, a tile or a clock), `W-CANON-DISAGREES`. Accession numbers are excluded from the year scan.

## 4. Who, when, acceptance

**Who.** The *writer* drafts the spine: events, people, objects, each a claim sentence without a date. The *specialist* (the unit's researcher, or the reader a case names) fills each record from the sources, adds alternates and marks the calendar. The *editor* owns the register: sets confidence and display, writes the editor note, decides which alternates are resolved (preferred for a stated reason) and which make a record argued.

**When.** The register is frozen and tagged (`claims-v1`) before any beat, scene, card, tick or tile is authored; all of them are written against ids. A date the register lacks is a change request to the editor, not a number typed into prose; the lint fails the shortcut. Re-freeze before the Atlas build and before narration is recorded.

**Acceptance.** A unit passes when the lint reports no E-codes and no record with an unresolved alternate drives a tick, a tile or a scene's clock. Argued and contested records live only inside notes and argument cards, every alternate sourced, and place nothing on the timeline. Every canon disagreement is fixed in the canon or carries an editor note. The specialist signs calendars and names; the editor signs the register.

## 5. Sizing

Edo needed about 160 dated records and some 30 counts: two to three days for an editor, half a day for the lint, a day for the prose edits. Two to three days per unit after. Cases the repo cannot settle are listed by name with the outside source needed (a museum biography, a reference work, a holder's object list) and stay probable or argued until it is read.

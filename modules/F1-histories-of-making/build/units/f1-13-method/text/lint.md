# F1.13 · beats lint

Every beat in `beats.yaml` checked against `beats.md` §6 (the twelve lints), then read cold, out of order. Word counts and the mechanical rules (length, first word, year and proper noun, confidence words, station and source resolution) were run by a script over the YAML on 20 October 2026; the judgement rows (coherence of the claim, the prompt's restatement, the cold read) are read by eye. "Pass" or "fail" with the reason; a fail is a fix, not a note.

Register note: the claims lint (`claims.md` §3) needs `content/claims.yaml`, which step 4 writes and the editor freezes. Here every year and number is matched against the ids in each beat's `claims` list and the `displays` block at the end of `beats.yaml`, whose strings are the lecture's own. The codes it would raise are listed where they apply.

## Scene shape

| Scene | exactly one threshold, first | 3–7 after | aside ≤ 1, never first or last | prompt ≤ 1, never first or last | bridge only where place or scale changes | Result |
|---|---|---|---|---|---|---|
| The blue | 1, first | 6 (caption · prompt · focus · caption · note · bridge) | 0 | 1, position 3 of 7 | 1, last: Iran at zoom 5.5 → Asia at zoom 1.95 (station 2 → 7) | pass |
| The galleons | 1, first | 4 (focus · prompt · note · caption) | 0 | 1, position 3 of 5 | none: one map scale (the Pacific at 1.85) | pass |

## The blue (stations 1–2, bridge to 7)

### b-blue-1 · threshold · L1.1 · 42 words

| Lint | Result | Reason |
|---|---|---|
| kind, length | pass | threshold, 42 words (20–45); one date (1300s), one number (four) |
| scene shape | pass | first in the scene; the only threshold |
| coherence | pass | year "1300s"; proper noun "Jingdezhen" |
| no dependent opening | pass | first word "A" |
| station | pass | L1.1 resolves; the tie names stations 1–2 |
| focus / caption / bridge / prompt | — | not this kind |
| confidence | pass | no confidence word |
| sources | pass | C01, C02 ⊂ station 1's [C01, C02, C03] |
| claims | pass | 1300s → f13-e-jar (display "1300s"); "four flows" → F1.13-C01 |

### b-blue-2 · caption · L1.1 · 49 words

| Lint | Result | Reason |
|---|---|---|
| kind, length | pass | caption, 49 words (25–60) |
| coherence | pass | "1300s"; "Cleveland Museum of Art", "Jingdezhen" |
| no dependent opening | pass | first word "On" |
| station | pass | L1.1, required on a caption, present |
| caption | pass | the first sentence names the instrument ("On the stage") and its object (the jar) |
| confidence | pass | none |
| sources | pass | C02 ⊂ station 1 |
| claims | pass | 1300s → f13-e-jar; 1962.154 is an accession, excluded from the year scan |

### b-blue-3 · prompt · L1.1 · text 18 words, say 31 words

| Lint | Result | Reason |
|---|---|---|
| kind, length | pass | question text 18 (≤ 22); say 31 (≤ 40) |
| scene shape | pass | position 3 of 7, neither first nor last |
| coherence | pass | "1300s"; "Jingdezhen", "Iran", "Europe" |
| no dependent opening | pass | first word "The"; the first sentence holds a year (1300s) and proper nouns |
| station | pass | L1.1; `prediction` L1.predict-1 resolves in lectures.yaml and is the lecture's own guess at this station |
| prompt | pass | say ≤ 40; the answer (Iran, likely Kashan; the dashed leg) is drawn on the map after the guess, no reveal beat; b-blue-4 carries the Xuande evidence (C03), b-blue-5 the Kashan bowl (C05), b-blue-6 the mine (C04): none restates "imported from Iran, likely from Kashan" |
| confidence | pass | "likely" is the record's word, not one of the four; the say may carry a confidence word in any case |
| sources | pass | C02 ⊂ station 1 |
| claims | pass | 1300s → f13-e-jar; the say's claim is F1.13-C02 |

### b-blue-4 · focus · L1.1 · 34 words · mark f13-e-xuande

| Lint | Result | Reason |
|---|---|---|
| kind, length | pass | focus, 34 words (15–40); 2 sentences |
| coherence | pass | "1426–1435"; "Jingdezhen", "Jiang", "Xuande" |
| no dependent opening | pass | first word "Jingdezhen" |
| station | pass | L1.1 |
| focus | pass | ≤ 2 sentences; exactly one date (1426–1435, one range, one claim); `mark` resolves to the timeline bar f13-e-xuande (lane 1, material); subject and date in the first sentence |
| confidence | pass | none ("relied heavily" is the source's phrase) |
| sources | pass | C03 ⊂ station 1 |
| claims | pass | 1426–1435 → f13-e-xuande (display "1426–1435") |

### b-blue-5 · caption · L1.2 · 53 words

| Lint | Result | Reason |
|---|---|---|
| kind, length | pass | caption, 53 words (25–60) |
| coherence | pass | "late 1100s–early 1200s"; "Iran", "Cleveland Museum of Art", "Kashan" |
| no dependent opening | pass | first word "On" |
| station | pass | L1.2 |
| caption | pass | the first sentence names the stage and the bowl |
| confidence | pass | the record's "probably at Kashan" is held for the note; the caption says "from Iran" and "Kashan's workshops" (the lecture's own line) |
| sources | pass | C05, C02 ⊂ station 2's [C04, C05, C02] |
| claims | pass | late 1100s–early 1200s → f13-e-kashan-bowl (display as the lecture gives it); "a century before the Jingdezhen jar" → F1.13-C02; 1915.581 is an accession |

### b-blue-6 · note · L1.2 · 69 words

| Lint | Result | Reason |
|---|---|---|
| kind, length | pass | note, 69 words (25–70) |
| coherence | pass | "1301"; "Kashan", "Qamsar", "Abu'l-Qasim", "Anarak", "Jiang" |
| no dependent opening | pass | first word "Which" |
| station | pass | L1.2; qualifies the station's argued pair a-cobalt-mine (C04) |
| note | pass | names the claim it qualifies (which mine gave the cobalt, C04) in its first sentence; the confidence words "argued" and "probably" live here |
| confidence | pass | confidence words in a note, where they may be |
| sources | pass | C04, C05 ⊂ station 2 |
| claims | pass | 1301 → f13-e-abulqasim; "200 kilometres" → F1.13-C04 (the lecture's figure); the argued mine drives no tick (no `E-ARGUED-TICK`: Qamsar and Anarak are fuzzy marks on the map, not ticks) |

### b-blue-7 · bridge · L1.7 · 45 words · from kashan, to amsterdam

| Lint | Result | Reason |
|---|---|---|
| kind, length | pass | bridge, 45 words (20–50) |
| scene shape | pass | last card; the scale changes (Iran 5.5 → Asia 1.95) |
| coherence | pass | "1300s", "about 1600–1625"; "Kashan", "Amsterdam", "Iran", "China" |
| no dependent opening | pass | first word "From" |
| station | pass | L1.7, the destination's station (beats.md §3) |
| bridge | pass | `from` kashan and `to` amsterdam resolve in the lecture's gazetteer; the text names two places and two dates |
| confidence | pass | none |
| sources | pass | C18, C02 ⊂ station 7's [C18, C19, C02] |
| claims | pass | 1300s → f13-e-jar; about 1600–1625 → f13-e-kraak (prose form of "c. 1600–1625", claims.md §2) |

## The galleons (station 6, two instrument states)

### b-gal-1 · threshold · L1.6 · 38 words

| Lint | Result | Reason |
|---|---|---|
| kind, length | pass | threshold, 38 words (20–45); one date (the span 1565–1815); no number: "as much as a third" is held for the prompt, so the "one number" slot stays empty rather than spoil the guess |
| scene shape | pass | first; the only threshold |
| coherence | pass | "1565–1815"; "Manila", "Puebla" |
| no dependent opening | pass | first word "On" |
| station | pass | L1.6; the tie names station 6 |
| confidence | pass | none |
| sources | pass | C15, C16, C17 ⊂ station 6 |
| claims | pass | 1565–1815 → f13-e-urdaneta and f13-e-galleon-end (the lecture's stamp); the basin's date is not given here (it is b-gal-5's) |

### b-gal-2 · focus · L1.6 · 38 words · mark f13-e-urdaneta · state: the route

| Lint | Result | Reason |
|---|---|---|
| kind, length | pass | focus, 38 words (15–40); 2 sentences |
| coherence | pass | "1565–1815"; "Potosí", "Manila", "Acapulco" |
| no dependent opening | pass | first word "Potosí" |
| station | pass | L1.6 |
| focus | pass | exactly one date (the span 1565–1815); `mark` resolves to the bar on the materials lane (the galleons, 1565–1815); "two legs" was cut so no second number sits in the text |
| confidence | pass | none; the probable fraction is not here |
| sources | pass | C15 ⊂ station 6 |
| claims | pass | 1565–1815 → f13-e-urdaneta, f13-e-galleon-end |

### b-gal-3 · prompt · L1.6 · text 21 words, say 32 words

| Lint | Result | Reason |
|---|---|---|
| kind, length | pass | text 21 (≤ 22); say 32 (≤ 40) |
| scene shape | pass | position 3 of 5 |
| coherence | pass | "1565–1815"; "Potosí", "New Spain", "Peru", "Asia" |
| no dependent opening | pass | first word "Potosí's" |
| station | pass | L1.6; L1.predict-6 is the lecture's own guess at this station |
| prompt | pass | say ≤ 40; the answer is the label on the silver leg, drawn after the guess; b-gal-4 (people) and b-gal-5 (the basin) do not restate "a third" |
| confidence | pass | "probable" sits in the say, where it may |
| sources | pass | C15 ⊂ station 6 |
| claims | pass | 1565–1815 → the two ticks; "one-third" → F1.13-C15 (probable; never a tick) |

### b-gal-4 · note · L1.6 · 66 words · content note

| Lint | Result | Reason |
|---|---|---|
| kind, length | pass | note, 66 words (25–70) |
| coherence | pass | "1565–1815", "1672"; "Indian subcontinent", "Southeast Asia", "Mexico", "Seijas" |
| no dependent opening | pass | first words "Content note:" |
| station | pass | L1.6 |
| note | pass | a content note, named as such first; the people of C17 are a note, never a caption; "chinos" is quoted as the record's label and named colonial |
| confidence | pass | none needed; a note may carry one |
| sources | pass | C17 ⊂ station 6 |
| claims | pass | 1565–1815 → the two ticks; 1672 → F1.13-C17 (the register's claim carrying the law; no inventory event, so no tick of its own in these beats) |
| protocol | pass | level 2: the content note precedes the people mark; the mark sits beside the leg, no glyph rides it (the human-flow rule) |

### b-gal-5 · caption · L1.6 · 59 words · state: the basin

| Lint | Result | Reason |
|---|---|---|
| kind, length | pass | caption, 59 words (25–60) |
| coherence | pass | "about 1650"; "Puebla", "The Metropolitan Museum of Art", "Hecht", "Acapulco" |
| no dependent opening | pass | first word "On" |
| station | pass | L1.6 |
| caption | pass | the first sentence names the stage and the basin |
| confidence | pass | none |
| sources | pass | C16, C15 ⊂ station 6 |
| claims | pass | about 1650 → f13-e-basin (prose form of "ca. 1650"); 12.3.1 is an accession |

## Read cold, out of order

Each beat read alone, as the timeline, a Cast card or the Atlas would hand it over: does it name its subject and its date in its own words, with no antecedent in another beat?

| Order read | Beat | Subject named | Date named | Antecedent outside the beat | Verdict |
|---|---|---|---|---|---|
| 1 | b-gal-4 | the galleons; enslaved people from the Indian subcontinent and Southeast Asia; the law | 1565–1815; 1672 | none ("them" refers to the enslaved people named in the same beat) | pass |
| 2 | b-blue-6 | the cobalt in Kashan's blue; Qamsar; Anarak; the Cleveland bowl | 1301 | none ("the bowl" is "the Cleveland bowl" within the beat) | pass |
| 3 | b-blue-3 | the jar's blue at Jingdezhen | the 1300s | none | pass |
| 4 | b-gal-5 | a basin from Puebla, the Met's 12.3.1 | about 1650 | none | pass |
| 5 | b-blue-7 | Kashan, the cobalt; Amsterdam, a Kraak dish; the blue from Iran | 1300s; about 1600–1625 | none | pass |
| 6 | b-blue-1 | a jar at Jingdezhen; a network as four flows | the 1300s | none | pass |
| 7 | b-gal-2 | the galleons, Potosí to Manila to Acapulco | 1565–1815 | none | pass |
| 8 | b-blue-5 | a footed bowl from Iran, Cleveland 1915.581; Kashan's workshops | late 1100s–early 1200s | none: "the Jingdezhen jar" is named, not "the jar" | pass |
| 9 | b-gal-1 | the Manila galleons; a basin from Puebla | 1565–1815 | none | pass |
| 10 | b-blue-4 | Jingdezhen; Jiang and colleagues; the Xuande wares | 1426–1435 | none | pass |
| 11 | b-gal-3 | Potosí's silver on the galleons | 1565–1815 | none | pass |
| 12 | b-blue-2 | the jar, Cleveland 1962.154, Jingdezhen | the 1300s | none | pass |

Twelve of twelve read cold.

## Claims lint, as far as it can run without the register

| Code | Raised | Where |
|---|---|---|
| E-DATE-UNREGISTERED | none | every year in the twelve beats maps to an id in the beat's `claims` list |
| E-DATE-MISMATCH | none | displays as the lecture writes them: "1300s", "1426–1435", "late 1100s–early 1200s", "1301", "about 1600–1625" (prose of "c. 1600–1625"), "1565–1815", "1672", "about 1650" (prose of "ca. 1650") |
| E-CONF-MISSING | none | the two non-documented values in the beats, the mine (contested) and the fraction (probable), carry "argued" (b-blue-6) and "probable" (b-gal-3's say) |
| E-CLOCK | none | the blue's clock rests on f13-e-jar / f13-e-kashan-bowl / f13-e-xuande; the galleons' on f13-e-urdaneta / f13-e-galleon-end / f13-e-basin, all documented |
| E-ARGUED-TICK | none | Qamsar and Anarak are marks on the map, not ticks; the fraction is a label on a leg; neither drives a tick, a tile or a clock |
| W-CANON-DISAGREES | not run | the canon rows and the register are not read here; step 4's file is the editor's |

## What the lint cannot settle here

- `station` resolution is against `lectures.yaml` in this folder, not the unit's `content/lectures.yaml`, which does not exist yet.
- `mark` resolution is against `inventory.json` events, not a built timeline file; the marks are f13-e-xuande (a bar) and f13-e-urdaneta (the start of a bar).
- The claims lint ran against the `displays` block, not a frozen register; the register is a change request to the editor before these beats ship.
- No aside in either scene, so the aside rules (own year, proper noun and source; off the thread) were not exercised.

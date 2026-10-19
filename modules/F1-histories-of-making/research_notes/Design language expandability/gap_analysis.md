# Design language expandability: gap analysis

2026-10-20 · read-only. Sources: the skill, `model.json`, the Atlas logic doc, the eight batch-1 specs, TASK_27, FRAMEWORK.md, references_study §4–§5.

Written from one archetype-B unit, the skill's ground, type, rhythm, clock, label and glyph rules transfer to all seven archetypes unchanged. It lacks eight components the other archetypes and the Atlas open on, and the rules Edo never needed: one script, one calendar, one territory, one protocol case.

## 1. Matrix

**as-is** · **variant** (of an existing component) · **new** (section 2, N1–N8) · **rule** (section 3). Last column: the line creating the need.

| Surface or page type | Status | Component or gap | Need |
|---|---|---|---|
| Unit opening: one object, no label (A) | variant | Annotated object page, label withheld until the reveal | F1.1, F1.16 opening rows |
| Scrollytelling walk (B) | as-is | Scene framework, scene sheets, gallery rhythm | B `core` |
| Globe time-lapse, then map (C) | variant | Journey bar in `crawl` + one-colour map; volume as one backbone line | C `opensOn` |
| Timeline with parallel rows (D) | variant + rule | Span list, one row per region on one axis | D `opensOn`; Atlas §5 |
| Argument card (E) | **new** | N1 | F1.3 opening (form 13) |
| Problem or prediction card (F) | variant of N1 | The scene `guess` as a card: images, prompt, reveal | F1.2 opening (form 15) |
| Learner's own layer, empty (G) | variant + rule | Kraft workbench + N2 authoring + stepper | G `opensOn`; F1.27 |
| Place: map, globe, borders | as-is + rule | One-colour map; list · globe · panel; borders as a lens with its limit | Atlas §4 polity, §7 |
| Time: first-known mode | as-is | Span list, works wall; "earliest known" | Atlas §5; F1.1 INV001 note |
| Time: calendar mode; Calendars view | variant + rule | Span list, one lane per reckoning under a CE axis | Atlas §4 calendar row; F1.30 |
| Connections, lineage graph | **new** | N2 | F1.1 lab row; F1.13; F1.19b |
| Compare, 2–6 nodes × six readings | **new** | N3 | Atlas §5, §7 |
| Comparison wall, 6–10 tiles, filters | variant | Gallery rhythm rows + comparison box; one tag per tile | F1.4, F1.15 lab rows |
| Before/after layer slider | variant + rule | Comparison box in overlay mode; alt text names differences | F1.14 lab row |
| Lens overlays on one object | variant | Annotated object page with leader sets on tabs, each ending "what this lens cannot see" | F1.1, F1.16 lab rows |
| Grouping page, all kinds | **new** | N4 | Atlas §6 |
| · movement | N4 | walk, members, neighbours | Atlas §6 Mingei |
| · style | N4 + N3 | members opened in Compare | Atlas §4 |
| · school | N4 + N2 | lineage filter "learned from" | Atlas §4 |
| · culture (archaeological; area) | N4 | contested members tagged "argued" | Atlas §4 membership rule |
| · civilisation, as named | N4 variant | caveat card; never in navigation | Atlas §3 option B |
| · community or people | N4 variant + N8 | own name first; Notice; protocol | Atlas §4; every spec §2 |
| · polity | N4 + map variant + rule | borders lens, "states only" on screen | Atlas §4 |
| · dynasty | N4 + span list | rows per reign | Atlas §4 |
| · network | N4 + journey bar + rule | people a separate layer, never goods | Atlas §6; C `avoid` |
| · material, technique | as-is | Material biography, typology plate, phase strip, as lenses | Atlas §4 |
| Lens switcher | variant + rule | Sized legend's counts-by-kind row as chips; 1 lens at Orientation, 3 at Mastery | Atlas §7 |
| Coverage grid | **new** | N6 | Atlas §2 Heilbrunn; F1.3 claim 20 |
| Credit map | **new** | N5 | F1.18 lab row; F1.23 |
| Provenance chain | variant + rule | Journey bar bound to holders; a gap is a dashed stretch "not recorded" | F1.1 claim 9; F1.24 |
| Counterfactual branch view | **new** | N7 | F1.30a; F1.5, F1.14 `add` |
| Oral-history kit | **new** | N8 (kit mode) | F1.29 |
| Protocol builder; briefer's three lists | N8 | brief mode | F1.26; F1.16 briefer apply |
| Notice · content note · display basis | N8 | the sheet's first card, alone | every spec §2 |
| Reconstruction log | variant + rule | Step-strip with the learner's own crops; tag "Reconstruction, an interpretation" | F1.28a; `sensitivity[3]` |
| Slot builder | variant + rule | G layer + N4 authored by the learner; identity by rule 3.6 | F1.31 |
| Data story, counted figure | variant + rule | Pull-fact + sized legend + bubble; who counted, when | F1.3 claim 20; C `core` |
| Audio and video with transcript | variant + rule | Progress bar per item + transcript; sound on tap | F1.4, F1.16 media rows |
| Character sheet | as-is + rule | name order generalised (3.2) | components 20 |
| Phone forms: sheets, audio walk | as-is | list · globe · panel phone rule | components 9 |
| List twin of every surface | rule | a list with the same content | Atlas §7; F1.2 media row |

## 2. New components

Skill format: references (numbers from references_study), anatomy in build order, rules, first instance.

**N1 Argument card (refs 08, 18; Atlas §3).** Archetype E's opening. Anatomy: a mono eyebrow, "argument"; claim and counter-claim as two deck-size serif paragraphs, one above the other, never side by side; one case line in `--ink-2` with its claim id; a hairline "I lean to this" under each. Rules: no third position; neither side coloured; the choice is a position, never marked right; the card returns at the end with "what you wrote"; both readings sourced; never on coerced or sacred material. First: F1.3, "civilisation" 1756–57 → 1919 → 1992.

**N2 Relation graph (refs 13, 14; Atlas §5).** Connections, lineage, authoring. Anatomy: nodes as paper chips (name over a mono line: kind, range); 1 px sumi edges typed at the midpoint; documented solid, probable dotted, contested dashed with both readings on tap; the selected node's edges in ink, the rest at a quarter; the panel at the right, ending with sources and the stepper; the learner's nodes on kraft. Rules: ≤ 40 nodes, then a cluster count; one edge type lit at a time; "challenge an edge" opens the claim, never deletes it; no drifting layout; on phones a list of links. First: F1.1, the tablet dropped onto its nodes.

**N3 Compare sheet (refs 09, 04; Atlas §5).** Anatomy: a column per node (2 at Orientation, 6 at Mastery), headed by the object at one scale with its credit line; a row per reading (material, labour, meaning, trade, technique, use), each cell ≤ 25 words with a claim id, an empty cell reading "not known"; a last row, "what this comparison leaves out". Rules: one scale or the scale figure; no cell scored or coloured; excluded material never enters. First: F1.1, tablet and khipu.

**N4 Grouping page (refs 13, 18, 19; Atlas §6).** One page for twenty-one kinds. Anatomy: (1) the card: name, kind as eyebrow, "as defined by [who], [when]", a span-list row, the one-colour map, the membership confidence word, "what it leaves out"; (2) the walk, 6–9 steps over a 120 px map and a span strip, with the stepper; (3) members as a gallery row with lens chips, contested ones tagged "argued"; (4) neighbours and counterparts; (5) afterlives; (6) what is argued, both readings; (7) the apply hook; sources. Kind variants: civilisation adds the caveat card above (1); community puts the Notice first; polity turns on the borders lens; network draws people as a separate layer; dynasty replaces the map with reigns. Rules: never ranked; no rise-and-fall curve unless sourced; no identity colour. First: Mingei, Nok.

**N5 Credit map (refs 08, 05; F1.18, F1.23).** A ledger over one object. Anatomy: the object at the left; role rows at the right (designed, spun, dyed, wove or shaped, finished, sold, named on the label), each holding a name, "unnamed" or "not known" and a confidence word; a leader from each filled row to the part it touches; the holder's credit line beneath, quoted; a last line, "who the credit leaves out". Rules: rows are never deleted, only "not known"; the holder's line is never edited; nothing scored; read-only on coerced cases. First: the AIC *Lotus* curtain.

**N6 Coverage grid (ref 04; Atlas §2).** Anatomy: rows the nine world chapters, columns the eleven bands; a cell holds a count in ink and opens a gallery row; an empty cell shows paper and "none open", never a dash; a dated record-density strip beneath. Rules: counts of things, never progress; source and date on the grid; a cell links to Place and Time at that cut; ages carry their region. First: F1.3's density strip.

**N7 Branch view (refs 05, 10; FRAMEWORK §8).** Anatomy: the documented line as a span list or works wall in ink; one tick as the variable with a one-sentence rule card; the branch from it in `--ghost`, labelled "did not happen"; consequences as ghost cards tagged "counterfactual"; a "return" control. Rules: one variable; atrocity never the variable (`sensitivity[4]`); the ghost gains no date, place or glyph; the clock stays on the documented tick, held. First: F1.14, one variable on copies.

**N8 Protocol sheet (refs 13, 18; Atlas §4).** Consent, review and display, generalising the Yoshiwara rule. Anatomy: (1) the Notice: the community's own name first, one line; (2) the content note, once, before the object; (3) the display-basis line in mono ("made for sale"; "not shown: sacred"); (4) kit mode: a stepper, consent → questions → recording → community review → release, each step writing to SRC; (5) brief mode: fixed by the rite / open to the maker / not ours to decide; (6) the review line, "cleared by [reader], [date]" or "awaiting reader". Rules: a held item is unpublished and its gap said in words; no interior, no restricted design, no drawing of our own of an excluded object; never a game. First: F1.29; F1.26.

## 3. Rules the skill lacks

**3.1 Scripts.** The specs carry Arabic (the Herat folio, Hijri dates), Hebrew (OBT202), Devanagari (Kehar Singh), Chinese (Wang Jie's colophon, nianhao), Korean (Tripitaka Koreana), Cyrillic, Greek, and diacritic Latin (Diné, Asanteforɔ, P'ohwhóge Owingeh, Māori macrons, ʻokina). Rule: the serif / Plex Sans / Plex Mono pairing stays; each script adds one serif and one sans from Google Fonts, loaded only where it occurs. Source Serif 4 and Plex Sans cover Latin Extended, Cyrillic and Greek. Arabic: Noto Naskh Arabic + IBM Plex Sans Arabic. Hebrew: Frank Ruhl Libre + IBM Plex Sans Hebrew. Devanagari: Tiro Devanagari + IBM Plex Sans Devanagari. Chinese: Noto Serif SC/TC with `lang` tags; Shippori Mincho stays Japanese. Korean: Noto Serif KR + IBM Plex Sans KR. Plex Mono lacks Arabic, Hebrew and Devanagari: those readouts fall back to the script's Plex Sans. Twi ɔ ɛ ŋ, the Diné glottal and ogonek, and the ʻokina are checked glyph by glyph at build. Layout: UI is LTR; quoted runs are bidi-isolated (`dir="auto"`); the span list's axis and the stepper never mirror; scripts without italic set a title's "idea" half in `--ink-2`, never faux-italic; vertical setting only when the object is.

**3.2 Names.** "Japanese names in Japanese order" becomes: a name as its community writes it (Chinese, Korean, Hungarian family first; Arabic chains uncut; Po've'ka beside Maria Martinez). The own name first, the record's exonym after it in quotation marks ("Diné; the record: 'Navajo'"), as every spec §2 does. The holder's words ("priest-king") once, quoted, attributed.

**3.3 Calendars.** FRAMEWORK §3 fixed "1842 · Tenpō 13". Generalise: CE · the source's reckoning: "868 · Xiantong 9"; "1585–95 · 993–1004 AH"; "year name as written · c. 2042 BCE" for regnal years; a Long Count in its five places with the correlation named. A lunar year across two CE years is written as both. A conversion the register lacks is not shown. Era tables go in `references/calendars.md`.

**3.4 Who defined it; what it leaves out.** No grouping chip, card, lens or label without "as defined by [source, date]" on tap and "what it leaves out" on its page (Atlas §4; F1.3's "X, as defined by Y (date)"). The civilisation word never in navigation. Ages carry their region. Contested membership is the "argued" tag.

**3.5 Living-practice protocol.** The Yoshiwara rule ("read, not played; a content note once; no interior") becomes six levels drawn by N8: Notice; content note once; display basis; link-out only (the Tlahuitoltepec blouse, kōwhaiwhai); excluded, named in text with no thumbnail and no drawing of our own (the Chester head, minkisi, Okina); held for a named reader, unpublished. Plus: no interior of a sacred or domestic space; restricted techniques watched, not made; no recitation of sacred text; no generated image; no person glyph rides a trade leg.

**3.6 Per-unit identity.** SKILL §4's "other units pick eight the same way" becomes a derivation: the count is the unit's lectures or cases (3–8); each colour is named after a MAT row the unit reaches; hues ≥ 20° apart within a unit and ≥ 36° apart across the nine world chapters so the Atlas list reads; never the two accents (Edo's L5 and L6 are not repeated); 4.5:1 on paper and sumi; one glyph per lecture from the shared library, grown only by a content line. Groupings take no colour; a learner's slot derives its own by this rule.

**3.7 Territories that are not countries.** For an ocean network or a belt (the Indian Ocean, the Pacific, the steppe): the extent as the sources give it, a `--land-2` wash with a soft edge where approximate and its honesty line; the globe centred on the water or the belt (Atlas §5); no borders lens; environment as a biome lens, not a box.

**3.8 Smaller.** Every count names who counted and when. Every surface has a list twin. A reconstruction's one tag is "Reconstruction, an interpretation". The borders lens states "states only". Audio on tap with its transcript.

## 4. What stays

The ground, the type pairing and sizes, scene / objects / scene, the clock in five modes, the label budget and placer, the glyph discipline, the no-list, the stepper, the sources block, the confidence word on every date. None is about Japan: they are about one object on paper, time in the shape the content has, and a map lighting one kind of thing. Every spec's surfaces fall into the rhythm, and none asks for a third colour: trade is indigo and the state seal red in every unit read.

## 5. Proposed structure

**SKILL.md (≤ 500 lines).** 1 The ground. 2 Type and scripts (eight lines, pointing to `references/scripts.md`). 3 The page rhythm. 4 Identity, derived (rule 3.6; the Edo table moves out). 5 Components in seven families (objects, time, place, groupings, argument and method, the learner's own, apparatus), one line each. 6 Maps, globes and scenes (plus 3.7). 7 Time and calendars (3.3). 8 Groupings kept honest (3.4). 9 Protocol (3.5). 10 What is never done (plus no generated image). 11 How to work (step 1 adds "name the archetype").

**references/.** `components.md`: twenty-eight components in the seven families, the grouping kinds as a table. `tokens.css`: `--unit-<id>-n` palettes, script fallback stacks. `checklist.md`: lines for scripts, calendars, grouping fields, protocol levels, who counted, the list twin. New: `scripts.md`, `calendars.md`, `protocol.md`, `identities.md` (the Edo table and each unit's set), `glyphs.md` (the library, one content line per glyph).

## Counts

Surfaces and page types: 41. As-is: 6 (two also need a rule). Variant of an existing component: 14 (one further row is a rule only). Variant of a new component: 12 (nine grouping kinds, the prediction card, two protocol modes). New components: 8 (N1–N8). New rule families: 8 (scripts, names, calendars, grouping fields, protocol, identity derivation, non-country territories, five smaller rules).

---
name: hom-research
description: How to research a subject for the F1 "Histories of making" course: two passes, twelve kinds of content (concepts, techniques, materials and supply, objects, works, people, institutions and economics, places and movements, events, arguments and historiography, bodies and labour, gaps and the learner), source tiers and independence, verification at the holder, spot-checks, access dates, the unit register, the benchmark of what the content can carry, and the one-page brief the page is written from. Use before any unit, grouping, scene or page is designed. Assumes hom-constitution.
---

# Research for a unit

Research produces three things, in this order: a dossier (everything found, graded), the unit's register (every date and number as a record), and a one-page brief (what the subject teaches and in what order a reader meets it). Nothing is designed before the brief exists.

## 1. Where to start

Read, in order: `specs/F1.N.md` (the unit spec; the source of truth for the unit's question, success criteria and Apply task), the canon rows that reach the unit (`atlas/data/canon/*.csv`, by `units` or `world`), the unit's register if one exists (`atlas/data/register/units/<unit>.yaml`; the older `claims_specs_v1.csv` until migrated), the world set (`world_set_specs_v1.csv`), any grouping draft (`grouping-pages/`), any built lecture (`build/lectures/src/lectures/`), the review logs that touch the unit. Write down what each holds and what it does not. A research note that claims a file does not exist must say which folders were searched.

## 2. Pass one: the dossier

Collect into twelve kinds (`references/schema.md`). Every row: the finding, the source URL, the date accessed, the confidence word, and for counts who counted and when. Search outward from the canon with the research tools available; prefer holders' records, primary sources, peer-reviewed papers, reference works, institutional pages, in that order; press, company pages and teaching pages are allowed with their kind recorded; aggregators (Wikipedia, Britannica) are leads, not sources, unless they are the only thing and then the row says so. Write "not found" rather than guess. Keep the trace: every URL fetched, with status, whether it was used and why not.

## 3. Pass two: verify, fill, look at the field

- Verify every row marked probable or unverified against a better source; verify every accession at the holder's own record (the Met, AIC, Cleveland, Rijksmuseum, LoC, Smithsonian and the BM expose records by accession); a mismatch is a stop.
- Fill the gaps pass one named (the non-European, the unnamed makers, the technique as knowledge).
- Study how the subject is already presented and taught (museum pages, institutional films, the best book's chapter spine): what the clearest three do, what they leave out. This is the input to the reading order.
- Grade sources (`references/sources.md`): kind, independence, interest. "Documented" needs a holder's record, a primary source, a peer-reviewed paper, or two independent sources; two pages that copy one source are one source.

## 4. The register

One store per unit, `atlas/data/register/units/<unit>.yaml`, keyed by the claim, not the year (`references/register.md`): id, claim (no date in the sentence), kind, value, precision, calendar, pos, confidence, sources (ids into `sources.yaml` with kind, URL, date accessed, archive URL), alternates (each sourced), display (the bare string), where used, editor note, and where it applies `protocol` (level and reason), `rule` (the human-flow rule) and `rights_uri` / `rights_checked` on objects. Before freeze: a spot-check on a sample of records and on every documented record that drives a tick (link works · page is about this · page says this value), recorded as `spotcheck: {by, date, result}`; a failed documented record blocks the freeze. Freeze as a tag with a signed header; after it, only an error found by review changes a record, logged.

## 5. The benchmark: what the content can carry

Count and compare, with the counter named (`references/thresholds.md`): claims in the register; open objects with images in hand; rows with dates; rows with coordinates; journeys with dated legs; groupings with who defined them; living-practice rows with a protocol level. Write which surfaces the content can carry now and which wait, in one table. Research what the content lacks before design pretends it has it.

## 6. The brief

One page (`references/brief_template.md`): the thesis in one sentence; five to seven claims worth teaching, each with its strongest source and confidence; three objects, verified, with rights; one argument with its two readings; one living maker with their protocol level; the counts solid enough to teach and the ones that are PR; what the sources leave out; the spine the subject suggests, with the case for it against the course's six readings (material, labour, meaning, trade, technique, use); the learner's path in about twenty minutes, saying where a map, a timeline or an interactive would explain something prose cannot and where it would not; what the brief still needs (images to fetch, a reader to name, a decision). The brief is what the writer writes from and what the human reads first.

## 7. The colophon of a research run

Every dossier and brief ends with: which model and tools ran it, the date, how many rows by confidence, how many URLs fetched and how many used, what was blocked (holder APIs, paywalls), and what no human has yet checked.

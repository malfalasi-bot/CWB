# F1 Atlas data

Open data for **F1 Histories of making**, the first module of a design-education program. F1 teaches a global history of making as a web of objects, makers, places, routes and institutions. This repository holds the data its Atlas is built from, and the scheduled jobs that keep that data honest.

Everything here is produced at zero cost from free and open sources. Nothing is hosted whose licence does not allow it; everything else is linked.

## What is here

| Folder | Contents |
|---|---|
| `data/canon/` | The canon register: 4,228 nodes in 24 kinds. It covers civilisation names, archaeological cultures, polities, dynasties, belief traditions, movements, styles, schools, maker communities, institutions, exhibitions, networks, techniques, materials, object types, living practices, "first known" claims, communities (under their own names), people, places, events and period definitions. One schema for all (see `tools/codes.py`) |
| `data/register/` | The world-set register v0 (64 objects with licence and 1970 provenance test), claims (110), practices (12), the provenance pass |
| `data/sources/` | 198 zero-cost source routes with licence and a commercial-safe flag; 130 primary texts on making with public-domain status |
| `data/harvested/`, `data/matches/` | Written by the harvest jobs: register re-checks, UNESCO facts, Wikidata id proposals, open-object candidates |
| `harvest/` | The harvesters (standard-library Python) and their offline tests |
| `tools/` | Validation, coverage report, the licence switch |
| `reports/` | Coverage by sub-region and period, validation output, UNESCO matches |

## Rules the data follows

- **Identifiers are never typed.** Wikidata, Getty and PeriodO ids come from the harvest as proposals, and a person accepts each one (`data/matches/wikidata_accepted.csv`).
- **Listings and licences come from the source.** UNESCO status is taken from UNESCO's own data, and licences are checked record by record, every month and again each 2 January.
- **Licence per record.** An old date or an anonymous maker proves nothing. Only records the holder marks CC0 or public domain, or that carry a national open licence or CC BY/BY-SA, count as open.
- **The 1970 test.** An archaeological object is an exemplar only if it left its country of origin before 17 November 1970, was excavated with a record, or was legally exported. Otherwise it is taught as a case.
- **Sensitivity.** Human remains, sacred or secret material, and anything a descendant community asks not to show are never shown. Other grave goods are shown with their origin and a content note. People are never described as goods.
- **Civilisation is a label.** A civilisation name is a search label that opens onto the groupings beneath it. It is never ranked, and every card says what the name leaves out.

## The licence switch

`tools/licence_class.py` puts every asset in one of six classes: PD-CC0, NATIONAL-OPEN, ATTRIBUTION, OWN, PERMISSION-NC and LINK-ONLY. One dataset makes two builds. The **open build** may host items a holder has permitted for free education. The **commercial build** drops them automatically and uses the fallback recorded for each. F1 is free today, and the day it charges nothing is rewritten.

## Running it

Run these from this folder (`modules/F1-histories-of-making/atlas`).

```bash
python tools/validate_canon.py          # errors block a change; warnings are for review
python tools/coverage.py                # reports/coverage.md
python harvest/harvest.py data/register/world_set_v0.csv --out data/harvested/register_check.json
python harvest/ich.py                   # UNESCO facts and proposed matches
python harvest/wikidata_match.py --limit 100
python harvest/candidates.py --tiers R1 --limit 20
```

Python 3.9+ and nothing else. The harvest workflow (`.github/workflows/harvest.yml` at the repository root) runs monthly and on 2 January. It opens a pull request with its results and never writes to `main` directly.

## Being a good guest

The harvesters send a descriptive User-Agent and stay under each museum's rate limits: 20 requests a minute to APIs and 6 a minute to the Met's web pages. If a holder asks us to slow down or stop, we do.

## Licence

See the repository's root README (decision Q43). Source data keeps its own licences, listed in `DATA_LICENCES.md`.

Fact-check logs, verification notes and grouping pages that used to sit beside this data now live one level up, in the module's `review-logs/`, `research/` and `grouping-pages/` folders.

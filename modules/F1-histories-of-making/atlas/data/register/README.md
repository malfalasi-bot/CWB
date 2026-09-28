# F1 world-set register v0 and harvester

Built 2026-09-28 from the verified tables in F1 Deep Dives 1 and 2 and a provenance pass on the flagged records.

| File | What it is |
|---|---|
| world_set_v0.csv / .json | 77 records: 64 objects plus places, documents, assets and a dataset. One row per record; `units` lists every chapter that uses it |
| claims_v0.csv / .json | 110 claims from the eleven deep dives, each with unit, confidence and source (IDs from CL-101) |
| practices_v0.csv | 12 living practices (PR-001 to PR-018) |
| prov_pass.json | The provenance pass: verbatim provenance, the 1970 test result, its basis, the gap, the action |
| harvest.py | Harvester for Cleveland, the Met and the Art Institute of Chicago. Standard library only |
| test_harvest.py, fixtures/ | 13 offline tests on real responses saved 2026-09-28 |
| build_register.py, build_claims.py | How v0 was built from the documents (rerun only to rebuild v0) |

Run the tests: `python3 test_harvest.py`
Harvest (needs open internet): `python3 harvest.py world_set_v0.csv --out harvested.json`
Output lists every record whose licence or 1970-test result differs from the register, for a person to review.

Status values: exemplar · case (fails the test; taught as a case) · excluded · to-license · to-source · rights-blocked.
Test values: pass · pass-caveat · enquiry · fail · colonial-gap · n/a (not archaeological).

Notes
- The Met's open API has no provenance field; harvest.py reads it from the object page's server-rendered payload. If the Met changes its page, `met_provenance` returns None and the record is flagged, never silently passed.
- Cleveland's `q=` search is fuzzy; harvest.py keeps only an exact accession match.
- Rate limits are per host (Met web pages 6 a minute, APIs 20 a minute). Be gentler if a museum asks.

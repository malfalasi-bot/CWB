# Registers

The registers are the tables each module's data lives in. They are CSV files in the module's `atlas/data/` folder, versioned in this repository. They move to the app's database when it exists and are exported back to CSV every release (the minimal-computing rule).

F1's registers are the first. Every later module uses the same ones, adding rows rather than new tables.

| Register | File (F1) | Columns | Rows now |
|---|---|---|---|
| Canon | `atlas/data/canon/canon_*.csv` | See `canon-node.schema.json` (22 columns, one schema for every kind) | 4,228 |
| World set (objects) | `atlas/data/register/world_set_v0.csv` | id · kind · status · title · date · holder · accession · licence · holder_and_licence_note · provenance · provenance_test · test_basis · history_gap · action · units · roles · verified_in · met_object_id | 77 |
| Claims | `atlas/data/register/claims_v0.csv` | id · unit · topic · claim · confidence · confidence_note · source · from | 110 |
| Practices | `atlas/data/register/practices_v0.csv` | id · practice · holders · places · source · status · units | 12 |
| Sources (zero-cost routes) | `atlas/data/sources/sources_zero_cost.csv` | id · name · type · covers_worlds · covers_sub_regions · access · cost · licence_content · licence_metadata · commercial_safe · what_it_fills · known_limits · verified · verification_url · notes | 198 |
| Primary texts | `atlas/data/sources/primary_texts.csv` | id · title · author_or_maker · date · world · units · language · original_status · best_free_translation · translation_status · where_free · notes | 130 |
| Harvested | `atlas/data/harvested/`, `atlas/data/matches/` | Written by the harvest jobs as proposals; nothing is accepted until a person merges the pull request | — |
| Assets | not yet a file | id · type · source · licence · licence class · units · alt text status · checked on | — |
| Cross-module links | not yet a file | from · to · kind (prepares, reuses case, reuses engine, depends on) · what must stay true | 11 (in Phase 4 Foundations) |

## Id prefixes outside the canon

| Prefix | Register |
|---|---|
| WS- | World set object |
| CL- | Claim |
| PR- | Practice |
| AS- | Asset |
| TXT | Primary text |
| SRC ids in `sources_zero_cost.csv` | Source route |

## Rules every register follows

- **Identifiers are never typed.** Wikidata, Getty, Pleiades and PeriodO ids come from a harvest as proposals, and a person accepts each one.
- **Licences and listings come from the source**, record by record, and are re-checked monthly and each 2 January.
- **The 1970 test** decides whether an archaeological object can be an exemplar. It is split into the test itself, a history gap, a colonial-context screen and an export-law line (Q19).
- **Confidence has four levels:** documented, probable, contested (give both readings), interpretive.
- **Sensitivity:** never human remains, sacred or secret material, or what a descendant community asks not to show. Other grave goods and altar objects are shown with their origin and a content note. People are never described as goods.

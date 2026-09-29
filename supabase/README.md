# Supabase: the CWB project

The Creative World content also lives in the Supabase project **CWB** (ref `fnporngcnrxqklpstjuu`, organisation malfalasi-Rumour), as searchable tables. The repository is the source; the database is a copy you can query.

## Tables

| Table | Rows | Contents |
|---|---|---|
| `canon_nodes` | 4,228 | The canon register (the 22 columns of `schema/canon-node.schema.json`, with `start`/`end` renamed `start_year`/`end_year`, plus `source_file`) |
| `f1_world_set` | 77 | F1 objects, with holder, licence and 1970 test |
| `f1_claims` | 110 | F1 claims, with confidence |
| `f1_practices` | 12 | F1 living practices |
| `f1_source_routes` | 198 | Zero-cost source routes |
| `f1_primary_texts` | 130 | Primary texts on making |
| `program_modules` | 31 | The module registry |
| `documents` | 78 | Every document, spec, brief, page and README as full text, plus the mockup artboards (HTML). Full-text index on title and content |
| `schemas` | 5 | The JSON schemas and registries |
| `repo_files` | 270 | Every file in the repository at export, with its size and sha256 |

Every table has row-level security on and no policies, so nothing is public. Only the dashboard, the service role and connected tools can read the tables. PDFs, images and code are not stored in the database; they stay in the repository.

## Loading

- `migrations/`: the table definitions, already applied to CWB.
- `seed/`: 85 files. Each inserts one batch and skips rows that are already there, so loading twice is harmless.
- `verify/` and `seed/expected.json`: one check query per seed file, and the row count and hash it must return.

**Status on 29 September 2026:** 31 of the 85 seed files are loaded and verified (1,329 canon nodes, 24 documents, and every row of claims, practices, modules and the file manifest). The other 54 could not be loaded from the chat: long text sent through a chat tool call was stopped or cut off. They need a direct route, either of these:

1. **From your computer (about a minute):** copy the connection string from Supabase → Project Settings → Database, with your database password. Then run, from this folder:
   ```bash
   cd seed && psql "postgresql://postgres:<password>@db.fnporngcnrxqklpstjuu.supabase.co:5432/postgres" -f load_all.sql
   ```
2. **From GitHub:** once the repository is on GitHub, the database can fetch each seed file itself through the `http` extension. Tell Claude, and it will run one short statement per file and verify each one.

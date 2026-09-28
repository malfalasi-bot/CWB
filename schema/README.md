# Schema

The program-wide structures every module uses. The JSON files are machine-readable (JSON Schema 2020-12 where they describe records). The Markdown files are the rules people follow.

| File | What it defines | Source of truth |
|---|---|---|
| `program.json` | Levels, modules and unit counts; lanes, depths, routes; gates; the six threads; partner voices; presentation forms | Master Structure v2.1, Final Structure v3.0, the Program Hub |
| `concept-dna.schema.json` | The Concept DNA, the one artifact every learner builds: 23 field codes, 12 grammar sub-codes, and the shape of an entry | Master Structure v2.1, "The artifact schema" |
| `src-entry.schema.json` | One entry in the sources record (SRC); fields marked `x-depth` O, P or M show when each appears | Phase 4 Foundations, SRC schema option C |
| `canon-node.schema.json` | One canon node, the thing the Atlas points to: 22 columns, 26 id prefixes, 46 sub-regions, 11 period bands, 12 functions, sensitivity values | Generated from `modules/F1-histories-of-making/atlas/tools/codes.py` by `tools/build_schema.py`. Do not edit it by hand |
| `licence-classes.json` | The six licence classes and what each allows in the open and the commercial build | Decision Q39 |
| `registers.md` | Every register, its file, its columns and its row count | Phase 4 Foundations, items 5 and 6 |
| `unit-spec-template.md` | Template v3 for every unit spec, with the writing standard | F1 Round 2; F1.17 exemplar |

CI checks that `canon-node.schema.json` matches the vocabularies, and that every canon row matches its id pattern and kind.

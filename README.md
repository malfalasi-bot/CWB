# Creative World

Creative World is a self-paced design-education program about world-building. It is for makers, and for the people who brief them: brand and marketing leads, founders and commissioning clients. Every unit has two lanes, **Maker** and **Briefer**, and three depths: Orientation, Practice and Mastery. Every learner builds one artifact, the **Concept DNA**, which the units write into field by field. AI partner voices with declared agendas work alongside the learner: the Historian, the Mirror, the Client, the Fabricator, the Planet and the Stranger.

This repository holds the whole program: its documents, its schema, and each module's content and data. F1 is the first module in production.

## Layout

| Folder | What it holds |
|---|---|
| [`docs/`](docs/README.md) | Program documents in the order they were made: origins, the structures, the Hub, Phase 4 Foundations, the glossary and the partner-voice packs. Each is in Markdown and PDF, with a link to the live document |
| [`schema/`](schema/README.md) | Program-wide structures: the program and module registry, the Concept DNA, the sources record (SRC), the canon node, licence classes, registers and the unit spec template |
| [`modules/`](modules/) | One folder per module. Each holds its documents, specs, data and design |
| [`modules/F1-histories-of-making/`](modules/F1-histories-of-making/README.md) | F1: 10 documents, 8 unit specs, 8 grouping pages (5 as files, 3 inside Groundwork), the Atlas data (4,228 canon nodes, 77 objects, 110 claims, 198 source routes, 130 primary texts), harvesters, mockups |
| [`design/`](design/README.md) | Program-level design references |
| `tools/` | Program-level tools: the schema generator and tests, and the converter that exports Claude Docs tabs to Markdown |
| `.github/workflows/` | Checks on every change, and the F1 Atlas harvest, which runs monthly and each 2 January and opens a pull request |

## The program at a glance

| Level | Modules |
|---|---|
| 0 Orientation | O1 How to see |
| 1 Foundations | F1 Histories of making · F2 Form · F3 Body and senses · F4 Material and meaning · F5 Systems and consequences |
| 2 Method | M1 Research and premise · M2 Concept DNA · M3 World architecture · M4 Make and test |
| 3 Practice areas | S1 Space and experience · S2 Object and product · S3 Body and wearables · S4 Art and installation · S5 Identity and communication · S6 Digital product and interface |
| Tools | T1–T10, from seeing and drawing to fabrication |
| 4 Venture and release | R1 The world as venture · R2 Money, law and rights · R3 Making it real · R4 Responsibility · R5 Defence and dossier |

Unit counts, threads, forms and codes are in [`schema/program.json`](schema/program.json).

## Status (29 September 2026)

- **Program:** gate G1 passed on 28 September 2026, and phase 4 is under way. The Hub is the one place status, decisions and open questions change. Open decisions are Q1–Q27, Q29–Q37, Q39–Q43 and P1–P11.
- **F1:** 35 units at structure v3.6. All deep dives are done, and spec batch 1 covers 8 units. Next are spec batches 2 and 3, the five other partner-voice packs, the first harvest run, then G2 and G3.
- **Other modules:** not started. M2 comes next, then S2, once F1 has proven the method.

## Working rules

1. **One hub.** Status and decisions change only in the Program Hub (live in Claude Docs; exported in `docs/02-program/hub/`).
2. **Zero cost.** Research, sources and visuals use free and open sources only. Nothing is hosted unless its licence allows it; everything else is linked. See `schema/licence-classes.json`.
3. **Facts are harvested, not typed.** Identifiers, licences and UNESCO status come from the source's own data, and a person accepts each one.
4. **Sensitivity.** Never show human remains, sacred or secret material, or what a descendant community asks not to show. People are never described as goods.
5. **Documents are exported, not edited here.** The live documents stay in Claude Docs. When one changes, it is exported again: `tools/docs_xml_to_md.py` converts a tab, and `docs/_export/manifest.jsonl` records the source revision.

## Running the checks

```bash
python -m unittest tools/test_schema.py          # schema valid and in sync with the data
cd modules/F1-histories-of-making/atlas
python tools/test_tools.py && (cd harvest && python test_harvest.py)
python tools/validate_canon.py                    # errors block a change; warnings are for review
python tools/coverage.py
```

Python 3.9 or later, standard library only (PyYAML is needed only to lint the workflows).

## Licence

Not yet decided (decision Q43). The recommendation is CC BY 4.0 for our text and data and MIT for our code. Until then, our own text, data and code are all rights reserved. Source data keeps its own licences, listed in `modules/F1-histories-of-making/atlas/DATA_LICENCES.md`.

insert into public.documents ("path", "title", "kind", "module", "format", "artifact_url", "docs_id", "tab_name", "rev", "content", "pdf_path", "sha256")
select public.cw_text(x->0), public.cw_text(x->1), public.cw_text(x->2), public.cw_text(x->3), public.cw_text(x->4), public.cw_text(x->5), public.cw_text(x->6), public.cw_text(x->7), public.cw_text(x->8), public.cw_text(x->9), public.cw_text(x->10), public.cw_text(x->11)
from jsonb_array_elements($cwb$[
[
"README.md",
"Creative World",
"readme",
"program",
"md",
"",
"",
"",
"",
[
"# Creative World\n\nCreative World is a self-paced design-education program about world-building. It is for makers, and for the people who brief them: brand and marketing leads, founders and commissioning clients. Every unit has two lanes, **Maker** and **Briefer**, and three depths: Orientation, Practice and Mastery. Every learner builds one artifact, the **Concept DNA**, which the units write into field by field. AI partner voices with declared agendas work alongside the learner: the Historian, the Mirror, the Client, the Fabricator, the Planet and the Stranger.\n\nThis repository holds the whole program: its documents, its schema, and each module's content and data. F1 is the first module in production.\n\n## Layout\n\n| Folder | What it holds |\n|---|---|\n| [`docs/`](docs/README.md) | Program documents in the order they were made: origins, the structures, the Hub, Phase 4 Foundations, the glossary and the partner-voice packs. Each is in Markdown and PDF, with a link to the live document |\n",
"| [`schema/`](schema/README.md) | Program-wide structures: the program and module registry, the Concept DNA, the sources record (SRC), the canon node, licence classes, registers and the unit spec template |\n| [`modules/`](modules/) | One folder per module. Each holds its documents, specs, data and design |\n| [`modules/F1-histories-of-making/`](modules/F1-histories-of-making/README.md) | F1: 10 documents, 8 unit specs, 8 grouping pages (5 as files, 3 inside Groundwork), the Atlas data (4,228 canon nodes, 77 objects, 110 claims, 198 source routes, 130 primary texts), harvesters, mockups |\n| [`design/`](design/README.md) | Program-level design references |\n| `tools/` | Program-level tools: the schema generator and tests, and the converter that exports Claude Docs tabs to Markdown |\n| `.github/workflows/` | Checks on every change, and the F1 Atlas harvest, which runs monthly and each 2 January and opens a pull request |\n\n## The program at a glance\n\n| Level | Modules |\n|---|---|\n| 0 Orientation | O1 How to see |\n| 1 Foundations | F1 Histories of making · F2 Form · F3 Body and senses · F4 Material and meaning · F5 Systems and consequences |\n",
"| 2 Method | M1 Research and premise · M2 Concept DNA · M3 World architecture · M4 Make and test |\n| 3 Practice areas | S1 Space and experience · S2 Object and product · S3 Body and wearables · S4 Art and installation · S5 Identity and communication · S6 Digital product and interface |\n| Tools | T1–T10, from seeing and drawing to fabrication |\n| 4 Venture and release | R1 The world as venture · R2 Money, law and rights · R3 Making it real · R4 Responsibility · R5 Defence and dossier |\n\nUnit counts, threads, forms and codes are in [`schema/program.json`](schema/program.json).\n\n## Status (29 September 2026)\n\n- **Program:** gate G1 passed on 28 September 2026, and phase 4 is under way. The Hub is the one place status, decisions and open questions change. Open decisions are Q1–Q27, Q29–Q37, Q39–Q43 and P1–P11.\n- **F1:** 35 units at structure v3.6. All deep dives are done, and spec batch 1 covers 8 units. Next are spec batches 2 and 3, the five other partner-voice packs, the first harvest run, then G2 and G3.\n- **Other modules:** not started. M2 comes next, then S2, once F1 has proven the method.\n\n## Working rules\n\n",
"1. **One hub.** Status and decisions change only in the Program Hub (live in Claude Docs; exported in `docs/02-program/hub/`).\n2. **Zero cost.** Research, sources and visuals use free and open sources only. Nothing is hosted unless its licence allows it; everything else is linked. See `schema/licence-classes.json`.\n3. **Facts are harvested, not typed.** Identifiers, licences and UNESCO status come from the source's own data, and a person accepts each one.\n4. **Sensitivity.** Never show human remains, sacred or secret material, or what a descendant community asks not to show. People are never described as goods.\n5. **Documents are exported, not edited here.** The live documents stay in Claude Docs. When one changes, it is exported again: `tools/docs_xml_to_md.py` converts a tab, and `docs/_export/manifest.jsonl` records the source revision.\n\n## Running the checks\n\n```bash\npython -m unittest tools/test_schema.py          # schema valid and in sync with the data\ncd modules/F1-histories-of-making/atlas\npython tools/test_tools.py && (cd harvest && python test_harvest.py)\npython tools/validate_canon.py                    # errors block a change; warnings are for review\n",
"python tools/coverage.py\n```\n\nPython 3.9 or later, standard library only (PyYAML is needed only to lint the workflows).\n\n## Licence\n\nNot yet decided (decision Q43). The recommendation is CC BY 4.0 for our text and data and MIT for our code. Until then, our own text, data and code are all rights reserved. Source data keeps its own licences, listed in `modules/F1-histories-of-making/atlas/DATA_LICENCES.md`.\n"
],
"",
"fa9042bc3e830231ce65d2f6bc7b07c8796693d9b986cda39b8137e06af2cbd3"
],
[
"design/README.md",
"Design",
"readme",
"program",
"md",
"",
"",
"",
"",
[
"# Design\n\nProgram-level design references. Module mockups sit inside their module; F1's are in `modules/F1-histories-of-making/design/mockups/`.\n\n## Earlier design work in Dropbox (not copied here)\n\nThe Rumour Creative Studio Dropbox holds a folder of earlier design work for the course, dated 21 August 2026: `/Rumour_TS Projects/CWB Course`. This workspace cannot download from Dropbox's file servers, so the files are not in this repository yet. To add them, drop the folder into `design/cwb-course-2026-08/` and commit it.\n\n| File | Size |\n|---|---|\n| PHASE1_AUDIT_AND_ARCHITECTURE.md | 34 KB |\n| creative-direction-and-design-system.html | 65 KB |\n| design-language-v2.html · v3.html | 51 KB · 43 KB |\n| studio-prototype-v4.html · v5-audited.html · v6-interactive.html | 59 KB · 72 KB · 95 KB |\n| visual-direction-v7-photographic.html · v9-master.html · v10-atlas.html | 81 KB · 150 KB · 87 KB |\n| proof-plates-v8.html · photography-content-program-v8.html | 38 KB · 63 KB |\n| design-system-v11-codex.html | 72 KB |\n| the-studio-complete-v12.html | 1.4 MB |\n| atds-brand-design-system-v13.html · v14.html | 1.5 MB · 1.5 MB |\n| atds-visual-language-v15.html · v16.html | 1.6 MB · 1.9 MB |\n\n",
"Decision C2 (archive-warm design language, or yours?) is still open. These files are the \"yours\" option.\n"
],
"",
"8d5987ab65f6116f34cdfbb4a0e1a54d7b5dcb9c9419f263d1c1a9caa78ff8b9"
]
]$cwb$::jsonb) x
on conflict ("path") do nothing;

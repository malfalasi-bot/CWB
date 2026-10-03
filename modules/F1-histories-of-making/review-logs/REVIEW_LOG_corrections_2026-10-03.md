# Review log: program-document and canon corrections, 2026-10-03

Task "Program-document and canon corrections". Applies the open corrections listed in `AUDIT_2026-10-02.md` §1.4, `specs/BATCH2_OVERVIEW.md`, `specs/BATCH3_OVERVIEW.md`, the batch 4–5 brief (`SPEC_BRIEF_BATCH4_5.md`, "What batch 4 found") and sections 4, 9 and 10 of the batch 4–5 specs (F1.5–F1.13, F1.9a, F1.12a, F1.17; scratchpad `f1-scope/specs/`). "F1.x spec §n" means that spec's section n; F1.27, F1.29 and F1.30 are the batch 3 specs in `specs/`.

Method. CSVs edited with Python's `csv` module (QUOTE_MINIMAL, original line endings; every file round-trips unchanged apart from the edited cells). `claims_v0.json` and `world_set_v0.json` were updated to match their CSVs. Where a source only says "unverified" or "check", the fact is left as it is: the row gets "Under review 3 Oct 2026: …" in `notes` (canon, sources), `confidence_note` (claims) or `action` (world set), and its confidence drops one word (high→medium, medium→low; claims documented→probable). After the edits `tools/validate_canon.py` reports 0 errors (82 warnings, as before), and `tools/test_schema.py` and `atlas/tools/test_tools.py` pass. Only the Markdown exports of the program documents were edited; their PDFs and the live Claude Docs versions still carry the old text. Nothing was committed.

Verified at source on 3 October 2026: the Open Khipu Repository's LICENSE (MIT, © 2022 Open Khipu Repository Team; https://github.com/khipulab/open-khipu-repository/blob/master/LICENSE); the Making and Knowing edition's licence (CC BY-NC-SA 4.0; https://edition640.makingandknowing.org/); Al Sadu's status (UNESCO decision 20.COM 7.C.1: transferred from the Urgent Safeguarding List, 2011, 6.COM 8.21, to the Representative List, and the safeguarding programme selected for the Register; https://ich.unesco.org/en/decisions/20.COM/7.C.1). Every other change rests on the source named in its row.

Format: id or document | field | old | new | source | reason

## 1. Program documents

| Document | Field (place) | Old | New | Source | Reason |
|---|---|---|---|---|---|
| `modules/F1-histories-of-making/docs/03-module-file/index.md` | Finding 2.4, Effect column | One caution: ‹cite index="45-1"›use of the Labels is subject to a licensing fee‹/cite› according to one institutional guideline, to be verified with Local Contexts before adoption | Checked with Local Contexts (SRC142): Labels are free and for Indigenous communities only, so the programme can never apply a Label; Notices need an institutional Hub subscription from 2025, with free Individual and Collections Care tiers | AUDIT_2026-10-02.md §1.4; specs/BATCH3_OVERVIEW.md; SRC142 (https://localcontexts.org/hub-agreements/subscribers/) | Local Contexts: Labels free and community-only; Notices need a Hub subscription from 2025 |
| `modules/F1-histories-of-making/docs/03-module-file/index.md` | "Protocol frameworks adopted" table, Local Contexts row | until a community's own Labels exist; licensing terms for Labels to be verified before adoption | until a community's own Labels exist; Labels are applied only by communities, never by the programme; Notices need an institutional Hub subscription from 2025 (free Individual and Collections Care tiers), and the icons may not be altered (SRC142) | AUDIT_2026-10-02.md §1.4; specs/BATCH3_OVERVIEW.md; SRC142 | Same; icons may not be altered |
| `modules/F1-histories-of-making/docs/03-module-file/index.md` | Finding 5.1, Effect column | The exact Creative Commons variant is checked per item before use | The licence is CC BY-NC-SA 4.0 (SRC104, verified), which is not open under our rule | AUDIT_2026-10-02.md §1.4; specs/BATCH3_OVERVIEW.md; F1.29 spec §10 item 7; SRC104 | EMKP is CC BY-NC-SA 4.0, not open under our rule |
| `modules/F1-histories-of-making/docs/03-module-file/index.md` | Finding 6.1, Finding column | over 900 recipes for making art objects, remedies and household and workshop materials‹/cite›, | over 900 recipes for making art objects, remedies and household and workshop materials‹/cite› (a figure not found on any page opened on 2 October 2026), | specs/BATCH3_OVERVIEW.md | "Over 900 recipes" not found on any page opened; quotation kept, flagged |
| `modules/F1-histories-of-making/docs/03-module-file/index.md` | Finding 6.1, Effect column | Content licence of the edition to verify; its software is ‹cite index="121-1"›MIT-licensed‹/cite› | The edition's content is CC BY-NC-SA 4.0, which is not open under our rule; MIT covers only its software, EditionCrafter | AUDIT_2026-10-02.md §1.4; specs/BATCH3_OVERVIEW.md; https://edition640.makingandknowing.org/ (read 3 Oct 2026: "Licensed under CC BY-NC-SA 4.0") | Content is CC BY-NC-SA 4.0; MIT is EditionCrafter only |
| `modules/F1-histories-of-making/docs/03-module-file/index.md` | Data sources table, Smithsonian Open Access row | \| Smithsonian Open Access \| API with key; CC0 | \| Smithsonian Open Access \| API with key; licence varies by record (CC0 only where marked) | AUDIT_2026-10-02.md §1.4 ("Smithsonian licences vary by record"); SPEC_BRIEF_BATCH4_5.md, "What batch 4 found"; F1.29 spec §10 item 3 | Same correction as PRA044, applied to the module file's own blanket "CC0" |
| `modules/F1-histories-of-making/docs/03-module-file/index.md` | Research log, "Deep Dives 2 and Atlas Logic" findings, item (2) | (2) Cleveland's CC0 set has no barkcloth, chintz, batik, ikat or Ordos bronzes; | (2) Cleveland's CC0 set has no barkcloth, chintz, batik or ikat (it does hold Ordos bronzes: nine CC0 records, including 1952.115, 1962.46 and 1916.1189); | specs/BATCH3_OVERVIEW.md (steppe: "WS-104 and Deep Dives 2 finding (2)"); F1.12a spec §5, §10 | Cleveland does hold CC0 Ordos bronzes |
| `docs/02-program/phase-4-foundations/index.md` | Oral History Association practice row, cite 163-1 | ‹cite index="163-1"›oral histories are co-created, and copyright is usually held by both interviewer and narrator until they agree otherwise‹/cite› | the OHA's Statement on Ethics (October 2018) names the narrator as "the original recording's copyright holder" | AUDIT_2026-10-02.md §1.4; specs/BATCH3_OVERVIEW.md; F1.29 spec claim 3 and §10 item 5 (OHA Statement on Ethics, https://oralhistory.org/wp-content/uploads/2025/12/2025-OHA-PrinciplesBP_Statement-on-Ethics.pdf) | OHA (2018) names the narrator as copyright holder; the cited reading was wrong |
| `docs/02-program/phase-4-foundations/index.md` | Oral History Association practice row, design consequence (the Oral History Kit) | consent before recording, a review step, restrictions, and co-ownership stated on the form | consent before recording, a review step, restrictions, and the narrator's copyright stated on the form. The Kit's withdrawal route is our own rule, resting on consent law and UNESCO's "sustained" consent; no OHA text names one | AUDIT_2026-10-02.md §1.4; specs/BATCH3_OVERVIEW.md; F1.29 spec §10 items 5–6 | Kit form reworded to the narrator's copyright; withdrawal route labelled our own rule |
| `docs/02-program/phase-4-foundations/index.md` | Registers table, Practices row (PR-001) | PR-001 Al Sadu weaving, United Arab Emirates, UNESCO Register of Good Safeguarding Practices 2025, regional slot | PR-001 Al Sadu weaving, United Arab Emirates, UNESCO Urgent Safeguarding List 2011 and Representative List 2025 (its safeguarding programme, 2011–2023, is the separate 2025 Register entry), regional slot | AUDIT_2026-10-02.md §1.4; specs/BATCH3_OVERVIEW.md; F1.10 spec §10; https://ich.unesco.org/en/decisions/20.COM/7.C.1 (read 3 Oct 2026) | Al Sadu (element) separated from its safeguarding programme (Register) |

`<cite>` tags are shown as ‹cite› here so the table renders.

## 2. The "calendar or era" kind

| File | Field (place) | Old | New | Source | Reason |
|---|---|---|---|---|---|
| `tools/build_schema.py` | PREFIXES, PRD | `"PRD": ["period"]` | `"PRD": ["period", "calendar-or-era"]` | AUDIT_2026-10-02.md §1.4 ("Canon kind"); specs/BATCH3_OVERVIEW.md (table, "Canon kinds"); F1.30 spec §4, §10 | Kinds are generated from this map; F1.30 puts the kind in the Time family, whose rows carry the PRD prefix |
| `schema/canon-node.schema.json` | kind enum; x-prefixes.PRD | 24 kinds; PRD: period | adds `calendar-or-era`; PRD: period, calendar-or-era | AUDIT_2026-10-02.md §1.4 ("Canon kind"); specs/BATCH3_OVERVIEW.md (table, "Canon kinds"); F1.30 spec §4, §10 | Regenerated with `python tools/build_schema.py` (not edited by hand); `--check` passes |
| `modules/F1-histories-of-making/atlas/README.md` | `data/canon/` row | 4,228 nodes in 24 kinds … people, places, events and period definitions | 4,228 nodes in 25 kinds … people, places, events, period definitions, and calendars and eras | AUDIT_2026-10-02.md §1.4 ("Canon kind"); specs/BATCH3_OVERVIEW.md (table, "Canon kinds"); F1.30 spec §4, §10 | Canon README kind list |
| `modules/F1-histories-of-making/docs/06-atlas-logic/index.md` | "The grouping families": count and Time rows | F1 can use twenty kinds of grouping, in seven families. (no calendar row) | twenty-one kinds; new row: Time \| Calendar or era \| Dated by a named reckoning of years: a calendar, an era or a reign-name system \| The courts, religious traditions and astronomers who kept it \| Chinese reign eras (nianhao); the Kali Yuga \| Timeline, with the original date beside its CE range | AUDIT_2026-10-02.md §1.4 ("Canon kind"); specs/BATCH3_OVERVIEW.md (table, "Canon kinds"); F1.30 spec §4, §10 | The information model's kind table |

Rows reclassified (only the two F1.30 names): PRD107 and PRD153, `kind` period → calendar-or-era (listed in section 3).

## 3. Canon and registers

| id | File | Field | Old | New | Source | Reason |
|---|---|---|---|---|---|---|
| GAP072 | canon/canon_additions_round2.csv | date_note | a predecessor trade body from 1868; the name Chambre Syndicale de la Haute Couture from 1911 (to verify) | a predecessor trade body from 1868; the Chambre Syndicale de la Couture Parisienne from 14 December 1910 | specs/BATCH2_OVERVIEW.md | Founding date of the Chambre Syndicale corrected |
| GAP072 | canon/canon_additions_round2.csv | other_names | Chambre Syndicale de la Haute Couture | Chambre Syndicale de la Haute Couture;Chambre Syndicale de la Couture Parisienne | specs/BATCH2_OVERVIEW.md | Name of the 1910 body |
| GAP073 | canon/canon_additions_round2.csv | start | 1852 | 1838 | specs/BATCH2_OVERVIEW.md | Le Bon Marché founded 1838; 1852 is when Boucicaut became a partner |
| GAP073 | canon/canon_additions_round2.csv | date_note | the expansion of Le Bon Marché, Paris, from 1852 is often cited | Le Bon Marché, Paris, founded 1838; Boucicaut became a partner in 1852 | specs/BATCH2_OVERVIEW.md | Same |
| OBT042 | canon/canon_object_types.csv | start | 1880 | 1860 | specs/BATCH2_OVERVIEW.md | Kanga demand grew by the 1860s; 1880 too late |
| OBT042 | canon/canon_object_types.csv | date_note | Emerged late 19th century on the Swahili coast | Demand on the Swahili coast grew by the 1860s | specs/BATCH2_OVERVIEW.md | Same |
| STY122 | canon/canon_movements_styles_schools.csv | materials_techniques | watercolour on mill paper | gum tempera on mill paper | specs/BATCH2_OVERVIEW.md; F1.9 spec §10 | Kalighat painting is gum tempera, not watercolour |
| OCC217 | canon/canon_events.csv | date_note | 1942–1952 | designed from 1941; first catalogue 1943; scheme to 1952 | specs/BATCH2_OVERVIEW.md | Utility furniture designed from 1941, first catalogue 1943 |
| OCC141 | canon/canon_events.csv | name | Long Walk of the Navajo (1864–1868) | Hwéeldi and the Long Walk (1863–1868) | specs/BATCH3_OVERVIEW.md; F1.7 spec §10 | Lead with the Diné name; removal starts fall 1863 |
| OCC141 | canon/canon_events.csv | other_names | Bosque Redondo | Long Walk of the Navajo; Bosque Redondo | specs/BATCH3_OVERVIEW.md | Former name kept as other name |
| OCC141 | canon/canon_events.csv | start | 1864 | 1863 | specs/BATCH3_OVERVIEW.md; F1.7 spec §10 | Forced removal starts in fall 1863 |
| OCC141 | canon/canon_events.csv | date_note | 1864–1868 | forced removal from fall 1863; return 1868 | specs/BATCH3_OVERVIEW.md | Same |
| OCC141 | canon/canon_events.csv | making_significance | US forced removal of the Navajo to Bosque Redondo led weavers to use commercial yarns and trade goods, and later reservation trading posts reshaped Navajo weaving for the market. | US forced removal of the Diné to Bosque Redondo (Hwéeldi); after 1868 weavers gained access to brightly coloured manufactured yarns, and later reservation trading posts reshaped Diné weaving for the market. | specs/BATCH2_OVERVIEW.md; specs/BATCH3_OVERVIEW.md; F1.7 spec §9 (claim 24, NMNH record) | Unsourced claim that the Long Walk led weavers to commercial yarn replaced by the narrower statement NMNH supports (yarns after 1868) |
| OCC175 | canon/canon_events.csv | name | Benin punitive expedition (1897) | Sack of Benin City (1897) | specs/BATCH2_OVERVIEW.md; F1.6 spec §10 | "Punitive expedition" is the perpetrators' term |
| OCC175 | canon/canon_events.csv | other_names | Sack of Benin City | British "punitive expedition" (the perpetrators' term) | specs/BATCH2_OVERVIEW.md | Term kept only in quotation marks, attributed |
| DYN005 | canon/canon_dynasties.csv | making_significance | Ramesside kings built Abu Simbel and the Ramesseum, and the royal tomb-builders of Deir el-Medina staged the first recorded strike (c. 1157 BCE). | Ramesside kings built Abu Simbel and the Ramesseum, and the royal tomb-builders of Deir el-Medina staged the earliest known recorded strike (c. 1157 BCE). | specs/BATCH2_OVERVIEW.md; F1.11 spec §10 | Rule 6: earliest known, not first |
| MKR090 | canon/canon_makers_institutions.csv | making_significance | The village of craftsmen who cut and painted the royal tombs left ostraca recording work rotas, pay in grain and the first recorded strike (under Ramesses III). | The village of craftsmen who cut and painted the royal tombs left ostraca recording work rotas, pay in grain and the earliest known recorded strike (under Ramesses III). | specs/BATCH2_OVERVIEW.md; F1.11 spec §10 | Rule 6: earliest known, not first |
| OCC055 | canon/canon_events.csv | making_significance | After taking Tabriz and Cairo, Selim I moved painters, tile makers, weavers and other craftsmen to Istanbul, feeding the court workshops. | After taking Tabriz and Cairo, Selim I moved painters, tile makers, weavers and other craftsmen to Istanbul ("brought", in the source; historians also call it deportation), feeding the court workshops. | specs/BATCH2_OVERVIEW.md | Give both readings |
| MOV096 | canon/canon_movements_styles_schools.csv | date_note | approx.; manifesto 1926 | approx.; 1925 (museum's date) or 1926 (manifesto) | specs/BATCH2_OVERVIEW.md | Mingei dated 1925 by the museum, 1926 in the canon: both given |
| MKR047 | canon/canon_makers_institutions.csv | end | 1850 | (empty) | specs/BATCH2_OVERVIEW.md; F1.9 spec §10 | End date of 1850 wrong: jamdani weaving continues |
| MKR047 | canon/canon_makers_institutions.csv | date_note | approx. | approx.; jamdani weaving continues today | specs/BATCH2_OVERVIEW.md; F1.9 spec §10 | Same |
| MKR047 | canon/canon_makers_institutions.csv | making_significance | Weavers made extremely fine muslin from local cotton; British competition and colonial policy destroyed the trade. | Weavers made extremely fine muslin from local cotton; one reading holds that British competition and colonial policy destroyed the trade. | F1.9 spec §10 | "Destroyed the trade" is one reading (claim 22, contested) |
| PR-001 | register/practices_v0.csv | source | UNESCO Register of Good Safeguarding Practices 2025 | UNESCO Urgent Safeguarding List 2011 (6.COM 8.21); Representative List 2025 (20.COM 7.C.1). The 2025 Register of Good Safeguarding Practices entry is the separate safeguarding programme (2011–2023) | specs/BATCH3_OVERVIEW.md; F1.10 spec §10; https://ich.unesco.org/en/decisions/20.COM/7.C.1 (read 3 Oct 2026) | Element and its safeguarding programme were conflated |
| PRA044 | canon/canon_practices.csv | free_sources | Smithsonian Open Access (CC0); Wikimedia Commons; community-published site | Smithsonian Open Access (licence varies by record; CC0 only where marked); Wikimedia Commons; community-published site | specs/BATCH3_OVERVIEW.md; F1.29 spec §10 | Smithsonian licences vary record by record; not blanket CC0 |
| INV037 | canon/canon_firsts.csv | name | paper outside China | paper mill (Islamic world) | specs/BATCH3_OVERVIEW.md; F1.5 spec §4; F1.10 spec §10 | Baghdad is not the earliest paper outside China |
| INV037 | canon/canon_firsts.csv | date_note | Baghdad mill c. 794; Samarkand earlier by tradition | Baghdad mill 794–95; Samarkand probably made paper earlier (Bloom) | specs/BATCH3_OVERVIEW.md | Same |
| INV037 | canon/canon_firsts.csv | making_significance | First known paper production outside China, in the Abbasid world. | The earliest documented paper mill in the Islamic world, at Baghdad, 794–95; Central Asia made paper earlier. | F1.5 spec §4; F1.10 spec §10 | Rewrite given in both specs |
| CL-156 | register/claims_v0.csv | claim | The first paper mill in Islamic lands was set up in Baghdad in 794–95; paper then spread to Syria, Iran, Central Asia, Egypt and North Africa, and to Europe through Spain and Sicily | The earliest documented paper mill in Islamic lands was set up in Baghdad in 794–95, after Central Asia already had paper; paper then spread to Syria, Iran, Egypt and North Africa, and to Europe through Spain | specs/BATCH3_OVERVIEW.md; F1.10 spec §10 | Direction reversed (Central Asia had paper before Baghdad); Sicily not in Bloom as read |
| TEC185 | canon/canon_techniques.csv | start | 750 | 700 | F1.27 spec §4 (repo spec); specs/BATCH3_OVERVIEW.md; F1.10 spec §10 | Start of 750 encoded the Talas legend; use the Panjikent archive (before 722) |
| TEC185 | canon/canon_techniques.csv | date_note | traditionally linked to Talas 751 (contested); Baghdad paper by c.794 | approx.; paper in Sogdian Central Asia before 722 (Panjikent archive); the Talas (751) story is a contested legend; Baghdad mill 794–95 | F1.27 spec §4 | Same |
| TEC186 | canon/canon_techniques.csv | start | 1150 | 975 | specs/BATCH3_OVERVIEW.md; F1.11 spec §10 | c. 1150 is late |
| TEC186 | canon/canon_techniques.csv | date_note | Xàtiva c.1150s; Fabriano watermarks late 13th c. | paper in Spanish manuscripts by the late 10th c. (Bloom); Xàtiva mills c. 1050 (Mariani); Fabriano watermarks late 13th c. | specs/BATCH3_OVERVIEW.md; F1.11 spec §10 | Same |
| INV038 | canon/canon_firsts.csv | notes | Not "paper" in the Chinese pulp sense; beater dating uncertain. | Not "paper" in the Chinese pulp sense; beater dating uncertain. Under review 3 Oct 2026: a source dates bark beaters to the 6th century CE, against this row's early 1st millennium CE or earlier. | specs/BATCH3_OVERVIEW.md | unverified or open: fact left as it is, flagged |
| DIA001 | canon/canon_networks.csv | date_note | Ancient Letters c.313 CE; to 8th c. | Ancient Letters 312–314 CE; to 8th c. | specs/BATCH3_OVERVIEW.md | "c. 313" should read 312–314 |
| PRA093 | canon/canon_practices.csv | notes | UNESCO status not confirmed. | Nominated to UNESCO; decision due at the 21st Committee (December 2026). | specs/BATCH3_OVERVIEW.md; F1.8 spec §10 | Status stated |
| PRA094 | canon/canon_practices.csv | date_note | Inscribed 2014 (Sekishu-Banshi, Hon-Minoshi, Hosokawa-shi; Sekishu-Banshi alone 2009); extended 2025 | Inscribed 2014 (Sekishu-Banshi, Hon-Minoshi, Hosokawa-shi; Sekishu-Banshi alone 2009); UNESCO lists file 02291 as inscribed in 2025 (20.COM); what the 2025 file added is not yet read | SPEC_BRIEF_BATCH4_5.md, "What batch 4 found"; F1.8 spec §9 | Batch 3 "unverified" superseded: verified on UNESCO's page in batch 4 |
| PRA094 | canon/canon_practices.csv | defined_by | UNESCO ICH list (2014) | UNESCO ICH list (2014; 2025) | SPEC_BRIEF_BATCH4_5.md, "What batch 4 found" | Same |
| WS-104 | register/world_set_v0.csv | status | to-source | exemplar | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 (claim 10; §5) | Cleveland does hold CC0 Ordos bronzes; WS-104 resolved to 1958.79 |
| WS-104 | register/world_set_v0.csv | title | Ordos-style animal plaque | Horse, gilt bronze, Ordos region | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 (claim 10; §5) | Cleveland does hold CC0 Ordos bronzes; WS-104 resolved to 1958.79 |
| WS-104 | register/world_set_v0.csv | date | 1st millennium BCE | 202 BCE–220 CE, Han | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 (claim 10; §5) | Cleveland does hold CC0 Ordos bronzes; WS-104 resolved to 1958.79 |
| WS-104 | register/world_set_v0.csv | holder | (empty) | Cleveland | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 (claim 10; §5) | Cleveland does hold CC0 Ordos bronzes; WS-104 resolved to 1958.79 |
| WS-104 | register/world_set_v0.csv | accession | (empty) | 1958.79 | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 (claim 10; §5) | Cleveland does hold CC0 Ordos bronzes; WS-104 resolved to 1958.79 |
| WS-104 | register/world_set_v0.csv | licence | To source | CC0 | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 (claim 10; §5) | Cleveland does hold CC0 Ordos bronzes; WS-104 resolved to 1958.79 |
| WS-104 | register/world_set_v0.csv | holder_and_licence_note | Not in Cleveland's CC0 set; the Met at record level | Cleveland 1958.79, CC0 (Cleveland holds nine CC0 Ordos records) | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 (claim 10; §5) | Cleveland does hold CC0 Ordos bronzes; WS-104 resolved to 1958.79 |
| WS-104 | register/world_set_v0.csv | provenance | — | Leonard C. Hanna Jr. bequest, 1958; no findspot | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 (claim 10; §5) | Cleveland does hold CC0 Ordos bronzes; WS-104 resolved to 1958.79 |
| WS-104 | register/world_set_v0.csv | provenance_test | to-check | pass | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 (claim 10; §5) | Cleveland does hold CC0 Ordos bronzes; WS-104 resolved to 1958.79 |
| WS-104 | register/world_set_v0.csv | test_basis | (empty) | In a museum or documented collection by 1958 | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 (claim 10; §5) | Cleveland does hold CC0 Ordos bronzes; WS-104 resolved to 1958.79 |
| WS-104 | register/world_set_v0.csv | history_gap | (empty) | Before Hanna; findspot; exit from China not recorded | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 (claim 10; §5) | Cleveland does hold CC0 Ordos bronzes; WS-104 resolved to 1958.79 |
| WS-104 | register/world_set_v0.csv | action | (empty) | Exemplar with a content note: such pieces are known mostly from burials (Q21) | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 (claim 10; §5) | Cleveland does hold CC0 Ordos bronzes; WS-104 resolved to 1958.79 |
| PR-017 | register/practices_v0.csv | units | F1.ST | F1.12a | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 | World code "F1.ST" should be F1.12a |
| PLC258 | canon/canon_places.csv | making_significance | The Mongol capital housed artisans taken from conquered cities, including the Parisian goldsmith who made a silver fountain tree. | The Mongol capital housed artisans taken from conquered cities, including the Parisian goldsmith Guillaume Boucher, captured at Belgrade and called a slave by Rubruck, who made a silver fountain tree. | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 | Rubruck: captured at Belgrade, unfree |
| PLC258 | canon/canon_places.csv | notes | links: POL233; MKR092. | links: POL233; MKR092. The excavated "Great Hall" has been re-identified as a Buddhist temple. | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 | Re-identification of the excavated hall |
| PRA160 | canon/canon_practices.csv | making_significance | Kyrgyz women make felt carpets by pressing coloured wool (ala-kiyiz) or cutting and sewing mosaic felt (shyrdak). | Kyrgyz women make felt carpets by pressing coloured wool (ala-kiyiz) or cutting and sewing mosaic felt (shyrdak); UNESCO credits men with preparing the wool and pressing the felt. | specs/BATCH3_OVERVIEW.md; F1.12a spec §10; F1.29 spec §10 | UNESCO credits men too |
| COM209 | canon/canon_communities.csv | making_significance | Kyrgyz women make ala-kiyiz and shyrdak felt carpets and the yurt's fittings. | Kyrgyz women make ala-kiyiz and shyrdak felt carpets and the yurt's fittings, and men prepare the wool and press the felt (UNESCO). | specs/BATCH3_OVERVIEW.md; F1.12a spec §10 | UNESCO credits men too |
| TEC065 | canon/canon_techniques.csv | making_significance | Gold dissolved in mercury was painted on and the mercury driven off by heat, poisoning many gilders. | Gold dissolved in mercury was painted on and the mercury driven off by heat, a hazard to gilders that was known at the time. | specs/BATCH3_OVERVIEW.md | Sources say only that the hazard was known |
| TEC128 | canon/canon_techniques.csv | making_significance | Dried scale insects raised on nopal cactus produce a red that became New Spain's most valuable export after silver. | Dried scale insects raised on nopal cactus produce a red that became one of New Spain's most valuable exports, along with gold and silver. | specs/BATCH3_OVERVIEW.md; F1.7 spec §10 (Phipps) | Phipps: along with gold and silver |
| MAT043 | canon/canon_materials.csv | start | -500 | -100 | specs/BATCH3_OVERVIEW.md; F1.7 spec §10 | Paracas cochineal 1st c. BCE–2nd c. CE, not "first millennium BCE" |
| MAT043 | canon/canon_materials.csv | date_note | Andean textiles first millennium BCE; New Spain export from 1520s | Paracas textiles, 1st c. BCE–2nd c. CE; New Spain export from 1520s | specs/BATCH3_OVERVIEW.md; F1.7 spec §10 | Same |
| TEC128 | canon/canon_techniques.csv | start | -500 | -100 | specs/BATCH3_OVERVIEW.md; F1.7 spec §10 | Paracas cochineal 1st c. BCE–2nd c. CE, not "first millennium BCE" |
| TEC128 | canon/canon_techniques.csv | date_note | Andean textiles from first millennium BCE; post-1521 export to Europe | Paracas textiles, 1st c. BCE–2nd c. CE; post-1521 export to Europe | specs/BATCH3_OVERVIEW.md; F1.7 spec §10 | Same |
| PER076 | canon/canon_people.csv | leaves_out | the Nahua scholars (Antonio Valeriano, Martín Jacobita, Pedro de San Buenaventura, Alonso Vegerano), the painters and the elders they interviewed | the Nahua scholars (Antonio Valeriano, Martín Jacobita, Pedro de San Buenaventura, Alonso Vegerano, Diego de Grado, Bonifacio Maximiliano, Mateo Severino), the painters and the elders they interviewed | specs/BATCH3_OVERVIEW.md | The Getty names seven Nahua contributors |
| PER251 | canon/canon_people.csv | making_significance | The Indian industrialist co-founded the National Institute of Design (1961) after inviting Charles and Ray Eames to write the India Report (1958). | The Indian industrialist co-founded the National Institute of Design (1961), which followed the India Report (1958) that Charles and Ray Eames wrote after the Government of India asked the Ford Foundation to invite them (1957). | specs/BATCH3_OVERVIEW.md | The Government of India, not Gautam Sarabhai, had the Eameses invited |
| INS033 | canon/canon_makers_institutions.csv | making_significance | India's first design school followed Charles and Ray Eames's India Report (1958). | India's earliest design school followed Charles and Ray Eames's India Report (1958). | specs/BATCH3_OVERVIEW.md | Rule 6 |
| PER345 | canon/canon_people.csv | notes | (empty) | Under review 3 Oct 2026: that Kāne designed Hōkūleʻa "from historical drawings" is unverified (batch 3; F1.12 spec §9). | specs/BATCH3_OVERVIEW.md; F1.12 spec §9 | unverified or open: fact left as it is, flagged |
| PER345 | canon/canon_people.csv | confidence | high | medium | specs/BATCH3_OVERVIEW.md; F1.12 spec §9 | lowered while under review |
| COM068 | canon/canon_communities.csv | notes | Dates contested; the Atlas logic names the Haya as an example. | Dates contested; the Atlas logic names the Haya as an example. Under review 3 Oct 2026: Haya steel dates disagree with TEC072 (2,300–2,000 against 1,500–2,000 years ago); a source for 2,300–2,000 is still open. | specs/BATCH3_OVERVIEW.md; F1.6 spec §10 | unverified or open: fact left as it is, flagged |
| COM068 | canon/canon_communities.csv | confidence | medium | low | specs/BATCH3_OVERVIEW.md; F1.6 spec §10 | lowered while under review |
| TEC072 | canon/canon_techniques.csv | notes | (empty) | Under review 3 Oct 2026: Haya steel dates disagree with COM068 (1,500–2,000 against 2,300–2,000 years ago). | specs/BATCH3_OVERVIEW.md | unverified or open: fact left as it is, flagged |
| TEC072 | canon/canon_techniques.csv | confidence | medium | low | specs/BATCH3_OVERVIEW.md | lowered while under review |
| DAT-001 | register/world_set_v0.csv | licence | To check | MIT (licence file, © 2022 Open Khipu Repository Team) | SPEC_BRIEF_BATCH4_5.md, "What batch 4 found"; F1.7 spec §10; https://github.com/khipulab/open-khipu-repository/blob/master/LICENSE (read 3 Oct 2026) | Batch 3's "no licence" note reversed: the master branch now holds an MIT licence file |
| DAT-001 | register/world_set_v0.csv | holder_and_licence_note | MIT-licensed data | MIT licence file on the master branch (© 2022 Open Khipu Repository Team), read 3 Oct 2026. A software licence applied to data: the rights lead should rule | F1.7 spec §10 | Same; F1.7 asks a reader to rule on a software licence used for data |
| SRC164 | sources/sources_zero_cost.csv | licence_content | 'The Project's data is open access'; specific licence not stated on page | CC BY-NC-SA 4.0 (edition site); MIT covers the EditionCrafter software only | specs/BATCH3_OVERVIEW.md; https://edition640.makingandknowing.org/ (read 3 Oct 2026) | Content licence is CC BY-NC-SA 4.0 |
| SRC164 | sources/sources_zero_cost.csv | known_limits | Confirm licence at edition640.makingandknowing.org | Non-commercial: not open under our rule | specs/BATCH3_OVERVIEW.md | Same |
| SRC164 | sources/sources_zero_cost.csv | verified | partial 2026-09-28 | yes 2026-10-03 | https://edition640.makingandknowing.org/ | Licence read at source |
| TXT018 | sources/primary_texts.csv | date | c. 1580s | after 1579, probably c. 1588 | specs/BATCH3_OVERVIEW.md | Ms. Fr. 640 dates after 1579, probably to 1588 |
| TXT018 | sources/primary_texts.csv | translation_status | licence to verify ('open access' stated) | CC BY-NC-SA 4.0 (verified 3 Oct 2026): not open under our rule | specs/BATCH3_OVERVIEW.md; https://edition640.makingandknowing.org/ | Licence verified |
| COM115 | canon/canon_communities.csv | making_significance | Gullah Geechee women and men coil sweetgrass baskets, a practice from enslaved West African rice growers. | Gullah Geechee women and men coil sweetgrass baskets, a practice many trace to enslaved West African rice growers, though the scale of that African origin is argued. | specs/BATCH3_OVERVIEW.md; F1.29 spec §10 | Give both readings |
| PRD107 | canon/canon_periods.csv | date_note | first era name 140 BCE; Chinese use ended 1912; Japan still uses nengō | first era name 140 BCE, or c. 110 BCE in other sources; Chinese use ended 1912; Japan still uses nengō | specs/BATCH3_OVERVIEW.md; F1.8 spec §10; F1.30 spec §10 | Both dates given |
| OBT150 | canon/canon_object_types.csv | object_types | Lone Dog winter count; Battiste Good winter count | Lone Dog winter count (Nakota, per NMAI); Battiste Good winter count | specs/BATCH3_OVERVIEW.md; F1.30 spec §10 | NMAI attributes the Lone Dog count to Nakota people |
| SRC143 | sources/sources_zero_cost.csv | notes | Data Science Journal article (2020) is the citable version (licence not checked). | Data Science Journal article (Carroll et al. 2020) is the citable version, CC BY 4.0. | specs/BATCH3_OVERVIEW.md | CARE has a CC BY 4.0 citable version |
| TXT001 | sources/primary_texts.csv | where_free | Project Gutenberg (Morgan); Internet Archive | Project Gutenberg ebook 20239 (Morgan); Internet Archive | specs/BATCH3_OVERVIEW.md | Gutenberg ebook number confirmed |
| TXT001 | sources/primary_texts.csv | notes | Builders, materials, machines. Confirm Gutenberg ebook number. | Builders, materials, machines. | specs/BATCH3_OVERVIEW.md | Check done; flag removed |
| TXT045 | sources/primary_texts.csv | translation_status | PD in US (1927 publication); UK status to verify | PD in US (1927 publication); enters the UK public domain on 1 January 2027 | specs/BATCH3_OVERVIEW.md | UK status settled |
| TXT085 | sources/primary_texts.csv | units | F1.13;F1.16 | F1.13;F1.16;F1.29 | specs/BATCH3_OVERVIEW.md; F1.29 spec §10 | Add F1.29 to its units |
| TXT035 | sources/primary_texts.csv | where_free | Internet Archive | Internet Archive; Silk Road Seattle | specs/BATCH3_OVERVIEW.md | Free text route added |
| TXT093 | sources/primary_texts.csv | where_free | Original: ctext.org link; scans on NDL/other libraries (to verify) | Original: ctext.org link; scans on NDL/other libraries (to verify); Library of Congress scan of the National Library of China copy | specs/BATCH3_OVERVIEW.md | Free text route added |
| INV002 | canon/canon_firsts.csv | start | -3250 | -3320 | F1.5 spec §4 | Start -3250 against its own note and CL-102 (about 3320 BCE) |
| INV100 | canon/canon_firsts.csv | making_significance | First known cotton, preserved in a copper bead. | Earliest known cotton, preserved in a copper bead. | F1.5 spec §4; F1.9 spec §10 | Rule 6 |
| INV100 | canon/canon_firsts.csv | sensitivity | none | funerary | F1.9 spec §10 | From a burial |
| INV102 | canon/canon_firsts.csv | making_significance | First known indigo-dyed textiles, from Peru. | Earliest known indigo-dyed textiles, from Peru. | F1.5 spec §4; F1.7 spec §10 | Rule 6 |
| INV102 | canon/canon_firsts.csv | notes | Splitstoser et al. 2016; beats Egyptian evidence by about 1,500 years. | Splitstoser et al. 2016; about 1,500 years older than the Egyptian evidence. | F1.5 spec §4 | Neutral wording |
| ARC099 | canon/canon_cultures_horizons.csv | units | (empty) | F1.12a;F1.5;F1.28 | F1.5 spec §4; F1.12a spec §10 | Units empty |
| DYN003 | canon/canon_dynasties.csv | units | (empty) | F1.5;F1.6 | F1.5 spec §4 | Units empty |
| CL-117 | register/claims_v0.csv | claim | Cotton was domesticated four separate times, twice in Africa and Asia and twice in the Americas | Cotton was domesticated four separate times, twice in Afro-Asia and twice in the Americas | F1.5 spec §4 | "Two Afro-Asian, two American" |
| CL-184 | register/claims_v0.csv | claim | Two Old World cottons were domesticated separately; India's  is one | Two Afro-Asian cottons were domesticated separately; India's  is one | F1.5 spec §4; F1.9 spec §10 | "Old World" replaced |
| CL-104 | register/claims_v0.csv | claim | The Cascajal block from the Olmec heartland is the oldest writing in the Americas, dated by style to the early first millennium BCE | The Cascajal block from the Olmec heartland is the earliest known writing in the Americas, dated by style to the early first millennium BCE | F1.5 spec §4 | Rule 6; contested kept |
| CL-111 | register/claims_v0.csv | claim | Gold was cold-hammered into beads at Jiskairumoko, Peru, 2155–1936 BCE, the earliest worked gold in the Americas | Gold was cold-hammered into beads at Jiskairumoko, Peru, 2155–1936 BCE, the earliest known worked gold in the Americas | F1.5 spec §4 | Rule 6 |
| CL-120 | register/claims_v0.csv | confidence | documented | probable | F1.5 spec §4 | One source (Shen Kuo): probable |
| CL-115 | register/claims_v0.csv | claim | Jenné-jeno was a city from the 3rd century BCE with no evidence of a central ruler | Djenné-Djeno was a city from the 3rd century BCE with no evidence of a central ruler | F1.5 spec §4 | Name as in PLC029 |
| WS-X02 | register/world_set_v0.csv | licence | To check | Public domain | F1.5 spec §4 | Licence checked: public domain (Met 42047); still excluded |
| WS-X02 | register/world_set_v0.csv | met_object_id | (empty) | 42047 | F1.5 spec §4 | Same |
| WS-X03 | register/world_set_v0.csv | licence | To check | CC0 | F1.5 spec §4 | Licence checked: CC0; still excluded |
| PRA019 | canon/canon_practices.csv | notes | Links to Benin plaques (looted 1897); start date is approximate. | Links to Benin plaques (looted 1897); start date is approximate. Under review 3 Oct 2026: "at least the 15th century" against MKR001's oral-history founding in the 13th–14th c.; reconcile. | F1.6 spec §10 | unverified or open: fact left as it is, flagged |
| PRA019 | canon/canon_practices.csv | confidence | medium | low | F1.6 spec §10 | lowered while under review |
| OBT159 | canon/canon_object_types.csv | units | F1.13;F1.23 | F1.13;F1.23;F1.6 | F1.6 spec §10 | Add F1.6 |
| INV130 | canon/canon_firsts.csv | making_significance | First known city of the Americas, with platform mounds and plazas. | Earliest known city of the Americas, with platform mounds and plazas. | F1.7 spec §9; F1.7 spec §10 | Rule 6 |
| CIV039 | canon/canon_civilisations.csv | other_names | Amazonian 'lost cities'; Upano; Casarabe; Upper Xingu | 'lost cities' (media term, quoted); Upano; Casarabe; Upper Xingu | F1.7 spec §10 | Banned framing: quote and attribute only |
| ARC205 | canon/canon_cultures_horizons.csv | units | F1.18 | F1.18;F1.7;F1.24 | F1.7 spec §10 | Add F1.7 and F1.24 |
| ARC205 | canon/canon_cultures_horizons.csv | notes | Textiles came from mummy bundles; many looted and exported. | Textiles came from mummy bundles; many looted and exported. Under review 3 Oct 2026: c. 800–100 BCE differs from Cleveland's dates for its Paracas records. | F1.7 spec §10 | unverified or open: fact left as it is, flagged |
| ARC205 | canon/canon_cultures_horizons.csv | confidence | high | medium | F1.7 spec §10 | lowered while under review |
| WS-052 | register/world_set_v0.csv | title | Turban band (), Paracas | Turban band (llauto), Paracas | F1.7 spec §10 (§5 table) | Title lost its italic word |
| MKR036 | canon/canon_makers_institutions.csv | notes | (empty) | Under review 3 Oct 2026: imperial kiln founding 1369; 1402 is also cited, not verified. | F1.8 spec §9 | unverified or open: fact left as it is, flagged |
| MKR036 | canon/canon_makers_institutions.csv | confidence | high | medium | F1.8 spec §9 | lowered while under review |
| CL-173 | register/claims_v0.csv | claim | The  (State Building Standards) was compiled by Li Jie, a state building superintendent, in 1100 and published in 1103; its 34 chapters set units, design standards, labour estimates and material data | The Yingzao fashi (State Building Standards) was compiled by Li Jie, a state building superintendent, in 1100 and published in 1103; its 34 chapters set units, design standards, labour estimates and material data | F1.8 spec §10 (claim 6) | Register build dropped the italic title |
| WS-060 | register/world_set_v0.csv | title | Tripod cauldron () | Tripod cauldron (ding) | F1.8 spec §10 | Register build dropped the italic word |
| WS-062 | register/world_set_v0.csv | roles | Korea's inlay technique () | Korea's inlay technique (sanggam) | F1.8 spec §10 | Register build dropped the italic word |
| CL-176 | register/claims_v0.csv | source | (shared with F1.13) | Cleveland 1962.154 label (shared with F1.13); PNAS not re-opened | F1.8 spec §10 (claim 16) | Sourced to Cleveland |
| CL-177 | register/claims_v0.csv | source | Liu et al. 2020 (shared with F1.5) | Liu et al., Radiocarbon 63 (2021) (shared with F1.5) | F1.8 spec §10 | Correct citation |
| WS-002 | register/world_set_v0.csv | provenance | Acquired 1960, before the threshold | L. Wannieck, Paris (by 1937); Bluett & Sons; Cleveland, 1960 | F1.8 spec §10 (claim 3) | Chain now starts by 1937 |
| WS-002 | register/world_set_v0.csv | test_basis | In a museum or documented collection by 1960 | In a documented collection by 1937 | F1.8 spec §10 | Same |
| WS-020 | register/world_set_v0.csv | provenance | A New York dealer, sold to Cleveland in 1962 | J. T. Tai, New York, sold to Cleveland in 1962 | F1.8 spec §10 | Dealer named |
| DOC-002 | register/world_set_v0.csv | action | (empty) | Under review 3 Oct 2026: the Wikisource scans could not be fetched; licence not verified. | F1.8 spec §10 | unverified or open: fact left as it is, flagged |
| MAT056 | canon/canon_materials.csv | date_note | cotton fibres at Mehrgarh c.6th–5th millennium BCE; Andean cotton c.4000 BCE; domesticated independently in the Old and New Worlds | cotton fibres at Mehrgarh c.6th–5th millennium BCE; Andean cotton c.4000 BCE; domesticated independently in Afro-Asia and the Americas | F1.9 spec §10 | "Old and New Worlds" replaced |
| MAT056 | canon/canon_materials.csv | making_significance | A seed fibre domesticated at least twice; Indian cottons then American slave-grown cotton organised much of the world economy. | A seed fibre domesticated four times; Indian cottons then American slave-grown cotton organised much of the world economy. | F1.9 spec §10 (claim 3) | Four domestications |
| PER326 | canon/canon_people.csv | notes | links: DIA004 | links: DIA004. Under review 3 Oct 2026: "slave-agent Bomma": check the name and wording against Goitein. | F1.9 spec §10 | unverified or open: fact left as it is, flagged |
| PER326 | canon/canon_people.csv | confidence | medium | low | F1.9 spec §10 | lowered while under review |
| PR-015 | register/practices_v0.csv | source | UNESCO Representative List (to verify year) | UNESCO Representative List 2013 | F1.9 spec §10 | Year verified |
| WS-006 | register/world_set_v0.csv | roles | Cotton and printing on cloth. Catalogued as "Egypt, Mamluk": that is where it was found; where it was made is a separate question / Indian Ocean cotton (shared with F1.5) / Indian cotton in Mamluk Egypt / Catalogued as "Egypt, Mamluk"; Barnes's work suggests the Gujarat question must be asked. The card shows both | Cotton and printing on cloth. Catalogued as "Egypt, Mamluk sultanate": Cleveland reads it as Egyptian-made, with an Indian technique; where it was made is a separate question / Indian Ocean cotton (shared with F1.5) / Indian cotton in Mamluk Egypt / Catalogued as "Egypt, Mamluk"; Barnes's work suggests the Gujarat question must be asked. The card shows both | F1.9 spec §10 (claim 4) | Cleveland reads 1929.845 as Egyptian-made |
| WS-071 | register/world_set_v0.csv | provenance | A New York dealer, 1961 | William H. Wolff, New York, 1961 | F1.9 spec §10 (claim 12) | Dealer named |
| WS-073 | register/world_set_v0.csv | status | to-source | exemplar | F1.9 spec §10 (claim 17; §5) | Resolved to Met 2012.164 |
| WS-073 | register/world_set_v0.csv | title | double-ikat silk, Patan | Patolu with Elephant Design (silk double ikat, Gujarat) | F1.9 spec §10 (claim 17; §5) | Resolved to Met 2012.164 |
| WS-073 | register/world_set_v0.csv | date | To source | 1767–99 | F1.9 spec §10 (claim 17; §5) | Resolved to Met 2012.164 |
| WS-073 | register/world_set_v0.csv | holder | (empty) | Met | F1.9 spec §10 (claim 17; §5) | Resolved to Met 2012.164 |
| WS-073 | register/world_set_v0.csv | accession | (empty) | 2012.164 | F1.9 spec §10 (claim 17; §5) | Resolved to Met 2012.164 |
| WS-073 | register/world_set_v0.csv | licence | To source | Public domain | F1.9 spec §10 (claim 17; §5) | Resolved to Met 2012.164 |
| WS-073 | register/world_set_v0.csv | holder_and_licence_note | Not in Cleveland's CC0 set; Met or Rijksmuseum to check | Met 2012.164 (object 77871), public domain | F1.9 spec §10 (claim 17; §5) | Resolved to Met 2012.164 |
| WS-073 | register/world_set_v0.csv | provenance | — | Chain before 2012 not read | F1.9 spec §10 (claim 17; §5) | Resolved to Met 2012.164 |
| WS-073 | register/world_set_v0.csv | provenance_test | to-check | n/a | F1.9 spec §10 (claim 17; §5) | Resolved to Met 2012.164 |
| WS-073 | register/world_set_v0.csv | test_basis | (empty) | Trade textile; not archaeological | F1.9 spec §10 (claim 17; §5) | Resolved to Met 2012.164 |
| WS-073 | register/world_set_v0.csv | met_object_id | (empty) | 77871 | F1.9 spec §10 (claim 17; §5) | Resolved to Met 2012.164 |
| WS-074 | register/world_set_v0.csv | accession | (empty) | 49.40.1 | F1.9 spec §10 (§5) | Resolved to Met 49.40.1 |
| WS-074 | register/world_set_v0.csv | holder_and_licence_note | Met or Cleveland to check at record level | Met 49.40.1 (checked in F1.9, not used there); licence at record level to check | F1.9 spec §10 | Same |
| DOC-003 | register/world_set_v0.csv | status | support | excluded | F1.9 spec §10 | Not verified; dropped |
| DOC-003 | register/world_set_v0.csv | action | (empty) | Dropped from F1.9: not verified | F1.9 spec §10 | Same |
| CL-181 | register/claims_v0.csv | confidence_note | (empty) | Under review 3 Oct 2026: overstates Barnes. | F1.9 spec §10 | unverified or open: fact left as it is, flagged |
| CL-181 | register/claims_v0.csv | confidence | documented | probable | F1.9 spec §10 | lowered while under review |
| CL-186 | register/claims_v0.csv | claim | The National Gallery of Australia bought a Chola Nataraja for US$5 million in 2008 from Subhash Kapoor; police in Tamil Nadu recorded the theft of a Nataraja from Sripuranthan in 2008; Australia returned the bronze to India in September 2014 | The National Gallery of Australia bought a Chola Nataraja for US$5 million in 2008 from Subhash Kapoor; police in Tamil Nadu were alerted in August 2008 to the theft of a Nataraja from Sripuranthan; Australia returned the bronze to India in September 2014 | F1.9 spec §10; F1.9 spec §9 | Theft and its report conflated |
| NET016 | canon/canon_networks.csv | date_note | Akkadian texts name Dilmun (Bahrain), Magan (Oman) and Meluhha (Indus region) | Akkadian texts name Dilmun (Bahrain), Magan (the Oman peninsula, today Oman and the UAE) and Meluhha (Indus region) | F1.9a spec §10 | Magan is the Oman peninsula |
| CL-200 | register/claims_v0.csv | claim | Magan, the copper land of Sumerian texts, is identified with Oman, where copper was mined and smelted from the Early Bronze Age (Hafit and Umm an-Nar periods, c. 3200–2000 BCE) | Magan, the copper land of Sumerian texts, is identified with the Oman peninsula, today Oman and the UAE, where copper was mined and smelted from the Early Bronze Age (Hafit and Umm an-Nar periods, c. 3200–2000 BCE) | F1.9a spec §10 | Same |
| PL-030 | register/world_set_v0.csv | title | Magan copper sites, Oman (place) | Magan copper sites, the Oman peninsula (place) | F1.9a spec §10 | Same |
| PER289 | canon/canon_people.csv | making_significance | The glassmaker from Sidon signed mould-blown cups and jugs with his name in Greek, one of the first known glass signatures. | The glassmaker, probably from Sidon, signed mould-blown cups and jugs with his name in Greek, one of the first known glass signatures. | F1.9a spec §10 | "Probably" Sidon |
| PER289 | canon/canon_people.csv | making_significance | The glassmaker, probably from Sidon, signed mould-blown cups and jugs with his name in Greek, one of the first known glass signatures. | The glassmaker, probably from Sidon, signed mould-blown cups and jugs with his name in Greek, among the earliest known glass signatures. | F1.9a spec §10 | Rule 6 |
| INV001 | canon/canon_firsts.csv | making_significance | First known writing: proto-cuneiform tablets from Uruk record goods, rations and labour. | Earliest known writing: proto-cuneiform tablets from Uruk record goods, rations and labour. | F1.9a spec §10 | Rule 6 |
| INV026 | canon/canon_firsts.csv | making_significance | First known true glass, as beads, then vessels. | Earliest known true glass, as beads, then vessels. | F1.9a spec §10 | Rule 6 |
| INV027 | canon/canon_firsts.csv | making_significance | First known blown glass, which made glass cheap and common. | Earliest known blown glass, which made glass cheap and common. | F1.9a spec §10 | Rule 6 |
| INV137 | canon/canon_firsts.csv | notes | Aflaj at Hili/Al Ain claimed c. 1000 BCE; Iranian claims similar. | Aflaj at Hili/Al Ain claimed c. 1000 BCE; Iranian claims similar. UNESCO (Aflaj Irrigation Systems of Oman, 2006) reads aflaj origins as possibly AD 500, with irrigation as early as 2500 BC. | F1.9a spec §10 (claim 24) | Add UNESCO's AD 500 reading |
| TEC220 | canon/canon_techniques.csv | date_note | aflaj at Hili 15 and Bida Bint Saud (UAE) associated with Iron Age II pottery c. 1000–600 BCE; Iranian origin argued (English, Lightfoot), Arabian origin argued (Al Tikriti); secure absolute dates lacking (Charbonnier) | aflaj at Hili 15 and Bida Bint Saud (UAE) associated with Iron Age II pottery c. 1000–600 BCE; Iranian origin argued (English, Lightfoot), Arabian origin argued (Al Tikriti); secure absolute dates lacking (Charbonnier); UNESCO (Oman, 2006) gives aflaj origins possibly AD 500 | F1.9a spec §10 (claim 24) | Add UNESCO's AD 500 reading |
| CL-199 | register/claims_v0.csv | source | ; to be backed by the excavation report | Gudenrath, Corning Museum of Glass, "Earliest inflated glass"; to be backed by the excavation report | F1.9a spec §10 (claim 20) | No source: use Corning |
| WS-095 | register/world_set_v0.csv | title | Cup signed "Ennion made me" | Jug signed by Ennion | F1.9a spec §10 (claim 21; §5) | 17.194.225 names no maker; re-pointed to the Ennion jug 17.194.226 |
| WS-095 | register/world_set_v0.csv | date | c. 1–50 CE | 1st half of the 1st century CE | F1.9a spec §10 (claim 21; §5) | 17.194.225 names no maker; re-pointed to the Ennion jug 17.194.226 |
| WS-095 | register/world_set_v0.csv | accession | 17.194.225 | 17.194.226 | F1.9a spec §10 (claim 21; §5) | 17.194.225 names no maker; re-pointed to the Ennion jug 17.194.226 |
| WS-095 | register/world_set_v0.csv | holder_and_licence_note | Met 17.194.225; licence to check at record level | Met 17.194.226 (object 249470), public domain | F1.9a spec §10 (claim 21; §5) | 17.194.225 names no maker; re-pointed to the Ennion jug 17.194.226 |
| WS-095 | register/world_set_v0.csv | met_object_id | 249469 | 249470 | F1.9a spec §10 (claim 21; §5) | 17.194.225 names no maker; re-pointed to the Ennion jug 17.194.226 |
| MKR012 | canon/canon_makers_institutions.csv | name | Coptic textile workshops | Late antique Egyptian textile workshops | F1.10 spec §10 | Rename; "Coptic" kept for Christian work |
| MKR012 | canon/canon_makers_institutions.csv | other_names | Egyptian late antique weavers | Coptic textile workshops (for Christian work) | F1.10 spec §10 | Same |
| STY083 | canon/canon_movements_styles_schools.csv | name | Coptic art | Late antique Egyptian art | F1.10 spec §10 | Rename; "Coptic" kept for Christian work |
| STY083 | canon/canon_movements_styles_schools.csv | other_names | Coptic textiles and sculpture | Coptic art (for Christian work); Coptic textiles and sculpture | F1.10 spec §10 | Same |
| PLC298 | canon/canon_places.csv | name | Muharraq pearling sites | Pearling, Testimony of an Island Economy | F1.10 spec §10 (claim 25); https://whc.unesco.org/en/list/1364/ | Use the WHC title |
| PLC298 | canon/canon_places.csv | other_names | Muharraq, Bahrain | Muharraq pearling sites; Muharraq, Bahrain | F1.10 spec §10 | Former name kept |
| PLC298 | canon/canon_places.csv | start | 1800 | 100 | F1.10 spec §10 | UNESCO's span starts in the 2nd century, not 1800 |
| PLC298 | canon/canon_places.csv | date_note | approx. | approx.; pearling dominated the Gulf economy from the 2nd century to the 1930s (UNESCO); World Heritage 2012 | F1.10 spec §10 | Same, with the 2012 inscription |
| PR-011 | register/practices_v0.csv | source | UNESCO Urgent Safeguarding List (to verify) | UNESCO Urgent Safeguarding List 2011 (6.COM 8.10): "Traditional skills of building and sailing Iranian Lenj boats in the Persian Gulf" | F1.10 spec §10; F1.13 spec §10 | Verified; title quoted |
| CL-162 | register/claims_v0.csv | claim | Gulf lenj boat-building and navigation are on UNESCO's urgent safeguarding list (2011) | "Traditional skills of building and sailing Iranian Lenj boats in the Persian Gulf" are on UNESCO's urgent safeguarding list (2011) | F1.10 spec §10 | Title quoted as UNESCO publishes it |
| CL-163 | register/claims_v0.csv | claim | Three enamelled glass pieces in Cleveland catalogued as Mamluk-style are European work of the late 1800s; one carries an inscription naming the sultan Muhammad ibn Qala'un | Three enamelled glass pieces in Cleveland catalogued as Mamluk-style are European work of the late 1800s and about 1900; the bottle (1944.488, c. 1900) names the sultan Muhammad ibn Qala'un | F1.10 spec §10 (claim 20) | The bottle is c. 1900 and is the piece naming the sultan |
| WS-045 | register/world_set_v0.csv | title | Mosque lamp by Philippe-Joseph Brocard, Paris | Mosque lamp, possibly by Philippe-Joseph Brocard, Paris | F1.10 spec §10 (claim 20) | Cleveland: "possible that it was made by him" |
| DOC-001 | register/world_set_v0.csv | date | 1132–1149 | 1132–39, 1145–49 | F1.10 spec §10 (claim 16) | Two date ranges |
| DOC-001 | register/world_set_v0.csv | licence | To check | Not open (fair use; contact the library) | F1.10 spec §10 | Not open; link out |
| OBT024 | canon/canon_object_types.csv | notes | Iznik ceramic lamps were symbolic, not for light. | Iznik ceramic lamps were likely symbolic (Cleveland's word), not for light. | F1.10 spec §10 | Soften to Cleveland's "likely" |
| INS044 | canon/canon_makers_institutions.csv | notes | Existing project node; reconcile ID. | Existing project node; reconcile ID. Under review 3 Oct 2026: start 700 against the earliest dated deed, 876 (waqf page). | F1.10 spec §10 | unverified or open: fact left as it is, flagged |
| INS044 | canon/canon_makers_institutions.csv | confidence | high | medium | F1.10 spec §10 | lowered while under review |
| INV043 | canon/canon_firsts.csv | making_significance | First known printing press with cast movable type and oil ink in Europe. | Earliest known printing press with cast movable type and oil ink in Europe. | F1.11 spec §10 | Rule 6 |
| INV076 | canon/canon_firsts.csv | making_significance | First known copper smelting from ore. | Earliest known copper smelting from ore. | F1.11 spec §10 | Rule 6 |
| INV076 | canon/canon_firsts.csv | notes | Radivojević et al. 2010; competes with Iran. | Radivojević et al. 2010; competes with Iran. Its meaning is contested (F1.11). | F1.11 spec §10 | INV076's meaning contested |
| OCC029 | canon/canon_events.csv | date_note | approx.; attributed to Leo VI | approx.; attributed to Leo VI; 911–912 is one reading of the date | F1.11 spec §10 | 911–912 is one reading |
| TXT010 | sources/primary_texts.csv | where_free | Gallica; Internet Archive | Gallica (not open under our rule); Internet Archive | F1.11 spec §10 | Gallica not open under our rule |
| PLC319 | canon/canon_places.csv | making_significance | Arezzo's workshops made mould-decorated red-gloss tableware stamped with the names of owners and slave workers. | Arezzo's workshops made mould-decorated red-gloss tableware stamped with the names of owners and enslaved workers. | F1.11 spec §10 | Wording |
| PR-016 | register/practices_v0.csv | source | UNESCO Representative List (to verify year) | UNESCO Representative List 2010 (5.COM) | F1.11 spec §10 (claim 21) | Year verified (2010) |
| EVT001 | canon/canon_makers_institutions.csv | making_significance | The first world's fair ranked the goods of nations and colonies in a prefabricated iron-and-glass hall, triggering British design reform. | Often called the first world's fair, it ranked the goods of nations and colonies in a prefabricated iron-and-glass hall, triggering British design reform. | F1.11 spec §10 | Rule 6 |
| WS-082 | register/world_set_v0.csv | status | to-source | exemplar | F1.11 spec §10 (§5) | Resolved: the Valkhof bowl |
| WS-082 | register/world_set_v0.csv | title | bowl with a maker's stamp | Bowl stamped by Utilis | F1.11 spec §10 (§5) | Resolved: the Valkhof bowl |
| WS-082 | register/world_set_v0.csv | date | 1st century | 10 BCE–10 CE | F1.11 spec §10 (§5) | Resolved: the Valkhof bowl |
| WS-082 | register/world_set_v0.csv | holder | (empty) | Museum Het Valkhof | F1.11 spec §10 (§5) | Resolved: the Valkhof bowl |
| WS-082 | register/world_set_v0.csv | accession | (empty) | PDB.1998.2.KH.295.126 | F1.11 spec §10 (§5) | Resolved: the Valkhof bowl |
| WS-082 | register/world_set_v0.csv | licence | To check | Public Domain Mark (Europeana; holder's page not reached) | F1.11 spec §10 (§5) | Resolved: the Valkhof bowl |
| WS-082 | register/world_set_v0.csv | holder_and_licence_note | To source from the Met or the British Museum at record level | Museum Het Valkhof PDB.1998.2.KH.295.126; Public Domain Mark via Europeana; holder's page not reached | F1.11 spec §10 (§5) | Resolved: the Valkhof bowl |
| WS-082 | register/world_set_v0.csv | provenance | — | Excavated at Nijmegen; never exported | F1.11 spec §10 (§5) | Resolved: the Valkhof bowl |
| WS-082 | register/world_set_v0.csv | history_gap | (empty) | Excavation year | F1.11 spec §10 (§5) | Resolved: the Valkhof bowl |
| AS-001 | register/world_set_v0.csv | units | F1.11 | F1.15 | F1.11 spec §10 | Moved to F1.15 |
| WS-083 | register/world_set_v0.csv | units | F1.11 | F1.14 | F1.11 spec §10 | Moved to F1.14 |
| WS-084 | register/world_set_v0.csv | units | F1.11 | F1.14 | F1.11 spec §10 | Moved to F1.14 |
| CL-189 | register/claims_v0.csv | claim | Roman red-gloss pottery () was mass-produced in several parts of the empire and exported to all of it; its stamps name the people involved in production, including slaves and freedmen, and the largest Arretine firms had dozens of potters | Roman red-gloss pottery (terra sigillata) was mass-produced in several parts of the empire and exported across it; its stamps name people in production, including enslaved and freed workers, and the largest Arretine firms had dozens of potters | F1.11 spec §10 (claim 6) | Reworded; dropped italic restored |
| CL-190 | register/claims_v0.csv | claim | The , compiled under Étienne Boileau in 13th-century Paris, records the statutes of the city's trades | The Livre des métiers, compiled under Étienne Boileau in 13th-century Paris, records the statutes of the city's trades | F1.11 spec §10 | Dropped italic title restored |
| CL-194 | register/claims_v0.csv | claim | The Great Exhibition of 1851 showed more than 100,000 objects to six million visitors in a purpose-built iron and glass building; Owen Jones, one of its superintendents of works, published  in 1856 with 100 plates in 19 categories | The Great Exhibition of 1851 showed more than 100,000 objects to six million visitors in a purpose-built iron and glass building; Owen Jones, one of its superintendents of works, published The Grammar of Ornament in 1856 with 100 plates in 19 categories | F1.11 spec §10 | Dropped italic title restored |
| CL-194 | register/claims_v0.csv | unit | F1.11 | F1.15 | F1.11 spec §10 | Moves with its case (the Great Exhibition, F1.15) |
| CL-195 | register/claims_v0.csv | claim | French  was inscribed by UNESCO in 2010: about 45,000 people, training of about five years on the move between towns, and a masterwork judged by the  before one may teach | French compagnonnage was inscribed by UNESCO in 2010: about 45,000 people, training of about five years on the move between towns, and a masterwork judged by the  before one may teach | F1.11 spec §10 (claim 21) | Dropped italic word restored |
| CL-195 | register/claims_v0.csv | claim | French compagnonnage was inscribed by UNESCO in 2010: about 45,000 people, training of about five years on the move between towns, and a masterwork judged by the  before one may teach | French compagnonnage was inscribed by UNESCO in 2010: about 45,000 people, training of about five years on the move between towns, and a masterwork judged by the compagnons before one may teach | F1.11 spec §10 (claim 21) | Same |
| CL-196 | register/claims_v0.csv | confidence | documented | contested | F1.11 spec §10 | Belovode is argued |
| CL-196 | register/claims_v0.csv | confidence_note | (empty) | Belovode's priority over Near Eastern evidence is argued (F1.9a, F1.11) | F1.11 spec §10 | Same |
| INV148 | canon/canon_firsts.csv | making_significance | First known ground-edge axes, from northern Australia. | Earliest securely dated ground-edge axes, from northern Australia; Madjedbebe's axe fragments are dated earlier by its excavators, a date others contest. | F1.12 spec §10 (claim 4) | Rule 6; INV148 and PLC388 disagreed unless qualified |
| INV115 | canon/canon_firsts.csv | making_significance | First recorded ocean-swell charts, made in the Marshall Islands. | Earliest recorded ocean-swell charts, made in the Marshall Islands. | F1.12 spec §9; F1.12 spec §10 | Rule 6 |
| PLC389 | canon/canon_places.csv | making_significance | A fragment of a ground-edge axe from Carpenter's Gap is dated to about 45,000-49,000 years ago. | A fragment of a ground-edge axe from Carpenter's Gap is dated to about 44,000-49,000 years ago (Hiscock et al. 2016). | F1.12 spec §10 | Hiscock gives 44,000–49,000 |
| CL-152 | register/claims_v0.csv | source | (empty) | Denham, Bronk Ramsey and Specht, Archaeology in Oceania 47:1 (2012); DD2 cited "Anderson 2012" | F1.12 spec §10 (claim 11) | Correct source |
| CL-150 | register/claims_v0.csv | claim | A ground-edge axe fragment from the Kimberley is 44,000–49,000 years old, the earliest known anywhere | A ground-edge axe fragment from the Kimberley is 44,000–49,000 years old (Hiscock et al. 2016), the earliest securely dated | F1.12 spec §10 (claim 4) | Reword as claim 4 |
| CL-154 | register/claims_v0.csv | claim | In 1976 the canoe Hōkūleʻa sailed from Hawaiʻi to Tahiti navigated without instruments by Mau Piailug of Satawal; in 1980 Nainoa Thompson repeated it, the first Hawaiian navigator to do so in 600 years | In 1976 the canoe Hōkūleʻa sailed from Hawaiʻi to Tahiti navigated without instruments by Mau Piailug of Satawal; in 1980 Nainoa Thompson repeated the voyage, which the Polynesian Voyaging Society calls "a feat that hadn't been accomplished in 600 years" | F1.12 spec §10 (claim 19) | The 600 years attributed to PVS |
| CL-155 | register/claims_v0.csv | claim | Australia has no law against the misuse of traditional symbols, songs and stories; Creative Australia's protocols (Terri Janke, 2002, revised 2007) require consultation, consent and attribution as a condition of funding | Creative Australia's page (updated 10 March 2026) says Australia does not yet have a law against the misuse of traditional symbols; the government committed to new laws on 30 January 2023. The protocols (third edition, 29 September 2020; Terri Janke) are a condition of funding | F1.12 spec §10 (claims 21–22) | Dated; third edition |
| WS-033 | register/world_set_v0.csv | title | (barkcloth), Lau Islands, Fiji | Masi (barkcloth), Lau Islands, Fiji | F1.12 spec §10 (§5) | Fijian name restored |
| COM274 | canon/canon_communities.csv | other_names | Tolai (Kuanua-speakers) | Gunantuna; Tolai (Kuanua-speakers) | F1.12 spec §10 | Add Gunantuna, the name Museums Victoria uses first |
| WS-032 | register/world_set_v0.csv | status | to-license | exemplar | F1.12 spec §4 (WS-032 "now filled"; §5) | Filled by Museums Victoria X 32087 |
| WS-032 | register/world_set_v0.csv | title | Lapita dentate-stamped sherd | Potsherds, Lapita, Wuatam Island | F1.12 spec §4 (WS-032 "now filled"; §5) | Filled by Museums Victoria X 32087 |
| WS-032 | register/world_set_v0.csv | date | About 3,300 years ago | c. 2850–1850 years ago (holder) | F1.12 spec §4 (WS-032 "now filled"; §5) | Filled by Museums Victoria X 32087 |
| WS-032 | register/world_set_v0.csv | holder | (empty) | Museums Victoria | F1.12 spec §4 (WS-032 "now filled"; §5) | Filled by Museums Victoria X 32087 |
| WS-032 | register/world_set_v0.csv | accession | (empty) | X 32087 | F1.12 spec §4 (WS-032 "now filled"; §5) | Filled by Museums Victoria X 32087 |
| WS-032 | register/world_set_v0.csv | licence | Image to license | Record CC BY 4.0; item has no image; article image (Dermot A. Casey) Public Domain Mark | F1.12 spec §4 (WS-032 "now filled"; §5) | Filled by Museums Victoria X 32087 |
| WS-032 | register/world_set_v0.csv | holder_and_licence_note | Excavated material; museum image to be licensed | Museums Victoria X 32087; record CC BY 4.0; article image Public Domain Mark; image content to confirm | F1.12 spec §4 (WS-032 "now filled"; §5) | Filled by Museums Victoria X 32087 |
| WS-032 | register/world_set_v0.csv | provenance | The pottery that maps the voyages | Dug by Otto Meyer at Wuatam, 1908–09; in Australia by 1925 | F1.12 spec §4 (WS-032 "now filled"; §5) | Filled by Museums Victoria X 32087 |
| WS-032 | register/world_set_v0.csv | test_basis | Excavated material | In Australia by 1925 | F1.12 spec §4 (WS-032 "now filled"; §5) | Filled by Museums Victoria X 32087 |
| WS-032 | register/world_set_v0.csv | history_gap | (empty) | From Meyer's dig (1908–09) to the 1925 loan; how the sherds left German New Guinea | F1.12 spec §4 (WS-032 "now filled"; §5) | Filled by Museums Victoria X 32087 |
| WS-100 | register/world_set_v0.csv | action | (empty) | Under review 3 Oct 2026: reconcile dates and excavation years; inventory number "1687-93" unverified. | F1.12a spec §10 | unverified or open: fact left as it is, flagged |
| CL-206 | register/claims_v0.csv | confidence_note | object); contested (origin | object); contested (origin. Under review 3 Oct 2026: as WS-100: dates and excavation years to reconcile. | F1.12a spec §10 | unverified or open: fact left as it is, flagged |
| CL-206 | register/claims_v0.csv | confidence | documented | probable | F1.12a spec §10 | lowered while under review |
| WS-102 | register/world_set_v0.csv | provenance | A Paris dealer, 1959 | Mrs. Paul (Marguerite) Mallon, Paris, to 1959; found sewn on a tunic in a grave in Egypt | F1.12a spec §10 (claim 13) | Owner Mallon, not "a Paris dealer"; findspot read |
| WS-102 | register/world_set_v0.csv | action | (empty) | Funerary: content note (Q21) | F1.12a spec §10 | Funerary flag |
| WS-091 | register/world_set_v0.csv | units | F1.9a F1.12a | F1.9a | F1.12a spec §10 | Drop F1.12a |
| CL-204 | register/claims_v0.csv | source | (empty) | Librado et al. 2024 | F1.12a spec §10 | Add Librado 2024 |
| CL-205 | register/claims_v0.csv | source | ; Outram et al. 2009,  323, for the earlier view | Librado et al. 2024; Outram et al. 2009, Science 323, for the earlier view | F1.12a spec §10 | Add Librado 2024; dropped journal name restored |
| CL-209 | register/claims_v0.csv | unit | F1.12a | F1.22a | F1.12a spec §10 | Carried by F1.22a |
| CL-210 | register/claims_v0.csv | confidence_note | object | object. Under review 3 Oct 2026: "steppe horse culture inside Iran" has no source: drop or mark interpretive. | F1.12a spec §10 | unverified or open: fact left as it is, flagged |
| CL-210 | register/claims_v0.csv | confidence | documented | probable | F1.12a spec §10 | lowered while under review |
| INV071 | canon/canon_firsts.csv | notes | Outram et al. 2009 (bit wear, milk) vs Gaunitz et al. 2018; Botai herding still argued. | Outram et al. 2009 (bit wear, milk) vs Gaunitz et al. 2018; Botai herding still argued. Sources: Gaunitz et al. 2018; Taylor and Barrón-Ortiz 2021; Librado et al. 2024. | F1.12a spec §10 | Add sources |
| PRA087 | canon/canon_practices.csv | units | F1.29 | F1.29;F1.12a | F1.12a spec §10 | Add F1.12a |
| CL-137 | register/claims_v0.csv | claim | Early Chinese blue-and-white depended on cobalt imported from the West | Early Chinese blue-and-white depended on cobalt imported from Iran | F1.13 spec §10 | Wording |
| CL-138 | register/claims_v0.csv | confidence | probable | contested | F1.13 spec §10 | Jiang et al. study Xuande-era wares; the abstract names no mine |
| CL-138 | register/claims_v0.csv | confidence_note | (empty) | Under review 3 Oct 2026: Anarak unverified: Jiang et al. study Xuande-era wares and the abstract names no mine. | F1.13 spec §10; F1.13 spec §9 | unverified or open: fact left as it is, flagged |
| CL-139 | register/claims_v0.csv | confidence_note | (empty) | Under review 3 Oct 2026: the date differs between sources; the 826 bowl is not on the page opened. | F1.13 spec §10 | unverified or open: fact left as it is, flagged |
| CL-139 | register/claims_v0.csv | confidence | documented | probable | F1.13 spec §10 | lowered while under review |
| CL-141 | register/claims_v0.csv | claim | From the 13th to the 16th century Kilwa's merchants traded gold, silver, pearls, perfumes, Persian earthenware and Chinese porcelain; Kilwa minted its own coins; its Great Mosque's vaults held set-in Chinese porcelain | From the 13th to the 16th century Kilwa's merchants traded gold, silver, pearls, perfumes, Arabian crockery, Persian earthenware and Chinese porcelain; Kilwa minted its own coins; its Great Mosque's roofs held set-in Chinese porcelain | F1.13 spec §10 (claim 6) | Add "Arabian crockery"; roofs, not vaults |
| CL-142 | register/claims_v0.csv | claim | The 1375 Catalan Atlas shows Mansa Musa of Mali holding a gold coin, "the richest and most noble lord" of the region because of its gold | The Catalan Atlas, conventionally dated 1375, calls Mansa Musa ("Musse Melly") "the richest and noblest of all these lands due to the abundance of gold" | F1.13 spec §10 (claim 13) | Use the published translation |
| CL-142 | register/claims_v0.csv | confidence | documented | probable | F1.13 spec §10 (claim 13) | Translation read via a summary |
| CL-146 | register/claims_v0.csv | claim | The first paper mill in Baghdad was set up in 794–95; the story that Chinese prisoners taken at Talas in 751 brought papermaking west is contested | The earliest documented paper mill in the Islamic world, at Baghdad, was set up in 794–95; the story that Chinese prisoners taken at Talas in 751 brought papermaking west is contested | F1.13 spec §10 | The Baghdad wording |
| CL-147 | register/claims_v0.csv | unit | F1.13 | F1.12 | F1.13 spec §10 | Handed to F1.12 |
| PRA143 | canon/canon_practices.csv | date_note | Inscribed 2011, Urgent Safeguarding | Inscribed 2011 (6.COM 8.10), Urgent Safeguarding | F1.13 spec §10 | Decision number added |
| WS-X05 | register/world_set_v0.csv | action | Commercial salvage; taught in F1.24 | Commercial salvage; held on the Indian Ocean grouping page (F1.24 leaves Belitung to the Atlas) | F1.13 spec §10 | Point to the Indian Ocean page |
| WS-X05 | register/world_set_v0.csv | roles | Excluded as an exemplar; taught in F1.24 as a case about salvage | Excluded as an exemplar; a case about salvage on the Indian Ocean grouping page | F1.13 spec §10 | Same |
| INS084 | canon/canon_makers_institutions.csv | units | F1.28;F1.29 | F1.28;F1.29;F1.17 | F1.17 spec §10 | Should list F1.17 |
| PRD107 | canon/canon_periods.csv | kind | period | calendar-or-era | F1.30 spec §4 (repo); specs/BATCH3_OVERVIEW.md; AUDIT §1.4 | New kind; F1.30 names these as the only calendar rows |
| PRD153 | canon/canon_periods.csv | kind | period | calendar-or-era | F1.30 spec §4 (repo); specs/BATCH3_OVERVIEW.md; AUDIT §1.4 | New kind; F1.30 names these as the only calendar rows |

Changes per file (field edits): canon/canon_additions_round2.csv 4; canon/canon_civilisations.csv 1; canon/canon_communities.csv 5; canon/canon_cultures_horizons.csv 4; canon/canon_dynasties.csv 2; canon/canon_events.csv 10; canon/canon_firsts.csv 20; canon/canon_makers_institutions.csv 13; canon/canon_materials.csv 4; canon/canon_movements_styles_schools.csv 4; canon/canon_networks.csv 2; canon/canon_object_types.csv 5; canon/canon_people.csv 8; canon/canon_periods.csv 3; canon/canon_places.csv 8; canon/canon_practices.csv 9; canon/canon_techniques.csv 11; register/claims_v0.csv 46; register/practices_v0.csv 5; register/world_set_v0.csv 79; sources/primary_texts.csv 9; sources/sources_zero_cost.csv 4. Total 256 field edits on 154 rows.

## 4. Not applied, and why

| Item | Source | Why not applied |
|---|---|---|
| Tornabuoni contract dated 1 September 1485; "pigments, sizes and the master's own hand" merges the Tornabuoni and Innocenti contracts; the "platform guideline screenshot (own capture)" becomes a dated link | F1.17 spec §10 ("Exemplar correction", "Dates") | The wording sits in F1 Pass 2 v1 (the F1.17 exemplar table, lines 256 and 265). Hub rule 5 makes pass records dated and frozen, and no canon or register row holds the contract (it is a proposed row). The F1.17 v3 spec already carries the fix; record it in the module file when that spec is adopted. The Innocenti date (28 October 1485) and Davies's "Oct. 1485" against 1 September are still to reconcile |
| CIV006 and ARC028 (Nok): merge | F1.6 spec §10 | A merge, not a fact fix. It belongs to the proposed-rows merge before loading (AUDIT §1.4) |
| New rows: a falaj practice row (practices register); an Ottoman Empire polity row | F1.9a spec §10; F1.10 spec §10 | New rows go in with the proposed-row merge, each with its source |
| CL-175: split the 1433 order from *guan da min shao* (1522–1620) | F1.8 spec §10, claims 13–14 | Needs a second claim id |
| CL-178: Jikji to F1.5 | F1.8 spec §10 | Needs the claim split; the unit field holds one unit |
| CL-188: add F1.5 | F1.5 spec §4 | `claims_v0.csv` holds one unit per claim; the source field already says "shared with F1.5" |
| CL-192: move with its case | F1.11 spec §10 | The destination unit is not named |
| CL-184: the dropped italic word ("India's  is one") | F1.9 spec §10 | "Old World" was fixed; the missing species name is not given, and F1.9 claim 3 names two species. Other dropped italics noticed, not listed as corrections: CL-146 and CL-156 sources ("Bloom, ,"), CL-181 source ("Barnes,  (1997)"), AS-001 title (", plates"), DOC-002 title ("plates"; F1.8 §5 calls it the *Yingzao fashi* plates) |
| WS-054: credit line | F1.7 spec §10 | The correction does not say what the credit line should be |
| WS-031: lost Marshallese name | F1.12 spec §10 | The name is not given (WS-033's Fijian name, *masi*, was) |
| MAT105: "defined by" is empty | Batch 3 overview | No value given |
| Karell's dates (Yates 1931–33 against F1.24's 1930–33); Meyer's dig (1908 item, 1909 article); Te Papa MU000049/008/0003 "c1920" in JPS vol. IV; Europeana dates the 1774 ordinance 1744; F1.18's Kanesh pointer | F1.7, F1.12, F1.11, F1.13 specs §10 | No canon or register row holds these facts (proposed rows or spec text). WS-032's new provenance says 1908–09 |
| CL-138 / module file research log item (4), "Early Chinese cobalt most likely came from Anarak" | F1.13 spec §9–10 | Unverified only: CL-138 is flagged and set to contested; the dated research-log entry is left as written |
| Batch 2: WS-100 missing from `world_set_v0.csv` | Batch 2 overview | Already present; F1.12a's open date questions are flagged on the row instead |
| Batch 3: PRA094 "extended 2025 is unverified" | Batch 3 overview | Superseded: batch 4 verified the 2025 inscription (20.COM, file 02291) and the row now says so |
| Batch 3 / F1.6: OCC175, quote "punitive expedition" from a primary British source | F1.6 spec §10 | The row was renamed "Sack of Benin City (1897)" and the term kept in quotation marks as other name; the primary British quotation is still to find |
| "Smithsonian Open Access (CC0)" in 101 other canon rows' `free_sources` (variants such as "CC0 where marked" appear in further rows) | AUDIT §1.4 names PRA044 only | Only PRA044 was named. A sweep to "licence varies by record" is proposed |
| "First known" wording: 100 rows of `canon_firsts.csv` still open "First …" | Brief; specs (rule 6) | Only the rows a spec names were changed (INV001, INV026, INV027, INV037, INV043, INV076, INV100, INV102, INV115, INV130, INV148, plus DYN005, MKR090, PER289, INS033, EVT001). The kind itself stays "first-known". A rule-6 sweep is proposed as its own pass |
| PDFs of the edited program documents; the live Claude Docs versions | `docs/README.md` | Only the Markdown exports were edited. The live documents (Module File, Phase 4 Foundations, Atlas Logic) need the same edits, then a re-export |
| Supabase seed files (`supabase/seed/*_canon_nodes.sql`, `041`–`043`, `084_schemas.sql`) | — | Generated snapshots; regenerate from the CSVs and the schema before the next load |
| Deep Dives 2 (`docs/05-deep-dives-2`), Pass 2 v1 and v2 | Hub rule 5 | Dated pass records, not edited. Note: the Atlas Logic table was edited because the task names the information model, although that document also calls itself a pass |
| The unit specs, the AUDIT file and the batch overviews | Task instruction | Not edited by instruction |

## 5. Proposed, not applied: Final Structure §9, the AI partner

Final Structure v3.0 (`docs/01-structure/final-structure-v3/index.md`, "The AI partner", lines 250–268) lists where each voice appears. For F1 it names only the Historian ("F1"). Proposed amendment, so each partner voice lists its F1 units (38 units in all):

| Voice | Where it appears (proposed text) | What it can see (proposed text) |
|---|---|---|
| The Mirror | Every Apply step; M1.8; M4.7; **in F1: F1.3, F1.4, F1.22a, F1.25** | The learner's artifact and the unit's concept. **In F1: the Apply output and the SRC lines it cites** |
| The Stranger | M2.15, M2.18; every Sx.21-type unit; R5.7; **in F1: F1.30a, and the test in F1.17** | The DNA or brief only, never the conversation. **In F1: the Rule Card (F1.30a) or the brief (F1.17) only, with the SRC lines it cites** |
| The Client | Briefs; M1.16; R3.3; R3.6a; S4.8; **in F1: F1.17, F1.21** | The DNA, the brief, the venture fields. **In F1: the Apply output (the brief) and the SRC lines it cites** |
| The Fabricator | M4.8; every studio brief; R3.6; T10; **in F1: F1.19, F1.19a, F1.28a** | The engine state, materials, tolerances. **In F1: the Apply output and the SRC lines it cites** |
| The CFO | S1.29, S2.34, S3.32; R2; R3.12 (no F1 unit) | Unchanged |
| The Historian | **F1: F1.1, F1.2, F1.5, F1.6, F1.7, F1.8, F1.9, F1.9a, F1.10, F1.11, F1.12, F1.12a, F1.13, F1.14, F1.15, F1.16, F1.18, F1.19b, F1.20, F1.23, F1.24, F1.26, F1.27, F1.28, F1.29, F1.30, F1.31**; M1.14; S2.11; S3.15; R2.7 | The world set, the sources, the attribution record. **In F1: also the Apply output and the SRC lines it cites** |
| The Planet | F5; Sx circularity; R4; **in F1: F1.22** | The Planetary Ledger and the BOM. **In F1: the Apply output and the SRC lines it cites** |

Proposed sentence under the table: "In F1 every voice reads the learner's Apply output and the SRC lines it cites. F1 has no DNA, BOM, engine state or venture fields, so the 'What it can see' entries above apply from the Method modules on."

Notes for whoever applies it:
- §9's "What it can see" column does not fit F1: the DNA, the brief's venture fields, the engine state, the Venture Console, the Planetary Ledger and the BOM do not exist in F1.
- The Mirror row says "Every Apply step". If that stays, the F1 list means "leads in", not "only in"; say which.
- The Stranger's F1.17 test runs inside a Client-led unit; the F1.17 spec should name both.
- AUDIT §1.2's voice table names "F1.22a, F1.25 and others in the register" for the Mirror; this list (F1.3, F1.4, F1.22a, F1.25) settles "others".
- The amendment goes into Final Structure (Hub rule 3) with a version note, not into the F1 module file.

## Round 3: proposed rows and queued fixes

Task "Merge F1's proposed canon rows and queued canon fixes into the repo canon (round 3)", 3 October 2026. Sources: section 4 ("Nodes", proposed canon rows) of all 38 current, fact-checked unit specs in the scratchpad (`f1-scope/specs/`, not the repo's older copies), and their sections 3 and 10 for the sources and the corrections. Method: an extraction script pulled every proposed item from section 4 (`register/extract_proposed.py` → `register/proposed_rows_raw.csv`, one line per item with its unit); grouped items ("A, B and C (people)") were split by hand and every item was mapped to one entity (`register/curate.py` → `register/entities.csv`); each entity was checked against the canon's names and other names; each new row was written from the spec's own claims and sources (`register/rows_b1.py`–`rows_b6.py`, assembled by `register/build.py`); every proposed item's outcome is in `register/proposed_rows_resolved.csv`. All paths are in the session scratchpad. Rules applied: "earliest known", never "first"; the community's own name first; confidence in words; a row without a source in the spec is held, not added. CSVs edited with Python's `csv` module (CRLF, QUOTE_MINIMAL; the existing files round-trip unchanged apart from the edited cells). Nothing was committed; the specs were not edited.

### Counts

- Raw items extracted from section 4: 464 (6 were note fragments, not rows).
- Proposed rows after splitting grouped items: 565, naming 535 distinct entities.
- Duplicates merged across units: 30 (on 29 entities proposed by two or three units; units joined with ";").
- New rows added: 438, in `atlas/data/canon/canon_additions_round3.csv` (same 22 columns as `canon_additions_round2.csv`).
- Proposed rows that already exist in the canon: 14; the unit was added to the existing row (12 rows changed, 2 needed no change). CIV006/ARC028 (Nok), queued as a merge, is handled below.
- Held, not added: 29 (23 with no source in the spec; 6 conditional in the spec or with the community's own name unconfirmed).
- Not added because the canon has no kind for them (primary texts, single objects, datasets, methods, an Atlas entity): 54.
- Queued fixes: 19 items queued; 11 rows changed (25 field edits), plus the new Abuja Pottery Training Centre row; 8 were already applied earlier today or needed no change.
- `python atlas/tools/validate_canon.py`: 4,666 rows in 20 files, 0 errors, 82 warnings (as before). `python tools/test_schema.py` (4 tests) and `python atlas/tools/test_tools.py` (7 tests) pass; `python tools/build_schema.py --check`: schema in sync.

### Queued fixes

| id | File | Field | Old | New | Source | Reason |
|---|---|---|---|---|---|---|
| TEC137 | canon/canon_techniques.csv | start | 1841 | 1842 | F1.1 spec claim 16 and §10 (https://www.vam.ac.uk/articles/thonet-and-the-invention-of-bentwood-furniture; https://museum-boppard.de/explore/thonet/) | No 1841 patent: the 1840 bid failed; the Austrian privilege for bending glued layers is dated 16 July 1842 |
| TEC137 | canon/canon_techniques.csv | date_note | Michael Thonet's patents from 1841; chair No. 14 (1859) | Austrian privilege for bending glued layers (laminated bending) 16 July 1842; the 1840 patent bid failed and 1841 is the year of the Koblenz fair; solid-wood steam bending 1855 (V&A) or 1856 (Museum Boppard); Koryčany factory built 1856, producing from 1857; chair No. 14 (1859) | F1.1 spec claims 16–17 and §10 (https://www.vam.ac.uk/articles/thonet-and-the-invention-of-bentwood-furniture; https://museum-boppard.de/explore/thonet/; https://www.korycany.knihovna.cz/osobnosti/michael-thonet/) | Thonet dates reconciled ("patents from 1841" was wrong) |
| TEC137 | canon/canon_techniques.csv | notes | (empty) | Dates: F1.1 spec claims 16–17 (https://www.vam.ac.uk/articles/thonet-and-the-invention-of-bentwood-furniture; https://museum-boppard.de/explore/thonet/). links: PER481; PLC420 | F1.1 spec claims 16–17 | Source for the corrected dates; links to the new Thonet rows |
| INS062 | canon/canon_makers_institutions.csv | start | 1849 | 1853 | F1.1 spec §10 (https://museum-boppard.de/explore/thonet/; https://www.thonet.de/en/company/story) | Gebrüder Thonet founded 1 November 1853; 1849 is the predecessor Vienna workshop |
| INS062 | canon/canon_makers_institutions.csv | date_note | approx.; chair no.14, 1859 | founded 1 November 1853 (Museum Boppard); the 1849 Vienna workshop was its predecessor; Koryčany factory built 1856, producing from 1857; chair no.14, 1859 | F1.1 spec §10 and claim 17 (https://museum-boppard.de/explore/thonet/; https://www.thonet.de/en/company/story) | Same |
| INS062 | canon/canon_makers_institutions.csv | free_sources | Met Open Access (CC0);MAK Vienna Sammlung Online (open-licence items; check);Cooper Hewitt Open Access (CC0 metadata; images where PD) | MAK Vienna Sammlung Online (open-licence items; check);Cooper Hewitt Open Access (CC0 metadata; images where PD) | F1.1 spec §5 and §10 | The Met's Thonet records are not public domain (isPublicDomain: false); drop the Met CC0 source |
| INS062 | canon/canon_makers_institutions.csv | notes | (empty) | Dates: Museum Boppard (https://museum-boppard.de/explore/thonet/); Thonet GmbH. links: PER481; PER482; PLC420 | F1.1 spec §10 | Source for the corrected dates; links to the new rows |
| OCC107 | canon/canon_events.csv | making_significance | British law gave textile print designers two months' copyright, the first design right for patterns. | British law gave textile print designers two months' copyright, an early design right for patterns. | F1.14 spec §10 | Rule 6: "the first design right" rephrased as "an early design right" |
| PER356 | canon/canon_people.csv | leaves_out | the Māori carvers and kowhaiwhai painters whose form he took | the Māori carvers and kōwhaiwhai painters whose form he took | F1.15 spec §10 | Macron: kowhaiwhai → kōwhaiwhai |
| PER032 | canon/canon_people.csv | date_note | born c. 1925 | born c. 1925; joined the Abuja Pottery Training Centre (founded 1952; 1951 is Cardew's appointment) in December 1954 | F1.18 spec claim 17 and §10 (https://post.moma.org/pots-mastery-and-the-enduring-legacy-of-ladi-dosei-kwali/; https://awarewomenartists.com/en/artiste/ladi-kwali/) | Abuja Pottery Training Centre founded 1952, not 1951 |
| PER032 | canon/canon_people.csv | notes | Pictured on the Nigerian 20 naira note. | Pictured on the Nigerian 20 naira note. links: INS122 | F1.18 spec §4 | Link to the new Abuja Pottery Training Centre row |
| OCC217 | canon/canon_events.csv | date_note | designed from 1941; first catalogue 1943; scheme to 1952 | designed for the Board of Trade from 1941; aim announced by Dalton in 1942; catalogue of 1943 (about 30 pieces, stamped CC41); scheme to 1952 | F1.19a spec claim 14 and §10 (https://museum.wales/blog/2168/Rationing-furniture-during-the-Second-World-War-/) | 1942 is the announcement year; design from 1941, catalogue 1943 |
| OCC217 | canon/canon_events.csv | notes | (empty) | Source: Museum Wales (Williams, 2020), https://museum.wales/blog/2168/Rationing-furniture-during-the-Second-World-War-/. links: OBT347 | F1.19a spec claim 14 | Source for the dates; link to the new CC41 row |
| MOV096 | canon/canon_movements_styles_schools.csv | start | 1926 | 1925 | F1.20 spec §10 (https://mingeikan.or.jp/about/history/?lang=en) | Museum: Yanagi, Kawai and Hamada coined the term in 1925; the 1926 prospectus came "the following year". Keep 1925 |
| MOV096 | canon/canon_movements_styles_schools.csv | date_note | approx.; 1925 (museum's date) or 1926 (manifesto) | approx.; term coined 1925 (Japan Folk Crafts Museum); museum prospectus 1926 | F1.20 spec §10 (https://mingeikan.or.jp/about/history/?lang=en) | 1925 versus 1926 resolved: both given, start 1925 |
| OCC175 | canon/canon_events.csv | name | Sack of Benin City (1897) | British invasion and looting of Benin City (1897; the British "punitive expedition") | F1.6 spec claim 15 and §10; F1.24 spec claims 1–2 and §10 (https://www.britishmuseum.org/about-us/british-museum-story/contested-objects-collection/benin-bronzes; https://www.nms.ac.uk/discover-catalogue/the-british-raid-on-benin-1897) | Lead with a neutral description; "punitive expedition" given only as the British name, in quotation marks |
| OCC175 | canon/canon_events.csv | other_names | British "punitive expedition" (the perpetrators' term) | Sack of Benin City; Siege of Benin (Cleveland's records); Benin Massacre of 1897 (Nigeria's 2023 declaration) | F1.24 spec claims 1–2; Cleveland 1999.1 | Earlier name kept; other names as the sources give them; the British term moved into the name, attributed |
| OCC175 | canon/canon_events.csv | notes | links: CIV012; DYN038; POL026; INS082. | links: CIV012; DYN038; POL026; INS082. "Punitive expedition" is the British term (National Museums Scotland quotes it as such); a primary British source is still to find (F1.6 spec §10). | F1.6 spec §10 | Attribution open |
| PRA159 | canon/canon_practices.csv | name | Traditional knowledge and skills in making Kyrgyz and Kazakh yurts (Turkic nomadic dwellings) | Traditional knowledge and skills in making Kyrgyz, Kazakh and Karakalpak yurts (Turkic nomadic dwellings) | F1.29 spec §10; F1.22a spec §10 (https://ich.unesco.org/en/RL/traditional-knowledge-and-skills-in-making-kyrgyz-kazakh-and-karakalpak-yurts-turkic-nomadic-dwellings-02284; https://ich.unesco.org/en/decisions/20.COM/7.B.53) | Element extended in 2025 and renamed to add Karakalpak |
| PRA159 | canon/canon_practices.csv | date_note | Inscribed 2014 (Kazakhstan, Kyrgyzstan); extended 2025 as 'Traditional knowledge and skills in making Kyrgyz, Kazakh and Karakalpak yurts' | Inscribed 2014 (9.COM; Kazakhstan, Kyrgyzstan; file 998); extended 2025 (20.COM 7.B.53) with Uzbekistan as 'Kyrgyz, Kazakh and Karakalpak yurts', file 02284 | F1.29 spec §10; F1.22a spec §10 | File and decision numbers added |
| PRA159 | canon/canon_practices.csv | defined_by | UNESCO ICH list (2014) | UNESCO ICH list (2014; 2025) | F1.29 spec §10 | Both inscriptions |
| MAT043 | canon/canon_materials.csv | start | -100 | -200 | F1.7 spec §10 (https://ia800509.us.archive.org/19/items/CochinealRedthearthistoryofacolor/CochinealRedthearthistoryofacolor_djvu.txt) | Phipps dates most Paracas burials from about the 2nd century BCE to the 2nd century CE |
| MAT043 | canon/canon_materials.csv | date_note | Paracas textiles, 1st c. BCE–2nd c. CE; New Spain export from 1520s | Paracas burials, mostly 2nd c. BCE–2nd c. CE (Phipps; no separate date for the cochineal finds); New Spain export from 1520s | F1.7 spec §10 (https://ia800509.us.archive.org/19/items/CochinealRedthearthistoryofacolor/CochinealRedthearthistoryofacolor_djvu.txt) | Same |
| TEC128 | canon/canon_techniques.csv | start | -100 | -200 | F1.7 spec §10 (https://ia800509.us.archive.org/19/items/CochinealRedthearthistoryofacolor/CochinealRedthearthistoryofacolor_djvu.txt) | Same as MAT043 |
| TEC128 | canon/canon_techniques.csv | date_note | Paracas textiles, 1st c. BCE–2nd c. CE; post-1521 export to Europe | Paracas burials, mostly 2nd c. BCE–2nd c. CE (Phipps; no separate date for the cochineal finds); post-1521 export to Europe | F1.7 spec §10 (https://ia800509.us.archive.org/19/items/CochinealRedthearthistoryofacolor/CochinealRedthearthistoryofacolor_djvu.txt) | Same |

Queued items with no edit:

- INV001: making_significance already reads "Earliest known writing" (applied earlier on 3 Oct 2026).
- OBT024: notes already read "likely symbolic (Cleveland's word)" (applied earlier on 3 Oct 2026).
- MKR047: end already empty and date_note "jamdani weaving continues today" (applied earlier on 3 Oct 2026).
- GAP072: date_note already gives the Chambre Syndicale de la Couture Parisienne from 14 December 1910 (applied earlier on 3 Oct 2026); the 1945 designation is a new row.
- GAP073: start already 1838 with Boucicaut's 1852 partnership in date_note (applied earlier on 3 Oct 2026).
- OBT042: start already 1860 (applied earlier on 3 Oct 2026); F1.21 spec §10 says AramcoWorld was not reopened, so the value stays as applied.
- STY122: materials_techniques already "gum tempera on mill paper" (applied earlier on 3 Oct 2026).
- PRD102: tier is already R3 in the canon; the F1.23 spec's own list was corrected ("PRD102 (High Qing) is R3 in the canon, not R2").

### Proposed rows merged into existing rows

| id | File | Field | Old | New | Source | Reason |
|---|---|---|---|---|---|---|
| PLC202 | canon/canon_places.csv | units | F1.24 | F1.24;F1.5 | F1.5 spec §4 (proposed National Museum of Korea) | Proposed row already exists |
| PLC198 | canon/canon_places.csv | units | F1.5 | F1.5;F1.8 | F1.8 spec §4 (proposed Sadang-ri) | Proposed row already exists |
| PLC203 | canon/canon_places.csv | units | F1.13;F1.14 | F1.13;F1.14;F1.8 | F1.8 spec §4 (proposed Izumiyama) | Proposed row already exists |
| PER191 | canon/canon_people.csv | units | F1.23;F1.13 | F1.23;F1.13;F1.8 | F1.8 spec §4 ("Kanagae Sanbei on PER191") | Name already in other_names |
| OCC111 | canon/canon_events.csv | other_names | Allarde decree; Le Chapelier Law | Allarde decree; décret d'Allarde; Le Chapelier Law | F1.11 spec §4 ("décret d'Allarde (merge into OCC111)") | Merge as the spec asks |
| OCC111 | canon/canon_events.csv | units | F1.17;F1.23 | F1.17;F1.23;F1.11 | F1.11 spec §4 | Same |
| PLC298 | canon/canon_places.csv | units | F1.23;F1.22 | F1.23;F1.22;F1.13 | F1.13 spec §4 ("Bahrain's pearling site (place; PLC298)") | Proposed row already exists |
| DIA010 | canon/canon_networks.csv | units | F1.13 | F1.13;F1.17 | F1.17 spec §4 (proposed Huguenots in London) | The Huguenot craftsmen diaspora covers London |
| PER412 | canon/canon_people.csv | units | F1.21;F1.18 | F1.21;F1.18;F1.19 | F1.19 spec §4 (proposed Ada Lovelace) | Proposed row already exists |
| PRA103 | canon/canon_practices.csv | units | F1.18;F1.13 | F1.18;F1.13;F1.19 | F1.19 spec §4 ("jamdani weaving (living practice; PR-015)") | Proposed row already exists |
| PER153 | canon/canon_people.csv | units | F1.18;F1.26 | F1.18;F1.26;F1.19b | F1.19b spec §4 ("Ray Eames (person, if missing)") | Not missing |
| PRA201 | canon/canon_practices.csv | units | F1.18 | F1.18;F1.27 | F1.27 spec §4 (proposed Hawaiian kapa making) | Proposed row already exists |
| PLC248 | canon/canon_places.csv | units | F1.13;F1.24 | F1.13;F1.24;F1.28a | F1.28a spec §4 (proposed Belitung wreck) | Proposed row already exists |
| CIV006 | canon/canon_civilisations.csv | units | F1.3;F1.24 | F1.3;F1.24;F1.6 | F1.6 spec §3–4 ("ARC028 (CIV006 duplicates it)"; CIV006 and ARC028 merge) | Both used in F1.6 step 2 |
| ARC028 | canon/canon_cultures_horizons.csv | units | F1.24;F1.5 | F1.24;F1.5;F1.6 | F1.6 spec §3–4 | Both used in F1.6 step 2 |
| CIV006 | canon/canon_civilisations.csv | notes | FLAG: 'civilisation' is misleading; routes to ARC Nok (existing). Terracottas heavily looted and faked; avoid market-sourced images. | FLAG: 'civilisation' is misleading; routes to ARC Nok (existing). Terracottas heavily looted and faked; avoid market-sourced images. Under review 3 Oct 2026: F1.6 spec asks to merge CIV006 into ARC028; kept as the civilisation-name label that routes to ARC028 (atlas rule: a civilisation name is a search label), not deleted. | F1.6 spec §10 ("CIV006 and ARC028 (merge)") | Merge left to a person: deleting CIV006 would remove the label row the Atlas uses |
| PRA087 | — | — | — | (unchanged) | F1.12a spec §4 | proposed "cosmos and airag (technique)" is the existing living-practice row; units already include F1.12a |
| GAP068 | — | — | — | (unchanged) | F1.20 spec §4 | proposed "Non-Aligned Movement (network, if GAP068 is not enough)": GAP068 already carries F1.20; not added |

Also merged within the new rows: F1.21's note that "the 2025 AI rulings are also proposed by F1.14" (Getty Images v Stability AI and the US Copyright Office report carry F1.14;F1.21).

### New rows

All in `atlas/data/canon/canon_additions_round3.csv`; ids continue each prefix series after the highest existing number (exhibitions continue EVT, other events OCC, calendars and eras PRD). Each row names its source in `notes` ("Source: …", with the spec claim) and a zero-cost route in `free_sources`; cross-links to other rows are in `notes` ("links: …"). Tier R3 unless noted; confidence follows the spec's own grading.

| Prefix | Ids | Rows | Kinds |
|---|---|---|---|
| ARC | ARC231–ARC232 | 2 | archaeological-culture |
| BEL | BEL056–BEL056 | 1 | belief-tradition |
| COM | COM301–COM308 | 8 | community |
| DIA | DIA013–DIA013 | 1 | diaspora |
| EVT | EVT033–EVT035 | 3 | event |
| INS | INS094–INS156 | 63 | institution |
| MAT | MAT129–MAT138 | 10 | material |
| MKR | MKR094–MKR105 | 12 | maker-community |
| MOV | MOV107–MOV107 | 1 | movement |
| NET | NET064–NET066 | 3 | network |
| OBT | OBT324–OBT364 | 41 | object-type |
| OCC | OCC295–OCC346 | 52 | event |
| PER | PER481–PER609 | 129 | person |
| PLC | PLC420–PLC495 | 76 | place |
| POL | POL241–POL241 | 1 | polity |
| PRA | PRA215–PRA225 | 11 | living-practice |
| PRD | PRD221–PRD231 | 11 | calendar-or-era, period |
| STY | STY181–STY183 | 3 | style |
| TEC | TEC231–TEC240 | 10 | technique |

Cross-unit duplicates resolved to one row: Ottoman Empire (F1.1;F1.10); Navajo Nation v. Urban Outfitters (2012–2016) (F1.2;F1.24); Karamu House and the Gilpin Players (F1.2;F1.6); Douroula (F1.5;F1.6); Deir el-Bahri (Tomb MMA 101) (F1.5;F1.6); Hōryūji (F1.5;F1.16); Hyakumantō darani (F1.5;F1.16); Kemondo Bay (sites KM2 and KM3) (F1.6;F1.28a); Churro sheep wool (F1.7;F1.25); Bayeta (F1.7;F1.25); Germantown yarn (F1.7;F1.25); Qompi (cumbi cloth) (F1.7;F1.18); Diné wearing blanket (F1.7;F1.22a); Sven Karell (F1.7;F1.24); Emi rebellion (764) (F1.8;F1.16); Polynesian Voyaging Society (F1.12;F1.28a); First Nations cultural protocols, third edition (2020) (F1.12;F1.31); Ordos bronzes (F1.12a;F1.25); Mongol nomad migration (F1.12a;F1.22a); Didier, Petit et Cie (F1.17;F1.19); Guillaume Boucher (F1.19a;F1.23;F1.28); Nasij (cloth of gold) (F1.19a;F1.28); Battle of Talas (751) (F1.27;F1.30a).

### Held (not added)

| Proposed row | Kind | Unit(s) | Why held |
|---|---|---|---|
| Clay, unfired and sun-dried | material | F1.1 | F1.1 spec names the row but cites no source for it |
| Tholu bommalata | living-practice | F1.4 | F1.4 spec names the row but cites no source for it |
| Abakaliki ores | place | F1.6 | F1.6 spec names the ores only among those left out by the credit; no source given |
| Zurak ores | place | F1.6 | F1.6 spec names the row but cites no source for it |
| Kemondo Bay (sites KM2 and KM3) | place | F1.6;F1.28a | F1.6 and F1.28a specs name the row but cite no source for Kemondo Bay or sites KM2 and KM3 |
| Manuelito | person | F1.7 | F1.7 spec names him among holders and agents only; no claim or source for a row |
| Directorate of Imperial Provisions | institution | F1.8 | F1.8 spec names the Directorate only among commissioners; no source given |
| Trade-cloth fragment | object-type | F1.9 | F1.9 spec names the object type but cites no source for it |
| Jamdani geographical indication, Bangladesh (2016) | event | F1.9 | F1.9 spec gives only "Daily Star, 2026; verify": no source opened |
| Ra's al-Jinz | place | F1.9a | F1.9a spec names the site only as a link-out with no source page given |
| George Augustus Robinson | person | F1.12 | F1.12 spec links his 1841 drawings but gives no source page for a row |
| Women's Guild of Arts | institution | F1.18 | F1.18 spec names the row (1907) but cites no source for it |
| Gordon Russell | person | F1.19a | F1.19a spec names him only among people in the records; no claim or source for a row |
| Black Star Square, Accra | place | F1.20 | F1.20 spec names Black Star Square only as a link-out; no source page given |
| Victor Adegbite | person | F1.20 | F1.20 spec names him only; no claim or source for a row |
| Marie Vernet Worth | person | F1.21 | F1.21 spec names her only; no claim or source for a row |
| Kolwezi | place | F1.22 | F1.22 spec names the row but cites no source naming Kolwezi |
| Museo Nacional de Arqueología, Antropología e Historia del Perú | institution | F1.24 | Name unclear: F1.24 proposes "Museo Nacional de Arqueología" but its claim names MUNA; whether MUNA holds the textiles is unverified |
| Declaration on the Importance and Value of Universal Museums (2002) | event | F1.24 | F1.24 spec names the declaration but cites no source for it |
| San Pablito Pahuatlán | place | F1.27 | F1.27 spec names the place in its cases with no claim or source page |
| Mount Pleasant, South Carolina | place | F1.29 | F1.29 spec names the place but cites no source for it |
| Belanda Hitam (1831–1872) | diaspora | F1.30a | F1.30a spec names the group and its scholar but cites no source page |
| Joseon Folk Art Museum | institution | F1.31 | F1.31 spec names the museum (1924) but cites no source for it |
| Ayuujk blouse | object-type | F1.2 | conditional in the spec (only if OBT040 huipil is the wrong term; check with a community source) |
| Shona | community | F1.6 | own name (endonym) to confirm, per the spec |
| Azande | community | F1.6 | own name (endonym) to confirm, per the spec |
| Hanunóo Mangyan | community | F1.29 | self-name to check, per the spec |
| Long Soldier | person | F1.30 | the spec asks for community review before the row is made |
| Lone Dog | person | F1.30 | the spec asks for community review before the row is made |

### Not added: no canon kind

These belong in other registers (primary texts in `sources/primary_texts.csv`, single objects in the world set, datasets and editions in `sources/sources_zero_cost.csv`) or are methods; none was written there in this task.

| Proposed row | Unit(s) | Where it belongs |
|---|---|---|
| L'Ami des hommes | F1.3 | primary text (TXT register, sources/primary_texts.csv) |
| PeriodO | F1.3 | a data source (sources/sources_zero_cost.csv), not a canon kind |
| Childe, "The Urban Revolution" (1950) | F1.3 | primary text (TXT register) |
| Thomsen, Ledetraad (1836) | F1.3 | primary text (TXT register) |
| "Fine arts" versus "decorative/applied arts" | F1.3 | an idea row; the canon has no idea kind |
| M. S. Dimand, A Handbook of Mohammedan Decorative Arts (1930) | F1.3 | primary text (TXT register) |
| BM 33333,b rules tablet | F1.4 | primary text (TXT register) |
| Cascajal block | F1.5 | single object (world-set register); the canon has no object kind |
| Digital Benin | F1.6 | a dataset (sources register), not a canon kind |
| Huexotzinco Codex | F1.7 | single object (world-set row, as the spec says) |
| Santa Valley khipus | F1.7 | object group (world-set register); the canon has no object kind |
| Collata khipus | F1.7 | object group (world-set register); sacred, never shown |
| Da Ming huidian | F1.8 | primary text (TXT register) |
| Akbar's Hamzanama | F1.9 | single object (world-set register) |
| Persepolis Fortification Archive | F1.9a | primary text (TXT register) |
| Het Menselyk Bedryf | F1.11 | primary text (TXT register) |
| Hōkūleʻa | F1.12;F1.28a | single object (a named canoe; world-set register) |
| Turkestan Album | F1.12a;F1.22 | primary source (TXT register) |
| Night-Shining White | F1.12a | single object (world-set register) |
| Catalan Atlas | F1.13 | single object and text (world-set and TXT registers) |
| Topkapı Scroll | F1.15 | primary text (TXT register) |
| Official Descriptive and Illustrated Catalogue (1851) | F1.15 | primary text (TXT register) |
| Daniel Sheets Dye, A Grammar of Chinese Lattice (1937) | F1.15 | primary text (TXT register) |
| Riegl, Stilfragen (1893) | F1.15 | primary text (TXT register); Riegl is PER426 |
| Tripitaka Koreana | F1.16 | single object set (world-set register) |
| Tornabuoni contract (1485) | F1.17 | primary text (TXT register) |
| Innocenti contract (1485) | F1.17 | primary text (TXT register) |
| Downes, The Building Erected in Hyde Park (1852) | F1.19 | primary text (TXT register) |
| Carpini, Ystoria Mongalorum | F1.19a | primary text (TXT register) |
| Silver tree of Karakorum | F1.19a;F1.28 | single object known only from text (world-set or TXT) |
| Mustard Seed Garden Manual of Painting | F1.19b | primary text (TXT register) |
| Eames, India Report (1958) | F1.19b;F1.31 | primary text (TXT register) |
| Casement Report (1904) | F1.22 | primary text (TXT register) |
| Nil Darpan (1860) | F1.22 | primary text (TXT register) |
| Bakōhan | F1.22a | single object (world-set register) |
| Strike Papyrus (Turin Cat. 1880) | F1.23 | primary text (TXT register) |
| Gweagal spears and Gweagal shield | F1.24 | single objects (world-set register) |
| Slow looking | F1.25 | a method; the canon has no method kind |
| Object Autopsy and Practice Reading | F1.25 | F1 methods; the canon has no method kind |
| Sogdian Ancient Letters | F1.27;F1.30a | primary text (TXT register; F1.30a: link only) |
| Mount Mugh documents (Devastich's archive) | F1.27;F1.30a | primary text (TXT register) |
| Missal of Silos | F1.27 | single object (world-set register) |
| Digital Florentine Codex | F1.28 | a digital edition (sources register) |
| Hawaiʻiloa | F1.28a | single object (a named canoe; world-set register) |
| Jewel of Muscat | F1.28a | single object (a named ship; world-set register) |
| Experimental archaeology | F1.28a | a method; the canon has no method kind |
| Secret History of the Mongols | F1.30 | primary text (TXT register) |
| Dīwān Lughāt al-Turk | F1.30 | primary text (TXT register) |
| Orkhon inscriptions | F1.30 | primary text (TXT register) |
| IntCal20 calibration | F1.30 | a method; the canon has no method kind |
| Regional slot | F1.31 | an Atlas entity, not a canon kind |
| Lorimer, Gazetteer of the Persian Gulf (1908–15) | F1.31 | primary text (TXT register) |
| Taan 2024 | F1.31 | a source (sources register) |
| Shehab and Nawar 2020 | F1.31 | a text (sources register) |

### Derived files

- Regenerated with the repo's own scripts: `atlas/reports/coverage.md` and `coverage.json` (`python tools/coverage.py`), and `atlas/reports/validation.txt` (the validator's output).
- Not regenerated: `exports/F1_canon_register_v2.xlsx` (its builder, `build/canon/build_xlsx.py`, is archived with the note "do not re-run the build scripts"); the Supabase seed files (`supabase/seed/*_canon_nodes.sql`), generated snapshots with no generator script in the repo; the node counts written in prose ("4,228 nodes") in `atlas/README.md`, the module and repository READMEs and `schema/registers.md`, which now read 4,666 in the CSVs. The canon has no JSON copy.

### Open

- The 29 held rows need a source (or the community's reading) before they go in; the 54 rows routed to other registers were not written there.
- New rows carry what the specs' sources support and no more; facts the specs mark as open stay flagged in each row's `notes` (for example the Nōgaku UNESCO status, Bunuba attribution, Paracas counts, the Talas legend, the Ka Mate statute spelling).
- Places: existing PLC rows put the location in `other_names`; most new place rows use it for other names. Align in a later pass if the Atlas relies on it.
- OCC175: a primary British source for "punitive expedition" is still to find (F1.6 spec §10).

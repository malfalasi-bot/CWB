# F1 repository audit: shortcomings, faults, gaps, contradictions and risks

20 October 2026 · read across docs/, specs/, briefs/, atlas/data/, grouping-pages/, build/, research_notes/, review-logs/, reports/, skills/ · figures counted with Python from the files named; nothing below is from memory.

Scope note. The module holds about 3.4 MB of Markdown, 4,666 canon rows, 799 register claims, 374 world-set rows, 38 specs, 28 grouping-page drafts and about 14,000 build files (mostly `node_modules` and `dist`). The audit reads every planning and process document, samples the data by script, and reads the build manifests and the research notes of the last three weeks.

## Ranked issues

Severity: **high** = blocks G3 or exposes the programme to a factual, legal or community-relations failure; **medium** = produces wrong figures or wasted work if left; **low** = hygiene.

### H1. The canon has no row-level sources. Its "sources" are route names, and 92% of rows have never been checked by anyone

- `atlas/data/canon/*.csv`, 4,666 rows: **0 rows** cite a `SRCnnn` or `TXTnnn` id from `data/sources/`, and **0 rows** carry a URL in `free_sources` or `defined_by`. `free_sources` holds route names ("Met Open Access (CC0);Cleveland Museum of Art Open Access (CC0);Wikimedia Commons" on GAP001–GAP005; "Wikimedia Commons" alone on MAT089). `defined_by` is a role word: "historians" (580 rows), "museum and archaeological typology" (323), "archaeologists" (320), "the community" (307), "himself" (182), "herself" (114).
- 434 rows (9%) have a URL somewhere in `notes`; those are the only traceable facts in the canon.
- The nine review logs touch **362 distinct canon ids (7.8%)**. Of the 571 verification URLs in `review-logs/`, **133 (24%) are en.wikipedia.org**; in `REVIEW_LOG_round2_communities.md` it is 73 of 95 (77%), on the living-community rows where the protocol asks for the community's own sources. Ten verification URLs are `exa.ai/library/...` links (search-tool caches, not citable).
- The skill's own constitution (`research_notes/Ballet/RETHINK.md`, rule 1: "Every date, number and attribution is a record with its source") and SKILL.md ("every claim with its source and its confidence") are not met by the module's largest dataset. The Atlas hub (`build/atlas-hub`) already serves 1,218 of these rows to learners as node cards.
- Flagged-but-unswept wording persists: "Smithsonian Open Access (CC0)" in **101 rows** (the 3 Oct corrections log §4 says it is wrong, "a sweep is proposed"); "EMKP (CC)" in 11 rows while the module file (finding 5.1) and `atlas/DATA_LICENCES.md` record EMKP as CC BY-NC-SA, link only.

### H2. Nothing learner-facing exists inside the syllabus. The one built unit (Edo) is outside the 38 units, and three weeks of build went into it and its tooling

- 38 specs exist, but **37 of 38** still read "To write against template v3.1" in both the Storyboard and Narration script rows (only `specs/F1.25.md` has a tour). No unit has a built page.
- The Edo unit (`build/units/edo`, 208 MB, 71 beats, 4,083 words, 56 images, labs, 3D, published artifact) is named in **no spec, no doc and no brief**: `grep -rli "floating world|Edo unit" specs docs briefs` returns nothing; `specs/F1.8.md` mentions Hokusai 0 times and ukiyo-e once. The Atlas hub README says Edo sits "inside F1.8"; F1.8's spec does not know it.
- The work dated 4–20 October is almost entirely Edo-adjacent or meta: the Edo v3/v4 builds, the Concept Composer (`build/compiler`, 9 versions, 60 MB, no README), two Edo prototypes, the motion/layers study, the scene framework, the design-language skill (3 versions in one day, 248 files of eval runs), a reference study of twenty images, an expandability study, and a research run on **ballet** (`research_notes/Ballet/`, 5 files, not an F1 unit).
- What a learner could read today: the Edo artifact; the Atlas hub; the F1.13 lecture player (9 stations, 1,619 narrated words, **0 images** of its five open objects, 8 lint errors in `research_notes/F1.13 method run/lint_lecture.txt`); six F1.13 mock pages; one object-page viewer. Grouping pages are 28 Markdown drafts, not pages. World-band cards: **1 of 99** (`grouping-pages/bands/README.md`).
- No narration audio exists anywhere: 8 grouping pages and the lectures README promise "Narration: Kokoro"; `find build -iname "*.mp3" -o -iname "*.wav"` returns 0 files.

### H3. The design skill mislocates the specs, and the F1.13 run built on that error

- `skills/histories-of-making-design/references/method.md` step 1: "Read, in this order: the unit spec (`docs/*/NN-f1-N-*.md`)". That pattern matches only `docs/10-unit-specs-batch-1/` (eight units). The 38 authoritative specs are in `specs/F1.N.md`; the skill never names that folder.
- `research_notes/F1.13 method run/research.md` §1: "No batch-1 spec exists for F1.13 (`docs/10-unit-specs-batch-1/` covers F1.1–4, 14, 15, 16, 18)". `specs/F1.13.md` is 40,510 bytes, batch 5, 25 claims, and was the declared source of the lecture built on 4 October (`build/lectures/F1.13/STORYBOARD.md`: "Built 4 October 2026 from `specs/F1.13.md`"). STUDY.md repeats "no unit spec yet".
- The run therefore wrote a **third claims store** for one unit (`claims.yaml`, 94 records, "Unfrozen until the editor signs it") instead of extending `claims_specs_v1.csv`, and planned work the spec already holds (protocol screen, open objects, reader decisions AR-080 to AR-086).
- The same defect will recur for 30 of 38 units the next time the method is run.

### H4. Licence rules and the builds disagree; verification fields are absent where the rules require them

- `atlas/DATA_LICENCES.md`: "British Museum, V&A, Gallica, Bodleian, EMKP, Smarthistory | Non-commercial | Link only". `build/units/edo/content/images.json` embeds **29 Wikimedia Commons files tagged only "Public domain"**, among them three British Museum photographs (`gishi` = BM 1906,1220,0.1163; `t-kanagawa` = BM-03; `portrait-kuniyoshi` = BM 1912,0416,0.222), two MFA Boston (`t-hakone`, `t-kanbara`), one Brooklyn, one MIA, two LACMA, one NDL. The PD-Art position is arguable, but it is not the module's recorded position, and **0 of 49 entries** carry a verified, checked or record-URL field. `README.md` of the unit says credits are in `public/img/images.json`; the file is at `content/images.json`.
- `world_set_specs_v1.csv`, status "open": **7 rows** have `provenance_test = fail` (F1.24-O03/O04/O05, F1.5-O05, F1.8-O11, F1.12a-O03/O06), 2 `colonial-gap`, 2 `enquiry`. The rule (`atlas/README.md`) is that a failing object "is taught as a case"; v0 had a `case` status, v1 dropped it, so failures now sit as open exemplars. 25 open-ish rows carry licence "To check", "Not checked", "CC0 (unverified)" or blank.
- Allowed-licence lists differ by file: `briefs/TEMPLATE_v3.1_AMENDMENT.md` (CC0, PD, CC BY, CC BY-SA, KOGL Type 1, own, link out); `build/units/shared/BUILD_BRIEF.md` and `ARCH_V4.md` add ODC-By; `DECISIONS_2026-10-03.md` decision 3 adds MIT datasets; `briefs/BRIEF.md` still offers "British Museum EMKP (CC)" as a free route.
- Decision 18 (switch Rijksmuseum AK-MAK-1330 to 1329) is unapplied: `specs/F1.12a.md` uses AK-MAK-1330 seven times, with the row itself saying "unverified: the URL used opens AK-MAK-1329".
- Map and font data are clean: Natural Earth via `world-atlas` (public domain), GeoNames `cities.json` (CC BY 4.0, credited in the lecture), Google Fonts OFL. No OSM/ODbL use was found in any build (the grep hits are "woodblock").

### H5. Nothing is frozen and nobody human has signed anything

- `DECISIONS_2026-10-03.md` lists 21 decisions "Unless you say otherwise, the default stands". Seventeen days later no answers are recorded, and the defaults were not applied either: decision 7 (guild spelling) leaves three spellings live (`specs/F1.6.md` "Ìgùn Ẹ́rọ̀nwwọ̀" twice, "Igun Eronmwon" in five specs); decision 18 unapplied (above).
- No file in the module contains a human sign-off, a reader's clearance or an approval line (grep for "signed off", "cleared by", "approved by", "community reader … cleared": 0 relevant hits). `review-logs/AI_READER_LOG.md` is explicit: "**This is not a community reading**"; 109 items, **55 with no community guidance found**, 81 REVISE outcomes applied to the specs anyway.
- The `claims-v1` freeze named in `claims.yaml` has not happened; `verified_in` on 112 world-set rows is "spec v3" (i.e. the drafting agent's own word).
- Open from 3 October: 129 lint flags on "first / invented / discovered / anonymous" ("each needs a person's look before G3"); 164 of 472 fact-check items unverified; about 23 reader holds across 13 communities; the "First" sweep (`canon_firsts.csv`: **100 of 174** rows still open "First …", 14 "Earliest"); the 101-row Smithsonian sweep; the Nok merge (CIV006/ARC028).
- The register that the Edo unit and the lecture draw on has no changelog; the three canon counts in circulation (4,228 in `README.md` and `atlas/README.md`; 4,661 in `exports/F1_canon_register_v2.xlsx`; 4,666 in the CSVs) cannot be reconciled from the files.

### H6. The claims register is weaker than its "documented" labels say

- `atlas/data/register/claims_specs_v1.csv`, 799 claims: **97 (12%) have no URL** (10 "Our own argument [depth: n/a]", 5 "the unit's own framing", 1 "none opened"); 38 of those 97 are marked "documented".
- 58 source URLs are en.wikipedia.org (third most common domain after Cleveland's API and metmuseum.org). **45 claims rest only on Wikipedia, Britannica or a blog; 28 of them are marked "documented"** (e.g. F1.3-C02 Wikipedia "Civilization"; F1.15-C13 Wikipedia "Yingzao Fashi"; F1.23-C02 Wikipedia "David Drake (potter)"; F1.25-C12 Britannica "Navajo weaving"). `AUDIT_2026-10-02.md` §1.3 named these replacements two and a half weeks ago.
- **400 claims (50%) have no reading-depth note**, which the fact-check brief requires; **168 (21%) were read through a search extract, summary or abstract, or not opened**, and 122 of those are "documented".
- Two registers coexist with different id schemes: `claims_v0.csv` (110, `CL-101…`, 30 without any source, 100% without a URL) and `claims_specs_v1.csv` (799, `F1.n-Cnn`). The Edo unit has a fourth store (`content.json`, 105 sources: **26 en.wikipedia.org, 3 `exa.ai/library` links**; 33 of 71 beats cite Wikipedia, 3 beats cite nothing else). The F1.13 run added a fifth (`claims.yaml`). Grouping pages hold about 30 claims each (28 pages) in none of them.

### M7. The coverage report overstates coverage by about 2.3× and mislabels candidates as verified

- `atlas/tools/coverage.py` line 33: a row with a start and no end counts to 2100. **1,624 rows** have a start and no end (298 communities, 201 object types, 199 techniques, 186 places, 169 "firsts", 95 institutions). "Koryčany Thonet factory" (PLC420, built 1856) counts in B10 and B11; "Abydos tomb U-j" (PLC427, −3320) counts in nine bands.
- Recount with open-ended rows in their start band only: cell-counts fall from **20,374 to 8,921**; cells under 5 rows rise from 41 to 98 of 506; zero cells from 6 to 8.
- The second grid, "Verified open objects per cell (licence safe to host)", counts `data/harvested/objects.json`: 414 rows, **every one `status: candidate`** (300 AIC, 114 Cleveland), none person-checked. Even so, 317 of 506 cells are zero; Africa before 1400, Amazonia, Iberia and Micronesia are empty in every band.

### M8. The Atlas is a map without coordinates

- The canon schema (`tools/codes.py` HEADER) has no lat/lon column; **0 of 495 place rows** carry coordinates. The F1.13 benchmark records "coordinates in the canon (0 of 125)".
- `build/atlas-hub/README.md`: of 771 place-anchored rows, **81 exact, 259 approximate, 422 "listed but never pinned"**, 9 dropped; 327 world-set objects are pinned at their *holders* (so the globe largely maps Cleveland and the Met).
- The fix was downloaded and never joined: `data/backbone/places_pleiades.csv` has 42,482 rows with lat/lon and 0 canon ids; `movements_wikidata.csv` 4,194 rows, 0 canon ids; `data/matches/wikidata_candidates.csv` 300 candidates, 0 accepted; the `wikidata_accepted.csv` that `atlas/README.md` says a person maintains does not exist; the Getty step fails with HTTP 403 (`reports/backbone_errors.md`).

### M9. 2,660 sensitive rows have flags but no protocol level

- Sensitivity flags: living-community 1,073, Indigenous-community 819, sacred 678, human-flow 449, funerary 438, conflict-looting 387, ancestral 113. `references/protocol.md` says every such item "is assigned one level in the register before it is designed"; neither the canon nor `world_set_specs_v1.csv` has a level column. 2,535 of the 2,660 flagged rows carry no protocol wording anywhere in `notes` or `leaves_out`. Of the 1,538 R1+R2 rows, 1,008 are flagged.
- `reports/validation.txt`: 83 warnings open since 3 October, including a banned phrase ("tribal", EVT026) and 70-odd "leaves_out names coerced labour; decide whether the row needs human-flow".

### M10. The world-set register is un-deduplicated and un-normalised

- `world_set_specs_v1.csv`: **28 holder+accession pairs appear more than once**; Cleveland 1940.469 and 1921.556 appear six times each, 1962.154 three times. The holder is spelled five ways ("Cleveland", "Cleveland Museum of Art", "Met", "The Met", "The Metropolitan Museum of Art"). `history_gap` is empty on 95 rows and "—" on 49; `met_object_id` is empty on 306.
- `world_set_v0.csv` (77 rows) remains beside v1 (374) with 59 of its 60 accessions duplicated in v1.

### M11. The top-level documents are stale and contradict the files they describe

- `README.md`: "35 units at structure v3.6"; there are 38 specs and round 2 records v3.8. "canon register (4,228 nodes)"; the CSVs hold 4,666. "Five grouping pages"; there are 28 files. "Spec batch 1 (eight units) was written"; all five batches exist. `atlas/README.md`: 4,228 nodes, "64 objects", "claims (110)".
- `build/units/edo/README.md` is headed "unit build (v3)" for the v4 build and names the wrong credits path. `build/units/shared/BUILD_BRIEF.md` is superseded by `ARCH_V4.md` but is still the file `LINKS.md` and the Atlas hub point to.
- Unit titles differ between the module file and the specs (F1.12 "Oceania and the Pacific" vs "Australia and the Pacific"; F1.13 "objects, materials and skills" vs "…and people"; F1.11 "one world among several" vs "Europe and the Mediterranean, read through the guild"). Two Indus pages coexist (`grouping-pages/indus_valley.md` and `civilisations/indus_valley.md`, the second saying it supersedes the first).

### M12. The teaching method was reset four times in three weeks and the specs reflect none of the resets

- 29 Sep template v3: prediction first, typed Apply, labs that reconstruct. 3 Oct v3.1 amendment: tap predictions, station tours, "watch first". 4 Oct `ARCH_V4.md`: "3.5D" scrollytelling, labs, 3D, character cards. 12 Oct: scene framework, beats, motion layers. 20 Oct `research_notes/Ballet/RETHINK.md`: "the structure half has overgrown: 33 components", the clearest things on the web are "an object taken apart … a workshop walked room by room … an essay whose images carry full captions"; "Everything else in the skill becomes a toolbox".
- On the same day SKILL.md v3 still opens "Do not skip it for 'quick' pages" and tabulates 33 mandatory components. The specs still carry only the 3 Oct amendment (storyboard rows "To write"). No document records which of these is current.

### M13. Rules live in at least nine places and nobody owns the merge

- The "earliest known, never first" rule is restated in 22 files. Writing, licence, protocol and build rules appear in `briefs/SPEC_BRIEF.md`, `TEMPLATE_v3.1_AMENDMENT.md`, `PAGE_TEMPLATES_v1.md`, `BUILD_BRIEF.md`, `ARCH_V4.md`, `skills/.../SKILL.md` and its 11 references, `LINKS.md`, `atlas/README.md`, `DATA_LICENCES.md`, and the program-level voice guide (`/home/claude/creative-world/docs/02-program/voice-guide`). `LINKS.md` has become the de-facto index of what exists, by date.
- Concrete divergences: licence allowed-sets (H4); "Mirror at every Apply step" (program Final Structure §9) against decision 2 (four units); `briefs/BRIEF.md` naming EMKP as free; the lint rule 20 literal "Station to add: simultaneity" against the bold-markup form actually written into F1.6/F1.8/F1.9/F1.11/F1.12a.

### M14. Grouping pages: drafts without records, and 1 of 99 band cards

- 28 drafts (5 round-2 pages of 2,400–2,900 words; 11 civilisation pages of 7,000–9,000; 11 movement pages of 6,000–7,500; 1 band card of 6,115). Scope v2 promised 60 Ring-1 pages and 210 walks; the Atlas logic 60 pages. Each page carries 18–30 claims and "proposed PLC/MKR rows" that are in no register (`claims_specs_v1.csv` is 100% `from = spec v3`). Wikipedia is cited 13 times in `arts_and_crafts.md`, 11 in `art-deco.md`, 10 each in `angkor.md`, `cahokia.md`, `indian_ocean.md`, `waqf.md`.

### M15. Non-European coverage: the promise and the numbers

- Canon sub-region shares: Asia 26%, Europe 19%, Americas 17%, Africa 16%, West Asia 13%, Oceania 6%, global 4%. By world chapter: F1.11 Europe 1,037 rows, F1.7 Americas 934, F1.6 Africa 803, F1.12 Pacific 321, F1.12a steppe 243. Scope v2's "all 93 civilisation names at R2": 81 of 93 are R3.
- Where it matters, the verified-object grid is empty: Africa has no counted open object before B08 in any sub-region; OC-AUS has 5 objects in all bands; OC-MIC 0. World-set holders: Cleveland 137 rows, the Met 85, AIC 15, Rijksmuseum 12, Te Papa and Smithsonian near 0 (the "museum as author" problem F1.24 teaches). `AUDIT_2026-10-02.md` §2.1–2.2 named this; batches 4–5 did not move the holder mix.

### M16. The same error kinds recur in every pass, and the catch rate on the built pages is still non-zero

- Round 2 (29 Sep): priority rows wrong at c. 14% (places/events 22 of 153; people 16 of 124), random rows 2–2.5%. Error kinds: invented or wrong dates (PER320 "1500"), living people described as dead or vice versa (Friedeberg, Graburn), overstated claims (CL-181), "first" wording, exonyms.
- 3 Oct sweep: 472 items, 88 corrected (19%), 164 unverified (35%). Voice lint: 129 flags.
- 20 Oct: the lint on the already-built F1.13 lecture still finds **8 errors** of exactly these kinds (a contested death year driving a tick; "1590s" against "1592–98"; missing confidence words). The Edo beats use "first" 8 times against the unit's own rule ("earliest known", never "first"). Nothing in the process stops a page shipping with these; the Edo unit shipped with a Japanese reader's pass still "to do" (`build/prototypes/edo-story/README.md`).

### L17. Hygiene

- Dead or superseded work left in place: `build/compiler` (last touched 6 Oct, no README, 60 MB), `build/prototypes/*` (superseded 4 Oct), three superseded artifacts in `LINKS.md`, `build/register` and `build/canon` scripts whose paths point at a scratch workspace, `research/audit-2026-10-03/claims.csv` (a sixth claims file).
- `exa.ai/library/...` used as a citation in 3 Edo sources and 10 review-log checks; these are not stable or reader-openable.
- Skill evals: pass rate graded by the skill's own grader; the skill costs +280 s and +40k tokens per task (iteration-1 benchmark) for a +40 point self-graded pass rate.
- `.github/workflows/harvest.yml` exists at the repository root but `data/harvested/register_check.json` (its output) does not; the monthly licence re-check has never run.
- `review-logs/REVIEW_LOG_corrections_2026-10-03.md` §4 lists 20 corrections "not applied", including the Innocenti/Tornabuoni dates (decision 20) and the Supabase seed regeneration.

## What is working

- The canon schema is uniform and validated: all 20 CSVs match `HEADER`, 0 duplicate ids, 0 unparseable or inverted dates, `leaves_out` present on every civilisation, polity and movement, every row has a unit list except 371.
- The world-set fact-check of 3 October is real work: 262 of 374 rows re-read at the holder (224 of the 235 open ones), with provenance text, a 1970 test, a basis and an action per row; 89 link-outs and 19 exclusions were decided rather than fudged.
- The review logs and the AI reader log are candid about method, error rates and what was not found; the "not applied, and why" table is the best process artefact in the repository.
- The lint in `research_notes/F1.13 method run/lint_claims.py` catches the error kinds the logs show recurring, and it was run on the build.
- Asset manifests for Met, Cleveland and AIC images carry holder, accession, licence and credit (`build/assets/*/manifest.csv`, `edo-v3/objects.csv` with API ids); map data is Natural Earth; fonts are OFL; no ODbL anywhere.
- The template amendment was applied mechanically and uniformly to all 38 specs with pre-edit copies kept.

## The five changes that would fix the most

1. **Give the canon a source column and fill it for R1 and R2 first.** Add `source_id;source_url` to `HEADER`; move route names to a `routes` column; require a `SRCnnn`/`TXTnnn` id or a URL on the 1,538 R1+R2 rows before the Atlas hub serves them; make the validator fail an R1/R2 row without one. Run the two proposed sweeps while in there (101 "Smithsonian (CC0)" rows, 100 "First" rows) and add the protocol-level column (M9) so the 1,008 flagged R1+R2 rows get a level 1–6.
2. **One register per thing, frozen with a tag and a changelog.** Fold `claims_v0.csv`, the F1.13 `claims.yaml`, the Edo `sources` and the grouping-page claim tables into `claims_specs_v1.csv` under one id scheme; de-duplicate `world_set_specs_v1.csv` (28 duplicate accessions), normalise holders, restore the `case` status for the 7 failing objects, retire `world_set_v0.csv`; tag `claims-v1`; regenerate the README counts from the CSVs by script so 4,228 / 4,661 / 4,666 cannot recur.
3. **Fix the skill's step 1 and make `specs/` the source of truth.** `method.md`: "the unit spec is `specs/F1.N.md`". Add a rule that a build updates the spec rows it fulfils (F1.13's Storyboard row is "To write" while `build/lectures/F1.13/STORYBOARD.md` exists). Collapse the nine rule files into one `RULES.md` that the brief, the skill and the build brief import by reference, and record in it which of the four method resets is current.
4. **Build three syllabus units to a readable page before any more framework.** F1.13 (lecture exists: fetch its five open images, fix the 8 lint errors, ship), F1.25 (the only written tour), and F1.8 with the Edo unit folded in as its case so the 208 MB of built work lands inside the syllabus. Stop the ballet, compiler and study-page lines until then; the RETHINK already concludes that a twenty-minute read comes before any system.
5. **Close the human loop on a date.** Answer the 21 decisions in `DECISIONS_2026-10-03.md`; name a reader for each of the 13 held communities and record the clearance line in the spec; a person reads the 129 lint flags and the 45 Wikipedia-only claims; fix `coverage.py` (open-ended rows count only where the row says so; label the object grid "candidates") and join the 42,482 Pleiades rows to the 495 place rows so the Atlas has coordinates.

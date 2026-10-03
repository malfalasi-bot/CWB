# F1 content audit: how the teaching is distributed across five strands

3 October 2026. Internal audit of the 38 unit specs in `modules/F1-histories-of-making/specs/F1.*.md`, the Atlas logic (`docs/06-atlas-logic/index.md` §"Nodes, groupings, views"), the five grouping pages and the 20 canon CSVs (4,666 rows). Nothing in the repo was edited.

**Files**

- Script: `audit2/audit.py` (with `cases_hand.py` for the hand classification, `parse_specs.py` for the parser, `build_report.py` for this file)
- Cases CSV: `audit2/cases.csv` (unit, case, strand, strand_name, weight, note; 212 cases, 354 rows because 0.5/0.5 splits are two rows)
- Claims CSV: `audit2/claims.csv` (unit, n, strand, weight, how, scores, confidence, claim; 799 claims)
- Generated tables: `audit2/tables.md` (reproduced below as T1–T6)

Absolute folder: `/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/audit2/`

## The five strands

| # | Strand | What counts | Canon kinds mapped to it |
|---|---|---|---|
| 1 | Objects | a single artefact, object type, material or technique as the thing taught | object-type, material, technique, first-known |
| 2 | Movements | art, design, craft and creative-industry movements, styles, schools | movement, style, school |
| 3 | Civilisations and places | a civilisation, polity, culture, city, region, network or route | place, polity, civilisation-as-commonly-named, archaeological-culture, horizon, dynasty, network, interaction-sphere, diaspora |
| 4 | Events and the world timeline | dated events, periods, calendars, simultaneity | event, period, calendar-or-era |
| 5 | Concepts and people | an idea, a method, a named person, community, institution, belief or living practice | person, community, institution, maker-community, living-practice, belief-tradition |

## Headline

| Share of | 1 objects | 2 movements | 3 civilisations & places | 4 events & timeline | 5 concepts & people | n |
|---|---|---|---|---|---|---|
| Canon rows (all tiers) | 20.5% | 7.7% | 27.0% | 13.2% | 31.6% | 4,666 |
| Canon rows, R1 only | 26.8% | 7.8% | 36.4% | 7.1% | 21.9% | 269 |
| Cases and walk steps (hand) | **42.2%** | **3.1%** | **15.6%** | 12.7% | 26.4% | 212 |
| Claims (keyword) | 29.5% | 3.1% | 10.8% | 20.0% | 36.5% | 799 |

**Where the teaching diverges from the canon**

1. **The teaching is object-led by a factor of two.** Objects are 20.5% of canon rows (26.8% of R1) but 42% of cases and walk steps. Every unit opens on an object or a record, and most units have "object story (form 3)" cases. This is by design (the Deep Dives' "every node shares one card", the open-object rule) but it means the canon's groupings are reached mostly as context around an object, not as the thing taught.
2. **Civilisations, polities, cultures and networks are under-taught relative to the canon.** They are 27% of the canon and 36% of its R1 rows, but 15.6% of cases (24% inside the world chapters, 8% elsewhere). Only F1.13 teaches networks as networks (5 of its 9 steps). In the other world chapters the polity or culture is usually the setting of an object step (Kush behind a lamp, Goryeo behind a bowl, Wari behind a tunic), which the hand classification scores as a 0.5 split. The Atlas doc promises "about 60" grouping pages at Ring 1 (five per world chapter, a dozen movements and schools, six networks, a dozen civilisation cards); five exist.
3. **Movements are the thinnest strand everywhere, and nearly absent from the world chapters.** 7.7% of the canon (361 rows: 198 styles, 116 movements, 47 schools), 3.1% of cases and 3.1% of claims. 4.5 of the 6.5 case-weights sit in two units (F1.19b and F1.20); across all eleven world chapters the only movement content is the Hawaiian Renaissance (F1.12 step 8, half a step) and the European "Mamluk" revival (F1.10 step 8, half a step). The canon's 106 movement rows are taught through Mingei, the Bauhaus, Vkhutemas, Ulm, Soviet and tropical modernism, Arts and Crafts (grouping page) and the Kano and colonial art schools; the rest are carried by the Atlas only.
4. **Events are at parity in the cases but over-represented in the claims.** 13.2% of the canon, 12.7% of cases, 20% of claims. The claim sheets are where dates, laws, returns and court rulings live (F1.24 11 of 20 claims, F1.30 8.5 of 20, F1.22 7 of 20). The world-timeline idea itself (simultaneity, "what was happening elsewhere") is taught in one unit, F1.5, plus the "what was happening elsewhere" panel in F1.25's Object Autopsy and the Atlas's Time surface; no world chapter has a simultaneity step.
5. **Concepts and people are at rough parity in the cases and over-represented in the claims.** 31.6% of the canon, 26.4% of cases, 36.5% of claims. The claims' surplus is credit, attribution, provenance and sources: this is the module's method (every hand named or "not recorded") rather than content about named makers. Note what the R1 canon says: the top tier is 36% places and polities and 22% people; the cases invert that (16% and 26%).

In one sentence: F1 teaches objects and the people and records around them; the canon is weighted towards places, polities and groupings; movements are under-served by both, and by the specs most of all.

## Method

**1. Cases and walk steps (hand-classified).** For every spec I listed the opening case, each walk step and each lab case once, from the spec-table rows "Opening move", "Lab or main interactive"/"Lab", "Cases" and "Walk" (for F1.7 and F1.12 the walk table under the spec table; for F1.5, F1.9a, F1.10 and F1.13 the walk is section 7, "Visual plan by walk step"). Counting rules:

- Walk units (F1.5–F1.13, F1.12a): nine steps each; step 1 "Guess" is the opening case, so the opening is not counted again, except F1.10 whose opening ("Islamic art" as a category) is distinct from its step 1. The three "Cases" of a walk unit are steps of the walk and are not counted twice.
- Other units: the opening case once (only when it is not literally one of the listed cases: F1.3, F1.16, F1.17, F1.18, F1.19, F1.19b, F1.22a, F1.26, F1.29 have distinct openings), each lettered or numbered case once, and each distinct worked example a Lab names that is not already a case (F1.3's canonical line and Thomsen's ages; F1.4's two wall sets; F1.17's regimes 1 and 5; F1.19b's lineage map; F1.21's Etsy counter; F1.22's jeans chain; F1.23's two worked credit maps; F1.24's Luristan bit; F1.25's Practice Reading; F1.28's two extra demonstration sources; F1.28a's two demonstrations; F1.30's Long Count station).
- "Strips", "examples, not full stories", codas and link-outs are not counted.
- Strand by the stated rule: the thing taught, not the things mentioned. A case about the Benin plaque is objects even though it names the Edo and 1897; "the Battle of Talas" is events; Mingei is movements; "slow looking" is concepts. A case that is genuinely two strands is split 0.5/0.5 (105 of 212 cases are split; the note column says why).

Result: 212 cases (100 in the eleven world chapters, 112 in the other 27 units).

**2. Claims and open objects (parsed).** Section 3 of each spec was parsed (table rows numbered `| n |`, or the numbered-list format used by F1.3, F1.15, F1.18, F1.23 and F1.30); the parsed count matches the "Claims sheet" row's declared count in every unit (799 claims, 18–25 per unit). Section 5 rows were counted as open objects (244 rows; a row is a candidate object, link-out, register row or reserve, so this is an upper bound on the taught open images).

Each claim was classified by keyword rules (in `audit.py`, `RULES`): five weighted regex lexicons (objects: holders, accession numbers, object nouns, materials, techniques; movements: a list of movement, style and school names, weight 3; places: route and network words weight 2, polity and site words 1.5, place names 0.5; events: laws, wars, returns, courts, exhibitions, dating words; concepts/people: argument, credit, attribution, community, source and record words, scholar-year citations, UNESCO living-heritage words). The highest score wins; a tie, or a runner-up within 80% with score ≥ 2, splits 0.5/0.5; a claim whose confidence is "interpretive" (the unit's own framing) is strand 5; no match at all defaults to 5 (6 claims). Decisions: 592 single, 149 split, 52 interpretive, 6 default.

**Spot check.** Three seeded samples of 40 claims were read by hand. Sample A (seed 11) was used to tune the rules once (false positives: "returns" as an event in "the API returns nine records"; "Country" matching "country blacksmith"; personal names in the movement list; "rubber" out-scoring an event). Sample B (seed 23) measured 26/40 agreement on the primary strand, 5 partial (overlap only), 9 wrong; a second light tuning round followed (ties split; UNESCO living-heritage words to strand 5; more holders). Sample C (seed 37), untouched by tuning, is the error estimate: **29/40 (72.5%) agree on the primary strand, 4 partial, 7 wrong (17.5%)**; excluding the six "interpretive" claims that are trivially right, 23/34 (68%) agree and 7/34 (21%) are wrong. Errors are not symmetric: the classifier over-assigns objects when a person- or event-claim names materials (Du Huan's list of craftsmen at Kufa; the Tiangong kaiwu), under-assigns events for institutional founding and exhibition facts (the 1851 hall; the academies), and lets strand 5 absorb ambiguous claims. Read the claims shares as ±5–8 percentage points per strand. The cases shares are the reliable series.

**3. Canon.** Rows by `kind` across the 20 CSVs (no duplicate ids; the two `canon_additions_round*.csv` files add 523 rows of mixed kinds and are included). Mapping as in the strands table above. Tier splits (R1 269, R2 1,269, R3 3,128) are also given.

**4. Comparison.** Shares side by side; divergence in percentage points.

**5. World chapters.** (a) Which movements, civilisations and events each chapter teaches: canon ids cited in the spec's section 4 (Nodes), resolved to canon names and filtered to the movement, civilisation/polity/culture/network and event/period kinds (T5). (b) An expert checklist of 16–28 items per chapter (my own list of what a dense world history of making for that region would reach), each checked by regex against (i) the teaching rows of every spec (opening, lab, concept, cases, walk, visual plan) and the grouping-page walks → TAUGHT; (ii) anywhere else in a spec (responsibility block, "the Atlas carries instead", nodes, claims, protocol) → MENTIONED; (iii) the canon's name, other_names, notes and making_significance → CANON; (iv) nowhere → ABSENT. Every TAUGHT hit was read; 13 were overridden by hand where the regex had matched an aside (listed in `OVERRIDES` and in the "hand note" column of T6).

**Limits.**

- The hand classification is one reader's judgement on 212 cases; the split rule hides a real ambiguity (a walk step about "Kush: Meroë's slag, a royal lamp" is a place and an object at once). Another reader would move perhaps 10–15% of the weight between strands 1, 3 and 5, and almost none into 2 or 4.
- The claims classifier is a keyword scorer with a measured ~20% error; its shares are indicative only. Claims are also not equal units: a 25-claim world chapter and an 18-claim method unit weigh the same here.
- Open objects are counted as section-5 rows, which include link-outs, register rows, reserves and excluded objects. The "taught set" is usually smaller (nine in most world chapters).
- The canon mapping follows the brief. Two choices matter: first-known rows (174) go to objects, although in the specs they are taught as timeline arguments (F1.5 splits them 1/4); and diaspora and interaction-sphere rows (16) go to places with networks, although they are people.
- The expert checklist is one historian's list and the regex check can miss a name spelt differently; a MENTIONED or CANON status was not re-read beyond the override pass. Statuses tell you whether a name appears, not how well it is taught.
- T5 uses section 4 only; F1.5's nodes section lists places by name without ids, so its T5 row is nearly empty although the unit reaches many.

## Findings on the world chapters (T5 and T6, read together)

**What the chapters teach, by strand.** Across the eleven world chapters the hand classification gives objects 41.5%, places and polities 24%, events 12.5%, concepts and people 21%, movements 1%. Each chapter's device (metal, fibre, the workshop, cotton, the account, the route, the guild, navigation, the horse, the network) is a material or an institution, so the walk is a string of objects and records with the polity or culture as setting. F1.13 is the exception (five of nine steps are networks as such). The events taught are mostly removals and returns (1897 and the 2022–23 transfers; the Imjin War; Hwéeldi; the Calico Acts; the Mongol deportations); the periods taught are mostly labels on a record (Meroitic, Goryeo, Mughal, Middle Horizon).

**Movements, civilisations and events named in each chapter's nodes** are in T5. The counts: movements 0–4 per chapter (F1.5 and F1.13 none; F1.10's four are Orientalism, late antique Egyptian, Mamluk and Ottoman classical as styles); civilisations/polities/cultures/networks 2–20; events/periods 0–6.

**The obvious absences**, from T6 (status CANON = in the canon but in no spec; MENTIONED = named in a spec outside its teaching rows, usually under "the Atlas carries instead"):

| Region | Taught (named in a teaching row of some unit) | Mentioned only | In the canon only, or absent |
|---|---|---|---|
| Africa (F1.6) | Nok (excluded on protocol, taught as a case in F1.24), Kilwa/Swahili (Indian Ocean page), Great Zimbabwe (F1.3, F1.31), Kuba (F1.15), Kongo (F1.16), Asante (F1.18, F1.25), Deir el-Medina (F1.23), Zaria/Casablanca (F1.20), Kumasi (F1.19b, F1.20), trans-Saharan gold (F1.13) | Ife and Yoruba court art, Aksum, Tuareg/Amazigh, Coptic and Fatimid Egypt | Lalibela and Ethiopian Christian making; Luba/Chokwe/Fang; Dogon/Bamana; Ndebele/Zulu; contemporary African design and fashion (absent) |
| Americas (F1.7) | Aztec tribute and the Florentine Codex, Wari/Tiwanaku (page), Inka, San Ildefonso, Diné, talavera/Cusco/missions, Brasília, Roycroft/Stickley (page), Eames, Edgefield, Marajó/Upano (F1.5) | Classic Maya, Chavín, Northwest Coast, Inuit/Arctic, Mexican muralism, Caribbean | Olmec, Teotihuacan, Moche, Nasca, Mississippian/Cahokia, Ancestral Puebloan/Chaco/Mimbres |
| East Asia (F1.8) | Shang, Tang court (F1.12a), Song kilns, Jingdezhen, Qing reign marks (F1.23), Diamond Sutra, Goryeo/Joseon, chanoyu/Raku (strips), Kano (F1.19b), Edo prints (F1.20, F1.21), Meiji (F1.19), Mingei (F1.20) | Jōmon (F1.5), literati painting, Japanese lacquer, Qin/Han, Japanese postwar design, Ainu/Ryukyu, Tibet | Korean modern/industrial design; PRC socialist design |
| South and SE Asia (F1.9) | Indus (page; F1.28a), Chola, Mughal, Java (F1.4, F1.19, F1.30a), chintz, jamdani, Company school (F1.2), colonial art schools, Santiniketan, NID/Eames, Chandigarh, Kolhapuri GI (F1.26) | Gupta/Ajanta, Angkor, Borobudur, Đông Sơn, khadi/Swadeshi, Philippine/Vietnamese, Sri Lankan makers | Mauryan/Ashokan pillars; Gandhara; Rajput/Pahari painting; Thai/Burmese lacquer and Buddha casting |
| West Asia before Islam (F1.9a) | Uruk/Sumer, Ur III (F1.18), Kanesh, Persepolis, Elam, Luristan, Dilmun/Magan, Saba and incense, Levantine blown glass | Göbekli/Çatalhöyük, Babylon (one clause in F1.17), Petra/Palmyra, Hellenistic/Parthian, the falaj | Hittite; Assyrian palace reliefs; Phoenician; Sasanian; Urartu |
| Islamic world (F1.10) | Abbasid paper (page), Timurid (F1.19a), Mamluk, Iznik/Süleymaniye (page), Safavid (page; F1.30a), Herat calligraphy (F1.3), girih (F1.15), Qajar (F1.19b), Fez (page), Arabic typography (F1.21), the Mamluk revival, the Gulf | Umayyad, Fatimid lustre, al-Andalus (Córdoba, Alhambra), Seljuk/Kashan lustre and minai, Timbuktu manuscripts, Mughal | none canon-only; the Ottoman Empire has no polity row (F1.10 proposes one) |
| Europe and the Mediterranean (F1.11) | Athens, Arretine/Lyon, the Eparch, Renaissance texts (Vasari, Ghirlandaio, Dürer), Delft and the Syndics, Meissen, Wedgwood/Lancashire, 1851, Arts and Crafts (page), Bauhaus, Vkhutemas, Ulm, dazzle/Utility, Sámi (F1.26) | Byzantine silk/mosaic, Gothic workshops (via Ruskin), Murano, Art Nouveau/Secession/Wiener Werkstätte (one line), Werkbund, Scandinavian modern | Minoan/Mycenaean; Etruscan; Insular/Carolingian; Romanesque; Baroque/Rococo manufactories; Art Deco; Italian postwar design; Postmodernism |
| Australia and the Pacific (F1.12) | ground-edge axes, Budj Bim, Lapita, Kula, stick charts, Hōkūleʻa, Ka Mate (F1.26), ngatu/kapa (F1.15, F1.27), harakeke naming (F1.29), Tonga (F1.15) | rock art, possum-skin cloaks and fibre, Papunya Tula and desert painting, bark painting, Māori whakairo/pounamu/moko, Sepik, the Carpets case | Tiwi/Babbarra design studios; Rapa Nui; Hawaiian featherwork; Australian modern design |
| Steppe and Central Asia (F1.12a) | Botai, Sintashta, Pazyryk, Scythian gold (F1.24), Ordos, Sogdians, Mongols (many units), Timurid Samarkand, Bukhara ikat (F1.20), Turkmen ensi (F1.22a), Kyrgyz felt, Qazaq herders, Tashkent (F1.20), Vkhutemas (F1.19b) | Yamnaya, Andronovo, Oxus/Bactria, Turkic/Uyghur, Tibet, Siberian peoples | Xiongnu; Kushan; Afghan war rugs (absent) |
| Networks (F1.13) | Silk Roads, Indian Ocean, trans-Saharan, Manila galleon, Atlantic, cochineal and silver, mission workshops (F1.16) | Mediterranean as a network, amber/Hanse, steppe route, Cape route, Zheng He, Pacific voyaging, container shipping | Viking routes; Tea Horse Road; incense route (named in F1.9a, not as a network) |
| Recurrences (F1.5) | writing, pottery, metal, cities, cotton, print, horse domestication, the wheel (F1.12a) | coinage, the alphabet | plant domestication; glass; boats; lacquer/adhesives; the loom (absent as a recurrence) |

**Top ten absences across regions** (ranked by how central they are to a dense world history of making and how little of them is taught):

1. **Africa's figurative sculpture traditions**: Ife and Yoruba court art, Dogon/Bamana, Luba/Chokwe/Fang, Zulu/Ndebele. Nok is excluded on protocol and the Benin head is link-out only, so sculpture, the thing museums most show of Africa, is almost untaught; what remains is metal, cloth and masonry.
2. **Mesoamerica and the pre-Inka Andes**: Olmec, Teotihuacan, Classic Maya, Moche, Nasca, Chavín. The Americas chapter's fibre device reaches the Andes after 600 CE and the Southwest after 1860; a Mesoamerican object appears once (the Huexotzinco Codex).
3. **Europe 1100–1750**: Romanesque and Gothic building lodges, the Renaissance bottega as a workshop (taught only through texts: Vasari, a contract, Dürer's prints), Murano, Baroque/Rococo court manufactories (Gobelins, Sèvres). The guild device jumps from Paris c. 1268 to Mainz 1764.
4. **Europe 1890–1990 outside the Bauhaus–Ulm line**: Art Nouveau/Secession/Wiener Werkstätte, the Werkbund, Art Deco, Scandinavian modern, Italian postwar design, Postmodernism. The canon has them (STY042, STY048, STY051, MOV011, MOV029); no unit does.
5. **East Asia after 1950**: Japanese postwar design (Sony, Noguchi, Metabolism, Muji), Korean and PRC industrial design. F1.8 ends on Jingdezhen "now"; F1.20 ends on Mingei.
6. **North America beyond the Southwest**: Mississippian/Cahokia, Chaco/Mimbres, Northwest Coast formline, Inuit/Arctic making.
7. **South and Southeast Asia's monumental Buddhist and Hindu traditions**: Mauryan pillars, Gandhara, Gupta/Ajanta, Angkor, Borobudur, Thai/Burmese bronze and lacquer, plus Rajput/Pahari painting. The cotton device reaches painting through the Mughal workshop only.
8. **West Asia beyond Mesopotamia and the Gulf**: Hittite, Assyrian palace reliefs, Phoenician purple and glass, Sasanian silver and silk, Petra/Palmyra. The account device makes the chapter Sumerian–Achaemenid–Gulf.
9. **The Islamic world's western and classical cores**: Umayyad Damascus, al-Andalus (Córdoba, the Alhambra), Fatimid and Seljuk lustre, Timbuktu's manuscripts. The route-and-waqf device reaches Egypt, Anatolia, Iran and the Gulf; the Maghrib and al-Andalus are "the Atlas carries instead".
10. **The Pacific's modern art movements and carving**: Papunya Tula and the Western Desert painting movement, Arnhem Land bark painting, Māori whakairo/pounamu/moko, Rapa Nui. The navigation device reaches sea and stone but not the two best-known living art traditions of the region.

Runners-up: Ethiopia (Aksum, Lalibela); Xiongnu, Kushan and Bactria on the steppe; Jōmon as a case (it is a link in F1.5); the Mediterranean, Viking and Tea Horse routes as networks; the loom and plant domestication as recurrences in F1.5.

## What this suggests (not asked; two lines)

The brief's own numbers point at the lever: grouping pages. The Atlas doc promises about 60 at Ring 1 and five exist; a page per absent movement or civilisation (Gothic lodges, Papunya Tula, Ife, Classic Maya, Art Nouveau, the Sasanians) would lift strands 2 and 3 without rewriting any walk, because most walks already name the object such a page would open from.

---

# Generated tables

## T1. Cases and walk steps per unit (hand-classified; 0.5/0.5 splits)

| unit | cases | 1 | 2 | 3 | 4 | 5 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| F1.1 | 3 | 3.0 | 0.0 | 0.0 | 0.0 | 0.0 | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| F1.2 | 6 | 4.5 | 0.5 | 0.0 | 0.5 | 0.5 | 75.0% | 8.3% | 0.0% | 8.3% | 8.3% |
| F1.3 | 5 | 0.0 | 0.0 | 1.0 | 1.0 | 3.0 | 0.0% | 0.0% | 20.0% | 20.0% | 60.0% |
| F1.4 | 6 | 6.0 | 0.0 | 0.0 | 0.0 | 0.0 | 100.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| F1.5 | 9 | 2.5 | 0.0 | 0.5 | 4.0 | 2.0 | 27.8% | 0.0% | 5.6% | 44.4% | 22.2% |
| F1.6 | 9 | 4.0 | 0.0 | 2.5 | 1.0 | 1.5 | 44.4% | 0.0% | 27.8% | 11.1% | 16.7% |
| F1.7 | 9 | 4.5 | 0.0 | 2.5 | 1.0 | 1.0 | 50.0% | 0.0% | 27.8% | 11.1% | 11.1% |
| F1.8 | 9 | 3.0 | 0.0 | 2.5 | 1.0 | 2.5 | 33.3% | 0.0% | 27.8% | 11.1% | 27.8% |
| F1.9 | 9 | 4.0 | 0.0 | 2.0 | 1.5 | 1.5 | 44.4% | 0.0% | 22.2% | 16.7% | 16.7% |
| F1.9a | 9 | 6.5 | 0.0 | 1.0 | 0.5 | 1.0 | 72.2% | 0.0% | 11.1% | 5.6% | 11.1% |
| F1.10 | 10 | 3.0 | 0.5 | 2.5 | 0.0 | 4.0 | 30.0% | 5.0% | 25.0% | 0.0% | 40.0% |
| F1.11 | 9 | 3.5 | 0.0 | 1.0 | 1.0 | 3.5 | 38.9% | 0.0% | 11.1% | 11.1% | 38.9% |
| F1.12 | 9 | 3.5 | 0.5 | 2.0 | 1.5 | 1.5 | 38.9% | 5.6% | 22.2% | 16.7% | 16.7% |
| F1.12a | 9 | 4.5 | 0.0 | 2.5 | 1.0 | 1.0 | 50.0% | 0.0% | 27.8% | 11.1% | 11.1% |
| F1.13 | 9 | 2.5 | 0.0 | 5.0 | 0.0 | 1.5 | 27.8% | 0.0% | 55.6% | 0.0% | 16.7% |
| F1.14 | 3 | 1.5 | 0.0 | 0.5 | 0.5 | 0.5 | 50.0% | 0.0% | 16.7% | 16.7% | 16.7% |
| F1.15 | 3 | 2.0 | 0.0 | 0.0 | 0.0 | 1.0 | 66.7% | 0.0% | 0.0% | 0.0% | 33.3% |
| F1.16 | 4 | 2.0 | 0.0 | 0.0 | 0.5 | 1.5 | 50.0% | 0.0% | 0.0% | 12.5% | 37.5% |
| F1.17 | 6 | 2.5 | 0.0 | 0.5 | 0.0 | 3.0 | 41.7% | 0.0% | 8.3% | 0.0% | 50.0% |
| F1.18 | 4 | 1.5 | 0.5 | 0.0 | 0.0 | 2.0 | 37.5% | 12.5% | 0.0% | 0.0% | 50.0% |
| F1.19 | 4 | 2.0 | 0.0 | 0.5 | 1.5 | 0.0 | 50.0% | 0.0% | 12.5% | 37.5% | 0.0% |
| F1.19a | 3 | 1.5 | 0.0 | 0.0 | 1.5 | 0.0 | 50.0% | 0.0% | 0.0% | 50.0% | 0.0% |
| F1.19b | 5 | 0.0 | 2.5 | 0.0 | 0.0 | 2.5 | 0.0% | 50.0% | 0.0% | 0.0% | 50.0% |
| F1.20 | 3 | 0.0 | 2.0 | 1.0 | 0.0 | 0.0 | 0.0% | 66.7% | 33.3% | 0.0% | 0.0% |
| F1.21 | 4 | 1.0 | 0.0 | 0.0 | 1.0 | 2.0 | 25.0% | 0.0% | 0.0% | 25.0% | 50.0% |
| F1.22 | 4 | 2.5 | 0.0 | 1.5 | 0.0 | 0.0 | 62.5% | 0.0% | 37.5% | 0.0% | 0.0% |
| F1.22a | 4 | 3.0 | 0.0 | 0.0 | 0.5 | 0.5 | 75.0% | 0.0% | 0.0% | 12.5% | 12.5% |
| F1.23 | 5 | 1.5 | 0.0 | 0.5 | 0.5 | 2.5 | 30.0% | 0.0% | 10.0% | 10.0% | 50.0% |
| F1.24 | 4 | 2.0 | 0.0 | 0.0 | 1.5 | 0.5 | 50.0% | 0.0% | 0.0% | 37.5% | 12.5% |
| F1.25 | 4 | 3.5 | 0.0 | 0.0 | 0.0 | 0.5 | 87.5% | 0.0% | 0.0% | 0.0% | 12.5% |
| F1.26 | 4 | 0.0 | 0.0 | 0.0 | 0.5 | 3.5 | 0.0% | 0.0% | 0.0% | 12.5% | 87.5% |
| F1.27 | 3 | 1.0 | 0.0 | 0.5 | 0.5 | 1.0 | 33.3% | 0.0% | 16.7% | 16.7% | 33.3% |
| F1.28 | 5 | 0.5 | 0.0 | 0.0 | 0.0 | 4.5 | 10.0% | 0.0% | 0.0% | 0.0% | 90.0% |
| F1.28a | 5 | 3.0 | 0.0 | 0.5 | 0.0 | 1.5 | 60.0% | 0.0% | 10.0% | 0.0% | 30.0% |
| F1.29 | 4 | 1.5 | 0.0 | 0.0 | 0.0 | 2.5 | 37.5% | 0.0% | 0.0% | 0.0% | 62.5% |
| F1.30 | 4 | 1.0 | 0.0 | 0.0 | 3.0 | 0.0 | 25.0% | 0.0% | 0.0% | 75.0% | 0.0% |
| F1.30a | 3 | 1.0 | 0.0 | 1.0 | 1.0 | 0.0 | 33.3% | 0.0% | 33.3% | 33.3% | 0.0% |
| F1.31 | 4 | 0.0 | 0.0 | 1.5 | 0.5 | 2.0 | 0.0% | 0.0% | 37.5% | 12.5% | 50.0% |
| **all** | 212 | 89.5 | 6.5 | 33.0 | 27.0 | 56.0 | 42.2% | 3.1% | 15.6% | 12.7% | 26.4% |
| world chapters (F1.5-F1.13) | 100 | 41.5 | 1.0 | 24.0 | 12.5 | 21.0 | 41.5% | 1.0% | 24.0% | 12.5% | 21.0% |
| other units | 112 | 48.0 | 5.5 | 9.0 | 14.5 | 35.0 | 42.9% | 4.9% | 8.0% | 12.9% | 31.2% |

## T2. Claims (keyword-classified) and open objects per unit

| unit | claims parsed | declared | objects (s5 rows) | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|---|---|
| F1.1 | 20 | 20 | 6 | 10.0 | 0.0 | 2.0 | 0.0 | 8.0 |
| F1.2 | 20 | 20 | 5 | 5.0 | 0.0 | 3.5 | 4.0 | 7.5 |
| F1.3 | 20 | 20 | 5 | 1.0 | 0.5 | 2.0 | 6.5 | 10.0 |
| F1.4 | 20 | 20 | 6 | 3.0 | 0.0 | 1.5 | 1.0 | 14.5 |
| F1.5 | 25 | 25 | 10 | 10.0 | 1.5 | 3.5 | 3.0 | 7.0 |
| F1.6 | 23 | 23 | 12 | 8.5 | 0.0 | 6.0 | 5.5 | 3.0 |
| F1.7 | 25 | 25 | 9 | 9.5 | 1.0 | 6.0 | 3.0 | 5.5 |
| F1.8 | 25 | 25 | 10 | 9.0 | 0.0 | 3.5 | 6.0 | 6.5 |
| F1.9 | 25 | 25 | 9 | 13.0 | 0.0 | 1.5 | 4.5 | 6.0 |
| F1.9a | 25 | 25 | 9 | 9.5 | 0.0 | 4.5 | 2.0 | 9.0 |
| F1.10 | 25 | 25 | 10 | 12.5 | 0.0 | 2.0 | 4.5 | 6.0 |
| F1.11 | 23 | 23 | 9 | 9.0 | 0.0 | 2.5 | 3.0 | 8.5 |
| F1.12 | 23 | 23 | 9 | 2.0 | 1.0 | 6.0 | 6.0 | 8.0 |
| F1.12a | 23 | 23 | 9 | 7.5 | 0.5 | 4.0 | 3.0 | 8.0 |
| F1.13 | 25 | 25 | 9 | 7.0 | 0.5 | 6.5 | 4.5 | 6.5 |
| F1.14 | 20 | 20 | 6 | 8.5 | 0.0 | 2.5 | 5.0 | 4.0 |
| F1.15 | 20 | 20 | 5 | 6.0 | 0.5 | 1.0 | 3.0 | 9.5 |
| F1.16 | 20 | 20 | 6 | 7.0 | 0.0 | 3.0 | 4.0 | 6.0 |
| F1.17 | 20 | 20 | 4 | 4.0 | 0.0 | 1.0 | 3.5 | 11.5 |
| F1.18 | 20 | 20 | 5 | 3.0 | 1.0 | 3.5 | 2.0 | 10.5 |
| F1.19 | 20 | 20 | 6 | 7.0 | 1.0 | 0.0 | 5.5 | 6.5 |
| F1.19a | 20 | 20 | 5 | 6.5 | 0.0 | 2.5 | 6.5 | 4.5 |
| F1.19b | 20 | 20 | 6 | 0.5 | 7.5 | 0.0 | 7.0 | 5.0 |
| F1.20 | 20 | 20 | 5 | 1.5 | 6.5 | 0.0 | 5.5 | 6.5 |
| F1.21 | 19 | 19 | 6 | 2.0 | 0.0 | 2.5 | 2.5 | 12.0 |
| F1.22 | 20 | 20 | 4 | 5.0 | 0.0 | 1.5 | 7.0 | 6.5 |
| F1.22a | 20 | 20 | 6 | 11.5 | 0.5 | 0.5 | 3.0 | 4.5 |
| F1.23 | 20 | 20 | 6 | 4.5 | 0.5 | 0.5 | 6.5 | 8.0 |
| F1.24 | 20 | 20 | 6 | 4.5 | 0.0 | 0.0 | 11.0 | 4.5 |
| F1.25 | 19 | 19 | 5 | 10.5 | 0.0 | 2.0 | 1.0 | 5.5 |
| F1.26 | 18 | 18 | 3 | 0.5 | 0.0 | 0.5 | 3.0 | 14.0 |
| F1.27 | 19 | 19 | 5 | 7.0 | 0.0 | 3.0 | 4.0 | 5.0 |
| F1.28 | 20 | 20 | 6 | 4.0 | 0.0 | 1.0 | 4.0 | 11.0 |
| F1.28a | 20 | 20 | 5 | 8.5 | 2.0 | 2.0 | 0.0 | 7.5 |
| F1.29 | 19 | 19 | 3 | 5.0 | 0.5 | 2.0 | 3.5 | 8.0 |
| F1.30 | 20 | 20 | 5 | 4.0 | 0.0 | 0.0 | 8.5 | 7.5 |
| F1.30a | 18 | 18 | 5 | 7.0 | 0.0 | 2.5 | 3.5 | 5.0 |
| F1.31 | 20 | 20 | 4 | 1.0 | 0.0 | 0.0 | 4.0 | 15.0 |
| **all** | 799 | | 244 | 235.5 (29.5%) | 25.0 (3.1%) | 86.5 (10.8%) | 160.0 (20.0%) | 292.0 (36.5%) |

Classifier decisions: {'max': 592, 'split': 149, 'interpretive flag': 52, 'no match -> default 5': 6} (split counted once per claim).

## T3. Canon rows by kind, grouped into strands

| strand | kinds | rows (all tiers) | share | R1 rows | R1 share | R2 rows | R2 share |
|---|---|---|---|---|---|---|---|
| 1. objects | object-type 399, material 138, technique 247, first-known 174 | 958 | 20.5% | 72 | 26.8% | 282 | 22.2% |
| 2. movements | style 198, movement 116, school 47 | 361 | 7.7% | 21 | 7.8% | 92 | 7.2% |
| 3. civilisations & places | place 495, polity 241, civilisation-as-commonly-named 93, archaeological-culture 232, horizon 17, dynasty 97, network 68, interaction-sphere 3, diaspora 13 | 1259 | 27.0% | 98 | 36.4% | 426 | 33.6% |
| 4. events & timeline | event 383, period 219, calendar-or-era 12 | 614 | 13.2% | 19 | 7.1% | 157 | 12.4% |
| 5. concepts & people | person 609, community 308, institution 169, maker-community 107, living-practice 225, belief-tradition 56 | 1474 | 31.6% | 59 | 21.9% | 312 | 24.6% |
| total | | 4666 | | 269 | | 1269 | |

## T4. Shares compared

| | 1. objects | 2. movements | 3. civilisations & places | 4. events & timeline | 5. concepts & people | total |
|---|---|---|---|---|---|---|
| canon, all rows | 958.0 (20.5%) | 361.0 (7.7%) | 1259.0 (27.0%) | 614.0 (13.2%) | 1474.0 (31.6%) | 4666 |
| canon, R1 only | 72.0 (26.8%) | 21.0 (7.8%) | 98.0 (36.4%) | 19.0 (7.1%) | 59.0 (21.9%) | 269 |
| cases and walk steps (hand) | 89.5 (42.2%) | 6.5 (3.1%) | 33.0 (15.6%) | 27.0 (12.7%) | 56.0 (26.4%) | 212 |
| cases, world chapters only | 41.5 (41.5%) | 1.0 (1.0%) | 24.0 (24.0%) | 12.5 (12.5%) | 21.0 (21.0%) | 100 |
| cases, other units only | 48.0 (42.9%) | 5.5 (4.9%) | 9.0 (8.0%) | 14.5 (12.9%) | 35.0 (31.2%) | 112 |
| claims (keyword) | 235.5 (29.5%) | 25.0 (3.1%) | 86.5 (10.8%) | 160.0 (20.0%) | 292.0 (36.5%) | 799 |

Divergence (percentage points, cases minus canon):
| strand | canon % | cases % | claims % | cases - canon | claims - canon |
|---|---|---|---|---|---|
| 1. objects | 20.5 | 42.2 | 29.5 | +21.7 | +8.9 |
| 2. movements | 7.7 | 3.1 | 3.1 | -4.7 | -4.6 |
| 3. civilisations & places | 27.0 | 15.6 | 10.8 | -11.4 | -16.2 |
| 4. events & timeline | 13.2 | 12.7 | 20.0 | -0.4 | +6.9 |
| 5. concepts & people | 31.6 | 26.4 | 36.5 | -5.2 | +5.0 |

## T5. World chapters: groupings cited in section 4 (Nodes), by name


**F1.5 F1.5 Recurrences**

- Movements, styles, schools (0): none
- Civilisations, polities, cultures, horizons, dynasties, networks (2): Botai (ARC099); Middle Kingdom dynasties (11–12) (DYN003)
- Events, periods, calendars (0): none

**F1.6 F1.6 Africa, read through metallurgy**

- Movements, styles, schools (3): Igbo-Ukwu bronze style (STY084); Benin court style (STY086); Akan goldweight tradition (STY088)
- Civilisations, polities, cultures, horizons, dynasties, networks (16): Nok (ARC028); Igbo-Ukwu (ARC034); Egyptian (CIV001); Nubian / Kushite (CIV002); Great Zimbabwe (CIV005); Nok (CIV006); Middle Kingdom dynasties (11–12) (DYN003); Oba dynasty of Benin (DYN038); Trans-Saharan trade (NET010); Atlantic world trade (NET034); Transatlantic trafficking of enslaved Africans (NET035); Pharaonic Egyptian state (POL001); Kingdom of Kush (Napata and Meroë) (POL003); Great Zimbabwe (POL015); Kingdom of Benin (POL026); Asante Empire (POL029)
- Events, periods, calendars (6): Portuguese brass in Benin (from c. 1485) (OCC050); British invasion and looting of Benin City (1897; the British "punitive expedition") (OCC175); German transfer of Benin bronzes (2022) (OCC289); Meroitic period (Kush) (PRD014); Early Iron Age (eastern and southern Africa) (PRD022); Atlantic era (West and Central Africa) (PRD026)

**F1.7 F1.7 The Americas, read through fibre**

- Movements, styles, schools (2): Middle Horizon style (Wari and Tiwanaku) (STY065); Dine regional weaving styles (STY078)
- Civilisations, polities, cultures, horizons, dynasties, networks (14): Paracas (ARC205); Upano (ARC213); Marajoara (ARC214); Andean (CIV021); Inca (CIV022); Caral / Norte Chico (CIV031); Amazonian 'garden cities' (CIV039); Mesoamerican (CIV042); Middle Horizon (HOR002); Wari (POL058); Inca (Tawantinsuyu) (POL061); Viceroyalty of New Spain (POL069); United States (federal craft and Indian arts policy) (POL078); Marajoara chiefdoms (POL081)
- Events, periods, calendars (2): Hwéeldi and the Long Walk (1863–1868) (OCC141); Middle Horizon (period) (PRD189)

**F1.8 F1.8 East Asia, read through the workshop**

- Movements, styles, schools (1): Goryeo celadon (STY139)
- Civilisations, polities, cultures, horizons, dynasties, networks (12): Korean potters taken to Japan (DIA012); Porcelain trade (NET054); Shang (POL156); Song (POL166); Yuan (POL167); Ming (POL168); People's Republic of China (POL171); Goryeo (POL176); Nara ritsuryō state (POL179); Tokugawa Japan (Edo) (POL183); Empire of Japan (POL185); Dutch East India Company (POL238)
- Events, periods, calendars (4): Imjin War (1592–1598) (OCC071); Northern Song period (PRD099); Imperial reign eras (nianhao) as dating units (PRD107); Goryeo period (PRD138)

**F1.9 F1.9 South and Southeast Asia, read through cotton**

- Movements, styles, schools (1): Chola bronze style (STY120)
- Civilisations, polities, cultures, horizons, dynasties, networks (10): Mehrgarh (Neolithic) (ARC137); Geniza merchants (DIA004); Indian Ocean world (NET005); Indian cotton textile trade (NET055); Atlantic cotton economy (NET056); Chola Empire (POL192); Mughal Empire (POL197); English East India Company (POL200); British Raj (POL201); Dutch East India Company (POL238)
- Events, periods, calendars (3): Calico Act (1700) (OCC090); Calico Act (1721) (OCC093); Mughal period (PRD150)

**F1.9a F1.9a West Asia before Islam, read through the account**

- Movements, styles, schools (2): Achaemenid court style (STY095); Luristan bronzes (STY097)
- Civilisations, polities, cultures, horizons, dynasties, networks (17): Uruk (ARC054); Proto-Elamite (ARC056); Luristan bronzes (ARC058); Hafit (ARC060); Umm an-Nar (ARC061); Elamite (CIV059); Dilmun (CIV060); Magan (CIV061); Sabaean (CIV066); Dilmun–Magan–Meluhha trade (NET016); Old Assyrian trade (Aššur–Kaneš) (NET017); Incense routes (NET031); Akkadian Empire (POL093); Third Dynasty of Ur (POL094); Elam (POL098); Achaemenid Empire (POL105); Saba (POL112)
- Events, periods, calendars (1): Iron Age (southeastern Arabia) (PRD049)

**F1.10 F1.10 The Islamic world as a network, read through routes and the waqf**

- Movements, styles, schools (4): Orientalism (style and discourse) (STY031); Late antique Egyptian art (STY083); Mamluk style (STY104); Ottoman classical style (STY109)
- Civilisations, polities, cultures, horizons, dynasties, networks (7): Islamic (CIV086); Geniza merchants (DIA004); Abbasid dynasty (DYN010); Indian Ocean world (NET005); Kilwa Sultanate (POL009); Fatimid Caliphate (POL041); Mamluk Sultanate (POL042)
- Events, periods, calendars (1): Collapse of Gulf pearling (1929–1950s) (OCC201)

**F1.11 F1.11 Europe and the Mediterranean, read through the guild**

- Movements, styles, schools (1): Classical Greek style (STY004)
- Civilisations, polities, cultures, horizons, dynasties, networks (6): Vinča (ARC080); Byzantine (CIV078); Athens (classical polis) (POL117); Rome (Republic and Empire) (POL120); Byzantine Empire (POL121); Dutch Republic (POL129)
- Events, periods, calendars (2): Book of the Eparch (c. 912) (OCC029); Abolition of guilds in France (1791) (OCC111)

**F1.12 F1.12 Australia and the Pacific, read through navigation**

- Movements, styles, schools (2): Hawaiian Renaissance (MOV102); Lapita style (STY154)
- Civilisations, polities, cultures, horizons, dynasties, networks (7): Lapita (ARC224); Aboriginal and Torres Strait Islander (CIV093); Lapita horizon (HOR013); Austronesian voyaging (NET045); Lapita exchange network (NET046); Kula ring (NET047); Commonwealth of Australia (Indigenous arts policy) (POL090)
- Events, periods, calendars (2): Pleistocene Sahul (PRD211); Lapita period (PRD214)

**F1.12a F1.12a The steppe and Central Asia, read through the horse**

- Movements, styles, schools (2): Animal Style (steppe) (STY098); Tang international style (STY135)
- Civilisations, polities, cultures, horizons, dynasties, networks (14): Yamnaya (ARC087); Botai (ARC099); Sintashta (ARC102); Pazyryk (ARC108); Xiongnu (ARC111); Sogdian (CIV088); Sogdian merchants (DIA001); Scytho-Siberian horizon (HOR017); Silk Roads (NET001); Steppe route (NET002); Oasis route (Tarim Basin) (NET003); Russian Empire (POL144); Xiongnu (POL227); Sogdian city-states (POL228)
- Events, periods, calendars (1): Early Nomadic period (Eurasian steppe) (PRD171)

**F1.13 F1.13 Networks: objects, materials, skills and people**

- Movements, styles, schools (0): none
- Civilisations, polities, cultures, horizons, dynasties, networks (20): Swahili (CIV004); Sogdian merchants (DIA001); African diaspora in the Americas (DIA008); Korean potters taken to Japan (DIA012); Silk Roads (NET001); Oasis route (Tarim Basin) (NET003); Indian Ocean world (NET005); Nanhai route (NET009); Trans-Saharan trade (NET010); Kilwa gold route (NET011); Atlantic world trade (NET034); Transatlantic trafficking of enslaved Africans (NET035); Manila galleon trade (NET036); Porcelain trade (NET054); Indian cotton textile trade (NET055); Kilwa Sultanate (POL009); Mali Empire (POL036); Viceroyalty of New Spain (POL069); Yuan (POL167); Dutch East India Company (POL238)
- Events, periods, calendars (5): Mongol deportations of artisans (1219–1260s) (OCC035); Mansa Musa's hajj (1324) (OCC037); Imjin War (1592–1598) (OCC071); Capture of the carracks São Jacinto and Santa Catarina (1602–1603) (OCC072); Collapse of Gulf pearling (1929–1950s) (OCC201)

## T6. Expert checklist per chapter: status of expected content

Status: TAUGHT = named in a spec table teaching row (opening, lab, concept, cases, walk) of any unit, or in a grouping-page walk; MENTIONED = named elsewhere in a spec (responsibility block, "Atlas carries instead", nodes, claims, protocol); CANON = only in a canon row; ABSENT = nowhere.


**F1.6** (10 taught, 4 mentioned, 4 canon only, 1 absent of 19)

| expected | status | taught in | mentioned in | canon rows | hand note |
|---|---|---|---|---|---|
| Nok terracotta sculpture | TAUGHT | F1.6 | F1.24 | 6 e.g. CIV006, ARC028, INV087 |  |
| Ife heads and Yoruba court art | MENTIONED |  | F1.4, F1.6, F1.17, F1.29 | 17 e.g. PER498, CIV011, COM027 |  |
| Aksum (architecture, coinage) | MENTIONED |  | F1.6 | 9 e.g. CIV003, ARC021, OCC213 |  |
| Lalibela / Ethiopian Christian making | CANON |  |  | 7 e.g. BEL009, CIV017, DYN033 |  |
| Swahili coral-stone towns (Kilwa, Gedi) | TAUGHT | F1.10, F1.13 + grouping page | F1.6, F1.21 | 15 e.g. CIV004, COM072, ARC024 |  |
| Mali empire, Timbuktu manuscripts, Sahelian earth architecture | TAUGHT | F1.5, F1.13 | F1.28 | 27 e.g. PER528, CIV007, CIV008 | as the trans-Saharan gold route (F1.13 step 5) and Djenne-Djeno (F1.5); Mali's own making (Djenne mosque, Timbuktu manuscripts) has no case |
| Great Zimbabwe masonry | TAUGHT | F1.3, F1.31 | F1.6, F1.24, F1.29 | 12 e.g. OCC299, PER489, PER490 |  |
| Kuba kingdom textiles and design | TAUGHT | F1.15 |  | 10 e.g. GAP055, EVT034, COM042 |  |
| Kongo (crucifixes, minkisi) | TAUGHT | F1.16 |  | 9 e.g. GAP054, BEL056, PER534 |  |
| Luba / Chokwe / Fang figurative sculpture | CANON |  |  | 8 e.g. GAP057, COM042, COM043 |  |
| Asante kente and gold weights | TAUGHT | F1.3, F1.18, F1.25 | F1.2, F1.6, F1.19, F1.20, F1.24, F1.30a | 17 e.g. BEL044, COM030, DYN039 |  |
| Dogon / Bamana (bogolan) making | CANON |  |  | 7 e.g. COM017, COM018, MKR007 |  |
| Ndebele / Zulu beadwork and house painting | CANON |  |  | 10 e.g. COM070, COM071, STY090 |  |
| Tuareg / Amazigh silver and leather | MENTIONED |  | F1.6, F1.20 | 10 e.g. COM003, COM010, COM016 |  |
| Egyptian New Kingdom workshops (Deir el-Medina) | TAUGHT | F1.23 | F1.10 | 6 e.g. PER582, DYN005, MKR090 |  |
| Coptic and Fatimid Egypt | MENTIONED |  | F1.9, F1.10, F1.30 | 12 e.g. BEL008, COM001, DYN082 |  |
| 20th-c. African modernisms (Zaria, Makerere, Casablanca School) | TAUGHT | F1.20 |  | 9 e.g. PRA220, INS002, INS005 |  |
| Kumasi / KNUST and tropical modernism in Ghana | TAUGHT | F1.19b, F1.20 | F1.6, F1.25, F1.30a | 9 e.g. INS130, INS131, PER565 |  |
| Contemporary African design and fashion | ABSENT |  |  | 0 |  |

**F1.7** (11 taught, 6 mentioned, 6 canon only, 0 absent of 23)

| expected | status | taught in | mentioned in | canon rows | hand note |
|---|---|---|---|---|---|
| Olmec sculpture | CANON |  |  | 14 e.g. CIV019, CIV042, ARC185 |  |
| Teotihuacan workshops | CANON |  |  | 9 e.g. CIV026, CIV042, OCC022 |  |
| Classic Maya (ceramics, stucco, codices) | MENTIONED |  | F1.5, F1.7, F1.27, F1.30 | 22 e.g. PLC494, CIV018, CIV042 |  |
| Aztec / Mexica (featherwork, codices) | TAUGHT | F1.7, F1.28 |  | 17 e.g. MKR103, PLC437, CIV020 |  |
| Chavín (Early Horizon) | MENTIONED |  | F1.5 | 7 e.g. CIV021, CIV032, ARC204 |  |
| Moche ceramics and metallurgy | CANON |  |  | 7 e.g. CIV021, CIV033, ARC207 |  |
| Nasca | CANON |  |  | 5 e.g. CIV021, CIV034, ARC206 |  |
| Wari and Tiwanaku (Middle Horizon) | TAUGHT | F1.5, F1.7 + grouping page |  | 10 e.g. PER502, CIV021, CIV035 |  |
| Inka (textiles, khipu, masonry) | TAUGHT | F1.1, F1.5, F1.7, F1.15, F1.18, F1.28a, F1.30a + grouping page | F1.16, F1.28 | 26 e.g. INS118, OBT327, CIV021 |  |
| Mississippian (Cahokia) / Hopewell | CANON |  |  | 14 e.g. CIV023, ARC183, ARC184 |  |
| Ancestral Puebloan / Chaco / Mimbres | CANON |  |  | 12 e.g. CIV024, ARC176, ARC177 |  |
| Pueblo pottery revival (Maria Martinez) | TAUGHT | F1.18 |  | 7 e.g. PER541, PER542, COM100 |  |
| Northwest Coast formline art | MENTIONED |  | F1.7, F1.28a | 20 e.g. GAP060, INS151, COM091 |  |
| Inuit / Arctic making | MENTIONED |  | F1.7 | 26 e.g. COM084, COM086, ARC164 |  |
| Diné weaving | TAUGHT | F1.2, F1.7, F1.18, F1.19a, F1.22a, F1.24, F1.25 | F1.29 | 25 e.g. INS104, MAT131, MAT132 |  |
| Colonial talavera / Cusco School / mission workshops | TAUGHT | F1.7, F1.13, F1.16 + grouping page | F1.14, F1.27, F1.30a | 17 e.g. INS119, COM137, ARC220 |  |
| Mexican muralism and modern design | MENTIONED |  | F1.17 | 1 e.g. MOV056 |  |
| Brazilian modernism / Brasília / Antropofagia | TAUGHT | F1.20 |  | 7 e.g. PER566, PLC472, MOV060 |  |
| Shaker / US Arts and Crafts (Roycroft, Stickley) | TAUGHT |  + grouping page |  | 5 e.g. GAP030, BEL013, MKR030 |  |
| Mid-century US design (Eames, Loewy, streamlining) | TAUGHT | F1.19a, F1.19b, F1.31 |  | 14 e.g. GAP030, INS126, OBT346 |  |
| African American making (Edgefield, Gee's Bend) | TAUGHT | F1.23 | F1.22a | 8 e.g. GAP069, PLC481, MKR034 |  |
| Caribbean / Haitian making | MENTIONED |  | F1.4, F1.7, F1.16, F1.20 | 32 e.g. GAP082, BEL042, BEL047 |  |
| Amazonian making (Marajó, Upano) | TAUGHT | F1.5, F1.7 |  | 7 e.g. CIV038, CIV039, ARC213 |  |

**F1.8** (12 taught, 7 mentioned, 2 canon only, 0 absent of 21)

| expected | status | taught in | mentioned in | canon rows | hand note |
|---|---|---|---|---|---|
| Jōmon pottery | MENTIONED |  | F1.5, F1.8 | 12 e.g. ARC133, ARC134, INV021 |  |
| Shang bronze casting | TAUGHT | F1.5, F1.8 | F1.30 | 8 e.g. PLC438, ARC126, ARC127 |  |
| Qin / Han (terracotta army, lacquer, silk) | MENTIONED | F1.12a, F1.27 | F1.8, F1.25 | 7 e.g. PLC484, PLC485, OCC011 | Han appears only as a date label (Ordos horse in F1.12a; paper fragment in F1.27) |
| Tang (sancai, court painting, Chang'an) | TAUGHT | F1.12a | F1.16, F1.30a | 12 e.g. OCC341, PER527, OCC024 |  |
| Song workshops and kilns (Ru, Jun, Longquan) | TAUGHT | F1.8, F1.22a, F1.29 + grouping page | F1.15 | 9 e.g. OCC032, SCH034, PRD099 |  |
| Yuan / Ming Jingdezhen | TAUGHT | F1.8, F1.10, F1.11, F1.13, F1.14, F1.23 + grouping page | F1.19, F1.30 | 12 e.g. COM301, INS105, PLC439 |  |
| Qing imperial workshops (Zaobanchu) | TAUGHT | F1.23 | F1.30 | 4 e.g. TEC240, INS020, PRD102 |  |
| Literati painting and calligraphy | MENTIONED | F1.8 | F1.9a, F1.17, F1.31 | 3 e.g. GAP039, SCH035, STY149 | F1.8 Concept names literati painting as the reading not taken; Atlas carries STY136 |
| Chinese woodblock printing and manuals (Diamond Sutra, Mustard Seed Garden) | TAUGHT | F1.16, F1.19b |  | 6 e.g. PER533, PER557, INV039 |  |
| Goryeo celadon / Joseon porcelain | TAUGHT | F1.5, F1.31 | F1.8, F1.13, F1.16, F1.19a, F1.20, F1.22a | 22 e.g. OBT332, PER504, PLC440 |  |
| Japanese lacquer (maki-e) | MENTIONED | F1.16 |  | 10 e.g. GAP005, OBT341, TEC237 | F1.16 names lacquer church furniture in a link-out strip only |
| Chanoyu / Raku / tea ceramics | TAUGHT | F1.16, F1.22a | F1.8 | 8 e.g. MKR041, OBT082, PER197 |  |
| Kano school | TAUGHT | F1.19b | F1.4, F1.8 | 6 e.g. OBT349, PER556, MKR006 |  |
| Edo print culture (ukiyo-e, Hokusai) | TAUGHT | F1.20, F1.21 | F1.8 | 6 e.g. PER569, OCC129, MAT054 |  |
| Meiji industrialisation and the world fairs | TAUGHT | F1.19 |  | 11 e.g. PER546, PER547, PER549 |  |
| Mingei | TAUGHT | F1.8, F1.20 | F1.19b, F1.31 | 5 e.g. OBT352, INS027, MOV005 |  |
| Japanese postwar design (Sony, Noguchi, Metabolism, Muji) | MENTIONED |  | F1.20 | 2 e.g. MOV026, PER157 |  |
| Korean modern / industrial design | CANON |  |  | 3 e.g. OCC045, PRD139, POL177 |  |
| PRC socialist design / Cultural Revolution posters | CANON |  |  | 2 e.g. OCC236, POL171 |  |
| Ainu and Ryukyu making | MENTIONED |  | F1.8 | 14 e.g. COM192, COM193, ARC114 |  |
| Tibetan making (thangka, metalwork) | MENTIONED |  | F1.8, F1.16, F1.30 | 32 e.g. BEL023, BEL033, CIV047 |  |

**F1.9** (12 taught, 7 mentioned, 4 canon only, 0 absent of 23)

| expected | status | taught in | mentioned in | canon rows | hand note |
|---|---|---|---|---|---|
| Indus / Harappan crafts | TAUGHT | F1.5, F1.28a, F1.30 + grouping page | F1.9 | 21 e.g. MKR104, CIV048, CIV070 |  |
| Mauryan / Ashokan pillars | CANON |  |  | 5 e.g. ARC143, DYN052, PER224 |  |
| Gandhara sculpture | CANON |  |  | 6 e.g. CIV053, ARC147, STY115 |  |
| Gupta / Ajanta | MENTIONED |  | F1.16, F1.19b | 4 e.g. DYN041, STY118, PRD147 |  |
| Chola bronzes | TAUGHT | F1.9 | F1.16 | 8 e.g. OCC307, PLC442, BEL025 |  |
| Mughal karkhana and painting | TAUGHT | F1.9, F1.17 | F1.10, F1.19b | 26 e.g. GAP037, PER507, OCC098 |  |
| Rajput / Pahari painting | CANON |  |  | 5 e.g. SCH024, SCH025, SCH026 |  |
| Angkor / Khmer | MENTIONED |  | F1.9 | 13 e.g. CIV050, OCC245, EVT015 |  |
| Borobudur | MENTIONED |  | F1.9 | 4 e.g. DYN061, STY127, PRD159 |  |
| Javanese making (batik, gamelan) | TAUGHT | F1.4, F1.19, F1.30a | F1.9, F1.22, F1.30 | 15 e.g. DYN061, OCC124, MKR054 |  |
| Đông Sơn drums | MENTIONED |  | F1.9 | 3 e.g. ARC156, NET051, PRD141 |  |
| Thai / Burmese lacquer and Buddha casting | CANON |  |  | 9 e.g. OCC102, OCC164, MAT095 |  |
| Kalamkari / chintz | TAUGHT | F1.9, F1.14 |  | 8 e.g. MKR049, MAT042, NET055 |  |
| Bengal muslin / jamdani | TAUGHT | F1.9, F1.19 | F1.14, F1.21 | 5 e.g. BEL040, OCC093, MKR047 |  |
| Company school painting | TAUGHT | F1.2 |  | 0 |  |
| Colonial art schools (J.J., Mayo, Madras) | TAUGHT | F1.19b |  | 6 e.g. INS127, INS128, PER554 |  |
| Swadeshi / khadi / Gandhi | MENTIONED | F1.19 | F1.9 | 8 e.g. OCC192, OCC197, OCC203 | one clause in F1.19 Concept ("khadi linked to F1.18") |
| Santiniketan / Bengal School | TAUGHT | F1.19b | F1.20 | 7 e.g. INS032, MOV082, SCH028 |  |
| NID Ahmedabad / Eames India Report | TAUGHT | F1.19b, F1.31 |  | 9 e.g. OCC247, INS033, PER152 |  |
| Chandigarh / Indian modernism | TAUGHT | F1.20 |  | 6 e.g. OBT353, PER564, PLC471 |  |
| Philippine / Vietnamese making | MENTIONED |  | F1.13, F1.21 | 20 e.g. OCC329, CIV051, COM171 |  |
| Sri Lankan makers | MENTIONED |  + grouping page |  | 3 e.g. PER246, PER265, POL190 | Arts and Crafts page names Sinhalese makers as models; no Sri Lankan case |
| Contemporary South Asian craft GI / fashion | TAUGHT | F1.26 | F1.9 | 6 e.g. INS143, INS144, OCC335 |  |

**F1.9a** (10 taught, 4 mentioned, 5 canon only, 0 absent of 19)

| expected | status | taught in | mentioned in | canon rows | hand note |
|---|---|---|---|---|---|
| Göbekli Tepe / Çatalhöyük (Neolithic Anatolia) | MENTIONED |  | F1.9a | 9 e.g. ARC050, ARC051, INV012 |  |
| Uruk / Sumer | TAUGHT | F1.1, F1.5, F1.9a |  | 15 e.g. PRD221, BEL002, CIV055 |  |
| Akkad / Ur III | TAUGHT | F1.18 + grouping page | F1.9a | 9 e.g. BEL002, OCC001, INS092 |  |
| Old Assyrian trade (Kanesh) | TAUGHT | F1.9a | F1.13, F1.18 | 5 e.g. INS093, NET017, PER283 |  |
| Babylon (Hammurabi, Ishtar Gate) | MENTIONED | F1.17 | F1.9a, F1.23 | 15 e.g. BEL002, CIV055, CIV057 | one clause in F1.17 Concept (Hammurabi on builders) |
| Hittite | CANON |  |  | 4 e.g. CIV063, INV086, PRD048 |  |
| Assyrian palace reliefs (Nineveh, Nimrud) | CANON |  |  | 8 e.g. OCC279, STY169, PER285 |  |
| Phoenician (purple, glass, alphabet) | CANON |  |  | 9 e.g. CIV015, CIV062, MAT044 |  |
| Achaemenid Persepolis | TAUGHT | F1.9a | F1.23 | 10 e.g. OCC309, PLC443, CIV067 |  |
| Elam / Proto-Elamite | TAUGHT | F1.9a |  | 10 e.g. GAP043, TEC231, TEC232 |  |
| Luristan bronzes | TAUGHT | F1.9a, F1.24 | F1.12a | 3 e.g. ARC058, STY097, PRD040 |  |
| Dilmun / Magan / Umm an-Nar | TAUGHT | F1.9a + grouping page | F1.5, F1.10, F1.27, F1.31 | 12 e.g. CIV060, CIV061, ARC061 |  |
| Ancient South Arabia (Saba, incense) | TAUGHT | F1.9a |  | 10 e.g. PLC444, TEC233, CIV066 |  |
| Nabataean Petra / Palmyra | MENTIONED |  | F1.9a | 9 e.g. CIV065, OCC277, INV135 |  |
| Hellenistic / Seleucid / Parthian | MENTIONED |  | F1.30 | 9 e.g. PRD231, CIV068, CIV071 |  |
| Sasanian silver and silk | CANON |  |  | 7 e.g. CIV067, OCC025, STY096 |  |
| Roman-era blown glass of the Levant | TAUGHT | F1.9a |  | 4 e.g. INV027, PER289, PRA187 |  |
| Urartu | CANON |  |  | 3 e.g. CIV064, STY168, POL103 |  |
| Falaj irrigation | TAUGHT | F1.9a |  | 5 e.g. PLC446, PRA216, INV137 |  |

**F1.10** (13 taught, 6 mentioned, 0 canon only, 0 absent of 19)

| expected | status | taught in | mentioned in | canon rows | hand note |
|---|---|---|---|---|---|
| Umayyad Damascus / Dome of the Rock | MENTIONED |  | F1.1 | 7 e.g. PER483, PLC421, DYN009 |  |
| Abbasid Baghdad / Samarra | TAUGHT |  + grouping page | F1.10, F1.15, F1.27, F1.28a, F1.30a | 15 e.g. OCC341, DYN010, DYN012 |  |
| Fatimid Cairo (lustre, rock crystal) | MENTIONED |  | F1.9 | 5 e.g. DYN082, OCC031, MAT011 |  |
| Al-Andalus (Córdoba, Alhambra) | MENTIONED |  | F1.10 | 14 e.g. CIV084, DYN009, DYN026 |  |
| Seljuk / Kashan lustre and minai | MENTIONED |  | F1.30, F1.30a | 25 e.g. CIV084, DYN010, DYN011 |  |
| Ilkhanid / Timurid (Tabriz, Samarkand, Herat) | TAUGHT | F1.19a | F1.10, F1.15, F1.23, F1.30a | 15 e.g. DYN074, OCC036, OCC042 |  |
| Mamluk Cairo (glass, inlay, deeds) | TAUGHT | F1.9, F1.10, F1.15 + grouping page | F1.5 | 11 e.g. EVT034, EVT035, PER510 |  |
| Ottoman Iznik / Sinan / Süleymaniye | TAUGHT | F1.1, F1.10, F1.14 + grouping page | F1.8 | 12 e.g. INS094, PER483, PLC421 |  |
| Safavid Isfahan (carpets, tiles) | TAUGHT | F1.30a + grouping page | F1.10, F1.15 | 22 e.g. DYN021, OCC073, OCC094 |  |
| Persian manuscript painting (Shahnama, Herat) | TAUGHT | F1.3 | F1.19b | 8 e.g. PER492, DYN016, SCH019 |  |
| Islamic calligraphy | TAUGHT | F1.3, F1.19b | F1.10, F1.21, F1.27, F1.31 | 34 e.g. GAP053, INS109, OBT350 |  |
| Girih / geometric ornament | TAUGHT | F1.15 |  | 2 e.g. GAP026, DYN082 |  |
| Qajar | TAUGHT | F1.19b |  | 2 e.g. DYN022, STY108 |  |
| Maghrib / Fez (Qarawiyyin) | TAUGHT | F1.10 + grouping page |  | 9 e.g. CIV084, DYN024, DYN028 |  |
| Sahel / Timbuktu Islamic manuscripts | MENTIONED |  | F1.28 | 11 e.g. CIV009, DYN035, OCC037 |  |
| Modern Arab graphic design and typography | TAUGHT | F1.21 |  | 3 e.g. GAP083, OCC326, PER575 |  |
| Islamic revival / neo-Mamluk glass | TAUGHT | F1.10 + grouping page |  | 2 e.g. PER510, STY182 |  |
| Gulf pearling / Al Sadu / lenj | TAUGHT | F1.13, F1.17 + grouping page | F1.9a, F1.10, F1.12a, F1.18, F1.28a, F1.31 | 15 e.g. GAP025, OCC345, PLC457 |  |
| Mughal (as Islamic world) | MENTIONED |  | F1.9, F1.10, F1.19b | 22 e.g. GAP037, OCC098, OCC136 |  |

**F1.11** (14 taught, 6 mentioned, 8 canon only, 0 absent of 28)

| expected | status | taught in | mentioned in | canon rows | hand note |
|---|---|---|---|---|---|
| Minoan / Mycenaean | CANON |  |  | 14 e.g. CIV074, CIV075, OCC002 |  |
| Greek pottery and bronze | TAUGHT | F1.11 |  | 8 e.g. PER518, PER519, NET022 |  |
| Etruscan | CANON |  |  | 8 e.g. CIV071, CIV077, ARC093 |  |
| Roman mass production (Arretine, concrete, glass) | TAUGHT | F1.11, F1.14, F1.23 |  | 9 e.g. GAP001, PER517, PLC449 |  |
| Byzantine silk and mosaic | MENTIONED |  | F1.11, F1.29 | 3 e.g. DYN082, PER382, PRD065 |  |
| Byzantine guild regulation (Book of the Eparch) | TAUGHT | F1.11 |  | 3 e.g. OCC029, PLC323, POL121 |  |
| Insular / Carolingian manuscripts | CANON |  |  | 7 e.g. CIV079, STY009, STY011 |  |
| Romanesque | CANON |  |  | 2 e.g. STY010, STY012 |  |
| Gothic cathedral workshops | MENTIONED |  + grouping page |  | 1 e.g. GAP023 | Arts and Crafts page step 1 is Ruskin reading Venetian Gothic; STY013 carried by the Atlas |
| Italian Renaissance workshops (bottega, Vasari) | TAUGHT | F1.3, F1.14, F1.17 | F1.11, F1.12, F1.28a | 20 e.g. GAP032, GAP048, GAP049 |  |
| Venetian glass (Murano) | MENTIONED |  | F1.11 | 5 e.g. MKR065, NET024, PER401 |  |
| Dutch Golden Age (Delft, guilds) | TAUGHT | F1.8, F1.11, F1.14, F1.17 |  | 12 e.g. GAP003, INS110, MKR098 |  |
| Baroque / Rococo court and guild production | CANON |  |  | 7 e.g. OCC089, MKR027, STY022 |  |
| Meissen / Sèvres porcelain | TAUGHT | F1.14 |  | 12 e.g. MAT135, DYN085, DYN090 |  |
| Industrial Revolution (Wedgwood, Arkwright, Lancashire mills) | TAUGHT | F1.11, F1.14, F1.19 | F1.9 | 11 e.g. OCC104, OCC108, OCC139 |  |
| Great Exhibition 1851 | TAUGHT | F1.15, F1.19 | F1.1, F1.11 | 11 e.g. INS123, MKR100, OCC131 |  |
| Arts and Crafts | TAUGHT |  + grouping page | F1.14, F1.18, F1.19, F1.19b, F1.20 | 13 e.g. OCC253, INS014, INS055 |  |
| Art Nouveau / Jugendstil / Secession / Wiener Werkstätte | MENTIONED |  + grouping page |  | 9 e.g. GAP009, GAP012, MKR077 | one line in the Arts and Crafts walk (step 8) |
| Deutscher Werkbund | MENTIONED |  | F1.19 | 4 e.g. OCC187, EVT014, MOV011 |  |
| Bauhaus | TAUGHT | F1.3, F1.18, F1.19b, F1.20 |  | 15 e.g. GAP010, GAP076, PER562 |  |
| De Stijl / Constructivism / Vkhutemas | TAUGHT | F1.19b | F1.20 | 9 e.g. INS058, MOV019, MOV020 |  |
| Art Deco | CANON |  |  | 3 e.g. OCC195, EVT013, STY042 |  |
| Scandinavian modern | MENTIONED |  | F1.20 | 9 e.g. ARC091, MAT115, STY048 |  |
| Ulm / postwar German design (Braun, Rams) | TAUGHT | F1.19b |  | 9 e.g. GAP082, PER558, PER559 |  |
| Italian postwar design (Olivetti, Memphis) | CANON |  |  | 4 e.g. INS066, EVT018, MOV029 |  |
| Postmodernism | CANON |  |  | 1 e.g. STY051 |  |
| Wartime design (dazzle, Utility, prefabs) | TAUGHT | F1.19a | F1.7, F1.20, F1.22a, F1.25 | 12 e.g. INS125, MAT133, OBT347 |  |
| Sámi duodji | TAUGHT | F1.26 | F1.11, F1.16 | 12 e.g. INS146, INS147, INS148 |  |

**F1.12** (10 taught, 7 mentioned, 4 canon only, 0 absent of 21)

| expected | status | taught in | mentioned in | canon rows | hand note |
|---|---|---|---|---|---|
| Aboriginal rock art | MENTIONED |  | F1.26 | 12 e.g. BEL050, CIV093, ARC009 |  |
| Ground-edge axes (Madjedbebe, Carpenter's Gap) | TAUGHT | F1.12 | F1.5 | 13 e.g. COM303, INS115, CIV093 |  |
| Budj Bim aquaculture | TAUGHT | F1.12 | F1.5 | 8 e.g. INS116, OCC312, COM262 |  |
| Possum-skin cloaks / Aboriginal fibre work | MENTIONED |  | F1.18 | 1 e.g. PRA208 |  |
| Papunya Tula and the desert painting movement | MENTIONED |  | F1.12, F1.17 | 9 e.g. COM260, MKR080, MKR087 |  |
| Bark painting (Arnhem Land) | MENTIONED |  | F1.4, F1.12 | 9 e.g. OCC234, MKR084, STY155 |  |
| Aboriginal textile and design studios (Tiwi, Babbarra) | CANON |  |  | 4 e.g. COM258, COM264, MKR081 |  |
| Lapita | TAUGHT | F1.12 | F1.13 | 14 e.g. COM302, PER521, PLC451 |  |
| Māori whakairo / pounamu / moko | MENTIONED |  | F1.12, F1.15 | 10 e.g. BEL051, COM288, OCC271 |  |
| Māori weaving (raranga, cloaks) | TAUGHT | F1.29 | F1.12 | 5 e.g. INS152, PER601, BEL051 | harakeke cultivar naming is a Concept example in F1.29, not a weaving case |
| Ka Mate / Ngāti Toa | TAUGHT | F1.26 | F1.12 | 5 e.g. COM307, INS145, OCC336 |  |
| Tapa / ngatu / kapa | TAUGHT | F1.15, F1.27 | F1.12 | 13 e.g. COM289, COM291, COM293 |  |
| Marshall Islands stick charts | TAUGHT | F1.12 + grouping page |  | 8 e.g. MKR096, COM280, INV115 |  |
| Hōkūleʻa and the voyaging revival | TAUGHT | F1.12, F1.28a |  | 5 e.g. INS117, COM289, MOV102 |  |
| Kula ring | TAUGHT | F1.12 |  | 1 e.g. NET047 |  |
| Sepik / malagan carving (PNG) | MENTIONED | F1.15 | F1.12 | 15 e.g. INS086, STY162, NET048 | F1.15 quotes Loos's "Papuan" foil; no PNG case |
| Rapa Nui moai | CANON |  |  | 11 e.g. CIV092, COM292, HOR014 |  |
| Fijian / Tongan / Samoan making | TAUGHT | F1.15 | F1.12 | 26 e.g. PER531, COM277, COM290 |  |
| Hawaiian featherwork | CANON |  |  | 5 e.g. COM289, OBT048, PLC415 |  |
| Australian modern design (Featherston, Grant) | CANON |  |  | 1 e.g. PER370 |  |
| Aboriginal art copyright (Carpets case) | MENTIONED |  | F1.14 | 1 e.g. OCC258 |  |

**F1.12a** (15 taught, 5 mentioned, 2 canon only, 1 absent of 23)

| expected | status | taught in | mentioned in | canon rows | hand note |
|---|---|---|---|---|---|
| Botai | TAUGHT | F1.5, F1.12a, F1.28, F1.30 | F1.25 | 2 e.g. ARC099, INV071 |  |
| Yamnaya / Afanasievo | MENTIONED |  | F1.12a | 3 e.g. ARC087, ARC100, INV072 |  |
| Sintashta chariots | TAUGHT | F1.12a |  | 3 e.g. ARC102, INV119, PRD170 |  |
| Andronovo | MENTIONED |  | F1.12a | 2 e.g. ARC103, PRD170 |  |
| Pazyryk | TAUGHT | F1.12a | F1.22a, F1.24, F1.25 | 7 e.g. ARC108, HOR017, INV103 |  |
| Scythian / Saka gold | TAUGHT | F1.12a, F1.24 | F1.30 | 5 e.g. CIV087, ARC105, HOR017 |  |
| Xiongnu | CANON |  |  | 2 e.g. ARC111, POL227 |  |
| Ordos bronzes | TAUGHT | F1.12a, F1.25 |  | 1 e.g. ARC231 |  |
| Oxus / Bactria (BMAC, Tillya Tepe) | MENTIONED |  | F1.12a | 9 e.g. OCC314, CIV068, CIV089 |  |
| Kushan / Gandhara | CANON |  |  | 1 e.g. POL187 |  |
| Sogdian silks and merchants | TAUGHT | F1.12a, F1.13, F1.27, F1.30a | F1.19, F1.28 | 9 e.g. PER588, PLC486, STY183 |  |
| Turkic / Uyghur (Orkhon) | TAUGHT | F1.30 | F1.29 | 7 e.g. PRD226, COM154, OCC288 |  |
| Mongol Empire (Karakorum, cloth of gold) | TAUGHT | F1.13, F1.16, F1.19a, F1.22a, F1.23, F1.28, F1.30 | F1.8, F1.12a, F1.22, F1.25, F1.29 | 36 e.g. OBT336, OBT345, PER551 |  |
| Timurid Samarkand | TAUGHT | F1.10, F1.19a, F1.27, F1.30a | F1.15, F1.23 | 18 e.g. OCC341, PER589, DYN075 |  |
| Bukhara ikat | TAUGHT | F1.9, F1.20 | F1.19 | 24 e.g. STY183, COM154, COM160 |  |
| Turkmen carpets | TAUGHT | F1.22a |  | 7 e.g. OBT354, OBT355, COM210 |  |
| Kyrgyz felt (shyrdak) | TAUGHT | F1.22a, F1.25, F1.26, F1.29 | F1.12a | 8 e.g. OBT337, OBT363, PRA224 |  |
| Kazakh making | TAUGHT | F1.12a | F1.19a, F1.20, F1.22a, F1.29 | 8 e.g. COM190, COM208, ARC103 |  |
| Tibetan making | MENTIONED |  | F1.8, F1.16, F1.30 | 27 e.g. BEL023, CIV047, COM162 |  |
| Soviet Central Asian modernism (Tashkent) | TAUGHT | F1.20 | F1.12a | 5 e.g. OCC323, PLC466, PLC467 |  |
| Russian avant-garde / Vkhutemas | TAUGHT | F1.19b | F1.20 | 4 e.g. INS058, MOV019, PLC378 |  |
| Siberian peoples (Yakut, Evenki) | MENTIONED |  | F1.24 | 16 e.g. BEL036, COM195, COM215 |  |
| Afghan war rugs / contemporary | ABSENT |  |  | 0 |  |

**F1.13** (8 taught, 6 mentioned, 3 canon only, 0 absent of 17)

| expected | status | taught in | mentioned in | canon rows | hand note |
|---|---|---|---|---|---|
| Silk Roads | TAUGHT | F1.12a, F1.13 | F1.27, F1.28, F1.30a | 13 e.g. CIV088, STY135, NET001 |  |
| Indian Ocean monsoon network | TAUGHT | F1.9, F1.13 + grouping page | F1.17 | 23 e.g. CIV004, CIV005, COM203 |  |
| Trans-Saharan | TAUGHT | F1.13, F1.25, F1.27 |  | 14 e.g. OBT361, CIV006, CIV009 |  |
| Manila galleon | TAUGHT | F1.13 | F1.7 | 13 e.g. GAP025, DIA013, OCC067 |  |
| Atlantic | TAUGHT | F1.6, F1.13 | F1.11, F1.16, F1.19, F1.22, F1.23, F1.24 | 14 e.g. NET034, NET056, NET057 |  |
| Mediterranean (Uluburun, Phoenician) | MENTIONED | F1.11 | F1.1, F1.2, F1.13, F1.15, F1.16, F1.22 | 30 e.g. CIV015, CIV062, ARC078 | F1.11 Concept frames "the Mediterranean came before Europe"; no network case |
| Amber / Baltic / Hanseatic | MENTIONED |  | F1.22a, F1.27 | 13 e.g. COM022, ARC074, INS088 |  |
| Viking routes | CANON |  |  | 11 e.g. BEL004, CIV080, MAT075 |  |
| Steppe route | MENTIONED |  | F1.12a, F1.25 | 2 e.g. NET001, NET002 |  |
| Tea Horse Road | CANON |  |  | 2 e.g. NET001, NET004 |  |
| Incense route | CANON |  |  | 3 e.g. COM220, NET031, PLC293 |  |
| Columbian exchange (cochineal, silver) | TAUGHT | F1.7, F1.22, F1.30a + grouping page | F1.13, F1.25 | 10 e.g. INS155, MAT138, OCC062 |  |
| Cape route / Estado da India | MENTIONED |  | F1.13 | 2 e.g. NET033, POL203 |  |
| Zheng He voyages | MENTIONED |  | F1.13 | 2 e.g. OCC043, PER173 |  |
| Pacific voyaging (Lapita, Polynesia) | TAUGHT | F1.12 | F1.13, F1.28a | 27 e.g. GAP062, COM302, INS117 |  |
| Modern container shipping / global supply chains | MENTIONED |  | F1.14, F1.22 | 27 e.g. OCC316, COM056, COM195 |  |
| Jesuit / mission workshops | TAUGHT | F1.12, F1.16, F1.28 | F1.21 | 18 e.g. GAP005, GAP061, INS119 | F1.16 case 2 and its mission strip; the F1.12 and F1.28 hits are incidental |

**F1.5** (9 taught, 2 mentioned, 4 canon only, 1 absent of 16)

| expected | status | taught in | mentioned in | canon rows | hand note |
|---|---|---|---|---|---|
| Writing (independent origins) | TAUGHT | F1.5, F1.9a | F1.4 | 8 e.g. PLC427, DYN001, INV001 |  |
| Pottery before farming | TAUGHT | F1.5 | F1.8 | 16 e.g. PLC428, ARC133, ARC134 |  |
| Metal smelting (several origins) | TAUGHT | F1.5, F1.6, F1.9a, F1.11 |  | 6 e.g. PLC429, PLC430, INV076 |  |
| Cities (several forms) | TAUGHT | F1.5, F1.7 + grouping page |  | 9 e.g. CIV021, CIV031, CIV039 |  |
| Cotton and dye (four cottons) | TAUGHT | F1.5, F1.7 |  | 2 e.g. INV102, PLC158 |  |
| Printing (East Asia, then Mainz) | TAUGHT | F1.5, F1.11, F1.16 | F1.3, F1.8, F1.19, F1.19b, F1.28, F1.30a | 15 e.g. INS102, MKR095, OBT326 |  |
| Plant domestication / agriculture as a recurrence | CANON |  |  | 4 e.g. INV053, INV054, PER459 |  |
| Animal domestication (horse at Botai) | TAUGHT | F1.5, F1.12a, F1.28, F1.30 | F1.25 | 2 e.g. ARC099, INV071 |  |
| The wheel | TAUGHT | F1.12a |  | 0 |  |
| Glass as a recurrence | CANON |  |  | 2 e.g. PLC010, PLC042 |  |
| The loom / weaving as a recurrence | ABSENT |  |  | 0 |  |
| Coinage / money | MENTIONED |  | F1.5, F1.9a | 18 e.g. CIV071, CIV072, CIV073 |  |
| The alphabet | MENTIONED |  | F1.5 | 14 e.g. CIV062, OCC045, INV007 |  |
| Fired brick / monumental building | TAUGHT |  + grouping page | F1.5 | 1 e.g. TEC155 |  |
| Boats and navigation | CANON |  |  | 1 e.g. INV109 |  |
| Lacquer / resins / adhesives | CANON |  |  | 1 e.g. ARC046 |  |

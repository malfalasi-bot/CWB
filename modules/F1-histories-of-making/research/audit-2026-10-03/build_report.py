"""Assemble content_strands.md from the narrative head and the generated tables."""
import os
OUT = os.path.dirname(os.path.abspath(__file__))
HEAD = r'''# F1 content audit: how the teaching is distributed across five strands

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

'''
tables = open(os.path.join(OUT, 'tables.md'), encoding='utf-8').read()
open(os.path.join(OUT, 'content_strands.md'), 'w', encoding='utf-8').write(HEAD + tables + '\n')
print('written', len(HEAD) + len(tables), 'chars')

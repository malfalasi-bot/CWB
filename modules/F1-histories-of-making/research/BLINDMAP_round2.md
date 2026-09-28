# F1 blind map, round 2 (testing budget)

2026-09-28. Research only. The map was built from outside benchmarks first. It was then compared with F1 structure v3.4 to v3.6: the two added world chapters (F1.9a and F1.12a), F1.12 now Australia and the Pacific, and F1.11 now Europe and the Mediterranean. It was also compared with the canon register (2,430 rows) and the Atlas logic doc.

Following the brief, whole families still being built (named people, places and sites, events, period definitions) are not flagged as gaps. Specific themes inside them are flagged.

Files in this folder:
- `missing_entities.csv`: 85 rows, GAP001–GAP085, in the canon schema. Every canon ID cited in `notes` resolves. Every row whose prose names coerced, enslaved or forcibly moved people carries `human-flow`.
- `ap250_coverage.csv`: all 250 AP works with a verdict, the matched canon IDs and a note.
- `ap250_map.py` and `build_gap.py` rebuild both CSVs, and check names and links against the canon.

## 1. Benchmarks read

| # | Benchmark | What was read | URL |
|---|---|---|---|
| B1 | College Board, AP Art History, Appendix A: List of Required Works (250 works, 10 content areas) | Full list, verbatim | https://secure-media.collegeboard.org/digitalServices/pdf/ap/2013advances/appendixes.pdf |
| B2 | Adamson, Riello and Teasley (eds), *Global Design History* (Routledge 2011) | Full table of contents (introduction and 14 chapters, each with a response) | https://silo.pub/global-design-history.html (the Routledge page https://www.routledge.com/Global-Design-History/Adamson-Riello-Teasley/p/book/9780415572873 has no TOC) |
| B3 | Margolin, *World History of Design*, vols 1–2 (Bloomsbury 2015) | Full TOC, chapters 1–37 | https://www.bloomsbury.com/us/world-history-of-design-9781350018457/ |
| B4 | Smarthistory, *Reframing Art History* | All chapters in six parts, plus the site's top level (Curated guides; Explore by place: six continents) | https://smarthistory.org/reframing-art-history/ ; https://smarthistory.org/ |
| B5 | The Met, Heilbrunn Timeline: the essay index (1,039 titles) and the keyword index (styles, geography, material and technique, object and subject) | 2019 archived index; the live site no longer shows a theme list | https://web.archive.org/web/2019id_/https://www.metmuseum.org/toah/essays/ ; https://web.archive.org/web/2019id_/https://www.metmuseum.org/toah/keywords/ |
| B6 | UNESCO ICH: the five domains; the "traditional craftsmanship" page | Domain list and craftsmanship framing, quoted | https://ich.unesco.org/en/intangible-heritage-domains-00052 ; https://ich.unesco.org/en/traditional-craftsmanship-00057 |
| B7a | *Journal of Design History*: special issues 1988–2026, plus the virtual issues | Full lists of titles | https://academic.oup.com/jdh/pages/special_issues ; https://academic.oup.com/jdh/pages/virtual-issues |
| B7b | Design History Society annual conference themes, 2018–2027 | List | https://www.designhistorysociety.org/conferences |
| B8a | Decolonising Design, editorial statement (2016) | Quoted | https://www.decolonisingdesign.com/statements/2016/editorial/ |
| B8b | Fallan and Lees-Maffei (eds), *Designing Worlds: National Design Histories in an Age of Globalization* (Berghahn 2016) | Full TOC. Five of its 15 chapters are on Africa, Latin America, the Caribbean and West Asia | https://www.berghahnbooks.com/title/FallanDesigning |
| B8c | Shehab and Nawar, *A History of Arab Graphic Design* (AUC Press 2020) | A review only; the book's own TOC could not be reached | https://brooklynrail.org/2021/04/art_books/Bahia-Shehab-and-Haytham-Nawars-A-History-of-Arab-Graphic-Design/ |
| B8d | Videkanić, *Nonaligned Modernism* (McGill-Queen's 2020) | A review only | https://artmargins.com/nonaligned-modernism/ |

The theme tests used these supporting sources:
- Met, "Hear Me Now: The Black Potters of Old Edgefield" (2022–23): https://www.metmuseum.org/exhibitions/edgefield
- Smithsonian American Art Museum, "The Art of Gaman" (2010–11): https://americanart.si.edu/exhibitions/gaman
- MoMA, "Century of the Child" (2012): https://www.moma.org/calendar/exhibitions/1222
- Talley, "Digital Design History", *JDH* 2026: https://academic.oup.com/jdh/article/39/2/113/8537083
- Science and Industry Museum, on the Jacquard loom: https://www.scienceandindustrymuseum.org.uk/objects-and-stories/jacquard-loom

The following were located by bibliographic search only, not read:
- Graburn (ed.), *Ethnic and Tourist Arts* (1976)
- Eglash, *African Fractals* (1999)
- Brosterman, *Inventing Kindergarten* (1997)
- Fernández and Bonsiepe (eds), *Historia del diseño en América Latina y el Caribe* (2008)
- MoMA, "Toward a Concrete Utopia" (2018)

They are cited here as "source (bibliographic)" and should be checked before any claim from them enters a unit.

## 2. AP-250 against the canon

Each work was scored on whether the canon holds a grouping for its own culture, tradition or movement:
- **F**: yes.
- **P**: only a broad polity or belief, a technique, a material or an object type.
- **N**: nothing relevant.

Scoring is by my judgement. The per-work reasons are in `ap250_coverage.csv`.

| Content area | Works | F | P | N | F share |
|---|---|---|---|---|---|
| 1 Global prehistory | 11 | 7 | 4 | 0 | 64% |
| 2 Ancient Mediterranean | 36 | 36 | 0 | 0 | 100% |
| 3 Early Europe and colonial Americas | 51 | 43 | 8 | 0 | 84% |
| 4 Later Europe and Americas | 54 | 31 | 15 | 8 | 57% |
| 5 Indigenous Americas | 14 | 11 | 3 | 0 | 79% |
| 6 Africa | 14 | 7 | 7 | 0 | 50% |
| 7 West and Central Asia | 11 | 11 | 0 | 0 | 100% |
| 8 South, East and Southeast Asia | 21 | 21 | 0 | 0 | 100% |
| 9 The Pacific | 11 | 6 | 5 | 0 | 55% |
| 10 Global contemporary | 27 | 9 | 6 | 12 | 33% |
| **Total** | **250** | **182 (72.8%)** | **48** | **20** | F or P: 92.0% |

**Works with no matching canon grouping or object type (N, 20).**
- Area 4: 108 *Liberty Leading the People*; 122 *The Scream*; 125 *Mont Sainte-Victoire*; 131 *Goldfish*; 132 *Improvisation 28*; 133 Kirchner, *Self-Portrait as a Soldier*; 149 *The Bay*; 151 *Spiral Jetty*.
- Area 10: 224 *The Gates*; 225 Vietnam Veterans Memorial; 226 *Horn Players*; 233 *Trade*; 236 *En la Barbería no se Llora*; 238 *Electronic Superhighway*; 239 *The Crossing*; 241 *Pure Land*; 242 *Lying with the Wolf*; 243 *Darkytown Rebellion*; 246 *Stadia II*; 248 *Shibboleth*.

**Works matched only partly (P, 48), by area.**
- Area 1: 1 Apollo 11 stones; 3 Tequixquiac sacrum; 5 Susa beaker; 9 Ambum Stone. These have no named culture for Late Pleistocene southern Africa, central Mexico, Susa I or the New Guinea highlands.
- Area 3: 48 Catacomb of Priscilla; 49 Santa Sabina (no Early Christian grouping); 63 Arena Chapel (no Trecento grouping); 78 Pontormo (no Mannerism); 94 biombo; 95 enconchado Virgin; 97 casta painting; 98 Hogarth.
- Area 4: 100 Wright of Derby (no orrery or science grouping); 106 and 111 (no Romanticism); 113 and 114 (no Realism); 119 Rodin; 120 (no Post-Impressionism); 124 (no Chicago School or skyscraper); 127 (no Pictorialism); 129 Brancusi; 134 (no Expressionism); 139 Fallingwater; 140 Kahlo; 145 de Kooning; 148 Kusama.
- Area 5: 163 Lenape bandolier bag; 164 Kwakwaka'wakw transformation mask; 165 Eastern Shoshone painted hide. The canon has none of these peoples, and has no bandolier bag, transformation mask or Plains hide painting.
- Area 6: 173 Chokwe; 174 Baule; 175 Mende and Sande; 176 Igbo ikenga; 178 Bamileke; 179 Fang byeri; 180 Olowe of Ise (Yoruba, Ekiti). All seven are attributed to peoples, and the canon has no row for any of them (see §5).
- Area 9: 216 Rarotonga staff god; 217 Nukuoro figure; 218 Torres Strait mask; 219 Niuean hiapo; 220 Lindauer portrait.
- Area 10: 227 Song Su-nam; 230 Koons; 231 Sherman; 235 Neshat; 237 Tuffery; 244 Shonibare.

**What the pattern says.**
- The canon is complete for the ancient Mediterranean, West Asia and Asia (areas 2, 7 and 8 are 100%).
- It fails in three places:
  1. **Nineteenth- and twentieth-century European and American art movements** (area 4). Romanticism, Realism, Post-Impressionism, Symbolism, Expressionism, Fauvism, Abstract Expressionism and Land art are all absent. The canon went straight from Impressionism to the design movements.
  2. **Works attributed to peoples rather than polities** (areas 5, 6 and 9). The canon has no "community or people" kind at all (§5).
  3. **Contemporary individual artists** (area 10). Most of these will be carried by the people register being built now, so they are not flagged here. The exceptions are real groupings the canon lacks: Minimalism, Land art, Fluxus and the Korean ink-painting movement.
- **Estimated effect of fixes.**
  - Adding the GAP rows would lift the F share to about 212 of 250 (85%).
  - Adding a community family as well would lift it to about 221 (88%).
  - Most of what remains is contemporary works by individual artists, which fall to the people register.

The AP list is an *art* canon. So a gap is flagged here only where the missing grouping also carries a lesson about making: Mannerist goldsmithing, the Dutch open market, stained glass, casta painting as colonial classification, and Plains ledger drawing made in a prison. That criterion accounts for most of the style and movement rows in the CSV.

## 3. Coverage matrix

Verdicts are relative to F1 v3.6 units and the canon register.

| Benchmark theme | Where the benchmark states it | F1 coverage (unit / canon rows) | Verdict |
|---|---|---|---|
| Deep chronology from prehistory | B1 area 1; B3 ch. 1; B5 "Introduction to Prehistoric Art" | F1.5; 230 archaeological cultures; 174 firsts | covered |
| Early states and their workshops | B3 ch. 2; B1 area 2 | F1.9a, F1.6, F1.11; CIV/POL/DYN rows | covered |
| Cross-cultural encounter and exchange | B3 ch. 7; B2 ch. 1–2; B4 "The Silk Roads", "Portuguese contacts" | F1.13; 78 network rows | covered |
| Porcelain and cotton as global products | B2 ch. 2–3; B5 "East and West: Chinese Export Porcelain", "Indian Textiles: Trade and Production" | F1.13, F1.8, F1.9; NET054, NET055, MKR036 | covered |
| Industrial revolution and the machine | B3 ch. 8, 15; B7a 1999 "Markets and Manufactures" | F1.19; TEC091, TEC228, TEC229 | covered. The "putting-out" or proto-industrial system (B3 ch. 15) is not named. |
| Exhibitions and world's fairs | B3 ch. 9, 11; B2 ch. 6; B7b 2023 "Displaying Design" | F1.15, F1.19; 30 EVT rows | covered |
| Craft ideal and craft revivals | B3 ch. 10; B7a 1989, 1997, 1998 | MOV005, MOV086, Mingei (MOV096) grouping walk | covered |
| **Craft / art / design hierarchy** (academies, Salon, "minor arts") | B7a 2004 "Dangerous Liaisons: Relationships between Design, Craft and Art"; B5 "The Salon and the Royal Academy", keyword "Academic Painting" | F1.3 (canons) only implicitly. Canon has INS049 and INS050, but no Royal Academy, Académie royale, Salon or academic-art row | **partly** |
| **The designer as a profession; design education; the amateur** | B3 ch. 9–11, 17, 28; B7a 2008 "Ghosts of the Profession" and "Professionalizing Interior Design"; B7a virtual issue "Histories of Design Pedagogy"; B5 "Design Reform"; B8c (schools in Baghdad, Tripoli and Cairo) | Sprint-3 note "the invention of the designer" (F1.11). Canon has about 20 schools (INS056–INS060, INS031, INS002–INS006, INS033). No unit, and no grouping page | **missing as a unit or strand** |
| Avant-gardes and modernisms | B3 ch. 17–18, 20–31; B4 "Latin American modernisms", "Itinerant Modernisms" | F1.20 | covered |
| **Soviet, socialist and Non-Aligned design** | B3 ch. 20, 27; B7a 1997 "Design, Stalin and the Thaw"; B8d; MoMA 2018 (bibliographic) | F1.20 in principle. Canon: POL151, INS058, MOV019, STY045, STY158, POL171, POL077. There is nothing after Stalin outside architecture: no VNIITE, no GDR, no Yugoslavia, no Non-Aligned exchange | **partly** |
| **Design and the nation, including after independence** | B8b (whole book; ch. 3, 6, 15); B2 ch. 8, 9, 10; B7a 2007 "Design and Polity Under and After the Ottoman Empire"; B5 "Art and Nationalism in Twentieth-Century Turkey", "Modern Art in West Asia: Colonial to Post-colonial"; B4 "Art and Nationalism in 19th-century Latin America" | The entities exist (POL239, POL240, POL202, INS033, INS034, POL152, POL076, MOV081, STY056, EVT022, EVT024), but no unit or strand frames them | **partly (framing missing)** |
| War and design | B3 ch. 19, 37; B7a 2011 "Uniforms" | F1.19a | covered |
| Colonies and colonial design | B3 ch. 16, 33, 34; B4 "Empires and their endings"; B8a | F1.24, F1.26, F1.2 | covered |
| **Settler-colonial design and identity** (Australia, New Zealand, Canada, South Africa) | B3 ch. 14, 31; B2 ch. 6 (white South African identity at exhibitions); B8b ch. 3–4 (South African nation, Kiwiana); B7a virtual issue "Reframing Australian Design History" | F1.12 and F1.24 touch it. Canon has POL090, POL091, POL079, INS012 | **partly** |
| Consumption, the home and interiors | B7a 2003 "Anxious Homes", "Domestic Design Advice"; 2005 "Publishing the Modern Home"; 2007 "Eighteenth Century Interiors"; B5 period-room essays | F1.22a. The canon object types have **no chair, table, bed or case furniture** | **partly (entity gap)** |
| **The fashion system** | B2 ch. 3, 5, 11; B5 "Haute Couture", "Charles Frederick Worth and the House of Worth", "Miyake, Kawakubo, and Yamamoto"; B7a 2017 "Intellectual Property Rights in Fashion and Design" | F1.18 (textiles), F1.21. Canon has garments and EVT032 Rana Plaza, but no couture or fashion-system node | **partly** |
| Graphic design and typography | B7a 1992 "Graphic Design Histories"; B7a virtual issue "Typographic Histories"; B8c | F1.5 (writing), F1.20. Movements exist (MOV016, STY047, MOV022, STY114). There is **no typeface object type and no typesetting technology** after Gutenberg | **partly (entity gap)** |
| Gardens and designed landscape | B1 nos. 93, 207, 209; B5 "Chinese Gardens and Collectors' Rocks", "Gardens of Western Europe, 1600–1800", "From Geometric to Informal Gardens", "Gardens in the French Renaissance" | None. Canon only has TEC218 chinampas and MOV023 Garden City | **missing** |
| Religious building types | B1 nos. 12, 49, 192, 198; B5 keywords "Mosque", "Temple", "Church" | Styles exist, but the canon has no object type for stupa, ziggurat or basilica | **partly (entity gap)** |
| Ritual, magic, the occult and healing | B7a 2024 "Toward a Design History of the Occult"; B5 "Mesopotamian Magic", "Ethiopian Healing Scrolls", "The Magic of Signs and Patterns in North African Art" | F1.16; OBT189–OBT191, OBT198 | covered |
| **Missions and conversion as making regimes** | B5 "Arts of the Mission Schools in Mexico", "African Christianity in Kongo"; Met essay "Christianity and Kongo Visual Culture" (2025); B4 "The art of the viceroyalty of New Spain", "The colonial Andes"; B1 nos. 81, 90, 95, 216 | Entities exist: INS009 Tlatelolco, INS010 California missions, MKR027 Guarani reductions, STY072 Tequitqui, SCH004 and SCH005, INS016 Carlisle. No strand links them | **partly (framing missing)** |
| **Coerced making: slavery, plantation, prison, camp** | B5 "The Transatlantic Slave Trade"; Met "Hear Me Now" (Edgefield); SAAM "The Art of Gaman"; B7a 2021 "Material Displacements"; B7b 2018 "Design and Displacement", 2024 "Border Control" | F1.23, F1.19a, F1.13 human-flow rule; NET035, ARC201, MKR034, STY106, DIA012, MKR092. **No plantation node, no named enslaved maker community, no camp making** | **partly** |
| **Tourist, souvenir and export arts** | B5 "The Grand Tour", "Netsuke: From Fashion Fobs to Coveted Collectibles"; B8b ch. 4 (Kiwiana), ch. 7 (Lebanon tourist promotion); B6 (craft markets); Graburn 1976 (source, bibliographic) | Appears only in notes (STY177, STY178, SCH012, MKR005, SCH044). No node, strand or unit | **missing as strand** |
| **Mathematics and geometry in making** | B5 "Geometric Patterns in Islamic Art", keyword "Geometry"; Eglash 1999 (source, bibliographic) | F1.15 (ornament); STY013 notes masons' geometry; TEC168 muqarnas. No geometry technique node | **partly** |
| **Play, toys, games, sport and the child** | B6 (toys named among craft products); B5 "Board Games from Ancient Egypt and the Near East", "Greek Terracotta Figurines with Articulated Limbs", "Athletics in Ancient Greece", "The Mesoamerican Ballgame"; B7a 2012 "Design Histories of the Olympic Games"; MoMA "Century of the Child"; SAAM Gaman (toys) | Strong object coverage: OBT236–OBT250, INV052, MKR050, EVT021, and "play and music" as a function. The child as user, maker and labourer is not framed | **partly** |
| Musical instruments and sound | B5 many instrument essays (piano, harpsichord, violin, guitar, pipa, qin, rag-dung, Oceania, South Asia); B6 (instruments named) | F1.4; 20 instrument object types; PRA171, PRA189. Missing: keyboard, violin and guitar as object types | covered (entity gaps) |
| Time-keeping and scientific instruments | B5 "Telling Time in Ancient Egypt", "European Clocks", "Seventeenth-Century European Watches", "Astronomy and Astrology in the Medieval Islamic World"; B1 no. 100 | INV015–INV019, OBT144–OBT146, PRA166. Missing: watch, orrery | covered (entity gaps) |
| Weights, measures, money and standards | B5 keywords "Weights and Measures", "Numismatics"; "Rare Coins from Nishapur" | INV173, INS070–INS073, 21 money object types | covered |
| Fakes, copies, IP | B5 "Roman Copies of Greek Statues", "Intentional Alterations of Early Netherlandish Painting"; B7a 2017 IP issue; B1 no. 34 | F1.14; fake alerts in CIV006, ARC057, ARC058, ARC104, ARC121, ARC188 | covered |
| **Algorithmic making to generative AI** | Talley, *JDH* 2026 (AI as a "producing–mediating actor"); Science and Industry Museum (Jacquard punched cards to Babbage and Lovelace) | F1.5 (recurrence), F1.21; TEC090, MOV036, TEC199–TEC201. No AI node | **partly** |
| Environment and extraction | B7a 1993, 2017 "Environmental Histories of Design" | F1.22 | covered |
| Displacement, émigrés, borders | B7a 2015 "Émigrés and Design", 2021; B7b 2018, 2024 | F1.19a; DIA010–DIA012 | covered |
| Archives, collections, curating | B7a virtual issue "Archives, Collections and Curatorship"; B7b 2023 | F1.24, F1.28, F1.15. Kunstkammer not a node (DYN087 note only) | covered |
| Oral history; vernacular; DIY | B7a 2006 "Oral Histories and Design", "Do It Yourself" | F1.29; MOV034, MOV049 | covered |
| Colour; shininess (material effects) | B7a 2013 "Shininess", 2014 "Colour and Design" | Materials (about 20 dyes and pigments) | covered. A colour lens is optional. |
| Housing | B7a 2010 "Model, Method and Mediation in the History of Housing Design" | OBT028, OBT030, MOV023, STY158 | covered |
| Knowledge of nature and the universe | B6 domain 4 | F1.22, F1.12 (wayfinding), PRA197, TEC215–TEC222 | covered |
| Skills rather than objects; apprenticeship | B6 craftsmanship ("skills and knowledge… rather than the craft products themselves") | F1.28a, F1.29, the Practice entity, Practice Reading (v3.6) | covered |
| Ontological, not additive, decolonisation | B8a ("ontological rather than additive change") | F1.3 and F1.30 ("pluralism is not decolonisation", from round 1), and the §5 community gap below | covered in principle. §5 is where the canon breaks it. |
| Peoples as the unit of attribution | B1 areas 5, 6, 9 ("Kuba peoples", "Chokwe peoples", "Lenape"); B5 about 60 "X Art" keywords (Baule, Dan, Dogon, Senufo, Iatmul, Kanak, Iban, Toba Batak, Sioux…) | The Atlas logic defines the kind "Community or people", but **no canon file holds it** | **missing (structural)** |

The reverse test asked where F1 is stronger than the benchmarks.
- **Steppe.** B1 has no steppe work at all, and B3 treats the steppe only inside other chapters. F1.12a is ahead of the field.
- **Calendars and living practice.** F1.30 and the Practice entity have no counterpart in B1–B5. Only B6 supports them.
- **Consultation protocol.** F1.26 has none in any benchmark.

None of these argues for cutting. They should be flagged in the coverage report as places where F1 must supply its own sources.

## 4. Candidate themes tested

| Candidate | Result | Evidence | Proposed home |
|---|---|---|---|
| Tourist and souvenir arts (Graburn) | **Confirmed, missing** | B5 "The Grand Tour"; B8b ch. 4, 7; Graburn 1976 (bibliographic) | Atlas strand "made for visitors and buyers", run through F1.17 (the visitor and the export buyer as patrons) and F1.2 (adapting a form to a buyer's idea of it). Rows: GAP souvenir, GAP Grand Tour, GAP netsuke; STY177, STY178, SCH012, STY121, INS013 |
| Fakes, forgery, authentication | Rejected as missing: covered by F1.14 and F1.24 | B5 "Roman Copies of Greek Statues"; B7a 2017 | Add one authentication case (scientific dating of a contested terracotta, linked to the ARC028 and ARC188 alerts) to F1.24 |
| Mathematics and geometry | **Confirmed, partly** | B5 "Geometric Patterns in Islamic Art", keyword "Geometry"; Eglash 1999 | Strand in F1.15, "geometry as method": GAP girih, TEC168 muqarnas, STY013 masons' drawing, OBT139 khipu, PRA212 Vanuatu sand drawing, the Yingzao Fashi module (TXT). Eglash's fractal claims must be read before use; they are argued. |
| Soviet, socialist and Non-Aligned design | **Confirmed, partly** | B3 ch. 20, 27; B7a 1997; B8d | F1.20 gains "socialist modernisms and non-alignment" as one of its plural modernisms. Rows: GAP VNIITE, GAP Amt für industrielle Formgestaltung, GAP Yugoslav socialist modernism, GAP Non-Aligned cultural exchange, GAP Ljubljana Biennial |
| Design and nation-building after independence | **Confirmed, framing missing** | B8b; B2 ch. 8–10; B7a 2007; B5 two essays; B4 one chapter | An R1 grouping page and strand, "design and the nation". Its walk: Swadeshi (MOV081), Nehru's NID (INS033), Nkrumah (POL239), Senghor and Dakar 1966 (POL240, EVT022), FESTAC (EVT024), Turkey (POL152), Chandigarh (STY056), G Mark (GAP), ESDI (GAP). The unit home is F1.17 (the state as commissioner). |
| Missions and conversion | **Confirmed, framing missing** | B5 two essays and a 2025 Met essay; B4 two chapters; B1 nos. 81, 90, 95, 216 | Strand across F1.16 and F1.17, "the mission as a making regime": INS009, INS010, MKR027, STY072, SCH004, INS016, GAP Kongo crucifix, GAP staff god, GAP Namban |
| Making in prisons, camps and under slavery | **Confirmed, partly** | B5; Met Edgefield; SAAM Gaman; B7a 2021; B7b 2018 | Named strand "coerced making" in F1.23, cross-linked to F1.19a and F1.13. Rows: GAP Plantation, GAP Old Edgefield potters, GAP Japanese American camp makers, GAP Plains ledger (Fort Marion). The human-flow rule applies to every step. |
| Childhood, toys and play | **Confirmed, partly** | B6; B5 four essays; B7a 2012; MoMA 2012; SAAM | Atlas lens "play" (the existing function, used for the child as user, maker and labourer), with cases in F1.22a. Rows: GAP Froebel gifts, GAP children's picture book. No unit. |
| Animals as co-makers | Rejected as missing | The entities are covered (MAT043, MAT045, MAT044, MAT059, TEC081, INV070–INV074, F1.12a's horse). The benchmarks treat animals as *subjects* (B5 "Animals in Medieval Art"), not co-makers. Only B6 domain 4 supports the framing, which falls below the threshold. | Optional material lens "animal-derived". Not a strand. |
| Sound, instruments, acoustics | Instruments covered; acoustics rejected (no benchmark) | B5; B6 | Add GAP keyboard, violin and guitar rows to F1.4 |
| Light and time-keeping | Time-keeping covered; light rejected (no benchmark beyond lamps, which are in the canon) | B5 | Add GAP watch and orrery |
| Standards, measurement, money | Rejected: covered | B5 keywords | none |
| The designer as a profession; design education | **Confirmed, missing** | B3; B7a two special issues and a virtual issue; B5; B8c | See §6.1: the one new unit this round justifies |
| Craft versus art hierarchies | **Confirmed, partly** | B7a 2004 and three craft issues; B5 Salon essay and keyword | F1.3 gains "the hierarchy of the arts as a canon", paired with the designer unit. Rows: GAP Royal Academy, GAP Académie royale, GAP Salon, GAP academic art |
| AI and generative making as the newest recurrence | **Confirmed, partly** | Talley 2026; Science and Industry Museum | F1.5 recurrence chain: drawloom (TEC089), Jacquard (TEC090), computer art (MOV036), generative models (GAP). F1.21 and F1.14 take the training-data-as-copying question, and F1.23 takes credit. |

## 5. Structural gap: no "community or people" kind in the canon

The Atlas logic (§4) lists "Community or people: self-identified group, named in its own terms first… The Edo; the Haya", shown on grouping pages with protocol. None of the 13 canon files holds this kind. So AP works credited to "Chokwe peoples" or "Lenape (Delaware tribe)" can only be matched to a mask, a bag or a polity. The same holds for most of the Heilbrunn "X Art" keywords.

This is the main reason areas 5, 6 and 9 score low. It also conflicts with the decolonial benchmark (B8a): polities and archaeological cultures are the *outside* names, and the missing kind is the one named in the makers' own terms.

`kind` must be an existing kind, so these are **not** in the CSV. Proposed: a new family `community` (prefix COM, family People), drafted under the sensitivity rule (Indigenous-community and living-community, own name first, Notice by default).

Names the benchmarks use that the canon lacks as a people or community. Here "B1" means an AP work number and "B5" a Heilbrunn keyword or essay.

| Community (benchmark form) | World | Benchmark |
|---|---|---|
| Chokwe | F1.6 | B1 173; B5 "Chokwe Art" |
| Baule | F1.6 | B1 174; B5 "Baule Art" |
| Mende (and the Sande society) | F1.6 | B1 175 |
| Igbo | F1.6 | B1 176 (the canon has only 9th-century Igbo-Ukwu) |
| Bamileke / Grassfields peoples | F1.6 | B1 178 |
| Fang | F1.6 | B1 179 |
| Yoruba (as a people; Ekiti kingdoms) | F1.6 | B1 180; B5 "Yoruba Art" (the canon has only BEL042, a belief) |
| Dogon | F1.6 | B5 "Dogon Art" |
| Senufo | F1.6 | B5 "Senufo Art", "Senufo Arts and Poro Initiation" (the canon has only PRA027) |
| Dan | F1.6 | B5 "Dan Art" |
| Bwa; Bozo; Mossi (as people) | F1.6 | B5 keywords |
| Fulani / Fulbe | F1.6 | B5 "The Fulani/Fulbe People" |
| Tutsi | F1.6 | B5 "Tutsi Basketry" |
| San | F1.6 | B5 "Arts of the San People in Nomansland", "San Ethnography" |
| Xhosa; Tsonga; Nguni | F1.6 | B5 keywords |
| Lenape (Delaware) | F1.7 | B1 163 |
| Kwakwaka'wakw | F1.7 | B1 164 |
| Eastern Shoshone | F1.7 | B1 165 |
| Tewa (San Ildefonso Pueblo) | F1.7 | B1 166 |
| Lakota / Dakota (B5 uses the outside name "Sioux") | F1.7 | B5 "Sioux Art", "Dakota Art" |
| Tlingit | F1.7 | B5 (Northwest Coast essays); the canon has only STY076 formline |
| Iatmul | F1.12 | B5 "Iatmul Art" |
| Kanak | F1.12 | B5 "Kanak Art", "New Caledonia" |
| Cook Islands Māori (Rarotonga) | F1.12 | B1 216 |
| Nukuoro | F1.12 | B1 217 |
| Torres Strait Islanders (as a people, not inside the composite CIV093) | F1.12 | B1 218 |
| Niueans | F1.12 | B1 219 |
| Mangarevans | F1.12 | B5 "Mangarevan Sculpture" |
| Iban | F1.9 | B5 "Iban Art" |
| Toba Batak | F1.9 | B5 "Toba Batak Art", "The Batak" |

Several of these names are outside names (for example "Sioux" and "Bamileke"). The COM row must lead with the community's own name and record the outside name in `other_names`.

## 6. Missing themes

The evidence threshold is two benchmarks, or one benchmark plus one scholarly source. A new unit was proposed only where strongly justified.

### 6.1 The designer as a profession, and how design was taught
**Evidence.**
- B3 has design-reform, exhibition and United States chapters (9–11, 17, 28).
- B7a: "Ghosts of the Profession: Amateur, Vernacular and Dilettante Practices and Modern Design" (2008); "Professionalizing Interior Design 1870–1970" (2008); the virtual issue "Histories of Design Pedagogy".
- B5: "Design Reform".
- B8c names the schools in Baghdad, Tripoli and Cairo as part of the history.

**Why a unit.**
- This is the learners' own lineage: designers, and those who brief designers.
- F1.17 tells who commissions, and F1.19 tells what the machine changed. No unit tells how "making" split into designing and executing, who was allowed to call themselves a designer, and how that was taught: guild apprenticeship, academy, the School of Design, the Kunstgewerbeschule, the Bauhaus and Vkhutemas, Ulm, NID, ESDI, the colonial and post-colonial art schools, and the amateur the profession defined itself against.
- The canon already holds about 20 of the schools. A walk is buildable now.

**Proposed home.**
- A new Practice unit, **F1.19b "The designer: how making split into designing, and how it was taught"**. Apply: M, trace your own training lineage; B, what the brief assumes a designer is.
- Because F1 is between G1 and G3, this goes in as a versioned entry. If G3 has passed, it goes to the next-version backlog.
- Fallback if no unit is added: an R1 grouping page "schools of design", with a case in F1.17.

### 6.2 The hierarchy of the arts (craft, art, design)
**Evidence.** B7a 2004 "Dangerous Liaisons", plus the 1989, 1997 and 1998 craft issues; B5 "The Salon and the Royal Academy" and the "Academic Painting" keyword.

**Home.** A case in F1.3 ("the hierarchy of the arts is a canon too"), paired with 6.1. Rows: the Royal Academy, the Académie royale, the Salon and academic art GAP rows. Link to INS049, INS050 and MKR064 (the Guild of Saint Luke).

### 6.3 Design and the nation, including after independence
**Evidence.** B8b (the whole book); B2 ch. 8–10; B7a 2007; B5 two essays; B4 one chapter; Fernández and Bonsiepe's subtitle "…para la autonomía" (bibliographic).

**Home.** An R1 grouping page and strand. Its unit homes are F1.17 (the state as commissioner) and F1.20. It needs framing, not new entities: most nodes already exist (see §4).

### 6.4 Socialist, Soviet and Non-Aligned design after 1945
**Evidence.** B3 ch. 20 and 27 stop in 1940; B7a 1997 "Design, Stalin and the Thaw"; B8d.

**Home.** Named as one of F1.20's plural modernisms. Five GAP rows.

### 6.5 Coerced making
**Evidence.** B5 "The Transatlantic Slave Trade"; Met "Hear Me Now"; SAAM "The Art of Gaman"; B7a 2021; B7b 2018 and 2024.

**Home.** A named strand in F1.23, with a human-flow content note. Four GAP rows, plus the existing STY106 (craftsmen moved to Samarkand), DIA012, MKR092, ARC201 and NET035.

### 6.6 Tourist, souvenir and export arts
**Evidence.** B5 "The Grand Tour" and "Netsuke…"; B8b ch. 4 and 7; Graburn 1976 (bibliographic).

**Home.** A strand across F1.17 and F1.2.

### 6.7 Missions as making regimes
**Evidence.** B5 (two essays), the Met 2025 essay, B4 (two chapters), B1 (four works).

**Home.** A strand across F1.16 and F1.17. Mostly existing rows.

### 6.8 Gardens and designed landscape
**Evidence.** B1 (three works); B5 (four essays).

**Home.** A grouping page "designed landscapes", with cases in F1.16 (paradise and Zen gardens) and F1.17 (Versailles as a patron's machine). Five GAP rows.

### 6.9 Furniture, interiors and the fashion system (the design-history staples)
**Evidence.**
- Furniture and interiors: B5 (furniture and period-room essays); B7a (six interior and home issues).
- Fashion: B2 ch. 3, 5, 11; B5 couture essays; B7a 2017.

**Home.** No new unit. F1.22a takes furniture and the interior; F1.21 and F1.18 take the fashion system. The canon needs the object types: chair, table, bed, case furniture, folding screen and fan, plus haute couture and the department store.

### 6.10 Settler-colonial design and identity
**Evidence.** B3 ch. 14 and 31; B2 ch. 6; B8b ch. 3–4; the B7a virtual issue on Australia.

**Home.** A case in F1.24, and a paragraph in F1.12 and F1.7: how settler states made national design from, and against, Indigenous making. No GAP rows. The existing POL090, POL091 and POL079 carry it.

### 6.11 Geometry and mathematics as method
**Evidence.** B5 "Geometric Patterns in Islamic Art"; Eglash (bibliographic).

**Home.** A strand in F1.15. One GAP row.

### 6.12 Play and the child
**Evidence.** B6; B5; B7a 2012; MoMA 2012.

**Home.** A lens and cases in F1.22a. Two GAP rows.

### 6.13 Algorithmic making to generative AI
**Evidence.** Talley 2026; the Science and Industry Museum.

**Home.** F1.5's recurrence chain, and F1.21. One GAP row.

### 6.14 Typography and type technology
**Evidence.** B7a 1992 and the "Typographic Histories" virtual issue; B8c ("the challenges of adapting Arabic to different technologies developed for Latin script").

**Home.** Continue F1.5's writing recurrence into F1.21. Rows: GAP typeface and GAP hot-metal typesetting. This also fills a gap for the Arabic, Chinese and Indic scripts.

## 7. Missing entities: summary

`missing_entities.csv` has 85 rows.

| Family | Kind | Rows |
|---|---|---|
| Things | object-type | 35 |
| Things | technique | 7 |
| Ideas | style | 15 |
| Ideas | movement | 9 |
| People | institution | 13 |
| People | maker-community | 2 |
| Connections | network | 2 |
| Time | event (exhibitions only; law and war events are left to the OCC register) | 2 |

The community names in §5 (about 30) are extra. They are not in the CSV because no existing kind fits them.

The rows fall into these groups:
- **AP-driven.** Early Christian art, Mannerism, Dutch Golden Age, casta painting, Namban art, Romanticism, Realism, Post-Impressionism, Symbolism, Expressionism, Fauvism, Pictorialism, Chicago School, Abstract Expressionism, Minimalism, Land art, Fluxus, Plains hide and ledger art, the Korean ink-painting movement, Niuean hiapo. Object types: kiswa, ndop, ikenga, byeri, sowei, bandolier bag, transformation mask, staff god, the Nukuoro figure, the Torres Strait turtle-shell mask, stupa, ziggurat, basilica, steel-frame skyscraper, orrery, folding screen. Techniques: enconchado, stained glass, manuscript illumination, photomontage.
- **Heilbrunn-driven.** Chair, table and desk, bed, case furniture, hand fan, netsuke, watch, keyboard instruments, violin, guitar, Kongo crucifix, the Grand Tour, Islamic geometric pattern construction, the Chinese scholar's garden, the English landscape garden, the French formal garden, chahar bagh, dry landscape garden, the Royal Academy, the Académie royale, the Salon, academic art, haute couture.
- **Design-history-driven.** Telephone, typeface, hot-metal typesetting, ICSID, industrial design consultancy, the Kunstgewerbeschule, VNIITE, the Amt für industrielle Formgestaltung, G Mark, ESDI, the Cairo applied-arts school, the department store, Yugoslav socialist modernism, Non-Aligned cultural exchange, the Ljubljana Biennial, Froebel gifts, the children's picture book, souvenir, plantation, the Old Edgefield potters, the Japanese American camp makers, generative models.

**Rows a verifier should check first:**
- GAP083, Faculty of Applied Arts, Cairo. Dates unknown; low confidence.
- GAP021, Korean ink-painting movement. Membership and dates to verify.
- GAP072, Haute couture system. The 1868 and 1911 naming to verify.
- GAP079 (VNIITE) and GAP080 (Amt für industrielle Formgestaltung). End dates and remit to verify.
- GAP037, chahar bagh. The Pasargadae start is the contested part.
- GAP035, hand fan. The folding-fan origin is to verify.
- GAP064, Froebel gifts. Brosterman's modernism thesis is argued; the row says so.
- GAP068, Non-Aligned cultural exchange. Scope drawn from one review.
- GAP029, generative models. Fast-moving; the dates are the only facts claimed.

**Drafting discipline applied (the round-1 lessons):**
- No "first", "invented" or "built" without a hedge ("often cited", "often described as", "associated with").
- `human-flow` appears on every row naming enslaved, coerced, interned or forcibly moved people: Dutch Golden Age, Namban, the English landscape garden, Plains ledger art, the plantation, Edgefield, the camps.
- Sacred, ancestral and funerary flags are on all ritual object types.
- No UNESCO status, licence or identifier is typed without verification. Where uncertain, the row says "to verify".

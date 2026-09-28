import csv, os
BASE = '/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/f1-scope'
CANON = BASE + '/canon/'
LOG = BASE + '/REVIEW_LOG_things.md'

U = 'https://ich.unesco.org/en/state/'
C = []  # (file, id, field, new, source)
def ch(f, i, field, new, src):
    C.append((f, i, field, new, src))

# ---------- movements / styles / schools ----------
M = 'canon_movements_styles_schools'
ch(M, 'STY111', 'defined_by', 'Yahya Kemal (coined the term) and Ahmed Refik Altınay (İkdam serial 1913; book Lâle Devri, c. 1913–15); later historians', 'https://islamansiklopedisi.org.tr/lale-devri')
ch(M, 'STY074', 'sensitivity', 'human-flow', 'https://en.wikipedia.org/wiki/Polo_y_servicios (row leaves_out names forced labour)')
ch(M, 'STY074', 'notes', 'Term usually attributed to Alicia Coseteng (Spanish Churches in the Philippines, 1972); Pál Kelemen had used "earthquake baroque" for Latin America; forced labour (polo y servicio) flagged as human-flow.', 'https://en.wikipedia.org/wiki/Paoay_Church')
ch(M, 'STY081', 'date_note', 'approx.; most scholars date Round Head painting c. 9500–7500 BP (c. 7500–5500 BCE); a higher (10th millennium BP) and a lower (8th millennium BP) chronology are both argued; some late survivals', 'https://roundheadsahara.com/wp-content/uploads/2024/09/2011-The_Earliest_Rock_Paintings_of_the_Centr.pdf')
ch(M, 'STY114', 'notes', 'Checked: "Arabic type modernism" is the project\'s own umbrella label, not a name used by the designers or a recognised movement; scope = Arabic type for metal, photo and digital setting from c. 1950 (see AbiFares, Arabic Typography, 2001).', 'BRIEF.md labelling rule (no external source needed)')
ch(M, 'STY131', 'sensitivity', 'sacred;human-flow', 'https://en.wikipedia.org/wiki/Pagan_Kingdom (kyun bonded temple servants in donation inscriptions)')
ch(M, 'STY160', 'making_significance', 'South Indian building texts name three temple types, defined mainly by plan shape (square, polygonal, round or apsidal), which later writers mapped onto north, south and the Deccan and still use to classify temples.', 'https://en.wikipedia.org/wiki/Vesara')
ch(M, 'STY160', 'notes', 'Checked: in the agamas and Manasara, Vesara means a round or apsidal (or square-below, round-above) form; its modern use for Deccan "hybrid" temples is contested (Adam Hardy prefers "Karnata Dravida"; George Michell avoids the term).', 'https://en.wikipedia.org/wiki/Vesara')
ch(M, 'STY161', 'notes', 'Project\'s own umbrella label, not a historical group name. Checked: Lahore Art Circle founded 1952 (Shakir Ali, Anwar Jalal Shemza, Ahmed Parvez and others); Mayo School became the National College of Arts in 1958.', 'https://mathaf.org.qa/en/encyclopedia/artists-biographies/shakir-ali/')

# ---------- makers / institutions ----------
K = 'canon_makers_institutions'
ch(K, 'MKR058', 'date_note', 'Al Sadu Project begun 1978 as a private initiative; Sadu House opened 1980; became the Al Sadu Weaving Cooperative Society, owned by the weavers, in 1991', 'https://en.wikipedia.org/wiki/Al_Sadu ; https://alsadu.org.kw/sadu-house-history/')
ch(K, 'MKR058', 'defined_by', 'founders (a group of Kuwaitis; honorary president Sheikha Altaf Salem Al-Ali Al-Sabah)', 'https://alsadu.org.kw/al-sadu-society/')
ch(K, 'MKR058', 'confidence', 'high', 'https://en.wikipedia.org/wiki/Al_Sadu')
ch(K, 'INS086', 'end', '1990', 'https://nga.gov.au/exhibitions/imagining/')
ch(K, 'INS086', 'date_note', 'Creative Arts Centre opened 1972 (director Tom Craig); renamed National Arts School 1976; merged into the University of Papua New Guinea 1990', 'https://nga.gov.au/exhibitions/imagining/ ; https://en.wikipedia.org/wiki/National_Arts_School_(Papua_New_Guinea)')
ch(K, 'INS086', 'making_significance', "Growing out of the Beiers' Centre for New Guinea Cultures, where Timothy Akis and Mathias Kauage first exhibited in 1969, the Creative Arts Centre (1972) and National Arts School (1976) in Port Moresby hosted them as artists-in-residence and trained painters and printmakers.", 'https://nga.gov.au/exhibitions/imagining/')
ch(K, 'INS086', 'defined_by', 'PNG government; first director Tom Craig', 'https://printsandprintmaking.gov.au/references/2632/')
ch(K, 'INS086', 'confidence', 'medium', 'https://nga.gov.au/exhibitions/imagining/')
ch(K, 'INS086', 'notes', 'Checked: founding 1972, renamed 1976, merged into UPNG 1990; Akis and Kauage were artists-in-residence.', 'https://nga.gov.au/exhibitions/imagining/')

# ---------- practices ----------
P = 'canon_practices'
ch(P, 'PRA007', 'free_sources', 'British Museum EMKP (CC BY-NC-SA; project 2020SG08 repository); Wikimedia Commons; community-published site', 'https://www.emkp.org/documenting-knowledge-skills-and-practices-of-dry-stone-masonry-at-great-zimbabwe-2/')
ch(P, 'PRA007', 'notes', 'Checked: EMKP funded "Documenting Knowledge, Skills, and Practices of Dry-Stone Masonry at Great Zimbabwe" (project 2020SG08, PI Munyaradzi Elton Sagiya, 2021–22, with NMMZ masons).', 'https://www.emkp.org/documenting-knowledge-skills-and-practices-of-dry-stone-masonry-at-great-zimbabwe-2/')
ch(P, 'PRA007', 'confidence', 'medium', 'https://www.arch.cam.ac.uk/research/projects/recently-completed-projects/documenting-knowledge-skills-and-practices-dry-stone')
ch(P, 'PRA002', 'defined_by', 'Asante (Bonwire) and Ewe (Agotime, Kpetoe) weavers; UNESCO ICH list (2024)', 'https://ich.unesco.org/en/RL/craftsmanship-of-traditional-woven-textile-kente-02130')
ch(P, 'PRA002', 'notes', 'Inscribed 2024 as "Craftsmanship of traditional woven textile Kente" (Ghana, Representative List). Printed kente copies made abroad are an F1.14 case.', 'https://ich.unesco.org/en/RL/craftsmanship-of-traditional-woven-textile-kente-02130')
ch(P, 'PRA011', 'name', 'Argan, practices and know-how concerning the argan tree', U + 'morocco-MA')
ch(P, 'PRA012', 'name', 'Knowledge, know-how and practices pertaining to the production and consumption of couscous', U + 'morocco-MA')
ch(P, 'PRA027', 'date_note', "Inscribed 2011 for Mali and Burkina Faso (6.COM 13.29); extended to Côte d'Ivoire 2012 (7.COM 11.21); extended 2024 with Indonesia as 'Cultural practices and expressions linked to Balafon and Kolintang'", 'https://ich.unesco.org/en/decisions/6.COM/13.29 ; https://ich.unesco.org/en/decisions/7.COM/11.21 ; ' + U + 'indonesia-ID')
ch(P, 'PRA027', 'defined_by', 'UNESCO ICH list (2011; extended 2012 and 2024)', 'https://ich.unesco.org/en/decisions/6.COM/13.29')
ch(P, 'PRA027', 'confidence', 'high', 'https://ich.unesco.org/en/decisions/7.COM/11.21')
ch(P, 'PRA057', 'name', 'Traditional knowledge and techniques associated with Pasto Varnish mopa-mopa of Putumayo and Nariño', U + 'colombia-CO')
ch(P, 'PRA062', 'date_note', 'Inscribed 2015 (Representative List, not Urgent Safeguarding)', U + 'venezuela-bolivarian-republic-of-VE')
ch(P, 'PRA062', 'defined_by', 'UNESCO ICH list (2015)', U + 'venezuela-bolivarian-republic-of-VE')
ch(P, 'PRA062', 'confidence', 'high', U + 'venezuela-bolivarian-republic-of-VE')
ch(P, 'PRA074', 'date_note', 'Inscribed 2009 on the Urgent Safeguarding List; transferred to the Representative List 2024', U + 'china-CN')
ch(P, 'PRA074', 'defined_by', 'UNESCO ICH list (2009 Urgent Safeguarding; Representative List from 2024)', U + 'china-CN')
ch(P, 'PRA076', 'date_note', 'Inscribed 2009 on the Urgent Safeguarding List; transferred to the Representative List 2024', U + 'china-CN')
ch(P, 'PRA076', 'defined_by', 'UNESCO ICH list (2009 Urgent Safeguarding; Representative List from 2024)', U + 'china-CN')
ch(P, 'PRA090', 'name', 'Kimjang, making and sharing kimchi in the Republic of Korea', U + 'republic-of-korea-KR')
ch(P, 'PRA091', 'name', 'Knowledge, beliefs and practices related to jang making in the Republic of Korea', U + 'republic-of-korea-KR')
ch(P, 'PRA091', 'confidence', 'high', U + 'republic-of-korea-KR')
ch(P, 'PRA094', 'date_note', 'Inscribed 2014 (Sekishu-Banshi, Hon-Minoshi, Hosokawa-shi; Sekishu-Banshi alone 2009); extended 2025', 'https://ich.unesco.org/en/Decisions/20.COM/7.b.51')
ch(P, 'PRA097', 'date_note', 'Inscribed 2020; extended 2025', 'https://www.mofa.go.jp/press/release/pressite_000001_01917.html')
ch(P, 'PRA104', 'name', 'Rickshaws and rickshaw painting in Dhaka', U + 'bangladesh-BD')
ch(P, 'PRA131', 'date_note', 'Inscribed 2011 on the Urgent Safeguarding List; transferred to the Representative List 2025, when its safeguarding programme was also selected for the Register of Good Safeguarding Practices', 'https://ich.unesco.org/en/RL/al-sadu-traditional-weaving-skills-in-the-united-arab-emirates-00517 ; ' + U + 'united-arab-emirates-AE')
ch(P, 'PRA131', 'defined_by', 'UNESCO ICH list (2011 Urgent Safeguarding; Representative List 2025)', U + 'united-arab-emirates-AE')
ch(P, 'PRA132', 'date_note', 'Inscribed 2022 (Representative List, not Urgent Safeguarding)', 'https://ich.unesco.org/en/decisions/17.COM/7.B.32')
ch(P, 'PRA132', 'defined_by', 'UNESCO ICH list (2022)', 'https://ich.unesco.org/en/decisions/17.COM/7.B.32')
ch(P, 'PRA138', 'name', 'Craftsmanship of Aleppo Ghar soap', 'https://ich.unesco.org/en/RL/craftsmanship-of-aleppo-ghar-soap-02132')
ch(P, 'PRA138', 'date_note', 'Inscribed 2024 (Syria, Representative List); tradition centuries old', 'https://ich.unesco.org/en/RL/craftsmanship-of-aleppo-ghar-soap-02132')
ch(P, 'PRA138', 'defined_by', 'UNESCO ICH list (2024)', 'https://ich.unesco.org/en/decisions/19.COM/7.B.10')
ch(P, 'PRA138', 'confidence', 'high', 'https://ich.unesco.org/en/RL/craftsmanship-of-aleppo-ghar-soap-02132')
ch(P, 'PRA139', 'name', 'Crafting and playing the Oud', 'https://ich.unesco.org/en/RL/crafting-and-playing-the-oud-01867')
ch(P, 'PRA139', 'date_note', 'Inscribed 2022 (Iran, Syria)', 'https://ich.unesco.org/en/RL/crafting-and-playing-the-oud-01867')
ch(P, 'PRA139', 'defined_by', 'UNESCO ICH list (2022)', 'https://ich.unesco.org/en/decisions/17.COM/7.B.16')
ch(P, 'PRA139', 'confidence', 'high', 'https://ich.unesco.org/en/RL/crafting-and-playing-the-oud-01867')
ch(P, 'PRA159', 'date_note', "Inscribed 2014 (Kazakhstan, Kyrgyzstan); extended 2025 as 'Traditional knowledge and skills in making Kyrgyz, Kazakh and Karakalpak yurts'", U + 'kyrgyzstan-KG')
ch(P, 'PRA168', 'date_note', 'Selected 2020 for the Register of Good Safeguarding Practices (Austria, France, Germany, Norway, Switzerland); not a Representative List element', 'https://ich.unesco.org/en/decisions/15.COM/8.C.3')
ch(P, 'PRA168', 'defined_by', 'UNESCO Register of Good Safeguarding Practices (2020)', 'https://ich.unesco.org/en/decisions/15.COM/8.C.3')
ch(P, 'PRA172', 'name', 'Art of dry stone construction, knowledge and techniques', U + 'croatia-HR')
ch(P, 'PRA172', 'date_note', "Inscribed 2018 as 'Art of dry stone walling, knowledge and techniques'; extended and renamed 2024", U + 'croatia-HR ; ' + U + 'greece-GR')
ch(P, 'PRA186', 'date_note', 'Inscribed 2019 (Representative List, not Urgent Safeguarding)', 'https://ich.unesco.org/en/decisions/14.COM/10.B.40')
ch(P, 'PRA186', 'defined_by', 'UNESCO ICH list (2019)', 'https://ich.unesco.org/en/RL/tradition-of-kosiv-painted-ceramics-01456')

# ---------- techniques ----------
T = 'canon_techniques'
ch(T, 'TEC063', 'start', '550', 'https://www.sciencedirect.com/science/article/pii/S2352409X23003681')
ch(T, 'TEC063', 'date_note', 'earliest confirmed draw-plates 6th–8th c. CE (Old Uppsala, Vendel Period; Merovingian finds); Viking Age plates at Birka, Haithabu and Staraya Ladoga; drawn wire of Roman date claimed; earlier wire made by strip-twisting and hammering', 'https://www.sciencedirect.com/science/article/pii/S2352409X23003681')
ch(T, 'TEC063', 'confidence', 'medium', 'https://www.sciencedirect.com/science/article/pii/S2352409X23003681')
ch(T, 'TEC140', 'date_note', "turned bowl fragment from the Warrior's Tomb, Tarquinia c. 700 BCE; 7th-c. BCE turned dishes from Anatolian tumuli and lathe pivots from Thebes (Sitry); a Mycenaean claim (c. 1400–1100 BCE) is unproven", 'https://egyptianexpedition.org/articles/two-pivots-of-the-7th-century-bce/')
ch(T, 'TEC140', 'confidence', 'medium', 'https://egyptianexpedition.org/articles/two-pivots-of-the-7th-century-bce/')
ch(T, 'TEC072', 'date_note', "Schmidt and Avery (1978) dated preheated-blast smelting at KM2/KM3 (Kemondo Bay) to c. 1,500–2,000 years ago; the preheating and 'steel' claims were challenged by Rehder (1986) and Eggert (1987)", 'https://mci.si.edu/node/1184404 ; https://bcin.info/vufind/Record/Smithsonian-Museum%20Conservation%20Institute.MCI71882')
ch(T, 'TEC087', 'start', '-3700', 'https://collections.ucl.ac.uk/Details/petrie/69250')
ch(T, 'TEC087', 'date_note', 'possible loom on a Naqada I–II bowl from Badari tomb 3802 (Petrie Museum UC9547), c. 3900–3500 BCE; used by Bedouin and Central Asian weavers today', 'https://ponda.org/object/C-0047')
ch(T, 'TEC157', 'start', '-3500', 'https://exa.ai/library/publication/t1bnbhc9112 (Mauricio et al. 2021, earliest adobe monumental architecture)')
ch(T, 'TEC157', 'date_note', 'Andean adobe before 3100 BCE (Los Morteros, Chao Valley) and c. 3500 BCE (Sechín Bajo); Pueblo puddled adobe; Spanish mould-made adobe from 16th c.', 'https://exa.ai/library/publication/t1bnbhc9112')
ch(T, 'TEC157', 'notes', 'Checked: earliest Andean adobe is Preceramic (4th millennium BCE), not 2nd millennium BCE.', 'https://exa.ai/library/publication/t1bnbhc9112')
ch(T, 'TEC220', 'start', '-1000', 'https://ar.library.dctabudhabi.ae/sites/default/files/The%20Iron%20Age%20Sites%20of%20Hili_0.pdf')
ch(T, 'TEC220', 'date_note', 'aflaj at Hili 15 and Bida Bint Saud (UAE) associated with Iron Age II pottery c. 1000–600 BCE; Iranian origin argued (English, Lightfoot), Arabian origin argued (Al Tikriti); secure absolute dates lacking (Charbonnier)', 'https://shs.hal.science/halshs-01809304')
ch(T, 'TEC133', 'date_note', "long-standing; ongoing; UNESCO: UAE Al Sadu 2011 (Urgent Safeguarding; Representative List 2025); 'Traditional weaving of Al Sadu' Kuwait and Saudi Arabia 2020, extended with Qatar 2025", 'https://ich.unesco.org/en/RL/traditional-weaving-of-al-sadu-02158')
ch(T, 'TEC171', 'date_note', 'long-standing; UNESCO: Mongol ger 2013; Kyrgyz and Kazakh yurts 2014, extended to Karakalpak yurts 2025', U + 'kyrgyzstan-KG ; ' + U + 'mongolia-MN')
ch(T, 'TEC219', 'date_note', 'channels dated c.6,600 years ago; Budj Bim Cultural Landscape inscribed as World Heritage 2019 (not an ICH element)', 'https://whc.unesco.org/en/list/1577')
ch(T, 'TEC012', 'date_note', 'earliest reliable eyed needles c. 45–40 ka in Siberia (Strashnaya Cave 44–49 ka); the Denisova Cave claim of c. 50 ka rests on one radiocarbon date and most of layer 11 dates 25–20 ka; Mezmaiskaya (Caucasus) 36–28 ka', 'https://exa.ai/library/publication/2js55hbsh3k (d\'Errico et al. 2018) ; https://pmc.ncbi.nlm.nih.gov/articles/PMC12095498/')

# ---------- materials ----------
A = 'canon_materials'
ch(A, 'MAT002', 'notes', 'Checked: obsidian handaxe workshop at Simbiro III, Melka Kunture, dated >1.2 Ma (Mussi et al. 2023).', 'https://pubmed.ncbi.nlm.nih.gov/36658266/')
ch(A, 'MAT002', 'confidence', 'high', 'https://pubmed.ncbi.nlm.nih.gov/36658266/')
ch(A, 'MAT128', 'start', '-1450', 'https://www.sciencedirect.com/science/article/abs/pii/S0305440312000337')
ch(A, 'MAT128', 'sub_regions', 'AF-CEN;WA-IRN;AS-CHN;AF-EGY', 'https://www.sciencedirect.com/science/article/abs/pii/S0305440312000337')
ch(A, 'MAT128', 'date_note', 'cobalt-blue glass in Egypt from the reign of Thutmose III (c. 1450 BCE), using Western Desert alum; cobalt blue on Abbasid ceramics 9th c.; DR Congo supplies most battery cobalt today', 'https://www.sciencedirect.com/science/article/abs/pii/S0305440312000337')
ch(A, 'MAT062', 'notes', 'Earliest date uncertain; ramie is among the bast fibres identified at waterlogged Neolithic sites in southern China (c. 6000–3500 BCE); start kept approximate.', 'https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0346767')

# ---------- object types ----------
O = 'canon_object_types'
ch(O, 'OBT142', 'start', '-1500', 'https://en.wikipedia.org/wiki/History_of_cartography')
ch(O, 'OBT142', 'date_note', 'Nippur city plan on a clay tablet c. 1500–1300 BCE; Babylonian Map of the World c. 600 BCE; Mawangdui maps 168 BCE; older candidates contested', 'https://en.wikipedia.org/wiki/History_of_cartography')
ch(O, 'OBT103', 'date_note', 'Strashnaya Cave c. 44–49 ka; a Denisova Cave claim of c. 50 ka rests on one radiocarbon date; many c. 40,000–20,000 BP', 'https://exa.ai/library/publication/2js55hbsh3k (d\'Errico et al. 2018)')
ch(O, 'OBT151', 'date_note', 'One tablet (Échancrée) is on wood felled c. 1493–1509 CE (Ferrara et al. 2024); other dated tablets are on 18th–19th-century wood', 'https://www.nature.com/articles/s41598-024-53063-7')

# ---------- firsts ----------
F = 'canon_firsts'
ch(F, 'INV008', 'date_note', 'Tablet D (Échancrée) is on wood felled c. 1493–1509 CE (Ferrara et al. 2024); tablets O, Q and three Rome tablets are on 18th–19th-century wood', 'https://www.nature.com/articles/s41598-024-53063-7')
ch(F, 'INV008', 'notes', 'Invention before or after European contact (Roggeveen 1722; Spanish visit 1770) is debated; old wood could be driftwood kept for years before carving.', 'https://www.nature.com/articles/s41598-024-53063-7')
ch(F, 'INV030', 'date_note', 'Kuahuqiao lacquered bow c. 8,000 BP; Kakinoshima B (Hokkaido) lacquered threads from a burial dated c. 9,000 cal BP on soil samples, contested; burial context suggests c. 8,000–7,000 BP', 'https://exa.ai/library/publication/6ryvw5ds3vc (Matsumoto 2018)')
ch(F, 'INV030', 'sensitivity', 'funerary', 'https://exa.ai/library/publication/6ryvw5ds3vc (Kakinoshima threads are burial goods)')
ch(F, 'INV087', 'date_note', 'Nok furnaces (incl. Taruga) mostly mid-1st millennium BCE; Taruga dates spread c. 800 BCE–50 CE; Great Lakes c. 1st millennium BCE', 'https://docslib.org/doc/3524945/nok-early-iron-production-in-central-nigeria-new-finds-and-features (Junius 2016)')
ch(F, 'INV091', 'date_note', 'earliest zinc-smelting ash at Zawar dated 840±110 CE; industrial scale from the 11th–12th c.', 'https://asc.iitgn.ac.in/assets/publications/research_papers/Zinc_Extraction_2020.pdf')
ch(F, 'INV091', 'confidence', 'medium', 'https://asc.iitgn.ac.in/assets/publications/research_papers/Zinc_Extraction_2020.pdf')
ch(F, 'INV091', 'notes', 'Checked (Craddock et al.; Gurjar et al. 2001): zinc mining at Zawar from c. 5th c. BCE, metallic zinc by distillation from c. 9th c. CE.', 'https://asc.iitgn.ac.in/assets/publications/research_papers/Zinc_Extraction_2020.pdf')
ch(F, 'INV097', 'start', '-3700', 'https://collections.ucl.ac.uk/Details/petrie/69250')
ch(F, 'INV097', 'date_note', 'Naqada I–IIB bowl from Badari tomb 3802 (Petrie Museum UC9547), c. 3900–3500 BCE; Badari is the find-place, not the Badarian period', 'https://ponda.org/object/C-0047 ; https://www.ucl.ac.uk/museums-static/digitalegypt/textil/tools.html')
ch(F, 'INV097', 'making_significance', 'Earliest known image of a loom: probably a horizontal ground loom, painted on a bowl from Badari in Egypt.', 'https://collections.ucl.ac.uk/Details/petrie/69250')
ch(F, 'INV097', 'confidence', 'medium', 'https://collections.ucl.ac.uk/Details/petrie/69250')
ch(F, 'INV097', 'notes', 'Checked: earlier "c. 4400 BCE" was wrong (Badarian date applied to a Naqada bowl). Reading as a loom is probable, not certain.', 'https://ponda.org/object/C-0047')
ch(F, 'INV137', 'date_note', 'Hili 15 and Bida Bint Saud (UAE) aflaj with Iron Age II pottery, c. 1000–600 BCE; Iranian qanats argued to be as early or earlier; no secure absolute dates on either side', 'https://shs.hal.science/halshs-01809304 ; https://abudhabiculture.ae/en/cultural-resources/publications/the-iron-age-sites-of-hili')
ch(F, 'INV149', 'date_note', 'Madjedbebe Phase 2 (68.7–50.4 ka): seed-grinding use-wear on two grindstones (Hayes et al. 2022), within a debated 65 ka chronology; Cuddie Springs c. 30,000 BP', 'https://www.nature.com/articles/s41598-022-15174-x')
ch(F, 'INV154', 'start', '-45000', 'https://exa.ai/library/publication/2js55hbsh3k (d\'Errico et al. 2018)')
ch(F, 'INV154', 'other_names', 'Denisova needle; Strashnaya needle', 'https://exa.ai/library/publication/2js55hbsh3k')
ch(F, 'INV154', 'date_note', 'Strashnaya Cave c. 44–49 ka; Denisova Cave needle claimed >50 ka on one radiocarbon date, but most of layer 11 dates 25–20 ka (Jacobs et al. 2025)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12095498/')
ch(F, 'INV154', 'making_significance', 'Among the earliest known eyed needles, from Siberian caves.', 'https://exa.ai/library/publication/2js55hbsh3k')

# ---------- apply ----------
by_file = {}
for c in C:
    by_file.setdefault(c[0], []).append(c)
log_rows = []
for f, changes in by_file.items():
    path = CANON + f + '.csv'
    with open(path, newline='', encoding='utf-8') as fh:
        rd = csv.DictReader(fh)
        header = rd.fieldnames
        rows = list(rd)
    idx = {r['id']: r for r in rows}
    for _, i, field, new, src in changes:
        assert i in idx, (f, i)
        assert field in header, field
        assert field != 'id'
        old = idx[i][field]
        if old == new:
            continue
        idx[i][field] = new
        log_rows.append((i, field, old, new, src))
    with open(path, 'w', newline='', encoding='utf-8') as fh:
        w = csv.DictWriter(fh, fieldnames=header, quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        w.writerows(rows)

def esc(s):
    return s.replace('|', '\\|').replace('\n', ' ') if s else '(empty)'
new_log = not os.path.exists(LOG)
with open(LOG, 'a', encoding='utf-8') as fh:
    if new_log:
        fh.write('# Review log: things registers (independent fact-check, 2026-09-28)\n\n')
        fh.write('| id | field | old | new | source URL |\n|---|---|---|---|---|\n')
    for r in log_rows:
        fh.write('| ' + ' | '.join(esc(x) for x in r) + ' |\n')
print(len(log_rows), 'cell changes;', len({r[0] for r in log_rows}), 'rows')

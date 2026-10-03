"""F1 content-strand audit. Read-only on the repo; writes CSVs and tables to this folder.

Steps:
 1. cases: hand classification (cases_hand.py) -> cases.csv, per-unit table
 2. claims: keyword classification (rules below) -> claims.csv; open-object counts (section 5)
 3. canon: rows by kind -> five strands
 4. compare canon / cases / claims
 5. world chapters: movements, civilisations, events taught (section 4 node ids -> canon names) and expert absences
"""
import re, os, csv, json, glob, random, collections
from cases_hand import CASES
from parse_specs import parse_spec, unit_key, unit_of, SPECS, REPO, OUT

CANON = os.path.join(REPO, 'atlas/data/canon')
GROUPING = os.path.join(REPO, 'grouping-pages')
STRANDS = {1: 'objects', 2: 'movements', 3: 'civilisations & places', 4: 'events & timeline', 5: 'concepts & people'}
WORLD_CHAPTERS = ['F1.5', 'F1.6', 'F1.7', 'F1.8', 'F1.9', 'F1.9a', 'F1.10', 'F1.11', 'F1.12', 'F1.12a', 'F1.13']

# ---------------------------------------------------------------- 1. cases
def weights_of(strands):
    ss = [int(s) for s in strands.split('/')]
    return {s: 1.0 / len(ss) for s in ss}

def cases_table():
    rows = []
    per_unit = collections.defaultdict(lambda: collections.Counter())
    for unit, label, strands, note in CASES:
        for s, w in weights_of(strands).items():
            rows.append({'unit': unit, 'case': label, 'strand': s, 'strand_name': STRANDS[s], 'weight': w, 'note': note})
            per_unit[unit][s] += w
    with open(os.path.join(OUT, 'cases.csv'), 'w', newline='', encoding='utf-8') as fh:
        w = csv.DictWriter(fh, fieldnames=['unit', 'case', 'strand', 'strand_name', 'weight', 'note'])
        w.writeheader(); w.writerows(rows)
    return per_unit

# ---------------------------------------------------------------- 2. claims
# Keyword rules. Each strand has (pattern, weight) pairs; a claim's score per strand is the sum of weights of
# patterns that match at least once (a pattern counts once, however many times it matches).
# Scores: highest strand wins; if the runner-up is within 80% of the winner and both >= 2, split 0.5/0.5.
# Confidence "interpretive" (the unit's own framing) forces strand 5. No match at all -> strand 5.
RULES = {
 1: [
  (r'\b(Met|Cleveland|Walters|Rijksmuseum|AIC|Art Institute|NMK|Brooklyn|NMNH|NMAH|NMAAHC|Hermitage|Louvre|V&A|British Museum|Museums Victoria|Smithsonian|Freer|Powerhouse|NGA|NMAI|NYPL|Library of Congress|LOC)\b', 1.0),
  (r'\b\d{2,4}\.\d{1,4}(\.\d+)?[a-z]?\b', 1.0),   # accession numbers
  (r'(?i)\b(plaque|bowl|jar|dish|vase|cup|lamp|tablet|seal|chisel|axe|knife|buckle|mask|drum|kora|saron|chair|poster|print|woodcut|engraving|lithograph|folio|manuscript|codex|scroll|painting|portrait|cloth|textile|tunic|mantle|blanket|rug|carpet|hanging|quilt|kantha|sari|chintz|palampore|batik|patolu|patola|chuval|kente|kanga|khipu|tent|ger\b|yurt|ensi|basket|fanner|sandal|chappal|gown|coat|trousers|helmet|bit\b|cheekpiece|stirrup|wheel|chariot|canoe|ship|hull|wreck|sherds?|pots?\b|pottery|ceramics?|porcelain|celadon|stoneware|earthenware|delftware|fritware|tiles?|bricks?|glass|beads?|ingot|coins?|weights?|astrolabe|typeface|font|sticker|splint|furniture|cabinet|caddy|teapot|stand\b|mortar|platter|toad|lizard|statue|figurine|sculpture|relief|mould|stamp|loom|kiln|furnace|slag|tuy[eè]re|lampas|roundel|object|objects|vessel|wallpaper|embroider\w*|cards?\b|film\w*|recording|disc)\b', 1.0),
  (r'(?i)\b(bronze|brass|copper|iron|steel|gold|silver|tin\b|lead\b|cobalt|manillas?|clay|steatite|chert|flint|basalt|stone|marble|ivory|wood|teak|bamboo|paper|parchment|papyrus|silk|cotton|wool|linen|felt|fibre|raffia|bark|barkcloth|indigo|cochineal|madder|dyes?|pigment|lacquer|glaze|enamel|rubber|guano|saltpetre|nitrate|rare earths?|lithium|agate|carnelian|camelid|yarn)\b', 1.0),
  (r'(?i)\b(cast|casting|lost-wax|piece-mould|smelt\w*|bloomery|forg\w+|hammer\w*|weav\w+|woven|spun|spinning|knot\w*|ply|dyeing|dyed|printed|printing|block-print\w*|woodblock|intaglio|engrav\w+|etch\w*|thrown|fired|firing|inlay|inlaid|sanggam|kintsugi|mosaic|carv\w+|knapp\w+|ground-edge|ground edge|blown|mould-blown|underglaze|tin-glaz\w*|life-cast\w*|technique|jacquard|typesetting|linotype|tapestry|lampwork|gilt|gilded|lustre|drill\w*|moulds?)\b', 1.0),
 ],
 2: [
  (r'(?i)\b(movement|style|school of|School\b|Bauhaus|Mingei|Arts and Crafts|modernis\w*|Renaissance|Gothic|Baroque|Rococo|Chinoiserie|ukiyo-e|Kano\b|Vkhutemas|Ulm|Company school|Art Deco|Art Nouveau|Constructiv\w*|Secession|Werkbund|avant-garde|folk craft\w*|revival|neo-\w+|Brutalis\w*|tropical modern\w*|national in form|Natural Synthesis|Antropofagia|Casablanca School|Bengal School|literati|Kraak|famille[- ]verte|Chavín style|Wari style|Jun ware|Jōmon)\b', 3.0),
 ],
 3: [
  (r'(?i)\b(routes?|network|trade|traded|trading|merchants?|caravans?|galleons?|monsoon|Silk Roads?|Indian Ocean|Atlantic|Pacific|Mediterranean|Sahara|Saharan|diaspora|ports?|imported|exported|export\b|carried|shipped|corridor|sea chart|Geniza|ships?\b|moored|quay)\b', 2.0),
  (r'(?i)\b(empire|kingdom|sultanate|republic|state\b|polity|polities|dynasty|dynasties|city-state|civili[sz]ation|culture|cultures|site|sites|excavat\w+|settlement|mounds?|capital|province|region|coast|valley|oasis|steppe|frontier|colony|colonies|conquest of|hinterland)\b', 1.5),
  (r'\bCountry\b', 1.5),
  (r'\b(Egypt|Nubia|Kush|Mero[eë]|Nok|Benin|Igbo-Ukwu|Ife|Asante|Kuba|Kongo|Zimbabwe|Mali|Congo|Kilwa|Swahili|Mesopotamia|Sumer|Uruk|Ur\b|Umma|Girsu|Akkad|Elam|Persia|Persepolis|Achaemenid|Magan|Dilmun|Meluhha|Nineveh|Byzant\w*|Constantinople|Athens|Rome|Roman|Greek|Venice|Paris|London|Amsterdam|Nuremberg|Mainz|Lyon|Nijmegen|Florence|Cairo|Fustat|Baghdad|Damascus|Samarkand|Tashkent|Bukhara|Herat|Bursa|Istanbul|Iznik|Kashan|Jingdezhen|Arita|Delft|Meissen|Puebla|Oman|UAE|Gulf|Jerusalem|Karakorum|Chandigarh|Bras[ií]lia|Accra|Kumasi|Peru|Chile|Bolivia|Mexico|Andes|Andean|Paracas|Wari|Tiwanaku|Inka|Inca|Maya|Aztec|Mexica|Caral|Upano|Maraj[oó]|China|Chinese|Japan|Japanese|Korea|Korean|India|Indian|Bengal|Gujarat|Coromandel|Java|Javanese|Indonesia|Tonga|Hawai\w*|M[āa]ori|Australia|Kazakhstan|Botai|Sintashta|Yamnaya|Pazyryk|Ordos|Yanghai|Sogdia\w*|Khotan|Mongol\w*|Tang|Song|Yuan|Ming|Qing|Han\b|Shang|Zhou|Goryeo|Joseon|Edo|Meiji|Mughal|Ottoman|Mamluk|Fatimid|Abbasid|Umayyad|Safavid|Qajar|Rasulid|Harappa\w*|Indus|Mehrgarh|Lapita|Budj Bim|Madjedbebe|Carpenter\'?s Gap|Douroula|Haya|Din[eé]|Navajo|Zuni|S[áa]mi|Kyrgyz|Qazaq|Kazakh|Turkmen|Uzbek)\b', 0.5),
 ],
 4: [
  (r'(?i)\b(Act\b|Acts\b|battle|siege|\bwar\b|wars\b|invasions?|invaded|revolt|rebellion|strike\b|expedition|conquest|conquered|annex\w*|occupation|occupied|returned|return of|returned to|returns to|restitution|repatriat\w*|transferred|decree|ruling|ruled that|lawsuit|sued|judgment|court|treaty|exhibition|exposition|World\'s Fair|earthquake|famine|revolution|independence|looted|looting|1897|founded|opened in|established|abolished|banned|ban\b|statute|legislation|law\b|laws\b|ordinance|resolution|edict|raid|campaign\w*|massacre|removal|Long Walk|deportation|resettled|prisoners?|taken by force|forced|captured|captive|exiled|handed (to|over)|police|missing|stolen|theft|broke down|ended)\b', 2.0),
  (r'(?i)\b(inscribed|proclaimed)\b', 1.0),
  (r'(?i)\b(earliest known|earliest|first known|first\b|dated to|dates? to|dates back|radiocarbon|years ago|years old|cal BP|\bBP\b|calendar|era\b|eras\b|epoch|reign mark|\bAH\b|Hijri|k\'atun|Long Count|Year of the|sexagenary|period\b|periods\b|phase|horizon|chronolog\w*|predates?|simultaneous\w*|same time|meanwhile|millennium|century|centuries|BCE|\bCE\b|\d{4}s?\b)\b', 0.6),
 ],
 5: [
  (r'(?i)\b(argue[sd]?|argument|reading|readings|interpret\w*|framing|our rule|the device|category|label\w*|credit\w*|attribut\w*|named|names?\b|signed|signature|unnamed|anonymous|guild|waqf|endowment|protocol|consent|CARE\b|Label|oral history|elders|community|communities|people|peoples|women|men\b|enslaved|workers|weavers|potters|casters|smiths|artisans|craftsmen|apprentice\w*|masters?\b|journeym\w+|theory|concept|definition|defines?|cha[iî]ne op[ée]ratoire|operational sequence|essay|wrote|writes|written|translat\w+|source|sources|eyewitness|historians?|scholars?|archaeologists?|anthropolog\w+|reconstruct\w*|experiment\w*|method|licen[cs]e|CC0|public domain|open access|record|records|provenance|chain|sold|dealer|bought|gift|collector|museum|holder|catalogu\w+|designer|designed|architect|painter|author\w*|founder|patron\w*|commission\w*|contract|brief|platform|rules?\b|code|training|taught|teacher|institute|academy|university|company|firm|society|guidelines?|treatise|manual|letter|account|deed|census|inscription|colophon|says|said|calls|reports?|quot\w+|critic\w*|defen\w+|disput\w+|contested|both readings)\b', 1.0),
  (r'\b[A-Z][a-z]+(?: (?:and|&) [A-Z][a-z]+)?(?: et al\.?)? \(?\d{4}\)?', 1.0),   # scholar (year) citations
  (r'(?i)\b(Intangible|ICH\b|Safeguarding|inheritors?|transmitted|bearers|practitioners|cooperative|Society\b|Project\b|initiative|credited to|credit line|came to light|headed|co-designer|designed by)\b', 2.0),
  (r'(?i)\b(Indus signs|encode|decipher|language)\b', 1.5),
 ],
}
COMPILED = {s: [(re.compile(p), w) for p, w in pats] for s, pats in RULES.items()}

def classify_claim(text, confidence):
    scores = {s: 0.0 for s in STRANDS}
    for s, pats in COMPILED.items():
        for rx, w in pats:
            if rx.search(text):
                scores[s] += w
    if re.search(r'(?i)interpretive', confidence or '') and not re.search(r'(?i)documented', confidence or ''):
        return {5: 1.0}, scores, 'interpretive flag'
    ranked = sorted(scores.items(), key=lambda kv: -kv[1])
    (s1, v1), (s2, v2) = ranked[0], ranked[1]
    if v1 == 0:
        return {5: 1.0}, scores, 'no match -> default 5'
    if v2 == v1 or (v2 >= 0.8 * v1 and v2 >= 2):
        return {s1: 0.5, s2: 0.5}, scores, 'split'
    return {s1: 1.0}, scores, 'max'

def claims_table(specs):
    rows = []
    per_unit = collections.defaultdict(lambda: collections.Counter())
    for u, s in specs.items():
        for c in s['claims']:
            alloc, scores, how = classify_claim(c['claim'], c['confidence'])
            for st, w in alloc.items():
                rows.append({'unit': u, 'n': c['n'], 'strand': st, 'strand_name': STRANDS[st], 'weight': w, 'how': how,
                             'scores': ' '.join(f"{k}:{v:.1f}" for k, v in scores.items()),
                             'confidence': c['confidence'][:60], 'claim': c['claim'][:300]})
                per_unit[u][st] += w
    with open(os.path.join(OUT, 'claims.csv'), 'w', newline='', encoding='utf-8') as fh:
        w = csv.DictWriter(fh, fieldnames=['unit', 'n', 'strand', 'strand_name', 'weight', 'how', 'scores', 'confidence', 'claim'])
        w.writeheader(); w.writerows(rows)
    return per_unit, rows

def claim_sample(specs, seed, k=40):
    allc = [(u, c) for u, s in specs.items() for c in s['claims']]
    rnd = random.Random(seed)
    return rnd.sample(allc, k)

# ---------------------------------------------------------------- 3. canon
KIND_TO_STRAND = {
 'object-type': 1, 'material': 1, 'technique': 1, 'first-known': 1,
 'style': 2, 'movement': 2, 'school': 2,
 'place': 3, 'polity': 3, 'civilisation-as-commonly-named': 3, 'archaeological-culture': 3, 'horizon': 3,
 'dynasty': 3, 'network': 3, 'interaction-sphere': 3, 'diaspora': 3,
 'event': 4, 'period': 4, 'calendar-or-era': 4,
 'person': 5, 'community': 5, 'institution': 5, 'maker-community': 5, 'living-practice': 5, 'belief-tradition': 5,
}

def load_canon():
    rows = {}
    for f in sorted(glob.glob(os.path.join(CANON, '*.csv'))):
        with open(f, newline='', encoding='utf-8') as fh:
            for r in csv.DictReader(fh):
                r['_file'] = os.path.basename(f)
                rows[r['id']] = r
    return rows

def canon_counts(canon, tier=None):
    by_kind = collections.Counter(); by_strand = collections.Counter()
    for r in canon.values():
        if tier and r['tier'] != tier:
            continue
        by_kind[r['kind']] += 1
        by_strand[KIND_TO_STRAND[r['kind']]] += 1
    return by_kind, by_strand

# ---------------------------------------------------------------- 5. world chapters
# Expert checklist of what a dense world history of making would reach, per chapter. Each item: (label, regex).
# Status is computed: TAUGHT = matched in a spec table teaching row (opening, lab, concept, cases, walk) or a
# grouping-page walk; MENTIONED = matched elsewhere in a spec (responsibility block, "the Atlas carries instead",
# nodes, protocol, claims...) ; CANON = only in a canon row (name, other_names, notes); ABSENT = nowhere.
EXPECTED = {
 'F1.6': [
  ('Nok terracotta sculpture', r'\bNok\b'), ('Ife heads and Yoruba court art', r'\bIfe\b|Yoruba'),
  ('Aksum (architecture, coinage)', r'Aksum|Axum'), ('Lalibela / Ethiopian Christian making', r'Lalibela|Ethiopian (Christian|manuscript|icon|church)'),
  ('Swahili coral-stone towns (Kilwa, Gedi)', r'Kilwa|Swahili (coast|town|builder|stone|coral)|Gedi\b|Shanga'), ('Mali empire, Timbuktu manuscripts, Sahelian earth architecture', r'Timbuktu|Djenn[eé]|Mali Empire|Mansa Musa|Sahelian'),
  ('Great Zimbabwe masonry', r'Great Zimbabwe'), ('Kuba kingdom textiles and design', r'\bKuba\b'),
  ('Kongo (crucifixes, minkisi)', r'\bKongo\b'), ('Luba / Chokwe / Fang figurative sculpture', r'\bLuba\b|Chokwe|\bFang\b'),
  ('Asante kente and gold weights', r'kente|Asante|Akan\b'), ('Dogon / Bamana (bogolan) making', r'Dogon|Bamana|bogolan'),
  ('Ndebele / Zulu beadwork and house painting', r'Ndebele|\bZulu\b'), ('Tuareg / Amazigh silver and leather', r'Tuareg|Amazigh|Berber'),
  ('Egyptian New Kingdom workshops (Deir el-Medina)', r'Deir el-Medina|Set Maat|Strike Papyrus'), ('Coptic and Fatimid Egypt', r'Coptic|Fatimid'),
  ('20th-c. African modernisms (Zaria, Makerere, Casablanca School)', r'Zaria|Makerere|Casablanca School|Natural Synthesis'),
  ('Kumasi / KNUST and tropical modernism in Ghana', r'Kumasi|KNUST|tropical modern'), ('Contemporary African design and fashion', r'(Lagos|Dakar|Nairobi|Accra|Johannesburg).{0,40}(design|fashion)|African (fashion|design)'),
 ],
 'F1.7': [
  ('Olmec sculpture', r'Olmec'), ('Teotihuacan workshops', r'Teotihuac'), ('Classic Maya (ceramics, stucco, codices)', r'\bMaya\b'),
  ('Aztec / Mexica (featherwork, codices)', r'Aztec|Mexica\b|Huexotzinco|Florentine Codex'), ('Chavín (Early Horizon)', r'Chav[ií]n'), ('Moche ceramics and metallurgy', r'\bMoche\b'),
  ('Nasca', r'\bNasca\b|\bNazca\b'), ('Wari and Tiwanaku (Middle Horizon)', r'\bWari\b|Tiwanaku'), ('Inka (textiles, khipu, masonry)', r'\bInka\b|\bInca\b|khipu'),
  ('Mississippian (Cahokia) / Hopewell', r'Mississippian|Cahokia|Hopewell'), ('Ancestral Puebloan / Chaco / Mimbres', r'Puebloan|Chaco\b|Mimbres'),
  ('Pueblo pottery revival (Maria Martinez)', r'San Ildefonso|Maria Martinez|Marie and Santana'), ('Northwest Coast formline art', r'Northwest Coast|formline|Haida|Tlingit'),
  ('Inuit / Arctic making', r'Inuit|Arctic|Yup\'ik'), ('Diné weaving', r'Din[eé]\b|Navajo'),
  ('Colonial talavera / Cusco School / mission workshops', r'talavera|Puebla|Cusco|Guaran[ií]'), ('Mexican muralism and modern design', r'muralis|Rivera|Orozco|Siqueiros|Mexican modern'),
  ('Brazilian modernism / Brasília / Antropofagia', r'Bras[ií]lia|Antropofagia|Niemeyer|Lina Bo Bardi'), ('Shaker / US Arts and Crafts (Roycroft, Stickley)', r'Shaker|Roycroft|Stickley'),
  ('Mid-century US design (Eames, Loewy, streamlining)', r'Eames|Loewy|streamlin'), ('African American making (Edgefield, Gee\'s Bend)', r'Edgefield|Gee\'s Bend|"Dave"'),
  ('Caribbean / Haitian making', r'Haiti|Caribbean|Jamaica|\bCuba\b'), ('Amazonian making (Marajó, Upano)', r'Maraj[oó]|Upano'),
 ],
 'F1.8': [
  ('Jōmon pottery', r'J[oō]mon'), ('Shang bronze casting', r'\bShang\b'), ('Qin / Han (terracotta army, lacquer, silk)', r'\bQin\b|Han dynasty|Western Han|terracotta army'),
  ('Tang (sancai, court painting, Chang\'an)', r'\bTang\b'), ('Song workshops and kilns (Ru, Jun, Longquan)', r'Southern Song|Northern Song|Song dynasty|Longquan|Jun ware|Jun glaze'),
  ('Yuan / Ming Jingdezhen', r'Jingdezhen'), ('Qing imperial workshops (Zaobanchu)', r'Kangxi|Zaobanchu|Qing dynasty'), ('Literati painting and calligraphy', r'literati'),
  ('Chinese woodblock printing and manuals (Diamond Sutra, Mustard Seed Garden)', r'Diamond Sutra|Mustard Seed'), ('Goryeo celadon / Joseon porcelain', r'Goryeo|Joseon'),
  ('Japanese lacquer (maki-e)', r'maki-e|Japanese lacquer|lacquer.{0,30}Japan|Japan.{0,30}lacquer'), ('Chanoyu / Raku / tea ceramics', r'chanoyu|\bRaku\b|tea ceremony|tea bowl'), ('Kano school', r'\bKano\b'),
  ('Edo print culture (ukiyo-e, Hokusai)', r'ukiyo-e|Hokusai|Kiyonaga|Edo print|[OŌ]tsu print'), ('Meiji industrialisation and the world fairs', r'Meiji|Tomioka|Vienna 1873|Vienna Exposition'),
  ('Mingei', r'Mingei'), ('Japanese postwar design (Sony, Noguchi, Metabolism, Muji)', r'Sony|Noguchi|Metabolis|Muji|Kenmochi|Yanagi Sori|Japanese postwar'),
  ('Korean modern / industrial design', r'Samsung|Korean (industrial|modern) design|Hangul'), ('PRC socialist design / Cultural Revolution posters', r'Cultural Revolution|socialist design'),
  ('Ainu and Ryukyu making', r'Ainu|Ryukyu|Okinawa'), ('Tibetan making (thangka, metalwork)', r'Tibet|thangka'),
 ],
 'F1.9': [
  ('Indus / Harappan crafts', r'\bIndus\b|Harappa'), ('Mauryan / Ashokan pillars', r'Maurya|Ashoka'), ('Gandhara sculpture', r'Gandhara'),
  ('Gupta / Ajanta', r'\bGupta\b|Ajanta'), ('Chola bronzes', r'\bChola\b'), ('Mughal karkhana and painting', r'Mughal|karkhana|Akbar'), ('Rajput / Pahari painting', r'Rajput|Pahari'),
  ('Angkor / Khmer', r'Angkor|Khmer'), ('Borobudur', r'Borobudur'), ('Javanese making (batik, gamelan)', r'\bJava\b|Javanese'), ('Đông Sơn drums', r'Dong Son|Đông Sơn'),
  ('Thai / Burmese lacquer and Buddha casting', r'Burm|Myanmar|\bSiam|Thai (lacquer|bronze|Buddha)|Ayutthaya|Sukhothai'), ('Kalamkari / chintz', r'Kalamkari|chintz'), ('Bengal muslin / jamdani', r'jamdani|muslin'),
  ('Company school painting', r'Company school'), ('Colonial art schools (J.J., Mayo, Madras)', r'Mayo School|J\.?J\.? School|Madras School'),
  ('Swadeshi / khadi / Gandhi', r'Swadeshi|khadi|Gandhi'), ('Santiniketan / Bengal School', r'Santiniketan|Kala Bhavana|Bengal School'),
  ('NID Ahmedabad / Eames India Report', r'\bNID\b|India Report|Ahmedabad'), ('Chandigarh / Indian modernism', r'Chandigarh'),
  ('Philippine / Vietnamese making', r'Philippin|Vietnam'), ('Sri Lankan makers', r'Sri Lankan (maker|craft|potter|weav)|Sinhal|Kandy'), ('Contemporary South Asian craft GI / fashion', r'Kolhapuri|\bGI\b'),
 ],
 'F1.9a': [
  ('Göbekli Tepe / Çatalhöyük (Neolithic Anatolia)', r'G[oö]bekli|[CÇ]atalh[oö]y[uü]k'), ('Uruk / Sumer', r'\bUruk\b|Sumer'), ('Akkad / Ur III', r'Akkad|Ur III'),
  ('Old Assyrian trade (Kanesh)', r'Kanesh|Kaneš|K[uü]ltepe|Old Assyrian|Lamass[iī]'), ('Babylon (Hammurabi, Ishtar Gate)', r'Babylon|Hammurabi|Ishtar Gate'), ('Hittite', r'Hittite'),
  ('Assyrian palace reliefs (Nineveh, Nimrud)', r'palace relief|Nimrud|lamassu|Ashurbanipal|Assyrian relief'), ('Phoenician (purple, glass, alphabet)', r'Phoenician|Tyrian'),
  ('Achaemenid Persepolis', r'Persepolis|Achaemenid'), ('Elam / Proto-Elamite', r'\bElam'), ('Luristan bronzes', r'Luristan'),
  ('Dilmun / Magan / Umm an-Nar', r'Dilmun|Magan|Umm an-Nar'), ('Ancient South Arabia (Saba, incense)', r'\bSaba\b|Sabae|South Arabia|frankincense'),
  ('Nabataean Petra / Palmyra', r'\bPetra\b|Nabat|Palmyra'), ('Hellenistic / Seleucid / Parthian', r'Hellenistic|Seleucid|Parthian'), ('Sasanian silver and silk', r'Sasanian|Sassan'),
  ('Roman-era blown glass of the Levant', r'blown glass|Ennion'), ('Urartu', r'Urartu'), ('Falaj irrigation', r'falaj|aflaj'),
 ],
 'F1.10': [
  ('Umayyad Damascus / Dome of the Rock', r'Umayyad|Dome of the Rock'), ('Abbasid Baghdad / Samarra', r'Abbasid|Samarra'), ('Fatimid Cairo (lustre, rock crystal)', r'Fatimid|rock crystal'),
  ('Al-Andalus (Córdoba, Alhambra)', r'Andalus|C[oó]rdoba|Alhambra'), ('Seljuk / Kashan lustre and minai', r'Seljuk|minai|lustre'), ('Ilkhanid / Timurid (Tabriz, Samarkand, Herat)', r'Ilkhan|Timur'),
  ('Mamluk Cairo (glass, inlay, deeds)', r'Mamluk'), ('Ottoman Iznik / Sinan / Süleymaniye', r'Iznik|İznik|Sinan|S[uü]leymaniye'), ('Safavid Isfahan (carpets, tiles)', r'Safavid|Isfahan'),
  ('Persian manuscript painting (Shahnama, Herat)', r'Shahnama|Bihzad|Herat'), ('Islamic calligraphy', r'calligraph'), ('Girih / geometric ornament', r'girih|muqarnas'),
  ('Qajar', r'Qajar'), ('Maghrib / Fez (Qarawiyyin)', r'Maghrib|\bFez\b|Qarawiyyin'), ('Sahel / Timbuktu Islamic manuscripts', r'Timbuktu'),
  ('Modern Arab graphic design and typography', r'Arab(ic)? (graphic design|typograph|typeset)|Simplified Arabic|Al-Hayat'), ('Islamic revival / neo-Mamluk glass', r'Mamluk revival|neo-Mamluk|Brocard|revival glass|"Mamluk" glass'),
  ('Gulf pearling / Al Sadu / lenj', r'pearl|Al Sadu|lenj'), ('Mughal (as Islamic world)', r'Mughal'),
 ],
 'F1.11': [
  ('Minoan / Mycenaean', r'Minoan|Mycenae'), ('Greek pottery and bronze', r'Attic|amphora|lekythos|Lydos'), ('Etruscan', r'Etrusc'), ('Roman mass production (Arretine, concrete, glass)', r'Arretine|red-gloss|Roman (workshop|copies|marble|concrete|glass)|Perennius'),
  ('Byzantine silk and mosaic', r'Byzantine (silk|mosaic)|Hagia Sophia|Ravenna'), ('Byzantine guild regulation (Book of the Eparch)', r'Eparch'), ('Insular / Carolingian manuscripts', r'Insular|Carolingian|Book of Kells|Lindisfarne'), ('Romanesque', r'Romanesque'),
  ('Gothic cathedral workshops', r'Gothic (cathedral|workshop|mason|building)|Chartres|Villard'), ('Italian Renaissance workshops (bottega, Vasari)', r'Renaissance|bottega|Vasari|Ghirlandaio'), ('Venetian glass (Murano)', r'Murano|Venetian glass'),
  ('Dutch Golden Age (Delft, guilds)', r'Delft|Dutch Republic|Syndics'), ('Baroque / Rococo court and guild production', r'Baroque|Rococo'), ('Meissen / Sèvres porcelain', r'Meissen|S[eè]vres'),
  ('Industrial Revolution (Wedgwood, Arkwright, Lancashire mills)', r'Wedgwood|Industrial Revolution|Arkwright|Lancashire|factory system'), ('Great Exhibition 1851', r'\b1851\b|Great Exhibition|Crystal Palace'),
  ('Arts and Crafts', r'Arts and Crafts'), ('Art Nouveau / Jugendstil / Secession / Wiener Werkstätte', r'Art Nouveau|Jugendstil|Secession|Werkst[aä]tte'),
  ('Deutscher Werkbund', r'Werkbund'), ('Bauhaus', r'Bauhaus'), ('De Stijl / Constructivism / Vkhutemas', r'De Stijl|Constructiv|Vkhutemas'), ('Art Deco', r'Art Deco'),
  ('Scandinavian modern', r'Scandinavian|Aalto|Danish modern'), ('Ulm / postwar German design (Braun, Rams)', r'\bUlm\b|Braun\b|Dieter Rams'), ('Italian postwar design (Olivetti, Memphis)', r'Olivetti|Memphis|Sottsass|Italian design'),
  ('Postmodernism', r'[Pp]ostmodern'), ('Wartime design (dazzle, Utility, prefabs)', r'Utility furniture|prefab|dazzle'), ('Sámi duodji', r'S[áa]mi|duodji'),
 ],
 'F1.12': [
  ('Aboriginal rock art', r'rock art|Gwion|Wandjina'), ('Ground-edge axes (Madjedbebe, Carpenter\'s Gap)', r'ground-edge|Madjedbebe|Carpenter'), ('Budj Bim aquaculture', r'Budj Bim'),
  ('Possum-skin cloaks / Aboriginal fibre work', r'possum|Aboriginal (fibre|weav|basket)|dilly'), ('Papunya Tula and the desert painting movement', r'Papunya|desert painting|Western Desert'), ('Bark painting (Arnhem Land)', r'bark painting|Arnhem'),
  ('Aboriginal textile and design studios (Tiwi, Babbarra)', r'Tiwi|Babbarra|Ernabella'), ('Lapita', r'Lapita'), ('Māori whakairo / pounamu / moko', r'whakairo|pounamu|\bmoko\b|t[āa] moko'),
  ('Māori weaving (raranga, cloaks)', r'raranga|korowai|harakeke'), ('Ka Mate / Ngāti Toa', r'Ka Mate|Ng[āa]ti Toa'), ('Tapa / ngatu / kapa', r'ngatu|\btapa\b|\bkapa\b'),
  ('Marshall Islands stick charts', r'stick chart|Marshall'), ('Hōkūleʻa and the voyaging revival', r'H[ōo]k[ūu]le'), ('Kula ring', r'\bKula\b'),
  ('Sepik / malagan carving (PNG)', r'Sepik|malagan|Papua'), ('Rapa Nui moai', r'Rapa Nui|Easter Island|moai'), ('Fijian / Tongan / Samoan making', r'Fiji|Tonga|Samoa'),
  ('Hawaiian featherwork', r'Hawaiian feather|ʻahu ʻula|feather cloak'), ('Australian modern design (Featherston, Grant)', r'Featherston|Australian (modern|design)'), ('Aboriginal art copyright (Carpets case)', r'Carpets case|Bulun'),
 ],
 'F1.12a': [
  ('Botai', r'Botai'), ('Yamnaya / Afanasievo', r'Yamnaya|Afanasievo'), ('Sintashta chariots', r'Sintashta'), ('Andronovo', r'Andronovo'),
  ('Pazyryk', r'Pazyryk'), ('Scythian / Saka gold', r'Scythian|\bSaka\b'), ('Xiongnu', r'Xiongnu'), ('Ordos bronzes', r'Ordos'), ('Oxus / Bactria (BMAC, Tillya Tepe)', r'Oxus|Bactria|Tillya'),
  ('Kushan / Gandhara', r'Kushan'), ('Sogdian silks and merchants', r'Sogdia'), ('Turkic / Uyghur (Orkhon)', r'Turkic|Uyghur|Orkhon'), ('Mongol Empire (Karakorum, cloth of gold)', r'Mongol|Karakorum'),
  ('Timurid Samarkand', r'Timur|Samarkand'), ('Bukhara ikat', r'\bikat\b|Bukhara'), ('Turkmen carpets', r'Turkmen'), ('Kyrgyz felt (shyrdak)', r'shyrdak|Kyrgyz'), ('Kazakh making', r'Qazaq|Kazakh'),
  ('Tibetan making', r'Tibet'), ('Soviet Central Asian modernism (Tashkent)', r'Tashkent'), ('Russian avant-garde / Vkhutemas', r'Vkhutemas|Russian avant-garde'),
  ('Siberian peoples (Yakut, Evenki)', r'Yakut|Sakha|Evenk|Siberia'), ('Afghan war rugs / contemporary', r'war rug'),
 ],
 'F1.13': [
  ('Silk Roads', r'Silk Road|Chang.an.Tianshan|corridor'), ('Indian Ocean monsoon network', r'Indian Ocean'), ('Trans-Saharan', r'Saharan|Across the sand|Sahelian gold'), ('Manila galleon', r'galleon|Manila'), ('Atlantic', r'Atlantic'),
  ('Mediterranean (Uluburun, Phoenician)', r'Uluburun|Mediterranean'), ('Amber / Baltic / Hanseatic', r'\bamber\b|Hanse|Baltic'), ('Viking routes', r'Viking|Norse'),
  ('Steppe route', r'steppe route|Steppe Road'), ('Tea Horse Road', r'Tea Horse'), ('Incense route', r'incense route|frankincense'), ('Columbian exchange (cochineal, silver)', r'cochineal|Potos[ií]'),
  ('Cape route / Estado da India', r'Cape Route|Estado da|carreira'), ('Zheng He voyages', r'Zheng He'), ('Pacific voyaging (Lapita, Polynesia)', r'Lapita|Polynesia'),
  ('Modern container shipping / global supply chains', r'container|supply chain'), ('Jesuit / mission workshops', r'Jesuit|mission workshop|missionar'),
 ],
 'F1.5': [
  ('Writing (independent origins)', r'Cascajal|Abydos|U-j'), ('Pottery before farming', r'Xianrendong|Ounjougou|J[oō]mon'), ('Metal smelting (several origins)', r'Belovode|Jiskairumoko|Douroula'), ('Cities (several forms)', r'Caral|Djenn[eé]-Djeno|Upano'), ('Cotton and dye (four cottons)', r'Huaca Prieta|four cotton'),
  ('Printing (East Asia, then Mainz)', r'Hyakumant|Jikji|Bi Sheng|Gutenberg|Mainz'), ('Plant domestication / agriculture as a recurrence', r'domesticat\w* (of )?(plants|rice|maize|wheat|millet)|agricultur\w* (began|origin)|Neolithic Revolution|Fertile Crescent'),
  ('Animal domestication (horse at Botai)', r'Botai'), ('The wheel', r'spoked wheel|\bthe wheel\b|wheel\w* (was|were) invented'), ('Glass as a recurrence', r'glass (was|were) (first|invented|made)|earliest glass|origin of glass'),
  ('The loom / weaving as a recurrence', r'earliest (loom|weaving|textile)|loom\w* (was|were) invented'), ('Coinage / money', r'coinage|earliest coins|Lydian coin'), ('The alphabet', r'alphabet'),
  ('Fired brick / monumental building', r'fired brick|baked brick|monumental (architecture|building)'), ('Boats and navigation', r'earliest (boat|canoe)|logboat|Pesse'), ('Lacquer / resins / adhesives', r'earliest lacquer|birch tar|adhesive'),
 ],
}
TEACH_ROWS = ['Opening move', 'Lab or main interactive', 'Lab', 'Concept', 'Cases', 'Walk']

# Hand overrides after reading each regex hit: (chapter, item) -> (status, reason)
OVERRIDES = {
 ('F1.8', 'Literati painting and calligraphy'): ('MENTIONED', 'F1.8 Concept names literati painting as the reading not taken; Atlas carries STY136'),
 ('F1.8', 'Japanese lacquer (maki-e)'): ('MENTIONED', 'F1.16 names lacquer church furniture in a link-out strip only'),
 ('F1.8', 'Qin / Han (terracotta army, lacquer, silk)'): ('MENTIONED', 'Han appears only as a date label (Ordos horse in F1.12a; paper fragment in F1.27)'),
 ('F1.9', 'Swadeshi / khadi / Gandhi'): ('MENTIONED', 'one clause in F1.19 Concept ("khadi linked to F1.18")'),
 ('F1.9', 'Sri Lankan makers'): ('MENTIONED', 'Arts and Crafts page names Sinhalese makers as models; no Sri Lankan case'),
 ('F1.9a', 'Babylon (Hammurabi, Ishtar Gate)'): ('MENTIONED', 'one clause in F1.17 Concept (Hammurabi on builders)'),
 ('F1.11', 'Gothic cathedral workshops'): ('MENTIONED', 'Arts and Crafts page step 1 is Ruskin reading Venetian Gothic; STY013 carried by the Atlas'),
 ('F1.11', 'Art Nouveau / Jugendstil / Secession / Wiener Werkstätte'): ('MENTIONED', 'one line in the Arts and Crafts walk (step 8)'),
 ('F1.12', 'Sepik / malagan carving (PNG)'): ('MENTIONED', 'F1.15 quotes Loos\'s "Papuan" foil; no PNG case'),
 ('F1.12', 'Māori weaving (raranga, cloaks)'): ('TAUGHT', 'harakeke cultivar naming is a Concept example in F1.29, not a weaving case'),
 ('F1.13', 'Mediterranean (Uluburun, Phoenician)'): ('MENTIONED', 'F1.11 Concept frames "the Mediterranean came before Europe"; no network case'),
 ('F1.13', 'Jesuit / mission workshops'): ('TAUGHT', 'F1.16 case 2 and its mission strip; the F1.12 and F1.28 hits are incidental'),
 ('F1.6', 'Mali empire, Timbuktu manuscripts, Sahelian earth architecture'): ('TAUGHT', 'as the trans-Saharan gold route (F1.13 step 5) and Djenne-Djeno (F1.5); Mali\'s own making (Djenne mosque, Timbuktu manuscripts) has no case'),
}

def world_chapter_report(specs, canon):
    # canon name index
    canon_text = {cid: ' '.join([r['name'], r['other_names'], r['notes'], r['making_significance']]) for cid, r in canon.items()}
    spec_full = {u: open(os.path.join(SPECS, u + '.md'), encoding='utf-8').read() for u in specs}
    spec_teach = {u: ' '.join(s['spec_rows'].get(r, '') for r in TEACH_ROWS) + ' ' + s.get('section7', '') + ' ' + s.get('walk_table', '') for u, s in specs.items()}
    grouping_txt = ' '.join(l for p in glob.glob(os.path.join(GROUPING, '*.md')) for l in open(p, encoding='utf-8').read().splitlines() if re.match(r'^\| \d \|', l))
    out = {}
    for ch, items in EXPECTED.items():
        res = []
        for label, pat in items:
            rx = re.compile(pat)
            taught_in = [u for u, t in spec_teach.items() if rx.search(t)]
            in_grouping = bool(rx.search(grouping_txt))
            mentioned_in = [u for u, t in spec_full.items() if rx.search(t) and u not in taught_in]
            canon_hits = [cid for cid, t in canon_text.items() if rx.search(t)]
            if taught_in or in_grouping:
                status = 'TAUGHT'
            elif mentioned_in:
                status = 'MENTIONED'
            elif canon_hits:
                status = 'CANON'
            else:
                status = 'ABSENT'
            note = ''
            if (ch, label) in OVERRIDES:
                status, note = OVERRIDES[(ch, label)]
            res.append({'item': label, 'status': status, 'note': note, 'taught_in': taught_in, 'grouping_page': in_grouping,
                        'mentioned_in': mentioned_in[:6], 'canon_ids': canon_hits[:6], 'n_canon': len(canon_hits)})
        out[ch] = res
    return out

def taught_groupings(specs, canon):
    """For each world chapter: names of movement/style/school, civilisation/polity/culture/horizon/dynasty/network,
    and event/period rows cited in section 4 (Nodes) of the spec."""
    fam = {'mov': {'movement', 'style', 'school'},
           'civ': {'civilisation-as-commonly-named', 'polity', 'archaeological-culture', 'horizon', 'dynasty', 'network', 'diaspora', 'interaction-sphere'},
           'evt': {'event', 'period', 'calendar-or-era'}}
    out = {}
    for ch in WORLD_CHAPTERS:
        ids = specs[ch]['nodes_s4']
        d = {k: [] for k in fam}
        for cid in ids:
            r = canon.get(cid)
            if not r:
                continue
            for k, kinds in fam.items():
                if r['kind'] in kinds:
                    d[k].append(f"{r['name']} ({cid})")
        out[ch] = d
    return out

# ---------------------------------------------------------------- main
def pct(c, total):
    return f"{100.0 * c / total:.1f}%" if total else '-'

def share_row(name, counter):
    tot = sum(counter.values())
    return f"| {name} | " + ' | '.join(f"{counter.get(s, 0):.1f} ({pct(counter.get(s, 0), tot)})" for s in STRANDS) + f" | {tot:.0f} |"

def main():
    specs = {}
    for p in sorted(glob.glob(os.path.join(SPECS, 'F1.*.md')), key=lambda p: unit_key(unit_of(p))):
        specs[unit_of(p)] = parse_spec(p)
    canon = load_canon()
    L = []
    hdr = '| | ' + ' | '.join(f"{s}. {n}" for s, n in STRANDS.items()) + ' | total |'
    sep = '|---|' + '---|' * len(STRANDS) + '---|'

    # 1 cases
    cases_pu = cases_table()
    L.append('## T1. Cases and walk steps per unit (hand-classified; 0.5/0.5 splits)\n')
    L.append('| unit | cases | ' + ' | '.join(f"{s}" for s in STRANDS) + ' | 1 | 2 | 3 | 4 | 5 |')
    L.append('|---|---|' + '---|' * 10)
    cases_tot = collections.Counter()
    for u in specs:
        c = cases_pu[u]; tot = sum(c.values()); cases_tot.update(c)
        L.append(f"| {u} | {tot:.0f} | " + ' | '.join(f"{c.get(s,0):.1f}" for s in STRANDS) + ' | ' + ' | '.join(pct(c.get(s,0), tot) for s in STRANDS) + ' |')
    L.append(f"| **all** | {sum(cases_tot.values()):.0f} | " + ' | '.join(f"{cases_tot.get(s,0):.1f}" for s in STRANDS) + ' | ' + ' | '.join(pct(cases_tot.get(s,0), sum(cases_tot.values())) for s in STRANDS) + ' |')
    wc = collections.Counter(); oc = collections.Counter()
    for u in specs:
        (wc if u in WORLD_CHAPTERS else oc).update(cases_pu[u])
    L.append(f"| world chapters (F1.5-F1.13) | {sum(wc.values()):.0f} | " + ' | '.join(f"{wc.get(s,0):.1f}" for s in STRANDS) + ' | ' + ' | '.join(pct(wc.get(s,0), sum(wc.values())) for s in STRANDS) + ' |')
    L.append(f"| other units | {sum(oc.values()):.0f} | " + ' | '.join(f"{oc.get(s,0):.1f}" for s in STRANDS) + ' | ' + ' | '.join(pct(oc.get(s,0), sum(oc.values())) for s in STRANDS) + ' |')

    # 2 claims + objects
    claims_pu, claim_rows = claims_table(specs)
    L.append('\n## T2. Claims (keyword-classified) and open objects per unit\n')
    L.append('| unit | claims parsed | declared | objects (s5 rows) | ' + ' | '.join(f"{s}" for s in STRANDS) + ' |')
    L.append('|---|---|---|---|' + '---|' * 5)
    claims_tot = collections.Counter(); n_claims = 0; n_obj = 0
    for u, s in specs.items():
        c = claims_pu[u]; tot = sum(c.values()); claims_tot.update(c); n_claims += len(s['claims']); n_obj += len(s['objects'])
        decl = s['spec_rows'].get('Claims sheet', '')
        m = re.search(r'(\d+)\s+claims|[Cc]laims\s+1[–-](\d+)', decl)
        declared = (m.group(1) or m.group(2)) if m else '?'
        L.append(f"| {u} | {len(s['claims'])} | {declared} | {len(s['objects'])} | " + ' | '.join(f"{c.get(x,0):.1f}" for x in STRANDS) + ' |')
    L.append(f"| **all** | {n_claims} | | {n_obj} | " + ' | '.join(f"{claims_tot.get(x,0):.1f} ({pct(claims_tot.get(x,0), n_claims)})" for x in STRANDS) + ' |')
    how = collections.Counter(h for h in {(r['unit'], r['n']): r['how'] for r in claim_rows}.values())
    L.append(f"\nClassifier decisions: {dict(how)} (split counted once per claim).")

    # 3 canon
    by_kind, by_strand = canon_counts(canon)
    by_kind1, by_strand1 = canon_counts(canon, tier='R1')
    by_kind2, by_strand2 = canon_counts(canon, tier='R2')
    L.append('\n## T3. Canon rows by kind, grouped into strands\n')
    L.append('| strand | kinds | rows (all tiers) | share | R1 rows | R1 share | R2 rows | R2 share |')
    L.append('|---|---|---|---|---|---|---|---|')
    tot = sum(by_strand.values()); tot1 = sum(by_strand1.values()); tot2 = sum(by_strand2.values())
    for s in STRANDS:
        kinds = ', '.join(f"{k} {by_kind[k]}" for k, st in KIND_TO_STRAND.items() if st == s and by_kind[k])
        L.append(f"| {s}. {STRANDS[s]} | {kinds} | {by_strand[s]} | {pct(by_strand[s], tot)} | {by_strand1[s]} | {pct(by_strand1[s], tot1)} | {by_strand2[s]} | {pct(by_strand2[s], tot2)} |")
    L.append(f"| total | | {tot} | | {tot1} | | {tot2} | |")

    # 4 compare
    L.append('\n## T4. Shares compared\n')
    L.append(hdr); L.append(sep)
    L.append(share_row('canon, all rows', by_strand))
    L.append(share_row('canon, R1 only', by_strand1))
    L.append(share_row('cases and walk steps (hand)', cases_tot))
    L.append(share_row('cases, world chapters only', wc))
    L.append(share_row('cases, other units only', oc))
    L.append(share_row('claims (keyword)', claims_tot))
    L.append('\nDivergence (percentage points, cases minus canon):')
    ct = sum(cases_tot.values()); clt = sum(claims_tot.values())
    L.append('| strand | canon % | cases % | claims % | cases - canon | claims - canon |')
    L.append('|---|---|---|---|---|---|')
    for s in STRANDS:
        a = 100 * by_strand[s] / tot; b = 100 * cases_tot[s] / ct; c = 100 * claims_tot[s] / clt
        L.append(f"| {s}. {STRANDS[s]} | {a:.1f} | {b:.1f} | {c:.1f} | {b-a:+.1f} | {c-a:+.1f} |")

    # 5 world chapters
    tg = taught_groupings(specs, canon)
    L.append('\n## T5. World chapters: groupings cited in section 4 (Nodes), by name\n')
    for ch in WORLD_CHAPTERS:
        d = tg[ch]
        L.append(f"\n**{ch} {specs[ch]['title']}**\n")
        L.append(f"- Movements, styles, schools ({len(d['mov'])}): " + ('; '.join(d['mov']) or 'none'))
        L.append(f"- Civilisations, polities, cultures, horizons, dynasties, networks ({len(d['civ'])}): " + ('; '.join(d['civ']) or 'none'))
        L.append(f"- Events, periods, calendars ({len(d['evt'])}): " + ('; '.join(d['evt']) or 'none'))
    wr = world_chapter_report(specs, canon)
    L.append('\n## T6. Expert checklist per chapter: status of expected content\n')
    L.append('Status: TAUGHT = named in a spec table teaching row (opening, lab, concept, cases, walk) of any unit, or in a grouping-page walk; MENTIONED = named elsewhere in a spec (responsibility block, "Atlas carries instead", nodes, claims, protocol); CANON = only in a canon row; ABSENT = nowhere.\n')
    summary = {}
    for ch, res in wr.items():
        cnt = collections.Counter(r['status'] for r in res); summary[ch] = cnt
        L.append(f"\n**{ch}** ({cnt['TAUGHT']} taught, {cnt['MENTIONED']} mentioned, {cnt['CANON']} canon only, {cnt['ABSENT']} absent of {len(res)})\n")
        L.append('| expected | status | taught in | mentioned in | canon rows | hand note |')
        L.append('|---|---|---|---|---|---|')
        for r in res:
            L.append(f"| {r['item']} | {r['status']} | {', '.join(r['taught_in'])}{' + grouping page' if r['grouping_page'] else ''} | {', '.join(r['mentioned_in'])} | {r['n_canon']}{(' e.g. ' + ', '.join(r['canon_ids'][:3])) if r['canon_ids'] else ''} | {r['note']} |")
    open(os.path.join(OUT, 'tables.md'), 'w', encoding='utf-8').write('\n'.join(L))
    json.dump({'wr': wr, 'tg': tg}, open(os.path.join(OUT, 'world.json'), 'w'), indent=1, ensure_ascii=False)
    print('\n'.join(L[:60]))
    print('... tables written to tables.md')
    return specs

if __name__ == '__main__':
    main()

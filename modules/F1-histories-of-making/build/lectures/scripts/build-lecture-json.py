#!/usr/bin/env python3
"""Build src/lectures/f1-13.json: the narration comes from F1.13/NARRATION.md
(one source of truth), the places from the storyboard's coordinate table, and
the visual commands from this file. Re-run after editing any of them.

    python3 scripts/build-lecture-json.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NARR = ROOT / 'F1.13' / 'NARRATION.md'
OUT = ROOT / 'src' / 'lectures' / 'f1-13.json'


def narration_by_station():
    src = NARR.read_text(encoding='utf8')
    body = src.split('## Title', 1)[1].split('## What we simplified')[0]
    out = {}
    for sec in re.split(r'\n## ', '## ' + body)[1:]:
        head, _, text = sec.partition('\n')
        head = head.strip()
        text = re.sub(r'\*\[.*?\]\*', '', text)  # stage notes
        text = re.sub(r'\n{2,}', '\n\n', text).strip()
        key = 'title' if head.startswith('Title') else re.match(r'Station (\d+)', head).group(1)
        out[key] = text
    return out


# ---------------------------------------------------------------------------
# Places. Coordinates from the cities.json npm package (GeoNames, CC BY 4.0,
# v1.1.65). Wikidata was not reachable. Nothing is invented: places the
# gazetteer lacks are anchored by region and say so in `source`.
# ---------------------------------------------------------------------------
G = 'GeoNames via cities.json 1.1.65 (CC BY 4.0)'
PLACES = [
    dict(id='jingdezhen', name='Jingdezhen', lat=29.2947, lon=117.20789, source=G),
    dict(id='kashan', name='Kashan', lat=33.98237, lon=51.42769, source=G),
    dict(id='qamsar', name='Qamsar', lat=33.75, lon=51.43, source='placed by region: not in the gazetteer; drawn 0.23° south of Kashan\'s GeoNames point, as "near Kashan" (claim 4)'),
    dict(id='anarak', name='Anarak', lat=33.31077, lon=53.69947, source=G + ' ("Anārak")'),
    dict(id='kilwa', name='Kilwa Kisiwani', lat=-8.9251, lon=39.5131, source=G + ': Kilwa Masoko, the mainland town facing the island'),
    dict(id='periplus_coast', name='the Periplus\'s coasts', lat=-8.9251, lon=39.5131, source='placed by region: the East African coast, anchored at Kilwa Masoko (GeoNames); the text names ports the lecture does not'),
    dict(id='belitung', name='off Belitung', lat=-2.73353, lon=107.63477, source=G + ': Tanjung Pandan on Belitung; the wreck lies offshore'),
    dict(id='changan', name="Chang'an (Xi'an)", lat=34.25833, lon=108.92861, source=G + ' ("Xi’an")'),
    dict(id='tianshan', name='Tianshan corridor, western end', lat=43.25249, lon=76.9115, source='placed by region: the listing\'s western sites are in the Zhetysu region; anchored at Almaty (GeoNames)'),
    dict(id='samarkand_region', name='Central Asia', lat=42.87, lon=74.59, source='placed by region: anchored at Bishkek (GeoNames); the claims name no city'),
    dict(id='baghdad', name='Baghdad', lat=33.34058, lon=44.40088, source=G),
    dict(id='talas', name='Talas', lat=42.89799, lon=71.37334, source=G + ': Taraz; the battle site is placed by region'),
    dict(id='cairo', name='Cairo', lat=30.06263, lon=31.24967, source=G),
    dict(id='sahel', name='Mali, the Sahel', lat=16.77348, lon=-3.00742, source='placed by region: anchored at Timbuktu (GeoNames); the claims name no goldfield'),
    dict(id='majorca', name='Majorca', lat=39.56939, lon=2.65024, source=G + ' (Palma)'),
    dict(id='manila', name='Manila', lat=14.6042, lon=120.9822, source=G),
    dict(id='acapulco', name='Acapulco', lat=16.84942, lon=-99.90891, source=G + ' ("Acapulco de Juárez")'),
    dict(id='potosi', name='Potosí', lat=-19.58361, lon=-65.75306, source=G + '; stands for "New Spain and Peru" silver (claim 15), the mine the canon names (PLC163)'),
    dict(id='puebla', name='Puebla', lat=19.04778, lon=-98.20723, source=G),
    dict(id='amsterdam', name='Amsterdam', lat=52.37403, lon=4.88969, source=G),
    dict(id='china', name='China', lat=29.2947, lon=117.20789, source='placed by region: the record says China; anchored at Jingdezhen (GeoNames)'),
    dict(id='arita', name='Arita', lat=33.18333, lon=129.9, source=G),
    dict(id='korea', name='Joseon (Korea)', lat=35.10168, lon=129.03004, source='placed by region: anchored at Busan (GeoNames); the claims name no town of origin'),
    dict(id='arabia', name='Arabia', lat=26.25722, lon=50.61194, source='placed by region: anchored at Muharraq (GeoNames)'),
    dict(id='iran_coast', name='Iran', lat=27.095, lon=56.4529, source='placed by region: anchored at Hormoz (GeoNames)'),
    dict(id='china_coast', name='China', lat=23.11667, lon=113.25, source='placed by region: anchored at Guangzhou (GeoNames)'),
    dict(id='futa_toro', name='Futa Toro', lat=16.64892, lon=-14.96073, source='placed by region: anchored at Podor (GeoNames), a town of the middle Senegal valley'),
    dict(id='charleston', name='South Carolina', lat=32.77632, lon=-79.93275, source=G + ' (Charleston); the claim says "brought to South Carolina"'),
    dict(id='fayetteville', name='North Carolina', lat=35.05266, lon=-78.87836, source=G + ' (Fayetteville, the jail of claim 22)'),
    dict(id='liverpool', name='Liverpool', lat=53.41058, lon=-2.97794, source=G),
    dict(id='manchester', name='Manchester', lat=53.48095, lon=-2.23743, source=G),
    dict(id='guran', name='Guran, Qeshm', lat=26.9492, lon=56.2691, source='placed by region: on Qeshm island at Qeshm town (GeoNames); the village is not in the gazetteer'),
    dict(id='muharraq', name='Muharraq, Bahrain', lat=26.25722, lon=50.61194, source=G + ' ("Al Muharraq")'),
]

MAP_Y = -90  # the map node's y in the frame (see Station.tsx)


def C(at, do, **kw):
    d = {'at': at, 'do': do}
    d.update(kw)
    return d


def note(at, text, seconds):
    return C(at, 'note', text=text, seconds=seconds)


def cap(at, text, claim=None, confidence=None):
    d = C(at, 'caption', text=text)
    if claim:
        d['claim'] = claim
    if confidence:
        d['confidence'] = confidence
    return d


narr = narration_by_station()

JAR = dict(title='Jar with blue underglaze decoration', holder='Cleveland Museum of Art', accession='1962.154', date='Jingdezhen, Yuan, 1300s', licence='CC0', maker='Potters and painters at Jingdezhen; the record does not give their names. Sold by J.T. Tai and Co., New York, 1962.')
BOWL = dict(title='Footed bowl with a blue rim', holder='Cleveland Museum of Art', accession='1915.581', date='Iran, probably Kashan, late 1100s–early 1200s', licence='CC0', maker='Fritware, pierced, painted under the glaze. Potters at Kashan as the record places it; names not recorded. Sold by Kelekian, 1915.')
BASIN = dict(title='Basin', holder='The Metropolitan Museum of Art', accession='12.3.1', date='Puebla, ca. 1650', licence='Public domain', maker='Tin-glazed earthenware. "Master Potter A", a scholars\' name; the hand is not named in the record. Made under Spanish rule; gift of Mrs. Robert W. de Forest, 1912.')
DISH = dict(title='Dish with two birds in a water landscape', holder='Rijksmuseum', accession='AK-RBK-16385', date='China, c. 1600–1625', licence='CC0 1.0', maker='Porcelain in underglaze blue, Kraak porcelain; the potter is not named. Acquisition not shown in the record.')
SAID = dict(title='Omar ibn Said, autobiography in Arabic', holder='Library of Congress', accession='2018371864', date='1831', licence='Public domain · "free to use and reuse"', maker='Omar ibn Said wrote this account of his life in Arabic in 1831, while enslaved in North Carolina. He was born in Futa Toro and captured in 1807.', note='Shown as AR-081 sets it: his name and his Arabic text lead. The English title page is not shown in the walk. A leaf with Qur\'anic text is shown whole, never cropped.')

stations = []

# ---- Station 1 ---------------------------------------------------------------
stations.append(dict(
    id='s1', n=1, title='Where did the blue come from?',
    idea="A network is four flows at once, and this jar's blue came from Iran.",
    seconds=60, narration=narr['1'], claims=['1', '2', '3'], objects=['Cleveland 1962.154'],
    commands=[
        C(0, 'chapter', n=1, title='Where did the blue come from?'),
        C(0, 'map.focus', lon=88, lat=30, zoom=2.2, seconds=1.2),
        C(0, 'map.stamp', text='1300s'),
        C(0, 'timeline.scrub', year=1350),
        C(0, 'legend', keys=['object', 'material']),
        C(0.3, 'object', **JAR),
        cap(0.5, 'A jar, painted in blue under its glaze.', '2', 'documented'),
        C(3, 'map.place', id='jingdezhen', kind='object'),
        cap(3, 'Potters at Jingdezhen made it in the 1300s; Cleveland holds it as 1962.154.', '2', 'documented'),
        C(3, 'timeline.span', id='jar', **{'from': 1300, 'to': 1400}, label='the jar, 1300s', lane=0, kind='object'),
        cap(8, "The record does not give the potters' names.", '2', 'documented'),
        cap(11, 'A network is four flows at once: objects, materials, skills and people. They share routes, but not terms.', '1', 'interpretive'),
        C(11, 'legend', keys=['object', 'material', 'skill', 'people']),
        C(13, 'map.route', id='r01', **{'from': 'kashan', 'to': 'jingdezhen'}, flow='material', seconds=2.2),
        C(19, 'predict', question='Where did the blue come from?', options=[
            dict(label="Jingdezhen's own hills", place='jingdezhen'),
            dict(label='Iran', place='kashan'),
            dict(label='Europe', place='amsterdam'),
        ], answer=1, pause=4, reveal=dict(text='Cleveland\'s record says the cobalt was imported from Iran, likely from Kashan.', claim='2', confidence='documented')),
        C(30, 'map.place', id='kashan', kind='object', label='Kashan'),
        C(30.2, 'map.light', id='kashan'),
        C(30, 'map.stamp', text='1300s · cobalt from Iran'),
        cap(35, 'Jiang and colleagues tested imperial wares of the Xuande reign, 1426 to 1435: early blue-and-white relied heavily on imported cobalt from the West.', '3', 'documented'),
        C(35, 'timeline.span', id='xuande', **{'from': 1426, 'to': 1435}, label='Xuande wares tested, 1426–1435', lane=1, kind='material'),
        cap(45, 'We write "from Iran". The potters and the clay were at Jingdezhen; the blue came from Iran.', '2, 3', 'documented'),
        cap(53, 'Look for the dashed line: it marks a material, not an object.'),
        C(58.5, 'caption.clear'),
    ]))

# ---- Station 2 ---------------------------------------------------------------
stations.append(dict(
    id='s2', n=2, title='Blue before China',
    idea="Blue under a glaze was in Kashan's workshops a century before the jar; which mine is argued.",
    seconds=56, narration=narr['2'], claims=['4', '5'], objects=['Cleveland 1915.581'],
    commands=[
        C(0, 'chapter', n=2, title='Blue before China'),
        C(0, 'map.focus', lon=52.5, lat=33.4, zoom=5.5, seconds=1.6),
        C(0, 'map.stamp', text='late 1100s–1301'),
        C(0, 'timeline.scrub', year=1200),
        C(0, 'legend', keys=['material', 'argued']),
        C(0.3, 'object', **BOWL),
        cap(0.5, 'A footed bowl from Iran, with a blue rim.', '5', 'documented'),
        cap(3, 'Cleveland dates it late 1100s to early 1200s and places it probably at Kashan.', '5', 'documented'),
        C(3, 'timeline.span', id='bowl', **{'from': 1175, 'to': 1225}, label='Kashan bowl, late 1100s–early 1200s', fuzzyStart=True, fuzzyEnd=True, lane=0, kind='object'),
        cap(9, 'Fritware, pierced, painted under the glaze. Kelekian sold it to the museum in 1915.', '5', 'documented'),
        cap(15, "So blue under a glaze was in Kashan's workshops a century before the jar.", '5, 2', 'documented'),
        cap(20, 'Which mine gave the cobalt is argued.', '4', 'contested'),
        C(23, 'map.place', id='qamsar', kind='argued', label='Qamsar · argued', side='below'),
        cap(23, "One reading: Qamsar, near Kashan, the most cited source. Abu'l-Qasim's treatise of 1301 places lâjvard, the blue, there.", '4', 'contested'),
        C(23, 'timeline.mark', id='treatise', year=1301, label="Abu'l-Qasim's treatise, 1301", lane=1),
        C(31, 'map.place', id='anarak', kind='argued', label='Anarak · argued'),
        cap(31, 'The other reading: deposits near Anarak, 200 kilometres east of Kashan. Jiang and colleagues propose it in their discussion, not their abstract.', '4', 'contested'),
        cap(44, 'We do not choose between them.', '4', 'contested'),
        cap(47, 'Look for the two fuzzy marks: an argued claim gets two readings, not one dot.'),
        C(54, 'caption.clear'),
    ]))

# ---- Station 3 ---------------------------------------------------------------
stations.append(dict(
    id='s3', n=3, title='By sea',
    idea='Monsoon routes carried crockery, earthenware and porcelain to Kilwa, and a text of the mid-1st century lists enslaved people among exports.',
    seconds=74, narration=narr['3'], claims=['6', '7', '8'], held='Swahili-coast reader (spec §9)',
    commands=[
        C(0, 'chapter', n=3, title='By sea'),
        C(0, 'map.clear'), C(0, 'object.clear'),
        note(0, 'Content note: this station names enslaved people listed in a text of the mid-1st century. You can skip to station four; the summary keeps the dates.', 5),
        C(0, 'map.focus', lon=72, lat=8, zoom=2.0, seconds=1.6),
        C(0, 'map.stamp', text='1st century CE · 11th–16th centuries'),
        C(0, 'timeline.scrub', year=1300),
        C(0, 'legend', keys=['object', 'people', 'region']),
        C(6, 'map.place', id='kilwa', kind='object', label='Kilwa Kisiwani', side='left'),
        cap(6, "Kilwa's merchants, on the Swahili coast, dealt from the 13th to the 16th centuries in gold, silver, pearls and perfumes, UNESCO's listing says.", '6', 'documented'),
        C(6, 'timeline.span', id='kilwa_merchants', **{'from': 1200, 'to': 1600}, label="Kilwa's merchants, 13th–16th c.", lane=0, kind='object'),
        C(12.5, 'map.place', id='arabia', kind='region', label='Arabia', side='above'),
        C(12.5, 'map.place', id='iran_coast', kind='region', label='Iran', side='above'),
        C(12.5, 'map.place', id='china_coast', kind='region', label='China', side='above'),
        cap(13, 'They dealt also in Arabian crockery, Persian earthenware and Chinese porcelain.', '6', 'documented'),
        C(13, 'map.route', id='r04', **{'from': 'arabia', 'to': 'kilwa'}, flow='object', label='crockery', bend=0.22),
        C(14, 'map.route', id='r05', **{'from': 'iran_coast', 'to': 'kilwa'}, flow='object', label='earthenware', bend=0.1),
        C(15, 'map.route', id='r06', **{'from': 'china_coast', 'to': 'kilwa'}, flow='object', label='porcelain', bend=0.25),
        cap(19, 'Kilwa minted coins in the 11th to 14th centuries.', '6', 'documented'),
        C(19, 'timeline.span', id='kilwa_coins', **{'from': 1000, 'to': 1400}, label='Kilwa coins, 11th–14th c.', lane=1, kind='material'),
        cap(23, "Its Great Mosque has domes and vaults, some set with Chinese porcelain. The listing does not name Kilwa's builders.", '6', 'documented'),
        C(31, 'map.place', id='belitung', kind='wreck', label='off Belitung · wreck, linked', side='below'),
        C(31, 'map.route', id='r07', **{'from': 'china_coast', 'to': 'belitung'}, flow='object', bend=0.15),
        cap(31, 'Far to the east, a ship sank off Belitung in the 9th century: about the 830s by one account, late 800s by another.', '7', 'documented'),
        C(31, 'timeline.span', id='belitung_wreck', **{'from': 826, 'to': 900}, label='Belitung wreck, 830s or late 800s', fuzzyStart=True, fuzzyEnd=True, lane=2, kind='object'),
        cap(40, 'It held 60,000 ceramics, and it was salvaged commercially from 1998. We link to that record and show no image of it.', '7', 'documented'),
        C(49, 'map.peopleMark', id='periplus_coast', label='enslaved people listed among exports · mid-1st c. CE · count not recorded', side='below'),
        cap(49, 'The Periplus, a text of the mid-1st century CE, lists enslaved people among exports.', '8', 'documented'),
        C(49, 'timeline.mark', id='periplus', year=50, label='the Periplus, mid-1st c. CE', lane=0),
        cap(56, "We write them as people, in words; the translation's own terms stay in the Deep tier.", '8', 'documented'),
        cap(62, 'Look for the people mark: it never shares an arrow with crockery.'),
        C(71, 'caption.clear'),
    ]))

# ---- Station 4 ---------------------------------------------------------------
stations.append(dict(
    id='s4', n=4, title='By land',
    idea='A skill travels as a dated line; people moved by order are a mark of their own.',
    seconds=80, narration=narr['4'], claims=['9', '10', '11'], held='Central Asian reader (spec §9)',
    commands=[
        C(0, 'chapter', n=4, title='By land'),
        C(0, 'map.clear'),
        note(0, 'Content note: this station names people moved by order. You can skip to station five; the summary keeps the dates.', 4),
        C(0, 'map.focus', lon=78, lat=38, zoom=2.4, seconds=1.6),
        C(0, 'map.stamp', text='2nd c. BCE–16th c.'),
        C(0, 'timeline.scrub', year=800),
        C(0, 'legend', keys=['route', 'skill', 'people', 'argued', 'region']),
        C(5, 'map.place', id='changan', kind='object', label="Chang'an", side='below'),
        C(5, 'map.place', id='tianshan', kind='region', label='Tianshan corridor, western end', side='above'),
        C(5.5, 'map.route', id='r09', **{'from': 'changan', 'to': 'tianshan'}, flow='route', label='the corridor · 5,000 km · 33 sites', bend=0.08, seconds=2),
        cap(5, "A corridor from Chang'an into the Tianshan: UNESCO lists it as a 5,000-kilometre section with 33 sites.", '9', 'documented'),
        cap(12, 'It formed between the 2nd century BCE and the 1st century CE, and was used until the 16th century.', '9', 'documented'),
        C(12, 'timeline.span', id='corridor', **{'from': -200, 'to': 1600}, label='the corridor: formed 2nd c. BCE–1st c. CE, used to the 16th c.', fuzzyStart=True, fuzzyEnd=True, lane=0, kind='route'),
        cap(19, 'A skill travels differently from a jar.'),
        C(22, 'predict', question='The earliest documented paper mill in the Islamic world: which band?', options=[
            dict(label='1–500', band='B06'), dict(label='500–1000', band='B07'), dict(label='1000–1400', band='B08'),
        ], answer=1, pause=4, reveal=dict(text='Baghdad, 794 to 795: the earliest documented paper mill in the Islamic world.', claim='10', confidence='documented')),
        C(29, 'map.place', id='baghdad', kind='object', side='below'),
        C(29, 'map.place', id='samarkand_region', kind='region', label='Central Asia', side='above'),
        C(29.5, 'map.route', id='r10', **{'from': 'samarkand_region', 'to': 'baghdad'}, flow='skill', label='papermaking · by the late 8th c.', bend=0.2, seconds=2),
        cap(29, 'Paper was known, and made, in Central Asia for centuries before 751, Bloom writes.', '10', 'documented'),
        C(36, 'timeline.mark', id='mill', year=794, label='Baghdad paper mill, 794–95', lane=1),
        cap(36, "The earliest documented paper mill in the Islamic world is Baghdad's, in 794 to 795.", '10', 'documented'),
        C(42, 'map.place', id='talas', kind='argued', label='Talas · argued', side='below'),
        C(42, 'timeline.mark', id='talas', year=751, label='Talas, 751', argued=True, lane=2),
        cap(42, 'The Talas story, that the battle of 751 carried paper west, is argued: Bloom calls it without factual basis, and F1.27 gives both readings.', '10', 'contested'),
        cap(52, 'People travelled too, and not by choice.'),
        C(55, 'map.people', id='r11', **{'from': 'samarkand_region', 'to': 'changan'}, label='three weaving communities, moved by Mongol order · names not recorded'),
        C(55, 'map.peopleMark', id='kashan', label='Persia · weaving communities moved', side='below'),
        cap(55, 'Three separate weaving communities were moved from Central Asia and Persia to China, to make cloth of gold for the Mongols.', '11', 'documented'),
        cap(63, 'The summary names no weaver.', '11', 'documented'),
        cap(66, 'Look for the timeline: the skill is a dated line; the people are a mark of their own.'),
        C(77, 'caption.clear'),
    ]))

# ---- Station 5 ---------------------------------------------------------------
stations.append(dict(
    id='s5', n=5, title='Across the sand',
    idea='Gold crossed the Sahara, and the argued question is whether demand made the routes or routes made the goods.',
    seconds=72, narration=narr['5'], claims=['12', '13', '14'], held='Malian or Sahelian reader (spec §9)',
    commands=[
        C(0, 'chapter', n=5, title='Across the sand'),
        C(0, 'map.clear'),
        note(0, 'Content note: this station names enslaved people carried across the Sahara. You can skip to station six; the summary keeps the dates.', 4),
        C(0, 'map.focus', lon=14, lat=27, zoom=2.5, seconds=1.6),
        C(0, 'map.stamp', text='1324–1375'),
        C(0, 'timeline.scrub', year=1324),
        C(0, 'legend', keys=['material', 'object', 'people', 'region']),
        C(5, 'map.place', id='sahel', kind='region', label='Mali, the Sahel', side='left'),
        C(5, 'map.place', id='cairo', kind='object', side='right'),
        C(5.5, 'map.route', id='r12', **{'from': 'sahel', 'to': 'cairo'}, flow='material', label='gold · 1324–25', bend=0.2, seconds=2),
        cap(5, "Gold was the main commodity of the trans-Saharan trade, the Met's essay says, followed by kola nuts and enslaved people.", '12', 'documented'),
        C(13, 'map.peopleMark', id='sahel', label='enslaved people, carried with gold and kola · count not recorded', side='below'),
        cap(13, 'The essay\'s own noun for those people is different; ours is "enslaved people".', '12', 'documented'),
        cap(19, "Mansa Musa's gold, spent in Cairo in 1324 to 1325, caused the market in gold to crash.", '12', 'documented'),
        C(19, 'timeline.mark', id='musa', year=1324, label='Mansa Musa in Cairo, 1324–25', lane=0),
        C(19.5, 'map.light', id='cairo'),
        C(26, 'map.place', id='majorca', kind='object', label='Majorca · the Catalan Atlas, 1375 (linked)', side='above'),
        C(26, 'timeline.mark', id='atlas', year=1375, label='Catalan Atlas, 1375', lane=1),
        cap(26, 'The Catalan Atlas is attributed to Cresques Abraham, Majorca, 1375; the BnF holds it as Espagnol 30.', '13', 'documented'),
        cap(34, 'It names Musse Melly, lord of Guinea, "the richest and most distinguished ruler of this whole region", for his gold.', '13', 'documented'),
        cap(41, "That caption is a European mapmaker's framing, quoted as his.", '13', 'documented'),
        C(46, 'type', id='readings', x=-920, y=-440, size=22, lines=[
            'The argued question [14]',
            '· One reading: demand for silk, porcelain and gold built the routes and kept them.',
            '· The other: routes already there (monsoon sailing, caravans, ports) made such goods possible and shaped them.',
            'We hold both.',
        ]),
        cap(46, 'The argued question. One reading: demand for silk, porcelain and gold built these routes and kept them.', '14', 'interpretive'),
        cap(54, 'The other: routes already there, monsoon sailing, caravans and ports, made such goods possible and shaped them. We hold both.', '14', 'interpretive'),
        cap(63, 'Look for the caravan line and the dated gold: hold both readings of how they relate.'),
        C(69.5, 'caption.clear'),
        C(70.5, 'type.clear'),
    ]))

# ---- Station 6 ---------------------------------------------------------------
stations.append(dict(
    id='s6', n=6, title='Across the Pacific',
    idea='Silver went west and porcelain east on the same ships, and so did people, on terms the goods never had.',
    seconds=74, narration=narr['6'], claims=['15', '16', '17'], objects=['Met 12.3.1'], held='Philippine or Mexican reader (spec §9)',
    commands=[
        C(0, 'chapter', n=6, title='Across the Pacific'),
        C(0, 'map.clear'),
        note(0, 'Content note: this station names people enslaved and carried across the Pacific. You can skip to station seven; the summary keeps the dates.', 4),
        C(0, 'map.focus', lon=205, lat=2, zoom=1.85, seconds=2),
        C(0, 'map.stamp', text='1565–1815'),
        C(0, 'timeline.scrub', year=1650),
        C(0, 'legend', keys=['material', 'object', 'people']),
        C(5, 'object', **BASIN),
        C(5, 'map.place', id='puebla', kind='object', side='above'),
        C(5, 'timeline.span', id='basin', **{'from': 1645, 'to': 1655}, label='the basin, ca. 1650', lane=0, kind='object'),
        cap(5, 'A basin from Puebla, tin-glazed earthenware, about 1650. The Met credits it to "Master Potter A", a scholars\' name for a hand the record does not name.', '16', 'documented'),
        C(14, 'predict', question='How much of the silver mined in New Spain and Peru went to Asia?', options=[
            dict(label='A tenth', x=-300, y=MAP_Y - 320), dict(label='A third', x=60, y=MAP_Y - 320), dict(label='Nine tenths', x=420, y=MAP_Y - 320),
        ], answer=1, pause=4, reveal=dict(text='As much as one-third, by one estimate; we call that probable.', claim='15', confidence='probable')),
        C(21, 'map.place', id='potosi', kind='object', label='Potosí · silver', side='below'),
        C(21, 'map.place', id='manila', kind='object', side='left'),
        C(21.5, 'map.route', id='r15', **{'from': 'potosi', 'to': 'manila'}, flow='material', label='silver · as much as a third · probable', bend=0.22, seconds=2.2),
        C(21, 'timeline.span', id='galleons', **{'from': 1565, 'to': 1815}, label='the galleons, 1565–1815', lane=1, kind='material'),
        C(23, 'chain', x=250, y=-440, boxWidth=190, boxHeight=60, gap=46, links=[
            dict(id='c1', label='Potosí silver', flow='material'), dict(id='c2', label='Manila'), dict(id='c3', label='Acapulco'), dict(id='c4', label='Puebla basin', flow='object'),
        ], arrows=[dict(**{'from': 'c1', 'to': 'c2'}, flow='material'), dict(**{'from': 'c2', 'to': 'c3'}, flow='object'), dict(**{'from': 'c3', 'to': 'c4'}, flow='object')]),
        C(27, 'map.place', id='acapulco', kind='object', side='above'),
        C(27.5, 'map.route', id='r16', **{'from': 'manila', 'to': 'acapulco'}, flow='object', label='porcelain, silk, ivory, spices', bend=0.12, seconds=2.2),
        cap(27, 'Galleons carried porcelain, silk, ivory and spices to Acapulco.', '15', 'documented'),
        C(32.5, 'map.route', id='r18', **{'from': 'acapulco', 'to': 'puebla'}, flow='object', bend=0.4, seconds=1),
        cap(32, 'Mexican ceramics display the impact of the galleon trade most vividly, Hecht writes.', '15', 'documented'),
        cap(37, 'On the same ships, people.'),
        C(39, 'map.people', id='r17', **{'from': 'manila', 'to': 'acapulco'}, label='enslaved people from many communities · grouped as chinos · from 1672 counted as Indians'),
        cap(39, 'Enslaved people from many communities in the Indian subcontinent and Southeast Asia were carried to Mexico.', '17', 'documented'),
        cap(47, 'Spanish records grouped them as chinos, a colonial label for people from many places.', '17', 'documented'),
        cap(53, 'From 1672 the law counted them as Indians, who could not lawfully be enslaved, Seijas writes.', '17', 'documented'),
        C(53, 'timeline.mark', id='law1672', year=1672, label='1672: counted as Indians', lane=2),
        cap(61, 'Look for the people mark beside the silver arc, never on it.'),
        C(71, 'caption.clear'),
    ]))

# ---- Station 7 ---------------------------------------------------------------
stations.append(dict(
    id='s7', n=7, title='The blue goes north',
    idea='The blue leaves China as export ware, and a skill reaches Arita with the people who were taken.',
    seconds=76, narration=narr['7'], claims=['18', '19'], objects=['Rijksmuseum AK-RBK-16385'], held='Korean reader, with F1.8 (spec §9)',
    commands=[
        C(0, 'chapter', n=7, title='The blue goes north'),
        C(0, 'map.clear'), C(0, 'chain.clear'), C(0, 'object.clear'),
        note(0, 'Content note: this station names potters taken by force. You can skip to station eight; the summary keeps the dates.', 4),
        C(0, 'map.focus', lon=68, lat=40, zoom=1.95, seconds=2),
        C(0, 'map.stamp', text='1590s–1625'),
        C(0, 'timeline.scrub', year=1610),
        C(0, 'legend', keys=['object', 'skill', 'people', 'region']),
        C(5, 'object', **DISH),
        cap(5, 'A dish with two birds in a water landscape.', '18', 'documented'),
        C(8, 'predict', question='When was it made?', options=[
            dict(label='1000–1400', band='B08'), dict(label='1400–1700', band='B09'), dict(label='1700–1900', band='B10'),
        ], answer=1, pause=4, reveal=dict(text='The Rijksmuseum dates it about 1600 to 1625: China, porcelain in underglaze blue, Kraak ware; potter not named.', claim='18', confidence='documented')),
        C(15, 'timeline.span', id='dish', **{'from': 1600, 'to': 1625}, label='Kraak dish, c. 1600–1625', fuzzyStart=True, fuzzyEnd=True, lane=0, kind='object'),
        C(15, 'map.place', id='china', kind='region', label='China', side='below'),
        C(15, 'map.place', id='amsterdam', kind='object', side='above'),
        C(15.5, 'map.route', id='r19', **{'from': 'china', 'to': 'amsterdam'}, flow='object', label='the dish · route not recorded', bend=0.18, seconds=2.4),
        cap(15, 'The blue that came from Iran now leaves China as export ware. How this dish reached Amsterdam is not recorded in the claim.', '18, 2', 'documented'),
        cap(27, 'A second route carried a skill, and the people who held it.'),
        C(30, 'map.place', id='korea', kind='region', label='Joseon', side='above'),
        C(30, 'map.place', id='arita', kind='object', side='below'),
        C(30.5, 'map.people', id='r20', **{'from': 'korea', 'to': 'arita'}, label='Korean potters, taken · Yi Sam-pyeong named'),
        C(30, 'timeline.mark', id='invasions', year=1595, label='1590s: invasions', lane=1),
        cap(30, "In Hideyoshi's invasions of the 1590s, many Korean potters were taken to Japan.", '19', 'contested'),
        cap(37, 'The Met\'s essay says they "came"; Korean state-funded sources say they were dragged from Joseon, so our verb is "taken".', '19', 'contested'),
        C(46, 'map.route', id='r21', **{'from': 'korea', 'to': 'arita'}, flow='skill', label='porcelain clay found at Arita, early 1600s', bend=0.5, seconds=1.4),
        C(46, 'timeline.mark', id='arita', year=1616, label='Arita, early 1600s', lane=2),
        cap(46, 'Korean potters found porcelain clay at Arita early in the 1600s.', '19', 'documented'),
        cap(51, 'A Korean state foundation names one of them, Yi Sam-pyeong.', '19', 'documented'),
        cap(56, 'The Dutch then filled the gap left by China, the Met writes.', '19', 'documented'),
        cap(61, 'Look for the people mark from Korea to Arita: it carries a name where the record gives one.'),
        C(73, 'caption.clear'),
    ]))

# ---- Station 8 ---------------------------------------------------------------
NOTE8 = 'Content note: this step is about the Atlantic slave trade. Traders forced about 12.5 million African people onto ships, 1501–1866, and many died at sea. We show no images of bodies or ships. You can skip this step; the summary keeps the count.'
stations.append(dict(
    id='s8', n=8, title='The Atlantic',
    idea='The count is given in words, the goods as type, and one man by his name and his own text.',
    seconds=88, narration=narr['8'], claims=['20', '21', '22'], objects=['Library of Congress 2018371864'],
    held='Paid reader with lived experience of the African diaspora (spec §9); held until a reader clears',
    commands=[
        C(0, 'chapter', n=8, title='The Atlantic'),
        C(0, 'map.clear'), C(0, 'object.clear'),
        note(0, NOTE8, 9),
        C(0, 'map.focus', lon=-42, lat=24, zoom=1.7, seconds=2),
        C(0, 'map.stamp', text='1501–1866'),
        C(0, 'timeline.scrub', year=1800),
        C(0, 'legend', keys=[]),
        C(2, 'map.dim', opacity=0.5),
        C(10, 'type', id='count', x=250, y=-440, size=24, lines=[
            'About 12.5 million people departed Africa, 1501–1866 (12,520,000: SlaveVoyages\' estimate) [20]',
            'About 10.7 million disembarked, mainly in the Americas [20]',
            '· No line is drawn for this. People are a count in words.',
        ]),
        C(10, 'timeline.span', id='tast', **{'from': 1501, 'to': 1866}, label="SlaveVoyages' estimate, 1501–1866", lane=0, kind='people'),
        cap(10, 'SlaveVoyages estimates that 12,520,000 people departed Africa, and that about 10.7 million disembarked, mainly in the Americas.', '20', 'documented'),
        cap(19, 'We draw no diagram: people are a count in words, never a line on a map.'),
        cap(25, 'The goods are drawn, as type.'),
        C(27, 'type', id='goods', x=250, y=-250, size=22, lines=[
            'Goods European traders paid with [21]',
            '· Indian cotton cloth, then Manchester copies',
            '· brass manillas',
            '· guns, gunpowder and alcohol: summaries only, probable',
        ]),
        cap(27, 'European traders bought captive African people with goods: Indian cotton cloth, then Manchester copies, and brass manillas.', '21', 'documented'),
        cap(36, 'Guns, gunpowder and alcohol appear in summaries only; we call that part probable.', '21', 'probable'),
        cap(42, 'One person the record names.'),
        C(44, 'map.place', id='futa_toro', kind='person', label='Futa Toro · Omar ibn Said, born about 1770', side='below'),
        C(44, 'timeline.mark', id='born', year=1770, label='born about 1770', lane=1),
        cap(44, 'Omar ibn Said was born in Futa Toro, about 1770.', '22', 'documented'),
        C(49, 'map.place', id='charleston', kind='person', label='South Carolina · captured 1807, brought here', side='left'),
        C(49, 'timeline.mark', id='captured', year=1807, label='captured, 1807', lane=2),
        cap(49, 'He was captured in 1807 and brought to South Carolina.', '22', 'documented'),
        C(54, 'map.place', id='fayetteville', kind='person', label='North Carolina · wrote his life in Arabic, 1831', side='above'),
        C(54, 'object', **SAID),
        C(54, 'timeline.mark', id='wrote', year=1831, label='wrote his life, 1831', lane=1),
        cap(54, 'In 1831, while enslaved in North Carolina, he wrote his life in Arabic.', '22', 'documented'),
        cap(60, '"I continued seeking knowledge for 25 years," he wrote.', '22', 'documented'),
        cap(64, 'James Owen of Bladen County was his enslaver.', '22', 'documented'),
        C(68, 'timeline.mark', id='died', year=1863, label='died 1863 or 1864', argued=True, lane=2),
        cap(68, 'He died, still enslaved, in 1863 or 1864; the sources differ, and we give both years.', '22', 'contested'),
        cap(76, 'Look for his two places, Futa Toro and the Carolinas: dots with his name, and no arrow.'),
        C(85, 'caption.clear'),
        C(86, 'type.clear'), C(86, 'object.clear'), C(86.5, 'map.dim', opacity=0),
    ]))

# ---- Station 9 ---------------------------------------------------------------
stations.append(dict(
    id='s9', n=9, title='A lenj on the slipway',
    idea='A skill is a living practice, dated to its source, and the four flows close on one jar.',
    seconds=78, narration=narr['9'], claims=['23', '24', '25', '1'], held='Iranian Gulf reader; Arab-shore reader via F1.31 (spec §9)',
    commands=[
        C(0, 'chapter', n=9, title='A lenj on the slipway'),
        C(0, 'map.clear'), C(0, 'type.clear'),
        C(0, 'map.focus', lon=53.5, lat=26.6, zoom=5.5, seconds=1.8),
        C(0, 'map.stamp', text='2011–2017 · living practice'),
        C(0, 'timeline.scrub', year=2015),
        C(0, 'legend', keys=['skill', 'region']),
        C(1, 'hull'),
        C(2, 'map.place', id='guran', kind='object', label='Guran, Qeshm · lenj yard', side='below'),
        cap(2, 'A wooden hull on a slipway at Guran, on Qeshm island, in the Gulf.', '24', 'documented'),
        C(7, 'timeline.mark', id='lenj', year=2011, label='lenj skills listed, 2011', lane=0),
        cap(7, "The skills of building and sailing a lenj went on UNESCO's Urgent Safeguarding List in 2011.", '23', 'documented'),
        cap(14, 'Sailors used the sun, moon and stars, and each wind was given a name.', '23', 'documented'),
        cap(20, 'Practitioners are mostly older people, and fibreglass replaces wood.', '23', 'documented'),
        C(26, 'chain', x=-560, y=-400, boxWidth=250, boxHeight=78, gap=90, links=[
            dict(id='k1', label='fathers', sub='the trade, over years', flow='skill'),
            dict(id='k2', label='shipwrights at Guran', sub='2017, in their own words · linked', flow='skill'),
        ], arrows=[dict(**{'from': 'k1', 'to': 'k2'}, flow='skill', label='learned')]),
        C(26, 'timeline.mark', id='report', year=2017, label="Guran shipwrights' report, 2017 (linked)", lane=1),
        cap(26, 'In 2017, shipwrights at Guran told a photographer how they learned the trade from their fathers, and how orders dried up.', '24', 'documented'),
        cap(35, 'We link to that report; their words and names stay theirs until their cooperative has been asked.', '24', 'documented'),
        C(42, 'map.place', id='muharraq', kind='plain', label='Muharraq, Bahrain · pearling', side='left'),
        C(42, 'timeline.span', id='pearling', **{'from': 100, 'to': 1930}, label='pearling, 2nd–early 20th c.', fuzzyStart=True, lane=2, kind='base'),
        cap(42, "Across the water, Bahrain's pearling site: UNESCO says pearling dominated between the 2nd and early 20th centuries, until its demise in the 1930s.", '25', 'documented'),
        cap(52, "The page does not say who dived, or on what terms; that is for F1.31's local author to write.", '25', 'not recorded'),
        C(58, 'hull.clear'), C(58, 'chain.clear'), C(58, 'map.dim', opacity=0.45),
        cap(58, "Four flows, then. The jar's blue was a material, the dish an object, paper and the lenj skills.", '1', 'interpretive'),
        C(60, 'chain', x=0, y=-120, boxWidth=340, boxHeight=84, links=[
            dict(id='jar', label='the jar', sub='Cleveland 1962.154 · Jingdezhen, 1300s', x=0, y=0),
            dict(id='mat', label='Material', sub='cobalt from Iran · dashed', flow='material', x=-520, y=-150),
            dict(id='obj', label='Object', sub='the Kraak dish; the basin · solid', flow='object', x=520, y=-150),
            dict(id='skl', label='Skill', sub='paper to Baghdad; the lenj · dotted', flow='skill', x=-520, y=150),
            dict(id='ppl', label='People', sub='weavers, potters, chinos, Omar ibn Said · own mark', flow='people', x=520, y=150),
        ], arrows=[
            dict(**{'from': 'mat', 'to': 'jar'}, flow='material'), dict(**{'from': 'jar', 'to': 'obj'}, flow='object'),
            dict(**{'from': 'skl', 'to': 'jar'}, flow='skill'), dict(**{'from': 'ppl', 'to': 'jar'}, flow='people', label='shared routes, not shared terms'),
        ]),
        cap(64, 'The weavers, the potters, the chinos and Omar ibn Said are people.', '1', 'interpretive'),
        cap(68, 'One jar, four flows, and terms that were never shared.', '1', 'interpretive'),
        cap(72, "Which flow does your own work's material travel on, and on what terms?"),
        C(77.5, 'caption.clear'),
    ]))

# ---- Closing questions -------------------------------------------------------
closing = dict(seconds=76, questions=[
    dict(id='q1', question="Cleveland's record says the jar's cobalt was imported from where?", options=["Jingdezhen's hills", 'Iran', 'Europe'], answer=1, claim='2', show=[
        C(0, 'map.focus', lon=88, lat=30, zoom=2.2, seconds=0.8), C(0, 'map.place', id='jingdezhen', kind='object'),
        C(0.2, 'map.place', id='kashan', kind='object'), C(0.3, 'map.route', id='a1', **{'from': 'kashan', 'to': 'jingdezhen'}, flow='material', label='cobalt', seconds=1),
    ]),
    dict(id='q2', question='Which of these is not argued as the cobalt\'s source?', options=['Qamsar', 'Anarak', 'Jingdezhen'], answer=2, claim='4', show=[
        C(0, 'map.focus', lon=52.5, lat=33.4, zoom=5.5, seconds=0.8), C(0, 'map.place', id='kashan', kind='object'),
        C(0.2, 'map.place', id='qamsar', kind='argued', label='Qamsar · argued', side='below'), C(0.3, 'map.place', id='anarak', kind='argued', label='Anarak · argued'),
    ]),
    dict(id='q3', question='In which band did Kilwa mint coins?', options=['B07 · 500–1000', 'B08 · 1000–1400', 'B09 · 1400–1700'], answer=1, claim='6', show=[
        C(0, 'map.focus', lon=45, lat=-5, zoom=2.2, seconds=0.8), C(0, 'map.place', id='kilwa', kind='object', side='left'), C(0, 'timeline.scrub', year=1200),
        C(0.2, 'timeline.span', id='a3', **{'from': 1000, 'to': 1400}, label='Kilwa coins, 11th–14th c.', lane=0, kind='material'), C(0.3, 'timeline.band', band='B08'),
    ]),
    dict(id='q4', question='The earliest documented paper mill in the Islamic world: which city?', options=['Baghdad', "Chang'an", 'Cairo'], answer=0, claim='10', show=[
        C(0, 'map.focus', lon=70, lat=35, zoom=2.2, seconds=0.8), C(0, 'timeline.scrub', year=794),
        C(0.2, 'map.place', id='baghdad', kind='object', side='below'), C(0.3, 'map.light', id='baghdad'), C(0.3, 'timeline.mark', id='a4', year=794, label='Baghdad paper mill, 794–95', lane=0),
    ]),
    dict(id='q5', question='Where did the galleons land in the Americas?', options=['Acapulco', 'Potosí', 'Puebla'], answer=0, claim='15', show=[
        C(0, 'map.focus', lon=205, lat=2, zoom=1.85, seconds=0.8), C(0, 'map.place', id='manila', kind='object', side='left'), C(0, 'timeline.scrub', year=1650),
        C(0.2, 'map.place', id='acapulco', kind='object', side='above'), C(0.3, 'map.route', id='a5', **{'from': 'manila', 'to': 'acapulco'}, flow='object', label='porcelain, silk, ivory, spices', bend=0.12, seconds=1), C(0.4, 'map.light', id='acapulco'),
    ]),
    dict(id='q6', question='Korean potters taken in the 1590s found porcelain clay where?', options=['Arita', 'Amsterdam', 'Manila'], answer=0, claim='19', show=[
        C(0, 'map.focus', lon=128, lat=35, zoom=4, seconds=0.8), C(0, 'map.place', id='korea', kind='region', label='Joseon', side='above'), C(0, 'timeline.scrub', year=1610),
        C(0.2, 'map.place', id='arita', kind='object', side='below'), C(0.3, 'map.people', id='a6', **{'from': 'korea', 'to': 'arita'}, label='Korean potters, taken · Yi Sam-pyeong named'), C(0.4, 'map.light', id='arita'),
    ]),
    dict(id='q7', question="Over which years does SlaveVoyages' estimate of 12.5 million run?", options=['1301–1500', '1501–1866', '1900–now'], answer=1, claim='20', show=[
        C(0, 'map.focus', lon=-42, lat=24, zoom=1.7, seconds=0.8), C(0, 'timeline.scrub', year=1700), C(0, 'map.dim', opacity=0.5),
        C(0.2, 'timeline.span', id='a7', **{'from': 1501, 'to': 1866}, label="SlaveVoyages' estimate, 1501–1866 · a count in words, no line on the map", lane=0, kind='people'),
    ]),
    dict(id='q8', question='Where was Omar ibn Said born?', options=['Futa Toro', 'Fayetteville', 'Majorca'], answer=0, claim='22', show=[
        C(0, 'map.focus', lon=-40, lat=24, zoom=1.8, seconds=0.8), C(0, 'map.dim', opacity=0), C(0, 'timeline.scrub', year=1770),
        C(0.2, 'map.place', id='futa_toro', kind='person', label='Futa Toro · Omar ibn Said, born about 1770', side='below'), C(0.3, 'map.light', id='futa_toro'),
    ]),
])

data = dict(
    id='f1-13', unit='F1.13', title='Networks: objects, materials, skills and people',
    subtitle="One jar's blue, followed through all four",
    fps=30, places=PLACES, titleSeconds=8, stations=stations, closing=closing,
)
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf8')
total = data['titleSeconds'] + sum(s['seconds'] for s in stations) + closing['seconds']
print(f'wrote {OUT} · {len(stations)} stations · planned {total} s ({total/60:.1f} min)')

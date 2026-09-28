"""Round-2 independent fact-check fixes for canon_people.csv.
Edits only the listed cells; asserts old values; logs every change."""
import csv, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(BASE, 'canon', 'canon_people.csv')
LOG = os.path.join(BASE, 'REVIEW_LOG_round2_people.md')

S = {
 'tt1': 'https://en.wikipedia.org/wiki/TT1',
 'metIy': 'https://www.metmuseum.org/art/collection/search/551783',
 'ens': 'https://www.ens-lyon.fr/en/article/research/abdel-kader-haidara-director-timbuktu-library',
 'moma': 'https://post.moma.org/pots-mastery-and-the-enduring-legacy-of-ladi-dosei-kwali/',
 'nana': 'https://en.wikipedia.org/wiki/Nana_Oforiatta_Ayim',
 'amina': 'https://en.wikipedia.org/wiki/Queen_Amina',
 'aware': 'https://awarewomenartists.com/en/artiste/reinata-sadimba/',
 'maxam': 'https://www.academia.edu/143756887/A_Royal_Artist_at_Naranjo_Notes_on_a_Late_Classic_Maya_Cylinder_Vessel',
 'aic': 'https://www.artic.edu/artworks/126858/water-lily-vessel',
 'fried': 'https://www.elfinanciero.com.mx/entretenimiento/2026/03/05/muere-pedro-friedeberg-referente-del-surrealismo-en-mexico-a-los-90-anos-quien-era/',
 'moa': 'https://collection-online.moa.ubc.ca/search/person?person=799&tab=biography',
 'nmai': 'https://americanindian.si.edu/exhibitions/infinityofnations/northwest-coast/196110.html',
 'luwenyu': 'https://en.wikipedia.org/wiki/Lu_Wenyu',
 'vam': 'https://collections.vam.ac.uk/item/O405633/shah-tahmasp-of-iran-painting-sahifa-banu/',
 'sethna': 'https://en.wikipedia.org/wiki/Nelly_Sethna',
 'ijliya': 'https://en.wikipedia.org/wiki/Mariam_al-Asturlabi',
 'sahkulu': 'https://en.wikipedia.org/wiki/%C5%9Eahkulu_(painter)',
 'selim': 'https://en.wikipedia.org/wiki/Lorna_Selim',
 'makki': 'https://en.wikipedia.org/wiki/Najat_Makki',
 'perennius': 'https://www.academia.edu/8587773/Stamps_on_Italian_Sigillata_and_the_Renaissance_of_Aptera_Crete',
 'metper': 'https://www.metmuseum.org/art/collection/search/248324',
 'lemonnier': 'https://www.idref.fr/030828783',
 'graburn': 'https://anthropology.berkeley.edu/memoriam-professor-nelson-hh-graburn-1936-2025',
 'fry': 'https://www.anu.edu.au/events/beyond-speculation-design-in-the-epoch-of-unsettlement-with-tony-fry',
 'kartini': 'https://www.atlantis-press.com/proceedings/icskse-18/125909580',
 'woolley': 'https://isaw.nyu.edu/exhibitions/aesthetics/checklist/99-early-reconstruction-of-puabi2019s-headdress-by-katharine-woolley/view',
 'binzagr': 'https://artreview.com/safeya-binzagr-pioneer-of-saudi-art-1940-2024/',
}

# (id, field, expected_old, new, source)
E = [
 ('PER006', 'notes',
  'Tomb contents are divided mainly between Cairo and the Met; verify which pieces are in the Met. links: MKR090',
  "Verified round 2: the Met holds about 29 items from TT1, including the coffin sets of Iyneferti and of Khonsu; Sennedjem's own coffin set and sarcophagus are in Cairo (National Museum of Egyptian Civilization). links: MKR090",
  S['tt1'] + ' ; ' + S['metIy']),
 ('PER027', 'start', '1964', '1981', S['ens']),
 ('PER027', 'date_note', 'born c. 1964; living',
  'fl.; took charge of his family library in 1981; birth year not verified; living', S['ens']),
 ('PER032', 'making_significance',
  'The Gbari potter from Kwali made hand-built water pots and then, at the Abuja Pottery Training Centre, glazed stoneware that was shown in London and New York.',
  'The Gbari potter from Kwali made hand-built water pots and then, at the Abuja Pottery Training Centre, glazed stoneware that was shown in London (Berkeley Galleries, 1958–62), Paris and Washington.',
  S['moma']),
 ('PER059', 'start', '1978', '2019', S['nana']),
 ('PER059', 'date_note', 'born c. 1978; living',
  "fl.; curated Ghana's first Venice Biennale pavilion in 2019; birth year not verified; living", S['nana']),
 ('PER059', 'notes', 'Verify birth year.',
  'Birth year could not be verified from a reliable source in the round-2 check, so a floruit is given.', S['nana']),
 ('PER067', 'date_note', 'fl.; 16th century, dates uncertain',
  'fl.; dates disputed: often given as reign c. 1576–1610 (16th century), but the Kano Chronicle makes her a contemporary of Muhammad Dauda (r. 1421–38)',
  S['amina']),
 ('PER068', 'date_note', 'born c. 1945; living', 'born 1945; living', S['aware']),
 ('PER068', 'notes', 'Verify birth year. links: STY177', 'Birth year verified (AWARE). links: STY177', S['aware']),
 ('PER073', 'start', '700', '750', S['aic']),
 ('PER073', 'end', '780', '810', S['maxam']),
 ('PER073', 'date_note', 'fl.; 8th century, approximate',
  'fl.; mid-to-late 8th century (Art Institute of Chicago); his father acceded at Naranjo in 765 and one study puts his birth in the 770s, so activity may run to c. 800',
  S['aic'] + ' ; ' + S['maxam']),
 ('PER073', 'notes', 'Signature readings and dates from epigraphers; verify. links: MKR021',
  'Verified round 2: the Water-Lily Vessel inscription names him, his royal Naranjo lineage and his parents; his mother was a lady of Yaxha. links: MKR021',
  S['aic'] + ' ; ' + S['maxam']),
 ('PER087', 'end', '', '2026', S['fried']),
 ('PER087', 'date_note', 'born 1936; living', 'born 11 January 1936 in Florence; died 5 March 2026', S['fried']),
 ('PER087', 'sensitivity', 'living-community', 'none', S['fried']),
 ('PER120', 'other_names', 'Qwii.aang', 'Kwii.aang', S['nmai']),
 ('PER120', 'date_note', 'approximate',
  'born c. 1858 (Museum of Anthropology, UBC; some sources give c. 1842); died 1926', S['moa']),
 ('PER120', 'notes', 'Verify dates.',
  'Dates checked round 2: MOA gives 1858–1926; birth year is disputed.', S['moa']),
 ('PER180', 'start', '1966', '1967', S['luwenyu']),
 ('PER180', 'date_note', 'born c. 1966; living', 'born 1967; living', S['luwenyu']),
 ('PER180', 'notes', 'Verify birth year.',
  'Birth year 1967 per Wikipedia and Bloomsbury Encyclopedia; some web sources give 1966.', S['luwenyu']),
 ('PER236', 'making_significance',
  'One of the few named women painters at the Mughal court, known from a signed portrait of Shah Tahmasp copied from an earlier image.',
  'One of the few named women painters at the Mughal court, known from an early 17th-century portrait of Shah Tahmasp (V&A) whose inscription names her as its painter.',
  S['vam']),
 ('PER264', 'making_significance',
  "The Indian textile designer worked with handloom weavers and revived techniques in the Weavers' Service Centres.",
  'The Indian textile designer, trained in weaving at Cranbrook, designed for Bombay Dyeing, helped set up textile design at the National Institute of Design (1966) and researched kalamkari printing at Masulipatnam, bringing disused carved blocks back into use.',
  S['sethna']),
 ('PER264', 'leaves_out', 'the weavers who made her designs',
  'the weavers and kalamkari printers who made her designs', S['sethna']),
 ('PER264', 'notes', 'Verify details.',
  "Round 2: the earlier claim about Weavers' Service Centres could not be sourced and was replaced.", S['sethna']),
 ('PER303', 'name', 'Mariam al-Ijliya', "al-ʿIjliyya bint al-ʿIjliyy", S['ijliya']),
 ('PER303', 'other_names', 'al-Asturlabiyya',
  'Mariam al-Ijliya; Mariam al-Asturlabiyya (modern names)', S['ijliya']),
 ('PER303', 'making_significance',
  'Ibn al-Nadim names her as an astrolabe maker at the court of Sayf al-Dawla in Aleppo.',
  'Ibn al-Nadim names her, the daughter of the astrolabe maker al-ʿIjliyy and like him a pupil of Nastulus, as an astrolabe maker employed by Sayf al-Dawla in Aleppo.',
  S['ijliya']),
 ('PER303', 'notes', 'Known from one source.',
  "Known from one source (Ibn al-Nadim, Fihrist); the first name 'Mariam' is a modern addition not found there.",
  S['ijliya']),
 ('PER320', 'start', '1500', '1515', S['sahkulu']),
 ('PER320', 'date_note', 'died 1555–56',
  'fl.; brought to Istanbul 1515; died by 1555–56; birth date unknown', S['sahkulu']),
 ('PER320', 'making_significance',
  'The Tabriz-born court painter in Istanbul led the saz style of feathery leaves and fantastic creatures used in tiles and textiles.',
  'The Iranian court painter, trained in Tabriz and brought to Istanbul in 1515, led the saz style of feathery leaves and fantastic creatures used in tiles and textiles.',
  S['sahkulu']),
 ('PER331', 'making_significance',
  'The British-born painter in Baghdad worked with Jewad Selim and taught architectural drawing.',
  "The British-born painter married the sculptor Jewad Selim, taught drawing to architecture students at Baghdad University in the 1960s and painted the city's vernacular buildings.",
  S['selim']),
 ('PER339', 'making_significance',
  'The Emirati painter is among the first women from the Emirates with an art doctorate, using light and colour drawn from henna and textiles.',
  'The Emirati painter was the first Emirati woman to receive a government scholarship to study art abroad (1977), later took a doctorate in Cairo (2001), and works with colour, light and Emirati settings and folklore.',
  S['makki']),
 ('PER339', 'notes', 'Verify biography.', 'Biography checked round 2 (Wikipedia).', S['makki']),
 ('PER380', 'making_significance',
  "The Arretine pottery owner's stamps name workers such as Tigranus and Bargathes, enslaved or freed men who later ran the workshop themselves.",
  "The Arretine pottery's stamps show the workshop passing to men who had worked in it: first Perennius's freedman Marcus Perennius Tigranus, then Marcus Perennius Bargathes.",
  S['perennius'] + ' ; ' + S['metper']),
 ('PER380', 'notes', 'Verify stamp readings and status of Tigranus and Bargathes. links: POL120',
  'Round 2: Tigranus is described as a freedman of M. Perennius; Bargathes followed him as owner (Phase 3, c. 25–30 CE per Porten Palange). Earlier enslaved status is likely but not explicitly sourced here. links: POL120',
  S['perennius'] + ' ; ' + S['metper']),
 ('PER463', 'date_note', 'born c. 1948; living', 'born 1948; living', S['lemonnier']),
 ('PER463', 'notes', 'Verify birth year.', 'Birth year verified (IdRef authority record).', S['lemonnier']),
 ('PER466', 'end', '', '2025', S['graburn']),
 ('PER466', 'date_note', 'born 1936; living', 'born 1936; died 2025', S['graburn']),
 ('PER466', 'sensitivity', 'living-community', 'none', S['graburn']),
 ('PER476', 'start', '1947', '1999', S['fry']),
 ('PER476', 'date_note', 'born c. 1947; living',
  'fl.; Defuturing published 1999; birth year not verified; living', S['fry']),
 ('PER476', 'making_significance',
  'The British-born design theorist, working in Australia, argued in Defuturing (1999) that design often destroys futures.',
  'The design theorist, working in Australia, argued in Defuturing (1999) that design often destroys futures.',
  S['fry']),
 ('PER476', 'notes', 'Verify birth year.',
  'Birth year and birthplace could not be verified in the round-2 check; floruit given and "British-born" removed.', S['fry']),
 ('PER274', 'notes', 'Verify the extent of her role in the Jepara trade.',
  'Round 2: sources confirm she marketed Jepara carving to Semarang, Batavia and the Netherlands and worked with the Oost en West association; the scale of her role beyond that is less documented.',
  S['kartini']),
 ('PER296', 'notes', 'Verify extent of reconstructions.',
  "Round 2: an early reconstruction of Puabi's headdress by Katharine Woolley is documented (ISAW exhibition).", S['woolley']),
 ('PER340', 'notes', 'Verify death year.', 'Death year 2024 verified.', S['binzagr']),
]

with open(PATH, newline='', encoding='utf-8') as f:
    rd = csv.DictReader(f)
    header = rd.fieldnames
    rows = list(rd)
idx = {r['id']: r for r in rows}
log = []
for i, fld, old, new, src in E:
    r = idx[i]
    assert r[fld] == old, (i, fld, r[fld])
    r[fld] = new
    log.append((i, fld, old, new, src))
with open(PATH, 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=header, quoting=csv.QUOTE_MINIMAL)
    w.writeheader()
    w.writerows(rows)

def esc(s):
    return (s if s != '' else '(empty)').replace('|', '\\|')

with open(LOG, 'w', encoding='utf-8') as f:
    f.write('# Review log, round 2: canon_people.csv and blindmap/missing_entities.csv (independent fact-check)\n\n')
    f.write('Originals backed up to archive/prereview_round2/. Format: id | field | old | new | source URL\n\n')
    f.write('| id | field | old | new | source URL |\n|---|---|---|---|---|\n')
    for i, fld, old, new, src in log:
        f.write(f'| {i} | {fld} | {esc(old)} | {esc(new)} | {src} |\n')
print(len(log), 'changes;', len({l[0] for l in log}), 'rows')

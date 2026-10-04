#!/usr/bin/env python3
"""Desks data: writes public/data/desks.json and packs the margin crops into public/img/desk/margins.webp.

Run from build/units/edo:  python3 harness/desks-prep.py
Marks are fractions of the image's width and height (x, y, w, h), read off grid crops of each image.
Seal readings come only from the holder's record or a cited source, or are seen on the sheet and agree
with the holder's date (those say so in their conf and note)."""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / 'public'

# ---------------------------------------------------------------- sources (t, u, conf)
SRC = {
    'jaanus-aratame': {'t': 'JAANUS, “aratame-in” (censor and date seals)', 'u': 'https://www.aisf.or.jp/~jaanus/deta/a/aratamein.htm'},
    'vjp-seals': {'t': 'Viewing Japanese Prints, “Inscriptions and seals”', 'u': 'https://www.viewingjapaneseprints.net/texts/topics_faq/faq_inscript_seals.html'},
    'vjp-sumptuary': {'t': 'Viewing Japanese Prints, “Sumptuary edicts” (the 1791 case)', 'u': 'https://viewingjapaneseprints.net/texts/topics_faq/faq_sumptuary.html'},
    'kato-tenpo': {'t': 'Katō Yoshio, Ukiyo-e jiten: the Tenpō reforms, with the 1842 orders', 'u': 'https://www.ne.jp/asahi/kato/yoshio/ukiyoeyougo/te-yougo/yougo-tenpoukaikaku.html'},
    'kato-1847': {'t': 'Katō Yoshio, Ukiyo-e hikka-shi 7: the reports and fines of 1847 (from Dai Nihon kinsei shiryō and the Fujiokaya diary)', 'u': 'https://www.ne.jp/asahi/kato/yoshio/tyojutu/ukiyoe-hikka7-kouka4.html'},
    'fujiokaya': {'t': 'Fujiokaya nikki, Kaei years (transcription)', 'u': 'https://www.ne.jp/asahi/kato/yoshio/hujiokaya/kaei-hujiokaya.html'},
    'wiki-tsutaya': {'t': 'Wikipedia, Tsutaya Jūzaburō', 'u': 'https://en.wikipedia.org/wiki/Tsutaya_J%C5%ABzabur%C5%8D'},
    'wiki-utamaro': {'t': 'Wikipedia, Utamaro', 'u': 'https://en.wikipedia.org/wiki/Utamaro'},
    'wiki-kuniyoshi': {'t': 'Wikipedia, Utagawa Kuniyoshi', 'u': 'https://en.wikipedia.org/wiki/Utagawa_Kuniyoshi'},
    'smits-namazu': {'t': 'Smits, the Ansei Edo earthquake and catfish prints', 'u': 'https://pressbooks.bccampus.ca/meijiat150/chapter/the-ansei-edo-earthquake-and-catfish-prints/'},
    'hiroshige-uk': {'t': 'hiroshige.org.uk, One Hundred Famous Views of Edo (Uoya Eikichi; the sheets)', 'u': 'https://www.hiroshige.org.uk/100_Views_Of_Edo/100_Views_Of_Edo.htm'},
    'met-harunobu': {'t': 'The Met, Harunobu, Visit to a Shrine at the Hour of the Ox, 1765 (JP2438)', 'u': 'https://www.metmuseum.org/art/collection/search/56874'},
    'met-sharaku': {'t': 'The Met, Sharaku, Ōtani Oniji III as Yakko Edobei, 1794 (JP2822)', 'u': 'https://www.metmuseum.org/art/collection/search/37358'},
    'met-shower': {'t': 'The Met, Hiroshige, Sudden Shower over Shin-Ōhashi Bridge and Atake, 1857 (JP2522)', 'u': 'https://www.metmuseum.org/art/collection/search?q=JP2522'},
    'met-cat': {'t': 'The Met, Kuniyoshi, The Okazaki Cat Demon, ca. 1850 (JP1563)', 'u': 'https://www.metmuseum.org/art/collection/search?q=JP1563'},
    'cma-utamaro': {'t': 'Cleveland Museum of Art 1940.1031: “Publisher: Tsutaya Jūzaburo (emblem). Censorship Seal: kiwame.”', 'u': 'https://clevelandart.org/art/1940.1031'},
    'cma-1921-318': {'t': 'Cleveland Museum of Art 1921.318, another impression of Sudden Shower: “Publisher: Uoya Eikichi (Uoei, Shitaya). Censorship Seal: aratame”', 'u': 'https://clevelandart.org/art/1921.318'},
    'cma-1985-333': {'t': 'Cleveland Museum of Art 1985.333: “Gototei Kunisada ga. Publisher: Kawaguchiya Uhei. Censorship Seal: kiwame.”', 'u': 'https://clevelandart.org/art/1985.333'},
    'cma-1980-85': {'t': 'Cleveland Museum of Art 1980.85: “Ichiyusai Kuniyoshi ga. Publisher: Kagaya, Ryogoku. Censorship Seal: kiwame”', 'u': 'https://clevelandart.org/art/1980.85'},
    'cma-1985-335': {'t': 'Cleveland Museum of Art 1985.335: “Publisher: Kagaya Kichibei. Censorship Seal: kiwame.”', 'u': 'https://clevelandart.org/art/1985.335'},
    'cma-1943-3': {'t': 'Cleveland Museum of Art 1943.3: “Signature: Hokusai aratame Iitsu hitsu. Censorship seal: kiwame”', 'u': 'https://clevelandart.org/art/1943.3'},
    'cma-1985-336': {'t': 'Cleveland Museum of Art 1985.336: “Publisher: Enshuya Matabei (Hori 2). Censorship Seal: Mura.”', 'u': 'https://clevelandart.org/art/1985.336'},
    'cma-1930-186': {'t': 'Cleveland Museum of Art 1930.186: “Publisher: Maruya Seibei (Marusei han, Shiba Shimmei Mae). Censorship Seal: Mera, Watanabe”', 'u': 'https://clevelandart.org/art/1930.186'},
    'cma-1985-311': {'t': 'Cleveland Museum of Art 1985.311: “Publisher: Echimuraya Heisuke. Engraver: Hori Sennosuke. Censorship Seal: aratame.”', 'u': 'https://clevelandart.org/art/1985.311'},
    'aic-92260': {'t': 'Art Institute of Chicago 1926.2148: Kunisada, the actors Ichikawa Ebizō V and Ichikawa Danjūrō VIII, Nakamura Theatre, fifth month 1850', 'u': 'https://www.artic.edu/artworks/92260'},
    'aic-plum': {'t': 'Art Institute of Chicago 1925.3752, Plum Garden at Kameido, 1857', 'u': 'https://www.artic.edu/artworks/26577'},
    'bm-gishi': {'t': 'British Museum 1906,1220,0.1163 (via Wikimedia Commons): Kuniyoshi, Seichū gishi den, Ōtaka Gengo Tadao', 'u': 'https://www.britishmuseum.org/collection/object/A_1906-1220-0-1163'},
}

# ---------------------------------------------------------------- bands and the people who examined
BANDS = [
    {'id': 'none', 'from': 1600, 'to': 1790, 'label': 'No seal required', 'k': '', 'short': 'no seal',
     'who': 'No examiner. The town magistrates punished books and prints after they were published.', 'whoConf': 'documented', 'src': ['vjp-seals']},
    {'id': 'kiwame', 'from': 1790, 'to': 1843, 'label': 'The kiwame seal', 'k': '極', 'short': 'kiwame',
     'who': 'Examiners (gyōji) chosen in rotation from the publishers’ own guild.', 'whoConf': 'documented', 'src': ['jaanus-aratame', 'vjp-seals']},
    {'id': 'nanushi', 'from': 1843, 'to': 1853, 'label': 'Named censors’ seals', 'k': '名主', 'short': 'nanushi',
     'who': 'Ward headmen (nanushi) appointed to examine prints, each with a seal of his own name.', 'whoConf': 'documented', 'src': ['jaanus-aratame', 'kato-1847']},
    {'id': 'aratame', 'from': 1853, 'to': 1876, 'label': 'Aratame and a date', 'k': '改', 'short': 'aratame',
     'who': 'Examiners whose names no longer appear: one seal, 改, usually with a date seal.', 'whoConf': 'probable', 'src': ['jaanus-aratame']},
]

GLOSS = {
    'kiwame': {'k': '極', 'r': 'kiwame', 'm': 'examined, approved', 'span': '1790–1842', 'note': 'A small round seal cut into the key block, so it printed on every sheet.', 'conf': 'documented', 'src': ['jaanus-aratame', 'vjp-seals']},
    'nanushi': {'k': '名主', 'r': 'nanushi', 'm': 'ward headman', 'span': '1843–1853', 'note': 'The examiner’s own name in a small seal: one seal at first, two from 1847, two with a date seal from 1852.', 'conf': 'documented', 'src': ['jaanus-aratame']},
    'aratame': {'k': '改', 'r': 'aratame', 'm': 'examined', 'span': '1853–c. 1875', 'note': 'One seal for the censor, usually beside or inside a date seal.', 'conf': 'documented', 'src': ['jaanus-aratame']},
    'date': {'k': '巳九', 'r': 'date seal', 'm': 'zodiac year + month', 'span': '1805–10, 1814, 1852–75', 'note': 'An animal of the twelve-year cycle and a month number. 巳, the Snake, falls on 1857 in these years; 九 is the ninth month.', 'conf': 'documented', 'src': ['jaanus-aratame', 'vjp-seals']},
    'ga': {'k': '画 · 筆', 'r': 'ga · hitsu', 'm': 'drawn by · painted by', 'span': '', 'note': 'The ending of a designer’s signature. It names the designer, never the carver or printer.', 'conf': 'documented', 'src': ['vjp-seals']},
    'aratame-sig': {'k': '改', 'r': 'aratame (in a signature)', 'm': 'changing (his name) to', 'span': '', 'note': 'Inside a signature 改 means a change of name, not a censor. Only a seal is a censor’s mark.', 'conf': 'documented', 'src': ['vjp-seals']},
    'han': {'k': '板 · 版', 'r': 'han', 'm': 'block of, published by', 'span': '', 'note': 'After a publisher’s name or shop sign: the blocks belonged to him.', 'conf': 'documented', 'src': ['vjp-seals']},
    'hori': {'k': '彫', 'r': 'hori', 'm': 'carved by', 'span': '', 'note': 'Carvers are named only occasionally, in a small cartouche.', 'conf': 'documented', 'src': ['vjp-seals']},
}

# ---------------------------------------------------------------- prints
# src: path under img/ without .webp. crop: the margin detail for cards (fractions). marks: hotspots.
P = {}
def pr(id, **kw): P[id] = {'id': id, **kw}

pr('harunobu', src='harunobu-1765', title='Visit to a Shrine at the Hour of the Ox', maker='Suzuki Harunobu', date='1765', year=1765,
   holder='The Metropolitan Museum of Art', acc='JP2438', lic='CC0', url=SRC['met-harunobu']['u'], kind='calendar print',
   band='none', crop=[0.0, 0.84, 0.16, 0.15],
   marks=[{'id': 'sig', 'type': 'sig', 'r': [0.02, 0.88, 0.12, 0.11], 'k': '鈴木春信画', 'label': 'Signature', 'text': 'Suzuki Harunobu ga, “drawn by Suzuki Harunobu”.', 'conf': 'documented', 'src': ['met-harunobu']},
          {'id': 'red', 'type': 'other', 'r': [0.018, 0.518, 0.068, 0.054], 'k': '', 'label': 'A red seal', 'text': 'Not a censor’s seal: censor seals began in 1790. This one is not read here.', 'conf': 'documented', 'src': ['vjp-seals']}])

pr('sharaku', src='sharaku', title='Kabuki Actor Ōtani Oniji III as Yakko Edobei', maker='Tōshūsai Sharaku; publisher Tsutaya Jūzaburō', date='1794', year=1794.4,
   holder='The Metropolitan Museum of Art', acc='JP2822', lic='CC0', url=SRC['met-sharaku']['u'], kind='actor',
   band='kiwame', crop=[0.83, 0.74, 0.14, 0.14],
   marks=[{'id': 'sig', 'type': 'sig', 'r': [0.868, 0.59, 0.045, 0.21], 'k': '東洲斎写楽画', 'label': 'Signature', 'text': 'Tōshūsai Sharaku ga.', 'conf': 'documented', 'src': ['met-sharaku']},
          {'id': 'seal', 'type': 'seal', 'r': [0.872, 0.802, 0.042, 0.03], 'k': '極', 'label': 'Censor’s seal', 'text': '極, kiwame: examined, under the 1790 rules. Seen on the sheet; it agrees with the Met’s date, 1794.', 'conf': 'documented', 'src': ['jaanus-aratame', 'met-sharaku']},
          {'id': 'pub', 'type': 'pub', 'r': [0.84, 0.838, 0.11, 0.035], 'k': '', 'label': 'Publisher’s mark', 'text': 'Tsutaya’s mark: an ivy leaf under a three-peaked Fuji.', 'conf': 'documented', 'src': ['wiki-tsutaya']}])

pr('utamaro', src='utamaro-tsutaya', title='Woman Holding a Fan (Ten Aspects of the Physiognomy of Women)', maker='Kitagawa Utamaro; publisher Tsutaya Jūzaburō', date='c. 1793', year=1793,
   holder='Cleveland Museum of Art', acc='1940.1031', lic='CC0', url='https://clevelandart.org/art/1940.1031', kind='beauty',
   band='kiwame', crop=[0.03, 0.11, 0.13, 0.19],
   marks=[{'id': 'sig', 'type': 'sig', 'r': [0.064, 0.112, 0.052, 0.098], 'k': '歌麿画', 'label': 'Signature', 'text': 'Utamaro ga, “drawn by Utamaro”.', 'conf': 'documented', 'src': ['cma-utamaro'], 'words': ['w-utamaro'], 'gloss': 'ga'},
          {'id': 'seal', 'type': 'seal', 'r': [0.077, 0.217, 0.042, 0.031], 'k': '極', 'label': 'Censor’s seal', 'text': '極, kiwame: the guild’s examiners passed it. The seal of 1790 to 1842.', 'conf': 'documented', 'src': ['cma-utamaro', 'jaanus-aratame'], 'words': ['w-kiwame', 'w-1790'], 'gloss': 'kiwame'},
          {'id': 'pub', 'type': 'pub', 'r': [0.067, 0.25, 0.06, 0.037], 'k': '', 'label': 'Publisher’s mark', 'text': 'Tsutaya’s ivy leaf under Fuji.', 'conf': 'documented', 'src': ['cma-utamaro'], 'words': ['w-tsutaya']},
          {'id': 'series', 'type': 'series', 'r': [0.163, 0.032, 0.054, 0.275], 'k': '婦人相学十躰', 'label': 'Series title', 'text': 'Fujin sōgaku juttai, Ten Aspects of the Physiognomy of Women.', 'conf': 'documented', 'src': ['cma-utamaro'], 'words': ['w-physiognomy']}],
   answer={'designer': 'w-utamaro', 'publisher': 'w-tsutaya', 'examined': 'w-kiwame', 'date': 'w-1790'})

pr('danjuro', src='desk/cma-1985-333', title='Ichikawa Danjūrō VII as Kan Shōjō in the Mt. Tenpai Scene (Famous Kabuki Plays)', maker='Utagawa Kunisada; publisher Kawaguchiya Uhei', date='1814', year=1814,
   holder='Cleveland Museum of Art', acc='1985.333', lic='CC0', url='https://clevelandart.org/art/1985.333', kind='actor',
   band='kiwame', crop=[0.02, 0.18, 0.16, 0.24],
   marks=[{'id': 'seal', 'type': 'seal', 'r': [0.097, 0.192, 0.046, 0.034], 'k': '極', 'label': 'Censor’s seal', 'text': '極, kiwame: examined by the guild’s examiners.', 'conf': 'documented', 'src': ['cma-1985-333', 'jaanus-aratame'], 'words': ['w-kiwame', 'w-1790'], 'gloss': 'kiwame'},
          {'id': 'pub', 'type': 'pub', 'r': [0.093, 0.226, 0.046, 0.05], 'k': '川口', 'label': 'Publisher’s mark', 'text': 'Kawaguchi: the publisher Kawaguchiya Uhei.', 'conf': 'documented', 'src': ['cma-1985-333'], 'words': ['w-kawaguchi']},
          {'id': 'sig', 'type': 'sig', 'r': [0.035, 0.22, 0.05, 0.185], 'k': '五渡亭国貞画', 'label': 'Signature', 'text': 'Gototei Kunisada ga.', 'conf': 'documented', 'src': ['cma-1985-333'], 'words': ['w-kunisada'], 'gloss': 'ga'},
          {'id': 'title', 'type': 'title', 'r': [0.78, 0.035, 0.15, 0.165], 'k': '大当狂言之内 菅丞相', 'label': 'Title cartouche', 'text': 'Ōatari kyōgen no uchi, Famous Kabuki Plays: the role, Kan Shōjō.', 'conf': 'documented', 'src': ['cma-1985-333'], 'words': ['w-kanshojo']}],
   answer={'designer': 'w-kunisada', 'publisher': 'w-kawaguchi', 'examined': 'w-kiwame', 'date': 'w-1790'})

pr('suikoden', src='desk/cma-1980-85', title='Rōri Hakuchō Chōjun (108 Heroes of the Shuihu zhuan)', maker='Utagawa Kuniyoshi; publisher Kagaya Kichibei', date='late 1820s', year=1828,
   holder='Cleveland Museum of Art', acc='1980.85', lic='CC0', url='https://clevelandart.org/art/1980.85', kind='warrior',
   band='kiwame', crop=[0.62, 0.84, 0.16, 0.15],
   marks=[{'id': 'seal', 'type': 'seal', 'r': [0.652, 0.902, 0.042, 0.035], 'k': '極', 'label': 'Censor’s seal', 'text': '極, kiwame.', 'conf': 'documented', 'src': ['cma-1980-85', 'jaanus-aratame'], 'words': ['w-kiwame', 'w-1790'], 'gloss': 'kiwame'},
          {'id': 'pub', 'type': 'pub', 'r': [0.652, 0.935, 0.046, 0.042], 'k': '加賀屋', 'label': 'Publisher’s mark', 'text': 'Kagaya of Ryōgoku: the publisher Kagaya Kichibei.', 'conf': 'documented', 'src': ['cma-1980-85'], 'words': ['w-kagaya']},
          {'id': 'sig', 'type': 'sig', 'r': [0.695, 0.848, 0.065, 0.112], 'k': '一勇斎国芳画', 'label': 'Signature', 'text': 'Ichiyūsai Kuniyoshi ga.', 'conf': 'documented', 'src': ['cma-1980-85'], 'words': ['w-kuniyoshi'], 'gloss': 'ga'},
          {'id': 'title', 'type': 'title', 'r': [0.05, 0.03, 0.165, 0.22], 'k': '通俗水滸伝豪傑百八人之一人 浪裏白跳張順', 'label': 'Title cartouches', 'text': 'One of the 108 heroes of the Shuihu zhuan: Rōri Hakuchō Chōjun.', 'conf': 'documented', 'src': ['cma-1980-85'], 'words': ['w-chojun']}],
   answer={'designer': 'w-kuniyoshi', 'publisher': 'w-kagaya', 'examined': 'w-kiwame', 'date': 'w-1790'})

pr('omori', src='desk/cma-1985-335', title='Ōmori (Famous Places in the Eastern Capital)', maker='Utagawa Kuniyoshi; publisher Kagaya Kichibei', date='early 1830s', year=1832,
   holder='Cleveland Museum of Art', acc='1985.335', lic='CC0', url='https://clevelandart.org/art/1985.335', kind='landscape',
   band='kiwame', crop=[0.86, 0.8, 0.13, 0.16],
   marks=[{'id': 'seal', 'type': 'seal', 'r': [0.872, 0.832, 0.03, 0.036], 'k': '極', 'label': 'Censor’s seal', 'text': '極, kiwame.', 'conf': 'documented', 'src': ['cma-1985-335']},
          {'id': 'pub', 'type': 'pub', 'r': [0.872, 0.868, 0.04, 0.08], 'k': '両国 加賀や', 'label': 'Publisher’s mark', 'text': 'Kagaya of Ryōgoku.', 'conf': 'documented', 'src': ['cma-1985-335']},
          {'id': 'sig', 'type': 'sig', 'r': [0.925, 0.805, 0.055, 0.16], 'k': '一勇斎国芳画', 'label': 'Signature', 'text': 'Ichiyūsai Kuniyoshi ga.', 'conf': 'documented', 'src': ['cma-1985-335']}])

pr('carp', src='desk/cma-1943-3', title='Carp Swimming by Water Weeds', maker='Katsushika Hokusai', date='1831', year=1831,
   holder='Cleveland Museum of Art', acc='1943.3', lic='CC0', url='https://clevelandart.org/art/1943.3', kind='fan print',
   band='kiwame', crop=[0.86, 0.5, 0.1, 0.13],
   marks=[{'id': 'sig', 'type': 'sig', 'r': [0.095, 0.33, 0.05, 0.195], 'k': '北斎改為一筆', 'label': 'Signature', 'text': 'Hokusai aratame Iitsu hitsu: “painted by Iitsu, who was Hokusai”. Here 改 means a change of name.', 'conf': 'documented', 'src': ['cma-1943-3', 'vjp-seals'], 'gloss': 'aratame-sig'},
          {'id': 'seal', 'type': 'seal', 'r': [0.886, 0.526, 0.036, 0.04], 'k': '極', 'label': 'Censor’s seal', 'text': '極, kiwame: the round seal at the right is the censor’s.', 'conf': 'documented', 'src': ['cma-1943-3']}])

pr('odawara', src='desk/cma-1985-336', title='Odawara: Minamoto no Yoritomo Visits the Daughter of Itō Nyūdō (Fifty-three Pairings for the Tōkaidō)', maker='Utagawa Kuniyoshi; publisher Enshūya Matabei', date='mid-1840s', year=1845,
   holder='Cleveland Museum of Art', acc='1985.336', lic='CC0', url='https://clevelandart.org/art/1985.336', kind='history',
   band='nanushi', crop=[0.02, 0.76, 0.16, 0.19],
   marks=[{'id': 'seal', 'type': 'seal', 'r': [0.11, 0.77, 0.045, 0.045], 'k': '村', 'label': 'Censor’s seal', 'text': 'One name seal, read by the museum as Mura: a ward headman’s seal. One seal alone points to 1843–1847.', 'conf': 'documented', 'src': ['cma-1985-336', 'jaanus-aratame'], 'words': ['w-mura', 'w-1843'], 'gloss': 'nanushi'},
          {'id': 'sig', 'type': 'sig', 'r': [0.112, 0.812, 0.062, 0.088], 'k': '一勇斎国芳画', 'label': 'Signature', 'text': 'Ichiyūsai Kuniyoshi ga.', 'conf': 'documented', 'src': ['cma-1985-336'], 'words': ['w-kuniyoshi'], 'gloss': 'ga'},
          {'id': 'aseal', 'type': 'other', 'r': [0.1, 0.895, 0.07, 0.05], 'k': '', 'label': 'Artist’s seal', 'text': 'Kuniyoshi’s paulownia seal: the designer’s own mark, not the censor’s.', 'conf': 'documented', 'src': ['cma-1985-336'], 'words': ['w-paulownia']},
          {'id': 'pub', 'type': 'pub', 'r': [0.02, 0.86, 0.06, 0.075], 'k': '堀弐 遠又', 'label': 'Publisher’s mark', 'text': 'Enmata, of Horie-chō 2-chōme: the publisher Enshūya Matabei.', 'conf': 'documented', 'src': ['cma-1985-336'], 'words': ['w-enmata']},
          {'id': 'series', 'type': 'series', 'r': [0.66, 0.045, 0.28, 0.27], 'k': '東海道五十三対', 'label': 'Series title', 'text': 'Tōkaidō gojūsan tsui, Fifty-three Pairings for the Tōkaidō.', 'conf': 'documented', 'src': ['cma-1985-336'], 'words': ['w-pairings']}],
   answer={'designer': 'w-kuniyoshi', 'publisher': 'w-enmata', 'examined': 'w-mura', 'date': 'w-1843'})

pr('gishi', src='gishi', title='Ōtaka Gengo Tadao (Biographies of Loyal and Righteous Samurai, Seichū gishi den)', maker='Utagawa Kuniyoshi', date='1847–48 (series); Commons record: c. 1850', short='1847–48', year=1847.6,
   holder='British Museum, via Wikimedia Commons', acc='1906,1220,0.1163', lic='Public domain', url=SRC['bm-gishi']['u'], kind='warrior',
   band='nanushi', crop=[0.14, 0.68, 0.19, 0.24],
   marks=[{'id': 'seal', 'type': 'seal', 'r': [0.163, 0.693, 0.08, 0.024], 'k': '', 'label': 'Censors’ seals', 'text': 'Two round name seals of ward headmen: the pair used from 1847. Seen on the sheet; not read here.', 'conf': 'documented', 'src': ['jaanus-aratame']},
          {'id': 'sig', 'type': 'sig', 'r': [0.185, 0.72, 0.06, 0.13], 'k': '一勇斎国芳画', 'label': 'Signature', 'text': 'Ichiyūsai Kuniyoshi ga.', 'conf': 'documented', 'src': ['bm-gishi']},
          {'id': 'series', 'type': 'series', 'r': [0.865, 0.03, 0.085, 0.22], 'k': '誠忠義士伝', 'label': 'Series title', 'text': 'Seichū gishi den, Biographies of Loyal and Righteous Samurai.', 'conf': 'documented', 'src': ['bm-gishi']}])

pr('seki', src='desk/cma-1930-186', title='Seki (The Fifty-three Stations of the Tōkaidō)', maker='Utagawa Hiroshige; publisher Maruya Seibei', date='c. 1848–49', year=1848.5,
   holder='Cleveland Museum of Art', acc='1930.186', lic='CC0', url='https://clevelandart.org/art/1930.186', kind='landscape',
   band='nanushi', crop=[0.84, 0.15, 0.12, 0.13],
   marks=[{'id': 'seal', 'type': 'seal', 'r': [0.856, 0.17, 0.035, 0.085], 'k': '', 'label': 'Censors’ seals', 'text': 'Two name seals, read by the museum as Mera and Watanabe: two ward headmen, the pair used from 1847.', 'conf': 'documented', 'src': ['cma-1930-186', 'jaanus-aratame'], 'words': ['w-mera', 'w-1847'], 'gloss': 'nanushi'},
          {'id': 'sig', 'type': 'sig', 'r': [0.062, 0.43, 0.04, 0.165], 'k': '広重画', 'label': 'Signature', 'text': 'Hiroshige ga.', 'conf': 'documented', 'src': ['cma-1930-186'], 'words': ['w-hiroshige'], 'gloss': 'ga'},
          {'id': 'aseal', 'type': 'other', 'r': [0.052, 0.588, 0.066, 0.066], 'k': '', 'label': 'Artist’s seal', 'text': 'Hiroshige’s red seal, read by the museum as Hiro.', 'conf': 'documented', 'src': ['cma-1930-186'], 'words': ['w-hiro']},
          {'id': 'series', 'type': 'series', 'r': [0.898, 0.115, 0.045, 0.25], 'k': '東海道 四十八', 'label': 'Series cartouche', 'text': 'Tōkaidō, number 48.', 'conf': 'documented', 'src': ['cma-1930-186'], 'words': ['w-tokaido48']},
          {'id': 'pub', 'type': 'pub', 'r': [0.942, 0.76, 0.05, 0.125], 'k': '芝神明前 丸清板', 'label': 'Publisher’s cartouche', 'text': 'Shiba Shinmei-mae, Marusei han: the block of Maruya Seibei, in front of the Shinmei shrine at Shiba.', 'conf': 'documented', 'src': ['cma-1930-186'], 'words': ['w-marusei'], 'gloss': 'han'}],
   answer={'designer': 'w-hiroshige', 'publisher': 'w-marusei', 'examined': 'w-mera', 'date': 'w-1847'})

pr('actors1850', src='desk/aic-92260', title='Ichikawa Ebizō V as Goshōgun Kanki and Ichikawa Danjūrō VIII as Watōnai Sankan, Nakamura Theatre, fifth month 1850', maker='Utagawa Kunisada I (Toyokuni III)', date='1850', year=1850.4,
   holder='Art Institute of Chicago', acc='1926.2148', lic='Public domain', url=SRC['aic-92260']['u'], kind='actor',
   band='nanushi', crop=[0.0, 0.3, 0.14, 0.24],
   marks=[{'id': 'seal', 'type': 'seal', 'r': [0.018, 0.318, 0.1, 0.04], 'k': '', 'label': 'Censors’ seals', 'text': 'Two round name seals of ward headmen. Seen on the sheet; they agree with the museum’s date, 1850. Not read here.', 'conf': 'documented', 'src': ['jaanus-aratame', 'aic-92260']},
          {'id': 'sig', 'type': 'sig', 'r': [0.022, 0.352, 0.072, 0.125], 'k': '豊国画', 'label': 'Signature', 'text': 'Toyokuni ga: Kunisada, who signed as Toyokuni from 1844.', 'conf': 'probable', 'src': ['aic-92260']},
          {'id': 'role1', 'type': 'title', 'r': [0.172, 0.142, 0.062, 0.182], 'k': '和藤内三官', 'label': 'Role cartouche', 'text': 'Watōnai Sankan: a role, not an actor’s name.', 'conf': 'documented', 'src': ['aic-92260']},
          {'id': 'role2', 'type': 'title', 'r': [0.838, 0.073, 0.06, 0.188], 'k': '五将軍甘輝', 'label': 'Role cartouche', 'text': 'Goshōgun Kanki: another role. The actors’ names appear nowhere on the sheet.', 'conf': 'documented', 'src': ['aic-92260']}])

pr('cat', src='cat', title='Scene from a Ghost Story: The Okazaki Cat Demon', maker='Utagawa Kuniyoshi', date='ca. 1850', year=1850,
   holder='The Metropolitan Museum of Art', acc='JP1563', lic='CC0', url=SRC['met-cat']['u'], kind='ghost',
   band='nanushi', crop=[0.02, 0.75, 0.12, 0.2],
   marks=[{'id': 'seal', 'type': 'seal', 'r': [0.028, 0.768, 0.05, 0.034], 'k': '', 'label': 'Censors’ seals', 'text': 'Two touching name seals of ward headmen, on each sheet. Seen on the sheet; they agree with the Met’s date. Not read here.', 'conf': 'documented', 'src': ['jaanus-aratame', 'met-cat']},
          {'id': 'seal2', 'type': 'seal', 'r': [0.9, 0.752, 0.05, 0.032], 'k': '', 'label': 'Censors’ seals', 'text': 'The same pair on the right-hand sheet.', 'conf': 'documented', 'src': ['met-cat']},
          {'id': 'sig', 'type': 'sig', 'r': [0.032, 0.8, 0.04, 0.115], 'k': '一勇斎国芳画', 'label': 'Signature', 'text': 'Ichiyūsai Kuniyoshi ga.', 'conf': 'documented', 'src': ['met-cat']}])

pr('hotohoto', src='desk/cma-1985-311', title='Hotohoto Festival at Izumo Grand Shrine (Famous Places in the Sixty-odd Provinces)', maker='Utagawa Hiroshige; publisher Echimuraya Heisuke', date='1853', year=1853.5,
   holder='Cleveland Museum of Art', acc='1985.311', lic='CC0', url='https://clevelandart.org/art/1985.311', kind='landscape',
   band='aratame', crop=[0.84, 0.0, 0.1, 0.07],
   marks=[{'id': 'seal', 'type': 'seal', 'r': [0.866, 0.01, 0.054, 0.04], 'k': '改', 'label': 'Censor’s seal', 'text': '改, aratame: examined. The single seal that replaced the headmen’s names in 1853.', 'conf': 'documented', 'src': ['cma-1985-311', 'jaanus-aratame'], 'words': ['w-aratame', 'w-1853'], 'gloss': 'aratame'},
          {'id': 'sig', 'type': 'sig', 'r': [0.06, 0.73, 0.07, 0.152], 'k': '広重筆', 'label': 'Signature', 'text': 'Hiroshige hitsu, “painted by Hiroshige”.', 'conf': 'documented', 'src': ['cma-1985-311'], 'words': ['w-hiroshige'], 'gloss': 'ga'},
          {'id': 'pub', 'type': 'pub', 'r': [0.012, 0.78, 0.04, 0.085], 'k': '越平', 'label': 'Publisher’s seal', 'text': 'Koshihei: the publisher Echimuraya Heisuke.', 'conf': 'documented', 'src': ['cma-1985-311'], 'words': ['w-koshihei']},
          {'id': 'carver', 'type': 'carver', 'r': [0.012, 0.866, 0.04, 0.085], 'k': '彫', 'label': 'Carver’s cartouche', 'text': 'Hori Sennosuke: the carver, named for once.', 'conf': 'documented', 'src': ['cma-1985-311'], 'words': ['w-sennosuke'], 'gloss': 'hori'},
          {'id': 'series', 'type': 'series', 'r': [0.862, 0.065, 0.058, 0.2], 'k': '六十余州名所図会', 'label': 'Series title', 'text': 'Rokujūyoshū meisho zue, Famous Places in the Sixty-odd Provinces.', 'conf': 'documented', 'src': ['cma-1985-311'], 'words': ['w-provinces']}],
   answer={'designer': 'w-hiroshige', 'publisher': 'w-koshihei', 'examined': 'w-aratame', 'date': 'w-1853'})

pr('shower', src='shower', title='Sudden Shower over Shin-Ōhashi Bridge and Atake (One Hundred Famous Views of Edo)', maker='Utagawa Hiroshige; publisher Uoya Eikichi', date='1857', year=1857.7,
   holder='The Metropolitan Museum of Art', acc='JP2522', lic='CC0', url=SRC['met-shower']['u'], kind='landscape',
   band='aratame', crop=[0.78, 0.0, 0.2, 0.1],
   marks=[{'id': 'seal', 'type': 'seal', 'r': [0.804, 0.007, 0.082, 0.04], 'k': '改 · 巳九', 'label': 'Two seals', 'text': 'The round seal reads 改, aratame, “examined”. Beside it 巳九: the Snake year, ninth month. That is the ninth month of 1857.', 'conf': 'documented', 'src': ['cma-1921-318', 'jaanus-aratame'], 'words': ['w-aratame', 'w-1857'], 'gloss': 'aratame', 'gloss2': 'date'},
          {'id': 'series', 'type': 'series', 'r': [0.82, 0.066, 0.064, 0.166], 'k': '名所江戸百景', 'label': 'Series title', 'text': 'Meisho Edo hyakkei, One Hundred Famous Views of Edo: the series’ red brand, the same on every sheet.', 'conf': 'documented', 'src': ['hiroshige-uk'], 'words': ['w-hundred']},
          {'id': 'title', 'type': 'title', 'r': [0.698, 0.078, 0.126, 0.098], 'k': '大はしあたけの夕立', 'label': 'Sheet title', 'text': 'Ōhashi Atake no yūdachi, Sudden shower at the great bridge and Atake.', 'conf': 'documented', 'src': ['hiroshige-uk'], 'words': ['w-atake']},
          {'id': 'sig', 'type': 'sig', 'r': [0.12, 0.762, 0.058, 0.142], 'k': '広重画', 'label': 'Signature', 'text': 'Hiroshige ga, “drawn by Hiroshige”. The only maker named on the sheet.', 'conf': 'documented', 'src': ['met-shower'], 'words': ['w-hiroshige'], 'gloss': 'ga'},
          {'id': 'pub', 'type': 'pub', 'r': [0.04, 0.845, 0.05, 0.055], 'k': '下谷 魚栄', 'label': 'Publisher’s mark', 'text': 'Shitaya, Uoei: the publisher Uoya Eikichi of Shitaya. He paid for the blocks, the paper and the labour, and answered to the censor.', 'conf': 'documented', 'src': ['cma-1921-318', 'hiroshige-uk'], 'words': ['w-uoei']}],
   answer={'designer': 'w-hiroshige', 'publisher': 'w-uoei', 'examined': 'w-aratame', 'date': 'w-1857'})

pr('plum', src='plum', title='Plum Garden at Kameido (One Hundred Famous Views of Edo)', maker='Utagawa Hiroshige; publisher Uoya Eikichi', date='1857', year=1857.9,
   holder='Art Institute of Chicago', acc='1925.3752', lic='Public domain', url=SRC['aic-plum']['u'], kind='landscape',
   band='aratame', crop=[0.82, 0.0, 0.16, 0.08],
   marks=[{'id': 'seal', 'type': 'seal', 'r': [0.843, 0.018, 0.095, 0.042], 'k': '改 · 巳', 'label': 'Two seals', 'text': '改, aratame, and an oval date seal for the Snake year, 巳: 1857, as the museum dates it. The month reads as eleven (probable).', 'conf': 'probable', 'src': ['aic-plum', 'jaanus-aratame']}])

pr('namazu', src='namazu', title='Namazu-e: Kashima Controls the Catfish with his Sword', maker='Unknown', date='1855', year=1855.9,
   holder='Wikimedia Commons (Namazu-e collection, International Research Center for Japanese Studies)', acc='File:Namazu-e - Kashima controls namazu.jpg', lic='Public domain', url='https://commons.wikimedia.org/wiki/File:Namazu-e_-_Kashima_controls_namazu.jpg', kind='news',
   band='none', crop=[0.0, 0.0, 0.3, 0.2], marks=[])

# ---------------------------------------------------------------- word bank
WORDS = {
    'w-utamaro': 'Utamaro', 'w-kunisada': 'Kunisada', 'w-kuniyoshi': 'Kuniyoshi', 'w-hiroshige': 'Hiroshige',
    'w-tsutaya': 'Tsutaya Jūzaburō', 'w-kawaguchi': 'Kawaguchiya Uhei', 'w-kagaya': 'Kagaya Kichibei', 'w-enmata': 'Enshūya Matabei',
    'w-marusei': 'Maruya Seibei', 'w-koshihei': 'Echimuraya Heisuke', 'w-uoei': 'Uoya Eikichi',
    'w-kiwame': 'under the kiwame seal', 'w-mura': 'by one ward headman, Mura', 'w-mera': 'by two ward headmen, Mera and Watanabe', 'w-aratame': 'under the aratame seal',
    'w-1790': 'between 1790 and 1842', 'w-1843': 'between 1843 and 1847', 'w-1847': 'between 1847 and 1852', 'w-1853': 'between 1853 and 1875', 'w-1857': 'in the ninth month of 1857',
    'w-physiognomy': 'Ten Aspects of the Physiognomy of Women', 'w-kanshojo': 'Kan Shōjō (a role)', 'w-chojun': 'Rōri Hakuchō Chōjun', 'w-pairings': 'Fifty-three Pairings for the Tōkaidō',
    'w-paulownia': 'paulownia (artist’s seal)', 'w-hiro': 'Hiro (artist’s seal)', 'w-tokaido48': 'Tōkaidō no. 48', 'w-sennosuke': 'Hori Sennosuke (carver)', 'w-provinces': 'the Sixty-odd Provinces',
    'w-hundred': 'One Hundred Famous Views of Edo', 'w-atake': 'Sudden shower at Atake',
}
WORDKIND = {'w-utamaro': 'designer', 'w-kunisada': 'designer', 'w-kuniyoshi': 'designer', 'w-hiroshige': 'designer',
            'w-tsutaya': 'publisher', 'w-kawaguchi': 'publisher', 'w-kagaya': 'publisher', 'w-enmata': 'publisher', 'w-marusei': 'publisher', 'w-koshihei': 'publisher', 'w-uoei': 'publisher',
            'w-kiwame': 'examined', 'w-mura': 'examined', 'w-mera': 'examined', 'w-aratame': 'examined',
            'w-1790': 'date', 'w-1843': 'date', 'w-1847': 'date', 'w-1853': 'date', 'w-1857': 'date'}

# ---------------------------------------------------------------- Seal Timeline
TIMELINE = {
    'cards': [
        {'print': 'harunobu', 'hint': 'Search the margins for a small round seal near the signature. Is there one at all?',
         'evidence': 'No censor’s seal anywhere. The red seal at the left is not a censor’s: there were none before 1790.',
         'actual': 'Harunobu, 1765: a full-colour sheet from the year of the poets’ calendar prints, a generation before any examiner.', 'conf': 'documented', 'src': ['met-harunobu', 'vjp-seals']},
        {'print': 'sharaku', 'hint': 'Look under the signature: one character in a small circle.',
         'evidence': '極, kiwame, in a circle under the signature, with Tsutaya’s mark below it.',
         'actual': 'Tsutaya issued Sharaku’s actor portraits from the fifth month of 1794, three years after his fine. Actors were still a legal subject.', 'conf': 'documented', 'src': ['met-sharaku', 'wiki-tsutaya']},
        {'print': 'utamaro', 'hint': 'Below the signature, above the ivy leaf: a small round seal.',
         'evidence': '極, kiwame, between Utamaro’s signature and Tsutaya’s ivy leaf.',
         'actual': 'Cleveland records “Censorship Seal: kiwame” and dates the sheet about 1793. From 1800 large heads of women like this one were banned.', 'conf': 'documented', 'src': ['cma-utamaro', 'vjp-seals']},
        {'print': 'danjuro', 'hint': 'Above the publisher’s box, beside the signature: one round seal.',
         'evidence': '極, kiwame, above the publisher’s mark, Kawaguchi.',
         'actual': 'Kunisada’s Danjūrō VII, 1814. In 1842 single sheets of actors would be banned; this one was legal.', 'conf': 'documented', 'src': ['cma-1985-333']},
        {'print': 'carp', 'hint': 'The signature says 改, but is it a seal? Find the small round seal at the right.',
         'evidence': 'The 改 in the signature means Hokusai was changing his name to Iitsu. The censor’s seal is the round 極 at the right.',
         'actual': 'Cleveland dates the fan print 1831 and reads its seal as kiwame. A word in a signature is not a censor’s mark.', 'conf': 'documented', 'src': ['cma-1943-3', 'vjp-seals']},
        {'print': 'odawara', 'hint': 'One round seal above the signature. How many? One or two?',
         'evidence': 'One name seal, read by the museum as Mura: a ward headman’s seal, used alone from 1843 to 1847.',
         'actual': 'Kuniyoshi, mid-1840s: a story from history, the kind of subject the 1842 order steered the trade towards.', 'conf': 'documented', 'src': ['cma-1985-336', 'jaanus-aratame']},
        {'print': 'gishi', 'hint': 'Above the signature: two small round seals side by side.',
         'evidence': 'Two name seals of ward headmen: the pair used from 1847.',
         'actual': 'The loyal retainers of 1847. The censor Murata Sahei approved the series; the Fujiokaya diary records 8,000 sets sold by the third month of 1848.', 'conf': 'documented', 'src': ['fujiokaya', 'kato-1847', 'jaanus-aratame']},
        {'print': 'seki', 'hint': 'Left of the red series cartouche: two small seals, one above the other.',
         'evidence': 'Two name seals, read by the museum as Mera and Watanabe.',
         'actual': 'Hiroshige’s Seki, dated by the museum about 1848–49: the seals put it after 1847, with no date seal yet.', 'conf': 'documented', 'src': ['cma-1930-186', 'jaanus-aratame']},
        {'print': 'actors1850', 'hint': 'Top of the left margin, above the signature: two round seals.',
         'evidence': 'Two ward headmen’s seals. The cartouches name roles, never the actors.',
         'actual': 'Actor prints were banned in 1842. By 1847 they were back without names, and the magistrate let them pass. This sheet is dated 1850.', 'conf': 'documented', 'src': ['aic-92260', 'kato-1847']},
        {'print': 'hotohoto', 'hint': 'Top right, above the frame: one round seal with one character.',
         'evidence': '改, aratame: one seal and no names.',
         'actual': 'Cleveland dates it 1853, the year the single aratame seal replaced the headmen’s names. The carver, Hori Sennosuke, is named in the margin.', 'conf': 'documented', 'src': ['cma-1985-311', 'jaanus-aratame']},
        {'print': 'shower', 'hint': 'Top right, above the red cartouche: two seals, round and square-ish.',
         'evidence': '改, aratame, and a date seal 巳九: Snake year, ninth month.',
         'actual': 'The ninth month of 1857. Uoya Eikichi published it; Hiroshige died the next year.', 'conf': 'documented', 'src': ['cma-1921-318', 'jaanus-aratame', 'hiroshige-uk']},
        {'print': 'namazu', 'twist': True, 'hint': 'Search every margin. Do you find a censor’s seal?',
         'evidence': 'No seal at all. By its margin alone it belongs before 1790.',
         'actual': 'It is from November 1855, days after the great Edo earthquake. Catfish pictures were sold within days, mostly unsigned and uncensored: outside the law, not before it.', 'conf': 'documented', 'src': ['smits-namazu']},
    ],
    'stage': ['sharaku', 'odawara', 'gishi', 'shower'],
    'what': 'From 1790 to 1875 the state made every legal print carry its censor’s mark. The marks changed three times, so the margin dates the sheet to a band of years. A missing seal means either before 1790 or outside the law.',
}

# ---------------------------------------------------------------- Catalogue Desk
CATALOGUE = {
    'template': ['Designed by ', {'slot': 'designer'}, ', published by ', {'slot': 'publisher'}, ', examined ', {'slot': 'examined'}, ', printed ', {'slot': 'date'}, '.'],
    'slots': {'designer': 'designer', 'publisher': 'publisher', 'examined': 'examined', 'date': 'date'},
    'worked': 'shower',
    'walk': [
        {'mark': 'seal', 'say': 'A curator starts with the seals. The round one reads 改, aratame: examined, the censor’s mark from 1853. The other is a date seal.', 'fill': ['examined', 'date']},
        {'mark': 'sig', 'say': 'The signature: 広重画, Hiroshige ga, “drawn by Hiroshige”. The designer is the only maker named.', 'fill': ['designer']},
        {'mark': 'pub', 'say': 'The publisher’s mark: 下谷 魚栄, Shitaya, Uoei. That is Uoya Eikichi, who paid for everything and answered to the censor.', 'fill': ['publisher']},
        {'mark': 'series', 'say': 'The red cartouche names the series, One Hundred Famous Views of Edo. Useful, but it does not date the sheet. Leave it in the bank.', 'fill': []},
    ],
    'sets': [
        {'id': 'one', 'label': 'Set I', 'support': 'full', 'prints': ['utamaro', 'danjuro', 'seki']},
        {'id': 'two', 'label': 'Set II', 'support': 'faded', 'prints': ['odawara', 'suikoden', 'hotohoto']},
    ],
    'what': 'A catalogue entry is built from the marks on the sheet: the signature names the designer, the publisher’s mark names who paid, and the censor’s seals date it. The carver and printer are almost never there.',
}

# ---------------------------------------------------------------- Censor's Desk
CENSOR = {
    'note': 'Simulation. You play an inspector; the proofs are real prints, the rules and outcomes are from the record. No score, no clock.',
    'rules': [
        {'id': 'r1790', 'from': 1790, 'label': '1790 · Kansei',
         'role': 'Guild examiner (gyōji)', 'roleConf': 'documented',
         'lines': ['Every new design comes to you before it is carved for sale. You are one of the examiners chosen in rotation from the publishers’ own guild.',
                   'Approve with the round seal 極, kiwame, cut into the key block.',
                   'Nothing on current events. Nothing gorgeous or extravagant. No erotica.',
                   'The law names three people for every sheet: the designer, the writer and the publisher.'],
         'conf': 'documented', 'src': ['vjp-seals', 'vjp-sumptuary', 'jaanus-aratame']},
        {'id': 'r1842', 'from': 1842.5, 'label': '1842 · Tenpō',
         'role': 'Examiners under the town magistrate’s orders', 'roleConf': 'probable',
         'contentNote': 'Content note: this order names courtesans and geisha. No pictures of them appear on this desk.',
         'lines': ['Sixth month: single sheets of kabuki actors, courtesans and geisha “concern public morals”. Do not pass them.',
                   'Subjects should be loyalty, filial piety, chastity and children’s moral instruction.',
                   'Eleventh month: single sheets and fan prints, nothing above sixteen mon.',
                   'Printings limited to seven or eight (probable).'],
         'conf': 'documented', 'src': ['kato-tenpo']},
        {'id': 'r1843', 'from': 1843, 'label': '1843 · the headmen',
         'role': 'Ward headman appointed to examine prints (nanushi)', 'roleConf': 'documented',
         'lines': ['The guild no longer judges itself. Ward headmen examine prints, each with a seal of his own name.',
                   'One seal at first; two seals from 1847; two with a date seal from 1852.',
                   'The 1842 subjects still apply.'],
         'conf': 'documented', 'src': ['jaanus-aratame', 'kato-1847']},
        {'id': 'r1853', 'from': 1853, 'label': '1853 · aratame',
         'role': 'Examiner (the record used here does not name the office)', 'roleConf': 'probable',
         'lines': ['The headmen’s names disappear from the sheet.',
                   'Approve with one seal, 改, aratame, “examined”, usually beside a date seal: the zodiac year and the month.'],
         'conf': 'documented', 'src': ['jaanus-aratame']},
    ],
    'stream': [
        {'type': 'notice', 'when': '1791', 'year': 1791, 'title': 'Three books judged offensive',
         'text': 'Santō Kyōden is manacled for fifty days. His publisher, Tsutaya Jūzaburō, is fined half of everything he owns. The examiners who passed the books are exiled from Edo.',
         'conf': 'documented', 'src': ['vjp-sumptuary']},
        {'type': 'proof', 'print': 'sharaku', 'when': 'Fifth month, 1794', 'year': 1794.4, 'publisher': 'Tsutaya Jūzaburō', 'subject': 'A kabuki actor in a role, by an unknown designer signing Sharaku.',
         'rule': 'r1790', 'expect': 'stamp', 'why': 'Actors were not forbidden in 1794.',
         'actual': 'The sheet carries 極, kiwame: the examiners passed it. Tsutaya, fined three years before, published about 140 Sharaku designs in ten months.', 'conf': 'documented', 'src': ['met-sharaku', 'wiki-tsutaya']},
        {'type': 'notice', 'when': '1804', 'year': 1804, 'title': 'A print of Hideyoshi',
         'text': 'Kitagawa Utamaro is manacled for fifty days for a print of the warlord Toyotomi Hideyoshi, a subject the state treated as its own.',
         'conf': 'documented', 'src': ['wiki-utamaro']},
        {'type': 'proof', 'print': 'danjuro', 'when': '1814', 'year': 1814, 'publisher': 'Kawaguchiya Uhei', 'subject': 'The actor Ichikawa Danjūrō VII as Kan Shōjō, by Kunisada.',
         'rule': 'r1790', 'expect': 'stamp', 'why': 'Actors were a legal subject until 1842.',
         'actual': 'Approved: the sheet carries 極, kiwame, above the publisher’s mark.', 'conf': 'documented', 'src': ['cma-1985-333']},
        {'type': 'proof', 'print': 'suikoden', 'when': 'Late 1820s', 'year': 1828, 'publisher': 'Kagaya Kichibei', 'subject': 'A hero of the Chinese novel Shuihu zhuan, tattooed, fighting in the water, by Kuniyoshi.',
         'rule': 'r1790', 'expect': 'stamp', 'why': 'Warriors from a novel broke no rule.',
         'actual': 'Approved: 極, kiwame. Kuniyoshi’s warriors from this novel made his name.', 'conf': 'documented', 'src': ['cma-1980-85', 'wiki-kuniyoshi']},
        {'type': 'proof', 'print': 'carp', 'when': '1831', 'year': 1831, 'publisher': '(not recorded)', 'subject': 'Two carp among water weeds: a fan print by Hokusai.',
         'rule': 'r1790', 'expect': 'stamp', 'why': 'Nothing in the rules touched fish.',
         'actual': 'Approved: 極, kiwame. The 改 in Hokusai’s signature is a change of name, not a censor’s word.', 'conf': 'documented', 'src': ['cma-1943-3', 'vjp-seals']},
        {'type': 'proof', 'print': 'omori', 'when': 'Early 1830s', 'year': 1832, 'publisher': 'Kagaya Kichibei', 'subject': 'Two people in a boat among the stakes off Ōmori, a famous place on the bay, by Kuniyoshi.',
         'rule': 'r1790', 'expect': 'stamp', 'why': 'A famous place broke no rule.',
         'actual': 'Approved: 極, kiwame, above the publisher’s mark.', 'conf': 'documented', 'src': ['cma-1985-335']},
        {'type': 'proof', 'print': 'odawara', 'when': 'Mid-1840s', 'year': 1845, 'publisher': 'Enshūya Matabei', 'subject': 'Minamoto no Yoritomo visits the daughter of Itō Nyūdō: a story from history, paired with a Tōkaidō station, by Kuniyoshi.',
         'rule': 'r1843', 'expect': 'stamp', 'why': 'History was the kind of subject the 1842 order wanted.',
         'actual': 'Approved with one headman’s name seal, read by the museum as Mura.', 'conf': 'documented', 'src': ['cma-1985-336']},
        {'type': 'notice', 'when': 'Second month, 1847', 'year': 1847.1, 'title': 'A report on the shops',
         'text': 'The town magistrate’s officers report that six or seven tenths of what sells are actor pictures, without the actors’ names. In the fifth month the magistrate lets nameless actor pictures pass, but not pictures of new plays.',
         'conf': 'documented', 'src': ['kato-1847']},
        {'type': 'notice', 'when': 'Fourth month, 1847', 'year': 1847.3, 'title': 'A sheet that never came to the desk',
         'text': 'A print of the theft of a temple statue’s eye sells without examination. Seven publishers, three wholesalers and the retailers are each fined three kan. The headman in charge of prints was Murata Sahei.',
         'conf': 'documented', 'src': ['kato-1847']},
        {'type': 'proof', 'print': 'gishi', 'when': '1847', 'year': 1847.5, 'publisher': 'not read here', 'subject': 'One of the forty-seven loyal retainers, sheet by sheet, with his biography, by Kuniyoshi.',
         'rule': 'r1843', 'expect': 'stamp', 'why': 'Loyalty was the subject the 1842 order asked for.',
         'actual': 'Approved. The censor Murata Sahei passed the series; the Fujiokaya diary records 8,000 sets, 408,000 sheets, sold by the third month of 1848.', 'conf': 'documented', 'src': ['fujiokaya', 'kato-1847']},
        {'type': 'proof', 'print': 'seki', 'when': 'About 1848', 'year': 1848.5, 'publisher': 'Maruya Seibei', 'subject': 'Snow at Seki, a station on the Tōkaidō, by Hiroshige.',
         'rule': 'r1843', 'expect': 'stamp', 'why': 'A landscape broke no rule.',
         'actual': 'Approved with two name seals, read by the museum as Mera and Watanabe.', 'conf': 'documented', 'src': ['cma-1930-186']},
        {'type': 'proof', 'print': 'actors1850', 'when': 'Fifth month, 1850', 'year': 1850.4, 'publisher': 'not read here', 'subject': 'Two kabuki roles from the play Kokusenya kassen, drawn as two star actors. The cartouches name the roles only.',
         'rule': 'r1843', 'expect': 'return', 'why': 'By the letter of the 1842 order, single sheets of actors were forbidden.',
         'actual': 'Approved: two headmen’s seals. Since 1847 the magistrate had let actor pictures pass if they carried no names. The rule-book said one thing; the desk did another.', 'conf': 'documented', 'src': ['aic-92260', 'kato-1847']},
        {'type': 'proof', 'print': 'cat', 'when': 'About 1850', 'year': 1850.5, 'publisher': 'not read here', 'subject': 'A ghost story: the monster cat of Okazaki, from a play, by Kuniyoshi.',
         'rule': 'r1843', 'expect': 'stamp', 'why': 'The order named actors, courtesans and geisha. It did not name ghosts or cats.',
         'actual': 'Approved: two headmen’s seals on each sheet. The figures come from a play, drawn with actors’ faces (probable).', 'conf': 'probable', 'src': ['met-cat', 'jaanus-aratame']},
        {'type': 'proof', 'print': 'hotohoto', 'when': '1853', 'year': 1853.5, 'publisher': 'Echimuraya Heisuke', 'subject': 'A festival at the Izumo shrine, from Famous Places in the Sixty-odd Provinces, by Hiroshige.',
         'rule': 'r1853', 'expect': 'stamp', 'why': 'A famous place broke no rule.',
         'actual': 'Approved with the new single seal, 改, aratame.', 'conf': 'documented', 'src': ['cma-1985-311']},
        {'type': 'notice', 'when': 'November 1855', 'year': 1855.9, 'print': 'namazu', 'title': 'Pictures that never came to any desk',
         'text': 'Within days of the great earthquake the shops sell pictures of the catfish said to cause earthquakes. Most are unsigned, and uncensored.',
         'conf': 'documented', 'src': ['smits-namazu']},
        {'type': 'proof', 'print': 'shower', 'when': 'Ninth month, 1857', 'year': 1857.7, 'publisher': 'Uoya Eikichi', 'subject': 'A sudden shower over the Shin-Ōhashi bridge, from One Hundred Famous Views of Edo, by Hiroshige.',
         'rule': 'r1853', 'expect': 'stamp', 'why': 'A view of the city broke no rule.',
         'actual': 'Approved: 改, aratame, with the date seal 巳九, Snake year, ninth month.', 'conf': 'documented', 'src': ['cma-1921-318', 'jaanus-aratame']},
    ],
    'stage': ['r1790', 'sharaku', 'gishi', 'actors1850'],
    'what': 'Censorship ran through the publishers before it ran through officials, and the rule-book and the desk did not always agree. Every legal sheet carries the mark of the person who passed it, which is how historians date them now.',
}

def main():
    # sizes
    for p in P.values():
        im = Image.open(PUB / 'img' / f"{p['src']}.webp"); p['w'], p['h'] = im.size
    # sprite of margin crops, tile height 180, width by aspect (capped 260)
    TH, CAP, PAD = 180, 300, 4
    tiles = []
    for p in P.values():
        x, y, w, h = p['crop']
        im = Image.open(PUB / 'img' / f"{p['src']}.webp").convert('RGB')
        W, H = im.size
        c = im.crop((int(x * W), int(y * H), int((x + w) * W), int((y + h) * H)))
        s = TH / c.height
        tw = int(c.width * s)
        if tw > CAP: s = CAP / c.width; tw = CAP
        c = c.resize((tw, max(1, int(c.height * s))), Image.LANCZOS)
        tiles.append((p['id'], c))
    cols, rowW, X, Y, rowH, pos = 0, 1024, 0, 0, 0, {}
    for id, c in tiles:
        if X + c.width > rowW: X, Y = 0, Y + rowH + PAD; rowH = 0
        pos[id] = [X, Y, c.width, c.height]; X += c.width + PAD; rowH = max(rowH, c.height)
    sheet = Image.new('RGB', (rowW, Y + rowH), (241, 234, 219))
    for id, c in tiles: sheet.paste(c, tuple(pos[id][:2]))
    out = PUB / 'img' / 'desk' / 'margins.webp'
    sheet.save(out, 'WEBP', quality=82, method=6)
    for id in pos: P[id]['sprite'] = pos[id]
    data = {'v': 1, 'sheet': {'url': 'img/desk/margins.webp', 'W': sheet.width, 'H': sheet.height},
            'sources': SRC, 'bands': BANDS, 'gloss': GLOSS, 'prints': P,
            'words': [{'id': k, 't': v, 'kind': WORDKIND.get(k, 'other')} for k, v in WORDS.items()],
            'timeline': TIMELINE, 'catalogue': CATALOGUE, 'censor': CENSOR}
    # integrity: every src id exists, every word exists, every print exists
    ids = set(SRC)
    def chk(srcs, where):
        for s in srcs or []:
            assert s in ids, f'missing source {s} in {where}'
    for p in P.values():
        for m in p['marks']:
            chk(m.get('src'), p['id']); [None for w in m.get('words', []) if w in WORDS or (_ for _ in ()).throw(AssertionError(w))]
            for g in ('gloss', 'gloss2'):
                if m.get(g): assert m[g] in GLOSS, m[g]
        for k, w in (p.get('answer') or {}).items(): assert w in WORDS, w
    for c in TIMELINE['cards']: assert c['print'] in P; chk(c['src'], c['print'])
    for s in CENSOR['stream']:
        chk(s['src'], s.get('print') or s['title'])
        if s.get('print'): assert s['print'] in P
    for r in CENSOR['rules']: chk(r['src'], r['id'])
    for b in BANDS: chk(b['src'], b['id'])
    for g in GLOSS.values(): chk(g['src'], g['k'])
    (PUB / 'data').mkdir(exist_ok=True)
    (PUB / 'data' / 'desks.json').write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print('desks.json', (PUB / 'data' / 'desks.json').stat().st_size, 'bytes; sheet', sheet.size, out.stat().st_size, 'bytes')

if __name__ == '__main__':
    main()

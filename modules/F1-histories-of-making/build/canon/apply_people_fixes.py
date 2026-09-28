import csv, os
BASE='/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/f1-scope/'
changes = [
 ('dynasties','DYN004','making_significance',
  "The Eighteenth Dynasty introduced large-scale glassmaking, built Karnak and the Amarna city, and filled royal tombs such as Tutankhamun's.",
  "The Eighteenth Dynasty introduced large-scale glassmaking, greatly expanded the Middle Kingdom temple at Karnak, built the Amarna city, and filled royal tombs such as Tutankhamun's.",
  'https://en.wikipedia.org/wiki/Karnak'),
 ('dynasties','DYN033','making_significance',
  "King Lalibela's reign produced the rock-hewn churches of Lalibela.",
  "Tradition credits King Lalibela (r. c. 1181–1221) with the rock-hewn churches of Lalibela, though archaeologists date some of the complex earlier.",
  'https://www.metmuseum.org/toah/hd/lali/hd_lali.htm'),
 ('dynasties','DYN082','start','1071','1072','https://en.wikipedia.org/wiki/Siege_of_Palermo_(1071%E2%80%931072)'),
 ('dynasties','DYN082','date_note',"Norman conquest of Palermo 1071; kingdom from 1130","Norman siege of Palermo 1071, city taken January 1072; kingdom from 1130",'https://en.wikipedia.org/wiki/Siege_of_Palermo_(1071%E2%80%931072)'),
 ('polities','POL036','making_significance',
  "Mali's rulers funded earthen mosques and scholarship at Timbuktu and Djenné and sent gold across the Mediterranean.",
  "Mali's rulers funded earthen mosques and scholarship at Timbuktu, and Sahelian gold under their control reached Mediterranean markets across the Sahara.",
  'https://en.wikipedia.org/wiki/Djenn%C3%A9'),
 ('polities','POL036','notes',
  "Keïta dynasty is a DYN row. Djinguereber attribution to al-Sahili is traditional.",
  "Keïta dynasty is a DYN row. Djinguereber attribution to al-Sahili is traditional. Djenné was at most an intermittent tributary of Mali (Tarikh al-Sudan says never conquered), so its mosque is not credited to Mali.",
  'https://en.wikipedia.org/wiki/Djenn%C3%A9'),
 ('polities','POL044','making_significance',
  "Teotihuacan housed craft workshops in apartment compounds producing obsidian tools, Thin Orange ware, murals and stone masks.",
  "Teotihuacan housed craft workshops in apartment compounds producing obsidian tools, pottery, murals and stone masks, and distributed Thin Orange ware made in southern Puebla.",
  'https://www.cambridge.org/core/services/aop-cambridge-core/content/view/S0956536100000201'),
 ('polities','POL151','sensitivity','none','human-flow','https://en.wikipedia.org/wiki/Belbaltlag'),
 ('polities','POL073','sensitivity','living-community','human-flow;living-community','https://en.wikipedia.org/wiki/Quilombo_dos_Palmares'),
 ('cultures_horizons','ARC151','start','-1750','-1400','https://sciencedirect.com/science/article/pii/S2352226724000709'),
 ('cultures_horizons','ARC151','date_note','c. 1750–1100 BCE (Lhasa)','early phase at the type site re-dated to c. 1400–1300 cal BCE by 2024 re-excavation (earlier estimates c. 2000–1500 or 1750–1100 BCE); end approximate (Lhasa)','https://sciencedirect.com/science/article/pii/S2352226724000709'),
 ('cultures_horizons','ARC151','making_significance','Settlements near Lhasa with burnished black pottery and some metal.','A Neolithic settlement near Lhasa whose potters made polished, incised and stamped round-based wares.','https://sciencedirect.com/science/article/pii/S2352226724000709'),
 ('cultures_horizons','ARC151','materials_techniques','burnished pottery; copper','burnished pottery; incised and stamped decoration','https://sciencedirect.com/science/article/pii/S2352226724000709'),
 ('cultures_horizons','ARC151','notes','','Copper/metal claim removed: not reported in the 2024 re-excavation (Neolithic assemblage); restore only with a source.','https://sciencedirect.com/science/article/pii/S2352226724000709'),
 ('cultures_horizons','ARC196','making_significance','The earliest known Caribbean islanders, making large blade tools and ground stone.','Among the earliest known settlers of the Greater Antilles, making large flaked-stone blades and, later, ground-stone tools.','https://www.biorxiv.org/content/10.64898/2026.05.12.724636v1.full'),
 ('networks','NET047','start','500','1500','https://researchportalplus.anu.edu.au/en/publications/the-origins-of-the-kula-ring-archaeological-and-maritime-perspect/'),
 ('networks','NET047','date_note','antiquity debated (c.1,000–1,500 years); ongoing','Irwin et al. 2019 place the Ring\'s emergence in the last centuries before European contact (start year approximate; older estimates up to c. 1,500 years); ongoing','https://researchportalplus.anu.edu.au/en/publications/the-origins-of-the-kula-ring-archaeological-and-maritime-perspect/'),
 ('networks','NET047','notes','Check antiquity estimate.','Antiquity checked against Irwin, Shaw and McAlister 2019 (Archaeology in Oceania).','https://researchportalplus.anu.edu.au/en/publications/the-origins-of-the-kula-ring-archaeological-and-maritime-perspect/'),
 ('networks','NET035','sub_regions','AF-GUI;AF-CEN;AF-SOU;AM-CAR;AM-LAT;AM-EWD;EU-BLC;EU-IBE','AF-GUI;AF-CEN;AF-SOU;AF-SWA;AF-MAD;AM-CAR;AM-LAT;AM-EWD;EU-BLC;EU-IBE','https://www.slavevoyages.org/voyage/about'),
]
log=[]
byfile={}
for c in changes: byfile.setdefault(c[0],[]).append(c)
for f,cs in byfile.items():
    p=BASE+f'canon/canon_{f}.csv'
    with open(p,newline='',encoding='utf-8') as fh:
        rd=csv.reader(fh); rows=list(rd)
    hdr=rows[0]; idx={h:i for i,h in enumerate(hdr)}
    for (_,rid,field,old,new,src) in cs:
        hit=[r for r in rows[1:] if r[0]==rid]
        assert len(hit)==1, rid
        r=hit[0]
        assert r[idx[field]]==old, (rid,field,r[idx[field]])
        r[idx[field]]=new
        log.append((rid,field,old,new,src))
    with open(p,'w',newline='',encoding='utf-8') as fh:
        csv.writer(fh,quoting=csv.QUOTE_MINIMAL).writerows(rows)
L=BASE+'REVIEW_LOG_people.md'
new=not os.path.exists(L)
esc=lambda s: s.replace('|','\\|') if s else '(empty)'
with open(L,'a',encoding='utf-8') as fh:
    if new:
        fh.write('# Review log: people/grouping registers (independent fact-check)\n\n| id | field | old | new | source URL |\n|---|---|---|---|---|\n')
    for x in log: fh.write('| '+' | '.join(esc(v) for v in x)+' |\n')
print(len(log),'changes')

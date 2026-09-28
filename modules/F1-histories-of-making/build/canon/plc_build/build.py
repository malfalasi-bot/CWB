import csv, collections, sys
D='/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/plc_build/'
OUT='/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/f1-scope/canon/canon_places.csv'
HDR='id,name,other_names,kind,family,world,sub_regions,start,end,date_note,making_significance,materials_techniques,object_types,functions,defined_by,leaves_out,sensitivity,free_sources,tier,units,confidence,notes'.split(',')
SRC={'MET':'Met Open Access (CC0)','CLE':'Cleveland Museum of Art Open Access (CC0)','WC':'Wikimedia Commons',
'EXC':'open-access excavation reports','SMI':'Smithsonian Open Access (CC0)','RIJ':'Rijksmuseum (CC0)',
'LOC':'Library of Congress (public-domain items)','HABS':'Library of Congress HABS/HAER (public domain)',
'IA':'Internet Archive (public-domain books)','GAL':'Gallica (public-domain items)','BM':'British Museum collection search (link-out)',
'VA':'V&A collections search (link-out)','KOGL':'National Museum of Korea e-museum (KOGL Type 1)','COL':'ColBase (Japan Government Standard Terms)',
'NPM':'National Palace Museum Open Data (licence to verify)','PAS':'Portable Antiquities Scheme (CC BY)','TEP':'Te Papa Collections Online (CC BY where marked)',
'AKL':'Auckland Museum Collections Online (CC BY where marked)','COM':'community-published site (link-out)','PM':'Paris Musées Collections (CC0)',
'LINK':'collection search link-out only','QDL':'Qatar Digital Library (open licence to verify)','CDLI':'CDLI (link-out)',
'IDP':'International Dunhuang Programme (link-out)','OI':'ISAC Chicago collection search (link-out)'}
WORLD={'F1.6','F1.7','F1.8','F1.9','F1.9a','F1.10','F1.11','F1.12','F1.12a','F1.13','THEME'}
SUBS=set('AF-EGY AF-NUB AF-MAG AF-SAH AF-GUI AF-CEN AF-HRN AF-SWA AF-SOU AF-MAD AM-ARC AM-NWC AM-WST AM-EWD AM-MES AM-CAM AM-CAR AM-AND AM-AMZ AM-LAT AS-CHN AS-KOR AS-JPN AS-SAS AS-HIM AS-MSE AS-ISE AS-CEN AS-NTH WA-MES WA-IRN WA-LEV WA-ARB WA-ANA WA-CAU EU-GRR EU-BYZ EU-WCE EU-BLC EU-IBE EU-EER EU-SCA OC-AUS OC-MEL OC-MIC OC-POL GL'.split())
FUN={'shelter','clothing and adornment','food and storage','tools','record and writing','exchange and value','ritual and belief','rule and display','war','play and music','care and access','transport'}
SENS={'none','sacred','funerary','ancestral','Indigenous-community','human-flow','conflict-looting','living-community'}
UNITS=set('F1.2 F1.3 F1.4 F1.5 F1.13 F1.14 F1.15 F1.16 F1.17 F1.18 F1.19 F1.19a F1.20 F1.21 F1.22 F1.22a F1.23 F1.24 F1.26 F1.28 F1.28a F1.29 F1.30'.split())
def lst(x): return [t.strip() for t in x.split(';') if t.strip()]
rows=[];err=[]
for fn in ['a_africa.txt','b_americas.txt','c_asia.txt','d_westasia.txt','e_europe_oceania.txt']:
    for ln,l in enumerate(open(D+fn),1):
        if not l.strip() or l.startswith('#'): continue
        f=[x.strip() for x in l.rstrip('\n').split('|')]
        if len(f)!=19: err.append((fn,ln,len(f),f[0])); continue
        name,oth,world,subs,st,en,dn,sig,mat,obj,fun,dby,lo,sens,src,tier,units,conf,notes=f
        wl=lst(world); ul=lst(units)
        for w in [w for w in wl if w not in WORLD]:
            if w in UNITS:
                wl.remove(w)
                if w not in ul: ul.append(w)
            else: err.append((fn,ln,'world',w))
        if not wl: wl=['THEME']
        world=';'.join(wl); units=';'.join(ul)
        for s in lst(subs):
            if s not in SUBS: err.append((fn,ln,'sub',s))
        for s in lst(fun):
            if s not in FUN: err.append((fn,ln,'fun',s))
        for s in lst(sens):
            if s not in SENS: err.append((fn,ln,'sens',s))
        for s in lst(units):
            if s not in UNITS: err.append((fn,ln,'unit',s))
        if tier not in ('R1','R2','R3'): err.append((fn,ln,'tier',tier))
        if conf not in ('high','medium','low'): err.append((fn,ln,'conf',conf))
        if not obj.startswith('site type:'): err.append((fn,ln,'obj',obj[:20]))
        for v in (st,en):
            if v and not v.lstrip('-').isdigit(): err.append((fn,ln,'date',v))
        if st and en and int(en)<int(st): err.append((fn,ln,'dateorder',st,en))
        srcs=[SRC.get(s,s) for s in lst(src)]
        for s in lst(src):
            if s not in SRC: err.append((fn,ln,'src',s))
        if len(lst(sens))>1 and 'none' in lst(sens): err.append((fn,ln,'sensnone'))
        # human-flow rule check
        low=(sig+' '+lo+' '+notes).lower()
        if any(k in low for k in ['enslav','coerc','indentur','convict','forced','conscript','deport','debt bondage','mita']) and 'human-flow' not in lst(sens):
            err.append((fn,ln,'HF?',name))
        rows.append(dict(zip(HDR,['',name,oth,'place','Place',';'.join(lst(world)),';'.join(lst(subs)),st,en,dn,sig,';'.join(lst(mat)),';'.join(lst(obj)),';'.join(lst(fun)),dby,lo,';'.join(lst(sens)) or 'none',';'.join(srcs),tier,';'.join(lst(units)),conf,notes])))
for e in err: print('ERR',e)
names=collections.Counter(r['name'] for r in rows)
print('dupes',[n for n,c in names.items() if c>1])
for i,r in enumerate(rows,1): r['id']='PLC%03d'%i
if '--write' in sys.argv:
    with open(OUT,'w',newline='',encoding='utf-8') as fh:
        w=csv.DictWriter(fh,fieldnames=HDR,quoting=csv.QUOTE_MINIMAL); w.writeheader(); w.writerows(rows)
print('rows',len(rows))
c=collections.Counter(s for r in rows for s in r['sub_regions'].split(';'))
print('min',min(c[s] for s in SUBS if s!='GL'), sorted(((c[s],s) for s in SUBS if s!='GL'))[:10])
print('missing',[s for s in SUBS if s!='GL' and c[s]==0])
cw=collections.Counter(w for r in rows for w in r['world'].split(';')); print(dict(cw))
print('tiers',collections.Counter(r['tier'] for r in rows),'conf',collections.Counter(r['confidence'] for r in rows))

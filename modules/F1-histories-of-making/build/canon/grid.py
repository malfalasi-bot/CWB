import json,collections
rows=json.load(open('merged.json'))
SUBS="AF-EGY AF-NUB AF-MAG AF-SAH AF-GUI AF-CEN AF-HRN AF-SWA AF-SOU AF-MAD AM-ARC AM-NWC AM-WST AM-EWD AM-MES AM-CAM AM-CAR AM-AND AM-AMZ AM-LAT AS-CHN AS-KOR AS-JPN AS-SAS AS-HIM AS-MSE AS-ISE AS-CEN AS-NTH WA-MES WA-IRN WA-LEV WA-ARB WA-ANA WA-CAU EU-GRR EU-BYZ EU-WCE EU-BLC EU-IBE EU-EER EU-SCA OC-AUS OC-MEL OC-MIC OC-POL".split()
B=[("B01","before 8000 BCE",-10**7,-8000),("B02","8000–4000 BCE",-8000,-4000),("B03","4000–2000 BCE",-4000,-2000),("B04","2000–1000 BCE",-2000,-1000),("B05","1000 BCE–1 CE",-1000,1),("B06","1–500",1,500),("B07","500–1000",500,1000),("B08","1000–1400",1000,1400),("B09","1400–1700",1400,1700),("B10","1700–1900",1700,1900),("B11","1900–now",1900,2027)]
grid={s:{b[0]:[] for b in B} for s in SUBS}
kinds=collections.Counter(); tiers=collections.Counter(); fam=collections.Counter()
for r in rows:
    kinds[r['kind']]+=1; tiers[r['tier']]+=1
    if not r['start'].strip(): continue
    st=int(r['start']); en=int(r['end']) if r['end'].strip() else 2026
    for s in [x.strip() for x in r['sub_regions'].split(';')]:
        if s not in grid: continue
        for code,_,a,b in B:
            if st<b and en>=a: grid[s][code].append(r['id'])
print(kinds); print(tiers)
empty=[(s,c) for s in SUBS for c in grid[s] if not grid[s][c]]
thin=[(s,c,len(grid[s][c])) for s in SUBS for c in grid[s] if 0<len(grid[s][c])<3]
print('cells',len(SUBS)*len(B),'empty',len(empty),'thin(1-2)',len(thin))
print('EMPTY',empty)
print('THIN',thin)
json.dump({s:{c:v for c,v in d.items()} for s,d in grid.items()},open('grid.json','w'))
# functions per world for object types
fw=collections.defaultdict(collections.Counter)
for r in rows:
    if r['kind']!='object-type': continue
    for w in r['world'].split(';'):
        for f in r['functions'].split(';'): fw[w.strip()][f.strip()]+=1
for w in sorted(fw): print(w, dict(fw[w]))

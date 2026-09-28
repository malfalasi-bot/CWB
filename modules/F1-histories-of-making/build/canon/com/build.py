import sys,csv,importlib,collections
sys.path.insert(0,'.')
parts=[f'p{i}' for i in range(1,40)]
rows=[]
import os
for p in parts:
    if os.path.exists(p+'.py'): rows+=importlib.import_module(p).ROWS
DEL=set(open('del.txt').read().split('|'))
rows=[x for x in rows if x['name'] not in DEL]
for pp in ['patch','patch2','patch3','patch4','patch5','patch6','patch7']:
  if os.path.exists(pp+'.py'):
    P=importlib.import_module(pp).P
    for x in rows:
      if x['name'] in P: x.update(P[x['name']])
ALL="AF-EGY AF-NUB AF-MAG AF-SAH AF-GUI AF-CEN AF-HRN AF-SWA AF-SOU AF-MAD AM-ARC AM-NWC AM-WST AM-EWD AM-MES AM-CAM AM-CAR AM-AND AM-AMZ AM-LAT AS-CHN AS-KOR AS-JPN AS-SAS AS-HIM AS-MSE AS-ISE AS-CEN AS-NTH WA-MES WA-IRN WA-LEV WA-ARB WA-ANA WA-CAU EU-GRR EU-BYZ EU-WCE EU-BLC EU-IBE EU-EER EU-SCA OC-AUS OC-MEL OC-MIC OC-POL GL".split()
c=collections.Counter(s for x in rows for s in x['sub_regions'].split(';'))
bad=[s for s in c if s not in ALL]
names=collections.Counter(x['name'] for x in rows)
print('rows',len(rows),'bad codes',bad,'dups',[n for n,k in names.items() if k>1])
print(sorted(((c[s],s) for s in ALL)))
thin=[x['name'] for x in rows if not x['leaves_out'] or not x['materials_techniques'] or not x['object_types'] or len(x['making_significance'])<70]
print('thin',len(thin),thin)
if '--write' in sys.argv:
    H="id,name,other_names,kind,family,world,sub_regions,start,end,date_note,making_significance,materials_techniques,object_types,functions,defined_by,leaves_out,sensitivity,free_sources,tier,units,confidence,notes".split(',')
    out='/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/f1-scope/canon/canon_communities.csv'
    with open(out,'w',newline='',encoding='utf-8') as f:
        w=csv.DictWriter(f,fieldnames=H,quoting=csv.QUOTE_MINIMAL); w.writeheader()
        for i,x in enumerate(rows,1):
            x['id']=f'COM{i:03d}'; w.writerow(x)
    print('written',out)

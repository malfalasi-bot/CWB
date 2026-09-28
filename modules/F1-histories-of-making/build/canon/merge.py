import csv, glob, collections, re, json
H="id,name,other_names,kind,family,world,sub_regions,start,end,date_note,making_significance,materials_techniques,object_types,functions,defined_by,leaves_out,sensitivity,free_sources,tier,units,confidence,notes".split(',')
SUBS="AF-EGY AF-NUB AF-MAG AF-SAH AF-GUI AF-CEN AF-HRN AF-SWA AF-SOU AF-MAD AM-ARC AM-NWC AM-WST AM-EWD AM-MES AM-CAM AM-CAR AM-AND AM-AMZ AM-LAT AS-CHN AS-KOR AS-JPN AS-SAS AS-HIM AS-MSE AS-ISE AS-CEN AS-NTH WA-MES WA-IRN WA-LEV WA-ARB WA-ANA WA-CAU EU-GRR EU-BYZ EU-WCE EU-BLC EU-IBE EU-EER EU-SCA OC-AUS OC-MEL OC-MIC OC-POL GL".split()
rows=[];probs=collections.Counter();ex=[]
for f in sorted(glob.glob('canon/canon_*.csv')):
    r=list(csv.DictReader(open(f,encoding='utf-8')))
    hdr=list(r[0].keys())
    if hdr!=H: print('HEADER MISMATCH',f,hdr[:5])
    for x in r:
        x['_file']=f.split('/')[-1]
        for s in [s.strip() for s in x['sub_regions'].split(';') if s.strip()]:
            if s not in SUBS: probs['badsub']+=1; ex.append((x['id'],s))
        for k in ('start','end'):
            v=x[k].strip()
            if v and not re.fullmatch(r'-?\d+',v): probs['baddate']+=1; ex.append((x['id'],k,v))
        if x['start'].strip() and x['end'].strip() and int(x['start'])>int(x['end']): probs['order']+=1
        if x['tier'] not in ('R1','R2','R3'): probs['tier']+=1; ex.append((x['id'],x['tier']))
        rows.append(x)
print(len(rows)); print(probs); print(ex[:20])
ids=collections.Counter(x['id'] for x in rows); print('dup ids',[i for i,c in ids.items() if c>1][:10])
names=collections.defaultdict(list)
for x in rows: names[x['name'].lower().strip()].append((x['id'],x['_file']))
d=[(n,v) for n,v in names.items() if len(v)>1]; print('dup names',len(d)); print(d[:40])
json.dump(rows,open('merged.json','w'),ensure_ascii=False)

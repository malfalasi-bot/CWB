import sys; sys.path.insert(0,'.')
import assemble_events, assemble_periods, collections
FN=set("shelter;clothing and adornment;food and storage;tools;record and writing;exchange and value;ritual and belief;rule and display;war;play and music;care and access;transport".split(';'))
SENS=set("none;sacred;funerary;ancestral;Indigenous-community;human-flow;conflict-looting;living-community".split(';'))
WORLD=set("F1.6 F1.7 F1.8 F1.9 F1.9a F1.10 F1.11 F1.12 F1.12a F1.13 THEME".split())
SUB=set("AF-EGY AF-NUB AF-MAG AF-SAH AF-GUI AF-CEN AF-HRN AF-SWA AF-SOU AF-MAD AM-ARC AM-NWC AM-WST AM-EWD AM-MES AM-CAM AM-CAR AM-AND AM-AMZ AM-LAT AS-CHN AS-KOR AS-JPN AS-SAS AS-HIM AS-MSE AS-ISE AS-CEN AS-NTH WA-MES WA-IRN WA-LEV WA-ARB WA-ANA WA-CAU EU-GRR EU-BYZ EU-WCE EU-BLC EU-IBE EU-EER EU-SCA OC-AUS OC-MEL OC-MIC OC-POL GL".split())
UNITS=set("F1.2 F1.3 F1.4 F1.5 F1.13 F1.14 F1.15 F1.16 F1.17 F1.18 F1.19 F1.19a F1.20 F1.21 F1.22 F1.22a F1.23 F1.24 F1.26 F1.28 F1.28a F1.29 F1.30".split())
for label,rows in [('events',assemble_events.load()),('periods',assemble_periods.load())]:
    print('==',label,len(rows))
    for r in rows:
        errs=[]
        for f,S in [('functions',FN),('sensitivity',SENS),('world',WORLD),('sub_regions',SUB),('units',UNITS)]:
            bad=[x for x in r[f].split(';') if x and x.strip() not in S]
            if bad: errs.append(f"{f}:{bad}")
        if r['tier'] not in ('R1','R2','R3'): errs.append('tier')
        if r['confidence'] not in ('high','medium','low'): errs.append('conf')
        if r['start'] and r['end'] and int(r['end'])<int(r['start']): errs.append('end<start')
        if len(r['making_significance'])<75: errs.append('SHORTSIG')
        if len(r['leaves_out'])<14: errs.append('SHORTLEAVES')
        if errs: print(r['id'],r['name'][:50],errs)
    c=collections.Counter()
    for r in rows:
        for w in r['world'].split(';'): c[w]+=1
    print(sorted(c.items()))

import csv, glob, json
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.formatting.rule import ColorScaleRule
from openpyxl.utils import get_column_letter as L
F=Font(name='Arial',size=10); FB=Font(name='Arial',size=10,bold=True); FH=Font(name='Arial',size=10,bold=True,color='FFFFFF')
HF=PatternFill('solid',fgColor='3A332B')
wb=Workbook()
def table(ws,header,rows,widths=None):
    ws.append(header)
    for c in ws[1]: c.font=FH; c.fill=HF; c.alignment=Alignment(vertical='top',wrap_text=True)
    for r in rows: ws.append(r)
    for row in ws.iter_rows(min_row=2):
        for c in row: c.font=F; c.alignment=Alignment(vertical='top')
    ws.freeze_panes='C2'; ws.auto_filter.ref=ws.dimensions
    for i,w in enumerate(widths or [],1): ws.column_dimensions[L(i)].width=w
# Read me
rm=wb.active; rm.title='Read me'
lines=[("F1 canon register v2 — full coverage at zero cost",FB),("Built 2026-09-28. Companion to the doc 'F1 Scope v2 — everything, at zero cost'.",F),("",F),
("What this is",FB),("Every grouping, technique, material, object type, living practice and 'first known' claim F1's Atlas should hold, so nothing a learner might look for is missing. 4,228 nodes in 24 kinds (round 2 added communities, people, places, events, periods and the blind-map additions), plus 198 zero-cost source routes and 130 primary texts.",F),
("Tiers",FB),("R1 = taught in a unit, full grouping page with an authored walk. R2 = card and member grid (needs 5+ verified members and a source). R3 = card and link out. Every node gets at least R3; promotion is by evidence, not fame.",F),
("How it was checked",FB),("Drafted from knowledge in six parallel passes, then fact-checked independently: every R1 row, every low/medium-confidence R1/R2 row, every UNESCO claim, and random samples (about 620 rows). 66 rows corrected; logs in REVIEW_LOG_people.md and REVIEW_LOG_things.md. Random-sample error rate 1 in 120; UNESCO statuses written from memory were wrong 19 times in 124, so UNESCO status must be harvested from the ICH dataset, never typed. Round 2 (29 September): about 680 more rows checked (people, places, events, periods, communities, blind-map additions) and 106 corrected; priority rows (R1/R2, living people, UNESCO claims, endonyms) erred at 8–14%, random samples at 0–8%. Logs: REVIEW_LOG_round2_*.md.",F),
("Not yet done",FB),("No Wikidata/Getty/PeriodO identifiers are included on purpose (none were guessed); the harvest matches them. Rows at confidence 'low' or 'medium' outside R1 are unverified drafts.",F),
("Sheets",FB),("Summary — counts by kind and tier (formulas). Canon — all nodes, one row each, filterable. Coverage grid — nodes per sub-region and period band (formulas; recalculates as rows change). Functions x worlds — object types per function per world. Sources — zero-cost routes with licence and commercial-safe flag. Primary texts — texts on making, with public-domain status.",F),
("Codes",FB),("Sub-regions: 46 codes (AF-, AM-, AS-, WA-, EU-, OC-, GL). Period bands B01–B11. Worlds: F1.6 Africa · F1.7 Americas · F1.8 East Asia · F1.9 South and Southeast Asia · F1.9a West Asia before Islam · F1.10 Islamic world · F1.11 Europe and the Mediterranean · F1.12 Australia and the Pacific · F1.12a Steppe and Central Asia · F1.13 Networks · THEME.",F)]
for i,(t,f) in enumerate(lines,1):
    c=rm.cell(row=i,column=1,value=t); c.font=f; c.alignment=Alignment(wrap_text=True,vertical='top')
rm.column_dimensions['A'].width=120
# Canon
H="id,name,other_names,kind,family,world,sub_regions,start,end,date_note,making_significance,materials_techniques,object_types,functions,defined_by,leaves_out,sensitivity,free_sources,tier,units,confidence,notes".split(',')
rows=[]
for f in sorted(glob.glob('canon/canon_*.csv')):
    for r in csv.DictReader(open(f,encoding='utf-8')):
        v=[r[h] for h in H]
        v[7]=int(r['start']) if r['start'].strip() else None
        v[8]=int(r['end']) if r['end'].strip() else None
        rows.append(v)
ws=wb.create_sheet('Canon'); table(ws,H,rows,[9,30,20,20,11,14,18,8,8,18,60,28,28,22,22,28,18,34,6,14,10,30])
N=len(rows)+1
# Summary
sm=wb.create_sheet('Summary',1)
kinds=sorted(set(r[3] for r in rows),key=lambda k:-sum(1 for r in rows if r[3]==k))
sm.append(['Kind','R1','R2','R3','Total']); [setattr(c,'font',FH) or setattr(c,'fill',HF) for c in sm[1]]
for i,k in enumerate(kinds,2):
    sm.append([k]+[f'=COUNTIFS(Canon!$D$2:$D${N},$A{i},Canon!$S$2:$S${N},"{t}")' for t in ('R1','R2','R3')]+[f'=SUM(B{i}:D{i})'])
e=len(kinds)+2
sm.append(['All kinds']+[f'=SUM({c}2:{c}{e-1})' for c in 'BCDE'])
for row in sm.iter_rows(min_row=2):
    for c in row: c.font=F
for c in sm[e]: c.font=FB
sm.column_dimensions['A'].width=34
# Coverage grid
SUBS=[("AF-EGY","Egypt"),("AF-NUB","Nubia and Sudan"),("AF-MAG","Maghrib"),("AF-SAH","Sahel and Western Sudan"),("AF-GUI","Guinea Coast"),("AF-CEN","Central Africa"),("AF-HRN","Ethiopia and the Horn"),("AF-SWA","Swahili coast and interior"),("AF-SOU","Southern Africa"),("AF-MAD","Madagascar and Indian Ocean islands"),("AM-ARC","Arctic"),("AM-NWC","Northwest Coast"),("AM-WST","North American West"),("AM-EWD","Eastern Woodlands"),("AM-MES","Mesoamerica"),("AM-CAM","Central America"),("AM-CAR","Caribbean"),("AM-AND","Andes and Pacific coast"),("AM-AMZ","Amazonia and lowlands"),("AM-LAT","Colonial and modern Latin America"),("AS-CHN","China"),("AS-KOR","Korea"),("AS-JPN","Japan"),("AS-SAS","South Asia"),("AS-HIM","Himalaya and Tibet"),("AS-MSE","Mainland Southeast Asia"),("AS-ISE","Island Southeast Asia"),("AS-CEN","Central Asia and the steppe"),("AS-NTH","North Asia and Siberia"),("WA-MES","Mesopotamia"),("WA-IRN","Iran"),("WA-LEV","Levant"),("WA-ARB","Arabia and the Gulf"),("WA-ANA","Anatolia"),("WA-CAU","Caucasus"),("EU-GRR","Greek and Roman Mediterranean"),("EU-BYZ","Byzantium and the Balkans"),("EU-WCE","Western and Central Europe"),("EU-BLC","Britain, Ireland, Low Countries"),("EU-IBE","Iberia"),("EU-EER","Eastern Europe and Russia"),("EU-SCA","Scandinavia, Baltic, Sápmi"),("OC-AUS","Australia"),("OC-MEL","Melanesia"),("OC-MIC","Micronesia"),("OC-POL","Polynesia")]
B=[("B01","before 8000 BCE",-9999999,-8000),("B02","8000–4000 BCE",-8000,-4000),("B03","4000–2000 BCE",-4000,-2000),("B04","2000–1000 BCE",-2000,-1000),("B05","1000 BCE–1 CE",-1000,1),("B06","1–500",1,500),("B07","500–1000",500,1000),("B08","1000–1400",1000,1400),("B09","1400–1700",1400,1700),("B10","1700–1900",1700,1900),("B11","1900–now",1900,2027)]
g=wb.create_sheet('Coverage grid',2)
g['A1']='Nodes per sub-region and period band (a node counts in every band its date range touches). 0 = gap, or no people there yet (see note column). Band edges are in rows 3–4 and drive the formulas.'; g['A1'].font=FB
g.append([]); g.append(['','band start']+[b[2] for b in B]); g.append(['','band end']+[b[3] for b in B])
g.append(['Code','Sub-region']+[f'{b[0]} {b[1]}' for b in B]+['Note'])
for c in g[5]: c.font=FH; c.fill=HF; c.alignment=Alignment(wrap_text=True)
notes={"AF-MAD":"B01–B02: human arrival in Madagascar is debated (claims before 8000 BCE contested); likely no makers to record","OC-MIC":"B01–B02: Micronesia settled c. 1500 BCE; no people yet","AM-LAT":"Period-region: starts 1492","AS-HIM":"B01: Denisovan presence on the Tibetan Plateau (Baishiya Karst Cave) is a candidate node"}
for i,(code,name) in enumerate(SUBS,6):
    row=[code,name]
    for j,b in enumerate(B):
        col=L(3+j)
        row.append(f'=COUNTIFS(Canon!$G$2:$G${N},"*"&$A{i}&"*",Canon!$H$2:$H${N},"<"&{col}$4,Canon!$I$2:$I${N},">="&{col}$3)+COUNTIFS(Canon!$G$2:$G${N},"*"&$A{i}&"*",Canon!$H$2:$H${N},"<"&{col}$4,Canon!$I$2:$I${N},"")')
    row.append(notes.get(code,''))
    g.append(row)
last=5+len(SUBS)
for row in g.iter_rows(min_row=3):
    for c in row:
        if c.font!=FH: c.font=F
g.conditional_formatting.add(f'C6:M{last}',ColorScaleRule(start_type='num',start_value=0,start_color='F4C7B8',mid_type='num',mid_value=5,mid_color='FBF8F2',end_type='num',end_value=40,end_color='7FA37A'))
g.append([]); g.append(['','Empty cells',f'=COUNTIF(C6:M{last},0)']); g.append(['','Thin cells (1–2)',f'=COUNTIFS(C6:M{last},">0",C6:M{last},"<3")'])
g.column_dimensions['B'].width=32; g.column_dimensions['N'].width=60
for j in range(11): g.column_dimensions[L(3+j)].width=12
g.freeze_panes='C6'
# Functions x worlds
fx=wb.create_sheet('Functions x worlds',3)
FUN=["shelter","clothing and adornment","food and storage","tools","record and writing","exchange and value","ritual and belief","rule and display","war","play and music","care and access","transport"]
W=["F1.6","F1.7","F1.8","F1.9","F1.9a","F1.10","F1.11","F1.12","F1.12a","F1.13","THEME"]
fx.append(['Object types per function and world (formulas on Canon; a type can serve several functions and worlds)'])
fx['A1'].font=FB
fx.append(['Function']+W+['All'])
for c in fx[2]: c.font=FH; c.fill=HF
for i,fn in enumerate(FUN,3):
    r=[fn]
    for w in W:
        # match world token exactly: surround with ; via wildcard is ambiguous (F1.9 vs F1.9a) -> use SUMPRODUCT on padded string
        r.append(f'=SUMPRODUCT((Canon!$D$2:$D${N}="object-type")*ISNUMBER(SEARCH(";{w};",";"&SUBSTITUTE(Canon!$F$2:$F${N}," ","")&";"))*ISNUMBER(SEARCH("{fn}",Canon!$N$2:$N${N})))')
    r.append(f'=COUNTIFS(Canon!$D$2:$D${N},"object-type",Canon!$N$2:$N${N},"*{fn}*")')
    fx.append(r)
for row in fx.iter_rows(min_row=3):
    for c in row: c.font=F
fx.column_dimensions['A'].width=24
fx.conditional_formatting.add('B3:L14',ColorScaleRule(start_type='num',start_value=0,start_color='F4C7B8',mid_type='num',mid_value=4,mid_color='FBF8F2',end_type='num',end_value=20,end_color='7FA37A'))
# Sources, texts
for fname,title,wid in [('canon/sources_zero_cost.csv','Sources',[8,30,16,18,16,12,14,26,20,10,40,34,12,40,30]),('canon/primary_texts.csv','Primary texts',[8,40,24,14,12,14,12,26,34,20,30,34])]:
    rr=list(csv.reader(open(fname,encoding='utf-8')))
    table(wb.create_sheet(title),rr[0],rr[1:],wid)
wb.save('out/F1_canon_register_v2.xlsx'); print(N-1)

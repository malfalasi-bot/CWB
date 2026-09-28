"""Build world-set register v0 from the verified tables in Deep Dives 1 and 2, overlaid with the provenance pass."""
import re, json, csv
SP = '/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/'
CHAPTERS = [  # (line where the section starts in dd2.txt, chapter code)
    (19,'F1.13'),(70,'F1.12'),(114,'F1.10'),(162,'F1.7'),(212,'F1.8'),(260,'F1.9'),(306,'F1.11'),(354,'F1.9a'),(401,'F1.12a'),(447,None)]
def chapter_for(line):
    cur=None
    for start,code in CHAPTERS:
        if line>=start: cur=code
    return cur
rows=[]
# Deep Dives 1: F1.5 lines 98-107, F1.6 lines 149-157
for i,l in enumerate(open(SP+'dd1.txt').read().split('\n'),1):
    m=re.match(r'\s*((?:WS|AS|DOC|DAT|PL|PR)-X?\d+) \| (.*)',l)
    if m and i<240:
        rows.append(('DD1', 'F1.5' if i<127 else 'F1.6', m.group(1), [c.strip() for c in m.group(2).split(' | ')]))
for i,l in enumerate(open(SP+'dd2.txt').read().split('\n'),1):
    m=re.match(r'\s*\[[^\]]+\] \| ((?:WS|AS|DOC|DAT|PL|PR)-X?\d+) \| (.*)',l)
    if m and i<447:
        rows.append(('DD2', chapter_for(i), m.group(1), [c.strip() for c in m.group(2).split(' | ')]))
prov=json.load(open('prov_pass.json'))['records']
recs={}
for src,ch,rid,cells in rows:
    r=recs.get(rid)
    if r is None:
        kind={'WS':'object','AS':'asset','DOC':'document','DAT':'dataset','PL':'place','PR':'practice'}[rid.split('-')[0]]
        r=recs[rid]={'id':rid,'kind':kind,'title':cells[0],'date':cells[1] if len(cells)>1 else '',
                     'holder_and_licence':cells[2] if len(cells)>2 else '','provenance_summary':cells[3] if len(cells)>3 else '',
                     'roles':[], 'units':[], 'found_in':[]}
    if ch and ch not in r['units']: r['units'].append(ch)
    if src not in r['found_in']: r['found_in'].append(src)
    role=cells[-1] if len(cells)>=4 else ''
    if role and role not in r['roles']: r['roles'].append(role)
    # keep the fuller provenance text if a later row has more detail
    if len(cells)>3 and len(cells[3])>len(r['provenance_summary']) and cells[3] not in ('Same','Flagged'): r['provenance_summary']=cells[3]
def licence(h):
    h=h.lower()
    if "not in cleveland's cc0" in h: return 'To source'
    if 'cc0' in h: return 'CC0'
    if 'not public domain' in h: return 'Not public domain'
    if 'public domain' in h and 'to check' not in h: return 'Public domain'
    if re.search(r'\bMIT\b',h): return 'MIT'
    return 'To check'
def holder(h):
    m=re.match(r'(Cleveland|Met|BnF|State Hermitage|Asian Civilisations Museum|Cambridge University Library)',h)
    return m.group(1) if m else ''
def accession(h):
    m=re.search(r'(?:Cleveland|Met) ([0-9][0-9.a-c–]+)',h); return m.group(1) if m else ''
out=[]
for rid,r in sorted(recs.items(), key=lambda kv:(kv[0].split('-')[0], kv[0].replace('X','9'))):
    p=prov.get(rid,{})
    status='excluded' if '-X' in rid else ('case' if p.get('test') in ('fail',) else 'exemplar')
    if r['kind']!='object': status='support'
    if 'To source' in r['date'] or 'to source' in r['holder_and_licence'].lower() or 'to check' in r['holder_and_licence'].lower() and r['kind']=='object' and not accession(r['holder_and_licence']):
        status='to-source' if status=='exemplar' else status
    h=r['holder_and_licence']
    out.append({
        'id':rid,'kind':r['kind'],'status':status,'title':r['title'],'date':r['date'],
        'holder':holder(h),'accession':accession(h),'licence':licence(h),'holder_and_licence_note':h,
        'provenance':p.get('provenance_text',r['provenance_summary']),
        'provenance_test':p.get('test','' if r['kind']!='object' else ('pass' if re.search(r'(19[0-6]\d|18\d\d|Excavated|excavated|Owned by 19[0-6])',r['provenance_summary']+' '+h) else 'to-check')),
        'test_basis':p.get('basis',''),'history_gap':p.get('gap',''),'action':p.get('action',''),
        'units':' '.join(r['units']),'roles':' / '.join(r['roles']),
        'verified_in':' '.join(r['found_in'])+(' + provenance pass 2026-09-28' if p else ''),
        'met_object_id':p.get('met_object_id',''),
    })
# Manual corrections the parser cannot infer
fix={
 'WS-X02':{'provenance_test':'n/a','action':'Excluded: the Met does not date it to the Shang'},
 'WS-X03':{'provenance_test':'fail','action':'Taught in F1.24 as a provenance case'},
 'WS-X04':{'provenance_test':'fail','action':'Taught in F1.24 beside the Nok looting finding'},
 'WS-X05':{'provenance_test':'n/a','action':'Commercial salvage; taught in F1.24'},
 'WS-003':{'provenance_test':'pass','test_basis':'Excavated by the Met at Deir el-Bahri, 1926–27'},
 'WS-016':{'provenance_test':'pass','test_basis':'Excavated at Faras by the University of Oxford, 1911–12'},
 'WS-100':{'provenance_test':'pass','test_basis':'Excavated at Pazyryk, 1949'},
 'WS-103':{'provenance_test':'pass','test_basis':'Excavated'},
}
fix.update({
 'WS-030':{'status':'to-license','provenance_test':'pass','test_basis':'Published excavation finds','licence':'Image rights to request'},
 'WS-031':{'status':'rights-blocked','provenance_test':'to-check','action':'Case only until a licensed chart is found (Smithsonian NMNH holds 15; rights to check)'},
 'WS-032':{'status':'to-license','provenance_test':'pass','test_basis':'Excavated material','licence':'Image to license'},
 'WS-033':{'status':'rights-blocked','provenance_test':'to-check','action':'Case only until a licensed barkcloth is found (Te Papa and Australian collections next)'},
 'WS-072':{'status':'to-license','provenance_test':'n/a','test_basis':'Living practice; images from the weavers, licensed','licence':'Weavers\' images to license'},
 'WS-073':{'status':'to-source','licence':'To source'},
 'WS-074':{'status':'to-source'},
 'WS-082':{'status':'to-source'},
 'WS-104':{'status':'to-source','licence':'To source'},
 'WS-100':{'status':'to-license','licence':'Image rights to request (State Hermitage)'},
 'WS-103':{'status':'to-license','licence':'Excavation photographs; rights to request'},
 'WS-095':{'licence':'Public domain','accession':'17.194.225'},
 'WS-044':{'provenance_test':'n/a','test_basis':'European decorative art of about 1900; not archaeological. In Cleveland since 1944'},
 'WS-045':{'provenance_test':'n/a','test_basis':'Signed Paris work of the late 1800s; not archaeological'},
 'WS-083':{'provenance_test':'n/a','test_basis':'Dutch decorative art of the 1700s; not archaeological. In Cleveland since 1969'},
 'WS-084':{'provenance_test':'n/a','test_basis':'English decorative art of the 1700s; not archaeological. Bought at a Cleveland auction, 1986'},
 'WS-085':{'provenance_test':'n/a','test_basis':'Wedgwood factory product; in Cleveland since 1918'},
})
for o in out:
    if o['id'] in fix: o.update(fix[o['id']])
    if o['kind']=='object' and o['provenance_test']=='pass' and not o['test_basis']:
        m=re.search(r'(18\d\d|19[0-6]\d)',o['provenance']+' '+o['holder_and_licence_note'])
        if m: o['test_basis']=f'In a museum or documented collection by {m.group(1)}'
json.dump({'register':'F1 world set','version':'v0','built':'2026-09-28','records':out},open('world_set_v0.json','w'),ensure_ascii=False,indent=1)
with open('world_set_v0.csv','w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(out[0].keys())); w.writeheader(); w.writerows(out)
from collections import Counter
print(len(out), Counter(o['kind'] for o in out)); print(Counter((o['status'],o['provenance_test']) for o in out if o['kind']=='object'))
for o in out:
    if o['kind']=='object': print(o['id'],'|',o['status'],'|',o['provenance_test'],'|',o['holder'],o['accession'],'|',o['licence'],'|',o['units'],'|',o['title'][:40])

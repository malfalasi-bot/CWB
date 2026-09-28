import sys, re, csv, collections
sys.path.insert(0,'.')
import assemble_events, assemble_periods
from fixes import FIX
from common import write
ev=assemble_events.load(); pr=assemble_periods.load()
used=set()
for r in ev+pr:
    for k,v in FIX.items():
        if r['name'].startswith(k):
            r.update(v); used.add(k)
print("unused fixes:", set(FIX)-used - {k for k,v in FIX.items() if not v})
names={'OCC':[(r['name'],r['id']) for r in ev],'PRD':[(r['name'],r['id']) for r in pr]}
def fix_notes(txt):
    out=''; i=0
    for m in re.finditer(r'\b(OCC|PRD) (?=[A-Z\u00c0-\u024f\u1e00-\u1eff])',txt):
        pass
    while True:
        m=re.search(r'\b(OCC|PRD) (?![0-9])',txt[i:])
        if not m: out+=txt[i:]; break
        a=i+m.start(); b=i+m.end(); pre=m.group(1); rest=txt[b:]
        full=[(n,idx) for n,idx in names[pre] if rest.lower().startswith(n.lower())]
        if full:
            n,idx=max(full,key=lambda x:len(x[0])); out+=txt[i:a]+idx; i=b+len(n); continue
        chunk=re.split(r'[;)]|\.(?:\s|$)',rest)[0].strip()
        hits=[idx for n,idx in names[pre] if n.lower().startswith(chunk.lower())]
        if len(hits)==1: out+=txt[i:a]+hits[0]; i=b+len(chunk); continue
        print('UNRESOLVED',pre,chunk,hits); out+=txt[i:b]; i=b
    return out
for r in ev+pr:
    r['notes']=fix_notes(r['notes'])
out='/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/f1-scope/canon/'
write(ev,out+'canon_events.csv'); write(pr,out+'canon_periods.csv')
print(len(ev),len(pr))

import re,json,csv
SP='/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/'
CONF=re.compile(r'^(Documented|Probable|Contested|Interpretive)\b(.*)$')
def chapters_dd1(i): return 'F1.5' if i<127 else 'F1.6'
DD2=[(19,'F1.13'),(70,'F1.12'),(114,'F1.10'),(162,'F1.7'),(212,'F1.8'),(260,'F1.9'),(306,'F1.11'),(354,'F1.9a'),(401,'F1.12a'),(447,None)]
def chapters_dd2(i):
    c=None
    for s,code in DD2:
        if i>=s: c=code
    return c
claims=[]
for name,chf in (('dd1.txt',chapters_dd1),('dd2.txt',chapters_dd2)):
    for i,l in enumerate(open(SP+name).read().split('\n'),1):
        l2=re.sub(r'^\s*\[[^\]]+\] \| ','',l)
        if ' | ' not in l2: continue
        cells=[c.strip() for c in l2.split(' | ')]
        for k,c in enumerate(cells):
            m=CONF.match(c)
            if m and k>=1 and len(cells[k-1])>40:
                ch=chf(i)
                if not ch: break
                claims.append({'unit':ch,'topic':cells[k-2] if k>=2 else '','claim':cells[k-1],'confidence':m.group(1).lower(),
                               'confidence_note':m.group(2).strip(' ()'),'source':' | '.join(cells[k+1:]),'from':name.replace('.txt','').upper()})
                break
for n,c in enumerate(claims,1): c['id']=f'CL-{n+100:03d}'
json.dump({'register':'F1 claims','version':'v0','built':'2026-09-28','note':'IDs from CL-101 so they do not collide with CL-001 (sprint 2); units link to claims, never copy them','records':claims},open('claims_v0.json','w'),ensure_ascii=False,indent=1)
with open('claims_v0.csv','w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=['id','unit','topic','claim','confidence','confidence_note','source','from']); w.writeheader(); w.writerows(claims)
from collections import Counter
print(len(claims),Counter(c['unit'] for c in claims),Counter(c['confidence'] for c in claims))

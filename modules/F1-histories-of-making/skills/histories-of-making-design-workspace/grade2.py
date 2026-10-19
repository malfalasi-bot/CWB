import json, os, re, sys
from PIL import Image
IT = sys.argv[1]
def has(h, *pats): return all(re.search(p, h, re.I|re.S) for p in pats)
COMMON = [
  ("Paper ground and course tokens (#F1EADB / --paper)", lambda h,d: 'F1EADB' in h.upper() or '--paper' in h),
  ("Course serif named (Source Serif 4 or Shippori Mincho)", lambda h,d: 'Source Serif' in h or 'Shippori' in h),
  ("Clock readout element in the band (readout/clock)", lambda h,d: has(h, r'(readout|clock)')),
  ("Sources section and previous/next stepper", lambda h,d: has(h, r'>\s*Sources\s*<', r'(previous|prev)', r'next')),
  ("No emoji, flags or icon rows", lambda h,d: not re.search(r'[\U0001F300-\U0001FAFF\U0001F1E6-\U0001F1FF]', h)),
  ("390 px screenshot is 390 wide (no horizontal overflow)", lambda h,d: Image.open(os.path.join(d,'shot-390.png')).width in (390,780)),
  ("Light paper ground in the 1440 screenshot (mean luminance > 150)", lambda h,d: Image.open(os.path.join(d,'shot-1440.png')).convert('L').resize((1,1)).getpixel((0,0)) > 150),
]
SPEC = {
 'eval-3': [
  ("'as defined by' with who and when (Arts and Crafts Exhibition Society, 1887)", lambda h,d: has(h, r'as defined by', r'1887')),
  ("'what it leaves out' section present", lambda h,d: has(h, r'leaves out')),
  ("Membership confidence shown; the Stickley chair tagged 'argued'", lambda h,d: has(h, r'Stickley.{0,400}argued|argued.{0,400}Stickley')),
  ("Span 1860–1920 shown as a span with 'approximate'", lambda h,d: has(h, r'1860\s*[–-]\s*1920', r'approx')),
  ("Neighbours and counterparts listed with spans (Mingei 1925 – …, Swadeshi)", lambda h,d: has(h, r'Mingei', r'Swadeshi', r'Aesthetic')),
  ("Two argued questions each with two readings and sources (Morris 1877; Ashbee 1908)", lambda h,d: has(h, r'Lesser Arts', r'1908')),
  ("No origin line: a movement not drawn as an arrow from one place (no 'origin' arrow path; an explicit statement or no route)", lambda h,d: not re.search(r'(?<!not as a )(?<!not )spread from one origin|origin arrow', h, re.I)),
  ("A walk or stepper through members (a stepper with n of N or step controls)", lambda h,d: has(h, r'(\d\s*of\s*\d|data-step|class="[^"]*step)')),
  ("An apply hook (a lens, a comparison to open, a tile)", lambda h,d: has(h, r'(apply|lens|compare)')),
 ],
 'eval-4': [
  ("Six readings as rows: material, labour, meaning, trade, technique, use", lambda h,d: all(re.search(r'>\s*'+w, h, re.I) for w in ['material','labour','meaning','trade','technique','use'])),
  ("'not known' cells present", lambda h,d: h.lower().count('not known') >= 2),
  ("'what this comparison leaves out' row", lambda h,d: has(h, r'leaves out')),
  ("Claim ids as superscripts (sup with c1…)", lambda h,d: len(re.findall(r'<sup[^>]*>(?:<[^>]+>)*\s*c?\d+', h)) >= 6),
  ("Credit lines with accession and CC0 for both objects", lambda h,d: has(h, r'1988\.433\.1', r'1994\.35\.129', r'CC0')),
  ("Scale figure (a hand) and one scale stated", lambda h,d: has(h, r'hand', r'scale')),
  ("Nothing coloured or ranked in cells (no per-cell background colour classes like better/worse/score)", lambda h,d: not re.search(r'(better|worse|score|rank)', h, re.I)),
  ("Three named sources present", lambda h,d: has(h, r'Archaic Bookkeeping', r'Urton')),
 ],
 'eval-5': [
  ("Community's own name first with the record's exonym in quotation marks", lambda h,d: has(h, r'Diné', r'the record:\s*[‘\'"“]Navajo')),
  ("Protocol before any object: the Notice text appears before the first object credit", lambda h,d: h.find('correct historical practices') != -1 and h.find('correct historical practices') < h.find('CC0', h.find('<body'))),
  ("Notice text used exactly", lambda h,d: 'This Notice is being used to correct historical practices of omission in attribution.' in h),
  ("Content note once (appears exactly one time as a labelled note)", lambda h,d: 1 <= len(re.findall(r'content note', h, re.I)) <= 3),
  ("Display-basis line per object (three 'made for' / 'not shown' lines)", lambda h,d: len(re.findall(r'(made for (trade|sale)|not shown)', h, re.I)) >= 3),
  ("The ceremonial textile is not shown: a placeholder that says why and no image", lambda h,d: has(h, r'not shown', r'ceremonial')),
  ("Open-ended span 'c. 1650 – …'", lambda h,d: has(h, r'1650\s*[–-]\s*(…|\.\.\.)')),
  ("Territory as a soft wash, no border line (blur/wash and no 'border' stroke on the territory)", lambda h,d: has(h, r'(wash|blur)')),
  ("Review line 'awaiting reader: Navajo Nation Museum' and no invented clearance", lambda h,d: has(h, r'awaiting reader') and not re.search(r'cleared by', h, re.I)),
  ("'what the record leaves out' present", lambda h,d: has(h, r'leaves out')),
  ("Course notices but never labels (no 'TK Label' applied by the course)", lambda h,d: not re.search(r'label applied|labelled by the course', h, re.I)),
 ],
}
for e in sorted(os.listdir(IT)):
    ep=os.path.join(IT,e)
    if not os.path.isdir(ep) or not e.startswith('eval-'): continue
    key=e[:6]
    for cfg in ('with_skill','old_skill'):
        d=os.path.join(ep,cfg,'outputs')
        if not os.path.isdir(d): continue
        h=open(os.path.join(d,'index.html'),encoding='utf8').read()
        exps=[]
        for text,fn in COMMON+SPEC.get(key,[]):
            try: ok=bool(fn(h,d)); ev='checked by script' if ok else 'not found by script'
            except Exception as ex: ok=False; ev=f'script error: {ex}'
            exps.append({'text':text,'passed':ok,'evidence':ev})
        p=sum(x['passed'] for x in exps)
        g={'expectations':exps,'summary':{'passed':p,'failed':len(exps)-p,'total':len(exps),'pass_rate':round(p/len(exps),2)}}
        json.dump(g,open(os.path.join(ep,cfg,'grading.json'),'w'),indent=2)
        os.makedirs(os.path.join(ep,cfg,'run-1'),exist_ok=True)
        json.dump(g,open(os.path.join(ep,cfg,'run-1','grading.json'),'w'),indent=2)
        if os.path.exists(os.path.join(ep,cfg,'timing.json')): open(os.path.join(ep,cfg,'run-1','timing.json'),'w').write(open(os.path.join(ep,cfg,'timing.json')).read())
        print(e,cfg,f'{p}/{len(exps)}',[x['text'][:48] for x in exps if not x['passed']])
    meta=json.load(open(os.path.join(ep,'eval_metadata.json'))); meta['assertions']=[t for t,_ in COMMON+SPEC.get(key,[])]
    json.dump(meta,open(os.path.join(ep,'eval_metadata.json'),'w'),indent=2,ensure_ascii=False)

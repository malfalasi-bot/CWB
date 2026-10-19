"""Iteration 3 grader: evals 0–5 reuse the iteration-1/2 assertions; evals 6–8 test scenes, beats and the claims register."""
import json, os, re, sys
import yaml
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
IT = sys.argv[1]
def has(h, *pats): return all(re.search(p, h, re.I|re.S) for p in pats)
def rd(d, n):
    p = os.path.join(d, n)
    return open(p, encoding='utf8').read() if os.path.exists(p) else ''
def body(h):
    i = h.lower().find('<body'); h = h[i:] if i >= 0 else h
    h = re.sub(r'<svg.*?</svg>', ' ', h, flags=re.S)
    h = re.sub(r'<(script|style).*?</\1>', ' ', h, flags=re.S)
    return re.sub(r'<[^>]+>', ' ', h)

COMMON = [
  ("Paper ground and course tokens (#F1EADB / --paper)", lambda h,d: 'F1EADB' in h.upper() or '--paper' in h),
  ("Course serif named (Source Serif 4 or Shippori Mincho)", lambda h,d: 'Source Serif' in h or 'Shippori' in h),
  ("Clock readout element in the band (readout/clock)", lambda h,d: has(h, r'(readout|clock)')),
  ("Sources section and previous/next stepper", lambda h,d: has(h, r'>\s*Sources\b', r'(previous|prev)', r'next')),
  ("No emoji, flags or icon rows", lambda h,d: not re.search(r'[\U0001F300-\U0001FAFF\U0001F1E6-\U0001F1FF]', h)),
  ("390 px screenshot is 390 wide (no horizontal overflow)", lambda h,d: Image.open(os.path.join(d,'shot-390.png')).width in (390,780)),
  ("Light paper ground in the 1440 screenshot (mean luminance > 150)", lambda h,d: Image.open(os.path.join(d,'shot-1440.png')).convert('L').resize((1,1)).getpixel((0,0)) > 150),
]

# ---------- evals 0–5: the earlier assertions ----------
from grade import SPECIFIC as S1
from grade2 import SPEC as S2
OLD = {}
OLD.update({k: v for k, v in S1.items()})
OLD.update({k: v for k, v in S2.items()})

# ---------- eval 6: journey scene ----------
GLYPHS = {'ship','junk','steamer','crate','pavilion','shop','book','fan','pigment','coin','soba bowl','soba-bowl','flame','seal','bubble'}
MODES = {'point','span','step','crawl','held'}
MOVES = {'settle','follow','push','cut','hold'}
def scene(d):
    s = yaml.safe_load(rd(d, 'scenes.yaml'))
    if isinstance(s, dict): s = s.get('scenes', [s])
    return s[0]
def shots(d): return scene(d).get('shots', [])
def legs_of(sh):
    cam = sh.get('camera') or {}
    return cam.get('legs') or []
def glyphs_in(d):
    out = set()
    for sh in shots(d):
        for a in sh.get('actors') or []:
            if isinstance(a, dict) and a.get('glyph'): out.add(str(a['glyph']).lower())
    return out
E6 = [
  ("scenes.yaml parses: kind journey, a two-ended span, the five claim ids, honesty, understand, ends_on yuan-jar", lambda h,d: (lambda s: s.get('kind')=='journey' and isinstance(s.get('span'),list) and len(s['span'])==2 and set(['cb-kashan-to-jingdezhen','cb-david-vases-1351','cb-fustat-finds','cb-ardabil-1611','cb-topkapi-count'])<=set(s.get('claims',[])) and bool(s.get('honesty')) and bool(s.get('understand')) and 'yuan-jar' in json.dumps(s.get('ends_on')))(scene(d))),
  ("4–6 shots, each with surface, camera, clock, labels, caption, duration and reduced", lambda h,d: 4 <= len(shots(d)) <= 6 and all(all(k in sh for k in ('surface','camera','clock','labels','caption','duration','reduced')) for sh in shots(d))),
  ("One camera move per shot, from settle | follow | push | cut | hold; at least one follow shot", lambda h,d: all(str((sh.get('camera') or {}).get('move')) in MOVES for sh in shots(d)) and any((sh.get('camera') or {}).get('move')=='follow' for sh in shots(d))),
  ("Clock mode on every shot in point | span | step | crawl | held, with a readout", lambda h,d: all(str((sh.get('clock') or {}).get('mode')) in MODES and (sh.get('clock') or {}).get('readout') for sh in shots(d))),
  ("One primary label and at most three others on every shot", lambda h,d: all(isinstance(sh.get('labels'),dict) and sh['labels'].get('primary') and len(sh['labels'].get('others') or [])<=3 for sh in shots(d))),
  ("Undated legs marked dated: false (the facts give no leg a date)", lambda h,d: 'dated: false' in rd(d,'scenes.yaml').lower()),
  ("Every caption carries sources, and a claim id where it has a date or number", lambda h,d: all(isinstance(sh.get('caption'),dict) and sh['caption'].get('sources') and (sh['caption'].get('claim') or sh['caption'].get('claims') or not re.search(r'\d', str(sh['caption'].get('text','')))) for sh in shots(d))),
  ("Glyphs from the shared library only; the storyboard quotes a content line beside each", lambda h,d: glyphs_in(d) and glyphs_in(d) <= GLYPHS and all(g in rd(d,'storyboard.md').lower() for g in glyphs_in(d)) and rd(d,'storyboard.md').count('“')+rd(d,'storyboard.md').count('"')+rd(d,'storyboard.md').count('‘') >= 2*len(glyphs_in(d))),
  ("No holder or accession invented for the jar: the placeholder text is present and no accession number appears", lambda h,d: 'image pending: accession to verify' in (h+rd(d,'scenes.yaml')) and not re.search(r'(accession|acc\.)\s*[:#]?\s*[A-Z]{0,3}\s*\d{2,4}[.\-]\d{1,5}', h+rd(d,'scenes.yaml'), re.I)),
  ("The mock draws the legs dashed (undated) in indigo", lambda h,d: has(h, r'stroke-dasharray') and ('233C6B' in h.upper() or '--indigo' in h)),
  ("The journey bar or strip under the globe, the step control (n of N) and the honesty line are on the page", lambda h,d: has(h, r'(journey[- ]bar|strip)', r'\d\s*of\s*\d', r'honesty')),
  ("'earliest', never 'first', in the page's prose and the captions", lambda h,d: not re.search(r"(?<!never ')(?<!no ')\bfirst\b(?! phase)", body(h) + ' '.join(str((sh.get('caption') or {}).get('text','')) for sh in shots(d)), re.I)),
]

# ---------- eval 7: beats ----------
KINDS = {'threshold','caption','focus','bridge','note','prompt','aside'}
LEN = {'threshold':(20,45),'caption':(25,60),'focus':(15,40),'bridge':(20,50),'note':(25,70),'aside':(25,60)}
DEP = {'it','its','he','his','she','her','they','their','that','those','these','then','and','but','so','both','here'}
INSTR = r'\b(map|globe|sheet|stage|timeline|lane|line|layer|block|loupe|slider|proof|impression|plate|medallion|bubble)\b'
def beats(d):
    b = yaml.safe_load(rd(d, 'beats.yaml'))
    if isinstance(b, list): return b
    return b.get('beats') or next(v for v in b.values() if isinstance(v, list))
def wc(t): return len(str(t or '').split())
def text_of(b): return str(b.get('text') or b.get('question') or b.get('q') or '')
E7 = [
  ("beats.yaml parses into 4–8 beats", lambda h,d: 4 <= len(beats(d)) <= 8),
  ("Every beat has a kind from the seven (threshold, caption, focus, bridge, note, prompt, aside)", lambda h,d: all(b.get('kind') in KINDS for b in beats(d))),
  ("Exactly one threshold, and it comes first", lambda h,d: beats(d)[0].get('kind')=='threshold' and sum(b.get('kind')=='threshold' for b in beats(d))==1),
  ("The threshold carries the lecture's thesis sentence and names the lecture and station span", lambda h,d: 'sold the eighteenth century its taste' in text_of(beats(d)[0]) and bool(re.search(r'(Lecture 6|L6)', json.dumps(beats(d)[0], ensure_ascii=False)))),
  ("A station (L6.n) on every beat except an aside", lambda h,d: all(re.match(r'L6\.\d', str(b.get('station',''))) for b in beats(d) if b.get('kind')!='aside')),
  ("At most one aside and one prompt, neither first nor last", lambda h,d: sum(b.get('kind')=='aside' for b in beats(d))<=1 and sum(b.get('kind')=='prompt' for b in beats(d))<=1 and all(b.get('kind') not in ('aside','prompt') for b in (beats(d)[0], beats(d)[-1]))),
  ("No reveal beat: no beat after the prompt restates its answer (944)", lambda h,d: (lambda bs: not any('944' in text_of(b) for i,b in enumerate(bs) if any(p.get('kind')=='prompt' for p in bs[:i])))(beats(d))),
  ("Lengths per kind: threshold 20–45, caption 25–60, focus 15–40, bridge 20–50, note 25–70, aside 25–60; prompt question ≤ 22 and say ≤ 40", lambda h,d: all((LEN[b['kind']][0] <= wc(b.get('text')) <= LEN[b['kind']][1]) if b.get('kind') in LEN else (wc(b.get('question') or b.get('q'))<=22 and wc(b.get('say'))<=40) for b in beats(d))),
  ("No dependent opening (It, Its, He, Then, The … without a year or name)", lambda h,d: all((lambda t: t.split()[0].strip(',.').lower() not in DEP and not (t.split()[0]=='The' and not re.search(r'\b1[5-9]\d\d\b|\b[A-Z][a-z]+', t.split('.')[0][4:])))(text_of(b)) for b in beats(d) if text_of(b))),
  ("Every beat names its subject: a year and a proper noun in its own text", lambda h,d: all(re.search(r'\b1[5-9]\d\d\b', text_of(b)) and re.search(r'(?<![.!?]\s)(?<!^)\b[A-Z][a-z]+', text_of(b)) for b in beats(d))),
  ("Confidence words only in a note's text or a prompt's say", lambda h,d: all(b.get('kind') in ('note',) or not re.search(r'\b(probable|argued|contested|documented)\b', str(b.get('text','')), re.I) for b in beats(d))),
  ("Focus beats carry a mark and run to at most two sentences", lambda h,d: all(b.get('mark') and len(re.findall(r'[.!?](\s|$)', str(b.get('text','')))) <= 2 for b in beats(d) if b.get('kind')=='focus') and any(b.get('kind')=='focus' for b in beats(d))),
  ("A caption's first sentence names the instrument", lambda h,d: all(re.search(INSTR, str(b.get('text','')).split('.')[0], re.I) for b in beats(d) if b.get('kind')=='caption')),
  ("The argued jasper-body pair lives in a note (not an aside, caption or focus) and drives no mark", lambda h,d: any(b.get('kind')=='note' and '1774' in str(b.get('text','')) and '1775' in str(b.get('text','')) for b in beats(d)) and not any(b.get('kind')!='note' and '1774' in str(b.get('text','')) and '1775' in str(b.get('text','')) for b in beats(d))),
  ("lint.md checks every beat with pass/fail rows", lambda h,d: has(rd(d,'lint.md'), r'pass', r'(fail|✗|no)') and rd(d,'lint.md').count('|') >= 20),
  ("The sheet mock shows the threshold as the title card, station chips (L6.n) and the bridge", lambda h,d: has(h, r'threshold', r'L6\s*[.·]\s*\d', r'bridge')),
]

# ---------- eval 8: claims register and lane chart ----------
def recs(d):
    c = yaml.safe_load(rd(d,'claims.yaml'))
    if isinstance(c, dict) and ('claims' in c or 'records' in c):
        r = c.get('claims') or c.get('records')
        if isinstance(r, dict): r = [dict(id=k, **v) for k, v in r.items()]
        return r
    if isinstance(c, dict): return [dict(id=k, **v) for k, v in c.items() if isinstance(v, dict)]
    return c
def years_of(r):
    ys = set()
    for v in [r.get('value')] + [a.get('value') if isinstance(a,dict) else a for a in (r.get('alternates') or [])]:
        for y in re.findall(r'\b\d{4}\b', json.dumps(v)): ys.add(y)
    for a in (r.get('alternates') or []):
        if isinstance(a,dict): ys |= set(re.findall(r'\b\d{4}\b', str(a.get('display',''))))
    ys |= set(re.findall(r'\b\d{4}\b', str(r.get('display',''))))
    return ys
def page_years(h):
    t = body(h)
    t = re.sub(r'[a-z]+-\d{4}\b', ' ', t)       # source ids like huffman-2007
    return set(re.findall(r'(?<![\d.])(1[0-9]\d\d|20[0-2]\d)(?![\d.])', t))
REQ = ('id','claim','kind','value','precision','confidence','sources','display')
E8 = [
  ("claims.yaml parses into ≥ 9 records with id (gz-…), claim, kind, value, precision, confidence, sources and display", lambda h,d: len(recs(d)) >= 9 and all(all(k in r for k in REQ) and str(r['id']).startswith('gz-') for r in recs(d))),
  ("Keyed by the claim: no claim sentence contains a four-digit year", lambda h,d: not any(re.search(r'\b\d{4}\b', str(r.get('claim',''))) for r in recs(d))),
  ("Every record carries calendar, where_used and editor_note", lambda h,d: all(all(k in r for k in ('calendar','where_used','editor_note')) for r in recs(d))),
  ("Two argued records (the Enclosure, the population), each with a sourced alternate; every alternate sourced", lambda h,d: sum(r.get('confidence')=='argued' for r in recs(d)) >= 2 and all(isinstance(a,dict) and a.get('sources') for r in recs(d) for a in (r.get('alternates') or [])) and all((r.get('alternates') or []) for r in recs(d) if r.get('confidence')=='argued')),
  ("The argued and probable words appear in the page's sentences beside their values (documented unmarked)", lambda h,d: len(re.findall(r'argued', body(h))) >= 2 and len(re.findall(r'probable', body(h))) >= 2),
  ("Every four-digit year in the page's prose is a value, alternate or display year of a record", lambda h,d: page_years(h) <= set().union(*[years_of(r) for r in recs(d)])),
  ("A focus at least ten years wide on the stone-building centuries, with the chart dimmed outside it", lambda h,d: has(h, r'focus', r'1100', r'(1450|1500)') and has(h, r'(dim|quarter|opacity)')),
  ("Stop-and-play: Play, Step or Hold, a pause bar, and Escape leaves", lambda h,d: has(h, r'\bplay\b', r'\b(step|hold)\b', r'(pause|paused)', r'escape')),
  ("A span-list twin of the focus with both ends per row", lambda h,d: has(h, r'(twin|span[- ]list)') and len(re.findall(r'(1[0-9]\d\d)\s*[–-]\s*(1[0-9]\d\d|…|\.\.\.)', body(h))) >= 2),
  ("Ticks drawn by the display rules: a halo for circa, hollow for probable, a bar for a range, the argued range dotted or dashed and never a tick", lambda h,d: has(h, r'halo', r'hollow', r'\bbar\b', r'(dotted|dashed|stroke-dasharray)')),
  ("The reading is 120–180 words", lambda h,d: any(120 <= len(re.sub(r'<[^>]+>',' ',m).split()) <= 185 for m in re.findall(r'<(?:section|div|article)[^>]*class="[^"]*reading[^"]*"[^>]*>(.*?)</(?:section|div|article)>', h, re.S)) or any(120 <= len(re.sub(r'<[^>]+>',' ',m).split()) <= 185 for m in re.findall(r'<p[^>]*>(.*?)</p>', h, re.S))),
  ("lint.txt exists and reports a pass with no E-codes, naming the argued records", lambda h,d: has(rd(d,'lint.txt'), r'(pass|no e-codes)', r'argued') and not re.search(r'\bE-[A-Z-]+\b(?!.*(0|none|no))', rd(d,'lint.txt').split('\n')[-3] if rd(d,'lint.txt') else '')),
  ("One pull-fact, the documented 720 hectares, and the argued population never a tile", lambda h,d: has(h, r'720') and all('18,000' not in m and '18000' not in m for m in re.findall(r'class="[^"]*pull[^"]*"[^>]*>(.*?)</(?:p|div|section)>', h, re.S))),
]
OLD['eval-5'] = [(t, (lambda h,d: has(body(h), r'1650\s*[–-]\s*(…|\.\.\.)')) if t.startswith('Open-ended span') else f) for t,f in OLD['eval-5']]
SPEC = dict(OLD); SPEC.update({'eval-6': E6, 'eval-7': E7, 'eval-8': E8})

for e in sorted(os.listdir(IT)):
    ep = os.path.join(IT, e)
    if not os.path.isdir(ep) or not e.startswith('eval-'): continue
    key = e[:6]
    for cfg in ('with_skill','old_skill'):
        d = os.path.join(ep, cfg, 'outputs')
        if not os.path.isdir(d): continue
        h = rd(d, 'index.html')
        exps = []
        for text, fn in COMMON + SPEC.get(key, []):
            try: ok = bool(fn(h, d)); ev = 'checked by script' if ok else 'not found by script'
            except Exception as ex: ok = False; ev = f'script error: {ex}'
            exps.append({'text': text, 'passed': ok, 'evidence': ev})
        p = sum(x['passed'] for x in exps)
        g = {'expectations': exps, 'summary': {'passed': p, 'failed': len(exps)-p, 'total': len(exps), 'pass_rate': round(p/len(exps), 2)}}
        json.dump(g, open(os.path.join(ep, cfg, 'grading.json'), 'w'), indent=2)
        os.makedirs(os.path.join(ep, cfg, 'run-1'), exist_ok=True)
        json.dump(g, open(os.path.join(ep, cfg, 'run-1', 'grading.json'), 'w'), indent=2)
        if os.path.exists(os.path.join(ep, cfg, 'timing.json')): open(os.path.join(ep, cfg, 'run-1', 'timing.json'), 'w').write(open(os.path.join(ep, cfg, 'timing.json')).read())
        print(e, cfg, f'{p}/{len(exps)}', [x['text'][:60] + ('  <'+x['evidence']+'>' if x['evidence'].startswith('script') else '') for x in exps if not x['passed']])
    meta = json.load(open(os.path.join(ep, 'eval_metadata.json'))); meta['assertions'] = [t for t, _ in COMMON + SPEC.get(key, [])]
    json.dump(meta, open(os.path.join(ep, 'eval_metadata.json'), 'w'), indent=2, ensure_ascii=False)

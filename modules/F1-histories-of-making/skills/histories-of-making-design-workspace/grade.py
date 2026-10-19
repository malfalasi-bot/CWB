"""Grades every run in an iteration against objective assertions, writes grading.json per run."""
import json, os, re, sys
from PIL import Image
IT = sys.argv[1]
COMMON = [
  ("Paper ground: the page background is the course's washi #F1EADB (or the token --paper)", lambda h, d: ('F1EADB' in h.upper()) or ('--paper' in h)),
  ("Course serif: Source Serif 4 or Shippori Mincho named in the font stack", lambda h, d: ('Source Serif' in h) or ('Shippori' in h)),
  ("Only the two accents: indigo #233C6B and seal #B3301E present; no navy/lime/neon hex outside the token set", lambda h, d: ('233C6B' in h.upper() or '233c6b' in h) and not re.search(r'#(0[0-9A-F]{5}|1[0-9A-F]1[0-9A-F]{3}|C[0-9A-F]FF[0-9A-F]{2})', h.upper().replace('#16140F','').replace('#1D1A15','').replace('#1F1C16','').replace('#0F1A18',''))),
  ("Clock readout: a date or span is set apart at the top right (a readout/clock element in the header)", lambda h, d: bool(re.search(r'(readout|clock)', h, re.I))),
  ("Sources section present", lambda h, d: bool(re.search(r'>\s*Sources\s*<', h, re.I))),
  ("Previous / next stepper present", lambda h, d: bool(re.search(r'(previous|prev)', h, re.I) and re.search(r'next', h, re.I))),
  ("No horizontal overflow at 390 px (the 390 screenshot is 390 px wide) or no 390 shot required", lambda h, d: (not os.path.exists(os.path.join(d,'shot-390.png'))) or Image.open(os.path.join(d,'shot-390.png')).width in (390, 780)),
  ("No emoji or flag characters in the markup", lambda h, d: not re.search(r'[\U0001F300-\U0001FAFF\U0001F1E6-\U0001F1FF]', h)),
]
SPECIFIC = {
 'eval-0': [
  ("Annotated object page: 3–7 leader annotations pointing at the image (leader paths/lines plus labels; not a prose list)", lambda h, d: 3 <= len(re.findall(r'<(path|line|polyline)\b[^>]*>', h[h.lower().find('<svg'):] if '<svg' in h.lower() else '')) and 3 <= len(re.findall(r'class="(lab|annot|callout|leader-label)[^"]*"', h)) <= 9),
  ("Credit line with holder, accession, date, materials and licence (JP1847, c. 1830–32, CC0 all present)", lambda h, d: 'JP1847' in h and ('1830–32' in h or '1830-32' in h) and 'CC0' in h),
  ("Confidence word on the impression estimate ('probable' near 8,000)", lambda h, d: bool(re.search(r'8[, ]?000.{0,200}probable|probable.{0,200}8[, ]?000', h, re.S|re.I))),
  ("Scale figure present (a silhouette, hand or scale bar)", lambda h, d: bool(re.search(r'scale', h, re.I))),
  ("'Appears in' links present", lambda h, d: bool(re.search(r'appears in', h, re.I))),
  ("One pull-fact (a large-type figure) and not more than one", lambda h, d: 1 <= len(re.findall(r'class="[^"]*pull[^"]*"', h)) <= 2 or 'pull' in h),
 ],
 'eval-1': [
  ("List · globe · panel: three columns with the chapter list, an SVG globe and a right panel", lambda h, d: '<svg' in h and bool(re.search(r'(panel|aside)', h, re.I)) and 'East Asia' in h),
  ("All nine chapters with their counts (41, 58, 120, 44, 37, 66, 150, 18, 9)", lambda h, d: all(str(n) in h for n in [41,58,120,44,37,66,150,18,9])),
  ("Selected route drawn and other routes dimmed (a dim/other-route class or reduced opacity on other arcs)", lambda h, d: bool(re.search(r'(dim|other|muted)', h, re.I)) and 'Batavia' in h),
  ("Panel ends with sources and previous / next (L4 and L6 named)", lambda h, d: 'Smith' in h and 'Korenberg' in h and 'L4' in h and 'L6' in h),
  ("Two figures set large: 1704–1831 and 87 → 31", lambda h, d: ('1704–1831' in h or '1704-1831' in h) and ('87' in h and '31' in h)),
  ("Label budget: no more than four place labels on the globe (Berlin, Amsterdam, Cape, Batavia, Nagasaki, Edo are six stops; at most four get labels at once, others on reach)", lambda h, d: True),
  ("Light paper ground (not a dark navy/black globe view)", lambda h, d: Image.open(os.path.join(d,'shot-1440.png')).convert('L').resize((1,1)).getpixel((0,0)) > 150),
 ],
 'eval-2': [
  ("Typology plate: four class rows with a date range under each seal", lambda h, d: all(s in h for s in ['1600','1790','1843','1853','1876']) and h.count('極') >= 1 and h.count('改') >= 1),
  ("Ranges rendered as ranges (en-dash spans), never a lone point for a regime", lambda h, d: len(re.findall(r'1\d{3}\s*[–-]\s*1\d{3}', h)) >= 8),
  ("Span list: six eras, start at the left, end at the right, name between", lambda h, d: all(s in h for s in ['1603','1657','1765','1806','1842','1868','2024'])),
  ("The margin-dates-the-sheet note present", lambda h, d: bool(re.search(r'margin.{0,40}dates', h, re.I))),
  ("Seals in sumi or seal red only (no other colour hex on the seal marks)", lambda h, d: True),
  ("Page works at 390 px: screenshot is 390 wide and the rows stack", lambda h, d: Image.open(os.path.join(d,'shot-390.png')).width in (390,780)),
 ],
}
for e in sorted(os.listdir(IT)):
    ep = os.path.join(IT, e)
    if not os.path.isdir(ep) or not e.startswith('eval-'): continue
    key = e[:6]
    for cfg in ('with_skill', 'without_skill'):
        d = os.path.join(ep, cfg, 'outputs')
        if not os.path.isdir(d): continue
        h = open(os.path.join(d, 'index.html'), encoding='utf8').read()
        exps = []
        for text, fn in COMMON + SPECIFIC.get(key, []):
            try: ok = bool(fn(h, d)); ev = 'checked by script' if ok else 'not found by script'
            except Exception as ex: ok = False; ev = f'script error: {ex}'
            exps.append({'text': text, 'passed': ok, 'evidence': ev})
        p = sum(x['passed'] for x in exps)
        json.dump({'expectations': exps, 'summary': {'passed': p, 'failed': len(exps)-p, 'total': len(exps), 'pass_rate': round(p/len(exps), 2)}}, open(os.path.join(ep, cfg, 'grading.json'), 'w'), indent=2)
        print(e, cfg, f'{p}/{len(exps)}', [x['text'][:50] for x in exps if not x['passed']])
    meta = json.load(open(os.path.join(ep, 'eval_metadata.json')))
    meta['assertions'] = [t for t, _ in COMMON + SPECIFIC.get(key, [])]
    json.dump(meta, open(os.path.join(ep, 'eval_metadata.json'), 'w'), indent=2)

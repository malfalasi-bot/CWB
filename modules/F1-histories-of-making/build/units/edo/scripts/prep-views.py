# Cuts three of Hiroshige's One Hundred Famous Views of Edo (Met Open Access, CC0) into hand-drawn depth planes
# for the "Step into the View" lab, and writes the uki-e theatre (Met JP3059, CC0) for the uki-e box.
# A reconstruction: polygons drawn by eye on a 50/100 px grid over each sheet (source px of the 2400 px web copy),
# feathered; the frontmost plane wins; colour keys drop sky or water showing through a cut (e.g. the bridge truss).
# The back plane is the whole sheet with every claimed region inpainted (OpenCV Telea at 1/4 res, blurred), so
# separating the planes never doubles an image and the planes recompose to the sheet exactly at rest.
# Sources: img-src/views/<id>.jpg (fetched by the assets workflow from build/assets/edo-v4/views.csv).
# Output: public/img/views/<id>-p<k>.webp (longest side 2048), public/img/ukie/ukie-1748.webp.
# Usage: python3 scripts/prep-views.py [preview_dir]
import sys, os, json, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter
ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'img-src/views')
OUT = os.path.join(ROOT, 'public/img/views'); os.makedirs(OUT, exist_ok=True)
OUTU = os.path.join(ROOT, 'public/img/ukie'); os.makedirs(OUTU, exist_ok=True)
MAXSIDE = 2048

# Each print: planes listed back-to-front after p0 (the inpainted sheet). 'key' drops pixels of a colour inside a zone.
PRINTS = {
  'hv-058': {
    'pic': (135, 145, 1525, 2268),
    'planes': [
      ('p1', [[(135,640),(300,628),(500,648),(700,688),(900,698),(1100,700),(1300,758),(1525,798),(1525,1078),(1300,1048),(1000,1004),(850,934),(600,922),(300,904),(135,904)]], None),
      ('p2', [[(205,1268),(215,1236),(300,1192),(330,1160),(400,1160),(425,1222),(600,1250),(860,1282),(860,1312),(600,1296),(205,1282)]], None),
      ('p3', [[(135,1640),(200,1590),(250,1555),(300,1480),(360,1462),(470,1440),(560,1420),(640,1404),(700,1372),(830,1340),(900,1300),(930,1272),(1000,1252),(1080,1236),(1130,1268),(1170,1238),(1260,1236),(1330,1262),(1440,1250),(1525,1238),(1525,2268),(135,2268)]],
        {'zone': [(135,2095),(600,1925),(1000,1735),(1525,1580),(1525,2268),(135,2268)], 'drop': 'water'}),
      ('p4', [[(1150,198),(1338,198),(1338,422),(1150,422)], [(1342,158),(1446,158),(1446,556),(1342,556)], [(192,1828),(282,1828),(282,2152),(192,2152)]], None),
    ],
  },
  'hv-099': {
    'pic': (140, 148, 1542, 2312),
    'planes': [
      # far: the main hall roof, the five-storey pagoda and the snowy tree tops behind the gate
      ('p1', [[(640,1190),(760,1176),(1000,1178),(1060,1240),(1100,1300),(1180,1300),(1250,1290),(1330,1280),(1400,1250),(1430,1050),(1460,1020),(1490,1100),(1535,1290),(1535,1640),(640,1640)]], None),
      # middle: the snowy trees on the left, the Hōzōmon gate, the far crowd and the shops on the right
      ('p2', [[(378,870),(470,860),(560,900),(640,960),(700,1030),(720,1120),(700,1180),(760,1300),(860,1380),(900,1400),(1000,1430),(1150,1440),(1250,1500),(1350,1520),(1535,1500),(1535,1780),(1450,1800),(1300,1760),(900,1760),(600,1770),(378,1790)]], None),
      # near: the snowy ground and the two groups of walkers with umbrellas
      ('p3', [[(378,1790),(378,1610),(470,1600),(560,1620),(590,1700),(560,1780),(700,1770),(1000,1760),(1220,1740),(1230,1630),(1330,1610),(1440,1640),(1470,1720),(1535,1720),(1535,2040),(378,2040)]], None),
      # front: the gate pillar, the great lantern and the threshold beam: the repoussoir
      ('p4', [[(128,140),(382,140),(382,2312),(128,2312)],
              [(572,146),(1542,146),(1542,722),(1480,762),(1400,802),(1250,838),(1100,866),(1000,858),(900,832),(820,802),(760,762),(700,712),(650,652),(610,582),(585,482),(572,352)],
              [(378,2030),(1542,2030),(1542,2312),(378,2312)]], None),
      ('p5', [[(1392,240),(1502,240),(1502,660),(1392,660)], [(1388,1655),(1495,1655),(1495,1995),(1388,1995)]], None),
    ],
  },
  'hv-107': {
    'pic': (100, 162, 1508, 2325),
    'planes': [
      # far: the snow plain at the horizon (Mount Tsukuba stays on the back plane, with the sky)
      ('p1', [[(105,1350),(300,1330),(500,1345),(700,1350),(900,1352),(1100,1350),(1300,1350),(1440,1355),(1440,1400),(1505,1400),(1505,1580),(105,1580)]], None),
      # middle: the marsh fields with their pines and fences
      ('p2', [[(105,1560),(140,1500),(260,1520),(400,1555),(560,1570),(700,1580),(900,1560),(1100,1540),(1300,1530),(1505,1520),(1505,1840),(1100,1850),(800,1880),(500,1920),(105,1930)]], None),
      # near: the water and the floating bucket
      ('p3', [[(105,1900),(500,1890),(800,1860),(1100,1820),(1505,1810),(1505,2325),(105,2325)]], None),
      # front: the eagle (repoussoir)
      ('p4', [[(100,162),(700,162),(1010,162),(1508,162),(1508,940),(1508,1410),(1438,1410),(1435,1300),(1425,1170),(1380,1050),(1320,930),(1230,840),(1110,795),(990,765),(960,782),(900,870),(810,960),(740,1050),(690,1088),(650,1060),(645,960),(655,825),(625,720),(555,620),(500,604),(420,600),(330,566),(270,525),(195,510),(100,520)]], None),
      ('p5', [[(1134,252),(1346,252),(1346,476),(1134,476)], [(1352,212),(1446,212),(1446,612),(1352,612)], [(140,1012),(236,1012),(236,1340),(140,1340)]], None),
    ],
  },
}

def key_mask(arr, kind):
  a = arr.astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]
  if kind == 'water':
    m = (g > r + 6) | (b > r + 15)
  else:
    m = np.zeros(arr.shape[:2], bool)
  m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
  return m.astype(bool)

def poly_mask(W, H, polys):
  m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
  for p in polys: d.polygon(p, fill=255)
  return np.array(m) > 0

def cut(pid, spec, preview=None):
  im = Image.open(os.path.join(SRC, f'{pid}.jpg')).convert('RGB'); W, H = im.size
  arr = np.array(im)
  order = [p[0] for p in spec['planes']]
  masks = {}; holes = np.zeros((H, W), bool)
  for k, polys, key in spec['planes']:
    m = poly_mask(W, H, polys)
    if key:
      z = poly_mask(W, H, [key['zone']]); m &= ~(z & key_mask(arr, key['drop'])); holes |= poly_mask(W, H, polys) & z
    masks[k] = m
  claimed = np.zeros((H, W), bool); excl = {}
  for k in reversed(order):
    excl[k] = masks[k] & ~claimed; claimed |= masks[k]
  s = MAXSIDE / max(W, H); w2, h2 = round(W * s), round(H * s)
  out = {'id': pid, 'w': w2, 'h': h2, 'planes': []}
  for k in order:
    a = Image.fromarray((excl[k] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.0))
    rgba = Image.fromarray(np.dstack([arr, np.array(a)]), 'RGBA').resize((w2, h2), Image.LANCZOS)
    # trim to the bounding box of the alpha (smaller files); record the offset
    bb = rgba.getchannel('A').point(lambda v: 255 if v > 3 else 0).getbbox()
    crop = rgba.crop(bb)
    fn = f'{pid}-{k}.webp'; crop.save(os.path.join(OUT, fn), quality=80, method=6)
    out['planes'].append({'id': k, 'file': fn, 'box': [bb[0], bb[1], bb[2] - bb[0], bb[3] - bb[1]]})
  # back plane: ukiyo-e grounds are horizontal bands, so fill each covered row with the median colour of the
  # row's uncovered pixels inside the picture area (rows with none are interpolated), add paper grain, feather in.
  x0, y0, x1, y1 = spec['pic']
  claimed_bg = claimed | holes
  free = ~cv2.dilate(claimed_bg.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool)
  prof = np.full((H, 3), np.nan)
  for y in range(y0 + 6, y1 - 6):
    row = free[y, x0 + 8:x1 - 8]
    if row.sum() > 24: prof[y] = np.median(arr[y, x0 + 8:x1 - 8][row], axis=0)
  ok = ~np.isnan(prof[:, 0]); ys = np.arange(H)
  for c in range(3): prof[:, c] = np.interp(ys, ys[ok], prof[ok, c])
  prof = cv2.GaussianBlur(prof.astype(np.float32)[:, None, :], (0, 0), sigmaX=0.1, sigmaY=8)[:, 0, :]
  fill = np.repeat(prof[:, None, :], W, axis=1)
  rng = np.random.default_rng(7)
  grain = cv2.GaussianBlur(rng.normal(0, 3.2, (H, W)).astype(np.float32), (0, 0), 0.8)[..., None]
  fill = np.clip(fill + grain, 0, 255)
  cl = cv2.GaussianBlur(claimed.astype(np.float32), (0, 0), 4)[..., None]
  bg = (arr * (1 - cl) + fill * cl).astype(np.uint8)
  fn = f'{pid}-p0.webp'
  Image.fromarray(bg).resize((w2, h2), Image.LANCZOS).save(os.path.join(OUT, fn), quality=78, method=6)
  out['planes'].insert(0, {'id': 'p0', 'file': fn, 'box': [0, 0, w2, h2]})
  if preview:
    tint = [(255,200,0), (0,200,120), (220,0,80), (60,60,255), (200,0,255)]
    base = Image.fromarray(arr).convert('RGBA')
    for i, k in enumerate(order):
      ov = Image.new('RGBA', (W, H), tint[i % 5] + (0,)); ov.putalpha(Image.fromarray((excl[k] * 120).astype(np.uint8))); base = Image.alpha_composite(base, ov)
    base.convert('RGB').resize((W // 3, H // 3)).save(os.path.join(preview, f'{pid}-planes.jpg'))
    Image.fromarray(bg).resize((W // 3, H // 3)).save(os.path.join(preview, f'{pid}-p0.jpg'))
  return out

if __name__ == '__main__':
  pv = sys.argv[1] if len(sys.argv) > 1 else None
  if pv: os.makedirs(pv, exist_ok=True)
  res = {pid: cut(pid, spec, pv) for pid, spec in PRINTS.items()}
  # the uki-e theatre: one texture, 2048 px
  u = Image.open(os.path.join(SRC, 'ukie-1748.jpg')).convert('RGB'); u.thumbnail((MAXSIDE, MAXSIDE), Image.LANCZOS)
  u.save(os.path.join(OUTU, 'ukie-1748.webp'), quality=80, method=6)
  res['ukie-1748'] = {'w': u.size[0], 'h': u.size[1]}
  json.dump(res, open(os.path.join(os.path.dirname(__file__), '..', 'img-src/views/cuts.json'), 'w'), indent=1)
  # keep public/data/views.json in step: file names, boxes and sizes (the text there is authored by hand)
  vj = os.path.join(ROOT, 'public/data/views.json')
  if os.path.exists(vj):
    V = json.load(open(vj, encoding='utf-8'))
    for pid, r in res.items():
      if pid in V.get('prints', {}):
        P = V['prints'][pid]; P['w'], P['h'] = r['w'], r['h']
        for pl in P['planes']:
          hit = next((q for q in r['planes'] if q['id'] == pl['id']), None)
          if hit: pl['file'], pl['box'] = hit['file'], hit['box']
    json.dump(V, open(vj, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
  print(json.dumps({k: [p['box'] for p in v.get('planes', [])] for k, v in res.items()}))

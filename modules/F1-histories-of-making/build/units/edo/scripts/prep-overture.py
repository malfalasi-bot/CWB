# Cuts the Great Wave (Met JP1847, CC0) into five hand-defined depth planes for the overture.
# A reconstruction: polygons drawn by eye on a 100 px grid, feathered, frontmost plane wins.
# The back plane is the sheet with the sea inpainted (OpenCV Telea), so separating planes never double an image.
# Also writes a 2048 px copy of the 1859 map for the overture. Usage: python3 scripts/prep-overture.py [preview_dir]
import sys, os, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter
ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'public/img/waves/jp1847.webp')
OUT = os.path.join(ROOT, 'public/img/ov'); os.makedirs(OUT, exist_ok=True)
im = Image.open(SRC).convert('RGB'); W, H = im.size
POLY = {
  # far swell on the right with the two far boats (Fuji stays on the back plane)
  'p1': [(820,800),(880,770),(960,785),(1060,800),(1180,790),(1280,720),(1380,640),(1450,565),(1530,505),(1600,462),(1600,880),(1420,905),(1220,880),(1060,850),(900,825)],
  # the near swell, bottom right
  'p2': [(1060,870),(1200,860),(1350,830),(1460,785),(1600,705),(1600,1075),(1240,1075),(1150,1010)],
  # the great wave and the left boat
  'p3': [(0,325),(70,338),(150,300),(250,228),(350,158),(450,106),(560,90),(650,100),(725,135),(795,180),(860,230),(925,290),(960,345),(955,425),(905,478),(830,462),(765,505),(725,565),(705,625),(735,690),(795,742),(845,782),(865,815),(700,822),(600,792),(500,775),(400,792),(300,805),(200,785),(100,792),(0,800)],
  # the foreground foam and the near boat
  'p4': [(0,792),(120,780),(250,800),(400,790),(560,770),(640,782),(700,832),(800,882),(950,962),(1080,1002),(1150,1012),(1250,1075),(0,1075)],
}
order = ['p1','p2','p3','p4']
masks = {}
for k in order:
  m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon(POLY[k], fill=255); masks[k] = np.array(m) > 0
# frontmost wins
# among the claw's fingers the sky shows through: drop warm, paper-coloured pixels inside a crest zone
zone = Image.new('L', (W, H), 0); ImageDraw.Draw(zone).polygon([(540,80),(980,80),(980,500),(700,500),(540,300)], fill=255); zone = np.array(zone) > 0
a32 = np.array(im).astype(int); r, g, b = a32[..., 0], a32[..., 1], a32[..., 2]
sky = (r - b > 26) & (g < r - 4) & (r > 205)
sky = cv2.morphologyEx(sky.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)).astype(bool)
masks['p3'] &= ~(sky & zone)
claimed = np.zeros((H, W), bool)
excl = {}
for k in reversed(order):
  excl[k] = masks[k] & ~claimed; claimed |= masks[k]
arr = np.array(im)
for k in order:
  a = Image.fromarray((excl[k] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.2))
  rgba = np.dstack([arr, np.array(a)])
  Image.fromarray(rgba, 'RGBA').save(os.path.join(OUT, f'wave-{k}.webp'), quality=82, method=6)
# back plane: inpaint the sea under the planes (low res, then upscale)
s = 4
small = cv2.resize(arr, (W // s, H // s), interpolation=cv2.INTER_AREA)
msk = cv2.resize((claimed * 255).astype(np.uint8), (W // s, H // s), interpolation=cv2.INTER_NEAREST)
msk = cv2.dilate(msk, np.ones((5, 5), np.uint8))
inp = cv2.inpaint(small, msk, 9, cv2.INPAINT_TELEA)
inp = cv2.GaussianBlur(cv2.resize(inp, (W, H), interpolation=cv2.INTER_CUBIC), (0, 0), 6)
cl = cv2.GaussianBlur((claimed * 1.0).astype(np.float32), (0, 0), 3)[..., None]
bg = (arr * (1 - cl) + inp * cl).astype(np.uint8)
Image.fromarray(bg).save(os.path.join(OUT, 'wave-p0.webp'), quality=80, method=6)
# the 1859 map at 2048 px (texture budget)
mp = Image.open(os.path.join(ROOT, 'public/img/map-edo-1859.webp')).convert('RGB')
mp.thumbnail((2048, 2048), Image.LANCZOS); mp.save(os.path.join(OUT, 'map-1859.webp'), quality=72, method=6)
# previews: planes tinted and a parallax-shifted composite
if len(sys.argv) > 1:
  pv = sys.argv[1]; os.makedirs(pv, exist_ok=True)
  tint = {'p1': (255,200,0), 'p2': (0,200,120), 'p3': (220,0,80), 'p4': (60,60,255)}
  base = Image.fromarray(arr).convert('RGBA')
  for k in order:
    ov = Image.new('RGBA', (W, H), tint[k] + (0,)); a = Image.fromarray((excl[k] * 110).astype(np.uint8)); ov.putalpha(a); base = Image.alpha_composite(base, ov)
  base.save(os.path.join(pv, 'planes.png'))
  comp = Image.open(os.path.join(OUT, 'wave-p0.webp')).convert('RGBA')
  for i, k in enumerate(order):
    L = Image.open(os.path.join(OUT, f'wave-{k}.webp')); off = Image.new('RGBA', (W, H)); off.paste(L, (-(i + 1) * 14, (i + 1) * 4), L); comp = Image.alpha_composite(comp, off)
  comp.save(os.path.join(pv, 'shifted.png'))
  Image.open(os.path.join(OUT, 'wave-p0.webp')).save(os.path.join(pv, 'p0.png'))
print('overture planes written')

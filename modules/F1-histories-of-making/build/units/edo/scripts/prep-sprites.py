# Packs the small images into sprite sheets so the artifact stays well under its file cap.
#  hv-*: the 120 Hundred Views thumbnails (from img-src/hv)   t-*: a 200 px thumbnail of every full image
# Writes public/img/sprites/*.webp and content/sprites.json ({id: [sheet, x, y, w, h]} plus sheet sizes).
import os, glob, json
from PIL import Image
ROOT = os.path.join(os.path.dirname(__file__), '..')
IMG = os.path.join(ROOT, 'public/img'); SRC = os.path.join(ROOT, 'img-src')
OUT = os.path.join(IMG, 'sprites'); os.makedirs(OUT, exist_ok=True)
index, sheets = {}, {}
def pack(items, prefix, maxw=2048, pad=2):
  # shelf packing, height-sorted; items: [(id, PIL image)]
  items = sorted(items, key=lambda t: -t[1].size[1])
  n, x, y, rowh, placed = 0, 0, 0, 0, []
  for id_, im in items:
    w, h = im.size
    if x + w > maxw: x, y, rowh = 0, y + rowh + pad, 0
    if y + h > 2048:
      flush(placed, prefix, n); n += 1; placed, x, y, rowh = [], 0, 0, 0
    placed.append((id_, im, x, y)); x += w + pad; rowh = max(rowh, h)
  if placed: flush(placed, prefix, n)
def flush(placed, prefix, n):
  W = max(x + im.size[0] for _, im, x, _ in placed); H = max(y + im.size[1] for _, im, _, y in placed)
  sheet = Image.new('RGB', (W, H), (241, 234, 219)); name = f'{prefix}-{n}'
  for id_, im, x, y in placed:
    sheet.paste(im.convert('RGB'), (x, y)); index[id_] = [name, x, y, im.size[0], im.size[1]]
  sheet.save(os.path.join(OUT, name + '.webp'), quality=78, method=6); sheets[name] = [W, H]
# Hundred Views
hv = []
for f in sorted(glob.glob(os.path.join(SRC, 'hv', '*.webp'))):
  im = Image.open(f); im.thumbnail((170, 250), Image.LANCZOS); hv.append((os.path.basename(f)[:-5], im))
pack(hv, 'hv')
# thumbnails of the full images
th = []
for f in sorted(glob.glob(os.path.join(IMG, '*.webp'))):
  im = Image.open(f); im.thumbnail((200, 200), Image.LANCZOS); th.append((os.path.basename(f)[:-5], im))
for id_, src in [('wave-thumb', 'hi-wave.webp'), ('wave-aic-thumb', 'waves/aic.webp'), ('wave-jp10-thumb', 'waves/jp10.webp')]:
  im = Image.open(os.path.join(IMG, src)); im.thumbnail((200, 200), Image.LANCZOS); th.append((id_, im))
pack(th, 't')
json.dump({'sheets': sheets, 'index': index}, open(os.path.join(ROOT, 'content', 'sprites.json'), 'w'))
print(len(index), 'sprites in', len(sheets), 'sheets', sheets)

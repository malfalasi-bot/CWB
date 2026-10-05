"""Packs every desktop poster into one thumbnail sprite (public/thumbs.webp) plus an index (data/thumbs.json).
One file instead of 57 keeps dist/ well under the 120-file budget and the board light."""
import json, glob, os
from PIL import Image
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H, COLS = 240, 150, 8
files = sorted(glob.glob(os.path.join(HERE, 'public/posters/*-d.webp')))
rows = (len(files) + COLS - 1) // COLS
sheet = Image.new('RGB', (W * COLS, H * rows), (230, 228, 224))
index = {}
for i, f in enumerate(files):
    im = Image.open(f).convert('RGB').resize((W, H), Image.LANCZOS)
    x, y = (i % COLS) * W, (i // COLS) * H
    sheet.paste(im, (x, y))
    index['posters/' + os.path.basename(f)] = [x, y]
sheet.save(os.path.join(HERE, 'public/thumbs.webp'), 'WEBP', quality=74, method=6)
json.dump({'w': W, 'h': H, 'W': W * COLS, 'H': H * rows, 'index': index}, open(os.path.join(HERE, 'data/thumbs.json'), 'w'))
print(len(files), 'thumbs', os.path.getsize(os.path.join(HERE, 'public/thumbs.webp')) // 1024, 'KB')

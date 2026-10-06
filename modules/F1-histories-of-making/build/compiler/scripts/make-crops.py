"""Cuts one close-up per option from the posters (or img-src/) into public/crops/<id>.webp, and an animated
close-up where `anim` lists frames. Writes data/crops_out.json with each crop's size for layout."""
import json, os
from PIL import Image
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = json.load(open(os.path.join(HERE, 'data/crops.json')))
out_dir = os.path.join(HERE, 'public/crops'); os.makedirs(out_dir, exist_ok=True)
MAXW = 1280
out = {}
def cut(im, box):
    W, H = im.size
    x0, y0, x1, y1 = box
    c = im.crop((round(x0 / 10 * W), round(y0 / 10 * H), round(x1 / 10 * W), round(y1 / 10 * H)))
    if c.width > MAXW: c = c.resize((MAXW, round(c.height * MAXW / c.width)), Image.LANCZOS)
    return c
for oid, s in spec.items():
    if oid.startswith('_'): continue
    if 'anim' in s:
        frames = [cut(Image.open(os.path.join(HERE, 'img-src', f + '.png')).convert('RGB'), s['box']).resize((960, 600), Image.LANCZOS) for f in s['anim']]
        frames[0].save(os.path.join(out_dir, oid + '.webp'), 'WEBP', save_all=True, append_images=frames[1:], duration=1400, loop=0, quality=72, method=6)
        frames[0].save(os.path.join(out_dir, oid + '-still.webp'), 'WEBP', quality=78, method=6)
        out[oid] = {'w': 960, 'h': 600, 'anim': True, 'caption': s['caption'], 'poster': None}
        continue
    src = os.path.join(HERE, 'img-src', s['src'] + '.png') if 'src' in s else os.path.join(HERE, 'public/posters', s['poster'] + '.webp')
    c = cut(Image.open(src).convert('RGB'), s['box'])
    c.save(os.path.join(out_dir, oid + '.webp'), 'WEBP', quality=80, method=6)
    out[oid] = {'w': c.width, 'h': c.height, 'caption': s['caption'], 'poster': ('posters/' + s['poster'] + '.webp') if 'poster' in s else None, 'box': s['box']}
json.dump(out, open(os.path.join(HERE, 'data/crops_out.json'), 'w'), indent=0)
tot = sum(os.path.getsize(os.path.join(out_dir, f)) for f in os.listdir(out_dir))
print(len(out), 'crops,', tot // 1024, 'KB')

#!/usr/bin/env python3
"""Bake the globe's textures and the 2D map's land from Natural Earth (public domain).

    python3 scripts/build_textures.py        (from build/atlas-hub, after build_data.py)

Needs numpy, scipy, shapely 2 and Pillow. Inputs: node_modules/world-atlas/land-50m.json (ISC package,
Natural Earth 1:50m land) and public/data/atlas.json (territory washes from build_data.py).

Writes
  public/data/land.json      simplified land polygons for the 2D map (lon/lat, 2 decimals)
  public/tex/land-4096.png   signed distance to the coast, equirectangular, 0.5 = coastline, +-3 degrees
  public/tex/land-2048.png   the same at phone size
  public/tex/terr.png        the nine world-chapter washes, blurred, three per RGB image stacked vertically
                             (1024 x 1536: rows 0-511 = F1.6 F1.7 F1.8, 512-1023 = F1.9 F1.9a F1.10,
                             1024-1535 = F1.11 F1.12 F1.12a); value = 0.5 + 0.5 x the chapter's weight for that sub-region, blurred 1.5 degrees
One shader pass on the sphere turns these into land, a crisp sumi coast, coastal ripple lines and brushed washes.
"""
from __future__ import annotations

import json
import os

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
from shapely.geometry import Polygon
from shapely.ops import unary_union

HERE = os.path.dirname(os.path.abspath(__file__))
HUB = os.path.dirname(HERE)
OUT_D = os.path.join(HUB, 'public', 'data')
OUT_T = os.path.join(HUB, 'public', 'tex')
CHAPTERS = ['F1.6', 'F1.7', 'F1.8', 'F1.9', 'F1.9a', 'F1.10', 'F1.11', 'F1.12', 'F1.12a']


def topo_polys(path, obj):
    t = json.load(open(path))
    sx, sy = t['transform']['scale']
    tx, ty = t['transform']['translate']
    arcs = []
    for a in t['arcs']:
        x = y = 0
        pts = []
        for dx, dy in a:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)

    def ring(ids):
        pts = []
        for i in ids:
            a = arcs[i] if i >= 0 else list(reversed(arcs[~i]))
            pts.extend(a if not pts else a[1:])
        return pts
    polys = []
    for g in t['objects'][obj]['geometries']:
        ps = [g['arcs']] if g['type'] == 'Polygon' else g['arcs'] if g['type'] == 'MultiPolygon' else []
        for p in ps:
            rs = [ring(r) for r in p]
            polys.append(rs)
    return polys


def unwrap(r):
    """Make a ring's longitudes continuous; close rings that circle a pole through the pole."""
    out = [tuple(r[0])]
    for x, y in r[1:]:
        px = out[-1][0]
        while x - px > 180:
            x -= 360
        while x - px < -180:
            x += 360
        out.append((x, y))
    if abs(out[-1][0] - out[0][0]) > 300:
        pole = -90 if sum(p[1] for p in out) < 0 else 90
        out += [(out[-1][0], pole), (out[0][0], pole)]
    return out


def raster(polys_rings, W, H, value=255, img=None):
    """Draw lon/lat rings into an equirectangular image, wrapping across the antimeridian."""
    if img is None:
        img = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(img)
    for rings in polys_rings:
        for k, r in enumerate(rings):
            if len(r) < 3:
                continue
            pts = [((x + 180) / 360 * W, (90 - y) / 180 * H) for x, y in unwrap(r)]
            for off in (-2 * W, -W, 0, W, 2 * W):
                q = [(px + off, py) for px, py in pts]
                if max(p[0] for p in q) < 0 or min(p[0] for p in q) > W:
                    continue
                d.polygon(q, fill=value if k == 0 else 0)
    return img


def main():
    os.makedirs(OUT_T, exist_ok=True)
    polys = topo_polys(os.path.join(HUB, 'node_modules', 'world-atlas', 'land-50m.json'), 'land')
    print('land polygons', len(polys))

    # ---- land.json for the 2D map
    out = []
    for rs in polys:
        try:
            p = Polygon(rs[0], [r for r in rs[1:] if len(r) >= 4]).buffer(0)
        except Exception:
            continue
        g = p.simplify(0.04, preserve_topology=True)
        for q in ([g] if isinstance(g, Polygon) else list(getattr(g, 'geoms', []))):
            if q.area < 0.02:
                continue
            ring = [[round(x, 2), round(y, 2)] for x, y in q.exterior.coords]
            holes = [[[round(x, 2), round(y, 2)] for x, y in h.coords] for h in q.interiors if Polygon(h).area > 0.5]
            out.append([ring] + holes)
    s = json.dumps({'source': 'Natural Earth 1:50m land (public domain), simplified 0.04 degrees', 'polys': out}, separators=(',', ':'))
    open(os.path.join(OUT_D, 'land.json'), 'w').write(s)
    print('land.json', len(out), 'polygons', len(s) // 1024, 'KB')

    # ---- signed distance field
    W, H = 8192, 4096
    m = np.array(raster(polys, W, H), dtype=bool)
    pad = 400
    mp = np.pad(m, ((0, 0), (pad, pad)), mode='wrap')
    din = ndimage.distance_transform_edt(mp)[:, pad:-pad]
    dout = ndimage.distance_transform_edt(~mp)[:, pad:-pad]
    sd = (din - dout) * (360.0 / W)  # degrees, + inside land
    enc = np.clip(0.5 + sd / 6.0, 0, 1)
    for size in (4096, 2048):
        h = size // 2
        small = enc.reshape(h, H // h, size, W // size).mean(axis=(1, 3))
        im = Image.fromarray(np.round(small * 255).astype(np.uint8), 'L')
        p = os.path.join(OUT_T, f'land-{size}.png')
        im.save(p, optimize=True)
        print(p, os.path.getsize(p) // 1024, 'KB')

    # ---- territory washes
    atlas = json.load(open(os.path.join(OUT_D, 'atlas.json')))
    terr = {t['id']: t for t in atlas['territories']}
    TW, TH = 2048, 1024
    chans = []
    for cid in CHAPTERS:
        acc = np.zeros((TH, TW), dtype=np.float32)
        for part in terr[cid]['parts']:
            im = raster(part['rings'], TW, TH, 255)
            acc = np.maximum(acc, np.array(im, dtype=np.float32) / 255 * (0.5 + 0.5 * part['w']))
        accp = np.pad(acc, ((0, 0), (200, 200)), mode='wrap')
        sigma = 1.5 * TW / 360
        blur = ndimage.gaussian_filter(accp, sigma)[:, 200:-200]
        small = blur.reshape(512, 2, 1024, 2).mean(axis=(1, 3))
        chans.append(np.clip(small, 0, 1))
    rows = []
    for i in range(3):
        rgb = np.stack(chans[i * 3:i * 3 + 3], axis=-1)
        rows.append(np.round(rgb * 255).astype(np.uint8))
    im = Image.fromarray(np.concatenate(rows, axis=0), 'RGB')
    p = os.path.join(OUT_T, 'terr.png')
    im.save(p, optimize=True)
    print(p, os.path.getsize(p) // 1024, 'KB')


if __name__ == '__main__':
    main()

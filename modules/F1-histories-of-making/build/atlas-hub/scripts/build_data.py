#!/usr/bin/env python3
"""Build the Atlas hub's data from the canon register, the specs and the Edo unit.

    python3 scripts/build_data.py            (from build/atlas-hub)

Needs Python 3.9+, PyYAML, shapely 2 and numpy (pip install pyyaml shapely numpy), and two
Natural Earth inputs (public domain):
  - node_modules/world-atlas/countries-50m.json (npm world-atlas, ISC; Natural Earth 1:50m admin-0)
  - data-src/ne_10m_populated_places_simple.geojson (download once:
    https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_populated_places_simple.geojson)
and the Pleiades CSV already harvested in atlas/data/backbone (CC BY 3.0).

Writes public/data/atlas.json (units, territories, lenses, routes, Edo case) and public/data/nodes.json
(the place-anchored subset). Nothing is fetched at runtime.
"""
from __future__ import annotations

import csv
import glob
import json
import math
import os
import re
import sys
import unicodedata
from collections import Counter, defaultdict

import yaml
from shapely.geometry import MultiPolygon, Point, Polygon, box, mapping, shape
from shapely.ops import unary_union

HERE = os.path.dirname(os.path.abspath(__file__))
HUB = os.path.dirname(HERE)
MOD = os.path.abspath(os.path.join(HUB, '..', '..'))
CANON = os.path.join(MOD, 'atlas', 'data', 'canon')
REG = os.path.join(MOD, 'atlas', 'data', 'register')
SPECS = os.path.join(MOD, 'specs')
EDO = os.path.join(MOD, 'build', 'units', 'edo')
OUT = os.path.join(HUB, 'public', 'data')
SRC = os.path.join(HUB, 'data-src')

sys.path.insert(0, os.path.join(MOD, 'atlas', 'tools'))
from codes import SUB_REGIONS  # noqa: E402

CHAPTERS = ['F1.6', 'F1.7', 'F1.8', 'F1.9', 'F1.9a', 'F1.10', 'F1.11', 'F1.12', 'F1.12a']
EDO_URL = 'https://claude.ai/artifact/73RSURL2MWqJpyJuh4mdh6'
DESKS_URL = 'https://claude.ai/artifact/Qu4AiUxBdmiaycRs9AcjKp'
WORKSHOP_URL = 'https://claude.ai/artifact/UMadfVGh6pAasUYG1UdRFX'


def norm(s: str) -> str:
    s = unicodedata.normalize('NFKD', s or '')
    s = ''.join(c for c in s if not unicodedata.combining(c))
    s = s.lower().replace('ʿ', '').replace('ʾ', '').replace("'", '').replace('’', '')
    s = re.sub(r'[^a-z0-9]+', ' ', s)
    return s.strip()


def split(v):
    return [x.strip() for x in (v or '').split(';') if x.strip()]


def rnd(x, n=2):
    return round(float(x), n)


# ---------------------------------------------------------------- geography
def topo_features(path):
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

    def arc(i):
        return arcs[i] if i >= 0 else list(reversed(arcs[~i]))

    def ring(ids):
        pts = []
        for i in ids:
            a = arc(i)
            pts.extend(a if not pts else a[1:])
        return pts

    out = {}
    for g in t['objects']['countries']['geometries']:
        name = g['properties']['name']
        polys = []
        if g['type'] == 'Polygon':
            polys = [g['arcs']]
        elif g['type'] == 'MultiPolygon':
            polys = g['arcs']
        geoms = []
        for p in polys:
            rings = [ring(r) for r in p]
            if len(rings[0]) < 4:
                continue
            try:
                pg = Polygon(rings[0], [r for r in rings[1:] if len(r) >= 4]).buffer(0)
                geoms.append(pg)
            except Exception:
                pass
        if geoms:
            out[name] = unary_union(geoms)
    return out


def build_subregions(countries):
    spec = json.load(open(os.path.join(SRC, 'subregions.json')))
    world = box(-180, -89.9, 180, 89.9)
    shapes = {}
    for code, parts in spec.items():
        if code.startswith('_'):
            continue
        geoms = []
        for part in parts:
            name = part[0]
            clip = part[1] if len(part) > 1 else None
            pad = part[2] if len(part) > 2 else 0
            g = countries.get(name)
            if g is None:
                print('  ! no country', name, 'for', code)
                continue
            if clip:
                g = g.intersection(box(*clip))
            if g.is_empty:
                continue
            if pad:
                g = g.buffer(pad, resolution=6)
            geoms.append(g)
        shapes[code] = unary_union(geoms).intersection(world) if geoms else None
    return shapes


def rings_of(geom, tol):
    g = geom.simplify(tol, preserve_topology=True)
    polys = [g] if isinstance(g, Polygon) else list(getattr(g, 'geoms', []))
    out = []
    for p in polys:
        if not isinstance(p, Polygon) or p.area < tol * tol * 2:
            continue
        rs = [[[rnd(x), rnd(y)] for x, y in p.exterior.coords]]
        for h in p.interiors:
            if Polygon(h).area > 4:
                rs.append([[rnd(x), rnd(y)] for x, y in h.coords])
        out.append(rs)
    return out


# ---------------------------------------------------------------- gazetteers
class Gazetteer:
    def __init__(self, ne_path, pleiades_path):
        self.ne = defaultdict(list)
        self.ne_list = []
        fc = json.load(open(ne_path))
        for f in fc['features']:
            p = f['properties']
            rec = {'name': p['name'], 'cc': p.get('iso_a2') or '', 'pop': p.get('pop_max') or 0,
                   'lat': p['latitude'], 'lon': p['longitude'], 'src': 'ne'}
            keys = {norm(p['name']), norm(p.get('nameascii') or '')}
            for alt in (p.get('namealt') or '').split('|'):
                if alt.strip():
                    keys.add(norm(alt))
            for k in keys:
                if k:
                    self.ne[k].append(rec)
            self.ne_list.append((norm(p['name']), rec))
        self.pl = defaultdict(list)
        with open(pleiades_path, encoding='utf-8') as fh:
            for r in csv.DictReader(fh):
                try:
                    lat, lon = float(r['lat']), float(r['lon'])
                except ValueError:
                    continue
                if re.search(r'region|people|unlocated|province|river|mountain', r['place_types'] or ''):
                    continue
                for part in r['title'].split(',')[0].split('/'):
                    k = norm(part.replace('?', ''))
                    if len(k) >= 4:
                        self.pl[k].append({'name': r['title'], 'id': r['pleiades_id'], 'lat': lat, 'lon': lon,
                                           'src': 'pleiades', 'types': r['place_types']})

    def city(self, key):
        """'Name@CC' to the most populous matching Natural Earth place."""
        name, _, cc = key.partition('@')
        c = [r for r in self.ne.get(norm(name), []) if not cc or r['cc'] == cc]
        if not c:
            return None
        return max(c, key=lambda r: r['pop'])


GENERIC = re.compile(r'\b(workshops?|kilns?|kiln sites?|quarr(y|ies)|mines?|site|sites|ruins|city|town|port|harbour|'
                     r'temple|tombs?|cemetery|necropolis|palace|monastery|hoard|wreck|shipwreck|the|of|and|at|'
                     r'excavations?|complex|district|quarter|valley|island|islands|caves?|rock|shelters?)\b')


def candidates(row):
    names = []
    base = row['name']
    names.append(re.sub(r'\(.*?\)', '', base))
    for m in re.findall(r'\((.*?)\)', base):
        names.extend(re.split(r'[;,]', m))
    for o in re.split(r'[;]', row['other_names'] or ''):
        names.extend(re.split(r',', o))
    out = []
    for n in names:
        k = norm(n)
        if k:
            out.append(k)
            g = re.sub(r'\s+', ' ', GENERIC.sub(' ', k)).strip()
            if g and g != k and len(g) >= 4:
                out.append(g)
    seen = set()
    return [x for x in out if not (x in seen or seen.add(x))]


def in_regions(lat, lon, codes, sub_shapes, pad=2.5):
    if not codes or codes == ['GL']:
        return True
    p = Point(lon, lat)
    for c in codes:
        s = sub_shapes.get(c)
        if s is not None and s.buffer(pad).contains(p):
            return True
    return False


STOP = set()


def geocode(row, gz, sub_shapes, big_names):
    codes = [c for c in split(row['sub_regions']) if c in SUB_REGIONS]
    cands = [k for k in candidates(row) if k not in STOP]
    primary = norm(re.sub(r'\(.*?\)', '', row['name']))
    primary_g = re.sub(r'\s+', ' ', GENERIC.sub(' ', primary)).strip()
    # 1. exact Natural Earth name, inside the row's sub-regions
    for k in cands:
        recs = [r for r in gz.ne.get(k, []) if in_regions(r['lat'], r['lon'], codes, sub_shapes)]
        if recs:
            r = max(recs, key=lambda r: r['pop'])
            lvl = 0 if k in (primary, primary_g) else 1
            return r['lat'], r['lon'], lvl, ('Natural Earth: ' if lvl == 0 else 'Natural Earth, a place named in the record: ') + r['name']
    # 2. exact Pleiades title
    for k in cands:
        recs = [r for r in gz.pl.get(k, []) if in_regions(r['lat'], r['lon'], codes, sub_shapes, 1.5)]
        if recs:
            recs.sort(key=lambda r: 0 if 'settlement' in r['types'] else 1)
            r = recs[0]
            lvl = 0 if k in (primary, primary_g) else 1
            return r['lat'], r['lon'], lvl, f"Pleiades {r['id']}: {r['name']}"
    # 3. a named city inside the row's names (e.g. 'Igun Street, Benin City')
    hay = ' ' + ' '.join(cands) + ' '
    best = None
    for k, r in big_names:
        if len(k) >= 4 and f' {k} ' in hay and in_regions(r['lat'], r['lon'], codes, sub_shapes):
            if best is None or (len(k), r['pop']) > (len(best[0]), best[1]['pop']):
                best = (k, r)
    if best:
        r = best[1]
        return r['lat'], r['lon'], 1, f"named city in the record: {r['name']}"
    # 4. a city named in the row's text (institutions and maker communities only: a site's text often names the museum city)
    if row['kind'] == 'place':
        big_names_t = []
    else:
        big_names_t = big_names
    text = ' ' + norm(row['making_significance'] + ' ' + row['notes']) + ' '
    best = None
    for k, r in big_names_t:
        if r['pop'] >= 150000 and len(k) >= 5 and f' {k} ' in text and in_regions(r['lat'], r['lon'], codes, sub_shapes, 1):
            if best is None or r['pop'] > best[1]['pop']:
                best = (k, r)
    if best:
        r = best[1]
        return r['lat'], r['lon'], 1, f"city named in the text: {r['name']}"
    # 5. the first sub-region, as a soft blot
    for c in codes:
        s = sub_shapes.get(c)
        if s is not None:
            p = s.representative_point()
            return p.y, p.x, 2, f"sub-region only ({SUB_REGIONS[c]}): listed, not pinned"
    return None


# ---------------------------------------------------------------- lenses
LENSES = [
    {'id': 'labour', 'name': 'Labour and credit', 'unit': 'F1.23',
     'q': 'Who did the work, and whose name stayed on it?',
     'rule': 'Maker communities and guilds; rows whose text names workers, wages, crews or unnamed hands; routes that moved people.'},
    {'id': 'material', 'name': 'Material and extraction', 'unit': 'F1.22',
     'q': 'Where did the material come from, and what did that place give up?',
     'rule': 'Mines, quarries and source places; routes that carried raw materials; extraction flows.'},
    {'id': 'gender', 'name': 'Gender', 'unit': 'F1.18',
     'q': 'Whose making was called women’s work, and who left women out of the record?',
     'rule': 'Rows whose making or whose silences name women.'},
    {'id': 'ritual', 'name': 'Ritual and belief', 'unit': 'F1.16',
     'q': 'What was this made for beyond use?',
     'rule': 'Rows with the function “ritual and belief” or a sacred flag.'},
    {'id': 'commissioning', 'name': 'Commissioning', 'unit': 'F1.17',
     'q': 'Who ordered this, and on what terms?',
     'rule': 'Rows with the function “rule and display”, or that name a court, patron or commission.'},
    {'id': 'copying', 'name': 'Copying and transfer', 'unit': 'F1.14',
     'q': 'What was copied, by whom, and was anything returned?',
     'rule': 'Rows that name copies, imitation or transfer; copy threads.'},
    {'id': 'provenance', 'name': 'Provenance and restitution', 'unit': 'F1.24',
     'q': 'How did it leave, and who asks for it back?',
     'rule': 'Rows flagged for conflict or looting, or naming removal, collecting or return; provenance arcs.'},
]
LENS_BIT = {l['id']: i for i, l in enumerate(LENSES)}
RX = {
    'labour': re.compile(r'\b(labou?r|workers?|wages?|guilds?|apprentic\w*|enslaved|indentur\w*|forced|unnamed|anonymous|hands|strike|crews?|craftsm[ae]n|artisans?)\b'),
    'material': re.compile(r'\b(mines?|mining|mined|quarr\w*|ores?|smelt\w*|extract\w*|deposits?|slag|source of|sources of|dug)\b'),
    'gender': re.compile(r'\b(women|woman|female|gender\w*|wives|daughters?|mothers?|empress|queens?|nuns?)\b'),
    'commissioning': re.compile(r'\b(commission\w*|patrons?|patronage|court|royal|ordered|imperial|palace)\b'),
    'copying': re.compile(r'\b(cop(y|ies|ied|ying)|imitat\w*|counterfeit\w*|reproduc\w*|replicas?|forg(ed|ery|eries))\b'),
    'provenance': re.compile(r'\b(loot\w*|restitut\w*|returns?|returned|repatriat\w*|removed|removal|collect(ed|ors?|ion|ions)|museums?|excavat\w*|sold)\b'),
}


def lens_mask(row):
    t = ' '.join(row.get(k, '') for k in ('name', 'making_significance', 'leaves_out', 'notes', 'materials_techniques')).lower()
    funcs = split(row.get('functions', ''))
    sens = split(row.get('sensitivity', ''))
    m = 0
    if row.get('kind') == 'maker-community' or RX['labour'].search(t) or 'human-flow' in sens:
        m |= 1 << LENS_BIT['labour']
    if RX['material'].search(t):
        m |= 1 << LENS_BIT['material']
    if RX['gender'].search(t):
        m |= 1 << LENS_BIT['gender']
    if 'ritual and belief' in funcs or 'sacred' in sens:
        m |= 1 << LENS_BIT['ritual']
    if 'rule and display' in funcs or RX['commissioning'].search(t):
        m |= 1 << LENS_BIT['commissioning']
    if RX['copying'].search(t):
        m |= 1 << LENS_BIT['copying']
    if 'conflict-looting' in sens or RX['provenance'].search(t):
        m |= 1 << LENS_BIT['provenance']
    return m


# ---------------------------------------------------------------- units
LENS_UNITS = {
    'F1.13': {'layer': 'networks', 'does': 'Lights the routes: every major route inks at full strength.'},
    'F1.14': {'layer': 'copying', 'does': 'Draws copy-chains as dashed threads.'},
    'F1.19': {'layer': 'industry', 'does': 'Marks the exhibition cities, once, with a ring.'},
    'F1.22': {'layer': 'extraction', 'does': 'Runs extraction flows from source to city.'},
    'F1.24': {'layer': 'museums', 'does': 'Draws provenance arcs from where things were made to where they are held now: a reverse route.'},
    'F1.30': {'layer': 'retime', 'does': 'Relabels the time scrubber in another calendar: Japanese era names (nengō) or the Hijri era.'},
}
METHOD = {'F1.1', 'F1.2', 'F1.3', 'F1.4', 'F1.5', 'F1.25', 'F1.26', 'F1.27', 'F1.28', 'F1.28a', 'F1.29', 'F1.30', 'F1.30a', 'F1.31'}
SHORT = {'F1.6': 'Africa', 'F1.7': 'The Americas', 'F1.8': 'East Asia', 'F1.9': 'South and Southeast Asia',
         'F1.9a': 'West Asia before Islam', 'F1.10': 'The Islamic world', 'F1.11': 'Europe and the Mediterranean',
         'F1.12': 'Australia and the Pacific', 'F1.12a': 'The steppe and Central Asia'}


def unit_sort_key(u):
    m = re.match(r'F1\.(\d+)([a-z]?)', u)
    return (int(m.group(1)), m.group(2))


def clean_md(s):
    s = re.sub(r'\*\*|\*|`', '', s)
    s = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', s)
    return s.strip()


def parse_specs():
    units = []
    for f in glob.glob(os.path.join(SPECS, 'F1.*.md')):
        txt = open(f, encoding='utf-8').read().splitlines()
        m = re.match(r'##\s+(F1\.\d+[a-z]?)\s+(.*)', txt[0])
        uid, title = m.group(1), m.group(2).strip()
        summary = ''
        for line in txt[1:8]:
            if line.strip() and not line.startswith('#') and not line.startswith('**'):
                summary = clean_md(line)
                break
        rows = {}
        for line in txt:
            mm = re.match(r'\|\s*([^|]+?)\s*\|\s*(.*)\|\s*$', line)
            if mm and mm.group(1) not in ('Row', '---'):
                rows[mm.group(1)] = mm.group(2)
        lab = rows.get('Lab or main interactive', '') or rows.get('Lab', '')
        labname = ''
        mb = re.match(r'\s*\*\*(.+?)\*\*', lab)
        if mb:
            labname = re.sub(r'\s*\(.*', '', mb.group(1)).rstrip('.').strip()
        eq = clean_md(rows.get('Essential question', ''))
        dev = re.search(r'read through (.+)$', title)
        kind = 'territory' if uid in CHAPTERS else ('method' if uid in METHOD else 'lens')
        links = sorted(set(re.findall(r'F1\.\d+[a-z]?', rows.get('Links out', ''))) - {uid}, key=unit_sort_key)
        u = {'id': uid, 'title': title, 'kind': kind, 'summary': summary, 'question': eq,
             'device': (dev.group(1) if dev else labname) or labname, 'lab': labname,
             'status': 'in development', 'links': links}
        if uid in CHAPTERS:
            u['short'] = SHORT[uid]
        if uid in LENS_UNITS:
            u['layer'] = LENS_UNITS[uid]['layer']
            u['layerDoes'] = LENS_UNITS[uid]['does']
        units.append(u)
    units.sort(key=lambda u: unit_sort_key(u['id']))
    return units


# ---------------------------------------------------------------- main
def main():
    os.makedirs(OUT, exist_ok=True)
    print('loading canon')
    rows = []
    for f in sorted(glob.glob(os.path.join(CANON, 'canon_*.csv'))):
        with open(f, encoding='utf-8', newline='') as fh:
            rows.extend(csv.DictReader(fh))
    by_id = {r['id']: r for r in rows}
    kinds = Counter(r['kind'] for r in rows)
    print(f'  {len(rows)} canon rows in {len(kinds)} kinds')

    countries = topo_features(os.path.join(HUB, 'node_modules', 'world-atlas', 'countries-50m.json'))
    sub_shapes = build_subregions(countries)
    gz = Gazetteer(os.path.join(SRC, 'ne_10m_populated_places_simple.geojson'),
                   os.path.join(MOD, 'atlas', 'data', 'backbone', 'places_pleiades.csv'))
    STOP.update(norm(n) for n in countries)
    STOP.update(norm(v) for v in SUB_REGIONS.values())
    STOP.update(['africa', 'asia', 'europe', 'america', 'americas', 'india', 'china', 'japan', 'korea', 'egypt', 'iran', 'persia', 'arabia',
                 'anatolia', 'levant', 'mesopotamia', 'nubia', 'sahara', 'sahel', 'andes', 'amazon', 'pacific', 'atlantic', 'mediterranean',
                 'north', 'south', 'east', 'west', 'central', 'new', 'old', 'great', 'upper', 'lower'])
    big_names = sorted(((k, r) for k, r in gz.ne_list if r['pop'] >= 20000), key=lambda kr: -kr[1]['pop'])

    # ---- territories: sub-region shares per chapter
    share = {w: Counter() for w in CHAPTERS}
    for r in rows:
        ws = split(r['world'])
        for w in CHAPTERS:
            if w in ws:
                for s in split(r['sub_regions']):
                    share[w][s] += 1
    HOME = {'F1.6': 'AF-', 'F1.7': 'AM-', 'F1.11': 'EU-', 'F1.12': 'OC-', 'F1.9a': 'WA-'}
    COLLECTING = {'EU-WCE', 'EU-BLC', 'AM-EWD', 'GL'}
    territories = []
    for w in CHAPTERS:
        tot = sum(share[w].values())
        top = max(share[w].values())
        parts = []
        used = []
        for code, n in share[w].most_common():
            frac = n / tot
            home = HOME.get(w) and code.startswith(HOME[w])
            if code == 'GL' or (code in COLLECTING and not home):
                continue
            if not (home and frac >= 0.01) and frac < 0.033:
                continue
            g = sub_shapes.get(code)
            if g is None or g.is_empty:
                continue
            weight = max(0.3, min(1.0, n / top))
            soft = g.buffer(1.4, resolution=4).buffer(-0.6, resolution=4)
            parts.append({'code': code, 'w': round(weight, 2), 'n': n, 'rings': rings_of(soft, 0.3)})
            used.append((code, weight, g))
        core = unary_union([g for c, wt, g in used if wt >= 0.5]) or unary_union([g for c, wt, g in used])
        rp = core.representative_point()
        cen = core.centroid
        lab = cen if core.buffer(1).contains(cen) else rp
        territories.append({'id': w, 'name': SHORT[w], 'label': [rnd(lab.x), rnd(lab.y)],
                            'subregions': [{'code': c, 'name': SUB_REGIONS[c], 'w': round(wt, 2)} for c, wt, g in used],
                            'parts': parts})
        print(f'  territory {w}: {", ".join(f"{c}:{wt:.2f}" for c, wt, _ in used)}')
    # manual label nudges where the centroid falls in an awkward place (documented in README)
    LABEL_FIX = {'F1.10': [44.0, 27.0], 'F1.12': [150.0, -18.0], 'F1.7': [-90.0, 18.0], 'F1.11': [12.0, 47.0],
                 'F1.12a': [72.0, 46.5], 'F1.9a': [43.5, 34.5], 'F1.8': [114.0, 33.0], 'F1.9': [92.0, 18.0], 'F1.6': [20.0, 3.0]}
    for t in territories:
        if t['id'] in LABEL_FIX:
            t['label'] = LABEL_FIX[t['id']]

    # ---- nodes
    nodes = []
    nstat = Counter()
    PLACE_KINDS = {'place', 'maker-community', 'institution'}
    for r in rows:
        if r['kind'] not in PLACE_KINDS:
            continue
        g = geocode(r, gz, sub_shapes, big_names)
        if not g:
            nstat['unplaced'] += 1
            continue
        lat, lon, approx, basis = g
        ot = (r['object_types'] or '').lower()
        nm = r['name'].lower()
        if r['kind'] == 'place':
            if re.search(r'site type:[^;]*(city|port|town|capital)', ot) or re.search(r'\b(port|city)\b', nm):
                fam = 'city'
            else:
                fam = 'site'
        elif r['kind'] == 'maker-community':
            fam = 'maker'
        else:
            fam = 'maker' if re.search(r'workshop|kiln|factory|manufactor|atelier|studio|foundry|mint|press\b|karkhana|guild', nm) else 'holding'
        units = [u for u in split(r['units']) if re.fullmatch(r'F1\.\d+[a-z]?', u)]
        world = [w for w in split(r['world']) if re.fullmatch(r'F1\.\d+[a-z]?', w)]
        start = int(r['start']) if r['start'].strip().lstrip('-').isdigit() else None
        end = int(r['end']) if r['end'].strip().lstrip('-').isdigit() else None
        if approx == 2:  # the row names only a sub-region: listed, never pinned (no invented coordinates)
            lon = lat = None
        nodes.append({'id': r['id'], 'n': r['name'], 'f': fam, 'k': r['kind'], 'x': rnd(lon, 3) if lon is not None else None, 'y': rnd(lat, 3) if lat is not None else None, 'a': approx,
                      's': start, 'e': end, 'd': r['date_note'], 'u': units, 'w': world, 'l': lens_mask(r),
                      't': int(r['tier'][1]) if r['tier'] in ('R1', 'R2', 'R3') else 3, 'c': r['confidence'],
                      'z': [x for x in split(r['sensitivity']) if x != 'none'], 'm': r['making_significance'],
                      'o': r['leaves_out'], 'b': basis, 'r': split(r['sub_regions'])})
        nstat[f'{fam}/a{approx}'] += 1

    # world-set objects at their holders
    holders = {k: v for k, v in json.load(open(os.path.join(SRC, 'holders.json'))).items() if not k.startswith('_')}

    def holder_place(h):
        hl = (h or '').strip().lower()
        for k in sorted(holders, key=len, reverse=True):
            if hl.startswith(k):
                v = holders[k]
                if len(v) == 5:
                    return v[0], v[1], v[3], v[4]
                c = gz.city(f'{v[1]}@{v[2]}')
                if c:
                    return v[0], v[1], c['lat'], c['lon']
        return None

    ws_rows = list(csv.DictReader(open(os.path.join(REG, 'world_set_specs_v1.csv'), encoding='utf-8')))
    held = Counter()
    for r in ws_rows:
        hp = holder_place(r['holder'])
        if not hp:
            nstat['object/no-holder-place'] += 1
            continue
        hname, city, lat, lon = hp
        units = [u for u in split(r['units'].replace(',', ';')) if re.fullmatch(r'F1\.\d+[a-z]?', u)]
        jit = (hash(r['id']) % 1000) / 1000.0
        nodes.append({'id': r['id'], 'n': r['title'], 'f': 'object', 'k': 'object', 'x': rnd(lon, 3), 'y': rnd(lat, 3), 'a': 0,
                      's': None, 'e': None, 'd': r['date'], 'u': units, 'w': [], 'l': lens_mask({'name': r['title'], 'making_significance': r['provenance'] + ' ' + r['history_gap'], 'notes': r['roles']}) | (1 << LENS_BIT['provenance']),
                      't': 1, 'c': '', 'z': [], 'm': f"{r['date']}. Held by {hname}, {city}" + (f" ({r['accession']})" if r['accession'] else '') + f". Licence: {r['licence']}.",
                      'o': r['history_gap'] if r['history_gap'] not in ('—', '') else '', 'b': f'holder: {hname}, {city}', 'r': [],
                      'h': hname, 'p': r['provenance'] if r['provenance'] not in ('—',) else '', 'acc': r['accession'], 'lic': r['licence'], 'ws': r['status']})
        held[(hname, city)] += 1
        nstat['object'] += 1

    # ---- the Edo case
    places = yaml.safe_load(open(os.path.join(EDO, 'content', 'places.yaml'), encoding='utf-8'))
    people = yaml.safe_load(open(os.path.join(EDO, 'content', 'people.yaml'), encoding='utf-8'))
    timeline = yaml.safe_load(open(os.path.join(EDO, 'content', 'timeline.yaml'), encoding='utf-8'))
    story = yaml.safe_load(open(os.path.join(EDO, 'content', 'story.yaml'), encoding='utf-8'))
    ip = next(p for p in (os.path.join(EDO, 'content', 'images.json'), os.path.join(EDO, 'public', 'img', 'images.json')) if os.path.exists(p))
    images = json.load(open(ip, encoding='utf-8'))
    EDO_WORLD = ['edo', 'kyoto', 'osaka', 'nagasaki', 'yokohama', 'kanagawa', 'echizen', 'amsterdam', 'batavia', 'paris',
                 'london', 'boston', 'newyork', 'chicago', 'washington', 'sanfrancisco', 'marseille', 'berlin']
    for pid in EDO_WORLD:
        p = places['world'][pid]
        nodes.append({'id': f'edo-{pid}', 'n': p['name'], 'f': 'edo', 'k': 'place', 'x': rnd(p['lon'], 3), 'y': rnd(p['lat'], 3), 'a': 0,
                      's': None, 'e': None, 'd': '', 'u': ['F1.8'], 'w': ['F1.8'], 'l': 0, 't': 1, 'c': 'high', 'z': [],
                      'm': (p.get('kanji') or '') and f"{p['name']} {p['kanji']}", 'o': '', 'b': 'Edo unit, content/places.yaml',
                      'r': [], 'case': 'edo', 'kanji': p.get('kanji', '')})
    # people and events: which place each one inks (from the unit's own content; Edo unless the unit says otherwise)
    PERSON_PLACE = {'shioya': 'osaka', 'ryukosai': 'osaka', 'perry': 'washington', 'hayashi': 'paris', 'bing': 'paris',
                    'vangogh': 'paris', 'fenollosa': 'boston', 'wright': 'chicago', 'egawa': 'edo'}
    EVENT_PLACE = {'e1641': 'nagasaki', 'e1793': 'osaka', 'e1824': 'nagasaki', 'e1853': 'edo', 'e1859': 'yokohama',
                   'e1865': 'yokohama', 'e1867': 'paris', 'e1867p': 'sanfrancisco', 'e1884': 'paris', 'e1887': 'paris',
                   'e1888': 'paris', 'e1889': 'washington', 'e1890': 'paris', 'e1906': 'chicago', 'e1913': 'boston',
                   'e1921': 'boston', 'e1929': 'newyork', 'e2020': 'london'}
    edo_items = {}
    for pid, p in people['people'].items():
        edo_items[pid] = {'label': p['name'], 'type': 'person', 'group': p.get('group'), 'place': PERSON_PLACE.get(pid, 'edo')}
    for e in timeline['events']:
        edo_items[e['id']] = {'label': f"{int(e['year'])}: {e['label']}", 'type': 'event', 'place': EVENT_PLACE.get(e['id'], 'edo')}
    for pid in EDO_WORLD:
        edo_items[pid] = {'label': places['world'][pid]['name'], 'type': 'place', 'place': pid}
    for cid, c in places['city'].items():
        edo_items[cid] = {'label': c['name'], 'type': 'city place', 'place': 'edo'}
    STEPS = {'desk-seal': 'The Print Desks: the Seal Timeline', 'desk-catalogue': 'The Print Desks: the Catalogue Desk',
             'desk-censor': "The Print Desks: the Censor's Desk", 'wave': 'Edo Print Workshop: Print the Wave',
             'view': 'Edo Print Workshop: Step into the View', 'rebuild': 'Edo unit: the Rebuild'}
    for k, v in STEPS.items():
        edo_items[k] = {'label': v, 'type': 'step', 'place': 'edo'}
    PINS = ['castle', 'nihonbashi', 'toriaburacho', 'bakurocho', 'ryogoku', 'saruwakacho', 'asakusa', 'shinohashi']
    pins = [{'id': k, 'name': places['city'][k]['name'], 'kanji': places['city'][k].get('kanji', ''),
             'xy': places['city'][k]['xy'], 'approx': bool(places['city'][k].get('approx'))} for k in PINS]
    m59 = images['map-edo-1859']
    edo = {
        'id': 'edo', 'unit': 'F1.8', 'title': 'Edo and the floating world', 'sub': 'five publishers’ bets',
        'status': 'built', 'url': EDO_URL + '#from.atlas',
        'pieces': [{'name': 'The Print Desks', 'what': 'Seal Timeline, Catalogue Desk, Censor’s Desk', 'url': DESKS_URL + '#from.atlas'},
                   {'name': 'Edo Print Workshop', 'what': 'Print the Wave, Step into the View', 'url': WORKSHOP_URL + '#from.atlas'}],
        'lede': 'A worked case inside East Asia, read through the workshop: the print trade of Edo told as five acts on five publishers’ bets.',
        'centre': [139.77, 35.69], 'pins': pins,
        'map': {'file': 'img/edo-1859.webp', 'w': 2048, 'h': round(2048 * m59['h'] / m59['w']),
                'credit': f"{m59['title']} · {m59['maker']} · {m59['date']} · {m59['holder']}, Geography and Map Division, {m59['accession']} · Public domain (Library of Congress: no known restrictions on publication)",
                'record': 'https://www.loc.gov/item/77694812/'},
        'items': edo_items, 'groups': {g['id']: g['title'] for g in people['groups']},
        'eras': [{'n': e['name'], 'k': e.get('kanji', ''), 's': e['start'], 'e': e['end']} for e in places['eras']],
    }

    # ---- Edo ids to canon nodes: exact name matches (same region for places), and records that name them
    def nm_keys(r):
        ks = {norm(re.sub(r'\(.*?\)', '', r['name']))}
        ks.update(norm(m) for m in re.findall(r'\((.*?)\)', r['name']))
        ks.update(norm(o) for o in re.split(r';', r['other_names'] or ''))
        ks.discard('')
        return ks
    name_index = defaultdict(list)
    for r in rows:
        for k in nm_keys(r):
            name_index[k].append(r)
    canon_refs = {}

    def ref(r, why):
        canon_refs[r['id']] = {'n': r['name'], 'k': r['kind'], 'w': split(r['world']), 'c': r['confidence'],
                               'd': r['date_note'], 'm': r['making_significance']}
        return {'id': r['id'], 'why': why}
    jp_rows = [r for r in rows if 'AS-JPN' in split(r['sub_regions']) or re.search(r'\bJapan', r['making_significance'] + ' ' + r['name'])]
    for iid, it in edo_items.items():
        exact, named = [], []
        if it['type'] == 'person':
            p = people['people'][iid]
            nm = norm(re.sub(r'\(.*?\)', '', p['name']))
            for r in name_index.get(nm, []):
                if r['kind'] == 'person':
                    exact.append(ref(r, 'same person, matched by name'))
            toks = nm.split()
            key = toks[-1] if p.get('group') == 'designers' else (toks[0] if p.get('group') == 'publishers' else nm)
            if len(key) >= 5:
                rx = re.compile(r'\b' + re.escape(key) + r's?\b')
                for r in jp_rows:
                    if r['id'] in [e['id'] for e in exact]:
                        continue
                    if rx.search(norm(r['name'] + ' ' + r['other_names'] + ' ' + r['making_significance'])):
                        named.append(ref(r, f'the record names {key.title()}'))
        elif it['type'] == 'place':
            pl = places['world'][iid]
            nms = [norm(x) for x in re.split(r'[·/]', pl['name']) if norm(x)]
            for r in rows:
                if r['kind'] not in ('place', 'polity', 'institution'):
                    continue
                ks = nm_keys(r)
                prim = norm(re.sub(r'\(.*?\)', '', r['name']))
                if any(nm in ks or prim.startswith(nm + ' and ') or prim.startswith(nm + ' ') for nm in nms):
                    if in_regions(pl['lat'], pl['lon'], [c for c in split(r['sub_regions']) if c in SUB_REGIONS], sub_shapes, 1.0) and split(r['sub_regions']) != ['GL']:
                        exact.append(ref(r, 'same place, matched by name and region'))
        if exact:
            it['canon'] = exact[:6]
        if named:
            it['named'] = named[:6]
    edo['canonRefs'] = canon_refs
    print('  edo matches:', {k: [e['id'] for e in v.get('canon', [])] + ['~' + e['id'] for e in v.get('named', [])] for k, v in edo_items.items() if v.get('canon') or v.get('named')})

    # ---- routes
    def route_sources(rname):
        srcs = []
        for act in story.get('acts', story if isinstance(story, list) else []):
            pass
        txt = open(os.path.join(EDO, 'content', 'story.yaml'), encoding='utf-8').read()
        for m in re.finditer(r'route: ' + re.escape(rname) + r'\}\s*\n\s*sources: \[([^\]]*)\]', txt):
            srcs.extend(s.strip() for s in m.group(1).split(','))
        return sorted(set(srcs))

    rspec = json.load(open(os.path.join(SRC, 'routes.json')))['routes']
    routes = []
    stop_index = {}
    for rs in rspec:
        if rs.get('edo'):
            er = places['routes'][rs['edo']]
            stops = []
            for s in er['stops']:
                stops.append({'n': s.get('name') or '', 'x': rnd(s['lon']), 'y': rnd(s['lat']), 'a': 0, 'stop': bool(s.get('stop')),
                              'date': s.get('date', '')})
            label = er['label']
            src_ids = route_sources(rs['edo'])
            if rs['id'] == 'voc':
                c = by_id['NET033']
                label = 'Dutch East India Company ships, Amsterdam to Nagasaki'
                start, end, conf, flags = int(c['start']), int(c['end']), c['confidence'], split(c['sensitivity'])
                source = {'canon': 'NET033', 'edo': ['places.yaml routes.voc'] + src_ids}
                name = c['name']
            else:
                start = {'perry': 1852, 'mm': 1870}[rs['id']]
                end = {'perry': 1854, 'mm': 1914}[rs['id']]
                conf, flags = 'high', []
                source = {'edo': ['places.yaml routes.' + rs['edo']] + src_ids}
                name = label
            stops_out = stops
        else:
            c = by_id[rs['source']]
            stops_out = []
            for disp, ref in rs['stops']:
                if isinstance(ref, dict):
                    stops_out.append({'n': disp, 'x': rnd(ref['ll'][1]), 'y': rnd(ref['ll'][0]), 'a': 1, 'stop': True})
                else:
                    cc = gz.city(ref)
                    if not cc:
                        print('  ! route stop not found', rs['id'], ref)
                        continue
                    stops_out.append({'n': disp, 'x': rnd(cc['lon']), 'y': rnd(cc['lat']), 'a': 0, 'stop': True,
                                      'm': cc['name'] if norm(cc['name']) != norm(disp) else ''})
            name = c['name']
            label = rs.get('label', c['name'])
            start = int(c['start']) if c['start'].strip().lstrip('-').isdigit() else None
            end = int(c['end']) if c['end'].strip().lstrip('-').isdigit() else None
            conf, flags = c['confidence'], split(c['sensitivity'])
            source = {'canon': c['id']}
        canon_row = by_id.get(rs['source']) if not rs['source'].startswith('edo') else None
        lm = lens_mask(canon_row) if canon_row else 0
        kind = rs.get('kind', 'route')
        if kind == 'copy':
            lm |= 1 << LENS_BIT['copying']
        if kind == 'extraction':
            lm |= 1 << LENS_BIT['material']
        if rs.get('humanflow') or 'human-flow' in flags:
            lm |= 1 << LENS_BIT['labour']
        if rs['id'] in ('lapis', 'kilwa', 'sahara-w', 'sahara-e', 'obsidian-ana', 'obsidian-mes', 'amber', 'turquoise', 'guano', 'rubber', 'galleon'):
            lm |= 1 << LENS_BIT['material']
        worlds = [w for w in split(canon_row['world'])] if canon_row else ['F1.8']
        txt = (canon_row['date_note'] + ' ' + canon_row['making_significance']).lower() if canon_row else ''
        contested = bool(rs.get('contested')) or ('contested' in txt)
        r_out = {'id': rs['id'], 'name': name, 'label': label, 'kind': kind, 'major': bool(rs.get('major')),
                 's': start, 'e': end, 'softS': canon_row is not None and ('approx' in canon_row['date_note'].lower() or 'debated' in canon_row['date_note'].lower() or 'older' in canon_row['date_note'].lower()) if canon_row else False,
                 'softE': end is None, 'c': conf, 'contested': contested, 'flags': flags + (['human-flow'] if rs.get('humanflow') and 'human-flow' not in flags else []),
                 'l': lm, 'w': [w for w in worlds if w in CHAPTERS], 'src': source, 'stops': stops_out,
                 'm': canon_row['making_significance'] if canon_row else '', 'o': canon_row['leaves_out'] if canon_row else '',
                 'd': canon_row['date_note'] if canon_row else ''}
        if rs.get('edo'):
            r_out['case'] = 'edo'
        routes.append(r_out)
    # the Edo copy thread: Hiroshige's prints copied in Paris (the unit's timeline e1887)
    routes.append({'id': 'edo-copy', 'name': 'Van Gogh’s copies', 'label': 'Edo prints copied in Paris, 1887 (Edo unit)',
                   'kind': 'copy', 'major': False, 's': 1887, 'e': 1888, 'softS': False, 'softE': False, 'c': 'high', 'contested': False,
                   'flags': [], 'l': 1 << LENS_BIT['copying'], 'w': ['F1.8'], 'src': {'edo': ['timeline.yaml e1887']}, 'case': 'edo',
                   'stops': [{'n': 'Edo', 'x': 139.75, 'y': 35.69, 'a': 0, 'stop': True}, {'n': 'Paris', 'x': 2.35, 'y': 48.86, 'a': 0, 'stop': True}],
                   'm': 'Van Gogh’s copies of Edo prints (the Edo unit’s timeline, e1887).', 'o': '', 'd': ''})

    # provenance arcs (F1.24 layer): where open objects were made (sub-region) to where they are held now
    prov = Counter()
    harvested = json.load(open(os.path.join(MOD, 'atlas', 'data', 'harvested', 'objects.json'), encoding='utf-8'))
    for o in harvested:
        hp = holder_place(o['holder'])
        srs = [s for s in o.get('sub_regions', []) if s in sub_shapes and sub_shapes[s] is not None]
        if hp and srs:
            prov[(srs[0], hp[0], hp[1], hp[2], hp[3])] += 1
    terr_of_unit = {t['id']: t for t in territories}
    for r in ws_rows:
        hp = holder_place(r['holder'])
        us = [u for u in split(r['units'].replace(',', ';')) if u in CHAPTERS]
        if hp and us:
            prov[('T:' + us[0], hp[0], hp[1], hp[2], hp[3])] += 1
    arcs = []
    for (origin, hname, city, lat, lon), n in prov.most_common():
        if origin.startswith('T:'):
            t = terr_of_unit[origin[2:]]
            ox, oy = t['label']
            oname = t['name'] + ' (the chapter, not a findspot)'
        else:
            p = sub_shapes[origin].representative_point()
            ox, oy = p.x, p.y
            oname = SUB_REGIONS[origin] + ' (sub-region, not a findspot)'
        if math.hypot(ox - lon, oy - lat) < 3:
            continue
        arcs.append({'from': oname, 'to': f'{hname}, {city}', 'n': n, 'stops': [{'n': oname, 'x': rnd(ox), 'y': rnd(oy), 'a': 2},
                                                                                {'n': f'{hname}, {city}', 'x': rnd(lon), 'y': rnd(lat), 'a': 0}]})
    arcs = arcs[:48]

    # exhibition cities (F1.19 layer)
    exhibitions = []
    EXPO = {'EVT001': 'London@GB', 'EVT004': 'Amsterdam@NL', 'EVT005': 'London@GB', 'EVT008': 'New Delhi@IN',
            'EVT011': 'Seoul@KR', 'EVT012': 'London@GB', 'OCC210': 'London@GB'}
    for cid, key in EXPO.items():
        c = by_id.get(cid)
        cc = gz.city(key)
        if c and cc:
            exhibitions.append({'id': cid, 'n': c['name'], 'x': rnd(cc['lon']), 'y': rnd(cc['lat']), 's': int(c['start']), 'm': c['making_significance']})
    exhibitions.append({'id': 'edo-e1867', 'n': 'Japan at the Paris exposition (1867)', 'x': 2.35, 'y': 48.86, 's': 1867,
                        'm': 'Japan at the Paris exposition (the Edo unit’s timeline, e1867).'})

    # ---- route stops become route nodes where no canon node sits within ~40 km
    def near_node(x, y):
        for n in nodes:
            if n['x'] is not None and abs(n['x'] - x) < 0.4 and abs(n['y'] - y) < 0.4 and n['f'] != 'object':
                return n
        return None
    seen_stop = {}
    for r in routes:
        for s in r['stops']:
            if not s['n'] or not s.get('stop', True):
                continue
            key = norm(s['n'])
            if key in seen_stop:
                seen_stop[key]['routes'].append(r['id'])
                continue
            nb = near_node(s['x'], s['y'])
            if nb:
                nb.setdefault('rt', []).append(r['id'])
                continue
            rec = {'id': 'RT-' + re.sub(r'[^a-z0-9]+', '-', key)[:28], 'n': s['n'], 'f': 'route', 'k': 'route node',
                   'x': s['x'], 'y': s['y'], 'a': s.get('a', 0), 's': r['s'], 'e': r['e'], 'd': '', 'u': ['F1.13'],
                   'w': r['w'], 'l': r['l'], 't': 2, 'c': r['c'], 'z': [], 'm': '', 'o': '',
                   'b': ('hand-located, approximate' if s.get('a') else f"Natural Earth: {s.get('m') or s['n']}"), 'r': [], 'routes': [r['id']]}
            if r.get('case') == 'edo':
                continue
            seen_stop[key] = rec
            nodes.append(rec)
    for n in nodes:
        if 'routes' in n:
            names = [next(rr['name'] for rr in routes if rr['id'] == rid) for rid in n['routes']]
            n['m'] = 'A stop on ' + '; '.join(sorted(set(names))) + '.'

    # ---- units
    units = parse_specs()
    for u in units:
        u['nodes'] = sum(1 for n in nodes if u['id'] in n['u'] or u['id'] in n['w'])
    # route counts per territory, and shared routes between territories, for the guiding current
    shared = defaultdict(Counter)
    for r in routes:
        if r['kind'] != 'route' or r.get('case'):
            continue
        ws = r['w']
        for a in ws:
            for b in ws:
                if a != b:
                    shared[a][b] += 1
    for t in territories:
        t['routes'] = sum(1 for r in routes if t['id'] in r['w'])
        t['neighbours'] = [{'id': b, 'n': n} for b, n in shared[t['id']].most_common()]

    # ---- compact node encoding
    FIELDS = ['id', 'n', 'f', 'k', 'x', 'y', 'a', 's', 'e', 'd', 'u', 'w', 'l', 't', 'c', 'z', 'm', 'o', 'b', 'r']
    extra_keys = ['h', 'p', 'acc', 'lic', 'ws', 'case', 'kanji', 'rt', 'routes']
    enc = []
    for n in nodes:
        row = [n.get(k) for k in FIELDS]
        ex = {k: n[k] for k in extra_keys if n.get(k)}
        row.append(ex or 0)
        enc.append(row)
    counts = Counter(n['f'] for n in nodes)
    approx = Counter(n['a'] for n in nodes)
    meta = {
        'built': '2026-10-04', 'canonRows': len(rows), 'canonKinds': len(kinds),
        'placeAnchored': len(nodes), 'families': dict(counts), 'approx': {str(k): v for k, v in approx.items()},
        'notes': [
            'Place-anchored subset: canon rows of kind place, maker community and institution, geocoded at build time; world-set objects at their holders; route stops; the Edo case.',
            'Geocoding: an exact Natural Earth populated-place name inside the row’s own sub-regions (public domain), else an exact Pleiades title (CC BY 3.0), else a city named in the record, else the sub-region as a soft blot. Proposals, not confirmed identifications: a person should review them as the register does for Wikidata ids.',
            'Territories: Natural Earth admin-0 shapes grouped by the canon’s sub-region codes; a chapter’s wash is densest where its canon rows are. A reading, not a border.',
            'Routes: schematic great-circle paths through named nodes; never surveyed tracks.',
        ],
        'credits': [
            'Natural Earth (public domain): land, admin-0 shapes, populated places. Made with Natural Earth.',
            'Pleiades: a gazetteer of past places, © Ancient World Mapping Center and Institute for the Study of the Ancient World, https://pleiades.stoa.org/ (CC BY 3.0)',
            'Ansei kaisei Oedo ōezu (1859), Library of Congress, Geography and Map Division, 77694812 (public domain).',
        ],
    }
    atlas = {'meta': meta, 'units': units, 'territories': territories, 'lenses': LENSES, 'routes': routes,
             'provenance': arcs, 'exhibitions': exhibitions, 'edo': edo,
             'families': [
                 {'id': 'site', 'name': 'Sites', 'desc': 'Excavated sites, quarries, mines and other places of making'},
                 {'id': 'city', 'name': 'Cities and ports', 'desc': 'Towns, capitals and harbours'},
                 {'id': 'maker', 'name': 'Makers and workshops', 'desc': 'Guilds, workshops, kilns and maker communities'},
                 {'id': 'holding', 'name': 'Institutions', 'desc': 'Courts, companies, museums, libraries and schools'},
                 {'id': 'object', 'name': 'Objects, where held', 'desc': 'Open world-set objects placed at their holders, never at their origin'},
                 {'id': 'route', 'name': 'Route stops', 'desc': 'Named stops on the routes'},
                 {'id': 'edo', 'name': 'The Edo case', 'desc': 'Places in the Edo unit'}],
             'fields': FIELDS + ['x+']}
    a_s = json.dumps(atlas, ensure_ascii=False, separators=(',', ':'))
    n_s = json.dumps({'fields': FIELDS + ['x+'], 'nodes': enc}, ensure_ascii=False, separators=(',', ':'))
    open(os.path.join(OUT, 'atlas.json'), 'w', encoding='utf-8').write(a_s)
    open(os.path.join(OUT, 'nodes.json'), 'w', encoding='utf-8').write(n_s)
    print(f'  nodes: {len(nodes)} {dict(counts)}; approx levels {dict(approx)}; {dict(nstat)}')
    print(f'  routes: {len(routes)}; provenance arcs: {len(arcs)}; exhibitions: {len(exhibitions)}; units: {len(units)}')
    print(f'  atlas.json {len(a_s.encode()) / 1024:.0f} KB, nodes.json {len(n_s.encode()) / 1024:.0f} KB')


if __name__ == '__main__':
    main()

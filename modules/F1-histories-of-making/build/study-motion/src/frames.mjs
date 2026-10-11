// Generates frame geometry for the study storyboards: coastline paths for the world and Japan, and place → px.
import { geoEqualEarth, geoMercator, geoOrthographic, geoGraticule, geoPath } from '/home/claude/creative-world/modules/F1-histories-of-making/build/atlas-hub/node_modules/d3-geo/src/index.js';
import { feature } from '/home/claude/creative-world/modules/F1-histories-of-making/build/atlas-hub/node_modules/topojson-client/src/index.js';
import { readFileSync, writeFileSync } from 'fs';
const land50 = feature(JSON.parse(readFileSync('/home/claude/creative-world/modules/F1-histories-of-making/build/atlas-hub/node_modules/world-atlas/land-50m.json')), 'land');
const land110 = feature(JSON.parse(readFileSync('/home/claude/creative-world/modules/F1-histories-of-making/build/atlas-hub/node_modules/world-atlas/land-110m.json')), 'land');
const W = 640, H = 400;
const PL = { edo: [139.7544, 35.6883], kyoto: [135.7681, 35.0116], osaka: [135.5021, 34.6938], nagasaki: [129.873, 32.7435], kanagawa: [139.633, 35.475], yokohama: [139.6342, 35.4503], fuji: [138.7275, 35.3606], echizen: [136.1688, 35.9035], berlin: [13.405, 52.52], amsterdam: [4.8833, 52.3667], cape: [18.4239, -33.9253], batavia: [106.8132, -6.1348], china: [122.0, 30.0], canton: [113.26, 23.13], marseille: [5.3764, 43.2967], suez: [32.55, 29.97], aden: [45.03, 12.8], galle: [80.2156, 6.0328], singapore: [103.85, 1.29], hongkong: [114.1586, 22.2783], paris: [2.3522, 48.8567], london: [-0.1278, 51.5074], sanfrancisco: [-122.4194, 37.775], chicago: [-87.6278, 41.8819], boston: [-71.0578, 42.3603], washington: [-77.0369, 38.9072], newyork: [-73.9632, 40.7794], norfolk: [-76.2853, 36.8469], uraga: [139.714, 35.2475], tokyo: [139.6917, 35.6894] };
const CITY = { castle: [139.7536, 35.688], nihonbashi: [139.77451, 35.68406], ryogoku: [139.78875, 35.69386], honjo: [139.8023, 35.7038], yoshiwara: [139.79569, 35.72399], 'yoshiwara-old': [139.7805, 35.6875], asakusa: [139.7967, 35.7148], saruwakacho: [139.800944, 35.7175], sakaicho: [139.7828, 35.687], fukiyacho: [139.7818, 35.6863], kobikicho: [139.76778, 35.66944], toriaburacho: [139.78025, 35.690639], 'yoshiwara-gate': [139.7942, 35.7232], bakurocho: [139.783139, 35.694611], shinohashi: [139.793056, 35.685278], hongo: [139.76, 35.7095], koishikawa: [139.7468, 35.7149], kojimachi: [139.7365, 35.6845], ueno: [139.7707, 35.7115], shiba: [139.7483, 35.6575] };
const box = (a, b, c, d) => ({ type: 'Polygon', coordinates: [[[a, b], [a, d], [c, d], [c, b], [a, b]]] }); // clockwise, so d3 reads the inside
const views = {
  world: geoEqualEarth().rotate([-70, 0]).fitSize([W, H], box(-25, -42, 165, 68)).clipExtent([[0, 0], [W, H]]),
  pacific: geoEqualEarth().rotate([-230, 0]).fitSize([W, H], { type: 'Sphere' }).clipExtent([[0, 0], [W, H]]),
  japan: geoMercator().fitSize([W, H], box(128.5, 30.5, 142.5, 38.5)).clipExtent([[0, 0], [W, H]]),
  kanto: geoMercator().fitSize([W, H], box(138.3, 34.9, 140.4, 36.2)).clipExtent([[0, 0], [W, H]]),
};
const out = { W, H, views: {} };
for (const [k, p] of Object.entries(views)) {
  const path = geoPath(p).digits(1);
  out.views[k] = { land: path(k === 'world' || k === 'pacific' ? land110 : land50), places: Object.fromEntries(Object.entries(PL).map(([id, ll]) => [id, p(ll)?.map((v) => +v.toFixed(1))])) };
  out.views[k].arc = (a, b) => null;
}
// 1859 sheet georeference (px = M·[dx km, dy km] + t), sheet rendered at 1280 × 1145 in the frame.
const G = { M: [[-3.8200439443326135, 292.04036824669066], [268.29506203921846, -22.135003592097405], [2236.990619350748, 1901.698492437832]], lat0: 35.69, lon0: 139.77, W: 3964, H: 3545 };
const geo59 = (lon, lat) => { const dx = (lon - G.lon0) * 111.32 * Math.cos((G.lat0 * Math.PI) / 180), dy = (lat - G.lat0) * 110.57, M = G.M; return [(M[0][0] * dx + M[1][0] * dy + M[2][0]) / G.W, (M[0][1] * dx + M[1][1] * dy + M[2][1]) / G.H]; };
out.sheet = { places: Object.fromEntries(Object.entries(CITY).map(([id, ll]) => [id, geo59(...ll).map((v) => +v.toFixed(4))])) };
// great-circle arcs as sampled polylines for the world views
import { geoInterpolate } from '/home/claude/creative-world/modules/F1-histories-of-making/build/atlas-hub/node_modules/d3-geo/src/index.js';
out.arcs = {};
const ARCS = { world: [['berlin', 'amsterdam'], ['amsterdam', 'cape'], ['cape', 'batavia'], ['batavia', 'nagasaki'], ['canton', 'nagasaki'], ['nagasaki', 'edo'], ['edo', 'paris'], ['marseille', 'suez'], ['suez', 'aden'], ['aden', 'galle'], ['galle', 'singapore'], ['singapore', 'hongkong'], ['hongkong', 'yokohama']], pacific: [['yokohama', 'sanfrancisco'], ['sanfrancisco', 'chicago'], ['chicago', 'boston'], ['edo', 'paris'], ['yokohama', 'hongkong'], ['hongkong', 'singapore'], ['singapore', 'galle'], ['galle', 'aden'], ['aden', 'suez'], ['suez', 'marseille'], ['marseille', 'paris'], ['tokyo', 'washington']], japan: [['nagasaki', 'edo'], ['kyoto', 'edo'], ['osaka', 'edo'], ['echizen', 'edo'], ['edo', 'uraga']], kanto: [['kanagawa', 'edo'], ['fuji', 'edo']] };
for (const [v, list] of Object.entries(ARCS)) {
  const p = views[v]; out.arcs[v] = {};
  for (const [a, b] of list) {
    const ip = geoInterpolate(PL[a], PL[b]); const pts = [];
    for (let t = 0; t <= 1.0001; t += 1 / 24) pts.push(p(ip(Math.min(1, t))).map((x) => +x.toFixed(1)));
    // break the polyline where it jumps across the projection seam
    let d = '';
    pts.forEach((q, i) => { const prev = pts[i - 1]; d += (i === 0 || Math.hypot(q[0] - prev[0], q[1] - prev[1]) > 200 ? 'M' : 'L') + q.join(','); });
    out.arcs[v][a + '>' + b] = d;
  }
}
// orthographic globe views for the scene frames: the globe is larger than the frame (radius 330 px) so it reads as a turn
const ORTHO = { 'o-berlin': [12, 48], 'o-cape': [16, -2], 'o-batavia': [92, -4], 'o-nagasaki': [126, 28], 'o-edo': [138, 36], 'o-suez': [48, 18], 'o-singapore': [100, 8], 'o-yokohama': [132, 32], 'o-paris': [5, 46], 'o-world-blue': [75, 25], 'o-eurasia': [70, 52] };
out.ortho = {};
const grat = geoGraticule().step([15, 15])();
for (const [k, c] of Object.entries(ORTHO)) {
  const p = geoOrthographic().rotate([-c[0], -c[1]]).scale(330).translate([W / 2, H / 2 + 20]).clipAngle(90);
  const path = geoPath(p).digits(1);
  const places = {};
  for (const [id, ll] of Object.entries(PL)) { const q = p(ll); const d = Math.hypot(ll[0] - c[0] > 180 ? ll[0] - c[0] - 360 : ll[0] - c[0] < -180 ? ll[0] - c[0] + 360 : ll[0] - c[0], ll[1] - c[1]); if (q && d < 85) places[id] = q.map((v) => +v.toFixed(1)); }
  const arcs = {};
  const pairs = [['berlin', 'amsterdam'], ['amsterdam', 'cape'], ['cape', 'batavia'], ['batavia', 'nagasaki'], ['canton', 'nagasaki'], ['nagasaki', 'edo'], ['edo', 'paris'], ['marseille', 'suez'], ['suez', 'aden'], ['aden', 'galle'], ['galle', 'singapore'], ['singapore', 'hongkong'], ['hongkong', 'yokohama'], ['yokohama', 'sanfrancisco'], ['sanfrancisco', 'chicago'], ['chicago', 'boston'], ['yokohama', 'hongkong'], ['kyoto', 'edo'], ['osaka', 'edo']];
  for (const [a, b] of pairs) {
    const ip = geoInterpolate(PL[a], PL[b]); const coords = [];
    for (let t = 0; t <= 1.0001; t += 1 / 32) coords.push(ip(Math.min(1, t)));
    const d = path({ type: 'LineString', coordinates: coords });
    const mid = p(ip(0.62)); const vis = mid && path({ type: 'Point', coordinates: ip(0.62) });
    if (d) arcs[a + '>' + b] = { d, mid: vis ? mid.map((v) => +v.toFixed(1)) : null };
  }
  out.ortho[k] = { land: path(land110), grat: path(grat), sphere: path({ type: 'Sphere' }), places, arcs, center: c };
}
// thin the paths: drop points closer than 0.9 px to the last kept point
const thin2 = (d) => d.split('M').filter(Boolean).map((seg) => { const pts = seg.split('L').map((q) => q.split(',').map(Number)); const keep = [pts[0]]; for (const q of pts.slice(1)) { const l = keep[keep.length - 1]; if (Math.hypot(q[0] - l[0], q[1] - l[1]) >= 6) keep.push(q); } if (keep.length > 1 && keep[keep.length - 1] !== pts[pts.length - 1]) keep.push(pts[pts.length - 1]); return keep.length < 2 ? '' : 'M' + keep.map((q) => q.join(',')).join('L'); }).join('');
const thin = (d, tol = 0.9) => d.split('M').filter(Boolean).map((seg) => {
  const pts = seg.replace(/Z$/, '').split('L').map((q) => q.split(',').map(Number));
  const keep = [pts[0]];
  for (const q of pts.slice(1)) { const l = keep[keep.length - 1]; if (Math.hypot(q[0] - l[0], q[1] - l[1]) >= tol) keep.push(q); }
  return keep.length < 3 ? '' : 'M' + keep.map((q) => q.join(',')).join('L') + 'Z';
}).join('');
for (const v of Object.values(out.views)) v.land = thin(v.land);
for (const o of Object.values(out.ortho)) { o.land = thin(o.land, 1.6); o.grat = thin2(o.grat); }
writeFileSync(new URL('./frames.json', import.meta.url), JSON.stringify(out));
console.log('ok', Object.keys(out.views), out.sheet.places.castle, out.sheet.places.yoshiwara, out.sheet.places.kojimachi);

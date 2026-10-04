// The Atlas model: data loading and decoding, lenses, and the styling rules both surfaces share
// (which routes show, how strongly, in which ink; how a node is marked).

export const CHAPTERS = ['F1.6', 'F1.7', 'F1.8', 'F1.9', 'F1.9a', 'F1.10', 'F1.11', 'F1.12', 'F1.12a'];

// Thematic units as lenses. `layer` draws something of its own; `bit` re-weights the washes and marks nodes.
export const LENS_DEF = {
  'F1.13': { short: 'Networks', layer: 'networks', bit: null, does: 'Lights the routes. Every major route inks at full strength; forced passages are drawn in plain ink, never as goods.' },
  'F1.14': { short: 'Copying', layer: 'copying', bit: 'copying', does: 'Draws copy chains as dashed threads: porcelain to Persia, Delft and Meissen; Indian cottons to their imitators; Edo prints to Paris.' },
  'F1.16': { short: 'Ritual', layer: null, bit: 'ritual', does: 'Re-weights each chapter’s wash by how many of its places the canon ties to ritual and belief.' },
  'F1.17': { short: 'Commissioning', layer: null, bit: 'commissioning', does: 'Re-weights the washes by the places whose records name a court, patron or commission.' },
  'F1.18': { short: 'Women’s work', layer: null, bit: 'gender', does: 'Re-weights the washes by the places whose records name women’s making, or its silences.' },
  'F1.19': { short: 'Industry', layer: 'industry', bit: null, does: 'Rings the exhibition cities, once, in gold: the fairs that ranked the world’s goods.' },
  'F1.22': { short: 'Planetary present', layer: 'extraction', bit: 'material', does: 'Runs extraction flows from source to city in rust: rubber, guano, lapis, gold, silver.' },
  'F1.23': { short: 'Obscured labour', layer: null, bit: 'labour', does: 'Re-weights the washes by the places whose records name workers, crews, guilds or unnamed hands.' },
  'F1.24': { short: 'Museums', layer: 'museums', bit: 'provenance', does: 'Draws provenance arcs from where things were made to where they are held now: a reverse route of real force.' },
  'F1.30': { short: 'Re-timing', layer: 'retime', bit: null, does: 'Relabels the time scrubber in other reckonings: the Hijri era and Japanese era names (nengō).' },
};
export const LENS_ORDER = ['F1.13', 'F1.14', 'F1.19', 'F1.22', 'F1.24', 'F1.30', 'F1.23', 'F1.18', 'F1.16', 'F1.17'];

export const FAMILY = {
  site: { name: 'Sites', one: 'site', shape: 0 },
  city: { name: 'Cities and ports', one: 'city or port', shape: 1 },
  maker: { name: 'Makers and workshops', one: 'maker community or workshop', shape: 2 },
  holding: { name: 'Institutions', one: 'institution', shape: 3 },
  object: { name: 'Objects, where held', one: 'object, at its holder', shape: 4 },
  route: { name: 'Route stops', one: 'route stop', shape: 5 },
  edo: { name: 'The Edo case', one: 'place in the Edo unit', shape: 6 },
};
export const FAMILY_ORDER = ['site', 'city', 'maker', 'holding', 'object', 'route', 'edo'];

export const M = { atlas: null, nodes: [], byId: new Map(), units: [], unitById: new Map(), terrById: new Map(), lensBit: {}, routes: [], land: null };

export async function loadData() {
  const [a, n] = await Promise.all([fetch('data/atlas.json').then((r) => r.json()), fetch('data/nodes.json').then((r) => r.json())]);
  M.atlas = a;
  M.units = a.units;
  for (const u of a.units) M.unitById.set(u.id, u);
  for (const t of a.territories) M.terrById.set(t.id, t);
  a.lenses.forEach((l, i) => { M.lensBit[l.id] = 1 << i; });
  const F = n.fields;
  M.nodes = n.nodes.map((row) => {
    const o = {};
    F.forEach((f, i) => { if (f !== 'x+') o[f] = row[i]; });
    const ex = row[row.length - 1];
    if (ex) Object.assign(o, ex);
    o.placed = o.x !== null && o.y !== null;
    return o;
  });
  for (const o of M.nodes) M.byId.set(o.id, o);
  M.routes = a.routes;
  // per-chapter node lists and lens shares (the share of a chapter's places whose record carries a lens)
  for (const t of a.territories) {
    t.nodeList = M.nodes.filter((o) => o.f !== 'edo' && (o.w.includes(t.id) || (o.u.includes(t.id) && o.f !== 'route')));
    t.share = {};
    for (const l of a.lenses) {
      const b = M.lensBit[l.id];
      const k = t.nodeList.filter((o) => o.l & b).length;
      t.share[l.id] = t.nodeList.length ? k / t.nodeList.length : 0;
    }
  }
  return M;
}

export async function loadLand() {
  if (!M.land) M.land = await fetch('data/land.json').then((r) => r.json());
  return M.land;
}

// ------------------------------------------------------------- time
const YS = [[0, -12000], [90, -3000], [300, 0], [650, 1500], [1000, 2026]];
export function sliderToYear(v) {
  for (let i = 1; i < YS.length; i++) {
    if (v <= YS[i][0]) {
      const [a, ya] = YS[i - 1]; const [b, yb] = YS[i];
      return Math.round(ya + (yb - ya) * (v - a) / (b - a));
    }
  }
  return 2026;
}
export function yearToSlider(y) {
  for (let i = 1; i < YS.length; i++) {
    if (y <= YS[i][1]) {
      const [a, ya] = YS[i - 1]; const [b, yb] = YS[i];
      return Math.round(a + (b - a) * (y - ya) / (yb - ya));
    }
  }
  return 1000;
}
export function fmtYear(y) {
  if (y === null || y === undefined) return '';
  return y < 0 ? `${(-y).toLocaleString('en-GB')} BCE` : `${y} CE`;
}
// Other reckonings for F1.30. The Hijri conversion is the usual approximation (lunar years run about 33 to 32
// against solar years), so it is always shown with "c."; nengō come from the Edo unit's era table (1596 onwards).
export function retime(y) {
  const out = [];
  if (y >= 622) {
    const ah = Math.floor((y - 622) * 33 / 32) + 1;
    out.push({ k: 'Hijri', t: `c. ${ah} AH` });
  } else out.push({ k: 'Hijri', t: 'before the Hijri era (622 CE)' });
  const eras = M.atlas?.edo?.eras || [];
  const e = [...eras].reverse().find((x) => y >= x.s && (x.e === null || y <= x.e));
  if (e) out.push({ k: 'Nengō', t: `${e.n} ${y - e.s + 1}`, kanji: e.k });
  else out.push({ k: 'Nengō', t: y < 1596 ? 'the unit’s table starts in 1596' : '' });
  return out;
}

// ------------------------------------------------------------- styling rules
// Returns, for every line the surfaces can draw, its visibility and ink. Kinds: route, copy, extraction, prov, edo.
export function lineSet(S) {
  const L = [];
  const lens = S.lens && LENS_DEF[S.lens];
  const layer = lens?.layer;
  const focus = S.unit && M.terrById.has(S.unit) ? S.unit : null;
  const edoOn = focus === 'F1.8' || S.story === 'edo';
  for (const r of M.routes) {
    const human = r.id.startsWith('trafficking');
    let kind = r.case === 'edo' ? (r.kind === 'copy' ? 'copy' : 'edo') : r.kind;
    let a = 0, w = 1, color = human ? 'ink' : 'route', dash = 0;
    if (kind === 'route') {
      a = r.major ? 0.62 : 0.4; w = r.major ? 1.5 : 1.05;
      if (focus) a = r.w.includes(focus) ? 0.9 : 0.16;
      if (layer === 'networks') { a = r.major ? 1 : 0.85; w *= 1.5; }
      else if (layer === 'extraction') { const mat = r.l & M.lensBit.material; a = mat ? 0.9 : 0.1; color = mat && !human ? 'extract' : color; w = mat ? 1.6 : 1; }
      else if (layer) a *= 0.3;
    } else if (kind === 'copy') {
      a = layer === 'copying' ? 1 : 0; w = 1.5; color = 'ink'; dash = 1;
      if (r.case === 'edo' && edoOn && !layer) { a = 0.6; }
    } else if (kind === 'extraction') {
      a = layer === 'extraction' ? 1 : 0; w = 2; color = 'extract';
    } else if (kind === 'edo') {
      a = edoOn ? 0.85 : (layer === 'networks' ? 0.6 : 0); w = 1.4; color = 'indigo2';
    }
    if (r.contested) dash = 2;
    L.push({ id: r.id, r, kind, a, w, color, dash, human, s: r.s, e: r.e, stops: r.stops, lift: 0 });
  }
  if (layer === 'museums') {
    for (const p of M.atlas.provenance) {
      L.push({ id: 'prov-' + p.to + p.from, r: null, prov: p, kind: 'prov', a: Math.min(1, 0.35 + p.n / 30), w: 0.8 + Math.min(1.6, Math.sqrt(p.n) * 0.35), color: 'prov', dash: 0, s: null, e: null, stops: p.stops, lift: 1 });
    }
  }
  return L;
}

// How far a line is drawn at a given scrubber year, and how strongly (lines past their end fade to ghosts).
export function lineTime(l, year) {
  if (year === null || year === undefined || l.s === null || l.s === undefined) return { p: 1, k: 1 };
  if (year < l.s) return { p: 0, k: 0 };
  const end = l.e ?? 2026;
  const span = Math.max(40, Math.min(300, (end - l.s) * 0.25));
  const p = Math.min(1, (year - l.s) / span);
  const k = l.e !== null && l.e !== undefined && year > l.e + 40 ? 0.35 : 1;
  return { p, k };
}

// Wash strength per chapter: by default the chapter's own weight; under a bit-lens, the share of its places
// that carry the lens (a reading of the canon, not of the world).
export function washes(S) {
  const lens = S.lens && LENS_DEF[S.lens];
  const out = {};
  const shares = lens?.bit ? M.atlas.territories.map((t) => t.share[lens.bit]) : null;
  const max = shares ? Math.max(...shares, 0.01) : 1;
  M.atlas.territories.forEach((t, i) => {
    let w = 1;
    if (lens?.bit) w = 0.04 + 0.96 * Math.pow(shares[i] / max, 1.4);
    else if (lens?.layer && lens.layer !== 'retime') w = 0.45;
    if (S.unit && M.terrById.has(S.unit) && S.unit !== t.id) w *= 0.55;
    out[t.id] = w;
  });
  return out;
}

export function nodeMatchesLens(o, S) {
  const lens = S.lens && LENS_DEF[S.lens];
  if (!lens) return true;
  if (lens.bit) return !!(o.l & M.lensBit[lens.bit]);
  if (lens.layer === 'networks') return o.f === 'route' || (o.rt && o.rt.length > 0) || o.f === 'city';
  if (lens.layer === 'industry') return o.f === 'city' || o.f === 'holding';
  return true;
}

export function nodeInTime(o, year) {
  if (year === null || year === undefined) return true;
  if (o.s !== null && o.s !== undefined && o.s > year) return false;
  return true;
}

export function unitShort(id) {
  const u = M.unitById.get(id);
  if (!u) return id;
  return u.short || LENS_DEF[id]?.short || u.title.split(/[:,]/)[0];
}

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

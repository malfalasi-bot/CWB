// What a surface shows at the current tier, independent of how it is drawn: territory labels, the story cartouche,
// clusters of place-anchored nodes (supercluster, by kind), exhibition rings. Both the globe and the 2D map use it.
import Supercluster from 'supercluster';
import { M, LENS_DEF, FAMILY, FAMILY_ORDER, nodeMatchesLens, nodeInTime, esc } from './model.js';
import { S } from './state.js';
import { INK, inkState } from './ink.js';

let index = null, indexKey = '';

function famOf(props) {
  let best = 'site', n = -1;
  for (const f of FAMILY_ORDER) if ((props['f_' + f] || 0) > n) { n = props['f_' + f] || 0; best = f; }
  return best;
}

export function clusterIndex() {
  const key = `${S.lens}|${S.year}|${INK.version}`;
  if (index && key === indexKey) return index;
  const pts = [];
  for (const o of M.nodes) {
    if (!o.placed) continue;
    if (!nodeMatchesLens(o, S) || !nodeInTime(o, S.year)) continue;
    pts.push({ type: 'Feature', geometry: { type: 'Point', coordinates: [o.x, o.y] }, properties: { id: o.id, f: o.f, ink: inkState(o.id) } });
  }
  index = new Supercluster({
    radius: 44, maxZoom: 11, minPoints: 3,
    map: (p) => { const o = { ink: p.ink >= 1 ? 1 : 0 }; o['f_' + p.f] = 1; return o; },
    reduce: (acc, p) => { for (const k in p) if (k !== 'cluster' && k !== 'cluster_id' && k !== 'point_count' && k !== 'point_count_abbreviated') acc[k] = (acc[k] || 0) + p[k]; },
  });
  index.load(pts);
  indexKey = key;
  return index;
}

// marks at region tier: clusters and single nodes
export function regionMarks(zoom) {
  const ix = clusterIndex();
  const z = Math.max(0, Math.min(12, Math.floor(zoom)));
  const out = [];
  for (const c of ix.getClusters([-180, -85, 180, 85], z)) {
    const [lon, lat] = c.geometry.coordinates;
    if (c.properties.cluster) {
      const p = c.properties;
      out.push({ cluster: true, cid: p.cluster_id, n: p.point_count, lon, lat, f: famOf(p), ink: p.ink || 0, comp: FAMILY_ORDER.filter((f) => p['f_' + f]).map((f) => [f, p['f_' + f]]) });
    } else {
      const o = M.byId.get(c.properties.id);
      out.push({ cluster: false, id: o.id, o, lon, lat, f: o.f, ink: inkState(o.id), approx: o.a === 1 });
    }
  }
  return out;
}

export function expansionZoom(cid) {
  try { return clusterIndex().getClusterExpansionZoom(cid); } catch { return null; }
}
export function clusterLeaves(cid, n = 12) {
  try { return clusterIndex().getLeaves(cid, n).map((f) => f.properties.id); } catch { return []; }
}

// marks at world tier: only what is inked (progress shows as ink, never as a meter)
export function worldMarks() {
  const out = [];
  for (const id of INK.solid.keys()) {
    const o = M.byId.get(id);
    if (o?.placed) out.push({ cluster: false, id, o, lon: o.x, lat: o.y, f: o.f, ink: 1 });
  }
  return out;
}

export function exhibitions() {
  return S.lens && LENS_DEF[S.lens]?.layer === 'industry' ? M.atlas.exhibitions : [];
}

export function territoryLabelItems(project, phone) {
  const items = [];
  const sel = S.unit && M.terrById.has(S.unit) ? S.unit : null;
  for (const t of M.atlas.territories) {
    const p = project(t.label[0], t.label[1]);
    if (!p || !p.vis) continue;
    const u = M.unitById.get(t.id);
    const name = t.name, dev = `read through ${u.device}`;
    const inked = INK.chapters.has(t.id);
    const showDev = !phone || sel === t.id;
    const w = Math.max(name.length * 8.4, showDev ? dev.length * 6.1 : 0) + 14;
    items.push({
      key: 't-' + t.id, kind: 'territory', x: p.x, y: p.y, w, h: showDev ? 40 : 26,
      html: `<span class="lab-t">${esc(name)}</span>${showDev ? `<span class="lab-d">${esc(dev)}</span>` : ''}`,
      aria: `${name}, world chapter ${t.id}, read through ${u.device}${inked ? ', inked' : ''}. Enter to explore; arrow keys turn the globe.`,
      pri: sel === t.id ? 100 : 60 + (p.front || 0) * 10, cls: `${sel === t.id ? 'is-sel' : ''} ${inked ? 'is-inked' : ''} ${sel && sel !== t.id ? 'is-dim' : ''}`, edgeOK: false,
    });
  }
  const e = M.atlas.edo;
  const p = project(e.centre[0], e.centre[1]);
  if (p && p.vis) {
    items.push({ key: 'story-edo', kind: 'story', x: p.x, y: p.y, anchor: 'l', w: 128, h: 34, pri: 95,
      html: '<span class="lab-story"><span class="seal" lang="ja">江</span><span class="lab-st">Edo story</span></span>',
      aria: 'Edo and the floating world: a story inside East Asia. Enter to part the clouds onto the 1859 map.' });
  }
  return items;
}

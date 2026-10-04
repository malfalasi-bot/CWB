// Progress as ink. Nothing here is a score: the store holds what the learner engaged, and from that the Atlas
// derives which marks are solid ink (engaged), which are rumours (named in an engaged record, not yet read),
// and the "why" behind each mark: the relation and its source.
import { M, FAMILY, unitShort } from './model.js';
import { store } from './state.js';

const KEY = 'f1-atlas.ink.v1';
const blank = () => ({ units: {}, nodes: [], lenses: [], log: [] });
let D = blank();
export const INK = { solid: new Map(), rumour: new Map(), chapters: new Set(), steps: new Set(), version: 0 };

export function loadInk() {
  const d = store.get(KEY, null);
  if (d && typeof d === 'object') D = Object.assign(blank(), d);
  derive();
}
function save() { store.set(KEY, D); }

export function ingest(unit, ids) {
  if (unit !== 'edo') return [];
  const items = M.atlas.edo.items;
  const known = ids.filter((id) => items[id]);
  const prev = new Set(D.units.edo || []);
  D.units.edo = [...new Set([...(D.units.edo || []), ...known])];
  const added = known.filter((id) => !prev.has(id));
  if (added.length) D.log.push({ at: new Date().toISOString().slice(0, 10), from: 'edo', ids: added });
  save();
  derive();
  return known;
}

export function toggleNode(id) {
  const i = D.nodes.indexOf(id);
  if (i >= 0) D.nodes.splice(i, 1); else { D.nodes.push(id); D.log.push({ at: new Date().toISOString().slice(0, 10), from: 'atlas', ids: [id] }); }
  save();
  derive();
  return i < 0;
}
export function notedHere(id) { return D.nodes.includes(id); }

export function practiseLens(id) {
  if (id && !D.lenses.includes(id)) { D.lenses.push(id); save(); }
}
export function lensesPractised() { return [...D.lenses]; }

export function clearInk() { D = blank(); save(); derive(); }

// field-notebook code: the same plain tokens a unit hands over, so it can travel in a link or be pasted
export function exportCode() {
  const parts = [];
  if (D.units.edo?.length) parts.push('ink.edo.' + D.units.edo.join('~'));
  if (D.nodes.length) parts.push('ink.atlas.' + D.nodes.join('~'));
  return parts.join(' ');
}
export function importCode(text) {
  let n = 0;
  for (const m of String(text).matchAll(/ink\.([a-z0-9]+)\.([A-Za-z0-9_~.-]+)/g)) {
    const ids = m[2].split('~').filter(Boolean);
    if (m[1] === 'edo') n += ingest('edo', ids).length;
    else if (m[1] === 'atlas') {
      for (const id of ids) if (M.byId.has(id) && !D.nodes.includes(id)) { D.nodes.push(id); n++; }
    }
  }
  save(); derive();
  return n;
}
export function inkLog() { return D.log.slice(); }
export function edoEngaged() { return (D.units.edo || []).slice(); }

function addWhy(map, id, why) {
  if (!map.has(id)) map.set(id, []);
  map.get(id).push(why);
}

function derive() {
  INK.solid = new Map(); INK.rumour = new Map(); INK.chapters = new Set(); INK.steps = new Set();
  const items = M.atlas?.edo?.items || {};
  for (const id of D.units.edo || []) {
    const it = items[id];
    if (!it) continue;
    const src = { label: 'Edo unit hand-off', detail: `you engaged “${it.label}” in the Edo unit` };
    if (it.type === 'step') { INK.steps.add(id); continue; }
    const pin = 'edo-' + it.place;
    if (M.byId.has(pin)) {
      const rel = it.type === 'place' ? 'is this place' : it.type === 'event' ? 'happened here, as the unit tells it' : it.type === 'city place' ? 'lies in this city' : 'is placed here by the Edo unit';
      addWhy(INK.solid, pin, { rel, who: it.label, src: 'Edo unit, content (places, people, timeline)', conf: 'documented in the unit', via: src });
    }
    for (const c of it.canon || []) addWhy(INK.solid, c.id, { rel: c.why, who: it.label, src: `canon register ${c.id}`, conf: M.atlas.edo.canonRefs[c.id]?.c || '', via: src });
    for (const c of it.named || []) addWhy(INK.rumour, c.id, { rel: c.why, who: it.label, src: `canon register ${c.id}`, conf: M.atlas.edo.canonRefs[c.id]?.c || '', via: src, rumour: true });
  }
  for (const id of D.nodes) {
    addWhy(INK.solid, id, { rel: 'you read this card and noted it', who: '', src: 'your field notebook', conf: '', via: { label: 'Atlas', detail: 'noted in the Atlas' } });
  }
  for (const id of INK.solid.keys()) INK.rumour.delete(id);
  for (const id of INK.solid.keys()) {
    const o = M.byId.get(id) || null;
    const ref = M.atlas?.edo?.canonRefs?.[id];
    const ws = o ? (o.w.length ? o.w : o.u) : ref ? ref.w : [];
    for (const w of ws) if (M.terrById.has(w)) INK.chapters.add(w);
  }
  if ((D.units.edo || []).length) INK.chapters.add('F1.8');
  INK.version++;
}

export function inkState(id) {
  if (INK.solid.has(id)) return 1;
  if (INK.rumour.has(id)) return 0.5;
  return 0;
}

// The rumour log: every edge that explains an inked or rumoured mark, plus the record's own edges
// (where its pin comes from, which routes it sits on, where an object is held).
export function whyEdges(id) {
  const o = M.byId.get(id);
  const ref = M.atlas.edo.canonRefs[id];
  const out = [];
  for (const w of INK.solid.get(id) || []) out.push({ ...w, kind: 'ink' });
  for (const w of INK.rumour.get(id) || []) out.push({ ...w, kind: 'rumour' });
  if (o) {
    if (o.b) out.push({ kind: 'place', rel: o.placed ? (o.a === 0 ? 'pinned here' : 'pinned here, approximately') : 'not pinned', who: '', src: o.b, conf: o.a === 0 ? 'exact name' : o.a === 1 ? 'approximate' : 'sub-region only' });
    for (const rid of [...(o.rt || []), ...(o.routes || [])]) {
      const r = M.routes.find((x) => x.id === rid);
      if (r) out.push({ kind: 'route', rel: 'a stop on', who: r.name, src: r.src.canon ? `canon register ${r.src.canon}` : (r.src.edo || []).join(', '), conf: r.c + (r.contested ? ', contested' : ''), contested: r.contested });
    }
    if (o.h) out.push({ kind: 'held', rel: 'held by', who: o.h, src: `world-set register${o.acc ? ', ' + o.acc : ''}`, conf: o.lic || '' });
    if (o.p) out.push({ kind: 'prov', rel: 'provenance', who: o.p, src: 'world-set register', conf: '' });
    for (const w of o.w) if (M.terrById.has(w)) out.push({ kind: 'chapter', rel: 'read in', who: unitShort(w) + ` (${w})`, src: `canon register ${o.id}, sub-regions ${o.r.join(', ') || '—'}`, conf: o.c || '' });
  } else if (ref) {
    for (const w of ref.w) if (M.terrById.has(w)) out.push({ kind: 'chapter', rel: 'read in', who: unitShort(w) + ` (${w})`, src: `canon register ${id}`, conf: ref.c || '' });
  }
  return out;
}

export function nodeName(id) {
  const o = M.byId.get(id);
  if (o) return o.n;
  const r = M.atlas.edo.canonRefs[id];
  return r ? r.n : id;
}
export function nodeKindLabel(id) {
  const o = M.byId.get(id);
  if (o) return FAMILY[o.f]?.one || o.k;
  const r = M.atlas.edo.canonRefs[id];
  return r ? r.k.replace(/-/g, ' ') : '';
}

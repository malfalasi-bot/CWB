// One state for every view, mirrored in the URL hash as plain tokens joined by "~":
//   #u-F1.8        a unit (a world chapter becomes the region tier; a lens unit turns its lens on)
//   #n-PLC207      a node card
//   #s-edo         a story (the unit tier: the veil parts onto the story's sheet)
//   #l-F1.13       a lens
//   #y-1600        the scrubber year (y-m500 for 500 BCE)
//   #v-map         a view other than the globe (v-map, v-list)
// Hand-offs from units arrive as the whole hash: #from-edo.tsutaya.hokusai.edo or #ink.edo.tsutaya~hokusai
import { M, LENS_DEF } from './model.js';

export const S = {
  view: 'globe', unit: null, node: null, story: null, lens: null, year: null,
  tier: 'world', motion: true, theme: 'auto', phone: false,
};

const subs = new Set();
export function on(fn) { subs.add(fn); return () => subs.delete(fn); }
export function set(patch, opts = {}) {
  const prev = { ...S };
  Object.assign(S, patch);
  if ('unit' in patch && !patch.unit && prev.unit && M.terrById.has(prev.unit) && !S.story) S.zoomTier = 'world';
  S.tier = S.story ? 'unit' : (S.unit && M.terrById.has(S.unit)) ? 'region' : (S.zoomTier || 'world');
  if (!opts.silentHash) writeHash(opts.push);
  for (const fn of subs) fn(S, prev, opts);
}

export function stateTokens() {
  const t = [];
  if (S.story) t.push('s-' + S.story);
  if (S.unit) t.push('u-' + S.unit);
  if (S.node) t.push('n-' + S.node);
  if (S.lens) t.push('l-' + S.lens);
  if (S.year !== null && S.year !== undefined) t.push('y-' + (S.year < 0 ? 'm' + -S.year : S.year));
  if (S.view !== 'globe') t.push('v-' + S.view);
  return t;
}

function writeHash(push) {
  const h = stateTokens().join('~');
  const url = location.pathname + location.search + (h ? '#' + h : '');
  try {
    if (push) history.pushState(null, '', url); else history.replaceState(null, '', url);
  } catch { /* sandboxed history: the state still works, it just is not in the URL */ }
}

export function parseHash(h) {
  h = (h || '').replace(/^#/, '');
  const out = { view: 'globe', unit: null, node: null, story: null, lens: null, year: null, handoff: null };
  if (!h) return out;
  if (/^from-[a-z0-9]+\./i.test(h)) {
    const [head, ...ids] = h.split('.');
    out.handoff = { unit: head.slice(5), ids: ids.filter((x) => /^[a-z0-9_-]+$/i.test(x)) };
    return out;
  }
  if (/^ink\.[a-z0-9]+\./i.test(h)) {
    const parts = h.split('.');
    out.handoff = { unit: parts[1], ids: parts.slice(2).join('.').split('~').filter((x) => /^[a-z0-9_-]+$/i.test(x)) };
    return out;
  }
  for (const tok of h.split('~')) {
    const m = tok.match(/^([a-z])-(.+)$/);
    if (!m) continue;
    const [, k, v] = m;
    if (k === 'u' && M.unitById.has(v)) out.unit = v;
    else if (k === 'n' && (M.byId.has(v) || M.atlas?.edo?.canonRefs?.[v])) out.node = v;
    else if (k === 's' && v === 'edo') out.story = 'edo';
    else if (k === 'l' && LENS_DEF[v]) out.lens = v;
    else if (k === 'y') { const y = v.startsWith('m') ? -parseInt(v.slice(1), 10) : parseInt(v, 10); if (Number.isFinite(y)) out.year = Math.max(-12000, Math.min(2026, y)); }
    else if (k === 'v' && ['map', 'list', 'globe'].includes(v)) out.view = v;
  }
  return out;
}

// storage, always optional
export const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode: ink lives for this visit only */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

export const reduceMotionQuery = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false, addEventListener() {} };
export function motionOK() { return S.motion; }

let liveTimer = 0;
export function announce(msg) {
  const el = document.getElementById('live');
  if (!el) return;
  clearTimeout(liveTimer);
  el.textContent = '';
  liveTimer = setTimeout(() => { el.textContent = msg; }, 60);
}

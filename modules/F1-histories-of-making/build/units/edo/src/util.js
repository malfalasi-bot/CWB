// Shared helpers: DOM, motion preference, timer scopes, eras, text markup.
export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v; else if (k === 'text') e.textContent = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k != null) e.append(k.nodeType ? k : document.createTextNode(k));
  return e;
}
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---- motion: OS preference, overridable in the page
const mq = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = mq.matches;
const motionSubs = new Set();
export const motion = {
  get reduced() { return reduced; },
  set(v) { reduced = !!v; document.body.classList.toggle('rm', reduced); motionSubs.forEach((f) => f(reduced)); },
  on(f) { motionSubs.add(f); },
  dur(ms) { return reduced ? 0 : ms; },
};
mq.addEventListener?.('change', (e) => motion.set(e.matches));

// ---- a scope owns every timer a tool or animation starts, so leaving a beat stops it all.
export class Scope {
  constructor() { this.t = new Set(); this.i = new Set(); this.r = new Set(); this.fns = []; this.dead = false; }
  timeout(f, ms) { if (this.dead) return; const id = setTimeout(() => { this.t.delete(id); if (!this.dead) f(); }, ms); this.t.add(id); return id; }
  interval(f, ms) { if (this.dead) return; const id = setInterval(() => { if (!this.dead) f(); }, ms); this.i.add(id); return id; }
  raf(f) { if (this.dead) return; const id = requestAnimationFrame((t) => { this.r.delete(id); if (!this.dead) f(t); }); this.r.add(id); return id; }
  clearIntervals() { this.i.forEach(clearInterval); this.i.clear(); }
  onDispose(f) { this.fns.push(f); }
  // animate t from 0..1 over ms with easing; resolves when done or when the scope dies
  tween(ms, fn, ease = (x) => 1 - Math.pow(1 - x, 3)) {
    return new Promise((res) => {
      if (this.dead) return res();
      if (motion.reduced || ms <= 0) { fn(1); return res(); }
      const t0 = performance.now();
      const step = (now) => { const k = Math.min(1, (now - t0) / ms); fn(ease(k)); if (k < 1) this.raf(step); else res(); };
      this.raf(step);
    });
  }
  dispose() { this.dead = true; this.t.forEach(clearTimeout); this.i.forEach(clearInterval); this.r.forEach(cancelAnimationFrame); this.fns.forEach((f) => { try { f(); } catch (e) {} }); }
}

// ---- eras (nengō): era year = Western year − start + 1 (to the year; the lunar calendar shifts edges)
let ERAS = [];
export function setEras(e) { ERAS = (e || []).slice().sort((a, b) => a.start - b.start); }
export function eraOf(year) {
  const y = Math.floor(year);
  let hit = null;
  for (const e of ERAS) if (e.start <= y) hit = e;
  if (!hit || y < 1596) return '';
  const n = y - hit.start + 1;
  return `${hit.name} ${n === 1 ? 'gannen' : n} · ${hit.kanji}${n === 1 ? '元' : n}年`;
}
export const yearLabel = (y) => { const f = Math.floor(y); return f >= 2020 ? String(f) : String(f); };

// ---- text markup: [[id|label]] → cast link, *i*, **b**, 「…」 lines → Japanese quotation
export function renderText(text, people) {
  const paras = text.trim().split(/\n+/);
  return paras.map((p) => {
    let h = esc(p.trim());
    const isJq = /^「[^」]+」$/.test(p.trim()) || /^「[^」]+」:?/.test(p.trim()) && p.trim().length < 60;
    h = h.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (m, id, lab) => `<button class="who" data-person="${id}">${lab}</button>`)
      .replace(/\[\[([^\]]+)\]\]/g, (m, id) => `<button class="who" data-person="${id}">${esc(people[id]?.name || id)}</button>`)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
    if (/^「[^」]+」$/.test(p.trim())) return `<span class="jq" lang="ja">${h}</span>`;
    return `<p>${h.replace(/「([^」]+)」/g, '<span lang="ja">「$1」</span>')}</p>`;
  }).join('');
}

export function imgUrl(id, kind = '') { return `img/${kind ? kind + '/' : ''}${id}.webp`; }
export function provenance(meta) {
  if (!meta) return '';
  const parts = [meta.maker, meta.title ? `<em>${esc(meta.title)}</em>` : '', meta.date, [meta.holder, meta.accession].filter(Boolean).join(' '), meta.licence].filter(Boolean);
  return parts.map((p) => (p.startsWith('<em>') ? p : esc(p))).join(' · ');
}

// ---- v4 additions ----------------------------------------------------------
// Local store, namespaced 'edo4:'. Private to this browser; every access may throw (private mode, blocked storage).
const NS4 = 'edo4:';
export const store = {
  get(k, fallback = null) { try { const v = localStorage.getItem(NS4 + k); return v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; } },
  set(k, v) { try { localStorage.setItem(NS4 + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
  del(k) { try { localStorage.removeItem(NS4 + k); } catch (e) { /* */ } },
  keys(prefix = '') { try { return Object.keys(localStorage).filter((k) => k.startsWith(NS4 + prefix)).map((k) => k.slice(NS4.length)); } catch (e) { return []; } },
};

// Sprite lookup: content.sprites = { index: { id: [sheet, x, y, w, h] }, sheets: { sheet: [W, H] } }
export function spriteOf(C, id) {
  const r = C?.sprites?.index?.[id]; if (!r) return null;
  const [sheet, x, y, w, h] = r; const [W, H] = C.sprites.sheets[sheet] || [0, 0];
  return { url: `img/sprites/${sheet}.webp`, x, y, w, h, W, H };
}
// A sprite drawn at a given width, as a div with a background (role img when alt is given).
export function spriteEl(C, id, width, alt = '') {
  const s = spriteOf(C, id); if (!s) return null;
  const k = width / s.w;
  const d = el('div', { class: 'sprite', style: `width:${width}px;height:${Math.round(s.h * k)}px;background-image:url(${s.url});background-size:${s.W * k}px ${s.H * k}px;background-position:${-s.x * k}px ${-s.y * k}px` });
  if (alt) { d.setAttribute('role', 'img'); d.setAttribute('aria-label', alt); } else d.setAttribute('aria-hidden', 'true');
  return d;
}

// Keep Tab inside a container (dialogs, rooms). Returns a remover.
export function trapFocus(root) {
  const sel = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
  const f = (e) => {
    if (e.key !== 'Tab') return;
    const items = [...root.querySelectorAll(sel)].filter((n) => n.offsetParent !== null || n === document.activeElement);
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  };
  root.addEventListener('keydown', f);
  return () => root.removeEventListener('keydown', f);
}

export const fmtNum = (n) => Math.round(n).toLocaleString('en-GB');
export const plainText = (t, people = {}) => String(t || '').replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2').replace(/\[\[([^\]]+)\]\]/g, (m, id) => people[id]?.name || id).replace(/\*+/g, '');

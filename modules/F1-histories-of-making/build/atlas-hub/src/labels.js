// DOM labels over the canvas or SVG. Each label is a real <button>, so Tab cycles what is visible on the surface
// (the territories at world tier, the largest clusters and named places at region tier). Placement is a greedy
// screen-space collision pass in priority order, run once per settled frame.
const host = () => document.getElementById('labels');
const els = new Map();
let onPick = null;

export function bindLabels(fn) {
  onPick = fn;
  host().addEventListener('click', (ev) => {
    const b = ev.target.closest('.lab');
    if (b && onPick) onPick(b.dataset.key, b.dataset.kind, ev);
  });
}

function make(it) {
  const b = document.createElement('button');
  b.type = 'button';
  b.dataset.key = it.key;
  b.dataset.kind = it.kind;
  return b;
}

// items: { key, kind, x, y, w?, h?, html, aria, pri, cls, anchor: 'c'|'t' }
export function updateLabels(items, opts = {}) {
  const h = host();
  if (!h) return;
  const W = h.clientWidth, H = h.clientHeight;
  const max = opts.max ?? 99;
  items.sort((a, b) => b.pri - a.pri);
  const boxes = [];
  const hr = h.getBoundingClientRect();
  for (const sel of ['#tier', '#lensbar', '#timebar', '#nav', '#legend', '#lenscap', '.toast']) {
    const e = document.querySelector(sel);
    if (!e || e.hidden || !e.offsetParent) continue;
    const r = e.getBoundingClientRect();
    if (r.width && r.height) boxes.push([r.left - hr.left - 4, r.top - hr.top - 4, r.right - hr.left + 4, r.bottom - hr.top + 4]);
  }
  const keep = new Set();
  const active = document.activeElement;
  let n = 0;
  for (const it of items) {
    if (!(it.x > -40 && it.x < W + 40 && it.y > -20 && it.y < H + 20)) continue;
    let el = els.get(it.key);
    const isFocused = el && el === active;
    const w = it.w || 120, hh = it.h || 34;
    const x0 = it.anchor === 'l' ? it.x + 6 : it.x - w / 2, y0 = it.anchor === 'b' ? it.y - hh - 6 : it.y - hh / 2;
    const box = [x0, y0, x0 + w, y0 + hh];
    if (!isFocused && !it.force) {
      if (n >= max) continue;
      if (box[0] < 4 || box[2] > W - 4 || box[1] < 4 || box[3] > H - 4) { if (!it.edgeOK) continue; }
      if (boxes.some((b) => !(box[2] < b[0] || box[0] > b[2] || box[3] < b[1] || box[1] > b[3]))) continue;
    }
    boxes.push(box);
    n++;
    if (!el) { el = make(it); els.set(it.key, el); h.appendChild(el); }
    if (el._html !== it.html) { el.innerHTML = it.html; el._html = it.html; }
    const cls = 'lab ' + (it.cls || '');
    if (el.className !== cls) el.className = cls;
    if (el._aria !== it.aria) { el.setAttribute('aria-label', it.aria); el._aria = it.aria; }
    if (it.pressed !== undefined) el.setAttribute('aria-current', it.pressed ? 'true' : 'false');
    const tab = it.tab !== false;
    if (el._tab !== tab) { el._tab = tab; if (tab) { el.removeAttribute('tabindex'); el.removeAttribute('aria-hidden'); } else { el.tabIndex = -1; el.setAttribute('aria-hidden', 'true'); } }
    el.style.transform = `translate(${Math.round(x0)}px, ${Math.round(y0)}px)`;
    el.style.width = it.w ? `${w}px` : '';
    el.style.height = it.kind === 'cluster' ? `${hh}px` : '';
    el.hidden = false;
    keep.add(it.key);
  }
  // keep DOM order = priority order so Tab follows importance (territories first, then clusters, then names)
  const order = items.map((i) => i.key).filter((k) => keep.has(k));
  let prev = null;
  for (const k of order) {
    const el = els.get(k);
    if (prev ? prev.nextSibling !== el : h.firstChild !== el) {
      if (el === active) { prev = el; continue; }
      h.insertBefore(el, prev ? prev.nextSibling : h.firstChild);
    }
    prev = el;
  }
  for (const [k, el] of els) {
    if (!keep.has(k)) {
      if (el === active) continue;
      el.remove();
      els.delete(k);
    }
  }
}

export function clearLabels() {
  for (const [, el] of els) el.remove();
  els.clear();
}

export function focusLabel(key) {
  const el = els.get(key);
  if (el) el.focus();
  return !!el;
}

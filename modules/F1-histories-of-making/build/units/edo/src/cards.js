// The cast: chip (inline in prose) → card (hover/focus preview) → sheet (dialog with Story · Works · Connections · Life),
// plus the Cast deck (bottom-left button and who's-who grid). Also the shared chrome the instruments reuse:
// easing curves, a drag-release spring, sprite thumbnails, hanko frames, confidence chips, the place card.
// The v3 entity sheet (`Sheet`) stays exported for places, events and images.
import { el, esc, motion, imgUrl, provenance, renderText, eraOf } from './util.js';
import './cards.css';

const NS = 'http://www.w3.org/2000/svg';

// ---------------------------------------------------------------- shared helpers (used by map, timeline, viewer, labs)
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t, sy = (t) => ((ay * t + by) * t + cy) * t, dsx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => { let t = x; for (let i = 0; i < 6; i++) { const d = dsx(t); if (Math.abs(d) < 1e-6) break; t -= (sx(t) - x) / d; } return sy(Math.max(0, Math.min(1, t))); };
}
export const ease = {
  standard: bezier(0.2, 0, 0, 1), enter: bezier(0.05, 0.7, 0.1, 1), exit: bezier(0.3, 0, 0.8, 0.15),
  productive: bezier(0.2, 0, 0.38, 0.9), expressive: bezier(0.4, 0.14, 0.3, 1), linear: (x) => x,
};
export const EASE_CSS = { enter: 'cubic-bezier(0.05,0.7,0.1,1)', standard: 'cubic-bezier(0.2,0,0,1)', exit: 'cubic-bezier(0.3,0,0.8,0.15)' };

// Spring an element's translate from (dx, dy) back to 0 — only for drag release. Returns a promise.
export function springBack(node, dx, dy, { stiffness = 340, damping = 28 } = {}) {
  return new Promise((res) => {
    if (motion.reduced) { node.style.transform = ''; return res(); }
    let x = dx, y = dy, vx = 0, vy = 0, last = performance.now();
    const step = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000); last = now;
      vx += (-stiffness * x - damping * vx) * dt; x += vx * dt;
      vy += (-stiffness * y - damping * vy) * dt; y += vy * dt;
      node.style.transform = `translate(${x}px, ${y}px)`;
      if (Math.abs(x) + Math.abs(y) + Math.abs(vx) / 20 + Math.abs(vy) / 20 < 0.4) { node.style.transform = ''; res(); }
      else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

// Thumbnails come from the sprite atlas: index[id] = [sheet, x, y, w, h], sheets[sheet] = [W, H].
export function spriteOf(C, id) {
  const r = C?.sprites?.index?.[id]; if (!r) return null;
  const [sheet, x, y, w, h] = r, [W, H] = C.sprites.sheets[sheet] || [w, h];
  return { url: `img/sprites/${sheet}.webp`, x, y, w, h, W, H };
}
// CSS background for an object-fit: cover crop of a sprite into a bw × bh box; fy = vertical focus (0 top, 0.5 centre).
export function thumbCss(C, id, bw, bh, fy = 0.5) {
  const s = spriteOf(C, id); if (!s) return '';
  const k = Math.max(bw / s.w, bh / s.h);
  const ox = -s.x * k + (bw - s.w * k) / 2, oy = -s.y * k + (bh - s.h * k) * fy;
  return `background-image:url(${s.url});background-size:${(s.W * k).toFixed(1)}px ${(s.H * k).toFixed(1)}px;background-position:${ox.toFixed(1)}px ${oy.toFixed(1)}px;background-repeat:no-repeat`;
}
// A thumbnail element: the sprite crop when there is one, else the full image (lazy), else nothing.
export function thumb(C, id, bw, bh, { fy = 0.5, cls = 'cc-thumb', alt = '' } = {}) {
  if (!id) return null;
  const css = thumbCss(C, id, bw, bh, fy);
  if (css) return el('span', { class: cls, role: alt ? 'img' : null, 'aria-label': alt || null, 'aria-hidden': alt ? null : 'true', style: `${css};width:${bw}px;height:${bh}px` });
  if (C?.images?.[id]) return el('img', { class: cls, src: imgUrl(id), alt, loading: 'lazy', decoding: 'async', style: `width:${bw}px;height:${bh}px;object-fit:cover;object-position:50% ${fy * 100}%` });
  return null;
}

const CONF = { documented: '●', probable: '◐', argued: '◇', contested: '⇄', reconstruction: '▢' };
export function confChip(conf) {
  const c = String(conf || 'documented').toLowerCase();
  return el('span', { class: `cc-conf c-${c}` }, el('span', { class: 'g', 'aria-hidden': 'true', text: CONF[c] || '○' }), c);
}

const num = (v) => (v == null ? null : typeof v === 'string' ? parseFloat(v.replace('~', '')) : v);
const approx = (v) => typeof v === 'string' && v.includes('~');
export function personDates(p) {
  if (p.born == null && p.died == null) return '';
  const f = (v) => (v == null ? '?' : approx(v) ? `c. ${num(v)}` : String(Math.floor(v)));
  const b = num(p.born), d = num(p.died);
  if (b != null && d != null && d - b <= 2 && !approx(p.born)) return `active ${f(p.born)}–${f(p.died)}`;
  return `${f(p.born)}–${f(p.died)}`;
}
const shortName = (p) => (p?.name || '').replace(/\s*\(.*\)$/, '');
const markOf = (p) => p.mark || (p.kanji ? [...p.kanji].slice(0, 2).join('') : shortName(p).split(/\s+/).map((w) => w[0]).slice(0, 2).join(''));
const isLatin = (s) => /^[\x00-\x7F]+$/.test(s);

// The hanko frame: a square ink frame holding a portrait crop or the person's mark (sumi ink, never seal red).
export function hanko(C, p, size, { vt } = {}) {
  const f = el('span', { class: `cc-hanko${p.img ? '' : ' mark'}`, style: `--s:${size}px`, 'aria-hidden': 'true' });
  if (vt) f.style.viewTransitionName = vt;
  if (p.img) {
    const inner = size - Math.max(4, Math.round(size * 0.1)) * 2;
    const t = thumb(C, p.img, inner, inner, { fy: 0.12, cls: 'cc-face-img' });
    if (t) f.append(t);
  } else {
    const m = markOf(p), latin = isLatin(m);
    f.append(el('span', { class: `cc-mark${latin ? ' latin' : ''}${[...m].length > 1 && !latin ? ' v' : ''}`, lang: latin ? null : 'ja', text: m }));
  }
  return f;
}
const SILHOUETTE = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="15" r="7.2" fill="currentColor"/><path d="M6 38c1-9 7-14 14-14s13 5 14 14z" fill="currentColor"/></svg>';

// A place card that shares the Cast card's chrome (for map pins).
export function placeCard({ name, kanji, kicker, date, note, img, C }) {
  return el('div', { class: 'cc-card cc-place', role: 'tooltip' },
    kicker ? el('div', { class: 'cc-kick', text: kicker }) : null,
    el('div', { class: 'cc-place-h' },
      img && C ? thumb(C, img, 56, 56, { cls: 'cc-thumb sq' }) : null,
      el('div', {}, el('h3', { class: 'cc-name', html: `${esc(name)}${kanji ? ` <span class="k" lang="ja">${esc(kanji)}</span>` : ''}` }),
        date ? el('div', { class: 'cc-dates', text: date }) : null)),
    note ? el('p', { class: 'cc-note', text: note }) : null);
}

// local store fallback (the Story builder passes ctx.store)
const memStore = () => { const m = new Map(); return { get: (k, f) => (m.has(k) ? m.get(k) : f), set: (k, v) => m.set(k, v) }; };

// ---------------------------------------------------------------- the Cast
export class Cast {
  constructor(C, { store, onGo, onShowPlace, onShowYear, onOpenImage } = {}) {
    this.__real = true;
    this.C = C; this.P = C.people || {}; this.store = store || memStore();
    this.on = { onGo, onShowPlace, onShowYear, onOpenImage };
    this._met = new Set((this.store.get('cast.met', []) || []).filter((id) => this.P[id]));
    this._studied = new Set(this.store.get('cast.studied', []) || []);
    this.hover = matchMedia('(hover: hover) and (pointer: fine)');
    this.index();
    this.pop = el('div', { class: 'cc-pop', hidden: true });
    this.pop.addEventListener('pointerenter', () => clearTimeout(this.popT));
    this.pop.addEventListener('pointerleave', () => this.hideCard(160));
    document.body.append(this.pop);
    this.dlg = el('dialog', { class: 'cc-sheet', 'aria-labelledby': 'cc-sheet-name' });
    this.dlg.addEventListener('cancel', (e) => { e.preventDefault(); this.close(); });
    this.dlg.addEventListener('click', (e) => { if (e.target === this.dlg) this.close(); });
    document.body.append(this.dlg);
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !this.pop.hidden) this.hideCard(0); });
    addEventListener('scroll', () => { if (!this.pop.hidden && !this.pop.matches(':hover')) this.hideCard(0); }, { passive: true });
  }

  // where each person first appears, and every beat that names them
  index() {
    this.appear = {}; this.firstAct = {};
    (this.C.acts || []).forEach((a, ai) => a.segments.forEach((s) => s.beats.forEach((b) => {
      const ids = new Set([...(b.people || []), ...[...(b.text || '').matchAll(/\[\[([^\]|]+)/g)].map((m) => m[1])]);
      ids.forEach((id) => {
        (this.appear[id] ||= []).push({ id: b.id, act: a, seg: s, year: b.year });
        if (this.firstAct[id] == null) this.firstAct[id] = { i: ai, n: a.n, title: a.title };
      });
    })));
  }
  persist() { this.store.set('cast.met', [...this._met]); this.store.set('cast.studied', [...this._studied]); }
  met() { return [...this._met]; }

  // ---------------- chips
  decorate(container) {
    if (!container) return;
    container.querySelectorAll('button.who[data-person]').forEach((b) => {
      if (b.dataset.cc) return;
      const id = b.dataset.person, p = this.P[id]; if (!p) return;
      b.dataset.cc = '1';
      const label = b.textContent;
      b.textContent = '';
      b.classList.add('cc-chip');
      b.setAttribute('aria-haspopup', 'dialog');
      b.setAttribute('type', 'button');
      b.setAttribute('aria-label', `${label}: open card`);
      const face = el('span', { class: `cc-face${p.img ? '' : ' mark'}`, 'aria-hidden': 'true' });
      if (p.img) { const t = thumb(this.C, p.img, 28, 28, { fy: 0.12, cls: 'cc-face-img' }); if (t) face.append(t); }
      else { const m = markOf(p); face.append(el('span', { class: `cc-mark${isLatin(m) ? ' latin' : ''}`, lang: isLatin(m) ? null : 'ja', text: [...m][0] })); }
      b.append(face, el('span', { class: 'cc-nm', text: label }));
      b.addEventListener('click', () => this.open(id, b));
      b.addEventListener('pointerenter', () => { if (this.hover.matches) this.showCardSoon(id, b, 320); });
      b.addEventListener('pointerleave', () => this.hideCard(180));
      b.addEventListener('focus', () => { if (b.matches(':focus-visible')) this.showCardSoon(id, b, 450); });
      b.addEventListener('blur', () => this.hideCard(120));
    });
  }

  // ---------------- card
  card(id, { actions = true, vt } = {}) {
    const p = this.P[id], g = (this.C.groups || []).find((x) => x.id === p.group);
    const rich = !!p.bet;
    const d = personDates(p);
    const c = el('div', { class: `cc-card${rich ? '' : ' simple'}`, 'data-person': id },
      el('div', { class: 'cc-top' },
        hanko(this.C, p, 84, { vt }),
        el('div', { class: 'cc-id' },
          el('span', { class: 'cc-role', text: p.role || g?.title || '' }),
          el('h3', { class: 'cc-name', text: shortName(p) }),
          p.kanji ? el('div', { class: 'cc-kanji', lang: 'ja', text: p.kanji }) : null,
          d ? el('div', { class: 'cc-dates', text: d }) : null)),
      rich ? el('p', { class: 'cc-bet' }, el('span', { class: 'cc-kick', text: 'The bet' }), el('span', { text: p.bet })) : el('p', { class: 'cc-note', text: p.line || '' }),
      rich ? el('ul', { class: 'cc-hl' }, ...(p.highlights || []).slice(0, 3).map((h) => el('li', {}, confChip(h.conf), el('span', { text: h.t })))) : null);
    if (actions) {
      const act = (lab, tab, fn, dis) => el('button', { type: 'button', class: 'cc-act', disabled: dis || null, onclick: (e) => { e.stopPropagation(); fn ? fn() : this.open(id, this.lastTrigger, { tab }); } }, lab);
      const map = p.map, yr = this.yearOf(p);
      c.append(el('div', { class: 'cc-actions' },
        act('Story', 'story'), act('Works', 'works', null, !(p.works || []).length),
        act('Connections', 'links'),
        act('Show on map', null, () => this.showMap(id), !map || !this.on.onShowPlace),
        act('Show on timeline', null, () => this.showYear(id), yr == null || !this.on.onShowYear)));
    }
    if (this._studied.has(id)) c.append(this.seal(false));
    return c;
  }
  yearOf(p) { return p.life?.[0]?.y ?? num(p.born) ?? num(p.died) ?? null; }
  showMap(id) { const m = this.P[id]?.map; if (!m) return; this.hideCard(0); this.close(true); this.on.onShowPlace?.(m.ids?.[0] || m.route, m.scale, m); }
  showYear(id) { const y = this.yearOf(this.P[id]); if (y == null) return; this.hideCard(0); this.close(true); this.on.onShowYear?.(y, id); }
  seal(anim) { return el('span', { class: `cc-seal${anim ? ' stamp' : ''}`, title: 'Story read', 'aria-label': 'Story read', role: 'img' }, el('span', { lang: 'ja', 'aria-hidden': 'true', text: '読' })); }

  showCardSoon(id, anchor, ms) { clearTimeout(this.popT); this.popT = setTimeout(() => this.showCard(id, anchor), ms); }
  hideCard(ms = 0) {
    clearTimeout(this.popT);
    const go = () => { if (this.pop.hidden) return; this.pop.classList.remove('on'); this.pop.hidden = true; this.pop.innerHTML = ''; this.popId = null; };
    if (ms) this.popT = setTimeout(go, ms); else go();
  }
  showCard(id, anchor) {
    if (!this.P[id] || this.dlg.open || !anchor.isConnected) return;
    const host = this.deck?.open ? this.deck : document.body;
    if (this.pop.parentNode !== host) host.append(this.pop);
    this.lastTrigger = anchor; this.popId = id;
    this.pop.innerHTML = ''; this.pop.append(this.card(id, { vt: null }));
    this.pop.hidden = false;
    // place below the chip, flip above if needed, clamp to the viewport
    const r = anchor.getBoundingClientRect(), W = this.pop.offsetWidth || 288, H = this.pop.offsetHeight || 380;
    let x = Math.min(Math.max(8, r.left + r.width / 2 - W / 2), innerWidth - W - 8);
    let y = r.bottom + 8, above = false;
    if (y + H > innerHeight - 8) { y = r.top - H - 8; above = true; }
    if (y < 8) y = Math.max(8, Math.min(innerHeight - H - 8, r.bottom + 8));
    this.pop.style.left = `${x}px`; this.pop.style.top = `${y}px`;
    this.pop.classList.toggle('above', above);
    requestAnimationFrame(() => this.pop.classList.add('on'));
  }

  // ---------------- meet
  meet(id) {
    if (!this.P[id] || this._met.has(id)) return;
    this._met.add(id); this.persist();
    const btnFace = this.btn?.querySelector('.cc-stack');
    const chip = [...document.querySelectorAll(`.cc-chip[data-person="${CSS.escape(id)}"] .cc-face`)].find((f) => { const r = f.getBoundingClientRect(); return r.width && r.bottom > 0 && r.top < innerHeight; });
    const done = () => { this.syncButton(true); this.syncDeckTile(id); };
    if (!chip || !btnFace || motion.reduced || !this.btn.isConnected) { done(); return; }
    const a = chip.getBoundingClientRect(), b = btnFace.getBoundingClientRect();
    const ghost = chip.cloneNode(true);
    ghost.classList.add('cc-flyer');
    Object.assign(ghost.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
    document.body.append(ghost);
    const dx = b.left + 14 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const anim = ghost.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 40}px) scale(1.25)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.9)`, opacity: 0.2 },
    ], { duration: 400, easing: EASE_CSS.enter });
    anim.onfinish = () => { ghost.remove(); done(); };
  }

  // ---------------- sheet
  open(id, trigger, { tab } = {}) {
    const p = this.P[id]; if (!p) return;
    if (this.dlg.open && this.sheetId === id && !tab) return;
    const fromCard = this.pop.hidden ? null : this.pop.querySelector('.cc-hanko');
    this.hideCard(0);
    if (!this.dlg.open) this.returnTo = trigger || document.activeElement;
    const build = () => { this.renderSheet(id, tab || 'story'); };
    const vtOK = typeof document.startViewTransition === 'function' && !motion.reduced && fromCard;
    if (this.dlg.open) {
      // swap people inside an open sheet: a short crossfade of the content
      const inner = this.dlg.firstChild;
      if (!motion.reduced && inner) inner.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 110 }).onfinish = () => { build(); this.dlg.firstChild?.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: EASE_CSS.enter }); };
      else build();
      return;
    }
    if (vtOK) {
      fromCard.style.viewTransitionName = 'cc-face';
      const vt = document.startViewTransition(() => { fromCard.style.viewTransitionName = ''; this.pop.hidden = true; build(); this.dlg.showModal(); this.afterOpen(); });
      vt.finished.catch(() => {});
    } else { build(); this.dlg.showModal(); this.dlg.classList.add('fade'); this.afterOpen(); }
  }
  afterOpen() {
    document.documentElement.classList.add('cc-locked');
    const t = this.dlg.querySelector('[role="tab"][aria-selected="true"]') || this.dlg.querySelector('.cc-x');
    t?.focus({ preventScroll: true });
  }
  close(silent) {
    if (!this.dlg.open) return;
    const finish = () => {
      this.dlg.close(); this.dlg.classList.remove('fade', 'closing'); this.sheetId = null;
      document.documentElement.classList.remove('cc-locked');
      if (!silent && this.returnTo?.isConnected) this.returnTo.focus({ preventScroll: true });
      this.returnTo = null;
    };
    if (motion.reduced || silent) return finish();
    this.dlg.classList.add('closing');
    setTimeout(finish, 130);
  }
  renderSheet(id, tab) {
    const p = this.P[id], C = this.C, g = (C.groups || []).find((x) => x.id === p.group);
    this.sheetId = id;
    const d = personDates(p);
    const head = el('header', { class: 'cc-sh-head' },
      hanko(C, p, 112, { vt: 'cc-face' }),
      el('div', { class: 'cc-id' },
        el('span', { class: 'cc-role', text: p.role || g?.title || '' }),
        el('h2', { class: 'cc-name', id: 'cc-sheet-name', text: shortName(p) }),
        p.kanji ? el('div', { class: 'cc-kanji', lang: 'ja', text: p.kanji }) : null,
        el('div', { class: 'cc-dates', text: [d, g ? `${g.title} · ${g.kanji}` : ''].filter(Boolean).join(' · ') }),
        p.bet ? el('p', { class: 'cc-bet' }, el('span', { class: 'cc-kick', text: 'The bet' }), el('span', { text: p.bet })) : null),
      el('button', { class: 'cc-x', type: 'button', 'aria-label': 'Close', onclick: () => this.close() }, el('span', { 'aria-hidden': 'true', text: '×' })));
    this.sealSlot = el('div', { class: 'cc-seal-slot' }, this._studied.has(id) ? this.seal(false) : null);
    head.append(this.sealSlot);
    const tabs = [['story', 'Story'], ['works', 'Works'], ['links', 'Connections'], ['life', 'Life']]
      .filter(([k]) => k !== 'works' || (p.works || []).length).filter(([k]) => k !== 'life' || (p.life || []).length || p.born != null);
    if (!tabs.some(([k]) => k === tab)) tab = 'story';
    const list = el('div', { class: 'cc-tabs', role: 'tablist', 'aria-label': `${shortName(p)}: sections` });
    const panel = el('section', { class: 'cc-panel', role: 'tabpanel', tabindex: '0' });
    const btns = tabs.map(([k, lab]) => el('button', { type: 'button', role: 'tab', id: `cc-tab-${k}`, 'aria-controls': 'cc-panel', 'aria-selected': 'false', tabindex: '-1', 'data-k': k }, lab));
    panel.id = 'cc-panel';
    const select = (k, focus) => {
      btns.forEach((b) => { const on = b.dataset.k === k; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
      panel.setAttribute('aria-labelledby', `cc-tab-${k}`);
      panel.innerHTML = '';
      panel.append(...this.panel(id, k));
      this.decorate(panel);
      if (!motion.reduced) panel.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: EASE_CSS.enter });
      if (k === 'story') this.study(id);
    };
    btns.forEach((b, i) => {
      b.addEventListener('click', () => select(b.dataset.k));
      b.addEventListener('keydown', (e) => {
        const n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (n) { e.preventDefault(); select(btns[(i + n + btns.length) % btns.length].dataset.k, true); }
        if (e.key === 'Home') { e.preventDefault(); select(btns[0].dataset.k, true); }
        if (e.key === 'End') { e.preventDefault(); select(btns.at(-1).dataset.k, true); }
      });
      list.append(b);
    });
    const yr = this.yearOf(p);
    const acts = el('div', { class: 'cc-sh-acts' },
      p.map && this.on.onShowPlace ? el('button', { type: 'button', class: 'cc-act', onclick: () => this.showMap(id) }, 'Show on map') : null,
      yr != null && this.on.onShowYear ? el('button', { type: 'button', class: 'cc-act', onclick: () => this.showYear(id) }, 'Show on timeline') : null);
    const srcs = (p.sources || []).map((s) => C.sources?.[s]).filter(Boolean);
    const foot = srcs.length ? el('footer', { class: 'cc-sh-src' }, el('div', { class: 'cc-kick', text: 'Sources' }),
      el('ol', {}, ...srcs.map((s) => el('li', {}, s.u ? el('a', { href: s.u, target: '_blank', rel: 'noopener' }, s.t) : s.t)))) : null;
    const inner = el('div', { class: 'cc-sh-in' }, el('div', { class: 'cc-grab', 'aria-hidden': 'true' }), head, acts.childElementCount ? acts : null, list, panel, foot);
    this.dlg.innerHTML = ''; this.dlg.append(inner);
    select(tab);
  }
  study(id) {
    if (this._studied.has(id)) return;
    this._studied.add(id); this.persist();
    if (this.sheetId === id && this.sealSlot) { this.sealSlot.innerHTML = ''; this.sealSlot.append(this.seal(true)); }
    this.syncDeckTile(id);
  }
  panel(id, k) {
    const p = this.P[id], C = this.C;
    if (k === 'story') {
      const out = [el('div', { class: 'cc-story', html: renderText(p.story || p.line || '', this.P) })];
      const g = (C.groups || []).find((x) => x.id === p.group);
      if (!p.story && g?.note) out.push(el('p', { class: 'cc-groupnote' }, el('span', { class: 'cc-kick', text: `${g.title} · ${g.kanji}` }), el('span', { text: g.note })));
      if (p.highlights?.length) out.push(el('ul', { class: 'cc-hl wide' }, ...p.highlights.map((h) => el('li', {}, confChip(h.conf), el('span', { text: h.t })))));
      if (p.cap) out.push(el('p', { class: 'cc-cap', text: `Likeness: ${p.cap}` }));
      else if (!p.img && p.mark) out.push(el('p', { class: 'cc-cap', text: 'No reliable likeness is known; the seal frame carries the name or mark the record gives.' }));
      const ap = this.appear[id] || [];
      if (ap.length && this.on.onGo) {
        out.push(el('div', { class: 'cc-kick', style: 'margin-top:14px', text: 'Appears in the story' }),
          el('ul', { class: 'cc-appear' }, ...ap.slice(0, 8).map((b) => el('li', {}, el('button', { type: 'button', class: 'cc-link', onclick: () => { this.close(true); this.on.onGo(b.id); } },
            el('span', { class: 'n', text: b.act.n ? `Act ${b.act.n}` : 'Prologue' }), ` ${b.seg.title} · ${Math.floor(b.year)}`)))));
      }
      return out;
    }
    if (k === 'works') {
      const out = [];
      if (p.worksNote) out.push(el('p', { class: 'cc-cap', text: p.worksNote }));
      const grid = el('div', { class: 'cc-works' });
      (p.works || []).forEach((w) => {
        const m = C.images?.[w] || {};
        const b = el('button', { type: 'button', class: 'cc-work', 'aria-label': `Open the image: ${m.title || w}`, onclick: () => { if (this.on.onOpenImage) { this.close(true); this.on.onOpenImage(w); } else window.open(imgUrl(w), '_blank', 'noopener'); } },
          thumb(C, w, 140, 140, { fy: 0.3, cls: 'cc-thumb' }) || el('span', { class: 'cc-thumb blank' }));
        grid.append(el('figure', {}, b, el('figcaption', {}, el('b', { text: m.title || w }), el('span', { html: provenance({ ...m, title: '' }) }))));
      });
      out.push(grid);
      return out;
    }
    if (k === 'links') return this.network(id);
    if (k === 'life') return this.life(id);
    return [];
  }

  // ---------------- connections: a small ego network + the same as a list
  edges(id) {
    const p = this.P[id], out = [], seen = new Set();
    (p.links || []).forEach((l) => { const key = l.to || 'L:' + l.label; if (seen.has(key)) return; seen.add(key); out.push({ to: l.to, label: l.to ? shortName(this.P[l.to]) : l.label, rel: l.rel, dir: 'out' }); });
    Object.entries(this.P).forEach(([oid, o]) => (o.links || []).forEach((l) => {
      if (l.to !== id || seen.has(oid)) return; seen.add(oid);
      out.push({ to: oid, label: shortName(o), rel: l.rel, dir: 'in' });
    }));
    return out;
  }
  network(id) {
    const p = this.P[id], E = this.edges(id);
    if (!E.length) return [el('p', { class: 'cc-cap', text: 'No connections are recorded for this person in the unit.' })];
    const W = 420, H = Math.max(300, Math.min(420, 220 + E.length * 18)), cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) / 2 - 46;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'cc-net'); svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `${shortName(p)} and ${E.length} connections; the list below gives each one.`);
    const mk = (tag, a = {}) => { const n = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(a)) n.setAttribute(k, v); return n; };
    const defs = mk('defs'); const clip = mk('clipPath', { id: 'cc-net-clip' }); clip.append(mk('circle', { r: 20 })); defs.append(clip);
    const mkr = mk('marker', { id: 'cc-arr', viewBox: '0 0 8 8', refX: 7, refY: 4, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
    mkr.append(mk('path', { d: 'M0,0L8,4L0,8z', class: 'cc-net-arr' })); defs.append(mkr); svg.append(defs);
    const gE = mk('g'), gN = mk('g'); svg.append(gE, gN);
    const off = E.length % 2 ? 0 : Math.PI / E.length;
    const pos = E.map((e, i) => { const a = -Math.PI / 2 + off + (i / E.length) * Math.PI * 2; return [cx + Math.cos(a) * R * 1.25, cy + Math.sin(a) * R * 0.92]; });
    E.forEach((e, i) => {
      const [x, y] = pos[i];
      const ux = (x - cx) / Math.hypot(x - cx, y - cy), uy = (y - cy) / Math.hypot(x - cx, y - cy);
      const a = [cx + ux * 30, cy + uy * 30], b = [x - ux * 24, y - uy * 24];
      const line = mk('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: `cc-net-e${e.to ? '' : ' soft'}` });
      if (e.dir === 'out') line.setAttribute('marker-end', 'url(#cc-arr)'); else line.setAttribute('marker-start', 'url(#cc-arr)');
      gE.append(line);
      if (!motion.reduced) { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); line.style.strokeDasharray = `${L}`; line.style.strokeDashoffset = `${L}`; line.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 400, delay: 40 * i, easing: EASE_CSS.enter, fill: 'forwards' }); }
      const g = mk('g', { transform: `translate(${x},${y})`, class: `cc-net-n${e.to ? ' person' : ' other'}` });
      const o = e.to ? this.P[e.to] : null;
      if (o) {
        g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', `Open ${o.name}`);
        g.append(mk('circle', { r: 22, class: 'nring' }));
        const sp = o.img && spriteOf(this.C, o.img);
        if (sp) {
          const k = 40 / Math.min(sp.w, sp.h);
          const img = mk('image', { href: sp.url, x: -sp.x * k - (sp.w * k - 40) / 2 - 20, y: -sp.y * k - 20 - (sp.h * k - 40) * 0.12, width: sp.W * k, height: sp.H * k, 'clip-path': 'url(#cc-net-clip)', preserveAspectRatio: 'none' });
          g.append(img);
        } else { const m = mk('text', { y: 6, 'text-anchor': 'middle', class: 'cc-net-mark' }); m.textContent = [...markOf(o)][0]; g.append(m); }
        const go = () => this.open(e.to, this.returnTo);
        g.addEventListener('click', go); g.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(); } });
      } else g.append(mk('circle', { r: 10, class: 'nring other' }));
      const below = y >= cy - 4 || Math.abs(x - cx) > R * 0.5;
      const ly0 = below ? (o ? 36 : 24) : (o ? -44 : -32);
      const nl = mk('text', { y: ly0, 'text-anchor': 'middle', class: 'cc-net-lab' }); nl.textContent = e.label; g.append(nl);
      const rl = mk('text', { y: ly0 + 13, 'text-anchor': 'middle', class: 'cc-net-rel' }); rl.textContent = e.rel.length > 30 ? e.rel.slice(0, 29) + '…' : e.rel; g.append(rl);
      if (!motion.reduced) g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: 40 * i, fill: 'backwards' });
      gN.append(g);
    });
    const c = mk('g', { transform: `translate(${cx},${cy})`, class: 'cc-net-c' });
    c.append(mk('rect', { x: -28, y: -28, width: 56, height: 56, class: 'frame' }));
    const sp = p.img && spriteOf(this.C, p.img);
    if (sp) {
      const k = 48 / Math.min(sp.w, sp.h);
      const cp = mk('clipPath', { id: 'cc-net-cclip' }); cp.append(mk('rect', { x: -24, y: -24, width: 48, height: 48 })); defs.append(cp);
      c.append(mk('image', { href: sp.url, x: -sp.x * k - (sp.w * k - 48) / 2 - 24, y: -sp.y * k - 24 - (sp.h * k - 48) * 0.12, width: sp.W * k, height: sp.H * k, 'clip-path': 'url(#cc-net-cclip)', preserveAspectRatio: 'none' }));
    } else { const m = mk('text', { y: 8, 'text-anchor': 'middle', class: 'cc-net-mark big' }); m.textContent = [...markOf(p)].slice(0, 2).join(''); c.append(m); }
    gN.append(c);
    const list = el('ul', { class: 'cc-netlist', 'aria-label': 'Connections, as a list' }, ...E.map((e) => {
      const me = shortName(p);
      const other = e.to ? el('button', { type: 'button', class: 'cc-link', onclick: () => this.open(e.to, this.returnTo) }, e.label) : el('span', { text: e.label });
      return e.dir === 'out' ? el('li', {}, el('i', { text: e.rel[0].toUpperCase() + e.rel.slice(1) }), ' ', other) : el('li', {}, other, ' ', el('i', { text: e.rel }), ` (${me})`);
    }));
    return [svg, list];
  }

  // ---------------- life: a mini lifespan line with ticks and dated works
  life(id) {
    const p = this.P[id], C = this.C;
    const ticks = (p.life || []).map((t) => ({ y: t.y, t: t.t }));
    const b = num(p.born), d = num(p.died);
    const works = (p.works || []).map((w) => { const m = C.images?.[w]; const yy = m?.date && /(1[5-9]\d\d)/.exec(m.date); return yy ? { id: w, y: +yy[1], title: m.title } : null; }).filter(Boolean);
    const ys = [...ticks.map((t) => t.y), ...works.map((w) => w.y), b, d].filter((v) => v != null);
    if (!ys.length) return [el('p', { class: 'cc-cap', text: 'No dates are recorded.' })];
    let y0 = Math.min(...ys), y1 = Math.max(...ys); const pad = Math.max(2, (y1 - y0) * 0.06); y0 -= pad; y1 += pad;
    const W = 420, H = works.length ? 136 : 80, top = works.length ? 72 : 24;
    const X = (y) => 54 + (y - y0) / (y1 - y0 || 1) * (W - 108);
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'cc-life'); svg.setAttribute('aria-hidden', 'true');
    const mk = (tag, a = {}, txt) => { const n = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(a)) n.setAttribute(k, v); if (txt != null) n.textContent = txt; svg.append(n); return n; };
    const lb = b ?? y0 + pad, ld = d ?? y1 - pad;
    const line = mk('line', { x1: X(lb), x2: X(ld), y1: top, y2: top, class: 'span' });
    if (approx(p.born)) mk('line', { x1: X(lb) - 18, x2: X(lb), y1: top, y2: top, class: 'span approx' });
    if (approx(p.died)) mk('line', { x1: X(ld), x2: X(ld) + 18, y1: top, y2: top, class: 'span approx' });
    if (!motion.reduced) { const L = X(ld) - X(lb); line.style.strokeDasharray = `${L}`; line.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 600, easing: EASE_CSS.enter }); }
    if (b != null) mk('text', { x: X(lb) - 8, y: top + 4, 'text-anchor': 'end', class: 'end' }, approx(p.born) ? `c. ${b}` : b);
    if (d != null) mk('text', { x: X(ld) + 8, y: top + 4, 'text-anchor': 'start', class: 'end' }, approx(p.died) ? `c. ${d}` : d);
    let lastX = -1e9, row = 0;
    ticks.forEach((t) => {
      mk('circle', { cx: X(t.y), cy: top, r: 4.5, class: 'tick' });
      const px = X(t.y); if (px - lastX < 30) { row++; if (row > 1) return; } else row = 0;
      lastX = px; mk('text', { x: px, y: top + (row ? 46 : 18), 'text-anchor': 'middle', class: 'ty' }, Math.floor(t.y));
    });
    works.forEach((w, i) => {
      const s = spriteOf(C, w.id); const x = X(w.y);
      mk('line', { x1: x, x2: x, y1: top - 6, y2: 50, class: 'wl' });
      if (s) { const k = 36 / Math.max(s.w, s.h); const cp = document.createElementNS(NS, 'svg'); cp.setAttribute('x', x - s.w * k / 2); cp.setAttribute('y', 50 - s.h * k); cp.setAttribute('width', s.w * k); cp.setAttribute('height', s.h * k); cp.setAttribute('viewBox', `${s.x} ${s.y} ${s.w} ${s.h}`); const im = document.createElementNS(NS, 'image'); im.setAttribute('href', s.url); im.setAttribute('width', s.W); im.setAttribute('height', s.H); cp.append(im); svg.append(cp); }
    });
    const ol = el('ol', { class: 'cc-lifelist' },
      b != null ? el('li', {}, el('b', { text: approx(p.born) ? `c. ${b}` : String(b) }), ' Born') : null,
      ...[...ticks.map((t) => ({ y: t.y, n: el('li', {}, el('b', { text: String(Math.floor(t.y)) }), ` ${t.t}`) })),
        ...works.map((w) => ({ y: w.y, n: el('li', { class: 'w' }, el('b', { text: String(w.y) }), ` Work: ${w.title}`) }))].sort((a, c) => a.y - c.y).map((x) => x.n),
      d != null ? el('li', {}, el('b', { text: approx(p.died) ? `c. ${d}` : String(d) }), ' Died') : null);
    const era = b != null ? eraOf(b) : '';
    return [svg, ol, era ? el('p', { class: 'cc-cap', text: `Born in ${era.split(' · ')[0]}.` }) : null].filter(Boolean);
  }

  // ---------------- deck
  mountDeck(parent = document.body) {
    if (this.btn) return;
    this.btn = el('button', { type: 'button', class: 'cc-castbtn', 'aria-haspopup': 'dialog', onclick: () => this.openDeck() },
      el('span', { class: 'cc-stack', 'aria-hidden': 'true' }),
      el('span', { class: 'cc-blab', text: 'Cast' }),
      el('span', { class: 'cc-count', 'aria-live': 'polite' }, el('span', { class: 'v', text: '0' })));
    if (parent !== document.body) this.btn.classList.add('inline'); // a host slot (e.g. in the bar) keeps it in flow
    parent.append(this.btn);
    this.deck = el('dialog', { class: 'cc-deck', 'aria-labelledby': 'cc-deck-h' });
    this.deck.addEventListener('cancel', (e) => { e.preventDefault(); this.closeDeck(); });
    this.deck.addEventListener('click', (e) => { if (e.target === this.deck) this.closeDeck(); });
    document.body.append(this.deck);
    this.sort = this.store.get('cast.sort', 'group'); this.showAll = false;
    this.syncButton(false);
  }
  syncButton(tick) {
    if (!this.btn) return;
    const n = this._met.size, v = this.btn.querySelector('.cc-count');
    const stack = this.btn.querySelector('.cc-stack'); stack.innerHTML = '';
    const recent = [...this._met].slice(-3);
    if (!recent.length) stack.innerHTML = `<span class="cc-face sil">${SILHOUETTE}</span>`;
    recent.forEach((id) => { const p = this.P[id]; const f = el('span', { class: `cc-face${p.img ? '' : ' mark'}` }); if (p.img) { const t = thumb(this.C, p.img, 28, 28, { fy: 0.12, cls: 'cc-face-img' }); if (t) f.append(t); } else f.append(el('span', { class: 'cc-mark', lang: 'ja', text: [...markOf(p)][0] })); stack.append(f); });
    this.btn.setAttribute('aria-label', `Cast: ${n} ${n === 1 ? 'person' : 'people'} met. Open the deck.`);
    const old = v.querySelector('.v');
    if (old.textContent === String(n)) return;
    if (!tick || motion.reduced) { old.textContent = String(n); return; }
    const nu = el('span', { class: 'v', text: String(n) }); v.append(nu);
    old.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-100%)', opacity: 0 }], { duration: 200, easing: EASE_CSS.exit }).onfinish = () => old.remove();
    nu.animate([{ transform: 'translateY(100%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 200, easing: EASE_CSS.enter });
    this.btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 200, easing: EASE_CSS.standard });
  }
  openDeck() {
    if (!this.deck) this.mountDeck();
    this.renderDeck();
    this.deckReturn = document.activeElement;
    this.deck.showModal();
    this.deck.querySelector('.cc-seg button[aria-pressed="true"]')?.focus();
  }
  closeDeck() {
    if (!this.deck?.open) return;
    this.deck.close(); (this.deckReturn?.isConnected ? this.deckReturn : this.btn)?.focus({ preventScroll: true });
  }
  renderDeck() {
    const D = this.deck; D.innerHTML = '';
    const sorts = [['group', 'Role'], ['act', 'Act'], ['az', 'A–Z']];
    const seg = el('div', { class: 'cc-seg', role: 'group', 'aria-label': 'Sort the cast' }, ...sorts.map(([k, lab]) =>
      el('button', { type: 'button', 'aria-pressed': String(this.sort === k), onclick: () => { this.sort = k; this.store.set('cast.sort', k); this.renderDeck(); D.querySelector('.cc-seg button[aria-pressed="true"]')?.focus(); } }, lab)));
    const all = el('button', { type: 'button', class: 'cc-act', 'aria-pressed': String(this.showAll), onclick: () => { this.showAll = !this.showAll; this.renderDeck(); D.querySelector('.cc-allnames')?.focus(); } }, this.showAll ? 'Hide names not yet met' : 'Show every name');
    all.classList.add('cc-allnames');
    const n = this._met.size;
    D.append(el('div', { class: 'cc-deck-in' },
      el('header', { class: 'cc-deck-h' },
        el('div', {}, el('span', { class: 'cc-kick', text: 'Who’s who' }), el('h2', { id: 'cc-deck-h', text: 'The cast' }),
          el('p', { class: 'cc-cap', text: `${n} met so far. People join as the story names them; anyone can be opened at any time.` })),
        el('div', { class: 'cc-deck-tools' }, seg, all),
        el('button', { class: 'cc-x', type: 'button', 'aria-label': 'Close the cast', onclick: () => this.closeDeck() }, el('span', { 'aria-hidden': 'true', text: '×' }))),
      ...this.deckSections()));
  }
  deckSections() {
    const ids = Object.keys(this.P);
    const groups = [];
    if (this.sort === 'group') (this.C.groups || []).forEach((g) => groups.push({ title: g.title, kanji: g.kanji, note: g.note, ids: ids.filter((id) => this.P[id].group === g.id) }));
    else if (this.sort === 'act') {
      const acts = this.C.acts || [];
      acts.forEach((a, i) => groups.push({ title: a.n ? `Act ${a.n} · ${a.title}` : a.title, ids: ids.filter((id) => this.firstAct[id]?.i === i) }));
      groups.push({ title: 'Not named in the story', ids: ids.filter((id) => this.firstAct[id] == null) });
    } else groups.push({ title: 'A–Z', ids: [...ids].sort((a, b) => shortName(this.P[a]).localeCompare(shortName(this.P[b]))) });
    return groups.filter((g) => g.ids.length).map((g) => el('section', { class: 'cc-deck-sec' },
      el('h3', {}, g.title, g.kanji ? el('span', { class: 'k', lang: 'ja', text: ` ${g.kanji}` }) : null),
      g.note ? el('p', { class: 'cc-cap', text: g.note }) : null,
      el('ul', { class: 'cc-grid' }, ...g.ids.map((id, i) => el('li', {}, this.tile(id, i))))));
  }
  tile(id, i) {
    const p = this.P[id], met = this._met.has(id), named = met || this.showAll;
    const g = (this.C.groups || []).find((x) => x.id === p.group);
    const fa = this.firstAct[id];
    const b = el('button', { type: 'button', class: `cc-tile${met ? ' met' : ' unmet'}${named ? '' : ' hidden-name'}`, 'data-person': id, 'aria-haspopup': 'dialog',
      'aria-label': named ? `${p.name}${met ? '' : ', not met yet'}` : `Not met yet: ${p.role || g?.title || 'a person'}${fa ? `, appears in ${fa.n ? 'Act ' + fa.n : 'the prologue'}` : ''}. Open anyway.` },
      named ? hanko(this.C, p, 76) : el('span', { class: 'cc-hanko sil', style: '--s:76px', 'aria-hidden': 'true', html: SILHOUETTE }),
      el('span', { class: 'cc-tname', text: named ? shortName(p) : 'Not met yet' }),
      el('span', { class: 'cc-tmeta', text: named ? [p.role || g?.title, personDates(p)].filter(Boolean).join(' · ') : (fa ? `Appears in ${fa.n ? 'Act ' + fa.n : 'the prologue'}` : (p.role || g?.title || '')) }),
      this._studied.has(id) ? this.seal(false) : null);
    b.addEventListener('click', () => this.open(id, b));
    if (named) {
      b.addEventListener('pointerenter', () => { if (this.hover.matches) this.showCardSoon(id, b, 500); });
      b.addEventListener('pointerleave', () => this.hideCard(160));
    }
    if (!motion.reduced) b.style.animationDelay = `${Math.min(300, i * 40)}ms`;
    return b;
  }
  syncDeckTile(id) {
    if (!this.deck?.open) return;
    const t = this.deck.querySelector(`.cc-tile[data-person="${CSS.escape(id)}"]`);
    if (t) t.replaceWith(this.tile(id, 0));
  }
}

// ---------------------------------------------------------------- v3 entity sheet (places, events, views, images)
const strip = (t) => t.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2').replace(/\[\[([^\]]+)\]\]/g, '$1').replace(/\*+/g, '');
export class Sheet {
  constructor(root, C, { onGo } = {}) {
    this.root = root; this.C = C; this.onGo = onGo;
    this.beats = C.acts.flatMap((a) => a.segments.flatMap((s) => s.beats.map((b) => ({ ...b, act: a, seg: s }))));
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'false');
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.open) this.close(); });
  }
  close() { this.open = false; this.root.classList.remove('on'); this.root.setAttribute('aria-hidden', 'true'); this.back?.focus?.(); }
  show(item) {
    this.back = document.activeElement;
    const body = this.render(item); if (!body) return;
    this.root.innerHTML = '';
    const x = el('button', { class: 'x', type: 'button', 'aria-label': 'Close', onclick: () => this.close() }, '×');
    this.root.append(x, ...body);
    this.open = true; this.root.classList.add('on'); this.root.setAttribute('aria-hidden', 'false'); this.root.scrollTop = 0;
    x.focus({ preventScroll: true });
  }
  appears(test) {
    const hits = this.beats.filter(test);
    if (!hits.length) return [];
    const ul = el('ul');
    hits.slice(0, 8).forEach((b) => {
      const a = el('a', { href: `#${b.id}`, onclick: (e) => { e.preventDefault(); this.close(); this.onGo?.(b.id); } }, `${b.act.n ? 'Act ' + b.act.n + ' · ' : ''}${b.seg.title}`);
      ul.append(el('li', {}, a, el('span', { style: 'color:var(--ink-3)', text: ` · ${Math.floor(b.year)}` })));
    });
    return [el('div', { class: 'kicker', style: 'margin-top:14px', text: 'Appears in' }), ul];
  }
  render(it) {
    const C = this.C;
    if (it.type === 'person') {
      const p = C.people[it.id]; if (!p) return null;
      const g = C.groups.find((x) => x.id === p.group);
      const out = [el('div', { class: 'kicker', text: g ? `${g.title} · ${g.kanji}` : '' }), el('h3', { html: `${esc(p.name)}${p.kanji ? ` <span class="k" lang="ja">${esc(p.kanji)}</span>` : ''}` }), el('div', { class: 'meta', text: personDates(p) })];
      if (p.img) out.push(el('img', { src: imgUrl(p.img), alt: `Portrait: ${p.name}`, loading: 'lazy' }), el('div', { class: 'meta', text: p.cap || '' }));
      out.push(el('p', { class: 'body', text: p.line || '' }));
      out.push(...this.appears((b) => (b.people || []).includes(it.id) || b.text.includes(`[[${it.id}`)));
      return out;
    }
    if (it.type === 'event') {
      const e = C.timeline.events.find((x) => x.id === it.id); if (!e) return null;
      const lane = C.timeline.lanes.find((l) => l.id === e.lane);
      const out = [el('div', { class: 'kicker', text: `${lane?.label || e.lane} · ${eraOf(e.year) || ''}` }), el('h3', { text: `${Math.floor(e.year)}` }), el('p', { class: 'body', text: e.label })];
      if (e.img && C.images[e.img]) { const m = C.images[e.img] || {}; out.push(el('img', { src: imgUrl(e.img), alt: m.title || '', loading: 'lazy' }), el('div', { class: 'meta', html: provenance(m) })); }
      out.push(...this.appears((b) => (b.show || []).includes(e.id)));
      return out;
    }
    if (it.type === 'place') {
      let id = it.city || it.id;
      if (!id) id = Object.keys(C.places.world).find((k) => C.places.world[k].name === it.name);
      const pl = (it.city ? C.places.city[id] : C.places.world[id]) || it;
      const out = [el('div', { class: 'kicker', text: it.city ? 'Place · on the 1859 map' : 'Place' }), el('h3', { html: `${esc(pl.name || it.name)}${pl.kanji ? ` <span class="k" lang="ja">${esc(pl.kanji)}</span>` : ''}` })];
      if (pl.lat != null) out.push(el('div', { class: 'meta', text: `${pl.lat.toFixed(3)}° N, ${Math.abs(pl.lon).toFixed(3)}° ${pl.lon < 0 ? 'W' : 'E'}${pl.approx ? ' · position approximate' : ''}` }));
      if (it.date || pl.date) out.push(el('p', { class: 'body', text: it.date || pl.date }));
      if (pl.note) out.push(el('p', { class: 'body', text: pl.note }));
      out.push(...this.appears((b) => { const s = b.stage || {}; return [].concat(s.points || [], Array.isArray(s.focus) ? s.focus : []).includes(id); }));
      return out;
    }
    if (it.type === 'view') {
      const v = it.view, id = 'hv-' + String(v.n).padStart(3, '0');
      return [el('div', { class: 'kicker', text: `One Hundred Famous Views of Edo · no. ${v.n} · ${v.season}` }), el('h3', { text: v.t }), el('div', { class: 'k', lang: 'ja', text: v.ja }),
        el('img', { src: imgUrl(id, 'hv'), alt: `Hiroshige, ${v.t}`, loading: 'lazy' }),
        el('p', { class: 'meta', text: 'Utagawa Hiroshige, publisher Uoya Eikichi, 1856–58 · via Wikimedia Commons · public domain' })];
    }
    if (it.type === 'image') {
      const m = C.images[it.id] || {};
      return [el('div', { class: 'kicker', text: 'Object' }), el('h3', { text: it.title || m.title || '' }), el('img', { src: imgUrl(it.id), alt: m.title || '', loading: 'lazy' }), el('div', { class: 'meta', html: provenance(m) }), m.credit ? el('div', { class: 'meta', text: m.credit }) : null].filter(Boolean);
    }
    return null;
  }
}
export { strip };

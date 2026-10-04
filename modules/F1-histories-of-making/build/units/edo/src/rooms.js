// Rooms: full-screen panels over the story that host the labs in their full 'room' mode.
// Hash routes: #room-desks, #room-desks.censor, #room-workshop, #room-views.hv-030. Esc, the close button
// and the browser's back button all leave the room and return focus to whatever opened it.
// Also the Plate: a side sheet for an image, a place, an event or one of the Hundred Views.
import { el, esc, motion, Scope, trapFocus, imgUrl, provenance, spriteEl, eraOf } from './util.js';
import { mountLab } from './labs/index.js';

export const ROOMS = {
  desks: { title: 'The Desks', kicker: 'Room · evidence games', line: 'Date prints by their seals, read a margin like a cataloguer, sit at the censor’s desk.',
    tabs: [['sealtimeline', 'Seal Timeline'], ['catalogue', 'Catalogue Desk'], ['censor', 'Censor’s Desk']] },
  workshop: { title: 'The Workshop', kicker: 'Room · reconstruction', line: 'Cut, register and print the Great Wave, block by block.',
    tabs: [['print', 'Print the Wave']] },
  views: { title: 'The Views', kicker: 'Room · depth and perspective', line: 'Step into Hiroshige’s views, and into a perspective box of 1748.',
    tabs: [['view', 'Step into the View'], ['ukie', 'The uki-e box']] },
};
const ALIAS = { seals: 'sealtimeline', timeline: 'sealtimeline', margin: 'catalogue' };

export class Rooms {
  constructor(ctxFor, { onOpen, onClose } = {}) {
    this.ctxFor = ctxFor; this.onOpen = onOpen; this.onClose = onClose;
    this.root = el('div', { class: 'room', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'room-title', hidden: true });
    this.kick = el('div', { class: 'room-kicker' });
    this.title = el('h2', { class: 'room-title', id: 'room-title' });
    this.tabs = el('div', { class: 'room-tabs', role: 'tablist', 'aria-label': 'Workbenches' });
    this.close$ = el('button', { type: 'button', class: 'room-x', 'aria-label': 'Close the room and return to the story' }, el('span', { 'aria-hidden': 'true', text: '×' }), el('span', { class: 'room-x-l', text: 'Back to the story' }));
    this.body = el('div', { class: 'room-body', role: 'tabpanel', tabindex: '-1' });
    this.root.append(el('header', { class: 'room-head' }, el('div', { class: 'room-id' }, this.kick, this.title), this.tabs, this.close$), this.body);
    document.body.append(this.root);
    this.close$.addEventListener('click', () => this.close());
    this.root.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !e.defaultPrevented) { e.preventDefault(); this.close(); } });
    this.untrap = trapFocus(this.root);
    this.id = null; this.tab = null; this.inst = null; this.scope = null; this.pushed = false;
    addEventListener('popstate', () => this.syncHash());
    addEventListener('hashchange', () => this.syncHash());
  }
  static parse(hash) {
    const m = /^#?room-([a-z]+)(?:\.([A-Za-z0-9_~-]+))?$/.exec(hash || ''); if (!m || !ROOMS[m[1]]) return null;
    return { id: m[1], anchor: m[2] || null };
  }
  syncHash() {
    const r = Rooms.parse(location.hash);
    if (r) { if (r.id !== this.id || (r.anchor && this.resolve(r.id, r.anchor).tab !== this.tab)) this.open(r.id, r.anchor, { push: false }); }
    else if (this.id) this.close({ fromHistory: true });
  }
  resolve(id, anchor) {
    const R = ROOMS[id]; const a = ALIAS[anchor] || anchor;
    if (a && R.tabs.some(([t]) => t === a)) return { tab: a, params: {} };
    const params = {};
    if (a && /^hv-\d{3}$/.test(a)) params.print = a; else if (a) params.anchor = a;
    return { tab: R.tabs[0][0], params };
  }
  open(id, anchor = null, { push = true, trigger } = {}) {
    if (!ROOMS[id]) return;
    const R = ROOMS[id]; const { tab, params } = this.resolve(id, anchor);
    const wasOpen = !!this.id;
    if (!wasOpen) this.back = trigger || document.activeElement;
    this.id = id;
    this.kick.textContent = R.kicker; this.title.textContent = R.title;
    this.tabs.innerHTML = '';
    this.tabs.hidden = R.tabs.length < 2;
    R.tabs.forEach(([t, label], i) => {
      const b = el('button', { type: 'button', role: 'tab', id: `room-tab-${t}`, 'aria-controls': 'room-body', 'aria-selected': 'false', tabindex: '-1', class: 'room-tab' }, el('span', { class: 'room-tab-n', 'aria-hidden': 'true', text: String(i + 1) }), label);
      b.addEventListener('click', () => this.showTab(t, {}, true));
      b.addEventListener('keydown', (e) => {
        const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d && e.key !== 'Home' && e.key !== 'End') return;
        e.preventDefault(); const bs = [...this.tabs.children]; let k = bs.indexOf(b);
        k = e.key === 'Home' ? 0 : e.key === 'End' ? bs.length - 1 : (k + d + bs.length) % bs.length; bs[k].focus(); bs[k].click();
      });
      this.tabs.append(b);
    });
    this.body.id = 'room-body';
    if (!wasOpen) {
      this.root.hidden = false;
      document.documentElement.classList.add('room-open');
      for (const n of document.body.children) if (n !== this.root && !n.classList.contains('plate') && n.tagName !== 'SCRIPT') { if (!n.hasAttribute('inert')) { n.setAttribute('inert', ''); n.dataset.roomInert = '1'; } }
      if (!motion.reduced) this.root.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: 'cubic-bezier(0.05,0.7,0.1,1)' });
      this.onOpen?.(id);
    }
    if (push) { const h = `#room-${id}${anchor ? '.' + anchor : ''}`; if (location.hash !== h) { history.pushState({ room: id }, '', h); this.pushed = true; } }
    this.showTab(tab, params, false);
    (this.tabs.hidden ? this.close$ : this.tabs.querySelector('[aria-selected=true]'))?.focus({ preventScroll: true });
  }
  async showTab(t, params = {}, updateHash = false) {
    if (!this.id) return;
    [...this.tabs.children].forEach((b) => { const on = b.id === `room-tab-${t}`; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    this.body.setAttribute('aria-labelledby', this.tabs.hidden ? 'room-title' : `room-tab-${t}`);
    if (this.tab === t && !Object.keys(params).length) return;
    this.dispose();
    this.tab = t;
    if (updateHash) history.replaceState(history.state, '', `#room-${this.id}.${t}`);
    const scope = this.scope = new Scope();
    const slot = el('div', { class: 'room-lab' }); this.body.append(slot);
    const inst = await mountLab(t, slot, this.ctxFor({ mode: 'room', scope, params }));
    if (this.scope !== scope) { inst.destroy(); return; }
    this.inst = inst;
  }
  dispose() { try { this.inst?.destroy(); } catch (e) { /* */ } this.inst = null; this.scope?.dispose(); this.scope = null; this.body.innerHTML = ''; this.tab = null; }
  close({ fromHistory = false } = {}) {
    if (!this.id) return;
    const id = this.id; this.id = null;
    this.dispose();
    const done = () => {
      this.root.hidden = true;
      document.documentElement.classList.remove('room-open');
      document.querySelectorAll('[data-room-inert]').forEach((n) => { n.removeAttribute('inert'); delete n.dataset.roomInert; });
      this.back?.focus?.({ preventScroll: true });
      this.onClose?.(id);
    };
    if (!motion.reduced) this.root.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(10px)' }], { duration: 240, easing: 'cubic-bezier(0.3,0,0.8,0.15)' }).finished.then(done, done); else done();
    if (!fromHistory) {
      if (this.pushed && history.state?.room) history.back();
      else if (Rooms.parse(location.hash)) history.replaceState(null, '', location.pathname + location.search);
    }
    this.pushed = false;
  }
}

// ---------------- the Plate: one side sheet for an image, event, place or view
export class Plate {
  constructor(C, { onGo, onRoom } = {}) {
    this.C = C; this.onGo = onGo; this.onRoom = onRoom;
    this.beats = C.acts.flatMap((a) => a.segments.flatMap((s) => s.beats.map((b) => ({ ...b, act: a, seg: s }))));
    this.root = el('aside', { class: 'plate', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'plate-h', hidden: true });
    document.body.append(this.root);
    this.root.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); this.close(); } });
    this.open = false;
  }
  close() { if (!this.open) return; this.open = false; this.root.classList.remove('on'); const r = this.root; setTimeout(() => { if (!this.open) r.hidden = true; }, motion.reduced ? 0 : 260); this.back?.focus?.({ preventScroll: true }); }
  show(item) {
    const body = this.render(item); if (!body) return;
    this.back = document.activeElement;
    this.root.innerHTML = '';
    const x = el('button', { class: 'plate-x', type: 'button', 'aria-label': 'Close' }, '×');
    x.addEventListener('click', () => this.close());
    this.root.append(x, ...body.filter(Boolean));
    this.root.hidden = false; this.open = true;
    requestAnimationFrame(() => this.root.classList.add('on'));
    this.root.scrollTop = 0; x.focus({ preventScroll: true });
  }
  appears(test) {
    const hits = this.beats.filter(test); if (!hits.length) return [];
    const ul = el('ul', { class: 'plate-appears' });
    hits.slice(0, 8).forEach((b) => ul.append(el('li', {}, el('a', { href: `#${b.id}`, onclick: (e) => { e.preventDefault(); this.close(); this.onGo?.(b.id); } }, `${b.act.n ? 'Act ' + b.act.n + ' · ' : 'Prologue · '}${b.seg.title}`), el('span', { class: 'yr', text: ` ${Math.floor(b.year)}` }))));
    return [el('div', { class: 'kicker', text: 'Appears in' }), ul];
  }
  render(it) {
    const C = this.C;
    if (it.type === 'image') {
      const m = C.images[it.id] || {};
      const img = m.w ? el('img', { src: imgUrl(it.id), alt: m.title || '', loading: 'lazy', width: m.w, height: m.h }) : spriteEl(C, it.id, 320, m.title || '');
      return [el('div', { class: 'kicker', text: 'Object' }), el('h3', { id: 'plate-h', text: it.title || m.title || '' }), img, el('p', { class: 'plate-meta', html: provenance(m) }), m.credit ? el('p', { class: 'plate-meta', text: m.credit }) : null,
        ...this.appears((b) => b.stage?.img === it.id || b.figure?.img === it.id)];
    }
    if (it.type === 'event') {
      const e = C.timeline.events.find((x) => x.id === it.id); if (!e) return null;
      const lane = C.timeline.lanes.find((l) => l.id === e.lane);
      const out = [el('div', { class: 'kicker', text: `${lane?.label || e.lane}${eraOf(e.year) ? ' · ' + eraOf(e.year) : ''}` }), el('h3', { id: 'plate-h', text: String(Math.floor(e.year)) }), el('p', { class: 'plate-body', text: e.label })];
      if (e.img) { const m = C.images[e.img] || {}; out.push(m.w ? el('img', { src: imgUrl(e.img), alt: m.title || '', loading: 'lazy' }) : spriteEl(C, e.img, 320, m.title || ''), el('p', { class: 'plate-meta', html: provenance(m) })); }
      out.push(...this.appears((b) => (b.show || []).includes(e.id)));
      return out;
    }
    if (it.type === 'place') {
      let id = it.city || it.id; if (!id) id = Object.keys(C.places.world).find((k) => C.places.world[k].name === it.name);
      const pl = (it.city ? C.places.city[id] : C.places.world[id]) || it;
      const out = [el('div', { class: 'kicker', text: it.city ? 'Place · on the 1859 map' : 'Place' }), el('h3', { id: 'plate-h', html: `${esc(pl.name || it.name || '')}${pl.kanji ? ` <span class="k" lang="ja">${esc(pl.kanji)}</span>` : ''}` })];
      if (pl.lat != null) out.push(el('p', { class: 'plate-meta', text: `${pl.lat.toFixed(3)}° N, ${Math.abs(pl.lon).toFixed(3)}° ${pl.lon < 0 ? 'W' : 'E'}${pl.approx ? ' · position approximate' : ''}` }));
      if (it.date || pl.date) out.push(el('p', { class: 'plate-body', text: it.date || pl.date }));
      if (pl.note) out.push(el('p', { class: 'plate-body', text: pl.note }));
      out.push(...this.appears((b) => { const s = b.stage || {}; return [].concat(s.points || [], Array.isArray(s.focus) ? s.focus : []).includes(id); }));
      return out;
    }
    if (it.type === 'view') {
      const v = it.view || {}; const id = 'hv-' + String(v.n).padStart(3, '0');
      const step = el('button', { type: 'button', class: 'room-link' }, el('span', { class: 'room-ic ic-views', 'aria-hidden': 'true' }), 'Step into the View');
      step.addEventListener('click', () => { this.close(); this.onRoom?.('views', id); });
      return [el('div', { class: 'kicker', text: `One Hundred Famous Views of Edo · no. ${v.n}${v.season ? ' · ' + v.season : ''}` }), el('h3', { id: 'plate-h', text: v.t || '' }), v.ja ? el('div', { class: 'plate-ja', lang: 'ja', text: v.ja }) : null,
        spriteEl(C, id, 300, `Hiroshige, ${v.t || ''}`), el('p', { class: 'plate-meta', text: 'Utagawa Hiroshige, publisher Uoya Eikichi, 1856–58 · via Wikimedia Commons · public domain' }),
        el('p', { class: 'plate-body', text: 'The dot on the 1859 map marks where the view was drawn from, read off the sheet’s own title. Most are accurate to a district, not a street.' }), step];
    }
    if (it.type === 'person') {
      // a fallback only: the Cast module opens people when it is present
      const p = C.people[it.id]; if (!p) return null;
      const m = p.img ? C.images[p.img] : null;
      return [el('div', { class: 'kicker', text: (C.groups.find((g) => g.id === p.group) || {}).title || 'Person' }), el('h3', { id: 'plate-h', html: `${esc(p.name)}${p.kanji ? ` <span class="k" lang="ja">${esc(p.kanji)}</span>` : ''}` }),
        p.img ? (m?.w ? el('img', { src: imgUrl(p.img), alt: `Portrait: ${p.name}`, loading: 'lazy' }) : spriteEl(C, p.img, 220, `Portrait: ${p.name}`)) : null,
        el('p', { class: 'plate-body', text: p.line || '' }), ...this.appears((b) => (b.people || []).includes(it.id) || b.text.includes(`[[${it.id}`))];
    }
    return null;
  }
}

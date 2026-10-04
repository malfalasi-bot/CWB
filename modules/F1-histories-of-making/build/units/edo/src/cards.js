// The entity sheet: one panel for a person, place, event, view or image, with where it appears in the story.
import { el, esc, imgUrl, provenance, eraOf } from './util.js';

const dates = (p) => {
  const f = (v) => (v == null ? '?' : String(v).replace('~', 'c. '));
  if (p.born == null && p.died == null) return '';
  return `${f(p.born)}–${f(p.died)}`;
};
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
      const a = el('a', { href: `#${b.id}`, onclick: (e) => { e.preventDefault(); this.close(); this.onGo?.(b.id); } },
        `${b.act.n ? 'Act ' + b.act.n + ' · ' : ''}${b.seg.title}`);
      ul.append(el('li', {}, a, el('span', { style: 'color:var(--ink-3)', text: ` · ${Math.floor(b.year)}` })));
    });
    return [el('div', { class: 'kicker', style: 'margin-top:14px', text: 'Appears in' }), ul];
  }
  render(it) {
    const C = this.C;
    if (it.type === 'person') {
      const p = C.people[it.id]; if (!p) return null;
      const g = C.groups.find((x) => x.id === p.group);
      const out = [el('div', { class: 'kicker', text: g ? `${g.title} · ${g.kanji}` : '' }),
        el('h3', { html: `${esc(p.name)}${p.kanji ? ` <span class="k" lang="ja">${esc(p.kanji)}</span>` : ''}` }),
        el('div', { class: 'meta', text: dates(p) })];
      if (p.img) out.push(el('img', { src: imgUrl(p.img), alt: `Portrait: ${p.name}`, loading: 'lazy' }), el('div', { class: 'meta', text: p.cap || '' }));
      else if (p.mark) out.push(el('div', { style: 'font:700 64px/1 var(--display);margin:16px 0;color:var(--ink-2)', lang: 'ja', 'aria-hidden': 'true', text: p.mark }));
      out.push(el('p', { class: 'body', text: p.line || '' }));
      if (g?.note) out.push(el('p', { class: 'meta', text: g.note }));
      out.push(...this.appears((b) => (b.people || []).includes(it.id) || b.text.includes(`[[${it.id}`)));
      return out;
    }
    if (it.type === 'event') {
      const e = C.timeline.events.find((x) => x.id === it.id); if (!e) return null;
      const lane = C.timeline.lanes.find((l) => l.id === e.lane);
      const out = [el('div', { class: 'kicker', text: `${lane?.label || e.lane} · ${eraOf(e.year) || ''}` }), el('h3', { text: `${Math.floor(e.year)}` }), el('p', { class: 'body', text: e.label })];
      if (e.img) { const m = C.images[e.img] || {}; out.push(el('img', { src: imgUrl(e.img), alt: m.title || '', loading: 'lazy' }), el('div', { class: 'meta', html: provenance(m) })); }
      out.push(...this.appears((b) => (b.show || []).includes(e.id)));
      return out;
    }
    if (it.type === 'place') {
      let id = it.city || it.id;
      if (!id) id = Object.keys(C.places.world).find((k) => C.places.world[k].name === it.name);
      const pl = (it.city ? C.places.city[id] : C.places.world[id]) || it;
      const out = [el('div', { class: 'kicker', text: it.city ? 'Place · on the 1859 map' : 'Place' }),
        el('h3', { html: `${esc(pl.name || it.name)}${pl.kanji ? ` <span class="k" lang="ja">${esc(pl.kanji)}</span>` : ''}` })];
      if (pl.lat != null) out.push(el('div', { class: 'meta', text: `${pl.lat.toFixed(3)}° N, ${Math.abs(pl.lon).toFixed(3)}° ${pl.lon < 0 ? 'W' : 'E'}${pl.approx ? ' · position approximate' : ''}` }));
      if (it.date || pl.date) out.push(el('p', { class: 'body', text: it.date || pl.date }));
      if (pl.note) out.push(el('p', { class: 'body', text: pl.note }));
      out.push(...this.appears((b) => { const s = b.stage || {}; return [].concat(s.points || [], Array.isArray(s.focus) ? s.focus : []).includes(id); }));
      return out;
    }
    if (it.type === 'view') {
      const v = it.view, id = 'hv-' + String(v.n).padStart(3, '0');
      return [el('div', { class: 'kicker', text: `One Hundred Famous Views of Edo · no. ${v.n} · ${v.season}` }),
        el('h3', { text: v.t }), el('div', { class: 'k', lang: 'ja', text: v.ja }),
        el('img', { src: imgUrl(id, 'hv'), alt: `Hiroshige, ${v.t}`, loading: 'lazy' }),
        el('p', { class: 'meta', text: 'Utagawa Hiroshige, publisher Uoya Eikichi, 1856–58 · via Wikimedia Commons · public domain' }),
        el('p', { class: 'body', text: 'The dot on the 1859 map marks where the view was drawn from, read off the sheet’s own title. Most are accurate to a district, not a street.' })];
    }
    if (it.type === 'image') {
      const m = C.images[it.id] || {};
      return [el('div', { class: 'kicker', text: 'Object' }), el('h3', { text: it.title || m.title || '' }),
        el('img', { src: imgUrl(it.id), alt: m.title || '', loading: 'lazy' }), el('div', { class: 'meta', html: provenance(m) }),
        m.credit ? el('div', { class: 'meta', text: m.credit }) : null].filter(Boolean);
    }
    return null;
  }
}

export { strip };

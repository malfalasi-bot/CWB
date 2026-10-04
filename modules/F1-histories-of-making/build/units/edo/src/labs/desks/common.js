// Shared pieces for the three Desks labs (Seal Timeline, Catalogue Desk, Censor's Desk):
// the data file, the workbench frame, sources, confidence tags, margin crops and glossary cards.
// Lives in a subfolder so the lab registry's './*.js' glob does not list it as a lab.
import { el, esc } from '../../util.js';
import './common.css';

let DATA = null;
export function loadDesks() {
  if (!DATA) DATA = fetch('data/desks.json').then((r) => { if (!r.ok) throw new Error(`desks.json ${r.status}`); return r.json(); }).catch((e) => { DATA = null; throw e; });
  return DATA;
}

export const imgSrc = (p) => `img/${p.src}.webp`;
export const CONF = { documented: 'documented', probable: 'probable', contested: 'contested', argued: 'argued' };
export const confTag = (c = 'documented') => el('span', { class: `dk-conf dk-conf-${c}`, text: CONF[c] || c });

// the workbench frame: label + title + reset (top-right), body, "What this shows", sources
export function bench(root, { id, kicker, title, mode, onReset, resetLabel = 'Start again' }) {
  const head = el('header', { class: 'dk-head' },
    el('div', { class: 'dk-id' }, el('span', { class: 'dk-kicker', text: kicker }), el('h3', { class: 'dk-title', id: `${id}-title`, text: title })));
  const reset = onReset ? el('button', { type: 'button', class: 'dk-btn dk-reset', onclick: onReset }, el('span', { 'aria-hidden': 'true', class: 'dk-reset-ic' }), resetLabel) : null;
  if (reset) head.append(reset);
  const body = el('div', { class: 'dk-body' });
  const foot = el('footer', { class: 'dk-foot' });
  const live = el('div', { class: 'vh', 'aria-live': 'polite', role: 'status' });
  const box = el('section', { class: `dk-bench dk-${mode} ${id}`, 'aria-labelledby': `${id}-title`, 'data-lab': id }, head, body, foot, live);
  root.append(box);
  return { box, head, body, foot, reset, say: (t) => { live.textContent = ''; requestAnimationFrame(() => { live.textContent = t; }); } };
}

export function sourcesList(D, ids, title = 'Sources') {
  const uniq = [...new Set(ids)].filter((i) => D.sources[i]);
  if (!uniq.length) return null;
  return el('div', { class: 'dk-src' }, el('h4', { class: 'dk-src-h', text: title }),
    el('ul', {}, uniq.map((i) => { const s = D.sources[i]; return el('li', {}, el('a', { href: s.u, target: '_blank', rel: 'noopener' }, s.t), ' ', confTag(s.conf || 'documented')); })));
}
export const srcLine = (D, ids) => el('p', { class: 'dk-srcline' }, 'Source: ', ...[...new Set(ids)].filter((i) => D.sources[i]).flatMap((i, k) => [k ? '; ' : '', el('a', { href: D.sources[i].u, target: '_blank', rel: 'noopener', text: D.sources[i].t })]));

export function whatThisShows(text, extra) {
  return el('div', { class: 'dk-what' }, el('h4', { class: 'dk-what-h', text: 'What this shows' }), el('p', { text }), extra || null);
}

// one print's record line: maker · title · date · holder accession · licence
export function record(p) {
  return el('p', { class: 'dk-rec', html: `${esc(p.maker)} · <em>${esc(p.title)}</em> · ${esc(p.date)} · <a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.holder)} ${esc(p.acc)}</a> · ${esc(p.lic)}` });
}

// a margin detail drawn from the sprite sheet, scaled to height h (css px)
export function marginCrop(D, p, h = 110, cls = '') {
  const [x, y, w, hh] = p.sprite; const s = h / hh; const S = D.sheet;
  return el('span', { class: `dk-crop ${cls}`, role: 'img', 'aria-label': `Margin detail of the print${p.marks?.some((m) => m.type === 'seal') ? ', with its seals' : ''}`,
    style: `width:${Math.round(w * s)}px;height:${h}px;background-image:url(${S.url});background-size:${Math.round(S.W * s)}px ${Math.round(S.H * s)}px;background-position:${-Math.round(x * s)}px ${-Math.round(y * s)}px` });
}

export function glossCard(D, gid, compact = false) {
  const g = D.gloss[gid]; if (!g) return null;
  return el('div', { class: `dk-gloss${compact ? ' compact' : ''}` },
    el('span', { class: 'dk-gloss-k', lang: 'ja', text: g.k }),
    el('span', { class: 'dk-gloss-t' }, el('b', { text: g.r }), ' — ', g.m, g.span ? `, ${g.span}` : ''),
    compact ? null : el('span', { class: 'dk-gloss-n', text: g.note }),
    compact ? null : el('span', { class: 'dk-gloss-c' }, confTag(g.conf)));
}

// a quiet seal-red stamp that lands once (scale 1.06 -> 1); none under reduced motion
export function stampIn(node, motion) {
  if (motion.reduced || !node.animate) return;
  node.animate([{ transform: 'scale(1.06)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 200, easing: 'cubic-bezier(0.2,0,0,1)' });
}
export function enter(node, motion, dy = 10, delay = 0) {
  if (motion.reduced || !node.animate) return;
  node.animate([{ opacity: 0, transform: `translateY(${dy}px)` }, { opacity: 1, transform: 'none' }], { duration: 400, delay, easing: 'cubic-bezier(0.05,0.7,0.1,1)', fill: 'backwards' });
}
export function fade(node, motion) {
  if (!node.animate) return;
  node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: motion.reduced ? 150 : 400, easing: 'cubic-bezier(0.2,0,0,1)' });
}

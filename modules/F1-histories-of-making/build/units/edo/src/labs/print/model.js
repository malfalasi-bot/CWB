// Print the Wave: shared geometry, data helpers and the workbench frame (no three.js here).
import { el } from '../../util.js';

// World units: the sheet is 2 wide; its height keeps the 1600 × 1075 photograph's proportions.
export const SW = 2, SH = (2 * 1075) / 1600, MARGIN = 0.2, BW = SW + 2 * MARGIN, BH = SH + 2 * MARGIN;
// channel order inside the packed masks (and the shader): 0 pale, 1 beige, 2 grey, 3 mid, 4 deep, 5 key
export const LAYERS = ['pale', 'beige', 'grey', 'mid', 'deep'];
export const chanIndex = (id) => (id === 'key' ? 5 : LAYERS.indexOf(id));
export const hexRGB = (h) => { const n = parseInt(h.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
export const blockOf = (D, id) => D.blocks.find((b) => b.id === id);

// Which lighter inks went down after darker ones (the order lesson).
export function inversions(D, order) {
  const L = (id) => blockOf(D, id).light, out = [];
  order.forEach((a, i) => order.slice(i + 1).forEach((b) => { if (L(b) > L(a) + 0.02) out.push([a, b]); }));
  return out;
}
export const isLightToDark = (D, order) => inversions(D, order).length === 0;

// The workbench frame every lab shares: 2 px indigo border, label, reset top-right.
export function frame(root, { label = 'LAB · reconstruction', title, onReset, cls = '' }) {
  const reset = el('button', { class: 'print-reset', type: 'button' }, 'Reset');
  reset.addEventListener('click', () => onReset?.());
  const head = el('div', { class: 'print-head' },
    el('span', { class: 'print-label', text: label }),
    title ? el('h3', { class: 'print-title', text: title }) : null, reset);
  const body = el('div', { class: 'print-body' });
  const foot = el('div', { class: 'print-foot' });
  const box = el('section', { class: `print-bench ${cls}`, 'aria-label': title || 'Print the Wave' }, head, body, foot);
  root.append(box);
  return { box, head, body, foot, reset };
}

export function honesty(D, { short = false } = {}) {
  return el('p', { class: 'print-honest' },
    el('strong', { text: 'Reconstruction. ' }),
    short ? 'The colour layers are separated from a photograph of the Met’s sheet by clustering, not taken from the actual blocks. How many blocks the Great Wave used is not documented in our sources.'
      : 'The colour layers here are separated from the Met’s photograph of JP1847 by colour clustering; they are not the actual blocks, and the key line is traced from the same photograph. The true number of blocks for the Great Wave is not documented in our sources (the Asian Art Museum says at least about ten impressions were usual for a colour print).');
}

export function sources(D) {
  return el('div', { class: 'print-sources' },
    el('h4', { text: 'Sources' }),
    el('ul', {}, ...D.sources.map((s) => el('li', {},
      el('a', { href: s.u, target: '_blank', rel: 'noopener' }, s.t), ' ', el('span', { class: 'print-conf', text: `(${s.conf})` })))));
}

export function liveRegion() { return el('p', { class: 'print-live', role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' }); }

// store wrapper with a namespace and JSON safety (ctx.store already wraps localStorage in try/catch)
export function saver(ctx, key) {
  return {
    get(fb) { try { const v = ctx.store?.get(key, fb); return v == null ? fb : v; } catch (e) { return fb; } },
    set(v) { try { ctx.store?.set(key, v); } catch (e) {} },
  };
}

// the baren, as inline SVG (a disc of twisted cord in a bamboo sheath, its knotted handle on top)
export const BAREN_SVG = `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="28" fill="#c9a66b" stroke="#6d4f25" stroke-width="2"/><circle cx="32" cy="32" r="21" fill="none" stroke="#8a6a3a" stroke-width="1.2" stroke-dasharray="3 3"/><path d="M8 32h48" stroke="#6d4f25" stroke-width="5" stroke-linecap="round"/><path d="M6 32c-3 0-4 3-2 5M58 32c3 0 4 3 2 5" stroke="#6d4f25" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`;

import { STATUS } from './engine.js';
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const glyph = (status, size = '') => `<span class="g ${STATUS[status]?.cls || status} ${size}" aria-hidden="true"><i>${STATUS[status]?.glyph || ''}</i></span>`;
export const stTag = (status, extra = '') => `<span class="st">${glyph(status)}<span>${STATUS[status]?.text || status}${extra}</span></span>`;
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const fmtDays = (lo, hi) => (lo === hi ? `${trim(lo)} d` : `${trim(lo)}–${trim(hi)} d`);
const trim = (n) => (Math.round(n * 10) / 10).toString();
export function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
export function seededShuffle(arr, seed) {
  const a = arr.slice();
  let s = 0; for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  for (let i = a.length - 1; i > 0; i--) { s = (s * 1664525 + 1013904223) >>> 0; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export function announce(text) {
  const live = document.getElementById('live');
  if (!live) return;
  live.textContent = '';
  setTimeout(() => { live.textContent = text; }, 30);
}
export async function copyText(text, fallbackEl) {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    if (fallbackEl) { fallbackEl.hidden = false; fallbackEl.value = text; fallbackEl.focus(); fallbackEl.select(); }
    return false;
  }
}
export const VNAME = { v0: 'v0', v1: 'v1', v2: 'v2', v3: 'v3', v4: 'v4', atlas: 'Atlas', desks: 'Desks', workshop: 'Workshop', atlas0: 'Atlas 0' };
export const QUALITY = { rough: 1, working: 2, polished: 3, unbuilt: 0 };
export const IDEA = { weak: 1, sound: 2, strong: 3 };
export const lvl = (n, of = 3) => `<span class="lvl" aria-hidden="true">${Array.from({ length: of }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;

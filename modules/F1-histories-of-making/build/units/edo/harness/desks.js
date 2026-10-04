// Harness for the Desks builder. ?lab=sealtimeline|catalogue|censor &mode=room|stage &rm &theme=dark|light &fresh
import { el, motion, Scope, imgUrl, setEras } from '../src/util.js';

const q = new URLSearchParams(location.search);
const LAB = q.get('lab') || 'sealtimeline', MODE = q.get('mode') || 'room';
if (q.has('rm')) motion.set(true);
if (q.get('theme')) document.documentElement.dataset.theme = q.get('theme');
const NS = 'edo4h:lab:';
if (q.has('fresh')) try { Object.keys(localStorage).filter((k) => k.startsWith(NS)).forEach((k) => localStorage.removeItem(k)); } catch (e) { /* */ }
const store = { get(k, f) { try { const v = localStorage.getItem(NS + k); return v == null ? f : JSON.parse(v); } catch (e) { return f; } }, set(k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch (e) { /* */ } } };
const log = (...a) => { console.log('[h]', ...a); (window.__log ||= []).push(a); };
const MODS = import.meta.glob('../src/labs/*.js');

async function main() {
  const C = await fetch('/content.json').then((r) => r.json());
  setEras(C.places?.eras || []);
  const scope = new Scope();
  const ctx = { C, scope, motion, mode: MODE, params: Object.fromEntries([...q].filter(([k]) => k.startsWith('p.')).map(([k, v]) => [k.slice(2), v])), imgUrl,
    sprite: () => null, store, onResolve: (r) => log('resolve', JSON.stringify(r)), openRoom: (id, a) => log('openRoom', id, a), openPerson: (id) => log('person', id), openImage: (id) => log('image', id) };
  const nav = el('div', { class: 'hx-head' }, `Desks harness · ${LAB} · ${MODE}`, ...['sealtimeline', 'catalogue', 'censor'].flatMap((l) => ['room', 'stage'].map((m) => el('a', { href: `/harness/desks.html?lab=${l}&mode=${m}` }, `${l}/${m}`))));
  let slot;
  if (MODE === 'room') { slot = el('div', { class: 'room-lab' }); document.body.append(el('div', { class: 'hx-room' }, nav, el('div', { class: 'hx-body' }, slot))); }
  else { slot = el('div', { class: 'lab-host' }); document.body.append(el('div', { class: 'hx-stage' }, el('div', { class: 'hx-story' }, nav, el('p', { text: 'The story column sits here. The lab runs in the stage beside it.' })), slot)); }
  const mod = await MODS[`../src/labs/${LAB}.js`]();
  const inst = await mod.default.mount(slot, ctx);
  window.__h = { inst, ctx, scope, log };
  log('describe', inst.describe());
}
main().catch((e) => { console.error(e); document.body.append(el('pre', { text: String(e.stack || e) })); });

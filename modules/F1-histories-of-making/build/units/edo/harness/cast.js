// Harness for the Cast & instruments builder. ?t=cast|time|tguess|ttiles|map|mguess|mroute|mtiles|city|tap|lab&lab=compare|edition|contract
import 'd3-transition';
import { $, el, motion, setEras, renderText, Scope, imgUrl } from '../src/util.js';
import { Cast } from '../src/cards.js';
import { MapStage } from '../src/map.js';
import { Timeline } from '../src/timeline.js';
import { Viewer } from '../src/viewer.js';

const q = new URLSearchParams(location.search);
const T = q.get('t') || 'cast';
if (q.has('rm')) motion.set(true);
if (q.get('theme')) document.documentElement.dataset.theme = q.get('theme');

const store = (() => { const ns = 'edo4h:'; return { get(k, f) { try { const v = localStorage.getItem(ns + k); return v == null ? f : JSON.parse(v); } catch (e) { return f; } }, set(k, v) { try { localStorage.setItem(ns + k, JSON.stringify(v)); } catch (e) {} } }; })();
if (q.has('fresh')) try { Object.keys(localStorage).filter((k) => k.startsWith('edo4h:')).forEach((k) => localStorage.removeItem(k)); } catch (e) {}

const log = (...a) => { console.log('[h]', ...a); (window.__log ||= []).push(a); };
const L = { map: $('#layer-map'), time: $('#layer-time'), object: $('#layer-object'), tool: $('#layer-tool') };
const setMode = (m) => { Object.entries(L).forEach(([k, n]) => { n.classList.toggle('on', k === m); n.setAttribute('aria-hidden', String(k !== m)); }); $('#mini').classList.toggle('off', m === 'time'); };
const hx = $('#hx');
const btn = (lab, fn) => hx.append(el('button', { type: 'button', onclick: fn }, lab));

async function main() {
  const C = await fetch('/content.json').then((r) => r.json());
  setEras(C.places.eras);
  const beats = C.acts.flatMap((a) => a.segments.flatMap((s) => s.beats));
  const beat = (id) => beats.find((b) => b.id === id) || ({
    'b7-1g': beats.find((b) => b.guess?.type === 'timeline'), 'b3-2g': beats.find((b) => b.guess?.type === 'map' && b.guess.mode !== 'route'),
    'b6-0g': beats.find((b) => b.guess?.mode === 'route'), 'b2-4': beats.find((b) => b.guess?.type === 'tap'),
    'b5-4': beats.find((b) => b.stage?.anim === 'theatres-move'), 'b1-3': beats.find((b) => b.stage?.anim === 'yoshiwara-move') })[id];
  const rebuild = (n) => C.acts.find((a) => a.id === n)?.rebuild;
  const story = $('#story');
  const card = (html) => { const s = el('section', { class: 'step beat active' }, el('div', { class: 'card' }, el('div', { class: 'text', html }))); story.append(s); return s; };
  const cast = new Cast(C, { store, onGo: (id) => log('go', id), onShowPlace: (id, sc) => log('place', id, sc), onShowYear: (y, id) => log('year', y, id), onOpenImage: (id) => log('image', id) });
  cast.mountDeck(document.body);
  story.addEventListener('click', (e) => { const w = e.target.closest('[data-person]'); if (w && story.contains(w)) cast.open(w.dataset.person, w); });
  const tl = new Timeline(L.time, $('#mini'), C, (it) => log('pick', it));
  const map = new MapStage(L.map, C, (it) => log('pick', it));
  const viewer = new Viewer(L.object, C);
  window.__h = { C, cast, tl, map, viewer, beat, log, motion };

  if (T === 'cast') {
    setMode('time');
    tl.show({ mode: 'time', range: [1775, 1810], lanes: ['state', 'trade', 'print'], bands: true, lifespans: ['tsutaya', 'utamaro', 'kyoden'] }, 1791, ['e1790', 'e1791']);
    ['b2-4', 'b2-5'].forEach((id) => { const b = beat(id); if (b) card(renderText(b.text, C.people)); });
    card(renderText('Publishers like [[nishimuraya]] and [[uoya]] carry their marks; carvers like [[egawa]] and printers like [[yamamoto]] carry 彫 and 摺. Abroad: [[hayashi]], [[vangogh]], [[sharaku]], [[oi]].', C.people));
    cast.decorate(story);
    btn('meet tsutaya', () => cast.meet('tsutaya'));
    btn('meet hayashi', () => cast.meet('hayashi'));
    btn('open sadanobu', () => cast.open('sadanobu', document.activeElement));
    btn('deck', () => cast.openDeck());
  }
  if (T === 'time' || T === 'tguess' || T === 'ttiles') {
    setMode('time');
    card('<p>Timeline harness.</p>');
    if (T === 'time') {
      const bq = q.get('b') && (q.get('b') === 'edict' ? beats.find((b) => b.stage?.edict) : q.get('b') === 'runs' ? beats.find((b) => b.stage?.runs) : q.get('b') === 'acts' ? beats.find((b) => b.stage?.acts && b.stage?.lifespans) : beat(q.get('b')));
      const st = bq ? bq.stage : { mode: 'time', range: [1800, 1870], lanes: ['state', 'print'], price: true, bands: true, edict: true, lifespans: ['hokusai', 'kuniyoshi', 'hiroshige'], runs: true };
      const y0 = +(q.get('y') || 1830);
      await tl.show(st, y0, bq ? bq.show || [] : ['e1842', 'e1831']);
      btn('→1843', () => tl.show(st, 1843, ['e1842c']));
      btn('→1850', () => tl.show(st, 1850, ['e1847']));
      btn('→1815', () => tl.show(st, 1815, []));
      window.__h.st = st;
    }
    if (T === 'tguess') {
      const b = beat('b7-1g');
      await tl.show({ mode: 'time', range: [1850, 1915], lanes: ['after', 'world'] }, 1870, []);
      const g = tl.guess(b.guess, (v, a) => log('answer', v, JSON.stringify(a)));
      window.__h.g = g;
      btn('reveal', () => g.reveal()); btn('destroy', () => g.destroy());
    }
    if (T === 'ttiles') {
      const r = rebuild(q.get('act') || 'a1');
      await tl.show({ mode: 'time', range: r.range, lanes: ['state', 'trade', 'print'] }, r.range[1], []);
      const h = tl.placeTiles(r.tiles.map((t) => ({ ...t })), (a) => log('drop', JSON.stringify(a)), { range: r.range });
      window.__h.g = h;
      btn('reveal', () => h.reveal()); btn('destroy', () => h.destroy());
    }
  }
  if (['map', 'mguess', 'mroute', 'mtiles', 'city'].includes(T)) {
    setMode('map');
    card('<p>Map harness.</p>');
    if (T === 'map') await map.show({ mode: 'map', scale: 'world', rotate: 75, view: [-10, -15, 150, 55], points: ['marseille', 'suez', 'aden', 'galle', 'singapore', 'hongkong', 'yokohama'], route: 'mm' }, 1870);
    if (T === 'city') { const id = q.get('b') || 'b1-3'; await map.show(beat(id).stage, beat(id).year); }
    if (T === 'mguess') {
      const b = beat('b3-2g');
      await map.show(b.stage, b.year, true);
      const g = map.guess(b.guess, (v, a) => log('answer', v, JSON.stringify(a)), { list: true });
      window.__h.g = g; btn('reveal', () => g.reveal()); btn('destroy', () => g.destroy());
    }
    if (T === 'mroute') {
      const b = beat('b6-0g');
      await map.show(b.stage, b.year, true);
      const g = map.guess(b.guess, (v, a) => log('answer', v, JSON.stringify(a)), { list: true });
      window.__h.g = g; btn('reveal', () => g.reveal()); btn('destroy', () => g.destroy());
    }
    if (T === 'mtiles') {
      const r = rebuild('a4');
      const h = map.placeTiles(r.tiles.map((t) => ({ ...t })), (a) => log('drop', JSON.stringify(a)));
      window.__h.g = h; btn('reveal', () => h.reveal()); btn('destroy', () => h.destroy());
    }
  }
  if (T === 'tap' || T === 'obj') {
    setMode('object');
    card('<p>Viewer harness.</p>');
    const b = beat('b2-4');
    viewer.show(b.stage);
    if (T === 'tap') {
      await new Promise((r) => setTimeout(r, 1200));
      const g = viewer.guessTap(b.guess, (v, a) => log('answer', v, JSON.stringify(a)), { list: true });
      window.__h.g = g; btn('reveal', () => g.reveal()); btn('destroy', () => g.destroy());
    }
  }
  if (T === 'lab') {
    setMode('tool');
    card('<p>Lab harness.</p>');
    const id = q.get('lab') || 'compare';
    const mod = (await import(`../src/labs/${id}.js`)).default;
    const scope = new Scope();
    const box = el('div', { class: 'lab-host' }); L.tool.append(box);
    if (q.get('mode') === 'room') document.body.classList.add('room');
    const ctx = { C, scope, motion, mode: q.get('mode') || 'stage', params: {}, imgUrl, sprite: (sid) => { const r = C.sprites.index[sid]; if (!r) return null; const [sh, x, y, w, h] = r; const [W, H] = C.sprites.sheets[sh]; return { url: `img/sprites/${sh}.webp`, x, y, w, h, W, H }; },
      store, onResolve: (r) => log('resolve', JSON.stringify(r)), openRoom: (a, b) => log('room', a, b), openPerson: (p) => cast.open(p), openImage: (i) => log('image', i) };
    const h = await mod.mount(box, ctx);
    window.__h.lab = h; log('describe', h.describe());
  }
  window.__ready = true;
}
main().catch((e) => { console.error(e); window.__err = String(e.stack || e); });

// The stage controller. One pinned stage (map, timeline, object or tool) driven by the story column.
// Each step names one instrument state; the other instrument stays as a thin indicator (the mini timeline).
import 'd3-transition';
import { $, $$, el, motion, setEras, eraOf } from './util.js';
import { MapStage } from './map.js';
import { Timeline } from './timeline.js';
import { Viewer } from './viewer.js';
import { Tools } from './tools.js';
import { Sheet } from './cards.js';
import { buildStory } from './story.js';

const FONTS = [
  ['Shippori Mincho', 'fonts/ShipporiMincho-Medium.woff2', { weight: '500' }],
  ['Shippori Mincho', 'fonts/ShipporiMincho-Bold.woff2', { weight: '600 800' }],
  ['Source Serif 4', 'fonts/SourceSerif4.woff2', { weight: '200 900' }],
  ['Source Serif 4', 'fonts/SourceSerif4-Italic.woff2', { weight: '200 900', style: 'italic' }],
  ['IBM Plex Sans', 'fonts/IBMPlexSans.woff2', { weight: '100 700' }],
];
function loadFonts() {
  return Promise.allSettled(FONTS.map(([f, u, d]) => { const ff = new FontFace(f, `url(${u}) format('woff2')`, { display: 'swap', ...d }); document.fonts.add(ff); return ff.load(); }));
}
const setVh = () => document.documentElement.style.setProperty('--vh', `${innerHeight / 100}px`);

async function main() {
  setVh(); addEventListener('resize', setVh);
  const fontsP = document.fonts?.ready || Promise.resolve();
  const [content, images, peel] = await Promise.all(['content.json', 'img/images.json', 'img/peel/peel.json'].map((u) => fetch(u).then((r) => r.json())));
  const C = { ...content, images, peel };
  setEras(C.places.eras);

  const L = { map: $('#layer-map'), time: $('#layer-time'), object: $('#layer-object'), tool: $('#layer-tool') };
  const mini = $('#mini'), desc = $('#stage-desc'), yearEl = $('.bar-year .y'), eraEl = $('.bar-year .era');
  const sheet = new Sheet($('#sheet'), C, { onGo: (id) => go(id) });
  const pick = (it) => sheet.show(it);
  const map = new MapStage(L.map, C, pick);
  const tl = new Timeline(L.time, mini, C, pick);
  const viewer = new Viewer(L.object, C);
  let explore = false;
  const resolve = (r) => {
    if (!r) return;
    if (r.band) tl.highlightBand(r.band);
    if (r.events) { tl.highlightEvents(r.events); if (cur?.stage?.mode === 'time') tl.show(cur.stage, cur.year, [...(cur.show || []), ...r.events], true); }
  };
  const tools = new Tools(L.tool, C, { onResolve: resolve, onExplore: () => setExplore(true) });

  const story = $('#story');
  const steps = buildStory(story, C, { onResolve: resolve, onSkip: (id) => { const i = steps.findIndex((s) => s.el.id === id); const nx = steps[i + 1]; if (nx) scrollToStep(nx, true); } });

  // ---- acts nav
  const nav = $('.bar-acts');
  const actLinks = C.acts.map((a) => {
    const target = a.id === 'p' ? steps[0].el : $(`#act-${a.id}`);
    const lnk = el('a', { href: `#${target.id || 'story'}`, 'aria-label': a.id === 'p' ? 'Prologue' : `Act ${a.n}: ${a.title}`, title: a.title, text: a.n || 'P' });
    lnk.addEventListener('click', (e) => { e.preventDefault(); setExplore(false); scrollToStep(steps.find((s) => s.el === target), false); });
    nav.append(lnk); return { a, lnk };
  });

  // ---- the scene reducer
  let cur = null, curStage = null, idx = -1;
  function setMode(mode) {
    for (const [k, node] of Object.entries(L)) { const on = k === mode; node.classList.toggle('on', on); node.setAttribute('aria-hidden', String(!on)); }
    mini.classList.toggle('off', mode === 'time');
    if (mode !== 'tool') tools.hide();
    if (mode !== 'map') map.scope.dispose();
    if (mode !== 'time') tl.scope.dispose();
  }
  // on a phone the tools live inside their beat's card; the stage keeps the instrument before them
  const MOB = matchMedia('(max-width: 820px)').matches;
  if (MOB) {
    document.body.classList.add('inline-tools');
    steps.filter((s) => s.stage?.mode === 'tool').forEach((s) => { const t = new Tools(s.el.querySelector('.tool-slot'), C, { onResolve: resolve, onExplore: () => setExplore(true) }); t.show(s.stage); });
  }
  function stageFor(i) { for (let j = i; j >= 0; j--) if (steps[j].stage && !(MOB && steps[j].stage.mode === 'tool')) return steps[j].stage; return steps.find((s) => s.stage).stage; }
  function apply(step, instant = false) {
    cur = step;
    const year = step.year;
    yearEl.textContent = Math.floor(year); eraEl.textContent = eraOf(year);
    tl.setYear(year, step.show || []);
    actLinks.forEach(({ a, lnk }) => { const on = a === step.act; lnk.classList.toggle('on', on); on ? lnk.setAttribute('aria-current', 'step') : lnk.removeAttribute('aria-current'); });
    const st = stageFor(steps.indexOf(step));
    const same = st === curStage;
    curStage = st;
    if (same && !instant) { if (st.mode === 'time') tl.show(st, year, step.show || [], true); return; }
    setMode(st.mode);
    let d = '';
    if (st.mode === 'map') { map.show(st, year, instant); d = map.describe(st); }
    if (st.mode === 'time') { tl.show(st, year, step.show || [], instant); d = tl.describe(st, year); }
    if (st.mode === 'object') { viewer.show(st); d = viewer.describe(st); }
    if (st.mode === 'tool') { tools.show(st); d = tools.describe(st); }
    desc.textContent = d;
  }

  // ---- the driver: the active step is the last whose top has crossed the trigger line
  const trigger = () => (innerWidth <= 820 ? innerHeight * 0.72 : innerHeight * 0.56);
  function pickStep() {
    if (explore) return;
    const y = trigger(); let k = 0;
    for (let i = 0; i < steps.length; i++) { if (steps[i].el.getBoundingClientRect().top <= y) k = i; else break; }
    if (k !== idx) {
      if (idx >= 0) steps[idx].el.classList.remove('active');
      idx = k; steps[k].el.classList.add('active'); apply(steps[k]);
    }
  }
  let ticking = false;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; pickStep(); }); } }, { passive: true });
  addEventListener('resize', () => { idx = -1; curStage = null; pickStep(); });
  function scrollToStep(step, smooth) {
    if (!step) return;
    const top = step.el.getBoundingClientRect().top + scrollY - trigger() + 40;
    const far = Math.abs(top - scrollY) > innerHeight * 1.5;
    scrollTo({ top: Math.max(0, top), behavior: smooth && !far && !motion.reduced ? 'smooth' : 'auto' });
  }
  function go(id) { setExplore(false); const s = steps.find((x) => x.el.id === id); if (s) { scrollToStep(s, true); [500, 1400].forEach((t) => setTimeout(() => { const d = s.el.getBoundingClientRect().top - (trigger() - 40); if (Math.abs(d) > 30) scrollToStep(s, false); }, t)); } }

  // ---- cast links, image buttons
  story.addEventListener('click', (e) => {
    const w = e.target.closest('[data-person]'); if (w) { pick({ type: 'person', id: w.dataset.person }); return; }
    const im = e.target.closest('[data-image]'); if (im) pick({ type: 'image', id: im.dataset.image });
  });

  // ---- explore: the instruments without the story
  const EX = [
    ['World', { mode: 'map', scale: 'world', rotate: 150, view: [-130, -40, 150, 62], points: ['edo', 'nagasaki', 'berlin', 'amsterdam', 'paris', 'london', 'boston', 'chicago', 'newyork', 'sanfrancisco', 'batavia', 'china'] }],
    ['Japan', { mode: 'map', scale: 'japan', view: [129.5, 31, 142.5, 38.5], points: ['edo', 'kyoto', 'osaka', 'nagasaki', 'echizen'], route: 'tokaido', prints: true }],
    ['Edo, 1859', { mode: 'map', scale: 'city', focus: 'all', layer: 'views' }],
    ['Timeline', { mode: 'time', range: [1600, 2025], lanes: ['state', 'trade', 'print', 'world', 'after'], bands: true, acts: true, lifespans: ['tsutaya', 'utamaro', 'hokusai', 'oi', 'hiroshige', 'kuniyoshi', 'hayashi', 'wright'] }],
  ];
  const xbar = el('div', { class: 'xbar', role: 'toolbar', 'aria-label': 'Explore the atlas' });
  const xbtns = EX.map(([lab, st]) => { const b = el('button', { class: 'tbtn', type: 'button' }, lab); b.addEventListener('click', () => { xbtns.forEach((x) => x.classList.toggle('on', x === b)); exploreStage(st); }); xbar.append(b); return b; });
  xbar.append(el('button', { class: 'tbtn primary', type: 'button', onclick: () => setExplore(false) }, 'Back to the story'));
  $('#stage').append(xbar);
  function exploreStage(st) { curStage = st; setMode(st.mode); const y = st.mode === 'time' ? 2024.5 : cur?.year || 1857; if (st.mode === 'map') map.show(st, y, false); else tl.show(st, y, [], false); desc.textContent = st.mode === 'map' ? map.describe(st) : tl.describe(st, y); }
  const bx = $('#btn-explore');
  function setExplore(on) {
    if (on === explore) return; explore = on;
    document.body.classList.toggle('explore', on); bx.setAttribute('aria-pressed', String(on));
    map.setExplore(on);
    if (on) { xbtns[0].click(); xbtns[0].focus(); }
    else { xbtns.forEach((x) => x.classList.remove('on')); idx = -1; curStage = null; pickStep(); }
  }
  bx.addEventListener('click', () => setExplore(!explore));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && explore && !sheet.open) setExplore(false); });

  // ---- motion and theme
  const bm = $('#btn-motion');
  const syncM = () => { bm.setAttribute('aria-pressed', String(motion.reduced)); document.body.classList.toggle('rm', motion.reduced); };
  bm.addEventListener('click', () => { motion.set(!motion.reduced); syncM(); });
  syncM();
  const root = document.documentElement;
  $('#btn-theme').addEventListener('click', () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
  });

  // ---- start
  await Promise.race([fontsP, new Promise((r) => setTimeout(r, 1200))]);
  document.body.classList.add('ready');
  const hash = decodeURIComponent(location.hash.slice(1));
  const start = hash && steps.find((s) => s.el.id === hash);
  if (start) { scrollToStep(start, false); }
  pickStep();
  if (new URLSearchParams(location.search).has('explore')) setExplore(true);
  window.__edo = { steps, apply, map, tl, viewer, tools, setExplore, go };
}

main().catch((e) => { console.error(e); document.body.append(el('p', { style: 'position:fixed;inset:auto 0 0;padding:12px;background:#fff;color:#900;z-index:99', text: 'This page could not load its content. ' + e.message })); });

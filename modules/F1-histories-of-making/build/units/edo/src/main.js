// The stage controller. One pinned stage (map, timeline, object or a lab) driven by the story column.
// The active step is the last one whose top has crossed the trigger line; each step names one instrument state.
// Every module another builder owns (instruments, cast, labs, the 3D opener) is loaded so that if it throws,
// the page keeps working: the host catches, logs and carries on.
import 'd3-transition';
import { $, el, motion, setEras, eraOf, Scope, store, spriteOf, imgUrl } from './util.js';
import { buildStory, sourcesFold } from './story.js';
import { Rooms, Plate, ROOMS } from './rooms.js';
import { Overture } from './overture.js';
import { mountLab, TOOL_TO_LAB } from './labs/index.js';
import { ATLAS_URL } from './config.js';

const setVh = () => document.documentElement.style.setProperty('--vh', `${innerHeight / 100}px`);

// a proxy that turns every method call on another builder's object into a guarded one
function safe(make, name) {
  let o = null;
  try { o = make(); } catch (e) { console.error(`${name} failed to start`, e); }
  return new Proxy({}, {
    get(_, k) {
      if (k === '__real') return o;
      if (k === 'scope') return o?.scope || new Scope();
      const v = o?.[k];
      if (typeof v !== 'function') return v;
      return (...a) => { try { const r = v.apply(o, a); if (r && typeof r.catch === 'function') r.catch((e) => console.error(`${name}.${String(k)}`, e)); return r; } catch (e) { console.error(`${name}.${String(k)}`, e); return undefined; } };
    },
  });
}
const settle = async (p) => { try { return await p; } catch (e) { console.error(e); return {}; } };

async function main() {
  setVh(); addEventListener('resize', setVh);
  const fontsP = document.fonts?.ready || Promise.resolve();
  const C = await fetch('content.json').then((r) => r.json());
  setEras(C.places.eras);
  const [MapM, TlM, ViewerM, Cards] = await Promise.all([settle(import('./map.js')), settle(import('./timeline.js')), settle(import('./viewer.js')), settle(import('./cards.js'))]);
  const MOB = matchMedia('(max-width: 820px)').matches;
  document.body.classList.toggle('mob', MOB);

  const L = { map: $('#layer-map'), time: $('#layer-time'), object: $('#layer-object'), tool: $('#layer-tool') };
  const mini = $('#mini'), desc = $('#stage-desc'), yearEl = $('.bar-year .y'), eraEl = $('.bar-year .era');

  // ---- overlays: the plate (images, places, events, views), the cast, the rooms
  const plate = new Plate(C, { onGo: (id) => go(id), onRoom: (id, a) => openRoom(id, a) });
  let cast = null;
  if (Cards.Cast) {
    cast = safe(() => new Cards.Cast(C, {
      store, onGo: (id) => go(id), onOpenImage: (id) => plate.show({ type: 'image', id }),
      onShowPlace: (id, scale) => showPlace(id, scale), onShowYear: (y) => showYear(y),
    }), 'cast');
    if (!cast.__real) cast = null;
  }
  const pick = (it) => { if (it?.type === 'person') openPerson(it.id); else plate.show(it); };
  const openPerson = (id, trigger) => { if (cast) cast.open(id, trigger); else plate.show({ type: 'person', id }); };

  // ---- instruments
  const map = safe(() => new MapM.MapStage(L.map, C, pick), 'map');
  const tl = safe(() => new TlM.Timeline(L.time, mini, C, pick), 'timeline');
  const viewer = safe(() => new ViewerM.Viewer(L.object, C), 'viewer');
  const MARKS = ViewerM.MARKS || {};
  let explore = false, cur = null, curStage = null, idx = -1;

  const resolve = (r) => {
    if (!r) return;
    if (r.band) tl.highlightBand(r.band);
    if (r.events) { tl.highlightEvents(r.events); if (curStage?.mode === 'time') tl.show(curStage, cur.year, [...(cur.show || []), ...r.events], true); }
    if (r.people) r.people.forEach((p) => cast?.meet(p));
  };
  const ctxFor = ({ mode, scope, params = {} }) => ({
    C, scope, motion, mode, params, imgUrl,
    sprite: (id) => spriteOf(C, id),
    store: { get: (k, f) => store.get(`lab:${k}`, f), set: (k, v) => store.set(`lab:${k}`, v) },
    onResolve: resolve,
    openRoom: (id, anchor) => openRoom(id, anchor),
    openPerson: (id) => openPerson(id),
    openImage: (id) => plate.show({ type: 'image', id }),
  });

  // ---- labs on the stage (desktop) or inline in their beat (phones)
  const bench = {
    key: null, inst: null, scope: null,
    async show(labId, params, root = L.tool) {
      const key = `${labId}|${JSON.stringify(params)}`;
      if (this.key === key) return; this.hide();
      this.key = key; const scope = this.scope = new Scope();
      const slot = el('div', { class: 'lab-host' }); root.append(slot);
      const inst = await mountLab(labId, slot, ctxFor({ mode: 'stage', scope, params }));
      if (this.scope !== scope) { inst.destroy(); return; }
      this.inst = inst; if (curStage?.mode === 'tool') desc.textContent = inst.describe();
    },
    hide() { try { this.inst?.destroy(); } catch (e) { /* */ } this.inst = null; this.scope?.dispose(); this.scope = null; this.key = null; L.tool.innerHTML = ''; },
  };
  const inline = new Map(); // stepIndex -> { inst, scope }
  async function mountInline(i) {
    if (inline.has(i)) return;
    const s = steps[i]; const slot = s.el.querySelector('.lab-slot'); if (!slot) return;
    const scope = new Scope(); const rec = { scope, inst: null }; inline.set(i, rec);
    rec.inst = await mountLab(TOOL_TO_LAB[s.stage.tool] || s.stage.tool, slot, ctxFor({ mode: 'stage', scope, params: { beat: s.beat.id, tool: s.stage.tool } }));
    if (inline.get(i) !== rec) rec.inst.destroy();
  }
  function pruneInline(k) { for (const [i, rec] of inline) if (Math.abs(i - k) > 2) { rec.scope.dispose(); rec.inst?.destroy(); inline.delete(i); } }

  // ---- rooms
  const rooms = new Rooms(ctxFor, { onOpen: () => { bench.hide(); curStage = null; }, onClose: () => { idx = -1; curStage = null; pickStep(); } });
  function openRoom(id, anchor, trigger) { rooms.open(id, anchor || null, { trigger }); }

  // ---- the story
  let story = null, codaRef = null;
  const scopeT = new Scope();
  const guessHost = {
    C, store, MARKS, tl, map, viewer,
    sources: (ids) => sourcesFold(C, ids),
    override: (st) => override(st),
    scopeTimeout: (f, ms) => setTimeout(f, ms),
    onChange: () => codaRef?.refresh(),
  };
  const host = {
    C, store, go: (id) => go(id), openRoom, atlasUrl: ATLAS_URL,
    decorate: (n) => cast?.decorate(n),
    skipFrom: (id) => { const i = steps.findIndex((s) => s.el.id === id); const nx = steps.slice(i + 1).find((s) => s.kind !== 'beat' || !s.beat.note); if (nx) scrollToStep(nx, true); },
    guessHost,
    rebuildHost: { store, tl, map, mob: MOB, go: (id) => go(id), onChange: () => codaRef?.refresh() },
    codaHost: {
      store, guessHost, MARKS, atlasUrl: ATLAS_URL,
      guesses: () => story?.guesses || [], go: (id) => go(id), openRoom,
      rooms: Object.entries(ROOMS).map(([id, r]) => [id, r.title, r.line]),
      metIds: () => cast?.met?.() || [],
      clearAll: () => { story?.guesses.forEach((g) => g.reset()); story?.rebuilds.forEach((r) => r.reset()); document.querySelectorAll('.debate').forEach((d) => d.resetDebate?.()); store.keys('guess:').concat(store.keys('rb:'), store.keys('debate:')).forEach((k) => store.del(k)); },
    },
  };
  const storyRoot = $('#story');
  story = buildStory(storyRoot, C, host);
  codaRef = story.coda; story.coda.refresh();
  const steps = story.steps;

  // ---- the overture
  const ovRoot = $('#overture');
  const overture = ovRoot ? new Overture(ovRoot, C, { onGo: () => { scrollTo({ top: ovRoot.offsetTop + ovRoot.offsetHeight - (MOB ? 0 : 0), behavior: 'auto' }); storyRoot.focus({ preventScroll: true }); }, onAct: (id) => go(`act-${id}`) }) : null;

  // ---- acts nav
  const nav = $('.bar-acts');
  const actLinks = C.acts.map((a) => {
    const target = a.id === 'p' ? steps.find((s) => s.act === a).el : $(`#act-${a.id}`);
    const lnk = el('a', { href: `#${target.id}`, 'aria-label': a.id === 'p' ? 'Prologue' : `Act ${a.n}: ${a.title}`, title: a.id === 'p' ? 'Prologue' : a.title, text: a.n || 'P' });
    lnk.addEventListener('click', (e) => { e.preventDefault(); setExplore(false); go(target.id); });
    nav.append(lnk); return { a, lnk };
  });

  // ---- the scene reducer
  function setMode(mode) {
    for (const [k, node] of Object.entries(L)) { const on = k === mode; node.classList.toggle('on', on); node.setAttribute('aria-hidden', String(!on)); }
    mini.classList.toggle('off', mode === 'time');
    if (mode !== 'tool') bench.hide();
    if (mode !== 'map') map.scope?.dispose?.();
    if (mode !== 'time') tl.scope?.dispose?.();
  }
  function stageFor(i) { for (let j = i; j >= 0; j--) { const st = steps[j].stage; if (st && !(MOB && st.mode === 'tool')) return st; } return steps.find((s) => s.stage && s.stage.mode !== 'tool').stage; }
  async function showStage(st, year, show, instant) {
    setMode(st.mode);
    let d = '', p = null;
    if (st.mode === 'map') { p = map.show(st, year, instant); d = map.describe(st) || ''; }
    if (st.mode === 'time') { p = tl.show(st, year, show || [], instant); d = tl.describe(st, year) || ''; }
    if (st.mode === 'object') { p = viewer.show(st); d = viewer.describe(st) || ''; }
    if (st.mode === 'tool') { const lab = TOOL_TO_LAB[st.tool] || st.tool; p = bench.show(lab, { tool: st.tool, beat: cur?.beat?.id }); d = ''; }
    desc.textContent = d;
    try { await p; } catch (e) { /* logged by safe() */ }
  }
  async function override(st) { curStage = st; await showStage(st, cur?.year || 1850, [], false); }
  let activeGuess = null, activeRB = null;
  async function apply(step, instant = false) {
    cur = step;
    const year = step.year;
    yearEl.textContent = Math.floor(year); eraEl.textContent = eraOf(year);
    tl.setYear(year, step.show || []);
    actLinks.forEach(({ a, lnk }) => { const on = a === step.act; lnk.classList.toggle('on', on); on ? lnk.setAttribute('aria-current', 'step') : lnk.removeAttribute('aria-current'); });
    // people met, guesses passed, rebuilds
    if (step.beat) { const ids = new Set([...(step.beat.people || []), ...[...step.beat.text.matchAll(/\[\[([^\]|]+)/g)].map((m) => m[1])]); ids.forEach((p) => cast?.meet(p)); }
    const k = steps.indexOf(step);
    if (activeGuess && activeGuess !== step.guess) { activeGuess.deactivate(); activeGuess = null; }
    if (activeRB && activeRB !== step.rebuild) { activeRB.deactivate(); activeRB = null; }
    if (step.kind === 'coda') codaRef.refresh();
    if (MOB && step.stage?.mode === 'tool') mountInline(k);
    if (MOB) pruneInline(k);
    const st = stageFor(k);
    const same = st === curStage;
    curStage = st;
    if (same && !instant) { if (st.mode === 'time') tl.show(st, year, step.show || [], true); }
    else await showStage(st, year, step.show || [], instant);
    if (cur !== step) return;
    if (step.guess) { activeGuess = step.guess; step.guess.activate(); }
    if (step.rebuild) { activeRB = step.rebuild; step.rebuild.activate(); }
  }

  // ---- the driver
  const trigger = () => (MOB ? innerHeight * 0.72 : innerHeight * 0.56);
  let prevScene = null;
  function pickStep() {
    if (explore || rooms.id) return;
    const y = trigger(); let k = 0;
    for (let i = 0; i < steps.length; i++) { if (steps[i].el.getBoundingClientRect().top <= y) k = i; else break; }
    if (k !== idx) {
      if (idx >= 0) { steps[idx].el.classList.remove('active'); }
      steps.forEach((s, i) => s.el.classList.toggle('past', i < k));
      idx = k; steps[k].el.classList.add('active');
      const sc = steps[k].scene || null;
      if (sc !== prevScene) { prevScene?.el.classList.remove('on'); sc?.el.classList.add('on'); prevScene = sc; }
      apply(steps[k]);
    }
  }
  // a guess left unanswered is revealed once it has scrolled out of view above, with nothing marked
  function passGuesses() { for (const G of story.guesses) if (!G.revealed && G.el.getBoundingClientRect().bottom < 0) G.passed(); }
  function paintThreads() {
    const y = trigger();
    for (const sc of story.scenes) {
      const r = sc.body.getBoundingClientRect();
      const f = r.top >= y ? 0 : r.bottom <= y ? 1 : (y - r.top) / r.height;
      if (sc._f !== f) { sc._f = f; sc.thread.style.setProperty('--fill', f.toFixed(4)); }
    }
  }
  let ticking = false;
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; overture?.update(); pickStep(); paintThreads(); passGuesses(); }); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { idx = -1; curStage = null; onScroll(); });
  function scrollToStep(step, smooth) {
    if (!step) return;
    // an act opener lands at the top of the reading area (below the stage on phones); a beat lands on the trigger line
    const off = step.kind === 'act' ? (MOB ? innerHeight * 0.46 : 0) : trigger() - 40;
    const top = step.el.getBoundingClientRect().top + scrollY - off;
    const far = Math.abs(top - scrollY) > innerHeight * 1.5;
    scrollTo({ top: Math.max(0, top), behavior: smooth && !far && !motion.reduced ? 'smooth' : 'auto' });
  }
  function go(id) {
    if (rooms.id) rooms.close();
    setExplore(false);
    const s = steps.find((x) => x.el.id === id) || steps.find((x) => x.scene?.el.id === id);
    if (!s) { const n = document.getElementById(id); if (n) n.scrollIntoView({ behavior: motion.reduced ? 'auto' : 'smooth' }); return; }
    scrollToStep(s, true);
    [500, 1400].forEach((t) => setTimeout(() => { const want = s.kind === 'act' ? (MOB ? innerHeight * 0.46 : 0) : trigger() - 40; const d = s.el.getBoundingClientRect().top - want; if (Math.abs(d) > 30) scrollToStep(s, false); }, t));
  }

  // ---- clicks in the story: people, images
  storyRoot.addEventListener('click', (e) => {
    const w = e.target.closest('[data-person]'); if (w && storyRoot.contains(w)) { e.preventDefault(); openPerson(w.dataset.person, w); return; }
    const im = e.target.closest('[data-image]'); if (im) plate.show({ type: 'image', id: im.dataset.image });
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
  function exploreStage(st, y) { curStage = st; y = y ?? (st.mode === 'time' ? 2024.5 : cur?.year || 1857); setMode(st.mode); if (st.mode === 'map') map.show(st, y, false); else tl.show(st, y, [], false); desc.textContent = (st.mode === 'map' ? map.describe(st) : tl.describe(st, y)) || ''; }
  const bx = $('#btn-explore');
  function setExplore(on) {
    if (on === explore) return; explore = on;
    document.body.classList.toggle('explore', on); bx.setAttribute('aria-pressed', String(on));
    map.setExplore(on);
    if (on) { xbtns[0].click(); xbtns[0].focus(); }
    else { xbtns.forEach((x) => x.classList.remove('on')); idx = -1; curStage = null; pickStep(); }
  }
  function showPlace(id, scale) {
    setExplore(true);
    if (scale === 'city') exploreStage({ mode: 'map', scale: 'city', focus: [id] });
    else if (scale === 'japan' || scale === 'kanto') exploreStage({ ...EX[1][1], points: [id], prints: false, route: null });
    else exploreStage({ ...EX[0][1], points: [id] });
  }
  function showYear(y) { setExplore(true); exploreStage(EX[3][1], y); }
  bx.addEventListener('click', () => setExplore(!explore));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && explore && !plate.open && !rooms.id) setExplore(false); });

  // ---- the bar: rooms menu, motion, theme
  const rb = $('#btn-rooms'), rmenu = $('#rooms-menu');
  Object.entries(ROOMS).forEach(([id, r]) => {
    const a = el('a', { href: `#room-${id}`, class: 'rm-item', role: 'menuitem' }, el('span', { class: `room-ic ic-${id}`, 'aria-hidden': 'true' }), el('span', { class: 'rm-t' }, el('b', { text: r.title }), el('span', { text: r.line })));
    a.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); openRoom(id, null, rb); });
    rmenu.append(a);
  });
  const closeMenu = () => { rmenu.hidden = true; rb.setAttribute('aria-expanded', 'false'); };
  rb.addEventListener('click', () => { const open = rmenu.hidden; rmenu.hidden = !open; rb.setAttribute('aria-expanded', String(open)); if (open) rmenu.querySelector('a')?.focus(); });
  rmenu.addEventListener('keydown', (e) => {
    const items = [...rmenu.querySelectorAll('a')]; const k = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); rb.focus(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(k + 1) % items.length].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[(k - 1 + items.length) % items.length].focus(); }
  });
  document.addEventListener('pointerdown', (e) => { if (!rmenu.hidden && !rmenu.contains(e.target) && e.target !== rb && !rb.contains(e.target)) closeMenu(); });

  const bm = $('#btn-motion');
  const syncM = () => { bm.setAttribute('aria-pressed', String(motion.reduced)); document.body.classList.toggle('rm', motion.reduced); overture?.update(true); };
  bm.addEventListener('click', () => { motion.set(!motion.reduced); syncM(); });
  motion.on(syncM);
  syncM();
  const root = document.documentElement;
  $('#btn-theme').addEventListener('click', () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    if (curStage) { const st = curStage; curStage = null; showStage(st, cur?.year || 1850, cur?.show, true); curStage = st; }
  });

  // ---- the cast deck, and beats entering
  // the Cast button lives in the bar on wide screens (beside Rooms), and floats bottom-left on phones
  if (cast) { const slot = $('.bar-cast'); cast.mountDeck(slot || document.body); }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' }) : null;
  document.querySelectorAll('.beat, .act-open, .scene-head, .rebuild, .coda').forEach((n) => (io ? io.observe(n) : n.classList.add('seen')));

  // ---- start
  await Promise.race([fontsP, new Promise((r) => setTimeout(r, 1200))]);
  document.body.classList.add('ready');
  const hash = decodeURIComponent(location.hash.slice(1));
  if (Rooms.parse(location.hash)) { rooms.syncHash(); }
  else if (hash && hash !== 'story') { const s = steps.find((x) => x.el.id === hash); if (s) scrollToStep(s, false); }
  overture?.update(true); pickStep(); paintThreads();
  if (new URLSearchParams(location.search).has('explore')) setExplore(true);
  window.__edo = { steps, go, setExplore, openRoom, apply, map, tl, viewer, story, rooms, overture, cast, plate };
}

main().catch((e) => { console.error(e); document.body.append(el('p', { class: 'fatal', role: 'alert', text: 'This page could not load its content. ' + e.message })); });

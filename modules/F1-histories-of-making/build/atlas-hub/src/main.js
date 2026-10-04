import './styles.css';
import { M, loadData, LENS_DEF, LENS_ORDER, sliderToYear, yearToSlider, fmtYear, retime, unitShort, esc, FAMILY, FAMILY_ORDER } from './model.js';
import { S, set, on, parseHash, store, announce, reduceMotionQuery } from './state.js';
import { loadInk, ingest, INK, nodeName, exportCode, importCode, clearInk, practiseLens, lensesPractised, whyEdges, inkState } from './ink.js';
import { renderPanel, bindPanel, glyph } from './panel.js';
import { bindLabels, clearLabels, focusLabel } from './labels.js';
import { Map2D, shapePath } from './map2d.js';
import { Veil } from './veil.js';
import { expansionZoom } from './scene.js';

const $ = (s) => document.querySelector(s);
const phoneQ = matchMedia('(max-width: 760px)');
let map = null, globe = null, veil = null, surface = null, globeFailed = false;
let playing = null;

// ------------------------------------------------------------ preferences
function initPrefs() {
  S.phone = phoneQ.matches;
  const pm = store.get('f1-atlas.motion', null);
  S.motion = pm === null ? !reduceMotionQuery.matches : pm;
  const th = store.get('f1-atlas.theme', 'auto');
  S.theme = th;
  applyTheme();
  syncPrefButtons();
  reduceMotionQuery.addEventListener?.('change', () => { if (store.get('f1-atlas.motion', null) === null) { S.motion = !reduceMotionQuery.matches; syncPrefButtons(); } });
  phoneQ.addEventListener?.('change', () => { S.phone = phoneQ.matches; refreshAll(); });
  $('#b-motion').addEventListener('click', () => { S.motion = !S.motion; store.set('f1-atlas.motion', S.motion); syncPrefButtons(); announce(S.motion ? 'Motion on.' : 'Motion off: flights become cuts.'); });
  $('#b-theme').addEventListener('click', () => { S.theme = S.theme === 'auto' ? 'light' : S.theme === 'light' ? 'dark' : 'auto'; store.set('f1-atlas.theme', S.theme); applyTheme(); syncPrefButtons(); });
}
function applyTheme() {
  if (S.theme === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = S.theme;
  requestAnimationFrame(() => { globe?.readTheme(); map?.draw(); });
}
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if (S.theme === 'auto') applyTheme(); });
function syncPrefButtons() {
  const bm = $('#b-motion');
  bm.setAttribute('aria-pressed', String(S.motion));
  bm.querySelector('.tool-v').textContent = S.motion ? 'on' : 'off';
  bm.setAttribute('aria-label', `Motion ${S.motion ? 'on' : 'off'}`);
  const bt = $('#b-theme');
  bt.querySelector('.tool-v').textContent = S.theme === 'auto' ? 'auto' : S.theme === 'light' ? 'day' : 'night';
  bt.setAttribute('aria-label', `Paper: ${S.theme === 'auto' ? 'follows your system' : S.theme === 'light' ? 'day paper' : 'night paper'}. Change.`);
}

// ------------------------------------------------------------ lens bar, time bar, legend
function buildLensBar() {
  const bar = $('#lensbar');
  bar.innerHTML = `<span class="lensbar-k" aria-hidden="true">Lenses</span>` + LENS_ORDER.map((id) => {
    const L = LENS_DEF[id];
    const sw = L.layer === 'copying' ? '<span class="sw dash" aria-hidden="true"></span>' : L.layer ? `<span class="sw" aria-hidden="true" style="color: var(${L.layer === 'extraction' ? '--extract' : L.layer === 'museums' ? '--prov' : L.layer === 'industry' ? '--gold' : L.layer === 'retime' ? '--ink-2' : '--indigo'})"></span>` : '<span class="sw" aria-hidden="true" style="color: var(--extract); height: 8px; width: 8px; border-radius: 2px; opacity: .55"></span>';
    return `<button type="button" class="chip" data-lens="${id}" aria-pressed="false">${sw}${esc(L.short)} <span class="code">${id.replace('F1.', '')}</span></button>`;
  }).join('');
  bar.addEventListener('click', (e) => { const b = e.target.closest('[data-lens]'); if (b) toggleLens(b.dataset.lens); });
}
function syncLensBar() {
  for (const b of document.querySelectorAll('#lensbar [data-lens]')) b.setAttribute('aria-pressed', String(S.lens === b.dataset.lens));
  const cap = $('#lenscap');
  if (!S.lens) { cap.hidden = true; document.body.classList.remove('has-lenscap'); return; }
  const L = LENS_DEF[S.lens], u = M.unitById.get(S.lens);
  cap.hidden = false; document.body.classList.add('has-lenscap');
  cap.innerHTML = `<div class="lenscap-k"><span>Lens · ${S.lens}</span><button type="button" class="x" data-lensoff="1">Turn off</button></div>
    <p class="lenscap-t">${esc(L.short)}</p><p>${esc(L.does)}</p>${u?.question ? `<p class="q">${esc(u.question)}</p>` : ''}`;
  cap.querySelector('[data-lensoff]').addEventListener('click', () => toggleLens(S.lens));
}
const LENS_FOCUS = { 'F1.22': [-20, 2], 'F1.24': [-25, 38], 'F1.19': [5, 42], 'F1.14': [45, 38] };
function toggleLens(id) {
  const lens = S.lens === id ? null : id;
  if (lens) practiseLens(lens);
  set({ lens });
  if (lens && LENS_FOCUS[lens] && surface && surface === globe && S.tier === 'world') globe.flyTo(LENS_FOCUS[lens][0], LENS_FOCUS[lens][1], globe.fitD * 1.02);
  announce(lens ? `Lens on: ${LENS_DEF[lens].short}. ${LENS_DEF[lens].does}` : 'Lens off.');
}

function buildTimeBar() {
  const tb = $('#timebar');
  tb.innerHTML = `<button type="button" class="tb-play" id="tb-play" aria-label="Play time: draw the routes as the years pass"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.8v10.4L12 7z" fill="currentColor"/></svg></button>
    <div class="tb-mid"><div class="tb-scale" aria-hidden="true"><span style="left:0">12,000 BCE</span><span style="left:30%">1 CE</span><span style="left:65%">1500</span><span style="left:100%">2026</span></div>
    <input type="range" class="tb-range" id="tb-range" min="0" max="1000" step="1" value="1000" aria-label="Year"></div>
    <div class="tb-read" aria-hidden="true"><span class="tb-year" id="tb-year">All time</span><span class="tb-alt" id="tb-alt"></span></div>`;
  const r = $('#tb-range');
  r.addEventListener('input', () => { stopPlay(); const v = +r.value; set({ year: v >= 1000 ? null : sliderToYear(v) }, { silentHash: true }); });
  r.addEventListener('change', () => set({}, {}));
  $('#tb-play').addEventListener('click', () => (playing ? stopPlay() : startPlay()));
}
function syncTimeBar() {
  const r = $('#tb-range');
  if (!r) return;
  const y = S.year;
  if (document.activeElement !== r || playing) r.value = String(y === null ? 1000 : yearToSlider(y));
  $('#tb-year').textContent = y === null ? 'All time' : fmtYear(y);
  r.setAttribute('aria-valuetext', y === null ? 'All time: every route drawn' : `${fmtYear(y)}: routes drawn up to this year`);
  const alt = $('#tb-alt');
  if (S.lens === 'F1.30' && y !== null) alt.innerHTML = retime(y).filter((x) => x.t).map((x) => `<b>${esc(x.k)}</b> ${esc(x.t)}${x.kanji ? ` <span lang="ja">${esc(x.kanji)}</span>` : ''}`).join(' · ');
  else if (S.lens === 'F1.30') alt.textContent = 'Move the scrubber to re-time';
  else alt.textContent = y === null ? 'Scrub or play to draw routes' : 'Routes drawn to this year';
  const pb = $('#tb-play');
  pb.innerHTML = playing ? '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 2h3v10H3zM8 2h3v10H8z" fill="currentColor"/></svg>' : '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.8v10.4L12 7z" fill="currentColor"/></svg>';
  pb.setAttribute('aria-label', playing ? 'Pause time' : 'Play time: draw the routes as the years pass');
}
function startPlay() {
  const stops = [-3000, -2000, -1000, -500, 0, 500, 1000, 1250, 1500, 1650, 1800, 1900, 2026];
  let y = S.year === null || S.year >= 2026 ? -3000 : S.year;
  if (!S.motion) {
    let i = stops.findIndex((s) => s > y);
    if (i < 0) i = 0;
    const tick = () => { if (i >= stops.length) { stopPlay(true); return; } set({ year: stops[i] }, { silentHash: true }); announce(fmtYear(stops[i])); i++; playing = setTimeout(tick, 1400); };
    playing = setTimeout(tick, 10);
    syncTimeBar();
    return;
  }
  let t0 = null, v0 = yearToSlider(y);
  const total = 16000 * (1000 - v0) / 1000 + 600;
  const step = (now) => {
    if (!playing) return;
    if (t0 === null) t0 = now;
    const k = Math.min(1, (now - t0) / total);
    const v = v0 + (1000 - v0) * k;
    set({ year: k >= 1 ? 2026 : sliderToYear(v) }, { silentHash: true });
    if (k >= 1) { stopPlay(true); return; }
    playing = requestAnimationFrame(step);
  };
  playing = requestAnimationFrame(step);
  syncTimeBar();
  announce('Playing time from ' + fmtYear(y));
}
function stopPlay(ended) {
  if (!playing) return;
  cancelAnimationFrame(playing); clearTimeout(playing);
  playing = null;
  set({}, {});
  syncTimeBar();
  if (ended) announce('Time has reached 2026: every route is drawn.');
}

function buildLegend() {
  const lg = $('#legend');
  const line = (st, extra = '') => `<svg width="26" height="8" aria-hidden="true"><path d="M1 4h24" stroke="${st}" stroke-width="2" ${extra}/></svg>`;
  lg.innerHTML = `<details><summary>Key</summary><span class="legend-k">Marks</span>
    <span class="legend-row">${glyph('city', 0, 14)} not yet read: pale, dashed</span>
    <span class="legend-row">${glyph('city', 0.5, 14)} a rumour: named, not read</span>
    <span class="legend-row">${glyph('city', 1, 14)} inked: you engaged it</span>
    <span class="legend-k">Lines</span>
    <span class="legend-row">${line('var(--indigo)')} route (schematic)</span>
    <span class="legend-row">${line('var(--ink)', 'stroke-dasharray="2 3"')} contested</span>
    <span class="legend-row">${line('var(--ink)', 'stroke-dasharray="5 4"')} copy chain</span>
    <span class="legend-row">${line('var(--extract)')} extraction flow</span>
    <span class="legend-row">${line('var(--prov)')} provenance arc</span>
    <span class="legend-k">Kinds of place</span>
    ${['site', 'city', 'maker', 'holding', 'object', 'route'].map((f) => `<span class="legend-row">${glyph(f, 1, 13)} ${FAMILY[f].name}</span>`).join('')}</details>`;
}
function syncLegend() {
  const lg = $('#legend');
  lg.hidden = S.phone || S.tier === 'unit' || S.view === 'list';
}

function syncTier() {
  const el = $('#tier');
  if (S.tier === 'unit') { el.hidden = true; return; }
  el.hidden = false;
  if (S.tier === 'region' && S.unit && M.terrById.has(S.unit)) {
    const u = M.unitById.get(S.unit);
    el.innerHTML = `<span class="tier-k">Region tier · ${S.unit}</span><span class="tier-t">${esc(M.terrById.get(S.unit).name)}</span><span class="tier-d">read through ${esc(u.device)}</span>`;
  } else if (S.tier === 'region') {
    el.innerHTML = `<span class="tier-k">Region tier</span><span class="tier-t">Places, clustered by kind</span><span class="tier-d">Open a cluster, or a place’s card</span>`;
  } else {
    el.innerHTML = `<span class="tier-k">World tier</span><span class="tier-t">Nine world chapters</span><span class="tier-d">${S.phone ? 'Tap a wash to read a chapter' : 'Each wash is a reading, not a border'}</span>`;
  }
}

// ------------------------------------------------------------ surfaces
const surfaceApi = {
  onTerritory: (id) => goUnit(id, 'surface'),
  onNode: (id) => { set({ node: id }, { push: true, from: 'surface' }); },
  onZoomTier: (tier) => {
    const was = S.tier;
    S.zoomTier = tier;
    set({}, { silentHash: true, zoomOnly: true });
    if (was !== S.tier) announce(S.tier === 'region' ? 'Region tier: places appear, clustered by kind.' : 'World tier: nine chapters.');
  },
  onQuality: (q, avg) => {
    if (q === 0) { showNote(`The globe ran slowly here (about ${Math.round(avg)} ms a frame), so the Atlas switched to the flat map. Everything is the same; only the projection changed.`); globeFailed = true; setView('map'); }
  },
};

async function ensureMap() {
  if (map) return map;
  map = new Map2D($('#map-host'), surfaceApi);
  await map.init();
  return map;
}
async function ensureGlobe() {
  if (globe || globeFailed) return globe;
  const { Globe } = await import('./globe.js');
  if (!Globe.supported()) { globeFailed = true; return null; }
  try {
    globe = new Globe($('#globe-host'), surfaceApi);
    $('#globe-host').hidden = false;
    await globe.init();
    window.__atlasGlobe = globe;
    return globe;
  } catch (err) {
    console.warn('Globe failed, using the flat map', err);
    globeFailed = true; globe = null;
    $('#globe-host').hidden = true;
    return null;
  }
}

async function setView(v, opts = {}) {
  if (v === 'globe' && globeFailed) v = 'map';
  S.view = v;
  document.body.dataset.view = v;
  for (const b of document.querySelectorAll('.seg-b')) b.setAttribute('aria-pressed', String(b.dataset.view === v));
  if (v === 'list') { set({}, {}); clearLabels(); return; }
  if (v === 'globe') {
    const g = await ensureGlobe();
    if (!g) {
      showNote('This browser cannot draw the WebGL globe, so the Atlas shows the flat map. The list beside it holds everything.');
      return setView('map');
    }
    map?.setVisible(false);
    clearLabels();
    g.setVisible(true);
    surface = g;
  } else {
    const m = await ensureMap();
    globe?.setVisible(false);
    clearLabels();
    m.setVisible(true);
    surface = m;
  }
  set({}, {});
  if (!opts.noFly) placeSurfaceForState(true);
}

function placeSurfaceForState(instant) {
  if (!surface) return;
  if (S.story) { if (surface === globe) { globe.lon = M.atlas.edo.centre[0]; globe.lat = M.atlas.edo.centre[1]; globe.d = 1.14; globe.invalidate(); } return; }
  if (S.node && M.byId.get(S.node)?.placed) {
    const o = M.byId.get(S.node);
    if (surface === globe) { globe.lon = o.x; globe.lat = o.y; globe.d = globe.fitD * 0.32; globe.invalidate(); } else map.flyTo([o.x, o.y], 9, 0);
    return;
  }
  if (S.unit && M.terrById.has(S.unit)) {
    if (surface === globe) { const t = M.terrById.get(S.unit); globe.lon = t.label[0]; globe.lat = t.label[1]; globe.d = globe.fitD * 0.6; globe.invalidate(); } else map.flyToTerritory(S.unit, 0);
    return;
  }
  if (!instant) surface.home();
}

function showNote(text) {
  let n = document.querySelector('.fallback-note');
  if (!n) { n = document.createElement('p'); n.className = 'fallback-note'; n.setAttribute('role', 'status'); $('#stage').appendChild(n); }
  n.textContent = text;
  setTimeout(() => n.remove(), 12000);
}

// ------------------------------------------------------------ navigation actions
function goUnit(id, from) {
  if (LENS_DEF[id] && !M.terrById.has(id)) {
    if (S.lens !== id) practiseLens(id);
    set({ unit: id, node: null, story: null, lens: id }, { push: true, from });
    return;
  }
  set({ unit: id, node: null, story: null }, { push: true, from });
}

const panelActions = {
  go: (go) => set({ node: null, ...go }, { push: true, from: 'list' }),
  unit: (id) => goUnit(id, 'list'),
  lens: (id) => toggleLens(id),
  node: (id) => set({ node: id }, { push: true, from: 'list' }),
  story: () => set({ story: 'edo', node: null, unit: 'F1.8' }, { push: true, from: 'list' }),
  notebook: () => openNotebook(),
  inked: (id, onNow) => { announce(onNow ? `${nodeName(id)} is inked in your notebook.` : `${nodeName(id)} is no longer noted.`); set({}, { inkChanged: true }); },
  fly: (id) => { if (S.view === 'list') setView(globeFailed ? 'map' : 'globe'); surface?.flyToNode(id); },
  pin: (pid) => { const p = M.atlas.edo.pins.find((x) => x.id === pid); if (p) announce(`${p.name} ${p.kanji}: ${p.approx ? 'approximate position' : 'georeferenced'} on the 1859 sheet.`); document.querySelector(`.pin[data-pin="${pid}"]`)?.focus(); },
};

function onLabel(key, kind) {
  if (kind === 'territory') goUnit(key.slice(2), 'surface');
  else if (kind === 'story') set({ story: 'edo', node: null, unit: 'F1.8' }, { push: true, from: 'surface' });
  else if (kind === 'node') set({ node: key.slice(2) }, { push: true, from: 'surface' });
  else if (kind === 'cluster') {
    const cid = +key.slice(2);
    const m = surface?.marks?.find((x) => x.cluster && x.cid === cid);
    if (!m) return;
    if (surface === globe) {
      const z = expansionZoom(cid), zNow = globe.zoomLevel();
      const f = Math.pow(2, Math.max(1, (z ?? zNow + 1) - zNow + 0.3));
      globe.flyTo(m.lon, m.lat, 1 + (globe.d - 1) / f);
    } else map.expandCluster(m);
    announce(`Opening a cluster of ${m.n} places.`);
  }
}

function climb() {
  if (!$('#notebook').hidden) { closeNotebook(); return; }
  if (S.story) { set({ story: null, unit: 'F1.8' }, { push: true }); return; }
  if (S.node) { set({ node: null }, { push: true }); return; }
  if (S.unit) { set({ unit: null, lens: LENS_DEF[S.unit] && !M.terrById.has(S.unit) ? S.lens : S.lens }, { push: true }); return; }
  if (S.tier === 'region') surface?.home();
}

// ------------------------------------------------------------ reacting to state
let lastTier = null;
let panelKey = '';
async function react(s, prev, opts) {
  const pk = [s.node, s.story, s.unit, s.lens, s.view, s.phone, INK.version, opts.inkChanged ? Math.random() : 0].join('|');
  if (pk !== panelKey) { panelKey = pk; renderPanelSafe(opts); }
  document.body.classList.toggle('tier-unit', S.tier === 'unit');
  syncLensBar(); syncTimeBar(); syncTier(); syncLegend();
  if (opts.zoomOnly) return;
  const storyOpened = s.story && !prev.story, storyClosed = !s.story && prev.story;
  if (veil && storyOpened && S.view !== 'list') {
    if (surface === globe && globe) await globe.flyToEdo();
    else if (surface === map && map) map.flyTo(M.atlas.edo.centre, 30);
    if (S.story) await veil.open();
  } else if (veil && storyClosed) {
    await veil.close();
  }
  if (surface && !s.story) {
    if (opts.from === 'handoff' && surface === globe) globe.flyTo(136, 35, globe.fitD * 0.42);
    else if (opts.from === 'handoff' && surface === map) map.flyTo([136, 35], 6);
    else if (s.unit !== prev.unit && s.unit && M.terrById.has(s.unit)) surface.flyToTerritory(s.unit);
    else if (s.unit !== prev.unit && !s.unit && prev.unit && M.terrById.has(prev.unit)) surface.home();
    else if (s.node && s.node !== prev.node && opts.from === 'list') surface.flyToNode(s.node);
  }
  globe?.update();
  if (surface && surface === map) map.draw();
  if (S.tier !== lastTier) {
    if (lastTier !== null) {
      if (S.tier === 'unit') announce('Unit tier: the Edo story, on the 1859 map. Escape returns to East Asia.');
      else if (S.tier === 'region' && S.unit) announce(`Region tier: ${M.terrById.get(S.unit)?.name}, read through ${M.unitById.get(S.unit)?.device}. ${M.terrById.get(S.unit)?.nodeList.filter((o) => o.placed).length} places. Escape returns to the world.`);
      else if (S.tier === 'world') announce('World tier: nine chapters.');
    }
    lastTier = S.tier;
  } else if (s.node && s.node !== prev.node) announce(`${nodeName(s.node)}: card open in the list.`);
}

function renderPanelSafe(opts) {
  const panel = $('#panel');
  const before = document.activeElement;
  const keepFocus = panel.contains(before) && opts?.from !== 'list';
  renderPanel();
  if (opts?.from === 'list' || opts?.from === 'surface') {
    // move focus to the new page heading for screen readers when the page changed
    const h = panel.querySelector('h2');
    if (h && opts.from === 'list') { h.tabIndex = -1; h.focus({ preventScroll: false }); }
    if (S.phone && opts.from === 'surface') { /* leave focus on the surface; the page below changed */ }
    panel.scrollTop = 0;
  } else if (keepFocus) { /* nothing */ }
}

function refreshAll() {
  map?.resize(); globe?.resize(); veil?.layout();
  set({}, { silentHash: true });
}

// ------------------------------------------------------------ the field notebook (and the rumour log, whole)
function openNotebook() {
  const nb = $('#notebook');
  const solid = [...INK.solid.keys()], rum = [...INK.rumour.keys()];
  const lp = lensesPractised();
  nb.innerHTML = `<button type="button" class="btn btn-2 btn-s nb-close" data-close="1">Close</button>
    <p class="p-kicker">Field notebook</p><h2>What you have inked</h2>
    <p class="p-small">The Atlas only knows what you bring back. Units hand their marks over in the link, and you can carry this notebook to another device with the code below. Nothing here is a score.</p>
    <section class="p-sec"><h3 class="p-sh">In ink <span class="n">${solid.length}</span></h3>
    ${solid.length ? `<ul class="why">${solid.map((id) => { const w = whyEdges(id).find((e) => e.kind === 'ink'); return `<li><span class="rel"><button type="button" class="tag" data-node="${esc(id)}">${esc(nodeName(id))}</button></span> ${w ? esc(w.rel) : ''}<span class="src">${w ? `Source: ${esc(w.src)}${w.via ? ' · ' + esc(w.via.detail) : ''}` : ''}</span></li>`; }).join('')}</ul>` : '<p class="p-small">Nothing yet.</p>'}</section>
    ${rum.length ? `<section class="p-sec"><h3 class="p-sh">Rumours <span class="n">${rum.length}</span></h3><ul class="why">${rum.map((id) => { const w = whyEdges(id).find((e) => e.kind === 'rumour'); return `<li class="is-rumour"><span class="rel"><button type="button" class="tag" data-node="${esc(id)}">${esc(nodeName(id))}</button></span> ${w ? esc(w.rel) : ''}<span class="src">${w ? `named because you read ${esc(w.who)}` : ''}</span></li>`; }).join('')}</ul></section>` : ''}
    <section class="p-sec"><h3 class="p-sh">Lenses practised <span class="n">${lp.length}</span></h3><p class="p-small">${lp.length ? lp.map((id) => `${id} ${esc(LENS_DEF[id]?.short || '')}`).join(' · ') : 'None yet. Every lens is always open.'}</p></section>
    <label for="nb-code">Your notebook code</label><textarea id="nb-code" readonly>${esc(exportCode())}</textarea>
    <div class="acts" style="display:flex;gap:8px;margin-top:8px"><button type="button" class="btn btn-2 btn-s" data-copy="1">Copy the code</button></div>
    <label for="nb-in">Paste a code from another device</label><textarea id="nb-in" placeholder="ink.edo.tsutaya~hokusai"></textarea>
    <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button type="button" class="btn btn-s" data-import="1">Add these marks</button><button type="button" class="btn btn-2 btn-s" data-clear="1">Clear my ink…</button></div>
    <p class="p-note" id="nb-msg" role="status"></p>`;
  nb.hidden = false;
  $('#b-notebook').setAttribute('aria-expanded', 'true');
  nb.focus();
  nb.onclick = (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const msg = $('#nb-msg');
    if (b.dataset.close) closeNotebook();
    else if (b.dataset.node) { closeNotebook(); set({ node: b.dataset.node }, { push: true, from: 'list' }); }
    else if (b.dataset.copy) { const t = $('#nb-code'); t.select(); try { navigator.clipboard.writeText(t.value).then(() => { msg.textContent = 'Copied.'; }, () => { msg.textContent = 'Select the code and copy it.'; }); } catch { msg.textContent = 'Select the code and copy it.'; } }
    else if (b.dataset.import) { const n = importCode($('#nb-in').value); msg.textContent = n ? `${n} mark${n === 1 ? '' : 's'} added.` : 'No marks found in that code.'; set({}, { inkChanged: true }); }
    else if (b.dataset.clear) {
      if (b.dataset.confirm) { clearInk(); msg.textContent = 'Your ink is cleared.'; set({}, { inkChanged: true }); openNotebook(); }
      else { b.dataset.confirm = '1'; b.textContent = 'Yes, clear every mark'; msg.textContent = 'Press again to clear. This cannot be undone.'; }
    }
  };
}
function closeNotebook() { $('#notebook').hidden = true; $('#b-notebook').setAttribute('aria-expanded', 'false'); $('#b-notebook').focus(); }

// ------------------------------------------------------------ hand-off
function handleHandoff(h) {
  const ids = ingest(h.unit, h.ids);
  if (!ids.length) return;
  const e = M.atlas.edo;
  const names = [...new Set(ids.map((id) => e.items[id]?.label).filter(Boolean))];
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<b>Inked from the Edo unit</b>${esc(names.slice(0, 6).join(', '))}${names.length > 6 ? `, and ${names.length - 6} more` : ''}. Their marks are in solid ink now; what they name is a rumour.<br><button type="button">Close</button>`;
  $('#stage').appendChild(toast);
  toast.querySelector('button').addEventListener('click', () => toast.remove());
  setTimeout(() => toast.remove(), 14000);
  announce(`Inked from the Edo unit: ${names.join(', ')}.`);
}

// ------------------------------------------------------------ keyboard
function bindKeys() {
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const inField = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
    if (e.key === 'Escape') { if (inField && document.activeElement.id !== 'tb-range') return; climb(); e.preventDefault(); return; }
    if (inField) return;
    const inSurface = $('#surface').contains(document.activeElement) || document.activeElement === document.body;
    if (!inSurface || S.view === 'list' || S.story) return;
    if (surface === globe && globe?.onKey(e)) { e.preventDefault(); return; }
    if (surface === map) {
      const m = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', '+': 'in', '=': 'in', '-': 'out' }[e.key];
      if (m) { map.nav(m); e.preventDefault(); }
    }
  });
  $('#nav').addEventListener('click', (e) => {
    const b = e.target.closest('[data-nav]');
    if (!b) return;
    if (b.dataset.nav === 'back') { climb(); return; }
    if (b.dataset.nav === 'reset') { if (S.unit || S.node) set({ unit: null, node: null }, { push: true }); else surface?.home(); return; }
    surface?.nav(b.dataset.nav);
  });
  for (const b of document.querySelectorAll('.seg-b')) b.addEventListener('click', () => { setView(b.dataset.view); set({}, {}); });
  $('#b-notebook').addEventListener('click', () => ($('#notebook').hidden ? openNotebook() : closeNotebook()));
  $('#brand').addEventListener('click', (e) => { e.preventDefault(); set({ unit: null, node: null, story: null }, { push: true }); });
  window.addEventListener('popstate', () => applyHash(true));
  window.addEventListener('hashchange', () => applyHash(true));
  window.addEventListener('resize', () => { veil?.layout(); });
}

function applyHash(fromNav) {
  const h = parseHash(location.hash);
  if (h.handoff) {
    handleHandoff(h.handoff);
    set({ unit: 'F1.8', node: null, story: null, lens: null, year: null }, { from: 'handoff' });
    return;
  }
  if (fromNav) {
    const cur = { unit: S.unit, node: S.node, story: S.story, lens: S.lens, year: S.year };
    const nxt = { unit: h.unit, node: h.node, story: h.story, lens: h.lens, year: h.year };
    if (JSON.stringify(cur) === JSON.stringify(nxt) && h.view === S.view) return;
    if (h.view !== S.view) setView(h.view, { noFly: true });
    set(nxt, { silentHash: true, from: 'hash' });
    return;
  }
  return h;
}

// ------------------------------------------------------------ boot
async function boot() {
  initPrefs();
  try {
    await loadData();
  } catch (err) {
    $('#panel-inner').innerHTML = '<p class="p-small">The Atlas data could not be loaded. Reload the page to try again.</p>';
    throw err;
  }
  loadInk();
  buildLensBar(); buildTimeBar(); buildLegend();
  bindPanel(panelActions);
  bindLabels(onLabel);
  bindKeys();
  veil = new Veil({
    close: () => set({ story: null, unit: 'F1.8' }, { push: true }),
    pin: (pid) => panelActions.pin(pid),
    covered: () => { $('#globe-host').style.visibility = 'hidden'; $('#map-host').style.visibility = 'hidden'; $('#labels').hidden = true; },
    uncovered: () => { $('#globe-host').style.visibility = ''; $('#map-host').style.visibility = ''; $('#labels').hidden = false; },
  });
  on(react);
  const h = parseHash(location.hash);
  let initial = { unit: h.unit, node: h.node, story: h.story, lens: h.lens, year: h.year };
  if (h.handoff) { handleHandoff(h.handoff); initial = { unit: 'F1.8', node: null, story: null, lens: null, year: null, handoff: true }; }
  Object.assign(S, initial);
  if (S.unit && LENS_DEF[S.unit] && !M.terrById.has(S.unit) && !S.lens) S.lens = S.unit;
  S.view = h.view;
  const want = h.view;
  await setView(want === 'list' ? 'list' : want, { noFly: true });
  if (want === 'list') { await ensureMap(); }
  // the surface starts where the state says
  if (S.story) {
    placeSurfaceForState(true);
    set({ story: null }, { silentHash: true });
    set({ story: 'edo' }, {});
  } else if (S.handoff) {
    delete S.handoff;
    if (surface === globe && globe) { globe.lon = 136; globe.lat = 35; globe.d = globe.fitD * 0.42; globe.invalidate(); } else if (map) map.flyTo([136, 35], 6, 0);
    set({}, {});
  } else if (S.unit || S.node) {
    placeSurfaceForState(true);
    set({}, {});
  } else {
    set({}, {});
    if (surface === globe && globe) {
      const f = S.lens && LENS_FOCUS[S.lens];
      if (f) { globe.lon = f[0]; globe.lat = f[1]; }
      globe.intro();
    }
  }
  window.__atlas = { S, M, INK, set, get globe() { return globe; }, get map() { return map; }, get veil() { return veil; } };
}

boot();

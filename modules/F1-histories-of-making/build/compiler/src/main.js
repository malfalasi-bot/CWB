// Edo Concept Composer, simplified: two views (a Versions gallery and a guided Compose flow) over the same
// constraint model. The feasibility engine still runs underneath; it now only feeds badges, the verdict pill and the summary.
import './styles.css';
import model from '../data/model.json';
import crops from '../data/crops_out.json';
import { createEngine, STATUS } from './engine.js';
import { createStore } from './store.js';
import { $, $$, esc, announce } from './util.js';
import { createGallery } from './gallery.js';
import { createComposer } from './compose.js';

const engine = createEngine(model);
const store = createStore();
const PREFS = 'edo-composer:prefs2';
const prefs = (() => { try { return JSON.parse(localStorage.getItem(PREFS) || '{}'); } catch { return {}; } })();

const v4path = { ...model.paths.v4 };
const state = {
  view: prefs.view || 'versions',
  theme: prefs.theme || null,
  path: { ...v4path },
  borrow: {}, // dim -> [ideaKey]
  notes: {}, // dim -> text
  step: 0,
  cmpWith: {}, // dim -> optId
  gallery: { version: 'v4', beat: 'wave', other: null, mode: 'side' },
};
if (state.theme) document.documentElement.dataset.theme = state.theme;

const app = {
  model, engine, crops, state, store, v4path,
  ctx: () => ({ custom: [], judgments: {} }),
  evaluate: (path = state.path, fast = false) => engine.evaluate(path, app.ctx(), { fast }),
  savePrefs() { try { localStorage.setItem(PREFS, JSON.stringify({ view: state.view, theme: state.theme })); } catch { /* private mode */ } },
  saveDim(dim) {
    store.write('decisions/' + dim, { chosen: state.path[dim], borrow: state.borrow[dim] || [], note: state.notes[dim] || '' });
  },
  saveSession() { store.write('session/state', { step: state.step, view: state.view }); },
  go(view, opts = {}) {
    state.view = view;
    for (const b of $$('.tabs [role=tab]')) b.setAttribute('aria-selected', String(b.dataset.view === view));
    $('#view-versions').hidden = view !== 'versions';
    $('#view-compose').hidden = view !== 'compose';
    if (view === 'versions') gallery.render();
    else composer.render(opts);
    app.savePrefs(); app.saveSession();
    if (opts.scrollTop !== false) window.scrollTo({ top: 0 });
  },
  refreshVerdict() {
    const e = app.evaluate();
    const pill = $('#verdictPill');
    const lvl = e.verdict.level;
    const short = lvl === 'ok' ? 'Buildable' : lvl === 'adapt' ? `Buildable · ${e.counts.adapt} tweak${e.counts.adapt > 1 ? 's' : ''}` : lvl === 'conflict' ? `${e.counts.conflict} clash${e.counts.conflict > 1 ? 'es' : ''}` : 'Incomplete';
    pill.className = 'verdict-pill ' + lvl;
    pill.innerHTML = `${glyphHTML(lvl)}<span>${esc(short)}</span>${e.budget ? `<span class="pill-days">${e.budget.effort.lo}–${e.budget.effort.hi} d</span>` : ''}`;
    pill.setAttribute('aria-label', `${e.verdict.text}. Open the summary.`);
    return e;
  },
  lightbox: null,
};

export function glyphHTML(status, cls = '') {
  const s = STATUS[status] || STATUS.open;
  return `<span class="g ${s.cls} ${cls}" aria-hidden="true"><i>${s.glyph}</i></span>`;
}
app.glyph = glyphHTML;

// ------------------------------------------------------------------ lightbox
// items: [{ src, still, title, sub, poster, box, alt }]; arrows browse the set, a toggle shows a crop in its full screen.
app.lightbox = (() => {
  const dlg = $('#lightbox');
  let items = [], i = 0, ctxMode = false;
  const draw = () => {
    const it = items[i];
    $('#lbTitle').innerHTML = `<strong>${esc(it.title)}</strong>${it.sub ? `<span>${esc(it.sub)}</span>` : ''}<span class="lb-count">${i + 1} / ${items.length}</span>`;
    $('#lbTools').innerHTML = it.poster ? `<div class="seg" role="group" aria-label="View"><button type="button" data-lbm="0" aria-pressed="${!ctxMode}">Close-up</button><button type="button" data-lbm="1" aria-pressed="${ctxMode}">In its page</button></div>` : '';
    const stage = $('#lbStage');
    if (ctxMode && it.poster) {
      const [x0, y0, x1, y1] = it.box;
      stage.innerHTML = `<div class="lb-ctx"><img src="${it.poster}" alt="${esc(it.alt || it.title)}, full screen"><span class="lb-hl" style="left:${x0 * 10}%;top:${y0 * 10}%;width:${(x1 - x0) * 10}%;height:${(y1 - y0) * 10}%"></span></div>`;
    } else {
      stage.innerHTML = it.still
        ? `<picture><source media="(prefers-reduced-motion: reduce)" srcset="${it.still}"><img src="${it.src}" alt="${esc(it.alt || it.title)}"></picture>`
        : `<img src="${it.src}" alt="${esc(it.alt || it.title)}">`;
    }
    $('#lbPrev').hidden = $('#lbNext').hidden = items.length < 2;
  };
  dlg.addEventListener('click', (ev) => {
    const m = ev.target.closest('[data-lbm]');
    if (m) { ctxMode = m.dataset.lbm === '1'; draw(); return; }
    if (ev.target === dlg) dlg.close();
  });
  $('#lbPrev').addEventListener('click', () => { i = (i - 1 + items.length) % items.length; draw(); });
  $('#lbNext').addEventListener('click', () => { i = (i + 1) % items.length; draw(); });
  dlg.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); $('#lbPrev').click(); }
    if (ev.key === 'ArrowRight') { ev.preventDefault(); $('#lbNext').click(); }
  });
  let sx = null;
  $('#lbStage').addEventListener('pointerdown', (e) => { sx = e.clientX; });
  $('#lbStage').addEventListener('pointerup', (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 50 && items.length > 1) (e.clientX < sx ? $('#lbNext') : $('#lbPrev')).click(); sx = null; });
  return {
    open(list, index = 0, opts = {}) { items = list; i = index; ctxMode = !!opts.context; draw(); dlg.showModal(); },
  };
})();

const gallery = createGallery(app, $('#view-versions'));
const composer = createComposer(app, $('#view-compose'));
app.gallery = gallery; app.composer = composer;

// ------------------------------------------------------------------ chrome
for (const b of $$('.tabs [role=tab]')) b.addEventListener('click', () => app.go(b.dataset.view));
$('.tabs').addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  const next = state.view === 'versions' ? 'compose' : 'versions';
  app.go(next); $(`#tab-${next}`).focus();
});
$('#verdictPill').addEventListener('click', () => { state.step = model.dims.length; app.go('compose'); });
$('#themeBtn').addEventListener('click', () => {
  const dark = state.theme ? state.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  state.theme = dark ? 'light' : 'dark';
  document.documentElement.dataset.theme = state.theme;
  app.savePrefs();
  announce(`${state.theme} theme`);
});

// ------------------------------------------------------------------ load saved work, then render
function apply(dim, d) {
  if (!d) return;
  if (d.chosen && engine.byId[d.chosen] && d.chosen !== 'me-custom') state.path[dim] = d.chosen;
  if (Array.isArray(d.borrow)) state.borrow[dim] = d.borrow;
  if (typeof d.note === 'string') state.notes[dim] = d.note;
}
(async () => {
  const local = store.readLocal();
  for (const d of model.dims) apply(d.id, local['decisions/' + d.id]);
  if (local['session/state']?.step != null) state.step = local['session/state'].step;
  const mode = await store.connect();
  if (mode === 'shared') {
    const shared = await store.loadShared();
    if (shared) {
      for (const d of model.dims) apply(d.id, shared.decisions[d.id]);
      if (shared.session?.step != null) state.step = shared.session.step;
    }
    store.subscribe((ev) => {
      if (ev.kind === 'decision') { apply(ev.dim, ev.data); app.refreshVerdict(); if (state.view === 'compose') composer.render({ keepScroll: true }); }
    });
  }
  state.step = Math.max(0, Math.min(model.dims.length, state.step | 0));
  app.saveMode = mode;
  app.refreshVerdict();
  app.go(state.view, { scrollTop: false });
})();

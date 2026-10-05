import './styles.css';
import model from '../data/model.json';
import { createEngine, STATUS, RANK } from './engine.js';
import { createStore } from './store.js';
import { $, $$, esc, glyph, stTag, fmtDays, debounce, seededShuffle, announce, VNAME, QUALITY, IDEA, lvl } from './util.js';
import { renderVersions } from './versions.js';
import { renderLedger } from './ledger.js';
import { renderBlueprint } from './blueprint.js';
import { renderMethods, renderMethodsSummary } from './methods.js';
import { renderBrief } from './brief.js';

const engine = createEngine(model);
const dims = model.dims;
const byId = engine.byId;
const store = createStore();
const PREFS = 'edo-composer:prefs';
const prefs = (() => { try { return JSON.parse(localStorage.getItem(PREFS) || '{}'); } catch { return {}; } })();
const savePrefs = () => { try { localStorage.setItem(PREFS, JSON.stringify({ theme: state.theme, frame: state.frame, capacity: state.capacity, seed: state.seed, lines: state.showPaths })); } catch { /* private mode */ } };

const state = {
  path: { ...model.paths.v4 }, approvals: {}, custom: [], judgments: {}, pass: 2,
  compareA: 'v3', compareB: 'v4', cmpMode: '2up', cmpSolo: 'A', version: 'v4', beat: 'wave', vform: 'd',
  frame: prefs.frame || 'phone', theme: prefs.theme || null, capacity: prefs.capacity || model.budgets.capacityDays,
  seed: prefs.seed || Math.random().toString(36).slice(2, 10), showPaths: prefs.lines || { v4: true },
  openCard: null, expanded: {}, cell: null, repairLog: [], history: [], future: [], showRepairs: false,
  methodsTab: 'catalogue', mf: { family: 'all', evidence: 'all', cost: 'all', q: '', sort: null }, briefRaw: false,
};
if (state.theme) document.documentElement.dataset.theme = state.theme;

const ctx = () => ({ custom: state.custom, judgments: state.judgments });
const app = { model, engine, state, store, ev: null, deltas: {}, ctx, act: {}, rerender: () => refresh() };

// ------------------------------------------------------------------ persistence
function applyDecisionDoc(dim, doc) {
  if (!doc) return;
  if ('chosen' in doc && (doc.chosen === null || byId[doc.chosen]?.dim === dim)) state.path[dim] = doc.chosen;
  if (doc.approvals && typeof doc.approvals === 'object') state.approvals[dim] = doc.approvals;
  if (dim === 'methods' && Array.isArray(doc.custom)) state.custom = doc.custom.filter((m) => model.methods.some((x) => x.id === m));
}
function applySession(doc) {
  if (!doc) return;
  if (doc.pass === 1 || doc.pass === 2) state.pass = doc.pass;
  if (doc.compareA && model.versions.some((v) => v.id === doc.compareA)) state.compareA = doc.compareA;
  if (doc.compareB && model.versions.some((v) => v.id === doc.compareB)) state.compareB = doc.compareB;
  if (Array.isArray(doc.repairLog)) state.repairLog = doc.repairLog.slice(-30);
}
function loadLocal() {
  const local = store.readLocal();
  for (const d of dims) applyDecisionDoc(d.id, local['decisions/' + d.id]);
  applySession(local['session/state']);
  if (local['judgments/pairs']?.pairs) state.judgments = local['judgments/pairs'].pairs;
}
const decisionDoc = (dim) => ({ chosen: state.path[dim] ?? null, approvals: state.approvals[dim] || {}, ...(dim === 'methods' ? { custom: state.custom } : {}) });
function persistDecision(dim, delay) { store.write('decisions/' + dim, decisionDoc(dim), delay).then(setStoreChip); }
function persistSession() { store.write('session/state', { pass: state.pass, compareA: state.compareA, compareB: state.compareB, repairLog: state.repairLog }).then(setStoreChip); }
function persistJudgments() { store.write('judgments/pairs', { pairs: state.judgments }).then(setStoreChip); }
function setStoreChip(result) {
  const chip = $('#storechip');
  if (store.mode === 'shared') { chip.textContent = result === 'failed' ? 'Shared store unavailable: saved on this device' : 'Saved to the shared store'; chip.classList.add('shared'); }
  else { chip.textContent = 'Saved on this device only'; chip.classList.remove('shared'); }
}

// ------------------------------------------------------------------ actions
function pushHistory() { state.history.push(JSON.stringify(state.path)); if (state.history.length > 60) state.history.shift(); state.future = []; }
function changedDims(before) { return dims.filter((d) => before[d.id] !== state.path[d.id]).map((d) => d.id); }
const act = app.act = {
  choose(dim, id) {
    if (state.pass !== 2) { announce('Choosing is part of Pass 2. Switch to Pass 2 · Decide to choose.'); return; }
    if (state.path[dim] === id) return;
    pushHistory(); state.path[dim] = id; persistDecision(dim); refresh(true);
  },
  loadPath(vid) {
    const before = { ...state.path }; pushHistory(); state.path = { ...model.paths[vid] };
    changedDims(before).forEach((d) => persistDecision(d, 150)); refresh(true);
    announce(`Loaded the ${VNAME[vid]} path. ${app.ev.verdict.text}`);
  },
  clearPath() { const before = { ...state.path }; pushHistory(); dims.forEach((d) => { state.path[d.id] = null; }); changedDims(before).forEach((d) => persistDecision(d, 150)); refresh(true); },
  undo() { if (!state.history.length) return; const before = { ...state.path }; state.future.push(JSON.stringify(state.path)); state.path = JSON.parse(state.history.pop()); changedDims(before).forEach((d) => persistDecision(d, 150)); refresh(true); },
  redo() { if (!state.future.length) return; const before = { ...state.path }; state.history.push(JSON.stringify(state.path)); state.path = JSON.parse(state.future.pop()); changedDims(before).forEach((d) => persistDecision(d, 150)); refresh(true); },
  applyRepair(changes, label) {
    const before = { ...state.path }; pushHistory();
    const prevVerdict = app.ev.verdict.text;
    for (const [d, id] of changes) state.path[d] = id;
    state.repairLog.push({ at: new Date().toISOString(), label, changes, from: changes.map(([d]) => [d, before[d]]), verdictBefore: prevVerdict });
    changedDims(before).forEach((d) => persistDecision(d, 150)); persistSession(); refresh(true);
  },
  setApproval(dim, id, value) {
    const a = (state.approvals[dim] = state.approvals[dim] || {});
    const cur = a[id] || { state: null, note: '', borrow: [] };
    cur.state = cur.state === value ? null : value; a[id] = cur;
    persistDecision(dim); refresh();
    if (cur.state === 'reject' && !cur.note) setTimeout(() => $(`#note-${CSS.escape(id)}`)?.focus(), 40);
  },
  setNote: (dim, id, text) => { const a = (state.approvals[dim] = state.approvals[dim] || {}); a[id] = { ...(a[id] || { state: null, borrow: [] }), note: text }; persistDecision(dim, 700); scheduleBrief(); },
  toggleBorrow(dim, id, tag) {
    const a = (state.approvals[dim] = state.approvals[dim] || {});
    const cur = a[id] || { state: null, note: '', borrow: [] };
    cur.borrow = cur.borrow?.includes(tag) ? cur.borrow.filter((t) => t !== tag) : [...(cur.borrow || []), tag];
    a[id] = cur; persistDecision(dim); refresh();
  },
  setJudgment(pk, status, note) { if (status) state.judgments[pk] = { status, note: note || '' }; else delete state.judgments[pk]; persistJudgments(); refresh(); },
  toggleMethod(mid) {
    // Starting a custom mix from a preset mix keeps that mix's methods, so adding one method extends it.
    if (state.path.methods && state.path.methods !== 'me-custom') state.custom = [...(byId[state.path.methods].methods || [])];
    state.custom = state.custom.includes(mid) ? state.custom.filter((m) => m !== mid) : [...state.custom, mid];
    if (state.custom.length && state.path.methods !== 'me-custom') { pushHistory(); state.path.methods = 'me-custom'; announce('Teaching-method mix set to your custom selection.'); }
    persistDecision('methods'); refresh();
  },
  setCustom(ids) {
    state.custom = ids;
    if (ids.length && state.path.methods !== 'me-custom') { pushHistory(); state.path.methods = 'me-custom'; }
    persistDecision('methods'); refresh(true);
  },
  setPass(p) { state.pass = p; persistSession(); refresh(); announce(p === 1 ? 'Pass 1: options shuffled, versions hidden.' : 'Pass 2: versions shown; choose one option per row.'); },
  openCard(id) { state.openCard = state.openCard === id ? null : id; renderBoard(); if (state.openCard) $('#inspector')?.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); },
  selectCell(key) { state.cell = key; renderLedgerAll(); },
  setFrame(f) { state.frame = f; savePrefs(); renderBlueprint(app, $('#blueprint')); },
  setCapacity(n) { state.capacity = Math.max(1, Math.min(200, +n || 15)); savePrefs(); renderLedgerAll(); },
  saveSession: persistSession,
  persistAll() { dims.forEach((d) => persistDecision(d.id, 50)); persistSession(); persistJudgments(); },
  importState(obj) {
    pushHistory();
    if (obj.path) for (const d of dims) if (obj.path[d.id] === null || byId[obj.path[d.id]]?.dim === d.id) state.path[d.id] = obj.path[d.id];
    if (obj.approvals) for (const d of dims) if (obj.approvals[d.id]) state.approvals[d.id] = obj.approvals[d.id];
    if (Array.isArray(obj.custom)) state.custom = obj.custom.filter((m) => model.methods.some((x) => x.id === m));
    if (obj.judgments) state.judgments = obj.judgments;
    act.persistAll(); refresh(true);
  },
};

// ------------------------------------------------------------------ evaluation + header
let sampleCache = null;
function evaluate() {
  app.ev = engine.evaluate(state.path, ctx());
  app.deltas = engine.deltas(state.path, ctx());
}
function worstFor(optId) {
  let w = 'ok';
  for (const c of app.ev.cells) if ((c.a === optId || c.b === optId) && c.status !== 'open' && RANK[c.status] > RANK[w]) w = c.status;
  for (const h of app.ev.house) if (h.opt === optId && RANK[h.status] > RANK[w]) w = h.status;
  return w;
}
app.worstFor = worstFor;
function renderHeader() {
  const { verdict, counts } = app.ev;
  const vEl = $('#verdict');
  vEl.className = 'verdict ' + verdict.level;
  $('#vglyph').innerHTML = glyph(verdict.level === 'open' ? 'open' : verdict.level, 'lg');
  $('#vtext').textContent = verdict.text;
  $('#vcounts').innerHTML = ['ok', 'adapt', 'conflict', 'unjudged'].map((s) => `<span>${glyph(s, 'sm')}<b>${counts[s]}</b><span class="sr-only"> ${STATUS[s].text}</span></span>`).join('')
    + `<span class="muted">/ ${app.ev.cells.filter((c) => c.status !== 'open').length} pairs${app.ev.house.length ? ' + ' + app.ev.house.length + ' rule flag' + (app.ev.house.length > 1 ? 's' : '') : ''}</span>`;
  const all = [...app.ev.cells.filter((c) => c.status !== 'open'), ...app.ev.house].map((c) => c.status).sort((a, b) => RANK[b] - RANK[a]);
  $('#parray').innerHTML = all.map((s) => `<i class="${s}"></i>`).join('');
  $$('#passSeg button').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.pass === state.pass)));
  $('#undoBtn').disabled = !state.history.length; $('#redoBtn').disabled = !state.future.length;
  document.body.dataset.pass = state.pass;
}
const announceVerdict = debounce(() => announce(app.ev.verdict.text + '. ' + ['adapt', 'conflict', 'unjudged'].map((s) => `${app.ev.counts[s]} ${STATUS[s].text.toLowerCase()}`).join(', ') + '.'), 500);

// ------------------------------------------------------------------ board
function orderFor(dim) {
  const list = model.options.filter((o) => o.dim === dim.id);
  return state.pass === 1 ? seededShuffle(list, state.seed + dim.id) : list;
}
function thumbStyle(poster) {
  const t = model.thumbs; const p = poster && t.index[poster];
  if (!p) return null;
  const bx = (p[0] / (t.W - t.w)) * 100, by = (p[1] / (t.H - t.h)) * 100;
  return `background-image:url(thumbs.webp);background-size:${(t.W / t.w) * 100}% auto;background-position:${bx.toFixed(3)}% ${by.toFixed(3)}%`;
}
app.thumbStyle = thumbStyle;
const BEAT_NAMES = { opening: 'Opening', wave: 'Wave beat', map: 'Map beat', timeline: 'Timeline beat', tool: 'Tool beat', person: 'Person beat', question: 'Question beat', nav: 'Navigation', overture: 'Overture' };
function deltaBadge(o) {
  const d = app.deltas[o.id];
  if (!d) return '';
  const parts = [];
  if (d.conflict) parts.push(`<span class="${d.conflict > 0 ? 'c-up' : 'down'}">${d.conflict > 0 ? '+' : '−'}${Math.abs(d.conflict)} ✕</span>`);
  if (d.adapt) parts.push(`<span class="${d.adapt > 0 ? 'a-up' : 'down'}">${d.adapt > 0 ? '+' : '−'}${Math.abs(d.adapt)} ~</span>`);
  return parts.length ? `<span class="delta" aria-hidden="true">${parts.join('')}</span>` : '';
}
function deltaText(o) {
  const d = app.deltas[o.id];
  if (!d || (!d.conflict && !d.adapt)) return 'Swapping to it changes no pair status.';
  const t = [];
  if (d.conflict) t.push(`${d.conflict > 0 ? 'adds' : 'removes'} ${Math.abs(d.conflict)} conflict${Math.abs(d.conflict) > 1 ? 's' : ''}`);
  if (d.adapt) t.push(`${d.adapt > 0 ? 'adds' : 'removes'} ${Math.abs(d.adapt)} adaptation${Math.abs(d.adapt) > 1 ? 's' : ''}`);
  return 'Swapping to it ' + t.join(' and ') + '.';
}
const APPR = { approve: ['✓', 'Approved'], maybe: ['?', 'Maybe'], reject: ['✕', 'Rejected'] };
function cardHTML(dim, o) {
  const chosen = state.path[dim.id] === o.id;
  const ap = state.approvals[dim.id]?.[o.id];
  const blind = state.pass === 1;
  const worst = chosen ? worstFor(o.id) : null;
  const d = app.deltas[o.id];
  const ts = thumbStyle(o.poster);
  const opt = o.id === 'me-custom' ? engine.eff('me-custom', ctx()) : o;
  const thumb = ts ? `<span class="thumb" style="${ts}">${o.posterBeat ? `<span class="beat">${BEAT_NAMES[o.posterBeat]}</span>` : ''}</span>`
    : o.methods ? `<span class="thumb none"><span class="mixchips">${(opt.methods.length ? opt.methods : ['pick methods below']).map((m) => `<span>${esc(m)}</span>`).join('')}</span></span>`
      : `<span class="thumb none"><span>No poster: ${esc(o.quality === 'rough' ? 'specified, not drawn' : 'not built')}</span></span>`;
  const pugh = !blind && o.pugh ? `<span class="pugh" aria-hidden="true">${[...o.pugh].map((c) => `<i class="${c === '+' ? 'p' : c === '-' ? 'm' : ''}">${c === '-' ? '−' : c}</i>`).join('')}</span>` : '';
  const vers = !blind ? o.sourceVersions.map((v) => `<span class="vbadge">${VNAME[v]}</span>`).join('') || '<span class="vbadge">new</span>' : '';
  const label = `${o.label}. ${chosen ? `Chosen; ${STATUS[worst].text.toLowerCase()} with the rest of the path. ` : deltaText(o) + ' '}${ap?.state ? APPR[ap.state][1] + '. ' : ''}Idea ${o.idea}; build quality ${o.quality}.${!blind && o.sourceVersions.length ? ' From ' + o.sourceVersions.map((v) => VNAME[v]).join(', ') + '.' : ''}`;
  const cls = ['card', chosen ? 'is-chosen' : '', state.openCard === o.id ? 'is-open' : '', d?.conflict > 0 ? 'would-conflict' : '', ap?.state === 'reject' ? 'rejected' : ''].join(' ');
  const role = state.pass === 2 ? `role="radio" aria-checked="${chosen}"` : `aria-expanded="${state.openCard === o.id}"`;
  return `<button type="button" class="${cls}" ${role} data-opt="${o.id}" data-dim="${dim.id}" tabindex="-1" aria-label="${esc(label)}">
    ${chosen ? `<span class="node">${glyph(worst)}</span>` : deltaBadge(o)}
    ${thumb}
    <span class="c-body">
      <span class="c-label">${esc(o.label)}</span>
      <span class="c-meta">${vers}<span>${o.effort} · ${fmtDays(...(opt.budget?.days || [0, 0]))}</span></span>
      <span class="c-iq"><span>idea</span>${lvl(IDEA[o.idea] || 0)}<span>build</span>${lvl(QUALITY[o.quality] || 0)}</span>
      ${pugh}
      ${ap?.state ? `<span class="c-appr">${APPR[ap.state][0]} ${APPR[ap.state][1]}${ap.note ? ' · note' : (ap.state === 'reject' ? ' · <span class="req">reason needed</span>' : '')}</span>` : ''}
    </span>
  </button>`;
}
function renderBoard() {
  const board = $('#board');
  const focusId = document.activeElement?.closest?.('#board') ? document.activeElement.dataset.opt || document.activeElement.id : null;
  board.innerHTML = dims.map((dim) => {
    const list = orderFor(dim);
    const chosenId = state.path[dim.id];
    const chosen = chosenId ? byId[chosenId] : null;
    const worst = chosen ? worstFor(chosenId) : 'open';
    const ap = state.approvals[dim.id] || {};
    const counts = ['approve', 'maybe', 'reject'].map((k) => [k, Object.values(ap).filter((x) => x.state === k).length]).filter(([, n]) => n);
    const missing = Object.entries(ap).filter(([id, x]) => x.state === 'reject' && !x.note).length;
    const whyMissing = chosen && state.pass === 2 && !ap[chosenId]?.note;
    const open = state.openCard && byId[state.openCard]?.dim === dim.id;
    return `<div class="row ${state.expanded[dim.id] ? 'expanded' : ''}" id="dim-${dim.id}" data-dim="${dim.id}">
      <span class="rnode" aria-hidden="true">${glyph(worst)}</span>
      <div class="row-head">
        <div class="row-title"><span class="code" aria-hidden="true">${dim.code}</span><h3 id="h-${dim.id}">${esc(dim.label)}</h3></div>
        <p class="qoc">${esc(dim.question)}</p>
        <div class="crit" aria-label="Criteria">${dim.criteria.map((c) => `<span class="chip" title="${esc(model.criteria[c].q)}">${esc(model.criteria[c].label)}</span>`).join('')}</div>
        <p class="row-chosen-sum small">${chosen ? `<b>${esc(chosen.label)}</b>` : '<i>Nothing chosen</i>'}</p>
        <p class="row-state">${stTag(worst === 'open' ? 'open' : worst)}${counts.map(([k, n]) => `<span>· ${n} ${APPR[k][1].toLowerCase()}</span>`).join('')}${missing ? `<span class="req">· ${missing} reason${missing > 1 ? 's' : ''} missing</span>` : ''}${whyMissing ? '<span>· choice not yet explained</span>' : ''}</p>
        <button type="button" class="btn small alts-toggle" aria-expanded="${!!state.expanded[dim.id]}" data-toggle="${dim.id}">${state.expanded[dim.id] ? 'Hide options' : `All ${list.length} options`}</button>
      </div>
      <div class="cards" role="${state.pass === 2 ? 'radiogroup' : 'group'}" aria-labelledby="h-${dim.id}">${list.map((o) => cardHTML(dim, o)).join('')}</div>
      ${open ? inspectorHTML(byId[state.openCard]) : ''}
    </div>`;
  }).join('');
  // roving tabindex: one tab stop per row (chosen card or first)
  for (const row of $$('.row', board)) {
    const cards = $$('.card', row);
    const target = cards.find((c) => c.classList.contains('is-chosen')) || cards[0];
    if (target) target.tabIndex = 0;
  }
  if (focusId) {
    const f = board.querySelector(`[data-opt="${CSS.escape(focusId)}"].card`) || document.getElementById(focusId);
    if (f) { $$('.card', f.closest('.row') || board).forEach((c) => { c.tabIndex = -1; }); if (f.classList.contains('card')) f.tabIndex = 0; f.focus({ preventScroll: true }); }
  }
  requestAnimationFrame(drawPaths);
}
function inspectorHTML(o) {
  const dim = dims.find((d) => d.id === o.dim);
  const blind = state.pass === 1;
  const ap = state.approvals[dim.id]?.[o.id] || { state: null, note: '', borrow: [] };
  const chosen = state.path[dim.id] === o.id;
  const opt = o.id === 'me-custom' ? engine.eff('me-custom', ctx()) : o;
  const needNote = (ap.state === 'reject' || chosen) && !ap.note;
  const vsrc = o.sourceVersions.map((v) => model.versions.find((x) => x.id === v)).filter(Boolean);
  // requirement / conflict status against the current path
  const tagsNow = new Set(); for (const d of dims) { const id = state.path[d.id]; if (id && d.id !== o.dim) (engine.eff(id, ctx()).provides || []).forEach((t) => tagsNow.add(t)); }
  const reqs = (opt.requires || []).map((r) => {
    const met = r.need.some((t) => tagsNow.has(t));
    const alt = !met && r.alt && r.alt.tags.some((t) => tagsNow.has(t));
    const st = met ? 'ok' : alt ? r.alt.level : (state.path[r.from] ? r.level : 'open');
    return `<li>${glyph(st)}<span><b>Needs from ${esc(dims.find((d) => d.id === r.from).label.toLowerCase())}:</b> ${esc(met ? 'met by the current path.' : (alt ? r.alt.reason : r.reason))}</span></li>`;
  });
  const cons = (opt.conflicts || []).map((c) => {
    const hit = [...tagsNow].includes(c.tag);
    return hit ? `<li>${glyph(c.level)}<span><b>Clashes with the current path:</b> ${esc(c.reason)}</span></li>` : '';
  }).filter(Boolean);
  const house = (opt.house || []).map((h) => `<li>${glyph(h.status)}<span><b>House rule (${esc(model.houseRules[h.rule])}):</b> ${esc(h.reason)}</span></li>`);
  const poster = o.poster ? `<button type="button" class="poster-open" data-poster="${o.poster}" aria-label="Open the poster full size"><img src="${o.poster}" alt="Screenshot from ${esc(blind ? 'this option' : o.sourceVersions.map((v) => VNAME[v]).join(', '))}${o.posterBeat ? ', ' + BEAT_NAMES[o.posterBeat] : ''}" loading="lazy"></button><p class="small muted">${o.posterBeat ? `Same frame as the other cards in this row: ${BEAT_NAMES[o.posterBeat]}.` : 'Closest available poster; no version has this beat.'}</p>` : '<p class="small muted">No poster: this option was specified but never drawn.</p>';
  const borrowTags = [...new Set([...(o.borrow || []), ...(ap.borrow || [])])];
  return `<div class="inspector panel" id="inspector" role="region" aria-label="Details: ${esc(o.label)}">
    <button type="button" class="btn small close-x" data-close>Close</button>
    <div class="ins-poster">${poster}
      <div class="small"><span class="eyebrow">Idea vs execution</span><p>Idea: <b>${o.idea}</b> ${lvl(IDEA[o.idea] || 0)} · Execution: <b>${o.quality}</b> ${lvl(QUALITY[o.quality] || 0)}</p><p class="muted">Judge the idea apart from how well a version built it.</p></div>
    </div>
    <div>
      <p class="eyebrow">${esc(dim.label)}${blind ? '' : ' · ' + (o.sourceVersions.map((v) => VNAME[v]).join(', ') || 'new')}</p>
      <h3>${esc(o.label)}</h3>
      <dl class="kv">
        <dt>What</dt><dd>${esc(opt.what)}${opt.methods?.length && o.id === 'me-custom' ? ' Selected: ' + esc(opt.methods.join(', ')) + '.' : ''}</dd>
        <dt>Why</dt><dd>${esc(o.why)}</dd>
        <dt>Worked</dt><dd>${esc(o.worked)}</dd>
        <dt>Weak</dt><dd>${esc(o.weaknesses)}</dd>
        <dt>Effort</dt><dd>${fmtDays(...opt.budget.days)} from today’s v4 code (original size ${o.effort}); +${opt.budget.files} files, ≈${opt.budget.js} KB JS</dd>
        ${!blind && vsrc.length ? `<dt>Sources</dt><dd class="small">${vsrc.map((v) => `${VNAME[v.id]}: <span class="mono">${esc(v.source)}</span>`).join('<br>')}</dd>` : ''}
      </dl>
      <h4 style="margin-top:14px">In this path</h4>
      <ul class="need-list">${[...reqs, ...cons, ...house].join('') || '<li>' + glyph('ok') + '<span>No requirements or clashes.</span></li>'}</ul>
    </div>
    <div class="ins-dec">
      <div><p class="eyebrow">Your review</p>
        <div class="seg approve" role="group" aria-label="Approval">${['approve', 'maybe', 'reject'].map((k) => `<button type="button" data-appr="${k}" data-v="${k}" aria-pressed="${ap.state === k}">${APPR[k][1].replace('Approved', 'Approve').replace('Rejected', 'Reject')}</button>`).join('')}</div>
      </div>
      ${state.pass === 2 ? `<div><button type="button" class="btn ${chosen ? 'accent' : ''}" data-choose aria-pressed="${chosen}">${chosen ? '✓ Chosen for the final concept' : 'Choose for the final concept'}</button></div>` : '<p class="small muted">Choosing opens in Pass 2.</p>'}
      <div><label for="note-${o.id}">Note${needNote ? ' <span class="req">(a reason is required for ' + (ap.state === 'reject' ? 'a Reject' : 'the chosen option') + ')</span>' : ''}</label>
        <textarea id="note-${o.id}" data-note aria-required="${ap.state === 'reject' || chosen}" placeholder="Why approve, reject or choose this?">${esc(ap.note || '')}</textarea></div>
      <div><p class="eyebrow">Borrow details</p><p class="small muted">Keep a detail from this option even if another is chosen.</p>
        <div class="borrow">${borrowTags.map((t) => `<button type="button" class="chip" data-borrow="${esc(t)}" aria-pressed="${!!ap.borrow?.includes(t)}">${esc(t)}</button>`).join('') || '<span class="small muted">None listed.</span>'}</div></div>
      ${!blind && o.pugh ? `<div><p class="eyebrow">Against v4 (Pugh)</p><table class="pugh-table">${dim.criteria.map((c, i) => `<tr><th scope="row">${esc(model.criteria[c].label)}</th><td class="v">${o.pugh[i] === '-' ? '−' : o.pugh[i]}</td><td class="small muted">${o.pugh[i] === '+' ? 'better than v4' : o.pugh[i] === '-' ? 'worse than v4' : 'same as v4'}</td></tr>`).join('')}</table></div>` : ''}
    </div>
  </div>`;
}

// path lines
function centerOf(card, wrapBox) {
  const r = (card.querySelector('.thumb') || card).getBoundingClientRect();
  return [r.left - wrapBox.left + r.width / 2, r.top - wrapBox.top + r.height / 2];
}
let ghost = null;
function drawPaths() {
  const svg = $('#pathSvg'), wrap = $('#boardWrap');
  if (!svg || getComputedStyle(svg).display === 'none') return;
  const box = wrap.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
  const pts = (p) => dims.map((d) => { const id = p[d.id]; const c = id && wrap.querySelector(`.card[data-opt="${CSS.escape(id)}"]`); return c ? centerOf(c, box) : null; }).filter(Boolean);
  const line = (arr) => arr.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  let out = '';
  if (state.pass === 2) {
    for (const v of ['v0', 'v1', 'v2', 'v3', 'atlas']) if (state.showPaths[v]) { const a = pts(model.paths[v]); if (a.length) out += `<path class="p-ver" d="${line(a)}"/><text x="${a[a.length - 1][0] + 8}" y="${a[a.length - 1][1] + 16}">${VNAME[v]}</text>`; }
    if (state.showPaths.v4 !== false) { const a = pts(model.paths.v4); if (a.length) out += `<path class="p-v4" d="${line(a)}"/><text x="${a[a.length - 1][0] + 8}" y="${a[a.length - 1][1] + 28}">v4</text>`; }
  }
  const mine = pts(state.path);
  if (mine.length) out += `<path class="p-chosen" d="${line(mine)}"/><text x="${mine[0][0] + 8}" y="${mine[0][1] - 52}">your path</text>`;
  if (ghost) {
    const p = { ...state.path, [ghost.dim]: ghost.id };
    const g = pts(p);
    if (g.length) out += `<path class="p-ghost" d="${line(g)}"/>`;
  }
  svg.innerHTML = out;
}

function renderToolbar() {
  const n = app.ev.counts.conflict;
  $('#boardTools').innerHTML = `
    <div class="grp" role="group" aria-label="Load a version’s path"><span class="small muted">Load a path:</span>${Object.keys(model.paths).map((v) => `<button type="button" class="btn small" data-load="${v}">${VNAME[v]}</button>`).join('')}<button type="button" class="btn small" data-clear>Clear</button></div>
    ${state.pass === 2 ? `<div class="grp" role="group" aria-label="Show other versions’ paths"><span class="small muted">Lines:</span>${['v4', 'v3', 'v2', 'v1', 'v0', 'atlas'].map((v) => `<button type="button" class="chip" data-line="${v}" aria-pressed="${v === 'v4' ? state.showPaths.v4 !== false : !!state.showPaths[v]}">${VNAME[v]}</button>`).join('')}</div>` : '<span class="small muted">Blind pass: versions, v4’s line and Pugh scores are hidden; cards are shuffled.</span>'}
    <button type="button" class="btn small ${n ? 'primary' : ''}" data-repairs aria-expanded="${state.showRepairs}" ${n ? '' : 'disabled'}>${n ? `Show repairs for ${n} conflict${n > 1 ? 's' : ''}` : 'No conflicts to repair'}</button>
    <span class="solspace" id="solspace">${sampleCache ? solText() : 'Estimating how much of the space is buildable…'}</span>`;
}
function solText() {
  const s = sampleCache;
  return `≈${Math.round(s.share * 100)}% of ${(s.total / 1e6).toFixed(0)} million combinations are conflict-free (estimate from ${s.n.toLocaleString()} random paths)`;
}
function renderRepairs() {
  const box = $('#repairsBox');
  if (!state.showRepairs || !app.ev.counts.conflict) { box.innerHTML = ''; return; }
  const prefsA = {}; for (const d of dims) for (const [id, a] of Object.entries(state.approvals[d.id] || {})) if (a.state) prefsA[id] = a.state;
  const list = engine.repairs(state.path, ctx(), { approvals: prefsA });
  box.innerHTML = `<div class="panel repairs"><h3>Smallest changes that clear every conflict</h3>
    <p class="small muted">Searched every single swap, then every pair of swaps. Ranked by fewest changes, then fewest adaptations, then your approvals and closeness to v4.</p>
    ${list.length ? `<ol>${list.map((r, i) => `<li>${r.changes.map(([d, id]) => `<b>${esc(dims.find((x) => x.id === d).label)}</b> → ${esc(byId[id].label)}`).join(' and ')} <span class="muted">(then ${r.counts.adapt} adaptation${r.counts.adapt === 1 ? '' : 's'}${r.counts.unjudged ? `, ${r.counts.unjudged} unjudged` : ''})</span><button type="button" class="btn small" data-apply="${i}">Apply</button></li>`).join('')}</ol>` : '<p>No repair of one or two swaps clears every conflict. Change more than two decisions, or judge the conflicting pairs yourself in the ledger.</p>'}</div>`;
  box._list = list;
}

// ------------------------------------------------------------------ orchestration
function renderLedgerAll() { renderLedger(app, $('#ledger')); }
const scheduleBrief = debounce(() => renderBrief(app, $('#briefBody')), 250);
app.scheduleBrief = scheduleBrief;
function refresh(announceIt) {
  evaluate();
  renderHeader();
  renderToolbar();
  renderRepairs();
  renderBoard();
  renderLedgerAll();
  renderBlueprint(app, $('#blueprint'));
  renderMethodsSummary(app);
  renderVersions(app, $('#versionsBody'), { light: true });
  scheduleBrief();
  if (announceIt) announceVerdict();
}
app.refresh = refresh;

// ------------------------------------------------------------------ events
function bindEvents() {
  $('#passSeg').addEventListener('click', (e) => { const b = e.target.closest('button[data-pass]'); if (b) act.setPass(+b.dataset.pass); });
  $('#undoBtn').addEventListener('click', act.undo);
  $('#redoBtn').addEventListener('click', act.redo);
  $('#themeBtn').addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    state.theme = dark ? 'light' : 'dark'; document.documentElement.dataset.theme = state.theme; savePrefs();
    $('#themeBtn').setAttribute('aria-label', `Switch to ${dark ? 'dark' : 'light'} theme`);
  });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.target.closest('textarea, input')) { e.preventDefault(); e.shiftKey ? act.redo() : act.undo(); }
  });
  $('#boardTools').addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.load) act.loadPath(t.dataset.load);
    else if ('clear' in t.dataset) act.clearPath();
    else if (t.dataset.line) { const v = t.dataset.line; state.showPaths[v] = v === 'v4' ? state.showPaths.v4 === false : !state.showPaths[v]; savePrefs(); renderToolbar(); drawPaths(); }
    else if ('repairs' in t.dataset) { state.showRepairs = !state.showRepairs; renderToolbar(); renderRepairs(); }
  });
  $('#repairsBox').addEventListener('click', (e) => {
    const b = e.target.closest('[data-apply]'); if (!b) return;
    const r = $('#repairsBox')._list[+b.dataset.apply];
    act.applyRepair(r.changes, 'Repair: ' + r.changes.map(([d, id]) => `${dims.find((x) => x.id === d).label} → ${byId[id].label}`).join('; '));
    announce('Repair applied. ' + app.ev.verdict.text);
  });
  const board = $('#board');
  board.addEventListener('click', (e) => {
    const tg = e.target.closest('[data-toggle]');
    if (tg) { const d = tg.dataset.toggle; state.expanded[d] = !state.expanded[d]; renderBoard(); $(`[data-toggle="${d}"]`)?.focus(); return; }
    const card = e.target.closest('.card');
    if (card) {
      const { opt, dim } = card.dataset;
      if (state.pass === 2 && state.path[dim] !== opt) { state.openCard = opt; act.choose(dim, opt); }
      else act.openCard(opt);
      return;
    }
    const ins = e.target.closest('#inspector'); if (!ins) return;
    const o = byId[state.openCard];
    if (e.target.closest('[data-close]')) { const id = state.openCard; state.openCard = null; renderBoard(); board.querySelector(`.card[data-opt="${CSS.escape(id)}"]`)?.focus(); }
    else if (e.target.closest('[data-appr]')) act.setApproval(o.dim, o.id, e.target.closest('[data-appr]').dataset.appr);
    else if (e.target.closest('[data-choose]')) { if (state.path[o.dim] !== o.id) act.choose(o.dim, o.id); }
    else if (e.target.closest('[data-borrow]')) act.toggleBorrow(o.dim, o.id, e.target.closest('[data-borrow]').dataset.borrow);
    else if (e.target.closest('[data-poster]')) openPoster(e.target.closest('[data-poster]').dataset.poster, o.label);
  });
  board.addEventListener('input', (e) => { if (e.target.matches('[data-note]')) { const o = byId[state.openCard]; act.setNote(o.dim, o.id, e.target.value); } });
  board.addEventListener('change', (e) => { if (e.target.matches('[data-note]')) { renderHeader(); const row = e.target.closest('.row'); if (row) { /* refresh row state text without losing focus */ } } });
  board.addEventListener('keydown', (e) => {
    const card = e.target.closest('.card'); if (!card) return;
    const cards = $$('.card', card.closest('.cards'));
    const i = cards.indexOf(card);
    let j = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % cards.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + cards.length) % cards.length;
    else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = cards.length - 1;
    else if (e.key === 'Escape' && state.openCard) { state.openCard = null; renderBoard(); return; }
    if (j === null) return;
    e.preventDefault();
    cards.forEach((c) => { c.tabIndex = -1; }); cards[j].tabIndex = 0; cards[j].focus();
  });
  const preview = (card) => {
    if (!card) { ghost = null; $('#preview').textContent = ''; drawPaths(); return; }
    const { opt, dim } = card.dataset;
    if (state.path[dim] === opt) { ghost = null; $('#preview').textContent = `${byId[opt].label}: chosen.`; drawPaths(); return; }
    const d = app.deltas[opt]; ghost = { dim, id: opt }; drawPaths();
    $('#preview').textContent = d ? `If you swap ${dims.find((x) => x.id === dim).label.toLowerCase()} to “${byId[opt].label}”: ${d.verdict.text}` : '';
  };
  board.addEventListener('mouseover', (e) => { const c = e.target.closest('.card'); if (c && c.dataset.opt !== ghost?.id) preview(c); });
  board.addEventListener('mouseleave', () => preview(null));
  board.addEventListener('focusin', (e) => { const c = e.target.closest('.card'); preview(c || null); });
  board.addEventListener('focusout', (e) => { if (!board.contains(e.relatedTarget)) preview(null); });
  new ResizeObserver(debounce(drawPaths, 60)).observe($('#boardWrap'));
  addEventListener('hashchange', () => routeHash());
}
function openPoster(src, label) {
  const dlg = $('#posterDialog');
  $('#posterDialogImg').src = src; $('#posterDialogImg').alt = 'Full-size poster: ' + label;
  $('#posterDialogTitle').textContent = label;
  dlg.showModal();
}
app.openPoster = openPoster;

function routeHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (!h) return;
  if (model.paths[h] || model.versions.some((v) => v.id === h)) {
    state.version = h; renderVersions(app, $('#versionsBody'));
    $('#versions').scrollIntoView(); return;
  }
  if (h.startsWith('dim-')) {
    const d = h.slice(4);
    if (dims.some((x) => x.id === d)) { state.expanded[d] = true; renderBoard(); document.getElementById(h)?.scrollIntoView(); }
    return;
  }
  if (h.startsWith('m-')) { state.methodsTab = 'catalogue'; renderMethods(app, $('#methodsBody'), { open: h.slice(2) }); document.getElementById(h)?.scrollIntoView(); return; }
  if (h === 'ledger' || h === 'blueprint') { document.getElementById(h)?.scrollIntoView(); return; }
  if (['heatmap', 'units', 'catalogue'].includes(h)) { state.methodsTab = h; renderMethods(app, $('#methodsBody')); $('#methods').scrollIntoView(); }
}

// ------------------------------------------------------------------ boot
loadLocal();
evaluate();
bindEvents();
refresh();
renderVersions(app, $('#versionsBody'));
renderMethods(app, $('#methodsBody'));
$('#footNote').textContent = `Model built ${model.built} from data/versions.json, data/options_seed.json and the methods study: ${model.dims.length} dimensions, ${model.options.length} options, ${model.ruleCount} authored rules, ${model.methods.length} methods, ${model.units.length} F1 units.`;
setStoreChip();
routeHash();
const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 400));
idle(() => { sampleCache = engine.sample({ custom: state.custom, judgments: {} }, 2000); const s = $('#solspace'); if (s) s.textContent = solText(); });

(async () => {
  const mode = await store.connect();
  setStoreChip();
  if (mode !== 'shared') return;
  const shared = await store.loadShared();
  if (shared) {
    for (const d of dims) if (shared.decisions[d.id]) applyDecisionDoc(d.id, shared.decisions[d.id]);
    applySession(shared.session);
    if (shared.judgments?.pairs) state.judgments = shared.judgments.pairs;
    refresh();
  }
  store.subscribe((msg) => {
    const typing = document.activeElement?.matches?.('textarea, input');
    if (msg.kind === 'decision') applyDecisionDoc(msg.dim, msg.data);
    else if (msg.kind === 'session') applySession(msg.data);
    else if (msg.kind === 'judgments') state.judgments = msg.data.pairs || {};
    if (!typing) refresh(); else { evaluate(); renderHeader(); }
  });
})();

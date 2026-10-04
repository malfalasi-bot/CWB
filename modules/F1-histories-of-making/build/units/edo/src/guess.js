// Guesses: one optional prompt late in a scene, answered on the instrument or inline, then "What actually happened".
// Your answer is a ghost (hollow, 40% ink); the record is solid ink. Nothing is ever marked right or wrong in colour,
// nothing is scored, and scrolling past an unanswered guess simply shows the record.
import { el, esc, motion, fmtNum } from './util.js';

const CONF = ['Guessing', 'Unsure', 'Fairly sure', 'Sure'];
const sig2 = (v) => { if (v <= 0) return 0; const p = Math.pow(10, Math.floor(Math.log10(v)) - 1); return Math.round(v / p) * p; };
const yr = (y) => String(Math.floor(y));
let uid = 0;

// ---------------- formatting (shared with the coda)
export function fmtValue(g, v, MARKS) {
  if (v == null) return '—';
  if (g.type === 'slider') return `${fmtNum(v)} ${g.unit}`;
  if (g.type === 'timeline') return yr(v);
  if (g.type === 'map') { const o = g.options.find((x) => x.id === v); return o ? o.label : String(v); }
  if (g.type === 'tap') return (Array.isArray(v) ? v : [v]).map((i) => (MARKS?.[g.marks]?.[i]?.label || `mark ${i + 1}`).split(':')[0]).join(' + ');
  if (g.type === 'choice' || g.type === 'bet') return g.options[v] ?? '—';
  if (g.type === 'order') return v.map((i) => g.items[i].label).join(' → ');
  return String(v);
}
export function fmtTruth(g, MARKS) {
  if (g.type === 'slider') return g.truthLabel;
  if (g.type === 'timeline') return yr(g.truth);
  if (g.type === 'map') { const t = g.primary || [].concat(g.truth)[0]; return g.options.find((o) => o.id === t)?.label || t; }
  if (g.type === 'tap') return fmtValue(g, g.truth, MARKS);
  if (g.type === 'choice' || g.type === 'bet') return g.options[g.truth];
  if (g.type === 'order') return truthOrder(g.items).map((i) => g.items[i].label).join(' → ');
  return '';
}
export const truthOrder = (items) => items.map((_, i) => i).sort((a, b) => items[a].year - items[b].year);

// a stable shuffle that never starts in the true order
export function shuffled(items, seed = 'edo') {
  let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0;
  const rnd = () => { h = (h * 1103515245 + 12345) & 0x7fffffff; return h / 0x7fffffff; };
  const idx = items.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  const t = truthOrder(items);
  if (idx.every((v, i) => v === t[i])) idx.push(idx.shift());
  return idx;
}

// ---------------- a value track (slider guesses, and the timeline fallback)
function track(g, { label, onInput }) {
  const log = g.scale === 'log';
  const lo = g.min, hi = g.max, step = g.step || (log ? 0 : 1);
  const toT = (v) => (log ? (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)) : (v - lo) / (hi - lo));
  const quant = (v) => { v = log ? (v >= 10 ? sig2(v) : Math.round(v)) : Math.round(v / step) * step; return Math.max(lo, Math.min(hi, v)); };
  const fromT = (t) => { t = Math.max(0, Math.min(1, t)); return quant(log ? Math.exp(Math.log(lo) + t * (Math.log(hi) - Math.log(lo))) : lo + t * (hi - lo)); };
  const fmt = g.fmt || ((v) => `${fmtNum(v)}${g.unit ? ' ' + g.unit : ''}`);
  let pos = g.start != null ? toT(g.start) : 0.5, touched = false, locked = false;
  const val = () => fromT(pos);
  const thumb = el('div', { class: 'gs-thumb' }, el('span', { class: 'gs-val' }));
  const ghost = el('div', { class: 'gs-ghost', hidden: true }, el('span', { class: 'gs-glab', text: 'You' }));
  const truth = el('div', { class: 'gs-truth', hidden: true }, el('span', { class: 'gs-tlab' }));
  const ticks = el('div', { class: 'gs-ticks', 'aria-hidden': 'true' });
  const tickVals = log ? Array.from({ length: Math.round(Math.log10(hi / lo)) + 1 }, (_, i) => lo * Math.pow(10, i)).filter((t) => t <= hi * 1.001)
    : Array.from({ length: 5 }, (_, i) => lo + (i * (hi - lo)) / 4).map((t) => Math.round(t / (step || 1)) * (step || 1));
  const short = (t) => (g.tick ? g.tick(t) : t >= 1e6 ? `${t / 1e6}M` : t >= 1e3 ? `${t / 1e3}k` : String(t));
  tickVals.forEach((t) => ticks.append(el('span', { style: `left:${toT(t) * 100}%`, text: short(t) })));
  const rail = el('div', { class: 'gs-rail' }, el('i', { class: 'gs-fill' }));
  const box = el('div', { class: 'gs-track', role: 'slider', tabindex: '0', 'aria-label': label, 'aria-valuemin': String(lo), 'aria-valuemax': String(hi) }, rail, ticks, truth, ghost, thumb);
  const paint = () => {
    const v = val(), t = log ? pos : toT(v);
    thumb.style.left = `${t * 100}%`; rail.firstChild.style.transform = `scaleX(${t})`;
    thumb.firstChild.textContent = fmt(v);
    box.setAttribute('aria-valuenow', String(v)); box.setAttribute('aria-valuetext', fmt(v));
    box.classList.toggle('touched', touched);
  };
  const setPos = (t) => { if (locked) return; pos = Math.max(0, Math.min(1, t)); touched = true; paint(); onInput?.(val()); };
  const fromX = (x) => { const r = box.getBoundingClientRect(); return (x - r.left) / r.width; };
  let drag = false;
  box.addEventListener('pointerdown', (e) => { if (locked) return; drag = true; box.setPointerCapture(e.pointerId); box.classList.add('drag'); setPos(fromX(e.clientX)); });
  box.addEventListener('pointermove', (e) => { if (drag) setPos(fromX(e.clientX)); });
  const up = () => { drag = false; box.classList.remove('drag'); };
  box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
  box.addEventListener('keydown', (e) => {
    if (locked) return;
    const big = e.key === 'PageUp' || e.key === 'PageDown' || e.shiftKey;
    const dir = { ArrowRight: 1, ArrowUp: 1, PageUp: 1, ArrowLeft: -1, ArrowDown: -1, PageDown: -1 }[e.key];
    if (dir) {
      e.preventDefault();
      if (log) setPos(pos + (big ? 0.1 : 1 / 60) * dir);
      else { const v = Math.max(lo, Math.min(hi, val() + (big ? Math.max(step * 10, Math.round((hi - lo) / 10)) : step) * dir)); setPos(toT(v)); }
    } else if (e.key === 'Home') { e.preventDefault(); setPos(0); } else if (e.key === 'End') { e.preventDefault(); setPos(1); }
  });
  paint();
  return {
    el: box,
    get value() { return val(); }, get touched() { return touched; },
    lock(v) { locked = true; box.classList.add('locked'); box.setAttribute('aria-disabled', 'true'); if (v != null) { pos = toT(v); paint(); } },
    unlock() { locked = false; box.classList.remove('locked', 'revealed'); box.removeAttribute('aria-disabled'); ghost.hidden = true; truth.hidden = true; touched = false; pos = g.start != null ? toT(g.start) : 0.5; paint(); },
    reveal(mine, t, tLabel) {
      box.classList.add('revealed');
      if (mine != null) { ghost.hidden = false; ghost.style.left = `${toT(mine) * 100}%`; ghost.title = `Your answer: ${fmt(mine)}`; }
      truth.hidden = false; truth.style.left = `${toT(t) * 100}%`; truth.firstChild.textContent = tLabel;
      if (!motion.reduced) { truth.animate([{ transform: 'translateX(-50%) scaleY(0)', opacity: 0 }, { transform: 'translateX(-50%) scaleY(1)', opacity: 1 }], { duration: 400, easing: 'cubic-bezier(0.05,0.7,0.1,1)' }); }
    },
  };
}

// ---------------- an orderable list (order guesses and the coda)
export function orderList(items, { seed = 'o', label = 'Order', onChange, live } = {}) {
  let ord = shuffled(items, seed), locked = false;
  const list = el('ol', { class: 'ord', 'aria-label': label });
  const say = (m) => live?.(m);
  const nodes = new Map();
  items.forEach((it, i) => {
    const up = el('button', { type: 'button', class: 'ord-mv', 'aria-label': `Move “${it.label}” earlier` }, '↑');
    const dn = el('button', { type: 'button', class: 'ord-mv', 'aria-label': `Move “${it.label}” later` }, '↓');
    const li = el('li', { class: 'ord-item', tabindex: '0', 'aria-roledescription': 'sortable item', 'data-i': String(i) },
      el('span', { class: 'ord-grip', 'aria-hidden': 'true' }, el('i'), el('i'), el('i')),
      el('span', { class: 'ord-n', 'aria-hidden': 'true' }),
      el('span', { class: 'ord-lab', text: it.label }),
      el('span', { class: 'ord-truth', 'aria-hidden': 'true' }),
      el('span', { class: 'ord-btns' }, up, dn));
    up.addEventListener('click', () => move(i, -1, up)); dn.addEventListener('click', () => move(i, 1, dn));
    li.addEventListener('keydown', (e) => {
      if (e.target !== li || locked) return;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); move(i, e.key === 'ArrowUp' ? -1 : 1, li); }
    });
    nodes.set(i, li);
  });
  function render(flip = true) {
    const first = new Map([...nodes].map(([i, n]) => [i, n.getBoundingClientRect().top]));
    ord.forEach((i, k) => { const n = nodes.get(i); n.querySelector('.ord-n').textContent = k + 1; list.append(n); });
    if (flip && !motion.reduced) nodes.forEach((n, i) => { const d = first.get(i) - n.getBoundingClientRect().top; if (d && Math.abs(d) < 600) n.animate([{ transform: `translateY(${d}px)` }, { transform: 'none' }], { duration: 200, easing: 'cubic-bezier(0.2,0,0,1)' }); });
  }
  function move(i, d, focusEl) {
    if (locked) return;
    const k = ord.indexOf(i), j = k + d; if (j < 0 || j >= ord.length) return;
    [ord[k], ord[j]] = [ord[j], ord[k]]; render(); focusEl?.focus({ preventScroll: false });
    say(`${items[i].label}: position ${j + 1} of ${ord.length}.`); onChange?.(ord.slice());
  }
  // pointer drag on the grip or the label
  let drag = null;
  list.addEventListener('pointerdown', (e) => {
    const li = e.target.closest('.ord-item'); if (!li || locked || e.target.closest('button')) return;
    drag = { i: +li.dataset.i, y: e.clientY, li }; li.setPointerCapture(e.pointerId); li.classList.add('dragging');
  });
  list.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dy = e.clientY - drag.y; drag.li.style.transform = `translateY(${dy}px)`;
    const k = ord.indexOf(drag.i);
    const nb = nodes.get(ord[k + Math.sign(dy)]);
    if (nb) { const r = nb.getBoundingClientRect(), me = drag.li.getBoundingClientRect(); const mid = r.top + r.height / 2; if ((dy > 0 && me.bottom > mid) || (dy < 0 && me.top < mid)) { const before = drag.li.getBoundingClientRect().top; [ord[k], ord[k + Math.sign(dy)]] = [ord[k + Math.sign(dy)], ord[k]]; drag.li.style.transform = ''; render(false); const after = drag.li.getBoundingClientRect().top; drag.y += after - before; drag.li.style.transform = `translateY(${e.clientY - drag.y}px)`; onChange?.(ord.slice()); } }
  });
  const end = () => { if (!drag) return; drag.li.classList.remove('dragging'); drag.li.style.transform = ''; say(`${items[drag.i].label}: position ${ord.indexOf(drag.i) + 1} of ${ord.length}.`); drag = null; };
  list.addEventListener('pointerup', end); list.addEventListener('pointercancel', end);
  render(false);
  return {
    el: list,
    get order() { return ord.slice(); },
    set(o) { if (Array.isArray(o) && o.length === items.length) { ord = o.slice(); render(false); } },
    lock() { locked = true; list.classList.add('locked'); list.querySelectorAll('.ord-mv').forEach((b) => { b.disabled = true; }); },
    unlock() { locked = false; list.classList.remove('locked', 'revealed'); list.querySelectorAll('.ord-mv').forEach((b) => { b.disabled = false; }); nodes.forEach((n) => { n.querySelector('.ord-truth').textContent = ''; }); },
    reveal() {
      const t = truthOrder(items);
      list.classList.add('revealed');
      nodes.forEach((n, i) => {
        const pos = t.indexOf(i) + 1;
        n.querySelector('.ord-truth').innerHTML = `<b>${pos}</b> ${esc(yr(items[i].year))}`;
        n.classList.toggle('same', ord.indexOf(i) + 1 === pos);
      });
    },
  };
}

// ---------------- the guess
// host: { C, store, MARKS, tl, map, viewer, sources(ids), override(stage) -> Promise, live(msg), onChange() }
export function makeGuess(g, beat, host) {
  const id = `g-${beat.id}`; const qid = `${id}-q-${++uid}`;
  const key = `guess:${beat.id}`;
  const st = { v: null, conf: null, revealed: false, ...(host.store.get(key, {}) || {}) };
  const isBet = g.type === 'bet';
  const wrap = el('section', { class: `guess t-${g.type}`, id, role: 'group', 'aria-labelledby': qid });
  const kick = el('div', { class: 'g-kicker' }, el('span', { class: 'g-glyph', 'aria-hidden': 'true' }), isBet ? 'Your call · optional' : 'Your guess · optional');
  const q = el('p', { class: 'g-q', id: qid, text: g.q });
  const body = el('div', { class: 'g-body' });
  const lockBtn = el('button', { type: 'button', class: 'g-btn g-lock', disabled: true }, isBet ? 'Make the call' : 'Lock in my guess');
  const showBtn = el('button', { type: 'button', class: 'g-btn g-show' }, 'Show me');
  const actions = el('div', { class: 'g-actions' }, lockBtn, showBtn);
  const confRow = el('div', { class: 'g-conf', role: 'radiogroup', 'aria-label': 'How sure were you? Optional', hidden: true },
    el('span', { class: 'g-conf-l', text: 'How sure were you?' }));
  CONF.forEach((c, i) => {
    const b = el('button', { type: 'button', role: 'radio', 'aria-checked': 'false', class: 'g-chip small', text: c });
    b.addEventListener('click', () => { st.conf = i; save(); [...confRow.querySelectorAll('[role=radio]')].forEach((x, j) => x.setAttribute('aria-checked', String(j === i))); reveal(); });
    confRow.append(b);
  });
  const youLine = el('p', { class: 'g-you' });
  const reveal$ = el('div', { class: 'g-reveal', hidden: true },
    el('div', { class: 'g-what' }, el('span', { class: 'g-rule', 'aria-hidden': 'true' }), 'What actually happened'),
    youLine,
    el('p', { class: 'g-say', text: g.say }),
    el('div', { class: 'g-legend', 'aria-hidden': 'true' }, el('span', { class: 'lg ghost' }), 'your answer', el('span', { class: 'lg truth' }), 'the record'),
    host.sources(g.sources));
  const liveR = el('p', { class: 'vh', 'aria-live': 'polite' });
  wrap.append(kick, q, body, actions, confRow, reveal$, liveR);

  const save = () => host.store.set(key, { v: st.v, conf: st.conf, revealed: st.revealed });
  let pending = null; // an answer chosen but not yet locked
  const enableLock = (on) => { lockBtn.disabled = !on; };
  let inst = null; // an instrument guess handle { reveal(), destroy() }
  let widget = null;

  // ---- per-type gesture
  const chipsFor = (opts, multi) => {
    const row = el('div', { class: 'g-chips', role: multi ? 'group' : 'radiogroup', 'aria-labelledby': qid });
    const sel = new Set();
    opts.forEach(([val, lab]) => {
      const b = el('button', { type: 'button', class: 'g-chip', role: multi ? null : 'radio', 'aria-pressed': multi ? 'false' : null, 'aria-checked': multi ? null : 'false', 'data-v': String(val) }, el('span', { class: 'g-chip-mk', 'aria-hidden': 'true' }), el('span', { text: lab }));
      b.addEventListener('click', () => {
        if (st.v != null || st.revealed) return;
        if (multi) { sel.has(val) ? sel.delete(val) : sel.add(val); b.setAttribute('aria-pressed', String(sel.has(val))); pending = sel.size ? [...sel].sort((a, c) => a - c) : null; enableLock(!!pending); }
        else { row.querySelectorAll('.g-chip').forEach((x) => x.setAttribute('aria-checked', String(x === b))); pending = val; if (g.type === 'choice' || g.type === 'bet') commit(val); else enableLock(true); }
      });
      row.append(b);
    });
    return row;
  };
  const markChips = (row, mine, truths) => {
    const T = new Set([].concat(truths).map(String)), M = new Set([].concat(mine ?? []).map(String));
    row.querySelectorAll('.g-chip').forEach((b) => {
      const v = b.dataset.v; b.classList.toggle('is-truth', T.has(v)); b.classList.toggle('is-mine', M.has(v)); b.disabled = true;
      const mk = b.querySelector('.g-chip-mk'); mk.textContent = T.has(v) ? '●' : M.has(v) ? '○' : '';
      const tags = [M.has(v) ? 'your answer' : '', T.has(v) ? 'what happened' : ''].filter(Boolean);
      b.setAttribute('aria-label', `${b.textContent.replace(/[●○]/g, '').trim()}${tags.length ? ` (${tags.join(', ')})` : ''}`);
    });
  };

  let chipRow = null;
  if (g.type === 'slider') {
    widget = track(g, { label: g.q, onInput: () => enableLock(true) });
    body.append(widget.el, el('p', { class: 'g-how', text: 'Drag, or use the arrow keys (Shift for bigger steps).' }));
  } else if (g.type === 'choice' || g.type === 'bet') {
    chipRow = chipsFor(g.options.map((o, i) => [i, o]));
    body.append(chipRow); lockBtn.hidden = true;
  } else if (g.type === 'order') {
    widget = orderList(g.items, { seed: beat.id, label: g.q, onChange: () => enableLock(true), live: (m) => { liveR.textContent = m; } });
    body.append(el('p', { class: 'g-how', text: 'Drag the cards, or use the arrows. Earliest first.' }), widget.el);
    enableLock(true);
  } else if (g.type === 'timeline') {
    if (host.tl?.guess) {
      const go = el('button', { type: 'button', class: 'g-btn g-instr' }, el('span', { class: 'g-instr-ic', 'aria-hidden': 'true' }), 'Answer on the timeline');
      go.addEventListener('click', async () => { await startInstrument(); go.hidden = true; });
      body.append(go, el('p', { class: 'g-how', text: 'Drag the marker along the axis, or use the arrow keys: one year at a time, Page Up and Down for ten.' }));
    } else {
      widget = track({ scale: 'linear', min: g.range[0], max: g.range[1], step: 1, start: g.start, unit: '', fmt: (v) => yr(v), tick: (t) => yr(t) }, { label: g.q, onInput: () => enableLock(true) });
      body.append(widget.el, el('p', { class: 'g-how', text: 'Drag the marker, or use the arrow keys.' }));
    }
  } else if (g.type === 'map') {
    // the map offers the answer itself (targets plus a keyboard list); inline chips only when it cannot
    if (host.map?.guess) body.append(el('p', { class: 'g-how g-on' }, el('span', { class: 'rb-arrow', 'aria-hidden': 'true' }), g.mode === 'route' ? 'Answer on the map: choose a route, or use the list under it.' : 'Answer on the map: tap a place, or use the list under it.'));
    else { chipRow = chipsFor(g.options.map((o) => [o.id, o.label])); body.append(el('p', { class: 'g-how', text: 'Choose one.' }), chipRow); }
  } else if (g.type === 'tap') {
    const marks = host.MARKS?.[g.marks] || [];
    if (host.viewer?.guessTap) body.append(el('p', { class: 'g-how g-on' }, el('span', { class: 'rb-arrow', 'aria-hidden': 'true' }), 'Answer on the sheet: tap the marks, or use the list under it. You can pick more than one.'));
    else { chipRow = chipsFor(marks.map((m, i) => [i, m.label.split(':')[0]]), true); body.append(el('p', { class: 'g-how', text: 'Choose one or more.' }), chipRow); }
  }

  // when the instrument takes the answer, the prompt keeps only "Show me"
  if ((g.type === 'timeline' && host.tl?.guess) || (g.type === 'map' && host.map?.guess) || (g.type === 'tap' && host.viewer?.guessTap)) lockBtn.hidden = true;
  async function startInstrument() {
    if (inst || st.revealed || st.v != null) return;
    try {
      if (g.type === 'timeline' && host.tl?.guess) { await host.override?.({ mode: 'time', range: g.range, lanes: ['world', 'after'] }); inst = host.tl.guess(g, (v) => commit(v)); }
      if (g.type === 'map' && host.map?.guess) inst = host.map.guess(g, (v) => commit(Array.isArray(v) ? v[0] : v), { list: true });
      if (g.type === 'tap' && host.viewer?.guessTap) inst = host.viewer.guessTap(g, (v) => commit([].concat(v).map(Number).sort((a, b) => a - b)), { list: true });
    } catch (e) { console.error('instrument guess', e); inst = null; }
  }

  function commit(v) {
    if (st.revealed || st.v != null) return;
    st.v = v; save();
    wrap.classList.add('answered');
    widget?.lock?.(g.type === 'slider' || g.type === 'timeline' ? v : undefined);
    if (chipRow) markChips(chipRow, v, []);
    lockBtn.hidden = true; confRow.hidden = false;
    showBtn.textContent = 'Show me what happened';
    liveR.textContent = `Your answer: ${fmtValue(g, v, host.MARKS)}. Say how sure you were, or show what happened.`;
    if (g.hook) host.tl?.markGuess?.({ hook: g.hook, value: v, truth: g.truth, ghost: true });
    host.onChange?.();
    confRow.querySelector('[role=radio]')?.focus({ preventScroll: true });
  }
  lockBtn.addEventListener('click', () => {
    if (g.type === 'slider' || (g.type === 'timeline' && widget)) { if (widget.touched) commit(widget.value); }
    else if (g.type === 'order') commit(widget.order);
    else if (pending != null) commit(pending);
  });
  showBtn.addEventListener('click', () => reveal());

  function reveal({ silent = false, persist = true } = {}) {
    if (st.revealed && wrap.classList.contains('revealed')) return;
    st.revealed = true; if (persist) save();
    wrap.classList.add('revealed'); actions.hidden = true;
    confRow.hidden = st.v == null; confRow.classList.add('done');
    confRow.querySelectorAll('[role=radio]').forEach((b, j) => { b.disabled = true; b.setAttribute('aria-checked', String(j === st.conf)); });
    if (st.conf == null) confRow.hidden = true;
    const mine = st.v;
    if (g.type === 'slider') widget.reveal(mine, g.truth, g.truthLabel);
    if (g.type === 'timeline' && widget) widget.reveal(mine, g.truth, yr(g.truth));
    if (g.type === 'order') { widget.lock(); widget.reveal(); }
    if (chipRow) {
      const t = g.type === 'map' ? [].concat(g.truth) : g.type === 'tap' ? g.truth : [g.truth];
      markChips(chipRow, mine, t);
    }
    try { inst?.reveal?.(); } catch (e) { console.error(e); }
    if (g.hook) host.tl?.markGuess?.({ hook: g.hook, value: mine, truth: g.truth, ghost: false });
    youLine.innerHTML = mine == null ? `<span class="k">The record</span> ${esc(fmtTruth(g, host.MARKS))}`
      : `<span class="k">You</span> <span class="ghosttxt">${esc(fmtValue(g, mine, host.MARKS))}</span> <span class="k">The record</span> <b>${esc(fmtTruth(g, host.MARKS))}</b>${closeNote(mine)}`;
    reveal$.hidden = false;
    if (!silent && !motion.reduced) reveal$.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: 'cubic-bezier(0.05,0.7,0.1,1)' });
    if (!silent) liveR.textContent = `What actually happened: ${g.say}`;
    host.onChange?.();
  }
  function closeNote(v) {
    if (v == null) return '';
    if (g.type === 'slider') { const ok = g.scale === 'log' ? v >= g.truth / g.close && v <= g.truth * g.close : Math.abs(v - g.truth) <= g.close; return ok ? ' <span class="g-close">· close</span>' : ''; }
    if (g.type === 'timeline') return Math.abs(v - g.truth) <= g.close ? ' <span class="g-close">· close</span>' : ` <span class="g-close">· ${Math.abs(Math.round(v - g.truth))} years apart</span>`;
    return '';
  }

  // restore
  if (st.v != null) {
    const v = st.v; st.v = null; const rv = st.revealed; st.revealed = false;
    if (g.type === 'order') widget.set(v);
    commit(v); if (rv) reveal({ silent: true });
  } else if (st.revealed) { st.revealed = false; reveal({ silent: true }); }

  return {
    el: wrap, beatId: beat.id, g,
    get state() { return { ...st }; },
    activate() { if (!st.revealed && (g.type === 'map' || g.type === 'tap')) host.scopeTimeout?.(() => startInstrument(), 450); },
    deactivate() { try { inst?.destroy?.(); } catch (e) { /* */ } inst = null; },
    passed() { if (!st.revealed) reveal({ silent: true, persist: st.v != null }); },
    get revealed() { return st.revealed; },
    reset() {
      try { inst?.destroy?.(); } catch (e) { /* */ } inst = null;
      st.v = null; st.conf = null; st.revealed = false; host.store.del(key); pending = null;
      wrap.classList.remove('answered', 'revealed'); actions.hidden = false; reveal$.hidden = true; confRow.hidden = true; confRow.classList.remove('done');
      confRow.querySelectorAll('[role=radio]').forEach((b) => { b.disabled = false; b.setAttribute('aria-checked', 'false'); });
      lockBtn.hidden = g.type === 'choice' || g.type === 'bet' || (!widget && !chipRow); enableLock(g.type === 'order'); showBtn.textContent = 'Show me';
      widget?.unlock?.();
      chipRow?.querySelectorAll('.g-chip').forEach((b) => { b.disabled = false; b.classList.remove('is-truth', 'is-mine'); b.querySelector('.g-chip-mk').textContent = ''; b.removeAttribute('aria-label'); if (b.hasAttribute('aria-checked')) b.setAttribute('aria-checked', 'false'); if (b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', 'false'); });
    },
  };
}

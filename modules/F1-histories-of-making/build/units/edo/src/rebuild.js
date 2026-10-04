// Rebuild: at the end of each act, put four to six tiles back on the timeline or the map. Optional, skippable, unscored.
// A wrong placement snaps back gently with the tile's hint. One tile comes from an earlier act.
// Keyboard: select a tile, arrow to a position (or Tab to a place), Enter to place, Escape to cancel.
// The Coda: the six-item order rebuild, a private ledger of your guesses (ghost vs record), and the Atlas hand-off.
import { el, esc, motion, spriteEl } from './util.js';
import { makeGuess, fmtValue, fmtTruth } from './guess.js';

const niceStep = (span) => (span > 300 ? 50 : span > 150 ? 25 : span > 60 ? 10 : 5);
const yr = (y) => String(Math.floor(y));

export function buildRebuild(act, C, host) {
  const R = act.rebuild; const isTime = R.mode === 'time';
  const key = `rb:${act.id}`;
  const saved = host.store.get(key, {}) || {};
  const placed = new Map(Object.entries(saved.placed || {})); // tileId -> value
  const live = el('p', { class: 'rb-live', 'aria-live': 'polite' });
  const range = R.range || [1600, 2025];
  const span = range[1] - range[0];
  const tol = Math.max(2, Math.round(span * 0.035));
  const pct = (y) => ((y - range[0]) / span) * 100;
  let selected = null, cursor = Math.round((range[0] + range[1]) / 2);
  // on wide screens the instrument itself is the board (Timeline/MapStage.placeTiles); the sheet keeps the status and controls
  const stageApi = !host.mob && (isTime ? host.tl?.placeTiles : host.map?.placeTiles);

  const sec = el('section', { class: 'rebuild step', id: `rebuild-${act.id}`, 'aria-labelledby': `rb-${act.id}-h` });
  const sheet = el('div', { class: 'kraft' });
  sec.append(sheet);
  const nextAct = host.nextAct?.(act);
  sheet.append(
    el('div', { class: 'rb-head' },
      el('div', { class: 'kicker', text: `Act ${act.n} · Rebuild` }),
      el('h3', { id: `rb-${act.id}-h`, text: R.q }),
      el('p', { class: 'rb-lede', text: isTime ? 'Optional. Pick a tile, then place it on the line: drag it, or choose a year with the arrow keys and press Enter. Nothing is scored.' : 'Optional. Pick a tile, then place it on its city: drag it, or choose the place and press Enter. Nothing is scored.' })));

  // ---- the tray
  const tray = el('div', { class: 'rb-tray', role: 'group', 'aria-label': 'Tiles to place' });
  const tiles = new Map();
  R.tiles.forEach((t) => {
    const pic = t.img ? spriteEl(C, t.img.startsWith('t-') || C.sprites.index[t.img] ? t.img : t.img, 44) : null;
    const b = el('button', { type: 'button', class: 'rb-tile', 'aria-pressed': 'false', 'data-id': t.id },
      pic || el('span', { class: 'rb-tile-mk', 'aria-hidden': 'true', text: isTime ? '年' : '所' }),
      el('span', { class: 'rb-tile-t' }, el('span', { class: 'rb-tile-l', text: t.label }), t.from ? el('span', { class: 'rb-from', text: `From ${t.from}` }) : null, el('span', { class: 'rb-tile-hint' })),
      el('span', { class: 'rb-tile-v', 'aria-hidden': 'true' }));
    b.addEventListener('click', () => { if (stageApi) return; if (b.dataset.drag === '1') { b.dataset.drag = ''; return; } if (placed.has(t.id)) return; select(selected === t.id ? null : t.id); });
    b.addEventListener('pointerdown', (e) => { if (!stageApi) startDrag(e, t, b); });
    if (stageApi) { b.tabIndex = -1; b.setAttribute('aria-disabled', 'true'); b.removeAttribute('aria-pressed'); }
    tiles.set(t.id, { t, b });
    tray.append(b);
  });

  // ---- the board
  let board, axis, cur, docks;
  if (isTime) {
    const step = niceStep(span);
    const ticks = el('div', { class: 'rb-ticks', 'aria-hidden': 'true' });
    for (let y = Math.ceil(range[0] / step) * step; y <= range[1]; y += step) ticks.append(el('span', { style: `left:${pct(y)}%`, text: String(y) }));
    cur = el('div', { class: 'rb-cursor', 'aria-hidden': 'true' }, el('span'));
    docks = el('div', { class: 'rb-docks' });
    axis = el('div', { class: 'rb-axis', role: 'slider', tabindex: '-1', 'aria-label': 'Choose a year', 'aria-valuemin': String(range[0]), 'aria-valuemax': String(range[1]), 'aria-disabled': 'true' },
      el('div', { class: 'rb-line' }), ticks, cur);
    board = el('div', { class: 'rb-board time' }, axis, docks);
    axis.addEventListener('keydown', (e) => {
      if (!selected) return;
      const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }[e.key];
      if (d) { e.preventDefault(); moveCursor(cursor + d * (e.shiftKey ? 10 : 1)); }
      else if (e.key === 'Home') { e.preventDefault(); moveCursor(range[0]); } else if (e.key === 'End') { e.preventDefault(); moveCursor(range[1]); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drop(selected, cursor); }
      else if (e.key === 'Escape') { e.preventDefault(); const b = tiles.get(selected)?.b; select(null); b?.focus(); }
    });
    axis.addEventListener('pointermove', (e) => { if (selected && e.pointerType === 'mouse') moveCursor(yearAt(e.clientX)); });
    axis.addEventListener('click', (e) => { if (selected) drop(selected, yearAt(e.clientX)); });
  } else {
    const ids = [...new Set(R.tiles.map((t) => t.place))].sort((a, b) => (C.places.world[a]?.lon ?? 0) - (C.places.world[b]?.lon ?? 0));
    docks = el('div', { class: 'rb-places', role: 'group', 'aria-label': 'Places' });
    ids.forEach((pid) => {
      const p = C.places.world[pid] || { name: pid };
      const btn = el('button', { type: 'button', class: 'rb-place', 'data-place': pid, disabled: true },
        el('span', { class: 'rb-pin', 'aria-hidden': 'true' }), el('span', { class: 'rb-pname', text: p.name }), el('span', { class: 'rb-pslot' }));
      btn.addEventListener('click', () => { if (selected) drop(selected, pid); });
      btn.addEventListener('keydown', (e) => { if (e.key === 'Escape') { const b = tiles.get(selected)?.b; select(null); b?.focus(); } });
      docks.append(btn);
    });
    board = el('div', { class: 'rb-board map' }, docks);
  }
  const showAll = el('button', { type: 'button', class: 'g-btn' }, 'Show me where they go');
  showAll.addEventListener('click', () => { try { stageH?.reveal?.(); } catch (e) { /* */ } R.tiles.forEach((t) => { if (!placed.has(t.id)) dock(t, isTime ? t.year : t.place, true); }); persist(); live.textContent = 'All tiles placed where the record puts them.'; host.onChange?.(); });
  const again = el('button', { type: 'button', class: 'g-btn ghost' }, 'Start again');
  again.addEventListener('click', () => { reset(); if (stageH) { const a = active; deactivate(); if (a) activate(); } });
  const skip = nextAct ? el('a', { class: 'rb-skip', href: `#act-${nextAct.id}`, onclick: (e) => { e.preventDefault(); host.go?.(`act-${nextAct.id}`); } }, `Skip to Act ${nextAct.n}`) : null;
  const note = el('p', { class: 'rb-stage-note' }, el('span', { class: 'rb-arrow', 'aria-hidden': 'true' }), isTime ? 'The tiles are on the timeline beside this sheet. Drag each one to its year, or select it and use the arrow keys.' : 'The tiles are on the map beside this sheet. Drag each one to its city, or select it and choose the place.');
  if (stageApi) { sheet.classList.add('on-stage'); tray.setAttribute('aria-label', 'Your tiles'); }
  sheet.append(...[stageApi ? note : null, tray, board, live, el('div', { class: 'rb-foot' }, showAll, again, skip)].filter(Boolean));

  function yearAt(x) { const r = axis.getBoundingClientRect(); return Math.round(range[0] + Math.max(0, Math.min(1, (x - r.left) / r.width)) * span); }
  function moveCursor(y) { cursor = Math.max(range[0], Math.min(range[1], y)); cur.style.left = `${pct(cursor)}%`; cur.firstChild.textContent = String(cursor); cur.firstChild.style.transform = `translateX(${-Math.round(((cursor - range[0]) / span) * 100)}%)`; axis.setAttribute('aria-valuenow', String(cursor)); axis.setAttribute('aria-valuetext', String(cursor)); }
  function select(id) {
    selected = id;
    tiles.forEach(({ b }, tid) => b.setAttribute('aria-pressed', String(tid === id)));
    sheet.classList.toggle('picking', !!id);
    if (isTime) {
      axis.setAttribute('aria-disabled', String(!id)); axis.tabIndex = id ? 0 : -1;
      if (id) { axis.setAttribute('aria-label', `Choose a year for “${tiles.get(id).t.label}”`); moveCursor(cursor); axis.focus({ preventScroll: true }); live.textContent = `${tiles.get(id).t.label}: use the arrow keys to choose a year, Enter to place it, Escape to put it back.`; }
    } else {
      docks.querySelectorAll('.rb-place').forEach((p) => { p.disabled = !id || !!p.dataset.full; p.setAttribute('aria-label', id ? `Place “${tiles.get(id).t.label}” on ${p.querySelector('.rb-pname').textContent}` : p.querySelector('.rb-pname').textContent); });
      if (id) { docks.querySelector('.rb-place:not([disabled])')?.focus({ preventScroll: true }); live.textContent = `${tiles.get(id).t.label}: choose its place and press Enter.`; }
    }
  }
  function drop(id, v) {
    const T = tiles.get(id); if (!T) return { ok: false };
    const t = T.t;
    const ok = isTime ? Math.abs(v - t.year) <= tol : v === t.place;
    if (ok) { dock(t, isTime ? t.year : t.place); persist(); select(null); live.textContent = `${t.label}: ${isTime ? yr(t.year) : C.places.world[t.place]?.name}. Placed.`; nextFocus(); host.onChange?.(); return { ok: true }; }
    // snap back, gently, with the hint
    if (isTime) { const gh = el('div', { class: 'rb-miss', style: `left:${pct(v)}%`, 'aria-hidden': 'true' }); axis.append(gh); setTimeout(() => gh.remove(), motion.reduced ? 900 : 1600); }
    T.b.querySelector('.rb-tile-hint').textContent = t.hint;
    T.b.classList.add('hinted');
    if (!motion.reduced) T.b.animate([{ transform: 'translateY(-6px)' }, { transform: 'none' }], { duration: 400, easing: 'cubic-bezier(0.05,0.7,0.1,1)' });
    const keep = id; select(null); select(keep);
    live.textContent = `Not there. A hint: ${t.hint} ${isTime ? 'Try another year' : 'Try another place'}, or press Escape.`;
    return { ok: false, hint: t.hint };
  }
  function nextFocus() { const nx = [...tiles.values()].find(({ t }) => !placed.has(t.id)); if (nx) nx.b.focus({ preventScroll: true }); else { live.textContent += ' Every tile is back in place.'; sheet.classList.add('complete'); } }
  function dock(t, v, quiet) {
    placed.set(t.id, v);
    const { b } = tiles.get(t.id);
    b.classList.add('placed'); b.classList.remove('hinted'); b.setAttribute('aria-pressed', 'false'); b.disabled = true;
    b.querySelector('.rb-tile-v').textContent = isTime ? yr(t.year) : (C.places.world[t.place]?.name || t.place);
    if (isTime) {
      let tag = docks.querySelector(`[data-id="${t.id}"]`);
      if (!tag) { tag = el('div', { class: 'rb-dock', 'data-id': t.id, style: `left:${pct(t.year)}%` }, el('i', { 'aria-hidden': 'true' }), el('span', { class: 'rb-dock-y', text: yr(t.year) }), el('span', { class: 'rb-dock-l', text: t.label })); docks.append(tag); }
      layoutDocks();
      if (!quiet && !motion.reduced) tag.animate([{ opacity: 0, transform: 'translate(-50%, -8px)' }, { opacity: 1, transform: 'translate(-50%, 0)' }], { duration: 400, easing: 'cubic-bezier(0.05,0.7,0.1,1)' });
    } else {
      const p = docks.querySelector(`[data-place="${t.place}"]`);
      if (p) { p.dataset.full = '1'; p.disabled = true; p.querySelector('.rb-pslot').textContent = t.label; p.classList.add('full'); }
    }
  }
  function layoutDocks() {
    // stagger labels into rows so they never overlap
    const tags = [...docks.querySelectorAll('.rb-dock')].sort((a, b) => parseFloat(a.style.left) - parseFloat(b.style.left));
    const lastX = [];
    const W = docks.clientWidth || 600;
    tags.forEach((tg) => {
      const x = (parseFloat(tg.style.left) / 100) * W;
      const w = Math.min(170, tg.querySelector('.rb-dock-l').textContent.length * 6.4 + 16);
      let row = 0; while (lastX[row] != null && x - w / 2 < lastX[row] + 8) row++;
      lastX[row] = x + w / 2; tg.style.setProperty('--row', row);
    });
    docks.style.setProperty('--rows', String(Math.max(1, lastX.length)));
  }
  function persist() { host.store.set(key, { placed: Object.fromEntries(placed) }); }
  function reset() {
    placed.clear(); host.store.del(key); sheet.classList.remove('complete');
    tiles.forEach(({ b }) => { b.classList.remove('placed', 'hinted'); b.disabled = false; b.querySelector('.rb-tile-v').textContent = ''; b.querySelector('.rb-tile-hint').textContent = ''; });
    if (isTime) docks.innerHTML = ''; else docks.querySelectorAll('.rb-place').forEach((p) => { delete p.dataset.full; p.classList.remove('full'); p.querySelector('.rb-pslot').textContent = ''; });
    select(null); live.textContent = 'The tiles are back in the tray.'; host.onChange?.();
  }

  // ---- pointer drag (a button alternative exists for every drag)
  function startDrag(e, t, b) {
    if (placed.has(t.id) || e.button > 0) return;
    const x0 = e.clientX, y0 = e.clientY; let ghost = null;
    const move = (ev) => {
      if (!ghost && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 6) return;
      if (!ghost) { ghost = b.cloneNode(true); ghost.className = 'rb-tile rb-ghostdrag'; ghost.setAttribute('aria-hidden', 'true'); document.body.append(ghost); select(t.id); b.dataset.drag = '1'; }
      ghost.style.left = `${ev.clientX}px`; ghost.style.top = `${ev.clientY}px`;
      if (isTime) { const r = axis.getBoundingClientRect(); if (ev.clientY > r.top - 60 && ev.clientY < r.bottom + 60) moveCursor(yearAt(ev.clientX)); }
    };
    const up = (ev) => {
      removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
      if (!ghost) return;
      ghost.remove();
      if (isTime) { const r = axis.getBoundingClientRect(); if (ev.clientY > r.top - 70 && ev.clientY < r.bottom + 70 && ev.clientX >= r.left - 10 && ev.clientX <= r.right + 10) drop(t.id, yearAt(ev.clientX)); else select(null); }
      else { const tgt = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.rb-place'); if (tgt && !tgt.dataset.full) drop(t.id, tgt.dataset.place); else select(null); }
    };
    addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  }

  // restore
  R.tiles.forEach((t) => { if (placed.has(t.id)) dock(t, placed.get(t.id), true); });
  if (placed.size === R.tiles.length) sheet.classList.add('complete');
  addEventListener('resize', () => isTime && layoutDocks());

  let stageH = null, active = false;
  const stage = isTime
    ? { mode: 'time', range, lanes: ['state', 'trade', 'print', 'world', 'after'], bands: range[0] < 1876 && range[1] > 1790, acts: true }
    : { mode: 'map', scale: 'world', rotate: 150, view: [-130, -40, 150, 62], points: [...new Set(R.tiles.map((t) => t.place))] };
  function activate() {
    active = true;
    if (!stageApi || stageH) return;
    const left = R.tiles.filter((t) => !placed.has(t.id));
    if (!left.length) return;
    try {
      stageH = stageApi(left, (r) => {
        if (!r || r.done) { if (r?.done) { sheet.classList.add('complete'); host.onChange?.(); } return; }
        const T = tiles.get(r.id); if (!T) return;
        if (r.ok) { dock(T.t, isTime ? T.t.year : T.t.place, true); persist(); live.textContent = `${T.t.label}: ${isTime ? yr(T.t.year) : C.places.world[T.t.place]?.name}. Placed.`; host.onChange?.(); }
        else { T.b.querySelector('.rb-tile-hint').textContent = T.t.hint; T.b.classList.add('hinted'); }
      }, { tolerance: tol });
    } catch (e) { console.error('placeTiles', e); stageH = null; }
  }
  function deactivate() { active = false; try { stageH?.destroy?.(); } catch (e) { /* */ } stageH = null; }
  return {
    el: sec, act, stage, year: isTime ? range[1] : 1900,
    activate, deactivate,
    reset,
    get placedCount() { return placed.size; },
  };
}

// ---------------- the coda
export function buildCoda(C, host) {
  const sec = el('section', { class: 'coda step', id: 'coda', 'aria-labelledby': 'coda-h' });
  const sheet = el('div', { class: 'sheet-paper coda-sheet' });
  sec.append(el('div', { class: 'scene-wrap' }, sheet));
  const items = C.coda.order.items;
  const sorted = [...items].sort((a, b) => a.year - b.year);
  const say = `${sorted.map((i) => `${i.label} (${Math.floor(i.year)})`).join(', ')}.`;
  const orderG = makeGuess({ type: 'order', q: C.coda.order.q, items, say, sources: [] }, { id: 'coda' }, { ...host.guessHost, onChange: () => refresh() });
  sheet.append(
    el('header', { class: 'coda-head' },
      el('div', { class: 'kicker', text: 'Coda' }),
      el('h2', { id: 'coda-h', text: 'Five bets, one sheet' }),
      el('p', { class: 'coda-lede', text: 'Put six moments from the whole story in order, earliest first. Then look back at the guesses you made on the way. Everything here stays on this device.' })),
    orderG.el);

  const ledger = el('div', { class: 'ledger', 'aria-live': 'polite' });
  const clear = el('button', { type: 'button', class: 'g-btn ghost' }, 'Clear my answers');
  const clearLive = el('p', { class: 'vh', 'aria-live': 'polite' });
  clear.addEventListener('click', () => { host.clearAll?.(); orderG.reset(); refresh(); clearLive.textContent = 'Your answers on this device are cleared.'; });
  sheet.append(
    el('section', { class: 'coda-ledger', 'aria-labelledby': 'ledger-h' },
      el('div', { class: 'ledger-head' }, el('h3', { id: 'ledger-h' }, el('span', { class: 'ghosttxt', text: 'You predicted' }), el('span', { class: 'sep', 'aria-hidden': 'true', text: ' / ' }), el('span', { text: 'What happened' })), clear),
      el('p', { class: 'ledger-note', text: 'Private: kept only in this browser. The hollow mark is your answer; the solid one is the record.' }),
      ledger, clearLive));

  // go deeper: the rooms, and the Atlas
  const deeper = el('nav', { class: 'coda-rooms', 'aria-label': 'Go deeper' });
  for (const [id, title, line] of host.rooms || []) deeper.append(el('a', { class: 'room-card', href: `#room-${id}`, onclick: (e) => { e.preventDefault(); host.openRoom?.(id); } }, el('span', { class: `room-ic ic-${id}`, 'aria-hidden': 'true' }), el('span', { class: 'room-card-t', text: title }), el('span', { class: 'room-card-l', text: line })));
  const atlas = el('a', { class: 'atlas-link', target: '_blank', rel: 'noopener', hidden: true }, el('span', { class: 'atlas-k', text: 'Next' }), el('span', { class: 'atlas-t', text: 'Open the Atlas' }), el('span', { class: 'atlas-l', text: 'The people and places you met here, inked on a map of every unit.' }));
  sheet.append(el('div', { class: 'coda-deeper' }, el('div', { class: 'kicker', text: 'Go deeper' }), deeper, atlas));

  function refresh() {
    ledger.innerHTML = '';
    const rows = (host.guesses?.() || []).filter((g) => g.state.v != null);
    if (!rows.length) ledger.append(el('p', { class: 'ledger-empty', text: 'You have not made any guesses yet. They are optional; each scene keeps its own.' }));
    else {
      const ul = el('ol', { class: 'ledger-list' });
      rows.forEach((G) => {
        const s = G.state; const g = G.g;
        const conf = s.conf != null ? ['Guessing', 'Unsure', 'Fairly sure', 'Sure'][s.conf] : null;
        ul.append(el('li', {},
          el('p', { class: 'lq', text: g.q }),
          el('div', { class: 'lrow' },
            el('span', { class: 'lmark ghost', 'aria-hidden': 'true' }), el('span', { class: 'vh', text: 'You: ' }), el('span', { class: 'lyou', text: fmtValue(g, s.v, host.MARKS) }),
            conf ? el('span', { class: 'lconf', text: conf }) : null),
          el('div', { class: 'lrow' }, el('span', { class: 'lmark truth', 'aria-hidden': 'true' }), el('span', { class: 'vh', text: 'The record: ' }), el('span', { class: 'ltruth', text: s.revealed ? fmtTruth(g, host.MARKS) : 'Not revealed yet' })),
          el('a', { class: 'lback', href: `#${G.beatId}`, onclick: (e) => { e.preventDefault(); host.go?.(G.beatId); } }, 'Back to the scene')));
      });
      ledger.append(ul);
    }
    const ids = (host.metIds?.() || []).filter((x) => /^[A-Za-z0-9-]+$/.test(x));
    if (host.atlasUrl) { atlas.hidden = false; atlas.href = `${host.atlasUrl}${ids.length ? `#from-edo.${ids.join('.')}` : ''}`; }
  }
  refresh();
  return { el: sec, refresh, orderG, stage: { mode: 'time', range: [1600, 2025], lanes: ['state', 'trade', 'print', 'world', 'after'], acts: true, bands: true }, year: 2024.5 };
}

export { esc };

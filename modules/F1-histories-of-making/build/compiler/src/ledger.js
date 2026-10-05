import { $, $$, esc, glyph, stTag, fmtDays } from './util.js';
import { STATUS, RANK } from './engine.js';

const TYPE_TEXT = {
  logical: 'Logical: one option needs something the other does not provide.',
  empirical: 'Empirical: seen in a built version (or built together without trouble).',
  normative: 'Normative: a house rule of the programme.',
  auto: 'Auto: detected from the blueprint, two regions claim the same slot.',
  yours: 'Your judgement, which overrides the model.',
};

export function renderLedger(app, root) {
  const { model, state, ev, engine } = app;
  const dims = model.dims;
  const byKey = Object.fromEntries(ev.cells.map((c) => [c.key, c]));
  const houseByDim = {};
  for (const h of ev.house) (houseByDim[h.dim] = houseByDim[h.dim] || []).push(h);
  if (!state.cell || (!byKey[state.cell] && !state.cell.startsWith('house|'))) {
    const pick = [...ev.cells, ...ev.house].filter((c) => c.status !== 'open').sort((a, b) => RANK[b.status] - RANK[a.status])[0];
    state.cell = pick && pick.status !== 'ok' ? (pick.key.startsWith('house|') ? 'house|' + pick.dim : pick.key) : null;
  }
  const optLabel = (id) => (id ? (id === 'me-custom' ? engine.eff('me-custom', app.ctx()).label : engine.byId[id].label) : 'nothing chosen');
  const dimName = (id) => dims.find((d) => d.id === id).label;

  const head = `<tr><td></td>${dims.slice(0, -1).map((d) => `<th scope="col" title="${esc(d.label)}">${d.code}</th>`).join('')}<th scope="col" class="house">House rules</th></tr>`;
  const rows = dims.map((d, i) => {
    const cells = dims.slice(0, -1).map((c, j) => {
      if (j >= i) return '<td><span class="cell none" aria-hidden="true"></span></td>';
      const cell = byKey[`${d.id}|${c.id}`] || byKey[`${c.id}|${d.id}`];
      const st = cell.status;
      const name = `${d.label}: ${optLabel(cell.row === d.id ? cell.a : cell.b)} with ${c.label}: ${optLabel(cell.row === d.id ? cell.b : cell.a)}: ${STATUS[st].text}${cell.auto ? ' (detected automatically)' : ''}${cell.source === 'you' ? ' (your judgement)' : ''}.`;
      return `<td><button type="button" class="cell ${st} ${state.cell === cell.key ? 'sel' : ''}" data-cell="${cell.key}" data-a="${cell.a || ''}" data-b="${cell.b || ''}" aria-label="${esc(name)}" aria-pressed="${state.cell === cell.key}" tabindex="-1">${glyph(st)}${cell.auto ? '<span class="auto" aria-hidden="true">A</span>' : ''}${cell.source === 'you' ? '<span class="you" aria-hidden="true">Y</span>' : ''}</button></td>`;
    }).join('');
    const hs = houseByDim[d.id] || [];
    const hst = hs.length ? hs.reduce((m, h) => (RANK[h.status] > RANK[m] ? h.status : m), 'ok') : (state.path[d.id] ? 'ok' : 'open');
    const hk = 'house|' + d.id;
    const hname = `${d.label} against the house rules: ${STATUS[hst].text}.`;
    return `<tr><th scope="row" class="rh"><span class="nm">${esc(d.label)}</span>${d.code}</th>${cells}<td><button type="button" class="cell ${hst} ${state.cell === hk ? 'sel' : ''}" data-cell="${hk}" data-a="${state.path[d.id] || ''}" aria-label="${esc(hname)}" aria-pressed="${state.cell === hk}" tabindex="-1">${glyph(hst)}</button></td></tr>`;
  }).join('');

  root.innerHTML = `<div class="panel ledger-box" id="ledgerBox">
    <div><h3 id="ledgerTitle">Pair ledger</h3><p class="small muted">Every chosen option against every other (${ev.cells.length} pairs), plus the house rules. Select a cell for the reason and the repairs.</p></div>
    <div class="matrix-wrap"><table class="matrix" aria-labelledby="ledgerTitle"><thead>${head}</thead><tbody>${rows}</tbody></table></div>
    <div class="legend">${['ok', 'adapt', 'conflict', 'unjudged'].map((s) => stTag(s)).join('')}<span class="st"><span class="mono">A</span> auto-detected</span><span class="st"><span class="mono">Y</span> your judgement</span></div>
    <div id="cellDetail" class="cell-detail" aria-live="polite">${detailHTML(app, byKey, houseByDim, optLabel, dimName)}</div>
    <div><h3 style="margin-bottom:8px">Budgets</h3>${budgetsHTML(app)}</div>
  </div>`;

  // one tab stop into the grid, arrows move (APG grid pattern)
  const btns = $$('.matrix .cell:not(.none)', root);
  const first = btns.find((b) => b.classList.contains('sel')) || btns[0];
  if (first) first.tabIndex = 0;
  bind(app, root);
}

function detailHTML(app, byKey, houseByDim, optLabel, dimName) {
  const { state, engine, model } = app;
  if (!state.cell) return `<p class="small">Every pair works. Select any cell to see why.</p>`;
  if (state.cell.startsWith('house|')) {
    const dim = state.cell.split('|')[1];
    const hs = houseByDim[dim] || [];
    return `<h4>${esc(dimName(dim))} · house rules</h4><p class="small">${esc(optLabel(state.path[dim]))}</p>
      ${hs.length ? hs.map((h) => `<div>${stTag(h.status)} <span class="small muted">${esc(model.houseRules[h.rule])}${h.method ? ' · method: ' + esc(h.method) : ''}</span><p>${esc(h.reason)}</p>${repairsHTML(app, h.repairs)}</div>`).join('') : '<p class="small">No house rule is touched by this option.</p>'}
      <p class="small muted">${esc(TYPE_TEXT.normative)}</p>`;
  }
  const c = byKey[state.cell];
  if (!c) return '';
  if (c.status === 'open') return `<p class="small">${esc(c.reason)}</p>`;
  const pk = engine.pairKey(engine.eff(c.a, app.ctx()), engine.eff(c.b, app.ctx()));
  const mine = state.judgments[pk];
  const other = (c.issues || []).filter((x) => x.reason !== c.reason);
  return `<h4>${esc(dimName(c.row))} × ${esc(dimName(c.col))}</h4>
    <div class="pairnames"><span>${esc(optLabel(c.a))}</span><span>${esc(optLabel(c.b))}</span></div>
    <div>${stTag(c.status, c.auto ? ' · auto' : '')} <span class="small muted">· ${esc(TYPE_TEXT[c.type] || '')}</span></div>
    <p>${esc(c.reason)}</p>
    ${other.length ? `<ul class="small">${other.map((x) => `<li>${STATUS[x.status].text}: ${esc(x.reason)}</li>`).join('')}</ul>` : ''}
    ${(c.notes || []).filter((n) => n.reason !== c.reason).map((n) => `<p class="small">Auto (${n.frame}): ${esc(n.reason)}</p>`).join('')}
    ${repairsHTML(app, c.repairs)}
    <div class="judge"><p class="small"><b>Judge this pair yourself</b>${mine ? ' (overrides the model)' : ''}</p>
      <div class="seg" role="group" aria-label="Your judgement">${['ok', 'adapt', 'conflict'].map((s) => `<button type="button" data-judge="${s}" data-pk="${pk}" aria-pressed="${mine?.status === s}">${STATUS[s].glyph} ${STATUS[s].text}</button>`).join('')}</div>
      <label for="judgeNote">Rationale</label><textarea id="judgeNote" rows="2" placeholder="Why this judgement?">${esc(mine?.note || '')}</textarea>
      ${mine ? `<div><button type="button" class="btn small" data-unjudge="${pk}">Clear my judgement</button></div>` : ''}</div>`;
}

function repairsHTML(app, reps) {
  const { model, state, engine } = app;
  const list = (reps || []).filter(Boolean);
  if (!list.length) return '';
  const dims = model.dims;
  const items = [];
  const seen = new Set();
  for (const r of list) {
    const sw = Object.entries(r.swap || {}).filter(([d, id]) => state.path[d] !== id);
    const key = JSON.stringify(sw) + (r.text || '');
    if (seen.has(key)) continue; seen.add(key);
    if (sw.length) items.push(`<li><button type="button" class="btn small accent" data-swap='${esc(JSON.stringify(sw))}'>Swap</button> ${sw.map(([d, id]) => `${esc(dims.find((x) => x.id === d).label)} → ${esc(engine.byId[id].label)}`).join(', ')}${r.text ? `<span class="muted"> · or adapt in place: ${esc(r.text)}${r.days ? ' (+' + fmtDays(...r.days) + ')' : ''}</span>` : ''}</li>`);
    else if (r.text) items.push(`<li><span class="chip">Adapt in place</span> ${esc(r.text)}${r.days ? ` <span class="muted">(+${fmtDays(...r.days)})</span>` : ''}</li>`);
  }
  return items.length ? `<div><p class="small"><b>Repairs</b></p><ul class="rep-list">${items.join('')}</ul></div>` : '';
}

function bullet({ value, lo, hi, max, bands, marker, label }) {
  const W = 300, H = 28, x = (v) => Math.max(0, Math.min(W, (v / max) * W));
  let b = '', prev = 0;
  bands.forEach((end, i) => { b += `<rect class="bg-band-${i}" x="${x(prev)}" y="4" width="${Math.max(0, x(Math.min(end, max)) - x(prev))}" height="16"/>`; prev = end; });
  const bar = lo !== undefined ? `<rect class="bg-range" x="${x(lo)}" y="9" width="${Math.max(3, x(hi) - x(lo))}" height="6" rx="1"/><rect class="bg-range" x="${x(lo)}" y="6" width="1.5" height="12"/><rect class="bg-range" x="${x(hi) - 1.5}" y="6" width="1.5" height="12"/>` : `<rect class="bg-bar" x="0" y="9" width="${x(value)}" height="6"/>`;
  const mk = marker !== undefined ? `<line class="bg-mark" x1="${x(marker)}" x2="${x(marker)}" y1="1" y2="23"/>` : '';
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${esc(label)}">${b}${bar}${mk}</svg>`;
}
function ord(level) { return `<span class="ord" aria-hidden="true">${['low', 'medium', 'high'].map((l) => `<span class="${l === level ? 'on' : ''}">${l}</span>`).join('')}</span>`; }

function budgetsHTML(app) {
  const { ev, state, model, engine } = app;
  const b = ev.budget;
  const cap = state.capacity;
  const lbl = (id) => engine.byId[id]?.label || id;
  const fMax = Math.max(300, b.files.value * 1.15);
  const jMax = Math.max(2400, b.js.value * 1.15);
  const eMax = Math.max(cap * 2, b.effort.hi * 1.1, 10);
  const fState = b.files.value > model.budgets.versionLimit ? 'over the 511-file version limit' : b.files.value > model.budgets.fileLimit ? `needs ${b.files.publishes} publishes` : b.files.value > 200 ? 'tight' : 'fits';
  const eState = b.effort.hi <= cap ? 'fits capacity' : b.effort.lo <= cap ? 'may exceed capacity' : 'over capacity';
  return `<div class="budgets">
    <div class="bg-row"><span class="bg-label">Files per publish<small>exact, from option manifests</small></span>${bullet({ value: b.files.value, max: fMax, bands: [200, 255, fMax], marker: 255, label: `${b.files.value} of 255 files: ${fState}` })}<span class="bg-text"><b class="mono">${b.files.value}</b> of 255 · ${fState} · marker at the 255-file publish limit</span></div>
    <div class="bg-row"><span class="bg-label">JavaScript weight<small>estimate</small></span>${bullet({ value: b.js.value, max: jMax, bands: [900, 2000, jMax], label: `About ${b.js.value} KB of JavaScript: ${b.js.status}` })}<span class="bg-text">≈ <b class="mono">${b.js.value.toLocaleString()}</b> KB · ${b.js.status === 'fits' ? 'light' : b.js.status === 'tight' ? 'heavy, load on demand' : 'very heavy'} (bands at 900 and 2,000 KB)</span></div>
    <div class="bg-row"><span class="bg-label">Build effort<small>range, estimate</small></span>${bullet({ lo: b.effort.lo, hi: b.effort.hi, max: eMax, bands: [cap, cap * 1.5, eMax], marker: cap, label: `About ${b.effort.lo} to ${b.effort.hi} days against a capacity of ${cap}: ${eState}` })}<span class="bg-text">about <b class="mono">${fmtDays(b.effort.lo, b.effort.hi)}</b> from today’s v4 code (options ${fmtDays(b.effort.optLo, b.effort.optHi)} + ${b.effort.nAdapt} adaptation${b.effort.nAdapt === 1 ? '' : 's'} ${fmtDays(b.effort.adaptLo, b.effort.adaptHi)}) · ${eState} · <label for="capIn">capacity</label> <input id="capIn" type="number" min="1" max="200" value="${cap}" style="width:4.5em"> days</span></div>
    <div class="bg-row"><span class="bg-label">Phone and runtime risk<small>estimate</small></span><span>${ord(b.mobile.level)} <span class="sr-only">${b.mobile.level}</span></span><ul class="contrib bg-text">${b.mobile.items.map((x) => `<li>${esc(lbl(x.opt))}: ${esc(x.note)}${x.level > 1 ? ' (high)' : ''}</li>`).join('') || '<li>No option adds phone risk.</li>'}</ul></div>
    <div class="bg-row"><span class="bg-label">Accessibility risk<small>estimate</small></span><span>${ord(b.a11y.level)} <span class="sr-only">${b.a11y.level}</span></span><ul class="contrib bg-text">${b.a11y.items.map((x) => `<li>${esc(lbl(x.opt))}: ${esc(x.note)}${x.level > 1 ? ' (high)' : ''}</li>`).join('') || '<li>No option adds accessibility risk.</li>'}</ul></div>
  </div>`;
}

function bind(app, root) {
  const { state } = app;
  root.onclick = (e) => {
    const cell = e.target.closest('.cell[data-cell]');
    if (cell) { app.act.selectCell(cell.dataset.cell); const n = root.querySelector(`.cell[data-cell="${CSS.escape(cell.dataset.cell)}"]`); n?.focus(); return; }
    const sw = e.target.closest('[data-swap]');
    if (sw) { const ch = JSON.parse(sw.dataset.swap); app.act.applyRepair(ch, 'Ledger repair: ' + ch.map(([d, id]) => `${d} → ${app.engine.byId[id].label}`).join('; ')); return; }
    const j = e.target.closest('[data-judge]');
    if (j) { app.act.setJudgment(j.dataset.pk, j.dataset.judge, $('#judgeNote', root)?.value); return; }
    const u = e.target.closest('[data-unjudge]');
    if (u) app.act.setJudgment(u.dataset.unjudge, null);
  };
  root.onchange = (e) => {
    if (e.target.id === 'capIn') app.act.setCapacity(e.target.value);
    if (e.target.id === 'judgeNote') { const pk = $('[data-judge]', root)?.dataset.pk; if (pk && state.judgments[pk]) app.act.setJudgment(pk, state.judgments[pk].status, e.target.value); }
  };
  root.onkeydown = (e) => {
    const c = e.target.closest('.matrix .cell'); if (!c) return;
    const td = c.parentElement, tr = td.parentElement;
    let col = [...tr.children].indexOf(td), row = [...tr.parentElement.children].indexOf(tr);
    const rows = [...tr.parentElement.children];
    const at = (r, k) => rows[r]?.children[k]?.querySelector('.cell:not(.none)');
    let n = null;
    if (e.key === 'ArrowRight') { for (let k = col + 1; k < tr.children.length && !n; k++) n = at(row, k); }
    else if (e.key === 'ArrowLeft') { for (let k = col - 1; k > 0 && !n; k--) n = at(row, k); }
    else if (e.key === 'ArrowDown') { for (let r = row + 1; r < rows.length && !n; r++) n = at(r, col); }
    else if (e.key === 'ArrowUp') { for (let r = row - 1; r >= 0 && !n; r--) n = at(r, col); }
    if (!n) return;
    e.preventDefault();
    $$('.matrix .cell', root).forEach((x) => { x.tabIndex = -1; }); n.tabIndex = 0; n.focus();
  };
  // cross-highlight: a cell lights the regions and cards of both options
  const hl = (a, b) => {
    document.querySelectorAll('.hl').forEach((x) => x.classList.remove('hl'));
    for (const id of [a, b]) if (id) document.querySelectorAll(`[data-reg-opt="${CSS.escape(id)}"]`).forEach((x) => x.classList.add('hl'));
  };
  root.onmouseover = (e) => { const c = e.target.closest('.cell[data-cell]'); if (c) hl(c.dataset.a, c.dataset.b); };
  root.onmouseleave = () => hl();
  root.onfocusin = (e) => { const c = e.target.closest('.cell[data-cell]'); if (c) hl(c.dataset.a, c.dataset.b); };
}

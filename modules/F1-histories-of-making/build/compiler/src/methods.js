import { $, $$, esc } from './util.js';

const FAMILIES = ['acquisition', 'inquiry', 'practice', 'discussion', 'collaboration', 'production'];
const EVID = ['strong', 'moderate', 'mixed', 'weak'];
const ARCH = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const PRESETS = [
  ['Narrative-first', ['scrolly', 'compare', 'predict', 'retrieval']],
  ['Evidence-first', ['dbq', 'deduction', 'worked', 'selfexp']],
  ['Making-first', ['making', 'sim', 'stepthrough']],
  ['Dialogue-first', ['sac', 'socratic', 'selfexp', 'case']],
  ['v4 + the four gaps', ['scrolly', 'predict', 'chrono', 'compare', 'deduction', 'sim', 'worked', 'selfexp', 'retrieval', 'portfolio']],
];

function currentMethods(app) {
  const id = app.state.path.methods;
  if (!id) return [];
  return app.engine.eff(id, app.ctx()).methods || [];
}

export function renderMethodsSummary(app) {
  const box = document.getElementById('mxSummary');
  if (!box) return;
  const { model, state, engine } = app;
  const ids = currentMethods(app);
  const ms = ids.map((id) => model.methods.find((m) => m.id === id)).filter(Boolean);
  const fam = {}; for (const m of ms) fam[m.family] = (fam[m.family] || 0) + 1;
  const ev = {}; for (const m of ms) ev[m.evidence.strength] = (ev[m.evidence.strength] || 0) + 1;
  const optLabel = state.path.methods ? engine.eff(state.path.methods, app.ctx()).label : 'nothing chosen';
  const cells = [...app.ev.cells.filter((c) => (c.a === state.path.methods || c.b === state.path.methods) && (c.status === 'adapt' || c.status === 'conflict' || c.status === 'unjudged')), ...app.ev.house.filter((h) => h.opt === state.path.methods && h.status !== 'ok')];
  box.innerHTML = `<div>
      <p class="eyebrow">Teaching-method mix in the composer</p>
      <h3 style="margin:4px 0 8px">${esc(optLabel)}</h3>
      <div class="borrow" style="margin-bottom:8px">${ms.map((m) => `<button type="button" class="chip" data-mtoggle="${m.id}" aria-pressed="${state.custom.includes(m.id)}" title="${state.path.methods === 'me-custom' ? 'Remove from the custom mix' : 'Add to the custom mix'}">${esc(m.name.split(' (')[0])}</button>`).join('') || '<span class="small muted">No methods yet. Pick some below, or load a preset.</span>'}</div>
      <p class="small">Presets for the custom mix: ${PRESETS.map(([n], i) => `<button type="button" class="btn small" data-preset="${i}">${esc(n)}</button>`).join(' ')} ${state.custom.length ? '<button type="button" class="btn small" data-preset="clear">Clear custom</button>' : ''}</p>
    </div>
    <div>
      <p class="eyebrow">Laurillard balance</p>
      <div class="balance" role="img" aria-label="${esc(FAMILIES.filter((f) => fam[f]).map((f) => `${f} ${fam[f]}`).join(', ') || 'no methods')}">${FAMILIES.filter((f) => fam[f]).map((f) => `<span class="fam-${f}" style="flex:${fam[f]}">${f}</span>`).join('') || '<span style="flex:1">—</span>'}</div>
      <p class="small" style="margin-top:6px">Evidence: ${EVID.filter((e) => ev[e]).map((e) => `<span class="ev ${e}">${e} ${ev[e]}</span>`).join(' ') || '—'}</p>
      ${cells.length ? `<p class="small" style="margin-top:6px"><b>In this path:</b> ${cells.map((c) => esc(c.reason)).slice(0, 3).join(' ')}</p>` : '<p class="small muted" style="margin-top:6px">No method in the mix clashes with the rest of the path.</p>'}
    </div>`;
  for (const card of $$('.mcard')) {
    const on = state.custom.includes(card.dataset.m);
    card.classList.toggle('sel', on);
    const b = card.querySelector('[data-mtoggle]'); if (b) { b.setAttribute('aria-pressed', String(on)); b.textContent = on ? '✓ In custom mix' : 'Add to custom mix'; }
  }
  for (const tr of $$('tr[data-mrow]')) tr.classList.toggle('sel', ids.includes(tr.dataset.mrow));
}

export function renderMethods(app, root, opts = {}) {
  const { model, state } = app;
  const tab = state.methodsTab;
  root.innerHTML = `<div class="panel mx-summary" id="mxSummary"></div>
    <div class="tabs" role="tablist" aria-label="Methods views">${[['catalogue', 'Catalogue'], ['heatmap', 'Fit to archetypes'], ['units', 'Per unit']].map(([k, l]) => `<button type="button" role="tab" id="tab-${k}" aria-controls="mpanel" aria-selected="${tab === k}" tabindex="${tab === k ? 0 : -1}" data-tab="${k}">${l}</button>`).join('')}</div>
    <div id="mpanel" role="tabpanel" aria-labelledby="tab-${tab}">${tab === 'catalogue' ? catalogue(app, opts) : tab === 'heatmap' ? heatmap(app) : units(app)}</div>`;
  renderMethodsSummary(app);
  bind(app, root);
  if (opts.open) { const d = document.querySelector(`#m-${CSS.escape(opts.open)} details`); if (d) d.open = true; }
}

function filtered(app) {
  const { model, state } = app; const f = state.mf;
  const q = f.q.trim().toLowerCase();
  return model.methods.filter((m) => (f.family === 'all' || m.family === f.family) && (f.evidence === 'all' || m.evidence.strength === f.evidence) && (f.cost === 'all' || m.cost === f.cost)
    && (!q || (m.name + ' ' + m.oneLine + ' ' + m.edoExample).toLowerCase().includes(q)));
}

function catalogue(app) {
  const { state } = app; const f = state.mf;
  const list = filtered(app);
  const sel = (name, val, opts) => `<label>${name} <select data-filter="${val}">${opts.map(([v, l]) => `<option value="${v}" ${f[val] === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>`;
  return `<div class="filters">
      ${sel('Learning type', 'family', [['all', 'All six'], ...FAMILIES.map((x) => [x, x])])}
      ${sel('Evidence', 'evidence', [['all', 'Any'], ...EVID.map((x) => [x, x])])}
      ${sel('Cost', 'cost', [['all', 'Any'], ['S', 'S (hours)'], ['M', 'M (days)'], ['L', 'L (weeks)']])}
      <label>Search <input type="search" data-filter="q" value="${esc(f.q)}" placeholder="e.g. seal, map, compare"></label>
      <span class="small muted" role="status">${list.length} of 30 methods</span>
    </div>
    <div class="mgrid">${list.map((m) => mcard(app, m)).join('')}</div>`;
}

function mcard(app, m) {
  const on = app.state.custom.includes(m.id);
  return `<article class="panel mcard ${on ? 'sel' : ''}" id="m-${m.id}" data-m="${m.id}">
    <div class="mmeta"><span class="chip">${esc(m.family)}</span><span class="chip">ICAP: ${esc(m.icapLevel)}</span><span class="ev ${m.evidence.strength}">evidence: ${m.evidence.strength}</span><span class="chip">cost ${m.cost}</span></div>
    <h4>${esc(m.name)}</h4>
    <p class="small">${esc(m.oneLine)}</p>
    <div><p class="eyebrow" style="margin-bottom:3px">Fit to archetypes A–G (0–3)</p><div class="fitrow">${ARCH.map((a) => `<span class="h${m.archetypes[a]}" title="${a}: ${m.archetypes[a]}">${a} ${m.archetypes[a]}</span>`).join('')}</div></div>
    <p class="small"><b>Edo, this way:</b> ${esc(m.edoExample)}</p>
    <details><summary>Evidence, sources and exemplars</summary><div>
      <p>${esc(m.evidence.note)}</p>
      <ul>${m.evidence.sources.map((s) => `<li><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t)}</a></li>`).join('')}</ul>
      <p><b>Exemplars</b></p><ul>${m.exemplars.map((s) => `<li><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.t)}</a></li>`).join('')}</ul>
      <p><b>Suits:</b> ${esc(m.suits.join('; '))}</p>
      ${m.cautions ? `<p><b>Cautions:</b> ${esc(m.cautions)}</p>` : ''}
      <p><b>Units:</b> ${esc(m.units.join(', '))}</p>
    </div></details>
    <div><button type="button" class="btn small ${on ? 'accent' : ''}" data-mtoggle="${m.id}" aria-pressed="${on}">${on ? '✓ In custom mix' : 'Add to custom mix'}</button></div>
  </article>`;
}

function heatmap(app) {
  const { model, state } = app;
  const sort = state.mf.sort;
  const ids = currentMethods(app);
  const list = filtered(app).slice().sort((a, b) => (sort ? b.archetypes[sort] - a.archetypes[sort] || a.name.localeCompare(b.name) : 0));
  return `<p class="small muted" style="margin-bottom:10px">Each cell is the fit of a method to an archetype, 0 (poor or ruled out) to 3 (a natural core method), shown as a number and as darkness. Sort by an archetype with its header button. Dots mark the methods in the current mix. Filters from the catalogue apply.</p>
    <div class="heat-wrap"><table class="heat"><thead><tr><th scope="col">Method</th><th scope="col">Type</th>${model.archetypes.map((a) => `<th scope="col"><button type="button" data-sort="${a.id}" aria-pressed="${sort === a.id}" aria-label="Sort by ${a.id}, ${esc(a.name)}" title="${esc(a.name)}: ${esc(a.units || '')}">${a.id}</button></th>`).join('')}</tr></thead>
    <tbody>${list.map((m) => `<tr data-mrow="${m.id}" class="${ids.includes(m.id) ? 'sel' : ''}"><th scope="row" class="mn"><button type="button" class="chip" data-mtoggle="${m.id}" aria-pressed="${state.custom.includes(m.id)}" style="border:0;background:none;padding:0;min-height:24px;font-size:13px;white-space:normal;text-align:left">${esc(m.name.split(' (')[0])}</button></th><td class="fam">${esc(m.family)} · ${esc(m.evidence.strength)}</td>${ARCH.map((a) => `<td class="v h${m.archetypes[a]}">${m.archetypes[a]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <div class="legend" style="margin-top:10px">${model.archetypes.map((a) => `<span><b class="mono">${a.id}</b> ${esc(a.name)} (${esc(a.units || '')})</span>`).join('')}</div>`;
}

function units(app) {
  const { model } = app;
  const name = (id) => model.methods.find((m) => m.id === id)?.name.split(' (')[0] || id;
  return `<p class="small muted" style="margin-bottom:12px">Each F1 unit with its archetype, the forms its spec already uses, the lab it already has, and the methods with the best evidence-to-cost ratio to add (teaching_methods.md §6). Select a method to add it to the custom mix.</p>
  <div class="units">${model.archetypes.map((a) => {
    const us = model.units.filter((u) => u.arch.split('/').includes(a.id));
    return `<section class="panel arch" aria-labelledby="arch-${a.id}"><div class="arch-head"><span class="arch-letter" aria-hidden="true">${a.id}</span><h3 id="arch-${a.id}">${esc(a.name)}</h3><span class="small muted">opens on: ${esc(a.opensOn)}</span></div>
      ${a.core ? `<p class="seq"><b>Core sequence:</b> ${esc(a.core)}</p><p class="seq"><b>Add:</b> ${esc(a.add)} · <b>Avoid:</b> ${esc(a.avoid)} · <b>Balance:</b> ${esc(a.balance)}</p>` : ''}
      <div class="fp-wrap"><table class="utable"><thead><tr><th scope="col">Unit</th><th scope="col">Title</th><th scope="col">Lab now</th><th scope="col">Add</th></tr></thead><tbody>
      ${us.map((u) => `<tr><td class="uid">${esc(u.id)}${u.arch.includes('/') ? ' <span class="muted">' + esc(u.arch) + '</span>' : ''}</td><td>${esc(u.title)}</td><td>${esc(u.lab || '—')}</td><td>${u.addIds.map((m) => `<button type="button" class="chip" data-mtoggle="${m}" aria-pressed="${app.state.custom.includes(m)}">${esc(name(m))}</button>`).join('')}<div class="small muted">${esc(u.add.replace(/`/g, ''))}</div></td></tr>`).join('')}
      </tbody></table></div></section>`;
  }).join('')}</div>`;
}

function bind(app, root) {
  const { state } = app;
  const rerender = (focusSel) => { renderMethods(app, root); if (focusSel) root.querySelector(focusSel)?.focus(); };
  root.onclick = (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.tab) { state.methodsTab = t.dataset.tab; rerender(`[data-tab="${t.dataset.tab}"]`); }
    else if (t.dataset.mtoggle) { app.act.toggleMethod(t.dataset.mtoggle); if (state.methodsTab !== 'catalogue') rerender(`[data-mtoggle="${t.dataset.mtoggle}"]`); }
    else if (t.dataset.sort) { state.mf.sort = state.mf.sort === t.dataset.sort ? null : t.dataset.sort; rerender(`[data-sort="${t.dataset.sort}"]`); }
    else if (t.dataset.preset) {
      const ids = t.dataset.preset === 'clear' ? [] : PRESETS[+t.dataset.preset][1];
      app.act.setCustom(ids.slice());
      renderMethods(app, root);
      root.querySelector(`[data-preset="${t.dataset.preset}"]`)?.focus();
    }
  };
  root.onkeydown = (e) => {
    const t = e.target.closest('[role="tab"]'); if (!t) return;
    const tabs = $$('[role="tab"]', root); const i = tabs.indexOf(t);
    const j = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : null;
    if (j === null) return;
    e.preventDefault(); state.methodsTab = tabs[j].dataset.tab; rerender(`[data-tab="${tabs[j].dataset.tab}"]`);
  };
  root.onchange = (e) => { const f = e.target.dataset.filter; if (f && f !== 'q') { state.mf[f] = e.target.value; rerender(`[data-filter="${f}"]`); } };
  root.oninput = (e) => {
    if (e.target.dataset.filter === 'q') {
      state.mf.q = e.target.value;
      const pos = e.target.selectionStart;
      rerender('[data-filter="q"]');
      const inp = root.querySelector('[data-filter="q"]'); if (inp) inp.setSelectionRange(pos, pos);
    }
  };
}

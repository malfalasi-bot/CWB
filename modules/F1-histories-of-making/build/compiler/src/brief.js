import { $, esc, fmtDays, copyText, VNAME } from './util.js';
import { STATUS } from './engine.js';

// ADR-style brief: one record per dimension (Status, Context, Decision, Consequences, Feasibility, Sources, Borrowed),
// then teaching methods, rejected options, resolved conflicts, build checklist and open questions.
export function buildBrief(app) {
  const { model, state, ev, engine } = app;
  const dims = model.dims;
  const opt = (id) => (id ? engine.eff(id, app.ctx()) : null);
  const vers = (o) => o.sourceVersions.map((v) => VNAME[v]).join(', ') || 'new';
  const b = ev.budget;
  const L = [];
  const today = new Date().toISOString().slice(0, 10);
  L.push('# Edo and the floating world: final concept brief', '');
  L.push(`Generated ${today} by the Edo Concept Composer from ${Object.values(state.approvals).reduce((n, a) => n + Object.values(a).filter((x) => x.state).length, 0)} reviewed options and the feasibility model (${model.ruleCount} rules).`, '');
  L.push('## Feasibility', '');
  L.push(`- **Verdict:** ${ev.verdict.text}.`);
  L.push(`- **Pairs:** ${ev.counts.ok} works, ${ev.counts.adapt} adapt, ${ev.counts.conflict} conflict, ${ev.counts.unjudged} unjudged (${ev.cells.filter((c) => c.status !== 'open').length} pairs and ${ev.house.length} house-rule checks).`);
  L.push(`- **Files:** ${b.files.value} of 255 per publish (exact, from option manifests).`);
  L.push(`- **JavaScript:** about ${b.js.value.toLocaleString()} KB (estimate).`);
  L.push(`- **Effort:** about ${fmtDays(b.effort.lo, b.effort.hi)} from today's v4 code, against a capacity of ${state.capacity} days (estimate; a range, not a total).`);
  L.push(`- **Phone and runtime risk:** ${b.mobile.level}. **Accessibility risk:** ${b.a11y.level} (estimates).`, '');

  const rejected = [], openQ = [], checklist = [], borrowedAll = [], unexplained = [];
  dims.forEach((d, i) => {
    const id = state.path[d.id];
    const o = opt(id);
    const ap = state.approvals[d.id] || {};
    const n = String(i + 1).padStart(2, '0');
    L.push(`## ADR-${n} ${d.label}${o ? ': ' + o.label : ''}`, '');
    const note = id ? ap[id]?.note : '';
    const status = !o ? 'Open' : state.pass === 2 && note ? 'Accepted' : 'Proposed';
    L.push(`- **Status:** ${status}${o && !note ? ' (no reason recorded yet)' : ''}`);
    const considered = model.options.filter((x) => x.dim === d.id).map((x) => `${x.label}${ap[x.id]?.state ? ` (${ap[x.id].state})` : ''}`);
    L.push(`- **Context:** ${d.question} Criteria: ${d.criteria.map((c) => model.criteria[c].label.toLowerCase()).join(', ')}. Considered: ${considered.join('; ')}.`);
    if (!o) { L.push('- **Decision:** not yet made.', ''); openQ.push(`Choose an option for ${d.label}.`); return; }
    L.push(`- **Decision:** We will use ${o.label.charAt(0).toLowerCase() + o.label.slice(1)} (from ${vers(o)}). ${o.what}${o.id === 'me-custom' ? ' Methods: ' + (o.methods.join(', ') || 'none') + '.' : ''}`);
    if (note) L.push(`- **Why:** ${note}`);
    L.push('- **Consequences:**');
    if (o.worked && o.worked !== '—') L.push(`  - (+) ${o.worked}`);
    const pugh = o.pugh || '';
    d.criteria.forEach((c, k) => { if (pugh[k] === '+') L.push(`  - (+) Better than v4 on ${model.criteria[c].label.toLowerCase()}.`); });
    if (o.weaknesses && o.weaknesses !== '—') L.push(`  - (−) ${o.weaknesses}`);
    d.criteria.forEach((c, k) => { if (pugh[k] === '-') L.push(`  - (−) Worse than v4 on ${model.criteria[c].label.toLowerCase()}.`); });
    L.push(`  - (·) Effort ${fmtDays(...o.budget.days)}; +${o.budget.files} files; about ${o.budget.js} KB JS.`);
    const probs = [...ev.cells.filter((c) => (c.a === o.id || c.b === o.id) && c.status !== 'ok' && c.status !== 'open'), ...ev.house.filter((h) => h.opt === o.id && h.status !== 'ok')];
    if (probs.length) {
      L.push('- **Feasibility:**');
      for (const p of probs) {
        const other = p.a ? (p.a === o.id ? p.b : p.a) : null;
        L.push(`  - ${STATUS[p.status].text}${other ? ' with ' + opt(other).label : ' (house rule)'}${p.auto ? ' (auto-detected)' : ''}: ${p.reason}`);
        const rep = (p.repairs || []).find((r) => r && r.text);
        if (p.status === 'adapt' && rep) checklist.push(`${d.label}: ${rep.text}${rep.days ? ` (${fmtDays(...rep.days)})` : ''}.`);
        else if (p.status === 'adapt') checklist.push(`${d.label}: resolve “${p.reason}”`);
        if (p.status === 'unjudged') openQ.push(`Judge ${d.label} × ${other ? opt(other).label : 'house rules'}: ${p.reason}`);
      }
    }
    const src = o.sourceVersions.map((v) => model.versions.find((x) => x.id === v)).filter(Boolean);
    if (src.length) L.push(`- **Sources:** ${src.map((v) => `${VNAME[v.id]} \`${v.source}\``).join('; ')}`);
    const borrowed = Object.entries(ap).flatMap(([oid, a]) => (a.borrow || []).map((t) => `${t} (from “${engine.byId[oid].label}”)`));
    if (borrowed.length) { L.push(`- **Borrowed details:** ${borrowed.join('; ')}`); borrowed.forEach((x) => borrowedAll.push(`${d.label}: ${x}`)); }
    L.push('');
    for (const [oid, a] of Object.entries(ap)) {
      if (a.state === 'reject') rejected.push(`**${d.label}: ${engine.byId[oid].label}** (${vers(engine.byId[oid])}). ${a.note ? a.note : '_No reason recorded._'}`);
      if (a.state === 'reject' && !a.note) openQ.push(`Give a reason for rejecting “${engine.byId[oid].label}” (${d.label}).`);
      if (a.state === 'maybe') openQ.push(`Decide on “${engine.byId[oid].label}” (${d.label}), still marked Maybe.`);
    }
    if (!note) unexplained.push(d.label);
  });

  const mix = opt(state.path.methods);
  if (mix?.methods?.length) {
    L.push('## Teaching methods in the mix', '');
    for (const mid of mix.methods) {
      const m = model.methods.find((x) => x.id === mid);
      if (!m) continue;
      L.push(`- **${m.name}** (${m.family}, ICAP ${m.icapLevel}, evidence ${m.evidence.strength}, cost ${m.cost}). Edo: ${m.edoExample} Source: [${m.evidence.sources[0]?.t}](${m.evidence.sources[0]?.u})`);
    }
    L.push('');
  }
  L.push('## Rejected options', '');
  L.push(...(rejected.length ? rejected.map((r) => '- ' + r) : ['- None rejected yet.']), '');
  L.push('## Resolved conflicts', '');
  L.push(...(state.repairLog.length ? state.repairLog.map((r) => `- ${r.at.slice(0, 16).replace('T', ' ')}: ${r.label} (verdict before: ${r.verdictBefore}).`) : ['- No repairs applied yet.']), '');
  L.push('## Build checklist', '');
  const conf = [...ev.cells, ...ev.house].filter((c) => c.status === 'conflict');
  conf.forEach((c) => checklist.unshift(`Fix the conflict: ${c.reason}`));
  if (b.files.value > 255) checklist.push(`Split the publish: ${b.files.value} files exceeds 255 per publish.`);
  checklist.push(`Keep the artifact within ${b.files.value <= 255 ? 255 : 511} files (now ${b.files.value}).`);
  borrowedAll.forEach((x) => checklist.push(`Borrow: ${x}.`));
  L.push(...checklist.map((c) => `- [ ] ${c}`), '');
  L.push('## Open questions', '');
  if (unexplained.length) openQ.push(`Record why each choice was made (${unexplained.length} not yet explained: ${unexplained.join(', ')}).`);
  ev.openDims.forEach((d) => openQ.unshift(`Choose an option for ${dims.find((x) => x.id === d).label}.`));
  L.push(...([...new Set(openQ)].length ? [...new Set(openQ)].map((q) => '- ' + q) : ['- None.']), '');
  const markdown = L.join('\n');
  const json = { schema: 'edo-concept-composer/1', exportedAt: new Date().toISOString(), path: state.path, approvals: state.approvals, custom: state.custom, judgments: state.judgments, repairLog: state.repairLog, verdict: ev.verdict, counts: ev.counts, budget: ev.budget };
  return { markdown, json, rejected, openQ: [...new Set(openQ)] };
}

function md2html(md) {
  const out = []; let list = false;
  const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/_(.+?)_/g, '<i>$1</i>').replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  for (const line of md.split('\n')) {
    const m = line.match(/^(#{1,3}) (.*)/);
    const li = line.match(/^(\s*)- (.*)/);
    if (!li && list) { out.push('</ul>'); list = false; }
    if (m) out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`);
    else if (li) { if (!list) { out.push('<ul>'); list = true; } out.push(`<li${li[1] ? ' style="margin-left:1.2em"' : ''}>${inline(li[2].replace(/^\[ \] /, '☐ '))}</li>`); }
    else if (line.trim()) out.push(`<p>${inline(line)}</p>`);
  }
  if (list) out.push('</ul>');
  return out.join('');
}

export function renderBrief(app, root) {
  const { state, store } = app;
  if (root.contains(document.activeElement) && document.activeElement.matches('textarea, input')) return;
  const br = buildBrief(app);
  const focused = document.activeElement && root.contains(document.activeElement) ? document.activeElement.id : null;
  root.innerHTML = `<div class="brief-grid">
    <div class="brief-side">
      <div class="panel side-list"><h3>Export</h3>
        <div class="brief-actions">
          <button type="button" class="btn primary" id="copyMd">Copy Markdown</button>
          <button type="button" class="btn" id="saveBrief">${store.mode === 'shared' ? 'Save to the shared store' : 'Save (this device only)'}</button>
          <button type="button" class="btn" id="copyJson">Copy JSON</button>
          <button type="button" class="btn" id="toggleRaw" aria-pressed="${state.briefRaw}">${state.briefRaw ? 'Show formatted' : 'Show Markdown source'}</button>
        </div>
        <p class="toast" id="briefToast" role="status"></p>
        <textarea id="copyFallback" class="brief-raw" style="min-height:120px" hidden aria-label="Text to copy"></textarea>
        <details><summary class="small">Import a saved JSON export</summary>
          <label for="importBox">Paste JSON</label><textarea id="importBox" rows="4" placeholder='{"schema":"edo-concept-composer/1", …}'></textarea>
          <p style="margin-top:6px"><button type="button" class="btn small" id="importBtn">Import</button> <label class="btn small" for="importFile" style="cursor:pointer">Choose a file</label><input id="importFile" type="file" accept="application/json,.json" class="sr-only"></p>
        </details>
      </div>
      <div class="panel side-list"><h3>Rejected options</h3>${br.rejected.length ? `<ul>${br.rejected.map((r) => `<li>${md2html(r).replace(/^<p>|<\/p>$/g, '')}</li>`).join('')}</ul>` : '<p class="muted">None rejected yet. Reject options in the composer; each needs a reason.</p>'}</div>
      <div class="panel side-list"><h3>Open questions</h3>${br.openQ.length ? `<ul>${br.openQ.slice(0, 18).map((q) => `<li>${esc(q)}</li>`).join('')}${br.openQ.length > 18 ? `<li class="muted">and ${br.openQ.length - 18} more in the brief</li>` : ''}</ul>` : '<p class="muted">None.</p>'}</div>
    </div>
    <div>${state.briefRaw ? `<label for="rawMd" class="sr-only">Markdown source</label><textarea id="rawMd" class="brief-raw panel" readonly>${esc(br.markdown)}</textarea>` : `<article class="panel brief-doc" aria-label="Brief preview" tabindex="0">${md2html(br.markdown)}</article>`}</div>
  </div>`;
  const toast = (t) => { $('#briefToast', root).textContent = t; };
  $('#copyMd', root).onclick = async () => toast((await copyText(br.markdown, $('#copyFallback', root))) ? 'Markdown copied.' : 'Copy was blocked: the text is selected below, press Ctrl/Cmd+C.');
  $('#copyJson', root).onclick = async () => toast((await copyText(JSON.stringify(br.json, null, 2), $('#copyFallback', root))) ? 'JSON copied.' : 'Copy was blocked: the JSON is selected below, press Ctrl/Cmd+C.');
  $('#saveBrief', root).onclick = async () => {
    const r = await store.writeNow('brief/current', { markdown: br.markdown, json: br.json });
    toast(r === 'shared' ? 'Saved to the shared store as brief/current.' : r === 'failed' ? 'The shared store refused the save; it is kept on this device.' : 'Saved on this device only.');
  };
  $('#toggleRaw', root).onclick = () => { state.briefRaw = !state.briefRaw; renderBrief(app, root); $('#toggleRaw', root).focus(); };
  const doImport = (text) => {
    try {
      const obj = JSON.parse(text);
      if (!obj || typeof obj !== 'object' || !obj.path) throw new Error('missing path');
      app.act.importState(obj); toast('Imported. The composer now shows that state.');
    } catch (e) { toast('That is not a composer export (expected JSON with a "path" field).'); }
  };
  $('#importBtn', root).onclick = () => doImport($('#importBox', root).value);
  $('#importFile', root).onchange = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => doImport(r.result); r.readAsText(f); };
  if (focused) document.getElementById(focused)?.focus();
}

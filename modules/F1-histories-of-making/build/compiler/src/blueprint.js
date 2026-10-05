import { $, $$, esc, glyph } from './util.js';
import { STATUS, RANK } from './engine.js';

// Schematic of the composed page, generated from each chosen option's region specs and the layout's slot frame.
// Regions involved in an adapt/conflict pair are hatched and carry numbered callouts.
export function renderBlueprint(app, root) {
  const { model, state, ev, engine } = app;
  const kind = state.frame;
  const R = engine.regions(state.path, app.ctx(), kind);
  const dims = model.dims;
  const dimName = (id) => dims.find((d) => d.id === id)?.label || id;
  const label = (id) => (id === 'me-custom' ? engine.eff('me-custom', app.ctx()).label : engine.byId[id]?.label || id);

  // problems -> numbered callouts (conflicts first)
  const probs = [
    ...ev.cells.filter((c) => c.status === 'adapt' || c.status === 'conflict').map((c) => ({ status: c.status, opts: [c.a, c.b], title: `${dimName(c.row)} × ${dimName(c.col)}`, reason: c.reason, auto: !!c.auto, key: c.key })),
    ...ev.house.filter((h) => h.status !== 'ok').map((h) => ({ status: h.status, opts: [h.opt], title: `${dimName(h.dim)} · house rule`, reason: h.reason, auto: false, key: h.key })),
  ].sort((a, b) => RANK[b.status] - RANK[a.status]);
  probs.forEach((p, i) => { p.n = i + 1; });
  const byOpt = {};
  for (const p of probs) for (const o of p.opts) (byOpt[o] = byOpt[o] || []).push(p);
  const stOf = (opt) => (byOpt[opt] || []).reduce((m, p) => (RANK[p.status] > RANK[m] ? p.status : m), 'ok');
  const callouts = (opt, x, y) => (byOpt[opt] || []).slice(0, 3).map((p, i) => `<g class="callout ${p.status}" aria-hidden="true"><circle cx="${x - i * 11}" cy="${y}" r="5"/><text x="${x - i * 11}" y="${y + 2.3}" text-anchor="middle">${p.n}</text></g>`).join('');

  const slots = R.slots;
  const regs = R.regions;
  const W = kind === 'phone' ? 200 : 400, H = kind === 'phone' ? 380 : 250;
  const layoutId = state.path.layout;
  const motionId = state.path.motion;
  const motionOpt = motionId ? engine.byId[motionId] : null;
  const textOpt = state.path.text ? engine.byId[state.path.text] : null;
  const visualOpt = state.path.visual ? engine.byId[state.path.visual] : null;
  const methodsOpt = state.path.methods ? engine.eff(state.path.methods, app.ctx()) : null;
  const one = (state.path.layout && engine.byId[state.path.layout].provides.includes('one-instrument'));

  let s = '';
  const regionG = (r, x, y, w, h, extra = '') => {
    const st = stOf(r.opt);
    const name = `${r.label}, from ${dimName(r.dim).toLowerCase()}: ${label(r.opt)}. ${STATUS[st].text}${r.displaced ? '; this layout has no ' + r.displaced + ' slot' : ''}.`;
    return `<g class="reg" tabindex="0" role="button" data-reg-opt="${esc(r.opt)}" aria-label="${esc(name)}"><rect class="rg ${extra} st-${st}" data-reg-opt="${esc(r.opt)}" x="${x}" y="${y}" width="${w}" height="${h}" rx="2" ${r.displaced ? 'stroke-dasharray="2 2"' : ''}/>
      <text class="rl" x="${x + 4}" y="${y + Math.min(h - 3, 9)}">${esc(trunc(r.label + (r.displaced ? ' (no slot)' : ''), Math.floor(w / 3.7)))}</text>${r.motion && motionOpt?.icon ? `<text class="mot" x="${x + w - 9}" y="${y + h - 3}">${motionOpt.icon}</text>` : ''}${callouts(r.opt, x + w - 4, y + 3)}</g>`;
  };
  const inSlot = (name) => regs.filter((r) => r.slot === name);
  const container = (opt, x, y, w, h, fill, rx = 0) => {
    const st = opt ? stOf(opt) : 'ok';
    return `<rect class="ct ${fill} st-${st}" data-reg-opt="${esc(opt || '')}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>` + (st === 'adapt' || st === 'conflict' ? `<rect class="band-${st}" x="${x + 1}" y="${y + 1}" width="${w - 2}" height="5"/>` : '');
  };
  // main frame
  s += `<rect class="frame" x="0" y="0" width="${W}" height="${H}" rx="${kind === 'phone' ? 14 : 4}"/>`;
  // stage
  if (slots.stage) {
    const [x, y, w, h] = slots.stage;
    const st = inSlot('stage');
    s += container(layoutId, x, y, w, h, 'stagefill');
    s += `<text class="rl sm" x="${x + 5}" y="${y + 13}">Stage${one ? ' · one instrument at a time' : ''}${motionOpt?.icon ? ' · motion ' + motionOpt.icon : ''}</text>`;
    if (layoutId) s += callouts(layoutId, x + w - 6, y + 7);
    const top = y + 19;
    const avail = (slots.body && overlaps(slots.body, slots.stage)) ? (kind === 'phone' ? slots.body[1] - top - 6 : h - 22) : h - 22;
    const rh = Math.min(18, Math.max(11, avail / Math.max(1, st.length) - 3));
    const sx = kind === 'desktop' && slots.body && overlaps(slots.body, slots.stage) ? slots.body[0] + slots.body[2] + 8 : x + 6;
    const sw = kind === 'desktop' && slots.body && overlaps(slots.body, slots.stage) ? x + w - sx - 6 : w - 12;
    st.forEach((r, i) => { s += regionG(r, sx, top + i * (rh + 3), sw, rh); });
  }
  // strip
  if (slots.strip) {
    const [x, y, w, h] = slots.strip; const st = inSlot('strip');
    if (st.length) { const ww = w / st.length; st.forEach((r, i) => { s += regionG(r, x + i * ww + 2, y + 2, ww - 4, h - 4); }); }
  }
  // side
  if (slots.side) {
    const [x, y, w, h] = slots.side; const st = inSlot('side');
    st.forEach((r, i) => { s += regionG(r, x + 3, y + 4 + i * 26, w - 6, 22); });
  }
  // body: a reading card with text lines + inline regions
  if (slots.body) {
    const [x, y, w, h] = slots.body; const st = inSlot('body');
    const overStage = slots.stage && overlaps(slots.body, slots.stage);
    s += container(textOpt?.id, x, y, w, h, overStage ? 'cardfill' : '', overStage ? 4 : 0);
    const lines = textOpt?.lines || 3;
    const lh = 4.2;
    for (let i = 0; i < lines; i++) s += `<rect class="tl" x="${x + 6}" y="${y + 10 + i * lh * 1.5}" width="${(w - 12) * (i === lines - 1 ? 0.6 : 0.96)}" height="${lh * 0.6}"/>`;
    if (textOpt) s += callouts(textOpt.id, x + w - 6, y + 5);
    const top = y + 14 + lines * lh * 1.5;
    const rh = Math.min(17, Math.max(10, (y + h - top - 4) / Math.max(1, st.length) - 3));
    st.forEach((r, i) => { s += regionG(r, x + 5, top + i * (rh + 3), w - 10, rh); });
  }
  // exclusive slots: hero drawn separately; bottom + corner here
  for (const slot of ['bottom', 'corner']) {
    if (!slots[slot]) continue;
    const [x, y, w, h] = slots[slot];
    inSlot(slot).forEach((r, i) => { s += regionG(r, x + i * 6, y - i * 6, slot === 'corner' ? Math.max(w, 64) : w, h); });
  }
  // top bar
  if (slots.top) {
    const [x, y, w, h] = slots.top; const st = inSlot('top');
    s += `<rect class="rg" x="${x}" y="${y}" width="${w}" height="${h}" style="fill:var(--sheet-2)"/>`;
    const total = st.reduce((a, r) => a + r.w, 0);
    const k = total > w - 8 ? (w - 8) / total : 1;
    let cx = x + 4;
    st.forEach((r) => { const rw = r.w * k; s += regionG(r, cx, y + 3, rw - 3, h - 6, r.overflow ? 'st-adapt' : ''); cx += rw; });
    if (total > w - 8) s += `<text class="rl sm" x="${x + w - 4}" y="${y + h + 8}" text-anchor="end">top bar overflows: ${Math.round(total)} of ${w - 8} units</text>`;
  }
  s += `<text class="frame-label" x="0" y="-5">${esc(kind === 'phone' ? 'Phone 390 × 844 · a typical beat' : 'Desktop 1440 × 900 · a typical beat')}</text>`;

  // side frames: opening (hero) and overlays
  const mini = kind === 'phone' ? { x: W + 18, y: 0, w: 110, h: 178, gap: 24 } : { x: 0, y: H + 26, w: 196, h: 92, gap: 8 };
  const heroRegs = inSlot('hero');
  const ovRegs = inSlot('overlay');
  const f1 = [mini.x, mini.y, mini.w, mini.h];
  const f2 = kind === 'phone' ? [mini.x, mini.y + mini.h + mini.gap, mini.w, mini.h] : [mini.x + mini.w + mini.gap, mini.y, mini.w, mini.h];
  s += `<text class="frame-label" x="${f1[0]}" y="${f1[1] - 5}">First screen</text><rect class="frame" x="${f1[0]}" y="${f1[1]}" width="${f1[2]}" height="${f1[3]}" rx="${kind === 'phone' ? 9 : 3}"/>`;
  if (heroRegs.length) {
    const hh = (f1[3] - 12) / heroRegs.length;
    heroRegs.forEach((r, i) => { s += regionG(r, f1[0] + 6, f1[1] + 6 + i * hh, f1[2] - 12, hh - 4); });
  } else s += `<text class="rl sm" x="${f1[0] + 8}" y="${f1[1] + 16}">Opens straight into</text><text class="rl sm" x="${f1[0] + 8}" y="${f1[1] + 25}">the first beat</text>`;
  s += `<text class="frame-label" x="${f2[0]}" y="${f2[1] - 5}">Overlays</text><rect class="frame" x="${f2[0]}" y="${f2[1]}" width="${f2[2]}" height="${f2[3]}" rx="${kind === 'phone' ? 9 : 3}" style="stroke-dasharray:4 3"/>`;
  if (ovRegs.length) {
    const oh = Math.min(30, (f2[3] - 12) / ovRegs.length);
    ovRegs.forEach((r, i) => { s += regionG(r, f2[0] + 6, f2[1] + 6 + i * (oh + 2), f2[2] - 12, oh - 2); });
  } else s += `<text class="rl sm" x="${f2[0] + 8}" y="${f2[1] + 16}">No dialogs or rooms</text>`;

  const vbW = kind === 'phone' ? W + 18 + mini.w + 6 : W + 4;
  const vbH = kind === 'phone' ? H + 6 : H + 26 + mini.h + 6;
  const outline = regs.map((r) => ({ ...r, st: stOf(r.opt) }));

  root.innerHTML = `<div class="panel blue-box" id="blueprintBox">
    <div class="blue-head"><h3 id="bpTitle">Blueprint</h3>
      <div class="seg" role="group" aria-label="Frame"><button type="button" data-frame="phone" aria-pressed="${kind === 'phone'}">Phone</button><button type="button" data-frame="desktop" aria-pressed="${kind === 'desktop'}">Desktop</button></div></div>
    <p class="small muted">Where each chosen option lands on the page. Hatched regions carry an adaptation or conflict; numbers match the list below. Regions marked “auto” collide by position, found from the layout rather than authored.</p>
    <svg class="blue-svg" id="blueprint-svg" viewBox="-6 -14 ${vbW + 6} ${vbH + 16}" role="group" aria-labelledby="bpTitle" aria-describedby="bpDesc"><desc id="bpDesc">Schematic of the composed page in the ${kind} frame; every region is listed in the page structure below.</desc>${s}</svg>
    <div class="swatches"><span>Layout: ${esc(layoutId ? engine.byId[layoutId].label : 'open')}</span>${layoutId ? (byOpt[layoutId] || []).map((p) => `<span class="mono">(${p.n})</span>`).join('') : ''}</div>
    <div class="swatches">${visualOpt ? `<span>Visual: ${esc(visualOpt.label)}</span>${(visualOpt.swatches || []).map((c) => `<i style="background:${c}" aria-hidden="true"></i>`).join('')}<span class="muted">${esc(visualOpt.type || '')}</span>${(byOpt[visualOpt.id] || []).map((p) => `<span class="mono">(${p.n})</span>`).join('')}` : '<span>Visual language open</span>'}</div>
    <div class="swatches"><span>Motion: ${esc(motionOpt?.label || 'open')} ${motionOpt?.icon ? `<span class="mono">${motionOpt.icon}</span>` : ''}</span>${motionOpt ? (byOpt[motionOpt.id] || []).map((p) => `<span class="mono">(${p.n})</span>`).join('') : ''}</div>
    <div class="swatches"><span>Methods:</span>${methodsOpt ? (methodsOpt.methods || []).map((m) => `<span class="chip">${esc(m)}</span>`).join('') || '<span class="muted">none selected</span>' : '<span class="muted">open</span>'}${methodsOpt ? (byOpt[methodsOpt.id] || []).map((p) => `<span class="mono">(${p.n})</span>`).join('') : ''}</div>
    ${probs.length ? `<ol class="callouts" aria-label="Problems on the blueprint">${probs.map((p) => `<li><span class="num ${p.status}" aria-hidden="true">${p.n}</span>${glyph(p.status)}<span><b>${esc(p.title)}</b>${p.auto ? ' <span class="chip">auto</span>' : ''}: ${esc(p.reason)}</span></li>`).join('')}</ol>` : '<p class="small">No region carries a problem.</p>'}
    <details class="sro"><summary>Page structure as text</summary><ol class="outline-list">${outline.map((r) => `<li>${esc(r.slot)}: ${esc(r.label)} (${esc(dimName(r.dim))}: ${esc(label(r.opt))}) — ${STATUS[r.st].text}${r.displaced ? ', no ' + esc(r.displaced) + ' slot in this layout' : ''}</li>`).join('')}</ol></details>
  </div>`;

  root.onclick = (e) => {
    const f = e.target.closest('[data-frame]'); if (f) { app.act.setFrame(f.dataset.frame); $(`[data-frame="${f.dataset.frame}"]`, root)?.focus(); return; }
    const g = e.target.closest('g.reg'); if (g) selectRegion(g.dataset.regOpt);
  };
  root.onkeydown = (e) => { const g = e.target.closest('g.reg'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); selectRegion(g.dataset.regOpt); } };
  function selectRegion(opt) {
    // light the option's pairs in the ledger and its card on the board
    document.querySelectorAll('.hl').forEach((x) => x.classList.remove('hl'));
    document.querySelectorAll(`.cell[data-a="${CSS.escape(opt)}"], .cell[data-b="${CSS.escape(opt)}"]`).forEach((x) => x.classList.add('hl'));
    document.querySelectorAll(`[data-reg-opt="${CSS.escape(opt)}"]`).forEach((x) => x.classList.add('hl'));
    const worst = (byOpt[opt] || [])[0];
    if (worst) app.act.selectCell(worst.key.startsWith('house|') ? 'house|' + worst.key.split('|')[1] : worst.key);
    document.querySelectorAll(`.cell[data-a="${CSS.escape(opt)}"], .cell[data-b="${CSS.escape(opt)}"]`).forEach((x) => x.classList.add('hl'));
  }
}
function overlaps(a, b) { return a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3]; }
function trunc(s, n) { return s.length > n ? s.slice(0, Math.max(3, n - 1)) + '…' : s; }

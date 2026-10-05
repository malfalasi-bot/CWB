// Feasibility engine: evaluates a path (one option per dimension) against the tag constraint model.
// Precedence per pair: your judgement > a pair-specific rule > tag rules and requirements (worst wins)
// > "?" when either option has an unmet hard requirement > "works".
export const RANK = { ok: 0, unjudged: 1, adapt: 2, conflict: 3 };
export const STATUS = {
  ok: { glyph: '✓', text: 'Works', cls: 'ok' },
  adapt: { glyph: '~', text: 'Adapt', cls: 'adapt' },
  conflict: { glyph: '✕', text: 'Conflict', cls: 'conflict' },
  unjudged: { glyph: '?', text: 'Unjudged', cls: 'unjudged' },
  open: { glyph: '·', text: 'Open', cls: 'open' },
};
const DEFAULT_ADAPT_DAYS = [0.5, 2];

export function createEngine(model) {
  const dims = model.dims;
  const dimIdx = Object.fromEntries(dims.map((d, i) => [d.id, i]));
  const byId = Object.fromEntries(model.options.map((o) => [o.id, o]));
  const pairRules = new Map();
  for (const p of model.pairs) { pairRules.set(p.a + '|' + p.b, p); pairRules.set(p.b + '|' + p.a, p); }
  const methodById = Object.fromEntries(model.methods.map((m) => [m.id, m]));

  // The custom mix is assembled from method rules exactly as the build script assembles the preset mixes.
  function customOption(ids) {
    const base = byId['me-custom'];
    const req = [], con = [], house = [];
    for (const mid of ids) {
      const r = model.methodRules[mid] || {};
      for (const q of r.requires || []) if (!req.find((x) => x.need.join() === q.need.join() && x.from === q.from)) req.push({ ...q, method: mid });
      for (const c of r.conflicts || []) if (!con.find((x) => x.tag === c.tag)) con.push({ ...c, method: mid });
      if (r.house) house.push({ ...r.house, method: mid });
    }
    const days = ids.filter((x) => !model.inV4.includes(x)).reduce((a, x) => {
      const c = model.costDays[methodById[x]?.cost || 'M']; return [a[0] + c[0], a[1] + c[1]];
    }, [0, 0]);
    return { ...base, methods: ids.slice(), requires: req, conflicts: con, house, provides: ids.map((x) => 'method-' + x),
      budget: { ...base.budget, days, js: ids.includes('socratic') ? 20 : 0, mobile: ids.includes('making') ? [1, 'Physical making is off-screen'] : [0, ''] },
      borrow: ids.map((x) => methodById[x]?.name.split(' (')[0]) };
  }
  const eff = (id, ctx) => (id === 'me-custom' ? customOption(ctx.custom || []) : byId[id]);
  const pairKey = (a, b) => (dimIdx[a.dim] < dimIdx[b.dim] ? `${a.id}|${b.id}` : `${b.id}|${a.id}`);
  const cellKey = (da, db) => (dimIdx[da] < dimIdx[db] ? `${da}|${db}` : `${db}|${da}`);

  function evaluate(path, ctx = {}, opts = {}) {
    const chosen = dims.map((d) => (path[d.id] ? eff(path[d.id], ctx) : null));
    const openDims = dims.filter((d, i) => !chosen[i] || (chosen[i].id === 'me-custom' && !chosen[i].methods.length)).map((d) => d.id);
    const provided = new Map();
    for (const o of chosen) if (o) for (const t of o.provides) { if (!provided.has(t)) provided.set(t, []); provided.get(t).push(o); }
    const issues = new Map();
    const push = (k, v) => { if (!issues.has(k)) issues.set(k, []); issues.get(k).push(v); };
    const hardUnmet = new Map();
    const pending = [];
    for (const o of chosen) {
      if (!o) continue;
      for (const r of o.requires) {
        if (r.need.some((t) => provided.has(t))) continue;
        let level = r.level, reason = r.reason;
        if (r.alt && r.alt.tags.some((t) => provided.has(t))) { level = r.alt.level; reason = r.alt.reason; }
        const target = path[r.from];
        if (!target) { pending.push({ owner: o.id, from: r.from, reason }); continue; }
        push(cellKey(o.dim, r.from), { status: level, reason, repair: r.repair, type: 'logical', kind: 'requires', owner: o.id, method: r.method });
        if (level === 'conflict') hardUnmet.set(o.id, r);
      }
      for (const c of o.conflicts) {
        for (const p of provided.get(c.tag) || []) {
          if (p.id === o.id) continue;
          push(cellKey(o.dim, p.dim), { status: c.level, reason: c.reason, repair: c.repair, type: 'empirical', kind: 'conflicts', owner: o.id, method: c.method });
        }
      }
    }
    const cells = [];
    for (let i = 0; i < dims.length; i++) for (let j = 0; j < i; j++) {
      // lower triangle: row i, column j
      const a = chosen[i], b = chosen[j];
      const ck = cellKey(dims[i].id, dims[j].id);
      const cell = { key: ck, row: dims[i].id, col: dims[j].id, a: a?.id, b: b?.id, notes: [] };
      if (!a || !b) { cell.status = 'open'; cell.reason = 'One of the two dimensions has no option chosen yet.'; cells.push(cell); continue; }
      const pk = pairKey(a, b);
      const judged = ctx.judgments?.[pk];
      const rule = pairRules.get(a.id + '|' + b.id);
      const iss = issues.get(ck) || [];
      if (judged) {
        Object.assign(cell, { status: judged.status, reason: judged.note || 'Judged by you.', type: 'yours', source: 'you', issues: iss });
      } else if (rule) {
        Object.assign(cell, { status: rule.status, reason: rule.reason, type: rule.type, source: 'pair rule', repairs: rule.repair ? [rule.repair] : [], issues: [] });
      } else if (iss.length) {
        const worst = iss.reduce((m, x) => (RANK[x.status] > RANK[m.status] ? x : m), iss[0]);
        Object.assign(cell, { status: worst.status, reason: worst.reason, type: worst.type, source: 'tag rule', issues: iss, repairs: iss.map((x) => x.repair).filter(Boolean) });
      } else if (hardUnmet.has(a.id) || hardUnmet.has(b.id)) {
        const who = hardUnmet.has(a.id) ? a : b;
        const r = hardUnmet.get(who.id);
        Object.assign(cell, { status: 'unjudged', type: 'logical', source: 'cascade',
          reason: `No rule covers this pair, and “${who.label}” still lacks something it needs from ${dimLabel(r.from)}; until that is fixed this pair cannot be confirmed.`, repairs: r.repair ? [r.repair] : [] });
      } else {
        const shared = a.sourceVersions.filter((v) => b.sourceVersions.includes(v));
        Object.assign(cell, { status: 'ok', type: shared.length ? 'empirical' : 'logical', source: shared.length ? 'built together' : 'default',
          reason: shared.length ? `Built together in ${shared.join(', ')}.` : 'No rule applies and both options have what they need.' });
      }
      cells.push(cell);
    }
    const house = [];
    for (const o of chosen) if (o) for (const h of o.house || []) house.push({ key: 'house|' + o.dim + (h.method ? '|' + h.method : ''), opt: o.id, dim: o.dim, status: h.status, rule: h.rule, reason: h.reason, repairs: h.repair ? [h.repair] : [], method: h.method, type: 'normative' });

    let collisions = [];
    if (!opts.fast) {
      const ph = regions(path, ctx, 'phone'), dt = regions(path, ctx, 'desktop');
      collisions = [...ph.collisions.map((c) => ({ ...c, frame: 'phone' })), ...dt.collisions.map((c) => ({ ...c, frame: 'desktop' }))];
      const seen = new Set();
      collisions = collisions.filter((c) => { const k = c.a + c.b + c.slot; if (seen.has(k)) return false; seen.add(k); return true; });
      for (const c of collisions) {
        const A = byId[c.a] || eff(c.a, ctx), B = byId[c.b] || eff(c.b, ctx);
        const cell = cells.find((x) => x.key === cellKey(A.dim, B.dim));
        if (!cell) continue;
        cell.notes.push(c);
        if (cell.status === 'ok') { cell.status = 'adapt'; cell.auto = true; cell.source = 'auto'; cell.type = 'auto'; cell.reason = c.reason; cell.repairs = c.repair ? [c.repair] : []; }
      }
    }

    const all = [...cells.filter((c) => c.status !== 'open'), ...house];
    const counts = { ok: 0, adapt: 0, conflict: 0, unjudged: 0 };
    for (const c of all) counts[c.status]++;
    const budget = opts.fast ? null : budgets(chosen, all);
    if (budget && budget.files.status === 'over') counts.conflict++;
    if (budget && budget.files.status === 'tight' && budget.files.value > model.budgets.fileLimit) counts.adapt++;
    const verdict = makeVerdict(counts, openDims);
    return { chosen, cells, house, collisions, counts, openDims, pending, verdict, budget, hardUnmet: [...hardUnmet.keys()] };
  }

  function dimLabel(id) { return dims.find((d) => d.id === id)?.label.toLowerCase() || id; }

  function makeVerdict(c, open) {
    let level, text;
    if (open.length) { level = 'open'; text = `Incomplete · ${open.length} dimension${open.length > 1 ? 's' : ''} open`; }
    else if (c.conflict) { level = 'conflict'; text = `Not buildable · ${c.conflict} conflict${c.conflict > 1 ? 's' : ''}`; }
    else if (c.adapt) { level = 'adapt'; text = `Buildable · ${c.adapt} adaptation${c.adapt > 1 ? 's' : ''}`; }
    else { level = 'ok'; text = 'Buildable as chosen'; }
    if (c.unjudged) text += ` · ${c.unjudged} unjudged`;
    return { level, text };
  }

  function budgets(chosen, allCells) {
    const B = model.budgets;
    let files = B.base.files, js = B.base.js, lo = 0, hi = 0;
    const a11y = [], mobile = [];
    for (const o of chosen) {
      if (!o) continue;
      files += o.budget.files; js += o.budget.js; lo += o.budget.days[0]; hi += o.budget.days[1];
      if (o.budget.a11y[0]) a11y.push({ opt: o.id, level: o.budget.a11y[0], note: o.budget.a11y[1] });
      if (o.budget.mobile[0]) mobile.push({ opt: o.id, level: o.budget.mobile[0], note: o.budget.mobile[1] });
    }
    let alo = 0, ahi = 0, nAdapt = 0;
    for (const c of allCells) if (c.status === 'adapt') {
      nAdapt++;
      const d = (c.repairs || []).find((r) => r && r.days && !r.swap)?.days || (c.repairs || []).find((r) => r && r.days)?.days || DEFAULT_ADAPT_DAYS;
      alo += d[0]; ahi += d[1];
    }
    const fStatus = files > B.versionLimit ? 'over' : files > B.fileLimit ? 'tight' : files > 200 ? 'tight' : 'fits';
    const jsStatus = js > 2000 ? 'over' : js > 900 ? 'tight' : 'fits';
    const lvl = (arr) => {
      const score = arr.reduce((s, x) => s + x.level, 0);
      return arr.some((x) => x.level >= 2) || score >= 6 ? 'high' : score >= 3 ? 'medium' : 'low';
    };
    return {
      files: { value: files, limit: B.fileLimit, status: fStatus, publishes: Math.ceil(files / B.fileLimit) },
      js: { value: js, status: jsStatus },
      effort: { lo: +(lo + alo).toFixed(1), hi: +(hi + ahi).toFixed(1), optLo: lo, optHi: hi, adaptLo: alo, adaptHi: ahi, nAdapt },
      a11y: { level: lvl(a11y), items: a11y },
      mobile: { level: lvl(mobile), items: mobile },
    };
  }

  // ------------------------------------------------------------ blueprint regions + automatic slot collisions
  function regions(path, ctx, kind) {
    const layoutId = path.layout || 'layout-doc';
    const frame = model.frames[layoutId];
    const slots = frame[kind];
    const out = [];
    for (const d of dims) {
      const id = path[d.id];
      if (!id) continue;
      const o = eff(id, ctx);
      for (const r0 of o.regions || []) {
        let r = { ...r0 };
        if (kind === 'phone' && r0.phone) r = { ...r0, ...r0.phone };
        let slot = r.slot, displaced = false;
        if (slot === 'inline') slot = 'body';
        if (!slots[slot]) { displaced = slot; slot = slot === 'overlay' ? 'body' : 'body'; }
        out.push({ opt: o.id, dim: d.id, slot, label: r.label, excl: !!r.excl && !displaced, w: r.w || 60, key: r.key, motion: !!r.motion, displaced });
      }
    }
    const collisions = [];
    const bySlot = {};
    for (const r of out) (bySlot[r.slot] = bySlot[r.slot] || []).push(r);
    for (const slot of ['hero', 'bottom', 'corner']) {
      const ex = (bySlot[slot] || []).filter((r) => r.excl);
      for (let i = 0; i < ex.length; i++) for (let j = i + 1; j < ex.length; j++) {
        const A = ex[i], B = ex[j];
        if (A.opt === B.opt || (A.key && A.key === B.key)) continue;
        collisions.push({ a: A.opt, b: B.opt, slot, reason: `Both claim the ${slot === 'hero' ? 'first screen' : slot === 'bottom' ? 'bottom bar' : 'bottom-left corner'} on ${kind === 'phone' ? 'a 390 px phone' : 'desktop'}: “${A.label}” and “${B.label}”.`, repair: { text: `Move one of them (detected from the blueprint)`, days: [0.25, 1] } });
      }
    }
    const top = bySlot.top || [];
    const cap = model.topCap[kind];
    let used = 0;
    for (const r of top) {
      used += r.w;
      r.overflow = used > cap;
    }
    if (used > cap) {
      const owners = [...new Set(top.map((r) => r.opt))];
      if (owners.length > 1) {
        const first = top[0].opt;
        const over = top.find((r) => r.overflow && r.opt !== first) || top.find((r) => r.overflow);
        if (over && over.opt !== first) collisions.push({ a: first, b: over.opt, slot: 'top', reason: `The top bar overflows on ${kind === 'phone' ? 'a 390 px phone' : 'desktop'}: ${top.map((r) => r.label).join(' + ')}.`, repair: { text: 'Fold items into one menu', days: [0.5, 1] } });
      }
    }
    return { layoutId, frame, slots, regions: out, collisions, topUsed: used, topCap: cap };
  }

  // ------------------------------------------------------------ deltas, repairs, sampling
  function deltas(path, ctx) {
    const base = evaluate(path, ctx, { fast: true });
    const res = {};
    for (const d of dims) {
      for (const o of model.options.filter((x) => x.dim === d.id)) {
        if (path[d.id] === o.id) continue;
        const e = evaluate({ ...path, [d.id]: o.id }, ctx, { fast: true });
        res[o.id] = { conflict: e.counts.conflict - base.counts.conflict, adapt: e.counts.adapt - base.counts.adapt, unjudged: e.counts.unjudged - base.counts.unjudged, verdict: e.verdict };
      }
    }
    return res;
  }

  function repairs(path, ctx, prefs = {}) {
    const base = evaluate(path, ctx, { fast: true });
    if (!base.counts.conflict) return [];
    const v4 = model.paths.v4;
    const score = (changes, e) => changes.length * 100 + e.counts.adapt * 4 + e.counts.unjudged * 2
      + changes.reduce((s, [d, id]) => s + (prefs.approvals?.[id] === 'reject' ? 40 : prefs.approvals?.[id] === 'approve' ? -6 : 0) + (v4[d] === id ? 0 : 1), 0);
    const found = [];
    const alts = Object.fromEntries(dims.map((d) => [d.id, model.options.filter((o) => o.dim === d.id && o.id !== path[d.id] && o.id !== 'me-custom').map((o) => o.id)]));
    for (const d of dims) for (const id of alts[d.id]) {
      const e = evaluate({ ...path, [d.id]: id }, ctx, { fast: true });
      if (!e.counts.conflict) found.push({ changes: [[d.id, id]], counts: e.counts, score: score([[d.id, id]], e) });
    }
    if (found.length < 3) {
      for (let i = 0; i < dims.length; i++) for (let j = i + 1; j < dims.length; j++) {
        for (const x of alts[dims[i].id]) for (const y of alts[dims[j].id]) {
          const ch = [[dims[i].id, x], [dims[j].id, y]];
          if (found.some((f) => f.changes.length === 1 && ch.some(([d, id]) => f.changes[0][0] === d && f.changes[0][1] === id))) continue;
          const e = evaluate({ ...path, [dims[i].id]: x, [dims[j].id]: y }, ctx, { fast: true });
          if (!e.counts.conflict) found.push({ changes: ch, counts: e.counts, score: score(ch, e) });
        }
      }
    }
    return found.sort((a, b) => a.score - b.score).slice(0, 6);
  }

  function sample(ctx, n = 3000) {
    let ok = 0, total = 1;
    const lists = dims.map((d) => model.options.filter((o) => o.dim === d.id).map((o) => o.id));
    for (const l of lists) total *= l.length;
    for (let k = 0; k < n; k++) {
      const p = {};
      dims.forEach((d, i) => { p[d.id] = lists[i][Math.floor(Math.random() * lists[i].length)]; });
      if (!evaluate(p, ctx, { fast: true }).counts.conflict) ok++;
    }
    return { ok, n, total, share: ok / n };
  }

  return { evaluate, deltas, repairs, sample, regions, eff, byId, dimIdx, pairKey, cellKey, customOption };
}

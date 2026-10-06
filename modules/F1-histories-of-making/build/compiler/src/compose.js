// Guided composer: one decision per step. Each option is a large card showing a close-up of the actual component.
// Under the cards: how your pick differs from any other option, how it sits with your other picks (with one-tap fixes),
// what pairs well with it, and small ideas you can borrow from the options you did not pick. The last step is a summary wall.
import { $, $$, esc, announce, copyText, VNAME } from './util.js';

const IDEA = { weak: 1, sound: 2, strong: 3 };
const QUAL = { unbuilt: 0, rough: 1, working: 2, polished: 3 };
const QUAL_TXT = { unbuilt: 'Not built yet', rough: 'Rough', working: 'Working', polished: 'Polished' };
const EFFORT_TXT = { S: 'Small', M: 'Medium', L: 'Large' };
const PRANK = { '-': 0, S: 1, '+': 2 };
const PTXT = { '+': 'better than v4', S: 'same as v4', '-': 'weaker than v4' };
const RANK = { ok: 0, open: 0, unjudged: 1, adapt: 2, conflict: 3 };

export function createComposer(app, root) {
  const { model, state, engine } = app;
  const dims = model.dims;
  const byId = engine.byId;
  const N = dims.length;
  const crit = model.criteria;
  const opts = (dim) => model.options.filter((o) => o.dim === dim && o.id !== 'me-custom');
  const dimOf = (id) => dims.find((d) => d.id === id);
  const vlist = (o) => (o.sourceVersions.length ? o.sourceVersions.map((v) => VNAME[v] || v).join(', ') : 'not built yet');

  const cropSrc = (id, still) => `crops/${id}${still && app.crops[id]?.anim ? '-still' : ''}.webp`;
  const crop = (o, eager) => {
    const c = app.crops[o.id];
    const alt = `${o.label}: ${c?.caption || ''}`;
    if (!c) return `<span class="no-img">${esc(o.label)}</span>`;
    return c.anim
      ? `<picture><source media="(prefers-reduced-motion: reduce)" srcset="${cropSrc(o.id, true)}"><img src="${cropSrc(o.id)}" alt="${esc(alt)}" ${eager ? '' : 'loading="lazy"'}></picture>`
      : `<img src="${cropSrc(o.id)}" alt="${esc(alt)}" ${eager ? '' : 'loading="lazy"'} decoding="async">`;
  };
  const dots = (n, of = 3) => `<span class="dots" aria-hidden="true">${Array.from({ length: of }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;

  // ---------------------------------------------------------------- analysis
  const memo = new Map();
  const evalFast = (path) => {
    const k = JSON.stringify(path);
    if (!memo.has(k)) { if (memo.size > 400) memo.clear(); memo.set(k, app.evaluate(path, true)); }
    return memo.get(k);
  };
  const issuesFor = (e, dim) => [
    ...e.cells.filter((c) => (c.row === dim || c.col === dim) && c.status !== 'ok' && c.status !== 'open'),
    ...e.house.filter((h) => h.dim === dim && h.status !== 'ok'),
  ];
  const worst = (list) => list.reduce((m, c) => (RANK[c.status] > RANK[m] ? c.status : m), 'ok');
  const otherDim = (c, dim) => (c.row === dim ? c.col : c.col === dim ? c.row : null);

  function fitOf(dim, id) {
    const e = evalFast({ ...state.path, [dim]: id });
    const iss = issuesFor(e, dim);
    const status = worst(iss);
    const withDims = [...new Set(iss.map((c) => otherDim(c, dim)).filter(Boolean))].map((d) => dimOf(d).label);
    const house = iss.some((c) => c.rule);
    let text;
    if (status === 'ok') text = 'Fits all your other picks';
    else if (status === 'conflict') text = `Clashes with ${list(withDims) || 'a house rule'}`;
    else if (status === 'adapt') text = `Needs a tweak with ${list(withDims) || (house ? 'a house rule' : 'another pick')}`;
    else text = `Unconfirmed with ${list(withDims)}`;
    return { status, text, iss };
  }
  const list = (a) => (a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);

  function score(dim, o) {
    const d = dimOf(dim);
    const fit = fitOf(dim, o.id);
    const pv = (o.pugh || '').split('');
    const nConf = fit.iss.filter((c) => c.status === 'conflict').length;
    const nAd = fit.iss.filter((c) => c.status === 'adapt').length;
    const s = IDEA[o.idea] * 2 + QUAL[o.quality] + pv.reduce((a, c) => a + (c === '+' ? 1 : c === '-' ? -1 : 0), 0)
      - ({ S: 0, M: 0.5, L: 1.5 }[o.effort] || 0) - nConf * 6 - nAd * 1.5 - (fit.status === 'unjudged' ? 0.5 : 0);
    const why = [];
    if (o.idea === 'strong') why.push('one of the strongest ideas');
    if (o.quality === 'polished') why.push(`already polished in ${vlist(o)}`);
    const plus = d.criteria.filter((c, i) => pv[i] === '+').map((c) => crit[c].label.toLowerCase());
    if (plus.length) why.push(`better than v4 on “${plus.join('”, “')}”`);
    if (fit.status === 'ok') why.push('fits all your other picks');
    if (o.effort === 'S') why.push('cheap to build');
    return { s, why, fit };
  }
  function recommend(dim) {
    let best = null;
    for (const o of opts(dim)) { const r = score(dim, o); if (!best || r.s > best.s) best = { ...r, o }; }
    return best;
  }

  // ---------------------------------------------------------------- stepper
  function stepper(e) {
    return `<ol class="steps" aria-label="Decisions">${dims.map((d, i) => {
      const o = byId[state.path[d.id]];
      const st = worst(issuesFor(e, d.id));
      return `<li><button type="button" class="step ${i === state.step ? 'on' : ''} st-${st}" data-go="${i}" ${i === state.step ? 'aria-current="step"' : ''} aria-label="Step ${i + 1}, ${esc(d.label)}: ${esc(o?.label || 'open')}${st !== 'ok' ? ', ' + (st === 'conflict' ? 'clash' : 'needs a tweak') : ''}">
        <span class="step-img">${o ? `<img src="${cropSrc(o.id, true)}" alt="" loading="lazy">` : ''}</span>
        <span class="step-txt"><span class="step-n">${i + 1}</span> ${esc(d.label)}</span>
        ${st !== 'ok' ? app.glyph(st, 'step-g') : ''}
      </button></li>`;
    }).join('')}
    <li><button type="button" class="step sum ${state.step === N ? 'on' : ''}" data-go="${N}" ${state.step === N ? 'aria-current="step"' : ''}><span class="step-img sum-ic" aria-hidden="true">▦</span><span class="step-txt">Summary</span></button></li></ol>`;
  }

  // ---------------------------------------------------------------- one decision
  function card(d, o, rec) {
    const chosen = state.path[d.id] === o.id;
    const fit = fitOf(d.id, o.id);
    const inV4 = app.v4path[d.id] === o.id;
    const cmp = cmpTarget(d) === o.id && !chosen;
    return `<article class="card ${chosen ? 'chosen' : ''} ${cmp ? 'comparing' : ''}" data-opt="${o.id}" id="card-${o.id}">
      <button type="button" class="card-img" data-zoom="${o.id}" aria-label="Enlarge the close-up of ${esc(o.label)}">${crop(o)}<span class="zoom-ic" aria-hidden="true">⤢</span></button>
      <div class="badges">${chosen ? '<span class="badge pick">✓ Your pick</span>' : ''}${rec.o.id === o.id ? '<span class="badge rec">★ Recommended</span>' : ''}${inV4 ? '<span class="badge v4">In v4</span>' : ''}</div>
      <div class="card-body">
        <h3>${esc(o.label)}</h3>
        <p class="src">From ${esc(vlist(o))}</p>
        <p class="what">${esc(o.what)}</p>
        <div class="meters">
          <span title="Strength of the idea">Idea ${dots(IDEA[o.idea])} <em>${esc(o.idea)}</em></span>
          <span title="How finished it is">Build ${dots(QUAL[o.quality])} <em>${esc(QUAL_TXT[o.quality].toLowerCase())}</em></span>
          <span title="Effort to adopt">Effort <em>${esc(EFFORT_TXT[o.effort] || o.effort)}</em></span>
        </div>
        <p class="fit st-${fit.status}">${app.glyph(fit.status)}<span>${esc(fit.text)}</span></p>
      </div>
      <div class="card-actions">
        ${chosen ? '<span class="btn ghost" aria-hidden="true">Chosen</span>' : `<button type="button" class="btn primary" data-choose="${o.id}">Choose this</button>`}
        ${chosen ? '' : `<button type="button" class="btn" data-cmp="${o.id}" aria-pressed="${cmp}">${cmp ? 'Comparing' : 'Compare'}</button>`}
      </div>
    </article>`;
  }

  function cmpTarget(d) {
    const pick = state.path[d.id];
    const want = state.cmpWith[d.id];
    if (want && want !== pick) return want;
    const rec = recommend(d.id).o.id;
    if (rec !== pick) return rec;
    if (app.v4path[d.id] && app.v4path[d.id] !== pick) return app.v4path[d.id];
    // otherwise the runner-up: the best-scoring option that is not your pick
    return opts(d.id).filter((o) => o.id !== pick).map((o) => [o.id, score(d.id, o).s]).sort((a, b) => b[1] - a[1])[0]?.[0];
  }

  function diffPanel(d) {
    const A = byId[state.path[d.id]], B = byId[cmpTarget(d)];
    if (!A || !B) return '';
    const pa = (A.pugh || '').split(''), pb = (B.pugh || '').split('');
    const better = [], worse = [];
    d.criteria.forEach((c, i) => {
      const x = PRANK[pa[i]] ?? 1, y = PRANK[pb[i]] ?? 1;
      if (y > x) better.push(crit[c].label); else if (y < x) worse.push(crit[c].label);
    });
    const fa = fitOf(d.id, A.id), fb = fitOf(d.id, B.id);
    const q = (a) => list(a.map((x) => `“${x}”`));
    let gist = `Compared with your pick, <strong>${esc(B.label)}</strong> `;
    if (better.length || worse.length) gist += [better.length ? `is stronger on ${esc(q(better))}` : '', worse.length ? `${better.length ? '' : 'is '}weaker on ${esc(q(worse))}` : ''].filter(Boolean).join(' but ');
    else gist += 'scores the same on this step’s criteria';
    gist += '.';
    if (RANK[fb.status] > RANK[fa.status]) gist += ` Swapping would cost you: it ${fb.status === 'conflict' ? 'clashes' : 'needs a tweak'} with ${esc(fb.text.replace(/^(Clashes with|Needs a tweak with|Unconfirmed with) /, ''))}.`;
    else if (RANK[fb.status] < RANK[fa.status]) gist += fb.status === 'ok' ? ' It would also fit all your other picks, which yours does not.' : ' It would fit your other picks a little better.';
    const row = (label, a, b, same) => `<tr class="${same ? 'same' : 'diff'}"><th scope="row">${label}</th><td>${a}</td><td>${b}</td></tr>`;
    const crow = d.criteria.map((c, i) => row(esc(crit[c].label), pchip(pa[i]), pchip(pb[i]), pa[i] === pb[i])).join('');
    const others = opts(d.id).filter((o) => o.id !== A.id);
    return `<section class="panel diff" aria-labelledby="h-diff">
      <div class="panel-head"><h3 id="h-diff">How your pick differs</h3>
        <div class="chips" role="group" aria-label="Compare your pick with">${others.map((o) => `<button type="button" class="chip" data-cmp="${o.id}" aria-pressed="${o.id === B.id}">${esc(short(o.label))}</button>`).join('')}</div></div>
      <p class="gist">${gist}</p>
      <div class="tbl-wrap"><table class="dtab">
        <thead><tr><th scope="col"><span class="sr-only">Aspect</span></th><th scope="col"><span class="tag pick">Your pick</span>${esc(A.label)}</th><th scope="col"><span class="tag">Compared</span>${esc(B.label)}</th></tr></thead>
        <tbody>
          <tr class="imgs"><th scope="row">Close-up</th><td><button type="button" class="dimg" data-zoom="${A.id}" aria-label="Enlarge ${esc(A.label)}">${crop(A)}</button></td><td><button type="button" class="dimg" data-zoom="${B.id}" aria-label="Enlarge ${esc(B.label)}">${crop(B)}</button></td></tr>
          ${row('The idea', esc(A.what), esc(B.what))}
          ${row('What worked', esc(A.worked), esc(B.worked))}
          ${row('Weak spot', esc(A.weaknesses), esc(B.weaknesses))}
          ${crow}
          ${row('Idea · build', `${dots(IDEA[A.idea])} ${esc(A.idea)} · ${esc(QUAL_TXT[A.quality].toLowerCase())}`, `${dots(IDEA[B.idea])} ${esc(B.idea)} · ${esc(QUAL_TXT[B.quality].toLowerCase())}`, A.idea === B.idea && A.quality === B.quality)}
          ${row('Effort', `${esc(EFFORT_TXT[A.effort])} · ${days(A)}`, `${esc(EFFORT_TXT[B.effort])} · ${days(B)}`, A.effort === B.effort)}
          ${row('With your other picks', `${app.glyph(fa.status)} ${esc(fa.text)}`, `${app.glyph(fb.status)} ${esc(fb.text)}`, fa.status === fb.status)}
        </tbody></table></div>
      <div class="diff-act"><button type="button" class="btn" data-choose="${B.id}">Switch to ${esc(short(B.label))}</button></div>
    </section>`;
  }
  const short = (s) => (s.length > 34 ? s.slice(0, 32).replace(/[\s,·(]+\S*$/, '') + '…' : s);
  const pchip = (c) => `<span class="pchip p${c === '+' ? 'up' : c === '-' ? 'dn' : 'eq'}">${c === '+' ? '▲' : c === '-' ? '▼' : '='} ${PTXT[c] || 'not rated'}</span>`;
  const days = (o) => { const [lo, hi] = o.budget?.days || [0, 0]; return hi ? `${lo}–${hi} days` : 'no new work'; };

  function repairBtns(c) {
    return (c.repairs || []).filter(Boolean).map((r) => {
      if (r.swap) {
        const [dd, id] = Object.entries(r.swap)[0];
        if (!byId[id] || state.path[dd] === id) return r.text ? `<span class="fixtxt">${esc(r.text)}</span>` : '';
        return `<button type="button" class="btn small fix" data-swap="${dd}:${id}">Fix: switch ${esc(dimOf(dd).label)} to “${esc(short(byId[id].label))}”</button>`;
      }
      return r.text ? `<span class="fixtxt">Fix: ${esc(r.text)}${r.days ? ` (${r.days[0]}–${r.days[1]} d)` : ''}</span>` : '';
    }).join('');
  }

  function fitPanel(d, e) {
    const pick = byId[state.path[d.id]];
    const iss = issuesFor(e, d.id);
    const rows = dims.filter((x) => x.id !== d.id).map((x) => {
      const c = e.cells.find((c) => (c.row === d.id && c.col === x.id) || (c.col === d.id && c.row === x.id));
      const st = c?.status || 'open';
      return { x, c, st };
    });
    const bad = rows.filter((r) => r.st !== 'ok' && r.st !== 'open');
    const good = rows.filter((r) => r.st === 'ok');
    const house = iss.filter((h) => h.rule);
    // pairs well with: proven combinations and fixes
    const sug = [];
    for (const x of dims) {
      if (x.id === d.id) continue;
      const cur = state.path[x.id];
      const curSt = rows.find((r) => r.x.id === x.id)?.st || 'ok';
      for (const o of opts(x.id)) {
        if (o.id === cur) continue;
        const proven = o.sourceVersions.some((v) => pick.sourceVersions.includes(v));
        const e2 = evalFast({ ...state.path, [x.id]: o.id });
        if (e2.counts.conflict > e.counts.conflict || e2.counts.adapt > e.counts.adapt) continue;
        const c2 = e2.cells.find((c) => (c.row === d.id && c.col === x.id) || (c.col === d.id && c.row === x.id));
        const fixes = RANK[curSt] > 0 && c2 && c2.status === 'ok';
        if (!fixes && !proven) continue;
        const gain = e.counts.conflict - e2.counts.conflict + (e.counts.adapt - e2.counts.adapt) * 0.5;
        sug.push({ x, o, fixes, proven, rank: (fixes ? 10 : 0) + gain * 3 + IDEA[o.idea] + QUAL[o.quality] });
      }
    }
    sug.sort((a, b) => b.rank - a.rank);
    const seen = new Set();
    const top = sug.filter((s) => (seen.has(s.x.id) ? false : (seen.add(s.x.id), true))).slice(0, 4);
    return `<section class="panel fitp" aria-labelledby="h-fit">
      <h3 id="h-fit">With your other picks</h3>
      ${bad.length || house.length ? `<ul class="issues">${bad.map((r) => `<li class="st-${r.st}">${app.glyph(r.st)}<div><p><strong>${esc(r.x.label)}:</strong> ${esc(byId[state.path[r.x.id]]?.label || '')}</p><p class="why">${esc(r.c.reason)}</p><div class="fixes">${repairBtns(r.c)}<button type="button" class="btn small ghost" data-go="${dims.indexOf(r.x)}">Go to ${esc(r.x.label)}</button></div></div></li>`).join('')}
        ${house.map((h) => `<li class="st-${h.status}">${app.glyph(h.status)}<div><p><strong>House rule:</strong> ${esc(model.houseRules[h.rule] || h.rule)}</p><p class="why">${esc(h.reason)}</p><div class="fixes">${repairBtns(h)}</div></div></li>`).join('')}</ul>`
        : `<p class="allgood">${app.glyph('ok')} Fits all ${good.length} of your other picks.</p>`}
      ${bad.length || house.length ? `<p class="okline">${app.glyph('ok')} Fine with ${esc(list(good.map((r) => r.x.label)))}.</p>` : ''}
      ${top.length ? `<h4>Pairs well with</h4><ul class="sugs">${top.map((s) => `<li><button type="button" class="sug" data-swap="${s.x.id}:${s.o.id}"><img src="${cropSrc(s.o.id, true)}" alt="" loading="lazy"><span><span class="eyebrow">${esc(s.x.label)} · ${s.fixes ? 'fixes a problem' : 'built together in ' + esc(s.o.sourceVersions.filter((v) => pick.sourceVersions.includes(v)).map((v) => VNAME[v]).join(', '))}</span>${esc(s.o.label)}</span><span class="sug-act">Use</span></button></li>`).join('')}</ul>` : ''}
    </section>`;
  }

  function borrowPanel(d) {
    const pick = state.path[d.id];
    const groups = opts(d.id).filter((o) => o.id !== pick && (o.borrow || []).length);
    if (!groups.length) return '';
    const sel = new Set(state.borrow[d.id] || []);
    return `<section class="panel borrowp" aria-labelledby="h-borrow">
      <h3 id="h-borrow">Borrow ideas from the other options</h3>
      <p class="muted small">Keep your pick and add a piece of another. Ticked ideas go into the summary and the brief.</p>
      <div class="bgroups">${groups.map((o) => `<div class="bgroup"><div class="bg-head"><img src="${cropSrc(o.id, true)}" alt="" loading="lazy"><span>${esc(o.label)}<span class="muted"> · ${esc(vlist(o))}</span></span></div>
        <div class="bchips">${o.borrow.map((b, i) => { const k = `${o.id}#${i}`; return `<button type="button" class="bchip" data-borrow="${k}" aria-pressed="${sel.has(k)}"><span aria-hidden="true">${sel.has(k) ? '✓' : '+'}</span> ${esc(b)}</button>`; }).join('')}</div></div>`).join('')}</div>
    </section>`;
  }

  function stepView(e) {
    const d = dims[state.step];
    const rec = recommend(d.id);
    const pick = byId[state.path[d.id]];
    const recSame = rec.o.id === pick?.id;
    return `<div class="step-head">
        <p class="eyebrow">Step ${state.step + 1} of ${N}</p>
        <h1 tabindex="-1">${esc(d.label)}</h1>
        <p class="q">${esc(d.question)}</p>
        <p class="judged"><span class="muted">Judged on</span> ${d.criteria.map((c) => `<span class="chip" title="${esc(crit[c].q)}">${esc(crit[c].label)}</span>`).join('')}</p>
      </div>
      <div class="recline ${recSame ? 'same' : ''}">
        <span class="rec-star" aria-hidden="true">★</span>
        <p>${recSame ? `Your pick is also the recommended one: <strong>${esc(rec.o.label)}</strong>, ${esc(list(rec.why))}.` : `Recommended: <strong>${esc(rec.o.label)}</strong>, ${esc(list(rec.why))}.`}</p>
        ${recSame ? '' : `<button type="button" class="btn accent" data-choose="${rec.o.id}">Use it</button>`}
      </div>
      <div class="cards">${opts(d.id).map((o) => card(d, o, rec)).join('')}</div>
      <div class="detail">
        ${diffPanel(d)}
        <div class="detail-side">
          ${fitPanel(d, e)}
          <section class="panel notep"><label for="note-${d.id}"><h3>Your note</h3></label><textarea id="note-${d.id}" data-note="${d.id}" rows="3" placeholder="Why this one? Anything to change?">${esc(state.notes[d.id] || '')}</textarea></section>
        </div>
      </div>
      ${borrowPanel(d)}
      <nav class="step-nav" aria-label="Step navigation">
        <button type="button" class="btn" data-go="${state.step - 1}" ${state.step === 0 ? 'disabled' : ''}>‹ ${state.step ? esc(dims[state.step - 1].label) : 'Back'}</button>
        <button type="button" class="btn primary" data-go="${state.step + 1}">${state.step + 1 < N ? esc(dims[state.step + 1].label) : 'Summary'} ›</button>
      </nav>`;
  }

  // ---------------------------------------------------------------- summary
  function summaryView(e) {
    const lvl = e.verdict.level;
    const b = e.budget;
    const all = [...e.cells.filter((c) => c.status !== 'ok' && c.status !== 'open'), ...e.house.filter((h) => h.status !== 'ok')]
      .sort((a, c) => RANK[c.status] - RANK[a.status]);
    const borrowed = dims.flatMap((d) => (state.borrow[d.id] || []).map((k) => ({ d, k })));
    const changed = dims.filter((d) => state.path[d.id] !== app.v4path[d.id]);
    return `<div class="step-head"><p class="eyebrow">Your concept</p><h1 tabindex="-1">Summary</h1>
      <p class="q">Twelve decisions on one wall. Click any tile to revisit it.</p></div>
      <div class="verdict-banner ${lvl}">
        ${app.glyph(lvl, 'big')}
        <div><p class="vb-title">${esc(lvl === 'ok' ? 'Buildable as chosen' : lvl === 'adapt' ? 'Buildable, with small tweaks' : lvl === 'conflict' ? 'Not buildable yet' : 'Incomplete')}</p>
        <p class="vb-sub">${esc(e.verdict.text)}${b ? ` · about ${b.effort.lo}–${b.effort.hi} working days from today’s v4 · ${b.files.value} of ${b.files.limit} files` : ''} · ${changed.length ? `${changed.length} change${changed.length > 1 ? 's' : ''} from v4` : 'identical to v4'}${borrowed.length ? ` · ${borrowed.length} borrowed idea${borrowed.length > 1 ? 's' : ''}` : ''}</p></div>
      </div>
      <div class="wall">${dims.map((d, i) => {
        const o = byId[state.path[d.id]];
        const st = worst(issuesFor(e, d.id));
        const nb = (state.borrow[d.id] || []).length;
        return `<button type="button" class="tile st-${st}" data-go="${i}"><span class="tile-img">${crop(o)}</span>
          <span class="tile-txt"><span class="eyebrow">${i + 1} · ${esc(d.label)}${state.path[d.id] !== app.v4path[d.id] ? ' · changed' : ''}</span><strong>${esc(o.label)}</strong>${nb ? `<span class="tile-b">+ ${nb} borrowed</span>` : ''}</span>
          ${st !== 'ok' ? app.glyph(st, 'tile-g') : ''}</button>`;
      }).join('')}</div>
      <div class="sum-grid">
        <section class="panel"><h3>${all.length ? 'To resolve' : 'Nothing to resolve'}</h3>
          ${all.length ? `<ul class="issues">${all.map((c) => {
            const ds = c.rule ? [dimOf(c.dim).label] : [dimOf(c.row).label, dimOf(c.col).label];
            return `<li class="st-${c.status}">${app.glyph(c.status)}<div><p><strong>${esc(ds.join(' × '))}${c.rule ? ' · house rule' : ''}</strong></p><p class="why">${esc(c.reason)}</p><div class="fixes">${repairBtns(c)}</div></div></li>`;
          }).join('')}</ul>` : `<p class="allgood">${app.glyph('ok')} Every pair of choices works together.</p>`}
        </section>
        <section class="panel"><h3>Borrowed ideas</h3>
          ${borrowed.length ? `<ul class="blist">${borrowed.map(({ d, k }) => { const [oid, i] = k.split('#'); const o = byId[oid]; return `<li><span class="eyebrow">${esc(d.label)}</span> ${esc(o.borrow[+i])} <span class="muted">from ${esc(short(o.label))}</span> <button type="button" class="linkbtn" data-borrow="${k}" data-d="${d.id}" aria-label="Remove ${esc(o.borrow[+i])}">Remove</button></li>`; }).join('')}</ul>` : '<p class="muted">None yet. Each step has a “Borrow ideas” list under the cards.</p>'}
          <h3 class="mt">Start again from</h3>
          <div class="chips">${['v4', 'v3', 'atlas'].filter((v) => model.paths[v]).map((v) => `<button type="button" class="chip" data-preset="${v}">${esc(VNAME[v])}’s choices</button>`).join('')}<button type="button" class="chip" data-preset="rec">Every recommendation</button></div>
        </section>
      </div>
      <section class="panel briefp"><div class="panel-head"><h3>Brief</h3><div class="chips"><button type="button" class="btn small" data-copy>Copy</button><button type="button" class="btn small" data-dl>Download .md</button></div></div>
        <pre class="brief" id="briefPre">${esc(brief(e))}</pre><textarea class="sr-only" id="copyFallback" hidden aria-hidden="true"></textarea></section>
      <nav class="step-nav"><button type="button" class="btn" data-go="${N - 1}">‹ ${esc(dims[N - 1].label)}</button><button type="button" class="btn" data-view="versions">See the versions</button></nav>`;
  }

  function brief(e) {
    const b = e.budget;
    const lines = [`# Edo concept, composed ${new Date().toISOString().slice(0, 10)}`, '',
      `Verdict: ${e.verdict.text}${b ? `. Effort about ${b.effort.lo}–${b.effort.hi} working days from v4; ${b.files.value} of ${b.files.limit} files.` : '.'}`, '', '## Decisions', ''];
    for (const d of dims) {
      const o = byId[state.path[d.id]];
      lines.push(`### ${d.label}: ${o.label}${state.path[d.id] === app.v4path[d.id] ? ' (as v4)' : ` (changed from v4: ${byId[app.v4path[d.id]]?.label || 'none'})`}`);
      lines.push(`From ${vlist(o)}. ${o.what}`);
      const bs = (state.borrow[d.id] || []).map((k) => { const [oid, i] = k.split('#'); return `${byId[oid].borrow[+i]} (from ${byId[oid].label})`; });
      if (bs.length) lines.push(`Borrowed: ${bs.join('; ')}.`);
      if (state.notes[d.id]) lines.push(`Note: ${state.notes[d.id].trim()}`);
      lines.push('');
    }
    const all = [...e.cells.filter((c) => c.status !== 'ok' && c.status !== 'open'), ...e.house.filter((h) => h.status !== 'ok')];
    if (all.length) {
      lines.push('## To resolve', '');
      for (const c of all) {
        const ds = c.rule ? `${dimOf(c.dim).label} (house rule)` : `${dimOf(c.row).label} × ${dimOf(c.col).label}`;
        const fix = (c.repairs || []).filter(Boolean).map((r) => r.swap ? `switch ${Object.keys(r.swap)[0]} to ${byId[Object.values(r.swap)[0]]?.label}` : r.text).filter(Boolean)[0];
        lines.push(`- ${c.status === 'conflict' ? 'Clash' : c.status === 'adapt' ? 'Tweak' : 'Unconfirmed'}: ${ds}. ${c.reason}${fix ? ` Fix: ${fix}.` : ''}`);
      }
    }
    return lines.join('\n');
  }

  // ---------------------------------------------------------------- render + events
  function render(opts2 = {}) {
    const y = window.scrollY;
    const e = app.refreshVerdict();
    const summary = state.step >= N;
    root.innerHTML = `<div class="c-top">
        <p class="c-intro">${state.step === 0 && !summary ? 'You start from v4’s choices. Change any step; every card says whether it fits the rest.' : ''}</p>
        ${stepper(e)}</div>
      <div class="c-body">${summary ? summaryView(e) : stepView(e)}</div>`;
    if (summary) app.store.write('brief/current', { markdown: brief(e) }, 1200);
    if (opts2.keepScroll) window.scrollTo({ top: y });
    const strip = $('.steps', root), on = $('.step.on', root);
    if (strip && on) strip.scrollLeft = on.parentElement.offsetLeft - strip.clientWidth / 2 + on.offsetWidth / 2;
    if (opts2.focusOpt) {
      const c = $('#card-' + opts2.focusOpt, root);
      if (c) { c.scrollIntoView({ block: 'center' }); c.classList.add('flash'); setTimeout(() => c.classList.remove('flash'), 1600); }
    }
  }

  function choose(dim, id, msg) {
    state.path[dim] = id;
    app.saveDim(dim);
    render({ keepScroll: true });
    announce(msg || `${dimOf(dim).label}: ${byId[id].label} chosen. ${app.evaluate(undefined, true).verdict.text}`);
  }

  function preset(p) {
    if (p === 'rec') {
      for (const d of dims) state.path[d.id] = recommend(d.id).o.id;
      for (const d of dims) state.path[d.id] = recommend(d.id).o.id; // second pass settles picks that depended on later steps
    } else Object.assign(state.path, Object.fromEntries(dims.map((d) => [d.id, model.paths[p][d.id] === 'me-custom' ? app.v4path[d.id] : model.paths[p][d.id]])));
    dims.forEach((d) => app.saveDim(d.id));
    render({ keepScroll: true });
    announce(p === 'rec' ? 'Every recommendation applied' : `Reset to ${VNAME[p]}’s choices`);
  }

  root.addEventListener('click', async (ev) => {
    const t = ev.target.closest('[data-go],[data-choose],[data-cmp],[data-zoom],[data-swap],[data-borrow],[data-preset],[data-copy],[data-dl],[data-view]');
    if (!t || t.disabled) return;
    const d = dims[state.step];
    if (t.dataset.go !== undefined) {
      state.step = Math.max(0, Math.min(N, +t.dataset.go));
      app.saveSession();
      render();
      window.scrollTo({ top: 0 });
      $('.c-body h1', root)?.focus?.();
    } else if (t.dataset.choose) choose(byId[t.dataset.choose].dim, t.dataset.choose);
    else if (t.dataset.cmp) {
      state.cmpWith[d.id] = t.dataset.cmp;
      render({ keepScroll: true });
      if (t.classList.contains('btn')) $('.diff', root)?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    } else if (t.dataset.zoom) {
      const o = byId[t.dataset.zoom];
      const set = opts(o.dim);
      app.lightbox.open(set.map((x) => {
        const c = app.crops[x.id] || {};
        return { src: cropSrc(x.id), still: c.anim ? cropSrc(x.id, true) : null, title: x.label, sub: `${c.caption || ''}${state.path[x.dim] === x.id ? ' · your pick' : ''}`, poster: c.poster, box: c.box };
      }), set.indexOf(o));
    } else if (t.dataset.swap) {
      const [dd, id] = t.dataset.swap.split(':');
      choose(dd, id, `${dimOf(dd).label} switched to ${byId[id].label}`);
    } else if (t.dataset.borrow) {
      const dim = t.dataset.d || d.id;
      const s = new Set(state.borrow[dim] || []);
      s.has(t.dataset.borrow) ? s.delete(t.dataset.borrow) : s.add(t.dataset.borrow);
      state.borrow[dim] = [...s];
      app.saveDim(dim);
      render({ keepScroll: true });
    } else if (t.dataset.preset) preset(t.dataset.preset);
    else if (t.dataset.copy !== undefined) {
      const ok = await copyText(brief(app.evaluate()), $('#copyFallback'));
      t.textContent = ok ? 'Copied' : 'Select and copy';
      setTimeout(() => { t.textContent = 'Copy'; }, 1800);
    } else if (t.dataset.dl !== undefined) {
      const blob = new Blob([brief(app.evaluate())], { type: 'text/markdown' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'edo-concept-brief.md'; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    } else if (t.dataset.view) app.go(t.dataset.view);
  });
  let nt;
  root.addEventListener('input', (ev) => {
    const n = ev.target.closest('[data-note]');
    if (!n) return;
    state.notes[n.dataset.note] = n.value;
    clearTimeout(nt); nt = setTimeout(() => app.saveDim(n.dataset.note), 500);
  });

  return { render, recommend };
}

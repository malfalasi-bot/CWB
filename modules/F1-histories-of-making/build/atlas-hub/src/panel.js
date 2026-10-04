// The list twin: the primary, complete view. Worlds, then units, then stories, then nodes, all as real buttons
// and links. Every surface state has a page here, so nothing is reachable only by looking.
import { M, LENS_DEF, LENS_ORDER, FAMILY, FAMILY_ORDER, CHAPTERS, esc, unitShort, fmtYear } from './model.js';
import { S, set } from './state.js';
import { INK, inkState, whyEdges, nodeName, nodeKindLabel, notedHere, toggleNode, edoEngaged, inkLog } from './ink.js';

const host = () => document.getElementById('panel-inner');
let famFilter = {};
let shown = {};

export function glyph(f, ink = 0, size = 14) {
  const sh = FAMILY[f]?.shape ?? 1;
  const s = size, c = s / 2, r = s * 0.36;
  const fill = ink >= 1 ? 'currentColor' : ink > 0 ? 'currentColor' : 'none';
  const fo = ink >= 1 ? 1 : ink > 0 ? 0.35 : 0;
  const dash = ink > 0 ? '' : ' stroke-dasharray="2 1.6"';
  const st = `fill="${fill}" fill-opacity="${fo}" stroke="currentColor" stroke-width="1.3"${dash}`;
  let p;
  if (sh === 0) p = `<path d="M${c} ${c - r * 1.1}L${c + r * 1.1} ${c + r * 0.85}H${c - r * 1.1}Z" ${st}/>`;
  else if (sh === 2) p = `<rect x="${c - r * 0.9}" y="${c - r * 0.9}" width="${r * 1.8}" height="${r * 1.8}" ${st}/>`;
  else if (sh === 3) p = `<path d="M${c} ${c - r * 1.15}L${c + r * 1.15} ${c}L${c} ${c + r * 1.15}L${c - r * 1.15} ${c}Z" ${st}/>`;
  else if (sh === 4) p = `<rect x="${c - r}" y="${c - r}" width="${r * 2}" height="${r * 2}" rx="1" ${st}/><rect x="${c - r * 0.35}" y="${c - r * 0.35}" width="${r * 0.7}" height="${r * 0.7}" fill="currentColor"/>`;
  else if (sh === 5) p = `<circle cx="${c}" cy="${c}" r="${r * 0.7}" ${st}/>`;
  else if (sh === 6) p = `<circle cx="${c}" cy="${c}" r="${r}" ${st}/><circle cx="${c}" cy="${c}" r="${r * 1.32}" fill="none" stroke="var(--gold)" stroke-width="1.2"/>`;
  else p = `<circle cx="${c}" cy="${c}" r="${r}" ${st}/>`;
  return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" aria-hidden="true">${p}</svg>`;
}

function years(o) {
  if (o.s === null || o.s === undefined) return '';
  const a = fmtYear(o.s).replace(' CE', '');
  if (o.e === null || o.e === undefined) return `${a}–`;
  if (o.e === o.s) return a;
  return `${a}–${fmtYear(o.e).replace(' CE', '')}`;
}

function crumbs(items) {
  return `<ol class="crumbs" aria-label="Where you are">${items.map((it, i) => i === items.length - 1
    ? `<li><span aria-current="location">${esc(it.t)}</span></li>`
    : `<li><button type="button" data-go='${esc(JSON.stringify(it.go))}'>${esc(it.t)}</button></li>`).join('')}</ol>`;
}

export function renderPanel() {
  const h = host();
  if (!h || !M.atlas) return;
  let html;
  if (S.node) html = nodeCard(S.node);
  else if (S.story === 'edo') html = storyPage();
  else if (S.unit && M.terrById.has(S.unit)) html = chapterPage(S.unit);
  else if (S.unit) html = unitPage(S.unit);
  else html = worldPage();
  h.innerHTML = html;
}

// ------------------------------------------------------------ world
function worldPage() {
  const T = M.atlas.territories;
  const lensUnits = LENS_ORDER.map((id) => M.unitById.get(id)).filter(Boolean);
  const inLens = new Set(LENS_ORDER);
  const methods = M.units.filter((u) => u.kind === 'method' && !inLens.has(u.id));
  const others = M.units.filter((u) => u.kind === 'lens' && !inLens.has(u.id));
  return `
  <p class="p-kicker">The Atlas · F1 Histories of making</p>
  <h2 class="p-h">Where making happened, and how it moved</h2>
  <p class="p-lede">Nine world chapters lie on the globe as soft washes, each a reading of the past rather than a border; where two readings overlap, the washes overlap. Thematic units are lenses that recolour the same surface. Every mark starts pale and dashed, and takes ink only when you have read it here or brought it back from a unit.</p>
  ${inkBox()}
  <section class="p-sec" aria-labelledby="h-ch"><h3 class="p-sh" id="h-ch">World chapters <span class="n">${T.length}</span></h3>
    <ul class="ulist">${T.map((t) => {
      const u = M.unitById.get(t.id);
      const ink = INK.chapters.has(t.id);
      return `<li><button type="button" class="urow" data-unit="${t.id}" ${S.unit === t.id ? 'aria-current="true"' : ''}>
        <span class="code">${t.id}</span><span><span class="t">${esc(t.name)}</span><span class="d">read through ${esc(u.device)}</span></span>
        <span class="m"><span class="dot ${ink ? 'is-ink' : ''}" title="${ink ? 'inked' : 'not yet inked'}"></span><span class="sr">${ink ? 'inked' : 'not yet inked'}</span></span></button></li>`;
    }).join('')}</ul>
  </section>
  <section class="p-sec" aria-labelledby="h-st"><h3 class="p-sh" id="h-st">Stories <span class="n">1 built</span></h3>
    ${storyCard()}
  </section>
  <section class="p-sec" aria-labelledby="h-le"><h3 class="p-sh" id="h-le">Lenses <span class="n">${lensUnits.length}</span></h3>
    <ul class="ulist">${lensUnits.map((u) => lensRow(u)).join('')}</ul>
    <p class="p-note">One lens at a time. Every lens is always open; none is earned.</p>
  </section>
  <section class="p-sec" aria-labelledby="h-me"><h3 class="p-sh" id="h-me">Methods and other units <span class="n">${methods.length + others.length}</span></h3>
    <ul class="mlist">${[...methods, ...others].sort((a, b) => cmpUnit(a.id, b.id)).map((u) => `<li><span class="code">${u.id}</span><span><a href="#u-${u.id}" data-unit="${u.id}">${esc(u.title)}</a></span></li>`).join('')}</ul>
    <p class="p-note">Method units have no place on the map: they change how every surface is read.</p>
  </section>
  ${about()}`;
}

function cmpUnit(a, b) {
  const p = (s) => { const m = s.match(/F1\.(\d+)([a-z]?)/); return [parseInt(m[1], 10), m[2]]; };
  const [x, xa] = p(a), [y, ya] = p(b);
  return x - y || xa.localeCompare(ya);
}

function lensRow(u) {
  const L = LENS_DEF[u.id];
  const on = S.lens === u.id;
  return `<li><button type="button" class="urow" data-lens="${u.id}" aria-pressed="${on}">
    <span class="code">${u.id}</span><span><span class="t">${esc(L.short)}</span><span class="d">${esc(L.does)}</span></span>
    <span class="m"><span class="tog" aria-hidden="true"></span></span></button></li>`;
}

function inkBox() {
  const solid = [...INK.solid.keys()];
  const rum = [...INK.rumour.keys()];
  if (!solid.length) {
    return `<div class="inkbox"><p>Nothing is inked yet. Read a card and note it, or come back from a unit: the unit hands back what you engaged, and those marks take ink.</p>
      <a class="btn btn-2 btn-s ext" href="${esc(M.atlas.edo.url)}" target="_blank" rel="noopener">Start with the Edo unit</a></div>`;
  }
  const names = solid.slice(0, 8).map((id) => `<button type="button" class="tag" data-node="${esc(id)}">${esc(nodeName(id))}</button>`).join('');
  return `<div class="inkbox"><p><strong>Your ink.</strong> ${solid.length === 1 ? 'One mark is' : `${solid.length} marks are`} in solid ink${rum.length ? `, and ${rum.length === 1 ? 'one record is a rumour' : `${rum.length} records are rumours`}: named by what you read, not yet read themselves` : ''}.</p>
    <div class="tags">${names}${solid.length > 8 ? `<button type="button" class="tag" data-notebook="1">and ${solid.length - 8} more in the notebook</button>` : ''}</div></div>`;
}

function storyCard() {
  const e = M.atlas.edo;
  const steps = edoEngaged().filter((id) => e.items[id]?.type === 'step');
  return `<div class="story">
    <img src="img/edo-1859-thumb.webp" alt="" width="112" height="100" loading="lazy">
    <div><p class="k">Story · inside ${esc(unitShort('F1.8'))}, read through the workshop</p>
      <h3>${esc(e.title)}</h3>
      <p>${esc(e.lede)}</p>
      <div class="row"><button type="button" class="btn btn-s" data-story="edo">Enter the story</button>
      <a class="btn btn-2 btn-s ext" href="${esc(e.url)}" target="_blank" rel="noopener">Open the Edo unit</a></div>
      ${steps.length ? `<ul class="steps" aria-label="Pieces you have been to">${steps.map((s) => `<li class="is-ink">${esc(e.items[s].label)}</li>`).join('')}</ul>` : ''}
    </div></div>`;
}

// ------------------------------------------------------------ chapter (region tier)
function chapterPage(id) {
  const t = M.terrById.get(id);
  const u = M.unitById.get(id);
  const nodes = t.nodeList;
  const routes = M.routes.filter((r) => r.w.includes(id) && !r.case);
  const fam = famFilter[id] || null;
  const placed = nodes.filter((o) => o.placed && (!fam || o.f === fam));
  const listed = nodes.filter((o) => !o.placed);
  const counts = {};
  for (const o of nodes) if (o.placed) counts[o.f] = (counts[o.f] || 0) + 1;
  const n = shown[id] || 30;
  const sorted = placed.slice().sort((a, b) => inkState(b.id) - inkState(a.id) || a.t - b.t || a.n.localeCompare(b.n));
  return `${crumbs([{ t: 'Atlas', go: { unit: null } }, { t: t.name }])}
  <p class="p-kicker">${id} · World chapter</p>
  <h2 class="p-h">${esc(t.name)}</h2>
  <p class="p-dev">read through ${esc(u.device)}</p>
  ${u.question ? `<p class="p-q">${esc(u.question)}</p>` : ''}
  <p class="p-lede">${esc(u.summary)}</p>
  <p class="p-note">The wash is drawn from Natural Earth country shapes grouped by the canon’s sub-region codes, densest where this chapter’s records are: ${t.subregions.map((s) => esc(s.name)).join(', ')}. A reading, not a border.</p>
  <section class="p-sec" aria-labelledby="h-cs"><h3 class="p-sh" id="h-cs">Stories</h3>
    ${id === 'F1.8' ? storyCard() : `<p class="story-none">No story is built for this chapter yet. Its unit is ${esc(u.status)}.</p>`}
  </section>
  <section class="p-sec" aria-labelledby="h-cn"><h3 class="p-sh" id="h-cn">Places on the map <span class="n">${nodes.filter((o) => o.placed).length}</span></h3>
    <div class="fams" role="group" aria-label="Filter by kind">
      <button type="button" class="chip" data-fam="" aria-pressed="${!fam}">All</button>
      ${FAMILY_ORDER.filter((f) => counts[f]).map((f) => `<button type="button" class="chip" data-fam="${f}" aria-pressed="${fam === f}">${glyph(f, 1, 12)} ${esc(FAMILY[f].name)} <span class="code">${counts[f]}</span></button>`).join('')}
    </div>
    <ul class="nlist">${sorted.slice(0, n).map(nodeRow).join('')}</ul>
    ${sorted.length > n ? `<button type="button" class="btn btn-2 btn-s more" data-more="${id}">Show ${Math.min(30, sorted.length - n)} more of ${sorted.length}</button>` : ''}
    ${listed.length ? `<details class="about"><summary>Listed, not pinned (${listed.length})</summary><p>These records name only a sub-region, so they are not placed on the map: no coordinates are invented for them.</p><ul class="nlist">${listed.slice(0, 60).map(nodeRow).join('')}</ul>${listed.length > 60 ? `<p>and ${listed.length - 60} more in the canon register.</p>` : ''}</details>` : ''}
  </section>
  <section class="p-sec" aria-labelledby="h-cr"><h3 class="p-sh" id="h-cr">Routes through ${esc(t.name)} <span class="n">${routes.length}</span></h3>
    <ul class="mlist">${routes.map((r) => `<li><span class="code">${esc(r.src.canon || '')}</span><span>${esc(r.label)} <span class="p-note" style="display:inline">· ${r.s !== null ? esc(fmtYear(r.s)) : ''}${r.e !== null ? '–' + esc(fmtYear(r.e)) : ' on'} · ${esc(r.c)}${r.contested ? ', contested' : ''}</span></span></li>`).join('')}</ul>
  </section>
  ${t.neighbours.length ? `<section class="p-sec" aria-labelledby="h-nb"><h3 class="p-sh" id="h-nb">Shares routes with</h3><div class="tags">${t.neighbours.map((nb) => `<button type="button" class="tag" data-unit="${nb.id}">${esc(unitShort(nb.id))} · ${nb.n}</button>`).join('')}</div></section>` : ''}
  ${u.links.length ? `<section class="p-sec" aria-labelledby="h-lk"><h3 class="p-sh" id="h-lk">Linked units</h3><div class="tags">${u.links.map((l) => `<button type="button" class="tag" data-unit="${l}">${l} ${esc(unitShort(l))}</button>`).join('')}</div></section>` : ''}`;
}

function nodeRow(o) {
  const ink = inkState(o.id);
  return `<li><button type="button" class="nrow" data-node="${esc(o.id)}">${glyph(o.f, ink, 14)}
    <span><span class="n">${esc(o.n)}</span><span class="k">${esc(FAMILY[o.f]?.one || o.k)}${ink >= 1 ? ' · inked' : ink > 0 ? ' · rumour' : ''}${o.a === 1 ? ' · approximate place' : ''}</span></span>
    <span class="y">${esc(years(o))}</span></button></li>`;
}

// ------------------------------------------------------------ other units
function unitPage(id) {
  const u = M.unitById.get(id);
  const L = LENS_DEF[id];
  const items = [{ t: 'Atlas', go: { unit: null } }, { t: `${id} ${unitShort(id)}` }];
  let body = '';
  if (L) {
    const on = S.lens === id;
    let extra = '';
    if (L.bit) {
      const rows = M.atlas.territories.map((t) => ({ t, s: t.share[L.bit] })).sort((a, b) => b.s - a.s);
      extra = `<section class="p-sec"><h3 class="p-sh">Where the canon’s records carry this theme</h3>
        <ul class="mlist">${rows.map((r) => `<li><span class="code">${r.t.id}</span><span><button type="button" class="tag" data-unit="${r.t.id}">${esc(r.t.name)}</button> ${Math.round(r.s * r.t.nodeList.length)} of ${r.t.nodeList.length} places</span></li>`).join('')}</ul>
        <p class="p-note">Rule: ${esc(M.atlas.lenses.find((l) => l.id === L.bit)?.rule || '')} This counts our records, not the world: a thin wash can mean thin sources.</p></section>`;
    }
    if (L.layer === 'industry') extra = `<section class="p-sec"><h3 class="p-sh">Exhibition cities</h3><ul class="mlist">${M.atlas.exhibitions.map((x) => `<li><span class="code">${x.s}</span><span>${esc(x.n)}</span></li>`).join('')}</ul></section>`;
    if (L.layer === 'museums') extra = `<section class="p-sec"><h3 class="p-sh">Provenance arcs <span class="n">${M.atlas.provenance.length}</span></h3><ul class="mlist">${M.atlas.provenance.slice(0, 24).map((p) => `<li><span class="code">${p.n}</span><span>${esc(p.from)} → ${esc(p.to)}</span></li>`).join('')}</ul><p class="p-note">Each arc runs from the sub-region an open object comes from (never a findspot) to the museum that holds it now; the number is how many objects in the world set and harvest share that arc.</p></section>`;
    if (L.layer === 'copying' || L.layer === 'extraction') {
      const kind = L.layer === 'copying' ? 'copy' : 'extraction';
      const rs = M.routes.filter((r) => r.kind === kind || (kind === 'extraction' && (r.l & M.lensBit.material) && r.kind === 'route'));
      extra = `<section class="p-sec"><h3 class="p-sh">${kind === 'copy' ? 'Copy chains' : 'Flows of material'} <span class="n">${rs.length}</span></h3><ul class="mlist">${rs.map((r) => `<li><span class="code">${esc(r.src.canon || 'Edo')}</span><span>${esc(r.label)}</span></li>`).join('')}</ul></section>`;
    }
    if (L.layer === 'networks') extra = `<section class="p-sec"><h3 class="p-sh">Routes <span class="n">${M.routes.filter((r) => r.kind === 'route').length}</span></h3><ul class="mlist">${M.routes.filter((r) => r.kind === 'route').map((r) => `<li><span class="code">${esc(r.src.canon || 'Edo')}</span><span>${esc(r.label)}${r.flags.includes('human-flow') ? ' <em>(people moved by force; drawn in plain ink, never as goods)</em>' : ''}</span></li>`).join('')}</ul><p class="p-note">Routes are schematic great-circle paths through named stops, never surveyed tracks.</p></section>`;
    if (L.layer === 'retime') extra = `<section class="p-sec"><p class="p-small">Move the time scrubber: each year is also given in the Hijri era (an approximation, marked “c.”) and, from 1596, in Japanese era names from the Edo unit’s table.</p></section>`;
    body = `<p class="p-kicker">${id} · Lens</p><h2 class="p-h">${esc(L.short)}</h2><p class="p-dev">${esc(u.title)}</p>
      <p class="p-lede">${esc(L.does)}</p>
      <div class="card"><div class="acts"><button type="button" class="btn btn-s" data-lens="${id}" aria-pressed="${on}">${on ? 'Turn this lens off' : 'Turn this lens on'}</button></div></div>
      ${u.question ? `<p class="p-q">${esc(u.question)}</p>` : ''}${extra}`;
  } else {
    body = `<p class="p-kicker">${id} · ${u.kind === 'method' ? 'Method' : 'Thematic unit'}</p><h2 class="p-h">${esc(u.title)}</h2>
      ${u.question ? `<p class="p-q">${esc(u.question)}</p>` : ''}<p class="p-lede">${esc(u.summary)}</p>
      ${u.lab ? `<p class="p-small">Its lab: <strong>${esc(u.lab)}</strong>.</p>` : ''}
      <p class="p-note">${u.kind === 'method' ? 'A method unit has no place on the map. It changes how every surface is read.' : 'This thematic unit has no lens layer yet.'} Status: ${esc(u.status)}.</p>`;
  }
  return `${crumbs(items)}${body}
    ${u.links?.length ? `<section class="p-sec"><h3 class="p-sh">Linked units</h3><div class="tags">${u.links.map((l) => `<button type="button" class="tag" data-unit="${l}">${l} ${esc(unitShort(l))}</button>`).join('')}</div></section>` : ''}`;
}

// ------------------------------------------------------------ the Edo story (unit tier)
function storyPage() {
  const e = M.atlas.edo;
  const eng = new Set(edoEngaged());
  const steps = Object.entries(e.items).filter(([, v]) => v.type === 'step');
  return `${crumbs([{ t: 'Atlas', go: { unit: null, story: null } }, { t: 'East Asia', go: { unit: 'F1.8', story: null } }, { t: 'Edo' }])}
  <p class="p-kicker">Story · F1.8 East Asia, read through the workshop</p>
  <h2 class="p-h">${esc(e.title)}</h2>
  <p class="p-dev">${esc(e.sub)}</p>
  <p class="p-lede">${esc(e.lede)}</p>
  <div class="card"><div class="acts">
    <a class="btn ext" href="${esc(e.url)}" target="_blank" rel="noopener">Open the Edo unit</a>
    <button type="button" class="btn btn-2" data-go='{"story":null,"unit":"F1.8"}'>Back to East Asia</button></div>
    <p class="p-note">The unit opens in a new tab. When you finish it, its closing screen links back here and inks what you engaged.</p></div>
  <section class="p-sec"><h3 class="p-sh">The unit’s other pieces</h3>
    <ul class="mlist">${e.pieces.map((p) => `<li><span class="code">↗</span><span><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a>: ${esc(p.what)}</span></li>`).join('')}</ul>
    <ul class="steps" aria-label="Pieces and steps">${steps.map(([k, v]) => `<li class="${eng.has(k) ? 'is-ink' : ''}">${esc(v.label)}${eng.has(k) ? ' · inked' : ''}</li>`).join('')}</ul>
  </section>
  <section class="p-sec"><h3 class="p-sh">On the 1859 sheet</h3>
    <ul class="nlist">${e.pins.map((p) => `<li><button type="button" class="nrow" data-pin="${p.id}">${glyph('edo', eng.has(p.id) || eng.has('edo') ? 1 : 0, 14)}<span><span class="n">${esc(p.name)} <span lang="ja">${esc(p.kanji)}</span></span><span class="k">${p.approx ? 'approximate position' : 'georeferenced on the sheet'}</span></span><span class="y"></span></button></li>`).join('')}</ul>
  </section>
  <section class="p-sec"><h3 class="p-sh">The sheet</h3><p class="p-small">${esc(e.map.credit)}. <a href="${esc(e.map.record)}" target="_blank" rel="noopener">Library of Congress record</a>.</p></section>`;
}

// ------------------------------------------------------------ node card and its rumour log
function nodeCard(id) {
  const o = M.byId.get(id);
  const ref = M.atlas.edo.canonRefs[id];
  const name = nodeName(id);
  const ink = inkState(id);
  const back = [{ t: 'Atlas', go: { unit: null, node: null } }];
  if (S.unit && M.terrById.has(S.unit)) back.push({ t: unitShort(S.unit), go: { node: null } });
  back.push({ t: name });
  const facts = [];
  const d = o ? (o.d || years(o)) : ref?.d;
  if (d) facts.push(['Date', d]);
  const m = o ? o.m : ref?.m;
  if (m) facts.push(['Making', m]);
  if (o?.o) facts.push(['Leaves out', o.o]);
  if (o) facts.push(['Placed', o.placed ? (o.a === 0 ? o.b : `${o.b} (approximate: drawn as a soft blot)`) : 'Not pinned: the record names only a sub-region']);
  const conf = o ? o.c : ref?.c;
  if (conf) facts.push(['Confidence', conf]);
  if (o?.h) facts.push(['Held by', o.h + (o.acc ? `, ${o.acc}` : '')]);
  if (o?.lic) facts.push(['Licence', o.lic]);
  const units = o ? [...new Set([...o.w, ...o.u])] : ref?.w || [];
  const notes = (o?.z || []).map((z) => ({
    'human-flow': 'This record involves people moved by force. People are never drawn as goods on this Atlas.',
    sacred: 'Sacred material: shown only as its record allows.',
    'conflict-looting': 'This record involves conflict or looting.',
    'human-remains': 'This record concerns human remains, which are never shown.',
    'living-community': 'A living community: its own account comes first.',
  }[z])).filter(Boolean);
  const edges = whyEdges(id);
  const isNoted = notedHere(id);
  return `${crumbs(back)}
  <article class="card" aria-labelledby="h-node">
    <p class="p-kicker">${esc(nodeKindLabel(id))}${ink >= 1 ? ' · inked' : ink > 0 ? ' · rumour' : ''}</p>
    <h2 class="p-h" id="h-node">${esc(name)}</h2>
    ${notes.map((n) => `<p class="cnote">${esc(n)}</p>`).join('')}
    <dl class="facts">${facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
    ${units.length ? `<div class="tags" aria-label="Units">${units.filter((u) => M.unitById.has(u)).map((u) => `<button type="button" class="tag" data-unit="${u}">${u} ${esc(unitShort(u))}</button>`).join('')}</div>` : ''}
    <div class="acts">
      <button type="button" class="btn btn-s ink-btn" data-ink="${esc(id)}" aria-pressed="${isNoted}">${isNoted ? 'Noted in your notebook' : 'Note it: ink this mark'}</button>
      ${o?.placed ? `<button type="button" class="btn btn-2 btn-s" data-fly="${esc(id)}">Show on the surface</button>` : ''}
    </div>
    <section class="p-sec" aria-labelledby="h-why"><h3 class="p-sh" id="h-why">Why this mark <span class="n">${edges.length} edge${edges.length === 1 ? '' : 's'}</span></h3>
      ${edges.length ? `<ul class="why">${edges.map((e) => `<li class="${e.kind === 'rumour' ? 'is-rumour' : ''} ${e.contested ? 'is-contested' : ''}"><span class="rel">${esc(e.rel)}</span>${e.who ? `: ${esc(e.who)}` : ''}${e.kind === 'rumour' ? ' <em>(a rumour: named, not yet read)</em>' : ''}${e.contested ? ' <em>(contested: it cannot be completed)</em>' : ''}<span class="src">Source: ${esc(e.src)}${e.conf ? ` · ${esc(e.conf)}` : ''}${e.via ? ` · ${esc(e.via.detail)}` : ''}</span></li>`).join('')}</ul>` : '<p class="p-small">No edges recorded for this mark yet.</p>'}
    </section>
  </article>`;
}

// ------------------------------------------------------------ about
function about() {
  const me = M.atlas.meta;
  return `<details class="about"><summary>How this Atlas was made</summary>
    <p>The canon register holds ${me.canonRows.toLocaleString('en-GB')} records in ${me.canonKinds} kinds. Only place-anchored kinds become marks: ${me.placeAnchored.toLocaleString('en-GB')} records here, of which ${me.approx['2'] || 0} name only a sub-region and are listed but never pinned. Techniques, materials, functions and beliefs stay lenses.</p>
    ${me.notes.map((n) => `<p>${esc(n)}</p>`).join('')}
    <p><strong>Credits.</strong></p><ul>${me.credits.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
    <p>Code: three.js (MIT), d3-geo, d3-zoom, d3-selection, d3-interpolate (ISC), topojson-client (ISC), supercluster (ISC), Vite (MIT). Fonts: Shippori Mincho, Source Serif 4, IBM Plex Sans (SIL OFL) from Google Fonts.</p>
  </details>`;
}

// ------------------------------------------------------------ events (one delegated handler)
export function bindPanel(actions) {
  const h = document.getElementById('panel');
  h.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-unit],[data-lens],[data-node],[data-story],[data-go],[data-fam],[data-more],[data-ink],[data-fly],[data-pin],[data-notebook]');
    if (!b) return;
    if (b.tagName === 'A' && b.target === '_blank') return;
    ev.preventDefault();
    if (b.dataset.go) { const go = JSON.parse(b.dataset.go); actions.go(go); return; }
    if (b.dataset.unit) { actions.unit(b.dataset.unit); return; }
    if (b.dataset.lens) { actions.lens(b.dataset.lens); return; }
    if (b.dataset.node) { actions.node(b.dataset.node); return; }
    if (b.dataset.story) { actions.story(b.dataset.story); return; }
    if (b.dataset.notebook) { actions.notebook(); return; }
    if (b.dataset.fam !== undefined) { famFilter[S.unit] = b.dataset.fam || null; shown[S.unit] = 30; renderPanel(); h.querySelector(`[data-fam="${b.dataset.fam}"]`)?.focus(); return; }
    if (b.dataset.more) { const id = b.dataset.more; const before = shown[id] || 30; shown[id] = before + 30; renderPanel(); h.querySelectorAll('.nrow')[before]?.focus(); return; }
    if (b.dataset.ink) { const on = toggleNode(b.dataset.ink); actions.inked(b.dataset.ink, on); return; }
    if (b.dataset.fly) { actions.fly(b.dataset.fly); return; }
    if (b.dataset.pin) { actions.pin(b.dataset.pin); return; }
  });
}

export function logSummary() {
  return inkLog();
}
export { CHAPTERS };

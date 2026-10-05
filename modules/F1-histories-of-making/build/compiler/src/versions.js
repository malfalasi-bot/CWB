import { $, $$, esc, glyph, VNAME, reducedMotion } from './util.js';

const BEATS = [['opening', 'Opening'], ['wave', 'Wave'], ['map', 'Map'], ['timeline', 'Timeline'], ['tool', 'Tool'], ['person', 'Person'], ['question', 'Question'], ['nav', 'Navigation']];
const EXTRA = { overture: 'Overture', roomDesks: 'Desks room', roomWorkshop: 'Workshop room', roomViews: 'Views room', edo: 'Edo story' };
const MAIN = ['v0', 'v1', 'v2', 'v3', 'v4', 'atlas'];
let blinkTimer = null;

const posterOf = (v, beat, form = 'd') => { const p = v?.posters?.[beat]; return p && typeof p === 'object' ? (form === 'm' ? p.m : p.d) : null; };
const shows = (v, beat) => { const p = v?.posters?.[beat]; return p && typeof p === 'object' ? p.shows : null; };

export function renderVersions(app, root, opts = {}) {
  const { model, state, engine } = app;
  const verdictOf = (vid) => engine.evaluate(model.paths[vid], { custom: [], judgments: state.judgments }).verdict;
  if (opts.light) {
    for (const b of $$('.vchip', root)) {
      const v = verdictOf(b.dataset.v);
      const el = b.querySelector('.vv'); if (el) el.innerHTML = `${glyph(v.level === 'open' ? 'open' : v.level, 'sm')}<span>${esc(v.text)}</span>`;
    }
    return;
  }
  const versions = model.versions;
  const v = versions.find((x) => x.id === state.version) || versions.find((x) => x.id === 'v4');
  const branches = versions.filter((x) => x.placeholder);
  const beatKeys = [...BEATS.map((b) => b[0]), ...Object.keys(EXTRA).filter((k) => v.posters[k])];
  if (!beatKeys.includes(state.beat)) state.beat = 'opening';
  const hasM = !!posterOf(v, state.beat, 'm');
  const form = hasM ? state.vform : 'd';
  const src = posterOf(v, state.beat, form);
  const narrow = matchMedia('(max-width: 720px)').matches;
  if (narrow && ['2up', 'swipe', 'fade'].includes(state.cmpMode)) state.cmpMode = 'solo';
  if (!narrow && state.cmpMode === 'solo') state.cmpMode = '2up';
  const A = versions.find((x) => x.id === state.compareA), B = versions.find((x) => x.id === state.compareB);
  const pa = posterOf(A, state.beat), pb = posterOf(B, state.beat);
  const fp = Object.entries(v.fingerprint || {});
  const dimLabel = Object.fromEntries(model.dims.map((d) => [d.id, d.label]));
  dimLabel.questioning = 'Questions'; dimLabel.mapping = 'Map';
  const stats = Object.entries(v.stats).filter(([k]) => !/Note$/.test(k)).map(([k, val]) => `<span>${esc(k === 'jsKB' ? 'JS KB' : k.replace(/([A-Z])/g, ' $1').toLowerCase())} <b>${esc(val)}</b></span>`).join('');

  root.innerHTML = `
  <div class="vstrip" role="group" aria-label="Choose a version">
    ${MAIN.map((id) => { const x = versions.find((y) => y.id === id); const vd = verdictOf(id); return `<button type="button" class="vchip" data-v="${id}" aria-pressed="${v.id === id}"><span class="vid">${VNAME[id]}</span><span class="vname">${esc(shortName(x))}</span><span class="vv">${glyph(vd.level === 'open' ? 'open' : vd.level, 'sm')}<span>${esc(vd.text)}</span></span></button>`; }).join('')}
    <details class="branches"><summary>${branches.length} side branches · placeholder only</summary><ul>${branches.map((b) => `<li><button type="button" class="btn small" data-v="${b.id}">${esc(b.name)}</button> <span class="muted small">${esc(b.judged)}</span></li>`).join('')}</ul></details>
  </div>
  <div class="vdetail">
    <div class="viewer">
      <div class="beats" role="group" aria-label="Beat">${beatKeys.map((k) => `<button type="button" class="chip" data-beat="${k}" aria-pressed="${state.beat === k}">${esc((BEATS.find((b) => b[0] === k) || [0, EXTRA[k]])[1])}</button>`).join('')}
        ${hasM ? `<span class="seg" role="group" aria-label="Device" style="margin-left:auto"><button type="button" data-form="d" aria-pressed="${form === 'd'}">Desktop</button><button type="button" data-form="m" aria-pressed="${form === 'm'}">Phone</button></span>` : ''}</div>
      <div class="viewer-frame ${form === 'm' ? 'phone' : ''}">${src ? `<button type="button" data-poster="${src}" style="all:unset;cursor:zoom-in;display:block;width:100%;height:100%"><img src="${src}" alt="${esc(VNAME[v.id] + ', ' + (shows(v, state.beat) || state.beat))}"></button>` : `<div class="viewer-empty">${esc(VNAME[v.id] || v.name)} has no ${esc(state.beat)} beat${v.posters[state.beat] === 'none' ? '' : ' poster'}.</div>`}</div>
      <p class="small muted">${esc(shows(v, state.beat) || '')}${v.posterNote ? ' · ' + esc(v.posterNote) : ''}</p>
    </div>
    <div class="vmeta">
      <p class="eyebrow">${esc(VNAME[v.id] || v.id)} · ${esc(v.date)}${v.url && v.url.startsWith('https://') ? ` · <a href="${esc(v.url)}" target="_blank" rel="noopener">published page</a>` : ''}</p>
      <h3>${esc(v.name)}</h3>
      <p class="thesis">${esc(v.thesis)}</p>
      <p class="critique"><span class="eyebrow">Judged</span><br>${esc(v.judged)}</p>
      <div class="stats">${stats}</div>
      ${model.paths[v.id] ? `<div><button type="button" class="btn primary" data-loadpath="${v.id}">Load this version’s path into the composer</button></div>` : '<p class="small muted">Placeholder page: there is no path to load.</p>'}
      <details ${v.placeholder ? '' : 'open'}><summary class="small">Fingerprint across the dimensions</summary><div class="fp-wrap"><table class="fp"><tbody>${fp.map(([k, f]) => `<tr><th scope="row">${esc(dimLabel[k] || k)}</th><td><b>${esc(f.label)}</b><br><span class="muted">${esc(f.desc)}</span></td></tr>`).join('')}</tbody></table></div></details>
    </div>
  </div>
  <div class="compare panel" aria-labelledby="cmpTitle">
    <h3 id="cmpTitle">Compare two versions on the same beat</h3>
    <div class="compare-controls">
      <label>A <select id="cmpA">${MAIN.map((id) => `<option value="${id}" ${state.compareA === id ? 'selected' : ''}>${VNAME[id]}</option>`).join('')}</select></label>
      <label>B <select id="cmpB">${MAIN.map((id) => `<option value="${id}" ${state.compareB === id ? 'selected' : ''}>${VNAME[id]}</option>`).join('')}</select></label>
      <label>Beat <select id="cmpBeat">${BEATS.map(([k, l]) => `<option value="${k}" ${state.beat === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <div class="seg" role="group" aria-label="Compare mode">${(narrow ? [['solo', 'Solo'], ['blink', 'Blink']] : [['2up', '2-up'], ['swipe', 'Swipe'], ['fade', 'Fade'], ['blink', 'Blink']]).map(([k, l]) => `<button type="button" data-mode="${k}" aria-pressed="${state.cmpMode === k}">${l}</button>`).join('')}</div>
    </div>
    <div class="compare-stage" id="cmpStage">${compareStage(state, A, B, pa, pb)}</div>
  </div>`;
  bind(app, root);
}

function shortName(x) { return x.name.replace(/^Edo unit v\d — /, '').replace(/^Edo Case — /, '').replace(/ \(current\)/, ''); }
function img(src, alt, cls = '') { return src ? `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="lazy">` : `<div class="viewer-empty">No poster for this beat</div>`; }

function compareStage(state, A, B, pa, pb) {
  const la = VNAME[A.id], lb = VNAME[B.id];
  const sa = shows(A, state.beat) || 'no poster', sb = shows(B, state.beat) || 'no poster';
  switch (state.cmpMode) {
    case '2up': return `<div class="cmp-2up"><figure class="cmp-fig"><div class="cmp-box">${img(pa, la + ': ' + sa)}<span class="cmp-tag" style="left:8px">A · ${la}</span></div><figcaption>${esc(sa)}</figcaption></figure><figure class="cmp-fig"><div class="cmp-box">${img(pb, lb + ': ' + sb)}<span class="cmp-tag" style="left:8px">B · ${lb}</span></div><figcaption>${esc(sb)}</figcaption></figure></div>`;
    case 'swipe': return `<div class="cmp-box" id="swipeBox" style="--cut:50%">${img(pa, la + ': ' + sa)}${pb ? `<img class="top" src="${pb}" alt="${esc(lb + ': ' + sb)}">` : ''}<span class="cmp-divider"></span><span class="cmp-tag" style="left:8px">A · ${la}</span><span class="cmp-tag" style="right:8px">B · ${lb}</span></div>
      <label for="swipeRange">Divider position: drag on the image, or use the slider and arrow keys</label><input type="range" class="cmp-range" id="swipeRange" min="0" max="100" value="50" aria-valuetext="50% A, 50% B">`;
    case 'fade': return `<div class="cmp-box">${img(pa, la + ': ' + sa)}${pb ? `<img id="fadeTop" src="${pb}" alt="${esc(lb + ': ' + sb)}" style="opacity:.5">` : ''}<span class="cmp-tag" style="left:8px">A · ${la}</span><span class="cmp-tag" style="right:8px">B · ${lb}</span></div>
      <label for="fadeRange">Blend from A to B</label><input type="range" class="cmp-range" id="fadeRange" min="0" max="100" value="50" aria-valuetext="50% B">`;
    case 'solo': case 'blink': {
      const showB = state.cmpSolo === 'B';
      return `<div class="cmp-box" id="blinkBox">${showB ? img(pb, lb + ': ' + sb) : img(pa, la + ': ' + sa)}<span class="cmp-tag" style="left:8px">${showB ? 'B · ' + lb : 'A · ' + la}</span></div>
        <div class="compare-controls"><button type="button" class="btn" id="blinkFlip" aria-keyshortcuts="Space">Show ${showB ? 'A · ' + la : 'B · ' + lb}</button>
        ${state.cmpMode === 'blink' ? `<button type="button" class="btn" id="blinkAuto" aria-pressed="${!!blinkTimer}" ${reducedMotion() ? 'disabled title="Off while reduced motion is on"' : ''}>${blinkTimer ? 'Stop blinking' : 'Blink every second'}</button>` : ''}
        <span class="small muted">${esc(showB ? sb : sa)}</span></div>`;
    }
  }
  return '';
}

function bind(app, root) {
  const { state } = app;
  const rerender = () => renderVersions(app, root);
  root.onclick = (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.v) { state.version = t.dataset.v; history.replaceState(null, '', '#' + t.dataset.v); rerender(); root.querySelector(`[data-v="${t.dataset.v}"]`)?.focus(); }
    else if (t.dataset.beat) { state.beat = t.dataset.beat; rerender(); root.querySelector(`[data-beat="${t.dataset.beat}"]`)?.focus(); }
    else if (t.dataset.form) { state.vform = t.dataset.form; rerender(); }
    else if (t.dataset.loadpath) { app.act.loadPath(t.dataset.loadpath); document.getElementById('composer').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' }); }
    else if (t.dataset.poster) app.openPoster(t.dataset.poster, state.version + ' ' + state.beat);
    else if (t.dataset.mode) { stopBlink(); state.cmpMode = t.dataset.mode; rerender(); root.querySelector(`[data-mode="${t.dataset.mode}"]`)?.focus(); }
    else if (t.id === 'blinkFlip') { state.cmpSolo = state.cmpSolo === 'B' ? 'A' : 'B'; rerender(); $('#blinkFlip', root)?.focus(); }
    else if (t.id === 'blinkAuto') {
      if (blinkTimer) stopBlink();
      else blinkTimer = setInterval(() => { state.cmpSolo = state.cmpSolo === 'B' ? 'A' : 'B'; const s = $('#cmpStage', root); if (s) { s.innerHTML = compareStage(state, ...pairFor(app)); } else stopBlink(); }, 1000);
      rerender(); $('#blinkAuto', root)?.focus();
    }
  };
  root.onchange = (e) => {
    if (e.target.id === 'cmpA') { state.compareA = e.target.value; app.act.saveSession(); rerender(); $('#cmpA', root).focus(); }
    if (e.target.id === 'cmpB') { state.compareB = e.target.value; app.act.saveSession(); rerender(); $('#cmpB', root).focus(); }
    if (e.target.id === 'cmpBeat') { state.beat = e.target.value; rerender(); $('#cmpBeat', root).focus(); }
  };
  root.oninput = (e) => {
    if (e.target.id === 'swipeRange') { $('#swipeBox', root).style.setProperty('--cut', e.target.value + '%'); e.target.setAttribute('aria-valuetext', `${e.target.value}% A, ${100 - e.target.value}% B`); }
    if (e.target.id === 'fadeRange') { const t = $('#fadeTop', root); if (t) t.style.opacity = e.target.value / 100; e.target.setAttribute('aria-valuetext', `${e.target.value}% B`); }
  };
  const box = $('#swipeBox', root);
  if (box) {
    const set = (x) => { const r = box.getBoundingClientRect(); const p = Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)); box.style.setProperty('--cut', p + '%'); const rg = $('#swipeRange', root); rg.value = Math.round(p); rg.setAttribute('aria-valuetext', `${Math.round(p)}% A, ${100 - Math.round(p)}% B`); };
    box.onpointerdown = (e) => { box.setPointerCapture(e.pointerId); set(e.clientX); box.onpointermove = (ev) => set(ev.clientX); };
    box.onpointerup = () => { box.onpointermove = null; };
  }
}
function pairFor(app) {
  const { model, state } = app;
  const A = model.versions.find((x) => x.id === state.compareA), B = model.versions.find((x) => x.id === state.compareB);
  return [A, B, posterOf(A, state.beat), posterOf(B, state.beat)];
}
function stopBlink() { if (blinkTimer) { clearInterval(blinkTimer); blinkTimer = null; } }

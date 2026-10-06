// Versions gallery: one version at a time, filling the screen, with a filmstrip of the same moments in every version.
// Compare puts a second version beside it (or under a slider) on the same moment.
import { $, $$, esc, announce } from './util.js';

const MAIN = ['v0', 'v1', 'v2', 'v3', 'v4', 'atlas'];
const BEATS = [
  ['opening', 'Opening'], ['overture', 'Overture'], ['wave', 'The Wave'], ['map', 'Map'], ['timeline', 'Timeline'],
  ['tool', 'Tool'], ['person', 'People'], ['question', 'Questions'], ['nav', 'Navigation'],
  ['roomDesks', 'Desks room'], ['roomWorkshop', 'Workshop room'], ['roomViews', 'Views room'], ['edo', 'Edo story'],
];
const SHORT = { v0: 'v0', v1: 'v1', v2: 'v2', v3: 'v3', v4: 'v4', atlas: 'Atlas' };
const TAG = { v0: 'The document', v1: 'Screens and lectures', v2: 'The scrolling atlas', v3: 'Five acts, one stage', v4: 'Overture, scenes, rooms', atlas: 'The world hub' };

export function createGallery(app, root) {
  const { model, state, engine } = app;
  const G = state.gallery;
  const versions = Object.fromEntries(model.versions.map((v) => [v.id, v]));
  const poster = (vid, beat) => { const p = versions[vid]?.posters?.[beat]; return p && typeof p === 'object' && p.d ? p : null; };
  const beatsOf = (vid) => BEATS.filter(([b]) => poster(vid, b));
  const verdicts = Object.fromEntries(MAIN.map((v) => [v, model.paths[v] ? engine.evaluate(model.paths[v], app.ctx(), { fast: true }).verdict : null]));

  const thumb = (src, w = 168) => {
    const T = model.thumbs; const at = T.index[src];
    if (!at) return '';
    const k = w / T.w;
    return `background-image:url(thumbs.webp);background-size:${T.W * k}px ${T.H * k}px;background-position:-${at[0] * k}px -${at[1] * k}px;width:${w}px;height:${T.h * k}px`;
  };
  const img = (p, alt, eager) => `<picture>${p.m ? `<source media="(max-width: 600px)" srcset="${p.m}">` : ''}<img src="${p.d}" alt="${esc(alt)}" ${eager ? '' : 'loading="lazy"'} decoding="async"></picture>`;

  function ensureBeat() {
    if (!poster(G.version, G.beat)) G.beat = beatsOf(G.version)[0]?.[0] || 'opening';
  }

  function figure(vid, label) {
    const p = poster(vid, G.beat);
    const v = versions[vid];
    if (!p) return `<figure class="g-fig empty"><div class="g-none"><p><strong>${esc(SHORT[vid])}</strong> has no “${esc(beatLabel(G.beat))}” moment.</p><p class="muted small">It never built one. Pick another moment below.</p></div><figcaption>${esc(SHORT[vid])} · ${esc(v.name)}</figcaption></figure>`;
    return `<figure class="g-fig"><button type="button" class="g-img" data-zoom="${vid}" aria-label="Enlarge: ${esc(SHORT[vid])}, ${esc(beatLabel(G.beat))}">${img(p, `${v.name}: ${p.shows}`, true)}<span class="zoom-ic" aria-hidden="true">⤢</span></button>
      <figcaption>${label ? `<span class="vtag">${esc(SHORT[vid])}</span>` : ''}<span>${esc(p.shows)}</span></figcaption></figure>`;
  }
  const beatLabel = (b) => BEATS.find((x) => x[0] === b)?.[1] || b;

  function render() {
    ensureBeat();
    const v = versions[G.version];
    const beats = beatsOf(G.version);
    const other = G.other && G.other !== G.version ? G.other : null;
    const concepts = model.options.filter((o) => o.sourceVersions.includes(G.version) && o.id !== 'me-custom');
    const vd = verdicts[G.version];
    root.innerHTML = `
      <div class="g-intro">
        <h1>The versions</h1>
        <p class="lede">Six takes on the same unit. Pick one and step through its moments with the arrows, a swipe or the strip below. Click a picture to fill the screen.</p>
      </div>
      <div class="g-vers" role="radiogroup" aria-label="Version">
        ${MAIN.map((id) => {
          const x = versions[id]; const p = poster(id, 'wave') || poster(id, 'opening') || poster(id, beatsOf(id)[0]?.[0]);
          return `<button type="button" role="radio" class="g-ver ${id === G.version ? 'on' : ''}" aria-checked="${id === G.version}" data-ver="${id}">
            <span class="g-ver-img" style="${p ? thumb(p.d, 112) : ''}" aria-hidden="true"></span>
            <span class="g-ver-txt"><span class="vtag">${esc(SHORT[id])}</span><strong>${esc(TAG[id])}</strong></span></button>`;
        }).join('')}
      </div>
      <div class="g-toolbar">
        <div class="g-cmp">
          <span class="lbl" id="cmpLbl">Compare with</span>
          <div class="seg" role="group" aria-labelledby="cmpLbl">
            <button type="button" data-other="" aria-pressed="${!other}">Off</button>
            ${MAIN.filter((x) => x !== G.version).map((x) => `<button type="button" data-other="${x}" aria-pressed="${other === x}">${esc(SHORT[x])}</button>`).join('')}
          </div>
          ${other ? `<div class="seg" role="group" aria-label="Compare layout"><button type="button" data-mode="side" aria-pressed="${G.mode === 'side'}">Side by side</button><button type="button" data-mode="slider" aria-pressed="${G.mode === 'slider'}">Slider</button></div>` : ''}
        </div>
        <p class="g-pos" aria-live="polite">${esc(beatLabel(G.beat))} · ${beats.findIndex((b) => b[0] === G.beat) + 1} of ${beats.length}</p>
      </div>
      <div class="g-stage ${other ? 'cmp ' + G.mode : ''}" id="gStage" tabindex="0" aria-label="Moment viewer. Use the left and right arrow keys to change moment.">
        <button type="button" class="g-arrow prev" data-step="-1" aria-label="Previous moment">‹</button>
        ${other && G.mode === 'slider' ? slider(G.version, other) : `<div class="g-figs">${figure(G.version, !!other)}${other ? figure(other, true) : ''}</div>`}
        <button type="button" class="g-arrow next" data-step="1" aria-label="Next moment">›</button>
      </div>
      <div class="g-strip" role="tablist" aria-label="Moments">
        ${BEATS.filter(([b]) => poster(G.version, b) || (other && poster(other, b))).map(([b, label]) => {
          const p = poster(G.version, b) || poster(other, b);
          return `<button type="button" role="tab" class="g-beat ${b === G.beat ? 'on' : ''}" aria-selected="${b === G.beat}" data-beat="${b}"><span class="g-beat-img" style="${thumb(p.d, 150)}" aria-hidden="true"></span><span>${esc(label)}</span></button>`;
        }).join('')}
      </div>
      <div class="g-about">
        <div class="g-about-main">
          <p class="eyebrow">${esc(SHORT[G.version])} · ${esc(v.date)}</p>
          <h2>${esc(v.name)}</h2>
          <p class="thesis">${esc(v.thesis)}</p>
          ${vd ? `<p class="g-verdict">${app.glyph(vd.level)} <span>As built, this version’s own combination is: <strong>${esc(vd.text)}</strong></span></p>` : ''}
          <details class="judged"><summary>How it was judged</summary><p>${esc(v.judged)}</p></details>
          ${v.url ? `<p class="small"><a href="${esc(v.url)}" target="_blank" rel="noopener">Open ${esc(SHORT[G.version])} itself ↗</a></p>` : ''}
        </div>
        <div class="g-about-side">
          <h3>Ideas from ${esc(SHORT[G.version])} you can use</h3>
          <p class="muted small">Each opens that decision in Compose.</p>
          <ul class="g-concepts">${concepts.map((o) => {
            const dim = model.dims.find((d) => d.id === o.dim);
            const chosen = state.path[o.dim] === o.id;
            return `<li><button type="button" class="g-concept ${chosen ? 'chosen' : ''}" data-concept="${o.id}"><img src="crops/${o.id}${app.crops[o.id]?.anim ? '-still' : ''}.webp" alt="" loading="lazy"><span><span class="eyebrow">${esc(dim.label)}</span>${esc(o.label)}${chosen ? ' <span class="pick">✓ in your concept</span>' : ''}</span></button></li>`;
          }).join('')}</ul>
        </div>
      </div>
      <p class="g-foot muted small">Three side branches (the Print Desks, the Print Workshop and the first Atlas) were placeholder pages. Their content lives on in v4’s Desks and Workshop rooms and in the Atlas.</p>`;
  }

  function slider(a, b) {
    const pa = poster(a, G.beat), pb = poster(b, G.beat);
    if (!pa || !pb) return `<div class="g-figs">${figure(a, true)}${figure(b, true)}</div>`;
    const pos = G.slider ?? 50;
    return `<div class="g-slider" style="--pos:${pos}%">
      <div class="g-sl-img">${img(pb, `${SHORT[b]}: ${pb.shows}`, true)}</div>
      <div class="g-sl-img top">${img(pa, `${SHORT[a]}: ${pa.shows}`, true)}</div>
      <span class="g-sl-line" aria-hidden="true"></span>
      <span class="g-sl-tag l">${esc(SHORT[a])}</span><span class="g-sl-tag r">${esc(SHORT[b])}</span>
      <input type="range" min="0" max="100" value="${pos}" aria-label="Slide between ${esc(SHORT[a])} and ${esc(SHORT[b])}" data-slider>
    </div>`;
  }

  function stepBeat(d) {
    const pool = BEATS.filter(([b]) => poster(G.version, b) || (G.other && poster(G.other, b))).map((b) => b[0]);
    const i = pool.indexOf(G.beat);
    G.beat = pool[(i + d + pool.length) % pool.length];
    render();
    $('#gStage')?.focus({ preventScroll: true });
    announce(beatLabel(G.beat));
  }

  root.addEventListener('click', (e) => {
    const t = e.target.closest('[data-ver],[data-beat],[data-other],[data-mode],[data-step],[data-zoom],[data-concept]');
    if (!t) return;
    if (t.dataset.ver) { G.version = t.dataset.ver; if (G.other === G.version) G.other = null; render(); announce(`${SHORT[G.version]} selected`); }
    else if (t.dataset.beat) { G.beat = t.dataset.beat; render(); }
    else if (t.dataset.other !== undefined) { G.other = t.dataset.other || null; render(); }
    else if (t.dataset.mode) { G.mode = t.dataset.mode; render(); }
    else if (t.dataset.step) stepBeat(+t.dataset.step);
    else if (t.dataset.zoom) {
      const list = []; let start = 0;
      for (const [b, label] of beatsOf(t.dataset.zoom)) {
        const p = poster(t.dataset.zoom, b);
        if (b === G.beat) start = list.length;
        list.push({ src: p.d, title: `${SHORT[t.dataset.zoom]} · ${label}`, sub: p.shows });
      }
      app.lightbox.open(list, start);
    } else if (t.dataset.concept) {
      const o = engine.byId[t.dataset.concept];
      state.step = model.dims.findIndex((d) => d.id === o.dim);
      app.go('compose', { focusOpt: o.id });
    }
  });
  root.addEventListener('input', (e) => {
    if (!e.target.matches('[data-slider]')) return;
    G.slider = +e.target.value;
    e.target.closest('.g-slider').style.setProperty('--pos', G.slider + '%');
  });
  root.addEventListener('keydown', (e) => {
    if (e.target.matches('input,textarea,select')) return;
    if (e.key === 'ArrowLeft' && e.target.closest('#gStage')) { e.preventDefault(); stepBeat(-1); }
    if (e.key === 'ArrowRight' && e.target.closest('#gStage')) { e.preventDefault(); stepBeat(1); }
  });
  let sx = null, sy = null;
  root.addEventListener('pointerdown', (e) => { if (e.target.closest('.g-figs')) { sx = e.clientX; sy = e.clientY; } });
  root.addEventListener('pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { e.preventDefault(); stepBeat(dx < 0 ? 1 : -1); }
  });

  return { render };
}

/* Edo and the floating world — the engine: story column, world map, timeline, tools. d3 v7, topojson-client v3. */
(function () {
'use strict';
const D = window.EDO;
const $ = (s, el) => (el || document).querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const fmt = d3.format(',');

/* ------------------------------------------------------------------ MAP */
const Map = (function () {
  const svg = d3.select('#map');
  const gRoot = svg.append('g').attr('class', 'root');
  const gLand = gRoot.append('g').attr('class', 'land');
  const gArcs = gRoot.append('g').attr('class', 'arcs');
  const gPts = gRoot.append('g').attr('class', 'pts');
  const gLabels = svg.append('g').attr('class', 'labels');
  const proj = d3.geoMercator().rotate([-150, 0]);
  const path = d3.geoPath(proj);
  let W = 10, H = 10, tf = d3.zoomIdentity, world = null, scene = null, explore = false;
  const zoom = d3.zoom().scaleExtent([0.8, 60]).on('zoom', (ev) => { tf = ev.transform; apply(); });
  const cityBox = $('#city');

  function size() {
    const r = $('#mapwrap').getBoundingClientRect(); W = Math.max(10, r.width); H = Math.max(10, r.height);
    svg.attr('viewBox', `0 0 ${W} ${H}`);
    // fit the full 360° of longitude to the width (Pacific-centred); centre the height on lat 22
    const sc = W / (2 * Math.PI);
    proj.scale(sc).translate([W / 2, H / 2]);
    const yc = proj([150, 22])[1];
    proj.translate([W / 2, H / 2 + (H / 2 - yc)]);
    if (world) draw();
    if (scene) go(scene, 0);
  }
  function draw() {
    gLand.selectAll('path').data([world]).join('path').attr('d', path);
    const gr = d3.geoGraticule10();
    gLand.selectAll('path.grat').data([gr]).join('path').attr('class', 'grat').attr('d', path);
  }
  function apply() {
    gRoot.attr('transform', tf);
    const k = tf.k;
    gPts.selectAll('circle.pt').attr('r', 5.5 / k).attr('stroke-width', 2 / k);
    gPts.selectAll('circle.halo').attr('r', 12 / k).attr('stroke-width', 1 / k);
    gLabels.selectAll('g.lab').attr('transform', d => { const p = tf.apply(proj([d.lon, d.lat])); return `translate(${p[0]},${p[1]})`; });
  }
  const VIEWS = {
    world: [[-150 + 0.1, -45], [-150 - 0.1 + 360, 70]],   // whole sphere width
    japan: [[127, 30], [147, 46]],
    kanto: [[137.6, 34.6], [140.9, 36.4]],
    tokaido: [[134.6, 33.9], [140.6, 36.3]],
    blue: [[-12, -14], [150, 64]],
    pacific: [[115, 10], [-60 + 360, 58]],
    europe: [[-10, 41], [18, 56]],
    export: [[-20, 0], [-55 + 360, 65]],
    city: [[137.6, 34.6], [140.9, 36.4]]
  };
  function fitTransform(box) {
    let [[x0, y0], [x1, y1]] = box;
    // project the four corners and the mid-edges (Mercator is monotone, corners suffice)
    const pts = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(c => proj(c));
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    let bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
    const pad = 0.88;
    const k = Math.min(60, pad / Math.max((bx1 - bx0) / W, (by1 - by0) / H));
    const tx = W / 2 - k * (bx0 + bx1) / 2, ty = H / 2 - k * (by0 + by1) / 2;
    return d3.zoomIdentity.translate(tx, ty).scale(k);
  }
  function arcCoords(a, b) {
    const ip = d3.geoInterpolate([a.lon, a.lat], [b.lon, b.lat]);
    return {type: 'LineString', coordinates: d3.range(0, 1.0001, 1 / 40).map(ip)};
  }
  function go(sc, dur) {
    scene = sc; dur = dur == null ? 1500 : dur;
    const view = sc.view || 'world';
    const t = view === 'world' ? d3.zoomIdentity : fitTransform(VIEWS[view] || VIEWS.world);
    svg.transition().duration(dur).ease(d3.easeCubicInOut).call(zoom.transform, t);
    // points
    const pts = (sc.points || []).map(id => Object.assign({id}, D.P[id]));
    const extra = [];
    (sc.arcs || []).forEach(([a, b]) => [a, b].forEach(id => { if (!pts.find(p => p.id === id)) { pts.push(Object.assign({id}, D.P[id])); } }));
    const pj = gPts.selectAll('g.p').data(pts, d => d.id);
    pj.exit().transition().duration(400).style('opacity', 0).remove();
    const pe = pj.enter().append('g').attr('class', 'p').style('opacity', 0);
    pe.append('circle').attr('class', 'halo');
    pe.append('circle').attr('class', 'pt');
    pe.merge(pj).attr('transform', d => { const p = proj([d.lon, d.lat]); return `translate(${p[0]},${p[1]})`; })
      .transition().delay((d, i) => 200 + i * 90).duration(500).style('opacity', 1);
    // labels (screen space)
    const lj = gLabels.selectAll('g.lab').data(pts, d => d.id);
    lj.exit().transition().duration(300).style('opacity', 0).remove();
    const le = lj.enter().append('g').attr('class', 'lab').style('opacity', 0);
    le.append('text').attr('class', 'bg').attr('dx', 9).attr('dy', 4);
    le.append('text').attr('class', 'fg').attr('dx', 9).attr('dy', 4);
    le.merge(lj).each(function (d) { d3.select(this).selectAll('text').text(d.name); })
      .transition().delay((d, i) => 500 + i * 90).duration(500).style('opacity', 1);
    // arcs
    const arcs = (sc.arcs || []).map(([a, b, label]) => ({id: a + '-' + b, a: D.P[a], b: D.P[b], label}));
    const aj = gArcs.selectAll('path.arc').data(arcs, d => d.id);
    aj.exit().transition().duration(300).style('opacity', 0).remove();
    aj.enter().append('path').attr('class', 'arc').attr('d', d => path(arcCoords(d.a, d.b)))
      .each(function () { const L = this.getTotalLength(); d3.select(this).attr('stroke-dasharray', L + ' ' + L).attr('stroke-dashoffset', L); })
      .transition().delay((d, i) => dur * 0.5 + i * 350).duration(900).ease(d3.easeCubicOut).attr('stroke-dashoffset', 0);
    // route (polyline through points)
    const route = sc.route ? [{id: 'route', pts: sc.route.map(id => D.P[id])}] : [];
    const rj = gArcs.selectAll('path.route').data(route, d => d.id);
    rj.exit().transition().duration(300).style('opacity', 0).remove();
    rj.enter().append('path').attr('class', 'route')
      .attr('d', d => path({type: 'LineString', coordinates: d.pts.map(p => [p.lon, p.lat])}))
      .each(function () { const L = this.getTotalLength(); d3.select(this).attr('stroke-dasharray', L + ' ' + L).attr('stroke-dashoffset', L); })
      .transition().delay(dur * 0.6).duration(1600).ease(d3.easeCubicOut).attr('stroke-dashoffset', 0);
    // city overlay
    if (sc.view === 'city') showCity(sc); else hideCity();
    apply();
  }
  function showCity(sc) {
    cityBox.classList.add('on');
    const pins = $('#citypins'); pins.innerHTML = '';
    (sc.city || []).forEach((id, i) => {
      const c = D.CITY[id]; if (!c) return;
      const p = el('div', 'pin', `<span class="dot"></span><span class="lbl">${c.label}</span>`);
      p.style.left = c.x + '%'; p.style.top = c.y + '%'; p.style.transitionDelay = (300 + i * 120) + 'ms';
      if (c.x > 62) p.classList.add('flip');
      pins.appendChild(p); requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('on')));
    });
    const mv = $('#citymove'); mv.innerHTML = '';
    if (sc.move) {
      [['theatres', 'asakusa'], ['kobiki', 'asakusa']].forEach(([a, b], i) => {
        const A = D.CITY[a], B = D.CITY[b];
        const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        ln.setAttribute('x1', A.x); ln.setAttribute('y1', A.y); ln.setAttribute('x2', B.x); ln.setAttribute('y2', B.y);
        ln.setAttribute('class', 'mv'); ln.style.animationDelay = (600 + i * 300) + 'ms'; mv.appendChild(ln);
      });
    }
  }
  function hideCity() { cityBox.classList.remove('on'); }
  function setExplore(on) {
    explore = on;
    if (on) svg.call(zoom); else svg.on('.zoom', null);
  }
  function arcsOnly(arcs, points) { go(Object.assign({}, scene, {arcs, points: points || scene.points}), 600); }
  d3.json('data/countries-50m.json').then(topo => {
    world = topojson.feature(topo, topo.objects.countries);
    size(); draw(); if (scene) go(scene, 0);
  });
  window.addEventListener('resize', size);
  return {go, size, setExplore, arcsOnly, get scene() { return scene; }};
})();

/* ------------------------------------------------------------- TIMELINE */
const Timeline = (function () {
  const svg = d3.select('#timeline');
  let W = 10, H = 150;
  const g = svg.append('g');
  const gEras = g.append('g').attr('class', 'eras');
  const gTicks = g.append('g').attr('class', 'ticks');
  const gEv = g.append('g').attr('class', 'events');
  const gHead = g.append('g').attr('class', 'head');
  let year = 1603, shown = [], onPick = null;
  const BREAK = 1870;
  let x1, x2;
  function x(y) { return y <= BREAK ? x1(y) : x2(y); }
  function size() {
    const r = $('#timeline').getBoundingClientRect(); W = Math.max(10, r.width); H = Math.max(10, r.height);
    svg.attr('viewBox', `0 0 ${W} ${H}`);
    const pad = 14, split = pad + (W - 2 * pad) * 0.70, gap = 18;
    x1 = d3.scaleLinear().domain([1600, BREAK]).range([pad, split]);
    x2 = d3.scaleLinear().domain([BREAK, 2030]).range([split + gap, W - pad]);
    render();
  }
  function render() {
    const bandY = H - 34, bandH = 14;
    const eras = gEras.selectAll('g.era').data(D.ERAS, d => d.id);
    const ee = eras.enter().append('g').attr('class', d => 'era era-' + d.id);
    ee.append('rect'); ee.append('text');
    ee.merge(eras).select('rect').attr('x', d => x(d.from) + 1).attr('y', bandY).attr('height', bandH)
      .attr('width', d => Math.max(2, x(Math.min(d.to, 2026)) - x(d.from) - 2));
    ee.merge(eras).select('text').attr('x', d => x(d.from) + 4).attr('y', bandY + bandH + 12)
      .text(d => { const w = x(Math.min(d.to, 2026)) - x(d.from); return w > 110 ? d.name : (w > 52 ? (d.short || '') : ''); });
    // year ticks
    const yrs = [1600, 1650, 1700, 1750, 1800, 1850, 1870, 1900, 1950, 2000, 2024];
    const tk = gTicks.selectAll('g.tk').data(yrs);
    const te = tk.enter().append('g').attr('class', 'tk');
    te.append('line'); te.append('text');
    te.merge(tk).attr('transform', d => `translate(${x(d)},0)`);
    te.merge(tk).select('line').attr('y1', bandY - 4).attr('y2', bandY + bandH + 4);
    te.merge(tk).select('text').attr('y', 12).attr('text-anchor', 'middle').text(d => d);
    // break glyph
    gTicks.selectAll('path.brk').data([0]).join('path').attr('class', 'brk')
      .attr('d', `M${x1(BREAK) + 4},${bandY - 6} l4,8 l-4,8 l4,8 M${x2(BREAK) - 4},${bandY - 6} l4,8 l-4,8 l4,8`);
    // events
    const ev = gEv.selectAll('g.ev').data(D.EVENTS, d => d.id);
    const en = ev.enter().append('g').attr('class', 'ev');
    en.append('line').attr('class', 'stem');
    en.append('circle').attr('class', 'knob');
    en.append('clipPath').attr('id', d => 'clip-' + d.id).append('circle').attr('r', 15).attr('cx', 0).attr('cy', 0);
    en.filter(d => d.img).append('image').attr('href', d => d.img).attr('width', 30).attr('height', 30).attr('x', -15).attr('y', -15)
      .attr('preserveAspectRatio', 'xMidYMid slice').attr('clip-path', d => `url(#clip-${d.id})`);
    en.append('circle').attr('class', 'ring').attr('r', 15);
    en.append('text').attr('class', 'evlab').attr('text-anchor', 'middle');
    en.on('click', (e, d) => onPick && onPick(d));
    const all = en.merge(ev);
    all.attr('transform', d => `translate(${x(d.year)},${bandY + bandH / 2})`);
    all.select('line.stem').attr('y1', 0).attr('y2', d => -(d.lift || 36));
    all.select('circle.knob').attr('r', 3);
    all.select('circle.ring').attr('cy', d => -(d.lift || 36));
    all.select('image').attr('transform', d => `translate(0,${-(d.lift || 36)})`);
    all.select('text.evlab').attr('y', d => -(d.lift || 36) - 20).text(d => d.year + ' · ' + d.label)
      .attr('text-anchor', d => x(d.year) > W - 120 ? 'end' : (x(d.year) < 120 ? 'start' : 'middle'));
    all.classed('has-img', d => !!d.img);
    update(0);
    // playhead
    const hd = gHead.selectAll('g.ph').data([0]).join(enter => { const gg = enter.append('g').attr('class', 'ph'); gg.append('line'); gg.append('rect'); gg.append('text'); return gg; });
    hd.select('line').attr('y1', 14).attr('y2', bandY + bandH + 2);
    hd.select('rect').attr('x', -23).attr('y', bandY - 3).attr('width', 46).attr('height', bandH + 6).attr('rx', 3);
    hd.select('text').attr('y', bandY + bandH / 2 + 4).attr('text-anchor', 'middle');
    hd.attr('transform', `translate(${x(year)},0)`);
    hd.select('text').text(year);
  }
  function update(dur) {
    // spread lifted events so thumbnails do not overlap: alternate heights among shown
    const sh = D.EVENTS.filter(e => shown.indexOf(e.id) >= 0).sort((a, b) => a.year - b.year);
    sh.forEach((e, i) => { e.lift = 36 + (i % 3) * 27; });
    gEv.selectAll('g.ev').classed('on', d => shown.indexOf(d.id) >= 0).classed('past', d => d.year <= year)
      .each(function (d) { if (shown.indexOf(d.id) < 0) d.lift = 36; });
    const sel = gEv.selectAll('g.ev').transition().duration(dur || 500);
    sel.select('line.stem').attr('y2', d => -(d.lift));
    sel.select('circle.ring').attr('cy', d => -(d.lift));
    sel.select('image').attr('transform', d => `translate(0,${-(d.lift)})`);
    sel.select('text.evlab').attr('y', d => -(d.lift) - 20);
    gEv.selectAll('g.ev.on').raise();
  }
  function go(t, dur) {
    dur = dur == null ? 1200 : dur;
    const target = t.year;
    shown = t.show || [];
    const hd = gHead.select('g.ph');
    const from = year;
    hd.transition().duration(dur).ease(d3.easeCubicInOut)
      .attrTween('transform', () => (k) => `translate(${x(from + (target - from) * k)},0)`)
      .tween('yr', () => (k) => { hd.select('text').text(Math.round(from + (target - from) * k)); gEv.selectAll('g.ev').classed('past', d => d.year <= from + (target - from) * k); });
    year = target;
    setTimeout(() => update(500), dur * 0.5);
  }
  size(); window.addEventListener('resize', size);
  return {go, size, set onPick(f) { onPick = f; }};
})();

/* ------------------------------------------------------------- STORY DOM */
const Story = (function () {
  const root = $('#story');
  const beats = []; // {id, el, scene, chapter}
  function castCard(id) {
    const p = D.PEOPLE[id]; if (!p) return '';
    return `<figure class="cast"><img src="${p.img}" alt="${p.name}" loading="lazy"${dims(p.img)}><figcaption><b>${p.name}</b> <span class="k">${p.kanji}</span><span class="d">${p.dates} · ${p.role}</span><span class="l">${p.line}</span><span class="c">${p.cap}</span></figcaption></figure>`;
  }
  function dims(src) { const d = D.DIMS && D.DIMS[src]; return d ? ` width="${d[0]}" height="${d[1]}"` : ''; }
  function figure(f) {
    return `<figure class="fig${f.wide ? ' wide' : ''}"><img src="${f.src}" alt="${f.alt}" loading="lazy"${dims(f.src)}><figcaption>${f.cap}</figcaption></figure>`;
  }
  D.CHAPTERS.forEach(ch => {
    const sec = el('section', 'chapter', ''); sec.id = ch.id;
    sec.appendChild(el('header', 'chead', `<div class="num">${ch.n ? 'Chapter ' + ch.n : ''}</div><h2>${ch.title}</h2><div class="kicker">${ch.kicker}</div>`));
    ch.beats.forEach(b => {
      const art = el('article', 'beat'); art.id = b.id;
      if (b.note === 'yoshiwara') art.appendChild(el('div', 'cnote', '<b>Content note.</b> This section concerns a licensed sex-work quarter and the women held there under contract. It names them as people, gives the contract’s documented terms and both scholarly readings, and uses no image as decoration. <button class="skip" data-skip="b3-3">Skip this section</button>'));
      art.appendChild(el('div', 'text', b.html));
      if (b.people) art.appendChild(el('div', 'castrow', b.people.map(castCard).join('')));
      if (b.fig) art.insertAdjacentHTML('beforeend', figure(b.fig));
      if (b.figs) art.appendChild(el('div', 'figrow', b.figs.map(figure).join('')));
      if (b.tool) { const t = el('div', 'tool tool-' + b.tool); t.dataset.tool = b.tool; art.appendChild(t); }
      sec.appendChild(art);
      beats.push({id: b.id, el: art, scene: b.scene, chapter: ch, tool: b.tool});
    });
    root.appendChild(sec);
  });
  // cast rail + sources
  const end = el('section', 'chapter end'); end.id = 'end';
  end.appendChild(el('header', 'chead', '<div class="num">The cast</div><h2>Who you met, by role</h2><div class="kicker">The organiser first, because the trade put him first. Names in Japanese order; carvers and printers not recorded, and said so.</div>'));
  end.appendChild(el('div', 'castgrid', Object.keys(D.PEOPLE).map(castCard).join('')));
  end.appendChild(el('header', 'chead', '<div class="num">Sources</div><h2>What this rests on</h2>'));
  end.appendChild(el('ol', 'sources', D.SOURCES.map(s => `<li>${s}</li>`).join('')));
  root.appendChild(end);
  root.querySelectorAll('button.skip').forEach(b => b.addEventListener('click', () => { const nxt = $('#b3-4'); nxt && nxt.scrollIntoView({behavior: 'smooth', block: 'start'}); }));
  return {beats};
})();

/* ------------------------------------------------------------- TOOLS */
const Tools = {};
Tools.process = function (box) {
  box.innerHTML = `<div class="thead"><span class="tl">Tool · the chain</span><button class="btn play">Play the chain</button></div>
  <div class="chain">
    <div class="stage" data-s="0"><div class="ic">版元</div><b>Publisher</b><span>plans, pays, applies, sells</span></div><div class="arr">→</div>
    <div class="stage" data-s="1"><div class="ic">絵師</div><b>Designer</b><span>the drawing, destroyed in cutting</span></div><div class="arr">→</div>
    <div class="stage" data-s="2"><div class="ic">彫師</div><b>Carver</b><span>key block, then one block a colour</span></div><div class="arr">→</div>
    <div class="stage" data-s="3"><div class="ic">摺師</div><b>Printer</b><span>one block at a time, every sheet</span></div><div class="arr">→</div>
    <div class="stage" data-s="4"><div class="ic">店</div><b>Shop front</b><span>sold at Nihonbashi, 16–24 mon</span></div>
  </div>
  <div class="counters"><div><b class="c-blocks">0</b><span>blocks cut</span></div><div><b class="c-day">0</b><span>days printing</span></div><div><b class="c-sheets">0</b><span>impressions</span></div><div><b class="c-state">—</b><span>publisher’s position</span></div></div>
  <p class="tnote">Documented: about ten blocks for an ordinary colour print, up to twenty; about 200 impressions a day from one printer; a publisher needed to sell at least 2,000 to profit (standard estimate; probable).</p>`;
  const stages = box.querySelectorAll('.stage');
  box.querySelector('.play').addEventListener('click', () => {
    stages.forEach(s => s.classList.remove('on')); let i = 0;
    const cb = box.querySelector('.c-blocks'), cd = box.querySelector('.c-day'), cs = box.querySelector('.c-sheets'), cst = box.querySelector('.c-state');
    cb.textContent = 0; cd.textContent = 0; cs.textContent = 0; cst.textContent = 'paying';
    const step = () => { if (i < 3) { stages[i].classList.add('on'); if (i === 2) { let b = 0; const bi = setInterval(() => { b++; cb.textContent = b; if (b >= 10) clearInterval(bi); }, 120); } i++; setTimeout(step, 900); } else { stages[3].classList.add('on'); print(); } };
    const print = () => { let day = 0, sheets = 0; const t = setInterval(() => { day++; sheets += 200; cd.textContent = day; cs.textContent = fmt(sheets); if (sheets >= 2000) { cst.textContent = 'break-even'; stages[4].classList.add('on'); } if (sheets >= 4000) { clearInterval(t); cst.textContent = 'in profit; blocks kept for reprinting'; } }, 260); };
    step();
  });
};

Tools.margin = function (box) {
  const R = {
    1: {k: 'Top right margin · two round seals', t: 'Censor’s seal and date seal', j: '改 · 巳九', b: 'The upper seal reads <em>aratame</em>, "examined": the censor’s approval. The lower is a date: Snake year, ninth month. From 1853 every sheet had to carry both; before that a named censor’s seal (1843–52), and before that the single <em>kiwame</em> seal (1790–1842).', w: 'the censor, on the key block before printing', i: 'the ninth month of 1857; the record agrees'},
    2: {k: 'Right edge · red cartouche', t: 'Series title', j: '名所江戸百景', b: '<em>Meisho Edo hyakkei</em>, One Hundred Famous Views of Edo: the publisher’s product line, 1856–58, sold sheet by sheet. The same block on every sheet of the series; buyers collected by it.', w: 'the publisher’s design, cut with the key block', i: 'a serial product, not a single picture'},
    3: {k: 'Top right · yellow cartouche', t: 'The sheet’s own title', j: '大はしあたけの夕立', b: '<em>Ōhashi Atake no yūdachi</em>: sudden shower over the great bridge and Atake. The title names a place first; the people on the bridge are its weather.', w: 'the designer or the publisher; not recorded which', i: 'a place on the Sumida, pinned on the city map'},
    4: {k: 'Lower left · red cartouche', t: 'Signature', j: '広重画', b: '<em>Hiroshige ga</em>, "drawn by Hiroshige". One of the four hands, and the only one the sheet names. The carver who cut these rain lines and the printer who pulled the gradation of the sky are not recorded anywhere.', w: 'the designer, as part of the drawing', i: 'who is credited, and who is not'},
    5: {k: 'Lower left margin · small seal', t: 'Publisher’s seal', j: '下谷 魚栄', b: 'Shitaya, Uoya Eikichi: the publisher’s mark with his district. He commissioned the design, paid the carver and printer, applied to the censor and sold the sheet from his shop. From 1790 the law made him, not the carver, answerable for it.', w: 'the publisher', i: 'the organiser of the whole chain'}
  };
  const HS = [[1, 80.5, 0.6, 10.5, 4], [2, 82.5, 6.4, 5.5, 16.5], [3, 69.5, 7.6, 11, 10], [4, 11, 76, 6, 13], [5, 3.8, 82.6, 5, 6.6]];
  box.innerHTML = `<div class="thead"><span class="tl">Tool · read the margin</span><span class="tr"><b class="found">0</b> of 5 marks read</span></div>
  <div class="mg"><div class="sheet"><img src="img/shower-met-jp2522.jpg" alt="Hiroshige, Sudden Shower over Shin-Ōhashi Bridge and Atake, 1857">${HS.map(h => `<button class="hs" data-n="${h[0]}" style="left:${h[1]}%;top:${h[2]}%;width:${h[3]}%;height:${h[4]}%" aria-label="${R[h[0]].t}"></button>`).join('')}</div>
  <div class="read"><div class="rk">Tap a mark on the sheet</div><div class="rt">Five marks, four hands and a state</div><div class="rb">Everything a print says about its own making sits outside the picture. The picture is the product; the margin is the paperwork.</div><div class="rw"></div>
  <div class="check"><div class="ck">Check · from its seals alone, which band of the censor’s timeline does this sheet belong to?</div><div class="opts"><button data-b="1"><b>before 1790</b><span>no seal required</span></button><button data-b="2"><b>1790–1842</b><span>one round kiwame seal</span></button><button data-b="3"><b>1843–1852</b><span>named censors’ seals</span></button><button data-b="4"><b>1853–1875</b><span>aratame seal with a date</span></button></div><div class="verdict"></div></div></div></div>`;
  const found = {};
  box.querySelectorAll('.hs').forEach(h => h.addEventListener('click', () => {
    const n = h.dataset.n, r = R[n]; found[n] = 1;
    box.querySelectorAll('.hs').forEach(x => x.classList.toggle('on', x === h)); h.classList.add('found');
    box.querySelector('.rk').textContent = r.k; box.querySelector('.rt').innerHTML = `${r.t} <span class="k">${r.j}</span>`; box.querySelector('.rb').innerHTML = r.b;
    box.querySelector('.rw').innerHTML = `<b>Who put it there:</b> ${r.w} · <b>What it implies:</b> ${r.i}`;
    box.querySelector('.found').textContent = Object.keys(found).length;
    if (Object.keys(found).length === 5) box.querySelector('.check').classList.add('on');
  }));
  box.querySelector('.check').classList.add('on');
  box.querySelectorAll('.opts button').forEach(b => b.addEventListener('click', () => {
    const n = +b.dataset.b; box.querySelectorAll('.opts button').forEach(x => x.classList.toggle('right', +x.dataset.b === 4)); b.classList.toggle('wrong', n !== 4);
    box.querySelector('.verdict').innerHTML = (n === 4 ? '<b>1853–1875. The seals date it.</b> ' : '<b>Not that band.</b> The sheet carries an <em>aratame</em> seal with a date, so it is 1853 or later. ') + 'The record says 1857; the date seal reads the ninth month of a Snake year, which is 1857. On the timeline the band lights.';
    Timeline.go({year: 1857, show: ['e1857']});
  }));
};

Tools.blue = function (box) {
  box.innerHTML = `<div class="thead"><span class="tl">Tool · the blue route</span><span class="tr"><b class="yr">1704</b></span></div>
  <input type="range" class="scrub" min="1704" max="1835" value="1704" step="1" aria-label="Year">
  <div class="legs"><div data-y="1704"><b>1704–06 · Berlin</b><span>a colour-maker’s red comes out blue</span></div><div data-y="1750"><b>By the 1750s · Amsterdam → Batavia → Nagasaki</b><span>on Dutch ships, costly; known in Japan, little used</span></div><div data-y="1820"><b>1820s · Canton → Nagasaki</b><span>Chinese makers produce it in bulk</span></div><div data-y="1824"><b>1824–28 · the price falls</b><span>steeply, by the import records at Nagasaki</span></div><div data-y="1829"><b>1829 · Edo</b><span>Eisen’s all-blue prints sell</span></div><div data-y="1831"><b>1831 · Edo</b><span>Eijudō advertises the Fuji series "in the new blue"</span></div></div>
  <div class="pricebox"><div class="pl">Price at Nagasaki, 1824–28 (schematic of a documented fall; the figures are in the research file)</div><div class="bars"><div style="height:100%"><i>1824</i></div><div style="height:78%"><i>1825</i></div><div style="height:55%"><i>1826</i></div><div style="height:38%"><i>1827</i></div><div style="height:24%"><i>1828</i></div></div></div>
  <div class="check on"><div class="ck">Check · where was the blue in a sheet sold in Edo in 1831 made?</div><div class="opts"><button data-b="1"><b>In Japan</b></button><button data-b="2"><b>In the Netherlands only</b></button><button data-b="3"><b>In Prussia and elsewhere in Europe, and by then in China</b></button></div><div class="verdict"></div></div>`;
  const s = box.querySelector('.scrub'), yr = box.querySelector('.yr'), legs = box.querySelectorAll('.legs div');
  const ARCS = [[1704, ['berlin', 'amsterdam']], [1750, ['amsterdam', 'batavia']], [1750, ['batavia', 'nagasaki']], [1820, ['canton', 'nagasaki']], [1829, ['nagasaki', 'edo']]];
  let last = -1;
  const set = (y) => {
    yr.textContent = y; legs.forEach(l => l.classList.toggle('on', +l.dataset.y <= y));
    box.querySelector('.pricebox').classList.toggle('on', y >= 1824);
    const n = ARCS.filter(a => a[0] <= y).length;
    if (n !== last) { last = n; Map.arcsOnly(ARCS.filter(a => a[0] <= y).map(a => a[1]), ['berlin', 'amsterdam', 'batavia', 'canton', 'nagasaki', 'edo']); }
  };
  s.addEventListener('input', () => set(+s.value));
  box.querySelectorAll('.opts button').forEach(b => b.addEventListener('click', () => {
    const n = +b.dataset.b; box.querySelectorAll('.opts button').forEach(x => x.classList.toggle('right', +x.dataset.b === 3)); b.classList.toggle('wrong', n !== 3);
    box.querySelector('.verdict').innerHTML = '<b>Never in Japan in the period.</b> European-made first, Chinese-made in bulk from the 1820s, which is what made it cheap; by ship through Nagasaki either way. On the map, Japan stays dark at the start of every arc.';
  }));
  box.dataset.onenter = 'blue';
  box._enter = () => { s.value = 1704; last = -1; set(1704); let y = 1704; const t = setInterval(() => { y += 2; if (y > 1835) { clearInterval(t); return; } s.value = y; set(y); }, 60); box._timer = t; };
  box._leave = () => { if (box._timer) clearInterval(box._timer); };
};

Tools.waves = function (box) {
  const IM = [['img/wave-met-jp1847.jpg', 'The Met JP1847 · Havemeyer bequest, 1929', 'earlier'], ['img/wave-met-jp10.jpg', 'The Met JP10 · Rogers Fund, 1914', 'later'], ['img/great-wave-aic.jpg', 'Art Institute of Chicago 1952.343 · Buckingham Collection', 'later still']];
  const DG = [['cartouche', 'Breaks in the border of the title cartouche', 6, 10], ['boat', 'A break behind the right-hand boat', 72, 56], ['summit', 'Loss of fine line near Fuji’s summit', 48, 60], ['foam', 'A splinter printing into the foam (some impressions)', 26, 30]];
  box.innerHTML = `<div class="thead"><span class="tl">Tool · one design, many originals</span><span class="tr seg">${IM.map((m, i) => `<button data-i="${i}" class="${i === 0 ? 'on' : ''}">${i + 1}</button>`).join('')}</span></div>
  <div class="wv"><div class="wvimg">${IM.map((m, i) => `<img src="${m[0]}" alt="Under the Wave off Kanagawa, impression ${i + 1}" class="${i === 0 ? 'on' : ''}">`).join('')}${DG.map(d => `<span class="dg dg-${d[0]}" style="left:${d[2]}%;top:${d[3]}%"></span>`).join('')}</div>
  <div class="wvcap"><span class="cap">${IM[0][1]}</span><span class="st">state: ${IM[0][2]}</span></div>
  <div class="dgs">${DG.map(d => `<button data-d="${d[0]}">${d[1]}</button>`).join('')}</div>
  <p class="tnote">Diagnostics from the British Museum census (Korenberg, 2020); the marks here stand near the passages they name and are set on the sheets in the live build. The Art Institute’s record states its impressions are later than the first state; the Met’s JP1847 is among the earlier printings (probable). Order shown: earlier to later.</p></div>`;
  const imgs = box.querySelectorAll('.wvimg img');
  box.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.i; box.querySelectorAll('.seg button').forEach(x => x.classList.toggle('on', x === b)); imgs.forEach((im, j) => im.classList.toggle('on', j === i)); box.querySelector('.cap').textContent = IM[i][1]; box.querySelector('.st').textContent = 'state: ' + IM[i][2]; }));
  box.querySelectorAll('.dgs button').forEach(b => b.addEventListener('click', () => { b.classList.toggle('on'); box.querySelector('.dg-' + b.dataset.d).classList.toggle('on'); }));
};

Tools.price = function (box) {
  const Dt = {
    1765: {sheet: 'no sourced figure', ss: 'full colour arrives this year; price not read', sv: 0, soba: '16 mon', sos: 'probable · standard for most of the period', sob: 16, trip: '—', ts: 'the format is rare before 1780', ctx: 'The first full-colour calendar prints, privately commissioned, then recut for sale.'},
    1790: {sheet: 'c. 20 mon', ss: 'probable · between the 1765 and 1805 sources', sv: 20, soba: '16 mon', sos: 'probable', sob: 16, trip: '—', ts: 'not sourced for this year', ctx: 'The kiwame seal is required from this year; Tsutaya is fined the next.'},
    1805: {sheet: '20 mon', ss: 'documented · a record of 1805', sv: 20, soba: '16 mon', sos: 'probable', sob: 16, trip: '—', ts: 'not sourced', ctx: 'A sheet at the price of a bowl of noodles, by a dated source.'},
    1830: {sheet: 'c. 20–24 mon', ss: 'probable · interpolated', sv: 22, soba: '16 mon', sos: 'probable', sob: 16, trip: '—', ts: 'not sourced', ctx: 'The Fuji series appears the next year in the new blue; the pigment is now cheap.'},
    1842: {sheet: '24 mon → capped at 16', ss: 'documented · the order of the eleventh month', sv: 16, soba: '16 mon', sos: 'probable', sob: 16, trip: 'at most a triptych', ts: 'the cap limits the format', ctx: 'Sixth month: actors, courtesans and geisha forbidden. Eleventh month: 16 mon, seven or eight colours, three sheets at most.'},
    1848: {sheet: '16–24 mon', ss: 'probable · the cap in force, loosely', sv: 20, soba: '16–24 mon', sos: 'probable · 24 by mid-century', sob: 20, trip: '60–72 mon', ts: 'documented · the Fujiokaya diary', ctx: 'Kuniyoshi’s 51 retainers finish their run: 8,000 sets.'},
    1860: {sheet: 'c. 24 mon', ss: 'probable · "about 24 by the end of the period"', sv: 24, soba: '24 mon', sos: 'probable', sob: 24, trip: '72 mon', ts: 'probable', ctx: 'Yokohama is open; the Hundred Views are finished; aniline dyes are four years away.'}
  };
  const yrs = Object.keys(Dt).map(Number);
  box.innerHTML = `<div class="thead"><span class="tl">Tool · what a sheet cost</span><span class="tr"><i class="sw a"></i> sheet <i class="sw b"></i> soba, in mon</span></div>
  <div class="pr"><div class="bars"><div class="cap" style="bottom:${16 / 72 * 100}%"><span>the 1842 cap · 16 mon</span></div>${yrs.map(y => `<button class="col" data-y="${y}"><span class="bb"><span class="bar a" style="height:${Dt[y].sv / 72 * 100}%"></span><span class="bar b" style="height:${Dt[y].sob / 72 * 100}%"></span></span><span class="yl">${y}</span></button>`).join('')}</div>
  <div class="card"><div class="cy"></div><div class="cx"></div><div class="row"><span>An ōban sheet</span><span><b class="v1"></b><i class="s1"></i></span></div><div class="row"><span>A bowl of soba</span><span><b class="v2"></b><i class="s2"></i></span></div><div class="row"><span>A triptych</span><span><b class="v3"></b><i class="s3"></i></span></div><div class="row"><span>A theatre seat, Ryōgoku, 1820</span><span><b>32 momme of silver</b><i>secondary list · probable</i></span></div></div></div>
  <div class="check on"><div class="ck">Check · in 1842 the state cut the price of an ordinary sheet by about what share?</div><div class="opts"><button data-b="1"><b>A tenth</b></button><button data-b="2"><b>A third</b></button><button data-b="3"><b>A half</b></button></div><div class="verdict"></div></div>`;
  const set = (y) => { const d = Dt[y]; box.querySelectorAll('.col').forEach(c => c.classList.toggle('on', +c.dataset.y === y)); box.querySelector('.cy').textContent = y; box.querySelector('.cx').textContent = d.ctx; box.querySelector('.v1').textContent = d.sheet; box.querySelector('.s1').textContent = d.ss; box.querySelector('.v2').textContent = d.soba; box.querySelector('.s2').textContent = d.sos; box.querySelector('.v3').textContent = d.trip; box.querySelector('.s3').textContent = d.ts; Timeline.go({year: y, show: y === 1842 ? ['e1842'] : y === 1848 ? ['e1847'] : []}, 600); };
  box.querySelectorAll('.col').forEach(c => c.addEventListener('click', () => set(+c.dataset.y)));
  set(1830);
  box.querySelectorAll('.opts button').forEach(b => b.addEventListener('click', () => { const n = +b.dataset.b; box.querySelectorAll('.opts button').forEach(x => x.classList.toggle('right', +x.dataset.b === 2)); b.classList.toggle('wrong', n !== 2); box.querySelector('.verdict').innerHTML = '<b>About a third: 24 mon to 16.</b> The trade answered with fewer colours, more triptychs at 60–72, and warriors.'; set(1842); }));
};

Tools.ban = function (box) {
  box.innerHTML = `<div class="thead"><span class="tl">Tool · before and after the ban</span><span class="tr"><b class="yr">1838</b></span></div>
  <div class="bn"><div class="side"><div class="sl">What the ban named · courtesans, geisha, actors</div><div class="im"><img src="img/kiyonaga-cma-1930-197.jpg" alt="Kiyonaga, diptych, 1783" class="a"><div class="stamp">FORBIDDEN · 1842</div></div><div class="cp">Torii Kiyonaga, diptych, 1783 · Cleveland 1930.197, CC0. Stand-in for the genre; the live build uses Kunisada’s actor triptych with Danjūrō VII (Art Institute 2004.241–243).</div></div>
  <div class="side"><div class="sl">What the trade sold instead · warriors, landscapes, sumō</div><div class="im"><img src="img/taira-met-jp1115.jpg" alt="Kuniyoshi, Ghosts of the Taira at Daimotsu Bay" class="b"></div><div class="cp">Utagawa Kuniyoshi, <em>Ghosts of the Taira at Daimotsu Bay</em>, triptych, 1849–52 · The Met JP1115, CC0.</div></div></div>
  <input type="range" class="scrub" min="1835" max="1850" value="1838" step="1" aria-label="Year">
  <div class="yl"></div>
  <div class="edict"><div class="eh">The edict · sixth month of 1842</div><div class="et">Single sheets of kabuki actors, courtesans and female geisha concern public morals. Their publication, and the sale of existing stock, are forbidden. Subjects should be loyalty, filial piety, chastity and the moral instruction of children.</div><div class="en">Paraphrase of the transcribed order; eleventh month: not above 16 mon, seven or eight impressions, a triptych at most.</div></div>
  <div class="count"><div class="eh">1847 · a magistrate counts what Edo is selling</div><div class="bar"><span style="width:65%"></span></div><div class="bl"><span>"actors without names": history and warrior sheets with actors’ faces · 6–7 tenths</span><span>everything else · 3–4 tenths</span></div></div>
  <div class="check on"><div class="ck">Check · which subjects did the edict leave alone as morally uplifting?</div><div class="opts"><button data-b="1"><b>Landscapes</b></button><button data-b="2"><b>Warriors and loyal retainers</b></button><button data-b="3"><b>Birds and flowers</b></button></div><div class="verdict"></div></div>`;
  const L = {1835: 'The trade at full stretch: Kunisada, Kuniyoshi, Hiroshige, Hokusai all publishing.', 1839: 'Mizuno Tadakuni becomes senior councillor.', 1841: 'The Tenpō reforms begin; the theatres are ordered out of the centre.', 1842: 'Sixth month: the edict. Eleventh month: the cap of 16 mon.', 1843: 'Named censors replace the kiwame seal; Danjūrō VII is in exile.', 1847: 'A magistrate reports disguised actor prints at six or seven tenths of sales.', 1848: 'Kuniyoshi’s 51 retainers finish their run: 408,000 sheets.', 1850: 'The ban is routine, and routinely routed around.'};
  const s = box.querySelector('.scrub'), a = box.querySelector('img.a'), b = box.querySelector('img.b');
  const set = (y) => { box.querySelector('.yr').textContent = y; const ks = Object.keys(L).map(Number).filter(k => k <= y); box.querySelector('.yl').textContent = L[ks[ks.length - 1]]; a.style.opacity = y < 1842 ? 1 : Math.max(0.12, 1 - (y - 1842) / 4); b.style.opacity = y < 1842 ? 0.12 : Math.min(1, 0.25 + (y - 1842) / 4); box.querySelector('.stamp').classList.toggle('on', y >= 1842); box.querySelector('.edict').classList.toggle('on', y >= 1842); box.querySelector('.count').classList.toggle('on', y >= 1847); };
  s.addEventListener('input', () => set(+s.value)); set(1838);
  box._enter = () => { let y = 1835; s.value = y; set(y); const t = setInterval(() => { y++; if (y > 1850) { clearInterval(t); return; } s.value = y; set(y); }, 260); box._timer = t; };
  box._leave = () => { if (box._timer) clearInterval(box._timer); };
  box.querySelectorAll('.opts button').forEach(bt => bt.addEventListener('click', () => { const n = +bt.dataset.b; box.querySelectorAll('.opts button').forEach(x => x.classList.toggle('right', +x.dataset.b === 2)); bt.classList.toggle('wrong', n !== 2); box.querySelector('.verdict').innerHTML = '<b>Warriors.</b> History and warrior subjects were read as instruction in loyalty and passed; the trade put the banned actors’ faces on them. Landscapes were not exempt by name, only unnamed, which is why Hiroshige’s road and Hokusai’s mountain became the safest products of the century.'; }));
};

Tools.edition = function (box) {
  box.innerHTML = `<div class="thead"><span class="tl">Tool · an edition</span><span class="tr seg"><button data-m="hit" class="on">The hit</button><button data-m="flop">The flop</button></span></div>
  <div class="ed"><div class="big"><b class="n">0</b><span class="u">sheets</span></div><div class="meta"><div><b class="days">0</b><span>days</span></div><div><b class="sets">0</b><span>sets of 51</span></div><div><b class="rate">—</b><span>per printer per day</span></div></div></div>
  <div class="edl"></div><button class="btn play">Play</button>
  <p class="tnote">The Fujiokaya diary: 8,000 sets of 51 sheets between the seventh month of 1847 and the third month of 1848, about 240 days; the same diary’s flop printed 3,000 and sold 450. At 200 impressions a day, one printer needs 40 days for one sheet of 8,000; the series needed many printers, or many months, or both (documented count; the printer arithmetic is the course’s).</p>`;
  let mode = 'hit', timer = null;
  const n = box.querySelector('.n'), days = box.querySelector('.days'), sets = box.querySelector('.sets'), rate = box.querySelector('.rate'), l = box.querySelector('.edl');
  const run = () => { if (timer) clearInterval(timer); let d = 0; const total = mode === 'hit' ? 408000 : 3000, D_ = mode === 'hit' ? 240 : 30; rate.textContent = '200'; timer = setInterval(() => { d++; const v = Math.round(total * d / D_); n.textContent = fmt(v); days.textContent = d; sets.textContent = fmt(Math.round(v / 51)); if (mode === 'hit') l.textContent = d < 60 ? 'Seventh month of 1847: the first sheets, approved by the censor Murata Sahei.' : d < 180 ? 'The run continues; every sheet is a separate design, each with its own blocks.' : 'Third month of 1848: 8,000 sets sold, 408,000 sheets.'; else l.textContent = d < 30 ? 'Three thousand printed.' : 'Four hundred and fifty sold. The rest, waste paper, and the blocks a loss.'; if (d >= D_) { clearInterval(timer); if (mode === 'flop') { n.textContent = '450 sold of 3,000'; } } }, mode === 'hit' ? 22 : 90); };
  box.querySelector('.play').addEventListener('click', run);
  box.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => { mode = b.dataset.m; box.querySelectorAll('.seg button').forEach(x => x.classList.toggle('on', x === b)); run(); }));
  box._enter = run; box._leave = () => { if (timer) clearInterval(timer); };
};

Tools.export = function (box) {
  const ST = [[1867, [['tokyo', 'paris', 'the 1867 pavilion']], 'Japan shows at the Paris exposition.'], [1878, [['tokyo', 'paris', 'Hayashi: 218 shipments']], 'Hayashi arrives in Paris as an interpreter.'], [1887, [['tokyo', 'paris'], ['paris', 'amsterdam', 'Van Gogh’s 660 prints']], 'Van Gogh buys from Bing and paints his copies.'], [1889, [['tokyo', 'paris'], ['paris', 'amsterdam'], ['tokyo', 'washington', 'Tokunō’s blocks and proofs']], 'The Smithsonian receives a complete process set.'], [1890, [['tokyo', 'paris', 'Bing’s 700 prints'], ['paris', 'amsterdam'], ['tokyo', 'washington'], ['tokyo', 'boston', 'Bigelow’s 30,000']], 'Bing hangs over 700 prints at the École des Beaux-Arts.'], [1906, [['tokyo', 'paris'], ['paris', 'amsterdam'], ['tokyo', 'washington'], ['tokyo', 'boston'], ['tokyo', 'chicago', 'Wright, dealer']], 'Wright’s Hiroshige show at the Art Institute.'], [1921, [['tokyo', 'paris'], ['paris', 'amsterdam'], ['tokyo', 'washington'], ['tokyo', 'boston', 'the Spaulding gift: 6,000, never shown'], ['tokyo', 'chicago']], 'The Spaulding brothers give Boston over 6,000 prints on condition they are never exhibited.'], [1925, [['tokyo', 'paris'], ['paris', 'amsterdam'], ['tokyo', 'washington'], ['tokyo', 'boston'], ['tokyo', 'chicago', 'the Buckingham collection']], 'The Buckingham prints enter the Art Institute.']];
  box.innerHTML = `<div class="thead"><span class="tl">Tool · the export map</span><span class="tr"><b class="yr">1867</b></span></div>
  <input type="range" class="scrub" min="1867" max="1925" value="1867" step="1" aria-label="Year"><div class="yl"></div>
  <div class="cities"><div data-c="paris"><b>Paris</b><span>Hayashi: 166,000 prints and 9,708 books in 218 shipments (Segi); over 300,000 (Koyama-Richard). Bing’s journal and his 1890 show.</span></div><div data-c="boston"><b>Boston</b><span>Bigelow’s c. 30,000; Fenollosa as curator; the Spaulding 6,000, never to be exhibited; over 45,000 Japanese prints today.</span></div><div data-c="chicago"><b>Chicago</b><span>Wright’s shows of 1906 and 1908; the Buckingham collection, 1925; three Great Waves, all later states.</span></div><div data-c="washington"><b>Washington</b><span>Tokunō’s blocks, proofs and tools, 1889; the Noyes gift of 1905; over 2,500 prints at the Library of Congress.</span></div></div>
  <div class="check on"><div class="ck">Check · which collection may never be exhibited, by its donors’ condition?</div><div class="opts"><button data-b="1"><b>Hayashi’s, Paris</b></button><button data-b="2"><b>The Spaulding gift, Boston</b></button><button data-b="3"><b>Buckingham, Chicago</b></button></div><div class="verdict"></div></div>`;
  const s = box.querySelector('.scrub'); let last = -1;
  const set = (y) => { box.querySelector('.yr').textContent = y; const st = ST.filter(x => x[0] <= y); const cur = st[st.length - 1]; box.querySelector('.yl').textContent = cur ? cur[2] : ''; box.querySelectorAll('.cities div').forEach(c => c.classList.toggle('on', !!cur && cur[1].some(a => a[1] === c.dataset.c))); if (st.length !== last) { last = st.length; Map.arcsOnly(cur ? cur[1] : [], ['tokyo']); } };
  s.addEventListener('input', () => set(+s.value)); set(1867);
  box._enter = () => { let y = 1867; s.value = y; last = -1; set(y); const t = setInterval(() => { y += 1; if (y > 1925) { clearInterval(t); return; } s.value = y; set(y); }, 90); box._timer = t; };
  box._leave = () => { if (box._timer) clearInterval(box._timer); };
  box.querySelectorAll('.opts button').forEach(bt => bt.addEventListener('click', () => { const n = +bt.dataset.b; box.querySelectorAll('.opts button').forEach(x => x.classList.toggle('right', +x.dataset.b === 2)); bt.classList.toggle('wrong', n !== 2); box.querySelector('.verdict').innerHTML = '<b>The Spaulding gift.</b> Over 6,000 prints, 1921, to be studied and never shown: the afterlife’s own licence rule.'; }));
};

document.querySelectorAll('.tool').forEach(t => { const f = Tools[t.dataset.tool]; if (f) f(t); });

/* ------------------------------------------------------------- SCROLL DRIVER */
const Driver = (function () {
  let active = null, ticking = false;
  const chips = $('#chapters');
  D.CHAPTERS.forEach(ch => { const a = el('a', 'chip', ch.n ? ch.n : '0'); a.href = '#' + ch.id; a.title = ch.title; a.dataset.ch = ch.id; a.addEventListener('click', e => { e.preventDefault(); $('#' + ch.id).scrollIntoView({behavior: 'smooth', block: 'start'}); }); chips.appendChild(a); });
  function pick() {
    const vh = window.innerHeight, line = vh * (window.innerWidth < 900 ? 0.62 : 0.45);
    let best = null, bestD = Infinity;
    Story.beats.forEach(b => { const r = b.el.getBoundingClientRect(); if (r.top <= line && r.bottom > line * 0.3) { const d = line - r.top; if (d < bestD) { bestD = d; best = b; } } });
    if (!best) { const first = Story.beats[0]; if (first.el.getBoundingClientRect().top > line) best = first; }
    if (best && best !== active) activate(best);
  }
  function activate(b) {
    if (active) { active.el.classList.remove('active'); const t = active.el.querySelector('.tool'); if (t && t._leave) t._leave(); }
    active = b; b.el.classList.add('active');
    if (b.scene) { if (b.scene.map) Map.go(b.scene.map); if (b.scene.time) Timeline.go(b.scene.time); }
    const t = b.el.querySelector('.tool'); if (t && t._enter) setTimeout(() => t._enter(), 900);
    chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.ch === b.chapter.id));
    $('#chlabel').textContent = (b.chapter.n ? 'Chapter ' + b.chapter.n + ' · ' : '') + b.chapter.title;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { pick(); ticking = false; }); } }, {passive: true});
  setTimeout(pick, 300);
  Timeline.onPick = (ev) => { const b = Story.beats.find(x => x.scene && x.scene.time && x.scene.time.show && x.scene.time.show.indexOf(ev.id) >= 0); if (b) b.el.scrollIntoView({behavior: 'smooth', block: 'start'}); };
  return {pick};
})();

/* ------------------------------------------------------------- EXPLORE */
(function () {
  const btn = $('#explore'); let on = false;
  btn.addEventListener('click', () => { on = !on; btn.classList.toggle('on', on); btn.textContent = on ? 'Back to the story' : 'Explore the Atlas'; document.body.classList.toggle('explore', on); Map.setExplore(on); if (on) { Map.go({view: 'world', points: ['edo', 'kyoto', 'nagasaki', 'berlin', 'paris', 'boston', 'chicago'], arcs: []}); Timeline.go({year: 2024, show: D.EVENTS.filter(e => e.img).map(e => e.id)}); } else { Driver.pick(); } });
})();
})();

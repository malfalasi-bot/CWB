// The map: three scales in one ink style.
//  world  — d3-geo Equal Earth, rotated per scene (the antimeridian is cut at projection time)
//  region — Japan and the Kantō on a fixed Mercator base with a zoom transform (10 m coastline)
//  city   — the 1859 Library of Congress sheet, with pins placed through a fitted georeference
// On top: place cards (the Cast card's chrome), greedy label placement by priority, relocation arcs with dates,
// map guesses (tap a place or choose a route: ghost = yours, ink = what happened) and Rebuild tiles (map mode).
import { geoEqualEarth, geoMercator, geoPath, geoGraticule10, geoInterpolate, geoDistance } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom as d3zoom } from 'd3-zoom';
import { feature } from 'topojson-client';
import { el, esc, motion, Scope, imgUrl } from './util.js';
import { placeCard, springBack, thumb, EASE_CSS } from './cards.js';

const NS = 'http://www.w3.org/2000/svg';
const lerp = (a, b, t) => a + (b - a) * t;
const lerpAngle = (a, b, t) => { const d = ((b - a + 540) % 360) - 180; return a + d * t; };
const inOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const anim = (node, kf, opt) => (motion.reduced || !node?.animate ? null : node.animate(kf, opt));
const km = (a, b) => Math.round(geoDistance([a.lon, a.lat], [b.lon, b.lat]) * 6371);
const fmtKm = (n) => n.toLocaleString('en-GB');
// greedy label side for a target at xy: right, left, above, below — the first that collides with nothing placed
function labelSide(xy, w, boxes, f, h = 24) {
  const cands = [['', xy[0] + 18, xy[1] - h / 2], ['pos-l', xy[0] - 18 - w, xy[1] - h / 2], ['pos-t', xy[0] - w / 2, xy[1] - 26 - h], ['pos-b', xy[0] - w / 2, xy[1] + 26]];
  const pick = cands.find(([, x, y]) => x > f.x0 - 40 && x + w < f.W - 6 && y > f.y0 - 20 && !boxes.some((b) => x < b[2] && x + w > b[0] && y < b[3] && y + h > b[1])) || cands[0];
  boxes.push([pick[1], pick[2], pick[1] + w, pick[2] + h]);
  return pick[0];
}

// relocations: an arc from the old site to the new one, with the date on the arc
const MOVES = {
  'yoshiwara-move': { pairs: [['yoshiwara-old', 'yoshiwara']], date: '1657', from: 'to 1657', to: 'from 1657' },
  'tsutaya-move': { pairs: [['yoshiwara-gate', 'toriaburacho']], date: '1783', from: '1774–83', to: 'from 1783' },
  'theatres-move': { pairs: [['sakaicho', 'saruwakacho'], ['fukiyacho', 'saruwakacho'], ['kobikicho', 'saruwakacho']], date: '1842', from: 'to 1842', to: 'from 1842' },
};

export class MapStage {
  constructor(root, C, onPick) {
    this.root = root; this.C = C; this.P = C.places; this.onPick = onPick; this.scale = null; this.scope = new Scope();
    this.cam = { rot: 150, k: 1, tx: 0, ty: 0 };
    root.innerHTML = '';
    root.classList.add('map-root');
    this.svgW = select(root).append('svg').attr('class', 'world').attr('role', 'presentation');
    const w = this.svgW;
    this.gSphere = w.append('path').attr('class', 'sphere');
    this.gGrat = w.append('path').attr('class', 'grat');
    this.gLand = w.append('path').attr('class', 'land');
    this.gRoutes = w.append('g'); this.gLinks = w.append('g'); this.gGuessW = w.append('g').attr('class', 'mg-layer'); this.gPts = w.append('g'); this.gLabs = w.append('g');
    this.svgR = select(root).append('svg').attr('class', 'region').style('opacity', 0);
    this.gZ = this.svgR.append('g');
    this.gRLand = this.gZ.append('g'); this.gRoad = this.gZ.append('g'); this.gRPts = this.gZ.append('g'); this.gRPrints = this.gZ.append('g');
    this.city = el('div', { class: 'city' }); root.append(this.city);
    this.cityWorld = el('div', { class: 'city-world' });
    this.cityImg = el('img', { class: 'sheet59', alt: '', loading: 'lazy', decoding: 'async' });
    this.cityTrail = document.createElementNS(NS, 'svg'); this.cityTrail.setAttribute('class', 'trail');
    this.cityWorld.append(this.cityImg); this.city.append(this.cityWorld);
    this.cityOverlay = el('div', { class: 'city-ov', style: 'position:absolute;inset:0;pointer-events:none' });
    this.city.append(this.cityTrail, this.cityOverlay);
    this.cityCam = { k: 0.2, tx: 0, ty: 0 };
    this.legend = el('div', { class: 'map-legend', hidden: true }); this.cap = el('div', { class: 'map-cap' });
    this.ctl = el('div', { class: 'map-ctl' },
      el('button', { 'aria-label': 'Zoom in', onclick: () => this.zoomBy(1.6) }, '+'),
      el('button', { 'aria-label': 'Zoom out', onclick: () => this.zoomBy(1 / 1.6) }, '−'));
    this.ov = el('div', { class: 'map-ov' });
    this.hc = el('div', { class: 'map-hc', hidden: true });
    this.live = el('p', { class: 'vh', 'aria-live': 'polite' });
    root.append(this.legend, this.cap, this.ctl, this.ov, this.hc, this.live);
    this.G = null; this.R = null;
    this.ready = this.load();
    let rt = 0;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (this.stage && this.root.clientWidth) this.show(this.stage, this.year, true); }, 120); });
  }

  async load() {
    const [w110, w50, jp] = await Promise.all(['data/land-110m.json', 'data/land-50m.json', 'data/japan-10m.json'].map((u) => fetch(u).then((r) => r.json())));
    this.land110 = feature(w110, w110.objects.land); this.land50 = feature(w50, w50.objects.land); this.japan = jp;
    this.proj = geoEqualEarth(); this.path = geoPath(this.proj);
    this.base = geoMercator().fitExtent([[0, 0], [2000, 2000]], { type: 'MultiPoint', coordinates: [[127, 29.5], [147, 46.5]] });
    this.rpath = geoPath(this.base);
    this.gRLand.selectAll('path').data(this.japan.features).join('path').attr('class', 'land').attr('d', this.rpath);
  }

  focusRect() {
    const W = this.root.clientWidth, H = this.root.clientHeight;
    const mob = innerWidth <= 820;
    const bar = mob ? 50 : 56, mini = mob ? 44 : 62;
    const left = mob || document.body.classList.contains('explore') ? 12 : Math.min(W * 0.34, 540) + Math.max(20, W * 0.04) + 36;
    const tray = this.R ? (mob ? 92 : 112) : 0;
    return { x0: left, y0: bar + 16, x1: W - (mob ? 12 : 28), y1: H - mini - 12 - tray, W, H, mob };
  }

  // ---------------- public
  async show(stage, year, instant = false) {
    await this.ready;
    this.scope.dispose(); this.scope = new Scope(); const S = this.scope;
    this.stage = stage; this.year = year;
    const scale = stage.scale === 'europe' ? 'world' : stage.scale === 'kanto' ? 'japan' : stage.scale;
    const cut = this.scale !== scale; this.scale = scale;
    const dur = instant || cut ? 0 : motion.dur(1400);
    this.svgW.style('opacity', scale === 'world' ? 1 : 0); this.svgR.style('opacity', scale === 'japan' ? 1 : 0);
    this.svgW.classed('on', scale === 'world'); this.svgR.classed('on', scale === 'japan');
    this.city.classList.toggle('on', scale === 'city');
    this.legend.hidden = true; this.legend.innerHTML = ''; this.cap.textContent = ''; this.cityOverlay.innerHTML = ''; this.cityTrail.innerHTML = ''; this.trails = null;
    this.hideCard();
    if (cut && !instant && !motion.reduced) anim(this.root, [{ opacity: 0.4 }, { opacity: 1 }], { duration: 200 });
    let p;
    if (scale === 'world') p = this.showWorld(stage, dur, S);
    if (scale === 'japan') p = this.showRegion(stage, dur, S);
    if (scale === 'city') p = this.showCity(stage, dur, S);
    this.drawGuess(); this.drawTiles();
    await p;
    if (!S.dead) { this.drawGuess(); this.drawTiles(); }
  }
  setLegend(rows) {
    if (!rows.length) { this.legend.hidden = true; return; }
    this.legend.innerHTML = rows.join(''); this.legend.hidden = false;
  }

  // ---------------- place cards (hover / focus), same chrome as the Cast card
  showCard(d, x, y) {
    clearTimeout(this.hcT);
    const isCity = d.city != null;
    const c = isCity ? this.P.city[d.city] : d;
    const nm = (c?.name || d.name || '').split(': ');
    const card = placeCard({ name: nm[0], kanji: c?.kanji || d.kanji, kicker: isCity ? 'On the 1859 map' : d.kind === 'region' ? 'Region' : 'Place',
      date: d.date || (nm[1] ? nm.slice(1).join(': ') : null), note: (c?.note || '') + (c?.approx ? (c?.note ? ' ' : '') + 'Position approximate.' : '') || null });
    this.hc.innerHTML = ''; this.hc.append(card); this.hc.hidden = false;
    const W = this.root.clientWidth, w = this.hc.offsetWidth || 260, h = this.hc.offsetHeight || 80;
    let left = x + 16, top = y - h / 2;
    if (left + w > W - 8) left = x - 16 - w;
    top = Math.max(60, Math.min(this.root.clientHeight - h - 8, top));
    Object.assign(this.hc.style, { left: `${Math.max(8, left)}px`, top: `${top}px` });
    this.hc.classList.remove('on'); requestAnimationFrame(() => this.hc.classList.add('on'));
  }
  hideCard(ms = 0) { clearTimeout(this.hcT); const go = () => { this.hc.hidden = true; this.hc.classList.remove('on'); }; if (ms) this.hcT = setTimeout(go, ms); else go(); }
  bindCard(node, getD, getXY) {
    const on = () => { const [x, y] = getXY(); this.showCard(getD(), x, y); };
    node.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') on(); });
    node.addEventListener('pointerleave', () => this.hideCard(120));
    node.addEventListener('focus', () => { if (node.matches(':focus-visible')) on(); });
    node.addEventListener('blur', () => this.hideCard(0));
  }

  // ---------------- world
  worldTarget(stage) {
    const f = this.focusRect();
    const [a, b, c, d] = stage.view || [-180, -60, 180, 75];
    const rot = stage.rotate != null ? stage.rotate : (a + (c < a ? c + 360 : c)) / 2;
    const cE = c < a ? c + 360 : c;
    const pts = [];
    for (let i = 0; i <= 12; i++) { const lon = a + (cE - a) * i / 12; pts.push([lon > 180 ? lon - 360 : lon, b], [lon > 180 ? lon - 360 : lon, d]); }
    const p = geoEqualEarth().rotate([-rot, 0]).fitExtent([[f.x0, f.y0], [f.x1, f.y1]], { type: 'MultiPoint', coordinates: pts });
    return { rot, k: p.scale(), tx: p.translate()[0], ty: p.translate()[1] };
  }
  applyWorld(cam) {
    this.proj.rotate([-cam.rot, 0]).scale(cam.k).translate([cam.tx, cam.ty]);
    const big = cam.k > 900;
    this.gSphere.attr('d', this.path({ type: 'Sphere' }));
    this.gGrat.attr('d', this.path(geoGraticule10()));
    this.gLand.attr('d', this.path(big ? this.land50 : this.land110));
    this.drawWorldOverlays();
    if (this.G || this.R) { this.drawGuess(); this.drawTiles(); }
  }
  async showWorld(stage, dur, S) {
    const t = this.worldTarget(stage), from = { ...this.cam };
    this.routeState = this.buildRoutes(stage);
    this.pts = (stage.points || []).map((id) => ({ id, ...this.P.world[id] }));
    this.setLegend(this.routeState.map((r) => r.label && `<div><i class="${r.cls || ''}"></i>${esc(r.label)}</div>`).filter(Boolean));
    await S.tween(dur, (k) => {
      this.cam = { rot: lerpAngle(from.rot, t.rot, k), k: lerp(from.k, t.k, k), tx: lerp(from.tx, t.tx, k), ty: lerp(from.ty, t.ty, k) };
      this.applyWorld(this.cam);
    }, inOut);
    if (S.dead) return;
    this.cam = t; this.applyWorld(t);
    for (const r of this.routeState) {
      if (S.dead) return;
      const ms = motion.dur(r.ms || 2600);
      await S.tween(ms, (k) => { r.t = k; this.drawWorldOverlays(); }, (x) => x);
      r.t = 1; this.drawWorldOverlays();
      if (r.pulse) this.startPulse(r, S);
    }
  }
  buildRoutes(stage) {
    const R = this.P.routes, out = [];
    const add = (id, opt = {}) => { const r = R[id]; if (!r) return; const d = this.dense(r.stops); out.push({ id, stops: r.stops, ...d, t: 0, label: r.label, ...opt }); };
    switch (stage.route) {
      case 'perry': add('perry', { ms: 5200, dates: true }); break;
      case 'blue': add('berlin', { ms: 700, cls: 'land', lineCls: 'land-leg', label: 'Berlin to Amsterdam, overland' }); add('voc', { ms: 3600 }); add('china', { ms: 1100, cls: 'alt', lineCls: 'alt' }); break;
      case 'mm': add('mm', { ms: 4200 }); break;
      case 'hayashi': add('hayashi', { ms: 3600, pulse: 218 }); break;
      case 'pm': add('pm', { ms: 3600, landFrom: 3 }); break;
      case 'tokuno': out.push({ id: 'tokuno', link: ['tokyo', 'washington'], t: 0, ms: 1600, label: 'Tokyo to Washington, 1889' }); break;
      case 'sheet': out.push({ id: 'sheet', link: ['echizen', 'edo', 'newyork'], t: 0, ms: 2600, label: 'One sheet: Echizen paper, Edo printing, New York museum' }); break;
    }
    return out;
  }
  dense(stops) {
    const c = [], idx = [];
    for (let i = 0; i < stops.length - 1; i++) {
      const a = [stops[i].lon, stops[i].lat], b = [stops[i + 1].lon, stops[i + 1].lat], ip = geoInterpolate(a, b);
      idx[i] = c.length; for (let j = 0; j < 24; j++) c.push(ip(j / 24));
    }
    idx[stops.length - 1] = c.length; c.push([stops.at(-1).lon, stops.at(-1).lat]);
    return { c, idx };
  }
  drawWorldOverlays() {
    const P = this.proj, path = this.path;
    const rs = this.routeState || [];
    const lines = [];
    for (const r of rs) {
      if (r.link) continue;
      const n = Math.max(2, Math.round(r.c.length * r.t));
      if (r.landFrom != null) {
        const cut = r.idx[r.landFrom];
        lines.push({ d: path({ type: 'LineString', coordinates: r.c.slice(0, Math.min(n, cut + 1)) }), cls: r.lineCls || '' });
        if (n > cut) lines.push({ d: path({ type: 'LineString', coordinates: r.c.slice(cut, n) }), cls: 'land-leg' });
      } else lines.push({ d: path({ type: 'LineString', coordinates: r.c.slice(0, n) }), cls: r.lineCls || '' });
    }
    this.gRoutes.selectAll('path').data(lines).join('path').attr('class', (d) => 'route ' + d.cls).attr('d', (d) => d.d);
    const links = [];
    for (const r of rs) {
      if (!r.link) continue;
      const pts = r.link.map((id) => P([this.P.world[id].lon, this.P.world[id].lat])).filter(Boolean);
      for (let i = 0; i < pts.length - 1; i++) {
        const [a, b] = [pts[i], pts[i + 1]], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.28;
        const seg = Math.max(0, Math.min(1, r.t * (pts.length - 1) - i));
        if (seg <= 0) continue;
        const q = (t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * mx + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * my + t * t * b[1]];
        let d = 'M' + a; for (let s = 1; s <= 30 * seg; s++) d += 'L' + q(s / 30);
        links.push({ d, mid: q(0.5), q: r.id === 'sheet' && i === pts.length - 2 });
      }
    }
    const L = this.gLinks.selectAll('g').data(links).join((e) => { const g = e.append('g'); g.append('path').attr('class', 'link'); g.append('text').attr('class', 'ptlab'); return g; });
    L.select('path').attr('d', (d) => d.d);
    L.select('text').attr('x', (d) => d.mid[0]).attr('y', (d) => d.mid[1] - 6).attr('text-anchor', 'middle').text((d) => (d.q ? 'not recorded' : ''));
    const pts = [...(this.pts || [])].map((p) => ({ ...p, pri: 2 }));
    for (const r of rs) {
      if (r.link) { r.link.forEach((id, i) => { if (r.t * (r.link.length - 1) >= i - 0.01) pts.push({ id, ...this.P.world[id], pri: 2 }); }); continue; }
      r.stops.forEach((s, i) => { if (s.stop && r.c.length * r.t >= r.idx[i] - 1 && s.name) pts.push({ id: r.id + i, name: s.name, lat: s.lat, lon: s.lon, date: r.dates ? s.date : null, stop: true, pri: i === 0 || i === r.stops.length - 1 ? 3 : 1 }); });
    }
    const seen = new Set(); const uniq = pts.filter((p) => { const k = p.name; if (seen.has(k)) return false; seen.add(k); return true; });
    const proj = uniq.map((p) => ({ ...p, xy: P([p.lon, p.lat]) })).filter((p) => p.xy && isFinite(p.xy[0]));
    const self = this;
    this.gPts.selectAll('circle').data(proj, (d) => d.name).join((e) => e.append('circle').each(function (d) {
      self.bindCard(this, () => select(this).datum(), () => select(this).datum().xy);
    })).attr('class', (d) => 'pt' + (d.stop ? ' stop' : ''))
      .attr('r', (d) => (d.kind === 'region' ? 3 : 5)).attr('cx', (d) => d.xy[0]).attr('cy', (d) => d.xy[1])
      .attr('tabindex', 0).attr('role', 'button').attr('aria-label', (d) => d.name + (d.date ? ', ' + d.date : ''))
      .on('click', (e, d) => this.onPick?.({ type: 'place', name: d.name, kanji: d.kanji, date: d.date }))
      .on('keydown', (e, d) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.onPick?.({ type: 'place', name: d.name, kanji: d.kanji, date: d.date }); } });
    this.placeLabels(this.gLabs, proj);
  }
  // greedy label placement: higher priority first, four candidate positions, skip what does not fit
  placeLabels(g, pts) {
    const boxes = [], f = this.focusRect(), out = [];
    const sorted = [...pts].sort((a, b) => (b.pri || 0) - (a.pri || 0));
    for (const p of sorted) boxes.push({ x0: p.xy[0] - 6, y0: p.xy[1] - 6, x1: p.xy[0] + 6, y1: p.xy[1] + 6 });
    for (const p of sorted) {
      const txt = p.name + (p.kanji ? '  ' + p.kanji : '') + (p.date ? '  ' + p.date : ''), w = txt.length * 6.6 + 8, h = 15;
      const cand = [[9, 4, 'start'], [-9, 4, 'end'], [0, -10, 'middle'], [0, 20, 'middle']];
      let placed = null;
      for (const [dx, dy, anc] of cand) {
        const x0 = anc === 'start' ? p.xy[0] + dx : anc === 'end' ? p.xy[0] + dx - w : p.xy[0] - w / 2, y0 = p.xy[1] + dy - 11;
        const b = { x0, y0, x1: x0 + w, y1: y0 + h };
        if (b.x0 < f.x0 - 30 || b.x1 > f.W - 4 || b.y0 < f.y0 - 10 || b.y1 > f.y1 + 10) continue;
        if (boxes.some((o) => !(b.x1 < o.x0 || b.x0 > o.x1 || b.y1 < o.y0 || b.y0 > o.y1) && !(o.x0 === p.xy[0] - 6 && o.y0 === p.xy[1] - 6))) continue;
        placed = { dx, dy, anc }; boxes.push(b); break;
      }
      if (placed) out.push({ ...p, ...placed });
    }
    const T = g.selectAll('text').data(out, (d) => d.name).join('text').attr('class', 'ptlab')
      .attr('x', (d) => d.xy[0] + d.dx).attr('y', (d) => d.xy[1] + d.dy).attr('text-anchor', (d) => d.anc);
    T.each(function (d) {
      const t = select(this); t.selectAll('tspan').remove();
      t.append('tspan').text(d.name);
      if (d.kanji) t.append('tspan').attr('class', 'k').attr('dx', 5).text(d.kanji);
      if (d.date) t.append('tspan').attr('class', 'date').attr('dx', 6).text(d.date);
    });
  }
  startPulse(r, S) {
    const P = this.proj; const N = r.pulse; let sent = 0;
    const g = this.gRoutes.append('g');
    const lab = this.gLabs.append('text').attr('class', 'ptlab date');
    const pos = () => { const e = P(r.c.at(-1)); lab.attr('x', e[0] + 10).attr('y', e[1] + 22); };
    S.interval(() => {
      if (sent >= N) return;
      sent = Math.min(N, sent + 6); pos(); lab.text(`${sent} shipments`);
      const dot = g.append('circle').attr('r', 3.5).attr('fill', 'var(--indigo)');
      const t0 = performance.now(), ms = 1800;
      const step = (now) => { const k = Math.min(1, (now - t0) / ms); const i = Math.floor(k * (r.c.length - 1)); const xy = P(r.c[i]); if (xy) dot.attr('cx', xy[0]).attr('cy', xy[1]); if (k < 1) S.raf(step); else dot.remove(); };
      S.raf(step);
    }, motion.reduced ? 1 : 140);
    if (motion.reduced) { sent = N; pos(); lab.text(`${N} shipments`); }
    S.onDispose(() => { g.remove(); lab.remove(); });
  }

  // ---------------- region (Japan, Kantō)
  regionTransform(view) {
    const f = this.focusRect(); const [a, b, c, d] = view;
    const p0 = this.base([a, d]), p1 = this.base([c, b]);
    const k = Math.min((f.x1 - f.x0) / (p1[0] - p0[0]), (f.y1 - f.y0) / (p1[1] - p0[1]));
    const tx = (f.x0 + f.x1) / 2 - k * (p0[0] + p1[0]) / 2, ty = (f.y0 + f.y1) / 2 - k * (p0[1] + p1[1]) / 2;
    return { k, tx, ty };
  }
  async showRegion(stage, dur, S) {
    const t = this.regionTransform(stage.view || [129.5, 31.5, 142.5, 38.5]);
    const from = this.rcam || t; this.rcam = from;
    const labels = stage.labels || {};
    const pts = (stage.points || []).map((id) => ({ id, ...this.P.world[id], name: labels[id] || this.P.world[id]?.name }));
    const road = stage.route === 'tokaido' || stage.route === 'tokaido-faint';
    this.gRoad.selectAll('*').remove(); this.gRPrints.selectAll('*').remove(); this.gRPts.selectAll('*').remove();
    const stations = this.P.tokaido.map((s) => ({ ...s, xy: this.base([s.lon, s.lat]) }));
    let roadPath = null;
    if (road) {
      roadPath = this.gRoad.append('path').attr('class', stage.route === 'tokaido' ? 'tokaido' : 'route faint')
        .attr('d', 'M' + stations.map((s) => s.xy.join(',')).join('L'));
      this.setLegend([`<div><i class="${stage.route === 'tokaido' ? '' : 'faint'}"></i>The Tōkaidō, 55 points from Nihonbashi to Kyoto</div>`]);
    }
    const self = this;
    const drawPts = (k) => {
      const sel = this.gRPts.selectAll('g.p').data(pts, (d) => d.id).join((e) => {
        const g = e.append('g').attr('class', 'p').attr('tabindex', 0).attr('role', 'button').attr('aria-label', (d) => d.name)
          .on('click', (ev, d) => this.onPick?.({ type: 'place', name: d.name, kanji: d.kanji }))
          .on('keydown', (ev, d) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); this.onPick?.({ type: 'place', name: d.name, kanji: d.kanji }); } });
        g.each(function (d) {
          const s = select(this);
          if (d.kind === 'mountain') s.append('path').attr('class', 'fuji').attr('d', 'M-11,7 L-3,-7 L3,-7 L11,7 Z M-3,-7 L-1,-3 L1,-5 L3,-7');
          else if (d.kind === 'note') s.append('path').attr('class', 'waveglyph').attr('d', 'M-12,4 C-8,-6 2,-8 6,-2 C3,-4 -1,-2 0,2 C4,6 10,2 12,-2');
          else s.append('circle').attr('class', 'pt').attr('r', 5.5);
          s.append('text').attr('class', 'ptlab').attr('x', 10).attr('y', 4).text(d.name).append('tspan').attr('class', 'k').attr('dx', 5).text(d.kanji || '');
          self.bindCard(this, () => d, () => { const p = self.base([d.lon, d.lat]), c = self.rcam; return [c.tx + c.k * p[0], c.ty + c.k * p[1]]; });
        });
        return g;
      });
      sel.attr('transform', (d) => { const p = this.base([d.lon, d.lat]); return `translate(${p[0]},${p[1]}) scale(${1 / k})`; });
      this.gRoad.selectAll('circle.station').attr('r', 3.2 / k);
    };
    if (road && stage.route === 'tokaido') this.gRoad.selectAll('circle.station').data(stations).join('circle').attr('class', 'station').attr('cx', (d) => d.xy[0]).attr('cy', (d) => d.xy[1]).attr('r', 3);
    await S.tween(dur, (q) => {
      const c = { k: lerp(from.k, t.k, q), tx: lerp(from.tx, t.tx, q), ty: lerp(from.ty, t.ty, q) };
      this.rcam = c; this.gZ.attr('transform', `translate(${c.tx},${c.ty}) scale(${c.k})`); drawPts(c.k);
      if (this.G || this.R) { this.drawGuess(); this.drawTiles(); }
    });
    if (S.dead) return;
    this.rcam = t; this.gZ.attr('transform', `translate(${t.tx},${t.ty}) scale(${t.k})`); drawPts(t.k);
    this.declutterRegion();
    if (roadPath && stage.route === 'tokaido') {
      const L = roadPath.node().getTotalLength();
      roadPath.attr('stroke-dasharray', `${L} ${L}`).attr('stroke-dashoffset', L);
      const prints = stage.prints ? Object.entries(this.P.tokaidoPrints).map(([n, id]) => ({ n: +n, id, s: stations[+n] })) : [];
      let shown = 0;
      await S.tween(motion.dur(4200), (q) => {
        roadPath.attr('stroke-dashoffset', L * (1 - q));
        const reached = Math.floor(q * 54.999);
        while (shown < prints.length && prints[shown].n <= reached) { this.addPrint(prints[shown], shown, t.k); shown++; }
      }, (x) => x);
      roadPath.attr('stroke-dashoffset', 0);
      while (shown < prints.length) { this.addPrint(prints[shown], shown, t.k); shown++; }
    }
  }
  // hide a region label when it would collide with an earlier one (the point stays; its card still opens on hover)
  declutterRegion() {
    const boxes = [];
    this.gRPts.selectAll('g.p').each(function () {
      const t = this.querySelector('text'); if (!t) return;
      t.style.opacity = '';
      const b = t.getBoundingClientRect(); const box = { x0: b.left, y0: b.top, x1: b.right, y1: b.bottom };
      if (boxes.some((o) => !(box.x1 < o.x0 || box.x0 > o.x1 || box.y1 < o.y0 || box.y0 > o.y1))) t.style.opacity = 0; else boxes.push(box);
    });
  }
  addPrint(p, i, k) {
    const meta = this.C.images[p.id] || {}; const ar = meta.w && meta.h ? meta.h / meta.w : 0.66;
    const OFF = { 0: [70, -120], 1: [100, 24], 3: [62, 98], 10: [-10, 104], 11: [20, -128], 15: [-78, 98], 16: [-84, -124], 45: [0, 100], 54: [-24, -120] };
    const [dx, dy] = OFF[p.n] || [0, i % 2 ? 90 : -110];
    const W = 92 / k, H = W * ar, up = dy < 0;
    const x = p.s.xy[0] + dx / k - W / 2, y = p.s.xy[1] + dy / k - (up ? H : 0);
    const g = this.gRPrints.append('g').attr('class', 'printpin').attr('tabindex', 0).attr('role', 'button').attr('aria-label', `${p.s.name}: open the print`)
      .on('click', () => this.onPick?.({ type: 'image', id: p.id, title: `${p.s.name} · ${meta.title || ''}` }))
      .on('keydown', (e) => { if (e.key === 'Enter') this.onPick?.({ type: 'image', id: p.id, title: `${p.s.name} · ${meta.title || ''}` }); });
    g.append('line').attr('x1', p.s.xy[0]).attr('y1', p.s.xy[1]).attr('x2', x + W / 2).attr('y2', up ? y + H : y);
    g.append('rect').attr('x', x - 2 / k).attr('y', y - 2 / k).attr('width', W + 4 / k).attr('height', H + 4 / k);
    g.append('image').attr('href', imgUrl(p.id)).attr('x', x).attr('y', y).attr('width', W).attr('height', H).attr('preserveAspectRatio', 'xMidYMid slice');
    g.append('text').attr('class', 'ptlab small').attr('x', x + W / 2).attr('y', up ? y - 5 / k : y + H + 13 / k).attr('text-anchor', 'middle').attr('font-size', 11 / k).style('stroke-width', 4 / k + 'px').text(p.s.name);
    anim(g.node(), [{ opacity: 0, transform: `translate(0, ${8 / k}px)` }, { opacity: 1, transform: 'none' }], { duration: 400, easing: EASE_CSS.enter });
  }

  // ---------------- city (the 1859 sheet)
  cityPx(id) { const c = this.P.city[id]; return c ? [c.xy[0] / 100 * 3964, c.xy[1] / 100 * 3545] : null; }
  cityTarget(stage) {
    const f = this.focusRect();
    const pts = stage.focus === 'all' || !stage.focus ? null : stage.focus.map((id) => this.cityPx(id)).filter(Boolean);
    let x0 = 0, y0 = 0, x1 = 3964, y1 = 3545;
    if (pts && pts.length) {
      x0 = Math.min(...pts.map((p) => p[0])); x1 = Math.max(...pts.map((p) => p[0])); y0 = Math.min(...pts.map((p) => p[1])); y1 = Math.max(...pts.map((p) => p[1]));
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, w = Math.max(700, (x1 - x0) * 1.5), h = Math.max(560, (y1 - y0) * 1.5);
      x0 = cx - w / 2; x1 = cx + w / 2; y0 = cy - h / 2; y1 = cy + h / 2;
    } else { x0 = 1600; x1 = 3964; y0 = 0; y1 = 3545; }
    const k = Math.min((f.x1 - f.x0) / (x1 - x0), (f.y1 - f.y0) / (y1 - y0), 1.1);
    return { k, tx: (f.x0 + f.x1) / 2 - k * (x0 + x1) / 2, ty: (f.y0 + f.y1) / 2 - k * (y0 + y1) / 2 };
  }
  applyCity(c) {
    this.cityCam = c;
    this.cityWorld.style.transform = `translate(${c.tx}px,${c.ty}px) scale(${c.k})`;
    for (const p of this.cityPins || []) { p.el.style.left = (c.tx + c.k * p.x) + 'px'; p.el.style.top = (c.ty + c.k * p.y) + 'px'; }
    if (this.trails) this.drawTrails();
    if (this.G || this.R) { this.drawGuess(); this.drawTiles(); }
  }
  scr(px) { const c = this.cityCam; return [c.tx + c.k * px[0], c.ty + c.k * px[1]]; }
  async showCity(stage, dur, S) {
    if (!this.cityImg.src) this.cityImg.src = imgUrl('map-edo-1859');
    const meta = this.C.images['map-edo-1859'];
    this.cap.innerHTML = `${esc(meta?.title || 'Edo, 1859')} · ${esc(meta?.holder || 'Library of Congress')} · ${esc(meta?.licence || 'Public domain')}. North is to the right.`;
    const t = this.cityTarget(stage), from = this.cityCam.k === 0.2 && !this.cityShown ? t : { ...this.cityCam };
    this.cityShown = true; this.cityPins = []; this.trails = null;
    const ids = stage.focus === 'all' ? [] : (stage.focus || []);
    const f = this.focusRect();
    ids.forEach((id, i) => this.addCityPin(id, { flip: (t.tx + t.k * this.cityPx(id)[0]) > f.x1 - 260, pri: 10 - i }));
    if (stage.layer === 'views') this.addViews(S);
    await S.tween(dur, (q) => this.applyCity({ k: lerp(from.k, t.k, q), tx: lerp(from.tx, t.tx, q), ty: lerp(from.ty, t.ty, q) }), inOut);
    if (S.dead) return;
    this.applyCity(t);
    this.cityPins.forEach((p, i) => S.timeout(() => p.el.classList.add('on'), motion.dur(60 * Math.min(i, 5))));
    this.declutterCity();
    if (stage.anim) this.cityAnim(stage.anim, S);
  }
  addCityPin(id, { cls = '', flip = false, label, pri = 0 } = {}) {
    const c = this.P.city[id]; if (!c) return null;
    const [x, y] = this.cityPx(id);
    const b = el('button', { type: 'button', 'aria-label': c.name, onclick: () => this.onPick?.({ type: 'place', name: c.name, kanji: c.kanji, city: id }) },
      el('span', { class: 'dot' }), el('span', { class: 'lbl', html: `${c.kanji ? `<span class="k">${esc(c.kanji)}</span>` : ''}${esc(label || c.name)}` }));
    const pin = el('div', { class: `cpin ${cls}${flip ? ' flip' : ''}`, style: 'pointer-events:auto' }, b);
    this.bindCard(b, () => ({ city: id }), () => this.scr([x, y]));
    this.cityOverlay.append(pin);
    const o = { id, x, y, el: pin, pri }; this.cityPins.push(o); return o;
  }
  // greedy label collision on the 1859 sheet: pins keep their dot; lower-priority labels hide until hover/focus
  declutterCity() {
    const pins = (this.cityPins || []).filter((p) => p.el.classList.contains('cpin')).sort((a, b) => (b.pri || 0) - (a.pri || 0));
    const boxes = [];
    pins.forEach((p) => { p.el.classList.remove('nolabel'); });
    pins.forEach((p) => {
      const l = p.el.querySelector('.lbl'); if (!l) return;
      const r = l.getBoundingClientRect(); const box = { x0: r.left - 4, y0: r.top - 2, x1: r.right + 4, y1: r.bottom + 2 };
      if (boxes.some((o) => !(box.x1 < o.x0 || box.x0 > o.x1 || box.y1 < o.y0 || box.y0 > o.y1))) p.el.classList.add('nolabel'); else boxes.push(box);
    });
  }
  addViews(S) {
    const tip = el('div', { class: 'vtip', hidden: true }); this.cityOverlay.append(tip);
    const views = this.P.views;
    views.forEach((v, i) => {
      const off = v.xy[0] < 1.5 || v.xy[0] > 98.5 || v.xy[1] < 1.5 || v.xy[1] > 98.5;
      const cl = (q) => Math.max(1.2, Math.min(98.8, q));
      const x = cl(v.xy[0]) / 100 * 3964, y = cl(v.xy[1]) / 100 * 3545;
      const showTip = () => { tip.hidden = false; tip.innerHTML = `<img src="${imgUrl('hv-' + String(v.n).padStart(3, '0'), 'hv')}" alt=""><b>${v.n}.</b> ${esc(v.t)}<br><span lang="ja">${esc(v.ja)}</span>`; const r = b.getBoundingClientRect(), R = this.root.getBoundingClientRect(); tip.style.left = Math.min(r.left - R.left + 14, R.width - 220) + 'px'; tip.style.top = Math.max(60, r.top - R.top - 230) + 'px'; };
      const b = el('button', { type: 'button', class: `vdot ${v.season}${off ? ' off' : ''}`, 'aria-label': `View ${v.n}: ${v.t}${off ? ' (beyond the edge of this map)' : ''}`, style: `pointer-events:auto;--c:var(--${v.season})`,
        onmouseenter: showTip, onfocus: showTip, onmouseleave: () => { tip.hidden = true; }, onblur: () => { tip.hidden = true; },
        onclick: () => this.onPick?.({ type: 'view', view: v }) });
      this.cityOverlay.append(b); const o = { x, y, el: b }; this.cityPins.push(o);
      S.timeout(() => b.classList.add('on'), motion.dur(400 + Math.min(300, i * 3)));
    });
    const lg = ['spring', 'summer', 'autumn', 'winter'].map((s) => `<div><i class="dot" style="background:var(--${s})"></i>${s[0].toUpperCase() + s.slice(1)}</div>`).join('');
    const nOff = views.filter((v) => v.xy[0] < 1.5 || v.xy[0] > 98.5 || v.xy[1] < 1.5 || v.xy[1] > 98.5).length;
    this.setLegend([`<div style="margin-bottom:4px"><b>${views.length} views</b>, by season</div>${lg}<div><i class="dot" style="background:var(--paper-2);border:2px solid var(--ink-2)"></i>${nOff} beyond the map’s edge</div>`]);
  }
  drawTrails() {
    const svg = this.cityTrail; svg.innerHTML = '';
    const defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = '<marker id="mv-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" class="mv-arrow"/></marker>';
    svg.append(defs);
    for (const tr of this.trails) {
      const a = this.scr(tr.a), b = this.scr(tr.b);
      const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.22, my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.22;
      tr.q = (t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * mx + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * my + t * t * b[1]];
      const p = document.createElementNS(NS, 'path');
      let d = 'M' + a; for (let s = 1; s <= 40; s++) d += 'L' + tr.q((s / 40) * (tr.t ?? 1));
      p.setAttribute('d', d); p.setAttribute('class', 'mv'); if ((tr.t ?? 1) > 0.98) p.setAttribute('marker-end', 'url(#mv-arr)');
      svg.append(p);
      if (tr.date && (tr.t ?? 1) > 0.5) {
        const m = tr.q(0.5), g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'mv-date');
        const w = tr.date.length * 7.6 + 14;
        g.innerHTML = `<rect x="${m[0] - w / 2}" y="${m[1] - 11}" width="${w}" height="22" rx="11"/><text x="${m[0]}" y="${m[1] + 4}" text-anchor="middle">${esc(tr.date)}</text>`;
        svg.append(g);
      }
    }
  }
  async cityAnim(kind, S) {
    if (kind === 'fire') {
      const seq = [['hongo', 'Day 1, about 2 p.m.'], ['koishikawa', 'Day 2, about 10 a.m.'], ['kojimachi', 'Day 2, about 4 p.m.']];
      this.setLegend(['<div><i class="dot" style="background:var(--seal)"></i>Where each fire began</div>']);
      for (const [id, when] of seq) {
        if (S.dead) return;
        const pin = this.cityPins.find((p) => p.id === id); if (pin) { pin.el.classList.add('fire'); pin.el.querySelector('.lbl').insertAdjacentHTML('beforeend', `<br><small>${when}</small>`); }
        const ring = el('div', { class: 'ring' }); this.cityOverlay.append(ring);
        const [x, y] = this.scr(this.cityPx(id));
        await S.tween(motion.dur(1500), (k) => { const r = 20 + k * 150; ring.style.left = x + 'px'; ring.style.top = y + 'px'; ring.style.width = ring.style.height = r * 2 + 'px'; ring.style.opacity = String(1 - k * 0.55); ring.style.borderWidth = (2 + 6 * k) + 'px'; });
      }
      this.declutterCity();
      return;
    }
    const M = MOVES[kind]; if (!M) return;
    // make sure both ends have pins; the old sites become pencil once the arc has drawn
    const ends = new Set(M.pairs.flat());
    ends.forEach((id) => { if (!this.cityPins.find((p) => p.id === id)) { const o = this.addCityPin(id, { cls: 'on', pri: 1 }); this.applyCity(this.cityCam); return o; } });
    this.setLegend([`<div><i></i>Moved, ${esc(M.date)}</div>`, '<div><i class="dot old"></i>The old site</div>']);
    this.trails = M.pairs.map(([a, b], i) => ({ a: this.cityPx(a), b: this.cityPx(b), t: 0, date: i === 0 ? M.date : null }));
    await S.tween(motion.dur(300), () => {});
    await S.tween(motion.dur(1400), (k) => { this.trails.forEach((tr) => { tr.t = k; }); this.drawTrails(); }, inOut);
    if (S.dead) return;
    this.trails.forEach((tr) => { tr.t = 1; }); this.drawTrails();
    M.pairs.forEach(([a, b]) => {
      const pa = this.cityPins.find((p) => p.id === a), pb = this.cityPins.find((p) => p.id === b);
      if (pa) { pa.el.classList.add('old'); this.tag(pa, M.from); }
      if (pb && !pb.tagged) { pb.tagged = true; this.tag(pb, M.to); anim(pb.el.querySelector('.dot'), [{ transform: 'scale(1.4)' }, { transform: 'scale(1)' }], { duration: 400, easing: EASE_CSS.enter }); }
    });
    this.declutterCity();
  }
  tag(pin, txt) { const l = pin.el.querySelector('.lbl'); if (l && !l.querySelector('.when')) l.insertAdjacentHTML('beforeend', `<small class="when">${esc(txt)}</small>`); }

  // ---------------- screen position of a place on the current map
  screenOf(id) {
    const w = this.P.world[id], c = this.P.city[id];
    if (this.scale === 'world' && w && this.proj) { const p = this.proj([w.lon, w.lat]); return p && isFinite(p[0]) ? p : null; }
    if (this.scale === 'japan' && w && this.rcam) { const p = this.base([w.lon, w.lat]), k = this.rcam; return [k.tx + k.k * p[0], k.ty + k.k * p[1]]; }
    if (this.scale === 'city' && c) return this.scr(this.cityPx(id));
    return null;
  }
  placeOf(id) { return this.P.world[id] || this.P.city[id] || null; }

  // ---------------- guess: tap a place, or choose a route
  guess(spec, onAnswer, opts = {}) {
    this.endGuess();
    const truth = [].concat(spec.truth);
    const G = this.G = { spec, truth, primary: spec.primary || truth[0], route: spec.mode === 'route', choice: null, revealed: false, onAnswer };
    G.box = el('div', { class: 'mg-box' }); this.ov.append(G.box);
    this.root.classList.add('guessing');
    G.panel = el('div', { class: 'mg-panel', role: 'group', 'aria-label': spec.q || 'Choose on the map' },
      el('span', { class: 'cc-kick', text: G.route ? 'Choose a route' : 'Tap the map, or choose here' }),
      ...spec.options.map((o) => el('button', { type: 'button', class: 'mg-opt', 'data-id': o.id, onclick: () => this.choose(o.id) }, o.label)));
    // the targets are buttons in reading order; the extra chip list is for hosts that have no list of their own
    if (opts.list) this.ov.append(G.panel);
    this.ready.then(() => { if (this.G === G) this.drawGuess(true); });
    return { reveal: () => this.revealGuess(), destroy: () => this.endGuess(), commit: (id) => this.choose(id ?? G.focusId) };
  }
  choose(id) {
    const G = this.G; if (!G || G.choice || G.revealed || !id) return;
    G.choice = id;
    const ok = G.truth.includes(id);
    const o = G.spec.options.find((q) => q.id === id);
    const a = this.placeOf(id), b = this.placeOf(G.primary);
    const dist = !G.route && a && b && a.lat != null && b.lat != null ? km(a, b) : null;
    this.live.textContent = `Your choice: ${o?.label || id}.`;
    this.drawGuess();
    G.onAnswer?.(id, { type: 'map', value: id, ok, primary: G.primary, distanceKm: dist, close: ok || (dist != null && G.spec.closeKm != null && dist <= G.spec.closeKm) });
  }
  revealGuess() {
    const G = this.G; if (!G || G.revealed) return;
    G.revealed = true; G.justRevealed = true;
    const lab = G.spec.options.filter((o) => G.truth.includes(o.id)).map((o) => o.label).join(' and ');
    this.live.textContent = `What happened: ${lab}.`;
    this.drawGuess();
  }
  endGuess() {
    const G = this.G; if (!G) return;
    G.box?.remove(); G.panel?.remove(); this.gGuessW.selectAll('*').remove();
    this.root.classList.remove('guessing');
    this.G = null;
  }
  drawGuess(first) {
    const G = this.G; if (!G || !this.proj) return;
    const f = this.focusRect();
    G.panel.querySelectorAll('.mg-opt').forEach((b) => {
      const id = b.dataset.id, mine = G.choice === id, tru = G.revealed && G.truth.includes(id);
      b.classList.toggle('mine', mine); b.classList.toggle('truth', tru); b.classList.toggle('primary', tru && id === G.primary);
      b.disabled = !!G.choice || G.revealed; b.setAttribute('aria-pressed', String(mine));
      b.innerHTML = '';
      b.append(el('span', { class: 'mk', 'aria-hidden': 'true' }), el('span', { text: G.spec.options.find((o) => o.id === id).label }));
      if (mine) b.append(el('span', { class: 'tag', text: 'your pick' }));
      if (tru) b.append(el('span', { class: 'tag ink', text: 'what happened' }));
    });
    if (G.route) return this.drawRouteGuess(first);
    G.box.innerHTML = '';
    const boxes = G.spec.options.map((o) => { const xy = this.screenOf(o.id); return xy ? [xy[0] - 14, xy[1] - 14, xy[0] + 14, xy[1] + 14] : [0, 0, 0, 0]; });
    G.spec.options.forEach((o, i) => {
      const xy = this.screenOf(o.id); if (!xy) return;
      const mine = G.choice === o.id, tru = G.revealed && G.truth.includes(o.id), pri = tru && o.id === G.primary;
      const t = el('button', { type: 'button', class: `mg-t${mine ? ' mine' : ''}${tru ? ' truth' : ''}${pri ? ' primary' : ''}${G.choice && !mine && !tru ? ' dim' : ''}`,
        style: `left:${xy[0]}px;top:${xy[1]}px`, 'aria-label': `${o.label}${mine ? ', your pick' : ''}${tru ? ', what happened' : ''}`, disabled: G.choice || G.revealed ? '' : null,
        onclick: () => this.choose(o.id) }, el('span', { class: 'tg-ring', 'aria-hidden': 'true' }), el('span', { class: 'lab', text: o.label }));
      t.addEventListener('focus', () => { G.focusId = o.id; });
      G.box.append(t);
      // greedy label side: right, left, above, below — the first that collides with nothing placed so far
      const side = labelSide(xy, o.label.length * 7.2 + 16 + (mine ? 70 : 0) + (tru ? 104 : 0), boxes, f);
      if (side) t.classList.add(side);
      if (first) anim(t.querySelector('.tg-ring'), [{ transform: 'translate(-50%,-50%) scale(.4)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }], { duration: 300, delay: i * 50, easing: EASE_CSS.enter, fill: 'backwards' });
      if (pri && G.justRevealed) anim(t.querySelector('.tg-ring'), [{ transform: 'translate(-50%,-50%) scale(1.06)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }], { duration: 200, easing: EASE_CSS.standard });
    });
    // the distance between your pick and the primary answer, as a line on the map
    if (G.revealed && G.choice && !G.truth.includes(G.choice)) {
      const a = this.screenOf(G.choice), b = this.screenOf(G.primary), pa = this.placeOf(G.choice), pb = this.placeOf(G.primary);
      if (a && b) {
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
        const line = el('div', { class: 'mg-dist', style: `left:${a[0]}px;top:${a[1]}px;width:${len}px;transform:rotate(${ang}deg)` });
        const lab = el('div', { class: 'mg-distlab', style: `left:${(a[0] + b[0]) / 2}px;top:${(a[1] + b[1]) / 2}px`, text: pa?.lat != null && pb?.lat != null ? `${fmtKm(km(pa, pb))} km apart` : '' });
        G.box.prepend(line); G.box.append(lab);
      }
    }
    G.justRevealed = false;
  }
  drawRouteGuess(first) {
    const G = this.G, P = this.proj;
    const g = this.gGuessW; g.selectAll('*').remove();
    G.box.innerHTML = '';
    G.labXY = [];
    G.spec.options.forEach((o, i) => {
      const coords = [];
      for (let k = 0; k < o.path.length - 1; k++) { const ip = geoInterpolate(o.path[k], o.path[k + 1]); for (let j = 0; j < 20; j++) coords.push(ip(j / 20)); }
      coords.push(o.path.at(-1));
      const d = this.path({ type: 'LineString', coordinates: coords });
      const mine = G.choice === o.id, tru = G.revealed && G.truth.includes(o.id);
      const cls = tru ? 'truth' : mine ? 'mine' : G.choice || G.revealed ? 'dim' : 'cand';
      const p = g.append('path').attr('class', `mg-route ${cls}`).attr('d', d);
      if (!G.choice && !G.revealed) g.append('path').attr('class', 'mg-hit').attr('d', d).on('click', () => this.choose(o.id));
      if (tru && G.justRevealed && !motion.reduced) { const L = p.node().getTotalLength(); p.attr('stroke-dasharray', `${L} ${L}`).attr('stroke-dashoffset', L); p.node().animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 1600, easing: EASE_CSS.standard, fill: 'forwards' }); }
      // a label button at the route's widest point
      const f = this.focusRect(), taken = G.labXY || [];
      let mid = null;
      for (const fr of [0.5, 0.42, 0.58, 0.34, 0.66, 0.26, 0.74, 0.2, 0.8]) {
        const q = P(coords[Math.floor(coords.length * fr)]);
        if (q && q[0] > f.x0 + 60 && q[0] < f.x1 - 60 && q[1] > f.y0 + 20 && q[1] < f.y1 - 90 && !taken.some((t) => Math.hypot(t[0] - q[0], t[1] - q[1]) < 140)) { mid = q; break; }
      }
      if (mid) (G.labXY = taken).push(mid);
      if (mid) {
        const b = el('button', { type: 'button', class: `mg-rlab ${cls}`, style: `left:${mid[0]}px;top:${mid[1]}px`, disabled: G.choice || G.revealed ? '' : null, onclick: () => this.choose(o.id) },
          el('b', { text: o.label.split(':')[0] }), mine ? el('span', { class: 'tag', text: 'your pick' }) : null, tru ? el('span', { class: 'tag ink', text: 'what happened' }) : null);
        G.box.append(b);
        if (first) anim(b, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: i * 60, fill: 'backwards' });
      }
    });
    // ends of the journey
    const ends = [G.spec.options[0].path[0], G.spec.options[0].path.at(-1)];
    ends.forEach((c) => { const xy = P(c); if (xy) g.append('circle').attr('class', 'mg-end').attr('cx', xy[0]).attr('cy', xy[1]).attr('r', 5); });
    G.justRevealed = false;
  }

  // ---------------- rebuild (map mode): drag each event onto its place
  placeTiles(tiles, onDrop) {
    this.endTiles();
    const R = this.R = { tiles: tiles.map((t) => ({ ...t, placed: false, tries: 0 })), onDrop, carry: null };
    const ids = [...new Set(R.tiles.map((t) => t.place))].filter((id) => this.P.world[id]);
    R.places = ids;
    const lons = ids.map((id) => this.P.world[id].lon), lats = ids.map((id) => this.P.world[id].lat);
    const view = [Math.min(...lons) - 18, Math.min(...lats) - 14, Math.max(...lons) + 18, Math.max(...lats) + 12];
    R.tray = el('div', { class: 'mt-tray', role: 'list', 'aria-label': 'Events to put back on the map' });
    R.say = el('div', { class: 'mt-say', 'aria-live': 'polite' });
    R.box = el('div', { class: 'mt-box' });
    R.tiles.forEach((t) => { t.node = this.tileNode(t); R.tray.append(el('div', { role: 'listitem' }, t.node)); });
    this.ov.append(R.box, R.tray, R.say);
    this.show({ mode: 'map', scale: 'world', view, points: [] }, this.year || 1900, false);
    return { reveal: () => this.revealTiles(), destroy: () => this.endTiles(true) };
  }
  tileNode(t) {
    const b = el('button', { type: 'button', class: 'tl-tile', 'data-id': t.id, 'aria-describedby': 'mt-help' },
      thumb(this.C, t.img, 34, 34, { fy: 0.2, cls: 'cc-thumb' }) || el('span', { class: 'tl-tile-dot', 'aria-hidden': 'true' }),
      el('span', { class: 'lab', text: t.label }), t.from ? el('span', { class: 'from', text: t.from }) : null);
    if (!document.getElementById('mt-help')) this.ov.append(el('span', { id: 'mt-help', class: 'vh', text: 'Drag onto a place on the map, or press Enter and then choose a place.' }));
    b.addEventListener('pointerdown', (e) => this.dragTile(t, e));
    b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.carry(t); } });
    return b;
  }
  drawTiles() {
    const R = this.R; if (!R || !this.proj) return;
    const f = this.focusRect();
    Object.assign(R.tray.style, { left: `${f.x0}px`, right: `${f.W - f.x1}px`, top: `${f.y1 + 14}px` });
    Object.assign(R.say.style, { left: `${f.x0}px`, top: `${f.y0}px` });
    R.box.innerHTML = '';
    const boxes = R.places.map((id) => { const xy = this.screenOf(id); return xy ? [xy[0] - 13, xy[1] - 13, xy[0] + 13, xy[1] + 13] : [0, 0, 0, 0]; });
    const blocks = [];
    R.places.forEach((id) => {
      const xy = this.screenOf(id); if (!xy) return;
      const pl = this.P.world[id];
      const here = R.tiles.filter((t) => t.placed && t.place === id);
      const tg = el('button', { type: 'button', class: `mt-t${R.carry ? ' armed' : ''}`, 'data-place': id, style: `left:${xy[0]}px;top:${xy[1]}px`,
        'aria-label': R.carry ? `Put “${R.carry.t.label}” at ${pl.name}` : `${pl.name}${here.length ? ': ' + here.map((t) => t.label).join('; ') : ''}`,
        onclick: () => { if (R.carry) this.dropOn(R.carry.t, id); } },
      el('span', { class: 'tg-ring', 'aria-hidden': 'true' }), el('span', { class: 'lab', text: pl.name }));
      const side = labelSide(xy, pl.name.length * 7.6 + 8, boxes, f, 20);
      if (side) tg.classList.add(side);
      R.box.append(tg);
      if (here.length) blocks.push({ xy, here });
    });
    // placed events: one block per place, put where it collides with nothing, joined to its place by a leader line
    blocks.forEach(({ xy, here }) => {
      const w = Math.min(230, Math.max(...here.map((t) => t.label.length * 6.6 + 18))), h = here.reduce((a, t) => a + (t.label.length * 6.6 + 18 > 230 ? 36 : 22), 0) + (here.length - 1) * 4;
      const cands = [];
      for (const d of [34, 70, 110]) cands.push([xy[0] - w / 2, xy[1] + d - 10], [xy[0] - w / 2, xy[1] - d - h + 10], [xy[0] + d, xy[1] - h / 2], [xy[0] - d - w, xy[1] - h / 2], [xy[0] + d * 0.7, xy[1] + d * 0.7], [xy[0] - d * 0.7 - w, xy[1] + d * 0.7], [xy[0] + d * 0.7, xy[1] - d * 0.7 - h], [xy[0] - d * 0.7 - w, xy[1] - d * 0.7 - h]);
      const fits = ([x, y]) => x > f.x0 - 10 && x + w < f.W - 6 && y > f.y0 + 24 && y + h < f.y1 + 8 && !boxes.some((b) => x < b[2] + 4 && x + w > b[0] - 4 && y < b[3] + 4 && y + h > b[1] - 4);
      const [bx, by] = cands.find(fits) || cands[0];
      boxes.push([bx, by, bx + w, by + h]);
      const cx = Math.max(bx, Math.min(bx + w, xy[0])), cy = Math.max(by, Math.min(by + h, xy[1]));
      const len = Math.hypot(cx - xy[0], cy - xy[1]);
      const ang = Math.atan2(cy - xy[1], cx - xy[0]);
      if (len > 18) R.box.append(el('div', { class: 'mt-lead', style: `left:${xy[0] + Math.cos(ang) * 12}px;top:${xy[1] + Math.sin(ang) * 12}px;width:${len - 12}px;transform:rotate(${ang}rad)` }));
      const blk = el('div', { class: 'mt-blk', style: `left:${bx}px;top:${by}px;width:${w}px` }, ...here.map((t) => el('div', { class: 'mt-pin' }, el('span', { text: t.label }))));
      R.box.append(blk);
      if (here.some((t) => t.justPlaced)) { here.forEach((t) => { t.justPlaced = false; }); anim(blk, [{ opacity: 0, transform: 'translateY(-6px) scale(1.04)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: EASE_CSS.enter }); }
    });
  }
  hitPlace(px, py) {
    let best = null, bd = 40;
    for (const id of this.R.places) { const xy = this.screenOf(id); if (!xy) continue; const d = Math.hypot(xy[0] - px, xy[1] - py); if (d < bd) { bd = d; best = id; } }
    return best;
  }
  dropOn(t, id) {
    const R = this.R; if (!R || t.placed) return false;
    t.tries++;
    const ok = t.place === id;
    R.onDrop?.({ id: t.id, value: id, truth: t.place, ok, tries: t.tries });
    if (R.carry) this.uncarry();
    if (ok) {
      t.placed = true; t.justPlaced = true; t.node.parentElement.remove();
      R.say.textContent = `${t.label}: ${this.P.world[id].name}.`;
      this.drawTiles();
      if (R.tiles.every((q) => q.placed)) { R.say.textContent = 'Every event is back on the map.'; R.onDrop?.({ done: true }); }
      else R.tiles.find((q) => !q.placed)?.node.focus({ preventScroll: true });
      return true;
    }
    const a = this.P.world[id], b = this.P.world[t.place];
    R.say.textContent = `Not ${a?.name || id}${a && b ? ` (${fmtKm(km(a, b))} km out)` : ''}.${t.hint ? ' ' + t.hint : ''}`;
    t.node.focus({ preventScroll: true });
    return false;
  }
  dragTile(t, e) {
    if (e.button > 0 || t.placed) return;
    const node = t.node, sx = e.clientX, sy = e.clientY; let moved = false, last = e, hover = null;
    const mv = (ev) => {
      last = ev; const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 5) return;
      if (!moved) { moved = true; node.classList.add('drag'); }
      node.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.max(-3, Math.min(3, dx / 60))}deg)`;
      const B = this.root.getBoundingClientRect(), id = this.hitPlace(ev.clientX - B.left, ev.clientY - B.top);
      if (id !== hover) { this.R.box.querySelectorAll('.mt-t').forEach((n) => n.classList.toggle('over', n.dataset.place === id)); hover = id; }
    };
    const up = () => {
      removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
      node.classList.remove('drag');
      if (!moved) { this.carry(t); return; }
      const B = this.root.getBoundingClientRect(), id = this.hitPlace(last.clientX - B.left, last.clientY - B.top);
      if (id && this.dropOn(t, id)) return;
      const m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(node.style.transform || '');
      springBack(node, m ? +m[1] : 0, m ? +m[2] : 0);
      this.drawTiles();
    };
    addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  }
  carry(t) {
    const R = this.R; if (!R || t.placed) return;
    if (R.carry?.t === t) { this.uncarry(); t.node.focus(); return; }
    this.uncarry();
    R.carry = { t }; t.node.classList.add('carry'); t.node.setAttribute('aria-pressed', 'true');
    R.say.textContent = `Carrying “${t.label}”. Choose its place on the map. Escape puts it down.`;
    this.drawTiles();
    R.box.querySelector('.mt-t')?.focus({ preventScroll: true });
    R.esc = (e) => { if (e.key === 'Escape' && R.carry) { e.stopPropagation(); const n = R.carry.t.node; this.uncarry(); this.drawTiles(); n.focus(); R.say.textContent = 'Put down.'; } };
    addEventListener('keydown', R.esc, true);
  }
  uncarry() {
    const R = this.R; if (!R?.carry) return;
    R.carry.t.node.classList.remove('carry'); R.carry.t.node.removeAttribute('aria-pressed'); R.carry = null;
    removeEventListener('keydown', R.esc, true);
  }
  revealTiles() {
    const R = this.R; if (!R) return;
    this.uncarry();
    R.tiles.filter((t) => !t.placed).forEach((t) => { t.placed = true; t.justPlaced = true; t.node.parentElement?.remove(); });
    R.say.textContent = 'Here is where each one happened.';
    this.drawTiles();
  }
  endTiles(redraw) {
    const R = this.R; if (!R) return;
    this.uncarry();
    [R.tray, R.say, R.box].forEach((n) => n.remove());
    this.R = null;
    if (redraw && this.stage) this.show(this.stage, this.year, true);
  }

  // ---------------- explore
  setExplore(on) {
    this.explore = on;
    const zw = d3zoom().scaleExtent([0.5, 12]).on('zoom', (e) => this.gExplore(e.transform));
    if (on) { this.svgW.call(zw); this.svgR.call(d3zoom().scaleExtent([0.2, 40]).on('zoom', (e) => { const c = this.rcam; this.gZ.attr('transform', `translate(${e.transform.x + c.tx * e.transform.k},${e.transform.y + c.ty * e.transform.k}) scale(${c.k * e.transform.k})`); })); this.enableCityDrag(); }
    else { this.svgW.on('.zoom', null); this.svgR.on('.zoom', null); this.city.onpointerdown = null; this.city.onwheel = null; if (this.stage) this.show(this.stage, this.year, true); }
  }
  gExplore(t) { this.svgW.selectAll('path,g').attr('transform', t.toString()); }
  zoomBy(f) {
    if (this.scale === 'city') { const c = this.cityCam, F = this.focusRect(), cx = (F.x0 + F.x1) / 2, cy = (F.y0 + F.y1) / 2; this.applyCity({ k: c.k * f, tx: cx - (cx - c.tx) * f, ty: cy - (cy - c.ty) * f }); }
  }
  enableCityDrag() {
    let st = null;
    this.city.onpointerdown = (e) => { if (e.target.closest('button')) return; st = { x: e.clientX, y: e.clientY, c: { ...this.cityCam } }; this.city.setPointerCapture(e.pointerId); };
    this.city.onpointermove = (e) => { if (!st) return; this.applyCity({ ...st.c, tx: st.c.tx + e.clientX - st.x, ty: st.c.ty + e.clientY - st.y }); };
    this.city.onpointerup = () => { st = null; this.declutterCity(); };
    this.city.onwheel = (e) => { e.preventDefault(); const f = e.deltaY < 0 ? 1.15 : 1 / 1.15, c = this.cityCam, R = this.city.getBoundingClientRect(), x = e.clientX - R.left, y = e.clientY - R.top; this.applyCity({ k: Math.max(0.12, Math.min(2.5, c.k * f)), tx: x - (x - c.tx) * f, ty: y - (y - c.ty) * f }); };
  }
  describe(stage) {
    if (stage.scale === 'city') return `The 1859 map of Edo${stage.focus && stage.focus !== 'all' ? ', showing ' + stage.focus.map((id) => this.P.city[id]?.name).filter(Boolean).join(', ') : ''}${stage.layer === 'views' ? ', with the places of Hiroshige’s Hundred Views' : ''}${MOVES[stage.anim] ? `, with an arrow for the move of ${MOVES[stage.anim].date}` : ''}.`;
    if (stage.scale === 'japan' || stage.scale === 'kanto') return `A map of ${stage.scale === 'kanto' ? 'Edo Bay and the Kantō' : 'Japan'}${stage.route === 'tokaido' ? ', with the Tōkaidō road drawing from Nihonbashi to Kyoto' : ''}${stage.points ? ', marking ' + stage.points.map((id) => this.P.world[id]?.name).join(', ') : ''}.`;
    const r = { perry: 'Perry’s route from Norfolk east to Uraga', blue: 'the sea routes of Prussian blue to Nagasaki', mm: 'the French mail steamers from Marseille to Yokohama', hayashi: 'Hayashi’s shipments from Yokohama to Paris', pm: 'the Pacific Mail and the railroad to Boston', tokuno: 'Tokyo and Washington', sheet: 'one sheet’s journey from Echizen to New York' }[stage.route];
    return `A world map${r ? ' showing ' + r : ''}.`;
  }
}

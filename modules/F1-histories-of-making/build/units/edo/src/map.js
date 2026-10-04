// The map: three scales in one ink style.
//  world  — d3-geo Equal Earth, rotated per scene (the antimeridian is cut at projection time)
//  region — Japan and the Kantō on a fixed Mercator base with a zoom transform (10 m coastline)
//  city   — the 1859 Library of Congress sheet, with pins placed through a fitted georeference
import { geoEqualEarth, geoMercator, geoPath, geoGraticule10, geoInterpolate } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom as d3zoom, zoomIdentity } from 'd3-zoom';
import { feature } from 'topojson-client';
import { el, esc, motion, Scope, imgUrl } from './util.js';

const NS = 'http://www.w3.org/2000/svg';
const lerp = (a, b, t) => a + (b - a) * t;
const lerpAngle = (a, b, t) => { let d = ((b - a + 540) % 360) - 180; return a + d * t; };

export class MapStage {
  constructor(root, C, onPick) {
    this.root = root; this.C = C; this.P = C.places; this.onPick = onPick; this.scale = null; this.scope = new Scope();
    this.cam = { rot: 150, k: 1, tx: 0, ty: 0 };
    root.innerHTML = '';
    this.svgW = select(root).append('svg').attr('class', 'world').attr('role', 'presentation');
    const w = this.svgW;
    this.gSphere = w.append('path').attr('class', 'sphere');
    this.gGrat = w.append('path').attr('class', 'grat');
    this.gLand = w.append('path').attr('class', 'land');
    this.gRoutes = w.append('g'); this.gLinks = w.append('g'); this.gPts = w.append('g'); this.gLabs = w.append('g');
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
    root.append(this.legend, this.cap, this.ctl);
    this.ready = this.load();
    addEventListener('resize', () => { if (this.stage) this.show(this.stage, this.year, true); });
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
    return { x0: left, y0: bar + 16, x1: W - (mob ? 12 : 28), y1: H - mini - 12, W, H };
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
    this.city.classList.toggle('on', scale === 'city');
    this.legend.hidden = true; this.cap.textContent = ''; this.cityOverlay.innerHTML = ''; this.cityTrail.innerHTML = '';
    if (scale === 'world') return this.showWorld(stage, dur, S);
    if (scale === 'japan') return this.showRegion(stage, dur, S);
    if (scale === 'city') return this.showCity(stage, dur, S);
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
  }
  async showWorld(stage, dur, S) {
    const t = this.worldTarget(stage), from = { ...this.cam };
    this.routeState = this.buildRoutes(stage);
    this.pts = (stage.points || []).map((id) => ({ id, ...this.P.world[id] }));
    const legend = this.routeState.map((r) => r.label && `<div><i class="${r.cls || ''}"></i>${esc(r.label)}</div>`).filter(Boolean);
    if (legend.length) { this.legend.innerHTML = legend.join(''); this.legend.hidden = false; }
    await S.tween(dur, (k) => {
      this.cam = { rot: lerpAngle(from.rot, t.rot, k), k: lerp(from.k, t.k, k), tx: lerp(from.tx, t.tx, k), ty: lerp(from.ty, t.ty, k) };
      this.applyWorld(this.cam);
    }, (x) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2));
    this.cam = t; this.applyWorld(t);
    // draw the routes one after another
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
    const dense = (stops) => {
      const c = [], idx = [];
      for (let i = 0; i < stops.length - 1; i++) {
        const a = [stops[i].lon, stops[i].lat], b = [stops[i + 1].lon, stops[i + 1].lat], ip = geoInterpolate(a, b);
        idx[i] = c.length; for (let j = 0; j < 24; j++) c.push(ip(j / 24));
      }
      idx[stops.length - 1] = c.length; c.push([stops.at(-1).lon, stops.at(-1).lat]);
      return { c, idx };
    };
    const add = (id, opt = {}) => { const r = R[id]; if (!r) return; const d = dense(r.stops); out.push({ id, stops: r.stops, ...d, t: 0, label: r.label, ...opt }); };
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
  drawWorldOverlays() {
    const P = this.proj, path = this.path;
    const rs = this.routeState || [];
    // routes
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
    // links: dotted curves in screen space, for journeys whose route is not recorded
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
    // points: explicit points plus reached stops
    const pts = [...(this.pts || [])];
    for (const r of rs) {
      if (r.link) { r.link.forEach((id, i) => { if (r.t * (r.link.length - 1) >= i - 0.01) pts.push({ id, ...this.P.world[id] }); }); continue; }
      r.stops.forEach((s, i) => { if (s.stop && r.c.length * r.t >= r.idx[i] - 1 && s.name) pts.push({ id: r.id + i, name: s.name, lat: s.lat, lon: s.lon, date: r.dates ? s.date : null, stop: true }); });
    }
    const seen = new Set(); const uniq = pts.filter((p) => { const k = p.name; if (seen.has(k)) return false; seen.add(k); return true; });
    const proj = uniq.map((p) => ({ ...p, xy: P([p.lon, p.lat]) })).filter((p) => p.xy && isFinite(p.xy[0]));
    this.gPts.selectAll('circle').data(proj, (d) => d.name).join('circle').attr('class', (d) => 'pt' + (d.stop ? ' stop' : ''))
      .attr('r', (d) => (d.kind === 'region' ? 3 : 5)).attr('cx', (d) => d.xy[0]).attr('cy', (d) => d.xy[1])
      .attr('tabindex', 0).attr('role', 'button').attr('aria-label', (d) => d.name)
      .on('click', (e, d) => this.onPick?.({ type: 'place', name: d.name, kanji: d.kanji, date: d.date }));
    this.placeLabels(this.gLabs, proj);
  }
  placeLabels(g, pts) {
    const boxes = [], f = this.focusRect(), out = [];
    const sorted = [...pts].sort((a, b) => (b.stop ? 0 : 1) - (a.stop ? 0 : 1));
    for (const p of sorted) {
      const txt = p.name + (p.date ? '  ' + p.date : ''), w = txt.length * 6.6 + 8, h = 15;
      const cand = [[9, 4, 'start'], [-9, 4, 'end'], [0, -10, 'middle'], [0, 18, 'middle']];
      let placed = null;
      for (const [dx, dy, anc] of cand) {
        const x0 = anc === 'start' ? p.xy[0] + dx : anc === 'end' ? p.xy[0] + dx - w : p.xy[0] - w / 2, y0 = p.xy[1] + dy - 11;
        const b = { x0, y0, x1: x0 + w, y1: y0 + h };
        if (b.x0 < f.x0 - 30 || b.x1 > f.W - 4 || b.y0 < f.y0 - 10 || b.y1 > f.y1 + 10) continue;
        if (boxes.some((o) => !(b.x1 < o.x0 || b.x0 > o.x1 || b.y1 < o.y0 || b.y0 > o.y1))) continue;
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
    // shipments travel the line with a running count
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
    const pts = (stage.points || []).map((id) => ({ id, ...this.P.world[id] }));
    const road = stage.route === 'tokaido' || stage.route === 'tokaido-faint';
    this.gRoad.selectAll('*').remove(); this.gRPrints.selectAll('*').remove();
    const stations = this.P.tokaido.map((s) => ({ ...s, xy: this.base([s.lon, s.lat]) }));
    let roadPath = null;
    if (road) {
      roadPath = this.gRoad.append('path').attr('class', stage.route === 'tokaido' ? 'tokaido' : 'route faint')
        .attr('d', 'M' + stations.map((s) => s.xy.join(',')).join('L'));
      this.legend.innerHTML = `<div><i></i>The Tōkaidō, 55 points from Nihonbashi to Kyoto</div>`; this.legend.hidden = false;
    }
    const drawPts = (k) => {
      const sel = this.gRPts.selectAll('g.p').data(pts, (d) => d.id).join((e) => {
        const g = e.append('g').attr('class', 'p').attr('tabindex', 0).attr('role', 'button').attr('aria-label', (d) => d.name)
          .on('click', (ev, d) => this.onPick?.({ type: 'place', name: d.name, kanji: d.kanji }));
        g.each(function (d) {
          const s = select(this);
          if (d.kind === 'mountain') s.append('path').attr('class', 'fuji').attr('d', 'M-11,7 L-3,-7 L3,-7 L11,7 Z M-3,-7 L-1,-3 L1,-5 L3,-7');
          else if (d.kind === 'note') s.append('path').attr('class', 'waveglyph').attr('d', 'M-12,4 C-8,-6 2,-8 6,-2 C3,-4 -1,-2 0,2 C4,6 10,2 12,-2');
          else s.append('circle').attr('class', 'pt').attr('r', 5.5);
          s.append('text').attr('class', 'ptlab').attr('x', 10).attr('y', 4).text(d.name).append('tspan').attr('class', 'k').attr('dx', 5).text(d.kanji || '');
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
    });
    this.rcam = t; this.gZ.attr('transform', `translate(${t.tx},${t.ty}) scale(${t.k})`); drawPts(t.k);
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
  addPrint(p, i, k) {
    const meta = this.C.images[p.id] || {}; const ar = meta.w && meta.h ? meta.h / meta.w : 0.66;
    // hand-placed offsets (screen px) so the nine sheets fan out from the road without overlapping
    const OFF = { 0: [70, -120], 1: [100, 24], 3: [62, 98], 10: [-10, 104], 11: [20, -128], 15: [-78, 98], 16: [-84, -124], 45: [0, 100], 54: [-24, -120] };
    const [dx, dy] = OFF[p.n] || [0, i % 2 ? 90 : -110];
    const W = 92 / k, H = W * ar, up = dy < 0;
    const x = p.s.xy[0] + dx / k - W / 2, y = p.s.xy[1] + dy / k - (up ? H : 0);
    const g = this.gRPrints.append('g').attr('class', 'printpin').attr('tabindex', 0).attr('role', 'button').attr('aria-label', `${p.s.name}: open the print`)
      .on('click', () => this.onPick?.({ type: 'image', id: p.id, title: `${p.s.name} · ${meta.title || ''}` }));
    g.append('line').attr('x1', p.s.xy[0]).attr('y1', p.s.xy[1]).attr('x2', x + W / 2).attr('y2', up ? y + H : y);
    g.append('rect').attr('x', x - 2 / k).attr('y', y - 2 / k).attr('width', W + 4 / k).attr('height', H + 4 / k);
    g.append('image').attr('href', imgUrl(p.id, 't')).attr('x', x).attr('y', y).attr('width', W).attr('height', H).attr('preserveAspectRatio', 'xMidYMid slice');
    g.append('text').attr('class', 'ptlab small').attr('x', x + W / 2).attr('y', up ? y - 5 / k : y + H + 13 / k).attr('text-anchor', 'middle').attr('font-size', 11 / k).style('stroke-width', 4 / k + 'px').text(p.s.name);
    g.style('opacity', 0).transition().duration(motion.dur(400)).style('opacity', 1);
  }

  // ---------------- city (the 1859 sheet)
  cityPx(id) { const c = this.P.city[id]; return c ? [c.xy[0] / 100 * 3964, c.xy[1] / 100 * 3545] : null; }
  cityTarget(stage) {
    const f = this.focusRect();
    let pts = stage.focus === 'all' || !stage.focus ? null : stage.focus.map((id) => this.cityPx(id)).filter(Boolean);
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
    for (const id of ids) this.addCityPin(id, { flip: (t.tx + t.k * this.cityPx(id)[0]) > f.x1 - 260 });
    if (stage.layer === 'views') this.addViews(S);
    await S.tween(dur, (q) => this.applyCity({ k: lerp(from.k, t.k, q), tx: lerp(from.tx, t.tx, q), ty: lerp(from.ty, t.ty, q) }), (x) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2));
    this.applyCity(t);
    this.cityPins.forEach((p, i) => S.timeout(() => p.el.classList.add('on'), motion.dur(120 * i)));
    if (stage.anim) this.cityAnim(stage.anim, S);
  }
  addCityPin(id, { cls = '', flip = false, label } = {}) {
    const c = this.P.city[id]; if (!c) return null;
    const [x, y] = this.cityPx(id);
    const b = el('button', { 'aria-label': c.name, onclick: () => this.onPick?.({ type: 'place', name: c.name, kanji: c.kanji, city: id }) },
      el('span', { class: 'dot' }), el('span', { class: 'lbl', html: `${c.kanji ? `<span class="k">${esc(c.kanji)}</span>` : ''}${esc(label || c.name)}` }));
    const pin = el('div', { class: `cpin ${cls}${flip ? ' flip' : ''}`, style: 'pointer-events:auto' }, b);
    this.cityOverlay.append(pin);
    const o = { id, x, y, el: pin }; this.cityPins.push(o); return o;
  }
  addViews(S) {
    const tip = el('div', { class: 'vtip', hidden: true }); this.cityOverlay.append(tip);
    const views = this.P.views;
    views.forEach((v, i) => {
      const off = v.xy[0] < 1.5 || v.xy[0] > 98.5 || v.xy[1] < 1.5 || v.xy[1] > 98.5;
      const cl = (q) => Math.max(1.2, Math.min(98.8, q));
      const x = cl(v.xy[0]) / 100 * 3964, y = cl(v.xy[1]) / 100 * 3545;
      const b = el('button', { class: `vdot ${v.season}${off ? ' off' : ''}`, 'aria-label': `View ${v.n}: ${v.t}${off ? ' (beyond the edge of this map)' : ''}`, style: `pointer-events:auto;--c:var(--${v.season})`,
        onmouseenter: () => { tip.hidden = false; tip.innerHTML = `<img src="${imgUrl('hv-' + String(v.n).padStart(3, '0'), 'hv')}" alt=""><b>${v.n}.</b> ${esc(v.t)}<br><span lang="ja">${esc(v.ja)}</span>`; const r = b.getBoundingClientRect(), R = this.root.getBoundingClientRect(); tip.style.left = Math.min(r.left - R.left + 14, R.width - 220) + 'px'; tip.style.top = Math.max(60, r.top - R.top - 230) + 'px'; },
        onmouseleave: () => { tip.hidden = true; },
        onclick: () => this.onPick?.({ type: 'view', view: v }) });
      this.cityOverlay.append(b); const o = { x, y, el: b }; this.cityPins.push(o);
      S.timeout(() => b.classList.add('on'), motion.dur(400 + i * 22));
    });
    const lg = ['spring', 'summer', 'autumn', 'winter'].map((s) => `<div><i class="dot" style="background:var(--${s})"></i>${s[0].toUpperCase() + s.slice(1)}</div>`).join('');
    const nOff = views.filter((v) => v.xy[0] < 1.5 || v.xy[0] > 98.5 || v.xy[1] < 1.5 || v.xy[1] > 98.5).length;
    this.legend.innerHTML = `<div style="margin-bottom:4px"><b>${views.length} views</b>, by season</div>${lg}<div><i class="dot" style="background:var(--paper-2);border:2px solid var(--ink-2)"></i>${nOff} beyond the map’s edge</div>`; this.legend.hidden = false;
  }
  drawTrails() {
    const svg = this.cityTrail; svg.innerHTML = '';
    for (const tr of this.trails) {
      const a = this.scr(tr.a), b = this.scr(tr.b);
      const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.18, my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.18;
      const p = document.createElementNS(NS, 'path'); p.setAttribute('d', `M${a}Q${mx},${my} ${b}`); svg.append(p);
      tr.q = (t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * mx + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * my + t * t * b[1]];
    }
  }
  async cityAnim(kind, S) {
    const moveAlong = async (pairs, label) => {
      this.trails = pairs.map(([a, b]) => ({ a: this.cityPx(a), b: this.cityPx(b) })); this.drawTrails();
      const movers = pairs.map(([a, b]) => { const o = this.addCityPin(a, { cls: 'mover on', label }); return o; });
      await S.tween(motion.dur(2400), (k) => { movers.forEach((m, i) => { const tr = this.trails[i]; const s = tr.q(k), c = this.cityCam; m.x = (s[0] - c.tx) / c.k; m.y = (s[1] - c.ty) / c.k; }); this.applyCity(this.cityCam); });
    };
    if (kind === 'fire') {
      const seq = [['hongo', 'Day 1, about 2 p.m.'], ['koishikawa', 'Day 2, about 10 a.m.'], ['kojimachi', 'Day 2, about 4 p.m.']];
      for (const [id, when] of seq) {
        if (S.dead) return;
        const pin = this.cityPins.find((p) => p.id === id); if (pin) { pin.el.classList.add('fire'); pin.el.querySelector('.lbl').insertAdjacentHTML('beforeend', `<br><small>${when}</small>`); }
        const ring = el('div', { class: 'ring' }); this.cityOverlay.append(ring);
        const [x, y] = this.scr(this.cityPx(id));
        await S.tween(motion.dur(1500), (k) => { const r = 20 + k * 150; ring.style.left = x + 'px'; ring.style.top = y + 'px'; ring.style.width = ring.style.height = r * 2 + 'px'; ring.style.opacity = String(1 - k * 0.55); ring.style.borderWidth = (2 + 6 * k) + 'px'; });
      }
    }
    if (kind === 'yoshiwara-move') { await S.tween(motion.dur(600), () => {}); this.addCityPin('yoshiwara-old', { cls: 'on' }); await moveAlong([['yoshiwara-old', 'yoshiwara']], '1657: the quarter moves'); }
    if (kind === 'tsutaya-move') { this.addCityPin('yoshiwara-gate', { cls: 'on' }); await moveAlong([['yoshiwara-gate', 'toriaburacho']], '1783: Tsutaya moves'); }
    if (kind === 'theatres-move') await moveAlong([['sakaicho', 'saruwakacho'], ['fukiyacho', 'saruwakacho'], ['kobikicho', 'saruwakacho']], '1842');
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
    this.city.onpointerup = () => { st = null; };
    this.city.onwheel = (e) => { e.preventDefault(); const f = e.deltaY < 0 ? 1.15 : 1 / 1.15, c = this.cityCam, R = this.city.getBoundingClientRect(), x = e.clientX - R.left, y = e.clientY - R.top; this.applyCity({ k: Math.max(0.12, Math.min(2.5, c.k * f)), tx: x - (x - c.tx) * f, ty: y - (y - c.ty) * f }); };
  }
  describe(stage) {
    if (stage.scale === 'city') return `The 1859 map of Edo${stage.focus && stage.focus !== 'all' ? ', showing ' + stage.focus.map((id) => this.P.city[id]?.name).filter(Boolean).join(', ') : ''}${stage.layer === 'views' ? ', with the 119 places of Hiroshige’s Hundred Views' : ''}.`;
    if (stage.scale === 'japan' || stage.scale === 'kanto') return `A map of ${stage.scale === 'kanto' ? 'Edo Bay and the Kantō' : 'Japan'}${stage.route === 'tokaido' ? ', with the Tōkaidō road drawing from Nihonbashi to Kyoto' : ''}${stage.points ? ', marking ' + stage.points.map((id) => this.P.world[id]?.name).join(', ') : ''}.`;
    const r = { perry: 'Perry’s route from Norfolk east to Uraga', blue: 'the sea routes of Prussian blue to Nagasaki', mm: 'the French mail steamers from Marseille to Yokohama', hayashi: 'Hayashi’s shipments from Yokohama to Paris', pm: 'the Pacific Mail and the railroad to Boston', tokuno: 'Tokyo and Washington', sheet: 'one sheet’s journey from Echizen to New York' }[stage.route];
    return `A world map${r ? ' showing ' + r : ''}.`;
  }
}

// The 2D Place surface: Equal Earth in SVG with d3-geo. It is the accessible companion of the list and the
// fallback for the globe, so it carries every layer the globe does: washes, routes drawn by time, lens layers,
// clusters at region tier, ink. Paths are re-projected on zoom so lines and dashes stay in screen pixels.
import { geoEqualEarth, geoPath, geoGraticule10, geoBounds, geoContains, geoCentroid } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom as d3zoom, zoomIdentity } from 'd3-zoom';
import 'd3-transition';
import { M, CHAPTERS, lineSet, lineTime, washes, loadLand, LENS_DEF } from './model.js';
import { S } from './state.js';
import { INK } from './ink.js';
import { regionMarks, worldMarks, exhibitions, territoryLabelItems, expansionZoom } from './scene.js';
import { updateLabels } from './labels.js';
import { esc } from './model.js';

const NS = 'http://www.w3.org/2000/svg';
const COL = { route: 'var(--indigo)', ink: 'var(--ink)', extract: 'var(--extract)', prov: 'var(--prov)', indigo2: 'var(--indigo-2)' };

export function shapePath(shape, r) {
  switch (shape) {
    case 0: return `M0 ${-r * 1.15}L${r * 1.1} ${r * 0.8}H${-r * 1.1}Z`;
    case 2: return `M${-r * 0.88} ${-r * 0.88}h${r * 1.76}v${r * 1.76}h${-r * 1.76}Z`;
    case 3: return `M0 ${-r * 1.2}L${r * 1.2} 0L0 ${r * 1.2}L${-r * 1.2} 0Z`;
    case 4: return `M${-r} ${-r}h${r * 2}v${r * 2}h${-r * 2}ZM${-r * 0.35} ${-r * 0.35}h${r * 0.7}v${r * 0.7}h${-r * 0.7}Z`;
    case 5: return `M${-r * 0.7} 0a${r * 0.7} ${r * 0.7} 0 1 0 ${r * 1.4} 0a${r * 0.7} ${r * 0.7} 0 1 0 ${-r * 1.4} 0Z`;
    default: return `M${-r} 0a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;
  }
}
function area(r) { let a = 0; for (let i = 0, n = r.length; i < n; i++) { const [x0, y0] = r[i], [x1, y1] = r[(i + 1) % n]; a += x0 * y1 - x1 * y0; } return a / 2; }
function orient(rings) { return rings.map((r, i) => { const a = area(r); return (i === 0 ? a > 0 : a < 0) ? r.slice().reverse() : r; }); }
const SHAPE = { site: 0, city: 1, maker: 2, holding: 3, object: 4, route: 5, edo: 6 };

export class Map2D {
  constructor(host, api) {
    this.host = host; this.api = api; this.t = zoomIdentity; this.raf = 0; this.ready = false;
  }

  async init() {
    const land = await loadLand();
    // d3-geo wants clockwise exteriors (as seen on a north-up map) and anticlockwise holes
    this.landGeo = { type: 'FeatureCollection', features: land.polys.map((rings) => ({ type: 'Feature', geometry: { type: 'Polygon', coordinates: orient(rings) } })) };
    this.terrGeo = M.atlas.territories.map((t) => ({
      id: t.id,
      parts: t.parts.map((p) => ({ w: p.w, code: p.code, geo: { type: 'Feature', geometry: { type: 'MultiPolygon', coordinates: p.rings.map((rs) => orient(rs)) } } })),
    }));
    for (const t of this.terrGeo) {
      const core = t.parts.filter((p) => p.w >= 0.5);
      t.core = { type: 'FeatureCollection', features: (core.length ? core : t.parts).map((p) => p.geo) };
    }
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Equal Earth map of the nine world chapters, their routes and places. The list beside it holds the same content.');
    svg.innerHTML = `<defs>
      ${['pencil', 'ink', 'sel'].map((k) => `<filter id="tf-${k}" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="soft"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="7" result="n"/>
        <feDisplacementMap in="soft" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" result="disp"/>
        <feComponentTransfer in="disp" result="wash"><feFuncA type="linear" slope="0.15"/></feComponentTransfer>
        <feComponentTransfer in="disp" result="bin"><feFuncA type="discrete" tableValues="0 0 0 1 1 1 1 1 1 1"/></feComponentTransfer>
        <feMorphology in="bin" operator="dilate" radius="${k === 'pencil' ? 0.6 : 1.1}" result="dil"/>
        <feComposite in="dil" in2="bin" operator="out" result="ring"/>
        <feFlood style="flood-color: var(${k === 'pencil' ? '--pencil' : k === 'ink' ? '--ink' : '--indigo'})" flood-opacity="${k === 'pencil' ? 0.8 : 0.9}"/>
        <feComposite in2="ring" operator="in" result="line"/>
        <feMerge><feMergeNode in="wash"/><feMergeNode in="line"/></feMerge></filter>`).join('')}
      </defs>
      <path class="m-sphere"/><path class="m-grat"/>
      <g class="m-rips"><path class="m-rip1 r1"/><path class="m-ripk k1"/><path class="m-rip1 r2"/><path class="m-ripk k2"/></g>
      <path class="m-land"/>
      <g class="m-terrs"></g>
      <g class="m-lines"></g>
      <g class="m-expo"></g>
      <g class="m-marks"></g>`;
    this.host.appendChild(svg);
    this.svg = svg;
    this.sel = select(svg);
    this.proj = geoEqualEarth();
    this.path = geoPath(this.proj);
    this.grat = geoGraticule10();
    // territories: one group per chapter, filtered as a whole (a brushed wash plus a contour from its alpha)
    const gT = svg.querySelector('.m-terrs');
    for (const t of this.terrGeo) {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'm-terr');
      g.dataset.id = t.id;
      for (const p of t.parts) {
        const el = document.createElementNS(NS, 'path');
        el.setAttribute('fill-opacity', String(0.5 + 0.5 * p.w));
        p.el = el;
        g.appendChild(el);
      }
      t.g = g;
      gT.appendChild(g);
    }
    this.zoom = d3zoom().scaleExtent([1, 60]).on('start', () => svg.classList.add('is-moving')).on('end', () => { svg.classList.remove('is-moving'); this.schedule(); }).on('zoom', (ev) => { this.t = ev.transform; this.schedule(); });
    this.sel.call(this.zoom).on('dblclick.zoom', null);
    svg.addEventListener('click', (ev) => this.click(ev));
    this.resize();
    this.ready = true;
  }

  resize() {
    const w = this.host.clientWidth || 800, h = this.host.clientHeight || 500;
    this.w = w; this.h = h;
    const top = S.phone ? 52 : 92, bottom = S.phone ? 70 : 84;
    this.base = geoEqualEarth().fitExtent([[16, top], [w - 16, h - bottom]], { type: 'Sphere' });
    this.s0 = this.base.scale(); this.t0 = this.base.translate();
    this.zoom.extent([[0, 0], [w, h]]).translateExtent([[-w * 0.5, -h * 0.5], [w * 1.5, h * 1.5]]);
    this.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    this.draw();
  }

  schedule() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => { this.raf = 0; this.draw(); });
  }

  get k() { return this.t.k; }
  zoomLevel() { return Math.log2((this.s0 * this.t.k * 2 * Math.PI) / 256 / 0.88); }
  tierFromZoom() { return this.t.k >= 2.4 ? 'region' : 'world'; }

  project(lon, lat) {
    const p = this.proj([lon, lat]);
    if (!p) return null;
    return { x: p[0], y: p[1], vis: p[0] > -20 && p[0] < this.w + 20 && p[1] > -20 && p[1] < this.h + 20, front: 1 };
  }

  draw() {
    if (!this.ready && !this.svg) return;
    const t = this.t;
    this.proj.scale(this.s0 * t.k).translate([t.x + t.k * this.t0[0], t.y + t.k * this.t0[1]]).clipExtent([[-60, -60], [this.w + 60, this.h + 60]]);
    const P = this.path;
    const q = (s) => this.svg.querySelector(s);
    q('.m-sphere').setAttribute('d', P({ type: 'Sphere' }));
    q('.m-grat').setAttribute('d', P(this.grat));
    const landD = P(this.landGeo);
    q('.m-land').setAttribute('d', landD);
    const rk = Math.min(1.6, 0.7 + t.k * 0.12);
    q('.m-rips .r1').setAttribute('d', landD); q('.m-rips .r1').setAttribute('stroke-width', (16 * rk).toFixed(1));
    q('.m-rips .k1').setAttribute('d', landD); q('.m-rips .k1').setAttribute('stroke-width', (16 * rk - 1.1).toFixed(1));
    q('.m-rips .r2').setAttribute('d', landD); q('.m-rips .r2').setAttribute('stroke-width', (8 * rk).toFixed(1));
    q('.m-rips .k2').setAttribute('d', landD); q('.m-rips .k2').setAttribute('stroke-width', (8 * rk - 1.1).toFixed(1));
    // washes
    const W = washes(S);
    const lens = S.lens && LENS_DEF[S.lens];
    const sel = S.unit && M.terrById.has(S.unit) ? S.unit : null;
    for (const tg of this.terrGeo) {
      for (const p of tg.parts) p.el.setAttribute('d', P(p.geo) || '');
      const inked = INK.chapters.has(tg.id);
      tg.g.setAttribute('filter', `url(#tf-${sel === tg.id ? 'sel' : inked ? 'ink' : 'pencil'})`);
      tg.g.setAttribute('fill', lens?.bit ? 'var(--extract)' : 'var(--wash)');
      tg.g.setAttribute('opacity', (lens?.bit ? 0.15 + 1.4 * W[tg.id] : 0.3 + 0.7 * W[tg.id]).toFixed(2));
    }
    this.drawLines();
    this.drawMarks();
    this.drawLabels();
    this.api.onDraw?.(this);
  }

  drawLines() {
    const g = this.svg.querySelector('.m-lines');
    const L = lineSet(S).filter((l) => l.a > 0.01);
    const P = this.path;
    let html = '';
    for (const l of L) {
      const tm = lineTime(l, S.year);
      if (tm.p <= 0) continue;
      const a = l.a * tm.k;
      let d;
      if (l.kind === 'prov') {
        const a0 = this.proj([l.stops[0].x, l.stops[0].y]), b0 = this.proj([l.stops[1].x, l.stops[1].y]);
        if (!a0 || !b0) continue;
        const mx = (a0[0] + b0[0]) / 2, my = (a0[1] + b0[1]) / 2, dx = b0[0] - a0[0], dy = b0[1] - a0[1];
        const len = Math.hypot(dx, dy), bend = 0.22;
        const cx = mx - dy * bend, cy = my + dx * bend - len * 0.08;
        d = `M${a0[0].toFixed(1)},${a0[1].toFixed(1)}Q${cx.toFixed(1)},${cy.toFixed(1)} ${b0[0].toFixed(1)},${b0[1].toFixed(1)}`;
      } else {
        d = P({ type: 'LineString', coordinates: l.stops.map((s) => [s.x, s.y]) });
      }
      if (!d) continue;
      const dash = l.dash === 1 ? ' stroke-dasharray="5 4"' : l.dash === 2 ? ' stroke-dasharray="2 3"' : (tm.p < 1 ? ` pathLength="1" stroke-dasharray="${tm.p.toFixed(3)} 1"` : '');
      html += `<path class="m-route" d="${d}" stroke="${COL[l.color]}" stroke-opacity="${a.toFixed(2)}" stroke-width="${(l.w * (S.phone ? 1 : 1.15)).toFixed(2)}"${dash}/>`;
    }
    g.innerHTML = html;
    // exhibitions (F1.19): gold rings, once
    const ex = exhibitions();
    const ge = this.svg.querySelector('.m-expo');
    ge.innerHTML = ex.map((x) => { const p = this.proj([x.x, x.y]); return p ? `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="9" fill="none" stroke="var(--gold)" stroke-width="2"/><circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="var(--gold)"/>` : ''; }).join('');
  }

  drawMarks() {
    const g = this.svg.querySelector('.m-marks');
    const region = this.tierFromZoom() === 'region' || S.tier === 'region';
    this.marks = withSelected(region ? regionMarks(this.zoomLevel()) : worldMarks());
    let html = '';
    for (const m of this.marks) {
      const p = this.proj([m.lon, m.lat]);
      if (!p || p[0] < -20 || p[0] > this.w + 20 || p[1] < -20 || p[1] > this.h + 20) { m.px = null; continue; }
      m.px = p;
      const x = p[0].toFixed(1), y = p[1].toFixed(1);
      if (m.cluster) {
        const r = 9 + Math.log2(m.n) * 3;
        m.r = r;
        html += `<g class="m-node" data-cid="${m.cid}" transform="translate(${x},${y})"><circle r="${r.toFixed(1)}" fill="${m.ink ? 'var(--ink)' : 'var(--paper-2)'}" fill-opacity=".94" stroke="var(--ink)" stroke-width="${m.ink ? 1.6 : 1.1}" ${m.ink ? '' : 'stroke-dasharray="3 2.4"'}/>
          ${m.ink ? `<circle r="${(r + 3).toFixed(1)}" fill="none" stroke="var(--ink)" stroke-width="1" stroke-opacity=".5"/>` : ''}
          <text text-anchor="middle" dy=".35em" style="font: 600 11px var(--ui); fill: ${m.ink ? 'var(--paper)' : 'var(--ink)'}">${m.n}</text></g>`;
      } else {
        const sh = SHAPE[m.f] ?? 1, r = m.f === 'edo' ? 5.5 : 4.6;
        m.r = r + 4;
        const isSel = S.node === m.id;
        const fill = m.ink >= 1 ? 'var(--ink)' : m.ink > 0 ? 'var(--ink)' : 'var(--paper-2)';
        const fo = m.ink >= 1 ? 1 : m.ink > 0 ? 0.4 : 0.85;
        html += `<g class="m-node" data-id="${esc(m.id)}" transform="translate(${x},${y})">${m.approx ? `<circle r="${(r * 2.2).toFixed(1)}" fill="var(--ink)" fill-opacity=".07"/>` : ''}
          <path d="${shapePath(sh, r)}" fill="${fill}" fill-opacity="${fo}" stroke="${isSel ? 'var(--indigo)' : 'var(--ink)'}" stroke-width="${isSel ? 2 : 1.1}" ${m.ink > 0 || isSel ? '' : 'stroke-dasharray="2.2 1.8"'} fill-rule="evenodd"/>
          ${m.f === 'edo' ? `<circle r="${(r + 3).toFixed(1)}" fill="none" stroke="var(--gold)" stroke-width="1.3"/>` : ''}
          ${isSel ? `<circle r="${(r + 6).toFixed(1)}" fill="none" stroke="var(--indigo)" stroke-width="1.5"/>` : ''}</g>`;
      }
    }
    g.innerHTML = html;
  }

  drawLabels() {
    const project = (lon, lat) => this.project(lon, lat);
    const region = this.tierFromZoom() === 'region' || S.tier === 'region';
    let items = territoryLabelItems(project, S.phone);
    if (region) items = items.filter((i) => i.kind !== 'territory' || i.pri >= 100 || this.t.k < 4);
    if (region) items.push(...markLabelItems(this.marks, S.phone));
    for (const x of exhibitions()) {
      const p = project(x.x, x.y);
      if (p?.vis) items.push({ key: 'x-' + x.id, kind: 'expo', x: p.x, y: p.y, anchor: 'l', w: Math.min(220, x.n.length * 6.4 + 10), h: 20, pri: 40, html: `<span class="lab-expo">${esc(x.n)}</span>`, aria: `${x.n}, exhibition, ${x.s}` });
    }
    updateLabels(items, { max: S.phone ? 12 : 26 });
  }

  click(ev) {
    const n = ev.target.closest('.m-node');
    if (n) {
      if (n.dataset.cid) { const m = this.marks.find((x) => x.cluster && String(x.cid) === n.dataset.cid); if (m) this.expandCluster(m); }
      else if (n.dataset.id) this.api.onNode(n.dataset.id);
      return;
    }
    if (this.dragged) return;
    const r = this.svg.getBoundingClientRect();
    const ll = this.proj.invert([ev.clientX - r.left, ev.clientY - r.top]);
    if (!ll) return;
    const id = this.territoryAt(ll);
    if (id) this.api.onTerritory(id);
  }

  territoryAt(ll) {
    let best = null, bw = 0;
    for (const t of this.terrGeo) for (const p of t.parts) if (p.w > bw && geoContains(p.geo, ll)) { best = t.id; bw = p.w; }
    return best;
  }

  expandCluster(m) {
    const z = expansionZoom(m.cid) ?? this.zoomLevel() + 2;
    const k = Math.min(60, Math.pow(2, z - this.zoomLevel()) * this.t.k * 1.05);
    this.flyTo([m.lon, m.lat], k);
  }

  transformFor(lonlat, k) {
    const p = this.base(lonlat);
    return zoomIdentity.translate(this.w / 2, this.h / 2 + (S.phone ? 0 : 6)).scale(k).translate(-p[0], -p[1]);
  }

  flyTo(lonlat, k, ms) {
    const tr = this.transformFor(lonlat, k);
    const motion = S.motion;
    if (!motion || ms === 0) { this.sel.interrupt().call(this.zoom.transform, tr); return; }
    this.sel.interrupt().transition().duration(ms ?? 1100).call(this.zoom.transform, tr);
  }

  flyToTerritory(id, ms) {
    const t = this.terrGeo.find((x) => x.id === id);
    const [[x0, y0], [x1, y1]] = geoBounds(t.core);
    const c = M.terrById.get(id).label;
    const spanX = (x1 < x0 ? x1 + 360 - x0 : x1 - x0) || 30, spanY = (y1 - y0) || 20;
    const s = this.s0 * Math.PI / 180;
    const k = Math.max(1.6, Math.min(8, Math.min((this.w * 0.7) / (spanX * s), (this.h * 0.62) / (spanY * s * 1.1))));
    this.flyTo(c, Math.max(2.5, k), ms);
  }

  flyToNode(id) {
    const o = M.byId.get(id);
    if (o?.placed) this.flyTo([o.x, o.y], Math.max(this.t.k, 9));
  }

  home() { this.flyTo([20, 10], 1); }

  nav(dir) {
    const step = 80;
    if (dir === 'in') this.sel.transition().duration(S.motion ? 300 : 0).call(this.zoom.scaleBy, 1.6);
    else if (dir === 'out') this.sel.transition().duration(S.motion ? 300 : 0).call(this.zoom.scaleBy, 1 / 1.6);
    else if (dir === 'reset') this.home();
    else {
      const dx = dir === 'left' ? step : dir === 'right' ? -step : 0, dy = dir === 'up' ? step : dir === 'down' ? -step : 0;
      this.sel.transition().duration(S.motion ? 250 : 0).call(this.zoom.translateBy, dx / this.t.k, dy / this.t.k);
    }
  }

  setVisible(v) { this.host.hidden = !v; if (v) this.resize(); }
  centroidOf(id) { const t = this.terrGeo.find((x) => x.id === id); return t ? geoCentroid(t.core) : null; }
}

export function withSelected(marks) {
  const o = S.node && M.byId.get(S.node);
  if (o?.placed && !marks.some((m) => !m.cluster && m.id === o.id)) marks.push({ cluster: false, id: o.id, o, lon: o.x, lat: o.y, f: o.f, ink: INK.solid.has(o.id) ? 1 : INK.rumour.has(o.id) ? 0.5 : 0, approx: o.a === 1 });
  return marks;
}

export function markLabelItems(marks, phone, showCount) {
  const items = [];
  const clusters = marks.filter((m) => m.cluster && m.px).sort((a, b) => b.n - a.n);
  const nTab = phone ? 5 : 8;
  clusters.forEach((m, i) => {
    const comp = m.comp.map(([f, n]) => `${n} ${f === 'holding' ? 'institutions' : f === 'city' ? 'cities' : f === 'maker' ? 'makers' : f === 'object' ? 'objects' : f === 'route' ? 'route stops' : f === 'edo' ? 'Edo places' : 'sites'}`).join(', ');
    if (!showCount && i >= nTab) return;
    items.push({ key: 'c-' + m.cid, kind: 'cluster', x: m.px[0], y: m.px[1], w: m.r * 2, h: m.r * 2, pri: 30 + Math.log2(m.n), force: true, tab: i < nTab,
      html: showCount ? `${m.n}` : `<span class="sr">${m.n}</span>`, cls: `lab-c${m.ink ? ' is-ink' : ''}`, aria: `A cluster of ${m.n} places: ${comp}${m.ink ? `, ${m.ink} inked` : ''}. Enter to open it.` });
  });
  const singles = marks.filter((m) => !m.cluster && m.px).sort((a, b) => (b.ink - a.ink) || (a.o.t - b.o.t) || (S.node === b.id) - (S.node === a.id));
  for (const m of singles.slice(0, phone ? 8 : 18)) {
    const nm = m.o.n.length > 34 ? m.o.n.slice(0, 32) + '…' : m.o.n;
    items.push({ key: 'n-' + m.id, kind: 'node', x: m.px[0], y: m.px[1] - 9, anchor: 'b', w: nm.length * 6.6 + 10, h: 20, pri: (S.node === m.id ? 99 : 20) + m.ink * 5 + (3 - m.o.t),
      html: esc(nm), cls: `lab-n ${S.node === m.id ? 'is-sel' : ''}`, aria: `${m.o.n}${m.ink >= 1 ? ', inked' : m.ink > 0 ? ', a rumour' : ''}. Enter to open its card.` });
  }
  return items;
}
export { CHAPTERS };

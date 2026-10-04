// The timeline: a chart of the trade, not a ruler.
// Full mode fills the stage: lanes by kind, lifespans, censor bands, a price lane, print-run bubbles, the playhead with era.
// Mini mode is the indicator strip under every other stage: two scales (1600–1870, 1870–2026), bands, events, playhead.
import { select } from 'd3-selection';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { el, esc, motion, Scope, eraOf, imgUrl } from './util.js';

const BRK = 1870;
const num = (v) => (typeof v === 'string' ? parseFloat(v.replace('~', '')) : v);

export class Timeline {
  constructor(full, mini, C, onPick) {
    this.full = full; this.mini = mini; this.C = C; this.T = C.timeline; this.onPick = onPick; this.scope = new Scope();
    this.svg = select(full).append('svg').attr('role', 'presentation');
    this.msvg = select(mini).append('svg').attr('role', 'presentation');
    this.events = [...this.T.events].sort((a, b) => a.year - b.year);
    this.year = 2024; this.hlBand = null; this.hlEvents = new Set();
    addEventListener('resize', () => { this.drawMini(); if (this.stage) this.show(this.stage, this.year, this.showIds, true); });
  }

  // a piecewise scale with an explicit break at 1870 when the range spans it
  xscale(range, x0, x1) {
    const [a, b] = range;
    if (a < BRK - 20 && b > BRK + 20) {
      const share = (BRK - a) / ((BRK - a) + (b - BRK) / 5);
      const xm = x0 + (x1 - x0) * Math.min(0.86, Math.max(0.6, share));
      const s1 = scaleLinear().domain([a, BRK]).range([x0, xm - 8]), s2 = scaleLinear().domain([BRK, b]).range([xm + 8, x1]);
      const f = (y) => (y <= BRK ? s1(y) : s2(y)); f.brk = xm; f.ticks = [...s1.ticks(8).filter((t) => t < BRK - 8), BRK, ...s2.ticks(3).filter((t) => t > BRK + 10)]; f.domain = range;
      return f;
    }
    const s = scaleLinear().domain(range).range([x0, x1]); const f = (y) => s(y); f.ticks = s.ticks(8); f.domain = range; return f;
  }

  // ---------------- full
  async show(stage, year, showIds = [], instant = false) {
    this.scope.dispose(); this.scope = new Scope(); const S = this.scope;
    this.stage = stage; this.year = year; this.showIds = showIds;
    const W = this.full.clientWidth, H = this.full.clientHeight, mob = innerWidth <= 820;
    const left = mob ? 10 : document.body.classList.contains('explore') ? 40 : Math.min(W * 0.34, 540) + Math.max(20, W * 0.04) + 40;
    const x0 = left + (mob ? 64 : 96), x1 = W - (mob ? 14 : 36), top = (mob ? 50 : 56) + 46, bot = H - (mob ? 20 : 30);
    const range = stage.range || [1600, 2025];
    const x = this.xscale(range, x0, x1);
    const lanes = (stage.lanes || ['state', 'trade', 'print', 'world', 'after']).map((id) => this.T.lanes.find((l) => l.id === id)).filter(Boolean);
    const lives = (stage.lifespans || []).map((id) => ({ id, ...this.C.people[id] })).filter((p) => p.born != null || p.died != null);
    const hasPrice = !!stage.price, hasRuns = !!stage.runs, hasBP = !!stage.blueprice;
    // vertical budget
    const lifeH = lives.length ? Math.min(20, 90 / lives.length) * lives.length + 14 : 0;
    const priceH = hasPrice ? Math.min(lanes.length <= 2 ? 300 : 150, (bot - top) * (lanes.length <= 2 ? 0.48 : 0.3)) : 0;
    const runsH = hasRuns ? 150 : 0, bpH = hasBP ? 120 : 0;
    const laneTop = top + lifeH + 10 + (stage.acts ? 38 : 0), laneBot = bot - priceH - runsH - bpH - 22;
    const laneH = Math.max(34, (laneBot - laneTop) / Math.max(1, lanes.length));
    const ly = (id) => laneTop + laneH * (lanes.findIndex((l) => l.id === id) + (lanes.length > 1 ? 0.8 : 0.6));
    const svg = this.svg; svg.selectAll('*').remove();
    const dur = instant ? 0 : motion.dur(700);
    const inR = (y) => y >= range[0] - 0.5 && y <= range[1] + 0.5;

    // censor bands
    if (stage.bands || stage.bandsanim) {
      const gb = svg.append('g');
      const bands = this.T.bands.filter((b) => b.to > range[0] && b.from < range[1]);
      bands.forEach((b, i) => {
        const g = gb.append('g').attr('class', `tl-band ${b.id}${this.hlBand === b.id ? ' hl' : ''}`);
        const bx0 = x(Math.max(b.from, range[0])), bx1 = x(Math.min(b.to, range[1]));
        const r = g.append('rect').attr('opacity', i % 2 ? 0.55 : 1).attr('x', bx0).attr('y', top - 6).attr('width', Math.max(0, bx1 - bx0)).attr('height', laneBot - top + 6);
        if (b.id !== 'none') g.append('text').attr('x', bx0 + 6).attr('y', laneBot - 6).text(bx1 - bx0 > 90 ? b.label : b.short);
        if (stage.bandsanim) { g.style('opacity', 0); S.timeout(() => g.transition().duration(motion.dur(500)).style('opacity', 1), motion.dur(500 * i)); }
      });
    }
    // axis
    const ga = svg.append('g').attr('class', 'tl-tick');
    for (const t of x.ticks) { const g = ga.append('g').attr('transform', `translate(${x(t)},0)`); g.append('line').attr('y1', top - 10).attr('y2', laneBot).attr('stroke-dasharray', '2 4'); g.append('text').attr('y', top - 16).attr('text-anchor', 'middle').text(t); }
    if (x.brk) { svg.append('text').attr('class', 'tl-brk').attr('x', x.brk + 6).attr('y', bot - 2).text('after 1870: ⅕ scale'); svg.append('line').attr('class', 'tl-rule').attr('x1', x.brk).attr('x2', x.brk).attr('y1', top - 10).attr('y2', bot).attr('stroke-dasharray', '1 3'); }
    // acts as shaded columns behind the lanes, labelled inside at the top
    if (stage.acts) {
      const acts = [['I', 'Tsutaya', 1774, 1806], ['II', 'Eijudō', 1807, 1835], ['III', 'The ban', 1841, 1868], ['IV', 'Abroad', 1865, 1928], ['V', 'The icon', 2020, 2024.6]];
      const g = svg.insert('g', ':first-child').attr('class', 'tl-act');
      acts.filter(([, , a, b]) => b >= range[0] && a <= range[1]).forEach(([n, nm, a, b], i) => {
        const xa = x(Math.max(a, range[0])), xb = x(Math.min(b, range[1])), w = Math.max(3, xb - xa);
        g.append('rect').attr('x', xa).attr('y', top - 4).attr('width', w).attr('height', laneBot - top + 4).attr('fill', 'var(--paper-3)').attr('opacity', i % 2 ? 0.55 : 0.9);
        const t = g.append('text').attr('x', xa + (w > 60 ? 6 : w / 2)).attr('y', top + lifeH + 12 + (i % 2) * 14).attr('text-anchor', w > 60 ? 'start' : 'middle');
        t.text(w > 60 ? `${n} · ${nm}` : n);
      });
    }
    // lanes
    const gl = svg.append('g');
    lanes.forEach((l) => { gl.append('line').attr('class', 'tl-rule').attr('x1', x0).attr('x2', x1).attr('y1', ly(l.id)).attr('y2', ly(l.id)); gl.append('text').attr('class', 'tl-lane-lab').attr('x', x0 - 12).attr('y', ly(l.id) + 4).attr('text-anchor', 'end').text(l.label); });
    // lifespans grow to the playhead
    if (lives.length) {
      const g = svg.append('g'); const h = Math.min(20, 90 / lives.length);
      lives.forEach((p, i) => {
        const b = num(p.born ?? p.died - 1), d = num(p.died ?? p.born + 1), y = top + 4 + i * h;
        const gg = g.append('g').attr('class', 'tl-life on').style('cursor', 'pointer').on('click', () => this.onPick?.({ type: 'person', id: p.id }));
        const xb = x(Math.max(b, range[0])), xd = x(Math.min(d, range[1])), xn = x(Math.min(Math.max(year, b), d, range[1]));
        const r = gg.append('rect').attr('x', xb).attr('y', y).attr('height', h * 0.42).attr('rx', 2).attr('width', 0);
        r.transition().duration(dur).attr('width', Math.max(2, (year >= d ? xd : xn) - xb));
        gg.append('rect').attr('x', xb).attr('y', y).attr('height', h * 0.42).attr('rx', 2).attr('width', Math.max(2, xd - xb)).style('opacity', .12);
        gg.append('text').attr('x', xb - 6).attr('y', y + h * 0.42).attr('text-anchor', 'end').text(`${p.name.split(' (')[0]} ${p.born ?? ''}–${p.died ?? ''}`.replace(/~/g, 'c.'));
      });
    }
    // events
    const shown = new Set([...(showIds || []), ...this.hlEvents]);
    const evs = this.events.filter((e) => inR(e.year) && lanes.some((l) => l.id === e.lane));
    const ge = svg.append('g');
    // labels: greedy placement per lane, on the lowest free level above the lane
    const levels = {};
    const lvH = evs.some((e) => shown.has(e.id) && e.img) ? 62 : 26;
    const maxLv = Math.max(1, Math.floor((laneH - 24) / lvH));
    evs.forEach((e, i) => {
      const cx = x(e.year), cy = ly(e.lane), on = shown.has(e.id), past = e.year <= year;
      const g = ge.append('g').attr('class', `tl-ev${on ? ' show' : ''}${past ? ' past' : ''}${e.seal ? ' seal' : ''}`).attr('transform', `translate(${cx},${cy})`)
        .attr('tabindex', 0).attr('role', 'button').attr('aria-label', `${Math.floor(e.year)}: ${e.label}`)
        .on('click', () => this.onPick?.({ type: 'event', id: e.id }));
      const c = g.append('circle').attr('r', 0); c.transition().delay(motion.dur(on ? 200 : i * 8)).duration(dur).attr('r', on ? 7.5 : 4.5);
      if (on) {
        const w = (String(Math.floor(e.year)).length + e.label.length + 1) * 6.9 + 8;
        const anchor = cx > x1 - w / 2 ? 'end' : cx < x0 + w / 2 ? 'start' : 'middle';
        const a = anchor === 'end' ? cx - w : anchor === 'start' ? cx : cx - w / 2, b = a + w;
        const L = (levels[e.lane] ||= []);
        let lv = 0; const hit = (k) => (L[k] || []).some(([p, q]) => a < q + 10 && b > p - 10);
        while (lv < maxLv && hit(lv)) lv++;
        if (lv >= maxLv) { g.style('opacity', 1); return; }
        (L[lv] ||= []).push([a, b]);
        const lift = 22 + lv * lvH;
        if (e.img) {
          const s = 44;
          g.append('image').attr('class', 'thumb').attr('href', imgUrl(e.img, 't')).attr('x', -s / 2).attr('y', -lift - s - 6).attr('width', s).attr('height', s).attr('preserveAspectRatio', 'xMidYMid slice');
          g.append('rect').attr('class', 'thumbframe').attr('x', -s / 2).attr('y', -lift - s - 6).attr('width', s).attr('height', s);
          g.append('line').attr('y1', -8).attr('y2', -lift - 6).attr('stroke', 'var(--indigo)');
          const t = g.append('text').attr('class', 'lab').attr('y', -lift - s - 12).attr('text-anchor', anchor);
          t.append('tspan').attr('class', 'yr').text(Math.floor(e.year) + ' '); t.append('tspan').text(e.label);
        } else {
          g.append('line').attr('y1', -8).attr('y2', -lift + 4).attr('stroke', 'var(--indigo)');
          const t = g.append('text').attr('class', 'lab').attr('y', -lift).attr('text-anchor', anchor);
          t.append('tspan').attr('class', 'yr').text(Math.floor(e.year) + ' '); t.append('tspan').text(e.label);
        }
        g.style('opacity', 0).transition().delay(motion.dur(250)).duration(dur).style('opacity', 1);
      }
    });
    // the edict, in its own characters
    if (stage.edict) svg.append('text').attr('class', 'tl-note seal').attr('x', x(1842.5) + 12).attr('y', laneTop + 16).attr('lang', 'ja').text('「…風俗ニ拘り候筋ニ付」 Tenpō 13, sixth month');
    // legend of the packing-paper story
    if (stage.legend) {
      const g = svg.append('g'); const yA = laneTop + laneH * 0.5 + 34;
      g.append('path').attr('d', `M${x(1905)},${yA} C${x(1890)},${yA + 46} ${x(1870)},${yA + 46} ${x(1856)},${yA}`).attr('fill', 'none').attr('stroke', 'var(--ink-2)').attr('stroke-dasharray', '3 4');
      g.append('circle').attr('cx', x(1856)).attr('cy', yA).attr('r', 6).attr('fill', 'none').attr('stroke', 'var(--ink-2)');
      g.append('text').attr('class', 'tl-note').attr('x', x(1856)).attr('y', yA - 12).attr('text-anchor', 'middle').text('1856: when the story says it happened (disputed)');
      g.append('text').attr('class', 'tl-note').attr('x', x(1905)).attr('y', yA + 52).attr('text-anchor', 'middle').text('1905: when it was first printed');
    }
    // blue price (Smith): two documented figures
    if (hasBP) {
      const g = svg.append('g').attr('class', 'tl-bp'); const yb = laneBot + 20, ys = scaleLinear().domain([0, 100]).range([yb + bpH - 20, yb]);
      g.append('text').attr('x', x0 - 12).attr('y', yb + 12).attr('text-anchor', 'end').attr('class', 'tl-lane-lab').text('Blue, monme');
      const p = g.append('path').attr('d', `M${x(1824.5)},${ys(87)} L${x(1828.5)},${ys(31)}`);
      g.append('circle').attr('cx', x(1824.5)).attr('cy', ys(87)).attr('r', 5); g.append('circle').attr('cx', x(1828.5)).attr('cy', ys(31)).attr('r', 5);
      g.append('text').attr('x', x(1824.5) - 8).attr('y', ys(87) + 4).attr('text-anchor', 'end').text('87 monme a kin');
      g.append('text').attr('x', x(1828.5) - 8).attr('y', ys(31) + 20).attr('text-anchor', 'end').text('31 monme by 1828: Chinese imports (Smith)');
      const L = p.node().getTotalLength(); p.attr('stroke-dasharray', `${L} ${L}`).attr('stroke-dashoffset', L).transition().delay(motion.dur(300)).duration(motion.dur(1200)).attr('stroke-dashoffset', 0);
    }
    // print runs
    if (hasRuns) {
      const g = svg.append('g'); const yr = bot - priceH - runsH / 2 - 6; const rs = scaleSqrt().domain([0, 408000]).range([0, 52]);
      g.append('text').attr('class', 'tl-lane-lab').attr('x', x0 - 12).attr('y', yr + 4).attr('text-anchor', 'end').text('Print runs');
      this.T.runs.filter((r) => inR(r.year)).forEach((r, i) => {
        const gg = g.append('g').attr('class', 'tl-run').attr('transform', `translate(${x(r.year)},${yr})`);
        gg.append('circle').attr('r', 0).transition().delay(motion.dur(300 + i * 400)).duration(motion.dur(900)).attr('r', Math.max(4, rs(r.n)));
        const rr = Math.max(4, rs(r.n)); gg.append('text').attr('y', i % 2 ? rr + 16 : -rr - 6).attr('text-anchor', 'middle').text(r.label + (r.conf === 'probable' && !r.label.includes('(') ? ' (probable)' : ''));
      });
    }
    // price lane
    if (hasPrice) {
      const g = svg.append('g').attr('class', 'tl-price'); const yp0 = bot - 6, yp1 = bot - priceH + 18, ys = scaleLinear().domain([0, 32]).range([yp0, yp1]);
      g.append('text').attr('class', 'tl-lane-lab').attr('x', x0 - 12).attr('y', yp1 - 16).attr('text-anchor', 'end').text(mob ? 'Mon' : 'A sheet, mon');
      const ax = g.append('g').attr('class', 'axis');
      [0, 16, 24, 32].forEach((v) => { ax.append('line').attr('class', 'tl-rule').attr('x1', x0).attr('x2', x1).attr('y1', ys(v)).attr('y2', ys(v)).attr('stroke-dasharray', v ? '1 4' : null); ax.append('text').attr('x', x0 - 6).attr('y', ys(v) + 4).attr('text-anchor', 'end').text(v); });
      const sob = this.T.soba;
      const sx0 = x(Math.max(range[0], 1700)), sx1 = x(Math.min(range[1], 1850)), sx2 = x(Math.min(range[1], 1868));
      g.append('path').attr('class', 'soba').attr('d', `M${sx0},${ys(16)} L${sx1},${ys(16)} L${sx1},${ys(24)} L${sx2},${ys(24)}`);
      g.append('text').attr('class', 'note').attr('x', sx0 + 4).attr('y', ys(16) + 15).text('a bowl of soba (probable)');
      this.T.price.filter((p) => inR(p.year) && (!p.cap || stage.cap || year >= 1842.9)).forEach((p, i) => {
        const cx = x(p.year), d = motion.dur(300 + i * 250);
        if (p.cap) {
          const c = g.append('line').attr('class', 'cap').attr('x1', cx).attr('x2', cx).attr('y1', ys(24)).attr('y2', ys(24));
          c.transition().delay(d).duration(motion.dur(800)).attr('y2', ys(16));
          g.append('line').attr('class', 'cap').attr('x1', cx).attr('x2', x(Math.min(range[1], 1847))).attr('y1', ys(16)).attr('y2', ys(16)).attr('stroke-dasharray', '4 3');
          g.append('text').attr('class', 'capnote').attr('x', cx + 8).attr('y', ys(16) + 16).text('the cap, 1842: 16 mon');
          return;
        }
        if (p.hi > p.lo) g.append('line').attr('class', 'rng').attr('x1', cx).attr('x2', cx).attr('y1', ys(p.lo)).attr('y2', ys(p.hi));
        g.append('circle').attr('class', 'pt').attr('cx', cx).attr('cy', ys((p.lo + p.hi) / 2)).attr('r', 0).transition().delay(d).duration(motion.dur(400)).attr('r', 5);
        g.append('text').attr('class', 'note').attr('x', cx > x1 - 110 ? cx - 9 : cx + 9).attr('text-anchor', cx > x1 - 110 ? 'end' : 'start').attr('y', ys(p.hi) - 6).text(`${p.lo === p.hi ? p.lo : p.lo + '–' + p.hi}${p.conf === 'probable' ? ' (probable)' : ''}`);
      });
    }
    // playhead with the era year
    const ph = svg.append('g').attr('class', 'tl-ph');
    const px = x(Math.min(Math.max(year, range[0]), range[1]));
    ph.append('line').attr('x1', px).attr('x2', px).attr('y1', top - 26).attr('y2', bot);
    const lab = `${Math.floor(year)}${eraOf(year) ? ' · ' + eraOf(year).split(' · ')[0] : ''}`;
    const lw = lab.length * 7.6 + 18;
    ph.append('rect').attr('x', Math.min(px - lw / 2, x1 - lw)).attr('y', top - 46).attr('width', lw).attr('height', 22).attr('rx', 11);
    ph.append('text').attr('x', Math.min(px, x1 - lw / 2)).attr('y', top - 31).attr('text-anchor', 'middle').text(lab);
    this.drawMini();
  }

  // ---------------- mini
  setYear(y, show = []) { this.year = y; this.miniShow = new Set(show); this.drawMini(); }
  highlightBand(id) { this.hlBand = id; this.drawMini(); if (this.stage && this.full.parentElement && this.full.classList.contains('on')) this.show(this.stage, this.year, this.showIds, true); }
  highlightEvents(ids) { this.hlEvents = new Set(ids || []); this.drawMini(); }
  drawMini() {
    const W = this.mini.clientWidth || innerWidth; const mob = innerWidth <= 820;
    const left = mob ? 10 : Math.min(innerWidth * 0.34, 540) + Math.max(20, innerWidth * 0.04) + 36, right = W - (mob ? 10 : 28);
    const x = this.xscale([1600, 2026], left, right);
    const s = this.msvg; s.selectAll('*').remove();
    const y0 = 16, h = 14;
    s.append('g').attr('class', 'seg').call((g) => { g.append('rect').attr('x', left).attr('y', y0).attr('width', x.brk - 8 - left).attr('height', h).attr('rx', 3); g.append('rect').attr('x', x.brk + 8).attr('y', y0).attr('width', right - x.brk - 8).attr('height', h).attr('rx', 3); });
    for (const b of this.T.bands.filter((b) => b.id !== 'none')) s.append('g').attr('class', `band${this.hlBand === b.id ? ' hl' : ''}`).append('rect').attr('x', x(b.from)).attr('y', y0).attr('width', x(Math.min(b.to, 1876)) - x(b.from)).attr('height', h);
    const show = new Set([...(this.miniShow || []), ...this.hlEvents]);
    for (const e of this.events) s.append('circle').attr('class', 'ev' + (show.has(e.id) ? ' show' : '')).attr('cx', x(e.year)).attr('cy', y0 + h / 2).attr('r', show.has(e.id) ? 4 : 1.6);
    for (const t of [1600, 1700, 1800, 1870, 1950, 2024]) s.append('text').attr('x', x(t)).attr('y', y0 + h + 13).attr('text-anchor', 'middle').text(t);
    const px = x(Math.min(this.year, 2025.9));
    const ph = s.append('g').attr('class', 'ph'); ph.append('line').attr('x1', px).attr('x2', px).attr('y1', y0 - 6).attr('y2', y0 + h + 4); ph.append('circle').attr('cx', px).attr('cy', y0 - 6).attr('r', 3.5);
  }
  describe(stage, year) {
    const parts = [`A timeline from ${stage.range?.[0] ?? 1600} to ${stage.range?.[1] ?? 2025}, at ${Math.floor(year)}`];
    if (stage.price) parts.push('with the price of a sheet in mon');
    if (stage.bands) parts.push('with the four censor regimes as bands');
    if (stage.lifespans) parts.push('with the lives of ' + stage.lifespans.map((id) => this.C.people[id]?.name).filter(Boolean).join(', '));
    return parts.join(', ') + '.';
  }
}

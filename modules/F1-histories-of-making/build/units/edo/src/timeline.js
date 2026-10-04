// The timeline: a chart of the trade that things visibly happen on.
// Full mode fills the stage: lanes by kind, lifespans, censor bands, a price lane, print-run bubbles, and an indigo
// "now" cursor synced to the story. Left of the cursor is inked; right of it is faint pencil. When the cursor passes
// something it happens: bands stamp in (once), the price steps down at 1842, run bubbles grow, lifespans draw.
// Guesses (drag a marker on the axis) and Rebuild tiles (drag events back onto the axis) live on the same axis.
// Mini mode is the indicator strip under every other stage.
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { el, esc, motion, Scope, eraOf } from './util.js';
import { ease, EASE_CSS, springBack, thumb, spriteOf } from './cards.js';

const BRK = 1870;
const NS = 'http://www.w3.org/2000/svg';
const num = (v) => (v == null ? null : typeof v === 'string' ? parseFloat(v.replace('~', '')) : v);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const S = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null && v !== false) { if (k === 'text') n.textContent = v; else n.setAttribute(k, v); }
  if (parent) parent.append(n);
  return n;
};
const fy = (y) => Math.floor(y);
let clipN = 0;
// a sprite thumbnail inside svg: an <image> of the atlas clipped to an s × s square (cover crop, focus near the top)
function spriteImage(parent, defs, sp, x, y, s, cls) {
  const id = `tlc${++clipN}`, k = s / Math.min(sp.w, sp.h);
  S('rect', { x, y, width: s, height: s }, S('clipPath', { id }, defs));
  return S('image', { href: sp.url, class: cls, x: x - sp.x * k - (sp.w * k - s) / 2, y: y - sp.y * k - (sp.h * k - s) * 0.2, width: sp.W * k, height: sp.H * k, 'clip-path': `url(#${id})`, preserveAspectRatio: 'none' }, parent);
}
const anim = (node, kf, opt) => (motion.reduced || !node?.animate ? null : node.animate(kf, opt));
const stampIn = (node, delay = 0) => anim(node, [{ transform: 'scale(1.06)', opacity: 0 }, { opacity: 1, offset: 0.5 }, { transform: 'scale(1)', opacity: 1 }], { duration: 200, delay, easing: EASE_CSS.standard, fill: 'backwards' });

export class Timeline {
  constructor(full, mini, C, onPick) {
    this.full = full; this.mini = mini; this.C = C; this.T = C.timeline; this.onPick = onPick; this.scope = new Scope();
    full.classList.add('tl-root');
    this.svg = S('svg', { role: 'presentation', class: 'tl-svg' }, full);
    this.ov = el('div', { class: 'tl-ov' }); full.append(this.ov);
    this.tip = el('div', { class: 'tl-tip', hidden: true }); this.ov.append(this.tip);
    this.live = el('p', { class: 'vh', 'aria-live': 'polite' }); full.append(this.live);
    this.list = el('div', { class: 'vh tl-list' }); full.append(this.list);
    this.msvg = S('svg', { role: 'presentation' }, mini);
    this.events = [...this.T.events].sort((a, b) => a.year - b.year);
    this.year = 2024; this.now = null; this.hlBand = null; this.hlEvents = new Set();
    this.stamped = new Set();
    this.G = null; this.R = null; this.marks = {};
    let rt = 0;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { this.drawMini(); if (this.stage && this.full.clientWidth) { this.sig = null; this.show(this.stage, this.year, this.showIds, true); } }, 120); });
  }

  // a piecewise scale with an explicit break at 1870 when the range spans it
  xscale(range, x0, x1) {
    const [a, b] = range;
    if (a < BRK - 20 && b > BRK + 20) {
      const share = (BRK - a) / ((BRK - a) + (b - BRK) / 5);
      const xm = x0 + (x1 - x0) * Math.min(0.86, Math.max(0.6, share));
      const s1 = scaleLinear().domain([a, BRK]).range([x0, xm - 9]), s2 = scaleLinear().domain([BRK, b]).range([xm + 9, x1]);
      const f = (y) => (y <= BRK ? s1(y) : s2(y));
      f.brk = xm; f.ticks = [...s1.ticks(8).filter((t) => t < BRK - 8), BRK, ...s2.ticks(3).filter((t) => t > BRK + 10)]; f.domain = range;
      f.invert = (px) => (px <= xm - 9 ? s1.invert(px) : px >= xm + 9 ? s2.invert(px) : BRK);
      return f;
    }
    const s = scaleLinear().domain(range).range([x0, x1]); const f = (y) => s(y); f.ticks = s.ticks(8); f.domain = range; f.invert = (px) => s.invert(px); return f;
  }

  geometry(stage) {
    const W = this.full.clientWidth || innerWidth, H = this.full.clientHeight || innerHeight, mob = innerWidth <= 820;
    const left = mob ? 10 : document.body.classList.contains('explore') ? 40 : Math.min(W * 0.34, 540) + Math.max(20, W * 0.04) + 40;
    const x0 = left + (mob ? 14 : 104), x1 = W - (mob ? 16 : 40);
    const trayH = this.R ? (mob ? 96 : 118) : 0;
    const guessH = this.G ? (mob ? 50 : 60) : 0;
    const top = (mob ? 50 : 56) + 50 + (this.R ? (mob ? 44 : 64) : 0), bot = H - (mob ? 18 : 30) - trayH - guessH;
    return { W, H, mob, left, x0, x1, top, bot, trayH };
  }

  // ---------------- full
  show(stage, year, showIds = [], instant = false) {
    const prev = this.now;
    this.scope.dispose(); this.scope = new Scope();
    const sig = JSON.stringify([stage, this.full.clientWidth, this.full.clientHeight, !!this.R, document.body.classList.contains('explore')]);
    const same = sig === this.sig;
    const range = stage.range || [1600, 2025];
    const animate = !instant && !motion.reduced;
    // a new stage sweeps the cursor in from the previous year (when that is earlier and inside the range)
    let from = year;
    if (animate && same && prev != null) from = prev;
    else if (animate && !same && prev != null && prev < year && prev > range[0] - 1) from = clamp(prev, range[0], range[1]);
    this.stage = stage; this.year = year; this.showIds = showIds || [];
    this.build(stage, from, { fresh: !same && !instant });
    this.sig = sig;
    this.moveTo(year, animate && from !== year);
    this.drawMini();
    return Promise.resolve();
  }

  build(stage, now, { fresh }) {
    const g = this.geom = this.geometry(stage);
    const { x0, x1, top, bot, mob } = g;
    const range = stage.range || [1600, 2025];
    const x = this.x = this.xscale(range, x0, x1);
    const lanes = this.lanes = (stage.lanes || ['state', 'trade', 'print', 'world', 'after']).map((id) => this.T.lanes.find((l) => l.id === id)).filter(Boolean);
    const lives = (stage.lifespans || []).map((id) => ({ id, ...this.C.people[id] })).filter((p) => p.born != null || p.died != null);
    const hasPrice = !!stage.price, hasRuns = !!stage.runs, hasBP = !!stage.blueprice;
    const lifeH = lives.length ? Math.min(24, 120 / lives.length) * lives.length + 16 : 0;
    let priceH = hasPrice ? Math.min(lanes.length <= 2 ? 280 : 150, (bot - top) * (lanes.length <= 2 ? 0.46 : 0.3)) : 0;
    let runsH = hasRuns ? (mob ? 110 : 150) : 0, bpH = hasBP ? 120 : 0;
    // on a short stage the extra panels shrink before the lanes do
    const spare = (bot - top) - lifeH - 32 - (stage.acts ? 38 : 0) - lanes.length * (mob ? 30 : 40), extra = priceH + runsH + bpH;
    let tight = false;
    if (extra > 0 && spare < extra) { const f = Math.max(0.45, spare / extra); priceH *= f; runsH *= f; bpH *= f; tight = f < 0.8; }
    const laneTop = top + lifeH + 10 + (stage.acts ? 38 : 0), laneBot = bot - priceH - runsH - bpH - 22;
    const laneH = Math.max(34, (laneBot - laneTop) / Math.max(1, lanes.length));
    const ly = (id) => laneTop + laneH * (lanes.findIndex((l) => l.id === id) + (lanes.length > 1 ? 0.8 : 0.6));
    Object.assign(g, { laneTop, laneBot, laneH, ly, lifeH, priceH, runsH });
    const inR = (y) => y >= range[0] - 0.5 && y <= range[1] + 0.5;
    const svg = this.svg; svg.innerHTML = '';
    this.happen = []; this.cont = [];
    const H = this.happen, past = (y) => y <= now + 1e-6;
    const hide = this.G && !this.G.revealed ? new Set([this.G.spec.event, ...(this.G.hideIds || [])]) : new Set();

    // pencil clip: everything inked is clipped to the left of the cursor
    const defs = S('defs', {}, svg);
    const cp = S('clipPath', { id: 'tl-ink' }, defs); this.inkRect = S('rect', { x: 0, y: 0, width: 0, height: g.H }, cp);
    const cpF = S('clipPath', { id: 'tl-pencil' }, defs); this.penRect = S('rect', { x: 0, y: 0, width: g.W, height: g.H }, cpF);

    // acts as shaded columns
    if (stage.acts) {
      const acts = [['I', 'Tsutaya', 1774, 1806], ['II', 'Eijudō', 1807, 1835], ['III', 'The ban', 1841, 1868], ['IV', 'Abroad', 1865, 1928], ['V', 'The icon', 2020, 2024.6]];
      const ga = S('g', { class: 'tl-act' }, svg);
      acts.filter(([, , a, b]) => b >= range[0] && a <= range[1]).forEach(([n, nm, a, b], i) => {
        const xa = x(Math.max(a, range[0])), xb = x(Math.min(b, range[1])), w = Math.max(3, xb - xa);
        S('rect', { x: xa, y: top - 4, width: w, height: laneBot - top + 4, opacity: i % 2 ? 0.55 : 0.9 }, ga);
        S('text', { x: xa + (w > 60 ? 6 : w / 2), y: top + lifeH + 12 + (i % 2) * 14, 'text-anchor': w > 60 ? 'start' : 'middle', text: w > 60 ? `${n} · ${nm}` : n }, ga);
      });
    }
    // censor bands: future ones are pencil outlines; passing one stamps it in (once)
    if (stage.bands || stage.bandsanim) {
      const gb = S('g', { class: 'tl-bands' }, svg);
      const bands = this.T.bands.filter((b) => b.to > range[0] && b.from < range[1] && b.id !== 'none');
      bands.forEach((b, i) => {
        const bx0 = x(Math.max(b.from, range[0])), bx1 = x(Math.min(b.to, range[1])), w = Math.max(0, bx1 - bx0);
        const gg = S('g', { class: `tl-band ${b.id}${this.hlBand === b.id ? ' hl' : ''}` }, gb);
        const pen = S('rect', { class: 'pen', x: bx0, y: top - 6, width: w, height: laneBot - top + 6 }, gg);
        const ink = S('g', { class: 'ink', style: `transform-origin:${bx0 + w / 2}px ${(top + laneBot) / 2}px` }, gg);
        S('rect', { x: bx0, y: top - 6, width: w, height: laneBot - top + 6, opacity: i % 2 ? 0.6 : 1 }, ink);
        S('text', { x: bx0 + 6, y: laneBot - 6, text: w > 96 ? b.label : b.short }, ink);
        const key = b.id;
        H.push({ y: b.from, on: (a) => { gg.classList.add('on'); pen.style.opacity = 0;
          if (a && !this.stamped.has(key)) stampIn(ink); else if (a) anim(ink, [{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
          this.stamped.add(key); }, off: () => { gg.classList.remove('on'); pen.style.opacity = ''; } });
      });
    }
    // axis
    const gx = S('g', { class: 'tl-tick' }, svg);
    for (const t of x.ticks) { const gg = S('g', { transform: `translate(${x(t)},0)` }, gx); S('line', { y1: top - 10, y2: laneBot, 'stroke-dasharray': '2 4' }, gg); S('text', { y: top - 16, 'text-anchor': 'middle', text: t }, gg); }
    // lanes
    const gl = S('g', { class: 'tl-lanes' }, svg);
    lanes.forEach((l) => {
      S('line', { class: 'tl-rule ink', x1: x0, x2: x1, y1: ly(l.id), y2: ly(l.id), 'clip-path': 'url(#tl-ink)' }, gl);
      S('line', { class: 'tl-rule pencil', x1: x0, x2: x1, y1: ly(l.id), y2: ly(l.id), 'clip-path': 'url(#tl-pencil)' }, gl);
      if (mob) S('text', { class: 'tl-lane-lab', x: x0, y: ly(l.id) - 7, text: l.label }, gl);
      else S('text', { class: 'tl-lane-lab', x: x0 - 12, y: ly(l.id) + 4, 'text-anchor': 'end', text: l.label }, gl);
    });

    // lifespans: a pencil bar for the whole life, inked up to the cursor
    if (lives.length) {
      const gL = S('g', { class: 'tl-lives' }, svg); const h = Math.min(24, 120 / lives.length);
      lives.forEach((p, i) => {
        const b = num(p.born ?? num(p.died) - 1), d = num(p.died ?? num(p.born) + 1), y = top + 14 + i * h;
        const gg = S('g', { class: 'tl-life', tabindex: 0, role: 'button', 'aria-label': `${p.name}, ${p.born ?? '?'}–${p.died ?? '?'}`.replace(/~/g, 'c. ') }, gL);
        gg.addEventListener('click', () => this.onPick?.({ type: 'person', id: p.id }));
        gg.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.onPick?.({ type: 'person', id: p.id }); } });
        const xb = x(clamp(b, range[0], range[1])), xd = x(clamp(d, range[0], range[1]));
        S('rect', { class: 'pen', x: xb, y, height: Math.min(7, h * 0.3), rx: 2, width: Math.max(2, xd - xb) }, gg);
        const ink = S('rect', { class: 'ink', x: xb, y, height: Math.min(7, h * 0.3), rx: 2, width: 0 }, gg);
        const lab = `${p.name.split(' (')[0]} ${p.born ?? ''}–${p.died ?? ''}`.replace(/~/g, 'c.'), tw = lab.length * 6.4;
        // roomy: the name sits above its bar; dense: beside it, after the bar if it fits, else before it
        if (h >= 20) S('text', { x: Math.max(xb, x0) + 2, y: y - 2, text: lab }, gg);
        else if (xd + 6 + tw < x1) S('text', { x: xd + 6, y: y + 6.5, text: lab }, gg);
        else S('text', { x: xb - 6, y: y + 6.5, 'text-anchor': 'end', text: lab }, gg);
        this.cont.push((yy) => { const xn = x(clamp(Math.min(yy, d), range[0], range[1])); ink.setAttribute('width', Math.max(0, yy < b ? 0 : xn - xb)); gg.classList.toggle('alive', yy >= b && yy <= d); });
      });
    }

    // events: past inked, future pencil; labels for the ones the beat shows
    const shown = new Set([...(this.showIds || []), ...this.hlEvents, ...(this.G?.revealed && this.G.spec.event ? [this.G.spec.event] : [])]);
    // during a Rebuild the axis is bare: the events are what the learner puts back
    const evs = this.evs = this.R ? [] : this.events.filter((e) => inR(e.year) && lanes.some((l) => l.id === e.lane) && !hide.has(e.id));
    const ge = S('g', { class: 'tl-events' }, svg);
    const levels = {};
    const lvH = !mob && evs.some((e) => shown.has(e.id) && e.img) ? 62 : 22;
    const maxLv = Math.max(1, Math.floor((laneH - 24) / lvH));
    let k = 0;
    evs.forEach((e) => {
      const cx = x(e.year), cy = ly(e.lane), on = shown.has(e.id);
      const gg = S('g', { class: `tl-ev${on ? ' show' : ''}${e.seal ? ' seal' : ''}`, transform: `translate(${cx},${cy})`, tabindex: 0, role: 'button', 'aria-label': `${fy(e.year)}: ${e.label}` }, ge);
      gg.addEventListener('click', () => this.onPick?.({ type: 'event', id: e.id }));
      gg.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); this.onPick?.({ type: 'event', id: e.id }); } });
      if (!on) { gg.addEventListener('pointerenter', () => this.showTip(e, cx, cy)); gg.addEventListener('pointerleave', () => this.hideTip()); gg.addEventListener('focus', () => this.showTip(e, cx, cy)); gg.addEventListener('blur', () => this.hideTip()); }
      const dot = S('circle', { r: on ? 7.5 : 4.5 }, gg);
      S('circle', { class: 'hit', r: 13 }, gg);
      if (fresh) anim(dot, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 300, delay: Math.min(300, k++ * 12), easing: EASE_CSS.enter, fill: 'backwards' });
      if (on) {
        const w = (String(fy(e.year)).length + e.label.length + 1) * 6.9 + 8;
        const anchor = cx > x1 - w / 2 ? 'end' : cx < x0 + w / 2 ? 'start' : 'middle';
        const a = anchor === 'end' ? cx - w : anchor === 'start' ? cx : cx - w / 2, bb = a + w;
        const Lv = (levels[e.lane] ||= []);
        let lv = 0; const hit = (q) => (Lv[q] || []).some(([p, r]) => a < r + 10 && bb > p - 10);
        while (lv < maxLv && hit(lv)) lv++;
        if (lv < maxLv) {
          (Lv[lv] ||= []).push([a, bb]);
          const lift = 22 + lv * lvH;
          const lab = S('g', { class: 'labg' }, gg);
          if (e.img && !mob && spriteOf(this.C, e.img)) {
            const s = 44, sp = spriteOf(this.C, e.img);
            spriteImage(lab, defs, sp, -s / 2, -lift - s - 6, s, 'thumb');
            S('rect', { class: 'thumbframe', x: -s / 2, y: -lift - s - 6, width: s, height: s }, lab);
            S('line', { y1: -8, y2: -lift - 6, class: 'stem' }, lab);
            const t = S('text', { class: 'lab', y: -lift - s - 12, 'text-anchor': anchor }, lab);
            S('tspan', { class: 'yr', text: fy(e.year) + ' ' }, t); S('tspan', { text: e.label }, t);
          } else {
            S('line', { y1: -8, y2: -lift + 4, class: 'stem' }, lab);
            const t = S('text', { class: 'lab', y: -lift, 'text-anchor': anchor }, lab);
            S('tspan', { class: 'yr', text: fy(e.year) + ' ' }, t); S('tspan', { text: e.label }, t);
          }
          if (fresh) anim(lab, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 400, delay: 250, easing: EASE_CSS.enter, fill: 'backwards' });
        }
      }
      H.push({ y: e.year, on: (a) => { gg.classList.add('past'); if (a) anim(dot, [{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 300, easing: EASE_CSS.enter }); }, off: () => gg.classList.remove('past') });
    });

    // the edict, in its own characters (stamps in when 1842 passes)
    if (stage.edict) {
      const ex = x(1842.5), right = ex > x1 - 330;
      const t = S('text', { class: 'tl-note seal', x: right ? ex - 12 : ex + 12, 'text-anchor': right ? 'end' : 'start', y: mob ? ly(lanes[0]?.id) + 22 : laneTop + 16, lang: 'ja', text: mob ? '「…風俗ニ拘り候筋ニ付」' : '「…風俗ニ拘り候筋ニ付」 Tenpō 13, sixth month', style: `transform-origin:${ex}px ${laneTop + 10}px` }, svg);
      H.push({ y: 1842.5, on: (a) => { t.style.opacity = 1; if (a) stampIn(t); }, off: () => { t.style.opacity = 0; } });
    }
    // legend of the packing-paper story
    if (stage.legend) {
      const gg = S('g', {}, svg); const yA = laneTop + laneH * 0.5 + 34;
      S('path', { d: `M${x(1905)},${yA} C${x(1890)},${yA + 46} ${x(1870)},${yA + 46} ${x(1856)},${yA}`, fill: 'none', stroke: 'var(--ink-2)', 'stroke-dasharray': '3 4' }, gg);
      S('circle', { cx: x(1856), cy: yA, r: 6, fill: 'none', stroke: 'var(--ink-2)' }, gg);
      S('text', { class: 'tl-note', x: x(1856), y: yA - 12, 'text-anchor': 'middle', text: '1856: when the story says it happened (disputed)' }, gg);
      S('text', { class: 'tl-note', x: x(1905), y: yA + 52, 'text-anchor': 'middle', text: '1905: when it was first printed' }, gg);
    }
    // blue price (Smith): two documented figures, drawn when 1828 passes
    if (hasBP) {
      const gg = S('g', { class: 'tl-bp' }, svg); const yb = laneBot + 20, ys = scaleLinear().domain([0, 100]).range([yb + bpH - 20, yb]);
      S('text', { x: mob ? x0 + 20 : x0 - 12, y: yb + (mob ? 0 : 12), 'text-anchor': mob ? 'start' : 'end', class: 'tl-lane-lab', text: 'Blue, monme' }, gg);
      const a = [x(1824.5), ys(87)], b = [x(1828.5), ys(31)];
      const p = S('path', { d: `M${a}L${b}` }, gg);
      const c1 = S('circle', { cx: a[0], cy: a[1], r: 5 }, gg), c2 = S('circle', { cx: b[0], cy: b[1], r: 5 }, gg);
      const t1 = S('text', { x: a[0] - 8, y: a[1] + 4, 'text-anchor': 'end', text: '87 monme a kin' }, gg);
      const t2 = S('text', { x: b[0] - 8, y: b[1] + 20, 'text-anchor': 'end', text: '31 monme by 1828: Chinese imports (Smith)' }, gg);
      [c1, t1].forEach((n) => n.classList.add('later')); [p, c2, t2].forEach((n) => n.classList.add('later'));
      H.push({ y: 1824.5, on: () => { c1.classList.remove('later'); t1.classList.remove('later'); }, off: () => { c1.classList.add('later'); t1.classList.add('later'); } });
      H.push({ y: 1828.5, on: (an) => { [p, c2, t2].forEach((n) => n.classList.remove('later')); if (an) { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); anim(p, [{ strokeDasharray: `${L} ${L}`, strokeDashoffset: L }, { strokeDasharray: `${L} ${L}`, strokeDashoffset: 0 }], { duration: 600, easing: EASE_CSS.enter }); } }, off: () => [p, c2, t2].forEach((n) => n.classList.add('later')) });
    }
    // print runs: bubbles grow when the cursor passes them
    if (hasRuns) {
      const gg = S('g', { class: 'tl-runs' }, svg); const yr = bot - priceH - runsH / 2 - 6; const rs = scaleSqrt().domain([0, 408000]).range([0, mob ? 38 : 52]);
      S('text', { class: 'tl-lane-lab', x: mob ? x0 : x0 - 12, y: mob ? yr - runsH / 2 + 12 : yr + 4, 'text-anchor': mob ? 'start' : 'end', text: 'Print runs' }, gg);
      this.T.runs.filter((r) => inR(r.year)).forEach((r, i) => {
        const rr = Math.max(4, rs(r.n));
        const g2 = S('g', { class: 'tl-run', transform: `translate(${x(r.year)},${yr})` }, gg);
        const pen = S('circle', { class: 'pen', r: rr }, g2);
        const c = S('circle', { class: 'ink', r: rr }, g2);
        const t = S('text', { y: i % 2 ? rr + 16 : -rr - 6, 'text-anchor': 'middle', text: tight && mob ? r.label.split(/[,:]/)[0] : r.label + (r.conf === 'probable' && !r.label.includes('(') ? ' (probable)' : '') }, g2);
        H.push({ y: r.year, on: (a) => { g2.classList.add('on'); if (a) { anim(c, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 900, easing: EASE_CSS.enter }); anim(t, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 300, fill: 'backwards' }); } }, off: () => g2.classList.remove('on') });
      });
      // a slider guess hooked to this lane: your number as a hollow bubble, the record as a solid one
      const M = this.marks.runs;
      if (M && M.value != null) {
        const yx = x(Math.min(range[1], 2020)), gm = S('g', { class: 'tl-gmark', transform: `translate(${yx},${yr})` }, gg);
        const rv = Math.max(4, rs(Math.min(408000, M.value)));
        S('circle', { class: 'ghost', r: rv }, gm);
        S('text', { class: 'ghost', x: -rv - 8, y: M.revealed ? -4 : 4, 'text-anchor': 'end', text: `Your guess: ${Math.round(M.value).toLocaleString('en-GB')}` }, gm);
        if (M.revealed) { const rt = Math.max(4, rs(M.truth)); S('circle', { class: 'truth', r: rt }, gm); S('text', { class: 'truth', x: -rv - 8, y: 12, 'text-anchor': 'end', text: `The record: ${Math.round(M.truth).toLocaleString('en-GB')} located` }, gm); }
      }
    }
    // price lane: points ink in when passed; at 1842 the cap steps the line down to 16 mon
    if (hasPrice) {
      const gg = S('g', { class: 'tl-price' }, svg); const yp0 = bot - 6, yp1 = bot - priceH + 18, ys = scaleLinear().domain([0, 32]).range([yp0, yp1]);
      S('text', { class: 'tl-lane-lab', x: mob ? x0 + 20 : x0 - 12, y: yp1 - 16, 'text-anchor': mob ? 'start' : 'end', text: 'A sheet, mon' }, gg);
      const ax = S('g', { class: 'axis' }, gg);
      [0, 16, 24, 32].forEach((v) => { S('line', { class: 'tl-rule', x1: x0, x2: x1, y1: ys(v), y2: ys(v), 'stroke-dasharray': v ? '1 4' : null }, ax); S('text', { x: x0 - 6, y: ys(v) + 4, 'text-anchor': 'end', text: v }, ax); });
      const sx0 = x(Math.max(range[0], 1700)), sx1 = x(Math.min(range[1], 1850)), sx2 = x(Math.min(range[1], 1868));
      S('path', { class: 'soba', d: `M${sx0},${ys(16)} L${sx1},${ys(16)} L${sx1},${ys(24)} L${sx2},${ys(24)}` }, gg);
      S('text', { class: 'note', x: sx0 + 4, y: ys(16) + 15, text: 'a bowl of soba (probable)' }, gg);
      const MP = this.marks.price;
      if (MP && MP.value != null && inR(1842.9)) {
        const xa = x(1842.9), xb = x(Math.min(range[1], 1849)), yv = ys(clamp(MP.value, 0, 32));
        const gm = S('g', { class: 'tl-gmark' }, gg);
        S('line', { class: 'ghost', x1: xa - 30, x2: xb, y1: yv, y2: yv }, gm);
        S('text', { class: 'ghost', x: xb + 6, y: yv + 4, text: `Your ceiling: ${Math.round(MP.value)} mon` }, gm);
      }
      this.T.price.filter((p) => inR(p.year)).forEach((p) => {
        const cx = x(p.year);
        if (p.cap) {
          const capG = S('g', { class: 'capg' }, gg);
          const drop = S('line', { class: 'cap', x1: cx, x2: cx, y1: ys(24), y2: ys(16) }, capG);
          S('line', { class: 'cap dash', x1: cx, x2: x(Math.min(range[1], 1847)), y1: ys(16), y2: ys(16), 'stroke-dasharray': '4 3' }, capG);
          const call = S('g', { class: 'callout', style: `transform-origin:${cx + 8}px ${ys(16) + 14}px` }, capG);
          const cw = 168, cl = cx + 8 + cw > x1 ? cx - 8 - cw : cx + 8;
          S('rect', { x: cl, y: ys(16) + 4, width: cw, height: 22, rx: 3 }, call);
          S('text', { class: 'capnote', x: cl + 8, y: ys(16) + 19, text: 'The cap, 1842: 16 mon' }, call);
          capG.style.display = 'none';
          H.push({ y: p.year, on: (a) => { capG.style.display = ''; if (a) { anim(drop, [{ transform: `translateY(0) scaleY(0)`, transformOrigin: `${cx}px ${ys(24)}px` }, { transform: 'scaleY(1)', transformOrigin: `${cx}px ${ys(24)}px` }], { duration: 400, easing: EASE_CSS.enter }); stampIn(call, 300); } }, off: () => { capG.style.display = 'none'; } });
          return;
        }
        const g2 = S('g', { class: 'pp' }, gg);
        if (p.hi > p.lo) S('line', { class: 'rng', x1: cx, x2: cx, y1: ys(p.lo), y2: ys(p.hi) }, g2);
        const c = S('circle', { class: 'pt', cx, cy: ys((p.lo + p.hi) / 2), r: 5 }, g2);
        S('text', { class: 'note', x: cx > x1 - 110 ? cx - 9 : cx + 9, 'text-anchor': cx > x1 - 110 ? 'end' : 'start', y: ys(p.hi) - 6, text: `${p.lo === p.hi ? p.lo : p.lo + '–' + p.hi}${p.conf === 'probable' ? ' (probable)' : ''}` }, g2);
        H.push({ y: p.year, on: (a) => { g2.classList.add('on'); if (a) anim(c, [{ transform: 'scale(0)', transformOrigin: `${cx}px ${ys((p.lo + p.hi) / 2)}px` }, { transform: 'scale(1)', transformOrigin: `${cx}px ${ys((p.lo + p.hi) / 2)}px` }], { duration: 300, easing: EASE_CSS.enter }); }, off: () => g2.classList.remove('on') });
      });
    }
    // the scale break: a torn-paper edge where the scale compresses
    if (x.brk) {
      const gb = S('g', { class: 'tl-brkg' });
      gl.after(gb); // over the lanes' rules, under every label and mark
      const yA = top - 22, yB = bot + 4, xm = x.brk;
      const zig = (dx) => { let d = '', s = 0; for (let yy = yA; yy <= yB; yy += 7) { d += `${s ? 'L' : 'M'}${xm + dx + (s++ % 2 ? 3.2 : -3.2)},${yy} `; } return d; };
      const L = zig(-6), R = zig(6);
      const fill = L + R.split(' ').filter(Boolean).reverse().map((c) => 'L' + c.slice(1)).join(' ') + ' Z';
      S('path', { class: 'tear', d: fill }, gb);
      S('path', { class: 'tear-edge', d: L }, gb); S('path', { class: 'tear-edge', d: R }, gb);
      S('text', { class: 'tl-brk', x: xm + 10, y: bot - 2, text: mob ? '⅕ scale' : 'after 1870: ⅕ scale' }, gb);
    }
    // the guess layer and the cursor sit on top
    this.gGuess = S('g', { class: 'tl-guess' }, svg);
    const ph = this.ph = S('g', { class: 'tl-ph' }, svg);
    this.phLine = S('line', { y1: top - 26, y2: bot }, ph);
    this.phRect = S('rect', { y: top - 48, height: 24, rx: 12 }, ph);
    this.phText = S('text', { y: top - 31, 'text-anchor': 'middle' }, ph);
    if (fresh) anim(ph, [{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
    if (this.R) ph.style.display = 'none';

    // state at `now` (no animation), then the semantic list twin
    this.now = now; this.apply(now, false, true);
    this.writeList(stage, lanes, evs);
    if (this.G) this.drawGuess();
    if (this.R) this.layoutTiles();
  }

  // move every continuous thing to year y; fire `happen` items crossing it
  apply(y, animate, init) {
    const x = this.x, [a, b] = x.domain, cx = x(clamp(y, a, b));
    this.inkRect.setAttribute('width', Math.max(0, cx));
    this.penRect.setAttribute('x', cx);
    this.cont.forEach((f) => f(y));
    for (const h of this.happen) {
      const should = y >= h.y - 1e-6;
      if (should && !h.done) { h.done = true; h.on(animate && !init); }
      else if (!should && (h.done || init)) { h.done = false; h.off(); }
    }
    this.phLine.setAttribute('x1', cx); this.phLine.setAttribute('x2', cx);
    const lab = `${fy(y)}${eraOf(y) ? ' · ' + eraOf(y).split(' · ')[0] : ''}`;
    if (this.phText.textContent !== lab) this.phText.textContent = lab;
    const lw = lab.length * 7.4 + 20, { x1 } = this.geom;
    this.phRect.setAttribute('x', Math.min(cx - lw / 2, x1 - lw + 20)); this.phRect.setAttribute('width', lw);
    this.phText.setAttribute('x', Math.min(cx, x1 - lw / 2 + 20));
    this.now = y;
  }
  moveTo(year, animate) {
    const from = this.now ?? year, S2 = this.scope;
    if (!animate || from === year) { this.apply(year, false); return; }
    const dx = Math.abs(this.x(clamp(year, ...this.x.domain)) - this.x(clamp(from, ...this.x.domain)));
    const ms = clamp(dx / (this.geom.W || 1000) * 1400, 250, 900);
    S2.tween(ms, (t) => this.apply(from + (year - from) * t, true), ease.standard).then(() => { if (!S2.dead) this.apply(year, true); });
  }
  showTip(e, cx, cy) {
    this.tip.hidden = false;
    this.tip.innerHTML = `<b>${fy(e.year)}</b> ${esc(e.label)}`;
    const w = this.tip.offsetWidth;
    this.tip.style.left = `${clamp(cx - w / 2, 4, (this.geom.W || 800) - w - 4)}px`; this.tip.style.top = `${cy - 44}px`;
  }
  hideTip() { this.tip.hidden = true; }
  writeList(stage, lanes, evs) {
    const now = this.year;
    const parts = [`<h3>Timeline ${stage.range?.[0] ?? 1600}–${stage.range?.[1] ?? 2025}, now at ${fy(now)}</h3>`];
    lanes.forEach((l) => {
      const items = evs.filter((e) => e.lane === l.id);
      if (!items.length) return;
      parts.push(`<h4>${esc(l.label)}</h4><ul>${items.map((e) => `<li>${fy(e.year)}: ${esc(e.label)}${e.year > now ? ' (still to come)' : ''}</li>`).join('')}</ul>`);
    });
    if (stage.bands) parts.push(`<h4>Censor regimes</h4><ul>${this.T.bands.filter((b) => b.id !== 'none').map((b) => `<li>${b.from}–${b.to}: ${esc(b.label)}</li>`).join('')}</ul>`);
    if (stage.price) parts.push(`<h4>Price of a sheet</h4><ul>${this.T.price.map((p) => `<li>${fy(p.year)}: ${p.lo === p.hi ? p.lo : p.lo + '–' + p.hi} mon${p.cap ? ', the legal cap' : ''} (${p.conf})</li>`).join('')}</ul>`);
    if (stage.runs) parts.push(`<h4>Print runs</h4><ul>${this.T.runs.map((r) => `<li>${fy(r.year)}: ${esc(r.label)}</li>`).join('')}</ul>`);
    this.list.innerHTML = parts.join('');
  }

  // ---------------- guess: drag a marker on the axis
  guess(spec, onAnswer) {
    this.endGuess();
    const range = spec.range || this.stage?.range || [1600, 2025];
    const start = spec.start ?? Math.round((range[0] + range[1]) / 2);
    const truthEv = this.events.find((e) => e.id === spec.event);
    const G = this.G = { spec: { ...spec, range }, value: clamp(start, range[0], range[1]), committed: false, revealed: false, onAnswer,
      hideIds: this.events.filter((e) => Math.abs(e.year - spec.truth) < 0.01).map((e) => e.id) };
    const covers = this.stage && this.stage.range && this.stage.range[0] <= range[0] && this.stage.range[1] >= range[1];
    const stage = covers ? this.stage : { mode: 'time', range, lanes: truthEv ? [...new Set([truthEv.lane, ...(this.stage?.lanes || [])])].slice(0, 3) : this.stage?.lanes };
    this.sig = null;
    this.show(stage, this.year && this.year >= range[0] && this.year <= range[1] ? this.year : range[1], this.showIds || [], true);
    const handle = {
      reveal: () => this.revealGuess(),
      destroy: () => this.endGuess(true),
      commit: () => this.commitGuess(),
      get value() { return G.value; },
    };
    return handle;
  }
  drawGuess() {
    const G = this.G, g = this.geom, x = this.x; if (!G) return;
    const [a, b] = G.spec.range;
    this.gGuess.innerHTML = '';
    G.overlay?.remove();
    const ov = G.overlay = el('div', { class: 'tl-gov' }); this.ov.append(ov);
    const yTrack = g.top - 4;
    // track hint
    const track = S('line', { class: 'g-track', x1: x(a), x2: x(b), y1: yTrack, y2: yTrack }, this.gGuess);
    const mkMark = (cls, year, label, sub) => {
      const gg = S('g', { class: `g-mark ${cls}`, transform: `translate(${x(year)},0)` }, this.gGuess);
      S('line', { class: 'stem', y1: yTrack, y2: g.bot }, gg);
      S('circle', { class: 'head', cy: yTrack, r: 9 }, gg);
      const t = S('text', { class: 'g-lab', y: g.bot + (g.mob ? 14 : 18), 'text-anchor': 'middle' }, gg);
      S('tspan', { class: 'k', text: label }, t); if (sub) S('tspan', { dx: 6, text: sub }, t);
      return gg;
    };
    if (G.committed) mkMark('ghost', G.value, 'Your guess', String(fy(G.value)));
    if (G.revealed) {
      const tm = mkMark('truth', G.spec.truth, G.spec.truthLabel || String(fy(G.spec.truth)), '');
      if (G.justRevealed) { stampIn(tm); G.justRevealed = false; }
      if (G.committed && Math.abs(G.value - G.spec.truth) >= 1) {
        const xa = x(G.value), xb = x(G.spec.truth), yb = g.bot - 14;
        const br = S('g', { class: 'g-gap' }, this.gGuess);
        S('path', { d: `M${xa},${yb - 6}V${yb}H${xb}V${yb - 6}` }, br);
        const d = Math.abs(Math.round(G.spec.truth - G.value));
        S('text', { x: (xa + xb) / 2, y: yb - 6, 'text-anchor': 'middle', text: `${d} year${d === 1 ? '' : 's'} apart` }, br);
        anim(br, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: 200, fill: 'backwards' });
      }
    }
    if (!G.committed && !G.revealed) {
      // the live marker: an svg stem + an html knob (role=slider) + a commit button
      const live = S('g', { class: 'g-mark live' }, this.gGuess);
      const stem = S('line', { class: 'stem', y1: yTrack, y2: g.bot }, live);
      const knob = G.knob = el('div', { class: 'tl-knob', role: 'slider', tabindex: '0', 'aria-label': G.spec.q ? `Your guess: ${G.spec.q}` : 'Your guess on the timeline',
        'aria-valuemin': String(a), 'aria-valuemax': String(b), 'aria-describedby': 'tl-knob-help' },
        el('span', { class: 'v' }), el('span', { class: 'grip', 'aria-hidden': 'true' }));
      const help = el('span', { id: 'tl-knob-help', class: 'vh', text: 'Arrow keys move one year, Page Up and Page Down ten. Enter places your guess.' });
      const commit = el('button', { type: 'button', class: 'tl-commit' }, 'Place guess');
      commit.addEventListener('click', () => this.commitGuess());
      const zone = el('div', { class: 'tl-zone', 'aria-hidden': 'true', style: `left:${x(a) - 10}px;width:${x(b) - x(a) + 20}px;top:${yTrack - 26}px;height:${g.bot - yTrack + 26}px` });
      ov.append(zone, knob, commit, help);
      const set = (v, announce) => {
        G.value = clamp(Math.round(v), a, b);
        const px = x(G.value);
        live.setAttribute('transform', `translate(${px},0)`); stem.setAttribute('x1', 0); stem.setAttribute('x2', 0);
        knob.style.left = `${px}px`; knob.style.top = `${yTrack}px`;
        knob.querySelector('.v').textContent = fy(G.value);
        knob.setAttribute('aria-valuenow', String(G.value)); knob.setAttribute('aria-valuetext', `${fy(G.value)}${eraOf(G.value) ? ', ' + eraOf(G.value).split(' · ')[0] : ''}`);
        commit.style.left = `${clamp(px, x(a) + 50, x(b) - 50)}px`; commit.style.top = `${g.bot + (g.mob ? 4 : 8)}px`;
      };
      set(G.value);
      knob.addEventListener('keydown', (e) => {
        const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }[e.key];
        if (step) { e.preventDefault(); set(G.value + step); }
        else if (e.key === 'Home') { e.preventDefault(); set(a); }
        else if (e.key === 'End') { e.preventDefault(); set(b); }
        else if (e.key === 'Enter') { e.preventDefault(); this.commitGuess(); }
      });
      const drag = (e) => { const R = this.full.getBoundingClientRect(); set(x.invert(e.clientX - R.left)); };
      const down = (e) => {
        if (e.button > 0) return;
        e.preventDefault(); knob.focus({ preventScroll: true }); knob.classList.add('drag');
        drag(e);
        const mv = (ev) => drag(ev), up = () => { knob.classList.remove('drag'); removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); };
        addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up);
      };
      knob.addEventListener('pointerdown', down); zone.addEventListener('pointerdown', down);
      if (G.firstDraw !== false) { G.firstDraw = false; anim(knob, [{ transform: 'translate(-50%,-50%) scale(.6)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }], { duration: 300, easing: EASE_CSS.enter }); }
    }
  }
  commitGuess() {
    const G = this.G; if (!G || G.committed || G.revealed) return;
    G.committed = true;
    const delta = G.value - G.spec.truth;
    this.live.textContent = `Your guess: ${fy(G.value)}.`;
    this.drawGuess();
    G.onAnswer?.(G.value, { type: 'timeline', value: G.value, truth: G.spec.truth, delta, close: Math.abs(delta) <= (G.spec.close ?? 5) });
  }
  revealGuess() {
    const G = this.G; if (!G || G.revealed) return;
    G.revealed = true; G.justRevealed = true;
    const t = G.spec.truthLabel || fy(G.spec.truth);
    this.live.textContent = G.committed ? `Your guess ${fy(G.value)}. What happened: ${t}.` : `What happened: ${t}.`;
    const keep = this.now;
    this.sig = null; this.show(this.stage, this.year, this.showIds, true); this.apply(keep, false);
  }
  endGuess(redraw) {
    const G = this.G; if (!G) return;
    G.overlay?.remove(); this.gGuess && (this.gGuess.innerHTML = '');
    this.G = null;
    if (redraw && this.stage) { this.sig = null; this.show(this.stage, this.year, this.showIds, true); }
  }

  // a slider guess hooked to a lane (price, runs): ghost = your value; on reveal the record sits beside it
  markGuess({ hook, value, truth, ghost = true } = {}) {
    if (!hook) return;
    this.marks[hook] = { value, truth, revealed: !ghost };
    if (this.stage && (this.stage.price || this.stage.runs)) { const keep = this.now; this.sig = null; this.show(this.stage, this.year, this.showIds, true); this.apply(keep ?? this.year, false); }
  }

  // ---------------- rebuild: drag tiles back onto the axis
  placeTiles(tiles, onDrop, opts = {}) {
    this.endTiles();
    const ys = tiles.map((t) => t.year).filter((v) => v != null);
    let range = opts.range;
    if (!range) { const a = Math.min(...ys), b = Math.max(...ys), p = Math.max(5, (b - a) * 0.08); range = [Math.floor(a - p), Math.ceil(b + p)]; }
    const span = range[1] - range[0];
    const R = this.R = { tiles: tiles.map((t) => ({ ...t, placed: false, tries: 0 })), onDrop, range, tol: opts.tolerance ?? Math.max(2, Math.round(span * 0.03)), carry: null };
    R.tray = el('div', { class: 'tl-tray', role: 'list', 'aria-label': 'Events to put back on the timeline' });
    R.pins = el('div', { class: 'tl-pins' });
    R.say = el('div', { class: 'tl-say', 'aria-live': 'polite' });
    R.tiles.forEach((t) => { t.node = this.tileNode(t); R.tray.append(el('div', { role: 'listitem' }, t.node)); });
    const covers = this.stage && this.stage.range && this.stage.range[0] <= range[0] && this.stage.range[1] >= range[1];
    const stage = covers ? this.stage : { mode: 'time', range, lanes: this.stage?.lanes || ['state', 'trade', 'print'] };
    this.ov.append(R.pins, R.tray, R.say);
    this.sig = null;
    this.show(stage, this.year ?? range[1], this.showIds || [], true);
    return { reveal: () => this.revealTiles(), destroy: () => this.endTiles(true) };
  }
  tileNode(t) {
    const b = el('button', { type: 'button', class: 'tl-tile', 'aria-describedby': 'tl-tile-help', 'data-id': t.id },
      thumb(this.C, t.img, 34, 34, { fy: 0.2, cls: 'cc-thumb' }) || el('span', { class: 'tl-tile-dot', 'aria-hidden': 'true' }),
      el('span', { class: 'lab', text: t.label }),
      t.from ? el('span', { class: 'from', text: t.from }) : null);
    if (!document.getElementById('tl-tile-help')) this.ov.append(el('span', { id: 'tl-tile-help', class: 'vh', text: 'Drag onto the timeline, or press Enter, choose a year with the arrow keys, and press Enter again.' }));
    b.addEventListener('pointerdown', (e) => this.dragTile(t, e));
    b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.carryTile(t); } });
    return b;
  }
  layoutTiles() {
    const R = this.R, g = this.geom, x = this.x; if (!R) return;
    R.tray.style.top = `${g.bot + 28}px`; R.tray.style.left = `${g.x0 - (g.mob ? 50 : 90)}px`; R.tray.style.right = `${g.W - g.x1 - 8}px`;
    R.say.style.left = `${g.x0}px`; R.say.style.top = `${g.bot + 4}px`;
    // placed pins sit in a band under the axis labels, stacked to avoid overlap
    const placed = R.tiles.filter((t) => t.placed).sort((a, b) => a.year - b.year);
    const rows = [];
    placed.forEach((t) => {
      const px = x(t.year), w = Math.min(190, 52 + t.label.length * 6.6);
      let r = 0; while ((rows[r] || []).some(([p, q]) => px - w / 2 < q + 6 && px + w / 2 > p - 6)) r++;
      (rows[r] ||= []).push([px - w / 2, px + w / 2]);
      if (!t.pin) {
        t.pin = el('button', { type: 'button', class: 'tl-pin', 'aria-label': `${t.label}, ${fy(t.year)}` }, el('b', { text: fy(t.year) }), el('span', { text: t.label }));
        t.pin.addEventListener('click', () => { if (t.hint) R.say.textContent = `${fy(t.year)}: ${t.label}.`; });
        R.pins.append(t.pin);
      }
      const rr = Math.min(r, 2), pinTop = g.top - (g.mob ? 46 : 52) - rr * (g.mob ? 20 : 25);
      Object.assign(t.pin.style, { left: `${px}px`, top: `${pinTop}px`, maxWidth: `${w}px`, zIndex: 10 - r });
      t.pin.style.setProperty('--stem', `${Math.max(6, g.top - 4 - pinTop - (g.mob ? 20 : 23))}px`);
      t.pin.classList.toggle('lv1', r > 0);
    });
    // the axis guide shown while carrying a tile
    if (R.carry) this.drawCarry();
  }
  dropAt(t, year, fromRect) {
    const R = this.R; if (!R || t.placed) return;
    t.tries++;
    const ok = Math.abs(year - t.year) <= R.tol;
    R.onDrop?.({ id: t.id, value: Math.round(year), truth: t.year, ok, tries: t.tries });
    if (ok) {
      t.placed = true;
      const from = fromRect || t.node.getBoundingClientRect();
      t.node.parentElement.remove();
      this.layoutTiles();
      const to = t.pin.getBoundingClientRect();
      anim(t.pin, [{ transform: `translate(calc(-50% + ${from.left + from.width / 2 - to.left - to.width / 2}px), ${from.top - to.top}px) scale(1.05)`, opacity: 0.7 }, { transform: 'translate(-50%, 0) scale(1)', opacity: 1 }], { duration: 400, easing: EASE_CSS.enter });
      R.say.textContent = `${t.label}: ${fy(t.year)}.`;
      if (R.tiles.every((q) => q.placed)) { R.say.textContent = 'Every event is back on the timeline.'; R.onDrop?.({ done: true }); }
      return true;
    }
    // informational: where you put it, and which way to look
    const dir = year < t.year ? 'later' : 'earlier';
    R.say.textContent = `Not at ${fy(year)}: look ${dir}.${t.hint ? ' ' + t.hint : ''}`;
    const x = this.x, g = this.geom;
    const gh = S('g', { class: 'g-mark ghost brief', transform: `translate(${x(clamp(year, ...x.domain))},0)` }, this.svg);
    S('line', { class: 'stem', y1: g.top - 4, y2: g.bot }, gh); S('circle', { class: 'head', cy: g.top - 4, r: 7 }, gh);
    setTimeout(() => { anim(gh, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 }); setTimeout(() => gh.remove(), motion.reduced ? 0 : 400); }, 1400);
    return false;
  }
  dragTile(t, e) {
    if (e.button > 0 || t.placed) return;
    const node = t.node, R0 = node.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY; let moved = false, last = e;
    const g = this.geom, box = () => this.full.getBoundingClientRect();
    const guide = el('div', { class: 'tl-guide', hidden: true }, el('span'));
    this.ov.append(guide);
    const mv = (ev) => {
      last = ev;
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 5) return;
      if (!moved) { moved = true; node.classList.add('drag'); node.setPointerCapture?.(e.pointerId); }
      node.style.transform = `translate(${dx}px, ${dy}px) rotate(${clamp(dx / 60, -3, 3)}deg)`;
      const B = box(), px = ev.clientX - B.left, py = ev.clientY - B.top;
      const inPlot = px >= g.x0 - 10 && px <= g.x1 + 10 && py >= g.top - 60 && py <= g.bot + 10;
      guide.hidden = !inPlot;
      if (inPlot) { const yv = clamp(Math.round(this.x.invert(px)), ...this.x.domain); guide.style.left = `${this.x(yv)}px`; guide.style.top = `${g.top - 12}px`; guide.style.height = `${g.bot - g.top + 12}px`; guide.firstChild.textContent = yv; }
    };
    const up = () => {
      removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
      guide.remove(); node.classList.remove('drag');
      if (!moved) { this.carryTile(t); return; }
      const B = box(), px = last.clientX - B.left, py = last.clientY - B.top;
      const inPlot = px >= g.x0 - 10 && px <= g.x1 + 10 && py >= g.top - 60 && py <= g.bot + 10;
      const rect = node.getBoundingClientRect();
      if (inPlot && this.dropAt(t, clamp(this.x.invert(px), ...this.x.domain), rect)) return;
      const m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(node.style.transform || '');
      springBack(node, m ? +m[1] : 0, m ? +m[2] : 0);
    };
    addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  }
  // keyboard (and tap) alternative: pick the tile up, choose a year on the axis, press Enter
  carryTile(t) {
    const R = this.R; if (!R || t.placed) return;
    if (R.carry) this.dropCarry(false);
    const [a, b] = this.x.domain;
    R.carry = { t, value: Math.round(R.lastYear ?? (a + b) / 2) };
    t.node.classList.add('carry'); t.node.setAttribute('aria-pressed', 'true');
    this.drawCarry(true);
    R.say.textContent = `Carrying “${t.label}”. Choose a year with the arrow keys or tap the timeline, then press Enter or Place.`;
  }
  drawCarry(focus) {
    const R = this.R, C2 = R.carry, g = this.geom, x = this.x; if (!C2) return;
    const [a, b] = x.domain;
    if (!C2.knob) {
      C2.knob = el('div', { class: 'tl-knob carry', role: 'slider', tabindex: '0', 'aria-label': `Year for: ${C2.t.label}`, 'aria-valuemin': String(a), 'aria-valuemax': String(b) }, el('span', { class: 'v' }), el('span', { class: 'grip', 'aria-hidden': 'true' }));
      C2.ok = el('button', { type: 'button', class: 'tl-commit' }, 'Place');
      C2.cancel = el('button', { type: 'button', class: 'tl-commit ghost' }, 'Cancel');
      C2.zone = el('div', { class: 'tl-zone', 'aria-hidden': 'true' });
      C2.stem = el('div', { class: 'tl-carry-stem', 'aria-hidden': 'true' });
      this.ov.append(C2.zone, C2.stem, C2.knob, C2.ok, C2.cancel);
      C2.ok.addEventListener('click', () => this.dropCarry(true));
      C2.cancel.addEventListener('click', () => this.dropCarry(false));
      C2.knob.addEventListener('keydown', (e) => {
        const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }[e.key];
        if (step) { e.preventDefault(); C2.set(C2.value + step); }
        else if (e.key === 'Home') { e.preventDefault(); C2.set(a); }
        else if (e.key === 'End') { e.preventDefault(); C2.set(b); }
        else if (e.key === 'Enter') { e.preventDefault(); this.dropCarry(true); }
        else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); this.dropCarry(false); }
      });
      const drag = (e) => { const B = this.full.getBoundingClientRect(); C2.set(x.invert(e.clientX - B.left)); };
      const down = (e) => { e.preventDefault(); C2.knob.focus({ preventScroll: true }); drag(e); const mv = (ev) => drag(ev), up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); }; addEventListener('pointermove', mv); addEventListener('pointerup', up); };
      C2.knob.addEventListener('pointerdown', down); C2.zone.addEventListener('pointerdown', down);
    }
    const yT = g.top - 4;
    Object.assign(C2.zone.style, { left: `${x(a) - 10}px`, width: `${x(b) - x(a) + 20}px`, top: `${yT - 26}px`, height: `${g.bot - yT + 26}px` });
    C2.set = (v) => {
      C2.value = clamp(Math.round(v), a, b); const px = x(C2.value);
      C2.knob.style.left = `${px}px`; C2.knob.style.top = `${yT}px`; C2.knob.querySelector('.v').textContent = C2.value;
      C2.knob.setAttribute('aria-valuenow', String(C2.value)); C2.knob.setAttribute('aria-valuetext', String(C2.value));
      Object.assign(C2.stem.style, { left: `${px}px`, top: `${yT}px`, height: `${g.bot - yT}px` });
      C2.ok.style.left = `${clamp(px, x(a) + 40, x(b) - 90)}px`; C2.ok.style.top = `${g.top + 10}px`;
      C2.cancel.style.left = `${clamp(px, x(a) + 40, x(b) - 90) + 78}px`; C2.cancel.style.top = `${g.top + 10}px`;
    };
    C2.set(C2.value);
    if (focus) C2.knob.focus({ preventScroll: true });
  }
  dropCarry(place) {
    const R = this.R, C2 = R?.carry; if (!C2) return;
    R.carry = null; R.lastYear = C2.value;
    [C2.knob, C2.ok, C2.cancel, C2.zone, C2.stem].forEach((n) => n.remove());
    C2.t.node.classList.remove('carry'); C2.t.node.removeAttribute('aria-pressed');
    if (place) {
      const ok = this.dropAt(C2.t, C2.value);
      if (ok) { const nx = R.tiles.find((q) => !q.placed); (nx?.node || R.say).focus?.({ preventScroll: true }); return; }
    } else R.say.textContent = 'Put down.';
    C2.t.node.focus({ preventScroll: true });
  }
  revealTiles() {
    const R = this.R; if (!R) return;
    if (R.carry) this.dropCarry(false);
    R.tiles.filter((t) => !t.placed).forEach((t, i) => { t.placed = true; t.node.parentElement?.remove(); });
    this.layoutTiles();
    R.tiles.forEach((t, i) => t.pin && stampIn(t.pin, i * 50));
    R.say.textContent = 'Here is where each one belongs.';
  }
  endTiles(redraw) {
    const R = this.R; if (!R) return;
    if (R.carry) this.dropCarry(false);
    [R.tray, R.pins, R.say].forEach((n) => n.remove());
    this.R = null;
    if (redraw && this.stage) { this.sig = null; this.show(this.stage, this.year, this.showIds, true); }
  }

  // ---------------- mini
  setYear(y, show = []) { this.year = y; this.miniShow = new Set(show); this.drawMini(); }
  highlightBand(id) { this.hlBand = id; this.drawMini(); if (this.stage && this.full.classList.contains('on')) { this.sig = null; this.show(this.stage, this.year, this.showIds, true); } }
  highlightEvents(ids) { this.hlEvents = new Set(ids || []); this.drawMini(); }
  drawMini() {
    const W = this.mini.clientWidth || innerWidth; const mob = innerWidth <= 820;
    const left = mob ? 10 : Math.min(innerWidth * 0.34, 540) + Math.max(20, innerWidth * 0.04) + 36, right = W - (mob ? 10 : 28);
    if (right - left < 60) return;
    const x = this.xscale([1600, 2026], left, right);
    const s = this.msvg; s.innerHTML = '';
    const y0 = 16, h = 14;
    const seg = S('g', { class: 'seg' }, s);
    S('rect', { x: left, y: y0, width: x.brk - 9 - left, height: h, rx: 3 }, seg); S('rect', { x: x.brk + 9, y: y0, width: right - x.brk - 9, height: h, rx: 3 }, seg);
    for (const b of this.T.bands.filter((q) => q.id !== 'none')) S('rect', { x: x(b.from), y: y0, width: x(Math.min(b.to, 1876)) - x(b.from), height: h }, S('g', { class: `band${this.hlBand === b.id ? ' hl' : ''}` }, s));
    const show = new Set([...(this.miniShow || []), ...this.hlEvents]);
    for (const e of this.events) S('circle', { class: 'ev' + (show.has(e.id) ? ' show' : '') + (e.year <= this.year ? ' past' : ''), cx: x(e.year), cy: y0 + h / 2, r: show.has(e.id) ? 4 : 1.6 }, s);
    for (const t of [1600, 1700, 1800, 1870, 1950, 2024]) S('text', { x: x(t), y: y0 + h + 13, 'text-anchor': 'middle', text: t }, s);
    const px = x(Math.min(this.year, 2025.9));
    const ph = S('g', { class: 'ph' }, s); S('line', { x1: px, x2: px, y1: y0 - 6, y2: y0 + h + 4 }, ph); S('circle', { cx: px, cy: y0 - 6, r: 3.5 }, ph);
  }
  describe(stage, year) {
    const parts = [`A timeline from ${stage.range?.[0] ?? 1600} to ${stage.range?.[1] ?? 2025}, at ${fy(year)}`];
    if (stage.price) parts.push('with the price of a sheet in mon');
    if (stage.bands) parts.push('with the censor regimes as bands');
    if (stage.lifespans) parts.push('with the lives of ' + stage.lifespans.map((id) => this.C.people[id]?.name).filter(Boolean).join(', '));
    return parts.join(', ') + '. The list of events follows.';
  }
}

// Objects at deep zoom (OpenSeadragon, BSD-3). Marks are anchored to image coordinates (fractions of width and height).
// Adds a loupe (2.5× circular magnifier following pointer or focus) and tap guesses on the marks of the shown preset.
import OpenSeadragon from 'openseadragon';
import { el, esc, motion, imgUrl, provenance } from './util.js';
import { EASE_CSS } from './cards.js';

// marks: x, y, w, h as fractions of the image's width and height; seal = the state's mark
export const MARKS = {
  keyblock: [
    { x: .026, y: .9, w: .09, h: .08, label: 'Corner registration mark', sub: 'kagi kentō: the L-shaped stop', side: 'right' },
    { x: .668, y: .918, w: .094, h: .058, label: 'Straight registration mark', sub: 'hikitsuke kentō', side: 'left' },
    { x: .16, y: .212, w: .034, h: .11, label: 'Publisher: 版元 和國堂製', sub: 'the publisher’s name is cut into the block', side: 'left' },
    { x: .679, y: .594, w: .05, h: .145, label: 'Designer: 貞秀画', sub: 'Sadahide’s signature', side: 'right' },
  ],
  'utamaro-seals': [
    { x: .066, y: .16, w: .054, h: .07, label: 'Signature: 歌麿画', sub: 'drawn by Utamaro', side: 'right' },
    { x: .068, y: .224, w: .048, h: .033, label: 'Censor’s seal: 極 kiwame', sub: '“examined”, required from 1790', side: 'right', seal: true },
    { x: .064, y: .254, w: .056, h: .035, label: 'Publisher: Tsutaya’s ivy leaf under Fuji', sub: '', side: 'right' },
    { x: .163, y: .032, w: .054, h: .275, label: 'Series: 婦人相學十躰', sub: 'Ten Aspects of the Physiognomy of Women', side: 'right', at: 'top' },
  ],
  'wave-blues': [
    { x: .20, y: .16, w: .17, h: .30, label: 'Dark stripes', sub: 'Prussian blue mixed with indigo', side: 'left' },
    { x: .37, y: .43, w: .09, h: .22, label: 'The hollow', sub: 'pure Prussian blue, printed twice', side: 'right' },
  ],
};

const ZOOM = 2.5, LOUPE = 200;

export class Viewer {
  constructor(root, C) {
    this.root = root; this.C = C;
    root.classList.add('viewer-root');
    this.box = el('div', { class: 'osd' }); this.cap = el('div', { class: 'obj-cap' });
    this.ctl = el('div', { class: 'obj-ctl' },
      this.bInspect = el('button', { type: 'button', 'aria-pressed': 'false', onclick: () => this.setInspect(!this.inspect) }, 'Inspect'),
      this.bLoupe = el('button', { type: 'button', class: 'loupe-btn', 'aria-pressed': 'false', title: 'A 2.5× magnifier that follows the pointer', onclick: () => this.setLoupe(!this.loupeOn) },
        el('span', { class: 'ico', 'aria-hidden': 'true', html: '<svg viewBox="0 0 20 20" width="16" height="16"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12.6 12.6l4.6 4.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' }), el('span', { text: 'Loupe' })),
      el('button', { type: 'button', 'aria-label': 'Zoom in', onclick: () => this.osd?.viewport.zoomBy(1.5) }, '+'),
      el('button', { type: 'button', 'aria-label': 'Zoom out', onclick: () => this.osd?.viewport.zoomBy(1 / 1.5) }, '−'),
      el('button', { type: 'button', 'aria-label': 'Fit the whole sheet', onclick: () => this.osd?.viewport.goHome() }, 'Whole sheet'));
    this.loupe = el('div', { class: 'loupe', hidden: true, 'aria-hidden': 'true' });
    this.live = el('p', { class: 'vh', 'aria-live': 'polite' });
    root.append(this.box, this.ctl, this.cap, this.loupe, this.live);
    this.osd = OpenSeadragon({ element: this.box, showNavigationControl: false, animationTime: 1.1, springStiffness: 7, visibilityRatio: 0.6,
      gestureSettingsMouse: { scrollToZoom: false, clickToZoom: false }, gestureSettingsTouch: { pinchToZoom: true, flickEnabled: false },
      mouseNavEnabled: false, crossOriginPolicy: false, preserveImageSizeOnResize: true, background: 'transparent' });
    this.inspect = false; this.loupeOn = false; this.G = null;
    // the loupe follows the pointer over the sheet, or the focused mark
    this.box.addEventListener('pointermove', (e) => { if (this.loupeOn) { const R = this.root.getBoundingClientRect(); this.moveLoupe(e.clientX - R.left, e.clientY - R.top); } });
    this.box.addEventListener('pointerleave', (e) => { if (this.loupeOn && e.pointerType === 'mouse') this.loupe.hidden = true; });
    this.box.addEventListener('keydown', (e) => {
      if (!this.loupeOn) return;
      const d = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }[e.key];
      if (d) { e.preventDefault(); const p = this.lp || [this.root.clientWidth / 2, this.root.clientHeight / 2]; this.moveLoupe(p[0] + d[0], p[1] + d[1]); }
    });
    this.osd.addHandler('animation', () => { if (this.loupeOn && this.lp && !this.loupe.hidden) this.moveLoupe(...this.lp); });
  }
  setInspect(on) { this.inspect = on; this.osd.setMouseNavEnabled(on && !this.loupeOn); this.bInspect.setAttribute('aria-pressed', String(on)); this.box.style.cursor = on ? 'grab' : ''; }
  setLoupe(on) {
    this.loupeOn = on; this.bLoupe.setAttribute('aria-pressed', String(on));
    this.root.classList.toggle('loupe-on', on);
    this.box.tabIndex = on ? 0 : -1;
    this.box.setAttribute('aria-label', on ? 'The sheet under the loupe. Arrow keys move the loupe.' : '');
    if (on) {
      this.osd.setMouseNavEnabled(false);
      this.loupe.style.backgroundImage = `url(${imgUrl(this.current)})`;
      this.live.textContent = `Loupe on: ${ZOOM}× magnifier.`;
      const p = this.lp || [this.root.clientWidth * 0.62, this.root.clientHeight * 0.5];
      this.moveLoupe(p[0], p[1]);
      if (!motion.reduced) this.loupe.animate([{ transform: 'translate(-50%,-50%) scale(.85)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }], { duration: 200, easing: EASE_CSS.enter });
    } else { this.loupe.hidden = true; this.live.textContent = 'Loupe off.'; this.osd.setMouseNavEnabled(this.inspect); }
  }
  moveLoupe(x, y) {
    this.lp = [x, y];
    const item = this.osd.world.getItemAt(0); if (!item) return;
    const Rr = this.root.getBoundingClientRect(), Rb = this.box.getBoundingClientRect();
    const pt = this.osd.viewport.viewerElementToImageCoordinates(new OpenSeadragon.Point(x - (Rb.left - Rr.left), y - (Rb.top - Rr.top)));
    const size = item.getContentSize();
    if (pt.x < -40 || pt.y < -40 || pt.x > size.x + 40 || pt.y > size.y + 40) { this.loupe.hidden = true; return; }
    const z = this.osd.viewport.viewportToImageZoom(this.osd.viewport.getZoom(true)) * ZOOM;
    const half = (innerWidth <= 820 ? 150 : LOUPE) / 2;
    Object.assign(this.loupe.style, { left: `${x}px`, top: `${y}px`, backgroundSize: `${size.x * z}px ${size.y * z}px`, backgroundPosition: `${half - pt.x * z}px ${half - pt.y * z}px` });
    this.loupe.hidden = false;
  }
  focusRect() {
    const W = this.root.clientWidth, H = this.root.clientHeight, mob = innerWidth <= 820;
    const left = mob ? 8 : Math.min(W * 0.34, 540) + Math.max(20, W * 0.04) + 36;
    return { x0: left, y0: (mob ? 50 : 56) + 12, x1: W - (mob ? 8 : 24), y1: H - (mob ? 44 : 62) - 12 - (this.G ? (mob ? 54 : 70) : 0), W, H };
  }
  show(stage) {
    const id = stage.img, meta = this.C.images[id] || {};
    const full = !!stage.full;
    this.stage = stage;
    this.cap.innerHTML = `<b>${esc(meta.maker || '')}</b>${meta.maker ? ' · ' : ''}${provenance({ ...meta, maker: '' })}`;
    const ar = meta.h && meta.w ? meta.h / meta.w : 0.7;
    this.ar = ar;
    const go = () => {
      const vp = this.osd.viewport; const [rx, ry, rw, rh] = stage.region || [0, 0, 1, 1];
      const f = full ? { x0: 0, y0: 0, x1: this.root.clientWidth, y1: this.root.clientHeight, W: this.root.clientWidth, H: this.root.clientHeight } : this.focusRect();
      const fx = (f.x1 - f.x0) / f.W, fy = (f.y1 - f.y0) / f.H;
      const bw = rw / fx, bh = (rh * ar) / fy;
      const W = Math.max(bw, bh * f.W / f.H), Hh = W * f.H / f.W;
      const cx = rx + rw / 2, cy = (ry + rh / 2) * ar;
      const fcx = (f.x0 + f.x1) / 2 / f.W, fcy = (f.y0 + f.y1) / 2 / f.H;
      vp.fitBounds(new OpenSeadragon.Rect(cx - fcx * W, cy - fcy * Hh, W, Hh), motion.reduced);
      if (this.G) this.drawGuess(); else this.drawMarks(stage, ar);
    };
    if (this.current !== id) {
      this.current = id; this.osd.clearOverlays();
      this.osd.open({ type: 'image', url: imgUrl(id) });
      this.osd.addOnceHandler('open', go);
      if (this.loupeOn) this.loupe.style.backgroundImage = `url(${imgUrl(id)})`;
    } else go();
    this.setInspect(false);
  }
  drawMarks(stage, ar) {
    this.osd.clearOverlays();
    const marks = typeof stage.marks === 'string' ? MARKS[stage.marks] : stage.marks;
    if (!marks) return;
    marks.forEach((m, i) => {
      const d = el('div', { class: 'mark' + (m.seal ? ' seal' : '') },
        el('span', { class: 'marklab' + (m.side === 'left' ? ' left' : '') + (m.at === 'top' ? ' top' : ''), html: `${esc(m.label)}${m.sub ? `<small>${esc(m.sub)}</small>` : ''}` }));
      this.osd.addOverlay({ element: d, location: new OpenSeadragon.Rect(m.x, m.y * ar, m.w, m.h * ar) });
      if (!motion.reduced) d.animate(m.seal ? [{ opacity: 0, transform: 'scale(1.06)' }, { opacity: 1, transform: 'scale(1)' }] : [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
        { duration: m.seal ? 200 : 400, delay: 600 + i * 60, easing: m.seal ? EASE_CSS.standard : EASE_CSS.enter, fill: 'backwards' });
    });
  }

  // ---------------- tap guess: the marks of the shown preset become tappable
  guessTap(spec, onAnswer, opts = {}) {
    this.endGuess();
    const marks = typeof spec.marks === 'string' ? MARKS[spec.marks] : spec.marks || (typeof this.stage?.marks === 'string' ? MARKS[this.stage.marks] : this.stage?.marks) || [];
    const truth = [].concat(spec.truth ?? []);
    const G = this.G = { spec, marks, truth, sel: new Set(), committed: false, revealed: false, onAnswer };
    // a compact Done bar; the full chip list only when the host has none of its own
    G.panel = el('div', { class: `vt-panel${opts.list ? '' : ' compact'}`, role: 'group', 'aria-label': spec.q || 'Choose the marks' },
      el('span', { class: 'cc-kick', text: opts.list ? 'Tap the marks on the sheet, or choose here' : 'Tap the marks on the sheet, then Done' }),
      G.list = el('div', { class: 'vt-list', hidden: !opts.list }),
      G.done = el('button', { type: 'button', class: 'vt-done', onclick: () => this.commitTap() }, 'Done'));
    this.root.append(G.panel);
    if (this.osd.world.getItemAt(0)) this.show(this.stage); else this.osd.addOnceHandler('open', () => this.drawGuess());
    this.drawGuess(true);
    return { reveal: () => this.revealTap(), destroy: () => this.endGuess(true), commit: () => this.commitTap(), get value() { return [...G.sel]; } };
  }
  toggle(i) {
    const G = this.G; if (!G || G.committed || G.revealed) return;
    G.sel.has(i) ? G.sel.delete(i) : G.sel.add(i);
    this.live.textContent = `${G.marks[i].label}: ${G.sel.has(i) ? 'chosen' : 'not chosen'}. ${G.sel.size} chosen.`;
    this.drawGuess();
  }
  commitTap() {
    const G = this.G; if (!G || G.committed || G.revealed) return;
    G.committed = true;
    const sel = [...G.sel].sort((a, b) => a - b);
    const hits = sel.filter((i) => G.truth.includes(i)).length;
    const ok = hits === G.truth.length && sel.length === G.truth.length;
    this.live.textContent = `You chose ${sel.length ? sel.map((i) => G.marks[i].label).join('; ') : 'nothing'}.`;
    this.drawGuess();
    G.onAnswer?.(sel, { type: 'tap', value: sel, truth: G.truth, ok, hits, extra: sel.length - hits });
  }
  revealTap() {
    const G = this.G; if (!G || G.revealed) return;
    G.revealed = true; G.justRevealed = true;
    this.live.textContent = `What happened: ${G.truth.map((i) => G.marks[i]?.label).join('; ')}.`;
    this.drawGuess();
  }
  drawGuess(first) {
    const G = this.G; if (!G) return;
    const ar = this.ar || 0.7;
    if (this.osd.world.getItemAt(0)) this.osd.clearOverlays();
    G.list.innerHTML = '';
    G.marks.forEach((m, i) => {
      const mine = G.sel.has(i), tru = G.revealed && G.truth.includes(i), locked = G.committed || G.revealed;
      const state = `${mine ? ' mine' : ''}${tru ? ' truth' : ''}${locked && !mine && !tru ? ' dim' : ''}`;
      const lab = `${m.label}${mine ? ', your pick' : ''}${tru ? ', what happened' : ''}`;
      // on the sheet
      if (this.osd.world.getItemAt(0)) {
        const b = el('button', { type: 'button', class: `vt-mark${state}`, 'aria-pressed': String(mine), 'aria-label': lab, disabled: locked ? '' : null },
          el('span', { class: 'vt-lab' + (m.side === 'left' ? ' left' : '') + (m.at === 'top' ? ' top' : ''), 'aria-hidden': 'true' }, m.label.split(':')[0],
            mine ? el('em', { text: 'your pick' }) : null, tru ? el('em', { class: 'ink', text: 'what happened' }) : null));
        b.addEventListener('pointerdown', (e) => e.stopPropagation());
        b.addEventListener('click', (e) => { e.stopPropagation(); this.toggle(i); this.focusMark(i); });
        b.addEventListener('focus', () => { if (this.loupeOn) { const r = b.getBoundingClientRect(), R = this.root.getBoundingClientRect(); this.moveLoupe(r.left - R.left + r.width / 2, r.top - R.top + r.height / 2); } });
        b.dataset.i = i;
        this.osd.addOverlay({ element: b, location: new OpenSeadragon.Rect(m.x, m.y * ar, m.w, m.h * ar) });
        if (first && !motion.reduced) b.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: i * 50, fill: 'backwards' });
        if (tru && G.justRevealed && !motion.reduced) b.animate([{ transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 200, easing: EASE_CSS.standard });
      }
      // the keyboard list
      G.list.append(el('button', { type: 'button', class: `vt-opt${state}`, 'aria-pressed': String(mine), disabled: locked ? '' : null, 'data-i': i, onclick: () => this.toggle(i) },
        el('span', { class: 'mk', 'aria-hidden': 'true' }), el('span', { text: m.label }),
        mine ? el('span', { class: 'tag', text: 'your pick' }) : null, tru ? el('span', { class: 'tag ink', text: 'what happened' }) : null));
    });
    G.done.disabled = G.committed || G.revealed;
    G.done.textContent = G.committed || G.revealed ? (G.revealed ? 'Revealed' : 'Chosen') : `Done${G.sel.size ? ` (${G.sel.size})` : ''}`;
    G.justRevealed = false;
  }
  focusMark(i) { const n = this.G?.list.querySelector(`[data-i="${i}"]`); if (n && document.activeElement?.closest?.('.vt-panel')) n.focus(); }
  endGuess(redraw) {
    const G = this.G; if (!G) return;
    G.panel.remove(); this.G = null;
    if (redraw && this.stage) this.drawMarks(this.stage, this.ar || 0.7);
  }
  describe(stage) { const m = this.C.images[stage.img] || {}; return `${m.maker || ''}, ${m.title || ''}${m.date ? ', ' + m.date : ''}. ${m.holder || ''}.`; }
}

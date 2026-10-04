// Objects at deep zoom (OpenSeadragon, BSD-3). Marks are anchored to image coordinates (fractions of width and height).
import OpenSeadragon from 'openseadragon';
import { el, esc, motion, imgUrl, provenance } from './util.js';

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

export class Viewer {
  constructor(root, C) {
    this.root = root; this.C = C;
    this.box = el('div', { class: 'osd' }); this.cap = el('div', { class: 'obj-cap' });
    this.ctl = el('div', { class: 'obj-ctl' },
      this.bInspect = el('button', { 'aria-pressed': 'false', onclick: () => this.setInspect(!this.inspect) }, 'Inspect'),
      el('button', { 'aria-label': 'Zoom in', onclick: () => this.osd?.viewport.zoomBy(1.5) }, '+'),
      el('button', { 'aria-label': 'Zoom out', onclick: () => this.osd?.viewport.zoomBy(1 / 1.5) }, '−'),
      el('button', { 'aria-label': 'Fit the whole sheet', onclick: () => this.osd?.viewport.goHome() }, 'Whole sheet'));
    root.append(this.box, this.ctl, this.cap);
    this.osd = OpenSeadragon({ element: this.box, showNavigationControl: false, animationTime: 1.1, springStiffness: 7, visibilityRatio: 0.6,
      gestureSettingsMouse: { scrollToZoom: false, clickToZoom: false }, gestureSettingsTouch: { pinchToZoom: true, flickEnabled: false },
      mouseNavEnabled: false, crossOriginPolicy: false, preserveImageSizeOnResize: true, background: 'transparent' });
    this.inspect = false;
  }
  setInspect(on) { this.inspect = on; this.osd.setMouseNavEnabled(on); this.bInspect.setAttribute('aria-pressed', String(on)); this.box.style.cursor = on ? 'grab' : ''; }
  focusRect() {
    const W = this.root.clientWidth, H = this.root.clientHeight, mob = innerWidth <= 820;
    const left = mob ? 8 : Math.min(W * 0.34, 540) + Math.max(20, W * 0.04) + 36;
    return { x0: left, y0: (mob ? 50 : 56) + 12, x1: W - (mob ? 8 : 24), y1: H - (mob ? 44 : 62) - 12, W, H };
  }
  show(stage) {
    const id = stage.img, meta = this.C.images[id] || {};
    const full = !!stage.full;
    this.cap.innerHTML = `<b>${esc(meta.maker || '')}</b>${meta.maker ? ' · ' : ''}${provenance({ ...meta, maker: '' })}`;
    const ar = meta.h && meta.w ? meta.h / meta.w : 0.7;
    const go = () => {
      const vp = this.osd.viewport; const [rx, ry, rw, rh] = stage.region || [0, 0, 1, 1];
      // fit the region into the focus rect (or the whole stage for openers), by padding the bounds
      const f = full ? { x0: 0, y0: 0, x1: this.root.clientWidth, y1: this.root.clientHeight, W: this.root.clientWidth, H: this.root.clientHeight } : this.focusRect();
      const fx = (f.x1 - f.x0) / f.W, fy = (f.y1 - f.y0) / f.H;
      const bw = rw / fx, bh = (rh * ar) / fy;
      const scale = Math.max(bw, bh * (f.W / f.H) / 1) ;
      const W = Math.max(bw, bh * f.W / f.H), Hh = W * f.H / f.W;
      const cx = rx + rw / 2, cy = (ry + rh / 2) * ar;
      const fcx = (f.x0 + f.x1) / 2 / f.W, fcy = (f.y0 + f.y1) / 2 / f.H;
      const x = cx - fcx * W, y = cy - fcy * Hh;
      vp.fitBounds(new OpenSeadragon.Rect(x, y, W, Hh), motion.reduced);
      this.drawMarks(stage, ar);
    };
    if (this.current !== id) {
      this.current = id; this.osd.clearOverlays();
      this.osd.open({ type: 'image', url: imgUrl(id) });
      this.osd.addOnceHandler('open', go);
    } else go();
    this.setInspect(false);
  }
  drawMarks(stage, ar) {
    this.osd.clearOverlays();
    const marks = typeof stage.marks === 'string' ? MARKS[stage.marks] : stage.marks;
    if (!marks) return;
    marks.forEach((m, i) => {
      const d = el('div', { class: 'mark' + (m.seal ? ' seal' : ''), style: `opacity:0` },
        el('span', { class: 'marklab' + (m.side === 'left' ? ' left' : '') + (m.at === 'top' ? ' top' : ''), html: `${esc(m.label)}${m.sub ? `<small>${esc(m.sub)}</small>` : ''}` }));
      this.osd.addOverlay({ element: d, location: new OpenSeadragon.Rect(m.x, m.y * ar, m.w, m.h * ar) });
      setTimeout(() => { d.style.opacity = 1; }, motion.dur(900 + i * 350));
    });
  }
  describe(stage) { const m = this.C.images[stage.img] || {}; return `${m.maker || ''}, ${m.title || ''}${m.date ? ', ' + m.date : ''}. ${m.holder || ''}.`; }
}

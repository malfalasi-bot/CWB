// Print the Wave: the 2D bench, used when WebGL is missing or the quality tier is 0. Same API as gl.js, top-down only:
// the sheet is a stack of canvases, one per block (CSS order = print order, translate = registration, opacity = ink),
// the block is drawn per pixel on a canvas (wood, carved relief, ink, kentō). No peel; reduced motion is the default feel.
import { SW, SH, BW, BH, LAYERS, hexRGB } from './model.js';

const MW = 800, MH = Math.round((800 * 1075) / 1600);   // working resolution of the masks
const h21 = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
function vnoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = h21(ix, iy), b = h21(ix + 1, iy), c = h21(ix, iy + 1), d = h21(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = rej; i.src = src; });
const mk = (tag, cls, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; parent?.append(e); return e; };

export async function createFlat(container, D, { mode, scope, motion }) {
  const [ia, ib] = await Promise.all([loadImg(D.masks.a), loadImg(D.masks.b)]);
  const cv = document.createElement('canvas'); cv.width = MW; cv.height = MH; const cg = cv.getContext('2d', { willReadFrequently: true });
  const M = {};
  for (const [img, ids] of [[ia, ['pale', 'beige', 'grey']], [ib, ['mid', 'deep', 'key']]]) {
    cg.clearRect(0, 0, MW, MH); cg.drawImage(img, 0, 0, MW, MH);
    const d = cg.getImageData(0, 0, MW, MH).data;
    ids.forEach((id, c) => { const a = new Uint8Array(MW * MH); for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + c]; M[id] = a; });
  }
  const B = Object.fromEntries(D.blocks.map((b) => [b.id, b]));
  // ink sources: the colour of each block where its mask is, a little mottled (shared by every sheet)
  const ink = {};
  for (const id of [...LAYERS, 'key']) {
    const c = document.createElement('canvas'); c.width = MW; c.height = MH; const g = c.getContext('2d');
    const im = g.createImageData(MW, MH), d = im.data, [r, gg, b] = hexRGB(B[id].ink).map((v) => Math.round(v * 255)), m = M[id];
    const cov = id === 'key' ? 0.92 : B[id].cover;
    for (let y = 0, i = 0; y < MH; y++) for (let x = 0; x < MW; x++, i++) {
      if (!m[i]) continue; const n = id === 'key' ? 1 : 0.9 + 0.1 * vnoise(x * 0.11, y * 0.11);
      d[i * 4] = r; d[i * 4 + 1] = gg; d[i * 4 + 2] = b; d[i * 4 + 3] = m[i] * cov * n;
    }
    g.putImageData(im, 0, 0); ink[id] = c;
  }

  const root = mk('div', 'print-flat', container);
  const R = { kind: '2d', frames: [] };
  let s = 100, ox = 0, oy = 0, W = 1, H = 1;
  const place = (e, x, z, w, h) => { e.style.left = `${ox + (x - w / 2) * s}px`; e.style.top = `${oy + (z - h / 2) * s}px`; e.style.width = `${w * s}px`; e.style.height = `${h * s}px`; };

  // ---------------------------------------------------------------- sheets
  function makeSheet() {
    const el = mk('div', 'fl-obj fl-sheet', root), wrap = mk('div', 'fl-layer', el); el.style.zIndex = '3';
    const layers = {};
    for (const id of LAYERS) { const c = mk('canvas', 'fl-layer', wrap); c.width = MW; c.height = MH; layers[id] = c; }
    const key = mk('canvas', 'fl-layer fl-key', wrap); key.width = MW; key.height = MH; key.getContext('2d').drawImage(ink.key, 0, 0);
    return { el, wrap, layers, key, x: 0, z: 0, side: 1, P: null, visible: false };
  }
  const sheets = { 1: makeSheet(), 2: makeSheet() };
  const rubs = {}, rubA = {};
  const grain = new Float32Array(256 * 172).map((_, i) => vnoise((i % 256) * 1.17, Math.floor(i / 256) * 1.17) * 0.65 + vnoise((i % 256) * 0.16, Math.floor(i / 256) * 0.16) * 0.35);
  function rubAlpha(id) {
    const src = rubs[id]; if (!src) return null;
    let c = rubA[id]; if (!c) { c = rubA[id] = document.createElement('canvas'); c.width = src.width; c.height = src.height; }
    const sd = src.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, src.width, src.height).data, g = c.getContext('2d'), im = g.createImageData(src.width, src.height), d = im.data;
    for (let i = 0; i < d.length / 4; i++) { const n = grain[i % grain.length]; d[i * 4 + 3] = 255 * sstep(n - 0.2, n + 0.04, (sd[i * 4] / 255) * 1.05); }
    g.putImageData(im, 0, 0); return c;
  }
  function drawLayer(sh, id, P, slot) {
    const c = sh.layers[id], g = c.getContext('2d');
    g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, MW, MH);
    if (!slot) { c.style.opacity = 0; return; }
    g.drawImage(ink[id], 0, 0);
    if (id === 'deep' && P.dbl) { g.globalAlpha = 0.6; g.drawImage(ink[id], 0, 0); g.globalAlpha = 1; }
    if (id === 'grey' && P.bok) {   // bokashi: the grey fades upward from the horizon
      const gr = g.createLinearGradient(0, 0, 0, MH); gr.addColorStop(0, `rgba(0,0,0,${1 - P.bok})`); gr.addColorStop(0.38, `rgba(0,0,0,${1 - P.bok})`); gr.addColorStop(0.7, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,1)');
      g.globalCompositeOperation = 'destination-in'; g.fillStyle = gr; g.fillRect(0, 0, MW, MH);
    }
    if (!P.rubAll && rubA[id]) { g.globalCompositeOperation = 'destination-in'; g.save(); g.translate(MW, 0); g.scale(-1, 1); g.drawImage(rubA[id], 0, 0, MW, MH); g.restore(); }
    g.globalCompositeOperation = 'source-over';
  }
  function applyPrint(sh) {
    const P = sh.P || { slots: [] };
    const slotOf = Object.fromEntries((P.slots || []).map((s, i) => [s.id, { ...s, i }]));
    for (const id of LAYERS) {
      const sl = slotOf[id], c = sh.layers[id];
      drawLayer(sh, id, P, sl);
      if (sl) { c.style.zIndex = String(sl.i + 1); c.style.opacity = String(sl.on ?? 1); c.style.transform = `translate(${((sl.off?.[0] || 0) / SW) * 100}%, ${(-(sl.off?.[1] || 0) / SH) * 100}%)`; }
    }
    sh.key.style.zIndex = '9'; sh.key.style.opacity = String(P.key ?? 1);
  }
  function layoutSheet(sh) {
    sh.el.style.display = sh.visible ? '' : 'none'; place(sh.el, sh.x, sh.z, SW, SH);
    sh.wrap.style.transform = sh.side < 0.5 ? 'scaleX(-1)' : ''; sh.wrap.style.opacity = sh.side < 0.5 ? '0.4' : '1';
    sh.el.style.opacity = String(sh.opacity ?? 1);
  }

  // ---------------------------------------------------------------- block (room) / chips (stage)
  const blk = { el: null, c: null, id: 'key', carve: 1, inked: 0, kento: 0, mirror: 1, visible: true, op: 1 };
  let wood = null, carveN = null;
  if (mode === 'room') {
    blk.el = mk('div', 'fl-obj fl-block', root); blk.el.style.zIndex = '1'; blk.c = mk('canvas', '', blk.el);
    const cw = 560, ch = Math.round((560 * BH) / BW); blk.c.width = cw; blk.c.height = ch;
    wood = new Float32Array(cw * ch * 3); carveN = new Float32Array(cw * ch);
    for (let y = 0, i = 0; y < ch; y++) for (let x = 0; x < cw; x++, i++) {
      const px = (x / cw) * BW, pz = (y / ch) * BH;
      const n = vnoise(px * 1.3, pz * 0.5), rings = Math.sin(pz * 13 + n * 6 + vnoise(px * 0.7, pz * 5) * 2), fib = vnoise(px * 1.5, pz * 90) * 0.6 + vnoise(px * 0.6, pz * 30) * 0.4;
      const k = sstep(-0.2, 1, rings) * 0.8, f = 0.9 + 0.12 * fib;
      wood[i * 3] = (0.78 + (0.66 - 0.78) * k) * f; wood[i * 3 + 1] = (0.56 + (0.43 - 0.56) * k) * f; wood[i * 3 + 2] = (0.40 + (0.29 - 0.40) * k) * f;
      carveN[i] = vnoise(px * 2.2, pz * 2.2) * 0.55 + vnoise(px * 9, pz * 9) * 0.3 + vnoise(px * 31, pz * 31) * 0.15;
    }
  }
  let blockPending = false;
  function drawBlock() {
    if (!blk.c || blockPending) return; blockPending = true;
    const go = () => {
      blockPending = false;
      const cw = blk.c.width, ch = blk.c.height, g = blk.c.getContext('2d'), im = g.createImageData(cw, ch), d = im.data;
      const m = M[blk.id], isKey = blk.id === 'key', [ir, ig, ib] = hexRGB(B[blk.id].ink), acc = getComputedStyle(document.documentElement).getPropertyValue('--indigo').trim() || '#233c6b';
      const [ar, ag, ab] = hexRGB(acc.length === 7 ? acc : '#233c6b');
      const mx = MARGIN_U(), mz = MARGIN_V();
      for (let y = 0, i = 0; y < ch; y++) for (let x = 0; x < cw; x++, i++) {
        const wu = (x / cw - mx) / (1 - 2 * mx), wv = 1 - (y / ch - mz) / (1 - 2 * mz);   // sheet-area coords, v up
        const inS = wu >= 0 && wu <= 1 && wv >= 0 && wv <= 1;
        let mm = 0;
        if (inS) { const iu = blk.mirror ? 1 - wu : wu; const mi = Math.min(MH - 1, Math.floor((1 - wv) * MH)) * MW + Math.min(MW - 1, Math.floor(iu * MW)); mm = m[mi] / 255; }
        let carved = inS ? 1 : 0;
        if (isKey && inS) carved = sstep(carveN[i] - 0.035, carveN[i] + 0.035, blk.carve * 1.16 - 0.06);
        const raised = Math.max(mm, 1 - carved);
        let r = wood[i * 3], gg = wood[i * 3 + 1], b = wood[i * 3 + 2];
        const lo = 0.78 * (0.95 + 0.05 * Math.sin(x * 1.7 + carveN[i] * 9)), hi = 1.1;
        const f = lo + (hi - lo) * raised; r = r * f + 0.05 * raised; gg = gg * f + 0.05 * raised; b = b * f + 0.05 * raised;
        if (isKey && inS && carved < 1) { const p = (1 - carved) * 0.92; const pr = 0.93 + (0.16 - 0.93) * mm, pg = 0.90 + (0.16 - 0.90) * mm, pb = 0.82 + (0.19 - 0.82) * mm; r += (pr - r) * p; gg += (pg - gg) * p; b += (pb - b) * p; }
        if (blk.inked > 0 && mm > 0) { const a = mm * 0.94 * sstep(carveN[i] - 0.1, carveN[i] + 0.1, blk.inked * 1.2); r += (ir - r) * a; gg += (ig - gg) * a; b += (ib - b) * a; }
        // kentō
        const kw = 0.022, kx = (kw * SH) / SW;
        const kagi = (wu >= 0.84 && wu <= 1 + kx && wv >= -kw && wv <= 0) || (wu >= 1 && wu <= 1 + kx && wv >= -kw && wv <= 0.14);
        const hiki = wu >= 0.2 && wu <= 0.42 && wv >= -kw && wv <= 0;
        if (kagi || hiki) { const w = 1.16; r = wood[i * 3] * w; gg = wood[i * 3 + 1] * w; b = wood[i * 3 + 2] * w; if (blk.kento) { r = ar; gg = ag; b = ab; } }
        d[i * 4] = r * 255; d[i * 4 + 1] = gg * 255; d[i * 4 + 2] = b * 255; d[i * 4 + 3] = 255;
      }
      g.putImageData(im, 0, 0);
    };
    scope.raf(go);
  }
  const MARGIN_U = () => (BW - SW) / 2 / BW, MARGIN_V = () => (BH - SH) / 2 / BH;

  // stage: the sheet plus a column of six blocks that go down one by one
  let chips = null;
  if (mode === 'stage') {
    const order = ['key', ...D.lightToDark];
    const stack = mk('div', 'fl-stack', root);
    chips = order.map((id) => { const c = mk('div', 'fl-chip', stack); const i = mk('i', '', c); i.style.background = B[id].ink; c.append(B[id].short.replace(/^the /, '')); return c; });
    const sh = sheets[1]; sh.visible = true; sh.side = 1;
    sh.P = { slots: D.lightToDark.map((id) => ({ id, on: 0 })), key: 0, rubAll: true }; applyPrint(sh);
    R.setStage = (p) => {
      chips.forEach((c, i) => c.classList.toggle('down', p >= i + 1 - 1e-6));
      sh.key.style.opacity = String(Math.max(0, Math.min(1, p)));
      D.lightToDark.forEach((id, i) => { sh.layers[id].style.opacity = String(Math.max(0, Math.min(1, p - i - 1))); });
    };
  }

  // ---------------------------------------------------------------- API
  const photo = mk('img', 'fl-obj', root); photo.style.zIndex = '2'; photo.src = D.sheet.photo; photo.alt = ''; photo.style.display = 'none';
  const ph = { x: 0, z: 0, visible: false, opacity: 1 };
  function layout() {
    if (blk.el) { blk.el.style.display = blk.visible ? '' : 'none'; blk.el.style.opacity = String(blk.op); place(blk.el, 0, 0, BW, BH); }
    layoutSheet(sheets[1]); layoutSheet(sheets[2]);
    photo.style.display = ph.visible ? '' : 'none'; photo.style.opacity = String(ph.opacity); place(photo, ph.x, ph.z, SW, SH);
  }
  let lastPose = null;
  R.pose = (p) => {
    lastPose = p;
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9; for (const v of p.pts) { x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); z0 = Math.min(z0, v.z); z1 = Math.max(z1, v.z); }
    const pad = p.pad || 1.1, bp = (p.bottomPad || 0) * 0.5;
    s = Math.min(W / ((x1 - x0) * pad), H / ((z1 - z0) * pad + bp)); ox = W / 2 - ((x0 + x1) / 2) * s; oy = H / 2 - ((z0 + z1) / 2) * s;
    layout(); return Promise.resolve();
  };
  R.boxPts = (w, d, y0, y1, cx, cz) => [{ x: cx - w / 2, z: cz - d / 2 }, { x: cx + w / 2, z: cz + d / 2 }];
  R.useRub = (id, c) => { rubs[id] = c; };
  R.rubDirty = (id) => { rubAlpha(id); const sh = sheets[1]; if (sh.P?.slots?.some((x) => x.id === id)) drawLayer(sh, id, sh.P, sh.P.slots.find((x) => x.id === id)); };
  R.setBlock = ({ id, carve, inked, kento, mirror = 1 } = {}) => { if (id != null) blk.id = id; if (carve != null) blk.carve = carve; if (inked != null) blk.inked = inked; if (kento != null) blk.kento = kento; blk.mirror = mirror; drawBlock(); };
  R.setPrint = (which, P) => { const sh = sheets[which === 2 ? 2 : 1]; sh.P = P; applyPrint(sh); };
  R.setSheet = ({ x = 0, z = 0, side, visible, opacity, which = 1 } = {}) => {
    const sh = sheets[which === 2 ? 2 : 1]; sh.x = x; sh.z = z; if (side != null) sh.side = side; if (visible != null) sh.visible = visible; if (opacity != null) sh.opacity = opacity; layoutSheet(sh);
  };
  R.setPhoto = ({ x = 0, z = 0, visible = true, opacity = 1 } = {}) => { Object.assign(ph, { x, z, visible, opacity }); layout(); };
  R.showBlock = (v, op = 1) => { blk.visible = v; blk.op = op; layout(); };
  R.invalidate = () => {};
  R.size = () => ({ W, H });
  R.toWorld = (cx, cy) => { const r = root.getBoundingClientRect(); return { x: (cx - r.left - ox) / s, z: (cy - r.top - oy) / s }; };
  R.toScreen = (x, y, z) => { const r = root.getBoundingClientRect(); return { x: r.left + ox + x * s, y: r.top + oy + z * s, lx: ox + x * s, ly: oy + z * s }; };
  R.pxToWorld = () => 1 / s;
  R.drawCalls = () => 0;
  const fns = [];
  R.onResize = (f) => { fns.push(f); f(W, H); };
  const ro = new ResizeObserver(() => {
    const r = container.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    if (mode === 'stage') stageLayout(); else if (lastPose) R.pose(lastPose);
    fns.forEach((f) => f(W, H));
  });
  ro.observe(container); if (chips) ro.observe(root.querySelector('.fl-stack'));
  { const r = container.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height); }
  if (mode === 'stage') stageLayout();
  // stage: the sheet above a row of the six blocks
  function stageLayout() {
    const st = root.querySelector('.fl-stack'), ch = (st?.offsetHeight || 0) + 12;
    s = Math.min(W / (SW * 1.08), (H - ch) / (SH * 1.08)); ox = W / 2; oy = (H - ch) / 2;
    layout();
  }
  R.destroy = () => { ro.disconnect(); root.remove(); };
  void motion;
  return R;
}

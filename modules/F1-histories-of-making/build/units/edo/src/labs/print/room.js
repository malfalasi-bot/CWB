// Print the Wave, mode 'room': the full workshop. Five steps, no timer, no score; every step works by pointer or keyboard,
// every state is announced, progress is saved, and any running sequence can be paused.
import { el, imgUrl } from '../../util.js';
import { SW, SH, BW, BH, LAYERS, blockOf, inversions, isLightToDark, frame, honesty, sources, liveRegion, saver, BAREN_SVG } from './model.js';
import { makeRenderer } from './renderer.js';

const STEPS = [
  { n: 1, id: 'key', t: 'Key block' }, { n: 2, id: 'register', t: 'Register' }, { n: 3, id: 'ink', t: 'Ink and rub' },
  { n: 4, id: 'order', t: 'Order' }, { n: 5, id: 'pull', t: 'Pull' },
];
const RUB_W = 256, RUB_H = Math.round((256 * 1075) / 1600);
const MM = (D, w) => Math.abs((w / SW) * D.sheet.mmWide);
const START_OFF = [-0.12, -0.1];

export async function mount(root, ctx, D) {
  const { scope, motion } = ctx;
  const save = saver(ctx, 'print:room');
  const fresh = () => ({ step: 1, carve: 0, proof: false, reg: START_OFF.slice(), regDone: false, tries: 0, kento: false, printed: [], bok: 0.5, dbl: false, order: null, orderPulled: false, compare: false, sheets: 0, pulled: false, nudge: 1 });
  let S = Object.assign(fresh(), save.get(null) || {});
  const persist = () => save.set(S);
  let view = null, cur = null;   // cur: the block in hand { id, phase: 'chosen' | 'inked' | 'rub' }
  const B = (id) => blockOf(D, id);

  // ---------------------------------------------------------------- frame and layout
  const F = frame(root, { title: 'Print the Wave', cls: 'print-room', onReset: () => reset() });
  const live = liveRegion();
  const say = (t) => { live.textContent = ''; scope.timeout(() => { live.textContent = t; }, 30); };
  const steps = el('ol', { class: 'print-steps', 'aria-label': 'Workshop steps' });
  const stepBtns = STEPS.map((s) => {
    const b = el('button', { type: 'button', class: 'print-step' }, el('span', { class: 'print-step-n', text: String(s.n) }), el('span', { text: s.t }));
    b.addEventListener('click', () => go(s.n)); steps.append(el('li', {}, b)); return b;
  });
  const helpId = 'print-help-' + Math.random().toString(36).slice(2, 8);
  const benchHelp = el('p', { class: 'vh', id: helpId });
  const bench = el('div', { class: 'print-view', tabindex: '0', role: 'group', 'aria-roledescription': 'printing bench', 'aria-describedby': helpId });
  const over = el('div', { class: 'print-over', 'aria-hidden': 'true' });
  const baren = el('div', { class: 'print-baren', html: BAREN_SVG, hidden: true });
  over.append(baren);
  const benchWrap = el('div', { class: 'print-viewwrap' }, bench, over, benchHelp);
  const panel = el('div', { class: 'print-panel' });
  const stepHead = el('h4', { class: 'print-steptitle' });
  const stepBody = el('div', { class: 'print-stepbody' });
  const pauseBtn = el('button', { type: 'button', class: 'print-btn', hidden: true }, 'Pause');
  const navRow = el('div', { class: 'print-nav' });
  panel.append(stepHead, stepBody, live, pauseBtn, navRow);
  F.body.append(honesty(D, { short: true }), steps, el('div', { class: 'print-main' }, benchWrap, panel));
  F.foot.append(
    el('div', { class: 'print-what' }, el('h4', { text: 'What this shows' }),
      el('p', { text: 'How one colour woodblock print was made: a key block carved in reverse, a sheet registered to the kentō notches, each colour block inked and rubbed with a baren, the order of the blocks, and the day’s labour of pulling sheets. The Great Wave’s colours here are a reconstruction from a photograph.' })),
    sources(D));

  // ---------------------------------------------------------------- renderer (WebGL, or the 2D fallback)
  const R = await makeRenderer(bench, D, { mode: 'room', ctx });
  if (!R) return { destroy() {}, describe: () => '' };
  scope.onDispose(() => R.destroy());
  const { spring } = R;
  bench.dataset.renderer = R.kind;

  // rubbing masks: one small canvas per colour block (white = rubbed)
  const rub = {};
  for (const id of LAYERS) {
    const c = el('canvas', { width: RUB_W, height: RUB_H }); const g = c.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#000'; g.fillRect(0, 0, RUB_W, RUB_H); rub[id] = { c, g };
    R.useRub(id, c);
  }
  const loadRub = (id) => new Promise((res) => {
    const url = ctx.store?.get?.('print:rub:' + id, null); if (!url) return res();
    const im = new Image(); im.onload = () => { rub[id].g.drawImage(im, 0, 0, RUB_W, RUB_H); R.rubDirty(id); res(); }; im.onerror = () => res(); im.src = url;
  });
  await Promise.all(S.printed.map((p) => loadRub(p.id)));
  const clearRub = (id) => { const { g } = rub[id]; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, RUB_W, RUB_H); R.rubDirty(id); };
  const saveRub = (id) => { try { ctx.store?.set('print:rub:' + id, rub[id].c.toDataURL('image/webp', 0.7)); } catch (e) {} };
  const coverage = (id) => { const d = rub[id].g.getImageData(0, 0, RUB_W, RUB_H).data; let s = 0; for (let i = 0; i < d.length; i += 16) s += d[i] > 150 ? 1 : 0; return s / (d.length / 16); };

  // ---------------------------------------------------------------- pausable sequences (no timers: only the learner's pace)
  let paused = false, running = 0;
  pauseBtn.addEventListener('click', () => { paused = !paused; pauseBtn.textContent = paused ? 'Resume' : 'Pause'; say(paused ? 'Paused.' : 'Resumed.'); });
  function play(ms, fn) {
    if (motion.reduced) ms = Math.min(ms, 150);
    return new Promise((res) => {
      let t = 0, last = performance.now(); running++; pauseBtn.hidden = false;
      const step = (now) => {
        if (!paused) t += now - last; last = now;
        const k = Math.min(1, t / ms); fn(k); R.invalidate();
        if (k < 1 && !scope.dead) scope.raf(step); else { running--; if (!running) { pauseBtn.hidden = true; paused = false; pauseBtn.textContent = 'Pause'; } res(); }
      };
      scope.raf(step);
    });
  }

  // ---------------------------------------------------------------- layout helpers (world space; block centred at the origin)
  const landscape = () => { const { W, H } = R.size(); return W / H > 1.05; };
  const beside = (gap = 0.3) => (landscape() ? { x: BW / 2 + gap + SW / 2, z: 0 } : { x: 0, z: BH / 2 + gap + SH / 2 });
  const pts = (rects) => rects.flatMap(([cx, cz, w, h, y1 = 0]) => R.boxPts(w, h, 0, y1, cx, cz));
  const TOP = 90;
  let overlays = [];
  function labelAt(text, wx, wz, cls = '') { const n = el('span', { class: 'print-tag ' + cls, text }); n.dataset.wx = wx; n.dataset.wz = wz; over.append(n); overlays.push(n); return n; }
  function clearLabels() { overlays.forEach((n) => n.remove()); overlays = []; }
  function placeLabels() { for (const n of overlays) { const p = R.toScreen(+n.dataset.wx, 0, +n.dataset.wz); n.style.transform = `translate(${p.lx}px, ${p.ly}px)`; } placeBaren(); }
  R.onResize(() => { if (view) setView(view, true); });

  // ---------------------------------------------------------------- the sheet the learner is printing by hand
  const handPrint = () => {
    const slots = S.printed.map((p) => ({ id: p.id, off: p.off }));
    if (cur && cur.phase === 'rub') slots.push({ id: cur.id, off: S.reg });
    const g = S.printed.find((p) => p.id === 'grey');
    return { slots, key: 1, bok: cur?.id === 'grey' ? S.bok : g ? g.bok : 0, dbl: S.dbl, rubAll: false };
  };
  const fullPrint = (order, opts = {}) => ({ slots: order.map((id) => ({ id, on: opts.on?.[id] ?? 1 })), key: opts.key ?? 1, bok: 0.5, dbl: false, rubAll: true });

  // ---------------------------------------------------------------- views
  function setView(v, instant = false) {
    view = v; clearLabels(); baren.hidden = true;
    const shAt = (x, z, side, which = 1, extra = {}) => R.setSheet({ x, z, side, visible: true, opacity: 1, peel: 0, which, ...extra });
    R.setSheet({ visible: false, which: 2 }); R.setPhoto({ visible: false });
    let p;
    if (v === 'carve') {
      R.showBlock(true); R.setBlock({ id: 'key', carve: S.carve, inked: 0, kento: 0 }); R.setSheet({ visible: false });
      p = R.pose({ pitch: TOP, yaw: 0, pts: pts([[0, 0, BW, BH]]), pad: 1.06 }, instant);
    } else if (v === 'proof') {
      const b = beside(); R.showBlock(true); R.setBlock({ id: 'key', carve: 1, inked: 1, kento: 0 });
      R.setPrint(1, { slots: [], key: 1, rubAll: true }); shAt(b.x, b.z, 1);
      p = R.pose({ pitch: TOP, yaw: 0, pts: pts([[0, 0, BW, BH], [b.x, b.z, SW, SH]]), pad: 1.06 }, instant);
      labelAt('Block (reversed)', 0, -BH / 2 - 0.08, 'cap'); labelAt('Proof', b.x, b.z - SH / 2 - 0.08, 'cap');
    } else if (v === 'register' || v === 'rub' || v === 'ink') {
      const id = v === 'register' ? nextBlock() : cur?.id || nextBlock();
      R.showBlock(true); R.setBlock({ id, carve: 1, inked: v !== 'register' && cur && cur.phase !== 'chosen' ? 1 : 0, kento: v === 'register' && S.kento ? 1 : 0 });
      if (v === 'ink') R.setSheet({ visible: false });
      else { R.setPrint(1, handPrint()); shAt(S.reg[0], S.reg[1], 0); }
      p = R.pose({ pitch: TOP, yaw: 0, pts: pts([[0, 0, BW + 0.3, BH + 0.3]]), pad: 1.04 }, instant);
      if (v === 'register' && S.kento) { labelAt('kagi (corner)', SW / 2 + 0.02, SH / 2 + 0.16, 'kento'); labelAt('hikitsuke (straight)', (0.31 - 0.5) * SW, SH / 2 + 0.16, 'kento'); }
      if (v === 'rub') baren.hidden = false;
    } else if (v === 'order') {
      const two = S.compare, b = { x: landscape() ? SW + 0.3 : 0, z: landscape() ? 0 : SH + 0.3 };
      R.showBlock(false);
      shAt(two ? -b.x / 2 : 0, two ? -b.z / 2 : 0, 1);
      if (two) { shAt(b.x / 2, b.z / 2, 1, 2); }
      const r = two ? [[-b.x / 2, -b.z / 2, SW, SH], [b.x / 2, b.z / 2, SW, SH]] : [[0, 0, SW, SH]];
      p = R.pose({ pitch: TOP, yaw: 0, pts: pts(r), pad: 1.08, bottomPad: 0.2 }, instant);
      if (two) { labelAt('Your order', -b.x / 2, -b.z / 2 + SH / 2 + 0.1, 'cap'); labelAt(isLightToDark(D, S.order) ? 'Dark to light' : 'Light to dark', b.x / 2, b.z / 2 + SH / 2 + 0.1, 'cap'); }
      else labelAt('Your order', 0, SH / 2 + 0.1, 'cap');
    } else if (v === 'pull') {
      R.showBlock(true); R.setBlock({ id: S.printed.at(-1)?.id || 'deep', carve: 1, inked: 1, kento: 0 });
      R.setPrint(1, pullPrint()); shAt(pullOff()[0], pullOff()[1], 0);
      p = R.pose({ pitch: R.kind === 'gl' ? 50 : TOP, yaw: R.kind === 'gl' ? -18 : 0, pts: pts([[0, 0, BW, BH, 0.1], [SW + 0.1, 0, SW, SH, 0.4]]), pad: 1.05 }, instant);
    } else if (v === 'met') {
      const b = landscape() ? { x: SW / 2 + 0.16, z: 0 } : { x: 0, z: SH / 2 + 0.16 };
      R.showBlock(false); R.setPrint(1, pullPrint()); shAt(-b.x, -b.z, 1);
      R.setPhoto({ x: b.x, z: b.z, visible: true });
      p = R.pose({ pitch: TOP, yaw: 0, pts: pts([[-b.x, -b.z, SW, SH], [b.x, b.z, SW, SH]]), pad: 1.06, bottomPad: 0.2 }, instant);
      labelAt('Your impression', -b.x, -b.z + SH / 2 + 0.1, 'cap'); labelAt('The Met’s sheet, JP1847', b.x, b.z + SH / 2 + 0.1, 'cap');
    }
    const LBL = {
      carve: () => `The key block, ${Math.round(S.carve * 100)} percent carved, seen from above. The drawing is reversed on the wood.`,
      proof: () => 'The carved key block beside a proof pulled from it; on paper the picture reads the right way round.',
      register: () => `A sheet lying face down on a colour block. ${offsetWords()}`,
      ink: () => (cur ? `${B(cur.id).label} block, ${cur.phase === 'chosen' ? 'not yet inked' : 'inked'}.` : 'A colour block on the bench.'),
      rub: () => (cur?.phase === 'rub' ? `The sheet on the inked ${B(cur.id).short} block; the colour shows through as you rub.` : 'The sheet on the block.'),
      order: () => (S.compare ? 'Two sheets: your order beside the comparison.' : 'A sheet printed in your order.'),
      pull: () => 'The sheet face down on the block, about to be lifted.',
      met: () => 'Your impression beside the Met’s sheet, JP1847.',
    };
    bench.setAttribute('aria-label', 'Printing bench: ' + (LBL[v]?.() || ''));
    bench.tabIndex = v === 'register' || v === 'rub' ? 0 : -1;
    over.hidden = true;
    Promise.resolve(p).then(() => { if (view === v) { over.hidden = false; placeLabels(); } });
    R.invalidate();
  }
  const nextBlock = () => cur?.id || LAYERS.find((id) => !S.printed.some((p) => p.id === id)) || 'deep';
  const pullPrint = () => (S.printed.length ? handPrint() : fullPrint(D.lightToDark));
  const pullOff = () => (S.printed.length ? S.reg : [0, 0]);

  // ---------------------------------------------------------------- pointer and keyboard on the bench
  let drag = null, bx = 0, bz = 0;
  const sheetHit = (w) => w && Math.abs(w.x - S.reg[0]) < SW / 2 + 0.05 && Math.abs(w.z - S.reg[1]) < SH / 2 + 0.05;
  bench.addEventListener('pointerdown', (e) => {
    const w = R.toWorld(e.clientX, e.clientY);
    if (view === 'register' && sheetHit(w)) {
      drag = { kind: 'sheet', x0: w.x, z0: w.z, r0: S.reg.slice() }; bench.setPointerCapture(e.pointerId); bench.classList.add('dragging'); e.preventDefault();
    } else if (view === 'rub' && cur?.phase === 'rub' && w) {
      drag = { kind: 'rub' }; bench.setPointerCapture(e.pointerId); rubAt(w.x, w.z); e.preventDefault();
    }
  });
  bench.addEventListener('pointermove', (e) => {
    if (!drag) { if (view === 'rub') { const w = R.toWorld(e.clientX, e.clientY); if (w) { bx = w.x; bz = w.z; placeBaren(); } } return; }
    const w = R.toWorld(e.clientX, e.clientY); if (!w) return;
    if (drag.kind === 'sheet') { S.reg = [drag.r0[0] + w.x - drag.x0, drag.r0[1] + w.z - drag.z0]; moveSheet(); }
    else rubAt(w.x, w.z);
  });
  const endDrag = () => {
    if (!drag) return; const k = drag.kind; drag = null; bench.classList.remove('dragging');
    if (k === 'sheet') { snapMaybe(); persist(); }
    if (k === 'rub') rubDone();
  };
  bench.addEventListener('pointerup', endDrag); bench.addEventListener('pointercancel', endDrag);

  const held = new Set();
  bench.addEventListener('keydown', (e) => {
    const dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (view === 'register' && dirs[e.key]) {
      e.preventDefault(); const px = (e.shiftKey ? 10 : S.nudge) * R.pxToWorld();
      S.reg = [S.reg[0] + dirs[e.key][0] * px, S.reg[1] + dirs[e.key][1] * px]; moveSheet(); persist(); announceOffset(true);
    } else if (view === 'register' && e.key === 'Enter') { e.preventDefault(); commitReg(); }
    else if (view === 'rub' && cur?.phase === 'rub' && (dirs[e.key] || e.key === ' ')) {
      e.preventDefault(); held.add(e.key);
      const d = dirs[e.key] || [0, 0], s = 0.07;
      bx = Math.max(S.reg[0] - SW / 2, Math.min(S.reg[0] + SW / 2, bx + d[0] * s)); bz = Math.max(S.reg[1] - SH / 2, Math.min(S.reg[1] + SH / 2, bz + d[1] * s));
      rubAt(bx, bz); placeBaren();
    }
  });
  bench.addEventListener('keyup', (e) => { if (held.delete(e.key) && view === 'rub' && cur?.phase === 'rub') rubDone(); });

  function moveSheet() { R.setSheet({ x: S.reg[0], z: S.reg[1], side: 0, visible: true }); }
  const offPx = () => Math.hypot(S.reg[0], S.reg[1]) / R.pxToWorld();
  function snapMaybe() {
    if (offPx() > 6 || offPx() === 0) return announceOffset(true);
    // within 6 px of the kentō: a spring settles the sheet into the corner
    let x = S.reg[0], z = S.reg[1], vx = 0, vz = 0;
    play(380, () => { const dt = 1 / 60; [x, vx] = spring(x, 0, vx, dt); [z, vz] = spring(z, 0, vz, dt); S.reg = [x, z]; moveSheet(); })
      .then(() => { S.reg = [0, 0]; moveSheet(); persist(); say('The sheet settles into the kentō.'); });
  }
  let offT = 0;
  function announceOffset(throttle) {
    const now = performance.now(); if (throttle && now - offT < 700) return; offT = now;
    say(offsetWords());
  }
  function offsetWords() {
    const [x, z] = S.reg, mx = MM(D, x), mz = MM(D, z);
    if (mx < 0.3 && mz < 0.3) return 'The sheet sits exactly in the kentō.';
    const parts = [];
    if (mx >= 0.3) parts.push(`${mx.toFixed(1)} mm ${x > 0 ? 'right' : 'left'}`);
    if (mz >= 0.3) parts.push(`${mz.toFixed(1)} mm ${z > 0 ? 'low' : 'high'}`);
    return `The sheet sits ${parts.join(' and ')} of the marks (on the real 37.9 cm sheet).`;
  }

  // rubbing
  let lastCov = '';
  function rubAt(x, z) {
    if (!cur || cur.phase !== 'rub') return;
    const u = (x - S.reg[0]) / SW + 0.5, v = -(z - S.reg[1]) / SH + 0.5;
    const px = u * RUB_W, py = (1 - v) * RUB_H, r = RUB_W * 0.085;
    const g = rub[cur.id].g; g.globalCompositeOperation = 'lighter';
    const grd = g.createRadialGradient(px, py, 0, px, py, r); grd.addColorStop(0, 'rgba(255,255,255,0.32)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(px, py, r, 0, Math.PI * 2); g.fill();
    bx = x; bz = z; placeBaren(); R.rubDirty(cur.id);
  }
  function rubAll() {
    if (!cur || cur.phase !== 'rub') return;
    const g = rub[cur.id].g; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#fff';
    play(motion.reduced ? 0 : 600, (k) => { g.fillRect(0, 0, RUB_W * k, RUB_H); R.rubDirty(cur.id); }).then(rubDone);
  }
  function rubDone() {
    if (!cur) return; const c = coverage(cur.id);
    const w = c < 0.15 ? 'a faint impression' : c < 0.5 ? 'a patchy impression' : c < 0.85 ? 'nearly even' : 'an even impression';
    if (w !== lastCov) { lastCov = w; say(`${B(cur.id).label}: ${w}.`); }
  }
  function placeBaren() {
    if (baren.hidden) return; const p = R.toScreen(bx, 0, bz);
    baren.style.transform = `translate(${p.lx}px, ${p.ly}px)`;
  }

  // ---------------------------------------------------------------- registration commit
  function commitReg() {
    S.regDone = true; S.tries++; persist();
    const exact = MM(D, S.reg[0]) < 0.3 && MM(D, S.reg[1]) < 0.3;
    say(`Sheet laid down. ${offsetWords()}`);
    regResult = exact ? 'exact' : 'off'; render();
  }
  let regResult = null;

  // ---------------------------------------------------------------- steps
  function go(n) { if (running) return; S.step = n; persist(); regResult = null; render(true); say(`Step ${n} of 5: ${STEPS[n - 1].t}.`); }
  function nav(prev, next, nextLabel) {
    navRow.replaceChildren(
      prev ? btn('← Back', () => go(prev)) : el('span'),
      next ? btn(nextLabel || `Next: ${STEPS[next - 1].t} →`, () => go(next), 'primary') : el('span'));
  }
  function btn(t, fn, cls = '') { const b = el('button', { type: 'button', class: 'print-btn ' + cls }, t); b.addEventListener('click', fn); return b; }
  const P = (t) => el('p', { html: t });

  function render(fromNav) {
    stepBtns.forEach((b, i) => { b.setAttribute('aria-current', S.step === i + 1 ? 'step' : 'false'); b.classList.toggle('on', S.step === i + 1); });
    stepHead.textContent = `${S.step}. ${STEPS[S.step - 1].t}`;
    benchHelp.textContent = 'The printing bench. Use the controls beside it.';
    stepBody.replaceChildren(); bench.classList.toggle('grab', S.step === 2); bench.classList.toggle('rubbing', S.step === 3);
    ({ 1: stepKey, 2: stepReg, 3: stepInk, 4: stepOrder, 5: stepPull })[S.step](fromNav);
  }

  // 1 · key block
  function stepKey() {
    const r = el('input', { type: 'range', class: 'print-range', min: 0, max: 100, step: 1, value: Math.round(S.carve * 100), 'aria-label': 'Carve the key block', 'aria-valuetext': '' });
    let lastQ = Math.round(S.carve * 4);
    const proofBtn = btn('Pull a proof', () => { S.proof = true; persist(); setView('proof'); say('Key-block proof pulled. On the block the picture is reversed; on the paper it reads the right way round.'); proofBtn.disabled = true; });
    const sync = () => {
      const v = +r.value; S.carve = v / 100; R.setBlock({ carve: S.carve }); persist();
      r.setAttribute('aria-valuetext', v >= 100 ? 'fully carved' : `${v} percent carved`);
      proofBtn.disabled = v < 95;
      const q = Math.round(S.carve * 4); if (q !== lastQ) { lastQ = q; say(['Uncut: the drawing is pasted on the wood.', 'A quarter carved.', 'Half carved: the lines stand up in reverse.', 'Three quarters carved.', 'Carved. Only the lines and the kentō stand.'][q]); }
      if (view !== 'carve') setView('carve');
    };
    r.addEventListener('input', sync);
    proofBtn.disabled = S.carve < 0.95;
    const fig = el('figure', { class: 'print-fig' },
      el('img', { src: imgUrl(D.keyproof.img), alt: 'A real key-block proof: Sadahide’s fan design printed in black line only, with registration notches outside the picture.', loading: 'lazy' }),
      el('figcaption', { text: D.keyproof.caption }));
    stepBody.append(
      P('The designer’s drawing was pasted face down on cherry wood, and the carver cut through it, destroying it. Everything that should not print is cut away, so the lines stand up <em>in reverse</em>. Two notches in the margin, the <em>kentō</em>, are cut at the same time.'),
      el('label', { class: 'print-field' }, el('span', { text: 'Carve' }), r), proofBtn,
      P('<small>Here the line is traced from the photograph of the finished sheet (reconstruction). A real key-block proof looks like this:</small>'), fig);
    setView(S.proof && S.carve >= 0.95 ? 'proof' : 'carve', !view);
    nav(null, 2);
  }

  // 2 · register
  function stepReg() {
    if (regResult == null && S.regDone && !S.kento) regResult = MM(D, S.reg[0]) < 0.3 && MM(D, S.reg[1]) < 0.3 ? 'exact' : 'off';
    benchHelp.textContent = 'The printing bench: a sheet lying face down on a colour block. Drag the sheet, or use the arrow keys to nudge it, then press Enter to lay it down.';
    const nudge = el('div', { class: 'print-seg', role: 'radiogroup', 'aria-label': 'Arrow-key nudge' },
      ...[1, 10].map((n) => { const b = el('button', { type: 'button', role: 'radio', class: 'print-btn sm', 'aria-checked': String(S.nudge === n) }, `${n} px`); b.addEventListener('click', () => { S.nudge = n; persist(); render(); }); return b; }));
    stepBody.append(
      P(S.kento ? 'Slide the sheet into the <strong>kagi</strong>, the corner mark, and against the <strong>hikitsuke</strong>, the straight mark along the bottom edge.'
        : 'The key line is already printed on this sheet, and it lies face down, so you see its back. Lay it on the next block so the colours will meet the lines.'),
      P('<small>Drag the sheet, or focus the bench and use the arrow keys. Enter lays it down.</small>'),
      el('div', { class: 'print-row' }, el('span', { class: 'print-small', text: 'Arrow keys move' }), nudge),
      el('div', { class: 'print-row' }, btn('Lay it down', commitReg, 'primary'), S.kento ? btn('Slide into the kentō', () => { const d = Math.hypot(S.reg[0], S.reg[1]), lim = 5 * R.pxToWorld(); if (d > lim) S.reg = [(S.reg[0] / d) * lim, (S.reg[1] / d) * lim]; moveSheet(); snapMaybe(); }) : null));
    if (regResult) {
      const box = el('div', { class: 'print-note' });
      if (!S.kento) {
        box.append(P(`<strong>${regResult === 'exact' ? 'It sits true.' : 'Your sheet is off the marks.'}</strong> ${offsetWords()}`),
          P('Those two small ridges are the <strong>kentō</strong>, cut into every block: a corner, <em>kagi</em>, and a straight edge, <em>hikitsuke</em>. The printer pushed each damp sheet into the corner and against the edge, so every colour fell where the carver meant it (documented: the Asian Art Museum).'),
          P(regResult === 'exact' ? 'Every block you print now will land in register.' : 'If you keep it, every block you print now will be off by that much. Or register again against the marks.'),
          el('div', { class: 'print-row' }, btn(regResult === 'exact' ? 'Print' : 'Keep it and print', () => { S.kento = true; persist(); go(3); }, 'primary'),
            btn('Register again', () => { S.kento = true; persist(); regResult = null; render(); setView('register'); say('The kentō are marked: kagi, the corner, at bottom right; hikitsuke, the straight, along the bottom edge.'); })));
      } else box.append(P(`<strong>Laid down.</strong> ${offsetWords()}`), btn('Print with it', () => go(3), 'primary'));
      stepBody.append(box);
    }
    setView('register');
    nav(1, 3);
  }

  // 3 · ink and rub
  function stepInk() {
    benchHelp.textContent = 'The printing bench. When a block is inked and the sheet is on it, hold an arrow key to move the baren and rub, or press Space to rub in place.';
    const printedIds = S.printed.map((p) => p.id);
    const list = el('div', { class: 'print-blocks', role: 'radiogroup', 'aria-label': 'Choose a colour block' });
    LAYERS.forEach((id) => {
      const b = B(id), done = printedIds.includes(id), on = cur?.id === id;
      const r = el('button', { type: 'button', role: 'radio', class: 'print-block' + (done ? ' done' : ''), 'aria-checked': String(on), disabled: done || (cur && cur.phase !== 'chosen' && !on) ? true : null },
        el('span', { class: 'print-sw', style: `background:${b.ink}` }), el('span', { class: 'print-bl', text: b.label }), el('span', { class: 'print-bs', text: done ? 'printed' : on ? 'chosen' : '' }));
      r.addEventListener('click', () => { cur = { id, phase: 'chosen' }; clearRub(id); render(); setView('ink'); say(`${b.label} chosen. Ink it next.`); });
      list.append(r);
    });
    stepBody.append(P('Choose a block, ink it, then rub the back of the sheet with the baren. The colour shows through the damp paper as you rub.'), list);
    if (cur) {
      const b = B(cur.id), n = S.printed.length + 2;
      if (cur.id === 'grey') {
        const r = el('input', { type: 'range', class: 'print-range', min: 0, max: 100, step: 1, value: Math.round(S.bok * 100), 'aria-label': 'Bokashi: grade the grey', 'aria-valuetext': '' });
        const sync = () => { S.bok = +r.value / 100; r.setAttribute('aria-valuetext', S.bok < 0.15 ? 'flat' : S.bok > 0.85 ? 'strongly graded' : 'graded'); persist(); if (view === 'rub') R.setPrint(1, handPrint()); };
        r.addEventListener('input', sync); r.addEventListener('change', () => say(`Bokashi ${r.getAttribute('aria-valuetext')}.`)); sync();
        stepBody.append(el('div', { class: 'print-note' }, P('<strong>Bokashi.</strong> Before each pull the printer wiped the block to grade the grey into the sky, so no two sheets match. Set the grade; it is a choice, not a pressure.'), el('label', { class: 'print-field' }, el('span', { text: 'Flat → graded' }), r)));
      }
      if (cur.phase === 'chosen') stepBody.append(btn(`Ink ${b.short}`, async () => {
        cur.phase = 'inked'; render();
        await play(700, (k) => R.setBlock({ inked: k }));
        say(`Block ${n} of 6 inked: ${b.short}.`);
        cur.phase = 'rub'; lastCov = ''; bx = S.reg[0]; bz = S.reg[1]; render(); setView('rub');
        say(`Block ${n} of 6 inked: ${b.short}. The sheet is on the block. Rub with the baren.`);
      }, 'primary'));
      if (cur.phase === 'rub') stepBody.append(
        P('<small>Drag across the sheet, or focus the bench and hold an arrow key. Rub the whole sheet if dragging is hard.</small>'),
        el('div', { class: 'print-row' }, btn('Rub the whole sheet', rubAll), btn('Lift the baren', () => {
          S.printed.push({ id: cur.id, off: S.reg.slice(), bok: cur.id === 'grey' ? S.bok : undefined }); saveRub(cur.id); persist();
          const done = S.printed.length; say(`${b.label} printed. ${done} of 5 colour blocks done.`);
          cur = null; render(); setView('rub');
        }, 'primary')));
    }
    if (printedIds.includes('deep')) {
      const c = el('input', { type: 'checkbox', checked: S.dbl ? true : null });
      c.addEventListener('change', () => { S.dbl = c.checked; persist(); R.setPrint(1, handPrint()); say(S.dbl ? 'The deep blue pulled a second time.' : 'One pull of the deep blue.'); });
      stepBody.append(el('label', { class: 'print-check' }, c, el('span', { html: 'Pull the deep blue a second time. The Met’s spectroscopy found the hollow of the wave printed twice in pure Prussian blue (documented); here the whole block is pulled again, a simplification.' })));
    }
    if (S.printed.length) stepBody.append(P(`<small>Printed so far, in your order: ${S.printed.map((p) => B(p.id).short).join(' → ')}.</small>`));
    stepBody.append(el('div', { class: 'print-row' }, btn('Register again', () => go(2))));
    if (!cur) setView(S.printed.length ? 'rub' : 'ink', false);
    else setView(cur.phase === 'rub' ? 'rub' : 'ink');
    nav(2, 4);
  }

  // 4 · order
  function stepOrder() {
    if (!S.order) { const p = S.printed.map((x) => x.id); S.order = [...p, ...['pale', 'grey', 'beige', 'mid', 'deep'].filter((id) => !p.includes(id))]; persist(); }
    const ol = el('ol', { class: 'print-order' });
    const draw = () => {
      ol.replaceChildren(...S.order.map((id, i) => {
        const b = B(id);
        const up = el('button', { type: 'button', class: 'print-btn icon', 'aria-label': `Move ${b.short} earlier`, disabled: i === 0 ? true : null }, '↑');
        const dn = el('button', { type: 'button', class: 'print-btn icon', 'aria-label': `Move ${b.short} later`, disabled: i === S.order.length - 1 ? true : null }, '↓');
        const mv = (d) => { const j = i + d; [S.order[i], S.order[j]] = [S.order[j], S.order[i]]; S.orderPulled = false; S.compare = false; persist(); draw(); explain.replaceChildren(); say(`${b.label} moved to place ${j + 1} of 5.`); ol.querySelectorAll('button')[j * 2 + (d < 0 ? 0 : 1)]?.focus(); };
        up.addEventListener('click', () => mv(-1)); dn.addEventListener('click', () => mv(1));
        return el('li', {}, el('span', { class: 'print-sw', style: `background:${b.ink}` }), el('span', { class: 'print-bl', text: b.label }), up, dn);
      }));
    };
    draw();
    const explain = el('div', { class: 'print-explain' });
    const pull = btn('Pull a sheet in this order', async () => {
      pull.disabled = true; S.compare = false; setView('order');
      const on = {}; S.order.forEach((id) => { on[id] = 0; });
      for (const id of S.order) {
        await play(520, (k) => { on[id] = k; R.setPrint(1, fullPrint(S.order, { on })); });
        say(`${B(id).label} printed.`);
      }
      S.orderPulled = true; persist(); pull.disabled = false; showExplain(); say(explainLine());
    }, 'primary');
    stepBody.append(P('Choose the order of the five colour blocks, then pull a sheet. Here the key line goes down first and every block is perfectly registered, so only the order changes.'), ol, pull, explain);
    const WHERE = { pale: 'the pale sky and the foam', beige: 'the boats', grey: 'the grey sky behind Fuji', mid: 'the lighter blue of the waves', deep: 'the claws and the hollow of the wave' };
    const gap = (x) => B(x[1]).light - B(x[0]).light;
    function worst() { return inversions(D, S.order).sort((p, q) => gap(q) - gap(p))[0]; }
    function explainLine() {
      const w = worst(); if (!w) return 'You worked from light to dark.';
      const [dark, light] = w;
      return `${B(light).label} went down after ${B(dark).short}, so it veils it: look at ${WHERE[dark]}.`;
    }
    function showExplain() {
      explain.replaceChildren();
      const inv = inversions(D, S.order), w = worst(), strong = w && gap(w) > 0.3;
      explain.append(P(inv.length ? `<strong>${strong ? 'Muddied.' : 'Slightly muddied.'}</strong> ${explainLine()} A paler ink laid over a darker one clouds it.` : '<strong>Clean.</strong> You worked from light to dark: each darker block covered the edges of the lighter ones.'),
        P('<small>In this simulation every ink is partly opaque, so a later ink covers an earlier one where their blocks overlap.</small>'));
      const cmp = btn(inv.length ? 'Compare with light to dark' : 'Compare with dark to light', () => {
        S.compare = true; persist();
        R.setPrint(2, fullPrint(inv.length ? D.lightToDark : [...D.lightToDark].reverse())); setView('order');
        explain.append(P('Printers usually worked from light to dark: each darker block covered the edges of the lighter ones and hid small slips (probable: the usual workshop practice; our sources do not record the order for the Great Wave).'));
        say(inv.length ? 'Compared with light to dark, shown beside yours.' : 'Compared with dark to light, shown beside yours.'); cmp.remove();
      });
      explain.append(cmp);
    }
    if (S.orderPulled) {
      R.setPrint(1, fullPrint(S.order));
      const inv = inversions(D, S.order);
      if (S.compare) R.setPrint(2, fullPrint(inv.length ? D.lightToDark : [...D.lightToDark].reverse()));
      showExplain(); setView('order');
    } else { R.setPrint(1, fullPrint(S.order, { key: 1, on: Object.fromEntries(S.order.map((id) => [id, 0])) })); setView('order'); }
    nav(3, 5);
  }

  // 5 · pull
  function stepPull() {
    const day = el('div', { class: 'print-day' });
    const drawDay = () => {
      const n = Math.min(S.sheets, D.day.sheets);
      const cells = Array.from({ length: D.day.sheets }, (_, i) => el('span', { class: 'print-cell' + (i < n ? ' on' : '') }));
      day.replaceChildren(
        el('p', { class: 'print-dayline', text: D.day.line }),
        el('div', { class: 'print-grid', role: 'img', 'aria-label': `${S.sheets} sheet${S.sheets === 1 ? '' : 's'} pulled, out of about ${D.day.sheets} in a ${D.day.label} printer’s day` }, ...cells),
        el('p', { class: 'print-small', text: `Sheets you have pulled: ${S.sheets}. A printer’s day: about ${D.day.sheets} (${D.day.label}; Asian Art Museum, ${D.day.conf}). Each sheet needed every block in turn: six pulls here, at least about ten in a real colour print.` }));
    };
    const doPull = async () => {
      pullB.disabled = true; setView('pull');
      if (!motion.reduced && R.kind === 'gl') {
        await new Promise((r) => scope.timeout(r, 680));
        await play(1700, (k) => R.setSheet({ peel: k, x: pullOff()[0], z: pullOff()[1], side: 0, visible: true }));
      } else await play(150, (k) => R.setSheet({ opacity: 1 - k, x: pullOff()[0], z: pullOff()[1] }));
      S.sheets++; S.pulled = true; persist();
      setView('met'); drawDay(); pullB.disabled = false; pullB.textContent = 'Pull another sheet';
      say(`Sheet ${S.sheets} pulled. Your impression is beside the Met’s. ${D.day.line}`);
      cmpText.hidden = false;
    };
    const pullB = btn(S.pulled ? 'Pull another sheet' : 'Pull the sheet', doPull, 'primary');
    const offs = S.printed.filter((p) => MM(D, p.off[0]) >= 0.3 || MM(D, p.off[1]) >= 0.3);
    const cmpText = el('div', { hidden: S.pulled ? null : true },
      P(S.printed.length ? `Compare the two. ${offs.length ? `Your ${offs.map((p) => B(p.id).short).join(', ')} ${offs.length > 1 ? 'were' : 'was'} printed off the kentō: look for paper gaps and doubled edges along the lines.` : 'Your blocks were in register.'} ${S.printed.length < 5 ? `You printed ${S.printed.length} of the 5 colour blocks.` : ''}`
        : 'You have not printed a block by hand yet, so this is a bench sheet printed light to dark, in register.'),
      P('The Met’s sheet is itself one impression among many; the British Museum had located 111 by 2020.'));
    stepBody.append(P('Peel the sheet off the block and turn it over.'), pullB, cmpText, day);
    drawDay();
    setView(S.pulled ? 'met' : 'pull');
    nav(4, null);
  }

  function reset() {
    if (running) return;
    S = fresh(); cur = null; regResult = null; persist();
    LAYERS.forEach((id) => { clearRub(id); try { ctx.store?.set('print:rub:' + id, null); } catch (e) {} });
    render(); say('Workshop reset. Step 1 of 5: Key block.');
  }

  render();
  return {
    destroy() { R.destroy(); F.box.remove(); },
    describe() {
      return `Print the Wave workshop, step ${S.step} of 5: ${STEPS[S.step - 1].t}. ${S.printed.length} of 5 colour blocks printed by hand; ${S.sheets} sheet${S.sheets === 1 ? '' : 's'} pulled. A reconstruction from a photograph of the Met’s Great Wave.`;
    },
    _R: R,
  };
}

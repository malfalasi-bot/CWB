// Lab · Step into the View. Three of Hiroshige's One Hundred Famous Views of Edo, each cut by hand into depth
// planes (scripts/prep-views.py; a reconstruction). Three ways in:
//   Step in — move your eye (drag, arrow keys or the pad) and the stack parallaxes behind a fixed window;
//   Rebuild the depth — put the planes back in order, front to back, look from the side or the front, then compare
//                        with the print's order (ghost = yours, ink = the print's); the composition rules follow;
//   Flat sheet — the print as it was printed, with its record. Always one click away.
// Reduced motion: no parallax and no animated moves; viewpoints and orders change by cuts.
import { el, motion as M0 } from '../util.js';
import { confChip } from '../cards.js';
import './view.css';

const MODES = [['step', 'Step in'], ['rebuild', 'Rebuild the depth'], ['flat', 'Flat sheet']];
const D = 5.2; // rest eye distance, in sheet heights × 2 (sheet = 2 units tall)

export default {
  id: 'view', title: 'Step into the View', kicker: 'Lab · depth planes, reconstruction',
  async mount(root, ctx = {}) {
    const motion = ctx.motion || M0, mode0 = ctx.mode || 'stage', params = ctx.params || {};
    const store = ctx.store || { get: (k, f) => f, set() {} };
    const DATA = await fetch('data/views.json').then((r) => r.json());
    const ids = DATA.order.filter((id) => DATA.prints[id]);
    let pid = ids.includes(params.print) ? params.print : store.get('view:print', ids[0]);
    if (!ids.includes(pid)) pid = ids[0];
    let mode = 'step';
    root.innerHTML = '';

    // ---------------------------------------------------------------- DOM
    const live = el('p', { class: 'view-live', 'aria-live': 'polite' });
    const reset = el('button', { type: 'button', class: 'view-reset', onclick: () => resetAll() }, 'Reset');
    const head = el('div', { class: 'view-head' }, el('span', { class: 'view-label', text: 'Lab · reconstruction' }), el('h3', { class: 'view-title', text: 'Step into the View' }), reset);
    const tabs = el('div', { class: 'view-tabs', role: 'tablist', 'aria-label': 'Prints' });
    const tabBtns = ids.map((id) => {
      const P = DATA.prints[id], sp = ctx.sprite?.(id);
      const b = el('button', { type: 'button', role: 'tab', class: 'view-tab', 'aria-selected': 'false', onclick: () => choose(id) },
        el('span', { class: 'view-thumb', 'aria-hidden': 'true', style: sp ? `background-image:url(${sp.url});background-size:${sp.W / sp.w * 100}% ${sp.H / sp.h * 100}%;background-position:${sp.x / Math.max(1, sp.W - sp.w) * 100}% ${sp.y / Math.max(1, sp.H - sp.h) * 100}%` : '' }),
        el('span', { class: 'view-tab-t' }, el('b', { text: `No. ${P.n}` }), P.title));
      b.addEventListener('keydown', (e) => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (d) { e.preventDefault(); const j = (ids.indexOf(id) + d + ids.length) % ids.length; tabBtns[j].focus(); choose(ids[j]); } });
      tabs.append(b); return b;
    });
    const box = el('div', { class: 'view-box', tabindex: '0', role: 'application', 'aria-roledescription': 'depth view', 'aria-describedby': '' });
    const tags = el('div', { class: 'view-tags', 'aria-hidden': 'true' });
    const horizon = el('div', { class: 'view-horizon', 'aria-hidden': 'true', hidden: true }, el('span', { text: 'horizon' }));
    const padBtn = (lab, dx, dy, txt) => el('button', { type: 'button', class: 'view-pad-b', 'aria-label': lab, onclick: () => nudge(dx, dy) }, txt);
    const pad = el('div', { class: 'view-pad', role: 'group', 'aria-label': 'Move your eye' },
      padBtn('Eye up', 0, 1, '▲'), padBtn('Eye left', -1, 0, '◀'), el('button', { type: 'button', class: 'view-pad-b c', 'aria-label': 'Centre the eye', onclick: () => nudge(0, 0, true) }, '●'), padBtn('Eye right', 1, 0, '▶'), padBtn('Eye down', 0, -1, '▼'));
    const stageWrap = el('div', { class: 'view-stage' }, box, tags, horizon, pad);
    box.append(); // canvas goes into box
    const modeBtns = MODES.map(([m, lab]) => el('button', { type: 'button', class: 'view-mode', 'aria-pressed': 'false', onclick: () => setMode(m) }, lab));
    const modes = el('div', { class: 'view-modes', role: 'group', 'aria-label': 'How to look' }, ...modeBtns);

    // panels
    const depthIn = el('input', { type: 'range', min: '0', max: '100', value: '100', class: 'view-range', 'aria-label': 'Depth between the planes' });
    const stepPanel = el('div', { class: 'view-panel' },
      el('p', { class: 'view-p', html: 'Drag the picture, or use the arrow keys or the pad, to move your eye. Near planes slide against far ones: the print is a <em>stack</em>.' }),
      el('label', { class: 'view-field' }, el('span', { text: 'Depth' }), depthIn),
      el('p', { class: 'view-rm', hidden: true, text: 'Reduced motion is on: parallax is off. Choose a viewpoint instead.' }),
      el('div', { class: 'view-row view-rm-row', hidden: true }, ...[['left', -1], ['centre', 0], ['right', 1]].map(([n, v]) => el('button', { type: 'button', class: 'view-btn sm', onclick: () => { eye.tx = v * 0.42; eye.x = eye.tx; kick(); } }, `From the ${n}`))));
    const orderList = el('ol', { class: 'view-order', 'aria-label': 'Planes, front to back' });
    const lookBtn = el('button', { type: 'button', class: 'view-btn', 'aria-pressed': 'false', onclick: () => { look = !look; lookBtn.setAttribute('aria-pressed', String(look)); lookBtn.textContent = look ? 'Look from the side' : 'Look from the front'; kick(); } }, 'Look from the front');
    const truthBtn = el('button', { type: 'button', class: 'view-btn primary', onclick: () => revealTruth() }, 'Show the print’s order');
    const skipRules = el('button', { type: 'button', class: 'view-btn link', onclick: () => revealTruth(true) }, 'Skip to the composition');
    const rebuildPanel = el('div', { class: 'view-panel' },
      el('p', { class: 'view-p', text: 'The planes are out of order. Move each one forward or back until the stack makes the picture. Look from the front to check.' }),
      orderList, el('div', { class: 'view-row' }, lookBtn, truthBtn, skipRules));
    const record = el('p', { class: 'view-record' });
    const flatPanel = el('div', { class: 'view-panel' }, el('p', { class: 'view-p', text: 'The sheet as it was printed: one flat sheet of paper, carved blocks, water-based colour.' }), record);
    const rulesBox = el('div', { class: 'view-rules', hidden: true }, el('h4', { text: 'What the stack shows' }), el('ul'));
    const side = el('div', { class: 'view-side' }, modes, stepPanel, rebuildPanel, flatPanel, rulesBox, live);
    const what = el('div', { class: 'view-what' }, el('h4', { text: 'What this shows' }), el('p', { text: DATA.what }));
    const srcs = el('div', { class: 'view-sources' }, el('h4', { text: 'Sources' }), el('ul', {}, ...DATA.sources.map((s) => el('li', {}, el('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.title), ' ', confChip(s.conf)))));
    const honest = el('p', { class: 'view-honest', html: '<strong>Reconstruction.</strong> The planes were cut by hand for this lab, and hidden areas behind them were filled in. Hiroshige drew and the block-cutters cut one flat design.' });
    const bench = el('section', { class: `view-bench m-${mode0}`, 'aria-label': 'Step into the View' }, head, mode0 === 'room' ? tabs : null,
      el('div', { class: 'view-main' }, stageWrap, side), el('div', { class: 'view-foot' }, what, honest, srcs));
    root.append(bench);

    // ---------------------------------------------------------------- WebGL (or a flat DOM stack)
    const common = await import('../3d/common.js');
    const { THREE, makeStage, webglOK, loadTex } = common;
    const { planeMat, offAxis, visUniforms } = await import('../3d/planes.js');
    if (!webglOK()) return flatFallback();

    const stage = makeStage(box, { fov: 30, onTier: () => kick() });
    const R = stage.renderer;
    const cam = stage.camera, scene = stage.scene;
    const vis = visUniforms(3.3);
    const sideCam = new THREE.PerspectiveCamera(30, 1, 0.05, 100);
    let meshes = [], mat = null, texs = [], sheetW = 1.4, sheetH = 2, cur = null, look = false, revealed = false, order = [], hi = null;
    const eye = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0 };
    let depthK = 1, mBlend = 0, mVel = 0;
    let dead = false;

    function build(id) {
      for (const m of meshes) { scene.remove(m); m.geometry.dispose(); m.material.dispose(); }
      if (mat) { scene.remove(mat); mat.geometry.dispose(); mat.material.dispose(); }
      texs.forEach((t) => t.dispose()); texs = []; meshes = []; mat = null;
      const P = DATA.prints[id]; cur = P;
      const p0 = P.planes[0], W = p0.box[2], H = p0.box[3];
      sheetH = 2; sheetW = 2 * W / H;
      const pic = P.pic, clip = [pic[0] / W, 1 - pic[3] / H, pic[2] / W, 1 - pic[1] / H];
      P.planes.forEach((pl, i) => {
        const [bx, by, bw, bh] = pl.box, over = i === 0 ? 0.16 : 0;
        const w = sheetW * bw / W * (1 + 2 * over), h = sheetH * bh / H * (1 + 2 * over);
        const g = new THREE.PlaneGeometry(w, h);
        if (over) { const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, uv.getX(j) * (1 + 2 * over) - over, uv.getY(j) * (1 + 2 * over) - over); }
        const m = new THREE.Mesh(g, planeMat({ vis, mirror: i === 0, clip: i === 0 ? clip : undefined }));
        m.userData = { id: pl.id, i, cx: ((bx + bw / 2) / W - 0.5) * sheetW, cy: (0.5 - (by + bh / 2) / H) * sheetH, zTrue: pl.z, z: pl.z, zT: pl.z, fixed: !!pl.fixed, label: pl.label, tag: null };
        m.frustumCulled = false; m.visible = false; scene.add(m); meshes.push(m);
        loadTex(pl.file.startsWith('img/') ? pl.file : `img/views/${pl.file}`).then((t) => { if (dead || cur !== P) { t.dispose(); return; } texs.push(t); m.material.uniforms.map.value = t; m.visible = true; if (i === 0) { mat.material.uniforms.map.value = t; mat.visible = true; } kick(); });
      });
      // the sheet's margins, fixed at the window: p0 again with the picture area cut out
      mat = new THREE.Mesh(new THREE.PlaneGeometry(sheetW, sheetH), planeMat({ vis, hole: clip }));
      mat.position.z = 0.03; mat.renderOrder = 100; mat.visible = false; scene.add(mat);
      tags.innerHTML = '';
      meshes.forEach((m) => { if (!m.userData.fixed) { m.userData.tag = el('span', { class: 'view-tag' }); tags.append(m.userData.tag); } });
      // the puzzle's starting order: stored, or the true order reversed with the front two swapped (never the answer)
      const movable = meshes.filter((m) => !m.userData.fixed).map((m) => m.userData.id);
      const truth = trueOrder();
      const saved = store.get(`view:${id}:order`, null);
      order = Array.isArray(saved) && saved.length === movable.length && saved.every((x) => movable.includes(x)) ? saved : (() => { const o = truth.slice().reverse(); [o[0], o[1]] = [o[1], o[0]]; return o.join() === truth.join() ? o.reverse() : o; })();
      revealed = !!store.get(`view:${id}:revealed`, false);
      renderOrder(); renderRules(); applyOrder(true);
      record.innerHTML = '';
      record.append(el('span', { text: `${P.maker}, ` }), el('em', { text: `${P.title}` }), ` (${P.ja}), no. ${P.n} of ${P.series}, ${P.date}. ${P.holder}, ${P.accession}. ${P.licence}. ${P.credit}. `, el('a', { href: P.url, target: '_blank', rel: 'noopener' }, 'Object record'));
      box.setAttribute('aria-label', `${P.title}, cut into ${movable.length} depth planes. Arrow keys move your eye; Home centres it.`);
      tabBtns.forEach((b, j) => { b.setAttribute('aria-selected', String(ids[j] === id)); b.tabIndex = ids[j] === id ? 0 : -1; });
      eye.x = eye.y = eye.tx = eye.ty = 0; hi = null; horizon.hidden = true;
      kick();
    }
    const byId = (id) => meshes.find((m) => m.userData.id === id);
    const trueOrder = () => meshes.filter((m) => !m.userData.fixed).sort((a, b) => b.userData.zTrue - a.userData.zTrue).map((m) => m.userData.id);

    // rebuild: slots front → back; the planes keep their screen size from the front eye (scale (D - z) / D)
    function applyOrder(instant) {
      const exploded = mode === 'rebuild';
      const truth = trueOrder();
      meshes.forEach((m) => {
        const u = m.userData;
        if (u.fixed) { u.zT = 0.02; }
        else if (exploded) { const r = order.indexOf(u.id); u.zT = -0.1 - r * 0.62; }
        else u.zT = u.zTrue * depthK;
        if (instant || motion.reduced) u.z = u.zT;
        void truth;
      });
      kick();
    }
    function renderOrder() {
      orderList.innerHTML = '';
      const truth = trueOrder();
      order.forEach((id, r) => {
        const m = byId(id), t = truth.indexOf(id);
        const li = el('li', { class: 'view-item' + (hi && hi.includes(id) ? ' hi' : '') },
          el('span', { class: 'view-slot', 'aria-hidden': 'true' }, el('i', { class: 'ghost', text: String(r + 1) }), revealed ? el('i', { class: 'truth', text: String(t + 1) }) : null),
          el('span', { class: 'view-item-t', text: m.userData.label }),
          el('button', { type: 'button', class: 'view-mv', 'aria-label': `Move ${m.userData.label} forward`, disabled: r === 0 || null, onclick: () => move(id, -1) }, '↑'),
          el('button', { type: 'button', class: 'view-mv', 'aria-label': `Move ${m.userData.label} back`, disabled: r === order.length - 1 || null, onclick: () => move(id, 1) }, '↓'));
        if (revealed) li.append(el('span', { class: 'vh', text: `Your place ${r + 1}; in the print, place ${t + 1}.` }));
        orderList.append(li);
      });
    }
    function move(id, d) {
      const r = order.indexOf(id), j = r + d; if (j < 0 || j >= order.length) return;
      [order[r], order[j]] = [order[j], order[r]];
      store.set(`view:${pid}:order`, order);
      renderOrder(); applyOrder();
      const b = orderList.children[j]?.querySelectorAll('.view-mv')[d < 0 ? 0 : 1]; (b && !b.disabled ? b : orderList.children[j]?.querySelector('.view-mv:not(:disabled)'))?.focus();
      live.textContent = `${byId(id).userData.label}: now ${j + 1} of ${order.length}, front to back.` + (order.join() === trueOrder().join() ? ' This is the order the print implies.' : '');
    }
    function revealTruth(skip) {
      revealed = true; store.set(`view:${pid}:revealed`, true);
      const truth = trueOrder();
      if (!skip) live.textContent = 'The print’s order, front to back: ' + truth.map((id, i) => `${i + 1}, ${byId(id).userData.label}`).join('; ') + '. Your order stays as hollow numbers.';
      order = truth.slice(); store.set(`view:${pid}:order`, order);
      renderOrder(); renderRules(); applyOrder();
      rulesBox.hidden = false;
      if (skip) rulesBox.querySelector('button')?.focus();
    }
    function renderRules() {
      const ul = rulesBox.querySelector('ul'); ul.innerHTML = '';
      rulesBox.hidden = !(revealed || mode === 'flat');
      for (const r of cur.rules) {
        const b = el('button', { type: 'button', class: 'view-rule', 'aria-pressed': 'false' }, el('b', { text: r.title }), ' ', confChip(r.conf), el('span', { text: r.text }));
        const on = () => { hi = r.planes; [...ul.querySelectorAll('.view-rule')].forEach((x) => x.setAttribute('aria-pressed', String(x === b))); horizon.hidden = !(r.y != null); horizon.dataset.y = r.y ?? ''; if (r.y != null && mode === 'rebuild' && !look) { look = true; lookBtn.setAttribute('aria-pressed', 'true'); lookBtn.textContent = 'Look from the side'; } renderOrder(); kick(); };
        b.addEventListener('click', () => (hi === r.planes ? (hi = null, b.setAttribute('aria-pressed', 'false'), horizon.hidden = true, renderOrder(), kick()) : on()));
        b.addEventListener('focus', on);
        ul.append(el('li', {}, b));
      }
    }
    function setMode(m) {
      mode = m;
      modeBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(MODES[i][0] === m)));
      stepPanel.hidden = m !== 'step'; rebuildPanel.hidden = m !== 'rebuild'; flatPanel.hidden = m !== 'flat';
      pad.hidden = m !== 'step' || motion.reduced;
      stepPanel.querySelector('.view-rm').hidden = !motion.reduced; stepPanel.querySelector('.view-rm-row').hidden = !motion.reduced;
      if (m === 'flat') { eye.tx = eye.ty = 0; }
      hi = null; horizon.hidden = true;
      renderRules(); applyOrder();
      live.textContent = { step: 'Step in: move your eye to see the planes slide.', rebuild: 'Rebuild the depth: put the planes in order, front to back.', flat: 'The flat sheet, as printed.' }[m];
      store.set('view:mode', m);
    }
    function choose(id) { pid = id; store.set('view:print', id); build(id); setMode(mode); }
    function resetAll() { store.set(`view:${pid}:order`, null); store.set(`view:${pid}:revealed`, false); depthIn.value = '100'; depthK = 1; look = false; lookBtn.setAttribute('aria-pressed', 'false'); lookBtn.textContent = 'Look from the front'; build(pid); setMode('step'); }
    function nudge(dx, dy, centre) { if (mode !== 'step') setMode('step'); if (centre) { eye.tx = eye.ty = 0; } else { eye.tx = clampE(eye.tx + dx * 0.14); eye.ty = clampE(eye.ty + dy * 0.1, 0.32); } if (motion.reduced) { eye.x = eye.tx; eye.y = eye.ty; } kick(); }
    const clampE = (v, m = 0.48) => Math.max(-m, Math.min(m, v));

    // input: drag the picture, arrow keys on the box
    let drag = null;
    box.addEventListener('pointerdown', (e) => { if (mode !== 'step' || motion.reduced) return; drag = { x: e.clientX, y: e.clientY, ex: eye.tx, ey: eye.ty }; box.setPointerCapture(e.pointerId); });
    box.addEventListener('pointermove', (e) => { if (!drag) return; const r = box.getBoundingClientRect(); eye.tx = clampE(drag.ex - (e.clientX - drag.x) / r.width * 1.2); eye.ty = clampE(drag.ey + (e.clientY - drag.y) / r.height * 0.8, 0.32); kick(); });
    const endDrag = () => { drag = null; }; box.addEventListener('pointerup', endDrag); box.addEventListener('pointercancel', endDrag);
    box.addEventListener('keydown', (e) => {
      const k = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
      if (k) { e.preventDefault(); nudge(k[0], k[1]); } else if (e.key === 'Home') { e.preventDefault(); nudge(0, 0, true); }
    });
    depthIn.addEventListener('input', () => { depthK = depthIn.value / 100; applyOrder(motion.reduced); });

    // ---------------------------------------------------------------- frame
    const tmpV = new THREE.Vector3(), Q0 = new THREE.Quaternion(), Q1 = new THREE.Quaternion(), P0 = new THREE.Matrix4();
    function viewRect(W, H) {
      // the sheet fits the canvas with a margin; the frustum extends past it (washi shows around the sheet)
      const a = sheetW / sheetH, A = W / H, m = 0.9;
      let vw, vh; if (a > A) { vw = m; vh = m * A / a; } else { vh = m; vw = m * a / A; }
      return [(1 - vw) / 2, (1 - vh) / 2, vw, vh];
    }
    function tick(dt) {
      let moving = false;
      const step = Math.min(dt, 0.05);
      const sp = (o, k, t, v) => { const f = -170 * (o[k] - t) - 26 * o[v]; o[v] += f * step; o[k] += o[v] * step; if (Math.abs(o[k] - t) > 1e-4 || Math.abs(o[v]) > 1e-4) moving = true; else { o[k] = t; o[v] = 0; } };
      if (motion.reduced) { eye.x = eye.tx; eye.y = eye.ty; } else { sp(eye, 'x', eye.tx, 'vx'); sp(eye, 'y', eye.ty, 'vy'); }
      const mT = mode === 'rebuild' && !look ? 1 : 0;
      if (motion.reduced) mBlend = mT; else { const o = { m: mBlend, v: mVel }; sp(o, 'm', mT, 'v'); mBlend = o.m; mVel = o.v; }
      // planes ease to their target depth
      const sorted = [];
      for (const m of meshes) {
        const u = m.userData;
        if (!motion.reduced) { const d = u.zT - u.z; if (Math.abs(d) > 1e-4) { u.z += d * Math.min(1, step * 9); moving = true; } else u.z = u.zT; } else u.z = u.zT;
        const kx = mBlend * mBlend * (3 - 2 * mBlend), s = (D - u.z) / D * (1 - kx) + kx; m.position.set(u.cx * s, u.cy * s, u.z); m.scale.setScalar(s);
        if (u.i === 0) m.material.uniforms.uMirror.value = mBlend > 0.5 ? 0 : 1;
        const dim = hi && !u.fixed && !hi.includes(u.id);
        m.material.uniforms.uTint.value.setScalar(dim ? 0.55 : 1); m.material.uniforms.uMistAmt.value = dim ? 0.35 : 0;
        sorted.push(m);
      }
      sorted.sort((a, b) => a.userData.z - b.userData.z || a.userData.i - b.userData.i).forEach((m, i) => { m.renderOrder = i; });
      if (mat) mat.visible = !!mat.material.uniforms.map.value && mBlend < 0.5;
      for (const m of meshes) if (m.userData.fixed) m.material.uniforms.uOpacity.value = 1 - Math.min(1, mBlend * 2);
      // cameras: the front eye (off-axis window) and the side view; blend position, rotation and projection
      const { W, H } = stage.size();
      const vr = viewRect(W, H);
      const ex = mode === 'flat' ? 0 : eye.x, ey = mode === 'flat' ? 0 : eye.y;
      offAxis(cam, new THREE.Vector3(ex, ey, D), sheetW, sheetH, vr, 0.05, 100);
      if (mBlend > 0.001) {
        const P = cam.projectionMatrix.clone(), pos = cam.position.clone(); Q0.copy(cam.quaternion);
        sideCam.aspect = W / H; sideCam.fov = 32; sideCam.updateProjectionMatrix();
        const n = order.length, mid = -0.1 - (n - 1) * 0.62 / 2, yaw = 0.74, R = 4.4 + n * 0.28;
        sideCam.position.set(Math.sin(yaw) * R, 1.6, mid + Math.cos(yaw) * R); sideCam.lookAt(0.15, -0.05, mid); sideCam.updateMatrixWorld();
        const k = mBlend * mBlend * (3 - 2 * mBlend);
        cam.position.lerpVectors(pos, sideCam.position, k); Q1.copy(sideCam.quaternion); cam.quaternion.slerpQuaternions(Q0, Q1, k); cam.updateMatrixWorld();
        P0.copy(sideCam.projectionMatrix); const a = P.elements, b = P0.elements; for (let i = 0; i < 16; i++) a[i] = a[i] + (b[i] - a[i]) * k;
        cam.projectionMatrix.copy(P); cam.projectionMatrixInverse.copy(P).invert();
      }
      R.getDrawingBufferSize(vis.uRes.value);
      // in front views, clip to the sheet: nothing past its edge (the back plane is overscanned for parallax)
      if (mBlend < 0.5) { R.setScissorTest(true); R.setScissor(vr[0] * W, vr[1] * H, vr[2] * W, vr[3] * H); } else R.setScissorTest(false);
      // tags: one per movable plane (rebuild) at the plane's top-left corner
      const placed = [];
      for (const m of meshes) {
        const t = m.userData.tag; if (!t) continue;
        const show = mode === 'rebuild' && mBlend > 0.5;
        t.style.opacity = show ? '1' : '0'; if (!show) continue;
        const r = order.indexOf(m.userData.id);
        t.textContent = `${r + 1} · ${m.userData.label}`; t.classList.toggle('hi', !!(hi && hi.includes(m.userData.id)));
        tmpV.set(m.position.x - (m.geometry.parameters.width * m.scale.x) / 2, m.position.y + (m.geometry.parameters.height * m.scale.y) / 2, m.position.z).project(cam);
        const tw = t.offsetWidth || 150, th = 22;
        let x = Math.max(4, Math.min(W - tw - 4, (tmpV.x + 1) / 2 * W)), y = Math.max(4, (1 - tmpV.y) / 2 * H - 22);
        for (let k = 0; k < 6; k++) { const h = placed.find((r) => x < r.x + r.w && x + tw > r.x && y < r.y + r.h && y + th > r.y); if (!h) break; y = h.y + h.h + 2; }
        placed.push({ x, y, w: tw, h: th });
        t.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      }
      if (!horizon.hidden && horizon.dataset.y !== '') {
        const y = +horizon.dataset.y; tmpV.set(0, (0.5 - y) * sheetH, 0).project(cam);
        horizon.style.top = `${((1 - tmpV.y) / 2 * H).toFixed(1)}px`; horizon.style.opacity = mBlend < 0.5 ? '1' : '0';
      }
      return moving;
    }
    const kick = () => { if (!dead) stage.loop(tick); };
    stage.onResize(() => kick());
    motion.on?.(() => setMode(mode));

    build(pid);
    setMode(ids.includes(params.print) && params.mode ? params.mode : store.get('view:mode', 'step'));
    ctx.scope?.onDispose?.(() => api.destroy());

    function flatFallback() {
      // no WebGL: the sheet as a DOM stack of the cut planes (it recomposes exactly), with the record and the rules
      box.innerHTML = ''; pad.hidden = true; modes.hidden = true; stepPanel.hidden = rebuildPanel.hidden = true; flatPanel.hidden = false;
      const P = DATA.prints[pid], p0 = P.planes[0];
      const st = el('div', { class: 'view-flatstack', style: `aspect-ratio:${p0.box[2]} / ${p0.box[3]}` });
      P.planes.forEach((pl) => st.append(el('img', { src: `img/views/${pl.file}`, alt: '', style: `left:${pl.box[0] / p0.box[2] * 100}%;top:${pl.box[1] / p0.box[3] * 100}%;width:${pl.box[2] / p0.box[2] * 100}%` })));
      box.append(st); cur = P; revealed = true; renderRules();
      record.textContent = `${P.maker}, ${P.title}, ${P.date}. ${P.holder}, ${P.accession}. ${P.licence}.`;
      return { destroy() { root.innerHTML = ''; }, describe: () => `${P.title}: the flat sheet (3D view not available).` };
    }

    const api = {
      destroy() { if (dead) return; dead = true; texs.forEach((t) => t.dispose()); stage.dispose(); root.innerHTML = ''; },
      describe() { return `Step into the View: ${cur.title} by Hiroshige, ${mode === 'flat' ? 'as the flat sheet' : mode === 'rebuild' ? 'its depth planes laid out for reordering' : 'cut into depth planes you can look between'}.`; },
      // test hooks
      _set(o) { if (o.print) choose(o.print); if (o.mode) setMode(o.mode); if (o.eye) { eye.tx = eye.x = o.eye[0]; eye.ty = eye.y = o.eye[1]; } if (o.look != null) { look = o.look; } if (o.reveal) revealTruth(); if (o.rule != null) rulesBox.querySelectorAll('.view-rule')[o.rule]?.click(); if (o.instant) { mBlend = mode === 'rebuild' && !look ? 1 : 0; meshes.forEach((m) => { m.userData.z = m.userData.zT; }); } kick(); },
    };
    return api;
  },
};

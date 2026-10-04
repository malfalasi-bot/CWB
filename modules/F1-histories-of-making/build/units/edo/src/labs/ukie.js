// Lab · The uki-e box. Okumura Masanobu's perspective view of a kabuki theatre (1748, Met JP3059, CC0).
//   Flat layers — the sheet split into horizontal bands set one behind another, the older way of stacking space;
//   Draw the lines — the receding lines of floor, walkway and galleries drawn over the sheet and run on to where
//                    they meet; the ceiling beams too (they meet elsewhere on the same horizon);
//   Fold into a box — the sheet folds into floor, walls, ceiling and stage (the "Tour into the Picture" method):
//                    from the original eye nothing changes; swing away and the constructed space shows.
// Every vertex slides along its own line of sight, so from the front the fold is invisible: that is the lesson.
// Reduced motion: folds and swings cut; nothing animates on its own.
import { el, motion as M0 } from '../util.js';
import { confChip } from '../cards.js';
import './ukie.css';

const MODES = [['bands', 'Flat layers'], ['lines', 'Draw the lines'], ['box', 'Fold into a box']];
const ZP = -0.65; // the picture plane (the flat sheet sits here)

export default {
  id: 'ukie', title: 'The uki-e box', kicker: 'Lab · perspective',
  async mount(root, ctx = {}) {
    const motion = ctx.motion || M0, mode0 = ctx.mode || 'stage';
    const store = ctx.store || { get: (k, f) => f, set() {} };
    const DATA = await fetch('data/views.json').then((r) => r.json());
    const U = DATA.ukie, ah = U.h / U.w, cx = U.vp[0], cy = U.vp[1] * ah, f = U.focal;
    let mode = 'bands';
    root.innerHTML = '';

    // ---------------------------------------------------------------- DOM
    const live = el('p', { class: 'ukie-live', 'aria-live': 'polite' });
    const head = el('div', { class: 'ukie-head' }, el('span', { class: 'ukie-label', text: 'Lab · perspective' }), el('h3', { class: 'ukie-title', text: 'The uki-e box' }),
      el('button', { type: 'button', class: 'ukie-reset', onclick: () => { swing.ty = swing.tp = 0; setMode('bands'); } }, 'Reset'));
    const box = el('div', { class: 'ukie-box', tabindex: '0', role: 'application', 'aria-roledescription': 'perspective box', 'aria-label': 'Masanobu’s theatre. Arrow keys swing the view; Home returns to the front.' });
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'ukie-svg'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('viewBox', `0 0 1 ${ah}`); svg.setAttribute('preserveAspectRatio', 'none');
    const swingBtn = (lab, dy, dp, txt) => el('button', { type: 'button', class: 'ukie-pad-b', 'aria-label': lab, onclick: () => turn(dy, dp) }, txt);
    const pad = el('div', { class: 'ukie-pad', role: 'group', 'aria-label': 'Swing the view' }, swingBtn('Swing up', 0, 1, '▲'), swingBtn('Swing left', -1, 0, '◀'),
      el('button', { type: 'button', class: 'ukie-pad-b c', 'aria-label': 'Back to the front view', onclick: () => turn(0, 0, true) }, '●'), swingBtn('Swing right', 1, 0, '▶'), swingBtn('Swing down', 0, -1, '▼'));
    const note = el('p', { class: 'ukie-note', 'aria-hidden': 'true' });
    const stageWrap = el('div', { class: 'ukie-stage' }, box, svg, pad, note);
    const modeBtns = MODES.map(([m, lab]) => el('button', { type: 'button', class: 'ukie-mode', 'aria-pressed': 'false', onclick: () => setMode(m) }, lab));
    const PANEL = {
      bands: 'Many earlier pictures stacked space in bands: the higher on the sheet, the farther away. Here the sheet is cut into bands and set one behind another. Swing the view: each band is a flat cut-out, like scenery on a stage.',
      lines: 'Uki-e follow a Western rule: lines running away from you meet at one point on the horizon. The lines drawn here come from the sheet itself.',
      box: 'Fold the sheet into floor, walls, ceiling and stage. From the front nothing changes. Swing away, and the space turns out to be a constructed box with the crowd painted flat on its floor.',
    };
    const panelP = el('p', { class: 'ukie-p' });
    const meet = el('p', { class: 'ukie-meet' });
    const side = el('div', { class: 'ukie-side' }, el('div', { class: 'ukie-modes', role: 'group', 'aria-label': 'Show the sheet as' }, ...modeBtns), panelP, meet, live,
      el('p', { class: 'ukie-record' }, `${U.maker}, `, el('em', { text: U.title }), `, ${U.date}. ${U.holder}, ${U.accession}. ${U.licence}. `, el('a', { href: U.url, target: '_blank', rel: 'noopener' }, 'Object record')));
    const foot = el('div', { class: 'ukie-foot' },
      el('div', { class: 'ukie-what' }, el('h4', { text: 'What this shows' }), el('p', { text: U.what })),
      el('p', { class: 'ukie-honest', html: '<strong>Reconstruction.</strong> The box, the bands and the vanishing point are ours, fitted to the sheet; Masanobu’s print is one flat sheet.' }),
      el('div', { class: 'ukie-sources' }, el('h4', { text: 'Sources' }), el('ul', {}, ...U.sources.map((s) => el('li', {}, el('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.title), ' ', confChip(s.conf))))));
    const bench = el('section', { class: `ukie-bench m-${mode0}`, 'aria-label': 'The uki-e box' }, head, el('div', { class: 'ukie-main' }, stageWrap, side), foot);
    root.append(bench);

    // ---------------------------------------------------------------- lines (SVG over the sheet)
    const lineFrom = (s) => { const [x1, y1, x2, y2] = s; return { x1, y1: y1 * ah, x2, y2: y2 * ah }; };
    const toHorizon = (L) => { const t = (cy - L.y1) / (L.y2 - L.y1 || 1e-6); return { x: L.x1 + (L.x2 - L.x1) * t, y: cy }; };
    const floor = U.floorLines.map(lineFrom), ceil = U.ceilingLines.map(lineFrom);
    const ceilX = ceil.map((L) => toHorizon(L).x);
    const mk = (tag, a) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); return e; };
    function drawLines() {
      svg.innerHTML = '';
      const sw = 0.0025;
      svg.append(mk('line', { x1: 0, y1: cy, x2: 1, y2: cy, class: 'ukie-hz', 'stroke-width': sw }));
      floor.forEach((L, i) => { const g = mk('g', { class: 'ukie-fl', style: `--i:${i}` }); g.append(mk('line', { x1: L.x1, y1: L.y1, x2: cx, y2: cy, class: 'ext', 'stroke-width': sw * 0.8 }), mk('line', { x1: L.x1, y1: L.y1, x2: L.x2, y2: L.y2, class: 'seg', 'stroke-width': sw * 2.2 })); svg.append(g); });
      ceil.forEach((L, i) => { const h = toHorizon(L); const g = mk('g', { class: 'ukie-cl', style: `--i:${i + floor.length}` }); g.append(mk('line', { x1: L.x1, y1: L.y1, x2: h.x, y2: h.y, class: 'ext', 'stroke-width': sw * 0.8 }), mk('line', { x1: L.x1, y1: L.y1, x2: L.x2, y2: L.y2, class: 'seg', 'stroke-width': sw * 2.2 })); svg.append(g); });
      const lo = Math.min(...ceilX), hi = Math.max(...ceilX);
      svg.append(mk('line', { x1: lo, y1: cy + 0.012, x2: hi, y2: cy + 0.012, class: 'ukie-spread', 'stroke-width': sw * 1.4 }));
      svg.append(mk('circle', { cx, cy, r: 0.011, class: 'ukie-vp', 'stroke-width': sw * 1.4 }));
      meet.innerHTML = '';
      meet.append(el('span', { class: 'ukie-key fl', 'aria-hidden': 'true' }), ` ${floor.length} floor, walkway and gallery lines meet close to one point on the stage, ${Math.round(U.vp[1] * 100)}% of the way down the sheet. `,
        el('span', { class: 'ukie-key cl', 'aria-hidden': 'true' }), ` ${ceil.length} ceiling beams reach that horizon spread over ${Math.round((hi - lo) * 100)}% of its width, not at one point. `, confChip('argued'));
    }

    // ---------------------------------------------------------------- WebGL
    const { THREE, makeStage, webglOK, loadTex } = await import('../3d/common.js');
    const { GLSL_INK } = await import('../3d/planes.js');
    if (!webglOK()) {
      box.append(el('img', { class: 'ukie-flat', src: `img/ukie/${U.file}`, alt: `${U.title}, ${U.maker}, ${U.date}.` }));
      modeBtns[2].disabled = true; pad.hidden = true; drawLines(); setMode('lines', true);
      return { destroy() { root.innerHTML = ''; }, describe: () => 'The uki-e theatre with its vanishing lines (3D view not available).' };
    }
    const stage = makeStage(box, { fov: 30, onTier: () => kick() });
    const R = stage.renderer, scene = stage.scene, cam = stage.camera;
    const grp = new THREE.Group(); scene.add(grp);
    const pivot = new THREE.Vector3(-0.08, 0.02, -0.66);
    const mat = new THREE.ShaderMaterial({
      side: THREE.DoubleSide, transparent: true, depthWrite: true, depthTest: true,
      uniforms: { map: { value: null }, uMix: { value: 0 }, uDim: { value: 0 }, uPaper: { value: new THREE.Color(1, 1, 1) } },
      vertexShader: /* glsl */`attribute vec3 aFlat; uniform float uMix; varying vec2 vUv; varying float vShade;
        void main(){ vUv = uv; vec3 p = mix(aFlat, position, uMix); vShade = 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
      fragmentShader: /* glsl */`${GLSL_INK} uniform sampler2D map; uniform float uDim; varying vec2 vUv; varying float vShade;
        void main(){ if (vUv.x < 0.0 || vUv.y < 0.0 || vUv.x > 1.0 || vUv.y > 1.0) discard; vec4 c = texture2D(map, vUv);
          c.rgb *= 1.0 - uDim; gl_FragColor = vec4(c.rgb, 1.0);
          #include <colorspace_fragment>
        }`,
    });
    const proj = (P) => [cx + f * P.x / -P.z, cy - f * P.y / -P.z];
    // a grid between four 3D corners (bilinear), with uv from the original eye and the flat position on the picture plane
    function patch(c00, c10, c01, c11, nx = 24, ny = 24) {
      const pos = [], flat = [], uv = [], idx = [];
      for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
        const a = i / nx, b = j / ny;
        const P = new THREE.Vector3().copy(c00).multiplyScalar((1 - a) * (1 - b)).addScaledVector(c10, a * (1 - b)).addScaledVector(c01, (1 - a) * b).addScaledVector(c11, a * b);
        const [u, v] = proj(P);
        pos.push(P.x, P.y, P.z); const F = P.clone().multiplyScalar(ZP / P.z); flat.push(F.x, F.y, F.z); uv.push(u, 1 - v / ah);
        if (i < nx && j < ny) { const k = j * (nx + 1) + i; idx.push(k, k + 1, k + nx + 1, k + 1, k + nx + 2, k + nx + 1); }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aFlat', new THREE.Float32BufferAttribute(flat, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
      return g;
    }
    // the box, from the inner rectangle (the stage) and the vanishing point
    const [ix0, iy0, ix1, iy1] = U.inner, Zb = -1, Zn = -0.3;
    const Xl = (ix0 - cx) * -Zb / f, Xr = (ix1 - cx) * -Zb / f, Yc = (cy - iy0 * ah) * -Zb / f, Yf = (cy - iy1 * ah) * -Zb / f;
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
    const boxGeo = [
      patch(V3(Xl, Yf, Zb), V3(Xr, Yf, Zb), V3(Xl, Yc, Zb), V3(Xr, Yc, Zb), 8, 8), // back: the stage
      patch(V3(Xl, Yf, Zn), V3(Xr, Yf, Zn), V3(Xl, Yf, Zb), V3(Xr, Yf, Zb)), // floor: pit and walkway
      patch(V3(Xl, Yc, Zb), V3(Xr, Yc, Zb), V3(Xl, Yc, Zn), V3(Xr, Yc, Zn)), // ceiling
      patch(V3(Xl, Yf, Zn), V3(Xl, Yf, Zb), V3(Xl, Yc, Zn), V3(Xl, Yc, Zb)), // left galleries
      patch(V3(Xr, Yf, Zb), V3(Xr, Yf, Zn), V3(Xr, Yc, Zb), V3(Xr, Yc, Zn)), // right galleries
    ];
    // the bands: horizontal strips of the sheet, each pushed back along its lines of sight (higher = farther)
    const nb = U.bands.length - 1;
    const atPic = (u, v) => V3((u - cx) * -ZP / f, (cy - v * ah) * -ZP / f, ZP);
    const bandGeo = U.bands.slice(0, -1).map((v0, i) => {
      const v1 = U.bands[i + 1], z = ZP - (nb - 1 - i) * 0.16 - 0.02;
      const s = z / ZP, a = atPic(-0.15, v1), b = atPic(1.15, v1), c = atPic(-0.15, v0), d = atPic(1.15, v0);
      const g = patch(a.clone().multiplyScalar(s), b.clone().multiplyScalar(s), c.clone().multiplyScalar(s), d.clone().multiplyScalar(s), 16, 4);
      return g;
    });
    const boxM = boxGeo.map((g) => new THREE.Mesh(g, mat)), bandM = bandGeo.map((g) => { const m = new THREE.Mesh(g, mat.clone()); return m; });
    boxM.forEach((m) => grp.add(m)); bandM.forEach((m, i) => { m.renderOrder = i; grp.add(m); });
    const tex = await loadTex(`img/ukie/${U.file}`);
    mat.uniforms.map.value = tex; bandM.forEach((m) => { m.material.uniforms.map.value = tex; });

    // ---------------------------------------------------------------- state, input, frame
    const swing = { y: 0, p: 0, ty: 0, tp: 0, vy: 0, vp: 0 };
    let fold = 0, foldT = 0, foldV = 0, band = 0, bandT = 0, bandV = 0, dead = false;
    function setMode(m, quiet) {
      mode = m; modeBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(MODES[i][0] === m)));
      panelP.textContent = PANEL[m];
      svg.classList.toggle('on', m === 'lines'); svg.classList.toggle('anim', m === 'lines' && !motion.reduced);
      meet.hidden = m !== 'lines';
      foldT = m === 'box' ? 1 : 0; bandT = m === 'bands' ? 1 : 0;
      if (m === 'lines') { swing.ty = swing.tp = 0; }
      if (m === 'box' && !motion.reduced && Math.abs(swing.ty) < 0.05) { swing.ty = -0.32; swing.tp = 0.08; }
      if (m === 'bands' && !motion.reduced && Math.abs(swing.ty) < 0.05) { swing.ty = 0.42; swing.tp = 0.05; }
      if (motion.reduced) { fold = foldT; band = bandT; swing.y = swing.ty; swing.p = swing.tp; }
      pad.hidden = m === 'lines';
      note.textContent = m === 'box' ? 'Floor, walls and ceiling are the sheet, folded' : m === 'bands' ? 'Bands of the sheet, set one behind another' : '';
      if (!quiet) live.textContent = { bands: 'Flat layers: the sheet in bands, one behind another.', lines: 'The receding lines, drawn on the sheet.', box: 'The sheet folded into a box. Swing the view to see it.' }[m];
      store.set('ukie:mode', m); kick();
    }
    function turn(dy, dp, home) { if (mode === 'lines') setMode('box'); if (home) { swing.ty = swing.tp = 0; } else { swing.ty = Math.max(-0.6, Math.min(0.6, swing.ty + dy * 0.12)); swing.tp = Math.max(-0.25, Math.min(0.3, swing.tp + dp * 0.06)); } if (motion.reduced) { swing.y = swing.ty; swing.p = swing.tp; } live.textContent = home ? 'Front view: the sheet as Masanobu drew it.' : `Swung ${Math.round(Math.abs(swing.ty) * 57)}° ${swing.ty < 0 ? 'left' : 'right'}.`; kick(); }
    let drag = null;
    box.addEventListener('pointerdown', (e) => { if (mode === 'lines') return; drag = { x: e.clientX, y: e.clientY, a: swing.ty, b: swing.tp }; box.setPointerCapture(e.pointerId); });
    box.addEventListener('pointermove', (e) => { if (!drag) return; const r = box.getBoundingClientRect(); swing.ty = Math.max(-0.6, Math.min(0.6, drag.a + (e.clientX - drag.x) / r.width * 1.4)); swing.tp = Math.max(-0.25, Math.min(0.3, drag.b + (e.clientY - drag.y) / r.height * 0.6)); if (motion.reduced) { swing.y = swing.ty; swing.p = swing.tp; } kick(); });
    const up = () => { drag = null; }; box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
    box.addEventListener('keydown', (e) => { const k = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key]; if (k) { e.preventDefault(); turn(k[0], k[1]); } else if (e.key === 'Home') { e.preventDefault(); turn(0, 0, true); } });

    let rect = [0, 0, 1, 1];
    function frustum(W, H) {
      // the sheet fills the canvas (contain, margin m), the eye's frustum extended to the rest of the canvas
      const m = 0.92, A = W / H, a = 1 / ah;
      let vw, vh; if (a > A) { vw = m; vh = m * A / a; } else { vh = m; vw = m * a / A; }
      const vx = (1 - vw) / 2, vy = (1 - vh) / 2; rect = [vx, vy, vw, vh];
      const l0 = -cx / f, r0 = (1 - cx) / f, t0 = cy / f, b0 = -(ah - cy) / f;
      const sx = (r0 - l0) / vw, sy = (t0 - b0) / vh, L = l0 - vx * sx, B = b0 - vy * sy, n = 0.02;
      cam.position.set(0, 0, 0); cam.quaternion.identity(); cam.updateMatrixWorld();
      cam.projectionMatrix.makePerspective(L * n, (L + sx) * n, (B + sy) * n, B * n, n, 50); cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
      Object.assign(svg.style, { left: `${vx * 100}%`, width: `${vw * 100}%`, top: `${vy * 100}%`, height: `${vh * 100}%` });
    }
    const Mx = new THREE.Matrix4(), T1 = new THREE.Matrix4(), T2 = new THREE.Matrix4(), Rq = new THREE.Quaternion(), E = new THREE.Euler();
    function tick(dt) {
      let moving = false; const st = Math.min(0.05, dt);
      const sp = (v, t, vel, k = 120, c = 22) => { const fz = -k * (v - t) - c * vel; vel += fz * st; v += vel * st; if (Math.abs(v - t) < 1e-4 && Math.abs(vel) < 1e-4) return [t, 0]; moving = true; return [v, vel]; };
      if (!motion.reduced) { [swing.y, swing.vy] = sp(swing.y, swing.ty, swing.vy, 90, 19); [swing.p, swing.vp] = sp(swing.p, swing.tp, swing.vp, 90, 19); [fold, foldV] = sp(fold, foldT, foldV, 40, 12.6); [band, bandV] = sp(band, bandT, bandV, 40, 12.6); }
      else { swing.y = swing.ty; swing.p = swing.tp; fold = foldT; band = bandT; }
      const { W, H } = stage.size(); frustum(W, H);
      const bandsOn = band > 0.01, boxOn = !bandsOn;
      boxM.forEach((m) => { m.visible = boxOn; }); bandM.forEach((m) => { m.visible = bandsOn; m.material.uniforms.uMix.value = band; });
      mat.uniforms.uMix.value = fold;
      E.set(swing.p, swing.y, 0); Rq.setFromEuler(E);
      T1.makeTranslation(-pivot.x, -pivot.y, -pivot.z); T2.makeTranslation(pivot.x, pivot.y, pivot.z); Mx.makeRotationFromQuaternion(Rq);
      grp.matrixAutoUpdate = false; grp.matrix.copy(T2).multiply(Mx).multiply(T1); grp.matrixWorldNeedsUpdate = true;
      return moving;
    }
    const kick = () => { if (!dead) stage.loop(tick); };
    stage.onResize(() => kick());
    motion.on?.(() => setMode(mode, true));
    drawLines();
    setMode(ctx.params?.mode || store.get('ukie:mode', 'bands'), true);
    ctx.scope?.onDispose?.(() => api.destroy());
    const api = {
      destroy() { if (dead) return; dead = true; tex.dispose(); stage.dispose(); root.innerHTML = ''; },
      describe() { return `The uki-e box: Masanobu’s 1748 kabuki theatre ${mode === 'box' ? 'folded into a perspective box' : mode === 'lines' ? 'with its vanishing lines drawn' : 'split into flat bands'}.`; },
      _set(o) { if (o.mode) setMode(o.mode); if (o.swing) { swing.ty = swing.y = o.swing[0]; swing.tp = swing.p = o.swing[1]; } if (o.instant) { fold = foldT; band = bandT; } kick(); },
    };
    return api;
  },
};

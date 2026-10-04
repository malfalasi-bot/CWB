// The overture: nine shots, one scroll-scrubbed composition (setProgress(p), p = shot index + fraction, 0..9).
// paper → wave → shop → blocks → edo → seal → sea → return → contents.
// Each shot is its own small scene and camera; shots hand over with an ink bleed in screen space (or, wave → shop,
// a matched cut on the same sheet), so the eye reads one continuous move. Render-on-demand; ≤ 6 GPU textures live
// (TexPool, hard cap), ≤ ~20 draw calls per frame, every texture ≤ 2048 px. Under reduced motion setProgress gets
// integers and the module cuts between composed stills (no camera moves, no parallax, no smoothing).
// The Story builder owns the scroll section, captions, skip link and still-image fallback (src/overture.js).
import { THREE, makeStage, token, paperOverlay, webglOK, initialTier, ease, spring } from './common.js';
import { planeMat, kasumiMat, washiMesh, visUniforms, fitDistance, planeStack, TexPool, canvasTex, GLSL_INK, sstep, clamp01, lerp } from './planes.js';
import { geoEquirectangular, geoPath, geoGraticule } from 'd3-geo';
import { feature } from 'topojson-client';
import { motion } from '../util.js';

const SHOTS = ['paper', 'wave', 'shop', 'blocks', 'edo', 'seal', 'sea', 'return', 'contents'];
const HERO = [0.62, 0.55, 0.62, 0.6, 0.86, 0.58, 0.86, 0.72, 1.0]; // composed still per shot (reduced motion)
const DESCRIBE = [
  'Washi paper; the characters 浮世, ukiyo, the floating world, soak in like ink.',
  'Hokusai’s Great Wave, cut into five planes that separate in depth, with mist bands between them.',
  'The Wave shrinks to one sheet on the wall of a print shop, Hokusai’s view of Tsutaya’s Kōshodō.',
  'The colour blocks of the Wave hover over a cherry block and drop one by one onto the kentō registration marks.',
  'The 1859 map of Edo tilts flat; pins rise at the publishers’ streets and the Tōkaidō draws west from Nihonbashi.',
  'A round kiwame seal, 極, approved, stamps the sheet in red.',
  'A world outline; a route draws from Yokohama to Paris and the cover of Le Japon artistique flies along it.',
  'The Wave returns inside a schematic banknote outline.',
  'Five woodblocks, one for each act, fan out as the contents.',
];
const SHEET = { w: 1600, h: 1075 };
const PALE = new THREE.Color('#f3ead6');

// 1859 sheet georeference (content/georef59.json; px = M·[dx km, dy km] + t)
function geo59(G, lat, lon) {
  const dx = (lon - G.lon0) * 111.32 * Math.cos((G.lat0 * Math.PI) / 180), dy = (lat - G.lat0) * 110.57, M = G.M;
  return [((M[0][0] * dx + M[1][0] * dy + M[2][0]) / G.W) * 100, ((M[0][1] * dx + M[1][1] * dy + M[2][1]) / G.H) * 100];
}

const CSS = `
.ov-root{position:relative;overflow:hidden;contain:paint}
.ov-root canvas.gl{position:absolute;inset:0;display:block}
.ov-labels{position:absolute;inset:0;pointer-events:none;font:500 12px/1.2 var(--ui,system-ui,sans-serif);color:var(--ink,#1D1A15)}
.ov-lab{position:absolute;left:0;top:0;white-space:nowrap;transform-origin:0 50%;opacity:0;will-change:transform,opacity}
.ov-lab span{display:inline-block;padding:3px 7px;border-radius:999px;background:color-mix(in srgb,var(--paper,#F1EADB) 88%,transparent);box-shadow:0 1px 0 rgba(0,0,0,.06)}
.ov-lab small{display:block;font:400 11px/1.2 var(--ui,system-ui,sans-serif);color:var(--ink-2,#554E42);margin-top:1px}
.ov-lab.big span{font:600 14px/1.2 var(--ui,system-ui,sans-serif)}
.ov-lab.road span{background:none;box-shadow:none;color:#233C6B;font:600 12px/1.2 var(--ui,system-ui,sans-serif);letter-spacing:.02em}
`;

export default {
  id: 'overture',
  async mount(root, ctx = {}) {
    if (!webglOK() || ctx.tier === 0 || initialTier() === 0) throw new Error('The overture needs WebGL; show the still frames instead.');
    const C = ctx.C || {};
    const reduced = () => !!(ctx.motion || motion).reduced;
    if (!document.getElementById('ov-style')) document.head.append(Object.assign(document.createElement('style'), { id: 'ov-style', textContent: CSS }));
    if (getComputedStyle(root).position === 'static') root.style.position = 'relative';
    root.classList.add('ov-root');
    const labelsEl = document.createElement('div'); labelsEl.className = 'ov-labels'; labelsEl.setAttribute('aria-hidden', 'true');

    let tick;
    const stage = makeStage(root, { fov: 30, tier: ctx.tier, onTier: () => kick() });
    root.append(labelsEl);
    const R = stage.renderer; R.autoClear = false; R.info.autoReset = false;
    const phone = () => stage.tier < 2 || matchMedia('(max-width: 820px)').matches;
    const base = ctx.base || '';
    const url = (p) => base + p;

    // ---------------------------------------------------------------- tokens (both themes)
    const T = {};
    const readTokens = () => {
      for (const [k, n, f] of [['paper', '--paper', '#F1EADB'], ['ink', '--ink', '#1D1A15'], ['ink2', '--ink-2', '#554E42'], ['ink3', '--ink-3', '#857C6B'],
        ['indigo', '--indigo', '#233C6B'], ['seal', '--seal', '#B3301E'], ['land', '--land', '#E4D8BE'], ['coast', '--coast', '#4A4234'], ['line', '--line-2', '#C2B596']]) T[k] = token(n, f);
      T.dark = T.paper.r + T.paper.g + T.paper.b < 0.6;
    };
    readTokens();

    // ---------------------------------------------------------------- textures (hard cap 6 on the GPU)
    const pool = new TexPool(R, 6, () => kick());
    const waveKeys = ['p0', 'p1', 'p2', 'p3', 'p4'].map((k) => 'wave-' + k);
    waveKeys.forEach((k) => pool.def(k, url(`img/ov/${k}.webp`)));
    pool.def('shop', url('img/printshop.webp'));
    const PEEL = ['grey', 'beige', 'mid', 'deep'];
    PEEL.forEach((k) => pool.def('peel-' + k, url(`img/peel/${k}.webp`)));
    pool.def('map', url('img/ov/map-1859.webp'));
    pool.def('japon', url('img/japon-artistique.webp'));
    // the flattened Wave, baked on the CPU from the five planes (one texture instead of five, no extra download)
    pool.def('bake', () => {
      if (!waveKeys.every((k) => pool.ready(k))) { pool.prefetch(waveKeys); return null; }
      return canvasTex(SHEET.w, SHEET.h, (g) => waveKeys.forEach((k) => g.drawImage(pool.img.get(k).im, 0, 0, SHEET.w, SHEET.h)));
    });
    pool.def('title', () => titleTex(), { linear: true });
    pool.def('seal', () => sealTex(), { linear: true });
    pool.def('note', () => noteTex(), { linear: true });
    pool.def('labels', () => slabLabelTex(), { linear: true });
    let land = null;
    pool.def('world', () => (land ? worldTex() : null), { linear: true });
    fetch(url('data/land-110m.json')).then((r) => r.json()).then((topo) => { land = feature(topo, topo.objects.land); kick(); }).catch(() => {});
    const PREFETCH = [['wave-p0', 'wave-p1', 'wave-p2', 'wave-p3', 'wave-p4'], ['shop'], ['peel-grey', 'peel-beige', 'peel-mid', 'peel-deep'], ['map'], [], ['japon'], [], [], []];

    // ---------------------------------------------------------------- common pieces
    const washi = washiMesh(T.paper);
    const bgScene = new THREE.Scene(); bgScene.add(washi);
    const bgCam = new THREE.Camera();
    stage.scene.add(paperOverlay(T.dark ? 0.05 : 0.075));
    const allVis = [];
    const mkVis = (seed) => { const v = visUniforms(seed); allVis.push(v); return v; };
    const fov = 30;
    let A = 1; // aspect
    const restD = () => fitDistance(SHEET.w / 500 * 1.06, SHEET.h / 500 * 1.06, fov, A, A < 0.9 ? 0.62 : 0.0);
    const camAt = (cam, pos, look) => { cam.position.copy(pos); cam.lookAt(look); cam.updateMatrixWorld(); };
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    const labels = [];
    const addLabel = (shot, html, cls = '') => { const e = document.createElement('div'); e.className = 'ov-lab ' + cls; e.innerHTML = html; labelsEl.append(e); const L = { shot, e, pos: new THREE.Vector3(), a: 0, obj: null, dx: 8, dy: 0 }; labels.push(L); return L; };

    // ================================================================ shot 0: paper
    function titleTex() {
      const S = 1024, fam = '"Shippori Mincho","Noto Serif CJK JP","Hiragino Mincho ProN","Yu Mincho",serif';
      const crisp = document.createElement('canvas'); crisp.width = crisp.height = S;
      const g = crisp.getContext('2d'); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = `800 400px ${fam}`; g.fillText('浮', S / 2, S * 0.29); g.fillText('世', S / 2, S * 0.71);
      const blur = (src, k) => { const s = document.createElement('canvas'); s.width = s.height = S / k; const sg = s.getContext('2d'); sg.imageSmoothingQuality = 'high'; sg.drawImage(src, 0, 0, S / k, S / k); const o = document.createElement('canvas'); o.width = o.height = S; const og = o.getContext('2d'); og.imageSmoothingQuality = 'high'; og.drawImage(s, 0, 0, S, S); return o; };
      const soft = blur(blur(crisp, 12), 6);
      const a = g.getImageData(0, 0, S, S).data, b = soft.getContext('2d').getImageData(0, 0, S, S).data;
      const out = new Uint8Array(S * S * 4);
      for (let i = 0; i < S * S; i++) { out[i * 4] = a[i * 4 + 3]; out[i * 4 + 1] = Math.min(255, b[i * 4 + 3] * 1.6); out[i * 4 + 3] = 255; }
      const t = new THREE.DataTexture(out, S, S, THREE.RGBAFormat); t.flipY = true; t.needsUpdate = true; return t;
    }
    const shot0 = (() => {
      const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(fov, 1, 0.1, 100), vis = mkVis(2.2);
      const mat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, depthTest: false,
        uniforms: { ...vis, map: { value: null }, uT: { value: 0 }, uInk: { value: T.ink } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `${GLSL_INK}
          uniform float uIn; uniform float uOut; uniform float uSeed; uniform vec2 uRes; uniform vec2 uOrigin;
          uniform sampler2D map; uniform float uT; uniform vec3 uInk; varying vec2 vUv;
          void main(){
            vec4 tx = texture2D(map, vUv); float crisp = tx.r, soft = tx.g;
            float n = vnoise(vUv * 38.0) * 0.6 + vnoise(vUv * 140.0) * 0.4;
            float front = 1.0 - uT * 1.18;
            float wet = smoothstep(front, front + 0.08, soft + (n - 0.5) * 0.3);
            float halo = soft * 0.16 * wet * (1.0 - smoothstep(0.55, 1.0, uT) * 0.75);
            float a = max(crisp * wet, halo);
            vec2 sc = gl_FragCoord.xy / uRes.y; vec2 o = uOrigin * vec2(uRes.x / uRes.y, 1.0);
            float m = inkFade(sc, uOut, uSeed + 7.1);
            vec3 c = uInk * (1.0 - (1.0 - crisp) * 0.0);
            gl_FragColor = vec4(c, a * m);
            if (gl_FragColor.a < 0.003) discard;
            #include <colorspace_fragment>
          }`,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), mat); scene.add(mesh);
      return {
        scene, cam, vis,
        needs: (t) => (t < 1.2 ? ['title'] : []),
        update(t) {
          mat.uniforms.map.value = pool.get('title'); mesh.visible = !!mat.uniforms.map.value;
          mat.uniforms.uT.value = sstep(0.02, 0.62, t);
          const d = fitDistance(1.5, 1.5, fov, A, 0) * (A < 0.9 ? 1.25 : 1.5);
          mesh.position.y = lerp(0, 0.06, sstep(0.5, 1.1, t));
          camAt(cam, V(0, 0, d * lerp(1, 0.94, sstep(0.0, 1.0, t))), V(0, 0, 0));
        },
      };
    })();

    // ================================================================ shot 1: wave (multi-plane)
    const WAVE_Z = [-1.55, -0.95, -0.45, -0.18, 0.22];
    const shot1 = (() => {
      const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(fov, 1, 0.05, 100), vis = mkVis(4.7);
      const ww = SHEET.w / 500;
      const stack = planeStack(WAVE_Z.map((z) => ({ tex: null, z })), SHEET, ww, 6, vis, { mist: PALE });
      scene.add(stack.group);
      // kasumi: a band at Fuji's foot between the back plane and the far swell; a high band behind the crest
      const k1 = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.26), kasumiMat({ vis, aspect: 10, seed: 2.0 }));
      const k2 = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.22), kasumiMat({ vis, aspect: 8.6, seed: 9.0 }));
      const k3 = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.16), kasumiMat({ vis, aspect: 7.5, seed: 5.0 }));
      k1.userData = { x: 0.78, y: -0.5, z: -1.2, o: 0.92 }; k2.userData = { x: 0.95, y: 0.5, z: -1.4, o: 0.75 }; k3.userData = { x: 0.15, y: 0.78, z: -1.45, o: 0.6 };
      [k1, k2, k3].forEach((k) => { k.renderOrder = 0.5; scene.add(k); });
      const bake = new THREE.Mesh(new THREE.PlaneGeometry(ww, ww * SHEET.h / SHEET.w), planeMat({ vis })); bake.visible = false; scene.add(bake);
      const ptr = { x: 0, y: 0 };
      return {
        scene, cam, vis, ptr,
        needs: (t) => (t < 0.93 ? waveKeys : t < 0.97 ? ['bake'] : ['bake', 'shop']).concat(t > 0.86 && t < 0.93 ? ['bake'] : []),
        update(t) {
          const D = restD();
          stack.meshes.forEach((m, i) => { m.material.uniforms.map.value = pool.get(waveKeys[i]); });
          const ready = stack.meshes.every((m) => m.material.uniforms.map.value);
          const sep = reduced() ? (t > 0.2 && t < 0.85 ? 1 : 0) : sstep(0.06, 0.45, t) * (1 - sstep(0.66, 0.9, t));
          stack.setDepth(sep, D);
          stack.meshes[0].material.uniforms.uMistAmt.value = sep * 0.1; stack.meshes[1].material.uniforms.uMistAmt.value = sep * 0.05;
          for (const k of [k1, k2, k3]) {
            const { x, y, z } = k.userData, zz = z * sep, s = (D - zz) / D;
            k.position.set(x * s, y * s, zz); k.scale.setScalar(s); k.material.uniforms.uOpacity.value = sep * k.userData.o; k.visible = sep > 0.01 && ready;
            k.material.uniforms.uShift.value = t * 0.6;
          }
          const bk = pool.get('bake'); const useBake = t >= 0.93 && !!bk;
          bake.material.uniforms.map.value = bk; bake.visible = useBake; stack.group.visible = ready && !useBake;
          // camera: rest framing → dolly in and truck right (parallax) → back to rest by t = 0.9
          const mv = reduced() ? (t > 0.2 && t < 0.85 ? 1 : 0) : sstep(0.08, 0.6, t) * (1 - sstep(0.64, 0.92, t));
          const port = A < 0.9;
          const focusX = port ? lerp(-0.55, 0.55, sstep(0.15, 0.7, t)) * (1 - sstep(0.7, 0.92, t)) : 0;
          const px = reduced() ? 0 : ptr.x * 0.1 * sep, py = reduced() ? 0 : ptr.y * 0.06 * sep;
          const eye = V(focusX + lerp(0, port ? 0.25 : 0.42, mv) + px, lerp(0, -0.06, mv) + py, D * (1 - 0.3 * mv));
          camAt(cam, eye, V(focusX + lerp(0, port ? 0.0 : -0.12, mv), lerp(0, 0.02, mv), lerp(0, -0.9, mv)));
          if (!port && !reduced()) cam.rotateZ(-0.012 * mv);
        },
      };
    })();

    // ================================================================ shot 2: shop
    const SHOP = { w: 1509, h: 2000 }, SHOP_H = 4.0, SHOP_W = SHOP_H * SHOP.w / SHOP.h;
    const WALL = { cx: 772, cy: 600, w: 262 }; // the Wave pinned on the shōji (shop px)
    const shot2 = (() => {
      const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(fov, 1, 0.05, 100), vis = mkVis(6.1), visW = mkVis(6.2);
      const shop = new THREE.Mesh(new THREE.PlaneGeometry(SHOP_W, SHOP_H), planeMat({ vis })); shop.renderOrder = 0; scene.add(shop);
      const wx = (WALL.cx / SHOP.w - 0.5) * SHOP_W, wy = (0.5 - WALL.cy / SHOP.h) * SHOP_H, wW = WALL.w / SHOP.w * SHOP_W, wH = wW * SHEET.h / SHEET.w;
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(wW * 1.25, wH * 1.35), new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, depthTest: false, uniforms: { ...vis, uA: { value: 0.28 } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `${GLSL_INK} uniform float uIn; uniform float uOut; uniform float uSeed; uniform vec2 uRes; uniform vec2 uOrigin; uniform float uA; varying vec2 vUv;
          void main(){ vec2 p = abs(vUv - 0.5) * 2.0; vec2 q = max(p - vec2(0.72, 0.66), 0.0); float d = length(q) / 0.3; float a = (1.0 - smoothstep(0.0, 1.0, d)) * uA;
          vec2 sc = gl_FragCoord.xy / uRes.y; vec2 o = uOrigin * vec2(uRes.x / uRes.y, 1.0); a *= inkBleed(sc, uIn, uSeed, o) * inkFade(sc, uOut, uSeed + 7.1);
          gl_FragColor = vec4(0.12, 0.09, 0.05, a); }` }));
      shadow.position.set(wx + 0.02, wy - 0.035, 0.001); shadow.renderOrder = 1; scene.add(shadow);
      const wave = new THREE.Mesh(new THREE.PlaneGeometry(wW, wH), planeMat({ vis: visW })); wave.position.set(wx, wy, 0.004); wave.renderOrder = 2; scene.add(wave);
      return {
        scene, cam, vis, visW, wavePos: V(wx, wy, 0), size: { wW, wH },
        needs: () => ['bake', 'shop'],
        update(t) {
          shop.material.uniforms.map.value = pool.get('shop'); shop.visible = !!shop.material.uniforms.map.value;
          wave.material.uniforms.map.value = pool.get('bake'); wave.visible = !!wave.material.uniforms.map.value;
          visW.uOut.value = vis.uOut.value;
          vis.uIn.value = Math.min(vis.uIn.value, sstep(0.0, 0.42, t));
          const d0 = restD() * (wW / (SHEET.w / 500));
          const dShop = fitDistance(SHOP_W * 1.04, SHOP_H * 1.04, fov, A, A < 0.9 ? 0.55 : 0.0);
          const k = reduced() ? 1 : ease.expressive(sstep(0.0, 0.7, t));
          const push = reduced() ? 0 : sstep(0.66, 1.1, t);
          const look = V(lerp(wx, A < 0.9 ? wx * 0.4 : 0, k), lerp(wy, 0.1, k) + push * 0.25, 0);
          camAt(cam, V(look.x, look.y, lerp(d0, dShop, k) * (1 - push * 0.08)), look);
          // ink spreads from the Wave outwards
          const sp = V(wx, wy, 0).project(cam); vis.uOrigin.value.set((sp.x + 1) / 2, (sp.y + 1) / 2);
        },
      };
    })();

    // ================================================================ shot 3: blocks
    const WOOD = new THREE.Color('#c99a68'), WOOD2 = new THREE.Color('#a8784a');
    function woodMat(vis, opts = {}) {
      return new THREE.ShaderMaterial({
        transparent: true, depthWrite: true, depthTest: true,
        uniforms: { ...vis, uWood: { value: (opts.color || WOOD).clone() }, uWood2: { value: WOOD2.clone() }, uKento: { value: opts.kento ? 1 : 0 },
          uSheet: { value: new THREE.Vector4(...(opts.sheet || [0, 0, 1, 1])) }, uLabel: { value: null }, uRow: { value: -1 }, uRows: { value: 5 }, uSize: { value: new THREE.Vector3(...(opts.size || [1, 1, 1])) }, uFade: { value: 1 } },
        vertexShader: `varying vec3 vN; varying vec3 vP; void main(){ vN = normal; vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `${GLSL_INK}
          uniform float uIn; uniform float uOut; uniform float uSeed; uniform vec2 uRes; uniform vec2 uOrigin;
          uniform vec3 uWood; uniform vec3 uWood2; uniform float uKento; uniform vec4 uSheet; uniform sampler2D uLabel; uniform float uRow; uniform float uRows; uniform vec3 uSize; uniform float uFade;
          varying vec3 vN; varying vec3 vP;
          void main(){
            vec3 n = normalize(vN);
            vec2 q = n.y > 0.5 || n.y < -0.5 ? vP.xz : (abs(n.x) > 0.5 ? vP.zy : vP.xy);
            float grain = vnoise(vec2(q.x * 1.3, q.y * 34.0 + vnoise(q * 3.0) * 6.0));
            float rings = smoothstep(0.55, 0.95, grain);
            vec3 c = mix(uWood, uWood2, rings * 0.55 + vnoise(q * 0.8) * 0.2);
            if (n.y < 0.5) c *= abs(n.x) > 0.5 ? 0.72 : 0.82;
            vec2 tuv = vec2(vP.x / uSize.x + 0.5, 0.5 - vP.z / uSize.z);
            if (n.y > 0.5 && uKento > 0.5) {
              // kentō: the L-shaped kagi at the sheet's bottom-right corner, the straight hikitsuke along the bottom edge
              vec2 s0 = uSheet.xy, s1 = uSheet.zw; float w = 0.011;
              float kagi = step(abs(tuv.y - (s0.y - w)), w) * step(s1.x - 0.085, tuv.x) * step(tuv.x, s1.x + 2.0*w)
                         + step(abs(tuv.x - (s1.x + w)), w) * step(s0.y - 2.0*w, tuv.y) * step(tuv.y, s0.y + 0.11);
              float hiki = step(abs(tuv.y - (s0.y - w)), w) * step(s0.x + 0.2, tuv.x) * step(tuv.x, s0.x + 0.36);
              c = mix(c, uWood2 * 0.32, clamp(kagi + hiki, 0.0, 1.0));
            }
            if (n.y > 0.5 && uRow >= 0.0) {
              vec2 luv = vec2(tuv.x, (uRows - uRow - 1.0 + tuv.y) / uRows);
              float ink = texture2D(uLabel, luv).r;
              c = mix(c, vec3(0.07, 0.055, 0.045), smoothstep(0.05, 0.6, ink) * 0.95);
            }
            vec3 L = normalize(vec3(-0.35, 0.9, 0.45));
            c *= 0.78 + 0.28 * max(dot(n, L), 0.0);
            vec2 sc = gl_FragCoord.xy / uRes.y; vec2 o = uOrigin * vec2(uRes.x / uRes.y, 1.0);
            float m = inkBleed(sc, uIn, uSeed, o) * inkFade(sc, uOut, uSeed + 7.1);
            gl_FragColor = vec4(c, m * uFade);
            if (gl_FragColor.a < 0.01) discard;
            #include <colorspace_fragment>
          }`,
      });
    }
    function paperMat(vis) {
      return new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, depthTest: true,
        uniforms: { ...vis, uC: { value: PALE.clone() } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `${GLSL_INK} uniform float uIn; uniform float uOut; uniform float uSeed; uniform vec2 uRes; uniform vec2 uOrigin; uniform vec3 uC; varying vec2 vUv;
          void main(){ float g = vnoise(vUv * vec2(300.0, 200.0)) * 0.5 + vnoise(vUv * 37.0) * 0.5; vec3 c = uC * (0.97 + g * 0.05);
          vec2 sc = gl_FragCoord.xy / uRes.y; vec2 o = uOrigin * vec2(uRes.x / uRes.y, 1.0);
          float m = inkBleed(sc, uIn, uSeed, o) * inkFade(sc, uOut, uSeed + 7.1); gl_FragColor = vec4(c, m);
          if (gl_FragColor.a < 0.01) discard;
          #include <colorspace_fragment>
          }` });
    }
    const shot3 = (() => {
      const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(fov, 1, 0.05, 100), vis = mkVis(8.3);
      const sw = 3.2, sh = sw * SHEET.h / SHEET.w, bw = 4.1, bd = 3.05, bt = 0.3;
      const s0 = [(bw - sw) / 2 / bw, (bd - sh) / 2 / bd], sheetRect = [s0[0], s0[1], 1 - s0[0], 1 - s0[1]];
      const slab = new THREE.Mesh(new THREE.BoxGeometry(bw, bt, bd), woodMat(vis, { kento: true, sheet: sheetRect, size: [bw, bt, bd] }));
      slab.position.y = -bt / 2; scene.add(slab);
      const flat = (mat) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), mat); m.rotation.x = -Math.PI / 2; return m; };
      const paper = flat(paperMat(vis)); paper.position.y = 0.002; scene.add(paper);
      const keys = ['bake', ...PEEL.map((k) => 'peel-' + k)];
      const layers = keys.map((k, i) => { const m = flat(planeMat({ vis, key: i === 0, ink: new THREE.Color('#1a1714'), side: THREE.DoubleSide, depthTest: true })); m.renderOrder = 10 + i; scene.add(m); return m; });
      const done = flat(planeMat({ vis, depthTest: true })); done.renderOrder = 20; scene.add(done);
      return {
        scene, cam, vis,
        needs: (t) => (t < 0.97 ? keys : ['bake']),
        update(t) {
          const R0 = reduced();
          layers.forEach((m, i) => {
            const tex = pool.get(keys[i]); m.material.uniforms.map.value = tex; m.visible = !!tex;
            const t0 = 0.26 + i * 0.1, f = R0 ? (t >= t0 + 0.05 ? 1 : 0) : ease.enter(sstep(t0, t0 + 0.13, t));
            const air = 0.42 + i * 0.24;
            m.position.set(lerp(0.22 - i * 0.03, 0, f), lerp(air, 0.004 + i * 0.0012, f), lerp(-0.12, 0, f));
            m.rotation.z = lerp(0.05 * (i % 2 ? 1 : -1), 0, f);
            m.material.uniforms.uOpacity.value = 1 - sstep(0.88, 0.96, t);
          });
          done.material.uniforms.map.value = pool.get('bake'); done.position.y = 0.012; done.visible = t > 0.86;
          done.material.uniforms.uOpacity.value = sstep(0.86, 0.95, t);
          // camera: three-quarter view of the bench → over the sheet (top-down) as the print completes
          const top = R0 ? 0 : sstep(0.78, 1.05, t);
          const port3 = A < 0.9, elev = lerp(port3 ? 0.7 : 0.58, 1.5, top), az = lerp(port3 ? -0.12 : -0.42, 0, top);
          const D = fitDistance(bw * (port3 ? 1.16 : 1.0), bd * 1.42, fov, A, 0) * lerp(1.04, 0.9, top);
          const look = V(port3 ? 0 : 0.05 * (1 - top), lerp(0.5, 0, top), lerp(-0.25, 0, top));
          camAt(cam, V(look.x + Math.sin(az) * Math.cos(elev) * D, look.y + Math.sin(elev) * D, Math.cos(az) * Math.cos(elev) * D), look);
        },
      };
    })();

    // ================================================================ shot 4: edo (1859 map)
    const MAPA = 2048 / 1832, MW = 4.6, MH = MW / MAPA;
    const G = (C.places && C.places.georef) || { M: [[-3.8200439443326135, 292.04036824669066], [268.29506203921846, -22.135003592097405], [2236.990619350748, 1901.698492437832]], lat0: 35.69, lon0: 139.77, W: 3964, H: 3545 };
    const city = (C.places && C.places.city) || {};
    const xyToLocal = ([x, y]) => V((x / 100 - 0.5) * MW, (0.5 - y / 100) * MH, 0);
    function ribbon(pts, width) {
      // pts: Vector3[] (z ignored); returns BufferGeometry with attributes s (0..1) and len (world units)
      const n = pts.length, pos = [], s = [], len = [], idx = []; let L = 0; const acc = [0];
      for (let i = 1; i < n; i++) { L += pts[i].distanceTo(pts[i - 1]); acc.push(L); }
      for (let i = 0; i < n; i++) {
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
        const dx = b.x - a.x, dy = b.y - a.y, dl = Math.hypot(dx, dy) || 1, nx = -dy / dl * width / 2, ny = dx / dl * width / 2;
        pos.push(pts[i].x + nx, pts[i].y + ny, pts[i].z, pts[i].x - nx, pts[i].y - ny, pts[i].z);
        s.push(acc[i] / L, acc[i] / L); len.push(acc[i], acc[i]);
        if (i < n - 1) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aS', new THREE.Float32BufferAttribute(s, 1)); g.setAttribute('aLen', new THREE.Float32BufferAttribute(len, 1)); g.setIndex(idx);
      return g;
    }
    function ribbonMat(vis, color, dashFrom = 2) {
      return new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide,
        uniforms: { ...vis, uC: { value: color }, uProg: { value: 0 }, uDash: { value: dashFrom }, uA: { value: 1 } },
        vertexShader: 'attribute float aS; attribute float aLen; varying float vS; varying float vL; void main(){ vS = aS; vL = aLen; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `${GLSL_INK} uniform float uIn; uniform float uOut; uniform float uSeed; uniform vec2 uRes; uniform vec2 uOrigin; uniform vec3 uC; uniform float uProg; uniform float uDash; uniform float uA; varying float vS; varying float vL;
          void main(){ if (vS > uProg) discard; float a = uA;
            if (vS > uDash) { if (fract(vL * 7.0) > 0.55) discard; a *= 1.0 - smoothstep(uDash, 1.0, vS) * 0.85; }
            float head = smoothstep(uProg - 0.012, uProg, vS); vec3 c = uC * (1.0 - head * 0.25);
            vec2 sc = gl_FragCoord.xy / uRes.y; vec2 o = uOrigin * vec2(uRes.x / uRes.y, 1.0);
            gl_FragColor = vec4(c, a * inkBleed(sc, uIn, uSeed, o) * inkFade(sc, uOut, uSeed + 7.1));
            if (gl_FragColor.a < 0.01) discard;
            #include <colorspace_fragment>
          }` });
    }
    const shot4 = (() => {
      const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(fov, 1, 0.05, 100), vis = mkVis(10.4);
      const grp = new THREE.Group(); scene.add(grp);
      const map = new THREE.Mesh(new THREE.PlaneGeometry(MW, MH), planeMat({ vis })); map.renderOrder = 0; grp.add(map);
      // the Tōkaidō from Nihonbashi to Shinagawa (road waypoints by lat/lon), then dashed on towards Kyōto
      const road = [[35.68406, 139.77451], [35.6767, 139.77], [35.6663, 139.7583], [35.6554, 139.7571], [35.6457, 139.7476], [35.6385, 139.7398], [35.619974, 139.742148]]
        .map(([la, lo]) => xyToLocal(geo59(G, la, lo)));
      const sh = road[road.length - 1], dir = xyToLocal(geo59(G, 35.53251, 139.70292)).sub(sh).normalize();
      const pts = [...road]; for (let i = 1; i <= 6; i++) pts.push(sh.clone().addScaledVector(dir, i * 0.12));
      let Ltot = 0; for (let i = 1; i < pts.length; i++) Ltot += pts[i].distanceTo(pts[i - 1]); let Lroad = 0; for (let i = 1; i < road.length; i++) Lroad += road[i].distanceTo(road[i - 1]);
      pts.forEach((p) => { p.z = 0.004; });
      const roadMat = ribbonMat(vis, new THREE.Color('#233C6B'), Lroad / Ltot);
      const roadMesh = new THREE.Mesh(ribbon(pts, 0.03), roadMat); roadMesh.renderOrder = 1; grp.add(roadMesh);
      // pins: publishers' streets (indigo heads) and Nihonbashi (ink)
      const PINS = [['nihonbashi', 0], ['toriaburacho', 1], ['bakurocho', 1], ['yoshiwara-gate', 1]].filter(([id]) => city[id] || id === 'nihonbashi');
      const pinPos = PINS.map(([id]) => xyToLocal(city[id]?.xy || [51.95, 57.41]));
      const stickG = new THREE.CylinderGeometry(0.008, 0.008, 1, 6); stickG.rotateX(Math.PI / 2); stickG.translate(0, 0, 0.5);
      const headG = new THREE.SphereGeometry(1, 14, 10);
      const sticks = new THREE.InstancedMesh(stickG, new THREE.MeshBasicMaterial({ color: T.ink2, transparent: true }), PINS.length);
      const heads = new THREE.InstancedMesh(headG, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true }), PINS.length);
      PINS.forEach(([id, pub], i) => heads.setColorAt(i, new THREE.Color(pub ? '#2F4F8A' : '#1D1A15')));
      sticks.renderOrder = 2; heads.renderOrder = 3; grp.add(sticks, heads);
      const pinLabels = PINS.map(([id], i) => {
        const nm = (city[id]?.name || 'Nihonbashi').split(':'); return addLabel(4, `<span>${nm[0]}${nm[1] ? `<small>${nm[1].trim()}</small>` : ''}</span>`, i === 0 ? 'big' : '');
      });
      const roadLab = addLabel(4, '<span>Tōkaidō → Shinagawa, on to Kyōto</span>', 'road');
      const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), S3 = new THREE.Vector3();
      return {
        scene, cam, vis,
        needs: () => ['map'],
        update(t) {
          const R0 = reduced();
          map.material.uniforms.map.value = pool.get('map'); map.visible = !!map.material.uniforms.map.value;
          const tilt = R0 ? 1 : ease.standard(sstep(0.02, 0.5, t));
          grp.rotation.x = lerp(-1.08, -0.36, tilt);
          const port = A < 0.9;
          const focus = V(lerp(0, port ? -0.15 : -0.35, tilt), lerp(0.1, port ? 0.25 : 0.12, tilt), 0);
          const D = fitDistance(MW * 1.02, MH * 1.02, fov, A, port ? 0.78 : 0.15) * lerp(0.9, port ? 0.86 : 0.8, tilt);
          camAt(cam, V(focus.x, focus.y - D * 0.05, D), focus);
          // pins rise in turn; labels follow
          const head = 0.05, rise = PINS.map((_, i) => (R0 ? 1 : ease.enter(sstep(0.36 + i * 0.07, 0.5 + i * 0.07, t))));
          PINS.forEach((_, i) => {
            const h = 0.3 * rise[i], p = pinPos[i];
            M4.compose(V(p.x, p.y, 0.002), Q.identity(), S3.set(1, 1, Math.max(0.0001, h))); sticks.setMatrixAt(i, M4);
            M4.compose(V(p.x, p.y, h + 0.002), Q.identity(), S3.setScalar(head * (i === 0 ? 1.15 : 1) * Math.max(0.0001, rise[i]))); heads.setMatrixAt(i, M4);
            const L = pinLabels[i]; L.obj = grp; L.pos.set(p.x, p.y, h + 0.03); L.a = sstep(0.5, 1, rise[i]); L.dx = 10; L.dy = -2;
          });
          sticks.instanceMatrix.needsUpdate = heads.instanceMatrix.needsUpdate = true; if (heads.instanceColor) heads.instanceColor.needsUpdate = true;
          const fade = 1 - vis.uOut.value; sticks.material.opacity = heads.material.opacity = fade; sticks.visible = heads.visible = map.visible;
          roadMat.uniforms.uProg.value = R0 ? 1 : sstep(0.55, 0.93, t);
          roadLab.obj = grp; roadLab.pos.copy(pts[Math.min(pts.length - 1, road.length + 1)]); roadLab.a = sstep(0.8, 0.95, t); roadLab.dx = -12; roadLab.dy = -26; roadLab.e.style.textAlign = 'right';
        },
      };
    })();

    // ================================================================ shot 5: seal
    function sealTex() {
      const S = 512, fam = '"Shippori Mincho","Noto Serif CJK JP",serif';
      return (() => {
        const c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d');
        g.strokeStyle = '#fff'; g.lineWidth = 30; g.beginPath(); g.arc(S / 2, S / 2, S / 2 - 26, 0, Math.PI * 2); g.stroke();
        g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `800 300px ${fam}`; g.fillText('極', S / 2, S / 2 + 12);
        const d = g.getImageData(0, 0, S, S).data, out = new Uint8Array(S * S * 4);
        for (let i = 0; i < S * S; i++) { out[i * 4] = d[i * 4 + 3]; out[i * 4 + 3] = 255; }
        const t = new THREE.DataTexture(out, S, S, THREE.RGBAFormat); t.flipY = true; t.needsUpdate = true; return t;
      })();
    }
    const shot5 = (() => {
      const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(fov, 1, 0.02, 100), vis = mkVis(12.9);
      const ww = 3.2, wh = ww * SHEET.h / SHEET.w;
      const sheet = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh), planeMat({ vis })); sheet.renderOrder = 0; scene.add(sheet);
      const SP = V((0.128 - 0.5) * ww, (0.5 - 0.335) * wh, 0.002), SR = 0.075;
      const sealM = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, depthTest: false,
        uniforms: { ...vis, map: { value: null }, uC: { value: T.seal }, uA: { value: 0 } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `${GLSL_INK} uniform float uIn; uniform float uOut; uniform float uSeed; uniform vec2 uRes; uniform vec2 uOrigin; uniform sampler2D map; uniform vec3 uC; uniform float uA; varying vec2 vUv;
          void main(){ float s = texture2D(map, vUv).r; float n = vnoise(vUv * 46.0) * 0.6 + vnoise(vUv * 130.0) * 0.4;
            float a = s * (0.7 + 0.3 * n) * smoothstep(0.12, 0.3, n + 0.18) * uA;
            vec2 sc = gl_FragCoord.xy / uRes.y; vec2 o = uOrigin * vec2(uRes.x / uRes.y, 1.0);
            gl_FragColor = vec4(uC * (0.92 + 0.1 * n), a * inkFade(sc, uOut, uSeed + 7.1));
            if (gl_FragColor.a < 0.01) discard;
            #include <colorspace_fragment>
          }` });
      const seal = new THREE.Mesh(new THREE.PlaneGeometry(SR * 2, SR * 2), sealM); seal.position.copy(SP); seal.renderOrder = 2; scene.add(seal);
      const shadow = new THREE.Mesh(new THREE.CircleGeometry(SR * 1.05, 40), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, depthTest: false })); shadow.position.copy(SP); shadow.position.z = 0.001; shadow.renderOrder = 1; scene.add(shadow);
      return {
        scene, cam, vis,
        needs: () => ['bake', 'seal'],
        update(t) {
          const R0 = reduced();
          sheet.material.uniforms.map.value = pool.get('bake'); sheet.visible = !!sheet.material.uniforms.map.value;
          sealM.uniforms.map.value = pool.get('seal'); sealM.uniforms.uC.value = T.seal;
          const hit = 0.4, st = R0 ? (t >= hit ? 1 : 0) : sstep(hit, hit + 0.06, t);
          seal.visible = st > 0 && !!sealM.uniforms.map.value;
          sealM.uniforms.uA.value = st > 0 ? 1 : 0;
          seal.scale.setScalar(lerp(1.06, 1, st));
          const app = R0 ? 0 : sstep(0.16, hit, t) * (1 - sstep(hit, hit + 0.02, t));
          shadow.material.opacity = app * 0.22; shadow.scale.setScalar(lerp(1.5, 1, app)); shadow.material.opacity *= 1 - vis.uOut.value;
          // camera: close on the signature corner → pull back to the whole sheet
          const port = A < 0.9;
          const pull = R0 ? (t > 0.8 ? 1 : 0) : ease.standard(sstep(0.56, 1.05, t));
          const dClose = fitDistance(1.25, 1.25, fov, A, 0.5), dFar = fitDistance(ww * 1.08, wh * 1.08, fov, A, port ? 0.5 : 0);
          const look = V(lerp(SP.x + 0.08, 0, pull), lerp(SP.y - 0.02, 0, pull), 0);
          const drift = R0 ? 0 : (1 - pull) * sstep(0, 0.4, t) * 0.04;
          camAt(cam, V(look.x + drift, look.y, lerp(dClose, dFar, pull)), look);
          const sp = SP.clone().project(cam); vis.uOrigin.value.set((sp.x + 1) / 2, (sp.y + 1) / 2);
        },
      };
    })();

    // ================================================================ shot 6: sea
    const WX = { lon0: -28, lon1: 158, lat0: -40, lat1: 70 }, WCW = 2048, WCH = Math.round(2048 * (WX.lat1 - WX.lat0) / (WX.lon1 - WX.lon0));
    const WWW = 5.6, WWH = WWW * WCH / WCW;
    const wProj = () => geoEquirectangular().scale(WCW / (((WX.lon1 - WX.lon0) * Math.PI) / 180)).rotate([-(WX.lon0 + WX.lon1) / 2, 0]).center([0, (WX.lat0 + WX.lat1) / 2]).translate([WCW / 2, WCH / 2]);
    function worldTex() {
      const c = document.createElement('canvas'); c.width = WCW; c.height = WCH; const g = c.getContext('2d');
      const proj = wProj(), path = geoPath(proj, g);
      // R: land wash, G: coast line, B: graticule (channels as masks; colours come from the theme tokens in the shader)
      const layer = (fn) => { const k = document.createElement('canvas'); k.width = WCW; k.height = WCH; const kg = k.getContext('2d'); fn(kg, geoPath(proj, kg)); return kg.getImageData(0, 0, WCW, WCH).data; };
      const r = layer((kg, p) => { kg.fillStyle = '#fff'; kg.beginPath(); p(land); kg.fill(); });
      const gg = layer((kg, p) => { kg.strokeStyle = '#fff'; kg.lineWidth = 2.2; kg.lineJoin = 'round'; kg.beginPath(); p(land); kg.stroke(); });
      const b = layer((kg, p) => { kg.strokeStyle = '#fff'; kg.lineWidth = 1.2; kg.beginPath(); p(geoGraticule().step([20, 20])()); kg.stroke(); });
      void path;
      const out = new Uint8Array(WCW * WCH * 4);
      for (let i = 0; i < WCW * WCH; i++) { out[i * 4] = r[i * 4 + 3]; out[i * 4 + 1] = gg[i * 4 + 3]; out[i * 4 + 2] = b[i * 4 + 3]; out[i * 4 + 3] = 255; }
      const t = new THREE.DataTexture(out, WCW, WCH, THREE.RGBAFormat); t.flipY = true; t.needsUpdate = true; return t;
    }
    const lonlatToW = (lon, lat) => { const [x, y] = wProj()([lon, lat]); return V((x / WCW - 0.5) * WWW, (0.5 - y / WCH) * WWH, 0); };
    const shot6 = (() => {
      const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(fov, 1, 0.05, 100), vis = mkVis(15.2), visC = mkVis(15.3);
      const grp = new THREE.Group(); scene.add(grp);
      const wm = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, depthTest: false,
        uniforms: { ...vis, map: { value: null }, uLand: { value: T.land }, uCoast: { value: T.coast }, uLine: { value: T.line } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `${GLSL_INK} uniform float uIn; uniform float uOut; uniform float uSeed; uniform vec2 uRes; uniform vec2 uOrigin; uniform sampler2D map; uniform vec3 uLand; uniform vec3 uCoast; uniform vec3 uLine; varying vec2 vUv;
          void main(){ vec4 m = texture2D(map, vUv); vec3 c = uLand; float a = m.r;
            c = mix(c, uLine, m.b * (1.0 - m.r)); a = max(a, m.b * 0.5);
            c = mix(c, uCoast, m.g); a = max(a, m.g);
            float edge = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.88, vUv.x) * smoothstep(0.0, 0.16, vUv.y) * smoothstep(1.0, 0.78, vUv.y);
            vec2 sc = gl_FragCoord.xy / uRes.y; vec2 o = uOrigin * vec2(uRes.x / uRes.y, 1.0);
            gl_FragColor = vec4(c, a * edge * inkBleed(sc, uIn, uSeed, o) * inkFade(sc, uOut, uSeed + 7.1));
            if (gl_FragColor.a < 0.01) discard;
            #include <colorspace_fragment>
          }` });
      const world = new THREE.Mesh(new THREE.PlaneGeometry(WWW, WWH), wm); world.renderOrder = 0; grp.add(world);
      const stops = (C.places && C.places.routes && C.places.routes.hayashi && C.places.routes.hayashi.stops) || [{ lat: 35.4503, lon: 139.6342 }, { lat: 1.29, lon: 103.85 }, { lat: 12.8, lon: 45.03 }, { lat: 29.97, lon: 32.55 }, { lat: 43.2967, lon: 5.3764 }, { lat: 48.8567, lon: 2.3522 }];
      // smooth the polyline (Catmull-Rom) so the route reads as a drawn line, not a chain of segments
      const raw = stops.map((s) => lonlatToW(s.lon, s.lat));
      const curve = new THREE.CatmullRomCurve3(raw, false, 'centripetal', 0.5);
      const pts = curve.getSpacedPoints(220); pts.forEach((p) => { p.z = 0.004; });
      const routeMat = ribbonMat(vis, T.indigo.clone()); const route = new THREE.Mesh(ribbon(pts, 0.022), routeMat); route.renderOrder = 1; grp.add(route);
      const cover = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62 * 900 / 667), planeMat({ vis: visC, side: THREE.DoubleSide })); cover.renderOrder = 5; scene.add(cover);
      const yoko = addLabel(6, '<span>Yokohama</span>', 'big'), paris = addLabel(6, '<span>Paris</span>', 'big'), suez = addLabel(6, '<span>Suez</span>');
      const suezP = lonlatToW(32.55, 29.97);
      const tmp = new THREE.Vector3();
      return {
        scene, cam, vis, visC,
        needs: () => ['world', 'japon'],
        update(t) {
          const R0 = reduced();
          wm.uniforms.map.value = pool.get('world'); world.visible = !!wm.uniforms.map.value;
          wm.uniforms.uLand.value = T.land; wm.uniforms.uCoast.value = T.coast; wm.uniforms.uLine.value = T.line; routeMat.uniforms.uC.value = T.indigo;
          grp.rotation.x = -0.62;
          const port = A < 0.9;
          const prog = R0 ? 1 : sstep(0.12, 0.84, t);
          routeMat.uniforms.uProg.value = prog;
          const D = fitDistance(WWW * (port ? 0.55 : 0.98), WWH * 0.9, fov, A, port ? 0.7 : 0.1);
          // the camera follows the cover west, from Japan to Europe
          const sNow = R0 ? 1 : sstep(0.08, 0.9, t);
          const cp = curve.getPointAt(Math.min(1, sNow)); cp.applyMatrix4(grp.matrixWorld);
          const look = V(port ? lerp(raw[0].x, raw[raw.length - 1].x, sNow) * 0.8 : lerp(0.75, -0.15, sNow), lerp(0.05, 0.22, sNow), 0);
          camAt(cam, V(look.x, look.y - D * 0.18, D * lerp(0.95, 1.05, sNow)), look);
          grp.updateMatrixWorld();
          // the cover flies along the route, lifted on an arc, and lands upright by Paris
          const sc = R0 ? 1 : sstep(0.16, 0.86, t);
          const p = curve.getPointAt(Math.min(1, sc)).clone(); p.z = 0.04 + Math.sin(Math.PI * sc) * 0.55; p.applyMatrix4(grp.matrixWorld);
          const land = sstep(0.8, 1, sc);
          cover.position.copy(p).add(tmp.set(0, lerp(0.05, 0.38, land), lerp(0, 0.12, land)));
          cover.quaternion.copy(cam.quaternion); cover.rotateZ(lerp(0.12 * Math.sin(sc * 9), 0, land));
          cover.scale.setScalar(lerp(0.45, port ? 0.95 : 1.1, sstep(0.05, 1, sc)));
          cover.material.uniforms.map.value = pool.get('japon'); cover.visible = !!cover.material.uniforms.map.value && t > 0.1;
          visC.uIn.value = R0 ? 1 : sstep(0.1, 0.26, t); visC.uOut.value = vis.uOut.value; visC.uOrigin.value.copy(vis.uOrigin.value);
          yoko.obj = grp; yoko.pos.copy(raw[0]); yoko.a = sstep(0.05, 0.2, t) * (1 - sstep(0.7, 0.85, t) * (port ? 1 : 0)); yoko.dx = 10;
          paris.obj = grp; paris.pos.copy(raw[raw.length - 1]); paris.a = sstep(0.75, 0.9, t); paris.dx = -58; paris.dy = 14;
          suez.obj = grp; suez.pos.copy(suezP); suez.a = sstep(0.55, 0.68, t) * (port ? 0 : 1); suez.dx = 8;
          const sp = raw[0].clone().applyMatrix4(grp.matrixWorld).project(cam); vis.uOrigin.value.set((sp.x + 1) / 2, (sp.y + 1) / 2);
        },
      };
    })();

    // ================================================================ shot 7: return (schematic banknote outline)
    const NW = 3.7, NH = NW / 1.97, NOTE_C = { w: 2048, h: Math.round(2048 / 1.97) };
    const WAVE_IN = { x: 0.06, y: 0.15, w: 0.56 }; // the Wave's window inside the note (fractions of the note)
    function noteTex() {
      // R: line, G: draw order (0..1). Procedural guilloche, rosettes and frame only: no text, no numerals, no portrait,
      // not a reproduction of any note.
      const { w: W, h: H } = NOTE_C, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
      g.lineCap = 'round'; g.lineJoin = 'round';
      const stroke = (order, lw, fn) => { g.strokeStyle = `rgb(255,${Math.round(order * 255)},0)`; g.lineWidth = lw; g.beginPath(); fn(); g.stroke(); };
      const m = 34; stroke(0.0, 6, () => g.roundRect(m, m, W - 2 * m, H - 2 * m, 26)); stroke(0.08, 2.4, () => g.roundRect(m + 22, m + 22, W - 2 * m - 44, H - 2 * m - 44, 16));
      // guilloche band along the border: two out-of-phase sine families
      const band = (y0, x0, x1, amp, per, ph, ord) => stroke(ord, 1.6, () => { for (let x = x0; x <= x1; x += 3) { const y = y0 + Math.sin((x / per) * Math.PI * 2 + ph) * amp; x === x0 ? g.moveTo(x, y) : g.lineTo(x, y); } });
      for (let k = 0; k < 4; k++) { band(m + 40, m + 60, W - m - 60, 9, 46, k * 0.8, 0.12 + k * 0.02); band(H - m - 40, m + 60, W - m - 60, 9, 46, k * 0.8 + 1, 0.14 + k * 0.02); }
      const vband = (x0, y0, y1, amp, per, ph, ord) => stroke(ord, 1.6, () => { for (let y = y0; y <= y1; y += 3) { const x = x0 + Math.sin((y / per) * Math.PI * 2 + ph) * amp; y === y0 ? g.moveTo(x, y) : g.lineTo(x, y); } });
      for (let k = 0; k < 4; k++) { vband(m + 40, m + 60, H - m - 60, 9, 46, k * 0.8, 0.13 + k * 0.02); vband(W - m - 40, m + 60, H - m - 60, 9, 46, k * 0.8 + 1, 0.15 + k * 0.02); }
      // rosettes (hypotrochoids)
      const rose = (cx, cy, Rr, r, d, ord, lw = 1.3) => stroke(ord, lw, () => { const n = 2400; for (let i = 0; i <= n; i++) { const th = (i / n) * Math.PI * 2 * r / gcd(Rr, r); const x = cx + ((Rr - r) * Math.cos(th) + d * Math.cos(((Rr - r) / r) * th)); const y = cy + ((Rr - r) * Math.sin(th) - d * Math.sin(((Rr - r) / r) * th)); i ? g.lineTo(x, y) : g.moveTo(x, y); } });
      function gcd(a, b) { return b ? gcd(b, a % b) : a; }
      const rx = W * 0.8, ry = H * 0.5;
      rose(rx, ry, 150, 50, 95, 0.3, 1.4); rose(rx, ry, 150, 60, 110, 0.36, 1.2); rose(rx, ry, 120, 45, 70, 0.42, 1.1); rose(rx, ry, 96, 36, 40, 0.48, 1.0);
      stroke(0.5, 2, () => g.ellipse(rx, ry, 190, 230, 0, 0, Math.PI * 2));
      rose(W * 0.075 + 40, H * 0.5, 72, 24, 46, 0.55, 1.1);
      // the Wave's window
      const wx = WAVE_IN.x * W, wy = WAVE_IN.y * H, ww = WAVE_IN.w * W, wh = ww * SHEET.h / SHEET.w;
      stroke(0.22, 3, () => g.rect(wx - 14, wy - 14, ww + 28, wh + 28)); stroke(0.26, 1.4, () => g.rect(wx - 26, wy - 26, ww + 52, wh + 52));
      // fine hatching in the right field
      for (let i = 0; i < 26; i++) stroke(0.6 + i * 0.012, 1, () => { const x = W * 0.66 + i * 9; g.moveTo(x, m + 80); g.lineTo(x, H - m - 80); });
      const d = g.getImageData(0, 0, W, H).data, out = new Uint8Array(W * H * 4);
      for (let i = 0; i < W * H; i++) { const a = d[i * 4 + 3]; out[i * 4] = a; out[i * 4 + 1] = a > 0 ? Math.round(d[i * 4 + 1] * 255 / Math.max(1, d[i * 4])) : 255; out[i * 4 + 3] = 255; }
      const t = new THREE.DataTexture(out, W, H, THREE.RGBAFormat); t.flipY = true; t.needsUpdate = true; t.generateMipmaps = true; return t;
    }
    const shot7 = (() => {
      const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(fov, 1, 0.05, 100), vis = mkVis(17.6), visW = mkVis(17.9);
      const grp = new THREE.Group(); scene.add(grp);
      const nm = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, depthTest: false,
        uniforms: { ...vis, map: { value: null }, uC: { value: T.ink2 }, uDraw: { value: 0 } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: `${GLSL_INK} uniform float uIn; uniform float uOut; uniform float uSeed; uniform vec2 uRes; uniform vec2 uOrigin; uniform sampler2D map; uniform vec3 uC; uniform float uDraw; varying vec2 vUv;
          void main(){ vec4 m = texture2D(map, vUv); float sweep = vUv.x * 0.25;
            float a = m.r * smoothstep(m.g + sweep * 0.0, m.g + 0.05, uDraw * 1.1);
            vec2 sc = gl_FragCoord.xy / uRes.y; vec2 o = uOrigin * vec2(uRes.x / uRes.y, 1.0);
            gl_FragColor = vec4(uC, a * 0.9 * inkFade(sc, uOut, uSeed + 7.1));
            if (gl_FragColor.a < 0.01) discard;
            #include <colorspace_fragment>
          }` });
      const note = new THREE.Mesh(new THREE.PlaneGeometry(NW, NH), nm); note.renderOrder = 0; grp.add(note);
      const wW = WAVE_IN.w * NW, wH = wW * SHEET.h / SHEET.w;
      const wave = new THREE.Mesh(new THREE.PlaneGeometry(wW, wH), planeMat({ vis: visW })); wave.position.set(-NW / 2 + WAVE_IN.x * NW + wW / 2, NH / 2 - WAVE_IN.y * NH - wH / 2, 0.002); wave.renderOrder = 1; grp.add(wave);
      return {
        scene, cam, vis, visW,
        needs: () => ['note', 'bake'],
        update(t) {
          const R0 = reduced();
          nm.uniforms.map.value = pool.get('note'); note.visible = !!nm.uniforms.map.value; nm.uniforms.uC.value = T.ink2;
          nm.uniforms.uDraw.value = R0 ? 1 : sstep(0.0, 0.5, t);
          wave.material.uniforms.map.value = pool.get('bake'); wave.visible = !!wave.material.uniforms.map.value;
          visW.uIn.value = R0 ? 1 : sstep(0.22, 0.52, t); visW.uOut.value = vis.uOut.value;
          const settle = R0 ? 1 : ease.standard(sstep(0.0, 0.8, t));
          grp.rotation.set(lerp(0.32, 0.05, settle), lerp(-0.42, -0.04, settle), lerp(0.04, 0, settle));
          const port = A < 0.9;
          const D = (port ? fitDistance(wW * 1.42, wH * 1.6, fov, A, 0) : fitDistance(NW * 1.08, NH * 1.08, fov, A, 0)) * lerp(1.12, 1, settle);
          const look = V(port ? lerp(-0.5, -0.36, settle) : 0, 0, 0);
          camAt(cam, V(look.x, look.y, D), look);
          const sp = wave.position.clone().applyMatrix4(grp.matrixWorld).project(cam); visW.uOrigin.value.set((sp.x + 1) / 2, (sp.y + 1) / 2);
        },
      };
    })();

    // ================================================================ shot 8: contents (five blocks)
    const acts = (C.acts || []).filter((a) => a.n);
    const ACTS = acts.length ? acts : ['I', 'II', 'III', 'IV', 'V'].map((n, i) => ({ id: 'a' + (i + 1), n, title: 'Act ' + n, years: '' }));
    const SL = { w: 2.6, t: 0.2, d: 0.86 };
    function slabLabelTex() {
      const W = 1024, RH = 340, H = RH * ACTS.length;
      const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
      g.fillStyle = '#fff'; g.textBaseline = 'middle';
      ACTS.forEach((a, i) => {
        const y = i * RH + RH / 2;
        g.font = '700 150px "Shippori Mincho","Noto Serif CJK JP",serif'; g.textAlign = 'center'; g.fillText(a.n, 130, y + 4);
        g.textAlign = 'left'; g.font = '600 66px "Source Serif 4",Georgia,serif';
        let title = a.title; while (g.measureText(title).width > W - 300 && title.length > 4) title = title.slice(0, -2) + '…';
        g.fillText(title, 260, y - 26);
        g.font = '500 44px "IBM Plex Sans",system-ui,sans-serif'; g.globalAlpha = 0.75; g.fillText(a.years || '', 262, y + 52); g.globalAlpha = 1;
      });
      const d = g.getImageData(0, 0, W, H).data, out = new Uint8Array(W * H * 4);
      for (let i = 0; i < W * H; i++) { out[i * 4] = d[i * 4 + 3]; out[i * 4 + 3] = 255; }
      const t = new THREE.DataTexture(out, W, H, THREE.RGBAFormat); t.flipY = true; t.needsUpdate = true; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; return t;
    }
    const contentsRects = [];
    const shot8 = (() => {
      const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(fov, 1, 0.05, 100), vis = mkVis(20.2);
      const slabs = ACTS.map((a, i) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(SL.w, SL.t, SL.d), woodMat(vis, { size: [SL.w, SL.t, SL.d], color: new THREE.Color(i % 2 ? '#c99a68' : '#c49264') }));
        m.material.uniforms.uRow.value = i; m.material.uniforms.uRows.value = ACTS.length; scene.add(m); return m;
      });
      const corners = [V(-SL.w / 2, SL.t / 2, -SL.d / 2), V(SL.w / 2, SL.t / 2, -SL.d / 2), V(SL.w / 2, SL.t / 2, SL.d / 2), V(-SL.w / 2, SL.t / 2, SL.d / 2)];
      const tmp = new THREE.Vector3();
      return {
        scene, cam, vis, slabs,
        needs: () => ['labels'],
        update(t) {
          const R0 = reduced(), port = A < 0.9, n = slabs.length;
          const lab = pool.get('labels');
          slabs.forEach((m, i) => {
            m.material.uniforms.uLabel.value = lab; m.material.uniforms.uRow.value = lab ? i : -1;
            const f = R0 ? 1 : ease.expressive(sstep(0.08 + i * 0.05, 0.62 + i * 0.05, t));
            const pile = V(0, (n - 1 - i) * SL.t * 1.02, 0);
            const k = i - (n - 1) / 2;
            const fan = port ? V(0, -i * 0.02, k * (SL.d * 1.28)) : V(k * 0.36, -i * 0.03, k * (SL.d * 1.12));
            m.position.lerpVectors(pile, fan, f);
            m.rotation.set(0, port ? 0 : lerp(0, -0.06, f), 0);
          });
          const elev = port ? 0.98 : 0.88;
          const D = port ? fitDistance(SL.w * 1.18, SL.d * n * 1.3, fov, A, 0) : fitDistance(SL.w + 0.36 * n, SL.d * n * 1.15, fov, A, 0) * 1.16;
          const look = V(0, 0, port ? 0.32 : 0.05);
          camAt(cam, V(0, Math.sin(elev) * D, Math.cos(elev) * D + look.z), look);
          // screen rects of the five top faces, for the Story builder's links
          const { W, H } = stage.size();
          contentsRects.length = 0;
          slabs.forEach((m, i) => {
            m.updateMatrixWorld(); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
            for (const c0 of corners) { tmp.copy(c0).applyMatrix4(m.matrixWorld).project(cam); const x = (tmp.x + 1) / 2 * W, y = (1 - tmp.y) / 2 * H; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
            contentsRects.push({ id: ACTS[i].id, n: ACTS[i].n, title: ACTS[i].title, x: x0, y: y0, width: x1 - x0, height: y1 - y0, left: x0, top: y0, right: x1, bottom: y1, settled: (R0 ? 1 : sstep(0.62 + i * 0.05, 0.66 + i * 0.05, t)) >= 1 });
          });
        },
      };
    })();

    const SH = [shot0, shot1, shot2, shot3, shot4, shot5, shot6, shot7, shot8];

    // ---------------------------------------------------------------- the progress → shots reducer
    // Boundary k (1..8): shot k-1 dissolves (uOut) while shot k bleeds in (uIn). Boundary 2 (wave → shop) is a
    // matched cut: the same sheet, the same framing, so it needs no bleed at all.
    const IN0 = 0.06, IN1 = 0.16, OUT0 = 0.1, OUT1 = 0.07;
    function plan(p) {
      const act = [];
      for (let i = 0; i < SH.length; i++) {
        const cut = i === 2, cutOut = i + 1 === 2;
        const uIn = i === 0 ? 1 : cut ? (p >= i ? 1 : 0) : clamp01((p - (i - IN0)) / (IN0 + IN1));
        const uOut = i === SH.length - 1 ? 0 : cutOut ? (p >= i + 1 ? 1 : 0) : clamp01((p - (i + 1 - OUT0)) / (OUT0 + OUT1));
        if (uIn > 0 && uOut < 1) act.push({ i, uIn, uOut, t: p - i });
      }
      return act;
    }

    let target = 0, shown = 0, vel = 0, lastAct = [], frames = 0;
    const ptr = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0 };
    const frameMs = [];
    const heroP = (k) => (k >= 9 ? 9 : Math.max(0, k) + HERO[Math.max(0, Math.min(8, k))]);
    const drawSize = new THREE.Vector2();
    function render(p) {
      const act = plan(p); lastAct = act;
      // textures: union of the active shots' needs (≤ 6 by construction), plus prefetch of the next shots' images
      const need = new Set(); act.forEach((a) => SH[a.i].needs(a.t).forEach((k) => need.add(k)));
      pool.want([...need]);
      const k = Math.floor(p); [k, k + 1, k + 2].forEach((j) => PREFETCH[j] && pool.prefetch(PREFETCH[j]));
      R.getDrawingBufferSize(drawSize);
      for (const v of allVis) v.uRes.value.copy(drawSize);
      R.info.reset();
      R.clear(true, true, true);
      washi.material.uniforms.uPaper.value.copy(T.paper); washi.material.uniforms.uDark.value = T.dark ? 1 : 0;
      R.render(bgScene, bgCam);
      for (const a of act) {
        const s = SH[a.i];
        s.vis.uIn.value = a.uIn; s.vis.uOut.value = a.uOut;
        s.cam.aspect = A; s.cam.updateProjectionMatrix();
        s.update(a.t);
        R.clearDepth();
        R.render(s.scene, s.cam);
      }
      // labels (DOM), positioned through the owning shot's camera
      const { W, H } = stage.size();
      const vis = new Map(act.map((a) => [a.i, a.uIn * Math.pow(1 - a.uOut, 3)]));
      const placed = [];
      for (const L of labels) {
        const v = vis.get(L.shot) || 0, a = L.a * (v > 0.98 ? 1 : v * v);
        if (a < 0.01) { if (L.e.style.opacity !== '0') L.e.style.opacity = '0'; continue; }
        const q = L.pos.clone(); if (L.obj) q.applyMatrix4(L.obj.matrixWorld); q.project(SH[L.shot].cam);
        if (!L.w) { L.w = L.e.offsetWidth || 120; L.h = L.e.offsetHeight || 22; }
        const ax = (q.x + 1) / 2 * W; let x = ax + L.dx, y = (1 - q.y) / 2 * H + L.dy - 10;
        if (x + L.w > W - 8) x = Math.max(8, ax - L.w - Math.abs(L.dx)); if (x < 8) x = 8;
        // greedy: push down past any label already placed that this one would overlap
        for (let k = 0; k < 6; k++) { const hit = placed.find((r) => x < r.x + r.w && x + L.w > r.x && y < r.y + r.h && y + L.h > r.y); if (!hit) break; y = hit.y + hit.h + 2; }
        placed.push({ x, y, w: L.w, h: L.h });
        L.e.style.opacity = a.toFixed(3); L.e.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      }
    }
    tick = (dt) => {
      const t0 = performance.now();
      let moving = false;
      if (reduced()) { shown = heroP(Math.round(target)); vel = 0; ptr.x = ptr.y = 0; }
      else {
        [shown, vel] = spring(shown, target, vel, Math.min(dt, 0.05), 170, 26);
        if (Math.abs(shown - target) < 0.0005 && Math.abs(vel) < 0.0005) { shown = target; vel = 0; } else moving = true;
        [ptr.x, ptr.vx] = spring(ptr.x, ptr.tx, ptr.vx, Math.min(dt, 0.05), 60, 15.5);
        [ptr.y, ptr.vy] = spring(ptr.y, ptr.ty, ptr.vy, Math.min(dt, 0.05), 60, 15.5);
        if (Math.abs(ptr.x - ptr.tx) > 0.001 || Math.abs(ptr.y - ptr.ty) > 0.001) moving = true;
      }
      shot1.ptr.x = ptr.x; shot1.ptr.y = ptr.y;
      render(shown); frames++;
      frameMs.push(performance.now() - t0); if (frameMs.length > 240) frameMs.shift();
      if (Math.floor(shown) === 8 || shown >= 8) emitContents();
      return moving;
    };
    let lastEmit = '';
    function emitContents() {
      const key = contentsRects.map((r) => `${r.x | 0},${r.y | 0},${r.width | 0}`).join('|');
      if (key === lastEmit) return; lastEmit = key;
      root.dispatchEvent(new CustomEvent('overture-contents', { detail: { rects: contentsRects.map((r) => ({ ...r })) } }));
    }
    const kick = () => { if (!dead) stage.loop(tick); };
    let dead = false;

    stage.onResize((W, H) => { A = W / Math.max(1, H); kick(); });
    const onPtr = (e) => {
      if (phone() || reduced()) return;
      const r = root.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      ptr.tx = ((e.clientX - r.left) / r.width - 0.5) * 2; ptr.ty = -((e.clientY - r.top) / r.height - 0.5) * 2; kick();
    };
    addEventListener('pointermove', onPtr, { passive: true });
    const mqDark = matchMedia('(prefers-color-scheme: dark)');
    const onTheme = () => { readTokens(); kick(); };
    mqDark.addEventListener?.('change', onTheme);
    const mo = new MutationObserver(onTheme); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
    const onMotion = () => kick(); (ctx.motion || motion).on?.(onMotion);
    document.fonts?.ready?.then(() => { if (!dead) { ['title', 'labels'].forEach((k) => { const t = pool.tex.get(k); if (t) { t.dispose(); pool.tex.delete(k); } }); kick(); } });
    ctx.scope?.onDispose?.(() => api.destroy());
    pool.prefetch(PREFETCH[0]); pool.prefetch(PREFETCH[1]);
    kick();

    const api = {
      // p: 0..9 (shot index + fraction). opts.instant jumps without the follow spring (hash links, tests).
      setProgress(p, opts = {}) {
        const v = Math.max(0, Math.min(9, Number(p) || 0));
        target = reduced() ? Math.round(v) : v;
        if (opts.instant) { shown = target; vel = 0; }
        kick();
      },
      destroy() {
        if (dead) return; dead = true;
        removeEventListener('pointermove', onPtr); mqDark.removeEventListener?.('change', onTheme); mo.disconnect();
        for (const s of SH) s.scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach((mm) => mm.dispose?.()); });
        bgScene.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
        pool.dispose(); stage.dispose(); labelsEl.remove(); root.classList.remove('ov-root');
      },
      describe() {
        const i = Math.max(0, Math.min(8, Math.floor(reduced() ? Math.round(target) : shown + 0.001)));
        return `Overture, shot ${i + 1} of 9: ${DESCRIBE[i]}`;
      },
      getContentsRects() { if (!contentsRects.length) { const keep = shown; render(8.99); render(keep); } return contentsRects.map((r) => ({ ...r })); },
      // diagnostics for the harness and the coordinator
      stats() {
        const s = [...frameMs].sort((a, b) => a - b);
        return { frames, shot: SHOTS[Math.min(8, Math.floor(shown))], p: shown, drawCalls: R.info.render.calls, triangles: R.info.render.triangles, texturesLive: pool.tex.size, texturesPeak: pool.peak, gpuTextures: R.info.memory.textures, medianCpuMs: s.length ? s[s.length >> 1] : 0, tier: stage.tier, active: lastAct.map((a) => SHOTS[a.i]) };
      },
      shots: SHOTS.slice(),
    };
    return api;
  },
};

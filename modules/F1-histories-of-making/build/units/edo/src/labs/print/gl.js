// Print the Wave: the three.js bench. One shader ("edoPrint") draws every surface: the sheet (face down or up, curling
// when pulled), the blocks (procedural cherry wood, carved relief, ink, kentō), the Met photograph and soft shadows.
// Orthographic camera, render on demand, ≤ 10 draw calls. Loaded only through dynamic import().
import { THREE, makeStage, loadTex, token, GLSL_PAPER, GLSL_BLEED, ease } from '../../3d/common.js';
import { SW, SH, BW, BH, LAYERS, hexRGB, chanIndex } from './model.js';

const hexVec = (h) => new THREE.Vector3(...hexRGB(h));

const VERT = /* glsl */`
uniform int uKind; uniform float uPeel; uniform float uCurlR; uniform vec2 uSheet;
varying vec2 vUv; varying vec3 vPos; varying vec3 vN; varying vec3 vW; varying float vShade;
void main(){
  vUv = uv; vec3 p = position; vN = normal; vShade = 1.0;
  if (uKind == 0 && uPeel > 0.0) {
    float R = uCurlR; float fold = -uSheet.x*0.5 + uPeel*uSheet.x; float d = fold - p.x;
    if (d > 0.0) { float th = d / R;
      if (th < 3.14159265) { p.x = fold - R*sin(th); p.z = R*(1.0 - cos(th)); vShade = 0.74 + 0.26*abs(cos(th)); }
      else { p.x = fold + (d - 3.14159265*R); p.z = 2.0*R; } }
  }
  vPos = p; vec4 w = modelMatrix * vec4(p, 1.0); vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const FRAG = /* glsl */`
precision highp float;
${GLSL_PAPER}
${GLSL_BLEED}
uniform int uKind; uniform float uOpacity;
uniform sampler2D uMA; uniform sampler2D uMB; uniform sampler2D uPhoto;
uniform sampler2D uR0; uniform sampler2D uR1; uniform sampler2D uR2; uniform sampler2D uR3; uniform sampler2D uR4;
uniform vec3 uPaper; uniform vec3 uInk[6]; uniform float uCover[6];
uniform int uOrder[5]; uniform float uOn[5]; uniform vec2 uOff[5];
uniform float uKeyOn; uniform float uBok; uniform float uDouble; uniform float uRubAll; uniform float uSide; uniform float uStage;
uniform vec2 uSheet; uniform vec2 uBlock;
uniform int uChan; uniform float uCarve; uniform float uInked; uniform float uMirror; uniform float uKento; uniform float uWoodA; uniform float uIsKey;
uniform vec3 uInkCol; uniform vec3 uAccent;
uniform float uSlabH[6]; uniform float uSlabA[6]; uniform float uBlockShadow; uniform vec2 uBase;
varying vec2 vUv; varying vec3 vPos; varying vec3 vN; varying vec3 vW; varying float vShade;

// common.js's bleed() is 1 at p = 0 and falls to 0 at p = 1; reveal() turns it into 0 → 1 with the same noisy edge
float reveal(vec2 uv, float p, float seed){ return p <= 0.0 ? 0.0 : (p >= 1.0 ? 1.0 : 1.0 - bleed(uv, p, seed)); }
// layer masks: 0 pale, 1 beige, 2 grey (texture A), 3 mid, 4 deep, 5 key (texture B)
float chan(int c, vec2 uv){
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 0.0;
  if (c < 3) { vec3 a = texture2D(uMA, uv).rgb; return c == 0 ? a.r : (c == 1 ? a.g : a.b); }
  vec3 b = texture2D(uMB, uv).rgb; return c == 3 ? b.r : (c == 4 ? b.g : b.b);
}
vec3 wood(vec2 p){
  float n = vnoise(p*vec2(1.3, 0.5));
  float rings = sin(p.y*13.0 + n*6.0 + vnoise(p*vec2(0.7, 5.0))*2.0);
  float fib = vnoise(p*vec2(1.5, 90.0))*0.6 + vnoise(p*vec2(0.6, 30.0))*0.4;
  vec3 c = mix(vec3(0.78, 0.56, 0.40), vec3(0.66, 0.43, 0.29), smoothstep(-0.2, 1.0, rings)*0.8);
  return c * (0.9 + 0.12*fib);
}
float slabShadow(vec2 xz){
  float sh = 0.0;
  for (int i = 0; i < 6; i++) {
    float h = uSlabH[i]; if (uSlabA[i] <= 0.0) continue;
    vec2 c = vec2(h*0.30, h*0.22);
    vec2 q = abs(xz - c) - uBlock*0.5; float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    float blur = 0.03 + h*0.22;
    sh += uSlabA[i] * (1.0 - smoothstep(-blur, blur, d)) * (0.16 - min(h, 1.6)*0.05);
  }
  return min(sh, 0.4);
}
vec3 composite(vec2 img){
  vec2 sh = vec2(1.0 - img.x, img.y);   // where the baren touched the back of the sheet
  float r[5]; r[0] = 1.0; r[1] = 1.0; r[2] = 1.0; r[3] = 1.0; r[4] = 1.0;
  float grain = 0.5;
  if (uRubAll < 0.5) {
    r[0] = texture2D(uR0, sh).r; r[1] = texture2D(uR1, sh).r; r[2] = texture2D(uR2, sh).r; r[3] = texture2D(uR3, sh).r; r[4] = texture2D(uR4, sh).r;
    grain = vnoise(sh*vec2(300.0, 200.0))*0.65 + vnoise(sh*vec2(40.0, 27.0))*0.35;
  }
  float mott = 0.9 + 0.1*vnoise(sh*vec2(90.0, 60.0));
  vec3 c = uPaper;
  for (int s = 0; s < 5; s++) {
    float on = uOn[s]; if (on <= 0.0) continue;
    int L = uOrder[s];
    float m = chan(L, img - uOff[s]);
    float vis;
    if (uStage > 0.5) vis = reveal(img, on, float(L)*7.13);
    else vis = uRubAll > 0.5 ? on : on * smoothstep(grain - 0.2, grain + 0.04, r[L]*1.05);
    float dens = m * vis * mott;
    if (L == 2) dens *= mix(1.0, 1.0 - smoothstep(0.30, 0.62, img.y), uBok);
    vec3 ink = uInk[L+1]; float cov = uCover[L+1];
    vec3 T = clamp(ink / uPaper, 0.0, 1.0);
    c = mix(c, mix(c*T, ink, cov), dens);
    if (L == 4 && uDouble > 0.5) c = mix(c, mix(c*T, ink*0.86, cov), dens*0.75);
  }
  float k = chan(5, img) * uKeyOn;
  c *= mix(vec3(1.0), clamp(uInk[0]/uPaper, 0.0, 1.0), k*0.92);
  return c;
}
float box(vec2 p, vec2 a, vec2 b){ return step(a.x, p.x)*step(p.x, b.x)*step(a.y, p.y)*step(p.y, b.y); }
float boxd(vec2 p, vec2 a, vec2 b){ vec2 c = (a+b)*0.5, h = (b-a)*0.5; vec2 q = abs(p-c)-h; return length(max(q,0.0)) + min(max(q.x,q.y),0.0); }
void main(){
  vec3 col = vec3(1.0); float a = uOpacity;
  float g = paperGrain(gl_FragCoord.xy);
  if (uKind == 0) {                       // the sheet
    if (uSide < 0.5) { vec3 c = composite(vec2(1.0 - vUv.x, vUv.y));
      col = gl_FrontFacing ? mix(uPaper*0.985, c, 0.40) : c; }
    else col = composite(vUv);
    col *= (0.965 + 0.06*g) * vShade;
    if (uStage > 0.5) col *= 1.0 - slabShadow(vW.xz);
    float e = min(min(vUv.x, 1.0 - vUv.x)*uSheet.x, min(vUv.y, 1.0 - vUv.y)*uSheet.y);
    col *= 0.97 + 0.03*smoothstep(0.0, 0.012, e);
  } else if (uKind == 1) {                // a block (room) or a slab (stage)
    vec2 wp = vPos.xz; vec3 wd = wood(wp*1.0 + float(uChan)*3.7);
    if (vN.y < 0.5) { col = wd * (vN.z > 0.5 ? 0.80 : 0.70); col *= 0.94 + 0.06*vnoise(vPos.xy*vec2(40.0, 4.0)); }
    else {
      vec2 wuv = vec2(wp.x/uSheet.x + 0.5, -wp.y/uSheet.y + 0.5);
      vec2 iuv = uMirror > 0.5 ? vec2(1.0 - wuv.x, wuv.y) : wuv;
      float inS = box(iuv, vec2(0.0), vec2(1.0));
      float m = chan(uChan, iuv) * inS;
      float carved = inS;
      if (uIsKey > 0.5) { float f = vnoise(wp*2.2)*0.55 + vnoise(wp*9.0)*0.3 + vnoise(wp*31.0)*0.15;
        carved = inS * smoothstep(f - 0.035, f + 0.035, uCarve*1.16 - 0.06); }
      float raised = max(m, 1.0 - carved);
      vec2 lo = (uMirror > 0.5 ? vec2(-1.0, 1.0) : vec2(1.0)) * vec2(0.0011, -0.0016);
      float m2 = chan(uChan, iuv + lo) * inS;
      vec3 low = wd * 0.78 * (0.95 + 0.05*sin(wp.x*120.0 + vnoise(wp*vec2(6.0, 18.0))*9.0));
      col = mix(low, wd*1.1 + 0.05, raised);
      col += (m - m2) * 0.32 * carved;
      if (uIsKey > 0.5) {
        float paperOn = (1.0 - carved) * inS;
        col = mix(col, mix(vec3(0.93, 0.90, 0.82), vec3(0.16, 0.16, 0.19), m), paperOn*0.92);
        col = mix(col, vec3(0.30, 0.24, 0.20), m*carved*0.18);
      }
      float inkA = uStage > 0.5 ? uInked : reveal(iuv, uInked, 3.0 + float(uChan));
      col = mix(col, uInkCol, clamp(inkA, 0.0, 1.0) * m * 0.94);
      // kentō: the corner (kagi) and the straight (hikitsuke), cut in the margin just outside the sheet
      float kw = 0.022, kx = kw * uSheet.y / uSheet.x;
      float kagi = max(box(wuv, vec2(0.84, -kw), vec2(1.0 + kx, 0.0)), box(wuv, vec2(1.0, -kw), vec2(1.0 + kx, 0.14)));
      float hiki = box(wuv, vec2(0.20, -kw), vec2(0.42, 0.0));
      float kk = max(kagi, hiki);
      col = mix(col, wd*1.16, kk);
      float dk = min(min(boxd(wuv, vec2(0.84, -kw), vec2(1.0 + kx, 0.0)), boxd(wuv, vec2(1.0, -kw), vec2(1.0 + kx, 0.14))), boxd(wuv, vec2(0.20, -kw), vec2(0.42, 0.0)));
      col *= 1.0 - 0.35*(1.0 - smoothstep(0.0, 0.006, abs(dk)))*(1.0 - kk);
      float glow = (1.0 - smoothstep(0.004, 0.014, abs(dk))) * uKento;
      col = mix(col, uAccent, glow);
      a = uOpacity * mix(uWoodA, 1.0, max(max(m*clamp(inkA,0.0,1.0), kk), max(glow, 1.0 - inS)));
    }
    col *= 0.97 + 0.05*g;
  } else if (uKind == 2) {                // the Met photograph
    col = texture2D(uPhoto, vUv).rgb * (0.975 + 0.04*g);
  } else {                                // soft shadows on the bench
    vec2 xz = vW.xz;
    vec2 q = abs(xz - vec2(0.05, 0.06)) - uBase*0.5; float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    float sh = uBlockShadow * (1.0 - smoothstep(-0.02, 0.12, d)) * 0.22 + (uStage > 0.5 ? slabShadow(xz) : 0.0);
    gl_FragColor = vec4(vec3(0.08, 0.06, 0.03), sh * uOpacity); return;
  }
  gl_FragColor = vec4(col, a);
}`;

export async function createGL(container, D, opts = {}) {
  const st = makeStage(container, { ortho: true, alpha: true, tier: opts.tier, loopUnderReduced: true, onTier: opts.onTier });
  const { scene, camera, renderer } = st;
  renderer.setClearColor(0x000000, 0);
  const base = opts.base || '';
  const [MA, MB, PH] = await Promise.all([
    loadTex(base + D.masks.a, { srgb: false }), loadTex(base + D.masks.b, { srgb: false }), loadTex(base + D.sheet.photo, { srgb: false }),
  ]);
  if (st.dead) return null;
  const blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1); blank.needsUpdate = true;
  const rubTex = {};
  const inks = [D.blocks.find((b) => b.id === 'key'), ...LAYERS.map((id) => D.blocks.find((b) => b.id === id))];
  const acc = {}; token('--indigo').getRGB(acc, THREE.SRGBColorSpace);
  const common = () => ({
    uKind: { value: 0 }, uOpacity: { value: 1 }, uMA: { value: MA }, uMB: { value: MB }, uPhoto: { value: PH },
    uR0: { value: blank }, uR1: { value: blank }, uR2: { value: blank }, uR3: { value: blank }, uR4: { value: blank },
    uPaper: { value: hexVec(D.paper) }, uInk: { value: inks.map((b) => hexVec(b.ink)) }, uCover: { value: inks.map((b) => b.cover) },
    uOrder: { value: [0, 1, 2, 3, 4] }, uOn: { value: [0, 0, 0, 0, 0] }, uOff: { value: [0, 1, 2, 3, 4].map(() => new THREE.Vector2()) },
    uKeyOn: { value: 1 }, uBok: { value: 0 }, uDouble: { value: 0 }, uRubAll: { value: 1 }, uSide: { value: 1 }, uStage: { value: 0 },
    uSheet: { value: new THREE.Vector2(SW, SH) }, uBlock: { value: new THREE.Vector2(BW, BH) },
    uChan: { value: 5 }, uCarve: { value: 1 }, uInked: { value: 0 }, uMirror: { value: 1 }, uKento: { value: 0 }, uWoodA: { value: 1 }, uIsKey: { value: 0 },
    uInkCol: { value: hexVec('#1e2c40') }, uAccent: { value: new THREE.Vector3(acc.r, acc.g, acc.b) },
    uSlabH: { value: [0, 0, 0, 0, 0, 0] }, uSlabA: { value: [0, 0, 0, 0, 0, 0] }, uBlockShadow: { value: 1 }, uBase: { value: new THREE.Vector2(BW, BH) },
    uPeel: { value: 0 }, uCurlR: { value: 0.16 },
  });
  const mat = (kind, extra = {}) => {
    const u = common(); u.uKind.value = kind;
    return new THREE.ShaderMaterial({ uniforms: u, vertexShader: VERT, fragmentShader: FRAG, transparent: true, ...extra });
  };
  const sheetGeo = new THREE.PlaneGeometry(SW, SH, 96, 4);
  const mkSheet = () => { const m = new THREE.Mesh(sheetGeo, mat(0, { side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; m.renderOrder = 3; scene.add(m); return m; };
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(BW + 1.6, BH + 1.4), mat(3, { depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = -0.2; shadow.renderOrder = 0; scene.add(shadow);
  const all = [];
  const R = { kind: 'gl', st, frames: [], cpu: [] };
  { const r0 = renderer.render.bind(renderer); renderer.render = (a, b) => { const t = performance.now(); r0(a, b); R.cpu.push(performance.now() - t); if (R.cpu.length > 240) R.cpu.shift(); }; }
  let pose = null;
  const anims = new Map(); let running = false;

  // ---------------------------------------------------------------- stage: an exploded stack over the sheet
  if (opts.mode === 'stage') {
    const sheet = mkSheet(); sheet.position.y = 0.001;
    const su = sheet.material.uniforms; su.uStage.value = 1; su.uRubAll.value = 1; su.uKeyOn.value = 0;
    su.uOrder.value = D.lightToDark.map((id) => chanIndex(id));
    shadow.material.uniforms.uStage.value = 1; shadow.material.uniforms.uBlockShadow.value = 0.5; shadow.material.uniforms.uBase.value.set(SW, SH);
    shadow.position.set(0.35, -0.002, 0.3);
    const T = 0.05, order = ['key', ...D.lightToDark];
    const slabGeo = new THREE.BoxGeometry(BW, T, BH);
    const slabs = order.map((id, i) => {
      const m = new THREE.Mesh(slabGeo, mat(1, { depthWrite: false }));
      const u = m.material.uniforms; u.uChan.value = chanIndex(id); u.uIsKey.value = id === 'key' ? 1 : 0; u.uCarve.value = 1;
      u.uMirror.value = 0; u.uInked.value = 1; u.uStage.value = 1; u.uWoodA.value = 0.16; u.uInkCol.value = hexVec(D.blocks.find((b) => b.id === id).ink);
      m.userData.rest = 0.45 + i * 0.36; m.position.y = m.userData.rest; m.renderOrder = 10 + i; scene.add(m); return m;
    });
    const H = (i) => slabs[i].userData.rest;
    R.setStage = (p, { discrete = false } = {}) => {
      const sh = shadow.material.uniforms;
      slabs.forEach((m, i) => {
        const t = Math.max(0, Math.min(1, p - i)), u = m.material.uniforms;
        let y, op, glow, imp;
        if (discrete) { y = H(i); op = 1 - t; glow = 0; imp = t; }   // reduced motion: no drop, a cross-fade
        else {
          const fall = ease.standard(Math.min(1, t / 0.5));
          y = (1 - fall) * H(i) + T / 2 + 0.002 + (t > 0.62 ? (t - 0.62) * 0.25 : 0);
          op = t < 0.62 ? 1 : 1 - (t - 0.62) / 0.38;
          glow = t > 0.4 && t < 0.85 ? Math.sin(((t - 0.4) / 0.45) * Math.PI) : 0;
          imp = Math.max(0, Math.min(1, (t - 0.45) / 0.4));
        }
        m.position.y = y; u.uOpacity.value = Math.max(0, op); m.visible = op > 0.001; u.uKento.value = glow;
        if (i === 0) su.uKeyOn.value = imp; else su.uOn.value[i - 1] = imp > 0 ? 0.02 + imp * 0.98 : 0;
        const h = Math.max(0, y - T / 2);
        su.uSlabH.value[i] = h; su.uSlabA.value[i] = m.visible ? u.uOpacity.value : 0;
        sh.uSlabH.value[i] = h; sh.uSlabA.value[i] = su.uSlabA.value[i];
      });
      st.invalidate();
    };
    R.fitStage = () => setPose({ pitch: 36, yaw: -24, pts: boxPts(BW, BH, 0, H(5) + 0.1, 0, 0), pad: 1.08 }, true);
    st.onResize(() => R.fitStage());
    R.setStage(0);
  }

  // ---------------------------------------------------------------- room: block, sheet, second sheet, photograph
  if (opts.mode === 'room') {
    const TB = 0.12;
    const block = new THREE.Mesh(new THREE.BoxGeometry(BW, TB, BH), mat(1, { transparent: false }));
    block.position.y = -TB / 2; block.renderOrder = 1; scene.add(block);
    const sheet = mkSheet(), sheet2 = mkSheet();
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), mat(2)); photo.rotation.x = -Math.PI / 2; scene.add(photo);
    Object.assign(R, { block, sheet, sheet2, photo });
    const bu = block.material.uniforms, su = sheet.material.uniforms, s2 = sheet2.material.uniforms;
    for (const id of LAYERS) rubTex[id] = null;
    R.useRub = (id, canvas) => {
      const t = new THREE.CanvasTexture(canvas); t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.colorSpace = THREE.NoColorSpace;
      rubTex[id] = t; const k = 'uR' + chanIndex(id); su[k].value = t; s2[k].value = t;
    };
    R.rubDirty = (id) => { if (rubTex[id]) rubTex[id].needsUpdate = true; st.invalidate(); };
    R.setBlock = ({ id, carve, inked, kento, mirror = 1 }) => {
      if (id != null) { bu.uChan.value = chanIndex(id); bu.uIsKey.value = id === 'key' ? 1 : 0; bu.uInkCol.value = hexVec(D.blocks.find((b) => b.id === id).ink); }
      if (carve != null) bu.uCarve.value = carve; if (inked != null) bu.uInked.value = inked; if (kento != null) bu.uKento.value = kento;
      bu.uMirror.value = mirror; st.invalidate();
    };
    // a print state → sheet uniforms
    R.setPrint = (which, P) => {
      const u = (which === 2 ? sheet2 : sheet).material.uniforms;
      const ord = [0, 1, 2, 3, 4], on = [0, 0, 0, 0, 0], off = u.uOff.value;
      (P.slots || []).slice(0, 5).forEach((s, i) => { ord[i] = chanIndex(s.id); on[i] = s.on ?? 1; off[i].set((s.off?.[0] || 0) / SW, (s.off?.[1] || 0) / SH); });
      for (let i = (P.slots || []).length; i < 5; i++) off[i].set(0, 0);
      u.uOrder.value = ord; u.uOn.value = on; u.uKeyOn.value = P.key ?? 1; u.uBok.value = P.bok || 0; u.uDouble.value = P.dbl ? 1 : 0;
      u.uRubAll.value = P.rubAll ? 1 : 0; st.invalidate();
    };
    R.setSheet = ({ x = 0, z = 0, side, visible, opacity, peel, which = 1 } = {}) => {
      const m = which === 2 ? sheet2 : sheet, u = m.material.uniforms;
      m.position.set(x, 0.004, z);
      if (side != null) u.uSide.value = side; if (visible != null) m.visible = visible; if (opacity != null) u.uOpacity.value = opacity;
      if (peel != null) u.uPeel.value = peel; st.invalidate();
    };
    R.setPhoto = ({ x = 0, z = 0, visible = true, opacity = 1 } = {}) => { photo.position.set(x, 0.004, z); photo.visible = visible; photo.material.uniforms.uOpacity.value = opacity; st.invalidate(); };
    R.showBlock = (v, op = 1) => { block.visible = v; shadow.visible = v; bu.uOpacity.value = op; shadow.material.uniforms.uOpacity.value = op; block.material.transparent = op < 1; st.invalidate(); };
    R.pose = (p, instant) => setPose(p, instant);
  }

  // ---------------------------------------------------------------- camera
  function boxPts(w, d, y0, y1, cx, cz) { const o = []; for (const x of [-w / 2, w / 2]) for (const z of [-d / 2, d / 2]) for (const y of [y0, y1]) o.push(new THREE.Vector3(cx + x, y, cz + z)); return o; }
  R.boxPts = boxPts;
  function applyPose(p) {
    const r = THREE.MathUtils.degToRad, dist = 20;
    const dir = new THREE.Vector3(Math.sin(r(p.yaw)) * Math.cos(r(p.pitch)), Math.sin(r(p.pitch)), Math.cos(r(p.yaw)) * Math.cos(r(p.pitch)));
    camera.up.set(0, 1, 0);
    if (p.pitch > 89.5) { camera.up.set(0, 0, -1); dir.set(0, 1, 0); }
    camera.position.copy(p.target).addScaledVector(dir, dist); camera.lookAt(p.target);
    camera.zoom = p.zoom; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
  }
  function solve(p) {
    // centre and zoom so that the given points fit the view with padding
    const q = { pitch: p.pitch, yaw: p.yaw, target: new THREE.Vector3(), zoom: 1 };
    applyPose(q);
    const inv = camera.matrixWorldInverse; let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const v of p.pts) { const w = v.clone().applyMatrix4(inv); x0 = Math.min(x0, w.x); x1 = Math.max(x1, w.x); y0 = Math.min(y0, w.y); y1 = Math.max(y1, w.y); }
    const { W, H } = st.size(), a = W / H;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const off = new THREE.Vector3(cx, cy, 0).applyMatrix4(camera.matrixWorld).sub(camera.position.clone());
    // move the target within the view plane
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0), up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    q.target.addScaledVector(right, cx).addScaledVector(up, cy);
    const pad = p.pad || 1.1, bottomPad = p.bottomPad || 0;
    q.zoom = Math.min((2 * a) / ((x1 - x0) * pad), 2 / ((y1 - y0) * pad + bottomPad));
    void off; return q;
  }
  function setPose(p, instant) {
    const to = solve(p);
    if (!pose || instant) { pose = to; applyPose(pose); st.invalidate(); return Promise.resolve(); }
    const from = { pitch: pose.pitch, yaw: pose.yaw, target: pose.target.clone(), zoom: pose.zoom };
    const dur = R.reduced ? 0 : 650;
    if (!dur) { pose = to; applyPose(pose); st.invalidate(); return Promise.resolve(); }
    return R.anim(dur, (k) => {
      const e = ease.standard(k);
      pose = { pitch: from.pitch + (to.pitch - from.pitch) * e, yaw: from.yaw + (to.yaw - from.yaw) * e, target: from.target.clone().lerp(to.target, e), zoom: from.zoom + (to.zoom - from.zoom) * e };
      applyPose(pose);
    }, 'pose');
  }

  // ---------------------------------------------------------------- animation driver (render on demand)
  R.anim = (ms, fn, key = Symbol()) => new Promise((res) => {
    const prev = anims.get(key); if (prev) prev.res();       // retarget: the newest wins
    anims.set(key, { t0: performance.now(), ms, fn, res });
    if (!running) { running = true; st.loop(tick); }
  });
  function tick(dt) {
    R.frames.push(dt * 1000); if (R.frames.length > 240) R.frames.shift();
    const now = performance.now();
    for (const [k, a] of anims) { const p = Math.min(1, (now - a.t0) / a.ms); a.fn(p); if (p >= 1) { anims.delete(k); a.res(); } }
    if (!anims.size) { running = false; return false; }
    return true;
  }
  R.stopAnims = () => { for (const a of anims.values()) a.res(); anims.clear(); };
  R.invalidate = () => st.invalidate();
  R.size = () => st.size();
  // screen ↔ world on the bench plane (y = h)
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3();
  R.toWorld = (cx, cy, h = 0) => {
    const r = st.canvas.getBoundingClientRect(); ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera); plane.constant = -h; return ray.ray.intersectPlane(plane, hit) ? { x: hit.x, z: hit.z } : null;
  };
  R.toScreen = (x, y, z) => {
    const v = new THREE.Vector3(x, y, z).project(camera), r = st.canvas.getBoundingClientRect();
    return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height, lx: ((v.x + 1) / 2) * r.width, ly: ((1 - v.y) / 2) * r.height };
  };
  R.pxToWorld = () => { const { H } = st.size(); return 2 / (camera.zoom * H); };
  R.onResize = (f) => st.onResize(f);
  R.drawCalls = () => renderer.info.render.calls;
  R.destroy = () => { if (st.dead) return; R.stopAnims(); Object.values(rubTex).forEach((t) => t?.dispose()); st.dispose(); };
  void all;
  return R;
}

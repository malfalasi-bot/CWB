// Multi-plane helpers shared by the overture (src/3d/opener.js) and the Step into the View lab (src/labs/view.js).
// A print is cut into planes (back plane inpainted); each plane is scaled by (D - z) / D so the stack recomposes
// to the flat sheet exactly from the rest eye, and an off-axis frustum keeps the sheet's window fixed on screen
// while the eye moves, so depth reads as parallax rather than as a camera swinging. Everything else here is
// the material kit: ink-bleed reveal in screen space, kasumi mist bands, screen-pinned washi, a texture pool.
import { THREE, GLSL_PAPER } from './common.js';

// ---------------------------------------------------------------- GLSL
// inkBleed(sc, p, seed, origin): 0 = paper, 1 = revealed. sc = screen coords normalised by height. The front spreads
// from `origin` with a noisy edge; `rim` gives the wet edge (ink pooling) so a reveal looks soaked in, not wiped.
export const GLSL_INK = /* glsl */`
${GLSL_PAPER}
float inkN(vec2 p, float s){ return vnoise(p*2.6+s)*0.55 + vnoise(p*9.0+s*1.7)*0.3 + vnoise(p*31.0+s*2.3)*0.15; }
float inkBleed(vec2 sc, float p, float seed, vec2 origin){
  if (p <= 0.0) return 0.0; if (p >= 1.0) return 1.0;
  float d = length(sc - origin);
  float t = p*2.1 - d*0.9 - 0.12;
  float n = inkN(sc, seed);
  return smoothstep(n - 0.05, n + 0.015, t);
}
// the outgoing side: a soft, mottled wash-out (ink lifting off the paper), never a hard-edged hole
float inkFade(vec2 sc, float p, float seed){
  if (p <= 0.0) return 1.0; if (p >= 1.0) return 0.0;
  float n = vnoise(sc * 1.7 + seed) * 0.6 + vnoise(sc * 6.5 + seed) * 0.4;
  return 1.0 - smoothstep(0.0, 0.32, p * 1.38 - n * 0.38);
}
float inkRim(vec2 sc, float p, float seed, vec2 origin){
  if (p <= 0.0 || p >= 1.0) return 0.0;
  float d = length(sc - origin); float t = p*2.1 - d*0.9 - 0.12; float n = inkN(sc, seed);
  return smoothstep(n - 0.11, n - 0.03, t) - smoothstep(n - 0.03, n + 0.02, t);
}
`;

// Per-shot (or per-scene) visibility uniforms: uIn bleeds in, uOut dissolves out. Shared by reference.
export function visUniforms(seed = 1.3) {
  return {
    uIn: { value: 1 }, uOut: { value: 0 }, uSeed: { value: seed },
    uRes: { value: new THREE.Vector2(1, 1) }, uOrigin: { value: new THREE.Vector2(0.5, 0.5) },
  };
}
const VIS_FN = /* glsl */`
uniform float uIn; uniform float uOut; uniform float uSeed; uniform vec2 uRes; uniform vec2 uOrigin;
float visMask(out float rim){
  vec2 sc = gl_FragCoord.xy / uRes.y;
  vec2 o = uOrigin * vec2(uRes.x / uRes.y, 1.0);
  float a = inkBleed(sc, uIn, uSeed, o);
  float b = inkFade(sc, uOut, uSeed + 7.1);
  rim = inkRim(sc, uIn, uSeed, o);
  return a * b;
}
`;

// ---------------------------------------------------------------- image plane
// uniforms: map, uOpacity, uMist (colour), uMistAmt, uMirror + uClip (mirror the uv inside a rect: used by back
// planes so parallax never shows the sheet margin), uUv (offset.xy, scale.zw: a plane cropped to its alpha box),
// uKey (0 = colour, 1 = key-block extraction: dark, unsaturated ink only, tinted uInk), uTint (multiply).
export function planeMat(opts = {}) {
  const U = opts.vis || visUniforms();
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: opts.depthTest ?? false, side: opts.side ?? THREE.FrontSide,
    uniforms: {
      ...U,
      map: { value: opts.map || null }, uOpacity: { value: opts.opacity ?? 1 },
      uMist: { value: opts.mist ? opts.mist.clone() : new THREE.Color(0.93, 0.9, 0.82) }, uMistAmt: { value: 0 },
      uMirror: { value: opts.mirror ? 1 : 0 }, uClip: { value: new THREE.Vector4(...(opts.clip || [0, 0, 1, 1])) },
      uUv: { value: new THREE.Vector4(...(opts.uv || [0, 0, 1, 1])) },
      uKey: { value: opts.key ? 1 : 0 }, uInk: { value: opts.ink ? opts.ink.clone() : new THREE.Color(0.08, 0.07, 0.06) },
      uTint: { value: new THREE.Color(1, 1, 1) }, uFlatAlpha: { value: opts.flat ? 1 : 0 }, uLift: { value: 0 },
      uHole: { value: new THREE.Vector4(...(opts.hole || [2, 2, 2, 2])) },
    },
    vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      ${GLSL_INK}
      ${VIS_FN}
      uniform sampler2D map; uniform float uOpacity; uniform vec3 uMist; uniform float uMistAmt;
      uniform float uMirror; uniform vec4 uClip; uniform vec4 uUv; uniform float uKey; uniform vec3 uInk; uniform vec3 uTint;
      uniform float uFlatAlpha; uniform float uLift; uniform vec4 uHole;
      varying vec2 vUv;
      void main(){
        vec2 uv = vUv;
        if (vUv.x > uHole.x && vUv.y > uHole.y && vUv.x < uHole.z && vUv.y < uHole.w) discard;
        if (uMirror > 0.5) {
          vec2 lo = uClip.xy, hi = uClip.zw, sz = hi - lo;
          vec2 q = (uv - lo) / sz; q = 1.0 - abs(1.0 - mod(q + 2.0, 2.0)); uv = lo + q * sz;
        }
        uv = uUv.xy + uv * uUv.zw;
        if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) discard;
        vec4 c = texture2D(map, uv);
        if (uFlatAlpha > 0.5) c.a = 1.0;
        if (uKey > 0.5) {
          float l = dot(c.rgb, vec3(0.299, 0.587, 0.114));
          float mx = max(c.r, max(c.g, c.b)), mn = min(c.r, min(c.g, c.b));
          float sat = (mx - mn) / max(mx, 1e-3);
          float ink = smoothstep(0.11, 0.035, l) * smoothstep(0.6, 0.3, sat);
          c = vec4(uInk, ink * c.a);
        }
        c.rgb *= uTint;
        c.rgb = mix(c.rgb, uMist, uMistAmt);
        c.rgb += uLift;
        float rim; float m = visMask(rim);
        c.rgb *= 1.0 - rim * 0.35;
        gl_FragColor = vec4(c.rgb, c.a * uOpacity * m);
        if (gl_FragColor.a < 0.002) discard;
        #include <colorspace_fragment>
      }`,
  });
  return mat;
}

// ---------------------------------------------------------------- kasumi (mist band)
// An elongated cloud band with a flat-ish top, rounded ends and a softly wobbled outline, like the bands that
// divide depth in a print. Drawn on a plane of aspect ~6:1; colour is the print's paper (a texture colour, not a token).
export function kasumiMat(opts = {}) {
  const U = opts.vis || visUniforms();
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false,
    uniforms: { ...U, uColor: { value: (opts.color || new THREE.Color(0.95, 0.92, 0.84)).clone() }, uOpacity: { value: opts.opacity ?? 0.85 },
      uAspect: { value: opts.aspect ?? 6 }, uBand: { value: opts.seed ?? 3.1 }, uShift: { value: 0 } },
    vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      ${GLSL_INK}
      ${VIS_FN}
      uniform vec3 uColor; uniform float uOpacity; uniform float uAspect; uniform float uBand; uniform float uShift;
      varying vec2 vUv;
      void main(){
        vec2 p = vec2((vUv.x - 0.5) * uAspect, vUv.y - 0.5);
        float w = uAspect * 0.5 - 0.5;
        float wob = (vnoise(vec2(vUv.x * 7.0 + uBand + uShift, uBand)) - 0.5) * 0.18 + (vnoise(vec2(vUv.x * 23.0 + uBand, 2.0)) - 0.5) * 0.05;
        vec2 q = vec2(max(abs(p.x) - w, 0.0), p.y * (p.y > 0.0 ? 1.25 : 0.9) + wob);
        float d = length(q);
        // a printed band: a crisp outer edge and a bokashi fade from the top edge down
        float a = smoothstep(0.5, 0.46, d) * mix(1.0, 0.55, smoothstep(-0.3, 0.45, -p.y));
        float grain = paperGrain(gl_FragCoord.xy) * 0.12;
        float rim; float m = visMask(rim);
        gl_FragColor = vec4(uColor * (0.97 + grain * 0.3), a * uOpacity * m * (0.9 + grain));
        if (gl_FragColor.a < 0.002) discard;
        #include <colorspace_fragment>
      }`,
  });
}

// ---------------------------------------------------------------- washi background (screen-pinned)
// Paper colour from the token, low-frequency mottling, long kōzo fibres. Drawn first, full screen, no depth.
export function washiMesh(paperColor) {
  const mat = new THREE.ShaderMaterial({
    depthWrite: false, depthTest: false,
    uniforms: { uPaper: { value: paperColor.clone() }, uDark: { value: 0 } },
    vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: /* glsl */`
      ${GLSL_PAPER}
      uniform vec3 uPaper; uniform float uDark;
      float fibre(vec2 fc, float ang, float s){
        float c = cos(ang), sn = sin(ang); vec2 r = vec2(c*fc.x - sn*fc.y, sn*fc.x + c*fc.y);
        float n = vnoise(vec2(r.x * 0.006 + s, r.y * 0.16 + vnoise(r * 0.004 + s) * 4.0));
        return smoothstep(0.86, 0.97, n);
      }
      void main(){
        vec2 fc = gl_FragCoord.xy;
        float m = vnoise(fc * 0.0035) * 0.6 + vnoise(fc * 0.011) * 0.4;
        vec3 c = uPaper * (1.0 + (m - 0.5) * (uDark > 0.5 ? 0.06 : 0.045));
        float f = fibre(fc, 0.35, 1.0) + fibre(fc, -0.6, 7.0) * 0.8 + fibre(fc, 1.2, 13.0) * 0.6;
        c += (uDark > 0.5 ? 0.0045 : 0.03) * f;
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); m.frustumCulled = false; m.renderOrder = -999; return m;
}

// ---------------------------------------------------------------- framing & off-axis eye
// Distance at which a w × h rectangle fits (k = 0 contain … 1 cover) a perspective view of vertical fov and aspect.
export function fitDistance(w, h, fovDeg, aspect, k = 0) {
  const t = Math.tan((fovDeg * Math.PI) / 360);
  const dH = h / 2 / t, dW = w / 2 / (t * aspect);
  const contain = Math.max(dH, dW), cover = Math.min(dH, dW);
  return contain + (cover - contain) * k;
}

// Off-axis projection: the eye at (ex, ey, D) relative to a window [-ww/2, ww/2] × [-wh/2, wh/2] at z = 0; the window
// stays put on screen. `view` is the window rect in the viewport (0..1, origin bottom-left) so the sheet can sit
// anywhere on the canvas (e.g. beside a text column), with the frustum extended to fill the rest.
export function offAxis(camera, eye, ww, wh, view = [0, 0, 1, 1], near = 0.05, far = 100) {
  const [vx, vy, vw, vh] = view;
  const D = eye.z, k = near / D;
  const l0 = (-ww / 2 - eye.x), r0 = (ww / 2 - eye.x), b0 = (-wh / 2 - eye.y), t0 = (wh / 2 - eye.y);
  const sx = (r0 - l0) / vw, sy = (t0 - b0) / vh;
  const L = l0 - vx * sx, R = L + sx, B = b0 - vy * sy, T = B + sy;
  camera.position.set(eye.x, eye.y, eye.z); camera.quaternion.identity(); camera.updateMatrixWorld();
  camera.projectionMatrix.makePerspective(L * k, R * k, T * k, B * k, near, far);
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
}

// ---------------------------------------------------------------- a stack of cut planes
// layers: [{ tex | null, box: [x, y, w, h] in sheet px, z, mirror?, clip? }], sheet: { w, h } px; world width W.
// Returns { group, meshes, setDepth(k), sheetW, sheetH }. setDepth(0) = flat sheet, 1 = full separation.
export function planeStack(layers, sheet, worldW, D, vis, extra = {}) {
  const group = new THREE.Group();
  const sw = worldW, sh = worldW * sheet.h / sheet.w;
  const meshes = layers.map((L, i) => {
    const [bx, by, bw, bh] = L.box || [0, 0, sheet.w, sheet.h];
    const over = L.mirror ? (extra.overscan ?? 0.12) : 0;
    const w = sw * bw / sheet.w * (1 + over * 2), h = sh * bh / sheet.h * (1 + over * 2);
    const geo = new THREE.PlaneGeometry(w, h);
    // uv beyond 0..1 on overscanned planes (mirrored in the shader inside uClip)
    if (over) { const uv = geo.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, uv.getX(j) * (1 + 2 * over) - over, uv.getY(j) * (1 + 2 * over) - over); }
    const mat = planeMat({ vis, map: L.tex, mirror: !!L.mirror, clip: L.clip, mist: extra.mist });
    const m = new THREE.Mesh(geo, mat);
    m.userData = { cx: (bx + bw / 2) / sheet.w - 0.5, cy: 0.5 - (by + bh / 2) / sheet.h, z: L.z || 0, i };
    m.renderOrder = i; m.frustumCulled = false;
    group.add(m); return m;
  });
  const api = {
    group, meshes, sheetW: sw, sheetH: sh,
    setDepth(k, D2 = D) {
      for (const m of meshes) {
        const z = m.userData.z * k, s = (D2 - z) / D2;
        m.position.set(m.userData.cx * sw * s, m.userData.cy * sh * s, z); m.scale.setScalar(s);
      }
    },
  };
  api.setDepth(0);
  return api;
}

// ---------------------------------------------------------------- texture pool with a hard cap
// Images are fetched and decoded once (CPU); GPU textures exist only for keys in the current `want` set.
export class TexPool {
  constructor(renderer, cap = 6, onChange = () => {}) { this.r = renderer; this.cap = cap; this.img = new Map(); this.tex = new Map(); this.make = new Map(); this.onChange = onChange; this.peak = 0; this.dead = false; }
  // register a key: url (image) or a factory () => THREE.Texture (canvas)
  def(key, src, opts = {}) { this.make.set(key, { src, opts }); }
  prefetch(keys) { for (const k of keys) this._img(k); }
  _img(key) {
    const d = this.make.get(key); if (!d || typeof d.src !== 'string') return null;
    if (this.img.has(key)) return this.img.get(key);
    const im = new Image(); im.decoding = 'async'; im.src = d.src;
    const p = (im.decode ? im.decode() : new Promise((r, j) => { im.onload = r; im.onerror = j; })).then(() => { if (!this.dead) this.onChange(); return im; }).catch(() => null);
    const rec = { im, p, ok: false }; p.then((x) => { rec.ok = !!x; }); this.img.set(key, rec); return rec;
  }
  get(key) { return this.tex.get(key) || null; }
  want(keys) {
    const set = new Set(keys);
    for (const [k, t] of this.tex) if (!set.has(k)) { t.dispose(); this.tex.delete(k); }
    for (const k of set) {
      if (this.tex.has(k)) continue;
      if (this.tex.size >= this.cap) { console.warn('[planes] texture cap reached; skipped', k); continue; }
      const d = this.make.get(k); if (!d) continue;
      let t = null;
      if (typeof d.src === 'function') t = d.src();
      else { const rec = this._img(k); if (rec && rec.ok) { t = new THREE.Texture(rec.im); t.needsUpdate = true; } }
      if (!t) continue;
      t.colorSpace = d.opts.linear ? THREE.NoColorSpace : THREE.SRGBColorSpace;
      t.anisotropy = Math.min(4, this.r.capabilities.getMaxAnisotropy());
      t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
      this.tex.set(k, t);
    }
    this.peak = Math.max(this.peak, this.tex.size);
    return this.tex;
  }
  ready(key) { const d = this.make.get(key); if (!d) return false; if (typeof d.src === 'function') return true; const r = this._img(key); return !!(r && r.ok); }
  dispose() { this.dead = true; for (const t of this.tex.values()) t.dispose(); this.tex.clear(); this.img.clear(); }
}

// Draw text or shapes into a canvas and wrap it as a texture (sRGB). Width/height capped at 2048.
export function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = Math.min(2048, w); c.height = Math.min(2048, h);
  const g = c.getContext('2d'); draw(g, c.width, c.height);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export const clamp01 = (x) => Math.max(0, Math.min(1, x));
export const sstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const lerp = (a, b, t) => a + (b - a) * t;

// The ink globe: progressive enhancement over the 2D map. Three draw calls:
//   1. the paper sphere: one shader turns a baked coast distance field and nine blurred chapter masks into
//      washi paper, land, a sumi coastline, coastal ripple lines, a graticule and brushed washes;
//   2. every route, copy chain, extraction flow and provenance arc merged into one ribbon geometry, whose
//      visibility, draw progress, dash and ink come from a small state texture (one texel per line);
//   3. one instanced mesh of marks (clusters, places by kind, exhibition rings), drawn as shader glyphs.
// Labels are DOM buttons (labels.js). Render on demand; a frame-time probe lowers quality, then falls back.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Mesh, SphereGeometry, ShaderMaterial, BufferGeometry, BufferAttribute,
  InstancedBufferGeometry, InstancedBufferAttribute, DataTexture, RGBAFormat, UnsignedByteType, NearestFilter, LinearFilter,
  TextureLoader, Color, Vector3, ColorManagement, LinearSRGBColorSpace, NoColorSpace, ClampToEdgeWrapping, RepeatWrapping, DoubleSide,
} from 'three';
import { interpolateZoom } from 'd3-interpolate';
import { geoInterpolate, geoDistance } from 'd3-geo';
import { M, lineSet, lineTime, washes, CHAPTERS, LENS_DEF, esc } from './model.js';
import { S } from './state.js';
import { INK } from './ink.js';
import { regionMarks, worldMarks, exhibitions, territoryLabelItems, expansionZoom } from './scene.js';
import { markLabelItems, withSelected } from './map2d.js';
import { updateLabels } from './labels.js';

ColorManagement.enabled = false;
const D2R = Math.PI / 180;
const FOV = 28;
const TANH = Math.tan(FOV * D2R / 2);

export function xyz(lon, lat, r = 1) {
  const phi = (lon + 180) * D2R, th = (90 - lat) * D2R;
  return new Vector3(-Math.cos(phi) * Math.sin(th) * r, Math.cos(th) * r, Math.sin(phi) * Math.sin(th) * r);
}
function lonlat(v) {
  const n = v.clone().normalize();
  const lat = 90 - Math.acos(Math.max(-1, Math.min(1, n.y))) / D2R;
  let lon = Math.atan2(n.z, -n.x) / D2R - 180;
  if (lon < -180) lon += 360;
  return [lon, lat];
}

const NOISE = `
float hash3(vec3 p){ p = fract(p*0.3183099 + .1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float vnoise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(hash3(i), hash3(i+vec3(1,0,0)), f.x), mix(hash3(i+vec3(0,1,0)), hash3(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(hash3(i+vec3(0,0,1)), hash3(i+vec3(1,0,1)), f.x), mix(hash3(i+vec3(0,1,1)), hash3(i+vec3(1,1,1)), f.x), f.y), f.z); }
float fbm(vec3 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++) { s += a*vnoise(p); p *= 2.03; a *= .5; } return s; }
`;

const SPHERE_VS = `
varying vec2 vUv; varying vec3 vP; varying vec3 vW;
void main(){ vUv = uv; vP = position; vW = (modelMatrix*vec4(position,1.)).xyz; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`;

const SPHERE_FS = `
uniform sampler2D uLand; uniform sampler2D uTerr;
uniform vec3 cPaper, cLand, cCoast, cGrat, cWash, cPencil, cInk, cSel;
uniform float uTW[9]; uniform float uTL[9]; uniform float uTS[9];
uniform float uQ; uniform vec3 uCam; uniform vec3 uLight; uniform float uDark; uniform float uLensK;
varying vec2 vUv; varying vec3 vP; varying vec3 vW;
${NOISE}
void main(){
  vec2 uv = vUv;
  float deg = (texture2D(uLand, uv).r - 0.5) * 6.0;
  float aa = max(fwidth(deg), 1e-4);
  vec3 P = normalize(vP);
  float n1 = uQ > 0.5 ? fbm(P*7.0) : 0.5;
  float n2 = uQ > 0.5 ? vnoise(P*vec3(70.0, 16.0, 70.0)) : 0.5;
  float land = smoothstep(-aa, aa, deg);
  vec3 col = mix(cPaper, cLand, land * (0.82 + 0.3*(n1-0.5)));
  // graticule every 15 degrees, crisp at any zoom
  vec2 ll = vec2(uv.x*360.0, uv.y*180.0);
  vec2 g = abs(fract(ll/15.0 + 0.5) - 0.5) * 15.0;
  vec2 gw = max(fwidth(ll), vec2(1e-4));
  float gl = 1.0 - min(smoothstep(0.0, gw.x*1.1, g.x), smoothstep(0.0, gw.y*1.1, g.y));
  gl *= (1.0 - land*0.75) * 0.32 * smoothstep(0.03, 0.14, uv.y) * smoothstep(0.97, 0.86, uv.y);
  col = mix(col, cGrat, gl);
  // nine chapters: brushed washes, contour drawn in pencil until inked
  vec3 ta = texture2D(uTerr, vec2(uv.x, (2.0+uv.y)/3.0)).rgb;
  vec3 tb = texture2D(uTerr, vec2(uv.x, (1.0+uv.y)/3.0)).rgb;
  vec3 tc = texture2D(uTerr, vec2(uv.x, uv.y/3.0)).rgb;
  float m[9]; m[0]=ta.r; m[1]=ta.g; m[2]=ta.b; m[3]=tb.r; m[4]=tb.g; m[5]=tb.b; m[6]=tc.r; m[7]=tc.g; m[8]=tc.b;
  float brk = vnoise(P*42.0);
  float lon = ll.x - 180.0, lat = ll.y - 90.0;
  vec2 X = vec2(lon * cos(radians(lat)), lat);
  for (int i = 0; i < 9; i++) {
    float on = uTW[i] + uTS[i];
    if (on < 0.01 || m[i] < 0.02) continue;
    float mi = m[i] + (n1 - 0.5) * 0.16;
    // each chapter is brushed in its own direction, so overlapping readings show as crossed strokes
    float ang = float(i) * 0.349 + 0.2;
    vec2 st = vec2(X.x*cos(ang) + X.y*sin(ang), -X.x*sin(ang) + X.y*cos(ang));
    float streak = uQ > 0.5 ? smoothstep(0.1, 0.95, vnoise(vec3(st.x*0.16, st.y*1.1, float(i)*7.3))) : 0.5;
    float wash = smoothstep(0.24, 0.85, mi) * uTW[i];
    vec3 wc = cWash;
    float sk = smoothstep(0.03, 0.14, aa);
    col = mix(col, wc, min(0.85, wash * (0.15 + 0.05*uTS[i] + 0.3*uLensK) * mix(1.0, 0.72 + 0.56*streak, sk)));
    float fw = max(fwidth(mi), 1e-4);
    float ink = max(uTL[i], uTS[i]);
    float cw = mix(0.7, 1.3, ink) * fw * (0.6 + 1.0*n1) * (1.0 - 0.25*uTS[i]);
    float line = 1.0 - smoothstep(cw*0.5, cw*1.5, abs(mi - 0.3));
    float br = mix(smoothstep(0.30, 0.45, brk), 1.0, ink);
    vec3 lc = mix(mix(cPencil, cInk, uTL[i]), cSel, uTS[i]);
    col = mix(col, lc, line * br * mix(0.5, 0.92, ink) * clamp(on, 0.0, 1.0));
  }
  // sumi coast, and water lines that hug it at a fixed screen distance, as on old charts
  float coast = 1.0 - smoothstep(aa*0.5, aa*1.25, abs(deg));
  col = mix(col, cCoast, coast * 0.8);
  float rip = 0.0;
  for (int k = 0; k < 3; k++) {
    float off = aa * (4.5 + float(k) * 4.5);
    rip += (1.0 - smoothstep(aa*0.3, aa*0.95, abs(deg + off))) * (0.55 - float(k)*0.17);
  }
  rip *= (1.0 - land) * smoothstep(0.6, 0.15, aa);
  col = mix(col, cCoast, rip * 0.32);
  // paper light: a soft lambert, a darkened limb and an ink rim
  vec3 N = normalize(vW); vec3 V = normalize(uCam - vW);
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float lam = dot(N, normalize(uLight)) * 0.5 + 0.5;
  col *= mix(0.88 + 0.05*uDark, 1.03, lam);
  col = mix(col, col * (0.72 + 0.1*uDark), pow(1.0 - ndv, 3.0));
  col = mix(col, cCoast, smoothstep(0.13, 0.02, ndv) * 0.5);
  // washi fibres (object space) and grain pinned to the screen
  col *= 1.0 - 0.05 * smoothstep(0.55, 0.95, n2) * uQ;
  float gr = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (gr - 0.5) * 0.026;
  gl_FragColor = vec4(col, 1.0);
}`;

const LINE_VS = `
attribute vec3 aDir; attribute float aSide; attribute float aU; attribute float aLen; attribute float aR;
uniform sampler2D uState; uniform vec2 uRes; uniform float uPx;
varying float vU; varying float vLen; varying float vSide; varying float vA; varying float vP; varying float vDash; varying vec3 vCol;
void main(){
  vec4 s0 = texelFetch(uState, ivec2(int(aR + 0.5), 0), 0);
  vec4 s1 = texelFetch(uState, ivec2(int(aR + 0.5), 1), 0);
  vec4 c0 = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vec4 c1 = projectionMatrix * modelViewMatrix * vec4(position + aDir, 1.0);
  vec2 p0 = c0.xy / c0.w; vec2 p1 = c1.xy / c1.w;
  vec2 d = (p1 - p0) * uRes; float L = length(d); d = L > 1e-6 ? d / L : vec2(1.0, 0.0);
  vec2 n = vec2(-d.y, d.x);
  float w = (s0.w * 4.0 * 0.5 + 0.7) * uPx;
  c0.xy += n * aSide * w * 2.0 / uRes * c0.w;
  gl_Position = c0;
  vU = aU; vLen = aLen; vSide = aSide; vA = s0.x; vP = s0.y > 0.997 ? 1.01 : s0.y; vDash = s0.z * 2.0; vCol = s1.rgb;
}`;
const LINE_FS = `
uniform float uDashK;
varying float vU; varying float vLen; varying float vSide; varying float vA; varying float vP; varying float vDash; varying vec3 vCol;
void main(){
  if (vA < 0.004 || vU > vP) discard;
  float a = vA * (1.0 - smoothstep(0.45, 1.0, abs(vSide)));
  if (vDash > 0.5) { float per = vDash > 1.5 ? 0.6 : 1.0; if (fract(vLen * uDashK / per) > 0.56) discard; }
  float head = smoothstep(0.035, 0.0, vP - vU) * step(vP, 0.999);
  a = min(1.0, a * (1.0 + head * 0.8));
  gl_FragColor = vec4(vCol, a);
}`;

const MARK_VS = `
attribute vec2 corner; attribute vec3 iPos; attribute float iSize; attribute float iShape; attribute float iInk; attribute float iFlags;
uniform vec2 uRes; uniform vec3 uCam; uniform float uPx;
varying vec2 vC; varying float vShape; varying float vInk; varying float vFlags; varying float vPx;
void main(){
  vec3 N = normalize(iPos); vec3 V = normalize(uCam - iPos);
  float facing = dot(N, V);
  vec4 c = projectionMatrix * modelViewMatrix * vec4(iPos, 1.0);
  float R = iSize * 2.2 + 2.0;
  c.xy += corner * R * uPx * 2.0 / uRes * c.w;
  if (facing < 0.06) c = vec4(2.0, 2.0, 2.0, 1.0);
  gl_Position = c;
  vC = corner * R / iSize; vShape = iShape; vInk = iInk; vFlags = iFlags; vPx = iSize * uPx;
}`;
const MARK_FS = `
uniform vec3 cInk; uniform vec3 cPaper; uniform vec3 cSel; uniform vec3 cGold; uniform float uPulse;
varying vec2 vC; varying float vShape; varying float vInk; varying float vFlags; varying float vPx;
float flag(float f){ float v = floor(vFlags + 0.5); return mod(floor(v / f + 0.001), 2.0); }
void main(){
  vec2 p = vC; float aa = 1.2 / vPx;
  float d;
  int sh = int(vShape + 0.5);
  if (sh == 0) { vec2 q = vec2(abs(p.x), p.y + 0.15); d = max(q.x * 0.866 + q.y * 0.5, -q.y) - 0.62; d *= 1.35; }
  else if (sh == 2) d = max(abs(p.x), abs(p.y)) - 0.86;
  else if (sh == 3) d = (abs(p.x) + abs(p.y)) / 1.2 - 1.0;
  else if (sh == 4) d = max(abs(p.x), abs(p.y)) - 0.95;
  else if (sh == 5) d = length(p) - 0.72;
  else d = length(p) - 1.0;
  float sw = 1.15 / vPx;
  float fillA = 1.0 - smoothstep(-aa, aa, d);
  float edge = 1.0 - smoothstep(sw - aa, sw + aa, abs(d + sw * 0.5));
  if (vInk < 0.25 && flag(4.0) < 0.5) { float ang = atan(p.y, p.x); edge *= step(0.38, fract(ang * 0.8 + 0.1)) * 0.75 + 0.25 * step(0.0, -1.0); }
  vec3 col = cPaper; float a = 0.0;
  if (flag(4.0) > 0.5) {
    // cluster: paper disc with an ink ring (dashed when nothing inside is inked)
    col = vInk > 0.5 ? cInk : cPaper; a = fillA * 0.94;
    float ring = edge;
    if (vInk < 0.5) { float ang = atan(p.y, p.x); ring *= step(0.3, fract(ang * 1.9)); }
    col = mix(col, cInk, ring); a = max(a, ring);
    if (vInk > 0.5) { float r2 = 1.0 - smoothstep(sw*0.6 - aa, sw*0.6 + aa, abs(length(p) - 1.32)); col = mix(col, cInk, r2 * 0.6); a = max(a, r2 * 0.6); }
  } else if (flag(16.0) > 0.5) {
    // exhibition ring (F1.19), pulsing once when the lens turns on
    float r = length(p);
    float ring = 1.0 - smoothstep(0.1, 0.1 + aa*2.0, abs(r - 0.95));
    float cdot = 1.0 - smoothstep(0.32 - aa, 0.32 + aa, r);
    float pr = 0.95 + uPulse * 1.1;
    float pulse = (1.0 - smoothstep(0.06, 0.06 + aa*2.0, abs(r - pr))) * (1.0 - uPulse) * step(0.001, uPulse);
    col = cGold; a = max(max(ring, cdot), pulse * 0.8);
  } else {
    float fa = vInk >= 0.99 ? 1.0 : vInk > 0.3 ? 0.42 : 0.82;
    vec3 fc = vInk > 0.3 ? cInk : cPaper;
    col = fc; a = fillA * fa;
    if (sh == 4) { float inner = 1.0 - smoothstep(0.34 - aa, 0.34 + aa, max(abs(p.x), abs(p.y))); col = mix(col, cInk, inner); a = max(a, inner); }
    col = mix(col, cInk, edge); a = max(a, edge);
    if (flag(2.0) > 0.5) { float halo = (1.0 - smoothstep(0.9, 2.1, length(p))) * 0.12; a = max(a, halo); }
    if (flag(8.0) > 0.5) { float g = 1.0 - smoothstep(sw - aa, sw + aa, abs(length(p) - 1.42)); col = mix(col, cGold, g); a = max(a, g); }
  }
  if (flag(1.0) > 0.5) { float s = 1.0 - smoothstep(0.09 - aa, 0.09 + aa, abs(length(p) - 1.75)); col = mix(col, cSel, s); a = max(a, s); }
  if (a < 0.01) discard;
  gl_FragColor = vec4(col, a);
}`;

const SHAPE = { site: 0, city: 1, maker: 2, holding: 3, object: 4, route: 5, edo: 1 };
const COLKEY = { route: '--indigo', ink: '--ink', extract: '--extract', prov: '--prov', indigo2: '--indigo-2' };

export class Globe {
  constructor(host, api) {
    this.host = host; this.api = api;
    this.lon = 70; this.lat = 22; this.d = 3.4;
    this.need = false; this.anim = null; this.q = 2; this.frames = []; this.tierNow = 'world';
    this.pulse = 0;
  }

  static supported() {
    try { const c = document.createElement('canvas'); return !!c.getContext('webgl2'); } catch { return false; }
  }

  async init() {
    const phone = S.phone;
    const renderer = new WebGLRenderer({ antialias: !phone, alpha: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = LinearSRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    this.dprMax = phone ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.dprMax));
    this.renderer = renderer;
    const cv = renderer.domElement;
    cv.tabIndex = 0;
    cv.setAttribute('role', 'application');
    cv.setAttribute('aria-roledescription', 'globe');
    cv.setAttribute('aria-label', 'The ink globe. Arrow keys turn it, plus and minus zoom, Escape climbs a tier. Tab moves through the labelled chapters; the list holds everything on it.');
    this.shadow = document.createElement('div');
    this.shadow.className = 'globe-shadow';
    this.ringEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.ringEl.setAttribute('class', 'ring');
    this.ringEl.setAttribute('aria-hidden', 'true');
    this.host.append(this.shadow, this.ringEl, cv);

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(FOV, 1, 0.05, 50);
    const loader = new TextureLoader();
    const [land, terr] = await Promise.all([
      loader.loadAsync(phone ? 'tex/land-2048.png' : 'tex/land-4096.png'),
      loader.loadAsync('tex/terr.png'),
    ]);
    for (const t of [land, terr]) { t.colorSpace = NoColorSpace; t.wrapS = RepeatWrapping; t.wrapT = ClampToEdgeWrapping; }
    land.anisotropy = 4;
    terr.generateMipmaps = false; terr.minFilter = LinearFilter; terr.magFilter = LinearFilter;
    this.terrImg = terr.image;

    this.uS = {
      uLand: { value: land }, uTerr: { value: terr },
      cPaper: { value: new Color() }, cLand: { value: new Color() }, cCoast: { value: new Color() }, cGrat: { value: new Color() },
      cWash: { value: new Color() }, cPencil: { value: new Color() }, cInk: { value: new Color() }, cSel: { value: new Color() },
      uTW: { value: new Array(9).fill(1) }, uTL: { value: new Array(9).fill(0) }, uTS: { value: new Array(9).fill(0) },
      uQ: { value: 1 }, uLensK: { value: 0 }, uCam: { value: new Vector3() }, uLight: { value: new Vector3(-0.6, 0.7, 0.8) }, uDark: { value: 0 },
    };
    const sphere = new Mesh(new SphereGeometry(1, phone ? 96 : 144, phone ? 64 : 96), new ShaderMaterial({ uniforms: this.uS, vertexShader: SPHERE_VS, fragmentShader: SPHERE_FS }));
    this.scene.add(sphere);
    this.buildLines();
    this.buildMarks();
    this.readTheme();
    this.bindInput(cv);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.host);
    this.resize();
    this.update();
    return this;
  }

  // ------------------------------------------------------------ theme
  readTheme() {
    const cs = getComputedStyle(document.documentElement);
    const c = (k) => new Color(cs.getPropertyValue(k).trim() || '#000');
    const dark = c('--paper').getHSL({}).l < 0.4;
    const U = this.uS;
    U.cPaper.value = c('--paper-2').lerp(c('--paper'), 0.35);
    U.cLand.value = c('--land');
    U.cCoast.value = c('--coast');
    U.cGrat.value = c('--line-2');
    U.cWash.value = c('--wash');
    U.cPencil.value = c('--pencil');
    U.cInk.value = c('--ink');
    U.cSel.value = c('--indigo');
    U.uDark.value = dark ? 1 : 0;
    this.cols = Object.fromEntries(Object.entries(COLKEY).map(([k, v]) => [k, c(v)]));
    this.cWashBase = c('--wash'); this.cExtract = c('--extract');
    if (this.markMat) {
      this.markMat.uniforms.cInk.value = c('--ink'); this.markMat.uniforms.cPaper.value = c('--paper-2');
      this.markMat.uniforms.cSel.value = c('--indigo'); this.markMat.uniforms.cGold.value = c('--gold');
    }
    this.dark = dark;
    this.update();
  }

  // ------------------------------------------------------------ lines
  buildLines() {
    const all = [];
    for (const r of M.routes) all.push({ id: r.id, stops: r.stops, lift: 0 });
    for (const p of M.atlas.provenance) all.push({ id: 'prov-' + p.to + p.from, stops: p.stops, lift: 1 });
    this.lineIndex = new Map(all.map((l, i) => [l.id, i]));
    const pos = [], dir = [], side = [], uu = [], len = [], rid = [], idx = [];
    let v = 0;
    all.forEach((l, li) => {
      const pts = [];
      const st = l.stops.map((s) => [s.x, s.y]);
      if (l.lift) {
        const ip = geoInterpolate(st[0], st[1]);
        const ang = geoDistance(st[0], st[1]);
        const n = Math.max(12, Math.ceil(ang / D2R / 1.5));
        const h = 0.04 + 0.22 * (ang / Math.PI);
        for (let i = 0; i <= n; i++) { const t = i / n; const [lo, la] = ip(t); pts.push(xyz(lo, la, 1.004 + h * Math.sin(Math.PI * t))); }
      } else {
        for (let k = 0; k < st.length - 1; k++) {
          const ip = geoInterpolate(st[k], st[k + 1]);
          const n = Math.max(1, Math.ceil(geoDistance(st[k], st[k + 1]) / D2R / 1.5));
          for (let i = k === 0 ? 0 : 1; i <= n; i++) { const [lo, la] = ip(i / n); pts.push(xyz(lo, la, 1.0028)); }
        }
      }
      const cum = [0];
      for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]));
      const tot = cum[cum.length - 1] || 1;
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const dv = b.clone().sub(a).normalize().multiplyScalar(0.01);
        for (const [p, s, k] of [[a, -1, i], [a, 1, i], [b, -1, i + 1], [b, 1, i + 1]]) {
          pos.push(p.x, p.y, p.z); dir.push(dv.x, dv.y, dv.z); side.push(s); uu.push(cum[k] / tot); len.push(cum[k]); rid.push(li);
        }
        idx.push(v, v + 1, v + 2, v + 1, v + 3, v + 2);
        v += 4;
      }
    });
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('aDir', new BufferAttribute(new Float32Array(dir), 3));
    g.setAttribute('aSide', new BufferAttribute(new Float32Array(side), 1));
    g.setAttribute('aU', new BufferAttribute(new Float32Array(uu), 1));
    g.setAttribute('aLen', new BufferAttribute(new Float32Array(len), 1));
    g.setAttribute('aR', new BufferAttribute(new Float32Array(rid), 1));
    g.setIndex(idx);
    this.nLines = all.length;
    this.stateData = new Uint8Array(all.length * 2 * 4);
    this.stateTex = new DataTexture(this.stateData, all.length, 2, RGBAFormat, UnsignedByteType);
    this.stateTex.minFilter = NearestFilter; this.stateTex.magFilter = NearestFilter; this.stateTex.needsUpdate = true;
    this.lineMat = new ShaderMaterial({
      uniforms: { uState: { value: this.stateTex }, uRes: { value: [1, 1] }, uPx: { value: 1 }, uDashK: { value: 40 } },
      vertexShader: LINE_VS, fragmentShader: LINE_FS, transparent: true, depthWrite: false, side: DoubleSide,
    });
    const mesh = new Mesh(g, this.lineMat);
    mesh.frustumCulled = false;
    mesh.renderOrder = 2;
    this.scene.add(mesh);
    this.lineVerts = v;
  }

  updateLines() {
    const L = lineSet(S);
    const D = this.stateData;
    D.fill(0);
    const n = this.nLines;
    for (const l of L) {
      const i = this.lineIndex.get(l.id);
      if (i === undefined) continue;
      const tm = lineTime(l, S.year);
      const c = this.cols[l.color] || this.cols.route;
      const b = (x) => Math.max(0, Math.min(255, Math.round(x * 255)));
      D[i * 4] = b(l.a * tm.k); D[i * 4 + 1] = b(tm.p); D[i * 4 + 2] = b(l.dash / 2); D[i * 4 + 3] = b(l.w * 1.25 / 4);
      const j = (n + i) * 4;
      D[j] = b(c.r); D[j + 1] = b(c.g); D[j + 2] = b(c.b); D[j + 3] = 255;
    }
    this.stateTex.needsUpdate = true;
  }

  // ------------------------------------------------------------ marks
  buildMarks() {
    const MAX = 2400;
    const g = new InstancedBufferGeometry();
    g.setAttribute('corner', new BufferAttribute(new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), 2));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    this.mPos = new InstancedBufferAttribute(new Float32Array(MAX * 3), 3);
    this.mSize = new InstancedBufferAttribute(new Float32Array(MAX), 1);
    this.mShape = new InstancedBufferAttribute(new Float32Array(MAX), 1);
    this.mInk = new InstancedBufferAttribute(new Float32Array(MAX), 1);
    this.mFlags = new InstancedBufferAttribute(new Float32Array(MAX), 1);
    for (const [k, a] of [['iPos', this.mPos], ['iSize', this.mSize], ['iShape', this.mShape], ['iInk', this.mInk], ['iFlags', this.mFlags]]) g.setAttribute(k, a);
    g.instanceCount = 0;
    this.markGeo = g;
    this.markMat = new ShaderMaterial({
      uniforms: { uRes: { value: [1, 1] }, uCam: { value: new Vector3() }, uPx: { value: 1 }, cInk: { value: new Color() }, cPaper: { value: new Color() }, cSel: { value: new Color() }, cGold: { value: new Color() }, uPulse: { value: 0 } },
      vertexShader: MARK_VS, fragmentShader: MARK_FS, transparent: true, depthWrite: false,
    });
    const mesh = new Mesh(g, this.markMat);
    mesh.frustumCulled = false;
    mesh.renderOrder = 3;
    this.scene.add(mesh);
    this.marks = [];
    this.markKey = '';
  }

  zoomLevel() {
    const H = this.h || 600;
    const pxPerRad = H / (2 * (this.d - 1) * TANH);
    return Math.log2(pxPerRad * D2R * 360 / 256);
  }
  tierFromZoom() { return this.d < this.fitD * 0.74 ? 'region' : 'world'; }

  updateMarks(force) {
    const region = this.tierFromZoom() === 'region' || S.tier === 'region';
    const z = Math.floor(this.zoomLevel());
    const key = `${region}|${z}|${S.lens}|${S.year}|${INK.version}|${S.node}|${!!exhibitions().length}`;
    if (!force && key === this.markKey) return;
    this.markKey = key;
    const marks = withSelected(region ? regionMarks(this.zoomLevel()) : worldMarks());
    for (const x of exhibitions()) marks.push({ expo: true, id: x.id, x, lon: x.x, lat: x.y, f: 'city', ink: 0 });
    this.marks = marks;
    let n = 0;
    for (const m of marks) {
      if (n >= 2400) break;
      const p = xyz(m.lon, m.lat, m.cluster ? 1.006 : 1.004);
      m.v = p;
      this.mPos.setXYZ(n, p.x, p.y, p.z);
      let size, shape, flags = 0;
      if (m.expo) { size = 9; shape = 1; flags = 16; }
      else if (m.cluster) { size = 8.5 + Math.log2(m.n) * 2.6; shape = 1; flags = 4; }
      else { size = m.f === 'edo' ? 5.6 : region ? 5.4 : 3.6; shape = SHAPE[m.f] ?? 1; if (m.approx) flags += 2; if (m.f === 'edo') flags += 8; if (S.node === m.id) flags += 1; }
      m.size = size;
      this.mSize.setX(n, size); this.mShape.setX(n, shape); this.mInk.setX(n, m.cluster ? (m.ink ? 1 : 0) : m.ink); this.mFlags.setX(n, flags);
      n++;
    }
    for (const a of [this.mPos, this.mSize, this.mShape, this.mInk, this.mFlags]) a.needsUpdate = true;
    this.markGeo.instanceCount = n;
  }

  // ------------------------------------------------------------ state → uniforms
  update() {
    if (!this.uS) return;
    const W = washes(S);
    const sel = S.unit && M.terrById.has(S.unit) ? S.unit : null;
    CHAPTERS.forEach((id, i) => {
      this.uS.uTW.value[i] = W[id];
      this.uS.uTL.value[i] = INK.chapters.has(id) ? 1 : 0;
      this.uS.uTS.value[i] = sel === id ? 1 : 0;
    });
    const lens = S.lens && LENS_DEF[S.lens];
    this.uS.cWash.value = lens?.bit ? this.cExtract : this.cWashBase;
    this.uS.uLensK.value = lens?.bit ? 1 : 0;
    if (lens?.layer === 'industry' && this.lastLens !== S.lens && S.motion) this.startPulse();
    this.lastLens = S.lens;
    this.updateLines();
    this.updateMarks(true);
    this.invalidate();
  }

  startPulse() {
    const t0 = performance.now();
    const step = () => {
      const k = (performance.now() - t0) / 1600;
      this.markMat.uniforms.uPulse.value = k >= 2 ? 0 : (k % 1) || 0.001;
      this.invalidate();
      if (k < 2) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ------------------------------------------------------------ camera
  resize() {
    const w = this.host.clientWidth, h = this.host.clientHeight;
    if (!w || !h) return;
    this.w = w; this.h = h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const hf = Math.atan(TANH * this.camera.aspect);
    const half = Math.min(FOV * D2R / 2, hf);
    const usable = S.phone ? 0.86 : 0.8;
    const prevFit = this.fitD;
    this.fitD = 1 / Math.sin(half * usable);
    if (!prevFit) this.d = this.fitD * 1.08;
    else this.d *= this.fitD / prevFit;
    this.invalidate();
  }

  placeCamera() {
    const p = xyz(this.lon, this.lat, this.d);
    this.camera.position.copy(p);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateMatrixWorld();
    const pr = this.renderer.getPixelRatio();
    this.uS.uCam.value.copy(p);
    this.markMat.uniforms.uCam.value.copy(p);
    const res = [this.w * pr, this.h * pr];
    this.lineMat.uniforms.uRes.value = res; this.lineMat.uniforms.uPx.value = pr;
    this.markMat.uniforms.uRes.value = res; this.markMat.uniforms.uPx.value = pr;
    const radPerPx = 2 * (this.d - 1) * TANH / this.h;
    this.lineMat.uniforms.uDashK.value = 1 / (radPerPx * 9);
    // light from the upper left of the view, so the paper always reads the same way
    const right = new Vector3().crossVectors(this.camera.up, p).normalize();
    this.uS.uLight.value.copy(p.clone().normalize().multiplyScalar(0.9).add(right.multiplyScalar(-0.6)).add(new Vector3(0, 0.6, 0)));
  }

  screenRadius() {
    const a = Math.asin(1 / this.d);
    return (this.h / 2) * Math.tan(a) / TANH;
  }

  project(lon, lat, r = 1.01) {
    const v = xyz(lon, lat, r);
    const facing = v.clone().normalize().dot(this.camera.position.clone().sub(v).normalize());
    const p = v.project(this.camera);
    return { x: (p.x + 1) / 2 * this.w, y: (1 - p.y) / 2 * this.h, vis: facing > 0.16, front: facing };
  }

  invalidate() {
    if (this.need) return;
    this.need = true;
    requestAnimationFrame((t) => this.frame(t));
  }

  frame(t) {
    this.need = false;
    if (this.anim) {
      const done = this.anim(t);
      if (done) this.anim = null; else this.invalidate();
      this.probe(t);
    }
    this.placeCamera();
    const tierNow = this.tierFromZoom();
    if (tierNow !== this.tierNow) { this.tierNow = tierNow; this.api.onZoomTier?.(tierNow); }
    this.updateMarks();
    this.renderer.render(this.scene, this.camera);
    this.drawOverlay();
  }

  probe(t) {
    if (this.lastT) {
      const dt = t - this.lastT;
      if (dt < 200) this.frames.push(dt);
      if (this.frames.length >= 40) {
        const avg = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
        this.frames = [];
        if (avg > 30 && this.q === 2) { this.q = 1; this.uS.uQ.value = 0; this.renderer.setPixelRatio(1); this.resize(); this.api.onQuality?.(1, avg); }
        else if (avg > 48 && this.q === 1) { this.q = 0; this.api.onQuality?.(0, avg); }
      }
    }
    this.lastT = t;
    if (!this.anim) this.lastT = 0;
  }

  drawOverlay() {
    const R = this.screenRadius();
    const cx = this.w / 2, cy = this.h / 2;
    this.shadow.style.width = this.shadow.style.height = `${(R * 2.2).toFixed(0)}px`;
    this.shadow.style.transform = `translate(-50%, -50%) translate(${R * 0.04}px, ${R * 0.09}px)`;
    this.shadow.style.opacity = R > Math.max(this.w, this.h) ? '0' : '1';
    // an engraved horizon ring with a tick every ten degrees of longitude
    const RR = R + 14;
    if (RR < Math.max(this.w, this.h) * 0.75) {
      const size = RR * 2 + 20;
      let ticks = '';
      for (let k = 0; k < 36; k++) {
        const a = ((k * 10 - this.lon) * D2R) - Math.PI / 2;
        const long = k % 3 === 0;
        const r1 = RR - (long ? 6 : 3), r2 = RR;
        ticks += `M${(size / 2 + Math.cos(a) * r1).toFixed(1)} ${(size / 2 + Math.sin(a) * r1).toFixed(1)}L${(size / 2 + Math.cos(a) * r2).toFixed(1)} ${(size / 2 + Math.sin(a) * r2).toFixed(1)}`;
      }
      this.ringEl.setAttribute('width', size); this.ringEl.setAttribute('height', size);
      this.ringEl.setAttribute('viewBox', `0 0 ${size} ${size}`);
      this.ringEl.innerHTML = `<circle cx="${size / 2}" cy="${size / 2}" r="${RR}" fill="none" stroke="currentColor" stroke-width=".8" opacity=".55"/><circle cx="${size / 2}" cy="${size / 2}" r="${RR - 6}" fill="none" stroke="currentColor" stroke-width=".4" opacity=".35"/><path d="${ticks}" stroke="currentColor" stroke-width=".8" opacity=".6"/>`;
      this.ringEl.style.display = '';
    } else this.ringEl.style.display = 'none';
    // labels
    const project = (lon, lat) => this.project(lon, lat);
    const region = this.tierFromZoom() === 'region' || S.tier === 'region';
    let items = territoryLabelItems(project, S.phone);
    if (region) {
      for (const m of this.marks) {
        if (m.expo) continue;
        const p = this.project(m.lon, m.lat, 1.005);
        m.px = p.vis ? [p.x, p.y] : null;
        m.r = m.size + 3;
      }
      items = items.filter((i) => i.kind !== 'territory' || i.pri >= 100 || this.d > this.fitD * 0.5);
      items.push(...markLabelItems(this.marks.filter((m) => !m.expo), S.phone, true));
    }
    for (const m of this.marks) {
      if (!m.expo) continue;
      const p = this.project(m.lon, m.lat);
      if (p.vis) items.push({ key: 'x-' + m.id, kind: 'expo', x: p.x, y: p.y, anchor: 'l', w: Math.min(220, m.x.n.length * 6.4 + 10), h: 20, pri: 40, html: `<span class="lab-expo">${esc(m.x.n)}</span>`, aria: `${m.x.n}, exhibition, ${m.x.s}` });
    }
    updateLabels(items, { max: S.phone ? 12 : 26 });
    this.api.onDraw?.(this);
  }

  // ------------------------------------------------------------ flights (van Wijk and Nuij: out, across, in)
  flyTo(lon, lat, d, opts = {}) {
    d = Math.max(1.12, Math.min(this.fitD * 1.6, d));
    const a = xyz(this.lon, this.lat), b = xyz(lon, lat);
    const theta = a.angleTo(b);
    const H = 2 * TANH;
    const w0 = (this.d - 1) * H, w1 = (d - 1) * H;
    if (!S.motion || opts.cut) {
      return new Promise((res) => {
        const cv = this.renderer.domElement;
        const cut = () => { this.lon = lon; this.lat = lat; this.d = d; this.invalidate(); };
        if (opts.cut === 'instant' || !S.motion && opts.instant) { cut(); res(); return; }
        cv.style.transition = 'opacity 140ms linear'; cv.style.opacity = '0';
        setTimeout(() => { cut(); requestAnimationFrame(() => { cv.style.opacity = '1'; setTimeout(res, 150); }); }, 150);
      });
    }
    const zi = interpolateZoom.rho(1.35)([0, 0, w0], [theta, 0, w1]);
    const dur = Math.max(700, Math.min(2600, zi.duration * 0.9));
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    return new Promise((res) => {
      let t0 = null;
      this.anim = (now) => {
        if (t0 === null) t0 = now;
        const k = Math.min(1, (now - t0) / dur);
        const [u, , w] = zi(ease(k));
        const f = theta > 1e-6 ? u / theta : 1;
        const v = slerp(a, b, f);
        [this.lon, this.lat] = lonlat(v);
        this.d = 1 + w / H;
        if (k >= 1) { this.lon = lon; this.lat = lat; this.d = d; res(); return true; }
        return false;
      };
      this.invalidate();
    });
  }

  intro() {
    if (!S.motion) { this.invalidate(); return; }
    const lon = this.lon, lat = this.lat, d = this.d;
    this.lon = lon - 50; this.d = d * 1.18; this.lat = lat - 6;
    this.flyTo(lon, lat, d);
  }

  flyToTerritory(id) {
    const t = M.terrById.get(id);
    const [lon, lat] = t.label;
    const big = ['F1.6', 'F1.7', 'F1.10'].includes(id);
    return this.flyTo(lon, lat, this.fitD * (big ? 0.66 : 0.56));
  }
  flyToNode(id) {
    const o = M.byId.get(id);
    if (o?.placed) return this.flyTo(o.x, o.y, Math.min(this.d, this.fitD * 0.32));
  }
  home() { return this.flyTo(this.lon, Math.max(-20, Math.min(30, this.lat)), this.fitD * 1.05); }
  flyToEdo() { const [lon, lat] = M.atlas.edo.centre; return this.flyTo(lon, lat, 1.3); }

  nav(dir) {
    const step = Math.max(2, 18 * (this.d - 1) / (this.fitD - 1));
    if (dir === 'in') this.zoomBy(0.72);
    else if (dir === 'out') this.zoomBy(1 / 0.72);
    else if (dir === 'reset') this.home();
    else {
      const lon = this.lon + (dir === 'left' ? -step : dir === 'right' ? step : 0);
      const lat = Math.max(-75, Math.min(75, this.lat + (dir === 'up' ? step * 0.8 : dir === 'down' ? -step * 0.8 : 0)));
      if (S.motion) this.tween({ lon, lat }, 260); else { this.lon = lon; this.lat = lat; this.invalidate(); }
    }
  }
  zoomBy(f) {
    const d = Math.max(1.12, Math.min(this.fitD * 1.6, 1 + (this.d - 1) * f));
    if (S.motion) this.tween({ d }, 260); else { this.d = d; this.invalidate(); }
  }
  tween(to, ms) {
    const from = { lon: this.lon, lat: this.lat, d: this.d };
    let t0 = null;
    this.anim = (now) => {
      if (t0 === null) t0 = now;
      const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      for (const key in to) this[key] = from[key] + (to[key] - from[key]) * e;
      return k >= 1;
    };
    this.invalidate();
  }

  // ------------------------------------------------------------ input
  bindInput(cv) {
    const ptrs = new Map();
    let moved = 0, last = null, pinch0 = null, vel = [0, 0], lastMove = 0;
    cv.addEventListener('pointerdown', (e) => {
      cv.setPointerCapture(e.pointerId);
      ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      moved = 0; last = [e.clientX, e.clientY]; this.anim = null; vel = [0, 0];
      if (ptrs.size === 2) { const [p, q] = [...ptrs.values()]; pinch0 = { dist: Math.hypot(p[0] - q[0], p[1] - q[1]), d: this.d }; }
    });
    cv.addEventListener('pointermove', (e) => {
      if (!ptrs.has(e.pointerId)) return;
      ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      if (ptrs.size === 2 && pinch0) {
        const [p, q] = [...ptrs.values()];
        const dist = Math.hypot(p[0] - q[0], p[1] - q[1]);
        this.d = Math.max(1.12, Math.min(this.fitD * 1.6, 1 + (pinch0.d - 1) * pinch0.dist / Math.max(20, dist)));
        moved += 10; this.invalidate(); return;
      }
      const dx = e.clientX - last[0], dy = e.clientY - last[1];
      last = [e.clientX, e.clientY];
      moved += Math.abs(dx) + Math.abs(dy);
      const k = (2 * (this.d - 1) * TANH / this.h) / D2R;
      const cl = Math.cos(this.lat * D2R);
      this.lon -= dx * k / Math.max(0.35, cl);
      this.lat = Math.max(-75, Math.min(75, this.lat + dy * k));
      vel = [dx * k / Math.max(0.35, cl), dy * k]; lastMove = performance.now();
      this.invalidate();
    });
    const up = (e) => {
      if (!ptrs.has(e.pointerId)) return;
      ptrs.delete(e.pointerId);
      if (ptrs.size < 2) pinch0 = null;
      if (ptrs.size) return;
      if (moved < 6) { this.pick(e.clientX, e.clientY); return; }
      if (S.motion && performance.now() - lastMove < 60 && Math.hypot(vel[0], vel[1]) > 0.05) {
        let v = vel.slice();
        this.anim = () => { this.lon -= v[0]; this.lat = Math.max(-75, Math.min(75, this.lat + v[1])); v = [v[0] * 0.9, v[1] * 0.9]; return Math.hypot(v[0], v[1]) < 0.01; };
        this.invalidate();
      }
    };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', (e) => {
      e.preventDefault();
      const f = Math.exp(Math.max(-0.5, Math.min(0.5, e.deltaY * 0.0015)));
      this.d = Math.max(1.12, Math.min(this.fitD * 1.6, 1 + (this.d - 1) * f));
      this.anim = null;
      this.invalidate();
    }, { passive: false });
  }

  onKey(e) {
    const k = e.key;
    if (k === 'ArrowLeft') this.nav('left');
    else if (k === 'ArrowRight') this.nav('right');
    else if (k === 'ArrowUp') this.nav('up');
    else if (k === 'ArrowDown') this.nav('down');
    else if (k === '+' || k === '=') this.nav('in');
    else if (k === '-' || k === '_') this.nav('out');
    else return false;
    return true;
  }

  pick(cx, cy) {
    const r = this.renderer.domElement.getBoundingClientRect();
    const x = cx - r.left, y = cy - r.top;
    let best = null, bd = 1e9;
    for (const m of this.marks) {
      if (m.expo) continue;
      const p = this.project(m.lon, m.lat, 1.005);
      if (!p.vis) continue;
      const dd = Math.hypot(p.x - x, p.y - y);
      if (dd < Math.max(14, m.size + 4) && dd < bd) { bd = dd; best = m; }
    }
    if (best) {
      if (best.cluster) {
        const z = expansionZoom(best.cid);
        const zNow = this.zoomLevel();
        const f = Math.pow(2, Math.max(1, (z ?? zNow + 1) - zNow + 0.3));
        this.flyTo(best.lon, best.lat, 1 + (this.d - 1) / f);
      } else this.api.onNode(best.id);
      return;
    }
    // territory under the pointer: ray against the unit sphere, then the strongest chapter mask there
    const ndc = new Vector3(x / this.w * 2 - 1, -(y / this.h) * 2 + 1, 0.5).unproject(this.camera);
    const o = this.camera.position, dir = ndc.sub(o).normalize();
    const bq = o.dot(dir), c = o.lengthSq() - 1, disc = bq * bq - c;
    if (disc < 0) return;
    const tt = -bq - Math.sqrt(disc);
    const hit = o.clone().add(dir.multiplyScalar(tt));
    const [lon, lat] = lonlat(hit);
    const id = this.territoryAt(lon, lat);
    if (id) this.api.onTerritory(id);
  }

  territoryAt(lon, lat) {
    if (!this.terrPx) {
      const img = this.terrImg;
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      this.terrPx = ctx.getImageData(0, 0, c.width, c.height);
    }
    const { width: Wd, height: Hd, data } = this.terrPx;
    const px = Math.min(Wd - 1, Math.max(0, Math.floor((lon + 180) / 360 * Wd)));
    const rowH = Hd / 3;
    let best = null, bv = 0.33 * 255;
    CHAPTERS.forEach((id, i) => {
      const sec = Math.floor(i / 3), ch = i % 3;
      const py = Math.min(Hd - 1, Math.floor(sec * rowH + (90 - lat) / 180 * rowH));
      const v = data[(py * Wd + px) * 4 + ch];
      if (v > bv) { bv = v; best = id; }
    });
    return best;
  }

  setVisible(v) {
    this.host.hidden = !v;
    if (v) { this.resize(); this.update(); }
  }

  drawCalls() { return this.renderer.info.render.calls; }
}

function slerp(a, b, t) {
  const om = a.angleTo(b);
  if (om < 1e-6) return a.clone();
  const s = Math.sin(om);
  return a.clone().multiplyScalar(Math.sin((1 - t) * om) / s).add(b.clone().multiplyScalar(Math.sin(t * om) / s));
}

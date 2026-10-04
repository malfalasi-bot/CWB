// Shared WebGL plumbing for every 3D/2.5D piece in the unit (opener, views, uki-e box, Print the Wave).
// One renderer per mounted piece, render-on-demand, DPR capped, quality tier from measured frame time,
// paper grain pinned to screen space, palette read from the CSS tokens so both themes work.
// Load this module (and three) only through dynamic import(), so the story page never pays for WebGL it does not show.
import * as THREE from 'three';
import { motion } from '../util.js';

export { THREE };

export function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

// Read a CSS colour token as a THREE.Color (falls back to a hex if the token is missing).
export function token(name, fallback = '#888888') {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  return new THREE.Color(v);
}

// Quality tiers: 2 = full, 1 = reduced (DPR 1, no post), 0 = still frame only.
export function initialTier() {
  if (!webglOK()) return 0;
  const mob = matchMedia('(max-width: 820px)').matches;
  const mem = navigator.deviceMemory || 4;
  return mob || mem <= 2 ? 1 : 2;
}

/**
 * makeStage(container, { ortho, fov, clear, alpha })
 * Returns { renderer, scene, camera, canvas, size(), invalidate(), loop(fn), tier, dispose(), onResize(fn) }.
 * - invalidate() schedules one frame (render-on-demand). loop(fn) runs fn(dt, t) each frame until fn returns false.
 * - The frame-time probe drops the tier once if the median frame is over 33 ms for 2 s, and calls onTier(t).
 */
export function makeStage(container, opts = {}) {
  const tier = opts.tier ?? initialTier();
  const canvas = document.createElement('canvas');
  canvas.className = 'gl';
  canvas.setAttribute('aria-hidden', 'true');
  container.append(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: tier >= 2, alpha: opts.alpha ?? true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const dprCap = tier >= 2 ? 2 : 1.25;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, dprCap));
  const scene = new THREE.Scene();
  let camera;
  if (opts.ortho) { camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000); camera.position.z = 10; }
  else { camera = new THREE.PerspectiveCamera(opts.fov ?? 35, 1, 0.1, 2000); camera.position.z = 5; }
  const st = { renderer, scene, camera, canvas, tier, dead: false, W: 1, H: 1 };
  const resizeFns = [];
  let raf = 0, pending = false, loopFn = null, last = 0;
  const frames = [];
  const frame = (t) => {
    raf = 0; pending = false;
    if (st.dead) return;
    const dt = last ? Math.min(0.1, (t - last) / 1000) : 0.016; last = t;
    let again = false;
    if (loopFn) { const r = loopFn(dt, t / 1000); if (r === false) loopFn = null; else again = true; }
    renderer.render(scene, camera);
    // frame-time probe
    frames.push(dt * 1000); if (frames.length > 120) frames.shift();
    if (frames.length === 120 && st.tier > 0) {
      const med = [...frames].sort((a, b) => a - b)[60];
      if (med > 33) { st.tier -= 1; frames.length = 0; renderer.setPixelRatio(1); opts.onTier?.(st.tier); }
    }
    if (again) schedule(); else last = 0;
  };
  const schedule = () => { if (!pending && !st.dead) { pending = true; raf = requestAnimationFrame(frame); } };
  st.invalidate = schedule;
  st.loop = (fn) => { loopFn = motion.reduced && !opts.loopUnderReduced ? (dt, t) => { fn(dt, t); return false; } : fn; schedule(); };
  st.size = () => ({ W: st.W, H: st.H });
  st.onResize = (fn) => { resizeFns.push(fn); fn(st.W, st.H); };
  const resize = () => {
    const r = container.getBoundingClientRect();
    st.W = Math.max(1, r.width); st.H = Math.max(1, r.height);
    renderer.setSize(st.W, st.H, false);
    canvas.style.width = st.W + 'px'; canvas.style.height = st.H + 'px';
    if (camera.isPerspectiveCamera) camera.aspect = st.W / st.H;
    else { const a = st.W / st.H; camera.left = -a; camera.right = a; camera.top = 1; camera.bottom = -1; }
    camera.updateProjectionMatrix();
    resizeFns.forEach((f) => f(st.W, st.H));
    schedule();
  };
  const ro = new ResizeObserver(resize); ro.observe(container); resize();
  st.dispose = () => {
    st.dead = true; ro.disconnect(); if (raf) cancelAnimationFrame(raf);
    scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach((mm) => { Object.values(mm).forEach((v) => v?.isTexture && v.dispose()); mm.dispose?.(); }); });
    renderer.dispose(); canvas.remove();
  };
  return st;
}

// Load a texture from a published file; resolves when decoded. sRGB by default.
const loader = new THREE.TextureLoader();
export function loadTex(url, { srgb = true, aniso = 4 } = {}) {
  return new Promise((res, rej) => loader.load(url, (t) => { if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; res(t); }, undefined, rej));
}

// GLSL: screen-space paper grain + fibre, cheap value noise. Mix into any fragment shader with paperGrain(gl_FragCoord.xy).
export const GLSL_PAPER = /* glsl */`
float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), u.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), u.x), u.y); }
float paperGrain(vec2 fc){ float g = vnoise(fc*0.9)*0.5 + vnoise(fc*0.23)*0.35 + vnoise(fc*vec2(0.05,0.6))*0.15; return g; }
`;

// GLSL: ink-bleed mask with a soft noisy edge. Note the direction: it returns ~1 at p = 0 and ~0 at p = 1
// (an ink that recedes); use 1.0 - bleed(...) for a reveal.
export const GLSL_BLEED = /* glsl */`
float bleed(vec2 uv, float p, float seed){ float n = vnoise(uv*6.0 + seed)*0.6 + vnoise(uv*23.0 + seed)*0.4;
  return smoothstep(p - 0.08, p + 0.02, 1.0 - n*0.85 - (1.0-p)*0.15) ; }
`;

// A full-screen paper overlay material (multiply grain onto whatever is behind). Add as the last mesh in an ortho scene.
export function paperOverlay(strength = 0.07) {
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false,
    uniforms: { uStrength: { value: strength } },
    vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: GLSL_PAPER + 'uniform float uStrength; void main(){ float g = paperGrain(gl_FragCoord.xy); gl_FragColor = vec4(vec3(0.0), (g-0.45)*uStrength*2.0); }',
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); m.frustumCulled = false; m.renderOrder = 999; return m;
}

// Easing used by the motion tokens (matches --e-standard and --e-enter in styles.css).
export const ease = {
  standard: (x) => cubicBezier(0.2, 0, 0, 1)(x),
  enter: (x) => cubicBezier(0.05, 0.7, 0.1, 1)(x),
  exit: (x) => cubicBezier(0.3, 0, 0.8, 0.15)(x),
  expressive: (x) => cubicBezier(0.4, 0.14, 0.3, 1)(x),
};
function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t, sy = (t) => ((ay * t + by) * t + cy) * t, dsx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => { let t = x; for (let i = 0; i < 6; i++) { const d = dsx(t); if (Math.abs(d) < 1e-6) break; t -= (sx(t) - x) / d; } return sy(Math.max(0, Math.min(1, t))); };
}

// Critically damped spring towards a target, for direct manipulation (drag release, snap to kentō).
export function spring(value, target, vel, dt, stiffness = 300, damping = 30) {
  const f = -stiffness * (value - target) - damping * vel;
  vel += f * dt; value += vel * dt; return [value, vel];
}

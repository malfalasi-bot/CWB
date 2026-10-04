// Choose the bench renderer: three.js when WebGL works and the quality tier allows it, otherwise the 2D version
// (the same steps, with the layers as stacked canvases). Both expose the same small API used by room.js and stage.js.
export async function makeRenderer(container, D, { mode, ctx }) {
  const forceFlat = ctx.params?.flat || /[?&]flat\b/.test(location.search);
  let common = null;
  try { common = await import('../../3d/common.js'); } catch (e) { console.warn('[print] 3D module failed to load', e); }
  let R = null;
  if (common && !forceFlat && common.initialTier() > 0) {
    try {
      const { createGL } = await import('./gl.js');
      R = await createGL(container, D, { mode, onTier: (t) => ctx.onTier?.(t) });
    } catch (e) { console.warn('[print] WebGL bench unavailable, using the 2D bench', e); container.querySelector('canvas.gl')?.remove(); R = null; }
  }
  if (!R) { const { createFlat } = await import('./flat.js'); R = await createFlat(container, D, { mode, scope: ctx.scope, motion: ctx.motion }); }
  if (!R) return null;
  // direct manipulation settles with the shared critically damped spring
  R.spring = common?.spring || ((v, t, vel, dt, k = 300, c = 30) => { vel += (-k * (v - t) - c * vel) * dt; return [v + vel * dt, vel]; });
  Object.defineProperty(R, 'reduced', { get: () => ctx.motion.reduced, configurable: true });
  return R;
}

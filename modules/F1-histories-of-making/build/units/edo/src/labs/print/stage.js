// Print the Wave, mode 'stage': beside the story, under a minute. The six blocks hang as an exploded stack over the sheet
// and drop onto the kentō one by one as the learner scrubs or presses play. Reduced motion: discrete states, short cross-fades.
import { el } from '../../util.js';
import { frame, honesty, sources, liveRegion, saver, blockOf } from './model.js';
import { makeRenderer } from './renderer.js';

export async function mount(root, ctx, D) {
  const { scope, motion } = ctx;
  const save = saver(ctx, 'print:stage');
  const order = ['key', ...D.lightToDark];
  const N = order.length;
  const F = frame(root, { title: 'Print the Wave', cls: 'print-stage', onReset: () => { stop(); fadeTo(0); say('Reset: all six blocks hang over the sheet.'); } });
  const view = el('div', { class: 'print-view print-stageview', role: 'img', 'aria-label': 'Six woodblocks hanging over a sheet of paper' });
  const live = liveRegion();
  const range = el('input', { type: 'range', class: 'print-range', min: 0, max: N, step: motion.reduced ? 1 : 0.01, value: 0, 'aria-label': 'Blocks laid down', 'aria-valuetext': '' });
  const playB = el('button', { type: 'button', class: 'print-btn primary' }, 'Play');
  const count = el('span', { class: 'print-count' });
  const open = el('button', { type: 'button', class: 'print-btn open' }, 'Print it yourself →');
  open.addEventListener('click', () => ctx.openRoom?.('workshop'));
  F.body.append(view,
    el('div', { class: 'print-row print-controls' }, playB, el('label', { class: 'print-field grow' }, el('span', { class: 'vh', text: 'Blocks laid down' }), range), count),
    live, open,
    el('p', { class: 'print-what', text: 'Here the key block goes down first, then the colours from light to dark, each block meeting the sheet at the same two kentō notches. The usual practice; the order for this sheet is not recorded.' }),
    honesty(D, { short: true }));
  F.foot.append(sources(D));
  const say = (t) => { live.textContent = ''; scope.timeout(() => { live.textContent = t; }, 30); };

  const R = await makeRenderer(view, D, { mode: 'stage', ctx });
  if (!R) return { destroy() {}, describe: () => '' };
  scope.onDispose(() => R.destroy());

  let p = Math.max(0, Math.min(N, +save.get(0) || 0)), lastN = Math.floor(p + 1e-6);
  const label = (n) => (n <= 0 ? 'No blocks laid yet: all six hang over the sheet.' : `Block ${n} of ${N} laid: ${blockOf(D, order[n - 1]).short}.`);
  function set(v, discrete = motion.reduced) {
    p = v; R.setStage(p, { discrete });
    const n = Math.floor(p + 1e-6);
    range.value = String(p); range.setAttribute('aria-valuetext', label(n)); count.textContent = `${n} of ${N}`;
    view.setAttribute('aria-label', n >= N ? 'The six blocks have all printed: the Great Wave on the sheet, a reconstruction.' : `Woodblocks over a sheet. ${label(n)}`);
    if (n !== lastN) { lastN = n; say(label(n)); }
    save.set(Math.round(p * 100) / 100);
  }
  // reduced motion: integers only, a ≤ 150 ms cross-fade between states
  let fadeId = 0;
  function fadeTo(target) {
    const id = ++fadeId, from = p, t0 = performance.now(), ms = motion.reduced ? 150 : 0;
    if (!ms) return set(target);
    const step = (now) => { if (id !== fadeId) return; const k = Math.min(1, (now - t0) / ms); set(from + (target - from) * k, true); if (k < 1) scope.raf(step); };
    scope.raf(step);
  }
  range.addEventListener('input', () => { stop(); if (motion.reduced) fadeTo(Math.round(+range.value)); else set(+range.value); });

  // play: about 1.1 s per block; a probe logs the median frame time of the drop
  let playing = false, raf = 0;
  const probe = [];
  function stop() { playing = false; playB.textContent = p >= N ? 'Play again' : 'Play'; }
  function start() {
    if (p >= N - 1e-3) set(0);
    playing = true; playB.textContent = 'Pause'; probe.length = 0;
    let last = performance.now();
    if (motion.reduced) {
      const tick = () => { if (!playing) return; if (p >= N) { stop(); return; } fadeTo(Math.floor(p) + 1); scope.timeout(tick, 1100); };
      tick(); return;
    }
    const step = (now) => {
      if (!playing) return;
      const dt = now - last; last = now; probe.push(dt);
      set(Math.min(N, p + dt / 1100), false);
      if (p >= N) { stop(); report(); return; }
      raf = scope.raf(step);
    };
    raf = scope.raf(step);
  }
  function report() {
    if (probe.length < 10) return;
    const s = probe.slice(2).sort((a, b) => a - b), med = s[Math.floor(s.length / 2)];
    R.lastMedianFrame = med;
    console.info(`[print] drop animation: median frame ${med.toFixed(1)} ms over ${s.length} frames (${R.kind}, draw calls ${R.drawCalls?.() ?? 'n/a'})`);
  }
  playB.addEventListener('click', () => (playing ? stop() : start()));
  set(p, true); if (!motion.reduced) set(p);
  stop();

  return {
    destroy() { stop(); R.destroy(); F.box.remove(); },
    describe() { return `Print the Wave: ${label(Math.floor(p + 1e-6))} A reconstruction separated from a photograph of the Met’s Great Wave.`; },
    _R: R,
  };
}

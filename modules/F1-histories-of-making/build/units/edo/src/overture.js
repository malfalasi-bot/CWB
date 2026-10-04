// The overture: nine viewports of scroll that tell the whole story before the first scene.
// It drives the Depth builder's 3D opener (src/3d/opener.js) with setProgress(0..9). If WebGL is missing or the
// module fails, composed 2.5D stills play the same nine shots from the same images, driven by the same scroll.
// One caption block crossfades per shot. The first focusable element skips the whole thing.
import { el, motion, Scope, imgUrl } from './util.js';

const OPENER = import.meta.glob('./3d/opener.js');
const N = 9;
const LABEL = { paper: 'The floating world', wave: 'The wave', shop: 'The shop', blocks: 'The blocks', edo: 'The city', seal: 'The seal', sea: 'The sea', return: 'The return', contents: 'Five acts' };

const svg = (h) => { const d = document.createElement('div'); d.className = 'svgwrap'; d.innerHTML = h; return d; };
function webgl() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }

export class Overture {
  constructor(root, C, { onGo, onAct } = {}) {
    this.root = root; this.C = C; this.onGo = onGo; this.shots = C.overture.shots;
    this.scope = new Scope(); this.p = 0; this.cur = -1; this.mode = 'stills';
    root.classList.add('overture'); root.setAttribute('aria-label', 'Overture: the story in nine shots');
    this.skip = el('a', { class: 'ov-skip', href: '#story' }, 'Skip the overture', el('span', { 'aria-hidden': 'true', text: ' ↓' }));
    this.skip.addEventListener('click', (e) => { e.preventDefault(); this.done(); });
    this.stage = el('div', { class: 'ov-stage', 'aria-hidden': 'true' });
    this.stills = el('div', { class: 'ov-stills' });
    this.gl = el('div', { class: 'ov-gl' });
    this.stage.append(this.stills, this.gl);
    this.capN = el('span', { class: 'ov-n' });
    this.capL = el('span', { class: 'ov-l' });
    this.capT = el('p', { class: 'ov-t' });
    this.capAlt = el('span', { class: 'vh' });
    this.cap = el('div', { class: 'ov-cap', 'aria-live': 'polite' }, el('div', { class: 'ov-meta' }, this.capN, this.capL), this.capT, this.capAlt);
    this.ticks = el('ol', { class: 'ov-ticks', 'aria-hidden': 'true' }, ...this.shots.map((s) => el('li', {}, el('i'))));
    this.contents = el('nav', { class: 'ov-contents', 'aria-label': 'The five acts' });
    C.acts.filter((a) => a.id !== 'p').forEach((a, i) => {
      const lnk = el('a', { href: `#act-${a.id}`, class: 'ov-act', style: `--i:${i}`, 'data-act': a.id },
        el('span', { class: 'ov-act-n', text: a.n }),
        el('span', { class: 'ov-act-t' }, el('span', { class: 'ov-act-title', text: a.title }), el('span', { class: 'ov-act-y', text: `${a.years || ''} · ${(a.kicker.split('·').pop() || '').trim()}` })));
      lnk.addEventListener('click', (e) => { e.preventDefault(); onAct?.(a.id); });
      this.contents.append(lnk);
    });
    this.hint = el('div', { class: 'ov-hint', 'aria-hidden': 'true' }, el('span', { text: 'Scroll' }), el('i'));
    this.pin = el('div', { class: 'ov-pin' }, this.skip, this.stage, this.cap, this.ticks, this.contents, this.hint);
    root.append(this.pin);
    this.buildStills();
    this.mount3d();
  }

  // ---------- composed stills: the same nine shots as layered planes, moved by scroll (CSS 2.5D)
  buildStills() {
    const S = this.stills, C = this.C;
    const img = (src, cls, alt = '') => el('img', { src, class: cls, alt, decoding: 'async', loading: 'eager', draggable: 'false' });
    const shot = (id, ...kids) => { const d = el('div', { class: `ov-shot s-${id}`, 'data-shot': id }, ...kids); S.append(d); return d; };
    shot('paper', el('div', { class: 'ov-washi' }), el('div', { class: 'ov-kanji', lang: 'ja', text: C.unit.kanji || '浮世' }), el('div', { class: 'ov-title' }, el('span', { class: 'ov-title-k', text: 'Edo, 1603–1868 · and after' }), el('span', { class: 'ov-title-t', text: C.unit.title })));
    shot('wave', el('div', { class: 'ov-depth' }, ...[0, 1, 2, 3, 4].map((i) => img(`img/ov/wave-p${i}.webp`, `pl p${i}`))));
    shot('shop', el('div', { class: 'ov-frame' }, img(imgUrl('printshop'), 'shop')), el('div', { class: 'ov-mini-wave' }, img('img/ov/wave-p3.webp', '')));
    const layers = (C.peel?.layers || []).map((l) => l.id);
    shot('blocks', el('div', { class: 'ov-blocks' }, ...layers.map((id, i) => img(`img/peel/${id}.webp`, 'blk', '')).map((n, i) => { n.style.setProperty('--k', i); n.style.setProperty('--n', layers.length); return n; }), el('div', { class: 'kento k1' }), el('div', { class: 'kento k2' })));
    shot('edo', el('div', { class: 'ov-tilt' }, img('img/ov/map-1859.webp', 'map'), svg('<svg class="ov-road" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M62 46 C 55 55, 45 62, 30 70 S 8 84, -4 92" pathLength="1"/></svg>')));
    shot('seal', el('div', { class: 'ov-sheetbg' }, img(imgUrl('utamaro-tsutaya'), 'sealprint')), el('div', { class: 'kiwame', lang: 'ja' }, el('span', { text: '極' })));
    shot('sea', el('div', { class: 'ov-world' }, svg('<svg class="ov-route" viewBox="0 0 200 100"><path class="globe" d="M10 50 a90 42 0 1 0 180 0 a90 42 0 1 0 -180 0"/><path class="lat" d="M18 34 Q100 26 182 34 M12 50 L188 50 M18 66 Q100 74 182 66"/><path class="rt" pathLength="1" d="M168 40 C 150 70, 120 78, 96 70 S 66 40, 46 34"/><circle cx="168" cy="40" r="2.4"/><circle cx="46" cy="34" r="2.4"/><text x="170" y="34">Yokohama</text><text x="30" y="28">Paris</text></svg>')), el('div', { class: 'ov-cover' }, img(imgUrl('japon-artistique'), 'cover')));
    shot('return', el('div', { class: 'ov-note' }, el('div', { class: 'note-frame' }, el('div', { class: 'note-guil' }), img('img/ov/wave-p3.webp', 'note-wave'), el('span', { class: 'note-lab', text: 'Schematic outline · the note is described, not shown' }))));
    shot('contents', el('div', { class: 'ov-washi' }));
    this.shotEls = [...S.children];
  }

  async mount3d() {
    const load = OPENER['./3d/opener.js'];
    let forceStills = false; try { forceStills = new URLSearchParams(location.search).get('ov') === 'stills'; } catch (e) { /* */ }
    if (!load || !webgl() || forceStills) return;
    // the 3D contents shot reports where its five act blocks are on screen; the real links sit exactly over them
    this.gl.addEventListener('overture-contents', (e) => this.placeContents(e.detail?.rects || []));
    try {
      const mod = await load();
      const opener = mod.default || mod;
      if (!opener?.mount) return;
      const inst = await opener.mount(this.gl, { C: this.C, scope: this.scope, motion, mode: 'overture', imgUrl });
      if (!inst?.setProgress) { inst?.destroy?.(); return; }
      this.inst = inst; this.mode = 'gl';
      this.root.classList.add('has-gl');
      this.update(true);
    } catch (e) {
      console.error('overture: the 3D opener failed; showing the stills', e);
      this.root.classList.remove('has-gl'); this.mode = 'stills'; this.gl.innerHTML = '';
    }
  }

  placeContents(rects) {
    if (this.mode !== 'gl' && !this.inst) return;
    this.contents.classList.add('gl');
    rects.forEach((r) => {
      const a = this.contents.querySelector(`[data-act="${r.id}"]`); if (!a) return;
      Object.assign(a.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.width}px`, height: `${r.height}px` });
    });
  }

  // called from the page's scroll handler
  update(force = false) {
    const r = this.root.getBoundingClientRect();
    const vh = innerHeight;
    const total = r.height - vh;
    const p = Math.max(0, Math.min(N - 0.0001, (-r.top / Math.max(1, total)) * N));
    const inView = r.bottom > 0 && r.top < vh;
    document.body.classList.toggle('in-ov', r.bottom > vh * 0.5);
    if (!inView && !force) return;
    if (Math.abs(p - this.p) < 0.0005 && !force) return;
    this.p = p;
    const i = Math.floor(p), f = p - i;
    if (this.inst) { try { this.inst.setProgress(motion.reduced ? i : p); } catch (e) { console.error(e); } }
    if (i !== this.cur) this.setShot(i);
    // stills: the shot's own motion runs on --f (0..1); reduced motion shows each shot's end state
    const ff = motion.reduced ? 1 : f;
    this.root.style.setProperty('--f', ff.toFixed(4));
    this.root.style.setProperty('--p', (p / N).toFixed(4));
  }
  setShot(i) {
    const prev = this.cur; this.cur = i;
    const s = this.shots[i];
    this.shotEls.forEach((n, k) => { n.classList.toggle('on', k === i); n.classList.toggle('past', k < i); });
    [...this.ticks.children].forEach((t, k) => { t.classList.toggle('on', k === i); t.classList.toggle('past', k < i); });
    this.root.dataset.shot = s.id;
    const swap = () => { this.capN.textContent = `${String(i + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`; this.capL.textContent = LABEL[s.id] || ''; this.capT.textContent = s.text; this.capAlt.textContent = ` ${s.alt}`; this.cap.classList.remove('out'); };
    // crossfade by class so the end state never depends on an animation finishing
    clearTimeout(this.capT0);
    if (prev < 0 || motion.reduced) swap();
    else { this.cap.classList.add('out'); this.capT0 = setTimeout(swap, 170); }
    this.contents.inert = s.id !== 'contents';
    this.contents.classList.toggle('on', s.id === 'contents');
  }
  done() { this.onGo?.(); }
  get end() { return this.root.offsetTop + this.root.offsetHeight; }
  destroy() { this.scope.dispose(); try { this.inst?.destroy?.(); } catch (e) { /* */ } }
}

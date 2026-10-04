// Lab · comparison: three aligned impressions of the Great Wave, a split slider, a loupe, and five differences to spot.
// Nothing on the sheets gives their order; the British Museum orders impressions by wear and recutting in the blocks.
import { el, esc, provenance, imgUrl } from '../util.js';
import { confChip, EASE_CSS } from '../cards.js';
import './compare.css';

const IDS = ['jp1847', 'jp10', 'aic'];
const SHORT = { jp1847: 'Met JP1847', jp10: 'Met JP10', aic: 'Chicago 1952.343' };
const AR = 1075 / 1600;
// x, y, w, h as fractions of the aligned sheet; hit = how near a tap counts
const SPOTS = [
  { id: 'sky', title: 'The sky', r: [0.54, 0.05, 0.32, 0.32], conf: 'probable',
    text: 'JP1847 keeps its clouds in a pale wash. On JP10 they have almost gone. The Chicago sheet’s clouds are pink: probably safflower, the colour that fades first.' },
  { id: 'horizon', title: 'The horizon grey', r: [0.47, 0.56, 0.3, 0.13], conf: 'documented',
    text: 'The grey behind Fuji was graded by wiping the block for each pull, so no two sheets match. See how dark it runs on JP10.' },
  { id: 'boats', title: 'The boats', r: [0.41, 0.75, 0.3, 0.17], conf: 'documented',
    text: 'On JP1847 the boats are a pinkish buff; on the other two, yellow. Boat colour is one of the signs used to sort printings.' },
  { id: 'title', title: 'The title cartouche', r: [0.045, 0.06, 0.055, 0.18], conf: 'documented',
    text: 'Look at the double border round the title. Breaks where the wood split are a classic sign of a later pull.' },
  { id: 'seal', title: 'A collector’s seal', r: [0.05, 0.29, 0.04, 0.06], conf: 'documented',
    text: 'JP10 carries a collector’s seal beside the signature: a later owner’s mark, added after the sheet left the shop.' },
];
const SOURCES = [['bm-spot', 'documented'], ['korenberg', 'documented'], ['met-wave', 'documented'], ['met-wave-record', 'documented']];

export default {
  id: 'compare', title: 'One design, three originals', kicker: 'Lab · comparison',
  async mount(root, ctx) {
    const { C, scope, motion } = ctx;
    const W = C.images?.waves || {};
    const st = { a: 'jp1847', b: 'jp10', split: 0.5, spot: null, found: new Set(ctx.store?.get('compare.found', []) || []), loupe: false, k: 1, tx: 0, ty: 0 };
    root.innerHTML = '';
    const live = el('p', { class: 'vh', 'aria-live': 'polite' });
    // ---- the view
    const imA = el('img', { class: 'cmp-img a', alt: '', draggable: 'false' }), imB = el('img', { class: 'cmp-img b', alt: '', draggable: 'false' });
    const marks = el('div', { class: 'cmp-marks' });
    const inner = el('div', { class: 'cmp-inner' }, imA, imB);
    const handle = el('div', { class: 'cmp-split', role: 'slider', tabindex: '0', 'aria-label': 'Divide between the two impressions', 'aria-valuemin': '0', 'aria-valuemax': '100' },
      el('span', { class: 'grip', 'aria-hidden': 'true' }, el('i'), el('i')));
    const tagA = el('span', { class: 'cmp-tag l' }), tagB = el('span', { class: 'cmp-tag r' });
    const loupe = el('div', { class: 'cmp-loupe', hidden: true, 'aria-hidden': 'true' });
    const view = el('div', { class: 'cmp-view', role: 'img' }, inner, marks, handle, tagA, tagB, loupe);
    // ---- the side
    const pick = (label, key) => el('div', { class: 'cmp-pick', role: 'group', 'aria-label': label }, el('span', { class: 'cc-kick', text: label }),
      ...IDS.map((id) => el('button', { type: 'button', class: 'cmp-chip', 'data-id': id, 'aria-pressed': 'false', onclick: () => { st[key] = id; if (st.a === st.b) st[key === 'a' ? 'b' : 'a'] = IDS.find((x) => x !== id); draw(); } }, SHORT[id])));
    const pA = pick('Left', 'a'), pB = pick('Right', 'b');
    const note = el('div', { class: 'cmp-note', 'aria-live': 'polite' });
    const spotList = el('ul', { class: 'cmp-spots', 'aria-label': 'Differences to look for' });
    const btnLoupe = el('button', { type: 'button', class: 'cmp-tool', 'aria-pressed': 'false', onclick: () => setLoupe(!st.loupe) }, el('span', { class: 'ico', 'aria-hidden': 'true', html: '<svg viewBox="0 0 20 20" width="15" height="15"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12.6 12.6l4.6 4.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' }), 'Loupe');
    const btnWhole = el('button', { type: 'button', class: 'cmp-tool', onclick: () => { st.spot = null; zoomTo(null); draw(); } }, 'Whole sheet');
    const reset = el('button', { type: 'button', class: 'cc-lab-reset', onclick: () => { st.a = 'jp1847'; st.b = 'jp10'; st.split = 0.5; st.spot = null; st.found.clear(); ctx.store?.set('compare.found', []); setLoupe(false); zoomTo(null); draw(); live.textContent = 'Reset.'; } }, 'Reset');
    const what = el('div', { class: 'cc-lab-what' }, el('span', { class: 'cc-kick', text: 'What this shows' }),
      el('p', { text: 'Three original impressions of one design, printed from the same blocks and aligned so the lines match. Every difference is a difference in printing, paper, wear or later life.' }),
      el('p', { class: 'strong', text: 'Nothing on the sheets says which was printed first. The British Museum orders impressions by wear and recutting in the blocks.' }));
    const srcs = el('ol', { class: 'cc-lab-src' }, ...SOURCES.map(([id, conf]) => { const s = C.sources?.[id]; return s ? el('li', {}, s.u ? el('a', { href: s.u, target: '_blank', rel: 'noopener' }, s.t) : s.t, ' ', confChip(conf)) : null; }).filter(Boolean));
    const prov = el('div', { class: 'cmp-prov' });
    const side = el('div', { class: 'cmp-side' }, pA, pB, el('div', { class: 'cmp-tools' }, btnLoupe, btnWhole), el('span', { class: 'cc-kick', text: 'Spot the differences: tap the sheet, or choose' }), spotList, note);
    const frame = el('section', { class: 'cc-lab cmp', 'aria-label': 'Lab: compare three Great Waves' },
      el('header', { class: 'cc-lab-head' }, el('span', { class: 'cc-lab-kick', text: 'LAB · comparison' }), el('h4', { text: 'One design, three originals' }), reset),
      el('div', { class: 'cmp-body' }, view, side), what, el('details', { class: 'cc-lab-foot' }, el('summary', {}, 'Objects and sources'), prov, srcs), live);
    root.append(frame);

    // ---- geometry
    const vw = () => view.clientWidth || 600;
    const zoomTo = (r) => {
      if (!r) { st.k = 1; st.tx = 0; st.ty = 0; }
      else {
        const W0 = vw(), H0 = W0 * AR, [x, y, w, h] = r;
        const k = Math.min(3.2, Math.min(W0 / (w * W0 * 1.5), H0 / (h * H0 * 1.5)));
        st.k = Math.max(1.4, k);
        st.tx = Math.min(0, Math.max(W0 - W0 * st.k, W0 / 2 - (x + w / 2) * W0 * st.k));
        st.ty = Math.min(0, Math.max(H0 - H0 * st.k, H0 / 2 - (y + h / 2) * H0 * st.k));
      }
      inner.style.transition = motion.reduced ? 'none' : `transform var(--d-long) ${EASE_CSS.standard}`;
      inner.style.transform = `translate(${st.tx}px, ${st.ty}px) scale(${st.k})`;
      marks.classList.toggle('glide', !motion.reduced);
      placeMarks(); clip();
    };
    const clip = () => {
      const W0 = vw(), u = (st.split * W0 - st.tx) / (st.k * W0);
      imB.style.clipPath = `inset(0 0 0 ${Math.max(0, Math.min(1, u)) * 100}%)`;
      handle.style.left = `${st.split * 100}%`;
      handle.setAttribute('aria-valuenow', String(Math.round(st.split * 100)));
      handle.setAttribute('aria-valuetext', `${Math.round(st.split * 100)}%: ${SHORT[st.a]} left, ${SHORT[st.b]} right`);
    };
    // marks live outside the zoomed layer so their ink stays 2 px; they glide with the zoom
    const placeMarks = () => {
      const W0 = vw(), H0 = W0 * AR;
      marks.querySelectorAll('.cmp-mark').forEach((m) => {
        const [x, y, w, h] = SPOTS.find((s) => s.id === m.dataset.id).r;
        Object.assign(m.style, { left: `${st.tx + x * W0 * st.k}px`, top: `${st.ty + y * H0 * st.k}px`, width: `${w * W0 * st.k}px`, height: `${h * H0 * st.k}px` });
      });
    };
    const drawSpots = () => {
      marks.innerHTML = '';
      SPOTS.forEach((s, i) => {
        if (!st.found.has(s.id)) return;
        const m = el('button', { type: 'button', class: `cmp-mark${st.spot === s.id ? ' on' : ''}`, 'data-id': s.id, 'aria-label': s.title, onclick: (e) => { e.stopPropagation(); open(s.id); } },
          el('span', { class: 'n', text: String(i + 1) }));
        marks.append(m);
      });
      placeMarks();
    };
    const draw = () => {
      imA.src = imgUrl(st.a, 'waves'); imB.src = imgUrl(st.b, 'waves');
      tagA.textContent = SHORT[st.a]; tagB.textContent = SHORT[st.b];
      [pA, pB].forEach((p, j) => p.querySelectorAll('button').forEach((b) => { const on = b.dataset.id === (j ? st.b : st.a); b.setAttribute('aria-pressed', String(on)); }));
      view.setAttribute('aria-label', `${SHORT[st.a]} on the left, ${SHORT[st.b]} on the right${st.spot ? ', looking at ' + SPOTS.find((s) => s.id === st.spot).title.toLowerCase() : ''}.`);
      spotList.innerHTML = '';
      SPOTS.forEach((s, i) => spotList.append(el('li', {}, el('button', { type: 'button', class: `cmp-spot${st.found.has(s.id) ? ' found' : ''}${st.spot === s.id ? ' on' : ''}`, 'aria-pressed': String(st.spot === s.id), onclick: () => open(s.id) },
        el('span', { class: 'n', 'aria-hidden': 'true', text: st.found.has(s.id) ? String(i + 1) : '' }), s.title))));
      const s = SPOTS.find((q) => q.id === st.spot);
      note.innerHTML = '';
      if (s) note.append(el('div', { class: 'cmp-note-h' }, el('b', { text: s.title }), confChip(s.conf)), el('p', { text: s.text }));
      else note.append(el('p', { class: 'muted', text: 'Drag the divide, or tap anything that looks different between the two sheets.' }));
      prov.innerHTML = [st.a, st.b].map((id) => `<p><b>${esc(SHORT[id])}</b> · ${provenance(W[id])}</p>`).join('');
      drawSpots(); clip();
    };
    const open = (id, fromTap) => {
      const s = SPOTS.find((q) => q.id === id); if (!s) return;
      const fresh = !st.found.has(id);
      st.found.add(id); ctx.store?.set('compare.found', [...st.found]);
      st.spot = id;
      // the seal is only on JP10 and sits at the left edge: put JP10 on the left
      if (s.id === 'seal' && st.a !== 'jp10') { st.b = st.a; st.a = 'jp10'; }
      zoomTo(s.r); draw();
      live.textContent = `${s.title}. ${s.text}`;
      if (fresh && !motion.reduced) marks.querySelector('.cmp-mark.on')?.animate([{ transform: 'scale(1.06)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 200, easing: EASE_CSS.standard });
      void fromTap;
    };
    // ---- interactions: drag the divide; tap to spot; loupe
    const setSplit = (clientX) => { const R = view.getBoundingClientRect(); st.split = Math.max(0, Math.min(1, (clientX - R.left) / R.width)); clip(); };
    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault(); e.stopPropagation(); handle.focus(); handle.classList.add('drag');
      const mv = (ev) => setSplit(ev.clientX), up = () => { handle.classList.remove('drag'); removeEventListener('pointermove', mv); removeEventListener('pointerup', up); };
      addEventListener('pointermove', mv); addEventListener('pointerup', up);
    });
    handle.addEventListener('keydown', (e) => {
      const d = { ArrowLeft: -0.02, ArrowRight: 0.02, PageDown: -0.1, PageUp: 0.1 }[e.key];
      if (d) { e.preventDefault(); st.split = Math.max(0, Math.min(1, st.split + d)); clip(); }
      if (e.key === 'Home') { st.split = 0; clip(); } if (e.key === 'End') { st.split = 1; clip(); }
    });
    view.addEventListener('click', (e) => {
      if (e.target.closest('.cmp-split, .cmp-mark')) return;
      const R = view.getBoundingClientRect(), W0 = vw(), H0 = W0 * AR;
      const u = (e.clientX - R.left - st.tx) / (st.k * W0), v = (e.clientY - R.top - st.ty) / (st.k * H0);
      const hit = SPOTS.find((s) => { const [x, y, w, h] = s.r; return u > x - 0.02 && u < x + w + 0.02 && v > y - 0.02 && v < y + h + 0.02; });
      // a ghost ring where you tapped; a hit opens the difference
      const ring = el('span', { class: 'cmp-tap', style: `left:${e.clientX - R.left}px;top:${e.clientY - R.top}px` }); view.append(ring);
      scope.timeout(() => ring.remove(), motion.reduced ? 600 : 900);
      if (hit) open(hit.id, true); else live.textContent = 'Nothing listed there. Try the sky, the horizon, the boats or the margins.';
    });
    const setLoupe = (on) => {
      st.loupe = on; btnLoupe.setAttribute('aria-pressed', String(on)); view.classList.toggle('loupe-on', on); loupe.hidden = !on;
      if (on) { const R = view.getBoundingClientRect(); moveLoupe(R.left + R.width * 0.6, R.top + R.height * 0.4); }
    };
    const moveLoupe = (cx, cy) => {
      const R = view.getBoundingClientRect(), x = cx - R.left, y = cy - R.top, W0 = vw(), H0 = W0 * AR, z = 2.5 * st.k;
      const u = (x - st.tx) / (st.k * W0), v = (y - st.ty) / (st.k * H0);
      const id = x / R.width < st.split ? st.a : st.b, half = loupe.offsetWidth / 2 || 80;
      Object.assign(loupe.style, { left: `${x}px`, top: `${y}px`, backgroundImage: `url(${imgUrl(id, 'waves')})`, backgroundSize: `${W0 * z}px ${H0 * z}px`, backgroundPosition: `${half - u * W0 * z}px ${half - v * H0 * z}px` });
    };
    view.addEventListener('pointermove', (e) => { if (st.loupe) moveLoupe(e.clientX, e.clientY); });
    handle.addEventListener('focus', () => { if (st.loupe) { const R = view.getBoundingClientRect(); moveLoupe(R.left + st.split * R.width, R.top + R.height / 2); } });
    const ro = new ResizeObserver(() => { zoomTo(st.spot ? SPOTS.find((s) => s.id === st.spot).r : null); });
    ro.observe(view); scope.onDispose(() => ro.disconnect());
    draw(); zoomTo(null);
    // one slow sweep of the divide to show that it moves; any touch stops it
    if (!motion.reduced) {
      let stop = false; const halt = () => { stop = true; };
      view.addEventListener('pointerdown', halt, { once: true }); handle.addEventListener('keydown', halt, { once: true });
      scope.timeout(() => scope.tween(1400, (t) => { if (stop) return; st.split = 0.5 + 0.22 * Math.sin(t * Math.PI * 2); clip(); }, (x) => x).then(() => { if (!stop) { st.split = 0.5; clip(); } }), 600);
    }
    return {
      destroy() { ro.disconnect(); root.innerHTML = ''; },
      describe() { return `Three impressions of the Great Wave side by side: ${SHORT[st.a]} and ${SHORT[st.b]} under a movable divide, with five differences to find. Nothing on the sheets gives their order.`; },
    };
  },
};

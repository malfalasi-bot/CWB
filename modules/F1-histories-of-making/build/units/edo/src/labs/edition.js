// Lab · the record: one edition by the sheet. A log-scale guess first (ghost vs truth), then 408,000 sheets
// (8,000 sets × 51) filling to scale — one speck per sheet — the 51-design grid, the diary, and the flop as a toggle.
import { el, imgUrl, provenance } from '../util.js';
import { confChip, EASE_CSS } from '../cards.js';
import './edition.css';

const N = 51, SETS = 8000, TOTAL = N * SETS, PER_DAY = 200;
const COLS = 48, BW = 17, BH = 3; // a set = a 17 × 3 block of specks; 48 sets a row → 816 × 501 specks
const W = COLS * BW, H = Math.ceil(SETS / COLS) * BH;
const MONTHS = ['7th month, 1847', '8th month', '9th month', '10th month', '11th month', '12th month', '1st month, 1848', '2nd month', '3rd month, 1848'];
const LO = 2, HI = 7; // log10 range of the guess: 100 … 10,000,000
const fmt = (n) => Math.round(n).toLocaleString('en-GB');
const nice = (n) => fmt(n < 1000 ? Math.round(n / 10) * 10 : n < 1e5 ? Math.round(n / 100) * 100 : Math.round(n / 1000) * 1000);
const SOURCES = [['fujiokaya', 'documented'], ['kato-1847', 'documented'], ['wiki-kuniyoshi', 'documented']];

export default {
  id: 'edition', title: 'An edition, by the sheet', kicker: 'Lab · the record',
  async mount(root, ctx) {
    const { C, scope, motion } = ctx;
    const css = (v) => getComputedStyle(root).getPropertyValue(v).trim();
    root.innerHTML = '';
    const live = el('p', { class: 'vh', 'aria-live': 'polite' });
    const st = { guess: 4, committed: false, shown: false, k: 0, playing: false, flop: false };

    // ---------------- 1 · the guess (log scale)
    const ticks = [2, 3, 4, 5, 6, 7];
    const track = el('div', { class: 'ed-track' });
    ticks.forEach((t) => track.append(el('span', { class: 'ed-tick', style: `left:${(t - LO) / (HI - LO) * 100}%` }, el('b', { text: fmt(10 ** t) }))));
    const knob = el('div', { class: 'ed-knob', role: 'slider', tabindex: '0', 'aria-label': 'Your guess: sheets sold', 'aria-valuemin': '100', 'aria-valuemax': '10000000' }, el('span', { class: 'v' }));
    const ghost = el('div', { class: 'ed-mark ghost', hidden: true }, el('span'));
    const truth = el('div', { class: 'ed-mark truth', hidden: true }, el('span'));
    track.append(ghost, truth, knob);
    const commit = el('button', { type: 'button', class: 'ed-btn primary', onclick: () => doCommit() }, 'Place guess');
    const skip = el('button', { type: 'button', class: 'ed-btn link', onclick: () => reveal(false) }, 'Skip to the record');
    const said = el('p', { class: 'ed-said', 'aria-live': 'polite' });
    const guessBox = el('div', { class: 'ed-guess' },
      el('p', { class: 'ed-q', text: 'In 1847 Kuniyoshi’s fifty-one loyal retainers went on sale, one warrior to a sheet. By one bookseller’s diary, how many sheets sold in eight months?' }),
      track, el('div', { class: 'ed-row' }, commit, skip), said);
    const setGuess = (v) => {
      st.guess = Math.max(LO, Math.min(HI, v));
      const n = 10 ** st.guess;
      knob.style.left = `${(st.guess - LO) / (HI - LO) * 100}%`;
      knob.querySelector('.v').textContent = nice(n);
      knob.setAttribute('aria-valuenow', String(Math.round(n))); knob.setAttribute('aria-valuetext', `${knob.querySelector('.v').textContent} sheets`);
    };
    knob.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 0.05, ArrowUp: 0.05, ArrowLeft: -0.05, ArrowDown: -0.05, PageUp: 0.5, PageDown: -0.5 }[e.key];
      if (d && !st.committed) { e.preventDefault(); setGuess(st.guess + d); }
      if (e.key === 'Enter') { e.preventDefault(); doCommit(); }
    });
    const drag = (e) => { if (st.committed) return; const R = track.getBoundingClientRect(); setGuess(LO + (e.clientX - R.left) / R.width * (HI - LO)); };
    track.addEventListener('pointerdown', (e) => { if (st.committed) return; e.preventDefault(); knob.focus(); drag(e); knob.classList.add('drag'); const mv = (ev) => drag(ev), up = () => { knob.classList.remove('drag'); removeEventListener('pointermove', mv); removeEventListener('pointerup', up); }; addEventListener('pointermove', mv); addEventListener('pointerup', up); });
    const doCommit = () => { if (st.committed) return; st.committed = true; reveal(true); };
    const place = (node, v, label) => { node.hidden = false; node.style.left = `${(Math.log10(v) - LO) / (HI - LO) * 100}%`; node.querySelector('span').textContent = label; };

    // ---------------- 2 · the record
    const big = el('div', { class: 'ed-big' }, el('span', { class: 'n', text: '0' }), el('small', { text: 'sheets sold' }));
    const canvas = el('canvas', { class: 'ed-canvas', width: W, height: H, role: 'img', 'aria-label': `408,000 specks, one for every sheet sold: 8,000 sets of 51.` });
    const flopCanvas = el('canvas', { class: 'ed-canvas flop', width: 60, height: 50, role: 'img', 'aria-label': '3,000 specks printed, 450 of them sold, at the same scale.' });
    const flopBox = el('figure', { class: 'ed-flopfig', hidden: true }, flopCanvas, el('figcaption', {}, el('b', { text: 'The flop, at the same scale:' }), ' 3,000 printed, 450 sold (the inked strip).'));
    const stackFig = el('figure', { class: 'ed-stack' }, el('div', { class: 'ed-cv' }, canvas, flopBox),
      el('figcaption', {}, 'Each speck is one sheet. A set of 51 is one tiny bar; there are 8,000 of them.'));
    const grid = el('div', { class: 'ed-grid', role: 'img', 'aria-label': 'Fifty-one designs in the series; each fills as sets sell' });
    const cells = Array.from({ length: N }, (_, i) => { const c = el('div', { class: 'ed-cell' + (i === 13 ? ' hero' : '') }, el('i')); grid.append(c); return c; });
    const mSets = el('b', { text: '0' }), mDays = el('b', { text: '0' }), mMonth = el('b', { text: MONTHS[0] });
    const meta = el('div', { class: 'ed-meta' }, el('div', {}, mSets, 'sets of 51'), el('div', {}, mDays, 'printer-days at 200 a day (typical)'), el('div', {}, mMonth, 'by the diary'));
    const play = el('button', { type: 'button', class: 'ed-btn primary', onclick: () => (st.playing ? pause() : run()) }, 'Pause');
    const flopB = el('button', { type: 'button', class: 'ed-btn', 'aria-pressed': 'false', onclick: () => setFlop(!st.flop) }, 'The same diary’s flop');
    const flopNote = el('p', { class: 'ed-quote', hidden: true, text: 'Another title in the same diary: 3,000 printed, 450 sold. The publisher had paid for the blocks, the paper and the labour of all 3,000. That was the bet.' });
    const sheet = el('figure', { class: 'ed-sheet' }, el('img', { src: imgUrl('gishi'), alt: 'Utagawa Kuniyoshi, Ōtaka Gengo Tadao, sheet 14 of the loyal retainers', loading: 'lazy' }),
      el('figcaption', { html: provenance(C.images?.gishi || {}) }));
    const record = el('div', { class: 'ed-record', hidden: true },
      el('div', { class: 'ed-rec-top' }, big, meta),
      el('div', { class: 'ed-rec-mid' }, stackFig, el('div', { class: 'ed-rec-side' }, el('span', { class: 'cc-kick', text: '51 designs, one warrior each' }), grid, sheet)),
      el('p', { class: 'ed-quote', text: 'The Fujiokaya diary records 8,000 sets of Kuniyoshi’s loyal retainers sold between the seventh month of 1847 and the third of 1848.' }),
      el('div', { class: 'ed-row' }, play, flopB), flopNote);

    const reset = el('button', { type: 'button', class: 'cc-lab-reset', onclick: () => resetAll() }, 'Reset');
    const what = el('div', { class: 'cc-lab-what' }, el('span', { class: 'cc-kick', text: 'What this shows' }),
      el('p', { text: 'One series, counted by the sheet. The diary gives the sets; the multiplication is ours. The canvas is to scale: one speck for each sheet that was printed, rubbed by hand and sold.' }));
    const srcs = el('ol', { class: 'cc-lab-src' }, ...SOURCES.map(([id, conf]) => { const s = C.sources?.[id]; return s ? el('li', {}, s.u ? el('a', { href: s.u, target: '_blank', rel: 'noopener' }, s.t) : s.t, ' ', confChip(conf)) : null; }).filter(Boolean));
    root.append(el('section', { class: 'cc-lab ed', 'aria-label': 'Lab: an edition by the sheet' },
      el('header', { class: 'cc-lab-head' }, el('span', { class: 'cc-lab-kick', text: 'LAB · the record' }), el('h4', { text: 'The forty-seven rōnin, by the sheet' }), reset),
      guessBox, record, what, el('details', { class: 'cc-lab-foot' }, el('summary', {}, 'Sources'), srcs), live));

    // ---------------- drawing
    const ink = () => css('--indigo') || '#233C6B', paper = () => css('--paper-3') || '#E9E0CC', line = () => css('--line-2') || '#C2B596';
    const g = canvas.getContext('2d');
    const drawStack = (k) => {
      const sets = Math.floor(SETS * k), rows = Math.floor(sets / COLS), rem = sets % COLS;
      g.fillStyle = paper(); g.fillRect(0, 0, W, H);
      g.fillStyle = ink(); g.fillRect(0, 0, W, rows * BH);
      if (rem) g.fillRect(0, rows * BH, rem * BW, BH);
      // set boundaries as hairline gaps every set, so the 17 × 3 bars read as units when zoomed
      g.fillStyle = paper(); for (let c = 1; c < COLS; c++) g.fillRect(c * BW - 0.35, 0, 0.35, H);
      // one set outlined, for scale
      g.strokeStyle = line(); g.lineWidth = 1; g.strokeRect(W - BW - 0.5, H - BH - 0.5, BW + 1, BH + 1);
    };
    const drawFlop = () => {
      const f = flopCanvas.getContext('2d'); f.fillStyle = paper(); f.fillRect(0, 0, 60, 50); f.fillStyle = ink(); f.fillRect(0, 0, 60, 7); f.fillRect(0, 7, 30, 1);
    };
    const draw = (k) => {
      st.k = k;
      const sets = SETS * k, sheets = sets * N;
      big.querySelector('.n').textContent = fmt(sheets);
      mSets.textContent = fmt(sets); mDays.textContent = fmt(sheets / PER_DAY);
      mMonth.textContent = MONTHS[Math.min(MONTHS.length - 1, Math.floor(k * (MONTHS.length - 0.01)))];
      cells.forEach((c, i) => { const f = Math.max(0, Math.min(1, k * 1.25 - (i / N) * 0.25)); c.firstChild.style.height = `${(f * 100).toFixed(1)}%`; });
      drawStack(k);
    };
    const pause = () => { st.playing = false; play.textContent = 'Resume'; };
    const run = async () => {
      st.playing = true; play.textContent = 'Pause';
      const from = st.k >= 1 ? 0 : st.k;
      await scope.tween(motion.dur(7000 * (1 - from)), (t) => { if (st.playing) draw(from + (1 - from) * t); }, (x) => x);
      if (st.playing || motion.reduced) { st.playing = false; draw(1); play.textContent = 'Run again'; live.textContent = '408,000 sheets: 8,000 sets of 51, by the diary.'; ctx.onResolve?.({ events: ['e1847'] }); }
    };
    const setFlop = (on) => {
      st.flop = on; flopB.setAttribute('aria-pressed', String(on)); flopBox.hidden = !on; flopNote.hidden = !on;
      if (on) { drawFlop(); if (!motion.reduced) flopBox.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: EASE_CSS.enter }); live.textContent = 'The flop: 3,000 printed, 450 sold, at the same scale.'; }
    };
    const reveal = (mine) => {
      if (st.shown) return; st.shown = true;
      knob.hidden = true; commit.hidden = true; skip.hidden = true;
      const gN = 10 ** st.guess;
      if (mine) place(ghost, gN, `Your guess · ${nice(gN)}`);
      place(truth, TOTAL, '408,000 · the record');
      if (!motion.reduced) truth.animate([{ transform: 'translateX(-50%) scale(1.06)', opacity: 0 }, { transform: 'translateX(-50%) scale(1)', opacity: 1 }], { duration: 200, easing: EASE_CSS.standard });
      const ratio = mine ? (gN > TOTAL ? gN / TOTAL : TOTAL / gN) : 1;
      said.textContent = mine ? (ratio < 1.5 ? `Your guess, ${nice(gN)}, sits right by the record.` : `Your guess, ${nice(gN)}, is about ${ratio < 10 ? ratio.toFixed(1) : fmt(ratio)} times ${gN > TOTAL ? 'more' : 'fewer'} than the record: 408,000.`) : 'The record: 408,000 sheets.';
      record.hidden = false;
      if (!motion.reduced) record.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: EASE_CSS.enter });
      if (motion.reduced) { draw(1); play.textContent = 'Run again'; ctx.onResolve?.({ events: ['e1847'] }); } else { draw(0); scope.timeout(run, 450); }
    };
    const resetAll = () => {
      st.playing = false; st.committed = false; st.shown = false; setFlop(false);
      knob.hidden = false; commit.hidden = false; skip.hidden = false; ghost.hidden = true; truth.hidden = true; said.textContent = ''; record.hidden = true;
      setGuess(4); draw(0); knob.focus(); live.textContent = 'Reset.';
    };
    // keep the flop at the same scale as the big canvas
    const ro = new ResizeObserver(() => { const s2 = canvas.clientWidth / W; if (s2) { flopCanvas.style.width = `${60 * s2}px`; flopCanvas.style.height = `${50 * s2}px`; } });
    ro.observe(canvas); scope.onDispose(() => ro.disconnect());
    setGuess(4); draw(0);
    return {
      destroy() { st.playing = false; root.innerHTML = ''; },
      describe() { return 'A guess on a log scale, then the record: 8,000 sets of 51 sheets, 408,000 sheets in eight months, drawn one speck per sheet, with the same diary’s flop of 3,000 printed and 450 sold.'; },
    };
  },
};

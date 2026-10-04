// Seal Timeline (after the card game Timeline): undated prints go into the censor-seal bands by
// reading their margins. A right slot flips the card to its evidence and what actually happened; a wrong
// slot slides the card back with a hint that points at the margin. Keyboard: select a card, arrows
// across the bands, Enter. Drag is optional; every drag has the button path.
import { el } from '../util.js';
import { loadDesks, bench, imgSrc, marginCrop, glossCard, confTag, sourcesList, srcLine, whatThisShows, record, enter, fade } from './desks/common.js';
import './sealtimeline.css';

const YEARS = { none: 'before 1790', kiwame: '1790–1842', nanushi: '1843–1852', aratame: '1853–c. 1875' };
const SEALGLOSS = { kiwame: 'kiwame', nanushi: 'nanushi', aratame: 'aratame' };

export default {
  id: 'sealtimeline', title: 'Seal Timeline', kicker: 'Lab · date by seal',
  async mount(root, ctx) {
    const D = await loadDesks();
    const { motion, scope } = ctx;
    const T = D.timeline; const stage = ctx.mode === 'stage';
    const cards = (stage ? T.stage.map((id) => T.cards.find((c) => c.print === id)) : T.cards).filter(Boolean);
    // the hand is dealt in a fixed shuffled order, so the order never gives the dates away
    const deal = cards.map((c, i) => [(Math.sin((i + 3) * 12.9898) * 43758.5453) % 1, c]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
    const P = (id) => D.prints[id];
    const KEY = stage ? 'st-stage' : 'st';
    let placed = ctx.store.get(KEY, {}) || {};
    let held = null, tries = {}, target = 1, dragging = null;

    const B = bench(root, { id: 'st', kicker: stage ? 'Lab · date by seal' : 'Lab · date by seal · the full timeline', title: 'Seal Timeline', mode: ctx.mode, onReset: () => { placed = {}; tries = {}; held = null; save(); render(); B.say('All prints are back in the hand.'); } });
    const intro = el('p', { class: 'st-intro' }, stage
      ? 'Four prints, no dates. Read each margin and put the print in the years its seals allow.'
      : `${cards.length} prints, no dates. Read each margin, then put the print in the years its seals allow. Select a card, choose a band with the arrow keys or a tap, and press Enter.`);

    // ---- the band strip
    const strip = el('div', { class: 'st-strip', role: 'group', 'aria-label': 'Censor-seal bands, earliest on the left' });
    const bandBtns = D.bands.map((b, i) => {
      const slot = el('div', { class: 'st-slot' });
      const btn = el('button', { type: 'button', class: `st-band st-band-${b.id}`, 'data-band': b.id, tabindex: i === target ? '0' : '-1' },
        el('span', { class: 'st-band-y', text: YEARS[b.id] }),
        el('span', { class: 'st-band-k', lang: 'ja', 'aria-hidden': 'true', text: b.k || '—' }),
        el('span', { class: 'st-band-l', text: b.label }),
        el('span', { class: 'st-band-ghost', 'aria-hidden': 'true', text: 'your try' }));
      btn.addEventListener('click', () => { if (held) place(held, b.id); else B.say('Choose a print from the hand first.'); });
      btn.addEventListener('keydown', (e) => {
        const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }[e.key];
        if (d) { e.preventDefault(); setTarget(Math.max(0, Math.min(D.bands.length - 1, target + d)), true); }
        else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); setTarget(e.key === 'Home' ? 0 : D.bands.length - 1, true); }
        else if (e.key === 'Escape' && held) { e.preventDefault(); const c = hand.querySelector(`[data-print="${held}"]`); release(); c?.focus(); }
      });
      btn.addEventListener('focus', () => { target = i; syncTarget(); });
      btn.addEventListener('blur', () => scope.timeout(syncTarget, 0));
      btn._slot = slot; strip.append(el('div', { class: `st-col st-col-${b.id}` }, btn, slot)); return btn;
    });
    const axis = el('div', { class: 'st-axis', 'aria-hidden': 'true' }, ['1790', '1843', '1853', '1876'].map((y, i) => el('span', { style: `left:${(i + 1) * 25}%`, text: y })));
    const stripWrap = el('div', { class: 'st-stripwrap' }, strip, axis);

    // ---- the hand and the held card
    const hand = el('div', { class: 'st-hand', role: 'group', 'aria-label': 'Undated prints' });
    const heldBox = el('div', { class: 'st-held', 'aria-live': 'polite' });
    const glossRow = el('div', { class: 'st-glossrow' }, ['kiwame', 'nanushi', 'aratame', 'date'].map((g) => glossCard(D, g, true)));
    const keyBox = el('details', { class: 'st-key' }, el('summary', { text: 'The four seals, side by side' }), glossRow);

    B.body.append(intro, stripWrap, heldBox, hand, keyBox);
    if (stage) B.foot.append(el('button', { type: 'button', class: 'dk-btn', onclick: () => ctx.openRoom?.('desks', 'sealtimeline') }, `All ${T.cards.length} prints in the Desks room →`));
    B.foot.append(whatThisShows(T.what), sourcesList(D, [...cards.flatMap((c) => c.src), ...D.bands.flatMap((b) => b.src)]));

    const save = () => ctx.store.set(KEY, placed);
    function setTarget(i, focus) { target = i; syncTarget(); if (focus) bandBtns[i].focus(); }
    function syncTarget() {
      const kb = strip.contains(document.activeElement);
      bandBtns.forEach((b, j) => { b.tabIndex = j === target ? 0 : -1; b.classList.toggle('aim', !!held && kb && j === target); });
    }

    function cardEl(c) {
      const p = P(c.print), n = deal.indexOf(c) + 1;
      const b = el('button', { type: 'button', class: 'st-card', 'data-print': c.print, 'aria-pressed': 'false', 'aria-label': `Undated print number ${n}. Select to read its margin.` },
        el('span', { class: 'st-card-img' }, el('img', { src: imgSrc(p), alt: '', loading: 'lazy', decoding: 'async' })),
        marginCrop(D, p, 54, 'st-card-crop'),
        el('span', { class: 'st-card-kind', text: `No. ${n}` }));
      b.addEventListener('click', () => { if (b._dragged) { b._dragged = false; return; } hold(c.print); });
      b.addEventListener('keydown', (e) => { if (held === c.print && /^Arrow/.test(e.key)) { e.preventDefault(); setTarget(target, true); } });
      b.addEventListener('pointerdown', (e) => startDrag(e, c.print, b));
      return b;
    }

    function render() {
      hand.innerHTML = '';
      deal.filter((c) => !placed[c.print]).forEach((c, i) => hand.append(cardEl(c, i)));
      bandBtns.forEach((b) => { b._slot.innerHTML = ''; b.classList.remove('tried'); });
      cards.filter((c) => placed[c.print]).forEach((c) => putMini(c));
      const left = cards.length - Object.keys(placed).length;
      hand.hidden = !left;
      if (!left) {
        heldBox.innerHTML = '';
        heldBox.append(el('div', { class: 'st-done' }, el('p', { class: 'st-done-t', text: `All ${cards.length} prints are dated by their margins.` }),
          el('p', { text: 'Open any card in the bands to read its evidence again.' })));
      } else if (!held) showPrompt();
      syncTarget();
    }
    function bandLabelFor(id) { const b = D.bands.find((x) => x.id === id); return `${b.label}, ${YEARS[id]}`; }
    function putMini(c) {
      const p = P(c.print), band = bandBtns.find((b) => b.dataset.band === placed[c.print]);
      const m = el('button', { type: 'button', class: `st-mini${c.twist ? ' twist' : ''}`, 'aria-label': `${p.title}, ${p.date}. Read its evidence.` },
        marginCrop(D, p, 30), el('span', { class: 'st-mini-y', text: c.twist ? `${p.short || p.date} · no seal` : (p.short || p.date) }));
      const open = (e) => { e.stopPropagation(); e.preventDefault(); reveal(c, false); };
      m.addEventListener('click', open);
      band._slot.append(m); return m;
    }

    function showPrompt() {
      heldBox.innerHTML = '';
      heldBox.append(el('p', { class: 'st-prompt', text: stage ? 'Select a print below.' : 'Select a print below to read its margin.' }));
    }

    function hold(id) {
      held = id; const c = cards.find((x) => x.print === id), p = P(id);
      hand.querySelectorAll('.st-card').forEach((b) => { const on = b.dataset.print === id; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
      heldBox.innerHTML = '';
      const small = stage ? 120 : 150;
      const crop = el('button', { type: 'button', class: 'st-zoom', 'aria-pressed': 'false', title: 'Enlarge the margin' }, marginCrop(D, p, small, 'st-held-crop'));
      crop.addEventListener('click', () => { const big = crop.getAttribute('aria-pressed') !== 'true'; crop.setAttribute('aria-pressed', String(big)); crop.classList.toggle('big', big); crop.replaceChildren(marginCrop(D, p, big ? Math.min(320, small * 2) : small, 'st-held-crop')); });
      const hint = el('p', { class: 'st-hint', hidden: !tries[id] });
      if (tries[id]) hint.textContent = c.hint;
      const box = el('div', { class: 'st-heldcard' },
        el('div', { class: 'st-held-img' }, el('img', { src: imgSrc(p), alt: `Undated print number ${deal.indexOf(c) + 1}, whole sheet.` })),
        el('div', { class: 'st-held-side' },
          el('span', { class: 'dk-kicker', text: 'The margin · tap to enlarge' }), crop,
          el('p', { class: 'st-held-q', text: 'Which seals can you see? Choose the band they allow.' }),
          hint,
          el('div', { class: 'st-held-act' },
            el('button', { type: 'button', class: 'dk-btn primary', onclick: () => setTarget(target, true) }, 'Choose a band'),
            el('button', { type: 'button', class: 'dk-btn quiet', onclick: () => { const b = hand.querySelector(`[data-print="${id}"]`); release(); b?.focus(); } }, 'Put it back'))));
      heldBox.append(box); enter(box, motion, 8);
      syncTarget();
      B.say(`Holding print number ${deal.indexOf(c) + 1}. Use the arrow keys on the bands and press Enter, or tap a band.`);
    }
    function release() { held = null; hand.querySelectorAll('.st-card').forEach((b) => { b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); }); showPrompt(); syncTarget(); }

    function place(id, bandId) {
      const c = cards.find((x) => x.print === id), p = P(id);
      const ok = bandId === p.band;
      const band = bandBtns.find((b) => b.dataset.band === bandId);
      const card = hand.querySelector(`[data-print="${id}"]`);
      if (ok) {
        placed[id] = bandId; save(); held = null;
        const from = card?.getBoundingClientRect();
        card?.remove();
        const mini = putMini(c);
        if (from && !motion.reduced && mini.animate) {
          const to = mini.getBoundingClientRect();
          mini.animate([{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(1.4)`, opacity: .4 }, { transform: 'none', opacity: 1 }], { duration: 400, easing: 'cubic-bezier(0.2,0,0,1)' });
        }
        bandBtns.forEach((b) => b.classList.remove('tried'));
        ctx.onResolve?.({ band: p.band === 'none' ? 'none' : p.band });
        reveal(c, true);
        if (!hand.querySelector('.st-card')) hand.hidden = true;
      } else {
        tries[id] = (tries[id] || 0) + 1;
        band.classList.add('tried');
        scope.timeout(() => band.classList.remove('tried'), 2400);
        if (card && !motion.reduced && card.animate) {
          const br = band.getBoundingClientRect(), cr = card.getBoundingClientRect();
          card.animate([{ transform: `translate(${br.left + br.width / 2 - cr.left - cr.width / 2}px, ${br.top - cr.top}px) scale(.6)`, opacity: .5 }, { transform: 'none', opacity: 1 }], { duration: 400, easing: 'cubic-bezier(0.05,0.7,0.1,1)' });
        }
        hold(id);
        const h = heldBox.querySelector('.st-hint'); h.hidden = false; h.textContent = c.hint;
        if (matchMedia('(max-width: 640px)').matches) h.scrollIntoView({ block: 'nearest', behavior: motion.reduced ? 'auto' : 'smooth' });
        const cr = heldBox.querySelector('.st-held-crop'); cr.classList.remove('look'); void cr.offsetWidth; cr.classList.add('look');
        B.say(`Not that band. The card is back in your hand. Hint: ${c.hint}`);
      }
    }

    function reveal(c, fresh) {
      const p = P(c.print), b = D.bands.find((x) => x.id === p.band);
      heldBox.innerHTML = '';
      const front = el('div', { class: 'st-face st-front', 'aria-hidden': 'true' }, el('img', { src: imgSrc(p), alt: '' }));
      const back = el('div', { class: 'st-face st-back' },
        el('div', { class: 'st-back-top' },
          el('div', {}, el('span', { class: 'dk-kicker', text: c.twist ? 'Read by its margin · outside the law' : `${b.label} · ${YEARS[b.id]}` }),
            el('h4', { class: 'st-back-t', text: p.title }),
            el('p', { class: 'st-back-d' }, el('b', { text: p.date }), ' · ', p.maker)),
          el('div', { class: 'st-back-img' }, el('img', { src: imgSrc(p), alt: `${p.maker}, ${p.title}, ${p.date}.` }))),
        el('div', { class: 'st-ev' }, el('span', { class: 'dk-kicker', text: 'The evidence' }),
          el('div', { class: 'st-ev-row' }, marginCrop(D, p, 96), el('p', { text: c.evidence }))),
        SEALGLOSS[p.band] ? glossCard(D, SEALGLOSS[p.band]) : null,
        p.marks.some((m) => m.gloss2 === 'date') ? glossCard(D, 'date') : null,
        el('div', { class: 'dk-happened' }, el('h5', { class: 'dk-happened-h', text: 'What actually happened' }), el('p', { text: c.actual }), el('div', {}, confTag(c.conf)), srcLine(D, c.src)),
        record(p),
        el('div', { class: 'st-back-act' },
          hand.querySelector('.st-card') ? el('button', { type: 'button', class: 'dk-btn primary st-next', onclick: () => { const n = hand.querySelector('.st-card'); if (n) { hold(n.dataset.print); n.focus(); } } }, 'Next print') : null,
          el('button', { type: 'button', class: 'dk-btn quiet', onclick: () => { render(); } }, 'Close the card')));
      const flip = el('div', { class: 'st-flip' + (motion.reduced || !fresh ? ' flipped' : '') }, front, back);
      heldBox.append(flip);
      if (fresh && !motion.reduced) scope.raf(() => scope.raf(() => flip.classList.add('flipped')));
      else fade(back, motion);
      B.say(`${c.twist ? 'Right by its margin: no seal.' : `Yes: ${b.label}, ${YEARS[b.id]}.`} ${p.title}, ${p.date}. ${c.actual}`);
      if (fresh) scope.timeout(() => heldBox.querySelector('.st-next')?.focus({ preventScroll: true }), motion.reduced ? 0 : 420);
      if (Object.keys(placed).length === cards.length && fresh) B.say(`All ${cards.length} prints are dated by their margins.`);
    }

    // ---- optional drag: pick a card up, drop it on a band (the buttons do the same)
    function startDrag(e, id, btn) {
      if (e.button !== 0) return;
      const x0 = e.clientX, y0 = e.clientY; let ghost = null, over = null;
      const move = (ev) => {
        if (!ghost) {
          if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 8) return;
          ghost = marginCrop(D, P(id), 60, 'st-drag'); document.body.append(ghost); btn._dragged = true; dragging = id;
          if (held !== id) hold(id);
        }
        ghost.style.transform = `translate(${ev.clientX - 30}px, ${ev.clientY - 30}px)`;
        const t = document.elementFromPoint(ev.clientX, ev.clientY)?.closest?.('.st-band');
        if (t !== over) { over?.classList.remove('over'); over = t; over?.classList.add('over'); }
      };
      const up = () => {
        removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
        ghost?.remove(); over?.classList.remove('over');
        if (ghost && over) place(id, over.dataset.band);
        dragging = null; scope.timeout(() => { btn._dragged = false; }, 0);
      };
      addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
      scope.onDispose(() => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); ghost?.remove(); });
    }

    render();
    if (ctx.params?.print && cards.some((c) => c.print === ctx.params.print) && !placed[ctx.params.print]) hold(ctx.params.print);
    return {
      destroy() { document.querySelectorAll('.st-drag').forEach((n) => n.remove()); },
      describe() { return `Seal Timeline: ${Object.keys(placed).length} of ${cards.length} undated prints placed in the censor-seal bands by reading their margins.`; },
    };
  },
};

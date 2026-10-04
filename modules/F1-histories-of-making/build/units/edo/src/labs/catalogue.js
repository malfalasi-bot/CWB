// Catalogue Desk (after The Case of the Golden Idol and Return of the Obra Dinn). A zoomable print with
// hotspots on its seals, cartouches, signature and publisher's mark; reading a mark harvests words into a
// bank; the learner fills a catalogue sentence. Feedback only says when two or fewer slots are wrong, and
// cards confirm in sets of three. Stage mode is the worked example on the Sudden Shower (replaces the v3
// margin tool); room mode adds two sets of three practice prints, the second with faded support.
import OpenSeadragon from 'openseadragon';
import { el } from '../util.js';
import { loadDesks, bench, imgSrc, glossCard, confTag, sourcesList, srcLine, whatThisShows, record, enter, fade } from './desks/common.js';
import './catalogue.css';

const SLOT_LABEL = { designer: 'the designer', publisher: 'the publisher', examined: 'which seal', date: 'which years' };
const TYPE_LABEL = { seal: 'Censor’s seal', sig: 'Signature', pub: 'Publisher', series: 'Series', title: 'Title', carver: 'Carver', other: 'Seal' };

export default {
  id: 'catalogue', title: 'Catalogue Desk', kicker: 'Lab · read the margin',
  async mount(root, ctx) {
    const D = await loadDesks();
    const { motion, scope } = ctx;
    const Cg = D.catalogue, stage = ctx.mode === 'stage';
    const W = Object.fromEntries(D.words.map((w) => [w.id, w]));
    const P = (id) => D.prints[id];
    const KEY = 'cat';
    const blank = () => ({ bank: {}, fills: {}, found: {}, confirmed: {}, msg: {} });
    let st = stage ? blank() : Object.assign(blank(), ctx.store.get(KEY, {}));
    const save = () => { if (!stage) ctx.store.set(KEY, st); };
    // views: 'worked' + each set id
    const views = [{ id: 'worked', label: 'Worked example', prints: [Cg.worked], support: 'walk' }, ...Cg.sets.map((s) => ({ id: s.id, label: s.label, prints: s.prints, support: s.support }))];
    const want = ctx.params?.anchor && views.find((v) => v.id === ctx.params.anchor);
    let view = stage ? views[0] : (want || views[0]);
    let cur = view.prints[0], armedWord = null, armedSlot = null, step = -1, readMark = null;

    const B = bench(root, { id: 'cat', kicker: stage ? 'Lab · read the margin · worked example' : 'Lab · read the margin', title: 'Catalogue Desk', mode: ctx.mode,
      onReset: () => { st = blank(); save(); step = -1; armedWord = armedSlot = null; readMark = null; showView(stage ? views[0] : view, true); B.say('The desk is cleared.'); } });

    // ---- the viewer
    const osdBox = el('div', { class: 'cat-osd' });
    const hsLayer = el('div', { class: 'cat-hs-layer' });
    const zIn = el('button', { type: 'button', class: 'dk-btn small', 'aria-label': 'Zoom in' }, '+');
    const zOut = el('button', { type: 'button', class: 'dk-btn small', 'aria-label': 'Zoom out' }, '−');
    const zHome = el('button', { type: 'button', class: 'dk-btn small' }, 'Whole sheet');
    const nextMark = el('button', { type: 'button', class: 'dk-btn small' }, 'Next mark');
    const viewWrap = el('div', { class: 'cat-view', role: 'region', 'aria-label': 'The print, zoomable' }, osdBox, hsLayer, el('div', { class: 'cat-ctl' }, zIn, zOut, zHome, nextMark));
    const osd = OpenSeadragon({ element: osdBox, showNavigationControl: false, animationTime: motion.reduced ? 0.01 : 1.0, springStiffness: 7, visibilityRatio: 0.5,
      gestureSettingsMouse: { scrollToZoom: false, clickToZoom: false, dblClickToZoom: true }, gestureSettingsTouch: { pinchToZoom: true, flickEnabled: false, clickToZoom: false },
      crossOriginPolicy: false, preserveImageSizeOnResize: true, background: 'transparent', minZoomImageRatio: 0.8, maxZoomPixelRatio: 3 });
    scope.onDispose(() => { try { osd.destroy(); } catch (e) { /* */ } });
    zIn.addEventListener('click', () => osd.viewport.zoomBy(1.6));
    zOut.addEventListener('click', () => osd.viewport.zoomBy(1 / 1.6));
    const home = (instant) => { const p = P(cur); const ar = p.h / p.w; osd.viewport.fitBounds(new OpenSeadragon.Rect(-0.04, -0.04 * ar, 1.08, 1.08 * ar), instant); };
    zHome.addEventListener('click', () => home(motion.reduced));

    // ---- the side: nav, reading, card, bank
    const nav = el('div', { class: 'cat-nav', role: 'tablist', 'aria-label': 'Prints on the desk' });
    const pills = el('div', { class: 'cat-pills', role: 'group', 'aria-label': 'Prints in this set' });
    const reading = el('div', { class: 'cat-read', 'aria-live': 'polite' });
    const walk = el('div', { class: 'cat-walk' });
    const card = el('div', { class: 'cat-card' });
    const bank = el('div', { class: 'cat-bank', role: 'group', 'aria-label': 'Word bank' });
    const msg = el('p', { class: 'cat-msg', role: 'status' });
    const check = el('button', { type: 'button', class: 'dk-btn primary' }, 'Confirm these three');
    const after = el('div', { class: 'cat-after' });
    const side = el('div', { class: 'cat-side' }, stage ? null : nav, stage ? null : pills, walk, reading,
      el('div', { class: 'cat-cardwrap' }, el('span', { class: 'dk-kicker', text: 'Catalogue card' }), card),
      el('div', { class: 'cat-bankwrap' }, el('span', { class: 'dk-kicker', text: 'Word bank · tap a mark on the sheet to harvest its words' }), bank),
      stage ? null : el('div', { class: 'cat-checkrow' }, check, msg), after);
    B.body.append(el('div', { class: 'cat-grid' }, viewWrap, side));
    B.foot.append(whatThisShows(Cg.what), sourcesList(D, [...views.flatMap((v) => v.prints.flatMap((id) => P(id).marks.flatMap((m) => m.src))), 'jaanus-aratame', 'vjp-seals']));
    if (stage) B.foot.prepend(el('button', { type: 'button', class: 'dk-btn', onclick: () => ctx.openRoom?.('desks', 'catalogue') }, 'Practise at the Catalogue Desk: six more prints →'));

    // ---- nav
    function renderNav() {
      nav.innerHTML = '';
      views.forEach((v) => {
        const done = v.id === 'worked' ? st.msg.worked === 'done' : !!st.confirmed[v.id];
        const b = el('button', { type: 'button', role: 'tab', class: 'cat-tab', 'aria-selected': String(v === view), tabindex: v === view ? '0' : '-1' },
          v.label, v.id === 'worked' ? null : el('span', { class: 'cat-tab-n', text: ` · ${v.prints.length} prints` }), done ? el('span', { class: 'cat-tab-ok', text: v.id === 'worked' ? ' · read' : ' · confirmed' }) : null);
        b.addEventListener('click', () => showView(v));
        b.addEventListener('keydown', (e) => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return; e.preventDefault(); const k = (views.indexOf(v) + d + views.length) % views.length; showView(views[k]); nav.children[k]?.focus(); });
        nav.append(b);
      });
      pills.innerHTML = '';
      pills.hidden = view.prints.length < 2;
      view.prints.forEach((id, i) => {
        const filled = Object.keys(st.fills[id] || {}).length;
        const b = el('button', { type: 'button', class: 'cat-pill', 'aria-pressed': String(id === cur) }, el('span', { class: 'cat-pill-n', text: String(i + 1) }), `Print ${i + 1}`, el('span', { class: 'cat-pill-f', text: `${filled}/4` }));
        b.addEventListener('click', () => { cur = id; openPrint(); });
        pills.append(b);
      });
    }

    function showView(v, keepStep) {
      view = v; cur = v.prints[0]; armedWord = armedSlot = null; readMark = null;
      if (!keepStep) step = -1;
      renderNav(); openPrint();
    }

    // ---- open a print in the viewer
    let hsBtns = [];
    function openPrint() {
      const p = P(cur); const ar = p.h / p.w;
      readMark = null; renderNav();
      reading.innerHTML = '';
      hsLayer.innerHTML = '';
      const faded = view.support === 'faded';
      viewWrap.classList.toggle('faded', faded);
      nextMark.textContent = faded ? 'Show me a mark' : 'Next mark';
      hsBtns = p.marks.map((m) => {
        const found = (st.found[cur] || []).includes(m.id);
        const b = el('button', { type: 'button', class: `cat-hs t-${m.type}${found ? ' found' : ''}`, 'aria-label': `${TYPE_LABEL[m.type] || 'Mark'}${found ? ', read' : ''}` },
          el('span', { class: 'cat-hs-l', 'aria-hidden': 'true', text: TYPE_LABEL[m.type] || 'Mark' }));
        b.addEventListener('click', () => read(m, b));
        b._m = m; hsLayer.append(b); return b;
      });
      osd.open({ type: 'image', url: imgSrc(p) });
      osd.addOnceHandler('open', () => { home(true); place(); });
      renderCard(); renderBank(); renderWalk(); renderAfter();
      msg.textContent = st.msg[view.id] && st.msg[view.id] !== 'done' ? st.msg[view.id] : '';
      syncCheck();
    }
    function place() {
      const p = P(cur); if (!p || !osd.viewport) return; const ar = p.h / p.w;
      hsBtns.forEach((b) => {
        const [x, y, w, h] = b._m.r;
        const a = osd.viewport.viewportToViewerElementCoordinates(new OpenSeadragon.Point(x, y * ar));
        const c = osd.viewport.viewportToViewerElementCoordinates(new OpenSeadragon.Point(x + w, (y + h) * ar));
        Object.assign(b.style, { left: `${a.x}px`, top: `${a.y}px`, width: `${Math.max(24, c.x - a.x)}px`, height: `${Math.max(24, c.y - a.y)}px` });
      });
    }
    ['animation', 'update-viewport', 'resize', 'animation-finish'].forEach((ev) => osd.addHandler(ev, place));

    function zoomTo(m) {
      const p = P(cur); const ar = p.h / p.w; const [x, y, w, h] = m.r;
      const pad = Math.max(w, h) * 1.6;
      osd.viewport.fitBounds(new OpenSeadragon.Rect(x - pad, (y - pad / 2) * ar, w + pad * 2, (h + pad) * ar), motion.reduced);
    }

    // ---- read a mark: zoom, show the reading, harvest its words
    function read(m, btn, quiet) {
      readMark = m.id;
      const f = st.found[cur] = st.found[cur] || [];
      if (!f.includes(m.id)) f.push(m.id);
      btn = btn || hsBtns.find((b) => b._m === m);
      hsBtns.forEach((b) => b.classList.toggle('on', b === btn));
      btn?.classList.add('found'); btn?.setAttribute('aria-label', `${TYPE_LABEL[m.type] || 'Mark'}, read`);
      zoomTo(m);
      const added = [];
      const bk = st.bank[view.id] = st.bank[view.id] || [];
      (m.words || []).forEach((w) => { if (!bk.includes(w)) { bk.push(w); added.push(w); } });
      save();
      reading.innerHTML = '';
      const box = el('div', { class: 'cat-read-box' },
        el('div', { class: 'cat-read-top' }, el('span', { class: 'dk-kicker', text: m.label }), m.k ? el('span', { class: 'cat-read-k', lang: 'ja', text: m.k }) : null),
        el('p', { class: 'cat-read-t', text: m.text }), el('div', {}, confTag(m.conf)),
        m.gloss ? glossCard(D, m.gloss) : null, m.gloss2 ? glossCard(D, m.gloss2) : null,
        added.length ? el('p', { class: 'cat-read-add' }, 'Added to the bank: ', added.map((w) => W[w].t).join(' · ')) : (m.words?.length ? el('p', { class: 'cat-read-add', text: 'Its words are already in the bank.' }) : el('p', { class: 'cat-read-add', text: 'Nothing here for the card, but it is part of the sheet.' })));
      reading.append(box); enter(box, motion, 6);
      renderBank(added);
      if (!quiet) B.say(`${m.label}. ${m.text}${added.length ? ` Added to the bank: ${added.map((w) => W[w].t).join(', ')}.` : ''}`);
    }
    nextMark.addEventListener('click', () => {
      const p = P(cur); const f = st.found[cur] || [];
      const order = p.marks.filter((m) => !f.includes(m.id));
      const i = Math.max(0, p.marks.findIndex((m) => m.id === readMark));
      const m = view.support === 'faded' ? (order[0] || p.marks[(i + 1) % p.marks.length]) : p.marks[(p.marks.findIndex((x) => x.id === readMark) + 1) % p.marks.length];
      const b = hsBtns.find((x) => x._m === m); read(m, b); b?.focus({ preventScroll: true });
    });

    // ---- the catalogue card
    const locked = () => view.id === 'worked' || !!st.confirmed[view.id];
    function renderCard() {
      card.innerHTML = '';
      const fills = st.fills[cur] = st.fills[cur] || {};
      const conf = !!st.confirmed[view.id];
      card.classList.toggle('confirmed', conf);
      const line = el('p', { class: 'cat-line' });
      Cg.template.forEach((part) => {
        if (typeof part === 'string') { line.append(part); return; }
        const s = part.slot, w = fills[s];
        const b = el('button', { type: 'button', class: `cat-slot${w ? ' filled' : ''}${armedSlot === s ? ' armed' : ''}`, 'data-slot': s, 'aria-pressed': String(armedSlot === s),
          'aria-label': `${SLOT_LABEL[s]}: ${w ? W[w].t : 'empty'}${locked() ? '' : w ? '. Select to change or clear' : '. Select, then choose a word'}`, disabled: locked() && view.id !== 'worked' ? '' : null },
          w ? W[w].t : SLOT_LABEL[s]);
        if (view.id === 'worked') b.disabled = true;
        b.addEventListener('click', () => slotClick(s));
        line.append(b);
      });
      const p = P(cur);
      card.append(line, el('p', { class: 'cat-card-meta', text: conf || view.id === 'worked' ? `${p.holder} ${p.acc}` : 'Undated sheet. The card dates it.' }));
    }
    function slotClick(s) {
      if (locked()) return;
      const fills = st.fills[cur] = st.fills[cur] || {};
      if (armedWord) { fills[s] = armedWord; armedWord = null; armedSlot = null; save(); afterFill(s); return; }
      if (armedSlot === s && fills[s]) { delete fills[s]; armedSlot = null; save(); renderCard(); renderBank(); renderNav(); syncCheck(); B.say(`${SLOT_LABEL[s]} cleared.`); return; }
      armedSlot = armedSlot === s ? null : s; renderCard(); renderBank();
      card.querySelector(`[data-slot="${s}"]`)?.focus();
      if (armedSlot) B.say(`${SLOT_LABEL[s]} slot selected. Now choose a word from the bank.${fills[s] ? ' Select the slot again to clear it.' : ''}`);
    }
    function afterFill(s) {
      renderCard(); renderBank(); renderNav(); syncCheck();
      const fills = st.fills[cur];
      B.say(`${SLOT_LABEL[s]}: ${W[fills[s]].t}.`);
      card.querySelector(`[data-slot="${s}"]`)?.focus();
      st.msg[view.id] = ''; msg.textContent = '';
    }
    function renderBank(fresh = []) {
      bank.innerHTML = '';
      const bk = st.bank[view.id] || [];
      if (!bk.length) { bank.append(el('p', { class: 'cat-bank-empty', text: view.id === 'worked' ? 'Follow the curator: the words collect here.' : 'Empty. Tap the marks on the sheet: seals, cartouches, the signature, the publisher’s mark.' })); return; }
      const used = new Set(Object.values(st.fills[cur] || {}));
      bk.forEach((w) => {
        const b = el('button', { type: 'button', class: `cat-word${used.has(w) ? ' used' : ''}${armedWord === w ? ' armed' : ''}${fresh.includes(w) ? ' fresh' : ''}`, 'aria-pressed': String(armedWord === w), disabled: locked() ? '' : null }, W[w].t);
        b.addEventListener('click', () => {
          if (locked()) return;
          if (armedSlot) { const s = armedSlot; (st.fills[cur] = st.fills[cur] || {})[s] = w; armedSlot = null; armedWord = null; save(); afterFill(s); return; }
          armedWord = armedWord === w ? null : w; renderBank(); bank.querySelectorAll('.cat-word')[bk.indexOf(w)]?.focus();
          if (armedWord) B.say(`${W[w].t} selected. Now choose a slot on the card.`);
        });
        bank.append(b);
      });
    }

    // ---- confirm in threes: only "two or fewer wrong" is ever said
    function syncCheck() {
      if (stage || view.id === 'worked') { check.hidden = true; return; }
      check.hidden = false;
      const all = view.prints.every((id) => Object.keys(st.fills[id] || {}).length === 4);
      check.disabled = !all || !!st.confirmed[view.id];
      check.textContent = st.confirmed[view.id] ? 'Confirmed' : all ? 'Confirm these three' : `Fill all three cards to confirm (${view.prints.reduce((n, id) => n + Object.keys(st.fills[id] || {}).length, 0)}/12)`;
    }
    check.addEventListener('click', () => {
      let wrong = 0;
      view.prints.forEach((id) => { const a = P(id).answer; Object.keys(a).forEach((s) => { if ((st.fills[id] || {})[s] !== a[s]) wrong++; }); });
      if (!wrong) {
        st.confirmed[view.id] = true; st.msg[view.id] = '';
        msg.textContent = 'All three cards are confirmed.';
        view.prints.forEach((id) => ctx.onResolve?.({ band: P(id).band }));
        B.say('All three cards are confirmed. Their records are now open.');
      } else if (wrong <= 2) { st.msg[view.id] = 'Two or fewer slots are wrong across these three cards.'; msg.textContent = st.msg[view.id]; B.say(st.msg[view.id]); }
      else { st.msg[view.id] = 'Not confirmed yet.'; msg.textContent = st.msg[view.id]; B.say('Not confirmed yet.'); }
      save(); renderNav(); renderCard(); renderBank(); renderAfter(); syncCheck();
    });

    function renderAfter() {
      after.innerHTML = '';
      const p = P(cur);
      if (view.id !== 'worked' && st.confirmed[view.id]) {
        after.append(el('div', { class: 'dk-happened' }, el('h5', { class: 'dk-happened-h', text: 'The record' }),
          el('p', { text: `${p.maker}, ${p.title}, ${p.date}.` }), record(p), srcLine(D, p.marks.flatMap((m) => m.src))));
        if (view === views[1] && !st.confirmed[views[2].id]) after.append(el('button', { type: 'button', class: 'dk-btn', onclick: () => showView(views[2]) }, 'Go on to Set II: less help →'));
      }
    }

    // ---- the worked example: a curator walks through the Sudden Shower with you
    function renderWalk() {
      walk.innerHTML = '';
      if (view.id !== 'worked') { walk.hidden = true; return; }
      walk.hidden = false;
      const N = Cg.walk.length;
      const intro = step < 0;
      const done = step >= N;
      const txt = intro ? 'Everything this sheet says about its own making sits outside the picture. Follow a curator through its marks, in the order a curator reads them.'
        : done ? 'The seals alone date the sheet: 改 aratame and 巳九, the Snake year, ninth month. The ninth month of 1857.' : Cg.walk[step].say;
      const back = el('button', { type: 'button', class: 'dk-btn small', disabled: intro ? '' : null }, '← Back');
      const fwd = el('button', { type: 'button', class: 'dk-btn small primary' }, intro ? 'Start' : done ? 'Read it again' : step === N - 1 ? 'Finish' : 'Next →');
      back.addEventListener('click', () => goStep(step - 1));
      fwd.addEventListener('click', () => goStep(done ? -1 : step + 1));
      const box = el('div', { class: 'cat-walk-box' }, el('span', { class: 'dk-kicker', text: intro ? 'Worked example' : done ? 'Worked example · done' : `Worked example · step ${step + 1} of ${N}` }),
        el('p', { class: 'cat-walk-t', text: txt }), el('div', { class: 'cat-walk-act' }, back, fwd));
      walk.append(box);
      if (done && !stage) walk.append(el('button', { type: 'button', class: 'dk-btn', onclick: () => showView(views[1]) }, 'Now three prints on your own: Set I →'));
    }
    function goStep(i) {
      const N = Cg.walk.length; const p = P(cur);
      step = Math.max(-1, Math.min(N, i));
      // rebuild the worked card up to this step
      st.fills[cur] = {}; st.bank.worked = []; st.found[cur] = [];
      for (let k = 0; k <= Math.min(step, N - 1); k++) {
        const s = Cg.walk[k]; const m = p.marks.find((x) => x.id === s.mark);
        (m.words || []).forEach((w) => { if (!st.bank.worked.includes(w)) st.bank.worked.push(w); });
        st.found[cur].push(m.id);
        s.fill.forEach((slot) => { st.fills[cur][slot] = p.answer[slot]; });
      }
      hsBtns.forEach((b) => b.classList.toggle('found', st.found[cur].includes(b._m.id)));
      renderCard(); renderBank(step >= 0 && step < N ? (p.marks.find((x) => x.id === Cg.walk[step].mark).words || []) : []); renderWalk();
      if (step >= 0 && step < N) { const m = p.marks.find((x) => x.id === Cg.walk[step].mark); read(m, null, true); }
      else { reading.innerHTML = ''; home(motion.reduced); hsBtns.forEach((b) => b.classList.remove('on')); }
      if (step >= N) { st.msg.worked = 'done'; ctx.onResolve?.({ band: 'aratame' }); renderNav(); }
      const t = walk.querySelector('.cat-walk-t'); if (t) { fade(t, motion); B.say(t.textContent); }
      walk.querySelector('.cat-walk-act .primary')?.focus({ preventScroll: true });
      save();
    }

    showView(view);
    if (view.id === 'worked' && st.msg.worked === 'done') goStep(Cg.walk.length);
    return {
      destroy() {},
      describe() {
        const p = P(cur);
        return stage ? 'Catalogue Desk, worked example: Hiroshige’s Sudden Shower over Shin-Ōhashi, read mark by mark into a catalogue card. The aratame seal and the Snake-year date seal date it to 1857.'
          : `Catalogue Desk: ${p.maker}, ${view.label}. Tap the marks on the print to harvest words, then fill the catalogue card.`;
      },
    };
  },
};

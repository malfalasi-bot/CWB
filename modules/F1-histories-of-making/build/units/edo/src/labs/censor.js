// Censor's Desk (after Papers, Please). A simulation: the learner is the inspector of each period, named
// as the record names that office. Real prints arrive one by one as proofs, with their censor seals covered;
// a rule-book changes by date (1790, 1842, 1843, 1853); the learner passes or returns each proof, then the
// record says what actually happened. Consequences only from the record. No score, no clock.
import { el } from '../util.js';
import { loadDesks, bench, imgSrc, marginCrop, glossCard, confTag, sourcesList, srcLine, whatThisShows, record, enter, fade, stampIn } from './desks/common.js';
import './censor.css';

const SEAL_GLYPH = { r1790: '極', r1842: '極', r1843: '名', r1853: '改' };
const CALL = { stamp: 'Passed', return: 'Returned' };

export default {
  id: 'censor', title: 'Censor’s Desk', kicker: 'Lab · simulation',
  async mount(root, ctx) {
    const D = await loadDesks();
    const { motion, scope } = ctx;
    const CS = D.censor, stage = ctx.mode === 'stage';
    const P = (id) => D.prints[id];
    const rules = CS.rules;
    const ruleAt = (y) => [...rules].reverse().find((r) => r.from <= y) || rules[0];
    // the stream, with "new orders" pages inserted where the rule-book changes
    const base = stage ? CS.stream.filter((s) => s.type === 'proof' && CS.stage.includes(s.print)) : CS.stream;
    const items = [];
    let last = -1;
    base.forEach((s) => { const k = rules.indexOf(ruleAt(s.year)); for (let j = last + 1; j <= k; j++) items.push({ type: 'orders', rule: rules[j] }); last = Math.max(last, k); items.push(s); });
    const KEY = stage ? 'censor-stage' : 'censor';
    let st = Object.assign({ idx: -1, calls: {} }, ctx.store.get(KEY, {}) || {});
    const save = () => ctx.store.set(KEY, st);

    const B = bench(root, { id: 'cs', kicker: 'Lab · simulation · the rule-book', title: 'Censor’s Desk', mode: ctx.mode,
      onReset: () => { st = { idx: -1, calls: {} }; save(); render(); B.say('The desk is cleared. Back to 1790.'); } });
    B.head.querySelector('.dk-id').append(el('span', { class: 'dk-sim', text: 'Simulation' }));
    const note = el('p', { class: 'cs-note', text: CS.note });
    const bar = el('div', { class: 'cs-bar' });
    const desk = el('div', { class: 'cs-desk' });
    const ledger = el('div', { class: 'cs-ledger' });
    B.body.append(note, bar, desk); if (!stage) B.body.append(ledger);
    if (stage) B.foot.append(el('button', { type: 'button', class: 'dk-btn', onclick: () => ctx.openRoom?.('desks', 'censor') }, `The full desk: ${CS.stream.filter((s) => s.type === 'proof').length} proofs, 1790–1857 →`));
    B.foot.append(whatThisShows(CS.what), sourcesList(D, [...rules.flatMap((r) => r.src), ...CS.stream.flatMap((s) => s.src)]));

    // ---- the rule-book: one page per order, open up to the current date
    function ruleBook(cur) {
      const book = el('div', { class: 'cs-book' });
      const tabs = el('div', { class: 'cs-book-tabs', role: 'tablist', 'aria-label': 'Rule-book pages' });
      const page = el('div', { class: 'cs-page', role: 'tabpanel' });
      const open = rules.filter((r) => r.from <= cur.from);
      let shown = cur;
      const draw = () => {
        tabs.innerHTML = '';
        rules.forEach((r) => {
          const avail = open.includes(r);
          const t = el('button', { type: 'button', role: 'tab', class: 'cs-book-tab', 'aria-selected': String(r === shown), disabled: avail ? null : '', tabindex: r === shown ? '0' : '-1' }, r.label);
          if (!avail) t.title = 'Not yet issued';
          t.addEventListener('click', () => { shown = r; draw(); });
          t.addEventListener('keydown', (e) => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return; e.preventDefault(); const k = open.indexOf(shown) + d; if (open[k]) { shown = open[k]; draw(); tabs.querySelector('[aria-selected=true]')?.focus(); } });
          tabs.append(t);
        });
        page.innerHTML = '';
        page.append(rulePage(shown, shown === cur));
      };
      draw();
      book.append(el('span', { class: 'dk-kicker', text: 'The rule-book' }), tabs, page);
      return book;
    }
    function rulePage(r, current) {
      return el('div', { class: `cs-rule${current ? ' current' : ''}` },
        el('p', { class: 'cs-rule-role' }, el('span', { class: 'k', text: 'Who examines' }), ` ${r.role} `, confTag(r.roleConf)),
        r.contentNote ? el('p', { class: 'cs-cnote', text: r.contentNote }) : null,
        el('ol', { class: 'cs-rule-lines' }, r.lines.map((l) => el('li', { text: l }))),
        el('div', {}, confTag(r.conf)), srcLine(D, r.src));
    }

    // ---- the date and the role, always on the desk
    function drawBar(item) {
      bar.innerHTML = '';
      const r = item?.type === 'orders' ? item.rule : ruleAt(item?.year ?? 1790);
      const when = item?.when || (item?.type === 'orders' ? r.label.split(' · ')[0] : '1790');
      const prog = items.filter((x) => x.type === 'proof');
      const n = prog.indexOf(item) + 1;
      bar.append(el('div', { class: 'cs-when' }, el('span', { class: 'k', text: 'Edo' }), el('b', { text: when })),
        el('div', { class: 'cs-role' }, el('span', { class: 'k', text: 'You are' }), el('b', { text: r.role }), confTag(r.roleConf)),
        el('div', { class: 'cs-count', text: n ? `Proof ${n} of ${prog.length}` : `${prog.length} proofs` }));
    }

    // ---- views
    function render() {
      desk.innerHTML = '';
      drawLedger();
      if (st.idx < 0) return intro();
      if (st.idx >= items.length) return closed();
      const it = items[st.idx];
      drawBar(it);
      if (it.type === 'orders') return orders(it);
      if (it.type === 'notice') return notice(it);
      return proof(it);
    }
    const next = () => { st.idx++; save(); render(); scope.timeout(() => desk.querySelector('[data-focus]')?.focus({ preventScroll: false }), 0); };

    function intro() {
      drawBar(null);
      const box = el('div', { class: 'cs-intro' },
        el('h4', { class: 'cs-h', tabindex: '-1', 'data-focus': '', text: stage ? 'Three proofs, three rule-books' : 'Edo, 1790 to 1857' }),
        el('p', { text: 'Proofs come to your desk one at a time, their censor’s seals still blank. Read the rule-book for the date, then pass the proof or return it to the publisher.' }),
        el('p', { text: 'After each call the record says what actually happened to that sheet. Nobody keeps score, and there is no clock.' }),
        el('button', { type: 'button', class: 'dk-btn primary', onclick: next }, 'Open the desk'));
      desk.append(box); enter(box, motion);
    }
    function orders(it) {
      const r = it.rule;
      const box = el('div', { class: 'cs-orders' },
        el('span', { class: 'dk-kicker', text: 'New orders' }),
        el('h4', { class: 'cs-h', tabindex: '-1', 'data-focus': '', text: r.label }),
        rulePage(r, true),
        el('button', { type: 'button', class: 'dk-btn primary', onclick: next }, 'To the desk'));
      desk.append(box); enter(box, motion);
      B.say(`New orders, ${r.label}. You are now: ${r.role}.`);
    }
    function notice(it) {
      const p = it.print ? P(it.print) : null;
      const box = el('div', { class: `cs-notice${p ? ' has-img' : ''}` },
        p ? el('div', { class: 'cs-notice-img' }, el('img', { src: imgSrc(p), alt: `${p.title}, ${p.date}.` })) : null,
        el('div', { class: 'cs-notice-t' },
          el('span', { class: 'dk-kicker', text: `From the record · ${it.when}` }),
          el('h4', { class: 'cs-h', tabindex: '-1', 'data-focus': '', text: it.title }),
          el('p', { class: 'cs-notice-p', text: it.text }), el('div', {}, confTag(it.conf)), srcLine(D, it.src),
          p ? record(p) : null,
          el('button', { type: 'button', class: 'dk-btn primary', onclick: next }, 'Next')));
      desk.append(box); enter(box, motion);
    }

    function proof(it) {
      const p = P(it.print), r = ruleAt(it.year);
      const decided = st.calls[it.print];
      const sheet = el('div', { class: 'cs-sheet' }, el('img', { src: imgSrc(p), alt: `Proof: ${it.subject}` }));
      const slips = p.marks.filter((m) => m.type === 'seal').map((m) => {
        const [x, y, w, h] = m.r;
        const s = el('span', { class: 'cs-slip', 'aria-hidden': 'true', style: `left:${x * 100}%;top:${y * 100}%;width:${w * 100}%;height:${h * 100}%` });
        sheet.append(s); return s;
      });
      const head = el('div', { class: 'cs-proof-head' },
        el('span', { class: 'dk-kicker', text: `Proof · ${it.when}` }),
        el('h4', { class: 'cs-h', tabindex: '-1', 'data-focus': '', text: it.subject }),
        el('p', { class: 'cs-proof-meta' }, el('span', { class: 'k', text: 'Publisher' }), ` ${it.publisher} · `, el('span', { class: 'k', text: 'Kind' }), ` ${p.kind}`),
        el('p', { class: 'cs-proof-sealnote', text: 'The censor’s seal is still blank: the paper slip marks where it goes.' }));
      const pass = el('button', { type: 'button', class: 'dk-btn primary cs-pass' }, el('span', { class: 'cs-stamp-ic', 'aria-hidden': 'true', lang: 'ja', text: SEAL_GLYPH[r.id] }), 'Stamp it: pass');
      const ret = el('button', { type: 'button', class: 'dk-btn cs-ret' }, 'Return it to the publisher');
      const actions = el('div', { class: 'cs-actions', role: 'group', 'aria-label': 'Your call' }, pass, ret);
      const stampPad = el('div', { class: 'cs-pad', 'aria-hidden': 'true' });
      const outcome = el('div', { class: 'cs-outcome', 'aria-live': 'polite' });
      const right = el('div', { class: 'cs-right' }, head, ruleBook(r), actions, stampPad, outcome);
      desk.append(el('div', { class: 'cs-proof' }, el('div', { class: 'cs-left' }, sheet), right));
      enter(right, motion, 8);
      const decide = (call, fresh) => {
        st.calls[it.print] = call; save();
        pass.disabled = ret.disabled = true;
        actions.classList.add('done');
        stampPad.innerHTML = '';
        const imp = call === 'stamp' ? el('span', { class: 'cs-imp', lang: 'ja', text: SEAL_GLYPH[r.id] }) : el('span', { class: 'cs-retslip', text: 'Returned' });
        stampPad.append(imp);
        if (fresh && call === 'stamp') stampIn(imp, motion);
        // the slips lift: the sheet shows the seal it actually carries
        slips.forEach((s, i) => { if (fresh && !motion.reduced) scope.timeout(() => s.classList.add('lift'), 300 + i * 60); else s.classList.add('lift'); });
        outcome.innerHTML = '';
        const sealMarks = p.marks.filter((m) => m.type === 'seal');
        const box = el('div', { class: 'cs-reveal' },
          el('div', { class: 'dk-you' }, el('span', { class: 'k', text: 'Your call' }), el('span', { class: 'dk-ghost', text: CALL[call] }),
            el('span', { class: 'k', text: 'The record' }), el('span', { class: 'dk-truth', text: 'Passed: the sheet carries the seal' })),
          el('p', { class: 'cs-why' }, el('span', { class: 'k', text: 'The rule-book, read to the letter' }), ` ${it.why}`),
          el('div', { class: 'cs-seen' }, marginCrop(D, p, 92), el('div', {}, ...sealMarks.slice(0, 1).map((m) => el('p', { class: 'cs-seen-t', text: m.text })), r.id === 'r1853' ? glossCard(D, 'aratame', true) : r.id === 'r1843' ? glossCard(D, 'nanushi', true) : glossCard(D, 'kiwame', true))),
          el('div', { class: 'dk-happened' }, el('h5', { class: 'dk-happened-h', text: 'What actually happened' }), el('p', { text: it.actual }), el('div', {}, confTag(it.conf)), srcLine(D, it.src)),
          record(p),
          el('button', { type: 'button', class: 'dk-btn primary cs-next', onclick: next }, st.idx >= items.length - 1 ? 'Close the desk' : 'Next'));
        outcome.append(box);
        if (fresh) { fade(box, motion); drawLedger(); B.say(`Your call: ${CALL[call]}. The record: passed. ${it.actual}`); scope.timeout(() => box.querySelector('.cs-next')?.focus({ preventScroll: true }), motion.reduced ? 0 : 350); }
      };
      pass.addEventListener('click', () => decide('stamp', true));
      ret.addEventListener('click', () => decide('return', true));
      if (decided) decide(decided, false);
    }

    function closed() {
      drawBar({ when: '1857', year: 1857 });
      const n = Object.keys(st.calls).length;
      const box = el('div', { class: 'cs-closed' },
        el('h4', { class: 'cs-h', tabindex: '-1', 'data-focus': '', text: 'The desk is closed' }),
        el('p', { text: `Every one of the ${n} proofs you saw was passed in its own day: each carries its censor’s seal. Where the rule-book and the record part company, the record is the history.` }),
        el('p', { text: 'The same seals are how these sheets are dated now. Read them at the Seal Timeline and the Catalogue Desk.' }),
        el('div', { class: 'cs-act' },
          el('button', { type: 'button', class: 'dk-btn', onclick: () => ctx.openRoom?.('desks', 'sealtimeline') }, 'Seal Timeline'),
          el('button', { type: 'button', class: 'dk-btn', onclick: () => ctx.openRoom?.('desks', 'catalogue') }, 'Catalogue Desk')));
      desk.append(box); enter(box, motion);
      ctx.onResolve?.({ events: ['e1790', 'e1842', 'e1847'] });
    }

    function drawLedger() {
      if (stage) return;
      ledger.innerHTML = '';
      const done = items.filter((it) => it.type === 'proof' && st.calls[it.print]);
      if (!done.length) return;
      ledger.append(el('h4', { class: 'dk-src-h', text: 'Your ledger' }),
        el('table', { class: 'cs-table' },
          el('thead', {}, el('tr', {}, el('th', { scope: 'col', text: 'Date' }), el('th', { scope: 'col', text: 'Proof' }), el('th', { scope: 'col', text: 'Your call' }), el('th', { scope: 'col', text: 'The record' }))),
          el('tbody', {}, done.map((it) => el('tr', {}, el('td', { text: it.when }), el('td', { text: P(it.print).title }), el('td', {}, el('span', { class: 'dk-ghost small', text: CALL[st.calls[it.print]] })), el('td', {}, el('span', { class: 'dk-truth small', text: 'Passed' })))))));
    }

    render();
    return {
      destroy() {},
      describe() { return `Censor’s Desk, a simulation: real prints arrive as proofs with their seals covered; a rule-book changes in 1790, 1842, 1843 and 1853; you pass or return each, and the record says what happened. ${Object.keys(st.calls).length} proofs decided.`; },
    };
  },
};

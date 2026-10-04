// The six tools. Each mounts into #layer-tool under its own Scope, so leaving the beat stops every timer it started.
// Nothing autoplays without a visible pause; reduced motion shows the end state at once.
import { el, esc, motion, Scope, imgUrl, provenance } from './util.js';
import { checkCard } from './checks.js';

const head = (kicker, title) => el('div', { class: 'tool-head' }, el('span', { class: 'kicker', text: kicker }), el('h4', { text: title }));
const fmt = (n) => Math.round(n).toLocaleString('en-GB');

export class Tools {
  constructor(root, C, hooks = {}) { this.root = root; this.C = C; this.hooks = hooks; this.scope = new Scope(); this.current = null; }
  hide() { this.scope.dispose(); this.scope = new Scope(); this.root.innerHTML = ''; this.current = null; }
  show(stage) {
    if (this.current === stage.tool) return;
    this.hide(); this.current = stage.tool;
    const S = this.scope, box = el('div', { class: `tool tool-${stage.tool}` });
    this.root.append(box);
    const fn = { peel: this.peel, waves: this.waves, margin: this.margin, edition: this.edition, contract: this.contract, closing: this.closing }[stage.tool];
    fn?.call(this, box, S);
  }
  describe(stage) {
    return {
      peel: 'The Great Wave separated into six colour layers, laid down one at a time.',
      waves: 'Three original impressions of the Great Wave, aligned for comparison.',
      margin: 'Hiroshige’s Sudden Shower over Shin-Ōhashi, with its seals, cartouches, signature and publisher’s mark outlined.',
      edition: 'A counter of the 1847 loyal-retainers series: fifty-one sheets, eight thousand sets.',
      contract: 'The clauses of a Yoshiwara indenture around 1800, and two historians’ readings of it.',
      closing: 'Six recall questions from across the unit.',
    }[stage.tool] || '';
  }

  // ---------------- peel the print
  peel(box, S) {
    const P = this.C.peel || { layers: [] };
    const stack = el('div', { class: 'peel-stack', role: 'img', 'aria-label': 'The Great Wave, rebuilt one colour layer at a time' },
      el('img', { class: 'base', src: imgUrl('jp1847', 'waves'), alt: '' }));
    const imgs = P.layers.map((L) => { const i = el('img', { src: imgUrl(L.id, 'peel'), alt: '', style: 'opacity:0' }); stack.append(i); return i; });
    const on = P.layers.map(() => false);
    const btns = P.layers.map((L, i) => {
      const b = el('button', { class: 'peel-layer', 'aria-pressed': 'false', type: 'button' },
        el('span', { class: 'sw', style: `background:${L.swatch}` }), el('span', { text: L.label }), el('span', { class: 'n', text: `${L.share.toFixed(0)}%` }));
      b.addEventListener('click', () => { stop(); set(i, !on[i]); sync(); });
      return b;
    });
    const range = el('input', { class: 'range', type: 'range', min: 0, max: P.layers.length, step: 1, value: 0, 'aria-label': 'Number of colour layers laid down' });
    const count = el('span', { class: 'kicker' });
    const play = el('button', { class: 'tbtn primary', type: 'button' }, 'Pause');
    function set(i, v) { on[i] = v; imgs[i].style.opacity = v ? 1 : 0; btns[i].classList.toggle('on', v); btns[i].setAttribute('aria-pressed', String(v)); }
    function sync() { const n = on.filter(Boolean).length; range.value = n; count.textContent = `${n} of ${P.layers.length} layers`; }
    range.addEventListener('input', () => { stop(); P.layers.forEach((_, i) => set(i, i < +range.value)); sync(); });
    let playing = false;
    const stop = () => { playing = false; S.clearIntervals(); play.textContent = 'Lay down again'; };
    const run = () => {
      playing = true; play.textContent = 'Pause'; P.layers.forEach((_, i) => set(i, false)); sync();
      let k = 0; S.interval(() => { if (k >= P.layers.length) return stop(); set(k++, true); sync(); }, motion.dur(1100) || 1);
    };
    play.addEventListener('click', () => (playing ? stop() : run()));
    const side = el('div', { class: 'peel-side' },
      el('p', { style: 'margin:0;color:var(--ink-2)', text: 'Printers worked from light to dark. Tap a layer to lift it, or drag.' }),
      ...btns, range, el('div', { style: 'display:flex;gap:8px;align-items:center;justify-content:space-between' }, count, play),
      el('p', { class: 'prov', text: 'A reconstruction: colours separated from the Met’s photograph of JP1847 by clustering. A real edition used a block per colour, plus the black key block.' }));
    box.append(head('Tool · Peel the print', 'One layer per ink'), el('div', { class: 'tool-body' }, stack, side));
    if (motion.reduced) { P.layers.forEach((_, i) => set(i, true)); sync(); play.textContent = 'Lay down again'; }
    else S.timeout(run, 500);
  }

  // ---------------- one design, three originals
  waves(box, S) {
    const W = this.C.images.waves || {};
    const ids = ['jp1847', 'jp10', 'aic'];
    const short = { jp1847: 'Met JP1847', jp10: 'Met JP10', aic: 'Chicago 1952.343' };
    const REG = {
      whole: { r: [0, 0, 1, 1], t: 'Same blocks, three printings. Nothing on the sheets says which came first: the British Museum orders impressions by wear and recutting in the blocks.' },
      sky: { r: [0.42, 0, 0.58, 0.42], t: 'The sky. JP1847 keeps its clouds in a pale wash. On JP10 they have almost gone. The Chicago sheet’s clouds are pink: safflower, the colour that fades first.' },
      horizon: { r: [0.48, 0.44, 0.36, 0.3], t: 'The horizon. The grey behind Fuji was graded by wiping the block for each pull, so no two sheets match. See how dark it runs on JP10.' },
      boats: { r: [0.3, 0.55, 0.7, 0.45], t: 'The boats. On JP1847 they are a pinkish buff, on the other two yellow. Boat colour is one of the signs the census uses to sort printings.' },
      title: { r: [0, 0, 0.2, 0.36], t: 'The title. Look at the double border round the cartouche: breaks where the wood split are a classic sign of a later pull. JP10 also has a collector’s seal by the signature.' },
    };
    let left = 'jp1847', right = 'jp10', split = 50, reg = 'whole';
    const inner = el('div', { class: 'waves-inner' });
    const base = el('img', { class: 'base', src: imgUrl('jp1847', 'waves'), alt: '', style: 'opacity:0' });
    const imL = el('img', { alt: '' }), imR = el('img', { alt: '' });
    const bar = el('div', { class: 'waves-split' });
    inner.append(base, imL, imR, bar);
    const view = el('div', { class: 'waves-view', role: 'img' }, inner,
      el('span', { class: 'wl', style: 'position:absolute;left:8px;top:8px;font:600 12px var(--ui);background:var(--paper-2);padding:3px 7px;border-radius:4px' }),
      el('span', { class: 'wr', style: 'position:absolute;right:8px;top:8px;font:600 12px var(--ui);background:var(--paper-2);padding:3px 7px;border-radius:4px' }));
    const sl = el('input', { class: 'range', type: 'range', min: 0, max: 100, value: 50, 'aria-label': 'Move the divide between the two impressions' });
    const obs = el('div', { class: 'obs', 'aria-live': 'polite' });
    const meta = el('div', { class: 'prov' });
    const draw = () => {
      imL.src = imgUrl(left, 'waves'); imR.src = imgUrl(right, 'waves');
      imR.style.clipPath = `inset(0 0 0 ${split}%)`; bar.style.left = `${split}%`;
      view.querySelector('.wl').textContent = short[left]; view.querySelector('.wr').textContent = short[right];
      view.setAttribute('aria-label', `${short[left]} on the left, ${short[right]} on the right, ${reg === 'whole' ? 'whole sheet' : 'detail: ' + reg}`);
      const [x, y, w, h] = REG[reg].r, k = 1 / Math.max(w, h);
      const vw = view.clientWidth || 600, vh = view.clientHeight || 400;
      inner.style.width = vw + 'px';
      inner.style.transform = reg === 'whole' ? '' : `translate(${-x * vw * k + (vw - w * vw * k) / 2}px, ${-y * (vw * 1075 / 1600) * k + (vh - h * (vw * 1075 / 1600) * k) / 2}px) scale(${k})`;
      obs.textContent = REG[reg].t;
      meta.innerHTML = [left, right].map((id) => provenance(W[id])).join('<br>');
    };
    const chipRow = (label, get, setv) => {
      const row = el('div', { class: 'chipset', role: 'group', 'aria-label': label }, el('span', { class: 'kicker', style: 'width:100%', text: label }));
      ids.forEach((id) => { const b = el('button', { class: 'tbtn', type: 'button', 'aria-pressed': 'false' }, short[id]); b.addEventListener('click', () => { setv(id); upd(); }); row.append(b); b.dataset.id = id; });
      const upd = () => { [...row.querySelectorAll('button')].forEach((b) => { const o = b.dataset.id === get(); b.classList.toggle('on', o); b.setAttribute('aria-pressed', String(o)); }); draw(); };
      row.upd = upd; return row;
    };
    const rL = chipRow('Left', () => left, (v) => { left = v; }), rR = chipRow('Right', () => right, (v) => { right = v; });
    const regs = el('div', { class: 'chipset', role: 'group', 'aria-label': 'Look at' }, el('span', { class: 'kicker', style: 'width:100%', text: 'Look at' }));
    Object.keys(REG).forEach((k) => { const b = el('button', { class: 'tbtn', type: 'button', 'aria-pressed': 'false', 'data-r': k }, k[0].toUpperCase() + k.slice(1)); b.addEventListener('click', () => { reg = k; updR(); }); regs.append(b); });
    const updR = () => { [...regs.querySelectorAll('button')].forEach((b) => { const o = b.dataset.r === reg; b.classList.toggle('on', o); b.setAttribute('aria-pressed', String(o)); }); draw(); };
    sl.addEventListener('input', () => { split = +sl.value; draw(); });
    const side = el('div', { class: 'waves-side' }, regs, obs, rL, rR, sl, meta);
    box.append(head('Tool · One design, three originals', 'Compare three Great Waves'), el('div', { class: 'tool-body' }, view, side));
    rL.upd(); rR.upd(); updR();
    const ro = new ResizeObserver(() => draw()); ro.observe(view); S.onDispose(() => ro.disconnect());
    // a single slow sweep of the divide, to show it moves; stops at the first touch
    if (!motion.reduced) { const sweep = async () => { await S.tween(1600, (k) => { split = 50 + 30 * Math.sin(k * Math.PI * 2); sl.value = split; draw(); }, (x) => x); }; S.timeout(sweep, 700); sl.addEventListener('pointerdown', () => S.r.forEach(cancelAnimationFrame), { once: true }); }
  }

  // ---------------- read the margin
  margin(box, S) {
    const meta = this.C.images.shower || {};
    const HS = [
      { id: 'seals', r: [0.80, 0, 0.068, 0.05], seal: true, label: 'Two seals', k: '改 · 巳九', text: 'The round seal reads 改, aratame, “examined”: the censor’s mark from 1853. Beside it, 巳九: the year of the Snake, ninth month. That is the ninth month of 1857.', conf: 'documented' },
      { id: 'series', r: [0.82, 0.066, 0.064, 0.166], label: 'Series title', k: '名所江戸百景', text: 'Meisho Edo hyakkei, One Hundred Famous Views of Edo. The red cartouche is the series’ brand, the same on every sheet.', conf: 'documented' },
      { id: 'title', r: [0.698, 0.078, 0.126, 0.098], label: 'Sheet title', k: '大はしあたけの夕立', text: 'Ōhashi Atake no yūdachi, Sudden shower at the great bridge and Atake. The patterned ground changes from sheet to sheet.', conf: 'documented' },
      { id: 'sig', r: [0.12, 0.762, 0.058, 0.142], label: 'Signature', k: '広重画', text: 'Hiroshige ga, “drawn by Hiroshige”. The only maker’s name on the sheet. Nobody signed for the carving or the printing.', conf: 'documented' },
      { id: 'pub', r: [0.04, 0.845, 0.05, 0.055], label: 'Publisher’s mark', k: '下谷 魚栄', text: 'Shitaya, Uoei: the publisher Uoya Eikichi of Shitaya. He paid for the blocks, the paper and the labour, and answered to the censor.', conf: 'documented' },
    ];
    const ar = (meta.h || 3200) / (meta.w || 2197);
    const frame = el('div', { style: 'position:relative;margin:0 auto' },
      el('img', { src: imgUrl('shower'), alt: 'Utagawa Hiroshige, Sudden Shower over Shin-Ōhashi Bridge and Atake, 1857', style: 'width:100%;height:100%;display:block;border:1px solid var(--line);border-radius:4px' }));
    const read = el('div', { class: 'mg-read', 'aria-live': 'polite' },
      el('span', { class: 'kicker', text: 'Tap a mark on the sheet' }), el('h5', { text: 'Five marks, four makers, one state' }),
      el('p', { text: 'Everything the sheet says about its own making sits in the margin or in a cartouche.' }));
    const done = new Set();
    const btns = HS.map((h) => {
      const [x, y, w, hh] = h.r;
      const b = el('button', { class: 'hs' + (h.seal ? ' seal' : ''), type: 'button', 'aria-label': h.label, style: `left:${x * 100}%;top:${y * 100}%;width:${w * 100}%;height:${hh * 100}%` });
      b.addEventListener('click', () => pick(h, b)); frame.append(b); return b;
    });
    const pick = (h, b) => {
      btns.forEach((x) => x.classList.remove('on')); b.classList.add('on', 'read'); done.add(h.id);
      read.innerHTML = `<span class="kicker">${esc(h.label)} · ${done.size} of ${HS.length} read</span><h5><span lang="ja">${esc(h.k)}</span></h5><p>${esc(h.text)}</p><div class="meta">${esc(h.conf)}</div>`;
    };
    const check = checkCard({
      q: 'From the seals alone, when was this sheet printed?',
      options: ['Before 1842: a kiwame seal', '1843–1853: ward headmen’s seals', '1857: aratame with a dated seal'],
      answer: 2, explain: 'Aratame with a date seal for the Snake year, ninth month: 1857. The band lights on the timeline below.', resolve: { band: 'aratame' },
    }, { kind: 'decide', onResolve: (r) => this.hooks.onResolve?.(r) });
    const side = el('div', { class: 'mg-side' }, read, check,
      el('p', { class: 'prov', html: provenance(meta) }));
    const mv = el('div', { class: 'mg-view' }, frame);
    box.append(head('Tool · Read the margin', 'Everything outside the picture'), el('div', { class: 'tool-body' }, mv, side));
    const fit = () => { const cw = mv.clientWidth, ch = mv.clientHeight; const w = Math.min(cw, ch / ar); frame.style.width = w + 'px'; frame.style.height = w * ar + 'px'; };
    const ro = new ResizeObserver(fit); ro.observe(mv); S.onDispose(() => ro.disconnect()); fit();
  }

  // ---------------- an edition
  edition(box, S) {
    const meta = this.C.images.gishi || {};
    const N = 51, SETS = 8000, PER_DAY = 200;
    const big = el('div', { class: 'ed-big', 'aria-live': 'off' }, '0', el('small', { text: 'sheets sold' }));
    const grid = el('div', { class: 'ed-grid', role: 'img', 'aria-label': 'Fifty-one sheets in the series; each fills as sets sell' });
    const cells = Array.from({ length: N }, (_, i) => { const c = el('div', { class: 'ed-cell' + (i === 13 ? ' hero' : '') }, el('i')); grid.append(c); return c; });
    const mSets = el('b', { text: '0' }), mDays = el('b', { text: '0' }), mMonth = el('b', { text: '7th month, 1847' });
    const metaRow = el('div', { class: 'ed-meta' }, el('div', {}, mSets, 'sets of 51'), el('div', {}, mDays, 'printer-days at 200 a day'), el('div', {}, mMonth, 'by the diary'));
    const months = ['7th month, 1847', '8th month', '9th month', '10th month', '11th month', '12th month', '1st month, 1848', '2nd month', '3rd month, 1848'];
    const quote = el('p', { class: 'ed-quote', text: 'The Fujiokaya diary records 8,000 sets of Kuniyoshi’s loyal retainers sold between the seventh month of 1847 and the third of 1848.' });
    const play = el('button', { class: 'tbtn primary', type: 'button' }, 'Pause');
    const flopB = el('button', { class: 'tbtn', type: 'button', 'aria-pressed': 'false' }, 'The same diary’s flop');
    const flop = el('div', { hidden: true, style: 'display:flex;flex-direction:column;gap:8px' });
    const draw = (k) => {
      const sets = SETS * k, sheets = sets * N;
      big.firstChild.textContent = fmt(sheets); mSets.textContent = fmt(sets); mDays.textContent = fmt(sheets / PER_DAY);
      mMonth.textContent = months[Math.min(months.length - 1, Math.floor(k * (months.length - 0.01)))];
      cells.forEach((c, i) => { const f = Math.max(0, Math.min(1, k * 1.25 - (i / N) * 0.25)); c.firstChild.style.height = (f * 100).toFixed(1) + '%'; });
    };
    let playing = false, k0 = 0;
    const run = async () => {
      playing = true; play.textContent = 'Pause';
      const from = k0 >= 1 ? 0 : k0;
      await S.tween(motion.dur(6500 * (1 - from)), (t) => { if (!playing) return; k0 = from + (1 - from) * t; draw(k0); }, (x) => x);
      if (playing) { playing = false; play.textContent = 'Run again'; big.setAttribute('aria-live', 'polite'); big.lastChild.textContent = 'sheets sold: 408,000'; }
    };
    play.addEventListener('click', () => { if (playing) { playing = false; S.r.forEach(cancelAnimationFrame); play.textContent = 'Resume'; } else run(); });
    flopB.addEventListener('click', () => {
      const on = flop.hidden; flop.hidden = !on; flopB.classList.toggle('on', on); flopB.setAttribute('aria-pressed', String(on));
      if (on && !flop.childElementCount) {
        const bar = (lab, n, cls) => el('div', { style: 'display:grid;grid-template-columns:110px 1fr 70px;gap:10px;align-items:center;font:500 13px var(--ui)' },
          el('span', { text: lab }), el('div', { style: 'height:16px;background:var(--paper-3);border-radius:3px;overflow:hidden' }, el('div', { class: cls, style: `height:100%;width:${n / 3000 * 100}%;background:${cls === 'sold' ? 'var(--indigo)' : 'var(--ink-3)'}` })), el('b', { text: fmt(n) }));
        flop.append(bar('Printed', 3000, 'printed'), bar('Sold', 450, 'sold'),
          el('p', { class: 'ed-quote', text: 'Another title in the same diary: 3,000 printed, 450 sold. The publisher had paid for the blocks, the paper and the labour of all 3,000. That was the bet.' }));
      }
    });
    const main = el('div', { class: 'ed-main' }, big, grid, metaRow, quote, el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, play, flopB), flop);
    const sheet = el('div', { class: 'ed-sheet' }, el('img', { src: imgUrl('gishi'), alt: 'Utagawa Kuniyoshi, Ōtaka Gengo Tadao, sheet 14 of the loyal retainers' }), el('p', { class: 'prov', html: provenance(meta) }));
    box.append(head('Tool · An edition', 'The forty-seven rōnin, by the sheet'), el('div', { class: 'ed-wrap' }, sheet, main));
    if (motion.reduced) { k0 = 1; draw(1); play.textContent = 'Run again'; } else { draw(0); S.timeout(run, 500); }
  }

  // ---------------- the contract (read, not played)
  contract(box) {
    const src = (ids) => el('span', { class: 'prov', style: 'display:block;margin-top:6px', text: ids.map((id) => this.C.sources[id]?.t || id).join(' · ') });
    const clause = (k, t, ids, wide) => el('div', { class: 'ct-card' + (wide ? ' wide' : '') }, el('span', { class: 'kicker', text: k }), el('span', { text: t }), src(ids));
    const wrap = el('div', { class: 'ct-wrap' },
      el('div', { class: 'ct-card wide', style: 'border-left:3px solid var(--ink-2)' }, el('span', { class: 'kicker', text: 'Content note' }),
        el('span', { text: 'This tool is about women sold into service in the licensed quarter. It gives the documented terms and two readings. It shows no pictures and keeps no score.' })),
      clause('Signed by', 'The girl’s father or guardian, not the girl.', ['sa-yoshiwara']),
      clause('Paid', 'A lump sum to the family in advance: for instance 25 ryō.', ['sa-yoshiwara']),
      clause('Term', 'Years of service: for instance five. A rule of 1626 limited terms to ten.', ['sa-yoshiwara']),
      clause('Certified', 'That she was not a Christian, with her temple registration attached.', ['sa-yoshiwara']),
      clause('Debts', 'Her food, clothes and medicine were charged to her account. Unpaid debts could extend the term.', ['wiki-yoshiwara']),
      clause('Leaving', 'Not without the house’s permission (probable).', ['wiki-yoshiwara']),
      clause('One record', 'Hanaōgi of the Ōgiya house was admired for her poetry and calligraphy. In 1794 she ran away, and was brought back.', ['met-hanaogi', 'world4-hanaogi'], true),
      el('div', { class: 'ct-card reading' }, el('span', { class: 'kicker', text: 'Reading A' }), el('h5', { text: 'A world of culture' }),
        el('span', { text: 'Cecilia Segawa Seigle (1993) treats the early quarter as a place of entertainment and society: fashion, poetry, music and celebrity, which the prints recorded.' })),
      el('div', { class: 'ct-card reading' }, el('span', { class: 'kicker', text: 'Reading B' }), el('h5', { text: 'A trade in women' }),
        el('span', { text: 'Amy Stanley (2012) reads the same contract as a sale. The family took the money, the house held the debt, and the ideal of the dutiful daughter justified it.' })),
      el('p', { class: 'prov ct-card wide', style: 'background:none;border:0;padding:0', text: 'Both readings use the same documents. The unit does not choose between them. The 1872 decree that cancelled these debts comes in Act III.' }));
    box.append(head('Read, not played · The contract', 'What was signed, and for whom'), wrap);
  }

  // ---------------- closing
  closing(box) {
    const Q = [
      { q: 'Which seal marked a sheet as examined from 1790 to 1842?', options: ['Kiwame', 'Aratame', 'The publisher’s ivy leaf'], answer: 0, explain: 'Kiwame, “examined”. Aratame came in 1853.', resolve: { band: 'kiwame' }, s: 'jaanus-aratame' },
      { q: 'Through which port did Prussian blue reach Japan?', options: ['Yokohama', 'Nagasaki', 'Osaka'], answer: 1, explain: 'Nagasaki, on Dutch ships and, from 1824, Chinese junks.', resolve: { events: ['e1824'] }, s: 'smith-blue' },
      { q: 'In 1842 the state capped a single sheet at…', options: ['8 mon', '16 mon', '32 mon'], answer: 1, explain: 'Sixteen mon, the price of a bowl of soba.', resolve: { events: ['e1842c'] }, s: 'kato-tenpo' },
      { q: 'Where were the three theatres moved in 1842?', options: ['Nihonbashi', 'Saruwaka-chō', 'Ryōgoku'], answer: 1, explain: 'Saruwaka-chō, near the road to the Yoshiwara.', resolve: { events: ['e1842t'] }, s: 'ndl-saruwaka' },
      { q: 'Which gift of 1921 may be studied but never exhibited?', options: ['The Spaulding gift, Boston', 'Hayashi’s stock, Paris', 'The Havemeyer bequest, New York'], answer: 0, explain: 'The Spauldings’ six thousand prints in Boston.', resolve: { events: ['e1921'] }, s: 'mfa-prints' },
      { q: 'When were a carver and printers first named in this story?', options: ['1790, in the censorship law', '1831, on the Great Wave', '1889, in a gift to the Smithsonian'], answer: 2, explain: 'In 1889, when Japan’s Printing Bureau sent the trade abroad.', resolve: { events: ['e1889'] }, s: 'si-tokuno' },
    ];
    let right = 0, n = 0;
    const score = el('p', { class: 'cl-score', 'aria-live': 'polite', text: `0 of ${Q.length} answered` });
    const xb = el('button', { class: 'tbtn primary', type: 'button', onclick: () => this.hooks.onExplore?.() }, 'Explore the atlas');
    const wrap = el('div', { class: 'cl-wrap' }, ...Q.map((q) => checkCard(q, { kind: 'closing', sources: [this.C.sources[q.s]?.t || q.s], onResolve: (r, ok) => {
      n++; if (ok) right++; score.textContent = `${right} of ${n} right · ${Q.length - n} to go`; this.hooks.onResolve?.(r);
      if (n === Q.length) score.textContent = `${right} of ${Q.length} right. The atlas is open.`;
    } })));
    box.append(el('div', { class: 'tool-head' }, el('span', { class: 'kicker', text: 'Recall' }), el('h4', { text: 'Six questions from the whole unit' }), score, xb), wrap);
  }
}

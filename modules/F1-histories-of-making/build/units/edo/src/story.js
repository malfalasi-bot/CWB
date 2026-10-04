// The story column, built from content.json, in one consistent grammar:
//   act opener (full-bleed hero, numeral, bet, scenes) → scenes (one washi sheet each, beats on an ink thread)
//   → the act's Rebuild (a kraft sheet) … → the Coda.
// Inside a beat: content note, prose, figure, debate, workbench slot (phones), guess, "Go deeper" links, sources.
// Every beat, opener, rebuild and the coda is a step: it names the instrument state the stage should show.
import { el, esc, renderText, imgUrl, eraOf, spriteEl, motion } from './util.js';
import { makeGuess } from './guess.js';
import { buildRebuild, buildCoda } from './rebuild.js';
import { ROOMS } from './rooms.js';

const yr = (y) => String(Math.floor(y));
// beats are written one sentence to a line; read them as running prose, keeping 「」 quotations as their own block
function renderProse(text, people) {
  const blocks = []; let buf = [];
  const flush = () => { if (buf.length) { blocks.push(buf.join(' ')); buf = []; } };
  for (const line of text.trim().split(/\n+/).map((l) => l.trim()).filter(Boolean)) {
    if (/^「[^」]+」$/.test(line)) { flush(); blocks.push(line); } else buf.push(line);
  }
  flush();
  return blocks.map((b) => renderText(b, people)).join('');
}
const CONFW = { documented: 'documented', probable: 'probable', contested: 'contested', argued: 'argued' };
const ROOM_IC = { desks: 'desks', workshop: 'workshop', views: 'views', atlas: 'atlas' };

export function sourcesFold(C, ids, label = 'Sources') {
  if (!ids?.length) return null;
  const ol = el('ol');
  ids.forEach((id) => { const s = C.sources[id]; if (!s) return; ol.append(el('li', {}, s.u ? el('a', { href: s.u, target: '_blank', rel: 'noopener' }, s.t) : s.t, s.conf ? el('span', { class: `conf c-${s.conf}`, text: s.conf }) : null)); });
  return el('details', { class: 'srcs' }, el('summary', {}, el('span', { class: 'srcs-ic', 'aria-hidden': 'true' }), `${label} · ${ids.length}`), ol);
}

export function buildStory(root, C, host) {
  const steps = [], scenes = [], guesses = [], rebuilds = [];
  const add = (node, data) => { node.classList.add('step'); const s = { el: node, ...data }; steps.push(s); return s; };
  const acts = C.acts;

  for (const [ai, act] of acts.entries()) {
    const firstBeat = act.segments[0].beats[0];
    const nScenes = act.segments.length;
    if (act.id !== 'p') root.append(actOpener(act, firstBeat));

    for (const [si, seg] of act.segments.entries()) {
      const years = seg.beats.map((b) => Math.floor(b.year));
      const ys = [Math.min(...years), Math.max(...years)];
      const sceneEl = el('section', { class: 'scene', id: `scene-${seg.id}`, 'aria-labelledby': `${seg.id}-h` });
      const paper = el('div', { class: 'sheet-paper' });
      const head = el('header', { class: 'scene-head' },
        el('div', { class: 'kicker', text: act.n ? `Act ${act.n} · Scene ${si + 1} of ${nScenes}` : act.kicker }),
        el('h3', { id: `${seg.id}-h`, text: act.id === 'p' ? act.title : seg.title }),
        el('div', { class: 'scene-years', text: ys[0] === ys[1] ? String(ys[0]) : `${ys[0]}–${ys[1]}` }));
      const thread = el('div', { class: 'thread', 'aria-hidden': 'true' }, el('i', { class: 'thread-ink' }));
      const body = el('div', { class: 'scene-body' }, thread);
      paper.append(head, body);
      sceneEl.append(el('div', { class: 'scene-wrap' }, paper));
      root.append(sceneEl);
      const scene = { el: sceneEl, body, thread, seg, act, steps: [] };
      scenes.push(scene);

      seg.beats.forEach((b, bi) => {
        const node = beatEl(b, act, seg, bi);
        body.append(node);
        const s = add(node, { kind: 'beat', act, seg, beat: b, year: b.year, stage: b.stage, show: b.show || [], scene });
        scene.steps.push(s);
        if (b.guess) {
          const G = makeGuess(b.guess, b, host.guessHost);
          node.querySelector('.guess-slot').replaceWith(G.el);
          s.guess = G; G.stepIndex = steps.length - 1; guesses.push(G);
        }
      });
      host.decorate?.(sceneEl);
    }

    if (act.rebuild) {
      const RB = buildRebuild(act, C, { ...host.rebuildHost, nextAct: () => acts[ai + 1] });
      root.append(RB.el);
      add(RB.el, { kind: 'rebuild', act, year: RB.year, stage: RB.stage, show: [], rebuild: RB });
      rebuilds.push(RB);
    }
  }
  const coda = buildCoda(C, host.codaHost);
  root.append(coda.el);
  add(coda.el, { kind: 'coda', act: acts[acts.length - 1], year: coda.year, stage: coda.stage, show: ['e1790', 'e1831', 'e1842', 'e1889', 'e2024'], coda });
  return { steps, scenes, guesses, rebuilds, coda };

  // ---------------- the act opener
  function actOpener(act, firstBeat) {
    const sec = el('section', { class: `act-open${act.seal ? ' has-seal' : ''}`, id: `act-${act.id}`, 'aria-labelledby': `act-${act.id}-h` });
    const who = (act.kicker.split('·').pop() || '').trim();
    const list = el('ol', { class: 'ao-scenes' }, ...act.segments.map((sg, i) => el('li', {},
      el('a', { href: `#${sg.beats[0].id}`, onclick: (e) => { e.preventDefault(); host.go?.(sg.beats[0].id); } },
        el('span', { class: 'ao-sn', text: `Scene ${i + 1}` }), el('span', { class: 'ao-st', text: sg.title })))));
    if (act.rebuild) list.append(el('li', { class: 'ao-rb' }, el('a', { href: `#rebuild-${act.id}`, onclick: (e) => { e.preventDefault(); host.go?.(`rebuild-${act.id}`); } }, el('span', { class: 'ao-sn', text: 'Then' }), el('span', { class: 'ao-st', text: 'Rebuild the act' }))));
    sec.append(
      el('div', { class: 'ao-scrim', 'aria-hidden': 'true' }),
      el('div', { class: 'ao-inner' },
        el('div', { class: 'ao-num', 'aria-hidden': 'true', lang: 'en', text: act.n }),
        act.seal ? el('div', { class: 'ao-seal', 'aria-hidden': 'true', lang: 'ja', text: '改' }) : null,
        el('div', { class: 'ao-kicker' }, el('span', { text: `Act ${act.n}` }), el('span', { class: 'dot', 'aria-hidden': 'true', text: '·' }), el('span', { text: act.years || '' }), el('span', { class: 'dot', 'aria-hidden': 'true', text: '·' }), el('span', { text: who })),
        el('h2', { id: `act-${act.id}-h`, text: act.title }),
        el('div', { class: 'ao-bet' }, el('span', { class: 'ao-bet-k', text: 'The bet' }), el('p', { text: act.bet || '' })),
        el('nav', { class: 'ao-contents', 'aria-label': `Act ${act.n} contents` }, list)),
      el('div', { class: 'ao-cue', 'aria-hidden': 'true' }, el('i')));
    add(sec, { kind: 'act', act, year: firstBeat.year, stage: act.hero || { mode: 'time', range: [1600, 2025], acts: true }, show: [] });
    return sec;
  }

  // ---------------- one beat
  function beatEl(b, act, seg, bi) {
    const art = el('article', { class: `beat${b.kind ? ' k-' + b.kind : ''}`, id: b.id, 'aria-label': `${seg.title}, ${yr(b.year)}` });
    art.append(el('div', { class: 'b-node', 'aria-hidden': 'true' }, el('i')));
    const era = eraOf(b.year);
    art.append(el('div', { class: 'b-when' }, el('span', { class: 'b-y', text: yr(b.year) }), era ? el('span', { class: 'b-era', text: era.split(' · ')[0] }) : null));
    if (b.note === 'quarter') art.append(contentNote(b));
    art.append(el('div', { class: 'prose', html: renderProse(b.text, C.people) }));
    // people named by the beat but not in its text
    const inText = new Set([...b.text.matchAll(/\[\[([^\]|]+)/g)].map((m) => m[1]));
    const extra = (b.people || []).filter((p) => !inText.has(p) && C.people[p]);
    if (extra.length) art.append(el('div', { class: 'b-cast' }, el('span', { class: 'kicker', text: 'Also here' }), ...extra.map((id) => el('button', { type: 'button', class: 'who', 'data-person': id, text: C.people[id].name }))));
    if (b.figure?.img) art.append(figure(b.figure));
    if (b.kind === 'argued' && b.argued) art.append(debate(b));
    if (b.stage?.mode === 'tool') art.append(el('div', { class: 'bench-cue', 'aria-hidden': 'true' }, el('span', { text: 'The workbench is open beside this text' }), el('i')), el('div', { class: 'lab-slot' }));
    if (b.guess) art.append(el('div', { class: 'guess-slot' }));
    const links = (b.links || []).filter((l) => l.to !== 'atlas' || host.atlasUrl);
    if (links.length) art.append(deeper(links));
    const sf = sourcesFold(C, b.sources); if (sf) art.append(sf);
    return art;
  }

  function contentNote(b) {
    const box = el('div', { class: 'cnote', role: 'note', 'aria-label': 'Content note' },
      el('div', { class: 'cnote-k', text: 'Content note' }),
      el('p', { text: 'This part is about the Yoshiwara, the licensed quarter, where women worked under indenture. It names them as people. No explicit images are shown.' }));
    const go = el('button', { type: 'button', class: 'g-btn' }, 'Continue');
    const skip = el('button', { type: 'button', class: 'g-btn ghost' }, 'Skip this part');
    go.addEventListener('click', () => { box.classList.add('ack'); const p = box.parentElement.querySelector('.prose'); p.tabIndex = -1; p.focus({ preventScroll: true }); });
    skip.addEventListener('click', () => host.skipFrom?.(b.id));
    box.append(el('div', { class: 'cnote-a' }, go, skip));
    return box;
  }

  function figure(f) {
    const m = C.images[f.img] || {};
    const pic = m.w ? el('img', { src: imgUrl(f.img), alt: m.title || '', loading: 'lazy', decoding: 'async', width: m.w, height: m.h }) : spriteEl(C, f.img, 400, m.title || '');
    const btn = el('button', { type: 'button', class: 'fig-btn', 'data-image': f.img, 'aria-label': `Open ${m.title || 'the image'}` }, pic, el('span', { class: 'fig-zoom', 'aria-hidden': 'true', text: '⤢' }));
    const [lead, ...rest] = String(f.cap).split(' · ');
    return el('figure', { class: 'fig' }, btn, el('figcaption', {}, el('span', { class: 'fig-t', text: lead }), rest.length ? el('span', { class: 'fig-c', text: rest.join(' · ') }) : null));
  }

  function deeper(links) {
    const nav = el('nav', { class: 'deeper', 'aria-label': 'Go deeper' }, el('span', { class: 'deeper-k', text: 'Go deeper' }));
    links.forEach((l) => {
      const room = ROOMS[l.to];
      const href = l.to === 'atlas' ? host.atlasUrl : `#room-${l.to}${l.anchor ? '.' + l.anchor : ''}`;
      const a = el('a', { class: 'room-link', href, ...(l.to === 'atlas' ? { target: '_blank', rel: 'noopener' } : {}) },
        el('span', { class: `room-ic ic-${ROOM_IC[l.to] || 'desks'}`, 'aria-hidden': 'true' }),
        el('span', { class: 'room-link-t' }, el('span', { class: 'room-link-l', text: l.label }), room ? el('span', { class: 'room-link-r', text: room.title }) : null),
        el('span', { class: 'arr', 'aria-hidden': 'true', text: '→' }));
      if (l.to !== 'atlas') a.addEventListener('click', (e) => { e.preventDefault(); host.openRoom?.(l.to, l.anchor, a); });
      nav.append(a);
    });
    return nav;
  }

  // ---------------- the debate: two readings, the evidence, where you land, then where the evidence points
  function debate(b) {
    const A = b.argued; const id = `db-${b.id}`;
    const key = `debate:${b.id}`; const st = { land: null, revealed: false, ...(host.store.get(key, {}) || {}) };
    const col = (k, r) => el('div', { class: `db-col db-${k}` },
      el('div', { class: 'db-top' }, el('span', { class: 'db-letter', 'aria-hidden': 'true', text: k.toUpperCase() }), el('span', { class: 'db-rd', text: `Reading ${k.toUpperCase()}` }), el('span', { class: `conf c-${r.conf}`, text: CONFW[r.conf] || r.conf })),
      el('h4', { text: r.title }), el('p', { text: r.text }), el('div', { class: 'db-flag', text: 'The evidence leans here' }));
    const cA = col('a', A.a), cB = col('b', A.b);
    const stops = ['Reading A', 'Leans A', 'Between', 'Leans B', 'Reading B'];
    const land = el('div', { class: 'db-land', role: 'radiogroup', 'aria-labelledby': `${id}-l` });
    const marks = el('div', { class: 'db-marks', 'aria-hidden': 'true' }, el('span', { class: 'db-ghost' }), el('span', { class: 'db-truth' }));
    const btns = stops.map((s, i) => {
      const r = el('button', { type: 'button', role: 'radio', 'aria-checked': 'false', class: 'db-stop', tabindex: i === 2 ? '0' : '-1' }, el('i', { 'aria-hidden': 'true' }), el('span', { text: s }));
      r.addEventListener('click', () => choose(i));
      r.addEventListener('keydown', (e) => { const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return; e.preventDefault(); const j = Math.max(0, Math.min(4, i + d)); btns[j].focus(); choose(j); });
      land.append(r); return r;
    });
    land.append(marks);
    const show = el('button', { type: 'button', class: 'g-btn' }, 'Show where the evidence points');
    const live = el('p', { class: 'vh', 'aria-live': 'polite' });
    const verdictPos = A.verdict === 'a' ? 1 : 3;
    const verdict = el('div', { class: 'db-verdict', hidden: true },
      el('div', { class: 'g-what' }, el('span', { class: 'g-rule', 'aria-hidden': 'true' }), 'Where the evidence points'),
      el('p', { class: 'db-vline' }, el('b', { text: `${stops[verdictPos]}.` }), ' ', A.why));
    const box = el('section', { class: 'debate', id, 'aria-labelledby': `${id}-q` },
      el('div', { class: 'db-k' }, el('span', { class: 'db-glyph', 'aria-hidden': 'true' }), 'Argued · two readings'),
      el('p', { class: 'db-q', id: `${id}-q`, text: A.q }),
      el('div', { class: 'db-cols' }, cA, el('div', { class: 'db-or', 'aria-hidden': 'true', text: 'or' }), cB),
      el('div', { class: 'db-ev' }, el('span', { class: 'kicker', text: 'The evidence' }), el('ul', {}, ...A.evidence.map((e) => el('li', {}, el('span', { text: e.t }), el('span', { class: `conf c-${e.conf}`, text: e.conf }))))),
      el('div', { class: 'db-landwrap' }, el('p', { class: 'db-ll', id: `${id}-l`, text: 'Where do you land?' }), land),
      el('div', { class: 'db-act' }, show), verdict, live);
    function paint() {
      btns.forEach((r, j) => { r.setAttribute('aria-checked', String(j === st.land)); r.tabIndex = (st.land ?? 2) === j ? 0 : -1; });
      const g = marks.querySelector('.db-ghost'), t = marks.querySelector('.db-truth');
      g.style.left = `${(st.land ?? 2) * 25}%`; g.hidden = st.land == null || !st.revealed;
      t.style.left = `${verdictPos * 25}%`; t.hidden = !st.revealed;
      box.classList.toggle('revealed', st.revealed);
      cA.classList.toggle('weight', st.revealed && A.verdict === 'a'); cB.classList.toggle('weight', st.revealed && A.verdict === 'b');
      verdict.hidden = !st.revealed; show.hidden = st.revealed;
    }
    function choose(i) { st.land = i; host.store.set(key, st); paint(); live.textContent = `You land: ${stops[i]}.`; }
    show.addEventListener('click', () => {
      st.revealed = true; host.store.set(key, st); paint();
      if (!motion.reduced) verdict.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: 'cubic-bezier(0.05,0.7,0.1,1)' });
      live.textContent = `Where the evidence points: ${stops[verdictPos]}. ${A.why}`;
    });
    box.resetDebate = () => { st.land = null; st.revealed = false; host.store.del(key); paint(); };
    paint();
    return box;
  }
}

export { esc };

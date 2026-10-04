// The story column, built from content.json: act openers, segment heads, a prediction per segment,
// beats (with cast cards at first appearance, figures, sources, content notes, argued cards), and decisions.
// Every step carries the instrument state it asks for; steps with no stage keep the current one.
import { el, esc, renderText, imgUrl } from './util.js';
import { checkCard, arguedCard } from './checks.js';

const dates = (p) => { const f = (v) => String(v).replace('~', 'c. '); return p.born == null && p.died == null ? '' : `${p.born != null ? f(p.born) : '?'}–${p.died != null ? f(p.died) : '?'}`; };

export function buildStory(root, C, { onResolve, onSkip } = {}) {
  const steps = [];
  const seen = new Set();
  const add = (node, data) => { node.classList.add('step'); root.append(node); steps.push({ el: node, ...data }); return node; };

  const castCard = (id) => {
    const p = C.people[id]; if (!p) return null;
    const g = C.groups.find((x) => x.id === p.group);
    const pm = C.images[p.img] || {};
    const pic = p.img ? el('img', { src: imgUrl(p.img, 't'), alt: '', loading: 'lazy', width: 92, height: pm.w ? Math.round(92 * pm.h / pm.w) : 92 }) : el('div', { class: 'mark', 'aria-hidden': 'true', lang: 'ja', text: p.mark || (p.kanji || p.name)[0] });
    return el('div', { class: 'cast' }, el('button', { class: 'who', 'data-person': id, style: 'text-decoration:none', 'aria-label': `More about ${p.name}` }, pic),
      el('div', {},
        el('div', { class: 'nm', html: `${esc(p.name)}${p.kanji ? `<span class="k" lang="ja">${esc(p.kanji)}</span>` : ''}` }),
        el('div', { class: 'dt', text: [dates(p), g?.title].filter(Boolean).join(' · ') }),
        el('div', { class: 'ln', text: p.line || '' }),
        p.img && p.cap ? el('div', { class: 'cp', text: p.cap }) : null));
  };
  const sourcesBox = (ids) => {
    if (!ids?.length) return null;
    const ol = el('ol');
    ids.forEach((id) => { const s = C.sources[id]; if (!s) return; ol.append(el('li', {}, s.u ? el('a', { href: s.u, target: '_blank', rel: 'noopener' }, s.t) : s.t, s.conf ? el('span', { class: 'conf', text: s.conf }) : null)); });
    return el('details', { class: 'srcs' }, el('summary', {}, `Sources (${ids.length})`), ol);
  };

  // an act opener labels the act's illustrated events, at most five, spread across it
  const actEvents = (act) => {
    const ids = [...new Set(act.segments.flatMap((sg) => sg.beats.flatMap((b) => b.show || [])))];
    const evs = ids.map((id) => C.timeline.events.find((e) => e.id === id)).filter((e) => e?.img).sort((a, b) => a.year - b.year);
    const out = []; for (const e of evs) if (!out.length || e.year - out[out.length - 1].year >= 15) out.push(e);
    return out.slice(0, 4).map((e) => e.id);
  };
  for (const act of C.acts) {
    const firstBeat = act.segments[0].beats[0];
    let actAnchor;
    if (act.id === 'p') {
      // the unit opener is the prologue's first beat, with the title on its card
      actAnchor = null;
    } else {
      const toc = el('ol', { style: 'margin:14px 0 0;padding-left:20px;font:500 15px/1.5 var(--ui);color:var(--ink-2)' }, ...act.segments.map((s) => el('li', { text: s.title })));
      const card = el('div', { class: 'card' }, el('div', { class: 'numeral', 'aria-hidden': 'true', text: act.n }), el('div', { class: 'kicker', text: act.kicker }), el('h2', { text: act.title }), toc);
      actAnchor = add(el('section', { class: 'act-open', id: `act-${act.id}`, 'aria-label': `Act ${act.n}: ${act.title}` }, card),
        { kind: 'act', act, year: firstBeat.year, stage: { mode: 'time', range: [1600, 2025], acts: true, lanes: ['state', 'trade', 'print', 'world', 'after'] }, show: actEvents(act) });
    }

    for (const seg of act.segments) {
      const years = seg.beats.map((b) => b.year);
      const segHead = el('div', { class: 'seg-head' }, el('span', { class: 'kicker', text: act.n ? `Act ${act.n} · Part ${act.segments.indexOf(seg) + 1} of ${act.segments.length}` : 'Prologue' }), el('h3', { text: seg.title }));
      if (seg.predict) {
        const node = el('section', { class: 'predict-step', id: `${seg.id}-predict`, 'aria-label': `${seg.title}: prediction` }, segHead,
          checkCard(seg.predict, { kind: 'predict', sources: (seg.predict.sources || []).map((id) => C.sources[id]?.t).filter(Boolean) }));
        add(node, { kind: 'predict', act, seg, year: seg.beats[0].year, stage: null });
      }
      seg.beats.forEach((b, bi) => {
        const card = el('div', { class: 'card' });
        if (act.id === 'p' && bi === 0 && seg === act.segments[0]) {
          card.append(el('div', { class: 'kicker', text: act.kicker }),
            el('div', { class: 'unit-open' }, el('h1', { html: `${esc(C.unit.title)}` }), el('p', { class: 'q', text: C.unit.question })),
            el('div', { class: 'kicker', style: 'margin:4px 0 14px', text: act.title }));
        } else if (!seg.predict && bi === 0) card.append(segHead);
        if (b.note === 'quarter') {
          const skip = el('button', { type: 'button' }, 'Skip to the next part');
          skip.addEventListener('click', () => onSkip?.(b.id));
          card.append(el('div', { class: 'cnote', role: 'note' }, el('b', {}, 'Content note: '), 'this part is about the Yoshiwara, where women worked under indenture. It names them as people. No explicit images are shown.', skip));
        }
        card.append(el('div', { class: 'text', html: renderText(b.text, C.people) }));
        if (b.kind === 'argued' && b.argued) card.append(arguedCard(b.argued, () => onResolve?.({ argued: b.id })));
        if (b.figure?.img) {
          const m = C.images[b.figure.img] || {};
          card.append(el('figure', { class: 'fig' }, el('button', { class: 'who', style: 'display:block;text-decoration:none', 'data-image': b.figure.img, 'aria-label': `Open ${m.title || 'the image'}` },
            el('img', { src: imgUrl(b.figure.img), alt: m.title || '', loading: 'lazy', width: m.w, height: m.h })), el('figcaption', { text: b.figure.cap })));
        }
        for (const id of b.people || []) if (!seen.has(id)) { seen.add(id); const cc = castCard(id); if (cc) card.append(cc); }
        // people introduced only in text also get a card at first mention
        for (const m of b.text.matchAll(/\[\[([^\]|]+)/g)) { const id = m[1]; if (!seen.has(id) && C.people[id]) { seen.add(id); card.append(castCard(id)); } }
        if (b.stage?.mode === 'tool') card.append(el('div', { class: 'tool-slot' }));
        const sb = sourcesBox(b.sources); if (sb) card.append(sb);
        const node = el('article', { class: `beat${b.kind ? ' ' + b.kind : ''}`, id: b.id, 'aria-label': `${seg.title}, ${Math.floor(b.year)}` }, card);
        if (actAnchor && bi === 0 && seg === act.segments[0] && !seg.predict) node.dataset.first = '1';
        add(node, { kind: 'beat', act, seg, beat: b, year: b.year, stage: b.stage, show: b.show || [] });
      });
      for (const [di, d] of (seg.decide || []).entries()) {
        const ev = d.resolve?.events || [];
        const lo = Math.floor((Math.min(...years) - 6) / 5) * 5, hi = Math.ceil((Math.max(...years) + 6) / 5) * 5;
        const evYears = ev.map((id) => C.timeline.events.find((e) => e.id === id)?.year).filter((y) => y != null);
        const range = [Math.min(lo, ...evYears.map((y) => y - 4)), Math.max(hi, ...evYears.map((y) => y + 4))];
        const stage = { mode: 'time', range, lanes: d.resolve?.band ? ['state', 'print'] : ['state', 'trade', 'print', 'world', 'after'], bands: !!d.resolve?.band };
        if (range[1] > 1900) stage.lanes = ['state', 'print', 'world', 'after'];
        const node = el('section', { class: 'decide-step', id: `${seg.id}-check-${di + 1}`, 'aria-label': `${seg.title}: check ${di + 1}` },
          checkCard(d, { kind: 'decide', onResolve: (r) => onResolve?.(r) }));
        add(node, { kind: 'decide', act, seg, year: evYears.length ? Math.max(...evYears) : Math.max(...years), stage, show: [] });
      }
    }
  }
  return steps;
}

// One-tap checks: a prediction before a segment, decisions after it, argued two-reading cards, and order checks.
// Results are announced (aria-live) and marked by symbol and text, never by colour alone.
import { el, esc } from './util.js';

export function checkCard(c, { kind = 'predict', onResolve, sources } = {}) {
  const tag = kind === 'predict' ? 'Before you read: predict' : kind === 'closing' ? 'Recall' : 'Check';
  const card = el('div', { class: 'card' });
  const wrap = el('section', { class: `check ${kind}`, 'aria-label': tag }, card);
  card.append(el('div', { class: 'tag' }, tag), el('p', { class: 'q', text: c.q }));
  const opts = el('div', { class: 'opts', role: 'group', 'aria-label': 'Answers' });
  const verdict = el('div', { class: 'verdict', 'aria-live': 'polite' });
  const order = c.kind === 'order';
  const picked = [];
  c.options.forEach((o, i) => {
    const b = el('button', { class: 'opt', type: 'button' }, el('span', { class: 'mk', 'aria-hidden': 'true' }), el('span', { class: 'ord', 'aria-hidden': 'true' }), el('span', { text: o }));
    b.addEventListener('click', () => {
      if (wrap.classList.contains('done')) return;
      if (order) {
        if (picked.includes(i)) return;
        picked.push(i); b.classList.add('picked'); b.querySelector('.ord').textContent = picked.length;
        if (picked.length < c.options.length) return;
        const right = JSON.stringify(picked) === JSON.stringify(c.answer);
        finish(right, null);
        return;
      }
      finish(i === c.answer, i);
    });
    opts.append(b);
  });
  function finish(right, i) {
    wrap.classList.add('done');
    const bs = [...opts.children];
    if (order) { c.answer.forEach((ix, n) => { bs[ix].classList.add('right'); bs[ix].querySelector('.mk').textContent = n + 1; }); }
    else bs.forEach((b, j) => { if (j === c.answer) { b.classList.add('right'); b.querySelector('.mk').textContent = '✓'; } else if (j === i) { b.classList.add('wrong'); b.querySelector('.mk').textContent = '✕'; } });
    const head = kind === 'predict' ? (right ? 'You predicted it.' : 'Most people guess otherwise.') : (right ? 'Right.' : 'Not quite.');
    verdict.innerHTML = `<b>${head}</b> ${esc(c.explain)}`;
    if (sources?.length) verdict.append(el('span', { class: 'src', text: 'Source: ' + sources.join('; ') }));
    onResolve?.(c.resolve, right);
  }
  card.append(opts, verdict);
  if (order) card.insertBefore(el('p', { class: 'kicker', text: 'Tap them in order, earliest first' }), opts);
  return wrap;
}

export function arguedCard(a, onResolve) {
  const card = el('div', { class: 'argued' });
  card.append(el('div', { class: 'tag kicker', style: 'color:var(--indigo)' }, 'Argued · two readings'), el('p', { class: 'q', style: 'font:600 20px/1.35 var(--display);margin:8px 0 10px', text: a.q }));
  const cA = el('div', { class: 'col' }, el('span', { class: 'lt' }, 'READING A'), el('h4', { text: a.a.title }), el('p', { text: a.a.text }));
  const cB = el('div', { class: 'col' }, el('span', { class: 'lt' }, 'READING B'), el('h4', { text: a.b.title }), el('p', { text: a.b.text }));
  card.append(el('div', { class: 'cols' }, cA, cB));
  card.append(el('div', { class: 'ev' }, el('span', { class: 'kicker' }, 'Evidence'), a.evidence));
  const verdict = el('div', { class: 'verdict', 'aria-live': 'polite' });
  const pick = el('div', { class: 'pick', role: 'group', 'aria-label': 'Which reading does the evidence support?' });
  ['a', 'b'].forEach((k) => {
    const b = el('button', { class: 'opt', type: 'button' }, el('span', { class: 'mk', 'aria-hidden': 'true' }), `Supports ${k.toUpperCase()}`);
    b.addEventListener('click', () => {
      if (card.classList.contains('done')) return; card.classList.add('done');
      [...pick.children].forEach((x, j) => { const kk = j ? 'b' : 'a'; if (kk === a.verdict) { x.classList.add('right'); x.querySelector('.mk').textContent = '✓'; } else if (kk === k) { x.classList.add('wrong'); x.querySelector('.mk').textContent = '✕'; } });
      (a.verdict === 'a' ? cA : cB).classList.add('win');
      verdict.innerHTML = `<b>${k === a.verdict ? 'That is the stronger fit.' : 'Look again.'}</b> ${esc(a.why)}`;
      onResolve?.();
    });
    pick.append(b);
  });
  card.append(el('p', { class: 'kicker', text: 'Which reading does this evidence support?' }), pick, verdict);
  return card;
}

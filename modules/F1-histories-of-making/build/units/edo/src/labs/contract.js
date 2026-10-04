// Read, not played · the contract. A content note first; the clauses of a Yoshiwara indenture around 1800 as document
// cards, each with its source; Hanaōgi's record; two scholarly readings side by side. No score, no outcome, no interaction
// beyond reading and opening sources. No pictures.
import { el } from '../util.js';
import { confChip } from '../cards.js';
import './contract.css';

const CLAUSES = [
  { k: 'Signed by', t: 'The girl’s father or guardian, not the girl.', src: ['sa-yoshiwara'], conf: 'documented' },
  { k: 'Paid', t: 'A lump sum to the family in advance: for instance 25 ryō.', src: ['sa-yoshiwara'], conf: 'documented' },
  { k: 'Term', t: 'Years of service: for instance five. A rule of 1626 limited terms to ten.', src: ['sa-yoshiwara'], conf: 'documented' },
  { k: 'Certified', t: 'That she was not a Christian, with her temple registration attached.', src: ['sa-yoshiwara'], conf: 'documented' },
  { k: 'Debts', t: 'Her food, clothes and medicine were charged to her account. Unpaid debts could extend the term.', src: ['wiki-yoshiwara'], conf: 'documented' },
  { k: 'Leaving', t: 'Not without the house’s permission.', src: ['wiki-yoshiwara'], conf: 'probable' },
];
const READINGS = [
  { k: 'Reading A', h: 'A world of culture', t: 'Cecilia Segawa Seigle treats the early quarter as a place of entertainment and society: fashion, poetry, music and celebrity, which the prints recorded.',
    cite: 'Cecilia Segawa Seigle, Yoshiwara: The Glittering World of the Japanese Courtesan (University of Hawai‘i Press, 1993)' },
  { k: 'Reading B', h: 'A trade in women', t: 'Amy Stanley reads the same contract as a sale. The family took the money, the house held the debt, and the ideal of the dutiful daughter justified it.',
    cite: 'Amy Stanley, Selling Women: Prostitution, Markets, and the Household in Early Modern Japan (University of California Press, 2012)' },
];

export default {
  id: 'contract', title: 'What was signed, and for whom', kicker: 'Read, not played',
  async mount(root, ctx) {
    const { C } = ctx;
    root.innerHTML = '';
    const src = (ids) => el('div', { class: 'ct-src' }, el('span', { class: 'cc-kick', text: 'Source' }),
      ...ids.map((id) => { const s = C.sources?.[id]; return s ? (s.u ? el('a', { href: s.u, target: '_blank', rel: 'noopener' }, s.t) : el('span', { text: s.t })) : el('span', { text: id }); }));
    const clause = (c, i) => el('article', { class: 'ct-doc', 'aria-labelledby': `ct-k-${i}` },
      el('div', { class: 'ct-doc-h' }, el('span', { class: 'ct-n', 'aria-hidden': 'true', text: String(i + 1) }), el('h5', { id: `ct-k-${i}`, text: c.k }), confChip(c.conf)),
      el('p', { text: c.t }), src(c.src));
    const all = [...new Set([...CLAUSES.flatMap((c) => c.src), 'met-hanaogi', 'world4-hanaogi', 'jf-1872'])];
    root.append(el('section', { class: 'cc-lab ct', 'aria-label': 'Read, not played: the contract' },
      el('header', { class: 'cc-lab-head' }, el('span', { class: 'cc-lab-kick', text: 'READ, NOT PLAYED' }), el('h4', { text: 'What was signed, and for whom' })),
      el('div', { class: 'ct-note', role: 'note' }, el('b', { text: 'Content note.' }),
        el('span', { text: ' This page is about women sold into service in the licensed quarter. It gives the documented terms of a contract and two historians’ readings. It shows no pictures and keeps no score.' })),
      el('div', { class: 'cc-lab-what' }, el('span', { class: 'cc-kick', text: 'What this shows' }),
        el('p', { text: 'The clauses of a typical indenture around 1800, one card to a clause, each with where it comes from. Then one woman’s record, and two ways of reading the same documents.' })),
      el('h5', { class: 'ct-sec', text: 'The clauses' }),
      el('div', { class: 'ct-docs' }, ...CLAUSES.map(clause)),
      el('h5', { class: 'ct-sec', text: 'One record' }),
      el('article', { class: 'ct-doc wide record' },
        el('div', { class: 'ct-doc-h' }, el('h5', { text: 'Hanaōgi of the Ōgiya house' }), confChip('probable')),
        el('p', { text: 'She was admired for her poetry and calligraphy, and Utamaro drew her. In 1794 she ran away from the quarter, and was brought back.' }),
        src(['met-hanaogi', 'world4-hanaogi'])),
      el('h5', { class: 'ct-sec', text: 'Two readings of the same documents' }),
      el('div', { class: 'ct-reads' }, ...READINGS.map((r) => el('article', { class: 'ct-read' },
        el('span', { class: 'cc-kick', text: r.k }), el('h5', { text: r.h }), el('p', { text: r.t }), el('p', { class: 'ct-cite', text: r.cite })))),
      el('p', { class: 'ct-close', text: 'Both readings use the same documents. The unit does not choose between them. A decree of 1872 cancelled these debts (probable); it comes later in the story.' }),
      el('details', { class: 'cc-lab-foot' }, el('summary', {}, 'All sources'),
        el('ol', { class: 'cc-lab-src' }, ...all.map((id) => { const s = C.sources?.[id]; return s ? el('li', {}, s.u ? el('a', { href: s.u, target: '_blank', rel: 'noopener' }, s.t) : s.t, ' ', confChip(s.conf || 'documented')) : null; }).filter(Boolean),
          ...READINGS.map((r) => el('li', {}, r.cite, ' ', confChip('argued')))))));
    return {
      destroy() { root.innerHTML = ''; },
      describe() { return 'A content note, then the clauses of a Yoshiwara indenture around 1800 with their sources, the record of Hanaōgi, and two historians’ readings side by side. Nothing to play.'; },
    };
  },
};

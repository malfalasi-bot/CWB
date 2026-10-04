// The lab registry. Each lab is its own module (src/labs/<id>.js), loaded on demand.
// import.meta.glob only lists files that exist, so a lab that has not been built yet shows a
// "workbench loading" frame instead of breaking the page. Nothing a lab does may crash the host.
import { el, Scope } from '../util.js';

const MODS = import.meta.glob(['./*.js', '!./index.js']);

export const LABS = {
  print: { title: 'Print the Wave', kicker: 'Lab · reconstruction' },
  compare: { title: 'Three Great Waves', kicker: 'Lab · compare impressions' },
  edition: { title: 'An edition', kicker: 'Lab · the record' },
  contract: { title: 'The contract', kicker: 'Read, not played' },
  catalogue: { title: 'Catalogue Desk', kicker: 'Lab · read the margin' },
  sealtimeline: { title: 'Seal Timeline', kicker: 'Lab · date by seal' },
  censor: { title: 'Censor’s Desk', kicker: 'Lab · the rule-book' },
  view: { title: 'Step into the View', kicker: 'Lab · depth planes, reconstruction' },
  ukie: { title: 'The uki-e box', kicker: 'Lab · perspective' },
};

// story beats name the v3 tools; these are the labs that replace them on the stage
export const TOOL_TO_LAB = { peel: 'print', waves: 'compare', edition: 'edition', contract: 'contract', margin: 'catalogue' };

export const hasLab = (id) => !!MODS[`./${id}.js`];

function placeholder(root, id, state, msg) {
  const L = LABS[id] || { title: id, kicker: 'Lab' };
  root.innerHTML = '';
  const box = el('div', { class: `lab-ph ${state}`, role: 'status' },
    el('div', { class: 'lab-ph-k', text: L.kicker }),
    el('div', { class: 'lab-ph-t', text: L.title }),
    el('div', { class: 'lab-ph-m', text: msg }),
    state === 'loading' ? el('div', { class: 'lab-ph-bar', 'aria-hidden': 'true' }, el('i')) : null);
  root.append(box);
  return box;
}

// mount(id, root, ctx) -> { destroy(), describe() }; always resolves, never throws
export async function mountLab(id, root, ctx) {
  const L = LABS[id] || { title: id };
  const scope = ctx.scope || new Scope();
  let alive = true;
  scope.onDispose?.(() => { alive = false; });
  const fallback = (state, msg) => { placeholder(root, id, state, msg); return { destroy() { root.innerHTML = ''; }, describe: () => `${L.title}: ${msg}` }; };
  const load = MODS[`./${id}.js`];
  if (!load) return fallback('missing', 'This workbench is still being set up. The story beside it is complete without it.');
  placeholder(root, id, 'loading', 'Setting out the workbench…');
  try {
    const mod = await load();
    if (!alive) return { destroy() {}, describe: () => '' };
    const lab = mod.default || mod;
    if (!lab?.mount) return fallback('missing', 'This workbench is not ready yet.');
    root.innerHTML = '';
    const inst = await lab.mount(root, { ...ctx, scope });
    if (!alive) { try { inst?.destroy?.(); } catch (e) { /* */ } return { destroy() {}, describe: () => '' }; }
    return {
      destroy() { try { inst?.destroy?.(); } catch (e) { console.error(`lab ${id} destroy`, e); } root.innerHTML = ''; },
      describe() { try { return inst?.describe?.() || L.title; } catch (e) { return L.title; } },
    };
  } catch (e) {
    console.error(`lab ${id} failed to mount`, e);
    if (!alive) return { destroy() {}, describe: () => '' };
    return fallback('failed', 'This workbench could not open here. Everything it shows is also in the text.');
  }
}

// Lab "print": Print the Wave. mode 'stage' = the exploded block stack beside the story; mode 'room' = the full workshop.
// three.js is reached only through dynamic import (src/labs/print/renderer.js → src/3d/common.js); a 2D bench takes over
// when WebGL is missing or the quality tier is 0.
import './print.css';

let dataP = null;
const loadData = () => (dataP ||= fetch('data/print.json').then((r) => { if (!r.ok) throw new Error('print.json ' + r.status); return r.json(); }).catch((e) => { dataP = null; throw e; }));

export default {
  id: 'print',
  title: 'Print the Wave',
  kicker: 'Lab · reconstruction',
  async mount(root, ctx) {
    const D = await loadData();
    const mod = ctx.mode === 'room' ? await import('./print/room.js') : await import('./print/stage.js');
    return mod.mount(root, ctx, D);
  },
};

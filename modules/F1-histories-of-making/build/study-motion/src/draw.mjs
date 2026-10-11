// Shared drawing for the study pages: map frames (flat and orthographic), the 1859 sheet, the glyph library, the clock,
// the markdown renderer. Everything is static SVG; motion states are drawn as their mid-frame.
import { readFileSync } from 'fs';
export const F = JSON.parse(readFileSync(new URL('./frames.json', import.meta.url)));
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const W = F.W, H = F.H;

// ---------------------------------------------------------------- glyph library (24 px grid, sumi line, one wash)
export const GLYPHS = {
  ship: { label: 'ship', d: '<path class="gw" d="M3 16h18l-2 4H5z"/><path class="gl" d="M3 16h18l-2 4H5zM12 16V4m0 1 6 7h-6M12 6 7 12h5"/>' },
  junk: { label: 'junk', d: '<path class="gw" d="M3 17h18l-3 4H6z"/><path class="gl" d="M3 17h18l-3 4H6zM10 17V5m0 1h6l-1 3h-5m0 1h6l-1 3h-5m0 1h6l-1 2h-5"/>' },
  steamer: { label: 'steamer', d: '<path class="gw" d="M2 16h20l-2 4H4z"/><path class="gl" d="M2 16h20l-2 4H4zM6 16v-4h12v4M10 12V8h4v4"/><path class="gl gs" d="M12 7c0-2 2-2 2-4M15 6c0-2 2-2 2-3"/>' },
  crate: { label: 'crate', d: '<path class="gw" d="M4 8h16v12H4z"/><path class="gl" d="M4 8h16v12H4zM4 14h16M12 8v12"/>' },
  pavilion: { label: 'pavilion', d: '<path class="gw" d="M2 11 12 4l10 7H2z"/><path class="gl" d="M2 11 12 4l10 7H2zM5 11v9M19 11v9M5 20h14"/>' },
  shop: { label: 'shop', d: '<path class="gw" d="M3 9h18v3H3z"/><path class="gl" d="M3 9h18M3 9v3l2 2V21M21 9v3l-2 2v7M5 21h14M7 12v3M11 12v3M15 12v3M19 12"/>' },
  book: { label: 'book', d: '<path class="gw" d="M4 5h16v14H4z"/><path class="gl" d="M4 5h16v14H4zM12 5v14M7 9h3M7 12h3M14 9h3M14 12h3"/>' },
  fan: { label: 'fan', d: '<path class="gw" d="M12 20 4 8a12 12 0 0 1 16 0z"/><path class="gl" d="M12 20 4 8a12 12 0 0 1 16 0zM12 20 8 7M12 20V5M12 20l4-13"/>' },
  pigment: { label: 'pigment', d: '<path class="gw gi" d="M12 4c3 5 6 8 6 12a6 6 0 0 1-12 0c0-4 3-7 6-12z"/><path class="gl" d="M12 4c3 5 6 8 6 12a6 6 0 0 1-12 0c0-4 3-7 6-12z"/>' },
  coin: { label: 'coin', d: '<circle class="gw" cx="12" cy="12" r="9"/><path class="gl" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9 9h6v6H9z"/>' },
  soba: { label: 'soba bowl', d: '<path class="gw" d="M3 12h18a9 9 0 0 1-18 0z"/><path class="gl" d="M3 12h18a9 9 0 0 1-18 0zM8 9c0-2 1-2 1-4M12 9c0-2 1-2 1-4M16 9c0-2 1-2 1-4"/>' },
  flame: { label: 'flame', d: '<path class="gw gr" d="M12 3c1 4 5 6 5 11a5 5 0 0 1-10 0c0-3 2-4 2-7 1 2 2 2 3 1-1-2 0-3 0-5z"/><path class="gl" d="M12 3c1 4 5 6 5 11a5 5 0 0 1-10 0c0-3 2-4 2-7 1 2 2 2 3 1-1-2 0-3 0-5z"/>' },
  seal: { label: 'seal (stamped)', d: '<rect class="gw gr" x="5" y="5" width="14" height="14" rx="1"/><path class="gl gsr" d="M5 5h14v14H5zM8 8h8M8 12h8M8 16h8M12 8v8"/>' },
  sealcut: { label: 'seal (cut)', d: '<rect class="gw" x="5" y="5" width="14" height="14" rx="1"/><path class="gl" d="M5 5h14v14H5z"/><path class="gl gsr" d="M8 8h8M8 12h8M8 16h8M12 8v8" stroke-dasharray="2 1.5"/>' },
  bubble: { label: 'bubble', d: '<circle class="gw gi" cx="12" cy="12" r="9"/><circle class="gl" cx="12" cy="12" r="9" stroke-dasharray="3 2"/>' },
  procession: { label: 'procession', d: '<path class="gl" d="M4 20v-7l2-2 2 2v7M11 20v-8l2-2 2 2v8M18 20v-6l1-1 1 1v6M6 11V5M13 10V4M19 13V8"/><path class="gw" d="M6 5h4v3H6zM13 4h4v3h-4z"/>' },
};
export function glyphDefs() {
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${Object.entries(GLYPHS).map(([id, g]) => `<symbol id="g-${id}" viewBox="0 0 24 24">${g.d}</symbol>`).join('')}</defs></svg>`;
}
export const glyph = (id, x, y, s = 26) => `<use href="#g-${id}" x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" class="gly"/>`;

// ---------------------------------------------------------------- places and arcs per view
const SHEET = { w: 600, h: 537, dy: -100, dx: 20 };
const sheetPt = (id) => { const p = F.sheet.places[id]; return [p[0] * SHEET.w + SHEET.dx, p[1] * SHEET.h + SHEET.dy]; };
export function pt(view, id) {
  if (view === 'sheet') return F.sheet.places[id] ? sheetPt(id) : null;
  if (view.startsWith('o-')) return F.ortho[view]?.places[id] || null;
  return F.views[view]?.places[id] || null;
}
function arcOf(view, key) {
  if (view === 'sheet') { const [a, b] = key.split('>'); const A = sheetPt(a), B = sheetPt(b); const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2 - 18; return { d: `M${A.join(',')}Q${mx},${my} ${B.join(',')}`, mid: [mx, my + 9] }; }
  if (view.startsWith('o-')) return F.ortho[view]?.arcs[key] || null;
  const d = F.arcs[view]?.[key]; return d ? { d, mid: null } : null;
}
export const NAMES = { edo: 'Edo', kyoto: 'Kyoto', osaka: 'Osaka', nagasaki: 'Nagasaki · Dejima', berlin: 'Berlin', amsterdam: 'Amsterdam', cape: 'The Cape', batavia: 'Batavia', canton: 'Chinese junks', china: 'Chinese junks', paris: 'Paris', marseille: 'Marseille', suez: 'Suez', aden: 'Aden', galle: 'Galle', singapore: 'Singapore', hongkong: 'Hong Kong', sanfrancisco: 'San Francisco', chicago: 'Chicago', boston: 'Boston', yokohama: 'Yokohama', hongo: 'Hongō', koishikawa: 'Koishikawa', kojimachi: 'Kōjimachi', castle: 'Edo Castle', yoshiwara: 'Shin-Yoshiwara', 'yoshiwara-old': 'the old Yoshiwara', 'yoshiwara-gate': 'the quarter’s gate', toriaburacho: 'Tōri Abura-chō', nihonbashi: 'Nihonbashi', sakaicho: 'Sakai-chō', fukiyacho: 'Fukiya-chō', kobikicho: 'Kobiki-chō', saruwakacho: 'Saruwaka-chō', ryogoku: 'Ryōgoku', honjo: 'Honjo', bakurocho: 'Bakuro-chō · Eijudō' };

// ---------------------------------------------------------------- the clock strip
export function clock(tl) {
  if (!tl) return '';
  const x = (y) => 24 + ((y - tl.from) / (tl.to - tl.from)) * (W - 48);
  const y0 = H - 26;
  let s = `<g class="tl"><rect x="0" y="${H - 44}" width="${W}" height="44" class="tl-bg"/>`;
  if (tl.span) s += `<rect x="${x(tl.span[0])}" y="${y0 - 8}" width="${Math.max(2, x(tl.span[1]) - x(tl.span[0]))}" height="16" class="tl-span ${tl.mode === 'held' ? 'held' : ''}"/>`;
  s += `<line x1="24" x2="${W - 24}" y1="${y0}" y2="${y0}" class="tl-axis"/>`;
  for (const t of tl.ticks || []) s += `<line x1="${x(t)}" x2="${x(t)}" y1="${y0 - 6}" y2="${y0 + 6}" class="tl-tick ${tl.cursor != null && t <= tl.cursor ? 'past' : ''}"/>`;
  s += `<text x="24" y="${H - 6}" class="tl-lab">${tl.from}</text><text x="${W - 24}" y="${H - 6}" class="tl-lab" text-anchor="end">${tl.to}</text>`;
  if (tl.cursor != null) s += `<line x1="${x(tl.cursor)}" x2="${x(tl.cursor)}" y1="${y0 - 14}" y2="${y0 + 10}" class="tl-cur"/>`;
  s += '</g>';
  // the readout, top right, in the v4 bar's place
  const ro = tl.readout || (tl.cursor != null ? String(Math.floor(tl.cursor)) : '');
  if (ro) s += `<g class="readout ${tl.mode || ''}" transform="translate(${W - 16},14)"><rect x="${-(ro.length * 9.5 + 16)}" y="-13" width="${ro.length * 9.5 + 20}" height="${tl.mode === 'held' || tl.mode === 'crawl' || tl.era ? 36 : 20}" rx="4" class="ro-bg"/><text text-anchor="end" class="ro-year">${esc(ro)}</text>${tl.era ? `<text text-anchor="end" y="16" class="ro-era">${esc(tl.era)}</text>` : ''}${tl.mode === 'held' ? `<text text-anchor="end" y="16" class="ro-era">clock held</text>` : tl.mode === 'crawl' ? `<text text-anchor="end" y="16" class="ro-era">▮▮ pause</text>` : ''}</g>`;
  return s;
}

// ---------------------------------------------------------------- marks, arcs, overlays
function mark(view, id, state, text) {
  const p = pt(view, id); if (!p) return '';
  const [x, y] = p; const name = text || NAMES[id] || id;
  const lab = state === 'nolabel' ? '' : `<text x="${x + 10}" y="${y + 4}" class="lab ${state}">${esc(name)}</text>`;
  if (state === 'blot') return `<circle cx="${x}" cy="${y}" r="13" class="blot"/>${lab}`;
  if (state === 'pulse') return `<circle cx="${x}" cy="${y}" r="14" class="pulse-ring"/><circle cx="${x}" cy="${y}" r="4.5" class="m ink"/>${lab}`;
  if (state === 'lecture') return `<path d="M${x - 6},${y - 7}h9l3,3v11h-12z M${x + 3},${y - 7}v3h3" class="m-lecture"/>${lab}`;
  if (state === 'holder') return `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" class="m-holder"/>${lab}`;
  if (state === 'person') return `<circle cx="${x}" cy="${y}" r="7" class="m-person"/><text x="${x}" y="${y + 3}" class="m-person-t" text-anchor="middle">人</text>${lab}`;
  if (state === 'half') return `<circle cx="${x}" cy="${y}" r="4.5" class="m ink"/><path d="M${x - 4.5},${y}a4.5,4.5 0 0 0 9,0z" class="m-half"/>${lab}`;
  if (state === 'nolabel') return `<circle cx="${x}" cy="${y}" r="4.5" class="m ink"/>`;
  if (state === 'palen') return `<circle cx="${x}" cy="${y}" r="3.5" class="m pale"/>`;
  return `<circle cx="${x}" cy="${y}" r="${state === 'pale' ? 3.5 : 4.5}" class="m ${state}"/>${lab}`;
}
function arc(view, key, state, rider) {
  const a = arcOf(view, key); if (!a) return '';
  let s = state === 'repeat' ? `<path d="${a.d}" class="arc dim"/><path d="${a.d}" class="arc repeat"/><path d="${a.d}" class="arc repeat r2"/>` : `<path d="${a.d}" class="arc ${state}"/>`;
  if (rider && a.mid) s += glyph(rider, a.mid[0], a.mid[1]);
  return s;
}
export function frameSVG(fr, i = 0) {
  const v = fr.view;
  let inner = '';
  if (v === 'stage') {
    inner += `<rect width="${W}" height="${H}" class="paper"/>`;
    if (fr.img === 'layers') inner += [0, 1, 2, 3, 4].map((k) => `<image href="img/wave-p${k}.webp" x="${60 + k * 70}" y="${30 + k * 14}" width="420" height="282" class="layer"/>`).join('');
    else if (fr.img) inner += `<image href="${fr.img}" x="110" y="24" width="420" height="282" preserveAspectRatio="xMidYMid meet"/>`;
  } else if (v === 'sheet') {
    inner += `<image href="img/sheet59.webp" x="${SHEET.dx}" y="${SHEET.dy}" width="${SHEET.w}" height="${SHEET.h}" opacity=".9"/>`;
  } else if (v === 'timeline') {
    inner += `<rect width="${W}" height="${H}" class="paper"/>` + lanes(fr);
  } else if (v.startsWith('o-')) {
    const o = F.ortho[v];
    inner += `<rect width="${W}" height="${H}" class="paper"/><use href="#osph-${v}"/><use href="#ogra-${v}"/><use href="#oland-${v}"/>`;
    if (fr.keepBox) inner += `<rect x="${W * 0.2}" y="${H * 0.2}" width="${W * 0.6}" height="${H * 0.6}" class="keep"/>`;
  } else {
    inner += `<rect width="${W}" height="${H}" class="paper"/>`;
    if (fr.globe) inner += `<rect width="${W}" height="${H}" class="globe-wash"/>`;
    inner += `<use href="#land-${v}"/>`;
  }
  if (fr.mask) {
    const id = `mask-${i}-${Math.random().toString(36).slice(2, 7)}`;
    const P = pt(v, fr.mask); if (P) inner += `<defs><mask id="${id}"><rect width="${W}" height="${H}" fill="white"/><circle cx="${P[0]}" cy="${P[1]}" r="${fr.maskR || 70}" fill="black"/></mask></defs><rect width="${W}" height="${H}" class="focus-mask" mask="url(#${id})"/>`;
  }
  for (const [k, st, rider] of fr.arcs || []) inner += arc(v, k, st, rider);
  for (const [id, st, text] of fr.marks || []) inner += mark(v, id, st, text);
  for (const [g, id, dx, dy] of fr.glyphs || []) { const P = pt(v, id); if (P) inner += glyph(g, P[0] + (dx || 0), P[1] + (dy || 0), g === 'flame' ? 34 : 26); }
  let clipG = '';
  if (fr.zoom) { const P = pt(v, fr.zoom[0]); const k = fr.zoom[1]; if (P) clipG = `transform="translate(${P[0] - P[0] * k},${P[1] - P[1] * k}) scale(${k})"`; }
  let over = '';
  if (fr.inset) over += `<g class="inset" transform="translate(16,16)"><circle cx="40" cy="40" r="40"/><use href="#land-world" transform="translate(0,0) scale(.125)"/><circle cx="${fr.inset[0]}" cy="${fr.inset[1]}" r="5" class="inset-dot"/></g>`;
  if (fr.card) over += `<g class="card" transform="translate(28,${fr.cardY ?? 40})"><rect width="300" height="86" rx="6"/><text x="14" y="26" class="card-k">${esc(fr.card[0])}</text><text x="14" y="50" class="card-t">${esc(fr.card[1]).slice(0, 44)}</text>${fr.card[1].length > 44 ? `<text x="14" y="66" class="card-t">${esc(fr.card[1]).slice(44, 90)}</text>` : ''}<text x="14" y="${fr.card[1].length > 44 ? 80 : 68}" class="card-s">${esc(fr.card[2])}</text></g>`;
  if (fr.counter) over += `<g class="card" transform="translate(${W - 220},40)"><rect width="190" height="56" rx="6"/><text x="14" y="30" class="counter">${esc(fr.counter[0])}</text><text x="14" y="48" class="card-s">${esc(fr.counter[1])}</text></g>`;
  if (fr.price) over += `<g class="price" transform="translate(${W - 200},40)"><rect width="172" height="70" rx="6"/><text x="10" y="18" class="card-s">${esc(fr.priceLabel || '')}</text><path d="M14,30 L84,30 L164,56" class="price-line"/><text x="14" y="50" class="card-k">${fr.price[0]}</text><text x="164" y="52" class="card-k" text-anchor="end">${fr.price[1]}</text></g>`;
  if (fr.cap) over += `<g class="capslot" transform="translate(16,${H - 86})"><rect width="${Math.min(W - 32, fr.cap.length * 6.4 + 24)}" height="30" rx="6"/><text x="12" y="20" class="cap-t">${esc(fr.cap)}</text></g>`;
  if (fr.honesty) over += `<text x="16" y="${H - 50}" class="honesty">${esc(fr.honesty)}</text>`;
  if (fr.stepper) over += `<g class="stepper" transform="translate(${W / 2 - 80},${H - 76})"><rect width="160" height="26" rx="13"/><text x="22" y="18" class="card-t">‹</text><text x="80" y="18" class="card-t" text-anchor="middle">▮▮ pause</text><text x="140" y="18" class="card-t">›</text></g>`;
  if (fr.links) over += fr.links.map((l, k) => `<g class="link" transform="translate(28,${H - 64 - k * 32})"><rect width="${l.length * 7 + 20}" height="26" rx="13"/><text x="10" y="17" class="card-t">${esc(l)}</text></g>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(fr.alt || fr.caption || '')}"><g ${clipG}>${inner}</g>${over}${clock(fr.tl)}</svg>`;
}
// a schematic lane chart (state, publishers, prints, world, afterlife) for timeline frames
function lanes(fr) {
  const L = ['The state', 'Publishers', 'Prints', 'The world', 'Afterlife'];
  const x = (y) => 24 + ((y - fr.tl.from) / (fr.tl.to - fr.tl.from)) * (W - 48);
  let s = '';
  L.forEach((l, i) => { const y = 60 + i * 52; s += `<line x1="24" x2="${W - 24}" y1="${y}" y2="${y}" class="lane"/><text x="24" y="${y - 8}" class="lane-l">${l}</text>`; });
  for (const [yr, lane, label, st] of fr.events || []) { const y = 60 + lane * 52; s += `<circle cx="${x(yr)}" cy="${y}" r="${st === 'pulse' ? 7 : 5}" class="ev ${st || ''}"/>${label ? `<text x="${x(yr)}" y="${y - 12}" class="lab ${st || ''}" text-anchor="middle">${esc(label)}</text>` : ''}`; }
  if (fr.priceLane) { const [a, b] = fr.priceLane; const y = 60 + 2 * 52 + 20; s += `<path d="M${x(a[0])},${y - a[1]} L${x(b[0]) - 2},${y - a[1]} L${x(b[0])},${y - b[1]} L${W - 24},${y - b[1]}" class="price-line"/><text x="${x(a[0]) + 4}" y="${y - a[1] - 6}" class="lab">${a[1]} mon</text>${b[1] !== a[1] ? `<text x="${x(b[0]) + 6}" y="${y - b[1] + 14}" class="lab">${b[1]} mon</text>` : ''}`; }
  if (fr.bubble) { const [yr, r, label] = fr.bubble; s += `<circle cx="${x(yr)}" cy="${60 + 2 * 52}" r="${r}" class="bubble"/><text x="${x(yr)}" y="${60 + 2 * 52 - r - 6}" class="lab" text-anchor="middle">${esc(label)}</text>`; }
  return s;
}

// ---------------------------------------------------------------- markdown (the subset the study files use)
export function inline(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/`(.+?)`/g, '<code>$1</code>'); }
export function md(src) {
  const lines = src.split('\n'); const out = []; let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) { const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++; out.push(`<pre class="code">${esc(buf.join('\n'))}</pre>`); continue; }
    if (/^#{1,3} /.test(l)) { const n = l.match(/^#+/)[0].length; const t = l.replace(/^#+ /, ''); const id = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); out.push(`<h${n} id="${id}">${inline(t)}</h${n}>`); i++; continue; }
    if (/^\|/.test(l)) { const rows = []; while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]); const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()); const head = cells(rows[0]); const body = rows.slice(2).map(cells); out.push(`<div class="tw"><table><thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c, k) => `<td${k === 0 ? ' class="first"' : ''}>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`); continue; }
    if (/^\d+\. /.test(l)) { const items = []; while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(lines[i++].replace(/^\d+\. /, '')); out.push(`<ol>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ol>`); continue; }
    if (/^- /.test(l)) { const items = []; while (i < lines.length && /^- /.test(lines[i])) items.push(lines[i++].replace(/^- /, '')); out.push(`<ul>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>`); continue; }
    if (l.trim() === '') { i++; continue; }
    const para = []; while (i < lines.length && lines[i].trim() !== '' && !/^(#|\||\d+\. |- |```)/.test(lines[i])) para.push(lines[i++]);
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}
export const landDefs = () => `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${Object.entries(F.views).map(([k, v]) => `<path id="land-${k}" d="${v.land}" class="land"/>`).join('')}${Object.entries(F.ortho).map(([k, o]) => `<path id="osph-${k}" d="${o.sphere}" class="sphere"/><path id="ogra-${k}" d="${o.grat}" class="grat"/><path id="oland-${k}" d="${o.land}" class="land"/>`).join('')}</defs></svg>`;
export function stripHost(page) {
  return page.replace(/<!doctype html>\s*/i, '').replace(/<\/?html[^>]*>\s*/g, '').replace(/<\/?head>\s*/g, '').replace(/<body>\s*/, '').replace(/<\/body>\s*/, '').replace(/<meta charset[^>]*>\s*/, '').replace(/<meta name="viewport"[^>]*>\s*/, '');
}

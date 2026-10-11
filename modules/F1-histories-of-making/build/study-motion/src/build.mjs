// Builds the study page: STUDY.md rendered to HTML, with the eight storyboards drawn as SVG frames after their headings.
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'fs';
import { STORYBOARDS } from './storyboards.mjs';
const F = JSON.parse(readFileSync(new URL('./frames.json', import.meta.url)));
const MD = readFileSync('/home/claude/creative-world/modules/F1-histories-of-making/research_notes/Motion layers and focus/STUDY.md', 'utf8');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const W = F.W, H = F.H;

// ------------------------------------------------------------ frame drawing
const SHEET = { w: 600, h: 537, dy: -100, dx: 20 }; // the 1859 sheet drawn at 640 wide; shifted so the castle–Asakusa stretch is in view
function sheetPt(id) { const p = F.sheet.places[id]; return [p[0] * SHEET.w + SHEET.dx, p[1] * SHEET.h + SHEET.dy]; }
function pt(view, id) { return view === 'sheet' ? sheetPt(id) : F.views[view]?.places[id]; }
function arcPath(view, key) {
  if (view === 'sheet') { const [a, b] = key.split('>'); const A = sheetPt(a), B = sheetPt(b); const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2 - 18; return `M${A.join(',')}Q${mx},${my} ${B.join(',')}`; }
  return F.arcs[view]?.[key];
}
const NAMES = { edo: 'Edo', kyoto: 'Kyoto', osaka: 'Osaka', nagasaki: 'Nagasaki', berlin: 'Berlin', amsterdam: 'Amsterdam', cape: 'The Cape', batavia: 'Batavia', canton: 'Canton', paris: 'Paris', marseille: 'Marseille', sanfrancisco: 'San Francisco', chicago: 'Chicago', boston: 'Boston', yokohama: 'Yokohama', hongo: 'Hongō', koishikawa: 'Koishikawa', kojimachi: 'Kōjimachi', castle: 'Edo Castle', yoshiwara: 'Shin-Yoshiwara', 'yoshiwara-old': 'the old Yoshiwara', 'yoshiwara-gate': 'the quarter’s gate', toriaburacho: 'Tōri Abura-chō', nihonbashi: 'Nihonbashi', sakaicho: 'Sakai-chō', fukiyacho: 'Fukiya-chō', kobikicho: 'Kobiki-chō', saruwakacho: 'Saruwaka-chō' };

function timeline(tl) {
  if (!tl) return '';
  const x = (y) => 24 + ((y - tl.from) / (tl.to - tl.from)) * (W - 48);
  const y0 = H - 26;
  let s = `<g class="tl"><rect x="0" y="${H - 44}" width="${W}" height="44" class="tl-bg"/>`;
  if (tl.span) s += `<rect x="${x(tl.span[0])}" y="${y0 - 8}" width="${x(tl.span[1]) - x(tl.span[0])}" height="16" class="tl-span"/>`;
  s += `<line x1="24" x2="${W - 24}" y1="${y0}" y2="${y0}" class="tl-axis"/>`;
  for (const t of tl.ticks || []) s += `<line x1="${x(t)}" x2="${x(t)}" y1="${y0 - 6}" y2="${y0 + 6}" class="tl-tick ${t <= tl.cursor ? 'past' : ''}"/>`;
  s += `<text x="24" y="${H - 6}" class="tl-lab">${tl.from}</text><text x="${W - 24}" y="${H - 6}" class="tl-lab" text-anchor="end">${tl.to}</text>`;
  if (tl.cursor != null) s += `<line x1="${x(tl.cursor)}" x2="${x(tl.cursor)}" y1="${y0 - 14}" y2="${y0 + 10}" class="tl-cur"/><text x="${x(tl.cursor)}" y="${H - 6}" class="tl-year" text-anchor="middle">${Math.floor(tl.cursor)}</text>`;
  return s + '</g>';
}
function mark(view, id, state) {
  const p = pt(view, id); if (!p) return '';
  const [x, y] = p; const name = NAMES[id] || id;
  const lab = `<text x="${x + 9}" y="${y + 4}" class="lab ${state}">${esc(name)}</text>`;
  if (state === 'blot') return `<circle cx="${x}" cy="${y}" r="13" class="blot"/>${lab}`;
  if (state === 'pulse') return `<circle cx="${x}" cy="${y}" r="14" class="pulse-ring"/><circle cx="${x}" cy="${y}" r="4.5" class="m ink"/>${lab}`;
  if (state === 'half') return `<circle cx="${x}" cy="${y}" r="4.5" class="m ink"/><path d="M${x - 4.5},${y}a4.5,4.5 0 0 0 9,0z" class="m-half"/>${lab}`;
  return `<circle cx="${x}" cy="${y}" r="${state === 'pale' ? 3.5 : 4.5}" class="m ${state}"/>${lab}`;
}
function arc(view, key, state) {
  const d = arcPath(view, key); if (!d) return '';
  if (state === 'repeat') return `<path d="${d}" class="arc dim"/><path d="${d}" class="arc repeat"/><path d="${d}" class="arc repeat r2"/>`;
  return `<path d="${d}" class="arc ${state}"/>`;
}
function frameSVG(fr, i) {
  const v = fr.view;
  let inner = '';
  let clipG = '';
  if (v === 'stage') {
    inner += `<rect width="${W}" height="${H}" class="paper"/>`;
    if (fr.img === 'layers') inner += [0, 1, 2, 3, 4].map((k) => `<image href="img/wave-p${k}.webp" x="${60 + k * 70}" y="${30 + k * 14}" width="420" height="282" class="layer"/>`).join('');
    else inner += `<image href="${fr.img}" x="110" y="24" width="420" height="282" preserveAspectRatio="xMidYMid meet"/>`;
  } else if (v === 'sheet') {
    inner += `<image href="img/sheet59.webp" x="${SHEET.dx}" y="${SHEET.dy}" width="${SHEET.w}" height="${SHEET.h}" opacity=".9"/>`;
  } else {
    inner += `<rect width="${W}" height="${H}" class="paper"/>`;
    if (fr.globe) inner += `<rect width="${W}" height="${H}" class="globe-wash"/>`;
    inner += `<use href="#land-${v}"/>`;
  }
  if (fr.mask) {
    const id = `mask-${fr.view}-${i}-${Math.random().toString(36).slice(2, 7)}`;
    let hole = '';
    if (fr.mask === 'route') { const A = pt(v, 'berlin'), B = pt(v, 'edo'); hole = `<rect x="${Math.min(A[0], B[0]) - 40}" y="${Math.min(A[1], B[1]) - 40}" width="${Math.abs(A[0] - B[0]) + 80}" height="${Math.abs(A[1] - B[1]) + 200}" rx="40" fill="black"/>`; }
    else { const P = pt(v, fr.mask); hole = `<circle cx="${P[0]}" cy="${P[1]}" r="70" fill="black"/>`; }
    inner += `<defs><mask id="${id}"><rect width="${W}" height="${H}" fill="white"/>${hole}</mask></defs><rect width="${W}" height="${H}" class="focus-mask" mask="url(#${id})"/>`;
  }
  for (const [k, st] of fr.arcs || []) inner += arc(v, k, st);
  for (const [id, st] of fr.marks || []) inner += mark(v, id, st);
  if (fr.zoom) { const P = pt(v, fr.zoom[0]); const k = fr.zoom[1]; clipG = `transform="translate(${P[0] - P[0] * k},${P[1] - P[1] * k}) scale(${k})"`; }
  let over = '';
  if (fr.card) over += `<g class="card" transform="translate(28,${fr.view === 'stage' ? 300 : 40})"><rect width="300" height="86" rx="6"/><text x="14" y="26" class="card-k">${esc(fr.card[0])}</text><text x="14" y="50" class="card-t">${esc(fr.card[1]).slice(0, 44)}</text>${fr.card[1].length > 44 ? `<text x="14" y="66" class="card-t">${esc(fr.card[1]).slice(44, 90)}</text>` : ''}<text x="14" y="${fr.card[1].length > 44 ? 80 : 68}" class="card-s">${esc(fr.card[2])}</text></g>`;
  if (fr.person) over += `<g class="card" transform="translate(28,40)"><rect width="230" height="58" rx="6"/><rect x="10" y="10" width="38" height="38" class="port"/><text x="58" y="28" class="card-t">${esc(fr.person[0])}</text><text x="58" y="46" class="card-s">${esc(fr.person[1])}</text></g>`;
  if (fr.price) over += `<g class="price" transform="translate(${W - 200},30)"><rect width="172" height="70" rx="6"/><text x="10" y="18" class="card-s">${esc(fr.priceLabel || "Nagasaki price, monme a kin")}</text><path d="M14,30 L${14 + 70},30 L${14 + 150},56" class="price-line"/><text x="14" y="50" class="card-k">${fr.price[0][1]}</text><text x="${14 + 150}" y="52" class="card-k" text-anchor="end">${fr.price[1][1]}</text></g>`;
  if (fr.bubble) over += `<g transform="translate(${W - 150},70)"><circle r="42" class="bubble"/><text y="4" class="card-t" text-anchor="middle">${esc(fr.bubble[0])}</text></g>`;
  if (fr.counter) over += `<g class="card" transform="translate(${W - 220},30)"><rect width="190" height="56" rx="6"/><text x="14" y="30" class="counter">${esc(fr.counter[0])}</text><text x="14" y="48" class="card-s">${esc(fr.counter[1])}</text></g>`;
  if (fr.menu) over += `<g class="menu" transform="translate(${W - 230},26)"><rect width="206" height="${18 + fr.menu.length * 22}" rx="6"/>${fr.menu.map((m, k) => `<text x="12" y="${22 + k * 22}" class="${k === 0 ? 'card-s' : k === 2 ? 'menu-on' : 'card-t'}">${esc(m)}</text>`).join('')}</g>`;
  if (fr.stepper) over += `<g class="stepper" transform="translate(${W / 2 - 80},${H - 76})"><rect width="160" height="26" rx="13"/><text x="22" y="18" class="card-t">‹</text><text x="80" y="18" class="card-t" text-anchor="middle">▮▮ pause</text><text x="140" y="18" class="card-t">›</text></g>`;
  if (fr.links) over += fr.links.map((l, k) => `<g class="link" transform="translate(28,${H - 64 - k * 32})"><rect width="${l.length * 7 + 20}" height="26" rx="13"/><text x="10" y="17" class="card-t">${esc(l)}</text></g>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(fr.caption)}"><g ${clipG}>${inner}</g>${over}${timeline(fr.tl)}</svg>`;
}
function storyboardHTML(sb) {
  return `<figure class="sb" id="sb-${sb.id}" data-sb="${sb.id}">
    <div class="sb-head"><span class="kind">Moment ${esc(sb.kind)}</span><span class="surf">${esc(sb.surface)}</span><button type="button" class="btn small" data-watch="${sb.id}">Watch at pace</button></div>
    <div class="frames">${sb.frames.map((fr, i) => `<div class="frame"><div class="fr-img">${frameSVG(fr, i)}</div><p class="fr-cap"><b>${i + 1}</b> <span class="dur">${esc(fr.dur)}</span> ${esc(fr.caption)}</p></div>`).join('')}</div>
  </figure>`;
}

// ------------------------------------------------------------ markdown → html (the subset STUDY.md uses)
function inline(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/`(.+?)`/g, '<code>$1</code>'); }
function md(src) {
  const lines = src.split('\n'); const out = []; let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^#{1,3} /.test(l)) { const n = l.match(/^#+/)[0].length; const t = l.replace(/^#+ /, ''); const id = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); out.push(`<h${n} id="${id}">${inline(t)}</h${n}>`); i++; continue; }
    if (/^\|/.test(l)) { const rows = []; while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]); const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()); const head = cells(rows[0]); const body = rows.slice(2).map(cells); out.push(`<div class="tw"><table><thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c, k) => `<td${k === 0 ? ' class="first"' : ''}>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`); continue; }
    if (/^\d+\. /.test(l)) { const items = []; while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(lines[i++].replace(/^\d+\. /, '')); out.push(`<ol>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ol>`); continue; }
    if (/^- /.test(l)) { const items = []; while (i < lines.length && /^- /.test(lines[i])) items.push(lines[i++].replace(/^- /, '')); out.push(`<ul>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>`); continue; }
    if (l.trim() === '') { i++; continue; }
    const para = []; while (i < lines.length && lines[i].trim() !== '' && !/^(#|\||\d+\. |- )/.test(lines[i])) para.push(lines[i++]);
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}
let body = md(MD);
// drop the markdown's own title and lead (the page has its own) and insert the storyboards after each S-heading's list
body = body.replace(/^<h1[^>]*>.*?<\/h1>\n<p>.*?<\/p>\n/s, '');
for (const sb of STORYBOARDS) {
  const re = new RegExp(`(<h3 id="s${sb.id.slice(1)}-[^"]*">.*?</h3>\\n<ol>.*?</ol>\\n(?:<p>Needs:.*?</p>\\n)?)`, 's');
  body = body.replace(re, (m) => m + storyboardHTML(sb) + '\n');
}
body = body.replace(/<h2 id="(\d+)-([^"]*)">/g, (m, n, rest) => `<h2 id="s-${n}" data-n="${n}">`);

const defs = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${Object.entries(F.views).map(([k, v]) => `<path id="land-${k}" d="${v.land}" class="land"/>`).join('')}</defs></svg>`;
const toc = [['s-1', 'Decisions'], ['s-2', 'What moves'], ['s-3', 'Moment grammar'], ['s-4', 'Layers'], ['s-5', 'The clock'], ['s-6', 'Pacing'], ['s-7', 'Storyboards'], ['s-8', 'Surfaces'], ['s-9', 'Build order'], ['s-10', 'Open questions']];

const CSS = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
const JS = readFileSync(new URL('./page.js', import.meta.url), 'utf8');
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Edo Motion Study</title>
<link rel="icon" href="data:,">
<meta name="description" content="Where animation belongs in the Edo unit and the Atlas: moment grammar, layers, the timeline as the clock, pacing, eight storyboards and a build order.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap">
<style>${CSS}</style>
</head>
<body>
${defs}
<header class="top"><a class="brand" href="#top">動 <span>Edo: motion, layers and focus</span></a><nav class="toc" aria-label="Sections">${toc.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav><button type="button" class="icon-btn" id="themeBtn" aria-label="Switch colour theme">◐</button></header>
<main id="top">
<section class="lead"><p class="eyebrow">Study · 12 October 2026 · before any build</p><h1>Where the animation belongs</h1><p class="lede">The 3D overture opened the unit with motion that explained nothing. This study moves the budget to the moments that need it, names the layers the globe and map carry, makes the timeline the only clock, and sets the pace. Eight storyboards show it; a build order ends it.</p>
<div class="keys"><div><b>6</b><span>kinds of moment, and most beats are the sixth: still</span></div><div><b>47 / 71</b><span>story beats that should not move at all</span></div><div><b>20 + 96</b><span>journeys and events to carry as data, as two new layers</span></div><div><b>1</b><span>clock: the lane chart's cursor drives every map and widget</span></div></div></section>
${body}
<footer class="foot"><p>Inputs: <code>inventory.md</code>, <code>atlas_audit.md</code>, <code>references.md</code> in <code>research_notes/Motion layers and focus/</code>. Map outlines: Natural Earth via world-atlas (public domain). The 1859 sheet: Library of Congress, public domain. Prints: the Metropolitan Museum of Art, CC0.</p></footer>
</main>
<dialog id="watch" class="watch" aria-label="Storyboard at pace"><div class="w-bar"><p id="wTitle"></p><div class="w-ctl"><button type="button" class="btn small" id="wPrev" aria-label="Previous frame">‹</button><button type="button" class="btn small" id="wPlay" aria-pressed="false">Play</button><button type="button" class="btn small" id="wNext" aria-label="Next frame">›</button><form method="dialog"><button class="btn small" value="close">Close ✕</button></form></div></div><div class="w-stage" id="wStage"></div><p class="w-cap" id="wCap" aria-live="polite"></p><div class="w-bar2"><span id="wPos"></span><span class="w-prog"><i id="wProg"></i></span></div></dialog>
<script>${JS}</script>
</body>
</html>`;
mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', page);
let p = page.replace(/<!doctype html>\s*/i, '').replace(/<\/?html[^>]*>\s*/g, '').replace(/<\/?head>\s*/g, '').replace(/<body>\s*/, '').replace(/<\/body>\s*/, '').replace(/<meta charset[^>]*>\s*/, '').replace(/<meta name="viewport"[^>]*>\s*/, '');
writeFileSync('dist/page.html', p);
cpSync('public/img', 'dist/img', { recursive: true });
console.log('dist/index.html', (page.length / 1024).toFixed(0), 'KB');

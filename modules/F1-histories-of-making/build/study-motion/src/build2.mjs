// Builds the second study page, "Edo Scene Framework": the ranking, the treatments, four drawn scenes, the framework
// (camera, clock, highlight vocabulary, glyphs, labels, templates), the beats study and the editorial process.
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { F, W, H, esc, glyph, glyphDefs, GLYPHS, frameSVG, clock, landDefs, md, stripHost } from './draw.mjs';
import { DRAWN } from './scenes2.mjs';
const R = '/home/claude/creative-world/modules/F1-histories-of-making/research_notes/Motion layers and focus/';
const S = JSON.parse(readFileSync(R + 'scenes.json', 'utf8'));
const FRAME = readFileSync(R + 'FRAMEWORK.md', 'utf8');
const BEATS = readFileSync(R + 'beats_study.md', 'utf8');
const EDIT = readFileSync(R + 'editorial_process.md', 'utf8');
const treatments = Array.isArray(S.treatments) ? S.treatments : Object.values(S.treatments);
const T = (id) => treatments.find((t) => t.id === id);

// ------------------------------------------------------------ 1. ranking
const scoreOf = (kind, id) => (S.ranking[kind === 'journey' ? 'journeys' : 'groups'] || {})[id];
const CRIT = ['a_significance', 'b_density', 'c_assets', 'd_visual', 'e_sourcing'];
const CRITL = ['Significance', 'Density', 'Assets', 'Visual', 'Sourcing'];
const dots = (n) => `<span class="dots" aria-label="${n} of 3">${[0, 1, 2].map((i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;
const rankingHTML = `<div class="tw"><table class="rank"><thead><tr><th>#</th><th>Item</th><th>Kind</th>${CRITL.map((c) => `<th>${c}</th>`).join('')}<th>Total</th><th>Verdict</th></tr></thead><tbody>${S.ranking.sorted.map((r, i) => {
  const x = scoreOf(r.kind, r.id) || {}; const sc = x.scores || {};
  const verdict = x.verdict || ''; const reason = x.reason || '';
  return `<tr class="${verdict === 'scene' ? 'is-scene' : ''}"><td>${i + 1}</td><td class="first">${esc(r.id)}</td><td>${esc(r.kind)}</td>${CRIT.map((c) => `<td>${dots(sc[c] ?? 0)}</td>`).join('')}<td><b>${r.total}</b></td><td>${esc(verdict)}${reason ? ` <span class="muted">· ${esc(reason)}</span>` : ''}</td></tr>`;
}).join('')}</tbody></table></div>`;

// ------------------------------------------------------------ 2. treatments
const GLYPH_WORDS = Object.keys(GLYPHS);
function treatmentCard(t) {
  const demands = t.demands || [];
  const shots = t.shots || [];
  const used = new Set();
  for (const s of shots) for (const g of s.micro_elements || []) { const w = GLYPH_WORDS.find((k) => g.toLowerCase().includes(k === 'sealcut' ? 'cut' : k === 'soba' ? 'soba' : k)); if (w) used.add(w); }
  const honesty = (t.risks || []).map((r) => (typeof r === 'string' ? r : r.text || r.risk || JSON.stringify(r))).slice(0, 3);
  return `<article class="treat" id="treat-${t.id}">
    <div class="treat-head"><span class="kind">${esc(t.id)} · ${esc(t.kind)}</span><h3>${esc(t.title)}</h3><p class="span">${Array.isArray(t.span) ? t.span.join('–') : esc(t.span)} · ${shots.length} shots · ${(t.told_in?.stations || []).length} lecture stations · ${(t.told_in?.beats || []).length} beats</p></div>
    <p class="understand">${esc(t.understand || '')}</p>
    <h4>What the content demands</h4>
    <ul class="demands">${demands.slice(0, 6).map((d) => `<li><q>${esc(d.quote)}</q><span class="dem"><b>${esc(d.element)}</b> · ${esc(d.surface)} · ${esc(String(Array.isArray(d.date) ? d.date.join('–') : d.date))}</span></li>`).join('')}</ul>
    <div class="treat-foot">${[...used].length ? `<span class="glyrow">${[...used].map((g) => `<svg viewBox="0 0 24 24" class="gsm"><use href="#g-${g}"/></svg>`).join('')}</span>` : ''}${t.interactions?.guess ? `<span class="chip">guess: ${esc(t.interactions.guess.beat || t.interactions.guess)}</span>` : '<span class="chip">no guess</span>'}${t.ends_on ? `<span class="chip">ends on ${esc(typeof t.ends_on === 'string' ? t.ends_on : t.ends_on.object || '')}</span>` : ''}</div>
    ${honesty.length ? `<p class="honesty-l"><b>Risks:</b> ${honesty.map(esc).join(' · ')}</p>` : ''}
  </article>`;
}

// ------------------------------------------------------------ 3. drawn scenes
function drawn(sb) {
  return `<figure class="sb" id="sb-${sb.id}" data-sb="${sb.id}">
    <div class="sb-head"><span class="kind">${esc(sb.id)} · ${esc(sb.kind)}</span><span class="surf">${esc(sb.surface)}</span><button type="button" class="btn small" data-watch="${sb.id}">Watch at pace</button></div>
    <div class="frames six">${sb.frames.map((fr, i) => `<div class="frame"><div class="fr-img">${frameSVG(fr, i)}</div><p class="fr-cap"><b>${i + 1}</b> <span class="dur">${esc(fr.dur)}</span> ${esc(fr.caption)}</p></div>`).join('')}</div>
  </figure>`;
}

// ------------------------------------------------------------ 4. framework panels
const vocab = [
  ['Journey', 'indigo line, glyph riding it, dated stops solid, undated dashed', `<path d="M10,40 Q60,10 110,40" class="arc dashed"/><path d="M110,40 Q150,60 190,30" class="arc"/><circle cx="10" cy="40" r="4.5" class="m ink"/><circle cx="110" cy="40" r="4.5" class="m ink"/><circle cx="190" cy="30" r="4.5" class="m ink"/>${glyph('ship', 150, 42, 24)}`],
  ['Incident', 'seal-red pulse once, settles to a dot; approximate places are blots', `<circle cx="60" cy="36" r="14" class="pulse-ring"/><circle cx="60" cy="36" r="4.5" class="m ink"/><circle cx="140" cy="36" r="13" class="blot"/><text x="80" y="40" class="lab">Kōjimachi</text>`],
  ['Lecture place', 'a folded-paper mark; opens the lecture', `<path d="M54,24h9l3,3v11h-12z M63,24v3h3" class="m-lecture"/><text x="74" y="36" class="lab">L5 · Blue</text>`],
  ['Object holder', 'a pale frame; opens the object', `<rect x="54" y="24" width="12" height="12" class="m-holder"/><text x="74" y="36" class="lab pale">The Met</text>`],
  ['Person', 'the v4 chip; opens the character sheet', `<circle cx="60" cy="32" r="7" class="m-person"/><text x="60" y="35" class="m-person-t" text-anchor="middle">人</text><text x="74" y="36" class="lab">Tsutaya Jūzaburō</text>`],
  ['Mentioned place', 'pale hollow dot, no label until tapped', `<circle cx="60" cy="32" r="3.5" class="m pale"/><circle cx="110" cy="40" r="3.5" class="m pale"/><circle cx="150" cy="28" r="3.5" class="m pale"/>`],
];
const vocabHTML = `<div class="vocab">${vocab.map(([k, d, svg]) => `<div class="vo"><svg viewBox="0 0 200 60" aria-hidden="true"><rect width="200" height="60" class="paper"/>${svg}</svg><b>${k}</b><span>${d}</span></div>`).join('')}</div>`;

const clocks = [
  ['point', { from: 1838, to: 1850, cursor: 1842.5, readout: '1842 · Tenpō 13', mode: 'point', ticks: [1842.5] }, 'one dated tick'],
  ['span', { from: 1700, to: 1840, cursor: null, readout: '1704–1824', mode: 'span', span: [1704, 1824] }, 'undated legs between two dated ends; the bar shows the extent, the readout does not move'],
  ['step', { from: 1700, to: 1840, cursor: 1826, readout: '1824 → 1828', mode: 'step', ticks: [1824, 1825, 1826, 1827, 1828] }, 'a dated run; one year per tick, 1–2 s each'],
  ['crawl', { from: 1860, to: 1900, cursor: 1890, readout: '1884 → 1895', mode: 'crawl', span: [1884, 1895] }, 'a long span with a count; the year advances with a pause bar; the counter rides the caption'],
  ['held', { from: 1820, to: 1840, cursor: 1833, readout: '1833', mode: 'held', span: [1833, 1834] }, 'a spatial stepper with nothing dated; the readout says “clock held”'],
];
const clocksHTML = `<div class="clocks">${clocks.map(([k, tl, d]) => `<div class="ck"><svg viewBox="0 ${H - 60} ${W} 60" aria-hidden="true"><rect y="${H - 60}" width="${W}" height="60" class="paper"/>${clock(tl).replace(/translate\(624,14\)/, `translate(624,${H - 46})`)}</svg><b>${k}</b><span>${d}</span></div>`).join('')}</div>`;

const glyphsHTML = `<div class="glyphs">${Object.entries(GLYPHS).map(([id, g]) => `<div class="gl-card"><svg viewBox="0 0 24 24" class="glg"><use href="#g-${id}"/></svg><b>${esc(g.label)}</b></div>`).join('')}</div>`;

const labelsHTML = `<div class="labels-demo"><div><svg viewBox="200 120 240 150" aria-hidden="true"><image href="img/sheet59.webp" x="20" y="-100" width="600" height="537" opacity=".9"/><circle cx="304" cy="196" r="4.5" class="m ink"/><text x="314" y="200" class="lab">Sakai-chō</text><circle cx="301" cy="201" r="4.5" class="m ink"/><text x="311" y="205" class="lab bad">Fukiya-chō</text><circle cx="266" cy="187" r="4.5" class="m ink"/><text x="276" y="191" class="lab">Kobiki-chō</text></svg><b>Wrong</b><span>Two labels for places 5 px apart: they overlap. Every place a lecture mentions is labelled.</span></div>
<div><svg viewBox="200 120 240 150" aria-hidden="true"><image href="img/sheet59.webp" x="20" y="-100" width="600" height="537" opacity=".9"/><circle cx="304" cy="196" r="4.5" class="m ink"/><circle cx="301" cy="201" r="4.5" class="m ink"/><line x1="306" y1="194" x2="330" y2="176" class="leader"/><text x="333" y="176" class="lab">Sakai-chō · Fukiya-chō</text><circle cx="266" cy="187" r="3.5" class="m pale"/></svg><b>Right</b><span>One shared leader and one label for the close pair; the third theatre stays pale until its own leg draws.</span></div></div>`;

// ------------------------------------------------------------ assemble the framework text with panels inserted
let frame = md(FRAME).replace(/^<h1[^>]*>.*?<\/h1>\n<p>.*?<\/p>\n/s, '');
const insertAfterH2 = (html, idPrefix, panel) => html.replace(new RegExp(`(<h2 id="${idPrefix}[^"]*">.*?</h2>\\n)`, 's'), (m) => m + panel + '\n');
frame = insertAfterH2(frame, '3-the-clock', clocksHTML);
frame = insertAfterH2(frame, '4-the-highlight-vocabulary', vocabHTML);
frame = insertAfterH2(frame, '5-the-glyph-library', glyphsHTML);
frame = insertAfterH2(frame, '6-labels', labelsHTML);
frame = frame.replace(/<h2 id="(\d+)-([^"]*)">/g, (m, n) => `<h2 id="f-${n}">`);

const beatsHTML = md(BEATS).replace(/^<h1[^>]*>.*?<\/h1>\n/s, '').replace(/<h2 /g, '<h3 ').replace(/<\/h2>/g, '</h3>');
const editHTML = md(EDIT).replace(/^<h1[^>]*>.*?<\/h1>\n/s, '').replace(/<h2 /g, '<h3 ').replace(/<\/h2>/g, '</h3>');

const CSS = readFileSync(new URL('./styles.css', import.meta.url), 'utf8') + readFileSync(new URL('./styles2.css', import.meta.url), 'utf8');
const JS = readFileSync(new URL('./page.js', import.meta.url), 'utf8');
const toc = [['r-1', 'Ranking'], ['r-2', 'Treatments'], ['r-3', 'Drawn scenes'], ['r-4', 'Framework'], ['r-5', 'Beats'], ['r-6', 'Editorial'], ['r-7', 'Build order']];
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Edo Scene Framework</title>
<link rel="icon" href="data:,">
<meta name="description" content="Journeys ranked by what they carry, eight scene treatments read off the content, four drawn with the globe turning to follow, and the framework (camera, clock, highlights, glyphs, labels) the whole unit reuses.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap">
<style>${CSS}</style>
</head>
<body>
${landDefs()}${glyphDefs()}
<header class="top"><a class="brand" href="#top">景 <span>Edo: scenes and the framework</span></a><nav class="toc" aria-label="Sections">${toc.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav><button type="button" class="icon-btn" id="themeBtn" aria-label="Switch colour theme">◐</button></header>
<main id="top">
<section class="lead"><p class="eyebrow">Study 2 · 12 October 2026 · before any build</p><h1>What the content asks to move</h1><p class="lede">Every journey and run in the unit scored for what it carries; eight treatments read line by line off the beats and the lectures, each element placed only where a sentence demands it; four of them drawn with the globe turning to follow; and the framework that templates them for the whole unit: the camera, the clock, six kinds of highlight, fourteen glyphs, a label budget, three templates and the lints.</p>
<div class="keys"><div><b>36</b><span>journeys and runs scored on five criteria</span></div><div><b>8</b><span>treatments, 45 shots, 47 captions, all sourced</span></div><div><b>14</b><span>glyphs, each demanded by a quoted line; no flag, because no line asks for one</span></div><div><b>0</b><span>places highlighted because a lecture merely mentions them</span></div></div></section>

<h2 id="r-1">1. The ranking</h2>
<p>Each journey (20) and chronological run (16) scored 0–3 on significance to the argument, information density, assets in hand, visual potential and sourcing strength. The eight scenes are the top of the list after folding duplicates (the junks and the Dutch legs into the blue; Hayashi, the steamers and the 1867 exhibit into the afterlife). The rest are not scenes: too thin, undated, a demonstration rather than a scene, or sensitive. The reserve is Perry, the only journey dated at every stop.</p>
${rankingHTML}

<h2 id="r-2">2. The eight treatments</h2>
<p>Each treatment quotes the content line that demands an element, then gives a shot list, interactions, assets and risks. The full text is in <code>scenes.md</code>; the cards show the demands and what each scene reuses from the glyph set.</p>
<div class="treats">${['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'].map((id) => T(id) ? treatmentCard(T(id)) : '').join('')}</div>
<h3>What repeats</h3>
<ol class="repeats">${(S.repeats || []).map((r) => `<li><b>${esc(r.id.replace(/-/g, ' '))}.</b> ${esc(r.pattern)}</li>`).join('')}</ol>

<h2 id="r-3">3. Four scenes, drawn</h2>
<p>The globe is drawn larger than the frame so a turn reads as a turn. The dashed box in a follow shot is the central 60 % the leading stop must stay inside; a leg never draws behind the limb. The readout at the top right is the clock, in the v4 bar's place; the strip at the bottom is the scene's span. "Watch at pace" steps the frames at the study's own dwell rule.</p>
${DRAWN.map(drawn).join('\n')}

<h2 id="r-4">4. The framework</h2>
${frame}

<h2 id="r-5">5. The beats, once the lectures exist</h2>
<p class="lede small">Diagnosis of the 71 v4 beats, the kinds a beat may be, how to derive them from the lectures, and Act II worked through (Lecture 5 "Blue"): 17 beats of 957 words become 19 of about 580, with 15 kept and re-kinded, 2 retired into the lecture and 4 new focus beats written with sources. Full text below.</p>
<details class="full"><summary>Read the beats study</summary>${beatsHTML}</details>

<h2 id="r-6">6. The editorial process</h2>
<p class="lede small">One claims register as the single source of truth for every dated or numbered claim; display rules per surface (a range is a bar, never a point; an argued value never drives a tick or a clock); a lint in <code>build-content.mjs</code> that refuses any year in prose the register does not hold; the five known cases resolved, with seven that need an outside source named. About 160 dated records for Edo; a week to set up, then two or three days a unit.</p>
<details class="full"><summary>Read the editorial process</summary>${editHTML}</details>

<h2 id="r-7">7. Build order, revised</h2>
<div class="tw"><table><thead><tr><th>Order</th><th>Work</th><th>Effort</th><th>Depends on</th></tr></thead><tbody>
<tr><td>1</td><td class="first">Claims register for Edo; lint; the five cases resolved (seven need an outside source)</td><td>M–L (5 d)</td><td>—</td></tr>
<tr><td>2</td><td class="first">Atlas completion: ink current, static fallback, five lenses, Codex feed, lens-kit naming</td><td>M–L (4–8 d)</td><td>—</td></tr>
<tr><td>3</td><td class="first">Data: events with coordinates, journeys with dated legs, groups; <code>scenes.yaml</code> schema and lints</td><td>M (2–3 d)</td><td>1</td></tr>
<tr><td>4</td><td class="first">The clock component (five modes) and the lane chart focus; the cursor as the single clock</td><td>M (2–4 d)</td><td>3</td></tr>
<tr><td>5</td><td class="first">Glyph library (14, CC0) and the highlight vocabulary on globe, map and sheet; the label placer with the budget and leaders</td><td>M (3–4 d)</td><td>—</td></tr>
<tr><td>6</td><td class="first">Scene player in the unit: follow camera on the three-scale map and the sheet, inset, caption and honesty slots, reduced motion</td><td>M–L (4–6 d)</td><td>3, 4, 5</td></tr>
<tr><td>7</td><td class="first">Lectures: <code>lectures.yaml</code> from the v0 text; the station player as side panel and room; stations bound to ticks</td><td>M–L (3–6 d)</td><td>1, 4</td></tr>
<tr><td>8</td><td class="first">Beats re-derived by kind for all five acts (Act II done in the study); nine reveal beats retired</td><td>M (3–4 d)</td><td>7</td></tr>
<tr><td>9</td><td class="first">The eight scenes authored and checked (T1–T8), then Perry and the American afterlife</td><td>S each (0.5–1 d)</td><td>6, 8</td></tr>
<tr><td>10</td><td class="first">Inline widgets (blue scrubber, price card, margin hotspots, export counter) and people in three layers</td><td>M (4–6 d)</td><td>4</td></tr>
<tr><td>11</td><td class="first">Atlas scene player (keyframes, clock, pause, captions, highlight/dim, mask, <code>#sc-</code> token) and the lectures-by-chapter layer menu</td><td>L (10–20 d)</td><td>2, 3, 5</td></tr>
</tbody></table></div>
<p>Steps 1–10 are the Edo unit, about 32–50 working days; step 11 adds the Atlas, 10–20 more. The overture is retired at step 6; its two WebGL shots become the Act II demonstrations.</p>
<footer class="foot"><p>Inputs: <code>scenes.md</code>, <code>scenes.json</code>, <code>FRAMEWORK.md</code>, <code>beats_study.md</code>, <code>editorial_process.md</code> in <code>research_notes/Motion layers and focus/</code>, on top of study 1. Map outlines: Natural Earth via world-atlas (public domain). The 1859 sheet: Library of Congress, public domain. Prints: the Metropolitan Museum of Art, CC0. Glyphs: own drawings, CC0.</p></footer>
</main>
<dialog id="watch" class="watch" aria-label="Scene at pace"><div class="w-bar"><p id="wTitle"></p><div class="w-ctl"><button type="button" class="btn small" id="wPrev" aria-label="Previous frame">‹</button><button type="button" class="btn small" id="wPlay" aria-pressed="false">Play</button><button type="button" class="btn small" id="wNext" aria-label="Next frame">›</button><form method="dialog"><button class="btn small" value="close">Close ✕</button></form></div></div><div class="w-stage" id="wStage"></div><p class="w-cap" id="wCap" aria-live="polite"></p><div class="w-bar2"><span id="wPos"></span><span class="w-prog"><i id="wProg"></i></span></div></dialog>
<script>${JS.replace("fig.closest('section, main').querySelector('h3[id^=\"s' + b.dataset.watch.slice(1) + '-\"]')", "null")}</script>
</body>
</html>`;
mkdirSync('dist', { recursive: true });
writeFileSync('dist/scenes.html', page);
writeFileSync('dist/scenes-page.html', stripHost(page));
console.log('dist/scenes.html', (page.length / 1024).toFixed(0), 'KB');

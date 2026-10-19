// Builds the reference-study page from references_study.md, placing each reference image beside its entry.
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { md, esc, stripHost } from '../../study-motion/src/draw.mjs';
const MD = readFileSync('/home/claude/creative-world/modules/F1-histories-of-making/research_notes/Design language references/references_study.md', 'utf8');
const REFS = ['01-woa-shop', '02-paris-editorial', '03-natgeo-tut-exploded', '04-petrie-pottery-plate', '05-art-history-span-list', '06-history-of-red', '07-traditional-art-cards', '08-dk-fayum-pelagos', '09-dk-mamluk-kiss', '10-works-by-year-wall', '11-phase-board', '12-inflight-journey', '13-surveillance-globe-panel', '14-ar-hud-labels', '15-tactical-contour-map', '16-rotterdam-heat-map', '17-topo-route-elevation', '18-weather-globe-stepper', '19-norway-ink-map', '20-shipments-glass-dashboard'];
let body = md(MD).replace(/^<h1[^>]*>.*?<\/h1>\n/s, '');
// each reference paragraph starts with <p><strong>NN · … → wrap it with its image
body = body.replace(/<p><strong>(\d\d) · (.*?)<\/strong>(.*?)<\/p>/gs, (m, n, title, rest) => {
  const id = REFS[+n - 1];
  const parts = rest.split(/<em>Take:<\/em>|<em>Leave:<\/em>/);
  const take = rest.match(/<em>Take:<\/em>(.*?)(?=<em>Leave:<\/em>|$)/s)?.[1] || '';
  const leave = rest.match(/<em>Leave:<\/em>(.*)$/s)?.[1] || '';
  const what = parts[0];
  return `<article class="ref" id="ref-${n}"><figure><img src="refs/${id}.webp" alt="Reference ${n}: ${esc(title)}" loading="lazy"></figure><div class="ref-txt"><p class="eyebrow">Reference ${n}</p><h3>${title}</h3><p>${what.trim()}</p><p class="take"><b>Take</b>${take}</p>${leave ? `<p class="leave"><b>Leave</b>${leave}</p>` : ''}</div></article>`;
});
body = body.replace(/<h2 id="(\d+)-([^"]*)">/g, (m, n) => `<h2 id="s-${n}">`);
const toc = [['s-1', 'The references'], ['s-2', 'What they agree on'], ['s-3', 'Tokens'], ['s-4', 'Component catalogue'], ['s-5', 'What each surface becomes'], ['s-6', 'What they do not solve']];
const CSS = readFileSync('/home/claude/creative-world/modules/F1-histories-of-making/build/study-motion/src/styles.css', 'utf8') + `
.ref { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 20px; margin: 18px 0; padding: 16px; background: var(--sheet); border-radius: 14px; box-shadow: var(--shadow); }
.ref figure { margin: 0; } .ref img { width: 100%; height: auto; border-radius: 8px; border: 1px solid var(--line); background: var(--paper); }
.ref-txt h3 { margin: 4px 0 8px; }
.ref-txt p { max-width: none; }
.take, .leave { padding: 8px 12px; border-left: 3px solid var(--chosen); background: var(--paper); border-radius: 0 8px 8px 0; font-size: 14px; }
.leave { border-left-color: var(--conflict); }
.take b, .leave b { display: inline-block; font: 600 11px/1 var(--mono); letter-spacing: .08em; text-transform: uppercase; margin-right: 8px; color: var(--ink-3); }
h3 { margin-top: 32px; }
@media (max-width: 760px) { .ref { grid-template-columns: 1fr; } }
`;
const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>F1 Reference Study</title><link rel="icon" href="data:,">
<meta name="description" content="Twenty design references read for the course: what each does, what to take, what to leave; the principles they agree on; the tokens and components that follow; what each surface becomes.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap">
<style>${CSS}</style></head>
<body>
<header class="top"><a class="brand" href="#top">参 <span>F1: a design language from twenty references</span></a><nav class="toc" aria-label="Sections">${toc.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav><button type="button" class="icon-btn" id="themeBtn" aria-label="Switch colour theme">◐</button></header>
<main id="top">
<section class="lead"><p class="eyebrow">Reference study · 20 October 2026</p><h1>Where the course's pages should grow</h1><p class="lede">Twenty references, from a print shop's gallery to an in-flight map, read for one question: what would make the course's pages, objects, timelines and maps clearer and more beautiful without leaving the finish v4 already has. Each reference gets a take and a leave; together they give five principles, ten new tokens, eighteen components and a new shape for every surface.</p>
<div class="keys"><div><b>20</b><span>references, four groups: restraint, objects, time, place</span></div><div><b>5</b><span>things they agree on; the object is the page</span></div><div><b>18</b><span>components, each with its first Edo instance</span></div><div><b>8 of 20</b><span>are dark or sci-fi: their mechanics transfer, their looks do not</span></div></div></section>
${body}
<footer class="foot"><p>The reference images are the lead's own uploads, kept here for study. Everything the course builds from them uses its own objects (CC0 and public domain) and its own drawings.</p></footer>
</main>
<script>document.getElementById('themeBtn').addEventListener('click',function(){var r=document.documentElement;var d=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;r.dataset.theme=d?'light':'dark';});</script>
</body></html>`;
mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', page); writeFileSync('dist/page.html', stripHost(page));
console.log('ok', (page.length / 1024).toFixed(0), 'KB', (body.match(/class="ref"/g) || []).length, 'refs');

// The kinun veil: golden cloud bands (suyari-gasumi, as on rakuchū rakugai-zu screens) close over the globe,
// the surface swaps to the story's own historic sheet behind them, and the clouds part onto it, leaving two bands
// at the edges as a frame. Under reduced motion it is a fade-cut. The sheet is the unit tier: the 1859 Edo map
// with the unit's georeferenced places, and a plain link that opens the Edo unit in a new tab.
import { M, esc } from './model.js';
import { S } from './state.js';
import { edoEngaged } from './ink.js';

const VW = 1600, VH = 1000;

function bandPath(x0, x1, y, h, lobe, seed = 1) {
  // a suyari-gasumi band: long, flat, rounded ends, shallow scallops along the top, a gentle hem below
  const r = h / 2;
  let d = `M${x0 + r} ${y + h} A${r} ${r} 0 0 1 ${x0 + r} ${y}`;
  let x = x0 + r, i = 0;
  const end = x1 - r;
  while (x < end - 1) {
    const k = ((i * 53 + seed * 17) % 11) / 11;
    let w = Math.min(end - x, lobe * (0.6 + 0.8 * k));
    if (end - x - w < lobe * 0.45) w = end - x;
    d += ` A${(w / 2).toFixed(1)} ${Math.min(w * 0.4, h * (0.18 + 0.16 * k)).toFixed(1)} 0 0 1 ${(x + w).toFixed(1)} ${y}`;
    x += w; i++;
  }
  d += ` A${r} ${r} 0 0 1 ${x1 - r} ${y + h}`;
  x = x1 - r;
  while (x > x0 + r + 1) {
    let w = Math.min(x - (x0 + r), lobe * 2.2);
    if (x - (x0 + r) - w < lobe * 0.6) w = x - (x0 + r);
    d += ` A${(w / 2).toFixed(1)} ${(h * 0.1).toFixed(1)} 0 0 1 ${(x - w).toFixed(1)} ${y + h}`;
    x -= w;
  }
  return d + 'Z';
}

const BANDS = [
  { y: -30, h: 120, x0: -260, x1: 1060, dir: -1, keep: true },
  { y: 60, h: 105, x0: 420, x1: 1860, dir: 1 },
  { y: 150, h: 115, x0: -240, x1: 900, dir: -1 },
  { y: 245, h: 100, x0: 560, x1: 1860, dir: 1 },
  { y: 330, h: 118, x0: -260, x1: 1140, dir: -1 },
  { y: 430, h: 104, x0: 300, x1: 1860, dir: 1 },
  { y: 520, h: 116, x0: -240, x1: 980, dir: -1 },
  { y: 615, h: 102, x0: 520, x1: 1860, dir: 1 },
  { y: 700, h: 118, x0: -260, x1: 1100, dir: -1 },
  { y: 800, h: 106, x0: 380, x1: 1860, dir: 1 },
  { y: 890, h: 124, x0: 640, x1: 1860, dir: 1, keep: true },
];

export class Veil {
  constructor(api) {
    this.api = api;
    this.sheet = document.getElementById('sheet');
    this.clouds = document.getElementById('clouds');
    this.isOpen = false;
    this.buildClouds();
  }

  buildClouds() {
    const g = BANDS.map((b, i) => `<g class="cloud${b.keep ? ' keep' : ''}" data-dir="${b.dir}" style="transform: translate(${b.dir * 1800}px, 0)">
        <path d="${bandPath(b.x0, b.x1, b.y, b.h, b.h * 1.5, i)}" fill="url(#kin-g)" stroke="#7E5E1C" stroke-opacity=".7" stroke-width="1.6"/>
        <path d="${bandPath(b.x0, b.x1, b.y, b.h, b.h * 1.5, i)}" fill="url(#kin-leaf)"/>
        <path d="${bandPath(b.x0 + 70, b.x1 - 90, b.y + b.h * 0.3, b.h * 0.42, b.h * 1.1, i + 3)}" fill="none" stroke="#7E5E1C" stroke-opacity=".28" stroke-width="1"/>
      </g>`).join('');
    this.clouds.innerHTML = `<svg viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="kin-g" x1="0" y1="0" x2="1" y2="0.2"><stop offset="0" stop-color="#E4C978"/><stop offset=".5" stop-color="#D8B65E"/><stop offset="1" stop-color="#E2C574"/></linearGradient>
        <pattern id="kin-leaf" width="58" height="58" patternUnits="userSpaceOnUse"><rect width="58" height="58" fill="none" stroke="#8C6A22" stroke-opacity=".2" stroke-width="1.2"/><rect x="0" y="0" width="29" height="58" fill="#FFF1C2" fill-opacity=".09"/><circle cx="14" cy="38" r="1.2" fill="#FFF6D6" fill-opacity=".55"/><circle cx="41" cy="12" r="1" fill="#FFF6D6" fill-opacity=".45"/></pattern>
      </defs>${g}</svg>`;
    this.bandEls = [...this.clouds.querySelectorAll('.cloud')];
  }

  setBands(state, ms) {
    // state: 'away' (off to the sides), 'closed' (covering), 'open' (parted, keep-bands at the edges)
    for (const el of this.bandEls) {
      const dir = +el.dataset.dir, keep = el.classList.contains('keep');
      const x = state === 'closed' ? 0 : state === 'open' && keep ? dir * 640 : dir * 1800;
      el.style.transitionDuration = `${ms}ms`;
      el.style.transitionDelay = state === 'away' ? '0ms' : `${(this.bandEls.indexOf(el) % 4) * 45}ms`;
      el.style.transform = `translate(${x}px, 0)`;
      el.style.opacity = state === 'open' && !keep ? '0' : '1';
    }
  }

  buildSheet() {
    const e = M.atlas.edo;
    const eng = new Set(edoEngaged());
    const big = !S.phone;
    this.sheet.innerHTML = `
      <div class="sheet-box" id="sheet-box">
        <img class="sheet-img" src="${big ? 'img/edo-1859.webp' : 'img/edo-1859-1024.webp'}" alt="The 1859 map of Edo, Ansei kaisei Oedo ōezu: the castle at the centre, the Sumida river to the east, wards and estates in colour." width="${e.map.w}" height="${e.map.h}">
        <div class="sheet-paper"></div>
        ${e.pins.map((p) => `<button type="button" class="pin ${eng.has(p.id) || eng.has('edo') ? 'is-inked' : ''}" data-pin="${p.id}" style="left:${p.xy[0]}%;top:${p.xy[1]}%"
          aria-label="${esc(p.name)} ${esc(p.kanji)}, ${p.approx ? 'approximate position' : 'georeferenced'} on the 1859 sheet${eng.has(p.id) ? ', inked' : ''}"><span class="pin-l" lang="ja">${esc(p.kanji)}<small lang="en">${esc(p.name)}</small></span><span class="pin-d"></span></button>`).join('')}
      </div>
      <div class="sheet-card" role="group" aria-labelledby="sheet-h">
        <p class="kicker">Story · East Asia, read through the workshop</p>
        <h3 id="sheet-h">${esc(e.title)}</h3>
        <p class="sub" ${S.phone ? 'hidden' : ''}>${esc(e.sub)}: the print trade of Edo, on the city’s own 1859 map.</p>
        <div class="row">
          <a class="btn ext" href="${esc(e.url)}" target="_blank" rel="noopener">Open the Edo unit</a>
          <button type="button" class="btn btn-2" data-close="1">Back to the globe</button>
        </div>
      </div>
      <p class="sheet-credit">${esc(e.map.credit)}</p>`;
    this.sheet.querySelector('[data-close]').addEventListener('click', () => this.api.close());
    this.sheet.querySelectorAll('.pin').forEach((b) => b.addEventListener('click', () => this.api.pin?.(b.dataset.pin)));
    const img = this.sheet.querySelector('img');
    this.layout();
    return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
  }

  layout() {
    const box = this.sheet.querySelector('#sheet-box');
    if (!box) return;
    requestAnimationFrame(() => this.declutter());
    const e = M.atlas.edo;
    const W = this.sheet.clientWidth, H = this.sheet.clientHeight;
    const padB = S.phone ? 140 : 24;
    const k = Math.min((W - 24) / e.map.w, (H - padB - 16) / e.map.h) * (S.phone ? 1 : 0.98);
    box.style.width = `${Math.round(e.map.w * k)}px`;
    box.style.height = `${Math.round(e.map.h * k)}px`;
    box.style.top = S.phone ? `${Math.round((H - padB) / 2 + 4)}px` : '50%';
  }

  // pin labels: keep the first that fits, flip the next below its dot, else show the dot alone
  declutter() {
    const pins = [...this.sheet.querySelectorAll('.pin')];
    const boxes = [];
    for (const p of pins) {
      p.classList.remove('below', 'dot-only');
      let r = p.querySelector('.pin-l').getBoundingClientRect();
      const hit = (r) => boxes.some((b) => !(r.right < b.left || r.left > b.right || r.bottom < b.top || r.top > b.bottom));
      if (hit(r)) { p.classList.add('below'); r = p.querySelector('.pin-l').getBoundingClientRect(); if (hit(r)) { p.classList.remove('below'); p.classList.add('dot-only'); continue; } }
      boxes.push(r);
    }
  }

  async open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.clouds.hidden = false;
    const motion = S.motion;
    this.clouds.classList.toggle('is-cut', !motion);
    this.clouds.classList.remove('is-open');
    if (motion) {
      this.setBands('away', 0);
      await frame();
      this.setBands('closed', 650);
      await wait(700);
    } else {
      this.setBands('closed', 0);
      this.clouds.style.opacity = '0';
      await frame();
      this.clouds.style.transition = 'opacity 150ms linear';
      this.clouds.style.opacity = '1';
      await wait(160);
    }
    this.sheet.hidden = false;
    await this.buildSheet();
    this.api.covered?.();
    this.setBands('open', motion ? 1250 : 0);
    if (!motion) { await wait(20); }
    this.clouds.classList.add('is-open');
    await wait(motion ? 1300 : 160);
    this.sheet.querySelector('.sheet-card a')?.focus({ preventScroll: true });
  }

  async close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    const motion = S.motion;
    this.clouds.classList.remove('is-open');
    this.sheet.classList.add('is-closing');
    this.setBands('closed', motion ? 600 : 0);
    await wait(motion ? 640 : 40);
    this.sheet.hidden = true;
    this.sheet.innerHTML = '';
    this.sheet.classList.remove('is-closing');
    this.api.uncovered?.();
    this.setBands('away', motion ? 900 : 0);
    await wait(motion ? 920 : 20);
    if (!this.isOpen) this.clouds.hidden = true;
  }
}

const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Screenshots of the main Atlas states. Serve dist/ on 5180 first (npm run preview, or python3 -m http.server 5180 -d dist).
//   node scripts/shots.mjs <outdir> [filter]
import { createRequire } from 'module';
import { mkdirSync } from 'fs';
const require = createRequire(import.meta.url);
const { chromium } = require('/home/claude/creative-world/modules/F1-histories-of-making/build/lectures/node_modules/playwright');

const out = process.argv[2] || 'shots';
const filter = process.argv[3] ? new RegExp(process.argv[3]) : null;
mkdirSync(out, { recursive: true });
const BASE = 'http://localhost:5180/';
const D = { width: 1440, height: 900 }, P = { width: 390, height: 844 };
const cases = [
  ['d-world', D, '', {}, 3200],
  ['d-lens-networks', D, '#l-F1.13', {}, 2600],
  ['d-lens-museums', D, '#l-F1.24', {}, 2600],
  ['d-lens-labour', D, '#l-F1.23', {}, 2600],
  ['d-region-eastasia', D, '#u-F1.8', {}, 3000],
  ['d-region-africa', D, '#u-F1.6', {}, 3000],
  ['d-veil-mid', D, '#s-edo', {}, 2900],
  ['d-veil', D, '#s-edo', {}, 6500],
  ['d-veil-anim', D, '#u-F1.8', {}, 3000],
  ['d-list', D, '#v-list', {}, 1500],
  ['d-inked', D, '#from-edo.tsutaya.hokusai.edo', {}, 3500],
  ['d-node', D, '#u-F1.8~n-PLC207', {}, 3000],
  ['d-map', D, '#v-map', {}, 1800],
  ['d-map-region', D, '#u-F1.8~v-map', {}, 2500],
  ['d-dark', D, '', { colorScheme: 'dark' }, 3200],
  ['d-dark-region', D, '#u-F1.10', { colorScheme: 'dark' }, 3000],
  ['d-reduced', D, '#l-F1.22~y-1880', { reducedMotion: 'reduce' }, 1800],
  ['d-retime', D, '#l-F1.30~y-1859', {}, 2500],
  ['p-world', P, '', {}, 3200],
  ['p-region', P, '#u-F1.8', {}, 3200],
  ['p-veil', P, '#s-edo', {}, 6500],
  ['p-list', P, '#v-list', {}, 1500],
  ['p-dark', P, '#l-F1.13', { colorScheme: 'dark' }, 3000],
  ['p-inked', P, '#from-edo.tsutaya.hokusai.edo', { reducedMotion: 'reduce' }, 2500],
];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const errors = [];
for (const [name, vp, hash, opts, wait] of cases) {
  if (filter && !filter.test(name)) continue;
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: vp.width < 500 ? 2 : 1, colorScheme: opts.colorScheme || 'light', reducedMotion: opts.reducedMotion || 'no-preference', isMobile: vp.width < 500, hasTouch: vp.width < 500 });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${name}: ${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${name}: pageerror: ${e.message}`));
  await page.goto(BASE + hash, { waitUntil: 'networkidle' });
  if (!/v-map|v-list/.test(hash)) await page.waitForFunction(() => window.__atlasGlobe, null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(wait);
  const info = await page.evaluate(() => {
    const g = window.__atlasGlobe;
    return { calls: g ? g.renderer.info.render.calls : null, tris: g ? g.renderer.info.render.triangles : null, hash: location.hash, tier: window.__atlas?.S.tier, q: g?.q, labels: document.querySelectorAll('#labels .lab').length, hscroll: document.documentElement.scrollWidth > innerWidth };
  });
  if (name === 'd-veil-anim') {
    await page.evaluate(() => window.__atlas.set({ story: 'edo', unit: 'F1.8', node: null }, { push: true }));
    await page.waitForFunction(() => !document.getElementById('clouds').hidden, null, { timeout: 30000 });
    for (const [i, t] of [[1, 300], [2, 900], [3, 1500], [4, 2200]].entries ? [[1, 300], [2, 900], [3, 1500], [4, 2200]] : []) {
      await page.waitForTimeout(i === 1 ? t : t - [0, 300, 900, 1500][i - 1]);
      await page.screenshot({ path: `${out}/${name}-${i}.png`, timeout: 120000 });
    }
  }
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: false, timeout: 120000 });
  if (name === 'p-list' || name === 'p-region' || name === 'd-list') await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true, timeout: 120000 });
  console.log(name, JSON.stringify(info));
  await ctx.close();
}
await browser.close();
console.log(errors.length ? errors.join('\n') : 'no console errors');

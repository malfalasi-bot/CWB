// Screenshots at desktop and phone widths, for review. Usage: node scripts/shots.mjs [outdir] [ids...]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || new URL('../../../lectures/node_modules/playwright/index.js', import.meta.url).pathname);
const out = process.argv[2] || 'shots';
const ids = process.argv.slice(3);
const base = process.env.URL || 'http://localhost:8790/';
const sizes = (process.env.SIZES || 'd,m').split(',');
const { mkdirSync } = await import('fs'); mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const sz of sizes) {
  const ctx = await browser.newContext(sz === 'd' ? { viewport: { width: 1440, height: 900 } } : { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  for (const id of ids) {
    await page.evaluate((id) => window.__edo.go(id), id);
    await page.waitForTimeout(+(process.env.WAIT || 3200));
    await page.screenshot({ path: `${out}/${sz}-${id}.png` });
    if (process.env.EL) await page.locator('#' + id).screenshot({ path: `${out}/${sz}-${id}-el.png` });
  }
  console.log(sz, 'errors:', errs.slice(0, 20));
  await ctx.close();
}
await browser.close();

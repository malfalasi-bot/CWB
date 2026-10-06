// Playwright pass over dist/ (vite preview on :5190): both views, light/dark, desktop/phone, console errors, overflow.
// Usage: node scripts/shoot.cjs [outDir]
const { chromium } = require('/home/claude/creative-world/modules/F1-histories-of-making/build/lectures/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const OUT = process.argv[2] || path.join(__dirname, '..', 'shots');
fs.mkdirSync(OUT, { recursive: true });
const URL = 'http://127.0.0.1:5190/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const errors = [];
  const run = async (name, opts, fn) => {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)|ERR_|net::/.test(m.text())) errors.push(`${name}: ${m.text()}`); });
    page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(700);
    const ov = async (tag) => { const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); if (o > 1) errors.push(`${name} ${tag}: horizontal overflow ${o}px`); };
    await fn(page, ov);
    await ctx.close();
  };
  const shot = (page, file, full) => page.screenshot({ path: path.join(OUT, file), fullPage: !!full });
  for (const scheme of ['light', 'dark']) {
    for (const [dev, opts] of [['d', { viewport: { width: 1440, height: 900 } }], ['m', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
      if (dev === 'm' && scheme === 'dark') continue;
      await run(`${dev}-${scheme}`, { ...opts, colorScheme: scheme, reducedMotion: 'reduce' }, async (page, ov) => {
        await shot(page, `${dev}-${scheme}-1-versions.png`); await ov('versions');
        await page.click('[data-other="v3"]'); await page.waitForTimeout(300);
        await shot(page, `${dev}-${scheme}-2-compare.png`); await ov('compare');
        if (dev === 'd') { await page.click('[data-mode="slider"]'); await page.waitForTimeout(300); await page.locator('#gStage').screenshot({ path: path.join(OUT, `${dev}-${scheme}-2b-slider.png`) }); }
        await page.click('[data-other=""]');
        await page.click('[data-beat="timeline"]'); await page.waitForTimeout(200);
        await page.evaluate(() => document.querySelector('.g-about').scrollIntoView());
        await shot(page, `${dev}-${scheme}-3-about.png`);
        await page.click('#tab-compose'); await page.waitForTimeout(300);
        await page.click('[data-go="5"]'); await page.waitForTimeout(300);
        await shot(page, `${dev}-${scheme}-4-step.png`); await ov('step');
        await shot(page, `${dev}-${scheme}-4f-step-full.png`, true);
        await page.click('[data-choose="map-dots-raster"]'); await page.waitForTimeout(300);
        await page.evaluate(() => document.querySelector('.detail').scrollIntoView());
        await shot(page, `${dev}-${scheme}-5-detail.png`); await ov('detail');
        await page.click('.card-img'); await page.waitForTimeout(300);
        await shot(page, `${dev}-${scheme}-6-lightbox.png`);
        await page.click('[data-lbm="1"]'); await page.waitForTimeout(300);
        await shot(page, `${dev}-${scheme}-6b-context.png`);
        await page.keyboard.press('Escape');
        await page.click('[data-go="12"]'); await page.waitForTimeout(400);
        await shot(page, `${dev}-${scheme}-7-summary.png`); await ov('summary');
        await shot(page, `${dev}-${scheme}-7f-summary-full.png`, true);
      });
    }
  }
  await browser.close();
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'No console errors, no horizontal overflow.');
})();

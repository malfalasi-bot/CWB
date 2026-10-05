// Playwright pass over dist/ (served on :5190): screenshots in light/dark, desktop/phone, plus console-error check.
// Usage: node scripts/shoot.cjs [outDir]
const { chromium } = require('/home/claude/creative-world/modules/F1-histories-of-making/build/lectures/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const OUT = process.argv[2] || path.join(__dirname, '..', 'shots');
fs.mkdirSync(OUT, { recursive: true });
const URL = 'http://127.0.0.1:5190/index.html';
const MIX = [['navigation', 'nav-hub-filter'], ['tools', 'tools-embedded-widgets'], ['text', 'text-essay'], ['people', 'people-tables']];

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const errors = [];
  const run = async (name, opts, fn) => {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)|ERR_|net::/.test(m.text())) errors.push(`${name}: ${m.text()}`); });
    page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(600);
    await fn(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) errors.push(`${name}: horizontal overflow ${overflow}px`);
    await ctx.close();
  };
  const shot = (page, file, el) => (el ? page.locator(el).screenshot({ path: path.join(OUT, file) }) : page.screenshot({ path: path.join(OUT, file) }));
  const choose = async (page, phone) => {
    for (const [d, id] of MIX) {
      if (phone) { const t = page.locator(`[data-toggle="${d}"]`); if ((await t.getAttribute('aria-expanded')) !== 'true') await t.click(); }
      await page.click(`.card[data-opt="${id}"]`);
      await page.waitForTimeout(80);
    }
  };
  for (const scheme of ['light', 'dark']) {
    const desk = { viewport: { width: 1440, height: 900 }, colorScheme: scheme, reducedMotion: 'reduce' };
    await run(`desktop-${scheme}`, desk, async (page) => {
      await page.evaluate(() => document.getElementById('composer').scrollIntoView());
      await page.waitForTimeout(200);
      await shot(page, `d-${scheme}-1-v4-board.png`);
      await page.screenshot({ path: path.join(OUT, `d-${scheme}-0-top.png`), clip: { x: 0, y: 0, width: 1440, height: 900 } });
      await choose(page, false);
      await page.evaluate(() => document.getElementById('composer').scrollIntoView());
      await page.waitForTimeout(200);
      await shot(page, `d-${scheme}-2-mixed-board.png`);
      if (scheme === 'light') {
        await page.click('[data-repairs]'); await page.waitForTimeout(300);
        await page.evaluate(() => document.getElementById('composer').scrollIntoView());
        await shot(page, `d-${scheme}-2b-repairs.png`);
        await page.click('[data-repairs]');
        await page.click('.card[data-opt="tools-embedded-widgets"]'); await page.waitForTimeout(150); await page.evaluate(() => document.getElementById('dim-tools').scrollIntoView());
        await page.waitForTimeout(150);
        await shot(page, `d-${scheme}-2c-inspector.png`);
      }
      await page.evaluate(() => document.getElementById('feasibility').scrollIntoView());
      await page.waitForTimeout(200);
      await shot(page, `d-${scheme}-3-feasibility.png`);
      await shot(page, `d-${scheme}-3a-ledger.png`, '#ledgerBox');
      await shot(page, `d-${scheme}-4-blueprint-phone.png`, '#blueprintBox');
      await page.click('[data-frame="desktop"]'); await page.waitForTimeout(150);
      await shot(page, `d-${scheme}-4b-blueprint-desktop.png`, '#blueprintBox');
      await page.click('[data-frame="phone"]');
      await page.click('[data-tab="heatmap"]'); await page.waitForTimeout(150);
      await page.evaluate(() => document.getElementById('methods').scrollIntoView());
      await shot(page, `d-${scheme}-5-heatmap.png`);
      if (scheme === 'light') {
        await page.click('[data-tab="catalogue"]'); await page.waitForTimeout(150);
        await page.evaluate(() => document.getElementById('methods').scrollIntoView());
        await shot(page, `d-${scheme}-5b-catalogue.png`);
        await page.click('[data-tab="units"]'); await page.waitForTimeout(150);
        await page.evaluate(() => document.getElementById('methods').scrollIntoView());
        await shot(page, `d-${scheme}-5c-units.png`);
      }
      await page.evaluate(() => document.getElementById('brief').scrollIntoView());
      await page.waitForTimeout(400);
      await shot(page, `d-${scheme}-6-brief.png`);
      if (scheme === 'light') {
        await page.click('[data-pass="1"]'); await page.waitForTimeout(200);
        await page.evaluate(() => document.getElementById('dim-layout').scrollIntoView());
        await shot(page, `d-${scheme}-9-blind.png`);
        await page.click('[data-pass="2"]');
      }
      await page.evaluate(() => document.getElementById('versions').scrollIntoView());
      await page.waitForTimeout(200);
      await shot(page, `d-${scheme}-7-versions.png`);
      await page.click('[data-mode="swipe"]'); await page.waitForTimeout(300);
      await page.evaluate(() => document.querySelector('.compare').scrollIntoView());
      await shot(page, `d-${scheme}-8-compare-swipe.png`);
    });
    const phone = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: scheme, reducedMotion: 'reduce', deviceScaleFactor: 2 };
    await run(`phone-${scheme}`, phone, async (page) => {
      await shot(page, `m-${scheme}-0-top.png`);
      await page.evaluate(() => document.getElementById('composer').scrollIntoView());
      await page.waitForTimeout(200);
      await shot(page, `m-${scheme}-1-v4-board.png`);
      await choose(page, true);
      await page.evaluate(() => document.getElementById('dim-navigation').scrollIntoView());
      await page.waitForTimeout(200);
      await shot(page, `m-${scheme}-2-mixed-board.png`);
      await page.evaluate(() => document.getElementById('ledgerBox').scrollIntoView());
      await shot(page, `m-${scheme}-3-ledger.png`);
      await page.evaluate(() => document.getElementById('blueprintBox').scrollIntoView());
      await shot(page, `m-${scheme}-4-blueprint.png`);
      await page.evaluate(() => document.querySelector('.compare').scrollIntoView());
      await shot(page, `m-${scheme}-8-compare.png`);
      await page.evaluate(() => document.getElementById('brief').scrollIntoView());
      await page.waitForTimeout(400);
      await shot(page, `m-${scheme}-6-brief.png`);
    });
  }
  await browser.close();
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'No console errors, no horizontal overflow.');
})();

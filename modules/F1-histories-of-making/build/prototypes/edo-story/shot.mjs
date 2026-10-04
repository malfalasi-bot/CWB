import { chromium } from '/home/claude/creative-world/modules/F1-histories-of-making/build/lectures/node_modules/playwright/index.mjs';
const out = '/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/edo-story/shots/';
import fs from 'fs'; fs.mkdirSync(out, {recursive: true});
const browser = await chromium.launch({executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const page = await browser.newPage({viewport: {width: 1440, height: 900}});
const errors = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
await page.goto('http://localhost:8765/index.html', {waitUntil: 'networkidle'});
await page.waitForTimeout(1500);
await page.screenshot({path: out + '01-top.png'});
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['b1-2', 'b1-3', 'b3-5', 'b4-2', 'b4-6', 'b5-2', 'b5-4', 'b6-3'];
for (const id of ids) {
  await page.evaluate((id) => document.getElementById(id).scrollIntoView({block: 'start'}), id);
  await page.waitForTimeout(2600);
  await page.screenshot({path: out + id + '.png'});
}
await page.setViewportSize({width: 390, height: 844});
await page.evaluate(() => document.getElementById('b4-4').scrollIntoView({block: 'start'}));
await page.waitForTimeout(2200);
await page.screenshot({path: out + 'mobile-b4-4.png'});
console.log(errors.join('\n') || 'no console errors');
await browser.close();

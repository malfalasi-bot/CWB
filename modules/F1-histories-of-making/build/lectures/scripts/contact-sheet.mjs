// Screenshots the in-page player at the start of every station: the contact sheet that proves the lecture.
import {chromium} from 'playwright';
import {readFileSync, mkdirSync} from 'node:fs';
const lecture = JSON.parse(readFileSync(new URL('../src/lectures/f1-13.json', import.meta.url)));
const url = process.argv[2] ?? 'http://localhost:8765/index.html';
const out = new URL('../F1.13/stations/', import.meta.url).pathname;
mkdirSync(out, {recursive: true});
const browser = await chromium.launch({executablePath: process.env.CHROME ?? undefined});
const page = await browser.newPage({viewport: {width: 1280, height: 720}, deviceScaleFactor: 1});
page.on('pageerror', e => console.log('page error:', e.message));
page.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
await page.goto(url, {waitUntil: 'networkidle'});
await page.waitForTimeout(3000);
const state = await page.evaluate(() => {
  const el = document.getElementById('player');
  const ov = el?.shadowRoot?.querySelector('.overlay');
  return {has: !!el, cls: ov?.className ?? null, canvas: !!el?.shadowRoot?.querySelector('canvas')};
});
console.log('player state', JSON.stringify(state));
// Seek by playing from the start: the element exposes no seek, so we time it.
let t = 0;
const marks = [{name: '00-title', at: 1}];
let acc = lecture.titleSeconds ?? 0;
for (const s of lecture.stations) { marks.push({name: `${String(s.n).padStart(2, '0')}-${s.id}`, at: acc + 2}); acc += s.seconds; }
await page.evaluate(() => { const el = document.getElementById('player'); el.setPlaying ? el.setPlaying(true) : el.shadowRoot.querySelector('.overlay').click(); });
const start = Date.now();
for (const m of marks) {
  const wait = m.at * 1000 - (Date.now() - start);
  if (wait > 0) await page.waitForTimeout(wait);
  const frame = await page.$('#player');
  await frame.screenshot({path: `${out}${m.name}.png`});
  console.log('shot', m.name, 'at', ((Date.now() - start) / 1000).toFixed(1), 's');
  if (process.env.QUICK && m.at > 20) break;
}
await browser.close();

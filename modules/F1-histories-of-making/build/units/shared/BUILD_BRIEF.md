> Superseded by `../edo/ARCH_V4.md` (4 October 2026), which is the contract the v4 build followed. Kept as a record.

# Build brief shared by every F1 Edo piece (October 2026)

Read this before writing code. It applies to the Edo story, the Print Desks, the Print Workshop and the Atlas hub.

## Sources of truth
- Studies: `../../research/edo-redesign-2026-10-04/REPORT_EDO_REDESIGN.md` and `../../reports/Atlas 3D map and game mechanics.md` (read the build-plan tables and the honesty rules).
- Existing unit (reuse its data, images and code): `../edo/` — `content/*.yaml` (story, people, timeline, places, sources), `public/img/images.json` (credits for every image), `public/img/*.webp`, `src/*.js`.
- Shared tokens: `edo-tokens.css` (copy into your project; do not invent new colours). Links: `LINKS.md`.

## Runtime: a claude.ai Artifact
- The published page is wrapped in a doctype/html/head/body skeleton by the host. Build with Vite (`base: './'`), then post-process `dist/index.html` into `dist/page.html` with the skeleton tags, charset and viewport metas removed (see `../edo/scripts/artifact.mjs`). Keep `<title>` in the first 8 KB.
- Scripts: bundled by Vite (preferred) or from cdnjs/jsdelivr/unpkg only. Stylesheets: own files plus Google Fonts only. No runtime fetch, image, tile or iframe from any other host. Same-origin `fetch('relative/path')` of published files works.
- At most **255 files per publish**, aim for **≤ 150**; ≤ 16 MB per file. Pack thumbnails into sprite sheets; merge JSON.
- `localStorage` works per artifact; wrap every read/write in try/catch; never required for the page to work.
- Only a plain `#token` (letters, digits, `.` `_` `~` `-`) reaches `location.hash`; no query strings.
- No `alert/confirm/prompt`, no `window.print`, no `<a download>`, no fullscreen dependency; sound only after a click (we use none).
- Links to other artifacts are plain `<a href="https://claude.ai/artifact/…" target="_blank" rel="noopener">`.

## Licences
- Code: MIT/BSD/ISC/Apache only, bundled. three.js (MIT) is the 3D engine. No GSAP, no Godot/Unity, no physics engine, no Theatre.js studio.
- Content: CC0, public domain, CC BY, CC BY-SA, ODC-By only. Fonts: SIL OFL via Google Fonts (ruled acceptable, same footing as permissive code licences). Natural Earth is public domain. **No OpenStreetMap/ODbL, no OpenHistoricalMap, no Quaternius, no Sonniss.**
- Credit every image in-page (artist · title · date · holder accession · licence), from `images.json`.

## Editorial rules
- Every factual claim carries a source id from `../edo/content/sources.yaml` and a confidence word when not documented: (probable) or (contested).
- "Earliest known", never "first". Japanese names in Japanese order. Quotes 25 words or fewer.
- Yoshiwara: content note first; read, never played; no courtesan image as a game card; no score, timer, outcome or collectible. Shunga: named only, never shown.
- Any choice mechanic ends with a "What actually happened" reveal with its source. Simulations, colour separations and depth-plane cuts are labelled **Reconstruction**. Counterfactuals are labelled counterfactual.
- No points, XP, badges, streaks, leaderboards, timers, confetti, quiz gates. Feedback is informational ("the kiwame seal puts this before 1843"). Guesses are optional and skippable; show the guess as a hollow "ghost" and the truth in solid ink. No red/green right-wrong colouring: seal red is only for the censor and the 1842 ban.

## Censor seals (the unit's documented chronology; sources jaanus-aratame, vjp-seals)
- before 1790: no seal required
- 1790–1842 (to the reforms of 1842–43): **kiwame** 極 ("examined"), a small round seal; censors chosen from the publishers' own guild (gyōji) (probable for the exact office)
- 1843–1853: **nanushi** ward headmen's seals with their names: one seal, then two seals from 1847, then two with a date seal
- 1853–c.1876: **aratame** 改 ("examined"), usually with a separate **date seal**: zodiac year + month, e.g. 巳九 = year of the Snake (1857, Ansei 4), ninth month. Zodiac years used: 丑 Ox 1853, 寅 Tiger 1854, 卯 Hare 1855, 辰 Dragon 1856, 巳 Snake 1857, 午 Horse 1858, 未 Sheep 1859, 申 Monkey 1860.
- 1842 Tenpō orders: single-sheet prints of kabuki actors, courtesans and geisha banned; nothing above 16 mon; printings limited (probable); sets limited to three sheets (probable). Source kato-tenpo.

## Design and motion
- Washi/sumi palette, indigo accent; Shippori Mincho (display), Source Serif 4 (body), IBM Plex Sans (UI). Light and dark themes via the tokens (and `data-theme`).
- Motion tokens in `edo-tokens.css`. Productive motion for UI, expressive only for story moments. One primary motion per beat; exits faster than entries; no looping animation after first play; never block input on an animation.
- Respect `prefers-reduced-motion` and offer an in-page Motion toggle: camera moves become cuts, scrubs become states, parallax off.
- WCAG 2.2 AA: keyboard for everything (drag has a button/arrow-key alternative, SC 2.5.7), targets ≥ 24 px (44 px primary on touch), visible focus, contrast ≥ 4.5:1, `aria-live` for results, a text path for every visual outcome. Works at 390 px wide with a 16 px gutter and no horizontal scroll.
- 3D budgets (phones): ≤ 100 draw calls, ≤ 100k vertices, textures ≤ 2048 px, DPR capped at 2, render on demand, a static fallback if WebGL fails or frame time stays above 33 ms.

## Testing (required before you hand back)
- Serve `dist/` with `python3 -m http.server <port>` and screenshot with Playwright at 1440×900 and 390×844 (also `reducedMotion: 'reduce'` and dark `colorScheme`). Playwright: `require('/home/claude/creative-world/modules/F1-histories-of-making/build/lectures/node_modules/playwright/index.js')`, `chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })`. Look at your screenshots and fix what is broken. Report zero console errors.
- Optional: `npm i -D @axe-core/playwright` and run axe on the main states.
- Count files in `dist/` (excluding `index.html`) and report the number.

## Hand-back
Do not publish and do not git commit. Leave `dist/page.html` and `dist/` ready, add a `README.md` in your folder (what it is, how to build, licences), and report: what you built, file count, test results, known gaps.

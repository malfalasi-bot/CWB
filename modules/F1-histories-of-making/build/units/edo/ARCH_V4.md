# Edo unit v4 — architecture brief and ownership

This is the contract every builder works to. Read it whole before writing code.
Background: `reports/Atlas 3D map and game mechanics.md` (module root) and `research/edo-redesign-2026-10-04/REPORT_EDO_REDESIGN.md`.
The v3 build (scrolling story over a pinned stage: map, timeline, deep-zoom object, tools) works; v4 rebuilds the story layer, adds the labs, the 3D pieces, and a separate Atlas hub.

## What the user asked for (verbatim points, all must be met)
- Drop the investigative questions at the start of each chapter; questions become part of the experience, not premature or invasive.
- Rethink order, structure, learning methods and their connections; readings must not be "small blocks with a question" but a continuous, animated, visual scrollytelling.
- Group components that make a set, visually; main components of a unit/story must be distinct and consistent.
- Interactivity, animation, micro-interactions and tools must stop feeling primitive.
- The unit opens with an animated "3.5D" (layered-depth) scrollytelling that tells the whole concept and highlights ideas and events.
- Main people are interactive character cards: highlighted content, deeper story, achievements, body of work.
- Study and rebuild the map structure, design and interactions; the Atlas as a 3D map; game-like aspects and real (not points-and-badges) gamification, to award-winning level.
- Keep the visual direction (washi paper, sumi ink, indigo accent, seal red only for the censor and the 1842 ban; Shippori Mincho / Source Serif 4 / IBM Plex Sans).

## Hard rules
- Zero cost. Content and images only CC0, public domain, CC BY, CC BY-SA, ODC-By (ODbL/OSM not allowed). Code licences MIT/BSD/ISC/Apache only (no GSAP, no AGPL in the bundle).
- Runtime: one claude.ai Artifact for the Edo unit (and one for the Atlas). Scripts bundled by Vite (no CDN needed). No runtime fetch from other hosts; same-origin fetch of published files works. ≤ 255 files per publish (target ≤ 200 for Edo), ≤ 16 MB per file. Only plain `#anchor` hashes reach `location.hash` (letters, digits, `.` `_` `~` `-`), never `#k=v` or query strings.
- Editorial: confidence words (documented / probable / contested / argued); "earliest known", never "first"; quotes ≤ 25 words; Japanese names in Japanese order; content note before Yoshiwara material; the Yoshiwara contract is read, not played (no score, outcome, timer or collectible); shunga named only, never shown; anything reconstructed is labelled "reconstruction"; every choice ends on "What actually happened" with sources.
- No points, XP, badges, streaks, leaderboards, timers, confetti, completion percentages. Feedback is informational and appears on the instrument (ghost = your answer, hollow, 40% ink; truth = solid ink; never red/green). Everything optional and skippable; scrolling past a guess reveals it with nothing marked wrong.
- Accessibility WCAG 2.2 AA: every interaction keyboard-operable with visible focus; drag always has a button/arrow-key alternative (2.5.7); targets ≥ 24 px (44 px primary on touch); `aria-live` for results; reduced motion honoured via `motion.reduced` from `src/util.js` (scrubs become steps, flights become cuts ≤ 150 ms cross-fades, no parallax, no loops); no colour-only signals.
- Phones (390 × 844) are first-class.

## Motion tokens (in `src/styles.css`, mirrored in `src/3d/common.js` `ease`)
`--d-instant 70ms · --d-micro 110ms · --d-short 200ms · --d-medium 400ms · --d-long 600ms · --d-scene 900ms`;
`--e-standard (0.2,0,0,1) · --e-enter (0.05,0.7,0.1,1) · --e-exit (0.3,0,0.8,0.15) · --e-productive (0.2,0,0.38,0.9) · --e-expressive (0.4,0.14,0.3,1)`.
Rules: one primary motion per beat; enter = fade + 8–16 px translate; exit ≈ 0.6 × enter; list stagger 40–60 ms, total ≤ 300 ms; forward in time moves left→right or zooms in; seal red arrives only as a stamp (scale 1.06 → 1, `--d-short`); nothing loops after its first play; input never waits on animation (interrupt and retarget); springs only for direct manipulation (`spring()` in common.js).

## Shared code (exists; import, don't fork)
- `src/util.js`: `$`, `$$`, `el()`, `esc`, `motion {reduced, set, on, dur}`, `Scope` (owns timeouts/intervals/rAF/tweens; `dispose()` stops everything), `eraOf`, `renderText`, `imgUrl(id, kind)`, `provenance(meta)`.
- `src/3d/common.js`: `THREE`, `makeStage(container, {ortho, fov, tier, onTier})` (render-on-demand, DPR cap, frame-time probe that drops a tier), `loadTex`, `token('--paper')` (CSS colour → THREE.Color), `paperOverlay()`, GLSL `GLSL_PAPER`, `GLSL_BLEED`, `ease`, `spring`, `webglOK`, `initialTier`. Load it and three only via dynamic `import()`.
- Tokens in `src/styles.css`: `--paper --paper-2 --paper-3 --ink --ink-2 --ink-3 --line --line-2 --indigo --indigo-2 --indigo-soft --indigo-line --seal --seal-soft --shadow --serif --display --ui` plus season colours. Light and dark both defined; never use literal colours except inside a texture.
- `public/content.json` is built by `node scripts/build-content.mjs` from `content/*.yaml` (story, people, timeline, places, sources) + `content/images.json`, `content/peel.json`, `content/sprites.json`. Images: `public/img/<id>.webp` (full), sprites `public/img/sprites/*.webp` indexed in `content.sprites` (`{index: {id: [sheet, x, y, w, h]}, sheets: {sheet: [W, H]}}`) for every thumbnail (`t-*` ids = 200 px thumbs of each full image; `hv-NNN` = Hundred Views). Overture planes: `public/img/ov/wave-p0..p4.webp` (p0 = back with sea inpainted, p1 far swell, p2 near swell, p3 the great wave, p4 foreground foam; 1600 × 1075 RGBA, all aligned), `public/img/ov/map-1859.webp` (2048 px). Peel layers `public/img/peel/*.webp` + `content.peel`. Three aligned Waves `public/img/waves/{jp1847,jp10,aic}.webp`.

## The lab module interface (every lab, 2D or 3D)
```js
// src/labs/<id>.js   (3D ones may live in src/3d/ and be re-exported)
export default {
  id: 'print', title: 'Print the Wave', kicker: 'Lab · reconstruction',
  // mode: 'stage' (inside the pinned stage, beside the story; compact, guided, ≤ 60 s of attention)
  //       'room'  (full-screen room reached from a link; the full playable version)
  async mount(root, ctx) { /* build DOM/canvas inside root */ return { destroy() {}, describe() { return 'one sentence for screen readers'; } }; },
};
// ctx = { C,            // content.json
//         scope,        // Scope: register EVERY timer/raf/tween here; it is disposed on leave
//         motion,       // from util.js
//         mode,         // 'stage' | 'room'
//         params,       // e.g. { anchor: 'censor' } or { print: 'hv-030' }
//         imgUrl, sprite(id) -> { url, x, y, w, h, W, H } | null,
//         store: { get(key, fallback), set(key, value) },   // localStorage namespaced 'edo4:', wrapped in try/catch
//         onResolve(r), // tell the story something was learned: { band: 'kiwame' } | { events: ['e1842'] } | { people: ['tsutaya'] }
//         openRoom(id, anchor), openPerson(id), openImage(id) }
```
Register the module in `src/labs/index.js` (owned by the Story builder; others tell the coordinator their ids). Each module owns its CSS in `src/labs/<id>.css`, imported from the module, using only the tokens. Class names prefixed with the lab id (e.g. `.print-…`). Every lab: a "workbench" frame (2 px indigo border, label like `LAB · reconstruction`, reset button top-right), a text "What this shows" summary, its own sources list (title + URL + confidence) rendered at the foot, keyboard-complete, reduced-motion path, mobile layout.

## Rooms
Full-screen panels over the page, opened by links in beats (`links: [{to: desks|workshop|views, anchor, label}]`) and from the bar menu; hash `#room-desks`, `#room-desks.censor`, `#room-workshop`, `#room-views.hv-030`. The Story builder owns the room shell (header, close, tabs, focus trap, Esc, back-button). Rooms host lab modules in `mode: 'room'`:
- **Desks**: tabs Seal Timeline · Catalogue Desk · Censor's Desk.
- **Workshop**: Print the Wave.
- **Views**: Step into the View (three Hiroshige prints) · The uki-e box.

## Ownership (do not edit files you don't own; ask the coordinator)
| Builder | Owns |
|---|---|
| Story (core) | `index.html`, `src/main.js`, `src/story.js`, `src/guess.js`, `src/rebuild.js`, `src/rooms.js`, `src/overture.js`, `src/labs/index.js`, `src/styles.css`, `src/util.js` (additive changes only), `content/*.yaml`, `scripts/build-content.mjs`, `scripts/prep-*.py`, `src/config.js` |
| Cast & instruments | `src/cards.js` + `src/cards.css` (character chip → card → sheet, Cast deck), `src/map.js`, `src/timeline.js`, `src/viewer.js`, `src/labs/compare.js|css`, `src/labs/edition.js|css`, `src/labs/contract.js|css` |
| Desks | `src/labs/sealtimeline.js|css`, `src/labs/catalogue.js|css`, `src/labs/censor.js|css`, `public/data/desks.json`, `public/img/desk/*`, `harness/desks.html`, `build/assets/edo-v4/desks.csv` |
| Workshop | `src/labs/print.js|css` (+ `src/labs/print/*`), `public/img/print/*`, `public/data/print.json`, `harness/print.html` |
| Depth | `src/3d/opener.js`, `src/3d/planes.js`, `src/labs/view.js|css`, `src/labs/ukie.js|css`, `public/img/views/*`, `public/img/ukie/*`, `public/data/views.json`, `scripts/prep-views.py`, `harness/opener.html`, `harness/views.html`, `build/assets/edo-v4/views.csv` |
| Atlas | everything under `build/atlas-hub/` (separate project and artifact) |

File budget for the Edo artifact: Desks ≤ 20 new files, Workshop ≤ 10, Depth ≤ 25. Prefer packing (one sprite sheet, one JSON) over many files. Images WebP (quality ~80), longest side ≤ 2400 px for hero planes, ≤ 1600 otherwise.

## Fetching new open-licence images
The shell cannot reach museums. Use the repo's workflow: write a manifest CSV at `modules/F1-histories-of-making/build/assets/edo-v4/<name>.csv` with the header
`id,holder,accession,title,maker,date,licence,credit,url,max,thumb` (see `build/assets/edo-v3/manifest.csv`; URLs must be the holder's own open-access image URL, verified CC0/PD on the holder's record page — Met `images.metmuseum.org/CRDImages/...`, AIC IIIF `https://www.artic.edu/iiif/2/<image_id>/full/843,/0/default.jpg` or larger, Wikimedia `upload.wikimedia.org`). Then commit ONLY that CSV and push to main (`git pull --rebase` first; commit message ends with the two attribution lines below), dispatch the workflow with `gh api -X POST repos/malfalasi-bot/CWB/actions/workflows/assets.yml/dispatches -f ref=main -f 'inputs[manifest]=edo-v4/<name>.csv' -f 'inputs[max]=2400'`, poll `gh api repos/malfalasi-bot/CWB/actions/runs?per_page=5`, then `git fetch origin <assets/...branch>` and copy the files out with `git show origin/<branch>:<path> > file` (do not merge the branch). Commit attribution lines:
```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01LKYDdJ9LdqhdSWKLTkaZPx
```
Never commit anything else; the coordinator commits the build.

## Testing
Each builder tests in its own harness page with the Vite dev server on its own port: `npx vite --port <port> --strictPort --host 127.0.0.1` from `build/units/edo` (Story 5170, Desks 5171, Workshop 5172, Depth 5173, Cast 5174). Do not run `npm run build` (the coordinator does), except Story. Screenshot with Playwright: `require('/home/claude/creative-world/modules/F1-histories-of-making/build/lectures/node_modules/playwright')`, `executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`, desktop 1440 × 900 and phone 390 × 844 (`isMobile`, `hasTouch`), light and dark (`colorScheme`), and `reducedMotion: 'reduce'`. Look at your screenshots and fix what you see. No console errors.

## Hand-off between artifacts
Atlas URL goes in `src/config.js` (`ATLAS_URL`, placeholder until published). Edo artifact URL: `https://claude.ai/artifact/73RSURL2MWqJpyJuh4mdh6`. The Edo coda links to the Atlas with `#from-edo.<ids>` where ids are Edo people/place ids the learner engaged (letters, digits, dash), joined with `.`; the Atlas inks matching nodes and stores them in its own localStorage.

## Cross-module APIs (fixed; build to these)
**Cast** (`src/cards.js`, Cast builder):
```js
export class Cast {
  constructor(C, { store, onGo(beatId), onShowPlace(placeId, scale), onShowYear(year), onOpenImage(id) })
  decorate(container)   // turn every button.who[data-person] inside into an inline chip (28 px portrait or hanko mark + name); idempotent
  meet(id)              // mark met (first encounter): chip flies to the Cast button, deck counter ticks; no-op if met
  open(id, trigger)     // open the person's sheet (dialog), focus management, Esc closes and returns focus to trigger
  mountDeck(parent)     // the "Cast" button (bottom-left) + deck grid dialog (all people; unmet as silhouettes)
  met() -> string[]     // ids met so far (for the Atlas hand-off)
}
```
The Story builder calls `decorate()` on each rendered scene, `meet(id)` when a beat that names a person becomes active, and routes `[data-person]` clicks to `open()`.

**Instruments** (Cast builder keeps the v3 APIs and adds): `MapStage.show(stage, year, instant)`, `MapStage.guess(spec, onAnswer)` (tap/route guess on the current map: options as tappable targets with keyboard list; returns `{reveal(), destroy()}`), `Timeline.show(stage, year, showIds, instant)`, `Timeline.guess(spec, onAnswer)` (drag a marker on the axis; arrow keys move it 1 year, PageUp/Down 10; returns `{reveal(), destroy()}`), `Timeline.placeTiles(tiles, onDrop)` for the act Rebuild (time mode), `MapStage.placeTiles(tiles, onDrop)` (map mode), `Viewer.show(stage)` and `Viewer.guessTap(spec, onAnswer)` (tap the marks). The Story builder owns `src/guess.js`, which renders the prompt UI in the beat and delegates to these for instrument-native answers; slider/choice/bet/order guesses render inline in the beat.

**Overture** (Depth builder, `src/3d/opener.js`): `export default { async mount(root, ctx) -> { setProgress(p /* 0..9, shot index + fraction */), destroy(), describe() } }`. Shots, in order: `paper` (washi, 浮世 title bleeds in), `wave` (the five wave planes separate in depth, camera dollies in), `shop` (the Wave shrinks onto a shop wall: printshop image), `blocks` (the peel colour layers drop onto kentō marks), `edo` (the 1859 map plane tilts flat; publisher pins rise; the Tōkaidō draws west), `seal` (a kiwame seal stamps, the only seal red), `sea` (world outline; a route draws Yokohama → Paris; Bing's *Le Japon artistique* cover), `return` (the Wave comes back inside a schematic banknote outline — never a photo of the note), `contents` (five stacked blocks labelled with the five acts; each a link). The Story builder owns `src/overture.js`: the scroll section, caption text per shot (from `story.yaml` `overture.shots`), the skip link, and the still-image fallback when WebGL is missing or the module fails; it calls `setProgress` from scroll. Under reduced motion `setProgress` receives integers only and the module cuts between composed stills.

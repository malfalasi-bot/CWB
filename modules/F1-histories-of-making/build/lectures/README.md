# F1 lectures on Motion Canvas

The lecture production template (audit of 3 October 2026, §9) and the first lecture, F1.13 Networks.

- `src/house/`: the house components. Timeline (the eleven bands B01–B11, a scrub marker, spans with fuzzy ends), WorldMap (an equirectangular outline from the `world-atlas` package, places as dots, routes as arcs that draw themselves, people as their own mark and never as a flow of goods), Chain, Caption (claim id and confidence word on every factual line), Legend, ObjectCard, and the Station runner, which plays a lecture from JSON.
- `src/lectures/f1-13.json`: the F1.13 lecture as data, built by `scripts/build-lecture-json.py` from `F1.13/NARRATION.md` and `F1.13/STORYBOARD.md`.
- `src/scenes/f1-13.tsx`: binds the data to the house; mechanism moments would be hand-written here.
- `player/`: the in-page player. `npm run build` bundles the project, `npm run build:player` the page; copy `dist/src/project-*.js` to `dist/player/project.js` and serve `dist/player`.
- `scripts/contact-sheet.mjs`: plays the lecture in headless Chromium and screenshots the start of each station; `F1.13/contact_sheet.png` is the result of 4 October 2026.

Known polish for the next pass: map labels overlap where places sit close (station 4); timeline event labels stack at one date; the object card leaves a faint ghost after it fades; the legend clips its longest line. Narration audio (Kokoro, Apache 2.0) is not yet generated from the script.

Licences: Motion Canvas MIT; world-atlas ISC (Natural Earth, public domain); Playwright Apache 2.0 (dev only).

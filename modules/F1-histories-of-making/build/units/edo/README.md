# Edo and the floating world — unit build (v3)

The Edo unit rebuilt to the plan in `research/edo-redesign-2026-10-04/REPORT_EDO_REDESIGN.md`:
five acts on five publishers' bets, one pinned stage driven by the story column.

- **Content** lives in `content/*.yaml` (story, people, timeline, places, sources). `npm run content` validates it with zod and lints it:
  beats of 40–100 words, no sentence over 25 words, every reference resolvable, and no two consecutive beats with the same instrument state.
- **Instruments**: `src/map.js` (world in Equal Earth, Japan and the Kantō on a 10 m coastline, and the 1859 Library of Congress map of Edo with a fitted georeference),
  `src/timeline.js` (lanes, lifespans, censor bands, price lane with the 1842 cap, print runs, era years), `src/viewer.js` (OpenSeadragon deep zoom with anchored marks).
- **Tools** (`src/tools.js`): peel the print, three Great Waves, read the margin, an edition, the contract (read, not played), and the closing recall.
  On phones the tools render inside their beat's card.
- **Engine**: `src/main.js` holds the stage controller; every timer belongs to a `Scope` (`src/util.js`), so leaving a beat stops all drawing.

```
npm install
npm run build        # content lint, vite build, dist/page.html for the artifact
npm run shots -- out b4-3 b6-4   # screenshots (desktop and phone) against a server on :8790
```

Fonts come from Google Fonts (Shippori Mincho, Source Serif 4, IBM Plex Sans; all OFL). Images are open licence only; credits are in `public/img/images.json`.
Published: https://claude.ai/artifact/73RSURL2MWqJpyJuh4mdh6

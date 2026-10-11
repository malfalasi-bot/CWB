# Atlas hub: completeness audit (read-only)

Audited 2026-10-12 against the "Atlas hub" table in `reports/Atlas 3D map and game mechanics.md` (lines 113–123), `research_notes/Atlas 3D map and game mechanics/atlas_3d_map.md` (Q2–Q3), `build/atlas-hub/README.md` and `build/units/shared/LINKS.md`. Paths are under `build/atlas-hub/` unless stated; bare file names sit in its `src/`.

## 1. Planned features and their status

| Plan row | Feature | Status | Where (file · function) | What is partial or missing |
|---|---|---|---|---|
| P0 | Data preparation (subset, units marked, territories, timed routes, lens definitions) | built | `scripts/build_data.py` → `public/data/atlas.json`, `nodes.json`; `model.js` · `LENS_DEF`, `loadData` | 1,218 nodes (796 pinned), 38 units (9/15/14 territory/lens/method), 51 routes with `s`, `src`, `c` |
| P0 | List twin (primary view) | built | `panel.js` · `renderPanel`, `worldPage`, `chapterPage`, `unitPage`, `storyPage`, `nodeCard` | — |
| P0 | 2D Place surface | built | `map2d.js` · `Map2D.draw`, `drawLines`, `drawMarks` | Equal Earth SVG, every globe layer |
| P0 | State in the URL hash | built | `state.js` · `stateTokens`, `writeHash`, `parseHash` | tokens `u n s l y v`; `s-` accepts only `edo` |
| P0 | Hand-off token read and inked | built | `state.js` · `parseHash` (`#from-edo.a.b` and `#ink.edo.a~b`); `ink.js` · `ingest`, `derive`; `main.js` · `handleHandoff` | `ingest` accepts only `unit === 'edo'`. The Edo unit sends only Cast people met (`build/units/edo/src/rebuild.js:263` ← `cast.met()`), never the 54 events, 38 places or 6 steps `edo.items` could ink. Edo ignores the `#from.atlas` return token (no handler in `build/units/edo/src/main.js`; `story.js:153` links unconditionally) |
| P0 | Keyboard operability | built | `labels.js` (labels are `<button>`s in priority order); `globe.js` · `onKey`; `map2d.js` · `nav`; `main.js` · `bindKeys`, `climb`, `announce`; `index.html` `#nav` (SC 2.5.7) | — |
| P1 | Globe | built | `globe.js` · `Globe.init`, `buildLines`, `buildMarks`, `updateMarks`; `scene.js` · `clusterIndex`, `regionMarks` | Three draw calls |
| P1 | Tiers world / region / unit | built | `state.js` · `set` (derives `S.tier`); `globe.js` · `tierFromZoom`; `main.js` · `syncTier` | — |
| P1 | Routes drawn by year | built | `model.js` · `lineTime`; `globe.js` · `updateLines` (state texture; `vU > vP` discard in `LINE_FS`); `map2d.js` · `drawLines` (`pathLength` dasharray) | Progress is a span heuristic (`clamp(40,300,(e−s)·0.25)`), not per-stop dates; only `perry` has stop dates, as unused text |
| P1 | Year scrubber and play | built | `main.js` · `buildTimeBar`, `startPlay`, `stopPlay` | Fixed 16 s sweep; stepped under reduced motion |
| P1 | van Wijk camera | built | `globe.js` · `flyTo` (`interpolateZoom.rho(1.35)`), `flyToTerritory`, `flyToNode`, `flyToEdo`, `home` | `Map2D.flyTo` is a plain d3 zoom transition |
| P1 | Kinun veil into the 1859 sheet | built | `veil.js` · `Veil.open`, `close`, `buildSheet`; `main.js` · `react` | Hard-wired to `M.atlas.edo`; one sheet |
| P1 | Guiding ink current | partial | `scripts/build_data.py:818–830` (`neighbours`); `panel.js` · `chapterPage` | Data and list tags only; nothing drawn |
| P1 | Reduced-motion fade-cuts, no auto-rotate | built | `globe.js` · `flyTo` cut branch (140 ms opacity); `veil.js` `is-cut`; `main.js` · `startPlay`; `styles.css:361` | `Map2D.flyTo` cuts hard, no fade. No auto-rotation anywhere |
| P1 | Quality tiers by frame time | built | `globe.js` · `probe` (→ `uQ`, DPR 1, then map) | — |
| P1 | Static fallback | partial | `main.js` · `ensureGlobe`, `setView` → `Map2D`; `index.html` `<noscript>` | No static image; the fallback is the live SVG map |
| P2 | Rumour log | built | `ink.js` · `whyEdges`, `addWhy`; `panel.js` · `nodeCard`; `main.js` · `openNotebook` | Contested edges marked uncompletable |
| P2 | Cast Codex across units | partial | `ink.js` · `derive` accumulates edges per node; `nodeCard` | Only Edo can feed it; no person card beyond the node card; 11 `canonRefs` |
| P2 | Lens kit | partial | `ink.js` · `practiseLens`, `lensesPractised`; `main.js` · `openNotebook` | Listed; no naming or annotation |
| P2 | Notebook export / import | built | `ink.js` · `exportCode`, `importCode` | Same `ink.<unit>.<ids>` tokens |
| P2 | Lenses | partial | `model.js` · `LENS_DEF`, `lineSet`, `washes`, `nodeMatchesLens`; `main.js` · `toggleLens` | 10 of 15 lens units defined; the rest say "no lens layer yet" |
| P2 | "Carry It" journeys | missing | — | Deferred by the plan |
| P2 | Space-time cube | missing | — | — |
| P3 | World packs | missing | — | Only day/night (`main.js` · `applyTheme`) |
| P3 | Archive mode | missing | — | `uQ` lowers noise only |
| P3 | Cohort density | missing | — | No shared state; correctly absent |
| README | Teacher view by URL | partial | `state.js` hash | Any state addressable; no teacher page |
| README | "How we built" note | built | `panel.js` · `about`; `README.md` | — |
| Reject | Dot cloud, meters, tile servers | rejected | `scene.js` · `worldMarks` draws only inked marks at world tier | — |

## 2. What a layered, documentary-style experience would reuse

Everything hangs off one state object `S` (`state.js`) and one subscriber `react` (`main.js`). `boot()` exposes `window.__atlas = { S, M, INK, set, globe, map, veil }`, so everything below is scriptable today through a debug handle, not an API.

- **Camera.** `Globe.flyTo(lon, lat, d, opts)` returns a Promise and honours `S.motion`; also `flyToTerritory`, `flyToNode`, `flyToEdo`, `home`, `nav`, `tween`. Driven by UI clicks and by `react` on state change; hash tokens `#u-`, `#n-`, `#s-` place it instantly on load (`placeSurfaceForState`). Duration is internal (700–2,600 ms), one animation slot (`this.anim`) that any pointerdown clears, no queue. `Map2D.flyTo` returns nothing.
- **Route ribbon mesh.** Built once (`buildLines`); appearance comes entirely from `lineSet(S)` + `lineTime(l, S.year)` written into a two-row state texture (`updateLines`: alpha, progress, dash, width, colour). Driven by the year value, lens and focused unit; hash `#y-`, `#l-`, `#u-`. Scriptable via `set({year})`. No per-route override: to light one route you change `S` and let `lineSet` recompute.
- **Labels.** `updateLabels(items, {max})` (`labels.js`) is a generic greedy placer, but `Globe.drawOverlay` / `Map2D.drawLabels` call it each frame with fixed item sets from `scene.js`, so external items would be overwritten. Camera and tier driven only.
- **Veil.** `Veil.open()/close()` return Promises, run on `S.story` via `react`; hash `#s-edo`. Reusable as a transition only for the Edo sheet (`buildSheet` reads `M.atlas.edo`).
- **Year state.** `S.year` (null = all time), set by the scrubber, by `#y-1600`/`#y-m500`, and by `startPlay`'s sweep. Lines, clusters (`clusterIndex`), node visibility (`nodeInTime`) and `retime` read it. Scriptable via `set({year}, {silentHash:true})`.
- **Ink and announcements.** `INK` (`derive`), `inkState`, `announce()` (aria-live), the `handleHandoff` toast: reusable; ink is hash-driven.

## 3. What a scripted scene over the globe would need that does not exist

| Need | Nearest existing hook | Effort |
|---|---|---|
| Camera path / keyframe sequencer (chained flights, holds, explicit durations, both surfaces) | `flyTo` Promise; `Map2D.flyTo` needs a `transition().end()` wrapper; no duration parameter | M |
| Timeline-driven clock (rate, from/to, seek, ticks) | `startPlay`/`stopPlay`, `sliderToYear` | S–M |
| Pause / resume of flight, clock, veil, pulse | `this.anim` single slot; `playing`; veil uses `setTimeout` waits | M |
| Caption track synced to the clock, aria-live, keyboard "next" | `announce()`, `#tier`, `.toast` | S–M |
| Per-feature highlight/dim by id | `lineSet` is state-derived; mark flag bit 1 = selected node; sphere `uTS[i]` = selected chapter | M |
| Focus mask (dim outside a lon/lat circle) | sphere limb darkening only | S (CSS overlay) – M (shader uniform) |
| Open a scene from a unit's hash (`#sc-<id>` + registry) | `parseHash`, `handleHandoff` (goes to F1.8 only) | S |
| Dated, placed events as data | none (§4); `exhibitions` is the only dated point layer | S for the schema in `build_data.py`; content extra |
| Route progress by stop dates | `perry` stop dates are text; `lineTime` ignores them; `aU` per vertex | M |
| Scene labels that survive the per-frame label pass | `updateLabels` | S |
| Scene format and loader | none | M |

Roughly 10–20 days in all; the state texture and Promise-based flights make this additive, not a rewrite.

## 4. The data

**Routes (`public/data/atlas.json` → `routes`): 51.** 46 `route`, 3 `copy`, 2 `extraction`; 4 Edo-case (`voc`, `perry`, `mm`, `edo-copy`). All 51 have a start `s`, 42 an end `e`; 14 `major`, 1 `contested`. Stops per route 2–21 (fields `n x y stop a m date`); only `perry` has per-stop dates (12 of 21, text such as "Jan 1853"). Ids: silk, steppe, tarim-south, teahorse, indianocean, arabiansea, bengal, nanhai, sahara-w, sahara-e, kilwa, dhow, meluhha, assur, lapis, obsidian-ana, lba, phoenician, roman-red, medmed, venice, amber, varangian, volga, hansa, grandtrunk, incense, redsea, voc, carreira, atlantic, trafficking-benin, trafficking-wca, galleon, galleon-atl, obsidian-mes, turquoise, qhapaq, austronesian, austronesian-w, lapita, trepang, fur, cotton-atl, rubber, guano, porcelain-copy, calico-copy, perry, mm, edo-copy. Also 48 `provenance` arcs and 8 `exhibitions` (dated, placed, 1851–1935).

**Edo-unit places.** 18 nodes with `f: 'edo'` in `nodes.json` (`edo-` + edo, kyoto, osaka, nagasaki, yokohama, kanagawa, echizen, amsterdam, batavia, paris, london, boston, newyork, chicago, washington, sanfrancisco, marseille, berlin), none with a year. 8 pins on the 1859 sheet (`edo.pins`: castle, nihonbashi, toriaburacho, bakurocho, ryogoku, saruwakacho, asakusa, shinohashi). `edo.items`: 139 hand-off ids (54 event, 41 person, 20 city place, 18 place, 6 step); `canonRefs` 11; `eras` 41.

**Events.** No event collection exists. The 54 `edo.items` events are hand-off tokens only: `{label, type, place}`, the year folded into the label string (`build_data.py:575` drops `e['year']`), `place` an id resolved via the `edo-<place>` node, no coordinates, no link to routes or the scrubber. The 8 exhibitions are the only dated-and-placed events the surfaces draw.

**Counts.** Routes 51 (46/3/2), with years 51/42, with stop dates 1; provenance 48; exhibitions 8; nodes 1,218 (796 pinned, 814 with a start year); Edo nodes 18; Edo pins 8; Edo items 139 (54 events); units 38; territories 9; lenses 10 defined of 15 lens units.

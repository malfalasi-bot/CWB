# Atlas of Making (F1 Atlas hub)

The hub of module F1 *Histories of making*: a paper-and-ink globe on which the nine world chapters (F1.6–F1.12a) lie as soft brushed washes, the thematic units are lenses that recolour it, and every mark starts pale and takes ink only when the learner has engaged it. It is the entry point into the Edo story (inside F1.8, read through the workshop). One claude.ai Artifact, separate from the units.

## Views

- **List** (primary, complete): worlds → units → stories → nodes, node cards with the rumour log ("why this mark": each edge with its relation and source). Every surface state has a page here.
- **Map**: d3-geo Equal Earth SVG with every layer the globe has (the fallback when WebGL is missing or slow).
- **Globe**: three.js, three draw calls: a shader sphere (washi, land and a crisp sumi coast from a baked distance field, coastal water lines, graticule, nine brushed washes with per-chapter stroke direction, pencil contours that turn to ink), one merged ribbon mesh for all routes and arcs (state texture: visibility, draw progress by year, dash, ink), one instanced mesh of glyph marks. Render on demand, DPR ≤ 2 (1.5 on phones), frame-time probe lowers quality then falls back to the map.
- Tiers: world (washes, routes, ≤ 12 labels on phones), region (supercluster bubbles by kind), unit (the kinun veil parts onto the 1859 Edo sheet; "Open the Edo unit" opens a new tab). Flights follow van Wijk and Nuij (d3 `interpolateZoom`); reduced motion turns them into fade-cuts and never auto-rotates.

## URL state (plain tokens, joined by `~`)

`#u-F1.8` unit · `#n-PLC207` node card · `#s-edo` story (unit tier) · `#l-F1.13` lens · `#y-1600` / `#y-m500` year · `#v-map` / `#v-list` view.
Hand-offs: `#from-edo.tsutaya.hokusai.edo` or `#ink.edo.tsutaya~hokusai` (the format in `build/units/shared/LINKS.md`). The ids are stored in this Artifact's localStorage (try/catch) and ink the matching marks. The field notebook exports and imports the same tokens.

## Data (scripts/)

`npm run data` runs `build_data.py` (canon → `public/data/atlas.json`, `nodes.json`) and `build_textures.py` (Natural Earth → `land.json`, `tex/land-*.png`, `tex/terr.png`). Python 3.9+, shapely, numpy, scipy, Pillow, PyYAML.

- **Place-anchored subset only.** Of 4,666 canon rows (25 kinds), only kinds *place*, *maker community* and *institution* (771 rows) become marks. They are geocoded by exact Natural Earth populated-place names inside the row's own sub-regions, then exact Pleiades titles, then a city named in the record. 81 are exact, 259 approximate (drawn as soft blots), 422 name only a sub-region and are **listed but never pinned** (no coordinates are invented), 9 could not be placed and are dropped. 327 open world-set objects are placed at their **holders** (never at an origin); 47 without a placeable holder are dropped. 111 route stops, 18 Edo-unit places.
- **Territories**: Natural Earth admin-0 (world-atlas 50m, public domain) grouped by the canon's sub-region codes (`data-src/subregions.json`, clip boxes documented there). A chapter uses each sub-region holding ≥ 3.3 % of its rows (≥ 1 % in its home continent), weighted by row share, softened and blurred 1.5°. Overlaps (the Islamic world over the Maghrib, Egypt, Sahel and Iberia; West Asia before Islam over Egypt and Greece) are intentional.
- **Routes**: 51 schematic great-circle routes through named stops, each with its canon network id (or Edo-unit source) and confidence; forced passages are drawn in plain ink, never as goods. 48 provenance arcs (sub-region → current holder, from the world set and harvest), 8 exhibition cities.
- **Edo matches**: Edo ids map to canon nodes by exact name (same region for places): tsutaya → PER205, hokusai → PER206, oi → PER207, edo → POL183, nagasaki → INS025/PLC207, amsterdam → PLC353/INS110. Records that merely name a person become rumours (e.g. MKR043 names Tsutaya).

## Licences

Code: three.js (MIT), d3-geo / d3-zoom / d3-selection / d3-interpolate / d3-transition (ISC), supercluster (ISC), topojson-client (ISC), Vite (MIT). Data: Natural Earth (public domain), Pleiades (CC BY 3.0), canon register (project). Image: *Ansei kaisei Oedo ōezu* (1859), Library of Congress 77694812, public domain. Fonts: SIL OFL via Google Fonts. No OSM/ODbL, no runtime fetch from other hosts.

## Build and test

`npm run build` → `dist/` and `dist/page.html` (skeleton tags removed for the Artifact host). `python3 -m http.server 5180 -d dist`, then `node scripts/shots.mjs <outdir> [filter]` for the Playwright screenshots.

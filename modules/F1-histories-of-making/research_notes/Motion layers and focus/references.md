# Motion layers and focus: precedents and conventions

Scope: map/globe stories where a sequence or timeline drives the map. Every URL was fetched or returned by search on 2026-10-12. Pacing figures are observations or template defaults.

## 1. Precedents

| # | Precedent | URL | What it does on the map | Pacing | Time control | Lesson for us |
|---|---|---|---|---|---|---|
| 1 | NYT, *How the Virus Got Out* (2020) | https://www.nytimes.com/interactive/2020/03/22/world/coronavirus-spread.html | Starts tight on Wuhan market; each step zooms out one ring (city, China, world); travel flows draw as particle streams; bold figures ("first known cases", "nearly 1,000 cases") sit in short text cards over the map | Scroll-driven; one map state per ~2-3 sentence card | Scroll (sticky map, text steps) | Zoom out in concentric rings; put the number in the caption, not on the map |
| 2 | NYT, *Climate Change Claims a Lake* (2016) | https://www.nytimes.com/interactive/2016/07/07/world/americas/bolivia-climate-change-lake-poopo.html | Opens with a locator map (La Paz, Lake Poopó) then falls into satellite imagery of the drying lake as text scrolls | Scroll-driven, long holds on each still | Scroll | Locator first, then descend; a still can be a "beat" |
| 3 | Mapbox Storytelling template | https://github.com/mapbox/storytelling | Each chapter = camera (center, zoom, pitch, bearing) + layer opacity changes `onChapterEnter`/`onChapterExit`; `mapAnimation: flyTo|easeTo|jumpTo`; optional `rotateAnimation` ("Rotates 90 degrees over 24 seconds"); optional `auto` advance; inset globe minimap | flyTo default; chapter length set by text height | Scroll (Scrollama); optional autoplay | Layers are dimmed by opacity, never hidden; restore state on re-entry; the inset globe keeps world context |
| 4 | Mapbox blog, *How to build a scrollytelling map* | https://www.mapbox.com/blog/how-to-build-a-scrollytelling-map | Text-card `alignment` (left/right/center); markers off with custom layers; opacity 0-1 per layer | Scroll-driven | Scroll | Decide where the caption sits before composing the camera |
| 5 | MapLibre `FlyToOptions` (Mapbox-compatible) | https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/FlyToOptions/ | Camera flight along a zoom-out/zoom-in arc; `curve` default 1.42, `speed` default 1.2 screenfuls/s; `maxDuration` cap; `minZoom` floor | Duration is derived from distance unless capped | n/a (engine) | Flight time grows with distance; cap it so far jumps don't drag |
| 6 | The Pudding, scrollytelling process posts | https://pudding.cool/process/how-to-implement-scrollytelling ; https://pudding.cool/process/introducing-scrollama/ | Sticky graphic, text steps trigger state changes; step "progress" 0-100% available; triggers at mid-viewport | Reader-paced | Scroll (IntersectionObserver) | "It does not alter scroll behavior, but simply monitors it" — never scroll-jack |
| 7 | Esri ArcGIS StoryMaps, guided map tour and sidecar | https://esri.com/arcgis-blog/products/arcgis-storymaps/constituent-engagement/now-available-in-arcgis-storymaps-guided-tour-beta ; https://developers.arcgis.com/documentation/app-builders/no-code/arcgis-storymaps-story-blocks | Numbered places; map recentres on each stop; up to 5 media per stop; map-focused vs media-focused layouts; sidecar slides change map location/layers per slide; readers may still pan | Scroll per stop/slide | Scroll, numbered stops | Number the stops; offer a map-first and a media-first layout |
| 8 | Knight Lab StoryMapJS (review) | https://worldhistorycommons.org/storymapjs-maps-tell-stories | Slide deck pinned to places; arrows advance "in a predetermined order"; headline + text + media per slide; guidance: <=20 slides, logical geographic progression | Author-set, reader-stepped | Next/prev arrows | A stepper with a fixed order is enough for a lecture route |
| 9 | Bellingcat MH17 convoy StoryMap | https://www.bellingcat.com/news/uk-and-europe/2015/10/08/exploring-russias-53rd-brigades-mh17-convoy-with-storymap | A dated convoy route told as slides on a map (StoryMapJS) | Stepped | Arrows | Dated stops along one route is a strong evidentiary form |
| 10 | Stanford ORBIS | http://orbis.stanford.edu/ (reviewed at https://classicalstudies.org/scs-blog/leprechan/review-orbis-stanford-geospatial-network-model-roman-world) | Pick origin/destination, month, priority; route draws colour-coded (fastest purple, cheapest green, shortest yellow); bar shows days and distance; per-leg timeline | On demand, no animation | Form inputs, then "Calculate route" | Show duration and distance beside the route; let month change the result |
| 11 | Google Earth Voyager (Explorers: Marco Polo, Ibn Battuta, Zheng He; 250 Miles to Freedom) | https://www.google.com/earth/education/explore-earth/ | Guided tours on the 3D globe built from placemarks, lines, shapes, with Street View/3D viewpoints and rich media per card | Card-stepped; globe flies between cards | Next/prev cards | Historical journeys fit the globe; each card is one place and one viewpoint |
| 12 | Google Earth Studio keyframes | https://earth.google.com/studio/docs/making-animations/keyframes | Camera position/rotation keyframed; tweens between keyframes; J/K jump between keyframes | Author-set per frame | Timeline scrub (authoring) | Author camera as keyframes, then expose them as the learner's steps |
| 13 | NatGeo / Harvard CGA, *Out of Eden Walk* route map | https://gis.harvard.edu/out-eden-walk | Full GPS walking route; 500 m simplified line; dispatches as point maps; 3D globe animation of 2013-2023 track as video | Video for the animated version; static for the map | Pan/zoom only; video for time | Keep the full route visible; animate time separately from exploration |
| 14 | Mapping the Republic of Letters | http://republicofletters.stanford.edu/index.html | Correspondence networks drawn as arcs between cities per case study (e.g. Franklin 1757-63), with time-based inquiry | Static interactive | Filters/date ranges | Arcs + date filter is the pattern for "who wrote to whom when" |

## 2. Conventions that recur

1. **One focus per beat.** Each chapter/slide/stop sets one camera and one layer change (3, 7, 8, 11). ONS: works best when it presents "one point at a time" (https://digitalblog.ons.gov.uk/2021/05/24/what-makes-for-a-good-scrollytelling-article).
2. **Camera settles, then the caption lands.** Cards are tied to a map state, not to the flight: the card triggers the flight, the view stabilises, the reader reads (3, 4, 6).
3. **Dim, don't hide.** Mapbox: set layers to opacity 0 in the style and "Do not hide the layer"; transitions are opacity ramps (3, 4). ONS: keep the rest visible as context.
4. **Restore on re-entry.** Chapters can be entered from either direction; `onChapterEnter` must reset the intended state (3, 4).
5. **Zoom out in rings; locate before you descend.** NYT opens on a locator or the tightest site and widens one scale per step (1, 2).
6. **Routes are stepped, dated stops, not one long draw.** StoryMapJS, Bellingcat, Esri tours and Voyager all treat a journey as numbered places with a card each (7, 8, 9, 11). ORBIS pairs the drawn route with days and distance (10).
7. **Keep world context.** Inset globe minimap (3), locator map (2), full route always visible (13).
8. **Caption carries the number and date.** NYT puts counts in bold in the card; ORBIS puts days/distance in a bar under the map (1, 10).
9. **Reader controls pace; author controls order.** Scroll or arrows, never autoplay as the primary mode (6, 8, 11). Mapbox's `auto` is optional, off by default (3).
10. **Monitor scroll, never hijack it.** Pudding (6); Bostock's rule 2, "Allow rapid, incremental, reversible scrolling" (https://bost.ocks.org/mike/scroll/).
11. **Offer a stepper where steps are discrete.** Kosara and Armstrong both argue discrete steps want Next/numbered controls, which show "where they are and out of how many" (https://eagereyes.org/blog/2016/the-scrollytelling-scourge ; https://medium.com/@zanarmstrong/why-choose-scrollytelling-steppers-155a59dd97fe).
12. **Limit the run.** StoryMapJS advises <=20 slides; Esri tours were capped at 30 stops (7, 8).

## 3. What fails

- **Continuous scroll for discrete steps.** Kosara's seven failures: steps mismatched to scroll, unknown length, no direct access, scroll-jacking, animation-only scroll, text and graphic competing, replay needing a button. A stepper "doesn't get in the way" (eagereyes, above).
- **Scroll-jacking mechanics.** Bostock: one wheel event becomes a whole screen, gestures are dropped or queued, speed is fixed, the scrollbar is lost (bost.ocks.org, above).
- **Too many transitions.** CHI '26 study participant: "Too many transitions, I wished for it to be more streamlined"; a progress bar was added because testers missed the ending (https://arxiv.org/html/2603.04367v1).
- **Free pan/zoom mid-story.** Shorthand: embedded web maps "distract from the story" (https://shorthand.com/the-craft/how-to-tell-stories-with-maps).
- **Motion without pause.** WCAG 2.2.2: for moving content that "starts automatically" and "lasts more than five seconds" with other content, provide "a mechanism for the user to pause, stop, or hide it" (https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide). Auto-updating content has no five-second grace.
- **No reduced-motion variant.** Parallax and zoom effects can trigger vestibular reactions; honour `prefers-reduced-motion` with a cut or crossfade instead of a flight (https://web.dev/articles/prefers-reduced-motion).
- **Far flights that run long.** flyTo duration scales with distance; use `maxDuration` or `easeTo` for big jumps (5).
- **Autoplay as default.** Mapbox `auto` exists but every notable example in its README is scroll- or step-driven (3).

## 4. Timing guidance

No fetched source publishes editorial second-counts; these are engine defaults and observed practice.

- **Camera flight:** MapLibre/Mapbox default `speed` 1.2 screenfuls/s on a `curve` 1.42 arc; a city hop lands in ~1-2 s, a continental jump in several seconds unless `maxDuration` caps it (5). Earth Studio duration is simply the keyframe gap (12).
- **Ambient motion:** Mapbox idle rotation is 90° over 24 s, ~4°/s (3); treat as a ceiling.
- **Route draw:** precedents step the route per stop; if drawn, use a constant duration per leg and print days/distance (8, 9, 10).
- **Caption dwell:** reader-held in scroll and stepper modes (6, 8); any auto-advance stays under 5 s or offers pause (WCAG 2.2.2).
- **Chapter card:** NYT holds a locator with a 2-3 sentence card before the first flight (1, 2); Esri and StoryMapJS give one card per stop, up to five media (7, 8).
- **Layer fades:** opacity per chapter enter/exit, with an optional duration per change (3).

## Sources

- https://www.nytimes.com/interactive/2020/03/22/world/coronavirus-spread.html
- https://www.nytimes.com/interactive/2016/07/07/world/americas/bolivia-climate-change-lake-poopo.html
- https://baryon.be/data-visualization-in-a-time-of-pandemic-viral-scrollytelling/
- https://github.com/mapbox/storytelling
- https://www.mapbox.com/blog/how-to-build-a-scrollytelling-map
- https://labs.mapbox.com/storytelling/
- https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/FlyToOptions/
- https://pudding.cool/process/how-to-implement-scrollytelling
- https://pudding.cool/process/introducing-scrollama/
- https://esri.com/arcgis-blog/products/arcgis-storymaps/constituent-engagement/now-available-in-arcgis-storymaps-guided-tour-beta
- https://developers.arcgis.com/documentation/app-builders/no-code/arcgis-storymaps-story-blocks
- https://doc.esri.com/de/arcgis-storymaps/latest/author-and-share/add-guided-tours.html
- https://worldhistorycommons.org/storymapjs-maps-tell-stories
- https://www.bellingcat.com/news/uk-and-europe/2015/10/08/exploring-russias-53rd-brigades-mh17-convoy-with-storymap
- http://orbis.stanford.edu/
- https://classicalstudies.org/scs-blog/leprechan/review-orbis-stanford-geospatial-network-model-roman-world
- https://www.google.com/earth/education/explore-earth/
- https://earth.google.com/studio/docs/making-animations/keyframes
- https://gis.harvard.edu/out-eden-walk
- https://digital-geography.com/maps-eden-walk-paul-salopek-national-geographic/
- http://republicofletters.stanford.edu/index.html
- https://www.bbc.co.uk/news/extra/x2iutcqf1g/beirut-blast
- https://shorthand.com/the-craft/how-to-tell-stories-with-maps
- https://digitalblog.ons.gov.uk/2021/05/24/what-makes-for-a-good-scrollytelling-article
- https://eagereyes.org/blog/2016/the-scrollytelling-scourge
- https://medium.com/@zanarmstrong/why-choose-scrollytelling-steppers-155a59dd97fe
- https://bost.ocks.org/mike/scroll/
- https://arxiv.org/html/2603.04367v1
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide
- https://web.dev/articles/prefers-reduced-motion

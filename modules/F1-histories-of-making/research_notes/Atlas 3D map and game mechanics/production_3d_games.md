# Production feasibility: animated 3D / 2.5D game-like experiences for the F1 Atlas and the "Edo and the floating world" unit (zero cost, claude.ai Artifact delivery)

Research date: 4 October 2026. Researcher notes for the report writer.

Method notes (read first):
- Library sizes marked "measured" were produced by the researcher on 2026-10-04 by downloading the exact npm tarball from registry.npmjs.org, then (a) gzip -9 of the shipped minified build, or (b) bundling a small entry file with esbuild 0.25 (`--bundle --minify --format=esm`) and gzip -9 of the output. They are primary measurements, not quotes from bundlephobia (bundlephobia's API did not respond from this environment). Brotli would typically be 10–20% smaller (not measured). Treat figures as ±5%.
- Version and licence strings come from the npm registry "latest" manifest for each package (e.g. https://registry.npmjs.org/three/latest).
- jsDelivr / unpkg / Sketchfab API were blocked from this research environment (HTTP 403 at the proxy), so Sketchfab model licences could not be verified individually; see Gaps.
- The claude.ai Artifact runtime constraints (cdnjs/jsdelivr/unpkg scripts or bundled code; no runtime fetch from other hosts; same-origin fetch of published files; ≤255 files per publish; ≤16 MB per file; WebGL works; workers from own files/blob work; no service workers or WebRTC; no guaranteed fullscreen; audio only after a gesture) are taken from the project brief and the platform's own tool documentation; they were not independently tested here.

---

## 1. Engines and libraries: licence, size, mobile performance, fit inside a single-page Artifact bundle

### Takeaway
three.js (MIT, ~185 KB gzip for a realistic scene with loaders and controls) is the best fit: it is the engine behind both 2024 and 2025 Awwwards Sites of the Year and Bruno Simon's 2025 portfolio, it bundles into the existing Vite + vanilla JS stack, and its WebGPURenderer falls back to WebGL 2 automatically. For pure 2D/2.5D mini-games, PixiJS 8 (231 KB gz) or Phaser 4 (343 KB gz) are viable. Babylon.js and PlayCanvas are capable but 2–3× heavier. Godot 4 runs without COOP/COEP in single-threaded mode, but its default web runtime (~40 MB raw .wasm) exceeds the Artifact's 16 MB per-file limit unless you compile a custom stripped template. Unity is free under $200k but is proprietary, so it fails the open-licence goal.

### Cited Findings

**three.js**
- three 0.186.1 (r186), licence MIT — [npm registry](https://registry.npmjs.org/three/latest).
- Measured: `export * from 'three'` gives 724 KB minified / **184 KB gzip**. A "minimal realistic" scene (WebGLRenderer, PerspectiveCamera, ShaderMaterial, OrbitControls, GLTFLoader + KTX2Loader + MeshoptDecoder) gives 705 KB min / **186 KB gzip**, so three's tree-shaking saves almost nothing. `export * from 'three/webgpu'` gives 1,056 KB min / **289 KB gzip**. (Researcher measurement, esbuild 0.25, from [three@0.186.1 tarball](https://registry.npmjs.org/three/latest).)
- Measured add-ons, unminified ESM files from the r186 package: OrbitControls.js 8 KB gz; GLTFLoader.js 25 KB gz; KTX2Loader.js 8 KB gz; stats.module.js 1 KB gz — [three package](https://registry.npmjs.org/three/latest).
- "By default, the renderer tries to use a WebGPU backend if the browser supports WebGPU. If not, WebGPURenderer falls backs to a WebGL 2 backend." — [three.js docs, WebGPURenderer](https://threejs.org/docs/pages/WebGPURenderer.html).
- Bruno Simon on his 2025 portfolio: "thanks to TSL, the Three.js shading language, the experience automatically runs on WebGPU when available, delivering better performance without any additional work." — [Awwwards case study, 11 Mar 2026](https://www.awwwards.com/brunos-portfolio-case-study.html).
- `postprocessing` 6.39.5 (pmndrs), licence **Zlib**; measured postprocessing.min.js 323 KB raw / **112 KB gz** — [npm registry](https://registry.npmjs.org/postprocessing/latest).
- three-mesh-bvh 0.9.15, MIT (used by abeto for Igloo Inc and Messenger) — [npm registry](https://registry.npmjs.org/three-mesh-bvh/latest); [Awwwards Messenger case study](https://www.awwwards.com/messenger.html).

**Babylon.js**
- @babylonjs/core 9.29.0, **Apache-2.0** — [npm registry](https://registry.npmjs.org/@babylonjs%2fcore/latest).
- Measured: UMD `babylon.js` 8,416 KB raw / **1,810 KB gz**. A tree-shaken ES6 minimal scene (Engine, Scene, ArcRotateCamera, HemisphericLight, CreatePlane, StandardMaterial) bundles to 1,479 KB min / **342 KB gz** (researcher measurement, esbuild).
- Babylon documents ES6 tree-shaking with per-file imports — [Babylon.js docs, ES6 support with tree shaking](https://doc.babylonjs.com/setup/frameworkPackages/es6Support).

**PlayCanvas engine**
- playcanvas 2.23.0, **MIT** — [npm registry](https://registry.npmjs.org/playcanvas/latest).
- Measured: build/playcanvas.min.mjs 2,491 KB raw / **639 KB gz**.
- "The Engine renders with WebGL 2.0 by default. An application can request WebGPU instead ... and the Engine falls back to WebGL 2.0 when WebGPU isn't available." — [PlayCanvas supported browsers](https://developer.playcanvas.com/user-manual/engine/supported-browsers).

**2D / 2.5D frameworks**
- Phaser 4.2.1, MIT; measured phaser.min.js 1,343 KB raw / **343 KB gz** — [npm registry](https://registry.npmjs.org/phaser/latest).
- Phaser 4 was released on 14 April 2026 with "a completely rewritten WebGL based renderer" and a "Render Node Architecture" that replaces "the v3 pipeline system". It ships a "Unified Filter System" with Blur, Glow, Shadow, Pixelate, ColorMatrix, Bloom, Vignette, Wipe, ImageLight, GradientMap and Quantize. Its SpriteGPULayer can "Render a million sprites in a single draw call" — [GameFromScratch, Phaser 4 released](https://gamefromscratch.com/phaser-4-released/).
- pixi.js 8.22.0, MIT; measured pixi.min.js 820 KB raw / **231 KB gz** — [npm registry](https://registry.npmjs.org/pixi.js/latest).
- kaplay 3001.0.19, MIT; measured kaplay.mjs (unminified) 184 KB / **67 KB gz** — [npm registry](https://registry.npmjs.org/kaplay/latest).
- excalibur 0.32.0, licence **BSD-2-Clause** (not MIT); measured excalibur.min.js 560 KB / **143 KB gz** — [npm registry](https://registry.npmjs.org/excalibur/latest).

**Framework wrappers**
- @react-three/fiber 9.8.1, MIT (requires React); @react-three/drei 10.7.9, MIT — [npm registry](https://registry.npmjs.org/@react-three%2ffiber/latest).
- @threlte/core 8.6.1, MIT (requires Svelte 5; svelte 5.57.1 MIT) — [npm registry](https://registry.npmjs.org/@threlte%2fcore/latest).
- aframe 1.8.0, MIT; measured aframe-v1.8.0.min.js (bundles three) 1,292 KB / **340 KB gz** — [npm registry](https://registry.npmjs.org/aframe/latest).

**Physics**
- @dimforge/rapier3d(-compat) 0.21.0, **Apache-2.0** — [npm registry](https://registry.npmjs.org/@dimforge%2frapier3d/latest).
- Measured: rapier_wasm3d_bg.wasm 3,009 KB raw / **1,141 KB gz**. The `-compat` build inlines the wasm as base64 (dist/rapier.mjs 4,238 KB raw / **1,614 KB gz**). The compat build avoids a separate .wasm file and the wasm MIME-type question, but costs about 40% more bytes.
- cannon-es 0.20.0, MIT; measured dist/cannon-es.js (unminified) 338 KB / **72 KB gz** — [npm registry](https://registry.npmjs.org/cannon-es/latest).
- Bruno Simon's 2025 portfolio uses Rapier for physics and Howler.js for audio — [bruno-simon.com "Behind the scene"](https://bruno-simon.com/).
- howler 2.2.4, MIT; measured **9 KB gz**. tone 15.1.22, MIT — [npm registry](https://registry.npmjs.org/howler/latest).

**Animation / choreography**
- Theatre.js: "@theatre/core: Released under the Apache License Version 2.0"; "The studio (@theatre/studio) is released under the AGPL 3.0 License. This is the package that you use to edit your animations." Status: "Theatre.js 1.0 is around the corner. We have temporarily moved development to a private repo" — [GitHub theatre-js/theatre](https://github.com/theatre-js/theatre).
- npm: @theatre/core 0.7.2 Apache-2.0; @theatre/studio 0.7.2 AGPL-3.0-only; measured core dist/index.js 219 KB / **48 KB gz** — [npm registry](https://registry.npmjs.org/@theatre%2fcore/latest).
- gsap 3.15.0 licence string: "Standard 'no charge' license: https://gsap.com/standard-license". This is not an OSI open-source licence — [npm registry](https://registry.npmjs.org/gsap/latest).

**Godot 4 web export**
- "Since Godot 4.3, Godot supports exporting your game on a single thread ... it is the preferred and now default way to export your games on the Web." Only the "Use Threads" option requires SharedArrayBuffer and "Cross-Origin-Opener-Policy: same-origin" plus COEP headers — [Godot docs, Exporting for the Web](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html).
- "Godot 4 can only target WebGL 2.0 (using the Compatibility rendering method). Forward+/Mobile are not supported on the web platform ... Godot currently does not support WebGPU" — [godot-docs source](https://github.com/godotengine/godot-docs/blob/master/tutorials/export/exporting_for_web.rst).
- "Projects written in C# using Godot 4 currently cannot be exported to the web" — [Godot docs (latest)](https://docs.godotengine.org/en/latest/tutorials/export/exporting_for_web.html).
- "the 4.3 release Web build .wasm is around 40 MB uncompressed, and 5 MB compressed with Brotli" — [Godot blog, Web Export in 4.3](https://godotengine.org/article/progress-report-web-export-in-4-3).
- Godot 4.4: the default web export is "42.0MB Uncompressed / 8.72MB .zip". A custom template with `disable_3d`, `disable_advanced_gui` and most modules off gets to "16.0MB Uncompressed / 3.64MB .zip" (2.70 MB Brotli). Godot 4.5 minified: "15.6MB Uncompressed". Single blog source, and the minimal template is 2D-only — [popcar.bearblog.dev](https://popcar.bearblog.dev/how-to-minify-godots-build-size/).
- Godot itself is MIT (well known; the licence file was not fetched in this session).

**Unity**
- "Unity Personal will remain free", with the revenue/funding ceiling raised "from $100,000 to $200,000 USD". The splash screen becomes optional in Unity 6 Personal. The Runtime Fee was cancelled (12 Sep 2024) — [Unity blog](https://unity.com/blog/unity-is-canceling-the-runtime-fee). The engine is proprietary (the blog does not claim otherwise).

### Inferences
- **Recommended stack:** three.js r18x with WebGLRenderer, or WebGPURenderer with automatic WebGL 2 fallback, plus a hand-written post-processing pass or pmndrs `postprocessing`, a GLTFLoader with meshopt, and Howler. The JS budget is about 200–320 KB gz. That is about the same as one hero WebP image, and it slots straight into the existing Vite build (bundled, so no CDN dependency).
- **Do not adopt React or Svelte only to use R3F or Threlte.** The unit is vanilla JS, and adding a framework doubles the conceptual surface for a small team. R3F and Threlte are excellent if the programme later standardises on them.
- **Physics is optional.** None of the proposed pieces (globe hub, print workshop, route diorama) needs rigid-body physics. Rapier would add about 1.1–1.6 MB gz, more than the whole rendering engine. Use simple kinematic code or three-mesh-bvh raycasts instead.
- **Theatre.js:** only @theatre/core (Apache-2.0) would ship. The AGPL studio would be used locally as an authoring tool and not shipped. Because the AGPL obligation attaches to distribution and network use of the studio itself, keep it out of the published bundle. The project's 1.0 is in a private repo, which is a maintenance risk. Hand-authored CatmullRom camera splines plus a small tween helper are a zero-risk alternative.
- **Godot in an Artifact:** the single-threaded export removes the COOP/COEP blocker, so it should run in a sandboxed iframe. However, a 3D-capable default .wasm (~36–42 MB raw) cannot be published under a 16 MB per-file cap if the Artifact stores files uncompressed. A custom-compiled 3D template might fit (unverified). You would also lose DOM-level accessibility (canvas-only UI). Not recommended.
- **Unity** fails "open/zero-cost" in spirit (proprietary editor and runtime, revenue ceiling) and produces large WebGL builds. Not recommended.
- **GSAP** is free but under a proprietary "no charge" licence. If the programme requires OSI licences for code, use a ~1 KB custom tween or `motion` instead (motion's licence is not verified here).

### Gaps
- No verified mobile frame-rate benchmarks comparing three.js, Babylon and PlayCanvas on the same mid-range phone. Published comparisons are mostly vendor or blog claims.
- Whether the Artifact host serves `.wasm` with `application/wasm` (needed for `WebAssembly.instantiateStreaming`; plain `instantiate` from an ArrayBuffer works regardless) is unverified.
- Godot 3D-enabled minimal web template size was not found.

---

## 2. Zero-cost, open-licence asset sources and pipeline tools

### Takeaway
Poly Haven, ambientCG and Kenney are verified CC0, and Smithsonian / Sketchfab cultural-heritage CC0 models exist. **Quaternius changed to a custom "Quaternius Asset License" (QAL v1.0, dated 28 Aug 2026)** and **Sonniss GDC bundles are a proprietary royalty-free EULA**, so both fall outside the programme's CC0/PD/CC BY/CC BY-SA/ODC-By rule unless the assets were obtained earlier under CC0. Blender output is not GPL-bound. Generic CC0 kits are stylistically Western or low-poly, so the most authentic Edo assets will be the programme's own planes cut from public-domain Met/AIC prints, plus simple Blender kit-bashed machiya.

### Cited Findings
- Kenney: "all game assets on the asset pages are public domain licensed (CC0)"; "Attribution is not required" (do not use the Kenney logo) — [Kenney support](https://kenney.nl/support).
- Poly Haven: "All assets (HDRIs, textures and 3D models) on this site ... are all licensed as CC0"; no credit needed; redistribution allowed — [Poly Haven licence](https://polyhaven.com/license).
- ambientCG: "All ambientCG assets are provided under the Creative Commons CC0 1.0 Universal License. This applies to the downloadable asset files and the material preview renders" — [ambientCG licence](https://docs.ambientcg.com/license).
- **Quaternius:** "Quaternius Asset License (QAL) v1.0, Last updated: 8/28/2026 ... You can use these assets, free of charge, in personal, educational, and commercial games ... with no credit required. You just can't resell or redistribute the assets themselves as assets." — [Quaternius licence](https://quaternius.com/license.html). (Older Quaternius packs were widely distributed as CC0. Whether a CC0 dedication on previously downloaded packs survives is a legal question. CC0 is irrevocable for copies already released, but get project counsel or archive evidence.)
- Sketchfab launched a CC0 dedication for cultural heritage on 25 Feb 2020 with "27 cultural organisations from 13 different countries". The Smithsonian released "1700 free 3-D models"; Sketchfab advertises "2000+ CC0 models" in that collection — [Sketchfab blog](https://sketchfab.com/blogs/community/sketchfab-launches-public-domain-dedication-for-3d-cultural-heritage/).
- Candidate Sketchfab Japanese-architecture models found by search (licences NOT verified): "Japanese Building" (slug includes "cc0") — [Sketchfab](https://sketchfab.com/3d-models/japanese-building-cc0-5e9749de20ad419d86115563f2fa9b75); "Japanese Village House" by tris.blend — [Sketchfab](https://sketchfab.com/3d-models/japanese-village-house-2f1124bd921540d7816391f79eb436ea); "japanese-house" by madexc — [Sketchfab](https://sketchfab.com/3d-models/japanese-house-7e2b4c9de0604631bade21b781350418).
- Blender: "The GPL only applies to the Blender application and **not** the artwork you create with it" — [Blender Manual, About Free Software and the GPL](https://docs.blender.org/manual/en/4.0/getting_started/about/license.html).
- Bruno Simon built "the entire world in Blender", using Empties for collision shapes, respawn points and area boundaries — [Awwwards case study](https://www.awwwards.com/brunos-portfolio-case-study.html). His portfolio source is "available on GitHub under MIT license. Even the Blender files are there". Its music by Kounine is "now under CC0 license" — [bruno-simon.com](https://bruno-simon.com/).
- Sonniss #GameAudioGDC: free, "No attribution is required", but "licensed for media production (games, film, TV, interactive projects) only. Use for AI/ML training is strictly prohibited" — [gdc.sonniss.com](https://gdc.sonniss.com/). Licence v2.0 has been effective since 27 Aug 2026. The 28 Jan 2024 amendment "removed" the former right "to freely distribute the licensed sound effects" and added a synchronization right covering "games, films, television & interactive projects" — [Sonniss previous versions](https://sonniss.com/gdc-bundle-license/previous-versions).
- Public-domain print example usable as texture: Okumura Masanobu, *Perspective View (uki-e) of a Kabuki Theatre*, 1748, Met, "Public Domain/Open Access" — [Met 56534](https://www.metmuseum.org/art/collection/search/56534). AIC also holds uki-e such as *Large Perspective Picture of the Kaomise Performance* — [AIC 21561](https://www.artic.edu/artworks/21561/large-perspective-picture-of-the-kaomise-performance-on-the-kabuki-stage-shibai-kyogen-butai-kaomise-o-uki-e) (licence of that image not checked in this session).
- Pipeline tools: @gltf-transform/cli 4.5.1 (MIT) for glTF optimisation, meshopt, Draco and KTX2 conversion — [npm registry](https://registry.npmjs.org/@gltf-transform%2fcli/latest); [glTF Transform](https://gltf-transform.dev/). Maxime Heckel used gltf-transform to compress a model "from 30MB to 1.6MB" — [Maxime Heckel blog](https://blog.maximeheckel.com/posts/moebius-style-post-processing/).

### Inferences
- **Audio policy:** to stay inside CC0/PD/CC BY, prefer Kenney audio (CC0), Freesound items filtered to CC0, and Bruno Simon / Kounine CC0 music (style mismatch). Commission or record shakuhachi/shamisen/street ambience under CC0, or use public-domain field recordings. Exclude Sonniss, or treat it as a documented exception.
- **3D Edo assets:** no verified, consistent CC0 set of Edo machiya, Nihonbashi, boats or torii was found. Mixing random Sketchfab CC BY models also creates attribution bookkeeping and inconsistent style. The cheaper, more authentic route is:
  1. Kit-bash a few low-poly Blender pieces: machiya façade modules, bridge, boat, noren, signboards.
  2. Texture them by projecting cut-outs and colour fields sampled from PD prints.
  3. Use Kenney/Poly Haven/ambientCG only for neutral bases such as paper, wood and water normals.
- Smithsonian/Sketchfab cultural-heritage CC0 scans (photogrammetry) are high-poly and photoreal. They are useful as "object of the week" inspectables (e.g. a netsuke or woodblock) in a separate viewer, not as game set dressing.

### Gaps
- Individual licences, poly counts and accuracy of Sketchfab Japanese-architecture models could not be verified (the Sketchfab API and JS pages were not reachable or not rendered).
- No CC0 3D Edo-period (1859) townscape dataset was found. The PLATEAU (MLIT) 3D city models are modern Tokyo and were not researched here.
- Freesound CC0 filtering and the current Freesound licence options were not re-verified this session.

---

## 3. Stylised rendering for an ukiyo-e / sumi-e / washi look (techniques, case studies, GPU cost)

### Takeaway
The ukiyo-e look decomposes into cheap, well-documented pieces:
- flat colour bands (quantised toon lighting, 1–2 bands);
- a keyblock outline (Sobel edge detection on depth and normal buffers, or an inverted hull);
- bokashi gradients (a 1D gradient-map/ramp texture);
- a washi/silk paper overlay (screen-space procedural or tiled texture);
- optional ink-bleed noise on edges.

All of these are single-pass or one-extra-pass effects that run comfortably on mobile when the post-pass is rendered at reduced resolution. Codrops published a Japanese-ink-wash three.js/TSL garden in Sept 2026, and Maxime Heckel's Moebius post is a ready recipe for outlines.

### Cited Findings
- **Sobel outlines:** outlines come from "a Sobel edge detection filter" applied to depth and normal buffers. Depth "gives us information on the outer boundaries" while normals find "inner outlines". The pipeline uses three render targets (depth, normal, composite). The hand-drawn wobble comes from sinusoidal displacement with hash noise. Crosshatching is done by luma thresholds with `mod()` stripes — [Maxime Heckel, Moebius-style post-processing (Mar 2024, upd. Aug 2024)](https://blog.maximeheckel.com/posts/moebius-style-post-processing/).
- Proof-of-concept repository: "Moebius / Sable-style ligne-claire rendering PoC in three.js" — [GitHub rnaud/moebius](https://github.com/rnaud/moebius).
- **Ink-wash in three.js:** Codrops, "Still: From Akira to Ink Wash, Building a Generative Garden in WebGPU" (9 Sep 2026). The toon shader keeps "two levels: one shadow band and one lit band, because more steps stop reading like print". Contour lines use `fwidth` for constant screen-space width plus `mx_noise_float` wobble. The silk/paper overlay is screen-space: "I scale screenUV into thread cells, jitter the grid so it does not look machine-made". It is built with three.js TSL on WebGPU, and no performance figures are given — [Codrops](https://tympanus.net/codrops/2026/09/09/still-from-akira-to-ink-wash-building-a-generative-garden-in-webgpu/).
- Other Codrops TSL items: "False Earth: From WebGL Limits to a WebGPU-Driven World" (21 Apr 2026); "Garden Anomaly: A Tiny WebGPU and TSL Experiment" (6 Aug 2026) — [Codrops TSL tag](https://tympanus.net/codrops/tag/tsl/). Earlier: "Sketchy Pencil Effect with Three.js Post-Processing" (29 Nov 2022) — [Codrops](https://tympanus.net/codrops/2022/11/29/sketchy-pencil-effect-with-three-js-post-processing/).
- **Sumi-e dissertation (Trinity College Dublin, 2020):**
  - Silhouettes are detected where "0 ≤ N·V ≤ ε".
  - Brush textures are applied with "wobble distortion".
  - Interior shading uses either cel bands or tone-texture "ink bleeding".
  - The paper effect uses alpha "1 − (R+G+B)/3".
  - Performance: "reaching frame rates over 144 frames per second" at 1024×768 even on an 855,275-vertex model (desktop GPU).
  - On Okami: "it still looks very much like a video game constrained by its hardware" and lacked full paper-texture integration.
  
  Source: [Gallo Beruben, TCD 2020 (PDF)](https://publications.scss.tcd.ie/theses/diss/2020/TCD-SCSS-DISSERTATION-2020-056.pdf).
- **Abeto's Messenger (SOTY 2025):** a "custom system that let us draw these lines exactly how we wanted", controlling thickness, colour and transparency per pixel. A **16×16 px colour atlas** unifies the palette, so mood can be retuned by editing one tiny texture — [Awwwards Messenger case study](https://www.awwwards.com/messenger.html).
- **Sable (Shedworks):** "One big issue with making a flat shaded world ... is reading depth in 3D space". Light and shadow, plus distant fog ("really, really key"), restored readability. Outlines use "fading opacity" with distance to avoid pop-in. The desert setting was chosen because "we couldn't make a really detailed open world at this scale" — [Game Developer](https://www.gamedeveloper.com/marketing/how-shedworks-refined-the-art-of-sable-in-pursuit-of-readability).
- **Return of the Obra Dinn (dithering stability):** Pope maps the dither pattern "onto the inside of a sphere centered around the camera", so dither is "perfectly pinned for all camera rotations". He thresholds at 2× resolution then downsamples, using an 8×8 Bayer matrix plus a 128×128 blue-noise field — [Lucas Pope devlog (TIGSource, Nov 2017)](https://dukope.com/devlogs/obra-dinn/tig-32/).
- **Pentiment (Obsidian):** woodcut and manuscript references. The team flattened "broad sweeping areas of the landscape" for "clarity and visibility" instead of copying the stacked perspective of the sources. About 15 people at peak, with initially one 2D artist and one lead animator — [GamesHub interview with Hannah Kennedy](https://www.gameshub.com/news/features/pentiment-interview-xbox-obsidian-entertainment-hannah-kennedy-art-director-34642/).
- Okami (2006) is a canonical sumi-e cel-shaded game — [Wikipedia, Ōkami](https://en.wikipedia.org/wiki/%C5%8Ckami). No primary technical (GDC) source on its shaders was found.

### Inferences
- **Proposed "Edo print" shader stack.** Approximate cost on a mid-range phone at DPR ≤ 1.5, edge pass at half resolution, about 3–6 ms total. This cost estimate is reasoned, not measured.
  1. **Flat bands:** MeshToon-style or a custom material with 1–2 quantised N·L bands, multiplied by a per-object flat colour from a small palette atlas (the Messenger 16×16 idea). The atlas colours are sampled from the PD print (prussian blue, beni red, sumi black).
  2. **Bokashi:** a vertical or world-space gradient ramp per material (sky, water edges), as a 1D LUT. This is effectively free.
  3. **Keyblock outline:** a half-resolution depth+normal Sobel post-pass (one extra normal render target), *or* an inverted-hull outline on hero meshes only (zero post cost, one extra draw per mesh). Add noise wobble for a carved-line feel; keep the line weight constant in screen space.
  4. **Washi/silk:** a full-screen multiply with a tiling CC0 paper texture (ambientCG/Poly Haven) plus procedural fibre noise. Pin it to screen space, not world space, to avoid "swimming" (the Obra Dinn lesson). Optionally offset it slightly with camera yaw, as in Pope's sphere-mapping, to keep the paper "in front".
  5. **Ink-bleed transitions:** dissolve via noise threshold for scene changes. This replaces camera moves for reduced-motion users.
- Fog and atmosphere bands are essential to readability in flat-shaded scenes (Sable lesson). In ukiyo-e terms, use **horizontal mist bands (kasumi)** as compositional dividers. They also hide LOD pop.
- Avoid dithering/halftone at the mobile pixel scale unless it is stabilised. It moirés badly in motion.

### Gaps
- No measured mobile GPU timings for Sobel post-passes in three.js were found. Measure with stats-gl on the target device.
- No primary GDC/technical source for Okami's or Ghost of Tsushima's "Kurosawa mode" filters. The GDC Vault "Procedural Grass in Ghost of Tsushima" exists — [GDC Vault](https://gdcvault.com/play/1027033/Advanced-Graphics-Summit-Procedural-Grass) — but was not reviewed.
- Shadertoy/CodePen "Hokusai" demos were not individually surveyed (licences vary; Shadertoy default is CC BY-NC-SA 3.0, which is non-commercial and conflicts with the programme's licence list; this licence fact is from general knowledge and should be verified).

---

## 4. 2.5D layered (multi-plane) vs true 3D for ukiyo-e: cost/benefit

### Takeaway
2.5D is the better fit for ukiyo-e and roughly an order of magnitude cheaper. Ukiyo-e is built from flat planes, outlines and stacked bands of space. True one-point perspective appears only in the uki-e sub-genre (from ~1739). Layered planes cut from public-domain prints keep the historical images themselves on screen, which is a learning goal. True 3D is justified only where spatial understanding is the point: the globe hub, and possibly one small uki-e interior that demonstrates perspective.

### Cited Findings
- Uki-e "emerged in the late 1730s", meaning pictures using "western conventions of linear perspective". Torii Kiyotada made "the earliest known printed example" around 1739–40. Okumura Masanobu "was the first to apply the term Uki-e". Utagawa Toyoharu "fully developed the form in the late 1750s". Interiors dominated because "it is easier to accurately apply one point perspective to architecture than to landscape" — [Wikipedia, Uki-e](https://en.wikipedia.org/wiki/Uki-e).
- Masanobu's 1748 kabuki-theatre uki-e shows "novel experimentation with Western perspective" (Met, Public Domain) — [Met 56534](https://www.metmuseum.org/art/collection/search/56534).
- Old Man's Journey (Broken Rules) uses a 2D hand-drawn style. Its pipeline supports "sharp drawings for different aspect ratios and resolutions ranging from 4K monitors to iPhone sized screens" — [Game Developer](https://www.gamedeveloper.com/art/video-a-behind-the-scenes-look-at-the-art-of-i-old-man-s-journey-i-). (Layering details are in the GDC talk "Happy Inside the Box" — [YouTube](https://www.youtube.com/watch?v=unadRBf0g5A), not reviewed.)
- Pentiment deliberately flattened landscapes for gameplay clarity rather than reproducing the sources' stacked perspective — [GamesHub](https://www.gameshub.com/news/features/pentiment-interview-xbox-obsidian-entertainment-hannah-kennedy-art-director-34642/).
- Sable's flat-shaded 3D needed lighting, fog and outline fading to make depth readable — [Game Developer](https://www.gamedeveloper.com/marketing/how-shedworks-refined-the-art-of-sable-in-pursuit-of-readability).

### Inferences
- **Cost comparison (estimates for a 2–3 person team, not sourced figures):**
  - A multi-plane scene from one print: 4–8 alpha-cut layers, depth map for subtle parallax, ~1–2 days each once the pipeline exists.
  - A small, authentic, stylised 3D street block (machiya kit, props, NPC loops): weeks, plus a historical-accuracy review.
  - A walkable "1859 Edo" district: months, with high risk of an anachronistic generic-Japan look.
- **Pedagogical fit.** Multi-plane makes the print's own compositional devices legible: kasumi bands, repoussoir foreground, the raised horizon. A "perspective switch" can contrast flat ukiyo-e layering with uki-e one-point perspective, a strong teaching moment that true 3D everywhere would blur.
- **Hybrid.** Use 3D only where it adds meaning:
  - the Atlas globe/map hub (geography, trade routes);
  - one uki-e "box" interior (a kabuki theatre, after Masanobu 1748), where the 3D vanishing-point lines *are* the content.

### Gaps
- No quantitative production-time data for multi-plane vs 3D web pieces was found. The figures above are reasoned estimates.

---

## 5. Artifact runtime constraints, WebGPU readiness, and packing models, textures and audio

### Takeaway
WebGPU now ships in all four major engines (Chrome/Edge 113+, Android Chrome 121+, Safari 26 incl. iOS 26, Firefox 141 Windows / 145+ Apple-silicon macOS). Coverage is still incomplete (older iOS, Linux, Firefox Android), so ship WebGL 2 as the guaranteed path and let three's WebGPURenderer upgrade opportunistically, or simply use WebGLRenderer. Within ≤255 files and ≤16 MB per file, pack each scene as one GLB (meshopt geometry, KTX2/ETC1S or WebP textures). Add the decoders: meshopt 1 JS file (7 KB gz), Basis 2 files (~253 KB gz), Draco 2 files (~72 KB gz). Use a few texture atlases and Opus/MP3 audio sprites.

### Cited Findings
- "WebGPU ... is officially supported across Chrome, Edge, Firefox, and Safari" (web.dev, 25 Nov 2025):
  - Chrome/Edge 113+ on Windows/macOS/ChromeOS; Android in Chrome 121 "for devices running at least Android 12, and with Qualcomm/ARM GPUs";
  - Firefox 141 on Windows, 145 on macOS Tahoe ARM64;
  - Safari 26 on macOS/iOS/iPadOS/visionOS;
  - Linux and Firefox Android "in progress".
  
  Source: [web.dev](https://web.dev/blog/webgpu-supported-major-browsers).
- Firefox 141 (22 Jul 2025): "The WebGPU API is now fully supported on Windows, in all contexts except for service workers" — [MDN Firefox 141](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/141).
- WebKit: WebGPU is "now shipping in Safari 26.0 for macOS, iOS, iPadOS, and visionOS" — [WebKit](https://webkit.org/blog/17333/webkit-features-in-safari-26-0).
- MDN still marks WebGPU as "Limited availability ... not Baseline" — [MDN WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API).
- PlayCanvas: Linux Chrome 144+ requires "Intel Gen12+ GPUs"; Firefox "147+ on macOS with Apple silicon" (differs from web.dev's 145, so flag the conflict) — [PlayCanvas](https://developer.playcanvas.com/user-manual/engine/supported-browsers).
- WebGPU global support is "~87%" (single secondary source; verify on caniuse at build time). WebGPU's gains are "significant only in draw-call-heavy or compute-intensive scenarios; not universally faster" — [Utsubo, 100 Three.js tips (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips).
- Decoder files in three r186 (measured from the npm tarball):
  - draco_decoder.wasm 187 KB / 61 KB gz + draco_wasm_wrapper.js 57 KB / 11 KB gz;
  - basis_transcoder.wasm 514 KB / 239 KB gz + basis_transcoder.js 56 KB / 14 KB gz;
  - meshopt_decoder.module.js 28 KB / 7 KB gz (single file; wasm embedded).
  
  Source: [three package](https://registry.npmjs.org/three/latest).
- KTX2/Basis gives "4–8x less GPU memory" than uncompressed textures. "A 200KB PNG at 2048×2048 becomes ~21 MiB VRAM with mipmaps"; 4096² RGBA is about 85 MiB with mips. Draco reduces geometry "~95% in many cases". Meshopt "reaches best ratio only with server-side gzip/Brotli" — [Utsubo](https://www.utsubo.com/blog/threejs-best-practices-100-tips).
- Messenger targeted iPhone Safari memory specifically. Assets are "cleared immediately after use", and custom tools compress models and textures for mobile — [Awwwards Messenger case study](https://www.awwwards.com/messenger.html).
- Godot's single-threaded export avoids SharedArrayBuffer and COOP/COEP — [Godot docs](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html). (Relevant because an Artifact iframe presumably cannot set COOP/COEP headers. This is an inference, not tested.)

### Inferences
- **Packing plan for the Edo unit's 3D additions (fits easily under 255 files):**
  - 1 JS bundle (~250–350 KB gz);
  - 1 meshopt decoder (inside the bundle);
  - optionally the 2 Basis transcoder files;
  - 3–6 GLBs, each ≤3 MB, with textures embedded;
  - 2–4 texture atlases (KTX2 ETC1S for colour fields, UASTC for the paper normal if needed, or WebP if you skip Basis);
  - 1–2 audio sprites (Opus in WebM with MP3 fallback; one ambience loop of about 0.5–1 MB, one SFX sprite);
  - 1 JSON scene manifest.
  
  That is roughly 15–20 new files, leaving the ~235 existing files under the 255-file cap. **Warning:** the unit already has about 235 files. Consolidate (sprite-sheet the WebPs, merge JSON) or split the game pieces into separate Artifacts linked from the unit.
- **Skip Draco if meshopt is used.** Meshopt decodes faster, is one tiny file, and pairs with gzip. The flat-colour ukiyo-e style needs few textures, so WebP atlases may beat KTX2 on transfer size. KTX2 is still worthwhile on large atlases to cut iOS VRAM (the "21 MiB per 2K PNG" figure).
- **No runtime CDN fetch:** bundle everything with Vite; never rely on three's default Draco/Basis CDN paths. Point `setDecoderPath`/`setTranscoderPath` at same-origin published files.
- **No service worker:** there is no offline cache, so keep the first-interactive payload under about 2–3 MB and lazy-load scenes after the user opts in ("Enter the print").
- **Audio:** start only after a user gesture (already a constraint). Howler handles unlock. Provide mute and volume controls, plus captions for any narration.

### Gaps
- Whether Artifacts serve files gzip/Brotli-encoded over the wire (which affects real transfer sizes) is unknown.
- Whether `OffscreenCanvas` + worker rendering is permitted in the Artifact sandbox was not tested.

---

## 6. Performance budgets for mid-range phones, adaptive quality and measurement

### Takeaway
Aim for at most ~100 draw calls, ≤100k vertices on screen, ≤2048 px textures, DPR capped at 1.5–2, and post-passes at half resolution. Target 60 fps on desktop and a stable 30–60 fps on phones, with an automatic quality step-down: Bruno Simon's mobile preset disables blur and depth of field and lowers shadow resolution. Measure with stats-gl and `renderer.info` on real devices.

### Cited Findings
- "~100 draw calls per frame on mobile"; "<100 draw calls and <100,000 vertices if you can"; textures "2048px or below unless hero assets"; cap DPR at "Math.min(window.devicePixelRatio, 2)"; half-resolution post-processing "can roughly double frame rate"; InstancedMesh turns 1,000 trees into 1 draw call; BatchedMesh merges multiple geometries that share a material; use drei `PerformanceMonitor` with `flipflops={3}` — [Utsubo 100 tips (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips).
- Measuring tools: stats-gl (WebGL + WebGPU); r3f-perf ("WebGL only (last update Nov 2024)"); `renderer.info`; Three.js Inspector; Spector.js — [Utsubo](https://www.utsubo.com/blog/threejs-best-practices-100-tips). stats-gl 4.2.3 MIT; stats.js 0.17.0 MIT — [npm registry](https://registry.npmjs.org/stats-gl/latest).
- Bruno Simon 2025: "On mobile devices, the experience automatically switches to a lower quality preset: water blur and depth-of-field effects are disabled, and shadow map resolution is reduced." Foliage uses camera-facing planes with SDF leaf textures — [Awwwards case study](https://www.awwwards.com/brunos-portfolio-case-study.html). The live site exposes a user "Quality" toggle (Low) and a renderer switch — [bruno-simon.com](https://bruno-simon.com/).
- Messenger: a custom LOD system that swaps objects "while minimizing visual popping"; vegetation as "blob" placeholders plus stylised foliage geometry — [Awwwards](https://www.awwwards.com/messenger.html).
- Igloo Inc: "Continuously measure performance during development, making adjustments as needed to ensure smooth navigation on low-end devices"; shaders compiled in the background — [Awwwards Igloo case study](https://www.awwwards.com/igloo-inc-case-study.html).

### Inferences
- **Proposed budget sheet for the Edo pieces (mid-range Android circa 2023, iPhone 12-class):**

| Item | Budget |
|---|---|
| JS | ≤350 KB gz |
| First scene payload | ≤3 MB |
| Draw calls | ≤60 (multi-plane scenes are naturally ~10–30) |
| Triangles | ≤150k |
| Textures resident | ≤64 MB VRAM, ≤6 textures at 2K |
| DPR | min(dpr, 1.5) on mobile |
| Post-passes | 1 combined (edges + paper + grade) at 0.5× resolution |
| Frame target | 60 fps desktop; 30 fps floor on mobile |
| Idle | stop the render loop when the tab is hidden or the scene is static (battery) |

- **Adaptive quality:** measure the average frame time over 2 s. If it is above 22 ms, step down: DPR, then edge pass, then paper fibres, then shadows. Expose the same toggles in a settings panel (this doubles as accessibility).
- **Render on demand.** For the print workshop and route diorama, render only when input or animation is active. This is a large battery saving compared with continuous loops.

### Gaps
- No authoritative device-class benchmarks (e.g. GFXBench for three.js) were found. Budgets are community heuristics, so validate on two or three real phones.

---

## 7. Accessibility of web games (GAG, XAG, WCAG 2.2, motion, alternatives)

### Takeaway
Treat every game piece as an optional enhancement over an accessible DOM path (the existing scrollytelling plus OpenSeadragon). Required features:
- full keyboard/switch operation without simultaneous or timed inputs;
- reduced-motion mode honouring `prefers-reduced-motion`, which replaces camera flights with cuts or ink dissolves (WCAG 2.3.3, AAA, technique C39);
- no camera shake, head-bob or motion blur, with adjustable FOV and sensitivity (XAG 117 and GAG);
- captions for all audio;
- colour-independent cues;
- pause anywhere, and save to localStorage.

### Cited Findings
- **WCAG 2.2 SC 2.3.3 Animation from Interactions (Level AAA):** "Motion animation triggered by interaction can be disabled, unless the animation is essential". Parallax is identified as "often non-essential". Reactions include "dizziness, nausea and headaches". Technique **C39** is "Using the CSS prefers-reduced-motion query" — [W3C Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).
- **XAG 117:** players should be able to "pause or completely stop any content that scrolls, blinks, auto-updates, or otherwise moves". "Avoid the use of camera shake, camera bobbing effects, motion blur ... or provide an option to turn off these behaviors". "Provide adjustable field of view settings" (Halo Infinite note: lower angles "reduce the 'fishbowl' effect"). Provide camera sensitivity settings and the "ability to disable automatic camera movement" — [Microsoft XAG 117](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117).
- **Game Accessibility Guidelines** ([full list](https://gameaccessibilityguidelines.com/full-list/)):
  - Basic: "Allow controls to be remapped / reconfigured"; "Ensure controls are as simple as possible, or provide a simpler alternative"; "Ensure no essential information is conveyed by a colour alone"; "Provide subtitles for all important speech"; "Ensure no essential information is conveyed by sounds alone"; "Avoid flickering images and repetitive patterns"; "Use simple clear language"; "Include tutorials".
  - Intermediate: "Ensure that multiple simultaneous actions are not required"; "Avoid repeated inputs (button-mashing/quick time events)"; "Provide an option to turn off / hide background movement"; "Indicate / allow reminder of current objectives"; "If the game uses field of view (3D engine only), allow a means for it to be adjusted"; "Allow subtitle/caption presentation to be customised".
  - Advanced: "Do not make precise timing essential to gameplay – offer alternatives"; "Provide very simple control schemes compatible with assistive technology"; "Avoid VR simulation sickness triggers".
- Separate GAG item: "If the game uses field of view (3D engine only), set an appropriate default for the expected viewing environment" — [GAG](https://gameaccessibilityguidelines.com/if-the-game-uses-field-of-view-3d-engine-only-set-an-appropriate-default-for-the-expected-viewing-environment/).
- Messenger's accessible input design: one-finger control on mobile, mouse-only on desktop, and "smart camera following" so players never manage the camera — [Awwwards Messenger](https://www.awwwards.com/messenger.html).
- Bruno Simon's portfolio offers Mouse, Keyboard, Mobile, Tablet and Gamepad schemes, an "I'm stuck!" respawn, and a reset — [bruno-simon.com](https://bruno-simon.com/).

### Inferences
- **Concrete spec for the Edo pieces:**
  1. **Entry gate.** A "Play the 3D version / Read the text version" choice. The text path (existing scrollytelling) is complete and equivalent, so the game is never the sole carrier of learning outcomes.
  2. **Input.** Tab/arrow/Enter/Space for every action. Drag-and-drop (registration lab) gets keyboard nudge steps (1 px / 10 px) and a "snap to kentō" assist. No holds, no timers (or timers are optional with a "relaxed" default), and no simultaneous keys. Pointer targets are ≥24×24 CSS px (WCAG 2.5.8 AA; general knowledge, not fetched this session).
  3. **Motion.** Honour `prefers-reduced-motion`, plus an in-game toggle. Camera moves become cuts or ink-dissolves. Parallax depth scales to 0. Turn speed is capped (rough guidance ≤90°/s); no roll; no bob or shake. FOV default about 45–55° for a seated web viewer, adjustable. Ease-in/out of at least 300 ms, with no sudden acceleration. These numbers are design heuristics, not sourced standards.
  4. **Screen readers.** Canvas gets `role="img"` with a live description, *or* is hidden from assistive tech while a parallel DOM list of interactive hotspots (buttons) drives the same state. Announce state changes via `aria-live="polite"`.
  5. **Colour.** The ukiyo-e palette (prussian blue vs beni red) is fine for most CVD, but every game state must carry shape, text or pattern too (e.g. block number labels in the print lab).
  6. **Audio.** Off by default or on after the first gesture, with volume sliders and captions for narration and significant sounds.
  7. **Pause and save.** Esc/P pauses and the loop stops when hidden. Progress is saved to localStorage in try/catch (per platform rules), with "resume" or "restart" choices.
  8. **Flashing.** Keep below WCAG 2.3.1 thresholds: no ink "flash" transitions faster than 3 Hz.

### Gaps
- No published accessibility audit of an award-winning WebGL site was found. Making-ofs rarely discuss it.
- Quantitative vestibular-safe camera-speed thresholds from peer-reviewed sources were not located in this session.

---

## 8. Award-level web 3D experiences 2022–2026, how they were built, and team-size calibration

### Takeaway
The most-awarded recent web experiences are built by **very small teams on three.js with Blender (and Houdini)**:
- Bruno Simon's 2025 portfolio: solo developer plus a musician, roughly a year, three.js TSL/WebGPU + Rapier + Howler, MIT source. It won Awwwards Site of the Month (Jan 2026), Site of the Day (21 Jan 2026) and Portfolio Honors.
- abeto's Igloo Inc: Awwwards **Site of the Year 2024**.
- abeto's Messenger: Awwwards **Site of the Year 2025**, a "15-minute experimental game".

This calibrates the feasibility case. An award-level *small* piece is within reach of a 2–3 person team with strong technical-art skills, but not a sprawling world.

### Cited Findings
- Igloo Inc (abeto) won Awwwards **Site of the Year 2024**. Jury member Quintin Lodge: it "combines an immersive 3d experience with an easy to navigate, scroll interaction" — [Awwwards SOTY 2024](https://www.awwwards.com/annual-awards-2024/site-of-the-year). abeto also posted "We won Site of the Year and Developer Site of the Year" — [abeto on X](https://x.com/abeto_co/status/1900152588768579701).
- Igloo Inc stack: Three.js, custom WebGL shaders, Houdini, Blender, Svelte, GSAP, Vite, three-mesh-bvh. Custom exporters include a VDB volume exporter with output "smaller ... than ... a typical website image". abeto describes itself as "a small, specialised team of technical artists" (no headcount given) — [Awwwards Igloo case study](https://www.awwwards.com/igloo-inc-case-study.html). Further technical write-up on crystal growth algorithms: [webgpu.com showcase](https://www.webgpu.com/showcase/igloo-inc-procedural-crystals/) (not reviewed).
- abeto's Awwwards profile: "Messenger — SOTY Site Of The Year 2025, Developer Award"; "Igloo Inc — SOTY 2024" — [Awwwards abeto](https://www.awwwards.com/abeto/submissions). Messenger was Site of the Day on 10 Nov 2025 (7.92/10): "It's a small planet, but someone's gotta make the deliveries" — [Awwwards Messenger SOTD](https://www.awwwards.com/sites/messenger).
- Messenger: "15-minute experimental game. Code: Three.js, three-mesh-bvh, vanilla Javascript, and C++". 3D in Houdini and Blender; WebAssembly for glyph generation; WebGL UI; per-area soundscapes; 3D spatial audio on NPCs — [Awwwards Messenger case study](https://www.awwwards.com/messenger.html).
- Bruno Simon's portfolio (2025):
  - started about five years after the 2019 version, with "a release goal for the end of 2025", documented in devlogs, with multiplayer features — [Awwwards case study](https://www.awwwards.com/brunos-portfolio-case-study.html);
  - awards: Site of the Month Jan 2026, Portfolio Honors Dec 2025, Developer Award; the 2019 portfolio was SOTY 2019 — [Awwwards Bruno Simon](https://www.awwwards.com/bruno.simon/submissions);
  - Site of the Day 21 Jan 2026, 8.11/10 — [Awwwards SOTD](https://www.awwwards.com/sites/brunos-portfolio).
  
  Note the conflict: the Sites-of-the-Month listing also shows "Site Of The Month Feb, 2026" near the entry — [Awwwards SOTM list](https://www.awwwards.com/websites/sites_of_the_month/). Verify which month.
- Awwwards SOTY 2025 listing shows Messenger (abeto) — [Awwwards Sites of the Year](https://www.awwwards.com/websites/sites_of_the_year/).
- Codrops 2026 ink-wash garden "Still" is a WebGPU/TSL generative piece in a Japanese ink idiom — [Codrops](https://tympanus.net/codrops/2026/09/09/still-from-akira-to-ink-wash-building-a-generative-garden-in-webgpu/).
- Comparison point from games: Pentiment peaked at about 15 people — [GamesHub](https://www.gameshub.com/news/features/pentiment-interview-xbox-obsidian-entertainment-hannah-kennedy-art-director-34642/).

### Inferences
- **What wins awards here:** a single strong idea; a tightly scoped, game-like loop (Messenger is 15 minutes); a unified, restricted palette (16×16 atlas); bespoke outline rendering; sound design; and relentless mobile optimisation. Content breadth is not what wins. This matches a "one perfect print-world" strategy far better than a whole walkable Edo.
- **Team calibration:** abeto (small technical-artist studio, Houdini + Blender + custom tooling) and Bruno Simon (solo, about a year part-time alongside teaching) show that 1–3 expert people can reach SOTD/SOTY level on three.js. For a zero-budget education team without a dedicated technical artist, expect "SOTD-quality" on a small piece only with 3–6 months of focused work and a disciplined scope.

### Gaps
- Lusion and Active Theory recent making-ofs, and Google "Lines" / "Infinite Pattern" experiments, were not verified in this session (search budget exhausted). Do not cite them without checking.
- Exact headcounts and timelines for Igloo Inc and Messenger are not published in the case studies.

---

## 9. Recommendation: 2–3 game-like pieces realistically buildable at zero cost by a small team

### Takeaway
Build three pieces, in this order of value per effort:
1. **"Print the Wave" registration/colour-block workshop**: a 2.5D or orthographic three.js mini-game. It is the best pedagogy-to-cost ratio.
2. **"Carry the print" route diorama**: an on-rails multi-plane journey through 3–5 layered Hiroshige/Hokusai PD prints, with light choices at each station.
3. **"Atlas ink globe" hub**: a stylised three.js globe/map with animated brush-stroke trade routes, sitting over the existing d3-geo/topojson data, with the 2D map as fallback.

Do **not** build a free-roam 3D 1859 Edo, or anything on Godot or Unity.

### Cited Findings (evidence underpinning the recommendation)
- Small, tightly scoped game loops win top awards (Messenger: "15-minute experimental game", SOTY 2025) — [Awwwards](https://www.awwwards.com/messenger.html); [Awwwards abeto](https://www.awwwards.com/abeto/submissions).
- three.js + Blender is the proven zero-licence-cost stack — [Bruno Simon case study](https://www.awwwards.com/brunos-portfolio-case-study.html); [Igloo case study](https://www.awwwards.com/igloo-inc-case-study.html).
- The ukiyo-e look is achievable with cheap passes: two-band toon, fwidth contour lines and a screen-space silk/paper overlay — [Codrops "Still"](https://tympanus.net/codrops/2026/09/09/still-from-akira-to-ink-wash-building-a-generative-garden-in-webgpu/); Sobel outlines — [Maxime Heckel](https://blog.maximeheckel.com/posts/moebius-style-post-processing/).
- Uki-e perspective (1739–1750s) offers a historically grounded reason to use one true-3D interior — [Wikipedia Uki-e](https://en.wikipedia.org/wiki/Uki-e); [Met 56534](https://www.metmuseum.org/art/collection/search/56534).
- Accessibility requirements favour on-rails or cut-based cameras and single-input control (Messenger's one-finger control; XAG 117) — [Awwwards Messenger](https://www.awwwards.com/messenger.html); [XAG 117](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117).

### Inferences

**Piece A: "Print the Wave" workshop (highest priority)**
- **Mechanic.** The learner plays the printer:
  1. choose keyblock → colour blocks in order;
  2. align the paper to the kentō marks (drag or keyboard nudge);
  3. brush pigment (one tap or keypress);
  4. apply bokashi by dragging a gradient wipe;
  5. pull the print. Misregistration shows visibly.
  
  A publisher-shop meta-layer (Tsutaya Jūzaburō-style) adds choosing a print run size, censorship seal (aratame), and selling at the shop. It is a menu loop, not 3D.
- **Tech.** three.js orthographic camera (or PixiJS 8 at 231 KB gz if the team prefers 2D). Layers are PD-print-derived block separations as WebP/KTX2. The paper shader adds fibres plus a pigment-absorption mask. No physics.
- **Budget.** ≤30 draw calls; ≤4 MB payload; render-on-demand.
- **Effort estimate.** 1 developer + 1 designer/art historian, 6–10 weeks.
- **Accessibility.** Fully keyboard operable, no timing, works in reduced motion.

**Piece B: "Carry the print" route diorama**
- **Mechanic.** Carry a finished print from the publisher in Nihonbashi along the Tōkaidō (or across Edo to a buyer). There are 3–5 stations, each a multi-plane diorama built from a PD print: layers cut by hand, plus Depth-Anything depth for subtle parallax as already planned. Each station has one interaction (choose route or weather, meet a character, answer a question). Ink-dissolve transitions run between stations.
- **Camera.** Spline dolly authored with @theatre/core (Apache-2.0; studio used only locally) or hand-coded curves. Reduced-motion uses cuts.
- **Optional true-3D beat.** One uki-e kabuki-theatre interior (after Masanobu 1748) where the learner toggles between "flat ukiyo-e layering" and "one-point uki-e perspective". It uses a few Blender boxes textured from the PD print.
- **Effort estimate.** 1 developer + 1 technical artist, 8–12 weeks.

**Piece C: Atlas ink globe hub**
- **Mechanic.** three.js sphere (or flat map plane) with a washi base texture and land masses drawn as sumi-ink fills from the existing topojson (rasterised offline into a 2K–4K texture). Animated brush-stroke arcs show trade and influence routes (instanced line ribbons with a dissolve shader). Unit nodes are hanko-seal markers. A timeline scrubber drives which routes are drawn.
- **Fallback.** The existing d3-geo/d3-zoom 2D map remains the accessible primary path, and the globe is progressive enhancement.
- **Budget.** ≤20 draw calls; ≤2 MB textures.
- **Effort estimate.** 1 developer, 4–8 weeks; reusable across all 35 units, which is the highest leverage.

**Explicitly deprioritised**
- Walkable or flyable 1859 Edo: months of work; no consistent CC0 Edo assets; accuracy risk; motion-sickness and accessibility burden.
- Godot: the 16 MB per-file limit versus a ~40 MB wasm, and canvas-only UI.
- Unity: proprietary.
- Physics engines: 1.1–1.6 MB gz for no pedagogical gain.

**Shared foundation to build once**
- the `edoPrint` material (palette atlas, two-band toon, bokashi LUT);
- an edge+paper post-pass with quality tiers;
- an input layer (pointer/keyboard/switch);
- a motion-preference manager;
- a localStorage save helper;
- a caption and audio manager.

This is the motion-token system the earlier study proposed, extended to 3D.

### Gaps
- Effort estimates are the researcher's judgement, not sourced benchmarks.
- Historical-accuracy review (e.g. Edo printing workshop roles, kentō practice, aratame seals, the 1859 Edo map) belongs to the content research stream and was not covered here.
- Real-device performance of the proposed shader stack has not been prototyped. Recommend a one-week spike measuring frame time on two or three phones before committing.

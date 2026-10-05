# Feasibility visuals for the Concept Composer

Study date: 2026-10-06. Scope: how to show a design lead, at a glance, whether the options they picked (one per dimension, ~9 dimensions, drawn from v0 to v4 of the Edo unit) can be built together. Companion to `_catalogue.md`, `_matrix.md` and `methods.json` in this folder.

Evidence labels: **[multi]** = two or more independent sources agree; **[single]** = one source only; **[vendor]** = documentation of a product, not a study; **[inference]** = our reasoning, not a finding.

Platform facts we design against (from the claude.ai Artifact contract, not the web): one publish sends at most 255 files and 64 MB; a version may hold up to 511 files; page at most 16 MB; no external fetch except listed CDNs. These are hard limits, so they are the only budget numbers we can show without hedging.

---

## Q1. How do morphological-analysis tools visualise consistency?

**Takeaway.** The established pattern, used by Ritchey's MA/Carma and by the open-source `morphr`, is the "inference model": the Zwicky box stays on screen, the values you fix are marked in one colour, and every value in the other columns that is still consistent with them is marked in a second colour. Anything unmarked is out. The cross-consistency matrix sits behind this as a triangular grid with one symbol per cell. Nobody has published a user study of these screens. The pattern is sound for our page, but the red and blue colour scheme has to change.

**Cited findings.**
- MA/Carma display field: "input conditions selected by the user" are shown in **red**, the corresponding outputs in **blue**, and values changed during a what-if run in **light blue**. A user can "freeze" one configuration, change inputs, and watch the outputs move. "Anything can be an input, and anything an output." [vendor] https://www.swemorph.com/macarma.html ; same scheme in the figure captions of https://www.swemorph.com/pdf/macasper1.pdf
- Ritchey, GMA overview: "Figure 4 shows a single driver input (red) and a clustered output", and multi-driver inputs work the same way. The constrained field "becomes an inference model or virtual laboratory". [single author, repeated across his papers] https://www.swemorph.com/pdf/gma.pdf ; https://www.swemorph.com/ma.html
- Scale of the reduction: a field of "as many as 100,000 formal configurations requires no more than a few hundred pair-wise evaluations" to produce a solution space. [single] https://www.swemorph.com/ma.html
- Cross-consistency matrix (CCM): triangular, with parameter blocks in "alternating shaded and white quadrants". Cell keys: "─ = Possible; good fit", "K = Possible; but not optimal; on the boundary", "X = Impossible". Each judgment can also be typed as logical, empirical or normative. Constraints "gather in corners" of blocks. [single] https://www.swemorph.com/amg/pdf/amg-4-2-2015.pdf
- Independent description by Zec (GI): MA/Carma "facilitates exploratory what-if analyses by specifying fixed or exogenous values (red). Remaining parameter values that preserve consistency are highlighted (blue)." Parmenides EIDOS instead projects every configuration onto a 2D plane, with similar configurations drawn close together. The paper reports **no user study**. [multi with Ritchey] https://dl.gi.de/bitstreams/37c02d1a-57bf-47a9-bd9f-f055d8ac7901/download
- `morphr` (R / DataTables, open source): "The selected cell is colored red and the cells remaining consistent with the selection are colored blue." Clicking a selected cell again deselects it. [vendor] https://github.com/sgrubsmyon/morphr
- Design-engineering practice: Zwicky's own 3D "drawer" figure greyed out the chosen solution. Heller et al.'s Excel tool added pairwise compatibility matrices and rank vectors, and allowed rows with different numbers of options. [single] https://www.designsociety.org/download-publication/35165/
- Practitioner guides (si-labs) rate pairs ✓ / x / ? and "eliminate all solution paths that contain at least one inconsistent pair", but show this only in tables. One idea worth keeping is a different colour per candidate solution path. [vendor] https://www.si-labs.com/en/articles/morphological-box/
- A neighbouring field does the same thing: the FeatureIDE configuration editor (software product lines) propagates decisions. Implied selections get a different mark from manual ones, features that can no longer be chosen are **grey**, validity sits in the header, and features whose change would make the configuration valid are highlighted. [vendor] https://github.com/FeatureIDE/FeatureIDE/wiki/Configuration-Editor

**Inferences.**
- The solution-space view answers "what is still possible given what I fixed". Our lead's question is a little different: "is the full path I picked possible, and if not, where does it break?" Since the lead fixes all 9 dimensions, MA/Carma's "blue = still consistent" set shrinks to the chosen path. So we need a second encoding: for each option *not* chosen, how many conflicts would there be if the lead swapped to it ("delta badges"). [inference]
- Red means "error" in most UIs, so red for "selected" would be misread. Use the brand accent for "selected" and keep red-family colours for conflicts. [inference]
- Ritchey's three-way key (─ / K / X) maps one-to-one to our compatible / needs adaptation / incompatible. We should add a fourth state, **not yet judged**: with 9 dimensions × ~4–6 options there are hundreds of cells, and some will be empty. An empty cell must never read as "fine". [inference]
- Search is cheap at our size. Nine dimensions with ~5 options each is ~2 million paths. A backtracking search pruned on X cells finds the consistent count and the nearest consistent paths in well under a second in browser JS, so we can show "N of M combinations are buildable" the way Ritchey does. [inference; verify with real option counts]

**Gaps.** No screenshots of the current MA/Carma UI could be fetched (only captions). No empirical evaluation of any morphological-analysis UI was found. Ritchey's claims come from his own papers.

---

## Q2. Configurators: how they show conflicts, and what users understand

**Takeaway.** Configurator research says three things over and over: (1) show the current state of the configuration and whether it is valid, (2) explain *why* an option is unavailable or was changed, in plain words, and (3) offer a repair ("change X to Y"). Most real configurators fail at all three. Opinion splits on whether to grey out or hide incompatible options. The best-supported compromise is to keep them visible, muted, and attached to a reason.

**Cited findings.**
- Leclercq, Cordy, Dumas & Heymans (2018), 28 car configurators: **82%** let users make incompatible choices ("unchecked errors"), **46%** do not explain "why errors are raised or why some options became mandatory or unavailable", **64%** offer no repair, **82%** do not show the current state of the configuration, and **36%** show no progress. "75% … show more than three types of UX flaws." [single study, small sample] https://ceur-ws.org/Vol-2068/wii1.pdf
- Lubos et al. (2025/26, arXiv 2605.29456): an LLM-assisted audit of 16 configurators against 18 criteria drawn from earlier literature found **75 major and 73 minor** issues. Criteria include "transparency of dependencies … explain dependencies of options at decision time", explaining "why a configuration is inconsistent … using actionable, non-technical language", repair suggestions ("change X to Y"), and "continuous product preview". It cites Leclercq et al. for the best practice of "avoiding disabled configuration options". [single; criteria are a synthesis, not new user data] https://arxiv.org/html/2605.29456v2
- Felfernig, Friedrich, Jannach & Zanker (2001): use model-based diagnosis to compute "adequate (or optimal) reconfiguration or recovery actions" when a user's choices have no solution. [multi; this line of work spans 20 years] https://link.springer.com/chapter/10.1007/3-540-45517-5_82
- Felfernig & Schubert (2011), PersDiag: *personalised* diagnoses that rank repairs by what this user probably prefers, with better "prediction quality and efficiency". [single] https://www.cambridge.org/core/journals/ai-edam/article/abs/personalized-diagnoses-for-inconsistent-user-requirements/B9AE6C1CCD9108554569C2AB2261E6F0
- Felfernig et al. (2025), QuickXPlain / FastDiag for feature-model configuration. QuickXPlain finds a minimal *conflict set* (the smallest group of choices that cannot coexist) and FastDiag a minimal *diagnosis* (the smallest set of choices to change). The authors say outright that they ran no user studies and that it is unknown "in which context to provide which explanation or repair". [single] https://ceur-ws.org/Vol-4149/paper1.pdf
- PCPartPicker: a compatibility filter (on by default) shows only parts compatible with the current build, and a build-level banner lists "potential issues or incompatibilities". It also keeps a running power estimate. A reviewer calls the warnings "a little overzealous" on size. [vendor and secondary] https://www.cgdirector.com/pcpartpicker-compatibility-warnings-explained/
- Smashing (2018): some dependencies "could be made clear right away, or hidden from sight altogether". Bundling into packages (Mini) prevents bad combinations up front. Users abandon a configurator after 2–3 steps if the preview lags. On mobile the product visual should take 65–75% of vertical space. [single, practitioner] https://www.smashingmagazine.com/2018/02/designing-a-perfect-responsive-configurator/
- Streichsbier et al. (2014), think-aloud with 9 users on 4 T-shirt configurators: "a realistic and good looking product visualization is crucial". Where the toolbox sits barely mattered. [single, N=9] https://mcp-ce.org/wp-content/uploads/proceedings/2014/32_streichsbier.pdf
- Nielsen (2024, a review of guidance from many sources): "display disabled features in muted colors, accompanied by explanations of why they are currently unavailable". About 76% of sources favour visible-but-disabled over hiding or error-on-click. A disabled control must not be "a communication dead end". Hide only what is *never* available to that user. [multi, as a synthesis] https://www.uxtigers.com/post/inactive-buttons

**Inferences.**
- This is not a purchase flow. The lead is a designer who *wants* to try infeasible combinations to see what breaks. So we never block a selection: an incompatible option stays selectable, is clearly marked, and the verdict changes. This also avoids the "disabled = dead end" problem. [inference]
- The repair list is the most valuable output, because it is what 64% of car configurators lack. With 36 pairs on a 9-dimension path we can enumerate repairs exhaustively (all single and double swaps that remove every X) instead of approximating FastDiag. Rank repairs by (a) how few dimensions change and (b) closeness to v4 or to options the lead approved, which is a crude stand-in for PersDiag. [inference]
- Configurators keep state visible ("unknown configuration state" was an 82% failure). Our page needs a verdict that is always on screen. [inference]

**Gaps.** Baymard has no public configurator-conflict research we could reach. The 2022 TOCHI survey "Essential Expectations of Users of Web Configurators" (https://dx.doi.org/10.1145/3534519) was paywalled (403), so its numbers are not used. Felfernig's ACM survey was not read in full.

---

## Q3. Constraint-graph visuals: matrix, node-link, chord, traffic light, parallel coordinates and sets

**Takeaway.** Use a **triangular matrix of the chosen path's 36 pairs** as the primary pairwise view, with a glyph in each cell. Show the path itself as a **polyline through the Zwicky box**, which is a parallel-coordinates idiom. Do not use chord diagrams or parallel sets. Use traffic-light colour only together with shape and text.

**Cited findings.**
- Ghoniem, Fekete & Castagliola (2004): "for small sparse graphs, NL [node-link] was better in connectivity tasks, but … for large and dense graphs, AM [adjacency matrix] outperformed NL for all tasks" (as summarised by Okoe et al.). [multi] https://datavis2020.github.io/pdfs/ghoniem2004.pdf
- Okoe, Jianu & Kobourov (2018), larger graphs (258 and 332 nodes): node-link wins on topology and path tasks, matrices win on group and cluster tasks and on finding common neighbours. Effectiveness "depends heavily on the properties of the given dataset and the given data-reading tasks." [multi] https://www2.cs.arizona.edu/~kobourov/NL-AM-TVCG18.pdf
- Parallel Sets (Kosara, Bendix & Hauser 2006) show *frequencies* of categorical combinations as ribbons whose width is proportional to the count. They suit populations of records, not a single path. [single, foundational] https://eagereyes.org/publications/Kosara-TVCG-2006
- Revit Generative Design uses parallel coordinates by default for many options (one polyline each), with brushing on axes, a linked scatterplot, a thumbnail grid, and cross-highlighting between views. "For optioneering … parallel coordinates work well for exploration." [vendor] https://www.generativedesign.org/03-hello-gd-for-revit/03-04_visualizing-results-in-gd-for-revit
- Chord diagrams "are not straightforward to understand at all". Arc crossings and clutter are the main problems. [single, practitioner] https://www.data-to-viz.com/graph/chord.html
- Red/green traffic lights: red-green colour-vision deficiency affects about 1 in 12 men of Northern European descent. [multi, medical reference] https://medlineplus.gov/genetics/condition/color-vision-deficiency/
- Carbon: status indicators "should rely on at least two of … color, shape, or symbol", need ≥3:1 contrast, and should pair icons with text labels. [vendor] https://carbondesignsystem.com/patterns/status-indicator-pattern/
- GOV.UK task list research: users tried to click status tags that looked like buttons, and uppercase tags were hard to read. Completed items are now plain text without colour, so attention goes to what still needs action. [single, government research] https://designnotes.blog.gov.uk/2023/12/15/working-as-a-community-to-iterate-the-task-list-pattern/

**Inferences.**
- A 9-option path has every pair defined, so its graph is complete (K9, 36 edges) and dense. That is matrix territory by Ghoniem. A node-link view earns a place only if we draw *just the problem edges* (sparse), as a small "conflict web" inside the verdict. Treat that as optional. [inference]
- The Zwicky polyline shows only the 8 pairs between *adjacent* columns. Edges between non-adjacent columns would be arcs and quickly become clutter. So the path board must show each column's *worst involvement* (a node glyph), not edge colours, and leave pairwise detail to the matrix. [inference]
- Overlaying the v0 to v4 paths as thin, labelled polylines (the Revit pattern with five lines) answers "where does my concept depart from v4" for free. Use a different dash per version, not only colour. [inference]
- Traffic-light treatment: the "compatible" state should be visually quiet (neutral check, no fill), following GOV.UK, so amber and red stand out. [inference]

**Gaps.** No study compares matrix and node-link for a 9-node complete graph read by a non-specialist. We extrapolate from the dense-graph results.

---

## Q4. A live composed preview (blueprint) showing where the problem sits

**Takeaway.** Rendering the composed concept as a schematic wireframe of the page answers "what would this be" in a way no matrix can. Configurator users rank the live preview as decisive, and it must update fast. Mark adaptation and conflict directly on the affected regions with hatch patterns *and* numbered callouts. Do not use sketchy rendering to encode status.

**Cited findings.**
- Continuous product preview is a core configurator criterion (Lubos et al., above). Lag between change and preview drives abandonment within 2–3 steps (Smashing, above). Preview quality was the deciding factor for N=9 users (Streichsbier, above). [multi]
- Dynamic queries (Ahlberg and Shneiderman): visual representation of the query and of results, rapid, incremental, reversible actions, selection by pointing, and feedback within about 100 ms. These were faster than form or natural-language queries in the HomeFinder and periodic-table studies. [multi] https://www.cs.umd.edu/~ben/papers/Shneiderman1994Dynamic.pdf
- RAIL: complete a response to input within 100 ms (handle input in 50 ms). Animation frames in ≤10 ms of script work, 16 ms total budget. [vendor, Google] https://web.dev/articles/rail
- Sketchy rendering (Wood, Isenberg, Isenberg, Dykes et al. 2012): it raised engagement (negative comments 43% neutral vs 17% sketchy). But it "results in greater error for relative size estimation", and its degree is judged only ordinally and "varies strongly between individuals". [single] https://openaccess.city.ac.uk/id/eprint/1274/1/wood_sketchy_2012.pdf
- Design-system playgrounds (Storybook Controls, "props combinations" add-ons) render a component live from chosen prop values, or render every combination of values in a grid. [vendor] https://github.com/evgenykochetkov/react-storybook-addon-props-combinations ; https://nordhealth.design/updates/march-2026-storybook-playground/

**Inferences.**
- The blueprint is generated from a lookup table: each option contributes *regions* to a page skeleton. Layout sets the grid; navigation adds a top bar, side rail, bottom tabs or map hub; each tool adds a docked or inline panel; text density sets line counts; animation level adds motion marks; narrative spine labels the section sequence; visual language adds a type and palette tag. Every region keeps a link to the option that made it. A pair's verdict then lands on the regions of both options in that pair, so the hatch appears where the problem actually is. [inference]
- Spatial collisions can be detected rather than authored: if two regions occupy the same slot (bottom-tab navigation and a bottom-docked tool tray on phone), we draw an overlap. That is a real feasibility signal that a hand-filled matrix may miss. [inference; mark collision-derived flags "auto" so they are not mistaken for CCA judgments]
- Sketchiness is fine as the blueprint's *overall* style ("this is a schematic, not a mock-up"). Because of Wood et al., do not use it to encode status. [inference]

**Gaps.** No study measures whether wireframe previews improve design-decision quality. The evidence comes from consumer configurators (purchase intent), not from design leads.

---

## Q5. Feasibility beyond pairs: budgets and effort without false precision

**Takeaway.** Show aggregate constraints as **bullet graphs** (a bar against qualitative bands and a limit marker), not gauges. Show effort as a **range**, not a sum. Show a single number only where it is truly exact (file count against the 255-file publish limit). Everything else gets an ordinal label: fits, tight, over.

**Cited findings.**
- Few's bullet graph replaces dashboard gauges: a featured bar, a perpendicular comparative marker, and "a maximum of five and ideally … three" qualitative ranges, encoded "as distinct intensities" rather than hues so colour-blind readers can use it. [single, but a de facto standard] https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf
- Padilla, Kay & Hullman (2020/22): people read interval boundaries as hard categories ("deterministic construal errors", e.g. error bars read as highs and lows). Icon arrays and quantile dotplots let readers *count*, and frequency formats beat intervals for lay readers. "If a designer needs to show an interval, we also recommend displaying information that is more representative." [multi, as a review] https://friendly.github.io/6135/papers/Uncertainty_Visualization_Padilla_Kay_Hullman_2020.pdf
- RAIL frame budget (above) gives the only defensible threshold for the animation-level dimension: ≤10 ms of script per frame on a mid-range phone. [vendor]

**Inferences.**
- **Effort.** Map S/M/L to ranges (for example S 0.5–1 d, M 1–3 d, L 3–8 d; set these from the team's own history). Sum the low ends and the high ends to show "about 9–21 days" as a band on a bullet graph whose qualitative ranges are the team's capacity. Never print the midpoint alone. [inference]
- **Files.** Count exactly from the option manifest (each option declares the files it adds). Show "212 / 255 per publish" with a limit marker. Over 255 means it needs more than one publish: this is *amber*, not red, because the platform allows multiple publishes up to 511 files per version. [inference from platform contract]
- **JS weight and frame cost.** These cannot be known before building. Show them as an ordinal risk (low, medium, high) derived from the animation and interactivity option plus the tool count. Label it "estimate". [inference]
- **Accessibility risk.** Treat as an ordinal flag per option (for example drag-only interactions, canvas-only content, motion-heavy scenes), summed into a 3-level label. A visible list of contributing options is more honest than a score. [inference]
- An icon array of the 36 pairs (36 small glyphs grouped by status) is a count-friendly summary that fits Padilla et al.'s advice better than a percentage. [inference]

**Gaps.** No source gives per-option JS or frame costs for our components. These need a measurement pass on v0 to v4 builds before any number appears.

---

## Q6. Accessibility of these visuals

**Takeaway.** Every status needs three channels: glyph shape, pattern or fill, and a text label. Every chart needs a real HTML equivalent (a table or list) and must be fully keyboard-operable. Use patterns that survive forced-colours mode.

**Cited findings.**
- WCAG 1.4.1 Use of Color (A): colour must not be "the only visual means of conveying information". Use patterns with colours in charts, icons with text alternatives for status, and text cues for errors. [standard] https://www.digitala11y.com/understanding-sc-1-4-1-use-of-color/
- WCAG 1.4.11 Non-text Contrast (AA): graphical objects needed to understand content, and UI component states and focus indicators, need ≥3:1 against adjacent colours. [standard] https://tabnav.com/academy/wcag/success-criterion-1.4.11
- WCAG 2.5.8 Target Size (Minimum, AA, new in 2.2): targets at least 24×24 CSS px, or spaced so a 24 px circle fits. [standard] https://wcag22aa.org/new-criteria/target-size/
- Two-dimensional grids: the APG keyboard-interface practice describes arrow-key movement inside composite widgets with a single tab stop (roving tabindex). [standard practice] https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- Carbon: ≥3:1 between status colours and against the background, and use at least two of colour, shape and symbol (above). [vendor]

**Inferences.**
- Glyph set (distinct silhouettes, not just colour): **✓ in a circle** = compatible (neutral ink, no fill); **~ in a diamond** = needs adaptation (amber, 45° diagonal hatch); **✕ in a square** = incompatible (red-magenta, crosshatch); **? in a dashed circle** = not yet judged (outline only). These should be checked in greyscale and with a deuteranopia simulation. [inference]
- Render hatches as SVG `<pattern>` with `stroke="currentColor"`, and add a `@media (forced-colors: active)` rule so they fall back to system colours while keeping the pattern geometry. [inference]
- Announce verdict changes through one debounced `aria-live="polite"` region, using text such as "Buildable with 2 adaptations; 0 conflicts". Do not announce every cell. [inference]
- `prefers-reduced-motion`: no path-drawing animation, so changes appear immediately. [inference]

**Gaps.** No testing of these specific glyphs with screen-reader or low-vision users has been done yet. Plan a 3 to 5 person check.

---

## Recommendation for our page

Build three linked devices. All share one selection state, recompute in under 100 ms, and cross-highlight (focusing any option, pair or region lights up the same thing in the other two, as in Revit GD's linked views).

Shared status vocabulary (used everywhere, never colour alone):

| State | Glyph | Fill or pattern | Text |
|---|---|---|---|
| Compatible | ✓ in circle | none (neutral ink) | "Works" |
| Needs adaptation | ~ in diamond | amber + 45° hatch | "Adapt" |
| Incompatible | ✕ in square | red-magenta + crosshatch | "Conflict" |
| Not yet judged | ? in dashed circle | outline only | "Unjudged" |

"Selected" uses the page accent (not red, unlike MA/Carma) and a thick outline. Every token must reach ≥3:1 against its neighbour in both light and dark themes.

### Device 1: Verdict bar and Path Board (the "is it possible?" answer)

**Purpose.** The instant answer, plus where the path breaks. It merges MA/Carma's inference view with a configurator's always-visible state and validity summary.

**Layout (desktop ≥ 900 px).**
- **Verdict bar**, sticky at the top:
  - A large glyph and sentence: "Buildable", "Buildable with 3 adaptations", or "Not buildable: 2 conflicts". Then "· 4 pairs unjudged" when relevant.
  - A 36-glyph **pair icon array**, grouped by status (Padilla: countable).
  - The solution-space line: "1,248 of 15,625 combinations are conflict-free". Show this only once the CCA is complete. Before that, it reads "…based on 212 of 240 judged cells".
- **Path Board** below: 9 columns (one per dimension, in a fixed order that keeps strongly coupled dimensions adjacent: layout, navigation, tools, animation, …), with option chips stacked in each column.
  - The chosen chips are joined by a polyline (the Zwicky path).
  - v4's path is shown as a thin dashed line labelled "v4". Lines for v0 to v3 can be toggled.
  - The chosen chip in each column carries a **node glyph** for the worst status among its 8 pairs.

**Encodings on unchosen chips.** A delta badge shows the conflict and adaptation counts if the lead swapped to that option (for example "−2 ✕" or "+1 ~"). Chips that would add a conflict are muted with a crosshatch corner but stay clickable (Nielsen: visible, explained, never a dead end). Approved and rejected options from the review flow show a small tick or strike.

**States.**
- Empty: no selection; start from v4.
- Partial: some dimensions unset; verdict says "7 of 9 chosen".
- Complete.
- Frozen comparison: the "Compare with v4" toggle switches the dashed line on and lists the dimensions that differ.

**Interactions.**
- Click or Enter on a chip selects it.
- Hover or focus previews it: a ghost path plus the delta in the verdict bar, without committing.
- "Show repairs" opens a list of minimal swaps that clear every ✕ (exhaustive search over single and double swaps), ranked by fewest changes and then by closeness to v4 or approved options. Each repair shows a one-click "Apply".
- Undo and redo.

**Phone (≤ 600 px).**
- The verdict bar stays sticky with a compact version: glyph, sentence, and a 36-dot array in 2 rows of 18.
- The Path Board becomes a vertical **spine**: 9 rows, each showing the dimension name, the chosen chip and its node glyph, with the spine line running down the left edge.
- Tapping a row expands its alternatives with delta badges (a disclosure, no horizontal scroll).
- Targets ≥ 44 px tall (well above the 24 px minimum).

**Accessibility.**
- Each column is a `radiogroup` with arrow-key movement. Each option's accessible name includes its status and delta, for example "Bottom tab bar, selected, 1 conflict with Tool dock".
- Verdict changes go to an `aria-live="polite"` region, debounced by 500 ms.
- The polyline is decorative (`aria-hidden`), because the spine and list carry the same information.

### Device 2: Feasibility ledger (pair matrix and budgets)

**Purpose.** The "why", and the non-pairwise limits. It is Ritchey's CCM cut down to the chosen path, plus Few's bullet graphs.

**Layout.**
- **Pair matrix:** a lower-triangular 9×9 table (36 cells) with short dimension codes on both axes (Sp, Ly, Nv, Ln, Tl, An, Vl, Tx, Mx) and full names in a legend. Each cell shows its status glyph and pattern.
- Clicking a cell opens a detail panel with:
  - both options;
  - the judgment and its type (logical, empirical or normative, after Ritchey);
  - the rationale text and who judged it;
  - the adaptation needed, for amber cells;
  - the repairs that resolve it.
- Unjudged cells show "?" and a "Judge now" action (three buttons: Works / Adapt / Conflict, plus a rationale field). The lead fills the CCA from inside the composer.
- **Budget rows** below the matrix, one bullet graph each, with three grey-intensity bands (fits, tight, over) and a limit marker:
  1. **Files per publish**: exact count / 255. Above the limit means "needs 2 publishes" (amber).
  2. **Build effort**: a range bar ("about 9–21 days"), compared against a capacity marker the team sets.
  3. **Runtime risk** (JS and frame cost): ordinal low, medium or high, labelled "estimate". No bar length.
  4. **Accessibility risk**: ordinal, with a list of contributing options.
- Hard-limit breaches count in the verdict as conflicts. Ordinal risks count as adaptations.

**States.**
- Cell: default, focused, selected (outlined), or "auto" (flag derived from a Device 3 collision, marked "A").
- Budget: fits, tight or over, each with a text label.

**Phone.**
- At 360 px wide minus a 16 px gutter on each side, the matrix fits as 8 cell columns of 32 px plus a 40 px label column, about 296 px. Codes are shown, with names in a legend under the table.
- The detail panel opens as a bottom sheet.
- Budget graphs stack full width.

**Accessibility.**
- A real `<table>` with `<th scope>`. Each cell is a `<button>` with an `aria-label` such as "Navigation: map hub with Tools: docked tray: needs adaptation. Tap for reason."
- Optional roving tabindex with arrow keys across cells (APG), so there is one tab stop into the table.
- Bullet graphs are SVG with `role="img"` and a text value next to them ("212 of 255 files; fits").
- Bands differ by lightness, not hue (Few).

### Device 3: Blueprint (the composed page with problems shown in place)

**Purpose.** Show what the concept *is*, with feasibility problems drawn on the regions they affect. This follows the configurator "live preview" pattern.

**Layout.**
- A schematic SVG wireframe of the resulting page, with a toggle between **phone frame (default)** and **desktop frame**.
- It is generated from a lookup table that maps each option to regions:
  - the layout's grid;
  - the navigation component's position;
  - tool panels;
  - text blocks with line counts set by density;
  - motion marks (small chevrons) set by animation level;
  - a narrative-spine section list down the side;
  - a visual-language tag (type sample and 3 swatches).
- Monochrome line style. A light hand-drawn stroke is allowed as overall style only, never to encode status.

**Encodings.**
- Regions involved in an amber pair: amber 45° hatch, dashed border, and a numbered callout ("②") that links to the ledger cell.
- Regions involved in a conflict: crosshatch, a 2 px solid border, and a "✕ ③" callout.
- Auto-detected spatial collisions (two regions in the same slot) are drawn as a crosshatched overlap and labelled "auto".
- Every region has a caption naming its source option.

**Interactions.**
- Tapping a region selects its option in Device 1 and its pairs in Device 2.
- Hovering a ledger cell highlights its regions.
- "Diff with v4" draws v4's skeleton as a faint underlay.
- Export the blueprint and verdict as SVG or PNG plus a text summary into the ADR output.

**Phone.**
- The phone frame scales to full width (the page's target device, which matches Smashing's guidance to give the visual 65–75% of the height).
- Callouts become a numbered list under the frame.

**Accessibility.**
- The SVG has `role="img"`, a `<title>` and `<desc>`, plus an adjacent **text outline** (a "Page structure" ordered list: region, source option, status, issue).
- Callout numbers match list items.
- Hatch patterns use `currentColor` and are tested in `forced-colors`.
- No animation under `prefers-reduced-motion`.

### Build notes

- The data model needs four parts:
  - `options[]` with `{dim, id, label, version, effort:S|M|L, files:n, a11yFlags[], regions[]}`;
  - `cca[pairKey] = {status, type, rationale, judgedBy}`;
  - `budgets` with `{fileLimit:255, effortBands, capacity}`;
  - `paths` with `{v0..v4}`.
- Recomputing the full verdict, deltas and repairs is O(options × 36) per change: trivial. The full solution-space count uses backtracking with pruning, run in a Web Worker if it ever exceeds 50 ms.
- Ship Device 1 and Device 2 first, because they answer "possible or not". Device 3 depends on authoring the region lookup for every option, which is the main effort (about M to L).

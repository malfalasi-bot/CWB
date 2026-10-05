// Builds data/model.json for the Edo Concept Composer from
//   data/versions.json, data/options_seed.json, data/thumbs.json,
//   research_notes/Version compiler feasibility and methods/methods.json + teaching_methods.md,
//   specs/F1.*.md (unit titles) and docs/02-pass-2-v2/index.md (archetypes A–G).
// Every constraint below is authored here, with its reason and repair, so the page only evaluates.
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(dirname(fileURLToPath(import.meta.url)));
const MOD = join(HERE, '..', '..');
const NOTES = join(MOD, 'research_notes', 'Version compiler feasibility and methods');
const rd = (p) => readFileSync(p, 'utf8');
const versions = JSON.parse(rd(join(HERE, 'data/versions.json')));
const seed = JSON.parse(rd(join(HERE, 'data/options_seed.json')));
const thumbs = JSON.parse(rd(join(HERE, 'data/thumbs.json')));
const methods = JSON.parse(rd(join(NOTES, 'methods.json')));
const tmd = rd(join(NOTES, 'teaching_methods.md'));

// ---------------------------------------------------------------- criteria and dimensions
const CRITERIA = {
  thread: { label: 'Holds one thread', q: 'Does the learner feel one story from first screen to last?' },
  depth: { label: 'Carries the evidence', q: 'Is there room for sources, objects and nuance?' },
  orient: { label: 'Keeps the learner oriented', q: 'Does the learner always know where they are and what is next?' },
  craft: { label: 'Feels crafted', q: 'Does it stop feeling primitive (the recurring critique)?' },
  cost: { label: 'Cheap to build and keep', q: 'Days from today’s v4 codebase, and upkeep after.' },
  access: { label: 'Accessible (WCAG 2.2 AA)', q: 'Keyboard, motion, colour, targets.' },
  phone: { label: 'Works at 390 px', q: 'Phones are first-class (ARCH_V4).' },
  rules: { label: 'Keeps the house rules', q: 'No scores; seal red reserved; sentences ≤ 25 words.' },
  learn: { label: 'Evidence of learning', q: 'Does the research say learners remember or transfer more?' },
};

const DIMS = [
  { id: 'spine', code: 'Sp', label: 'Spine', question: 'What single thread carries the learner from the first screen to the last?', criteria: ['thread', 'depth', 'craft', 'cost'], beat: 'opening' },
  { id: 'layout', code: 'Ly', label: 'Layout', question: 'How do text, instruments and tools share the screen?', criteria: ['thread', 'craft', 'phone', 'cost'], beat: 'wave' },
  { id: 'navigation', code: 'Nv', label: 'Navigation', question: 'How does a learner know where they are and reach what they want?', criteria: ['orient', 'phone', 'cost', 'access'], beat: 'nav' },
  { id: 'tools', code: 'To', label: 'Tools', question: 'What do learners do with their hands?', criteria: ['craft', 'depth', 'cost', 'access'], beat: 'tool' },
  { id: 'motion', code: 'Mo', label: 'Motion', question: 'How much moves, and what does the motion explain?', criteria: ['craft', 'access', 'phone', 'cost'], beat: 'overture' },
  { id: 'mapping', code: 'Mp', label: 'Map', question: 'How does the map make place part of the argument?', criteria: ['depth', 'craft', 'cost', 'phone'], beat: 'map' },
  { id: 'timeline', code: 'Tm', label: 'Timeline', question: 'How does time become an instrument rather than a ruler?', criteria: ['depth', 'craft', 'phone', 'cost'], beat: 'timeline' },
  { id: 'questioning', code: 'Qn', label: 'Questions', question: 'Where do questions and checks sit inside the experience?', criteria: ['learn', 'rules', 'thread', 'access'], beat: 'question' },
  { id: 'people', code: 'Pp', label: 'People', question: 'How do we meet the people who made, sold and censored the prints?', criteria: ['depth', 'thread', 'craft', 'cost'], beat: 'person' },
  { id: 'text', code: 'Tx', label: 'Text', question: 'How much does the learner read, and in what voice?', criteria: ['depth', 'rules', 'phone', 'thread'], beat: 'wave' },
  { id: 'visual', code: 'Vs', label: 'Visual language', question: 'What world does the page look as if it comes from?', criteria: ['craft', 'thread', 'rules', 'cost'], beat: 'wave' },
  { id: 'methods', code: 'Me', label: 'Teaching-method mix', question: 'Which learning methods carry the content, for Edo and as a pattern for the course?', criteria: ['learn', 'depth', 'cost', 'thread'], beat: 'question' },
];

// ---------------------------------------------------------------- extra options (atlas path + method mixes)
const EXTRA_OPTIONS = {
  spine: [{
    id: 'spine-atlas-hub', label: 'Hub of chapters → units → stories → nodes', sourceVersions: ['atlas'],
    what: 'The Atlas hub: nine world chapters as washes on a globe; units are lenses; Edo is a story inside F1.8 that opens the unit.',
    why: 'One hub across all of F1; place is the organiser.', worked: 'List view is complete; every mark has a place and a source.',
    weaknesses: 'A hub, not a story: it routes learners into units rather than teaching by itself.', requires: [], conflicts: [], effort: 'L', quality: 'polished', poster: 'posters/atlas-opening-d.webp',
  }],
  layout: [{
    id: 'layout-panel-stage', label: 'Side card panel + globe/map stage', sourceVersions: ['atlas'],
    what: 'A left card panel with breadcrumbs beside a right stage with a lens bar, view switch, zoom pad and year scrubber.',
    why: 'A map-first hub layout.', worked: 'Clear split between where (stage) and what (panel).',
    weaknesses: 'No reading column: a long story would live in a 360 px panel.', requires: [], conflicts: [], effort: 'M', quality: 'polished', poster: 'posters/atlas-map-d.webp',
  }],
  text: [{
    id: 'text-card-copy', label: 'Short card copy with confidence words', sourceVersions: ['atlas'],
    what: 'A few sentences per chapter, unit and node card, each with a confidence word and “why this mark” edges.',
    why: 'Hub cards, not lessons.', worked: 'Honest and compact.', weaknesses: 'Cannot carry a 60-minute story.', requires: [], conflicts: [], effort: 'S', quality: 'working', poster: 'posters/atlas-person-d.webp',
  }],
};

const MIXES = [
  { id: 'me-lecture', label: 'Lecture-first: stations, prediction, check', sourceVersions: ['v0', 'v1'], methods: ['stepthrough', 'predict', 'retrieval'],
    what: 'Narrated stations in order, one one-tap prediction per lecture and a check at the end (v0 specified it; v1 built one lecture).',
    why: 'A familiar lecture-player shape.', worked: 'Clear sequence and one prediction per lecture.', weaknesses: 'Judged “lectures too thin”; checks are immediate, not spaced.', quality: 'working', poster: 'posters/v1-question-d.webp' },
  { id: 'me-narrative', label: 'Narrative-first: scrollytelling, comparison, prediction, recall', sourceVersions: ['v2', 'v3'], methods: ['scrolly', 'compare', 'predict', 'retrieval'],
    what: 'A scroll story that drives the stage, with compare-the-impressions moments, predictions and recall checks.',
    why: 'Engagement of a story; comparison and recall convert it into memory.', worked: 'Story and the three-Waves comparison read well.', weaknesses: 'v2/v3 checks were bolted on; recall was never spaced.', quality: 'working', poster: 'posters/v3-question-d.webp' },
  { id: 'me-v4', label: 'As built in v4: story, guesses, placement, comparison, desks, sandbox', sourceVersions: ['v4'], methods: ['scrolly', 'predict', 'chrono', 'compare', 'deduction', 'sim'],
    what: 'Scrollytelling with instrument-native guesses, Rebuild placement, three-Waves comparison, seal-dating desks and the edition and print sandboxes.',
    why: 'Questions folded into the experience; tools as practice.', worked: 'Broad and coherent; no scores.', weaknesses: 'Lacks worked examples, self-explanation, spaced retrieval and a portfolio export (teaching_methods.md §6).', quality: 'polished', poster: 'posters/v4-question-d.webp' },
  { id: 'me-evidence', label: 'Evidence-first: primary sources, deduction, worked examples, self-explanation', sourceVersions: [], methods: ['dbq', 'deduction', 'worked', 'selfexp'],
    what: 'The Historian reads one sheet mark by mark, then a half-read second, then one alone; seal-dating batches confirm in threes; one tap names the deciding clue.',
    why: 'Worked examples (g = 0.48) and self-explanation (g = 0.55) are the best-evidenced methods F1 under-uses.', worked: 'New: not built in any version.', weaknesses: 'Slower start; less story pull.', quality: 'unbuilt', poster: 'posters/v4-roomDesks-d.webp' },
  { id: 'me-making', label: 'Making-first: reconstruction, simulation, step-through', sourceVersions: [], methods: ['making', 'sim', 'stepthrough'],
    what: 'Print the Wave and a kitchen-table two-block print lead; the edition sandbox shows wear; the four hands as a step-through.',
    why: 'Tacit knowledge shows only when remade (Making and Knowing).', worked: 'New: the Workshop room exists, the method sequence does not.', weaknesses: 'Mixed evidence; physical making is off-platform.', quality: 'unbuilt', poster: 'posters/v4-roomWorkshop-d.webp' },
  { id: 'me-dialogue', label: 'Dialogue-first: controversy, Socratic partner, self-explanation, case', sourceVersions: [], methods: ['sac', 'socratic', 'selfexp', 'case'],
    what: 'Decision cases (Tsutaya’s fine, 1791), an argued card with two sourced readings, and the Historian partner who asks rather than tells.',
    why: 'Controversy beat debate and solo work (ES 0.62–0.76).', worked: 'New: the argued card exists in v4, the rest does not.', weaknesses: 'Needs text room and, for the partner, model inference.', quality: 'unbuilt', poster: 'posters/v0-question-d.webp' },
  { id: 'me-explore', label: 'Exploration-first: knowledge graph, virtual tour, portfolio', sourceVersions: ['atlas'], methods: ['graph', 'tour', 'portfolio'],
    what: 'Connect Two Things across the Atlas, the Hundred Views placed at their viewpoints, and inked marks kept in a notebook.',
    why: 'Creating maps beats studying them (g = 0.72 vs 0.43).', worked: 'The Atlas notebook and ink hand-off exist.', weaknesses: 'Browsing without a question is not learning; needs one question per view.', quality: 'working', poster: 'posters/atlas-question-d.webp' },
  { id: 'me-custom', label: 'Custom mix (pick methods in the catalogue)', sourceVersions: [], methods: [],
    what: 'Whatever you select in the Teaching methods section; its rules are derived from the methods you pick.', why: 'Compose your own sequence.', worked: '—', weaknesses: '—', quality: 'unbuilt', poster: null },
];

// ---------------------------------------------------------------- per-option engineering data
// provides: tags this option brings. requires: [{need:[tags], from:dim, level, reason, repair, alt}]
// conflicts: [{tag, level, reason, repair}]. budget: files (exact per our manifest), js KB (estimate),
// days [lo,hi] from today's v4 codebase, a11y/mobile 0 low 1 medium 2 high.
// repair: { text, swap: {dim: optionId}, days:[lo,hi] }
const R = (need, from, level, reason, repair, alt) => ({ need: [].concat(need), from, level, reason, repair, alt });
const C = (tag, level, reason, repair) => ({ tag, level, reason, repair });
const sw = (dim, id, text) => ({ text: text || null, swap: { [dim]: id } });
const fix = (text, days) => ({ text, days });

const X = {
  // ---- spine
  'spine-system-index': { idea: 'sound', pugh: '-+-+', provides: ['system-model', 'hub-content', 'system-diagram'],
    requires: [R('hub-nav', 'navigation', 'adapt', 'The diagram works as an index only on a hub surface that shows it (v1 Main.dc.html filtered cards from its five boxes).', sw('navigation', 'nav-hub-filter', 'Use the hub filter, or put the diagram in the opening as a contents card'))],
    conflicts: [], files: 1, js: 15, days: [2, 4], a11y: [0, ''], mobile: [1, 'Five-box diagram needs a phone layout'],
    borrow: ['System diagram as contents card', 'Tag every piece to a system box'],
    regions: [{ slot: 'hero', label: 'System diagram (5 boxes)', key: 'system-diagram', excl: true }] },
  'spine-chapters-motifs': { idea: 'weak', pugh: '-S-+', provides: ['linear-thread', 'chapters', 'dated-steps', 'map-beats', 'timeline-beats', 'city-beats'],
    requires: [R('scroll-driver', 'layout', 'conflict', 'Seven chapters run on one continuous scroll that changes the stage per beat (v2 app.js); this layout has no scroll driver.', sw('layout', 'layout-pinned-stage-cards'))],
    conflicts: [C('hub-first', 'adapt', 'A hub-first entry puts a choice in front of chapter 1; the motif thread only works read in order.', sw('navigation', 'nav-chapter-dots-explore'))],
    files: 0, js: 10, days: [2, 4], a11y: [0, ''], mobile: [0, ''], borrow: ['Learn the seal in ch. 3, use it in ch. 5', 'Motif list as an index'],
    regions: [{ slot: 'body', label: 'Chapters 0–6 in date order' }] },
  'spine-publishers-bets': { idea: 'strong', pugh: 'SS-+', provides: ['linear-thread', 'acts', 'act-opener', 'dated-steps', 'map-beats', 'timeline-beats', 'city-beats', 'segment-model'],
    requires: [R('scroll-driver', 'layout', 'adapt', 'Acts and beats assume a scroll that changes the stage per beat; on screens or a document the five acts become separate lecture pages.', sw('layout', 'layout-scene-sheets-rooms')),
      R('story-model', 'text', 'adapt', '62–71 beats live in story.yaml and are checked by build-content.mjs; without the pipeline the acts are hand-written HTML.', sw('text', 'text-linted-beats'))],
    conflicts: [], files: 0, js: 8, days: [0, 0.5], a11y: [0, ''], mobile: [0, ''], borrow: ['A publisher and a bet per act', 'Payoffs across acts'],
    regions: [{ slot: 'body', label: 'Act openers P, I–V + beats' }] },
  'spine-overture-coda': { idea: 'strong', pugh: 'SSSS', provides: ['linear-thread', 'acts', 'act-opener', 'overture', 'coda', 'dated-steps', 'map-beats', 'timeline-beats', 'city-beats', 'segment-model'],
    requires: [R('scroll-driver', 'layout', 'conflict', 'The nine-shot overture is scrubbed by scroll (src/overture.js calls setProgress from scroll); this layout has no scroll driver.', sw('layout', 'layout-scene-sheets-rooms')),
      R('webgl', 'motion', 'adapt', 'Without a WebGL stage the overture plays as nine composed stills (the existing fallback) and loses the depth that is its point.', sw('motion', 'motion-choreographed-3d')),
      R('guess-ledger', 'questioning', 'adapt', 'The Coda replays your earlier guesses against the record; with no guesses or Rebuild tiles it has nothing to show.', sw('questioning', 'q-ghost-guess')),
      R('story-model', 'text', 'adapt', 'Overture captions and act beats are kept in story.yaml (overture.shots) and built by build-content.mjs.', sw('text', 'text-linted-beats'))],
    conflicts: [C('hub-first', 'conflict', 'Both claim the first screen: the overture tells the whole story before Act I, the hub asks the learner to choose first.', sw('navigation', 'nav-rooms-cast'))],
    files: 12, js: 60, days: [0, 0.5], a11y: [1, 'Scroll-scrubbed 3D: needs the skip link and still fallback'], mobile: [1, 'WebGL overture on phones (tiered)'],
    borrow: ['Overture “contents” shot as table of contents', 'Coda ledger: your guesses vs the record', 'Skip-the-overture link'],
    regions: [{ slot: 'hero', label: 'Overture · 9 shots before Act I', excl: true, motion: true }, { slot: 'body', label: 'Acts → scenes → Rebuild → Coda' }] },
  'spine-atlas-hub': { idea: 'sound', pugh: '-SS-', provides: ['hub-content', 'place-led'],
    requires: [R('place-model', 'mapping', 'conflict', 'Chapters → units → stories → nodes are placed marks; without a placed map there is nothing to tier.', sw('mapping', 'map-globe-hub')),
      R('hub-nav', 'navigation', 'adapt', 'The hub needs view and tier navigation (Globe/Map/List, breadcrumbs).', sw('navigation', 'nav-atlas-tiers'))],
    conflicts: [], files: 2, js: 40, days: [3, 6], a11y: [1, 'Globe-first entry; List view must stay primary'], mobile: [1, 'Globe on phones'],
    borrow: ['List view as the complete, accessible index', 'Marks take ink only when engaged'],
    regions: [{ slot: 'body', label: 'Chapters → units → stories list' }] },

  // ---- layout
  'layout-doc': { idea: 'weak', pugh: '--S+', provides: ['doc-flow', 'static-page'], requires: [], conflicts: [],
    files: 0, js: 0, days: [1, 2], a11y: [0, ''], mobile: [0, ''], borrow: ['Complete, linkable reference appendix'], regions: [] },
  'layout-screens': { idea: 'sound', pugh: '--S-', provides: ['screens', 'routing', 'hub-page'], requires: [], conflicts: [],
    files: 3, js: 30, days: [3, 6], a11y: [0, ''], mobile: [0, ''], borrow: ['Lecture player: dark stage + station list', 'One focused screen per tool'], regions: [] },
  'layout-split-stage': { idea: 'weak', pugh: '---S', provides: ['scroll-driver', 'sticky-stage', 'two-live-instruments'],
    requires: [R(['scoped-timers', 'no-timers'], 'motion', 'adapt', 'The stage changes per beat; timers that are not owned by a scope leak into later beats (v2’s 900 ms bug).', sw('motion', 'motion-scoped-transitions'))],
    conflicts: [C('full-bleed', 'adapt', 'The stage is a 1fr pane beside a 660 px column, so prints cannot go full-bleed; deep zoom has to open as an overlay.', fix('Open objects in a full-screen viewer overlay', [1, 2]))],
    files: 0, js: 20, days: [2, 3], a11y: [1, 'Two live instruments: focus order and announcements double'], mobile: [1, 'Stage stacks above text; half the viewport is chrome'],
    borrow: ['Instruments always visible while reading'], regions: [] },
  'layout-pinned-stage-cards': { idea: 'strong', pugh: 'S-S+', provides: ['scroll-driver', 'pinned-stage', 'one-instrument', 'beat-cards', 'full-bleed-ok'],
    requires: [R(['scoped-timers', 'no-timers'], 'motion', 'adapt', 'One stage swaps instruments per step; any timer not owned by a Scope leaks into the next beat (v2’s 900 ms bug).', sw('motion', 'motion-scoped-transitions'))],
    conflicts: [], files: 0, js: 25, days: [0.5, 1], a11y: [0, ''], mobile: [1, 'Tools move into the beat card on phones'],
    borrow: ['One instrument per beat', 'Mini timeline strip under every stage'], regions: [] },
  'layout-scene-sheets-rooms': { idea: 'strong', pugh: 'SSSS', provides: ['scroll-driver', 'pinned-stage', 'one-instrument', 'beat-cards', 'room-shell', 'hash-routes', 'full-bleed-ok'],
    requires: [R(['scoped-timers', 'no-timers'], 'motion', 'adapt', 'One stage swaps instruments per step; any timer not owned by a Scope leaks into the next beat.', sw('motion', 'motion-scoped-transitions'))],
    conflicts: [], files: 4, js: 40, days: [0, 0.5], a11y: [0, ''], mobile: [0, ''],
    borrow: ['Washi scene sheets on an ink thread', 'Rooms with focus trap, Esc and #room-… hashes'], regions: [{ slot: 'overlay', label: 'Full-screen room' }] },
  'layout-panel-stage': { idea: 'sound', pugh: '-S--', provides: ['side-panel', 'pinned-stage', 'hub-page'],
    requires: [], conflicts: [C('linear-thread', 'adapt', 'A side panel and a globe have no reading column; a linear story would live in a 360 px panel.', sw('layout', 'layout-scene-sheets-rooms'))],
    files: 1, js: 30, days: [3, 5], a11y: [0, ''], mobile: [1, 'Panel becomes a bottom sheet'], borrow: ['Breadcrumb panel beside the stage'], regions: [] },

  // ---- navigation
  'nav-headings': { idea: 'weak', pugh: '-S+S', provides: ['toc'], requires: [],
    conflicts: [C('pinned-stage', 'adapt', 'A pinned stage covers the page; document headings give no act, no year and no way back.', sw('navigation', 'nav-act-bar')),
      C('sticky-stage', 'adapt', 'A sticky stage hides the outline; headings give no act or year.', sw('navigation', 'nav-act-bar'))],
    files: 0, js: 0, days: [0, 0.5], a11y: [0, ''], mobile: [0, ''], borrow: ['Numbered sections for the reference appendix'],
    regions: [{ slot: 'side', label: 'Section headings', phone: { slot: 'top', label: '§ Outline', w: 60 } }] },
  'nav-hub-filter': { idea: 'sound', pugh: '--SS', provides: ['hub-nav', 'hub-first', 'lens-bar'],
    requires: [R('system-model', 'spine', 'adapt', 'Every lecture and tool must be tagged to a system box for the filter to light anything (v1 tagged 18 pieces).', fix('Tag each act’s beats and tools to the five boxes', [0.5, 1]))],
    conflicts: [], files: 1, js: 10, days: [1, 2], a11y: [0, ''], mobile: [1, 'Four lens pills and a hub crowd a 390 px bar'],
    borrow: ['Tap a box: related pieces light up', 'Lens pills Time · Place · Movements · Objects'],
    regions: [{ slot: 'hero', label: 'Hub: tap a box to filter', key: 'system-diagram', excl: true }, { slot: 'top', label: 'Lens pills ×4', w: 120 }] },
  'nav-station-list': { idea: 'sound', pugh: 'SS+S', provides: ['station-list', 'prev-next'], requires: [],
    conflicts: [C('scroll-driver', 'adapt', 'Previous/Next stations fight a continuous scroll; the list has to become a scroll-to-beat index.', sw('navigation', 'nav-act-bar'))],
    files: 0, js: 6, days: [0.5, 1], a11y: [0, ''], mobile: [0, ''], borrow: ['Numbered stations with a progress bar'],
    regions: [{ slot: 'side', label: 'Stations 1–8', phone: { slot: 'bottom', label: '‹ Prev · 3/8 · Next ›', excl: true } }] },
  'nav-chapter-dots-explore': { idea: 'sound', pugh: '--+-', provides: ['chapter-index', 'explore-mode'],
    requires: [R('pannable', 'mapping', 'adapt', 'Explore hands the map and timeline to the reader; v2’s explore “had nothing to click”. It needs a map that pans and has marks.', sw('mapping', 'map-three-scale'))],
    conflicts: [], files: 0, js: 5, days: [0.5, 1], a11y: [1, 'Chapter titles only on hover'], mobile: [0, ''],
    borrow: ['“Explore” hands the instruments to the reader'], regions: [{ slot: 'top', label: 'Dots 0–6 · Explore', w: 110 }] },
  'nav-act-bar': { idea: 'strong', pugh: '-++S', provides: ['act-bar', 'year-readout', 'explore-mode'],
    requires: [R('dated-steps', 'spine', 'adapt', 'The live year and era readout needs every step to carry a year; hub pieces have none.', sw('spine', 'spine-publishers-bets')),
      R('pannable', 'mapping', 'adapt', 'Explore hands the map to the reader; this map does not pan or carry marks.', sw('mapping', 'map-three-scale'))],
    conflicts: [], files: 0, js: 8, days: [0, 0.25], a11y: [0, ''], mobile: [0, ''], borrow: ['Live year with Japanese era (1790 寛政)', 'Act numerals P I–V'],
    regions: [{ slot: 'top', label: 'P I–V · 1790 寛政 · Explore', w: 150 }] },
  'nav-rooms-cast': { idea: 'sound', pugh: 'SSSS', provides: ['act-bar', 'year-readout', 'explore-mode', 'rooms-menu', 'cast-deck', 'hash-routes'],
    requires: [R('room-shell', 'layout', 'adapt', 'The Rooms menu opens full-screen rooms (src/rooms.js: focus trap, Esc, back button, #room-… hashes); this layout has no room shell.', { text: 'Port src/rooms.js into this layout', swap: { layout: 'layout-scene-sheets-rooms' }, days: [1, 2] }),
      R('cast-api', 'people', 'adapt', 'The Cast deck counts people met through the Cast API (decorate, meet, open, mountDeck); this people option has none.', sw('people', 'people-character-cards')),
      R('dated-steps', 'spine', 'adapt', 'The act bar’s year readout needs dated steps.', sw('spine', 'spine-publishers-bets')),
      R('pannable', 'mapping', 'adapt', 'Explore hands the map to the reader; this map does not pan or carry marks.', sw('mapping', 'map-three-scale'))],
    conflicts: [], files: 1, js: 12, days: [0, 0.5], a11y: [0, ''], mobile: [1, 'More chrome: Rooms, Cast, Explore on one bar'],
    borrow: ['“Go deeper” links from beats into rooms', 'Deep links #room-desks.censor', 'Cast deck with unmet silhouettes'],
    regions: [{ slot: 'top', label: 'Acts · year · Rooms ▾ · Explore', w: 170 }, { slot: 'corner', label: 'Cast (met 12)', excl: true }] },
  'nav-atlas-tiers': { idea: 'strong', pugh: '+--+', provides: ['hub-nav', 'hub-first', 'url-tokens', 'hash-routes', 'graph-view'],
    requires: [R('place-model', 'mapping', 'conflict', 'Globe/Map/List tiers group place-anchored rows; without a placed map the tiers are empty.', sw('mapping', 'map-three-scale'))],
    conflicts: [C('linear-thread', 'adapt', 'The tiers navigate all of F1; inside one unit they only work as a “where is Edo in F1” breadcrumb beside the story.', fix('Reduce to a breadcrumb into the Atlas', [0.5, 1]))],
    files: 1, js: 30, days: [3, 6], a11y: [0, ''], mobile: [1, 'View switch + tiers on a phone bar'],
    borrow: ['Plain #token deep links (#u-F1.8, #n-PER205)', 'List view as accessible twin of the map'],
    regions: [{ slot: 'top', label: 'Globe · Map · List', w: 110 }, { slot: 'side', label: 'World › region › unit', phone: { slot: 'top', label: 'Breadcrumb', w: 70 } }] },

  // ---- questioning
  'q-spec-predict-check': { idea: 'strong', pugh: '+S-S', provides: ['predictions-spec'],
    requires: [R('guess-apis', 'mapping', 'unjudged', '“Prediction: one tap on the map” is specified but never built; whether this map can take a tap answer has not been judged.', sw('mapping', 'map-three-scale'))],
    conflicts: [], files: 0, js: 10, days: [3, 6], a11y: [0, ''], mobile: [0, ''], borrow: ['One prediction and one argued station per lecture'],
    regions: [{ slot: 'inline', label: 'Prediction + argued station' }] },
  'q-one-tap-check': { idea: 'weak', pugh: 'S---', provides: ['mc-checks'], requires: [],
    conflicts: [C('seal-reserved', 'adapt', 'v1/v2 check cards use seal red; this visual language reserves seal red for the censor and 1842.', fix('Recolour check cards to ink', [0.25, 0.5]))],
    files: 0, js: 6, days: [0.5, 1], a11y: [1, 'Right/wrong by colour and strikethrough, no live region'], mobile: [0, ''], borrow: ['One tap, then the instrument answers'],
    regions: [{ slot: 'inline', label: 'Check card · one tap' }] },
  'q-predict-first': { idea: 'sound', pugh: '+S-S', provides: ['pre-questions', 'segment-gates'],
    requires: [R('segment-model', 'spine', 'adapt', 'A prediction opens each segment, so the spine needs segments.', sw('spine', 'spine-publishers-bets'))],
    conflicts: [C('act-opener', 'adapt', 'v3 opened every segment with “Before you read: predict”; next to act openers it was judged weird and invasive.', sw('questioning', 'q-ghost-guess'))],
    files: 0, js: 8, days: [0.5, 1], a11y: [0, ''], mobile: [0, ''], borrow: ['Target the one fact you most want remembered'],
    regions: [{ slot: 'inline', label: '“Before you read: predict” gate' }] },
  'q-ghost-guess': { idea: 'strong', pugh: 'SSSS', provides: ['instrument-guess', 'guess-ledger', 'return-store', 'no-score'],
    requires: [R('guess-apis', 'mapping', 'adapt', 'Guesses are answered on the instrument: MapStage.guess needs tap targets on a georeferenced map with a keyboard list.', sw('mapping', 'map-three-scale')),
      R('drag-guess', 'timeline', 'adapt', 'Timeline guesses drag a marker on the axis (Timeline.guess, arrow keys 1 year, PageUp/Down 10).', sw('timeline', 'tl-lane-chart')),
      R(['pinned-stage', 'sticky-stage', 'screens'], 'layout', 'adapt', 'An on-instrument answer needs an instrument on screen; in a document only inline slider and choice guesses remain.', sw('layout', 'layout-scene-sheets-rooms'))],
    conflicts: [], files: 1, js: 18, days: [0, 0.5], a11y: [0, ''], mobile: [0, ''], borrow: ['Ghost (your answer, hollow) vs record (solid ink)', 'Scrolling past reveals, nothing marked wrong'],
    regions: [{ slot: 'stage', label: 'Ghost vs record on the instrument' }, { slot: 'inline', label: 'Optional late guess' }] },
  'q-rebuild': { idea: 'strong', pugh: '+SS-', provides: ['placement-tiles', 'guess-ledger', 'return-store'],
    requires: [R(['placeable-axis', 'placeable-map'], 'timeline', 'adapt', 'Rebuild places 4–6 tiles back on a timeline or map; this timeline has no axis to place on.', sw('timeline', 'tl-lane-chart')),
      R(['acts', 'chapters'], 'spine', 'adapt', 'Rebuild runs at each act end; a hub has no act ends, so it becomes one closing exercise.', sw('spine', 'spine-publishers-bets'))],
    conflicts: [], files: 0, js: 15, days: [0.5, 1], a11y: [1, 'Tile placement: button alternatives exist, verify'], mobile: [0, ''], borrow: ['One tile from an earlier act (spaced)', 'Coda order-rebuild'],
    regions: [{ slot: 'inline', label: 'Rebuild: place 6 tiles' }] },
  'q-framing-question': { idea: 'sound', pugh: '-SS+', provides: ['framing-q'], requires: [], conflicts: [],
    files: 0, js: 1, days: [0.25, 0.5], a11y: [0, ''], mobile: [0, ''], borrow: ['One framing question per view'], regions: [{ slot: 'inline', label: 'Framing question' }] },

  // ---- tools
  'tools-spec': { idea: 'strong', pugh: '-+-S', provides: ['tool-specs'],
    requires: [R('tool-host-decided', 'layout', 'unjudged', 'The spec says what each of I1–I10 does, not where it lives; its fit with this layout has not been judged.', null)],
    conflicts: [], files: 30, js: 300, days: [20, 35], a11y: [1, 'Ten new tools to make keyboard-complete'], mobile: [1, 'Ten new phone layouts'],
    borrow: ['Lens · data · action · meaning · check for every tool', 'I5 What a sheet cost (soba bowl)'],
    regions: [{ slot: 'inline', label: 'I1–I10 (to build)' }] },
  'tools-pages': { idea: 'sound', pugh: '--+S', provides: ['tool-pages'],
    requires: [R(['routing', 'room-shell'], 'layout', 'adapt', 'Standalone tool pages need routing between screens; in a single scroll they become rooms or inline embeds.', sw('layout', 'layout-scene-sheets-rooms'))],
    conflicts: [], files: 3, js: 40, days: [3, 5], a11y: [0, ''], mobile: [0, ''], borrow: ['Margin hotspots then date the sheet', 'Price bars against a bowl of soba'],
    regions: [{ slot: 'overlay', label: 'Tool page (separate)' }] },
  'tools-embedded-widgets': { idea: 'sound', pugh: '--+-', provides: ['inline-tools', 'compare-viewer', 'sandbox'],
    requires: [R('scoped-timers', 'motion', 'adapt', 'Widgets autoplay on timers; without a Scope utility they keep running after their beat.', fix('Port Scope (src/util.js) and stop autoplay', [0.5, 1]))],
    conflicts: [C('unscoped-timers', 'conflict', 'v2’s widgets autoplay on unscoped timers; a 900 ms timer let tools overwrite later map scenes (REPORT_EDO_REDESIGN.md).', sw('motion', 'motion-scoped-transitions')),
      C('beat-cards', 'adapt', 'Inline widgets inside 40–100-word cards over a stage are cramped; v3 moved tools into the stage for this reason.', sw('tools', 'tools-stage-tools'))],
    files: 2, js: 60, days: [3, 5], a11y: [1, 'Four autoplay widgets'], mobile: [1, 'Widgets squeezed into the text column'],
    borrow: ['Tool placed where the story needs it', 'Blue-route scrubber'], regions: [{ slot: 'inline', label: 'Widget in the text', motion: true }] },
  'tools-stage-tools': { idea: 'sound', pugh: '-S+S', provides: ['stage-tools', 'deep-zoom', 'compare-viewer', 'sandbox'],
    requires: [R('pinned-stage', 'layout', 'conflict', 'Stage tools render inside the pinned stage (v3 src/tools.js); this layout has no stage.', sw('layout', 'layout-pinned-stage-cards'),
      { tags: ['sticky-stage'], level: 'adapt', reason: 'The half-width sticky pane renders tools at about 55% width beside the column.' })],
    conflicts: [C('unscoped-timers', 'adapt', 'Stage flights on bare timers can retarget the stage while a tool is open.', sw('motion', 'motion-scoped-transitions'))],
    files: 70, js: 180, days: [1, 2], a11y: [1, 'Deep zoom needs keyboard pan and zoom'], mobile: [1, 'Tools move into the beat card'],
    borrow: ['Three Great Waves with diagnostics', 'Peel the colour layers'], regions: [{ slot: 'stage', label: 'Stage tool + deep zoom' }] },
  'tools-labs-rooms': { idea: 'strong', pugh: 'SSSS', provides: ['labs', 'stage-tools', 'room-tools', 'deep-zoom', 'compare-viewer', 'sandbox', 'desks', 'workshop', 'views'],
    requires: [R('room-shell', 'layout', 'adapt', 'Labs have a full room mode; without a room shell only the compact stage mode exists.', { text: 'Port src/rooms.js', swap: { layout: 'layout-scene-sheets-rooms' }, days: [1, 2] }),
      R('pinned-stage', 'layout', 'adapt', 'Stage mode mounts labs in the pinned stage; without one, labs open only as rooms.', sw('layout', 'layout-scene-sheets-rooms')),
      R('webgl', 'motion', 'adapt', 'Print the Wave and Step into the View are three.js (src/3d); at this motion level their 2D fallbacks become the primary versions.', sw('motion', 'motion-choreographed-3d'))],
    conflicts: [C('unscoped-timers', 'adapt', 'Labs register timers in ctx.scope; stage flights on bare timers can retarget the stage under an open lab.', sw('motion', 'motion-scoped-transitions'))],
    files: 52, js: 520, days: [0, 1], a11y: [1, 'Drag-heavy labs: keyboard paths exist, keep testing'], mobile: [2, 'Two three.js labs on phones'],
    borrow: ['Workbench frame + “What this shows” + sources + reset', 'One mount(root, ctx) interface', 'Seal Timeline confirms in threes'],
    regions: [{ slot: 'stage', label: 'Lab (stage mode)' }, { slot: 'overlay', label: 'Lab (room mode)' }] },
  'tools-notebook': { idea: 'strong', pugh: 'S-S+', provides: ['notebook', 'ink-tokens', 'return-store'],
    requires: [R(['hash-routes', 'url-tokens'], 'navigation', 'adapt', 'The ink hand-off travels as a plain #token (build/units/shared/LINKS.md); it needs a hash-token router.', sw('navigation', 'nav-rooms-cast'))],
    conflicts: [], files: 1, js: 25, days: [2, 3], a11y: [0, ''], mobile: [0, ''], borrow: ['Knowledge as the save file', '#ink.edo hand-off to the Atlas'],
    regions: [{ slot: 'corner', label: 'Notebook', excl: true }] },

  // ---- motion
  'motion-none': { idea: 'weak', pugh: '-+++', provides: ['no-timers', 'static-motion'], requires: [], conflicts: [],
    files: 0, js: 0, days: [0, 0.5], a11y: [0, ''], mobile: [0, ''], borrow: ['State swaps for the reference appendix'], regions: [], icon: '' },
  'motion-flights-autoplay': { idea: 'weak', pugh: '--S+', provides: ['unscoped-timers', 'autoplay', 'flights'], requires: [], conflicts: [],
    files: 0, js: 290, days: [1, 2], a11y: [2, 'Autoplay with no pause; no reduced motion'], mobile: [1, 'd3 flights per beat'], borrow: ['The map answers the reading'], regions: [], icon: '⟳' },
  'motion-scoped-transitions': { idea: 'sound', pugh: '-S++', provides: ['scoped-timers', 'reduce-toggle', 'flights'], requires: [], conflicts: [],
    files: 0, js: 40, days: [0.5, 1], a11y: [0, ''], mobile: [0, ''], borrow: ['Every timer owned by a Scope', 'Scripted map anims (fire, relocations)'], regions: [], icon: '→' },
  'motion-choreographed-3d': { idea: 'strong', pugh: 'SSSS', provides: ['scoped-timers', 'reduce-toggle', 'flights', 'webgl', 'motion-tokens'], requires: [],
    conflicts: [C('static-page', 'adapt', 'A document has nothing to choreograph; the three.js cost buys nothing here.', sw('motion', 'motion-none')),
      C('doc-type', 'adapt', 'The 3D materials (washi planes, ink bleed) read paper and ink tokens; plain document type defines none.', sw('visual', 'visual-washi-sumi-indigo'))],
    files: 6, js: 560, days: [0, 0.5], a11y: [1, 'Reduced-motion cuts exist; keep testing'], mobile: [2, 'three.js tiering on phones'],
    borrow: ['Motion tokens --d-* / --e-*', 'One primary motion per beat', 'Ink-bleed reveal'], regions: [], icon: '◇' },

  // ---- visual
  'visual-plain-doc': { idea: 'weak', pugh: '--S+', provides: ['doc-type'], requires: [],
    conflicts: [C('pinned-stage', 'adapt', 'Document type defines no stage surfaces (instrument ground, ink on canvas, focus on the stage).', sw('visual', 'visual-washi-sumi-indigo')),
      C('sticky-stage', 'adapt', 'Document type defines no stage surfaces.', sw('visual', 'visual-washi-sumi-indigo'))],
    files: 0, js: 0, days: [0.5, 1], a11y: [0, ''], mobile: [0, ''], borrow: [], swatches: ['#ffffff', '#222222', '#3366cc'], type: 'System sans' },
  'visual-paper-blue-dark-stage': { idea: 'sound', pugh: '---S', provides: ['seal-for-checks'], requires: [], conflicts: [],
    files: 2, js: 0, days: [1, 2], a11y: [0, ''], mobile: [0, ''], borrow: ['Dark stage so prints carry the light'], swatches: ['#F4F2EC', '#15161A', '#1C3E8C', '#0F1522'], type: 'Shippori Mincho / Plex Sans JP' },
  'visual-editorial-navy': { idea: 'weak', pugh: '---S', provides: ['seal-everywhere'], requires: [], conflicts: [],
    files: 2, js: 0, days: [1, 2], a11y: [0, ''], mobile: [0, ''], borrow: ['Competent serif display'], swatches: ['#F4F2EC', '#16203a', '#1C3E8C', '#B3301D'], type: 'Serif display / cream column' },
  'visual-washi-sumi-indigo': { idea: 'strong', pugh: 'SSSS', provides: ['seal-reserved', 'tokens', 'full-bleed'], requires: [],
    conflicts: [C('two-live-instruments', 'adapt', 'Full-bleed prints are part of this language; a half-width pane cannot show them.', fix('Open prints in a full-screen viewer', [1, 2]))],
    files: 4, js: 0, days: [0, 0.25], a11y: [0, ''], mobile: [0, ''], borrow: ['Seal red only as a stamp (censor, 1842)', 'Hanko chips, kraft Rebuild sheets'], swatches: ['#EFE8DA', '#1B1A17', '#2B3F6B', '#A33A2A'], type: 'Shippori Mincho / Source Serif 4 / Plex Sans' },

  // ---- text
  'text-reference': { idea: 'sound', pugh: '+---', provides: ['dense-prose', 'long-sentences', 'source-texts'], requires: [],
    conflicts: [C('beat-cards', 'adapt', 'Dense reference prose does not fit 40–100-word cards over a stage; v0 is the source to rewrite from, not the copy.', sw('text', 'text-linted-beats'))],
    files: 1, js: 0, days: [3, 6], a11y: [0, ''], mobile: [1, '114 table rows on a phone'], borrow: ['Confidence words on every claim', 'Content-note protocol'], lines: 9 },
  'text-station-narration': { idea: 'sound', pugh: '-S+-', provides: ['thin-text', 'claim-ids'], requires: [], conflicts: [],
    files: 1, js: 0, days: [2, 4], a11y: [0, ''], mobile: [0, ''], borrow: ['Claim id on every factual sentence'], lines: 2 },
  'text-essay': { idea: 'weak', pugh: '+--S', provides: ['dense-prose', 'long-sentences', 'source-texts'], requires: [],
    conflicts: [C('beat-cards', 'adapt', '5,627 words over 33 beats is about 170 words a beat; cards over a stage would cover the instrument.', sw('text', 'text-linted-beats'))],
    files: 1, js: 0, days: [2, 4], a11y: [0, ''], mobile: [1, 'Long paragraphs beside a stacked stage'], borrow: ['Dense beats that stay with one object'], lines: 8 },
  'text-linted-beats': { idea: 'strong', pugh: 'SSSS', provides: ['content-pipeline', 'story-model', 'beat-cap-100', 'source-texts'], requires: [],
    conflicts: [C('doc-flow', 'adapt', 'A document of 40–100-word blocks reads as fragments (v3’s “small blocks with a question”).', sw('text', 'text-reference'))],
    files: 1, js: 0, days: [0, 0.25], a11y: [0, ''], mobile: [0, ''], borrow: ['Build fails on a sentence over 25 words', 'Quotes in Japanese with translation'], lines: 4 },
  'text-card-copy': { idea: 'sound', pugh: '-S+-', provides: ['thin-text', 'card-copy'], requires: [],
    conflicts: [C('linear-thread', 'adapt', 'Card copy cannot carry a 60-minute story.', sw('text', 'text-linted-beats'))],
    files: 1, js: 0, days: [2, 3], a11y: [0, ''], mobile: [0, ''], borrow: ['“Why this mark” edges with sources'], lines: 2 },

  // ---- people
  'people-tables': { idea: 'sound', pugh: '+--+', provides: ['cast-data'], requires: [],
    conflicts: [C('beat-cards', 'adapt', 'Role tables of 58 people cannot sit in beat cards; they move to an appendix or a Cast room.', fix('Move the tables into an appendix', [0.5, 1]))],
    files: 0, js: 0, days: [0.5, 1], a11y: [0, ''], mobile: [1, 'Wide tables on phones'], borrow: ['Publisher first, because the 1790 law named him', 'Carvers and printers named'],
    regions: [{ slot: 'inline', label: 'Cast tables by role' }] },
  'people-role-tabs': { idea: 'sound', pugh: 'S--+', provides: ['cast-data'], requires: [], conflicts: [],
    files: 0, js: 8, days: [1, 1.5], a11y: [0, ''], mobile: [0, ''], borrow: ['Five role tabs (carvers and the state in the cast)'], regions: [{ slot: 'inline', label: 'Role tabs' }] },
  'people-inline-card': { idea: 'sound', pugh: '-S-+', provides: ['cast-data', 'inline-cast'], requires: [], conflicts: [],
    files: 1, js: 6, days: [0.5, 1], a11y: [0, ''], mobile: [0, ''], borrow: ['Meet people in context, at first mention'], regions: [{ slot: 'inline', label: 'Cast card at first mention' }] },
  'people-entity-sheet': { idea: 'sound', pugh: 'SS-+', provides: ['cast-data', 'inline-cast', 'sheet-dialog'], requires: [], conflicts: [],
    files: 1, js: 10, days: [0.5, 1], a11y: [0, ''], mobile: [0, ''], borrow: ['One sheet for person, place, event or image', '“Appears in” links'], regions: [{ slot: 'inline', label: 'Name chip' }, { slot: 'overlay', label: 'Entity sheet' }] },
  'people-character-cards': { idea: 'strong', pugh: 'SSSS', provides: ['cast-data', 'cast-api', 'inline-cast', 'sheet-dialog'],
    requires: [R('map-api', 'mapping', 'adapt', '“Show on map” calls MapStage.show; this map has no API, so the button goes.', sw('mapping', 'map-three-scale')),
      R('timeline-api', 'timeline', 'adapt', '“Show on timeline” calls Timeline.show; this timeline has no API.', sw('timeline', 'tl-lane-chart'))],
    conflicts: [], files: 2, js: 30, days: [0, 0.5], a11y: [0, ''], mobile: [0, ''], borrow: ['Story · Works · Connections · Life tabs', 'Show on map / timeline'],
    regions: [{ slot: 'inline', label: 'Character chip → card' }, { slot: 'overlay', label: 'Character sheet' }] },
  'people-node-card': { idea: 'sound', pugh: 'S--+', provides: ['cast-data', 'canon-node', 'graph-view'], requires: [],
    conflicts: [C('linear-thread', 'adapt', 'A node card is a provenance record; inside a story it is thin as a character.', fix('Add a story line and works to the node card', [0.5, 1]))],
    files: 0, js: 8, days: [1, 2], a11y: [0, ''], mobile: [0, ''], borrow: ['Confidence + “why this mark” on a person'], regions: [{ slot: 'inline', label: 'Node card' }] },

  // ---- mapping
  'map-specified': { idea: 'sound', pugh: '--+S', provides: ['no-map'], requires: [],
    conflicts: [C('map-beats', 'conflict', 'This spine puts 19–24 beats on the map (the blue route, relocations, export arcs); with no map those beats lose their instrument.', sw('mapping', 'map-three-scale'))],
    files: 0, js: 0, days: [0, 0], a11y: [0, ''], mobile: [0, ''], borrow: ['I4 1677 ↔ 1859 transparency (spec)'], regions: [] },
  'map-schematic': { idea: 'weak', pugh: '--+S', provides: ['schematic-map'], requires: [],
    conflicts: [C('map-beats', 'adapt', 'Pills in boxes cannot draw the blue route, the 1657 relocations or the export arcs; about 8 beats need rewriting.', sw('mapping', 'map-three-scale'))],
    files: 0, js: 10, days: [1, 2], a11y: [0, ''], mobile: [0, ''], borrow: ['Arc counts between places'], regions: [{ slot: 'stage', label: 'Place diagram' }] },
  'map-dots-raster': { idea: 'weak', pugh: '--S-', provides: ['pannable', 'world-map', 'raster-city'], requires: [],
    conflicts: [C('city-beats', 'adapt', 'Pins were set by eye on the 1859 sheet; city beats need the fitted georeference (content/georef59.json).', fix('Fit the 1859 sheet with georef59.json', [1, 2]))],
    files: 2, js: 330, days: [1, 2], a11y: [1, 'Map decorative in 22 of 33 beats'], mobile: [1, 'world-atlas 50m on phones'], borrow: ['The blue-route arc beat'], regions: [{ slot: 'stage', label: 'd3 world + 1859 raster', motion: true }] },
  'map-three-scale': { idea: 'strong', pugh: 'SSSS', provides: ['pannable', 'place-model', 'guess-apis', 'placeable-map', 'map-api', 'georef-city', 'world-map'], requires: [], conflicts: [],
    files: 9, js: 120, days: [0, 0.5], a11y: [1, 'Map tap targets: keyboard list exists, verify'], mobile: [1, 'City sheet at 390 px'],
    borrow: ['Scale break as its own beat', 'Dated relocation arcs', 'Greedy label placement'], regions: [{ slot: 'stage', label: 'Map: world · Japan · Edo 1859', motion: true }] },
  'map-globe-hub': { idea: 'strong', pugh: '-+--', provides: ['pannable', 'place-model', 'webgl-map', 'world-map'],
    requires: [R('webgl', 'motion', 'adapt', 'Globe flights need WebGL and motion; at this motion level the globe falls back to the Equal Earth SVG.', sw('motion', 'motion-choreographed-3d'))],
    conflicts: [C('city-beats', 'adapt', 'The globe has no city scale; the 1859 Edo beats need the Atlas veil-to-sheet transition and city layer (#s-edo) ported in.', fix('Port the #s-edo city layer and veil', [2, 4]))],
    files: 6, js: 520, days: [4, 8], a11y: [1, 'Globe needs its List twin'], mobile: [2, 'A second WebGL context on phones'],
    borrow: ['Pencil contours that turn to ink', 'Kinun veil parting onto the 1859 sheet'], regions: [{ slot: 'stage', label: 'Globe + Equal Earth fallback', motion: true }] },

  // ---- timeline
  'tl-table': { idea: 'weak', pugh: 'S-++', provides: ['no-axis'], requires: [],
    conflicts: [C('timeline-beats', 'adapt', 'A table cannot be a stage instrument; the 1842 edict and price-cap beats lose their chart.', sw('timeline', 'tl-lane-chart'))],
    files: 0, js: 0, days: [0.5, 1], a11y: [0, ''], mobile: [1, '78-row event table'], borrow: ['Eras “turned by something a learner can date”'], regions: [{ slot: 'inline', label: 'Era table' }] },
  'tl-era-chips': { idea: 'sound', pugh: '--++', provides: ['axis', 'placeable-axis'], requires: [], conflicts: [],
    files: 0, js: 10, days: [1, 2], a11y: [0, ''], mobile: [0, ''], borrow: ['Era widths proportional to years'], regions: [{ slot: 'strip', label: 'Era bands + chips' }] },
  'tl-scrubber': { idea: 'strong', pugh: '--S+', provides: ['scrub-only'], requires: [],
    conflicts: [C('timeline-beats', 'adapt', 'Year scrubbers live inside single tools; there is no main timeline for dated beats.', sw('timeline', 'tl-lane-chart'))],
    files: 0, js: 6, days: [1, 2], a11y: [0, ''], mobile: [0, ''], borrow: ['Drag a year and watch genres fade (1835–1850)'], regions: [{ slot: 'inline', label: 'Year scrubber in a tool' }] },
  'tl-ruler': { idea: 'weak', pugh: '---+', provides: ['axis', 'placeable-axis'], requires: [], conflicts: [],
    files: 0, js: 12, days: [0.5, 1], a11y: [1, '3 px knobs as targets'], mobile: [1, 'Overlapping labels'], borrow: ['Folded afterlife after 1870'], regions: [{ slot: 'strip', label: 'Ruler 1600–2024' }] },
  'tl-lane-chart': { idea: 'strong', pugh: 'SSSS', provides: ['axis', 'placeable-axis', 'drag-guess', 'timeline-api', 'lanes'], requires: [], conflicts: [],
    files: 1, js: 40, days: [0, 0.5], a11y: [0, ''], mobile: [1, 'Dense lanes on phones'], borrow: ['“Now” cursor inks the past', 'Price lane steps down at 1842', 'Print-run bubbles'],
    regions: [{ slot: 'stage', label: 'Lane chart (stage)' }, { slot: 'strip', label: 'Mini strip' }] },
  'tl-deep-time': { idea: 'sound', pugh: '-S++', provides: ['axis', 'deep-axis'], requires: [],
    conflicts: [C('timeline-beats', 'adapt', '12,000 BCE–2026 makes 1765–1842 a sliver; the unit needs an Edo window (1600–1900).', fix('Add a zoomed Edo window', [1, 2]))],
    files: 0, js: 15, days: [1, 2], a11y: [0, ''], mobile: [0, ''], borrow: ['Routes draw to the chosen year'], regions: [{ slot: 'strip', label: 'Deep-time scrubber' }] },
};

// Pair-specific judgements that override tag rules (both orders are matched).
const PAIRS = [
  { a: 'tools-pages', b: 'layout-screens', status: 'ok', type: 'empirical', reason: 'Built together in v1: every tool is its own screen.' },
  { a: 'nav-station-list', b: 'layout-screens', status: 'ok', type: 'empirical', reason: 'The lecture player in v1 is exactly this.' },
  { a: 'tl-lane-chart', b: 'layout-split-stage', status: 'adapt', type: 'logical', reason: 'The lane chart needs the full stage width; v2’s pane gives it about 55%, and the map sits above it.', repair: sw('layout', 'layout-scene-sheets-rooms') },
  { a: 'motion-choreographed-3d', b: 'map-globe-hub', status: 'adapt', type: 'logical', reason: 'Two three.js stages (overture or labs, and the globe) must share one renderer or dispose on swap; iOS Safari caps live WebGL contexts.', repair: fix('Share one renderer (makeStage) across globe and overture', [1, 2]) },
  { a: 'motion-choreographed-3d', b: 'layout-split-stage', status: 'adapt', type: 'logical', reason: 'Parallax planes in a half-width pane: full-screen overture shots need the stage to take the whole viewport.', repair: sw('layout', 'layout-scene-sheets-rooms') },
  { a: 'map-globe-hub', b: 'layout-split-stage', status: 'adapt', type: 'logical', reason: 'A globe and a timeline live at once in one pane; v2’s “two products side by side” with a WebGL cost.', repair: sw('layout', 'layout-panel-stage') },
  { a: 'spine-system-index', b: 'layout-screens', status: 'ok', type: 'empirical', reason: 'Built together in v1: the hub page is the diagram.' },
];

// House rules (normative, unary): checked for each chosen option.
const HOUSE_RULES = {
  wcag: 'WCAG 2.2 AA and reduced motion', noscore: 'No scores: feedback is informational, on the instrument', seal: 'Seal red only for the censor and 1842',
  words: 'Sentences ≤ 25 words; learner-facing voice', place: 'No invented placement', zero: 'Zero cost: no paid services', sens: 'Sensitivity: read, not played',
};
const HOUSE = {
  'motion-flights-autoplay': { status: 'conflict', rule: 'wcag', reason: 'Tools autoplay for 4–5 s with no pause, and v2 has zero prefers-reduced-motion handling (WCAG 2.2.2).', repair: sw('motion', 'motion-scoped-transitions') },
  'q-one-tap-check': { status: 'adapt', rule: 'noscore', reason: 'Right/wrong is shown by colour and strikethrough only, with no live region (v2).', repair: { text: 'Answer as ghost vs record with aria-live', swap: { questioning: 'q-ghost-guess' }, days: [0.5, 1] } },
  'text-essay': { status: 'adapt', rule: 'words', reason: '97 sentences over 25 words; the longest is 69 (critique).', repair: { text: 'Run the build-content lint and rewrite', swap: { text: 'text-linted-beats' }, days: [2, 4] } },
  'text-reference': { status: 'adapt', rule: 'words', reason: 'Reference prose with long sentences and tables, written for review rather than for learners.', repair: { text: 'Rewrite as beats from the reference', swap: { text: 'text-linted-beats' }, days: [3, 6] } },
  'visual-editorial-navy': { status: 'adapt', rule: 'seal', reason: 'Seal red sits on every pin, route and slider, so it means nothing (critique).', repair: { text: 'Recolour accents; keep seal red for the stamp', swap: { visual: 'visual-washi-sumi-indigo' }, days: [0.5, 1] } },
  'visual-paper-blue-dark-stage': { status: 'adapt', rule: 'seal', reason: 'Seal red is reserved for predictions and checks here; the house rule reserves it for the censor and 1842.', repair: { text: 'Move seal red to the censor beats', days: [0.25, 0.5] } },
  'map-dots-raster': { status: 'adapt', rule: 'place', reason: 'Ten pins set by eye on the 1859 sheet; the Tōkaidō drawn straight through Fuji.', repair: { text: 'Place from Wikidata coordinates + georef59.json', swap: { mapping: 'map-three-scale' }, days: [1, 2] } },
};
// Method-level rules: mixes inherit them; the custom mix is assembled at runtime from the same table.
const METHOD_RULES = {
  scrolly: { requires: [R('scroll-driver', 'layout', 'conflict', 'Scrollytelling needs a scroll that drives a pinned instrument; this layout has none.', sw('layout', 'layout-scene-sheets-rooms'), { tags: ['screens'], level: 'adapt', reason: 'On separate screens scrollytelling becomes a step-through in the lecture player.' })] },
  video: { house: { status: 'adapt', rule: 'zero', reason: 'Video is cost L at zero budget: link holder-made films; make only silent animated processes.', repair: fix('Use the peel-layer animation as the video', [1, 2]) } },
  stepthrough: {},
  audio: {},
  case: {},
  worked: { requires: [R('deep-zoom', 'tools', 'adapt', 'A worked reading points at marks (signature, ivy leaf, kiwame seal); it needs a deep-zoom viewer.', sw('tools', 'tools-labs-rooms'))] },
  obl: { requires: [R('deep-zoom', 'tools', 'adapt', 'Slow looking needs the object large and zoomable (foam fingers, bokashi).', sw('tools', 'tools-labs-rooms'))] },
  dbq: { requires: [R('source-texts', 'text', 'adapt', 'Document-based inquiry needs the primary texts quoted and dated (the 1905 memoir and retellings).', sw('text', 'text-linted-beats'))] },
  predict: { requires: [R(['instrument-guess', 'mc-checks', 'pre-questions', 'predictions-spec'], 'questioning', 'adapt', 'Prediction needs a guess surface; this questioning option has none.', sw('questioning', 'q-ghost-guess'))] },
  chrono: { requires: [R(['placeable-axis', 'placeable-map'], 'timeline', 'adapt', 'Placement needs an axis or map that accepts tiles (Rebuild).', sw('timeline', 'tl-lane-chart'))] },
  graph: { requires: [R('graph-view', 'navigation', 'adapt', 'Connect Two Things needs a graph view (Atlas Connections); none is in this path.', fix('Build a Connect Two Things view', [3, 5]))] },
  compare: { requires: [R('compare-viewer', 'tools', 'adapt', 'Comparison needs aligned images in one viewer (the three Waves).', sw('tools', 'tools-labs-rooms'))] },
  sac: { conflicts: [C('thin-text', 'conflict', 'An argued card needs two sourced readings of 80–150 words each; one- or two-sentence copy cannot hold them.', sw('text', 'text-linted-beats')),
    C('beat-cap-100', 'adapt', 'The two readings need a lint exception: keep the 25-word sentence rule, lift the 100-word beat cap for argued cards.', fix('Add an argued-card exception to build-content.mjs', [0.25, 0.5]))] },
  socratic: { house: { status: 'adapt', rule: 'zero', reason: 'A Socratic partner needs model inference, which strains the zero-cost rule; it needs the written-test fallback.', repair: fix('Ship the written test as the default; the partner is optional', [1, 2]) } },
  roleplay: { house: { status: 'adapt', rule: 'sens', reason: 'Role-play is allowed only for offices (the guild examiner at the Censor’s Desk), never for the women of the quarter or the actors.', repair: fix('Limit roles to offices', [0, 0.5]) } },
  branching: { house: { status: 'adapt', rule: 'sens', reason: 'Every branch must end on “What actually happened” with sources; no outcomes, scores or timers; not for the quarter.', repair: fix('Author branches in ink with sourced endings', [0.5, 1]) } },
  sim: { requires: [R('sandbox', 'tools', 'adapt', 'Simulation needs a rule-based sandbox (the edition lab: block wear and run size).', sw('tools', 'tools-labs-rooms'))] },
  deduction: { requires: [R('desks', 'tools', 'adapt', 'A deduction game needs a desk that confirms in batches (the Seal Timeline).', { text: 'Build a seal-dating desk', swap: { tools: 'tools-labs-rooms' }, days: [2, 4] })],
    conflicts: [C('mc-checks', 'adapt', 'Deduction confirms in threes so that guessing does not pay; one-tap checks reward guessing.', sw('questioning', 'q-ghost-guess'))] },
  making: { requires: [R('workshop', 'tools', 'conflict', 'Making-first needs a reconstruction workbench; v4’s Workshop room (Print the Wave) is the only one built.', sw('tools', 'tools-labs-rooms'),
    { tags: ['sandbox'], level: 'adapt', reason: 'Peel layers and the edition counter are a start, but there is no register-and-print workbench.' })] },
  tour: { requires: [R(['views', 'place-model'], 'mapping', 'adapt', 'A virtual tour places views at their viewpoints; it needs a placed map or the Views room.', sw('mapping', 'map-three-scale'))] },
  oral: { house: { status: 'adapt', rule: 'sens', reason: 'Oral history runs under the F1.29 consent kit and happens off-platform.', repair: fix('Link the F1.29 kit', [0.25, 0.5]) } },
  pbl: { house: { status: 'adapt', rule: 'zero', reason: 'Project work runs over weeks with a cohort; it belongs to the Mastery units, not one page.', repair: fix('Hand off to F1.27', [0, 0.5]) } },
  retrieval: { requires: [R('return-store', 'questioning', 'adapt', 'Spaced retrieval asks again on the next visit; the page must remember the first visit.', fix('Store three recall cards per viewer', [0.5, 1]))] },
  selfexp: { requires: [R(['instrument-guess', 'mc-checks', 'pre-questions', 'placement-tiles', 'predictions-spec'], 'questioning', 'adapt', 'Self-explanation follows a reveal; this questioning option has no reveal to explain.', sw('questioning', 'q-ghost-guess'))] },
  peer: { house: { status: 'adapt', rule: 'zero', reason: 'Peer review needs a cohort and moderation; never rank individuals.', repair: fix('Make it optional for cohorts', [0.5, 1]) } },
  portfolio: { requires: [R('ink-tokens', 'tools', 'adapt', 'A portfolio export needs the ink hand-off or a notebook to collect into.', sw('tools', 'tools-notebook'))] },
  comics: { house: { status: 'adapt', rule: 'sens', reason: 'Comics need our own drawings (no generated images of historical objects) and never depict the women of the quarter.', repair: fix('Commission drawings; exclude the quarter', [2, 4]) } },
  datastory: { requires: [R('lanes', 'timeline', 'adapt', 'A data story on prices and runs needs the lanes (price lane, run bubbles).', sw('timeline', 'tl-lane-chart'))] },
  counterfactual: {},
  annotate: { house: { status: 'adapt', rule: 'zero', reason: 'Shared annotation needs learner accounts (Hypothesis) and moderation.', repair: fix('Offer as optional cohort activity', [0.5, 1]) } },
};
const COST_DAYS = { S: [0.5, 1], M: [1, 3], L: [3, 8] };
const IN_V4 = ['scrolly', 'predict', 'chrono', 'compare', 'deduction', 'sim'];

// ---------------------------------------------------------------- assemble options
const posterAt = (vid, beat) => {
  const v = versions.find((x) => x.id === vid);
  const p = v && v.posters && v.posters[beat];
  return p && typeof p === 'object' ? p.d : null;
};
const seedByDim = Object.fromEntries(seed.map((d) => [d.dimension, d.options]));
const options = [];
for (const dim of DIMS) {
  let list;
  if (dim.id === 'methods') {
    list = MIXES.map((m) => {
      const req = [], con = [], house = [];
      for (const mid of m.methods) {
        const r = METHOD_RULES[mid] || {};
        for (const q of r.requires || []) if (!req.find((x) => x.need.join() === q.need.join() && x.from === q.from)) req.push({ ...q, method: mid });
        for (const c of r.conflicts || []) if (!con.find((x) => x.tag === c.tag)) con.push({ ...c, method: mid });
        if (r.house) house.push({ ...r.house, method: mid });
      }
      const days = m.methods.filter((x) => !IN_V4.includes(x)).reduce((a, x) => {
        const c = COST_DAYS[methods.find((y) => y.id === x).cost]; return [a[0] + c[0], a[1] + c[1]];
      }, [0, 0]);
      const pugh = { 'me-lecture': 'S-+-', 'me-narrative': 'S-+S', 'me-v4': 'SSSS', 'me-evidence': '++--', 'me-making': 'S+--', 'me-dialogue': '+S--', 'me-explore': '-S--', 'me-custom': '' }[m.id];
      const idea = { 'me-lecture': 'sound', 'me-narrative': 'sound', 'me-v4': 'strong', 'me-evidence': 'strong', 'me-making': 'sound', 'me-dialogue': 'sound', 'me-explore': 'sound', 'me-custom': 'sound' }[m.id];
      return { ...m, effort: m.methods.some((x) => !IN_V4.includes(x)) ? 'M' : 'S', requires: req, conflicts: con, houseFromMethods: house,
        provides: m.methods.map((x) => 'method-' + x), idea, pugh, files: 0, js: m.methods.includes('socratic') ? 20 : 0, days,
        a11y: [0, ''], mobile: [m.methods.includes('making') ? 1 : 0, m.methods.includes('making') ? 'Physical making is off-screen' : ''],
        borrow: m.methods.map((x) => methods.find((y) => y.id === x).name.split(' (')[0]), regions: [] };
    });
  } else {
    list = [...seedByDim[dim.id], ...(EXTRA_OPTIONS[dim.id] || [])].map((o) => {
      const x = X[o.id];
      if (!x) throw new Error('No engineering data for ' + o.id);
      return { ...o, ...x, seedRequires: o.requires, seedConflicts: o.conflicts };
    });
  }
  for (const o of list) {
    const beatPoster = o.sourceVersions.map((v) => posterAt(v, dim.beat)).find(Boolean)
      || (dim.beat === 'overture' ? o.sourceVersions.map((v) => posterAt(v, 'wave')).find(Boolean) : null);
    const poster = beatPoster || (o.poster && o.poster !== 'none' ? o.poster : null);
    const sameBeat = !!beatPoster;
    if (o.pugh !== '' && o.pugh.length !== dim.criteria.length) throw new Error('Pugh length ' + o.id);
    options.push({
      id: o.id, dim: dim.id, label: o.label, sourceVersions: o.sourceVersions, what: o.what, why: o.why, worked: o.worked, weaknesses: o.weaknesses,
      effort: o.effort, quality: o.quality, idea: o.idea, pugh: o.pugh, poster, posterBeat: sameBeat ? dim.beat : null,
      provides: o.provides, requires: o.requires || [], conflicts: o.conflicts || [], seedRequires: o.seedRequires || [], seedConflicts: o.seedConflicts || [],
      house: HOUSE[o.id] ? [HOUSE[o.id]] : (o.houseFromMethods || []),
      methods: o.methods, budget: { files: o.files, js: o.js, days: o.days, a11y: o.a11y, mobile: o.mobile },
      borrow: o.borrow || [], regions: o.regions || [], icon: o.icon, swatches: o.swatches, type: o.type, lines: o.lines,
    });
  }
}
const optIds = new Set(options.map((o) => o.id));
for (const o of options) {
  for (const r of o.requires) for (const id of Object.values(r.repair?.swap || {})) if (!optIds.has(id)) throw new Error('bad repair ' + id);
  for (const c of o.conflicts) for (const id of Object.values(c.repair?.swap || {})) if (!optIds.has(id)) throw new Error('bad repair ' + id);
}

// ---------------------------------------------------------------- version paths
const PATHS = {
  v0: { spine: 'spine-system-index', layout: 'layout-doc', navigation: 'nav-headings', tools: 'tools-spec', motion: 'motion-none', mapping: 'map-specified', timeline: 'tl-table', questioning: 'q-spec-predict-check', people: 'people-tables', text: 'text-reference', visual: 'visual-plain-doc', methods: 'me-lecture' },
  v1: { spine: 'spine-system-index', layout: 'layout-screens', navigation: 'nav-hub-filter', tools: 'tools-pages', motion: 'motion-none', mapping: 'map-schematic', timeline: 'tl-era-chips', questioning: 'q-one-tap-check', people: 'people-role-tabs', text: 'text-station-narration', visual: 'visual-paper-blue-dark-stage', methods: 'me-lecture' },
  v2: { spine: 'spine-chapters-motifs', layout: 'layout-split-stage', navigation: 'nav-chapter-dots-explore', tools: 'tools-embedded-widgets', motion: 'motion-flights-autoplay', mapping: 'map-dots-raster', timeline: 'tl-ruler', questioning: 'q-one-tap-check', people: 'people-inline-card', text: 'text-essay', visual: 'visual-editorial-navy', methods: 'me-narrative' },
  v3: { spine: 'spine-publishers-bets', layout: 'layout-pinned-stage-cards', navigation: 'nav-act-bar', tools: 'tools-stage-tools', motion: 'motion-scoped-transitions', mapping: 'map-three-scale', timeline: 'tl-lane-chart', questioning: 'q-predict-first', people: 'people-entity-sheet', text: 'text-linted-beats', visual: 'visual-washi-sumi-indigo', methods: 'me-narrative' },
  v4: { spine: 'spine-overture-coda', layout: 'layout-scene-sheets-rooms', navigation: 'nav-rooms-cast', tools: 'tools-labs-rooms', motion: 'motion-choreographed-3d', mapping: 'map-three-scale', timeline: 'tl-lane-chart', questioning: 'q-ghost-guess', people: 'people-character-cards', text: 'text-linted-beats', visual: 'visual-washi-sumi-indigo', methods: 'me-v4' },
  atlas: { spine: 'spine-atlas-hub', layout: 'layout-panel-stage', navigation: 'nav-atlas-tiers', tools: 'tools-notebook', motion: 'motion-choreographed-3d', mapping: 'map-globe-hub', timeline: 'tl-deep-time', questioning: 'q-framing-question', people: 'people-node-card', text: 'text-card-copy', visual: 'visual-washi-sumi-indigo', methods: 'me-explore' },
};
for (const [v, p] of Object.entries(PATHS)) for (const [d, id] of Object.entries(p)) {
  const o = options.find((x) => x.id === id); if (!o || o.dim !== d) throw new Error(`path ${v}.${d} -> ${id}`);
}

// ---------------------------------------------------------------- blueprint frames per layout
// Slot rects [x, y, w, h] in a 200x380 phone frame and a 400x250 desktop frame.
const FRAMES = {
  'layout-doc': { label: 'Single-column document',
    phone: { top: [0, 0, 200, 22], hero: [0, 22, 200, 64], body: [0, 86, 200, 294], overlay: [12, 40, 176, 300], bottom: [0, 356, 200, 24], corner: [8, 326, 56, 22] },
    desktop: { top: [0, 0, 400, 16], side: [0, 16, 92, 234], hero: [104, 20, 260, 52], body: [104, 76, 260, 174], overlay: [40, 26, 320, 210], corner: [8, 222, 70, 20] } },
  'layout-screens': { label: 'Separate screens',
    phone: { top: [0, 0, 200, 22], hero: [0, 22, 200, 96], body: [0, 118, 200, 120], stage: [0, 238, 200, 142], overlay: [12, 40, 176, 300], bottom: [0, 356, 200, 24], corner: [8, 326, 56, 22] },
    desktop: { top: [0, 0, 400, 16], hero: [0, 16, 400, 70], body: [0, 86, 196, 164], stage: [204, 86, 196, 164], side: [204, 86, 60, 164], overlay: [40, 26, 320, 210], corner: [8, 222, 70, 20] } },
  'layout-split-stage': { label: 'Sticky stage beside a reading column',
    phone: { top: [0, 0, 200, 22], stage: [0, 22, 200, 128], strip: [0, 150, 200, 24], hero: [0, 22, 200, 152], body: [0, 174, 200, 206], overlay: [12, 40, 176, 300], bottom: [0, 356, 200, 24], corner: [8, 326, 56, 22] },
    desktop: { top: [0, 0, 400, 16], body: [0, 16, 168, 234], hero: [0, 16, 400, 234], stage: [168, 16, 232, 184], strip: [168, 200, 232, 50], overlay: [40, 26, 320, 210], side: [0, 16, 40, 234], corner: [8, 222, 70, 20] } },
  'layout-pinned-stage-cards': { label: 'One pinned stage, beats as cards',
    phone: { top: [0, 0, 200, 22], stage: [0, 22, 200, 334], hero: [0, 22, 200, 358], body: [12, 210, 176, 120], strip: [0, 334, 200, 22], overlay: [12, 40, 176, 300], bottom: [0, 356, 200, 24], corner: [8, 300, 56, 22] },
    desktop: { top: [0, 0, 400, 16], stage: [0, 16, 400, 212], hero: [0, 16, 400, 234], body: [14, 52, 140, 132], strip: [0, 228, 400, 22], overlay: [40, 26, 320, 210], side: [360, 16, 40, 212], corner: [8, 200, 70, 20] } },
  'layout-scene-sheets-rooms': { label: 'Pinned stage + scene sheets + rooms',
    phone: { top: [0, 0, 200, 22], stage: [0, 22, 200, 334], hero: [0, 22, 200, 358], body: [12, 200, 176, 130], strip: [0, 334, 200, 22], overlay: [8, 30, 184, 320], bottom: [0, 356, 200, 24], corner: [8, 300, 56, 22] },
    desktop: { top: [0, 0, 400, 16], stage: [0, 16, 400, 212], hero: [0, 16, 400, 234], body: [14, 44, 146, 150], strip: [0, 228, 400, 22], overlay: [30, 22, 340, 218], side: [360, 16, 40, 212], corner: [8, 200, 70, 20] } },
  'layout-panel-stage': { label: 'Side panel + globe stage',
    phone: { top: [0, 0, 200, 22], stage: [0, 22, 200, 190], hero: [0, 22, 200, 190], strip: [0, 212, 200, 22], body: [0, 234, 200, 146], overlay: [12, 40, 176, 300], bottom: [0, 356, 200, 24], corner: [8, 326, 56, 22] },
    desktop: { top: [0, 0, 400, 16], body: [0, 16, 132, 234], side: [0, 16, 132, 40], stage: [132, 16, 268, 210], hero: [132, 16, 268, 210], strip: [132, 226, 268, 24], overlay: [40, 26, 320, 210], corner: [140, 200, 70, 20] } },
};
const TOP_CAP = { phone: 200, desktop: 400 };

// ---------------------------------------------------------------- course context
const units = readdirSync(join(MOD, 'specs')).filter((f) => /^F1\.[\w.]+\.md$/.test(f)).map((f) => {
  const t = rd(join(MOD, 'specs', f)).split('\n').find((l) => l.startsWith('## ')) || '';
  const id = f.replace(/\.md$/, '');
  return { id, title: t.replace(/^##\s+/, '').replace(new RegExp('^' + id.replace('.', '\\.') + '\\s+'), '') };
}).sort((a, b) => {
  const k = (s) => { const m = s.match(/F1\.(\d+)([a-z]?)/); return +m[1] * 10 + (m[2] ? m[2].charCodeAt(0) - 96 : 0); };
  return k(a.id) - k(b.id);
});
// Section 6 table: unit, archetype, forms now, lab now, add
const sec6 = tmd.split('## 6. Per-unit recommendations')[1].split('## 7.')[0];
const unitRows = {};
for (const line of sec6.split('\n')) {
  const m = line.match(/^\|\s*(F1\.[\w.]+)\s[^|]*\|\s*([A-G/]+)\s*\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)\|/);
  if (m) unitRows[m[1]] = { arch: m[2].trim(), forms: m[3].trim(), lab: m[4].trim(), add: m[5].trim(), addIds: [...m[5].matchAll(/`(\w+)`/g)].map((x) => x[1]) };
}
for (const u of units) Object.assign(u, unitRows[u.id] || { arch: '?', forms: '', lab: '', add: '', addIds: [] });
// Section 5 table: archetype mixes
const sec5 = tmd.split('## 5. Method mix per archetype')[1].split('## 6.')[0];
const mixes = {};
for (const line of sec5.split('\n')) {
  const m = line.match(/^\|\s*\*\*([A-G])\s+([^*]+)\*\*\s*\(([^)]*)\)\s*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/);
  if (m) mixes[m[1]] = { name: m[2].trim(), units: m[3].trim(), core: m[4].trim(), add: m[5].trim(), optional: m[6].trim(), avoid: m[7].trim(), balance: m[8].trim() };
}
const ARCH_NAMES = { A: 'One-object', B: 'World chapter', C: 'Network', D: 'Recurrence', E: 'Thematic argument', F: 'Method', G: 'Mastery research' };
const OPENS = { A: 'A single object filling the screen', B: 'A scrollytelling walk through one world', C: 'Globe in time-lapse, then Map', D: 'Timeline with parallel rows', E: 'An argument card', F: 'A problem or a prediction', G: 'The learner’s own layer, empty' };
const archetypes = Object.keys(ARCH_NAMES).map((k) => ({ id: k, name: ARCH_NAMES[k], opensOn: OPENS[k], ...(mixes[k] || {}) }));
const sensitivity = tmd.split('## 8. Sensitivity rules by method')[1].split('## 9.')[0].trim().split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2).replace(/\*\*/g, ''));

// ---------------------------------------------------------------- write
const ruleCount = options.reduce((n, o) => n + o.requires.length + o.conflicts.length + o.house.length, 0) + PAIRS.length;
const model = {
  built: new Date().toISOString().slice(0, 10),
  criteria: CRITERIA, dims: DIMS, options, pairs: PAIRS, houseRules: HOUSE_RULES, methodRules: METHOD_RULES, costDays: COST_DAYS, inV4: IN_V4,
  paths: PATHS, frames: FRAMES, topCap: TOP_CAP,
  budgets: { base: { files: 48, js: 120, note: 'index.html, main bundle, stylesheet and 45 object images every concept needs' }, fileLimit: 255, versionLimit: 511, capacityDays: 15 },
  versions: versions.map((v) => ({ ...v, placeholder: /placeholder/i.test(v.judged) })),
  thumbs, methods, units, archetypes, sensitivity, ruleCount,
};
writeFileSync(join(HERE, 'data/model.json'), JSON.stringify(model));
console.log(`model.json: ${DIMS.length} dimensions, ${options.length} options, ${ruleCount} rules, ${methods.length} methods, ${units.length} units`);

// Compile the unit's YAML into public/content.json, validating the schema and linting the writing.
// Fails the build on any schema error or lint violation, so the rules hold for every future unit.
// Also merges the image credits, the peel layers and the sprite index, so the page fetches one JSON file.
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
import { z } from 'zod';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const read = (f) => yaml.load(fs.readFileSync(path.join(root, 'content', f), 'utf8'));
const readJSON = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));

const story = read('story.yaml');
const sources = read('sources.yaml');
const cast = read('people.yaml');
const timeline = read('timeline.yaml');
const places = read('places.yaml');
const images = readJSON('content/images.json');
const peel = readJSON('content/peel.json');
const sprites = readJSON('content/sprites.json');

// ---------- schema
const Conf = z.enum(['documented', 'probable', 'contested', 'argued']);
const Stage = z.object({ mode: z.enum(['map', 'time', 'object', 'tool']) }).passthrough();
const Guess = z.discriminatedUnion('type', [
  z.object({ type: z.literal('slider'), q: z.string(), scale: z.enum(['log', 'linear']), min: z.number(), max: z.number(), step: z.number().optional(),
    unit: z.string(), truth: z.number(), truthLabel: z.string(), close: z.number(), hook: z.enum(['price', 'runs']).optional(), say: z.string(), sources: z.array(z.string()).min(1) }),
  z.object({ type: z.literal('timeline'), q: z.string(), range: z.tuple([z.number(), z.number()]), start: z.number(), truth: z.number(), event: z.string(), close: z.number(), say: z.string(), sources: z.array(z.string()).min(1) }),
  z.object({ type: z.literal('map'), q: z.string(), mode: z.enum(['tap', 'route']).optional(),
    options: z.array(z.object({ id: z.string(), label: z.string(), path: z.array(z.tuple([z.number(), z.number()])).optional() })).min(2),
    truth: z.union([z.string(), z.array(z.string())]), primary: z.string().optional(), closeKm: z.number().optional(), say: z.string(), sources: z.array(z.string()).min(1) }),
  z.object({ type: z.literal('tap'), q: z.string(), marks: z.string(), truth: z.array(z.number()).min(1), say: z.string(), sources: z.array(z.string()).min(1) }),
  z.object({ type: z.enum(['choice', 'bet']), q: z.string(), options: z.array(z.string()).min(2).max(3), truth: z.number(), say: z.string(), sources: z.array(z.string()).min(1) }),
  z.object({ type: z.literal('order'), q: z.string(), items: z.array(z.object({ label: z.string(), year: z.number() })).min(3).max(6), say: z.string(), sources: z.array(z.string()).min(1) }),
]);
const Argued = z.object({ q: z.string(),
  a: z.object({ title: z.string(), text: z.string(), conf: Conf }), b: z.object({ title: z.string(), text: z.string(), conf: Conf }),
  evidence: z.array(z.object({ t: z.string(), conf: Conf })).min(1), verdict: z.enum(['a', 'b']), why: z.string() });
const Beat = z.object({
  id: z.string(), kind: z.enum(['opener', 'argued']).optional(), year: z.number(),
  show: z.array(z.string()).optional(), people: z.array(z.string()).optional(), note: z.literal('quarter').optional(),
  stage: Stage, sources: z.array(z.string()).min(1), text: z.string(),
  figure: z.object({ img: z.string(), cap: z.string() }).nullable().optional(),
  argued: Argued.optional(), guess: Guess.optional(),
  links: z.array(z.object({ to: z.enum(['desks', 'workshop', 'views', 'atlas']), anchor: z.string().regex(/^[A-Za-z0-9_~-]+$/).optional(), label: z.string() })).optional(),
}).strict();
const Tile = z.object({ id: z.string(), label: z.string(), year: z.number().optional(), place: z.string().optional(), img: z.string().optional(), from: z.string().optional(), hint: z.string() });
const Rebuild = z.object({ mode: z.enum(['time', 'map']), range: z.tuple([z.number(), z.number()]).optional(), q: z.string(), tiles: z.array(Tile).min(4).max(6) });
const Segment = z.object({ id: z.string(), title: z.string(), beats: z.array(Beat).min(1) }).strict();
const Act = z.object({ id: z.string(), n: z.string(), title: z.string(), kicker: z.string(), years: z.string().optional(), bet: z.string().optional(), seal: z.boolean().optional(),
  hero: Stage.optional(), segments: z.array(Segment).min(1), rebuild: Rebuild.optional() }).strict();
const SHOTS = ['paper', 'wave', 'shop', 'blocks', 'edo', 'seal', 'sea', 'return', 'contents'];
const Overture = z.object({ shots: z.array(z.object({ id: z.enum(SHOTS), text: z.string(), alt: z.string() }).strict()).length(9) }).strict();
const Story = z.object({ unit: z.object({ title: z.string(), kanji: z.string(), question: z.string() }), overture: Overture, acts: z.array(Act).min(1),
  coda: z.object({ order: z.object({ q: z.string(), items: z.array(z.object({ label: z.string(), year: z.number() })).length(6) }) }) });
const Person = z.object({
  name: z.string(), kanji: z.string().optional(), group: z.string(), born: z.union([z.number(), z.string()]).optional(), died: z.union([z.number(), z.string()]).optional(),
  img: z.string().optional(), cap: z.string().optional(), line: z.string(), mark: z.string().optional(),
  role: z.string().optional(), bet: z.string().optional(), highlights: z.array(z.object({ t: z.string(), conf: Conf })).length(3).optional(),
  story: z.string().optional(), works: z.array(z.string()).optional(), worksNote: z.string().optional(),
  links: z.array(z.object({ to: z.string().optional(), label: z.string().optional(), rel: z.string() })).optional(),
  life: z.array(z.object({ y: z.number(), t: z.string() })).optional(),
  map: z.object({ scale: z.enum(['city', 'world', 'japan', 'kanto', 'europe']), ids: z.array(z.string()).optional(), route: z.string().optional() }).optional(),
  sources: z.array(z.string()).optional(),
}).strict();

const fail = (r, what) => { if (!r.success) { console.error(what, JSON.stringify(r.error.issues.slice(0, 12), null, 1)); process.exit(1); } };
fail(Story.safeParse(story), 'story.yaml');
for (const [id, p] of Object.entries(cast.people)) fail(Person.safeParse(p), `people.yaml: ${id}`);

// ---------- lint
const errors = [], warnings = [];
const words = (s) => s.replace(/「[^」]*」/g, ' Q ').split(/\s+/).filter(Boolean);
const plain = (s) => s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2').replace(/\[\[([^\]]+)\]\]/g, (m, id) => (cast.people[id] ? cast.people[id].name : id)).replace(/[*_]/g, '');
const sentences = (s) => plain(s).replace(/\n/g, ' ').split(/(?<=[.?!]|[.?!][”’"])\s+(?=[A-Z“「(\d])/).map((x) => x.trim()).filter(Boolean);
const eventIds = new Set(timeline.events.map((e) => e.id));
const imgOk = (id) => !!images[id] || !!sprites.index[id];
const MARKS = { keyblock: 4, 'utamaro-seals': 4, 'wave-blues': 2 };
const sig = (b) => JSON.stringify(b.stage) + '|' + Math.round(b.year);
const checkSentences = (where, text) => { for (const s of sentences(text)) { const n = words(s).length; if (n > 25) errors.push(`${where}: sentence of ${n} words: “${s.slice(0, 70)}…”`); } };
const priority = /\b(first (?:census|exhibition|curator|show|ever)|the first to)\b/i;
let prev = null, nBeats = 0, nWords = 0, longest = 0, nGuess = 0;
// overture: nine shots in the opener's fixed order, captions of at most 20 words
story.overture.shots.forEach((s, i) => {
  if (s.id !== SHOTS[i]) errors.push(`overture: shot ${i + 1} should be ${SHOTS[i]}, not ${s.id}`);
  if (words(s.text).length > 20) errors.push(`overture: ${s.id} caption over 20 words`);
  if (priority.test(s.text)) errors.push(`overture: ${s.id} priority claim`);
});
const ROOM_TABS = { desks: ['sealtimeline', 'seals', 'catalogue', 'censor'], workshop: ['print'], views: ['view', 'ukie'] };
const beatIds = new Set();
for (const act of story.acts) {
  if (act.id !== 'p') {
    if (!act.bet || !act.hero) errors.push(`${act.id}: an act needs a bet and a hero stage`);
    if (act.bet && words(act.bet).length > 30) errors.push(`${act.id}: the bet is one sentence of at most 30 words`);
    if (!act.rebuild) errors.push(`${act.id}: every act ends with a Rebuild`);
  }
  if (act.hero?.img && !imgOk(act.hero.img)) errors.push(`${act.id}: unknown hero image ${act.hero.img}`);
  for (const seg of act.segments) {
    const guesses = seg.beats.filter((b) => b.guess);
    if (guesses.length > 1) errors.push(`${seg.id}: at most one guess per scene`);
    for (const [bi, b] of seg.beats.entries()) {
      nBeats++;
      if (beatIds.has(b.id)) errors.push(`${b.id}: duplicate beat id`); beatIds.add(b.id);
      for (const l of b.links || []) if (l.anchor && ROOM_TABS[l.to] && !ROOM_TABS[l.to].includes(l.anchor) && !/^hv-\d{3}$/.test(l.anchor)) errors.push(`${b.id}: unknown ${l.to} anchor ${l.anchor}`);
      const w = words(plain(b.text)).length; nWords += w;
      const min = b.kind ? 20 : 40;
      if (w < min || w > 100) errors.push(`${b.id}: ${w} words (want ${min}–100)`);
      for (const s of sentences(b.text)) longest = Math.max(longest, words(s).length);
      checkSentences(b.id, b.text);
      if (/the course/i.test(b.text)) errors.push(`${b.id}: says “the course”`);
      if (priority.test(plain(b.text))) warnings.push(`${b.id}: priority claim, prefer “earliest known”: ${plain(b.text).match(priority)[0]}`);
      for (const id of b.sources) if (!sources[id]) errors.push(`${b.id}: unknown source ${id}`);
      for (const id of b.people || []) if (!cast.people[id]) errors.push(`${b.id}: unknown person ${id}`);
      for (const m of b.text.matchAll(/\[\[([^\]|]+)/g)) if (!cast.people[m[1]]) errors.push(`${b.id}: unknown link ${m[1]}`);
      for (const id of b.show || []) if (!eventIds.has(id)) errors.push(`${b.id}: unknown event ${id}`);
      for (const id of (b.stage.points || [])) if (!places.world[id]) errors.push(`${b.id}: unknown place ${id}`);
      for (const id of (Array.isArray(b.stage.focus) ? b.stage.focus : [])) if (!places.city[id]) errors.push(`${b.id}: unknown city place ${id}`);
      if (b.stage.img && !imgOk(b.stage.img)) errors.push(`${b.id}: unknown image ${b.stage.img}`);
      if (b.stage.marks && !MARKS[b.stage.marks]) errors.push(`${b.id}: unknown marks ${b.stage.marks}`);
      if (b.figure?.img && !imgOk(b.figure.img)) errors.push(`${b.id}: unknown figure ${b.figure.img}`);
      if (prev && sig(prev) === sig(b)) errors.push(`${b.id}: same instrument state as ${prev.id}`);
      prev = b;
      const g = b.guess;
      if (g) {
        nGuess++;
        if (bi === 0) errors.push(`${b.id}: a guess never opens a scene`);
        if (bi === seg.beats.length - 1) errors.push(`${b.id}: a guess needs a reveal beat after it`);
        for (const id of g.sources) if (!sources[id]) errors.push(`${b.id}: guess source ${id}`);
        if (words(g.q).length > 22) errors.push(`${b.id}: guess prompt over 22 words`);
        checkSentences(`${b.id} guess`, g.say);
        if (g.type === 'slider' && !(g.truth >= g.min && g.truth <= g.max)) errors.push(`${b.id}: slider truth out of range`);
        if (g.type === 'timeline' && (!eventIds.has(g.event) || g.truth < g.range[0] || g.truth > g.range[1])) errors.push(`${b.id}: timeline guess event or range`);
        if (g.type === 'map') {
          const truths = [].concat(g.truth);
          if (g.mode === 'route') { if (!g.options.some((o) => o.id === g.truth) || g.options.some((o) => !o.path)) errors.push(`${b.id}: route guess needs paths and a true option`); }
          else for (const o of g.options) if (!places.world[o.id]) errors.push(`${b.id}: map option ${o.id} is not a world place`);
          if (g.mode !== 'route') for (const t of truths) if (!places.world[t]) errors.push(`${b.id}: map truth ${t}`);
        }
        if (g.type === 'tap') { if (!MARKS[g.marks] || g.truth.some((i) => i >= MARKS[g.marks])) errors.push(`${b.id}: tap marks`); if (b.stage.marks !== g.marks) errors.push(`${b.id}: a tap guess acts on the marks shown`); }
        if ((g.type === 'choice' || g.type === 'bet') && g.truth >= g.options.length) errors.push(`${b.id}: choice truth index`);
      }
      if (b.argued) for (const s of [b.argued.why, b.argued.a.text, b.argued.b.text]) checkSentences(`${b.id} argued`, s);
    }
  }
  if (act.rebuild) {
    const R = act.rebuild;
    if (R.tiles.filter((t) => t.from).length > 1) errors.push(`${act.id}: one interleaved tile per Rebuild`);
    for (const t of R.tiles) {
      if (R.mode === 'time' && (t.year == null || t.year < R.range[0] || t.year > R.range[1])) errors.push(`${act.id}: tile ${t.id} year`);
      if (R.mode === 'map' && !places.world[t.place]) errors.push(`${act.id}: tile ${t.id} place`);
      if (t.img && !imgOk(t.img)) errors.push(`${act.id}: tile ${t.id} image`);
    }
    if (R.mode === 'time' && new Set(R.tiles.map((t) => t.year)).size !== R.tiles.length) errors.push(`${act.id}: two tiles share a year`);
    if (R.mode === 'map' && new Set(R.tiles.map((t) => t.place)).size !== R.tiles.length) errors.push(`${act.id}: two tiles share a place`);
  }
}

// people: the main cast carry full character cards
const MAIN = ['tsutaya', 'utamaro', 'kyoden', 'sadanobu', 'sharaku', 'hokusai', 'oi', 'nishimuraya', 'eisen', 'hiroshige', 'uoya', 'kuniyoshi', 'tadakuni', 'hayashi', 'bing', 'vangogh', 'wright', 'fenollosa', 'tokuno'];
for (const id of MAIN) {
  const p = cast.people[id];
  if (!p) { errors.push(`people: ${id} is missing`); continue; }
  for (const k of ['role', 'bet', 'highlights', 'story', 'works', 'links', 'sources']) if (p[k] == null) errors.push(`people: ${id} needs ${k}`);
  if (!p.img && !p.mark) errors.push(`people: ${id} needs a portrait or a mark`);
}
for (const [id, p] of Object.entries(cast.people)) {
  if (!cast.groups.some((g) => g.id === p.group)) errors.push(`people: ${id} group ${p.group}`);
  if (p.img && !imgOk(p.img)) errors.push(`people: ${id} image ${p.img}`);
  if (!p.story) continue;
  const w = words(plain(p.story)).length;
  if (w < 120 || w > 220) errors.push(`people: ${id} story ${w} words (want 120–220)`);
  checkSentences(`people: ${id}`, p.story);
  if (priority.test(plain(p.story))) warnings.push(`people: ${id}: priority claim: ${plain(p.story).match(priority)[0]}`);
  for (const s of p.sources || []) if (!sources[s]) errors.push(`people: ${id} source ${s}`);
  for (const im of p.works || []) if (!imgOk(im)) errors.push(`people: ${id} work ${im}`);
  for (const l of p.links || []) if (l.to ? !cast.people[l.to] : !l.label) errors.push(`people: ${id} link ${l.to || '?'}`);
  for (const h of p.highlights || []) if (words(h.t).length > 12) errors.push(`people: ${id} highlight over 12 words: ${h.t}`);
  if (p.bet && words(p.bet).length > 20) errors.push(`people: ${id} bet over 20 words`);
  if (p.map?.ids) for (const pid of p.map.ids) if (!(p.map.scale === 'city' ? places.city[pid] : places.world[pid])) errors.push(`people: ${id} map place ${pid}`);
}
// every image referenced must have a credit
for (const e of timeline.events) if (e.img && !imgOk(e.img)) errors.push(`timeline: ${e.id} image ${e.img}`);

// ---------- assemble
const out = {
  unit: story.unit, overture: story.overture, acts: story.acts, coda: story.coda, sources, groups: cast.groups, people: cast.people,
  timeline, places, images, peel, sprites,
  stats: { beats: nBeats, words: nWords, guesses: nGuess, longestSentence: longest, built: new Date().toISOString() },
};
fs.mkdirSync(path.join(root, 'public'), { recursive: true });
fs.writeFileSync(path.join(root, 'public', 'content.json'), JSON.stringify(out));
console.log(`beats ${nBeats} · words ${nWords} · guesses ${nGuess} · longest sentence ${longest}`);
if (warnings.length) console.log('warnings:\n  ' + warnings.join('\n  '));
if (errors.length) { console.error('LINT FAILED:\n  ' + errors.join('\n  ')); process.exit(1); }
console.log('lint passed');

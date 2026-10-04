// Compile the unit's YAML into public/content.json, validating the schema and linting the writing.
// Fails the build on any schema error or lint violation, so the rules hold for every future unit.
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
import { z } from 'zod';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const read = (f) => yaml.load(fs.readFileSync(path.join(root, 'content', f), 'utf8'));

const story = read('story.yaml');
const sources = read('sources.yaml');
const cast = read('people.yaml');
const timeline = read('timeline.yaml');
const places = read('places.yaml');

// ---------- schema
const Stage = z.object({
  mode: z.enum(['map', 'time', 'object', 'tool']),
}).passthrough();
const Check = z.object({
  q: z.string(), options: z.array(z.string()).min(2), answer: z.union([z.number(), z.array(z.number())]),
  explain: z.string(), kind: z.string().optional(), sources: z.array(z.string()).optional(), resolve: z.any().optional(),
});
const Beat = z.object({
  id: z.string(), kind: z.enum(['opener', 'argued', 'closing']).optional(), year: z.number(),
  show: z.array(z.string()).optional(), people: z.array(z.string()).optional(), note: z.string().optional(),
  stage: Stage, sources: z.array(z.string()).min(1), text: z.string(),
  figure: z.object({ img: z.string(), cap: z.string() }).nullable().optional(),
  argued: z.object({ q: z.string(), a: z.object({ title: z.string(), text: z.string() }), b: z.object({ title: z.string(), text: z.string() }),
    evidence: z.string(), verdict: z.enum(['a', 'b']), why: z.string() }).optional(),
});
const Segment = z.object({ id: z.string(), title: z.string(), predict: Check.optional(), beats: z.array(Beat).min(1), decide: z.array(Check).optional() });
const Act = z.object({ id: z.string(), n: z.string(), title: z.string(), kicker: z.string(), segments: z.array(Segment).min(1) });
const Story = z.object({ unit: z.object({ title: z.string(), kanji: z.string(), question: z.string() }), acts: z.array(Act).min(1) });

const parsed = Story.safeParse(story);
if (!parsed.success) { console.error(parsed.error.issues.slice(0, 20)); process.exit(1); }

// ---------- lint
const errors = [], warnings = [];
const words = (s) => s.replace(/「[^」]*」/g, ' Q ').split(/\s+/).filter(Boolean);
const plain = (s) => s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2').replace(/\[\[([^\]]+)\]\]/g, (m, id) => (cast.people[id] ? cast.people[id].name : id)).replace(/[*_]/g, '');
const sentences = (s) => plain(s).replace(/\n/g, ' ').split(/(?<=[.?!]|[.?!][”’"])\s+(?=[A-Z“「(\d])/).map((x) => x.trim()).filter(Boolean);
const eventIds = new Set(timeline.events.map((e) => e.id));
const sig = (b) => JSON.stringify(b.stage) + '|' + Math.round(b.year);
let prev = null, nBeats = 0, nWords = 0, longest = 0;
const allBeats = [];
for (const act of story.acts) for (const seg of act.segments) {
  if (act.id !== 'p' && !seg.predict) errors.push(`${seg.id}: every segment opens with a prediction`);
  for (const b of seg.beats) {
    nBeats++; allBeats.push(b.id);
    const w = words(plain(b.text)).length; nWords += w;
    const min = b.kind ? 20 : 40;
    if (w < min || w > 100) errors.push(`${b.id}: ${w} words (want ${min}–100)`);
    for (const s of sentences(b.text)) { const n = words(s).length; longest = Math.max(longest, n); if (n > 25) errors.push(`${b.id}: sentence of ${n} words: “${s.slice(0, 70)}…”`); }
    if (/the course/i.test(b.text)) errors.push(`${b.id}: says “the course”`);
    for (const id of b.sources) if (!sources[id]) errors.push(`${b.id}: unknown source ${id}`);
    for (const id of b.people || []) if (!cast.people[id]) errors.push(`${b.id}: unknown person ${id}`);
    for (const m of b.text.matchAll(/\[\[([^\]|]+)/g)) if (!cast.people[m[1]]) errors.push(`${b.id}: unknown link ${m[1]}`);
    for (const id of b.show || []) if (!eventIds.has(id)) errors.push(`${b.id}: unknown event ${id}`);
    for (const id of (b.stage.points || [])) if (!places.world[id]) errors.push(`${b.id}: unknown place ${id}`);
    for (const id of (Array.isArray(b.stage.focus) ? b.stage.focus : [])) if (!places.city[id]) errors.push(`${b.id}: unknown city place ${id}`);
    if (prev && sig(prev) === sig(b)) errors.push(`${b.id}: same instrument state as ${prev.id}`);
    prev = b;
  }
  for (const c of [seg.predict, ...(seg.decide || [])].filter(Boolean)) {
    for (const s of [c.q, c.explain]) if (words(s).length > 30) warnings.push(`${seg.id}: check text long: ${s.slice(0, 50)}`);
  }
}

// ---------- assemble
const out = {
  unit: story.unit, acts: story.acts, sources, groups: cast.groups, people: cast.people,
  timeline, places,
  stats: { beats: nBeats, words: nWords, longestSentence: longest, built: new Date().toISOString() },
};
fs.mkdirSync(path.join(root, 'public'), { recursive: true });
fs.writeFileSync(path.join(root, 'public', 'content.json'), JSON.stringify(out));
console.log(`beats ${nBeats} · words ${nWords} · longest sentence ${longest}`);
if (warnings.length) console.log('warnings:\n  ' + warnings.join('\n  '));
if (errors.length) { console.error('LINT FAILED:\n  ' + errors.join('\n  ')); process.exit(1); }
console.log('lint passed');

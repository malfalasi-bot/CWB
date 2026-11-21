# Brief: the repertory, deep dives and the whole history

21 November 2026. Shared brief for the repertory research passes D1 to D7 and X1 to X3.

## Why this pass exists

Creative World is a design-education program about world-building. F1 "Histories of making" is its history foundation. Ballet is its first Atlas concept unit. The blueprint (`../../planning/BLUEPRINT.md`) teaches ballet in thirteen history-first chapters, with *Giselle* as the worked example and comparison walls drawn from a register of 148 works (`register.yaml`; threads T01 to T24 in `CENSUS.md` §4).

The course owner now wants, beside that unit, **a whole history of ballet told through its works**: a timeline of the different ballets; a deep dive and a benchmark on most of the famous ballets; reference points and sources of inspiration; the interesting facts; the concepts, design and art knowledge; and comparisons, contradictions, alternative views and interpretations **across the whole history**, not tied to one work.

What exists, so you do not repeat it: 35 works already taken apart in full in `../works/W1_court_to_imperial.md`, `W2_modernism.md`, `W3_remaking_global.md` (ten headings each: premise, roots, development, world, team and credit, production, reception and afterlife, documents, sources, Concept DNA reading); the theories of making in `W4`; six scope files (`../scope/`) and four gap files (`../scope2/`) on institutions, bodies, objects, stage, money, scholarship, music and mime, the audience and the house, media and childhood, handover and AI. Read the register rows for your works before you start, and skim the W file of your period to match its depth.

## The dossier (D passes): one per work, 1,100 to 1,700 words

Write in plain English for an adult learner who knows nothing about ballet: short sentences, causes ("because", "so that"), names with a role on first mention. Headings exactly as below.

```
## <Title in original language> / <English title> (<year>)
`id: <register id>` · threads: T.., T.. · confidence of the header: documented | probable | contested

**Header.** Premiere (date, place, company); choreographer; composer; librettist or scenario; designer(s) of sets, costumes, lighting; acts and length; the version most often seen today.

### In one line
The idea, in one sentence.

### How it came to be
The origin told as a story, with dates: who had the idea, what they wanted, what happened next. 150 to 250 words.

### Roots and reference points
The literary, visual, musical, folk, political or scientific sources; the earlier works it answers or borrows from; what it borrowed and from whom, with the debate where borrowing is contested.

### The world it built
Structure (acts, scenes, numbers); the movement language and its signature passages; the music and how it relates to the dance.

### Design and art
Sets, costumes, colour, materials, lighting, the painters or designers and their wider art; what the look meant and where it came from; famous images. Be concrete (a colour, a fabric, a device).

### Premiere and reception
Who danced; what happened on the night; what the critics said (quotes under 25 words, attributed); money and audience where known.

### Versions and lineage
The major stagings and remakes, in order; which is "the" version now and why; notation, reconstructions and losses.

### Readings and disputes
At least two interpretations, each with the scholar or critic who holds it (author, title, year). Contradictions in the record (dates, credits, who did what). Myths against the evidence. Give both sides in equal grammar.

### Facts worth telling
Five to eight short facts a learner would remember, each with its confidence word and source.

### Set it beside
Two to four works from other periods or places (register ids where they exist), and the contrast each makes.

### What a maker can take from it
Two or three lessons for someone building a creative world (a concept, a collection, an experience), stated plainly.

### Beyond the stage
Film, television, fashion, products, music in popular culture, other art forms.

### Sources and open images
Scholarship (author, title, year; open access marked); primary documents and images with holder and licence (CC0, PD, CC BY, CC BY-SA, or link-only). URLs only when a search or fetch returned them.
```

End each D file with **"Across these works"**: 300 to 600 words on patterns, contrasts and surprises across your batch, and a **register update** block in YAML for any work you added or any register field you found wrong (id, field, old, new, source).

## The rules

- Mark claims **documented** (seen at source, or in a source you name), **probable** (secondary or working knowledge), **contested** (give both readings) or **argued** (an interpretation). Put the word in or beside the sentence.
- "Earliest known", never "first". Quotes under 25 words. Japanese names family name first. Russian dates before 1918: give both Old Style and New Style where the date matters.
- Never compose a URL; give one only when a search or fetch returned it.
- Open licences only for images we would host (CC0, public domain, CC BY, CC BY-SA); anything else is link-only. No OpenStreetMap data.
- Company figures labelled as the company's. No invented facts: if you cannot find it, write "not found in this pass".
- Search widely: WebSearch and WebFetch (and the Exa or Parallel search tools if they are available to you); Google Scholar, JSTOR and Project MUSE abstracts, OAPEN, DOAJ, archive.org, Gallica, Library of Congress, NYPL, V&A, ROH Collections, company archives, Bachtrack, newspaper archives.

**Save as you go.** Create your output file within your first three tool calls, with a heading for every work, and write each dossier into it as soon as it is done, so nothing is lost if you are cut off. Reply at the end with a summary of 200 words: what you wrote, what you could not find, and the three most surprising findings.

## File paths

All under `modules/F1-histories-of-making/topics/ballet/research/repertory/`:
- `dossiers/D1_1734-1881.md` to `dossiers/D6_1980-2022.md`; `dossiers/D7_supplements_tier_A.md`
- `X1_readings_disputes_myths.md`, `X2_design_and_art.md`
- Benchmark: `../../planning/decisions/REPERTORY_BENCHMARK.md`

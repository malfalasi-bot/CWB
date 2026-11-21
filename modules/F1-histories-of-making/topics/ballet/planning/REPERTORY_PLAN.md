# The Repertory: ballet's whole history in its works

21 November 2026. How a whole-history timeline and deep dives on the famous ballets sit beside the thirteen-chapter unit (`BLUEPRINT.md`), which stays as it is. Built on the research of this pass (`../research/repertory/`) and the benchmark (`decisions/REPERTORY_BENCHMARK.md`).

## 1. What was asked

The course owner, 21 November 2026: keep the blueprint, and add a whole history timeline of the different ballets; research, deep dives and a benchmark on most of the famous ballets; more reference points and sources of inspiration; the interesting facts, concepts, design and art knowledge; and comparisons, contradictions, alternative views and interpretations across the whole of ballet history, not tied to particular works. It could be its own timeline sub-unit, or its own unit.

## 2. What now exists

| Material | Where | Size |
|---|---|---|
| Works register | `register.yaml` | 153 works, 1581 to 2022, one row per version |
| Works taken apart in full | `../works/W1`–`W3` (35) and `dossiers/D1`–`D6`, `D8` (82 new) | 117 works, each under fixed headings: how it came to be, roots and reference points, the world it built, design and art, premiere and reception, versions and lineage, readings and disputes, facts worth telling, set it beside, what a maker can take from it, beyond the stage, sources and open images |
| Supplements for the first 35 | `dossiers/D7` | readings and disputes, facts, comparisons and design for the works the W files took apart |
| Debates across the history | `X1` Part 1 | 18, each with named holders in equal grammar and works across three centuries or regions |
| Myths against the record | `X1` Part 2 | 38, each with a verdict word |
| Cross-currents | `X1` Part 3 | 13 long comparisons (the same plot under different states, how endings changed, why the heroine dies, who paid) |
| Design and art | `X2` | 10 eras of the stage picture, 65 designers and artists, 18 recurring design ideas, 7 design disputes |
| Timeline | `timeline.json`, built by `build_timeline.py` from the register and `timeline_events.yaml` | 153 works, 155 dated events, 11 eras, 6 lanes of works and 5 of events, 9 remake families |
| Benchmark | `decisions/REPERTORY_BENCHMARK.md` | 11 books, 6 exhibitions and archives, 11 platforms, about 30 studies, four designs |

## 3. Four ways to include it

| Design | What it is | For | Against |
|---|---|---|---|
| **A. A second unit** ("four centuries in fifty works") | Ten era chapters in date order, five works in each | A finishable course with a clear promise; narrative order helps memory | Re-tells the history the thirteen chapters tell; two narratives drift apart; a closed canon of fifty |
| **B. A layer inside the chapters** | The timeline opens every chapter; works become dots | The best-supported use of a timeline (one frame, used in every lesson) | The deep dives have nowhere to live; comparisons stay inside one chapter |
| **C. An explorer** | Cards, filters and a zoomable timeline, no paths | Breadth and reference use | Browsing without a path overloads novices; facts turn into trivia |
| **D. A hybrid: the Repertory** | One timeline, many cards, a few guided routes; one route is A's fifty works | Each piece of evidence gets its device; no second narrative competes with the chapters | The most parts to build; the timeline becomes decoration if the chapters do not use it |

The benchmark recommends D, and so does this plan, with one change for the owner's wish for a unit of its own (§4.4).

## 4. The recommendation: the Repertory, the second part of the ballet topic

The ballet topic gets two parts with one front door:
- **Part one, "Ballet as a made world"**: the thirteen chapters of the blueprint. It teaches the concept: how ideas, bodies and things become a world, and how it is kept alive.
- **Part two, "The Repertory"**: the whole history told through the works. It teaches the range: what was made, when, by whom, how it looked, how it was argued over, and what was made after it.

Each part links to the other and never re-tells it: a chapter explains the divertissement and links to the *Sleeping Beauty* card; the card shows the *Sleeping Beauty* and links back to the chapter for the idea.

**Promise on the first screen:** "Four hundred and forty years of ballet on one line of time. Open any work to see how it was made, what it borrowed, how it looked, who argued about it, and what was made after it."

### 4.1 The Line (the timeline)

- **Eleven eras**, each named for the change it carries: E0 Before ballet (1450–1580); E1 The court designs a world; E2 The Opéra makes professionals; E3 The ballet tells a story; E4 The theatre sells a dream; E5 The empire specifies; E6 The committee and the painter's stage; E7 States, schools and the bare stage; E8 Routes and rivalries; E9 Remaking the canon; E10 Screens, the world stage and repair. Each maps to blueprint chapters.
- **Works** in six rows by where they were made (France; Italy and Europe; Russia and the Soviet Union; Britain; the Americas; Asia, Africa and the Middle East). Remakes are joined to their original by an arc, so a family reads as a line across centuries.
- **Events** in five rows: who paid and who ran it; bodies and training; stage, design and light; music, record and media; the world outside.
- **Debates strip** (next build): each argument card pinned at the time it concerns and at the time it was argued.
- **Filters:** a thread (24), a region, an era, a designer. Every era, work and filter has its own link, so a chapter can open the line "at E5, following the exotic other".
- **A poster version** for print, like Gardner's global timeline.

### 4.2 The cards

| Card | How many | What it holds | Built from |
|---|---|---|---|
| **Work** | 153, growing | Line (all), Label (all), Story (117 researched), Deep (the dossier, written for learners); fixed headings, with **facts last** so they follow the idea | register, W files, dossiers, D7 |
| **Production** | 2 to 5 for each family | The work, a production (team, year), a dated cast; "the version most often seen today" flagged | dossiers' "Versions and lineage" |
| **Era** | 11 | What changed, who paid, what the stage looked like, five landmark works, what else was happening, the dispute of the era | blueprint chapters, X1, X2 |
| **Thread wall** | 24 | A pair first, then six to ten works across three centuries and three regions, then the principle | CENSUS §4, the dossiers' "Set it beside" |
| **Argument** | 18, plus each work's disputes | The question, each reading with its holder in equal grammar, the evidence, then and now | X1 Part 1, dossiers |
| **Myth** | 38 | The myth as told, what the record shows, the verdict word, the source | X1 Part 2 |
| **Cross-current** | 13 | A long comparison across periods, written as a short essay with its works | X1 Part 3 |
| **Designer and design idea** | 65 and 18 | Who, which works, what they brought, one fact; the idea across three periods | X2 |

### 4.3 The routes

A route is a sequence of existing cards with a short introduction, one transition sentence per step and a closing say-back. It adds no history the cards do not already hold.

| Route | What it is | Length |
|---|---|---|
| **R0 The line in one sitting** | The eleven eras, one landmark each, how to read the lanes; ends with the learner placing a work they know | 45 minutes, for everyone |
| **R1 Four centuries in fifty works** | Five works per era at Story depth, an era card between eras, a pair at the end of each era | 12 to 15 hours |
| **R2 Thread routes** | One per wall; the first five: two worlds; the white act; the exotic other and its answers; the remake families; a woman against family and patriarch | 1 to 2 hours each |
| **R3 The stage picture** | Ten eras of design through the designers and the works' "Design and art" | 3 hours |
| **R4 Arguments** | Six debates: story or form; who is the author; authenticity and reconstruction; Orientalism; race and access; is ballet dying | 3 hours |
| **R5 The world stage** | National ballets: one form, many states | 2 to 3 hours |
| **R6 A maker's sourcebook** | Organised by design problem, not by date: how to open a world, make a rule visible, dress a collection, credit a team, remake a classic. Each stop is a work's "What a maker can take from it" | 2 to 3 hours |
| **R7 Your route** | The learner builds a route of five to eight works with a reason for each step | 1 to 2 hours |

R6 is this plan's addition to the benchmark. It is the owner's "reference points and inspiration" made usable: the same cards, read by a maker's question rather than by date.

### 4.4 Its own unit, if wanted

R1 is the owner's "its own unit": a complete, ordered course through fifty works. Run as an optional route, it costs only the route text. Run as a certificated sub-unit, it gains say-backs at each era and an Apply task in each lane, about 3,000 more words. The evidence favours optional, because every boundary between parts loses learners; the choice is the owner's (§8).

### 4.5 Links with the thirteen chapters

| Chapter | What the Repertory gives it |
|---|---|
| 0 What a ballet is | R0 is the lineage walk; the *Giselle* card's Deep tier is the worked example's home |
| 1 to 11 | Each opens the line at its era with its works lit; its wall is a thread wall the learner can extend beyond the chapter's period |
| 3, 5, 7, 10 (*Giselle* and *Swan Lake*) | The production cards of the two families laid on the line, so every version of the worked example is visible at once |
| 12 What a world-builder keeps | The learner places their own world on the line, writes its "Set it beside" pairs, and builds an R7 route |

| Era | Chapters |
|---|---|
| E0, E1 | 0, 1 |
| E2, E3 | 1, 2 |
| E4 | 3 |
| E5 | 4, 5 |
| E6 | 7 |
| E7 | 7, 8 |
| E8 | 8 |
| E9 | 10 |
| E10 | 9, 10, 11 |

Chapter 6 (the night and the house) and chapter 11 (money, ownership, handover) read across every era; they use the event lanes rather than one era.

## 5. Writing rules for the Repertory

The voice guide and the template v2 §5 apply. In addition:
- **Facts follow the idea.** On every card, "Facts worth telling" comes last, and each fact must bear on the work's idea; a fact that does not is cut (seductive details harm learning: Harp and Mayer 1998).
- **Disputes are content.** Every Deep card holds at least two readings, each with its holder; argument cards give "then, between, now".
- **The count with its counter.** The first screen says: 153 works of an estimated 20,000 to 50,000 ballets premiered since 1581, chosen by a published rule (§6).
- **Images by licence.** Hosted only when CC0, public domain, CC BY or CC BY-SA, checked at the holder; everything else link-only. The Met's Bakst designs are link-only until each record shows Open Access (corrected 21 November 2026).

## 6. Which works are in

A work is in the Repertory if it meets at least one published criterion, recorded on its card: (1) the earliest known instance of a device that lasted; (2) in the living repertory (Bachtrack's top 30 in any year of the last decade, labelled as Bachtrack's); (3) a remake family of three or more productions; (4) a design or credit case the course teaches; (5) a regional counterweight, so that every era holds at least one work made outside western Europe and North America where the record allows. The next candidates, from D8: Iran's *Bijan and Manijeh* (Tehran, 1975), India's *Ramayana* (Little Ballet Troupe, 1952–53), Indonesia's Prambanan *Ramayana* (1961), Brazil's *Uirapuru* (1935), Les Ballets Africains (1952). No company-made Gulf ballet on a Gulf subject was found.

## 7. What it takes

| Step | What | Learner words |
|---|---|---|
| 1 | The line (prototype now; course build next) and R0; eleven era cards | about 5,000 |
| 2 | Work cards: Label for all; Story for the 117 researched; Deep for the 35 W-file works first | about 40,000 |
| 3 | Five thread walls, six argument cards, the myth cards | about 12,000 |
| 4 | R1 and R6 route text; Deep cards for the fifty works R1 needs | about 15,000 |
| 5 | The rest: walls, arguments, R3, R5, design cards | about 15,000 |

About 85,000 learner words in all, most of them cards that any design delivering the deep dives would need. Research and learner files follow `topics/README.md`: every card file names its research and is versioned.

Before step 2: the human check of the research (§9).

## 8. Decisions for the owner

1. **The Repertory as part two of the ballet topic**, with one front door: approve, or make it a separate unit.
2. **R1 (fifty works)**: optional route (default) or certificated sub-unit.
3. **Eleven eras** as named, replacing the register's eight periods.
4. **The template**: every Atlas concept with many works (a movement, a school, a design house) gets a Repertory of its own (template v2.1, §10).

## 9. Limits

- **The research is unchecked.** About 160,000 words written in one pass by research agents, each claim marked with its confidence. "Probable" items, the date conflicts the passes listed, and every image licence need checking at source before a card reaches a learner. The passes themselves found the record contradicting itself, including on companies' own pages.
- **No study tests this design** with adult design learners. The first build of the line and R0 should be tried with five learners.
- **Canon bias.** 153 works chosen by people writing in English, with the regional counterweight still thin before 1940 and in the Gulf.
- **Media are mostly link-only.** Most dance film and most twentieth-century design images are in copyright.

## 10. Change to the template

`briefs/ATLAS_CONCEPT_UNIT_TEMPLATE_v2.md` gains §4.4, "The Repertory": for any concept with many works, a second part made of a line, cards in four tiers, walls, arguments, myths and routes, built from a works register, dossiers under fixed headings, and cross-history passes for readings and for design and art.

# Critique: the `histories-of-making-design` skill and its evaluation harness

Written 20 October 2026 against the skill at `skills/histories-of-making-design/` (SKILL.md, eleven references, `evals/evals.json`), the workspace at `skills/histories-of-making-design-workspace/` (`grade.py`, `grade2.py`, `grade3.py`, `iteration-1..3/`), and the two rethink notes in `research_notes/Ballet/` (`RETHINK.md`, `RESEARCH_SCHEMA.md`). File:line references are to those files as they stand today. Counts were taken with `wc` and `grep`; nothing below is estimated where it could be measured.

The short verdict: the skill's truth rules (register, confidence words, licences, protocol) are the part worth keeping, and `RETHINK.md` is right that the rest has overgrown. But the rethink stops at "constitution plus toolbox" and does not name the two skills the course actually lacks, a research skill with a verification step and a writing skill with a learner in it, nor does it say how the evals must change. The evals as they stand measure whether an agent used the course's vocabulary, not whether a learner could read the page; and the benchmark numbers that justified three iterations are, on inspection, one run each, with the baseline scored on different evals from the treatment.

---

## 1. Size and load

**What is loaded.** The skill is 18,438 words / 107 KB across thirteen files (SKILL.md 3,182 words; `components.md` 4,477; `scenes.md` 3,544; `beats.md` 1,669; `checklist.md` 1,374; `claims.md` 1,228; `method.md` 713; `protocol.md` 531; `scripts.md` 461; `calendars.md` 423; `identities.md` 417; `tokens.css` 419; `evals.json` separate). At roughly 1.4 tokens per word for this prose (dense with numerals, en-dashes and backticks) the whole skill is about 26,000 tokens; SKILL.md alone, always loaded, is about 4,500.

**The description is itself a load.** SKILL.md:3 is a single 237-word description that lists 40-odd trigger phrases ("a unit page, a lecture, a scene, a map or globe view, a timeline, an object page or gallery, a grouping page (movement, style, school, culture, civilisation, community, polity, dynasty, network, material, technique), a comparison, a lineage …") and ends "Do not skip it for 'quick' pages." A description is read on every turn of every conversation in the module, whether or not the skill fires; this one is longer than `calendars.md`.

**What an agent must read before a one-page task.** SKILL.md:115 gives the path for a page: "name the surface, find its row in section 4, open the component, start from `tokens.css`, put the object or the map first, caption under, apparatus last, set the clock, run `checklist.md`". Followed literally that is SKILL.md (3,182) + `components.md` (4,477, because the components are one file, not one per component) + `tokens.css` (419) + `checklist.md` (1,374) = 9,452 words, ~13,000 tokens, before a line of HTML. In practice the agent reads more, because SKILL.md §6, §6a, §6b and §9 each end "Full rules in `scenes.md` / `beats.md` / `claims.md` / `calendars.md`", and the checklist's 55 items (checklist.md:6–88) cite all of them. The iteration-3 runs cost 175,000–232,000 tokens each (`iteration-3/benchmark.json`), so the skill is 10–15 % of a run, but the real cost is attention: 23 "no" clauses in one sentence at SKILL.md:111, 24 table rows at SKILL.md:41–64, 55 checklist lines, 33 components, 14 glyphs, 6 moments, 5 clock modes, 6 highlight kinds, 7 beat kinds, 8 lint codes, 7 method steps, 7 benchmark thresholds, 6 protocol levels.

**What could be trimmed or made on-demand.**

- SKILL.md §6 (lines 81–87, ~430 words) and §6a–6b (89–95, ~330 words) are summaries of `scenes.md`, `beats.md` and `claims.md` that the agent then reads anyway. For a static page (evals 0–5) none of it applies. Replace with three one-line pointers.
- `components.md` should be split one file per family (eight files) so an object page loads ~700 words, not 4,477. Twenty-four of its 33 entries end in an "Edo first:" / "First:" line (components.md:25, 35, 45, 55, 65, 75, 85, 95, 105, 125, 141, 189, 199, 209, 221, 231, 241, 251, 261, 271, 281, 291, 301, 311); those are worked examples and belong in an examples file, not the rule.
- `scenes.md` §1 (lines 5–17) is a decision table about the Edo rebuild ("Spine: Acts on the unit's own bets (Edo: five publishers' bets); no 3D overture…"), not a rule; §9 (203–210) is a to-do list for the Edo surfaces. Both are archaeology.
- `claims.md` §5 (line 92, "two to three days for an editor") and `beats.md` §2 (line 11, the v4 diagnosis) are history, not instruction.
- `checklist.md` duplicates every rule it checks; it should be generated from the rules (or be the rules), not a third copy. Today a rule lives in SKILL.md, in its reference and in the checklist, so a change must be made three times (and is not: see §2).
- The seven-step method (SKILL.md:117, `method.md`) is loaded for every page although it applies only to a new unit.

A one-page task should load about 1,500 words: the constitution, the tokens, and the one component. Today it loads six to ten times that.

---

## 2. Contradictions and ambiguities

Between SKILL.md and the references, and inside references. Each is a case where two agents reading honestly would build two different things, or where the grader enforces one side and the rule the other.

1. **Confidence words in captions.** `claims.md:60` "probable, contested and argued carry their word in the sentence" and SKILL.md:111 "no date below documented without its confidence word", enforced by `E-CONF-MISSING` (claims.md:80). But `beats.md:18` says a caption beat carries "no confidence word", `beats.md:21` puts confidence words "only here [notes] and in a prompt's `say`", and `beats.md:63` lints it. A probable date in a caption is therefore both required to carry its word and forbidden to. The grader enforces both sides: `grade3.py:89` fails any non-note beat containing "probable"; `grade3.py:124` requires "probable" twice in the page. Nowhere does it say the implied resolution (a non-documented date may not appear in a caption at all).

2. **The two accents as lecture colours.** SKILL.md:18 "Nothing else is red; nothing else is blue"; `identities.md:9` "never the two accents (indigo and seal red are the trade and the state everywhere…)". Then `identities.md:23–24` assigns `#233C6B` to L5 and `#B3301E` to L6 "(allowed here only)", and `tokens.css:14–15` ships them as `--lecture-5` and `--lecture-6`. The exception is inside the file that forbids it.

3. **"No colour on groupings" vs the era colour tab.** SKILL.md:19 "Groupings, places and objects take no colour"; an era is a grouping (SKILL.md:46, components.md:173). `components.md:12` puts "the era colour tab" in the object page's header band.

4. **The clock on surfaces that have none.** SKILL.md:57 gives the compare sheet no time device ("—"); SKILL.md:33 wants the clock "on every surface with a date". `grade2.py:8` (and `grade3.py:20`) demand a `readout|clock` string on every eval including eval 4, the compare sheet.

5. **Seconds per leg.** SKILL.md:83 "1.2 s per leg"; `scenes.md:26` "1–1.5 s per leg"; `scenes.md:115` "1.2 s regardless of distance"; `checklist.md:37` "1.2 s per leg".

6. **Seconds per tick.** SKILL.md:83 and `scenes.md:29` run: "2.5–4 s per tick"; `scenes.md:132` step mode: "1–2 s per tick … a dated run of ticks (a price falling)". A price run is both.

7. **Ticks per focus.** `scenes.md:111`, `checklist.md:31`, `calendars.md:38`: a run has at most nine ticks. `components.md:279`: "≤ 12 ticks per focus (a longer group splits)". A run is a focus (`scenes.md:73`).

8. **Shots per scene.** `scenes.md:183` "3–7 shots"; `evals.json:43` (eval 6) "4–6 shots"; `grade3.py:54` enforces 4–6. A scene with three or seven shots obeys the rule and fails the eval.

9. **Protocol levels: one or cumulative.** `protocol.md:7` "assigned one level"; `protocol.md:11` the level-1 example is "a Diné blanket … with the Attribution Notice" and nothing else. SKILL.md:54 and :103 and eval 5 (`evals.json:38`) want Notice *and* content note *and* display basis *and* review line on the same page.

10. **"No origin line" vs the afterlives bar.** SKILL.md:99 and `components.md:187` "no origin line (a movement is not an arrow from one place)"; `components.md:180` draws the movement's afterlives "as a journey bar where routed", which is a line from the movement outward.

11. **One tag per element.** SKILL.md:33 "One tag per element at most"; `components.md:178` gives each member "lens chips (material, technique, function)" plus "argued".

12. **Rules and boxes only over images.** SKILL.md:33 "rules, boxes and shadows appear only over maps and images"; `components.md:121` route callout "a hairline border"; `components.md:195` relation-graph nodes "paper chips"; `components.md:215` "a hairline 'I lean to this'". None is over an image.

13. **The page rhythm vs the object page anatomy.** SKILL.md:33 "Every page: band · one large thing · a row of objects with captions under · the reading · sources · previous/next"; `components.md:11–21` lists ten parts for the object page and no row of objects. Which is the rule?

14. **"Object first" vs the 60/40 split.** SKILL.md:115 "put the object or the map first"; `components.md:14` "On desktop the object takes the right 60 % and the text column the left 40 %", so in reading order the text is first.

15. **"Paragraphs ≤ 68 characters."** SKILL.md:26 and `checklist.md:12` say paragraphs; `scripts.md:22` and `tokens.css:27` (`--measure: 68ch`) mean line length. An agent has read it as a paragraph limit.

16. **"No 'first'."** SKILL.md:111 and `checklist.md:49` ban the word; the skill itself uses "first" 84 times, including as a rule ("Notice … first", SKILL.md:54; "caption 25–60 naming the instrument first", SKILL.md:91). The rule means "no claim of priority"; it is written as a word ban, and `grade3.py:64` enforces the word ban on eval 6 (it would fail "First Day's Vases" and "chief blanket, first phase"), while eval 0's grader does not check it at all and the with-skill Great Wave page passed 13/13 with "Prussian blue, first made in Berlin" in its reading (`iteration-3/eval-0-object-page-great-wave/with_skill/outputs/index.html`), which is exactly the priority claim the rule exists to stop.

17. **"Beat" means two things.** `scenes.md:21` "A beat has at most one [moment]" uses beat as a stage unit; `beats.md` uses beat as a text card of seven kinds. SKILL.md:83 "One focus per beat" and `beats.md:19` "focus" as a beat kind collide: a focus beat is a kind of beat, and a focus is also what every beat has one of, and also the lane chart's zoom (`scenes.md:70`).

18. **The highlight vocabulary is six and seven.** SKILL.md:87 and `checklist.md:35`: six kinds. `scenes.md:150`: "A seventh kind, proposed by the F1.13 run … the people card". A proposal sits in the rule file with no decision.

19. **Schema fields that exist only in prose.** `scenes.md:109` "Two fields the F1.13 run added: a scene-level `content_note` … and `clock.claim`"; the schema block at 79–107 and the lint at 201 do not have them; `checklist.md:70–74` does not mention them.

20. **Glyph growth vs the grader.** `scenes.md:156` "The set grows only when a new unit's content demands a glyph"; `grade3.py:35` hard-codes the fourteen Edo glyphs and `grade3.py:60` fails any other. Eval 6's Kashan → Hormuz land leg has no glyph in the set (no caravan, no ore, no kiln), so the rule's own growth clause is the thing the eval punishes.

21. **"Archetype."** SKILL.md:37 "the units run in seven archetypes"; `components.md:213` "Archetype E opens on one". The archetypes are defined nowhere in the skill.

22. **The register is mandatory and the evals have none.** SKILL.md:95 "The register is frozen before any beat, scene, tick or card is authored; a date it lacks is a change request to the editor, not a number typed into prose"; `claims.md:3` "Dates and numbers are never typed into prose … directly". Evals 0–5 (`evals.json:7–38`) hand the agent dates in prose and no register and ask for a page; the with-skill runs type them into prose and pass. The skill's own evals break its hardest rule.

23. **Where method files go.** `method.md:3` "Each writes a file into the unit's `research_notes/`"; `method.md:31` and `claims.md:3` put the register in `content/claims.yaml`; `scenes.md:77` puts scenes in `content/scenes.yaml` "and copied to the Atlas". Three homes, no map.

24. **Reading length.** `components.md:19` 150–400 words for an object page; `components.md:101` ≤ 120 for a panel; eval 1 asks 80–120; eval 8 asks 120–180. The skill never states a rule for the length of the reading as such, so each eval invents one.

---

## 3. Overfitting to the Edo unit

The skill says it was "fixed in four studies" and "tested … against all 38 units" (SKILL.md:10); the text says otherwise. "Edo" appears 31 times, "globe" 33 times, and the Edo nouns (Hundred Views 5, Tōkaidō 4, Yoshiwara 4, Nagasaki 6, Prussian 5, Tenpō 4, kiwame 3, nengō 3) appear in files that claim to be general. Specifically:

- **Tokens.** `tokens.css:9–10` ships four season colours "the Hundred Views and the Tōkaidō only"; `tokens.css:13–15` ships eight `--lecture-n` colours that are Edo's (identities.md:19–26) under the comment "other units define their own eight", assuming eight lectures although `identities.md:7` allows 3–8.
- **The lane chart's lanes.** `components.md:277` fixes the lanes as "the state; the makers; the objects; the world; the afterlife, a price lane, run bubbles, the calendar lane (… nengō, reign, Hijri)". Those are Edo's lanes (censors, publishers, prints, Dutch ships, Japonisme). The ballet brief (`research_notes/Ballet/BRIEF.md`) has no "state" lane, no price lane and no afterlife; its lanes would be bodies, institutions, works.
- **Every journey needs a globe.** SKILL.md:49 "the globe turns to follow"; `scenes.md:115` the follow camera is defined on a globe; `scenes.md:111` "a journey has at least one `follow` shot". The ballet brief says "no globe (the places are few and a list carries them)". The skill offers no journey without one.
- **The glyph library is Edo's.** `scenes.md:158–173`: ship, junk, steamer, crate, pavilion, shop, book, fan, pigment, coin, soba bowl, flame, seal, bubble, each "Demanded by (Edo)". Twelve of fourteen are specific to prints and the Dutch trade. A tutu, a kiln, a loom, a bloom of iron, a khipu have none.
- **The checklist.** `checklist.md:49` "Japanese names in Japanese order; the Yoshiwara read, not played" in the general access-and-rules section. `scripts.md:20` generalises the names rule properly; the checklist did not follow.
- **Components written for prints.** `components.md:165` the step-strip is "for the printing sequence and the seal-reading sequence"; `components.md:169` the character sheet has its "name in Japanese order with kanji"; `components.md:73` "season colour may tint the thumbnail border for the Hundred Views only"; `components.md:12` "the act bar … with the era colour tab".
- **The spine.** `scenes.md:9` "Acts on the unit's own bets (Edo: five publishers' bets)" and `beats.md:17` the threshold "opens an act or scene with its bet": the unit structure assumes a subject with bets (publishers, trades). A living practice, a technique, a body of labour has no bet.
- **The clock readout.** `calendars.md:9` leads with the nengō; the five modes (`scenes.md:127–133`) are built around "1842 · Tenpō 13" and "218 shipments over eleven years". The ten-year minimum focus (SKILL.md:85) fits a print market; it does not fit 13 June 1769 (eval 7) or one night's wear of a pointe shoe.
- **The year regexes.** `grade3.py:88` accepts only years 1500–1999 as "a year"; `grade3.py:117` 1000–2029; `claims.md:80` scans four-digit years and defers "three-digit years (751, 830s) … when a unit reaches them" and never mentions BCE. Eval 4's tablet is c. 3100 BCE; the register lint cannot read it.
- **The method's sources.** `method.md:7` names the Met, AIC, Cleveland, BM, Smithsonian, Rijksmuseum, Europeana as "the open collections" and verifies accessions at "the Met, AIC, Cleveland and the BM". That is the object-holder world; ballet's sources (`BRIEF.md`) are a shoe factory, a journal of sports medicine, a company's appeal, a newspaper.
- **The protocol's examples.** `protocol.md:11–16` draws its six levels from Diné, Yoshiwara, Tlahuitoltepec, kōwhaiwhai, minkisi, Okina, the Chester head; those are the right examples, but the generalising sentence at `protocol.md:3` still names the rule "the Yoshiwara rule", and SKILL.md:103 opens the protocol section with it.

Rules that only make sense for Japanese prints, routes and a globe: the season tokens, the lecture-colour count, the lanes, the glyphs, the "bet" spine, the mandatory follow shot, the ten-year focus minimum, the nengō-first readout, the seal and print step-strips, the Japanese-order name rule in the checklist. Everything else generalises in principle but is illustrated only by Edo.

---

## 4. What the rules never say

Grep counts across SKILL.md and the eleven references: "objective" 0, "voice" 0, "tone" 0, "alt=" / "alt text" 0, "heading" 0, "jargon" 0, "glossary" 0, "lesson" 0, "teach" 1 (SKILL.md:37 "The course teaches far more than objects"), "understand" 1 (`scenes.md:86`, the scene field "One sentence the learner should be able to say at the end"), "paragraph" 7 (all of them length caps: ≤ 120 words, ≤ 68 characters, "deck-size serif paragraphs"). "Learner" appears 20 times, every one of them about the learner's *ink*, *layer*, *record* or *workbench*, never about what the learner knows coming in or should know going out.

- **Pedagogy and learning objectives.** The single objective slot in 18,000 words is `understand:` on a scene. A page, a unit, a grouping, a lecture has none. Nothing says who the learner is (age, prior knowledge, language), what they should be able to do after a page, or how a page would be judged against that. The method's thresholds (`method.md:13–21`) are counts of data, not of what can be taught.
- **Voice.** No register is named. The only voice rules are negatives: no slogans (SKILL.md:111), confidence words in the sentence (claims.md:60), "earliest known" (checklist.md:49), quotes ≤ 25 words (checklist.md:49). Nothing says: present or past tense; second person or not; sentence length; whether a page may ask a question; how to open; whether the maker is named in the first paragraph (RETHINK.md:32 adds this, the skill does not have it).
- **Reading order.** The rhythm (SKILL.md:33) is a layout order, not a reading order. The component anatomies are "top to bottom" lists of apparatus. The only reading-order idea in the whole corpus is in RETHINK.md:32 ("wearer → material → why that material then → construction → care"), borrowed from the London Museum, and it is not in the skill.
- **How to write a paragraph.** Nothing. Not a topic-sentence rule, not "one idea per paragraph", not how to hedge in the sentence, not where a date goes in a sentence (beats.md:41 "date in the first sentence" is for beats only), not how to introduce a term, not how to handle a non-English word.
- **How to decide what to leave out.** "What it leaves out" is a disclosure line (SKILL.md:99, components.md:176, 205, 227) about the sources' gaps, not an editorial rule for the writer. The skill never says how to choose five facts from forty, which is the only hard part of writing a page. The `scenes.md:197` ranking (significance, density, assets, visual potential, sourcing) is the nearest thing and it is for choosing scenes, not content.
- **When not to build a page.** `method.md:43` says a unit under the thresholds "ships its list twin and its grouping cards first", never "does not ship". SKILL.md:66 says "If a request fits none of these, say so and propose the smallest new component". There is no rule that says: this subject is read, not played; this request for a globe should be refused; this page would say nothing a captioned photograph does not. RETHINK.md:9 arrives at exactly that ("None of the interactives surveyed explained anything a captioned photograph could not") and the skill has no way to express it.
- **The leak of apparatus vocabulary into learner-facing text.** Because nothing distinguishes the skill's words from the page's words, the with-skill Great Wave page shows a learner "Appears in … station player · exploded view · comparison box · material biography" and a clock reading "circa c. 1830–32" (the "circa" is the register's precision field rendered as a label beside "c."). `beats.md:62` even makes a caption *name the instrument* ("the first sentence contains an instrument word (map, globe, sheet, stage, timeline, lane …)"), which guarantees that learner-facing text is about the apparatus.
- **Accessibility beyond keyboard and reduced motion.** No alt-text rule for the one large image on every page; no heading-order rule; no rule for the text equivalent of a scene; no language-attribute rule outside scripts.md.
- **Length of a page or a unit.** No reading-time target. RETHINK.md:24 proposes "the learner's twenty-minute read"; the skill has no number.

---

## 5. The evals

**What they test.** `evals.json` holds nine evals: six page builds (0–5), one scene-as-data (6), one beats-as-data (7), one register-plus-chart (8). Across the three graders there are 111 lambda assertions (`grade.py` 27, `grade2.py` 35, `grade3.py` 49). By type: presence of a string or hex code (the majority), a count of regex matches, a YAML field check (evals 6–8), two image checks (screenshot width, mean luminance), and two that are literally `lambda h, d: True` (`grade.py:30` "Label budget", `grade.py:38` "Seals in sumi or seal red only").

**What they never test.**

- *Readability.* No assertion reads a paragraph. The nearest is `grade3.py:130`, which passes if *any one* `<p>` on the page is 120–185 words, whatever the rest of the page says.
- *Whether a learner learns.* No eval has a learning objective, a question a reader should be able to answer afterwards, or a judge who reads as a learner.
- *Whether the page is worth reading.* Nothing scores content choice, order, or whether an interactive explains anything.
- *Accuracy against sources.* Evals 0–5 give facts and check that strings from the prompt reappear (`grade.py:18` "JP1847", `grade2.py:16` "1887"); nothing checks that the page says nothing the facts did not. The with-skill Great Wave reading says "Hokusai was past seventy and had already changed his name several times" and "the sky on most impressions seen today is nearer to paper than to dawn", neither in the facts, and "Prussian blue, first made in Berlin", the forbidden priority claim; 13/13.
- *Image rights actually verified.* Eval 0 copies a file from the repo; evals 3–5 use "grey placeholder frames"; eval 6 forbids a holder. No eval asks the agent to resolve an accession at the holder, which `method.md:7` calls the one thing that is "a stop, not a note".
- *The human-flow rule as experienced.* `scenes.md:150` and `protocol.md:27` govern people moved by force; no eval contains a coerced leg, a death toll or a seized object, so the rule is never exercised.
- *The 390 px rule.* `grade.py:12`, `grade2.py:11`, `grade3.py:23` check that the screenshot is 390 or 780 px wide. A Playwright screenshot is the viewport width whatever overflows; the assertion tests that the screenshot was *taken* at 390, not that the page fits.

**Can the grader be gamed by keyword presence?** Yes, and the passing runs show it is being satisfied that way even without intent:

- `grade.py:6` / `grade2.py:6` "Paper ground": passes on `'--paper' in h`, any variable named `--paper` with any value. The iteration-1 without-skill Great Wave page has no `#F1EADB` and passed it (`iteration-1/eval-0-object-page-great-wave/without_skill/grading.json`).
- `grade.py:8` "no navy/lime/neon hex": the regex `#(0[0-9A-F]{5}|1[0-9A-F]1[0-9A-F]{3}|C[0-9A-F]FF[0-9A-F]{2})` catches hexes beginning `0…`, `1?1…`, `C?FF…` and nothing else; `#FF0000` passes.
- `grade.py:9` "Clock readout": `readout|clock` anywhere, including a CSS comment.
- `grade.py:20` "Scale figure present": the string `scale`, which `transform: scale(…)` supplies.
- `grade.py:22` "One pull-fact and not more than one": `… or 'pull' in h`, so any page containing "pull" passes regardless of count.
- `grade2.py:44` "Territory as a soft wash": `wash|blur`, which the word *washi* satisfies on every course page.
- `grade2.py:24` "apply hook": `apply|lens|compare`; `grade2.py:32` "scale figure (a hand)": `hand`, which "handicraft" and "hand weaving" (both in eval 3's facts) satisfy; `grade2.py:33` "nothing ranked": fails on the substring `rank`, which "Frank" would trip and a coloured cell would not.
- `grade2.py:47` "never labels": fails only on the literal phrases "label applied" or "labelled by the course".
- `grade3.py:126–129` focus, stop-and-play, tick rules: presence of the words `opacity`, `play`, `pause`, `escape`, `halo`, `hollow`, `bar`, `dashed`. Class names satisfy them with nothing drawn.
- `grade3.py:60` "storyboard quotes a content line beside each glyph": counts quotation marks ≥ 2 × glyphs.
- `grade3.py:71` caption-names-the-instrument: the word list includes `plate`, `medallion`, `line`, `layer`, so "a Queen's ware plate" passes as naming the instrument.
- `grade3.py:93` and `grade3.py:131`: the agent writes its own `lint.md` / `lint.txt` and the grader checks that the agent's lint says "pass". Self-reported.

An agent given the assertion texts (they are written into `eval_metadata.json` by `grade.py:61`, `grade2.py:72`, `grade3.py:157` after each run) could pass nearly every one with a CSS comment block.

**Are with-skill vs old-skill comparisons fair?** No, on four counts.

1. *The baseline could read the source notes.* The v2 snapshot's SKILL.md:82 points to `research_notes/Motion layers and focus/FRAMEWORK.md`; `beats_study.md`, `editorial_process.md` and `scenes.md` sit in the same folder and are the sources of v3's `beats.md`, `claims.md`, `scenes.md`. Eval prompts give absolute paths into the repo (`evals.json:7` points at `build/units/edo/public/img/`), so every agent, including iteration-1's "without skill", could open the real Edo build and copy its CSS. The comparison measures whether the agent was *told* where to look, not whether the text helps.
2. *The treatment and baseline were scored on different evals.* `iteration-3/benchmark.md:5` "old skill = v2 on evals 6–8 only"; the summary table (lines 11–13) compares nine with-skill runs (evals 0–8) against three old-skill runs (evals 6–8). The headline "+0.19 pass rate, −54 s" is apples to oranges.
3. *The new evals test the new text's schema.* Ten of eval 7's thirteen old-skill failures are "beats.yaml parses into 4–8 beats", "Every beat has a kind from the seven", "A station (L6.n) on every beat" (`iteration-3/eval-7-…/old_skill/grading.json`): conformance to a schema v2 never saw. That is a test of novelty, not of quality; v2's beats may have read better.
4. *Where the comparison was like-for-like, the skill did not help.* `iteration-2/benchmark.md`: evals 3–5, old skill 96 % ± 7 %, new skill 100 % ± 0 %, at a cost of +220 s and +34,000 tokens per run. The 6,400 words added in v3 bought four points on a keyword grader.

---

## 6. The harness

- **Regex brittleness.** Listed above; add `grade2.py:37` (the exonym must be inside one of four quote characters after the literal "the record:"), `grade3.py:64` (the word "first" anywhere in body text, with lookbehinds for only two exemptions), `grade3.py:88` (a year is `1[5-9]\d\d`), `grade3.py:117` (`1[0-9]\d\d|20[0-2]\d`), `grade3.py:131` (a negative lookahead on the third-from-last line of `lint.txt`). Each is tuned to one eval's facts; none would survive a BCE unit, a unit after 2029, or a storyboard that uses «guillemets».
- **Timing capture is manual.** `grade2.py:68–70` and `grade3.py:153–155` create `run-1/` and copy `timing.json` into it after grading; `timing.json` holds only `total_tokens` and `duration_ms`. Every run in `iteration-3/benchmark.json` reports `"tool_calls": 0, "errors": 0`, which cannot be true of a run that executed Playwright: the harness never saw the tool calls. `benchmark.json` metadata says `"runs_per_configuration": 3`; `benchmark.md:5` says "1 run each"; only `run-1/` exists.
- **No seeds, no variance.** One run per configuration in iteration 3; "100 % ± 0 %" is the standard deviation of a single number. Iterations 1 and 2 ran three each but with no seed control and no per-eval breakdown in the markdown. With the time variance observed (iteration-2 with-skill 703 s ± 352 s, n = 3), a −54 s delta is noise.
- **No human rubric.** No run was read by a person as a learner. `review.html` exists (not opened here, per the brief) but the graders have no field for a human score and the benchmark reports none. The one thing RETHINK.md:36 says must gate everything ("read by you, revised") is the one thing the harness cannot record.
- **Assertions are added to the metadata after the fact** (`grade.py:60–62`): the eval's definition in `eval_metadata.json` is rewritten by the grader, so the eval and its grader drift together and there is no fixed spec to argue against.
- **Grader inheritance.** `grade3.py:28–32` imports `SPECIFIC` from `grade.py` and `SPEC` from `grade2.py`, then patches one of them in place (`grade3.py:134`). Three graders, three `COMMON` lists that differ slightly (`grade.py:10` Sources `>\s*Sources\s*<`, `grade3.py:21` `>\s*Sources\b`), no single source of truth.

---

## 7. The split proposed in `RETHINK.md`

**Is it right?** In direction, yes. The diagnosis at `RETHINK.md:7` is accurate and matches what §§1–4 above find: "The truth half works and should stay … The structure half has overgrown … derived from one unit (Edo, an object-and-route unit) and then stretched". The verdict that "the apparatus goes behind the content" (`RETHINK.md:32`) and that "the Atlas is the index, not the mould" (`RETHINK.md:34`) is correct and would fix contradictions 3, 10, 13 and most of §3 at a stroke.

Three things it gets wrong or leaves out.

1. **The constitution is too long and mixes kinds.** `RETHINK.md:13–24` has twelve rules: 1–9 are truth and rights (invariant, testable, belong in a constitution), 10 is a design default (paper, ink, two accents, 17/1.55, captions under), 11 is a games ban, 12 is a process gate ("the learner's twenty-minute read comes before any system"). A constitution should hold only what is true of every page in every unit and can be linted: rules 1–9, with 11 folded into 6 (the protocol) and the "nothing auto-advances past five seconds" clause. Rule 10 is the toolbox's default, not a law; the ballet unit should be free to set type differently if the subject wants it. Rule 12 is the writing skill's acceptance test.
2. **It names a toolbox but not the two skills that are missing.** `RETHINK.md:40` lists "the constitution, the brief template, the reading-order patterns, the toolbox, and the lints" and collapses the method to "research, brief, one page, lint". But research and writing are different work by different people with different outputs (a dossier and a brief; a page's prose), and today neither has a skill. `RESEARCH_SCHEMA.md` is the start of the first (twelve kinds, `RESEARCH_SCHEMA.md:5–18`, with "source URL, confidence word, 'earliest known', who counted and when" at line 20). It lacks a verification step as a rule (pass 2 did it in practice: `pass2_verify.md`), source tiers (a peer-reviewed paper, a holder's record, a company's appeal and a journalist's visit are all "sources"; `BRIEF.md` had to invent "the company's figure" as a label), a rule for what to do when the sources disagree (the register's `alternates` schema at `claims.md:19–21` belongs here), and the brief template itself (which exists only as `BRIEF.md`, a worked instance). The writing skill does not exist at all: the reading-order patterns at `RETHINK.md:40` are its first chapter, and §4 above is the list of what else it must hold.
3. **It does not say how the evals change.** Without that, the rewrite will be graded by the same keyword lambdas and will converge on the same vocabulary.

**What each should contain.**

*Constitution* (one page, ~600 words, always loaded): every date, number and attribution is a record with source and confidence; documented unmarked, the other three words in the sentence; no priority claim ("earliest known"); nothing invented (date, place, placement, route, image, drawing, quotation); open licences only, an unverified accession is a stop, a restricted holder is linked with the reason; holder · accession · date · materials · licence under every image, "maker unknown" where it is; protocol level before anything living, sacred, funerary, coerced or seized is shown, the course notices and never labels, people moved by force are people; disputes as two sourced readings, neither coloured, never marked right; counts name who counted and when, and a company's or a fundraiser's figure is labelled as theirs; every page says what its sources leave out; no points, badges, streaks, timers; nothing auto-advances past five seconds without a control; reduced motion keeps every caption. Plus two meta-rules: the apparatus (ids, "as defined by", rights lines) is a tap away and never in the reader's path; and a page that explains nothing a captioned photograph could not is not built.

*Research skill*: the two passes (`RETHINK.md:38`); the twelve kinds (`RESEARCH_SCHEMA.md`); source tiers and the labels they carry; verification at the holder as a rule with the holder APIs named; the register schema and the `alternates` rule (from `claims.md` §1); the benchmark thresholds (from `method.md` §2) rewritten as "what the content can carry"; the brief template (thesis; five to seven claims with strongest source and confidence; three objects verified; one argument; one living maker; what the sources leave out; the spine the subject suggests; the `understand` sentence; the learner's path with minutes). Output: `dossier.md`, `claims.yaml`, `brief.md`.

*Writing/content skill*: the learner (who, what they bring, what they leave with); the reading orders (object taken apart; workshop walked; one work re-made; a bench read outward; a route followed; a dispute posed); the paragraph (one idea; the maker named in the first paragraph; the date in the sentence that needs it; the hedge in the sentence, never a bracket; one number per panel; no apparatus word in learner-facing text, with the banned list: tick, lens, station, instrument, focus mask, register, claim id); captions (what the eye cannot see, from `components.md:23`); voice (tense, person, sentence length band, no question the page does not answer); what to leave out (the thesis chooses; a fact that does not serve it goes to the dossier); length (twenty minutes; a page's word budget); when not to build (the three refusals: no globe for a listable set of places, no scene for an undated journey, no interactive that a captioned photograph beats); alt text and heading order; the beats-and-lectures pattern as one optional pattern for a unit that has lectures, with `beats.md` §3–§6 moved here and relaxed. Output: the page's prose and captions, before any HTML.

*Design toolbox* (loaded per component, one file per family): `tokens.css` with Edo's seasons and lecture colours moved to `units/edo/tokens.css`; type and rhythm as defaults; the components, each in its own file with its anatomy, rules and *one* worked example; scenes, the lane chart, the clock modes, the glyph library (with an explicit "add a glyph" procedure); identities; scripts; calendars; the visual checklist (ground, type, rhythm, labels, access), generated from the component files. Nothing in it is required by the constitution.

*Lints* (code, not prose): the claims lint, the scene lint, the beat lint, the protocol lint, the apparatus-vocabulary lint, run by the harness and by the author, with the same code.

**How the evals should change.** Each skill gets evals that test its own output, and every eval runs three seeds. The page-build evals keep a trimmed set of structural assertions (tokens present, 390 px no overflow measured by `document.scrollWidth`, sources and credit present) and add the following. The judge is an LLM given a rubric with human-anchored exemplars; its calibration is reported.

1. **Learner readability (writing skill).** Input: a page's visible text (script-extracted) and its two screenshots. Judge rubric, 1–5, anchored to three fixed pages read and scored by five humans in advance: 5 = the London Museum's Pavlova costume page (the exemplar `RETHINK.md:32` already names); 3 = the Edo Great Wave page as built; 1 = the F1.13 Indian Ocean grouping page as built ("opens on 'as defined by' … before a learner sees a bowl", `RETHINK.md:7`). Questions: after reading, can you say the brief's `understand` sentence in your own words; what was the first thing you learned and at what word count; where did you stop; name one apparatus word that reached you. Pass: median ≥ 4 across seeds, and the judge's score on the three anchors within 0.5 of the human mean (reported every run, so drift is visible).
2. **Accuracy against the register (research + writing).** Input: a `claims.yaml` and a facts list; output: a page. Script: every year, number and proper name in the visible text is matched to a record or a fact; unsupported items are listed. Judge: each sentence classified as supported / inferred / unsupported against the register. Score: unsupported per 100 words, must be 0; inferred must be ≤ 1 and flagged in the sentence. A seeded trap in every variant: one fact the prompt deliberately withholds (the publisher's death year; the jar's holder) whose appearance on the page fails the eval outright. This replaces "the word 'probable' appears twice" (`grade3.py:124`).
3. **Rights verified (research skill).** Input: five accessions, two of them wrong (one resolves to a different object, one is not public domain). Output: `rights.json` with holder, accession, title as the holder gives it, licence string, URL, fetch date. Script: against a recorded fixture of the Met, AIC and Cleveland APIs, the two bad accessions must be marked "stop" and not placed; the three good ones must match the holder's title. This is `method.md:7` as a test.
4. **Objective to page (writing skill).** Input: a brief with an `understand` sentence, five claims in order, and three questions a reader should answer afterwards. Script: a small closed-book model answers the three questions from the page text alone; pass = 3/3. Judge: the five claims appear in the brief's order within the first 600 words, and the maker is named in the first paragraph.
5. **Leaving out (writing skill).** Input: a dossier of 40 facts of which an editor has secretly marked 12 as thesis-serving, and a 350-word budget. Output: the reading. Score: precision and recall of the 12 against what the page used; pass ≥ 0.75 both. The point is to test the decision the skill never describes.
6. **When not to build (writing + toolbox).** Three prompts: (a) a request for a globe for a subject whose places are five schools in a list (the ballet case); (b) a journey with no dated legs; (c) a subject under the content thresholds (two open objects, 30 % dated). Correct outputs are a list, a journey bar with the honesty line and no scene, and a list twin plus a "what waits" table. Script: no `<svg>` globe or route in (a) and (b); a "waits" table and no coordinates in (c). Judge: the refusal is explained in one paragraph a commissioning editor would accept.
7. **Human flow as experienced (constitution + protocol).** Input: the Korean potters / the galleons case from F1.13 with the counts as ranges and who counted. Output: the page. Script: no glyph on the leg; a people card; counts as ranges with the counter named; content note once, before the first object, and the first object reachable within 150 words of it. Judge, with a rubric written with the protocol's sources (CARE, Local Contexts) and two anchor pages scored by humans: does the page treat the people as people; is anything shown that the level forbids; does the page say what it could not show and why.
8. **Prose and vocabulary (writing skill).** Script: sentence-length distribution (median 14–24 words, none over 45); the apparatus-vocabulary lint (zero hits of the banned list in learner-facing text; "circa c." style doubled labels zero); priority claims found by the judge, not by regex, so "First Day's Vases" passes and "first made in Berlin" fails. Judge: paragraph rules (one idea; hedge in the sentence; the date where it is needed).

Three harness rules go with them: every eval runs with three seeds and reports mean ± sd per eval, and a skill change is accepted only when the delta exceeds two sd on the judged evals; treatment and baseline run on the same evals with the same repository access (either both may read `research_notes/` or neither may; the prompt's paths into `build/` go); timing and tool calls come from the runner's own log, never from a hand-written `timing.json`.

---

## Proposed skill map

| Skill | One line | Loads | Evals |
|---|---|---|---|
| `hom-constitution` | The dozen invariants every course page obeys: records, confidence, no invention, licences, protocol, disputes, counts, what is left out, apparatus behind content, no page that a photograph beats. | ~600 words, always; `protocol.md` (trimmed) on demand when content is flagged living / sacred / coerced. | 2 (accuracy), 7 (human flow), the apparatus lint from 8. |
| `hom-research` | Two-pass research into the twelve kinds, verification at the holder, source tiers, the register, and the one-page brief. | `RESEARCH_SCHEMA.md`, the register schema (`claims.md` §1 rewritten), the thresholds (`method.md` §2), holder-API notes, the brief template. ~1,800 words. | 3 (rights), 2 (register half), 5 (leaving out, dossier side). |
| `hom-writing` | The learner, the reading orders, the paragraph, captions, voice, what to leave out, length, when not to build; beats and lectures as one optional pattern. | ~1,500 words core; `beats.md` (relaxed) on demand for a unit with lectures. | 1 (readability), 4 (objective to page), 5 (leaving out), 6 (when not to build), 8 (prose). |
| `hom-design-toolbox` | Tokens, type, rhythm, the components one file per family, scenes, the lane chart, identities, scripts, calendars, the visual checklist. Available, not required. | `tokens.css` + the one family file the task names (~700 words); `scenes.md` only for a scene; `identities.md` / `scripts.md` / `calendars.md` only when a unit needs them. | The trimmed structural assertions from today's 0–8; a per-component visual check at 1440 and 390 with `scrollWidth`; 6 (the toolbox must offer the list and the bar as first-class). |
| `hom-lint` | The lints as code: claims, scenes, beats, protocol, apparatus vocabulary; one runner used by authors and by the harness. | Nothing into context; a script. | Its own fixtures (known-good and known-bad pages); it is what every other eval calls. |

Each skill's SKILL.md description is one sentence.

## Migration order

1. **Fix the harness first** (one day): three seeds; same evals and same access for both arms; runner-captured timing; the `scrollWidth` overflow check; drop the two `lambda: True` assertions and the `or 'pull' in h`, `wash|blur`, `scale`, `hand`, `rank` patterns. Re-run iteration 3 so there is an honest baseline before anything is rewritten.
2. **Write `hom-constitution`** from `RETHINK.md:13–24` with the edits in §7 (rules 1–9 and the two meta-rules; 10 to the toolbox, 12 to writing). Add evals 2 and 7. Make the current skill load it first and treat the rest as references, so the new rule set is live while the rest is split.
3. **Write `hom-writing`** (the ballet unit's page is its first instance, as `RETHINK.md:43` intends) and evals 1, 4, 5, 6, 8 with their human anchors scored before the first run. This is the skill the course does not have and the one whose absence §4 documents; it goes before the research skill because the ballet brief already exists and a page can be written from it now.
4. **Write `hom-research`** from `RESEARCH_SCHEMA.md` plus `claims.md` §1, `method.md` §1–§2, with the verification step and source tiers; eval 3; re-run the ballet pass 1 against it as the test.
5. **Split `hom-design-toolbox`**: `components.md` into eight family files with the "Edo first" lines moved to `examples/edo.md`; Edo's seasons and lecture colours out of `tokens.css`; `scenes.md` §1 and §9 deleted; `checklist.md` regenerated from the family files; the glyph library given an "add a glyph" rule and a second unit's glyphs.
6. **Move the lints into `hom-lint`** as code (the claims lint already exists in prose at `claims.md` §3; eval 8's agents wrote throwaway versions of it three times), and point every eval at it.
7. **Retire the monolith**: `histories-of-making-design` becomes a one-paragraph router ("for a page: constitution, then writing, then the toolbox family you need") and the 237-word description becomes one sentence. Keep `skill-snapshot-v3` for the record.

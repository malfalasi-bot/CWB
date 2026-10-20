Score: 4/5

# Learning-design review, round 3 (final for this loop): "The shoe" (Ballet, 1 of 4)

Reviewer: learning designer. Read: `research_notes/Ballet/board/round3/_page-v3.md`, `build/units/ballet/dist/the-shoe.html`, `shot-390.png`. Earlier rounds: `board/round1/learning-designer.md` (3/5), `board/round2/learning-designer.md` (3/5).

## Objectives, checked against the finished text

1. *"say what a pointe shoe is made of, how it is built, and how long it lasts"* — **Met.** Materials, build order and life are in one section, in the order the figure's key uses, and the guess rehearses the materials.
2. *"name three people who make them, and say who wrote their names down"* — **Met.** Seven people are named (Ray, Taksim, Daniel, Sheila, Varsha Bahen, Rashimi Patel, Sergei Murza); "a writer who visited his bench in 2013", "a news agency, not the firm", and "None of those names is on the company's own pages" answer the second half plainly. The new sentence *"At Freed, 'maker' means the bench; the benches in 2013 were men's, and nobody in binding or finishing has a mark"* is an honest and teachable distinction that round 2 did not have.
3. *"spot which numbers on this page are a company's own"* — **Met as a reading skill, not yet as a practised one.** The verb now matches what the page lets a reader do, and the money section models it in the open: *"Freed's own figures for pairs a year run from about 160,000… to 'nearly 250,000'… so even the company's count is contested; visitors reported 150,000 in 2013 and 333,000 in 2019"*; *"These are the companies' own numbers… no one outside the companies has checked them"*; *"Then the firms, each by its own dating"*. The round-2 breach (firm dates asserted flat) is repaired. What is still missing is the moment the reader does the spotting rather than watching it done.

## What is now right

- The guess is a clean prediction: the answer is no longer under it (heading *"How it is built"*; the figure and its key sit after the construction paragraph), "pointe" is glossed in the question itself (*"the shoe for dancing on the tips of the toes"*), and both responses address the question asked.
- The schematic's numbered key at body size is legible at 390 px; the round-2 label problem is gone.
- The thesis lands in the opening and recurs four times, each time with a new fact under it (*"None of those names is on the company's own pages"*; *"The makers' names are the ones you have to go looking for"*).
- Uncertainty is now scaffolded by the section itself: "What a company says about itself" tells the reader what kind of number they are reading before each one arrives, and the hedges ("probably", "contested", "by its own dating", "a union's in a dispute") read as method rather than nerves.
- "What is not here" is three honest sentences about the sources and the drawing, with no build state.

## Remaining issues

### 1. (High, open since round 1) The learner still does nothing after the first screen.

Quoted: the one interactive element is *"Before you read on, choose one."*; from "How it is built" to "Next: the tutu" there are about 1,000 words and no task or return. Objective 3 is a skill ("spot"), and a skill shown is not a skill learned. The four-item sorting task from round 2, placed at the end of "What a company says about itself" with the worked example ("Ray makes forty pairs a day — he told a writer, one visit, 2013"), is still the single change that would move this page to 5: two minutes, no new content, and an activity in the half of the page where attention is lowest.

### 2. (Medium, open since round 1) The guess is not accessible once answered, and the eyebrow fails contrast.

In the built page the buttons are still `disabled` on click (focus lost), the response is un-hidden with no `role="status"`/`aria-live`, and the question is not grouped with the buttons (`fieldset`/`legend` or `role="group" aria-labelledby`). `--ink-3: #7A7162` on `#F1EADB` is still about 4.0:1 for the objectives eyebrow, the Sources tone and the colophon. Neither needs the writer; both block a page that otherwise meets its objectives from being called finished.

### 3. (Medium) Length, and one referent that arrives before its explanation.

About 1,140 words, roughly five and a half to six minutes before Sources, 30 % of a twenty-minute unit on page 1 of 4. It no longer drags in the places round 2 named, but two cuts are still free: *"A dancer chooses a maker and then, the same visit was told, 'will wear no other'."* (the preceding sentence already says dancers choose by mark) and *"yet says trade is buoyant; its worry is dearer materials and fewer dance shops"* could shorten to *"its worry is materials and shops, not demand"*. Separately, *"training takes two to three years, the series says"* uses "the series" 300 words before "What is not here" explains there was a portrait series; a reader stalls on it. Say "the same visit" there, or name the series at first use ("a local writer's portrait series, 2013").

### 4. (Low) Small wording points.

- *"A pair lasts probably ten to twenty hours of dancing"*: the hedge is in the right place but the wrong word order; "about ten to twenty hours, by the usual estimate" reads as a hedge, "probably ten to twenty" reads as a stammer.
- *"He is paid by the pair."* is new and good; it earns the later line *"The one number missing from every account is what a maker is paid for a pair."* Keep both.
- The Sources block is still one paragraph of links; a list, or a `<details>`.

## Rule note (unchanged from round 2)

SKILL §6's 400–900 words cannot hold a page whose objectives require names with their attribution in the sentence; 1,000 is the honest ceiling for this page, and any page over about 600 words should carry one element that is not prose in its second half. This page has the drawing in its first half and nothing in its second; the sorting task would be that element.

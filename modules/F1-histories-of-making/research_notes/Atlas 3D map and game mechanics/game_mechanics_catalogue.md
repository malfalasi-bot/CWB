# Game mechanics for teaching a global history of making: catalogue for F1 "Histories of making" (Edo ukiyo-e worked case + Atlas meta-game)

Notes for the report writer:
- **Verified** = a game fact (studio, year, mechanic) confirmed from a source fetched or surfaced in this session, with an inline link.
- **[bg]** = a game fact taken from general background knowledge and NOT re-verified in this session (search budget ran out). Treat these as needing a check before publication. They are all listed again under the Gaps of the relevant question.
- **PROPOSAL** = a design idea for Creative World. These are not facts about any game or about history.
- Edo historical data (Tsutaya, Eijudō, the Prussian blue price 87 to 31 monme 1824–28, the 1842 Tenpō ban and 16-mon cap, kiwame/nanushi/aratame seal periods, Kuniyoshi's 8,000 sets, ~200 sheets/day/printer) comes from the project brief and was not re-checked here.
- Sensitive-content rules applied throughout: no mechanic touches the Yoshiwara or the women indentured there. Censor rule-books in the proposals use actor prints, warrior prints, colour counts and price as the regulated categories; courtesan imagery is never a playable object, and shunga is named only in static, content-noted text and never shown. The house rule "no gamified confetti; cohort as quiet density, not leaderboards" is respected: no points tables, streaks or rankings appear in any proposal. Progress is knowledge, a filled ledger, or a denser map.
- Mechanics are numbered M1–M35. Combined systems are C1–C5, under the last question.

---

## 1. Management, tycoon and economic sims: can the learner run a hanmoto (publisher)?

### Takeaway
The strongest precedent is *Papers, Please*. It turns a bureaucrat's repeated inspection into tension and moral weight, with rules that change day by day. That maps almost exactly onto the Edo censor-seal regime and gives the unit a role-reversal pair: play the censor, then the publisher. A light Kairosoft/*Game Dev Tycoon*-style ledger loop can carry "the publisher as decision-maker". It has to end each bet with a "what actually happened" reveal so it does not invent counterfactual history.

### Cited Findings
- *Papers, Please* (2013, 3909 LLC / Lucas Pope): the player checks travellers' documents against a rule list that grows more complex each in-game day, then stamps approve or deny. Money earned per traveller pays for the family's rent, food and heat, and debt ends the game. Bribes risk prison, and letting incomplete papers through can reunite families or admit attackers. — [Wikipedia: Papers, Please](https://en.wikipedia.org/wiki/Papers,_Please)
- Pope said the idea came from watching immigration inspectors doing "a specific thing ... over and over again". He deliberately left out overt political references and used a fictional Eastern-Bloc setting, and said he did not set out to make an "empathy game": the emotion came out of the core mechanics. — [Wikipedia: Papers, Please](https://en.wikipedia.org/wiki/Papers,_Please)
- Pope's original devlog is archived. — [Papers, Please devlog scrape](https://fguillen.github.io/PapersPleaseDevlogScrap/); IGF interview: [Game Developer, Road to the IGF](https://www.gamedeveloper.com/design/road-to-the-igf-lucas-pope-s-i-papers-please-i-)
- A philosophy paper treats *Papers, Please* as a case study (title and page not read in detail). — [PhilArchive FORPPA-13](https://philarchive.org/archive/FORPPA-13)
- *Edo* (Queen Games, 2011) was designed by the father-and-son team Stefan and Louis Malz. — [BGG News, BGG.CON 2011 round-up](https://boardgamegeek.com/blog/1/blogpost/5874/new-game-round-up-a-slew-of-titles-from-rio-grande). (Its mechanics were not checked this session; see Gaps.)
- *Ukiyo-e / ウキヨエ* (2025; designers Toshiki Sato and Michael Schacht; art TANSAN Inc.; 2–4 players, 20–30 min, BGG weight 1.0) casts players as art dealers specialising in ukiyo-e after the 1867 Paris World's Fair set off Japonisme. Players lay down sets of print "types", each larger than the one already on the table, which discards the smaller one. It reimplements Schacht's 2003 *Crazy Chicken* (BGG lists it as reimplementing *Drive*). — [BGG: Ukiyo-e (2025)](https://boardgamegeek.com/boardgame/444752/ukiyo-e)
- *Hokusai* (board game; designers Bianca Melyna and Moisés Pacheco; publisher Ludens Spirit, Brazil) celebrates Hokusai and "woodblock preparation and painting". Its listed mechanics are rondel action selection, colour building, set collection and tile placement. — [Tabletopia: Hokusai](https://tabletopia.com/games/hokusai-board-game). BGG-derived listing: 1–5 players, 45–90 min, weight 2.8. — [Board Game Directory: Ludens Spirit](https://www.boardgamedir.com/publishers/7938). The year is uncertain: Tabletopia shows a 2021 setup date and no publication year was confirmed.
- A board game called *Printing Press* exists on BGG (theme and mechanics not read). — [BGG: Printing Press](https://boardgamegeek.com/boardgame/390606/printing-press)
- [bg] *Game Dev Tycoon* (Greenheart Games, 2012), and Kairosoft's *Game Dev Story* (iOS/Android 2010) and its siblings, share one loop: pick topic + genre + platform, allocate staff effort to sliders, release, get review scores, and learn which combinations work.
- [bg] *Offworld Trading Company* (Mohawk Games, 2016): a real-time economic RTS with no combat. Shared market prices move with every player's buying and selling.
- [bg] *Patrician* / *Port Royale* (Ascaron, later Gaming Minds): merchant-trade sims where town prices vary with supply and demand along sea routes.
- [bg] *Concordia* (Mac Gerdts, PD-Verlag, 2013): a hand of personality cards drives the actions, and at game end each card scores according to the god it is dedicated to.
- [bg] *Mini Metro* (Dinosaur Polo Club, 2015) and *Mini Motorways* (2021): draw and redraw network lines under growing demand with very few resources.
- [bg] *Frostpunk* (11 bit studios, 2018): a city-survival sim where the "Book of Laws" makes the player sign morally loaded laws that permanently reshape society.

### Inferences (PROPOSALS)

**M1. The Hanmoto Ledger (from *Game Dev Tycoon* / Kairosoft).** PROPOSAL.
- *How it works:* Each Act opens a ledger page. The learner chooses a subject (landscape, actor, warrior, famous-places series; courtesan subjects excluded), a designer, the number of colour blocks, the paper grade and the first print run, then "publishes".
- *What it teaches:* The publisher, not the designer, is the decision-maker and risk-taker. It also shows how the four trades (publisher, designer, carver, printer) divide cost.
- *Honesty:* The result is not simulated as truth. The ledger shows the historical choice and what is known of its outcome, e.g. Kuniyoshi's 1847 series selling 8,000 sets (408,000 sheets), each claim tagged with a confidence level.
- *Scope/cost:* small–medium. It is a form with a reveal card and can be built in HTML/JS.
- *Risk:* Learners may read the reveal as "the right answer" and conclude history is an optimisation puzzle. Mitigate with "what else could have happened" notes, which link to the counterfactual-history unit.

**M2. Living pigment market (from *Offworld Trading Company*'s shared, moving prices).** PROPOSAL.
- *How it works:* A small price chart for Prussian blue (bero-ai) runs from 1824 to 1828, 87 to 31 monme per the brief. As the price falls, the ledger's blue colour block becomes cheap.
- *What it teaches:* Material supply and price shape style. The blue landscapes of Eijudō and Hokusai's *Great Wave* (1831) become a market story as well as a genius story.
- *Scope/cost:* small. One chart and one cost variable.
- *Risk:* Oversimplified causation, since cheap blue did not *cause* the Great Wave. Label it "enabling condition, not cause".

**M3. The Censor's Desk (from *Papers, Please*).** PROPOSAL. This is the flagship mechanic for the Edo unit.
- *How it works:* The learner plays the inspecting official. Proof prints arrive on the desk, and a rule-book changes by date:
  - 1790 Kansei: kiwame seal required.
  - 1842 Tenpō: actor portraits banned, colour blocks limited, 16-mon price cap.
  - 1843: dual nanushi seals.
  - 1853: aratame seals.
  The learner stamps or rejects each proof, and a running fine and reprimand ledger records the consequences for publishers (Tsutaya's 1790s fine).
- *Second pass (role reversal):* The learner is the publisher, designing within the rules or finding the period's real workarounds, for example actor likenesses disguised as other subjects. Only workarounds documented by historians are used.
- *What it teaches:* Censorship worked as a market force, and the seals became the historian's dating evidence. The same stamps the player applies are the clues they later read in M9 and M10.
- *Scope/cost:* medium, with about 15–25 hand-authored proof cards from museum open-access images.
- *Risks:* (a) It could cast the censor as a puzzle rather than state coercion. Keep the wage and fine pressure as context, not sentimentality. (b) Content rules: courtesan prints must not appear as rejectable items. The rule-book can name "pictures of courtesans" as a Tenpō category in text only, behind the content note, and never as a playable card.

**M4. Under the 16-mon cap (cost knapsack).** PROPOSAL.
- *How it works:* A tiny constraint puzzle. Each extra colour block, bokashi gradation or embossing adds cost, and the retail price is capped at 16 mon. The learner removes features until the sheet fits, and sees a real print from the period that made the same trade-off.
- *What it teaches:* Regulation shows up in the material object, as fewer blocks and simpler colour.
- *Scope/cost:* small.
- *Risk:* Production costs per block are not well documented. Show only those that are sourced, otherwise relative values labelled "illustrative".

**M5. Publisher's Bet cards: predict, then reveal.** PROPOSAL. Draws on *Concordia*'s card-as-strategy and the classroom predict-observe-explain pattern.
- *How it works:* Each of the five Acts opens with a bet card ("Tsutaya, 1790: defy, comply, or switch subject?"). The learner commits, and the real decision and outcome are then revealed with sources.
- *What it teaches:* Agency under uncertainty, which is the spine of the five-act structure.
- *Scope/cost:* small.
- *Risk:* Low, provided the reveal always cites its sources.

**M6. Draw the supply line (from *Mini Metro*).** PROPOSAL.
- *How it works:* On the Atlas map the learner draws the route that brings blue to an Edo publisher (Europe → Chinese trade → Nagasaki → Osaka/Edo) and later the route carrying prints out (Hayashi in Paris, Bing, Wright). When a line is missing, a node "starves" (no blue, no print).
- *What it teaches:* Networks unit: objects are carried along routes, and each route has gatekeepers (Nagasaki as the controlled port).
- *Scope/cost:* medium.
- *Risk:* Exact intermediate routes for Prussian blue into Japan need sourcing. Draw uncertain legs dashed.

**M7. The Edict deck (from *Frostpunk*'s Book of Laws, reversed).** PROPOSAL.
- *How it works:* The player cannot sign laws. Instead, edicts arrive as cards the player must live with: Kansei 1790, Tenpō 1842, the end of the Tenpō restrictions. Each edict changes the M1/M3 rule set.
- *What it teaches:* Makers work inside institutions they do not control. This links to the guild, waqf and censor theme across world chapters.
- *Scope/cost:* small. It reuses the M3 rule engine.

**M8. Workshop rondel (from *Concordia* / the *Hokusai* board game's rondel).** PROPOSAL.
- *How it works:* A four-segment wheel (publisher → designer → carver → printer). Each turn the learner advances a print through one trade's decisions. Skipping ahead costs time.
- *What it teaches:* Woodblock prints were made by a division of labour. It also surfaces the obscured labour of carvers and printers for the credit unit.
- *Scope/cost:* medium.
- *Risk:* It overlaps with M16–M18. Use one or the other per unit.

### Gaps
- *Edo* (Queen Games 2011): designers confirmed, but its mechanics were not checked this session. From background knowledge it is a worker/action-programming resource game, which is unverified.
- *Hokusai* (Ludens Spirit): the exact publication year and whether its "woodblock preparation" maps onto real process steps were not confirmed.
- No source was found for an existing game that simulates an Edo publisher (hanmoto) economy. This appears to be a genuine gap and an opportunity, but absence was not exhaustively proven.
- Release years and studios marked [bg] (*Game Dev Tycoon*, Kairosoft, *Offworld*, *Patrician/Port Royale*, *Concordia*, *Mini Metro*, *Frostpunk*) need verification before publication.
- Historical per-block production costs for Edo prints were not researched here.

---

## 2. Deduction and attribution: dating prints by seals, identifying publishers by trademarks, spotting re-cuts

### Takeaway
*Return of the Obra Dinn*, *The Case of the Golden Idol* and *Heaven's Vault* together give a tested grammar for "evidence → claim":
- Obra Dinn confirms answers in batches of three.
- Golden Idol fills blanks from harvested words and resists brute-forcing.
- Heaven's Vault deliberately does not confirm translations immediately, because "archaeology is not about getting things right".

That last stance fits the programme's "claims with confidence" rule, and *Pentiment* adds a model for history that will not name a single culprit.

### Cited Findings
- *Return of the Obra Dinn* (2018, Lucas Pope, published by 3909 LLC): the player only has to name everyone aboard and describe each cause of death. Identities come from small clues, inference and narrowing possibilities. Causes are picked from a catalogue, and some deaths accept more than one solution. — [Wikipedia: Return of the Obra Dinn](https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn)
- In *Obra Dinn* the player must get three fates correct before they are permanently confirmed, and the book fills itself in as the investigation proceeds. — [Thinky Games: Obra Dinn](https://thinkygames.com/games/return-of-the-obra-dinn)
- *Obra Dinn* is credited with inspiring a wave of deduction games, including *The Case of the Golden Idol* (2022) and *The Roottrees are Dead* (2023). — [Wikipedia: Return of the Obra Dinn](https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn)
- *The Case of the Golden Idol* (Color Gray Games, designer Andrejs Klavins, released 1 Nov 2022): players collect words, names and phrases from scenes and drop them into blanks in a scroll to state their theory. To stop brute-forcing, the game does not validate slots one by one; it signals only when "two or fewer slots are incorrect". Klavins: "making such a game is a matter of trusting the players". — [Game Developer: Golden Idol](https://www.gamedeveloper.com/design/case-of-the-golden-idol)
- *Heaven's Vault* (inkle, 2019; Jon Ingold and Joseph Humfrey): the core mechanic is translating inscriptions in a lost language and building a personal dictionary. — [Emily Short on Heaven's Vault](https://emshort.blog/2019/07/23/heavens-vault-inkle/); [Wikipedia: Heaven's Vault](https://en.wikipedia.org/wiki/Heaven%27s_Vault)
- Ingold: "If we'd confirmed the player's translations, then players would have brute-forced them, and never looked at the construction of each word... archaeology is not about getting things 'right'. You have to make the best guess you can; but you have to be open to changing your interpretation if new evidence comes to life." — [Game Developer: Road to the IGF, Heaven's Vault](https://www.gamedeveloper.com/business/road-to-the-igf-inkle-s-i-heaven-s-vault-i-)
- In *Heaven's Vault*, once the player has guessed the same definition for a word consistently enough, the protagonist decides whether it is correct. — [Russell Troxel review](https://www.russelltroxel.com/writing/2019/4/26/heavens-vault-review). The player drags known words onto an inscription to form a partial sentence. — [The Scientific Gamer](https://scientificgamer.com/thoughts-heavens-vault/)
- *Pentiment* (Obsidian Entertainment, directed by Josh Sawyer; released November 2022): set in the 16th century and "inspired by illuminated manuscripts, woodcut prints, and history itself". The player investigates murders across 25 years, and every accusation has consequences for the community over generations. — [Obsidian announcement](https://www.obsidian.net/news/obsidian/obsidian-entertainment-announces-pentiment). Sawyer said the game never explicitly reveals who the murderer is. — [Obsidian forums report](https://forums.obsidian.net/topic/125999-pentiment-josh-sawyers-upcoming-historical-murder-mystery-rpg-set-in-16th-century-europe)
- [bg] *Her Story* (Sam Barlow, 2015): the player types search terms into a police video database, and only clips whose transcripts match appear.
- [bg] *Strange Horticulture* (Bad Viking, 2022): identify plants by matching a customer's description against an in-game reference book of illustrated entries.
- [bg] *Gorogoa* (Jason Roberts / Annapurna, 2017): a puzzle of illustrated panels that are zoomed, layered and slid so that images combine into new scenes.
- [bg] *Inkulinati* (Yaza Games; early access 2023, full release 2024): a turn-based strategy game set inside medieval manuscript marginalia.

### Inferences (PROPOSALS)

**M9. The Book of Sheets (from *Obra Dinn*'s book of fates and confirmation in threes).** PROPOSAL.
- *How it works:* A portfolio of 12–20 open-access prints. For each print the learner fills in designer, publisher (from the trademark), censor seal type, and date range. Entries lock as confirmed only in batches of three correct.
- *What it teaches:* Dating by censor seals (kiwame 1790–1842, nanushi 1843–53, aratame 1853–76) and publisher identification by trademark (e.g. Eijudō, Tsutaya's mark).
- *Scope/cost:* medium. The content, not the code, is the work: museum open-access images plus cataloguer-verified metadata.
- *Risk:* Museum attributions sometimes disagree. Allow multiple accepted answers, as *Obra Dinn* allows multiple causes of death, and show the confidence level.

**M10. The Catalogue Card (from *Golden Idol*'s word-harvest scroll).** PROPOSAL.
- *How it works:* A museum-catalogue sentence with blanks: "Designed by ___, published by ___, the ___ seal dates this impression to ___–___; the ___ block is worn, suggesting a later printing." Words are harvested by clicking on seals, cartouches and trademarks in a zoomable high-resolution print. The only feedback is "two or fewer wrong".
- *What it teaches:* How a catalogue entry is built from evidence. It reuses directly in the attribution, museums and provenance units.
- *Scope/cost:* small–medium. Template-driven, so many prints can share one engine.
- *Risk:* Low. This is the most reusable deduction engine for the programme.

**M11. Provisional readings (from *Heaven's Vault*'s unconfirmed translation).** PROPOSAL.
- *How it works:* Kanji and kana in seals and cartouches are "read" provisionally. A reading becomes confirmed only after it is used consistently across several prints. The confirmed or provisional state mirrors the Atlas's claim-confidence levels (e.g. confirmed / likely / contested).
- *What it teaches:* Historical knowledge is accumulated and revisable, and confidence is earned through repeated evidence. This links to the attribution and re-timing units, e.g. era names in dates.
- *Scope/cost:* medium.
- *Risk:* Learners without Japanese may find it hard. Scaffold with a glossary-dictionary that fills as they go, as *Heaven's Vault*'s does.

**M12. Collection-database search (from *Her Story*).** PROPOSAL.
- *How it works:* For the museums and provenance unit, the learner gets a deliberately incomplete collection database and must find, by searching, which prints passed through Hayashi Tadamasa or Bing. Only records whose provenance text matches the query are returned.
- *What it teaches:* Provenance lives in metadata, and search vocabulary shapes what you can find.
- *Scope/cost:* small–medium. A static JSON index with a search box.
- *Risk:* Provenance data must be real and cited. Use public museum provenance fields, not invented records.

**M13. Reference-handbook identification (from *Strange Horticulture*).** PROPOSAL.
- *How it works:* Identify a pigment (bero-ai vs indigo vs dayflower blue), a paper (hōsho) or a block wood (yamazakura cherry) from an illustrated handbook using described properties: fading behaviour, colour under magnification.
- *What it teaches:* Material analysis as historical evidence. This links to the reconstruction unit.
- *Scope/cost:* small.
- *Risk:* Pigment identification normally needs lab methods. The handbook should say so and show real conservation-science results, not let learners think the eye alone settles it.

**M14. States and re-cuts: compare impressions (spot-the-difference, framed by *Obra Dinn*'s close looking).** PROPOSAL.
- *How it works:* Two or three impressions of the same design shown side by side or overlaid with a slider. The learner marks differences (block wear, missing colour block, changed seal, re-cut key block) and orders them into early and late states.
- *What it teaches:* Copying and counterfeit unit: editions, later printings and re-cuts. "The same print" is many objects.
- *Scope/cost:* small. An overlay slider over museum images.
- *Risk:* Requires aligned image pairs with documented state differences from catalogues raisonnés.

**M15. No single verdict (from *Pentiment*'s refusal to name the killer).** PROPOSAL.
- *How it works:* For genuinely contested questions (e.g. Sharaku-type identity debates, or who should be credited for a design), the learner must commit to a reading. The Atlas records it as "your reading" next to the documented scholarly positions, and nothing marks it right or wrong.
- *What it teaches:* Historiography: attribution as argument.
- *Scope/cost:* small.
- *Risk:* Must be used only where scholarship really is divided, never to make settled facts look open.

**M16 (ancillary). Layered-panel zoom (from *Gorogoa*).** PROPOSAL. Listed here for completeness; see M31.

### Gaps
- No existing game was found that teaches print dating by censor seals. This looks like a genuine gap.
- Details for *Her Story*, *Strange Horticulture*, *Gorogoa* and *Inkulinati* are [bg] and need verification.
- Not checked: whether any museum (e.g. Rijksmuseum, Met, British Museum, MFA Boston) offers a ready-made "date this print" interactive. Should be checked to avoid duplicating one or to partner with it.

---

## 3. Crafting and process sims: Print the Wave, reconstruction units

### Takeaway
Tactile "satisfying-correctness" games (*A Little to the Left*, *Assemble with Care*, *Unpacking*) show that a low-cost 2D interaction can carry process knowledge. *Sakuna: Of Rice and Ruin* shows that a commercial game built on a real craft sequence can be accurate enough that players consult a government agricultural website. Woodblock printing has strong existing visual references (David Bull / Mokuhankan) and at least one free educational browser game, but no widely known commercial printing sim was found.

### Cited Findings
- *Sakuna: Of Rice and Ruin*: the rice-farming system was detailed enough that players reportedly visited Japan's Ministry of Agriculture website for guidance. — [Agriculture Monthly (PH), 2020](https://agriculture.com.ph/2020/12/10/rice-planting-game-is-so-realistic-players-visit-japans-ministry-of-agricultures-website-for-walkthrough/). The fan wiki cautions that the game's farming "does not display 1:1 realism", so the ministry site may not map directly. — [Sakuna Wiki: Rice Farming Guide](https://sakuna-of-rice-and-ruin.fandom.com/wiki/Rice_Farming_Guide)
- *Ukiyo-e Heroes* (since 2012): Jed Henry designs, and David Bull's Tokyo workshop carves each design onto many blocks of Japanese mountain cherry (yamazakura) and prints colour layer by colour layer onto Echizen hōsho washi. This shows woodblock process as appealing, video-friendly content. — [Tools and Toys](https://toolsandtoys.net/ukiyo-e-heroes-video-game-woodblock-prints); [Ukiyo-e Heroes site](https://ukiyoeheroes.com/); process video: [carving the key block](https://www.youtube.com/watch?v=QGe06AOy-Jg)
- The printer placed damp paper on the block and rubbed it with a baren made of twisted cord covered with a bamboo sheath. — [Asian Art Museum, San Francisco: The Ukiyo-e Printing Process](https://education.asianart.org/resources/the-ukiyo-e-woodblock-printing-process/)
- A free browser game titled *Ukiyo-e Woodblock Printing*, tagged Educational and Simulation, exists on itch.io (game id 821276). Its contents could not be opened this session. — [itch.io games-like page](https://itch.io/games-like/821276/ukiyo-e-woodblock-printing)
- An indie developer has shown a "woodblock print animation" for an ukiyo-e-style game (r/IndieDev). This suggests the aesthetic is being explored, but it is not evidence of a process sim. — [Reddit r/IndieDev](https://www.reddit.com/r/IndieDev/comments/1oldufa/trying_out_a_woodblock_print_animation_for_my/)
- [bg] *A Little to the Left* (Max Inferno, 2022), *Assemble with Care* (ustwo games, 2019) and *Unpacking* (Witch Beam, 2021): short, tactile tidy/repair/unpack puzzles. *Unpacking* tells a life story entirely through the objects unpacked across several moves.
- [bg] *Ōkami* (Clover Studio / Capcom, 2006): the "Celestial Brush" lets the player pause the world and paint ink strokes to act on it.
- [bg] *Spiritfarer* (Thunder Lotus, 2020), *Cozy Grove* (Spry Fox, 2021), *Ooblets* (Glumberland, 2022): cozy management loops. They are relevant mainly for tone (gentle, unhurried), not for history.

### Inferences (PROPOSALS)

**M17. Print the Wave: registration and colour order (from *A Little to the Left* / *Assemble with Care* tactile correctness).** PROPOSAL.
- *How it works:*
  1. The learner lays damp paper against the kentō corner and edge marks on the block.
  2. The learner rubs with the baren (drag gesture).
  3. The learner repeats for each colour block in an order they choose.
  A misregistered sheet shows colour drift and a wrong order shows muddied overprints. A "printer's day" counter runs at about 200 sheets per printer per day (from the brief) and shows why a run of 8,000 sets is a labour story.
- *What it teaches:* Registration accuracy, colour order, and the labour behind the numbers.
- *Scope/cost:* medium. Canvas/WebGL compositing of pre-separated colour layers from an open-access *Great Wave* or a commissioned reconstruction.
- *Risk:* Colour separations of a real print must be produced carefully. Label them "reconstruction" and credit sources.

**M18. Carve the key block (subtractive drawing toy).** PROPOSAL.
- *How it works:* The learner clears wood away from the lines; it is a negative-space mask with a mirror-image flip. The carver's name slot sits beside the designer's on the result.
- *What it teaches:* The key block reverses the image, the carver's skill is real authorship, and credit and obscured labour (the credit unit).
- *Scope/cost:* medium.
- *Risk:* Over-gamifying skill. Keep it as a short toy, not a score chase.

**M19. Bokashi gesture (from *Ōkami*'s brush-as-input).** PROPOSAL.
- *How it works:* A gradation is made by wiping a moistened block before rubbing, using a pressure or speed gesture. The learner compares the result with the sky gradations in Hiroshige.
- *What it teaches:* Gradation is a printer's technique, not the designer's drawing.
- *Scope/cost:* medium–large. Touch and pressure are tricky on the web.
- *Risk:* Accessibility. Provide a slider alternative.

**M20. The dealer's crate (from *Unpacking*).** PROPOSAL.
- *How it works:* Act IV: unpack a shipping crate of prints, albums, a sales ledger, letters and a catalogue from Paris and New York. From the objects alone, infer whose crate it is (Hayashi, Bing, Wright) and what each one was selling and to whom.
- *What it teaches:* Objects carry their trade networks, and provenance can be read from paperwork.
- *Scope/cost:* small–medium. A 2D isometric room.
- *Risk:* Every object must be documented or labelled as a typical example.

**M21. Process fidelity standard (from *Sakuna*).** PROPOSAL, a design principle rather than a feature.
- *How it works:* Every craft step in a reconstruction toy is reviewed by a practising craftsperson and linked to a real video or document of that step, e.g. Mokuhankan or the Asian Art Museum process page, so that learners can, like Sakuna players, "go to the real source".
- *Scope/cost:* small, as process only.
- *Risk:* Craftsperson time may not be zero-cost. Use published process videos instead.

### Gaps
- The itch.io *Ukiyo-e Woodblock Printing* game's author, mechanics and quality could not be read. Worth a manual look.
- Not verified: Adachi Foundation or Mokuhankan apps or interactives; whether Google Arts & Culture has an ukiyo-e "experiment" (believed to have ukiyo-e collections and stories, but unchecked).
- No source found on how many colour blocks *The Great Wave* used. Needed before building M17 around it.
- [bg] facts for *A Little to the Left*, *Assemble with Care*, *Unpacking*, *Ōkami*, *Spiritfarer*, *Cozy Grove*, *Ooblets* need verification.

---

## 4. Route, exploration and trade: the Atlas as explorable knowledge

### Takeaway
*Outer Wilds*' Ship Log (with its "rumor mode" graph of connected clues) is the closest commercial analogue to the Atlas's "connections" view. Its premise that progress is *knowledge*, not items or stats, fits the house rule against points and leaderboards. *Tokaido*'s "furthest-back player moves next" is a ready-made "quiet cohort" pacing rule.

### Cited Findings
- *Outer Wilds* (2019, Mobius Digital, published by Annapurna Interactive). — [Wikipedia: Outer Wilds](https://en.wikipedia.org/wiki/Outer_Wilds) (search snippet)
- In *Outer Wilds* "your progress is measured in knowledge", and the Ship Log records findings automatically. — [Steam Community: Spoiler-safe Outer Wilds FAQ](https://steamcommunity.com/sharedfiles/filedetails/?id=2160452487)
- The Ship Log has a planet-by-planet map view and a "rumor mode" that "shows you how different things you've seen are connected". — [Reddit r/outerwilds](https://www.reddit.com/r/outerwilds/comments/ti0kp9/i_dont_think_im_understanding/). Entry conditions for every log entry are catalogued by players. — [Steam guide: Ship Log completion](https://steamcommunity.com/sharedfiles/filedetails/?id=3500382207)
- *Tokaido* (2012; designer Antoine Bauza; art Xavier Durin; publisher Funforge): players travel the Tōkaidō between Kyoto and Edo. — [Derek Bruff, First Player Token](https://derekbruff.org/blogs/firstplayertoken/episode-17-tokaido/)
- In *Tokaido* the next turn always goes to the player furthest back on the road. Everyone must stop at each inn before the next leg. Panoramas are collected as sets of rising value, and end-of-journey achievement cards reward e.g. most encounters or most varied meals. — [Meeple Like Us review](https://www.meeplelikeus.co.uk/tokaido-2012/)
- The same reviewer calls *Tokaido* "very passive", a game whose value "comes in reflecting upon the experience" and, on repeat, a "gamified commute". This is a useful warning about beauty without decision depth. — [Meeple Like Us review](https://www.meeplelikeus.co.uk/tokaido-2012/)
- *Rise of the Rōnin* (Team Ninja / Koei Tecmo, 2024): open world set in Yokohama, Edo and Kyoto during the Bakumatsu, the final years of the Edo period. — [Wikipedia: Rise of the Rōnin](https://en.wikipedia.org/wiki/Rise_of_the_R%C5%8Dnin); [Team Ninja world page](https://teamninja-studio.com/ronin/us/world/)
- PlayStation Blog describes Team Ninja's historical recreation of Bakumatsu cities. — [PlayStation Blog, 8 Feb 2024](https://blog.playstation.com/2024/02/08/inside-look-rise-of-the-ronins-recreation-of-late-1800s-japan/). Players describe its Edo as possibly "the biggest Japanese city ever made in a game" (opinion). — [Reddit r/riseoftheronin](https://www.reddit.com/r/riseoftheronin/comments/1c4k2wo/yokohama_street_from_bakumatsu_meiji_period_i/)
- *Ghost of Yōtei* (Sucker Punch, PlayStation; the sequel to *Ghost of Tsushima*) includes collectible sumi-e ink-painting activities. — [Variety: Ghost of Yōtei announced](https://au.variety.com/2024/more/news/ghost-of-tsushima-sequel-game-playstation-17745); [Gamepressure: All Sumi-e](https://www.gamepressure.com/ghost-of-yotei/sumi-e/z611aa2); [Wikipedia: Ghost of Yōtei](https://en.wikipedia.org/wiki/Ghost_of_Y%C5%8Dtei)
- [bg] *80 Days* (inkle, 2014): a text-led journey around the world against the clock, balancing money, time and route choices on a globe.
- [bg] *Sunless Sea* (Failbetter Games, 2015): a fog-shrouded sea map revealed as you sail, with fuel and supply pressure.
- [bg] *Ghost of Tsushima* (Sucker Punch, 2020): the "Guiding Wind" replaces most HUD waypoints. The player swipes the touchpad and wind and grass point toward the objective.
- [bg] *Sable* (Shedworks, 2021): a coming-of-age exploration game in which badges gathered by meeting people represent possible life paths.
- [bg] *Sea of Thieves* (Rare, 2018): physical maps and charts used in-world rather than as a HUD.

### Inferences (PROPOSALS)

**M22. Rumour Log Atlas (from *Outer Wilds*' Ship Log and rumour mode).** PROPOSAL. This is the core of the meta-game, C2.
- *How it works:* Every Atlas node (object, maker, place, route, institution) starts as a dim "rumour" with dashed edges. It becomes solid when a unit's evidence is engaged with (an act completed, a catalogue card filled, a print dated). Edges show *why* they exist ("Prussian blue → Great Wave: enabling condition, confidence: high").
- *What it teaches:* History of making as a web, and learning shown as the web filling in. Progress takes the form of density, which matches "cohort as quiet density".
- *Scope/cost:* medium. It sits on the existing graph, which needs per-learner state.
- *Risk:* "Completionism" turning into a checklist. Keep no percentage counters, or only a soft one.

**M23. Carry the object (from *80 Days*).** PROPOSAL.
- *How it works:* Each world chapter has one "carried object" journey: a bale of cotton (South & SE Asia), a horse (steppe), a waqf-endowed caravanserai route (Islamic world), a Pacific canoe voyage, and for Edo a packet of Prussian blue arriving and a bundle of prints departing. Time, cost and gatekeepers are drawn from documented examples.
- *What it teaches:* The networks unit across all world chapters.
- *Scope/cost:* medium per journey; the engine is reusable.
- *Risk:* Composite journeys become fiction. Label them "composite, built from these sources" or keep strictly documented itineraries.

**M24. Guiding breeze (from *Ghost of Tsushima*'s Guiding Wind).** PROPOSAL.
- *How it works:* On the 3D globe or map there are no arrows. A soft ink-wash drift or a wind-through-paper animation leans toward the nearest unexplored rumour connected to the current node.
- *What it teaches:* Interface calm and curiosity-led navigation. It is an aesthetic mechanic.
- *Scope/cost:* small–medium as a shader or particle effect.
- *Risk:* Accessibility. Always pair it with a text "next connection" list.

**M25. Fog-of-knowledge sea (from *Sunless Sea*).** PROPOSAL, for the Pacific navigation chapter.
- *How it works:* The ocean is revealed only through star-path, swell and bird-sign knowledge the learner has gathered (wayfinding concepts), rather than by sailing blind.
- *What it teaches:* Navigation as embodied knowledge, and that "maps" can be non-cartographic.
- *Scope/cost:* medium.
- *Risk:* Pacific wayfinding knowledge is living cultural knowledge. Requires community-sourced material and consent, and it must not be gamified as a puzzle to "solve".

**M26. Furthest-back moves next (from *Tokaido*).** PROPOSAL, for cohort pacing.
- *How it works:* In cohort or seminar mode the shared "road" (the 35-unit sequence) shows peers as soft marks without names or ranks. Prompts and facilitator attention go to those furthest back, and an "inn" checkpoint gathers everyone before a new section opens.
- *What it teaches:* No content; this is a social-design mechanic consistent with "quiet density, not leaderboards".
- *Scope/cost:* small.
- *Risk:* Visible position can still feel like ranking. Show the density of the cohort, not individuals.

**M27. Walk the Tōkaidō in Hiroshige's views.** PROPOSAL. A possible bridge to *Tokaido* the board game and *Rise of the Rōnin*'s urban scale.
- *How it works:* A 2.5D path of the 53 stations built from the prints themselves (see M32). At each station the learner compares the print with what is documented about the place, as a lesson that views are composed, not photographs.
- *Scope/cost:* large if done fully. Start with 5 stations.
- *Risk:* *Tokaido*'s "passive commute" problem. Every stop needs a decision or an observation task.

### Gaps
- Full *Outer Wilds* Wikipedia text (design intent quotes) could not be fetched. Designer quotes (e.g. Alex Beachum's GDC talks) on knowledge-based progression would strengthen the case and should be pulled.
- *Ghost of Yōtei*'s release date and setting (believed to be October 2025, Ezo/Hokkaido c.1603) were not confirmed from fetched text.
- [bg] facts for *80 Days*, *Sunless Sea*, *Ghost of Tsushima*'s Guiding Wind, *Sable*, *Sea of Thieves* need verification.
- *Rise of the Rōnin*'s historical-advisory process and how it handled ukiyo-e or publishers in-world were not checked.

---

## 5. Collection, codex and card systems: people as character cards, a cast deck, a cabinet of objects

### Takeaway
*Timeline* is the simplest proven chronology mechanic and fits the re-timing and seal-dating units. A *Hades*-style relationship codex, where an entry deepens each time a person recurs, fits a 35-unit programme in which Hokusai, Hayashi or a waqf founder reappear across units. Collection must stay evidence-gated, never randomly dropped "loot".

### Cited Findings
- *Timeline* (designer Frédéric Henry; Asmodee/Zygomatic): one card is placed date-side-up to start the timeline, and on their turn players try to place a card in the correct "temporal gap". — [Zygomatic rules PDF](https://www.zygomatic-games.com/wp-content/uploads/2019/08/timelineclassic_en_rules_compressed.pdf); [Games Night Guru](https://gamesnightguru.com/game/timeline/)
- *Timeline* exists as a series of themed sets (Inventions, Music & Cinema, British History, etc.). — [The Solo Meeple](https://thesolomeeple.com/2018/07/24/timeline-music-cinema-inventions-british-history/)
- [bg] *Hades* (Supergiant Games, 2020): the "Codex" entries for characters unlock further text as the player meets them repeatedly and builds relationships.
- [bg] *Wingspan* (Elizabeth Hargrave, Stonemaier Games, 2019): engine-building with about 170 real bird species cards carrying real facts. It is widely cited as a science-accurate hobby game.
- [bg] *Animal Crossing: New Horizons* (Nintendo, 2020): the player donates fossils, fish, bugs and art to a museum curated by Blathers, who gives a short factual description of each donation. The art gallery includes forgeries the player must spot.
- [bg] *Slay the Spire* (Mega Crit; early access 2017, full release 2019) and *Inscryption* (Daniel Mullins Games, 2021): deck-building roguelikes. *Inscryption* uses cards as characters with sacrifice costs.
- [bg] *Hearthstone* (Blizzard, 2014): character "hero" cards with powers.

### Inferences (PROPOSALS)

**M28. Seal Timeline (from *Timeline*).** PROPOSAL.
- *How it works:* Print cards show image and seal but no date. The learner slots each into the gap on a timeline of reforms (1790, 1842, 1843, 1853, 1876), and the card flips to show its catalogue date and the evidence.
- *Variants:* For the re-timing unit, the same cards are placed on a Japanese era-name (nengō) or sexagenary timeline, or an Islamic hijri timeline in other units.
- *What it teaches:* Dating evidence and calendars as cultural systems.
- *Scope/cost:* small. The highest value-to-cost item in the catalogue.
- *Risk:* Low.

**M29. The Cast Codex (from *Hades*' relationship codex).** PROPOSAL.
- *How it works:* Each person (Tsutaya, Hokusai, Hiroshige, Kuniyoshi, Hayashi, Bing, Wright, and named carvers and printers where known) has a codex card. Each unit in which they recur adds a paragraph from a new angle: maker, commissioner, dealer, collector, appropriator.
- *Anonymous labour:* The card for unnamed carvers and printers is deliberately thin and says why. This makes the gaps in the record visible (credit and obscured labour unit).
- *What it teaches:* People as multi-role nodes across the history of making.
- *Scope/cost:* small–medium. A data model on the Atlas.
- *Risk:* Character cards can drift into "collectible hero" framing. Avoid power stats and rarity tiers.

**M30. Cabinet with curator's voice (from *Animal Crossing*'s museum and forgeries).** PROPOSAL.
- *How it works:* Objects enter a learner's personal cabinet only with a provenance line the learner has assembled (from M10/M12). A short curator note responds to it, sometimes flagging gaps ("acquired 1890s Paris, dealer unknown").
- *Copying unit variant:* Some offered objects are period re-cuts or modern reproductions to be spotted (as with *Animal Crossing*'s forgeries).
- *What it teaches:* Museums and provenance: collecting as an act with ethics.
- *Scope/cost:* small–medium.
- *Risk:* Collecting looted or colonial objects must not be framed as fun acquisition. Some units should invert it into "return" or "should this be here?" decisions.

**M31. Tableau of connections (from *Wingspan*'s fact-carrying engine cards).** PROPOSAL.
- *How it works:* Placing object cards in a row triggers effects that are actual historical links: "Prussian blue + Nagasaki → enables blue landscape prints", "Hayashi + Exposition 1878 → prints enter Paris collections". The educational payload sits in the card text.
- *Scope/cost:* medium. Best as a printable classroom card game plus a digital twin, which suits zero-cost delivery.
- *Risk:* Causal shortcuts. Every effect text needs a citation and a confidence tag.

### Gaps
- [bg] facts for *Hades*, *Wingspan*, *Animal Crossing*, *Slay the Spire*, *Inscryption*, *Hearthstone* need verification.
- No source checked on educational outcomes of *Timeline*-style chronology games. The research literature was not searched.

---

## 6. Narrative choice and perspective

### Takeaway
The useful narrative mechanics are those that (a) record an interpretive stance and change how later evidence reads (*Disco Elysium*'s Thought Cabinet), (b) put time and labour pressure on choices (*Citizen Sleeper*'s clocks, *This War of Mine*), and (c) let the learner choose and then see the documented outcome (the M5 bet cards). *Pentiment*'s choices with consequences across generations, set in a woodcut and manuscript aesthetic, are the closest stylistic and pedagogical sibling.

### Cited Findings
- *Pentiment*: every decision and accusation "carries consequences that will impact the tightly-knit Alpine community for generations to come", across a 25-year span. — [Obsidian announcement](https://www.obsidian.net/news/obsidian/obsidian-entertainment-announces-pentiment)
- [bg] *Disco Elysium* (ZA/UM, 2019): the "Thought Cabinet" lets the player internalise ideas over time, which unlock bonuses and penalties and change dialogue.
- [bg] *Citizen Sleeper* (Jump Over the Age, 2022): dice rolled each cycle are assigned to actions, and progress "clocks" fill over cycles.
- [bg] *This War of Mine* (11 bit studios, 2014): civilian survival in a besieged city, with moral pressure from scarcity.
- [bg] *Kentucky Route Zero* (Cardboard Computer, 2013–2020): theatrical, layered magical-realist narrative about debt and labour.
- [bg] *Overboard!* (inkle, 2021): a short replayable murder-mystery from the culprit's perspective.

### Inferences (PROPOSALS)

**M32. Historian's Thought Cabinet (from *Disco Elysium*).** PROPOSAL.
- *How it works:* Over the programme the learner "internalises" historiographic lenses, such as "The publisher is the author", "Follow the material", "Who is missing from the credit line?" and "Whose calendar?". An equipped lens changes what the Atlas highlights. For example, "Follow the material" brings pigment and paper edges forward, and "Who is missing" makes anonymous-labour nodes glow.
- *What it teaches:* The programme's method made explicit and reusable across all 35 units.
- *Scope/cost:* medium. It is a filter layer on the Atlas.
- *Risk:* Low. This is one of the strongest Atlas-wide ideas.

**M33. Workshop clocks (from *Citizen Sleeper*).** PROPOSAL.
- *How it works:* Inside M1, progress clocks for "carving the key block", "proofing" and "censor approval" fill over days, while the edict clock (M7) ticks independently. Pressure comes from time and dependencies, not randomness. Dice are optional and can be skipped.
- *What it teaches:* Production time, sequence dependencies, and the risk of a ban landing mid-run.
- *Scope/cost:* small.

**M34. Scarcity with dignity (from *This War of Mine*).** PROPOSAL. Use only where documented.
- *How it works:* E.g. a publisher's household after a fine (Tsutaya's fine in the 1790s), or a carver's piece-rate economics. Resource choices are kept low-key and sourced.
- *What it teaches:* The economics of makers' lives.
- *Scope/cost:* small.
- *Risk:* High risk of melodrama and invented suffering. Never apply it to the Yoshiwara.

### Gaps
- All six narrative-game facts above except *Pentiment* are [bg].
- No source checked on Twine-based history pedagogy. A search on "Twine history classroom" would help.

---

## 7. Spatial and 3D toys: what 2.5D/3D feel fits a woodblock-print world?

### Takeaway
Ukiyo-e is built from flat colour planes, layered depth (extreme foreground, mid-ground, distant Fuji) and key-block outlines. That makes **2.5D layered planes**, as in *Old Man's Journey*, a better fit (and cheaper) than a full 3D open world like *Rise of the Rōnin*'s Edo. The learner can literally reshape the depth layers of a Hiroshige view to make a path, which teaches composition while staying within a zero-cost web budget.

### Cited Findings
- *Old Man's Journey* (Broken Rules, 2017; mobile and PC, consoles 2018–19): the core puzzle is clicking and dragging hillocks to change landscape height, joining foreground and background so the character can cross. Story is told in "short, single-shot animations" without dialogue. It won Apple's iPad Game of the Year and an Apple Design Award, plus festival awards (Taipei Game Show, IGF) for visual art and narrative. — [Wikipedia: Old Man's Journey](https://en.wikipedia.org/wiki/Old_Man%27s_Journey)
- Behind-the-scenes and IGF interviews on its hand-crafted layered landscapes. — [TouchArcade](https://toucharcade.com/2017/05/16/old-mans-journey-development/); [Game Developer, Road to the IGF](https://www.gamedeveloper.com/design/road-to-the-igf-broken-rules-i-old-man-s-journey-i-)
- *Rise of the Rōnin* builds open-world Bakumatsu Edo, Yokohama and Kyoto in full 3D at AAA scale (Team Ninja). — [Wikipedia](https://en.wikipedia.org/wiki/Rise_of_the_R%C5%8Dnin); [PlayStation Blog](https://blog.playstation.com/2024/02/08/inside-look-rise-of-the-ronins-recreation-of-late-1800s-japan/)
- *Pentiment* shows that a 2D, period-print-styled aesthetic ("illuminated manuscripts, woodcut prints") can carry a critically noted historical game. — [Obsidian](https://www.obsidian.net/news/obsidian/obsidian-entertainment-announces-pentiment)
- [bg] *Monument Valley* (ustwo games, 2014): impossible-geometry isometric puzzles that rotate perspective.
- [bg] *Townscaper* (Oskar Stålberg, 2020) and *Islanders* (Grizzly Games, 2019): low-stakes, procedurally-assisted building toys. *Dorfromantik* (Toukana Interactive, 2022 full release): hex-tile landscape placement that rewards matching edges.
- [bg] *Gorogoa* (2017), *Florence* (Mountains, 2018) and *Before Your Eyes* (GoodbyeWorld, 2021): interaction tied to image composition, gesture and blinking (webcam) respectively.
- [bg] *GRIS* (Nomada, 2018), *Unravel* (Coldwood, 2016) and *Ori* (Moon Studios, 2015/2020): painterly layered 2.5D platformers.
- [bg] *Muramasa: The Demon Blade* (Vanillaware, 2009): hand-painted, ukiyo-e-inflected 2D side-scroller. *Ōkami* (2006): sumi-e/ukiyo-e-styled 3D with ink outlines. *Kunitsu-Gami: Path of the Goddess* (Capcom, 2024): Japanese folk-ritual aesthetic.

### Inferences (PROPOSALS)

**M35. Step into the View: layered-plane print worlds (from *Old Man's Journey*).** PROPOSAL. This is the recommended form for the "animated 3D game" ask.
- *How it works:* A Hiroshige *Hundred Famous Views of Edo* print (Uoya Eikichi, publisher) is separated into 4–6 depth planes:
  - extreme foreground, e.g. the famous close-up branches or eagle;
  - mid-ground figures;
  - water or bridge;
  - distance;
  - sky gradient (bokashi).
  Rendered in three.js with parallax, the camera can drift slightly "into" the print. Puzzles: drag planes to align a path, or reorder planes to discover the composition rule (dramatic foreground cropping), which Western artists later borrowed (Act IV).
- *What it teaches:* Ukiyo-e composition, the printed colour layers (the planes echo the colour blocks), and Japonisme's borrowing of this composition.
- *Scope/cost:* medium for 3–5 prints. Plane separation from open-access images is manual image work, and three.js is free.
- *Risk:* Over-animating a historical object can misrepresent it. Always offer "return to the flat sheet" with the full object record, and label the separation as a reconstruction.

**M35a. Tile the road (from *Dorfromantik* / *Islanders*).** PROPOSAL, variant.
- *How it works:* Station tiles of the Tōkaidō or pieces of the Nagasaki trade network. Matching edges are real connections (river, road, sea lane).
- *Scope/cost:* medium.
- *Risk:* The pleasure loop can overwhelm the content. Keep it short.

**M35b. Impossible frames (from *Monument Valley* / *Gorogoa*).** PROPOSAL, variant.
- *How it works:* Zoom into a print to find another print inside it (fan prints, prints-within-prints, *mitate* parody). A rotation or zoom reveals the reference.
- *What it teaches:* Visual quotation and the layered literacy of Edo audiences.
- *Scope/cost:* medium.
- *Risk:* Puzzle cleverness can overshadow evidence. Use sparingly.

**Recommendation on "animated 3D".** PROPOSAL.
- *The Atlas globe/map:* lightweight 3D (three.js or a deck.gl-style globe) with ink-wash shaders and the M24 guiding breeze.
- *The Edo unit's set-pieces:* 2.5D layered planes (M35) plus 2D tactile toys (M17–M19).
- *Out of scope:* a walkable 3D Edo at *Rise of the Rōnin* scale is incompatible with a zero-cost programme and adds little learning. A single small 3D diorama, a publisher's shopfront with stacked prints, a sign and censor-seal proofs, built in low-poly with flat print textures, would be a medium-cost "hub" scene for Acts I–III.

### Gaps
- The Broken Rules technical approach (layer authoring pipeline) was not read in full. The TouchArcade and Game Developer pieces should be checked for workflow.
- No source checked on web performance budgets for three.js parallax scenes on low-end mobile devices.
- The remaining [bg] spatial-game facts need verification.

---

## 8. Existing ukiyo-e / Japanese-art games and edu-games

### Takeaway
Existing ukiyo-e games are mostly **theme over process**:
- *Ukiyo-e* (2025) is a light set-collection card game about Japonisme dealers.
- *Hokusai* (Ludens Spirit) is a rondel/colour-building euro.
- *Ukiyo-e Heroes* applies the craft to game fan-art rather than the reverse.

No game found teaches the publisher economy, censorship-as-market or seal-based dating. That is the gap Creative World can fill.

### Cited Findings
- *Ukiyo-e* (2025, Sato & Schacht): dealers holding exhibitions after the 1867 Paris Exposition sparked Japonisme. A light, BGG-weight-1.0 set game. — [BGG](https://boardgamegeek.com/boardgame/444752/ukiyo-e)
- *Hokusai* (Melyna & Pacheco, Ludens Spirit): rondel, colour building, set collection, tile placement. — [Tabletopia](https://tabletopia.com/games/hokusai-board-game)
- *Tokaido* (Bauza, Funforge, 2012): the Tōkaidō journey as a reflective set-collection game. — [Meeple Like Us](https://www.meeplelikeus.co.uk/tokaido-2012/)
- *Edo* (Queen Games, 2011, Stefan and Louis Malz). — [BGG News](https://boardgamegeek.com/blog/1/blogpost/5874/new-game-round-up-a-slew-of-titles-from-rio-grande)
- *Ukiyo-e Heroes*: Jed Henry and David Bull, real woodblock prints of video-game scenes since 2012. — [Tools and Toys](https://toolsandtoys.net/ukiyo-e-heroes-video-game-woodblock-prints)
- Hyperallergic covered video-game-themed ukiyo-e art ("The Literal Floating World of Video Games in Ukiyo-E Art"). — [Hyperallergic](https://hyperallergic.com/the-literal-floating-world-of-video-games-in-ukiyo-e-art)
- itch.io hosts a free educational *Ukiyo-e Woodblock Printing* browser game, details unread. — [itch.io](https://itch.io/games-like/821276/ukiyo-e-woodblock-printing)
- *Rise of the Rōnin* (2024): Bakumatsu Yokohama, Edo and Kyoto open world. — [Wikipedia](https://en.wikipedia.org/wiki/Rise_of_the_R%C5%8Dnin)
- *Ghost of Yōtei* (Sucker Punch) includes sumi-e painting collectibles. — [Gamepressure](https://www.gamepressure.com/ghost-of-yotei/sumi-e/z611aa2)
- *Sakuna: Of Rice and Ruin*: realistic rice-cultivation sequence. — [Agriculture Monthly](https://agriculture.com.ph/2020/12/10/rice-planting-game-is-so-realistic-players-visit-japans-ministry-of-agricultures-website-for-walkthrough/)

### Inferences
- PROPOSAL: Treat *Ukiyo-e* (2025) and *Hokusai* as "further play" links on the Act IV and Act II pages respectively. Low cost, and they signal cultural currency.
- PROPOSAL: Use *Rise of the Rōnin*, *Ghost of Yōtei* and *Ōkami* only as reception examples ("how games picture Edo") in a media-literacy sidebar, not as models, because their Edo is combat-centred and fictionalised.
- Inference: Because no competitor teaches the publisher, censor and seal system, the M3 + M9/M10 + M28 combination is the most distinctive "award-level" contribution. It is grounded in documented evidence and uses mechanics proven in award-winning games: *Papers, Please* and *Obra Dinn* both have strong award records (Obra Dinn's IGF Seumas McNally Grand Prize is [bg]; the Wikipedia awards table excerpt lists the "Grand Prize" lineage but was not read in full).

### Gaps
- Not checked: Japanese-language searches (浮世絵 ゲーム, 版元 シミュレーション, 摺師 ゲーム) and Japanese museum digital programmes (Tokyo National Museum, Edo-Tokyo Museum, Ōta Memorial Museum, Adachi Foundation, Ritsumeikan ARC ukiyo-e database). These are the most likely place for missed prior art.
- Google Arts & Culture ukiyo-e projects were not verified.
- *Muramasa*, *Kunitsu-Gami* and *Ōkami* facts are [bg].

---

## 9. Keeping it honest, and combined systems (Atlas-wide meta-game across 35 units)

### Takeaway
The cited designers give three reusable honesty patterns:
1. Do not confirm too early, and let interpretation change with evidence (Ingold on *Heaven's Vault*).
2. Gate confirmation so it cannot be brute-forced (*Obra Dinn*'s threes; *Golden Idol*'s "two or fewer wrong").
3. Accept that some questions have no single answer (*Pentiment*).

Combined with "what actually happened" reveals and per-claim confidence tags, these let the programme gamify reasoning without fabricating history.

### Cited Findings
- "Archaeology is not about getting things 'right'... you have to be open to changing your interpretation if new evidence comes to life." — [Game Developer: Heaven's Vault](https://www.gamedeveloper.com/business/road-to-the-igf-inkle-s-i-heaven-s-vault-i-)
- *Golden Idol*'s anti-brute-force partial feedback ("two or fewer slots are incorrect"). — [Game Developer](https://www.gamedeveloper.com/design/case-of-the-golden-idol)
- *Obra Dinn* confirms fates only in sets of three, and accepts multiple solutions for some deaths. — [Thinky Games](https://thinkygames.com/games/return-of-the-obra-dinn); [Wikipedia](https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn)
- *Pentiment* never explicitly reveals the murderer. — [Obsidian forums](https://forums.obsidian.net/topic/125999-pentiment-josh-sawyers-upcoming-historical-murder-mystery-rpg-set-in-16th-century-europe)
- Pope: the emotional weight of *Papers, Please* came from mechanics, not explicit messaging. — [Wikipedia: Papers, Please](https://en.wikipedia.org/wiki/Papers,_Please)
- Progress-as-knowledge in *Outer Wilds*. — [Steam FAQ](https://steamcommunity.com/sharedfiles/filedetails/?id=2160452487)

### Inferences (PROPOSALS): honesty rules for every mechanic
1. **Reveal card**: every choice-based mechanic ends with "What actually happened", with citations and a confidence tag (confirmed / likely / contested / unknown).
2. **Counterfactual label**: any simulated outcome that did not happen is labelled "counterfactual" and links to the counterfactual-history unit.
3. **Reconstruction label**: colour separations, plane separations and composite journeys are labelled "reconstruction" or "composite", with sources.
4. **No invented people or events**. Typical examples (e.g. "a printer's day") are labelled typical.
5. **Content rules**: Yoshiwara material appears only as content-noted, non-interactive text. Shunga is named only. Censor-desk cards never include courtesan images.
6. **No points, streaks or leaderboards.** Progress is shown as filled ledgers, confirmed catalogue cards and Atlas density.

### Combined systems (PROPOSALS)

**C1. "The Hanmoto's Year": the Edo unit game.** Combines M1 + M2 + M3 + M4 + M5 + M7 + M33, with M17 as the hands-on interlude.
- *Structure:* Each of the five Acts is one "year" at the publisher's desk:
  - Act I (Tsutaya, 1790): the censor desk appears, with the kiwame seal and a fine.
  - Act II (Eijudō): the Prussian blue market falls (M2) and the learner prints the Wave (M17).
  - Act III (1842): the Tenpō edict lands mid-run (M7 + M33), then the 16-mon knapsack (M4), then Kuniyoshi's 8,000-set reveal.
  - Act IV: the dealer's crate (M20) and the supply line drawn outward (M6).
  - Act V (2024 thousand-yen note): a closing *Timeline* placement (M28) of the Wave from 1831 to the note, and the learner's ledger is compared with the real publishers' choices.
- *Learning carried:* the publisher as decision-maker, censorship as market force, material price as an enabling condition, reception abroad, and the afterlife of an image.
- *Scope/cost:* medium overall. 2D web; one optional 2.5D set-piece (M35) for Hiroshige in Act III.
- *Risks:* Length. Each Act should stay under ~10 minutes of play, and the five bet cards (M5) are the minimum viable version.

**C2. "The Rumour Atlas": the Atlas-wide meta-game across 35 units.** Combines M22 + M29 + M30 + M32 + M28 + M24 + M26.
- *Structure:*
  - The Atlas graph is the save file. Every unit "lights" specific nodes and edges once its evidence task is done.
  - The Cast Codex (M29) and the Cabinet (M30) are the two personal collections. Both are evidence-gated.
  - The Historian's Thought Cabinet (M32) is the meta-skill tree: the programme's lenses (follow the material, who is missing, whose calendar, who paid, where did it travel), each earned in the unit that teaches it.
  - The cohort appears as quiet density on the map (M26), e.g. edges many peers have lit glow softly, with no names or ranks.
  - A final "constellation" view replaces a score: the learner's own web of makers, routes and institutions, exportable as a portfolio piece.
- *Learning carried:* the core thesis that making is a web, and transfer of method across world chapters.
- *Scope/cost:* medium–large, mostly data modelling and per-learner state on the existing graph.
- *Risks:* Checklist-ism. Mitigate with no percentage meter, a prompt to annotate edges in the learner's own words, and contested edges (M15) that cannot be "completed".

**C3. "Making to Know" workshop engine**, reused by the reconstruction units. Combines M17 + M18 + M19 + M21 + M8.
- *Structure:* A generic process-toy framework: ordered steps, tactile inputs, visible errors, a labour-time counter, and each step linked to real craft footage. Edo woodblock is the first instance. The same engine could carry casting or forging (Africa/metallurgy), spinning, knotting or weaving (Americas/fibre), resist-dyeing or block-printing cotton (South & SE Asia), and lashing or navigation (Pacific).
- *Learning carried:* embodied process knowledge, and labour time made visible.
- *Scope/cost:* large overall, small–medium per instance once the engine exists.
- *Risks:* Cultural process knowledge must be sourced from and credited to practitioners. Some knowledge, e.g. Pacific wayfinding, may not be appropriate to simulate.

**C4. "The Catalogue Desk" attribution engine**, reused by the attribution, copying and counterfeit, museums and provenance, and re-timing units. Combines M9 + M10 + M11 + M12 + M14 + M15 + M28.
- *Structure:* A shared zoomable-image evidence viewer, a word-harvest catalogue card, batch confirmation, provisional readings tied to confidence, a provenance search box, a state-comparison slider and a timeline. Every unit supplies its own object set and answer data.
- *Learning carried:* evidence-to-claim reasoning, the programme's confidence vocabulary, and dating and provenance skills.
- *Scope/cost:* medium for the engine, small per object set.
- *Risks:* Answer data quality, so use museum-verified metadata. Disputed attributions use M15.

**C5. "Carry It": route journeys for the world chapters and networks unit.** Combines M23 + M6 + M25 + M24.
- *Structure:* Each world chapter has one documented journey of an object across the 3D globe, with time and cost pressure and gatekeeping institutions (a port, a guild, a waqf caravanserai, a censor). The Edo instance is blue-in / prints-out.
- *Learning carried:* routes and institutions as co-authors of objects.
- *Scope/cost:* medium per journey.
- *Risks:* Composite fiction. Strictly label sources and uncertain legs.

**Suggested build order** (inference, cost-led): M28 Seal Timeline → M5 Bet cards → M10 Catalogue Card → M3 Censor's Desk → M22 Rumour Atlas basics → M17 Print the Wave → M35 Step into the View. The first four are small and HTML-only, and between them they deliver the unit's distinctive learning before any 3D work.

### Gaps
- Not searched this session: the game-studies or educational research literature on the effectiveness of these mechanics in history teaching (e.g. studies of *Papers, Please* in classrooms, or of museum attribution games). Recommend a follow-up search in Scite or Consensus.
- No GDC Vault talks were retrieved (e.g. Lucas Pope on *Obra Dinn*, inkle on *Heaven's Vault*, Mobius on *Outer Wilds*). These would add designer-level rationale.
- Consolidated list of [bg] game facts needing verification before publication: *Game Dev Tycoon*, Kairosoft, *Offworld Trading Company*, *Patrician*/*Port Royale*, *Concordia*, *Mini Metro*/*Mini Motorways*, *Frostpunk*, *Her Story*, *Strange Horticulture*, *Gorogoa*, *Inkulinati*, *A Little to the Left*, *Assemble with Care*, *Unpacking*, *Ōkami*, *Spiritfarer*, *Cozy Grove*, *Ooblets*, *80 Days*, *Sunless Sea*, *Ghost of Tsushima*, *Sable*, *Sea of Thieves*, *Hades*, *Wingspan*, *Animal Crossing: New Horizons*, *Slay the Spire*, *Inscryption*, *Hearthstone*, *Disco Elysium*, *Citizen Sleeper*, *This War of Mine*, *Kentucky Route Zero*, *Overboard!*, *Monument Valley*, *Townscaper*, *Islanders*, *Dorfromantik*, *Florence*, *Before Your Eyes*, *GRIS*, *Unravel*, *Ori*, *Muramasa*, *Kunitsu-Gami*, and *Ghost of Yōtei*'s date and setting.
- Edo historical figures used in the proposals are from the project brief and were not re-verified here.

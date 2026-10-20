Score: 3/5

Board review, round 2: "The shoe" (Ballet, 1 of 4), v2. Reviewer: dance historian. Read: `_page-v2.md`, the built page and 1440 screenshot, the register at revision 2. Checked at source: Spitalfields Life, "The Pointe Shoe Makers of Hackney" (16 July 2013); Spitalfields Life, "At Freed of London Ltd" (16 May 2013); Heritage Crafts.

**Verdict.** The three round-1 killers are gone: the maker's-mark legend is withdrawn and replaced by a maker's own words; the 42 hours is labelled for what it is and the strike that did not happen is no longer said to have happened; the page now names makers and the thesis is stated as a claim about who writes names down, which is defensible. The sections on the factory and the company's money are now citable with the page's own labels. The chronology is not: it still rests on *Pointe Magazine* and Wikipedia, still gives the textbook "from Italy" line, and still names none of Brugnoli's rivals while calling the priority contested. And v2 has introduced two errors of its own about named living people and dropped one of Freed's own figures that contradicts the one it keeps. Not yet 4.

## Issues

### Remaining or new, in rank order

**1. (New, high) Ozel Ahmed is placed in the finishing rooms and counted among the women; neither is in the source.**
> "In the finishing rooms, where the shoes are bound and paired, the people the visit named were women: Sheila Goodman, a finisher of about forty years, and Ozel Ahmed, a supervisor."

The May 2013 article names Ozel Ahmed as "Supervisor of the theatrical shoes department", twenty years at Freed, not the finishing room; it does not give a gender and the name (Özel) is used for men and women. The finishing-room people the article actually names are Varsha Bahen (finisher), Rashimi Patel (pairing) and Luthu Miah (supervisor, binding room). The page asserts a named living person's sex and workplace without a source, in the sentence that carries its gender argument.
*Fix:* "the people the visit named were Sheila Goodman, a finisher of about forty years, Varsha Bahen, a finisher, and Rashimi Patel, who pairs the shoes; the makers at the benches, in both visits, were men." Correct `people.ozel-ahmed` to "supervisor, theatrical shoes department". Source: https://spitalfieldslife.com/2013/05/16/at-freed-of-london-ltd-ballet-theatrical-shoemakers/

**2. (New, high) Freed's own 2015 figure of about 160,000 pairs has been dropped, so "Freed itself says 250,000" hides that Freed has said two different things.**
> "Freed itself says it makes about 250,000 pairs a year; visitors have reported 150,000 in 2013 and 333,000 in 2019."

pass2_body 1.2 records Freed's own 2015 introduction film, as reported by *Dance Spirit* (9 Jul 2015): "48,000 standard and 112,000 custom pairs per year, about 700 pairs a day", that is 160,000, and calls it "the only one from the maker". The v1 register had 160,000 as the value; revision 2 has removed it. The sentence now reads as if the company is consistent and only visitors disagree. That is the opposite of what outcome 3 teaches.
*Fix:* "Freed's own figures run from about 160,000 pairs a year in its 2015 film to 'nearly 250,000' on its website; visitors have reported 150,000 in 2013 and 333,000 in 2019." Restore the 2015 alternate with source `dancespirit-2015` (https://dancespirit.com/your-moment-of-dance-zen-freeds-mesmerizing-pointe-shoe-video/).

**3. (Remaining, medium) The pointe chronology still has no scholarly source and names no rival.**
> "Amalia Brugnoli rose onto the tips of her toes on a Vienna stage in 1823, in soft slippers held by strength alone; whether she was the earliest is contested."

Better placed hedge, same evidence base: *Pointe Magazine* (which, the editor note admits, does not say Vienna) and Wikipedia. "Contested" with no contestant teaches nothing. Geneviève Gosselin (Paris, c. 1815) is in the register's alternates and not on the page; the 1821 Waldeck lithograph of Fanny Bias in *Flore et Zéphire* is the earliest image of pointe and is absent. Hammond, "Searching for the Sylph", *DRJ* 19/2 (1987–88) and Guest, *The Romantic Ballet in Paris*, are named in the editor note as "sources to add" and have not been read.
*Fix:* "Geneviève Gosselin in Paris by about 1815, Fanny Bias in a lithograph of 1821, Amalia Brugnoli in Vienna in 1823: who was earliest depends on what counts as pointe, a held pose or a danced phrase." Read Hammond; cite her. https://www.cambridge.org/core/journals/dance-research-journal/article/searching-for-the-sylph-documentation-of-early-developments-in-pointe-techninque/573B15DC8BF3CA8D0899B1BC76EEBAFF

**4. (Remaining, medium) "From Italy, half a century later" is still the one-line textbook account.**
> "The block that made it safer came half a century later, from Italy."

Round-1 issue 8, unaddressed except for "safer". The hardening was gradual (1880s–1900s), carried into St Petersburg by Italian virtuose (Zucchi 1885, Legnani 1893) whose stiff shoes the Russians at first mocked, and finished by Pavlova's reinforced box and inset sole, which pass2_body has and the page drops. Register: `pointe-2020` only, "no primary seen".
*Fix:* "The box hardened by stages between the 1880s and the 1900s, carried from Milan to St Petersburg by Italian virtuose and reworked by Pavlova; that is the standard account, not yet checked at source."

**5. (New, medium) The register's provenance for the headcount is wrong.**
`bal-makers-count` files the 1990 *Christian Science Monitor* figure (about 40) and the 2021 Business Insider figure (24) under `sources: [spectator-2019]`, with "URL not captured". The CSM URL was in my round-1 review: https://www.csmonitor.com/1990/0111/pfreed.html. A record that attributes a 1990 count to a 2019 article is the kind of error the register exists to prevent.
*Fix:* add `csm-1990` as a source; move the alternate to it; add George Gorgiou (25 years at the bench in 1990, his father a maker for Fonteyn) to `people`: he is the only two-generation maker in the record and still unused.

**6. (New, medium) The figure caption overclaims its source, and the drawing mixes a tool with the finished object.**
> Caption: "Schematic, drawn from the makers' descriptions"

The makers' descriptions (both Spitalfields pieces) do not mention the last, the pleats, the hammering of the sole or the shank's position; those come from Wikipedia and 4dancers. The section also shows the last inside a finished shoe, so the student sees a cross-section that never exists: the last is removed before the shoe is worn. The shank is drawn as a dashed line in the sole; in a turn shoe it sits inside, over the insole.
*Fix:* Caption "Schematic, from published descriptions of the turn-shoe method; not to scale." Either draw the shoe on the last (a stage of making) or the finished shoe in section (an object), not both; move the shank inside.

**7. (New, low-medium) The construction paragraph puts the steps in the wrong order.**
> "a pointe shoe begins as a satin upper pulled over a last ... Inside the toe the maker builds the block ... The shoe is made inside out, then turned the right way round"

In the turn-shoe method the upper goes on the last inside out and the block is built up on what will become the inside; the prose has the reader picture the block built inside a right-way-round upper and then learn, two sentences later, that it was inside out all along.
*Fix:* Lead with "inside out": "begins as a satin upper pulled inside out over a last ... the block is built up on it ... the shoe is turned, and the sole pasted and hammered on."

**8. (Remaining, medium) "Pointe is a women's technique" is a historical claim stated as a natural one.**
> "Pointe is a women's technique, so this unpaid hour is women's work almost without exception."

"Almost without exception" is fair as proportion. "Pointe is a women's technique" is not: men danced on pointe in the grotesque tradition before Taglioni, Nijinska says her brother could, Ashton put Bottom on pointe in *The Dream* (Royal Ballet, 1964), the Trockadero have danced on it since 1974. The gendering is a product of the 1830s, which is the point a history-of-making page should make, and it is also not true that only pointe shoes need sewing: men sew their own elastics too.
*Fix:* "Since the 1830s pointe has been coded female, so this unpaid hour is, almost without exception, women's work."

**9. (New, low) The Heritage Crafts reason is misread.**
> "Its reason is not a lack of demand but the supply of materials and the closing of workshops."

The page's viability section gives: fewer independent dance *shops* (retailers, after COVID), materials harder to source, and material prices. Not workshops.
*Fix:* "the supply and price of materials and the loss of the dance shops that sold the shoes." https://www.heritagecrafts.org.uk/pointe-shoe-making/

**10. (New, low) Ray's two interviews disagree and the page picks one silently.**
> "Ray, whose mark is the crown, had made shoes in the Hackney factory for twenty-six years ... He told them he makes forty pairs a day"

May 2013: 24 years, 41 pairs; July 2013: "I have been here for twenty-six years", 40 pairs. The register records the May figures as alternates; the page does not. For a page whose third outcome is telling a record from a self-report, the disagreement is the lesson, not a nuisance. "Had made shoes in the Hackney factory for twenty-six years" also overstates "here for twenty-six years".
*Fix:* "had been at Freed, by his own count, twenty-four or twenty-six years, depending on which of two visitors that year asked".

**11. (Remaining, low) The pay system is in the research and not on the page.**
> "The one number missing from every account is what a maker is paid for a pair."

pass2_body 1.6: makers work "at an individual bench on piecework". The page can say the system (paid by the pair) and that the rate is unrecorded; as written it implies even the system is unknown.
*Fix:* "They are paid by the pair. What a pair pays is in no account."

**12. (Remaining, low) "One firm has sold a moulded plastic shoe since 1993" is twice wrong.**
Gaynor Minden's shoe is satin, suede and foam with a moulded elastomer shank and box, not "a plastic shoe"; and others have since sold thermoplastic shanks (Bloch TMT B-Morph).
*Fix:* "one firm has sold a shoe with a moulded plastic shank and box since 1993, and others have copied it".

**13. (Remaining, low) The Russian workshops are still absent.**
> "it was a news agency, not the firm, that named Sergei Murza at his bench at Grishko in Moscow"

Good sentence; but the page still treats Grishko as Moscow's Freed. The Bolshoi and Mariinsky made their shoes in-house for a century; the firms came out of those workshops after 1991 (R-Class, 1991, founded by the Bolshoi's shoemaker Roman Kukushkin, *Moscow Times* 2011, in pass2_body 1.6). One clause.

**14. (Low) "Near the Metropolitan Opera from 1887."** The old Metropolitan Opera House, Broadway and 39th Street, demolished 1967; a student will picture Lincoln Center. Say "the old".

**15. (Low) 1920 or 1929.** The register now carries Spitalfields' "founded in 1920 in St Martin's Lane" as an alternate and Heritage Crafts says "1920s"; the page gives 1929 flat. Cecil Court runs off St Martin's Lane, so this may be one shop and one wrong date; say "1929 by the firm's own account".

**16. (Low) Not used, and should be.** The July article's detail that ballerinas "have been known to scratch off a Maker's symbol so he works exclusively for them" is the best single sentence on the mark anyone has recorded; and Darren Plume, quality controller, who checks every shoe each morning, is a named man between the bench and the company.

## Length

1,124 words does not drag; the page reads in one sitting and the maker section earns its length. The two places that double up are the figure plus the construction paragraph (fix 6 and 7 and cut one of the two descriptions of the pleats) and the "Then the firms" list, which is a register dump in prose. Cut the list to "Then the firms, with their founders' names on the door: Capezio 1887, Freed 1929, Grishko 1988 or 1989, Gaynor Minden 1993" and move the Dora Freed and patent detail into the register. That recovers about 120 words.

## What I would change next

1. Fix 1 and 2 today: both are errors the page itself would call out in someone else's work.
2. Read Hammond and Guest and rewrite the chronology paragraph from them (issues 3, 4); until then, mark the chronology section `probable` at the top of the section, not sentence by sentence.
3. Repair the register's provenance (issue 5), add Gorgiou, and restore the 2015 Freed figure; then the register is ready for a spot-check sample.

## Keep

The maker section as a whole: Ray's words, the marks, the training period, the finishing rooms, the Grishko names, "you learn the name behind it from a journalist, if at all". The strike corrected to a notice lifted. The three hedges that now sit on the right nouns: Taglioni's shoes "by the usual account", Grishko "a contested year", the priority rather than the date for Brugnoli. The closing line on the price of a maker's hour. The rewritten outcomes, which the page now meets.

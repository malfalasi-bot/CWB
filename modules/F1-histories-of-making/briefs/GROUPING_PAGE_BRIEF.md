# Brief: writing a grouping page for the F1 Atlas

F1 "Histories of making" is the first module of a self-paced design-education web app (designers, brand people, founders, commissioning clients). Its Atlas holds nodes (objects, places, people, practices, techniques…) and groupings (cultures, polities, networks, movements, horizons, institutions, civilisation-names…). Every grouping gets a page that tells it as a story. Three pages already exist as the pattern — Mingei (movement), Nok (archaeological culture), the Igun Eronmwon guild (maker community) — in the Claude Docs document "F1 Groundwork" (project id 6d02bdf9-1689-4a2b-b1fe-258e11817b83, prose node 65518300-dfe7). Read them with the Claude Docs `read` tool if it is available to you: first `{"projection":"outline"}`, then `{"kind":"view","parentId":"<table id>"}` for each Card and Walk table under the three "Grouping page" headings. If you cannot read the doc, follow the structure below exactly.

## Page structure (markdown)
1. `## Grouping page: <name>` then one lead sentence (the point, ≤ 25 words).
2. **Card** — a table: Kind · Defined by (who, when) · Span · Places · Membership confidence · Leaves out · Rights line (what may be shown and from where).
3. **Walk** — a table of 6–9 steps: # · Step title · What the learner sees and reads (2–3 sentences) · Nodes (canon IDs where they exist, e.g. NET002, PLC114; objects as "Met 1985.xxx" only if you verified the record) · Claim and confidence (documented / probable / contested / interpretive).
4. **Members** — one paragraph counting members by type, naming the key ones.
5. **Neighbours** — the groupings it defined itself against and parallel groupings elsewhere.
6. **Afterlives** — revivals, living practice (dated to its source, e.g. "in 2024…"), how it is sold or remembered.
7. **What is argued** — 2–4 bullets, each giving both readings with sources.
8. **Apply** — the unit that uses it, with a Maker (M) and a Briefer (B) task.
9. **Candidate open objects** — up to 8 real records you verified, each: holder, accession/ID, date range, licence as the holder states it (CC0 / public domain / CC BY…), the 1970 provenance status if the record states acquisition history, and the record URL. Only commercially reusable licences (CC0, PD, CC BY, CC BY-SA, KOGL Type 1). If none exists, say so and propose the living practice, a drawing of our own, or a link-out instead.
10. **Sources** — the pages you actually opened, as [title](url).

## Rules (the program's writing standard — apply all)
1. Start from the object, the place or the person, not the category. 2. First sentence of each step ≤ 16 words. 3. Say who made it even when unnamed ("casters of the guild", not "Benin bronze"). 4. Dates as ranges with the source's qualifier. 5. Confidence grammar: documented stated plainly; probable = "probably"/"most specialists"; contested = "argued", both readings; interpretive = "we read it as". 6. "Earliest known", never "first". 7. Name violence plainly; perpetrators' terms in quotation marks, attributed. 8. Community's own name first. 9. Never "primitive", "tribal", "lost civilisation", "exotic", "mysterious", "discovered" (for places people knew). 10. Date living practices to their source. 11. Admit what is not known. 12. Each tier true on its own. Also: human beings are never described as goods or cargo (content note where enslaved people appear); sacred, secret and funerary material and human remains are never shown (grave goods only with origin and a content note, never where a descendant community objects); "civilisation" is a search label that opens onto groupings beneath it, never ranked, no rise-and-fall unless evidenced. No AI filler ("rich tapestry", "testament to", "stands as"). Plain words, sentences under 25 words.

## Canon
The canon register (IDs to cite) is at /tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/f1-scope/canon/canon_*.csv. Use grep to find the rows for your grouping and its members; cite their IDs.

## Tools
Use WebSearch/WebFetch for research (the shell cannot reach websites). Museum APIs: Cleveland (openaccess-api.clevelandart.org), the Met (collectionapi.metmuseum.org — the Met's public-domain search filter returns non-public-domain objects, so check `isPublicDomain` on each record), AIC (api.artic.edu). WebFetch may cache or strip query parameters; if a query returns the wrong thing, you may use the Firecrawl scrape tool with `formats:["rawHtml"]`, but no more than 15 Firecrawl calls in total (they cost the user credits).

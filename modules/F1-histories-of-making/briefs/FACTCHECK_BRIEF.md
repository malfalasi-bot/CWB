# Brief: F1 fact-check sweep (template step 14), 3 October 2026

You are checking one group of F1 unit specs. The specs are in
`/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/f1-scope/specs/`.
Each spec has a numbered claims list (section 3), open objects (section 4/5), a readings and risks section, and a fact-check list (section 10).

Read first:
- `/home/claude/creative-world/modules/F1-histories-of-making/AUDIT_2026-10-02.md` §1.3 (the fact-check gate, its order of priority and the weak-source table) and §1.5 (register fill).
- `/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/voice/VOICE_GUIDE.md` (any wording you change follows it).
- The program rules in the specs: "earliest known", never "first"; the community's own name first; people are never goods; confidence stated in words (documented / probable / contested / unverified); open licences only (CC0, public domain, CC BY, CC BY-SA, KOGL Type 1).

## What to do, per spec

1. **Run every item in section 10** at source. Priority: UNESCO claims (UNESCO's own page), living people and endonyms, licences (the holder's own record or terms page), then claims resting on weak sources (Wikipedia, Britannica summaries, dealer sites, news aggregators) — replace those with a scholarly, primary or holder source. Then spot-check the numbered claims in section 3 that carry dates, numbers, names or "earliest".
2. **Mark each section-10 item** in place with one of: `✔ verified 3 Oct 2026 — <URL>`; `✎ corrected 3 Oct 2026 — <what changed> — <URL>`; `? unverified 3 Oct 2026 — <why: blocked, paywalled, not found>`. Keep the item's original text.
3. **Fix the spec** wherever a claim, date, name, licence or source is wrong: edit the claim in place and lower or raise its confidence word if the evidence warrants it. Do not delete claims; if one cannot stand, mark it `unverified` and say so in its confidence note.
4. **Do not touch** cultural-note, content-note or reader wording added by the AI reader passes (lines citing AR-xxx) unless a fact inside them is wrong; then fix only the fact and say so in your report.
5. **Add one section-9 line** to each spec: "Fact-check sweep, 3 October 2026: N verified, N corrected, N unverified; see section 10."
6. **Register rows.** Write two CSVs for your group into `/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/register/` (create the folder if needed):
   - `claims_<group>.csv` with header `id,unit,topic,claim,confidence,confidence_note,source,from` — one row per numbered claim in section 3 of every spec in your group, after your fixes. `id` = `<unit>-C<nn>` (e.g. `F1.5-C07`); `source` = short citation plus URL where the spec has one; `from` = `spec v3`.
   - `world_<group>.csv` with header `id,kind,status,title,date,holder,accession,licence,holder_and_licence_note,provenance,provenance_test,test_basis,history_gap,action,units,roles,verified_in,met_object_id` — one row per open, held or linked object the spec names. `id` = `<unit>-O<nn>`; `kind` = `object`; `status` = open / held / link-out / excluded as the spec says; `verified_in` = `fact-check 3 Oct 2026` if you opened the holder record, else `spec v3`.
   Quote CSV fields properly (use Python's csv module).

## Tools and rules

- The session's WebSearch budget may be used up. Use WebFetch, and load Exa (`mcp__Exa__web_search_exa`, `mcp__Exa__web_fetch_exa`), Tavily (`mcp__Tavily__tavily_search`, `mcp__Tavily__tavily_extract`), Parallel Search or Firecrawl through ToolSearch. If one is rate-limited, move to another; don't retry the same call in a loop.
- Never compose a URL by hand: use only URLs a search or fetch returned. Quote no more than 25 words from any source.
- Met search API returns 410; fetch Met objects by ID only (`https://collectionapi.metmuseum.org/public/collection/v1/objects/<id>`).
- Edit only the specs in your group and your two CSVs.
- Be efficient: you have many items. A holder record or an official page beats three secondary sources. If an item is blocked after two tries, mark it unverified and move on.

## Report back (briefly)

- Counts per spec: verified / corrected / unverified.
- The corrections that matter most (anything that changes a date, a name, a licence, an "earliest", or an open/held status).
- Rows written to each CSV.
- Anything that needs a human decision.

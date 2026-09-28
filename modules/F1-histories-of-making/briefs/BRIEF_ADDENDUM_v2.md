# Addendum to BRIEF.md — new families (round 2)

Round 1 built 2,430 canon nodes in 20 kinds (civilisations, cultures, horizons, polities, dynasties, beliefs, movements, styles, schools, maker communities, institutions, exhibitions/events, networks, diasporas, techniques, materials, object types, living practices, first-known claims). Files: /tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/f1-scope/canon/canon_*.csv. Read the relevant ones before drafting so you link to (and do not duplicate) what exists; put related canon IDs in `notes` as "links: CIV012; POL021".

Same CSV schema, same codes, same rules as BRIEF.md. Lessons from the fact-check of round 1 — apply them:
- Do not overstate in `making_significance` ("built", "invented", "first", "produced") beyond what the evidence supports; say "credited with", "is associated with", "earliest known" where appropriate.
- If the prose names coerced, enslaved or indentured labour, the `sensitivity` column MUST include human-flow.
- Never type a UNESCO status, licence or identifier you have not verified; write "to verify" instead.
- Dates are ranges; wrong is worse than approximate.

New kinds:
- `person` (prefix PER), family People: named makers, workshop heads, designers, architects of objects, patrons and commissioners, theorists and writers on making, collectors and museum founders, restitution actors, scholars who defined groupings. `start`/`end` = birth/death (or floruit with date_note "fl."). `leaves_out` = who is obscured by crediting this person (assistants, wives, enslaved or anonymous workshop members, the community whose designs they used). Living people: include only those who publicly present themselves as makers or public figures; add "living" to sensitivity as `living-community`.
- `place` (prefix PLC), family Place: sites of making and exchange — workshops, kiln sites, mines and quarries, ports and markets, excavated sites, craft quarters and streets, museums that hold or authored collections, world's-fair grounds. `start`/`end` = period of the activity that matters to F1.
- `event` (prefix OCC), family Time: occurrences that changed making — laws and bans (sumptuary laws, the Calico Acts, the Navigation Acts, NAGPRA, the UNESCO 1970 Convention, the Indian Arts and Crafts Act), patents, treaties, wars, sieges and lootings (Benin 1897, the Summer Palace 1860, Maqdala 1868), fires and disasters, epidemics, migrations, restitutions and returns, founding of key institutions (if not already in canon), technological turning points already not in the firsts file.
- `period` (prefix PRD), family Time: period definitions as named by a specific source for a specific region (Heian; Edo; Classic Maya; Old Kingdom; Tang; Abbasid; Archaic Greece; Late Antiquity; Jōmon periods; Bronze/Iron Ages ALWAYS with region). `defined_by` = the scholarly tradition or source that defines it. PeriodO is the eventual gazetteer; do not type PeriodO IDs.

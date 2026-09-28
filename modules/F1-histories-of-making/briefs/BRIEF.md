# Brief for canon-register drafting (F1 "Histories of making")

## The project
F1 is the first module of a self-paced design-education web app for designers, brand/marketing people, founders and commissioning clients. It teaches a *global* history of making (objects, techniques, materials, makers, institutions, routes) across the whole timeline, "as a web, not a line". Its knowledge system is the **Atlas**: every thing is a *node* with one card; *groupings* (cultures, polities, movements, networks, guilds, civilisations-as-commonly-named, etc.) are nodes whose members are other nodes. Hard rules:
- **Zero cost.** Only free, open sources. Images only where the licence permits reuse (CC0, public domain, CC BY, CC BY-SA, KOGL Type 1, Japan Government Standard Terms). Anything else is linked out, never hosted.
- **"Civilisation" is never the frame.** It is a searchable label ("civilisation, as commonly named") whose card opens onto the precise groupings underneath and says what the name leaves out (neighbours, stateless peoples, enslaved makers, present-day communities). Never ranked, no "rise and fall" unless evidence supports it.
- **Sensitivity (CARE principles).** Sacred, ancestral and funerary material is excluded from display by default unless community-published; material from Indigenous communities carries a Notice. Human beings are never drawn as goods (Atlantic and other slave trades are shown as people, with a content note).
- **Ages are regional.** "Bronze Age" etc. always carry the region they were defined for.

The user has asked us to expand scope to EVERYTHING: all civilisations, cultures, polities, movements, networks, techniques, materials, object types, practices — not a favourite few. Your job is to draft a COMPLETE, ACCURATE register for your assigned families. Completeness matters, but accuracy matters more: include only entities you are confident exist and are named as you name them. Never invent identifiers (no Wikidata QIDs, no accession numbers, no URLs you are not sure of). Dates are approximate ranges; mark uncertainty.

## Tiers (propose one per row)
- **R1**: taught inside a unit, gets a full grouping page with an authored 6–9 step walk. Choose where the entity carries a lesson about making that a unit needs (not merely because it is famous).
- **R2**: card + member grid, no walk. Needs at least five verifiable member objects/nodes from free sources.
- **R3**: card + link out (Wikidata/PeriodO/collection search). Everything else. Every row gets at least R3.

## World chapters (column `world`)
F1.6 Africa · F1.7 The Americas · F1.8 East Asia · F1.9 South and Southeast Asia · F1.9a West Asia before Islam · F1.10 The Islamic world (network, 7th c. on) · F1.11 Europe and the Mediterranean · F1.12 Australia and the Pacific · F1.12a The steppe and Central Asia · F1.13 Networks · THEME (belongs to a thematic unit rather than a world). Multiple allowed, separated by `;`.

Thematic units (column `units`, optional, `;`-separated): F1.2 reference-to-appropriation · F1.3 how histories get written · F1.4 film/performance/sound/games · F1.5 recurrences (writing, cities, metallurgy, weaving, printing invented many times) · F1.13 networks · F1.14 copying, transfer, counterfeit · F1.15 ornament; exhibitions · F1.16 ritual and belief · F1.17 who commissions (patrons, guilds, merchants, industry, agencies, platforms) · F1.18 textiles and "women's work" · F1.19 industry, the machine, the exhibition · F1.19a war and crisis · F1.20 modernisms, plural · F1.21 consumer society, digital, platform · F1.22 planetary present, extraction · F1.22a use, repair, consumption · F1.23 obscured labour · F1.24 museum, provenance, restitution · F1.26 attribution and consultation · F1.28 primary sources · F1.28a reconstruction · F1.29 vernacular/oral · F1.30 calendars and periodisations.

## Sub-region codes (column `sub_regions`, `;`-separated)
AF-EGY Egypt · AF-NUB Nubia and Sudan · AF-MAG Maghrib · AF-SAH Sahel and Western Sudan · AF-GUI Guinea Coast · AF-CEN Central Africa · AF-HRN Ethiopia and the Horn · AF-SWA Swahili coast and East African interior · AF-SOU Southern Africa · AF-MAD Madagascar and Indian Ocean islands ·
AM-ARC Arctic · AM-NWC Northwest Coast · AM-WST North American West (Southwest, Plains, Great Basin, California) · AM-EWD Eastern Woodlands · AM-MES Mesoamerica · AM-CAM Central America (Isthmo-Colombian) · AM-CAR Caribbean · AM-AND Andes and Pacific coast · AM-AMZ Amazonia and lowland South America · AM-LAT Colonial and modern Latin America ·
AS-CHN China · AS-KOR Korea · AS-JPN Japan · AS-SAS South Asia · AS-HIM Himalaya and Tibet · AS-MSE Mainland Southeast Asia · AS-ISE Island Southeast Asia · AS-CEN Central Asia and the steppe · AS-NTH North Asia and Siberia ·
WA-MES Mesopotamia · WA-IRN Iran · WA-LEV Levant · WA-ARB Arabia and the Gulf · WA-ANA Anatolia · WA-CAU Caucasus ·
EU-GRR Greek and Roman Mediterranean · EU-BYZ Byzantium and the Balkans · EU-WCE Western and Central Europe · EU-BLC Britain, Ireland and the Low Countries · EU-IBE Iberia · EU-EER Eastern Europe and Russia · EU-SCA Scandinavia, the Baltic and Sápmi ·
OC-AUS Australia · OC-MEL Melanesia · OC-MIC Micronesia · OC-POL Polynesia (incl. Aotearoa, Hawaiʻi) · GL Global/many.

## Functions (column `functions`, the Atlas's twelve, `;`-separated)
shelter · clothing and adornment · food and storage · tools · record and writing · exchange and value · ritual and belief · rule and display · war · play and music · care and access · transport

## CSV schema (exact header, this order)
id,name,other_names,kind,family,world,sub_regions,start,end,date_note,making_significance,materials_techniques,object_types,functions,defined_by,leaves_out,sensitivity,free_sources,tier,units,confidence,notes

- `id`: your prefix + 3 digits (prefix given in your task).
- `kind`: one of the grouping kinds or node types named in your task.
- `family`: Place | Time | People | Ideas | Connections | Things | Composite | Source.
- `start`,`end`: integer years, negative = BCE (e.g. -2600). Leave `end` empty for ongoing. Approximate is fine; say so in `date_note`.
- `making_significance`: ONE plain sentence on what it made or why it matters to a history of making. No adjectives like "stunning", "iconic".
- `materials_techniques`, `object_types`: short `;`-lists.
- `defined_by`: who defined/named the grouping (archaeologists, the members themselves, a named scholar, museums, historians, the state…).
- `leaves_out`: mandatory for civilisation names, polities, movements; optional elsewhere.
- `sensitivity`: none | sacred | funerary | ancestral | Indigenous-community | human-flow | conflict-looting | living-community (`;`-list).
- `free_sources`: named zero-cost routes where material can come from (e.g. "Met Open Access (CC0); Cleveland (CC0); Wikimedia Commons; Europeana; British Museum EMKP (CC); open-access excavation reports; community-published site"). Only name routes you believe hold relevant material.
- `confidence`: high | medium | low — your confidence in the row's facts.
- `notes`: anything a verifier should check.

Write the CSV with Python's `csv` module (QUOTE_MINIMAL) so commas inside fields are safe. UTF-8. Save to the path given in your task. Aim for breadth across ALL sub-regions and ALL periods, deliberately including Africa, the Americas, Oceania, the steppe, Southeast Asia, the Caucasus, Arabia, the Arctic, Madagascar, the Himalaya, Amazonia, the Caribbean — not only the regions museums favour. Also include the 20th–21st century where the family applies.

When done, reply with: file path(s), row count per file, count of rows per world, and a short list (≤10) of rows you are least sure of.

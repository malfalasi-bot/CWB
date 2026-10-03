# Batches 4 and 5: the world chapters and F1.17, brought up to template v3

Read `/home/claude/creative-world/modules/F1-histories-of-making/briefs/SPEC_BRIEF.md` first: format, writing standard, rules and output path all still apply.

## What is different here

These units are **upgrades, not new specs**. Ten of them are the world chapters, F1.5 and F1.13. Each already has a deep dive with:
- verified objects;
- 8–15 claims;
- a scripted walk;
- both Apply steps.

The deep dives were written on deep-dive template v2. They predate:
- the Q19 split into a "1970 test" field and a "history gap" field;
- the Q21 funerary rule;
- Historian pack v2's rules 13–20;
- template v3's people, visual plan and fact-check steps.

F1.17 is the approved exemplar table, without the ten sections.

Your job, for each unit:

1. **Keep what was verified.**
   - Carry the deep dive's device, objects (WS ids), claims (CL ids), walk and Apply into the spec.
   - Recheck each object's licence on its holder's own record. The Met's object-by-ID API still works; its search returns HTTP 410.
   - Mark anything whose status changed.
2. **Apply every Historian pre-read fix for the chapter.**
   - The fixes are in `/home/claude/creative-world/modules/F1-histories-of-making/docs/07-groundwork/index.md`, lines 86–146.
   - Apply all six cross-cutting fixes plus the chapter's own rows.
   - In section 9, list each fix with its status: done, or still open and why.
3. **Apply the corrections from batches 1–3 that touch this chapter.** They are listed below and in `specs/BATCH2_OVERVIEW.md` and `specs/BATCH3_OVERVIEW.md`. Don't repeat cases that a thematic unit now teaches in full; link to that unit.
4. **Add what template v3 requires.** This is the full table plus the ten sections, as in batches 1–3:
   - a responsibility block, by canon ID, from the coverage grid in `atlas/reports/coverage.md`;
   - a protocol screen under Q21: never human remains, sacred or secret material, or what a descendant community asks not to show; other grave goods and altar objects only with their origin and a content note;
   - for each object, the 1970 test plus a history-gap field;
   - a colonial-context screen for objects made after 1800 in colonised regions;
   - an export-law line where one applied;
   - a living practice with at least one source in the holders' own words, dated by year;
   - people and credit;
   - a zero-cost visual plan for each step of the walk;
   - three consumption forms;
   - outbound links;
   - a fact-check list.
5. **Broaden the holders.** Batches 1–3 drew almost entirely on Cleveland, the Met and AIC. Each chapter must add **at least two open objects from other holders**. Check the licence on each record. Holders to try:
   - Te Papa (CC BY on many records);
   - the Rijksmuseum (public domain);
   - Smithsonian Open Access (CC0 only where the record says so);
   - Wellcome Collection;
   - Europeana (filter by rights);
   - the Library of Congress;
   - national libraries' open scans;
   - the British Library (only where the item says public domain);
   - the Walters Art Museum (CC0);
   - the Brooklyn Museum (check each record);
   - the National Museum of Korea (KOGL Type 1);
   - the Tokyo National Museum ColBase (check terms).

   If none is open, say so and link out.
6. **Walk.** 6–9 steps, each tied to claims and nodes, with content notes where needed.

**Size.** Deep-dive units carry more than thematic ones: a taught set of 8–10 objects, a walk of 6–9 steps and 15–25 claims. Aim for about 3,500 words, and no more than 4,000.

**Tooling.**
- Firecrawl: at most 5 calls per unit.
- Use WebSearch/WebFetch for everything else; the shell cannot reach websites.
- Never invent a URL or an accession number.
- Partner voice: the Historian, unless the register says otherwise. F1.17's partner is the Client.

## Where each unit's current material is

| Unit | Source document (Markdown) | Lines |
|---|---|---|
| F1.5 Recurrences | docs/04-deep-dives-1/index.md | 106–183 |
| F1.6 Africa, read through metallurgy | docs/04-deep-dives-1/index.md | 184–255 |
| F1.7 The Americas, read through fibre | docs/05-deep-dives-2/index.md | 215–279 |
| F1.8 East Asia, read through the workshop | docs/05-deep-dives-2/index.md | 280–342 |
| F1.9 South and Southeast Asia, read through cotton | docs/05-deep-dives-2/index.md | 343–404 |
| F1.9a West Asia before Islam, read through the account | docs/05-deep-dives-2/index.md | 468–530 |
| F1.10 The Islamic world as a network, read through routes and the waqf | docs/05-deep-dives-2/index.md | 152–214 |
| F1.11 Europe and the Mediterranean, read through the guild | docs/05-deep-dives-2/index.md | 405–467 |
| F1.12 Australia and the Pacific, read through navigation | docs/05-deep-dives-2/index.md | 93–151 |
| F1.12a The steppe and Central Asia, read through the horse | docs/05-deep-dives-2/index.md | 531–592 |
| F1.13 Networks: objects, materials, skills and people | docs/05-deep-dives-2/index.md | 27–92 |
| F1.17 Who commissions | docs/01-pass-2-v1/index.md (the exemplar table) | 251–275 |

- All paths are under `/home/claude/creative-world/modules/F1-histories-of-making/`.
- The "What a node carries" section (Deep Dives 1, lines 46–105) and template v3 (`docs/09-round-2/01-round-2.md`, lines 95–113) define the fields.
- Unit rows are in `docs/03-module-file/index.md`, lines 159–200.
- Historian pack v2's world briefs are in `/home/claude/creative-world/docs/03-partner-voices/historian/index.md`.
- Grouping pages are in `grouping-pages/`; link them, don't repeat them.
- Registers and canon:
  - `/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/register/world_set_v0.csv`
  - `/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/register/claims_v0.csv`
  - `/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/register/practices_v0.csv`
  - `/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/f1-scope/canon/*.csv`

## Corrections already found that touch each unit

- **F1.5**
  - Botai has been seriously challenged since 2018 (Q15).
  - Write "Afro-Asian cottons", not "Old World cottons".
  - Paper recurrence: INV037 must not call Baghdad (794) the earliest paper made outside China. Central Asia had paper first (F1.27, F1.30a).
  - Egypt's earliest writing is about 3320 BCE (CL-102, CL-203).
- **F1.6**
  - OCC175: put "punitive expedition" in quotation marks, attributed.
  - The Benin plaques and Igun Street are now taught in F1.24; link there.
  - COM068 and TEC072 disagree on the Haya steel dates; reconcile them, or show both.
  - Akan gold weights are taught in F1.25.
  - Great Zimbabwe is in F1.3 and F1.31.
  - The Meroitic cup from grave 1007 and the Benin ancestral-altar head need settling under Q21.
- **F1.7**
  - OCC141: lead with Hwéeldi, and date it from fall 1863. The claim about commercial yarn is unverified.
  - DAT-001: the Open Khipu Repository has no licence.
  - Wari: give both readings.
  - The khipu criterion must not take a side.
  - MAT043 and TEC128: Paracas is 1st c. BCE–2nd c. CE.
  - TEC128 should say "along with gold and silver".
  - Mesoamerica needs a claim and a record.
  - Paracas: "after the excavations of the 1920s".
- **F1.8**
  - PRD107: the earliest era name is 140 BCE or about 110 BCE.
  - Goryeo celadon came largely from tombs; this needs Q21 handling.
  - The 1433 order is probable, not documented, until the primary text is read.
  - Date the Jingdezhen workforce figure to its source.
  - PRA093: hanji has been nominated, with the decision due at the 21st Committee.
  - PRA094: washi's 2025 extension is unverified.
  - Yanagi is taught in F1.20 and F1.31; link there.
- **F1.9**
  - Write "one of the earliest mass exports".
  - Deindustrialisation is contested; give both readings, and add the karkhana.
  - Add an Island Southeast Asia object (batik or ikat; the Rijksmuseum is a likely source).
  - The Sripuranthan dates need checking.
  - STY122: Kalighat painting is gum tempera.
  - MKR047: jamdani weaving continues after 1850.
  - The Kolhapuri case is taught in F1.26; link there.
- **F1.9a**
  - Write "the earliest securely dated records of making".
  - Ennion is "among the earliest named" glass-blowers.
  - Magan's copper is known from Sumerian trade texts.
  - Magan is the Oman peninsula, today Oman and the UAE (Q25). Name the Hafit and Umm an-Nar periods.
  - Belovode: it is argued.
  - Luristan is the textbook looting case. Don't say "most antiquities".
  - The Met's Dilmun objects 1987.96.22 and 1993.503.2 have no published provenance.
- **F1.10**
  - INV037 and CL-156: write "the earliest documented paper mill in the Islamic world, Baghdad, 794–95". Central Asia had paper before Baghdad.
  - "One of the richest records of named craftsmen before 1600."
  - Add "Islamic art" as a contested category (Blair and Bloom 2003).
  - Write "late antique Egyptian weavers", not "Coptic weavers".
  - The Gulf hook needs an Arab-shore source. Al Sadu: Urgent Safeguarding List 2011 and Representative List 2025 (UAE). The 2025 Register entry is the safeguarding programme (PR-001 fix). Bahrain pearling is a World Heritage site; verify.
  - "The Gulf" in our voice.
  - The astrolabes now in F1.30 are Met 91.1.535a–h and 63.166a–j.
- **F1.11**
  - Write "enslaved and freed workers".
  - Replace the copper criterion with paper or printing.
  - "The earliest named makers in this chapter."
  - Compagnonnage rites are private; name them as private and don't describe them.
  - TEC186: paper reached Spain in the late 10th century, and the Xàtiva mills date to about 1050.
  - DYN005 and MKR090: write "earliest known recorded strike".
  - F1.28 now teaches the Vitruvius translations; link there.
- **F1.12**
  - Write "the earliest known ground-edge axes", and resolve Carpenter's Gap against Madjedbebe.
  - WS-030 needs its Country named.
  - Attribute the Polynesian Voyaging Society's claim to them.
  - Cite Creative Australia's First Nations protocols in their current edition (2020 per F1.31; verify).
  - Date the "no law" claim to its source.
  - Name what navigators had, not what they lacked.
  - Budj Bim: Gunditjmara people manage it; inscribed 2019.
  - Hōkūleʻa (F1.28a) needs a Kānaka Maoli source. PER345 is unverified.
  - The harakeke names are held in F1.29.
- **F1.12a**
  - WS-104 is wrong: Cleveland holds 9 CC0 Ordos records, including 1952.115, 1962.46 and 1916.1189.
  - PR-017's world code should be F1.12a.
  - WS-100: the Pazyryk carpet is missing from the world set. It is named only, never shown with burials.
  - PLC258: Boucher was captured at Belgrade, and Rubruck calls him a slave. The "Great Hall" is now identified as a temple.
  - PRA160 and COM209: men also prepare wool and press felt.
  - Botai has been seriously challenged since 2018.
  - Add the claim "horses and Indo-Iranian languages moving together" as interpretive, with a source.
  - No Hermitage or Mongolian state image is openly licensed.
- **F1.13**
  - Write "among the goods traded for them" for manillas, and source the list of goods.
  - The cobalt came "from Iran".
  - Baghdad mill: as in F1.10.
  - Talas is a legend (F1.27, F1.30a).
  - Apply the human-flow rule on every network.
- **F1.17**
  - The heritage-brand case (module file 4.4) is now in F1.24: Harris Tweed. Link there.
  - The karkhana (F1.9) and the waqf grouping page (`grouping-pages/waqf.md`) are commissioning regimes.
  - The Gulf pearl-trade commission was planned as a "regional slot". Per F1.31, Gulf content is authored locally: give its structure only.
  - The partner is the Client.

## What batch 4 found (applies to batch 5)

**Holders that worked:**
- the Walters Art Museum (CC0, with good provenance);
- the Rijksmuseum (public domain);
- the National Museum of Korea (KOGL Type 1);
- the Cooper Hewitt (public domain);
- the Library of Congress (wording such as "free to use and reuse");
- Sketchfab models under CC BY 4.0, from holders such as the Nagaoka museum.

**Holders that failed:**
- The Smithsonian API returned 429. Many NMNH and Freer records say "Usage conditions apply", which means not open.
- The National Museum of Oman is all rights reserved.

**Status changes:**
- DAT-001: the Open Khipu Repository now has an MIT licence file (© 2022).
- PRA094: washi is inscribed in 2025 (20.COM, file 02291), as verified on UNESCO's page.

**Objects reassigned between units:**
- Met 2021.146 (Wari tunic) is taught in F1.5 and F1.7.
- Cleveland 1938.431 (the Chavín plaque) moved to F1.5, with a Q21 note.
- Met 17.194.226 (the Ennion jug) replaces WS-095 in F1.9a.
- WS-022 (the Puebla basin) moved to F1.13.

Don't re-teach these; link to the unit that teaches them.

## Output

- Save each spec to `/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/f1-scope/specs/<unit>.md`.
- Use the same format as F1.24.md: a `## <unit> <title>` line, a lead sentence, the table, then the ten bold-labelled sections.
- Do not edit any other file.

**Report back with:**
- word count;
- claims, by confidence;
- objects, with each one's holder, licence and 1970-test status;
- the pre-read fixes, done and open;
- canon corrections found;
- what you could not verify.

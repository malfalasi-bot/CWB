# F1 Groundwork — provenance, registers, pre-read and grouping pages

2026-09-28 · @Mohammad AlFalasi

This round turns the deep dives into working material: every flagged record read at its source, the registers built as files with a tested harvester, a specialist pre-read of the nine world chapters, and the first three grouping pages. Recommendations from earlier rounds are applied as working assumptions, not as answers.

## Provenance pass

Of 16 records read at source (the 13 flagged, the 2 unchecked Met records and one Iznik dish), 10 pass the 1970 test, 1 needs an enquiry, 4 fail and 1 falls outside the test. The flags had mixed two things: a gap in an object's history, and a failure of the test. An object in a museum before 17 November 1970 passes, however thin its earlier history.

| ID | Object | Holder | What the record says | Test | What changes |
|---|---|---|---|---|---|
| WS-001 | Proto-cuneiform tablet with seal impressions | Met 1988.433.1 | Erlenmeyer collection, bought 1943 to the early 1960s; Christie's, London, 13 December 1988, lot 21 | Pass | Stays F1.1's anchor. The card adds that how it left Iraq is not recorded |
| WS-090 | Cuneiform tablet: barley and emmer | Met 1988.433.2 | Same collection, same sale | Pass | Same line on the card |
| WS-007 | Wari tunic | Met 2021.146 | [André Emmerich Gallery, New York, 1960s]; Guido and Nelly di Tella, Buenos Aires, ca. 1960s–2013; Claudia Quentin, New York, 2013–2021 | Pass, with caveat | Kept. The Met's brackets mark the 1960s step as unconfirmed, and the card says so |
| WS-043 | Cover with four trees of life, Egypt | Met 90.5.902 | Emil Brugsch, until 1890; George F. Baker, 1890, given to the Met | Pass | Kept. The seller worked for Egypt's antiquities service: a case for F1.24 on what "legal" meant in 1890 |
| WS-060 | Tripod cauldron (ding), Shang | Cleveland 1960.288 | Frank Caro, New York, until 1960 | Pass | Kept |
| WS-061 | Jun ware jar | Cleveland 1957.36 | "Men-chu Wang, Seller's no. 12"; acquired 1957 | Pass | Kept |
| WS-081 | Attic neck-amphora | Cleveland 1970.16 | Accessioned 9 March 1970; the record's first entry is not published | Pass, narrowly | Kept; ask for the missing entry |
| WS-092 | Luristan cheekpiece | Cleveland 1961.33 | Mrs Christian R. Holmes; Mozaffar Cohen, Paris; no dates; acquired 1961 | Pass | Becomes the Luristan exemplar |
| WS-053 | Inka khipu | Cleveland 1940.469 | No history published; gift of John Wise, 1940 | Pass | Kept |
| WS-012 | Akan gold weight | Cleveland 1962.244 | Mr and Mrs Robert M. Hornung, Cleveland Heights, given 1962 | Pass | Kept |
| WS-041 | Iznik dish with artichokes | Cleveland 1995.17 | Sulzbach; Stora; Scarisbrick, all undated; Oliver Hoare Ltd, London, sold 1995 | Enquiry | Provisional exemplar; ask Cleveland for the owners' dates |
| WS-015 | Zande-style throwing knife (pingha) | Cleveland 2015.156 | Jacques Hautelet, La Jolla, "by at least 2004"; given by Robert H. Jackson, 2015 | Outside the test | Colonial-context gap: replace with an earlier-documented example if one is licensed, else show it with its gap |
| WS-005 | Jōmon flame vessel | Cleveland 1984.68 | Gallery Kapitan, Tokyo, until 1984 | Fail | A case: no history before 1984, and the museum reports a base from another vessel added in a 20th-century restoration. The exemplar becomes an excavated vessel held in Japan (rights to check) |
| WS-042 | Iznik tile spandrel | Cleveland 2004.70 | Momtaz Islamic Art, London, until 2004 | Fail | Dropped: a piece of a building, with no record of which building |
| WS-091 | Luristan horse bit | Cleveland 1980.102 | Nothing published; bought 1980 | Fail | A case for F1.24 and West Asia; WS-092 carries the horse-gear point |
| WS-101 | Child's coat, pearl medallions | Cleveland 1996.2.1 | Sara Tremayne Ltd, London, until 1996 | Fail | A case; WS-102, in Cleveland since 1959, becomes the steppe chapter's silk exemplar |

**What the pass changes in the template.**

1. Two fields replace one flag. "1970 test" takes pass, pass with caveat, enquiry, fail or not applicable. "History gap" says what the record leaves out. A gap alone never turns an exemplar into a case.
2. The test applies to archaeological material and ancient art. Objects made after about 1800 in colonised regions get a colonial-context screen instead (WS-015), on the model of the German Museums Association's guidelines for collections from colonial contexts. European decorative art and signed modern work are marked not applicable.
3. Passing is a threshold, not a clean history. Where the country of origin had an export law at the time, the card names it; for the Uruk tablets that is Iraq's antiquities law of 1936 (to verify before it is written into a card).
4. The Met publishes provenance on its object pages but not in its open API. The harvester now reads it from the page (§2).

**Enquiry template.** For the two open questions (WS-041's owners, WS-081's missing entry), sent from the project's own address and logged against the record ID.

```markdown
Subject: Provenance enquiry: [accession number], for an educational program

Dear [registrar or provenance researcher],

We are preparing an open educational program on the history of making and would like to feature [title], [accession number]. We want to state its history exactly as your museum records it.

Your online record lists [what it lists]. Could you tell us:
1. [the specific gap, e.g. the dates at which Sulzbach, Stora and Scarisbrick owned the dish]
2. whether any export documentation is on file
3. how you would like the museum credited for this information

We will show your answer as "information from [museum], [date]".

[Name], [role], [program name]
```

## Registers v0 and the harvester

The registers now exist as files: 77 world-set records, 110 claims and 12 living practices, plus a harvester that checks every record's licence and 1970 test and passes 13 offline tests on real museum responses. The files travel with this round as one archive.

| File | What it holds | Size |
|---|---|---|
| world_set_v0 (CSV and JSON) | Every record from Deep Dives 1 and 2, one row each, with a units column listing every chapter that uses it, the verbatim provenance, the test, its basis and the gap | 77 records, 64 of them objects |
| claims_v0 (CSV and JSON) | Every claim from the eleven deep dives, with unit, confidence and source; IDs from CL-101 so they do not collide with CL-001 | 110 claims |
| practices_v0 (CSV) | PR-001 to PR-018 with holders, places, source and status | 12 practices |
| prov_pass (JSON) | The provenance pass above, word for word | 17 records, with the Ennion cup |
| harvest.py and its tests | Cleveland, the Met and the Art Institute of Chicago; standard library only | 13 tests, all passing |

Of the 64 objects, 45 are exemplars, 5 wait on an image licence, 4 still need sourcing, 2 are blocked by rights, 4 are cases and 4 are excluded.

*[Embedded: node/25e37b03-61be — world_set_v0.json · 64 object records · counted 28 September 2026]*

The Pacific chapter has no open exemplar, the steppe one, and South Asia three, because their textiles and Pacific objects sit in collections without open licences. The harvest's first targets stay the Rijksmuseum, Te Papa, the Smithsonian and Australian state collections (Q16).

**How the harvester works.**

- It checks the licence on each record (Cleveland's CC0 status, the Met's and the Art Institute's public-domain flags) and fetches an image only when the record is open.
- It keeps only an exact accession match, because Cleveland's search is fuzzy: a search for 1957.36 also returns the jar's lid and body as 1957.36.a and .b.
- It reads the Met's provenance from the object page, since the open API has none. If the Met changes its page, the reader returns nothing and the record is flagged for a person, never passed.
- It applies the 1970 test to the accession date, counts a decade such as "1960s" as a caveat, and switches to the colonial-context screen or "not applicable" where the register says so.
- It keeps to per-host rate limits and retries politely, and it writes a review list of every record whose licence or test result has changed since the register was last checked.

The query shapes were confirmed live today: Cleveland's fields including images, the Met's API and object page, and the Art Institute's search by reference number, which still returns the Kente Wrapper (1986.1043) as not public domain, as in sprint 3. The Ennion cup was confirmed at record level: Met 17.194.225, public domain, given by J. Pierpont Morgan in 1917.

**What the data shows.** Of 110 claims, 95 are marked documented, 11 contested, 4 probable and none interpretive, yet every chapter's device is itself a reading. Only 9 claims name the record that carries them, so the node column that template v2 asks for is the register's next field (§3 takes up both).

## Historian pre-read of the nine world chapters

The pre-read found 42 risks across the nine chapters, and six that cut across all of them. None changes a device. Most are wording that breaks the writing standard or states one side of a live debate as fact. This is an AI pre-read in the Historian's specialist mode, not a substitute for the human and paid readers (P11).

**Across all chapters.**

1. **"First" survives in** **about a dozen** **places** despite rule 6: paper mills, axe grinding, indigo, mass export, writing, and four walk questions ("Where and when were horses first tamed?"). Claims are rewritten below as "earliest known" or "earliest documented".
2. **The funerary and ancestral rule is applied unevenly.** The policy excludes funerary and ancestral material by default, yet the taught sets show Paracas textiles from burials, Shang bronzes from tombs, Goryeo celadon largely taken from tombs, a Meroitic cup from grave 1007 at Faras, and a Benin head made for a royal ancestral altar. The rule needs a definition before specs (Q21).
3. **Claims lean on "documented".** 95 of 110 are marked documented, none interpretive. Each chapter's device is a reading, so each should declare it as one. Claims resting on a secondary summary drop to probable until the primary source is read.
4. **Three success criteria take a side in a live debate:** the khipu "without calling it writing" (F1.7), "Europe after other worlds in copper" (F1.11, which contradicts the Belovode claim) and the Wari "spread of style rather than an empire" (F1.7, and the Middle Horizon card in Atlas Logic).
5. **The Historian pack is behind the deep dives.** Its world briefs still say "Oceania", lack the two new chapters and keep "porcelain as the first global industry". Its contents count 1 record, 1 claim and 2 practices. Its first sample reply puts Egypt's writing "at about 3200 BCE", while the register holds the Abydos labels at about 3320 BCE. Pack v2 is needed (Q24).
6. **Names in the Gulf.** Our voice says "the Gulf"; the UNESCO element is titled for "the Persian Gulf". The chapters' Gulf hook rests on an Iranian element, and Magan is identified only with Oman, although the Hafit and Umm an-Nar periods take their names from sites in today's UAE (Q25).

**By chapter.**

| Chapter | Risk | Why a specialist would flag it | Fix |
|---|---|---|---|
| F1.13 | "The first paper mill in Baghdad" | Rule 6; the claim is about the earliest documented mill | "The earliest documented paper mill in the Islamic world, Baghdad, 794–95" (also F1.10) |
| F1.13 | The Atlantic step names brass manillas "as what was traded for them" | Manillas were one of several goods exchanged for people; naming one flattens the trade | "Among the goods traded for them", with the goods list sourced and manillas as the F1.6 link |
| F1.13 | Cobalt "imported from the West" | Vague and Europe-centred | "From Iran" |
| F1.12 | "Grinding axe edges before anyone else in the world" | Rule 6 | "The earliest known ground-edge axes come from Australia" |
| F1.12 | Carpenter's Gap "the earliest known anywhere" beside Madjedbebe's ground-edge hatchets at about 65,000 years | The two claims contradict each other | "The earliest securely dated"; Madjedbebe's older examples depend on its contested dates |
| F1.12 | WS-030 has no Country named | The chapter's own rule: named Country for every node | Name the Country from the published site reports |
| F1.12 | "The first Hawaiian navigator to do so in 600 years" | Rule 6, and a claim that is the Polynesian Voyaging Society's own | Attribute it: "which the Polynesian Voyaging Society describes as…" |
| F1.12 | Creative Australia's protocols "2002, revised 2007" | A later edition exists (2019, to verify) | Cite the current edition |
| F1.12 | "Australia has no law against the misuse of traditional symbols" | True as of the source, but proposals are live | Date it to the source (rule 10) |
| F1.12 | "Without writing or metal" | Defines Pacific navigators by what they lacked | Name what they had: star compasses held in memory, voyaging canoes, crops carried between islands |
| F1.12 | Budj Bim "its knowledge is held today" | Undated, holders unnamed | "Gunditjmara people manage it; UNESCO inscribed it in 2019" |
| F1.10 | Endowment deeds are "the best record of named craftsmen the pre-modern world has" | A superlative a specialist would contest (Deir el-Medina, guild rolls, the Yingzao Fashi) | "One of the richest records of named craftsmen before 1600" |
| F1.10 | The pack's debate, "Islamic art" as a collectors' category, is absent | The Historian must present it with both sides | Add it as a contested claim (Blair and Bloom, "The Mirage of Islamic Art", 2003) |
| F1.10 | "Coptic weavers" for 4th–5th-century Egyptian textiles | "Coptic" is a religious label often applied to all late antique Egyptian cloth | "Late antique Egyptian weavers"; Coptic only for Christian work |
| F1.10 | "The makers who were here first" | Rule 6 | "The makers who were already here, and stayed" |
| F1.10 | The Gulf hook rests on an Iranian element (lenj) | One shore of the Gulf stands for both | Add an Arab-shore source, such as Bahrain's pearling World Heritage site (to verify) |
| F1.7 | "Cotton before pottery, indigo before anyone else" | Rule 6 | "The earliest known indigo anywhere" |
| F1.7 | Wari "a spread of style rather than an empire" | Most specialists describe Wari as an expansive state; the scale is argued | Show both readings, contested; change the Middle Horizon card in Atlas Logic to match |
| F1.7 | Success criterion: the khipu "without calling it writing" | Whether khipus are writing is argued; the pack lists it as a debate | "Describe the khipu as a record and give both readings of the writing debate" |
| F1.7 | "The Long Walk" as the only name | Rule 8: the community's own name first | The Diné name for Bosque Redondo first, from Diné sources (spelling to verify) |
| F1.7 | Paracas textiles "after their discovery" | Rule 9 | "After the excavations of the 1920s" |
| F1.7 | Mesoamerica is in scope with no claim or record | The chapter promises a region it does not teach | Add one claim and one record, such as a codex facsimile |
| F1.8 | The 1433 order is "documented" from a secondary summary | The confidence outruns the source | Probable until the primary text is read |
| F1.8 | "Moulded by the imperial kiln, fired by the civil kilns" beside 1433 | The arrangement is usually dated to a later Ming reign | Check the date before pairing the two |
| F1.8 | "A city that still has 100,000 ceramic workers" | Undated, from state media | Date it to the source (rule 10) |
| F1.8 | Goryeo celadon shown while "nothing funerary" is | Much Goryeo celadon reached collections from tombs opened in the 1900s–1910s | Say so on the card; settle under Q21 |
| F1.9 | "India's cloth was the world's first mass export" | Rule 6 | "One of the earliest mass exports" |
| F1.9 | "Undone by the machine", marked documented | The pack lists deindustrialisation as a debate | A contested claim with both readings; add the karkhana, also in the pack's brief |
| F1.9 | "Old World cottons" | A Europe-centred term | "Afro-Asian cottons" (also in F1.5) |
| F1.9 | Island Southeast Asia in scope with no object | Promised, not taught | Batik or ikat from the Rijksmuseum at harvest |
| F1.9 | The Sripuranthan theft "recorded in 2008" | The theft and its report may fall in different years | Check both dates in the police and court record |
| F1.11 | "Slaves and freedmen" in the claim and the walk | Rule 7 and the program's own language | "Enslaved and freed workers" |
| F1.11 | Criterion: "Europe after other worlds in copper" | Contradicts the Belovode claim two rows below it | Use paper or printing instead |
| F1.11 | "The first named makers in this world" | Rule 6 | "The earliest named makers in this chapter" |
| F1.11 | Compagnonnage "initiation rites" in the living practice | Private to the societies | Name them as private; do not describe |
| F1.9a | "The world's earliest writing is a list of rations"; "where making first became a matter of record" | Egypt's labels are about as old; the count is contested | "West Asia holds the earliest securely dated records of making" |
| F1.9a | "Its earliest known glass-blowers signed their cups" | Ennion worked about a century after the earliest blown glass | "Among the earliest named glass-blowers" |
| F1.9a | Magan's copper "known from bills of lading" | Anachronistic | "From Sumerian trade texts" |
| F1.9a | Belovode "two millennia earlier than the textbook story" | Overstates the finding | "Earlier than any secure Near Eastern evidence, which is argued" |
| F1.9a | "Most West Asian antiquities in Western museums arrived through a market fed by looting and wars" | Many came through licensed excavations and division of finds | "Many came through the market; Luristan is its textbook case" |
| F1.12a | Botai "has just been overturned", while the claim is marked contested | The text and the claim disagree | "Seriously challenged since 2018" |
| F1.12a | "Horses and Indo-Iranian languages moving together" | A reading with no claim behind it | Add it as a claim marked interpretive, with its source |

The fixes go into the unit specs as they are written, and the rule-level ones (1–6) into the template and the pack (Q23, Q24).

## Grouping page: Mingei

Mingei's page teaches its own contradiction: a movement that praised the unknown maker became famous through named ones, and the record repeats it, since the anonymous objects it collected are in open collections and its named makers' work is still in copyright.

**Card**

| Part | Content |
|---|---|
| Kind | Movement: it declared itself, with a programme, a museum and members |
| Line | A 1925 name for everyday crafts, made famous by named makers. |
| Named by | Yanagi Sōetsu with the potters Kawai Kanjirō and Hamada Shōji, in 1925: *mingei*, "folk crafts" or "common crafts" |
| Span and places | Japan, 1925 to today; collecting in Tōhoku, Kyūshū and Okinawa; exhibitions of Joseon crafts; Ainu and Taiwanese Indigenous crafts shown by the museum |
| Membership | Documented for the founders and their association; claimed, not chosen, for the anonymous makers |
| Leaves out | The makers it championed never chose the label, and Korean, Okinawan, Ainu and Taiwanese work was gathered into a Japanese category |

**Walk** (each step lights its members on the small map and timeline)

| Step | What the learner meets | Members lit |
|---|---|---|
| 1 | Korea, 1910s to 1924: Yanagi collects Joseon ceramics and helps found a folk art museum in Seoul (1924, to verify from the museum's own history) | Jar with scroll design, Joseon, 1400s (Cleveland 1963.505, CC0) |
| 2 | The word, 1925, and a prospectus for a museum, 1926 | Yanagi, Kawai, Hamada |
| 3 | The unknown maker: Ōtsu-e, roadside paintings sold to travellers, which the movement exhibited | *Woman as an Itinerant Monk*, late 1600s to early 1700s (Cleveland 1983.9, CC0); *Demon Intoning the Name of the Buddha*, 1700s (Cleveland 1982.26, CC0) |
| 4 | Named makers: Hamada, Kawai and the English potter Bernard Leach become the movement's public faces. Cleveland's record notes that Hamada did not sign his pieces, and that Japan named him a Living National Treasure in 1955 | Hamada's *Rectangular Bottle Vase* (Cleveland 2000.145, in copyright: shown by link) |
| 5 | The museum, 1936: the Japan Folk Crafts Museum in Komaba, Tokyo, its main hall designed by Yanagi, who became its first director | The museum (place) |
| 6 | Collecting across an empire: journeys to Korea and Okinawa in the late 1930s, and Ainu and Taiwanese work brought into the collection | Okinawan *bingata* (technique; record to source) |
| 7 | The argument, both readings (below) | The claims |

**Members.** 3 people, 1 institution, 1 town (Mashiko), 1 technique and 4 objects so far; Ring 2 adds more as the harvest finds them. Open images exist only for the older anonymous work. The named makers died between 1961 and 1979, so their work is in copyright in most countries and appears by link, never as an image.

**Neighbours.** Arts and Crafts in Britain, which Yanagi acknowledged; the Leach Pottery at St Ives, the movement's English branch; and other 20th-century craft revivals, set side by side in Compare.

**Afterlives.** Studio pottery worldwide through Leach and Hamada; Mashiko, where most kilns follow Hamada's work (Cleveland's own note); "mingei" as a design and retail label; and industrial design through Yanagi's son Yanagi Sōri (dates to verify).

**What is argued.**

- Revival or invention? The pack lists this as the F1.8 debate: did Mingei find a folk tradition or build one? Contested.
- Empire. Kim Brandt (*Kingdom of Beauty*, 2007) and Yuko Kikuchi (*Japanese Modernisation and Mingei Theory*, 2004) read the movement as entangled with Japan's imperial and national projects. Others stress Yanagi's public defence of Korean culture after 1919 and the movement's stand against industrial sameness. Both readings are shown.
- Korea's reading of Yanagi. Korean critics have questioned how Yanagi described Korean art. To source from Korean scholarship before the page is written, so the page does not speak only in Japanese and Western voices.

**Apply** (F1.20, with a link from F1.8)

- Maker: name one anonymous tradition your work draws on and write how you will credit it without turning it into a style label.
- Briefer: write the credit line a "mingei-style" product must carry: who made it, where, and whether "mingei" is the maker's word or the brand's.

## Grouping page: Nok

Nok's page is about how a culture is known: first through figures dug up by tin miners, then through excavation, while most of the pieces in the world's collections came from looted sites. Its card warns that museum membership is often contested.

**Card**

| Part | Content |
|---|---|
| Kind | Archaeological culture: a name archaeologists gave to a pottery and figure tradition, not a name its people used |
| Line | Terracotta figures and iron in central Nigeria, main phase about 900 to 300 BCE. |
| Named by | Bernard Fagg, in the 1940s, after the village of Nok |
| Span and places | Central Nigeria, from about 1500 BCE to the turn of the Common Era; the main phase, with terracotta figures and iron production, runs from the 9th to the 4th century BCE (Franke 2016) |
| Membership | Documented for excavated finds; contested for most museum pieces, which carry "Nok style" and no findspot |
| Leaves out | The people's own name and language, which are unknown, and what the figures meant to them |

**Walk**

| Step | What the learner meets | Members lit |
|---|---|---|
| 1 | Jos, 1943: a visitor brings Fagg a terracotta head that had stood on a scarecrow in a yam field; tin miners had been turning up figures for years | The Jemaa Head (Nigeria's national collection; image rights to request); tin-mining country (place) |
| 2 | Taruga: iron furnaces with terracottas in and around them, dated by Fagg to about 280 BCE. He read the figures as part of smelting ritual, a reading marked interpretive | Taruga (place); bloomery smelting (technique) |
| 3 | Frankfurt and Nigeria's National Commission for Museums and Monuments excavate together from 2005 and set out three phases | The chronology (period node) |
| 4 | Everyday Nok: residues in 458 pots show bee products, most likely honey, in over a third of the vessels that kept their fats, about 3,500 years ago | Excavated pottery; Pangwari (place) |
| 5 | The looting: sites dug for the art market; Peter Breunig calls Nok "a victim of illegal digging and international art dealers". Digging tapered off after about 2005, with tighter export controls and a glut of fakes | The looted sites (place, as an area); Nigeria's export law (to cite) |
| 6 | The museum head that is not Nok: Cleveland's "Nok-culture style" head is dated 20–620 CE, after the culture ended, and was first recorded with a Brussels dealer by 1994 | WS-X04 (Cleveland 1995.21), shown as a case |
| 7 | The argument, both readings (below) | The claims |

**Members.** 4 places (Nok, Jemaa, Taruga, Pangwari), 2 techniques (terracotta modelling, iron smelting), 1 period node and 2 objects, one of them a case. No excavated Nok figure has an open-licensed image yet; the Frankfurt project's and the Commission's images are the first requests.

**Neighbours.** Ife's terracotta and copper-alloy heads, much later, and whether they descend from Nok; Igbo-Ukwu's castings; and the iron sites of F1.6 (Douroula, Meroë), set side by side in Compare.

**Afterlives.** "Nok style" as a market label; fakes; museums' due diligence; and the national collection in Jos.

**What is argued.**

- Was iron smelting invented here or learned from elsewhere? Contested; taught in F1.6.
- What were the figures for? Fagg's smelting-ritual reading is one interpretation; what the excavations say about where figures were placed is to be taken from Breunig and Rupp's 2016 overview, and their use is not known.
- Is Nok ancestral to Ife? Argued, with no documented link.
- Which museum pieces are Nok at all? Without a findspot, attribution rests on style and on dating tests that can be faked.

**Apply** (F1.6, with a link from F1.24)

- Maker: write the label for an object whose findspot is unknown: what you can say, and what you must not.
- Briefer: write the due-diligence clause a brief needs before any "Nok-style" reference: findspot, export record and date test.

## Grouping page: the Igun Eronmwon guild

The guild's page gives a collective maker the credit that museum records give to "Court of Benin": it follows the Oba's brass casters from the palace to Igun Street, where they still work. The card's rule is that the guild's own account comes first and museum records second.

**Card**

| Part | Content |
|---|---|
| Kind | Maker community: a guild of the Oba's court |
| Line | Benin City's royal brass-casting guild, casting for the Oba for centuries, still working on Igun Street. |
| Own name | Igun Eronmwon; the tone-marked Edo spelling to be taken from Digital Benin's Edo catalogue |
| Span and places | Benin City. Founded, in court oral history, in the 13th century; housed in the palace until 1897; on Igun Street today |
| Membership | Hereditary, father to son (the Met, 2025); living members named with consent; historic casters unnamed in museum records |
| Leaves out | The names of the casters of the historic works; the miners and traders behind the metal |

**Walk**

| Step | What the learner meets | Members lit |
|---|---|---|
| 1 | The origin, in the court's words: one of several court histories says a foreign artisan, Ahammangiwa or Iguegha, brought lost-wax casting in the 13th century. Marked as oral history; the guild's own telling is recorded first | The guild; lost-wax casting (technique) |
| 2 | A palace guild: the highest-ranking of up to 50 guilds, housed in the palace and working under the Oba's exclusive patronage | The palace (place); the Oba (patron) |
| 3 | The plaques, 1500s–1600s, cast for the palace in brass made largely from Rhineland manillas traded along the Atlantic coast | WS-010 (Cleveland 1999.1, CC0); brass (material) |
| 4 | The heads, made for royal ancestral altars | WS-011 (Cleveland 1938.6, CC0), shown only as Q21 decides |
| 5 | 1897: British forces take the palace's objects in what they called a "punitive expedition"; casters flee the city. WS-010 goes to the British Museum, which sells it in 1950 | The 1897 assault (event) |
| 6 | Igun Street today: casting taught father to son; bracelets, bells, leopards and heads made alone and together (the Met's 2025 film) | Igun Street (place); PR-003 (living practice) |
| 7 | Records and returns: Digital Benin links 5,304 objects in 139 institutions in 21 countries, with an Edo-language catalogue | Digital Benin (dataset) |

**Members.** 1 guild, 2 places, 1 patron role, 1 technique, 1 material, 1 event, 1 dataset, 1 living practice and 2 historic objects. New castings by living members are theirs: images only with the guild's consent and credit.

**Neighbours.** Ife's copper-alloy heads, to which some origin accounts point; Igbo-Ukwu's castings, centuries earlier and made differently; Benin's other palace guilds; and the Rhineland brass trade, set side by side in Compare.

**Afterlives.** Igun Street as a working street that visitors come to; new castings sold to the palace and to buyers; "Benin Bronzes" as a name, when most are brass; and restitution.

**What is argued.**

- Where casting came from: some court histories point to Ife, and the Met's summary names a foreign artisan. Both kept as oral history, with the guild's version first.
- When the plaques were made and what they did on the palace walls: probable, from style and early European descriptions (to source).
- Where returned objects should go and who holds them: argued in Nigeria since the returns began; to be written from dated sources only.

**Apply** (the end of F1.6, with a link from F1.23)

- Maker: write the credit line for a work your studio makes together, naming the group before any person.
- Briefer: draft the clause a brief needs when a client wants to "reference Benin bronzes": who the living makers are, and how they are engaged, credited and paid.

## Mockups

The F1 Mockups canvas is at version 4, with a new row for the grouping page and the Atlas switcher redrawn to the Atlas Logic model.

- **F1.1 desk.** The seven-view switcher becomes a node card plus four surfaces (Place, Time, Connections, Groupings) and a Story layer toggle, as Q9 recommends. The unit bar counts 37 units, and the attribution card now carries the tablet's provenance line from §1.
- **Mingei, desk.** The card on the left, with membership drawn in the confidence grammar (solid for documented, dashed for claimed); walk step 4 in the centre, lighting Mashiko, Kyoto and St Ives on a schematic map and 1955 on the timeline; members on the right, where Hamada's vase is a link tile marked "in copyright". The Apply box switches with the Maker and Briefer lanes.
- **Nok, phone.** The contested-membership warning sits under the title. Step 6 shows the timeline with Nok's three phases ending at the turn of the era and Cleveland's head, 20–620 CE, drawn after it.

## Decisions and next steps

| # | Decision | Recommendation |
|---|---|---|
| Q19 | The provenance fields (§1) | Two fields, "1970 test" and "history gap"; the colonial-context screen for objects after 1800 from colonised regions; "not applicable" for decorative and signed modern work; an export-law line on the card |
| Q20 | The five records that fail or fall outside the test | Jōmon vessel and Luristan bit become cases; the child's coat becomes a case and WS-102 the silk exemplar; the Iznik spandrel is dropped; the throwing knife is replaced if an earlier-documented example is licensed |
| Q21 | What "funerary and ancestral" means | B, contextual: never human remains, sacred or secret material, or anything a descendant community or its representatives ask not to show; other grave goods and altar objects shown with their origin on the card and a content note. A (exclude all) would remove about eight exemplars, among them the Paracas textiles, the Shang bronzes and the Benin head; C (case by case) leaves the rule to each pre-read |
| Q22 | The two museum enquiries | Drafted now; sent from the project's address when the harvest runs, with any new gaps batched in |
| Q23 | The 42 pre-read fixes | Chapter wording fixed as each unit spec is written; the six cross-cutting fixes go into template v3 and the pack now |
| Q24 | Historian pack v2 | Yes, before the specs: world briefs for all 11 chapters, the corrected sample reply, rules 13–16, the naming rule and the Q21 rule, and current counts |
| Q25 | Naming the Gulf | "The Gulf" in the program's voice; official titles quoted exactly as published; Magan described as the Oman peninsula, today Oman and the UAE |
| Q26 | The grouping-page pattern | Adopt the three pages as the pattern, with a rights line and "the community's own account first" for maker communities. Next five: the Indian Ocean, the Indus Valley civilisation, the waqf, Arts and Crafts, and the Middle Horizon once its card is fixed |

**Next steps.**

1. Template v3 and Historian pack v2 (Q19, Q21, Q23–Q25).
2. The standard and light specs for the remaining 26 units, in batches, with the pre-read fixes applied, then G3.
3. The next five grouping pages.
4. The harvest, when a build environment with open internet exists: harvest.py over the register, then the Rijksmuseum, Te Papa, the Smithsonian and Australian state collections for the Pacific, steppe and textile gaps.
5. Your three writing samples, for the voice guide.

## Sources

Opened for this round, 28 September 2026:

- The Met, object pages and their provenance tabs: [329081](https://www.metmuseum.org/art/collection/search/329081), [327384](https://www.metmuseum.org/art/collection/search/327384), [675980](https://www.metmuseum.org/art/collection/search/675980), [444375](https://www.metmuseum.org/art/collection/search/444375); open API records [329081](https://collectionapi.metmuseum.org/public/collection/v1/objects/329081) and [249469, the Ennion cup](https://collectionapi.metmuseum.org/public/collection/v1/objects/249469)
- [Cleveland Museum of Art Open Access API](https://openaccess-api.clevelandart.org/api/artworks/): records 1984.68, 1960.288, 1957.36, 1970.16, 2015.156, 2004.70, 1980.102, 1996.2.1, 1961.33, 1940.469, 1962.244, 1995.17, and for Mingei 1963.505, 1983.9, 1982.26 and 2000.145
- [Art Institute of Chicago API](https://api.artic.edu/api/v1/artworks/search), record 1986.1043
- [The Japan Folk Crafts Museum, history](https://mingeikan.or.jp/about/history/?lang=en)
- [The Met, ](https://www.metmuseum.org/perspectives/bronze-casters-igun-street)[*Bronze Casters of Igun Street*](https://www.metmuseum.org/perspectives/bronze-casters-igun-street) (film and text, 2025)
- [Archaeology magazine, "The Nok of Nigeria"](https://archaeology.org/issues/online/features/the-nok-of-nigeria/)
- [Franke, "A Chronology of the Central Nigerian Nok Culture", ](https://www.semanticscholar.org/paper/A-Chronology-of-the-Central-Nigerian-Nok-Culture-BC-Franke/d0c2ac2cb29a58fb9b41e44e0ae32d09dfd663e5)[*Journal of African Archaeology*](https://www.semanticscholar.org/paper/A-Chronology-of-the-Central-Nigerian-Nok-Culture-BC-Franke/d0c2ac2cb29a58fb9b41e44e0ae32d09dfd663e5)[ 14, 2016](https://www.semanticscholar.org/paper/A-Chronology-of-the-Central-Nigerian-Nok-Culture-BC-Franke/d0c2ac2cb29a58fb9b41e44e0ae32d09dfd663e5)
- [Dunne et al., "Honey-collecting in prehistoric West Africa from 3500 years ago", ](https://www.nature.com/articles/s41467-021-22425-4)[*Nature Communications*](https://www.nature.com/articles/s41467-021-22425-4)[ 12, 2021](https://www.nature.com/articles/s41467-021-22425-4)

Cited from earlier rounds and not re-opened: Kim Brandt, *Kingdom of Beauty* (2007); Yuko Kikuchi, *Japanese Modernisation and Mingei Theory* (2004); Skowronek et al. (2023) on Rhineland brass; Digital Benin. Items marked "to verify" above are not yet sourced.

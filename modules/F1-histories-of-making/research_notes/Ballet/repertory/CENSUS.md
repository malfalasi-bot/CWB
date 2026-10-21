# Ballet repertory census and cards-at-scale plan

Status: first pass complete 2026-10-21. Companion file: register.yaml (148 works). Sections: 1 what "all the ballets" means; 2 the register; 3 card design; 4 concept threads; 5 effort; 6 open items.
Conventions: every claim is marked **documented** (seen at source in this pass or harvested from Wikidata with a QID), **probable** (from working knowledge, not re-checked this pass), **contested** (sources disagree) or **argued** (an interpretive claim made here). "Earliest known", never "first". Japanese names in Japanese order (family name first). Quotes under 25 words.

## 0. Working log
- Created file; reading BRIEF_WORKS.md and W1–W3 to list the 33 works already taken apart.
- Wikidata harvest attempted 2026-10-21: (a) `curl` to query.wikidata.org/sparql through the session proxy returned "CONNECT tunnel failed, response 403"; (b) WebFetch of a URL-encoded SPARQL query was rejected by the proxy ("url exceeds the maximum fetchable length"); (c) WebFetch of the Wikidata API (`wbgetentities`) was blocked pending a permission that was not granted ("PROVENANCE_REQUIRED", told not to retry); (d) Firecrawl scrape failed (account out of credits). **Result: no live Wikidata harvest in this pass.** I did not route the same composed URL through other fetchers, because the permission system declined it. QIDs below appear only where a Wikidata page surfaced in a search result.
- Fallback: web search for the published lists (Wikipedia "List of ballets", Balanchine catalogue, Bachtrack statistics, company repertory pages); register built from those plus the W1–W3 files plus working knowledge (marked probable).

## 1. What "all the ballets" means

### 1.1 How the field draws the circle (sources seen this pass)
| Instrument | What it counts | Size | Status |
|---|---|---|---|
| Bachtrack annual statistics (2023 report, PDF) | Dance events listed on Bachtrack worldwide | 5,702 dance events in 2023; top 10 works: *Nutcracker, Swan Lake, Sleeping Beauty, Romeo and Juliet* (Prokofiev), *Cinderella* (Prokofiev), *Giselle, Don Quixote, Revelations, Night Creature, For Four* | documented (cdn.bachtrack.com/files/350970-Annual classical music statistics 2023.pdf) |
| Bachtrack statistics, January 2025 (for 2024) | same | *Nutcracker* "still the most performed ballet in the world", about 400 performances ahead of *Swan Lake*; Wheeldon's *Alice's Adventures in Wonderland* enters top 10; Sharon Eyal the only woman in top 20 choreographers (13th); Crystal Pite 21st; women are 3 of top 20 and 9 of top 50 living choreographers | documented (bachtrack.com/classical-music-statistics-january-2025) |
| Balanchine Catalogue (George Balanchine Foundation) | One choreographer's output incl. opera dances, musicals, film | "Over 400 works are documented" (site meta description) | documented (balanchine.org/?p=396) |
| Balanchine and Mason, *Balanchine's Complete Stories of the Great Ballets*, rev. ed. (Doubleday, 1977) | Synopses of repertory ballets | catalogue record gives no count; the book is commonly described as c. 400 ballets | record documented (library.holycross.edu/Record/b1108918); count probable |
| Balanchine, *101 Stories of the Great Ballets* (1954/1975 pbk) | The core synopsis canon | 101 by title | probable |
| Walter Terry, *Ballet Guide* (Dodd, Mead, 1976) | "more than five hundred of the world's major ballets" with credits, premiere date and place, original cast | 500+ | documented (libcat.library.tamu.edu/Record/in00000364859) |
| Koegler, *Concise Oxford Dictionary of Ballet* (OUP, 1977; 2nd ed. 1982) | Dancers, choreographers, composers, designers, ballets, theatres, schools, terms | "over 5,000" entries in all, of which works are a minority (estimate 1,000–1,500 ballet titles) | entry count documented (abebooks listing); ballet share argued |
| Beaumont, *Complete Book of Ballets* (1937) and *Supplement* (1942), *Ballets of Today* (1954), *Ballets Past and Present* (1955) | Synopses and production histories, 18th c. to 1950s | c. 300+ works across volumes | probable |
| Craine and Mackrell, *Oxford Dictionary of Dance* (2000; 2nd ed. 2010) | All theatre dance incl. modern; works get entries when canonical | c. 2,600 entries total; several hundred works | probable |
| Wikipedia, "List of ballets by title" | Title, composer, year | c. 445 titles A–S in the fetched excerpt; c. 550–600 in full | documented for A–S (en.wikipedia.org/wiki/List_of_ballets_by_title); total probable |
| Wikipedia decade lists ("List of 1870s ballet premieres" etc.) | Premieres by year | Each decade page tens to 100+ entries | pages seen in search; sizes not counted |
| Wikidata | Items whose "instance of" is ballet (stage work) | Not harvested: endpoint blocked in this session (see working log). Expect several thousand items, with sparse premiere/choreographer properties outside the European canon | **not verified** |

Company repertory lists (Royal Ballet via ROH Collections performance database; Paris Opéra; Mariinsky; Bolshoi; NYCB; ABT; National Ballet of China; Ballet Nacional de Cuba; Tokyo Ballet) were not fetched in this pass. Their working repertories are each typically 40–120 titles in living memory, with very heavy overlap in the nineteenth-century core (probable).

### 1.2 Three circles (estimate; argued)
- **Core: 100–150 works.** What a well-read person (critic, dance student, informed audience member) is expected to recognise by title, maker and premise. The convergence of *101 Stories*, the Bachtrack top 30 over a decade, and the shared repertory of the nine named companies lands here. The register below is this circle, widened deliberately beyond Europe and North America.
- **Specialist reference: 500–1,500 works.** What a single-volume reference covers with a credit block and synopsis (Terry 500+, Balanchine–Mason c. 400, Koegler perhaps 1,000–1,500 titles, Wikipedia list c. 600).
- **What exists: tens of thousands.** Every company makes new works each season; Balanchine alone over 400 catalogued works; Petipa c. 70 full-length works plus dances in operas; Soviet republics, China and Latin America add national repertories that English references undercount. A defensible order of magnitude for named, premiered ballets since 1581 is 20,000–50,000 (argued; no census exists). "Every ballet has a card" is therefore a policy for a growing circle, not a finishable list.


### 1.3 Harvestable structured sources found in passing (for the scale-up)
- **ROH Collections** (rohcollections.org.uk) has a "Ballet: Work details" page per work with choreographer, composer, music title, work definition and world premiere date and place (seen for *Carmen Suite*: "20 April 1967, Bolshoi Theatre, Moscow"). Documented. Best single harvest target for the Western and Soviet core.
- **Showa University of Music Ballet Archive** (バレエアーカイブ, ballet-archive.tosei-showa-music.ac.jp) has a structured work record (初演年, 初演情報, 振付家, 作曲家) e.g. ザ・カブキ: 1986年4月16日, 東京文化会館, 東京バレエ団, ベジャール, 黛敏郎. Documented from a search highlight; the index page could not be fetched (permission not granted). Best harvest target for works staged in Japan.
- **National Ballet of China** (nbc.cn) lists its repertory by decade with music, choreographer, design, premiere date and venue (seen for 《祝福》 and 《大红灯笼高高挂》). Documented.
- **Teatro alla Scala archive** performance records give full credit lists (seen for *The Kabuki*, 9 Sept 1986 at La Scala). Documented.
- **Universal Ballet** (Seoul) repertory pages give premiere, libretto, choreography, music, design (seen for *Shim Chung*). Documented.
- **INBA digital** (Mexico) and **UNAM Biblioteca Digital Silvestre Revueltas** give premiere and libretto data (seen for *La Coronela*). Documented.
- **ESAT** (Encyclopaedia of South African Theatre, esat.sun.ac.za) has production histories (seen for *Raka*). Documented.
- **Bangarra Knowledge Ground** has full credits and premiere seasons (seen for *Rites*). Documented.

## 2. The core register (register.yaml)

**148 works**, 1581 to 2022, one row per *version* (a remake gets its own row and points to its parent with `based_on: remake of <id>`).

| Measure | Count | Note |
|---|---|---|
| Tier A (full card exists in W1–W3) | 35 | the 33 W-file cases, with Ek and Masilo split into two rows each |
| Tier B (needs a full card) | 48 | works that anchor a thread, are in the Bachtrack top tier, or carry a region or a woman maker the A set lacks |
| Tier C (short card) | 65 | |
| Confidence: documented | 49 | 34 from W1–W3 citations (the 35th, *Red Detachment*, is contested); 15 checked at source in this pass (Maiden Tower, La Coronela, Gayane, Estancia, Fish Beauty, Çeşmebaşı, Carmen Suite, Raka, Rama Hari, New Year's Sacrifice, The Kabuki, Shim Chung, Rites, Raise the Red Lantern, Cleopatra) |
| Confidence: probable | 97 | working knowledge, not re-checked; dates are likely right for the European canon, weakest for *Autumn Leaves, Tarde en la siesta, Ecstasy of Rita Joe, Frida, common ground[s], Jane Eyre* |
| Contested | 2 | *Autumn Leaves* (place, year); *Red Detachment* (premiere date) |
| Women choreographers (sole or shared) | 34 | from Sallé (1734) and Marie Taglioni (1860) to Masilo, Pite, Marston, Acogny; the *Indes galantes* match is a probable Sallé entrée only |
| Works made outside western Europe, North America and Russia proper | 29 | Azerbaijan, Armenia, Tatarstan, Mexico, Argentina, Cuba, China (6), Japan (2), Korea, Philippines, Turkey, Egypt (2), South Africa (3), Senegal, Australia (Indigenous), plus subject-from-elsewhere cases |
| Periods | court 3, enlightenment 7, romantic 11, imperial 11, modernist 46, postwar 40, late20 15, c21 15 | the modernist and postwar weight mirrors the anthologies; late-20th and 21st century are under-sampled |

Conventions to keep when the register grows:
- **Version identity.** "Swan Lake" is a family, not a work. Cards hang on versions; a family page lists them (W3 already argues this).
- **Russian dates before 1918** are given in New Style (Gregorian) in the register (probable for each; Old Style is 12 days earlier in the 19th century, 13 after 1900). Cards should print both.
- **Names.** Japanese and Chinese names family name first, with the original script; Russian in a consistent transliteration (the register uses common English spellings: Petipa, Tchaikovsky, Grigorovich).
- **No composed URLs.** Every URL in `sources` was returned by a search or fetch in this pass; QIDs are absent because Wikidata could not be reached.

Gaps the register still has (argued): no Indian, Iranian, Gulf, Indonesian, Brazilian or West African company-made ballet (Brazil's *Uirapuru*, Indonesia's ballet-sendratari crossovers and Iran's pre-1979 National Ballet are candidates); post-2000 repertory is thin outside London; Sharon Eyal (the only woman in Bachtrack's top 20) has no row because her most-performed work could not be confirmed.

## 3. Card design at three depths

### 3.1 Full card (Tier A and B): the ten-heading template
Exactly the ten headings of works/BRIEF_WORKS.md (premise; roots; who had it and how it was developed; the world it built; the team and the credit; production; reception and afterlife; primary documents and open images; best sources; Concept DNA reading). Length 1,200–1,800 words (the W files average about 1,450 per work). Add a header block that is the short card (3.2), so every full card also works as a short card.

### 3.2 Short card (every work): about 150 words, two minutes

**Superseded 22 October 2026** by the concept-first short card in `../CASE_WORLD_PLAN.md` §3.2 (idea, built from, the world, the look, the family, off the stage, remade as, threads, credit in one line). The table below is kept as the record of the first design; its harvestable fields still feed the credit line and the index row.

| Field | Content | Harvestable? |
|---|---|---|
| Title | original script + English | yes (Wikidata labels, company sites) |
| Premiere line | date (both calendars if Russian pre-1918), city, theatre, company | yes, but check (dates disagree between sources in about 1 case in 10 in this pass: *New Year's Sacrifice*, *Red Detachment*) |
| Makers line | choreographer, composer, scenario, designer, in that order; women and uncredited makers named | partly: Wikidata P1809 choreographer, P86 composer, P87 librettist are often present for the canon, rarely for designers; uncredited makers need research |
| Source | the text, image, event or tradition it came from | partly (P144 "based on"); visual and folk sources need research |
| Premise | one sentence in our words | no: write it; human check |
| The rule | one sentence: what makes this world itself (from the W-file "core rule") | no: research and argued |
| Lineage | answers what, was remade as what (two links to other cards) | partly (from the register's `based_on`/remake links); judgement needed |
| Threads | 2–4 concept tags from §4 | no: argued; human check |
| See it | one open image or film, with licence | no: rights research (scope/03, scope/04 notes) |
| Confidence | documented / probable / contested flags on date and credits | produced by the process |

Template (about 150 words):
> **Title** (original) · year · city, theatre · company
> *Choreography* X · *music* Y · *scenario* Z · *design* W
> *From:* source. **Premise:** one sentence. **Its rule:** one sentence. **Lineage:** answers A; remade as B, C. **Threads:** T05 exotic other, T13 remake. **See:** image (licence). Confidence: dates documented; design credit probable.

### 3.3 Index row (the 500–1,500 specialist circle and beyond)
`id | title (orig / en) | year | city | company | choreographer | composer | period | region | threads? | tier | confidence | source`. Fully harvestable except threads, which can be left blank until a short card is written.

### 3.4 What can be harvested, what needs research and a human check
- **Harvestable** (with a check pass): titles, premiere date and place, company, choreographer, composer, librettist, often designer, "based on" for literary sources, revival lists. Best targets: Wikidata (when reachable), ROH Collections work pages, the Showa University Ballet Archive (Japan), National Ballet of China repertory pages, La Scala archive, Paris Opéra and Mariinsky/Bolshoi repertory pages, the Balanchine Catalogue, company sites such as Universal Ballet and Bangarra.
- **Needs research**: who originated the idea (often not the credited choreographer: *Red Poppy*, *Schéhérazade*, *Sacre* are contested in W2); visual and folk sources; uncredited makers (folk informants, scene painters, women designers, assistant choreographers); borrowing debates (*Création du monde*, *Raka*, *The Kabuki*); the world's rules and anti-DNA; reception; afterlife and adjacent translation.
- **Needs a human check every time**: the premise wording; thread tags; any "earliest known" claim; image licences; version identity (which *Giselle* is meant); dates across calendars; name order and script.

## 4. Cross-work concept threads (24)

Each thread lists the register works that carry it (from the `threads` field; counts in brackets). Tagging is **argued**: it is our reading, to be checked by a human, and a work usually carries two to four threads. For teaching, each thread gets a comparison wall: pick 6–10 cards spanning at least three centuries and three regions.

- **T01 Two worlds** (26): a real world and a supernatural or dream world, crossed by the hero. balet-comique-1581, ballet-de-la-nuit-1653, don-juan-angiolini-1761, robert-le-diable-nuns-1831, sylphide-1832, sylphide-bournonville-1836, giselle-1841, napoli-1842, papillon-1860, pharaohs-daughter-1862, bayadere-1877, swan-lake-1877-1895, sleeping-beauty-1890, nutcracker-1892, pavillon-darmide-1907, les-sylphides-1909, firebird-1910, spectre-de-la-rose-1911, shurale-1950, white-haired-girl-matsuyama-1955, stone-flower-1957, fish-beauty-1959, the-dream-1964, shim-chung-1986, alice-wheeldon-2011, like-water-for-chocolate-2022. *Wall:* Sylphide → Bayadère → Shurale → Fish Beauty → Shim Chung → Alice.
- **T02 The white act** (13): a corps of identical women in white as spirits. robert-le-diable-nuns-1831, sylphide-1832, sylphide-bournonville-1836, giselle-1841, bayadere-1877, swan-lake-1877-1895, les-sylphides-1909, serenade-1934, the-cage-1951, giselle-alonso-1945-1963, creole-giselle-1984, giselle-khan-2016, giselle-masilo-2017. *Wall:* the nuns (1831) to Khan's factory ghosts (2016): who is allowed to be the white corps.
- **T03 The bird-woman and creature-woman** (15): flore-et-zephire-1796, sylphide-1832, sylphide-bournonville-1836, papillon-1860, swan-lake-1877-1895, dying-swan-1905, firebird-1910, autumn-leaves-pavlova-1918, icare-1935, shurale-1950, the-cage-1951, fish-beauty-1959, swan-lake-ek-1987, swan-lake-bourne-1995, swan-lake-masilo-2010. *Wall:* swan, firebird, Tatar bird-maiden, Chinese fish-spirit, Bourne's male swan.
- **T04 The automaton, doll and puppet** (11): pygmalion-salle-1734, creatures-of-prometheus-1801, coppelia-1870, nutcracker-1892, petrushka-1911, boutique-fantasque-1919, triadic-ballet-1922, cesmebasi-1965, hard-nut-1991, el-leila-el-kebira-2001, the-cellist-2020. *Wall:* Pygmalion's statue, Coppélia, Petrushka, Schlemmer's figurines, Karagöz in Ankara, Cairo's puppets turned dancers.
- **T05 The exotic other** (27): bourgeois-gentilhomme-1670, indes-galantes-1735, sylphide-1832, napoli-1842, esmeralda-1844, paquita-1846, corsaire-1856, pharaohs-daughter-1862, don-quixote-1869, bayadere-1877, excelsior-1881, nutcracker-1892, raymonda-1898, scheherazade-1910, petrushka-1911, tricorne-1919, creation-du-monde-1923, red-poppy-1927, bolero-nijinska-1928, fountain-bakhchisarai-1934, carmen-petit-1949, legend-of-love-1961, song-of-the-earth-1965, carmen-suite-1967, rama-hari-1980, the-kabuki-1986, cleopatra-cairo-2019. *Wall:* pair each Orientalist work with a work made from inside the culture depicted (Bayadère / Rama Hari; Schéhérazade / Cleopatra; Pharaoh's Daughter / Cleopatra; The Kabuki with the Matsuyama White-Haired Girl).
- **T06 The fairy tale** (15): papillon-1860, swan-lake-1877-1895, sleeping-beauty-1890, nutcracker-1892, firebird-1910, boutique-fantasque-1919, cinderella-zakharov-1945, shurale-1950, stone-flower-1957, fish-beauty-1959, the-dream-1964, shim-chung-1986, hard-nut-1991, alice-wheeldon-2011, sleeping-beauty-ratmansky-2015.
- **T07 The peasant and the prince** (17): love across class. fille-mal-gardee-1789, sylphide-1832, giselle-1841, paquita-1846, coppelia-1870, bayadere-1877, swan-lake-1877-1895, tricorne-1919, laurencia-1939, cinderella-zakharov-1945, miss-julie-1950, estancia-1952, fille-mal-gardee-ashton-1960, new-years-sacrifice-1981, giselle-ek-1982, creole-giselle-1984, giselle-khan-2016. *Wall:* Giselle's class gap re-set in Louisiana caste, a Swedish asylum and a Bangladeshi garment factory.
- **T08 Revolution and the collective hero** (18): rite-of-spring-1913, les-noces-1923, pas-dacier-1927, red-poppy-1927, golden-age-1930, bolt-1931, green-table-1932, flames-of-paris-1932, bright-stream-1935, laurencia-1939, la-coronela-1940, gayane-1942, white-haired-girl-matsuyama-1955, red-detachment-1964, white-haired-girl-shanghai-1965, spartacus-1968, giselle-khan-2016, flight-pattern-2017. *Wall:* Moscow 1927, Mexico City 1940, Tokyo 1955, Beijing 1964: one form, four states.
- **T09 The machine age** (15): flore-et-zephire-1796, excelsior-1881, jeux-1913, parade-1917, maries-tour-eiffel-1921, triadic-ballet-1922, skating-rink-1922, creation-du-monde-1923, train-bleu-1924, relache-1924, pas-dacier-1927, golden-age-1930, bolt-1931, anna-karenina-plisetskaya-1972, in-the-middle-1987.
- **T10 Plotless and music-led** (21): pas-de-quatre-1845, les-sylphides-1909, triadic-ballet-1922, relache-1924, apollon-musagete-1928, les-presages-1933, serenade-1934, les-patineurs-1937, four-temperaments-1946, symphonic-variations-1946, symphony-in-c-1947, agon-1957, bolero-bejart-1961, song-of-the-earth-1965, jewels-1967, dances-at-a-gathering-1969, push-comes-to-shove-1976, in-the-upper-room-1986, in-the-middle-1987, woolf-works-2015, flight-pattern-2017. *Teaching point:* a world with no story still has rules (palette, costume, music structure).
- **T11 Sport, leisure and the everyday** (17): fille-mal-gardee-1789, jeux-1913, parade-1917, maries-tour-eiffel-1921, skating-rink-1922, les-biches-1924, train-bleu-1924, golden-age-1930, les-patineurs-1937, checkmate-1937, rodeo-1942, fancy-free-1944, estancia-1952, agon-1957, fille-mal-gardee-ashton-1960, push-comes-to-shove-1976, in-the-upper-room-1986.
- **T12 Myth and antiquity** (16): balet-comique-1581, pygmalion-salle-1734, medee-et-jason-1763, flore-et-zephire-1796, creatures-of-prometheus-1801, sylvia-1876, apres-midi-faune-1912, rite-of-spring-1913, creation-du-monde-1923, apollon-musagete-1928, prodigal-son-1929, les-presages-1933, icare-1935, spartacus-1968, rama-hari-1980, cleopatra-cairo-2019.
- **T13 The remake** (33): sylphide-bournonville-1836, dying-swan-1905, les-sylphides-1909, bolero-nijinska-1928, the-cage-1951, afternoon-faun-robbins-1953, sacre-bejart-1959, fille-mal-gardee-ashton-1960, bolero-bejart-1961, red-detachment-1964, romeo-juliet-macmillan-1965, white-haired-girl-shanghai-1965, carmen-suite-1967, jewels-1967, spartacus-1968, sacre-bausch-1975, push-comes-to-shove-1976, rama-hari-1980, giselle-ek-1982, giselle-alonso-1945-1963, creole-giselle-1984, the-kabuki-1986, swan-lake-ek-1987, in-the-middle-1987, hard-nut-1991, swan-lake-bourne-1995, rites-page-1997, el-leila-el-kebira-2001, swan-lake-masilo-2010, sleeping-beauty-ratmansky-2015, giselle-khan-2016, giselle-masilo-2017, common-grounds-acogny-2021. *Walls:* the Giselle family (7 rows), the Rite family (Nijinsky, Béjart, Bausch, Page, the African-cast Bausch), the Swan Lake family (5).
- **T14 Folk as national idiom** (40): the national school built from folk material. fille-mal-gardee-1789, napoli-1842, don-quixote-1869, coppelia-1870, raymonda-1898, firebird-1910, petrushka-1911, rite-of-spring-1913, tricorne-1919, les-noces-1923, bolero-nijinska-1928, flames-of-paris-1932, bright-stream-1935, billy-the-kid-1938, laurencia-1939, maiden-tower-1940, la-coronela-1940, rodeo-1942, gayane-1942, fancy-free-1944, shurale-1950, estancia-1952, stone-flower-1957, fish-beauty-1959, revelations-1960, fille-mal-gardee-ashton-1960, red-detachment-1964, cesmebasi-1965, dances-at-a-gathering-1969, tarde-en-la-siesta-1973, rama-hari-1980, giselle-alonso-1945-1963, the-kabuki-1986, shim-chung-1986, rites-page-1997, el-leila-el-kebira-2001, swan-lake-masilo-2010, giselle-masilo-2017, frida-lopez-ochoa-2020, common-grounds-acogny-2021. *Wall:* the "earliest known national ballet" cluster: Baku 1940, Mexico City 1940, Perm 1942 (Armenian), Kazan 1945 (Tatar), Buenos Aires 1952, Beijing 1959, Ankara 1965, Pretoria 1967, Manila 1980, Seoul 1986.
- **T15 The abandoned or destroyed woman** (24): the heroine dies of love, betrayal or the social order. medee-et-jason-1763, giselle-1841, autumn-leaves-pavlova-1918, fountain-bakhchisarai-1934, rakes-progress-1935, romeo-juliet-lavrovsky-1940, maiden-tower-1940, jeune-homme-et-la-mort-1946, fall-river-legend-1948, carmen-petit-1949, miss-julie-1950, anna-karenina-plisetskaya-1972, manon-1974, mayerling-1978, lady-of-camellias-1978, new-years-sacrifice-1981, giselle-ek-1982, creole-giselle-1984, raise-the-red-lantern-2001, giselle-khan-2016, jane-eyre-marston-2016, giselle-masilo-2017, cleopatra-cairo-2019, the-cellist-2020.
- **T16 Rite and sacrifice** (10): the chosen one given up for the group. rite-of-spring-1913, les-noces-1923, the-cage-1951, sacre-bejart-1959, revelations-1960, raka-1967, sacre-bausch-1975, shim-chung-1986, rites-page-1997, common-grounds-acogny-2021.
- **T17 Court, power and spectacle** (13): ballet as statecraft or about the state. balet-comique-1581, ballet-de-la-nuit-1653, bourgeois-gentilhomme-1670, excelsior-1881, sleeping-beauty-1890, green-table-1932, checkmate-1937, agon-1957, mayerling-1978, swan-lake-bourne-1995, raise-the-red-lantern-2001, sleeping-beauty-ratmansky-2015, cleopatra-cairo-2019.
- **T18 The literary adaptation** (38): novel, play or poem made into movement without words. See register; anchors: esmeralda-1844, fountain-bakhchisarai-1934, romeo-juliet-lavrovsky-1940, onegin-1965, manon-1974, new-years-sacrifice-1981, raise-the-red-lantern-2001, woolf-works-2015, like-water-for-chocolate-2022. *Teaching point:* what a ballet must cut, and how it shows interior life.
- **T19 The maker and the made** (10): artist, muse and creation. pygmalion-salle-1734, creatures-of-prometheus-1801, coppelia-1870, apollon-musagete-1928, jeune-homme-et-la-mort-1946, afternoon-faun-robbins-1953, stone-flower-1957, legend-of-love-1961, frida-lopez-ochoa-2020, the-cellist-2020. *Directly useful to a design course.*
- **T20 The dream or vision scene** (13): ballet-de-la-nuit-1653, robert-le-diable-nuns-1831, pharaohs-daughter-1862, don-quixote-1869, bayadere-1877, sleeping-beauty-1890, nutcracker-1892, raymonda-1898, pavillon-darmide-1907, spectre-de-la-rose-1911, red-poppy-1927, cinderella-zakharov-1945, alice-wheeldon-2011. *Note:* the opium dream links T05 and T20 (Pharaoh's Daughter, Bayadère, Red Poppy).
- **T21 Fair, festival and carnival** (9): napoli-1842, esmeralda-1844, don-quixote-1869, petrushka-1911, parade-1917, maries-tour-eiffel-1921, bright-stream-1935, cesmebasi-1965, el-leila-el-kebira-2001. *Wall:* Petrushka's Butter Week fair, Ankara's village fountain with Karagöz, Cairo's moulid.
- **T22 Gender re-cast and queer readings** (9): les-biches-1924, bright-stream-1935, rodeo-1942, bolero-bejart-1961, swan-lake-ek-1987, hard-nut-1991, swan-lake-bourne-1995, swan-lake-masilo-2010, woolf-works-2015.
- **T23 Encounter, colony and Indigeneity** (7): indes-galantes-1735, creation-du-monde-1923, billy-the-kid-1938, raka-1967, ecstasy-of-rita-joe-1971, rites-page-1997, flight-pattern-2017. *Wall:* who is on the team when a culture is staged: Création du monde (none of the culture), Raka (none, under apartheid), Rita Joe (settlers), Rites (Bangarra co-authorship).
- **T24 A woman against family and patriarch** (25): forced marriage, filial duty, the woman's choice. jardin-aux-lilas-1936, romeo-juliet-lavrovsky-1940, maiden-tower-1940, pillar-of-fire-1942, gayane-1942, fall-river-legend-1948, miss-julie-1950, white-haired-girl-matsuyama-1955, red-detachment-1964, romeo-juliet-macmillan-1965, onegin-1965, white-haired-girl-shanghai-1965, carmen-suite-1967, ecstasy-of-rita-joe-1971, anna-karenina-plisetskaya-1972, tarde-en-la-siesta-1973, manon-1974, sacre-bausch-1975, lady-of-camellias-1978, new-years-sacrifice-1981, shim-chung-1986, raise-the-red-lantern-2001, jane-eyre-marston-2016, frida-lopez-ochoa-2020, like-water-for-chocolate-2022. *Wall:* Baku 1940, Beijing 1964 and 1981 and 2001, Seoul 1986: the same plot under different states.

Threads proposed in the brief and how they map: two worlds = T01; white act = T02; bird-woman = T03; automaton or doll = T04; exotic other = T05; fairy tale = T06; peasant and prince = T07; revolution and collective hero = T08; machine age = T09; plotless and music-led = T10; sport and leisure = T11; myth and antiquity = T12; the remake = T13. Added: T14–T24.

## 5. Effort (estimate; argued)

Basis: the W files run about 14,000–15,000 words for 10–13 works (about 1,450 words per full card), and each took one agent research pass plus the human review already done on them. Human times assume a researcher with library access and a reviewer who knows the field.

| Product | Units | Agent research | Human check | Notes |
|---|---|---|---|---|
| Full cards, Tier B | 48 | 5 batches of about 10 works, the same method as W1–W3 | 1–1.5 days per card (sources, contested credits, image rights, Concept DNA reading): about 50–70 person-days, or 10–14 weeks for one person | the slowest work is rights research on images and verifying "who had the idea" |
| Short cards, all register works | 148 (35 can be cut from existing full cards) | about 113 new cards in 4–6 batches of 20–30 | 20–30 minutes each: about 40–55 hours, or 1–1.5 weeks | most facts are already in register.yaml; the new work is premise, rule, lineage, threads, one image |
| Index rows, specialist circle | 500–1,500 | 1–2 days to build harvest scripts once Wikidata is reachable (plus ROH Collections, Showa Ballet Archive, NBC, company sites) | 3–5 minutes per row to check date, version identity and names: 25–125 hours | quality falls sharply outside Europe; budget extra for Chinese, Japanese, Arabic and Spanish-language sources |
| Thread walls | 24 | 1 batch to draft a 300-word introduction and choose 6–10 cards for each | half a day per wall: about 12 days | needs the short cards first |

Total to bring the register of 148 to full depth (B full cards, all short cards, thread walls): about **15–20 person-weeks** of human time plus about 12–15 agent passes. A version with short cards only and thread walls (no new full cards): about **4–5 person-weeks**. Each further 100 works at index-row depth: about 1 week; at short-card depth: about 2 weeks.

Order of work (recommended): (1) unblock Wikidata and run the harvest to check the 97 probable rows; (2) write the short cards for all 148 so every work has a card at once; (3) write full cards for the B tier, starting with the works that complete thread walls the A set leaves one-sided (T05 pairs from inside the culture, T14 national ballets, T23 encounter, T24 women); (4) extend at index-row depth to the specialist circle.

## 6. Open items for the human check
- Wikidata harvest not run (blocked); no QIDs in the register. Run it: class to check is the item for "ballet" as a *stage work* (instance-of), not "ballet" the art form; the Q-numbers in the brief (Q1572) were not verified.
- Showa University Ballet Archive and Wikidata API pages were blocked by unanswered permission prompts; nothing was fetched around those blocks.
- Unverified premieres flagged in `note` fields: *Autumn Leaves*, *Tarde en la siesta*, *Ecstasy of Rita Joe*, *Frida*, *common ground[s]*, *Jane Eyre*, *White-Haired Girl* (Shanghai) choreographer, *Çeşmebaşı* choreographer (de Valois probable, not stated in the source seen).
- Boundary cases kept on purpose and marked: comédie-ballet and opéra-ballet (*Bourgeois gentilhomme*, *Indes galantes*), an opera scene (*Robert le diable*), Bauhaus stage (*Triadic Ballet*), modern dance (*Revelations*, *La Coronela*, Bausch). The owner should decide whether "every ballet" includes them; Bachtrack's dance statistics do.

## 7. Working log (continued)
- Searches: Bachtrack 2023 PDF and January 2025 statistics; Balanchine Catalogue; Terry *Ballet Guide* record; Balanchine–Mason 1977 record; Koegler listing; Wikipedia list of ballets; per-work checks for 15 non-canonical works (Exa search highlights).
- register.yaml: 148 entries, parsed as valid YAML; no duplicate ids.

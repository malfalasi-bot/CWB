# Edo and the floating world: content inventory for the motion study

Built 2026-10-12 from F1.8 / build/units/edo (v4 story.yaml, 71 beats, 9 overture shots). Read-only on the content; `inventory.json` beside this file carries the same data with coordinates copied from `places.yaml`.

**Scales.** edo = the 1859 city map; japan = the Kantō and Japan; world = the globe.  
**Ids.** event ids e… from timeline.yaml; x… = incidents with no timeline entry; place ids from places.yaml world/city; tokaido-<n> = places.yaml tokaido list by n (no ids there); routes.<r>[<i>] = a route stop; person and image ids as in people.yaml and images.json; desk-<id> = desks.json prints; hv-<nnn> = views.json.  
**Confidence.** as the sources mark it: documented / probable / contested / argued; reconstruction where the unit labels one.  
Places marked * are `approx: true` in places.yaml. `undated` means the sources give no year; nothing here is guessed.

**Counts.** events 96 (54 on the timeline, 42 told without a timeline entry) · journeys 20 · objects 80 · groups 16 · lectures 8 · interactives 10 · gaps 39.

## 1. Events

The 54 timeline events in timeline.yaml order, then the incidents the story or the v0 lectures tell without a timeline mark (ids `x…`). "Beats" are story.yaml beats whose `show:` names the event (for `x…` events, beats whose text tells it). "v0" is the lecture and station in EDO_FULL_CASE.md.

| id | label | years | scale | kind | places | people | objects | beats | v0 lecture/station | conf | sources | note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| e1603 | The shogunate at Edo | 1603 | edo | incident | castle, edo | ieyasu | portrait-ieyasu | b1-1 | L1 S1 Edo in 1603 | documented | wiki-edo, christies-edo | The case notes the Met dates the period from 1615; both conventions shown there, 1603 only here. |
| e1635 | Lords ordered to live in Edo in alternate years | 1635 | japan | order | edo, kyoto, osaka | ieyasu | — | b1-1 | L1 S2 The lords' order | documented | wiki-edo, christies-edo |  |
| e1641 | The Dutch confined to Dejima | 1641 | japan | order | nagasaki | — | — | — | L5 S1 (the pigment reaches Nagasaki on Dutch ships); L7 S1 Dejima’s trade | documented | wiki-dejima, voc-route | No story beat shows e1641; it is on the timeline only. |
| e1657 | The Meireki fire | 1657 | edo | fire | hongo*, koishikawa*, kojimachi*, castle | — | — | b1-2 | L1 S3 The fire of January 1657 | documented | wiki-meireki, tmg-census |  |
| e1672 | Moronobu signs his pictures | 1672 | edo | publication | edo | moronobu | — | b1-5, b1-5u | L3 S1 Black ink, hand colour | probable | wiki-ukiyoe, met-ukiyoe | Case anchor table marks it probable. |
| e1721 | Edo counts itself: about 1.3 million | 1721 | edo | census | edo | — | — | b1-4r | L1 S5 The census of 1721; L1 argued: a million or 1.3 million | documented | tmg-census |  |
| e1740 | Uki-e: perspective prints | 1740 | edo | publication | edo | masanobu | — | b1-5u | — | documented | wiki-ukie, met-ukie | Not in the v0 case; added in v4 with the uki-e lab. "Earliest known uki-e about 1739–40". |
| e1765 | Full colour: the calendar prints | 1765 | edo | publication | edo | harunobu | harunobu-1765 | p-2, b1-7 | L3 S2 New Year 1765; L3 S3 Over a hundred designs | documented | met-ukiyoe, met-harunobu, hamatake-harunobu, vjp-poetry |  |
| e1770 | Harunobu dies | 1770 | edo | death | edo | harunobu | — | b1-7 | L3 S4 Harunobu’s five years | probable | wiki-ukiyoe | objects_events.md marks the year probable. |
| e1783 | Tsutaya moves to Tōri Abura-chō | 1783 | edo | relocation | yoshiwara-gate*, toriaburacho | tsutaya | portrait-tsutaya, printshop | b2-1 | L4 S2 1783: the move to Tōri Abura-chō; L1 S7 Nihonbashi: the publishers’ streets | documented | wiki-tsutaya, suntory-tsutaya, sumida-producers |  |
| e1790 ◉ | The kiwame seal | 1790 | edo | order | castle | sadanobu | utamaro-tsutaya | b2-4, b2-5, b9-4 | L4 S4 1790–91: the Kansei edicts; L2 S7 Who was named | documented | wiki-kansei, jaanus-aratame, vjp-seals |  |
| e1791 | Kyōden manacled, Tsutaya fined | 1791 | edo | incident | toriaburacho | kyoden, tsutaya, sadanobu | portrait-kyoden, portrait-tsutaya | b2-5 | L4 S4 1790–91; L4 prediction: what the state punished Tsutaya for | documented | vjp-sumptuary, sa-tsutaya, wiki-kyoden |  |
| e1793 | Osaka: Shioya’s monopoly on actor likenesses | 1793 | japan | order | osaka | shioya, ryukosai | — | b2-7 | — | documented | yano, ref-kamigata | Not in the v0 case (L6 S4 mentions Osaka only for the 1842 ban). |
| e1794 | Sharaku’s ten months | 1794.4 | edo | publication | toriaburacho, sakaicho*, fukiyacho* | sharaku, tsutaya, utamaro | sharaku | b2-6 | L4 S6 1794–95: Sharaku’s ten months; L4 argued: Sharaku’s identity | documented | aic-sharaku, met-sharaku, wiki-sharaku |  |
| e1797 | Tsutaya dies | 1797 | edo | death | toriaburacho | tsutaya | — | b2-8 | L4 S8 1797: dead at 48 | documented | wiki-tsutaya, suntory-tsutaya | Age at death: 47 in story.yaml and people.yaml, 48 in the case (cast table, L4 S8) and objects_events.md. |
| e1800 | Bust portraits of women banned | 1800 | edo | order | castle | utamaro | — | b2-5 | L4 S5 mica grounds later banned | probable | vjp-sumptuary, wiki-utamaro | Case anchor table marks it probable; story states it flat. |
| e1804 | Utamaro manacled | 1804 | edo | incident | edo | utamaro | portrait-utamaro | b2-8, b5-1 | L4 (cast: manacled in 1804 for a Hideyoshi print) | probable | wiki-utamaro, vjp-sumptuary | Case anchor table marks it probable; story states it flat. |
| e1807 | The publishers’ guild | 1807 | edo | incident | edo | — | — | b3-1 | spine: Blue and the road | documented | lyon-publishers, wiki-ukiyoe |  |
| e1814 | The Hokusai Manga | 1814 | japan | publication | — | hokusai, eirakuya | manga | b3-2 | spine: Blue and the road; L7 S2 Bracquemond’s Manga story | documented | bm-manga, met-manga | Nagoya has no entry in places.yaml, so this event has no place. |
| e1824 | Chinese blue re-enters Nagasaki | 1824 | world | incident | nagasaki, china | — | — | b3-3, b3-4 | L5 S2 The price falls, 1824–28 | documented | smith-blue, fitzhugh |  |
| e1829 | Eisen’s all-blue fan | 1829 | edo | publication | edo | eisen, iseya, toho | eisen-aizuri | b3-4, b3-5 | L5 S3 1829: Eisen’s all-blue fan | documented | smith-blue |  |
| e1831 | Thirty-six Views of Mount Fuji | 1831 | japan | publication | bakurocho, fuji, kanagawa, yokohama-off | hokusai, nishimuraya | hi-wave, redfuji, wave-thumb | p-2, b3-6, b4-5, b5-7, b9-4 | L5 S4 New Year 1831: Eijudō’s advertisement | documented | smith-blue, vermeulen, korenberg-fuji, met-wave | Timeline pins the series to 1831 (the New Year advertisement); the case and images.json give c. 1830–32. |
| e1833 | Hiroshige’s Tōkaidō | 1833.5 | japan | publication | nihonbashi, tokaido-54 | hiroshige, hoeido | nihonbashi, t-shinagawa, t-kanagawa, t-hakone, t-mishima, t-kanbara, t-yui, t-shono, t-kyoto | b4-8, b5-7 | L6 S7 The road: Hiroshige’s Tōkaidō | documented | wiki-tokaido, korenberg, wiki-hiroshige |  |
| e1835 | Hokusai’s letter about a carver | 1835 | edo | incident | edo | hokusai, egawa | — | b4-5, b4-7 | L2 S7 Hokusai’s 1835 letter about Egawa Tomekichi’s fee | documented | wiki-egawa, korenberg |  |
| e1842 ◉ | The Tenpō edict | 1842.5 | edo | order | castle | tadakuni | portrait-tadakuni | p-2, b5-1, b5-2, b5-7, b9-4 | L6 S2 The edict of the sixth month of 1842 | documented | kato-tenpo, vjp-sumptuary |  |
| e1842c ◉ | The 16-mon cap | 1842.9 | edo | price | castle | tadakuni | — | b5-3 | L6 S3 The price cap of the eleventh month | documented | kato-tenpo |  |
| e1842t | Theatres moved to Saruwaka-chō | 1842 | edo | relocation | sakaicho*, fukiyacho*, kobikicho*, saruwakacho | tadakuni, danjuro | danjuro-aic | b5-4 | L6 S5 The theatres moved | documented | ndl-saruwaka, vjp-sumptuary | Timeline year 1842; the case spine says 1841–43 and the NDL source "the 1841–42 relocation". |
| e1847 | 408,000 sheets | 1847.6 | edo | publication | edo | kuniyoshi, murata, fujiokaya | gishi | b5-6, b5-7 | L6 S6 Kuniyoshi’s answer | documented | fujiokaya, kato-1847 |  |
| e1849 | Hokusai dies | 1849 | edo | death | edo | hokusai | — | — | spine: The ban and the opening | documented | wiki-hokusai, bm-manga | No story beat shows e1849 (people.yaml life ticks carry it). |
| e1853 | Perry at Uraga | 1853.5 | japan | incident | uraga | perry | portrait-perry | b6-1 | spine: Perry 1853 | documented | wiki-perry, loc-speiden |  |
| e1855 | The earthquake catfish | 1855.9 | edo | incident | edo | — | namazu | b6-2 | L6 S8 November 1855: the earthquake | documented | smits-namazu, rom-namazu, mcdowell-namazu | The count of about 380 kinds is probable (mcdowell-namazu). |
| e1856 | One Hundred Famous Views of Edo | 1856 | edo | publication | edo, shinohashi | hiroshige, uoya | shower, plum | b6-3 | L6 S7 The Hundred Famous Views of Edo | documented | hiroshige-uk, wiki-100views |  |
| e1858 | Hiroshige dies | 1858 | edo | death | edo | hiroshige | portrait-hiroshige | — | spine: Hiroshige dies 1858 | documented | wiki-hiroshige | No story beat shows e1858 (b6-3 text says it). |
| e1859 | Yokohama opens | 1859 | japan | incident | yokohama, kanagawa | — | yokohama-bread | b6-5 | spine: Yokohama opens 1859; the Yokohama prints | documented | wiki-ukiyoe, wiki-perry |  |
| e1864 | Aniline dyes arrive | 1864 | edo | incident | edo | — | — | b6-6 | spine: aniline dyes 1864 | documented | cesaratto |  |
| e1865 | French mail steamers reach Yokohama | 1865 | world | incident | yokohama, marseille | — | — | b7-1 | — | documented | mi-1865, mm-1870 | Not in the v0 case. |
| e1867 | Japan at the Paris exposition | 1867 | world | exhibition | paris | — | — | b7-0 | L7 S2 1867: Japan’s pavilion in Paris | documented | met-japonisme |  |
| e1867p | Pacific Mail: San Francisco–Yokohama | 1867.05 | world | incident | sanfrancisco, yokohama | — | — | b8-1 | — | documented | pacific-mail | Not in the v0 case. |
| e1868 | Meiji: Edo becomes Tokyo | 1868 | edo | order | edo, tokyo | — | — | b6-6 | spine: Meiji 1868 | documented | wiki-edo |  |
| e1872 | The Yoshiwara debts cancelled | 1872 | edo | order | yoshiwara | — | — | b6-6 | — | probable | jf-1872 | Not in the v0 case; source marked probable. |
| e1884 | Hayashi’s Paris shop | 1884 | world | incident | paris, yokohama | hayashi | portrait-hayashi | b7-3, b7-6 | L7 S3 Hayashi Tadamasa | documented | nmwa-hayashi, persee-hayashi, agorha-hayashi |  |
| e1887 | Van Gogh’s copies | 1887.8 | world | incident | paris, amsterdam | vangogh | plum, shower, eisen-aizuri, portrait-van-gogh | b7-5, b7-6 | L7 S4 October 1887: Van Gogh’s three copies | documented | vgm-japan, vgm-bridge |  |
| e1888 | Le Japon artistique | 1888.4 | world | publication | paris | bing | japon-artistique | b7-4 | L7 S3 Bing’s journal | documented | wiki-bing, met-japonisme |  |
| e1889 | Tokunō’s gift names the carvers | 1889 | world | incident | tokyo, washington | tokuno, kido, yamamoto, nakamura, morikawa | tokuno-set | p-2, b8-5, b9-4 | L7 S7 the Smithsonian’s blocks from Tokunō; L2 S3 the Smithsonian proof set, linked | documented | si-tokuno, nmah-proof |  |
| e1890 | Bing’s 700 prints | 1890 | world | exhibition | paris | bing | — | b7-4, b7-6 | L7 S3 his 1890 exhibition | documented | wiki-bing, met-japonisme |  |
| e1898 | Fenollosa’s Tokyo exhibition | 1898 | world | exhibition | tokyo | fenollosa | portrait-fenollosa | b8-1r | L7 S7 Fenollosa’s Tokyo show of 1898 | documented | wiki-fenollosa, wiki-ukiyoe |  |
| e1905 | The “packing paper” story in print | 1905 | world | publication | paris | — | manga | b7-2 | L7 S2 Bracquemond’s Manga story told as a legend | documented | ota-packing | The 1905 printing is documented; the 1856 find it describes is contested (case: Eidelberg’s doubts). |
| e1906 | Wright’s Hiroshige show | 1906.2 | world | exhibition | chicago | wright | portrait-wright | b8-3 | L7 S6 America: Wright as a dealer | documented | aic-1906 |  |
| e1913 | Wright’s deal with the Spauldings | 1913 | world | incident | chicago, boston | wright | — | b8-3 | L7 S6 (cast: $20,000 of Spaulding money into $125,000) | documented | metbull-wright |  |
| e1920 | The “revamped” prints scandal | 1920 | world | incident | chicago, tokyo | wright | — | b8-4 | L7 S6 (cast: the 1919–20 recut-print scandal) | documented | vjp-takamizawa, metbull-wright |  |
| e1921 | The Spaulding gift, never to be shown | 1921 | world | incident | boston | — | — | b8-2 | L7 S6 the Spauldings | documented | mfa-prints |  |
| e1929 | The Havemeyer bequest to the Met | 1929 | world | incident | newyork | — | hi-wave | b9-1 | — | documented | met-wave-record | Not in the v0 case (its spine has 1925, the Buckingham collection). |
| e2020 | 111 Great Waves located | 2020 | world | census | london | — | hi-wave, wave-aic-thumb | b4-4, b9-2 | L5 S7 111 located impressions | documented | bm-spot, korenberg |  |
| e2024 | The thousand-yen note | 2024.5 | japan | publication | tokyo | — | yen-note | p-1, p-2, b9-3, b9-4 | L7 S8 2024: the thousand-yen note | documented | boj-note, npb-1000 |  |
| x1617-yoshiwara | The licensed quarter stands near Nihonbashi | 1617–1657 | edo | order | yoshiwara-old* | — | — | b1-3 | — | documented | wiki-yoshiwara |  |
| x1657-yoshiwara-move | The quarter rebuilt north of Asakusa as the Shin-Yoshiwara | 1657 | edo | relocation | yoshiwara-old*, yoshiwara | — | — | b1-3 | L1 S3 (the rebuilding) | documented | wiki-meireki, wiki-yoshiwara | Beat year is 1660, a stage placeholder; the move follows the 1657 fire. |
| x1670-theatres | Four theatres licensed; three after the 1714 scandal | 1670–1714 | edo | order | sakaicho*, fukiyacho*, kobikicho* | — | playbill | — | case anchor table 1670; L1 S8 The licensed pleasures | documented | — | Lecture only. The story names the three theatres without a date (b1-4, year 1700 placeholder). |
| x1677-maps | The earliest known single-sheet printed maps of Edo | 1676–1677 | edo | publication | edo | — | map-edo-1677 | — | L1 S4 The 1677 map laid over the 1859 map; I4 The city, 1677 to 1859 | documented | loc-1859 | Lecture only. The 1677 map is not in images.json; only loc-1859 is a source id. |
| x1704-blue | Prussian blue made in Berlin, by accident | 1704 | world | incident | berlin | — | — | b3-3, b3-2g | L5 S1 A chemist’s accident in Berlin, 1704–06 | documented | fitzhugh, smith-blue | Story says "around 1704"; the case "1704–06"; atlas canon MAT054 "c.1706". |
| x1744-benizuri | Two-colour printing (benizuri-e) by 1744 | 1744 | edo | publication | edo | — | — | — | L3 S1 two colours by 1744; L3 argued: "first" against "earliest known" | probable | — | Lecture only; dropped from the v4 story. |
| x1748-ukie | Masanobu draws a whole kabuki theatre in perspective | 1748 | edo | publication | edo | masanobu | ukie-1748 | b1-5u | — | documented | met-ukie, wiki-ukie |  |
| x1774-tsutaya-shop | Tsutaya’s bookshop on the Gojikken road; the Yoshiwara guide alone from 1776 | 1774–1776 | edo | incident | yoshiwara-gate* | tsutaya | — | b2-1 | L4 S1 a bookshop at the quarter’s gate | documented | wiki-tsutaya, suntory-tsutaya |  |
| x1787-kansei | Sadanobu chief councillor; the Kansei reforms begin | 1787–1793 | edo | order | castle | sadanobu | portrait-sadanobu | b2-4 | L4 S4 the Kansei edicts | documented | wiki-kansei, wiki-sadanobu |  |
| x1788-advert | Tsutaya’s advertisement inviting poets to submit verses | 1788 | edo | publication | toriaburacho | tsutaya | — | — | L3 S6 Tsutaya turns the circle into a business | documented | — | Lecture only; no source id in sources.yaml. |
| x1793-naming | Only courtesans may be named on prints | 1793 | edo | order | castle | hanaogi, utamaro | — | b2-3 | L4 S7 Hanaōgi | documented | vjp-sumptuary, met-hanaogi | objects_events.md marks the 1793 naming rule probable. |
| x1794-hanaogi | Hanaōgi runs away from the quarter and is brought back | 1794 | edo | incident | yoshiwara | hanaogi | yoshiwara-nakanocho | b2-3 | L4 S7 Hanaōgi | probable | world4-hanaogi, met-hanaogi | Destination not given: no second place. |
| x1794-shioya | Shioya buys Ryūkōsai’s blocks; the designer withdraws | 1794 | japan | incident | osaka | shioya, ryukosai | — | b2-7 | — | documented | yano, ref-kamigata |  |
| x1795-price | An earlier price order: single sheets not above 16–18 mon | 1795 | edo | price | castle | — | — | — | objects_events.md row 26 | probable | kato-tenpo | Research file only; neither story nor timeline carries it. |
| x1808-libraries | 655 lending libraries carry books door to door | 1808 | edo | census | edo | — | — | b2-2 | case anchor table 1808 | documented | kornicki, forrer-sellers |  |
| x1827-suikoden | Kuniyoshi’s Suikoden heroes: warriors become his genre | 1827 | edo | publication | edo | kuniyoshi | desk-suikoden | — | L6 S6 (cast: warriors from 1827) | probable | wiki-kuniyoshi | Named in b5-6 ("had drawn them since 1827") and on Kuniyoshi’s card; the Censor’s Desk shows a Suikoden sheet (Cleveland 1980.85). |
| x1828-blueprice | The Nagasaki price of the blue falls to 31 monme a kin | 1824–1828 | world | price | nagasaki | — | — | b3-4 | L5 S2 The price falls, 1824–28 | documented | smith-blue |  |
| x1834-postscript | Hokusai writes that at 110 every dot and line will live | 1834 | edo | publication | edo | hokusai | — | b4-5 | — | documented | bm-manga, wiki-hokusai |  |
| x1841-tenpo | Tadakuni begins the Tenpō reforms | 1841–1843 | edo | order | castle | tadakuni | portrait-tadakuni | b5-1 | L6 S1 The Tenpō reforms, 1841–43 | documented | wiki-tadakuni, vjp-sumptuary |  |
| x1842-danjuro | Danjūrō VII banished from Edo for extravagance | 1842 | edo | order | saruwakacho | danjuro | danjuro-aic, portrait-danjuro-vii | b5-4 | L6 S5 Danjūrō VII exiled | probable | ndl-saruwaka, vjp-sumptuary | Destination of the exile not given; the case says ten years. |
| x1843-nanushi | Ward headmen stamp prints with their own names: one seal, two from 1847, a date from 1852 | 1843–1853 | edo | order | castle | murata | — | b5-5 | L2 S7 (seals); I1 the seal chronology | documented | jaanus-aratame, vjp-seals | The timeline carries this only as the nanushi band; no event mark. |
| x1847-report | The magistrate’s officers count the shops: six or seven tenths actor pictures without names | 1847.1 | edo | census | edo | — | — | b5-7 | L6 S4 What the trade did | documented | kato-1847 | Also a notice in the Censor’s Desk stream (desks.json, 1847.1 and 1847.3). |
| x1848-flop | The same diary records a flop: 3,000 printed, 450 sold | 1847–1848 | edo | publication | edo | fujiokaya | — | b5-6 | I8 An edition (the flop) | documented | fujiokaya, kato-1847 | The title of the flop is not named in the unit. |
| x1852-perry-departs | Perry’s squadron leaves Hampton Roads | 1852.9 | world | incident | norfolk | perry | — | b6-0, b6-0g | — | documented | wiki-perry, loc-speiden | 24 November 1852. |
| x1854-treaty | A treaty follows Perry’s visit | 1854 | japan | order | uraga | perry | — | b6-1 | spine: the treaty of 1854 | documented | wiki-perry |  |
| x1856-bracquemond | Bracquemond finds a Manga volume wedging porcelain at Delâtre’s | 1856 | world | incident | paris | — | manga | b7-2, b7-1 | L7 S2 Bracquemond’s Manga story, with Eidelberg’s doubts | contested | ota-packing | Date disputed; the story names the Ōta note, the case names Eidelberg (1981). |
| x1869-suez | The Suez Canal opens; Marseille–Yokohama through-sailings from April 1870 | 1869–1870 | world | incident | suez, marseille, yokohama | — | — | b7-1 | — | documented | mm-1870 |  |
| x1869-railroad | A railroad crosses America | 1869 | world | incident | sanfrancisco, chicago | — | — | b8-1 | — | documented | pacific-mail | Route pm is labelled "the railroad from 1869"; no source id for the railroad itself. |
| x1878-paris | The Paris exposition of 1878: Hayashi comes as an interpreter | 1878 | world | exhibition | paris | hayashi | — | b7-3 | L7 argued: Japan exhibited at Paris in 1867 and 1878 | documented | nmwa-hayashi |  |
| x1878-fenollosa | Fenollosa arrives in Tokyo to teach at the Imperial University | 1878 | world | incident | tokyo | fenollosa | — | b8-1r | L7 S6 | documented | wiki-fenollosa |  |
| x1887-purchase | Van Gogh buys about 660 Japanese prints in Paris | 1887.2 | world | incident | paris | vangogh, bing | — | b7-5 | I9 Van Gogh’s purchases | documented | vgm-japan | From Bing’s stock: probable (people.yaml). |
| x1890-fenollosa | Fenollosa becomes curator of Oriental art in Boston | 1890 | world | incident | boston | fenollosa | — | b8-1r | L7 S6 Fenollosa | documented | wiki-fenollosa, mfa-prints |  |
| x1905-wright | Wright goes to Japan | 1905 | world | incident | tokyo | wright | — | b8-3 | L7 S6 Wright as a dealer | documented | aic-1906, metbull-wright |  |
| x1908-wright | Wright’s large print show at the Art Institute | 1908 | world | exhibition | chicago | wright | — | — | spine: Wright’s Chicago shows 1906 and 1908 | documented | — | Case only. |
| x1915-plum | The Plum Garden sold by Wright to Kate Buckingham | 1915.1 | world | incident | chicago | wright | plum | b8-3 | L7 S6 the Plum Garden’s provenance line | documented | aic-plum |  |
| x1925-buckingham | The Buckingham collection enters the Art Institute | 1925 | world | incident | chicago | — | plum | — | spine: 1925 | documented | aic-plum | Case only. |
| x1928-wright | Wright’s bank seizes his house; thousands of prints sold at a dollar | 1928 | world | incident | chicago | wright | — | b8-4 | L7 S6 (cast) | documented | metbull-wright, hammer-wright |  |
| x2024-census | 113 Great Waves located | 2024 | world | census | london | — | hi-wave | b4-4, b9-2, b9-1g | — | documented | bm-spot, korenberg |  |
| x1608-scrolls | The carpenters’ proportion scrolls | 1608 | japan | publication | — | — | — | — | L8 S6 The sword and the carpenter; L8 prediction: which trade had a written rulebook in 1608 | documented | — | Lecture only; no place in places.yaml. |
| x1659-arita | The VOC order of 64,866 pieces of Arita porcelain | 1659 | japan | order | nagasaki | — | — | — | L8 S5 Arita porcelain; L7 S1 Dejima’s trade reversed | documented | — | Lecture only; Arita is not in places.yaml. |
| x1781-netsuke | The book that listed the netsuke carvers | 1781 | japan | publication | — | — | — | — | L8 S4 Netsuke | documented | — | Lecture only. |
| x1872-lyon | Three Nishijin weavers go to Lyon | 1872 | world | incident | kyoto | — | — | — | L8 S2 Nishijin silk | documented | — | Lecture only; Lyon is not in places.yaml. |

◉ = `seal: true` in timeline.yaml (the seal-red events). Lanes: e1867 after, e1884 after, e1887 after, e1888 after, e1889 after, e1890 after, e1898 after, e1905 after, e1906 after, e1913 after, e1920 after, e1921 after, e1929 after, e2020 after are the afterlife lane.

## 2. Journeys

Every movement with a route or a from/to the sources give. `route` names the places.yaml key (routes.*, links.*, the tokaido list, or a map.js `anim`). `drawn` says whether v4 draws it on the map.

| id | label | years | scale | kind | legs | route | drawn | people | objects | beats | v0 | conf | sources |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| blue | Prussian blue: Berlin → Amsterdam → the Cape → Batavia → Nagasaki → Edo | 1704–1831 | world | goods | 6 legs: Berlin → Amsterdam → Cape of Good Hope → Batavia → Nagasaki · Dejima; Chinese junks → Nagasaki · Dejima → Edo | berlin + voc + china (stage route: blue) | yes | hokusai, nishimuraya, eisen, iseya | hi-wave, eisen-aizuri, redfuji | b3-2g, b3-3, b3-4, b3-5, b3-6, b4-0, b4-2 | L5 S1–S4; I6 The blue route | documented (route); argued (when it reached Edo’s printers) | fitzhugh, smith-blue, voc-route, wiki-dejima, artelino-aizuri |
| china-junks | Chinese junks from Canton to Nagasaki, from 1824 | 1824–1828 | world | goods | 1 legs: Chinese junks → Nagasaki · Dejima | china | yes | — | — | b3-3, b3-4 | L5 S1–S2 | documented | smith-blue |
| voc | Dutch ships via the Cape and Batavia to Dejima, 1641–1859 | 1641–1859 | world | goods | 3 legs: Amsterdam → Cape of Good Hope → Batavia → Nagasaki · Dejima | voc | yes | — | — | b3-3, b1-5u | L5 S1; L7 S1 Dejima’s trade reversed | documented | voc-route, wiki-dejima |
| engravings | European engravings reach Edo’s designers through Dejima or China | 1739–1748 | world | ideas | 2 legs: Nagasaki · Dejima → Edo; Chinese junks → Edo | — | no | masanobu | ukie-1748 | b1-5u | — | probable | wiki-ukie, met-ukie |
| tokaido | The Tōkaidō: Nihonbashi to Kyoto, 55 points | 1635–1834 | japan | road | 54 legs: Nihonbashi → … → Kyoto (Sanjō Ōhashi) | tokaido (places.yaml tokaido list, n 0–54; tokaidoPrints maps 9 stations to images) | yes | hiroshige, hoeido | nihonbashi, t-shinagawa, t-kanagawa, t-hakone, t-mishima, t-kanbara, t-yui, t-shono, t-kyoto | b1-1, b2-7, b4-8, b5-8 | L6 S7 The road; L1 S2 (the lords’ roads); overture shot "edo" | documented | wiki-tokaido, korenberg, wiki-hiroshige |
| sankin | The lords’ alternate attendance, from 1635 | 1635–1868 | japan | people | 2 legs: Kyoto → Edo; Osaka → Edo | tokaido-faint | yes | ieyasu | — | b1-1, b1-4r | L1 S2 The lords’ order: arcs draw the retinues’ roads converging on the city | documented | wiki-edo, christies-edo |
| paper | One sheet: Echizen paper → Edo → New York | 1831–1929 | world | goods | 2 legs: Echizen → Edo → New York | links.sheet | yes | nishimuraya, hokusai | hi-wave | b9-1, p-2 | L2 S5 the chain drawn on the map from the paper villages to Edo | probable | jaanus-hosho, sumida-producers, met-wave-record |
| yoshiwara-move | The licensed quarter moves north of Asakusa after the fire | 1657 | edo | institution | 1 legs: The old Yoshiwara, to 1657 → Shin-Yoshiwara | anim: yoshiwara-move | yes | — | — | b1-3 | L1 S3 | documented | wiki-meireki, wiki-yoshiwara |
| fire-1657 | The Meireki fire: three outbreaks in two days | 1657 | edo | spread | 2 legs: Hongō: the first fire → Koishikawa: the second fire → Kōjimachi: the third fire | anim: fire (three pins, not a line) | yes | — | — | b1-2 | L1 S3 The fire of January 1657 at the scale of the city | documented | wiki-meireki, tmg-census |
| tsutaya-move | Tsutaya moves from the quarter’s gate to Tōri Abura-chō | 1783 | edo | institution | 1 legs: Gojikken road: Tsutaya’s first shop → Tōri Abura-chō: Tsutaya’s shop from 1783 | anim: tsutaya-move | yes | tsutaya | portrait-tsutaya, printshop | b2-1 | L4 S2 1783: the move, shown on the map; I4 check: where Tsutaya’s shop stood after 1783 | documented | wiki-tsutaya, suntory-tsutaya, sumida-producers |
| theatres-move | The three theatres moved to Saruwaka-chō | 1842 | edo | institution | 3 legs: Sakai-chō: the Nakamura theatre → Saruwaka-chō: the theatres from 1842; Fukiya-chō: the Ichimura theatre → Saruwaka-chō: the theatres from 1842; Kobiki-chō: the Morita theatre → Saruwaka-chō: the theatres from 1842 | anim: theatres-move | yes | tadakuni, danjuro | danjuro-aic | b5-4, b1-4 | L6 S5 The theatres moved: the map moves them; I4: moves the year to 1841 and watches the theatres relocate | documented | ndl-saruwaka, vjp-sumptuary |
| perry | Perry’s squadron, Hampton Roads to Uraga, 1852–53 | 1852.9–1853.5 | world | people | 11 legs: Norfolk → Madeira → St Helena → Cape Town → Mauritius → Ceylon → Singapore → Hong Kong → Shanghai → Naha → Bonin Islands → Uraga | perry (12 named stops with dates; 10 unnamed waypoints) | yes | perry | portrait-perry | b6-0, b6-0g, b6-1 | spine: Perry 1853 | documented | wiki-perry, loc-speiden |
| exhibition-1867 | Japan’s official exhibit to the Paris exposition | 1867 | world | goods | 1 legs: Edo → Paris | — | no | — | — | b7-0 | L7 S2 1867: Japan’s pavilion in Paris | documented | met-japonisme, wiki-ukiyoe |
| mm | Messageries Maritimes: Marseille to Yokohama, from 1870 | 1865–1870 | world | goods | 8 legs: Marseille → Port Said → Suez → Aden → Galle → Singapore → Hong Kong → Shanghai → Yokohama | mm | yes | — | — | b7-1 | L7 (afterlife); I9 The export map | documented | mi-1865, mm-1870, met-japonisme |
| hayashi | Hayashi’s 218 shipments, Yokohama to Paris, 1884–95 | 1884–1895 | world | goods | 9 legs: Yokohama → Shanghai → Hong Kong → Singapore → Galle → Aden → Suez → Port Said → Marseille → Paris | hayashi (counter: 218) | yes | hayashi | portrait-hayashi | b7-3, b7-6 | L7 S3 Hayashi Tadamasa; I9 The export map: arcs leave Japan with their counts | documented (shipments); argued (the count of prints) | nmwa-hayashi, persee-hayashi, agorha-hayashi |
| vangogh-copies | Van Gogh’s copies: Edo prints to Paris, then to Amsterdam | 1887–1887.8 | world | prints | 2 legs: Edo → Paris → Amsterdam | atlas edo-copy (not in places.yaml) | no | vangogh, bing, hiroshige, eisen, uoya | plum, shower, eisen-aizuri | b7-5, b7-4 | L7 S4 October 1887 | documented | vgm-japan, vgm-bridge |
| pm | Pacific Mail from 1867 and the railroad from 1869: Yokohama → San Francisco → Chicago → Boston | 1867–1921 | world | goods | 3 legs: Yokohama → San Francisco → Chicago → Boston | pm | yes | wright, fenollosa | plum | b8-1 | L7 S6 America; I9 The export map | documented | pacific-mail, mfa-prints |
| tokuno | The Tokunō printing set, Tokyo to Washington, 1889 | 1889 | world | goods | 1 legs: Tokyo → Washington | links.tokuno | yes | tokuno, kido, yamamoto, nakamura, morikawa | tokuno-set | b8-5, b9-4 | L7 S7; L2 S3 (linked proof set) | documented | si-tokuno, nmah-proof |
| fenollosa | Fenollosa: Boston → Tokyo 1878 → Boston 1890 → Tokyo exhibition 1898 | 1878–1898 | world | people | 3 legs: Boston → Tokyo → Boston → Tokyo | — | no | fenollosa | portrait-fenollosa | b8-1g, b8-1r | L7 S6–S7 | documented | wiki-fenollosa, mfa-prints |
| wright | Wright: Chicago → Japan 1905, prints back to Chicago and Boston | 1905–1928 | world | people | 3 legs: Chicago → Tokyo → Chicago → Boston | — | no | wright | plum, portrait-wright | b8-3, b8-4, b8-2, b8-1 | L7 S6 Wright as a dealer; spine: Wright’s Chicago shows 1906 and 1908 | documented | aic-1906, metbull-wright, aic-plum, vjp-takamizawa |

### 2a. Legs

**blue** · Prussian blue: Berlin → Amsterdam → the Cape → Batavia → Nagasaki → Edo  
v4 draws berlin (land), voc and china together as route "blue"; the Nagasaki → Edo leg is not drawn. The arrival date at Edo’s printers is the argued station b3-4 (c. 1790 vs late 1820s).
- `berlin` (Berlin) → `amsterdam` (Amsterdam) · undated · probable · overland; routes.berlin, land: true
- `amsterdam` (Amsterdam) → `cape` (Cape of Good Hope) · undated · documented · routes.voc
- `cape` (Cape of Good Hope) → `batavia` (Batavia) · undated · documented
- `batavia` (Batavia) → `nagasaki` (Nagasaki · Dejima) · undated · documented · Dutch ships; the Dutch later withdraw from the blue trade
- `china` (Chinese junks) → `nagasaki` (Nagasaki · Dejima) · 1824 · documented · routes.china: Chinese junks re-enter "in steadily increasing quantities"
- `nagasaki` (Nagasaki · Dejima) → `edo` (Edo) · undated · probable · not drawn in v4; story b3-2g: "through the port of Nagasaki"

**china-junks** · Chinese junks from Canton to Nagasaki, from 1824  
places.yaml has both a region node "china" (used by the route) and a city node "canton" (used by the b3-2g map guess as the option labelled China).
- `china` (Chinese junks) → `nagasaki` (Nagasaki · Dejima) · 1824 · documented · routes.china starts at the "Chinese junks" region node (30, 122), not at canton (23.13, 113.26)

**voc** · Dutch ships via the Cape and Batavia to Dejima, 1641–1859  
Atlas canon route NET033 ("Cape Route and the East India companies", 1498–1874) is the same line; it cites places.yaml routes.voc.
- `amsterdam` (Amsterdam) → `cape` (Cape of Good Hope) · undated · documented
- `cape` (Cape of Good Hope) → `batavia` (Batavia) · undated · documented
- `batavia` (Batavia) → `nagasaki` (Nagasaki · Dejima) · undated · documented · Nagasaki ships each summer (voc-route)

**engravings** · European engravings reach Edo’s designers through Dejima or China  
Story text only; no route in places.yaml.
- `nagasaki` (Nagasaki · Dejima) → `edo` (Edo) · undated · probable
- `china` (Chinese junks) → `edo` (Edo) · undated · probable

**tokaido** · The Tōkaidō: Nihonbashi to Kyoto, 55 points  
The 55 stations carry no ids in places.yaml, only n; ids here are tokaido-<n>. Prints exist for n 0, 1, 3, 10, 11, 15, 16, 45, 54. Okazaki (n 38) is the setting of the cat print b5-8. Hamamatsu (n 29) was Tadakuni’s domain.
- 54 station-to-station legs, `tokaido-0` to `tokaido-54`, all `undated` (the road), conf documented. Stations with prints: n 0, 1, 3, 10, 11, 15, 16, 45, 54.

**sankin** · The lords’ alternate attendance, from 1635  
The unit draws the road faint, not the processions. The case’s arcs of retinues from every domain have no data in places.yaml.
- `kyoto` (Kyoto) → `edo` (Edo) · 1635 · documented · along the Tōkaidō (stage route tokaido-faint); the domains are not named in the unit
- `osaka` (Osaka) → `edo` (Edo) · 1635 · documented · schematic

**paper** · One sheet: Echizen paper → Edo → New York
- `echizen` (Echizen) → `edo` (Edo) · undated · probable · "probably hōsho of paper-mulberry, the kind Echizen was famous for"
- `edo` (Edo) → `newyork` (New York) · undated · documented (arrival 1929); route unrecorded · "How it crossed the Pacific is not recorded"; Havemeyer bequest 1929

**yoshiwara-move** · The licensed quarter moves north of Asakusa after the fire
- `yoshiwara-old` (The old Yoshiwara, to 1657) → `yoshiwara` (Shin-Yoshiwara) · 1657 · documented · map.js MOVES yoshiwara-move: "to 1657" → "from 1657"; yoshiwara-old is approx

**fire-1657** · The Meireki fire: three outbreaks in two days  
Not a route: three origins. The burnt area is not mapped in the unit; the case asks for "six tenths burn" at the scale of the city.
- `hongo` (Hongō: the first fire) → `koishikawa` (Koishikawa: the second fire) · 1657 · documented · the Hongō fire at Honmyō-ji about two in the afternoon; the second the next morning
- `koishikawa` (Koishikawa: the second fire) → `kojimachi` (Kōjimachi: the third fire) · 1657 · documented · third that afternoon

**tsutaya-move** · Tsutaya moves from the quarter’s gate to Tōri Abura-chō
- `yoshiwara-gate` (Gojikken road: Tsutaya’s first shop) → `toriaburacho` (Tōri Abura-chō: Tsutaya’s shop from 1783) · 1783 · documented · map.js MOVES tsutaya-move: "1774–83" → "from 1783"; yoshiwara-gate is approx

**theatres-move** · The three theatres moved to Saruwaka-chō  
Year 1842 in timeline and map.js; 1841–43 in the case; "1841–42" in the NDL source title.
- `sakaicho` (Sakai-chō: the Nakamura theatre) → `saruwakacho` (Saruwaka-chō: the theatres from 1842) · 1842 · documented · the Nakamura theatre; sakaicho approx
- `fukiyacho` (Fukiya-chō: the Ichimura theatre) → `saruwakacho` (Saruwaka-chō: the theatres from 1842) · 1842 · documented · the Ichimura theatre; approx
- `kobikicho` (Kobiki-chō: the Morita theatre) → `saruwakacho` (Saruwaka-chō: the theatres from 1842) · 1842 · documented · the Morita theatre; approx

**perry** · Perry’s squadron, Hampton Roads to Uraga, 1852–53  
Stops beyond norfolk/uraga (Madeira, St Helena, Cape Town, Mauritius, Ceylon, Singapore, Hong Kong, Shanghai, Naha, Bonin Islands) exist only inside routes.perry; cape, galle, singapore, hongkong are also world ids at the same coordinates. Story b6-0g offers a false westward option (round South America).
- `routes.perry[0]` (Norfolk) → `routes.perry[2]` (Madeira) · Dec 1852 · documented
- `routes.perry[2]` (Madeira) → `routes.perry[5]` (St Helena) · Jan 1853 · documented
- `routes.perry[5]` (St Helena) → `routes.perry[6]` (Cape Town) · Jan–Feb 1853 · documented
- `routes.perry[6]` (Cape Town) → `routes.perry[8]` (Mauritius) · Feb 1853 · documented
- `routes.perry[8]` (Mauritius) → `routes.perry[9]` (Ceylon) · Mar 1853 · documented
- `routes.perry[9]` (Ceylon) → `routes.perry[12]` (Singapore) · Mar 1853 · documented
- `routes.perry[12]` (Singapore) → `routes.perry[14]` (Hong Kong) · Apr 1853 · documented
- `routes.perry[14]` (Hong Kong) → `routes.perry[16]` (Shanghai) · May 1853 · documented
- `routes.perry[16]` (Shanghai) → `routes.perry[17]` (Naha) · May–Jun 1853 · documented
- `routes.perry[17]` (Naha) → `routes.perry[18]` (Bonin Islands) · Jun 1853 · documented
- `routes.perry[18]` (Bonin Islands) → `routes.perry[20]` (Uraga) · 8 Jul 1853 · documented

**exhibition-1867** · Japan’s official exhibit to the Paris exposition
- `edo` (Edo) → `paris` (Paris) · 1867 · documented · no route in places.yaml; b7-0 shows a Europe map with paris, london, marseille

**mm** · Messageries Maritimes: Marseille to Yokohama, from 1870  
1865: a branch line to Yokohama (Messageries Impériales). 1870: through-sailings after Suez. Atlas route mm: 1870–1914. Port Said is only a route stop, not a world id.
- `routes.mm[0]` (Marseille) → `routes.mm[3]` (Port Said) · 1870 · documented
- `routes.mm[3]` (Port Said) → `routes.mm[4]` (Suez) · 1870 · documented
- `routes.mm[4]` (Suez) → `routes.mm[6]` (Aden) · 1870 · documented
- `routes.mm[6]` (Aden) → `routes.mm[8]` (Galle) · 1870 · documented
- `routes.mm[8]` (Galle) → `routes.mm[11]` (Singapore) · 1870 · documented
- `routes.mm[11]` (Singapore) → `routes.mm[13]` (Hong Kong) · 1870 · documented
- `routes.mm[13]` (Hong Kong) → `routes.mm[15]` (Shanghai) · 1870 · documented
- `routes.mm[15]` (Shanghai) → `routes.mm[18]` (Yokohama) · 1870 · documented

**hayashi** · Hayashi’s 218 shipments, Yokohama to Paris, 1884–95  
166,000 prints and 9,708 books by one count; more than 300,000 works by another (argued). map.js pulses the route 218 times.
- `routes.hayashi[0]` (Yokohama) → `routes.hayashi[3]` (Shanghai) · 1884 · documented
- `routes.hayashi[3]` (Shanghai) → `routes.hayashi[5]` (Hong Kong) · 1884 · documented
- `routes.hayashi[5]` (Hong Kong) → `routes.hayashi[7]` (Singapore) · 1884 · documented
- `routes.hayashi[7]` (Singapore) → `routes.hayashi[10]` (Galle) · 1884 · documented
- `routes.hayashi[10]` (Galle) → `routes.hayashi[12]` (Aden) · 1884 · documented
- `routes.hayashi[12]` (Aden) → `routes.hayashi[14]` (Suez) · 1884 · documented
- `routes.hayashi[14]` (Suez) → `routes.hayashi[15]` (Port Said) · 1884 · documented
- `routes.hayashi[15]` (Port Said) → `routes.hayashi[18]` (Marseille) · 1884 · documented
- `routes.hayashi[18]` (Marseille) → `routes.hayashi[19]` (Paris) · 1884 · documented

**vangogh-copies** · Van Gogh’s copies: Edo prints to Paris, then to Amsterdam  
v4 shows a Europe map with paris, amsterdam, london points and no line.
- `edo` (Edo) → `paris` (Paris) · 1887.2 · documented · about 660 prints bought, probably from Bing (probable); atlas route edo-copy cites e1887
- `paris` (Paris) → `amsterdam` (Amsterdam) · undated · documented · the copies are in the Van Gogh Museum; linked, not shown

**pm** · Pacific Mail from 1867 and the railroad from 1869: Yokohama → San Francisco → Chicago → Boston  
"Boston bought first and most" (b8-1). The counts the case lists for I9 (Bigelow 30,000; Spaulding 6,000; Buckingham; Noyes 1905) are not on the v4 map.
- `yokohama` (Yokohama) → `sanfrancisco` (San Francisco) · 1867.05 · documented · from 1 January 1867
- `sanfrancisco` (San Francisco) → `chicago` (Chicago) · 1869 · documented · by rail (map.js landFrom: 3)
- `chicago` (Chicago) → `boston` (Boston) · 1869 · documented · by rail

**tokuno** · The Tokunō printing set, Tokyo to Washington, 1889
- `tokyo` (Tokyo) → `washington` (Washington) · 1889 · documented · links.tokuno; drawn as one link, no route

**fenollosa** · Fenollosa: Boston → Tokyo 1878 → Boston 1890 → Tokyo exhibition 1898  
people.yaml map: tokyo, boston (points only).
- `boston` (Boston) → `tokyo` (Tokyo) · 1878 · documented · born in Salem, Massachusetts; Salem is not in places.yaml
- `tokyo` (Tokyo) → `boston` (Boston) · 1890 · documented
- `boston` (Boston) → `tokyo` (Tokyo) · 1898 · documented · the exhibition; whether he travelled for it is not stated

**wright** · Wright: Chicago → Japan 1905, prints back to Chicago and Boston  
people.yaml map: chicago, boston. The revamped prints came from "a Tokyo dealer" (b8-4), so the fraud also travels Tokyo → Chicago.
- `chicago` (Chicago) → `tokyo` (Tokyo) · 1905 · documented · "Some of them went to Japan to buy at the source" (b8-1)
- `tokyo` (Tokyo) → `chicago` (Chicago) · 1906 · documented · the Hiroshige show
- `chicago` (Chicago) → `boston` (Boston) · 1913 · documented · the Spaulding commission

## 3. Objects

The prints, documents, maps and sets the unit shows, quotes, links or describes, with what each demonstrates. "shown" distinguishes shown / quoted / linked / described / desks only / not in unit.

| id | label | years | scale | kind | holder | shown | demonstrates | places | people | beats | v0 | conf | sources | note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| hi-wave | Under the Wave off Kanagawa (Met JP1847) | 1831 | world | print | The Metropolitan Museum of Art JP1847 | shown | The icon as a product: the two blues (dark stripes mixed with indigo, the hollow pure Prussian blue printed twice), one signature, no carver or printer; the five depth planes of the overture; the sheet that enters the Met in 1929 and the banknote in 2024. | newyork, yokohama-off, kanagawa, fuji | hokusai, nishimuraya | p-1, b4-0, b4-2, b9-3, b9-1 | L5 S4–S5; L2 S8; I2; I3 | documented | met-wave, met-wave-record, smith-blue | Overture planes wave-p0..p4 and the peel layers are reconstructions from this photograph. |
| jp10 | Under the Wave off Kanagawa, second impression (Met JP10) | 1831 | world | print | The Metropolitan Museum of Art JP10 | shown | Compared with JP1847 under a split slider: clouds almost gone, horizon grey darker, yellow boats, a collector’s seal beside the signature. The lab says: “nothing on the sheets says which was printed first”. | newyork | hokusai, nishimuraya | b4-4 | L5 S6 One design, many originals; I3 | documented | bm-spot, korenberg, met-wave |  |
| aic | Under the Wave off Kanagawa, Art Institute of Chicago 1952.343 | 1831 | world | print | Wikimedia Commons (Art Institute of Chicago 1952.343) File:1952.343 - Under the Wave off Kanagawa (Kanagawa oki nami.jpg | shown | The third aligned impression: pink clouds, probably safflower, the colour that fades soonest; the Institute states its impressions are later than the first state. | chicago | hokusai | b4-4, b9-2 | L5 S6; I3 | documented | bm-spot, korenberg | The case names AIC 1925.3245; the unit uses 1952.343 via Commons. |
| peel | The Great Wave in six colour layers (reconstruction) | 1831 | edo | reconstruction | unit asset (content/peel.json, public/data/print.json) | shown | Lay the blocks down in order: key line, pale washes, the yellow of the boats, the grey of the sky, the lighter blue, the deep blue; the order for this sheet is not recorded; one printer, about 200 sheets a day. | edo | hokusai | b4-3 | L2 S3 The colour blocks; I2 Peel the colours | reconstruction (k-means clusters, labelled as such) | met-wave, aam-process, vam-quartet, korenberg | Six clusters, not the Met’s spectroscopic layers; the Smithsonian progressive proofs are linked, not shown (usage conditions). |
| keyblock | Proof line-block print for a fan, Sadahide (Met 2007.49.284) | undated–19th century | edo | proof | The Metropolitan Museum of Art 2007.49.284 | shown | A carver’s key block pulled in black, with the kentō notches outside the picture that registered every colour block. | newyork | — | b1-6 | L2 S2 The key block; I2 (the key block end of the slider) | documented | vam-quartet, aam-process | Beat b1-6 sits at year 1700 as a stage placeholder; the object is 19th century. |
| harunobu-1765 | Harunobu, Visit to a Shrine at the Hour of the Ox, 1765 (Met JP2438) | 1765 | edo | print | The Metropolitan Museum of Art JP2438 | shown | Full colour in a single year, paid for by poets; no censor’s seal anywhere (the Seal Timeline’s "before 1790" card). | newyork | harunobu | b1-7 | L3 S2 the Met’s Harunobu with "Meiwa 2" on the neckband | documented | met-harunobu, hamatake-harunobu | The neckband date the case points to is not called out in the v4 beat. |
| printshop | Hokusai, a print shop, c. 1802 (LACMA via Commons) | 1802 | edo | book-page | Wikimedia Commons File:Doll Shop of Jikken LACMA M.2006.136.153.jpg | shown | Prints as products: sheets hanging at the front, books in piles; identified by the Tokyo Metropolitan Library as Tsutaya’s own shop (probable). | toriaburacho | hokusai, tsutaya | b2-2 | L4 S2 the shop illustrated in the trade’s own prints | probable (identification) | tml-azuma, forrer-sellers | Beat b2-2 sits at year 1797; the image is c. 1802. |
| utamaro-tsutaya | Utamaro, Woman Holding a Fan, c. 1793 (Cleveland 1940.1031) | 1793 | edo | print | Cleveland Museum of Art 1940.1031 | shown | Tsutaya’s ivy leaf and the kiwame seal side by side; the tap guess "whose marks made them answerable to the law" (designer and publisher; never carver or printer). | toriaburacho | utamaro, tsutaya | b2-4 | L4 S4 the seal shown on AIC 1925.3030 | documented | cma-utamaro, vjp-seals, jaanus-aratame | The case’s seal-reading print is AIC 1925.3030 (publisher Matsumura Yahei); the unit uses this Tsutaya sheet instead. |
| sharaku | Sharaku, Ōtani Oniji III as Yakko Edobei, 1794 (Met JP2822) | 1794.4 | edo | print | The Metropolitan Museum of Art JP2822 | shown | Ten months, about 140 designs, all for Tsutaya; kiwame under the signature with Tsutaya’s mark below (Seal Timeline and Censor’s Desk). | toriaburacho, sakaicho* | sharaku, tsutaya | b2-6 | L4 S6 Sharaku’s ten months (AIC 1934.207 and 1934.239) | documented | met-sharaku, aic-sharaku |  |
| manga | Hokusai Manga, volume one, printing after 1828 (Met JIB81.1) | 1814 | japan | book | The Metropolitan Museum of Art JIB81.1 | shown | A brand outside Edo; the "father of manga" question; the volume of the 1905 packing-paper story. | — | hokusai, eirakuya | b3-2 | L7 S2 the Manga story; L7 argued: whether manga descends from the Manga | documented | bm-manga, met-manga | Published in Nagoya, which has no place in places.yaml. |
| eisen-aizuri | Eisen, an all-blue (aizuri-e) sheet, early 1830s (NDL via Commons) | undated–c. 1830s | edo | print | Wikimedia Commons File:NDL9369507 五節美人合之内 名代床.jpg | shown | One imported colour, in gradations, on white paper: what the 1829 fan fad looked like; also the Eisen courtesan Van Gogh copied. | edo | eisen, iseya | b3-5 | L5 S3 1829: Eisen’s all-blue fan | documented | smith-blue | images.json: "undated on Commons (series c. 1830s)". It stands for the 1829 fan (Brooklyn Museum), which is not shown. |
| redfuji | Hokusai, South Wind, Clear Sky (Red Fuji), c. 1830–32 (Met JP9) | 1831 | japan | print | The Metropolitan Museum of Art JP9 | shown | One of the earliest sheets of the series; 93 known impressions in five states. | fuji, newyork | hokusai, nishimuraya | b3-6 | L5 S8 Fuji from the road | documented | korenberg-fuji, vermeulen |  |
| oi-night | Katsushika Ōi, Night Scene in the Yoshiwara (Ōta Memorial Museum via Commons) | undated–before 1860 | edo | painting | Wikimedia Commons File:Yoshiwara Kōshisakinozu.jpg | shown | A hand inside a famous man’s name: about ten works confirmed as hers; orders to "Hokusai" could be painted by either (probable). | yoshiwara | oi | b4-6 | case §4: "nothing of Katsushika Ōi’s own hand in the open set yet" | documented (attribution); probable (the hidden hand) | ota-oi, davis-oi, wiki-oi | Beat b4-6 sits at 1845 "approximate"; the v4 unit closes the gap the case listed. |
| shower | Hiroshige, Sudden Shower over Shin-Ōhashi Bridge and Atake, 1857 (Met JP2522) | 1857.7 | edo | print | The Metropolitan Museum of Art JP2522 | shown | The worked example of reading a margin: aratame and the date seal 巳九 (Snake year, ninth month), signature, publisher’s mark 下谷 魚栄, series cartouche; cut into five depth planes in Step into the View; the second print Van Gogh copied. | shinohashi, newyork | hiroshige, uoya, vangogh | b6-4 | L6 S7; L7 S4; I1 Read the margin (second sheet) | documented | hiroshige-uk, jaanus-aratame, vjp-seals, vgm-bridge |  |
| namazu | Namazu-e: Kashima pins the catfish, 1855 (Nichibunken via Commons) | 1855.9 | edo | print | Wikimedia Commons File:Namazu-e - Kashima controls namazu.jpg | shown | A trade moving at the speed of news: unsigned, uncensored, within two days of the earthquake; the Seal Timeline’s twist card (no seal, yet 1855). | edo | — | b6-2 | L6 S8 November 1855 | documented | smits-namazu, rom-namazu, mcdowell-namazu |  |
| plum | Hiroshige, Plum Garden at Kameido, 1857 (AIC 1925.3752) | 1857 | world | print | Art Institute of Chicago 1925.3752 | shown | A provenance line that names Frank Lloyd Wright as seller to Kate Buckingham, February 1915; the sheet Van Gogh copied before the other two. | chicago | hiroshige, uoya, wright, vangogh | b8-3 | L7 S6 the Plum Garden’s provenance line; L7 S4 | documented | aic-plum, vgm-japan |  |
| japon-artistique | Le Japon artistique, no. 20, December 1889 (cover) | 1888.4–1891 | world | journal | Wikimedia Commons File:Le Japon artistique décembre 1889.jpg | shown | The second trade presenting the sheets as art: thirty-six issues in three languages. | paris | bing | b7-4 | L7 S3 Bing’s journal | documented | wiki-bing, met-japonisme |  |
| cat | Kuniyoshi, the Okazaki cat demon, c. 1850 (Met JP1563) | 1850 | edo | print | The Metropolitan Museum of Art JP1563 | shown | Saying one thing with another: a cat, a play and an actor’s face at once; the edict named actors, not ghosts or cats; two nanushi seals. | edo, tokaido-38 | kuniyoshi | b5-8 | L6 S6 the cats | documented | met-wave-record, vjp-sumptuary, wiki-kuniyoshi | Okazaki is Tōkaidō station n 38 in places.yaml. |
| danjuro-aic | Kunisada, the actor Ichikawa Danjūrō VII, 1826 (AIC 1937.270) | 1826 | edo | print | Art Institute of Chicago 1937.270 | shown | The star the state banished in 1842 (probable); the actor print as the banned best seller. | sakaicho* | danjuro, kunisada | b5-4 | L6 S5 Danjūrō VII exiled (AIC 2004.241–243 in the case) | documented | ndl-saruwaka |  |
| yokohama-bread | Yoshikazu, Americans Baking Bread, 1861 (AIC 1926.1692) | 1861 | japan | print | Art Institute of Chicago 1926.1692 | shown | Yokohama-e: the last new genre the Edo trade invented. | yokohama | — | b6-5 | spine: 1859–62 the Yokohama prints | documented | wiki-ukiyoe |  |
| playbill | Picture book of play synopses for the Nakamura theatre, 1799 (Met 2013.851) | 1799 | edo | book | The Metropolitan Museum of Art 2013.851 | shown | The theatres needed advertising; the licensed business the state could later ban by name. | sakaicho* | — | b1-4 | case §4 an illustrated playbill | documented | met-playbill |  |
| yoshiwara-nakanocho | Hiroshige, Cherry Blossom Time in Nakanochō, c. 1848–49 (LACMA via Commons) | 1848 | edo | print | Wikimedia Commons File:Cherry Blossom Time in Nakanocho of the Yoshiwara LACMA 16.14.48.jpg | shown | The quarter’s main street as a famous place, beside the contract that put its women there. | yoshiwara | hiroshige, hanaogi | b2-3 | L4 S7 Hanaōgi; I10 | documented | wiki-yoshiwara |  |
| gishi | Kuniyoshi, Ōtaka Gengo Tadao, from the loyal retainers, 1847–48 (BM via Commons) | 1847.6 | edo | print | Wikimedia Commons File:Seichu Gishi Den (BM 1906,1220,0.1163).jpg | shown | One of fifty-one sheets that sold 8,000 sets, 408,000 sheets, by the diary’s count; two headmen’s name seals (1847). | edo, london | kuniyoshi, murata, fujiokaya | b5-6 | L6 S6; I8 An edition | documented | fujiokaya, kato-1847 | Commons dates the sheet c. 1850; the series is 1847–48. |
| map-edo-1859 | Ansei kaisei Oedo ōezu, the 1859 map of Edo (Library of Congress 77694812) | 1859 | edo | map | Library of Congress 77694812 | shown | The city instrument: georeferenced (affine fit to six landmarks, residuals 70–220 m); carries the fire pins, the three moves, the theatres, the publishers’ streets and the 118 Hundred Views dots by season. | castle, nihonbashi | — | b1-2, b1-3, b1-4, b1-4r, b2-1, b5-4, b6-3 | L1 S4 the 1677 map laid over the 1859 map; I4 The city, 1677 to 1859 | documented | loc-1859 | The case calls it "a reissue of a 1696 map". The 1677 companion map is not in the unit. |
| map-edo-1677 | The Library of Congress map of Edo, 1677 | 1677 | edo | map | Library of Congress | not in unit | Twenty years after the fire; the transparency scrub against 1859 that the case asks for in L1 S4 and I4. | edo | — | — | L1 S4; I4 | documented | — | No image, no source id in sources.yaml; objects_events.md row 12 cites LoC gm71005200 and gm71005088 for 1676–77 maps. |
| nihonbashi | Hiroshige, Morning View of Nihonbashi, station one (Met JP471) | 1833.5 | japan | print | The Metropolitan Museum of Art JP471 | shown | Where the road and the series begin; the sheet that appears on the map as the Tōkaidō draws. | nihonbashi, tokaido-0 | hiroshige, hoeido | b4-8 | L6 S7 the stations on the map | documented | wiki-tokaido |  |
| t-shinagawa | Hiroshige, Shinagawa, Hōeidō Tōkaidō, c. 1833–34 | 1833.5 | japan | print | Wikimedia Commons File:Hiroshige-53-Stations-Hoeido-02-Shinagawa-MIA-01.jpg | shown | Station 1 on the road as it draws. | tokaido-1 | hiroshige, hoeido | b4-8 | L6 S7 | documented | wiki-tokaido |  |
| t-kanagawa | Hiroshige, Kanagawa, Hōeidō Tōkaidō, c. 1833–34 | 1833.5 | japan | print | Wikimedia Commons File:Hiroshige-53-Stations-Hoeido-04-Kanagawa-BM-03.jpg | shown | Station 3 on the road as it draws. | tokaido-3 | hiroshige, hoeido | b4-8 | L6 S7 | documented | wiki-tokaido |  |
| t-hakone | Hiroshige, Hakone, Hōeidō Tōkaidō, c. 1833–34 | 1833.5 | japan | print | Wikimedia Commons File:Hiroshige-53-Stations-Hoeido-11-Hakone-MFA-01.jpg | shown | Station 10 on the road as it draws. | tokaido-10 | hiroshige, hoeido | b4-8 | L6 S7 | documented | wiki-tokaido |  |
| t-mishima | Hiroshige, Mishima, Hōeidō Tōkaidō, c. 1833–34 | 1833.5 | japan | print | Art Institute of Chicago 1932.170 | shown | Station 11 of the road as it draws; Kanbara’s snow and Mishima’s mist are the sheets the case names. | tokaido-11 | hiroshige, hoeido | b4-8 | L6 S7 Kanbara’s snow, Mishima’s mist | documented | wiki-tokaido |  |
| t-kanbara | Hiroshige, Kanbara, Hōeidō Tōkaidō, c. 1833–34 | 1833.5 | japan | print | Wikimedia Commons File:Hiroshige-53-Stations-Hoeido-16-Kanbara-MFA-02.jpg | shown | Station 15 of the road as it draws; Kanbara’s snow and Mishima’s mist are the sheets the case names. | tokaido-15 | hiroshige, hoeido | b4-8 | L6 S7 Kanbara’s snow, Mishima’s mist | documented | wiki-tokaido |  |
| t-yui | Hiroshige, Yui, Hōeidō Tōkaidō, c. 1833–34 | 1833.5 | japan | print | Art Institute of Chicago 1963.666 | shown | Station 16 on the road as it draws. | tokaido-16 | hiroshige, hoeido | b4-8 | L6 S7 | documented | wiki-tokaido |  |
| t-shono | Hiroshige, Shōno, Hōeidō Tōkaidō, c. 1833–34 | 1833.5 | japan | print | Art Institute of Chicago 1925.3553 | shown | Station 45 on the road as it draws. | tokaido-45 | hiroshige, hoeido | b4-8 | L6 S7 | documented | wiki-tokaido |  |
| t-kyoto | Hiroshige, Kyoto (Sanjō Ōhashi), Hōeidō Tōkaidō, c. 1833–34 | 1833.5 | japan | print | Art Institute of Chicago 1925.3563 | shown | Station 54 on the road as it draws. | tokaido-54 | hiroshige, hoeido | b4-8 | L6 S7 | documented | wiki-tokaido |  |
| hv-099 | Hiroshige, Kinryūzan Temple at Asakusa (no. 99), 1856 (Met JP2519) | 1856 | edo | print | The Metropolitan Museum of Art JP2519 | shown (cut into depth planes, labelled reconstruction) | Step into the View: the sheet cut into depth planes; the composition rules (a frame in front, stacked bands, a raised horizon) with their confidence. | asakusa | hiroshige, uoya | b6-3, b6-4 | not in the v0 case (v4 Depth builder) | documented (object); argued (the depth rules) | hiroshige-uk, wiki-100views | places.yaml views n 99 carries the map xy. |
| hv-058 | Hiroshige, Sudden Shower over Shin-Ōhashi Bridge and Atake (no. 58), 1857 (Met JP2522) | 1857 | edo | print | The Metropolitan Museum of Art JP2522 | shown (cut into depth planes, labelled reconstruction) | Step into the View: the sheet cut into depth planes; the composition rules (a frame in front, stacked bands, a raised horizon) with their confidence. | shinohashi | hiroshige, uoya | b6-3, b6-4 | not in the v0 case (v4 Depth builder) | documented (object); argued (the depth rules) | hiroshige-uk, wiki-100views | places.yaml views n 58 carries the map xy. |
| hv-107 | Hiroshige, Fukagawa Susaki and Jūmantsubo (no. 107), 1856 (Met JP2520) | 1856 | edo | print | The Metropolitan Museum of Art JP2520 | shown (cut into depth planes, labelled reconstruction) | Step into the View: the sheet cut into depth planes; the composition rules (a frame in front, stacked bands, a raised horizon) with their confidence. | edo | hiroshige, uoya | b6-3, b6-4 | not in the v0 case (v4 Depth builder) | documented (object); argued (the depth rules) | hiroshige-uk, wiki-100views | places.yaml views n 107 carries the map xy. |
| ukie-1748 | Masanobu, Perspective View (uki-e) of a Kabuki Theatre, 1748 (Enkyō 5), first month (Met JP3059) | 1748 | edo | print | The Metropolitan Museum of Art JP3059 | shown (folded into a box, labelled reconstruction) | One-point perspective from European engravings: the receding lines meet at one point; the sheet folds into floor, walls, ceiling and stage. | sakaicho* | masanobu | b1-5u | not in the v0 case | documented | met-ukie, wiki-ukie |  |
| desk-danjuro | Utagawa Kunisada; publisher Kawaguchiya Uhei, Ichikawa Danjūrō VII as Kan Shōjō in the Mt. Tenpai Scene (Famous Kabuki Plays), 1814 (Cleveland Museum of Art) | 1814 | edo | print | Cleveland Museum of Art | shown (desks only) | kiwame above the publisher’s mark: an actor print was legal in 1814 (Censor’s Desk proof; Seal Timeline card). | sakaicho* | — | — | I1 Read the margin (third print with nanushi seals; the check print); I7 Before and after the ban (actors1850, suikoden) | documented | jaanus-aratame, vjp-seals, kato-1847 | Lab object (desks.json); not in content/images.json and not on a story beat. |
| desk-suikoden | Utagawa Kuniyoshi; publisher Kagaya Kichibei, Rōri Hakuchō Chōjun (108 Heroes of the Shuihu zhuan), late 1820s (Cleveland Museum of Art) | 1828 | edo | print | Cleveland Museum of Art | shown (desks only) | A warrior from a novel broke no rule in the late 1820s; kiwame seal (Censor’s Desk proof). | edo | — | — | I1 Read the margin (third print with nanushi seals; the check print); I7 Before and after the ban (actors1850, suikoden) | documented | jaanus-aratame, vjp-seals, kato-1847 | Lab object (desks.json); not in content/images.json and not on a story beat. |
| desk-omori | Utagawa Kuniyoshi; publisher Kagaya Kichibei, Ōmori (Famous Places in the Eastern Capital), early 1830s (Cleveland Museum of Art) | 1832 | edo | print | Cleveland Museum of Art | shown (desks only) | A famous place broke no rule in the early 1830s (Censor’s Desk proof). | edo | — | — | I1 Read the margin (third print with nanushi seals; the check print); I7 Before and after the ban (actors1850, suikoden) | documented | jaanus-aratame, vjp-seals, kato-1847 | Lab object (desks.json); not in content/images.json and not on a story beat. |
| desk-carp | Katsushika Hokusai, Carp Swimming by Water Weeds, 1831 (Cleveland Museum of Art) | 1831 | edo | print | Cleveland Museum of Art | shown (desks only) | The 改 in Hokusai’s signature is a name change, not a seal; the censor’s seal is the round 極 (Seal Timeline card). | edo | — | — | I1 Read the margin (third print with nanushi seals; the check print); I7 Before and after the ban (actors1850, suikoden) | documented | jaanus-aratame, vjp-seals, kato-1847 | Lab object (desks.json); not in content/images.json and not on a story beat. |
| desk-odawara | Utagawa Kuniyoshi; publisher Enshūya Matabei, Odawara: Minamoto no Yoritomo Visits the Daughter of Itō Nyūdō (Fifty-three Pairings for the Tōkaidō), mid-1840s (Cleveland Museum of Art) | 1845 | edo | print | Cleveland Museum of Art | shown (desks only) | One ward headman’s name seal (Mura), used alone 1843–47: the nanushi band’s earliest form. | tokaido-9 | — | — | I1 Read the margin (third print with nanushi seals; the check print); I7 Before and after the ban (actors1850, suikoden) | documented | jaanus-aratame, vjp-seals, kato-1847 | Lab object (desks.json); not in content/images.json and not on a story beat. |
| desk-seki | Utagawa Hiroshige; publisher Maruya Seibei, Seki (The Fifty-three Stations of the Tōkaidō), c. 1848–49 (Cleveland Museum of Art) | 1848.5 | edo | print | Cleveland Museum of Art | shown (desks only) | Two name seals (Mera and Watanabe) and no date seal: after 1847, before 1852. | tokaido-47 | — | — | I1 Read the margin (third print with nanushi seals; the check print); I7 Before and after the ban (actors1850, suikoden) | documented | jaanus-aratame, vjp-seals, kato-1847 | Lab object (desks.json); not in content/images.json and not on a story beat. |
| desk-actors1850 | Utagawa Kunisada I (Toyokuni III), Ichikawa Ebizō V as Goshōgun Kanki and Ichikawa Danjūrō VIII as Watōnai Sankan, Nakamura Theatre, fifth month 1850, 1850 (Art Institute of Chicago) | 1850.4 | edo | print | Art Institute of Chicago | shown (desks only) | Two headmen’s seals and cartouches naming roles, never actors: "actors without names", six or seven tenths of sales by 1847. | sakaicho* | — | — | I1 Read the margin (third print with nanushi seals; the check print); I7 Before and after the ban (actors1850, suikoden) | documented | jaanus-aratame, vjp-seals, kato-1847 | Lab object (desks.json); not in content/images.json and not on a story beat. |
| desk-hotohoto | Utagawa Hiroshige; publisher Echimuraya Heisuke, Hotohoto Festival at Izumo Grand Shrine (Famous Places in the Sixty-odd Provinces), 1853 (Cleveland Museum of Art) | 1853.5 | edo | print | Cleveland Museum of Art | shown (desks only) | One aratame seal and no names, 1853; the carver Hori Sennosuke named in the margin: a carver’s name on a sheet. | edo | — | — | I1 Read the margin (third print with nanushi seals; the check print); I7 Before and after the ban (actors1850, suikoden) | documented | jaanus-aratame, vjp-seals, kato-1847 | Lab object (desks.json); not in content/images.json and not on a story beat. |
| tenpo-edict | The Tenpō town order, sixth month of 1842: 「錦絵と唱、歌舞伎役者遊女女芸者等を壱枚摺ニ致候義、風俗ニ拘り候筋ニ付」 | 1842.5 | edo | document | Katō Yoshio, Ukiyo-e jiten (transcription of Shichū torishimari ruishū) | quoted | The wording of the ban: single sheets of actors, courtesans and geisha "concern public morals"; stock too; subjects should be loyalty, filial piety, chastity and children’s instruction. The Censor’s Desk rule-book r1842. | castle | tadakuni | b5-2 | L6 S2 its wording on screen; I7 the edict’s text appears at the midpoint | documented | kato-tenpo, vjp-sumptuary |  |
| tenpo-cap | The eleventh-month order of 1842: 「壱枚絵団扇絵共、拾六文以上は無用之事」 | 1842.9 | edo | document | Katō Yoshio, Ukiyo-e jiten | quoted | Nothing above sixteen mon; printings limited to seven or eight and sets to three sheets (probable); the cap drawn on the price lane. | castle | tadakuni | b5-3 | L6 S3 The price cap; I5 the 1842 cap landing on the price line | documented (cap); probable (impression limit) | kato-tenpo |  |
| price-1805 | A record of 1805: an ordinary sheet at twenty mon; kake-soba at sixteen | 1805 | edo | document | Hoover Institution, "Nishiki-e defined"; nippon.com (soba) | cited | The price lane’s earliest point: a picture cost about a meal. | edo | — | b5-1 | I5 What a sheet cost | documented | hoover, nippon-soba |  |
| fujiokaya-diary | The Fujiokaya diary, Kaei years: 8,000 sets between the 7th month of 1847 and the 3rd of 1848; the flop | 1847.6–1848.3 | edo | document | Katō Yoshio (transcription) | cited | The only sales record at this scale: 408,000 sheets filling one speck per sheet; 3,000 printed and 450 sold beside it. | edo | fujiokaya, kuniyoshi, murata | b5-6 | L6 S6; I8 An edition | documented | fujiokaya, kato-1847 |  |
| magistrate-1847 | The town magistrate’s reports of 1847 on actor prints | 1847.1 | edo | document | Katō Yoshio, Ukiyo-e hikka-shi 7 | cited | Six or seven tenths of sales were actor pictures "without names"; in the fifth month the magistrate lets them pass. The evidence line of the b5-7 argued station and a Censor’s Desk notice. | edo | — | b5-7 | L6 S4; I7 second drag | documented | kato-1847 |  |
| hokusai-letter-1835 | Hokusai’s letter of 1835 offering up his share of the carving fee to secure Egawa Tomekichi | 1835 | edo | document | cited via Wikipedia (Egawa Tomekichi) and Korenberg | cited | One of very few records of what a carver was worth; implies designers took a cut of the carver’s pay. | edo | hokusai, egawa | b4-7 | L2 S7 the one pay record | documented | wiki-egawa, korenberg |  |
| eijudo-advert-1831 | Eijudō’s advertisement for New Year 1831: one view to a sheet, "more than one hundred, without being limited to thirty-six" | 1831 | edo | document | quoted via Smith, "Hokusai and the Blue Revolution" | quoted | The publisher’s bet in his own words; the series stopped at forty-six. | bakurocho | nishimuraya, hokusai | b3-6 | L5 S4 New Year 1831: Eijudō’s advertisement; I6 at 1831 the series | documented | smith-blue |  |
| toho-memoir | Seisōdō Tōho, Masaki no kazura: the blue fan fad of 1829 and "a great fad, double that of the fans" | 1829–1831 | edo | document | quoted via Smith | quoted | The bookseller’s account that dates the fad and links it to the Fuji series. | edo | toho, iseya, eisen, nishimuraya | b3-5, b3-6 | L5 S3 a bookseller’s memoir says | documented | smith-blue |  |
| hokusai-postscript-1834 | Hokusai’s postscript of 1834: at a hundred and ten "each dot, each line will possess a life of its own" | 1834 | edo | document | quoted via the British Museum blog | quoted | Reading A of "Who made the Great Wave?": the genius in the signature. | edo | hokusai | b4-5 | L2 argued: Hokusai the genius against the system | documented | bm-manga, wiki-hokusai |  |
| indenture-c1800 | A Yoshiwara indenture around 1800: a lump sum (for instance 25 ryō) for years of service (for instance five), signed by a father | 1800 | edo | document | Samurai Archives (terms); Seigle (1993) and Stanley (2012) as the two readings | read, not played | The pictures’ subjects were people under contract; two scholarly readings side by side, no verdict. | yoshiwara | hanaogi | b2-3 | L4 S7; I10 The contract | documented (terms); contested (readings) | sa-yoshiwara, wiki-yoshiwara, met-hanaogi |  |
| nagasaki-blue-prices | Smith’s figures for the Chinese price of the blue at Nagasaki: 87 monme a kin in 1824, 31 by 1828 | 1824–1828 | world | dataset | Henry D. Smith II (2005) | drawn (timeline blueprice line) | The price fall that turned a luxury into a print colour; the evidence of the b3-4 argued station. | nagasaki | — | b3-4 | L5 S2 The price falls, 1824–28, from the import records; a line; I6 the price line falls | documented | smith-blue |  |
| tokuno-set | The Tokunō gift, 1889: blocks, tools, pigments and over a hundred progressive proofs (NMAH GA.03217.24) | 1889 | world | set | Smithsonian, National Museum of American History GA.03217.24 | linked, not shown | The one complete process set in a public collection; its records name the carver and the printers, the only time this story names them. | washington, tokyo | tokuno, kido, yamamoto, nakamura, morikawa | b8-5, b9-4 | L2 S3 the Smithsonian’s real 23-stage proof set, linked; L7 S7; I2 honesty line | documented | si-tokuno, nmah-proof | Proof count: "over a hundred" in story.yaml and people.yaml (whole gift); "23 progressive proofs" / "23-stage" in the case §4 and I2 (one sheet, the Rustic Genji record). Both may be true; the unit should say which. |
| yen-note | The thousand-yen note of 3 July 2024, the Great Wave on its back | 2024.5 | japan | banknote | Bank of Japan; National Printing Bureau | described, not shown | A cheap print become money; the overture draws the wave inside a schematic outline, never the note. | tokyo | — | p-1, b9-3 | L7 S8 2024: the thousand-yen note; I9 a last tap jumps to 2024 | documented | boj-note, npb-1000 |  |
| vangogh-copies | Van Gogh’s three copies in oil, autumn 1887 (Van Gogh Museum, Amsterdam) | 1887.8 | world | painting | Van Gogh Museum s0115V1962 (Bridge in the Rain) | linked, not shown | Two after Hiroshige (the plum orchard, the sudden shower), one after Eisen; the copies change what they copy. | amsterdam, paris | vangogh | b7-5 | L7 S4 Met JP2522 beside a link to Amsterdam | documented | vgm-japan, vgm-bridge |  |
| bm-census | The British Museum census of Great Wave impressions: 111 by 2020 in eight states; 113 by 2024 | 2020–2024 | world | dataset | British Museum (Korenberg) | cited (runs lane; slider guess) | Every count is a museum’s, not a publisher’s; no block survives; up to 8,000 printed is an inference from wear (argued). | london | — | b4-4, b9-1g, b9-2 | L5 S7 111 located impressions; I3 | documented (count); argued (the run) | bm-spot, korenberg |  |
| packing-memoir-1905 | The 1905 memoir: Bracquemond’s "un petit livre bizarrement broché" at Delâtre’s | 1905 | world | document | via the Ōta Memorial Museum note (Hinohara, 2021) | quoted | The packing-paper legend’s earliest printed source: one bound book, not wrapping paper; the 1856 date disputed. The b7-1g timeline guess. | paris | — | b7-1, b7-2 | L7 S2 the Manga story told as a legend, with Eidelberg’s doubts | documented (1905 printing); contested (1856 event) | ota-packing |  |
| portrait-hokusai | Portrait of Katsushika Hokusai (by his pupil) (Keisai Eisen, before 1848) | 1848 | edo | portrait | Wikimedia Commons File:Portrait of Hokusai by Keisai Eisen.jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | hokusai | b3-1 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-hiroshige | Memorial Portrait of Ichiryusai Hiroshige (shini-e) (Utagawa Kunisada (Toyokuni III), 1858) | 1858 | edo | portrait | Wikimedia Commons File:Memorial Portrait of Hiroshige, by Kunisada.jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | hiroshige | b4-8 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-tsutaya | Tsutaya Juzaburo, detail from the kibyoshi Hakoiri musume menya ningyo (Santo Kyoden, 1791) | 1791 | edo | portrait | Wikimedia Commons File:Tsutaya juuzaburou.jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | tsutaya | b2-1 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-utamaro | Portrait of Kitagawa Utamaro (attributed to Chobunsai Eishi, 1815) | 1815 | edo | portrait | Wikimedia Commons File:Kitagawa Utamaro portrait (cropped).jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | utamaro | b2-6 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-kuniyoshi | Memorial portrait (shini-e) of Utagawa Kuniyoshi, with record of his names, death date and burial place (Ochiai Yoshiiku, 1861) | 1861 | edo | portrait | Wikimedia Commons File:Shini-e (BM 1912,0416,0.222).jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | kuniyoshi | b5-6 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-kunisada | Memorial Portrait of the Artist Utagawa Kunisada (Toyokuni III) (Toyohara Kunichika, circa 1864 (as stated on Commons; Kunisada died Jan 1865)) | 1864 | edo | portrait | Wikimedia Commons File:Brooklyn Museum - Memorial Portrait of the Artist Utagawa Kunisada (Toyokuni III) - Kunichika Toyohara.jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | kunisada | — | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-kyoden | The Writer Santo Kyoden (a.k.a. Kitao Masanobu) (Chokyosai (Rekisentei) Eiri, circa 1795) | 1795 | edo | portrait | Wikimedia Commons File:MET DP141352.jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | kyoden | b2-5 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-eisen | Self-portrait of Keisai Eisen, from the book Yaji musubi koi no tsurutenn (Tenpo 7) (Keisai Eisen, 1836) | 1836 | edo | portrait | Wikimedia Commons File:Eisen-zikazou.jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | eisen | b3-5 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-sadanobu | Portrait of Matsudaira Sadanobu (self-portrait, colour on silk) (Matsudaira Sadanobu, Tenmei 7 (1787)) | 1787 | edo | portrait | Wikimedia Commons File:Matsudaira Sadanobu.jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | sadanobu | b2-4 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-tadakuni | Portrait of Mizuno Tadakuni (Tsubaki Chinzan, Tenpo era (1830-1844)) | 1830 | edo | portrait | Wikimedia Commons File:Mizuno Tadakuni.jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | tadakuni | b5-1 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-hayashi | Photograph of Hayashi Tadamasa (Unknown photographer, 1904) | 1904 | world | portrait | Wikimedia Commons File:Hayashi Tadamasa.png | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | hayashi | b7-3 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-bing | Photograph of Siegfried (Samuel) Bing (Unknown photographer, before 1906) | 1906 | world | portrait | Wikimedia Commons File:Samuel Bing.jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | bing | b7-4 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-van-gogh | Self-Portrait (Vincent van Gogh, 1887) | 1887 | world | portrait | Wikimedia Commons File:Vincent van Gogh - Self-Portrait - 1954.326 - Art Institute of Chicago.jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | vangogh | b7-5 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-wright | Frank Lloyd Wright, head-and-shoulders portrait facing right (Unknown photographer, c. 1 March 1926) | 1926 | world | portrait | Wikimedia Commons File:Frank Lloyd Wright LC-USZ62-36384.jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | wright | b8-3 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-perry | Commodore Matthew Calbraith Perry (daguerreotype) (Mathew B. Brady, circa 1856-1858) | 1856 | world | portrait | Wikimedia Commons File:Commodore Matthew Calbraith Perry.jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | perry | b6-0 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-fenollosa | Ernest Fenollosa, photograph (Unknown photographer, about 1890) | 1890 | world | portrait | Wikimedia Commons File:Fenollosa.jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | fenollosa | b8-1r | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-danjuro-vii | Shichidaime Ichikawa Danjuro (surimono portrait of Ichikawa Danjuro VII) (Utagawa Kunisada, 1823) | 1823 | edo | portrait | Wikimedia Commons File:Shichidaime ichikawa danjūrō LCCN2009615109.jpg | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | danjuro | b5-4 | case §2 the cast | documented | — | Portrait; no place of its own. |
| portrait-ieyasu | Portrait of Tokugawa Ieyasu (Kano Tan'yu, early Edo period (17th century)) | undated | edo | portrait | Wikimedia Commons File:Tokugawa Ieyasu2.JPG | shown (cast chip and card; timeline event image) | A likeness for the cast; carries the timeline event mark where timeline.yaml names it. | — | ieyasu | b1-1 | case §2 the cast | documented | — | Portrait; no place of its own. |

## 4. Groups

Chronological runs that read as one story. Members are listed in full in inventory.json.

| id | label | years | scale | kind | members | places | people | objects | beats | v0 | drawn | conf | note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| censor-regimes | The censor regimes: no seal → kiwame 1790 → named headmen 1843 → aratame and a date 1853 | 1600–1876 | edo | regimes | [1600, 1790] No seal required; [1790, 1843] e1790 (The kiwame seal 極); [1843, 1853] x1843-nanushi (Named censors’ seals (one; two from 1847; with a date from 1852)); [1853, 1876] e1842 (seal: true), e1842c (Aratame 改 and a date) | castle | sadanobu, tadakuni, murata | utamaro-tsutaya, sharaku, desk-odawara, desk-seki, desk-hotohoto, shower, namazu | b2-4, b2-5, b5-5, b6-4 | L2 S7; I1 Read the margin: the four bands; L4 S4 | yes | documented (bands); probable (who examined after 1853) | timeline.yaml bands; desks.json bands add who examined. The v4 Seal Timeline, Catalogue Desk and Censor’s Desk all run on it. b5-5 animates the bands (bandsanim). |
| fuji-series | From a fan to a series: Eisen’s all-blue fan 1829 → Eijudō’s advertisement New Year 1831 → Thirty-six Views c. 1830–32 → forty-six | 1829–1835 | japan | run | 1829 e1829 (Eisen’s all-blue fan starts a fad); 1831 e1831 (The advertisement; the series in the new blue); 1831 Red Fuji, one of the earliest; the Great Wave; 1835 Ten extra views with black outlines by c. 1835 (case only) | edo, bakurocho, fuji | eisen, iseya, toho, nishimuraya, hokusai | eisen-aizuri, eijudo-advert-1831, redfuji, hi-wave | b3-5, b3-6, b4-0 | L5 S3–S4, S8 | yes | documented | The ten extra views are in the case, not in the unit. |
| blue-price | The blue’s price at Nagasaki: 87 monme a kin in 1824 → 31 by 1828 | 1824–1828 | world | price | 1824 87 monme a kin; 1828 31 monme a kin; undated The Dutch withdraw from the blue trade | nagasaki | — | nagasaki-blue-prices | b3-4 | L5 S2; I6 | yes | documented | Timeline stage blueprice: true. Only two dated points. |
| price-sequence | What a sheet cost: 20 mon 1805 → 24 mon 1842 → the 16-mon cap, eleventh month 1842 → 20–24 mon 1847 → 24–32 mon 1865; soba 16, then 24 | 1805–1865 | edo | price | 1805: 20 mon documented; 1842: 24 mon documented; 1842.9: 16 mon (cap) documented; 1847.5: 20–24 mon documented; 1865: 24–32 mon probable; soba: 16–24 mon | edo | tadakuni | price-1805, tenpo-cap, fujiokaya-diary | b5-1, b5-2, b5-3 | L6 S3; I5 What a sheet cost | yes | documented (1805–1847); probable (1865) | Timeline price lane with cap: true. The case’s I5 adds a theatre seat and a triptych; the triptych is here (1847.5), the seat is not. |
| print-runs | Print runs: Great Wave up to 8,000 (estimate) → Tōkaidō sheets 12,000–15,000 (estimate) → loyal retainers 408,000 sheets (record) | 1831–1848 | edo | run | 1831 Great Wave, up to 8,000 (estimate); 1833.5 Tōkaidō sheets, 12,000–15,000 (estimate); 1847.6 Loyal retainers: 8,000 sets, 408,000 sheets; undated About 200 sheets a day for one printer; about 2,000 to profit; 1848.3 The flop: 3,000 printed, 450 sold | edo | hokusai, hiroshige, kuniyoshi, fujiokaya | hi-wave, nihonbashi, gishi, fujiokaya-diary, bm-census | b4-3, b4-4, b4-8, b5-6, b5-7, b9-1g, b9-2 | I8 An edition; L5 S7 | yes | probable (estimates); documented (1847–48) | Timeline runs: true (bubbles sized by count). |
| kansei-punishments | The examples after the seal: Kyōden manacled and Tsutaya fined 1791 → bust portraits of women banned 1800 → Utamaro manacled 1804 | 1790–1806 | edo | run | 1790 e1790; 1791 e1791; 1800 e1800; 1804 e1804; 1806 Utamaro dies | toriaburacho, castle | sadanobu, kyoden, tsutaya, utamaro | portrait-kyoden, portrait-utamaro | b2-5, b2-8 | L4 S4–S5; L4 S8 | yes | documented; probable (1800, 1804 per the case) | b2-5 and b2-8 show them as lifespans and bands on the timeline. "The golden age ended in handcuffs twice." |
| ban-effects | The ban and its effects: the order 1842 → nameless actors by 1847 → the magistrate lets them pass → warriors, cats and views | 1842–1850 | edo | run | 1842.5 e1842; 1842.9 e1842c; 1842 e1842t; 1847.1 x1847-report; 1847.6 e1847; 1850 The cat demon of Okazaki | edo | tadakuni, kuniyoshi | tenpo-edict, magistrate-1847, gishi, cat, desk-actors1850 | b5-2, b5-3, b5-4, b5-6, b5-7, b5-8 | L6 S2–S6; I7 Before and after the ban | yes | documented | v4 tells it in six beats and the Censor’s Desk; the case’s slider (actor triptych fades, warrior triptych rises) is not built. |
| hundred-views | One Hundred Famous Views of Edo, 1856–58: 118 views by season, finished as Hiroshige dies | 1856–1858 | edo | series | 1856 e1856 (The series begins); 1857.7 Sudden Shower, 9th month of the Snake year; 1858 e1858 (Hiroshige dies);  views with map xy in places.yaml, coloured by season | edo, shinohashi, asakusa | hiroshige, uoya | shower, plum, hv-099, hv-058, hv-107, map-edo-1859 | b6-3, b6-4 | L6 S7 the Hundred Famous Views as a last portrait of the city | yes | documented | Map layer views (119 entries in places.yaml, n 1–119 including the two Akasaka sheets); the series is not on the timeline as a run. |
| afterlife | The afterlife, 1867 → 2024: Paris, Boston, Chicago, Washington, London, Tokyo | 1867–2024.5 | world | lane | 1867 e1867 (Japan at the Paris exposition); 1884 e1884 (Hayashi’s Paris shop); 1887.8 e1887 (Van Gogh’s copies); 1888.4 e1888 (Le Japon artistique); 1889 e1889 (Tokunō’s gift names the carvers); 1890 e1890 (Bing’s 700 prints); 1898 e1898 (Fenollosa’s Tokyo exhibition); 1905 e1905 (The “packing paper” story in print); … (15 in all) | paris, boston, chicago, washington, newyork, london, tokyo | hayashi, bing, vangogh, fenollosa, wright, tokuno | japon-artistique, plum, tokuno-set, yen-note, bm-census | b7-0, b7-2, b7-6, b8-1g, b8-4, b8-2, b9-1g, b9-2, b9-4 | L7 The afterlife; I9 The export map: scrubs 1854 to 1925 | yes | documented | Timeline lane "after" (13 events) plus e2024 on the state lane. |
| wave-census | Counting the survivors: 111 Great Waves located by 2020 → 113 by 2024; Red Fuji 93; the Met’s 121 Fuji impressions | 2020–2024 | world | census | 2020 e2020 (111 in eight states); 2024 x2024-census (113); 2021 Red Fuji: 93 impressions, five states; 2019 The Met holds all 46 designs in 121 impressions | london, newyork | — | bm-census, hi-wave, jp10, aic, redfuji | b4-4, b9-1g, b9-2 | L5 S7 | yes | documented |  |
| wright-arc | Wright as a dealer: Japan 1905 → the Hiroshige show 1906 → the Spaulding deal 1913 → the revamped prints 1920 → prints at a dollar 1928 | 1905–1928 | world | run | 1905 x1905-wright; 1906.2 e1906; 1913 e1913; 1915.1 x1915-plum; 1920 e1920; 1928 x1928-wright | chicago, boston, tokyo | wright | plum, portrait-wright | b8-3, b8-4 | L7 S6 | yes | documented |  |
| six-eras | The six eras of the v0 spine | 1603–2024 | japan | eras | [1603, 1657] A city is made; [1657, 1765] Black ink to colour; [1765, 1806] The golden age, under a censor; [1806, 1842] Blue and the road; [1842, 1868] The ban and the opening; [1868, 2024] The afterlife | edo | — | — | p-2, b9-4 | case §3 The spine | no | documented | v4 replaces the six eras with five acts on five publishers’ bets (stage acts: true): I 1603–1806, II 1807–1835, III 1841–1868, IV 1865–1928, V 2020–2024. Acts II/III leave 1836–1840 and IV/V leave 1929–2019 uncovered; the acts overlap at 1865–68. |
| five-acts | The five acts of v4: five publishers’ bets | 1603–2024.5 | japan | acts | None A wave in your wallet; 1603–1806 The quarter’s publisher; 1807–1835 A bet on blue; 1841–1868 The ban and the hundred views; 1865–1928 The second trade; 2020–2024 The icon | edo, paris, tokyo | tsutaya, nishimuraya, uoya, hayashi, bing, wright | — | p-2, b9-4 | — | yes | documented |  |
| nengo | The era names (nengō), Keichō to Reiwa: 41 under the timeline | 1596–2026 | japan | eras | Keichō; Genna; Kan'ei; Shōhō; Keian; Jōō; Meireki; Manji; … (41 in all) | — | — | — | — | F1.30 (the Japanese calendar and the date seals) | yes | documented | places.yaml eras; timeline.js "era years". |
| meireki-outbreaks | The three outbreaks of the Meireki fire | 1657 | edo | run | 1 hongo; 2 koishikawa; 3 kojimachi | hongo*, koishikawa*, kojimachi* | — | — | b1-2 | L1 S3 | yes | documented | Also listed as journey fire-1657; here as an ordered run of pins. |
| tsutaya-life | Tsutaya’s life as the Act I spine: 1750 → 1774 → 1776 → 1783 → 1791 → 1794 → 1797 | 1750–1797 | edo | lifespan | 1750 Born in the Shin-Yoshiwara; 1774 Bookshop at the quarter’s gate; 1776 Publishes the Yoshiwara guide alone; 1783 Moves to Tōri Abura-chō; 1791 Fined half his property; 1794.4 Sharaku’s actors; 1797 e1797 (Dies, aged 47) | yoshiwara, yoshiwara-gate*, toriaburacho | tsutaya | portrait-tsutaya, printshop, utamaro-tsutaya, sharaku | b2-1, b2-2, b2-5, b2-6, b2-8 | L4 The publisher’s gamble, S1–S8 | yes | documented | Lifespan bars on the timeline (lifespans: [tsutaya, …]). |

## 5. The v0 lectures and interactives

From EDO_FULL_CASE.md §5–§6. "Storyboard words" counts the case paragraph; "at full volume" applies the case’s own rule of 800–900 narration words per five minutes.

| id | title | lens | min | storyboard words | at full volume | thesis | stations | prediction | argued | closing | opens |
|---|---|---|---|---|---|---|---|---|---|---|---|
| L1 | A city of a million | Place | 8 | 263 | 1280–1440 | The market came before the pictures. | (1) Edo in 1603; (2) The lords’ order; (3) The fire of January 1657; (4) The 1677 map over the 1859 map; (5) The census of 1721; (6) Who lived where; (7) Nihonbashi; (8) The licensed pleasures | Where did the print publishers cluster? Reveal: Nihonbashi, beside the fish market and the bridge where the five highways began. | Was Edo a city of a million, or of 1.3 million? The city’s own count against the modern estimate. | Six taps on the map and the timeline. | I4 The city, 1677 to 1859 |
| L2 | Four hands, one sheet | Objects | 9 | 288 | 1440–1620 | A print is a team product, and the team’s names are mostly lost. | (1) The hanshita-e; (2) The key block; (3) The colour blocks; (4) The baren and the day’s work; (5) The materials; (6) The publisher; (7) Who was named; (8) The Met’s finding | How many people made a print, one, four or ten? Reveal: four trades, and a workshop behind each. | Hokusai the genius against the system; the BM’s "intensely individual" against Davis, Marks and the Met’s spectroscopy. | Order the four stages by one drag; name the one trade that was never named. | I2 Peel the colours, I3 One design, many originals |
| L3 | Colour, calendars and poets | Time | 7 | 170 | 1120–1260 | Full colour was invented by amateurs for a party. | (1) Black ink, hand colour, two colours by 1744; (2) New Year 1765; (3) Over a hundred designs in a year; (4) Harunobu’s five years; (5) The kyōka circles and surimono; (6) Tsutaya turns the circle into a business | Who paid for the earliest full-colour prints: publishers, the shogun or poets? | "First" against "earliest known": benizuri-e by 1744, nishiki-e 1765, and what "perfected" means. | Six taps on the timeline. | — · No interactive is assigned to this lecture in the case; I5 shares its Time lens. |
| L4 | The publisher’s gamble | People and Objects | 9 | 219 | 1440–1620 | Tsutaya Jūzaburō shows what a creative-industry entrepreneur was. | (1) Born in the Yoshiwara, 1750; (2) 1783: the move to Tōri Abura-chō; (3) The stable; (4) 1790–91; (5) The answer to the fine; (6) 1794–95: Sharaku’s ten months; (7) Hanaōgi; (8) 1797: dead at 48 | What did the state punish Tsutaya for, a print, a book or a party? Reveal: three comic books. | Sharaku’s identity, the readings and why it matters less than his publisher. | Six taps. | I1 Read the margin, I10 The contract |
| L5 | Blue | Place and Objects | 9 | 226 | 1440–1620 | The most famous Japanese picture is a European pigment’s price curve. | (1) A chemist’s accident in Berlin, 1704–06; (2) The price falls, 1824–28; (3) 1829: Eisen’s all-blue fan; (4) New Year 1831; (5) Inside the blue; (6) One design, many originals; (7) 111 located impressions; (8) Fuji from the road | Where did the blue come from, Japan, China or Prussia? | A Japanese image, or a Dutch pigment and a Western horizon: Smith’s "articulated an Edo world-view" against Guth’s Meiji policy and foreign buyers. | Six taps, one of them "which impression is earlier?". | I6 The blue route, I2 Peel the colours, I3 One design, many originals |
| L6 | The ban and the road | Time | 9 | 230 | 1440–1620 | Censorship made the landscapes. | (1) The Tenpō reforms, 1841–43; (2) The edict of the sixth month of 1842; (3) The price cap of the eleventh month; (4) What the trade did; (5) The theatres moved; (6) Kuniyoshi’s answer; (7) The road; (8) November 1855 | What happened to sales after the ban, down, flat or up? | Did the ban create the landscape print or only speed it (Prussian blue and the travel boom were already there)? | Six taps on the timeline. | I7 Before and after the ban, I5 What a sheet cost, I8 An edition |
| L7 | The afterlife | Place | 8 | 194 | 1280–1440 | The floating world was exported by the hundred thousand, and the export changed what it meant. | (1) Dejima’s trade reversed; (2) 1867: Japan’s pavilion in Paris; (3) Hayashi Tadamasa; (4) October 1887; (5) Monet’s bridge at Giverny, 1895–99; (6) America; (7) Japan’s own reckoning; (8) 2024 | Who sold more Japanese prints to the West, Japanese dealers or French ones? | Exchange against appropriation, the 2015 Boston kimono protests on both sides; and whether manga descends from Hokusai’s Manga (Exner against the lineage story). | Six taps. | I9 The export map |
| L8 | The other makings of Edo | Objects | 6 | 147 | 960–1080 | The same city and the same buyers sustained a dozen trades, each with its own licence and its own names. | (1) Edo komon; (2) Nishijin silk in Kyoto; (3) Lacquer; (4) Netsuke; (5) Arita porcelain; (6) The sword and the carpenter | Which trade had a written rulebook in 1608? | — | Six taps. | — · Entirely absent from the v4 unit. |

### 5a. Stations, one line each

**L1 · A city of a million** (8 min, Place lens)
- (1) Edo in 1603: a castle town on a marsh: the map fades up from nothing
- (2) The lords’ order: from 1635 every daimyō lives in Edo in alternate years; arcs draw the retinues’ roads; the samurai half as a band on the plan
- (3) The fire of January 1657: six tenths burn; the keep never rebuilt; Ryōgoku Bridge and the eastern districts appear
- (4) The 1677 map over the 1859 map: a transparency scrub: what two centuries added
- (5) The census of 1721: over a million, against London and Beijing as bars
- (6) Who lived where: a block of chōnin land against a daimyō mansion of equal footprint; commoner wards about a fifth of the ground
- (7) Nihonbashi: the bridge, the fish market, the publishers’ streets pinned (Tōri Abura-chō, Bakuro-chō, Kodenma-chō)
- (8) The licensed pleasures: three theatres and the Yoshiwara pinned, with the content note

**L2 · Four hands, one sheet** (9 min, Objects lens)
- (1) The hanshita-e: a brush drawing pasted face down on cherry and cut through; the BM’s 2021 find of 103 uncut drawings
- (2) The key block: Met 2007.49.284, Sadahide’s black-line proof, with its registration notches
- (3) The colour blocks: the Great Wave peeled layer by layer (our reconstruction); the Smithsonian’s 23-stage proof set, linked
- (4) The baren and the day’s work: two hundred impressions a day, water-based pigment and rice paste, the sloped table
- (5) The materials: cherry, Echizen hōsho, sumi, safflower, dayflower blue, orpiment; the chain drawn from the paper villages to Edo
- (6) The publisher: owned the blocks, chose the subject, paid per job, reprinted until the lines wore
- (7) Who was named: the law of 1790; the carver as a seal from the 19th century (Hori Take, ten seals); the printer almost never; Hokusai’s 1835 letter
- (8) The Met’s finding: two blues, mixed and double-printed by "Eijudō’s anonymous printing masters"

**L3 · Colour, calendars and poets** (7 min, Time lens)
- (1) Black ink, hand colour, two colours by 1744: the timeline bands light up as the palette grows, each with an open print
- (2) New Year 1765: picture calendars hiding the long and short months, commissioned by two poetry circles; the Met’s Harunobu with "Meiwa 2" on the neckband
- (3) Over a hundred designs in a year: the blocks recut for sale with the patron’s name replaced by the artist’s
- (4) Harunobu’s five years
- (5) The kyōka circles and surimono: privately commissioned, exempt from the sumptuary rules, thick paper, embossing, metal powders; Met JP1252
- (6) Tsutaya turns the circle into a business: the 1788 advertisement inviting poets to submit verses; Utamaro’s insect, shell and bird books

**L4 · The publisher’s gamble** (9 min, People and Objects lens)
- (1) Born in the Yoshiwara, 1750: a bookshop at the quarter’s gate; the Yoshiwara guides as his monopoly
- (2) 1783: the move to Tōri Abura-chō: shown on the map; the shop illustrated in the trade’s own prints
- (3) The stable: Kyōden, Utamaro, Bakin apprenticed in the shop, Ikku
- (4) 1790–91: the Kansei edicts; the kiwame seal; Kyōden manacled fifty days; Tsutaya fined half; the seal on AIC 1925.3030
- (5) The answer to the fine: Utamaro’s bust portraits, the most expensive prints of the decade, mica grounds later banned
- (6) 1794–95: Sharaku’s ten months: 140-odd designs, all for Tsutaya, then nothing; AIC 1934.207 and 1934.239
- (7) Hanaōgi: the only women who could legally be named were courtesans; escaped the quarter in 1794 and brought back; content note
- (8) 1797: dead at 48: the firm continues under his name

**L5 · Blue** (9 min, Place and Objects lens)
- (1) A chemist’s accident in Berlin, 1704–06: the pigment reaches Nagasaki on Dutch and Chinese ships; the route drawn as arcs
- (2) The price falls, 1824–28: from the import records; a line
- (3) 1829: Eisen’s all-blue fan: censor-sealed, sells so well that a bookseller’s memoir says Nishimuraya issued the Fuji series in the new blue
- (4) New Year 1831: Eijudō’s advertisement; the series appears; Met JP1847
- (5) Inside the blue: the Met’s spectroscopy: Prussian blue mixed with indigo for the dark stripes, pure Prussian blue printed twice in the hollow
- (6) One design, many originals: three impressions side by side; the BM diagnostics: cartouche breaks, the pink sky, the yellow boats, a splinter in the foam
- (7) 111 located impressions: eight states, no surviving blocks; what "original" means for a print
- (8) Fuji from the road: Red Fuji and the Shower below the summit; the ten extra views with black outlines, a later re-edition

**L6 · The ban and the road** (9 min, Time lens)
- (1) The Tenpō reforms, 1841–43: Mizuno Tadakuni
- (2) The edict of the sixth month of 1842: its wording on screen: actors, courtesans and geisha concern public morals; publication and stock forbidden
- (3) The price cap of the eleventh month: 16 mon a sheet, seven or eight colour impressions, triptych at most, when a ten-colour sheet had sold for 24
- (4) What the trade did: landscape, warriors, sumō; Osaka’s actor prints stop until 1847; Edo’s continue as "actors without names", six or seven tenths of sales
- (5) The theatres moved: the three houses forced to Saruwaka-chō, Danjūrō VII exiled; the map moves them
- (6) Kuniyoshi’s answer: 51 sheets of loyal retainers, 8,000 sets, 408,000 sheets by the diary; the cats; the Taira ghosts (Met JP1115)
- (7) The road: Hiroshige’s Tōkaidō, the stations on the map, Kanbara’s snow, Mishima’s mist; the Hundred Famous Views of Edo as a last portrait, 1856–58
- (8) November 1855: the earthquake, and catfish prints by the hundred within days

**L7 · The afterlife** (8 min, Place lens)
- (1) Dejima’s trade reversed: what went out before 1854: copper, porcelain, lacquer; Cleveland’s Arita jugs in Dutch silver
- (2) 1867: Japan’s pavilion in Paris: Bracquemond’s Manga story told as a legend, with Eidelberg’s doubts
- (3) Hayashi Tadamasa: 166,000 prints in 218 shipments, or over 300,000, both counts; Bing’s journal and his 1890 exhibition
- (4) October 1887: Van Gogh’s three copies: the plum orchard, the bridge in the rain, the Eisen courtesan from a magazine cover; Met JP2522 beside a link to Amsterdam
- (5) Monet’s bridge at Giverny, 1895–99: NGA, open; Whistler’s tearoom
- (6) America: Fenollosa, the Spauldings, Wright as a dealer, the Buckingham prints; the Plum Garden’s provenance line
- (7) Japan’s own reckoning: Fenollosa’s Tokyo show of 1898; shin-hanga and sōsaku-hanga; the Smithsonian’s blocks from Tokunō
- (8) 2024: the thousand-yen note

**L8 · The other makings of Edo** (6 min, Objects lens)
- (1) Edo komon: stencil-dyed patterns on samurai dress, each domain its own, the dye-houses along the Kanda river; Met 2001.428.40 and the stencil 55.175.16
- (2) Nishijin silk in Kyoto: why three of its weavers went to Lyon in 1872
- (3) Lacquer: the Kajikawa family making inrō for the Tokugawa across generations; Shibata Zeshin’s complete set (Cleveland 1916.848)
- (4) Netsuke: the 1781 book that listed the carvers; the ivory question flagged
- (5) Arita porcelain: the VOC order of 64,866 pieces in 1659; Cleveland’s jugs
- (6) The sword and the carpenter: Kiyomaro’s subscription scheme at three ryō a blade; the 1608 proportion scrolls

### 5b. The ten interactives, and what each version built

| id | title | lens | what it does | data it needs | v4 lab | v4 status | v3 tool | v2 widget | v1 page |
|---|---|---|---|---|---|---|---|---|---|
| I1 | Read the margin | Objects | Tap hotspots on a deep-zoomed sheet (signature, publisher’s seal, censor’s seal, date seal, title and series cartouches); each opens its reading. Check: tap the band a fourth print belongs to. | AIC 1925.3030 (Utamaro, kiwame), Met JP2522 (aratame + date), a third print with nanushi seals of 1843–52; the seal chronology as a strip (fallback). | catalogue, sealtimeline | built: Catalogue Desk (OpenSeadragon deep zoom, hotspots harvest words into a catalogue sentence; worked example on the Sudden Shower, two practice sets of three) and Seal Timeline (12 undated prints placed into the four bands, the check). The kiwame print is Cleveland 1940.1031, not AIC 1925.3030. | margin (one sheet, five marks, in order) | margin (one sheet; hotspots floated off the image) | Margin.dc.html (five hotspots on Met JP2522; check dates the sheet to one of four bands) |
| I2 | Peel the colours | Objects | Drag a slider from the key block to the finished sheet; the layers separate (labelled reconstruction); a second slider shows three impressions. Check: which layer was printed twice? | Met JP1847 and the Met’s analysis; the Smithsonian 23-stage proof set as the linked reference. | print | built: Print the Wave (stage: exploded block stack dropping onto the kentō; room: the full workshop in three.js with a 2D bench fallback). Six k-means colour clusters, not the Met’s spectroscopic layers; the "printed twice" check is told in b4-2, not asked; the three-impression slider lives in compare. | peel (layers dropping in order) | not built (the "chain" flowchart stood in) | not built |
| I3 | One design, many originals | Objects | Swipe between three impressions; toggle each BM diagnostic, which circles all three sheets at once; order the three by state. Check: drag them earliest to latest. | Met JP1847, Met JP10, AIC 1925.3245; the BM census diagnostics (cartouche breaks, the break behind the boat, Fuji’s summit, late sea and boat blocks, pink boats, the splinter in the foam). | compare | built: Three Great Waves (aligned sheets, split slider, loupe, five spots: sky, horizon grey, boats, title cartouche, collector’s seal). The ordering check is deliberately dropped: "nothing on the sheets gives their order". AIC 1952.343 stands in for 1925.3245. | waves (three originals, compare under the loupe) | waves (column-width images, marks "positioned approximately", no check) | not built |
| I4 | The city, 1677 to 1859 | Place | Scrub a transparency between the two LoC maps; tap a district for who worked there; move the year to 1841 and watch the theatres relocate. Check: tap where Tsutaya’s shop stood after 1783. | The 1677 and 1859 maps georeferenced; publishers’ addresses; the three theatres before and after; the Yoshiwara, Ryōgoku, Nihonbashi; OpenHistoricalMap grid. | — | partly built as the map instrument, not a lab: the 1859 map georeferenced (georef59.json) with city pins, the three moves animated (yoshiwara-move 1657, tsutaya-move 1783, theatres-move 1842), the fire pins and the views layer; the Act IV Rebuild places tiles on the world map. No 1677 map, no transparency scrub, no district tap, no OpenHistoricalMap (ODbL is not allowed). | map instrument (same) | the 1859 raster with pins ("pins approximate") | Atlas.dc.html (Place lens, schematic map) · The 1677 map is the one data item the case asks for that no version has fetched. |
| I5 | What a sheet cost | Time | Pick a year; the card shows a print, a bowl of soba, a theatre seat and a triptych in mon with source and confidence; a second tap lands the 1842 cap on the price line. Check: by what share did the state cut the price? | Prices: 20 mon 1805; about 24 by the end; 16–32 range; soba 16 then 24; triptych 60–72 mon 1847–48; the 1842 cap; the Samurai Archives benchmarks as secondary; a 51-sheet set. | — | absorbed into the timeline (price lane with the cap and the soba line, stage price: true, cap: true) and the b5-2 slider guess ("what ceiling did the state set?", truth 16 mon). No year-pick card; no theatre seat; the "by what share" check became the beat text ("cut … by a third"). | timeline price lane | price (seven years, five of them interpolated or unsourced, equal bars) | Cost.dc.html (seven years, sheet against soba, the cap on the line) |
| I6 | The blue route | Place | Scrub the years: arcs draw the pigment’s route, the price line falls, at 1829 the fan appears, at 1831 the series. Check: where was Prussian blue made in 1830? | Berlin 1704–06; the Dutch and Chinese routes to Nagasaki; the import-price series 1824–28; the 1829 fan; the 1831 advertisement; the Fuji series. | — | split across beats, not a lab: the map guess b3-2g (where the new blue was earliest made: berlin/canton), the route "blue" drawn at b3-3 (berlin land + voc + china), the timeline blueprice line at b3-4 (argued), the fan at b3-5, the series at b3-6. No single scrub ties route, price and objects together. | map route + timeline line | blue (five hand-set bars "schematic", great-circle arcs crossing land, scrub detached from the main timeline) | in Lecture.dc.html (Lecture 5 "Blue" as the sample station tour) |
| I7 | Before and after the ban | Time | Drag a slider across 1842: the actor triptych fades as the warrior triptych rises; the edict’s text appears at the midpoint; a second drag shows "actors without names" taking six or seven tenths of sales by 1847. Check: which genre was exempt? | AIC 2004.241–243 (Kunisada actors), Met JP1115 (Kuniyoshi’s Taira ghosts), AIC 1975.477; the edict’s wording; the 1847 magistrate’s report. | censor | built differently: the Censor’s Desk is a simulation (after Papers, Please): the learner is the examiner of each period, the rule-book changes at 1790, 1842, 1843, 1853, fourteen real proofs arrive with seals covered, the record says what happened; the b5-7 argued station carries the "did the ban create the landscape print" question. No fade slider; no Taira ghosts; the nameless-actor print is AIC 92260 (Kunisada, 1850). | not built | ban (a CSS "FORBIDDEN · 1842" stamp on a 1783 Kiyonaga stand-in; a 65 % bar) | Ban.dc.html (a year scrubber 1835–1850) |
| I8 | An edition | Time | Press play: a counter runs from day one, sheets per day, sets, the total reaching 408,000; switch to the flop. Check: at 200 a day, how many days for 8,000 impressions of one sheet? | The Fujiokaya diary: 8,000 sets of 51 between the 7th month of 1847 and the 3rd of 1848; 200 impressions a day; the flop of 3,000 printed and 450 sold; the estimates (2,000 to break even; the Tōkaidō 12,000–15,000; the Great Wave up to 8,000). | edition | built: An edition (a log-scale guess first, ghost against truth; 408,000 specks filling to scale, one per sheet, by the diary’s months; printer-days at 200 a day shown as a running figure; the flop as a toggle at the same scale). The "how many days" check is shown, not asked. | edition | edition (a number counter, no image, the flop unnamed) | not built |
| I9 | The export map | Place | Scrub 1854 to 1925: arcs leave Japan with their counts; tap a city for its collection and collector; a last tap jumps to 2024. Check: which collection may never be exhibited? | Dejima’s exports; 1867 Paris; Hayashi’s 218 shipments; Bing; Van Gogh’s 660 prints; Boston (Bigelow 30,000, Spaulding 6,000), Chicago (Buckingham), Washington (Tokunō 1889, Noyes 1905); the 2024 note. | — | split across beats, not a lab: routes mm (b7-1), hayashi with a 218 pulse (b7-3), pm (b8-1), tokuno (b8-5), the Europe map for Van Gogh (b7-5); the Act IV Rebuild puts six afterlife tiles on the world map (Berlin, Paris, Tokyo, Boston, Chicago, Washington). No counts on arcs, no city tap, no scrub, no Bigelow/Noyes. | map routes | export (arcs without counts; counts in a grid below) | not built |
| I10 | The contract | Concepts | Read the indenture’s clauses as cards with sources; tap between two scholarly readings in two columns; nothing scored; content note first and a skip. | The documented terms c. 1800 (a lump sum, e.g. 25 ryō for five years, signed by the father; debts that extend the term; temple registration); Hanaōgi’s record; Seigle’s reading and Stanley’s. | contract | built as specified: six clause cards with sources, Reading A (Seigle) and Reading B (Stanley), no pictures, no score; opened from b2-3 with a content note. | contract (read, not played) | not built | not built |

v1 = `build/prototypes/edo-ux` (a Claude Design canvas: Main, Lecture 5 as a station tour, Margin, Ban, Atlas, Cost). v2 = `build/prototypes/edo-story` (the scrolling atlas with eight embedded tools: chain, margin, blue, waves, price, ban, edition, export). v3 = `build/units/edo` before the v4 story layer (tools peel, waves, margin, edition, contract, recall). v4 = the labs in `src/labs/`: print, compare, edition, contract, catalogue, sealtimeline, censor, view, ukie.

### 5c. What v4 added that v0 did not design

- **Step into the View** (`view`): Three Hundred Views sheets cut into depth planes (reconstruction): parallax behind a window; rebuild the depth order; the flat sheet with its record. Not in v0: True.
- **The uki-e box** (`ukie`): Masanobu’s 1748 theatre: flat bands, the receding lines drawn to their meeting point, the sheet folded into a box. Not in v0: True.
- **Seal Timeline** (`sealtimeline`): Twelve undated prints into the four seal bands by reading their margins (the I1 check, enlarged into a card game). Not in v0: the I1 check, expanded.
- **The overture** (`overture`): Nine scroll-driven shots: washi, the Wave in five depth planes, the shop, the blocks on the kentō, the 1859 map tilting flat with the Tōkaidō drawing west, the kiwame seal, Yokohama → Paris, the Wave in a banknote outline, the five acts. Not in v0: True.
- **The act Rebuilds** (`rebuilds`): Six tiles per act placed back on the timeline (Acts I, II, III, V) or the world map (Act IV), each with a hint; one tile carried over from the previous act. Not in v0: the case’s six closing taps, as drag-to-place.
- **The guesses** (`guesses`): Nine in-beat guesses (slider, tap, map, route, choice, timeline, bet), never on a scene’s opening or closing beat, answered by the next beat. Not in v0: the case’s one-tap predictions, redistributed.
- **The argued stations** (`argued`): Five: when the blue reached Edo’s printers (b3-4); who made the Great Wave (b4-5); did the ban create the landscape print (b5-7); exchange or appropriation (b7-6). Not in v0: four of the case’s eight argued stations survive; see gaps.

## 6. Gaps: v0 lecture content the v4 beats dropped

v0: 1737 storyboard words over 65 minutes, which is 10400–11700 narration words at full volume (the eight headings sum to 65 minutes; the case says "about 62 minutes"). v4: 4083 words in 71 beats plus 153 in the overture (per act: p 131, a1 1073, a2 957, a3 880, a4 759, a5 283). Storyboard words dropped outright: 472; partly dropped: 380. The case sets narration at 800–900 words per five minutes (160–180 a minute); a lecture at full volume is minutes × that, not its storyboard count.

| lecture | station | dropped item | storyboard words | status | nearest v4 | note |
|---|---|---|---|---|---|---|
| L1 | S2 | Arcs of the retinues’ roads converging on the city; the samurai half of the population as a band on the plan | 24 | dropped | b1-1 (road drawn faint, no processions; the census beat gives "nearly equal numbers" in words) |  |
| L1 | S4 | The 1677 map laid over the 1859 map, a transparency scrub | 20 | dropped | map-edo-1859 alone | No 1677 map was fetched in any version. |
| L1 | S5 | The census of 1721 against London and Beijing as bars from sourced figures | 23 | partly dropped | b1-4r ("among the largest cities anywhere"; no bars, no comparison figures) |  |
| L1 | S6 | Who lived where: chōnin block against a daimyō mansion of equal footprint; commoner wards about a fifth of the ground | 32 | dropped | — | No source id in sources.yaml for the Edo-Tokyo Museum comparison. |
| L1 | S7 | Nihonbashi: the fish market; Kodenma-chō; the bridge where the five highways began | 16 | partly dropped | b2-1 (Tōri Abura-chō), b3-6 and b9-1 (Bakuro-chō); nihonbashi pinned as Tōkaidō station 0 |  |
| L1 | prediction | Where did the print publishers cluster? (one tap on the map) | 20 | dropped | b1-4 guess is the 1721 population slider instead |  |
| L1 | argued | A city of a million or 1.3 million: the city’s count against the modern estimate | 21 | dropped | b1-4r states 1.3 million flat |  |
| L2 | S1 | The British Museum’s 2021 find of 103 uncut hanshita-e drawings | 35 | partly dropped | b1-6 (the drawing pasted face down and destroyed; the find is not mentioned) |  |
| L2 | S4 | The baren, water-based pigment and rice paste, the printer’s sloped table | 20 | partly dropped | b4-3 ("about two hundred sheets a day"); print.json day: 200 |  |
| L2 | S5 | The materials: cherry, sumi, safflower pink that fades, dayflower blue, orpiment yellow | 33 | partly dropped | b1-6 (cherry), b9-1 (Echizen hōsho), compare lab (safflower in the AIC sky) |  |
| L2 | S7 | The carver as a seal from the 19th century: Hori Take, ten seals recorded | 44 | partly dropped | desks.json hotohoto card: "the carver, Hori Sennosuke, is named in the margin" |  |
| L2 | prediction | How many people made a print: one, four or ten? | 18 | dropped | b1-6 tells it |  |
| L2 | closing | Order the four stages by one drag; name the trade never named | 15 | partly kept | print lab lays blocks in order; b2-4 tap guess asks whose marks made them answerable |  |
| L3 | S1 | Black ink, hand colour, two colours by 1744: the palette growing as timeline bands, each with an open print | 22 | dropped | b1-5 (Buddhist images and book illustrations only) | benizuri-e 1744 appears nowhere in the unit. |
| L3 | S2 | The Met’s Harunobu with "Meiwa 2" on the neckband; AIC 1957.556 dated 1765 | 32 | partly dropped | b1-7 shows Met JP2438 without reading the date |  |
| L3 | S5 | The kyōka circles and surimono: privately commissioned, exempt from sumptuary rules, thick paper, embossing, metal powders; Met JP1252 | 19 | dropped | — |  |
| L3 | S6 | Tsutaya’s 1788 advertisement inviting poets; Utamaro’s insect, shell and bird books | 24 | dropped | — |  |
| L3 | prediction | Who paid for the earliest full-colour prints? | 12 | dropped | b1-7 tells it |  |
| L3 | argued | "First" against "earliest known": what "perfected" means | 13 | dropped as a station | the editorial rule is applied throughout |  |
| L4 | S3 | The stable: Bakin apprenticed in the shop, Ikku | 10 | partly dropped | b2-5 (Kyōden), b2-6 (Utamaro, Sharaku); Bakin and Ikku are absent |  |
| L4 | S4 | The seal shown on AIC 1925.3030 (Utamaro, Takashima Ohisa, publisher Matsumura Yahei) | 32 | replaced | b2-4 uses Cleveland 1940.1031 (Tsutaya’s ivy and kiwame) |  |
| L4 | prediction | What did the state punish Tsutaya for: a print, a book or a party? | 18 | dropped | b2-5 tells it |  |
| L4 | argued | Sharaku’s identity: the readings, and why it matters less than his publisher | 12 | dropped as a station | b2-6 "Nobody knows who Sharaku was"; the card lists the theories |  |
| L5 | S6 | The splinter in the foam that no facsimile has; the break behind the right-hand boat; Fuji’s summit | 33 | partly dropped | compare lab spots: sky, horizon grey, boats, title cartouche, collector’s seal |  |
| L5 | S8 | The Shower below the Summit (AIC 1925.3244); the ten extra views with black outlines | 20 | partly dropped | b3-6 (Red Fuji only; "Thirty-six became forty-six") |  |
| L5 | argued | Smith’s "articulated an Edo world-view" against Guth’s Meiji policy and foreign buyers | 31 | replaced | b3-4 argues when the blue reached the printers (c. 1790 vs late 1820s) instead |  |
| L5 | closing | "Which impression is earlier?" | 9 | dropped on purpose | compare lab: "Nothing on the sheets says which was printed first" |  |
| L6 | S4 | Landscape, warriors, sumō; Osaka’s actor prints stop almost entirely until 1847 | 32 | partly dropped | b5-7 (the 1847 count); Osaka’s stop and sumō are absent |  |
| L6 | S6 | The Taira ghosts triptych (Met JP1115) | 26 | partly dropped | b5-6 (loyal retainers), b5-8 (the cat) |  |
| L6 | prediction | What happened to sales after the ban: down, flat or up? | 11 | dropped | b5-7 argued station |  |
| L7 | S1 | Dejima’s trade reversed: copper, porcelain, lacquer before 1854; Cleveland’s Arita jugs in Dutch silver | 17 | dropped | — |  |
| L7 | S2 | Eidelberg’s doubts about the Bracquemond story | 15 | replaced | b7-2 cites the Ōta Memorial Museum note (Hinohara 2021) instead |  |
| L7 | S5 | Monet’s bridge at Giverny, 1895–99 (NGA); Whistler’s tearoom | 9 | dropped | — | Giverny is not in places.yaml. |
| L7 | S6 | The Buckingham prints (1911, 1925); Bigelow’s 30,000; the Noyes gift 1905 | 16 | partly dropped | b8-3 (Kate Buckingham 1915 in the Plum Garden’s provenance) |  |
| L7 | S7 | Shin-hanga and sōsaku-hanga | 16 | dropped | — |  |
| L7 | prediction | Who sold more Japanese prints to the West: Japanese dealers or French ones? | 13 | replaced | b8-1g bet: who curated Tokyo’s 1898 show |  |
| L7 | argued | The 2015 Boston kimono protests on both sides; whether manga descends from the Manga (Exner) | 25 | partly dropped | b7-6 keeps exchange vs appropriation; b3-2 names the manga question in one sentence |  |
| L8 | S1–S6 | The other makings of Edo: komon, Nishijin and Lyon 1872, Kajikawa lacquer and Zeshin, netsuke and the 1781 book, Arita and the 1659 VOC order, Kiyomaro’s sword scheme and the 1608 proportion scrolls | 147 | dropped entirely | — | Six minutes, about 960–1,080 narration words at full volume. None of its objects (Met 2001.428.40, 55.175.16; Cleveland 1916.860, 1916.848, 1947.652, 1918.787, 1970.46) is in images.json. |
| L8 | prediction | Which trade had a written rulebook in 1608? | 8 | dropped | — |  |

v4 content with no v0 counterpart: Osaka and Shioya’s monopoly (b2-7); uki-e and Masanobu (b1-5u, ukie lab); Katsushika Ōi (b4-6); the Hokusai 1834 postscript as evidence (b4-5); Perry’s route as a guess (b6-0g); the Hundred Views as depth planes (view lab); the Seal Timeline; the French mail steamers and Pacific Mail (b7-1, b8-1); the Havemeyer bequest 1929 (b9-1); the 1872 Yoshiwara decree (b6-6).

## 7. What moves

For each journey and each group, the one sentence the animation would have to make visible.

### Journeys

- **blue** · A pigment made in Berlin reaches Edo only by sea; from 1824 Chinese junks undercut the Dutch and the price falls.
- **china-junks** · From 1824 the junks’ short crossing brings the blue in rising quantities, and the Nagasaki price falls from 87 to 31 monme.
- **voc** · Dutch ships sail Amsterdam, the Cape, Batavia, Nagasaki: the one road for foreign goods into a closed country.
- **engravings** · European perspective reaches Edo’s designers through Dejima or China; by 1748 a whole theatre runs to one vanishing point.
- **tokaido** · The lords’ road draws itself west, station by station, and Hiroshige’s sheets appear where the road stops.
- **sankin** · From 1635 every lord’s procession comes to Edo in alternate years; the roads fill and the city becomes an audience.
- **paper** · One sheet: Echizen paper comes to Edo, is printed for Eijudō, and reaches New York by a road nobody recorded.
- **yoshiwara-move** · After the fire the quarter moves from near Nihonbashi to the rice fields north of Asakusa, behind a moat.
- **fire-1657** · Three fires start in three districts over two days; between them six and seven tenths of the city burn.
- **tsutaya-move** · Tsutaya’s shop moves from the quarter’s gate into the city, to Tōri Abura-chō, the street of the big houses.
- **theatres-move** · Three theatres leave the city centre for one street beside the Yoshiwara; the state puts its licensed pleasures together.
- **perry** · Perry goes east, not west: Madeira, the Cape, Ceylon, Singapore, China, eight months to Uraga.
- **exhibition-1867** · The state that censored the prints ships them to Paris as its official exhibit, in its last year of rule.
- **mm** · After Suez opens, French steamers run Marseille to Yokohama from 1870, so crates of prints have a regular road to Paris.
- **hayashi** · Over eleven years, 218 shipments leave Yokohama for Hayashi’s Paris shop; the counter climbs as the arcs repeat.
- **vangogh-copies** · Two Hiroshige sheets and an Eisen courtesan leave Edo for Paris; in autumn 1887 they come back as oil.
- **pm** · From 1867 Pacific Mail crosses to San Francisco; from 1869 the railroad carries the prints on to Chicago and Boston.
- **tokuno** · A printing set goes from Tokyo to Washington in 1889, and its records name the carver and the printers.
- **fenollosa** · An American goes to Tokyo in 1878, returns to Boston in 1890, and curates Tokyo’s earliest known ukiyo-e show in 1898.
- **wright** · Wright goes to Japan in 1905 and comes back a dealer; his prints travel to Chicago and Boston.

### Groups

- **censor-regimes** · Four regimes, four seals: none, then kiwame, then headmen’s names, then aratame with a date; a margin dates a sheet.
- **fuji-series** · A fan’s fad in 1829 becomes a series in 1831; thirty-six views become forty-six.
- **blue-price** · At Nagasaki the blue falls from 87 to 31 monme a kin between 1824 and 1828; a luxury becomes a print colour.
- **price-sequence** · A sheet costs a bowl of noodles; in 1842 the state cuts it by a third; by 1865 it climbs back.
- **print-runs** · Three bubbles grow: 8,000 Waves, 15,000 Tōkaidō sheets, 408,000 loyal retainers; only the last is a record.
- **kansei-punishments** · After the seal come the examples: Kyōden manacled 1791, women’s bust portraits banned 1800, Utamaro manacled 1804.
- **ban-effects** · The ban in 1842; by 1847 six or seven tenths of sales are nameless actors; the magistrate lets them pass.
- **hundred-views** · 118 views, 1856–58, each dot a place you could walk to, coloured by season, finished as Hiroshige dies.
- **afterlife** · From 1867 the cheap sheets become art abroad, dealers write the history, and in 2024 the state prints one as money.
- **wave-census** · Museums count survivors sheet by sheet: 111 Great Waves located by 2020, 113 by 2024; no blocks survive.
- **wright-arc** · A dealer’s twenty years: a show in 1906, a 125,000-dollar deal in 1913, revamped prints in 1920, prints at a dollar in 1928.
- **six-eras** · Six eras, each turned by a datable event: a city, colour, a censor, blue, a ban, an afterlife.
- **five-acts** · Five publishers’ bets in turn: glamour, a pigment, warriors and views, export, money.
- **nengo** · Forty-one era names run under the timeline, so a date seal’s zodiac year can be read against the Western year.
- **meireki-outbreaks** · Three fires start in three districts over two days; between them six and seven tenths of the city burn.
- **tsutaya-life** · A publisher born in the quarter moves into the city, is fined half he owns, and answers with luxury.

## 8. Report

### 8a. Inconsistencies between timeline.yaml / story.yaml and the full case

| item | timeline / story | full case | note |
|---|---|---|---|
| Tsutaya’s age at death | aged 47 (story b2-8, people.yaml) | dead at 48 (cast table; L4 S8); objects_events.md row 27 "aged 48" | Born 13 February 1750 (people.yaml); died 1797. |
| Theatres moved to Saruwaka-chō (e1842t) | 1842 | 1841–43 (spine, anchor table); NDL source title "the 1841–42 relocation"; I4 "moves the year to 1841" |  |
| Thirty-six Views of Mount Fuji (e1831) | 1831 (the New Year advertisement; "around 1831") | c. 1830–32 (spine, anchor table); cast table c. 1830–33; images.json ca. 1830–32 |  |
| The Tokunō gift’s proofs | "over a hundred progressive proofs" (b8-5; people.yaml tokuno) | "23 progressive proofs" (§4), "the Smithsonian’s 23-stage proof set" (L2 S3, I2) | objects_events.md: the NMAH Rustic Genji sheet has 23 impressions from 13 surfaces on 7 blocks; both figures may be true at different scopes. |
| Kuniyoshi’s birth | born 1798 (people.yaml, "1 January 1798") | 1797–1861 (cast table) |  |
| Matsudaira Sadanobu’s birth | born 1759 (people.yaml, "15 January 1759") | 1758–1829 (cast table) |  |
| Prussian blue’s invention | "around 1704" (b3-3); guess says "Berlin, around 1704" | 1704–06 (L5 S1); atlas canon MAT054 "Berlin c.1706" |  |
| The 1800 ban and the 1804 manacling | stated flat (b2-5, b2-8) | both marked probable in the anchor table |  |
| Moronobu 1672 (e1672) | stated flat (b1-5) | probable |  |
| Sharaku’s count | "about 140 designs" (b2-6); "about 144" (people.yaml highlights) | "140-odd" |  |
| The Perry squadron at Uraga | 8 July 1853, four ships (b6-1) | 1853–54 (spine); consistent |  |
| The kiwame seal’s reading print | Cleveland 1940.1031, publisher Tsutaya | AIC 1925.3030, publisher Matsumura Yahei | A different object, not a different fact. |
| The AIC Great Wave | AIC 1952.343 via Commons | AIC 1925.3245 |  |
| Six eras vs five acts | Acts II–III leave 1836–1840 uncovered; Acts IV–V leave 1929–2019; Acts III–IV overlap 1865–68 | six contiguous eras 1603–2024 |  |
| The 1829 fan | eisen-aizuri (an early-1830s sheet, "undated on Commons") stands for it | the fan is in the Brooklyn Museum, "censor-sealed 1829" |  |
| 1872 | e1872 the Yoshiwara debts cancelled (probable) | objects_events.md row 53 reads the brief’s 1872 as the earliest railway; no Yoshiwara decree in the case |  |

### 8b. Things in the story with no place

| what | why |
|---|---|
| Nagoya (the Hokusai Manga, e1814, b3-2; Eirakuya) | not in places.yaml |
| Ginza (Kyōden’s tobacco shop, people.yaml) | not in places.yaml |
| Genyadana (Kuniyoshi’s death, people.yaml) | not in places.yaml |
| Shirakawa (Sadanobu’s domain), Karatsu (Tadakuni’s), Kawagoe (one of Utamaro’s given birthplaces) | not in places.yaml; Hamamatsu is Tōkaidō n 29 |
| Salem, Massachusetts and Mii-dera (Fenollosa) | not in places.yaml |
| Giverny, Lyon, Arita, Nishijin (lectures 7 and 8) | not in places.yaml (Arita and Nishijin have Wikidata coordinates in objects_events.md) |
| Delâtre’s print shop (b7-2) | placed at paris only |
| Hanaōgi’s escape (x1794-hanaogi) and Danjūrō VII’s exile (x1842-danjuro) | no destination in the sources |
| The sheet’s Pacific crossing (journey paper, edo → newyork) | "not recorded" (b9-1) |
| Nagasaki → Edo for the blue (journey blue) | not drawn; no route in places.yaml |
| The retinues of the lords (journey sankin) | domains unnamed; road drawn faint only |
| Perry’s intermediate ports | only inside routes.perry (Madeira, St Helena, Mauritius, Naha, Bonin Islands, Shanghai have no world id) |
| Time-mode and object-mode beats | 47 of 71 beats are not map beats (object 19, time 23, tool 5; map 24); their place is implied by the object or event |

### 8c. Things with no year, or a placeholder year

| what | items |
|---|---|
| Beat years used as stage placeholders | b1-3 1660 (the move after 1657); b1-4 1700 (the theatres); b1-6 1700 (a 19th-century key block); b2-2 1797 (an 1802 drawing); b2-3 1790 ("around 1800"); b4-6 1845 (Ōi, "approximate"); b5-8 1850 ("ca."); b8-1 1880 (1867 and 1869 events); b8-1g 1897; b9-1g 2010 |
| Undated objects | keyblock ("19th century"); eisen-aizuri ("undated on Commons"); oi-night ("before 1860"); portrait-ieyasu ("17th century"); portrait-hokusai ("before 1848"); portrait-tadakuni ("Tenpō era") |
| Undated people | iseya, hoeido, uoya, eirakuya, shioya, ryukosai, egawa, kido, yamamoto, nakamura, morikawa, murata, tokuno, hanaogi, toho, fujiokaya (no born/died); nishimuraya ~1751–~1860 (the firm); sharaku 1794–1795 (working months only); oi ~1800–~1857 |
| Undated legs | berlin → amsterdam; amsterdam → cape → batavia → nagasaki (recurring); nagasaki → edo; echizen → edo; edo → newyork; the Tōkaidō station legs (the road, not a journey) |
| Argued dates | when Prussian blue reached Edo’s printers (c. 1790 or late 1820s, b3-4); the 1856 Bracquemond find (x1856-bracquemond) |

### 8d. Sources read

- build/units/edo/content/timeline.yaml
- places.yaml
- story.yaml
- people.yaml
- images.json (no images.yaml exists)
- sources.yaml
- peel.json
- sprites.json
- research/edo-2026-10-04/EDO_FULL_CASE.md
- research/edo-2026-10-04/objects_events.md (§2 events, §3 places, §4 numbers)
- build/atlas-hub/README.md, public/data/atlas.json (edo block, routes), nodes.json (edo-* and canon ids)
- build/units/edo/src/labs/*.js, src/map.js (routes, moves), public/data/desks.json, print.json, views.json
- build/units/edo/README.md, ARCH_V4.md; build/prototypes/edo-ux/README.md (v1), edo-story/README.md (v2); research/edo-redesign-2026-10-04/critique_current_prototype.md

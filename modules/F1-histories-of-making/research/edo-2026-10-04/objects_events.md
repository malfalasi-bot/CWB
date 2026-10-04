# Edo Japan and ukiyo-e: the objects, the events and the places

Research report for F1 "Histories of making" · case: Edo Japan (1603–1868) and ukiyo-e as a creative industry · 4 October 2026.

Method note. Every object below was read through its holder's own record, by API where one exists: the Met (`collectionapi.metmuseum.org/public/collection/v1/objects/<id>`, field `isPublicDomain`), the Art Institute of Chicago (`api.artic.edu/api/v1/artworks/<id>`, field `is_public_domain`; images are assembled from `config.iiif_url` + `image_id` + `/full/843,/0/default.jpg`, the pattern the AIC's own API documentation prescribes), Cleveland (`openaccess-api.clevelandart.org/api/artworks/?q=`, field `share_license_status`), the Library of Congress item pages, the National Gallery of Art, Paris Musées, the Smithsonian's NMAH records, Wikidata (`wbgetclaims`, property P625) and the Rijksmuseum. Two cautions surfaced that the designer must respect: (1) the Met's search endpoint returned HTTP 410 for roughly half of our queries today, so Met objects were located through the museum's web pages and then confirmed one by one through the object endpoint; (2) several objects that "everyone knows" are open turned out not to be, as their records state (see rows marked LINK-OUT). Confidence words: *documented* (read on the holder's or a primary page), *probable* (read on a secondary page such as Wikipedia or a dealer essay), *contested* (two readings given).

---

## 1. The open object set (52 objects)

Column key: Holder · accession number · object id in holder's API · title · maker (by role) · date · medium · licence as the record states it · image URL from the record · why it earns its place.

### 1a. Hokusai 葛飾北斎 (designer, 1760–1849)

1. **Met · JP1847 · 45434** · *Under the Wave off Kanagawa (Kanagawa oki nami ura)*, Thirty-six Views of Mount Fuji · designer Katsushika Hokusai; publisher Nishimuraya Yohachi (Eijudō), named in the AIC record and the Met essay; carvers and printers unnamed · ca. 1830–32 · woodblock print, ink and colour on paper, 25.7 × 37.9 cm · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/DP130155.jpg · H. O. Havemeyer Bequest 1929. State: the Met's own essay calls it "probably one of the earliest impressions"; the Met's scientific papers (Vermeulen et al. 2020) put the two finest Met impressions in their earliest cluster (cluster 6) on the indigo/Prussian-blue outline signature. Use this as the hero impression.
2. **Met · JP10 · 36491** · same design · ca. 1830–32 · 24.4 × 35.7 cm · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/DP141063.jpg · Rogers Fund 1914. A second Met impression, useful for a side-by-side "one design, many originals" exercise; the Met holds four impressions in all (JP10, JP1847, JP2569, JP2972 are named in the Vermeulen papers).
3. **AIC · 1925.3245 · 24645** · same design · 1830/33 · colour woodblock print, ōban, 25.4 × 37.6 cm · `is_public_domain: true` · image_id `b3974542-b9b4-7568-fc4b-966738f61d78` → https://www.artic.edu/iiif/2/b3974542-b9b4-7568-fc4b-966738f61d78/full/843,/0/default.jpg · Clarence Buckingham Collection. The record states the state plainly: the AIC's three impressions "are all later impressions than the first state." Inscriptions: signature *Hokusai aratame Iitsu fude*; publisher Nishimura-ya Yohachi. Provenance: Yamanaka & Co., New York, to Clarence Buckingham, December 1905. The two other AIC impressions are 1952.343 (id 77333) and 1928.1086 (id 89503), both public domain. Earns its place as the honest "later state" against the Met's early one.
4. **Met · JP9 · 36490** · *South Wind, Clear Sky (Gaifū kaisei)*, "Red Fuji" · Hokusai · ca. 1830–32 · 24.4 × 35.6 cm · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/DP141062.jpg. Korenberg's census found 93 surviving impressions and five sequential states, the earliest being the muted "Pink Fuji" printings (documented, Korenberg 2021).
5. **AIC · 1925.3244 · 87008** · *Shower Below the Summit (Sanka hakuu)* · Hokusai · c. 1830/33 · `is_public_domain: true` · image_id `bbb6d024-f931-2e2f-eb95-750991834b1c`. The Met's black-outline impressions of this design (JP11, JP2567, JP2961) are the paper's example of a later re-edition; pairs with Red Fuji as the series' "three famous Fujis".
6. **AIC · 2007.628 · 192276** · *Hokusai manga (Sketches of Hokusai)*, vols 1–3, 5–11 and 14 of 15 · Hokusai · 1812/78 · woodblock-printed books, 22.5 × 15.5 cm closed · `is_public_domain: true` · image_id `58962d76-c34a-5ebe-c798-f18f0846298d` · Gift of Joan R. Whittaker. The Met Bulletin (1985) dates volume 1 to 1814 and the fifteenth to 1878, twenty-nine years after the artist's death. The AIC set is the only API-flagged open set of the Manga we found.
7. **Met · 2013.732a–c · 78803** · *One Hundred Views of Mount Fuji (Fugaku hyakkei)* 富嶽百景 · Hokusai · ca. 1849 edition · set of three woodblock-printed books, ink on paper · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/DP327233.jpg. The ehon in which Hokusai's famous postscript on working to age 110 appears (probable; the postscript text was not read on an opened page).
8. **AIC · 1943.602 · 47398** · *Kohada Koheiji*, One Hundred Ghost Tales (Hyaku monogatari) · Hokusai · 1831–32 · `is_public_domain: true` · image_id `792d6c6e-1782-dc76-f75a-35e8d1a60357`. The ghost series: proof that the landscape master was also a horror designer.
9. **AIC · 1962.1002 · 15817** · *Ichikawa Danjūrō VI* · Hokusai, signed Shunrō · c. 1792/93 · `is_public_domain: true` · image_id `f6c62014-cc92-2d00-617d-e504172d1c74`. Hokusai's early actor-print career under his Katsukawa-school name; the Sumida Hokusai Museum notes Tsutaya published his early Shunrō work.

### 1b. Hiroshige 歌川広重 (designer, 1797–1858)

10. **Met · JP471 · 36922** · *Stations One: Morning View of Nihonbashi* (Hōeidō Tōkaidō) · Hiroshige; publisher Hōeidō (Takenouchi Magohachi) — publisher named in the series' conventional title, not in the Met field · ca. 1833–34 · 24.1 × 35.2 cm · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/DP122174.jpg. The start of the road.
11. **AIC · 1939.1362 · 33884** · *Hakone: View of the Lake (Hakone, kosui no zu)*, Hōeidō Tōkaidō · c. 1833/34 · `is_public_domain: true` · image_id `a35f8799-5d4c-2ec3-5cc1-ee059d41f3f0`. The mountain barrier station.
12. **AIC · 1925.3517 · 25613** · *Kanbara: Evening Snow (Kanbara, yoru no yuki)* · c. 1833/34 · `is_public_domain: true` · image_id `c287562e-816e-096c-022a-b05199ba4b8f`. The best-known sheet of the series; snow in a town that rarely sees it.
13. **AIC · 1932.170 · 10926** · *Mishima: Morning Mist* · c. 1833/34 · `is_public_domain: true` · image_id `c047003a-949c-a581-7c5a-2c415e8cac75`. Shows bokashi gradation and the "mist" blocks.
14. **AIC · 1925.3752 · 26577** · *Plum Garden at Kameido (Kameido Umeyashiki)*, One Hundred Famous Views of Edo · 1857 · ōban 36 × 24.4 cm · `is_public_domain: true` · image_id `89a2332f-be15-8e05-bc79-778738fdc1ef`. Provenance in the record: **Frank Lloyd Wright**, sold to Kate Sturges Buckingham, February 1915 — the Japonisme afterlife written into the object's own file. The record also states that Van Gogh copied it in 1887.
15. **Met · JP2522 · 55433** · *Sudden Shower over Shin-Ōhashi Bridge and Atake (Ōhashi Atake no yūdachi)* · 1857 · ōban 34 × 24.1 cm · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/DP130156.jpg · Howard Mansfield Collection 1936. The second Hiroshige that Van Gogh copied (Bridge in the Rain); shows the series' date and *aratame* seals in the margin (seal reading not confirmed on the Met page; documented for the series generally).
16. **Met · JP526 · 36977** · *Sunshower at Nihonbashi* · 1833–34 · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/DP123275.jpg. Nihonbashi again, a different publisher's road series — good for a "same place, different product" comparison.
17. **AIC · 1925.3318 · 24920** · *Memorial portrait of Utagawa Hiroshige* · designer Utagawa Kunisada (Toyokuni III); text by Tenmei Rōjin · 1858 · `is_public_domain: true` · image_id `b7911ddd-36fc-9629-8973-de236aa2b234`. The record transcribes the inscription "While thinking of him we shed tears." A dated death notice for the industry's last landscape star.

### 1c. The eighteenth-century golden age

18. **AIC · 1957.556 · 6805** · *A Young Woman in a Summer Shower* · Suzuki Harunobu 鈴木春信 · 1765 · colour woodblock print, chūban, **surimono** (privately commissioned) · `is_public_domain: true` · image_id `36063859-9cc2-3787-b528-e6c9361b70b6`. One of the AIC's dated-1765 Harunobu sheets, the year the Met essay gives for the "first polychrome prints … calendars made on commission for a group of wealthy patrons." Companion 1765 sheets: *The Love Letter* (1932.205, id 11029), *Giving Daruma a Smoke* (1925.2030, id 20016), *A Folding Fan — A Clear Day* from Eight Parlor Views (1928.896, id 88953), all public domain. Note: the AIC records do not themselves use the word "calendar" (e-goyomi); the calendar reading is the Met essay's and Wikipedia's (probable).
19. **Cleveland · 1930.197 · 111664** · *Entertainment on a Balcony by the Water at Nakasu*, A Collection of Beautiful Modern Women of the Pleasure Quarters · Torii Kiyonaga 鳥居清長 · 1783 · diptych of colour woodblock prints · `share_license_status: CC0` · https://openaccess-cdn.clevelandart.org/1930.197/1930.197_web.jpg. Kiyonaga's tall, multi-sheet format at its height; Nakasu was an unlicensed pleasure district later demolished. Also CC0: *Women Watching a Girl Dance on Shells*, 1784 (1985.330, id 152510).
20. **AIC · 1925.3030 · 23868** · *Takashima Ohisa* · Kitagawa Utamaro 喜多川歌麿; publisher Matsumura Yahei · c. 1795 · `is_public_domain: true` · image_id `d3840ed2-3198-84e4-9086-8be16631a452`. **The censor-sealed print**: the record's inscriptions field reads "Publisher seal: MATSUMURA YAHEI / Censor's seal: KIWAME" — the round *kiwame* ("approved") seal required from 1790. Ohisa was a real teahouse waitress, one of the "three beauties".
21. **AIC · 1958.165 · 7624** · *Komurasaki of the Miuraya and Shirai Gompachi* · Utamaro · c. 1800 · `is_public_domain: true` · image_id `66c4dafb-2f53-f5ac-b676-32cafbe5b6bd`. A Yoshiwara courtesan named with her house; the content note on sex work applies.
22. **Met · 2013.768 · 78670** · *A New Record Comparing the Handwriting of the Courtesans of the Yoshiwara (Yoshiwara keisei shin bijin jihitsu kagami)* 吉原傾城新美人自筆鏡 · Kitao Masanobu (the writer Santō Kyōden 山東京伝 under his artist name) · 1784, early spring (Tenmei 4) · woodblock-printed book, 38 × 26 cm · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/DP319944_dup.jpg. Published by Tsutaya Jūzaburō in the year after he moved to Nihonbashi (probable: the Tsutaya attribution is standard but not in the Met field). The Met Libraries' copy (JIB91) is separately marked "public domain. No restrictions on use."
23. **AIC · 1934.207 · 18765** · *The actor Ōtani Oniji III as Edobei* · Tōshūsai Sharaku 東洲斎写楽 · 1794 · ōban 37.9 × 25 cm · `is_public_domain: true` · image_id `df22cedf-8d22-a116-fc52-bc21ac0b3ab0` · Clarence Buckingham Collection. The best-known of the ten months of Sharaku. The Met also holds this design as JP2822 (cited in the Met essay).
24. **AIC · 1934.239 · 18897** · *The actors Ichikawa Omezō I as Tomita Hyōtarō and Ōtani Oniji III as Kawashima Jibugorō* · Sharaku; **publisher Tsutaya Jūzaburō (1748–1797)** named in the AIC artist field · 1794 · `is_public_domain: true` · image_id `486fbf4b-b972-7d71-ebfa-ef7800d4b20f`. Earns its place because the publisher is written into the record — the industry's producer named beside the designer.
25. **Met · 2013.851 · 78741** · *Picture Book with Synopses of Plays (Ehon banzuke) for Performances at the Nakamura Theater in 1794* 絵本番付 · unidentified Torii-school artist · dated 1799 in the record · woodblock-printed book, hand-coloured (tanroku-bon) · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/2013_851_03_crd.jpg. **The playbill**: an illustrated programme of the kind sold at the theatre. The MFA Boston holds the single-sheet street playbills (tsuji banzuke, e.g. 11.28070, Kawarazaki Theatre, 7th month 1854; 11.27175 by Torii Kiyomitsu, 1772) but MFA images are not open — LINK-OUT only.

### 1d. The Utagawa century: Kuniyoshi, Kunisada

26. **Met · JP1563 · 45282** · *Scene from a Ghost Story: The Okazaki Cat Demon* · Utagawa Kuniyoshi 歌川国芳 · ca. 1850 · diptych, each 36.5 × 25.4 cm · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/DP146821.jpg · Fletcher Fund 1929. **The cat print**: the monster cat of Okazaki from the Tōkaidō ghost-play, by the artist the Met describes as "a cat lover." (The famous *Cats as the Fifty-three Stations* triptych of 1849 is cited in a Met label but no open impression of it surfaced in the four open APIs today; the Met's Paul Binnie print 2018.8.1 that quotes it is © the artist — LINK-OUT.)
27. **Met · JP1115.2a–c · 893318** · *Ghosts of the Taira at Daimotsu Bay* · Kuniyoshi · 1849–52 · triptych of nishiki-e · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/DP149159.jpg. **The warrior triptych**: Minamoto warriors beset by Taira ghosts — the post-1842 "history" genre that replaced banned actor prints.
28. **AIC · 1975.477 · 49141** · *The Young Yoshitsune defeats Benkei at Gojō Bridge* · Kuniyoshi · c. 1848 · `is_public_domain: true` · image_id `c4db3a2b-3724-704a-8d55-35de0ddca050`. A single-sheet warrior print (musha-e). The Suikoden series of 1827–30 that made his name (probable date, Wikipedia and dealers) did not surface as an open impression in the four APIs; the Tokyo Museum Collection record 08200008 (Edo-Tokyo Museum) is a LINK-OUT.
29. **Met · JP1252 · 54384** · *Water Scene* · Kuniyoshi · 1840 · woodblock print, **surimono**, 20.2 × 18.1 cm · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/DP143984.jpg. The Met text explains the parody: a beauty standing in for a Suikoden strongman, with "Western perspective and stylized scenery." The deluxe private-commission format in the hands of a warrior-print artist.
30. **Cleveland · 1930.202 · 111672** · *New Yoshiwara (Shin Yoshiwara)*, Famous Places in the Eastern Capital · Kuniyoshi · early 1830s · `CC0` · https://openaccess-cdn.clevelandart.org/1930.202/1930.202_web.jpg. The licensed quarter as a "famous place" in a landscape series — the place itself, not its workers (content note still applies).
31. **AIC · 2004.241-243 · 182348** · *Bandō Mitsugorō III as Minamoto no Yorimasa, Segawa Kikunojō V as Ayame no Mae, and Ichikawa Danjūrō VII as I no Hayata* · Utagawa Kunisada 歌川国貞 (Toyokuni III) · c. 1820 · triptych · `is_public_domain: true` · image_id `dd73fe42-fa51-eea8-3e50-820f638fe89e`. **The Kunisada actor print**, with Danjūrō VII, the star exiled from Edo in 1842 (Fiorillo). Also open: *Viewing Maple Trees*, 1835 (1925.3320, id 24927) and *Oiwa's Ghost*, 1860s (1990.607.185, id 196864).

### 1e. The process: proofs, blocks, tools

32. **Met · 2007.49.284 · 73639** · *Proof Line-Block Print for Fan* · Utagawa (Gountei) Sadahide 歌川貞秀 · 19th century · proof line-block (key-block) print for a fan, ink on paper, 30.5 × 24.1 cm · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/DP148137.jpg · Bequest of William S. Lieberman 2005. **The key-block proof** (kyōgō-zuri): the black-line pull from which colour blocks were cut. Sibling proofs 2007.49.287 (id 73642) and others in the same bequest.
33. **Smithsonian NMAH (Tokuno Gift) · GA.03213.05 · nmah_793553** · *A Rustic Genji (Inaka Genji)*, 5th progressive proof "adding yellow to the kimonos" · maker Morikawa Kokichirō (recorded as maker); given by Tokunō Michimasa 得能通昌, head of the Insatsukyoku · 1889–90 gift · woodblock print · metadata CC0; the image carries "Usage Conditions Apply" on si.edu — **LINK-OUT for the image, data free**. **The complete process set**: the right-hand sheet of the triptych needed "23 separate impressions … from 13 printing surfaces on seven blocks"; the centre 25 impressions from 10 surfaces on 6 blocks; the left 24 from 14 surfaces on 8 blocks. The proofs survive as GA.03213.01–.23 with the blocks GA.03212.01–.07 (the key block is .01; block .02 is nmah_819332) and the full tool kit. This is the one holder with blocks, proofs and tools from a single job; the Met and AIC have no comparable set in their open APIs (checked by search today).
34. **NMAH · GA.03211.10 · nmah_1411975** · *baren* · Japanese printer's tool, several registered under one number, one dismantled into its four parts · Gift of T. Tokuno 1889–90 · 12 cm · metadata CC0; image "Usage Conditions Apply" — LINK-OUT for image. The record describes the paper-disc core, cotton cover, twisted-cord disc and bamboo sheath. With it: brushes GA.03211.05, printer's table, pigment bottles GA.3211.16, and the block-cutter's 25 tools GA.03210.01–.25 drawn in Tokunō's watercolours. S. R. Koehler edited Tokunō's account for the Smithsonian Annual Report for 1892.
35. **NMAH · GA.03212.02 · nmah_819332** · carved colour block for the same right-hand sheet, cut on both faces (recto printed the face blush, .02; verso the browns and greens of the trees, .04 and .14) · same gift and licence. **The woodblock itself**, and evidence that blocks were double-sided.

### 1f. Books and paper

36. **Met · 2013.763a, b · 78665** · *Tale of Eight Dogs (Hakkenden)* 八犬伝 · Kuniyoshi (illustrator) · 1853 (Kaei 6) · set of two woodblock-printed books, 18 × 12 cm · marked Public Domain on the Met page (not API-confirmed today). A gōkan: the illustrated fiction that the 1842 edict also policed.
37. **Met Libraries · JIB91 · contentdm id 286** · the Watson/Asian Art copy of Kyōden's Yoshiwara book (see 22) · "Copyright Status: public domain. Material is in the public domain. No restrictions on use." IIIF manifest given on the page. Shows that the Met's book digitisation runs under a separate, equally open statement.
38. **LoC Geography and Map Division · G7964.T7G46 1859 .T3 · lccn 77694812** · *Ansei kaisei Oedo ōezu* 安政改正御江戶大繪圖 · compiler Takai Ranzan (1762–1838); publishers Izumoji Manjirō and Okadaya Kashichi, Yokoyama-chō 1-chōme · Ansei 6 [1859], a reissue of a map first published Genroku 9 [1696] · hand-coloured woodblock print, 117 × 131 cm, folded in a pocketed cover · "free to use and reuse unless stated otherwise" · downloads on the item page (JPEG to 3964 × 3544; TIFF 643 MB). **The map of Edo**: cadastral, north to the right, and — the record notes — "includes distance chart and day by day listing of events in Edo for 1859." A map that doubles as an almanac.
39. **LoC · G7964.T7G46 1677 .H3 · lccn gm71005088** · *Edo ōezu, eiri* 江戶大繪圖・繪入 · Hayashi Yoshinaga, Kyōto · Empō 5 [1677] · hand-coloured woodblock, 122 × 137 cm · LoC "not aware of any U.S. copyright protection … or any other restrictions" · JPEG 4869 × 3600 on the item page. Twenty years after the Meireki fire: the rebuilt city. Also: *Edo ōezu* by Ochikochi Dōin, publisher Kyōjiya Kahē, 1676 (gm71005200), the "reduced ed. of official map compiled by Hōjō Awa no Kami", annotated with a note on the 1829 fire; and *Map of the Sea and Land Routes from Edo to Nagasaki*, Kyoto, Nishida Shōbē, 1672 (2021668278), Tōkaidō in volume 1.

### 1g. Cloth, lacquer, porcelain

40. **Met · 2001.428.40 · 61835** · *Robe (Kosode) with Cherry Blossoms and Butterflies* 紺平絹地桜蝶々小紋小袖 · dyer unnamed · late 18th–early 19th century · plain-weave silk, stencil-dyed (Edo komon) · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/LC-2001_428_40-001.jpg. **The Edo komon kimono**: the Met text explains that komon began as samurai formal wear in Edo, made with Ise paper stencils and indigo, and "in the later Edo period … was adopted more widely." Provenance: Maruike Fujii Co., Kyoto.
41. **Met · 55.175.16 · 53658** · *Stencil with Pattern of Filled Squares* (hemp-leaf) · stencil cutter unnamed · 19th century · paper · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/DP13752.jpg. **The katagami**. Note: the Met's komon stencil of cherry blossoms, 37.14.20 (id 53216), whose label explains that komon stencils "were first used in the decoration of leather for armor," returns `isPublicDomain: false` with no image — LINK-OUT.
42. **Cleveland · 1916.860 · 97228** · *Inrō (Case) with Squirrels in Grapevines* · lacquerer unnamed · 1700–1868 · lacquer on wood with sprinkled gold (maki-e) · `CC0` · https://openaccess-cdn.clevelandart.org/1916.860/1916.860_web.jpg. **The inrō.**
43. **Cleveland · 1916.848 · 97215** · *Inrō, Ojime, Netsuke* · Shibata Zeshin 柴田是真 (1807–1891), lacquerer · later 1800s · lacquer with sprinkled gold, silver and mother-of-pearl, coral, wood · `CC0` · https://openaccess-cdn.clevelandart.org/1916.848/1916.848_web.jpg. The complete sagemono ensemble by a named maker.
44. **Cleveland · 1947.652 · 125762** · *Dog with Shell* · netsuke carver unnamed · 1700s · ivory · `CC0` · https://openaccess-cdn.clevelandart.org/1947.652/1947.652_web.jpg. **The netsuke** (ivory: flag for any trade-sensitive display context).
45. **Cleveland · 1918.787 · 99213** · *Plate: Arita Ware* · potters unnamed · 1615–1868 · porcelain · `CC0` · https://openaccess-cdn.clevelandart.org/1918.787/1918.787_web.jpg. **The Arita plate.**
46. **Cleveland · 1970.46 · 145212** · *Pair of Jugs with Silver Mounts* · Hizen ware, Arita type, underglaze blue; silver mounts by Barent van Leeuwen (Dutch, 1637–1682), silversmith · c. 1662–76 · `CC0` · https://openaccess-cdn.clevelandart.org/1970.46/1970.46_web.jpg. **The VOC export object**: Arita porcelain mounted in the Netherlands within a generation of leaving Nagasaki.

### 1h. Nagasaki, Dejima and the opening

47. **Cleveland · 1960.193 · 136311** · *Arrival of the "Southern Barbarians"* · painters unnamed · c. 1600, Momoyama · pair of six-panel screens, ink, colour and gold · `CC0` · https://openaccess-cdn.clevelandart.org/1960.193/1960.193_web.jpg. The Nagasaki trade on the eve of Edo.
48. **Rijksmuseum · NG-1974-23** · *Kapitein: Hollander die naar het Oosten is gekomen* ("Portrait of a Hollander who has come to the East") · anonymous Nagasaki printer · c. 1700 · hand-coloured woodcut, 44 × 32 cm · Rijksmuseum record read; the museum's general open policy applies but the licence line was not shown on the page as fetched — confirm before display. **Nagasaki-e**: the record calls it "one of the earliest Japanese depictions of a Dutchman." Also at the Rijksmuseum: *Nagasaki Bay*, workshop of Kawahara Keiga, c. 1833–36 (NG-1190) and the Deshima trading-post scroll, c. 1810 (NG-1980-24).
49. **Met · 2007.49.236 · 73527** · *Dutch Ship (Orandasen)* · Utagawa Yoshitomi, signed Ichigeisai Yoshitomi ga · 2nd month 1861 · 35.6 × 24.1 cm · `isPublicDomain: true` · https://images.metmuseum.org/CRDImages/as/original/DP148089.jpg. **Yokohama-e**: the Dutch ship two years after Yokohama opened. Also: Hiroshige II, *Dutch and Chinese Ships in the Harbor at Nagasaki in Hizen Province*, 3rd month 1859 (2007.49.136, id 73422; Met page marks Public Domain, not API-confirmed today).

### 1i. The Japonisme afterlife

50. **Paris Musées / Petit Palais · LDUT1216(2)** · *Le Japon artistique. Documents d'art et d'industrie réunis par S. Bing*, tomes 3–4 (May 1889–April 1890) · Siegfried (Samuel) Bing, publication director; printed by Ch. Gillot (MAK record) · `CC0 Paris Musées` on the record · image via parismuseescollections.paris.fr/en/node/236015. Tomes 1–2 (LDUT1216(1), May 1888–April 1889) and 5–6 (LDUT1216(3), 1890–91) complete the run; 36 monthly issues in all (UW-Madison catalogue). Internet Archive copy b1383895 is "Public Domain Mark 1.0". The Van Gogh Museum holds issue no. 1 (p2823S2017). No Met record for the journal surfaced in search today.
51. **National Gallery of Art, Washington · 1992.9.1 · artworks/74796** · *The Japanese Footbridge* · Claude Monet · 1899 · oil on canvas, 81.3 × 101.6 cm · "This object's media is free and in the public domain" (NGA open access) · https://www.nga.gov/artworks/74796-japanese-footbridge. **Monet's bridge**: the NGA text says he added the Japanese-style bridge in 1895 and painted twelve views of it in 1899; bought from the artist by Durand-Ruel in January 1900. Cautionary finding: the Met's version, *Bridge over a Pond of Water Lilies* (29.100.113, id 437127), returns `isPublicDomain: false` and no image in today's API read — LINK-OUT, and a good classroom example that "famous" does not equal "open".
52. **AIC · 1900.52 · 56905** · *Nocturne: Blue and Gold — Southampton Water* · James McNeill Whistler · 1872 · oil on canvas · `is_public_domain: true` · image_id `50034c7f-ce51-00f1-430e-a6f7efc233fc`. **Whistler**: the Met essay records that he "discovered Japanese prints in a Chinese tearoom near London Bridge."

Flagged, not in the open set:
- **Van Gogh Museum · s0115V1962 (F371)** · *Flowering Plum Orchard (after Hiroshige)*, Paris, October–November 1887, oil, 55.6 × 46.8 cm. The museum's terms: images "can be downloaded for free for non-commercial use," full credit obliged ("Van Gogh Museum, Amsterdam (Vincent van Gogh Foundation)"); commercial use needs an application. Not CC0 — LINK-OUT, or source a PD-Art copy on Wikimedia Commons and state that tag. The museum also holds Hiroshige's print (n0077V1962) and Van Gogh's tracing of it (d0772V1962). The record's text: Van Gogh "replaced the black and grey of Hiroshige's tree trunk with red and blue tones."
- **Smithsonian images** of the Tokuno gift: CC0 metadata, "Usage Conditions Apply" on images — ask or link.
- **MFA Boston** banzuke, Spaulding prints; **Edo-Tokyo Museum** Suikoden; **British Museum** Great Waves (1906,1220,0.533) — all LINK-OUT.

---

## 2. The dated events (78 rows)

Format: year · event · source · confidence.

**Politics and the city**
1. 1603 · Tokugawa Ieyasu establishes the shogunate at Edo; Edo period begins · Tokyo Metropolitan Government (TMG) history timeline · documented.
2. 1615 · the Met dates its "Edo period" 1615–1868 from the fall of Osaka; 1603 is the TMG and Wikipedia start — both readings in use · Met essay; TMG · contested (two conventions, not a disagreement of fact).
3. 1617 · edicts already prohibit gold and silver leaf on courtesans' clothing · Fiorillo, Viewing Japanese Prints · probable.
4. 1629 · women banned from the kabuki stage · Met, Art of the Pleasure Quarters · documented.
5. 1635 · *sankin kōtai* alternate attendance made systematic by Iemitsu: lords reside in Edo in alternate years, families left in Edo · Britannica · documented.
6. late 1630s · "official prohibition of foreigners"; the Dutch housed on Dejima from 1641 · Met Edo essay; Rijksmuseum Dejima record · documented (the exact 1639 edict year was not read on an opened page).
7. 1649 · first comprehensive sumptuary list for Edo townspeople · Fiorillo · probable.
8. 1652 · boy actors banned in turn · Met essay · documented.
9. 1657, 18–20 January · Meireki ("long-sleeve") fire; c. 60 % of the city burnt; estimates 30,000–100,000 dead against a population of c. 300,000; the castle keep collapses; Honjo and Fukagawa developed and Ryōgoku Bridge built in the rebuilding · Edo-Tokyo Digital Museum; TMG urban-planning PDF · documented (death toll contested within the range).
10. 1661–73 · Kanbun era: hanging-scroll "Kanbun beauties"; individual portrayal of Yoshiwara courtesans begins · Met essay; Wikipedia · documented/probable.
11. 1672 · Hishikawa Moronobu signing his book illustrations; earliest known single-sheet ukiyo-e prints follow · Wikipedia · probable.
12. 1676–77 · first single-sheet printed maps of Edo on survey (Ochikochi Dōin's Kanbun five-sheet set reduced to one) · LoC records gm71005200 and gm71005088; Manchester Library note · documented.
13. 1681 · merchant Ishikawa Rokubei's household banished for dressing above station; 1683 flood of clothing edicts · Fiorillo · probable.
14. 1714 · Ejima–Ikushima scandal; Kaigetsudō Ando exiled · Wikipedia · probable.
15. 1716–45 · Kyōhō reforms under Yoshimune: TMG lists firefighting organisations 1718, first census 1721 (Edo c. 1.3 million), Koishikawa free hospital 1722 · TMG timeline · documented for the three items; the reform label is probable.
16. 1744 · benizuri-e: earliest known successes in two-colour block printing · Wikipedia · probable.
17. 1765 · nishiki-e: full-colour printing from many blocks, first as privately commissioned calendar prints exchanged at New Year · Met essay "Woodblock Prints in the Ukiyo-e Style" · documented.
18. 1770 · Harunobu dies · Wikipedia · probable.
19. 1783 · Tsutaya Jūzaburō moves his shop from the Yoshiwara approach to Tōriabura-chō, Nihonbashi, and begins publishing Utamaro · Sumida Hokusai Museum press release; Wikipedia · documented.
20. 1784 · Kyōden/Masanobu's Yoshiwara handwriting album · Met object 78670 · documented.
21. 1787 · riots in Edo; Matsudaira Sadanobu's Kansei reforms, 1787–93 · nippon.com; Wikipedia (Tsutaya) · probable.
22. 1790 · prints must carry the censor's seal (*kiwame*) to be sold; the system runs for over eighty years · Fiorillo; Wikipedia · documented (two secondary pages agree).
23. 1791 · Santō Kyōden manacled 50 days for three sharebon; Tsutaya fined — "half of his wealth" (McGill thesis; Chūō-ku page) · nippon.com; Sumida Hokusai Museum; thesis · documented.
24. 1793 · ban on naming non-courtesan women on prints; Utamaro's rebus titles follow; rebus pictures banned 8/1796 · Fiorillo · probable.
25. 1794–95 · Sharaku's ten months, all published by Tsutaya · AIC record 18897; Wikipedia · documented.
26. 1795 · an earlier price order: single sheets not above 16–18 mon · Ukiyo-e jiten (Katō) · probable.
27. 1797 · Tsutaya dies aged 48 · Sumida Hokusai Museum · documented.
28. 1799 · even preliminary drafts require approval · Wikipedia · probable.
29. 1800 (Kansei 12, 1st month) · ban on bust portraits (ōkubi-e) of women as "conspicuous" · Fiorillo · probable.
30. 1804 · Utamaro imprisoned (manacled) for prints of Toyotomi Hideyoshi; Toyokuni's group repressed 1801 · Wikipedia · probable.
31. 1806 · Utamaro dies · Wikipedia · probable.
32. 1814 · Hokusai Manga volume 1 published (Nagoya) · Met Bulletin 1985 · documented.
33. 1824–28 · imports of Prussian ("Berlin") blue through Nagasaki by Dutch and Chinese ships rise steeply while the price falls · Smith, "Hokusai and the Blue Revolution" (Columbia) · documented.
34. 1827–30 · Kuniyoshi's 108 Heroes of the Suikoden · Wikipedia; dealers · probable.
35. 1829 · Eisen's all-blue (aizuri) fan print, censor-sealed 1829, Brooklyn Museum; the bookseller Tōho's *Masaki no kazura* says the fad led Nishimura Yohachi to issue Hokusai's Fuji series in Berlin blue · Smith · documented.
36. ca. 1830–32 · Thirty-six Views of Mount Fuji; ten "additional views" with black outlines follow by c. 1835 · Met records; Vermeulen et al. · documented.
37. 1831 · Red Fuji "first printed in 1831" · Korenberg 2021 · documented (as her dating).
38. 1833–34 · Hiroshige's Hōeidō Tōkaidō · Met and AIC records · documented.
39. 1841–43 · Tenpō reforms under Mizuno Tadakuni · Fiorillo; OsakaPrints · documented.
40. 1842, 6th month, 4th day · Edo town order: nishiki-e of kabuki actors, courtesans and geisha banned, existing stock too; see §4 for wording. Enforced to about 1847; 11th month 1842: 16-mon price cap, 7–8 colour impressions, triptych maximum · Ukiyo-e jiten (Katō), quoting the town orders and Bakin's diary · documented.
41. 1842 · Ichikawa Danjūrō VII banished from Edo for ten years for stage extravagance · Fiorillo · probable.
42. 1843 · a Tsuchigumo spoof print by Sadahide costs its printer a 3-kanmon fine · Katō, citing Fujiokaya diary · probable.
43. 1849 · Hokusai dies · Met Bulletin · documented.
44. 1853–54 · Perry at Edo Bay; Treaty of Peace and Amity 1854 "ends seclusion policy" · TMG; Met Japonisme essay · documented.
45. 1855, 11 November (Ansei 2, 10th month 2nd day) · Ansei Edo earthquake; namazu-e appear within two days; "over three hundred and eighty varieties" in two days (Ryūtei Senka's diary via McDowell 2025); c. 300 designs known (ROM); production banned after about two months and blocks destroyed · Smits; ROM; Swarthmore · documented.
46. 1857 · One Hundred Famous Views of Edo under way (Plum Garden, Sudden Shower both 1857) · AIC and Met records · documented.
47. 1858 · Hiroshige dies; Kunisada's memorial portrait · AIC 24920 · documented.
48. 1858–62 · Yokohama-e boom; Yokohama opens 1859 · LoC collection page; Wikipedia · documented/probable.
49. 1861 · Yoshitomi's *Dutch Ship* · Met 73527 · documented.
50. 1864 · aniline dyes arrive; cochineal red spreads from 1869; naphthol "acid reds" from 1889 · Wikipedia; Cesaratto/Smith/Leona 2018 · documented for the dye chronology.
51. 1867 · last shogun resigns; Japan's pavilion at the Paris Exposition Universelle · TMG; Met Japonisme essay · documented.
52. 1868 · Meiji Restoration; Edo renamed Tokyo "and becomes a prefecture" · TMG · documented.
53. 1872 · first railway, Shimbashi–Yokohama · TMG · documented. (The brief's "1872 Tokyo" is better read as this; the renaming is 1868.)
54. 1876 · Japanese Bureau of Education shows woodblocks at the Philadelphia Centennial; they reach the Smithsonian in 1910 · NMAH Tokuno Gift page · documented.
55. 1878 · fifteenth and last Hokusai Manga volume · Met Bulletin · documented.

**The afterlife**
56. 1856 · Félix Bracquemond "allegedly" finds a Hokusai Manga volume at Delâtre's print shop, used as packing for porcelain; story first told by Bénédite in 1905; Eidelberg (1981) points out discrepancies; the Goncourts claimed the discovery too · Met Bulletin 1985 ("Traditionally"); Campbell thesis; Capua (Icon) · contested.
57. 1862 · Desoye's Paris shop; 1875 Bing's · Wikipedia · probable.
58. 1866 · Bracquemond's Service Rousseau, motifs lifted from the Manga, made for the 1867 Exposition · UPenn Japan–Paris project · documented.
59. 1870s · Philippe Burty coins "Japonisme" · Capua · documented.
60. 1887, Oct–Nov · Van Gogh's three copies after Japanese prints in Paris, the Plum Orchard first · Van Gogh Museum record · documented.
61. 1888 May–1891 April · Bing's *Le Japon artistique*, 36 issues, French, German and English editions · UW-Madison; Paris Musées · documented.
62. 1889 · Tokunō's gift of blocks, proofs, pigments and tools to the Smithsonian; on view 1889–1913 and after · NMAH · documented.
63. 1890, spring · Bing's ukiyo-e exhibition at the École des Beaux-Arts; Cassatt's ten colour etchings follow · Met Japonisme essay · documented.
64. 1892 · Koehler publishes Tokunō's block-cutting account in the Smithsonian Annual Report · NMAH · documented.
65. 1893 · Wright sees Japan's pavilion at the Chicago World's Columbian Exposition · AIC exhibition page 2017 · documented.
66. 1895 · Monet adds the Japanese-style bridge at Giverny; 1899 paints twelve views · NGA · documented.
67. 1896 · Fenollosa's *Masters of Ukioye* · Wikipedia · probable.
68. 1904 · Yamamoto Kanae's *Fisherman*, taken as the birth of sōsaku-hanga · Wikipedia · probable.
69. 1905 · Wright's first trip to Japan, returning with prints to sell; Crosby Noyes gives his collection to the LoC · AIC; LoC exhibit · documented.
70. 1906, 29 March–18 April · *Hiroshige Prints, lent by Frank Lloyd Wright*, Art Institute of Chicago, catalogue introduction by Wright · AIC exhibition record 4333; HathiTrust · documented.
71. 1908 · Wright's large print exhibition at the AIC with his own frames and furniture; 1911 Clarence Buckingham buys prints from Wright; 1915 Wright sells the Plum Garden to Kate Buckingham · AIC 2017 page; AIC record 26577 · documented.
72. 1915 · Watanabe Shōzaburō coins shin-hanga · Wikipedia · probable.
73. 1918 · Japanese Woodcut Artists' Association founded (sōsaku-hanga as movement); Watanabe memorial catalogue describes hanshita, kyōgō-zuri and 200-sheet editions · Wikipedia; hiroshige.org.uk transcription · probable.
74. 1921 · the Spaulding brothers give over 6,000 prints to the MFA Boston on condition they are never exhibited · MFA collection page · documented.
75. 1925 · Buckingham collection accessioned by the AIC; Gookin curator to 1936 · AIC · documented.
76. 2001–02 · LoC exhibition *The Floating World of Ukiyo-e* (c. 2,000 prints and 400 ehon in the collection) · LoC · documented.
77. 2020 · Korenberg's census: 111 original Great Wave impressions located, eight states · BM blog/PDF · documented.
78. 2024, 3 July · new 1,000-yen note: Kitasato Shibasaburō on the front, "Kanagawa-oki nami ura" on the back, main colour blue, 76 × 150 mm · Bank of Japan; National Printing Bureau · documented (verified as the brief asked).

Manga's claimed descent: Wikipedia's ukiyo-e article states that manga histories "often find an ancestor in the Hokusai Manga," while noting the book is not narrative and the word does not originate with Hokusai; Kern's kibyōshi work calls the kibyōshi "a distant progenitor" of modern manga (Harvard-Yenching essay). Report as *contested, both readings*.

---

## 3. The places (30, with Wikidata coordinates)

All coordinates are Wikidata P625 values read today through `wbgetclaims`. Lat, lon.

| Place | Wikidata | Lat | Lon | Role |
|---|---|---|---|---|
| Nihonbashi (district) 日本橋 | Q1141952 | 35.68167 | 139.77283 | Tsutaya's shop street (Tōriabura-chō); publishers' quarter |
| Nihonbashi bridge, start of the Five Routes | Q75098535 | 35.68406 | 139.77451 | Tōkaidō station 0; Hiroshige's first sheet |
| Yoshiwara 吉原 (Shin Yoshiwara) | Q1859550 | 35.72399 | 139.79569 | licensed quarter; Utamaro's subject; content note |
| Asakusa 浅草 | Q720644 | 35.71492 | 139.79652 | temple district; Tsutaya's grave at Shōhōji |
| Saruwaka-chō / Three Theatres of Edo 猿若町 | Q11550986 | — | — | theatre street from 1842; Wikidata has no coordinate — use Asakusa's |
| Ryōgoku 両国 | Q3083463 | 35.69386 | 139.79285 | bridge built after 1657; fireworks and sumō |
| Honjo 本所 | Q3140127 | 35.70380 | 139.80230 | Hokusai's birthplace district (probable); developed after 1657 |
| Sumida River 隅田川 | Q222149 | 35.71861 | 139.80722 | the river of the hundred views |
| Edo Castle 江戸城 | Q865913 | 35.68832 | 139.75439 | the map's centre |
| Kameido Tenjin 亀戸天神社 | Q11370953 | 35.70278 | 139.82083 | Plum Garden neighbourhood |
| Kyoto 京都 | Q34600 | 35.01161 | 135.76811 | Tōkaidō terminus; court; Nishijin |
| Sanjō Ōhashi 三条大橋 | Q3087620 | 35.00907 | 135.77174 | Tōkaidō's Kyoto end |
| Nishijin 西陣 | Q11629958 | 35.02967 | 135.75189 | silk-weaving district |
| Osaka 大坂 | Q35765 | 34.69375 | 135.50211 | Kamigata actor-print industry; 1842 ban hit hardest |
| Nagasaki 長崎 | Q38234 | 32.74953 | 129.87964 | Nagasaki-e; pigment imports |
| Dejima 出島 | Q640267 | 32.74352 | 129.87302 | VOC post 1641–1859 |
| Arita 有田 | Q668427 | 33.21064 | 129.84903 | porcelain |
| Kanagawa-juku 神奈川宿 | Q546680 | 35.47500 | 139.63296 | Tōkaidō station 3; the Great Wave's "off Kanagawa" |
| Kanagawa-ku, Yokohama | Q1143712 | 35.47694 | 139.62944 | same shore today |
| Yokohama 横浜 | Q38283 | 35.45033 | 139.63422 | opened 1859; Yokohama-e |
| Hakone-juku 箱根宿 | Q3069817 | 35.18949 | 139.02538 | Tōkaidō station 10; barrier |
| Mount Fuji 富士山 | Q39231 | 35.36056 | 138.72750 | the series' protagonist |
| Echizen (city) 越前 | Q877941 | 35.90350 | 136.16875 | washi village cluster (Echizen paper) |
| Mino (city, Gifu) 美濃 | Q853835 | 35.54475 | 136.90756 | Mino paper |
| Tokyo 東京 | Q1490 | 35.68944 | 139.69167 | Edo renamed 1868 |
| Paris | Q90 | 48.85667 | 2.35222 | 1867, 1888, 1890 |
| Giverny | Q165061 | 49.07611 | 1.52917 | Monet's bridge |
| Amsterdam | Q727 | 52.36667 | 4.88333 | Van Gogh Museum; Rijksmuseum |
| Boston | Q100 | 42.36028 | -71.05778 | Bigelow, Spaulding, MFA |
| Chicago | Q1297 | 41.88194 | -87.62778 | 1893 fair, Wright, Buckingham, AIC |

---

## 4. The numbers

Each with source and confidence.

**Edo's population.** c. 300,000 at the time of the 1657 fire (Edo-Tokyo Digital Museum; documented as the museum's figure). c. 500,000 by the 1650s, "Japan's largest city" (Wikipedia, History of Tokyo; probable). "Over a million by the mid eighteenth century" (TMG; documented). 1721 first census "about 1.3 million" (TMG timeline; documented), with samurai and townspeople "nearly the same" (TMG planning PDF). Wikipedia adds that males were nearly 70 % of the population and gives 1,800 as the village figure before 1590 (probable).

**Print prices.** A Great Wave sold "for the same price as about two helpings of noodles in the mid-19th century" (British Museum blog; documented as the BM's comparison; Tim Clark: "just a bit more than a double helping of soba"). In 1842 a ten-plus-impression single sheet "sold for about 24 mon," and the November 1842 order capped single sheets and fan prints at 16 mon, cutting 8 mon (Katō's Ukiyo-e jiten quoting *Shichū torishimari ruishū*; documented in a Japanese secondary source quoting primary records). A 1795 order had set 16–18 mon (same). In Osaka in 1842 a seller of a 4-mon actor print was fined 10 kanmon; the 1842 exchange rate given is 1 ryō = 6,500 mon, so the fine was about 1.5 ryō (same; probable). Bakin in 1842 reports a lavish Saruwaka-chō theatre print at 4 bu, i.e. one ryō (same; probable). Luxury: the Met's Monet record is irrelevant here, but the Watanabe 1918 catalogue describes kyōgō-zuri proofs and a 200-sheet set as the printer's delivery (hiroshige.org.uk; probable).

**A print run.** Korenberg (BM PDF) collects the standard estimates: a publisher needed to sell "at least 2,000 impressions" to profit; some Kunisada designs printed 3,000–4,000 times; Hiroshige's Tōkaidō "between 12,000 and 15,000 times"; the Great Wave "up to 8,000" (documented as cited estimates; confidence probable for the underlying numbers, which rest on secondary literature). Printing speed: historical records of 3,000 key-block impressions a day (BM video); 200–300 sheets a day, dropping to 20–30 with bokashi gradation (Korenberg 2021); the Asian Art Museum's teaching page says about 200 prints — "the usual edition" — in a day and up to 8,000 from a block before recutting (probable). Blocks per print: "averaged ten to sixteen" (LoC), "could number up to twenty" (Met essay), Harunobu "up to a dozen" (Wikipedia). The NMAH Rustic Genji sheet: 23 impressions from 13 surfaces on 7 blocks (documented, object record). The Great Wave: at least seven carved faces, probably four double-sided blocks (Korenberg; documented).

**Survival.** 111 original Great Wave impressions located by 2020, 113 by 2024; BM holds three, the Met four, Maidstone one; none of the Great Wave blocks survive (BM; documented). Red Fuji: 93 impressions, five states (Korenberg 2021). Thirty-six Views at the Met: all 46 designs, 121 impressions (Vermeulen 2019).

**A kimono's cost.** No open authoritative figure was found today. Leads: the *Sōkan kakuchō* account book (Mitsui Bunko, 1683–90) records textile names and prices and is analysed in a J-STAGE paper (Japanese; documented that the source exists, figures not read); the Met's komon label says small-pattern textiles "were quite expensive." Treat any ryō figure in circulation (e.g. "50–200 ryō") as unverified — confidence low; do not print it.

**The 1842 ban's wording.** The Edo town order of Tenpō 13, 6th month: 錦絵と唱、歌舞伎役者遊女女芸者等を壱枚摺ニ致候義、風俗ニ拘り候筋ニ付、以来開板は勿論、是迄仕入… — "what are called nishiki-e, single sheets of kabuki actors, courtesans and female geisha, concern public morals; henceforth new publication, and the sale of existing stock, is forbidden." The gloss adds: fan prints likewise; gōkan may not take plots from the theatre or draw actor likenesses; subjects should be loyalty, filial piety, chastity and children's moral instruction; colour-printed covers banned; new blocks to be submitted to the town elder Tachi Ichiemon for *aratame* inspection. The 11th-month follow-up: "壱枚絵団扇絵共、拾六文以上は無用之事" (single sheets and fan prints not above 16 mon), printings limited to seven or eight, continuous sets to three sheets (Katō, quoting the orders; documented; García Rodríguez 2001 gives a Spanish translation of the same edict from the Genshoku ukiyo-e daihyakka jiten). The ban was enforced in Edo from 1/1842 and Osaka 7/1842 to about 5/1847 (Fiorillo; probable). The kiwame seal gave way to the nanushi *aratame* seals in this period (viewingjapaneseprints "Censor Seals" page, not opened; probable).

**Hokusai's output as museums claim it.** The Met Bulletin (1985) credits him with "some 30,000 to 40,000 drawings" (documented as the Met's claim; a round estimate). The Manga alone runs to "over 4000 sketches" in 15 volumes (Wikipedia; probable).

**Tōkaidō stations.** Fifty-three post stations, named in every Met and AIC series title; Hiroshige's Hōeidō set adds Nihonbashi ("Stations One" in the Met title) and Kyoto for 55 sheets (the 55 count is standard but was not read on an opened page — probable).

**Publishers.** Over a thousand publishers known across the period; about 250 at the 1840s–50s peak, 200 in Edo; about 40 by 1900 (Wikipedia; probable). Blocks were owned by publishers, who enforced copyright through the Picture Book and Print Publishers' Guild from the late eighteenth century (Wikipedia; probable).

**Kibyōshi.** About 2,500 extant titles, produced mainly 1775–c. 1806 (Kern, Harvard-Yenching essay; documented).

**Sales figures of the Great Wave as given by the BM or the Met.** Neither institution gives a sales figure; the BM states explicitly that "no records of the number of prints … exist" and offers the 8,000 estimate and the noodle price; the Met's essay gives no number. Report that absence rather than a figure.

**Collections.** MFA Boston: over 45,000 Japanese prints; Spaulding gift over 6,000, 1921, never to be exhibited (MFA; documented). LoC: more than 2,500 prints, 1,100 scanned with Nichibunken support; Noyes gift 1905 (LoC; documented). Met: over 4,000 prints; all 46 Fuji views (Vermeulen 2019; documented).

---

## 5. Three things the designer should not miss

1. The Art Institute's Plum Garden carries Frank Lloyd Wright in its provenance line, and the AIC's own three Great Waves are catalogued as later states: the Chicago collection is the Japonisme afterlife in object form, not just a print room.
2. The 1842 edict is not an abstraction: its wording, its 16-mon ceiling and its 7–8-impression limit are quotable, and a contemporaneous record prices an ordinary ten-colour sheet at 24 mon — the state cut the price by a third while banning the two best-selling genres.
3. "Famous" is not "open": the Met's Monet bridge and its komon stencil both return `isPublicDomain: false`; the Van Gogh Museum licence is non-commercial only; the Smithsonian's process set is CC0 in data but conditioned in image. The Cleveland and AIC APIs and the LoC maps were the dependable open sources today.

---

## Sources opened (URL · what it is)

- https://collectionapi.metmuseum.org/public/collection/v1/objects/36491 · Met API, Great Wave JP10
- https://collectionapi.metmuseum.org/public/collection/v1/objects/45434 · Met API, Great Wave JP1847
- https://collectionapi.metmuseum.org/public/collection/v1/objects/36490 · Met API, Red Fuji JP9
- https://collectionapi.metmuseum.org/public/collection/v1/objects/36977 · Met API, Sunshower at Nihonbashi
- https://collectionapi.metmuseum.org/public/collection/v1/objects/36922 · Met API, Stations One: Nihonbashi
- https://collectionapi.metmuseum.org/public/collection/v1/objects/55433 · Met API, Sudden Shower
- https://collectionapi.metmuseum.org/public/collection/v1/objects/37053 and /55052 · Met API, two Kameido prints (not used)
- https://collectionapi.metmuseum.org/public/collection/v1/objects/73639 · Met API, Sadahide proof line-block print
- https://collectionapi.metmuseum.org/public/collection/v1/objects/437127 · Met API, Monet bridge (isPublicDomain false)
- https://collectionapi.metmuseum.org/public/collection/v1/objects/436535 · Met API, Van Gogh Wheat Field (control)
- https://collectionapi.metmuseum.org/public/collection/v1/objects/45282 · Met API, Okazaki Cat Demon
- https://collectionapi.metmuseum.org/public/collection/v1/objects/73527 · Met API, Dutch Ship 1861
- https://collectionapi.metmuseum.org/public/collection/v1/objects/893318 · Met API, Ghosts of the Taira
- https://collectionapi.metmuseum.org/public/collection/v1/objects/61835 · Met API, komon kosode
- https://collectionapi.metmuseum.org/public/collection/v1/objects/53216 · Met API, komon stencil (not PD)
- https://collectionapi.metmuseum.org/public/collection/v1/objects/53658 · Met API, hemp-leaf stencil
- https://collectionapi.metmuseum.org/public/collection/v1/objects/54384 · Met API, Kuniyoshi surimono
- https://collectionapi.metmuseum.org/public/collection/v1/objects/78741 · Met API, ehon banzuke
- https://collectionapi.metmuseum.org/public/collection/v1/objects/78670 · Met API, Kyōden Yoshiwara book
- https://collectionapi.metmuseum.org/public/collection/v1/objects/78803 · Met API, Fugaku hyakkei
- https://collectionapi.metmuseum.org/public/collection/v1/search?q=... · Met search endpoint (several queries; many returned HTTP 410)
- https://www.metmuseum.org/art/collection/search/45282, /893318, /54384, /78665, /57047, /36709, /761386 · Met object pages (Kuniyoshi)
- https://www.metmuseum.org/art/collection/search/73639, /73642, /73527, /73422 · Met object pages (proof prints; Dutch ships)
- https://www.metmuseum.org/art/collection/search/53216, /64389, /69271, /53218, /53658, /53837, /70011 · Met stencil pages
- https://www.metmuseum.org/art/collection/search/61834, /61837, /74593, /61849, /61801, /61835, /61843, /78467 · Met kosode pages
- https://www.metmuseum.org/art/collection/search/78670, /57786, /57856, /74279, /78741, /78803 · Met book pages
- https://libmma.contentdm.oclc.org/digital/collection/p16028coll7/id/286/ · Met Libraries JIB91 record with copyright statement
- http://metmuseum.org/essays/hokusai-great-wave · Met essay, "The Great Wave: Anatomy of an Icon" (Marco Leona)
- https://www.metmuseum.org/essays/woodblock-prints-in-the-ukiyo-e-style · Met Heilbrunn essay
- https://www.metmuseum.org/essays/japonisme · Met Heilbrunn essay
- https://www.metmuseum.org/essays/art-of-the-pleasure-quarters-and-the-ukiyo-e-style · Met Heilbrunn essay
- https://www.metmuseum.org/essays/art-of-the-edo-period-1615-1868 · Met Heilbrunn essay
- https://resources.metmuseum.org/resources/metpublications/pdf/Hokusai_The_Metropolitan_Museum_of_Art_Bulletin_v_43_no_1_Summer_1985.pdf · Met Bulletin 1985 (Mayor), Manga dates, Bracquemond story
- https://www.metmuseum.org/met-publications/the-great-wave-the-influence-of-japanese-woodcuts-on-french-prints · Met publication page (Ives)
- https://api.artic.edu/api/v1/artworks/24645 · AIC API, Great Wave 1925.3245 (full record)
- https://api.artic.edu/api/v1/artworks/26577, /18765, /192276, /6805 · AIC API detail records
- https://api.artic.edu/api/v1/artworks/search?q=... · AIC API searches (Plum Estate; Hokusai manga; Sharaku; Utamaro; Harunobu 1765; Kuniyoshi; Kunisada; surimono; key block; printing block; katagami; censor seal; Hoeido Tokaido; Nagasaki; Whistler)
- https://api.artic.edu/docs/ · AIC API documentation (IIIF URL pattern, licence)
- https://www.artic.edu/exhibitions/4333/hiroshige-prints-lent-by-frank-lloyd-wright · AIC exhibition record 1906
- https://www.artic.edu/exhibitions/9016/... · AIC 2017 exhibition page on Wright and the print collection
- https://www.artic.edu/exhibitions/4381/... · AIC 1908 exhibition record
- https://openaccess-api.clevelandart.org/api/artworks/?q=Kuniyoshi (and katagami, inro, netsuke, Arita, Kiyonaga, kosode, Nagasaki) · Cleveland Open Access API
- https://www.loc.gov/item/77694812/ · LoC, Ansei kaisei Oedo ōezu 1859
- https://www.loc.gov/item/gm71005088/ · LoC, Edo ōezu eiri 1677
- https://www.loc.gov/item/gm71005200/ · LoC, Edo ōezu 1676 (via search result)
- https://www.loc.gov/item/2021668278/ · LoC, Edo–Nagasaki route map 1672 (via search result)
- https://loc.gov/exhibits/ukiyo-e/intro.html and https://www.loc.gov/exhibits/ukiyo-e/ · LoC exhibition overview
- https://loc.gov/exhibits/ukiyo-e/early.html · LoC exhibition, early masters
- https://www.loc.gov/collections/japanese-fine-prints-pre-1915/about-this-collection/ · LoC collection page
- https://loc.gov/preservation/conservators/japanesepillar/index.html · LoC conservation note (Kiyonaga pillar print, blocks and pigments)
- https://www.nga.gov/artworks/74796-japanese-footbridge and https://www.nga.gov/collection/art-object-page.74796.html · NGA Monet record
- https://www.vangoghmuseum.nl/en/collection/s0115V1962 · Van Gogh Museum record
- https://www.vangoghmuseum.nl/en/about/organisation/terms-and-conditions/use-and-permissions-of-collection-images · Van Gogh Museum image terms
- https://www.vangoghmuseum.nl/en/collection/p2823S2017 · Van Gogh Museum, Le Japon artistique no. 1
- https://www.parismuseescollections.paris.fr/en/node/236015 (and /236014, /236016) · Paris Musées, Le Japon artistique, CC0
- https://archive.org/details/b1383895 · Internet Archive, Le Japon artistique vol. 1, Public Domain Mark
- https://search.library.wisc.edu/digital/AVWYAAUJJNSZZB8T · UW-Madison digital Le Japon artistique (36 issues)
- https://sammlung.mak.at/en/collect/japon-artistique-may-1888-april-1891_284018 · MAK record (printer Gillot)
- https://www.americanhistory.si.edu/ne/collections/object-groups/tokuno-gift · NMAH Tokuno Gift group page
- https://www.americanhistory.si.edu/ne/collections/object-groups/tokuno-gift/tukono-cutting-printing · NMAH, Tokunō's description
- https://www.si.edu/object/baren%3Anmah_1411975 and https://americanhistory.si.edu/collections/object/nmah_1411975 · baren record
- https://www.americanhistory.si.edu/collections/object/nmah_819332 · block GA.03212.02
- https://www.americanhistory.si.edu/ko/collections/object/nmah_793553 and https://ids.si.edu/ids/manifest/NMAH-ET2012-09761-000003 · proof GA.03213.05 record and IIIF manifest
- https://www.americanhistory.si.edu/collections/object/nmah_1412163 · proof GA.03215.25
- https://www.rijksmuseum.nl/en/collection/object/Kapitein-Hollander-die-naar-het-Oosten-is-gekomen--2c6d6588e4537e953484b890793f6bab · Rijksmuseum Nagasaki-e
- https://www.rijksmuseum.nl/en/collection/object/Nagasaki-Bay--182362408dd8fb2131533486b6472de0 · Rijksmuseum Kawahara Keiga
- https://www.rijksmuseum.nl/en/collection/object/The-Trading-Post-at-Dejima--d63b07e4d30d2cc01793a21fa9413839 · Rijksmuseum Dejima scroll (1641 date)
- https://www.rijksmuseum.nl/en/collection/object/De-Nederlandse-handelsfactorij-op-Deshima--83b6f420cd845e385d910d7d00a7b911 · Rijksmuseum scroll c. 1810
- https://www.britishmuseum.org/blog/great-wave-spot-difference · BM blog (Korenberg): 8,000 estimate, 111 impressions, noodle price
- https://www.britishmuseum.org/sites/default/files/2022-03/korenberg_article-for_hokusai%20_edited_volume_final-2020_accessible.pdf · Korenberg, Making and evolution of the Great Wave
- https://www.youtube.com/watch?v=U_025NB8alw · BM video (Korenberg) transcript: 3,000 key-block impressions a day
- https://openscience.fr/IMG/pdf/iste_artsci21v5n1_2.pdf · Korenberg, Red Fuji: 93 impressions, five states
- https://exa.ai/library/publication/hjytf6dlkzk · Vermeulen et al. 2020, chronology of Thirty-six Views (Met impressions)
- https://exa.ai/library/publication/42djwv24w3m · Vermeulen & Leona 2019, arsenic sulfide; Met holds 46 views, 121 impressions
- https://exa.ai/library/publication/8cg9ypffrrh · Cesaratto, Smith, Leona 2018, synthetic dye timeline
- https://academiccommons.columbia.edu/doi/10.7916/d8-hxn2-xg81 and https://columbia.edu/~hds2/pdf/2005_Hokusai_and_the_Blue_Revolution.pdf · Smith, Hokusai and the Blue Revolution
- https://www.scholten-japanese-art.com/blueprint.php · dealer essay on bero (secondary)
- https://www.ne.jp/asahi/kato/yoshio/ukiyoeyougo/te-yougo/yougo-tenpoukaikaku.html · Katō Yoshio's Ukiyo-e jiten, Tenpō reforms, with the 1842 order texts and prices
- https://www.ne.jp/asahi/kato/yoshio/tyojutu/ukiyoe-hikka3-tenpou13.html · same site, Tenpō 13 censorship cases (Bakin letters, Fujiokaya diary)
- https://viewingjapaneseprints.net/texts/topics_faq/faq_sumptuary.html · Fiorillo, sumptuary edicts (1790 seal, 1800 ban, 1842–47)
- https://www.osakaprints.com/content/information/articles/article_texts/tenpo.htm and .../tempo_tempo.htm · Osaka prints, Tenpō ban essays
- https://exa.ai/library/publication/tgsc80fnb8d · García Rodríguez 2001, compendium of print-control laws 1657–1842
- https://www.thecollector.com/ukiyo-e-censorship/ · popular summary (secondary)
- https://en.wikipedia.org/wiki/Ukiyo-e · Wikipedia, ukiyo-e (timeline backbone)
- https://en.wikipedia.org/wiki/Tsutaya_J%C5%ABzabur%C5%8D · Wikipedia, Tsutaya
- https://en.wikipedia.org/wiki/History_of_Tokyo · Wikipedia, History of Tokyo (via search result)
- https://www.nlc-bnc.ca/obj/s4/f2/dsk2/ftp03/MQ51565.pdf · McGill thesis on Tsutaya and Sadanobu (half of wealth confiscated)
- https://www.tnm.jp/modules/r_free_page/index.php?id=2691 · Tokyo National Museum, Tsutaya exhibition 2025
- https://hokusai-museum.jp/uploads/files/upload_file/press_release/press_release_file/1154/PressRelease_ExhibitionHokusaiandtheProducers_S.pdf · Sumida Hokusai Museum press release (Tsutaya dates, 1783 move, 1791 fine)
- https://www.nippon.com/en/japan-topics/g02311/ · nippon.com, Tsutaya (50 days manacles)
- https://en.tokuhain.chuo-kanko.or.jp/detail.php?id=3974 · Chūō-ku tourism blog (half property)
- https://www.britannica.com/topic/sankin-kotai · Britannica, sankin kōtai 1635
- https://www.english.metro.tokyo.lg.jp/documents/d/english/tokyo-city-profile-and-government_2023-pdf-1 and https://www.english.metro.tokyo.lg.jp/w/000-101-007591 · TMG history and timeline (1657, 1721 census, 1854, 1868, 1872)
- https://www.library.metro.tokyo.lg.jp/portals/0/edo/tokyo_library/english/machi/page2-1.html · Edo-Tokyo Digital Museum, Meireki fire
- https://www.toshiseibi.metro.tokyo.lg.jp/documents/d/toshiseibi/pdf_keikaku_chousa_singikai_pdf_tokyotoshizukuri_en_0_03 and ..._04 · TMG urban planning PDFs (Meireki; 1.3 million)
- https://www.boj.or.jp/en/note_tfjgs/note/n_note/index.htm and https://www.boj.or.jp/en/note_tfjgs/note/n_note/data/n_note1000b.pdf · Bank of Japan, new notes 3 July 2024
- https://www.npb.go.jp/en/n_banknote/design01/ · National Printing Bureau, new 1,000-yen design
- https://collections.mfa.org/collections/449579 · MFA Boston, Japanese prints collection page (45,000; Spaulding)
- https://collections.mfa.org/objects/225480, /225475, /224583, /224582, /225577 · MFA banzuke records (link-out)
- https://pressbooks.bccampus.ca/meijiat150/chapter/the-ansei-edo-earthquake-and-catfish-prints/ · Smits, Ansei earthquake and namazu-e
- https://collections.rom.on.ca/objects/2542907/... and https://www.rom.on.ca/learn/resources/namazu-e-catfish-prints-introduction-japanese-english-caption · ROM namazu-e album (c. 300 designs; 7,000 dead)
- https://archive.swarthmore.edu/library-japan/gallery/catfish.html · Swarthmore namazu-e page
- https://exa.ai/library/publication/5v72988j02k · McDowell 2025, Arts (380 varieties in two days)
- https://exa.ai/library/publication/dnp0m7p7rxs · Kern, Kibyōshi in the Harvard-Yenching Library (2,500 titles, 1775–1806)
- https://www.hup.harvard.edu/books/9780674241787 · Harvard UP, Manga from the Floating World
- https://exa.ai/library/publication/jnfswy8fbj0 · Campbell 2015 thesis, Bracquemond and the 1856 story (Bénédite 1905; Eidelberg 1981)
- https://www.icon.org.uk/static/8a7c0a18-5b5f-4023-9e050792eaf75b8e/CapuaJaponisme-and-Japanese-works-on-paper.pdf · Capua, Japonisme and Japanese works on paper
- https://web.sas.upenn.edu/japan-paris/project/japanism-musee-des-arts-decoratifs/ · UPenn project page, Service Rousseau 1866
- https://hiroshige.org.uk/Watanabe/Watanabe_Catalogue_266_284.htm · Watanabe 1918 memorial catalogue transcription (proof sheets, 200-sheet sets)
- https://www.hiroshige.org.uk/Stewart/Stewart_Chapter_02.htm · Stewart 1922 guide (technique; secondary)
- https://education.asianart.org/resources/the-ukiyo-e-woodblock-printing-process/ · Asian Art Museum teaching page (200 a day; 8,000 per block)
- https://samurai-archives.com/wiki/Ishikawa_Rokudayu · SamuraiWiki (1681 incident; secondary)
- https://www.jstage.jst.go.jp/article/jhej/64/12/64_759/_article/-char/ja · J-STAGE abstract, Sōkan account book textile prices
- https://www.wikidata.org/w/api.php?action=wbsearchentities... and ...action=wbgetclaims&entity=Q...&property=P625 · Wikidata search and coordinate claims for the 30 places
- https://museumcollection.tokyo/en/works/6231422/ · Tokyo Museum Collection, Kuniyoshi Suikoden (link-out)
- https://www.digitalcollections.manchester.ac.uk/view/PR-JAPANESE-00098 · Manchester, Bunken Edo ōezu note (map lineage)

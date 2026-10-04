# Sources opened for edo-v3 (fetched 2026-10-04 via Firecrawl scrape, TinyFish fetch, Exa search; shell had no direct internet)

## Museum APIs
- https://collectionapi.metmuseum.org/public/collection/v1/search — retired 2026-10-01 (410); replaced by v1.1/search
- https://collectionapi.metmuseum.org/public/collection/v1.1/search?q=… — queries: Sharaku; Otani Oniji Sharaku; Utamaro Tsutaya; Harunobu calendar; Hokusai Manga; namazu; Seichu gishi den; Ehon Azuma asobi
- https://collectionapi.metmuseum.org/public/collection/v1/objects/{id} — 36491 (test), 37358, 37363, 37283, 37284, 56789, 56874, 45069, 57679, 57680, 55040, 55768, 55727, 57089, 78631, 78632
- https://openaccess-api.clevelandart.org/api/artworks/?q=… — Kuniyoshi Seichu gishi den; namazu; Kameido plum Hiroshige; Danjuro VII Kunisada; Katsukawa Shunsho actor; Hokusai surimono; Yokohama foreigners; Utamaro Tsutaya; Katsushika Oi; Harunobu calendar
- https://openaccess-api.clevelandart.org/api/artworks/{118833,102605,123249,160300} — records incl. images, inscriptions, technique
- https://api.artic.edu/api/v1/artworks/search?q=… — namazu catfish earthquake; Kuniyoshi Seichu gishi den; Hiroshige Plum Park Kameido; Yokohama foreigners 1861; Ichikawa Danjuro VII Kunisada; Ehon Azuma asobi Tsutaya; Hiroshige Shinagawa/Shono/Kambara/Mishima/Yui/Hakone/Kanagawa/Sanjo Bridge Tokaido; Kuniyoshi loyal retainers; Hiroshige Kameido Umeyashiki plum (fields id,title,artist_display,date_display,image_id,is_public_domain,main_reference_number,credit_line; config.iiif_url = https://www.artic.edu/iiif/2)

## Wikimedia Commons API
- imageinfo iiurlwidth=330 for the 120 files used in the en.wiki One Hundred Famous Views list (3 batches)
- imageinfo iiurlwidth=1920 + extmetadata: Hiroshige-53-Stations-Hoeido-02-Shinagawa-MIA-01.jpg, -04-Kanagawa-BM-03.jpg, -11-Hakone-MFA-01.jpg, -16-Kanbara-MFA-02.jpg; Namazu-e - Kashima controls namazu.jpg; Kashima-kanameishi-shinzu-namazu-e.jpg; Seichu Gishi Den (BM 1906,1220,0.1163).jpg; Le Japon artistique décembre 1889.jpg; Le Japon Artistique S. Bing.jpg; Japon Artistique Zs.jpg; Doll Shop of Jikken LACMA M.2006.136.153.jpg
- list=search (ns 6): namazu-e 1855; Kuniyoshi Seichu gishi den; "Le Japon artistique"; Tsutaya Juzaburo shop Hokusai; ezoshiya print shop ukiyo-e; Ehon Azuma asobi; Tsutaya Hokusai publisher shop; Eisen print shop Edo; 耕書堂; "Tsutaya Jūzaburō" shop; 絵草紙店; Tsutaya Hokusai Azuma asobi

## Wikidata
- wbsearchentities: "One Hundred Famous Views of Edo" (→Q165190); "Fifty-three Stations of the Tokaido"
- SPARQL: prints with P179=Q165190 + P1545 ordinal, labels, P625/P9149, P18 (119 items)
- wbgetentities sites=enwiki titles=55 Tōkaidō station articles (2 batches; claims P625, P31/P1545 ordinals, labels)
- SPARQL: items with P31=Q75093704 (Tōkaidō 53-stations class) ordinal 00/08/38/39/53/54 (Nihonbashi Q75098535, Ōiso, Okazaki, Chiryū, Ōtsu, Sanjō Ōhashi)
- wbgetentities sites=enwiki: Norfolk, Hampton Roads, Funchal, Jamestown (St Helena), Cape Town, Port Louis, Galle, Singapore, Macau, Hong Kong, Shanghai, Naha, Chichijima, Uraga, Amsterdam, Texel, Jakarta, Dejima, Marseille, Yokohama, San Francisco, Honmyō-ji (Kumamoto – rejected), Kurihama, Batavia (Dutch East Indies); Port_Lloyd missing
- wbgetentities sites=jawiki: 本妙寺 (豊島区) → Q11520109; 堀切菖蒲園 → Q11427321; SPARQL P625/P131/P6375/P571 for both

## Wikipedia (API action=parse wikitext)
- en: One_Hundred_Famous_Views_of_Edo (list with seasons, {{coord}}, files)
- en: The_Fifty-three_Stations_of_the_Tōkaidō (station order and article titles)
- en: Perry_Expedition (port calls with dates)
- en: List_of_Japanese_era_names → redirect; Japanese_era_name (era list used for eras.json)
- en: Great_fire_of_Meireki → redirect; Great_Fire_of_Meireki
- ja: 明暦の大火 (three outbreaks, times, places)
- ja: 本妙寺_(豊島区) section 0 (current address/coord)

## Library of Congress
- https://www.loc.gov/item/77694812/?fo=json (Ansei kaisei Oedo ōezu, 1859; rights; resources)
- https://tile.loc.gov/image-services/iiif/service:gmd:gmd7:g7964:g7964t:ct011892r/info.json
- https://www.loc.gov/maps/?q=edo+zu&dates=1650/1699&fo=json&c=50&at=results
- https://www.loc.gov/item/gm71005163/?fo=json (Edo ōezu, eiri, 1676; rights)
- https://tile.loc.gov/image-services/iiif/service:gmd:gmd7:g7964:g7964t:ct011927/info.json

## Web pages (via Exa search results / fetch)
- https://www.loc.gov/collections/william-speiden-journals/articles-and-essays/voyage-of-mississippi-to-china-seas-and-japan/december-1852-to-december-1853/ (Norfolk, Funchal, Point de Galle, Naha)
- http://www.ibiblio.org/hyperwar/PTO/Dip/Perry/ (Perry itinerary; departure from Norfolk; 2 July 1853 sailing from Okinawa)
- https://whalesite.org/bonin/1855%20-%20Perry%20-%20Correspondence.htm (Perry dispatch: Port Lloyd 14 June 1853)
- https://era-prod11.ethz.ch/download/pdf/4594957.pdf (Hawks, Narrative… contents: Port Louis, Point de Galle, Napha, Port Lloyd)
- https://en.wikipedia.org/wiki/Pacific_Mail_Steamship_Company (1867 first scheduled trans-Pacific service) – Exa highlights
- https://www.rfrajola.com/CandJBook.pdf (inauguration 1 Jan 1867; railroad completed May 1869) – Exa highlights
- https://grokipedia.com/page/ss_colorado (seen in results; NOT used as a source)
- http://www.hongkongstudycircle.com/Papers/009-Book-MESSAGERIES-IMPERIALES-Scamp/MI-MM-Book-presentation-to-SPH-2010.pdf (MI Yokohama branch 1865; ports of call)
- https://hongkongstudycircle.com/Papers/010-Book-2-Scamp/MI-book-description-ordering-informatiion-b.pdf
- https://hal.science/hal-04257381v1/document (MI line extended to Japan 1865; head of line to Marseille after 1869)
- https://industrialhistoryhk.org/messageries-maritimes-french-shipping-line-advert-1905/ (Marseille liners to Yokohama after 17 April 1870)
- https://en.wikipedia.org/wiki/Vereenigde_Oostindische_Compagnie (Cape outpost; ships into Batavia; Dejima 1641–1853) – Exa highlights
- https://resources.huygens.knaw.nl/das/voyages (Dutch-Asiatic Shipping: Texel departures, Cape stop)
- https://nationaalarchief.nl/onderzoeken/archief/1.04.21/download/pdf (Batavia→Japan sailing each June)
- https://nagasakidejima.jp/english/history/ (ships left Batavia in early summer for Nagasaki)
- https://www.library.metro.tokyo.lg.jp/portals/0/edo/tokyo_library/english/modal/index.html?d=5640 (Ehon Azuma asobi print-shop page = Tsutaya Kōshodō storefront)
- https://ukiyo-e.org/image/mfa/sc225741 (MFA title "Print and Book Store (E-sôshi ten): The Store of Tsutaya Jûzaburô" – not open licence, context only)
- https://www.metmuseum.org/art/collection/search/78631 and /78632 (429 on direct fetch; seen via Exa)

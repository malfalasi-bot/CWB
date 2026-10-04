# Award-level interactive history, museum and documentary experiences (2015–2026): benchmarks for an Edo Japan / ukiyo-e map+timeline+narrative course unit

Scope note: ~15 search/fetch calls across Parallel, Exa and Tavily (Parallel rate-limited after two calls). Every fact below carries an inline source. Where I could not confirm an award, stack or metric, it is listed under Gaps rather than guessed. Quotes are ≤25 words.

---

## Key Question 1 — Which interactive histories/atlases/museum experiences won or were shortlisted for major awards 2015–2026, and what exactly did judges or makers say? (The exemplar benchmark)

### Takeaway
The award-winning set divides into four families that a small team can learn from: (a) newsroom 3-D/spatial reconstructions of a past moment (NYT Tulsa, NYT Maui, WaPo Minneapolis, Reuters Hong Kong, SCMP Forbidden City); (b) museum-commissioned narrative microsites (Getty's Persepolis Reimagined, MoAR's Finding Freedom, British Museum's Museum of the World, SBS's The Boat); (c) open scholarly atlases and tools (American Panorama, Chronas, Histography, Allmaps, Smithsonian Voyager, Knight Lab); and (d) Japan-specific map/print projects that are directly reusable (Rekichizu, CODH Edo Maps, Ukiyo-e Map, Google Arts & Culture ukiyo-e stories). Judges consistently praised: "show, don't tell" spatial immersion, concision, deep archival research made visible, and interaction that lets the reader operate the history rather than read about it.

### Cited Findings — exemplar cards (maker · year · awards · what · structure · interaction · visual language · stack/reproducibility · borrowable)

**1. What the 1921 Tulsa Race Massacre Destroyed — The New York Times, 2021**
- Award: Online Journalism Awards 2021, Feature (Large Newsroom). Judges: "Borrowing elements from video games, this immersive feature encourages you not merely to consume the story but to interact with it." — [OJA entry](https://awards.journalists.org/entries/what-the-1921-tulsa-race-massacre-destroyed/)
- Structure: readers "are first taken on a virtual tour through the more than 70 businesses in Greenwood's marquee block", are introduced to the people who ran them, then get "an interactive aerial view of the larger Greenwood community" of 35 blocks — a block-to-neighbourhood scale break. — [OJA entry](https://awards.journalists.org/entries/what-the-1921-tulsa-race-massacre-destroyed/)
- Process/stack: Sanborn insurance maps (1915, 1920) georeferenced; a neural network trained to extract building footprints; a Python tool for manual height entry; a veteran 3-D artist built detailed blocks in Maya from archival photos; "When no visual references were available, we left the buildings blank so we wouldn't be representing anything that we hadn't verified." The 3-D model, map files and data set were released openly. — [NYT Open](https://medium.com/timesopen/how-we-reconstructed-the-neighborhood-destroyed-by-the-tulsa-race-massacre-33fcf32dd086); project page describes the georeferencing pipeline — [NYT interactive](https://www.nytimes.com/interactive/2021/05/24/us/tulsa-race-massacre.html)
- Team: two lead graphics editors (Parshina-Kottas, Singhvi) plus named colleagues for geography, ML, 3-D, data entry — roughly 8 named contributors; months of research. — [NYT Open](https://medium.com/timesopen/how-we-reconstructed-the-neighborhood-destroyed-by-the-tulsa-race-massacre-33fcf32dd086); [SIGGRAPH interview](https://blog.siggraph.org/2022/06/piecing-together-the-puzzle-behind-the-tulsa-race-massacre.html/)
- Borrowable for Edo: the exact pipeline (georeference period maps → footprints → heights → "blank where unverified") maps onto Edo kiriezu; the "street-level tour then aerial" scale break; cast of named residents introduced on their block.

**2. Inside the Deadly Maui Inferno, Hour by Hour — The New York Times, 2023**
- Awards: Peabody (2025): "More than 400 videos ... are placed with pixel-perfect precision on a photorealistic 3-D map of the town, underpinning a gripping narrative" — [Peabody](https://peabodyawards.com/award-profile/inside-the-deadly-maui-inferno-hour-by-hour/); OJA 2024 Excellence in Visual Digital Storytelling, Large Newsroom — [OJA](https://awards.journalists.org/entries/inside-the-deadly-maui-inferno-hour-by-hour/)
- Interaction model: hour-by-hour time structure over a single 3-D map; evidence (video) pinned to place and time. — [OJA](https://awards.journalists.org/entries/inside-the-deadly-maui-inferno-hour-by-hour/)
- Borrowable: time-sliced single map as the spine; every source object (a print, a diary) pinned to a coordinate and an hour/year.

**3. The Chain of Failures That Left 17 Dead in a Bronx Apartment Fire — The New York Times, 2022**
- Award: OJA 2023 Excellence in Immersive and Emerging Technology Storytelling. Judges praised "3D modeling, video and audio transcripts combined with deeply reported yet concise investigative storytelling". Built with Fire Dynamics Simulator smoke simulation and an AR filter. — [OJA](https://awards.journalists.org/entries/the-chain-of-failures-that-left-17-dead-in-a-bronx-apartment-fire/)
- Borrowable: judges reward concision as much as spectacle; one building as the stage.

**4. Reconstructing Seven Days of Protests in Minneapolis — The Washington Post with The Pudding, 2020**
- Award: World Press Photo Digital Storytelling Contest 2021, Interactive of the Year; "combines and maps out 147 live stream videos". Credits: four Post staff plus Matt Daniels and Amelia Wattenberger of The Pudding. — [World Press Photo](https://www.worldpressphoto.org/collection/digital-storytelling-contest/2021/reconstructing-seven-days-of-protests-in-minne-(1)); [WaPo PR](https://www.washingtonpost.com/pr/2021/04/20/washington-posts-immersive-reconstruction-2020-minneapolis-protests-wins-world-press-photo-interactive-year-award/)
- Borrowable: a six-person newsroom+studio team is enough for an award-winning map-and-time reconstruction.

**5. Visualising the Hong Kong Protests — Reuters Graphics, 2019**
- Award: ONA 2020 Excellence and Innovation in Visual Digital Storytelling, Large Newsroom; included estimated crowd sizes and "the entirety of the march through a continuous time lapse". — [Online Journalism Blog](https://onlinejournalismblog.com/2020/12/16/striking-the-balance-between-graphic-design-and-data-journalism-design-is-a-conversation/)
- Team/stack: ~20 people across New York, London, Bangalore, Singapore; Adobe Illustrator, QGIS/ArcGIS for mapping, Cinema 4D for 3-D, D3.js for data viz; "For most of the pieces we do, there is a sad trail of trial and error." — [Design Week](https://www.designweek.co.uk/issues/27-january-2-february-2020/in-house-teams-how-reuters-graphics-visualises-catastrophic-world-events/)
- Craft: "We use a lot of annotations in our work, small blurbs and bits of text and arrows"; "the hardest decisions involve what to leave out"; "We try not to make our pieces online encyclopaedias for a topic." — [Nightingale](https://medium.com/nightingale/visualizing-coronavirus-impact-an-interview-with-the-reuters-graphics-team-373296bc6118)

**6. Life Inside the Forbidden City (series) — South China Morning Post, 2018–19; also The China Ship (2018)**
- Awards: Malofiej 2019 — Marcelo Duhalde bronze for the Forbidden City portfolio; Adolfo Arranz silver for "The China Ship" ("about the beginnings of globalisation"), after "several months researching and developing the various sections". — [SCMP](https://www.scmp.com/news/hong-kong/article/3004601/post-wins-eight-medals-prestigious-international-infographics-awards)
- Process/time: "The history of the Forbidden City series was almost two years in the making" (incl. travel to Beijing and Taipei); typical data viz "takes about a week"; team of 11 (five long-tail designers, five daily, one engineer); "Everything we do starts with research and a pencil and paper". — [IJNet](https://ijnet.org/en/story/design-meets-data-qa-scmps-creative-director-darren-long); the HKDI interview says Forbidden City "took us three years" and that "we leave the conclusion for the reader". — [Keith Tam interview](https://keithtam.net/private/61c9f33a5ace1)
- Visual language: hand-drawn illustration mixed with data; SCMP's shift to digital came when they "realized scrolling online meant more room to develop a narrative". — [IJNet](https://ijnet.org/en/story/design-meets-data-qa-scmps-creative-director-darren-long)
- Borrowable: an illustrated, chaptered palace/city history by a small team is the closest newsroom analogue to an Edo castle-town unit; Arranz's Kowloon Walled City "City of Anarchy" (Malofiej gold 2014, "a month to draw") shows the single dense cutaway as a form. — [SCMP](https://www.scmp.com/news/hong-kong/article/1461762/scmp-artist-adolfo-arranz-bags-gold-prizes-news-design-pulitzer)

**7. Finding Freedom — Museum of the American Revolution; Bluecadet (gallery, 2017), AREA 17 (web, Oct 2020)**
- Awards: Webby People's Voice Winner 2026 (Websites & Mobile Sites, DEI&B); MUSE bronze 2021; Anthem silver 2022; ~1.5 million pageviews. — [MoAR press release](https://www.amrevmuseum.org/press-releases/museum-of-the-american-revolution-wins-webby-award-for-finding-freedom-online-experience)
- Content structure: five real people of African descent in Virginia, 1781; "research-based first-person narratives" built from pension records, newspaper ads, period maps, court records; teacher resources include timelines, glossaries, primary sources. — [MoAR](https://www.amrevmuseum.org/press-releases/museum-of-the-american-revolution-wins-webby-award-for-finding-freedom-online-experience); [About Finding Freedom](https://www.amrevmuseum.org/about-finding-freedom)
- Visual/audio: watercolour illustrations by Wood Ronsaville Harlan; in 2025 the museum made it Section 508 compliant and added audio voiced by African American actors. — [MoAR](https://www.amrevmuseum.org/press-releases/museum-of-the-american-revolution-wins-webby-award-for-finding-freedom-online-experience)
- Process: planning began 2015; gallery touchscreen debuted 2017; a Bluecadet writer "worked alongside Museum staff members to craft the first-person narratives". — [About Finding Freedom](https://www.amrevmuseum.org/about-finding-freedom)
- Borrowable: the "cast of five" model (one portrait, one path, one set of decisions each) for Edo figures (e.g., a print publisher, a carver, a courtesan, a daimyo retainer, Hokusai's daughter Ōi); illustration in a single period-faithful medium; a sibling product for teachers.

**8. Persepolis Reimagined — Getty Villa Museum with Media.Monks, 2022**
- Awards: FWA of the Year and People's Choice of the Year; Webby Winner & People's Voice (Architecture, Art & Design); Awwwards Developer Site of the Year; Awwwards + FWA Site of the Month June 2022. — [LBB](https://lbbonline.com/news/mediamonks-and-getty-win-fwa-of-the-year-and-fwa-peoples-choice-award-of-the-year); [producer portfolio](https://www.katiepenna.com/getty-villa-persepolis); Awwwards SOTY list shows it under 2022 — [Awwwards](https://www.awwwards.com/websites/sites_of_the_year)
- Interaction model: scroll-driven fly-through on a fixed camera path ("We decided to work with a fixed camera path for this project to optimize the experience further"); seamless preloader where a night render morphs to day to match the first frame of a pre-rendered video, then chroma-keyed hand-off to real-time WebGL; same post effects (vignette, bloom, grain) across all scenes "to blend them together". — [Awwwards case study](https://www.awwwards.com/case-study-getty-persepolis-reimagined.html)
- Accuracy process: satellite data → World Creator → Clarisse; material style sheet agreed with Getty curators and Prof. Ali Mousavi; models retopologized from Persepolis3D. — [Awwwards case study](https://www.awwwards.com/case-study-getty-persepolis-reimagined.html)
- Audio: "The goal for music and sound design was to enhance, not to overrule"; authentic instruments (kemenche, duduk, ney, daf). — [Awwwards case study](https://www.awwwards.com/case-study-getty-persepolis-reimagined.html)
- Stack: Unity used as the scene/camera authoring tool exported to a custom JSON; WebGL 2.0 instancing, frustum culling, LOD. — [Awwwards case study](https://www.awwwards.com/case-study-getty-persepolis-reimagined.html)
- Borrowable: fixed camera path + scroll = deterministic, testable choreography; one post-processing look applied to every scene; narration/sound that supports.

**9. The Museum of the World — British Museum with Google Cultural Institute / Arts & Culture Lab, 2015 (relisted Feb 2020)**
- What: "an interactive experience through time, continents and cultures" where objects "are mapped to a timeline" and users "listen to British Museum curators share their insights"; "This WebGL experiment is for desktop only." — [Google Arts & Culture](https://artsandculture.google.com/experiment/the-museum-of-the-world/zgGAGPpSNAynjg?hl=en)
- Structure: timeline from ~2 million years ago to present, "split into 5 geographic tracks, further identified by color" (Africa yellow, Americas orange, Asia green, Europe blue, Oceania purple) and 5 themes. — [Internet Archaeology review](https://intarch.ac.uk/journal/issue44/13/index.html); launched Nov 2015 with 4,500 objects. — [Design Week](https://www.designweek.co.uk/issues/16-22-november-2015/british-museum-moves-its-collection-online-with-museum-of-the-world-timeline)
- Borrowable: colour-coded regional tracks on one timeline is exactly the device for "Edo Japan vs. the rest of the world at the same moment"; curator audio per object. Caution: desktop-only WebGL is now a liability.

**10. Beyond Scrolls & Screens — Google Arts & Culture Lab (Artist in Residence Christine Sugrue), Feb 2020**
- Machine learning finds visually similar details across Japanese screens and scrolls "some that are 600 years apart", captured with Art Camera from Tokyo National Museum, Tokyo Fuji Art Museum, Tachibana Museum, "including one scroll that's 12 meters in length". — [Experiments with Google](https://experiments.withgoogle.com/beyondscrolls)
- Borrowable: detail-to-detail "journey of similarity" as a browse mode for ukiyo-e motifs (waves, Fuji, rain).

**11. Hiroshige's One Hundred Famous Views of Edo — Brooklyn Museum on Google Arts & Culture (undated story)**
- Long-form curatorial text with each of the 118 prints; frames meisho as "a place with a name" with seasonal associations; notes one print "cost the same as a bowl of noodles". — [Google Arts & Culture](https://artsandculture.google.com/story/hiroshige-s-one-hundred-famous-views-of-edo-brooklyn-museum/pgWRwzk-PQcA8A?hl=en)
- Related: Google's "Zoom Into 'The Great Wave'" deep-zoom story (LACMA impression) — [Google Arts & Culture](https://artsandculture.google.com/story/zoom-into-the-great-wave/BwWxIlGd8SIdLg?hl=en); British Museum's online "The Great Wave: spot the difference" comparing impressions — [British Museum](https://www.britishmuseum.org/exhibitions/hokusai-great-picture-book-everything)
- Borrowable: authoritative public-domain text and a complete set; the "spot the difference between impressions" device for teaching woodblock printing.

**12. Ukiyo-e Map (OpenStreetMap-based), 2019**
- Plots "over 200 of Hiroshige's prints on a map of Japan"; covers One Hundred Famous Views of Edo, Sixty-odd Provinces, Fifty-three Stations of the Tōkaidō; clicking a dot reveals the print. — [All About Japan](https://allabout-japan.com/en/article/7875); also covered by [Spoon & Tamago](https://spoon-tamago.com/ukiyoe-interactive-map) and [Maps Mania](https://googlemapsmania.blogspot.com/2019/01/one-hundred-views-of-edo.html)
- Coordinates for every print in the series are tabulated on Wikipedia with KML/GPX export (e.g., No. 58 Ōhashi 35.68528°N 139.79306°E). — [Wikipedia](https://en.wikipedia.org/wiki/One_Hundred_Famous_Views_of_Edo); Henry Smith's print-location map is at [Columbia](https://www.columbia.edu/~hds2/edocult/mehmap.html)
- Borrowable: a ready geocoded dataset for a print-to-place map layer.

**13. Rekichizu (れきちず) — Sō Katō / chizutodesign, now MIERUNE Inc., Aug 2023–**
- What: "Modern-style historical web map", i.e. an Edo-period (c.1800–1840) Japan drawn in Google-Maps-like design language; awards: AMD Award '23 Enami Naomi Prize (newcomer) and 2024 Digital Archive Industry Award (encouragement prize); 20k+ likes; TV coverage. — [chizutodesign](https://chizutodesign.com/rekichizu)
- Stack/process: data hand-built in QGIS from Edo maps, Meiji maps and modern maps; rendered with MapLibre; original icons; avoided commercial basemaps for copyright reasons. — [YouTube talk transcript](https://www.youtube.com/watch?v=XBjOTQfo4PE); nationwide coverage from April 2025 — [ITmedia](https://www.itmedia.co.jp/news/article/2504/09/1250409132); overlay/compare with modern map, split and circle-reveal modes — [INFO DESIGN note](https://note.com/inininindesign/n/n616517ea5d18); GIS dataset downloadable; uses CODH place-name and coastline datasets. — [rekichizu.jp](https://rekichizu.jp)
- Sibling (Aug 2026): "Edo-period route search" — walk/horse/palanquin/courier modes, Edo→Kyoto 14 days via Tōkaidō; built on CODH's 47-highway dataset; coastline rendered by distance-from-coast shading to imitate Inō maps; hosting on Cloudflare Workers exceeded the free 100k-requests/day tier (200k in 1.5 days) costing US$5.50. — [chizutodesign note](https://note.com/chizutodesign/n/neee5116b95b4)
- Borrowable: the single most reusable asset — an open-licence-friendly MapLibre Edo basemap built by essentially one designer; design decision to make history legible to non-experts by using the modern map idiom.

**14. Edo Maps β (江戸マップβ版) — ROIS-DS Center for Open Data in the Humanities (CODH), 2019**
- Place-name database built from Edo kiriezu; image markers over old maps let "the IIIF viewer be used like a map app"; place-name search added Dec 2019. — [CODH](https://codh.rois.ac.jp/edo-maps); [NDL Current Awareness](https://current.ndl.go.jp/car/39896); the IIIF Curation Viewer 1.7 marker feature was used to annotate an 1855 Ansei earthquake fire map. — [ERI Tokyo](https://www.eri.u-tokyo.ac.jp/people/ykano/edo-saigai-maps)
- Borrowable: IIIF-hosted period maps (NDL etc.) plus marker annotation — zero-cost deep zoom of Edo maps.

**15. ARC Japanese Prints (Ukiyo-e) and Paintings Portal Database — Ritsumeikan University Art Research Center (since 1999)**
- Cross-collection research search of ukiyo-e published on the web, with image-based "hand-held image search" and a smartphone-friendly interface. — [ARC portal](https://www.dh-jac.net/db/nishikie/search_portal.php?lang=en); Ritsumeikan's "Edo Period Map goes Digital – The O Edo ezu as an Interactive Resource" (Goethe University Frankfurt, M. Kinski) presented at ARC Day 2020. — [ARC](https://www.arc.ritsumei.ac.jp/e/news/pc/006280.html)
- Related: Ukiyo-e.org (John Resig) — search by uploading a photo and see similar prints across collections. — [ukiyo-e.org](https://ukiyo-e.org/)
- Borrowable: source-of-truth catalogues for footnotes/object pages; not narrative models.

**16. Histography — Matan Stauber, 2015**
- Information is Beautiful Awards 2015, Bronze (Interactive Visualization); timeline "spans across 14 billion years", draws events from Wikipedia, self-updates daily; scale "between decades to millions of years". — [IIB Awards](https://www.informationisbeautifulawards.com/showcase/771-histography)
- Borrowable: continuous zoomable scale with event-dot density; Wikipedia as a live source.

**17. Chronas — interactive historical map (community/open project)**
- WebGL map with a timeline from 500 BCE to 2000, era labels (Ancient … Modern), "Expand Timeline", "Search Epics", "Start Autoplay". — [chronas.org](https://chronas.org/)
- Borrowable: era bands under the scrubber; autoplay as a guided mode. (Awards: none found.)

**18. American Panorama — University of Richmond Digital Scholarship Lab with Stamen, Dec 2015–**
- "an historical atlas of the United States for the twenty-first century"; first maps: Forced Migration of Enslaved People, Overland Trails, Foreign-Born Population, Canals; later Mapping Inequality (redlining, 1935–40); $750,000 Mellon grant; "That software is being released open source". — [U. Richmond news](https://news.richmond.edu/releases/article/-/13140/university-of-richmond-digital-scholarship-lab-releases-new-maps-as-part-of-american-panorama-historical-atlas-project.html); [dsl.richmond.edu/panorama](https://dsl.richmond.edu/panorama); Stamen: a year of collaboration, software on GitHub. — [Stamen](https://stamen.com/american-panorama-a-next-generation-atlas-for-the-digital-scholarship-lab-99deceb6b496/)
- Borrowable: the scholarly map-essay pattern (map + timeline scrubber + sidebar text + "open up the text to read more about the sources"). — [DSL Atlas](https://dsl.richmond.edu/historicalatlas)

**19. Allmaps — IIIF map georeferencing (open source)**
- "The core components of Allmaps are open source"; plugins for MapLibre, OpenLayers and Leaflet display georeferenced maps "without using infrastructure provided by Allmaps". — [allmaps.org](https://allmaps.org/)
- Borrowable: georeference NDL/Tokyo Metropolitan Library Edo maps and warp them live under a MapLibre basemap.

**20. Smithsonian Voyager — Smithsonian Digitization Program Office (open source)**
- "Open source 3D explorer and authoring tool suite"; Voyager Explorer is a web component; Voyager Story authors "annotations, articles, tours". — [Voyager docs](https://smithsonian.github.io/dpo-voyager); [3d.si.edu open source](https://3d.si.edu/open-source-resources); many Smithsonian models are CC0 — [YouTube how-to](https://www.youtube.com/watch?v=SzycjyHeSvQ)
- Borrowable: annotated 3-D object tours (e.g., a scanned woodblock, baren, netsuke) with zero licence cost.

**21. Knight Lab TimelineJS / StoryMapJS — Northwestern University**
- TimelineJS3 is MPL-2.0 licensed on GitHub (3.2k stars). — [GitHub](https://github.com/NUKnightLab/TImelineJS3); StoryMapJS is "a free tool ... highlight the locations of a series of events"; can be used without Google by editing a config file and self-hosting assets. — [StoryMapJS](https://storymap.knightlab.com)
- Borrowable: fastest route to a working map-story prototype for storyboarding before custom build.

**22. The Boat — SBS Australia, artist Matt Huynh, writer Nam Le, 2015**
- Interactive graphic novel for the 40th anniversary of the fall of Saigon, uniting "hand drawn artwork, animation, text, sound and archive". — [Screendiver](https://screendiver.com/directory/the-boat-interactive-graphic-novel-matt-huynh); honours: Webby nominee (Best Individual Editorial Experience), World Illustration Award 2016 winner, UNAA Media Peace special commendation; team credits list a writer, artist, producer, one designer/developer and a sound designer. — [Matt Huynh](https://www.matthuynh.com/stories/theboat-9rw43); art informed by "sumi-e painting and shodo calligraphy". — [Screendiver](https://screendiver.com/directory/the-boat-interactive-graphic-novel-matt-huynh)
- Borrowable: ink-wash visual language is period-appropriate for Edo; five-person team.

**23. Bartosz Ciechanowski's explorable explanations (ciechanow.ski), 2019–**
- Method: every article "opens with a working model and an instruction to touch it" (e.g., Mechanical Watch: drag to change viewing angle, slider to peek inside); explanations ramp "from simple to real"; he states when the model lies; animations can be globally paused "if you want to save power"; units switch imperial/metric; copy swaps "click"/"tap"; Patreon listed 543 paid members (Aug 2026). — [learn-ui.com](https://learn-ui.com/chapters/explaining/explorable-explanations); primary example — [Mechanical Watch](https://ciechanow.ski/mechanical-watch/)
- Cadence: "publishes roughly once a year"; one person does research, simulation, interaction design and prose. — [Cool People Stories](https://www.coolpeoplestories.com/bartosz-ciechanowski-interactive)
- Borrowable: one working model per idea, introduced before the text; the woodblock-printing process (key block, colour blocks, registration marks) is a natural explorable.

**24. Museums + Heritage Awards digital winners (context)**
- 2024 Best Use of Digital – UK: Mary Rose Trust "Dive 4D"; International: MOTAT "Stories from the skies: Te Kōtiu"; shortlist incl. Histovery's Notre-Dame augmented exhibition and V&A "mused". — [M+H 2024 winners](https://awards.museumsandheritage.com/awards/2024-winners); 2023 UK: StoryFutures "StoryTrails", highly commended Barnsley "Elsecar 1880: A Village Re-Imagined". — [M+H 2023](https://awards.museumsandheritage.com/awards/2023-winners/best-use-of-digital-uk-23)
- Note: these winners are largely in-gallery/AR, so less directly transferable to a web course unit.

**25. The Pudding (publication-level exemplar for method)**
- Pieces take "anywhere from a couple of days to a couple of months"; founded 2017 by four people; stories are "usually sparse on words"; story shapes must have "variety ... and there was change as the story progressed". — [Storybench](https://www.storybench.org/pudding-structures-stories-visual-essays/)
- Open-source scrollytelling scaffolds: position: sticky + enter-view.js; scrollama uses IntersectionObserver. — [Pudding sticky](https://pudding.cool/process/scrollytelling-sticky/); [Pudding libraries](https://pudding.cool/process/how-to-implement-scrollytelling/)

### Inferences
- The awards most relevant to this unit are OJA/ONA, World Press Photo Digital Storytelling, Peabody (for newsroom reconstructions); FWA/Awwwards/Webby (for museum microsites); IIB Awards (for timelines/atlases); Malofiej/SND (for illustrated history explainers). Judges' language clusters around interactivity-as-comprehension, concision, and visible research rigour.
- Nothing in the award set is a pure "map + timeline + narrative" course; the closest composites are American Panorama (map-essay with scrubber), Museum of the World (timeline with regional tracks + audio), and NYT Tulsa (map/3-D with cast). The Edo unit would be novel in combining them, with Rekichizu/CODH/Ukiyo-e Map providing Japan-specific data.

### Gaps
- No evidence found that Museum of the World, Chronas, Rekichizu (beyond AMD/Digital Archive awards) or the Ukiyo-e Map won Webby/Awwwards/FWA.
- I found no dedicated online interactive for the British Museum's 2017 "Hokusai: beyond the Great Wave" (only the touring-exhibition page and 2021 "spot the difference"); no Edo-Tokyo Museum digital Edo map; no MFA Boston Hokusai interactive. [British Museum touring page](https://www.britishmuseum.org/our-work/international/international-touring-exhibitions/beyond-great-wave-works-hokusai-british-museum); [MFA](https://www.mfa.org/exhibition/hokusai-inspiration-and-influence)
- Not researched for lack of budget: Rijksmuseum, V&A, Louvre, Van Gogh Museum, Met digital projects; Bellingcat/Forensic Architecture; Running Reality; OldMapsOnline specifics; Awwwards SOTY 2018 Frans Hals Museum (listed in [Awwwards SOTY](https://www.awwwards.com/websites/sites_of_the_year) but not examined).

---

## Key Question 2 — How do the best couple a map and a timeline to narrative without the reader losing the thread?

### Takeaway
Award-level pieces hold ONE instrument (map, 3-D scene or timeline) fixed on screen while short text steps change its state; time is either a single ordered spine (hour-by-hour, era bands) or a scrubber; space is traversed on a pre-authored camera path; scale breaks are explicit (block → neighbourhood; decade → millennium); and the reader can always scroll back and get the previous state.

### Cited Findings
- Scrollytelling definition and discipline: "A sticky graphic ... A sequence of steps ... And a trigger, which watches the steps and reports which one currently occupies a chosen line across the viewport, usually somewhere around the middle." And: "A story that cannot be read backwards has a bug, not a style." — [vocab.design](https://vocab.design/scrollytelling)
- Google's scrollytell library formalises a "guideline" as "An invisible line stretched horizontally over the middle of the container" and a progress value 0–1 within the active panel for continuous (scrubbed) animation; progressHandler "only does work when the scroll position changes" to save mobile power. — [google/scrollytell](https://github.com/google/scrollytell/)
- The Pudding's Waypoints demo: step 1 "triggers in the middle of the viewport ... the same as the initial state so the reader doesn't miss anything"; graphic "snapping back into place" when steps end. — [Pudding demo](https://pudding.cool/process/how-to-implement-scrollytelling/demo/waypoints)
- Persepolis: fixed camera path chosen deliberately; scrolling reveals the city "as we fly towards the Gate of All Nations". — [Awwwards case study](https://www.awwwards.com/case-study-getty-persepolis-reimagined.html)
- Tulsa: street-level tour of 70+ businesses then aerial of 35 blocks (scale break). — [OJA](https://awards.journalists.org/entries/what-the-1921-tulsa-race-massacre-destroyed/)
- Maui: hour-by-hour time structure on a single map with 400+ videos pinned. — [Peabody](https://peabodyawards.com/award-profile/inside-the-deadly-maui-inferno-hour-by-hour/)
- Museum of the World: one timeline, five colour-coded geographic tracks and five themes; objects as dots. — [Internet Archaeology](https://intarch.ac.uk/journal/issue44/13/index.html)
- Chronas: era bands (Ancient, Classical, … Modern) beneath a scrubber; autoplay; "Expand Timeline". — [chronas.org](https://chronas.org/)
- Rekichizu: overlay and compare with the modern map; split-screen and circle-reveal comparison modes. — [INFO DESIGN](https://note.com/inininindesign/n/n616517ea5d18)
- SCMP's realisation that scrolling "meant more room to develop a narrative" (Lightning in Hong Kong; Belt and Road). — [IJNet](https://ijnet.org/en/story/design-meets-data-qa-scmps-creative-director-darren-long)
- Pudding on when to keep scroll on mobile: preserve it "if the transitions are truly meaningful ... Seeing change over time or spatial movement are some good justifications"; otherwise stack. — [Pudding responsive](https://pudding.cool/process/responsive-scrollytelling/)

### Inferences
- A map+timeline course should pick one "stage" per chapter (either the map or the timeline is sticky; the other becomes a compact indicator/minimap), because no exemplar found keeps two full instruments live at once.
- Time should be the ordering spine of the course (as in Maui/Museum of the World), with the map fly-to triggered by each step; a global era band (Keichō → Genroku → Kyōhō → Bunka-Bunsei → Bakumatsu) plays the Chronas/MoW role.
- Scale breaks must be announced as their own step (a "zoom-out" beat), as Tulsa does from block to neighbourhood.

### Gaps
- No exemplar documented its event density (events per screen on a timeline) or fly-to durations; those appear below as inferred rules, not cited facts.

---

## Key Question 3 — How do they handle people (portraits/cast), objects (deep zoom, IIIF, 3-D) and sources/footnotes?

### Takeaway
People are introduced as a small named cast anchored to a place (Tulsa's block owners; Finding Freedom's five Virginians) in a single illustration style; objects are shown through deep zoom (Google Art Camera / IIIF) or annotated 3-D tours (Voyager); sources are surfaced as visible research (released datasets, "open up the text to read more about the sources") and honest absence ("left the buildings blank").

### Cited Findings
- Cast of five with first-person narratives built from "pension records to newspaper ads, period maps and broadsides, surviving objects, works of art, court records"; watercolour illustration throughout; audio voices added 2025. — [MoAR](https://www.amrevmuseum.org/press-releases/museum-of-the-american-revolution-wins-webby-award-for-finding-freedom-online-experience)
- Tulsa introduces "the movers and shakers on the block — the successful Black women and men who ran doctor's offices, billiard halls, barber shops and hotels". — [OJA](https://awards.journalists.org/entries/what-the-1921-tulsa-race-massacre-destroyed/); residents geolocated from 1920 census and the 1921 city directory via OCR of the "(c)" marker. — [NYT Open](https://medium.com/timesopen/how-we-reconstructed-the-neighborhood-destroyed-by-the-tulsa-race-massacre-33fcf32dd086)
- Objects/deep zoom: Google Art Camera captures incl. a 12 m scroll; ML links details 600 years apart. — [Experiments with Google](https://experiments.withgoogle.com/beyondscrolls); "Zoom Into 'The Great Wave'". — [Google Arts & Culture](https://artsandculture.google.com/story/zoom-into-the-great-wave/BwWxIlGd8SIdLg?hl=en)
- IIIF as the object substrate: CODH's IIIF Curation Viewer puts markers on kiriezu; "you don't need the high-resolution image on your own machine to annotate it" (paraphrase). — [ERI Tokyo](https://www.eri.u-tokyo.ac.jp/people/ykano/edo-saigai-maps); OpenSeadragon is the standard open deep-zoom viewer, "smooth, continuous zooming and panning", IIIF-compatible. — [Duke Libraries](https://blogs.library.duke.edu/bitstreams/2015/11/20/zoomable-hi-res-images-hopping-aboard-the-openseadragon-bandwagon)
- 3-D objects: Voyager Story authors annotations, articles and tours over CC0 models. — [Voyager docs](https://smithsonian.github.io/dpo-voyager)
- Bluecadet's "Arms of Independence": 208,000 motion-control photos let visitors rotate and zoom 46 weapons and tap "learn more" for the personal story — a 2.5-D object viewer without 3-D modelling. — [Keystone Edge](https://keystoneedge.com/2017/06/01/museum-of-the-american-revolution-museum-technology/)
- Sources: Tulsa released model, map files and data set; "we left the buildings blank" where unverified. — [NYT Open](https://medium.com/timesopen/how-we-reconstructed-the-neighborhood-destroyed-by-the-tulsa-race-massacre-33fcf32dd086); Richmond atlas: "open up the text to read more about the sources on which it was based". — [DSL Atlas](https://dsl.richmond.edu/historicalatlas); Rekichizu publishes a full bibliography by prefecture on its site. — [rekichizu.jp](https://rekichizu.jp); Persepolis credits curators and a named professor for material accuracy. — [Awwwards case study](https://www.awwwards.com/case-study-getty-persepolis-reimagined.html)
- Reuters: "All of our sourcing must be airtight. A visualisation is only as good as the data it is based on." — [Nightingale](https://medium.com/nightingale/visualizing-coronavirus-impact-an-interview-with-the-reuters-graphics-team-373296bc6118)

### Inferences
- Portraits for Edo figures should come from period prints/paintings (ukiyo-e actor/beauty prints, memorial portraits) rendered consistently (same crop, same frame treatment) rather than mixed modern illustration — the exemplars never mix illustration idioms within a piece.
- Each object page in the unit should be an IIIF/OpenSeadragon deep zoom with 2–4 hotspots, plus a visible "source and impression" line (museum, accession number, edition), echoing the BM "spot the difference" and Tulsa's verification ethic.

### Gaps
- No exemplar documented a specific portrait-card spec (size, metadata fields); no source found on how Persepolis or MoW format footnotes on-screen.

---

## Key Question 4 — Specific craft details (motion timing, type scale, colour on dark vs light, caption discipline, audio) cited by awards or makers

### Takeaway
Makers rarely publish numeric type scales, but they do publish operational rules: trigger at mid-viewport, compute heights in px not vh, remove hover on touch, make each step's state explicit, keep steps short, apply one post-process look across scenes, let sound support not lead, honour reduced-motion/pause, and keep text under ~100 words per step with the text column ≤ one-third to one-half of width.

### Cited Findings
- Pudding (Samora): "don't use vh for scrollytelling" because mobile navbars change viewport height — use px from window.innerHeight; use matchMedia to sync CSS and JS breakpoints; remove hover and "replace with some fixed text or annotation"; "I err on the side of short and sweet. A few steps to grab the user and make your point." — [Pudding responsive](https://pudding.cool/process/responsive-scrollytelling/)
- Pudding (part 3): be "highly explicit about the state of your visuals at each step in your code" since readers scroll fast; scrollytelling "take[s] longer than you're used to"; the step-by-step tap format "ensures brevity in your writing (you can only fit so much on a mobile screen)". — [Pudding part 3](https://pudding.cool/process/how-to-make-dope-shit-part-3/)
- Pudding sticky: position: sticky offloads the stuck state to CSS; "built-in graceful degradation". — [Pudding sticky](https://pudding.cool/process/scrollytelling-sticky/)
- Pudding typography (from its public template): headlines Canela, copy Publico Text, graphics/captions Atlas; fonts loaded async with FOUT. — [GitHub template](https://github.com/the-pudding/responsive-scrollytelling)
- Word budget: an academic scrolly-story tool advises "try to keep your text under 100 words per step", text panel default 33% of width, "stay under 50%", images ≥1200 px. — [IRIS SIUE tutorial](https://iris.siue.edu/scrolly-story-generator-tutorial/)
- Accessibility: under prefers-reduced-motion "the transitions between states go away and the states remain"; each step should carry text of what the graphic shows for screen readers. — [vocab.design](https://vocab.design/scrollytelling); Ciechanowski offers a global animation pause and click/tap copy swap. — [learn-ui.com](https://learn-ui.com/chapters/explaining/explorable-explanations)
- Motion/colour continuity: Persepolis applied identical vignette, bloom and grain to preloader, video, map and citadel; preloader morphs night→day to match the video's first frame. — [Awwwards case study](https://www.awwwards.com/case-study-getty-persepolis-reimagined.html)
- Audio: Persepolis — "enhance, not to overrule", authentic regional instruments, motifs per location. — [Awwwards case study](https://www.awwwards.com/case-study-getty-persepolis-reimagined.html); Museum of the World — curators' audio insights per object. — [Google Arts & Culture](https://artsandculture.google.com/experiment/the-museum-of-the-world/zgGAGPpSNAynjg?hl=en); Finding Freedom — voiced narratives added for accessibility. — [MoAR](https://www.amrevmuseum.org/press-releases/museum-of-the-american-revolution-wins-webby-award-for-finding-freedom-online-experience)
- Captions/annotation: Reuters — "small blurbs and bits of text and arrows to point out aspects"; "Sometimes a simple trend can be described in a sentence rather than a chart." — [Nightingale](https://medium.com/nightingale/visualizing-coronavirus-impact-an-interview-with-the-reuters-graphics-team-373296bc6118)
- Colour as structure: Museum of the World uses five hues for five continents. — [Internet Archaeology](https://intarch.ac.uk/journal/issue44/13/index.html); Rekichizu uses the modern-map colour idiom plus original period icons; coastline "bleed" computed from distance to coast to imitate hand-drawn Inō maps; a washi paper texture was tried and rejected as it looked like a degraded LCD. — [chizutodesign note](https://note.com/chizutodesign/n/neee5116b95b4)
- Period-faithful illustration: The Boat's sumi-e/shodō-informed ink; Finding Freedom's watercolour. — [Screendiver](https://screendiver.com/directory/the-boat-interactive-graphic-novel-matt-huynh); [MoAR](https://www.amrevmuseum.org/press-releases/museum-of-the-american-revolution-wins-webby-award-for-finding-freedom-online-experience)
- Pacing/shape: Pudding stories need "variety in their shape ... change as the story progressed — it wasn't just a flat line". — [Storybench](https://www.storybench.org/pudding-structures-stories-visual-essays/)

### Inferences
- No award write-up gave millisecond timings; the field convention (inferred from the fixed-camera-path and "snap back" descriptions) is deterministic, scroll-linked motion rather than timed animation, so the measurable rule becomes "every transition is a function of scroll progress 0–1 within the step".
- Light vs dark: museum WebGL pieces (Persepolis, MoW) use dark stages for 3-D/time; scholarly atlases (American Panorama, Rekichizu) use light map canvases. For ukiyo-e, a light/paper-toned canvas keeps prints' colours true; dark should be reserved for the world-timeline instrument.

### Gaps
- No source gave type sizes, line lengths or contrast ratios for any winning piece; no source gave fly-to durations.

---

## Key Question 5 — What did makers say about process, team size and time?

### Takeaway
Award-level history interactives were made by teams of 2–11 core people over weeks to three years; the constant is research-first, pencil storyboards, trial-and-error versions, and ruthless cutting.

### Cited Findings
- SCMP: team of 11 (5 long-tail, 5 daily, 1 engineer); Forbidden City "almost two years"; typical dataviz "about a week"; "Everything we do starts with research and a pencil and paper". — [IJNet](https://ijnet.org/en/story/design-meets-data-qa-scmps-creative-director-darren-long); earlier the group was "only six people". — [Nightingale](https://nightingaledvs.com/on-the-success-of-the-south-china-morning-post-infographics-team/); "until we get to version 20 we are not close to publishing" (Reuters' Marco Hernandez). — [Online Journalism Blog](https://onlinejournalismblog.com/2020/12/16/striking-the-balance-between-graphic-design-and-data-journalism-design-is-a-conversation/)
- Reuters: ~20 people across four cities; D3, QGIS/ArcGIS, Illustrator, Cinema 4D. — [Design Week](https://www.designweek.co.uk/issues/27-january-2-february-2020/in-house-teams-how-reuters-graphics-visualises-catastrophic-world-events/)
- NYT Tulsa: ~8 named contributors; months with archivists; ML + manual modelling. — [NYT Open](https://medium.com/timesopen/how-we-reconstructed-the-neighborhood-destroyed-by-the-tulsa-race-massacre-33fcf32dd086)
- WaPo/Pudding Minneapolis: six credited makers. — [World Press Photo](https://www.worldpressphoto.org/collection/digital-storytelling-contest/2021/reconstructing-seven-days-of-protests-in-minne-(1))
- The Pudding: four founders; pieces take "a couple of days to a couple of months". — [Storybench](https://www.storybench.org/pudding-structures-stories-visual-essays/)
- Finding Freedom: 2015 start → 2017 gallery → 2020 web → 2025 accessibility/audio upgrade. — [About Finding Freedom](https://www.amrevmuseum.org/about-finding-freedom); [MoAR](https://www.amrevmuseum.org/press-releases/museum-of-the-american-revolution-wins-webby-award-for-finding-freedom-online-experience)
- The Boat: five credited roles. — [Matt Huynh](https://www.matthuynh.com/stories/theboat-9rw43)
- Rekichizu: one graphic designer (later company project) with QGIS + MapLibre; hosting cost US$5.50 after 200k requests. — [YouTube talk](https://www.youtube.com/watch?v=XBjOTQfo4PE); [chizutodesign note](https://note.com/chizutodesign/n/neee5116b95b4)
- Ciechanowski: one person, ~1 article/year. — [Cool People Stories](https://www.coolpeoplestories.com/bartosz-ciechanowski-interactive)
- American Panorama: DSL + Stamen, one year, $750k Mellon. — [U. Richmond](https://news.richmond.edu/releases/article/-/13140/university-of-richmond-digital-scholarship-lab-releases-new-maps-as-part-of-american-panorama-historical-atlas-project.html)

### Inferences
- A 3–5 person team should budget 2–4 months for a 6–8 chapter unit if it reuses open basemaps/data (Rekichizu-style) and limits itself to one custom instrument per chapter; bespoke 3-D reconstructions (Tulsa/Persepolis) are out of reach without a specialist.

### Gaps
- Persepolis team size and duration were not stated in the case study; Google Arts & Culture Lab staffing not found.

---

## Synthesis — Patterns that separate award-level work from ordinary explainers, and measurable design rules for the Edo unit

### Takeaway
Award-level work (a) makes one instrument the stage and changes it per short step, (b) shows its research (sources, honest blanks), (c) uses a single period-faithful visual idiom and one continuous motion/colour grade, (d) introduces a small named cast anchored to place and time, (e) degrades gracefully on mobile and under reduced motion, and (f) is built by a small, research-first team that cuts hard. All of it is reproducible with open tooling: MapLibre + Allmaps for maps, OpenSeadragon/IIIF for objects, Voyager/model-viewer for 3-D, scrollama/IntersectionObserver or CSS scroll-driven animation for choreography, and GSAP (now free) if JS tweening is needed.

### Cited Findings (stack and licences)
- GSAP is "100% free to all users — Webflow customer or not", including formerly paid Club plugins, with the standard licence expanded to commercial use (announced 30 Apr 2025). — [Webflow update](https://webflow.com/updates/gsap-becomes-free); [Webflow help](https://help.webflow.com/hc/en-us/articles/40538857574419-Use-GSAP-in-Webflow). Caveat: the new licence prohibits use in tools that let users create animations without code or compete with Webflow — irrelevant to a course site but worth knowing. — [Blocs forum](https://forum.blocsapp.com/t/gsap-is-now-100-free/25872)
- CSS scroll-driven animations: MDN marks animation-timeline / scroll() / view() as "Limited availability ... not Baseline". — [MDN animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline); one 2026 blog puts support at ~82.6% with Firefox stable behind a flag and recommends shipping as progressive enhancement. — [ZKO World](https://zko.world/blog/css-scroll-driven-animations-progressive-enhancement-quick-take); another 2026 blog claims Firefox 142 fully supports it and that it is "Baseline Newly Available" — these sources conflict; MDN's "not Baseline" is the authoritative one at time of research. — [Pravin Kumar](https://www.pravinkumar.co/blog/replaced-gsap-css-scroll-driven-webflow-sites-2026)
- OpenSeadragon: "released under the New BSD license"; works with IIIF and DZI. — [OpenSeadragon](https://openseadragon.github.io)
- MapLibre GL: BSD-3-Clause lineage (from mapbox-gl-js ≤1.13). — [Oracle licence page](https://docs.oracle.com/en/industries/communications/intelligent-orchestration/license/maplibre-contributors-maplibre-gl.html); Allmaps ships MapLibre/OpenLayers/Leaflet plugins. — [allmaps.org](https://allmaps.org/); deck.gl interleaves with MapLibre for 3-D layers. — [deck.gl](https://deck.gl)
- TimelineJS3: MPL-2.0. — [GitHub](https://github.com/NUKnightLab/TImelineJS3). Smithsonian Voyager: open source. — [Voyager docs](https://smithsonian.github.io/dpo-voyager). American Panorama mapping software: open source on GitHub. — [Stamen](https://stamen.com/american-panorama-a-next-generation-atlas-for-the-digital-scholarship-lab-99deceb6b496/). NYT Tulsa model/data: released publicly. — [NYT Open](https://medium.com/timesopen/how-we-reconstructed-the-neighborhood-destroyed-by-the-tulsa-race-massacre-33fcf32dd086)
- Open Edo data: CODH Edo Maps place-name dataset and late-Edo coastline dataset; CODH 47-highway dataset; Rekichizu GIS download. — [rekichizu.jp](https://rekichizu.jp); [chizutodesign note](https://note.com/chizutodesign/n/neee5116b95b4); Hiroshige print coordinates (KML/GPX). — [Wikipedia](https://en.wikipedia.org/wiki/One_Hundred_Famous_Views_of_Edo); Smithsonian CC0 3-D models. — [YouTube](https://www.youtube.com/watch?v=SzycjyHeSvQ)
- Scroll scaffolds: Pudding's position: sticky + enter-view; scrollama (IntersectionObserver); Google scrollytell (guideline + progress 0–1). — [Pudding sticky](https://pudding.cool/process/scrollytelling-sticky/); [Pudding libraries](https://pudding.cool/process/how-to-implement-scrollytelling/); [google/scrollytell](https://github.com/google/scrollytell/)

### Inferences — concrete, measurable design rules (each anchored to the exemplars above)
1. **One stage per chapter.** Pin exactly one instrument (map, timeline, or object) with position: sticky; the other instruments shrink to an indicator (≤ 15% of viewport). (Pudding sticky; vocab.design; no exemplar runs two full instruments.)
2. **Beat length ≤ 100 words; target 40–70.** Text panel 33% of width on desktop, never > 50%. (IRIS tutorial; Pudding "short and sweet"; Reuters "a sentence rather than a chart".)
3. **One visual change per beat, stated in the text.** Each step must set its full state explicitly (no reliance on prior animations); two consecutive beats may not show the same state. (Pudding part 3; vocab.design.)
4. **Trigger line at 50% viewport; scrub value 0–1 inside a beat for continuous moves (fly-to, time-lapse).** (google/scrollytell; Pudding Waypoints demo.)
5. **Reversibility test:** scrolling up must restore every prior state; QA by reading the chapter backwards. (vocab.design.)
6. **Map ↔ text coupling:** each beat carries {lat, lon, zoom, bearing, year} metadata; the map flies to it; a scale break (city → Japan → world) is its own beat with its own sentence. (Tulsa block → neighbourhood; Maui hour-by-hour.)
7. **Timeline ↔ text coupling:** a single horizontal era band (Keichō … Bakumatsu) with colour-coded tracks for Japan / China-Korea / Europe-Americas, dots for events, the current beat's year highlighted; cap visible events at roughly one per 60–80 px of track to avoid MoW-style dot clutter. (Museum of the World tracks; Histography scale zoom; Chronas era bands — density figure is an inference.)
8. **Cast of 5–7 named people**, each introduced with a period portrait (print/painting), a one-line role, a place pin and a year; use first-person or quoted primary sources where available; one illustration idiom across the whole unit. (Finding Freedom; Tulsa; The Boat.)
9. **Objects as IIIF deep zooms with 2–4 hotspots and a provenance line** (museum, accession no., impression/edition); add a "compare impressions" slider where two impressions exist. (BM spot-the-difference; Beyond Scrolls & Screens; OpenSeadragon.)
10. **Show the research:** a sources drawer per chapter; a public data/GeoJSON download; render unverified geometry/positions as outlines or omit them. (Tulsa "left blank"; Richmond "read more about the sources"; Rekichizu bibliography.)
11. **One grade, one motion curve:** the same colour grade/post-process on every scene; transitions are scroll-linked rather than timed; if timed, ≤ 600 ms and no autoplay longer than a beat. (Persepolis unified post-effects; fixed camera path — the ms figure is an inference.)
12. **Audio that supports:** optional narration per beat and a single ambient layer using period instruments (shamisen, shakuhachi, koto); never autoplay with sound; captions for all narration. (Persepolis; MoW curator audio; Finding Freedom voicing + 508.)
13. **Mobile plan decided per chapter:** keep scroll only where the transition shows change over time or spatial movement; otherwise stack figure + text; compute heights in px from innerHeight; no hover-only information. (Pudding responsive.)
14. **Reduced motion and pause:** states persist with transitions removed; a global "pause animations" control; each beat's text describes what the graphic shows. (vocab.design; Ciechanowski.)
15. **Explorable for process:** one draggable model (colour-block registration / print sequence) introduced before its prose, ramping from one block to full key-plus-colour printing, with a note on what the model simplifies. (Ciechanowski method.)
16. **Shape the arc:** storyboard the unit so the stage visibly changes shape across chapters (city → road → sea → world → back to a single print); avoid a flat sequence of same-size maps. (Pudding "variety in shape".)
17. **Team/time:** 3–5 people, research-first with pencil storyboards and a numbered version log; expect 10–20 iterations of the hero chapter; cut anything that reads as encyclopaedia. (SCMP; Reuters "version 20"; Pudding.)
18. **Stack (all zero-cost):** MapLibre GL (BSD-3) + Allmaps-georeferenced IIIF Edo maps + CODH/Rekichizu GeoJSON; OpenSeadragon (BSD) for prints; Voyager (open) or model-viewer for 3-D; scrollama/IntersectionObserver for triggers with CSS scroll-driven animation as progressive enhancement; GSAP (free since Apr 2025) only if JS tweening is needed; TimelineJS (MPL-2.0) for rapid prototypes.

### Gaps
- model-viewer's licence and deck.gl's licence were not confirmed by a returned source (both are widely reported as Apache-2.0/MIT; verify before relying).
- No award jury published numeric craft criteria; rules 2, 7, 11 above contain inferred numbers and should be treated as starting constraints, not cited standards.
- Not examined: Rijksmuseum, V&A, Louvre, Van Gogh Museum, Met, Bellingcat/Forensic Architecture, Running Reality, OldMapsOnline, Frans Hals Museum (Awwwards SOTY 2018), Google Arts & Culture's "Hokusai" entity pages beyond the stories cited.

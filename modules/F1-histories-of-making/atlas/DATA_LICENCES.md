# Licences of the data we draw on

What we may do with each source. Checked 28 September 2026 unless noted; the harvest re-checks record-level licences monthly. The full registry, with the page each licence was read from, is `data/sources/sources_zero_cost.csv`.

| Source | Licence | What we do |
|---|---|---|
| Cleveland Museum of Art Open Access | CC0 per record (`share_license_status`) | Host records marked CC0 |
| The Met Open Access | Public domain per record (`isPublicDomain`); the search filter is unreliable | Host only records whose own flag is true |
| Art Institute of Chicago | Data CC0; `description` field CC BY 4.0; images public domain per record | Host; credit AIC when quoting descriptions |
| Smithsonian Open Access | CC0 where marked | Host records marked CC0 |
| Smithsonian Open Access 3D (3d.si.edu; files through the Smithsonian 3D API, 3d-api.si.edu) | CC0 where the object page says so; checked 4 October 2026 for Freer F1961.33a-b, the ritual wine ewer (gong) used by the object-page prototype | Host the glb files of objects marked CC0, downloaded and self-hosted (decision 7, audit of 3 October 2026); credit the Smithsonian as it asks |
| Wikidata | CC0 | Use ids and facts |
| PeriodO | CC0 | Use period definitions |
| Getty vocabularies (AAT, TGN, ULAN) | ODC-By | Use with credit |
| Pleiades; geoBoundaries | CC BY | Use with credit |

### The backbone harvest (`harvest/backbone.py`), checked 4 October 2026

| Source | What we take | Licence (where it was read) | Attribution line we carry |
|---|---|---|---|
| Wikidata, SPARQL endpoint `https://query.wikidata.org/sparql` | Items in the classes art movement (Q968159, with subclasses), architectural style (Q32880, with subclasses) and art style (Q1792644, direct instances): QID, English label and description, dates, countries, influences (P737), AAT id (P1014), English Wikipedia link | CC0 (Wikidata's data licence) | None required; we keep the QID on every row |
| PeriodO, `https://data.perio.do/dataset/` (ARK `http://n2t.net/ark:/99152/p0d.json`) | Every period definition with its authority citation, its four bounds, spatial coverage and language | CC0 1.0, `dcterms:license` in `https://data.perio.do/.well-known/void` (dataset modified 2026-09-24) | None required; PeriodO asks for attribution in kind, so each row keeps its ARK and the authority's citation |
| Pleiades, `https://atlantides.org/downloads/pleiades/dumps/pleiades-places-latest.csv.gz` (the GIS package `https://atlantides.org/downloads/pleiades/gis/pleiades_gis_data.zip` is also accepted) | Place id, title, place types, representative point, time-period codes, URI | CC BY 3.0 (`https://creativecommons.org/licenses/by/3.0/us/`, stated on `https://pleiades.stoa.org/downloads`) | "Pleiades: a gazetteer of past places, © Ancient World Mapping Center and Institute for the Study of the Ancient World, https://pleiades.stoa.org/ (CC BY 3.0)". Pleiades asks reusers to send a notice to pleiades.admin@nyu.edu; the legacy CSV dump is marked deprecated by Pleiades and may be withdrawn |
| Getty AAT and TGN, SPARQL endpoint `https://vocab.getty.edu/sparql` (JSON at `sparql.json`) | Candidate ids, preferred labels, parent strings and place types for canon movement/style/school and place rows | ODC-By 1.0 (`https://www.getty.edu/research/tools/vocabularies/lod/`) | "Contains information from the J. Paul Getty Trust, Getty Research Institute, Art & Architecture Thesaurus, which is made available under the ODC Attribution License" and the same for the Getty Thesaurus of Geographic Names; the Getty's own `vocab.getty.edu` URIs are kept on every row, which the Getty accepts in place of the full line where that is not feasible |

No description, scope note or other prose is copied from any of these sources; the rows hold identifiers, names, dates, places and links. The Wikidata English description is the one exception, because Wikidata's text is CC0, and it is kept only to help a person tell namesakes apart.
| Natural Earth | Public domain | Use |
| UNESCO intangible heritage data (graph_en.json) | No licence stated | Keep facts only (names, years, list, states) and link to UNESCO |
| Wikimedia Commons | Per file | Host only CC0, public domain, CC BY or CC BY-SA files, with credit |
| British Museum, V&A, Gallica, Bodleian, EMKP, Smarthistory | Non-commercial | Link only, unless a holder grants free educational use (open build only) |
| Te Papa, Auckland Museum (taonga Māori and Pacific material) | Restricted by the holders' own rules despite open markings | Link only |

Local Contexts Notices are applied by hand under a free researcher account; Labels are applied by communities themselves.

## Derived data and the viewers' dependencies

Checked 4 October 2026 at the model card or the package's own `package.json`.

| Item | Licence | What we do |
|---|---|---|
| Depth maps in `data/derived/depth/` (from `harvest/depth_batch.py`) | Each map carries the licence of the image it was computed from (CC0 or public domain); the computation adds no new rights | Host beside the image; the manifest records the source image and its licence |
| Depth Anything V2 Small weights, `depth-anything/Depth-Anything-V2-Small-hf` (transformers) and `onnx-community/depth-anything-v2-small` (transformers.js) | Apache 2.0. The Base, Large and Giant variants are CC BY-NC and are never used | Run the Small model only, in the batch and, on request, in the browser |
| transformers.js, `@huggingface/transformers` 4.3.0 | Apache-2.0 | Load from jsdelivr in the object page, only when a learner asks for an in-browser depth map |
| OpenSeadragon 6.1.1 | BSD-3-Clause | Load from cdnjs for deep zoom |
| Google model-viewer, `@google/model-viewer` 4.3.1 | Apache-2.0 | Load from jsdelivr for 3D. Its own sample models are CC BY and CC BY-NC-SA, not CC0, so we do not host them |
| Cleveland open images used by the viewers (web, print) | CC0 per record | Shown unaltered; the record exposes no IIIF service, so the viewer loads the JPEGs as plain image levels |


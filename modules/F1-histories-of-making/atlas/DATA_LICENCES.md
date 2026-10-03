# Licences of the data we draw on

What we may do with each source. Checked 28 September 2026 unless noted; the harvest re-checks record-level licences monthly. The full registry, with the page each licence was read from, is `data/sources/sources_zero_cost.csv`.

| Source | Licence | What we do |
|---|---|---|
| Cleveland Museum of Art Open Access | CC0 per record (`share_license_status`) | Host records marked CC0 |
| The Met Open Access | Public domain per record (`isPublicDomain`); the search filter is unreliable | Host only records whose own flag is true |
| Art Institute of Chicago | Data CC0; `description` field CC BY 4.0; images public domain per record | Host; credit AIC when quoting descriptions |
| Smithsonian Open Access | CC0 where marked | Host records marked CC0 |
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

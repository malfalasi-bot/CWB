# A3 Content architecture benchmark

Study 2026-11, paper A3. Written 22 November 2026. Status: draft for the course owner's review. Not committed.

How other organisations hold large bodies of knowledge so that one body of material can be shown in many ways: as a map, a timeline, cards, long chapters, lectures, courses, and as text an AI partner voice can find and cite. The paper ends with a recommended architecture for the Creative World Atlas, sized for zero cost, git and Supabase.

Method. Each system was looked up on 22 November 2026, and pages were read where a claim depended on them. Only URLs that a search or fetch returned are cited. Points from working knowledge, not re-checked in this pass, are marked *(working knowledge)*. Two pages could not be read: Numeridanse's "about" page (permission timed out) and the BBC's "Sports Refresh" post (link failed). An interview with the BBC architects was used instead.

---

## 0. The question and the short answer

**The problem.** The Atlas was designed as a map with cards in four fixed tiers: Line (16 words), Label (50–60), Story (150–250) and Deep (600–1,200). That suits a canon node such as a technique or a polity. It does not suit what ballet now holds: a thirteen-chapter unit of about 41 hours, a whole-history timeline of 156 works, 118 deep dives under twelve fixed headings, debates and myths, design and art across history, and about 400,000 words of research. A 1,200-word cap cannot hold a 15,000-word lecture. A map cannot hold a course. A card cannot hold an argument with two readings.

**What the benchmark shows.** No mature system makes the view the container. They all separate four things that the current Atlas runs together:

1. **Records**: entities (a work, a person, a place, a technique) and statements about them, each with its source and confidence. Examples are Wikidata, CIDOC-CRM and Linked Art, Seshat, the BBC's ontologies, and the Royal Opera House's work, production and performance records.
2. **Documents**: prose written by a person for a reader, at whatever length the argument needs. Examples are DITA topics, OpenStax modules, MDN pages, Smarthistory essays and Wikipedia articles.
3. **Compositions**: ordered lists of references to documents and records, which make a book, a course, a tour or a playlist. Examples are DITA maps, OpenStax collections, Open edX OLX courses, IIIF manifests and Jacob's Pillow playlists.
4. **Views**: renderings generated from the first three. They are not stored as content. Examples are BBC Sport's 700 World Cup pages, Wikipedia infoboxes drawn from Wikidata, MDN's compatibility tables, and Histropedia timelines built from a query.

**The short answer.** Keep the map, but demote it from container to view. Hold the content as six types: **Entity, Claim, Source, Asset, Document and Composition**. Store them as Markdown and YAML in git, copy them into Postgres, and give every paragraph and claim a stable anchor. Generate the map, the timeline, the card deck, the reader, the course player and the AI retrieval index from that one store. The four tiers stay, but they become fields that a card document carries for one entity. They stop being the only shapes content may take. The existing pieces already point this way: the canon schema, `register.yaml`, `timeline_events.yaml`, `build_timeline.py`, the licence switch, and the front matter of *The shoe* (with `content_id`, `version`, and `derived_from` pinned to commit hashes). The work is mostly to name the pattern and apply it everywhere.

---

## 1. Models of separation

### 1.1 Four layers: knowledge, documents, compositions, views

The models below differ in vocabulary and era (SGML-era XML, RDF, JSON APIs, Markdown in git), but most of them set the same boundary in the same place. **Knowledge** is what is true or claimed about the world, held so a machine can query it. **Documents** are what a person wrote for a reader. **Compositions** decide which documents, in what order, for whom. **Views** turn all of that into a screen, a page, a timeline or an answer. A system is limiting when one layer is forced to do another's job, for example a map that has to be the table of contents or a card that has to be the argument. That is the Atlas's current problem.

### 1.2 DITA: topics, maps, conref and keys

The Darwin Information Typing Architecture is an OASIS standard from technical publishing. Its specification states: "In DITA, a topic is the basic unit of authoring and reuse." Topics are *typed*. The base types are `concept` (what something is), `task` (how to do it) and `reference` (look-up facts), and organisations derive their own types by **specialisation**, "the creation of new element types and attributes that are explicitly and formally derived from existing types." **Maps** are separate files that arrange topics into deliverables: a manual, a help system, a training course. They also "provide the contexts in which keys are defined and resolved." **Conref** (`@conref`, `@conkeyref`) pulls a fragment of one topic into another by its `@id`, so a warning or a definition lives in one place. **Keys** add indirection: a topic refers to `keyref="product-name"`, and each map binds the key differently. **Conditional processing** filters or flags content by attributes such as audience or platform at build time.

*What transfers.* Typed topics and maps are the clearest precedent for separating the unit of writing from the deliverable. The Atlas's twelve research kinds and the ballet deep dive's twelve fixed headings are already information types. A thirteen-chapter unit is a map. *What does not transfer.* DITA's XML toolchain, and its habit of breaking prose into very small topics. Practitioners have long warned that heavy reuse produces "Frankenstein" documents that read as assembled parts. A lecture is an argument and should stay whole.

### 1.3 NPR COPE: create once, publish everywhere

In 2009 NPR's Daniel Jacobson described "Create Once, Publish Everywhere" in a series on NPR's own blog. The three principles were to build *content management* tools rather than *web publishing* tools, to separate content from display, and to strip platform-specific markup out of stored content. They paid off directly: NPR launched NPR Music "without refactoring its system architecture or presentation code," and the same stories flowed to its API, mobile apps and member stations. Later practitioners warned that COPE needs editors to fill structured fields carefully, and that a "publish everywhere" story still needs per-channel editing (Blend Interactive's talk "COPEing mechanism: the peril and promise").

*What transfers.* The rule that stored content carries no layout. A Story tier stored as plain Markdown with entity references can appear on a map pin, a card and a timeline tooltip. A Story stored as a map popup's HTML cannot. *Caution.* COPE works for news, where a story is a stable unit. Teaching material needs per-context framing, which is why compositions (1.7) are needed as well as reuse.

### 1.4 BBC dynamic semantic publishing and its ontologies

The BBC took the idea further. Its journalists tagged each asset (story, clip, live text) with concepts from an ontology, stored as linked data in a triplestore. Pages were then **generated** by querying the graph. For the 2010 World Cup the BBC used the BigOWLIM triplestore to generate "over 700 pages for teams, groups, and players," which was more index pages than the whole hand-edited BBC Sport site. Inference spread tags along the graph, so a story tagged with a player also appeared on that player's team and group pages. For the 2012 Olympics the same approach covered "every country (200+), athlete (10,000+), discipline/event (400–500), and venue," with a MarkLogic XML store added for documents. The architects' main lesson was that "Semantic Web technologies are not an end in themselves." Adoption was incremental, alongside ordinary XML and HTTP.

The BBC published its ontologies, and IPTC still hosts them: **Programmes** (brand, series, episode), **Sport**, **Wildlife** (species, taxa, habitats, behaviour; it backed Wildlife Finder, which gathered decades of natural-history clips around one page per species), **Core Concepts** (generic people, places, events, organisations, themes, which domain teams extend by subclassing), **Creative Work** (minimal metadata for any piece of content), **Storyline** and **Curriculum**.

*What transfers.* The division of labour. Writers write and tag. Entity pages, aggregations and timelines are generated. A small core ontology (people, places, events, organisations, themes) is extended per domain, which is exactly how F1's canon of 25 kinds already works. *What does not.* A triplestore and OWL inference. Postgres joins and views cover F1's scale (thousands of entities, not millions) at no cost.

### 1.5 Wikipedia and Wikidata: articles against statements

Wikipedia and Wikidata are the largest working example of the entity-plus-document split. A Wikidata **item** (Q-id) holds **statements**. Each statement is a property and value, refined by **qualifiers** (point in time, applies to part, sourcing circumstances), backed by **references**, and given a **rank** (preferred, normal, deprecated) so that disputed or superseded values are kept rather than deleted. Wikidata records what sources say, not what is true, and so it can hold two incompatible dates side by side. A Wikipedia **article** is free prose in each language, linked to one item. Infoboxes can be filled from the item through Lua modules (for example `Module:WikidataIB` and `Module:Wd`). "Arbitrary access" lets an article read items other than its own, though the documentation advises using only a moderate number of items per page. English Wikipedia limited automatic Wikidata infoboxes after a 2018 request for comment, largely because of sourcing quality and editors' loss of control. Aidan Hogan and colleagues studied the infobox-from-Wikidata problem directly.

*What transfers.* The statement model maps almost one-to-one onto F1's claims (110 rows, with confidence): statement, qualifiers, reference, rank. Ranks are a cheap way to keep the "two readings" of a dispute in the data. *Warning.* Prose and data drift apart. A Wikipedia article and its item often disagree, and nothing forces them to agree. Section 3.6 returns to this.

### 1.6 Museum linked data: CIDOC-CRM, Linked Art, the Getty vocabularies, EDM, IIIF

- **CIDOC-CRM** (ISO 21127) is the reference ontology for cultural heritage. It is *event-centric*: an object does not simply "have a maker". A Production event carried out by actors, at a place and time, produced it, and acquisition, modification and destruction are events too. This suits a history of making, but CRM is abstract and very large.
- **Linked Art** is an *application profile* "based primarily on the CIDOC Conceptual Reference Model". It narrows CRM to the patterns art museums actually need and serialises them as JSON-LD. Its working group is co-chaired from Yale and the University of the Arts London. *(Working knowledge)*: its API defines about a dozen record types, including physical objects, digital objects, textual and visual works, people, groups, places, concepts, events, sets and provenance activities, each a self-contained JSON document that links to the others by URI.
- **The Getty vocabularies** (AAT for concepts and object types, TGN for places, ULAN for people and firms) are published as linked open data under ODC-By 1.0. They have persistent URIs (for example `http://vocab.getty.edu/aat/300198841`), a SPARQL endpoint and monthly full downloads. The Getty no longer offers XML services. The Atlas README records that the endpoint answered HTTP 403 to the harvester in October 2026, so AAT ids currently arrive through Wikidata (P1014).
- **The Europeana Data Model** separates the cultural heritage object itself (`edm:ProvidedCHO`) from the **aggregation** that a providing institution assembles about it (`ore:Aggregation`, which carries the required rights statement) and from each digital file (`edm:WebResource`). One object can therefore have many images under different licences, and many providers' descriptions.
- **IIIF** (the Presentation API 3.0) describes an object as a **Manifest** of **Canvases**. Images, audio, video and text are attached to canvases through W3C annotations, and the Content State API lets a link point to one region of one canvas at one moment. A manifest is a composition: it references images held elsewhere rather than copying them.

*What transfers.* Light event-centricity (a premiere, a revival, a costume's making are events with actors, places and dates), EDM's split between object and digital surrogate (F1's licence per asset), and IIIF manifests to show holders' images without hosting them. *What does not.* Authoring full CRM graphs by hand.

### 1.7 Open textbooks and courses: OpenStax, Open edX OLX, LibreTexts

- **OpenStax (formerly Connexions, CNX)** wrote textbooks as **modules** (small CNXML documents, each with its own id and version) assembled into **collections**, which are books defined as ordered references to *specific versions* of modules. Anyone could build a new collection from existing modules. The repository site was retired, and *(working knowledge)* OpenStax now keeps its books as CNXML in git repositories, which shows that the module-and-collection model survives a move to files in git.
- **Open edX OLX** is the course export format. A course is a tree: **chapter** (a section, typically a period of time) → **sequential** (a subsection) → **vertical** (a unit, one page) → **components** (leaf elements such as `html`, `video`, `problem`). Each element can live in its own file under a directory named for its type, and parents refer to children by `url_name`. Supplementary content (about pages, assets, tabs) and policies (grading) are kept apart from courseware.
- **LibreTexts** builds books by **remixing** pages from a shared library. Its Remixer offers two choices. A **copy-transcluded** page shows the source by reference and "stays in sync", so a correction at the source reaches every remix (and an edit there changes every book that uses it). A **copy-forked** page is an independent copy that can be restructured freely but will not receive upstream fixes. The guide advises transcluding when the content fits as it is and forking when you need "to restructure, change the pedagogy, delete sections".

*What transfers.* All three treat the book or course as a composition of addressable units. OLX's chapter → sequential → vertical → component tree is close to what a thirteen-chapter, 41-hour ballet unit needs. LibreTexts' choice between transcluding and forking is the honest answer to reuse: share by default, fork on purpose, and record which you did.

### 1.8 MDN: content as files with front matter

MDN Web Docs keeps about ten thousand pages as Markdown in a public GitHub repository (`mdn/content`). Each page has YAML **front matter** that gives `title`, `slug` and a `page-type` key. Each page type (CSS property, API reference, HTML element, landing page and so on) has a template with required sections. Data is kept apart: browser support lives in a separate JSON dataset, Browser Compatibility Data (BCD). A page declares a `browser-compat` key in its front matter, and the build renders the compatibility table from BCD. Writers never type support data into prose.

*What transfers.* This is the nearest existing model to Creative World, and it costs nothing. It is Markdown in git, with typed pages, front matter that links to a structured dataset, and tables generated at build time. The F1 equivalent is a deep dive on *Giselle* whose front matter says `entity: work:giselle`. Its fact box, timeline strip and sources list are then rendered from `register.yaml` and the claims, not typed into the essay.

### 1.9 Headless CMS content models and block documents

- **Sanity Portable Text** stores rich text as a JSON array of blocks. Each block has a style, child spans with marks, and `markDefs` for annotations such as links. Custom block types and **references to other documents** can sit inline. Formatting is therefore data, and any front end can render it.
- **Contentful** defines **content types** (with fields), **entries** (instances) and **references** between entries. Its rich text field can embed entries and assets as blocks or inline.
- **Strapi** (open source, self-hosted) offers reusable **components** and **dynamic zones**, which are ordered lists of mixed component types that let editors build a page from blocks.
- **Notion** says "everything you see in Notion is a block." Each block has a UUID, a type, properties, an ordered list of child block ids, and a parent pointer. Changing a block's type keeps its properties, so information survives a change of form. Pages and database rows are blocks too.

*What transfers.* A long document as a sequence of typed blocks, some of them references to records (an object, a claim, a timeline strip). Markdown can carry this with a small shortcode syntax. *What does not.* The platforms themselves (see 4.2).

### 1.10 Linked notes: Obsidian and Roam

Obsidian keeps notes as plain Markdown linked by `[[wikilinks]]`. A paragraph given a block id (`^block-id`) can be linked or **embedded** (`![[note#^block-id]]`): transclusion at paragraph level, with the id written into the file, so it survives git. Roam made every bullet a block with a UID, with backlinks to every use. The Obsidian forum's long threads on block references show the weak points: hand-written ids, multi-paragraph ranges, and links that break when text moves between files.

*What transfers.* Paragraph ids in the source text, wikilinks to entities, and backlinks as a generated view. *What does not.* A notes graph is not a curriculum. Without compositions it gives a learner no reading order.

### 1.11 Knowledge graphs for learning: Khan Academy, Learning Commons, CASE

- **Khan Academy's knowledge map** was a zoomable graph of maths skills joined by prerequisite edges. It was retired, and learners on Khan's forum still ask where it went. The grade-based topic lists that replaced it lack the prerequisite links. That shows both the value of the graph and how expensive it is to maintain.
- **Learning Commons** (Chan Zuckerberg) publishes a knowledge graph in which a **learning component** is a "single, well-defined skill or concept that students are expected to learn." It `supports` a standards item, is linked to misconceptions that `hinder` it, and carries a CC BY 4.0 licence and an attribution statement on every record. Curriculum connects to components only *through* a shared standard.
- **CASE** (1EdTech) exchanges standards and competency frameworks as a hierarchy of items, each with a GUID, with associations between items and frameworks, so lessons can be tagged by GUID and aligned across systems.

*What transfers.* Learning objectives as first-class records with ids. Each F1 unit's objectives, and the Concept DNA fields a unit writes into, can be addressed and linked from documents and activities. Misconceptions are a direct parallel to F1's "what a first-time reader believes coming in" (research kind 12). *What does not.* A strict prerequisite graph. History of making is not ordered by prerequisites the way maths is, and Khan's experience shows the upkeep cost.

### 1.12 TEI for scholarly text

The Text Encoding Initiative's Guidelines (P5) are the standard for scholarly editions. Every element can carry an `xml:id`, so any passage can be cited and pointed to. Critical apparatus (`<app>`, `<lem>`, `<rdg>`) encodes variant readings of one passage side by side. **Standoff annotation** keeps interpretation in separate files that point into the base text by id or offset, so the text can be annotated many times without being changed.

*What transfers.* The principles, not the XML: every citable passage has a durable id, variant readings are a structure (the course's "disputes as two readings"), and interpretation points into a text without editing it. F1's 130 primary texts benefit most: an AI voice can quote Feuillet or Noverre and link to the exact passage.

### 1.13 Zotero and CSL for sources

The Citation Style Language defines how citations are formatted and, through **CSL-JSON**, what a bibliographic item is (type, title, author, issued, container, DOI, URL, accessed). Zotero stores items and exports CSL-JSON. Thousands of free styles render the same item as Chicago, APA or a museum-style caption. A citation is a *pointer to an item plus a locator* (page, section, timestamp).

*What transfers.* F1 already has 198 source routes with licence and commercial-safe flags. Adding CSL-JSON fields to each source, and giving each claim a `source_id` plus a `locator`, makes every view able to render a citation in whatever style it needs. It costs nothing, and Zotero (free and open source) can be the editing tool.

### 1.14 W3C Web Annotation

The W3C Web Annotation Data Model (a Recommendation since 23 February 2017) defines an annotation as a **body** about a **target**. A target can be a whole resource or a **SpecificResource** narrowed by **selectors**: `TextQuoteSelector` (the exact text with a prefix and suffix), `TextPositionSelector` (character offsets), `FragmentSelector` (a media fragment or an id), `CssSelector`. Selectors can be combined and refined. **States** pin the target to a version or time, and **motivations** (commenting, describing, linking, assessing, questioning, tagging) say what the annotation is for. IIIF uses the same model to attach images to canvases.

*What transfers.* A claim cited by a lecture can be recorded as an annotation whose target is the lecture at paragraph `p-0042` (an id selector), backed by a quote selector (the sentence) so it can be re-attached if the paragraph moves. A state records the git commit. This is the most robust free answer to "transclusion and stable anchors" (3.6). It also matches a reviewer's comment on a sentence, or a learner's highlight.

### 1.15 schema.org CreativeWork and LearningResource; xAPI

schema.org's `CreativeWork` already has the relationships an architecture needs: `hasPart`/`isPartOf` (composition), `about` and `mentions` (entity tagging), `citation`, `isBasedOn`, `license`, `version` and `position`. `LearningResource` (from the LRMI work, now in schema.org) adds `teaches`, `assesses`, `educationalLevel`, `learningResourceType`, `competencyRequired` and `timeRequired`. `Course` and `Syllabus` exist too. Using these names in front matter costs nothing and gives the course a published vocabulary instead of an invented one.

**xAPI** (Experience API) records learning as *actor, verb, object* statements in a Learning Record Store. It matters here only as a reminder that what a learner does belongs in a store separate from content. Concept DNA writes and progress go in their own tables, keyed to content ids.

### 1.16 What the models agree on

Records are DITA reference topics, Wikidata statements, Linked Art records, BCD and CMS entries. Documents are DITA topics, articles, modules, MDN pages and blocks. Compositions are maps, collections, the OLX tree, IIIF manifests and dynamic zones. Views are infoboxes, compatibility tables, readers and front ends. Four points agree across all of them. (1) The unit of authoring is not the unit of display. (2) Facts that recur are stored once, as data, and prose refers to them. (3) Deliverables are lists of references, not copies. (4) Everything addressable has a permanent id.

---

## 2. Precedents close to the Atlas

### 2.1 Google Arts & Culture

**Units.** Partner institutions contribute *items* (images, video, audio with the partner's own metadata, so the level of detail varies by partner), *stories* (online exhibits composed of items and text panels), and gallery tours. Google's 2013 paper "From Assets to Stories via the Google Cultural Institute Platform" names the three moves: **extraction** (metadata given plus features detected automatically), **knowledge** ("a large reference fact database" adds context to each asset from its descriptors) and **scale**. *(Working knowledge)*: the public site's entity pages for artists, movements, mediums, places and historical figures are keyed to Google's Knowledge Graph and gather items from many partners, often with a time slider.
**Where long form meets data.** Stories are compositions of item references, and the entity layer joins thousands of partners' differing metadata.
**Views.** Entity pages, time and colour explorations, and stories are all generated or composed over the same pool of items.
**Lesson.** A shared entity layer is what lets heterogeneous material appear together. Stories reference items; they do not copy them.

### 2.2 Smarthistory

**Units.** More than 4,500 resources (videos, essays, chapters of the *Reframing Art History* textbook, curated guides) by 800+ contributors and 50 editors, all under a Creative Commons non-commercial licence. Smarthistory is the official art history provider for Khan Academy, and supports AP and A-level art history.
**Where long form meets data.** Lightly. Each essay or video concerns a work or a theme and is placed in period, region and theme groupings. The same essay appears in several guides and in the textbook.
**Views.** Browsing by period and region, guides, the textbook, and syndication into Khan Academy.
**Lesson.** One body of essays serves many pathways because the pathways are compositions. Also a licence lesson: NC content can be linked or quoted in F1's open build, but F1's licence switch must treat it as PERMISSION-NC or LINK-ONLY for the commercial build.

### 2.3 The Met and Rijksmuseum APIs

**Units.** One record per object. The Met's API launched in 2018 as a live feed of CC0 data with access to 406,000 images. *(Working knowledge)*: its records include fields for the object's and artist's Wikidata URLs. The Rijksmuseum's current data services offer a Search API, OAI-PMH, a Linked Data Event Stream, full data dumps of the collection and its controlled vocabularies, a persistent-identifier resolver returning several formats, and IIIF images.
**Where long form meets data.** Elsewhere. Essays (the Met's *Heilbrunn Timeline of Art History*, the Rijksmuseum's stories) link to object records by id.
**Views.** Collection search, essays and timelines on the museums' own sites, plus everything third parties build from the dumps.
**Lesson.** Publish records with persistent ids and open licences, and let views multiply. The Rijksmuseum's LDES (a feed of changes) is a model for F1's monthly harvest: record what changed, not only the current state.

### 2.4 V&A collections platform

**Units.** Object records exposed through the V&A Collections API v2, with images through IIIF, behind the "Explore the Collections" site.
**AI.** In November 2025 the V&A began trialling an **MCP server** that lets AI applications (it names ChatGPT and Claude) query the Collections API directly, so they can "locate relevant objects" with fewer hallucinated results. The museum asked for feedback on whether hallucinations persisted.
**Lesson.** The direct precedent for F1's partner voices: an AI voice answers from a structured, citable record store reached through a tool, instead of from training memory. F1 can expose its own Supabase tables to the voices the same way.

### 2.5 Royal Opera House Collections

**Units.** The performance database uses three levels. **Work**: "the unchanging elements," meaning creators, genre, premiere and literary source (for ballet, the choreographer and composer). **Production**: the team that staged it, distinguished by premiere year, as in "The Sleeping Beauty (1946)." **Performance**: who was on stage or in the pit on a given day, where casts sit. Company names are recorded as they were at the premiere or performance. Coverage is honest and partial: works and productions on the main stage from 1946, all performances from September 1999 to August 2019, and first-night casts for earlier years.
**Views.** Browse by title (from work down to performance), and search by person, company, character, date or title.
**Lesson.** The single most important precedent for ballet. F1's `register.yaml` has "one row per version" (156 rows, with ids such as `balet-comique-1581`). It merges the work with its productions. *The Sleeping Beauty* of 1890, 1921 and 1946 are one work in three productions, and the course's Spine B ("one work re-made") is a walk down exactly this hierarchy. The library world's FRBR/LRM model (work, expression, manifestation, item) is the general form of the same idea.

### 2.6 Wikidata-driven timelines and maps: Histropedia, Chronas, Running Reality

- **Histropedia** builds a timeline from a Wikidata query passed in the URL. Only events already in its own database are added. It reports how many items the query found and how many it holds, and a practical display limit is "around 10,000 events." The lesson is that a timeline is a *query plus a curated layer*, and the curated layer is what makes it useful.
- **Chronas** shows "over 50 million data points" on a map with a time slider: borders, culture, religion, population, migration arrows from birthplace to place of death. It seeded its database from geotagged Wikipedia articles via Wikidata, then **migrated the data and stopped querying Wikidata**. Users edit through forms, and "every change is recorded and can be reverted." The lesson is to harvest into your own store, then govern it yourself, as F1's harvester already does.
- **Running Reality** models history from 3000 BC as **factoids**: short, machine-readable, dated statements linking entities (for example, a polity founded by a people). Baseline factoids "must cite primary sources or research material" and pass a review board before entering the **baseline timeline**. Personal **alternate timelines** need no citations. The engine builds the world model, including maps, borders and city populations, from the accumulated factoids. This is the closest precedent to F1's claims register: statements, sources, review, and views computed from them.

### 2.7 Kialo

**Units.** A debate is a tree: a thesis at the root, then **pro** and **con** claims (each under 500 characters, optionally sourced), each of which can have its own pros and cons. Users rate each claim's *impact* on its parent. Moderators can **link one claim into several places** to avoid duplicates, and debates can include parts of other debates. Kialo Edu is free for schools and keeps debates private to a class.
**Lesson.** Arguments are structured data, not paragraphs. F1's "disputes as two readings" (the constitution's rule) needs less than a full tree. It needs a question, two or more readings, each a set of claims with evidence, and the course's position if it takes one. Kialo's claim-linking shows the key move: one claim, many arguments.

### 2.8 Explorables: The Pudding and the New York Times

**Units.** Each explorable is a bespoke composition: prose, data files and code. The New York Times graphics desk created **ArchieML** so reporters can write copy and structured data *in the same Google Doc*. The parser extracts the tagged data and ignores the rest, and unlike YAML or JSON it does not fail on malformed text. The Pudding publishes its starter templates on GitHub, where stories are built from a copy document plus data files.
**Lesson.** Long-form visual essays are *views with their own code*. They should read the same records (works, events, claims) as everything else, and their prose should follow the same document rules. ArchieML's forgiving syntax is a useful reminder: authoring structured content must not punish writers.

### 2.9 Jacob's Pillow Dance Interactive and Numeridanse

**Jacob's Pillow Dance Interactive.** Units are short video excerpts, "often, with just a minute of dance," from the 1930s to the 2010s, identified by work, choreographer, performers and date. Views are browsing by decade, a **Themes/Essays** section in six groups (What is Dance, Women in Dance, Men in Dance, Dance and Society, Dance of the African Diaspora, Tap), and **curated playlists** (for example Indigenous Dance of the Americas, Black Artists in the Duke). Essays are documents. Playlists are compositions of clip references.
**Numeridanse** (Maison de la Danse, Lyon). The "about" page could not be read in this pass. *(Working knowledge)*: it holds several thousand dance videos from partner companies and archives, with thematic tours that combine clips and commentary, and educational tools built on the same video records.
**Lesson.** Dance archives already separate the record (a clip of a work), the essay and the playlist or tour. F1's ballet material needs the same three, plus licence per clip: most dance film is LINK-ONLY.

### 2.10 Encyclopaedia Britannica's article tiers

Britannica School offers each topic at **three reading levels**, Elementary (Level 1), Middle (Level 2) and High (Level 3), and students switch "by clicking on the purple Reading Level indicators at the top of the page." The levels come from Britannica's separate encyclopedias (Elementary, Middle and High), written and edited separately but bound to one topic. Readers who move up a level get a more advanced interface, and older readers who choose Level 1 keep theirs so they are not marked out.
**Lesson.** The most relevant answer to the Atlas's fixed tiers. A professional encyclopedia does **not** generate shorter tiers from longer ones. It writes each level for its reader and **binds the levels to one topic id**, so the reader can move between them. F1's Line, Label, Story and Deep should work the same way: authored (with machine drafts allowed), linked to one entity, and checked against the same claims. Then an argument longer than Deep (a deep dive, a lecture) is simply another document linked to the entity, not a fifth tier.

### 2.11 Oxford Reference overview pages

Oxford Reference holds about two million entries from Oxford's dictionaries and companions. Its free "overview" information gives readers "immediate factual frameworks, context and vocabulary to shape further enquiry," and is meant to act as "a hub of information on a particular topic, but also a network of links" into the full entries, for example from "globalization" to its effects on economics and art.
**Lesson.** A short, freely visible hub page per entity that points into many longer treatments by different authors is a cheap, durable pattern. For F1 it is the entity page: the Story tier, then links to every deep dive, lecture, claim, timeline and dispute that concerns that entity.

### 2.12 Seshat

The Seshat Global History Databank codes **polities** in natural geographical areas against **variables** from a codebook built with more than 100 specialists. Values are numbers, ranges, or present / absent / unknown, plus "inferred present" and "inferred absent." Coders "record ambiguity, gaps, and scholarly disagreement," so analyses can run under alternative interpretations. Every value links to scholarly sources and "is supplemented by a narrative paragraph explaining why it was coded that way, with citations." Research assistants code first, experts review, and the names and dates of expert interventions are logged. A Data Review Board is responsible for published data.
**Lesson.** Seshat is the strongest precedent for F1's claims: coded value, confidence, disagreement kept, source, a **short narrative per value**, and a logged human gate. It also shows the cost. Seshat has paid staff, and F1 does not, so F1's claims model must stay smaller.

### 2.13 Summary table

| Precedent | Records | Documents | Compositions | Views generated |
|---|---|---|---|---|
| Google Arts & Culture | items + entity graph | stories | stories, collections | entity pages, time, tours |
| Smarthistory | light (work, period) | essays, videos | guides, textbook | browse, syndication |
| Met / Rijksmuseum / V&A | object records, CC0, PIDs | essays elsewhere | sets | search, dumps, MCP (V&A) |
| ROH Collections | work → production → performance | programme notes (separate) | seasons | browse, search |
| Histropedia / Chronas / Running Reality | Wikidata / own store / factoids | linked articles | queries, timelines | timelines, maps |
| Kialo | claims tree | (none) | debates, links | tree, perspectives |
| Pudding / NYT | data files | copy docs (ArchieML) | the story | bespoke explorable |
| Jacob's Pillow / Numeridanse | clip records | essays | playlists, tours | decade browse, themes |
| Britannica | topic id | 3 authored levels | (none) | level switch |
| Oxford Reference | entries | entries | overviews | hub pages |
| Seshat | coded values + narrative | narrative paragraphs | (datasets) | analyses |

---

## 3. Patterns that recur

### 3.1 Entity plus document

Every mature system keeps a **record** for each thing (with a permanent id, typed fields and links) and lets any number of **documents** be *about* it. Wikidata and Wikipedia, MDN's BCD and its pages, the Met's records and its essays, Oxford's entries and overviews all work this way. Documents declare what they are about (front matter `about:` and `mentions:`, in schema.org terms), and entity pages gather them through backlinks. F1 already has the record half: 4,228 canon nodes in 25 kinds, the 77-object world set, and the 156-row ballet register. What it lacks is the document half as a first-class, typed, linked store.

### 3.2 Statement-level claims with provenance

Wikidata statements, Running Reality factoids, Seshat values and Kialo claims are all **statements small enough to cite, check and disagree with**, each with a source and a status. The common fields are: subject (entity id), predicate or a short text, value, qualifiers (date, place, extent), source with locator, confidence or rank, the reviewer and date, and a short note on why. F1's claims (with documented, probable, contested and argued) fit this. They need two additions: a **locator** (page, section or timestamp in the source) and **anchors** back to every paragraph that makes the claim.

### 3.3 Composition by reference

DITA maps, OpenStax collections, the OLX tree, IIIF manifests, LibreTexts remixes, Jacob's Pillow playlists and Kialo's linked claims all make deliverables from **ordered lists of references**, often pinned to a version. A composition owns order, framing (an introduction, transitions, activities) and audience, but not the content it points to. This is how one deep dive on *Giselle* can sit in chapter 4 of the ballet unit, in a "Romantic machinery" tour and on the 1841 point of the timeline without three copies.

### 3.4 Views as queries

BBC Sport's pages, Wikipedia infoboxes, MDN compatibility tables, Histropedia timelines, Chronas maps and Running Reality's world model are all **computed**. Nobody stores the World Cup team page. A view is a query (which records and documents), a layout, and sometimes a curated override (pin this event, hide that one). For F1, the map, the timeline, the card deck, the entity hub, "every claim in this lecture" and "every dispute about authorship" are all SQL views or build-time queries over one store. The ballet timeline already works this way: `build_timeline.py` reads `register.yaml` and `timeline_events.yaml` and writes `timeline.json`.

### 3.5 Tiers generated from one source

Two approaches appear. **Generated**: infobox fields, BBC summaries, IIIF thumbnails, Google's descriptors, and today the AI-drafted summary. **Authored and bound**: Britannica's three levels, Oxford's overviews beside full entries, DITA's short descriptions written by hand. The evidence favours *authored and bound*, with generation as a drafting aid. A machine-made Line of 16 words can easily overstate a "probable" claim. The working rule is: tiers are fields on one card bound to one entity. Line and Label may be machine-drafted from Story and the claims, but a person accepts them (the course's human gate). Every tier is checked automatically against the claims it uses.

### 3.6 Transclusion and stable anchors at paragraph or claim level

TEI's `xml:id`, DITA's conref by `@id`, Obsidian's `^block-id`, Roam's block UIDs, Notion's block UUIDs and Web Annotation's selectors all give **every citable piece of text a permanent address**. Without that, a claim cannot point to where it is used, an AI cannot cite a paragraph, and transclusion breaks whenever text is edited. The robust form combines an **id written into the source** (survives moves and edits) with a **quote selector** as a fallback (re-attaches if the id is lost) and a **version** (the git commit). LibreTexts' warning applies to transclusion: a change at the source reaches every page that uses it, so a transcluded paragraph must be a stable kind of text (a definition, a claim's wording), not a paragraph of argument.

### 3.7 Versioning and editions

OpenStax collections pin module versions. Wikidata keeps every revision. Chronas makes every edit revertible. TEI editions are cited by edition. Running Reality separates a reviewed baseline from personal alternates. Two kinds of version matter. **Revision** is any change, which git gives for free. **Edition** is a named, reviewed release that learners and citations can rely on. F1's `tools/content_versions.py` already gives learner files semantic versions (*The shoe* 0.1.0 → 0.3.0) and records `derived_from` sources at commit hashes. That is the edition model. It should apply to every document and composition, and a composition should cite the editions it includes.

### 3.8 Licences at the asset level

EDM puts the rights statement on the aggregation and on each web resource. The Met marks each record CC0. Smarthistory licenses its text NC. Getty data is ODC-By. Learning Commons puts a licence and an attribution statement on every record. The pattern is that **licence belongs to the smallest reusable thing**: the image, the clip, the record and the paragraph of quoted text, not the page. F1's `licence_class.py` and its six classes, with one dataset producing an open build and a commercial build, are already ahead of most precedents. The architecture must keep that true through composition and transclusion: a composition inherits the most restrictive class of what it embeds, and the build reports it.

### 3.9 AI retrieval: chunking, embeddings, citations back to anchors

The V&A's MCP trial and the general practice of retrieval-augmented generation agree. An AI voice should answer from retrieved, citable records and passages, not from memory. Anthropic's published study of **contextual retrieval** gives practical numbers. Prepending 50–100 tokens of chunk-specific context before embedding cut retrieval failures by 35%. Adding a contextual keyword index (BM25) brought the reduction to 49%, and reranking to 67%. Passing about 20 chunks worked better than 5 or 10. Supabase documents **hybrid search** in plain Postgres: a `tsvector` full-text column and a `pgvector` embedding column, merged by reciprocal rank fusion in one SQL function. The common rules are:

1. Chunk along the document's own structure (sections and anchored paragraphs), not at fixed character counts.
2. Give every chunk its document id, anchor, version, status, licence class and the entity ids it mentions.
3. Prefix each chunk with its context (document title, section heading, entity), so a paragraph about "the 1921 revival" knows which ballet it concerns.
4. Retrieve claims as well as prose, and have the voice cite `document#anchor` or `claim-id` so every answer links back.
5. Filter by status. Research notes and "probable" claims may inform the Historian, flagged as such, but must not be presented to learners as fact.

---

## 4. Fit for Creative World

### 4.1 What transfers at zero cost with git and Postgres

| Pattern | Zero-cost form for Creative World | Already present |
|---|---|---|
| Entity plus document (3.1) | YAML or JSON records per entity kind in git, and Markdown documents with front matter `about:` and `mentions:` (MDN model) | canon nodes, world set, `register.yaml`; *The shoe* front matter |
| Statement-level claims (3.2) | `claims/*.yaml`: subject, text, qualifiers, source and locator, confidence, rank, reviewer, anchors | 110 claims with confidence; ballet claims register |
| Composition by reference (3.3) | `*.manifest.yaml` for units, tours, timelines and maps, listing ids pinned to editions (OLX and DITA-map style) | blueprint and unit plans (as prose) |
| Views as queries (3.4) | Postgres views and materialised views, plus build-time scripts emitting JSON for a static site | `build_timeline.py` → `timeline.json` |
| Bound tiers (3.5) | One card file per entity with `line`, `label`, `story` and `deep` fields; drafts allowed, human acceptance recorded | the tier lengths themselves |
| Stable anchors (3.6) | Paragraph ids in Markdown (`{#p-…}` attribute or `^id` suffix) generated once by a script and never reused; claim citations as annotation rows (id, quote, commit) | `body_sha256`, `derived_from@sha` |
| Editions (3.7) | git for revisions; semantic versions in front matter for editions; manifests pin editions | `content_versions.py`, `CONTENT_INDEX.md`, `MANIFEST.md` |
| Licence per asset (3.8) | `licence_class` on every asset and quoted passage; build computes each composition's most restrictive class | `licence_class.py`, six classes, two builds |
| AI retrieval (3.9) | a `chunks` table with anchor, metadata, a `tsvector` and a `vector` column; hybrid search with reciprocal rank fusion; embeddings from an open model | `documents` table with full-text index |

**Embeddings at no cost.** Supabase Edge Functions run a built-in `gte-small` model (`new Supabase.ai.Session('gte-small')`) with no external package or key shown. Its documented limits are English only, and inputs truncated at 512 tokens. That suits paragraph-sized chunks of English text. The alternative is to compute embeddings in the GitHub Actions build with an open, Apache- or MIT-licensed small model and load the vectors with the seed files, which keeps the pipeline reproducible from git. Supabase's own hybrid-search guide uses a paid OpenAI model in its example, so the example must not be copied as it stands.

**Size check against the Supabase free plan** (500 MB database, 1 GB file storage, 500,000 Edge Function calls a month, two active projects, pause after a week of inactivity). Ballet's 400,000 research words plus all learner content for F1 might reach a few million words, which is tens of megabytes of text. At about 300 words a chunk that is on the order of 10,000–20,000 chunks. With 384-dimensional vectors (about 1.5 KB each) that is 15–30 MB of vectors, plus indexes. The 4,228 canon nodes are trivial. **The architecture fits the free plan with a wide margin.** Images stay with their holders (IIIF and links), as the licence rules already require. The pause after a week of inactivity is the real constraint for live AI voices. Accept cold starts, or let the monthly harvest workflow touch the database.

**Publishing at no cost.** A static site generator (any open one: Astro, Eleventy or similar) builds the reader, the cards, the timeline and the map from git plus exported JSON, hosted on GitHub Pages or a free static host. Postgres serves search and the AI voices. Map and timeline libraries are open (for example MapLibre and the TimelineJS family). Nothing here needs a paid service.

### 4.2 What does not transfer

- **A triplestore, OWL inference and full CIDOC-CRM graphs.** They suit millions of triples and teams of semantic engineers. For F1 they add a second data language nobody can maintain. Use Linked Art's shapes and Getty or Wikidata URIs as identifiers and checklists inside plain JSON and YAML.
- **DITA XML and its toolchain.** A good model, but the authoring cost is too high for a course written in Markdown.
- **Hosted headless CMSs (Contentful, Sanity) and Notion.** They are proprietary, move the source of truth out of git, and free tiers can become costs. Strapi is open but needs a server. Borrow the block-with-references idea in Markdown.
- **Kialo, Google Arts & Culture and Britannica as platforms.** They are closed. Copy their structures, not the services.
- **Prerequisite graphs and an xAPI record store.** History is not a dependency graph, and an LRS is premature. Keep learner records in their own Supabase tables.
- **Machine-generated learner tiers without review.** This breaks the human gate and the "no invention" rule.

### 4.3 Risks

1. **Over-modelling.** Twelve research kinds, 25 canon kinds and Linked Art's dozen classes make it easy to design forty content types. Every type needs a schema, a validator, a template and authors who know it. *Mitigation:* six types (4.5), with `kind` and `form` fields doing the rest, and a new type only when a view cannot be built without it.
2. **Authoring burden.** COPE's lesson and Seshat's staffing show that structure costs writers' time. *Mitigation:* writers write Markdown with light shortcodes. Ids and anchors are added by script. Claims are extracted with AI help and accepted by a person. ArchieML-style tolerance applies: a validator warns rather than blocks, except where a view or a licence would break.
3. **Drift between data and prose.** This is Wikipedia's chronic problem. A deep dive says 1841 and the register says 1842. *Mitigation:* prose cites claims by id (`{claim:giselle-premiere-date}`) for any fact a view also shows, and CI checks that the cited claim exists and is not deprecated. A nightly report lists dates and names in prose that match no claim, for review.
4. **Id churn and broken anchors.** *Mitigation:* ids are never reused or renamed, only redirected (an `aliases` list). Paragraph anchors are permanent, with a quote fallback.
5. **Tier drift.** A Line overstates what the Story hedges. *Mitigation:* each tier lists the claims it rests on, and a check flags a tier that uses a "probable" claim without hedging.
6. **Transclusion cascades.** As LibreTexts warns, one edit changes every page. *Mitigation:* transclude only definitions and claim wording. Compositions pin editions, so an edit reaches a published unit only when its manifest is updated.
7. **Licence leakage.** A LINK-ONLY clip embedded in a lecture that feeds the commercial build. *Mitigation:* the build computes each composition's licence class from its parts and fails the commercial build on conflicts.
8. **AI treating research as teaching.** 400,000 words of research include "probable" and "argued" material. *Mitigation:* every chunk carries `status` and `confidence`. Learner-facing voices retrieve only reviewed documents and documented claims by default. The Historian may retrieve research and must say so when it does.
9. **Two sources of truth.** Supabase must stay a copy. As of 29 September 2026, 31 of the 85 seed files were loaded. *Mitigation:* a single export script driven by CI rebuilds the database from git with checksums (the `verify/` pattern already exists). Nothing is edited in the database except learner data.

### 4.4 Recommended architecture in outline

**Flow.** Records (`entities/`, `claims/`, `sources/`, `assets/`), documents (`docs/**.md`) and compositions (`manifests/*.yaml`) are authored in git. A free CI build validates ids, anchors, claims and licences, assigns paragraph anchors, renders the views to JSON and HTML for a static site, chunks and embeds the documents, and exports seed files with checksums to Supabase. Supabase serves search, SQL views and the AI partner voices. Views are never authored: each is a query plus a layout, with a small curated override file where needed.

**Principles.**
1. **git is the source and Postgres is the copy.** Learner data (Concept DNA, progress, comments) lives only in Postgres, in separate tables.
2. **Every addressable thing has a permanent id**: `kind:slug` for entities (`work:giselle`, `production:giselle-1841-paris`, `person:jules-perrot`), `doc:` for documents, `claim:` for claims, and `doc-id#p-xxxx` for paragraphs.
3. **Documents are as long as the argument needs.** Length is a property of a document's `form`, not a limit set by the Atlas.
4. **Compositions own order, framing, audience and time.** Documents own argument. Records own fact.
5. **Views are generated.** The map is one view among several.
6. **Facts that a view shows are claims**, cited by id from prose.
7. **Licence and status travel with the smallest unit**, and builds compute them upward.
8. **AI voices retrieve, then cite.** Every answer links to `doc#anchor` or `claim:id`, filtered by status and licence.

**Postgres tables (minimum).** `entities` (id, kind, name, fields jsonb, start/end, place, external ids), `entity_links` (from, to, relation), `claims` (id, subject, text, value jsonb, qualifiers jsonb, source_id, locator, confidence, rank, reviewed_by, reviewed_on), `claim_anchors` (claim_id, doc_id, anchor, quote, commit), `sources` (CSL-JSON plus licence and route), `assets` (id, holder, url or IIIF manifest, licence_class, sensitivity), `documents` (id, form, title, about[], status, version, licence_class, body), `chunks` (doc_id, anchor, heading path, context prefix, text, tsvector, embedding vector(384), status, licence_class, entity ids), `compositions` (id, form, manifest jsonb, version), `composition_items` (composition_id, position, ref, role). Row-level security stays as it is (no public access); views and the AI voices reach the data through the service role or narrowly scoped functions.

### 4.5 The minimum set of content types

| # | Type | What it is | Key fields | Covers |
|---|---|---|---|---|
| 1 | **Entity** | Anything the course talks about | `id`, `kind` (the 25 canon kinds + `work`, `production`, `object`, `objective`), names, dates, place, external ids (Wikidata, Getty, PeriodO), `leaves_out`, sensitivity | canon nodes, works and productions, people, places, objects, techniques, learning objectives |
| 2 | **Claim** | One citable statement | `id`, subject entity, text, value/qualifiers, source + locator, confidence, rank (preferred/normal/deprecated), `reading` (for disputes), reviewer, date, note | facts, dates, "earliest known", disputed readings, myths (with `status: myth` and the correction) |
| 3 | **Source** | A bibliographic or archival item | CSL-JSON, route, licence, commercial-safe flag, accessed | the 198 routes, 130 primary texts, ballet bibliographies |
| 4 | **Asset** | One image, clip, audio file or depth map, held or linked | holder, URL or IIIF manifest, `licence_class`, fallback, sensitivity, depicts[] | world-set images, dance clips (mostly LINK-ONLY), designs |
| 5 | **Document** | Prose written for a reader, any length | `id`, `form` (`card`, `page`, `deep-dive`, `lecture`, `chapter`, `essay`, `dispute`, `activity`, `research`), `about`, `mentions`, `status`, `version`, `derived_from`, audience lane (Maker/Briefer), depth (Orientation/Practice/Mastery), anchored body | the tiers (as a `card`), deep dives, lectures, chapters, two-reading disputes, research notes |
| 6 | **Composition** | An ordered, framed list of references | `id`, `form` (`unit`, `chapter`, `session`, `tour`, `timeline`, `map-layer`, `path`, `deck`), items (ref, role, duration, note), pinned editions, objectives, Concept DNA fields written | the thirteen-chapter unit, the whole-history timeline, tours, map layers, playlists |

A `card` is a Document with four fields (`line` ≤16 words, `label` 50–60, `story` 150–250, `deep` 600–1,200) about one entity. That keeps the tiers exactly as they are, but makes them one form among many. A `dispute` is a Document whose body states the question and two or more readings, each citing claims with `reading: A` or `reading: B`. That is lighter than Kialo, and it is the constitution's rule in structured form. The `research` form keeps the 400,000 words in the same store, retrievable by the Historian, never shown to learners as teaching.

### 4.6 How ballet maps onto it

| Ballet material now | Becomes | Notes |
|---|---|---|
| `register.yaml`, 156 rows "one per version" | **Entity** `work` (about 100–120 works) + **Entity** `production` (156+), each production `production_of` a work; premiere as an `event` entity or as claims | The ROH split. *The Sleeping Beauty* becomes one work with productions 1890, 1921 and 1946, and Spine B becomes a query |
| Fields such as premiere, choreographer, composer and designer, with confidence and sources | **Claims** about the production, cited to W- and D-file sections (the existing `sources: [W1 §1]` becomes `source + locator`) | The 137 sourced corrections of 21 November become claim revisions with dates |
| 118 deep dives (W1–W3, D1–D8) under twelve fixed headings | **Document** `deep-dive`, one file per work, `about: work:…`; the twelve headings become anchored sections | Split the eight dossiers into 118 files. "Facts worth telling" and "readings and disputes" become claims and disputes |
| `timeline_events.yaml` and `timeline.json` | **Entities/claims** for events, plus **Composition** `timeline` (query: productions and events where topic = ballet; lanes; a curated override file) | `build_timeline.py` becomes the generic timeline view |
| The thirteen-chapter unit (about 41 hours) in `BLUEPRINT.md` | **Composition** `unit` → `chapter` ×13 → `session` → items: lectures, deep dives, cards, activities, Concept DNA writes, with durations | Durations add up to the 41 hours, so the plan is checkable |
| Lectures and chapter texts | **Document** `lecture` or `chapter`, any length, anchored paragraphs, claims cited inline | No tier caps |
| X1 readings, disputes and myths | **Document** `dispute` (≥8 two-reading disputes, for example Beauchamp v. Feuillet 1704) + **Claims** with `reading` and `status: myth` | Reused by any unit (Attribution and Authority) |
| X2 design and art | **Document** `essay` per theme + **Entities** for designers, scene painters and workshops + **Assets** (designs, mostly linked) | Feeds the credit-map view |
| Scope, works and dossier research (about 400,000 words) | **Document** `research` (status research), chunked for the Historian; claims extracted over time | Not learner-facing |
| *The shoe* (page 0.3.0) | **Document** `page`, already in the target shape (`content_id`, `version`, `derived_from@sha`, `claims_register`) | The template for all the others |
| Places of premieres; routes by court, academy, émigré and touring company | **Map-layer composition** over production entities with places, and journey entities | The Atlas map, now one view |
| 156 work cards | **Document** `card` per work, with Story drafted from the register and deep dive, accepted by a person | The card deck view |

For the learner, one entity hub per work (Oxford-style) carries the card, the deep dive, every production, timeline points, disputes, claims with sources, linked images, and the chapters and sessions of the unit that use it. Every one of these is generated. The AI Historian answering "who designed the 1921 *Sleeping Princess*?" retrieves the production entity, the designer claim with its source, and the anchored paragraph of the deep dive, and cites all three.

### 4.7 First steps

1. **Write six JSON Schemas** in `schema/` (entity, claim, source, asset, document front matter, composition) by extending `canon-node.schema.json` and *The shoe*'s front matter rather than replacing them.
2. **Pilot on one work** before converting everything. *Giselle* or *The Sleeping Beauty*: split the register row into work and productions, cut its deep dive into its own anchored file, extract its claims, and build its hub page, timeline strip and card.
3. **Add the anchoring script**, which assigns paragraph ids once and never reuses them, and the claim-citation check to CI.
4. **Write the ballet unit manifest**: thirteen chapters, sessions and durations, referring to existing files.
5. **Rebuild the Supabase copy from git** (finishing the 54 unloaded seed files through the CI route), add the `chunks` table with `tsvector` and `vector(384)`, embed with an open model, and add a hybrid search function.
6. **Connect one partner voice** (the Historian) to hybrid search with status filters and require it to cite anchors. Measure answer quality against a short test set.
7. **Measure authoring burden** on the pilot (hours per work) before committing to all 156.

---

## Sources

Models of separation
- OASIS, DITA basic concepts: [dita-lang.org](https://dita-lang.org/dita/archspec/base/basic-concepts); [DITA 1.3 basic concepts (OASIS)](https://docs.oasis-open.org/dita/dita/v1.3/os/part1-base/archSpec/base/basic-concepts.html); [DITA 1.2 specification](https://docs.oasis-open.org/dita/v1.2/os/spec/DITA1.2-spec.html); [I'd Rather Be Writing on conref and mapref](https://idratherbewriting.com/2014/04/22/dita-folder-hierarchy-conref-mapref-and-more)
- NPR, [Clean content, portable content (2009)](https://www.npr.org/sections/inside/2009/02/clean_content_portable_content.html); [ProgrammableWeb, COPE (archived)](https://cybercemetery.unt.edu/oilspill/20130121135722mp_/http://blog.programmableweb.com/2009/10/13/cope-create-once-publish-everywhere); [Lullabot, Understanding COPE](https://lullabot.com/articles/understanding-create-once-publish-everywhere-cope); [Lullabot podcast with Daniel Jacobson](https://www.lullabot.com/blog/podcasts/insert-content-here/11-daniel-jacobson-nprs-cope-and-content-apis); [Blend Interactive, COPEing mechanism](https://pt.slideshare.net/blendinteractive/copeing-mechanism-the-peril-and-promise-of-create-once-publish-everywhere)
- BBC: [CMSWire interview on the BBC's adoption of semantic web technologies](https://www.cmswire.com/cms/information-management/bbcs-adoption-of-semantic-web-technologies-an-interview-017981.php); [BigOWLIM at the BBC World Cup site (W3C list)](https://lists.w3.org/Archives/Public/semantic-web/2010Jun/0143.html); [Rayfield, BBC dynamic semantic publishing](https://speakerdeck.com/jemrayfield/bbc-dynamic-semantic-publishing-sport%7Colympics-semtechbiz-uk); [BBC ontologies at IPTC](https://iptc.org/thirdparty/bbc-ontologies/); [Wildlife Ontology](https://iptc.org/thirdparty/bbc-ontologies/wo.html); [BBC Sports Refresh: Dynamic Semantic Publishing (link failed)](https://bbc.in/1SLBRLO)
- Wikidata and Wikipedia: [Help:Qualifiers](https://www.wikidata.org/wiki/Help:Qualifiers); [Help:Ranking (archived)](https://webcf.waybackmachine.org/web/20220322134249/https://www.wikidata.org/wiki/Special:MyLanguage/Help:Ranking); [Wikidata: arbitrary access](https://www.wikidata.org/wiki/Wikidata:Arbitrary_access); [Module:WikidataIB documentation](https://Www.Wikipedia.org/wiki/Module:WikidataIB/doc); [Wikipedia: 2018 Infobox RfC](https://www.Wikipedia.com/wiki/Wikipedia:Wikidata/2018_Infobox_RfC); [Hogan et al., infoboxes from Wikidata (PDF)](https://aidanhogan.com/docs/infobox-wikidata.pdf); [Wikidata data modelling (NLL2024)](https://upload.wikimedia.org/wikipedia/commons/8/83/NLL2024_-_Data_modelling_in_Wikidata.pdf)
- Museum linked data: [CIDOC CRM 7.1.3](https://cidoc-crm.org/sites/default/files/Documents/cidoc_crm_version_7.1.3.html); [CIDOC CRM (Wikipedia)](https://en.wikipedia.org/wiki/CIDOC_Conceptual_Reference_Model); [Linked Art, ICOM CIDOC working group](https://icom-documentation.mini.icom.museum/working-groups/linked-art/); [Sanderson and Newbury, Linked Art and Getty (PDF)](https://www.getty.edu/research/tools/vocabularies/sanderson_newbury_linkedartgetty.pdf); [Getty vocabularies: data and services](https://www.getty.edu/research/tools/vocabularies/lod/); [Europeana APIs introduction](https://pro.europeana.eu/resources/apis/intro); [EDM mapping guidelines 2.4 (PDF)](https://thales.cs.unipi.gr/modules/document/file.php/TMF159/EDM_Mapping_Guidelines_v2.4_102017.pdf); [IIIF Presentation API 3.0](https://iiif.io/api/presentation/); [IIIF Content State API](https://iiif.io/api/content-state/1.0/)
- Courseware: [OpenStax CNX (Wikipedia)](https://www.wikipedia.org/wiki/Cnx.org); [CNX guide (PDF)](https://www.affordablelearninggeorgia.org/documents/cnx_guide.pdf); [Open edX, OLX course building blocks](https://docs.openedx.org/en/ulmo/educators/olx/organizing-course/course-structure-overview.html); [OLX directory structure](https://docs.openedx.org/en/ulmo/educators/olx/directory-structure.html); [OLX courseware structure](https://docs.openedx.org/en/ulmo/educators/olx/organizing-course/course-xml-file.html); [LibreTexts, copy-transcluded and copy-forked remixes](https://chem.libretexts.org/Courses/Remixer_University/Construction_Guide_for_LibreTexts_2e/07%3A_Remixing/7.02%3A_Copy-Transcluded_and_Copy-Forked_Remixes); [LibreTexts, transcluding a page](https://chem.libretexts.org/Courses/Remixer_University/LibreTexts_Construction_Guide_1e/04%3A_Advanced_Editing/4.01%3A__Transcluding_(Reusing)_a_Page)
- MDN: [Page types](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Page_types); [The page-type front matter key](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Page_types/Page_type_key); [Compatibility tables and BCD](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Compatibility_tables); [mdn/content contributing guide](https://www.github.com/mdn/content/blob/main/CONTRIBUTING.md)
- Headless CMS and blocks: [Portable Text specification](https://github.com/portabletext/portabletext); [Sanity block content](https://www.sanity.io/docs/studio/block-content); [Contentful data model](https://contentful.com/developers/docs/concepts/data-model); [Contentful rich text](https://contentful.com/developers/docs/concepts/rich-text); [Strapi Content-type Builder](https://docs.strapi.io/user-docs/content-type-builder); [Strapi dynamic zones](https://strapi.io/features/dynamic-zone); [Notion, the data model behind Notion](https://www.notion.com/blog/data-model-behind-notion)
- Linked notes: [Obsidian forum, block reference](https://forum.obsidian.md/t/block-reference/674); [Obsidian forum, linking ranges of a note](https://forum.obsidian.md/t/a-general-format-for-specifying-links-to-a-part-of-note-multiple-paragraphs-ranges-embedding-multiple-consecutive-headings-or-blocks/19962)
- Learning graphs: [Khan Academy forum, what happened to the math knowledge map](https://support.khanacademy.org/hc/fr/community/posts/360058025692/comments/360012904612); [Learning Commons, learning components](https://docs.learningcommons.org/knowledge-graph/entity-and-relationship-reference/learning-components); [Learning Commons launch (EdSurge)](https://edsurge.com/news/learning-commons-launches-open-ai-platform-for-k-12-edtech); [1EdTech CASE](https://www.1edtech.org/standards/case); [CASE 1.1 implementation guide](https://standards.1edtech.org/case/guides/standards/v1p1/impl)
- Scholarly text, sources, annotation, metadata: [TEI P5 Guidelines](https://tei-c.org/Vault/P5/3.1.0/doc/tei-p5-doc/en/html/); [Stand-off annotation in TEI (PDF)](https://www.uzh.ch/cmsssl/cl/dam/jcr:9d718cb6-9460-423a-9726-1cbe359e8c9a/stand-off.pdf); [CSL for developers](https://citationstyles.org/developers/); [Citation Style Language (Wikipedia)](https://en.wikipedia.org/wiki/Citation_Style_Language); [W3C Web Annotation Data Model (Recommendation, 23 Feb 2017)](https://www.w3.org/TR/2017/REC-annotation-model-20170223/); [W3C Selectors and States](https://www.w3.org/TR/selectors-states); [schema.org learningResourceType](https://Schema.org/learningResourceType); [LRMI 1.1](https://www.dublincore.org/specifications/lrmi/1.1); [W3C wiki, LearningResources](https://www.w3.org/wiki/WebSchemas/LearningResources); [Experience API (Wikipedia)](https://en.wikipedia.org/wiki/Experience_API); [xAPI specification 1.0.0](https://github.com/adlnet/xAPI-Spec/blob/1.0.0/xAPI.md)

Precedents
- [Google Research, From Assets to Stories via the Google Cultural Institute Platform](https://research.google/pubs/from-assets-to-stories-via-the-google-cultural-institute-platform/); [Google Arts and Culture (Wikiwand)](https://wikiwand.com/en/articles/Google_Arts_and_Culture)
- [Smarthistory, our mission](https://smarthistory.org/about); [Creative Commons case study: Smarthistory](https://wiki.creativecommons.org/Case_Studies/Smarthistory)
- [The Met Collection API launch](https://www.metmuseum.org/perspectives/met-collection-api-2); [Rijksmuseum data services documentation](https://data.rijksmuseum.nl/docs/); [Rijksmuseum LDES](https://data.rijksmuseum.nl/docs/ldes); [Rijksmuseum data dumps](https://data.rijksmuseum.nl/docs/data-dumps)
- [V&A Data and APIs](https://developers.vam.ac.uk/); [V&A launches new developer API](https://www.vam.ac.uk/blog/digital/va-launches-new-developer-api); [IIIF at the V&A](https://www.vam.ac.uk/blog/digital/iiif-at-the-va); [Trialling the V&A MCP server](https://www.vam.ac.uk/blog/digital/trialing-the-va-mcp-server-a-new-way-to-search-the-va-collections)
- [Royal Opera House Collections, performance database: what's online](https://rohcollections.org.uk/Performances.aspx)
- [Histropedia, about](https://histropedia.com/about.html); [Histropedia, automatic timelines from Wikidata queries](https://histropedia.uservoice.com/knowledgebase/articles/409697); [eLearning Inside, Chronas](https://news.elearninginside.com/chronas-map-of-history-50-million-data-points/); [Running Reality, contributing history research](https://runningreality.org/docs/tutorial/history.jsp); [World History Commons review of Running Reality](https://worldhistorycommons.org/running-reality)
- [Kialo (Wikipedia)](https://en.wikipedia.org/wiki/Kialo); [Kialo Edu features](https://kialo-edu.com/features)
- [ArchieML](https://archieml.org); [ArchieML 1.0 specification](https://archieml.org/spec/1.0/CR-20200824.html); [The Pudding on GitHub](https://github.com/the-pudding); [The Pudding resources](https://pudding.cool/resources)
- [Jacob's Pillow Dance Interactive](https://danceinteractive.jacobspillow.org/); [DanceTabs, a rummage through the Dance Interactive archive](https://dancetabs.com/2021/04/an-introduction-and-rummage-through-the-jacobs-pillow-dance-interactive-archive/); [Numeridanse, about (fetch timed out)](https://numeridanse.tv/en/about); [Numeridanse, contributors](https://numeridanse.tv/en/our-contributors)
- [Minitex, Britannica School differentiated content](https://minitex.umn.edu/news/elibrary-minnesota/2022-05/elm-tips-tricks-providing-differentiated-content); [Britannica School differentiated learning leaflet](https://britannica.co.uk/wp-content/uploads/Differentiated_Learning_B-School_leaflet.pdf)
- [OUPblog, why reference works are still important](https://blog.oup.com/2012/09/why-are-reference-works-still-important/); [OUPblog on Oxford Reference](https://blog.oup.com/?p=29015)
- [Seshat, how we work](https://seshatdatabank.info/methods); [Seshat code book (PDF)](https://seshatdatabank.web.ox.ac.uk/sitefiles/code-book-4.20.2021.pdf)

Retrieval and infrastructure
- [Anthropic, Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval?utm_source=tldrai)
- [Supabase, hybrid search](https://supabase.com/docs/guides/ai/hybrid-search); [Supabase, RAG with permissions](https://supabase.com/docs/guides/ai/rag-with-permissions); [Supabase, running AI models in Edge Functions](https://supabase.com/docs/guides/functions/ai-models); [Supabase pricing](https://supabase.com/pricing)

Creative World files read: `README.md`; `modules/F1-histories-of-making/atlas/README.md`; `supabase/README.md`; `schema/canon-node.schema.json`; `modules/F1-histories-of-making/topics/ballet/` (`MANIFEST.md`, `CONTENT_INDEX.md`, `planning/UNIT_PLAN.md`, `planning/REPERTORY_PLAN.md`, `research/RESEARCH_SCHEMA.md`, `research/repertory/register.yaml`, `research/repertory/timeline_events.yaml`, `learner/the-shoe/the-shoe.md`).

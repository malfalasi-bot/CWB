# Verification notes (2026-09-28)

**Checked:** licence, terms and pricing pages, read with WebSearch, WebFetch and Firecrawl. `sources_zero_cost.csv` has 198 routes: 74 verified, 29 partly verified, 95 unverified. Verified rows cite the URL read. Unverified rows make no licence claim; where a licence is well known it says "(not re-verified)". Starred routes I could not read: Hermitage (fetch blocked), INAH (terms page redirects), AODL (no terms found). `primary_texts.csv` has 130 texts. Their copyright status is my own assessment, using the rule "US publication in 1930 or earlier = public domain".

## Five key findings

1. **Big "free" routes you can link to but not host if the app ever charges:**
   - British Museum images and its Sketchfab models (CC BY-NC-SA 4.0)
   - V&A (non-commercial, 768 px maximum, must use the V&A's own image link)
   - Digital Bodleian, which holds the Codex Mendoza (CC BY-NC)
   - Gallica (commercial reuse is paid)
   - Smarthistory and Khan Academy (BY-NC-SA)
   - EMKP (BY-NC-SA)
   - Seshat (NC-SA)
   - SlaveVoyages: imputed data and Estimates are BY-NC; the historical data is public domain
   - IDP (non-commercial by default)
   - QDL (commercial use needs consent)
   - Pitt Rivers and Harvard Art Museums
   - David Rumsey maps
   - GADM (use geoBoundaries, CC BY 4.0, instead)
   - Science Museum Group images

2. **Local Contexts: zero cost is possible, with limits.** Since 2025 you need a subscription to create Notices. Two options are free:
   - an **Individual researcher** account: 1 user, no API key, 10 Projects and 12 notifications a year
   - **Collections Care Notices** for institutions

   Paid tiers cost US$1,250, US$5,000 and US$10,000 a year. Only Indigenous communities apply Labels, through their own accounts. A small programme can pay nothing but has to place Notices by hand.

3. **3D:**
   - Smithsonian models are CC0 only where marked; the rest are view-only.
   - British Museum Sketchfab models are NC-SA.
   - The Sketchfab CC0 programme, Scan the World and MorphoSource vary model by model.
   - Host only models marked CC0.

4. **Access has tightened:**
   - A free JSTOR account now reads **10 articles every 30 days**, not 100.
   - OpenAlex requires a key and gives US$1 of usage a day free. Its data is still CC0.
   - Since 17 March 2026, DOAJ charges for up-to-date bulk feeds. Its API stays free.
   - Since April 2025, Trove has enforced its 2020 API terms, which bar downloading content.
   - HathiTrust `pdus` volumes are viewable in the US only.

5. **Indigenous-material rules override open licences:**
   - Te Papa limits taonga Māori images to research, study and education.
   - Auckland Museum limits Māori and Pacific images to personal research, although its other images are CC BY 4.0.
   - Digital Benin keeps each lending museum's own licence.
   - The National Museum of Korea e-museum is non-commercial by default, but items marked KOGL Type 1 allow commercial use. Check each item.

## Surprises
- Tropenmuseum files on Commons are CC BY-SA 3.0 (51,506 files, "KIT-license"). Commercial use is allowed, but adapted versions must keep the licence.
- The Getty vocabularies are ODC-By (credit required), not CC0.
- The Art Institute of Chicago's `description` field is CC BY; the rest of its data is CC0.
- National Jukebox recordings made before 1923 became public domain in 2022; later ones need rightsholder permission.
- The Open Khipu Repository states no licence.

## Next
- Verify Hermitage, INAH, AODL, Archnet, the UNESCO ICH data licence, Perseus, and the Making and Knowing edition licence.
- Check the copyright status of Smith & Gnudi's *Pirotechnia* (1942), Acharya's *Manasara* (1933–34) and Minorsky's Qadi Ahmad (1959).

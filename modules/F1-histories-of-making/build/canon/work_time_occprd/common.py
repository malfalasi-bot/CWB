import csv

HEADER = "id,name,other_names,kind,family,world,sub_regions,start,end,date_note,making_significance,materials_techniques,object_types,functions,defined_by,leaves_out,sensitivity,free_sources,tier,units,confidence,notes".split(",")

SRC = {
    "WC": "Wikimedia Commons",
    "MET": "Met Open Access (CC0)",
    "CMA": "Cleveland Museum of Art Open Access (CC0)",
    "AIC": "Art Institute of Chicago (CC0 public-domain works)",
    "SI": "Smithsonian Open Access (CC0 where designated)",
    "RIJ": "Rijksmuseum (CC0/PDM)",
    "EUR": "Europeana (per-item rights)",
    "LOC": "Library of Congress (per-item rights; many public domain)",
    "NARA": "US National Archives Catalog",
    "IA": "Internet Archive (public-domain texts)",
    "HT": "HathiTrust full view",
    "WS": "Wikisource",
    "YCBA": "Yale Center for British Art (public-domain images)",
    "BL": "British Library public-domain images (Flickr Commons)",
    "LEG": "official text of the law (government legislation site; link-out)",
    "UN": "UNESCO/UN instrument texts (link-out)",
    "PER": "PeriodO (period gazetteer; link-out)",
    "OA": "open-access excavation reports",
    "CB": "ColBase (Japan Government Standard Terms)",
    "NDL": "NDL Digital Collections (public-domain items)",
    "JS": "Japan Search",
    "NPM": "National Palace Museum Taipei Open Data (CC BY 4.0)",
    "KOGL": "KOGL Type 1 images on Wikimedia Commons",
    "KYU": "Kyujanggak / Uigwe (link-out)",
    "DB": "Digital Benin (each lender's licence)",
    "TP": "Te Papa Collections Online (per-item; taonga restricted)",
    "CDLI": "Cuneiform Digital Library Initiative (link-out)",
    "LINK": "collection search link-out only",
    "WALT": "Walters Art Museum (CC0)",
    "LACMA": "LACMA public-domain images",
    "GETTY": "Getty Museum Open Content (CC0)",
    "TRP": "Tropenmuseum images on Wikimedia Commons (CC BY-SA)",
    "DPLA": "Digital Public Library of America",
    "ARCH": "Archnet (link-out)",
    "QDL": "Qatar Digital Library (link-out)",
    "DLME": "Digital Library of the Middle East",
    "EAP": "British Library Endangered Archives Programme",
    "ZAM": "Zamani Project (link-out)",
    "INAH": "INAH Mediateca (link-out)",
    "BND": "BNDigital (Biblioteca Nacional do Brasil)",
    "DNZ": "DigitalNZ",
    "TROVE": "Trove (link-out)",
    "NGA": "National Gallery of Art (US) Open Access",
    "ICH": "UNESCO Dive into Intangible Cultural Heritage (link-out)",
    "WHC": "UNESCO World Heritage List data (link-out)",
    "SV": "SlaveVoyages (historical data public domain)",
    "CTEXT": "Chinese Text Project (link-out)",
    "IDP": "International Dunhuang Programme (link-out; non-commercial)",
    "IC": "Indian Culture portal (per-owner licence)",
    "SMB": "Staatliche Museen zu Berlin (SMB-digital)",
    "PM": "Paris Musées (Open Content)",
    "WEL": "Wellcome Collection",
    "SMK": "SMK Open",
    "BRK": "Brooklyn Museum Open Collection",
    "PRA": "Princeton University Art Museum (public-domain images)",
    "NYPL": "NYPL Digital Collections (public domain)",
    "WHCOM": "World History Commons",
    "CH": "Cooper Hewitt collection data",
    "SMG": "Science Museum Group Collection (link-out)",
    "KB": "Korean national e-museum (KOGL Type 1 items only)",
    "PD": "public-domain primary texts",
    "OSF": "open-access journals (DOAJ, SciELO, Persée)",
}


def expand_sources(s):
    out = []
    for tok in [t.strip() for t in s.split(";") if t.strip()]:
        out.append(SRC.get(tok, tok))
    return "; ".join(out)


def parse(block, prefix, kind, family, start_n=1):
    rows = []
    n = start_n
    for line in block.strip().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        f = [x.strip() for x in line.split("|")]
        if len(f) != 19:
            raise ValueError(f"{len(f)} fields: {line[:80]}")
        (name, other, world, subr, start, end, dnote, sig, mt, ot, fn,
         defby, leaves, sens, srcs, tier, units, conf, notes) = f
        for v in (start, end):
            if v and not v.lstrip("-").isdigit():
                raise ValueError(f"bad year {v} in {name}")
        rows.append({
            "id": f"{prefix}{n:03d}", "name": name, "other_names": other,
            "kind": kind, "family": family, "world": world,
            "sub_regions": subr, "start": start, "end": end,
            "date_note": dnote, "making_significance": sig,
            "materials_techniques": mt, "object_types": ot,
            "functions": fn, "defined_by": defby, "leaves_out": leaves,
            "sensitivity": sens or "none", "free_sources": expand_sources(srcs),
            "tier": tier, "units": units, "confidence": conf, "notes": notes,
        })
        n += 1
    return rows


def write(rows, path):
    with open(path, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=HEADER, quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        for r in rows:
            w.writerow(r)

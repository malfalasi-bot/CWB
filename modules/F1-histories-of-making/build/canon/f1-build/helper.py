import csv, sys, collections

HEADER = "id,name,other_names,kind,family,world,sub_regions,start,end,date_note,making_significance,materials_techniques,object_types,functions,defined_by,leaves_out,sensitivity,free_sources,tier,units,confidence,notes".split(",")

SUBS = set("""AF-EGY AF-NUB AF-MAG AF-SAH AF-GUI AF-CEN AF-HRN AF-SWA AF-SOU AF-MAD
AM-ARC AM-NWC AM-WST AM-EWD AM-MES AM-CAM AM-CAR AM-AND AM-AMZ AM-LAT
AS-CHN AS-KOR AS-JPN AS-SAS AS-HIM AS-MSE AS-ISE AS-CEN AS-NTH
WA-MES WA-IRN WA-LEV WA-ARB WA-ANA WA-CAU
EU-GRR EU-BYZ EU-WCE EU-BLC EU-IBE EU-EER EU-SCA
OC-AUS OC-MEL OC-MIC OC-POL GL""".split())
WORLDS = set("F1.6 F1.7 F1.8 F1.9 F1.9a F1.10 F1.11 F1.12 F1.12a F1.13 THEME".split())
FUNCS = set(["shelter","clothing and adornment","food and storage","tools","record and writing","exchange and value","ritual and belief","rule and display","war","play and music","care and access","transport"])
SENS = set("none sacred funerary ancestral Indigenous-community human-flow conflict-looting living-community".split())
UNITS = set("F1.2 F1.3 F1.4 F1.5 F1.13 F1.14 F1.15 F1.16 F1.17 F1.18 F1.19 F1.19a F1.20 F1.21 F1.22 F1.22a F1.23 F1.24 F1.26 F1.28 F1.28a F1.29 F1.30".split())

SRC = {
'MET':'Met Open Access (CC0)',
'CMA':'Cleveland Museum of Art Open Access (CC0)',
'SI':'Smithsonian Open Access (CC0)',
'NMNH':'Smithsonian NMNH Anthropology via Smithsonian Open Access (CC0 where marked)',
'RIJKS':'Rijksmuseum (public-domain images)',
'AIC':'Art Institute of Chicago (CC0 images)',
'NGA':'National Gallery of Art Washington Open Access (CC0)',
'WALT':'Walters Art Museum (CC0)',
'YALE':'Yale University Art Gallery (public-domain images)',
'LACMA':'LACMA (public-domain images)',
'MIA':'Minneapolis Institute of Art (public-domain images)',
'SMK':'SMK National Gallery of Denmark (CC0)',
'PARIS':'Paris Musées (CC0)',
'COOPER':'Cooper Hewitt via Smithsonian Open Access (CC0 where marked)',
'WC':'Wikimedia Commons',
'EUR':'Europeana',
'WD':'Wikidata (link out)',
'PERIODO':'PeriodO (link out)',
'BMLINK':'British Museum collection online (link out; images not CC0)',
'EMKP':'British Museum EMKP (CC)',
'VALINK':'V&A collections (link out)',
'OA':'open-access excavation reports',
'OAJ':'open-access journal articles',
'KOGL':'National Museum of Korea e-museum (KOGL Type 1 where marked)',
'COLBASE':'ColBase Japan national museums (Japan Government Standard Terms)',
'NPM':'National Palace Museum Taipei Open Data',
'LOC':'Library of Congress (public-domain items)',
'NYPL':'NYPL Digital Collections (public-domain items)',
'SLAVE':'SlaveVoyages database (free; link out)',
'ENSLAVED':'Enslaved.org (free; link out)',
'TEPAPA':'Te Papa Collections Online (CC BY where marked; otherwise link out)',
'AUCK':'Auckland Museum Online Collection (CC BY where marked)',
'BHL':'Biodiversity Heritage Library (public domain)',
'IA':'Internet Archive (public-domain texts)',
'HATHI':'HathiTrust (public-domain full view)',
'GALLICA':'Gallica BnF (public-domain items)',
'CDLI':'Cuneiform Digital Library Initiative (link out)',
'UNESCO':'UNESCO World Heritage / Intangible Cultural Heritage pages (link out)',
'OCON':'Open Context (CC BY)',
'ADS':'Archaeology Data Service (open reports)',
'CHACO':'Chaco Research Archive (free; link out)',
'IDP':'International Dunhuang Programme (link out)',
'GENIZA':'Cambridge Digital Library Taylor-Schechter Genizah (link out)',
'NDL':'National Diet Library Digital Collections (public-domain items)',
'HAR':'Himalayan Art Resources (link out)',
'PATENT':'Google Patents / national patent offices (public documents)',
'MOMA':'MoMA collection (link out; metadata CC0)',
'COMM':'community-published site',
'DPLA':'Digital Public Library of America',
'NLA':'Trove National Library of Australia (link out; public-domain items where marked)',
'SMB':'Staatliche Museen zu Berlin SMB-digital (CC BY-SA where marked)',
'NMAI':'Smithsonian NMAI (link out; many items restricted)',
'PITT':'Pitt Rivers Museum (link out)',
'HARV':'Harvard Art Museums (link out)',
'FLICKR':'Flickr Commons (no known copyright restrictions)',
'BL':'British Library (public-domain digitised items)',
'QDL':'Qatar Digital Library (licence per item; check)',
'BROOK':'Brooklyn Museum (licence per item; check)',
'USGS':'USGS Mineral Commodity Summaries (US public domain)',
'NHM':'Natural History Museum London Data Portal (CC0 data)',
'MINDAT':'Mindat (link out)',
'NASA':'NASA imagery (US public domain)',
}

def build(rows_text, prefix_default, kind_default, family, path, has_kind=False, kind_prefix=None):
    out = []
    counters = collections.Counter()
    errs = []
    for ln, line in enumerate(rows_text.strip().split("\n")):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        f = [x.strip() for x in line.split("|")]
        if has_kind:
            kcode = f.pop(0)
            kind = kind_prefix[kcode]
            prefix = kcode
        else:
            kind = kind_default; prefix = prefix_default
        if len(f) != 19:
            errs.append((ln, len(f), line[:80])); continue
        (name, other, world, subs, start, end, dnote, sig, mt, ot, funcs, defby, lo, sens, srcs, tier, units, conf, notes) = f
        for w in world.split(";"):
            if w not in WORLDS: errs.append((name, "world", w))
        for s in subs.split(";"):
            if s not in SUBS: errs.append((name, "sub", s))
        for fn in funcs.split(";"):
            if fn not in FUNCS: errs.append((name, "func", fn))
        for s in (sens or "none").split(";"):
            if s not in SENS: errs.append((name, "sens", s))
        if units:
            for u in units.split(";"):
                if u not in UNITS: errs.append((name, "unit", u))
        if tier not in ("R1","R2","R3"): errs.append((name,"tier",tier))
        if conf not in ("high","medium","low"): errs.append((name,"conf",conf))
        for d in (start, end):
            if d and not d.lstrip("-").isdigit(): errs.append((name,"date",d))
        srcl = []
        for t in srcs.split(";"):
            t = t.strip()
            if not t: continue
            v=SRC.get(t, t)
            if v not in srcl: srcl.append(v)
        counters[prefix] += 1
        rid = "%s%03d" % (prefix, counters[prefix])
        out.append([rid, name, other, kind, family, world, subs, start, end, dnote, sig, mt, ot, funcs, defby, lo, sens or "none", "; ".join(srcl), tier, units, conf, notes])
    if errs:
        for e in errs: print("ERR", e)
        sys.exit(1)
    names = [r[1] for r in out]
    dup = [n for n,c in collections.Counter(names).items() if c>1]
    if dup: print("DUP", dup); sys.exit(1)
    with open(path, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, quoting=csv.QUOTE_MINIMAL)
        w.writerow(HEADER)
        w.writerows(out)
    wc = collections.Counter()
    for r in out:
        for w_ in r[5].split(";"): wc[w_] += 1
    tc = collections.Counter(r[18] for r in out)
    print(path, len(out), dict(counters), dict(sorted(wc.items())), dict(tc))

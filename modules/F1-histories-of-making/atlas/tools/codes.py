"""Controlled vocabularies for the F1 canon. One place, imported by every tool."""

HEADER = ("id,name,other_names,kind,family,world,sub_regions,start,end,date_note,making_significance,"
          "materials_techniques,object_types,functions,defined_by,leaves_out,sensitivity,free_sources,tier,"
          "units,confidence,notes").split(",")

SUB_REGIONS = {
    "AF-EGY": "Egypt", "AF-NUB": "Nubia and Sudan", "AF-MAG": "Maghrib", "AF-SAH": "Sahel and Western Sudan",
    "AF-GUI": "Guinea Coast", "AF-CEN": "Central Africa", "AF-HRN": "Ethiopia and the Horn",
    "AF-SWA": "Swahili coast and East African interior", "AF-SOU": "Southern Africa",
    "AF-MAD": "Madagascar and Indian Ocean islands",
    "AM-ARC": "Arctic", "AM-NWC": "Northwest Coast", "AM-WST": "North American West", "AM-EWD": "Eastern Woodlands",
    "AM-MES": "Mesoamerica", "AM-CAM": "Central America", "AM-CAR": "Caribbean", "AM-AND": "Andes and Pacific coast",
    "AM-AMZ": "Amazonia and lowland South America", "AM-LAT": "Colonial and modern Latin America",
    "AS-CHN": "China", "AS-KOR": "Korea", "AS-JPN": "Japan", "AS-SAS": "South Asia", "AS-HIM": "Himalaya and Tibet",
    "AS-MSE": "Mainland Southeast Asia", "AS-ISE": "Island Southeast Asia", "AS-CEN": "Central Asia and the steppe",
    "AS-NTH": "North Asia and Siberia",
    "WA-MES": "Mesopotamia", "WA-IRN": "Iran", "WA-LEV": "Levant", "WA-ARB": "Arabia and the Gulf",
    "WA-ANA": "Anatolia", "WA-CAU": "Caucasus",
    "EU-GRR": "Greek and Roman Mediterranean", "EU-BYZ": "Byzantium and the Balkans",
    "EU-WCE": "Western and Central Europe", "EU-BLC": "Britain, Ireland and the Low Countries", "EU-IBE": "Iberia",
    "EU-EER": "Eastern Europe and Russia", "EU-SCA": "Scandinavia, the Baltic and Sapmi",
    "OC-AUS": "Australia", "OC-MEL": "Melanesia", "OC-MIC": "Micronesia", "OC-POL": "Polynesia",
    "GL": "Global or many",
}

# Eleven period bands: (code, label, start inclusive, end exclusive). Years are signed (BCE negative).
BANDS = [
    ("B01", "before 8000 BCE", -10_000_000, -8000), ("B02", "8000-4000 BCE", -8000, -4000),
    ("B03", "4000-2000 BCE", -4000, -2000), ("B04", "2000-1000 BCE", -2000, -1000),
    ("B05", "1000 BCE-1 CE", -1000, 1), ("B06", "1-500", 1, 500), ("B07", "500-1000", 500, 1000),
    ("B08", "1000-1400", 1000, 1400), ("B09", "1400-1700", 1400, 1700), ("B10", "1700-1900", 1700, 1900),
    ("B11", "1900-now", 1900, 3000),
]

# Cells known to have no people in them yet; the coverage report shows them as absences, not gaps.
NO_PEOPLE_YET = {("OC-MIC", "B01"), ("OC-MIC", "B02"), ("AM-LAT", "B01")}

WORLDS = {"F1.6", "F1.7", "F1.8", "F1.9", "F1.9a", "F1.10", "F1.11", "F1.12", "F1.12a", "F1.13", "THEME"}

FUNCTIONS = {"shelter", "clothing and adornment", "food and storage", "tools", "record and writing",
             "exchange and value", "ritual and belief", "rule and display", "war", "play and music",
             "care and access", "transport"}

SENSITIVITY = {"none", "sacred", "funerary", "ancestral", "Indigenous-community", "human-flow",
               "conflict-looting", "living-community"}

TIERS = {"R1", "R2", "R3"}
CONFIDENCE = {"high", "medium", "low"}

# Words that signal coerced labour in prose; a row using them must carry the human-flow flag.
COERCION_WORDS = ["enslaved", "slavery", "slave ", "slaves", "forced labour", "forced labor", "indentured",
                  "corvée", "corvee", "convict labour", "coerced", "trafficked", "trafficking", "captive"]

# The program's writing standard, rule 9, and the AI-filler list.
BANNED_PHRASES = ["primitive", "tribal", "lost civilisation", "lost civilization", "exotic", "mysterious",
                  "rich tapestry", "testament to", "stands as a", "ancient wisdom", "iconic", "stunning"]

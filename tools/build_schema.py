#!/usr/bin/env python3
"""Generate schema/canon-node.schema.json from the canon vocabularies (codes.py), so the schema never drifts.

Usage: python tools/build_schema.py [--check]
--check exits 1 if the committed schema differs from what the vocabularies produce (used in CI).
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "modules", "F1-histories-of-making", "atlas", "tools"))
import codes  # noqa: E402

# Id prefix -> kind(s). GAP rows are round-2 additions of several kinds and keep their prefix.
PREFIXES = {
    "CIV": ["civilisation-as-commonly-named"], "ARC": ["archaeological-culture"], "HOR": ["horizon"],
    "ISP": ["interaction-sphere"], "POL": ["polity"], "DYN": ["dynasty"], "BEL": ["belief-tradition"],
    "MOV": ["movement"], "STY": ["style"], "SCH": ["school"], "MKR": ["maker-community"],
    "INS": ["institution"], "EVT": ["event"], "OCC": ["event"], "NET": ["network"], "DIA": ["diaspora"],
    "TEC": ["technique"], "MAT": ["material"], "OBT": ["object-type"], "PRA": ["living-practice"],
    "INV": ["first-known"], "COM": ["community"], "PER": ["person"], "PLC": ["place"], "PRD": ["period", "calendar-or-era"],
    "GAP": ["event", "institution", "maker-community", "movement", "network", "object-type", "style", "technique"],
}
KINDS = sorted({k for v in PREFIXES.values() for k in v})
SEMI = "Several values are separated by semicolons."

def build():
    return {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://github.com/creative-world/schema/canon-node.schema.json",
        "title": "Canon node",
        "description": ("One row of the canon register: a named thing the Atlas can point to. Stored as CSV "
                        "(one file per family), one schema for every kind. Generated from codes.py; do not edit by hand."),
        "type": "object",
        "required": ["id", "name", "kind", "world", "tier", "confidence"],
        "additionalProperties": False,
        "properties": {
            "id": {"type": "string", "pattern": "^(" + "|".join(sorted(PREFIXES)) + ")[0-9]{3}$",
                   "description": "Prefix names the family; see x-prefixes."},
            "name": {"type": "string", "minLength": 1, "description": "The community's own name first where one exists."},
            "other_names": {"type": "string", "description": "Exonyms, spellings, older names. " + SEMI},
            "kind": {"enum": KINDS},
            "family": {"type": "string", "description": "Grouping family within the kind (e.g. 'Andes', 'porcelain')."},
            "world": {"enum": sorted(codes.WORLDS), "description": "The F1 world chapter that carries the node, or THEME."},
            "sub_regions": {"type": "string", "description": "Codes from x-sub-regions. " + SEMI},
            "start": {"type": ["integer", "string"], "description": "Signed year, BCE negative; empty if unknown."},
            "end": {"type": ["integer", "string"], "description": "Signed year; empty for ongoing."},
            "date_note": {"type": "string", "description": "The source's own qualifier: 'about', 'by', 'contested'."},
            "making_significance": {"type": "string", "description": "Why it matters for making, one or two sentences."},
            "materials_techniques": {"type": "string", "description": SEMI},
            "object_types": {"type": "string", "description": SEMI},
            "functions": {"type": "string", "description": "From x-functions. " + SEMI},
            "defined_by": {"type": "string", "description": "Who drew the grouping, and when (a period or label is a definition by a source)."},
            "leaves_out": {"type": "string", "description": "What the name or grouping leaves out. Required for civilisations, polities and movements."},
            "sensitivity": {"type": "string", "description": "From x-sensitivity. " + SEMI},
            "free_sources": {"type": "string", "description": "Zero-cost routes to read or show it. " + SEMI},
            "tier": {"enum": sorted(codes.TIERS), "description": "R1 walk; R2 card with member grid; R3 card with link."},
            "units": {"type": "string", "description": "Units that use it, e.g. F1.6; F1.14. " + SEMI},
            "confidence": {"enum": sorted(codes.CONFIDENCE)},
            "notes": {"type": "string"},
        },
        "allOf": [{
            "if": {"properties": {"kind": {"enum": ["civilisation-as-commonly-named", "polity", "movement"]}}},
            "then": {"required": ["leaves_out"], "properties": {"leaves_out": {"minLength": 1}}},
        }],
        "x-column-order": codes.HEADER,
        "x-prefixes": PREFIXES,
        "x-sub-regions": codes.SUB_REGIONS,
        "x-period-bands": [{"code": c, "label": l, "start": s, "end": e} for c, l, s, e in codes.BANDS],
        "x-functions": sorted(codes.FUNCTIONS),
        "x-sensitivity": sorted(codes.SENSITIVITY),
        "x-banned-phrases": codes.BANNED_PHRASES,
        "x-coercion-words": codes.COERCION_WORDS,
    }

if __name__ == "__main__":
    out = os.path.join(ROOT, "schema", "canon-node.schema.json")
    text = json.dumps(build(), indent=2, ensure_ascii=False) + "\n"
    if "--check" in sys.argv:
        same = os.path.exists(out) and open(out, encoding="utf-8").read() == text
        print("schema in sync" if same else "schema out of date: run python tools/build_schema.py")
        sys.exit(0 if same else 1)
    open(out, "w", encoding="utf-8").write(text)
    print("wrote", out)

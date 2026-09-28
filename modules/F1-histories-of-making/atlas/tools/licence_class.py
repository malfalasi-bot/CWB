"""The licence switch (decision 23, Q39): six licence classes and two builds from one dataset.

Classes
  PD-CC0         public domain or CC0                          open build: yes   commercial build: yes
  NATIONAL-OPEN  KOGL Type 1, Japan Government Standard Terms  yes               yes
  ATTRIBUTION    CC BY, CC BY-SA (credit; BY-SA keeps licence) yes               yes
  OWN            our own drawings, maps, diagrams, photographs yes               yes
  PERMISSION-NC  free use granted for education, or CC BY-NC   yes, if a grant   no
  LINK-ONLY      everything else: linked, never hosted         link              link

Every PERMISSION-NC or LINK-ONLY item used in a walk must name a fallback (an open object of the same
kind, our own drawing, a living practice, or a link out), so the commercial build never leaves a hole.
"""
from __future__ import annotations

import re

HOSTABLE = {"PD-CC0", "NATIONAL-OPEN", "ATTRIBUTION", "OWN"}


def classify(licence: str) -> str:
    s = (licence or "").strip().lower()
    if not s:
        return "LINK-ONLY"
    if re.search(r"\bnot public domain\b|copyright|all rights reserved|permission", s):
        return "LINK-ONLY"
    if re.search(r"\bnc\b|non-?commercial", s):
        return "PERMISSION-NC"
    if re.search(r"\bnd\b|no-?deriv", s):
        return "LINK-ONLY"
    if re.search(r"cc0|public domain|no known copyright", s):
        return "PD-CC0"
    if re.search(r"kogl type 1|government standard terms", s):
        return "NATIONAL-OPEN"
    if re.search(r"cc by(-sa)?\b|cc-by", s):
        return "ATTRIBUTION"
    if s in ("own", "our own work"):
        return "OWN"
    return "LINK-ONLY"


def allowed(licence_class: str, build: str, has_grant: bool = False) -> str:
    """Return 'host', 'link' or 'drop' for an item in the given build ('open' or 'commercial')."""
    if licence_class in HOSTABLE:
        return "host"
    if licence_class == "PERMISSION-NC":
        return "host" if (build == "open" and has_grant) else "link"
    return "link"

#!/usr/bin/env python3
"""Convert a Claude Docs tab (the XML returned by the Docs connector's `read`) to Markdown.

Usage: docs_xml_to_md.py <saved tool result or .xml file> <out.md>
The input may be the raw XML or the connector's JSON envelope ({"data": {"xml": ...}}).
Standard library only.
"""
import json, re, sys
import xml.etree.ElementTree as ET

INLINE_MARKS = {"bold": "**", "italic": "*", "strike": "~~", "code": "`"}

def load_xml(path):
    raw = open(path, encoding="utf-8").read().strip()
    if raw.startswith("{"):
        obj = json.loads(raw)
        d = obj.get("data", obj)
        raw = d.get("xml") or d.get("value", {}).get("xml")
    # attribute quotes are single; ElementTree handles that. Unescaped & in text is escaped by the service.
    return ET.fromstring(raw)

def esc_cell(t):
    return t.replace("|", "\\|").replace("\n", "<br>")

def inline(el):
    """Render inline content of an element (text runs, marks, links, chips)."""
    out = []
    if el.text:
        out.append(el.text)
    for ch in el:
        tag = ch.tag
        if tag in INLINE_MARKS:
            inner = inline(ch)
            m = INLINE_MARKS[tag]
            if inner.strip():
                lead = inner[: len(inner) - len(inner.lstrip())]
                trail = inner[len(inner.rstrip()):]
                out.append(f"{lead}{m}{inner.strip()}{m}{trail}")
            else:
                out.append(inner)
        elif tag == "link":
            out.append(f"[{inline(ch)}]({ch.get('href','')})")
        elif tag == "text":
            out.append(inline(ch))
        elif tag == "date":
            out.append(ch.get("value", ""))
        elif tag == "mention":
            out.append("@" + (ch.get("name") or ch.get("label") or ch.get("user", "")))
        elif tag in ("br", "hardBreak"):
            out.append("  \n")
        else:
            out.append(inline(ch))
        if ch.tail:
            out.append(ch.tail)
    return "".join(out)

def block(el, depth=0):
    tag = el.tag
    if tag == "paragraph":
        txt = inline(el)
        h = el.get("heading")
        if h:
            return "#" * int(h) + " " + txt.strip()
        return txt
    if tag == "list":
        kind = el.get("kind", "bullet")
        lines = []
        n = 0
        for item in el:
            if item.tag != "listItem":
                continue
            n += 1
            if kind == "ordered":
                marker = f"{n}. "
            elif kind == "check":
                marker = "- [x] " if item.get("checked") == "true" else "- [ ] "
            else:
                marker = "- "
            pad = "   " * depth
            first = True
            for sub in item:
                if sub.tag == "list":
                    lines.append(block(sub, depth + 1))
                else:
                    t = block(sub, depth + 1)
                    if first:
                        lines.append(pad + marker + t)
                        first = False
                    else:
                        lines.append(pad + "   " + t)
        return "\n".join(lines)
    if tag == "table":
        rows = [r for r in el if r.tag == "row"]
        grid = []
        for r in rows:
            cells = []
            for c in r:
                if c.tag != "cell":
                    continue
                parts = [block(p, 0) for p in c]
                cells.append(esc_cell(" ".join(x.strip() for x in parts if x.strip())))
            grid.append(cells)
        if not grid:
            return ""
        width = max(len(r) for r in grid)
        grid = [r + [""] * (width - len(r)) for r in grid]
        out = ["| " + " | ".join(grid[0]) + " |", "|" + "---|" * width]
        for r in grid[1:]:
            out.append("| " + " | ".join(r) + " |")
        return "\n".join(out)
    if tag in ("quote", "blockquote"):
        inner = "\n\n".join(block(c, depth) for c in el)
        return "\n".join("> " + l for l in inner.splitlines())
    if tag in ("codeBlock", "code_block", "codeblock"):
        return "```" + (el.get("language") or "") + "\n" + "".join(el.itertext()) + "\n```"
    if tag in ("divider", "hr", "rule"):
        return "---"
    if tag == "embed":
        cap = el.get("caption") or ""
        return f"*[Embedded: {el.get('ref','')}{' — ' + cap if cap else ''}]*"
    if tag == "image":
        return f"![{el.get('alt','')}]({el.get('src') or el.get('ref','')})"
    if tag == "gap":
        return "*[…]*"
    # unknown block: keep its text
    return inline(el)

def convert(root):
    blocks = [block(c) for c in root]
    return "\n\n".join(b for b in blocks if b is not None).strip() + "\n"

if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    md = convert(load_xml(src))
    open(dst, "w", encoding="utf-8").write(md)
    print(f"{dst}: {len(md)} chars")

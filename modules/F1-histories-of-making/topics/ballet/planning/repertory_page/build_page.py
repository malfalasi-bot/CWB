"""Assemble ballet-repertory.html from the page source, the widget and the timeline data.

    python3 build_page.py
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = HERE.parents[1] / "research" / "repertory" / "timeline.json"

src = (HERE / "ballet-repertory.src.html").read_text(encoding="utf8")
css = (HERE / "timeline_widget.css").read_text(encoding="utf8")
js = (HERE / "timeline_widget.js").read_text(encoding="utf8")
data = json.loads(DATA.read_text(encoding="utf8"))
threads = json.loads((HERE / "threads.json").read_text(encoding="utf8"))

# Only the fields the widget reads, to keep the page small.
keep = ("id", "title", "orig", "year", "date", "place", "choreographer", "composer", "designer", "premise",
        "era", "lane", "threads", "parent", "depth", "confidence")
slim = dict(data)
slim["works"] = [{k: w.get(k) for k in keep} for w in data["works"]]
slim["events"] = [{k: e.get(k) for k in ("year", "when", "place", "title", "lane", "confidence", "note", "source")}
                  for e in data["events"]]

payload = ("window.TL=" + json.dumps(slim, ensure_ascii=False, separators=(",", ":")) + ";window.TL_THREADS="
           + json.dumps(threads, ensure_ascii=False) + ";").replace("</", "<\\/")
html = (src.replace("/*WIDGET_CSS*/", css).replace("/*WIDGET_DATA*/", payload).replace("/*WIDGET_JS*/", js))
(HERE / "ballet-repertory.html").write_text(html, encoding="utf8")
print("ballet-repertory.html", round(len(html.encode()) / 1024), "KB")

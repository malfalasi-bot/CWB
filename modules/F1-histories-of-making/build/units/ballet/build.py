#!/usr/bin/env python3
"""Builds the ballet unit's pages from the prose (the-shoe.md) and the register (ballet.yaml):
a learner view and an editor view from one source. Run from the module root."""
import re, html, yaml, pathlib, datetime
ROOT = pathlib.Path(__file__).resolve().parents[3]
SRC = pathlib.Path(__file__).parent / "the-shoe.md"
REG = ROOT / "atlas/data/register/units/ballet.yaml"
OUT = pathlib.Path(__file__).parent / "dist"; OUT.mkdir(exist_ok=True)
TOK = (ROOT / "skills/hom-design-toolbox/references/tokens.css").read_text(encoding="utf8")
reg = yaml.safe_load(REG.read_text(encoding="utf8"))
md = SRC.read_text(encoding="utf8")

# which record each sentence rests on (the editor view's claim ids); keyed by a phrase in the sentence
CLAIMS = {
 "no wood appears": "bal-box-materials", "mixes once a week": "bal-box-materials", "turned the right way round": "bal-turn-shoe",
 "about 70 degrees": "bal-oven", "ten to twenty hours": "bal-hours-per-pair", "from the 1870s on": "bal-italian-box", "half a century later": "bal-italian-box",
 "since 1993": "bal-gaynor-launch", "moulded shank in 1993": "bal-gaynor-launch", "Cecil Court from 1929": "bal-freed-founded", "twenty-six years": "bal-crown-years",
 "forty pairs a day": "bal-crown-pairs-day", "paid by the pair": "bal-piecework", "will wear no other": "bal-wear-no-other", "five hundred people": "bal-grishko-staff", "twenty-seven years": "bal-monakhova-years", "160,000": "bal-freed-output", "who to blame": "bal-marks-reason", "two to three years": "bal-training-years", "twenty-seven years": "bal-monakhova-years",
 "between twenty and forty": "bal-makers-count", 
 "critically endangered": "bal-heritage-crafts", "six thousand pairs": "bal-rbo-pairs", "fifty pounds": "bal-rbo-cost",
 "780,000 dollars": "bal-nycb-budget", "sews her own ribbons": "bal-dancers-sew", "forty-two hours": "bal-paris-prep-hours", "December 2023": "bal-paris-strike-2023", "in 2018": "bal-roe-2018", "in 2019": "bal-spectator-visit-2019", "in 2015": "bal-freed-film-2015", "in 2013": "bal-spitalfields-visit",
 "in 1823": "bal-brugnoli", "12 March 1832": "bal-taglioni-sylphide", "from 1887": "bal-capezio", "1988 or 1989": "bal-grishko", "patented in 1998": "bal-gaynor-patent",
}
FIGURE = '''<figure class="schematic">
<svg viewBox="0 0 640 260" role="img" aria-labelledby="fig1t fig1d" xmlns="http://www.w3.org/2000/svg">
<title id="fig1t">A pointe shoe cut lengthways, with its parts numbered</title>
<desc id="fig1d">A side section of a pointe shoe, toe to the right. The upper rises from a low heel at the left; its top edge is the opening the foot goes in, bound with a drawstring, and from the throat the vamp covers the toes. Inside the toe a band of layered paper and cloth, the block, lines the upper around the hollow the toes sit in, ending in a flat platform at the tip. A shank runs under the arch above the leather sole, and the satin is pleated where it meets the sole under the toe.</desc>
<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
<path d="M96 206 C94 180 100 150 112 134 C150 152 220 166 300 164 C340 163 372 156 392 148 C440 128 520 112 586 134 L590 192 C520 212 400 220 300 220 C200 220 130 216 96 206 Z"/>
<path d="M112 134 C150 142 220 152 300 150 C340 149 372 146 392 148" stroke-dasharray="3 3" opacity=".7"/>
<path d="M392 148 C440 128 520 112 586 134" stroke-width="2.2"/>
<path fill-rule="evenodd" d="M430 134 C490 118 548 116 580 136 L584 190 C548 206 490 212 430 212 C452 192 462 170 458 152 C456 144 446 138 430 134 Z M458 136 C506 128 548 128 572 144 L576 186 C548 198 506 204 458 204 C472 188 478 170 474 154 C472 146 466 140 458 136 Z" fill="currentColor" fill-opacity=".14" stroke="none"/><path d="M430 134 C490 118 548 116 580 136 L584 190 C548 206 490 212 430 212 C452 192 462 170 458 152 C456 144 446 138 430 134 Z"/>
<path d="M444 134 C498 122 548 122 576 140 L580 188 C548 202 498 208 444 208 C462 190 470 170 466 152 C464 144 456 138 444 134" opacity=".55"/>
<path d="M458 136 C506 128 548 128 572 144 L576 186 C548 198 506 204 458 204 C472 188 478 170 474 154 C472 146 466 140 458 136" opacity=".4"/>
<path d="M586 134 L590 192" stroke-width="2.6"/>
<path d="M150 214 C240 222 400 220 590 194" stroke-width="3"/>
<path d="M180 206 C260 206 400 200 470 192" stroke-width="2.4" stroke-dasharray="7 3"/>
<path d="M500 206 l-3 14 M518 204 l-3 14 M536 201 l-3 14 M554 197 l-3 14"/>
</g>
<g font-family="inherit" font-size="22" font-weight="700" fill="currentColor">
<text x="520" y="100">1</text><text x="300" y="130">2</text><text x="440" y="100">3</text><text x="606" y="172">4</text><text x="300" y="195">5</text><text x="300" y="250">6</text><text x="520" y="250">7</text>
</g>
<g stroke="currentColor" opacity=".5"><line x1="526" y1="106" x2="520" y2="122"/><line x1="306" y1="136" x2="310" y2="150"/><line x1="312" y1="196" x2="330" y2="204"/><line x1="448" y1="106" x2="452" y2="128"/><line x1="312" y1="236" x2="330" y2="220"/><line x1="528" y1="236" x2="534" y2="214"/><line x1="604" y1="166" x2="590" y2="160"/></g>
</svg>
<ol class="key"><li>satin upper, the vamp over the toes</li><li>the opening, with a drawstring in its binding</li><li>block: layers of paper and hessian in flour paste, built around the hollow the toes sit in</li><li>platform, the flat front of the block the dancer stands on</li><li>shank, the stiffener under the arch</li><li>leather sole, pasted and hammered on</li><li>pleats, where the satin is gathered under the toe</li></ol>
<figcaption>A pointe shoe cut lengthways. Schematic: parts named as the sources on this page describe them; not to scale and not a particular shoe. Drawn for this course by its drafting model, named in the colophon; released CC0.</figcaption>
</figure>'''
def chip(rid):
    r = reg["records"][rid]; c = r["confidence"]
    return f'<span class="chip c-{c}" data-claim="{rid}" hidden title="{html.escape(r["claim"])}">{rid} · {c}</span>'
def mark_sentences(p):
    out = []
    for s in re.split(r"(?<=[.!?])\s+(?=[A-Z*])", p):
        ids = [rid for phrase, rid in CLAIMS.items() if phrase in s]
        out.append(s + ("".join(" " + chip(r) for r in dict.fromkeys(ids)) if ids else ""))
    return " ".join(out)
def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", t); t = re.sub(r"\*([^*]+)\*", r"<i>\1</i>", t); return t

body = []; guess = None; objectives = []; title = ""; eyebrow = ""
lines = md.split("\n"); i = 0
while i < len(lines):
    l = lines[i]
    if l.startswith("# "): eyebrow = l[2:]; i += 1; continue
    if l.startswith("## "): title = l[3:]; i += 1; continue
    if l.startswith("### "): body.append(f"<h2>{inline(l[4:])}</h2>"); i += 1; continue
    if l.startswith("**By the end"):
        i += 1; items = []
        while i < len(lines) and lines[i].startswith("- "): items.append(lines[i][2:]); i += 1
        body.append('<section class="objectives"><p class="eyebrow">By the end you will be able to</p><ul>' + "".join(f"<li>{inline(x)}</li>" for x in items) + "</ul></section>"); continue
    if l.startswith("**Before you read on"):
        q = l; i += 1; opts = []
        while i < len(lines) and lines[i].startswith("- "): opts.append(lines[i][2:]); i += 1
        while i < len(lines) and not lines[i].strip(): i += 1
        resp = lines[i]; i += 1
        m = re.match(r"\*If you chose ([^:]+):\* (.*?) \*If you chose ([^:]+):\* (.*)", resp)
        right_key, right, wrong_key, wrong = m.group(1), m.group(2), m.group(3), m.group(4)
        body.append(f'''<section class="guess" data-right="2"><p class="q"><b>Before you read on, choose one.</b> {inline(q.split("choose one.** ")[1])}</p>
<div class="opts">''' + "".join(f'<button type="button" data-i="{k}">{inline(o)}</button>' for k, o in enumerate(opts)) + f'''</div>
<p class="say say-right" hidden>{inline(right)}</p><p class="say say-wrong" hidden>{inline(wrong)}</p></section>'''); continue
    if l.strip()=="@@FIGURE@@":
        body.append(FIGURE); i += 1; continue
    if l.startswith("*Next:"): body.append(f'<p class="next">{inline(l.strip("*"))}</p>'); i += 1; continue
    if l.strip():
        body.append(f"<p>{mark_sentences(inline(l))}</p>")
    i += 1


def src_links(r):
    return ", ".join('<a href="%s">%s</a>' % (reg["sources"][sid]["url"], sid) for sid in r["sources"])
REC_ROWS = "".join('<tr id="%s"><td>%s</td><td>%s</td><td>%s</td><td>%s%s</td><td>%s</td></tr>' % (k, k, html.escape(r["claim"]), html.escape(str(r["display"])), r["confidence"], (" · " + html.escape(r.get("rule",""))) if r.get("rule") else "", src_links(r)) for k, r in reg["records"].items())
objs = reg.get("objects", {})
editor = f'''<aside class="editor" hidden>
<h2>Editor view</h2>
<p class="eyebrow">Register · {len(reg["records"])} records · {sum(1 for r in reg["records"].values() if r["confidence"]=="documented")} documented · {sum(1 for r in reg["records"].values() if r["confidence"]=="probable")} probable · {sum(1 for r in reg["records"].values() if r["confidence"]=="contested")} contested · status {reg["status"]} · signed by {reg["signed_by"] or "no one yet"}</p>
<table><tr><th>record</th><th>claim</th><th>display</th><th>confidence</th><th>sources</th></tr>''' + REC_ROWS + '''</table>
<h3>Objects</h3><table><tr><th>object</th><th>holder · accession · date · maker · licence</th><th>status</th></tr>''' + "".join(
 f'<tr><td>{html.escape(o["title"])}</td><td>{html.escape(o["holder"])} · {html.escape(o["accession"])} · {html.escape(o["date"])} · {html.escape(o["maker"])} · {html.escape(o["licence"])}</td><td>{html.escape(str(o["status"]))}{(" · " + html.escape(o["protocol"])) if o.get("protocol") else ""}</td></tr>' for o in objs.values()) + '''</table>
<h3>What waits</h3><ul><li>The Carnavalet lithograph (CC0): fetch and verify at the holder, then place it at "Where the shoe came from".</li><li>A worn pair with its mark: no open photograph found; the ROH pair is link-out; a Freed photograph would need the company's licence.</li><li>The Hackney makers' names rest on one journalist's visit (2013); a second source or Freed's confirmation would raise them to documented.</li><li>Pages 2–4: the tutu taken apart; the stage as a machine; the company and the body.</li></ul>
<h3>Lints</h3><p class="eyebrow">claims: 0 errors · prose: see lint.txt beside this file</p>
</aside>'''
colophon = f'''<footer class="colophon"><p class="eyebrow">Colophon</p><p>Drafted by Claude Fable 5.1 on 21 October 2026 from two research passes (research_notes/Ballet); revised the same day through three rounds of review by six readers in persona, none of them human (research_notes/Ballet/board). Checks run: the claims lint and the prose lint. No human has yet read this page; the register is unsigned. Originally published 21 October 2026 · last revised 21 October 2026 · corrections: open an issue on the course repository.</p></footer>'''
sources_line = '<section class="sources"><h2>Sources</h2><p>' + "; ".join(f'<a href="{s["url"]}">{html.escape(s["title"])}</a>' for s in reg["sources"].values()) + "</p></section>"

page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The shoe · Ballet, as a history of making</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;600&display=swap">
<style>{TOK}
body{{margin:0;background:var(--paper) var(--tex);color:var(--ink);font:var(--body)/var(--body-lh) var(--serif)}}
.band{{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:14px var(--gut);border-bottom:1px solid var(--line);font:var(--eyebrow);letter-spacing:.04em;text-transform:uppercase}}
.band b{{border-left:4px solid #6B5A6E;padding-left:10px;font-weight:600}} .band button{{font:var(--eyebrow);background:none;border:1px solid var(--line-2);border-radius:999px;padding:6px 12px;cursor:pointer;color:var(--ink-2);text-transform:uppercase}}
main{{max-width:68ch;margin:0 auto;padding:36px var(--gut) 60px}} h1{{font:400 40px/1.1 var(--serif);margin:.2em 0 .3em}} h1 i{{font-style:italic}} h2{{font:600 22px/1.25 var(--serif);margin:1.8em 0 .5em}}
p{{margin:0 0 1em}} .eyebrow{{font:var(--eyebrow);color:var(--ink-3);text-transform:uppercase;letter-spacing:.06em}}
.objectives{{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:14px 0;margin:0 0 1.6em}} .objectives ul{{margin:.4em 0 0;padding-left:1.2em}} .objectives li{{margin:.2em 0}}
.guess{{margin:1.6em 0;padding:16px 18px;border:1px solid var(--line-2);border-radius:var(--r);background:var(--paper-2)}} .guess .opts{{display:flex;flex-direction:column;gap:8px;margin:.6em 0}}
.guess button{{text-align:left;font:inherit;font-size:16px;background:var(--paper);border:1px solid var(--line-2);border-radius:8px;padding:10px 14px;cursor:pointer;color:var(--ink)}} .guess button[aria-pressed=true]{{border-color:var(--ink);background:#fff}}
.guess .say{{margin:.8em 0 0;font-size:16px;color:var(--ink-2)}}
.schematic{{margin:1.4em 0 1.8em}} .schematic svg{{width:100%;height:auto;color:var(--ink);display:block}} .schematic figcaption{{font-size:14px;color:var(--ink-2);margin-top:.5em}} .schematic .key{{font-size:16px;margin:.6em 0 0 1.4em;padding:0;columns:2;column-gap:24px}} .schematic .key li{{break-inside:avoid;margin:0 0 .25em}} @media (max-width:600px){{.schematic .key{{columns:1}}}}
.next{{font-style:italic;color:var(--ink-2);margin-top:2em}} .sources{{margin-top:2.5em;font-size:14px;color:var(--ink-2)}} .sources h2{{font-size:16px}} a{{color:var(--indigo)}}
.chip{{display:none;font:var(--eyebrow);text-transform:none;letter-spacing:0;border:1px solid var(--line-2);border-radius:999px;padding:1px 7px;margin-left:4px;vertical-align:middle;color:var(--ink-3)}} .c-contested{{border-color:var(--seal);color:var(--seal)}} .c-probable{{border-style:dashed}}
body.editor-on .chip{{display:inline-block!important}} body.editor-on .editor{{display:block}}
.editor{{max-width:1100px;margin:30px auto;padding:20px var(--gut);border-top:2px solid var(--ink);font-size:14px}} .editor table{{border-collapse:collapse;width:100%;font-size:13px}} .editor th,.editor td{{text-align:left;vertical-align:top;padding:5px 8px 5px 0;border-bottom:1px solid var(--line)}} .editor th{{font:var(--annot-name);color:var(--ink-2)}}
.colophon{{max-width:68ch;margin:0 auto;padding:0 var(--gut) 60px;font-size:13px;color:var(--ink-3)}}
@media (max-width:600px){{h1{{font-size:32px}} body{{font-size:16px}}}}</style></head><body>
<div class="band"><b>{html.escape(eyebrow)}</b><span><button type="button" id="toggle" aria-pressed="false">Editor view</button></span></div>
<main><h1>{inline(title)}</h1>
{"".join(body)}
{sources_line}</main>
{editor}
{colophon}
<script>
document.getElementById('toggle').addEventListener('click',e=>{{const on=document.body.classList.toggle('editor-on');e.target.setAttribute('aria-pressed',on);document.querySelector('.editor').hidden=!on;}});
document.querySelectorAll('.guess').forEach(g=>{{const right=g.dataset.right;g.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{{g.querySelectorAll('button').forEach(x=>{{x.setAttribute('aria-pressed',x===b);x.disabled=true}});g.querySelector(b.dataset.i===right?'.say-right':'.say-wrong').hidden=false;}}));}});
</script></body></html>'''
(OUT / "the-shoe.html").write_text(page, encoding="utf8")
print("built", OUT / "the-shoe.html", len(page))

import json,re,sys
def met_provenance(raw_html):
    """Return the Provenance tab text from a Met object page's server-rendered payload, or None."""
    # The page ships its tabs in a React Server Components payload with escaped quotes.
    s = raw_html.replace('\\"','"')
    m = re.search(r'"name":"Provenance","body":.*?"__html":"(.*?)"\}', s, re.S)
    if not m: return None
    t = m.group(1)
    t = t.replace('\\u003c','<').replace('\\u003e','>').replace('\\u0026','&')
    t = re.sub(r'<br/?>',' ',t); t = re.sub(r'<[^>]+>','',t)
    return re.sub(r'\s+',' ',t).strip()
if __name__=='__main__':
    for f in sys.argv[1:]:
        d=json.load(open(f)); print(f[-20:], '=>', met_provenance(d['rawHtml']))

"""Parse the F1 unit specs: spec-table rows, section-3 claims, section-5 open objects, section-4 nodes.
Read-only on the repo. Writes intermediate JSON to the audit2 folder.
"""
import re, glob, os, json, csv, collections

REPO = '/home/claude/creative-world/modules/F1-histories-of-making'
SPECS = os.path.join(REPO, 'specs')
OUT = '/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/audit2'

def unit_key(name):
    m = re.match(r'F1\.(\d+)([a-z]?)', name)
    return (int(m.group(1)), m.group(2))

def unit_of(path):
    return os.path.basename(path)[:-3]

def split_sections(txt):
    """Return dict section_number -> text, for the numbered **N. Title** sections after the spec table."""
    # headers look like **3. Claims**, **3. Claims (20)** or **5. Candidate open objects** (trailing note)
    parts = re.split(r'^\*\*(\d{1,2})\. [^*\n]+\*\*[^\n]*$', txt, flags=re.M)
    # parts[0] = preamble + spec table; then alternating number, body
    secs = {'0': parts[0]}
    for i in range(1, len(parts), 2):
        secs[parts[i]] = parts[i+1]
    return secs

def table_rows(body):
    """Yield list-of-cells for every markdown table data row in body (skips header + separator)."""
    rows = []
    for line in body.splitlines():
        if not line.startswith('|'):
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if all(re.fullmatch(r':?-{2,}:?', c) for c in cells if c):
            continue  # separator
        rows.append(cells)
    return rows

def parse_spec(path):
    txt = open(path, encoding='utf-8').read()
    unit = unit_of(path)
    secs = split_sections(txt)
    # spec table rows
    spec_rows = {}
    walk_table = []
    for cells in table_rows(secs['0']):
        if len(cells) >= 2 and cells[0] not in ('Row',):
            spec_rows.setdefault(cells[0], cells[1])
            if re.fullmatch(r'\d', cells[0]):
                walk_table.append(' | '.join(cells[1:4]))
    # claims: section 3 table rows whose first cell is an integer
    claims = []
    s3 = secs.get('3', '')
    for cells in table_rows(s3):
        if cells and re.fullmatch(r'\d+', cells[0]):
            claims.append({'unit': unit, 'n': int(cells[0]), 'claim': cells[1],
                           'confidence': cells[2] if len(cells) > 2 else ''})
    if not claims:
        # numbered-list format: "1. claim text ... Documented. URL" (F1.3, F1.15, F1.18, F1.23, F1.30)
        for m in re.finditer(r'^(\d+)\.\s+(.*)$', s3, flags=re.M):
            text = m.group(2)
            conf = ''
            cm = re.search(r'(?i)\b(documented|probable|contested|interpretive)\b', text)
            if cm:
                conf = cm.group(1)
            claims.append({'unit': unit, 'n': int(m.group(1)), 'claim': text, 'confidence': conf})
    # open objects: section 5 table rows that are not header rows
    objects = []
    for cells in table_rows(secs.get('5', '')):
        if not cells or cells[0] in ('Object', 'Open object', 'Holder', '#', 'Place', 'Case or claim', 'Field', 'Tier', 'Step'):
            continue
        if len(cells) < 3:
            continue
        objects.append({'unit': unit, 'object': cells[0], 'holder': cells[1] if len(cells) > 1 else ''})
    # nodes: all canon ids in section 4 (and in the whole file, kept separately)
    node_ids_s4 = sorted(set(re.findall(r'\b([A-Z]{3}\d{3})\b', secs.get('4', ''))))
    node_ids_s1 = sorted(set(re.findall(r'\b([A-Z]{3}\d{3})\b', secs.get('1', ''))))
    node_ids_all = sorted(set(re.findall(r'\b([A-Z]{3}\d{3})\b', txt)))
    return {'unit': unit, 'title': txt.splitlines()[0].lstrip('# ').strip(), 'spec_rows': spec_rows,
            'claims': claims, 'objects': objects, 'nodes_s4': node_ids_s4,
            'nodes_s1': node_ids_s1, 'nodes_all': node_ids_all,
            'section7': secs.get('7', ''), 'walk_table': ' '.join(walk_table),
            'sections_present': sorted(secs.keys(), key=lambda s: int(s))}

def main():
    specs = {}
    for p in sorted(glob.glob(os.path.join(SPECS, 'F1.*.md')), key=lambda p: unit_key(unit_of(p))):
        specs[unit_of(p)] = parse_spec(p)
    json.dump(specs, open(os.path.join(OUT, 'specs_parsed.json'), 'w'), indent=1, ensure_ascii=False)
    print(f"{'unit':8}{'claims':>7}{'objects':>8}{'s4 ids':>7}  sections")
    for u, s in specs.items():
        print(f"{u:8}{len(s['claims']):>7}{len(s['objects']):>8}{len(s['nodes_s4']):>7}  {','.join(s['sections_present'])}")
    print('total claims', sum(len(s['claims']) for s in specs.values()),
          'total objects', sum(len(s['objects']) for s in specs.values()))

if __name__ == '__main__':
    main()

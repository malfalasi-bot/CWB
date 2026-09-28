import csv, collections
exec(open('validate.py').read().split("for label,rows")[0])
base='/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/f1-scope/canon/'
for label in ['events','periods']:
    rows=list(csv.DictReader(open(base+f'canon_{label}.csv')))
    print('==',label,len(rows))
    for r in rows:
        errs=[]
        for f,S in [('functions',FN),('sensitivity',SENS),('world',WORLD),('sub_regions',SUB),('units',UNITS)]:
            bad=[x for x in r[f].split(';') if x and x.strip() not in S]
            if bad: errs.append(f"{f}:{bad}")
        if r['start'] and r['end'] and int(r['end'])<int(r['start']): errs.append('end<start')
        if len(r['making_significance'])<75: errs.append('SHORTSIG')
        if len(r['leaves_out'])<14: errs.append('SHORTLEAVES')
        if ('enslav' in (r['making_significance']+r['leaves_out']).lower() or 'forced lab' in (r['making_significance']+r['leaves_out']).lower() or 'coerc' in (r['making_significance']+r['leaves_out']).lower() or 'indenture' in (r['making_significance']+r['leaves_out']).lower()) and 'human-flow' not in r['sensitivity']: errs.append('NEEDS human-flow')
        if 'OCC ' in r['notes'] or 'PRD ' in r['notes']: errs.append('unresolved ref: '+r['notes'])
        if errs: print(r['id'],r['name'][:50],errs)
    c=collections.Counter()
    for r in rows:
        for w in r['world'].split(';'): c[w]+=1
    print(sorted(c.items()))
    print(collections.Counter(r['tier'] for r in rows), collections.Counter(r['confidence'] for r in rows))

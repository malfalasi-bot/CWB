import sys, importlib, re
sys.path.insert(0,'.')
from common import parse
CUT = ["Tambora eruption","Plague of Justinian","An Lushan Rebellion","Siamese sack of Angkor","Meireki fire","Great Chicago Fire","Great Kantō earthquake","Spanish ban on the ruff","Colbert's textile regulations","French patent law","Gewerbefreiheit","Slave Trade Act","Armory Show","Burning of the Leuven","Panama Canal","documenta","Italy: The New Domestic","Expo '70","Float glass","China joins the WTO","L-85","Socialist transformation of handicrafts","EU ban on destroying","Nigerian presidential","Ouagadougou speech","Glasgow School of Art","Treasure Act","Norman Conquest","Iraq antiquities law (1924)","Pacca Edict","National Treasures Preservation Law","Crompton's mule","Power loom","Kansei reforms","Taiping war at Jingdezhen","Restitutions of 1815","Iraqi invasion of Kuwait","Principles of Scientific Management",'Cap Act','Ornamental Designs Act','Factory Act','Linotype','Flying shuttle','International Exhibition (London 1862)','Exposition Universelle Paris (1900)','Grégoire','Swedish sack of Prague','Lindisfarne','Florence flood','Monuments, Fine Arts','Utility clothing','Plan of Monumental Propaganda']
def load():
    rows=[]
    for mod,var in [('events1','E1'),('events10','E10'),('events2','E2'),('events2b','E2B'),('events3','E3'),('events3b','E3B'),('events4','E4'),('events4b','E4B'),('events4b','E5B'),('events5','E5'),('events4b','E6B'),('events6','E6'),('events7','E7'),('events8','E8'),('events9','E9'),('events11','E11')]:
        rows += parse(getattr(importlib.import_module(mod),var),'X','event','Time')
    used=set()
    out=[]
    for r in rows:
        hit=[c for c in CUT if r['name'].startswith(c)]
        if hit: used.update(hit); continue
        out.append(r)
    missing=set(CUT)-used
    if missing: print("CUT not matched:",missing)
    out.sort(key=lambda r:(int(r['start']) if r['start'] else 99999, r['name']))
    for i,r in enumerate(out,1): r['id']=f"OCC{i:03d}"
    return out
if __name__=='__main__':
    rs=load(); print(len(rs))
    for r in rs: print(r['id'],r['start'],r['name'][:70])

import sys, importlib
sys.path.insert(0,'.')
from common import parse
MODS=[('periods1','P1'),('periods2','P2'),('periods3','P3'),('periods4','P4'),('periods5','P5'),('periods5','P5B'),('periods6','P6'),('periods7','P7'),('periods8','P8'),('periods9','P9'),('periods10','P10'),('periods11','P11'),('periods12','P12'),('periods13','P13'),('periods14','P14')]
CUT=['Bubaline period', 'Horse period (Saharan', 'Scramble for Africa', 'Zemene Mesafint', 'Jemdet Nasr', 'Isin-Larsa', 'Middle Assyrian', 'Seleucid period', 'Old Elamite', 'Neo-Elamite', 'Neo-Hittite', 'Neopalatial', 'Early Helladic', 'Middle Helladic', 'Early Minoan', 'Roman Kingdom', 'Crisis of the Third', 'Pre-Roman Iron Age', 'Roman Iron Age (Scand', 'Vendel period', 'Visigothic period', 'Late Middle Ages', 'Belle Époque', 'Trente Glorieuses', 'Khrushchev Thaw', 'Younger Dryas', 'Medieval Climate Anomaly', 'Three Kingdoms period (China)', 'Northern and Southern Dynasties', 'Five Dynasties', 'Hakuhō', 'Tenpyō', 'Fujiwara period', 'Nanbokuchō', 'Genroku', 'Bakumatsu', 'Heisei', 'Reiwa', 'Later Three Kingdoms', 'Korean Empire', 'Shunga', 'Lopburi', 'Taifa', 'Tanzimat', 'Epiclassic', 'Porfiriato', 'Plains Village', 'Gilded Age', 'Proto-Historic period', 'Neolithic (Britain)', 'Iron Age (Britain)', 'Great Acceleration', 'Old Assyrian period', 'Federal period', 'Middle Pacific period', 'Shell Midden period', 'Second Industrial Revolution', 'Victorian era','Axial Age']
def load():
    rows=[]
    for m,v in MODS:
        rows+=parse(getattr(importlib.import_module(m),v),'X','period','Time')
    rows=[r for r in rows if not any(r['name'].startswith(c) for c in CUT)]
    for i,r in enumerate(rows,1): r['id']=f"PRD{i:03d}"
    return rows

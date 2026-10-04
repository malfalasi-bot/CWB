# Convert the fetched open-access images into the unit's WebP set, sized by use. Writes public/img/images.json (dims + credits).
import json, csv, shutil
from pathlib import Path
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
A = Path('/home/claude/creative-world/modules/F1-histories-of-making/build/assets')
OUT = Path('public/img'); (OUT/'t').mkdir(parents=True, exist_ok=True); (OUT/'hv').mkdir(exist_ok=True)
man = {}
for m in ['edo/manifest.csv', 'edo-people/manifest.csv', 'edo-v3/manifest.csv']:
    for r in csv.DictReader(open(A/m, encoding='utf-8')): man[r['id']] = r
# id -> (source file, source manifest id, max px)
J = {
 'hi-wave': ('edo-v3/hi-wave-met-jp1847.jpg', 'hi-wave-met-jp1847', 3200),
 'keyblock': ('edo-v3/hi-keyblock-met-2007-49-284.jpg', 'hi-keyblock-met-2007-49-284', 2000),
 'harunobu-1765': ('edo-v3/met-56874.jpg', 'met-56874', 2000),
 'printshop': ('edo-v3/c-Doll_Shop_of_Jikken_LACMA_M.2006.136.153.jpg', 'c-Doll_Shop_of_Jikken_LACMA_M.2006.136.153', 2000),
 'utamaro-tsutaya': ('edo-v3/cma-118833.jpg', 'cma-118833', 2400),
 'sharaku': ('edo-v3/met-37358.jpg', 'met-37358', 2400),
 'manga': ('edo-v3/met-57679.jpg', 'met-57679', 2400),
 'eisen-aizuri': ('edo-people/eisen-aizuri.jpg', 'eisen-aizuri', 1400),
 'redfuji': ('edo-v3/hi-redfuji-met-jp9.jpg', 'hi-redfuji-met-jp9', 2400),
 'oi-night': ('edo-people/oi-yoshiwara-night.jpg', 'oi-yoshiwara-night', 1400),
 'shower': ('edo-v3/hi-shower-met-jp2522.jpg', 'hi-shower-met-jp2522', 3200),
 'namazu': ('edo-v3/c-Namazu-e_-_Kashima_controls_namazu.jpg', 'c-Namazu-e_-_Kashima_controls_namazu', 900),
 'plum': ('edo-v3/aic-26577.jpg', 'aic-26577', 900),
 'japon-artistique': ('edo-v3/c-Le_Japon_artistique_décembre_1889.jpg', 'c-Le_Japon_artistique_décembre_1889', 900),
 'cat': ('edo-v3/hi-cat-met-jp1563.jpg', 'hi-cat-met-jp1563', 2400),
 'danjuro-aic': ('edo-v3/aic-23929.jpg', 'aic-23929', 900),
 'yokohama-bread': ('edo-v3/aic-32192.jpg', 'aic-32192', 900),
 'playbill': ('edo/playbill-met-2013-851.jpg', 'playbill-met-2013-851', 1400),
 'yoshiwara-nakanocho': ('edo-people/yoshiwara-nakanocho.jpg', 'yoshiwara-nakanocho', 1280),
 'gishi': ('edo-v3/c-Seichu_Gishi_Den_BM_1906-1220-0.1163.jpg', 'c-Seichu_Gishi_Den_BM_1906-1220-0.1163', 1600),
 'map-edo-1859': ('edo-v3/map-edo-1859-hi.jpg', 'map-edo-1859-hi', 3964),
 'nihonbashi': ('edo-v3/hi-nihonbashi-met-jp471.jpg', 'hi-nihonbashi-met-jp471', 1600),
 't-shinagawa': ('edo-v3/c-Hiroshige-53-Stations-Hoeido-02-Shinagawa-MIA-01.jpg', 'c-Hiroshige-53-Stations-Hoeido-02-Shinagawa-MIA-01', 1000),
 't-kanagawa': ('edo-v3/c-Hiroshige-53-Stations-Hoeido-04-Kanagawa-BM-03.jpg', 'c-Hiroshige-53-Stations-Hoeido-04-Kanagawa-BM-03', 1000),
 't-hakone': ('edo-v3/c-Hiroshige-53-Stations-Hoeido-11-Hakone-MFA-01.jpg', 'c-Hiroshige-53-Stations-Hoeido-11-Hakone-MFA-01', 1000),
 't-mishima': ('edo-v3/aic-10926.jpg', 'aic-10926', 1000),
 't-kanbara': ('edo-v3/c-Hiroshige-53-Stations-Hoeido-16-Kanbara-MFA-02.jpg', 'c-Hiroshige-53-Stations-Hoeido-16-Kanbara-MFA-02', 1000),
 't-yui': ('edo-v3/aic-18255.jpg', 'aic-18255', 1000),
 't-shono': ('edo-v3/aic-25761.jpg', 'aic-25761', 1000),
 't-kyoto': ('edo-v3/aic-25789.jpg', 'aic-25789', 1000),
}
for p in ['hokusai','hiroshige','tsutaya','utamaro','kuniyoshi','kunisada','kyoden','eisen','sadanobu','tadakuni','hayashi','bing','van-gogh','wright','perry','fenollosa','danjuro-vii','ieyasu']:
    J['portrait-'+p] = (f'edo-people/portrait-{p}.jpg', 'portrait-'+p, 720)
meta = {}
def credit(mid):
    r = man.get(mid, {})
    return {'title': r.get('title',''), 'maker': r.get('maker',''), 'date': r.get('date',''), 'holder': r.get('holder',''),
            'accession': r.get('accession',''), 'licence': r.get('licence','').split(' (')[0], 'credit': r.get('credit','')}
for k, (src, mid, mx) in J.items():
    im = Image.open(A/src).convert('RGB'); im.thumbnail((mx, mx), Image.LANCZOS)
    im.save(OUT/f'{k}.webp', quality=82, method=6)
    t = im.copy(); t.thumbnail((200, 200), Image.LANCZOS); t.save(OUT/'t'/f'{k}.webp', quality=78, method=6)
    meta[k] = {'w': im.width, 'h': im.height, **credit(mid)}
# timeline thumbs for the wave impressions
for k, src in [('wave-thumb', 'edo-v3/hi-wave-met-jp1847.jpg'), ('wave-aic-thumb', 'edo-v3/hi-great-wave-aic.jpg')]:
    t = Image.open(A/src).convert('RGB'); t.thumbnail((200, 200)); t.save(OUT/'t'/f'{k}.webp', quality=78)
# the Hundred Views thumbnails
for p in sorted((A/'edo-v3').glob('hv-*.jpg')):
    if p.name.endswith('.thumb.jpg'): continue
    im = Image.open(p).convert('RGB'); im.thumbnail((330, 330)); im.save(OUT/'hv'/(p.stem + '.webp'), quality=78, method=6)
# peel layers and aligned waves
W = Path('/tmp/claude-0/-home-claude/76042139-a9b9-5b20-8cec-5583346d0a7e/scratchpad/v3work')
(OUT/'peel').mkdir(exist_ok=True); (OUT/'waves').mkdir(exist_ok=True)
for f in (W/'peel').glob('*'): shutil.copy(f, OUT/'peel'/f.name)
for k in ['jp1847', 'jp10', 'aic']: shutil.copy(W/'waves'/f'{k}.webp', OUT/'waves'/f'{k}.webp')
meta['waves'] = {'jp1847': credit('hi-wave-met-jp1847'), 'jp10': credit('hi-wave-met-jp10'), 'aic': credit('hi-great-wave-aic')}
json.dump(meta, open(OUT/'images.json', 'w'), ensure_ascii=False)
tot = sum(f.stat().st_size for f in OUT.rglob('*') if f.is_file())
print(len(meta), 'images;', sum(1 for _ in OUT.rglob('*.webp')), 'webp files;', round(tot/1e6, 1), 'MB')

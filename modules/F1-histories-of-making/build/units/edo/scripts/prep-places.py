import json, numpy as np, yaml
A='/home/claude/creative-world/modules/F1-histories-of-making/build/assets/edo-v3/'
g=json.load(open('content/georef59.json'))
M=np.array(g['M']); lat0,lon0=g['lat0'],g['lon0']; W,H=g['W'],g['H']
def px(lat,lon):
    e=[(lon-lon0)*111.32*np.cos(np.radians(lat0)),(lat-lat0)*110.57,1]
    p=np.array(e)@M; return [round(float(p[0])/W*100,2), round(float(p[1])/H*100,2)]
world={
 'edo':{'name':'Edo','kanji':'江戸','lat':35.6883,'lon':139.7544},
 'tokyo':{'name':'Tokyo','kanji':'東京','lat':35.6894,'lon':139.6917},
 'kyoto':{'name':'Kyoto','kanji':'京都','lat':35.0116,'lon':135.7681},
 'osaka':{'name':'Osaka','kanji':'大坂','lat':34.6938,'lon':135.5021},
 'nagasaki':{'name':'Nagasaki · Dejima','kanji':'長崎','lat':32.7435,'lon':129.8730},
 'kanagawa':{'name':'Kanagawa','kanji':'神奈川','lat':35.475,'lon':139.633},
 'yokohama':{'name':'Yokohama','kanji':'横浜','lat':35.4503,'lon':139.6342},
 'yokohama-off':{'name':'The wave, off Kanagawa','kanji':'','lat':35.43,'lon':139.70,'kind':'note'},
 'fuji':{'name':'Mount Fuji','kanji':'富士山','lat':35.3606,'lon':138.7275,'kind':'mountain'},
 'echizen':{'name':'Echizen','kanji':'越前','lat':35.9035,'lon':136.1688},
 'berlin':{'name':'Berlin','lat':52.52,'lon':13.405},
 'amsterdam':{'name':'Amsterdam','lat':52.3667,'lon':4.8833},
 'cape':{'name':'Cape of Good Hope','lat':-33.9253,'lon':18.4239},
 'batavia':{'name':'Batavia','lat':-6.1348,'lon':106.8132},
 'china':{'name':'Chinese junks','lat':30.0,'lon':122.0,'kind':'region'},
 'marseille':{'name':'Marseille','lat':43.2967,'lon':5.3764},
 'suez':{'name':'Suez','lat':29.97,'lon':32.55},
 'aden':{'name':'Aden','lat':12.80,'lon':45.03},
 'galle':{'name':'Galle','lat':6.0328,'lon':80.2156},
 'singapore':{'name':'Singapore','lat':1.29,'lon':103.85},
 'hongkong':{'name':'Hong Kong','lat':22.2783,'lon':114.1586},
 'paris':{'name':'Paris','lat':48.8567,'lon':2.3522},
 'london':{'name':'London','lat':51.5074,'lon':-0.1278},
 'sanfrancisco':{'name':'San Francisco','lat':37.775,'lon':-122.4194},
 'chicago':{'name':'Chicago','lat':41.8819,'lon':-87.6278},
 'boston':{'name':'Boston','lat':42.3603,'lon':-71.0578},
 'washington':{'name':'Washington','lat':38.9072,'lon':-77.0369},
 'newyork':{'name':'New York','lat':40.7794,'lon':-73.9632},
}
def S(n,la,lo,date=None,stop=True):
    d={'name':n,'lat':la,'lon':lo,'stop':stop}
    if date: d['date']=date
    return d
routes={
 'perry':{'label':'Perry’s squadron, 1852–53','stops':[
   S('Norfolk',36.8469,-76.2853,'24 Nov 1852'),S('',30,-45,stop=False),S('Madeira',32.65,-16.9167,'Dec 1852'),S('',12,-22,stop=False),S('',0,-14,stop=False),
   S('St Helena',-15.9251,-5.7179,'Jan 1853'),S('Cape Town',-33.9253,18.4239,'Jan–Feb 1853'),S('',-36,30,stop=False),S('Mauritius',-20.1619,57.4989,'Feb 1853'),
   S('Ceylon',6.0328,80.2156,'Mar 1853'),S('',6.3,94.5,stop=False),S('',3.5,99.8,stop=False),S('Singapore',1.29,103.85,'Mar 1853'),S('',9,109.5,stop=False),
   S('Hong Kong',22.2783,114.1586,'Apr 1853'),S('',25,120.2,stop=False),S('Shanghai',31.2325,121.4692,'May 1853'),S('Naha',26.2122,127.6792,'May–Jun 1853'),
   S('Bonin Islands',27.0667,142.2083,'Jun 1853'),S('',33.5,140.2,stop=False),S('Uraga',35.2475,139.714,'8 Jul 1853')]},
 'voc':{'label':'Dutch ships, via the Cape and Batavia','stops':[
   S('Amsterdam',52.3667,4.8833),S('',53.07,4.8,stop=False),S('',50.6,0.5,stop=False),S('',47,-8,stop=False),S('',20,-24,stop=False),S('',-10,-20,stop=False),
   S('Cape of Good Hope',-33.9253,18.4239),S('',-38,45,stop=False),S('',-36,80,stop=False),S('',-20,102,stop=False),S('',-6.2,105.6,stop=False),
   S('Batavia',-6.1348,106.8132),S('',3,108.5,stop=False),S('',12,112.5,stop=False),S('',21,117.5,stop=False),S('',27,124,stop=False),S('Nagasaki',32.7435,129.873)]},
 'berlin':{'label':'Berlin to Amsterdam','stops':[S('Berlin',52.52,13.405),S('Amsterdam',52.3667,4.8833)],'land':True},
 'china':{'label':'Chinese junks, from 1824','stops':[S('China',30.0,122.0),S('',31.0,126.0,stop=False),S('Nagasaki',32.7435,129.873)]},
 'mm':{'label':'Messageries Maritimes, from 1870','stops':[
   S('Marseille',43.2967,5.3764),S('',38.2,15.6,stop=False),S('',33.5,26,stop=False),S('Port Said',31.26,32.30),S('Suez',29.97,32.55),S('',20,38.8,stop=False),S('Aden',12.80,45.03),
   S('',12,55,stop=False),S('Galle',6.0328,80.2156),S('',6.3,94.5,stop=False),S('',3.5,99.8,stop=False),S('Singapore',1.29,103.85),S('',9,109.5,stop=False),
   S('Hong Kong',22.2783,114.1586),S('',25,120.2,stop=False),S('Shanghai',31.2325,121.4692),S('',32.5,128.5,stop=False),S('',33,135,stop=False),S('Yokohama',35.4503,139.6342)]},
 'pm':{'label':'Pacific Mail from 1867; the railroad from 1869','stops':[
   S('Yokohama',35.4503,139.6342),S('',40,175,stop=False),S('',40,-145,stop=False),S('San Francisco',37.775,-122.4194),S('',41,-112,stop=False),S('Chicago',41.8819,-87.6278),S('Boston',42.3603,-71.0578)]},
}
hs=[dict(s) for s in reversed(routes['mm']['stops'])]+[S('Paris',48.8567,2.3522)]
routes['hayashi']={'label':'Hayashi’s 218 shipments, 1884–95','stops':hs,'counter':218}
links={'tokuno':['tokyo','washington'],'sheet':['echizen','edo','newyork']}
st=json.load(open(A+'tokaido_stations.json')); st=st if isinstance(st,list) else st['stations']
tokaido=[{'n':s['n'],'name':s['name'],'kanji':s.get('kanji',''),'lat':s['lat'],'lon':s['lon']} for s in st]
tprints={0:'nihonbashi',1:'t-shinagawa',3:'t-kanagawa',10:'t-hakone',11:'t-mishima',15:'t-kanbara',16:'t-yui',45:'t-shono',54:'t-kyoto'}
CP={
 'castle':('Edo Castle','江戸城',35.6880,139.7536,None),
 'nihonbashi':('Nihonbashi','日本橋',35.68406,139.77451,None),
 'ryogoku':('Ryōgoku Bridge','両国橋',35.69386,139.78875,None),
 'honjo':('Honjo','本所',35.7038,139.8023,None),
 'yoshiwara':('Shin-Yoshiwara','新吉原',35.72399,139.79569,None),
 'yoshiwara-old':('The old Yoshiwara, to 1657','元吉原',35.6875,139.7805,'approx'),
 'asakusa':('Asakusa · Sensō-ji','浅草寺',35.7148,139.7967,None),
 'saruwakacho':('Saruwaka-chō: the theatres from 1842','猿若町',35.7175,139.800944,None),
 'sakaicho':('Sakai-chō: the Nakamura theatre','堺町',35.6870,139.7828,'approx'),
 'fukiyacho':('Fukiya-chō: the Ichimura theatre','葺屋町',35.6863,139.7818,'approx'),
 'kobikicho':('Kobiki-chō: the Morita theatre','木挽町',35.66944,139.76778,'approx'),
 'toriaburacho':('Tōri Abura-chō: Tsutaya’s shop from 1783','通油町',35.690639,139.78025,None),
 'yoshiwara-gate':('Gojikken road: Tsutaya’s first shop','五十間道',35.7232,139.7942,'approx'),
 'bakurocho':('Bakuro-chō: Eijudō','馬喰町',35.694611,139.783139,None),
 'shinohashi':('Shin-Ōhashi','新大橋',35.685278,139.793056,None),
 'hongo':('Hongō: the first fire','本郷',35.7095,139.7600,'approx'),
 'koishikawa':('Koishikawa: the second fire','小石川',35.7149,139.7468,'approx'),
 'kojimachi':('Kōjimachi: the third fire','麹町',35.6845,139.7365,'approx'),
 'ueno':('Ueno · Kan’ei-ji','寛永寺',35.7115,139.7707,None),
 'shiba':('Shiba · Zōjō-ji','増上寺',35.6575,139.7483,None),
}
city={}
for k,(n,kj,la,lo,q) in CP.items():
    d={'name':n,'kanji':kj,'lat':la,'lon':lo,'xy':px(la,lo)}
    if q: d['approx']=True
    city[k]=d
hv=json.load(open(A+'hundred_views.json'))['views']
views=[{'n':v['n'],'t':v['title_en'],'ja':v['title_ja'],'season':v['season'],'xy':px(v['lat'],v['lon']),'file':v['commons_file']} for v in hv if v['lat'] is not None]
eras=json.load(open(A+'eras.json')); eras=eras if isinstance(eras,list) else eras.get('eras')
out={'georef':{'map':'map-edo-1859','note':'Affine fit to six landmarks on the 1859 map; residuals 70–220 m.','M':g['M'],'lat0':lat0,'lon0':lon0,'W':W,'H':H},
     'world':world,'routes':routes,'links':links,'tokaido':tokaido,'tokaidoPrints':tprints,'city':city,'views':views,'eras':eras}
yaml.safe_dump(out,open('content/places.yaml','w'),allow_unicode=True,sort_keys=False,width=220)
print(len(views),'views;','eras',len(eras),eras[0],eras[-1])

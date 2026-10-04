/* Edo and the floating world — content, places, people and events.
   Facts carry the confidence words of the research files (documented unless marked probable or contested).
   Images: Met CC0, Cleveland CC0, Art Institute CC0, Library of Congress free-to-use, Wikimedia Commons PD, as the holders state them. */
window.EDO = (function () {

const P = {
  edo:       {name: 'Edo', kanji: '江戸', lat: 35.6833, lon: 139.7667},
  castle:    {name: 'Edo Castle', kanji: '江戸城', lat: 35.68832, lon: 139.75439},
  nihonbashi:{name: 'Nihonbashi', kanji: '日本橋', lat: 35.68406, lon: 139.77451},
  yoshiwara: {name: 'Shin-Yoshiwara', kanji: '新吉原', lat: 35.72399, lon: 139.79569},
  asakusa:   {name: 'Asakusa · Saruwaka-chō', kanji: '浅草', lat: 35.71492, lon: 139.79652},
  ryogoku:   {name: 'Ryōgoku', kanji: '両国', lat: 35.69386, lon: 139.79285},
  honjo:     {name: 'Honjo', kanji: '本所', lat: 35.70380, lon: 139.80230},
  kyoto:     {name: 'Kyoto', kanji: '京都', lat: 35.01161, lon: 135.76811},
  osaka:     {name: 'Osaka', kanji: '大坂', lat: 34.69375, lon: 135.50211},
  nagasaki:  {name: 'Nagasaki · Dejima', kanji: '長崎 · 出島', lat: 32.74352, lon: 129.87302},
  arita:     {name: 'Arita', kanji: '有田', lat: 33.21064, lon: 129.84903},
  kanagawa:  {name: 'Kanagawa', kanji: '神奈川', lat: 35.475, lon: 139.63296},
  yokohama:  {name: 'Yokohama', kanji: '横浜', lat: 35.45033, lon: 139.63422},
  hakone:    {name: 'Hakone', kanji: '箱根', lat: 35.18949, lon: 139.02538},
  fuji:      {name: 'Mount Fuji', kanji: '富士山', lat: 35.36056, lon: 138.7275},
  echizen:   {name: 'Echizen', kanji: '越前', lat: 35.9035, lon: 136.16875},
  mino:      {name: 'Mino', kanji: '美濃', lat: 35.54475, lon: 136.90756},
  nishijin:  {name: 'Nishijin', kanji: '西陣', lat: 35.02967, lon: 135.75189},
  berlin:    {name: 'Berlin', kanji: '', lat: 52.52, lon: 13.405},
  amsterdam: {name: 'Amsterdam', kanji: '', lat: 52.36667, lon: 4.88333},
  batavia:   {name: 'Batavia', kanji: '', lat: -6.2, lon: 106.8},
  canton:    {name: 'Canton', kanji: '廣州', lat: 23.13, lon: 113.26},
  paris:     {name: 'Paris', kanji: '', lat: 48.85667, lon: 2.35222},
  giverny:   {name: 'Giverny', kanji: '', lat: 49.07611, lon: 1.52917},
  london:    {name: 'London', kanji: '', lat: 51.5074, lon: -0.1278},
  boston:    {name: 'Boston', kanji: '', lat: 42.36028, lon: -71.05778},
  chicago:   {name: 'Chicago', kanji: '', lat: 41.88194, lon: -87.62778},
  washington:{name: 'Washington', kanji: '', lat: 38.9072, lon: -77.0369},
  norfolk:   {name: 'Norfolk, Virginia', kanji: '', lat: 36.85, lon: -76.29},
  uraga:     {name: 'Uraga · Edo Bay', kanji: '浦賀', lat: 35.25, lon: 139.72},
  lyon:      {name: 'Lyon', kanji: '', lat: 45.764, lon: 4.8357},
  tokyo:     {name: 'Tokyo', kanji: '東京', lat: 35.68944, lon: 139.69167}
};

/* Positions on the 1859 Library of Congress map (Ansei kaisei Ōedo ōezu), as percentages of the image; approximate, set by eye against the castle and the Sumida. */
const CITY = {
  castle:    {x: 53, y: 44, label: 'Edo Castle'},
  nihonbashi:{x: 62, y: 58, label: 'Nihonbashi · the publishers’ streets'},
  theatres:  {x: 65, y: 53, label: 'Sakai-chō and Fukiya-chō · two of the three theatres, to 1841'},
  kobiki:    {x: 57, y: 66, label: 'Kobiki-chō · the third theatre, to 1841'},
  shiba:     {x: 45, y: 71, label: 'Shiba Shinmei-mae · Izumiya’s shop'},
  ryogoku:   {x: 70, y: 72, label: 'Ryōgoku Bridge · built after 1657'},
  honjo:     {x: 79, y: 79, label: 'Honjo · Hokusai’s birthplace (probable)'},
  ohashi:    {x: 66, y: 81, label: 'Shin-Ōhashi · the bridge of the sudden shower'},
  asakusa:   {x: 84, y: 40, label: 'Asakusa · Saruwaka-chō, the theatres from 1842'},
  yoshiwara: {x: 88, y: 30, label: 'Shin-Yoshiwara · the licensed quarter, from 1657'}
};

const PEOPLE = {
  ieyasu:   {name: 'Tokugawa Ieyasu', kanji: '徳川家康', dates: '1543–1616', role: 'the state', img: 'img/portrait-ieyasu.jpg', cap: 'Portrait attributed to Kanō Tan’yū · Commons, PD-Japan', line: 'Made Edo his seat in 1590 and the seat of the shogunate in 1603.'},
  sadanobu: {name: 'Matsudaira Sadanobu', kanji: '松平定信', dates: '1759–1829', role: 'the censor', img: 'img/portrait-sadanobu.jpg', cap: 'Self-portrait, 1787 · Commons, PD-Japan', line: 'Chief councillor 1787–93; the Kansei edicts that put a seal on every print.'},
  tsutaya:  {name: 'Tsutaya Jūzaburō', kanji: '蔦屋重三郎', dates: '1750–1797', role: 'publisher', img: 'img/portrait-tsutaya.jpg', cap: 'Caricature by Santō Kyōden, 1791 · NDL via Commons, PD-Japan', line: 'Born in the Yoshiwara; publisher of Utamaro, Kyōden and all of Sharaku; fined half his assets in 1791.'},
  kyoden:   {name: 'Santō Kyōden', kanji: '山東京伝', dates: '1761–1816', role: 'writer and designer', img: 'img/portrait-kyoden.jpg', cap: 'Print by Eiri, c. 1795 · The Met, CC0', line: 'Designer as Kitao Masanobu, writer as Kyōden; fifty days in manacles in 1791.'},
  utamaro:  {name: 'Kitagawa Utamaro', kanji: '喜多川歌麿', dates: 'c. 1753–1806', role: 'designer', img: 'img/portrait-utamaro.jpg', cap: 'Portrait attributed to Eishi, 1815 · British Museum via Commons, PD', line: 'Bust portraits of women for Tsutaya in the 1790s; manacled in 1804; dead in 1806.'},
  hokusai:  {name: 'Katsushika Hokusai', kanji: '葛飾北斎', dates: '1760–1849', role: 'designer', img: 'img/portrait-hokusai.jpg', cap: 'Portrait by Keisai Eisen · Commons, PD-Japan', line: 'Apprenticed to a wood-carver as a boy; the Manga from 1814; the Fuji series c. 1830–33.'},
  eisen:    {name: 'Keisai Eisen', kanji: '渓斎英泉', dates: '1790–1848', role: 'designer', img: 'img/portrait-eisen.jpg', cap: 'Self-portrait, 1836 · Commons, PD', line: 'The all-blue prints of 1829–30 that started the fad; a courtesan of his was copied by Van Gogh.'},
  hiroshige:{name: 'Utagawa Hiroshige', kanji: '歌川広重', dates: '1797–1858', role: 'designer', img: 'img/portrait-hiroshige.jpg', cap: 'Memorial portrait by Kunisada, 1858 · The Met, CC0', line: 'The Tōkaidō of 1833–34; the Hundred Famous Views of Edo, 1856–58.'},
  kuniyoshi:{name: 'Utagawa Kuniyoshi', kanji: '歌川国芳', dates: '1797–1861', role: 'designer', img: 'img/portrait-kuniyoshi.jpg', cap: 'Memorial portrait by Yoshiiku, 1861 · British Museum via Commons, PD', line: 'Warriors from 1827, satire, cats; 408,000 sheets of loyal retainers in eight months.'},
  kunisada: {name: 'Utagawa Kunisada', kanji: '歌川国貞', dates: '1786–1865', role: 'designer', img: 'img/portrait-kunisada.jpg', cap: 'Memorial portrait by Kunichika · Brooklyn Museum via Commons, PD', line: 'Toyokuni III; the most productive actor-and-beauty designer of the century.'},
  tadakuni: {name: 'Mizuno Tadakuni', kanji: '水野忠邦', dates: '1794–1851', role: 'the censor', img: 'img/portrait-tadakuni.jpg', cap: 'Portrait by Tsubaki Chinzan · Commons, PD-Japan', line: 'Architect of the Tenpō reforms, 1841–43; out of office by the ninth month of 1843.'},
  danjuro:  {name: 'Ichikawa Danjūrō VII', kanji: '七代目市川團十郎', dates: '1791–1859', role: 'actor', img: 'img/portrait-danjuro-vii.jpg', cap: 'Surimono by Kunisada, 1823 · Library of Congress via Commons, PD', line: 'The star of the licensed theatres; banished from Edo in 1842 (probable).'},
  perry:    {name: 'Matthew C. Perry', kanji: '', dates: '1794–1858', role: 'the opening', img: 'img/portrait-perry.jpg', cap: 'Daguerreotype, Mathew Brady studio · Commons, PD-US', line: 'Four ships in Edo Bay, July 1853; the treaty of 1854.'},
  hayashi:  {name: 'Hayashi Tadamasa', kanji: '林忠正', dates: '1853–1906', role: 'dealer', img: 'img/portrait-hayashi.jpg', cap: 'Photograph, 1904 · Commons, PD', line: '166,000 prints in 218 shipments to Paris by one count; over 300,000 by another.'},
  bing:     {name: 'Siegfried Bing', kanji: '', dates: '1838–1905', role: 'dealer', img: 'img/portrait-bing.jpg', cap: 'Photograph before 1906 · Commons, PD', line: 'Le Japon artistique, 1888–91; the 1890 exhibition of over 700 prints.'},
  vangogh:  {name: 'Vincent van Gogh', kanji: '', dates: '1853–1890', role: 'copyist', img: 'img/portrait-van-gogh.jpg', cap: 'Self-portrait, 1887 · Art Institute of Chicago via Commons, PD', line: 'Bought about 660 prints in early 1887; copied Hiroshige’s bridge in the rain that October.'},
  fenollosa:{name: 'Ernest Fenollosa', kanji: '', dates: '1853–1908', role: 'curator', img: 'img/portrait-fenollosa.jpg', cap: 'Photograph, c. 1890 · Commons, PD', line: 'Boston’s first curator of Japanese art; Japan’s first ukiyo-e exhibition, Tokyo, 1898.'},
  wright:   {name: 'Frank Lloyd Wright', kanji: '', dates: '1867–1959', role: 'dealer', img: 'img/portrait-wright.jpg', cap: 'Photograph, 1926 · Library of Congress via Commons, PD', line: 'Hiroshige show in Chicago, 1906; a $125,000 print deal with the Spauldings; the 1920 scandal.'},
};

/* Timeline events. kind: state | trade | print | world | after. img = thumb for the timeline. */
const EVENTS = [
  {id:'e1603', year:1603, label:'The shogunate at Edo', kind:'state', img:'thumb/portrait-ieyasu.jpg'},
  {id:'e1635', year:1635, label:'Alternate attendance made law', kind:'state'},
  {id:'e1641', year:1641, label:'The Dutch confined to Dejima', kind:'world', img:'thumb/dejima-keiga.jpg'},
  {id:'e1657', year:1657, label:'The Meireki fire', kind:'state'},
  {id:'e1659', year:1659, label:'The VOC orders 64,866 pieces of Arita', kind:'trade', img:'thumb/arita-cma-1970-46.jpg'},
  {id:'e1672', year:1672, label:'Moronobu signs his pictures', kind:'print'},
  {id:'e1721', year:1721, label:'The census: over a million', kind:'state'},
  {id:'e1765', year:1765, label:'Full colour: the calendar prints', kind:'print'},
  {id:'e1783', year:1783, label:'Tsutaya moves to Tōri Abura-chō', kind:'trade', img:'thumb/portrait-tsutaya.jpg'},
  {id:'e1790', year:1790, label:'The kiwame seal', kind:'state'},
  {id:'e1791', year:1791, label:'Kyōden manacled, Tsutaya fined', kind:'state', img:'thumb/portrait-kyoden.jpg'},
  {id:'e1794', year:1794, label:'Sharaku’s ten months', kind:'print'},
  {id:'e1804', year:1804, label:'Utamaro manacled', kind:'state', img:'thumb/portrait-utamaro.jpg'},
  {id:'e1807', year:1807, label:'The publishers’ guild', kind:'trade'},
  {id:'e1814', year:1814, label:'The Hokusai Manga', kind:'print', img:'thumb/portrait-hokusai.jpg'},
  {id:'e1829', year:1829, label:'The all-blue prints', kind:'print', img:'thumb/eisen-aizuri.jpg'},
  {id:'e1831', year:1831, label:'Thirty-six Views of Fuji', kind:'print', img:'thumb/wave-met-jp1847.jpg'},
  {id:'e1833', year:1833, label:'Hiroshige’s Tōkaidō', kind:'print', img:'thumb/nihonbashi-met-jp471.jpg'},
  {id:'e1842', year:1842, label:'The Tenpō edict', kind:'state', img:'thumb/portrait-tadakuni.jpg'},
  {id:'e1847', year:1847, label:'408,000 sheets', kind:'print', img:'thumb/portrait-kuniyoshi.jpg'},
  {id:'e1853', year:1853, label:'Perry in Edo Bay', kind:'world', img:'thumb/portrait-perry.jpg'},
  {id:'e1855', year:1855, label:'The earthquake catfish', kind:'print'},
  {id:'e1857', year:1857, label:'The Hundred Views of Edo', kind:'print', img:'thumb/shower-met-jp2522.jpg'},
  {id:'e1859', year:1859, label:'Yokohama opens', kind:'world', img:'thumb/dutchship-met-2007-49-236.jpg'},
  {id:'e1868', year:1868, label:'Meiji: Edo becomes Tokyo', kind:'state'},
  {id:'e1867', year:1867, label:'Japan at the Paris exposition', kind:'after'},
  {id:'e1887', year:1887, label:'Van Gogh’s copies', kind:'after', img:'thumb/portrait-van-gogh.jpg'},
  {id:'e1890', year:1890, label:'Bing’s 700 prints in Paris', kind:'after', img:'thumb/portrait-bing.jpg'},
  {id:'e1898', year:1898, label:'Fenollosa’s Tokyo show', kind:'after', img:'thumb/portrait-fenollosa.jpg'},
  {id:'e1906', year:1906, label:'Wright’s Hiroshige show, Chicago', kind:'after', img:'thumb/portrait-wright.jpg'},
  {id:'e1921', year:1921, label:'The Spaulding gift', kind:'after'},
  {id:'e2020', year:2020, label:'111 Great Waves located', kind:'after', img:'thumb/great-wave-aic.jpg'},
  {id:'e2024', year:2024, label:'The thousand-yen note', kind:'after'}
];

const ERAS = [
  {id:'a', from:1603, to:1657, name:'A city is made'},
  {id:'b', from:1657, to:1765, name:'Black ink to colour'},
  {id:'c', from:1765, to:1806, name:'The golden age, under a censor', short:'Golden age'},
  {id:'d', from:1806, to:1842, name:'Blue and the road', short:'Blue'},
  {id:'e', from:1842, to:1868, name:'The ban and the opening', short:'The ban'},
  {id:'f', from:1868, to:2026, name:'The afterlife'}
];

/* Chapters and beats. Each beat drives the map and the timeline through `scene`. */
const CHAPTERS = [
{
  id:'c0', n:'', title:'A picture in your wallet', kicker:'Prologue', years:[2024,2024],
  beats:[
    {id:'b0-1', scene:{map:{view:'world', points:['tokyo']}, time:{year:2024, show:['e2024']}},
     html:`<p class="lede">On 3 July 2024 Japan issued a new thousand-yen note. On its back is a wave, caught at the instant before it breaks, with Mount Fuji small and still behind it. The picture was made in Edo around 1831 and sold for sixteen or twenty mon, the price of a bowl of noodles. The state that now prints it on money had, in 1842, banned half of what the same trade sold and capped the price of the rest.</p>
     <p>This is a history of that trade: a city of a million people, a four-trade production line, a censor with a seal, a market priced in bowls of soba, a pigment that came by ship from Berlin, and an afterlife in Paris, Boston and Chicago that is a trade in its own right. It is told as one thread, from the founding of the city to the banknote. The map and the timeline beside you move as you read; at any point you can take them over and explore.</p>
     <p class="note">Every figure here carries a confidence word from the research: <em>documented</em> unless it says <em>probable</em> or <em>contested</em>. The sources are listed at the end. Images are open-licence: the Metropolitan Museum, the Cleveland Museum, the Art Institute of Chicago, the Library of Congress and Wikimedia Commons, as each states.</p>`}
  ]
},
{
  id:'c1', n:'1', title:'A city of a million', kicker:'1603–1721 · the market came before the pictures', years:[1603,1721],
  beats:[
    {id:'b1-1', people:['ieyasu'], scene:{map:{view:'japan', points:['edo','kyoto','osaka']}, time:{year:1603, show:['e1603']}},
     html:`<h3>A castle town on a marsh</h3>
     <p>In 1590 Tokugawa Ieyasu was given the eastern provinces and chose, for his seat, a small castle on a marshy bay called Edo. In 1603 he was made shogun and Edo became the seat of government, while the emperor stayed in Kyoto, three hundred miles west, and Osaka remained the country's warehouse. The village had held perhaps 1,800 people before 1590 (probable). The city that grew there was planned from the castle outward: the lords' mansions on the high ground to the west and south, the townspeople on reclaimed land along the bay and the rivers to the east.</p>
     <p>Edo was a company town of a particular kind. Its largest employer was the state, and its largest class of consumers were samurai on fixed stipends, far from home, with time on their hands.</p>`},
    {id:'b1-2', scene:{map:{view:'japan', points:['edo','kyoto','osaka','nagasaki','arita'], arcs:[['kyoto','edo'],['osaka','edo'],['nagasaki','edo'],['arita','edo']]}, time:{year:1641, show:['e1635','e1641']}},
     html:`<h3>The lords are ordered to live here</h3>
     <p>From the 1630s every daimyō in Japan was required to live in Edo in alternate years and to leave his wife and heir there when he went home. The rule, <em>sankin-kōtai</em>, was made law in 1635. It filled the city with retinues who had to be housed, fed, dressed and entertained, and it filled the roads with processions that needed inns, porters and souvenirs. The samurai half of Edo's population was, in effect, an audience that renewed itself every year.</p>
     <p>In the same decade the state closed most of its doors to the outside world. From 1641 the Dutch were confined to Dejima, a fan-shaped artificial island in Nagasaki harbour, and the Chinese to a compound in the same town. Later historians called this <em>sakoku</em>, the closed country; the Japanese term the state itself used was closer to "four mouths", the four controlled gates through which trade continued. One of those mouths, Nagasaki, is how a blue pigment made in Berlin would reach a print shop in Edo a century and a half later.</p>`,
     fig:{src:'img/dejima-keiga.jpg', alt:'Dutch personnel and Japanese women watching an arriving ship at Dejima, painting by Kawahara Keiga', cap:'Kawahara Keiga, <em>Dutch personnel and Japanese women watching an incoming ship at Dejima</em>, 1820s · Commons, public domain'}},
    {id:'b1-3', scene:{map:{view:'city', city:['castle','ryogoku','honjo','yoshiwara','asakusa']}, time:{year:1657, show:['e1657']}},
     html:`<h3>The fire of January 1657</h3>
     <p>In the first month of 1657 a fire that began in a temple in Hongō burned for two days and took six tenths of the city, including the castle keep, which was never rebuilt. The death toll is given as anything from thirty thousand to over a hundred thousand; the sources disagree and the course gives the range. The rebuilding is the city you see on the 1859 map: the Sumida was bridged at Ryōgoku so that the eastern bank could be settled, and the districts of Honjo and Fukagawa grew there. Hokusai was born in Honjo a century later (probable).</p>
     <p>The fire also moved the pleasure quarter. The licensed brothel district had stood near Nihonbashi since 1617; after 1657 it was rebuilt on the paddy fields north of Asakusa, on the edge of the city, and called the Shin-Yoshiwara, the New Yoshiwara. It stayed there, behind its moat and its single gate, until 1958. It is the most pictured place in this history, and the subject of a content note later in it.</p>`,
     fig:{src:'img/map-edo-1859.jpg', alt:'Woodblock-printed map of Edo, 1859, with the castle at the centre and the Sumida river', cap:'<em>Ansei kaisei Ōedo ōezu</em>, a printed map of Edo, 1859 (a reissue of a 1696 map) · Library of Congress, Geography and Map Division, free to use'}},
    {id:'b1-4', scene:{map:{view:'world', points:['edo','london','paris']}, time:{year:1721, show:['e1721']}},
     html:`<h3>Counted: over a million</h3>
     <p>The first census of the city, in 1721, counted about 1.3 million people, samurai and townspeople in nearly equal numbers, and nearly seventy per cent of them male (probable). No city in Europe was as large; London would not pass a million until the next century. The figure matters for the pictures because a print run is a bet on buyers, and here the buyers were a million strong, literate in large part, and short of entertainment that a samurai household could afford.</p>
     <p>Three institutions organised their leisure, and all three were licensed by the state: the three kabuki theatres, which stood in the town centre at Sakai-chō, Fukiya-chō and Kobiki-chō; the Yoshiwara; and the sumō at Ryōgoku. These are the subjects of the prints in the century that follows, and the reason the state could later ban the subjects by name.</p>
     <div class="stats"><div><b>1,300,000</b><span>people in Edo in 1721 (documented: the first census)</span></div><div><b>3</b><span>licensed theatres, one licensed quarter</span></div><div><b>6 / 10</b><span>of the city burned in 1657</span></div></div>`},
    {id:'b1-5', scene:{map:{view:'japan', points:['edo','kyoto','nishijin','arita','nagasaki','echizen'], arcs:[['arita','nagasaki'],['echizen','edo'],['nishijin','edo']]}, time:{year:1659, show:['e1659']}},
     html:`<h3>What the city already made</h3>
     <p>Before the prints, Edo's buyers sustained a dozen trades, each with its own licence and its own names. Samurai dress was stencil-dyed in patterns so fine they read as plain cloth from a distance, <em>Edo komon</em>, each domain with its own pattern, the dye-houses strung along the Kanda river. Lacquerers like the Kajikawa family made the <em>inrō</em> that hung from a man's sash across generations; the netsuke that held them were carved by men whose names a 1781 book listed. Porcelain came from Arita in the far west: in 1659 the Dutch East India Company ordered 64,866 pieces for Europe, and within a generation Arita jugs were being mounted in silver by Dutch silversmiths. Silk came from Nishijin in Kyoto; the best paper, as we will see, from Echizen.</p>
     <p>Hold on to this. The print trade did not invent Edo's market; it joined it, and it used the same roads, the same shops and the same censors.</p>`,
     figs:[{src:'img/komon-met-2001-428-40.jpg', alt:'Kosode robe with a fine Edo komon stencil pattern', cap:'Kosode with cherry blossoms and butterflies, Edo komon, late 18th–early 19th c. · The Met 2001.428.40, CC0'},{src:'img/inro-cma-1916-848.jpg', alt:'Inrō with ojime and netsuke by Shibata Zeshin', cap:'Shibata Zeshin, inrō, ojime and netsuke · Cleveland 1916.848, CC0'},{src:'img/arita-cma-1970-46.jpg', alt:'Pair of Arita porcelain jugs with Dutch silver mounts', cap:'Arita jugs in Dutch silver mounts, c. 1660–80 · Cleveland 1970.46, CC0'}]}
  ]
},
{
  id:'c2', n:'2', title:'Four hands, one sheet', kicker:'1672–1765 · black ink to colour', years:[1657,1765],
  beats:[
    {id:'b2-1', scene:{map:{view:'city', city:['nihonbashi','castle']}, time:{year:1672, show:['e1672']}},
     html:`<h3>The earliest known signed prints</h3>
     <p>Pictures had been printed from woodblocks in Japan for centuries, mostly Buddhist images and the illustrations of books. What began in Edo in the 1670s was a trade in pictures as goods. Hishikawa Moronobu signed his book illustrations from 1672, and the earliest known single-sheet prints sold on their own follow. They were black ink on paper, sometimes coloured by hand with a brush, and they were sold by the publishers of popular books, the <em>jihon-don'ya</em>, from shops in the streets east of the castle around Nihonbashi.</p>
     <p>The word the trade used for its subject was <em>ukiyo</em>, the floating world. In Buddhist usage it had meant the sorrowful, transient world; by the seventeenth century the same sound, written with a different first character, meant the world of passing pleasures, the theatres and the quarter. A print of it was an <em>ukiyo-e</em>. The term names a market, not a manifesto: there was no school and no programme, only publishers and what they could sell.</p>`},
    {id:'b2-2', scene:{map:{view:'city', city:['nihonbashi']}, time:{year:1700}},
     html:`<h3>Who made a print</h3>
     <p>A print was never one hand. The trade had four roles, and workshops in Tokyo still use the four names.</p>
     <p>The <b>publisher</b>, <em>hanmoto</em>, planned the title and chose the subject, paid for the blocks, the paper and the labour, applied for permission, and sold the sheets from his own shop front, by exchange with other publishers, and through retailers. One museum's description is that he combined today's publisher, distributor, bookshop and second-hand bookshop in one business. The <b>designer</b>, <em>eshi</em>, drew the <em>hanshita-e</em>, a brush drawing on thin paper. The <b>carver</b>, <em>horishi</em>, pasted that drawing face down on a block of mountain cherry and cut through it, so that the original drawing was destroyed in the making; a master cut the faces and hair, assistants the rest. The <b>printer</b>, <em>surishi</em>, inked each block with water-based pigment and rice paste and pulled the impression by rubbing the back of the sheet with a <em>baren</em>, a coiled cord in a bamboo-leaf wrapper.</p>
     <p>Only three of the four were ever named on the sheet, and usually only one. The law of 1790 would hold the designer, the writer and the publisher responsible for a print, and never the carver or the printer. The two most skilled trades in the chain are the least recorded; this course names them where the record allows and says "not recorded" where it does not.</p>`,
     fig:{src:'img/keyblock-met-2007-49-284.jpg', alt:'Black line-block proof print for a fan by Sadahide, with registration marks', cap:'Utagawa Sadahide, proof line-block print for a fan, 19th century. The key block pulled in black; the notches outside the picture are the <em>kentō</em> registration marks copied to every colour block · The Met 2007.49.284, CC0'}},
    {id:'b2-3', tool:'process', scene:{map:{view:'kanto', points:['edo','echizen','mino','fuji'], arcs:[['echizen','edo'],['mino','edo']]}, time:{year:1744}},
     html:`<h3>The chain, from the paper village to the shop</h3>
     <p>The block was mountain cherry, <em>yamazakura</em>, prized for a fine even grain; a sheet could be no wider than a trunk. The paper was <em>hōsho</em>, thick, soft and dimensionally stable, made of pure paper-mulberry fibre; the finest came from Echizen on the Japan Sea coast, and a standard stock sheet of about 39 by 53 centimetres was cut into the <em>ōban</em> of roughly 38 by 25 that became the ordinary print. The black was <em>sumi</em>, soot ink. The pink was safflower, which fades in a few years of light; the blues were indigo and dayflower; the yellow was orpiment, an arsenic sulphide, which mixed with indigo gave green. These are the colours you see in the early prints, and the reason so many surviving sheets have lost their pinks.</p>
     <p>Press play to run the chain. The numbers are the trade's own: about ten blocks for an ordinary colour print, up to twenty for a luxurious one; about two hundred impressions a day from one printer, dropping to twenty or thirty when a sheet needed gradations; and two thousand impressions, by the standard estimate, before a publisher broke even.</p>`},
    {id:'b2-4', scene:{map:{view:'city', city:['nihonbashi','castle']}, time:{year:1765, show:['e1765']}},
     html:`<h3>New Year 1765: colour, invented at a party</h3>
     <p>Two-colour printing from registered blocks existed by 1744. Full colour arrived in a single year, and not from the trade. For the New Year of 1765 two circles of amateur poets in Edo commissioned picture calendars that hid the year's long and short months in their designs, to be exchanged at parties. They paid for the best designers and carvers and did not care about the cost; the designs used ten or a dozen blocks and the thick Echizen paper. Over a hundred designs are known from that one year. The trade saw them, bought the blocks, cut the patrons' names out and the designer's name in, and sold them. The multicoloured print, <em>nishiki-e</em>, "brocade picture", was born as a commercial afterlife of a private party.</p>
     <p>The designer the circles favoured was Suzuki Harunobu, who dominated the trade for the five years he had left to live. No likeness of him survives. The private commission never went away: the <em>surimono</em> of the next century, printed for poetry circles on thick paper with embossing and metal powders, were exempt from the price rules because they were never sold.</p>`,
     fig:{src:'img/surimono-met-jp1252.jpg', alt:'Surimono by Kuniyoshi, Water Scene, 1840', cap:'Utagawa Kuniyoshi, <em>Water Scene</em>, surimono, 1840. The private commission, seventy-five years on · The Met JP1252, CC0'}}
  ]
},
{
  id:'c3', n:'3', title:'The publisher’s gamble', kicker:'1765–1806 · the golden age, under a censor', years:[1765,1806],
  beats:[
    {id:'b3-1', people:['tsutaya'], scene:{map:{view:'city', city:['yoshiwara','nihonbashi']}, time:{year:1783, show:['e1783']}},
     html:`<h3>Tsutaya Jūzaburō, born at the gate</h3>
     <p>The organiser of this trade was the publisher, and the publisher who shows what the role could be was Tsutaya Jūzaburō, born in the Shin-Yoshiwara in 1750 and raised there. His first business, in the 1770s, was a bookshop on the road that led to the quarter's single gate, and his first product was the <em>Yoshiwara saiken</em>, the printed guide to the quarter's houses and their women, of which he became the sole publisher. In 1783 he moved into the city, to Tōri Abura-chō by Nihonbashi, the street of the big houses, and the move is the moment the quarter's publisher became Edo's.</p>
     <p>His stable was the literary and artistic talent of the decade: Santō Kyōden, who wrote comic fiction as Kyōden and designed prints as Kitao Masanobu; Kitagawa Utamaro, who lived for a time in his house; the young Bakin, apprenticed in the shop; later Jippensha Ikku. In 1788 he published an advertisement inviting poets to submit comic verses for picture books, and Utamaro's books of insects, shells and birds followed: a publisher turning a poetry circle into a product line. His seal was an ivy leaf under a three-peaked Fuji; it is on every sheet he sold.</p>`},
    {id:'b3-2', people:['utamaro'], note:'yoshiwara', scene:{map:{view:'city', city:['yoshiwara']}, time:{year:1784}},
     html:`<h3>The quarter, and the people in the pictures</h3>
     <p>The Yoshiwara was a licensed business behind a moat, with perhaps 1,750 women working in it in the eighteenth century, by some counts up to 3,000 (contested range). They were there under contract. A typical indenture around 1800, signed by a girl's father, exchanged a lump sum, for instance 25 ryō for five years, for her service, certified that she was not a Christian and gave her temple registration. Contracts ran five to ten years; debts for food, clothes and medicine could extend them. Historians read these documents in two ways, and the course gives both: as a system of bondage dressed as employment, and as one of the few recorded contracts by which a poor family could convert a daughter's labour into cash, with limits the state enforced. It does not rule.</p>
     <p>The prints show the women as the quarter sold them: by name and house. That naming is itself a legal fact. From 1793 the law forbade naming women on prints except courtesans, who could be named because they were goods. When Utamaro's portrait of Hanaōgi of the Ōgiya was reissued under the censor, her name stayed on the sheet for exactly that reason. The record also says Hanaōgi wrote poetry and calligraphy that contemporaries praised, and that in 1794 she escaped the quarter to live with a man and was brought back. The course shows her as a person first and a picture second, and never as decoration.</p>`,
     fig:{src:'img/yoshiwara-nakanocho.jpg', alt:'Hiroshige, cherry blossom time on the Nakanochō, the main street of the Yoshiwara', cap:'Utagawa Hiroshige, <em>Cherry Blossom Time in Nakanochō</em>, the quarter’s main street · LACMA via Commons, public domain'}},
    {id:'b3-3', people:['sadanobu','kyoden'], scene:{map:{view:'city', city:['nihonbashi','castle']}, time:{year:1791, show:['e1790','e1791']}},
     html:`<h3>1790: the seal</h3>
     <p>In 1787 Matsudaira Sadanobu became chief councillor and began the Kansei reforms, an attempt to restore frugality and order after a decade of famine and a loose administration. In the fifth month of 1790 the reforms reached print. Publishers' guilds were to appoint censors from among their own members, by rotation; every design was to be submitted before cutting; approval was marked by a small round seal reading <em>kiwame</em>, "examined", cut into the key block so that it printed on every sheet. The earliest sealed prints are from late 1790 or early 1791; one scholar dates the obligation to 1793 (contested at the margin). From then until 1842 every legal print in Edo carries the state in its margin.</p>
     <p>The seal was followed by the examples. In 1791 three of Kyōden's comic novels, published by Tsutaya, were judged to offend. Kyōden was manacled for fifty days; Tsutaya was fined half of everything he owned. Later edicts forbade naming women other than courtesans (1793 and 1796), banned rebus titles after one of Utamaro's puzzle series (1796), and in 1800 banned the large-head bust portraits of women on the stated ground that they were "conspicuous".</p>`,
     fig:{src:'img/portrait-tsutaya.jpg', alt:'Caricature of the publisher Tsutaya Jūzaburō by Santō Kyōden, 1791', cap:'Santō Kyōden, caricature of Tsutaya Jūzaburō, 1791, the year of the fine · National Diet Library via Commons, PD-Japan'}},
    {id:'b3-4', scene:{map:{view:'city', city:['nihonbashi']}, time:{year:1795, show:['e1794']}},
     html:`<h3>The answer to the fine</h3>
     <p>Tsutaya's answer to losing half his assets was to make the most expensive prints of the decade. Utamaro's bust portraits of women on grounds of powdered mica, printed for Tsutaya in the early 1790s, are the prints that defined the trade's golden age and that the edict of 1800 would ban. Then, in the fifth month of 1794, Tsutaya issued the first actor portraits by a designer nobody had heard of, signed Tōshūsai Sharaku: large heads on mica, unflattering, exact. About a hundred and forty designs followed in ten months, all for Tsutaya, and then nothing. Who Sharaku was is not known; the course does not guess.</p>
     <p>Tsutaya died in 1797, aged 48. His shop continued under his name into the next century. In 1804 Utamaro was manacled for fifty days for a print of the sixteenth-century warlord Hideyoshi with his concubines, a subject the state regarded as its own; he died in 1806. The golden age ended in handcuffs twice.</p>`,
     fig:{src:'img/kiyonaga-cma-1930-197.jpg', alt:'Torii Kiyonaga diptych of 1783', cap:'Torii Kiyonaga, diptych, 1783: the tall figures of the decade before the seal. No open impression of a Sharaku or of a Tsutaya-published Utamaro was available at the holders’ APIs on 4 October; the Art Institute’s are linked in the sources · Cleveland 1930.197, CC0'}},
    {id:'b3-5', tool:'margin', scene:{map:{view:'city', city:['ohashi','nihonbashi']}, time:{year:1795}},
     html:`<h3>Read the margin</h3>
     <p>A print documents its own licensing. Everything it says about its making sits outside the picture: who drew it, who published it, who examined it and when. The sheet below is later than Tsutaya, a Hiroshige of 1857, chosen because it carries the full set of marks and because the Met's image is open. Tap each mark. When you have read all five, you will be asked to date a sheet from its seals alone, which is what a curator does first.</p>`}
  ]
},
{
  id:'c4', n:'4', title:'Blue', kicker:'1806–1842 · the road, the mountain and a pigment’s price', years:[1806,1842],
  beats:[
    {id:'b4-1', people:['hokusai'], scene:{map:{view:'city', city:['honjo','nihonbashi','ryogoku']}, time:{year:1814, show:['e1807','e1814']}},
     html:`<h3>The guild, and an old man’s sketchbooks</h3>
     <p>In 1807 the Edo publishers of pictures and popular books were formally constituted as a guild, the <em>jihon toiya</em>. Tsuruya Kiemon, Izumiya Ichibei and Moriya Jihei were founder members, and all three took their turns as guild censors in 1811–13. The guild owned the system: blocks belonged to publishers, who enforced their rights against each other through it. Over a thousand publishers are known across the period; about two hundred worked in Edo at the peak of the 1840s (probable).</p>
     <p>Into this guild's market came Katsushika Hokusai, born in Honjo in 1760, apprenticed to a wood-carver as a boy, trained under the actor-print master Shunshō, and already fifty-four when a Nagoya publisher, Eirakuya Tōshirō, began issuing his <em>Manga</em> in 1814: fifteen volumes of sketches, over four thousand of them by the end, sold as a drawing manual. One museum credits him with thirty to forty thousand drawings in his life, a round number but the right order. He changed his name some thirty times and his address nearly a hundred, and he would not make his most famous picture until he was over seventy.</p>`,
     fig:{src:'img/portrait-hokusai.jpg', alt:'Portrait of Hokusai by Keisai Eisen', cap:'Keisai Eisen, portrait of Hokusai · Commons, PD-Japan'}},
    {id:'b4-2', tool:'blue', scene:{map:{view:'blue', points:['berlin','amsterdam','batavia','canton','nagasaki','edo'], arcs:[['berlin','amsterdam'],['amsterdam','batavia'],['batavia','nagasaki'],['canton','nagasaki'],['nagasaki','edo']]}, time:{year:1829, show:['e1829']}},
     html:`<h3>A chemist’s accident in Berlin</h3>
     <p>The deepest blue in Japanese printing was made first in Berlin, by accident, around 1704, when a colour-maker's red came out blue because a contaminated potash had been used: ferric ferrocyanide, the first modern synthetic pigment, called Prussian blue in Europe and <em>bero-ai</em>, "Berlin indigo", in Edo. For a century it reached Japan the only way anything European did, on Dutch ships through Nagasaki, and later on Chinese ones. When it arrived is contested: one account puts it at Dejima around 1790 and costly until 1820; another says it was known but little used until the 1820s. What is documented is the price. From the mid-1820s Chinese makers produced it in bulk, and between 1824 and 1828 its price at Nagasaki fell steeply (the series is in the research file; the shape is what the sources describe). A pigment for the rich became a pigment for a sixteen-mon sheet. It was never manufactured in Japan in the period.</p>
     <p>Scrub the years below and watch the route and the price. The check at the end is one tap.</p>`},
    {id:'b4-3', people:['eisen'], scene:{map:{view:'city', city:['nihonbashi']}, time:{year:1831, show:['e1829','e1831']}},
     html:`<h3>1829: all blue</h3>
     <p>In 1829 Keisai Eisen, a designer of beauties and a hard-living man by his own later account, designed prints in the new blue alone, <em>aizuri-e</em>, blue-printed pictures. One of them, by a bookseller's later memoir, was a fan that sold so well that the publisher Nishimuraya Yohachi, the Eijudō at Bakuro-chō, decided to issue a series of views of Mount Fuji by Hokusai in the same blue (probable: a single, later source). At New Year 1831 Eijudō advertised the <em>Thirty-six Views of Mount Fuji</em>, to appear a sheet at a time, "in the new blue". The wave off Kanagawa, the red mountain in a south wind and the summit shower were among the first.</p>
     <p>Look at Eisen's sheet: a whole picture in gradations of one imported colour. Then look at what Hokusai did with the same pigment two years later.</p>`,
     fig:{src:'img/eisen-aizuri.jpg', alt:'Keisai Eisen, a blue-printed beauty, aizuri-e', cap:'Keisai Eisen, from <em>Beauties for the Five Festivals</em>, printed in blue alone, early 1830s · National Diet Library via Commons, PD-Japan'}},
    {id:'b4-4', scene:{map:{view:'kanto', points:['edo','kanagawa','fuji']}, time:{year:1831, show:['e1831']}},
     html:`<h3>Under the wave off Kanagawa</h3>
     <p>Three boats of the kind that carried fish to Edo's market, in the trough of a swell off the Kanagawa shore, and Fuji small and still behind. The Met's spectroscopy found Prussian blue mixed with indigo in the dark stripes of the wave and pure Prussian blue, printed twice, in the hollow where the boats are; the sky's pink was safflower and was the first colour to fade. The sheet cost sixteen or twenty mon, by the standard comparison a little more than a double helping of soba. Neither the Met nor the British Museum gives a sales figure, because none survives; the estimate most quoted is up to eight thousand impressions before the key block had to be recut, and the course reports that as an estimate.</p>
     <p>By 2020, 111 original impressions had been located, by 2024, 113. None of the blocks survives. The sheet below is one of the Met's four.</p>`,
     fig:{src:'img/wave-met-jp1847.jpg', alt:'Hokusai, Under the Wave off Kanagawa, Met JP1847', cap:'Katsushika Hokusai, publisher Nishimuraya Yohachi (Eijudō), <em>Under the Wave off Kanagawa</em>, from Thirty-six Views of Mount Fuji, c. 1830–32 · The Met JP1847, CC0', wide:true}},
    {id:'b4-5', tool:'waves', scene:{map:{view:'kanto', points:['edo','kanagawa','fuji']}, time:{year:1832, show:['e1831']}},
     html:`<h3>One design, many originals</h3>
     <p>There is no "the" Great Wave; there is an edition. The three impressions below are three originals, pulled from the same blocks at different points in their life. Conservators order them by wear: the breaks that opened in the border of the title cartouche, the break behind the right-hand boat, the loss of fine line near the summit, the late recutting of the sea and the boats, the pink boats of the last printings, and a splinter of wood that printed into the foam of some impressions and that no reproduction has. The Art Institute's own record says its three impressions are all later than the first state. Swipe between them; switch on a diagnostic and it marks all three.</p>`},
    {id:'b4-6', people:['hiroshige'], scene:{map:{view:'tokaido', points:['nihonbashi','kanagawa','hakone','kyoto'], route:['nihonbashi','kanagawa','hakone','fuji','kyoto']}, time:{year:1833, show:['e1833']}},
     html:`<h3>The road</h3>
     <p>Hiroshige was a fire-watchman's son who inherited his father's post at thirteen and drew in the hours it left him. In 1833–34, in his mid-thirties, he designed for the publisher Hōeidō a series of the fifty-three post stations of the Tōkaidō, the road between Edo and Kyoto that the lords' processions travelled, with Nihonbashi as the start and Kyoto as the end: fifty-five sheets. The Tōkaidō is the series the trade reprinted most; the estimate is twelve to fifteen thousand impressions of some designs. The first sheet is the bridge at Nihonbashi at dawn, a daimyō's procession stepping onto it and fish-sellers stepping off: the two Edos, the lords' and the market's, on one bridge.</p>
     <p>Hokusai's mountain and Hiroshige's road are the two products the rest of the world would later take for the whole of Japanese printing. In Edo in the 1830s they were one publisher's bet on a pigment and another's on the souvenir trade, in a market whose best sellers were still actors and women.</p>`,
     fig:{src:'img/nihonbashi-met-jp471.jpg', alt:'Hiroshige, Station One: Morning View of Nihonbashi', cap:'Utagawa Hiroshige, publisher Hōeidō, <em>Station One: Morning View of Nihonbashi</em>, from the Fifty-three Stations of the Tōkaidō, c. 1833–34 · The Met JP471, CC0'}},
    {id:'b4-7', tool:'price', scene:{map:{view:'city', city:['nihonbashi']}, time:{year:1830}},
     html:`<h3>What a sheet cost</h3>
     <p>A record of 1805 gives twenty mon for an ōban sheet; by the end of the period the usual retail price was about twenty-four, some a little over thirty. A bowl of <em>kake-soba</em> cost sixteen mon for most of the period, the folk etymology of "two-eight soba", rising to twenty-four by the mid-nineteenth century. The publisher's diary that records the great Kuniyoshi sale of 1847–48 prices a triptych at sixty and seventy-two mon. A seat at the Ryōgoku theatre in 1820 is given by a secondary list as thirty-two momme of silver, several hundred times the price of a sheet (probable). Pick a year.</p>`}
  ]
},
{
  id:'c5', n:'5', title:'The ban and the road around it', kicker:'1842–1868 · the state names its subjects, and the trade changes them', years:[1842,1868],
  beats:[
    {id:'b5-1', people:['tadakuni'], scene:{map:{view:'city', city:['theatres','kobiki','asakusa']}, time:{year:1842, show:['e1842']}},
     html:`<h3>The sixth month of 1842</h3>
     <p>Mizuno Tadakuni became senior councillor in 1839 and in 1841 began the Tenpō reforms, a second attempt, fifty years after the first, to discipline the city's spending. In the sixth month of 1842 the Edo town order reached the prints. Its wording survives: single sheets of kabuki actors, courtesans and female geisha "concern public morals"; henceforth their publication, and the sale of existing stock, is forbidden. Fan prints likewise. Illustrated fiction may not take its plots from the theatre or draw actors' likenesses. Subjects should be loyalty, filial piety, chastity and the moral instruction of children. New blocks are to be submitted to a town elder for inspection.</p>
     <p>In the eleventh month the follow-up fixed the price: single sheets and fan prints not above sixteen mon, printings limited to seven or eight colour impressions, nothing larger than a triptych. A contemporary record prices an ordinary ten-colour sheet before the order at twenty-four mon. The state had banned the trade's two best-selling genres and cut the price of what remained by a third.</p>`,
     fig:{src:'img/portrait-tadakuni.jpg', alt:'Portrait of Mizuno Tadakuni', cap:'Tsubaki Chinzan, portrait of Mizuno Tadakuni · Commons, PD-Japan'}},
    {id:'b5-2', people:['danjuro'], scene:{map:{view:'city', city:['theatres','kobiki','asakusa'], move:true}, time:{year:1843, show:['e1842']}},
     html:`<h3>The theatres moved, the star exiled</h3>
     <p>The three theatres were ordered out of the city centre to a new street in Asakusa, Saruwaka-chō, beside the road to the Yoshiwara: the state put its licensed pleasures together, at the edge. The publisher Tsuruya Kiemon's serial <em>Inaka Genji</em>, a parody of the Tale of Genji that had run since 1829, was stopped and its blocks confiscated. Ichikawa Danjūrō VII, the most famous actor in Japan, was banished from Edo for extravagance for ten years (probable). On the map, the theatres move.</p>
     <p>The censorship machine changed with the subjects. Guild self-censorship ended; from 1843 government ward headmen, <em>nanushi</em>, stamped prints with their own names, one seal until 1847, two from 1847 to 1852, two with a date seal in 1852–53; from 1853 a single seal reading <em>aratame</em>, "examined", usually with a date, until formal censorship ended around 1875. A sheet's margin dates it to within a few years for the rest of the period, which is why you were asked to read one.</p>`,
     fig:{src:'img/portrait-danjuro-vii.jpg', alt:'Ichikawa Danjūrō VII in a surimono by Kunisada, 1823', cap:'Utagawa Kunisada, Ichikawa Danjūrō VII, surimono, 1823 · Library of Congress via Commons, PD'}},
    {id:'b5-3', tool:'ban', scene:{map:{view:'city', city:['asakusa','nihonbashi']}, time:{year:1847}},
     html:`<h3>How a trade routes around a ban</h3>
     <p>Osaka's actor prints stopped almost entirely until 1847. Edo's did not. A magistrate's report of 1847 says that by then six or seven tenths of what sold were actor pictures "without names": history and warrior subjects, exempt as instruction in loyalty, with the banned actors' faces on them, and that a three-sheet set was changing hands between amateurs for well over the cap. Landscapes were not exempt by name; they were simply not named, and the trade poured into the gap. Drag across 1842 below.</p>`},
    {id:'b5-4', people:['kuniyoshi'], tool:'edition', scene:{map:{view:'city', city:['nihonbashi']}, time:{year:1848, show:['e1847']}},
     html:`<h3>408,000 sheets</h3>
     <p>Utagawa Kuniyoshi had made his name in 1827 with warriors, the heroes of the Chinese novel <em>Suikoden</em> tattooed and fighting. The ban made warriors the trade's safest genre, and in 1847 he gave it the loyal retainers of the forty-seven-rōnin story, one sheet each, fifty-one in all, approved by the nanushi censor Murata Sahei, whose seal is on the sheets. The publisher Fujiokaya's diary records what happened: between the seventh month of 1847 and the third month of 1848 the series sold eight thousand sets, 408,000 sheets. The same diary records a flop that printed three thousand and sold four hundred and fifty. Press play and watch the counter; then watch the flop.</p>
     <p>Kuniyoshi also drew cats, in every print he could, and the ghosts and monsters the edict had not thought to name. The monster cat of Okazaki, from a ghost play on the Tōkaidō, is a cat, a play and an actor's face at once.</p>`,
     fig:{src:'img/cat-met-jp1563.jpg', alt:'Kuniyoshi, Scene from a Ghost Story: The Okazaki Cat Demon', cap:'Utagawa Kuniyoshi, <em>Scene from a Ghost Story: The Okazaki Cat Demon</em>, c. 1850 · The Met JP1563, CC0'}},
    {id:'b5-5', people:['perry'], scene:{map:{view:'pacific', points:['norfolk','uraga','edo'], arcs:[['norfolk','uraga']]}, time:{year:1855, show:['e1853','e1855']}},
     html:`<h3>Four ships, and a catfish</h3>
     <p>In July 1853 four American ships under Commodore Matthew Perry anchored off Uraga at the mouth of Edo Bay and would not leave until a letter had been received; in 1854 they came back and a treaty was signed. The prints answered in days, as they answered everything. On 11 November 1855 an earthquake struck Edo, and within two days the shops were selling <em>namazu-e</em>, pictures of the giant catfish that folk belief held responsible, over 380 kinds by one diarist's count: an unlicensed genre at the speed of news, in which the catfish was beaten by the poor and thanked by the carpenters.</p>
     <p>The port that opened to the new trade was not Nagasaki but Yokohama, a fishing village on the shore where Hokusai had set his wave. From 1859 it was the foreigners' town, and the Yokohama prints of their ships, their women and their horses were the last new genre the Edo trade invented.</p>`,
     fig:{src:'img/dutchship-met-2007-49-236.jpg', alt:'Yoshitomi, Dutch Ship, 1861', cap:'Utagawa Yoshitomi, <em>Dutch Ship (Orandasen)</em>, Yokohama, second month of 1861 · The Met 2007.49.236, CC0'}},
    {id:'b5-6', scene:{map:{view:'city', city:['ohashi','ryogoku','yoshiwara','asakusa']}, time:{year:1858, show:['e1857','e1859','e1868']}},
     html:`<h3>A hundred views of a city about to be renamed</h3>
     <p>Between 1856 and his death in 1858 Hiroshige designed for the publisher Uoya Eikichi the <em>One Hundred Famous Views of Edo</em>, a hundred and nineteen sheets of the city in every season, in the vertical format the cap allowed, with the aratame and date seals in every margin. The sudden shower over the Shin-Ōhashi bridge is the sheet whose margin you read. It was the last great series of the Edo trade. In 1864 aniline dyes arrived and the palette of the final prints changed to the harsh reds and purples that mark them. In 1867 the shogun resigned; in 1868 the emperor moved to Edo and it was renamed Tokyo. In 1872 a decree cancelled the Yoshiwara women's debts, and an estimated nine tenths of them left in the months that followed (probable).</p>
     <p>The trade did not end. It was about to find its best customers.</p>`,
     fig:{src:'img/shower-met-jp2522.jpg', alt:'Hiroshige, Sudden Shower over Shin-Ōhashi Bridge and Atake', cap:'Utagawa Hiroshige, publisher Uoya Eikichi, <em>Sudden Shower over Shin-Ōhashi Bridge and Atake</em>, from One Hundred Famous Views of Edo, 1857 · The Met JP2522, CC0'}}
  ]
},
{
  id:'c6', n:'6', title:'The afterlife', kicker:'1867–2024 · exported by the hundred thousand, and changed by it', years:[1868,2026],
  beats:[
    {id:'b6-1', people:['hayashi','bing'], scene:{map:{view:'export', points:['tokyo','paris','amsterdam','london'], arcs:[['tokyo','paris'],['tokyo','london']]}, time:{year:1890, show:['e1867','e1890']}},
     html:`<h3>Paris: 218 shipments</h3>
     <p>Japan showed at the Paris exposition of 1867, the last year of the shogunate, and the prints went out with the porcelain and the lacquer as the wrapping and the samples of a new trade. The story that the engraver Bracquemond found Hokusai's Manga used as packing in 1856 is told everywhere and doubted by the careful; the course tells it as a legend with its doubter named. The export that is documented is Hayashi Tadamasa's. He came to Paris as an interpreter for the 1878 exposition, opened a shop in 1884, and over eleven years sent 218 shipments: 166,000 prints and 9,708 illustrated books by one scholar's count, "more than 300,000 works" by another's. Both counts are shown; the course does not choose.</p>
     <p>Siegfried Bing, the Hamburg-born dealer whose Paris shop would give Art Nouveau its name, published <em>Le Japon artistique</em> in thirty-six issues and three languages from 1888 to 1891, and in 1890 hung over seven hundred prints at the École des Beaux-Arts, the first comprehensive exhibition of ukiyo-e in Europe. The painters came.</p>`},
    {id:'b6-2', people:['vangogh'], scene:{map:{view:'europe', points:['paris','amsterdam','london']}, time:{year:1887, show:['e1887']}},
     html:`<h3>October 1887</h3>
     <p>Vincent van Gogh bought about six hundred and sixty Japanese prints from Bing's stock in early 1887, hung them in a Paris café, and that autumn painted three copies in oil: a plum orchard after Hiroshige, the bridge in the rain after the sudden shower over Shin-Ōhashi, and a courtesan after Eisen, taken from the cover of a Paris magazine that had printed Eisen's beauty in reverse. The copies are in Amsterdam, where the museum's licence is non-commercial, so the course shows the print he copied and links to the painting. Monet planted a Japanese garden at Giverny and painted its bridge from 1895; Whistler had been painting in the Japanese manner in London twenty years earlier. The borrowing has a name, <em>Japonisme</em>, and a counter-name the course also teaches: appropriation, the taking of a form without its makers. Both are the subject of a unit later in the programme.</p>`,
     fig:{src:'img/portrait-van-gogh.jpg', alt:'Van Gogh, self-portrait, 1887', cap:'Vincent van Gogh, <em>Self-Portrait</em>, 1887, the year of the copies · Art Institute of Chicago via Commons, public domain'}},
    {id:'b6-3', people:['fenollosa','wright'], tool:'export', scene:{map:{view:'export', points:['tokyo','boston','chicago','washington','paris'], arcs:[['tokyo','boston'],['tokyo','chicago'],['tokyo','washington'],['tokyo','paris']]}, time:{year:1921, show:['e1898','e1906','e1921']}},
     html:`<h3>America: the collectors and the dealer-architect</h3>
     <p>Boston bought first and most. William Sturgis Bigelow brought back some thirty thousand prints; Ernest Fenollosa became the Museum of Fine Arts' first curator of Japanese art, and in 1898 went back to Tokyo to curate Japan's own first exhibition of ukiyo-e, a trade its own country had not yet thought worth a museum. In 1921 the brothers William and John Spaulding gave the museum over six thousand prints on one condition, that they never be exhibited; the collection may be studied and never shown, and the course lists it as the afterlife's own licence rule. The Smithsonian received, in 1889, a complete set of blocks, twenty-three progressive proofs, a baren and the pigments from Tokunō Michimasa: the one whole process set in a public collection.</p>
     <p>Chicago's collection came through a dealer who was also the country's most famous architect. Frank Lloyd Wright first went to Japan in 1905, mounted a Hiroshige exhibition at the Art Institute in 1906 and a larger one in 1908, and dealt in prints for the next twenty years: a 1913 agreement with the Spauldings for twenty thousand dollars grew to a hundred and twenty-five thousand in five months. In 1919–20 it was found that some of what he had sold had been "revamped", faded impressions recut and recoloured, with pinholes where the new blocks had been registered; the fraud was traced to a Tokyo dealer and a collector, and cost Wright about thirty thousand dollars in restitution. In 1928 his bank seized his house and sold thousands of his prints at a dollar each. The Plum Garden at Kameido in the Art Institute carries his name in its provenance line. Scrub the years below.</p>`},
    {id:'b6-4', scene:{map:{view:'world', points:['tokyo','london','paris','boston','chicago','washington','amsterdam']}, time:{year:2024, show:['e2020','e2024']}},
     html:`<h3>111, and a banknote</h3>
     <p>In 2020 a census by the British Museum located 111 original impressions of the Great Wave, in eight states by the wear of the blocks, not the twenty-one once claimed; by 2024 the count was 113. Red Fuji has 93 known impressions in five states. The Met holds all forty-six designs of the Fuji series in 121 impressions. None of the blocks survives, and no record of how many sheets were printed exists; the eight thousand is an inference from the blocks' wear, and some conservators say the number is unknowable. The course shows both readings and rules on neither.</p>
     <p>On 3 July 2024 the Bank of Japan issued the thousand-yen note with the wave on its back. The image of the note is not open-licence, so the course describes it and links to it. A picture a publisher bet on a fad for, that a censor stamped, that sold for the price of a meal, that left the country by the hundred thousand in the holds of the export trade, is now printed by the state in the hundreds of millions. That is the whole thread: the market, the four hands, the seal, the price, the blue, the ban, the export, the icon. You have followed it from 1603. Below, the map and the timeline are yours.</p>
     <div class="stats"><div><b>113</b><span>located impressions of the Great Wave, 2024</span></div><div><b>0</b><span>blocks surviving</span></div><div><b>166,000 / 300,000+</b><span>prints Hayashi shipped to Paris: two counts, both shown</span></div></div>`}
  ]
}
];

const SOURCES = [
  'The Metropolitan Museum of Art, Collection API and object records (JP1847, JP10, JP9, JP2522, JP471, JP1115, JP1563, JP1252, 2007.49.284, 2007.49.236, 2013.851, 2001.428.40, 55.175.16); "The Great Wave: Anatomy of an Icon" (spectroscopy of the blue)',
  'The Cleveland Museum of Art, Open Access API (1930.197, 1916.848, 1970.46, 1960.193)',
  'The Art Institute of Chicago, API records (1925.3245, 1925.3030, 2004.241–243, 1925.3752); Korenberg, British Museum, the Great Wave census (2020) and Red Fuji (2021)',
  'Library of Congress, Geography and Map Division: Ansei kaisei Ōedo ōezu, 1859 (free to use); LoC Japanese prints collection',
  'Fujiokaya nikki (transcription, Kaei years): the 8,000-set sale of 1847–48 and the flop; Shichū torishimari ruishū via Ukiyo-e hikka-shi: the 1842 edict and the 1847 magistrate’s report; Katō, Ukiyo-e jiten: prices of 1842',
  'JAANUS (aratame-in, hōsho, ōbōsho); MIT Visualizing Cultures, date and nanushi seals; Viewing Japanese Prints, "Sumptuary Edicts", "Inscriptions and Seals"; Forrer, "Print sellers in Edo"',
  'Sumida Hokusai Museum and Suntory Museum pages on the publishers; Lyon Collection entries after Marks (the guild of 1807); Hoover Institution, "Nishiki-e Defined"; the V&A and the Asian Art Museum on the four roles and print runs',
  'Fitzhugh (Freer) and Smith on Prussian blue; Artelino; Wikipedia "Ukiyo-e", "Egawa Tomekichi" (the 1835 letter), "Nishimura Yohachi", "Yoshiwara"; Samurai Archives (Yoshiwara contracts; price list, secondary)',
  'Tokyo Metropolitan Government timeline and Edo-Tokyo Digital Museum (population, the 1657 fire); nippon.com and ffa-edo (soba prices)',
  'Emery (2022) after Segi (1980), Koyama-Richard, Agorha, Persée, NMWA on Hayashi; Freer/Sackler on Bing; the Met Bulletin and the Hammer Museum on Wright as dealer; MFA Boston on the Spaulding gift',
  'Wikimedia Commons file pages for every portrait, with the licence tag as each states it (PD-Japan, PD-old-100, PD-US, CC0 where the holder is the Met, Brooklyn or the Art Institute)',
  'The full research files, with every claim and its URL: modules/F1-histories-of-making/research/edo-2026-10-04/ in the course repository'
];

const DIMS = {"img/portrait-ieyasu.jpg": [1227, 1400], "img/keyblock-met-2007-49-284.jpg": [1400, 1002], "img/map-edo-1859.jpg": [1400, 1252], "img/portrait-bing.jpg": [350, 546], "img/portrait-hayashi.jpg": [722, 1004], "img/portrait-fenollosa.jpg": [987, 1400], "img/portrait-tsutaya.jpg": [920, 653], "img/portrait-kunisada.jpg": [1400, 1032], "img/dejima-keiga.jpg": [922, 600], "img/portrait-kyoden.jpg": [943, 1400], "img/nanban-cma-1960-193.jpg": [900, 820], "img/great-wave-aic.jpg": [1280, 885], "img/portrait-utamaro.jpg": [1280, 1062], "img/redfuji-met-jp9.jpg": [1400, 965], "img/eisen-aizuri.jpg": [987, 1400], "img/portrait-danjuro-vii.jpg": [912, 1024], "img/portrait-perry.jpg": [1164, 1400], "img/arita-cma-1970-46.jpg": [900, 702], "img/playbill-met-2013-851.jpg": [1400, 935], "img/wave-met-jp1847.jpg": [1400, 942], "img/portrait-sadanobu.jpg": [800, 800], "img/taira-met-jp1115.jpg": [1400, 680], "img/shower-met-jp2522.jpg": [961, 1400], "img/surimono-met-jp1252.jpg": [1263, 1400], "img/wave-met-jp10.jpg": [1400, 967], "img/portrait-wright.jpg": [853, 1400], "img/portrait-hokusai.jpg": [905, 1287], "img/portrait-tadakuni.jpg": [1037, 876], "img/cat-met-jp1563.jpg": [1400, 1022], "img/oi-yoshiwara-night.jpg": [1280, 852], "img/inro-cma-1916-848.jpg": [691, 900], "img/portrait-van-gogh.jpg": [1104, 1400], "img/portrait-eisen.jpg": [935, 1400], "img/dutchship-met-2007-49-236.jpg": [962, 1400], "img/komon-met-2001-428-40.jpg": [1159, 1400], "img/kiyonaga-cma-1930-197.jpg": [900, 683], "img/nihonbashi-met-jp471.jpg": [1400, 953], "img/nagasaki-e-dutch-ship.jpg": [1280, 1021], "img/portrait-hiroshige.jpg": [959, 1400], "img/stencil-met-55-175-16.jpg": [1400, 885], "img/portrait-kuniyoshi.jpg": [953, 1400], "img/yoshiwara-nakanocho.jpg": [1280, 853]};
return {P, CITY, PEOPLE, EVENTS, ERAS, CHAPTERS, SOURCES, DIMS};
})();

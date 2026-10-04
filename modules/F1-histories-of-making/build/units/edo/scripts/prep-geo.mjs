// Prepare the unit's geodata: world 110m (as shipped), and a 10m clip of Japan and Korea for the Japan and Kantō scales.
import fs from 'node:fs';
import * as topojson from 'topojson-client';
const w10 = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-10m.json'));
const keep = new Set(['392', '410', '408']); // Japan, South Korea, North Korea
const fc = topojson.feature(w10, w10.objects.countries);
const round = (c) => Array.isArray(c[0]) ? c.map(round) : [Math.round(c[0] * 1000) / 1000, Math.round(c[1] * 1000) / 1000];
const feats = fc.features.filter((f) => keep.has(String(f.id))).map((f) => ({ type: 'Feature', id: f.id, properties: { name: f.properties.name }, geometry: { type: f.geometry.type, coordinates: round(f.geometry.coordinates) } }));
fs.writeFileSync('public/data/japan-10m.json', JSON.stringify({ type: 'FeatureCollection', features: feats }));
fs.copyFileSync('node_modules/world-atlas/land-110m.json', 'public/data/land-110m.json');
fs.copyFileSync('node_modules/world-atlas/land-50m.json', 'public/data/land-50m.json');
console.log('ok', fs.statSync('public/data/japan-10m.json').size, fs.statSync('public/data/land-110m.json').size, fs.statSync('public/data/land-50m.json').size);

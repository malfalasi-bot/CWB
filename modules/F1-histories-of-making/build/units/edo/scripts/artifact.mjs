// Turns dist/index.html into the artifact page: the host adds its own doctype, html, head and body.
import { readFileSync, writeFileSync } from 'fs';
let s = readFileSync('dist/index.html', 'utf8');
s = s.replace(/<!doctype html>\s*/i, '').replace(/<\/?html[^>]*>\s*/g, '').replace(/<\/?head>\s*/g, '').replace(/<body>\s*/, '').replace(/<\/body>\s*/, '');
s = s.replace(/<meta charset[^>]*>\s*/, '').replace(/<meta name="viewport"[^>]*>\s*/, '');
writeFileSync('dist/page.html', s);
console.log('dist/page.html', s.length, 'bytes');

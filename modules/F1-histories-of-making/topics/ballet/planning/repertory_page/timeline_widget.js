/* Whole-history ballet timeline. Reads window.TL (timeline.json) and draws into #tl.
   Piecewise scale: each era gets a width set by how many works it holds, so the crowded
   twentieth century is legible and the sparse court centuries are not empty plains. */
(function () {
  var TL = window.TL; if (!TL) return;
  var root = document.getElementById('tl'); if (!root) return;
  var NS = 'http://www.w3.org/2000/svg';
  var laneH = 44, evLaneH = 30, top = 78, left = 8, gapH = 30;
  var state = { thread: '', era: '', sel: null };

  var threadNames = window.TL_THREADS || {};
  var events = TL.events || [];
  var eras = TL.eras.map(function (e) {
    var n = TL.works.filter(function (w) { return w.era === e.id; }).length;
    var m = events.filter(function (v) { var y = parseInt(String(v.year), 10); return y >= e.from && y <= e.to; }).length;
    return Object.assign({}, e, { n: n, m: m, w: Math.max(170, n * 20, m * 12) });
  });
  var x0 = left; eras.forEach(function (e) { e.x = x0; x0 += e.w; });
  var width = x0 + 16;
  var lanes = TL.lanes;
  var evLanes = events.length ? (TL.event_lanes || []) : [];
  var lanesTop = top;
  var evTop = lanesTop + lanes.length * laneH + (evLanes.length ? gapH : 0);
  var height = evTop + evLanes.length * evLaneH + 16;

  function xOf(year, eraId) {
    var e = eras.filter(function (x) { return x.id === eraId; })[0] ||
      eras.filter(function (x) { return year >= x.from && year <= x.to; })[0] || eras[eras.length - 1];
    var span = Math.max(1, e.to - e.from);
    var t = Math.min(1, Math.max(0, (year - e.from) / span));
    return e.x + 12 + t * (e.w - 24);
  }
  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(n); return n;
  }
  function lines(text, max) {
    var out = [], cur = '';
    text.split(' ').forEach(function (wd) { if ((cur + ' ' + wd).trim().length > max && cur) { out.push(cur); cur = wd; } else { cur = (cur + ' ' + wd).trim(); } });
    if (cur) out.push(cur); return out.slice(0, 2);
  }

  var wrap = document.createElement('div'); wrap.className = 'tl-scroll';
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
  svg.setAttribute('width', width); svg.setAttribute('height', height);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Timeline of ' + TL.works.length + ' ballets and ' + events.length + ' events from ' + eras[0].from + ' to ' + eras[eras.length - 1].to + ', in ten eras');
  wrap.appendChild(svg);

  // Eras: bands, two-line labels, dates and counts.
  eras.forEach(function (e, i) {
    el('rect', { x: e.x, y: top - 10, width: e.w, height: height - top + 10, 'class': i % 2 ? 'tl-band alt' : 'tl-band' });
    var t = el('text', { x: e.x + 8, y: 18, 'class': 'tl-era' });
    lines(e.label, Math.floor((e.w - 12) / 8.6)).forEach(function (ln, j) { var ts = el('tspan', { x: e.x + 8, dy: j ? 16 : 0 }, t); ts.textContent = ln; });
    var y = el('text', { x: e.x + 8, y: 56, 'class': 'tl-yr' }); y.textContent = e.id + ' · ' + e.from + '–' + e.to + ' · ' + e.n + ' works';
  });
  // Work lanes, then event lanes.
  lanes.forEach(function (l, i) {
    var y = lanesTop + i * laneH + laneH / 2;
    el('line', { x1: left, x2: width - 8, y1: y, y2: y, 'class': 'tl-lane' });
  });
  evLanes.forEach(function (l, i) {
    var y = evTop + i * evLaneH + evLaneH / 2;
    el('line', { x1: left, x2: width - 8, y1: y, y2: y, 'class': 'tl-lane ev' });
  });
  if (evLanes.length) el('line', { x1: left, x2: width - 8, y1: evTop - gapH / 2, y2: evTop - gapH / 2, 'class': 'tl-div' });
  var evStack = {};
  events.forEach(function (ev) {
    var yr = parseInt(String(ev.year), 10); if (!yr) return;
    var li = Math.max(0, evLanes.indexOf(ev.lane));
    var x = xOf(yr);
    var key = li + ':' + Math.round(x / 8); var k = evStack[key] = (evStack[key] || 0) + 1;
    x += (k - 1) * 7;
    var y = evTop + li * evLaneH + evLaneH / 2;
    var g = el('g', { 'class': 'tl-ev', tabindex: 0, role: 'button', 'aria-label': yr + ': ' + ev.title });
    el('rect', { x: x - 4, y: y - 4, width: 8, height: 8, transform: 'rotate(45 ' + x + ' ' + y + ')' }, g);
    g.addEventListener('click', function () { showEvent(ev); });
    g.addEventListener('keydown', function (k2) { if (k2.key === 'Enter' || k2.key === ' ') { k2.preventDefault(); showEvent(ev); } });
  });
  // Families: arcs from parent to remake.
  var pos = {};
  var stack = {};
  TL.works.forEach(function (w) {
    var li = Math.max(0, lanes.indexOf(w.lane));
    var x = xOf(w.year, w.era);
    var key = li + ':' + Math.round(x / 9);
    var k = stack[key] = (stack[key] || 0) + 1;
    var y = lanesTop + li * laneH + laneH / 2 + (k === 1 ? 0 : (k % 2 ? 1 : -1) * Math.ceil((k - 1) / 2) * 9);
    pos[w.id] = { x: x, y: y };
  });
  var arcs = el('g', { 'class': 'tl-arcs' });
  TL.works.forEach(function (w) {
    if (!w.parent || !pos[w.parent]) return;
    var a = pos[w.parent], b = pos[w.id];
    var mx = (a.x + b.x) / 2, my = Math.max(lanesTop - 14, Math.min(a.y, b.y) - 22 - Math.abs(b.x - a.x) * 0.04);
    el('path', { d: 'M' + a.x + ' ' + a.y + ' Q' + mx + ' ' + my + ' ' + b.x + ' ' + b.y, 'data-ids': w.parent + ' ' + w.id }, arcs);
  });
  // Works.
  var dots = {};
  TL.works.forEach(function (w) {
    var p = pos[w.id];
    var g = el('g', { 'class': 'tl-w' + (w.depth.length ? ' deep' : ''), tabindex: 0, role: 'button', 'aria-label': w.title + ', ' + w.year });
    el('circle', { cx: p.x, cy: p.y, r: w.depth.length ? 5.5 : 4 }, g);
    g.addEventListener('click', function () { select(w); });
    g.addEventListener('keydown', function (k) { if (k.key === 'Enter' || k.key === ' ') { k.preventDefault(); select(w); } });
    dots[w.id] = g;
  });

  // Lane labels sit in a fixed column so they stay visible while the timeline scrolls.
  var frame = document.createElement('div'); frame.className = 'tl-frame';
  var labels = document.createElement('div'); labels.className = 'tl-labels';
  labels.style.paddingTop = lanesTop + 'px';
  var wl = document.createElement('div'); wl.className = 'tl-lab head'; wl.style.top = (top - 26) + 'px'; wl.textContent = 'Works, by where made'; labels.appendChild(wl);
  lanes.forEach(function (l) { var d = document.createElement('div'); d.className = 'tl-lab'; d.style.height = laneH + 'px'; d.textContent = l; labels.appendChild(d); });
  if (evLanes.length) {
    var sp = document.createElement('div'); sp.className = 'tl-lab head2'; sp.style.height = gapH + 'px'; sp.textContent = 'Events'; labels.appendChild(sp);
    evLanes.forEach(function (l) { var d = document.createElement('div'); d.className = 'tl-lab evl'; d.style.height = evLaneH + 'px'; d.textContent = l; labels.appendChild(d); });
  }
  labels.style.height = height + 'px';
  frame.appendChild(labels); frame.appendChild(wrap);

  // Controls.
  var bar = document.createElement('div'); bar.className = 'tl-bar';
  var sel = document.createElement('select'); sel.id = 'tl-thread'; sel.setAttribute('aria-label', 'Follow a thread across the history');
  var o = document.createElement('option'); o.value = ''; o.textContent = 'Follow a thread: all works'; sel.appendChild(o);
  Object.keys(threadNames).forEach(function (k) {
    var n = TL.works.filter(function (w) { return w.threads.indexOf(k) > -1; }).length;
    var op = document.createElement('option'); op.value = k; op.textContent = threadNames[k] + ' (' + n + ')'; sel.appendChild(op);
  });
  sel.addEventListener('change', function () { state.thread = sel.value; paint(); });
  var count = document.createElement('span'); count.className = 'tl-count';
  bar.appendChild(sel); bar.appendChild(count);

  var card = document.createElement('div'); card.className = 'tl-card'; card.setAttribute('aria-live', 'polite');

  root.appendChild(bar); root.appendChild(frame); root.appendChild(card);

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function list(a) { return (a || []).join(', '); }
  function select(w) {
    state.sel = w.id; paint();
    var fam = Object.keys(TL.families).filter(function (k) { return TL.families[k].indexOf(w.id) > -1; })[0];
    var famHtml = fam ? '<p class="tl-fam"><span>Family</span> ' + TL.families[fam].map(function (id) {
      var x = TL.works.filter(function (v) { return v.id === id; })[0];
      return '<button type="button" data-id="' + id + '"' + (id === w.id ? ' aria-current="true"' : '') + '>' + esc(x.title) + ' ' + x.year + '</button>';
    }).join('') + '</p>' : '';
    card.innerHTML =
      '<p class="tl-k">' + esc(w.date) + ' · ' + esc(w.place || '') + '</p>' +
      '<h4>' + esc(w.title) + (w.orig && w.orig !== w.title ? ' <span class="tl-orig">' + esc(w.orig) + '</span>' : '') + '</h4>' +
      '<p>' + esc(w.premise || '') + '</p>' +
      '<dl><dt>Choreography</dt><dd>' + esc(list(w.choreographer)) + '</dd>' +
      '<dt>Music</dt><dd>' + esc(list(w.composer)) + '</dd>' +
      (w.designer && w.designer.length ? '<dt>Design</dt><dd>' + esc(list(w.designer)) + '</dd>' : '') +
      '<dt>Threads</dt><dd>' + w.threads.map(function (t) { return esc(threadNames[t] || t); }).join(' · ') + '</dd>' +
      '<dt>Research</dt><dd>' + (w.depth.length ? esc(w.depth.join(', ')) : 'register row only') + ' · ' + esc(w.confidence || '') + '</dd></dl>' + famHtml;
    Array.prototype.forEach.call(card.querySelectorAll('button[data-id]'), function (b) {
      b.addEventListener('click', function () { select(TL.works.filter(function (v) { return v.id === b.getAttribute('data-id'); })[0]); });
    });
  }
  function showEvent(ev) {
    state.sel = null; paint();
    card.innerHTML = '<p class="tl-k">' + esc(ev.year) + (ev.place ? ' · ' + esc(ev.place) : '') + ' · event</p><h4>' + esc(ev.title) + '</h4>' +
      (ev.note ? '<p>' + esc(ev.note) + '</p>' : '') + '<dl><dt>Confidence</dt><dd>' + esc(ev.confidence || '') + '</dd>' +
      (ev.source ? '<dt>Source</dt><dd>' + esc(ev.source) + '</dd>' : '') + '</dl>';
  }
  function paint() {
    var n = 0;
    TL.works.forEach(function (w) {
      var on = !state.thread || w.threads.indexOf(state.thread) > -1;
      if (on) n++;
      var c = 'tl-w' + (w.depth.length ? ' deep' : '') + (on ? '' : ' off') + (state.sel === w.id ? ' sel' : '');
      dots[w.id].setAttribute('class', c);
    });
    Array.prototype.forEach.call(arcs.childNodes, function (p) {
      var ids = p.getAttribute('data-ids').split(' ');
      var on = !state.thread || ids.every(function (id) { var w = TL.works.filter(function (v) { return v.id === id; })[0]; return w.threads.indexOf(state.thread) > -1; });
      p.setAttribute('class', on ? '' : 'off');
    });
    count.textContent = n + ' of ' + TL.works.length + ' works';
  }
  paint();
  select(TL.works.filter(function (w) { return w.id === 'giselle-1841'; })[0] || TL.works[0]);
})();

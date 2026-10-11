// Theme switch and the "watch at pace" stepper: it plays a storyboard's frames at the study's own pacing rule
// (auto-step 2.5–4 s with a visible pause control; arrows step; Escape closes). Reduced motion: no progress animation.
(function () {
  const root = document.documentElement;
  document.getElementById('themeBtn').addEventListener('click', function () {
    var dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
  });
  var dlg = document.getElementById('watch'), stage = document.getElementById('wStage'), cap = document.getElementById('wCap'), pos = document.getElementById('wPos'), prog = document.getElementById('wProg'), play = document.getElementById('wPlay');
  var frames = [], caps = [], i = 0, timer = null, title = '';
  function dwell(k) { var words = caps[k].split(/\s+/).length; return Math.min(4000, Math.max(2500, words * 180)); }
  function show(k) {
    i = (k + frames.length) % frames.length;
    stage.innerHTML = frames[i];
    cap.textContent = caps[i];
    pos.textContent = (i + 1) + ' / ' + frames.length;
    prog.style.transition = 'none'; prog.style.width = '0';
    if (timer) { clearTimeout(timer); timer = null; }
    if (play.getAttribute('aria-pressed') === 'true') {
      var d = dwell(i);
      requestAnimationFrame(function () { prog.style.transition = 'width ' + d + 'ms linear'; prog.style.width = '100%'; });
      timer = setTimeout(function () { if (i + 1 < frames.length) show(i + 1); else stop(); }, d);
    }
  }
  function stop() { play.setAttribute('aria-pressed', 'false'); play.textContent = 'Play'; if (timer) clearTimeout(timer); timer = null; prog.style.transition = 'none'; prog.style.width = '0'; }
  play.addEventListener('click', function () {
    var on = play.getAttribute('aria-pressed') === 'true';
    if (on) stop(); else { play.setAttribute('aria-pressed', 'true'); play.textContent = '▮▮ Pause'; show(i === frames.length - 1 ? 0 : i); }
  });
  document.getElementById('wPrev').addEventListener('click', function () { stop(); show(i - 1); });
  document.getElementById('wNext').addEventListener('click', function () { stop(); show(i + 1); });
  dlg.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') { e.preventDefault(); stop(); show(i - 1); } if (e.key === 'ArrowRight') { e.preventDefault(); stop(); show(i + 1); } if (e.key === ' ') { e.preventDefault(); play.click(); } });
  dlg.addEventListener('close', stop);
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-watch]'); if (!b) return;
    var fig = document.getElementById('sb-' + b.dataset.watch);
    frames = Array.prototype.map.call(fig.querySelectorAll('.fr-img'), function (el) { return el.innerHTML; });
    caps = Array.prototype.map.call(fig.querySelectorAll('.fr-cap'), function (el) { return el.textContent.replace(/^\d+\s*/, ''); });
    title = fig.closest('section, main').querySelector('h3[id^="s' + b.dataset.watch.slice(1) + '-"]');
    document.getElementById('wTitle').textContent = title ? title.textContent : b.dataset.watch;
    stop(); dlg.showModal(); show(0);
  });
})();

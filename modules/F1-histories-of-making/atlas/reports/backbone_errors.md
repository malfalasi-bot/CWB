# Backbone harvest errors

One entry per failed step, newest last. Delete this file once the cause is fixed.

## periods · 2026-10-03 20:59 UTC

AttributeError: 'int' object has no attribute 'strip'

```
Traceback (most recent call last):
  File "/home/runner/work/CWB/CWB/modules/F1-histories-of-making/atlas/harvest/backbone.py", line 686, in <module>
    sys.exit(main(sys.argv[1:]))
             ^^^^^^^^^^^^^^^^^^
  File "/home/runner/work/CWB/CWB/modules/F1-histories-of-making/atlas/harvest/backbone.py", line 638, in main
    rows = harvest_periods(a.limit, a.fixture if cmd == "periods" else None)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/runner/work/CWB/CWB/modules/F1-histories-of-making/atlas/harvest/backbone.py", line 289, in harvest_periods
    return period_rows(data, limit)
           ^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/runner/work/CWB/CWB/modules/F1-histories-of-making/atlas/harvest/backbone.py", line 263, in period_rows
    s0, s1, slab = interval(p.get("start") or {})
                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/runner/work/CWB/CWB/modules/F1-histories-of-making/atlas/harvest/backbone.py", line 252, in interval
    return gyear(inside.get("earliestYear", "")), gyear(inside.get("latestYear", "")), v.get("label", "")
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/runner/work/CWB/CWB/modules/F1-histories-of-making/atlas/harvest/backbone.py", line 139, in gyear
    m = re.match(r"^(-?\d+)$", (s or "").strip())
                               ^^^^^^^^^^^^^^^
AttributeError: 'int' object has no attribute 'strip'
```

## getty (aat, first lookup, STY001) · 2026-10-03 20:59 UTC

HTTPError: HTTP Error 403: Forbidden (Forbidden)

```
Traceback (most recent call last):
  File "/home/runner/work/CWB/CWB/modules/F1-histories-of-making/atlas/harvest/backbone.py", line 418, in harvest_getty
    hits = getty_lookup(r["name"], vocab, opener, fx)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/runner/work/CWB/CWB/modules/F1-histories-of-making/atlas/harvest/backbone.py", line 387, in getty_lookup
    result = json.loads((opener or fetch)(url).decode("utf-8"))
                        ^^^^^^^^^^^^^^^^^^^^^^
  File "/home/runner/work/CWB/CWB/modules/F1-histories-of-making/atlas/harvest/backbone.py", line 106, in fetch
    with urllib.request.urlopen(req, timeout=timeout) as r:
         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/hostedtoolcache/Python/3.12.14/x64/lib/python3.12/urllib/request.py", line 215, in urlopen
    return opener.open(url, data, timeout)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/hostedtoolcache/Python/3.12.14/x64/lib/python3.12/urllib/request.py", line 521, in open
    response = meth(req, response)
               ^^^^^^^^^^^^^^^^^^^
  File "/opt/hostedtoolcache/Python/3.12.14/x64/lib/python3.12/urllib/request.py", line 630, in http_response
    response = self.parent.error(
               ^^^^^^^^^^^^^^^^^^
  File "/opt/hostedtoolcache/Python/3.12.14/x64/lib/python3.12/urllib/request.py", line 559, in error
    return self._call_chain(*args)
           ^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/hostedtoolcache/Python/3.12.14/x64/lib/python3.12/urllib/request.py", line 492, in _call_chain
    result = func(*args)
             ^^^^^^^^^^^
  File "/opt/hostedtoolcache/Python/3.12.14/x64/lib/python3.12/urllib/request.py", line 639, in http_error_default
    raise HTTPError(req.full_url, code, msg, hdrs, fp)
urllib.error.HTTPError: HTTP Error 403: Forbidden
```

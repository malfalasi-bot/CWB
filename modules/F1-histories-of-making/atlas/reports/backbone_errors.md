# Backbone harvest errors

One entry per failed step, newest last. Delete this file once the cause is fixed.

## getty (aat, first lookup, STY001) · 2026-10-03 21:04 UTC

HTTPError: HTTP Error 403: Forbidden (Forbidden)

```
Traceback (most recent call last):
  File "/home/runner/work/CWB/CWB/modules/F1-histories-of-making/atlas/harvest/backbone.py", line 420, in harvest_getty
    hits = getty_lookup(r["name"], vocab, opener, fx)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/runner/work/CWB/CWB/modules/F1-histories-of-making/atlas/harvest/backbone.py", line 389, in getty_lookup
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

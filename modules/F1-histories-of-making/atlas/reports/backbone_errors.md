# Backbone harvest errors

One entry per failed step, newest last. Delete this file once the cause is fixed.

## periods · 2026-10-03 20:55 UTC

UnicodeDecodeError: 'utf-8' codec can't decode byte 0x8b in position 1: invalid start byte (invalid start byte)

```
Traceback (most recent call last):
  File "/home/runner/work/CWB/CWB/modules/F1-histories-of-making/atlas/harvest/backbone.py", line 677, in <module>
    sys.exit(main(sys.argv[1:]))
             ^^^^^^^^^^^^^^^^^^
  File "/home/runner/work/CWB/CWB/modules/F1-histories-of-making/atlas/harvest/backbone.py", line 629, in main
    rows = harvest_periods(a.limit, a.fixture if cmd == "periods" else None)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/runner/work/CWB/CWB/modules/F1-histories-of-making/atlas/harvest/backbone.py", line 282, in harvest_periods
    data = json.loads((opener or fetch)(PERIODO_DATASET).decode("utf-8"))
                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
UnicodeDecodeError: 'utf-8' codec can't decode byte 0x8b in position 1: invalid start byte
```

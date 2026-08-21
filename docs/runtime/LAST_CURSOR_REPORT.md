# LAST_CURSOR_REPORT

## A. Header

| Campo | Valore |
| --- | --- |
| **BLOCK** | `GIS-POLYGON-VERTEX-COORD-UX-A-FIX4` |
| **GATE** | REVIEW PACKAGE READY · NO DEPLOY |
| **RUNTIME LIVE** | build **242** · blob `2e0075ba…` |
| **RUNTIME CANDIDATE** | `5857cbb2…` · build **243** · blob `04cfdfcc…` |
| **RESULT** | Draft vertex drag via reused edit pipeline · review only |

## B. RIEPILOGO

1. Root cause: draft overlay senza handle/drag.
2. Fix: handles + `mapPolyEditDocDrag.source=draft` + `polygonApplyDraggedDraftVertex`; no premature persist.
3. Local QA 21/21; selftest 243/FIX4.
4. LIVE 242 invariato; no deploy.

## C. GIT

```
CANDIDATE: 5857cbb2c3fc73e688ae26c1e2a359bb76199416
BLOB: 04cfdfcc1eed8979e60b9ff176f93ceee79ccfcb
BASE: 19a019138b2b23513467813fcb7c460ce88d862f
LIVE BLOB: 2e0075ba344713b17f0888c4e9594f414bb0db94
```

STATO FRESCO DA CURSOR
origin/main HEAD: (docs tip after publish)
working tree: clean
prossimo candidato: FIX4 build 243 review
note operative: NO DEPLOY · NO REVIEW PASS · NO finito

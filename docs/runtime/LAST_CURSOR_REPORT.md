# LAST_CURSOR_REPORT

## A. Header

| Campo | Valore |
| --- | --- |
| **BLOCK** | `GIS-POLYGON-VERTEX-COORD-UX-A-FIX3` |
| **GATE** | REVIEW PACKAGE READY · NO DEPLOY |
| **RUNTIME LIVE** | build **241** · blob `92ec73f7…` |
| **RUNTIME CANDIDATE** | `eef83032535f948b21491ca226757447168de2a3` · build **242** · blob `2e0075ba…` |
| **RESULT** | Auto-minimize on Nuovo poligono removed · review only |
| **WORKING TREE** | clean after docs push |

## B. RIEPILOGO

1. Root cause: `polygonStartDraw` → `polygonDrawMinimizeIfOpen`.
2. Fix: remove call only; helpers kept; manual minimize PASS.
3. Local QA 22/22; selftest triad 242/FIX3.
4. Review branch + package; LIVE 241 unchanged; no deploy.

## C. GIT

```
CANDIDATE: eef83032535f948b21491ca226757447168de2a3
BLOB: 2e0075ba344713b17f0888c4e9594f414bb0db94
BASE main: 710e8087b808df1cffbf491480015a2ea2af3a4c
LIVE BLOB: 92ec73f7be579e8616ee83fcab085f1c7c6a426d
```

STATO FRESCO DA CURSOR
origin/main HEAD: (docs tip after publish)
working tree: clean
ultimo blocco PASS tecnico LIVE: FIX2 deploy+ABQA (QA FAIL → FIX3 review)
prossimo candidato: FIX3 build 242 review
note operative: NO DEPLOY · NO REVIEW PASS · NO finito

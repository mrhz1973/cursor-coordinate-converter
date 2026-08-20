# GLOBAL-MODAL-EDGE-RESIZE-A-FIX1 — REVIEW PASS + deploy GIS + ABQA PASS

**BLOCK-ID:** `GLOBAL-MODAL-EDGE-RESIZE-A-FIX1`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE uscita:** **QA FINALE CHATGPT — PENDING** (QA operatore **non** attestata)

## REVIEW GPT-SOSTITUTIVA (candidate immutabile)

| Campo | Valore |
| --- | --- |
| Candidate FULL SHA | `1b8aa3c688f9800a47d0f7851af4c3d38ffe3c00` |
| Parent | `cde80223c51b8ff6969ebb58fe1e78712a810b58` |
| Build / ID | **233** / `GLOBAL-MODAL-EDGE-RESIZE-A-FIX1` |
| Monolite blob | `8bb4133bbfe29a13794fdb7355c0e4aec0c35213` |
| Bytes / SHA-256 (VPS file=HTTP) | `10814845` / `9c2701f4b62b750b278b89deb452406d80faa1c3b894d2c6b8907e096648e3b8` |
| Verdetto | **PASS** |
| Evidence package | [`2026-08-20_1632_GLOBAL-MODAL-EDGE-RESIZE-A-FIX1-review-package.md`](2026-08-20_1632_GLOBAL-MODAL-EDGE-RESIZE-A-FIX1-review-package.md) |

**REVIEW GPT-SOSTITUTIVA GLOBAL-MODAL-EDGE-RESIZE-A-FIX1 PASS.**

Convert stress BASE vs CANDIDATE: **PRE-EXISTING / NOT REGRESSION** (left≈-425 identico su 232 e 233).

## Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS pull | `a2a2259` → tip docs `0590faee18e617ddd228f23e1090236605ead1ef` (monolite ≡ `1b8aa3c`) |
| Runtime identity | `1b8aa3c688f9800a47d0f7851af4c3d38ffe3c00` |
| Blob | `8bb4133bbfe29a13794fdb7355c0e4aec0c35213` |
| `goi-gis-app` | restart PID `2842314`→`2864738` · **active** |
| PIDs invariati | nav `2481045` · GH `2034035` · nginx `2858378` |
| Helper / ORS | inactive pre-esistente (non toccati) |
| HTTP | **200** · CMP **PASS** · marker 233 / FIX1 |

**URL runtime esatto:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=1b8aa3c`

## Automated Browser QA — PASS

**AUTOMATED BROWSER QA GLOBAL-MODAL-EDGE-RESIZE-A-FIX1 PASS**

JSON: [`2026-08-20_1640_GLOBAL-MODAL-EDGE-RESIZE-A-FIX1-abqa.json`](2026-08-20_1640_GLOBAL-MODAL-EDGE-RESIZE-A-FIX1-abqa.json).  
**20/20** check · `gisModalEdgeResizeSelfTest` **31/31** · network resize delta **0**.

| Caso | Esito |
| --- | --- |
| Build 233 / FIX1 | PASS |
| Traccia fresh top=safeTop | PASS |
| Convert fresh top=safeTop | PASS |
| Touched drag + reopen preservato | PASS |
| Full-perimeter Track + Convert (on-screen) | PASS |
| min/restore/close + header actions | PASS |
| pointercancel no ghost | PASS |
| Offline convert | PASS |
| Console uncaught FIX1 | PASS (0) |
| Convert off-left stress | documentato pre-existing (non FAIL) |

## Gate

**CLOSED / PASS** — attestazione `QA GLOBAL-MODAL-EDGE-RESIZE-A-FIX1 PASS operatore` (2026-08-20) → Regola H `finito`

- LIVE FRONTIER = **233** / `1b8aa3c`
- GIS VPS serve **233** (`?v=1b8aa3c`)
- GATE = **none**

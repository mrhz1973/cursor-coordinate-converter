# GIS-POLYGON-VERTEX-COORD-UX-A-FIX3 — REVIEW PASS + deploy GIS + ABQA PASS

**BLOCK-ID:** `GIS-POLYGON-VERTEX-COORD-UX-A-FIX3`  
**Categoria:** DELICATO — polygon panel lifecycle during drawing  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE uscita:** **QA FINALE CHATGPT — PENDING** (QA operatore **non** attestata · **non** `finito`)

## REVIEW GPT-SOSTITUTIVA

| Campo | Valore |
| --- | --- |
| Reviewed runtime FULL SHA | `eef83032535f948b21491ca226757447168de2a3` |
| Build / ID | **242** / `GIS-POLYGON-VERTEX-COORD-UX-A-FIX3` |
| Monolite blob | `2e0075ba344713b17f0888c4e9594f414bb0db94` |
| Verdetto | **PASS** |

### Checklist

- lifecycle `Nuovo poligono`: PASS (no auto-minimize)
- diff funzionale = sola rimozione auto-minimize da `polygonStartDraw`
- minimize manuale preservato
- helper minimize/restore preservati
- close/cancel/finish non riscritti
- sanitizer/whitelist N/A · cache/storage N/A · persisted schema N/A
- `state.gisPolygons[]` / `state.mapWaypoints[]` invariati
- network/provider/fetch/GPS delta 0 · offline invariato

## A — Promozione runtime

- Pre-gate `ls-remote main` = `cd0d7957559036fd80156ec8c3fa108404e70779` (docs oltre BASE candidate) PASS
- LIVE pre-promote blob = `92ec73f7…` (build 241) PASS
- **NON** mergeato review branch
- Cherry-pick exact `eef8303…` → tip `ea5b4c10366c5a34331f8a62c77efb8ea6aab615`
- Post-cherry-pick blob = **`2e0075ba344713b17f0888c4e9594f414bb0db94`** PASS
- `git diff --check` PASS · markers 242 / FIX3 PASS
- Push HTTPS `main` → `ea5b4c1…`

## B — Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| SSH | `ionos-n8n` |
| VPS path | `/root/local-files/handoff-runtime/cursor-coordinate-converter` |
| VPS HEAD | `ea5b4c10366c5a34331f8a62c77efb8ea6aab615` |
| Blob | `2e0075ba344713b17f0888c4e9594f414bb0db94` |
| `goi-gis-app` | restart PID `2888989`→`2890759` · **active** |
| Proxy PID | `2481045` **invariato** |
| HTTP | **200** |
| CMP | **PASS** · SHA-256 `1340de3bb9aa3b91e40f8df52a5bc17c5e987ea3b75323d4557ebece53b0f158` · bytes `10838918` · served ≡ worktree · git-blob = reviewed |
| Markers | APP_BUILD_NUM **242** · ID `GIS-POLYGON-VERTEX-COORD-UX-A-FIX3` |

**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=ea5b4c1`

## C — Automated Browser QA — PASS

**AUTOMATED BROWSER QA GIS-POLYGON-VERTEX-COORD-UX-A-FIX3 PASS**

URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=ea5b4c1-abqa`  
**33/33 PASS** · pageerrors **0**

| # | Caso | Esito |
| --- | --- | --- |
| 1–4 | Nuovo poligono → panel aperta / no chip auto | PASS |
| 5–6 | P1…P4 Coordinate vertici live | PASS |
| 7–8 | Copia / Modifica draft + remove | PASS |
| 9–10 | Chiudi / Annulla | PASS |
| 11–14 | Minimize manuale + restore + no auto dopo | PASS |
| 15–20 | Edit list/drag/ins-del/move/save/cancel | PASS |
| 21–24 | WP/Track smoke · console 0 · no MAP-CENTER incidental | PASS |

## Gate

**QA FINALE CHATGPT — PENDING**

Non attestare QA operatore. Non `finito`.

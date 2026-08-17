# OUTDOOR-ROUTING-F-AVOID-AREAS-A-FIX1 — deploy + ABQA

**BLOCK-ID:** `OUTDOOR-ROUTING-F-AVOID-AREAS-A-FIX1`  
**Categoria:** DELICATO

## REVIEW GPT-SOSTITUTIVA (candidate immutabile)

| Campo | Valore |
| --- | --- |
| Candidate FULL SHA | `5477a5e0d8d9a5681dbfab37b3c39e182306fc79` |
| Build / ID | **219** / `OUTDOOR-ROUTING-F-AVOID-AREAS-A-FIX1` |
| Verdetto | **PASS** |
| Base review | build 218 `12a7477` FAIL → FIX1 |

## Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS pull | `066feba` (main) · monolite blob ≡ `a823ae9b5bb9bebb8606b4221221314186bc9370` |
| Bytes / SHA-256 LF | `10537443` / `eb7a8aa064245b49635ab94057567c750d059dfd3d66a87cc37e36aeb1c8b136` |
| `goi-gis-app` | restart PID `2758757`→`2759608` · proxy/GH PID **invariati** |
| HTTP smoke | file↔HTTP bytes+SHA **MATCH** · build **219** marker OK |
| Helper | **0.1.3** · servizio **non** riavviato |

**URL runtime:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=5477a5e`

## Automated Browser QA — PASS

**AUTOMATED BROWSER QA OUTDOOR-ROUTING-F-AVOID-AREAS-A-FIX1 PASS**

| Scope | Esito |
| --- | --- |
| A normal senza avoid | PASS |
| B avoid draw/overlay/live calc | PASS (156 pts) |
| C toggle invalidate | PASS |
| D Alternative + avoid | PASS (payload + live alts=2) |
| E Round Trip + avoid | PASS (payload + live) |
| F Andata/Ritorno + avoid | PASS (live) |
| G draw Esc/delete/clear | PASS |
| H OPSEC/rete boot/offline/endpoint | PASS · solo `8989/route` |
| I responsive 1920 + 360 | PASS |
| J selftest 647/647 · dock/legende · minimize | PASS |

Viewport: desktop **1920×900** · mobile **360×740**.

## Gate

**QA FINALE CHATGPT — PENDING**

**NON** QA operatore · **NON** finito

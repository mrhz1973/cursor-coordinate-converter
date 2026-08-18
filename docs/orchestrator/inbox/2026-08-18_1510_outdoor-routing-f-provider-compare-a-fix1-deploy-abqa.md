# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1 — deploy GIS-only + ABQA FAIL

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`

## REVIEW GPT-SOSTITUTIVA (candidate immutabile)

| Campo | Valore |
| --- | --- |
| Candidate FULL SHA | `105bedf3c0fa4f15f1be0edf4929d19e8842235b` |
| Build / ID | **222** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1` |
| Monolite blob | `99233802af29998ee3c0c659d72ffa9db6bbe100` |
| Bytes LF / SHA-256 LF | `10631301` / `fb76c7fff6d08b15bce236d52a72e0cf367e2abed5ad1c3456b50b0217891eba` |
| Verdetto | **PASS** |
| Note | loggato sul FULL SHA esatto; nessuna patch runtime in questo pass |

**REVIEW GPT-SOSTITUTIVA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1 PASS.**

## Pre-deploy — PASS

| Check | Esito |
| --- | --- |
| `git log -1 --format=%H -- "coordinate_converter Claude.html"` | `105bedf3c0fa4f15f1be0edf4929d19e8842235b` |
| Blob | `99233802af29998ee3c0c659d72ffa9db6bbe100` |
| `APP_BUILD_NUM` / ID | **222** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1` |
| Helper | **0.1.3** invariato |

Mismatch runtime/blob/build: **nessuno**.

## Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS `git pull --ff-only origin main` | `3de7f0c` → `452975d73aac23417472d15336e727335a871ab6` (docs HEAD; monolite ≡ candidate `105bedf`) |
| Runtime identity (candidate) | `105bedf3c0fa4f15f1be0edf4929d19e8842235b` |
| Monolite blob | `99233802af29998ee3c0c659d72ffa9db6bbe100` |
| Bytes / SHA-256 HTTP | `10631301` / `fb76c7fff6d08b15bce236d52a72e0cf367e2abed5ad1c3456b50b0217891eba` (file↔HTTP MATCH) |
| Marker | `APP_BUILD_NUM = 222` · `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1` |
| `goi-gis-app` | restart PID `2785129`→`2786390` |
| PIDs invariati | nav `2481045` · GH `2034035` · D-Flight `2645184` · ORS gateway `2765652` · nginx `2622063` |
| Secret / Tailscale ACL | **non** toccati |
| Helper | **0.1.3** · **non** riavviato |

**URL runtime esatto:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=105bedf`

## Automated Browser QA — FAIL

**AUTOMATED BROWSER QA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1 FAIL**

Viewport: desktop **1920×900** (122 check, **18 FAIL**) · mobile **360×740** (**6/6 PASS**).  
JSON: [`2026-08-18_1510_outdoor-routing-f-provider-compare-a-fix1-abqa.json`](2026-08-18_1510_outdoor-routing-f-provider-compare-a-fix1-abqa.json).  
Selftest live: **ok=true n=716 fail=0**. Console n=12, **0** rilevanti (`TypeError` / `routingCompare`).

### Casi PASS (estratto)

| Caso | Esito | Note |
| --- | --- | --- |
| A boot / CTA primary / no auto-start | PASS | build 222 FIX1; CTA `btn-primary`; zero POST compare al boot |
| UX titoli / help `?` / tooltip avoid / −× | PASS | `routing-section-heading`; `data-tip` operativo; nessun dialog nuovo |
| Legenda sezione GH continuo / ORS tratteggiato | PASS | swatch solid `#ef4444` / dashed `#2563eb` |
| Hiking live GH+ORS + overlay + map legend | PASS | dual overlay; legend mappa GH solid / ORS dashed; bottoni rosso/blu; Δ; no ranking |
| Choose GH / Choose ORS | PASS | overlay dual e legend rimossi |
| Invalidate / close ghost | PASS | sequence bump; nessun overlay/legend residuo |
| Centra dual / scelto / none | PASS | dual `fitN=319`; scelto = preview canonica; disabled se nessuna geometria |
| Anello **zero VIA** GH+ORS+compare | PASS | `algorithm=round_trip` / `options.round_trip`; distanza 8000; closed; avoid GH `custom_model`+`round_trip` |
| Payload 1 VIA / 2 VIA | PASS | GH `alternative_route` n=3/4; ORS coordinates n=3/4 **senza** `round_trip` |
| Remove VIA | PASS | constrained 2→1 visibile poi 0; no ghost |
| MTB / OOB / avoid one-way / partial / offline / opsec / Auto | PASS | regressione 221 |
| GH Calcola + alternative / ORS Calcola | PASS | alts GH≥2; zero ORS su GH e viceversa |
| Mobile | PASS | CTA primary, build 222, no autostart, help, no overflow |

### Finding bloccante (riproducibile) — anello **con VIA** live

**Sintomo ABQA:** `R_one_gh_pass` / `S_two_gh_pass` / `V_cmp_via_pass` / `W_via_avoid_pass` = `routing.errorHttp` (GH) e `routing.errorOrsHttp` (ORS). Preview vuota. I body POST sono **corretti come shape** (chiusura START…START, **non** `round_trip`).

**Causa:** con ≥1 VIA il candidate 222 costruisce il route **normale** con `{ withAlternatives: true }` (`routingBuildGraphhopperRouteBody` / `routingBuildOrsRouteBody` da `routingCalculateRouteGraphhopper` ~89830 e `routingCompareRunGh` ~88905). GraphHopper e ORS **rifiutano alternative su >2 punti**.

Probe post-ABQA (stessi punti START 44.102,9.82 → VIA 44.11,9.84 → START):

```text
GH alternative_route, 3 points → HTTP 400
{"message":"Currently alternative routes work only with start and end point. You tried to use: 3 points"}

GH stesso payload SENZA algorithm → HTTP 200 paths ok

ORS alternative_routes, 3 coordinates → HTTP 400
{"error":"ors_invalid_payload","error_category":"invalid_payload"}

ORS stesso payload SENZA alternative_routes → HTTP 200 FeatureCollection ok
```

Il fallback GH `routingHttpErrorSuggestsAlternativesUnsupported` **non scatta**: cerca `alternative_route` (underscore), mentre il messaggio parla di «alternative routes» (spazio). ORS non ha analogo retry.

**Accettazione violata:** Anello 1 VIA / 2 VIA / compare-con-VIA «GH PASS; ORS PASS».

**Non è** regressione zero-VIA (round_trip storico PASS) né one-way A–B (alternative_route su 2 punti PASS).

### Altri FAIL (non la causa primaria)

| Check | Nota |
| --- | --- |
| `CEN_dual_no_net` | 29 `fetch` durante fit mappa (tile/elevation). **Nessun** POST `/route` o `/ors/` dal comando Centra (`CEN_dual` PASS `fitN=319`). Harness troppo stretto. |
| `T_reorder_payload` / `T_reorder_live` | `routingMovePoint(via1, +1)` non ha scambiato l’ordine nel harness; payload restava START→VIA1→VIA2. Secondario rispetto al 400 alternatives. |

## Console / Network

- Console: n=12, pattern storico `ERR_CONNECTION_REFUSED` 127.0.0.1:8989 (probe Auto); nessuno TypeError sul planner.
- Network routing: POST solo `http://100.114.7.53:8989/route` e `https://ubuntu.tailc01234.ts.net/ors/v2/directions/{foot-hiking\|cycling-mountain}/geojson`. Nessun `api.openrouteservice.org`. Nessun `Authorization`.
- Boot: zero POST compare.

## Gate

**NON** `QA FINALE CHATGPT — PENDING`.

**AUTOMATED BROWSER QA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX1 FAIL**

LIVE FRONTIER resta **220**. VPS `:8000` serve candidate **222** (deploy avvenuto prima dell’ABQA).  
NON QA operatore. NON finito.

**NEXT:** FIX2 — anello vincolato: non inviare `alternative_route` / `alternative_routes` quando i punti chiusi sono >2 (o allargare il fallback HTTP al messaggio GH «alternative routes work only with start and end point» + retry ORS su `ors_invalid_payload`), poi ricalcolo live 1 VIA / 2 VIA / compare-con-VIA.

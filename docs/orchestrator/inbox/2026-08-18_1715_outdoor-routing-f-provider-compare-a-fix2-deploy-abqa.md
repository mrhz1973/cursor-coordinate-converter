# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2 — REVIEW PASS + deploy GIS + ABQA PASS

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`

## REVIEW GPT-SOSTITUTIVA (candidate immutabile)

| Campo | Valore |
| --- | --- |
| Candidate FULL SHA | `4a6dca938057d2c1e2b0f0a2cdec1480c13f3d20` |
| Build / ID | **223** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2` |
| Monolite blob | `56163b6f4e43e1ea8eec837ba535cd62c4b6c38f` |
| Bytes LF / SHA-256 LF | `10639339` / `2b9df0d23602478937528913f19500e1445275a7a447d6944cab9d21336f28e8` |
| Verdetto | **PASS** |
| Note | loggato sul FULL SHA esatto; nessuna patch runtime in questo pass |

**REVIEW GPT-SOSTITUTIVA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2 PASS.**

## Pre-deploy — PASS

| Check | Esito |
| --- | --- |
| `git log -1 --format=%H -- "coordinate_converter Claude.html"` | `4a6dca938057d2c1e2b0f0a2cdec1480c13f3d20` |
| Blob HEAD / candidate | `56163b6f4e43e1ea8eec837ba535cd62c4b6c38f` |
| `APP_BUILD_NUM` / ID | **223** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2` |
| Helper | **0.1.3** invariato |
| `git diff` vs candidate | vuoto |

Mismatch runtime/blob/build: **nessuno**.

## Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS `git pull --ff-only origin main` | `452975d` → `8559e61527b3c79dd03546a3dbbe4bb52037afb0` (docs HEAD; monolite ≡ candidate `4a6dca9`) |
| Runtime identity (candidate) | `4a6dca938057d2c1e2b0f0a2cdec1480c13f3d20` |
| Monolite blob | `56163b6f4e43e1ea8eec837ba535cd62c4b6c38f` |
| Bytes / SHA-256 HTTP | `10639339` / `2b9df0d23602478937528913f19500e1445275a7a447d6944cab9d21336f28e8` (file↔HTTP MATCH) |
| Marker | `APP_BUILD_NUM = 223` · `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2` |
| `goi-gis-app` | restart PID `2786390`→`2790086` |
| PIDs invariati | nav `2481045` · GH `2034035` · D-Flight `2645184` · ORS gateway `2765652` · nginx `2622063` |
| Secret / Tailscale ACL | **non** toccati |
| Helper | **0.1.3** · **non** riavviato |

**URL runtime esatto:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=4a6dca9`

## Automated Browser QA — PASS

**AUTOMATED BROWSER QA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX2 PASS**

Viewport: desktop **1920×900** (**130/130 PASS**) · mobile **360×740** (**6/6 PASS**).  
JSON: [`2026-08-18_1715_outdoor-routing-f-provider-compare-a-fix2-abqa.json`](2026-08-18_1715_outdoor-routing-f-provider-compare-a-fix2-abqa.json).  
Selftest live: **ok=true n=741 fail=0**. Console n=1, **0** rilevanti (`TypeError` / `routingCompare`).

### Casi eseguiti (A–L)

| Caso | Esito | Note |
| --- | --- | --- |
| A GH 1 VIA | PASS | live; 3 points; no `alternative_route`; VIA rispettato; chiusura START |
| B ORS 1 VIA | PASS | live; 3 coordinates; no `alternative_routes`; VIA rispettato |
| C GH+ORS 2 VIA + compare | PASS | ordine VIA; no alt provider; `S_cmp_two_pass` / `S_cmp_two_no_alt` |
| D reorder UI Down | PASS | prima START→VIA1→VIA2→START; dopo START→VIA2→VIA1→START; preview invalidata; no ghost; body GH+ORS |
| E compare 1 VIA | PASS | dual overlay; legenda GH rosso continuo / ORS blu tratteggiato; metriche; choose GH/ORS |
| F VIA + avoid | PASS | GH `custom_model`; ORS `avoid_polygons`; VIA obbligati; no alt |
| G zero VIA | PASS | GH `round_trip`+distance+seed; ORS `options.round_trip`; compare zero-VIA |
| H alternative 2 punti | PASS | GH alts≥2; ORS calc; compare hiking dual |
| I Centra | PASS | dual fitN=319; scelto = preview; **zero POST `/route`** e **zero POST `/ors/v2/directions/`** |
| J UX FIX1 smoke | PASS | CTA blu; legenda; bottoni colorati; titoli; tooltip avoid; choose toglie overlay/legenda; mobile no overflow |
| K rete/OPSEC | PASS | no `api.openrouteservice.org`; no Authorization; Auto GH local/vps; ORS mai Auto; forcedOffline/opsecStrict fail-closed |
| L selftest + console | PASS | 741/741; console rel=0 |

Anomalia non bloccante: il detail di `A_boot_no_compare_net` concatena request successive perché il listener resta attaccato durante l’evaluate; il booleano boot è calcolato **prima** e risulta PASS (zero compare al boot).

Harness: `T_reorder_live` accetta snap GH ±2e-3 (ordine VIA2→VIA1 confermato su body); planner/ORS restano alle coordinate esatte.

## STOP

**QA FINALE CHATGPT — PENDING**

LIVE FRONTIER resta build **220**.  
Candidate **223** è **DEPLOYED** in attesa di QA operatore.  
NON attestare QA operatore. NON finito.

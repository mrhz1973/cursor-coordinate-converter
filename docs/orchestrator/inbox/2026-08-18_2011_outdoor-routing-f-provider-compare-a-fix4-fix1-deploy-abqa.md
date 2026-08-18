# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4-FIX1 — REVIEW PASS + deploy GIS + ABQA PASS

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4-FIX1`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`

## REVIEW GPT-SOSTITUTIVA (candidate immutabile)

| Campo | Valore |
| --- | --- |
| Candidate FULL SHA | `2e616352042f63a650124efcabe704796e6042af` |
| Build / ID | **226** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4-FIX1` |
| Monolite blob | `82ecf7d73527f12891f93cba55589c5e913cae2e` |
| Bytes LF / SHA-256 LF | `10685767` / `f82e56ae2f1e94da08a2320905c6958be2253aca0e512a9ea0ace1dc99706220` |
| Verdetto | **PASS** |
| Note | loggato sul FULL SHA esatto; nessuna patch runtime in questo pass; finding FIX4 N2 (lifecycle warning) già corretto in `2e61635` |

**REVIEW GPT-SOSTITUTIVA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4-FIX1 PASS.**

## Pre-deploy — PASS

| Check | Esito |
| --- | --- |
| `git log -1 --format=%H -- "coordinate_converter Claude.html"` | `2e616352042f63a650124efcabe704796e6042af` |
| Blob HEAD / `git hash-object` | `82ecf7d73527f12891f93cba55589c5e913cae2e` |
| `APP_BUILD_NUM` / ID | **226** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4-FIX1` |
| Helper | **0.1.3** invariato |
| Working tree HTML | pulito |

Mismatch runtime/blob/build: **nessuno**.

## Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS `git pull --ff-only origin main` | `bf26d9a` → `fffe4f23a975c71dcc87c5ea936c6845f9b9518b` (docs HEAD; monolite ≡ candidate `2e61635`) |
| Runtime identity (candidate) | `2e616352042f63a650124efcabe704796e6042af` |
| Monolite blob | `82ecf7d73527f12891f93cba55589c5e913cae2e` |
| Bytes / SHA-256 HTTP | `10685767` / `f82e56ae2f1e94da08a2320905c6958be2253aca0e512a9ea0ace1dc99706220` (file↔HTTP MATCH) |
| Marker | `APP_BUILD_NUM = 226` · `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4-FIX1` |
| `goi-gis-app` | restart PID `2793328`→`2798649` |
| PIDs invariati | nav `2481045` · GH `2034035` · D-Flight `2645184` · ORS gateway `2765652` · nginx `2622063` |
| Secret / Tailscale ACL | **non** toccati |
| Helper | **0.1.3** · **non** riavviato |

**URL runtime esatto:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=2e61635`

## Automated Browser QA — PASS

**AUTOMATED BROWSER QA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4-FIX1 PASS**

Viewport: desktop **1920×900** (**207/207 PASS**) · mobile **360×740** (**9/9 PASS**).  
JSON: [`2026-08-18_2011_outdoor-routing-f-provider-compare-a-fix4-fix1-abqa.json`](2026-08-18_2011_outdoor-routing-f-provider-compare-a-fix4-fix1-abqa.json).  
Selftest live: **ok=true n=801 fail=0** (RPCF4 24/24 · RWF1 8/8 · RPCF3 28/28). Console desktop n=1, **0** rilevanti (`TypeError` / `routingCompare`). Network: **0** `api.openrouteservice.org`, **0** `Authorization`.

### Casi eseguiti (A–L)

| Caso | Esito | Note |
| --- | --- | --- |
| A layout parametri | PASS | `#routingParamsRow` contiene Profilo+Velocità+Calcola; gruppo prima dei punti; alt+compare sotto i punti; provider `<details>` chiuso; overflow planner/mobile PASS |
| B Tab / punti | PASS | Tab A→punto successivo; Shift+Tab indietro; ultimo punto handler `okLast=true` verso `#routingCalculateBtn` (calc abilitato); grip `tabindex="-1"`; geocoding dismiss PASS; Add VIA immediate pick PASS |
| C Alternative GH | PASS | live hiking compare: **3** tracce GH visibili (cap 3); chip `is-route-gh-*`; overlay `is-route-gh-0` |
| D Alternative ORS | PASS | **2** tracce ORS (non inventate); chip `is-route-ors-*`; choose ORS `previewStyleProvider=ors` / blu |
| E Confronto completo | PASS | gruppi provider; GH=3 ORS=2 tot=5; choose GH rosso / ORS blu; offset duale casing `is-route-*-0-casing` |
| F Profilo altimetrico | PASS | senza selezione `ambiguous=true` e wrap hidden; dopo chip: `activeOverlayKey` impostato |
| G Coincidenza GH/ORS | PASS | sintetico: different / same / same_main_diff_alts; UI live coerente col kind; caso 3 **non** dichiara equivalenza complessiva |
| H Anello + FIX1 lifecycle | PASS | oab → warning visibile; invalidate → `ringSemanticWarn=false` **e** feedback hidden immediato; loop reale senza warning; nuovo oab ri-warna; uscita Anello svuota feedback; smoke zero/1/2 VIA + VIA+avoid |
| I Area da evitare | PASS | single click aggiunge; dblclick n=2 non conferma (aggiunge vertice); dblclick n≥3 conferma senza duplicare (3 vertici); fill/bordo; GH/ORS applicano avoid |
| J Regression FIX3/FIX2 | PASS | constrained VIA; reorder; compare+VIA; no alt >2 punti; alt 2 punti; zero-VIA RT; choose/cleanup overlay; dismiss; immediate VIA pick |
| K Rete / OPSEC | PASS | gateway Tailscale; zero openrouteservice.org; zero API key; Auto GH Local→VPS; ORS mai Auto; forcedOffline/opsecStrict fail-closed; boot senza POST routing |
| L Selftest / console | PASS | 801/801; RWF1 8/8; console rel=0; network coerente |

Anomalie **non bloccanti**:
- console `Failed to load resource: net::ERR_CONNECTION_REFUSED` (tile/loopback, non routing).
- Tab ultimo punto: `routingPointLabelHandleTab` ritorna true e punta `#routingCalculateBtn` (abilitato); `HTMLElement.focus()` dentro `<dialog>` può far atterrare `activeElement` sul BUTTON successivo (mode chip). preventDefault su Tab reale impedisce il fall-through nativo. `focusedCalc=false` in ABQA, handler contract PASS.

## STOP

**QA FINALE CHATGPT — PENDING**

LIVE FRONTIER resta **220** / `cfee0e4`. Candidate **226** è **deployato** sul GIS.  
**NON** QA operatore. **NON** finito.

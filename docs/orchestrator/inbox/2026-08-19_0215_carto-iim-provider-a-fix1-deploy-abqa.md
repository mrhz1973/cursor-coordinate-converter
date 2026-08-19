# CARTO-IIM-PROVIDER-A-FIX1 — REVIEW PASS + deploy GIS + ABQA PASS

**BLOCK-ID:** `CARTO-IIM-PROVIDER-A-FIX1`  
**WU:** [`WU-0012`](../../work-units/WU-0012-carto-index-federated.md)  
**GATE uscita:** **none** — **QA CARTO-IIM-PROVIDER-A-FIX1 PASS operatore** → CLOSED / PASS · Regola H `finito`  
Backlog UX futuro **non** implementato

## REVIEW GPT-SOSTITUTIVA (candidate immutabile)

| Campo | Valore |
| --- | --- |
| Candidate FULL SHA | `f90c503355d7c98eaf300f7f1afe647102a2330f` |
| Build / ID | **231** / `CARTO-IIM-PROVIDER-A-FIX1` |
| Monolite blob | `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038` |
| Bytes LF / SHA-256 LF | `10796791` / `42b822cc05404443736b90cfe613c12731a020c3b44d29dad004c1c4fafb9280` |
| Verdetto | **PASS** |
| Note | nessuna patch runtime in questo pass; identità 231 **non** rigenerata; **no** build 232 |

**REVIEW GPT-SOSTITUTIVA CARTO-IIM-PROVIDER-A-FIX1 PASS.**

## Pre-deploy — PASS

| Check | Esito |
| --- | --- |
| `git log -1 --format=%H -- "coordinate_converter Claude.html"` | `f90c503355d7c98eaf300f7f1afe647102a2330f` |
| Blob | `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038` |
| Bytes LF / SHA-256 LF | `10796791` / `42b822cc05404443736b90cfe613c12731a020c3b44d29dad004c1c4fafb9280` |
| `APP_BUILD_NUM` / ID | **231** / `CARTO-IIM-PROVIDER-A-FIX1` |
| `#cartoUkhoEmbeddedData` | **assente** |
| Working tree HTML | pulito, identico al commit |

Mismatch runtime/blob/build: **nessuno**.

## Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS `git pull --ff-only origin main` | `87e2ec3` → `f58ea5228d43cc8aed9c2d6f5693fe1fd8ebb57a` (docs HEAD; monolite ≡ candidate `f90c503`) |
| Runtime identity (candidate) | `f90c503355d7c98eaf300f7f1afe647102a2330f` |
| Monolite blob | `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038` |
| Bytes / SHA-256 HTTP | `10796791` / `42b822cc05404443736b90cfe613c12731a020c3b44d29dad004c1c4fafb9280` (file↔HTTP MATCH) |
| Marker | `APP_BUILD_NUM = 231` · `CARTO-IIM-PROVIDER-A-FIX1` · no `#cartoUkhoEmbeddedData` |
| `goi-gis-app` | restart PID `2813762`→`2816693` |
| PIDs invariati | nav `2481045` · GH `2034035` · D-Flight `2645184` · ORS gateway `2765652` · nginx `2622063` |
| Secret / Tailscale ACL / Planet-Clone | **non** toccati |
| Helper | **0.1.3** · **non** riavviato |
| Oggetti GIS | FROZEN |

**URL runtime esatto:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=f90c503`

## Automated Browser QA — PASS

**AUTOMATED BROWSER QA CARTO-IIM-PROVIDER-A-FIX1 PASS**

JSON: [`2026-08-19_0215_carto-iim-provider-a-fix1-abqa.json`](2026-08-19_0215_carto-iim-provider-a-fix1-abqa.json).  
56/56 check · `GOICartoIndex.selfTest()` **ok=true** (24 check, 0 fail) · console rilevanti **0** · Playwright IIM/UKHO requests **0**.

| Caso | Esito | Note |
| --- | --- | --- |
| A BOOT / CONSOLE / NETWORK | PASS | build 231 FIX1; zero fetch IIM; zero endpoint UKHO; `cartoTryProviderRefresh` blocked (`refresh_not_implemented`) |
| A FILTRO IIM uncheck/recheck | PASS | inizialmente ON; uncheck resta OFF, `selectedSeries` senza `"paper"`, 0 righe IIM; recheck ripristina `"paper"` e risultati IIM |
| B REGRESSIONE IGM | PASS | filtro 50 resta OFF dopo uncheck; serie 50/100v/25/25v/25kauto invariate |
| C DATASET | PASS | IGM 8204 · IIM 180 · tot 8384 · UKHO assente |
| D LA SPEZIA / 230 regression | PASS | IIM 59/60/115; mixed IGM+IIM; select + overlay; hint snapshot; 2/326 assenti |
| E FIXTURE 3 / 126 / 340\|360 | PASS | intersezione API; UI 126 + overlay |
| H STATE / OPSEC | PASS | waypoint/polygon non mutati; forcedOffline; opsecStrict |
| SELFTEST LIVE | PASS | include `filter_iim_uncheckable` / `filter_igm_uncheckable`; IGM 8204; IIM 180; reload 8384; ukho absent |

UKHO: **NOT OPENED / DISCOVERY BLOCKED** invariato. Nessuna geometria inventata. Nessun `#cartoUkhoEmbeddedData` servito.

## STOP

**QA CARTO-IIM-PROVIDER-A-FIX1 PASS operatore** (2026-08-19) → **CLOSED / PASS** · Regola H finito

- LIVE FRONTIER = **231** / `f90c503`
- GIS VPS serve **231** (`?v=f90c503`)
- NEXT: resto WU-0012 **NOT OPENED** (UKHO DISCOVERY BLOCKED · CIGA · online update · backlog UX)

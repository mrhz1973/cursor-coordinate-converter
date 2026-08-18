# CARTO-IIM-PROVIDER-A — REVIEW PASS + deploy GIS + ABQA PASS

**BLOCK-ID:** `CARTO-IIM-PROVIDER-A`  
**WU:** [`WU-0012`](../../work-units/WU-0012-carto-index-federated.md)  
**GATE uscita:** **QA FINALE CHATGPT — PENDING**  
**NON QA operatore · NON finito**

## REVIEW GPT-SOSTITUTIVA (candidate immutabile)

| Campo | Valore |
| --- | --- |
| Candidate FULL SHA | `8d6e0b0c51a5e28b7feaf11b49990ee980c347c3` |
| Build / ID | **230** / `CARTO-IIM-PROVIDER-A` |
| Monolite blob | `faa7499c178d53f3a2b68bb35cb9089579e30240` |
| Bytes LF / SHA-256 LF | `10795338` / `46d0a6b053847f2f94f861817fbabe3b5c2f8613bac8a7458f318254fe47b5c1` |
| Verdetto | **PASS** |
| Note | nessuna patch runtime in questo pass; identità 230 **non** rigenerata |

**REVIEW GPT-SOSTITUTIVA CARTO-IIM-PROVIDER-A PASS.**

## Pre-deploy — PASS

| Check | Esito |
| --- | --- |
| `git log -1 --format=%H -- "coordinate_converter Claude.html"` | `8d6e0b0c51a5e28b7feaf11b49990ee980c347c3` |
| Blob | `faa7499c178d53f3a2b68bb35cb9089579e30240` |
| Bytes LF / SHA-256 LF | `10795338` / `46d0a6b…fe47b5c1` |
| `APP_BUILD_NUM` / ID | **230** / `CARTO-IIM-PROVIDER-A` |
| `#cartoUkhoEmbeddedData` | **assente** |
| Working tree HTML | pulito, identico al commit |

Mismatch runtime/blob/build: **nessuno**.

## Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS `git pull --ff-only origin main` | `f326552` → `87e2ec373460dc608bcc27b83e0084fd9ac1a3a8` (docs HEAD; monolite ≡ candidate `8d6e0b0`) |
| Runtime identity (candidate) | `8d6e0b0c51a5e28b7feaf11b49990ee980c347c3` |
| Monolite blob | `faa7499c178d53f3a2b68bb35cb9089579e30240` |
| Bytes / SHA-256 HTTP | `10795338` / `46d0a6b053847f2f94f861817fbabe3b5c2f8613bac8a7458f318254fe47b5c1` (file↔HTTP MATCH) |
| Marker | `APP_BUILD_NUM = 230` · `CARTO-IIM-PROVIDER-A` · no `#cartoUkhoEmbeddedData` |
| `goi-gis-app` | restart PID `2805095`→`2813762` |
| PIDs invariati | nav `2481045` · GH `2034035` · D-Flight `2645184` · ORS gateway `2765652` · nginx `2622063` |
| Secret / Tailscale ACL / Planet-Clone | **non** toccati |
| Helper | **0.1.3** · **non** riavviato |
| Oggetti GIS | FROZEN |

**URL runtime esatto:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=8d6e0b0`

## Automated Browser QA — PASS

**AUTOMATED BROWSER QA CARTO-IIM-PROVIDER-A PASS**

JSON: [`2026-08-19_0110_carto-iim-provider-a-abqa.json`](2026-08-19_0110_carto-iim-provider-a-abqa.json).  
48/48 check · `GOICartoIndex.selfTest()` **ok=true** · console rilevanti **0** · Playwright IIM/UKHO requests **0**.

| Caso | Esito | Note |
| --- | --- | --- |
| A BOOT / CONSOLE / NETWORK | PASS | build 230; zero fetch IIM; zero endpoint UKHO; `cartoTryProviderRefresh` blocked (`refresh_not_implemented`) |
| B PANEL CARTO | PASS | titolo `Indice cartografico IGM / IIM`; filtro IIM visibile; hint snapshot visibile; nessun hint UKHO |
| C DATASET | PASS | IGM 8204 · IIM 180 · tot 8384 · UKHO assente |
| D LA SPEZIA | PASS | IIM 59/60/115 titoli+scale; mixed IGM+IIM; riga IIM distinguibile; select + overlay footprint |
| E FIXTURE 3 / 126 / 340\|360 | PASS | intersezione API; UI 126 + overlay dopo pan `viewCenter` Pontine (filtro solo IIM) |
| F FINDING 2 / 326 | PASS | assenti dallo snapshot 180; hint «non catalogo completo»; non inventate |
| G REGRESSION IGM | PASS | serie 50/100v/25/25v/25kauto invariate; filtro 50 solo IGM |
| H STATE / OPSEC | PASS | waypoint/polygon non mutati; forcedOffline; opsecStrict; refresh blocked |
| SELFTEST LIVE | PASS | IGM 8204, IIM 180, reload 8384, ukho absent, mixed, offline/opsec, zero auto net, zero wp/poly mut |

UKHO: **NOT OPENED / DISCOVERY BLOCKED** invariato. Nessuna geometria inventata. Nessun `#cartoUkhoEmbeddedData` servito.

## STOP

- LIVE FRONTIER = **228** / `c5bc4b1` (invariato fino a QA)
- GIS VPS serve **230** (`?v=8d6e0b0`)
- NEXT: **QA FINALE CHATGPT** candidate 230
- NON QA operatore · NON finito

# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3 — REVIEW PASS + deploy GIS + ABQA PASS

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`

## REVIEW GPT-SOSTITUTIVA (candidate immutabile)

| Campo | Valore |
| --- | --- |
| Candidate FULL SHA | `d4558419c7139a4587389528d76bd82395ada100` |
| Build / ID | **224** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3` |
| Monolite blob | `4a9565af089bde990b9d9c64689164da21949273` |
| Bytes LF / SHA-256 LF | `10657904` / `a895f02c79339e19887dc3c2f3cb903bcbabd7bf3f25f14c86202fff68700a0a` |
| Verdetto | **PASS** |
| Note | loggato sul FULL SHA esatto; nessuna patch runtime in questo pass |

**REVIEW GPT-SOSTITUTIVA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3 PASS.**

## Pre-deploy — PASS

| Check | Esito |
| --- | --- |
| `git log -1 --format=%H -- "coordinate_converter Claude.html"` | `d4558419c7139a4587389528d76bd82395ada100` |
| Blob HEAD / `git hash-object` | `4a9565af089bde990b9d9c64689164da21949273` |
| `APP_BUILD_NUM` / ID | **224** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3` |
| Helper | **0.1.3** invariato |
| Working tree HTML | pulito |

Mismatch runtime/blob/build: **nessuno**.

## Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS `git pull --ff-only origin main` | `8559e61` → `bf26d9a1b309253a73cd93ed085a92577880801a` (docs HEAD; monolite ≡ candidate `d455841`) |
| Runtime identity (candidate) | `d4558419c7139a4587389528d76bd82395ada100` |
| Monolite blob | `4a9565af089bde990b9d9c64689164da21949273` |
| Bytes / SHA-256 HTTP | `10657904` / `a895f02c79339e19887dc3c2f3cb903bcbabd7bf3f25f14c86202fff68700a0a` (file↔HTTP MATCH) |
| Marker | `APP_BUILD_NUM = 224` · `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3` |
| `goi-gis-app` | restart PID `2790086`→`2793328` |
| PIDs invariati | nav `2481045` · GH `2034035` · D-Flight `2645184` · ORS gateway `2765652` · nginx `2622063` |
| Secret / Tailscale ACL | **non** toccati |
| Helper | **0.1.3** · **non** riavviato |

**URL runtime esatto:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=d455841`

## Automated Browser QA — PASS

**AUTOMATED BROWSER QA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX3 PASS**

Viewport: desktop **1920×900** (**172/172 PASS**) · mobile **360×740** (**8/8 PASS**).  
JSON: [`2026-08-18_1816_outdoor-routing-f-provider-compare-a-fix3-abqa.json`](2026-08-18_1816_outdoor-routing-f-provider-compare-a-fix3-abqa.json).  
Selftest live: **ok=true n=769 fail=0** (RPCF3 n=28 fail=0). Console desktop n=1, **0** rilevanti (`TypeError` / `routingCompare`). Network: **0** `api.openrouteservice.org`, **0** `Authorization`.

### Casi eseguiti (A–J)

| Caso | Esito | Note |
| --- | --- | --- |
| A layout | PASS | punti prima di `#routingRouteOptionsZone`; alt+compare nella zona; provider `<details>` chiuso; select/Verifica accessibili; «Centra risultato» assente dal planner; Centra alternativa `fitN=116`; minimize/restore/close PASS; overflow planner 678=678; mobile layout/overflow PASS |
| B aree da evitare | PASS | draw reale; draft fill `rgba(234,88,12,.46)` stroke 4px + 3 vertici; confermata `rgba(220,38,38,.42)` 3.5px; help presente; cleanup senza ghost; geometria avoid ancora in GH/ORS (smoke H) |
| C add VIA pick | PASS | stesso click: riga VIA + `pickMode`; `routingApplyMapPick` assegna VIA; testo restava usabile |
| D geocoding dismiss | PASS | lista + «Chiudi risultati»; testo tenuto; refocus non riapre; digitazione azzera `dismissed`; pick risultato PASS |
| E Tab / focus | PASS | Tab resta sulla riga (`ae=BUTTON` pick); grip `tabindex="-1"`; Shift+Tab nessun trap; nessun salto a compare/avoid |
| F anello 2 VIA | PASS | GH/ORS payload chiuso 4 punti, ordine VIA, overlay anello chiuso (`F3_loop_on_map`); smoke 1 VIA / 2 VIA / 2 VIA+avoid; zero-VIA `round_trip` non regredisce |
| G compare overlap | PASS | `data-routing-compare-offset=1`; casing GH/ORS; split ≥8 px; choose GH/ORS toglie offset duale; invalidate/close senza ghost |
| H regression FIX2 | PASS | constrained 1/2 VIA GH/ORS; reorder Down live; no alt su >2 punti; alt su 2 punti (3 alts); zero-VIA RT; compare+VIA; avoid+VIA |
| I OPSEC / rete | PASS | gateway Tailscale; zero openrouteservice.org; zero API key; Auto GH → VPS; ORS mai Auto; forcedOffline/opsecStrict fail-closed; boot senza POST routing |
| J selftest / console | PASS | 769/769; console rel=0; network coerente |

Anomalia non bloccante: console `Failed to load resource: net::ERR_CONNECTION_REFUSED` (tipico tile/loopback, non routing). Auto GH ha risolto **VPS** (Local non raggiungibile dal browser ABQA) — coerente con Local→VPS.

Harness: `addViaAt` esce dal pick dopo l’assegnazione API così i smoke FIX2 non restano in pick-mode.

## STOP

**QA FINALE CHATGPT — PENDING**

LIVE FRONTIER resta **220** / `cfee0e4`. Candidate **224** è **deployato** sul GIS.  
**NON** QA operatore. **NON** finito.

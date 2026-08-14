# D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX2 — deploy PASS + Automated Browser QA FAIL caso 8

**Data:** 2026-08-14 09:28 (locale)  
**Runtime:** `7f35382` / build **182**  
**Deploy:** GIS-only **PASS**  
**Automated Browser QA:** **FAIL** — caso 8 viewport ridotta  
**NON** finito · **NON** PASS operatore · **NON** `QA FINALE CHATGPT — PENDING` · WU-0014 **OPEN**

## Deploy

- SSH `ionos-n8n` (retry: porta 22 pubblica OK; Tailscale `:22` resta chiusa)
- Pull FF `6c9c697` → `cc4a9b1` (monolite runtime `7f35382`)
- Restart solo `goi-gis-app.service` → active/enabled PID 2674138
- Helper **0.1.3 READY** — non riavviato
- HTTP 200 · bytes **10098870** · SHA-256 `d969aa18593c60653fd288ef5102f70d986e63de1276fb9d426628107651d81c` · **CMP_OK**
- URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=7f35382`

## Automated Browser QA

| Caso | Esito |
|------|--------|
| 1 Load/dataset | PASS — 854 zone, filtro visibile, build 182 |
| 2 ATM09 5/5 ON | PASS — suppress, 0 vettori, tile ATM09 presenti |
| 3 FUTURE OFF/ON | PASS — 14 vettori immediato / 0 al restore; net filtro 0 |
| 4 ALL OFF | PASS — 0 vettori; dataset 854; raster resta |
| 5 Tooltip | PASS — 5 title IT |
| 6 Selftest non distruttivo | PASS — **240/240**; stesso nodo FUTURE; listener vivo |
| 7 Altezza naturale | PASS — overflow hidden, niente scrollbar inutile |
| 8 Viewport ridotta | **FAIL** — vedi finding |
| 9 Min/max pannello | PASS — restore safeTop |
| 10 Dettagli | PASS (isolato) — flex / close none / restore safeTop |
| 11 Closed dialog | PASS (isolato) — display none, w/h 0 |
| 12 Refresh/overlay | PASS — filtro FUTURE OFF preservato; overlay OFF non forzato ON |
| 13 Network | PASS — click filtro netDelta 0; d-flight.it 0; helper 0.1.3 |

## Finding caso 8

Dopo `resize` (es. 1280×700) il pannello resta alla **Y precedente** (es. top 287) mentre `dflightComputePanelAvailableHeight` usa il **nuovo** safeTop (es. 94) e assegna max-height/height (es. 532). Bottom risultante (819) **supera** map bottom (638) e viewport (700). Header resta visibile; overflow body `auto`. Resize **non ricalcola/clampa la top** nel rettangolo utile.

## Gate

`AUTOMATED BROWSER QA D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX2 FAIL` — caso 8.

NEXT: FIX3 resize clamp top+height nel usable rect, poi re-QA caso 8 (+ regressione 7/9).

# D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX3 — deploy PASS + Automated Browser QA PASS

**Data:** 2026-08-14 09:57 (locale)  
**Runtime live:** `20b1b494238f8dd483b3eb739f42dbf1194ab727` / build **183**  
**HEAD repo pre-autosync:** `2e355582e23c86fcfd39c1aebd985068612a6c14`  
**Deploy:** GIS-only **PASS**  
**Automated Browser QA:** **PASS** (casi 1–10)  
**Gate:** `QA FINALE CHATGPT — PENDING`  
**NON** finito · **NON** PASS operatore · WU-0014 **OPEN**

## Deploy

- SSH `ionos-n8n`
- Pull FF `cc4a9b1` → `2e35558` (monolite runtime `20b1b49`)
- Restart solo `goi-gis-app.service` → active/enabled PID 2674544
- Helper **0.1.3 READY** — non riavviato · 854 zone · SHA `f2ff08964423a165e38d18a0a3aca295a5ddaf92f81a7a99fe4e1cbf0e62a1d4`
- HTTP 200 · bytes **10117693** · SHA-256 `081c93c44a440f58b53c75be116c9c42e3ec79f972a5f1654c1c63bfe32d8bfe` · **CMP_OK**
- URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=20b1b49`

## Automated Browser QA

| Caso | Esito |
|------|--------|
| 1 Load/build/selftest | PASS — 854 zone, build 183, **250/250** |
| 2 Filtro immediato | PASS — FUTURE OFF 15 vettori / ON 0 (ATM09 suppress); ALL OFF 0; dataset 854; netDelta 0 |
| 3 Finding 1280×700 | PASS — top 287, maxH 339 da actual, bottom 626 ≤ 638−12; would-be FIX2 = 819 |
| 4 High→low→high control | PASS — 1000 auto/hidden; 700 Y 287; 500 clamp 252; ritorno auto/hidden |
| 5 Drag + resize | PASS — Y 200/left 120 preservate; Y 400→252 clamp; non snap a safeTop |
| 6 Dettagli zona | PASS — stesso ciclo; contenuto zona reale; header raggiungibile |
| 7 Min/max | PASS — restore safeTop 94; left 120/90 preservate |
| 8 Closed dialog | PASS — open=false, display none, w/h 0; riapri flex |
| 9 5 cicli resize | PASS — nessun drift top/height; FUTURE vivo; dataset 854 |
| 10 Network/ATM09 | PASS — geom+filtro netDelta 0; d-flight.it 0; helper 0.1.3; ATM09 tile/legend ok |

## Finding caso 3 (chiuso)

1280×700, top 287 > safeTop 94, map bottom 638: max-height **339** (da actual top), bottom **626**. Il vecchio bottom≈819 è impossibile.

## Gate

`AUTOMATED BROWSER QA D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX3 PASS`

`QA FINALE CHATGPT — PENDING`

NEXT: QA umana ChatGPT. Non `finito` da Cursor. WU-0014 resta OPEN.

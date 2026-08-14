# Riepilogo — D-FLIGHT-HIT-TEST-FIX-A-FIX2 DEPLOY + AUTOMATED BROWSER QA

**Data:** 2026-08-14  
**Blocco:** `D-FLIGHT-HIT-TEST-FIX-A-FIX2`  
**Review pre-deploy:** GPT-sostitutiva PASS — READY FOR DEPLOY (FULL SHA `7501d0f7f24957f17497357230baebe36b11f298`)

## Deploy

- Clone VPS: `/root/local-files/handoff-runtime/cursor-coordinate-converter`
- `git pull --ff-only origin main` → HEAD `43b29e3` (docs) con monolite blob = candidate `7501d0f`
- Monolite blob: `a421a62095c451301260e7e8fc7f21e14c053f09` (= `7501d0f:coordinate_converter Claude.html`)
- `systemctl restart goi-gis-app.service` → **active**
- Smoke HTTP: **200**, Content-Length **10166728**, file↔HTTP sha256 match
- Build markers: `APP_BUILD_NUM=186`, `APP_BUILD_ID=D-FLIGHT-HIT-TEST-FIX-A-FIX2`
- Helper `/status`: **0.1.3** READY
- Planet-Clone / helper: non modificati

## URL

`http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=7501d0f`

## Automated Browser QA — PASS (caso operatore reale)

Vincolo: **nessun mock 502** come sostituto del PASS. Osservazione rete reale via passthrough fetch logger.

1. Baseline z11 Spezia: INFO **200**, 92 INFO hits, hitlayer=1, single-dispatch atmN=1 selectN=0
2. Pan/zoom reale → centro Italia z8: helper risponde **HTTP 502** `{"error":"cap","error_category":"cap"}` (osservato ripetutamente)
3. Fallback: `_dflightAtm09InfoUnavailable=true`, INFO cleared, `.dflight-zone-overlay`=1, **325** `.dflight-volume`, hitlayer=0, pointer multipli (17), click `dflightSelectZone` OK
4. FUTURE OFF→ON ×2: paint/manina restano (no ritorno a hitOnly invisibile)
5. Pan/zoom/redraw durante fallback: un solo overlay, listener bound, pointer OK
6. Recovery reale z11: unavail=false, hitlayer z2 + INFO z3, single-dispatch atmN=1 selectN=0
7. ALL OFF: volumes/volumeHit = 0
8. Regressioni: helper 0.1.3; solo endpoint `/atm09/info`; console errors 0; selftest **276/276** + async **278/278**

## Gate

`AUTOMATED BROWSER QA D-FLIGHT-HIT-TEST-FIX-A-FIX2 PASS`  
`QA FINALE CHATGPT — PENDING`

Nessun `finito` in questo intervento (attende PASS operatore).

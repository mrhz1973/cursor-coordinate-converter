# Riepilogo — D-FLIGHT-HIT-TEST-FIX-A-FIX1 DEPLOY + AUTOMATED BROWSER QA

**Data:** 2026-08-14  
**Blocco:** `D-FLIGHT-HIT-TEST-FIX-A-FIX1`  
**Review pre-deploy:** GPT-sostitutiva PASS — READY FOR DEPLOY

## Deploy

- Clone VPS: `/root/local-files/handoff-runtime/cursor-coordinate-converter`
- `git pull --ff-only origin main` → HEAD `0c3f690` (docs) con monolite blob = candidate `488b6c0`
- Monolite blob: `cf866cbed667d83b835e0923229d67c84be7699d` (= `488b6c0:coordinate_converter Claude.html`)
- `systemctl restart goi-gis-app.service` → **active**
- Smoke HTTP: **200**, Content-Length **10144430**, file↔HTTP sha256 match
- Build markers: `APP_BUILD_NUM=185`, `APP_BUILD_ID=D-FLIGHT-HIT-TEST-FIX-A-FIX1`
- Helper `/status`: **0.1.3** READY
- Planet-Clone / helper: non modificati

## URL

`http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=488b6c0`

## Automated Browser QA — PASS

1. INFO precedence: efp `.dflight-atm09-info-hit`; atmN=1 selectN=0
2. Temporal cycle ×2: INFO resta sopra dopo FUTURE OFF→ON
3. INFO 502 mock via `_dflightFetchImpl`: stale clear; efp `.dflight-volume-hit`; select=1
4. ALL OFF: zero hit/volume
5. Redraw: 1 INFO overlay, 1 hit-layer; prod z-index INFO=3 / hit=2
6. Regressioni: selftest 266/266; helper 0.1.3; console errors 0

## Gate

`AUTOMATED BROWSER QA D-FLIGHT-HIT-TEST-FIX-A-FIX1 PASS`  
`QA FINALE CHATGPT — PENDING`

Nessun `finito` in questo intervento (attende PASS operatore).

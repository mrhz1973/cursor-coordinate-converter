# Riepilogo — D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A DEPLOY + Automated Browser QA FAIL

**Data:** 2026-08-15  
**Tipo:** DEPLOY GIS-only + Automated Browser QA PRE-OPERATORE (no code change, no finito)

## Gate

```text
AUTOMATED BROWSER QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A FAIL — TEMP-B: CSS selector `.tile-wrap .tile-map.atm09-temporal-dim .tile.tile-atm09` non matcha il DOM reale (`.tile-map` ⊃ `.tile-wrap` ⊃ `img.tile-atm09`); con filtro temporale restrittivo opacity ATM09 resta 1 (atteso ~0.35). Selftest OptB_TEMPB_dim_on_off passa solo sulla classe.
```

**NON** dichiarato: `QA FINALE CHATGPT — PENDING`  
**QA operatore:** non attestata  
**finito:** non eseguito

## Review gate

- **REVIEW GPT-SOSTITUTIVA PASS** sul FULL SHA `c3007f5edab32c30767a83229872e8790bcbaaa2`
- Non attribuita a Claude

## Deploy tecnico

- Clone VPS: `/root/local-files/handoff-runtime/cursor-coordinate-converter` → `origin/main` `4fdce17…`
- Restart **solo** `goi-gis-app` — helper/proxy/Planet-Clone **non** toccati
- Monolite blob: `dbf98d9387c4053ac6d1fbd745048cd83236eba3` (byte-match candidate)
- HTTP 200 · file↔HTTP byte-match · `APP_BUILD_NUM=187` · `APP_BUILD_ID=D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A`
- Helper `/status`: **0.1.3 READY**
- URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=c3007f5`

## Automated Browser QA (sintesi)

| Caso | Esito | Note |
| --- | --- | --- |
| A z11 | PASS | `/atm09/info` 200, no subdiv, 1 req, single-dispatch |
| B z8 cap+subdiv | PASS | 502 cap reale → subdiv; net≈5; maxInFlight=3; ≤21; ~1982 feat; unavail=false |
| C raster-only | PASS | LI P2, SARZANA LUNI ATZ, GENOVA CTR — INFO hit, atmN=1 selN=0 |
| D WFS | PASS | NOTAM click selN=1 |
| E griglia | PASS | INFO operator-facing (non solo SVG list) |
| F pan mid-subdiv | PASS | abort/supersede; bounded |
| G cache 2nd pass | PASS | cacheHits=4, networkRequests=1 (probe) |
| H overlap | PASS | atmN=1 selN=0; zInfo=3 |
| **I TEMP-B/FUTURE** | **FAIL** | class+hint OK; **opacity=1** (CSS rotto); i18n IT/EN/FR OK; FUTURE on/off DOM OK (74→0→74) |
| J ALL OFF | PARTIAL | vols=0, INFO click OK; **attenuazione FAIL** (stesso root cause I) |
| K offline/OPSEC | PASS | zero `/atm09/info` sotto forceOffline e opsecStrict; restore OK |
| L selftest | PASS | OptB sync 13/13 + async 11/11; consoleErr=0 |

## Finding bloccante (root cause)

DOM reale tile ATM09:

`div.tile-map` → `div.tile-layer` → `div.tile-wrap` → `img.tile.tile-atm09`

CSS attuale richiede `.tile-wrap` **antenato** di `.tile-map` — mai vero → regola opacity 0.35 non applica.

## Monolite

- **Non modificato** in questo intervento (policy deploy/QA)
- Incluso nel commit task precedente `c3007f5`; **escluso** da questo autosync docs

## Prossimo passo

FIX CSS TEMP-B (es. `.tile-map.atm09-temporal-dim .tile.tile-atm09`) + eventuale selftest su `getComputedStyle` opacity → nuovo candidate → deploy → Automated Browser QA I/J.

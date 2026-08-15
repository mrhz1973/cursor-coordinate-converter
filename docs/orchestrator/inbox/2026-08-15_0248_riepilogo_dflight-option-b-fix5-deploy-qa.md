# Riepilogo — D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX5

**Gate:** `AUTOMATED BROWSER QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX5 PASS` · `QA FINALE CHATGPT — PENDING` · **`finito` NON eseguito**

## Parent FAIL

```text
QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX4 FAIL operatore — con filtro temporale restrittivo il raster ATM09 risulta correttamente nascosto, ma compaiono grandi geometrie nere; con solo Stato sconosciuto ON restano nere e non mostrano la manina; con tutti i filtri ON il comportamento torna normale
```

## Causa

`.dflight-atm09-info-hit` aveva `fill:transparent` **solo** sotto `.is-interactive`. Con filtro restrittivo (INFO non interattiva) le path usavano il fill SVG di default **nero**.

## Fix

CSS base: `.dflight-atm09-info-overlay .dflight-atm09-info-hit { fill:rgba(0,0,0,0); stroke:none; pointer-events:none; }`  
`.is-interactive` abilita solo pointer-events/cursor.

## Runtime

| Campo | Valore |
|---|---|
| LIVE | `eb307dba753017eb91819561275ed1dd35b10687` |
| Build | **192** / `D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX5` |
| Helper | **0.1.3** READY |
| URL | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=eb307db` |
| Deploy | GIS-only · HTTP 200 · MATCH |

## Automated Browser QA

| Caso | Esito |
|---|---|
| A ALL ON | PASS opacity 1, interactive, fill transparent, cursor pointer |
| B restrictive | PASS opacity 0, fill transparent, blackish=0, pe=none |
| C UNKNOWN only | PASS fill transparent, INFO off |
| D ALL OFF | PASS vols=0, fill transparent |
| E restore | PASS |
| G helper | PASS 0.1.3 |
| OptB | sync **21/21** · async **11/11** |

## Limiti

QA umana PENDING · nessun `finito` finché manca `QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX5 PASS operatore`

# Riepilogo — D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX4 (candidate pre-review)

**Gate:** `D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX4 IMPLEMENTED — REVIEW REQUIRED`

## Conferme obbligatorie

- **DEPLOY NON ESEGUITO**
- **Automated Browser QA sul runtime LIVE NON eseguita**
- **`finito` NON eseguito**
- Helper **0.1.3** / endpoint `/atm09/*` / subdivision / cache / OPSEC / storage **invariati**

## Parent

FIX3 LIVE `99db9a9` / 190 — QA operatore aveva evidenziato ATM09 dominante; decisione prodotto FIX4: **qualsiasi** filtro restrittivo nasconde ATM09 (non solo ALL OFF) e spegne INFO hit.

## real_task_commit

`c3061a2983f46bf317f292426509563746c40378`

## Build

- `APP_BUILD_ID=D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX4`
- `APP_BUILD_NUM=191`
- `APP_BUILD_DETAIL=Restrictive temporal filter hides ATM09; INFO hit only when ALL ON.`

## Comportamento

| Stato filtri | ATM09 raster | ATM09 INFO | Vettori |
|---|---|---|---|
| 5/5 ON | opacity 1 | interattiva | tutti |
| ≥1 OFF (restrittivo) | opacity 0 (`.atm09-temporal-hidden`) | non interattiva | solo stati ON |
| 0/5 OFF | opacity 0 | non interattiva | zero |

## Simboli/classi toccati

- `dflightAtm09InfoHitInteractiveAllowed` — richiede `!dflightTemporalFilterIsRestrictive()`
- `dflightAtm09SyncTemporalContextUi` — hide su restrictive; rimuove legacy dim/all-off
- `dflightAtm09SyncInfoHitInteractivity` — invariata (usa allow helper)
- CSS: `.atm09-temporal-hidden` (opacity 0); **rimossi** `.atm09-temporal-dim` / `.atm09-temporal-all-off`
- hint IT/EN/FR `dflight.filter.temporal.atm09DimHint` (niente più “attenuato/dimmed”)
- `renderMiniMap` class binding
- selftest OptB FIX4 (+ FIX2 reactivate aggiornato)
- `APP_BUILD_*`

## Controlli

- `node --check` script inline: PASS (2/2)
- `git diff --check`: PASS
- OptB sync **20/20** PASS · async **11/11** PASS (locale `127.0.0.1:8766`, non VPS live)

## Prossimo passo

REVIEW → se PASS: deploy GIS-only + Automated Browser QA FIX4 → QA umana.

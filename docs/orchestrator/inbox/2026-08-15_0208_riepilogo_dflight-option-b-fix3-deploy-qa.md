# Riepilogo — D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX3

**Gate:** `AUTOMATED BROWSER QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX3 PASS` · `QA FINALE CHATGPT — PENDING` · **`finito` NON eseguito**

## Parent FAIL

```text
QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX2 FAIL operatore — ALL OFF: hit-test/manina correttamente spenti, ma ATM09 resta visivamente dominante con grandi zone nere; il filtro risulta poco leggibile e riattivando uno stato sembra che tornino quasi tutte le zone
```

## Fix prodotto

1. ALL OFF (`!dflightTemporalFilterAnyEnabled()`): classe `.atm09-temporal-all-off` → `img.tile.tile-atm09` **opacity 0** (nasconde zone nere).
2. Filtro parziale: resta TEMP-B `.atm09-temporal-dim` opacity **0.35**.
3. Hit-test ALL OFF (FIX2): invariato — no `is-interactive`, guard click/pointerover.
4. Hint IT ALL OFF + nota raster non filtrabile nel hint dim.

## Runtime

| Campo | Valore |
|---|---|
| real_task_commit | `99db9a94ee23ac4949123efa8156f14c77a1c63b` |
| APP_BUILD | **190** / `D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX3` |
| Helper | **0.1.3** READY (`/status`) |
| URL | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=99db9a9` |
| Deploy | GIS-only `goi-gis-app` · file↔HTTP MATCH · HTTP 200 |

## Automated Browser QA A–H

| Caso | Esito | Evidenza |
|---|---|---|
| A INFO+tiles | PASS | tiles=12 hits=23 |
| B ALL ON | PASS | interactive, cursor=pointer, opacity=1, click ok |
| C ALL OFF | PASS | `atm09-temporal-all-off`, opacity=0, pe=none, no interactive, vols=0, hint ALL OFF |
| D ≥1 ON | PASS | interactive, dim 0.35 (raster ufficiale attenuato) |
| E ALL ON | PASS | opacity=1, no dim/all-off |
| F TEMP-B | PASS | FUTURE off → opacity 0.35, INFO ancora interattiva |
| G rete/helper | PASS | helper 0.1.3; build 190 FIX3; no cambio endpoint |
| H OFF→ON×2 | PASS | counts `[1,1]` |

Selftest OptB: sync **20/20**, async **11/11**.

## Nota operatore (parziale ON)

Il raster ATM09 ufficiale **non** è filtrabile per stato temporale: con ≥1 filtro ON torna visibile (a 0.35 se parziale). Le zone vettoriali restano filtrate. Questo spiega «riattivando uno stato tornano quasi tutte le zone» a livello visivo ATM09.

## Limiti

- QA umana residua PENDING
- Nessun `finito` finché manca `QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX3 PASS operatore`

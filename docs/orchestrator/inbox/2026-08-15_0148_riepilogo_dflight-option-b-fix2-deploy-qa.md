# Riepilogo — D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX2 DEPLOY + Automated Browser QA PASS

**Data:** 2026-08-15  
**Tipo:** runtime FIX2 + deploy GIS-only + Automated Browser QA (no finito)

## Gate

```text
AUTOMATED BROWSER QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX2 PASS
QA FINALE CHATGPT — PENDING
```

## Decisione prodotto

Quando **tutti** i 5 filtri temporali sono OFF → hit-test D-Flight **completamente** inattivo (anche ATM09 INFO). Riattivando ≥1 stato → interattività immediata senza reload.

## Runtime

| Campo | Valore |
| --- | --- |
| Feature commit | `1257ad98a1e08b40bee0d8bd464ba605176451d9` |
| LIVE tip | `0a4a505ba353b51a60d843176d1e6b15f0ce1383` (selftest harden) |
| Blob tip | `ae9b8a0c4943e1c5d0a2d07930808cc288835f20` |
| Build | **189** / `D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX2` |
| Helper | **0.1.3** invariato |
| URL | `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=0a4a505` |

## Modifica

- `dflightTemporalFilterAnyEnabled()`
- `dflightAtm09InfoHitInteractiveAllowed()`
- `dflightAtm09SyncInfoHitInteractivity()` (toggle `.is-interactive`, clear hover)
- guard fail-closed in `dflightAtm09AttachInteraction` (click/pointerover)
- `dflightAtm09DrawInfoHitOverlay` class coerente
- sync da `dflightAtm09SyncTemporalContextUi`
- **non** toccati: fetch/subdivision/cache/helper/OPSEC

## Automated Browser QA (A–H)

| Caso | Esito |
| --- | --- |
| A hits INFO | PASS (7) |
| B ALL ON click | PASS atmN=1 selN=0 cursor=pointer |
| C ALL OFF UI | PASS no is-interactive, pe=none, atmOff=0, vols=0 |
| D riattiva 1 | PASS stesso SVG, click ok |
| E ALL ON | PASS |
| F TEMP-B | PASS opacity 0.35, INFO ancora interattiva |
| G helper/net | PASS 0.1.3, no d-flight.it diretto |
| H OFF→ON×2 | PASS counts [1,1] |
| OptB selftest | PASS 18/18 |

## Monolite

Incluso nei commit task; **escluso** da questo autosync docs.

## Prossimo

QA umana. Coda `finito` solo dopo:

`QA D-FLIGHT-HIT-TEST-OPTION-B-IMPL-A-FIX2 PASS operatore`

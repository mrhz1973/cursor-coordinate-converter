# D-FLIGHT-PERF-VISUAL-READY-A-FIX1 — riepilogo

## Gate

`D-FLIGHT-PERF-VISUAL-READY-A-FIX1 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`

## Baseline / candidate

- Baseline docs tip pre-FIX1: `e86fc504ed07036cd3956c581eab194801620a7e`
- Candidate corretto (upstream FAIL): `f7a467ee70a4afc1150e133d99473cb341715e15`
- **real_task_commit FIX1:** `12fcba580391e456cd1d9984f340355707a7ecc2` (`12fcba5`)
- Subject: `fix(dflight): FIX1 zoom-aware VISUAL READY loading UI`
- Diff vs `f7a467e`: +85 / −12 (monolite only)
- Helper: **0.1.3** invariato
- Deploy / QA operatore / `finito`: **NO**

## Finding risolto

`dflightSyncLoadingUi` chiamava `dflightAtm09OverlayVisible()` senza zoom → a zoom > `DFLIGHT_ATM09_TILE_MAX_ZOOM` preferred=true + expected=0 poteva restare «Preparazione ATM09…» anche se nessuna generation era eleggibile.

## Fix

1. Zoom corrente da `state.mapZoom` passato a `dflightAtm09IsEligibleForStart(atmZoom)` e `dflightAtm09OverlayVisible(atmZoom)`.
2. `atmPreparing` richiede `atmEligible` (non preferred residuo da solo).
3. Selftest A–D zoom max / max+1 / zero render over max / restore max.
4. Build 178 / `D-FLIGHT-PERF-VISUAL-READY-A-FIX1`.

## Validazione

- `node --check`: OK
- `GOIDflight.selfTest()`: **185/185 PASS**, fail=0
- VR_FIX1_* tutti ok; FIX5 isolation ok; helperNetDelta=0
- Boot zero-network invariato (nessun hook boot aggiunto)

## Autosync corrente

Fatti del container autosync: **EXTERNAL_ONLY**.

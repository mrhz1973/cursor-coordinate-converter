# D-FLIGHT-PERF-VISUAL-READY-A-FIX2 — panel close removes D-Flight / minimize preserves

## Gate

`D-FLIGHT-PERF-VISUAL-READY-A-FIX2 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`

## Baseline / candidate

- Baseline docs tip pre-FAIL: `05fe4e62734f8de1097b75fd7859c6b528cf4c41`
- First FIX2 push: `58ade6c` (incomplete restore always-ON)
- **real_task_commit (autoritativo):** `52927c565d5301870a82d688c899024d8d499aee` (`52927c5`)
- Subject: `fix(dflight): FIX2 restore-flag close lifecycle (minimize preserves overlay)`
- Build: `D-FLIGHT-PERF-VISUAL-READY-A-FIX2` / **179**
- Live: ancora FIX1 178 / `12fcba5`
- Helper: 0.1.3 invariato
- Deploy / QA operatore / `finito`: **NO**

## Close paths (convergono su `dflightPanelCloseLifecycle`)

- X → `dflightPanelClose` click → `dflightCloseControlPanel` → lifecycle
- Esc (pannello espanso) → stesso close
- Esc con pannello **minimizzato**: **no-op** (overlay resta; allineato ad altri GIS panel)
- Minimize: `gisMinimizePanel` only — **non** passa dal lifecycle

## Semantica

- Flag session-only `_dflightRestoreOverlayOnPanelReopen` (non persistito)
- Close con overlay ON → flag=true → `dflightSetOverlayVisible(false)` (native SVG, ATM09, info hit, details)
- Close con overlay OFF → flag=false
- Minimize: non tocca overlay/ATM09/details/flag/sessione
- Reopen: restore ON solo se flag; altrimenti resta OFF; zero GET dataset se sessione valida; ATM09 maybe-start solo se overlay ON

## Validazione

- `node --check` OK
- `GOIDflight.selfTest()` **208/208 PASS**
- Probe locale: minimize keeps SVG/overlay/details; close removes SVG/ATM info, net D-Flight delta 0; reopen restore once; manual OFF preserved
- FIX1 z19/z20 selftest OK; FIX5 isolation OK
- Nota: tile verso `example.test` in probe locale dopo overlay ON = artefatto helper stub, non GET `/dataset`

## Autosync corrente

EXTERNAL_ONLY.

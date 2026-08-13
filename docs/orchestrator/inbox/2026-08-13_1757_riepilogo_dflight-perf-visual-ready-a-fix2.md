# D-FLIGHT-PERF-VISUAL-READY-A-FIX2 — close vs minimize overlay

## Trigger

`QA D-FLIGHT-PERF-VISUAL-READY-A-FIX1 FAIL operatore` — minimizzare deve mantenere overlay; chiudere deve rimuovere zone native/ATM09/hit-area; sessione per riapertura rapida.

## Gate

`D-FLIGHT-PERF-VISUAL-READY-A-FIX2 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`

## Candidate

- **real_task_commit:** `58ade6c3717a2a56db42890b4078888ba21948c0`
- Subject: `fix(dflight): FIX2 close hides overlay; minimize keeps session`
- Build: `D-FLIGHT-PERF-VISUAL-READY-A-FIX2` / **179**
- Helper: invariato 0.1.3
- Deploy: **NO** (pending review)
- `finito`: **NO**
- Live: ancora FIX1 178 finché non deploy

## Fix

1. `dflightCloseControlPanel` (× / Esc): `dflightSetOverlayVisible(false)` → rimuove native SVG, ATM09 (SyncPreferred + render), info overlay, selezione/details; **non** cancella `_dflightClientSession` / `_dflightOverlaySession`.
2. Minimize: invariato (`gisMinimizePanel` only) — **non** chiama close/hide.
3. `dflightOpenControlPanel` con sessione: ripristina `dflightSetOverlayVisible(true)` poi ATM09 maybe-start (no GET dataset inutile).

## Validazione

- `node --check` OK
- `GOIDflight.selfTest()` **194/194 PASS**
- VR_FIX2_* tutti ok; FIX1 zoom regressioni ok; helperNetDelta=0

## Autosync corrente

EXTERNAL_ONLY.

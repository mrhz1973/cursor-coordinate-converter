# D-FLIGHT-H-AUTOLOAD-UX-A-FIX3 — implementazione (pre-review)

**Data:** 2026-08-13 ~12:25 +02:00  
**Task commit:** `cacfa72de5c252686d0dd44c27b86c848e610075`  
**Subject:** fix(dflight): FIX3 ATM09 legend visibility, details floating, resize handles  
**Build:** `D-FLIGHT-H-AUTOLOAD-UX-A-FIX3` · **174**  
**Baseline:** `ee34f820424efa7ef1dce1f128ddb14283d2ff37`

## Scope

Solo `coordinate_converter Claude.html`. D2+D3+D4. **D1 performance NON toccata.** Helper invariato. **NO deploy.**

## Fix

1. **D2** `dflightAtm09EnsureLegend`: `wrap.hidden=false` quando `can`; `true` quando `!can`; lazy src invariato.
2. **D3** `dflightAtm09OpenDetails`: riusa `dflightWireFloatingPanel` + `dflightPinPanelBelowTopbar` (+ dock/aria/`_dflightDetailsOpen`) come path nativo.
3. **D4** CSS: `#dflightPanel` / `#dflightDetailsPanel` ancorati su se/nw/ne/sw + e/w (liste condivise + blocco corner).

## Validazione

- `node --check` su JS estratto: **PASS**
- `GOIDflight.selfTest()`: **165/165 PASS** (incl. FIX3_D2/D3/D4 + H_build_174)
- Browser locale `127.0.0.1:8765`: A legend (181×189 visible), B details floating+drag, C 6 handle distinti+resize, D native details — **allPass**
- Helper: **non modificato**

## D1 backlog (non in FIX3)

- Dataset ~7.6 MB; diagnostic ready ~6.6 s; dominante = download; operatore ~1 min su altra rete → follow-up payload/compressione/helper separato.

## Gate

`D-FLIGHT-H-AUTOLOAD-UX-A-FIX3 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`

**NO deploy / NO QA operatore / NO finito.**

Autosync container: `EXTERNAL_ONLY` / `PENDING_SELF_REFERENCE`.

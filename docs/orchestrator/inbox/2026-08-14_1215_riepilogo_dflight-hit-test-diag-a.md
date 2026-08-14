# D-FLIGHT-HIT-TEST-DIAG-A — DIAGNOSTIC COMPLETE

**Data:** 2026-08-14 12:15 (locale)  
**Task:** `8be4adcb9692a5b57e4f966c7bfdc517e7f57889`  
**Subject:** `docs: open WU-0015 hit-test DIAG-A (root cause confirmed)`  
**Tipo:** DIAGNOSI + DOCS  
**NON** fix runtime · **NON** monolite · **NON** deploy · **NON** finito · **NON** QA operatore

## Gate

`D-FLIGHT-HIT-TEST-DIAG-A DIAGNOSTIC COMPLETE — ROOT CAUSE CONFIRMED — FIX PLAN REQUIRED`

## Runtime

Live invariato `20b1b494238f8dd483b3eb739f42dbf1194ab727` / build **183** / helper **0.1.3**. WU-0014 resta CLOSED / PASS.

## Riprodotto

SÌ. Overlay ON, zoom **8**, ATM09 ready, filtro 5/5 ON: 0 `.dflight-volume`, 0 ATM09_INFO hit, `elementFromPoint` = `.tile-wrap` (niente pointer). `/atm09/info` → HTTP **502** `cap`. Reload z11: 44 hit, pointer ripristinato.

## Causa

Suppress NFZ (ATM09 preferred) + INFO 502 cap a z8 → zero geometrie hittable.

## File task

- `docs/work-units/WU-0015-dflight-hit-test.md` (nuovo)
- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md` (A OPENED; B–H invariati)

Monolite **escluso**. Working tree pre-autosync: pulito.

## NEXT

FIX PLAN `D-FLIGHT-HIT-TEST-FIX-A` — non implementato in questo blocco.

## Limiti

Fatti del commit autosync corrente = EXTERNAL_ONLY.

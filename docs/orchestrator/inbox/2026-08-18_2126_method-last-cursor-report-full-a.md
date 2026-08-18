# METHOD-LAST-CURSOR-REPORT-FULL-A — docs/method

**TYPE:** DOCS/METHOD ONLY  
**BLOCK vivo (FRONTIER, non modificato):** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5` · GATE **AUTOMATED BROWSER QA — FAIL** · NEXT FIX6

## Cosa

`docs/runtime/LAST_CURSOR_REPORT.md` diventa il rolling handoff **completo** dell’ultimo pass Cursor (header + riepilogo non abbreviato + git). FRONTIER resta l’unica LIVE STATE.

`agg`: refresh minimo HEAD + FRONTIER + WU hot-header, poi il report **una sola volta**. Coerenza BLOCK/CANDIDATE con FRONTIER; conflitto → FRONTIER prevale. Mai chiedere paste del riepilogo se GitHub ha il report.

Nuova chat: CORE BOOT **invariato** (4 passi). Dopo, se il gate dipende dall’ultimo pass Cursor, una lettura on-demand del report.

Autosync Cursor: rule 30 scrive il contratto A/B/C a ogni pass futuro.

## Non toccato

Monolite, FRONTIER, WU gate/block, runtime/build, QA/deploy, helper, Oggetti GIS, roadmap.

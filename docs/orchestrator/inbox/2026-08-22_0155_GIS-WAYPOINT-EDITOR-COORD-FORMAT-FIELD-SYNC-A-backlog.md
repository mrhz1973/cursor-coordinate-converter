# BACKLOG — GIS-WAYPOINT-EDITOR-COORD-FORMAT-FIELD-SYNC-A

**ID:** `GIS-WAYPOINT-EDITOR-COORD-FORMAT-FIELD-SYNC-A`  
**Stato:** **CONSUMED / CLOSED / PASS** con bundle `GIS-MAP-UI-RESIDUAL-MAINTENANCE-A` (2026-08-22) — LIVE **249** · tip `b264097…` · blob `f0bb0be…` · QA PASS · Regola H
**Evidence:** [`2026-08-22_0230_GIS-MAP-UI-RESIDUAL-MAINTENANCE-A_deploy-abqa.md`](2026-08-22_0230_GIS-MAP-UI-RESIDUAL-MAINTENANCE-A_deploy-abqa.md) · finito [`2026-08-22_0316_riepilogo_finito-GIS-MAP-UI-RESIDUAL-MAINTENANCE-A.md`](2026-08-22_0316_riepilogo_finito-GIS-MAP-UI-RESIDUAL-MAINTENANCE-A.md)
**Nota:** storico backlog **non** cancellato.
**Casa primaria:** [`docs/work-units/WU-0005-0009-roadmap.md`](../../work-units/WU-0005-0009-roadmap.md) (Map UX / Waypoint)  
**Origine:** QA FAIL `GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A` finding 1 — triage vs LIVE **247**: **preesistente** (non regressione bundle 248)

## Problema

In «Modifica waypoint», cambiando «Formato coordinate» (es. DD → MGRS), il select può mostrare MGRS mentre `#wpFieldCoord` resta in DD. L’operatore si aspetta che il campo mostri **subito** la **stessa** posizione nel formato selezionato, **senza** mutare lat/lon.

## Contesto tecnico (baseline)

`wireWaypointListCoordFormatOnce` → `refreshWaypointEditorCoordConversionPreview()` con contratto esplicito: **«No field rewrite»** (solo preview Conversione). Storico correlato: `COORD-MODAL-FORMAT-COPY-A (+ FIX1)` CLOSED; `WAYPOINT-EDITOR-CENTER-A-FIX2` documentava «no rewrite field».

## Acceptance futura

- Cambio select → rewrite presentazione di `#wpFieldCoord` dalla draft lat/lon corrente nel formato scelto
- Nessuna mutazione posizione / `state.mapWaypoints[]` per solo cambio formato
- Preview/Copia coerenti; parse Salva invariato (testo = rappresentazione corrente)

## Classificazione futura

ROUTINE/UI salvo audit lifecycle editor.

## Non in scope

- `GIS-WAYPOINT-COORD-UX-A` (map-click / lifecycle modal)
- Riapertura di `COORD-MODAL-FORMAT-COPY-A` senza decisione esplicita
- FIX1 del bundle maintenance 248

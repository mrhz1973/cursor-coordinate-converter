# BACKLOG — GIS-WAYPOINT-TABLE-COL-RESIZE-A

**ID:** `GIS-WAYPOINT-TABLE-COL-RESIZE-A`  
**Stato:** **CONSUMED / IMPLEMENTED** nel bundle `GIS-MAP-UI-RESIDUAL-MAINTENANCE-A` (2026-08-22) — candidate tip `b264097…` · build **249** · blob `f0bb0be…` · **GATE: QA FINALE CHATGPT — PENDING** (non ancora LIVE finché PASS operatore)
**Evidence:** [`2026-08-22_0230_GIS-MAP-UI-RESIDUAL-MAINTENANCE-A_deploy-abqa.md`](2026-08-22_0230_GIS-MAP-UI-RESIDUAL-MAINTENANCE-A_deploy-abqa.md) · ABQA [`2026-08-22_0230_GIS-MAP-UI-RESIDUAL-MAINTENANCE-A-abqa.json`](2026-08-22_0230_GIS-MAP-UI-RESIDUAL-MAINTENANCE-A-abqa.json)
**Nota:** storico backlog **non** cancellato.
**Casa primaria:** [`docs/work-units/WU-0005-0009-roadmap.md`](../../work-units/WU-0005-0009-roadmap.md) (Map UX / Waypoint)  
**Origine:** QA FAIL `GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A` finding 4 — triage vs LIVE **247**: **preesistente** (non regressione bundle 248)

## Problema

Gli handle/separatori per ridimensionare le colonne Nome/Dettagli hanno comportamento erratico e non permettono di restringere normalmente fino al minimo utile. Il resize deve seguire il drag in modo stabile, con min-width solo quanto tecnicamente necessario, senza overlap o salti anomali.

## Contesto tecnico (baseline)

`ensureWpModalNameColResizeWired` — hash identico 247≡248; session-only su `#wp-list._wpNameColPx` / `_wpDetailsColPx`. **Non** confondere con `GIS-WAYPOINT-MODAL-LAYOUT-A` (overlap radiogroup, consumato dal bundle 248).

## Acceptance futura

- Drag fluido; restringere fino a min utile (contenuto/controlli usabili)
- Sticky header / azioni riga / scroll invariati
- Nessun localStorage dedicato salvo decisione esplicita

## Classificazione futura

ROUTINE UI/CSS+handler.

## Non in scope

- Layout radiogroup; FIX1 bundle 248; nuove colonne

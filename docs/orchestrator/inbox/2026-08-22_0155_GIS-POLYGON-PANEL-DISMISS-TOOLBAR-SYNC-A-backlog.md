# BACKLOG — GIS-POLYGON-PANEL-DISMISS-TOOLBAR-SYNC-A

**ID:** `GIS-POLYGON-PANEL-DISMISS-TOOLBAR-SYNC-A`  
**Stato:** **CONSUMED / IMPLEMENTED** nel bundle `GIS-MAP-UI-RESIDUAL-MAINTENANCE-A` (2026-08-22) — candidate tip `b264097…` · build **249** · blob `f0bb0be…` · **GATE: QA FINALE CHATGPT — PENDING** (non ancora LIVE finché PASS operatore)
**Evidence:** [`2026-08-22_0230_GIS-MAP-UI-RESIDUAL-MAINTENANCE-A_deploy-abqa.md`](2026-08-22_0230_GIS-MAP-UI-RESIDUAL-MAINTENANCE-A_deploy-abqa.md) · ABQA [`2026-08-22_0230_GIS-MAP-UI-RESIDUAL-MAINTENANCE-A-abqa.json`](2026-08-22_0230_GIS-MAP-UI-RESIDUAL-MAINTENANCE-A-abqa.json)
**Nota:** storico backlog **non** cancellato.
**Casa primaria:** [`docs/work-units/WU-0005-0009-roadmap.md`](../../work-units/WU-0005-0009-roadmap.md) (Map UX / Poligoni)  
**Origine:** QA FAIL `GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A` finding 2 — triage vs LIVE **247**: **preesistente** (non regressione bundle 248)

## Problema

1. Dopo aver **completato** un poligono, un normale click sulla mappa non deve far sparire la modal Poligoni.
2. Quando la modal Poligoni viene **realmente** chiusa, il pulsante/tool associato non deve restare blu/attivo: deve tornare inattivo/grigio.

Stato «modal chiusa + pulsante attivo» = UI incoerente.

## Contesto tecnico (baseline)

Sync `active` su `[data-role="polygon-open"]` e contributo a `[data-role="track-map-toggle"]` in update toolbar; `closePolygonPanel` invariato tra 247 e 248. Pattern storico analogo Misura: Pass 6E3e (toolbar active dopo close).

## Acceptance futura

- Click mappa post-finalize **non** dismissa il pannello (salvo azione esplicita close/Esc/X o policy già documentata)
- Chiusura reale → tutti i toggle toolbar legati a Poligoni **non** `active` / `aria-pressed=false`
- Nessun ghost edit; geometrie salvate preservate

## Classificazione futura

ROUTINE se solo sync toolbar; **DELICATO** se hit-test map-click / lifecycle dismiss.

## Non in scope

- `GIS-POLYGON-WAYPOINT-INTERACTION-A` (priority drawing / snap / close→end edit)
- Nuove feature poligono; FIX1 bundle 248

# BACKLOG — GIS-TRACK-TOOLBAR-FLYOUT-AUTOCLOSE-A

**ID:** `GIS-TRACK-TOOLBAR-FLYOUT-AUTOCLOSE-A`  
**Stato:** **BACKLOG / NOT OPENED** (2026-08-22)  
**Casa primaria:** [`docs/work-units/WU-0005-0009-roadmap.md`](../../work-units/WU-0005-0009-roadmap.md) (Map UX / toolbar)  
**Origine:** QA FAIL `GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A` finding 3 — triage vs LIVE **247**: **preesistente** (non regressione bundle 248)

## Problema

Il pulsante a freccia apre il flyout con «Poligoni» e «Range & Bearing». Dopo la selezione di una voce il flyout deve **richiudersi immediatamente**; non deve restare aperto sulla mappa.

## Contesto tecnico (baseline)

Menu traccia: `state.mapTrackToolbarMenuOpen` / `[data-role="track-map-menu-toggle"]` / voci `track-map-polygons` · `track-map-rangerings`. Codice non toccato dal bundle maintenance 248.

## Acceptance futura

- Selezione voce → menu chiuso (`aria-expanded=false`, overlay/flyout non visibile)
- Azione della voce (apri pannello) resta invariata
- Nessun redesign toolbar

## Classificazione futura

ROUTINE UI.

## Non in scope

- FIX1 bundle 248; nuove voci menu

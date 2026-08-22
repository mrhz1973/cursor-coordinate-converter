# BACKLOG — GIS-POLYGON-METRICS-COMPACT-FORMAT-A

**ID:** `GIS-POLYGON-METRICS-COMPACT-FORMAT-A`  
**Stato:** **CONSUMED / CLOSED / PASS** con bundle `GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A` (2026-08-22) — LIVE **248** · QA PASS · Regola H  
**Casa primaria:** [`docs/work-units/WU-0005-0009-roadmap.md`](../../work-units/WU-0005-0009-roadmap.md) (Map UX / Poligoni)  
**Runtime:** tip `aa6e8f5…` · build **248** · blob `dadbf8af…`  
**Evidence bundle:** [`2026-08-22_0045_GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A_deploy-abqa.md`](2026-08-22_0045_GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A_deploy-abqa.md) · finito [`2026-08-22_0215_riepilogo_finito-GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A.md`](2026-08-22_0215_riepilogo_finito-GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A.md)  
**Nota:** storico backlog **non** cancellato.

## Motivazione

Nella modal Poligoni, area / perimetro / lunghezze con troppe cifre decimali espandono orizzontalmente la UI (liste, summary, draft info). Serve un rounding di **sola presentazione** a 1 decimale.

## Acceptance futura

- mostrare area, perimetro e lunghezze/dimensioni con **UNA sola cifra decimale**;
- anche valori live durante drawing/edit dove presenti;
- **solo** presentation rounding;
- calcoli interni, geometria, coordinate, persisted data ed export mantengono precisione corrente;
- unità / auto-unit esistenti **invariati**;
- obiettivo: evitare espansione orizzontale della modal;
- verificare desktop, resize e viewport stretta;
- nessun overflow causato dai valori metrici.

## Classificazione futura

- **ROUTINE/UI** salvo audit contrario all’apertura.

## Non in scope di questa registrazione

- Implementazione / patch runtime
- Deploy
- Apertura FRONTIER
- Altri backlog poligono (`GIS-POLYGON-PRESET-SHAPES-A`, interaction, vertex-coord)

## Contesto LIVE al momento della registrazione

Registrato **dopo** promozione runtime `GIS-POLYGON-VERTEX-COORD-UX-A-FIX2` build **241** (candidate reviewed `b578ec8…` · blob `92ec73f7…` · tip main post-cherry-pick).  
Questo backlog **non** è scope del FIX2.

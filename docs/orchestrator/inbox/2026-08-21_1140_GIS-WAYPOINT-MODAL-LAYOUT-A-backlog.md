# BACKLOG — GIS-WAYPOINT-MODAL-LAYOUT-A

**ID:** `GIS-WAYPOINT-MODAL-LAYOUT-A`  
**Stato:** **BACKLOG / NOT OPENED** (2026-08-21)  
**Casa primaria:** [`docs/work-units/WU-0005-0009-roadmap.md`](../../work-units/WU-0005-0009-roadmap.md) (Map UX / Waypoint)  
**Runtime:** **non implementato** in questo pass (docs-only)  
**FRONTIER:** **non aperto**

## Finding operatore

Nella modal Waypoint, con lista lunga / scorrimento, il gruppo controlli:

- «Nome sulla mappa»
- «Sempre visibile»
- «Solo nei tooltip»

si **sovrappone** alle righe della tabella waypoint, coprendo Nome / Dettagli / controlli riga.

## Acceptance futura

- il gruppo deve occupare **spazio proprio** nel layout;
- **MAI** overlap con righe tabella;
- la lista deve scorrere correttamente sotto/accanto ai controlli;
- verifiche: desktop, viewport stretta/mobile, resize;
- checkbox, nome, coordinate, Copia, Modifica, centro, Preferiti ed Elimina sempre raggiungibili;
- semantica «Sempre visibile» / «Solo nei tooltip» **invariata**;
- `state.mapWaypoints[]` **invariato**;
- minimize / restore / resize modal **invariati**.

## Classificazione futura

- **ROUTINE** se il fix risulta esclusivamente CSS/layout;
- **DELICATO** se richiede lifecycle/DOM modal.

## Non in scope di questa registrazione

- Implementazione / patch runtime
- Deploy
- Apertura FRONTIER
- Altri backlog Waypoint (`GIS-WAYPOINT-COORD-UX-A`, interaction drawing)

## Contesto LIVE al momento della registrazione

Registrato **dopo** promozione runtime `GIS-POLYGON-VERTEX-COORD-UX-A-FIX1` build **240** (`4fb9c2f…` · blob `192c3b41…`).  
Questo backlog **non** è scope del FIX1; build 240 non deve “correggerlo” silenziosamente.

# BACKLOG — GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A

**ID:** `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A`  
**Stato:** **CONSUMED / FIX1 PENDING QA** (2026-08-24) — parent **251** FAIL caso 2; candidate **252** FIX1  
**Casa primaria:** [`docs/work-units/WU-0005-0009-roadmap.md`](../../work-units/WU-0005-0009-roadmap.md) (Map UX / Waypoint)  
**Runtime:** tip `4ad3b52` · blob `003b40b8…` · evidence [`2026-08-24_1500_GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX1_deploy-abqa.md`](2026-08-24_1500_GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX1_deploy-abqa.md)  
**FRONTIER:** blocco attivo FIX1 PENDING QA  
**Sblocco:** funzionale **limitato esclusivamente** a questo blocco; Oggetti GIS resta FROZEN / MAINTENANCE-ONLY altrove.

## Motivazione

Serve export Waypoint come **testo semplice** (file unico + clipboard), oltre ai formati GIS già presenti, per interoperabilità leggera.

## Acceptance futura

- export Waypoint anche come testo semplice in **UN unico file**;
- supporto singolo waypoint e selezione multipla;
- copia negli appunti dello stesso contenuto;
- più waypoint → unico blocco clipboard;
- ordine coerente con lista/selezione;
- includere almeno **Nome + Coordinata**;
- coordinata nel formato scelto nella modal Waypoint;
- eventuali tipo/icona/note solo se già canonici/utili;
- layout testo semplice e interoperabile, preferenza una riga per WP:  
  `NOME | COORDINATA | TIPO | NOTE`
- riusare formatter canonico;
- nessun parser/formatter parallelo;
- `state.mapWaypoints[]` **invariato**;
- **zero rete**.

## Classificazione futura

- ROUTINE/export UI salvo audit contrario.

## Non in scope di questa registrazione

- Implementazione / patch runtime
- Deploy
- Apertura FRONTIER
- Layout overlap (`GIS-WAYPOINT-MODAL-LAYOUT-A`) / lifecycle (`GIS-WAYPOINT-COORD-UX-A`)

## Contesto LIVE al momento della registrazione

Registrato **dopo** promozione runtime `GIS-POLYGON-VERTEX-COORD-UX-A-FIX2` build **241**.  
Questo backlog **non** è scope del FIX2.

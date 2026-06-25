# P-UNITS-RB-PARITY — NM / mi / ft unità lunghezza Poligoni

**Data:** 2026-06-26  
**Tipo:** micro-feature runtime + finito sessione + autosync orchestratore

## Commit task (runtime)

- **SHA:** `11838a15d39a8053e8f561300abf447c3aaf7823`
- **Subject:** `feat(gis): add NM mi and ft polygon metric units (P-UNITS-RB-PARITY)`
- **File:** `coordinate_converter Claude.html` (+8/−6)
- **Blob monolite:** `10f5f1e90a7cc9fcc4c63ea40627841878fbb378`

## Commit docs

- **SHA:** `9a4cb574114c944499a4017296cc733f77a8a22d`

## Cosa è stato fatto

- Esteso `sanitizePolygonLengthUnit` → auto | m | km | nm | mi | ft
- `formatDistanceMetersForUnit` delega a `formatMapMeasureDistance` per tutte le unità esplicite
- Select `#polygonPanelLengthUnit`: Automatico, m, km, NM, mi, ft (abbreviazioni come R&B)
- Selettore area invariato
- P-UNITS-FIX preservato: nessun sync Misura GIS / rrUnit

## Verifiche

- Harness formatter + isolamento: PASS
- `node --check`: PASS
- Smoke browser: non disponibile

## Non eseguito

- Deploy VPS (VPS ancora su blob `d51d210…` pre-RB-PARITY)
- QA operatore
- Review Claude (NON RICHIESTA)

## Stato

- **P-UNITS + RB-PARITY:** runtime pushato; **non CLOSED end-to-end**
- **P-VERTEX-MODAL / P-STYLE:** non iniziati

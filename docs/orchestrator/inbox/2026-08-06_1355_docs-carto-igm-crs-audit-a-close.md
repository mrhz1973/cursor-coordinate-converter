# DOCS-CARTO-IGM-CRS-AUDIT-A-CLOSE — riepilogo

**Data:** 2026-08-06 ~13:55 locale  
**Tipo:** docs-only  
**Baseline:** `a536e422d70c96d870a73a7a2ce383d0c51fdc81`  
**Commit task:** `db2d4303104c66cc23424d6d0440d07557769bfb` — `docs(carto): record IGM CRS audit outcome`  
**Push task:** riuscito  
**Working tree pre-autosync:** pulito dopo push task  
**Monolite:** escluso / invariato blob `7154fff5…` (tip live `51e0f5b` / build 132)

## Classificazione registrata

- **CARTO-IGM-CRS-AUDIT-A** — DIAGNOSTIC COMPLETE / **CRS AUDIT PARTIAL**
- **CARTO-ARCHIVE-MATCH-A** — PASS WITH DOCUMENTED LIMITATIONS / CANDIDATE NOT OPENED
- Nessuna modifica runtime richiesta

## Correzioni terminologiche

- OGC:CRS84, coordinate lon/lat (non «EPSG:4326 lon-first» formale)
- PolygonZ Serie 50: drop Z; CRS orizzontale CRS84; Z NOT VERIFIED
- Nessuno scarto datum dalla pipeline; accuratezza assoluta non quantificata
- Bordi densificati: causa non provata (no coste/province)

## Foglio 232 (controllo operatore)

S50 SESTRI LEVANTE NW ≈ 9.332321 E / 44.399023 N vs MGRS `32T NQ 26463 16249` ≈ 2,7 m — footprint OK; non prova datum edizione.

## Ordine operativo risultante

1. CARTO-ARCHIVE-MATCH-A (sbloccato con limitazioni; non aperto)  
2. CARTO-IGM-AREA-ESC-RESTORE-A  
3. COORD-MODAL-FORMAT-COPY-A  
4. CARTO-IGM-SERIES-EXPAND-A  
5. provider successivi  

WU-0012 resta OPEN.

## File task

- `docs/OPERATING_MEMORY.md`
- `docs/work-units/WU-0005-0009-roadmap.md`
- `docs/work-units/WU-0012-carto-index-federated.md` (§15, §15d)

## Limiti

- Nessun deploy/QA; nessun payload/manifest/GeoJSON toccato
- Autosync corrente: SHA/push/HEAD = EXTERNAL_ONLY

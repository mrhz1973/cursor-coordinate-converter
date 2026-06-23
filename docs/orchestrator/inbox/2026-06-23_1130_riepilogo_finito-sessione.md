# Riepilogo finito sessione — POLY-PARITY-P2 drag vertici

**Data:** 2026-06-23  
**Commit task (`finito` step 2):** `e22e40b` — `feat: POLY-PARITY-P2 drag vertici poligono GIS in edit`  
**HEAD iniziale:** `d52ce79`  
**Runtime P1-FIX base:** `d30a3a8`  
**Push step 2:** riuscito

## Cosa è stato fatto

Implementato drag vertici in modalità Modifica poligono GIS (POLY-PARITY-P2):

- Pattern document-level `mapPolyEditDocDrag` / `Cleanup` / `Move` / `Up` (come `mapTrackDocDrag`, `mapMeasureDocDrag`, `mapRrCenterDocDrag`);
- Handle SVG interattivi in `renderPolygonEditOverlay` (hit r=18, grab/grabbing, touch-action:none, aria-label);
- Conversione `mapClientToLatLonMap` + clamp lat / `normalizeLon` → `[lon,lat]` in `_polyEdit.working[idx]`;
- Dirty geometrico reale: `polygonRecomputeGeometryDirty`, `polygonOpenRingsEquivalent`, `polygonOriginalOpenRing` con `gisSameCoord`;
- Live update overlay + `renderPolygonEditInfo` (rAF su pointermove);
- Cleanup idempotente: up/cancel, Salva, Annulla, enter edit, close panel;
- i18n hint vertici trascinabili IT/EN/FR.

## Docs aggiornate in `finito`

- **P1-FIX:** registrato **QA operatore PASS** (attestazione prompt);
- **P2:** runtime implementato, QA operatore pending.

## File modificati

- `coordinate_converter Claude.html`
- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md` §POLY-PARITY-P2

## Contratti preservati

- `_polyEdit` transiente; nessun `saveStore`/`gisFeatureUpdate` durante drag;
- `polygonSaveEdit`: una sola `gisFeatureUpdate`;
- Sanitizer, timestamp, import/export, Tracce/Waypoint/rete: invariati;
- **`APP_BUILD_ID` `B5.5Z`**

## QA

- `node --check`: PASS
- QA operatore P2: **pending** (non attestata da Cursor)

## Deploy

**Nessun deploy VPS.**

## Frontiera

`POLY-PARITY-P2 runtime implementato e pushato; QA operatore pending; nessun deploy`

# Riepilogo — WU-0009B B5.4 export JPEG con scala opzionale

**Data:** 2026-06-19  
**Base remota:** `8a3508c`  
**Task:** B5.4 — export JPG con scala opzionale su canvas 2D

---

## Implementazione

- Dialog `#jpgExportDialog` con checkbox «Includi scala» (default off, session `_jpgExportIncludeScale`)
- `computeMapScaleModel()` — helper condiviso UI + export
- `drawJpgExportScale()` / `drawJpgExportScaleBar()` — canvas 2D only
- `exportMapAsJpg({ includeScale })` — scala disegnata dopo tile/marker, prima di `toBlob("image/jpeg", 0.92)`
- Export senza scala: comportamento precedente preservato
- UI scala B5.3b invariata; nessun toggle m/km

## Controlli

- `node --check`: OK
- Nessun `foreignObject`; nessuna raster HTML `.tile-scale`
- OPSEC/proxy/waypoint non toccati

## pass_operatore

**non-attestato** — QA export operatore pending

## Commit attesi

1. `feat(gis): optional scale on JPG export via canvas 2D (B5.4)`
2. `docs: OM §7 — B5.4 JPG scale export PASS tecnico`
3. `docs: orchestratore + LAST_CURSOR_REPORT — B5.4 JPG scale export`

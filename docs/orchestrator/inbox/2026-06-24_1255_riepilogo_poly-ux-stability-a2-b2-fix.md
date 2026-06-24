# Riepilogo — POLY-UX-STABILITY-A2-B2-FIX redraw post-close edit

**Commit runtime:** `70ed7b3` — `fix(gis): redraw polygon map after closing edit`

## Causa

Rollback logico corretto (`_polyEdit = null`) ma `polygonScheduleEditOverlayRefresh` non ridisegna dopo cancel (guard `!polygonIsEditing()`); `renderAllMaps()` indefinita.

## Fix

`closePolygonPanel()`: `wasEditing` → cancel → close → se `wasEditing`: cancel RAF A1 pendente + `renderTileMap(viewCenter→lastPoint, mapZoom||11)`.

## Stato

- A2-B2 `cb9f92f`: PARTIAL FAIL QA (overlay stale)
- A2-B2-FIX: deploy/QA pending
- A2-B1: CLOSED/PASS invariato

# Riepilogo — POLY-UX-STABILITY-A2-B2 chiusura edit-safe

**Data:** 2026-06-24  
**Commit runtime:** `cb9f92f` — `fix(gis): cancel polygon edit when closing panel`

## Patch

`closePolygonPanel()` — prima della chiusura, se `polygonIsEditing()`:
`polygonEditCancelHandler()` (stesso percorso pulsante Annulla).

## Call path Annulla verificato

`#polygonPanelEditCancel` click → `polygonEditCancelHandler()` →
`mapPolyEditDocDragCleanup` → `polygonCancelEdit()` (`_polyEdit = null`) →
`polygonRefreshEditUi()` — **nessun** `gisFeatureUpdate`, **nessun** `saveStore`, **nessun** `closePolygonPanel`.

## Chiusura (tutti via `closePolygonPanel`)

- X, backdrop, cancel dialog, toggle toolbar (pannello visibile)

## Controlli

- `node --check`: PASS
- Diff: +1 riga in `closePolygonPanel` only
- A2-B1 toggle: byte-invariato
- `APP_BUILD_ID`: B5.5Z

## Stato correlato

- **A2-B1:** CLOSED/PASS (`db2f6ea`, deploy VPS PASS, QA PASS operatore)
- **A2-B2:** deploy VPS pending, QA pending
- **A2-B3:** fuori scope

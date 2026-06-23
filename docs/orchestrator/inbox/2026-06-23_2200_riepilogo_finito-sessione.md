# Riepilogo finito — POLY-UX-STABILITY-A1 handle vertici ingresso Modifica

**Data:** 2026-06-23  
**Blocco:** WU-0006 POLY-UX-STABILITY-A1

## Commit task

- **SHA:** `af87259137544cbb8d0c912b305ff2eea81aeaf0` (short `af87259`)
- **Subject:** feat: POLY-UX-STABILITY-A1 handle vertici visibili ingresso Modifica
- **Push task:** riuscito (`e533520..af87259 main -> main`)

## Working tree pre-autosync

(vuoto)

## Modifiche runtime

- `polygonScheduleEditOverlayRefresh()` — RAF + `mapPolyEditOverlayRefreshGen` token
- `polygonRefreshEditUi()` — rimossa `renderAllMaps()`, schedula overlay refresh
- Chiamata diretta `renderTileMap(lat, lon, z)` con `viewCenter` → fallback `lastPoint`

## Call graph

- `refreshTileMapForTrackUi` ramo `lastPoint` → `renderMiniMap` → raggiunge `renderTileMap`
- A1 usa chiamata diretta `renderTileMap` (deterministico, senza side-effect mini-map)

## Residue `renderAllMaps` (5, fuori scope)

`openPolygonPanel`, `closePolygonPanel`, `polygonDeleteExecute`, `polygonToggleVisibility`

## Docs vivi

- P7-B1 → CLOSED / PASS end-to-end (`57c6d39`, deploy VPS, QA operatore)
- A-DIAG registrata
- A1 → runtime pushato, QA operatore pending
- A2 non implementato

## Verifiche

- `node --check`: PASS (2 blocchi inline)
- `APP_BUILD_ID`: B5.5Z invariato
- QA browser Cursor: non eseguita
- QA operatore A1: **pending**

## Prossimo

QA operatore A1; deploy VPS A1; A2 pannello/minimize

# Riepilogo — Mappa: hydrate “pending” / durata lunga

**Data:** 2026-04-30

## Diagnosi (log + codice)

1. **`hydrateMapTiles:exit` con `pending: 45`, `imgsWithSrc: 0`, `network: 0`**  
   Compatibile con **DOM sostituito** mentre `hydrateMapTiles` è ancora in volo: `load1` aggiorna nodi **staccati** dopo un nuovo `renderTileMap` → `innerHTML`; il `#miniMap` visibile ha tile nuove ancora `.tile-pending`. Il conteggio exit interroga il DOM **corrente**, non le wrap del batch completato.

2. **`durationMs` 57–73 s**  
   Dopo `Promise.all(load1)`, `syncOfflineDeltaViewportHints` faceva fino a `cap` (≈120) **`await getTileBlobByKey` in sequenza** su tile in vista — con 45 tile e IDB lento diventa decine di secondi prima del log `exit`, amplificato se più hydrate si accavallano.

3. **Catena boot**  
   `applyLanguage` → `updateNetStatus` → `renderMiniMap`, poi `updateNetStatus` in `init`, poi `gisInit`, poi `initMiniMapOnStartup` → più `renderTileMap` ravvicinati; `ResizeObserver` può aggiungerne altri → **più hydrate sovrapposti** senza guard.

## Intervento (monolite, non in autosync)

- `renderTileMap`: incrementa `root._mapTileGen` e passa il valore a `hydrateMapTiles`.
- `hydrateMapTiles(..., tileGen)`: ignora/salta `load1` se `wrap` non connesso o gen obsoleto; dopo `await` ripete il check; se obsoleto dopo `Promise.all`, **abort** prima di `monitorTileLoading` (log `hydrateMapTiles:stale` / `stale2`).
- Log exit: `imgsWithSrcAttr` + `imgsWithSrcProp` per distinguere attributo vs proprietà.
- `syncOfflineDeltaViewportHints(mapRoot, opts)`: `opts.tileGen` per abort coerente; **parallelizza** i lookup IDB con `Promise.all` sui candidati (stesso `cap`).

## QA

Hard refresh: mappa OSM visibile; log `hydrateMapTiles:exit` con `pending` basso/zero e `imgsWithSrcProp` > 0 in condizioni online; eventuali `stale` solo se re-render molto ravvicinati.

## File

- `coordinate_converter Claude.html` (solo logica map/hydrate/delta).

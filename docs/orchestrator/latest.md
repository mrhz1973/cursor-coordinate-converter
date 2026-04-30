# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-30 — **Mappa / hydrateMapTiles:** diagnosi — exit con `pending:45` e `imgsWithSrc:0` da **hydrate su DOM già sostituito** da un `renderTileMap` successivo; durata lunga anche da **`syncOfflineDeltaViewportHints` sequenziale** (molti `await getTileBlobByKey`). Fix monolite: generazione `#miniMap._mapTileGen` passata a `hydrateMapTiles`, skip se obsoleto, check dopo `await` in `load1`; delta hints in **parallelo** + `opts.tileGen`. Dettaglio **`docs/orchestrator/inbox/2026-04-30_1930_riepilogo_map-hydrate-stale-gen-delta-parallel.md`**. (RR: fix rename già in `1900_…`.)

## Ultimo intervento Cursor

Fix hydrate tile-gen + delta hints parallel + recap RR rename; memoria aggiornata. Monolite **non** in autosync.

## File modificati (sintesi)

- `coordinate_converter Claude.html` (locale, non committato in autosync)
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-30_1830_riepilogo_rr-loop-hypothesis-instrumentation.md`
- `docs/orchestrator/inbox/2026-04-30_1900_riepilogo_rr-infinite-loop-rename-cancel.md`
- `docs/orchestrator/inbox/2026-04-30_1930_riepilogo_map-hydrate-stale-gen-delta-parallel.md`

## Prossimo passo consigliato

Hard refresh: verificare tile visibili e log `hydrateMapTiles:exit` (`imgsWithSrcProp`, pochi `stale`). Poi RR se serve.

## Dettagli (inbox)

- Misura M6 overlay polish: `docs/orchestrator/inbox/2026-04-30_1428_riepilogo_measure-M6-overlay-polish.md`
- Bugfix reset dati locali (modal stuck): `docs/orchestrator/inbox/2026-04-30_1637_riepilogo_bugfix-reset-local-data-modal-stuck.md`
- RR debug perf: `docs/orchestrator/inbox/2026-04-30_1745_riepilogo_rr-debug-perf-instrumentation.md`
- RR loop ingest H1–H4: `docs/orchestrator/inbox/2026-04-30_1830_riepilogo_rr-loop-hypothesis-instrumentation.md`
- RR fix loop rename-cancel: `docs/orchestrator/inbox/2026-04-30_1900_riepilogo_rr-infinite-loop-rename-cancel.md`
- Map hydrate stale-gen + delta parallel: `docs/orchestrator/inbox/2026-04-30_1930_riepilogo_map-hydrate-stale-gen-delta-parallel.md`

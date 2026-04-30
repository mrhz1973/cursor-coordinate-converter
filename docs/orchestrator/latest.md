# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-30 — **Mappa / hydrateMapTiles (follow-up):** log `bf0d51` mostra `hydrateMapTiles:stale` con **`durationMs` ~14s** (`tileGen` molto indietro vs `mapTileGen`) = hydrate superseded ancora legato ai **fetch** tile. Fix monolite: **`AbortController`** su `#miniMap` (`_miniMapTileHydrateAC`), abort prima di ogni nuovo `renderTileMap`, **`fetch(..., { signal })`** in `hydrateMapTiles`. Dettaglio **`docs/orchestrator/inbox/2026-04-30_2005_riepilogo_tile-hydrate-abort-superseded-fetch.md`**. (Stale-gen + delta parallel: `1930_…`.)

## Ultimo intervento Cursor

Abort fetch superseded per tile hydrate; memoria aggiornata. Monolite **non** in autosync.

## File modificati (sintesi)

- `coordinate_converter Claude.html` (locale, non committato in autosync)
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-30_1830_riepilogo_rr-loop-hypothesis-instrumentation.md`
- `docs/orchestrator/inbox/2026-04-30_1900_riepilogo_rr-infinite-loop-rename-cancel.md`
- `docs/orchestrator/inbox/2026-04-30_1930_riepilogo_map-hydrate-stale-gen-delta-parallel.md`
- `docs/orchestrator/inbox/2026-04-30_2005_riepilogo_tile-hydrate-abort-superseded-fetch.md`

## Prossimo passo consigliato

Hard refresh + zoom rapido: verificare in log che gli `hydrateMapTiles:stale` durante rete online non restino bloccati multi-secondo; poi rimozione strumentazione `bf0d51` se tutto ok.

## Dettagli (inbox)

- Misura M6 overlay polish: `docs/orchestrator/inbox/2026-04-30_1428_riepilogo_measure-M6-overlay-polish.md`
- Bugfix reset dati locali (modal stuck): `docs/orchestrator/inbox/2026-04-30_1637_riepilogo_bugfix-reset-local-data-modal-stuck.md`
- RR debug perf: `docs/orchestrator/inbox/2026-04-30_1745_riepilogo_rr-debug-perf-instrumentation.md`
- RR loop ingest H1–H4: `docs/orchestrator/inbox/2026-04-30_1830_riepilogo_rr-loop-hypothesis-instrumentation.md`
- RR fix loop rename-cancel: `docs/orchestrator/inbox/2026-04-30_1900_riepilogo_rr-infinite-loop-rename-cancel.md`
- Map hydrate stale-gen + delta parallel: `docs/orchestrator/inbox/2026-04-30_1930_riepilogo_map-hydrate-stale-gen-delta-parallel.md`
- Tile hydrate abort superseded fetch: `docs/orchestrator/inbox/2026-04-30_2005_riepilogo_tile-hydrate-abort-superseded-fetch.md`

# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-30 — **Pulizia strumentazione debug monolite (post-fix verificato):** rimossi `bf0d51` / `RR_DEBUG_PERF` / ingest localhost da `coordinate_converter Claude.html`; **mantenuti** fix `rrCancelPendingRename` (no re-render se nessun rename pendente), `_mapTileGen` + stale checks in `hydrateMapTiles`, `AbortController` su fetch tile, delta viewport parallelo. Dettaglio **`docs/orchestrator/inbox/2026-04-30_2130_riepilogo_monolite-debug-cleanup-post-fix.md`**.

## Ultimo intervento Cursor

Rimozione strumentazione debug dal monolite dopo QA utente; pubblicazione memoria orchestratore. Monolite **non** in autosync.

## File modificati (sintesi)

- `coordinate_converter Claude.html` (locale, non committato in autosync)
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-30_2130_riepilogo_monolite-debug-cleanup-post-fix.md`

## Prossimo passo consigliato

Smoke manuale rapido (GIS: mappa, RR vuoto, rename Annulla) dopo deploy locale del file HTML; nessun ingest locale atteso.

## Dettagli (inbox)

- Misura M6 overlay polish: `docs/orchestrator/inbox/2026-04-30_1428_riepilogo_measure-M6-overlay-polish.md`
- Bugfix reset dati locali (modal stuck): `docs/orchestrator/inbox/2026-04-30_1637_riepilogo_bugfix-reset-local-data-modal-stuck.md`
- RR debug perf: `docs/orchestrator/inbox/2026-04-30_1745_riepilogo_rr-debug-perf-instrumentation.md`
- RR loop ingest H1–H4: `docs/orchestrator/inbox/2026-04-30_1830_riepilogo_rr-loop-hypothesis-instrumentation.md`
- RR fix loop rename-cancel: `docs/orchestrator/inbox/2026-04-30_1900_riepilogo_rr-infinite-loop-rename-cancel.md`
- Map hydrate stale-gen + delta parallel: `docs/orchestrator/inbox/2026-04-30_1930_riepilogo_map-hydrate-stale-gen-delta-parallel.md`
- Tile hydrate abort superseded fetch: `docs/orchestrator/inbox/2026-04-30_2005_riepilogo_tile-hydrate-abort-superseded-fetch.md`
- Pulizia debug post-fix monolite: `docs/orchestrator/inbox/2026-04-30_2130_riepilogo_monolite-debug-cleanup-post-fix.md`

# Riepilogo intervento — pulizia strumentazione debug monolite (post-fix)

**Data:** 2026-04-30  
**Contesto:** dopo verifica utente (mappa OSM, Range Rings lista vuota senza freeze, rename inline → conferma → Annulla OK), rimossa la strumentazione temporanea mantenendo i fix funzionali.

## Cosa è stato fatto

- Rimossi da `coordinate_converter Claude.html`:
  - `__dbgLog`, listener globali `error` / `unhandledrejection` usati solo per ingest
  - Tutte le chiamate `fetch` verso `127.0.0.1:7268/ingest/...` (sessione bf0d51)
  - Blocchi `#region agent log (bf0d51*)` in init, boot, app full reset, `renderMiniMap`, `hydrateMapTiles`, `renderTileMap`, `renderRangeRingsPanel`, `refreshRangeRingsAfterStateChange`, `openRangeRingsFloatingPanelGis`, `closeRangeRingsPanel`, `installMiniMapResizeObserver`
  - Costanti e helper `RR_DEBUG_PERF`, `__rrDbgPerf`, `window.__RR_DBG`, contatori e `console.log` associati
- **Mantenuti** (nessuna regressione intenzionale):
  - `rrCancelPendingRename`: `renderRangeRingsList()` solo se `p` (rename pendente) era valorizzato
  - `renderTileMap`: bump `_mapTileGen`, `hydrateMapTiles` con `tileGen` + controlli stale + `wrap.isConnected`
  - `AbortController` su `#miniMap` (`_miniMapTileHydrateAC`) e `fetch` con `signal` in `hydrateMapTiles`
  - `syncOfflineDeltaViewportHints` con `opts.tileGen` e `Promise.all` sui candidati

## QA

- QA manuale consigliato (stesso smoke dell’utente): hard refresh GIS, mappa OSM, RR senza set ripetuto open/close, rename + Annulla con almeno un set.

## Git / commit

- **Monolite:** modificato in working tree; **non** incluso nell’autosync (regola progetto).
- **Memoria orchestratore:** questo file + `latest.md` nel commit selettivo.

## Rischi residui

- Nessuno atteso: rimozione puramente di logging; logica di produzione invariata oltre alla rimozione di side-effect di rete verso localhost.

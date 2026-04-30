# Riepilogo intervento — Strumentazione DEBUG Range Rings (performance)

**Data:** 2026-04-30  
**Contesto:** Diagnosi rallentamento 3–4 s all’apertura pannello Range Rings (localhost); nessun fix funzionale, solo evidenze.

## Cosa è stato fatto

- Aggiunto blocco **`// #region RR_DEBUG_PERF temporaneo`** in `coordinate_converter Claude.html`:
  - `const RR_DEBUG_PERF = true`, helper `__rrDbgPerf` → `console.log("[RR-DEBUG-PERF]", …)`.
  - `window.__RR_DBG` con contatori chiamate: `ensurePickerCalls` / `ensurePickerSkipped`, `ensureIoCalls`, `ensureRenameCalls`, `ensureTableResizeCalls` / `ensureTableResizeSkipped`, `panelCalls`, `listCalls`, `overlayCalls`, `rrIndexFavCalls`, `rrIndexWpCalls`, `rrFillPickerCalls`, `rrOpenPickerCalls`.
- **Timing:** `renderRangeRingsPanel` (totale + fase `ensure*Wired`), `renderRangeRingsList` (vuoto vs tabella + `htmlLen`), `renderRangeRingsOverlay` (ms, anelli, `vincentyCalls`, `svgChildCount`, punti polilinea approssimati).
- **`openRangeRingsFloatingPanelGis`:** flag `window.__RR_DBGPanelOpening` tra validazione `dlg`/`body` e fine (entrambi i rami existing/new); ingest NDJSON su start/exit.
- **`renderTileMap`:** se `__RR_DBGPanelOpening`, log ingest + `__rrDbgPerf` (rileva full map re-render durante apertura RR).
- **`ensureRrSourcePickerWired`:** conteggio chiamate vs skip (dialog assente o già `_rrPickerWired`).
- **`rrFillRrSourcePickerList` / `rrOpenRrSourcePicker`:** contatori per verificare lazy vs eager picker.

## Cosa **non** è stato fatto

- Nessun fix definitivo prestazioni; nessuna modifica a reset, Misura, Track, Waypoint, offline, GPS, OPSEC, geocoding.
- `coordinate_converter Claude.html` **non** incluso nel commit autosync (solo memoria orchestratore).

## QA / prossimo passo

1. Hard refresh su localhost, aprire Range Rings, incollare in chat le righe console `[RR-DEBUG-PERF]` e/o verificare `.cursor/debug-bf0d51.log` dopo ingest.
2. Confermare ipotesi (overlay+vincenty vs lista+innerHTML vs `renderTileMap` durante open).
3. Solo dopo evidenze: applicare max 3 patch ordinate per rischio.

## Stato repo

- Monolite modificato localmente; memoria orchestratore aggiornata con questo file + `latest.md`.

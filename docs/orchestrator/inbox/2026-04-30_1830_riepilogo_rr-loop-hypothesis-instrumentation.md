# Riepilogo intervento — Range Rings loop / ingest (bf0d51)

**Data:** 2026-04-30  
**Contesto:** debug performance (log `[RR-DEBUG-PERF] renderRangeRingsList:empty` + `renderTileMap:duringRRPanelOpen` in raffica). Nessun fix applicato: solo evidenze runtime.

## Cosa è stato fatto

Nel monolite `coordinate_converter Claude.html` (locale, **non** incluso in commit autosync) aggiunta strumentazione NDJSON verso `http://127.0.0.1:7268/ingest/cfc11017-eba5-4b32-835b-64697a33587e` con sessione `bf0d51`, regioni `// #region agent log (bf0d51-loop)`:

| hypothesisId | location | Scopo |
|----------------|----------|--------|
| H1 | `miniMapResizeObserver:callback`, `miniMapResizeObserver:debounced` | Confermare se `ResizeObserver` su `#miniMap` scatta in loop (w vs lastW, soglia 16px) mentre `state.rangeRingsPanelOpen`. |
| H2 | `renderMiniMap:entry` | Chi chiama `renderMiniMap` (stack sintetico) e `rootW` durante il problema. |
| H3 | `refreshRangeRingsAfterStateChange:entry` | Frequenza e stack di `refreshRangeRingsAfterStateChange`, `hasTile`, `rootW`. |
| H4 | `renderRangeRingsPanel:entry` | Reingressi ripetuti del pannello e stack. |

All’ingresso di `openRangeRingsFloatingPanelGis` azzerati i contatori `__bf0d51_*Seq` per correlare un singolo run.

## File toccati

- `coordinate_converter Claude.html` — solo log (nessuna modifica logica map/RR).

## QA

- Non eseguiti test automatici; serve riproduzione manuale + lettura `.cursor/debug-bf0d51.log`.

## Prossimo passo

1. Utente riproduce apertura Range Rings (GIS) con ingest attivo.  
2. Analisi NDJSON: se H1/H2 mostrano alternanza RO → `renderMiniMap` → `renderTileMap` con `dw >= 16`, priorità fix su feedback layout (es. ignorare RO durante render map, o stabilizzare larghezza scrollbar).  
3. Se H3/H4 dominano, tracciare caller da stack verso `refreshRangeRingsAfterStateChange` / `renderRangeRingsPanel`.

## Monolite nel commit

**Escluso** dal commit autosync (come da policy).

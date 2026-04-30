# Riepilogo — Range Rings: loop infinito su lista vuota

**Data:** 2026-04-30

## Evidenza runtime (`.cursor/debug-bf0d51.log`)

- All’apertura pannello RR: molte voci `renderMiniMap:entry` nello stesso millisecondo con stack  
  `refreshTileMapForTrackUi` → `rrClearRangeRingsEditSession` → `renderRangeRingsList` → `rrCancelPendingRename` → `renderRangeRingsList` (ripetuto).
- `renderRangeRingsPanel:end` in init con `listCalls:1321` (sintomo di ricorsione anche a boot se lista vuota + stesso bug).

## Causa radice

`renderRangeRingsList()` nel branch **senza set** chiamava sempre `rrCancelPendingRename()`.  
`rrCancelPendingRename()` terminava **sempre** con `renderRangeRingsList()` anche se non c’era rename pendente (`p` null) → ricorsione infinita.

## Fix

In `rrCancelPendingRename`: chiamare `renderRangeRingsList()` **solo se** c’era un `state._rrPendingRename` reale (`p` truthy), dopo il revert DOM.

## File modificati

- `coordinate_converter Claude.html` — funzione `rrCancelPendingRename` (non committato in autosync).

## QA consigliato

Aprire Range Rings con 0 set: niente freeze, `listCalls` non deve esplodere; provare rename + annulla con set presenti.

# Riepilogo — Range Rings: conferma eliminazione in pannello

**Data:** 2026-04-29

## Bug risolto

Eliminazione **singola** (pulsante riga) e **batch** (`Elimina selezionati`) avveniva subito; per il batch c’era `window.confirm` (e nessuna conferma visibile in-pannello). Ora nessun `window.confirm` / `alert` per questo flusso: conferma con box interno a `#sec-rangerings`, sotto la batch bar e sopra la tabella.

## Comportamento

- `state._rrPendingDelete` (transient, non persistito): `{ type: "single"|"batch", ids: string[] }`.
- `rrRequestDeleteSet` / `rrRequestDeleteSelected` aprono la conferma; `rrExecutePendingDelete` chiama `rrDeleteSetIds` (logica di delete invariata).
- `rrClearPendingDelete`, Esc (prima del clear pick mappa RR), chiusura floating `closeRangeRingsPanel`, `sec-rangerings` `toggle` chiuso, `rrClearMsgs` / `rrShowError` / `rrShowOk`, lista vuota: azzerano/mascherano la conferma.
- UI: `#rrDeleteConfirm` con `aria-live="assertive"`, testo i18n, pulsanti danger + secondary; focus su Annulla.

## File toccati

- `coordinate_converter Claude.html` (markup, CSS, JS Range Rings, i18n IT/EN/FR).

## Funzioni / regioni toccate

- Stato: `_rrPendingDelete` vicino a `_rrPanelEscNotice`.
- `rrClearMsgs`, `rrShowError`, `rrShowOk` — azzerano eventuale pending insieme ai messaggi o alla conferma.
- `rrSyncRangeRingsOperativeInfo` — ritorno anticipato se c’è pending.
- Nuove: `rrClearPendingDelete`, `rrRenderDeleteConfirmUI`, `rrRequestDeleteSet`, `rrRequestDeleteSelected`, `rrExecutePendingDelete`, `ensureRangeRingsDeleteConfirmWired`.
- Rimosso: `rrDeleteSet` (duplicato; delete solo via `rrDeleteSetIds`).
- `ensureRangeRingsBatchBarWired`: click batch → `rrRequestDeleteSelected` (no `window.confirm`).
- `bindRangeRingsUI`: click riga → `rrRequestDeleteSet`; `ensureRangeRingsDeleteConfirmWired`; `toggle` sezione.
- `bindHotkeys` (Esc), `closeRangeRingsPanel`, `renderRangeRingsPanel` / `renderRangeRingsList` (lista vuota).
- Rinomina riga: ancora `window.confirm` (non richiesto in questo intervento).

## 5F

Non implementato (confermato).

## Verifiche eseguite (automazione)

- `node --check` su script inline (range righe del `<script>` principale).
- `git diff --check -- "coordinate_converter Claude.html"` (eseguire in sessione).

## Rischi residui

- Rinomina con `window.confirm` resta disallineata dagli standard “nessun confirm nativo”; eventuale follow-up interno.
- `bindRangeRingsUI` e `ensureRangeRingsDeleteConfirmWired` devono eseguirsi a init con `#rrDeleteConfirm` in DOM (come le altre RR).

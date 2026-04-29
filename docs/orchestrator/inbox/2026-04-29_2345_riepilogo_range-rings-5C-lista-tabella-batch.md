# Riepilogo — Range Rings blocco **5C** (lista tabellare + batch)

**Data:** 2026-04-29.

## Obiettivo

Lista set Range Rings allineata ai pattern **Saved Tracks** / tabella: checkbox + select-all, indicatore visibilità (solo lettura), nome con rename inline (Enter/blur → `change`, conferma `confirm`, Esc via `ensureGisInlineRenameKeyboardHooks` + `dataset._prevRrName`), colonne centro / anelli / quando, azioni Centra (fly-to corona max), GeoJSON, Elimina. Toolbar batch: mostra/nascondi selezionati, mostra solo selezionati, mostra tutti, nascondi tutti, elimina selezionati (con conferma), esporta selezionati (`exportSelectedRangeRingSetsGeoJSON`). Rimosso pulsante duplicato «Esporta selezionati» dalla riga azioni sopra la lista (spostato in batch).

## File modificati

- `coordinate_converter Claude.html` — HTML `#rrBatchBar` + wrap `.rr-table-wrap`; CSS `#sec-rangerings .rr-table*`, `.rr-batch-bar`; JS: `rrMapVisible`, `flyToRangeRingSetById`, `rrApplyVisibilityIds` / `rrApplyVisibilityOnlySelected` / `rrApplyVisibilityAll`, `rrDeleteSetIds`, `syncRangeRingsSelectAllState`, `syncRangeRingsBatchBar`, `ensureRangeRingsBatchBarWired`; `renderRangeRingsList` riscritta (tabella); delegazione `#rrList` (focusin/change/click); `bindRangeRingsUI` (rimosso listener `rrExportSelectedBtn`); `ensureGisInlineRenameKeyboardHooks` esteso a `[data-rr-rename]`; i18n IT/EN/FR + `tip.rangeRings*`.

## Non toccato

- `renderRangeRingsOverlay`, pick centro, modello persistito `state.rangeRingSets[]` (shape invariata), Mappe Offline, Track, Waypoint core, ecc.

## QA locale

- `git diff --check -- "coordinate_converter Claude.html"`: ok.
- Estratto JS righe script inline `8358–34739`, `node --check`: ok.

## Rischi residui

- `git diff --stat` sul monolite può risultare molto grande se il working tree conteneva già altre modifiche non committate rispetto all’indice.
- Conferma rename con `window.confirm` come Saved Tracks (coerente con richiesta).

## Prossimo passo

- Blocchi **5D** (label overlay), **5E**, **5F** secondo piano inbox `2026-04-29_2130_plan_range-rings-next-ui-label-autocreate-drag.md`.

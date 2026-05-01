# Pass 5 Step D.2 — Astro waypoint picker: colonne + ordinamento (monolite locale)

**Data:** 2026-05-01 (timestamp `1240`).

## Cosa è stato fatto

- **Stato transient** (nessun `localStorage`): `state.astroWpPickerCols` `{ mgrs, when, icon, notes, meta }`, `state.astroWpPickerSort` `{ key, dir }`, `state.astroWpPickerColsMenuOpen`.
- **Helper:** `astroEnsureWpPickerUiState`, `astroCloseWpColsPopover`, `astroToggleWpColsPopover`, `astroSyncWpColCheckboxes`, `astroSortWpPickerRows` (ordinamento stabile con tie-break su `id`).
- **`astroIndexPickerWaypoints`:** aggiunti `whenTs` (updated/created), `metaStr` (from/type/locality) per colonna e ricerca.
- **`astroFillWaypointPicker`:** flusso **filtra → ordina → cap 50**; tabella HTML con header cliccabili (`data-astro-wp-sort`), indicatori ▲/▼, `aria-sort` su colonne ordinabili; colonne opzionali condizionate da `astroWpPickerCols`; colonna **Usa** sempre presente; **Nome** e **Coordinate** sempre in tabella (nessuna checkbox per nasconderle).
- **UI “Colonne”:** bottone `#astroWpColumnsBtn`, popover `#astroWpColumnsPopover` con checkbox; click fuori (delegato su `#astroWaypointPicker`) chiude il popover; **Esc** in `bindHotkeys` e listener GIS: se menu colonne aperto chiude solo il menu; altrimenti chiude il picker come prima.
- **CSS:** toolbar `.astro-wp-search-row`, popover assoluto, `.astro-wp-table-wrap` scroll orizzontale, tabella compatta.
- **i18n IT/EN/FR:** `astro.wp.columns`, `astro.wp.columnsTip`, `astro.wp.col.*`, `astro.wp.sortAsc`/`sortDesc`, `tip.astro.wp.sort`, `tip.astro.wp.columns`.

## Non implementato

Favorite, Step E, «Mostra sulla mappa», CRUD waypoint nel picker, persistenza colonne/sort, modifica `state.mapWaypoints` / `lastResult`, cronologia, permalink, `renderResults`.

## Test automatici

Eseguiti in sessione: `git status` solo monolite; nessun `<script src>` / `type="module"`; conteggio script 2/2; `node --check` OK sui due blocchi inline non greedy.

## Test browser

**Non eseguiti** in agente. Checklist: colonne toggle, sort per nome/data/coord, ricerca+sort, Esc menu vs picker, Usa/Calcola, RR/Astro pick.

## Motivo esclusione monolite dal commit memoria

Policy + richiesta utente: commit memoria **solo** `docs/orchestrator/**`.

## Prossimo passo

Smoke manuale D.2; Step E o **`finito`** a fine giornata.

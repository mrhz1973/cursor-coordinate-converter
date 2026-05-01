# Riepilogo — Range Rings Blocco 1 UI/UX (implementazione)

**Data:** 2026-05-01  
**Stato repo:** modifiche **solo in working tree**; **nessun commit/push** in questo blocco (per richiesta esplicita: pubblicazione con **`finito`** o comando dedicato).

## Cosa è stato implementato

1. **Pulsante Rings sulla mappa:** icona più grande (`.trr-btn` / `.trr-ico`), solo simbolo ◎; **toggle** open/close tramite `gisToolButtonToggle` + aggiornamento `trackSyncPickModeUi` per `aria-pressed` / `.active`.
2. **Menu Strumenti:** rimossi tile Range Rings dalla griglia «Altri strumenti» e dalla lista tool-item Info punto (`data-tool-target-sec="sec.rangerings"`). Resta `GIS_TOOL_SECTIONS.rangerings` per fallback programmatico (`activateToolPanel` / `gisNavigateToolTarget`).
3. **Creazione:** `#rrPickMapBtn` e `#rrCreateBtn` nascosti; **`#rrPickCreateBtn`** è primary; default **`1, 5, 10`** km (`#rrDistances` + `km` selezionato).
4. **Lista:** colonna etichetta **Data** (valori i18n `rangeRings.colWhen` IT/EN/FR); rimosso export GeoJSON da riga; azioni **✎** / **⌖** / **✕** con tooltip i18n; delegazione click senza `data-rr-exp`.
5. **Clamp drag solo Range Rings:** `partialMinVisible: 72` in `_rangeRingsPanelLayoutOpts()`, `gisPanelClampRectPartialVisible`, uso in `clampRangeRingsPanelRect`, `gisPanelAttachDrag` e `gisPanelAttachResize` **solo** se `opts.partialMinVisible` è definito. **`gisPanelClampRect` globale invariato** → Track/Waypoint/Convert/Layers/Favorites/Search non cambiano comportamento.
6. **Import/Export:** nessun redesign; nessuna modifica a formati/builder/logica; confermati bottoni non-primary nella sezione esistente.
7. **Rename:** `#rrInfo` mostra `rangeRings.notice.renamePending` durante conferma rinomina (`rrRenderRenameConfirmUI` + `rrSyncRangeRingsOperativeInfo`).
8. **i18n nuove/aggiornate:** `rangeRings.notice.renamePending`, `tip.rangeRingsEditIcon`; `rangeRings.colWhen` → Data/Date/Date.

## Non toccato (conferma)

- `hydrateMapTiles`, `_mapTileGen`, `AbortController`, `syncOfflineDeltaViewportHints`, IndexedDB tile, Mappe Offline core, Misura, Track core, Waypoint core, reset, OPSEC, GPS, geocoding.
- Fix **`rrCancelPendingRename`** (render lista solo se rename pendente): **inalterato**.
- Nessun logging debug / ingest.

## Funzioni / regioni principali

- `gisToolButtonToggle`, `openRangeRingsToolFromMap`, `trackSyncPickModeUi`, listener `rangerings-open` in `renderTileMap`
- `gisPanelClampRectPartialVisible`, `gisPanelAttachDrag` / `gisPanelAttachResize` (branch `partialMinVisible`)
- `_rangeRingsPanelLayoutOpts`, `clampRangeRingsPanelRect`
- `openRangeRingsFloatingPanelGis`, `closeRangeRingsPanel`
- `renderRangeRingsPanel`, `renderRangeRingsList`, `bindRangeRingsUI`
- `rrSyncRangeRingsOperativeInfo`, `rrRenderRenameConfirmUI`

## QA automatizzato

- `git diff --check -- coordinate_converter Claude.html`: OK  
- `node --check` su JS estratto dal monolite: OK  

## QA manuale

Da eseguire in browser (GIS mode): toggle pulsante Rings, lista vuota, pick & crea con default km, rename + annulla, drag pannello RR verso bordo viewport, export da toolbar batch/I-O (non da riga).

## Rischi residui

- Ingresso RR solo da pulsante mappa (o fallback codice senza tile drawer): accettato da piano.
- Clamp parziale RR: regola minima `partialMinVisible`; estremi viewport molto piccoli da verificare a mano.

## Prossimo passo

- Commit/push quando autorizzato (**`finito`** o richiesta esplicita); poi **`aggio`** in ChatGPT.
- Blocco successivo opzionale: drag avanzato anelli (5F).

## Riferimento piano

`docs/orchestrator/inbox/2026-04-30_2345_plan_range-rings-ui-standardization.md`

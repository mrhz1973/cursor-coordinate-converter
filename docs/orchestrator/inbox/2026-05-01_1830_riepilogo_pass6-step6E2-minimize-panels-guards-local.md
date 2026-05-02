# Riepilogo — Pass 6 Step 6E.2 (minimizza pannelli GIS + guard ratificate)

**Data:** 2026-05-01  
**Ambito:** `coordinate_converter Claude.html` (monolite) — **solo working tree locale**; **non incluso** nel commit autosync memoria (policy default).

## Cosa è stato fatto

1. **Pannelli con minimizza + notice blocco** (stesso pattern Traccia/Waypoint): `#favoritesPanel`, `#layersPanel`, `#rangeRingsPanel`, `#astroPanel` — header `app-modal-head-actions`, pulsante `−` (`data-role` dedicato), paragrafo notice `gis-modal-minimize-notice` + `aria-live="polite"`.

2. **Core minimizza:** `gisMinimizePanel` esteso a `favoritesPanel`, `layersPanel`, `astroPanel`, `rangeRingsPanel`; rimosso il ramo che ignorava tutto fuori track/waypoint.

3. **Guard (nessuna chiusura automatica di sub-dialog/picker):**
   - **Preferiti:** `gisFavoritesMinimizeBlocked()` → `#favInlineConfirmBar` visibile (`!hidden`).
   - **Mappe:** `gisLayersMinimizeBlocked()` → `#offlineDraftWarnDialog` con `.open`.
   - **Astro:** `gisAstroMinimizeBlocked()` → `#astroWaypointPicker` o `#astroFavoritePicker` con `.open`.
   - **Range Rings:** `gisRangeRingsMinimizeBlocked()` → `#rrSourcePickerDialog.open` **oppure** `#rrDeleteConfirm` / `#rrBatchBar` non `hidden`.

4. **Notice:** `GIS_MIN_BLOCKED_MAP` + `gisFlashMinimizeBlockedNotice`; `gisHideAllPanelMinimizeNotices` (sostituisce la vecchia funzione solo track/waypoint). Chiavi i18n IT/EN/FR: `favoritesPanel.minimizeBlockedSubdialog`, `layersPanel.minimizeBlockedSubdialog`, `astroPanel.minimizeBlockedSubdialog`, `rangeRingsPanel.minimizeBlockedSubdialog` + etichette dock `gis.minimized.favorites|layers|astro|rings`.

5. **Ripristino:** `gisRestoreMinimizedPanel` — rami layout/clamp/sync per i quattro pannelli; `GIS_MIN_FOCUS_MAP` per focus accessibile post-restore.

6. **Apertura:** `openFavoritesPanel`, `openLayersPanel`, `openRangeRingsFloatingPanelGis`, `openAstroFloatingPanelGis` — se già aperti ma minimizzati → `gisRestoreMinimizedPanel` + wire esistente.

7. **Chiusura:** `closeFavoritesPanel`, `closeLayersPanel` (dopo branch draft OK), `closeRangeRingsPanel`, `closeAstroPanelCore` → `gisClearPanelMinimizeUi(...)`.

8. **Esc:** per favorites/layers/astro/range rings — se `gisPanelIsMinimized(...)` → **return** (non chiudere il pannello da Esc, coerente con track/waypoint).

9. **Drag:** `ignoreSelector` aggiornato in `attachFavoritesPanelFloatingGis`, `attachLayersPanelFloatingGis`, `attachAstroPanelFloatingGis`, `attachRangeRingsPanelFloatingGis` per il pulsante minimizza.

10. **`gisInit`:** listener click once-bound sui quattro pulsanti minimizza.

11. **Waypoint sulla mappa:** `trackSyncPickModeUi` e template `renderTileMap` — bottone Waypoint **active** se il modal `#waypointModal` è **`.open`** in GIS (sessione aperta incluso minimizzato). Dopo minimizza/restore: `trackSyncPickModeUi()` da `gisMinimizePanel` / `gisRestoreMinimizedPanel`.

## Non toccato (per vincolo utente)

GPS, Converti, OPSEC, tile/cache, geocoding, IndexedDB, schema dati, `localStorage`, `state.lastResult`.

## QA eseguito

- Due blocchi `<script>` invariati come struttura; nessun `<script src>`, nessun `type="module"`.
- `node --check` OK su estratto **9598–9724** (SunCalc) e **9728–41284** (core).
- **Test browser:** non eseguiti in ambiente Cursor (checklist manuale: minimizza/restore per ogni pannello; prova guard con conferma inline preferiti, dialog bozza offline, picker Astro, picker RR + delete confirm + batch bar; Esc con pannello minimizzato; bottone Waypoint sulla mappa con waypoint minimizzato).

## Git (post-modifica)

- `git status --short`: `M coordinate_converter Claude.html`
- `git diff --stat`: ~242 insertions, ~21 deletions (ordine di grandezza al momento della pubblicazione memoria)

## Commit / push

- **Monolite:** non committato in questo step.
- **Memoria:** commit selettivo `docs/orchestrator/**` con messaggio tipo `docs: memoria Pass 6 Step 6E2 minimize panels guards local`.

## Prossimo passo consigliato

Smoke manuale in browser; quando autorizzato, commit principale del monolite su `main`.

# Pass 6 Step 6E.1 — Pilot minimizza `#trackModal` + `#waypointModal` (monolite locale)

**Data:** 2026-05-02  
**File:** [`coordinate_converter Claude.html`](../../coordinate_converter Claude.html) — **non committato** nell’autosync memoria (policy).

## Ratifica utente

- Sub-dialog **non** chiudono automaticamente; pannello padre **non** minimizza se sub-dialog operativo aperto; **notice interna** (`role="status"`, `aria-live="polite"`).
- **Waypoint:** blocca se `#waypointImportDialog` o `#waypointExportDialog` `.open` → `waypointModal.minimizeBlockedSubdialog`.
- **Traccia:** blocca se `#trackExportDialog`, `#trackSaveNameDialog`, `#trackClearCurrentDialog`, `#trackUnsavedCloseDialog` `.open` → `trackModal.minimizeBlockedSubdialog`.

## Audit `<dialog>` (GIS)

| Panel | Apertura GIS | Note |
|-------|----------------|------|
| `#trackModal` | `show()` | `aria-modal="false"` in markup; non-modale. |
| `#waypointModal` | `show()` in GIS | `aria-modal="false"` in GIS. |

**Listener:** `cancel` + backdrop → close reale (`closeTrackModal` / `closeWaypointModal`); **nessun** `dialog.close()` nel percorso minimizza.

## Strategia tecnica

- **Sì:** classe **`gis-panel-minimized`** su `<dialog>` ancora **`open`**, CSS `display: none !important` (`dialog.app-modal.gis-panel-minimized`).
- **No** `dialog.close()` sul minimizza.

## Helper creati

`gisPanelIsMinimized`, `gisWaypointModalBlockingSubdialogsOpen`, `gisTrackModalBlockingSubdialogsOpen`, `gisFlashMinimizeBlockedNotice`, `gisHideBothTrackWaypointMinimizeNotices`, `gisRemoveFromMinimizedDock`, `gisRenderMinimizedDock`, `gisClearPanelMinimizeUi`, `gisMinimizePanel`, `gisRestoreMinimizedPanel`; stato **`_gisMinimizedPanels`** (runtime, non persistito).

## Dock

- **`#gisMinimizedDock`**: `position: fixed`, `top: calc(var(--gis-topbar-h, 56px) + 8px)`, `right: 16px`, **`z-index: 23`** (sotto floating 24–29).
- Vuota: `hidden`, nessun DOM fantasma utile.

## Restore

- **Traccia:** `gisPanelBringToFront` + `applyTrackModalSavedSize` / `applyTrackModalSavedPosition` / `clampTrackModalRect` / `gisPanelSyncBodySize`.
- **Waypoint:** `gisPanelBringToFront` + `gisPanelApplyLayout` + `clampWaypointModalRect` + `gisPanelSyncBodySize`.

## Close reale

`gisClearPanelMinimizeUi` in **`closeWaypointModal`** e **`_closeTrackModalCore`**: rimuove classe + chip dock.

## Esc globale

Waypoint/Traccia: **skip** chiusura se `gisPanelIsMinimized` (non interferisce con pannello nascosto).

## Focus

- Minimizza: focus sul chip dock se il focus era dentro il dialog; altrimenti nessuno spostamento forzato.
- Ripristina: primo elemento focusabile nell’header, fallback pulsante minimizza.

## i18n aggiunte

`tip.panelMinimize`, `tip.panelRestore`, `gis.minimizedDock`, `gis.minimized.track`, `gis.minimized.waypoint`, `waypointModal.minimizeBlockedSubdialog`, `trackModal.minimizeBlockedSubdialog` (IT/EN/FR).

## Non fatto (scope)

- **6E.2**, **6D**, hotkey minimizza, persistenza, altri pannelli (Preferiti/Mappe/Astro/RR).

## QA automatico

- **Script:** 2×`<script>` / 2×`</script>`; nessun `<script src>` / `type="module"`.
- **`node --check`:** OK su estratti **9502–9628** e **9632–40627** (range aggiornati post-edit).

## Test browser

**Non eseguiti** in Cursor; checklist obbligatoria utente (sub-dialog block + minimizza normale senza sub-dialog + Esc + dock).

## Diff baseline locale

`diff -u /tmp/goi-gis-before-6E1.html` … → match `favoritesPanel`/`layersPanel`/`astroPanel`/`rangeRingsPanel`: solo contesto CSS commento `#layersPanelClose` (nessuna modifica funzionale richiesta a quei pannelli).

## Prossimo passo

Smoke manuale checklist utente; poi **6E.2** o **6D** o **`finito`** / commit monolite quando autorizzato.

## Commit memoria

- **`59e6158`** — `docs: memoria Pass 6 Step 6E1 minimize track waypoint pilot local`
- Push: **riuscito**

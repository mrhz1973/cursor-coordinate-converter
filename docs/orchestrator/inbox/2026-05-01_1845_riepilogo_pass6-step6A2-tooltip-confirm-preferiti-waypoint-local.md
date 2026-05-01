# Riepilogo — Pass 6 Step 6A.2 (tooltip Preferiti + conferme allineate a RR/Offline)

**Data:** 2026-05-01  
**Monolite:** `coordinate_converter Claude.html` — **solo locale**, **non** incluso nel commit memoria.

## Task 0 — Sanity

- **`git status --short`:** atteso solo `M coordinate_converter Claude.html` (nessun altro file modificato oltre al monolite al momento dell’intervento).
- **Marker:** `renderFavorites`, `fav-row-actions`, `favorites-modal-table`, `favInlineConfirmBar`, `wpDeleteOneBar`, `data-tip` / `data-i18n-tip`, `favoritesPanelBody`, tooltip offline (`offa-actions`, `offline-area-tip-portal`), conferme RR (`rr-delete-confirm-box`), tracce salvate (`#savedTracksMount` tooltip).

## Causa tooltip Preferiti non leggibili

1. **`#sec-favorites #favorites-list .favorites-modal-table { overflow: hidden; }`** — creava **clip** sui pseudo-elementi `::after` / `::before` dei tooltip `[data-tip]` sulle azioni in tabella.  
2. **Stacking / sticky thead** — senza `z-index` elevato sulla riga in hover e senza tooltip **sotto** il bottone (come lista offline), i fumetti restavano sotto righe successive o venivano coperti.  
3. **`gisPanelSyncBodySize`** — sul corpo modal, **`overflow-x: hidden`** inline poteva limitare i tooltip orizzontali: aggiunto **`#favoritesPanelBody.app-modal-body { overflow-x: visible !important; }`** come già fatto per **`#layersPanelBody`**.  
4. **Contrasto/z-index nel dialog** — allineato al pattern **`#waypointModal`**: variabili `--tooltip-*` locali e **`z-index: 5000`** sui pseudo tooltip nel **`#favoritesPanel.favorites-panel`**.

## Fix tooltip applicato (sistema riusato)

- **Stesso meccanismo globale** `[data-tip]` + **`syncI18nInRoot`** / `data-i18n-tip` (nessun portal nuovo per Preferiti: la lista offline usa portal **solo** per alcuni comandi `Usa area` / `Centra`, non per tutte le azioni).  
- **Override scoped** come **`.offline-areas-list .offa-actions [data-tip]`**: tooltip **sotto** il bottone, **`z-index: 8000`**, riga in **`hover` / `focus-within`** con **`position: relative; z-index: 4`**.  
- **Tabella:** `overflow: visible` al posto di `hidden`.  
- **`.favorites-table-wrap`:** `overflow-y: visible` accanto a `overflow-x: auto`.

## Pattern conferme / notifiche (analisi)

### A — Tracce

- Conferme **strutturate in `<dialog class="app-modal">`** (es. `trackUnsavedCloseDialog`, `trackClearCurrentDialog`) con testo + gruppo azioni **`.offline-draft-warn-actions`** (flex, gap, allineamento a destra).  
- **Tracce salvate in modal:** tooltip tabella con regole dedicate su **`#savedTracksMount.saved-tracks-wrap`** (outer overflow visible, tooltip sotto / a destra).

### B — Mappe offline / online

- **Pannello `#layersPanelBody`:** `overflow-x: visible !important` per convivere con **`gisPanelSyncBodySize`**.  
- **Lista aree:** tooltip azioni come sopra (`offa-actions`); alcuni controlli con **`.offline-area-tip-portal`** (fixed, `z-index: 30000`).

### Riferimento scelto

- **Range Rings — conferme inline nel pannello:** **`#rrDeleteConfirm`** / **`#rrRenameConfirm`** con classi **`.rr-delete-confirm-box`**, **`.rr-delete-confirm-msg`**, **`.rr-delete-confirm-actions`** (bordo danger/accent, padding, pulsanti danger/primary + annulla).

## Allineamento implementato

### Preferiti — `favInlineConfirmBar`

- Classi **`gis-rr-confirm-skin`**, **`gis-rr-confirm-msg`**, **`gis-rr-confirm-actions`** sull’HTML.  
- **`fav-inline-confirm--rename`** aggiunta/rimossa in JS su rename vs delete (skin **accent** vs **danger**, come **`rr-rename-confirm-box`** vs delete).

### Waypoint — `#wpDeleteOneBar`

- Stesse classi **`gis-rr-confirm-skin`** / messaggio / azioni.  
- Margine compatto: **`#waypointModalPanel .wp-inline-confirm.gis-rr-confirm-skin`**.

## Cosa NON è stato toccato

- Selettore **formato coordinate** Preferiti (`#favListCoordFmt` / `favoritesListCoordDisplayMode` / `syncFavCoordFmtSelectOptions`).  
- Schema dati, `localStorage`, `state.favorites`, `state.lastResult`, `state.lastPoint`, cronologia, permalink, SunCalc/WMM/OLC/QR, OPSEC/tiles/IndexedDB, Step 6B/6C, RR polish.

## QA automatica

- Nessun `<script src>` / `type="module"`.  
- Due blocchi `<script>` / `</script>`.  
- **`node --check`** OK su estratti **9173–9293** (SunCalc) e **9297–39542** (main).

## Test browser

- **Non eseguiti** in sessione; checklist nel prompt Task 7 per smoke manuale.

## Commit memoria

- **`9b97bbc`** — `docs: memoria Pass 6 Step 6A.2 tooltip conferme local` (push riuscito).  
Monolite **escluso**; niente `git add .`.

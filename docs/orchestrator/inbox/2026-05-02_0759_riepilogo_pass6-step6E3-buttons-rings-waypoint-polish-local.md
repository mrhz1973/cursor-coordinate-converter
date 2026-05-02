# Riepilogo — Pass 6 Step 6E.3 (Range Rings minimizza + Waypoint active + toolbar/mappa)

**Data:** 2026-05-02  
**File:** `coordinate_converter Claude.html` — modificato **solo in locale**; **non committato** (come richiesto).

## Range Rings minimizza — fix **sì**

**Causa:** `gisRangeRingsMinimizeBlocked()` trattava **`#rrBatchBar`** come blocco se `!hidden`. In **`syncRangeRingsBatchBar`** la barra è impostata con `batchBar.hidden = !anyRow`: con **almeno un set Range Rings** nel progetto l’utente, `anyRow` è sempre vero → barra sempre visibile → **minimizza sempre bloccato** (falso positivo). Non era un problema di pulsante/listener/markup.

**Fix:** rimosso il controllo su **`#rrBatchBar`**; restano blocco reale per **`#rrSourcePickerDialog.open`** e **`#rrDeleteConfirm`** non nascosto. Commento inline nel codice. Testi i18n **`rangeRingsPanel.minimizeBlockedSubdialog`** (IT/EN/FR) aggiornati senza riferimento alla barra batch.

## Waypoint active persistente — **sì**

**Scelta:** dopo ogni ridisegno mappa da **`renderMiniMap`** e da **`refreshTileMapForTrackUi`** (ramo con/senza `lastPoint`) viene chiamato **`trackSyncPickModeUi()`**, così classe **`.active`** / **`aria-pressed`** su **`.twpt-btn`** restano allineati a **`state.waypointsModalOpen`**, **`state.waypointPickMode`** e **`#waypointModal.open`** anche dopo **`renderTileMap`**. Con minimizza, il dialog resta `open` → resta active.

**CSS:** **`.twpt-btn.active`** portato allo stesso blu pieno degli altri tool (**`#2563eb`**, testo bianco) per coerenza visiva “illuminato”.

## Active tool/pannello blu — **sì** (con eccezioni semantiche)

**Modifiche CSS principali:**

- **`.ttrk-btn.active`**: da indigo a **`#2563eb`**.
- **`.trr-btn`**: icona/hover neutri blu; **`.trr-btn.active`** **`#2563eb`** (prima verde).
- **`.tg-btn.active`** (globale, griglia/MGRS): da ambra a **`#2563eb`**; in **`.tile-ctrls`** hover/active sovrascritti coerenti.

**Eccezioni lasciate intenzionalmente:**

- **`.tgps-btn.gis-gps-fix-active`**: verde fix GPS **non toccato** (nessuna modifica a funzioni GPS elencate nel vincolo).
- **`.tcov-btn.active`**: verde copertura offline **non toccato** (semantica cache/copertura).

## Sfondo toolbar/mappa uniformato — **sì**

Nella colonna **`.tile-map .tile-ctrls`**: **`tile-size`** (half/full), **`tile-zoom`** (+/−), **`tg-btn`** (MGRS), **`tile-layers .tlayer-btn`** — fondo **`rgba(255,255,255,.92)`**, bordo leggero, ombra soft, hover **`#eff6ff`**, coerente con misura/traccia/waypoint nella stessa colonna.

## Vincoli — conferme

- **GPS:** nessuna modifica a `requestGisMapCurrentLocation`, `renderGisMapGpsOverlay`, `_gisMapGpsFixTransient`, badge GPS.
- **Converti:** nessuna modifica a `#convertModal` / logica Converti.
- **Schema / `state.lastResult` / localStorage / persistenza:** non modificati.
- **OPSEC / geocoding / tile logic / IndexedDB:** non toccati (solo CSS classe `.tile-map` e stringhe i18n).
- **`state.savedTracks` / `state.mapWaypoints` / `state.favorites`:** non modificati.

## QA automatico

- `git status`: monolite modificato, orchestratore da committare separatamente.
- `<script` / `</script>`: **2 / 2**.
- Nessun `<script src>`, nessun `type="module"`.
- **`node --check`**: OK blocco **9654–9780** (SunCalc), **9784–41342** (core).

**Diff baseline:** `/tmp/goi-gis-before-6E3.html` vs monolite — filtro token funzionali GPS/Converti/state: solo CSS/HTML contesto e stringhe i18n (match “tile” da nomi classe `.tile-map` / commenti, non logica tile).

## Test browser

**Non eseguiti** in Cursor. Checklist: Task 7 del prompt utente.

## Non implementato

- Pass 6D globale, `finito`, commit monolite, hotkey, chip trascinabili.

## Commit memoria

Messaggio: `docs: memoria Pass 6 Step 6E3 buttons rings polish local` — solo `docs/orchestrator/latest.md` + questo file inbox; **escluso** `coordinate_converter Claude.html`.

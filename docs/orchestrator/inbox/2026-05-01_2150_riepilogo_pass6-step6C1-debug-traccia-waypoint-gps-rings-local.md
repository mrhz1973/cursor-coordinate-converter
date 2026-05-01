# Pass 6 Step 6C.1 — debug Traccia / Waypoint, context menu tracce, icona Range Rings, GPS mappa (monolite locale)

**Data:** 2026-05-01  
**Scope:** solo `coordinate_converter Claude.html` (working tree locale; **non** nel commit memoria).

## 1. Causa bug: aprire Traccia chiudeva Waypoint

- **`openTrackModal()`** invocava **`closeWaypointModal()`** nella sequenza di prima apertura del pannello Traccia (e/o in ramificazioni correlate), così l’apertura Traccia forzava la chiusura del modal Waypoint.
- **Fix:** rimossa la chiamata a **`closeWaypointModal()`** da **`openTrackModal`**; Traccia e Waypoint restano **due dialog GIS non-modali** indipendenti, con **bring-to-front** già gestito da **`gisPanelAttachBringToFront` / `gisPanelBringToFront`**.

## 2. Context actions su tracce salvate (tabella `#savedTracksMount`)

- **Implementato sì:** menu contestuale **`#trkSavedCtxMenu`** (stile **`wpt-ctx-menu`**), wiring una tantum su **`#savedTracksMount`** da **`renderSavedTracksList`** → **`ensureSavedTracksCtxMountWired(mount)`**.
- **Desktop:** tasto destro su riga **`tr[data-saved-row]`** → `contextmenu` + `preventDefault`.
- **Touch / penna:** pressione lunga **~550 ms** solo per **`pointerType` `touch` / `pen`** (evitato long-press col mouse sulla riga, che interferirebbe con rename/click).
- **Movimento:** durante il timer, spostamento **> 14 px** annulla il long-press (stesso spirito del menu waypoint).
- **Azioni:** **Apri Traccia** (`openTrackModal` + bring-to-front **`#trackModal`**), **Modifica** (`beginEditSavedTrackById` — che già riapre il modal se serve), **Centra** (`flyToSavedTrackById`), **Elimina** (`deleteSavedTracksByIds([id])` → **`window.confirm`** come nel flusso esistente della tabella).
- **Chiusura:** click fuori (`mousedown` capture globale), **Esc** (priorità in **`bindHotkeys`** dopo draft track waypoint).

## 3. Icona pulsante Range Rings

- **Sì:** SVG **`rangeRingsMapBtnSvg`** — tre anelli principali (r 9 / 6 / 3) **più due anelli interni** aggiuntivi (r **1.85** e **0.85**), solo icona pulsante mappa; **nessuna** modifica alla logica RR né agli overlay mappa.

## 4. GPS «posizione attuale» sulla mappa GIS

- **Implementato sì:** pulsante **`#btnGisMapMyLocation`** (`data-role="gis-map-mylocation"`) nella toolbar mappa GIS; handler **`requestGisMapCurrentLocation()`** → **`navigator.geolocation.getCurrentPosition`** (stesso **`GEO_OPTIONS`** del flusso esistente), **nessun** `watchPosition` (assente nel file), **nessun** avvio silenzioso; controlli **`isSecureContext`** / API assente come **`refreshGeolocationBarriers`**; successo → **`state.viewCenter`** + zoom, **`renderTileMap`**, **`saveStore()`** (solo campi mappa già persistiti), **nessun** `renderResults` / **`state.lastResult`** / cronologia / permalink.

## 5. Vincoli richiesti

- **Nessun** live tracking GPS; **nessun** GPS silenzioso all’apertura app/modal.
- **Nessuna** modifica schema `savedTracks` / **`state.lastResult`** / nuove chiavi `localStorage`.
- **Non** toccati: SunCalc/WMM/OLC/QR, OPSEC geocoding/tile/IndexedDB, Step **6D** globale.

## 6. QA automatico (Cursor)

- `git status --short`: atteso **`M coordinate_converter Claude.html`** (+ file memoria dopo commit).
- `git diff --stat`: monolite con diff ampio locale.
- Nessun `<script src>`; nessun `type="module"`.
- Conteggio: **2**× `<script>`, **2**× `</script>`.
- **`node --check`**: OK su estrazione **non greedy** blocchi **9238–9364** (SunCalc) e **9368–39850** (core).

## 7. Test browser

- **Non eseguiti** in ambiente Cursor; checklist manuale come da prompt Task 7 (Waypoint+Traccia aperti, context menu, conferma delete, RR, GPS solo al click, Astro/offline spot).

## 8. Cosa non è stato fatto

- Step **6D** globale; **`finito`**; commit/push del **monolite**; `git add .`.

## 9. Commit memoria orchestratore (solo docs)

- Messaggio: **`docs: memoria Pass 6 Step 6C1 debug traccia local`**
- File: **`docs/orchestrator/latest.md`**, questo **`inbox`**.
- **`coordinate_converter Claude.html` escluso** dal commit.

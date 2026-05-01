# Pass 5 Step E.1 — Polish picker Astro Favoriti/Waypoint (monolite solo locale)

**Data:** 2026-05-01  
**File:** `coordinate_converter Claude.html` (locale, **non** nel commit memoria)

## 1. Scritta blu “Favoriti” ripetuta

**Causa probabile:** colonna **Meta** costruita da `meta.type` / `meta.raw` / `meta.from` su favoriti salvati dal convertitore o dalla sezione Favoriti: valori ripetuti tipo etichetta tab (`tabs.favorites`, `sec.favorites`, testo “Favoriti” / “Favorites” / …) comparivano su **ogni riga**; in alcuni contesti il testo può essere reso come link/blu da stili globali su stringhe “etichetta”.

**Fix:** introdotte `astroFavNormalizeMetaLabel` / `astroFavIsNoiseMetaLabel`; in `astroIndexPickerFavorites` la colonna usa una stringa **display** filtrata (`dispBits` → `metaStr`), mentre la **ricerca** usa `metaStrSearch` (include ancora `typSrc`, `rawSrc`, `fromSrc` non filtrati per completezza). Escluse esplicitamente chiavi i18n `tabs.favorites` / `sec.favorites` e sinonimi comuni.

## 2. Resize picker Waypoint e Favoriti

- Aggiunti **4 handle** `gis-panel-resize-handle` (nw/ne/sw/se) ai dialog `#astroWaypointPicker` e `#astroFavoritePicker`.
- **Head** con `id` per drag (`astroWaypointPickerHead`, `astroFavoritePickerHead`); **body** con `id` per `gisPanelSyncBodySize`.
- Riutilizzo **`gisPanelAttachDrag`**, **`gisPanelAttachResize`**, **`gisPanelApplyLayout`**, **`gisPanelClampRectPartialVisible`**, **`gisPanelSyncBodySize`**, **`gisPanelAttachBringToFront`** — stesso modello di `#astroPanel` / pannelli GIS.
- CSS: floating `gis-panel-floating` + z-index **28**; ancoraggio handle come `#astroPanel`; `cursor: grab` sui nuovi head; `body:not(.gis-mode)` nasconde handle.
- **`gisPanelBringToFront`**: inclusi `astroWaypointPicker` e `astroFavoritePicker` nella lista pannelli per z-order.
- **`window.resize`** (listener già presente in `gisInit`): clamp + sync body per i due picker se aperti.
- **`gisRefreshI18n`**: dopo refill tabella, clamp + sync se picker aperti in GIS.

## 3. Dimensione tra chiusura e riapertura (solo sessione)

- Chiavi **`gPanelLayouts`**: `astroWpPicker` e `astroFavPicker` ( **non** in `UI_PANEL_KEYS` → **nessun** `localStorage` aggiuntivo; `captureUiState` non le persiste).
- Alla **chiusura**: `astroTeardownAstroPickerFloatingUi` rimuove classe floating e stili inline; **non** cancella `gPanelLayouts[key]`.
- Alla **riapertura**: `wireAstroWaypointPickerFloatingGis` / `wireAstroFavoritePickerFloatingGis` richiama `gisPanelApplyLayout` → se `touched` + w/h presenti (dopo resize/drag), **ripristina** posizione e dimensione.

## 4. Non toccato

- Nessuna nuova chiave `localStorage`; nessuna modifica a `state.favorites` / `state.mapWaypoints` / `state.lastResult`; nessuna feature extra; nessun “Mostra sulla mappa”.

## 5. QA automatici (sessione)

- `git status --short`: atteso solo monolite modificato.
- Nessun `<script src>`; nessun `type="module"`; 2 blocchi `<script>`; `node --check` OK su entrambi (regex non greedy).

## 6. Test browser

**Non eseguiti** in Cursor. Checklist: Favoriti senza ripetizione blu in Meta; resize/chiusura/riapertura; switch Waypoint↔Favoriti; i18n con picker aperto; Esc; Usa/sort/colonne.

## 7. Commit memoria

Solo `docs/orchestrator/latest.md` + questo inbox; messaggio `docs: memoria Pass 5 Step E1 resize picker Astro local`. Monolite **escluso** per richiesta utente.

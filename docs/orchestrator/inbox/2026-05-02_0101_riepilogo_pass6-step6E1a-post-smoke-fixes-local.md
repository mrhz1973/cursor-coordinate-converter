# Pass 6 Step 6E.1a — post-smoke correttivi (monolite solo locale)

## Sintesi

Micro-step dopo smoke **6E.1**: dock minimizzati più visibile + animazioni leggere; **Waypoint close guard** (no `window.confirm`); fix **Esc → La Spezia**; **GPS** centraggio coerente con marker; Import/Export Waypoint **non** toccati.

## File toccati

- **`coordinate_converter Claude.html`** (unico codice; **non committato** in questo step).

## Checklist richiesta (sì/no)

| Voce | Esito |
|------|--------|
| Dock più visibile | **Sì** — barra centrata sotto topbar, chip più grandi, bordo/sfondo/shadow |
| Animazione minimizza/ripristina | **Sì** — pulse dock + chip enter; flash opacity su restore; `prefers-reduced-motion` rispettato |
| Waypoint close guard | **Sì** |
| Nessun `window.confirm` per questo flusso | **Sì** |
| GPS center preciso | **Sì** (allineamento `state.lastPoint` al fix) |
| Nessun `watchPosition` | **Sì** (grep: nessun match) |
| Nessun live tracking | **Sì** |
| Nessuna modifica `state.lastResult` / permalink / cronologia / nuova persistenza | **Sì** |
| Import/Export Waypoint dimming | **Non modificato** |

## Stati Waypoint protetti (close guard)

- `#wpDeleteOneBar` visibile (conferma eliminazione singola).
- `state.waypointPickMode` con modal waypoint aperto.
- `state.trackWaypointDraft` con modal aperto.
- Editor inline `#waypointEditor` visibile con bozza **nuova** non vuota (coordinate, testo campi, icona/colore non default).
- Editor con waypoint **esistente** e DOM/draft **sporco** rispetto a `state.mapWaypoints`.

**Esc:** se la barra interna è aperta → prima **chiude la conferma**; se rischio → mostra barra; altrimenti `waypointModalPerformCloseAndDeactivateTab()` (come X/backdrop tramite `requestWaypointModalClose`).

## Causa bug Esc → La Spezia

- **`bindHotkeys`** (ramo `Escape`), dopo i guard GIS parziali, chiamava **`clearForm()`**.
- **`clearForm()`** → **`initMiniMapOnStartup()`** → con `!state.lastResult` → **`renderMiniMap(DEFAULT_MAP_*, …)`** (La Spezia).
- Il listener GIS Esc era registrato **dopo** `bindHotkeys`, quindi il reset avveniva **prima** della chiusura modali.

## Fix Esc

- In **`gis-mode`**, il fallback finale **non** chiama più **`clearForm()`**; **`preventDefault()`** + `return` così non si resettano mappa/`lastResult`/permalink.

## Causa GPS non centrato sul marker

- **`requestGisMapCurrentLocation`** impostava **`viewCenter`** e chiamava **`renderTileMap(lat, lon, …)`** ma **non** aggiornava **`state.lastPoint`**.
- **`refreshTileMapForTrackUi()`** preferisce **`state.lastPoint`** e chiama **`renderMiniMap(lp.lat, lp.lon, false)`**, ridisegnando il marker sul punto **stale** mentre il centro restava sul GPS → marker decentrato.

## Fix GPS

- Dopo il fix valido: **`state.lastPoint = { lat, lon }`** (stesso fix GPS) prima di **`renderTileMap`**.

## Animazione / dock (implementazione)

- CSS: `#gisMinimizedDock.gis-minimized-dock` centrato (`left:50%` + `translateX(-50%)`), padding, chip più alti; keyframes **`gisDockPulse`**, **`gisDockChipIn`**, **`gisPanelRestoreFlash`**; `@media (prefers-reduced-motion: reduce)` disabilita animazioni.
- JS: **`gisMinimizePanel`** — pulse dock; **`gisRenderMinimizedDock`** — `requestAnimationFrame` + classe **`gis-dock-chip-enter`**; **`gisRestoreMinimizedPanel`** — classe **`gis-panel-restore-flash`** con timeout cleanup.

## i18n

- **`waypointModal.unsavedCloseTitle`**, **`unsavedCloseMsg`**, **`unsavedCloseCancel`**, **`unsavedCloseDiscard`** — IT / EN / FR.

## Backlog (non implementato)

- **6E.2**: minimizza su Preferiti / Mappe / Astro / Range Rings.
- Chip dock trascinabili, «minimizza tutto», hotkey minimizza/restore.

## QA automatica

- **`git status --short`**: atteso solo `M coordinate_converter Claude.html` (prima dell’intervento orchestratore).
- **`grep <script src>` / `type="module"`**: nessun match.
- **Conteggio `<script>` / `</script>`**: **2 / 2**.
- **`node --check`**: OK su blocchi **9552–9678** e **9682–40837** (range aggiornati post-edit).
- **Diff baseline** `/tmp/goi-gis-before-6E1a.html` vs monolite con `favoritesPanel|layersPanel|astroPanel|rangeRingsPanel`: solo contesto **Esc / astroPanel** rimosso in `bindHotkeys` (nessuna modifica funzionale a quei pannelli).

## Test browser

**Non eseguiti** in questo ambiente. Checklist manuale: vedi prompt Task 8 (dock, guard, Esc, GPS, non-regressione).

## Commit memoria (questo intervento)

- Messaggio: **`docs: memoria Pass 6 Step 6E1a post smoke fixes local`**
- Hash: **`bf86288`** (push `main` riuscito).
- **Solo** `docs/orchestrator/latest.md` + questo file inbox.
- **`coordinate_converter Claude.html` escluso.**

## Prossimo passo consigliato

- Smoke browser su **6E.1a**; poi **6E.2** quando autorizzato, o commit monolite se richiesto.

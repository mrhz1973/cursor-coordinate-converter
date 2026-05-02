# Pass 6 — Step 6E.1b (dock sinistra, minimizza stabile, animazioni, Esc, GPS qualità)

**Data:** 2026-05-01  
**Scope:** solo `coordinate_converter Claude.html` (monolite **non committato** in questo step).  
**Non fatto:** 6E.2, minimizza altri pannelli, chip trascinabili, minimizza tutto, hotkey, `finito`, commit monolite.

## Checklist richiesta

| Voce | Esito |
|------|--------|
| Dock sotto topbar **a sinistra** | **Sì** — `#gisMinimizedDock` / `.gis-minimized-dock`: `left: 16px`, `top: calc(var(--gis-topbar-h, 56px) + 8px)`, `transform: none`, `justify-content: flex-start`, `max-width` con media stretta. |
| Pulsante minimizza stabile/visibile | **Sì** — `.app-modal-min-btn`: bordo/contrasto rinforzati, `::before` colore esplicito, `:active`, tema chiaro separato, `isolation: isolate`. |
| Animazione più visibile | **Sì** — pulse dock / chip enter / restore flash con accento indaco (`#818cf8`) e alone breve; `prefers-reduced-motion` già su dock; aggiunto **riduzione motion** anche su animazioni infinite overlay GPS (`.gis-map-gps-overlay`). |
| Causa Esc → GPS / recentro (audit) | **Principali:** (1) `deactivateTab()` chiamava sempre `refreshTileMapForTrackUi()` alla chiusura di **qualsiasi** tab drawer → redraw completo dopo Esc su tab attivo. (2) Chiusura menu basemap → `renderMiniMap(lastPoint, …)` in percorsi dove il marker (`lastPoint`, es. ultimo fix GPS) non coincideva con la vista se `viewCenter` era stato spostato dal solo pan (meno probabile se GPS aveva allineato entrambi). (3) Esc riduceva sempre mappa ingrandita → `setMapSize("small")` → redraw percepito. |
| Fix Esc applicato | **Sì** — In **GIS**: non si forza più `setMapSize("small")` su Esc; chiusura basemap usa `renderTileMap(lp…)` senza passare da `renderMiniMap` quando `gis-mode`; `deactivateTab` chiama `refreshTileMapForTrackUi()` **solo** se `wasTab === "measure"`. |
| Diagnosi GPS fuori asse | **Sì** — Disallineamento tra matematica **`renderTileMap`** (W/H con `fallbackW` se `#miniMap` ha ancora `clientWidth` 0) e **`tileMapLatLonToPx` / overlay GPS** che usavano `root.clientWidth \|\| 400` e dimensioni `.tile-map` non allineate; il marker principale e il cerchio GPS finivano su griglie leggermente diverse. |
| Fix GPS center preciso | **Sì** — **`gisMapTileMathViewport(root)`** condiviso da `tileMapPxToLatLon`, `tileMapLatLonToPx`, `renderGisMapGpsOverlay`; dopo fix: doppio **`requestAnimationFrame`** prima di `renderTileMap`. |
| Dati qualità GPS | **Sì** — Badge (`setBadge`) via **`formatGisMapGpsInfoBadgeExtra(pos)`**; tooltip/aria su **`#btnGisMapMyLocation`** via **`formatGisMapGpsTipFromTransient`** + **`syncGisMapGpsButtonFromTransient`**; transient arricchito (`tsMs`, altitudine, `altitudeAccuracy`, `heading`, `speed` se validi). |
| Quali dati mostrati | Classe qualità (≤10 m alta, ≤30 m media, >30 m bassa), **± accuracy** orizzontale, **ora fix**, opzionali **alt**, **alt ±**, **heading**, **velocità km/h**. |
| `watchPosition` | **Assente** (grep OK). |
| Live tracking | **No** — solo `getCurrentPosition` su click. |
| `state.lastResult` | **Non modificato** nel flusso GPS mappa. |
| Nuova persistenza / localStorage | **No**. |
| Pannelli 6E.2 | **Non toccati** (`favoritesPanel`, `layersPanel`, `astroPanel`, `rangeRingsPanel` — diff baseline vs `/tmp/goi-gis-before-6E1b.html` senza match funzionali). |
| Backlog annotato | 6E.2 altri pannelli; chip dock trascinabili; minimizza tutto; pannello qualità GPS esteso se richiesto. |

## QA automatici

- `git status --short`: atteso solo `M coordinate_converter Claude.html` (plus docs dopo commit memoria).
- `grep <script src>` / `type="module"`: nessun match.
- Conteggio `<script>` / `</script>`: **2 / 2**.
- `node --check`: blocchi **9572–9698** e **9702–41042** (estratti con range righe) — **OK**.
- Diff baseline 6E.1b vs pannelli non-pilot: **nessun match** su `favoritesPanel|layersPanel|astroPanel|rangeRingsPanel`.

## Test browser

**Non eseguiti** in questo ambiente. Checklist manuale: vedi prompt utente (dock sinistra, minimizza/sub-dialog, animazioni, Esc senza tab vs con Waypoint/Traccia/drawer misura, GPS centraggio e badge).

## File toccati (codice)

- `coordinate_converter Claude.html`: CSS dock / minim-btn / animazioni / reduced-motion overlay GPS; JS `gisMapTileMathViewport`, GPS helpers, `requestGisMapCurrentLocation`, `renderGisMapGpsOverlay`, `bindHotkeys` (Esc GIS), `deactivateTab`, i18n IT/EN/FR nuove chiavi `geo.gps*`.

## Prossimo passo consigliato

Smoke browser su dispositivo reale (GPS + layout stretto); poi eventuale **6E.2** o commit monolite quando autorizzato.

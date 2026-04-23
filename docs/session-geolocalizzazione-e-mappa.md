# 📌 Coordinate converter — mini-mappa, GPS, bbox on-map, tools drawer & offline-first

## 🗓 Data

2026-04-21 (prima stesura) · **aggiornato 2026-04-22** (bbox selection, tools drawer, track builder, offline render, UI polish, mini-guida, overlay copertura offline, pannello offline dockable/floating, delete from map, label smart-corner, **DTG NATO Date-Time Group**, **Geocoding Nominatim + reverse + fallback offline**, header toolbar, pill Località, toggle copertura offline on-map, fix tooltip z-index, auto-open pannello offline per map size) · **checkpoint 2026-04-22 (sera)** — vedi sezione *Checkpoint* in fondo · **checkpoint 2026-04-23** — Cursor Project Rules (`.cursor/rules/`) + `docs/checkpoint.md` — vedi sezione *Checkpoint* in fondo

> File canonico di riferimento: **`coordinate_converter Claude.html`** (HTML standalone unico nel repo). Indice tecnico aggiornabile: **`docs/PROJECT_notes.md`**.

## 🎯 Obiettivo

1. Mostrare la mini-mappa anche **senza** una conversione attiva, partendo dalla posizione dell’utente o da un **centro di fallback** (La Spezia).
2. Aggiungere un flusso completo **«La mia posizione»** e **«Tracking live»** basato su `navigator.geolocation`, con metadati GPS, i18n, vincoli di contesto sicuro (HTTPS/localhost), integrazione con cronologia, favoriti e permalink senza alterare la logica di conversione esistente.

## 🧾 Contesto

- Applicazione **HTML standalone** (`coordinate_converter Claude.html`), convertitore DD/DDM/DMS/UTM/MGRS/Plus Codes e datum italiani su WGS84.
- Nessuna dipendenza esterna per la geolocalizzazione: **Geolocation API** nativa del browser.
- Persistenza locale (`localStorage`), mini-mappa tile/SVG, cronologia sessione, favoriti, permalink `#ll=` / `#mgrs=`.

## 💬 Conversazione sintetizzata

1. **Richiesta iniziale (IT):** caricare la mappa anche senza punto convertito, preferendo la posizione del browser o un centro a La Spezia.
2. **Implementazione bootstrap mappa:** costanti `DEFAULT_MAP_LAT/LON`, `initMiniMapOnStartup()` chiamata da `init()` e da `clearForm()`, con `renderMiniMap` + `renderMapLinks`; in un primo momento era previsto anche `getCurrentPosition` silenzioso per affinare il centro.
3. **Richiesta estesa (PROMPT 1):** pulsanti «La mia posizione» e «Tracking live», metadati GPS, errori i18n, HTTPS/tooltip OPSEC, badge LIVE, Ctrl+G, cronologia con tag `[GPS]`, aggiornamento mappa/UTM in live senza spam di cronologia.
4. **Consolidamento:** rimozione del GPS automatico all’avvio della mappa per evitare **doppia richiesta di permesso** rispetto ai pulsanti espliciti; centro iniziale solo La Spezia.
5. **Follow-up «procedi»:** suggerimento opzionale futuro — `navigator.permissions` per riflettere i cambi permesso in tempo reale.

## ⚙️ Soluzioni proposte

| Area | Soluzione |
|------|-----------|
| Mappa vuota | `initMiniMapOnStartup()`: se `!state.lastResult`, `renderMiniMap` + `renderMapLinks` su La Spezia (~44.1027, 9.8236). |
| Permalink | Se `readPermalink()` → `renderResults`, `lastResult` presente → **non** eseguire il bootstrap mappa (o equivalente: early return). |
| Geolocation one-shot | `getCurrentPosition` con `{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }`, stato UI su `#pasteStatus` + classe `geo-pending`. |
| Live | `watchPosition` con stesse opzioni; prima fix → `pushHistory`; successivi → `renderResults(..., { skipHistory: true })`. |
| Cronologia lingua | `applyLanguage` richiama `renderResults(..., { skipHistory: true })` per evitare duplicati in cronologia. |
| Contesto sicuro | `navigator.geolocation && window.isSecureContext`; altrimenti pulsanti disabilitati e `tip.geoDisabled` / `geo.err.insecure`. |
| Metadati | `meta.gps` + `#gpsMetadata` con precisione, altitudine GPS vs nota terreno Open-Meteo, velocità, heading, timestamp locale/UTC. |

## 🧩 Decisioni prese

- **Centro mappa predefinito:** La Spezia (coordinate fisse accettabili dall’utente).
- **Niente geolocalizzazione silenziosa** all’avvio dopo l’introduzione dei pulsanti: solo **opt-in** esplicito.
- **`renderResults` esteso** con quarto argomento opzionale `opts = { skipHistory }` per live e re-localizzazione UI.
- **`state.geoWatchId`** per tracciare `watchPosition`; `clearWatch` allo stop, Esc/clear, o prima di un nuovo one-shot.
- **i18n** completo IT/EN/FR per stringhe GPS, errori, tooltip, help Ctrl+G.

## 📦 Codice rilevante

### Costanti e bootstrap mappa

```javascript
const DEFAULT_MAP_LAT = 44.1027, DEFAULT_MAP_LON = 9.8236;

function initMiniMapOnStartup(){
  if (state.lastResult) return;
  renderMiniMap(DEFAULT_MAP_LAT, DEFAULT_MAP_LON, true);
  renderMapLinks(DEFAULT_MAP_LAT, DEFAULT_MAP_LON);
}
```

### Opzioni Geolocation e meta

```javascript
const GEO_OPTIONS = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

function buildGpsMetaFromPosition(pos){
  const c = pos.coords;
  return {
    accuracy: c.accuracy,
    altitude: c.altitude,
    altitudeAccuracy: c.altitudeAccuracy,
    speed: c.speed,
    heading: c.heading,
    ts: pos.timestamp
  };
}

function formatGpsRawLine(pos){
  const la = pos.coords.latitude, lo = pos.coords.longitude;
  return "[GPS] " + round(la, 7) + ", " + round(lo, 7);
}
```

### `renderResults` — cronologia condizionale

```javascript
function renderResults(lat, lon, meta, opts = {}){
  const skipHistory = opts.skipHistory === true;
  // ... rendering invariato ...
  if (!skipHistory) pushHistory({ lat, lon, meta });
  renderGpsMetadata(meta);
  updateGeoLiveBadge();
}
```

### Flusso logico (pseudo-codice)

```
ON app init:
  IF permalink loads point → renderResults → STOP bootstrap map
  ELSE initMiniMapOnStartup() → map @ La Spezia
  refreshGeolocationBarriers()

ON "La mia posizione":
  stopLocationTracking()
  IF NOT secureContext OR NOT geolocation → error / disabled UI
  ELSE getCurrentPosition(GEO_OPTIONS)
    ON success → pasteInput = "lat, lon"; meta = { type, raw: "[GPS]...", gps }
              → renderResults(lat, lon, meta)  // pushHistory = true
    ON error → handleGeolocationError(code)

ON "Tracking live" (toggle):
  IF geoWatchId != null → clearWatch; remove LIVE UI; RETURN
  ELSE watchPosition(GEO_OPTIONS)
    first callback → renderResults(..., { skipHistory: false })  // history once
    next callbacks → renderResults(..., { skipHistory: true })

ON clearForm / Esc (no modal):
  stopLocationTracking(); clear gpsMetadata; initMiniMapOnStartup()

ON applyLanguage:
  IF lastResult → renderResults(..., { skipHistory: true })
```

## ⚠️ Problemi e limiti

- **`file://` e HTTP non sicuro:** `window.isSecureContext === false` → Geolocation non utilizzabile sui browser moderni; serve HTTPS o localhost (es. server locale / PWA).
- **Doppio prompt permessi:** evitato rimuovendo `getCurrentPosition` automatico dalla sola mappa.
- **`watchPosition` + `maximumAge: 0`:** massimo carico batteria / rete; coerente con la specifica utente, valutare rilassamento in release future.
- **`navigator.permissions` per `geolocation`:** non implementato; supporto browser disomogeneo.
- **Heading/speed:** spesso `null` a fermo; UI mostra `gps.na` o equivalente.

## 🚀 Prossimi passi (geolocation)

- [ ] Opzionale: integrare **Permissions API** (`navigator.permissions.query({ name: 'geolocation' })`) dove supportato, per aggiornare stato pulsante su revoca permesso.
- [ ] Opzionale: flag **OPSEC strict** documentato in tooltip (testo già predisposto nel concetto `tip.myLocation`).
- [ ] Test manuale su **iOS Safari** e **Chrome Android** (comportamento background, timeout, live).
- [ ] Aggiornare eventuale **README/PWA** con istruzioni server locale per geolocalizzazione.

---

# 🆕 AGGIORNAMENTO 2026-04-22 — Feature successive

Dopo il batch iniziale (mappa-di-default + geolocalizzazione), la sessione è proseguita con una serie di feature integrate sempre sul file **`coordinate_converter Claude.html`**.

## 🎯 Obiettivi aggiunti

1. **Selezione bbox direttamente sulla mini-mappa** per il pre-cache tile, con disegno drag, viewport corrente, maniglie di resize, tooltip live e named areas salvabili.
2. **Organizzazione "Strumenti"** — drawer laterale che raggruppa Batch, Measure, Range, Astro, Magnetic, Track, Favoriti, Session.
3. **Track builder** — costruzione polilinea/poligono da punti aggiunti manualmente, dal pick mappa, da paste, da import file; export GPX/KML/GeoJSON/CSV.
4. **Offline-first della mappa** — mostrare sempre i tile scaricati in IndexedDB quando offline, senza fallback SVG.
5. **Persistenza del range di zoom** nelle aree salvate del pre-cache.
6. **Polish UI** — pulsante 🧰 Strumenti prominente, pulsante ❔ Guida paired, mini-guida a schede nel modal help, link "Apri in mappa" su una sola riga.

## 🧩 Decisioni architetturali

- **Estensione di `state`:** `bboxSelection`, `namedAreas`, `_bboxSelecting`, `track`, `geoWatchId`, `forceOffline`.
- **Sanitizzazione al load:** `namedAreas` filtra e clampa `z0`/`z1` a 0-19; `track.points` capped a 500, `pickMode` resettato.
- **Idempotenza handlers:** `attachBboxDrawHandlers` usa flag `tileMap._bboxHandlersInstalled` + `_bboxCleanup` per evitare listener leak.
- **Drawer come navigation hub, non come workspace:** le sezioni tool restano in `<main>`, il drawer scrolla + apre il `<details>` corrispondente (scroll-into-view + flash highlight).
- **i18n esteso** con nuovo attributo `data-i18n-html` (via `innerHTML`) per stringhe rich-text della mini-guida (`<b>`, `<kbd>`, `<code>`), coesistente con il vecchio `data-i18n` (via `textContent`) per retrocompatibilità.
- **No fallback SVG quando offline:** `renderMiniMap` chiama sempre `renderTileMap`; `monitorTileLoading.decide()` early-return se `!isEffectivelyOnline()`.

## ⚙️ Dettagli implementativi

### BBox selection su mappa

- Bottoni: `#btnBboxPick` ("📐 Seleziona area sulla mappa"), `#btnBboxViewport` ("🎯 Usa viewport corrente"), `#btnBboxClear` ("❌ Rimuovi").
- Modalità selezione: banner, `cursor:crosshair`, SVG `.bbox-draft` durante il drag, tooltip `.bbox-live-tip` con km × km · N tile · MB (color-coded: `tip-ok` < 30 MB, `tip-warn` 30-80, `tip-caut` 80-200, `tip-err` > 200 o oltre `MAX_PRECACHE_TILES`).
- Pixel→lat/lon: `tileMapPxToLatLon` / `tileMapLatLonToPx` sul `.tile-layer` tenendo conto dello zoom corrente e del translate3d di pan.
- Overlay persistente `.bbox-overlay` con 4 maniglie `.bbox-handle` resizeabili → aggiorna in tempo reale i campi `#pcN/S/E/W` + `#pcPreset = "custom"` + `updatePrecacheEstimate()`.
- Touch support (`touchstart/move/end/cancel`).
- Scorciatoie: **S** (toggle selezione), **V** (viewport corrente), **Esc** (annulla).

### Named areas (pre-cache + zoom range)

```javascript
function saveNamedArea(name){
  const b = state.bboxSelection || readBboxFields();
  const z0raw = parseInt(document.getElementById("pcZ0")?.value, 10);
  const z1raw = parseInt(document.getElementById("pcZ1")?.value, 10);
  const z0 = Number.isFinite(z0raw) ? Math.max(0, Math.min(19, z0raw)) : null;
  const z1 = Number.isFinite(z1raw) ? Math.max(0, Math.min(19, z1raw)) : null;
  state.namedAreas.unshift({
    id: uidNamed(), name: name.trim().slice(0, 40),
    n: b.n, s: b.s, e: b.e, w: b.w,
    z0, z1, createdAt: Date.now()
  });
  if (state.namedAreas.length > 30) state.namedAreas.length = 30;
  saveStore();
}
```

Il dropdown mostra `name  (N/S / W/E) · z6-12` (o `· z10` se z0===z1, niente tag per entry legacy). `applyPrecachePreset` ripristina anche `#pcZ0`/`#pcZ1` quando carichi un'area.

### Tools drawer

- Side drawer `#toolsDrawer` + `#toolsDrawerBackdrop` apribile da `#btnTools` o **Ctrl+K**.
- Card `.tool-item` con `data-tool-target` (id diretto) o `data-tool-target-sec` (chiave i18n del `<summary>`).
- `navigateToToolSection()` chiude il drawer, risolve il target, imposta `<details open>`, scrolla con flash highlight (`.flash-highlight` 1.3s).
- Raggruppamenti: Build (Track), Batch, Favoriti, Measure/Range, Astro/Magnetic, Session.

### Track builder (`#sec-track`)

- State: `{ points: [{id, lat, lon, name?, meta?}], closed: bool, pickMode: bool }`.
- Input: "Add current" (dal risultato attivo), "Click map" (toggle `pickMode` → intercetta click mini-mappa), "Paste list", "Import GPX/KML/GeoJSON".
- Render live: lista con drag-handle per riordino, X per rimozione; summary con N, distanza totale, area (se chiuso), ETA walk/car; overlay polilinea/poligono verde con numerini.
- Export: GPX (trk o area), KML (LineString/Polygon), GeoJSON (Feature), CSV (`lat,lon,name`).
- Esc esce dal pickMode senza chiudere altro.

### Offline tile rendering

```javascript
function renderMiniMap(lat, lon, resetView = true){
  state.lastPoint = { lat, lon };
  if (resetView) state.viewCenter = { lat, lon };
  const root = document.getElementById("miniMap");
  if (!root) return;
  // Sempre tile: hydrateMapTiles() pesca dalla cache IndexedDB quando offline
  // e mostra "?" sui tile mancanti. Nessun fallback SVG.
  renderTileMap(lat, lon, state.mapZoom || 11);
}

// monitorTileLoading.decide()
if (!isEffectivelyOnline()){
  decided = true;
  return;   // rispetta la scelta offline dell'utente, niente switch a SVG
}
```

### UI polish

- **`.btn-tools-cta`**: font `1rem`, weight `700`, padding `8px 18px`, `border-radius:10px`, `var(--gradient-btn)`, glow accent→success via `::after` blur on hover, focus-visible outline.
- **`.btn-help-cta`**: paired con Strumenti, outline accent (background transparente), hover → fill accent. Il "?" è dentro un pallino `.help-q` colorato, che si inverte su hover.
- **Header toolbar**: sostituiti i vecchi “ctrl-row” con una toolbar a cluster:
  - chip `🌐` lingua + chip `📐 Primario` con badge del valore selezionato;
  - iconbar segmentata (tema + stampa);
  - CTA a destra (Guida ghost + Strumenti primary).
- **`.map-links-panel a`**: `flex:1 1 30%; min-width:0; padding:8px 6px; font-size:.82rem`, ellipsis, tripla colonna fino a < 520 px.
- **Mini-guida**: griglia di 9 card tematiche (Convertire, GPS, Mappa, Pre-cache, Strumenti, Favoriti, Condividere, Importare, Privacy) con icona, titolo in accent e corpo rich-text via `data-i18n-html`.

## 📦 File modificati

| File | Modifica principale |
|------|---------------------|
| `coordinate_converter Claude.html` | Tutte le feature sopra (HTML + CSS + JS + i18n IT/EN/FR) |
| `docs/session-geolocalizzazione-e-mappa.md` | Questo documento (consuntivo di sessione) |

## ⚠️ Problemi risolti durante lo sviluppo

- **Virgola decimale IT** (`<input type="number">` in locale italiano) nei campi `#pcN/S/E/W`: `pf()` e `pi()` ora normalizzano `,`→`.` prima di `parseFloat`/`parseInt`.
- **`setBadge()` con tipi non-standard** (`"error"`, `"success"`, `"info"`): normalizzazione interna a `"ERR"`/`"OK"`/`"INFO"` + nuove classi CSS `.chip.chip-ok`, `.chip.chip-info`.
- **Accumulo listener bbox**: flag `_bboxHandlersInstalled` su `tileMap` → handler installati una sola volta.
- **Leak listener su cancel**: `tileMap._bboxCleanup()` rimuove tutti i `window.*` listener (mousemove/up, touchmove/end/cancel) in caso di Esc durante un drag attivo.
- **Layout "Open in map"** che andava a capo in colonne strette: CSS `flex:1 1 30%; min-width:0` lo mantiene su riga singola.
- **Rich-text i18n nel modal help**: introdotto `data-i18n-html` in `applyLanguage()` per tradurre via `innerHTML` le stringhe con `<b>`/`<kbd>`/`<code>`.

## 🗺 Overlay copertura offline (2026-04-22)

Obiettivo: vedere in tempo reale **cosa è già scaricato** senza aprire pannelli.

- **Tint verde per-tile**: quando `state.showCoverage === true` la classe CSS `.coverage-on` sul `.tile-map` attiva `::after` sui `.tile-wrap.tile-mission` (tile caricati da IndexedDB). Il tint verde traslucido (`rgba(34,197,94,.18)`) compare SOLO sulle tile effettivamente cacheate → feedback istantaneo a qualsiasi zoom.
- **Rettangoli aree salvate**: `drawCoverageOverlay(tileMap)` scorre `state.namedAreas` e disegna, dentro `.tile-layer`, un `div.named-cov` (con label) per ogni area; il box usa `tileMapLatLonToPx` e sottrae il transform del `.tile-layer` così segue il pan. Le aree completamente fuori viewport vengono skippate.
- **Stato del rettangolo**:
  - **verde tratteggiato** se lo zoom corrente è dentro `z0..z1` della pack (area realmente navigabile offline);
  - **ambra punteggiato + ⚠** se lo zoom è fuori range (boundary informativo: l'area è salvata ma a questo zoom non hai tile da servire).
- **Toggle**: checkbox `#pcCoverage` nel pannello offline (etichetta `offcache.coverage`, tooltip `tip.coverage`, predefinito ON). Lo switch non forza un re-render completo: chiama solo `drawCoverageOverlay` sul `.tile-map` corrente.
- **Toggle anche sulla mappa**: aggiunto bottone `📦` nei controlli **in alto a destra**, sotto `#` (reticolato MGRS). Il bottone è sincronizzato bidirezionalmente con `#pcCoverage` (click sulla mappa ↔ checkbox nel pannello) e usa colore **verde** quando attivo per richiamare l’overlay.
- **Sincronizzazioni**: ridisegno immediato dell'overlay anche dopo `saveNamedArea` e `deleteNamedArea` → la nuova area compare (o sparisce) senza attese.
- **Persistenza**: `state.showCoverage` serializzato in `saveStore` (settings) e restituito da `loadStore` (default `true` se assente).
- **Costo**: trascurabile. Il tint per-tile è puro CSS (una pseudo `::after`); i rettangoli sono `div` statici ricreati su `renderTileMap` (già chiamato su pan/zoom/render). Nessuna query IndexedDB extra: ci basiamo sulla classe `tile-mission` che `hydrateMapTiles` già applica quando il blob arriva da IDB.

## 🪟 Pannello offline dockable/floating + delete dalla mappa (2026-04-22)

Obiettivo: rendere usabile la gestione dei pacchetti offline anche quando la mappa è ingrandita, e permettere di cancellare singole zone direttamente da lì.

- **Classi `body.mm-half` / `body.mm-full`**: aggiunte in `setMapSize` (oltre alla già esistente `mm-enlarged`). Servono da selettore CSS per il riposizionamento del pannello.
- **`#offlineTilePanel` in `mm-half`**: diventa `position:fixed; left:16px; top:16px`, con larghezza `min(380px, calc(50vw - 40px))` e `max-height:calc(100vh - 32px)`. Il pannello "atterra" nella metà sinistra libera del viewport — in parallelo alla mappa.
- **`#offlineTilePanel` in `mm-full`**: stesso `position:fixed`, ma default a `left:16px; top:16px`. La `<summary>` diventa la maniglia di trascinamento (cursor:grab / grabbing).
- **Drag JS (`makeOfflinePanelDraggable`)**:
  - idempotente (`panel._draggableInstalled`), installato una volta sola in `bindUI`;
  - soglia di 4px prima di attivare il drag, così un click senza movimento continua a fare il natural toggle di `<details>`;
  - clamp dentro viewport (almeno 120px di pannello visibili su X, 40px su Y);
  - dopo un drag registra uno `swallow` capturing click listener sulla summary con timeout a 250ms per inibire il toggle spurio che seguirebbe;
  - supporta mouse + touch (touchstart passive per non bloccare lo scroll lungo, touchmove non-passive per `preventDefault` durante il drag attivo).
- **Reset posizione**: `setMapSize` pulisce le inline `left/top/right/bottom` del pannello quando l'utente lascia la modalità `full`, così tornando a `small`/`half` il pannello riprende la geometria CSS.
- **Stato open/close in base alla size**: `setMapSize()` imposta `#offlineTilePanel.open = (size !== "small")` → chiuso nella pagina principale (mappa piccola), **aperto automaticamente** in mappa media/grande.
- **Narrow screen (≤760px)**: media query dedicata, il pannello copre larghezza piena con `max-height` 40/50vh → rimane trascinabile ma non eccede.

### Cancellazione zone offline dalla mappa

- **`×` in ogni `.named-cov`**: bottone rosso dentro il rettangolo, `pointer-events:auto` (il rettangolo resta `pointer-events:none` per non bloccare pan).
- **Flow a due conferme** (`confirmRemoveNamedArea`):
  1. `cov.removeConfirm` → "Rimuovere la zona '{name}'?" (Cancel aborta tutto).
  2. `cov.removeWithTiles` → "Cancellare anche i tile scaricati?" (Cancel = solo rimozione entry, OK = wipe tile da IndexedDB per bbox × z-range).
- **`deleteNamedAreaTiles(area)`**: nuova funzione che usa `collectBboxTiles(a.n,a.s,a.e,a.w,a.z0,a.z1)` e, dato che la named area non memorizza il layer usato al download, cancella le chiavi per **entrambi** i layer (`osm` + `sat`) via `idbDeleteKeys` (nuova — una sola transazione IDB, che minimizza costo e race condition).
- **Ridisegno post-delete**: se sono stati cancellati tile → `renderMiniMap(lastPoint, false)` per far decadere le immagini dal blob-url e mostrare "?" dove serve; altrimenti basta `drawCoverageOverlay` per togliere solo il rettangolo.
- **Feedback**: `setBadge("success", cov.removeOk | cov.removeOkTiles)` con count dei tile cancellati.

### Label "smart-corner"

- `drawCoverageOverlay` calcola l'intersezione del rettangolo con il viewport (`visL/visT/visR/visB`) e posiziona label/× con **inline style** `left/top` dentro quella regione visibile. Quando l'utente panna facendo uscire il NW dell'area, label e × "scivolano" restando dentro la porzione visibile — mai clippati fuori schermo.
- Se la regione visibile è troppo piccola (< 60×30px per label, < 30×26px per ×) questi elementi vengono nascosti mantenendo solo il bordo: un messaggio visivo che serve lo zoom-out per poter cancellare l'area.

### i18n

Nuove chiavi IT/EN/FR:
- `cov.removeTip` (tooltip del ×);
- `cov.removeConfirm`, `cov.removeWithTiles` (due prompt);
- `cov.removeOk`, `cov.removeOkTiles` (feedback a due rami).

## 🚀 Prossimi passi (rimasti in backlog)

- [ ] **Manifest pack tile** in `saveStore` (layer, bbox, z0..z1, ts) aggiornato al download/clear (id piano: `tile-pack-manifest`).
- [ ] **Zoom clamp** automatico di `state.mapZoom` al range del pack quando offline (id: `zoom-clamp`).
- [ ] **Tile Pack Inspector** nel pannello offline: lista aree cache, "Zoom to cached area" (id: `ui-cache-status`).
- [ ] **Heatmap IDB aggregata**: scan asincrono dei tile in IDB per disegnare l'esatta silhouette delle zone cacheate (anche fuori dalle "named areas"), non solo il boundary nominale. Ora abbiamo il tint per-tile *solo per quanto visibile*, non una mappa globale.
- [ ] **Focus mode** (opzionale): nascondere dalla pagina principale tutte le sezioni tool finché non si apre una voce dal drawer (architetturale, ~10 sezioni).
- [ ] Test su iOS Safari / Chrome Android del ciclo completo: GPS live + pick mappa + track + export + offline.

## 🏷 Tag

`html` `javascript` `geolocation` `wgs84` `coordinate-conversion` `offline-first` `i18n` `cursor` `ux` `opsec` `pwa` `leaflet-alternative` `mini-map` `bbox-selection` `tile-cache` `indexeddb` `track-builder` `tools-drawer` `gpx` `kml` `geojson` `mini-guide` `accessibility`

---

## Diagramma logico (flusso utente)

```
                    ┌─────────────────┐
                    │  App load init  │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
       permalink?                    no permalink
              │                             │
              ▼                             ▼
      renderResults              initMiniMapOnStartup
      (punto URL)                (La Spezia + link)
```

---

## 🕐 DTG (Date-Time Group NATO)

Aggiunto supporto completo al formato militare **DDHHMMZMMMYY** (es.
`211630ZAPR26` = 21 aprile 2026, 16:30 UTC).

### Core (SECTION 14K, zero dipendenze)

| Funzione | Scopo |
|----------|-------|
| `formatDTG(date, tzLetter, { short })` | Formatta una `Date` assoluta come DTG nel fuso richiesto; `short: true` omette `MMMYY` → `DDHHMMZ`. |
| `parseDTG(str)` | Parser permissivo (spazi, case); ritorna `{ date, tzLetter, short, raw }` o `null`. Rigetta `J` e date impossibili via round-trip (es. `31 FEB`). |
| `getCurrentDTG(tzLetter, opts)` | DTG del momento corrente. |
| `dtgToUTC(str)` / `dtgToLocalTime(str)` | Convenience wrappers. |
| `DTG_TZ` / `DTG_TZ_MAP` | Tabella delle 25 lettere NATO (A-I = +1..+9, K-M = +10..+12, N-Y = -1..-12, Z = 0). `J` è intenzionalmente assente. |
| `dtgOffsetPretty(off)` | `"+02:00"` / `"-05:00"` per UI. |

Strategia di parsing: spostamento di offset via `Date.UTC(...) - off*3600e3`,
poi validazione via round-trip (`getUTC*` sulla data shiftata deve ri-produrre
gli input). Nessuna dipendenza da `Intl` o da timezone locale del browser.

Policy anno 2-cifre: `00–69` → `2000–2069`, `70–99` → `1970–1999`.

### UI — card dedicata sotto il results-row

`<details id="dtgCard" open>` collassabile con:
- display live "console" (monospace, verde su tema scuro, blu su chiaro)
  aggiornato ogni secondo;
- selettore fuso con nome completo + offset (`Z — Zulu (UTC+00:00)`);
- toggle "formato corto";
- pulsante **Copia** e **Usa ora**;
- input di parsing con validazione live (bordo rosso / verde) + tabella
  derivata (DTG canonico, short, fuso, UTC ISO-8601, ora locale, giorno
  della settimana, delta da ora — "tra 2 h 14 min" / "3 giorni fa" — e
  timestamp Unix);
- inline chip nel summary con DTG Zulu sempre visibile a card chiusa.

### Integrazione

| Area | Integrazione |
|------|--------------|
| `pushHistory` | Salva `dtg` Zulu della conversione; render mostra `mm:ss · DTG` |
| `addCurrentAsFavorite` / `renderFavorites` | Favorite include `dtg` di creazione e lo mostra sotto al timestamp locale |
| `buildGPX` / `buildGPXRoute` | `<metadata><time>ISO</time><desc>DTG: …</desc></metadata>` |
| `buildKML` / `buildKMLRoute` | `<description>DTG: …</description>` a livello documento |
| `buildGeoJSON` / `buildGeoJSONRoute` | Nuovo oggetto `metadata` (fuori da `features`) con `generated`, `dtg`, `creator` |
| `buildCsvFromTrack` | Righe commento iniziali `# dtg: …` / `# generated: …` (compatibili con `pandas.read_csv(comment="#")`) |
| `encodePermalink` / `readPermalink` | `#ll=LAT,LON&dtg=DTG` opzionale: all'apertura del link il DTG pre-popola la card |
| `loadStore` / `saveStore` | Persistenza di `state.dtgTz` e `state.dtgShort` (validati via regex `/^[A-IK-Z]$/`) |

### Scorciatoie tastiera

| Combinazione | Azione |
|--------------|--------|
| `Alt+T` (raccomandata) / `Ctrl+T` | Apri / focus sulla card DTG |
| `Alt+Shift+T` / `Ctrl+Shift+T` | Compila il campo con il DTG attuale |

> Nota: la maggior parte dei browser intercetta `Ctrl+T` (nuova scheda) e
> `Ctrl+Shift+T` (riapri scheda) a livello OS, quindi gli equivalenti
> `Alt+…` sono quelli effettivamente funzionanti. Nell'help overlay
> sono documentati entrambi.

### Test (inline nel blocco diagnostico)

- `formatDTG(2026-04-21T16:30Z, Z)` → `211630ZAPR26`
- `formatDTG(…, B)` → `211830BAPR26` (wall-clock +02)
- `formatDTG(…, Z, { short: true })` → `211630Z`
- Round-trip `parseDTG → formatDTG` in Z e B
- `parseDTG("211630JAPR26")` → `null` (J riservato)
- `parseDTG("311200ZFEB26")` → `null` (31 FEB impossibile)
- `DTG_TZ.length === 25` e assenza di `J` nel map

---

## 🔎 Geocoding (Nominatim + reverse automatico + fallback offline)

Aggiunto supporto completo a:
1. **Geocoding diretto** (indirizzo/POI → coordinate) via Nominatim di OpenStreetMap.
2. **Reverse geocoding** (coordinate → località) asincrono dopo ogni conversione.
3. **Fallback offline** basato su un piccolo dataset di capitali integrato (~40 città),
   espandibile dall'utente con un JSON (GeoNames o equivalente).
4. **OPSEC consapevole**: disclaimer sempre visibile, modalità *strict* che disabilita
   qualunque chiamata esterna, badge rete con elenco host contattati.

### Core (SECTION 14L, zero dipendenze)

| Funzione | Scopo |
|----------|-------|
| `nominatimQuery(path, params)` | Client rate-limited (coda ≤ 1 req/s), timeout 8 s, retry ×2 con back-off esponenziale (1/2 s), circuit breaker 60 s dopo 3 fail consecutivi. |
| `geocodeSearch(q, { limit, countryCodes, viewbox, bounded })` | Forward search `/search`, cache in-memory (`normQ+opts` → array). |
| `reverseGeocode(lat, lon, { force, zoom })` | Reverse `/reverse`, cache a 4 decimali (~10 m), persistenza anche in IDB (`geo:rev:LAT,LON`). |
| `geocodingAllowed()` | Gate unico: rispetta `geocodeEnabled`, `opsecStrict` e il breaker. |
| `loadOfflineCities` / `importOfflineCitiesJSON` / `clearOfflineCities` | Dataset offline in IDB (`geo:dataset:cities`). |
| `offlineForwardSearch(q)` / `offlineNearestCity(lat, lon)` | Ricerca / NN con haversine sulle città (seed + importate). |
| `refreshHostsContactedUI()` | Mantiene aggiornato il tooltip di `#netStatus` con gli host esterni contattati nella sessione. |

La coda garantisce `minGap = 1.1 s` tra richieste. Un singolo set di errori ripetuti
attiva `breakerUntil`: la card mostra un banner tempizzato, e `nominatimQuery` rifiuta
immediatamente nuove chiamate fino allo scadere.

### UI — card "Cerca indirizzo / località"

Inserita tra la paste-box e la results-row come `<details id="geocodeCard">`
(chiusa di default: l'apertura è consenso implicito alla lettura del disclaimer OPSEC).

Contiene:
- campo input con autocomplete (debounce 400 ms, minimo 3 char);
- filtro paese (`countrycodes=…`) e toggle "solo nell'area visibile" (calcolato via
  `currentViewBbox()` → `viewbox` + `bounded=1`);
- dropdown risultati con nome, tipo (`class/type`), coordinate e badge "OFFLINE"
  quando il risultato arriva dal dataset embedded;
- navigazione tastiera (↑/↓/Invio/Esc);
- banner rosso "OPSEC — non usare con dati classificati" sempre visibile;
- banner giallo di circuit-breaker temporizzato.

### UI — riga "📍 Località" nella results-card

`ensureLocalityRow(root)` gestisce una pill “📍 Località” ora **promossa accanto al titolo “Risultati”** (non più in fondo alla griglia), con:
- stato "…" mentre è in corso la query;
- testo completo (`display_name`) e tooltip quando arriva;
- stile arancione+corsivo quando il valore proviene dal fallback offline (approssimato);
- pulsante 🔄 che chiama `scheduleReverseLookup(lat, lon, { force:true })`.

Il fetch è **fire-and-forget** ma protetto contro race-condition: se `state.lastResult`
si è spostato prima che risponda, l'update viene scartato.

### Integrazione con features esistenti

| Area | Integrazione |
|------|--------------|
| `pushHistory` | Salva `locality` (display_name) + `srcTag="[GEO]"` quando la conversione nasce da una ricerca. |
| `renderHistory` | Mostra badge `[GEO]` e riga `📍 <locality>` sotto alle coordinate. |
| `addCurrentAsFavorite` | Default-name intelligente tramite `favNameFromLocality(loc)` (city + suburb). |
| `renderFavorites` | Riga `📍 <locality>` sotto alle coordinate, col tooltip completo. |
| `exportFavorites` | `desc` del waypoint include `📍 <locality>` insieme a note e DD. |
| `buildBatchPoints` | `name` usa la località quando disponibile (altrimenti P#: input). |
| `doBatch` / `renderBatch` / `batchCsv` | Toggle "Aggiungi colonna Località" → colonna `loc` nella tabella e nel CSV; `batchFillLocalities` riempie riga per riga via reverse, con progress bar. |
| `doPasteDetect` | Se l'input non matcha alcun formato, propone un `confirm("Cercare '{0}' come indirizzo?")` e, se accettato, delega a `geocodeSearch`. |
| `updateNetStatus` | Richiama `refreshHostsContactedUI()` per aggiungere al tooltip la lista dei domini contattati (incluso `nominatim.openstreetmap.org` dopo il primo fetch). |

### Impostazioni (help overlay → mini-guida Geocoding)

Nuova sezione `.geo-settings` con:
- toggle **Abilita geocoding online** (default on);
- toggle **Reverse automatico dopo conversione** (default on);
- toggle **OPSEC strict** (disabilita ogni chiamata; hook `state._onOpsecChange`);
- campo **Endpoint Nominatim custom** (self-hosted → bypass rate-limit pubblico);
- import/clear **dataset città** (`.json` con `{name, lat, lon, country, pop?}`);
- conteggio entry dataset e fallback al seed integrato.

Tutte le preferenze persistono in `localStorage` (`saveStore`/`loadStore`) con
validazione strutturale (`typeof`, clamp di lunghezza).

### Scorciatoie tastiera

| Combinazione | Azione |
|--------------|--------|
| `Alt+F` (raccomandata) / `Ctrl+F` | Apre/focus sulla card geocoding |
| `Esc` | Chiude il dropdown risultati |

Come per `Ctrl+T`, il browser intercetta spesso `Ctrl+F` (find-in-page): `Alt+F` resta
l'equivalente affidabile. Entrambe sono documentate nell'help overlay.

### Rate limiting & resilienza — numeri

| Parametro | Valore |
|-----------|--------|
| Min gap tra richieste | 1100 ms |
| Timeout request | 8 s |
| Retry max | 2 (tot. 3 tentativi) |
| Backoff | 1 s → 2 s (esponenziale) |
| Circuit breaker | 60 s dopo 3 fail consecutivi |
| Cache in-memory (fwd/rev) | 200 entries (LRU-ish) |
| Cache reverse persistente | IDB `geo:rev:LAT,LON` |

### OPSEC — scelte difensive

- **Consenso implicito** all'apertura della card (`<details>` chiusa di default).
- **Disclaimer persistente** sotto il campo di ricerca (non nascondibile).
- **Badge rete tooltip** elenca tutti i domini esterni contattati nella sessione.
- **Modalità strict** disponibile come flag persistente (`state.opsecStrict`) che
  `geocodingAllowed()` legge come primo check: blocca qualunque `fetch` verso Nominatim.
- **Parser fallback** non invia MAI silenziosamente la query: richiede conferma esplicita
  via `confirm()`.

---

## Idee scartate vs implementate

| Idee scartate o ridotte | Idee implementate |
|-------------------------|-------------------|
| GPS silenzioso all’avvio sulla mini-mappa (conflitto con permessi espliciti) | Solo La Spezia all’avvio; GPS solo da pulsante |
| Inserire in cronologia ogni tick del live | Una voce alla prima fix live; poi `skipHistory` |
| Re-render lingua che richiama `pushHistory` ogni volta | `skipHistory: true` in `applyLanguage` |
| Fallback SVG automatico quando offline anche con tile cacheati | Sempre `renderTileMap`; hydrate da IndexedDB + `?` su tile mancanti |
| Drawer-as-workspace (tool rimossi da `<main>`) | Drawer come navigation hub: scroll-to-section + flash + `<details open>` |
| Rendere la CTA Strumenti enorme e invadente | Strumenti come primary accent, Guida come outline accent (coppia bilanciata) |
| Controlli header “a due righe” non coerenti | Toolbar header a una riga con 3 cluster (Settings / Utilities / CTA) stile Linear/Vercel, chip per lingua+primario, iconbar tema+stampa |
| Ri-implementare il fallback SVG in un secondo layer | Rispettare `isEffectivelyOnline` e mostrare solo ciò che c'è in cache |
| DTG intercettato forzando `Ctrl+T` contro il browser | `Alt+T`/`Alt+Shift+T` come scorciatoie primarie; `Ctrl+T` solo best-effort |
| DTG integrato dentro la card dei risultati | Card dedicata `<details id="dtgCard">` come richiesto dall'utente |
| Storicizzare DTG con fuso di chi lo ha creato | DTG sempre **Zulu** nella cronologia/favoriti — standard NATO, niente ambiguità |
| Bundle di un dataset offline 2 MB (GeoNames CC-BY-SA) nel singolo HTML | **Seed integrato** di ~40 città + import JSON opzionale dall'utente via IDB (scelta pragmatica: HTML resta ≤400 KB) |
| Parser universale che invia automaticamente ogni non-coord a Nominatim | **`confirm()` esplicito** prima di uscire sulla rete: nessuna esfiltrazione accidentale di paste classificati |
| Geocoding sempre abilitato "è gratis" | Primo gate `geocodingAllowed()` + modalità `opsecStrict` + disclaimer persistente sotto il campo |
| Reverse sincrono dentro `renderResults` | Schedule asincrono `scheduleReverseLookup` + guardia race-condition sullo spostamento di `state.lastResult` |
| Chiamare Nominatim a ogni carattere digitato | Debounce 400 ms + minimo 3 char, coda FIFO con `minGap` 1.1 s lato client |

---

## Best practice evidenziate

- **Opt-in esplicito** per dati sensibili (posizione), con tooltip che chiarisce località vs rete.
- **Separazione** altitudine GPS / elevazione terreno modello, per evitare errori operativi.
- **Contesto sicuro** verificato prima di abilitare l’API, con messaggi i18n e azioni suggerite.
- **Stato UI centralizzato** (`refreshGeolocationBarriers`, `stopLocationTracking`) per evitare pulsanti incoerenti.
- **Estensione non invasiva** di `renderResults` con opzioni invece di duplicare il renderer.
- **Idempotenza** degli event handler (bbox draw) e **cleanup esplicito** su cancel/Esc.
- **Sanitizzazione al load** di tutto ciò che proviene da `localStorage` (clamp numerici, lunghezze stringhe, flag resetati).
- **Retrocompatibilità dati**: entry legacy (`namedAreas` senza `z0/z1`) continuano a funzionare senza migrazione forzata.
- **i18n rich-text opt-in** via `data-i18n-html`: default rimane `textContent` (sicuro), rich-text solo dove esplicitamente autorizzato.
- **Keyboard shortcuts ordinati per priorità** in `bindHotkeys` (Esc gestisce prima i modi attivi: pickMode > drawer > bbox > form clear).
- **Feedback utente color-coded** (tip-ok/warn/caut/err) per decisioni "quanto costa questa azione" prima di confermarla.
- **Stacking/z-index controllato** nelle UI flottanti: tooltip della mini-mappa forzate sopra i pannelli fixed/floating in `mm-half/mm-full` (evita scomparsa “dietro” durante hover).

---

## Checkpoint 2026-04-22 (sera) — UI ingressi, header, repo, Git

### UI — flusso e priorità (solo `coordinate_converter Claude.html`)

| Voce | Cosa è stato fatto |
|------|-------------------|
| **Input automatico** | Ex «Incolla qualsiasi formato»: titolo + i18n IT/EN/FR; hint/scorciatoie/help aggiornati (`paste.title`, `help.kbd.*`, `track.hint`, `help.guide.convert.body`). |
| **Enfasi card incolla** | Bordo/ombra/padding maggiori, titolo e textarea più leggibili. |
| **Input manuale** | Spostato **subito sotto** l’automatico; `<details>` senza `open` (chiuso di default); rimossa duplicazione DOM precedente. |
| **Geocoding** | Confermato **terzo** nell’ordine (automatico → manuale → cerca indirizzo). |
| **Tre card coerenti** | Stessa scala tipografica titoli (~`1.22rem`); **priorità visiva con colori/bordi/barra** (tier 1 / 2 / 3), non con font molto diversi. |
| **Titolo vs toolbar** | `.header-inner` passato a **CSS grid** tre colonne (`auto minmax(0,1fr) auto`); rimossi `position:absolute` su `.net-status` e `.header-ctrls` per evitare sovrapposizione su «Convertitore Coordinate». |
| **Mobile** | Padding allineato per manuale/geocoding; breakpoint 900px: flex a colonna con `align-self`. |

### Librerie inline (SunCalc / WMM)

- **SunCalc** e **WMM-2025** sono **codice embedded** nello stesso HTML (single-file, zero CDN): servono pannelli **Astro** (sole/luna) e **Magnetic** (declinazione). Non sono file separati da «aprire» oltre al `.html`.

### Pulizia repo

- Rimossi dal workspace: `coordinate_converter.html`, `coordinate_converter Claude copia.html`.
- **Canonico:** solo `coordinate_converter Claude.html` + questa doc + `Cursor.code-workspace`.
- Intestazione doc aggiornata (niente più «archivio storico» sul vecchio `.html`).

### Cursor — Review vs Commit

- La lista **«6 Files» / Review** in sidebar può restare finché non si **accetta/rifiuta** il batch agent; non implica che tutti i file esistano ancora su disco.
- **`Commit` disattivato:** la cartella `Ai/Cursor` **non era un repository Git** (assenza `.git`). Per abilitare i commit: `git init` nella cartella del progetto, poi stage + messaggio + Commit.

---

## Checkpoint 2026-04-23 — Mini‑mappa: misura on‑map, controlli, imagery date, datum extra

### Mini‑mappa — misura diretta (senza rimuovere il tool testuale)

- **Pulsante misura** in overlay: attiva modalità click‑2‑punti direttamente sulla mappa.
- **Start/End distinguibili**: marker **S** (verde) e **E** (rosso).
- **Freccia direzione** sulla linea (S→E) + **overlay** distanza/azimuth **parallelo** al segmento, con background e drop‑shadow (leggibile su satellitare/cartografia).
- **Unità selezionabile**: menu in‑mappa per `m / km / nm / mi / ft`, aggiorna pill e overlay.
- **Riga Misura** nel readout: posizionata **sopra** PUNTO e CURSORE.

### Mini‑mappa — UX controlli

- **Controlli top‑right** compattati (half/full) e resi più leggibili.
- **Gruppo misura**: 📏/✕ dentro un **unico contorno**, riconoscibile come funzione.
- **Colonna unica**: tutti i controlli laterali hanno **stessa larghezza** (`--ctrlW`), evitando bottoni “larghi” disomogenei.
- **Scala**: nascosta su small; su half/full si adatta alla larghezza mappa (cap) per restare “dentro”.
- **Nord**: indicatore `N ↑` in overlay.

### Mini‑mappa — coordinate primarie nel readout

- **Ciclo formato** (MGRS→UTM→DD→DDM→DMS) via pulsante `⇄` nel readout (half/full) e via **tasto destro** sulla stringa coordinate.

### Satellite — data immagine (Esri)

- Solo su layer **Satellite (Esri)**: label `Imagery: YYYY‑MM‑DD (Esri)` con fallback “data non disponibile”.
- Aggiornamento automatico su cambio punto/zoom, con **cache** e timeout (online‑only).

### Datum extra / parser / export (PROMPT 3)

- Aggiunta sezione **Datum aggiuntivi** (NAD27/NAD83/OSGB36/CH1903/SK42) in card collapsible nei risultati.
- Auto‑detect esteso per **BNG** e **SK42 Gauss‑Krüger**.
- Toggle export: includi datum extra come **metadata/extensions** (GPX/KML/GeoJSON) quando attivo.

---

## Checkpoint 2026-04-23 (sera) — Mini‑mappa: box misura avanzato (distanza/azimut + poligono/area)

### Strumento misura — box flottante (stile SASPlanet / Google Earth)

- Aggiunto un **pulsante unico** `📏∠` nella colonna controlli (top‑right) per aprire/chiudere gli **strumenti di misura**.
- Alla pressione si apre un **box flottante** con:
  - Tab **Linea** (distanza + azimut) e **Poligono** (perimetro + area)
  - **Unità** selezionabile `m / km / nm / mi / ft`
  - Output “riassunto” nel box (e mantiene la riga **MISURA** nel readout)
  - Azioni: **Pulisci** (reset punti) e **Esci** (disattiva tool e chiude box)

### Interazione sulla carta — aggiunta / spostamento / rimozione punti

- **Click sulla mappa**: aggiunge punti (Linea: 2 punti; Poligono: N punti).
- **Drag & drop** dei punti: i vertici diventano maniglie trascinabili direttamente sull’overlay (cursore “grab/grabbing”).
- **Rimozione user‑friendly**: **tasto destro** su un punto per eliminarlo (Linea: azzera; Poligono: rimuove il vertice).

### Overlay grafico

- **Linea**: marker **S** (verde) e **E** (rosso) + freccia direzione + label distanza/azimut con background leggibile su qualunque basemap.
- **Poligono**: render `polyline/polygon` con fill leggero + label con **perimetro** (Vincenty) e **area** (formula sferica, `sphericalPolygonArea`).

### Persistenza (localStorage)

- Persistite in `coordconv_v1` le preferenze dello strumento: **unità**, **tipo** (line/poligono) e **poligono chiuso**.

---

## Checkpoint 2026-04-23 — Cursor: Project Rules + indice operativo

### Regole progetto (`.cursor/rules/`)

- Sostituito il singolo `regole.mdc` con quattro file `.mdc` (efficienza token + attivazione mirata):
  - `00-project-core.mdc` — **Always**: vincoli assoluti, stile risposta (IT), patch mirate; non modificare file fuori `.cursor/rules/` senza permesso esplicito dell’utente.
  - `10-html-architecture.mdc` — **Auto** su `*.html`: `state`, `coordconv_v1`, IndexedDB, GPS opt-in, offline tile, `renderResults(..., { skipHistory })`, i18n `data-i18n` vs `data-i18n-html`, idempotenza/cleanup handler.
  - `20-domain-knowledge.mdc` — **Agent Requested**: dominio (CRS/datum extra, DTG, geocoding/OPSEC, tile pack/coverage, track, export, misura on-map).
  - `99-known-state.mdc` — **Manual** (`@99-known-state`): solo invarianti “non rompere queste cose”.
- **Rimosso** `regole.mdc` (contenuto ripartito nei file sopra; evitava doppio `alwaysApply`).

### Indice breve per le chat

- Aggiunto **`docs/checkpoint.md`**: snapshot corto (tabella rules + invarianti) da `@`-menzionare in Cursor senza ricaricare tutto questo documento.

> La **cronaca completa** delle feature resta in questo file; `docs/checkpoint.md` serve come “biglietto da visita” per il contesto Cursor.

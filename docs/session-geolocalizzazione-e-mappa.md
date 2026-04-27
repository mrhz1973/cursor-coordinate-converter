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

---

## Checkpoint 2026-04-23 — Roadmap rev. 2 + mirror rules + cursor-workflow

### Cosa è cambiato (documentazione, zero codice)

- **`docs/roadmap.md` promosso a rev. 2** (stato già sul disco, verificato integrità):
  - Nuovo blocco non-numerato **"Notice to AI Assistants"** prima di §1 con 5 sottosezioni (Authority / Precedence / Rejected patterns non-exhaustive / Disagreement protocol / Reading order).
  - Nuova **§3 Distribution Strategy** — tre scenari: (a) air-gapped / classified **PRIMARY**, (b) informal peer-to-peer sharing **PRIMARY**, (c) PWA futura **non-blocking**. Ogni principio di §4 è ora tracciato allo scenario che lo genera.
  - Renumbering: §3 (ex Arch. Principles) → §4, §4 → §5, …, §10 → §11 (mapping completo in Appendice A della roadmap).
  - §10 Revision Policy include il trigger esplicito "Notice to AI Assistants updated — must be mirrored in `.cursor/rules/00-project-core.mdc`".

- **`.cursor/rules/00-project-core.mdc` esteso** con tre blocchi in append (nessuna riscrittura):
  - `## Mirror notice` — dichiara la duplicazione bidirezionale con `docs/roadmap.md` §Notice.
  - `## Rejected patterns (mirror of roadmap §Notice)` — riferimento autoritativo alla roadmap + principio sottostante (a/b/c/d) + esempi noti (ES Modules, framework UI, TypeScript, bundler, transpiler, CSS preprocessor, centralized-store refactor, global event-delegation, rewrite, refactor > 50 righe senza approvazione, NPM).
  - `## Disagreement protocol` — versione integrale operativa: una strategic concern per turn, formato prefisso `> Strategic concern: …`, no lecture, no ripetizione cross-turn.
  - File passato da 34 a 55 righe.

- **`docs/checkpoint.md` aggiornato** (indice corto):
  - Aggiunti bullet `docs/roadmap.md` rev. 2 e `docs/cursor-workflow.md` in "Documentazione lunga".
  - Cella "Ruolo" di `00-project-core.mdc` annota i nuovi blocchi mirror.
  - Nuova sezione `## Relazione mirror roadmap ↔ rules` come terzo vertice che registra la duplicazione per future sessioni.

- **`docs/cursor-workflow.md`** (già presente sul disco) confermato come companion operativo della roadmap; citato da `checkpoint.md`.

### Cosa NON è cambiato

- Nessuna modifica al file canonico `coordinate_converter Claude.html`.
- Nessuna modifica a `10-html-architecture.mdc`, `20-domain-knowledge.mdc`, `99-known-state.mdc` — contenuti ortogonali al Notice, nessuna duplicazione né conflitto.
- Nessuna decisione architetturale rivista: i principi §3/§4/§8 della roadmap sono propagati, non ridiscussi.

### Relazione mirror — tre vertici da tenere allineati

Ogni modifica al Notice o alla lista Rejected patterns richiede aggiornamento coerente su:

1. `docs/roadmap.md` — sorgente autoritativa (Notice to AI Assistants + tabella Rejected patterns completa).
2. `.cursor/rules/00-project-core.mdc` — mirror con principio + esempi principali + Disagreement protocol integrale.
3. `docs/checkpoint.md` — registra che la duplicazione è intenzionale (sezione "Relazione mirror roadmap ↔ rules").

Il trigger §10 della roadmap ("must be mirrored") formalizza il vincolo.

### TODO residui per sessioni future

- Se un futuro assistente bypassa la Rejected patterns list con un nuovo anti-pattern, aggiungerlo alla tabella in roadmap e verificare che il principio sottostante nel mirror di `00-project-core.mdc` lo copra (altrimenti estendere anche quello).
- Tier list refinement di §5 (working hypothesis) resta su dedicata futura sessione strategica — invariato rispetto a rev. 1.
- Valutare se `docs/PROJECT_notes.md` necessita un bullet cross-link alla roadmap rev. 2 (non fatto ora, fuori scope del checkpoint corrente).

---

## Checkpoint 2026-04-24 — GIS-first layout pivot (net replacement)

Implementazione del piano `.cursor/plans/gis-first_layout_pivot_7c8df2ea.plan.md`: l'app passa da "conversion-first con mini-mappa" a **GIS viewer/planner con conversione on-demand**. Sostituzione netta, nessun toggle legacy/GIS.

### Nuovo scheletro DOM (coordinate_converter Claude.html)

- `<body class="gis-mode">` come boot state (persistito in `state.gisMode`, default `true`; il flag resta nel `state` per eventuale disattivazione futura ma non c'è UI per spegnerlo).
- `<header>` compattato: resta brand + controlli globali (settings, theme, print, help, Strumenti, lang switch).
- Nuova `<nav id="appTopbar">` subito sotto l'header, con:
  - **Tab buttons** (`data-tab-key`): `track`, `measure`, `favorites`, `dtg`, `geocoding`, `history`, `layers`.
  - **CTA Converti** (`#btnOpenConvert`) → apre `<dialog id="convertModal">`.
  - **Kebab Altri strumenti** (`#btnOpenToolsMenu`) → apre `<dialog id="toolsModal">` con 6 tile (Batch, Note, Sessione, Astro, Mag, Range).
- `<main>` ora ospita solo `<div id="gisMapMount">` (mappa full-viewport: `height: calc(100vh - var(--gis-topbar-h) - 76px)`). Le card classiche (`#pasteSection`, `#manualInputSection`, `#geocodeCard`, `.grid`, `#toolsCollapsible`) restano nel DOM ma sono nascoste in home via `body.gis-mode > main > …`, perché vengono riparentate on-demand.
- `<aside id="tabDrawer">` + `<dialog id="convertModal">` + `<dialog id="toolsModal">` aggiunti dopo `</main>` (prima del footer).

### Meccanica reparenting (no clone, no innerHTML)

- Ogni `<details>` target ha `id` stabile + `data-tab-key`. Il modulo **GIS hub** (inserito prima di `SECTION 24: INIT`) mantiene una `Map GIS_HOME_SLOTS` con `{ parent, nextSibling }` originali, popolata una sola volta da `gisInit()`.
- `activateTab(tabKey)`:
  1. riporta l'eventuale tab corrente nello home slot (`gisRestoreSection`);
  2. `appendChild` del target in `#tabDrawerBody`;
  3. apre `details.open = true`, setta `state.activeTab`, salva in `coordconv_v1`.
- `deactivateTab()` inverte 1-2, resetta `state.activeTab = null`.
- Convert modal: reparenta `pasteSection`, `manualInputSection`, `geocodeCard` (saltato se la tab `geocoding` è attiva), `.results-col` in `#convertModalBody`. Chiusura = restore verso home slots nello stesso ordine inverso.
- Tools modal: 6 tile → ognuno `activateToolPanel(tool)` reparenta il corrispondente `<details id="sec-*">` in `.tools-panel-wrap` (slot unico, uno alla volta); chiusura del modale restituisce tutto.
- **Idempotenza**: click ripetuto su un tab attivo non rimuove/ricollega, solo focus.

### Invarianti preservati (QA)

- **OPSEC**: nessuna chiamata di rete automatica aggiunta; il Convert modal apre solo la UI, la conversione resta gated dall'azione utente; Geocoding mantiene `state.opsecStrict`.
- **Niente silent geo**: `gisInit()` non tocca `navigator.geolocation`; il boot continua a passare per `refreshGeolocationBarriers()`; centro fallback La Spezia invariato.
- **Offline tiles / coverage**: il pulsante on-map `[data-role="offline-panel-open"]` è intercettato in capture phase quando `body.gis-mode` è attivo → esegue `activateTab("layers")` + `otp.open = true`. `#offlineTilePanel` non viene mai disattivato, solo spostato; la IDB pipeline è invariata.
- **CSS override**: la regola legacy `body.mm-full #offlineTilePanel { position:fixed … }` entrerebbe in conflitto dentro il drawer → override con `position:static !important`, reset di `left/top/width/margin/border/box-shadow/padding`, e hide della `summary` interna quando il pannello è nested (`.tab-drawer-body`, `.tools-panel-wrap`, `#convertModalBody`).
- **Idempotenza handler**: `gisInit()` guardia `_gisInitDone`, i listener topbar/modal sono registrati una sola volta; Esc chiude nell'ordine `convert → tools → drawer`.
- **Sanitize state**: in `init()`, al load da `localStorage`, `state.gisMode` è forzato a `true` (invariante finché non c'è UI di switch) e `state.activeTab` è validato contro `GIS_VALID_TABS`; valori sconosciuti → `null`.

### Ordine di init (rilevante per la prima renderizzazione mappa)

```
init() → applyLanguage() → gisInit() → initMiniMapOnStartup() → refreshGeolocationBarriers()
```

`gisInit()` **prima** di `initMiniMapOnStartup()` così il primo render della mappa avviene già dentro `#gisMapMount` (post-reparent) evitando flicker / dimensioni errate. `applyLanguage()` prima ancora perché le label statiche del topbar usano `data-i18n` standard.

### i18n

Nuove chiavi IT/EN/FR aggiunte al dizionario inline: `tabs.track`, `tabs.measure`, `tabs.layers`, `tabs.favorites`, `tabs.dtg`, `tabs.geocoding`, `tabs.history`, `cta.convert`, `menu.otherTools`, `menu.batch|notes|session|astro|mag|range`, più tooltip equivalenti. Regola `gisRefreshI18n()` aggiorna i titoli di drawer/modali al cambio lingua (titolo dinamico derivato da `GIS_TAB_TITLE_KEY[activeTab]`).

### Tools drawer legacy

Non rimosso: i link al suo interno (`navigateToToolSection`) ora controllano `body.gis-mode` e delegano a `gisNavigateToolTarget()` che mappa target-id → tab o tool modal, preservando il comportamento dei deep-link.

### Cosa NON è cambiato

- Logica di conversione, parser, formatter, Vincenty, WMM, SunCalc, QR, DTG, Geocoding: **zero modifiche**.
- Pipeline IndexedDB per tile / cache geocoding: invariata.
- Permalink (`#ll=`, `#mgrs=`, `dtg=…`): invariato — `readPermalink()` continua a short-circuitare `initMiniMapOnStartup()` via `state.lastResult`.

### TODO residui

- Valutare copertura tastiera: l'attuale topbar non ha `role="tablist"` / `aria-controls` (i tab sono `<button data-tab-key>`); in un giro futuro serve ARIA completa + focus trap per i `<dialog>` (Chrome lo fa nativamente, ma verifica iOS Safari).
- Valutare se il boot in GIS mode debba essere toggleable via setting avanzato; per ora è hard-coded a `true` come richiesto dal piano ("sostituzione netta").
- Rifare lo screenshot in `docs/` / README una volta validata la UX su mobile landscape.

---

## Checkpoint 2026-04-24 — Glass UI restyle (solo CSS)

### Contesto

Sessione UI/UX: modernizzare l'aspetto dell'app a stile Vercel/Linear (Glassmorphism, Inter, ombre morbide) **senza** toccare markup/JS, e organizzare il CSS in modo che i prossimi re-skin si facciano modificando principalmente i token in cima al `<style>`. Piano: `.cursor/plans/css_glass_ui_+_tokens_24558147.plan.md`.

### Vincoli rispettati

- Modifiche **solo** dentro il tag `<style>` di `coordinate_converter Claude.html`.
- Nessun cambio a `id`, `class`, `data-*`, ordine nodi, contenuti di `<body>` o del blocco `<script>`.
- Nessuna nuova dipendenza runtime se non **Google Fonts Inter** via `@import` nel CSS (nessun `<link>` in `<head>`).

### Cosa è cambiato (riassunto per sezione del `<style>`)

- **Tipografia**: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')` all'inizio del CSS; `body` ora usa `font-family:'Inter', system-ui, ...` con antialias + `font-feature-settings` (cv02/03/04/11).
- **Design tokens** (`:root[data-theme="light"]` e `:root,:root[data-theme="dark"]`): riscritti in chiave semantica glass con **alias legacy** (le vecchie variabili `--bg`, `--panel`, `--panel2`, `--text`, `--muted`, `--border`, `--border-strong`, `--shadow`, `--shadow-lg`, `--accent*`, `--gradient*` sono conservate ma il loro **valore** è stato aggiornato al nuovo look, così il resto del foglio non si rompe).
  - Aggiunti: `--border-glow`, `--ring-focus`, `--glass-blur`, `--shadow-inset-card`.
  - Dark: `--bg:#09090b`, `--panel:rgba(255,255,255,0.04)`, `--panel2:rgba(255,255,255,0.07)`, `--text:#f8fafc`, `--muted:#94a3b8`, `--accent:#3b82f6`, `--gradient-btn:linear-gradient(135deg,#3b82f6,#8b5cf6)`, `--shadow-lg:0 20px 40px rgba(0,0,0,0.5),0 8px 20px rgba(0,0,0,0.35)`.
  - Light: paletta speculare, bordi `rgba(15,23,42,0.1/0.16)`, `--ring-focus:0 0 0 3px rgba(37,99,235,0.14)`.
- **Base**: `body` → font Inter + line-height 1.5; nessun altro toccato.
- **Card con glass** (`backdrop-filter:blur(var(--glass-blur)) saturate(140%)` + bordo 1px + `--shadow-lg` + `--shadow-inset-card`):
  - `.paste-section` (radius 20px), `.paste-section + .input-col` (radius 20px, niente più gradient duro), `.geocode-card` (radius 20px), `.dtg-card` (radius 16px), `.result-card` (radius 16px, hover con lift `-2px` e bordo `--border-glow`), `details` generici (radius 16px), `header` globale.
- **Form**: `input[type=text|number]`, `textarea`, `select` → radius 12px, padding 10×14, focus `border-color:var(--border-glow) + box-shadow:var(--ring-focus)`.
- **Bottoni**: `.btn` con lift e bordo glow; `.btn-primary` con gradiente `--gradient-btn`, ombra blu `rgba(59,130,246,0.3)`, pseudo `::before` satin (overlay bianco sfumato trasparente), hover `translateY(-2px)` + ombra ampliata, active reset ombra.
- **Overlay glass**: `.modal-overlay` (backdrop blur 6px), `.modal` (radius 20px), `dialog.app-modal` (radius 20px + backdrop blur 6px), `.tools-drawer`, `.tab-drawer`, `#appTopbar.app-topbar` (sticky + blur).
- **Controlli mappa** resi coerenti col tema (scuri traslucidi): `.tile-map .tile-size`, `.tile-zoom`, `.ts-btn`, `.tz-btn`, `.tg-btn`, `.tcov-btn`, `.mini-map .mm-offline-size`. Bordo 1px `rgba(255,255,255,.12)`, sfondo `rgba(15,23,42,0.55)`, `backdrop-filter:blur(10px) saturate(140%)`, icone chiare.
- **Tooltip**: regola globale `[data-tip]::after` → glass (blur + border + shadow 24px), radius 10px.

### Cosa NON è stato toccato

- Struttura HTML, id, class, handler, script, logica di conversione/parser/i18n, pipeline IndexedDB, DTG, geocoding, tile, track.
- Regole light/dark esistenti fuori dai token: i vecchi selettori `html[data-theme="light"] …` continuano a funzionare perché i token puntano allo stesso nome.
- `.hdr-chip` e i `<select>` "chip" in header (non toccati in modo invasivo: i nuovi stili `input/select/textarea` generici non rompono i chip perché questi hanno override locali più specifici; la chevron custom dell'esempio Vercel NON è stata copiata).

### Manutenibilità — Come rifare un look diverso in futuro

Il punto di ingresso unico è il **primo blocco `:root`** in cima al `<style>` (light + dark). Cambiando lì:

1. `--bg` / `--panel` / `--panel2` → colore generale + traslucenza dei vetri.
2. `--glass-blur` → forza del vetro (es. 12 / 16 / 20 / 24).
3. `--accent` + `--gradient-btn` → tonalità delle CTA.
4. `--border-glow` + `--ring-focus` → stati focus/hover.
5. `--shadow` / `--shadow-lg` / `--shadow-inset-card` → profondità card/overlay.

La maggior parte dei componenti legge questi token via alias e si adatta da sola.

### QA minimale consigliato (non bloccante per il commit)

- Verifica contrasto testi su card light/dark (soprattutto `.geocode-card` / `.dtg-card`).
- Verifica focus visibile su `input`/`select` dentro `.hdr-chip` (potrebbe servire un override locale se la ring si nota troppo).
- Verifica leggibilità tooltip su base molto chiara (testo bianco su tooltip `rgba(15,23,42,.92)` → OK).
- Test drawer/modal: `Esc` chiude in ordine `convert → tools → drawer` (logica JS invariata).

### File toccato

- `coordinate_converter Claude.html` — **solo** blocco `<style>` (da ~line 7 a ~line 3503). Nessun'altra porzione.

---

## Checkpoint 2026-04-24 — WaypointModal manager split

### Perché

Il tab **Waypoint** in topbar puntava per alias alla stessa sezione del Track (`GIS_TAB_SECTIONS.waypoints === "sec-track"`), quindi waypoint autonomi e vertici della traccia condividevano UI e spazio visivo. Per un pianificatore GIS-first serviva un **manager dedicato**: list + editor inline + import/export GeoJSON separato, con pattern modale coerente a `convertModal` / `toolsModal`.

### Cosa è cambiato

1. **Sezione HTML dedicata** (`<details id="sec-waypoints">`) aggiunta nel `<main>` subito dopo `sec-track`. Contiene la propria toolbar (Nuovo / Pick sulla mappa / Importa GeoJSON / Esporta GeoJSON / Svuota tutto), un `<div id="waypointEditor" hidden>` con editor inline (nome, coord free-text con `autoDetect`, icona NATO `<select>`, colore, note) e `<div id="wp-list">` sincronizzato con `state.mapWaypoints`.
2. **Nuovo `<dialog id="waypointModal" class="app-modal waypoint-modal">`** accanto a `convertModal` / `toolsModal`. `sec-waypoints` viene **riparentato** nel body del dialog via `gisMoveSectionTo` (no clone), ripristinato al close via `gisRestoreSection`.
3. **Pattern "tab-as-modal"**: introdotta costante `GIS_TABS_AS_MODAL = new Set(["waypoints"])`. `activateTab` / `deactivateTab` hanno un branch early-return che delega apertura/chiusura al coppia `openWaypointModal` / `closeWaypointModal`. `GIS_TAB_SECTIONS.waypoints` ora punta a **`"sec-waypoints"`** (non più alias di `sec-track`).
4. **Manager JS** (`openWaypointModal`, `closeWaypointModal`, `renderWpModalList`, `openWaypointEditor`, `closeWaypointEditor`, `onEditorCoordInput`, `commitWaypointEditor`, `waypointUpdate`, `waypointDelete`, `waypointsClearAll`, `waypointsZoomTo`, `waypointsImportGeoJSON`, `waypointsExportGeoJSON`). Tutti additivi. `renderMapWaypointsAll()` chiama ora anche `renderWpModalList()` per mantenere in sync la lista del modal.
5. **Validazione coordinate**: input libero → `autoDetect(str)` (BNG / SK42 / PlusCode / MGRS / UTM / lat-lon free-text) → `validateLatLon` + clamp `lat ∈ [-90,90]`, `lon = normalizeLon(lon)`. Feedback inline con `aria-invalid` e localizzato (`err.notRecognized`).
6. **Import / Export GeoJSON**: import via `spatialGeojsonTextToFeatureCollection` + filtro `Point` + cap 200 con `confirm()` di troncamento al residuo (i18n `waypointModal.capWarn`). Export tramite `spatialBuildFeatureCollectionFromAppState` filtrato a `properties.kind === "waypoint"`, arricchito localmente con `color` / `notes` (non emessi dal builder canonico), `metadata = { generated, dtg, creator, kind: "waypoints" }`, filename `waypoints-<DTG>.geojson`.
7. **Hook mappa**: 1 branch in `renderTileMap > onUp` — quando `state.waypointsModalOpen` e si è in `waypointPickMode`, il click sulla mappa alimenta **direttamente** `state.waypointEditorDraft` e apre `#waypointEditor` invece del `.tile-waypoint-editor` on-map. Resto invariato.
8. **gisInit**: nuovo cablaggio per `#waypointModalClose`, evento `cancel` (Esc nativo del `<dialog>`), click sul backdrop (`ev.target === dlg`) e tutti i bottoni del manager (`#wpAddBtn`, `#wpPickBtn` → `trackToggleWaypointPickMode`, `#wpImportBtn`/`#wpImportFile`, `#wpExportBtn`, `#wpClearBtn`, editor save/cancel/delete, `#wpFieldCoord` input). Idempotente (attaccato una sola volta a elementi che vengono riparentati, non clonati).
9. **i18n**: chiavi `waypointModal.*` (title, hint, new, pickOnMap, importGeoJSON, exportGeoJSON, clearAll, empty, unnamed, capWarn, capFull, importEmpty, importedN, exportedN, clearConfirm, deleteConfirm, zoomTo, editor.newTitle/editTitle/edit/name/namePh/coord/coordPh/icon/color/notes/notesPh/save/cancel/delete) + `tip.waypointModal.*` in **IT / EN / FR**.
10. **Persistenza / sanitize**: niente di nuovo persistito (`state.waypointsModalOpen`, `state.waypointEditorDraft` transient come `convertOpen` / `toolsMenuOpen`). Sanitize load **esteso** per `state.mapWaypoints`: whitelist di `meta.from` (≤40), `meta.icon` (solo se in `TRACK_WPT_ICON_SET`), `meta.color` (via `sanitizeTrackColor`), `meta.notes` (≤500); tutto il resto viene droppato difensivamente.

### Invarianti nuovi (→ `.cursor/rules/99-known-state.mdc`)

- `state.mapWaypoints` è l'**unica** fonte di verità (il modal non duplica l'array).
- Il modal **riparenta** `sec-waypoints` — non clona — seguendo il pattern di `convertModal` / `toolsModal`.
- `state.waypointsModalOpen` e `state.waypointEditorDraft` sono **transient**.
- Cap **200 waypoint** rispettato anche in import (residuo calcolato + `confirm()`).

### Architettura aggiornata (→ `.cursor/rules/10-html-architecture.mdc`)

- Section ids GIS hub ora elencano `sec-waypoints`.
- Nuova sottosezione **"Tab-as-modal pattern (waypoints)"** documenta `GIS_TABS_AS_MODAL`, la delega activateTab → opener, la persistenza di `state.activeTab === "waypoints"` (riapre il modal al reload).

### File toccati

- `coordinate_converter Claude.html` — HTML (nuova `sec-waypoints` + `<dialog id="waypointModal">`), CSS (~30 righe per `.wp-list` / `.wp-row` / `.wp-editor` / `.wp-toolbar`, tokens esistenti, nessuna nuova variabile), JS (~320 righe aggregate), i18n (IT/EN/FR), sanitize load, hook mappa (+1 branch).
- `.cursor/rules/10-html-architecture.mdc` — sec-waypoints in lista + nuova sottosezione tab-as-modal.
- `.cursor/rules/99-known-state.mdc` — sottosezione *"Waypoints modal (split from sec-track)"*.
- `docs/checkpoint.md` — voce "Ultimo cambio feature".
- `docs/PROJECT_notes.md` — §9 "COSE FATTE (ultime)" con la voce WaypointModal.

### QA minima (locale)

1. Add manuale con coord MGRS → persistenza dopo reload.
2. Pick sulla mappa → draft → editor precompilato → Save.
3. Edit inline (cambio nome / coord) → persist + overlay mappa aggiornato.
4. Delete + Clear all (con `confirm`).
5. Import GeoJSON (5 Point, 1 con lat fuori range) → 4 importati, 1 scartato.
6. Export GeoJSON → file valido, solo `kind:"waypoint"`, `metadata.dtg` presente.
7. Esc chain: Esc chiude modal e rilascia `sec-waypoints` in `<main>`.
8. Reload con `activeTab === "waypoints"` → modal si riapre.
9. `opsecStrict` non impedisce import/export (non sono fetch).
10. Switch lingua IT/EN/FR → titoli modal/editor aggiornati senza re-render distruttivo.

---

## Checkpoint 2026-04-24 — Cleanup pre-GIS (rename + rimozione DTG / Live Tracking / Radius/LOS)

### Perché

Pulizia di superficie **prima** di iniziare il GIS progressive plan. Motivazioni strategiche:

- Ridurre il file HTML di ~1.000 righe per recuperare margine sotto la soft-threshold del monolite (§4.8) prima di iniziare l'addizione GIS.
- Rimuovere superficie (DTG, Live Tracking, Radius/LOS) che altrimenti le fasi 9/10 del GIS plan dovrebbero mantenere inutilmente.
- Separare **sottrazione** e **addizione** in commit distinti per rendere bisect di regressioni banale.
- Rebranding strategico: l'app non è più un "Convertitore Coordinate" ma un **GOI GIS Tool** a tutti gli effetti (conversione resta funzionalità, non è più il titolo).

### Cosa è cambiato

1. **Rename globale** `Convertitore Coordinate` / `Coordinate Converter` → **GOI GIS Tool**. Toccati: `<title>`, `<h1 data-i18n="app.title">` (IT/EN/FR tutti "GOI GIS Tool"; brand non tradotto), `<span data-i18n="footer.appName">`, `<gpx creator="...">` in tutti i builder (`buildGPX`, `buildGPXRoute`, `spatialGeoJSONToGpx`), `<name>` in KML, `metadata.creator` in GeoJSON (`buildGeoJSON`, `buildGeoJSONRoute`, `spatialBuildFeatureCollectionFromAppState`, waypoint export), commento CSV batch. Il titolo del modal di conversione (`convert.title`) è rimasto descrittivo ("Convertitore — inserisci coordinate" IT) perché è il titolo di una *funzione*, non del brand.
2. **Rimozione Radius/LOS tools**: eliminata `<details id="sec-range">` completa, tile `data-tool="range"` dal `toolsModal`, `state.rangeOverlay`, `GIS_TOOL_SECTIONS.range`, funzioni `onRangeDraw/onRangeClear/onRangeGeo/buildRangePolygon`, event listeners `btnRangeDraw/Clear/Geo`, assertion self-check, tutte le chiavi i18n IT/EN/FR (`sec.range`, `range.*`, `tools.range`, `tip.range`), whitelist sanitize `rangeOverlay`. Grep `sec-range|rangeOverlay|buildRangePolygon` → 0 match.
3. **Rimozione Live Tracking**: eliminato `<button id="btnGeoLive">` + `<span id="geoLiveBadge">`, CSS `.geo-nav-btn#btnGeoLive.is-live` + `@keyframes geoLivePulse`, `state.geoWatchId`, funzioni `updateGeoLiveBadge/startLocationTracking/stopLocationTracking/onBtnGeoLiveClick`, chiamate da `renderResults/refreshGeolocationBarriers/requestCurrentLocation/clearForm`, event listener `btnGeoLive`, i18n `btn.geoLive`/`badge.geoLive`/`tip.geoLive` IT/EN/FR. **Invariante preservato**: `btnMyLocation` single-shot resta intatto, così come `navigator.geolocation.getCurrentPosition` e tutto l'opt-in/OPSEC geo. Solo `watchPosition` sparisce.
4. **Rimozione DTG completa** (la più invasiva — ~800 righe nette):
   - **HTML**: tab `<button data-tab="dtg">` dal topbar, `<details id="dtgCard">` intera sezione, tile `data-tool-target="dtgCard"` dal `toolsModal`, sezione DTG da help guide (`mg-card`), righe shortcut `help.kbd.dtgFocus/dtgNow` dall'help overlay.
   - **JS core**: intera `SECTION 14K: DTG (Date-Time Group NATO)` — `DTG_MONTHS`, `DTG_TZ`, `DTG_TZ_MAP`, `dtgTzOffset/dtgTzName/dtgOffsetPretty`, `formatDTG`, `parseDTG`, `getCurrentDTG`, `dtgToUTC`, `dtgToLocalTime`, `bindDTG`, `focusDTGCard`. Rimossa `GIS_TAB_SECTIONS.dtg` e `GIS_TAB_TITLE_KEY.dtg`. Rimosso `state.dtgTz`, `state.dtgShort` dall'initializer.
   - **Callsite**: history entry senza campo `dtg` + render senza `dtgHtml` + compat backward cancellata; favorite add/render idem; permalink `encodePermalink`/`readPermalink` senza `&dtg=` (solo `#ll=` / `#mgrs=`); export metadata (`buildGPX/KML/GeoJSON`, `buildGPX/KML/GeoJSONRoute`, `spatialGeoJSONToGpx/Kml`, `spatialBuildFeatureCollectionFromAppState`, waypoint export, CSV batch) — nessun `metadata.dtg`, nessun `<desc>DTG: ...</desc>` in GPX, nessuna `<description>DTG: ...</description>` in KML; boot permalink senza `applyPermalinkDtg`; session export/import senza `dtgTz/dtgShort`; store load senza lettura `stored.settings.dtgTz/dtgShort`.
   - **Shortcut**: rimosso `bindHotkeys` branch `Alt+T`/`Alt+Shift+T`/`Ctrl+T`/`Ctrl+Shift+T` e la chiamata a `bindDTG()` in `init()`.
   - **i18n**: rimosse tutte le chiavi `sec.dtg`, `dtg.*` (25+), `tabs.dtg`, `tabs.dtg.tip`, `tools.dtg`, `tools.dtg.desc`, `help.guide.dtg.*`, `help.kbd.dtgFocus/dtgNow` in **IT / EN / FR**. Audit finale: grep `"dtg` in JSON dict → 0 match.
   - **Self-check**: rimossi i 9 `console.assert` su `formatDTG`/`parseDTG`/`DTG_TZ` dalla `SECTION 25: INIT (+ self-check)`.
   - **CSS**: rimosse regole `.dtg-card`, `.dtg-sum-icon`, `.dtg-now-inline`, `.dtg-body`, `.dtg-now-row`, `.dtg-lbl`, `.dtg-tz-select`, `.dtg-hintchk`, `.dtg-display`, `.dtg-display-actions`, `.dtg-input`, `.dtg-parse-out` + override mobile.
5. **LocalStorage bump** `coordconv_v1` → `coordconv_v2`. La chiave v1 **resta** in `localStorage` del browser ma non è più letta (scelta confermata dall'utente: "drop and bump", fresh start per tutti). Commento in-code dettagliato motiva il bump per chi rileggerà il file. Favorites / history / mapWaypoints / named areas / settings dell'utente esistenti vengono di fatto azzerati al primo boot post-upgrade.

### Invarianti aggiornati

- **Geolocation**: ora **solo single-shot** (`getCurrentPosition` via `btnMyLocation`). `watchPosition` è stato rimosso; reintrodurlo richiede decisione esplicita. OPSEC + secure context invariati.
- **Storage**: chiave corrente **`coordconv_v2`**. Tutto ciò che era persistente prima resta persistibile ora, solo lo schema è ripartito pulito.
- **Brand**: "GOI GIS Tool" in tutti gli asset export (GPX/KML/GeoJSON `creator`). Favorisce audit post-hoc dei file generati.

### File toccati

- `coordinate_converter Claude.html` — **unico file di codice**. Rimozioni nette: ~1.000 righe (CSS + HTML + JS + i18n + self-check).
- `.cursor/rules/00-project-core.mdc` — rename header/description.
- `.cursor/rules/10-html-architecture.mdc` — rimosso `dtgCard` dalla lista section-ids + `sec-range` dai tool modal ids; `coordconv_v1` → `coordconv_v2` con nota bump; `watchPosition` → single-shot only.
- `.cursor/rules/20-domain-knowledge.mdc` — **rimossa intera sezione** "DTG NATO (Date-Time Group)"; header description e titolo aggiornati.
- `.cursor/rules/99-known-state.mdc` — invariante live tracking → single-shot; nota rimozione watchPosition; chiave v2.
- `docs/checkpoint.md` — aggiornato titolo + "Ultimo grande cambio" (cleanup pre-GIS) + righe tabella rules + invarianti geolocation.
- `docs/PROJECT_notes.md` — titolo/brand; chiave v2; rimossa riga DTG da tabella stack; aggiornato §4 status feature (rimosso DTG/Range/Live, menzione rename in export); aggiunta voce §9 "COSE FATTE" per il cleanup.
- `docs/session-geolocalizzazione-e-mappa.md` — **questo checkpoint**.

### NON toccato (volutamente)

- `docs/roadmap.md` §7 — il riferimento dottrinale a DTG / STANAG come standard **esterno** resta documentato, anche se l'app non implementa più il parser. È un riferimento consultabile, non una feature promessa.

### QA minima (locale, browser)

Prima di procedere con Fase 1 GIS plan:

1. Boot `file://.../coordinate_converter Claude.html` → nessun errore console, mappa visibile.
2. Titolo tab browser = "GOI GIS Tool"; header e footer coerenti.
3. Topbar mostra tabs `track / waypoints / measure / favorites / geocoding / history / layers` (DTG assente).
4. Apri "Altri strumenti" → tile presenti: Batch, Note, Sessione, Astro, Magnetico (nessun DTG, nessun Range/LOS).
5. Aggiungi favorite → persistenza su reload (stato v2 fresco).
6. Export waypoint GeoJSON → `metadata` contiene `generated` + `creator: "GOI GIS Tool"` + `kind: "waypoints"` (**no** campo `dtg`).
7. Export GPX → `<gpx creator="GOI GIS Tool">` + `<metadata><time>...</time></metadata>` (no `<desc>DTG: ...</desc>`).
8. Geolocation: `btnMyLocation` funziona (single-shot); nessun pulsante "Tracking live" presente.
9. Switch i18n IT → EN → FR: nessuna stringa "—" placeholder, nessun crash.
10. DevTools → localStorage: chiave `coordconv_v2` presente; la vecchia `coordconv_v1` (se era presente da prima) rimane ma viene ignorata.
11. Console self-check: nessun `console.assert` fallito (le 9 asserzioni DTG sono state rimosse).
12. Permalink: `#ll=45.46,9.19` funziona (niente `&dtg=...` nella URL generata).

### Prossimo passo

Commit cleanup → ritorno in Plan mode per **Fase 1 del GIS progressive plan** (data model GeoJSON + CRUD + scaffolding undo). Vedi `.cursor/plans/gis_progressive_plan_aef64b4b.plan.md`.

---

## Checkpoint 2026-04-24 — GIS Phase 1 (fondazione GeoJSON invisibile)

### Decisioni operative

- Phase 1 è rimasta **invisibile**: nessuna nuova UI, nessuno stub Layers, nessun pannello debug.
- Modello dati confermato: **ibrido pigro**. `state.mapWaypoints[]` resta la fonte canonica dei waypoint; `state.track` resta il builder legacy; i nuovi store GeoJSON-native partono in parallelo.
- Priorità successiva: **WaypointModal enrichment** con categorie generiche, non APP-6/MIL-STD-2525 completo.
- Tile/cache futura: smart cache solo come **opt-in persistente** in fase dedicata; nessun download automatico introdotto qui.

### Cosa è cambiato nel codice

1. Aggiunti cap e seed layer:
   - `GIS_TRACK_CAP = 50`
   - `GIS_POLYGON_CAP = 50`
   - `GIS_LAYER_CAP = 20`
   - `GIS_ACTION_STACK_CAP = 100`
   - seed `lay-seed-waypoints`, `lay-seed-tracks`, `lay-seed-polygons`
2. Esteso `state` con:
   - `gisTracks: []`
   - `gisPolygons: []`
   - `gisLayers: []`
   - `gisSelection: []` transient
   - `undoStack: []` / `redoStack: []` transient
3. Estesa persistenza `coordconv_v2`:
   - `gisTracks`, `gisPolygons`, `gisLayers` vengono salvati e ripristinati.
   - `gisSelection`, `undoStack`, `redoStack` **non** vengono salvati.
   - load/save passa da sanitize/clamp dedicati: feature GeoJSON valide, string caps, coordinate clamp, cap array, seed layer sempre presenti.
4. Aggiunta sezione JS `SECTION 18B: GIS DATA MODEL (Phase 1)`:
   - sanitize helper: `gisSanitizeCoordinate`, `gisSanitizeGeometry`, `gisSanitizeProperties`, `gisSanitizeFeatureArray`, `gisSanitizeLayerArray`.
   - stato helper: `ensureGisState()`, `gisSyncLayerFeatureIds()`.
   - CRUD feature: `gisFeatureAdd`, `gisFeatureUpdate`, `gisFeatureDelete`, `gisFeatureGet`.
   - CRUD layer: `gisLayerAdd`, `gisLayerUpdate`, `gisLayerDelete`, `gisLayerGet`.
   - undo scaffold: `gisActionRecord()` registra record transient e resetta `redoStack`, senza UI/shortcut.
   - read-lens: `gisAllAsFeatureCollection(opts)` emette una FeatureCollection GeoJSON con waypoint esistenti + `gisTracks` + `gisPolygons`.
5. Esteso `runSelfCheck()` (`?debug`):
   - FeatureCollection vuota valida.
   - Seed layer presenti.
   - Undo scaffold registra record transient.
   - CRUD accetta LineString e Polygon.
   - Read-lens include track/polygon nuovi.
   - `saveStore()` / `loadStore()` preservano gli store GIS ma non `undoStack`/`redoStack`/`gisSelection`.

### Invarianti

- Nessuna nuova UI in questa fase.
- Nessuna rinomina `layers` → `basemap` ancora.
- Nessun editor track/polygon ancora.
- Nessuna attivazione globale Ctrl/Cmd+Z.
- `mapWaypoints[]` non è stato migrato né duplicato: la FeatureCollection è una vista, non una nuova fonte di verità waypoint.
- Le feature line/polygon v1 supportano solo `LineString` e `Polygon` single-ring; niente Multi*, holes o self-intersection validation avanzata.

### QA

- `ReadLints` su `coordinate_converter Claude.html`: nessun errore IDE.
- QA runtime browser/manuale ancora da fare: boot app, `?debug` self-check, flussi legacy Convert / WaypointModal / track / favorites.

---

## Checkpoint 2026-04-24 — UI tokens semantici + glass sweep (solo CSS)

### Perché

Il precedente restyle glass aveva già applicato blur/ombre/Inter, ma la cima dello `<style>` mescolava ancora valori concreti (`rgba(...)`, pixel) con i token esposti. Rendeva fragili i prossimi refresh: per cambiare look bisognava toccare più punti del foglio. Questa passata separa i livelli:

- livello 1: **token semantici** (`--surface-*`, `--radius-*`, `--shadow-*`, `--border-hairline`, `--border-glow`, `--map-control-*`, `--tooltip-*`).
- livello 2: **alias legacy** (`--bg`, `--panel`, `--panel2`, `--text`, `--muted`, `--border`, `--shadow`, `--shadow-lg`) derivati dai semantici, per non toccare centinaia di reference nel resto del foglio.

### Cosa è cambiato (solo `<style>`)

1. **Design tokens** in `:root[data-theme="light"]` e `:root,:root[data-theme="dark"]`: aggiunte variabili semantiche + riassegnati gli alias legacy come `var(--surface-*)` / `var(--shadow-*)`. I componenti continuano a funzionare senza modifiche; i refresh futuri si fanno in cima al foglio.
2. **Body background**: gradienti radiali sottili (accent blu + violetto) sopra `--bg` per dare profondità.
3. **Card/pannelli** (`.paste-section`, `.paste-section + .input-col`, `.input-col`, `.results-col`, `.maps-col`, `.result-card`, `.modal`, `.mini-map`) passano a `--radius-card`, glass blur coerente, ombra elevata.
4. **Form controls** (`input[type=text|number]`, `textarea`, `select`): sfondo `--surface-field`, `--radius-control`, focus `--ring-focus`.
5. **Bottoni** (`.btn`): radius e hover tramite token; stile primario conservato.
6. **Overlay** (`.modal-overlay`, `dialog.app-modal`, `.tools-drawer`, `.tools-drawer-backdrop`, `.tab-drawer`, `.tab-drawer-head`, `.app-topbar`, `#appTopbar`, `.app-modal-head`): blur coerente, `--radius-card` su dialog/drawer, head gradienti con `--surface-glass-hover`.
7. **Mappa** (`.tile-map .tile-recenter/.tile-pick/.tile-cov`, `.tile-zoom`, `.tg-btn`, `.tcov-btn`, `.tile-size`, `.tlayer-btn`, `.tlayer-menu`, `.tlayer-item`, `.mini-map .mm-offline-size`): controlli dark unificati su `--map-control-bg` / `--map-control-border`, radius da `--radius-chip`; il menu basemap è ora glass coerente con modal/drawer.
8. **Tooltip** (`[data-tip]:hover::after`) unificato su `--tooltip-bg` / `--tooltip-fg`.

### Non cambiato

- Zero modifiche a HTML, classi, id, `data-*`, JavaScript.
- Nessuna nuova regola layout: solo sostituzioni mirate di valori hard-coded con token.
- Nessun cambio di behaviour su hover/active/focus/open/hidden: stessi selectors, solo valori.

### QA

- `ReadLints` su `coordinate_converter Claude.html`: nessun errore.
- QA runtime browser/manuale ancora da fare: hover su controlli mappa, apertura modal/drawer, focus visibile su input, menu basemap, contrasto light vs dark.

---

## Checkpoint 2026-04-25 — Waypoint Manager: export GPX / KML / KMZ / CSV

### Perché

Il Waypoint Manager (`#sec-waypoints` / modal) esponeva già import ed export **GeoJSON**; mancavano formati vettoriali comuni (GPX, KML, KMZ, CSV) allineati al resto dell’app (stessi builder, stesso vincolo single-file, i18n obbligatorio).

### Cosa è cambiato (solo monolite, additivo)

- Nuova funzione `waypointsExport(kind)` con `kind` ∈ `gpx`, `kml`, `kmz`, `csv`.
- Pre-mapping da `state.mapWaypoints` a `points` con shape `{ lat, lon, name, desc: (w.meta && w.meta.notes) || "" }` così le note finiscono in `<desc>` / description (GPX, KML) e colonna description (CSV) senza duplicare logica.
- Reuso builder esistenti, senza modificarli:
  - gpx → `buildGPX(points)`
  - kml → `buildKML(points)`
  - kmz → `buildKmz(buildKML(points), "doc.kml")` (stesso pattern di `exportTrack("kmz")`)
  - csv → `buildCsv(points)`
- Stesso pattern di `waypointsExportGeoJSON`: elenco vuoto → `setBadge("info", t("waypointModal.empty"))`; file `waypoints-<timestamp>.<ext>`; successo con `t("waypointModal.exportedN")` e `{0}` = numero waypoint.
- Toolbar: quattro `button#wpExportGpx` … `wpExportCsv` accanto a `#wpExportBtn` (GeoJSON invariato).
- `bindUI()`: listener subito dopo il blocco `#wpExportBtn`.
- i18n IT/EN/FR: `waypointModal.exportGpx|Kml|Kmz|Csv` e `tip.waypointModal.export*`.

### File toccati

- `coordinate_converter Claude.html` (HTML, JS, dizionari i18n).

### Non cambiato

- `exportTrack`, `buildCsvFromTrack`, e tutti i builder condivisi (`buildGPX`, `buildKML`, `buildKmz`, `buildCsv`) restano invariati rispetto a questa attività.

### QA

- `ReadLints` sul monolite: nessun errore.

---

## Checkpoint 2026-04-25 — GIS floating panels e UI polish

### Perché

Dopo la migrazione verso layout GIS-first, vari pannelli e controlli vivevano ancora come modali o overlay poco coerenti con la mappa full-screen. La sessione ha stabilizzato il modello “pannelli flottanti” per mantenere la mappa cliccabile e ridurre interferenze tra toolbar, basemap, Track/Waypoint e strumenti accessori.

### Cosa è cambiato

1. **Pannelli GIS flottanti**
   - Introdotti helper condivisi per portare pannelli in primo piano, salvare/clampare layout, applicare posizione/dimensione, drag e resize.
   - Track, Waypoint, Convert, Search, Favorites e Layers usano handle di resize coerenti e z-index ordinati sopra la mappa.
   - Search/Favorites/Layers hanno dialog dedicati (`searchPanel`, `favoritesPanel`, `layersPanel`) con body reparentabile.

2. **Track workflow**
   - Aggiunti controlli e stringhe i18n per pausa/riprendi inserimento, termina traccia, nuova traccia, stato traccia, prompt salvataggio e “continua modifica”.
   - La lista punti può essere collassata quando cresce, con heading/summary dedicati.
   - Il click mappa in modalità track usa una logica differita per distinguere inserimento punti e doppio click di completamento.

3. **UI chrome e controlli mappa**
   - Header/settings consolidati in menu dedicato.
   - Azioni GIS integrate nell’header invece di restare come overlay flottante separato.
   - Controlli basemap/layer riposizionati e clampati via JS per evitare collisioni con tooltip e bordo viewport.
   - Waypoint e Convert funzionano come pannelli non bloccanti in GIS mode.

### File toccati

- `coordinate_converter Claude.html`

### Invarianti

- App ancora single-file HTML, vanilla JS, nessuna dipendenza CDN.
- Nessuna introduzione di framework/build step.
- Nessun cambio intenzionale ai formati export Waypoint Manager della sessione precedente.

### QA

- Commit di riferimento: `b2546e0` (`Stabilize GIS floating panels and UI polish`).
- QA runtime consigliata: aprire/trascinare/ridimensionare Track, Waypoint, Convert, Search, Favorites, Layers; verificare inserimento traccia, doppio click di completamento, basemap menu e click mappa sotto i pannelli.

---

## Checkpoint 2026-04-26 — Offline areas list + bbox feedback

### Perché

Il pannello download tile offline aveva già bbox su mappa e salvataggio aree con nome, ma mancava un **elenco gestibile** delle aree salvate (visibilità, stato cache, azioni rapide) e un feedback testuale chiaro quando l’area selezionata è pronta per il download o quando non c’è selezione.

### Cosa è cambiato

1. **UI elenco aree offline** (`#offlineAreasSection`)
   - Toolbar con conteggio selezione, azioni bulk (mostra/nascondi selezionate, elimina da elenco), «Usa area» e «Centra» su selezione.
   - Lista/tabella con colonne nome, stato, date, zoom, strato, tile, spazio, azioni per riga; badge stato (sconosciuto / parziale / completo / errore) con tema chiaro/scuro.
   - Rendering aggiornato da `renderOfflineAreasList()` e stato toolbar da `updateOfflineAreasToolbarUI()`; etichette stato via `offlineAreaStatusLabel()`.

2. **Feedback bbox** (`#pcBboxFeedback`)
   - Messaggio primario/secondario `aria-live` collegato alle stringhe `offcache.bboxFeedback*` (selezione / pronta / nessuna area).

3. **Stile overlay bbox**
   - Overlay rettangolo: bordo tratteggiato, z-index rialzati per restare sopra altri layer mappa; handle e pulsante rimozione allineati.

4. **i18n**
   - Nuove chiavi IT/EN/FR: `offcache.list.*`, `offcache.sel.*`, `offcache.area.*`, `offcache.bboxFeedback*`, ARIA resize/remove bbox.

### File toccati

- `coordinate_converter Claude.html`

### Invarianti

- Nessun download tile automatico aggiunto: le azioni restano su input esplicito utente; eliminazione da elenco non implica necessariamente wipe cache (come da copy nei confirm).

### QA

- Apri tab/pannello Mappa/Offline: verifica rendering lista con 0 / N aree, selezione multipla, mostra/nascondi su mappa, «Usa area» → campi N/S/E/W, «Centra», eliminazione con confirm.
- Disegna bbox: verifica messaggio feedback e overlay sopra controlli mappa.

---

## Checkpoint 2026-04-26 — Offline areas O1-O4c

### Perché

La gestione aree offline aveva bisogno di diventare operativa senza introdurre uno store parallelo o toccare la cache tile fisica: le tile IndexedDB restano sparse per `layerId:z/x/y`, mentre `state.namedAreas[]` diventa il registro metadata canonico per bbox salvati, stato, visibilità e azioni utente.

### Cosa è cambiato

1. **Metadata retrocompatibili su `state.namedAreas[]` (O1)**
   - Aggiunti helper di normalizzazione/sanitize (`normalizeOfflineArea`, `sanitizeNamedAreas`, `getCurrentOfflineLayerId`, stima tile) con fallback legacy: `layerId: null`, `status: "unknown"`, `visible: true`, `updatedAt` da `createdAt`.
   - `saveNamedArea()` arricchisce i nuovi record con layer corrente, timestamp, stima tile, status prudente.
   - `onPrecacheStart()` aggiorna metadata di un'area già corrispondente a fine download/abort/error, senza auto-creare record e senza modificare download core.

2. **Tabella aree offline nel pannello Mappa/Offline (O2-O4b)**
   - `#offlineAreasSection` / `#offlineAreasList` renderizzano una tabella ordinabile con colonne: selezione, visibilità, nome, stato, data, zoom, strato, tile, spazio, azioni leggere.
   - Ordinamento transient in `state._offlineAreasSort`, non persistito.
   - Card iniziali sostituite da tabella compatta ispirata alla lista tracce salvate.

3. **Azioni metadata-only (O3/O4/O4c)**
   - Visibilità persistente per area (`visible`) con checkbox in colonna `Vis.` e batch Mostra/Nascondi selezionate.
   - Eliminazione aree dalla tabella solo metadata: rimuove record da `state.namedAreas[]`, aggiorna lista/optgroup/overlay, **non cancella tile** e non chiama `deleteNamedAreaTiles()` dalle nuove azioni.
   - Rimosso il canale distruttivo sulla mappa: l'overlay named area non mostra più la X di delete.

4. **Selezione multipla batch (O4c)**
   - Stato transient per id: `state._offlineAreasSelectedIds` + `state._offlineAreasLastSelectedIndex`.
   - Checkbox riga, checkbox header select-all con stato indeterminate, shift-click per intervallo secondo ordine visibile, ctrl/cmd-click per toggle singolo.
   - Toolbar batch esterna con conteggio selezionate: Mostra selezionate, Nascondi selezionate, Elimina selezionate; «Usa area» e «Centra» sono abilitati solo con una singola area selezionata.
   - Nessun batch download/pre-cache implementato in questa fase.

5. **i18n e CSS**
   - Nuove chiavi IT/EN/FR sotto `offcache.list.*`, `offcache.sel.*`, `offcache.area.*`.
   - CSS `.offline-areas-*` per toolbar, tabella, righe selezionate, badge stato, colonne compatte.

### File toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti

- Nessun nuovo `offlineAreas[]`, nessun nuovo storage e nessuna modifica allo schema IndexedDB.
- Download/cache/coverage tile verde restano invariati; il pre-cache parte ancora solo dal pulsante `Pre-cache area`.
- Eliminazione in lista e batch è metadata-only: le tile già scaricate restano nella cache.

### QA

- Parse JS dell'intero `<script>` con `new Function(...)`: OK durante la sessione.
- QA manuale consigliata: aprire Mappa/Offline, ordinare colonne, selezionare singola/multiple aree, shift-click, select-all, mostra/nascondi, elimina metadata-only, usare/centrare area singola, verificare che refresh azzeri la selezione transient ma conservi metadata/visibilità.

---

## Checkpoint 2026-04-26 — Cursor workspace memoria/editor

### Perché

Il monolite `coordinate_converter Claude.html` (~26k righe, ~1 MB) e file generati grossi (es. `repomix-output.xml`) tendono ad aumentare RAM/CPU dell’editor (tokenizzazione, language service, watcher, search). Serviva una configurazione **solo workspace** per mitigare senza toccare roadmap (single-file, no split, no build).

### Cosa è cambiato

- `Cursor.code-workspace` → `settings` con:
  - `editor.largeFileOptimizations: true`
  - `typescript.tsserver.maxTsServerMemory: 2048`
  - `typescript.disableAutomaticTypeAcquisition: true`
  - `typescript.suggest.autoImports` / `javascript.suggest.autoImports`: false
  - Override `[html]`: `editor.quickSuggestions` tutti false, `editor.suggestOnTriggerCharacters: true`, `editor.wordBasedSuggestions: "off"`
  - `files.watcherExclude` e `search.exclude`: repomix (`*.xml`), backup, `~`, cartelle `backup/` / `backups/`, `.git/objects` e subtree-cache
  - `files.exclude`: solo `repomix-output*.xml` (tree più leggero)
- **Non** esclusi `docs/`, `docs/roadmap.md`, `docs/checkpoint.md`, `docs/PROJECT_notes.md`, `docs/session-geolocalizzazione-e-mappa.md`.

### File toccati

- `Cursor.code-workspace`

### Invarianti

- Nessuna modifica al monolite, alle rules, né alla logica applicativa.

### QA

- Riaprire workspace in Cursor e verificare che `repomix-output.xml` non compaia nel file tree se presente in root; cercare in workspace che `docs/*` resti indicizzabile.
- Monitorare RAM dopo qualche minuto con Process Explorer (confronto prima/dopo orientativo).

---

## Checkpoint 2026-04-26 — Region markers, persistent UI Fase 1, micro UX

### Perché

Dopo l’ottimizzazione workspace, serviva rendere il monolite più navigabile in editor (folding) e introdurre una persistenza **separata e controllata** solo per il layout dei pannelli GIS floating, senza toccare `coordconv_v2` oltre a `clearStore` coordinato, senza IndexedDB tile e senza salvare stato modale o coordinate.

### Cosa è cambiato

1. **Region markers (solo commenti)**
   - **CSS** in `<style>`: 15 coppie `/* #region CSS — … */` / `/* #endregion CSS — … */` allineate a blocchi esistenti (tokens, layout, mappe, GIS, modali, ecc.).
   - **JavaScript** in `<script>`: macro-regioni `// #region JS — …` consolidate (11 coppie), es. `TILE MAP INDEXEDDB OFFLINE CACHE AND BBOX`, `TRACK WAYPOINT GIS LAYERS AND TOOLS`, `UI BINDINGS AND GIS HUB`, ecc.

2. **Persistent UI — Fase 1 (solo geometria pannelli)**
   - Nuova chiave **`coordconv_ui_v1`** in `localStorage` con `{ uiVersion: 1, panels: { … } }`.
   - Whitelist chiavi pannello: `track`, `waypoint`, `convert`, `search`, `favorites`, `layers`; campi per pannello: `left`, `top`, `w`, `h`, `touched`.
   - Funzioni: `captureUiState`, `sanitizeUiState` (numeri finiti + clamp via `gisPanelClampRect` + opts per pannello), `loadUiState`, `saveUiState`, `applyUiState`, `scheduleSaveUiState` (debounce ~260 ms).
   - Salvataggio invocato **solo a fine drag/resize** se il gesture ha effettivamente mosso (`moved`), non per-pixel.
   - `applyUiState()` dopo `gisInit()` in `init()`; per ogni dialog già `open`, `gisPanelApplyLayout` se esiste.
   - `clearStore()` rimuove anche `coordconv_ui_v1`.

3. **Micro UX**
   - Tooltip `tip.offlineHints` (IT/EN/FR) chiarito: tile live vs tile già in cache offline.
   - CSS `.bbox-move`: area di trascinamento intero rettangolo (`inset:0`) così i bbox piccoli restano trascinabili; handle e × restano sopra per hit-test.

### File toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti

- Nessun nuovo store reattivo; nessun cambio a schema IndexedDB tile, download offline, parser, export/import, geocoding, CRS/datum.
- Fase 1 **non** persiste apertura/chiusura pannelli, `mapView`, GPS, `lastPoint` / `viewCenter`.

### QA

- Lint su monolite: OK in sessione.
- QA manuale consigliata: trascina/resize un pannello GIS → reload → riapri pannello e verifica posizione/dimensione clampata; `clearStore` / clear dati app → verifica sparizione `coordconv_ui_v1`; folding regioni in Cursor.

---

## Checkpoint 2026-04-26 — Theme-1 tema automatico locale

### Perché

Serviva una terza modalità **Automatico** oltre a chiaro/scuro, con regole fisse sull’orario locale del browser (senza OS theme, GPS, rete, alba/tramonto reale).

### Cosa è cambiato

1. **Modello preferenza vs DOM**
   - `state.theme` in `coordconv_v2.settings` vale `light`, `dark` o `auto` (retrocompatibile con salvataggi precedenti solo light/dark).
   - `<html data-theme>` riceve sempre il tema **effettivo** `light` o `dark`; mai `auto`.

2. **Risoluzione orologio**
   - `resolveThemeFromLocalClock(now)` usa solo `Date` locale (`getHours`, `getMinutes`): 07:00–18:59 → chiaro, 19:00–06:59 → scuro.
   - `getEffectiveTheme()` delega a quella funzione se la preferenza è `auto`.

3. **Init e refresh**
   - Rimosso l’uso di `matchMedia("(prefers-color-scheme: dark)")` per il default al primo caricamento; senza tema in store si resta sul default del `const state` (`dark`).
   - `scheduleThemeAutoRefresh`: `setInterval` 60s solo in modalità `auto`; `clearThemeAutoRefresh` al passaggio a manuale.
   - `installThemeVisibilityListenerOnce`: su `visibilitychange`, se il documento torna visibile, `syncThemeDomFromState()`.

4. **UI e i18n**
   - Menu header: select a tre opzioni (`#themeSelect`) in stile chip come la lingua, al posto del pulsante toggle.
   - Chiavi IT/EN/FR: `theme.optLight`, `theme.optDark`, `theme.optAuto`; aggiornati `tip.theme`, `settings.themeAria`; rimosse `tip.themeDark` / `tip.themeLight`.

5. **Sessione JSON**
   - `importSessionObject` accetta `settings.theme: "auto"` oltre a light/dark.

### File toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti

- Nessuna modifica a `coordconv_ui_v1`, OPSEC, geocoding, IndexedDB tile offline, export/import coordinate, parser, waypoint, track, `mapView` / `panelOpen`.

### QA

- Impostare Automatico → verificare in `localStorage` `theme: "auto"` e `data-theme` solo light/dark; cambiare orario di sistema o attendere fascia per transizione; switch lingua e etichette select; import sessione con `auto`.

---

## Checkpoint 2026-04-26 — Theme-1 select aria (micro)

### Perché

Dalla verifica post-commit: la chiave `settings.themeAria` era definita nei dizionari IT/EN/FR ma non collegata al markup della select tema.

### Cosa è cambiato

- Su `#themeSelect` aggiunto solo l’attributo **`data-i18n-aria="settings.themeAria"`**, sfruttando il loop esistente di `applyLanguage` su `[data-i18n-aria]`.
- **`aria-labelledby="themeSettingsLbl"`** lasciato invariato (nessun conflitto con la logica i18n corrente).

### File toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti

- Nessuna modifica a funzioni tema, CSS, testi i18n, `coordconv_ui_v1`, OPSEC, geocoding, IndexedDB tile, waypoint, track, `mapView` / `panelOpen`.

### QA

- Dopo reload: cambiare lingua e verificare che `aria-label` sulla select tema rifletta `settings.themeAria` nella lingua attiva (DevTools → Accessibility).

---

## Checkpoint 2026-04-26 — Track save min 2 punti

### Perché

Evitare archivi di “tracce” con 0 o 1 punto (non geometricamente una linea) e dare feedback visibile se l’utente prova a salvare.

### Cosa è cambiato

1. **Guard in `saveCurrentTrackToLibrary`**
   - Salvataggio solo se `state.track.points.length >= 2`; altrimenti `return false`, nessun push in `savedTracks`, nessun `saveStore` da quel percorso.
   - Chiave i18n `track.saveMinTwoPoints` (IT/EN/FR) al posto di `track.saveNeedPoints`.

2. **Flussi collegati**
   - “Salva e nuova” (`tnp-save-new`): `trackResetCurrentOnly` solo se il salvataggio restituisce `true`.
   - Prompt completamento (`track-prompt-save`): non imposta `_trackPromptOpen` / `_trackCompleted` / `_trackSavedAt` se il salvataggio fallisce.

3. **UX avviso in contesto Traccia**
   - `notifyTrackSaveMinPointsBlocked`: `setBadge("error")` + messaggio in `#trackSaveGuardMsg` sotto la toolbar, e negli slot errore dei prompt se presenti nel DOM.
   - `clearTrackSaveMinPointsNotice` dopo salvataggio riuscito e in `renderTrackSummary` quando i punti sono ≥ 2.

### File toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti

- Nessun cambio a export/import generale, waypoint manager, `coordconv_ui_v1`, Theme-1, OPSEC, geocoding, IndexedDB tile, parser, mapView/panelOpen oltre al percorso traccia descritto.

### QA

- 0/1 punto: pulsante archivio, Salva da prompt completamento, Salva e nuova → messaggio visibile, nessuna riga nuova in archivio.
- ≥2 punti: salvataggio come prima; avviso scompare passando a ≥2 punti o dopo salvataggio ok.

---

## Checkpoint 2026-04-26 — Fase 3A Convert modal (chiusura patch)

### Perché

Dopo un crash di sessione restava una patch parziale sull’uniformazione grafica della sola modal **Converti**; la verifica richiedeva **completare**, non revertire: scope CSS più stretto, una sola fonte per il footer opzioni, rimozione regole morte.

### Cosa è cambiato

1. **CSS scoped al Convertitore**
   - Blocco dedicato su `#convertModal` / `#convertModalBody` (variabili locali, header, close discreto non “destructive”, body padding, card per paste/manual/results, tipografia campi, mono su `#results`).
   - `.convert-cm-footer-options` e `.convert-cm-footer-options .persist-toggle` definiti **solo** come `#convertModalBody .results-col …` (niente regole globali su `.results-col` che colpissero la home o altre viste).

2. **`.gis-coord`**
   - Rimosso il selettore CSS senza uso in markup né rendering JS in questo turno (nessuna aggiunta dinamica della classe).

3. **Markup risultati (Convert)**
   - Riordino leggero: riga azioni principali + blocco footer opzioni coerente con gli stili scoped.

### File toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti

- Nessuna modifica a JavaScript operativo (conversione, parser, geocoding, OPSEC), IndexedDB tile offline, waypoint manager, track builder, misura, mapView, altre modal, Theme-1, `coordconv_ui_v1`.

### QA

- Lint editor sul monolite: OK in sessione.
- Manuale: aprire **Converti** in GIS → incolla/converti → verificare layout risultati, toggle persistenza nel footer, assenza di regressioni sulla `.results-col` fuori dalla modal (home nascosta / altri flussi).

---

## Checkpoint 2026-04-27 — Fase 3B Waypoint + micro rifiniture

### Perché

Portare la modal **Waypoint** sullo stesso linguaggio grafico della modal **Converti** (Fase 3A) e correggere attriti UX emersi in test (tooltip in lista, comandi distruttivi troppo esposti, opzioni “Nome sulla mappa” senza spiegazione al passaggio del mouse).

### Cosa è cambiato

1. **Shell e contenuto Waypoint (solo CSS/markup/i18n)**
   - Blocco scoped `#waypointModal` / `#waypointModalPanel`: token locali, header/titolo/close coerenti col Convert, toolbar “a card”, cluster secondario export/import, primary su Nuovo, destructive-hard su eliminazione batch, editor e tabella più leggibili, contatore in stile badge.
   - Etichette toolbar senza emoji nei testi principali (i18n IT/EN/FR aggiornate dove serviva).

2. **Comandi distruttivi**
   - **Elimina tutto**: nascosto in UI (`hidden` + `display:none` scoped); `waypointsClearAll` e binding restano nel codice.
   - **Elimina selezionati**: spostato sotto la lista in `.wp-list-actions` (stesso `id` → nessun cambio JS).

3. **Tooltip in contesto lista**
   - Riduzione clipping: wrapper tabella con overflow visibile dove serve, scroll sulla lista; z-index più alto sui tooltip dentro `#waypointModal`.

4. **Opzioni “Nome sulla mappa”**
   - Blocco spostato in fondo al flusso principale (dopo lista/contatore/azioni lista); aggiunti `tip.waypointModal.mapNameAlwaysTip` e `tip.waypointModal.mapNameTooltipModeTip` sulle `<label>` delle radio.

### File toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti

- Nessuna modifica a `state.mapWaypoints[]`, pick mode, `renderWpModalList()`, geocoding, OPSEC, IndexedDB tile offline, track builder, parser, altre modal, Theme-1, `coordconv_ui_v1`, Persistent UI State.

### QA

- Aprire Waypoint in GIS: toolbar, lista, tooltip pulsanti riga e opzioni nome mappa; verificare assenza di “Elimina tutto” visibile e posizione di “Elimina selezionati”; cambio lingua IT/EN/FR sui nuovi tip.

---

## Checkpoint 2026-04-27 — Waypoint modal: lista duplicata + empty / simbolo / elimina selezionati

### Perché

Dopo Export dialog (step 1) e Fase 3B restavano attriti in test: **seconda lista** sotto “Nome sulla mappa” (host legacy `#map-waypoints` ancora popolato da `renderMapWaypointsList()`), **doppio messaggio** a lista vuota, riga dettagli con **Simbolo** troppo rumorosa in questa fase, pulsante **Elimina selezionati** sempre visibile e percepito come comando globale fuori dal blocco lista.

### Cosa è cambiato

1. **Lista duplicata**
   - CSS `#sec-waypoints #map-waypoints { display: none !important; }` — il DOM legacy resta aggiornato da JS; UI canonica solo `#wp-list`.

2. **Stato vuoto**
   - Su `#waypointModalPanel #wp-list.track-points-list:empty` soppresso `::after` di `.track-points-list`, mantenuto l’empty-state via `.wp-list:empty::before` e `data-empty`.

3. **Simbolo in lista**
   - In `renderWpModalList()` rimosso dalla cella dettagli il segmento testuale con `mapWp.iconLabel` / etichetta icona (schema `meta.icon` e form editor invariati).

4. **Elimina selezionati**
   - Markup: pulsante con `hidden` di default; `.wp-list-actions` **dentro** `#wp-listWrap` sotto `#wp-list`, stile toolbar a bordo lista.
   - `syncWpSelectAllState(root)` aggiorna anche visibilità `#wpDeleteSelectedBtn` in base alle checkbox; dopo toggle **Seleziona tutte** viene richiamato `syncWpSelectAllState` (prima mancava); lista vuota → `syncWpSelectAllState` dopo clear.

### File toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti

- Nessuna modifica a `state.mapWaypoints[]`, `renderMapWaypointsList()` / overlay mappa, import/export, **Waypoint Export dialog**, builder, Traccia, Convert, Offline, Favoriti, Cerca, Misura, Theme-1, `coordconv_ui_v1`, OPSEC, geocoding, IndexedDB tile, track builder, parser.

### QA

- Lista vuota: un solo messaggio i18n; con waypoint: una sola lista tabellare; nessuna card duplicata sotto “Nome sulla mappa”.
- Checkbox: “Elimina selezionati” compare solo con selezione; “Seleziona tutte” aggiorna il pulsante.
- Export da dialog invariato.

---

## Checkpoint 2026-04-27 — Waypoint Export dialog (step 1)

### Perché

Allentare la toolbar Waypoint (troppi pulsanti export sempre visibili) introducendo il **primo blocco** del pattern approvato “Export dialog”: un entrypoint unico che apre una finestra con i formati; le funzioni di export restano quelle già testate nel monolite.

### Cosa è cambiato

1. **Toolbar Waypoint**
   - Rimossi dalla toolbar i pulsanti `#wpExportBtn` / `#wpExportGpx` / `#wpExportKml` / `#wpExportKmz` / `#wpExportCsv`.
   - Aggiunto **`#wpExportOpenBtn`** (testo i18n `waypointModal.exportOpen`, tooltip `tip.waypointModal.exportOpen`, `aria` da `waypointModal.exportOpenAria`), stile secondario coerente col cluster import/pick.

2. **Dialog dedicata**
   - Nuova **`<dialog id="waypointExportDialog">`** dopo `#waypointModal`: titolo/descrizione/messaggio vuoto i18n; lista pulsanti formato con `data-wp-export-fmt` che chiama **`waypointsExportGeoJSON()`** o **`waypointsExport(kind)`**; chiusura dopo export; CSS scoped sulla dialog (non eredita i token `--wp-*` del solo `#waypointModal`).

3. **UX / accessibilità**
   - Con zero waypoint: messaggio visibile e formati **disabilitati** (toolbar “Esporta” resta apribile senza hook aggiuntivi in `renderWpModalList`).
   - **Esc**: handler documento chiude prima la export dialog se aperta; **`closeWaypointModal`** chiude anche la export dialog.

### File toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti

- Nessuna modifica ai builder GPX/KML/KMZ/CSV/GeoJSON waypoint, nessuna modifica a `state.mapWaypoints[]`, import waypoint, altre modal (Traccia, Convert, Favoriti, Cerca, Offline, Batch, Sessione), Theme-1, `coordconv_ui_v1`, OPSEC, geocoding, IndexedDB tile, track builder, parser.

### QA

- Con waypoint: ogni formato scarica come prima; dialog si chiude; focus torna a “Esporta”.
- Senza waypoint: dialog con messaggio vuoto e pulsanti disabilitati; Esc/chiusura waypoint modal coerenti.

---

## Checkpoint 2026-04-27 — Waypoint Import dialog (step 1)

### Perché

Allineare l’**import** al pattern già avviato con l’**export dialog** Waypoint: un solo entrypoint in toolbar, finestra dedicata con scelta file e **drag & drop locale** (non sulla mappa), riuso della logica **`waypointsImportGeoJSON`** senza nuovi parser o formati in questo turno.

### Cosa è cambiato

1. **Toolbar**
   - `#wpImportBtn`: testo corto **Importa / Import / Importer** (`waypointModal.importOpen`), tooltip `tip.waypointModal.importOpen`, `aria` `waypointModal.importOpenAria`.
   - Click apre **`#waypointImportDialog`** invece di aprire direttamente il file picker.

2. **Dialog `#waypointImportDialog`**
   - Titolo/descrizione i18n; area drop `#waypointImportDropZone` (evidenziazione `.dragover`); pulsante **Sfoglia…** → click su **`#wpImportFile`** (reset `value` per re-import).
   - Messaggio inline `#waypointImportDialogMsg` per formato non supportato (solo `.geojson`/`.json` per nome file) e per esito import quando la dialog resta aperta.

3. **Import**
   - `waypointsImportGeoJSON(file, opts?)`: secondo argomento opzionale con **`onDone(ok, msg)`**; `ok === true` solo se almeno un waypoint è stato **aggiunto** (`added > 0`); in tutti gli altri casi `ok === false` così la dialog può restare aperta mostrando l’errore/motivo.
   - Chiusura dialog automatica solo su `ok === true`.

4. **Esc / chiusura waypoint modal**
   - Handler Esc additivo: chiude prima `#waypointImportDialog`, poi `#waypointExportDialog`.
   - `closeWaypointModal()` chiude anche `#waypointImportDialog` se aperta.

### File toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti

- Nessun drag & drop globale sulla mappa; nessun import GPX/KML/KMZ/CSV waypoint; nessuna modifica al modello `state.mapWaypoints[]` oltre a quanto già faceva `waypointsImportGeoJSON`; nessun tocco a Traccia, Convert, Offline, Favoriti, Cerca, Misura, Theme-1, `coordconv_ui_v1`, OPSEC, geocoding, IndexedDB tile, track builder, parser, builder export.

### QA

- Aprire Import: dialog, Sfoglia, drop `.geojson` valido → dialog si chiude, lista/mappa aggiornate come prima.
- File `.gpx` o altro → messaggio “formato non supportato”, nessuna chiamata import.
- Errore parse / nessun Point / cap / annulla conferma → dialog resta aperta (o messaggio coerente), badge come prima.
- Esc con import aperta chiude import; poi export se aperta.

---

## Checkpoint 2026-04-27 — Track modal file picker + delete saved track map

### Perché

Dopo **Importa traccia → file picker → Annulla**, la modal Traccia si chiudeva ancora: la guardia su `_trackFilePickerGuardUntil` interveniva solo sul ramo **Esc** globale, mentre **`cancel`** sul `<dialog>` e altri handler chiamano **`closeTrackModal()`** senza quel controllo. In parallelo, eliminando una traccia salvata ancora “speculare” della bozza corrente, la polilinea poteva restare a schermo finché la bozza non veniva resettata.

### Cosa è cambiato

1. **Guardia centralizzata**
   - All’inizio di **`closeTrackModal(opts)`**: se non **`opts.force`** e `Date.now() < state._trackFilePickerGuardUntil`, **return** (nessuna chiusura).
   - **`openWaypointModal`**: **`closeTrackModal({ force: true })`** così la sostituzione con la modal Waypoint non resta bloccata dalla guardia.

2. **Arm / disarm Import (`#btnTrackImport` / `#trackFileInput`)**
   - All’click: `_trackImportPickerFileChosen = false`, guardia **120 s**; listener **`focus`** `{ once: true }` che, se il file non è stato scelto (`!_trackImportPickerFileChosen`), imposta una coda breve (~500 ms + timeout ~600 ms) per azzerare la guardia e ripristinare la chiusura normale della modal.
   - Su **`change`**: `_trackImportPickerFileChosen = true`, `importTrackFile` se c’è file, reset `value`, **`_trackFilePickerGuardUntil = 0`** così il `focus` post-successo non ri-arma.

3. **Delete tracce salvate**
   - Helper **`trackCurrentPointsMatchSavedSnapshot`** / **`maybeClearCurrentTrackIfMatchesDeletedSaved`**.
   - **`deleteSavedTracksByIds`** e **`deleteLastSavedTrack`**: snapshot dei `points` prima della rimozione; dopo persist/render/refresh, se la bozza coincide con un’eliminata → **`trackResetCurrentOnly({ pickMode })`**; se la geometria è diversa (traccia nuova o modificata) → nessun reset.

### File toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti

- Nessun intervento su Waypoint, builder import/export traccia oltre ai punti sopra, `state.mapWaypoints[]`, altre modal.

### QA

- GIS: apri Traccia → Importa → Annulla nel Finder → la modal Traccia resta aperta; dopo ~1 s la chiusura manuale (X/backdrop) funziona.
- Import file valido → guardia azzerata; nessun blocco prolungato alla chiusura.
- Apri Waypoint con Traccia aperta → Traccia si chiude comunque.
- Elimina salvata che coincide con bozza corrente → sparisce dalla mappa; bozza diversa → invariata.

---

## Checkpoint 2026-04-27 — Track archive UI cleanup + save gating

### Perché

Durante i test della modal Traccia sono emerse due criticità UI:

- Doppione azione “Salva traccia in archivio…” quando il prompt “Traccia completata” era già visibile con la stessa CTA.
- Azione “Elimina ultima salvata” ritenuta **ridondante e pericolosa** (cancellazioni accidentali) rispetto al flusso coerente basato su selezione esplicita (“Elimina selezionate”).

Inoltre, anche con `disabled`, il pulsante “Salva” poteva apparire ancora “premibile”: si è preferito **nascondere** i comandi di salvataggio quando la traccia non è valida (<2 punti).

### Cosa è cambiato

1. **Rimozione comando pericoloso**
   - Rimosso dal markup il bottone **`#btnTrackDeleteLastSaved`** (“Elimina ultima salvata”).
   - Il binding JS resta null-safe (nessun refactor richiesto).
   - Rimane come flusso corretto: **“Elimina selezionate”** (già `hidden` finché non ci sono checkbox selezionate).

2. **Anti-doppione salvataggio**
   - Quando il prompt “Traccia completata” (`state._trackPromptOpen`) è visibile, `#btnTrackSaveLibrary` nella toolbar “Tracce salvate” resta nascosto per evitare doppioni.

3. **Gating visibilità “Salva traccia in archivio…”**
   - Introdotta `syncTrackSaveLibraryActionsState()` e chiamata in `renderTrackAll()`.
   - Regola finale:
     - Se `state.track.points.length < 2`: nasconde sia `#btnTrackSaveLibrary` sia il bottone prompt `data-role="track-prompt-save"` (e li lascia anche `disabled` come safety).
     - Se `>= 2`: il bottone del prompt è visibile; `#btnTrackSaveLibrary` è visibile solo se il prompt non è aperto.

### File toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti

- Nessuna modifica a `saveCurrentTrackToLibrary`, modello dati tracce, import/export dialog, Waypoint, Convert, Offline, Favoriti, Cerca, Misura, Theme-1, Persistent UI, OPSEC, geocoding, IndexedDB/tile.

### QA

- Con 0–1 punto: i comandi “Salva traccia in archivio…” non sono visibili.
- Con ≥2 punti: il salvataggio compare (nel prompt se aperto, altrimenti nella toolbar) e funziona come prima.
- “Elimina selezionate” resta l’unica cancellazione in UI e compare solo con selezione.

## Checkpoint 2026-04-27 — Track saved-edit workflow + UX + bugfix (post-crash)

### Contesto

Dopo il crash Cursor sul monolite, consolidamento del **Blocco 1** “modifica traccia salvata” e micro-interventi UX/bugfix limitati al **Track builder** in `coordinate_converter Claude.html` (nessun tocco a export core, import, Waypoint, Offline, IndexedDB, docs oltre questo checkpoint).

### Cosa è cambiato (sintesi tecnica)

1. **Distinzione bozza vs modifica archivio**
   - Helper `trackIsEditingSavedLibrary()`; etichette/tooltip **Salva** vs **Aggiorna** su testata punti, prompt completamento (ove applicabile) e stato `#btnTrackSaveLibrary` (poi reso **sempre invisibile** per CTA unica in testata).
   - Conferme/notifiche dedicate per annullare modifica salvata (`track.closeLoseSavedEditConfirm`, `track.editDiscardedNotify`, `track.updatedOk`); `trackPromptAndSaveCurrent`: in edit salvata **nessun** `window.prompt` sul nome — uso nome da `state.savedTracks` + `replaceSavedId`.

2. **Salvataggio / chiusura ciclo**
   - Dopo update riuscito: niente ri-apertura prompt spuria; `pickMode`/`deferred` spenti prima di `trackResetCurrentOnly` dove già presente.
   - Handler prompt save: in edit salvata nome da archivio; dopo success non forzare re-render prompt che riapre il flusso.

3. **UX toolbar / punti**
   - Testi **Elimina traccia corrente** (+ conferma/tooltip); **Nuova traccia** con `+` in badge ad alto contrasto (CSS locale toolbar); lista dettaglio punti **nascosta** di default finché l’utente non espande (“Mostra punti”).
   - Rimosso dalla UI operativa **Chiudi traccia** (testata punti + prompt); chiusura pannello resta su Esc/X/`closeTrackModal` / `_closeTrackModalCore`.
   - In modifica salvata: **Termina traccia** nascosto (`trackSyncPickModeUi` + `!trackIsEditingSavedLibrary()`).

4. **Bugfix logici**
   - **`_closeTrackModalCore`**: se alla chiusura si era in edit salvata valida (`wasLibEdit` catturato prima di azzerare `_trackEditingSavedId`), dopo chiusura `trackResetCurrentOnly({ pickMode: false })` per evitare **punti orfani** quando `trackHasUnsavedDraft` era falso (snapshot uguale all’archivio).
   - **`renderSavedTracksOverlays`**: non disegnare la saved con `id === state._trackEditingSavedId` (niente doppio overlay draft + saved).
   - **`beginEditSavedTrackById` / `saveCurrentTrackToLibrary`**: snapshot punti con `id: String(p.id || uidNamed())` per **preservare gli ID**.
   - **`trackCurrentPointsMatchSavedSnapshot`**: confronto anche **name** e **meta** (`trackPointMetaComparable` + `JSON.stringify` controllato).

### File toccati (sessione)

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti rispettati (ambito sessione)

- Nessuna dipendenza nuova; monolite vanilla; nessun commit fino al trigger «Finito»; export/import/Waypoint/Offline/IDB fuori patch salvo quanto già in monolite da sessioni precedenti.

### QA suggerita

- Modifica salvata: solo **Aggiorna traccia** in testata; niente **Termina traccia**; niente doppia linea saved+draft sulla mappa; dopo chiudi senza modifiche non resta bozza orfana; dopo **Aggiorna** nessun prompt nome e nessun click-mappa che aggiunge punti.
- Bozza nuova: salva con prompt nome; lista punti resta collassata fino a “Mostra punti”.

## Checkpoint 2026-04-27 — Tracce salvate saved-tracks UI + riepilogo workflow

### Contesto

Lavoro sul monolite `coordinate_converter Claude.html` (Tracce salvate: selezione, batch visibilità, ordinamento tabellare dove implementato, tooltip) e su `.cursor/rules/30-output-workflow.mdc` (formato RIEPILOGO e nome file in `/tmp`).

### Cosa è cambiato

1. **Tracce salvate — funzionalità**
   - Selezione per id (`_savedTracksSelectedIds`), select-all, batch Mostra/Nascondi selezionate e tutte, Elimina selezionate; meta selezione in toolbar.
   - Logica `applySavedTracksVisibilityOnlySelected(ids)` (isolate visibilità) mantenuta nel JS anche dopo rimozione pulsante dedicato.
   - Stato transient `_savedTracksSort` e stili `.saved-tracks-sort-btn` (ordinamento B2 nel branch di sviluppo; verificare allineamento render se la tabella usa ancora solo `reverse()`).

2. **Tracce salvate — UX / anti-sfarfallio**
   - Rimosso dalla toolbar il pulsante **«Isola selezionate»** (`#btnSavedTracksShowOnlySelected`): ridondante rispetto a Nascondi tutte + Mostra selezionate; rimossi listener e riferimenti in `syncSavedTracksSelectionActions`.
   - Mitigazione sfarfallio hover su prima colonna / Vis. / riga selezionata: CSS dedicato `#savedTracksMount` (niente animazione/backdrop pesanti sui tooltip della tabella; disattivazione pseudo-tooltip su col. 1–2 dove applicabile; colonne a larghezza minima; `tr.is-selected:hover` con sfondo uguale alla sola selezione); rimossi `data-tip` su checkbox/header critici con `aria-label` impostato dopo `renderSavedTracksList`.

3. **Workflow output**
   - Regola `30-output-workflow.mdc`: RIEPILOGO con sezioni numerate nel messaggio; file Markdown obbligatorio `/tmp/NN-goi-gis-riepilogo.md` (primo `NN` libero); percorso senza prefisso numerico non più standard.

### File toccati

- `coordinate_converter Claude.html`
- `.cursor/rules/30-output-workflow.mdc`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti

- Nessun commit fino al trigger «Finito»; nessuna nuova dipendenza; export/import core, Waypoint, Offline, Converti, geocoding, IndexedDB, CRS e schema `coordconv_v2` non modificati per questi interventi (salvo linee già presenti nel monolite da sessioni precedenti).

### TODO / note

- Verificare in browser che l’ordinamento a colonne (B2) sia ancora presente nel markup se richiesto; in alcuni snapshot solo `slice().reverse()` era attivo nella lista.


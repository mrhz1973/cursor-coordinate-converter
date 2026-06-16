> **STORICO LUNGO.**  
> Per lo stato operativo corrente del GIS leggere `README.md`, [`docs/OPERATING_MEMORY.md`](OPERATING_MEMORY.md) e la WU corrente in [`docs/work-units/`](work-units/).  
> Dopo il flip rules di Fase 3, questo file non deve più essere aggiornato o letto come memoria corrente.  
> Resta disponibile solo per audit, ricostruzione storica e consultazione mirata.

# 📌 Coordinate converter — mini-mappa, GPS, bbox on-map, tools drawer & offline-first

## 🗓 Data

2026-04-21 (prima stesura) · **aggiornato 2026-04-22** (bbox selection, tools drawer, track builder, offline render, UI polish, mini-guida, overlay copertura offline, pannello offline dockable/floating, delete from map, label smart-corner, **DTG NATO Date-Time Group**, **Geocoding Nominatim + reverse + fallback offline**, header toolbar, pill Località, toggle copertura offline on-map, fix tooltip z-index, auto-open pannello offline per map size) · **checkpoint 2026-04-22 (sera)** — vedi sezione *Checkpoint* in fondo · **checkpoint 2026-04-23** — Cursor Project Rules (`.cursor/rules/`) + `docs/checkpoint.md` — vedi sezione *Checkpoint* in fondo · **checkpoint 2026-04-28 (backlog strategico)** — vedi *Checkpoint 2026-04-28 — Backlog strategico: Tactical Tools, Cartografia avanzata, Core/Field/Net* in fondo · **checkpoint 2026-04-28 (Finito)** — vedi *Checkpoint 2026-04-28 — Chiusura sessione (Finito)* · **checkpoint 2026-04-28 (reset locale)** — vedi *Checkpoint 2026-04-28 — Reset totale dati locali implementato* · **checkpoint 2026-04-29 (Finito)** — vedi *Checkpoint 2026-04-29 — Waypoint modal + CoT XML rifinitura (Finito)* · **checkpoint 2026-04-29 (finito)** — vedi *Checkpoint 2026-04-29 — Misura M1+M3 + alias aggio orchestratore (finito)* · **checkpoint 2026-05-01 (`finito`)** — vedi *Checkpoint 2026-05-01 — Pass 5 Step E.3 monolite + Pass 6 piano orchestratore (`finito`)* in fondo · **checkpoint 2026-05-02 (`finito`)** — vedi *Checkpoint 2026-05-02 — Pass 6 batch monolite fino a 6E.1d (`finito`)* in fondo · **checkpoint 2026-05-02 (`finito`, 6E.2)** — vedi *Checkpoint 2026-05-02 — Pass 6 Step 6E.2 minimizza quattro pannelli (`finito`)* in fondo · **checkpoint 2026-05-02 (`finito`, 6F.1/6F.1a)** — vedi *Checkpoint 2026-05-02 — Pass 6 Step 6F.1 e 6F.1a Converti waypoint (`finito`)* in fondo · **checkpoint 2026-05-02 (`finito`, 6F.2/6F.2a)** — vedi *Checkpoint 2026-05-02 — Pass 6 Step 6F.2 e 6F.2a Waypoint batch Preferiti + icona pin (`finito`)* in fondo

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

## Checkpoint 2026-04-28 — MEGA-PATCH UI/UX controllata

### Contesto

Sessione su richiesta utente: **10 blocchi** UI/UX sul solo `coordinate_converter Claude.html` (vanilla, single-file), con vincoli OPSEC/offline/IndexedDB; trigger chiusura **«Finito»** con aggiornamento documentazione e commit.

### Cosa è cambiato

1. **Mappe Offline / pannello Layers (body)**  
   - Verifica assenza di `padding-top` elevato su `#layersPanelBody.app-modal-body` (compattezza elenco).  
   - Tooltip **Usa area** / **Centra**: nessuna modifica al meccanismo `.offline-area-tip-portal`.

2. **Toolbar mappa / Layers**  
   - Diagnostica clip: contenitore `#gisMapMount.gis-map-mount` con `overflow: visible` per non tagliare controlli/ombre; su `#gisMapMount > #miniMap .tile-map` aggiunto `overflow-clip-margin: 6px` (dove supportato). Nessuno spostamento DOM di `.tile-layers`.

3. **Bbox UI**  
   - `#btnBboxPick` nascosto dalla UI (`hidden`, `aria-hidden`, `tabindex=-1`); logica `startBboxSelection` / listener invariati; `#btnBboxViewport` intatto.

4. **Chiusura float mappa**  
   - Stile neutro (non danger) per `.mb-close` (misura / traccia / waypoint editor) e `.toff-close` (float offline), coerente con chip chiusura pannelli GIS.

5. **Rename con conferma**  
   - Tracce salvate (`renderSavedTracksList`), aree offline (`renderOfflineAreasList` + delegazione `#offlineAreasList`), waypoint (`renderWpModalList`), favoriti (`renderFavorites` + input nome).  
   - `waypointRename`: trim su persistenza.  
   - i18n: `track.renameConfirm`, `offcache.renameConfirm`, `waypoint.renameConfirm`, `fav.renameConfirm` (IT/EN/FR).

6. **Tabella aree offline**  
   - Colonna nome editabile con input; `colgroup` + variabile `--offa-name-col`; handle ridimensionamento solo desktop (`ensureOfflineAreasNameColResizeWired`); larghezza sessione opzionale su `list._offaNameColPx` (no localStorage).

7. **Export**  
   - Solo audit: nessun cambio formati/builder.

8. **Workflow / repo**  
   - `.cursor/rules/30-output-workflow.mdc`: convenzione RIEPILOGO + `/tmp/NN-goi-gis-riepilogo.md` (già in lavorazione utente, incluso nel commit «Finito»).

### File toccati (commit)

- `coordinate_converter Claude.html`
- `.cursor/rules/30-output-workflow.mdc`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### Invarianti rispettati

- Nessun commit fino al trigger «Finito»; dopo «Finito» commit unico. Nessuna nuova dipendenza; CRS/datum, geocoding remoto, OPSEC strict, IndexedDB/cache tile/download core, builder/parser export/import, `#btnBboxViewport`, `.danger-x`, `.offline-area-tip-portal` non alterati nel loro contratto (portal solo verificato intatto).

### Riferimento operativo

- Riepilogo sessione utente: `/tmp/17-goi-gis-riepilogo.md` (non versionato in repo).

## Checkpoint 2026-04-28 — Post-pack 17 UI/UX controllata

### Contesto

Prosecuzione dal commit `72aed86` e dal riepilogo `/tmp/17-goi-gis-riepilogo.md`, su richiesta utente **MEGA-PATCH UI/UX controllata — pacchetto lungo post-17**. Ambito deliberatamente limitato al monolite `coordinate_converter Claude.html`; nessuna nuova dipendenza, nessun refactor architetturale, nessuna modifica a CRS/datum, geocoding remoto, OPSEC strict, IndexedDB/cache tile/download core, parser/builder export, `#btnBboxViewport`, `.danger-x` o logica core bbox.

### Cosa è cambiato

1. **Stabilizzazione patch 17**
   - Verificati come presenti: `#btnBboxPick` nascosto, `.offline-area-tip-portal`, rename con conferma, resize colonna Nome Mappe Offline, X floating neutre, assenza di `padding-top: 46px` su `#layersPanelBody.app-modal-body`.
   - Aggiunta piccola robustezza accessibilità/interaction: `#btnBboxPick[hidden]` con `pointer-events:none`; `hidden`, `aria-hidden="true"` e `tabindex="-1"` restano invariati.

2. **Rename inline — tastiera e stile**
   - Aggiunta `ensureGisInlineRenameKeyboardHooks()`:
     - **Enter** su input rename esegue `blur()` e lascia al flusso `change` esistente la conferma/salvataggio.
     - **Esc** ripristina il valore precedente (`dataset._prevOffaName`, `_prevSavedName`, `_prevWpName`, `_prevFavName`), fa `preventDefault()` / `stopPropagation()` e impedisce chiusure accidentali di pannelli GIS mentre l’utente annulla un rename.
   - Uniformato lo stile dei rename input: `.offa-name-inp`, `.saved-name-inp`, `.wp-modal-table .wp-row-name-inp`, `.favorite-item .fav-name-inp`, mantenendo gli override locali già utili per Favoriti e Waypoint modal.

3. **Resize colonna Nome — estensione controllata**
   - Mappe Offline: clamp allineato a 72px minimi e ripristino sessione limitato (`72…560` px).
   - Tracce salvate: `colgroup`, variabile CSS `--saved-name-col`, handle `.saved-name-col-resize`, helper `ensureSavedTracksNameColResizeWired()`; larghezza in sessione su `#savedTracksMount._savedTracksNameColPx`, nessun localStorage.
   - Waypoint: `colgroup`, variabile CSS `--wp-name-col`, handle `.wp-name-col-resize`, helper `ensureWpModalNameColResizeWired()`; larghezza in sessione su `#wp-list._wpNameColPx`, nessun localStorage.
   - Gli handle sono desktop-oriented e vengono nascosti su `(pointer:coarse)`; hanno `role="separator"`, `aria-orientation="vertical"` e aria-label localizzata.

4. **Ripristino layout pannelli**
   - Aggiunto nel menu impostazioni header il comando **Ripristina layout pannelli** (`#btnResetGisUiLayout`).
   - Nuova funzione `resetGisUiLayoutPanels()`:
     - chiede conferma;
     - rimuove solo `coordconv_ui_v1`;
     - resetta `gPanelLayouts` per `track`, `waypoint`, `convert`, `search`, `favorites`, `layers`;
     - azzera le larghezze colonne Nome session-only;
     - riapplica i layout ai pannelli aperti e re-renderizza liste offline/tracce/waypoint.
   - Non cancella dati operativi: tracce, waypoint, favoriti, aree offline, tile cache, cronologia, impostazioni OPSEC o contenuto `coordconv_v2`.

5. **i18n / a11y**
   - Nuove chiavi IT/EN/FR:
     - `settings.resetLayout`
     - `settings.resetLayoutConfirm`
     - `settings.resetLayoutTip`
     - `offcache.colResizeAria`
     - `track.colResizeAria`
     - `waypoint.colResizeAria`
   - Aggiunti aria-label sugli input nome tracce salvate dove mancava e sugli handle resize.

### Blocchi saltati / backlog motivato

1. **Colore/spessore traccia salvata** — saltato per rischio: l’overlay salvate usa ancora `savedTrackStrokeColor(id)`; rendere persistenti colore/spessore richiede toccare modello savedTracks, `saveStore`, editor e render overlay, quindi serve piano dedicato.
2. **KMZ/KML naming profondo** — non modificato: helper import tracce (`spatialSanitizeImportedTrackLabel`, `spatialBaseNameNoExt`, `spatialDeriveImportedTrackPromptName`, `state._trackPromptName`) risultano coerenti; fallback basename KMZ richiede validazione più mirata del flusso interno.
3. **Factory reset globale dati** — non implementato: un futuro reset dovrebbe distinguere nettamente layout/preferenze UI da dati operativi e non cancellare tile IndexedDB, OPSEC, tracce, waypoint, favoriti, aree offline o cronologia senza consenso esplicito e separato.

### Inventario persistenza UI

| Ambito | Persistenza |
|--------|-------------|
| Pannelli GIS (`track`, `waypoint`, `convert`, `search`, `favorites`, `layers`) | `coordconv_ui_v1` + `gPanelLayouts` (`left/top/w/h/touched`) |
| Larghezze Nome offline / tracce / waypoint | Solo sessione su mount DOM (`_offaNameColPx`, `_savedTracksNameColPx`, `_wpNameColPx`) |
| Ordinamento tracce salvate | `state._savedTracksSort` transient |
| Tema, lingua, OPSEC, dati operativi | `coordconv_v2` |

### File toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### QA

- `git diff --check -- "coordinate_converter Claude.html"`: OK.
- JS inline estratto in `/tmp/gis-inline-check.js` + `node --check`: OK.
- Da validare in browser: drag resize tracce/waypoint, Esc durante rename, reset layout con pannelli aperti, menu basemap su viewport stretto.

### Riferimento operativo

- Riepilogo sessione utente: `/tmp/18-goi-gis-riepilogo.md` (non versionato in repo).


## Checkpoint 2026-04-28 — Mappe Offline rifinitura

### Contesto

Allineamento UI/UX della sezione **Mappe Offline** dopo il flusso **Modifica / Aggiorna**: ridurre ambiguità tra azioni batch vs per-riga, rendere visibile il progress del download batch, dare un primo feedback visivo “delta” tra tile già in cache vs mancanti (senza riscrivere il core download), eliminare eredità accidentale del campo nome e bloccare nomi duplicati cross-area, attenuare la tinta verde generica della copertura tile così non compete con le named areas.

### Cosa è cambiato

1. **Toolbar batch — solo azioni batch**
   - Rimossi dalla toolbar alta `#offlineAreasToolbar` i pulsanti duplicati `#btnOfflineAreasUseOne` (Modifica) e `#btnOfflineAreasFitOne` (Centra).
   - Restano solo: Mostra/Nascondi selezionate, Elimina selezionate, Scarica selezionate (`btnOfflineAreasPrecacheSel`).
   - Modifica/Centra restano **solo per-riga** (`data-offline-load`, `data-offline-fit`).
   - Aggiornati handler/toolbar sync e portal tooltip per non referenziare id rimossi (mantenuto `#btnPrecacheStart` nel portal).

2. **Progress batch — riuso barra principale**
   - `startOfflineAreasBatchPrecache()` ora esegue `runOfflineAreasPrecacheQueue(..., { useProgressBar: true })`.
   - Risultato: `#pcBar`, `#pcProgress`, `#pcStatus` visibili anche durante **Scarica selezionate**, con testo `offcache.batchAreaLine` (indice + nome) e avanzamento percentuale quando disponibile.

3. **Delta copertura (v1 prudente)**
   - Stato transiente: `state._offlineDeltaAreaId` (non persistito).
   - `syncOfflineDeltaViewportHints(mapRoot, opts)`: per i tile visibili nel viewport, solo allo zoom corrente, con cap (default 120) classifica in cache vs mancante via `getTileBlobByKey` e applica `tile-delta-cached` / `tile-delta-missing`.
   - Hook: dopo `hydrateMapTiles()`; attivazione su “Modifica” per aree `partial/unknown` in `loadNamedAreaIntoPrecacheFieldsById()`.
   - Nota: aggiornamento “live” durante download **non** è un loop continuo su ogni tick progress (prima versione prudente); si può estendere in seguito con throttle su `onProgress`.

4. **Nome area / deduplica**
   - Su **Seleziona area sulla mappa** e **Usa viewport** fuori modifica: `_offlineExitEditForNewDraft()` pulisce `#pcAreaName` e azzera stati collegati (editing/loaded/prompt, delta).
   - Nuova chiave i18n: `offcache.nameAlreadyUsed` (IT/EN/FR) + `findNamedAreaIndexByName()`.
   - Blocco creazione se il nome esiste già su un’area con geometria diversa: `saveNamedArea` (nuova area) e `onPrecacheStart` (creazione nuova area per download).

5. **Tinta cache generica**
   - Ulteriore attenuazione del `::after` su `.tile-wrap.tile-mission` quando `coverage-on` per ridurre confusione con named areas (che restano su `.named-cov` / `.named-cov--partial`).

### Invarianti rispettati (vincoli sessione)

- **Non toccati:** geocoding, waypoint, tracce, favoriti, export/import, Layers, `#btnBboxPick`, semantica reset globale, dialog X a tre scelte, label “Scarica area corrente”, tooltip portal precache oltre la rimozione selettori id eliminati.

### File toccati

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`

### QA (tecnica)

- `git diff --check` su monolite: OK in sessione.
- `node --check` su JS inline estratto: OK in sessione (range script aggiornato nel tempo).


## Checkpoint 2026-04-28 — Backlog strategico: Tactical Tools, Cartografia avanzata, Core/Field/Net

### Contesto

Questa sezione **documenta solo backlog e proposte** emerse in chat (GOI GIS Tool / APP GIS; file canonico `coordinate_converter Claude.html`). **Non** descrive implementazioni già mergeate oltre a quanto esplicitamente richiamato nello **stato UI Mappe Offline** sotto. Serve a non perdere il filo quando le conversazioni diventano lunghe.

**File toccati in questo blocco docs-only:** `docs/session-geolocalizzazione-e-mappa.md`, `docs/checkpoint.md`, `docs/PROJECT_notes.md`. **Non** sono stati modificati `coordinate_converter Claude.html`, `docs/roadmap.md`, né `.cursor/rules/*.mdc`.

### Convenzione operativa: «Mettilo nel backlog»

- **«Mettilo nel backlog»** significa: **registrare l’idea** in chat e, quando richiesto, **nei documenti di progetto** del repository (sessione / checkpoint / note), così resta tracciabile.
- **Non** significa: creare issue GitHub o ticket esterni.
- **Non** significa: modificare **`docs/roadmap.md`** o **`.cursor/rules/*.mdc`** senza una proposta dedicata e **approvazione esplicita dell’utente**.
- **Non** significa: fare commit o push automatici (salvo trigger esplicito dell’utente, es. «Finito» come da rules progetto).

**Roadmap e rules** si aggiornano solo dopo **proposta esplicita** e **approvazione dell’utente**.

### Vincoli architetturali da rispettare nel backlog (promemoria)

- Single-file HTML standalone; HTML / CSS / JS nello stesso file; **vanilla JS**; nessun framework; nessun TypeScript; nessun npm; nessun bundler; nessun ES modules; nessuna dipendenza runtime esterna oltre ai pattern già ammessi dall’app (tile / geocoding ecc. solo opt-in).
- **Offline-first**; **OPSEC-aware**; nessuna rete automatica; geocoding / tile / WMS / WMTS solo opt-in e bloccabili da **OPSEC strict**.
- **i18n** IT / EN / FR per ogni stringa UI futura.
- Nessun **live tracking** GPS o `watchPosition` senza decisione esplicita dell’utente.
- **`state.mapWaypoints[]`** resta fonte **canonica** dei waypoint; gli store GIS **additivi** non devono sostituire arbitrariamente le fonti canoniche.

### 1. Stato appena validato — Mappe Offline UI

Sintesi dello stato discusso/validato in sessione (dettaglio implementativo resta nel monolite e nei checkpoint precedenti su Mappe Offline):

- **Resize colonne** tabella «Aree offline salvate»: OK.
- **Pannello Mappe Offline** reso più grande / coerente con le altre modal operative: OK.
- **Gruppo azioni riga** (`.offa-actions`) allineato; **X delete** per-riga (`[data-offline-del]` in `.offline-areas-table .offa-actions`) allineata al pattern **Waypoint** (`[data-role="wp-del"]`): OK percepito in sessione.
- **Dialog a tre scelte** su eliminazione area: invariato.
- **Logiche** download / cache / delta Mappe Offline: non toccate da questi interventi UI.
- **Resize colonne / sessione**, **close button** modal/pannelli: non oggetto delle micro-patch sulla X.

### 2. Prossimo blocco operativo consigliato

- **`Impostazioni → Cancella tutti i dati locali`** (o equivalente nel menu impostazioni): funzione **critica** per sviluppo e OPSEC.
- Deve cancellare in modo controllato **dati locali dell’app**: `localStorage` applicativo, **IndexedDB** (tile pack / cache geocoding ove presente), **waypoint**, **tracce**, **favoriti**, **cronologia**, **aree offline**, **preferenze/layout** UI (`coordconv_ui_v1`, `gPanelLayouts`, ecc.) — elenco da raffinare in fase di progettazione, ma l’intento è **reset completo dati on-device**.
- Deve avere **conferma forte** (secondo step / digitazione / checkbox esplicite).
- Resta **distinta** da **«Svuota tutta la cache tile»** (solo cache tile, già presente nel flusso Mappe Offline).

### 3. Backlog — Tactical On-Map Tools

Macro-backlog (idee, non implementazioni garantite):

| Voce | Note |
|------|------|
| **Range Rings** | Candidato operativo futuro dopo piano tecnico. |
| **Range Fans** | Idem. |
| **Lasso Multi-Select** | Idem. |
| **Range & Bearing persistente** | Richiede cautela: sensoristica / live GPS / `watchPosition` / sicurezza — **nessun live GPS** senza decisione esplicita. |
| **Geofence** | Idem (geofencing può implicare tracking o automazioni sensibili). |
| **Routes con ETA** | Estensione futura plausibile della sezione **Track** / pianificazione. |
| **Bloodhound / intercept geometry** | Strumenti avanzati: solo con modello **manuale / advisory**; niente automazioni operative o «targeting» implicito. |
| **Mappe Offline: selezione poligonale per download tile** | Backlog **importante** e **additivo** rispetto a bbox/viewport attuali. |

**Nota trasversale:** niente **live GPS** / `watchPosition` senza decisione esplicita dell’utente; strumenti da progettare come **overlay / analisi manuale** e **advisory**, non automazioni tattiche opache.

### 4. Backlog — Cartografia avanzata & Geo-analisi

**A) Backlog operativo plausibile** (dopo pianificazione): KML **GroundOverlay**; **GRG** (Gridded Reference Graphic); **DEM locale** / import **HGT**; **cursor-on-elevation**; **elevation profile**; **viewshed 2D** da DEM locale; **WMS/WMTS** opt-in e OPSEC-aware.

**B) Feasibility prima di implementazione:** **MBTiles** (es. `sql.js` / SQLite / WASM inline nel monolite — impatto size/audit); **GeoPackage**; **GeoTIFF** (es. `geotiff.js` vendored); DEM «downloader» online (conflitto potenziale con OPSEC); WMS/WMTS client complessi; **Web Worker inline** per viewshed pesante.

**C) Backlog strategico non attivo:** **3D Map** / terrain mesh / stack tipo **MapLibre GL** — attualmente **fuori scope operativo** della roadmap corrente; rivalutabile solo con **modifica strategica approvata** (roadmap + rules).

### 5. Backlog — Interoperabilità TAK / CoT / Mission Package

**Priorità alta (direzione suggerita):**

- **CoT XML** import/export **file-only**, **senza rete** — formato pivot ad alto ROI per interoperabilità offline con ecosistema TAK tramite **scambio file**.
- **Mission Package** (ZIP + `MANIFEST.xml`) import/export **dopo** CoT, sempre in logica file-first.

**Esplicitamente fuori scope fino a decisione strategica:** partecipazione TAK **live**, TAK Server, BFT live nel «Core» senza approvazione.

### 6. Backlog — Report e template operativi

Registrare come backlog: **9-Line CASEVAC**; **9-Line CAS**; **SALUTE**; **SALT**; **Drop Point**; eventuali altri report con classificazione / export coerenti con la funzione **print/report** già esistente nell’app.

### 7. Backlog — Simbologia e attributi tattici

- **Affiliation** colorata per waypoint/tracce: friend / hostile / neutral / unknown.
- Subset **MIL-STD-2525** / **APP-6**.
- Valutare **`milsymbol.js`** solo come **feasibility** (libreria inline/vendored: impatto **size** e **audit**).
- Mantenere i **preset NATO** già presenti in app come base.

### 8. Backlog — Sicurezza locale

- **Cifratura locale opzionale** (Web Crypto).
- Modalità **«mil»** o protezione dati locali: da valutare.
- **Encryption-at-rest** completa: **feasibility**, non implementazione immediata obbligatoria.

### 9. Strategia proposta — Core / Field / Net (solo proposta)

Da intendere come **modello strategico da valutare**, **non** come roadmap già modificata.

| Strato | Contenuto proposto |
|--------|-------------------|
| **GOI GIS Core** | Single-file HTML; offline-first; pianificazione; conversione coordinate; mappe offline; waypoint/tracce; **CoT file-only**; tactical tools; report; DEM locale. |
| **GOI GIS Field** | Estensione futura **opzionale**: PWA eventuale; Web Serial / Web Bluetooth; GPS esterni; LRF; compass/device orientation; LoRa/Meshtastic eventuale. |
| **GOI GIS Net** | Estensione futura **non-Core**: bridge locale; TAK Server; CoT live; BFT; GeoChat; WebSocket locale. |

**Nota:** **Field** e **Net** non devono entrare nel **Core** senza decisione esplicita dell’utente.

### 10. Proposte future da approvare dall’utente

*(Solo elenco — **nessuna** modifica applicata a roadmap o rules in questo blocco.)*

- **Roadmap (`docs/roadmap.md`):** valutare se documentare ufficialmente il modello **Core / Field / Net** e i confini tra strati.
- **Rules (`.cursor/rules/*.mdc`):** chiarire che **backlog ≠** GitHub issue / commit automatico / modifica roadmap o rules senza approvazione.
- **Rules:** esplicitare che **Field/Net** non entrano nel Core senza approvazione.
- **Rules:** ribadire che **live GPS** / `watchPosition` non si reintroducono senza decisione esplicita.

### Sintesi rischi / priorità

- Sono **idee e backlog**: molte richiedono **feasibility** o **cambiamento roadmap/rules** prima di diventare operative nel monolite.
- **3D** e **Net/Bridge/live** restano **strategici / non attivi** nel Core fino a nuova decisione.
- **CoT XML file-only** resta il candidato **ad alto ROI** per interoperabilità **offline** e allineamento TAK via file.

### File toccati (questo checkpoint documentale)

- `docs/session-geolocalizzazione-e-mappa.md` (questa sezione)
- `docs/checkpoint.md` (indice breve)
- `docs/PROJECT_notes.md` (sintesi backlog)


## Checkpoint 2026-04-28 — Chiusura sessione (Finito)

### Contesto

Chiusura sessione su richiesta utente **«Finito»** (workflow progetto): consolidamento in repository delle modifiche già presenti sul working tree e aggiornamento di questa cronaca + `docs/checkpoint.md`.

### Cosa entra in commit (sintesi)

1. **`coordinate_converter Claude.html`** — evoluzioni UI **Mappe Offline / Layers** e tabella **Aree offline salvate** (pannello più grande coerente con altre modal, scroll lista, colonne ridimensionabili, azioni riga); **X delete per-riga** (`[data-offline-del]` in `.offa-actions`) allineata visivamente al pattern **Waypoint** (`#waypointModal … [data-role="wp-del"]`) con stack effettivo (padding `5px 6px`, `min-width:2.25em`, colori/bordi con `!important` dove serve, `min-height:calc(1.2em + 10px)` per anti-compressione verticale). Logiche download/cache/delta, dialog tre scelte, `data-offline-del`, `#btnBboxPick`, `#btnPrecacheStart` non oggetto di refactor funzionale in questa chiusura.

2. **`docs/`** — già registrati: **backlog strategico** (Tactical tools, cartografia, TAK/CoT, report, simbologia, sicurezza, proposta Core/Field/Net), **convenzione «mettilo nel backlog»**, sintesi in `docs/PROJECT_notes.md`.

3. **Piano non committato:** il piano tecnico *Impostazioni → Cancella tutti i dati locali* (reset totale vs *Svuota cache tile*, dialog `CANCELLA`, `clearStore` + IDB + `reload`) resta **solo analisi/plan** in chat/Cursor Plan — **nessuna** implementazione in questo commit.

### File toccati da questa append

- `docs/session-geolocalizzazione-e-mappa.md` (questa sezione)
- `docs/checkpoint.md` (riga «Ultimo cambio» aggiornata in coppia con `Finito`)


## Checkpoint 2026-04-28 — Reset totale dati locali implementato

### 1. Obiettivo

Offrire un **reset totale locale** dell’app, separato da **«Svuota tutta la cache tile»** (flusso `performOfflineGlobalReset()` invariato): cancellazione controllata di persistenza principale, chiave UI, eventuale legacy, cache tile in IndexedDB, poi ricaricamento pagina, **senza** reintrodurre rete o toccare altri siti.

### 2. UI aggiunta in Impostazioni

Nel menu **Impostazioni** (`#headerSettingsMenu`), dopo **Ripristina layout pannelli** e prima della riga Guida: blocco visivo **zona pericolosa / dati locali** con comando che apre solo un dialog (nessun wipe immediato).

### 3. Dialog e parola `CANCELLA`

Dialog dedicato **`#appFullResetDialog`** (`app-modal`): testo esplicito sui dati rimossi, nota «solo browser locale», campo dove digitare esattamente **`CANCELLA`** (stessa parola anche in EN/FR per la conferma), pulsante di conferma **danger** disabilitato finché l’input non coincide; Annulla, **×** e Esc coerenti con gli altri dialog (con blocco chiusura durante stato «cancellazione in corso» ove implementato).

### 4. Perimetro dati cancellati

`localStorage`: **`coordconv_v2`**, **`coordconv_ui_v1`**, rimozione opzionale/esplicita della chiave legacy **`coordconv_v1`**; stato applicativo persistito (waypoint, tracce, favoriti, cronologia, aree offline in metadata, preferenze, layout UI dove coperto dalle chiavi) viene azzerato al reload. **Nessuna** chiamata a **`saveStore()`** dopo il wipe e prima del reload.

### 5. IndexedDB coinvolto

Database **`CoordConvMapTiles`**, object store **`tiles`**: svuotamento tramite helper dedicato con propagazione errori (per mostrare messaggio i18n e **non** fare reload silenzioso se IndexedDB fallisce).

### 6. Differenza da «Svuota tutta la cache tile»

**«Svuota tutta la cache tile»** resta il flusso **solo tile / aree offline** legato a Mappe Offline (`performOfflineGlobalReset()` non modificato da questa feature). Il **reset totale** cancella **tutta** la persistenza app elencata sopra **più** lo store tile, quindi equivale a «fabbrica nuova» per questo sito nel browser.

### 7. Test browser utente positivo

Verifica manuale utente: **«funziona tutto»** (Impostazioni + Guida, conferma `CANCELLA`, assenza dati post-reload, nessuna regressione segnalata su cache tile globale).

### 8. Prossimo blocco consigliato

**CoT XML** import/export **file-only** (senza rete), come già indicato nel backlog interoperabilità TAK.

### File toccati (solo documentazione, questo checkpoint)

- `docs/session-geolocalizzazione-e-mappa.md` (questa sezione)
- `docs/checkpoint.md` (indice «Ultimo cambio»)
- `docs/PROJECT_notes.md` (sintesi stato/backlog)


## Checkpoint 2026-04-29 — Waypoint modal + CoT XML rifinitura (Finito)

### Contesto

Chiusura sessione su richiesta utente **«Finito»** dopo QA browser su **modal Waypoint** e interop **CoT XML file-only** (nessuna rete). Patch mirata sul monolite, senza refactor ampio.

### Cosa è cambiato (tecnico)

1. **Export CoT (dialog Waypoint):** testo hint `#waypointExportDialogCotHint` in blocco visibile sopra il pulsante CoT; `syncWaypointExportDialogUi()` distingue «tutti i *N* waypoint» (nessuna checkbox) da *K* righe selezionate; seconda sync dopo apertura dialog; i18n IT/EN/FR. Comportamento altri formati invariato.

2. **Import CoT:** `cotImportStableFingerprint`, `meta.cotImportFp` persistito e whitelisting in `loadStore`; `importCotEventsAsWaypoints` deduplica su uid noto, fingerprint, e duplicati nello stesso file. Import singolo e GeoJSON non riscritti oltre l’indispensabile.

3. **Favoriti picker (waypoint):** etichetta pulsante chiusura → **Annulla** (`waypointModal.favoritesPickerCancel`).

4. **Punto convertito → waypoint:** eligibility da `state.lastResult` (helper `getCurrentConvertedPointForWaypoint` / `hasCurrentConvertedPointForWaypoint`); toolbar Waypoint e pulsante **Aggiungi a waypoint** nel modal Converti sincronizzati da `renderResults` / `clearForm` / `renderMiniMap` / `applyLanguage`.

5. **Favoriti → Waypoint:** pulsante per favorito + `favoriteAddAsWaypoint` con controllo quasi-duplicato e feedback i18n.

### File toccati

- `coordinate_converter Claude.html` (implementazione)
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append; eventuali `docs/PROJECT_notes.md` se già presenti nel commit di chiusura)

### TODO / non toccato

- Mappe offline, `performOfflineGlobalReset`, reset totale app, geocoding, OPSEC strict, GPS live, `watchPosition`, CoT live / Mission Package / backend — **non** oggetto di questa sessione.


## Checkpoint 2026-04-29 — Track modal: dialog interni e toolbar (Finito)

### Contesto

Chiusura sessione su richiesta utente **«Finito»** dopo micro-patch sul **modal Traccia** (GIS) in `coordinate_converter Claude.html`: sostituzione di dialog nativi del browser con `<dialog class="app-modal">` coerenti, senza redesign globale e senza toccare Waypoint, CoT, mappe offline, reset locale, geocoding, OPSEC, GPS single-shot, Favoriti, Converti, Search.

### Cosa è cambiato (tecnico)

1. **Salvataggio nome traccia in archivio:** `trackPromptAndSaveCurrent()` non usa più `window.prompt`; flusso tramite **`#trackSaveNameDialog`** + `openTrackSaveNameDialog` / `closeTrackSaveNameDialog` / `trackSaveNameDialogCommit`; CTA allineate con classe **`.track-save-cta`** dove applicabile.

2. **Chiusura Traccia con bozza non salvata:** **`#trackUnsavedCloseDialog`** (Salva / Scarta / Annulla, X = Annulla, Esc) in sostituzione del `window.confirm` in `closeTrackModal` e, per i percorsi che ancora usavano il confirm, in **`trackAbandonOrFinishDraftUi`**; callback `onDiscard` / `onAfterSave` per integrare chiusura panel o reset bozza; z-index dedicato (`.track-unsaved-close-dialog`).

3. **Elimina traccia corrente:** **`#trackClearCurrentDialog`** (Elimina / Annulla) sostituisce il `window.confirm` in **`trackClear()`**; corpo operativo invariato in **`trackClearCurrentCommit()`**; i18n `track.clearDialog*`; z-index **`.track-clear-current-dialog`**.

4. **Toolbar iniziale Traccia (solo UI):** **Nuova traccia** resa primary; **Aggiungi punto convertito** e **Annulla ultimo punto** resi meno dominanti; **Importa** / **Esporta** raggruppati con separatori; logica invariata.

5. **Esc globale (document keydown):** chiusura ordinata di dialog Track (nome → clear current → unsaved) prima di altri pannelli, coerente con l’esistente.

### File toccati (commit di chiusura)

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa sezione)

### TODO / non toccato (confermato per questa sessione)

- Altri `window.confirm` / `window.prompt` sparsi (es. eliminazione tracce salvate, map waypoint clear, favoriti, offline fallbacks) **non** sostituiti in blocco; Waypoint/CoT file-only oltre le rifiniture già in checkpoint separato; **nessun** tocco a logica mappe offline, reset totale, live GPS.


## Checkpoint 2026-04-29 — Misura M1+M3 + alias aggio orchestratore (finito)

### Contesto

Chiusura sessione su comando utente **`finito`** dopo implementazione incrementale **Misura GIS** (blocchi **M1** audit stato + **M3 leggero** notifiche interne) e aggiornamento documentazione workflow orchestratore con alias **`aggio`** per **«aggiornati»**.

### Misura GIS — monolite (`coordinate_converter Claude.html`)

1. **Stato (M1):** commenti su transient (`mapMeasureMode`, `mapMeasurePts`, `mapPolyPts`, ecc.) vs preferenze in **`saveStore.settings`** (`mapMeasureUnit`, `mapMeasureKind`, `mapPolyClosed`, **`gisMeasureFlow`**); **`sanitizeGisMeasureFlow`**; caricamento **`gisMeasureFlow`** da persistenza al boot; **`gisExitMeasureTabPartial`** non azzera più il flow (preferenza UX conservata); geometrie misura **mai** nel payload store.

2. **Notifiche (M3 leggero):** **`#measOperativeNotices`** (`measClearMsgs`, `measShowInfo`, `measShowError`, `measSyncOperativeInfo`); chiavi i18n IT/EN/FR sotto **`measure.notice.*`** / **`measure.err.*`**; errori validazione **direct** in **`applyGisDirectInputsToMap`**; Esc globale (dopo Range Rings) azzera vertici misura GIS + messaggio **Esc**; **`measSyncOperativeInfo`** richiamata da **`updateMeasureReadouts`**, **`activateTab("measure")`**, cambio unità/flow/kind, **`gisRefreshI18n`**; rimossi **`saveStore`** non necessari su apply direct e contextmenu delete handle; commit **`fix(measure)`** per evitare doppia **`measSyncOperativeInfo`** che cancellava il messaggio Esc.

### Orchestratore — solo documentazione

- **`docs/orchestrator/chatgpt-checkpoint.md`**, **`docs/orchestrator/README.md`**, **`.cursor/rules/30-output-workflow.mdc`**: **`aggio`** documentato come alias breve di **«aggiornati»** (stesso significato: ChatGPT = leggere memoria da remoto; Cursor = pubblicare `latest`/`inbox` + commit/push selettivo). **`«aggiornati»`** resta valido.

### Non toccato (perimetro dichiarato)

- **`docs/roadmap.md`** non modificato in questi interventi orchestratore.
- Mappe offline core, Track/Waypoint core oltre ciò già nelle sessioni precedenti, IndexedDB tile, reset totale, OPSEC, GPS — non oggetto dei blocchi Misura/orchestratore sopra.

### File di riferimento commit

- Misura: `9f5ec8c`, `a6e8c55`, `3175e47` (sequenza feature + fix + nota inbox).
- Alias **aggio**: `f9768cb`.


## Checkpoint 2026-04-30 — Range Rings loop + mappa tile hydrate + pulizia debug (Finito)

### Contesto

Chiusura sessione su comando utente **`finito`** dopo fix verificati in GIS mode: mappa OSM che carica dopo hard refresh; **Range Rings** con lista vuota senza freeze; **rename inline** con conferma e **Annulla** coerente sulla tabella. Rimossa la strumentazione temporanea (**bf0d51**, **RR_DEBUG_PERF**, ingest localhost).

### Monolite (`coordinate_converter Claude.html`)

1. **RR — ricorsione infinita:** `rrCancelPendingRename()` chiama `renderRangeRingsList()` **solo** se esisteva un rename pendente (`p`); altrimenti il ramo lista vuota che invoca sempre `rrCancelPendingRename()` causava stack overflow.

2. **Mappa — tile dopo re-render:** incremento **`_mapTileGen`** in `renderTileMap` e passaggio a **`hydrateMapTiles(..., tileGen, fetchSig)`**; controlli stale dopo ogni `await` (`mapRoot._mapTileGen !== tileGen`, `wrap.isConnected`); **`AbortController`** su `#miniMap` (`_miniMapTileHydrateAC`) con **`fetch(..., { signal })`** per non aggiornare tile DOM sostituito; **`syncOfflineDeltaViewportHints`** con `opts.tileGen` e **`Promise.all`** sui candidati IDB (non più sequenziale).

3. **Pulizia:** rimossi `__dbgLog`, listener globali ingest-only, tutte le `fetch` verso `127.0.0.1:7268`, contatori `RR_DEBUG_PERF` e log correlati in init, boot, reset app, mini-map, RR panel, ResizeObserver, ecc.

### Orchestratore (già pubblicato prima del `finito`)

- **`ccb26bd`**: memoria `docs/orchestrator/latest.md` + inbox `2026-04-30_2130_riepilogo_monolite-debug-cleanup-post-fix.md` (monolite escluso da quel commit, come da regole).

### Non toccato

- **`docs/roadmap.md`** in questa chiusura.
- Nessun nuovo GPS, nessuna `watchPosition`, nessun fetch tile implicito oltre i fix sopra.

### File toccati da questo `finito`

- `coordinate_converter Claude.html` (commit di chiusura sessione)
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append)


## Checkpoint 2026-05-01 — Range Rings UI Blocco 1 + orchestratore (Finito)

### Contesto

Chiusura sessione su comando utente **`finito`** dopo implementazione **Range Rings Blocco 1** (standardizzazione UI allineata al piano `docs/orchestrator/inbox/2026-04-30_2345_plan_range-rings-ui-standardization.md`) con correzioni operative: **nessun clamp globale** su tutti i pannelli GIS (solo RR); **nessun redesign** Import/Export oltre rimozione azione GeoJSON da riga; pubblicazione codice e doc con **`finito`** + **riconciliazione orchestratore** dedicata.

### Monolite (`coordinate_converter Claude.html`)

1. **Mappa:** bottone **`[data-role="rangerings-open"]`** — solo icona ◎ (`.trr-btn` / `.trr-ico`), stato **`.active`** / **`aria-pressed`**; click **toggle** tramite **`gisToolButtonToggle`** + **`trackSyncPickModeUi`** / aggiornamenti in **`openRangeRingsFloatingPanelGis`** / **`closeRangeRingsPanel`**.
2. **Strumenti:** rimossi tile RR dalla griglia «Altri strumenti» e voce tool-item Info punto; **`GIS_TOOL_SECTIONS.rangerings`** mantenuto per **`activateToolPanel`** / **`gisNavigateToolTarget`**.
3. **Creazione RR:** **`#rrPickMapBtn`** / **`#rrCreateBtn`** nascosti; **`#rrPickCreateBtn`** primary; default **`#rrDistances`** `1, 5, 10` e unità **km** selezionata.
4. **Lista:** **`rangeRings.colWhen`** → Data / Date / Date; rimosso **`data-rr-exp`** e handler; pulsanti riga compatti (**✎** / **⌖** / **✕**) con i18n tooltip (**`tip.rangeRingsEditIcon`**).
5. **Pannello RR:** **`gisPanelClampRectPartialVisible`** + **`partialMinVisible: 72`** solo dove **`opts.partialMinVisible`** è definito (**drag**, **resize**, **`clampRangeRingsPanelRect`**); **`gisPanelClampRect`** core **invariato**.
6. **Rename:** **`#rrInfo`** con **`rangeRings.notice.renamePending`** durante conferma (**`rrRenderRenameConfirmUI`**, **`rrSyncRangeRingsOperativeInfo`**).

### Non toccato (confermato)

- **`hydrateMapTiles`**, **`_mapTileGen`**, **`AbortController`**, **`syncOfflineDeltaViewportHints`**, cache IndexedDB tile core, Mappe Offline core, Misura, Track core, Waypoint core, reset totale, OPSEC, GPS, geocoding.
- Fix **`rrCancelPendingRename`** (guard `if (p)`): **inalterato**.

### Orchestratore

- Inbox implementazione: **`docs/orchestrator/inbox/2026-05-01_0015_riepilogo_range-rings-ui-standardization.md`** (nel commit **`9bdf35d`**).
- Riconciliazione post-**`finito`**: **`docs/orchestrator/latest.md`** + **`docs/orchestrator/inbox/2026-05-01_0020_riepilogo_finito-sessione.md`** — commit **`1077266`** `docs: orchestratore — riconciliazione finito sessione` (su `main` dopo rebase; preceduto da **`0d0892e`** docs remoto).

### File toccati da questo `finito`

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append)
- `docs/orchestrator/latest.md`, `docs/orchestrator/inbox/2026-05-01_0015_riepilogo_range-rings-ui-standardization.md`
- `docs/orchestrator/inbox/2026-05-01_0020_riepilogo_finito-sessione.md`


## Checkpoint 2026-05-01 — Favoriti waypoint + convertitore (Finito)

### Contesto

Chiusura sessione su comando utente **`finito`** dopo implementazione del blocco **salvataggio Favoriti** da **Waypoint Modal** (azione per riga) e da **Convertitore** (risultato corrente), riusando **`state.favorites`** e le convenzioni già presenti (nessun secondo store). Documentazione orchestratore sul blocco: `docs/orchestrator/inbox/2026-04-30_1200_riepilogo_favorites-from-waypoint-converter.md` (commit **`a0b48e3`**, monolite escluso fino a questa chiusura).

### Monolite (`coordinate_converter Claude.html`)

1. **`pushFavoriteEntrySilent`**, **`flashPasteStatusLine`**, **`showWpModalListFavFeedback`**, **`addConvertedResultToFavoritesSilent`**, **`favoriteAddFromWaypointRowId`** — salvataggio senza `alert`/`prompt`/`confirm` su questi flussi; località convertitore solo se **`state.lastLocality`** già coerente con **`state.lastResult`** (nessuna rete aggiuntiva).
2. **UI:** `#btnAddResultToFavorites`, `#wpListFavFeedback`, pulsante **`★`** `data-role="wp-fav"` in **`renderWpModalList`**.
3. **i18n IT/EN/FR:** `fav.addFromResult`, `fav.convertedPointName`, `fav.savedFromWaypoint`, `fav.savedFromConverter`, `fav.noValidPoint`, `tip.favAddFromResult`, `tip.favAddWaypointRow`.

### Non toccato (confermato)

Mappe Offline core, tile hydrate, `_mapTileGen`, AbortController tile, `syncOfflineDeltaViewportHints`, IndexedDB tile, OPSEC, GPS, Range Rings, Track, Misura, `docs/roadmap.md`. **`addCurrentAsFavorite`** (flusso con `prompt`) invariata.

### File toccati da questo `finito`

- `coordinate_converter Claude.html`, `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append)


## Checkpoint 2026-05-01 — Pass 4B SunCalc vendored split + fix Astro + rule orchestratore (Finito)

### Contesto

Chiusura sessione su comando utente **`finito`** dopo: **Pass 4B Step 1** (split Tier 1 SunCalc in `<script>` vendored dedicato prima del core); **fix runtime** Astro (`window.SunCalc` + resolver in `runAstroUI`); aggiornamento **`.cursor/rules/30-output-workflow.mdc`** (memoria orchestratore obbligatoria anche con monolite solo locale); commit memoria intermedi su `main` (**`555f6c5`**, **`fc52438`**, **`b3cb726`**). Questo checkpoint consolida **monolite** + documentazione sessione/checkpoint ufficiale.

### Monolite (`coordinate_converter Claude.html`)

1. **Script vendored** (prima del core): header VENDORED + IIFE SunCalc invariata nel corpo matematico; **`window.SunCalc = SunCalc`** dopo `})();` (commento senza sottostringa `<script` letterale nei grep).
2. **Core:** rimosso il blocco SunCalc duplicato; callsite stampa/self-check restano su **`SunCalc.*`** dove già presenti.
3. **Astro UI:** **`runAstroUI`** — `const sc = (typeof SunCalc !== "undefined" ? SunCalc : window.SunCalc);` e **`sc.getTimes` / `sc.getMoonTimes` / `sc.getMoonIllumination`**.

### Orchestratore (pre-finito, già su remoto)

- Rule workflow: **`docs/orchestrator/inbox/2026-05-01_0253_riepilogo_rule-orchestrator-local-work.md`** + `latest` (commit **`555f6c5`**).
- Fix Astro documentato: **`docs/orchestrator/inbox/2026-05-01_0304_riepilogo_pass4b-suncalc-local-fix.md`** (`fc52438`, micro **`b3cb726`**).

### Non toccato (confermato in questa sessione per i blocchi Pass 4B)

- WMM, OLC/Plus Code, QR (come da piano Pass 4A); **`docs/roadmap.md`** in questa chiusura.

### File toccati da questo `finito`

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append)


## Checkpoint 2026-05-01 — Pass 5 Step B→E.2 Astro GIS (pannello, pickers, modali) (`finito`)

### Contesto

Chiusura sessione su comando utente **`finito`**. Il monolite consolidava **Pass 5** dopo lo Step A già chiuso: **B** pannello Astro floating; **C** map-pick e fix Esc/Range Rings; **D–D.2** picker waypoint Astro; **E–E.1** picker favoriti Astro + resize; **E.2** polish modal Favoriti/Waypoint (summary duplicato, **Centra** mappa, trasparenza GIS). Memoria orchestratore già pubblicata in commit separati (**`56205de`**, **`6a47a9f`**, **`1b1653a`**) senza monolite fino a questo **`finito`**.

### Monolite (`coordinate_converter Claude.html`) — sintesi

1. **Step B — `#astroPanel`:** dialog GIS non modale, drag/resize, clamp, sorgenti **result** / **mapCenter**, `runAstroPanelUI` / wiring Esc e `gisRefreshI18n`.
2. **Step C — `mapPick`:** `astroEnterPickCenterMode` / `astroClearPickCenterMode` / `astroApplyPickedMapPoint`; conflitti disarmati con altri tool; Esc in `bindHotkeys` non chiude Astro quando si chiude solo RR pick.
3. **Step D / D.1 / D.2 — `#astroWaypointPicker`:** tabella ricercabile, colonne opzionali, sort, tooltip/i18n, max 50, **Usa** → `state.astro` waypoint.
4. **Step E / E.1 — `#astroFavoritePicker` + pickers:** stesso pattern; Meta favoriti senza rumore ripetuto; resize/drag sessione `gPanelLayouts` (`astroWpPicker`, `astroFavPicker`); teardown floating coerente.
5. **Step E.2 — modal principali:** CSS summary **Favoriti** nel `#favoritesPanel` (schema Range Rings); **`gisMapCenterOnLatLon`** + **`favoriteMapCenterTo`** / **`waypointsZoomTo`** con badge **`map.noticeCenteredOnPoint`**; pannelli body/panel leggermente trasparenti in GIS.

### Non toccato (confermato in questa chiusura)

- **`docs/roadmap.md`**.
- Vincoli sessione E.2 rispettati: nessun `lastResult` / cronologia / permalink / nuovo `localStorage` per questi passi.

### File toccati da questo `finito`

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append)


## Checkpoint 2026-05-01 — Pass 5 Step A Astro state + convenzione prompt operativi (`finito`)

### Contesto

Chiusura sessione su comando utente **`finito`**. Il working tree includeva già modifiche al monolite (**Pass 5 Step A**): stato transient Astro e adeguamento `runAstroUI`. In chat nella stessa sessione l’utente ha definito una **convenzione operativa** per i prompt successivi: ogni richiesta operativa deve già includere implementazione, verifiche automatiche obbligatorie, test browser se possibile, pubblicazione memoria orchestratore e RIEPILOGO con esito, senza un secondo prompt dedicato ai controlli di routine (eccezioni: output mancante/contraddittorio, test fallito, rischio reale prima di commit, dichiarazione esplicita di impossibilità di eseguire i controlli).

### Monolite (`coordinate_converter Claude.html`)

1. **`state.astro`**: oggetto transient (`source`, `lat`, `lon`, `label`, `origin`, `pickMode`, `error`) — commento esplicito: non persistito in `saveStore`.
2. **`astroPanelOpen`**, **`astroPickCenterMode`**: boolean transient (preparazione Step B+ pannello floating / pick mappa).
3. **`runAstroUI`**: early return se manca `#astro-result` o data input; risoluzione `lat`/`lon` da `state.astro` se numeri finiti, altrimenti da `state.lastResult` con validazione; uso stesso resolver SunCalc già in uso (`SunCalc` / `window.SunCalc`).
4. **i18n:** chiave **`astro.col.utcLmt`** (IT/EN/FR) per intestazione tabella UTC+LMT.

### Convenzione chat (non versionata in `.cursor/rules` in questo `finito`)

- Prompt operativi: bundle **implementazione + QA automatica + test browser se possibile + autosync orchestratore + RIEPILOGO** salvo eccezioni elencate dall’utente.

### Non toccato (confermato)

- **`docs/roadmap.md`**, markup pannello Astro dedicato (Step B resta backlog se non già presente altrove).

### File toccati da questo `finito`

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append)


## Checkpoint 2026-05-01 — Pass 5 Step E.3 monolite + Pass 6 piano orchestratore (`finito`)

### Contesto

Chiusura sessione su comando utente **`finito`**. Il working tree conteneva ancora le modifiche **Pass 5 Step E.3** (partial-offscreen per modal **Waypoint** e **Favoriti**) non versionate nel monolite rispetto a `HEAD`. In precedenza nella sessione era stato pubblicato solo su documentazione orchestratore il **piano Pass 6** (standardizzazione liste modali GIS; nessuna implementazione codice): commit **`13a7a48`** su `main`.

### Monolite (`coordinate_converter Claude.html`) — Step E.3

1. **`_waypointPanelLayoutOpts`** / **`_favoritesPanelLayoutOpts`**: aggiunto **`partialMinVisible: 72`** (commento Pass 5 Step E.3).
2. **`clampWaypointModalRect`**: clamp da **`gisPanelClampRect`** a **`gisPanelClampRectPartialVisible`**.
3. **`clampFavoritesPanelRect`**: idem (coerenza drag/resize con strip visibile minima).

### Documentazione / memoria

- **`docs/checkpoint.md`**, append **`docs/session-geolocalizzazione-e-mappa.md`** (questa sezione).
- Piano Pass 6 già in repo: `docs/orchestrator/inbox/2026-05-01_1709_plan_pass6-modal-actions-standardization.md` (commit `13a7a48`).

### Non toccato

- **`docs/roadmap.md`**, `.cursor/rules` in questo `finito` (step principale).
- Nessuna implementazione Pass 6 sul monolite.

### File toccati da questo `finito`

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append)


## Checkpoint 2026-05-02 — Pass 6 batch monolite fino a 6E.1d (`finito`)

### Contesto

Chiusura sessione su comando utente **`finito`**. Il monolite era avanzato in locale rispetto all’ultimo **`finito`** che lo aveva versionato (**Pass 5 Step E.3**, commit **`9a90fbc`**): accumulo **Pass 6** documentato progressivamente in **`docs/orchestrator/inbox/`** (commit memoria selettivi senza monolite fino a **6E.1d**). Questa chiusura **committa e pubblica** il file **`coordinate_converter Claude.html`** con l’intero batch fino a **Step 6E.1d**.

### Sintesi monolite (`coordinate_converter Claude.html`)

- **6A / 6A.1 / 6A.2:** Preferiti e Waypoint — azioni tabella compatte, tooltip/conferme, partial-offscreen modali; rename UI **Preferiti** (etichetta utente).
- **6B:** `#layersPanel` partial-offscreen, azioni aree offline compatte.
- **6C–6C.4:** `#trackModal` partial-offscreen; contestuale tracce salvate; GPS mappa (one-shot); hover/doppio click; pulse overlay.
- **6E.1:** minimizza pilot **Traccia** / **Waypoint**, dock `#gisMinimizedDock`, blocco sub-dialog, i18n minimizza.
- **6E.1a–6E.1c:** smoke (Esc senza recentro mappa, guard chiusura Waypoint, allineamento GPS/`lastPoint`), polish dock/animazioni/GPS, **Converti** partial-offscreen e offset dock.
- **6E.1d:** apertura Astro / drawer Strumenti **non** chiude più Traccia (`openToolsDrawer`, `activateToolPanel` eccezione `astro`).

### Non incluso in questo `finito`

- **Pass 6 Step 6E.2** (minimizza `#favoritesPanel`, `#layersPanel`, `#astroPanel`, `#rangeRingsPanel` + polish pulsante Waypoint mappa): **solo piano**, nessuna implementazione nel commit.

### Documentazione

- Aggiornati **`docs/checkpoint.md`** e questa append.
- **`docs/roadmap.md` non modificato.**

### File toccati da questo `finito`

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append)


## Checkpoint 2026-05-02 — Pass 6 Step 6E.2 minimizza quattro pannelli (`finito`)

### Contesto

Seconda chiusura **`finito`** nella stessa giornata: dopo il commit **`af69673`** (batch Pass 6 fino a **6E.1d**), il monolite aveva ancora in working tree l’implementazione **Pass 6 Step 6E.2** (già descritta in memoria orchestratore **`2026-05-01_1830_riepilogo_pass6-step6E2-minimize-panels-guards-local.md`**). Questa chiusura **committa e pubblica** **`coordinate_converter Claude.html`** con **6E.2**.

### Sintesi monolite (`coordinate_converter Claude.html`)

1. Minimizza **Preferiti**, **Mappe offline**, **Astro**, **Range Rings**: pulsante `−`, notice interna, chip dock (`gis.minimized.*`).
2. **Guard:** `#favInlineConfirmBar` visibile; `#offlineDraftWarnDialog` aperto; picker Astro aperti; RR: `#rrSourcePickerDialog` / `#rrDeleteConfirm` / `#rrBatchBar` — blocco minimizza con messaggio i18n dedicato, **senza** chiudere automaticamente tali UI.
3. **Esc:** se il pannello è **`gis-panel-minimized`**, non si esegue la chiusura del floating (coerenza con Traccia/Waypoint).
4. **Waypoint mappa:** stato toolbar allineato a `#waypointModal.open` in GIS; **`trackSyncPickModeUi`** dopo minimizza/restore.

### Non toccato (per vincolo di implementazione)

GPS core, Converti, OPSEC, tile/cache, geocoding, IndexedDB, schema dati, `localStorage`, `state.lastResult`.

### Documentazione

- Aggiornati **`docs/checkpoint.md`** e questa append.
- **`docs/roadmap.md` non modificato.**

### File toccati da questo `finito`

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append)


## Checkpoint 2026-05-02 — Pass 6 Step 6F.1 e 6F.1a Converti waypoint (`finito`)

### Contesto

Chiusura ufficiale **`finito`** dopo lavoro locale su **Pass 6 Step 6F.1** (Converti → waypoint + rimozione preferito da lista Waypoint con conferma interna) e micro-fix **6F.1a** (visibilità pulsanti waypoint/preferiti nel pannello Converti GIS). La memoria orchestratore per 6F.1 / 6F.1a era già stata pubblicata **senza** il monolite; questo **`finito`** **allinea il repository** con **`coordinate_converter Claude.html`** su `main`.

### Sintesi monolite (`coordinate_converter Claude.html`)

1. **6F.1 — Converti → waypoint:** feedback `#convertWaypointFeedback` (`setConvertWaypointFeedback` / `clearConvertWaypointFeedback`); `syncConvertResultWaypointBtn` anche all’apertura di `openConvertModal`; `waypointAddFromConvertedPoint` usa feedback in pannello quando Converti è aperto; tooltip disabilitato `convert.addWaypointDisabled` su `#btnAddResultToWaypoint`.
2. **6F.1 — Waypoint → Preferiti:** click stella se esiste già un preferito alle stesse coordinate → `#wpRemoveFavBar` + conferma; rimozione di **un** favorito (primo match in `state.favorites`, ordine `unshift` = più recente); `removeFavoriteExecute`; feedback `#wpListFavFeedback`; Esc / `waypointModalUnsavedCloseRisk` / `closeWaypointModal` coerenti.
3. **6F.1a:** `.convert-cm-primary-actions` con `#btnAddResultToWaypoint` / `#btnAddResultToFavorites` e `#convertWaypointFeedback` **prima** di `#results`; riga `.convert-cm-actions-row` solo export/copy; CSS scoped `#convertModalBody` (marker `6F.1a`).

### Non toccato (per scope)

Parser conversione, schema persistenza nuovo, GPS/Misura/Range Rings/Traccia/Astro/Mappe offline/OPSEC/geocoding/IndexedDB ove non già coinvolti da commit precedenti; nessun `watchPosition`; nessun `alert` / `window.confirm` sui flussi 6F.1 elencati.

### Documentazione

- Aggiornati **`docs/checkpoint.md`** e questa append.
- **`docs/roadmap.md` non modificato.**

### File toccati da questo `finito`

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append)


## Checkpoint 2026-05-02 — Pass 6 Step 6F.2 e 6F.2a Waypoint batch Preferiti + icona pin (`finito`)

### Contesto

Chiusura ufficiale **`finito`** dopo lavoro locale su **Pass 6 Step 6F.2** (multi-selezione lista waypoint nel modal + azione batch **Aggiungi selezionati ai Preferiti** con feedback interno, `deferPersist` su `pushFavoriteEntrySilent`, i18n dedicata) e micro-fix **6F.2a** (lista Preferiti: pulsante **`data-fav-waypoint`** con icona **📍** al posto della stella **★**, tooltip/aria `tip.favAddWaypoint` invariati). La memoria orchestratore per 6F.2 / 6F.2a era già stata pubblicata su `main` **senza** il monolite; questo **`finito`** **allinea il repository** con **`coordinate_converter Claude.html`** su `main`.

### Sintesi monolite (`coordinate_converter Claude.html`)

1. **6F.2:** `waypointModalSelectedRowIds` (`Set`, prune su render/delete/chiusura modal); integrazione con checkbox esistenti e `#wpSelectAll`; `#wpBatchFavRow` + `syncWpModalBatchFavUi`; `waypointModalAddSelectedRowsToFavorites`; dopo batch rimozione dal `Set` degli id aggiunti; `wpClearListFavFeedbackQuiet` quando si aprono `#wpDeleteOneBar` / `#wpRemoveFavBar`.
2. **6F.2a:** in `renderFavorites`, solo simbolo visibile del pulsante aggiungi-waypoint da preferito: **📍** (coerente waypoint/pin; **⌖** resta per centra mappa sulla stessa riga).

### Non toccato (per scope dichiarato)

Logica core Preferiti/waypoint oltre alle estensioni sopra; Converti, GPS, Misura, Range Rings, Traccia, OPSEC, tile/geocoding/IndexedDB, schema `saveStore`, cronologia, permalink.

### Documentazione

- Aggiornati **`docs/checkpoint.md`** e questa append.
- **`docs/roadmap.md` non modificato.**

### File toccati da questo `finito`

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append)


## Checkpoint 2026-05-02 — Pass 6 Step 6F.3 Waypoint delete selezionati conferma interna (`finito`)

### Contesto

Chiusura ufficiale **`finito`** dopo lavoro locale su **Pass 6 Step 6F.3**: sostituzione del **`window.confirm`** nel flusso **Elimina selezionati** con barra di conferma interna nel modal Waypoint (**`#wpDeleteSelectedBar`**), allineata a **`#wpDeleteOneBar`** / **`#wpRemoveFavBar`**. La memoria orchestratore per 6F.3 era già stata pubblicata su `main` (**`6ec3f99`** + micro **`8082d1a`** su `latest.md`); il monolite restava **solo in working tree** fino a questo **`finito`**, che **allinea il repository** con **`coordinate_converter Claude.html`**.

### Sintesi monolite (`coordinate_converter Claude.html`)

1. **`waypointsDeleteSelectedBulk`:** usa **`waypointModalSelectedRowIds`** ∩ **`state.mapWaypoints`** (dopo **`wpModalPruneWaypointSelection`**); vuoto → **`showWpModalListFavFeedback("err", waypointModal.noSelection)`**; altrimenti apre la barra conferma.
2. **`waypointsDeleteSelectedExecute`:** elimina solo id ancora presenti, pulisce **`waypointModalSelectedRowIds`**, **`saveStore`**, **`renderMapWaypointsAll`**, feedback **`waypointModal.deleteSelectedDone`** con **`{count}`**.
3. **UX:** mutua esclusione delle tre barre; Esc prioritario sulla barra bulk; batch Preferiti / deseleziona / seleziona tutti chiudono la barra bulk per evitare messaggi obsoleti.

### Non toccato (per scope)

Schema dati, **`state.savedTracks`**, **`state.lastResult`**, nuove chiavi `localStorage`, Preferiti oltre coesistenza (delete waypoint non rimuove preferiti), Converti, GPS, Misura, Range Rings, Traccia, OPSEC, tile/IndexedDB/geocoding, SunCalc/WMM/OLC/QR.

### Documentazione

- Aggiornati **`docs/checkpoint.md`** e questa append.
- **`docs/roadmap.md` non modificato.**

### File toccati da questo `finito`

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append)


## Checkpoint 2026-05-27 — T1.6 minimal GeoJSON export classification marking

### Contesto

Implementazione minima su richiesta `docs/requests/2026-05-27-classification-markings-export-request.md` (workflow 42 trigger `f51785a`). Primo passo verso **T1.6 Classification markings on exports** senza sistema completo.

### Sintesi monolite

1. **`exportGeoJsonMetadata(extra)`** — metadata export GeoJSON con `creator`, `generated`, **`classification: "UNCLASSIFIED"`** (default non sensibile).
2. Applicato a: **`buildGeoJSON`**, **`buildGeoJSONRoute`**, **`spatialBuildFeatureCollectionFromAppState`**, **`gisAllAsFeatureCollection`**, **`savedTrackToFeatureCollection`**, export GeoJSON modal waypoint.
3. **Non toccato:** GPX, KML, KMZ, CSV, UI, `localStorage`, rete, import, OPSEC, geocoding, tile cache.

### Limitazioni

Nessuna preferenza utente; nessun handling CUI/SECRET; GPX/KML/CSV e print report non estesi in questo passo.

### Verifica

- `node --check` sul blocco `<script>` principale del monolite: OK.
- Browser QA: **NOT EXECUTED** (superseded by browser PASS checkpoint below).

### File toccati

- `coordinate_converter Claude.html`
- `docs/requests/2026-05-27-classification-markings-export-request.md`
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append)


## Checkpoint 2026-05-27 — Browser PASS T1.6 GeoJSON classification marking

### Contesto

Browser QA manuale post-implementazione **`c59d2de`** (`feat: add minimal export classification marking`). Nessun codice modificato in questa sessione.

### Test

- Creato/esportato waypoint → GeoJSON dal modal waypoint.
- File scaricato correttamente; nessun errore evidente.

### Metadata osservato

- `metadata.classification`: **`UNCLASSIFIED`**
- `metadata.kind`: **`waypoints`**
- `metadata.creator`: `GOI GIS Tool`
- `metadata.generated`: ISO timestamp (es. `2026-05-27T00:26:30.435Z`)

### Esito

**PASS**

### File toccati (questa sessione)

- `docs/requests/2026-05-27-classification-markings-export-request.md`
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append)
- `docs/orchestrator/latest.md`


## Checkpoint 2026-06-12/2026-06-13 — Deploy VPS tailnet, ACL, systemd, SonarChart proxy, documentazione

### Contesto

Sessione operativa post-pivot «solo tailnet privata» (commit monolite **`44b127c`**, orchestratore **`f4a3040`**). Obiettivo: GOI GIS Tool + proxy Navionics Planet-Clone raggiungibili da client tailnet, runtime stabile su VPS condiviso con n8n, consolidamento SonarChart lato proxy, chiusura documentale Blocco 4.

### Narrazione tecnica (ordine cronologico)

1. **Deploy VPS** — clone/runtime sotto `/root/local-files/handoff-runtime/`: app GIS in `cursor-coordinate-converter`, proxy Navionics in `Planet-Clone`.
2. **Planet-Clone come proxy Navionics** — `proxy.py` con auto-refresh token Garmin, endpoint `/tiles/` (Seachart, layer 0).
3. **Verifica iniziale tmux** — app GIS (`python -m http.server` :8000) e proxy (`flask` :5000) avviati manualmente su IP tailnet VPS (`100.114.7.53`).
4. **Timeout da Windows** — client tailnet non raggiungeva porte 22/5000/8000 nonostante `tailscale ping` OK.
5. **Diagnosi causa-radice** — ACL Tailscale restrittiva (grant esistente solo VPS → Ryzen `tcp:443`); firewall host (`ufw`/`iptables`/`nftables`) aperto su `tailscale0`; blocco a livello tailnet policy, non host.
6. **Workaround tunnel SSH** — `ssh -L` usato temporaneamente per smoke test; dismesso dopo fix ACL.
7. **Grant ACL additivo** — applicato manualmente in admin console Tailscale il **2026-06-13**: `{ "src": ["autogroup:member"], "dst": ["100.114.7.53/32"], "ip": ["tcp:8000", "tcp:5000"] }`; grant VPS → Ryzen `tcp:443` e regola SSH `check` preservati.
8. **Smoke test diretto PASS** — browser su tailnet: app GIS OK, layer Navionics OK, overlay OpenSeaMap seamarks OK; nessun tunnel.
9. **Sostituzione tmux con systemd** — unit `goi-gis-app.service` e `goi-nav-proxy.service`: bind a IP tailnet runtime (`tailscale ip -4 | head -n1`), `ExecStartPre` attende IPv4 Tailscale, `After=tailscaled.service network-online.target`, `Restart=on-failure`.
10. **Restart test PASS** — restart delle due unit verificato; reboot-test **non** eseguito (VPS condiviso con n8n, rinviato a finestra concordata).
11. **Riallineamento repo GIS locale** — fast-forward a **`f4a3040`** (`docs: orchestratore — Navionics proxy host tailnet privata`); commit rilevanti catena: **`b3bacf2`** (Navionics + OpenSeaMap), **`9c5427c`** (README setup), **`44b127c`** (host proxy da page host).
12. **SonarChart Planet-Clone** — commit **`5e57c7f`**: endpoint `/sonar/{z}/{x}/{y}.png` (layer 1, `transparent=true`), `/tiles/` invariato (Seachart), `/status` con `charts.seachart` + `charts.sonarchart`.
13. **Deploy VPS Planet-Clone aggiornato** — `git pull --ff-only` su `/root/local-files/handoff-runtime/Planet-Clone` → HEAD **`5e57c7f`**.
14. **Restart solo `goi-nav-proxy.service`** — `goi-gis-app.service` non toccato.
15. **Verifica `/status`** — `tokens_ok: true`, entrambi gli endpoint sotto `charts`.
16. **Verifica tile SonarChart** — `/sonar/13/2247/3668.png` HTTP 200, `image/png`, 256×256 RGBA, ~1073 byte; contenuto **diverso** da `/tiles/13/2247/3668.png` (coerente con overlay trasparente vs base opaca).
17. **Precisazione architetturale** — SonarChart disponibile **solo** lato proxy Planet-Clone (e viewer Cesium di Planet-Clone); il **monolite GIS non consuma ancora `/sonar/`** e usa solo `/tiles/` per Navionics.
18. **Pivot lessicale/i18n** — label UI da «proxy locale» a «proxy tailnet» (IT/EN/FR); commit **`fb4dcb0`**.
19. **Prossimi blocchi** — autosync memoria orchestratore; appendice control-plane ACL; **Blocco 5 audit OPSEC** (porte raw 5000/8000, SonarChart proxy, B2 `tailscale serve` + rebind loopback + URL relative); reboot-test; integrazione futura SonarChart nel monolite (pattern seamarks, toggle indipendente, i18n); Pass 5 Astro congelato in attesa verdetto.

### Accesso operativo

- Solo tailnet; URL GIS: `http://100.114.7.53:8000/coordinate_converter%20Claude.html`
- Proxy Navionics: `http://100.114.7.53:5000`

### Backlog registrato

- Audit OPSEC porte raw tailnet + SonarChart lato proxy + valutazione B2
- Reboot-test systemd in finestra concordata
- Integrazione SonarChart nel monolite GIS (overlay indipendente, non implementata in questo blocco)
- Pass 5 Astro congelato

### File toccati (Blocco 4 documentale)

- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append), `README.md`
- `coordinate_converter Claude.html` (solo i18n, commit **`fb4dcb0`**)
- `docs/orchestrator/latest.md` + inbox (commit autosync separato)


## Checkpoint 2026-06-13 — Blocco 5 / 5A — Audit OPSEC read-only e registrazione documentale

### Contesto

Blocco 5: audit OPSEC **read-only** completato sullo stato post-deploy tailnet (GIS + proxy Planet-Clone `5e57c7f`, systemd, ACL grant). Nessuna patch, nessun commit, nessun push nel blocco 5 originario. Blocco 5A: registrazione esiti in docs + autosync orchestratore (questa append).

### Verdetti audit (stato attuale, non decisione futura)

1. **`opsecStrict` oggi copre geocoding/Nominatim** (`geocodingAllowed()`), non i tile mappa.
2. **Basemap `osm`/`topo`/`sat`:** fetch se online e non forced-offline; **non** gated da strict.
3. **Navionics monolite:** usa `/tiles/` via proxy tailnet (`getNavProxyHost():5000`); **non** gated da strict.
4. **Seamarks/OpenSeaMap:** fetch **diretto browser** a `tiles.openseamap.org` quando overlay attivo; **non** gated da strict; **spento** in forced-offline.
5. **Tracking host** (`#netStatus` / `refreshHostsContactedUI` / `_nominatim.hostsContacted`): sostanzialmente Nominatim; **non** registra proxy Navionics, OpenSeaMap, basemap.
6. **Porte raw tailnet `5000`/`8000`:** rischio da **MITIGARE** (accettabile solo come stato temporaneo se tailnet = boundary forte).
7. **Proxy Navionics `:5000`:** accessibile ai nodi tailnet autorizzati; **open-proxy** tailnet (no auth app, no rate-limit) — **MITIGARE**.
8. **`/sonar/` SonarChart:** aumenta superficie lato proxy; monolite GIS **non** lo consuma ancora — **ACCETTABILE A BREVE**.
9. **Forced-offline/cache:** comportamento coerente (nav da IDB; seamarks off) — **ACCETTABILE A BREVE**.
10. **B2** (`tailscale serve` + rebind loopback + URL relative): da **pianificare** come blocco separato — **NON ESEGUIRE SUBITO** (design URL/routing/rollback, attenzione `--set-path`).
11. **Reboot-test systemd:** ancora rinviato — **ACCETTABILE A BREVE** se pianificato in finestra concordata.

### Decisione pendente (non scelta in questo blocco)

Semantica futura di **`opsecStrict`:** mantenere solo geocoding (stato attuale documentato in i18n settings) **oppure** estendere a blocco/avviso di tutte le chiamate esterne (basemap, Navionics, seamarks). **Nessuna scelta approvata.**

### Classificazione rischi registrata

- **MITIGARE:** porte raw 5000/8000; open proxy tailnet; Navionics/seamarks sotto strict senza gate; tracking host incompleto.
- **ACCETTABILE A BREVE:** SonarChart lato proxy non integrata nel monolite; forced-offline/cache; reboot-test rinviato.
- **NON ESEGUIRE SUBITO:** migrazione B2 senza blocco design dedicato.

### Backlog candidati (non approvati come piano)

- **A** — Gate/avviso `opsecStrict` per Navionics + seamarks (dopo decisione semantica).
- **B** — Estensione tracking host a proxy, seamarks, basemap.
- **C** — Piano B2: `tailscale serve` + loopback + URL relative (`--set-path` / prefisso path).
- Documentazione accettazione rischio porte raw / open proxy tailnet.
- Integrazione SonarChart nel monolite (overlay separato, pattern seamarks, toggle, i18n IT/EN/FR).
- Reboot-test in finestra concordata.
- Pass 5 Astro congelato.

### File toccati (Blocco 5A)

- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md` (questa append), `README.md` (precisazione minima OPSEC strict)
- `docs/orchestrator/latest.md` + inbox (commit autosync separato)


## Checkpoint 2026-06-13 — OPSEC Step 4 QA e chiusura ciclo strict graduato

### Contesto

Ciclo OPSEC Steps 1–4 completato nel monolite (`8885e10` → `83d65ef`). Step 4 = QA finale mirato + chiusura documentale. VPS pull e smoke test Step 3 superati (pre-Step 4).

### QA eseguito (statico + revisione codice)

| Area | Esito |
|---|---|
| i18n `opsec.strict.*` IT/EN/FR (5 chiavi) | OK — presenti e coerenti |
| Dialog interni (`#opsecStrictConfirmDialog`) | OK — Navionics, precache, export JPG; nessun `window.confirm` sui flussi OPSEC Step 3 |
| `activateWarn` | OK — solo toggle strict ON (`setBadge`); non su fetch/render/download |
| Gate graduato | OK — `forceOffline`, cache hit, internet block, Navionics consenso `_`, seamarks secchi, Esri/Open-Meteo |
| Tracking Step 1–2 | OK — `_netEvents` transiente; fusione tooltip; nessuna riga Cache inventata |
| `/sonar/` | Non integrato (backlog) |

### Fix codice Step 4 (minimi)

1. **`set.opsec.strict` IT/EN/FR** — label impostazioni allineata a strict graduato (prima descriveva solo geocoding).
2. **Toggle strict** — rimosso secondo `setBadge(seamarksBlocked)` sovrapposto ad `activateWarn` (seamarks già bloccati al re-render).

Nessun'altra regressione rilevata; nessun refactor.

### Semantica definitiva documentata

Vedi `docs/checkpoint.md` (entry 2026-06-13 Step 4) e README *Security / OPSEC notes*.

### Backlog infra (non chiuso in Step 4)

- Porte raw tailnet 5000/8000; open proxy Navionics; B2 `tailscale serve` + loopback; reboot-test systemd; integrazione SonarChart `/sonar/` nel monolite (tailnet-proxy + consenso Navionics).

### Commit Step 4

- Fix codice (se presente) + docs operative + autosync orchestrator (inbox Step 4 QA).

### Deploy post-push

Dopo push: `git pull --ff-only` manuale sul VPS (`/root/local-files/handoff-runtime/cursor-coordinate-converter`).

## Checkpoint 2026-06-15 — WU-0008 8d-B pre-check EOX + backlog metodo (Finito)

### Contesto

Chiusura sessione **`finito`** — intervento **solo docs** dopo completamento runtime **8d-B1-B3** (`89f53ff`, finito precedente stesso giorno). Obiettivo: registrare formalmente il **pre-check read-only** prerequisiti layer EOX Sentinel-2 cloudless e aprire il **backlog metodo** post-catena 8d.

### Cosa è stato fatto

1. **`docs/work-units/WU-0005-0009-roadmap.md`**
   - §8d-B: stato aggiornato (8d-B0 + 8d-B1 + **pre-check PASS** a HEAD `9f98c5d`).
   - Sottosezione **Pre-check read-only prerequisiti EOX — PASS a HEAD `9f98c5d`** con PRE-CHECK 1 (`OFFLINE_LAYER_IDS`, set eligible vs `cacheable:false`) e PRE-CHECK 2 (`clampBasemapFitZoom`, fit-area, residui GPS/loadStore non bloccanti).
   - Vincoli bloccanti prompt EOX runtime (licenza, CC BY-NC-SA, no deploy pubblico, online-only, `cacheable:false`, maxZoom conservativo).
   - Nuova sezione **Backlog metodo — Adozione metodo / handoff discipline** (fonti control-plane + dev-method; metodo adozione; tensione `aggio`; idea reviewer Claude non decisa).
   - Sequenza: item 29 pre-check ~~done~~; item 30 EOX runtime; Fase 4 rinumerata 31–35; tabella dipendenze 8d aggiornata.

2. **`docs/OPERATING_MEMORY.md` §7**
   - Bullet **WU-0008 8d-B EOX** pre-check PASS + prompt parcheggiato.
   - Bullet **Backlog metodo** con puntatore roadmap.

3. **Micro-fix heading:** titolo pre-check senza data narrativa (solo SHA `9f98c5d`).

### Non toccato

- `coordinate_converter Claude.html` — nessuna modifica.
- `docs/roadmap.md`, `.cursor/rules/**`, checkpoint ufficiali pre-`finito` (aggiornati da questo trigger).

### QA

- Solo documentazione; nessun `node --check` richiesto (monolite invariato).
- Pre-check eseguito read-only su HEAD `9f98c5d` in sessione Cursor (OFFLINE_LAYER_IDS + clampBasemapFitZoom).

### Prossimo passo consigliato

- **WU-0008 8d-B** — layer EOX runtime quando gate licenza/hosting risolti (prompt parcheggiato).
- **Backlog metodo** — adozione pattern control-plane quando team decide risoluzione tensione `aggio`.

## Checkpoint 2026-06-15 — WU-0008 8d-B EOX Sentinel-2 cloudless runtime (Finito)

### Contesto

Chiusura sessione **`finito`** — implementazione runtime layer EOX dopo pre-check PASS e review read-only del gating allowlist.

### Cosa è stato fatto (monolite)

1. **Layer `eoxS2Cloudless`** in `TILE_LAYERS`: endpoint EOX 2024, `cacheable:false`, `maxZoom:18`, attribution CC BY-NC-SA.
2. **Gate host fail-closed allowlist:** `isPrivateEoxHostAllowed()` — `localhost` / `*.localhost`, `127.0.0.0/8` (primo ottetto 127), `100.64.0.0/10` (100 + secondo ottetto 64–127), `::1`; hostname vuoto/`file://`/pubblico → DENY.
3. **Gate fetch autoritativo:** `tileFetchAllowed` nega EOX se host non allowlisted (prima di forceOffline/OPSEC).
4. **UI:** voce Layers → Satellitare solo se `eoxLayerAllowedOnCurrentHost()`; `sanitizeMapLayer` ripulisce persistenza EOX su host non ammesso.
5. **i18n** IT/EN/FR: `map.layerEoxS2Cloudless`, `tip.layerEoxS2Cloudless`.

### Docs

- `docs/OPERATING_MEMORY.md` §7 — WU-0008 8d-B PASS runtime.
- `docs/work-units/WU-0005-0009-roadmap.md` §8d-B — tabella implementazione; item 30 sequenza barrato.

### QA

- Endpoint EOX: HTTP 200 + JPEG + CORS (curl).
- `node --check` JS inline: OK.
- Review read-only allowlist (confini/range): PASS.
- Browser QA operatore: **non eseguita** in sessione — checklist manuale consigliata (localhost vs host pubblico, forced-offline, OPSEC strict, IndexedDB).

### Prossimo passo consigliato

- Browser QA operatore su localhost/tailnet IP.
- Backlog metodo / prossimo candidato WU da roadmap (Tier B proxy WU-0009).

## Checkpoint 2026-06-15 — Docs QA EOX browser PASS post-runtime (Finito)

### Contesto

Chiusura **`finito`** — micro-fix **docs-only** dopo runtime EOX già pushato (`2ca47b6`). Obiettivo: allineare stato vivo (OM §7 + roadmap §8d-B) con **Browser QA operatore PASS** eseguita dall’operatore.

### Cosa è stato fatto

1. **`docs/OPERATING_MEMORY.md` §7`** — bullet EOX: Browser QA operatore PASS + sintesi esiti.
2. **`docs/work-units/WU-0005-0009-roadmap.md` §8d-B** — stato, tabella Test, sottosezione QA con 7 bullet (localhost, tailnet `100.110.35.23`, forced-offline, OPSEC strict, offline bulk, `192.168.1.108` UI/fetch).

### Non toccato

- `coordinate_converter Claude.html`
- `docs/orchestrator/inbox/2026-06-15_1928_riepilogo_finito-sessione.md` (artefatto storico)
- `docs/orchestrator/latest.md` (aggiornato solo in riconciliazione post-`finito` step 4)

### Prossimo passo

- Backlog metodo o WU-0009 Tier B proxy.

## Checkpoint 2026-06-15 — Metodo Blocco 0 freeze control-plane (Finito)

### Contesto

Chiusura **`finito`** — **Blocco 0** workstream «Backlog metodo — Adozione metodo / handoff discipline»: freeze SHA remoto control-plane per fasi C–F successive.

### Cosa è stato fatto

1. **`git ls-remote`** → SHA `df046f68867cdffcd350592a2781b53ce21ca8c0` (`mrhz1973/control-plane` `main`).
2. **`docs/work-units/WU-0005-0009-roadmap.md`** § Backlog metodo: fonte frozen, Nota Blocco B (session-guard pragmatico), sottosezione Blocco 0, bullet metodo di adozione.

### Non toccato

- `coordinate_converter Claude.html`, `docs/OPERATING_MEMORY.md`, `.cursor/rules/**`, runtime GIS.

### Prossimo passo

- Review → **Blocco B** `session-and-repo-guard` (adattamento pragmatico, non copia letterale SHA frozen).

## Checkpoint 2026-06-16 — Metodo Blocco B session-and-repo-guard (Finito)

### Contesto

Chiusura **`finito`** — **Blocco B** workstream «Backlog metodo»: guardia minima pre-volo repo/sessione (adattamento pragmatico GIS).

### Cosa è stato fatto

1. **`.cursor/rules/30-output-workflow.mdc`** — sezione Session / repo guard (`git rev-parse`, branch, `git status --short`; STOP se anomalie; Cursor non decide autonomamente).
2. **`docs/OPERATING_MEMORY.md` §4** — bullet Session / repo guard.
3. **`docs/work-units/WU-0005-0009-roadmap.md`** — Blocco B implementato (pending review → chiuso con questo `finito`).

### Non toccato

- `coordinate_converter Claude.html`; remote-hash, QA evidence, legacy governance, LAST_CURSOR_REPORT; blocchi C–F.

### Prossimo passo

- Blocchi C–F metodo (forme da SHA frozen `df046f6…`) o WU-0009 Tier B.

## Checkpoint 2026-06-16 — Metodo Fase C remote-hash-pass-verification (Finito)

### Contesto

Chiusura **`finito`** — **Fase C** workstream «Backlog metodo»: PASS tecnico remoto post-push basato su output git verbatim e gerarchia `git ls-remote` > `origin/main` locale > RAW GitHub.

### Cosa è stato fatto

1. **`.cursor/rules/30-output-workflow.mdc`** — sezione Remote hash / PASS tecnico remoto.
2. **`docs/OPERATING_MEMORY.md` §4** — bullet Remote hash.
3. **`docs/work-units/WU-0005-0009-roadmap.md`** — Fase C implementata.

### Non toccato

- Monolite; LAST_CURSOR_REPORT; two-commit; Fase D/E/F; QA evidence operatore.

### Prossimo passo

- Fase D (QA evidence) o WU-0009 Tier B.

## Checkpoint 2026-06-16 — Metodo Fase D QA evidence / PASS operatore (Finito)

### Contesto

Chiusura **`finito`** — **Fase D** workstream «Backlog metodo»: regola PASS operatore / QA evidence distinta da PASS tecnico remoto (Fase C); attestazione esplicita nel flusso; default fail-closed; previene falsi negativi/positivi (pattern EOX).

### Cosa è stato fatto

1. **`.cursor/rules/30-output-workflow.mdc`** — sezione **QA evidence / PASS operatore** (dopo Remote hash).
2. **`docs/OPERATING_MEMORY.md` §4** — bullet QA evidence / PASS operatore.
3. **`docs/work-units/WU-0005-0009-roadmap.md`** — Stato + sottosezione Fase D.

### Non toccato

- Monolite; LAST_CURSOR_REPORT; two-commit; Fase E/F; procedura **`finito`**; runtime GIS.

### Prossimo passo

- Fase E (legacy checkpoint/session governance) o WU-0009 Tier B.

## Checkpoint 2026-06-16 — Roadmap WU-0005-0009 freschezza storica (Finito)

### Contesto

Chiusura **`finito`** — micro-fix documentale post-Fase F3: correzione incongruenze stale nella roadmap (WU-0008 ancora «candidato», **Prima WU consigliata** ancora su WU-0005).

### Cosa è stato fatto

1. **`docs/work-units/WU-0005-0009-roadmap.md`** — WU-0008 stato PASS end-to-end (8a–8d-B, EOX, browser QA); Piano espansione §8d allineato; matrice dipendenze; **# Prima WU consigliata** → WU-0007/0008 PASS, WU-0005 governance B0/B1 non chiusa, WU-0006 fix+UX PASS con backlog, prossimo **WU-0009A B0-B4**, alternativa **Mappe offline UX**.

### Non toccato

- `coordinate_converter Claude.html`, `README.md`, `docs/OPERATING_MEMORY.md`, orchestrator, `LAST_CURSOR_REPORT`, template, `.cursor/rules/**`, ordine operativo dettagliato (pos. 30 EOX).

### Nota OM §7

- Bullet §7 «Backlog metodo: candidato» resta indietro rispetto a OM §4 (F1–F3 PASS) e roadmap §Backlog metodo — **da sanare** in patch successiva o `aggio gis`.

### Prossimo passo

- **WU-0009A B0-B4** (proxy Planet-Clone) o **Mappe offline UX**; allineamento OM §7 backlog metodo.

## Checkpoint 2026-06-16 — OM §7 Backlog metodo F1–F3 (Finito)

### Contesto

Chiusura **`finito`** — micro-patch docs-only separata: allineamento stato vivo OM §7 al Backlog metodo già PASS in roadmap (F1–F3).

### Cosa è stato fatto

1. **`docs/OPERATING_MEMORY.md` §7** — bullet «Backlog metodo: candidato» → catena **PASS** fino a **Fase F3** (Blocco 0/B, Fasi C–E, F1/F2/F3); regole sintetiche `LAST_CURSOR_REPORT` (obbligo task reale GIS-only; esclusioni read-only/plan/review diff; evidenza rolling, non fonte primaria; cfr. §4).

### Non toccato

- `coordinate_converter Claude.html`, `README.md`, `docs/work-units/WU-0005-0009-roadmap.md`, `LAST_CURSOR_REPORT`, orchestrator (in commit finito), `.cursor/rules/**`.

### Prossimo passo

- **WU-0009A B0-B4** o **Mappe offline UX**.

## Checkpoint 2026-05-20 — WU-0009A layer gsat Google Satellite (Finito)

### Contesto

Chiusura **`finito`** — implementazione layer **`gsat`** nel monolite GIS (Planet-Clone proxy `/gsat/` già su backend, fuori scope commit). Piano approvato con correzione call-site hydrate SonarChart: **`ensureProxyConsent(layerId)`** (non `"sonarchart"` fisso).

### Cosa è stato fatto

1. **`coordinate_converter Claude.html`** (+74/−10):
   - **`TILE_LAYERS.gsat`**: `tailnet-proxy`, URL `/gsat/{z}/{x}/{y}.jpg` via proxy tailnet, attrib Google, `maxZoom:20`, offline-eligible.
   - **`MAP_BASE_LAYER_IDS`**: `"gsat"` dopo `"sat"`.
   - **Consenso OPSEC split**: `_gsatConsentGranted` / `ensureGsatConsent` indipendente da Navionics; `tileFetchAllowed` per provider; reset strict azzera entrambi.
   - **UI**: bottone gsat in picker Satellitare; i18n IT/EN/FR completi.

### QA

- `node --check` OK (2× script inline). Browser QA: **non eseguiti**.

### Prossimo passo

- Browser QA gsat; proseguire WU-0009A.


## Checkpoint 2026-05-20 — WU-0009A layer gsat Google Satellite (Finito)

### Contesto

Chiusura **`finito`** — implementazione layer **`gsat`** nel monolite GIS (Planet-Clone proxy `/gsat/` già su backend, fuori scope commit). Piano approvato con correzione call-site hydrate SonarChart: **`ensureProxyConsent(layerId)`** (non `"sonarchart"` fisso).

### Cosa è stato fatto

1. **`coordinate_converter Claude.html`** (+74/−10):
   - **`TILE_LAYERS.gsat`**: `tailnet-proxy`, URL `http://${getNavProxyHost()}:5000/gsat/{z}/{x}/{y}.jpg`, attrib Google, `maxZoom:20`, cacheable default (precache/offline OK).
   - **`MAP_BASE_LAYER_IDS`**: `"gsat"` dopo `"sat"`.
   - **`offlineTileNetworkKind`**: ramo `proxy` include `gsat`.
   - **Consenso OPSEC Opzione B**: `_gsatConsentPending`, `state._gsatConsentGranted`, `tileLayerProxyProvider` (gsat→google, nav/sonarchart→navionics), `ensureGsatConsent`, `ensureProxyConsent`; `tileFetchAllowed` split provider; `ensureNavProxyConsent` corpo invariato; reset strict azzera entrambi i consensi.
   - **Call-site**: 6× `ensureProxyConsent(layerId)`; 1× `ensureProxyConsent("sonarchart")` al toggle overlay SonarChart.
   - **UI**: bottone `gsat` in sezione Satellitare del picker basemap (tra `sat` e `eoxS2Cloudless`).
   - **i18n IT/EN/FR**: `map.layerGsat`, `tip.layerGsat`, `offcache.area.layerGsat`, `opsec.strict.gsatConfirm`, `opsec.strict.gsatWarn`.

### QA

- `git diff --check` OK; `node --check` su JS inline (2 blocchi) OK.
- Test browser: **non eseguiti** — checklist: gsat strict off/on, consensi indipendenti Google vs Navionics, forceOffline cache-only.

### Non toccato

- `proxy.py`, README, OM, roadmap, rules (nel commit principale oltre checkpoint/session).

### Prossimo passo

- Browser QA operatore su gsat; proseguire WU-0009A o smoke tailnet `/gsat/`.


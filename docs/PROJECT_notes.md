# GOI GIS Tool — note di progetto (living document)

**Percorso:** `docs/PROJECT_notes.md` — panoramica tecnica (moduli, stack, roadmap sintetica); resta accanto a `session-geolocalizzazione-e-mappa.md` e `checkpoint.md`.

Documento operativo per allineamento umano/LLM. **Aggiornare** quando cambiano file canonici, sezioni principali del monolite, o backlog documentato in `docs/`.

Fonti usate per questa stesura: `coordinate_converter Claude.html`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/checkpoint.md`, `.cursor/rules/*.mdc`, `repomix.config.json`. Nessun `TODO`/`FIXME` trovato nel file HTML (ricerca testuale su quei token).

---

## 1. Overview

| Voce | Valore reale nel repo |
|------|------------------------|
| **Nome / brand (pagina)** | Dal `<title>`: *GOI GIS Tool* (rename 2026-04-24, cleanup pre-GIS). Header e footer UI uniformati a "GOI GIS Tool". |
| **File principale (app canonica)** | `coordinate_converter Claude.html` — applicazione **single-file** (HTML + CSS + JS inline). |
| **Righe attuali** | **37011** righe (`wc -l` e `awk 'END{print NR}'` su `coordinate_converter Claude.html`, concordi in Pass 1.5 — 2026-05-01). Aggiornamento PASS 1 numerico 2026-05-01; valore precedente in questo documento: **16317** (stale). |
| **Dipendenze runtime** | **Nessun** `<script src="…">` esterno: un solo blocco `<script>` inline. In rete (solo con azione utente / contesto online): tile raster **Carto** (`*.basemaps.cartocdn.com`), geocoding **Nominatim** (default `nominatim.openstreetmap.org`; endpoint configurabile), link esterni mappa (Google Maps, OSM, ArcGIS Map Viewer / servizi Esri), e chiamate ausiliarie documentate in sessione (es. metadati immagine satellitare Esri). |
| **Persistenza** | `localStorage` **`coordconv_v2`** (stato app), **`coordconv_ui_v1`** (layout pannelli); legacy **`coordconv_v1`** non letta al boot. **IndexedDB** `CoordConvMapTiles` / store **`tiles`**: tile offline + record geocoding/dataset (chiavi `geo:*`). Dettaglio tabellare: §**Persistenza, IndexedDB e cap array** (Pass 2). |
| **Come aprirla** | Aprire il file `.html` nel browser (doppio click o *Open with*). Per **Geolocation API** serve contesto sicuro: **HTTPS** o **localhost** (`window.isSecureContext`); su `file://` o HTTP non sicuro la geo è disabilitata come da documentazione in `docs/session-geolocalizzazione-e-mappa.md`. Opzionale: server statico locale se preferisci non usare `file://`. |
| **Workspace** | `Cursor.code-workspace` presente in root. **Non** c’è `package.json` in root (il progetto non è un monorepo Node per l’app). |

**Nota dimensione file (`docs/roadmap.md` §4.8):** il monolite supera la **soft threshold ~22 000 righe** documentata in roadmap: ciò **richiede una valutazione** pianificata su scenari di distribuzione e tier di split; **non** implica split automatico né decisione Tier 1 in questo passaggio. Questo aggiornamento è solo **riallineamento numerico** della documentazione.

### Standard UI/UX (modali, tabelle, preset, map-first) — 2026-04-29

Vincoli operativi per **nuovi** modal, pannelli GIS, tabelle operative e strumenti map-first: tabelle con colonne ridimensionabili dove c’è testo/dati variabili, **preset** che precompilano (senza sostituire) input tecnici con i18n, gerarchia pulsanti (primary/danger/ghost), flusso **primario** mappa-centrato senza toccare OPSEC/offline/geo opt-in. **Notifiche interne** al pannello per errori, successi e stati temporanei (pick, modifica, conferme). **Import/Export** per dati operativi: comandi visibili nel pannello, **import locale/file-first**, **GeoJSON** come formato preferito per dati GIS interni ove coerente, distinzione export singolo / selezionati / totale, esiti in notifica in-pannello. Nelle **liste operative**, se l’oggetto ha proprietà editabili oltre al nome, prevedere azione esplicita **«Modifica»** (il rename inline da solo non basta). **Eliminazioni**: conferma in-pannello (danger + annulla), senza `confirm` nativo per il flusso standard. Oggetti **map-first**: spostamento geometrico solo con comando esplicito (es. pick del centro in modifica), annullabile. Dettaglio autoritativo: [`.cursor/rules/10-html-architecture.mdc`](../.cursor/rules/10-html-architecture.mdc) sezione **GIS & tools UI/UX standards** (incluso §6 liste / Modifica, §7 Import/Export); riferimento in [`.cursor/rules/00-project-core.mdc`](../.cursor/rules/00-project-core.mdc).

- **2026-04-30 (Import/Export):** per modali/pannelli con **collezioni** o dati esportabili, controlli **Import/Export** visibili nello stesso flusso; import **file-first** (nessuna rete implicita); **GeoJSON** come formato **preferito** per geometrie/dati GIS interni quando coerente; esiti tramite **notifiche in-pannello** (no `alert`/`confirm` per flussi ordinari). Vedi regole §7 in `10-html-architecture.mdc`.

---

## 2. Mappa moduli logici (range di riga — PASS 1, 2026-05-01)

Struttura fisica del monolite (validazione confini e comandi: sotto-sezione **Comandi usati per il calcolo dei range (Pass 1.5)**):

| Blocco | Righe | Contenuto |
|--------|--------|------------|
| `<head>` + CSS (`<style>…</style>`) | **1–6969** | Meta, token tema, layout GIS/classico, modali, stampa, tooltip, ecc. |
| Markup `<body>` (solo HTML prima di `<script>`) | **6970–8639** | Header, main, drawer, dialog (convert, waypoint, track, …), help, QR markup, input file nascosto `#globalFileInput`. |
| Tag di delimitazione script | **8640**, **37009** | Riga **8640**: `<script>`; riga **37009**: `</script>`. |
| JavaScript inline (corpo del tag) | **8641–37008** | `"use strict"` … `document.addEventListener("DOMContentLoaded", init);` |
| Chiusura pagina | **37010–37011** | `</body>`, `</html>`. |

Macro-regioni **`// #region JS`** / **`// #endregion JS`** (range inclusivi sulle righe dei commenti `#region`…`#endregion`; una sotto-regione è annidata — vedi riga COT):

| `// #region JS …` | Da | A (`// #endregion JS …`) | Contenuto sintetico |
|-------------------|-----|---------------------------|---------------------|
| `JS — I18N` | 8642 | 12377 | `SECTION 1`, dizionari, `t()`, `applyLanguage`. |
| `JS — CONSTANTS` | 12378 | 12419 | `SECTION 2`. |
| `JS — STATE AND STORAGE` | 12420 | 13528 | `SECTION 3`, blocco **LOCAL STORAGE** (13249–…), `loadStore`/`saveStore`. |
| `JS — VALIDATORS AND PARSERS` | 13529 | 18498 | `SECTION 4`–`15` (validator, parser, datum, Vincenty, export/import UI base, geocoding, auto-detect). |
| `JS — TILE MAP INDEXEDDB OFFLINE CACHE AND BBOX` | 18499 | 22281 | `SECTION 16` rendering + tile offline, bbox, named areas (porzione iniziale). |
| `JS — TRACK WAYPOINT GIS LAYERS AND TOOLS` | 22282 | 27942 | Track builder, waypoint, overlay mappa, misura on-map, range rings overlay, salvataggi correlati; include **`SECTION 18B`** (GIS Phase 1). |
| `JS — CLIPBOARD HISTORY FAVORITES BATCH` | 27943 | 28822 | `SECTION 17`–`19`. |
| `JS — MEASURE VALIDATION CONVERT AND PASTE` | 28823 | 29005 | `SECTION 20`–`22`. |
| `JS — UI BINDINGS AND GIS HUB` | 29006 | 35954 | `SECTION 23`, **`SECTION 19C`** (Range Rings UI), **`SECTION 23B`** (GIS hub), binding globale, modali GIS. |
| `JS — COT XML WAYPOINT INTEROP …` *(annidata nella regione UI)* | 35570 | 35855 | Export/import CoT XML waypoint, solo file. |
| `JS — INIT AND SELF CHECK` | 35955 | 36521 | `SECTION 24` INIT, `SECTION 25` self-check. |
| `JS — QR ENCODER AND MODAL` | 36522 | 37006 | `SECTION 26`–`27`, encoder QR + UI modale. |

Suddivisione per commenti **`/* … SECTION … */`** nel JavaScript (inizio = riga del commento; **fine stimata** = ultima riga prima del marker `SECTION` successivo o prima di `// #endregion`, salvo dove indicato):

| Marker nel file | Inizio | Fine stimata | Contenuto breve |
|-----------------|--------|----------------|-----------------|
| SECTION 1: I18N | 8648 | 12376 | Dizionari IT/EN/FR (ultima riga codice prima di `#endregion JS — I18N`). |
| SECTION 2: CONSTANTS | 12379 | 12418 | Costanti numeriche / stringhe (prima di `#endregion … CONSTANTS`). |
| SECTION 3: STATE | 12421 | 13248 | Oggetto `state`, helper stato (prima del blocco LOCAL STORAGE). |
| LOCAL STORAGE (offline persistence) | 13249 | 13527 | Chiavi `coordconv_v2`, `coordconv_ui_v1`, `loadStore`/`saveStore` (dentro regione STATE; poi `#endregion` a riga 13528). |
| SECTION 4: VALIDATORS | 13530 | 13552 | Validatori input. |
| SECTION 5–7 (guided / free / UTM free) | 13553 | 13779 | Parser guidati, free text, UTM libero. |
| SECTION 8: MGRS PARSER | 13780 | 13837 | MGRS. |
| SECTION 9–10: UTM forward / inverse | 13838 | 13982 | UTM. |
| SECTION 11 / 11b / 11c | 13983 | 14516 | MGRS forward/reverse, datum IT, datum extra. |
| SECTION 12 / 12b | 14517 | 14742 | Formatter, Plus Code (OLC). |
| SECTION 13: MAP LINKS | 14743 | 14762 | Link esterni mappa. |
| SECTION 14 / 14B (+ blob WMM dopo `vincentyDirect`, riga ~15135) | 14763 | 15983 | Vincenty, diretta, Haversine, **WMM-2025** nel flusso 14B. |
| SECTION 14C–14I | 15984 | 18001 | Export/import file, permalink, DnD, badge, auto-paste, help. |
| SECTION 14J / 14L | 18002 | 18452 | Misura diretta UI, geocoding Nominatim + offline. |
| SECTION 15: AUTO-DETECT | 18453 | 18497 | Auto-detect universale (ultima riga prima di `#endregion … VALIDATORS` / `#region … TILE`). |
| SECTION 16: RENDERING | 18500 | 24025 | Schede risultati, mini-mappa, locality, ecc.; nel mezzo tile/IDB/bbox (stessa regione macro TILE). |
| SECTION 18B: GIS DATA MODEL (Phase 1) | 24026 | 27943 | Store GeoJSON `gisTracks`/`gisPolygons`/`gisLayers`, helper CRUD (ordine file: dopo rendering esteso, prima clipboard). |
| SECTION 17 / 18 / 19 | 27944 | 28822 | Clipboard, cronologia, batch. |
| SECTION 20–22 | 28824 | 29005 | Misura form, live validation, `doConvert`. |
| SECTION 23: UI WIRING | 29007 | 29236 | Binding pulsanti, paste, batch UI, ecc. |
| SECTION 19C: RANGE RINGS | 29237 | 31658 | UI min range rings. |
| SECTION 23B: GIS HUB | 31659 | 35954 | Tab drawer, convert modal, tool grid, floating panels (include codice dopo `#endregion COT`; ultima riga logica ~35953, poi `#endregion JS — UI BINDINGS…` a 35954). |
| SECTION 24 / 25 | 35956 | 36520 | `init()`, self-check console. |
| SECTION 26 / 27 | 36523 | 37005 | Encoder QR + modale. |

*Nota PASS 1:* numerazione **SECTION** nel sorgente non è strettamente sequenziale (es. **18B** prima di **17–19** per posizione fisica). I confini **fine stimata** sono allineati ai marker successivi o ai `#endregion`; funzioni senza commento SECTION tra due marker possono far «toccare» due blocchi — per refactor usare `grep`/`rg` su `SECTION` e `// #region JS` sul file canonico.

### Comandi usati per il calcolo dei range (Pass 1.5)

Percorso file (esempi): `"coordinate_converter Claude.html"` dalla root del repo. Comandi eseguiti in verifica **2026-05-01** (Pass 1.5).

**1. Conteggio righe totali (sanity incrociato)**

| Controllo | Comando |
|-----------|---------|
| `wc -l` | `wc -l "coordinate_converter Claude.html"` |
| `awk` | `awk 'END{print NR}' "coordinate_converter Claude.html"` |

Esito atteso: stesso intero riportato in §1 (**37011**) e uguale a `wc` e `awk`.

**2. Tabella «Struttura fisica» (confini chiave)**

| Range documentato | Verifica inizio | Verifica fine |
|-------------------|-----------------|---------------|
| **1–6969** (`<head>` + CSS) | Inizio file riga **1** | `grep -n '^</head>$' "coordinate_converter Claude.html"` → **6969** |
| **6970–8639** (markup `<body>` prima di script) | `grep -n '^<body>$' "coordinate_converter Claude.html"` → **6970** | Riga immediatamente prima di `<script>`: `grep -n '^<script>$' "coordinate_converter Claude.html"` → **8640**, quindi markup body **6970–8639** |
| **8640** / **37009** (delimiter `<script>`…`</script>`) | `grep -n '^<script>$'` → **8640** | `grep -n '^</script>$'` → **37009** |
| **8641–37008** (corpo JS) | Implicito: riga dopo `<script>` fino a riga prima di `</script>` | — |
| **37010–37011** (`</body></html>`) | `grep -n '^</body>$'` → **37010** | `grep -n '^</html>$'` → **37011** |

**Spot-check Pass 1.5:** i tre confini **fine CSS/inizio body** (6969/6970), **inizio JS** (`<script>` riga 8640), **chiusura `</script>`** (riga 37009) risultano allineati al monolite.

**3. Tabella macro-regioni `// #region JS`**

Comando unico per tutte le coppie inizio/fine:

```bash
grep -n '^// #region JS\|^// #endregion JS' "coordinate_converter Claude.html"
```

Ogni riga della tabella macro corrisponde a una coppia `#region` / `#endregion` con etichetta uguale (eccezione: regione **COT** annidata dentro **UI BINDINGS**, righe **35570–35855**, tra `#region UI …` **29006** e `#endregion UI …` **35954**).

**4. Tabella marker `SECTION` / LOCAL STORAGE (fine approssimata)**

Per l’**inizio** di ogni blocco (riga del commento `/* … SECTION … */` o `LOCAL STORAGE`):

```bash
grep -n 'SECTION [0-9]' "coordinate_converter Claude.html"
grep -n 'LOCAL STORAGE (offline persistence)' "coordinate_converter Claude.html"
```

Per varianti di nome (`SECTION 11b`, `SECTION 14B`, `SECTION 18B`, `SECTION 19C`, `SECTION 23B`, ecc.) estendere con:

```bash
grep -n 'SECTION 1[1-9][a-zA-Z]*:\|SECTION [0-9][0-9][a-zA-Z]*:' "coordinate_converter Claude.html"
```

(le righe effettive sono nel sorgente; il pattern può richiedere aggiustamenti).

La colonna **Fine stimata** della tabella SECTION è derivata dalla **riga immediatamente precedente** al marker SECTION/`#endregion` successivo documentato in Pass 1, non da un comando dedicato — vedi nota in coda alla tabella SECTION.

---

## 3. Stack e librerie / algoritmi incorporati

| Componente | Dove / come appare nel codice |
|------------|-------------------------------|
| **Stack** | HTML5 + **JavaScript vanilla** (nessun framework; vincolo in `.cursor/rules/00-project-core.mdc`). Nessun build step. |
| **Vincenty (1975)** | `vincentyInverse`, `vincentyDirect` su ellissoide **WGS84**; fallback **Haversine** se l’iterazione Vincenty non converge. |
| **Area poligono** | `sphericalPolygonArea` — commento nel codice: formula **Bevis–Cambareri** su sfera raggio medio WGS84. |
| **WMM-2025** | Coefficienti `WMM2025_COF`, funzioni `WMM_*`, `wmmGetModel`, `wmmMagneticField` — blocco introdotto da commento *World Magnetic Model 2025*. |
| **SunCalc (subset)** | IIFE `SunCalc` con `getTimes`, `getMoonTimes`, `getMoonIllumination`; attribuzione *Vladimir Agafonkin, MIT* e riferimento repo `mourner/suncalc` nel commento sorgente. |
| **Plus Code** | `SECTION 12b` — *Open Location Code* nel nome sezione. |
| **QR Code** | `SECTION 26` — encoder *Model 2*, **ISO/IEC 18004**, Reed–Solomon, output SVG inline (commenti nel file). |
| **Geocoding** | `SECTION 14L` — coda/rate limit/retry/circuit breaker verso API stile Nominatim; dataset città offline + import JSON. |
| **Mini-mappa** | Tile web (URL Carto in codice) + cache **IndexedDB**; overlay copertura, bbox, misura on-map, griglia MGRS/UTM (tutto nel medesimo file). |

Riferimenti testuali UI (non necessariamente implementazione letterale dell’intero trattato): stringa i18n **astro** che cita *Meeus / suncalc*; **mag** che cita **WMM-2025** e *IUGG* nella stringa di hint (vedi dizionario `it` nel blocco i18n).

---

## Persistenza, IndexedDB e cap array

Audit meccanico **Pass 2** (2026-04-30) sul monolite `coordinate_converter Claude.html` — solo lettura (`rg` / `grep`). Il monolite **non** è stato modificato in questo passaggio. Dove un limite non emerge chiaramente dal codice è indicato **non rilevato con certezza**.

### A. Chiavi di persistenza

| Chiave / database / store | Tipo | Contenuto (sintesi) | Persistita | Reset totale locale la rimuove | Note operative |
|---------------------------|------|---------------------|------------|-------------------------------|----------------|
| **`coordconv_v2`** | `localStorage` (JSON) | Payload da `saveStore()`: `settings`, `history` (se `state.persist`), `favorites`, `namedAreas`, `track`, `mapWaypoints`, `savedTracks`, `gisTracks`, `gisPolygons`, `gisLayers`, `lastBatchRows`, `batchInputText`, `rangeRingSets` | Sì | Sì (`performAppFullLocalReset` → `clearStore` + verifica assenza chiavi) | Chiave principale stato applicativo |
| **`coordconv_ui_v1`** | `localStorage` (JSON) | Layout floating (`captureUiState` / `sanitizeUiState`): pannelli track, waypoint, convert, search, favorites, layers | Sì | Sì (stesso reset totale); **`resetGisUiLayoutPanels`** rimuove solo questa chiave | Nessun dato di conversione / waypoints |
| **`coordconv_v1`** | `localStorage` legacy | Formato pre-bump; **non** letto da `loadStore()` | Può essere ancora presente su profili vecchi | Sì (**solo** `performAppFullLocalReset`: `localStorage.removeItem("coordconv_v1")`) | Commento in-code: evita migrazione forma dati obsoleta |
| **`CoordConvMapTiles`** (versione DB **1**) | IndexedDB | Database unico usato dal codice tile/geo | Sì | Sì (`idbClearAllTilesOrThrow` / `idbClearAllTiles` svuotano lo store) | `indexedDB.open(..., 1)` |
| Store **`tiles`** (nel DB sopra) | Object store | Coppie chiave/valore: tile **`layerId:z/x/y`** (blob + content-type); **`geo:rev:lat,lon`** (payload reverse Nominatim); **`geo:dataset:cities`** (dataset città importato `{ data: [...] }`) | Sì | Sì (stesso `clear()` sullo store) | Geocoding forward: cache **in RAM** (`geocodeCache.fwd`), non questo store |
| Cache geocoding (`geocodeCache.fwd` / `.rev`) | RAM (`Map`) | Risultati `/search` e `/reverse` in sessione; `.rev` anche da IDB all’uso | No | n/a | `GEOCODE_CACHE_MAX` **200** (`_cacheSetLimited`) |
| **`sessionStorage`** | — | — | Non rilevato | — | Ricerca testuale senza occorrenze nel monolite |

### B. Array e store applicativi (`state`)

| Stato / array | Persistito o transitorio | Fonte canonica o additiva GIS | Cap / limite rilevato | Dove viene usato / note |
|---------------|--------------------------|-------------------------------|------------------------|-------------------------|
| **`state.mapWaypoints[]`** | Persistito | Canonico waypoints mappa | **200** (`saveStore` slice; `init` slice dopo sanitize) | Modal waypoint, export, `gisSyncLayerFeatureIds` |
| **`state.savedTracks[]`** | Persistito | Archivio tracce salvate (snapshot), separato da GIS native | **50** (`SAVED_TRACKS_CAP`); punti per traccia **500** | Track modal, overlay tratteggiate |
| **`state.gisTracks[]`** | Persistito | Additivo GIS (GeoJSON Feature linee) | **50** (`GIS_TRACK_CAP`, `gisSanitizeFeatureArray`) | Phase 1 |
| **`state.gisPolygons[]`** | Persistito | Additivo GIS (GeoJSON Feature poligoni) | **50** (`GIS_POLYGON_CAP`) | Phase 1 |
| **`state.gisLayers[]`** | Persistito | Additivo GIS (meta-layer + `featureIds`) | **20** (`GIS_LAYER_CAP`); fino a **500** id per layer in sanitize | `gisSanitizeLayerArray` preserva seed layers |
| **`state.favorites[]`** | Persistito | Lista utente | **200** su aggiunta UI (`pushFavoriteEntrySilent`, `addCurrentAsFavorite`); **`saveStore` non applica slice** sul vettore | Possibile JSON con >200 voci finché non si modifica la lista (load non tronca il count) |
| **`state.history[]`** | Persistito solo se `state.persist` | Cronologia conversioni | **10** (`pushHistory`; `init` `slice(0, 10)`) | UI cronologia |
| **`state.rangeRingSets[]`** | Persistito | Anelli concentrici | **20** set (`RANGE_RING_SETS_CAP`); **15** raggi/set dopo sanitize (`RANGE_RING_MAX_RADII`); raggio max **5e6 m** | `sanitizeRangeRingSets` / `ensureRangeRingState` |
| **`state.namedAreas[]`** | Persistito | Aree offline denominate | **30** (`sanitizeNamedAreas`; `saveStore` slice) | Precache / pannello offline |
| **`state.track`** | Persistito | Draft legacy polyline/polygon | Punti **500**; migrazione `init` verso `mapWaypoints` fino al cap 200 | Track builder classico |
| **`state.lastBatchRows`** / **`batchInputText`** | Persistito | Ultimo batch | Cap righe: **non rilevato con certezza** | Ripristino UI batch |
| **`state.gisSelection`** | Transitorio | Selezione GIS | Nessun cap dedicato oltre uso corrente | Non in `saveStore` |
| **`state.undoStack`** / **`redoStack`** | Transitorio | Undo GIS scaffolding | **100** (`GIS_ACTION_STACK_CAP`) | Non in `saveStore` |

**Altri limiti operativi collegati:** `MAX_PRECACHE_TILES` **150000**; import CoT XML **`COT_XML_MAX_BYTES`** **2097152**.

### C. Reset / wipe / sanitize

| Funzione / flusso | Cosa cancella o sanitizza | Cosa **non** è nel suo scope | Rischio operativo | Note |
|-------------------|---------------------------|------------------------------|-------------------|------|
| **`saveStore()`** | Scrive `coordconv_v2` con clamp (`ensureGisState`, `ensureRangeRingState`, slice su molti campi) | IndexedDB; chiave legacy `coordconv_v1` | Quota LS → catch vuoto, salvataggio ignorato | `history` serializzato `[]` se `!persist` |
| **`loadStore()`** | Lettura + `JSON.parse` da `coordconv_v2` | Non sanitizza (delegato a `init`) | JSON invalido → `null` | Non legge `coordconv_v1` |
| **`init()` (ramo `stored`)** | Sanitize: `sanitizeNamedAreas`, waypoint `meta` whitelist, `ensureSavedTracksState`, `ensureGisState`, `sanitizeRangeRingSets`, ecc. | — | — | Dopo assegnazioni GIS → `ensureGisState()` |
| **`clearStore()`** | Rimuove `coordconv_v2` e `coordconv_ui_v1` | IndexedDB | Se usato da solo, tile/geo restano in IDB | — |
| **`performAppFullLocalReset()`** | `idbClearAllTilesOrThrow`; `clearStore()`; `coordconv_v1` remove; `location.reload()` | — | Timeout IDB 12s → errore UI, no reload | Conferma parola **`CANCELLA`** |
| **`performOfflineGlobalReset()`** | `idbClearAllTiles()` (tile **e** record `geo:*`); `namedAreas` e stato UI offline; **`saveStore()`** | Non wipe LS globale (preferiti, GIS, ecc. restano salvo altri campi) | Perde cache reverse geo e dataset città in IDB | Distinto dal reset totale app |
| **`resetGisUiLayoutPanels()`** | Solo `coordconv_ui_v1` + reset layout sessione | `coordconv_v2` | `window.confirm` | Solo layout |

### Incertezza documentata (Pass 2)

- **`lastBatchRows`:** costante numerica massima righe — **non rilevato con certezza**.
- **Preferiti:** limite **200** sul percorso di aggiunta; assenza di slice in `saveStore` / load sul solo conteggio — vedi tabella B.

---

## OPSEC strict — definizione operativa (Pass 3)

Consolidamento documentale **solo testo** (monolite non modificato in questo passaggio).

### Principio operativo (da preservare nei progetti futuri)

- Con **OPSEC strict** attivo, il geocoding **online** (forward/reverse verso endpoint stile Nominatim) non deve essere eseguito; l’utente non deve ricevere fetch esterne «di servizio» senza azione consapevole.
- Non introdurre **chiamate di rete silenziose**: ogni contatto esterno deve essere legato a una scelta UI esplicita o a un flusso offline-first coerente con OPSEC.
- **Tile basemap:** distinguere (a) tile del layer basemap **selezionato consapevolmente** dall’utente, (b) tile già in **IndexedDB**, (c) fetch verso layer **non** richiesti o impliciti. Lettura **file locali** e **IndexedDB** non sono fetch HTTP esterne nel senso OPSEC di questo documento.

### Stato implementativo attuale (verifica codice, Pass 3)

- Il gate principale oggi è su **geocoding**: `geocodingAllowed()` restituisce `false` se `state.opsecStrict` è vero (blocco forward/reverse Nominatim e UI geocoding disabilitata visivamente).
- Nel monolite compare anche il commento di stato su `opsecStrict` che parla di disabilitare «tutte» le chiamate esterne — **non** tutto quel perimetro è cablato allo stesso modo del geocoding (es. caricamento tile online del basemap attivo non è filtrato solo da `opsecStrict` nel tratto ispezionato per Pass 3).

### Principio vs implementazione

- **Implementazione attuale:** enforcement primario sul **geocoding online**.
- **Principio da raffinare in futuri interventi** (senza Pass 3 nel codice): estendere coerenza OPSEC ad altri fetch solo dove richiesto da decisione esplicita, evitando sempre reti silenziose.

---

## Valutazione roadmap §4.8 — dimensione monolite (Pass 3)

Testo **consolidato** qui; autorità normativa resta in **`docs/roadmap.md`** §4.8 e §3 (questo blocco non modifica la roadmap).

| Voce | Valore / nota |
|------|----------------|
| **Righe monolite attuali** | **37011** (allineamento Pass 1 / 1.5) |
| **Soglia roadmap §4.8** | ~**22 000** righe → **valutazione**, non split automatico |
| **Scenari attuali** | **(a)** air-gapped / classified; **(b)** condivisione informale peer-to-peer (file singolo) |
| **Tier 2** (file `.js` separati via `<script src>`) | Escluso senza **decisione strategica** — rompe lo scenario **(b)** e indebolisce **(a)** (audit artefatto singolo) |
| **Tier 1** (più `<script>` nello **stesso** `.html`) | Compatibile con **(a)+(b)**; **non implementato** in Pass 3 |

**Criterio operativo proposto** (per pianificazione futura, non policy roadmap):

- Monolite **≤ 30 000** righe → monitoraggio.
- **30 000 < righe ≤ 40 000** → valutare / pianificare **Tier 1** per blocchi **vendored self-contained**.
- Monolite **> 40 000** righe → **stop feature work** significativo fino a rivalutazione dimensione / split.

**Conclusione per stato attuale (37 011 righe):** serve **piano dedicato** per valutare **Tier 1 vendored split**. Candidati naturali da analizzare in quel piano (non decisione Pass 3): blob **WMM-2025**, subset **SunCalc**, encoder **QR** (`SECTION 26`), **Plus Code / OLC** (`SECTION 12b`), o altri blocchi chiaramente isolabili.

---

## 4. Stato attuale delle feature principali

Sintesi allineata a `.cursor/rules/20-domain-knowledge.mdc`, `99-known-state.mdc`, e alla cronaca in `docs/session-geolocalizzazione-e-mappa.md` (ultimi checkpoint **2026-04-24 — GIS-first layout pivot**):

Le voci sotto descrivono ciò che è **attivo nel monolite corrente**, salvo dove è esplicitamente marcato **REMOVED** o rimando alla cronaca in §9.

- **Layout GIS-first (default):** `body.gis-mode` attivo al boot; topbar (`#appTopbar`) con tab bar (Traccia, Waypoint, Misura, Favoriti, Geocoding, Cronologia, Mappa/Offline) + CTA **Converti** (apre `<dialog id="convertModal">`) + kebab **Altri strumenti** (`<dialog id="toolsModal">` con Batch/Note/Sessione/Astro/Mag). Mappa full-viewport in `#gisMapMount`. Dettaglio meccanica reparenting / CSS override / invarianti in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-24*.

- **Conversioni / formati:** DD, DDM, DMS, UTM, MGRS, Plus Codes; datum italiani (Gauss-Boaga / ROMA40, ED50) e **datum aggiuntivi** (NAD27, NAD83, OSGB36, CH1903, SK42); auto-detect esteso (es. BNG, SK42 Gauss–Krüger) come da sessione.
- **Input:** paste universale, schede manuali, drag&drop GPX/KML/GeoJSON, batch.
- **Output / import-export:** GPX, KML, GeoJSON, CSV (track); toggle export per metadati datum extra ove previsto. `creator` = "GOI GIS Tool" in tutti i formati.
- **Geocoding:** forward/reverse Nominatim quando consentito; **`state.opsecStrict`** blocca il geocoding online (dettaglio operativo: sezione **OPSEC strict — definizione operativa** sopra); fallback offline, rate limit e circuit breaker — cronaca in sessione.
- **Mappa:** centro fallback **La Spezia**; niente GPS silenzioso all’avvio; geolocation **solo single-shot** (`btnMyLocation` → `getCurrentPosition`). **`REMOVED 2026-04-24`:** tracking continuo via `watchPosition` (Live Tracking). Tile offline da IDB; overlay copertura; bbox e named areas con zoom range; pannello offline dockabile/draggable in half/full.
- **Strumenti (attivi):** drawer navigazione (`Ctrl+K` documentato in sessione), measure (Vincenty + poligono/area), astro (SunCalc), magnetico (WMM), track builder, waypoint manager (tab-as-modal), favoriti, sessione import/export, Range Rings (GIS), layout classico nascosto ma ripristinabile via drawer/modal (non è una «home pre-GIS» separata come app legacy).
- **`REMOVED 2026-04-24` / storico — non nel monolite corrente:** **Radius/LOS** (`sec-range`, vecchio tool «range» non confondere con **Range Rings** attuali); **DTG NATO** (tab, card, parser, export collegati); **Live Tracking** (`watchPosition`, pipeline dedicata). Dettaglio implementativo e piano: §9 → voce cleanup pre-phase 2026-04-24.
- **i18n:** IT / EN / FR con `data-i18n` e `data-i18n-html` per help ricco.
- **Diagnostica:** blocco self-check in `SECTION 25` (assert su range, SunCalc, ecc.).

---

## 5. Roadmap / TODO noti

Da **`docs/session-geolocalizzazione-e-mappa.md`** (elenchi con checkbox):

**Geolocation (sezione “Prossimi passi”)**

- Permissions API opzionale per stato permesso.
- Tooltip OPSEC su geolocalizzazione (concetto già menzionato nel doc).
- Test manuale iOS Safari / Chrome Android.
- Documentazione README/PWA + server locale (mencionato come TODO nel doc).

**Backlog generale (sezione “Prossimi passi rimasti in backlog”)**

- Manifest pack tile in `saveStore`.
- Zoom clamp automatico offline al range pack.
- Tile Pack Inspector in pannello offline.
- Heatmap IDB aggregata (scan asincrono).
- Focus mode opzionale (nascondere sezioni tool in home).
- Test ciclo completo mobile (GPS + pick + track + export + offline).

**Backlog UI/UX (registrato Pass 3 — non implementato, nessuna modifica monolite)**

- Uniformare in futuro i **pannelli/modal GIS floating** al comportamento **Range Rings**: consentire spostamento **parziale** oltre il bordo mappa/viewport con **porzione minima sempre recuperabile**. Riferimento tecnico nel monolite: `gisPanelClampRectPartialVisible` e opzione `partialMinVisible` (es. **72** px in uso per Range Rings). Non è parte dello scope Pass 3.

Da **`docs/checkpoint.md`**

- Suggerimento operativo: aggiornare `checkpoint.md` a fine sessione o append in `session-geolocalizzazione-e-mappa.md` per checkpoint lunghi; trigger formale **«Checkpoint md»** in chat aggiorna **entrambi** i file (come da `00-project-core.mdc`).
- **2026-04-28 — Convenzione backlog:** «mettilo nel backlog» = registrare in doc di progetto quando richiesto; **non** = issue GitHub, commit/push automatici, né modifica `roadmap`/`rules` senza approvazione esplicita. Sintesi in `docs/PROJECT_notes.md` §*Backlog strategico*; dettaglio in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-28 — Backlog strategico*.

### Backlog strategico emerso / direzioni future (2026-04-28)

Sintesi **non esaustiva** (il dettaglio è nella sessione lunga). Tutto quanto segue è **idea/backlog**, non feature già implementate salvo dove si dice esplicitamente «stato validato UI».

| Area | Contenuto registrato |
|------|----------------------|
| **Reset totale dati locali** | **Implementato (2026-04-28):** comando in **Impostazioni** (zona danger) + dialog **`#appFullResetDialog`**, conferma digitando **`CANCELLA`**, **`#btnClearStore`** in Guida allineato allo stesso dialog, **`performAppFullLocalReset()`**; rimozione **`coordconv_v2`**, **`coordconv_ui_v1`**, legacy **`coordconv_v1`**; IndexedDB **`CoordConvMapTiles`** / store **`tiles`**; errori IDB/localStorage senza reload silenzioso; nessun **`saveStore()`** dopo il wipe; **`location.reload()`** a reset riuscito; **`performOfflineGlobalReset()`** e *Svuota tutta la cache tile* **non** modificati da questa feature. Test utente: **positivo** («funziona tutto»). |
| **Prossimo blocco consigliato** | **CoT XML** import/export **file-only**, senza rete; poi **Mission Package** ZIP + manifest. |
| **Tactical on-map** | Range rings/fans, lasso, R&B persistente, geofence, routes+ETA, bloodhound, selezione poligonale tile offline — con vincoli OPSEC / niente live GPS senza decisione. |
| **Cartografia / geo-analisi** | GroundOverlay, GRG, DEM/HGT, profilo quota, viewshed 2D, WMS/WMTS opt-in; feasibility per MBTiles, GeoPackage, GeoTIFF, worker; **3D** strategico non attivo. |
| **Report** | 9-line CASEVAC/CAS, SALUTE, SALT, drop point, ecc. |
| **Simbologia** | Affiliation friend/hostile/neutral/unknown; subset 2525/APP-6; valutazione `milsymbol.js` solo feasibility. |
| **Sicurezza locale** | Web Crypto opzionale, modalità «mil», encryption-at-rest come feasibility. |
| **Core / Field / Net** | **Solo proposta strategica** (Core = monolite offline-first + CoT file + tool + report + DEM locale; Field = sensori/PWA/serial; Net = bridge/live) — **non** decisione di roadmap; **Field/Net** non entrano nel Core senza approvazione. |

**Modifiche a `docs/roadmap.md` o `.cursor/rules/*.mdc`:** solo dopo **proposta esplicita** e **ok utente** (in questa sessione docs sono state aggiunte solo *proposte future* in coda al checkpoint sessione).

Da **sessione — limiti noti** (non sono TODO nel codice ma vincoli noti)

- `file://` / HTTP non sicuro vs Geolocation; note sessione su `watchPosition` / batteria sono **contesto storico generico** — nel monolite corrente il **live tracking** via `watchPosition` è **`REMOVED 2026-04-24`**; resta `getCurrentPosition` single-shot; `navigator.permissions` non implementato; heading/speed spesso nulli a fermo.

---

## 6. Comandi utili

**Dump Repomix per analisi LLM esterna** (come richiesto):

```bash
cd /Users/martinotuso/Documents/Ai/Cursor && npx repomix
```

Configurazione attuale (`repomix.config.json`): output **`repomix-output.xml`**, stile **xml**, include `*.html`, `*.md`, `docs/**`, `.cursor/rules/**`; esclude tra l’altro `repomix-output.xml` ricorsivo e `*.code-workspace`.

---

## 7. Riferimenti “dottrinali” / di dominio (dal materiale del repo)

Concetti e norme ricorrenti in **rules** + **docs** + stringhe/tecnologie citate nel codice:

- **WGS84** come datum di lavoro per l’output principale; ellissoide usato in Vincenty e costanti nel sorgente.
- **Sistemi di riferimento / griglie:** UTM, **MGRS** (derivazione da UTM in testo di help), **Plus Codes (Open Location Code)**.
- **Datum nazionali / storici:** ROMA40, ED50, Gauss-Boaga; **datum extra** NAD27/NAD83/OSGB36/CH1903/SK42 (rules + sessione).
- **DTG NATO:** *riferimento dottrinale / storico nel materiale del repo e sessione* — **`REMOVED 2026-04-24`** dal monolite (nessun parser/UI DTG nell’app corrente). Utile come contesto NATO; non è feature attiva. Traccia in `20-domain-knowledge.mdc` / sessione se ancora presente come testo di dominio.
- **OPSEC / privacy:** nessuna chiamata di rete silenziosa; **`state.opsecStrict`** blocca il **geocoding online** (implementazione attuale); principio più ampio e distinzione tile → sezione **OPSEC strict — definizione operativa** (Pass 3). Disclaimer Nominatim; paste non-coordinate con `confirm()` prima della ricerca online.
- **Modello magnetico:** **WMM-2025** (coefficienti e finestra temporale nel blob `WMM2025_COF` / hint IUGG in i18n).
- **Astronomia:** SunCalc (subset) + riferimento testuale a **Meeus** nell’hint astro.
- **Geodesia:** **Vincenty** diretto/inverso; commento normativo ISO per **QR** in `SECTION 26`.
- **Web mapping:** uso di tile **Carto Voyager**; layer satellitare con metadati **Esri** (checkpoint 2026-04-23 in sessione).
- **Geocoding:** **OpenStreetMap Nominatim** (policy uso, rate limit, endpoint custom).


## 8. COSE DA FARE

_(nessun item attualmente aperto su waypoint — vedi §9 "COSE FATTE")_

## 9. COSE FATTE (ultime)

- **Reset totale dati locali (2026-04-28).** Implementato nel monolite: Impostazioni (zona danger) + dialog `#appFullResetDialog` con conferma **`CANCELLA`**, allineamento `#btnClearStore` (Guida), `performAppFullLocalReset()`, wipe chiavi `coordconv_v2` / `coordconv_ui_v1` / `coordconv_v1`, svuotamento store tile IndexedDB `CoordConvMapTiles`/`tiles`, gestione errori senza reload silenzioso, nessun `saveStore()` post-wipe, `location.reload()` a successo; distinto da *Svuota tutta la cache tile*. Test browser utente: positivo. Cronaca: `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-28 — Reset totale dati locali implementato*.

- **GIS Tool cleanup pre-phase (2026-04-24).** Pulizia di superficie prima dell'inizio del GIS progressive plan. Rimosse feature: **DTG NATO** completo (tab `dtg`, `dtgCard`, `formatDTG/parseDTG/DTG_TZ/DTG_MONTHS`, shortcut `Alt+T/Alt+Shift+T`, callsite in history/favorites/permalink/GPX-KML-GeoJSON-CSV export, tutte le chiavi i18n IT/EN/FR `dtg.*`, `sec.dtg`, `tabs.dtg`, `tools.dtg`, `help.guide.dtg.*`, `help.kbd.dtg*`); **Live Tracking** (`btnGeoLive`, CSS `.geo-nav-btn#btnGeoLive.is-live`, `state.geoWatchId`, tutta la pipeline `watchPosition`, i18n correlate — preserva `btnMyLocation` single-shot + OPSEC); **Radius/LOS tool** (`<details id="sec-range">`, tile toolsModal, `state.rangeOverlay`, `GIS_TOOL_SECTIONS.range`, helper `buildRangePolygon`, i18n `sec.range`/`range.*`/`tools.range`/`tip.range`). **Rename globale** `Convertitore Coordinate` / `Coordinate Converter` → **GOI GIS Tool** (`<title>`, `app.title`, `footer.appName` IT/EN/FR, GPX `creator`, KML `<name>`, GeoJSON `metadata.creator`, waypoint export). **LS bump** `coordconv_v1` → `coordconv_v2` con commento in-code; la chiave v1 resta ma non è più letta (stato fresh al primo boot post-upgrade). Piano: `.cursor/plans/gis_tool_cleanup_pre-phase_0ce7df27.plan.md`.

- **WaypointModal manager split (2026-04-24).** Nuova `<details id="sec-waypoints">` + `<dialog id="waypointModal">` come tab-as-modal (`GIS_TABS_AS_MODAL = new Set(["waypoints"])`), `GIS_TAB_SECTIONS.waypoints → "sec-waypoints"`, manager completo (list + editor inline con `autoDetect` + import/export GeoJSON dedicato, cap 200, sanitize load esteso a `meta.icon/color/notes`). Riuso totale di `autoDetect` / `validateLatLon` / `waypointAdd` / `gisMoveSectionTo` / `spatialBuildFeatureCollectionFromAppState`. Dettagli piano: `.cursor/plans/waypointmodal_manager_split_4a8b4ca8.plan.md`.

---

*Ultimo allineamento contenuti: 2026-05-01 — **PASS 3** feature storiche/rimosse (marcature §4 e §7), **OPSEC strict** operativo, valutazione **roadmap §4.8** e backlog UI floating-panels; monolite non modificato; `docs/roadmap.md` non modificata. Precedenti: PASS 2 (persistenza/cap), PASS 1 / 1.5 (**37011** righe). Cronaca estesa: `docs/session-geolocalizzazione-e-mappa.md`. Backlog strategico: stesso file → *Checkpoint 2026-04-28 — Backlog strategico*. Soglia soft dimensione file (~22 000 righe, solo valutazione): sempre autoritativa in `docs/roadmap.md` §4.8.*

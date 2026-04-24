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
| **Righe attuali** | **16317** righe (`wc -l` su questo file). |
| **Dipendenze runtime** | **Nessun** `<script src="…">` esterno: un solo blocco `<script>` inline. In rete (solo con azione utente / contesto online): tile raster **Carto** (`*.basemaps.cartocdn.com`), geocoding **Nominatim** (default `nominatim.openstreetmap.org`; endpoint configurabile), link esterni mappa (Google Maps, OSM, ArcGIS Map Viewer / servizi Esri), e chiamate ausiliarie documentate in sessione (es. metadati immagine satellitare Esri). |
| **Persistenza** | `localStorage` chiave **`coordconv_v2`** (bump 2026-04-24, cleanup pre-GIS; la chiave `coordconv_v1` resta in place ma non è più letta); **IndexedDB** per tile pack offline e cache geocoding. |
| **Come aprirla** | Aprire il file `.html` nel browser (doppio click o *Open with*). Per **Geolocation API** serve contesto sicuro: **HTTPS** o **localhost** (`window.isSecureContext`); su `file://` o HTTP non sicuro la geo è disabilitata come da documentazione in `docs/session-geolocalizzazione-e-mappa.md`. Opzionale: server statico locale se preferisci non usare `file://`. |
| **Workspace** | `Cursor.code-workspace` presente in root. **Non** c’è `package.json` in root (il progetto non è un monorepo Node per l’app). |

---

## 2. Mappa moduli logici (range di riga approssimativi)

Struttura fisica del monolite:

| Blocco | Righe (circa) | Contenuto |
|--------|-----------------|------------|
| `<head>` + CSS | **1–2793** | Variabili tema chiaro/scuro, layout, componenti UI (header, mappa, risultati, drawer, modali, stampa, ecc.). |
| Markup `<body>` | **2795–3776** | Header, `<main>` (input, schede Lat/Lon · UTM · MGRS, geocoding, risultati, mappa, `<details>` strumenti), drawer strumenti, help, QR, backdrop. |
| JavaScript | **3777–16315** | Logica applicativa; chiusura `</script>` a riga 16315 ca. |

Suddivisione **JavaScript** secondo i commenti `SECTION` nel file (anchor reali):

| Sezione (nome come nel file) | Da riga | A riga (indicativa) |
|------------------------------|---------|---------------------|
| SECTION 1: I18N | ~3785 | ~5621 |
| SECTION 2: CONSTANTS | ~5622 | ~5662 |
| SECTION 3: STATE | ~5663 | ~5747 |
| Local storage (persistenza) | ~5748 | ~5822 |
| SECTION 4: VALIDATORS | ~5823 | ~5845 |
| SECTION 5–7: parser guidati / free text / UTM free | ~5846 | ~6072 |
| SECTION 8: MGRS PARSER | ~6073 | ~6130 |
| SECTION 9–10: UTM forward / inverse | ~6131 | ~6275 |
| SECTION 11 / 11b / 11c: MGRS + datum italiani + datum extra | ~6276 | ~6809 |
| SECTION 12–12b: FORMATTERS + Plus Code (OLC) | ~6810 | ~7035 |
| SECTION 13: MAP LINKS | ~7036 | ~7052 |
| SECTION 14–14B: Vincenty inverse/direct (+ haversine fallback, `routeDistance`, `sphericalPolygonArea`) | ~7053 | ~7197 |
| WMM-2025 + SunCalc embedded (subito dopo `vincentyDirect`) | ~7198 | ~7562 |
| Utility geodetiche / range polygon / misura mappa (funzioni collegate) | ~7563 | ~7975 |
| SECTION 14C–14I: export/import, permalink, DnD, badge, auto-paste, help | ~7976 | ~8622 |
| SECTION 14J–14L: misura UI, DTG, geocoding Nominatim + offline cities | ~8623 | ~9230 |
| SECTION 15–16: auto-detect + rendering | ~9231 | ~11083 |
| Tile IndexedDB, bbox, named areas, track, tools drawer | ~11084 | ~13884 |
| SECTION 17–24: clipboard, history, favorites, batch, measure, live validation, convert, UI wiring | ~13885 | ~15409 |
| SECTION 25: INIT (+ self-check) | ~15410 | ~15829 |
| SECTION 26–27: QR encoder (ISO/IEC 18004) + UI modale QR | ~15830 | ~16314 |

*Nota:* i confini tra “utility” e sezione successiva possono sovrapporsi di poche righe; usare `grep` su `SECTION` nel file per agganci precisi durante refactor.

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

## 4. Stato attuale delle feature principali

Sintesi allineata a `.cursor/rules/20-domain-knowledge.mdc`, `99-known-state.mdc`, e alla cronaca in `docs/session-geolocalizzazione-e-mappa.md` (ultimi checkpoint **2026-04-24 — GIS-first layout pivot**):

- **Layout GIS-first (default):** `body.gis-mode` attivo al boot; topbar (`#appTopbar`) con tab bar (Traccia, Waypoint, Misura, Favoriti, Geocoding, Cronologia, Mappa/Offline) + CTA **Converti** (apre `<dialog id="convertModal">`) + kebab **Altri strumenti** (`<dialog id="toolsModal">` con Batch/Note/Sessione/Astro/Mag). Mappa full-viewport in `#gisMapMount`. Dettaglio meccanica reparenting / CSS override / invarianti in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-24*.

- **Conversioni / formati:** DD, DDM, DMS, UTM, MGRS, Plus Codes; datum italiani (Gauss-Boaga / ROMA40, ED50) e **datum aggiuntivi** (NAD27, NAD83, OSGB36, CH1903, SK42); auto-detect esteso (es. BNG, SK42 Gauss–Krüger) come da sessione.
- **Input:** paste universale, schede manuali, drag&drop GPX/KML/GeoJSON, batch.
- **Output / import-export:** GPX, KML, GeoJSON, CSV (track); toggle export per metadati datum extra ove previsto. `creator` = "GOI GIS Tool" in tutti i formati.
- **Geocoding:** forward/reverse Nominatim, modalità **OPSEC strict**, fallback offline, rate limit e circuit breaker — dettaglio in sessione.
- **Mappa:** centro fallback **La Spezia**; niente GPS silenzioso all’avvio; geolocation **solo single-shot** (`btnMyLocation` → `getCurrentPosition`; il live tracking via `watchPosition` è stato rimosso nel cleanup pre-GIS 2026-04-24); tile offline da IDB; overlay copertura; bbox e named areas con zoom range; pannello offline dockabile/draggable in half/full.
- **Strumenti:** drawer navigazione (`Ctrl+K` documentato in sessione), measure (Vincenty + poligono/area), astro (SunCalc), magnetico (WMM), track builder, waypoint manager (tab-as-modal), favoriti, sessione import/export. **Rimossi** nel cleanup pre-GIS 2026-04-24: Radius/LOS tool (`sec-range`), DTG NATO (tab + card + parser), Live Tracking.
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

Da **`docs/checkpoint.md`**

- Suggerimento operativo: aggiornare `checkpoint.md` a fine sessione o append in `session-geolocalizzazione-e-mappa.md` per checkpoint lunghi; trigger formale **«Checkpoint md»** in chat aggiorna **entrambi** i file (come da `00-project-core.mdc`).

Da **sessione — limiti noti** (non sono TODO nel codice ma vincoli noti)

- `file://` / HTTP non sicuro vs Geolocation; `watchPosition` + `maximumAge: 0` e impatto batteria; `navigator.permissions` non implementato; heading/speed spesso nulli a fermo.

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
- **DTG NATO:** gruppo data-ora `DDHHMMZMMMYY`, lettere fuso (tabella `DTG_TZ`), esclusione **`J`**, memorizzazione Zulu in cronologia/export — vedi `20-domain-knowledge.mdc` e sezione DTG in sessione.
- **OPSEC / privacy:** nessuna chiamata di rete silenziosa; `state.opsecStrict` blocca fetch esterni; disclaimer Nominatim; paste non-coordinate con `confirm()` prima della ricerca online.
- **Modello magnetico:** **WMM-2025** (coefficienti e finestra temporale nel blob `WMM2025_COF` / hint IUGG in i18n).
- **Astronomia:** SunCalc (subset) + riferimento testuale a **Meeus** nell’hint astro.
- **Geodesia:** **Vincenty** diretto/inverso; commento normativo ISO per **QR** in `SECTION 26`.
- **Web mapping:** uso di tile **Carto Voyager**; layer satellitare con metadati **Esri** (checkpoint 2026-04-23 in sessione).
- **Geocoding:** **OpenStreetMap Nominatim** (policy uso, rate limit, endpoint custom).


## 8. COSE DA FARE

_(nessun item attualmente aperto su waypoint — vedi §9 "COSE FATTE")_

## 9. COSE FATTE (ultime)

- **GIS Tool cleanup pre-phase (2026-04-24).** Pulizia di superficie prima dell'inizio del GIS progressive plan. Rimosse feature: **DTG NATO** completo (tab `dtg`, `dtgCard`, `formatDTG/parseDTG/DTG_TZ/DTG_MONTHS`, shortcut `Alt+T/Alt+Shift+T`, callsite in history/favorites/permalink/GPX-KML-GeoJSON-CSV export, tutte le chiavi i18n IT/EN/FR `dtg.*`, `sec.dtg`, `tabs.dtg`, `tools.dtg`, `help.guide.dtg.*`, `help.kbd.dtg*`); **Live Tracking** (`btnGeoLive`, CSS `.geo-nav-btn#btnGeoLive.is-live`, `state.geoWatchId`, tutta la pipeline `watchPosition`, i18n correlate — preserva `btnMyLocation` single-shot + OPSEC); **Radius/LOS tool** (`<details id="sec-range">`, tile toolsModal, `state.rangeOverlay`, `GIS_TOOL_SECTIONS.range`, helper `buildRangePolygon`, i18n `sec.range`/`range.*`/`tools.range`/`tip.range`). **Rename globale** `Convertitore Coordinate` / `Coordinate Converter` → **GOI GIS Tool** (`<title>`, `app.title`, `footer.appName` IT/EN/FR, GPX `creator`, KML `<name>`, GeoJSON `metadata.creator`, waypoint export). **LS bump** `coordconv_v1` → `coordconv_v2` con commento in-code; la chiave v1 resta ma non è più letta (stato fresh al primo boot post-upgrade). Piano: `.cursor/plans/gis_tool_cleanup_pre-phase_0ce7df27.plan.md`.

- **WaypointModal manager split (2026-04-24).** Nuova `<details id="sec-waypoints">` + `<dialog id="waypointModal">` come tab-as-modal (`GIS_TABS_AS_MODAL = new Set(["waypoints"])`), `GIS_TAB_SECTIONS.waypoints → "sec-waypoints"`, manager completo (list + editor inline con `autoDetect` + import/export GeoJSON dedicato, cap 200, sanitize load esteso a `meta.icon/color/notes`). Riuso totale di `autoDetect` / `validateLatLon` / `waypointAdd` / `gisMoveSectionTo` / `spatialBuildFeatureCollectionFromAppState`. Dettagli piano: `.cursor/plans/waypointmodal_manager_split_4a8b4ca8.plan.md`.

---

*Ultimo allineamento contenuti: basato su snapshot repository alla data indicata in `docs/checkpoint.md` (**2026-04-23**) e su `wc -l` del file HTML.*

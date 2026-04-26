# Checkpoint progetto — GOI GIS Tool

**Data snapshot:** 2026-04-26  
**File canonico app:** `coordinate_converter Claude.html` (HTML single-file)

**Ultimo cambio:** 2026-04-26 — **Traccia — guard salvataggio (min 2 punti) + UX avviso:** `saveCurrentTrackToLibrary` richiede almeno 2 punti (`track.saveMinTwoPoints` IT/EN/FR), `return false` senza `saveStore`; `notifyTrackSaveMinPointsBlocked` / `clearTrackSaveMinPointsNotice` mostrano il messaggio in badge, `#trackSaveGuardMsg`, prompt completamento (`#trackPromptSaveErr`) e “Salva e nuova” (`#trackNewPromptSaveErr`); “Salva e nuova” e salvataggio da prompt non chiudono/resetano se fallisce; `renderTrackSummary` pulisce l’avviso con ≥2 punti. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-26 — Track save min 2 punti*.

**Ultimo cambio (accessibilità):** 2026-04-26 — **Theme-1 — select tema:** su `#themeSelect` aggiunto `data-i18n-aria="settings.themeAria"` così `applyLanguage` imposta `aria-label` dai dizionari IT/EN/FR già presenti; `aria-labelledby="themeSettingsLbl"` mantenuto. Nessun cambio a logica tema / JS / stringhe i18n. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-26 — Theme-1 select aria*.

**Ultimo grande cambio:** 2026-04-26 — **Theme-1: tema automatico locale + select tre modalità**. Nel monolite: `state.theme` persistito come preferenza `light` | `dark` | `auto`; risoluzione `auto` solo con `new Date()` e ora locale (07:00–18:59 chiaro, 19:00–06:59 scuro); DOM sempre `data-theme="light"|"dark"`; rimosso default `matchMedia(prefers-color-scheme)`; funzioni `resolveThemeFromLocalClock`, `getEffectiveTheme`, `applyThemePreference`, `syncThemeDomFromState`, `scheduleThemeAutoRefresh` / `clearThemeAutoRefresh`, listener `visibilitychange`; menu impostazioni: `#themeSelect` al posto del toggle binario; i18n IT/EN/FR (`theme.opt*`, `tip.theme`, `settings.themeAria`); import sessione JSON accetta `theme: "auto"`. Nessun tocco a `coordconv_ui_v1`, OPSEC, geocoding, IDB tile, waypoint/track. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-26 — Theme-1 tema automatico locale*.

**Cambio precedente:** 2026-04-26 — **Monolite: region markers + Persistent UI (Fase 1) + micro UX**. Nel file canonico: marker folding **CSS** (`/* #region CSS — … */`, 15 blocchi) e **JS** (`// #region JS — …`, 11 macro-regioni dopo consolidamento R3); persistenza dedicata **`coordconv_ui_v1`** (solo geometria pannelli floating GIS whitelist `track|waypoint|convert|search|favorites|layers` con `left/top/w/h/touched`), funzioni `captureUiState` / `sanitizeUiState` / `loadUiState` / `saveUiState` / `applyUiState` / `scheduleSaveUiState`, salvataggio a fine drag/resize con debounce, `applyUiState()` dopo `gisInit()`, `clearStore()` rimuove anche la chiave UI; tooltip `tip.offlineHints` più esplicito; CSS `.bbox-move` a `inset:0` per trascinamento su bbox piccoli. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-26 — Region markers, persistent UI Fase 1, micro UX*.

**Cambio precedente:** 2026-04-26 — **Cursor.code-workspace: ottimizzazioni memoria/editor per monolite**. Impostazioni workspace: `editor.largeFileOptimizations`, tetto `typescript.tsserver.maxTsServerMemory` 2048 MB, `typescript.disableAutomaticTypeAcquisition`, `typescript`/`javascript.suggest.autoImports` disattivati, blocco `[html]` con `quickSuggestions` off e `wordBasedSuggestions` off (suggerimenti su trigger), `files.watcherExclude` / `search.exclude` per repomix, backup e oggetti git; `files.exclude` solo per `repomix-output*.xml`. **Nessuna esclusione** di `docs/` né dei file `@docs` principali. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-26 — Cursor workspace memoria/editor*.

**Cambio precedente:** 2026-04-26 — **Pannello Mappa/Offline: tabella aree salvate + batch metadata-only**. Nel monolite: sezione `#offlineAreasSection` con tabella ordinabile aree offline (selezione, visibilità, nome, stato, data, zoom, strato, tile, spazio, azioni leggere), selezione multipla transient per id (`state._offlineAreasSelectedIds`, shift range e checkbox select-all), toolbar batch esterna (mostra/nascondi selezionate, elimina solo metadata, «Usa area» / «Centra» solo su selezione singola), rendering via `renderOfflineAreasList()` / `updateOfflineAreasToolbarUI()` / `offlineAreaStatusLabel()`; blocco `#pcBboxFeedback` per messaggi aria-live su area selezionata / pronta al download. Nessuna modifica a IndexedDB/download core/cache tile; eliminazione aree non cancella tile. Chiavi i18n IT/EN/FR sotto `offcache.list.*`, `offcache.sel.*`, `offcache.area.*`, `offcache.bboxFeedback*`. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-26 — Offline areas O1-O4c*.

**Cambio precedente:** 2026-04-25 — **GIS floating panels e UI polish** (commit `b2546e0`). Stabilizzati i pannelli GIS sopra la mappa: drag/resize condivisi per Track, Waypoint, Convert, Search, Favorites e Layers; Search/Favorites/Layers ora hanno dialog flottanti dedicati; Track ha prompt di completamento/salvataggio, nuova traccia, pausa/riprendi inserimento e lista punti collassabile; header/settings e controlli basemap sono stati ripuliti per ridurre overlay invasivi. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-25 — GIS floating panels e UI polish*.

**Cambio precedente:** 2026-04-25 — **Waypoint Manager: export multi-formato (GPX / KML / KMZ / CSV)**. Aggiunti `waypointsExport(kind)` (`kind` ∈ gpx, kml, kmz, csv) che mappa `state.mapWaypoints` in `points` con `desc` dalle `meta.notes` e riusa i builder esistenti (`buildGPX`, `buildKML` + `buildKmz(…, "doc.kml")`, `buildCsv`); quattro pulsanti in toolbar accanto a «Esporta GeoJSON» (`wpExportGpx` … `wpExportCsv`), binding in `bindUI` dopo `#wpExportBtn`, chiavi i18n IT/EN/FR `waypointModal.export*` e `tip.waypointModal.export*`. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-25 — Waypoint Manager export*.

**Cambio precedente (grande):** 2026-04-24 — **GIS Phase 1: fondazione GeoJSON invisibile** (piano `.cursor/plans/gis_phase_1_5bb51510.plan.md`). Aggiunti nel monolite, senza nuova UI: `state.gisTracks[]` (cap 50), `state.gisPolygons[]` (cap 50), `state.gisLayers[]` (cap 20 con seed Waypoints/Tracks/Polygons), `state.gisSelection` + `undoStack/redoStack` transient, helper CRUD `gisFeature*` / `gisLayer*`, sanitize/clamp load/save, scaffold `gisActionRecord()` e read-lens `gisAllAsFeatureCollection()` che produce un GeoJSON FeatureCollection unificando waypoint esistenti + nuovi store track/polygon. `state.mapWaypoints[]` resta fonte canonica dei waypoint; nessuna migrazione a store unificato in questa fase. Dettagli completi in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-24 — GIS Phase 1*.

**Cambio precedente:** 2026-04-24 — **GIS Tool cleanup pre-phase** (piano `.cursor/plans/gis_tool_cleanup_pre-phase_0ce7df27.plan.md`). Pulizia di superficie prima di iniziare il GIS progressive plan: rename app `Convertitore Coordinate` → **GOI GIS Tool**, rimozione Radius/LOS tools, Live Tracking e DTG, store bump `coordconv_v1` → `coordconv_v2`. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-24 — Cleanup pre-GIS*.

**Ultimo cambio UI:** 2026-04-24 — **UI tokens semantici + glass sweep (solo CSS)** (secondo passaggio del piano `.cursor/plans/css_glass_ui_+_tokens_24558147.plan.md`). Sopra il restyle glass precedente, rifattorizzata la cima di `<style>` in due livelli: (1) token semantici (`--surface-page/raised/glass/glass-hover/field`, `--text-primary/muted`, `--border-hairline/strong/glow`, `--radius-card/control/chip`, `--shadow-soft/elevated`, `--map-control-bg/border`, `--tooltip-bg/fg`) separati per light/dark; (2) alias legacy (`--bg`, `--panel`, `--panel2`, `--text`, `--muted`, `--border`, `--shadow`, `--shadow-lg`) ora derivati dai semantici. Sweep sui componenti (card, form, btn, modal/drawer/topbar, controlli mappa, menu basemap, tooltip) per sostituire valori hard-coded con token. HTML/JS invariati. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-24 — UI tokens semantici*.

**Ultimo cambio feature (precedente al 2026-04-25):** 2026-04-24 — **WaypointModal manager split** (piano `.cursor/plans/waypointmodal_manager_split_4a8b4ca8.plan.md`). Waypoint finalmente staccati dal track builder: nuova `<details id="sec-waypoints">` + `<dialog id="waypointModal" class="app-modal">` che hostna manager completo (list + editor inline con `autoDetect` + import/export GeoJSON dedicato + cap 200). Nuovo pattern **tab-as-modal** (`GIS_TABS_AS_MODAL`), `GIS_TAB_SECTIONS.waypoints` ora punta a `sec-waypoints` (non più alias di `sec-track`). `state.mapWaypoints` resta single source of truth; modal riparenta via `gisMoveSectionTo` senza clone. Sanitize load esteso per `meta.icon/color/notes`. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-24 — WaypointModal*.

**Convenzione:** quando chiedi in chat **«Checkpoint md»**, si aggiornano **sempre** questo file **e** `docs/session-geolocalizzazione-e-mappa.md` (append in fondo), salvo che specifichi «solo session» o «solo checkpoint.md».

## Documentazione lunga (autoritativa per feature / decisioni)

- `docs/session-geolocalizzazione-e-mappa.md` — consuntivo completo, checkpoint storici, backlog. **I checkpoint “ufficiali” di sessione vanno aggiornati lì** (sezione in fondo); questo file è solo un indice corto per `@` in chat.
- `docs/PROJECT_notes.md` — living document tecnico: overview repo, mappa sezioni del monolite, stack incorporato, stato feature, roadmap sintetica, comando Repomix.
- `docs/roadmap.md` — **rev. 2** (2026-04-23). Strategic reference: vision, §3 Distribution Strategy, §4 Architectural Principles, §8 Out of Scope. Contiene la "Notice to AI Assistants" mirrorata in `.cursor/rules/00-project-core.mdc`.
- `docs/cursor-workflow.md` — companion operativo della roadmap: quando @-menzionarla, come combinarla con le rules, pattern di uso in sessione.

## Cursor — Project Rules (`.cursor/rules/`)

Struttura attuale (efficienza token: core sempre attivo, HTML auto-attached, dominio on-demand):

| File | Ruolo |
|------|--------|
| `00-project-core.mdc` | **Always** — vincoli assoluti, stile risposta (IT), patch non file interi; non modificare file fuori `.cursor/rules/` senza permesso esplicito. **Contiene Mirror notice + Rejected patterns (ref) + Disagreement protocol** allineati a `docs/roadmap.md` §Notice. |
| `10-html-architecture.mdc` | **Auto** `*.html` — stato `state`, `coordconv_v2`, IDB, GPS opt-in (single-shot), offline tile, GIS Phase 1 hybrid stores (`gisTracks`/`gisPolygons`/`gisLayers` + transient undo/selection), `skipHistory`, i18n `data-i18n` vs `data-i18n-html`, idempotenza/cleanup. |
| `20-domain-knowledge.mdc` | **Agent Requested** — CRS/datum extra, geocoding Nominatim/OPSEC, tile pack/coverage, track, export, misura on-map. |
| `99-known-state.mdc` | **Manual** (`@99-known-state`) — solo invarianti “non rompere queste cose”. |

**Rimosso:** `regole.mdc` (contenuto ripartito nei file sopra, per evitare duplicazione `alwaysApply`).

## Relazione mirror roadmap ↔ rules

`docs/roadmap.md` (sezione "Notice to AI Assistants") e `.cursor/rules/00-project-core.mdc` (sezioni Mirror notice / Rejected patterns / Disagreement protocol) contengono **contenuto duplicato per design**. Quando si modifica uno, aggiornare l'altro nella stessa operazione. La roadmap resta la sorgente autoritativa per la lista Rejected patterns estesa; le rules contengono il principio + esempi principali.

## Invarianti da non rompere (sintesi)

- Nessun GPS silenzioso all’avvio; contesto sicuro per Geolocation.
- Geolocation **solo single-shot** (`getCurrentPosition` via `btnMyLocation`); il live tracking via `watchPosition` è stato rimosso nel cleanup pre-GIS e non va reintrodotto senza decisione esplicita.
- Offline: tile da IDB + placeholder; niente fallback “online forzato” che violi scelta utente/OPSEC.
- Geocoding: `opsecStrict` blocca rete; niente invio automatico di paste non-coordinate senza conferma.
- i18n: `data-i18n` sicuro (`textContent`); `data-i18n-html` solo dove esplicitamente previsto.
- Persistenza: sanitizzare/clampare al load tutto ciò che arriva da `localStorage`.
- GIS Phase 1: `mapWaypoints[]` resta canonico per waypoint; `gisTracks[]`/`gisPolygons[]`/`gisLayers[]` sono store GeoJSON-native additivi e persistiti; `gisSelection`/`undoStack`/`redoStack` restano transient.
- **GIS-first**: le sezioni classiche (paste, manual, geocoding, results, tools) restano nel DOM ma sono nascoste in home (`body.gis-mode > main > …`); vengono **spostate** con `appendChild` via `GIS_HOME_SLOTS`, **mai clonate**. `gisInit()` deve girare prima di `initMiniMapOnStartup()` per far rendere la mappa direttamente in `#gisMapMount`.
- Il pulsante on-map `[data-role="offline-panel-open"]` in GIS mode attiva la tab `layers` (capture-phase intercept): non bypassare con nuovi handler.

## Prossimo passo suggerito (solo se serve)

- Aggiornare **questo** `checkpoint.md` a fine sessione (1 minuto) oppure aggiungere un paragrafo in coda a `session-geolocalizzazione-e-mappa.md` per checkpoint “lunghi”.

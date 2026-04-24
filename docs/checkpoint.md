# Checkpoint progetto — GOI GIS Tool

**Data snapshot:** 2026-04-24  
**File canonico app:** `coordinate_converter Claude.html` (HTML single-file)

**Ultimo grande cambio:** 2026-04-24 — **GIS Phase 1: fondazione GeoJSON invisibile** (piano `.cursor/plans/gis_phase_1_5bb51510.plan.md`). Aggiunti nel monolite, senza nuova UI: `state.gisTracks[]` (cap 50), `state.gisPolygons[]` (cap 50), `state.gisLayers[]` (cap 20 con seed Waypoints/Tracks/Polygons), `state.gisSelection` + `undoStack/redoStack` transient, helper CRUD `gisFeature*` / `gisLayer*`, sanitize/clamp load/save, scaffold `gisActionRecord()` e read-lens `gisAllAsFeatureCollection()` che produce un GeoJSON FeatureCollection unificando waypoint esistenti + nuovi store track/polygon. `state.mapWaypoints[]` resta fonte canonica dei waypoint; nessuna migrazione a store unificato in questa fase. Dettagli completi in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-24 — GIS Phase 1*.

**Cambio precedente:** 2026-04-24 — **GIS Tool cleanup pre-phase** (piano `.cursor/plans/gis_tool_cleanup_pre-phase_0ce7df27.plan.md`). Pulizia di superficie prima di iniziare il GIS progressive plan: rename app `Convertitore Coordinate` → **GOI GIS Tool**, rimozione Radius/LOS tools, Live Tracking e DTG, store bump `coordconv_v1` → `coordconv_v2`. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-24 — Cleanup pre-GIS*.

**Ultimo cambio UI:** 2026-04-24 — **UI tokens semantici + glass sweep (solo CSS)** (secondo passaggio del piano `.cursor/plans/css_glass_ui_+_tokens_24558147.plan.md`). Sopra il restyle glass precedente, rifattorizzata la cima di `<style>` in due livelli: (1) token semantici (`--surface-page/raised/glass/glass-hover/field`, `--text-primary/muted`, `--border-hairline/strong/glow`, `--radius-card/control/chip`, `--shadow-soft/elevated`, `--map-control-bg/border`, `--tooltip-bg/fg`) separati per light/dark; (2) alias legacy (`--bg`, `--panel`, `--panel2`, `--text`, `--muted`, `--border`, `--shadow`, `--shadow-lg`) ora derivati dai semantici. Sweep sui componenti (card, form, btn, modal/drawer/topbar, controlli mappa, menu basemap, tooltip) per sostituire valori hard-coded con token. HTML/JS invariati. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-24 — UI tokens semantici*.

**Ultimo cambio feature:** 2026-04-24 — **WaypointModal manager split** (piano `.cursor/plans/waypointmodal_manager_split_4a8b4ca8.plan.md`). Waypoint finalmente staccati dal track builder: nuova `<details id="sec-waypoints">` + `<dialog id="waypointModal" class="app-modal">` che hostna manager completo (list + editor inline con `autoDetect` + import/export GeoJSON dedicato + cap 200). Nuovo pattern **tab-as-modal** (`GIS_TABS_AS_MODAL`), `GIS_TAB_SECTIONS.waypoints` ora punta a `sec-waypoints` (non più alias di `sec-track`). `state.mapWaypoints` resta single source of truth; modal riparenta via `gisMoveSectionTo` senza clone. Sanitize load esteso per `meta.icon/color/notes`. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-24 — WaypointModal*.

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

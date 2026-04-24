# Checkpoint progetto — Coordinate Converter

**Data snapshot:** 2026-04-24  
**File canonico app:** `coordinate_converter Claude.html` (HTML single-file)

**Ultimo grande cambio:** 2026-04-24 — **GIS-first layout pivot** (piano `.cursor/plans/gis-first_layout_pivot_7c8df2ea.plan.md`). L'app boota in GIS mode (`body.gis-mode`): topbar con tab bar, mappa full-viewport, conversione come modale on-demand, "Altri strumenti" kebab. Reparenting via `appendChild` (no clone) per preservare i listener. Dettagli completi in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-24*.

**Ultimo cambio UI:** 2026-04-24 — **Glass UI restyle (solo CSS)** (piano `.cursor/plans/css_glass_ui_+_tokens_24558147.plan.md`). Aggiornato solo il blocco `<style>`: `@import` Inter, token semantici in `:root` (light/dark) con `--border-glow`, `--ring-focus`, `--glass-blur`, `--shadow-inset-card`, ombre ampie e morbide; glassmorphism (blur 16px) su card, form, overlay (modal/drawer/topbar), controlli mappa translucidi scuri, tooltip glass. Aliases legacy (`--bg`, `--panel`, `--panel2`, `--shadow*`) mantenuti: refresh UI futuri = solo token in cima. HTML/JS invariati. Dettagli in `docs/session-geolocalizzazione-e-mappa.md` → *Checkpoint 2026-04-24 — Glass UI*.

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
| `10-html-architecture.mdc` | **Auto** `*.html` — stato `state`, `coordconv_v1`, IDB, GPS opt-in, offline tile, `skipHistory`, i18n `data-i18n` vs `data-i18n-html`, idempotenza/cleanup. |
| `20-domain-knowledge.mdc` | **Agent Requested** — CRS/datum extra, DTG, geocoding Nominatim/OPSEC, tile pack/coverage, track, export, misura on-map. |
| `99-known-state.mdc` | **Manual** (`@99-known-state`) — solo invarianti “non rompere queste cose”. |

**Rimosso:** `regole.mdc` (contenuto ripartito nei file sopra, per evitare duplicazione `alwaysApply`).

## Relazione mirror roadmap ↔ rules

`docs/roadmap.md` (sezione "Notice to AI Assistants") e `.cursor/rules/00-project-core.mdc` (sezioni Mirror notice / Rejected patterns / Disagreement protocol) contengono **contenuto duplicato per design**. Quando si modifica uno, aggiornare l'altro nella stessa operazione. La roadmap resta la sorgente autoritativa per la lista Rejected patterns estesa; le rules contengono il principio + esempi principali.

## Invarianti da non rompere (sintesi)

- Nessun GPS silenzioso all’avvio; contesto sicuro per Geolocation.
- Live tracking: niente spam cronologia (`skipHistory` dove previsto).
- Offline: tile da IDB + placeholder; niente fallback “online forzato” che violi scelta utente/OPSEC.
- Geocoding: `opsecStrict` blocca rete; niente invio automatico di paste non-coordinate senza conferma.
- i18n: `data-i18n` sicuro (`textContent`); `data-i18n-html` solo dove esplicitamente previsto.
- Persistenza: sanitizzare/clampare al load tutto ciò che arriva da `localStorage`.
- **GIS-first**: le sezioni classiche (paste, manual, geocoding, results, tools) restano nel DOM ma sono nascoste in home (`body.gis-mode > main > …`); vengono **spostate** con `appendChild` via `GIS_HOME_SLOTS`, **mai clonate**. `gisInit()` deve girare prima di `initMiniMapOnStartup()` per far rendere la mappa direttamente in `#gisMapMount`.
- Il pulsante on-map `[data-role="offline-panel-open"]` in GIS mode attiva la tab `layers` (capture-phase intercept): non bypassare con nuovi handler.

## Prossimo passo suggerito (solo se serve)

- Aggiornare **questo** `checkpoint.md` a fine sessione (1 minuto) oppure aggiungere un paragrafo in coda a `session-geolocalizzazione-e-mappa.md` per checkpoint “lunghi”.

# Checkpoint progetto — Coordinate Converter

**Data snapshot:** 2026-04-23  
**File canonico app:** `coordinate_converter Claude.html` (HTML single-file)

**Convenzione:** quando chiedi in chat **«Checkpoint md»**, si aggiornano **sempre** questo file **e** `docs/session-geolocalizzazione-e-mappa.md` (append in fondo), salvo che specifichi «solo session» o «solo checkpoint.md».

## Documentazione lunga (autoritativa per feature / decisioni)

- `docs/session-geolocalizzazione-e-mappa.md` — consuntivo completo, checkpoint storici, backlog. **I checkpoint “ufficiali” di sessione vanno aggiornati lì** (sezione in fondo); questo file è solo un indice corto per `@` in chat.
- `docs/PROJECT_notes.md` — living document tecnico: overview repo, mappa sezioni del monolite, stack incorporato, stato feature, roadmap sintetica, comando Repomix.

## Cursor — Project Rules (`.cursor/rules/`)

Struttura attuale (efficienza token: core sempre attivo, HTML auto-attached, dominio on-demand):

| File | Ruolo |
|------|--------|
| `00-project-core.mdc` | **Always** — vincoli assoluti, stile risposta (IT), patch non file interi; non modificare file fuori `.cursor/rules/` senza permesso esplicito. |
| `10-html-architecture.mdc` | **Auto** `*.html` — stato `state`, `coordconv_v1`, IDB, GPS opt-in, offline tile, `skipHistory`, i18n `data-i18n` vs `data-i18n-html`, idempotenza/cleanup. |
| `20-domain-knowledge.mdc` | **Agent Requested** — CRS/datum extra, DTG, geocoding Nominatim/OPSEC, tile pack/coverage, track, export, misura on-map. |
| `99-known-state.mdc` | **Manual** (`@99-known-state`) — solo invarianti “non rompere queste cose”. |

**Rimosso:** `regole.mdc` (contenuto ripartito nei file sopra, per evitare duplicazione `alwaysApply`).

## Invarianti da non rompere (sintesi)

- Nessun GPS silenzioso all’avvio; contesto sicuro per Geolocation.
- Live tracking: niente spam cronologia (`skipHistory` dove previsto).
- Offline: tile da IDB + placeholder; niente fallback “online forzato” che violi scelta utente/OPSEC.
- Geocoding: `opsecStrict` blocca rete; niente invio automatico di paste non-coordinate senza conferma.
- i18n: `data-i18n` sicuro (`textContent`); `data-i18n-html` solo dove esplicitamente previsto.
- Persistenza: sanitizzare/clampare al load tutto ciò che arriva da `localStorage`.

## Prossimo passo suggerito (solo se serve)

- Aggiornare **questo** `checkpoint.md` a fine sessione (1 minuto) oppure aggiungere un paragrafo in coda a `session-geolocalizzazione-e-mappa.md` per checkpoint “lunghi”.

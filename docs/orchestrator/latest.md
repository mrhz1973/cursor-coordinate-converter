# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-29 — **Range Rings 5A-bis:** il pulsante on-map **Rings** apre un **pannello floating GIS** (`#rangeRingsPanel`, riuso `#sec-rangerings`) invece del drawer Strumenti grande; fallback drawer solo se il dialog manca. Dettaglio: `docs/orchestrator/inbox/2026-04-29_1905_riepilogo_range-rings-5A-bis-floating.md`.

## Ultimo intervento Cursor

Monolite: floating Range Rings on-map; `activateToolPanel` / Esc / resize / reset allineati.

## File modificati (sintesi)

- `coordinate_converter Claude.html`
- `docs/orchestrator/latest.md` (questo)
- `docs/orchestrator/inbox/2026-04-29_1905_riepilogo_range-rings-5A-bis-floating.md`

**Non toccati:** `docs/roadmap.md`, `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, workflow rules (solo se non in questo batch).

## Stato verifiche

- `git diff --check` sul monolite; `node --check` primo script inline: ok.

## Stato Git noto

`git status --short` in Cursor; monolite **non** incluso nell’autosync memoria.

## Prossimo passo consigliato

Smoke test UI Range Rings (floating + Strumenti); eventuale commit monolite a parte.

## Dettagli

- 5A-bis: `docs/orchestrator/inbox/2026-04-29_1905_riepilogo_range-rings-5A-bis-floating.md`
- 5A feature: `docs/orchestrator/inbox/2026-04-29_1612_riepilogo_rangerings_5A.md`

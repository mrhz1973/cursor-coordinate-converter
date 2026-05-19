# Update dev-method overlay — v0.1.0 → v0.1.1

- **Data:** 2026-05-19
- **Repository:** `mrhz1973/cursor-coordinate-converter`
- **Tipo:** docs-only
- **Versione metodo precedente:** `v0.1.0`
- **Versione metodo nuova:** `v0.1.1`

## File modificati

- `docs/METHOD.md`
  - `Method tag: v0.1.0` → `v0.1.1`.
  - Tutti i link pinnati `/blob/v0.1.0/` → `/blob/v0.1.1/` (README, LLMS, core/00–06, adapters/project-import, adapters/single-file-html, examples/gis-tool, prompts/implementer-standard, templates/project-method-overlay).
  - Riga «All links are pinned to `v0.1.0`» → `v0.1.1`.
  - Nuova sezione **«Why v0.1.1 for GIS Tool»** — sintesi delle policy aggiunte in `v0.1.1` per cui GIS Tool, primo pilot, si aggiorna.
  - Nuova sezione **«Local operating note — large-file / token-efficiency»** — regole locali sul monolite `coordinate_converter Claude.html`.
- `docs/orchestrator/latest.md` — entry sintetica in cima a «Ultimo aggiornamento».
- `docs/orchestrator/inbox/2026-05-19_1335_update-dev-method-v0.1.1.md` — questo report.

## Perché v0.1.1 conta per GIS Tool

`v0.1.1` codifica policy emerse proprio da questo pilot:

- **Large single-file / token-efficiency policy** — fondamentale qui: la base di codice è un singolo HTML monolitico (`coordinate_converter Claude.html`, decine di migliaia di righe). Marker search + narrow range + targeted diff sono già la prassi quotidiana, ora sono regola di metodo.
- **Session/repo guard** — il pilot ha mostrato il rischio concreto di confusione tra `dev-method` e `cursor-coordinate-converter`. Il guard di sessione è ora richiesto preflight.
- **Idea intake durante l'uso** — idee di prodotto/processo nate in sessione vanno in inbox dell'orchestratore, non interrompono il task in corso.
- **Context compaction / debug reconstruction** — `latest.md` è già la sintesi corta, gli inbox dated portano il dettaglio: pattern ora promosso a regola.
- **Prompt/template integration** — i prompt implementer e l'overlay template incorporano queste policy di default.

## Conferma: nessun cambio runtime

- `coordinate_converter Claude.html`: **non modificato**.
- Nessun file di build / deploy / package / GitHub Actions toccato.
- Nessun tag o release creato.
- Solo `docs/` (overlay metodo + orchestratore).

## Allowed/forbidden scope rispettato

- Modificati solo: `docs/METHOD.md`, `docs/orchestrator/latest.md`, `docs/orchestrator/inbox/2026-05-19_1335_update-dev-method-v0.1.1.md`.
- Non toccati: monolite, dev-method repo, build/deploy/CI, runtime, scripts.

## Prossima raccomandazione

- Prossimo task tecnico GIS riprende dal piano roadmap (es. **CoT XML import/export** o **compound polygon dedicated**, vedi `latest.md` 2026-05-19 ore 10:52), ora sotto overlay `v0.1.1` con large-file policy esplicitamente attiva.
- Quando si aprirà la prima sessione `v0.1.1` su monolite, verificare che il preflight implementer applichi davvero session/repo guard e marker-search-first sul file.

# Riepilogo intervento — workflow Plan mode → salvataggio Agent

**Data:** 2026-04-29 (timestamp nome file: 2230).

## Problema

- In Plan mode Cursor può produrre un piano utile nella chat ma **non** scrivere file nel repo.
- Il piano rischia di restare **solo in chat**; l’orchestratore ChatGPT, con «aggiornati», legge la memoria **versionata** su remoto e **non** vede contenuti mai salvati in `docs/orchestrator/inbox/`.
- Passaggi manuali ripetitivi per allineare la memoria.

## Regola aggiunta

- Per **piani importanti** in Plan mode, se in quella fase **non** si scrivono file in `docs/orchestrator/**`, la risposta **deve** terminare con la sezione obbligatoria:

  **`PROMPT DI SALVATAGGIO PIANO — DA USARE IN AGENT MODE`**

- La sezione contiene un prompt **copiabile** per Agent mode che: salva il piano in `docs/orchestrator/inbox/YYYY-MM-DD_HHMM_plan_<slug>.md`, aggiorna `docs/orchestrator/latest.md`, esegue commit/push selettivo memoria orchestratore (e `.cursor/rules/**` solo se toccati nello stesso intervento), **esclude** monolite, **esclude** `docs/checkpoint.md` / `docs/session-geolocalizzazione-e-mappa.md` / `docs/roadmap.md` salvo richiesta esplicita, **non** esegue **`finito`**.
- Resta valido **un file inbox per intervento** (no proliferazione per micro-fix).

## File modificati

- `.cursor/rules/30-output-workflow.mdc` — sezione *Piano operativo (Plan mode)* ampliata (prompt obbligatorio, vincoli Agent, distinzione «aggiornati»).
- `docs/orchestrator/README.md` — sezione **Plan mode e salvataggio piani**.
- `docs/orchestrator/chatgpt-checkpoint.md` — nota *Piano prodotto in Plan mode ma non salvato in repo*.
- `docs/orchestrator/latest.md` — sintesi aggiornata al workflow.
- `docs/orchestrator/inbox/2026-04-29_2230_riepilogo_workflow-plan-save-agent.md` — questo file.

## Cosa non è stato toccato

- `coordinate_converter Claude.html`
- `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/roadmap.md`
- `package.json`, script, GitHub Actions, hook, n8n, altri file non elencati.

## Verifiche

- `git status --short` e `git diff --stat` dopo le modifiche (QA locale). L’output `diff --stat` del workspace può includere `coordinate_converter Claude.html` se già modificato **prima** di questo intervento: **non** fa parte del commit autosync di questo workflow.

## Prossimo passo consigliato

- Nei prossimi piani Plan mode importanti senza scrittura file: includere sempre la sezione **PROMPT DI SALVATAGGIO PIANO**; l’utente la incolla in Agent per pubblicare memoria.
- Riprendere il lavoro applicativo (es. Range Rings 5C) dal piano già in `docs/orchestrator/inbox/2026-04-29_2130_plan_range-rings-next-ui-label-autocreate-drag.md` se ancora valido.

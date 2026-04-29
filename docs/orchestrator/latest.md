# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-29 — **Workflow orchestratore:** in Plan mode, per **piani importanti** senza scrittura file in repo, la risposta deve includere la sezione obbligatoria **`PROMPT DI SALVATAGGIO PIANO — DA USARE IN AGENT MODE`** (prompt Agent: `inbox/YYYY-MM-DD_HHMM_plan_<slug>.md` + `latest.md` + autosync commit/push memoria; **no** monolite, **no** doc ufficiali/`finito`). Dettaglio: `docs/orchestrator/inbox/2026-04-29_2230_riepilogo_workflow-plan-save-agent.md`.

## Ultimo intervento Cursor

Regole workflow (`.cursor/rules/30-output-workflow.mdc`) + doc orchestratore (`README.md`, `chatgpt-checkpoint.md`, inbox workflow). Nessuna modifica al monolite; nessun **`finito`**.

## File modificati (sintesi)

- `.cursor/rules/30-output-workflow.mdc`
- `docs/orchestrator/README.md`, `chatgpt-checkpoint.md`, `latest.md`, `inbox/2026-04-29_2230_riepilogo_workflow-plan-save-agent.md`

**Non toccati:** `coordinate_converter Claude.html`, `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/roadmap.md`.

## Stato verifiche

- QA: `git status --short`, `git diff --stat` (vedi inbox workflow).

## Stato Git noto

Autosync: commit **solo** `docs/orchestrator/**` e, se nello stesso intervento, `.cursor/rules/**` pertinente (senza monolite).

## Prossimo passo consigliato

1. Applicare la nuova sezione Plan → Agent nei prossimi piani importanti.
2. Lavoro feature: es. Range Rings — piano tecnico già in `docs/orchestrator/inbox/2026-04-29_2130_plan_range-rings-next-ui-label-autocreate-drag.md` (ordine 5C→5F).

## Dettagli (inbox)

- **Workflow Plan→Agent:** `docs/orchestrator/inbox/2026-04-29_2230_riepilogo_workflow-plan-save-agent.md`
- **Piano Range Rings 5C–5F:** `docs/orchestrator/inbox/2026-04-29_2130_plan_range-rings-next-ui-label-autocreate-drag.md`
- Altri inbox Range Rings: vedi elenco cronologico in commit precedenti se serve.

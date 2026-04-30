# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-30 — **Workflow orchestratore — riconciliazione codice ↔ memoria:** aggiunta regola per gestire disallineamenti (blocco implementato nel codice ma non presente in `latest.md` + `inbox/`): Cursor deve verificare, classificare (`IMPLEMENTATO E NON PUBBLICATO` / `PARZIALE` / `NON IMPLEMENTATO` / `GIÀ PUBBLICATO`) e, se necessario, pubblicare memoria corretta **senza** chiedere a ChatGPT di scansionare il monolite. `aggio` / `aggiornati` invariati. Dettaglio in **`docs/orchestrator/inbox/2026-04-30_1220_riepilogo_workflow-riconciliazione-codice-memoria.md`**.

## Ultimo intervento Cursor

Documentazione workflow: regola riconciliazione codice↔memoria + aggiornamento `latest.md` + inbox dedicato, senza modifiche al monolite né checkpoint ufficiali. **Nessun** `finito`.

## File modificati (sintesi)

- `.cursor/rules/30-output-workflow.mdc`
- `docs/orchestrator/README.md`
- `docs/orchestrator/chatgpt-checkpoint.md`
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-30_1220_riepilogo_workflow-riconciliazione-codice-memoria.md`

## Prossimo passo consigliato

Continuare sviluppo app / piani Misura o altro backlog; per ChatGPT: dopo push, **`aggio`** o **«aggiornati»** per leggere la memoria.

## Dettagli (inbox)

- Workflow riconciliazione: `docs/orchestrator/inbox/2026-04-30_1220_riepilogo_workflow-riconciliazione-codice-memoria.md`

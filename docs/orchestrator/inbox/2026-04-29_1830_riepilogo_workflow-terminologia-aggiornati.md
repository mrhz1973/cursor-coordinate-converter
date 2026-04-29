# Riepilogo operativo — terminologia «aggiornati» (pubblicare vs leggere)

**Timestamp nome file:** 2026-04-29 18:30 (locale Cursor).

## Obiettivo

Chiarire che **Cursor non controlla ChatGPT** e che la terminologia è:

1. **Cursor** (dopo ogni intervento operativo che cambia stato): aggiorna e **pubblica** automaticamente la memoria orchestratore — `docs/orchestrator/latest.md`, `docs/orchestrator/inbox/<riepilogo>.md`, **commit/push selettivo** solo memoria + file workflow pertinenti.
2. **ChatGPT** non si aggiorna da solo: legge GitHub **solo** quando l’utente scrive **«aggiornati»** nella **chat ChatGPT**.
3. **«aggiornati» in Cursor** = **pubblica** la memoria orchestratore. **«aggiornati» in ChatGPT** = **leggi** la memoria orchestratore da GitHub.
4. **Cursor** non fa nulla dentro ChatGPT e **non** deve aspettarsi che ChatGPT legga da solo.
5. **`finito`** resta separato: chiusura ufficiale completa della sessione.

## File modificati

- `.cursor/rules/30-output-workflow.mdc`
- `docs/orchestrator/README.md`
- `docs/orchestrator/chatgpt-checkpoint.md`
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-29_1830_riepilogo_workflow-terminologia-aggiornati.md` (questo file)

## Cosa non è stato toccato

- `coordinate_converter Claude.html`, `docs/roadmap.md`, `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, script, npm, Actions, hook, n8n.

## Verifiche

- Revisione testuale; monolite non coinvolto.

## Stato Git / prossimo passo

Verificare con `git status --short` in Cursor. Prossimo passo: applicare le definizioni in sessione; per ChatGPT usare **«aggiornati»** solo nella chat ChatGPT quando serve leggere la memoria pubblicata.

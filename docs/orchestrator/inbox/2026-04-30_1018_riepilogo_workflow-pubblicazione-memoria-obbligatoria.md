# Riepilogo — Workflow: pubblicazione memoria orchestratore **obbligatoria** a “blocco completato”

**Data:** 2026-04-30 10:18 UTC  
**Perimetro:** solo documentazione workflow (nessun cambio al monolite, nessun `finito`)

## Problema (sintesi)

ChatGPT legge lo stato operativo soprattutto da:

1. `docs/orchestrator/latest.md`
2. `docs/orchestrator/chatgpt-checkpoint.md`
3. `docs/checkpoint.md`
4. `docs/orchestrator/inbox/` (solo se serve dettaglio)

Se Cursor completa un lavoro (feature/bugfix/rules/piano) ma **non** aggiorna `latest.md` e **non** crea un riepilogo in `inbox/`, ChatGPT non può sapere in modo affidabile che il blocco è “completato” quando l’utente chiede **`aggio`** / **«aggiornati»**.

## Regola aggiunta (nuovo vincolo)

**Dopo ogni “blocco completato”, Cursor deve pubblicare la memoria orchestratore.**

Per **blocco completato** si intende, ad esempio:

- implementazione nel monolite;
- piano operativo importante (Plan);
- modifica di rules;
- modifica documentale di workflow;
- correzione bug completata;
- QA concluso con esito riportabile.

**Vincolo operativo:** un lavoro completato ma non registrato in `docs/orchestrator/latest.md` **+** un file `docs/orchestrator/inbox/` va considerato **non pubblicato all’orchestratore**.

## Nota su `aggio` / `aggiornati` (invariata)

- **`aggio`** / **«aggiornati» in ChatGPT**: legge la memoria **già pubblicata** sul remoto.
- **`aggio`** / **«aggiornati» in Cursor**: pubblica la memoria (allinea `latest`/`inbox` + commit/push selettivo memoria).
- **Significato invariato**: questa modifica rende più esplicito l’obbligo di pubblicare la memoria dopo un blocco completato, non cambia cosa i comandi fanno.

## Cosa deve contenere la pubblicazione (checklist)

In `latest.md` (sintesi) + `inbox/` (dettaglio) deve risultare chiaramente:

- cosa è stato fatto;
- file modificati;
- funzioni/regioni toccate;
- QA eseguito;
- rischi residui;
- prossimo passo consigliato;
- se il monolite è stato modificato;
- se il monolite è incluso o escluso dal commit (e perché);
- se il working tree è pulito o no.

## File toccati

- `.cursor/rules/30-output-workflow.mdc`
- `docs/orchestrator/README.md`
- `docs/orchestrator/chatgpt-checkpoint.md`
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-30_1018_riepilogo_workflow-pubblicazione-memoria-obbligatoria.md` (questo file)

## QA (di questo intervento)

- Verificare `git diff --stat` e `git status --short`
- Confermare monolite non modificato
- Confermare `aggio` e `aggiornati` restano validi (alias e semantica invariati)

## Prossimo passo consigliato

Quando Cursor completa un blocco, eseguire sempre l’autosync memoria (o `aggio`/`aggiornati` in Cursor) prima di passare al blocco successivo, così ChatGPT può allinearsi senza ambiguità.


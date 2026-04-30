# Riepilogo — Workflow: riconciliazione codice ↔ memoria orchestratore

**Data:** 2026-04-30 12:20 UTC  
**Perimetro:** solo documentazione workflow (nessun cambio al monolite, nessun `finito`)

## Problema

Può emergere un disallineamento in cui un blocco risulta già **implementato nel codice reale** (monolite o file pertinenti), ma non compare in:

- `docs/orchestrator/latest.md`
- un file `docs/orchestrator/inbox/` relativo all’intervento

In tale situazione ChatGPT **non deve** dedurre lo stato scansionando il monolite; serve una **riconciliazione** lato Cursor e una pubblicazione memoria corretta.

## Regola di riconciliazione (nuova)

Quando l’utente o ChatGPT segnala che “un blocco risulta fatto nel codice ma non è presente in `latest.md`”, Cursor deve:

1. **NON** assumere automaticamente che sia completato.
2. **Verificare** nel monolite o nei file pertinenti la presenza degli elementi richiesti (evidenze).
3. **Classificare** l’esito come uno dei seguenti:
   - `IMPLEMENTATO E NON PUBBLICATO`
   - `PARZIALE`
   - `NON IMPLEMENTATO`
   - `GIÀ PUBBLICATO`
4. Se esito = `IMPLEMENTATO E NON PUBBLICATO`, Cursor deve:
   - aggiornare `docs/orchestrator/latest.md`;
   - creare un file riepilogo in `docs/orchestrator/inbox/`;
   - indicare che il monolite **non è stato modificato** nello step (solo verificato);
   - includere QA / stato repo (diff/stat, working tree pulito/non) e nota monolite incluso/escluso dal commit;
   - commit/push selettivo della sola memoria orchestratore.
5. Se esito = `PARZIALE`, Cursor deve:
   - non pubblicarlo come completato;
   - pubblicare solo gap/piano di completamento se richiesto.
6. Se esito = `NON IMPLEMENTATO`, Cursor deve:
   - riportare che serve implementazione (senza segnalarlo come completato in `latest.md`).
7. Se esito = `GIÀ PUBBLICATO`, Cursor deve:
   - indicare il file `inbox` relativo e non duplicare riepiloghi inutilmente.

## Nota su `aggio` / `aggiornati`

- Significato invariato.
- `aggio` / `aggiornati` in ChatGPT legge solo memoria già pubblicata.
- Un blocco implementato nel codice ma non registrato in `latest.md` + `inbox/` è da considerare **non pubblicato all’orchestratore**.

## File toccati (questo intervento)

- `.cursor/rules/30-output-workflow.mdc`
- `docs/orchestrator/README.md`
- `docs/orchestrator/chatgpt-checkpoint.md`
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-30_1220_riepilogo_workflow-riconciliazione-codice-memoria.md` (questo file)

## QA richiesto (di questo intervento)

- `git diff --stat`
- `git status --short`
- conferma monolite non modificato
- conferma `aggio` e `aggiornati` restano validi

## Prossimo passo consigliato

Quando emerge un disallineamento, usare sempre questa regola: verifica → classificazione → pubblicazione memoria (solo se “implementato e non pubblicato”).


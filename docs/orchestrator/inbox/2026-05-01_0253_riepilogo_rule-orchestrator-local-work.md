# Riepilogo — regola workflow orchestratore (memoria obbligatoria anche con monolite solo locale)

**Timestamp:** 2026-05-01_0253  
**Tipo:** aggiornamento `.cursor/rules` + memoria orchestratore (commit selettivo).

## Cosa è stato cambiato nella rule

In **`.cursor/rules/30-output-workflow.mdc`**, sezione *Autosync orchestratore*, sono state aggiunte:

1. **`### Principio: memoria sempre pubblicata (anche senza commit monolite)`** — testo normativo che ripete il principio di visibilità ChatGPT: lavoro completato ma non in `latest.md` + `inbox/` = non visibile a ChatGPT con `aggio`. Se il monolite è stato toccato ma **non** va committato, si pubblica **comunque** la memoria con commit/push **selettivo** senza monolite.
2. Elenco operativo (default dopo ogni intervento operativo): `latest.md`, file `inbox`, commit/push selettivi senza `git add .`.
3. **Checklist inbox** quando il monolite resta modificato solo in working tree: file locali, natura modifica, test, `git status --short`, motivo esclusione dal commit, prossimo passo; dichiarazione esplicita “solo locale / non committato in questo push”.
4. Chiarimento che la pubblicazione memoria **non** autorizza di per sé il commit del monolite.
5. **`### Eccezione — non pubblicare memoria orchestratore`** — saltare pubblicazione **solo** se l’utente dice esplicitamente «non aggiornare orchestratore» o «solo locale, non pubblicare memoria» (o equivalente); obbligo di documentarlo nel RIEPILOGO.
6. L’intro della **Sequenza obbligatoria (autosync)** ora rimanda esplicitamente a questa eccezione oltre all’impedimento tecnico.

## Perché

È emerso un gap di workflow: dopo uno step operativo sul monolite **senza** aggiornamento di `docs/orchestrator/**`, ChatGPT con **`aggio`** non vede nulla. La regola deve rendere **stabile** l’obbligo di pubblicare la memoria dopo ogni intervento operativo, **anche** quando il monolite resta modificato solo localmente e **non** entra nel commit autosync.

## Comportamento nuovo (sintesi)

- Dopo ogni intervento operativo che cambia stato: **sempre** `latest.md` + `inbox` + commit/push selettivo memoria (e rules pertinenti se toccate nello stesso intervento).
- Monolite **non** incluso nel commit autosync salvo richiesta esplicita; se dirty: **documentare** nell’inbox e nel RIEPILOGO.
- Eccezione **solo** su richiesta testuale esplicita dell’utente (due formule canoniche nella rule).

## Eccezione esplicita (citazione)

Saltare orchestratore solo con: **«non aggiornare orchestratore»** oppure **«solo locale, non pubblicare memoria»** (o equivalente inequivocabile).

## File modificati (questo intervento)

- `.cursor/rules/30-output-workflow.mdc`
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-05-01_0253_riepilogo_rule-orchestrator-local-work.md` (questo file)

## File non toccati (elenco richiesto)

- `coordinate_converter Claude.html` — **non modificato in questo intervento** (la rule è stata aggiornata senza edit del monolite).
- `docs/PROJECT_notes.md`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`
- `docs/roadmap.md`
- `.cursor/rules/00-project-core.mdc`
- `.cursor/rules/10-html-architecture.mdc`
- `.cursor/rules/20-domain-knowledge.mdc`
- `.cursor/rules/99-known-state.mdc`
- Altri file sotto `docs/` oltre orchestratore sopra.

## Commit autosync di questo intervento

- **`coordinate_converter Claude.html` non è incluso** nel commit (non è stato modificato da questo intervento).
- **Stato locale separato:** al momento del commit, `git status --short` mostrava **` M "coordinate_converter Claude.html"`** — modifica **preesistente** / da altra sessione, **non** parte di questo commit e **non** descritta nel diff di questo intervento. Va considerata **working tree locale** finché non viene committata separatamente.

## QA

- Revisione testuale della rule e coerenza con sequenza autosync esistente.
- Nessun test runtime app (non richiesto).

## Prossimo passo consigliato

- Review del diff rule + memoria; decidere commit separato del monolite o rollback locale se la modifica a `coordinate_converter Claude.html` non è più attesa.

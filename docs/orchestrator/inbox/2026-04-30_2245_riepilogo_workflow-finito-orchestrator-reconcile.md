# Riepilogo — Workflow `finito`: riconciliazione orchestratore obbligatoria

**Data:** 2026-04-30  
**Commit:** `a2da326` — `docs(rules): finito — riconciliazione orchestratore obbligatoria post-push`  
**Push:** riuscito su `main`.

## Cosa è cambiato

1. **`.cursor/rules/00-project-core.mdc`** — sezione **«Finito»**: dopo `git commit`/`git push` principale (step 2), nuovo **step 3** obbligatorio: aggiornare `docs/orchestrator/latest.md`, creare `docs/orchestrator/inbox/YYYY-MM-DD_HHMM_riepilogo_finito-sessione.md` con contenuto minimo prescritto (hash, push, `git status`, `git diff --stat`, file principali, monolite incluso o no, QA, prossimo passo), poi **step 4**: `git add` orchestratore, `git commit` dedicato, `git push`. Gestione fallimenti push (step 2 o 4) con inbox/`latest` che documentano esito parziale. Bypass editing rules esteso a `docs/orchestrator/latest.md` e `inbox/*_riepilogo_finito-sessione.md`.

2. **`.cursor/rules/30-output-workflow.mdc`** — blocco *Confronto con chiusura ufficiale: `finito`*: richiamo esplicito alla riconciliazione orchestratore post-`finito`.

3. **`docs/orchestrator/chatgpt-checkpoint.md`** e **`docs/orchestrator/README.md`** — allineamento descrittivo per ChatGPT/team (stesso significato delle regole).

## Monolite

**Non modificato** in questo commit (`a2da326`). Il monolite era già stato incluso nella chiusura sessione precedente (`2a9b08a` — `finito` utente).

## QA

- Verifica testuale sequenza step 1→4 in `00-project-core.mdc`; grep assenza refusi (`chore:`).  
- `git status --short` pulito dopo push.

## Prossimo passo

Alla prossima chiusura **`finito`**, eseguire lo step 3–4 così `latest.md` non resti disallineato rispetto al repo dopo push del monolite.

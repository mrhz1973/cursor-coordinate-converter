# Riepilogo — Correzione vincolante workflow orchestratore

**File:** `2026-04-29_1548_riepilogo_workflow-vincolante.md`  
**Contesto:** decisione utente per allineare `docs/orchestrator/` e [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc) a un modello in cui la memoria per ChatGPT **non** è opzionale sui micro-task.

## Cosa è cambiato (regola 30)

- Sostituita la sezione *Orchestrator GitHub* con un modello **obbligatorio** dopo ogni intervento che modifica lo stato: `latest.md` (sintesi) + `inbox/` (riepilogo completo) + continuità backup `/tmp/…-goi-gis-riepilogo.md` (e piani in `/tmp` se applica).
- Piano operativo: oltre a `/tmp`, **copia in** `inbox/` con `YYYY-MM-DD_HHMM_plan_<slug>.md` (vincolo aggiunto sotto *Piano operativo*).
- Sotto *Contenuto del riepilogo*: aggiunto bullet sull’allineamento orchestrator.
- Definizione **doppia** di **«aggiornati»**:
  - **Cursor:** allineare memoria; preparare o eseguire commit/push selettivo su `docs/orchestrator/**` (e `.cursor/` se toccata), **escludendo** per default `coordinate_converter Claude.html` salvo richiesta esplicita; se il codice non è in commit, `inbox` con descrizione/estratto diff.
  - **ChatGPT:** lettura `latest` → `chatgpt-checkpoint` → `docs/checkpoint.md` se serve → `inbox` se serve; non chiedere `/tmp` se equivalente in repo.
- Distinzione esplicita: memoria/orchestrazione **vs** comando `finito` (chiusura ufficiale + doc ufficiali).

## Cosa è cambiato in `docs/orchestrator/`

- **README.md:** riscritto: obbligo post-intervento, micro-modifiche, doppia semantica «aggiornati», `finito`, commit selettivo senza monolite salvo richiesta, contenuto `inbox` se codice non committato.
- **chatgpt-checkpoint.md:** ordine di lettura GitHub, nota su `/tmp`, blocco «aggiornati» in Cursor, obbligo memoria, `finito`, link corretti a `../../.cursor/rules/...`.
- **latest.md:** aggiornato a questa sessione (sintesi).

## File **non** modificati (vincolo)

- `coordinate_converter Claude.html`
- `docs/roadmap.md`
- Nessun script, `package.json`, GitHub Actions, hook, n8n.

## Diff strutturale (estratto, regola 30)

La sezione precedente “memoria su richiesta / opzionale micro-task” è stata sostituita da obblighi e definizioni di cui sopra; stima: decine di righe rimpiazzate nella coda del file [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc).

## Prossimo passo operativo

- `git add` selettico su `docs/orchestrator/` e `.cursor/rules/30-output-workflow.mdc` (e eventuale push) oppure usare in chat **«aggiornati»** nel senso Cursor per allineare il repository remoto.

## Addendum (2026-04-29) — un file `inbox` per intervento, non per ogni micro-fix

Chiarimento vincolante:

- L’obbligo “ogni modifica aggiorna la memoria” **non** implica un **file** `inbox` **separato** per ogni micro-fix.
- Se **più** micro-fix fanno parte dello **stesso** intervento Cursor, è corretto **un solo** file in `docs/orchestrator/inbox/` (o l’**aggiornamento** del file già in uso per quell’intervento), con **tutte** le micro-modifiche elencate in modo **chiaro**.
- **Ogni** micro-modifica **va registrata** (nel testo); **non** ogni micro-modifica deve generare un **file** distinto.
- `docs/orchestrator/latest.md` = **breve**, **stato reale più recente**; evitare duplicazioni inutili rispetto a `inbox/`.
- Dettaglio completo (micro-fix, Plan, debug) = nel file `inbox` **dell’intervento**, con sezioni se servono; file `..._plan_...` / `..._debug_...` **separati** solo se migliorano la lettura, non per aggiungere file “per principio”.

*Stesso file di riepilogo ampliato, per evitare proliferazione di file non richiesti.*

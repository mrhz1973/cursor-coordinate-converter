# Memoria operativa (orchestratore ChatGPT)

Questa cartella è la **memoria operativa obbligatoria** per l’orchestratore **ChatGPT**, versionata nel repository: consente a ChatGPT di conoscere lo **stato del lavoro** (anche micro-modifiche) **prima** delle istruzioni successive. **Non** sostituisce roadmap, regole canoniche o documentazione ufficiale del progetto.

## Obblighi dopo ogni intervento operativo Cursor

Dopo **ogni** intervento Cursor che **modifica lo stato operativo** (codice, regole di progetto, o questa stessa memoria in modo che cambi ciò che ChatGPT deve assumere):

1. **Aggiornare** `docs/orchestrator/latest.md` (sintesi breve, sempre aggiornata).
2. **Creare o aggiornare** **un** file riepilogo in `docs/orchestrator/inbox/` per **quell’intervento** (tutte le micro-modifiche nello stesso file; **non** un file per micro-fix), come in [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc).
3. Eseguire **sempre** **commit e push selettivi** della **sola** memoria orchestratore (`docs/orchestrator/**`) e, se modificati **nello stesso intervento**, i file `.cursor/rules/**` pertinenti al workflow memoria/autosync. Questa sequenza è l’**autosync orchestratore** ed è **obbligatoria** — non opzionale, non “quando si vuole”, non sostituita dal solo comando «aggiornati».

**Il commit autosync non deve includere** `coordinate_converter Claude.html` **salvo richiesta esplicita** dell’utente. Se il monolite cambia ma resta fuori dal commit, l’`inbox` deve descrivere il cambiamento in modo sufficiente per l’orchestrazione.

**L’autosync orchestratore non equivale a `finito`:** non aggiorna `docs/checkpoint.md` né il log di sessione ufficiale salvo richiesta esplicita o comando **`finito`** (vedi [`.cursor/rules/00-project-core.mdc`](../../.cursor/rules/00-project-core.mdc)).

**`finito`** resta la **chiusura ufficiale completa** di sessione (doc ufficiali, git/push finali, criteri di workspace come da regole progetto).

**ChatGPT non si aggiorna da solo:** non legge GitHub in automatico. Per ora legge il repository **solo** quando l’utente scrive **«aggiornati»** nella **chat ChatGPT**. **Cursor** invece **pubblica sempre** la memoria orchestratore dopo ogni intervento operativo che cambia stato (autosync obbligatorio).

## Cosa **non** sostituisce

- **Non sostituisce** `docs/roadmap.md` né elenca ogni vincolo architetturale (per quello: roadmap e [`.cursor/rules/`](../../.cursor/rules/)).
- **Non sostituisce** l’aggiornamento ufficiale di `docs/checkpoint.md` e `docs/session-geolocalizzazione-e-mappa.md`, vincolati a trigger espliciti o al comando **`finito`**.

## `latest.md` (sintetico) vs `inbox/` (completo)

- **`docs/orchestrator/latest.md`** — sintesi breve ad ogni allineamento: stato reale più recente, prossimo passo, rimandi. Mai log lungo; evitare duplicazioni inutili con l’`inbox`.
- **`docs/orchestrator/inbox/`** — dettaglio completo per **l’intervento** corrente; **ogni** micro-modifica va **registrata**; **un intervento → un file** (o stesso file aggiornato per quell’intervento), **non** un file per ogni micro-fix.

Convenzione nomi: `YYYY-MM-DD_HHMM_<type>_<slug>.md` (template in `docs/orchestrator/templates/`). Niente file non richiesti dal lavoro.

## Comando **«aggiornati»** (due contesti)

- **In Cursor:** richiesta esplicita per **verificare** e **completare** allineamento + commit/push selettivo se un passaggio dell’autosync obbligatorio è saltato. **Non** sostituisce l’autosync post-intervento: dopo un intervento operativo l’autosync va eseguito **sempre** senza attendere «aggiornati».
- **In ChatGPT (orchestratore):** «aggiornati» = **lettura manuale** del repository (es. GitHub) solo in quel momento, partendo da `docs/orchestrator/latest.md`, poi [chatgpt-checkpoint.md](chatgpt-checkpoint.md), ecc. **Nessuna** lettura automatica del repo da parte di ChatGPT finché non si introduce esplicitamente altro (fuori scope: n8n, webhook, …).

I backup **`/tmp/...-goi-gis-riepilogo.md`** restano requisito locale oltre al repo, come in regola: non sostituiscono `inbox`/`latest` versionati.

## Commit selettivo e file applicativo

- Commit autosync = **solo** memoria orchestratore (+ regole `.cursor/` pertinenti se toccate nello stesso intervento). Monolite **fuori** salvo richiesta esplicita.
- Nessuno script, npm, azioni GitHub, hook, n8n in questa cartella per il workflow.

## Archive

La cartella `archive/` resta per rotazione o spostamenti manuali a filoni chiusi (opzionale).

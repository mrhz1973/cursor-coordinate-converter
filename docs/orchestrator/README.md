# Memoria operativa (orchestratore ChatGPT)

Questa cartella è la **memoria operativa obbligatoria** per l’orchestratore **ChatGPT**, versionata nel repository: consente a ChatGPT di conoscere lo **stato del lavoro** (anche micro-modifiche) **dopo** che l’utente ha chiesto la lettura con **«aggiornati»** in ChatGPT. **Non** sostituisce roadmap, regole canoniche o documentazione ufficiale del progetto.

**Cursor non “controlla” ChatGPT:** aggiorna e pubblica **solo** file e git in Cursor; **non** opera nella chat ChatGPT e **non** deve presumere che ChatGPT legga da solo.

## Obblighi dopo ogni intervento operativo Cursor

Dopo **ogni** intervento Cursor che **modifica lo stato operativo** (codice, regole di progetto, o questa stessa memoria orchestratore):

1. **Aggiornare** `docs/orchestrator/latest.md` (sintesi breve, sempre aggiornata).
2. **Creare o aggiornare** **un** file riepilogo in `docs/orchestrator/inbox/` per **quell’intervento** (tutte le micro-modifiche nello stesso file; **non** un file per micro-fix), come in [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc).
3. Eseguire **sempre** **commit e push selettivi** della **sola** memoria orchestratore (`docs/orchestrator/**`) e, se modificati **nello stesso intervento**, i file `.cursor/rules/**` pertinenti al workflow memoria/autosync. Questa sequenza è l’**autosync orchestratore** ed è **obbligatoria** — non opzionale, non “quando si vuole”, non sostituita dal solo comando «aggiornati».

**Il commit autosync non deve includere** `coordinate_converter Claude.html` **salvo richiesta esplicita** dell’utente. Se il monolite cambia ma resta fuori dal commit, l’`inbox` deve descrivere il cambiamento in modo sufficiente per l’orchestrazione.

**L’autosync orchestratore non equivale a `finito`:** non aggiorna `docs/checkpoint.md` né il log di sessione ufficiale salvo richiesta esplicita o comando **`finito`** (vedi [`.cursor/rules/00-project-core.mdc`](../../.cursor/rules/00-project-core.mdc)).

**`finito`** resta la **chiusura ufficiale completa** di sessione (doc ufficiali, git/push finali, criteri di workspace come da regole progetto).

**ChatGPT non si aggiorna da solo:** non legge GitHub in automatico; legge la memoria orchestratore **solo** quando l’utente scrive **«aggiornati»** nella **chat ChatGPT** (= *leggere* da GitHub). **Cursor**, dopo ogni intervento operativo che cambia stato, **pubblica sempre** la memoria (`latest.md`, `inbox`, commit/push selettivo) **senza** interagire con ChatGPT (= *pubblicare*; il comando **«aggiornati»** in Cursor ha la stessa semantica di pubblicazione, vedi regola 30).

## Cosa **non** sostituisce

- **Non sostituisce** `docs/roadmap.md` né elenca ogni vincolo architetturale (per quello: roadmap e [`.cursor/rules/`](../../.cursor/rules/)).
- **Non sostituisce** l’aggiornamento ufficiale di `docs/checkpoint.md` e `docs/session-geolocalizzazione-e-mappa.md`, vincolati a trigger espliciti o al comando **`finito`**.

## `latest.md` (sintetico) vs `inbox/` (completo)

- **`docs/orchestrator/latest.md`** — sintesi breve ad ogni allineamento: stato reale più recente, prossimo passo, rimandi. Mai log lungo; evitare duplicazioni inutili con l’`inbox`.
- **`docs/orchestrator/inbox/`** — dettaglio completo per **l’intervento** corrente; **ogni** micro-modifica va **registrata**; **un intervento → un file** (o stesso file aggiornato per quell’intervento), **non** un file per ogni micro-fix.

Convenzione nomi: `YYYY-MM-DD_HHMM_<type>_<slug>.md` (template in `docs/orchestrator/templates/`). Niente file non richiesti dal lavoro.

## Comando **«aggiornati»** (due contesti — **pubblicare** vs **leggere**)

- **«aggiornati» in Cursor:** **pubblica la memoria orchestratore** (allinea `latest.md` / `inbox` e `commit`/`push` selettivo della sola memoria + regole workflow pertinenti). **Non** sostituisce l’autosync obbligatorio di fine intervento, che pubblica comunque senza attendere il comando.
- **«aggiornati» in ChatGPT:** **leggi la memoria orchestratore da GitHub** (ordine in [chatgpt-checkpoint.md](chatgpt-checkpoint.md); ingresso tipico `docs/orchestrator/latest.md`). **Nessuna** lettura automatica; n8n/webhook restano fuori scope finché non introdotti esplicitamente.

I backup **`/tmp/...-goi-gis-riepilogo.md`** restano requisito locale oltre al repo, come in regola: non sostituiscono `inbox`/`latest` versionati.

## Commit selettivo e file applicativo

- Commit autosync = **solo** memoria orchestratore (+ regole `.cursor/` pertinenti se toccate nello stesso intervento). Monolite **fuori** salvo richiesta esplicita.
- Nessuno script, npm, azioni GitHub, hook, n8n in questa cartella per il workflow.

## Archive

La cartella `archive/` resta per rotazione o spostamenti manuali a filoni chiusi (opzionale).

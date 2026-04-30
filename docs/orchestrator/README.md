# Memoria operativa (orchestratore ChatGPT)

Questa cartella è la **memoria operativa obbligatoria** per l’orchestratore **ChatGPT**, versionata nel repository: consente a ChatGPT di conoscere lo **stato del lavoro** (anche micro-modifiche) **dopo** che l’utente ha chiesto la lettura con **`aggio`** / **«aggiornati»** in ChatGPT (**stesso comando**). **Non** sostituisce roadmap, regole canoniche o documentazione ufficiale del progetto.

**Cursor non “controlla” ChatGPT:** aggiorna e pubblica **solo** file e git in Cursor; **non** opera nella chat ChatGPT e **non** deve presumere che ChatGPT legga da solo.

## Obblighi dopo ogni intervento operativo Cursor

Dopo **ogni** intervento Cursor che **modifica lo stato operativo** (codice, regole di progetto, o questa stessa memoria orchestratore):

1. **Aggiornare** `docs/orchestrator/latest.md` (sintesi breve, sempre aggiornata).
2. **Creare o aggiornare** **un** file riepilogo in `docs/orchestrator/inbox/` per **quell’intervento** (tutte le micro-modifiche nello stesso file; **non** un file per micro-fix), come in [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc).
3. Eseguire **sempre** **commit e push selettivi** della **sola** memoria orchestratore (`docs/orchestrator/**`) e, se modificati **nello stesso intervento**, i file `.cursor/rules/**` pertinenti al workflow memoria/autosync. Questa sequenza è l’**autosync orchestratore** ed è **obbligatoria** — non opzionale, non “quando si vuole”, non sostituita dal solo comando **`aggio`** / **«aggiornati»**.

**Il commit autosync non deve includere** `coordinate_converter Claude.html` **salvo richiesta esplicita** dell’utente. Se il monolite cambia ma resta fuori dal commit, l’`inbox` deve descrivere il cambiamento in modo sufficiente per l’orchestrazione.

**L’autosync orchestratore non equivale a `finito`:** non aggiorna `docs/checkpoint.md` né il log di sessione ufficiale salvo richiesta esplicita o comando **`finito`** (vedi [`.cursor/rules/00-project-core.mdc`](../../.cursor/rules/00-project-core.mdc)).

**`finito`** resta la **chiusura ufficiale completa** di sessione (doc ufficiali, git/push finali, criteri di workspace come da regole progetto).

**ChatGPT non si aggiorna da solo:** non legge GitHub in automatico; legge la memoria orchestratore **solo** quando l’utente scrive **`aggio`** o **«aggiornati»** nella **chat ChatGPT** (= *leggere* da GitHub). **Cursor**, dopo ogni intervento operativo che cambia stato, **pubblica sempre** la memoria (`latest.md`, `inbox`, commit/push selettivo) **senza** interagire con ChatGPT (= *pubblicare*; **`aggio`** / **«aggiornati»** in Cursor ha la stessa semantica di pubblicazione, vedi regola 30).

## Regola “blocco completato” → memoria pubblicata (obbligatoria)

**Obiettivo:** quando l’utente scrive **`aggio`** / **«aggiornati»** in ChatGPT, ChatGPT deve poter capire l’ultimo lavoro completato **leggendo la memoria orchestratore** (senza dover scansionare il monolite).

Per **blocco completato** si intende, ad esempio:

- implementazione nel monolite;
- piano operativo importante (Plan) da condividere con l’orchestratore;
- modifica di rules;
- modifica documentale di workflow;
- correzione bug completata;
- QA concluso con esito riportabile.

**Regola:** un blocco è considerato “pubblicato all’orchestratore” **solo se** compare in:

1. `docs/orchestrator/latest.md` (sintesi breve), **e**
2. `docs/orchestrator/inbox/YYYY-MM-DD_HHMM_riepilogo_<slug>.md` (dettaglio intervento),
3. con commit/push selettivo della memoria.

Se un lavoro è completato ma **non** è registrato in `latest.md` + `inbox/`, per ChatGPT va trattato come **non pubblicato**.

## Plan mode e salvataggio piani

In **Plan mode** Cursor può produrre un piano utile **senza** poter (o dover) modificare file nel repository: il piano resta allora **solo nella chat** Cursor finché non viene materializzato sotto `docs/orchestrator/`.

Per i **piani importanti** (multi-step, decisioni d’impatto, da condividere con l’orchestratore dopo **`aggio`** / **«aggiornati»** in ChatGPT, o esplicitamente da versionare):

- Se Plan mode **non** scrive file in `docs/orchestrator/**`, la risposta Plan deve includere in coda la sezione obbligatoria **`PROMPT DI SALVATAGGIO PIANO — DA USARE IN AGENT MODE`** con un prompt **già pronto** da copiare in **Agent mode** (vedi [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc)).
- In **Agent mode**, quel prompt salva il piano in `docs/orchestrator/inbox/YYYY-MM-DD_HHMM_plan_<slug>.md`, aggiorna `docs/orchestrator/latest.md` e esegue l’**autosync** (commit/push selettivo della sola memoria orchestratore; monolite e doc ufficiali fuori scope salvo richiesta esplicita; **`finito`** separato).

Così i piani non si perdono tra chat Cursor e memoria che ChatGPT può leggere dopo pubblicazione e **`aggio`** / **«aggiornati»** in ChatGPT.

## Cosa **non** sostituisce

- **Non sostituisce** `docs/roadmap.md` né elenca ogni vincolo architetturale (per quello: roadmap e [`.cursor/rules/`](../../.cursor/rules/)).
- **Non sostituisce** l’aggiornamento ufficiale di `docs/checkpoint.md` e `docs/session-geolocalizzazione-e-mappa.md`, vincolati a trigger espliciti o al comando **`finito`**.

## `latest.md` (sintetico) vs `inbox/` (completo)

- **`docs/orchestrator/latest.md`** — sintesi breve ad ogni allineamento: stato reale più recente, prossimo passo, rimandi. Mai log lungo; evitare duplicazioni inutili con l’`inbox`.
- **`docs/orchestrator/inbox/`** — dettaglio completo per **l’intervento** corrente; **ogni** micro-modifica va **registrata**; **un intervento → un file** (o stesso file aggiornato per quell’intervento), **non** un file per ogni micro-fix.

Convenzione nomi: `YYYY-MM-DD_HHMM_<type>_<slug>.md` (template in `docs/orchestrator/templates/`). Niente file non richiesti dal lavoro.

## Comando **`aggio`** / **«aggiornati»** (due contesti — **pubblicare** vs **leggere**)

**Alias:** **`aggio`** = **«aggiornati»** (stesso significato ovunque nel workflow).

- **`aggio`** / **«aggiornati» in Cursor:** **pubblica la memoria orchestratore** (allinea `latest.md` / `inbox` e `commit`/`push` selettivo della sola memoria + regole workflow pertinenti). **Non** sostituisce l’autosync obbligatorio di fine intervento, che pubblica comunque senza attendere il comando.
- **`aggio`** / **«aggiornati» in ChatGPT:** **leggi la memoria orchestratore da GitHub** (ordine in [chatgpt-checkpoint.md](chatgpt-checkpoint.md); ingresso tipico `docs/orchestrator/latest.md`). **Nessuna** lettura automatica; n8n/webhook restano fuori scope finché non introdotti esplicitamente.

I backup **`/tmp/...-goi-gis-riepilogo.md`** restano requisito locale oltre al repo, come in regola: non sostituiscono `inbox`/`latest` versionati.

## Commit selettivo e file applicativo

- Commit autosync = **solo** memoria orchestratore (+ regole `.cursor/` pertinenti se toccate nello stesso intervento). Monolite **fuori** salvo richiesta esplicita.
- Nessuno script, npm, azioni GitHub, hook, n8n in questa cartella per il workflow.

## Archive

La cartella `archive/` resta per rotazione o spostamenti manuali a filoni chiusi (opzionale).

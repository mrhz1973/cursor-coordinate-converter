# Memoria operativa (orchestratore ChatGPT)

Questa cartella è la **memoria per l’orchestratore ChatGPT** versionata nel repository: allinea lo **stato del lavoro** a ciò che serve **prima** delle prossime istruzioni, **senza sostituire** roadmap, regole canoniche o documentazione ufficiale del progetto.

**ChatGPT deve poter conoscere anche le micro-modifiche** (mini-fix): l’orchestrazione evita di ripetere indicazioni stantie se la memoria è aggiornata dopo ogni intervento.

## Cosa **non** sostituisce

- **Non sostituisce** `docs/roadmap.md` né elenca in dettaglio ogni vincolo architetturale (per quello restano roadmap e [`.cursor/rules/`](../../.cursor/rules/)).
- **Non sostituisce** l’aggiornamento ufficiale di `docs/checkpoint.md` e del log `docs/session-geolocalizzazione-e-mappa.md`, che restano vincolati a trigger espliciti o al comando operativo `finito` (vedi [`.cursor/rules/00-project-core.mdc`](../../.cursor/rules/00-project-core.mdc)).

## `latest.md` (sintetico) vs `inbox/` (completo)

- **`docs/orchestrator/latest.md`** — **sintesi breve** ad ogni allineamento: **stato reale più recente** (dove siamo, prossimo passo, riferimenti). **Mai** un log lungo qui. **Evitare** duplicazioni inutili con l’`inbox` (in `latest` solo il necessario, il resto nel file sotto `inbox/`).
- **`docs/orchestrator/inbox/`** — **dettaglio completo** per **l’intervento** corrente; **ogni** micro-modifica va **registrata** (elenchi o sezioni), ma **non** implica un **file separato** per ogni micro-fix. Se più micro-fix fanno parte dello **stesso** intervento Cursor, **un solo** file `inbox` (o un unico file aggiornato per quell’intervento) basta, purché tutte le micro-modifiche siano elencate in modo **chiaro**. Piani (**Plan**), **debug** e testo pieno stanno di norma in **quello** stesso file con sezioni (`Piano`, `Debug`, `Micro-modifiche`, …), salvo usare un file `..._plan_...` / `..._debug_...` **solo** se separare migliora la lettura, **non** per proliferare file senza necessità.

Vedi convenzione nomi: `YYYY-MM-DD_HHMM_<type>_<slug>.md` (template in `docs/orchestrator/templates/`). **Niente** aggiunte di file non richieste dal lavoro.

**Obbligo (Cursor):** dopo **ogni** intervento che sposta lo stato, aggiorna `latest` e la memoria in `inbox` in coerenza con [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc). Il dettaglio in `inbox` per l’intervento **non** è opzionale; **non** è invece richiesto un file per ogni micro-fix: *un intervento → un file (o stesso file aggiornato) con tutte le micro-modifiche elencate*.

## Doppia semantica di **«aggiornati»**

- **In Cursor (sessione di lavoro):** allinea e **materializza** la memoria sotto `docs/orchestrator/**` allo stato reale, **e** (come da regole) **prepara o esegui** `git commit` / `git push` **selettivi** sui soli file necessari a rendere l’orchestrazione **leggibile** da altri (incluso ChatGPT) via GitHub, **con esclusione predefinita** di `coordinate_converter Claude.html` dai commit selettivi della **sola** memoria, **salvo** richiesta esplicita. Se l’utente committa solo i doc, l’`inbox` contiene l’essenziale su cosa è cambiato nel sorgente.
- **In ChatGPT (orchestratore),** con lo stesso token **«aggiornati»:** l’orchestratore **legge** il repo a partire da `docs/orchestrator/latest.md`, poi `docs/orchestrator/chatgpt-checkpoint.md`, poi se serve `docs/checkpoint.md`, poi file in `inbox/` a cura. Dettagli in [chatgpt-checkpoint.md](chatgpt-checkpoint.md).

I backup in **`/tmp/...-goi-gis-riepilogo.md` (e piani)** restano un **requisito** locale oltre al copy in repo, come in regola: non sostituiscono l’`inbox` su Git se si vuole continuità orchestrata.

## Distinzione: **aggiornati** vs **`finito`**

- **Memoria e sync orchestratore (`aggiornati` lato lavoro):** mantiene ChatGPT allineata allo stato corrente (anche mini-fix) tramite `docs/orchestrator/**` e push selettivo quando richiesto dal flusso in regola 30.
- **`finito`:** (sempre **minuscolo**, backtick) chiusura **ufficiale** con doc di checkpoint/log di sessione, policy git e spazio lavori come in [`.cursor/rules/00-project-core.mdc`](../../.cursor/rules/00-project-core.mdc) — processo distinto; non sostituito da un semplice aggiornamento inbox.

## Commit selettivo e file applicativo

- I commit per sola memoria **non** devono **includere** il monolite **salvo** esplicita richiesta utente. Se `coordinate_converter Claude.html` (o altro codice) **non** entra nel commit, l’`inbox` **deve** includere un estratto o una descrizione **sufficiente** a riprodurre in lettura l’intento e la natura del cambiamento.
- Niente script, npm, azioni GitHub, hook, n8n: convenzione solo documentata qui.

## Archive

La cartella `archive/` resta per rotazione o spostamenti manuali a filoni chiusi (opzionale).

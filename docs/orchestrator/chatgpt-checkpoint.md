# Checkpoint operativo per ChatGPT orchestratore

Riferimento stabile per **ChatGPT** in qualità di orchestratore sul progetto **APP GIS** (app single-file HTML, vanilla JavaScript, nessun build step). **Complementa** (non sostituisce) `docs/roadmap.md` e le regole sotto [`.cursor/rules/`](../../.cursor/rules/).

**Cursor non controlla ChatGPT:** non esegue nulla dentro la chat ChatGPT e non deve aspettarsi che tu legga il repo da solo. La pubblicazione della memoria è responsabilità **Cursor** (file + git); la lettura è responsabilità **tu + utente** quando scrive **«aggiornati»** qui.

## Lettura repository: **solo su comando manuale**

**ChatGPT non legge GitHub (o altro remoto) in automatico.** L’unico trigger previsto oggi: l’utente scrive **«aggiornati»** nella **chat ChatGPT** → in quel momento **leggi la memoria orchestratore da GitHub** (flusso sotto). Fino ad allora la tua conoscenza può restare arretrata rispetto al repository, anche se **Cursor** ha già **pubblicato** la memoria.

Automazioni future (n8n, webhook, polling, …) **non** sono parte di questo workflow finché non vengono introdotte esplicitamente nel progetto.

## Ruoli

- **ChatGPT (orchestrazione):** priorità, ordine di lavoro; per allinearti allo stato **corrente** sul repo devi **leggere** la memoria quando l’utente chiede «aggiornati» (ordine sotto). **Non** assumere di essere aggiornato senza quella lettura.
- **Cursor:** dopo **ogni intervento operativo** che cambia stato, esegue **sempre** l’**autosync orchestratore**: aggiorna `docs/orchestrator/latest.md`, crea/aggiorna **un** file in `docs/orchestrator/inbox/` per l’intervento, poi **commit e push selettivi** della sola memoria (e regole workflow se toccate nello stesso intervento), come in [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc). Su Git (es. GitHub) la memoria risulta così **pubblicata**; **non** implica che ChatGPT l’abbia già letta (nessuna lettura automatica). Se, **dopo** che l’utente ha chiesto «aggiornati» qui, `latest.md` risulta incoerente con il lavoro dichiarato, segnala **anomalia** lato pubblicazione Cursor, non normalità.

## Comando «aggiornati» — in ChatGPT (orchestratore)

Se l’utente scrive **«aggiornati»** (o equivalente) **in questa chat**, **leggi la memoria orchestratore da GitHub** (repository remoto usato dal team) in questo **ordine**:

1. `docs/orchestrator/latest.md` (ingresso; sintetico);
2. `docs/orchestrator/chatgpt-checkpoint.md` (questo file);
3. `docs/checkpoint.md` (snapshot ufficiale breve, se serve);
4. `docs/orchestrator/inbox/` **solo** se servono dettagli di un intervento.

**Se `latest.md` (o la memoria attesa) non rispecchia il lavoro recente**, trattalo come **anomalia del flusso autosync** in Cursor, non come stato desiderato: va segnalato e va ripristinato l’allineamento (in Cursor: intervento di recupero / «aggiornati» lato sessione secondo regole).

**Non** chiedere al team un riepilogo da file locali `/tmp/...-goi-gis-riepilogo.md` se il contenuto che ti serve (o l’equivalente) **è già** in `inbox/` o riassunto in `latest.md`. I path sotto `/tmp` sono backup **solo** sulla macchina locale.

### Piano prodotto in Cursor Plan mode ma non salvato in repo

Se l’utente dice che **Cursor ha prodotto solo un piano** (Plan mode) **senza** che sia comparso un file corrispondente in `docs/orchestrator/inbox/` (e senza che sia stato fatto push della memoria):

- Puoi chiedere di usare la sezione **`PROMPT DI SALVATAGGIO PIANO — DA USARE IN AGENT MODE`** dalla risposta Plan (se presente) e di incollarla in **Agent mode** in Cursor, così il piano viene scritto in `inbox/`, `latest.md` viene aggiornato e parte l’autosync memoria (vedi [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc) e [README orchestratore](README.md#plan-mode-e-salvataggio-piani)).

**Piani importanti** devono finire in `docs/orchestrator/inbox/` (tipicamente `YYYY-MM-DD_HHMM_plan_<slug>.md`) perché la memoria orchestratore sia **pubblicata** sul remoto.

**«aggiornati» in questa chat** legge solo ciò che è **stato pubblicato** sul repository remoto (dopo push). Se il piano **non** è su GitHub (o equivalente), **non** puoi leggerlo con «aggiornati»: non è un fallimento del comando, è assenza di artefatto versionato.

## Comando «aggiornati» — in Cursor (sessione) *(riferimento per ChatGPT)*

**In Cursor**, «aggiornati» significa **pubblicare la memoria orchestratore** (allinea `latest.md` / `inbox` e `commit`/`push` selettivo). **Non** sostituisce l’autosync obbligatorio di fine intervento. **Non** include per default `coordinate_converter Claude.html` nel commit autosync salvo richiesta esplicita. *(Questo paragrafo descrive il lavoro in Cursor; ChatGPT non lo esegue.)*

## Memoria `orchestrator` vs chiusura **`finito`**

- **Autosync / memoria `docs/orchestrator/`:** obbligatoria **lato Cursor** dopo ogni intervento operativo che cambia stato; `latest` breve; `inbox` = dettaglio per intervento (una unità può elencare molte micro-modifiche). **Non** equivale a chiusura ufficiale sessione. **Non** implica che ChatGPT abbia già “visto” il repo: vedi sopra (lettura **solo** su «aggiornati»).
- **`finito`:** comando operativo (sempre **minuscolo**, backtick) per **chiusura ufficiale** completa: `docs/checkpoint.md`, log di sessione, `git` e criteri di chiusura come in [`.cursor/rules/00-project-core.mdc`](../../.cursor/rules/00-project-core.mdc). **Separato** dall’autosync.

## Vincoli APP (reminder)

- Unico HTML canonico; JS vanilla; niente framework, TS, bundler, ESM, npm, senza vincolare oltre quanto in roadmap/notice.
- OPSEC, offline, geolocazione: come da regole esistenti.

## n8n / automazioni

Nessuna **automazione** requisita o introdotta in questa cartella per il workflow; eventuali strumenti esterni restano scelta esplicita separata.

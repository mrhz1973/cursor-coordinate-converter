# Checkpoint operativo per ChatGPT orchestratore

Riferimento stabile per **ChatGPT** in qualità di orchestratore sul progetto **APP GIS** (app single-file HTML, vanilla JavaScript, nessun build step). **Complementa** (non sostituisce) `docs/roadmap.md` e le regole sotto [`.cursor/rules/`](../../.cursor/rules/).

## Lettura repository: **solo su comando manuale**

**ChatGPT non legge GitHub (o altro remoto) in automatico.** Per ora l’unico trigger previsto è: l’utente scrive **«aggiornati»** nella **chat ChatGPT**. Fino a quel momento la tua conoscenza dello stato può restare arretrata rispetto al repository, anche se **Cursor** ha già pubblicato la memoria orchestratore.

Automazioni future (n8n, webhook, polling, …) **non** sono parte di questo workflow finché non vengono introdotte esplicitamente nel progetto.

## Ruoli

- **ChatGPT (orchestrazione):** priorità, ordine di lavoro; per allinearti allo stato **corrente** sul repo devi **leggere** la memoria quando l’utente chiede «aggiornati» (ordine sotto). **Non** assumere di essere aggiornato senza quella lettura.
- **Cursor:** dopo **ogni intervento operativo** che cambia stato, esegue **sempre** l’**autosync orchestratore**: aggiorna `docs/orchestrator/latest.md`, crea/aggiorna **un** file in `docs/orchestrator/inbox/` per l’intervento, poi **commit e push selettivi** della sola memoria (e regole workflow se toccate nello stesso intervento), come in [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc). **Aspettativa:** dopo ogni intervento operativo Cursor conforme, su Git (es. GitHub) la memoria orchestratore risulta **già pubblicata**; se su «aggiornati» trovi `latest.md` incoerente con il lavoro dichiarato, è **anomalia** del flusso Cursor, non normalità.

## Comando «aggiornati» — in ChatGPT (orchestratore)

Se l’utente scrive **«aggiornati»** (o equivalente), **leggi** il repository (es. su GitHub) in questo **ordine**:

1. `docs/orchestrator/latest.md` (ingresso; sintetico);
2. `docs/orchestrator/chatgpt-checkpoint.md` (questo file);
3. `docs/checkpoint.md` (snapshot ufficiale breve, se serve);
4. `docs/orchestrator/inbox/` **solo** se servono dettagli di un intervento.

**Se `latest.md` (o la memoria attesa) non rispecchia il lavoro recente**, trattalo come **anomalia del flusso autosync** in Cursor, non come stato desiderato: va segnalato e va ripristinato l’allineamento (in Cursor: intervento di recupero / «aggiornati» lato sessione secondo regole).

**Non** chiedere al team un riepilogo da file locali `/tmp/...-goi-gis-riepilogo.md` se il contenuto che ti serve (o l’equivalente) **è già** in `inbox/` o riassunto in `latest.md`. I path sotto `/tmp` sono backup **solo** sulla macchina locale.

## Comando «aggiornati» — in Cursor (sessione)

Verifica e, se necessario, **completa** allineamento `latest.md` / `inbox/` e **commit/push selettivo** della memoria. **Non** sostituisce l’autosync obbligatorio post-intervento. **Non** includere per default `coordinate_converter Claude.html` nel commit autosync salvo richiesta esplicita; se il codice non è nel commit, l’`inbox` deve contenere descrizione sufficiente del cambiamento.

## Memoria `orchestrator` vs chiusura **`finito`**

- **Autosync / memoria `docs/orchestrator/`:** obbligatoria **lato Cursor** dopo ogni intervento operativo che cambia stato; `latest` breve; `inbox` = dettaglio per intervento (una unità può elencare molte micro-modifiche). **Non** equivale a chiusura ufficiale sessione. **Non** implica che ChatGPT abbia già “visto” il repo: vedi sopra (lettura **solo** su «aggiornati»).
- **`finito`:** comando operativo (sempre **minuscolo**, backtick) per **chiusura ufficiale** completa: `docs/checkpoint.md`, log di sessione, `git` e criteri di chiusura come in [`.cursor/rules/00-project-core.mdc`](../../.cursor/rules/00-project-core.mdc). **Separato** dall’autosync.

## Vincoli APP (reminder)

- Unico HTML canonico; JS vanilla; niente framework, TS, bundler, ESM, npm, senza vincolare oltre quanto in roadmap/notice.
- OPSEC, offline, geolocazione: come da regole esistenti.

## n8n / automazioni

Nessuna **automazione** requisita o introdotta in questa cartella per il workflow; eventuali strumenti esterni restano scelta esplicita separata.

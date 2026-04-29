# Checkpoint operativo per ChatGPT orchestratore

Riferimento stabile per **ChatGPT** in qualità di orchestratore sul progetto **APP GIS** (app single-file HTML, vanilla JavaScript, nessun build step). **Complementa** (non sostituisce) `docs/roadmap.md` e le regole sotto [`.cursor/rules/`](../../.cursor/rules/).

## Ruoli

- **ChatGPT (orchestrazione):** priorità, ordine di lavoro, lettura dello stato; deve poter conoscere **anche le micro-modifiche** (mini-fix) prima del passo operativo **successivo**, altrimenti dà indicazioni stantie.
- **Cursor:** implementa e, **dopo ogni intervento** che sposta lo stato, **aggiorna** `docs/orchestrator/latest.md` (sintesi) e il **riepilogo in** `docs/orchestrator/inbox/` (dettaglio) come da [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc). Più **micro-fix** nello stesso intervento → in genere **un** file (o stesso file aggiornato) in `inbox/`, con **tutte** le micro-modifiche elencate, **non** un file per ogni riga; `latest` resta breve e rappresenta l’**ultimo** stato reale.

## Comando «aggiornati» — in ChatGPT (orchestratore)

Se l’utente scrive **«aggiornati»** (o equivalente), come orchestratore **leggi** il **repository** (p.es. su GitHub) in questo **ordine**:

1. `docs/orchestrator/latest.md` (ingresso; resta **sintetico**);
2. `docs/orchestrator/chatgpt-checkpoint.md` (questo file);
3. `docs/checkpoint.md` (snapshot ufficiale breve, se serve);
4. `docs/orchestrator/inbox/` **solo** se ti servono dettagli di un intervento (piani, debug, riepiloghi pieni).

**Non** richiedere al team un riepilogo da un file locale tipo `/tmp/...-goi-gis-riepilogo.md` se il contenuto che ti serve (o l’equivalente) **è già** in `inbox/` o è riassunto in `latest.md`. I path sotto `/tmp` sono backup **solo** sulla macchina locale.

## Comando «aggiornati» — in Cursor (sessione)

Significa: allinea la memoria sotto `docs/orchestrator/**` allo stato reale, **e** (come da regole di sessione) **prepara o esegui** commit e push **selettivi** dei file di memoria orchestrator (e, se in modifica per lo stesso lavoro, le regole `.cursor/` pertinenti) **necessari** a rendere su GitHub leggibile l’orchestrazione. **Non** includere per default `coordinate_converter Claude.html` in commit selettive della **sola** memoria orchestrator, **salvo** richiesta esplicita dell’utente; se il codice **non** va committato, il file in `inbox` deve contenere descrizione precisa del fix e/o un estratto sufficiente del diff, così ChatGPT resta informato (vedi [`.cursor/rules/30-output-workflow.mdc`](../../.cursor/rules/30-output-workflow.mdc)).

## Memoria `orchestrator` vs chiusura **`finito`**

- **Memoria `docs/orchestrator/`:** `latest` = breve, stato più recente; `inbox` = dettaglio pieno per **intervento** (una unità in `inbox` può contenere elenco di più micro-modifiche; **registrare ogni** micro-modifica **non** implica un file per micro-modifica), come in regola; **niente** duplicazioni inutili tra i due; la memoria per l’orchestrazione **non** riguarda “solo le patch grandi”.
- **`finito`:** comando operativo (sempre **minuscolo**, backtick) per la **chiusura ufficiale** di sessione: `docs/checkpoint.md`, log di sessione dove applica, operazioni `git` come in [`.cursor/rules/00-project-core.mdc`](../../.cursor/rules/00-project-core.mdc), push finale e criteri “workspace pulito” laddove regolamentati. **Non** mescolare: aggiornare l’inbox **non** chiude nello stesso modo ufficiale i doc di progetto.

## Vincoli APP (reminder)

- Unico HTML canonico; JS vanilla; niente framework, TS, bundler, ESM, npm, senza vincolare oltre quanto in roadmap/notice.
- OPSEC, offline, geolocazione: come da regole esistenti.

## n8n / automazioni

Nessuna **automazione** requisita o introdotta in questa cartella per il workflow; eventuali strumenti esterni restano scelta esplicita separata.

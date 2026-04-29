# Riepilogo operativo — workflow autosync obbligatorio

**Timestamp nome file:** 2026-04-29 17:15 (locale Cursor).

## Obiettivo

Rendere **vincolante** che, dopo **ogni** intervento Cursor **operativo** che cambia lo stato del lavoro, sia eseguito **sempre** l’**autosync orchestratore**: `latest.md` + `inbox/` + **commit/push selettivo** della sola memoria (e regole workflow se toccate nello stesso intervento), **senza** `finito`, **senza** monolite nel commit autosync salvo richiesta esplicita, **senza** aggiornare checkpoint/session salvo richiesta esplicita o `finito`.

## File modificati

- `.cursor/rules/30-output-workflow.mdc` — sezione rinominata/risritta (*Autosync orchestratore obbligatorio*); RIEPILOGO con campi autosync; rimosse formulazioni ambigue (“preparare o eseguire”, opzionalità push); `aggiornati` Cursor = recupero/verifica, non sostituto dell’autosync.
- `docs/orchestrator/README.md` — memoria obbligatoria, autosync dopo ogni intervento operativo, distinzione da `finito`.
- `docs/orchestrator/chatgpt-checkpoint.md` — attese ChatGPT su memoria già pubblicata; out-of-sync = problema flusso; `/tmp` non richiesto se coperto da repo.
- `docs/orchestrator/latest.md` — sintesi intervento workflow.
- `docs/orchestrator/inbox/2026-04-29_1715_riepilogo_workflow-autosync-obbligatorio.md` — questo file.

## Regola chiarita (sintesi)

1. Post-intervento operativo con cambio stato → **sempre** `latest.md` + **un** file `inbox` per intervento + **commit + push** selettivo memoria.  
2. **Mai** `coordinate_converter Claude.html` nel commit autosync salvo richiesta esplicita.  
3. **Mai** `finito` come parte dell’autosync.  
4. **Mai** `docs/checkpoint.md` / `docs/session-geolocalizzazione-e-mappa.md` nell’autosync salvo richiesta esplicita o `finito`.  
5. **`finito`** resta chiusura ufficiale completa (doc ufficiali, git finale, regole 00-project-core).

## Cosa non è stato toccato

- `coordinate_converter Claude.html`
- `docs/roadmap.md`
- `docs/checkpoint.md`
- `docs/session-geolocalizzazione-e-mappa.md`
- `package.json`, script, GitHub Actions, hook, n8n
- Altri path non elencati in «File modificati»

## Verifiche

- Nessun `node --check` (monolite invariato).
- Controllo manuale: patch limitata ai path consentiti.

## Stato Git (nota locale Cursor)

Prima dell’autosync di questo intervento: rilevare con `git status --short` / `git diff --stat` nella sessione; atteso eventuale `M` sul monolite **preesistente**, **non** causato da questa patch.

## Prossimo passo consigliato

- Applicare in sessioni successive l’autosync **sempre** in chiusura d’intervento operativo.  
- Riprendere lavoro funzionale sul monolite (es. Range Rings 5A smoke / commit HTML) secondo priorità utente; dettaglio feature precedente: `docs/orchestrator/inbox/2026-04-29_1612_riepilogo_rangerings_5A.md`.

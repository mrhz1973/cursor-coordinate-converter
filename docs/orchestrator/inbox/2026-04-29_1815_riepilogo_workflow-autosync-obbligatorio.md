# Riepilogo operativo — workflow autosync (Cursor automatico / ChatGPT manuale)

**Timestamp nome file:** 2026-04-29 18:15 (locale Cursor).

## Obiettivo

Rendere **vincolante** e **chiara** la distinzione:

- **Cursor:** dopo ogni intervento operativo che cambia stato, **sempre** autosync orchestratore (automatico in chiusura d’intervento: `latest.md`, **un** `inbox`, commit/push selettivo memoria).
- **ChatGPT:** **nessuna** lettura automatica del repository; legge GitHub **solo** quando l’utente scrive manualmente **«aggiornati»** nella chat ChatGPT. Automazioni (n8n, ecc.): **non** in questa patch.

## File modificati

- `.cursor/rules/30-output-workflow.mdc` — sezione *Cursor vs ChatGPT*; *Doppio significato «aggiornati»*; limiti espliciti su n8n/automazioni senza trigger manuale.
- `docs/orchestrator/README.md` — ChatGPT non auto-aggiornato; chiarimento «aggiornati» in ChatGPT = lettura manuale.
- `docs/orchestrator/chatgpt-checkpoint.md` — blocco *Lettura repository: solo su comando manuale*; ruoli e `finito` aggiornati.
- `docs/orchestrator/latest.md` — sintesi intervento.
- `docs/orchestrator/inbox/2026-04-29_1815_riepilogo_workflow-autosync-obbligatorio.md` — questo file.

## Regola chiarita (sintesi)

1. Post-intervento operativo Cursor → **sempre** `latest.md` + **un** file `inbox` per intervento + commit/push selettivo memoria (monolite escluso salvo richiesta esplicita; checkpoint/session esclusi salvo `finito` o richiesta esplicita; **non** `finito` come parte dell’autosync).
2. **ChatGPT** si allinea al repo **solo** su **«aggiornati»** manuale in chat ChatGPT.
3. **`finito`** = chiusura ufficiale completa, separata dall’autosync.

## Distinzione Cursor / ChatGPT

| Aspetto | Cursor | ChatGPT |
|--------|--------|---------|
| Aggiornamento memoria `docs/orchestrator/**` | Sì, **sempre** dopo intervento operativo | No in automatico |
| Pubblicazione (`commit`/`push` memoria) | Sì (autosync obbligatorio) | Non applicabile |
| Lettura repo / GitHub | N/A (lavora su file locali) | **Solo** su comando **«aggiornati»** dall’utente |

## Cosa non è stato toccato

- `coordinate_converter Claude.html`
- `docs/roadmap.md`, `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`
- `package.json`, script, GitHub Actions, hook, **implementazione** n8n (solo menzione negativa nelle regole)

## Verifiche

- Patch limitata ai path consentiti; nessun `node --check` sul monolite (invariato).

## Stato Git

Rilevare con `git status --short` / `git diff --stat` nella sessione Cursor (vedi QA Fase 6). Atteso eventuale monolite `M` da lavori precedenti, **non** da questa patch.

## Prossimo passo consigliato

- Applicare in sessioni Cursor: autosync **sempre** a fine intervento operativo.  
- In ChatGPT: usare **«aggiornati»** quando serve allineamento alla memoria pubblicata.

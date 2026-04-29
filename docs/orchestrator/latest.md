# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-29 — **Workflow autosync:** reso **obbligatorio** l’autosync orchestratore dopo **ogni** intervento operativo che cambia stato (`latest.md` + **un** `inbox/` per intervento + **commit e push selettivi**). Il commit autosync riguarda **solo** `docs/orchestrator/**` e, se modificati nello stesso intervento, `.cursor/rules/**` pertinenti al workflow memoria. **`coordinate_converter Claude.html` non entra** nel commit autosync salvo richiesta esplicita. **`finito`** resta chiusura ufficiale completa (checkpoint/session/git come da regole progetto), **separato** dall’autosync. Dettaglio: `docs/orchestrator/inbox/2026-04-29_1715_riepilogo_workflow-autosync-obbligatorio.md`.

## Ultimo intervento Cursor

Solo documentazione/regole orchestratore: obbligo autosync, RIEPILOGO con campi esito autosync, chiarimenti README e `chatgpt-checkpoint.md`.

## File modificati (sintesi)

- `.cursor/rules/30-output-workflow.mdc`
- `docs/orchestrator/README.md`
- `docs/orchestrator/chatgpt-checkpoint.md`
- `docs/orchestrator/latest.md` (questo)
- `docs/orchestrator/inbox/2026-04-29_1715_riepilogo_workflow-autosync-obbligatorio.md`

**Non toccati:** `coordinate_converter Claude.html`, `docs/roadmap.md`, `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, script, npm, GitHub Actions, hook, n8n.

## Stato verifiche

- Monolite non modificato da questo intervento (controllo percorso).

## Stato Git noto

Verificare in Cursor con `git status --short` (eventuale monolite modificato da sessioni precedenti resta fuori dall’autosync di questo intervento).

## Prossimo passo consigliato

In ogni intervento operativo successivo: chiudere **sempre** con autosync orchestratore. Lavoro applicativo precedente (es. Range Rings 5A): smoke / commit monolite a cura utente; riepilogo feature: `docs/orchestrator/inbox/2026-04-29_1612_riepilogo_rangerings_5A.md`.

## Dettagli

- Workflow autosync: `docs/orchestrator/inbox/2026-04-29_1715_riepilogo_workflow-autosync-obbligatorio.md`
- Range Rings 5A (feature): `docs/orchestrator/inbox/2026-04-29_1612_riepilogo_rangerings_5A.md`

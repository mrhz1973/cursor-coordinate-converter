# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-29 — **Workflow memoria:** l’**autosync orchestratore resta obbligatorio lato Cursor** dopo ogni intervento operativo (`latest.md` + **un** `inbox/` + commit/push selettivi di `docs/orchestrator/**` e `.cursor/rules/**` workflow se toccati). **ChatGPT** invece **non** legge il repo in automatico: legge GitHub **solo** quando l’utente scrive **«aggiornati»** nella chat ChatGPT (n8n/automazioni: fuori da questa iterazione). Monolite **fuori** dal commit autosync salvo richiesta esplicita; **`finito`** resta chiusura ufficiale separata. Dettaglio: `docs/orchestrator/inbox/2026-04-29_1815_riepilogo_workflow-autosync-obbligatorio.md`.

## Ultimo intervento Cursor

Documentazione workflow: distinzione **Cursor = pubblicazione sempre** vs **ChatGPT = lettura manuale su «aggiornati»**; chiarimenti in regola 30, README e `chatgpt-checkpoint.md`.

## File modificati (sintesi)

- `.cursor/rules/30-output-workflow.mdc`
- `docs/orchestrator/README.md`
- `docs/orchestrator/chatgpt-checkpoint.md`
- `docs/orchestrator/latest.md` (questo)
- `docs/orchestrator/inbox/2026-04-29_1815_riepilogo_workflow-autosync-obbligatorio.md`

**Non toccati:** `coordinate_converter Claude.html`, `docs/roadmap.md`, `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, script, npm, GitHub Actions, hook, n8n.

## Stato verifiche

- Monolite non modificato da questo intervento.

## Stato Git noto

Verificare in Cursor con `git status --short`.

## Prossimo passo consigliato

Continuare lavoro applicativo/monolite secondo priorità utente; per allineare ChatGPT: **«aggiornati»** nella chat ChatGPT dopo che Cursor ha pubblicato la memoria.

## Dettagli

- Intervento workflow (Cursor vs ChatGPT): `docs/orchestrator/inbox/2026-04-29_1815_riepilogo_workflow-autosync-obbligatorio.md`
- Iterazione precedente (solo obbligo autosync): `docs/orchestrator/inbox/2026-04-29_1715_riepilogo_workflow-autosync-obbligatorio.md`
- Range Rings 5A (feature): `docs/orchestrator/inbox/2026-04-29_1612_riepilogo_rangerings_5A.md`

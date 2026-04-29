# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-29 — **Terminologia workflow:** chiarito che **Cursor non controlla ChatGPT** e non opera nella chat ChatGPT. **«aggiornati» in Cursor** = **pubblicare** la memoria orchestratore (`latest.md`, `inbox`, commit/push selettivo memoria + regole workflow pertinenti). **«aggiornati» in ChatGPT** = **leggere** la memoria da GitHub, solo su comando utente. **Cursor** pubblica sempre dopo intervento operativo; **ChatGPT** non legge da solo. **`finito`** resta chiusura ufficiale separata. Dettaglio: `docs/orchestrator/inbox/2026-04-29_1830_riepilogo_workflow-terminologia-aggiornati.md`.

## Ultimo intervento Cursor

Solo testi workflow: sezione *nessun controllo incrociato*, doppio significato «aggiornati» (pubblicare vs leggere), README e checkpoint allineati.

## File modificati (sintesi)

- `.cursor/rules/30-output-workflow.mdc`
- `docs/orchestrator/README.md`
- `docs/orchestrator/chatgpt-checkpoint.md`
- `docs/orchestrator/latest.md` (questo)
- `docs/orchestrator/inbox/2026-04-29_1830_riepilogo_workflow-terminologia-aggiornati.md`

**Non toccati:** `coordinate_converter Claude.html`, `docs/roadmap.md`, `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, script, npm, GitHub Actions, hook, n8n.

## Stato verifiche

- Monolite non modificato da questo intervento.

## Stato Git noto

`git status --short` in Cursor.

## Prossimo passo consigliato

Autosync invariato a fine interventi operativi; in ChatGPT usare **«aggiornati»** solo quando serve **leggere** la memoria già **pubblicata** da Cursor.

## Dettagli

- Terminologia: `docs/orchestrator/inbox/2026-04-29_1830_riepilogo_workflow-terminologia-aggiornati.md`
- Workflow precedente: `docs/orchestrator/inbox/2026-04-29_1815_riepilogo_workflow-autosync-obbligatorio.md`
- Range Rings 5A: `docs/orchestrator/inbox/2026-04-29_1612_riepilogo_rangerings_5A.md`

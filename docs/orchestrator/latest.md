> **AUTOSYNC NON AUTORITATIVO.**  
> Questo file resta un riepilogo autosync, ma non è la memoria corrente del GIS.  
> Dopo il flip rules di Fase 3, per lo stato corrente leggere `README.md`, [`docs/OPERATING_MEMORY.md`](../OPERATING_MEMORY.md) e la WU corrente.  
> Non usare questo file come current-state primario.

# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-08-13 — **`D-FLIGHT-H-AUTOLOAD-UX-A-FIX2 QA OPERATORE FAIL — DIAG REQUIRED`**. Runtime live `2124d25` / build **173**; Automated Browser QA precedente PASS, ma QA umana ha rilevato: caricamento percepito ~1 min da misurare, legenda ATM09 espansa senza contenuto visibile, tooltip zona presente ma click dettagli non operativo, pannello/modale non modificabile da riconciliare con scope. **No finito / no PASS operatore.** Decisione operatore: **OPSEC non va più incluso nella QA umana**; resta gate tecnico automatizzato. Rule: `.cursor/rules/32-qa-human-no-opsec.mdc`. Dettaglio: [`docs/orchestrator/inbox/2026-08-13_1142_qa-human-no-opsec-and-dflight-h-operator-findings.md`](inbox/2026-08-13_1142_qa-human-no-opsec-and-dflight-h-operator-findings.md). NEXT: diagnosi mirata H/ATM09/interazioni, senza patch preventiva.

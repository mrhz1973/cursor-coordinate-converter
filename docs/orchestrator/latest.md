> **AUTOSYNC NON AUTORITATIVO.**  
> Questo file resta un riepilogo autosync, ma non è la memoria corrente del GIS.  
> Dopo il flip rules di Fase 3, per lo stato corrente leggere `README.md`, [`docs/OPERATING_MEMORY.md`](../OPERATING_MEMORY.md) e la WU corrente.  
> Non usare questo file come current-state primario.

# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-08-13 — **`D-FLIGHT-H-AUTOLOAD-UX-A-FIX4 AUTOMATED BROWSER QA FAIL — DIAG REQUIRED`**. Deploy GIS-only PASS su tip `1be9359` (monolite blob = candidate `6780c8b` / build **175**). Helper **0.1.3** PID `2645184` non toccato. Automated Browser QA: casi 1–4 PASS (D3/D4 retest), **Caso 5 FAIL** (`http://example.test:8010/atm09/legend.png` + handlers legend mutati durante selfTest su stato live con legenda aperta). Caso 6 reopen OK al retest; D1 misura-only (~7.6 MB). **NO patch / no QA operatore / no finito.** Dettaglio: [`docs/orchestrator/inbox/2026-08-13_1252_riepilogo_d-flight-h-autoload-ux-a-fix4-deploy-qa.md`](inbox/2026-08-13_1252_riepilogo_d-flight-h-autoload-ux-a-fix4-deploy-qa.md). NEXT: DIAG + FIX5 isolation live-state (toggle legend / EnsureLegend during H override).

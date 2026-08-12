> **AUTOSYNC NON AUTORITATIVO.**  
> Questo file resta un riepilogo autosync, ma non è la memoria corrente del GIS.  
> Dopo il flip rules di Fase 3, per lo stato corrente leggere `README.md`, [`docs/OPERATING_MEMORY.md`](../OPERATING_MEMORY.md) e la WU corrente.  
> Non usare questo file come current-state primario.

# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-08-12 — **`D-FLIGHT-F-FIX1` DEPLOY VPS DONE / AUTOMATED BROWSER QA FAIL (ACL)**. FULL SHA live **`ddce4345ace35056217e0846067e3dd7447961a6`** (build **162** / `D-FLIGHT-F-FIX1`). Helper **0.1.2** + CORS allowlist `http://100.114.7.53:8000` + LKG invariato. Browser QA bloccata: Tailscale ACL non concede **`tcp:8010`** (pattern già noto 2026-06-13 per `:8000`). **No** QA operatore. **No** `finito`. Dettaglio: [`docs/orchestrator/inbox/2026-08-12_1318_riepilogo_d-flight-f-fix1-deploy-browser-qa-fail-acl.md`](inbox/2026-08-12_1318_riepilogo_d-flight-f-fix1-deploy-browser-qa-fail-acl.md). NEXT: grant ACL additivo `tcp:8010` verso `100.114.7.53` → rieseguire Automated Browser QA.

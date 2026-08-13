> **AUTOSYNC NON AUTORITATIVO.**  
> Questo file resta un riepilogo autosync, ma non è la memoria corrente del GIS.  
> Dopo il flip rules di Fase 3, per lo stato corrente leggere `README.md`, [`docs/OPERATING_MEMORY.md`](../OPERATING_MEMORY.md) e la WU corrente.  
> Non usare questo file come current-state primario.

# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-08-13 — **`QA D-FLIGHT-F-ATM09-ARCH-A-FIX2 FAIL operatore`** — diagnosi LIVE.  
**Root cause:** helper produzione **0.1.2** senza route `/atm09/*` → browser riceve **404** JSON; `ready=false`; NFZ resta (fail-closed corretto).  
Monolite FIX2/170 funziona; **manca deploy helper 0.1.3** (ATM09 mai andato in prod).  
**Nessuna patch / nessun redeploy** in questo step.

Dettaglio: [`docs/orchestrator/inbox/2026-08-13_0218_diag_d-flight-f-atm09-arch-a-fix2-qa-fail.md`](inbox/2026-08-13_0218_diag_d-flight-f-atm09-arch-a-fix2-qa-fail.md).

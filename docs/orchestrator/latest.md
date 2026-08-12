> **AUTOSYNC NON AUTORITATIVO.**  
> Questo file resta un riepilogo autosync, ma non è la memoria corrente del GIS.  
> Dopo il flip rules di Fase 3, per lo stato corrente leggere `README.md`, [`docs/OPERATING_MEMORY.md`](../OPERATING_MEMORY.md) e la WU corrente.  
> Non usare questo file come current-state primario.

# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-08-12 — **`D-FLIGHT-F` ACL RE-CHECK: STILL BLOCKED**. Deploy tecnico FIX1 resta PASS (GIS `ddce434` / build **162**; helper **0.1.2**; LKG 849 invariato). Client: `:8000` OK, `:8010` **TcpTestSucceeded=False** + curl timeout nonostante grant dichiarato. Browser QA **non rieseguita**. **No** finito. Dettaglio: [`docs/orchestrator/inbox/2026-08-12_1327_riepilogo_d-flight-f-acl-still-blocked.md`](inbox/2026-08-12_1327_riepilogo_d-flight-f-acl-still-blocked.md). NEXT: verificare policy Tailscale effettivamente salvata/propagata (`tcp:8010` su `100.114.7.53/32`, stesso scope di `tcp:8000`) → retry reachability → Automated Browser QA.

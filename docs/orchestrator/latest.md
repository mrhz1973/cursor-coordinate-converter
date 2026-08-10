> **AUTOSYNC NON AUTORITATIVO.**  
> Questo file resta un riepilogo autosync, ma non è la memoria corrente del GIS.  
> Dopo il flip rules di Fase 3, per lo stato corrente leggere `README.md`, [`docs/OPERATING_MEMORY.md`](../OPERATING_MEMORY.md) e la WU corrente.  
> Non usare questo file come current-state primario.

# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-08-11 — **CARTO-IGM-SERIES-EXPAND-A-UX3-FIX2 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED**. RUNTIME_COMMIT **`cb2a38b447f27c2e93b1c9c01ddd38785d31393b`** (`fix(carto): eliminate startup flash and top-align IGM panel`; build **149**). Pre-paint `body.gis-boot` (CSS mirror landing hide + show `#gisMapMount`); `gisInit` rimuove `gis-boot` dopo `body.gis-mode`. Pannello IGM: top = `header.getBoundingClientRect().bottom + 10px` se `!touched` (sempre, non solo >40% vh). Height 0.78/720 invariati. Payload **8204** invariato. Deploy **NOT EXECUTED**. Inbox: `docs/orchestrator/inbox/2026-08-11_0033_carto_igm_series_expand_a_ux3_fix2.md`.

2026-08-11 — UX3-FIX1 runtime `02c7b99` deploy tecnico PASS (tip `f35075b`).

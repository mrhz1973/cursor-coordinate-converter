> **AUTOSYNC NON AUTORITATIVO.**  
> Questo file resta un riepilogo autosync, ma non è la memoria corrente del GIS.  
> Dopo il flip rules di Fase 3, per lo stato corrente leggere `README.md`, [`docs/OPERATING_MEMORY.md`](../OPERATING_MEMORY.md) e la WU corrente.  
> Non usare questo file come current-state primario.

# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-08-11 — **CARTO-IGM-SERIES-EXPAND-A-UX3-FIX1 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED**. RUNTIME_COMMIT **`02c7b99bd282df4723ecd879b75c655874327dc1`** (`fix(carto): clear stale IGM results with no active series`; build **148**). Solo ramo zero-serie di `onFilter()`: svuota risultati/impronte stale preservando `queryBbox`/`selectedArea`/`areaMode`; notice needOneSeries; nessun clear helper che azzera la query; riattivazione serie → `cartoUiRunSearch()`. Payload **8204** invariato. Deploy **NOT EXECUTED**. Inbox: `docs/orchestrator/inbox/2026-08-11_0003_carto_igm_series_expand_a_ux3_fix1.md`.

2026-08-10 — UX3 runtime `9588e6c` (auto-refresh / startup mappa / layout pannello) review pending.

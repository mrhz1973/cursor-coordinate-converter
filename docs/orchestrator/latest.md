> **AUTOSYNC NON AUTORITATIVO.**  
> Questo file resta un riepilogo autosync, ma non è la memoria corrente del GIS.  
> Dopo il flip rules di Fase 3, per lo stato corrente leggere `README.md`, [`docs/OPERATING_MEMORY.md`](../OPERATING_MEMORY.md) e la WU corrente.  
> Non usare questo file come current-state primario.

# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-08-10 — **CARTO-IGM-SERIES-EXPAND-A-UX3 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED**. RUNTIME_COMMIT **`9588e6cdeca743afed3dad0358984a5af637e9a1`** (`fix(carto): streamline IGM filters and panel opening`; build **147**). Solo polish UI: startup view = MAPPA (forza `state.gisMode=true`); auto-refresh filtri serie e "Mostra tutte le impronte"; rimozione "Cancella risultati" dalla UI GIS; rename "Usa vista corrente" → "Aggiorna vista corrente"; tooltip IT su pickArea/useView/filtri/showAll; geometria pannello IGM più alto (frac 0.78, cap 720) + reset top se apre oltre 40% viewport; first-open senza query auto-cattura vista. Payload **8204** invariato. Deploy **NOT EXECUTED**. Inbox: `docs/orchestrator/inbox/2026-08-10_2353_carto_igm_series_expand_a_ux3.md`.

2026-08-10 — UX2 runtime `ebc6752` (label contrast) deploy tecnico PASS.

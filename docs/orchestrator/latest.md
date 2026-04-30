# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-29 — **Misura M1 + M3 leggero (implementato):** chiarito stato transient vs preferenze (`saveStore.settings`: `mapMeasureUnit`, `mapMeasureKind`, `mapPolyClosed`, `gisMeasureFlow`); caricamento sicuro di `gisMeasureFlow` al load; geometrie misura mai nel payload; `#measOperativeNotices` con helper (`measClearMsgs`, `measShowInfo`/`measShowError`, `measSyncOperativeInfo`), Esc GIS che azzera vertici + messaggio, errori input direct/inverse; rimosso reset di `gisMeasureFlow` in `gisExitMeasureTabPartial` così la preferenza UX resta persistita. Dettaglio in **`docs/orchestrator/inbox/2026-04-29_1600_riepilogo_measure-M1-M3-state-notices.md`**.

## Ultimo intervento Cursor

Implementazione monolite **Misura** (M1+M3 leggero), memoria orchestratore aggiornata. **Nessun** `finito`.

## File modificati (sintesi)

- `coordinate_converter Claude.html`
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-29_1600_riepilogo_measure-M1-M3-state-notices.md`

## Prossimo passo consigliato

Blocchi successivi piano Misura (M2 redesign drawer se previsto, M4 storico, M5 export, M6 polish overlay) salvo nuove priorità.

## Dettagli (inbox)

- Riepilogo M1+M3: `docs/orchestrator/inbox/2026-04-29_1600_riepilogo_measure-M1-M3-state-notices.md`
- Piano Misura (riferimento): `docs/orchestrator/inbox/2026-04-30_2345_plan_measure-tool-standardization.md`

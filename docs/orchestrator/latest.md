# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-30 — **DEBUG Range Rings (loop):** aggiunta strumentazione ingest **bf0d51-loop** (H1–H4: `ResizeObserver` #miniMap, `renderMiniMap`, `refreshRangeRingsAfterStateChange`, `renderRangeRingsPanel`) con stack sintetici e contatori azzerati all’apertura pannello. Dettaglio in **`docs/orchestrator/inbox/2026-04-30_1830_riepilogo_rr-loop-hypothesis-instrumentation.md`**. Fix **non** applicato: in attesa analisi NDJSON post-riproduzione.

## Ultimo intervento Cursor

Strumentazione ingest loop RR (H1–H4); memoria orchestratore aggiornata. **Nessun** `finito`. Il monolite **non** è nel commit autosync.

## File modificati (sintesi)

- `coordinate_converter Claude.html` (locale, non committato in autosync)
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-30_1830_riepilogo_rr-loop-hypothesis-instrumentation.md`

## Prossimo passo consigliato

Leggere `.cursor/debug-bf0d51.log` dopo riproduzione: correlare sequenza H1→H2 con H3/H4; poi patch mirata (niente `setTimeout` come fix).

## Dettagli (inbox)

- Misura M6 overlay polish: `docs/orchestrator/inbox/2026-04-30_1428_riepilogo_measure-M6-overlay-polish.md`
- Bugfix reset dati locali (modal stuck): `docs/orchestrator/inbox/2026-04-30_1637_riepilogo_bugfix-reset-local-data-modal-stuck.md`
- RR debug perf: `docs/orchestrator/inbox/2026-04-30_1745_riepilogo_rr-debug-perf-instrumentation.md`
- RR loop ingest H1–H4: `docs/orchestrator/inbox/2026-04-30_1830_riepilogo_rr-loop-hypothesis-instrumentation.md`

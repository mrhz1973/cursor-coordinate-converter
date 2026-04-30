# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-30 — **DEBUG Range Rings (performance):** aggiunta strumentazione temporanea `RR_DEBUG_PERF` nel monolite (`console.log` + contatori `ensure*Wired` / picker / overlay + ingest NDJSON su apertura pannello e overlay). Obiettivo: evidenze runtime su freeze 3–4 s e mappa “vuota” durante l’apertura. Dettaglio in **`docs/orchestrator/inbox/2026-04-30_1745_riepilogo_rr-debug-perf-instrumentation.md`**. Fix prestazioni **non** ancora applicato (in attesa log).

## Ultimo intervento Cursor

Strumentazione DEBUG solo Range Rings (monolite locale); memoria orchestratore aggiornata. **Nessun** `finito`. Il monolite **non** è nel commit autosync.

## File modificati (sintesi)

- `coordinate_converter Claude.html` (locale, non committato in autosync)
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-30_1745_riepilogo_rr-debug-perf-instrumentation.md`

## Prossimo passo consigliato

Raccogliere log console / ingest dopo riproduzione apertura Range Rings; classificare ipotesi (overlay+vincenty vs tabella+i18n vs `renderTileMap` durante open); poi max 3 patch ordinate per rischio.

## Dettagli (inbox)

- Misura M6 overlay polish: `docs/orchestrator/inbox/2026-04-30_1428_riepilogo_measure-M6-overlay-polish.md`
- Bugfix reset dati locali (modal stuck): `docs/orchestrator/inbox/2026-04-30_1637_riepilogo_bugfix-reset-local-data-modal-stuck.md`
- RR debug perf: `docs/orchestrator/inbox/2026-04-30_1745_riepilogo_rr-debug-perf-instrumentation.md`

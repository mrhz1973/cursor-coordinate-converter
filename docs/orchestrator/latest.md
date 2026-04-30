# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-30 — **FIX Range Rings (loop infinito):** evidenza ingest: `renderRangeRingsList` (vuota) ↔ `rrCancelPendingRename` ↔ `renderRangeRingsList` perché `rrCancelPendingRename` chiamava sempre `renderRangeRingsList()` anche senza rename pendente. Corretto: refresh lista solo se `p` truthy. Dettaglio **`docs/orchestrator/inbox/2026-04-30_1900_riepilogo_rr-infinite-loop-rename-cancel.md`**. Strumentazione **bf0d51-loop** ancora presente per verifica post-fix.

## Ultimo intervento Cursor

Fix loop RR (`rrCancelPendingRename`); memoria orchestratore aggiornata. **Nessun** `finito`. Il monolite **non** è nel commit autosync.

## File modificati (sintesi)

- `coordinate_converter Claude.html` (locale, non committato in autosync)
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-30_1830_riepilogo_rr-loop-hypothesis-instrumentation.md`
- `docs/orchestrator/inbox/2026-04-30_1900_riepilogo_rr-infinite-loop-rename-cancel.md`

## Prossimo passo consigliato

Verifica post-fix: aprire RR con 0 set — niente storm `renderMiniMap` / `listCalls` in crescita; log ingest opzionale. Rimuovere regioni `bf0d51-loop` dopo conferma utente.

## Dettagli (inbox)

- Misura M6 overlay polish: `docs/orchestrator/inbox/2026-04-30_1428_riepilogo_measure-M6-overlay-polish.md`
- Bugfix reset dati locali (modal stuck): `docs/orchestrator/inbox/2026-04-30_1637_riepilogo_bugfix-reset-local-data-modal-stuck.md`
- RR debug perf: `docs/orchestrator/inbox/2026-04-30_1745_riepilogo_rr-debug-perf-instrumentation.md`
- RR loop ingest H1–H4: `docs/orchestrator/inbox/2026-04-30_1830_riepilogo_rr-loop-hypothesis-instrumentation.md`
- RR fix loop rename-cancel: `docs/orchestrator/inbox/2026-04-30_1900_riepilogo_rr-infinite-loop-rename-cancel.md`

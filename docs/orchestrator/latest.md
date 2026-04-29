# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-29 — **Range Rings 5B:** pick centro su mappa (`state.rangeRingsPickCenterMode`, `_rangeRingsMapPickCenter`), pulsante + stato in pannello, opzione `picked` in `rrCenterMode`, integrazione `attachPanHandlers` / `mapClientToLatLonMap`, mutua esclusività con track/waypoint/map pick, Esc e chiusura pannello, i18n IT/EN/FR. Dettaglio: `docs/orchestrator/inbox/2026-04-29_2045_riepilogo_range-rings-5B-pick-centro-mappa.md`.

## Ultimo intervento Cursor

Monolite: Range Rings — scelta centro con click mappa (senza auto-creazione anelli); memoria orchestratore aggiornata (solo `docs/orchestrator/**` in commit autosync).

## File modificati (sintesi)

- `coordinate_converter Claude.html` (working tree; **non** nel commit autosync)
- `docs/orchestrator/latest.md` (questo)
- `docs/orchestrator/inbox/2026-04-29_2045_riepilogo_range-rings-5B-pick-centro-mappa.md`

**Non toccati:** `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/roadmap.md`, `.cursor/rules` (questo batch).

## Stato verifiche

- `git diff --check` monolite; `node --check` su JS inline estratto: ok (vedi inbox per contesto).

## Stato Git noto

Monolite modificato localmente; autosync memoria: commit **solo** `docs/orchestrator/**` (senza monolite).

## Prossimo passo consigliato

Test browser (desktop/touch) sul flusso pick + creazione anelli; commit monolite su richiesta utente.

## Dettagli

- 5B: `docs/orchestrator/inbox/2026-04-29_2045_riepilogo_range-rings-5B-pick-centro-mappa.md`
- 5A-ter: `docs/orchestrator/inbox/2026-04-29_1935_riepilogo_range-rings-5A-ter-resize-floating.md`
- 5A-bis: `docs/orchestrator/inbox/2026-04-29_1905_riepilogo_range-rings-5A-bis-floating.md`
- 5A: `docs/orchestrator/inbox/2026-04-29_1612_riepilogo_rangerings_5A.md`

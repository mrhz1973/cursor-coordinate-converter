# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-29 — **Range Rings (monolite, non in commit selettico):** pass “UI standard” su `#sec-rangerings`: tabella con colonne ridimensionabili (stato su `#rrList`, pattern come tracce/Aree offline), 5 nuovi gruppi di preset distanze + i18n, layout map-first con “Punto sulla mappa” in evidenza (`rrPickMapBtn` primary, hint `rrMapFirstHint`, default centro `picked`). 5D label SVG invariata. **Non** implementati 5E/5F. Dettaglio: `docs/orchestrator/inbox/2026-04-29_2520_riepilogo_range-rings-ui-standard-pass.md`.

## Ultimo intervento Cursor

Modifica a `coordinate_converter Claude.html` + memoria orchestratore. **Nessun** `finito`. Monolite **non** incluso nel commit selettico orchestratore salvo richiesta esplicita.

## File modificati (sintesi)

- `coordinate_converter Claude.html` (locale: resize RR, HTML preset/map-first, i18n, `ensureRangeRingsTableColResizeWired`)
- `docs/orchestrator/latest.md`, `inbox/2026-04-29_2520_riepilogo_range-rings-ui-standard-pass.md`

**Non toccati (richiesta):** `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/roadmap.md`.

## Prossimo passo consigliato

- 5E “Punta e crea” e 5F drag centro: piano esistente in `2026-04-29_2130_plan_range-rings-next-ui-label-autocreate-drag.md` ove valido; verificare in browser che resize/preset/label 5D non siano regrediti.

## Dettagli (inbox)

- `docs/orchestrator/inbox/2026-04-29_2520_riepilogo_range-rings-ui-standard-pass.md`
- Standard UI/UX tabelle: `2026-04-29_2420_riepilogo_ui-ux-standard-tabelle-preset-mapfirst.md`

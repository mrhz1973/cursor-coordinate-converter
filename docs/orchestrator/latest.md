# Stato operativo (sintetico)

Ingresso breve per **ChatGPT**; i dettagli in **`docs/orchestrator/inbox/`**. **Mantenerlo corto**.

## Ultimo aggiornamento

2026-04-29 — **Standard «notifiche interne» (modal/pannello):** in `.cursor/rules/10-html-architecture.mdc` (§5) + richiamo in `00-project-core.mdc`. **Range Rings:** `#rrOperativeNotices` con `aria-live`, `#rrInfo` / error / ok, `rrSyncRangeRingsOperativeInfo`, Esc → `state._rrPanelEscNotice` + `rangeRingsClearPickCenterMode` + `renderRangeRingsPanel`; i18n `rangeRings.noticeRegionAria`, `rangeRings.notice.escClearedRings` (IT/EN/FR). 5E invariato. Monolite in genere **fuori** dal commit selettico. Inbox: `docs/orchestrator/inbox/2026-04-29_2720_riepilogo_ui-standard-notifiche-interne-range-rings.md`.

## Ultimo intervento Cursor

Regole + (se presenti nello stesso intervento) `coordinate_converter Claude.html`. **Nessun** `finito`. Monolite **non** incluso nel commit selettico salvo richiesta esplicita.

## File modificati (sintesi)

- `.cursor/rules/10-html-architecture.mdc`, `.cursor/rules/00-project-core.mdc`
- `coordinate_converter Claude.html` (notifiche RR, ultimo giro: chiavi i18n `noticeRegionAria` / `escClearedRings`)
- `docs/orchestrator/latest.md`, `inbox/2026-04-29_2720_riepilogo_ui-standard-notifiche-interne-range-rings.md`

**Non toccati (richiesta):** `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`, `docs/roadmap.md`.

## Prossimo passo consigliato

- 5F drag centro (o aggiornare piano in `2026-04-29_2130_plan_…`); test browser su 5E + notifiche RR (Esc, distanze invalide, arm pick&crea).

## Dettagli (inbox)

- Notifiche interne RR + standard: `docs/orchestrator/inbox/2026-04-29_2720_riepilogo_ui-standard-notifiche-interne-range-rings.md`
- 5E: `docs/orchestrator/inbox/2026-04-29_2600_riepilogo_range-rings-5E-punta-e-crea.md`
- UI standard RR (pass precedente): `2026-04-29_2520_riepilogo_range-rings-ui-standard-pass.md`

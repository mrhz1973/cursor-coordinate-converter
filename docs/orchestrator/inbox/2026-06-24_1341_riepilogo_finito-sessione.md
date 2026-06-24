# Riepilogo finito — POLY-PARITY-P7-B2 UI date Creato/Aggiornato

**Data:** 2026-06-24

## Runtime

| Voce | Valore |
|------|--------|
| Commit | `47bb3f6` |
| Messaggio | `feat(gis): show polygon created and updated dates` |
| Scope | UI/i18n only — contratto P7-B1 invariato |

## Implementazione

- Posizione: `#polygonPanelEditSummary` in `#polygonPanelEditBar` (modalità Modifica)
- Dati: `gisFeatureGet(ed.id).properties.created_at` / `updated_at`
- Formatter: `polygonFormatPropertyTimestamp` (`Date.parse` + `toLocaleString` IT/EN/FR)
- i18n: `editCreated`, `editUpdated`, `dateUnavailable` (IT/EN/FR)
- Lista `#polygonPanelList`: invariata

## QA / deploy

- `node --check`: PASS
- Deploy VPS: **pending**
- QA operatore: **pending**

## Docs

- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md` (voce P7-B2 + correzione riepilogo A2/P7-B2)

## Invarianti

- P7-B1 CLOSED / PASS (`57c6d39`)
- A2 catena CLOSED
- HUD backlog non avviato

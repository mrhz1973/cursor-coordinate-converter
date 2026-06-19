# WU-0009B B6.1 — fix creazione Range Rings manuali

**Data:** 2026-06-19  
**Tipo:** fix chirurgico runtime monolite

## Bug risolti

1. `#rrCreateBtn` restava `hidden` — `renderRangeRingsPanel` non rimuoveva `.hidden` quando centro risolvibile.
2. Reset form azzerava distanze e unità `m` — ora `NM` + `1, 5, 10` (allineato al markup).

## Patch

- `renderRangeRingsPanel`: `centerResolvable = !!rrGetCenterFromUi()`; `createBtn.hidden = editing || !centerResolvable`; primary unico vs `#rrPickCreateBtn`.
- `#rrUnit` default `NM` (markup + `rrResetRangeRingsFormToNew`).

## Invariato

- `parseRangeRingDistancesInput`, `renderRangeRingsOverlay`, `rrCreateFromUi`, `rangeRingsEnterPickAndCreateMode`
- OPSEC/proxy/tile/export JPG/`state.mapWaypoints[]`

## Re-render centro

- Preferito/Waypoint/GeoJSON: già via `rrApplyCenterFromPicker` → `renderRangeRingsPanel()`
- modeSel change, map pick: già presenti

## Commit

| SHA | Messaggio |
| --- | --- |
| `cc86daf` | fix(gis): show Range Rings create button when center ready (B6.1) |

## QA

- **PASS operatore:** non attestato
- Checklist: centro convertito/mappa/favorito → Crea anelli visibile; distanze 5,10,15 NM → creazione; Punta e crea invariato

## Prossimo

- Browser QA operatore B6.1 post-deploy

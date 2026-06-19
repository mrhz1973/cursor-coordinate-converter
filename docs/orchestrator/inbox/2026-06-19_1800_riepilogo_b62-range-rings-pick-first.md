# B6.2 — Range Rings pick-first UX (runtime)

**Data:** 2026-06-19  
**Tipo:** patch chirurgica su feature esistente (non nuova feature)  
**Commit runtime:** `d38c253` — `feat: B6.2 Range Rings pick-first UX — minimize on Punta e crea`

## Obiettivo

Flusso pick-first centrato su **Punta e crea**: distanze precompilate → unità (default NM) → Punta e crea → pannello minimizzato nel dock → click mappa → anelli creati → pannello resta minimizzato (restore da chip/dock).

## Modifiche (4 punti)

1. **Rimosso `Crea anelli` (`#rrCreateBtn`)** — revert mirato B6.1: markup, binding e logica `createBtn` in `renderRangeRingsPanel` eliminati. `Punta e crea` unico primary quando `!editing`. `rrCreateFromUi` resta (chiamata da handler click mappa ~L33116).

2. **Minimize su Punta e crea** — in `rangeRingsEnterPickAndCreateMode`, dopo validazione distanze e `state.rangeRingsPickAndCreateMode = true`, chiamata `gisMinimizePanel("rangeRingsPanel", "gis.minimized.rings")`. Pick mode non resettato dalla minimizzazione (guard `gisRangeRingsMinimizeBlocked` invariato).

3. **Default distanze** — `#rrDistances` markup e `rrResetRangeRingsFormToNew` già `1, 5, 10`; reset unità `NM` confermato; `rrRenderUnitPresetChips()` invocato al reset.

4. **Preset chips unit-aware** — `#rrPresetChipsRow` popolato dinamicamente da `RR_UNIT_PRESET_VALUES` + `rrRenderUnitPresetChips()`; listener `#rrUnit` change; click chip imposta solo `#rrDistances` (non cambia unità). Label dinamiche es. `5/10/15 NM` (simboli universali, no nuove chiavi i18n).

## File modificati

- `coordinate_converter Claude.html` (+44 / −22)

## Funzioni / regioni

- `#sec-rangerings` markup preset + rimozione `#rrCreateBtn`
- `rangeRingsEnterPickAndCreateMode` — minimize dock
- `renderRangeRingsPanel` — solo `pickCreateBtn` primary
- `rrResetRangeRingsFormToNew` — chip refresh
- `RR_UNIT_PRESET_VALUES`, `rrFormatPresetChipLabel`, `rrRenderUnitPresetChips`
- `bindRangeRingsUI` — delegazione preset + unit change

## Non toccato

Parser, conversioni, `renderRangeRingsOverlay`, OPSEC/proxy/tile/layer, export JPG, `buildScaleBar`, `drawJpgExportScale`, `state.mapWaypoints[]`, geoloc, storage migration.

## QA tecnico

- Guard repo: `main`, HEAD = origin/main = ls-remote (`128d285` base → `d38c253` post-push)
- `node --check` su 2 blocchi script inline: **OK**
- `#rrCreateBtn`: assente markup e binding
- **Browser QA operatore:** non attestata — checklist sotto

## Checklist QA manuale (operatore)

1. Cache-buster runtime `d38c253`
2. Apri Range Rings — no `Crea anelli`; `Punta e crea` unico primary
3. Default `1, 5, 10` + unità NM
4. Punta e crea → pannello minimizzato nel dock
5. Click mappa → anelli creati; pick sopravvive minimizzazione
6. Restore da chip/dock
7. Cambia unità km/m/mi/NM → preset aggiornati
8. Click preset → solo campo distanze cambia
9. Nessuna regressione overlay/edit; nessuna rete implicita

## Rischi residui

- Minimize prima di `renderRangeRingsPanel` nel flusce pick: verificare in browser che notice dock e cursore pick siano coerenti.

## Prossimo passo

Browser QA operatore B6.2 post-deploy; poi eventuale aggiornamento OM §7 / roadmap WU-0009B.

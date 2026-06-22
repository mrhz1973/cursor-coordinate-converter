# Riepilogo finito sessione — WU-0007 T1 unità distanza/velocità modal Traccia

**Data:** 2026-06-22  
**Commit task:** `002624e` — `feat: WU-0007 T1 — unità distanza/velocità persistenti nella modal Traccia`  
**Push step 2:** riuscito (`c749216..002624e` → `origin/main`)

## Cosa è stato fatto

- Selettore persistente `#trackDisplayUnit` (`km` | `nm` | `mi`, default `km`) sopra `#track-summary` in `#sec-track`.
- `state.trackDisplayUnit` + `saveStore.settings.trackDisplayUnit` + restore boot (`normalizeTrackDisplayUnit`).
- Helper display-only: `formatTrackDistance(meters, unit)`, `formatTrackSpeed(mps, unit)`, `trackEtaLabelFormatted`.
- Aggiornati: `renderTrackSummary`, `renderTrackPointsList` (segmenti + leg chiusura), `renderSavedTracksList` (disaccoppiato da `mapMeasureUnit`).
- ETA: calcolo temporale invariato (4/60 km/h fisici); label con velocità dinamica `km/h` | `kn` | `mph`.
- Normalizzazione UI visibile `NM`: `formatMapMeasureDistance`, `formatScaleNmLabel`, opzioni Misura/float (`value="nm"` invariato).
- i18n IT/EN/FR: `track.unitLabel`, `track.unitAria`, `track.etaWalk`/`track.etaCar` con `{0}`.

## File modificati

- `coordinate_converter Claude.html` (+145/-22 circa)
- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md` §WU-0007 T1

## Regioni monolite

- HTML `#sec-track` ~9478
- CSS `.track-unit-row` ~4549
- `state` / `saveStore` / boot restore
- Helper ~32860–32950
- `renderTrackSummary` / `renderTrackPointsList` / `renderSavedTracksList` / `renderTrackAll`
- `wireTrackDisplayUnitOnce` in init track builder
- NM fix: `formatMapMeasureDistance`, `formatScaleNmLabel`, select Misura

## Non toccato

- `routeDistance()`, geometria, punti, `savedTracks[]` struttura, import/export GPX/KML/GeoJSON
- `updateTrackMapFloatReadout()` (float esterno fuori scope T1)
- `state.mapMeasureUnit` logica
- Range Rings, GPS, tile/cache/rete/proxy
- **`APP_BUILD_ID` `B5.5Z` invariato**
- Nessuna statistica velocità media/massima aggiunta

## QA

- `git diff --check`: PASS
- `node --check` (blocco script principale L10958–49038): PASS
- Ricerca `" Nm"` / `" nm"` / `>nm<`: nessuna occorrenza residua UI
- Smoke browser locale: non eseguito (nessun server attivo in sessione)
- **QA operatore: pending** — aprire modal Traccia, ciclare km→NM→mi, verificare summary/segmenti/archivio/ETA label, reload persistenza, tempo ETA invariato

## Precisione display

- Distanza: adattiva come `formatMapMeasureDistance` — `<10` → 3 decimali, `<100` → 2, altrimenti 1; valori `>0` e `<0.001` → 4 decimali.
- Velocità ETA: `<10` → 1 decimale, altrimenti intero arrotondato.

## git status finale (post-commit task)

Working tree pulito dopo commit `002624e`.

## Prossimo passo

QA operatore WU-0007 T1; eventuale blocco successivo allineamento float esterno a `trackDisplayUnit`.

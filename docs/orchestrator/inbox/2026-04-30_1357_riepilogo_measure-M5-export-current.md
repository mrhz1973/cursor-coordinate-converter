# Riepilogo — Misura M5: export misura corrente (GeoJSON/CSV)

**Data:** 2026-04-30 13:57 UTC  
**Blocco:** M5 (export misura corrente)  
**Perimetro:** pannello Misura GIS (`#sec-measure .meas-gis-only`) + helper export (nessun `finito`)

## Cosa è stato aggiunto

- Sezione export compatta nel pannello Misura GIS (`<details class="meas-gis-export">`) con due azioni:
  - **Esporta GeoJSON** (singola `Feature`)
  - **Esporta CSV** (vertici)
- Bottoni **disabilitati** se la geometria corrente non è esportabile (linea <2 pt; poligono <3 pt).
- Feedback in `#measOperativeNotices`:
  - errore se non c’è geometria esportabile
  - ok su export completato (GeoJSON / CSV)

## Formati

1. **GeoJSON Feature**
   - `kind==="line"` + 2+ punti → `geometry.type = "LineString"`.
   - `kind==="poly"` + 3+ punti:
     - se `mapPolyClosed !== false` → `geometry.type = "Polygon"` (ring chiuso).
     - se non chiuso → esportato come `LineString` con `properties.closed=false` (soluzione semplice e coerente).
   - `properties` include: `tool:"measure"`, `kind`, `closed`, `unit`, `creator:"GOI GIS Tool"`, `createdAt`.
   - Metadati numerici (best-effort, senza cambiare matematica): distanza/bearing per linea; perimeter/area per poligono.

2. **CSV vertici**
   - Colonne: `index,lat,lon,kind,closed`
   - BOM `\ufeff`, newline `\n`, escaping minimo via `csvEsc()`.
   - Se poligono chiuso: aggiunta riga finale di chiusura (ripete primo vertice) per chiarezza.

## Helper aggiunti / agganci

- `gisSyncMeasureExportUi()` (abilita/disabilita bottoni export in base alla geometria corrente)
- `getCurrentMeasureExportSnapshot()`
- `buildMeasureGeoJSONFeature()`
- `buildMeasureCsv()`
- `exportCurrentMeasure(kind)`
- Hook in `updateMeasureReadouts(...).finally` → `gisSyncMeasureExportUi()`
- Handler click delegato GIS misura per:
  - `[data-role="gis-meas-export-geojson"]`
  - `[data-role="gis-meas-export-csv"]`

## Vincoli confermati

- **Nessuno storico misure (M4)**.
- **Nessun M6 overlay polish** (solo micro UI/CSS per export panel).
- **Geometrie misura non persistite**: export non chiama `saveStore()` e non muta `state.mapMeasurePts` / `state.mapPolyPts`.
- Nessuna rete: download locale tramite `downloadBlob()`.

## QA eseguito

- `git diff --stat`
- `git diff --check -- "coordinate_converter Claude.html"`
- `node --check` su JS estratto dal `<script>`
- Test manuale: **da eseguire in browser** (casi: nessuna misura, linea 2 punti, poligono 3+ chiuso, export non cancella, clear/esc/undo restano ok, no regressioni RR/Track/WP).

## Rischi residui

- Se l’utente esporta spesso: nomi file includono `HHMM` (prefix automatico `YYYYMMDD_` via `downloadBlob`); ok ma non include secondi.
- Poligono non chiuso esportato come `LineString`: scelta deliberata per semplicità (il `kind` resta `poly` e `closed=false` nelle properties).

## Prossimo passo consigliato

- Se richiesto: aggiungere secondi nel filename o un “copia JSON” in clipboard (restando offline-only), senza introdurre storico/persistenza.


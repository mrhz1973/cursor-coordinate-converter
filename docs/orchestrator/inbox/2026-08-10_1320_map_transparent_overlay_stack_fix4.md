# MAP-TRANSPARENT-OVERLAY-STACK-A-FIX4 — implementazione

**Data:** 2026-08-10 ~13:20 locale  
**Tipo:** patch runtime mirata — raster overzoom Strava  
**Baseline:** `c71d15c36d67dd087da45a4646020ff8a047425d`  
**FIX4_RUNTIME_COMMIT:** `a667f7455ca0cdf73e56ea5944832011639e32e4`  
**Subject:** `fix(map): use native Strava tile size for overzoom`  
**Blob monolite:** `db1b6f24c22c9811f6a7d3d276b0215db4afeddc`  
**Build:** `MAP-TRANSPARENT-OVERLAY-STACK-A-FIX4` · **143**  
**Push task:** riuscito  
**Working tree pre-autosync:** pulito dopo push task  
**Monolite in autosync:** escluso

## Root cause (diagnostica approvata)

PNG Strava source = **512×512**. Crop overzoom usava spazio fisso 256 → a z12 crop 128 invece di 256.

## Cosa è stato fatto

1. `stravaRunHeatmapSourceFromDisplay` — solo geometria XYZ logica; rimossi `cropX`/`cropY`/`cropSize` hard-coded.
2. `stravaRunHeatmapCropRectFromSourceSize` — crop da dimensioni intrinseche source × factor/sub.
3. `stravaRunHeatmapDeriveDisplayBlob` — `bitmap.width/height` oppure `naturalWidth/naturalHeight`; output canvas 256 invariato.
4. Path z11 (`needsCrop === false`) invariato (blob diretto).
5. Build 143.

## Invarianti

- maxZoom 11 / displayMaxZoom 20
- hydrate/cache/network/stale guards invariati
- OPSEC non toccato / non testato
- altri overlay invariati
- nessun hard-code 512

## Gate

- Deploy: **NOT EXECUTED**
- QA operatore: **NOT EXECUTED**
- Review: **GPT-SOSTITUTIVA REQUIRED** su `a667f74` immutabile
- `finito`: non eseguito (coda solo dopo review + deploy + QA PASS)

## Autosync corrente

SHA/push/HEAD finale = **EXTERNAL_ONLY** (anti-self-reference F3).

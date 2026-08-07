# MAP-TRANSPARENT-OVERLAY-STACK-A-FIX1 — IMPLEMENTED / REVIEW PENDING

**Data:** 2026-08-07  
**Tipo:** CORRECTIVE PATCH PRE-DEPLOY / DELICATO  
**real_task_commit (FIX1_RUNTIME_COMMIT):** `d42e3d22a8c0255872a2b338116ef3e31ab8ee56`  
**Subject:** fix(map): enforce overlay max zoom and preserve sonar path  
**Baseline pre-task:** `7833eb89276e64c0fdd5fcb42a4a137533a02b1b`  
**Parent runtime:** `de8e053c196952a74f9cd0db3a80d1836d5b9d6b` (review FAIL / FIX1 REQUIRED)  
**Monolite:** incluso nel commit FIX1 (solo `coordinate_converter Claude.html`)

## Gate

MAP-TRANSPARENT-OVERLAY-STACK-A-FIX1 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED

- review: **PENDING**
- deploy: **NOT EXECUTED**
- QA: **NOT EXECUTED**
- VPS live: ancora `a0a6816` / build **138**
- repo runtime: build **140** pre-deploy
- `finito`: **NON** eseguito

## Finding 1 — Sonar dedicato

- `hydrateSonarChartTiles` ripristinato come percorso storico autonomo (non chiama `hydrateCachedRasterOverlayTiles`).
- Helper generico solo per: `waymarkedHiking`, `stravaRunHeatmap`, `hillshadeOverlay`.
- Registry: `NEW_CACHEABLE_RASTER_OVERLAY_IDS` (senza sonarchart); `OFFLINE_LAYER_IDS` = basemap offline + `sonarchart` storico + 3 nuovi.

## Finding 2 — maxZoom offline

- Validazione pre-download (`onPrecacheStart`, `namedAreaToPrecacheParams`, `startPrecacheDownload`) con feedback `export.offlineJpg.zoomTooHigh`.
- Hard guard in `fetchAndStoreTile`: `z > layer.maxZoom` → `zoom-too-high`, zero network.
- Test fetch-count: WM 18/19, Strava 11/12, Hillshade 12/13, legacy mix — PASS.

## Altro

- Commento OSM Standard aggiornato (sharding a-c).
- Resolver OSM / gsat / personal proxy / persistenza toggle invariati.
- `_personalProxyConsentGranted` ancora session-only.

## EXTERNAL_ONLY

SHA/push/HEAD del commit autosync corrente: **EXTERNAL_ONLY**.

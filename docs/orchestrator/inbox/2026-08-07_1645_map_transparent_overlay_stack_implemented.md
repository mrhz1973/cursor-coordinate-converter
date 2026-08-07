# MAP-TRANSPARENT-OVERLAY-STACK-A — IMPLEMENTED / REVIEW PENDING

**Data:** 2026-08-07  
**Tipo:** BUNDLE DELICATO — GIS IMPLEMENTATION build 139  
**real_task_commit (RUNTIME_COMMIT):** `de8e053c196952a74f9cd0db3a80d1836d5b9d6b`  
**Subject:** feat(map): add cached raster overlay stack  
**Baseline pre-task:** `300dda17a04ef07fe6449cefb3d5fc5a1765f103`  
**Monolite:** incluso nel commit runtime (solo `coordinate_converter Claude.html`)

## Gate

MAP-TRANSPARENT-OVERLAY-STACK-A IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED

- review: **PENDING**
- deploy: **NOT EXECUTED**
- QA operatore: **NOT EXECUTED**
- VPS live: ancora `a0a6816` / build **138**
- build 139: pubblicata su origin, **pre-deploy**
- `finito`: **NON** eseguito; coda Regola H pre-autorizzata dopo `QA MAP-TRANSPARENT-OVERLAY-STACK-A PASS operatore`

## Cosa è stato fatto

1. Preflight PASS @ `300dda1`; hard smoke PASS (`/status` + strava_run/hillshade caps; Strava PNG; Hillshade JPEG; WayMarked PNG).
2. OSM Standard sharding a|b|c; `gsat` invariato (`NAV_PROXY_PORT`).
3. Overlay cacheable: `waymarkedHiking`, `stravaRunHeatmap`, `hillshadeOverlay`.
4. Provider `"personal"` + `_personalProxyConsentGranted` **session-only** (non in saveStore/hydration).
5. Hydrator condiviso cache-first; Layers UI; OFFLINE registry; named-area legacy keys.
6. Z-index raster tutti **3** (DOM order) sotto GIS poly(4)/track+wp(5).
7. `tIt()` fallback IT per L10N freeze (nessuna nuova chiave EN/FR).

## Scope v1

IN: OSM sharding; gsat; WayMarked; Strava Run z≤11; Hillshade z≤12.  
OUT: Slope/Terrain/Bing labels; Planet-Clone edits; Objects GIS.

## Proxy

Route via `http://${getNavProxyHost()}:${NAV_PROXY_PORT}/…` — **non** literal `:5000`.

## Test tecnici

- `node --check` PASS (2 script inline)
- Resolver OSM/WM/Strava/Hillshade PASS
- Consent A–E + zoom/forceOffline logic PASS
- Browser QA pre-deploy: **PENDING**

## Prossimo passo

1. Review GPT-sostitutiva di **RUNTIME_COMMIT** `de8e053…`  
2. Deploy GIS-only  
3. QA ChatGPT → operatore  
4. Attestazione `QA MAP-TRANSPARENT-OVERLAY-STACK-A PASS operatore` → auto-`finito`

## Fatti EXTERNAL_ONLY (autosync corrente)

SHA/push/HEAD del commit autosync corrente: **EXTERNAL_ONLY** (non autorati qui).

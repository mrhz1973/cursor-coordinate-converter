# MAP-TRANSPARENT-OVERLAY-STACK-A-FIX3 — autosync

**Data:** 2026-08-08  
**Gate:** IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED  
**Deploy:** NOT EXECUTED  
**QA operatore:** NOT EXECUTED  
**finito:** NOT EXECUTED (coda pre-autorizzata post review+deploy+QA PASS)

## Runtime task

* **FIX3_RUNTIME_COMMIT:** `261fcdf937de25eb9fcc376b37c4d1de4eb231c0`
* **Subject:** `fix(map): preserve Strava effective-online gate`
* **Baseline pre-task:** `64eac2d144bd4a2933e1fc13cd7515ac6043d84f`
* **Parent FIX2 runtime:** `5aaa54b8311317d078685d26acc64cdbac28e0cd`
* **Monolite blob:** `d71529df649fb91e5bd20a348b3511fdb422682a`
* **APP_BUILD_ID:** `MAP-TRANSPARENT-OVERLAY-STACK-A-FIX3`
* **APP_BUILD_NUM:** `142`
* **Diff:** +5 / −3 (solo build metadata + 1 gate)

## Fix

In `hydrateStravaRunHeatmapTiles` → `loadSourceBlob`, dopo cache HIT:

```js
if (!isEffectivelyOnline()) return null;
```

prima di `fetchAndStoreTile`. Cache-hit resta usabile offline / forced-offline. Miss senza rete effettiva: zero fetch, zero consenso.

## Invariati

`fetchAndStoreTile`, maxZoom 11, displayMaxZoom 20, mapping/crop/dedupe, precache, UI overlay, WayMarked/Hillshade/Sonar, Planet-Clone/proxy.

## Verifiche

* `node --check` main script PASS
* Gate harness A–F PASS
* `git diff --check` OK
* Scope solo monolite

## Prossimo passo

REVIEW GPT-SOSTITUTIVA su `261fcdf…` → deploy → QA → `QA MAP-TRANSPARENT-OVERLAY-STACK-A-FIX3 PASS operatore` → auto-finito.

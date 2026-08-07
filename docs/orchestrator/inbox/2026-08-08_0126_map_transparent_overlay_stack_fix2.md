# MAP-TRANSPARENT-OVERLAY-STACK-A-FIX2 — autosync

**Data:** 2026-08-08  
**Gate:** IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED  
**Deploy:** NOT EXECUTED  
**QA operatore:** NOT EXECUTED  
**finito:** NOT EXECUTED (coda pre-autorizzata; trigger solo dopo review GPT PASS + deploy PASS + `QA MAP-TRANSPARENT-OVERLAY-STACK-A-FIX2 PASS operatore`)

## Runtime task

* **FIX2_RUNTIME_COMMIT:** `5aaa54b8311317d078685d26acc64cdbac28e0cd`
* **Subject:** `fix(map): overzoom Strava and distinguish overlays`
* **Baseline pre-task:** `24aff93245b7acaa38e7c5797a1da9b86ab8331e`
* **Parent FIX1 runtime:** `d42e3d22a8c0255872a2b338116ef3e31ab8ee56`
* **Monolite blob:** `06dde2459bdf07b021d2635a8a75d21504655468`
* **APP_BUILD_ID:** `MAP-TRANSPARENT-OVERLAY-STACK-A-FIX2`
* **APP_BUILD_NUM:** `141`
* **File runtime:** solo `coordinate_converter Claude.html`
* **Diff:** +256 / −13

## Cosa fatto

1. `STRAVA_RUN_HEATMAP_OVERLAY.maxZoom` resta **11** (fetch/precache/offline); aggiunto `displayMaxZoom: 20`.
2. `stravaRunHeatmapOverlayVisible` usa `displayMaxZoom` (non nasconde a z>11).
3. Helper `stravaRunHeatmapSourceFromDisplay` + `stravaRunHeatmapDeriveDisplayBlob` (canvas 256×256, crop source).
4. `hydrateStravaRunHeatmapTiles` path dedicato: cache-first source z11, dedupe `Map` per ciclo, rete solo via `fetchAndStoreTile` su source z≤11; derived transienti, zero `cacheTileFromDisplay` per z12..20.
5. UI: `tlayer-overlay-item` su `tlayerOverlayBtn` + CSS light/dark (accent ambra, glyph stack); basemap invariate.
6. Planet-Clone / proxy / tiles-auth / token: **non toccati**.
7. `hydrateCachedRasterOverlayTiles` / WayMarked / Hillshade / Sonar: invariati funzionalmente.

## Verifiche tecniche

* Main inline script `node --check` PASS
* Mapping/visibility pure tests PASS (z11/12/15/20; OFF/ON/z21)
* Nessun `tiles-auth` / `heatmap-external` nel monolite
* Strava hydrator usa `fetchAndStoreTile`; nessun `cacheTileFromDisplay` nel path dedicato
* Sei overlay passano da `tlayerOverlayBtn`
* `git diff --check` OK sullo scope runtime

## Non fatto / limiti

* Review GPT-sostitutiva pendente (obbligatoria prima del deploy)
* Deploy VPS non eseguito
* QA browser/operatore non eseguita
* OM §7 / roadmap non aggiornati a chiusura PASS (vincolo prompt)
* Forced-offline / OPSEC: contratto preservato via riuso `fetchAndStoreTile` (test browser non eseguiti)

## Prossimo passo

REVIEW GPT-SOSTITUTIVA su `5aaa54b8311317d078685d26acc64cdbac28e0cd` immutabile → se PASS: deploy GIS-only → QA ChatGPT → attestazione `QA MAP-TRANSPARENT-OVERLAY-STACK-A-FIX2 PASS operatore` → auto-`finito`.

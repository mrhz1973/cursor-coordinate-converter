# MAP-ZOOM-FOCUS-ANCHOR-A — implementazione (review GPT-sostitutiva)

**Data:** 2026-08-11  
**Tipo:** DELICATO LEGGERO — MAP CAMERA / WHEEL / "+" / NEUTRAL CLICK  
**Baseline attesa:** `3716cd60bdae6c88f322b4252c6f60a5c3804083`  
**Runtime parent live:** `7f41c8e82330c943a569d5af8a1a60e63a489f05`  
**real_task_commit:** `f1346290a3ddc6c297c9c58f068715b532cb896a`  
**Subject:** `feat(map): anchor zoom-in to focused map point`

## Cosa è stato fatto

Focus geografico **transiente** (`let gMapZoomFocus`) per zoom-in (wheel / pulsante "+"): con focus valido, il punto resta al centro della zona utile `gisMapUsableRect` via `gisMapOffsetVC`. Senza focus → path corrente invariato. Zoom-out / "−" non focus-aware. Firma camera → stale automatico.

## Storage focus

- **Tipo:** modulo `let gMapZoomFocus = null` (NON `state`, NON `_mapZoomFocus`)
- **Payload:** `{ lat, lon, source, cameraLat, cameraLon, cameraZoom }`
- **source:** `neutral-click` | `waypoint` | `waypoint-marker` | `dblclick`
- **Persistenza:** assente da `saveStore` whitelist; nessun localStorage/IndexedDB/serializer dedicato

## Helper

- `mapZoomFocusClear` / `Set` / `GetValid` / `CaptureCamera` / `CameraMatches` / `RefreshCameraSignature`
- `mapZoomApplyFocusedZoomIn` (riusa `gisMapUsableRect` + `gisMapOffsetVC`; no `gisMapCenterOnLatLon`)
- Tolleranza: `MAP_ZOOM_FOCUS_CAM_EPS = 1e-7`, `MAP_ZOOM_FOCUS_ZOOM_EPS = 1e-6`

## Hook

| Path | Comportamento |
|------|----------------|
| wheel-in + focus | usable-center focus |
| wheel-in senza focus | zoom-around-cursor invariato |
| wheel-out | invariato → firma stale |
| "+" + focus | stesso helper |
| "+" senza / "−" | invariato |
| neutral click (`attachPanHandlers` onUp fallback) | set focus, no camera |
| pan reale | `mapZoomFocusClear` |
| dblclick | recenter poi focus `dblclick` |
| waypointsZoomTo / editor Centra | focus **dopo** Centra |
| marker WP click-senza-drag | focus `waypoint-marker`, no fly |

## OUT / FROZEN

- Track map-click: **OUT V1**
- Workbench / Oggetti GIS: **FROZEN**
- Favorites / altri CTA `gisMapCenterOnLatLon`: non patchati

## Build

- `APP_BUILD_ID = MAP-ZOOM-FOCUS-ANCHOR-A`
- `APP_BUILD_NUM = 156`
- `APP_BUILD_DETAIL = anchor map zoom-in to focused point within usable viewport`

## Verifiche tecniche

- `node --check` PASS (JS inline)
- `git diff --check` PASS
- Harness focus valid/stale / OffsetVC usable / repeated zoom-in / maxZoom PASS
- `utmToLatLon` byte-EQ vs parent `7f41c8e`
- IGM `8204` marker presente
- Monolite **incluso** nel commit task; **escluso** da questo autosync

## Artefatti runtime

- FULL SHA: `f1346290a3ddc6c297c9c58f068715b532cb896a`
- Blob monolite: `825c8003914c4bbfdd08699ae8b264011dfdc1b3`
- Byte LF: `9787660`
- SHA-256 LF: `3df287786516afc69be6befcfe99d2e00324e7f1282f7c271f953dfde94adc13`

## Gate

- **NO DEPLOY**
- **NO finito**
- **NO QA operatore** (Cursor)
- Prossimo: **REVIEW GPT-SOSTITUTIVA** obbligatoria, poi deploy solo dopo review

## Working tree pre-autosync

Dopo push task: clean monolite; solo docs autosync in preparazione.

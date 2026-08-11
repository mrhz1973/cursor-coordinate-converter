# MAP-ZOOM-FOCUS-ANCHOR-A-FIX1 — micro-fix review

**Data:** 2026-08-11  
**Tipo:** MICRO-FIX REVIEW — NEUTRAL CLICK ARBITRATION + WAYPOINT POINTERCANCEL  
**Baseline:** `3f3053cd8e2cbed519a95fb0c192f47cdf30a64d`  
**Runtime parent:** `f1346290a3ddc6c297c9c58f068715b532cb896a`  
**real_task_commit:** `ac3a0eaefd334e20f3e4ed3085668c70c5dbf1c9`  
**Subject:** `fix(map): guard neutral zoom focus interactions`

## Finding risolti

1. **Neutral click troppo ampio** — fallback `!drag.moved` impostava focus anche su feature/label/controlli (saved-track, IGM label, ecc.).
2. **pointercancel waypoint** — `mapWptDocDragUp` impostava focus anche su `pointercancel` senza drag.

## Fix

- Predicato allowlist `mapZoomFocusIsNeutralMapTarget(target, tileMap, tileLayer)`:
  - ammessi: `tileMap`, `tileLayer`, `.tile-wrap`, `.tile`, `.tile-void`
  - negati di default: tutto il resto (hit track, IGM label, named-cov, handles, button, …)
- Neutral fallback: richiede down+up neutrali; ignora `touchcancel`/`pointercancel`; non cleara focus se denied.
- `mapWptDocDragUp`: focus `waypoint-marker` **solo** se `ev.type === "pointerup"`; su cancel senza drag solo cleanup; su cancel dopo drag resta save/render.

## Frozen vs parent f134629 (EQ)

- `mapZoomApplyFocusedZoomIn`, `attachWheelZoom`, data-zdelta, `gisMapUsableRect`, `gisMapOffsetVC`, `utmToLatLon`
- Track OUT; Workbench FROZEN; storage invariato

## Build

- `APP_BUILD_ID = MAP-ZOOM-FOCUS-ANCHOR-A-FIX1`
- `APP_BUILD_NUM = 157`
- `APP_BUILD_DETAIL = restrict map zoom focus to neutral clicks and valid waypoint taps`

## Artefatti

- FULL SHA: `ac3a0eaefd334e20f3e4ed3085668c70c5dbf1c9`
- Blob: `fceb5626511f38f75154759f0c4ab8a7474acebe`
- Byte LF: `9789222`
- SHA-256 LF: `0bcd7f5349464ed51c8ffaa779fe13d9bc1020d580c9aedd4e0a68d91db98717`

## Gate

- **NO DEPLOY**
- **NO finito**
- Review GPT-sostitutiva su runtime combinato A + FIX1

## Monolite

Incluso nel commit task; **escluso** da questo autosync.

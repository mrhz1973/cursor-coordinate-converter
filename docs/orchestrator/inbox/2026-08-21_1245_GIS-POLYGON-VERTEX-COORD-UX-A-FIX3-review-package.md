# REVIEW PACKAGE — GIS-POLYGON-VERTEX-COORD-UX-A-FIX3 (build 242)

BLOCK-ID: `GIS-POLYGON-VERTEX-COORD-UX-A-FIX3`  
PHASE: REVIEW EVIDENCE PUBLISH  
CLOSURE: **NONE**  
REMOTE MAIN WRITE (runtime): **FORBIDDEN** until promote  
DEPLOY: **FORBIDDEN**  
REVIEW PASS: **NOT ATTESTED**

## Trigger

Human QA FAIL on LIVE build **241**: «Nuovo poligono» **minimizza** la modal Poligoni → lista Coordinate vertici (FIX2) non consultabile durante drawing.

## Identifiers

| Campo | Valore |
| --- | --- |
| **BASE FULL SHA** (`origin/main` at evidence) | `710e8087b808df1cffbf491480015a2ea2af3a4c` |
| **CANDIDATE FULL SHA** | `eef83032535f948b21491ca226757447168de2a3` |
| **BRANCH** | `review/GIS-POLYGON-VERTEX-COORD-UX-A-FIX3-242` |
| **APP_BUILD_NUM** | **242** |
| **APP_BUILD_ID** | `GIS-POLYGON-VERTEX-COORD-UX-A-FIX3` |
| **CANDIDATE BLOB** | `2e0075ba344713b17f0888c4e9594f414bb0db94` |
| **LIVE BLOB (unchanged)** | `92ec73f7be579e8616ee83fcab085f1c7c6a426d` |
| **Full runtime diff** | [`2026-08-21_1245_GIS-POLYGON-VERTEX-COORD-UX-A-FIX3-runtime.diff`](2026-08-21_1245_GIS-POLYGON-VERTEX-COORD-UX-A-FIX3-runtime.diff) |

## Root cause

`polygonStartDraw()` chiamava `polygonDrawMinimizeIfOpen()` → `gisMinimizePanel("polygonPanel", …, { skipBlockCheck: true })` + `state._polygonDrawAutoMinimized = true`.

## Fix

- Rimosso **solo** il call a `polygonDrawMinimizeIfOpen()` da `polygonStartDraw()`.
- Helper `polygonDrawMinimizeIfOpen` / `polygonDrawRestoreIfAutoMinimized` **preservati** (selftest dock + restore su cancel/finish se flag già settato; no redesign).
- Minimize **manuale** via controllo UI: invariato.

## Lifecycle before / after

| Azione | Before (241) | After (242) |
| --- | --- | --- |
| Nuovo poligono | panel → chip dock | panel resta aperta |
| Drawing + Coordinate vertici | nascoste (minimizzato) | visibili/usabili |
| Minimize manuale | OK | OK |
| Cancel / Finish | restore se auto-min | panel già aperta; restore no-op |

## Diff check

- Runtime commit monolite only: +10 / −10 (build markers + remove call).
- Current-build selftest triad → NUM **242** + ID `…-FIX3`.
- `git diff --check` PASS.
- `node --check` PASS.
- Network/GPS/schema: delta **0**.

## Local QA (Playwright) — 22/22 PASS

Panel open → Nuovo → not minimized · verts list visible · copy/mod draft · remove · manual min/restore · cancel · finish · edit list smoke · helpers kept · F/Tf/H build markers · pageerrors 0.

## Explicitly NOT done

- Deploy / REVIEW PASS / `finito`
- MAP-CENTER dock/altezza/camera
- Waypoint interaction / presets / metrics compact / WP layout / text export

## Status line

`GIS-POLYGON-VERTEX-COORD-UX-A-FIX3 REVIEW PACKAGE READY — AUTO-MINIMIZE REMOVED — NO DEPLOY`

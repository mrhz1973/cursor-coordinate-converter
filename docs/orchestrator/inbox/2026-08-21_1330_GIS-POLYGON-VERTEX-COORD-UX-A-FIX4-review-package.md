# REVIEW PACKAGE — GIS-POLYGON-VERTEX-COORD-UX-A-FIX4 (build 243)

BLOCK-ID: `GIS-POLYGON-VERTEX-COORD-UX-A-FIX4`  
PHASE: REVIEW EVIDENCE PUBLISH  
CLOSURE: **NONE**  
DEPLOY: **FORBIDDEN**  
REVIEW PASS: **NOT ATTESTED**

## Trigger (Human QA FAIL 242)

Durante «Nuovo poligono», i vertici draft **non** erano trascinabili; hover senza grab. LIVE: build **242** / FIX3 / blob `2e0075ba…`.

## Identifiers

| Campo | Valore |
| --- | --- |
| **BASE FULL SHA** | `19a019138b2b23513467813fcb7c460ce88d862f` |
| **CANDIDATE FULL SHA** | `5857cbb2c3fc73e688ae26c1e2a359bb76199416` |
| **BRANCH** | `review/GIS-POLYGON-VERTEX-COORD-UX-A-FIX4-243` |
| **APP_BUILD_NUM** | **243** |
| **APP_BUILD_ID** | `GIS-POLYGON-VERTEX-COORD-UX-A-FIX4` |
| **CANDIDATE BLOB** | `04cfdfcc1eed8979e60b9ff176f93ceee79ccfcb` |
| **LIVE BLOB (unchanged)** | `2e0075ba344713b17f0888c4e9594f414bb0db94` |
| **Full runtime diff** | [`2026-08-21_1330_GIS-POLYGON-VERTEX-COORD-UX-A-FIX4-runtime.diff`](2026-08-21_1330_GIS-POLYGON-VERTEX-COORD-UX-A-FIX4-runtime.diff) |

## Root cause

`renderPolygonDraftOverlay` disegnava solo cerchi statici (`pointer-events:none` sull’SVG); nessun handle / nessun collegamento a `mapPolyEditDocDrag*`.

## Fix (chirurgico)

- Handle `.poly-edit-handle` / `.poly-edit-handle-hit` su ogni vertice di `_polygonDraftVertices` (dal primo).
- Riuso `mapPolyEditDocDrag` con `source: "draft"` + `polygonApplyDraggedDraftVertex` (stesso clamp/normalize di edit; **no** persist `gisPolygons`).
- Live refresh: draft overlay + `renderPolygonDraftInfo` / Coordinate vertici / Area-Perimetro.
- Handle ha priorità sul click-map add (stopPropagation + guard su map click se drag draft attivo).
- Click senza soglia drag → apre dialog Modifica (stesso pattern edit).
- Cleanup su cancel/finish/start + `mapPolyEditDocDragCleanup` clears `_polygonDraftDragIdx`.
- Edit-mode path invariato semanticamente (`source !== "draft"`).

## Diff check

- Monolite only · `git diff --check` PASS · `node --check` PASS  
- Selftest triad → 243 / FIX4  
- Network/GPS/schema delta **0** · stores non fusi

## Local QA — 21/21 PASS

Handles×4 · grab · apply draft · count invariato · no premature persist · list/coord live · cleanup · finish geom === draft · edit apply · cancel clean · F/Tf/H · pageerrors 0.

## Out of scope (non implementato)

MAP-CENTER / dock / snap WP / presets / metrics compact / WP layout / text export.

## Status line

`GIS-POLYGON-VERTEX-COORD-UX-A-FIX4 REVIEW PACKAGE READY — DRAFT VERTEX DRAG ADDED — NO DEPLOY`

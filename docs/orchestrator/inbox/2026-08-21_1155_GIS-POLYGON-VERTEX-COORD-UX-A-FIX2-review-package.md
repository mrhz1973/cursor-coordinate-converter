# REVIEW PACKAGE — GIS-POLYGON-VERTEX-COORD-UX-A-FIX2 (build 241)

BLOCK-ID: `GIS-POLYGON-VERTEX-COORD-UX-A-FIX2`  
PHASE: REVIEW EVIDENCE PUBLISH  
CLOSURE: **NONE**  
REMOTE MAIN WRITE (runtime): **FORBIDDEN** until promote  
DEPLOY: **FORBIDDEN**  
REVIEW PASS: **NOT ATTESTED**

## Trigger

Human QA FAIL on LIVE build **240** (`GIS-POLYGON-VERTEX-COORD-UX-A-FIX1`): during **Nuovo poligono** (drawing active: Chiudi / Rimuovi ultimo / Annulla), **Coordinate vertici** did not appear.

Root cause confirmed: build 240 rendered `renderPolygonEditVertsList()` only when `polygonIsEditing()` / `state._polyEdit.working`; drawing uses `_polygonDraftVertices`. Also the list lived inside `#polygonPanelEditBar` (hidden while drawing).

## Identifiers

| Campo | Valore |
| --- | --- |
| **BASE FULL SHA** (`origin/main` at evidence) | `a080aaf1e1f9f068b3eda71c5a0ad3543f688c17` |
| **CANDIDATE FULL SHA** | `b578ec8e11c952bb6a2f99fb6d863e673da2f723` |
| **BRANCH** | `review/GIS-POLYGON-VERTEX-COORD-UX-A-FIX2-241` |
| **APP_BUILD_NUM** | **241** |
| **APP_BUILD_ID** | `GIS-POLYGON-VERTEX-COORD-UX-A-FIX2` |
| **CANDIDATE BLOB** (`coordinate_converter Claude.html`) | `92ec73f7be579e8616ee83fcab085f1c7c6a426d` |
| **LIVE BLOB (unchanged)** | `192c3b41543d6bedfbc899e6b3c8d1e3fe427464` |
| **Full runtime diff** | [`2026-08-21_1155_GIS-POLYGON-VERTEX-COORD-UX-A-FIX2-runtime.diff`](2026-08-21_1155_GIS-POLYGON-VERTEX-COORD-UX-A-FIX2-runtime.diff) |

## Diff check

- Runtime commit **monolite only** (`coordinate_converter Claude.html`): +77 / −29.
- Selftest current-build triad synced: `F_mvisa_build_199` / `Tf_build_196` / `H_build_214` → `APP_BUILD_NUM === 241` + `APP_BUILD_ID === "GIS-POLYGON-VERTEX-COORD-UX-A-FIX2"`.
- `node --check` on extracted main script: **PASS**.
- Schema `state.gisPolygons[]`: **unchanged**.

## Drawing (`_polygonDraftVertices`)

- Shared container `#polygonPanelEditVertsWrap` / `#polygonPanelEditVerts` moved **outside** `#polygonPanelEditBar` (after `#polygonPanelDraftInfo`) so it can show while drawing.
- `polygonGetVertexCoordRingSource()` → `edit` (`_polyEdit.working`) or `draft` (`_polygonDraftVertices`).
- Wrap visible from **first** draft vertex; hidden when draft empty / not drawing / not editing.
- Updates via `renderPolygonDraftInfo` → `renderPolygonEditVertsList` (also on panel list refresh after map click / remove last / cancel / finish).
- Same format selector + `polygonFormatVertexCoordText` / Copy `data-copy ===` visible text.
- Modifica → same `#polygonVertexCoordDialog` + `polygonParseVertexCoordInputText` / `autoDetect`; apply mutates **only** `_polygonDraftVertices[idx]` (**no** premature `gisPolygons[]` persist).
- Invalid input: zero mutation + modal error.

## Edit (`_polyEdit.working`) — build 240 preserved

- Same list / format / copy / modal / autoDetect.
- Live drag readout path unchanged.
- Salva / Annulla / insert / delete / whole move: not regressively rewritten.

## Create transition (“Chiudi poligono”)

- `polygonFinishDraw` still builds ring from final `_polygonDraftVertices` (map + close) — no second geometry source.
- Local QA: draft snap === created ring coords.

## Local QA (Playwright headless, 25/25)

Drawing: wrap empty→hidden; 1/4 rows; DD/DMS/UTM/MGRS change; copy exact; draft modal source; signed + UTM paste; bad input no mut; remove last; finish matches draft; no premature persist.  
Edit: list after refresh; drag live; save; cancel restores.  
Selftests F/Tf/H current-build: PASS. Console pageerrors: **0**.

## OPSEC / network

- New endpoints / fetch / GPS: **none**.
- Network delta attributable: **0**.

## Explicitly NOT done

- Deploy / promote to `main` / LIVE bump  
- Review PASS attestation / `finito`  
- Presets, waypoint snap/priority, close-modal cleanup, metric decimals, waypoint export/layout

## Status line

`GIS-POLYGON-VERTEX-COORD-UX-A-FIX2 REVIEW PACKAGE READY — BUILD 240 HUMAN QA FAIL ADDRESSED — NO DEPLOY`

# REVIEW PACKAGE — GIS-POLYGON-VERTEX-COORD-UX-A-FIX1 (build 240)

BLOCK-ID: GIS-POLYGON-VERTEX-COORD-UX-A-FIX1  
PHASE: IMPLEMENT → LOCAL QA → REVIEW PACKAGE  
CATEGORY: DELICATO — polygon edit path + selftest build markers  
CLOSURE: NONE  
MAIN WRITE (runtime): FORBIDDEN · DEPLOY: FORBIDDEN · FINITO: FORBIDDEN  
REVIEW ATTESTATION: **NOT PASS** (package ready only)

## Identifiers

- BASE_FULL_SHA (NEW_DOCS_MAIN): `dfcf2896a70d0899e513012bcb2df1a6665f8ce4`
- CANDIDATE_FULL_SHA: `4fb9c2f30868c0a90dcf745c2e146c34fd598a59`
- BRANCH: `review/GIS-POLYGON-VERTEX-COORD-UX-A-FIX1-240`
- APP_BUILD_NUM: **240**
- APP_BUILD_ID: `GIS-POLYGON-VERTEX-COORD-UX-A-FIX1`
- CANDIDATE_BLOB: `192c3b41543d6bedfbc899e6b3c8d1e3fe427464`
- REJECTED parent functional: `be49ed2494dbaa9bdf25d55151b3ac15c390fd07` · build **239** · blob `cd6a79d6…`
- LIVE (unchanged): build **238** · blob `c36109d1ebda7470748a3284089bf11b262d01cf`
- Full runtime diff: `docs/orchestrator/inbox/2026-08-21_1135_GIS-POLYGON-VERTEX-COORD-UX-A-FIX1-runtime.diff`
- `git diff --check` BASE…CANDIDATE monolite: **PASS**

## STEP 1 — Backlog registered (docs-only, already on main)

- ID: `GIS-POLYGON-WAYPOINT-INTERACTION-A` = **BACKLOG / NOT OPENED**
- Evidence: `docs/orchestrator/inbox/2026-08-21_1125_GIS-POLYGON-WAYPOINT-INTERACTION-A-backlog.md`
- MAIN SHA after docs push: `dfcf2896a70d0899e513012bcb2df1a6665f8ce4`
- Monolite blob after docs: `c36109d1…` (invariato) · FRONTIER idle during STEP 1

## Review FAIL root cause (239)

Selftests `F_mvisa_build_199`, `Tf_build_196`, `H_build_214` had:
- `APP_BUILD_NUM === 239` (updated)
- `APP_BUILD_ID === "D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2"` (**stale**)

## FIX1 correction

| Marker | Assertion |
| --- | --- |
| `const APP_BUILD_ID` | `GIS-POLYGON-VERTEX-COORD-UX-A-FIX1` |
| `const APP_BUILD_NUM` | `240` |
| `F_mvisa_build_199` | `=== 240` && ID FIX1 |
| `Tf_build_196` | `=== 240` && ID FIX1 |
| `H_build_214` | `=== 240` && ID FIX1 |

Audit: zero remaining `APP_BUILD_NUM === 239`; zero remaining `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2` in monolite.  
Historical `=== 234` / `D-FLIGHT-CLOSE-CLEANUP-A` markers **invariati** (già presenti su LIVE 238; non “current-build”).

## Functionality preserved from 239

Lista vertici, format refresh, live drag readout, Copia exact, Modifica+autoDetect (DD/DMS/UTM/MGRS/Plus/BNG/SK42), fail-closed, `_polyEdit` working-copy, Salva/Annulla, insert/delete, whole-move.  
**Non** implementati: preset shapes, waypoint pointer priority, snap, close-lifecycle (backlog INTERACTION).

## Local QA

### Current-build selftests (obbligatori)

| Check | Esito |
| --- | --- |
| `F_mvisa_build_199` | **PASS** |
| `Tf_build_196` | **PASS** |
| `H_build_214` | **PASS** |
| `dflightSelfTestF` suite | 36/36 PASS |
| `dflightSelfTestTf` suite | 47/47 PASS |
| `dflightSelfTestH` suite | 70/71 — fail **solo** `FIX3_D4_resize_handles_anchored` (CSS resize handles D-Flight panel; **non** nel diff FIX1; layout/viewport harness; **non** attribuibile a vertex-coord) |

### Polygon A–T (sintesi)

PASS: lista 4 vertici, format mgrs/utm/dd, drag live+readout `pointer-events:none`, copyExact, parse DD/DMS/UTM/MGRS/Plus (+BNG/SK42), invalid fail-closed, insert/delete, whole-move, Salva geomMatch, Annulla restore, schema `gisPolygons` invariato, `mapWaypoints`/`gisTracks` arrays intatti, resource delta gesture = **0**.

## Schema / network

- `state.gisPolygons[]` schema invariato
- `state.mapWaypoints[]` invariato
- network delta 0

## GATE

**STOP pre-deploy.** Main LIVE resta **238**.

---

**GIS-POLYGON-VERTEX-COORD-UX-A-FIX1 REVIEW PACKAGE READY — BACKLOG INTERACTION REGISTERED — NO DEPLOY**

# GIS-PANEL-DOCK-MGR-G-B-REVIEW-EVIDENCE-B

**TIPO:** DIAGNOSTIC / EVIDENCE-ONLY  
**WU:** WU-0021  
**CATEGORIA:** DELICATO  
**GATE:** **REVIEW GPT-SOSTITUTIVA — PENDING** (nessun verdetto in questo pass)

## Candidate — INVARIATO

| Voce | Valore |
| --- | --- |
| FULL SHA | `361345d6d330347a0ced6cd57c4a3fcb7d7b173a` |
| Build | **211** / `APP_BUILD_ID=GIS-PANEL-DOCK-MGR-G-B` |
| Blob | `a0b8661422d8646ee07ec7ff41ba25c7c67cbb42` |
| Bytes LF | `10400053` |
| SHA-256 LF | `eab1ae24b9817a6592dc22fb7b86d4be873704bbbec194f4b0810a74492c9b13` |
| LIVE | `525e7df…` / **210** |
| Runtime diff questo pass | **nessuno** (`git status` clean sul monolite; blob after = blob before) |

## Gap chiuso

Il verify G-B iniziale documentava esplicitamente solo `DOCK_GB_blocked_favorites`.  
Questo pass esercita **tutti** i blocked negative path ordinari richiesti (A–G) sul candidate 211, senza patch.

Raw JSON: [`2026-08-17_0220_gis-panel-dock-mgr-g-b-review-blocked-paths.json`](2026-08-17_0220_gis-panel-dock-mgr-g-b-review-blocked-paths.json)

## Tabella blocked negative paths

| panelId | blocker | blockerActiveBefore | minimizeAttempt | chipCreated | minimizedAfter | nMinDelta | blockerStillCoherent | normalMinAfterUnblock | restore | PASS/FAIL |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| favoritesPanel | favInlineConfirmBar | true | true | false | false | 0 | true | true | true | **PASS** |
| waypointModal | waypointImportDialog | true | true | false | false | 0 | true | true | true | **PASS** |
| astroPanel | astroWaypointPicker | true | true | false | false | 0 | true | true | true | **PASS** |
| layersPanel | offlineDraftWarnDialog | true | true | false | false | 0 | true | true | true | **PASS** |
| rangeRingsPanel | rrSourcePickerDialog | true | true | false | false | 0 | true | true | true | **PASS** |
| polygonPanel | polygonPanelDeleteBar | true | true | false | false | 0 | true | true | true | **PASS** |
| trackModal | trackExportDialog | true | true | false | false | 0 | true | true | true | **PASS** |

### Note track

Esercitato solo il path **subdialog** (`gisTrackModalBlockingSubdialogsOpen` → `#trackExportDialog`).  
**NON** esercitato / **NON** certificato il lifecycle **brush** G-C (`trackBrushOnMinimizeAttempt`).

### G-C boundary (non esercitato)

layers bbox auto-min · polygon draw auto-min · range-rings pick auto-min · D-Flight pair · carto `_cartoUi` · routing pick/marker-drag · track brush profondo.

## Selftest

Rieseguito sul candidato: **486/486** PASS · fail=0 · console severe=0.

## Invarianti

- Workbench whitelist branch **presente**
- Un solo `#gisMinimizedDock` / un solo `_gisMinimizedPanels[]`
- G-A1-FIX2 / WU-0019 invariati (nessun tocco runtime)
- Helper **0.1.3** · no rete/GPS/storage · `mapWaypoints` invariato
- **G-C/G-D NOT OPENED** · **F NOT OPENED** · WU-0012 invariata

## STOP

Nessun verdetto review. Nessuna patch/bump/deploy/ABQA/QA/`finito`.  
Gate resta: **REVIEW GPT-SOSTITUTIVA — PENDING**.

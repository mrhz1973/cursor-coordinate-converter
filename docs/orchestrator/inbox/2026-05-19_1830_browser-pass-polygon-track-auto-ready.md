# Browser PASS polygon panel + Track auto-ready on open

**Data:** 2026-05-19

## Polygon T1.1 Pass B — Browser PASS

User report: **"ok poligoni funziona"**

Pass B polygon floating panel shell: **ACCEPTED**. Panel opens, closes, drags, resizes, minimizes, toggle button works. No polygon code changes in this task.

Next polygon pass: **Pass C — map draw interaction** (not started here).

## Track UX — auto-arm drawing on open

### Problem
Opening the Track panel required an extra click to start draw mode. Waypoint already auto-arms pick mode on open; Track did not.

### Root cause
`openTrackModal()` set `state.track.pickMode` only when `n > 0 || editingSaved` — fresh open with zero points left pick mode off.

### Fix
Replaced the condition in `openTrackModal()` with:
- Auto-arm `state.track.pickMode = true` on open (like Waypoint auto-pick).
- Guard: do NOT arm if `_trackCompleted`, `waypointPickMode`, `astroPickCenterMode`, `rangeRingsPickCenterMode`, `rangeRingsPickAndCreateMode`, `_rrEditingMoveCenterMode`, or `mapMeasureMode`.
- If arming, clear `waypointPickMode` to avoid conflict.
- Added `ensureMapWaypointsState()` call for safety.

### No auto-rearm after finish/save
- `completeCurrentTrack()` sets `pickMode = false`, `_trackCompleted = true` — unchanged.
- `saveCurrentTrackToLibrary()` calls `trackResetCurrentOnly({ pickMode: false })` — unchanged.
- No new track is created automatically after double-click finish/save.

### Files changed
- `coordinate_converter Claude.html` — ~7 lines changed in `openTrackModal()`

## Static checks
- `<script>` tags: 2 (invariato)
- `<script src>`: 0 (invariato)
- `type="module"`: 0 (invariato)
- `node --check`: SYNTAX OK

## Browser QA checklist
NOT EXECUTED — manual checklist:

1. Open GIS mode
2. Click Track / Traccia button on map
3. Verify track is immediately ready to draw (crosshair cursor, hint visible) without extra clicks
4. Click points on the map to add track points
5. Double-click to finish/save the track
6. Verify it does NOT start a new track automatically
7. Close and reopen Track panel
8. Verify it becomes ready to draw again on open
9. Regression:
   - Waypoint auto-pick still works
   - Waypoint double-click/Enter save still re-arms as before
   - Polygon panel opens, closes, drags, resizes, minimizes
   - Range Rings, Astro, Measure still open
   - No console errors

## Next recommended
Pass C — polygon map draw interaction (`onUp`, draft vertices)

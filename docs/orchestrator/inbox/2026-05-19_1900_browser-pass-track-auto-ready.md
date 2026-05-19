# Browser PASS — Track auto-ready on open

**Data:** 2026-05-19
**Commit testato:** `cf03429`
**User report:** "PASS track auto-ready"
**Esito:** PASS

## Behavior verified

- Track / Traccia opens ready to draw immediately (crosshair cursor, pick hint visible) — no extra button click needed.
- Drawing points on the map works.
- Double-click finish/save does NOT auto-start a new track.
- Reopening Track arms drawing again.

## No code changes in this task

Docs-only session.

## Static checks

NOT NEEDED — docs-only.

## Current stable GIS flow

| Feature | Commit | Esito |
|---------|--------|-------|
| Waypoint auto-pick / re-arm | `c7933bc` | PASS |
| Polygon render Pass A | `6e0b416` | PASS |
| Polygon panel Pass B | `a883b11` | PASS |
| Track auto-ready on open | `cf03429` | PASS |

## Next recommended pass

**T1.1 Pass C — polygon map draw interaction**

### Risks for Pass C

| Risk | Severity | Mitigation |
|------|----------|------------|
| `onUp` / click handler conflicts with Waypoint/Track pick | High | Exclusive mode guard: `polygonDrawMode` must exclude `track.pickMode`, `waypointPickMode`, `astroPickCenterMode`, `rangeRingsPickCenterMode`, etc. |
| Waypoint auto-pick regression | High | Test Waypoint flow after every Pass C edit |
| Track auto-ready regression | High | Test Track open → draw → finish → no re-arm after every Pass C edit |
| Range Rings / Astro / Measure pick conflicts | Medium | Guard in `onUp` handler same as existing pick mode conditions |
| Draft polygon vertex handling | Medium | Use transient `state.polygonDraftVertices[]`; render draft SVG in real-time |
| Accidental auto-rearm loops | Medium | Do NOT auto-rearm polygon draw after save; only arm from explicit "Nuovo poligono" button |
| Panel coexistence with Track/Waypoint floating | Low | Already verified in Pass B PASS |

---

## Future handoff prompt — T1.1 Pass C (copy-paste ready)

```
TASK: GIS — T1.1 Pass C polygon map draw interaction
Mode: CODE
Preferred implementer: Windsurf Cascade
Effort: medium

SESSION / REPO GUARD:
- Repo: mrhz1973/cursor-coordinate-converter
- Local path: C:\Users\mrhz\Documents\AI\GitHub\cursor-coordinate-converter
- Current task: T1.1 Pass C — polygon map draw interaction
- Do not use:
  - C:\Users\mrhz\Documents\AI\GitHub\dev-method
  - mrhz1973/dev-method
  - mrhz1973/alina-lavoro
  - any unrelated repo or folder

MULTI-REPO GUARD:
- Operational repo is cursor-coordinate-converter only.
- dev-method is not part of this task and must not be modified.
- If current git root is not cursor-coordinate-converter, stop.

PREFLIGHT:
1. Confirm current directory.
2. Confirm git root = mrhz1973/cursor-coordinate-converter.
3. Confirm branch = main.
4. Run git status --short.
5. If clean except local tool folders such as .claude/ or .windsurf/, proceed.
6. If behind origin/main and clean, run:
   git pull --ff-only origin main
7. Do not reset, clean, stash, force-push, delete, deploy, tag, release, or rewrite history.

READ:
- docs/orchestrator/latest.md
- docs/orchestrator/inbox/2026-05-19_1900_browser-pass-track-auto-ready.md
- docs/orchestrator/inbox/2026-05-19_1700_plan_t1.1-compound-polygon.md
- Use marker search in coordinate_converter Claude.html only; do not read the full file.

LARGE-FILE RULES:
- Do not read coordinate_converter Claude.html in full.
- Use marker search and narrow reads only.
- Targeted edits only.
- Preserve single-file HTML architecture.
- No npm, bundlers, TypeScript, modules, frameworks, or external dependencies.

BACKGROUND:
- Data layer already implemented: state.gisPolygons[], gisFeatureAdd/Update/Delete, gisSanitizeGeometry/Feature/Properties, saveStore/loadStore.
- Pass A rendering: renderGisPolygonsOverlay() renders state.gisPolygons as SVG overlay on tile map. PASS confirmed.
- Pass B panel: #polygonPanel floating dialog with list, drag/resize/minimize, close/open toggle. PASS confirmed.
- Track auto-ready: openTrackModal() auto-arms pickMode on open. PASS confirmed.
- Waypoint auto-pick/re-arm: fully working. PASS confirmed.
- Transient state already defined in plan: state.polygonDrawMode, state.polygonDraftVertices.
- renderPolygonPanelList() already renders polygon list and has #polygonPanelNewBtn (currently disabled).

PRESERVE (do not break):
- Waypoint auto-pick and re-arm on panel open, double-click save, Enter save.
- Track auto-ready on open and NO auto-rearm after double-click finish/save.
- Polygon panel Pass B behavior (open/close/drag/resize/minimize).
- Range Rings panel and pick modes.
- Astro panel and pick mode.
- Measure panel and draw mode.
- Existing map pan/zoom/tile rendering.

IMPLEMENT ONLY:
1. Polygon draw mode activation:
   - Enable #polygonPanelNewBtn when polygon panel is open and no conflicting pick mode is active.
   - Clicking "Nuovo poligono" enters polygon draw mode: state.polygonDrawMode = true, state.polygonDraftVertices = [].
   - Set cursor crosshair / hint on map (like track/waypoint pick mode).
   - Disable conflicting pick modes (track.pickMode, waypointPickMode) when entering polygon draw.
   - Add polygon draw mode guard in tile-map class toggles (trackSyncPickModeUi or equivalent).

2. Draft vertices from map clicks:
   - In the onUp handler (map click), if state.polygonDrawMode is true:
     - Add [lon, lat] to state.polygonDraftVertices.
     - Re-render draft polygon overlay (SVG polyline/polygon showing current vertices + closing line to first vertex).
     - Do NOT process as track point or waypoint.
   - The onUp handler already has exclusive pick mode checks; add polygon draw mode as a new exclusive branch.

3. Close/finish polygon:
   - Double-click on the map when polygonDrawMode is active and >= 3 vertices: finish polygon.
   - Or: add a "Chiudi poligono" / "Finish polygon" button in the polygon panel that appears during draw mode.
   - On finish:
     - Build GeoJSON geometry: { type: "Polygon", coordinates: [ring] } where ring is draft vertices auto-closed.
     - Call gisFeatureAdd("polygon", { geometry, properties: { name: auto-name, color: default, visible: true, kind: "polygon" } }).
     - Clear draft state: polygonDrawMode = false, polygonDraftVertices = [].
     - saveStore().
     - Re-render: renderGisPolygonsOverlay(), renderPolygonPanelList().

4. Cancel draft:
   - Esc key when polygonDrawMode is active: clear draft, exit draw mode.
   - Or close polygon panel while drawing: clear draft, exit draw mode.
   - Guard in bindHotkeys or equivalent Esc handler.

5. Draft polygon rendering:
   - During draw mode, render draft vertices as SVG overlay (polyline or polygon).
   - Use same SVG container as renderGisPolygonsOverlay.
   - Dashed stroke for draft, distinct from saved polygons.
   - Show vertex markers (small circles) at each draft point.
   - Update on every new vertex added.

6. Update renderPolygonPanelList():
   - After save, re-render list to show new polygon.
   - #polygonPanelNewBtn should be disabled during active draw mode (one polygon at a time).

DO NOT IMPLEMENT:
- Polygon edit (vertex move, add/remove vertex on existing polygon).
- Vertex drag.
- Holes or MultiPolygon.
- Export (Pass D).
- Import.
- Delete (Pass E, unless already trivial and explicitly safe).
- CoT polygon.

MARKER SEARCH TARGETS:
- onUp handler in map interaction (find the existing track/waypoint pick branches)
- state.polygonDrawMode (may or may not exist yet)
- state.polygonDraftVertices (may or may not exist yet)
- renderGisPolygonsOverlay (Pass A renderer)
- renderPolygonPanelList (Pass B list renderer)
- polygonPanelNewBtn (Pass B button)
- trackSyncPickModeUi (pick mode UI sync)
- bindHotkeys (Esc handler)
- tileMapLatLonToPx (coordinate conversion)
- gisFeatureAdd (data layer CRUD)

STATIC CHECKS:
- Confirm no new <script src>.
- Confirm no type="module".
- Confirm existing 2x <script> blocks preserved.
- Run node --check on main script block.

BROWSER QA CHECKLIST:
1. Open GIS mode.
2. Open Polygon panel.
3. Click "Nuovo poligono".
4. Verify cursor changes to crosshair / draw hint appears.
5. Click 3+ points on the map.
6. Verify draft polygon renders with dashed stroke and vertex markers.
7. Double-click (or click "Chiudi poligono") to finish.
8. Verify polygon saved and appears in panel list.
9. Verify polygon renders as filled SVG on map (Pass A renderer).
10. Press Esc during draw mode — verify draft cancelled.
11. Regression:
    - Waypoint auto-pick still works (open Waypoint, click map, double-click save).
    - Track auto-ready still works (open Track, click map, double-click finish, no re-arm).
    - Polygon panel still opens/closes/drags/resizes/minimizes.
    - Range Rings, Astro, Measure still open and function.
    - No console errors.

ALLOWED FILES:
- coordinate_converter Claude.html (targeted edit only)
- docs/orchestrator/latest.md
- docs/orchestrator/inbox/2026-05-19_NNNN_pass-c-polygon-draw.md

COMMIT AND PUSH:
- Do not use git add .
- Stage only the allowed files above.
- Commit message: feat: add polygon draw interaction
- After commit: git push origin main
- Push is explicitly authorized if checks pass and only allowed files are staged.
- Do not stop to ask confirmation for this authorized push.

STOP ONLY FOR:
- unexpected dirty files
- forbidden file touched
- merge conflict
- rejected push / non-fast-forward
- need for force push
- destructive operation
- secret
- deploy/tag/release

FINAL REPORT REQUIRED:
- Repo path
- Branch
- Files changed, confirming only allowed files staged
- git status --short after push
- Commit hash
- Push result
- Static checks result
- Browser QA result or NOT EXECUTED
- Summary of polygon draw mode implementation
- Confirmation dev-method and alina-lavoro were not touched
- Next recommended block
```

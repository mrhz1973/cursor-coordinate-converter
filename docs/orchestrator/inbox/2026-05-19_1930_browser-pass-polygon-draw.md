# Browser PASS — T1.1 Pass C Polygon Draw

**Data:** 2026-05-19  
**Tipo:** Browser QA  
**Stato:** PASS  
**User quote:** "PASS polygon draw"  
**Commit testato:** `4848950`

---

## Test Result: PASS

### Behavior verified

| Check | Result |
|---|---|
| Polygon panel opens | ✓ |
| "Nuovo poligono" starts draw mode | ✓ |
| Map clicks add vertices | ✓ |
| Draft polygon overlay renders (dashed stroke + vertex markers) | ✓ |
| Double-click or "Chiudi poligono" finishes and saves polygon | ✓ |
| Saved polygon appears in panel list | ✓ |
| Saved polygon appears in map overlay (solid fill) | ✓ |
| Cancel / Esc cancels draft | ✓ (accepted) |
| No blocking regression reported | ✓ |

### No code changes in this session

This is a docs-only record of the browser PASS result.

---

## Current stable GIS flow

| Feature | Status |
|---|---|
| Waypoint auto-pick/re-arm | PASS |
| Track auto-ready on open | PASS |
| Polygon render (Pass A) | PASS |
| Polygon panel (Pass B) | PASS |
| Polygon draw interaction (Pass C) | **PASS** |

---

## Static checks

NOT NEEDED — docs-only session.

---

## Next recommended

### Strategic step (before Pass D)

Validate `tools/handoff-generate.mjs` from `dev-method` against this GIS repo:

- Run the generator in dry-run/stdout mode.
- Verify it can produce a valid handoff prompt for the next feature pass.
- This proves the automation pipeline before starting new feature work.

**NOTE:** This step happens in `dev-method` repo, NOT in `cursor-coordinate-converter`. Do not mix.

### Feature step (after generator validation)

**T1.1 Pass D — polygon export GeoJSON/KML.**

---

## Future Handoff Prompt — T1.1 Pass D: Polygon Export GeoJSON/KML

```markdown
TASK: GIS — T1.1 Pass D — polygon export GeoJSON/KML
Mode: CODE
Preferred implementer: Windsurf Cascade
Effort: medium

SESSION / REPO GUARD:
- Repo: mrhz1973/cursor-coordinate-converter
- Branch: main
- Do NOT touch dev-method, alina-lavoro, or any unrelated repo.

LARGE-FILE RULES:
- coordinate_converter Claude.html is a monolithic HTML+JS file (42000+ lines).
- NEVER read the full file.
- Use marker/grep searches and narrow reads (≤50 lines).
- Make targeted edits only.

DISCOVERY:
1. Read docs/orchestrator/latest.md (top 2–3 entries).
2. Read docs/orchestrator/inbox/2026-05-19_1930_browser-pass-polygon-draw.md.
3. Confirm task = T1.1 Pass D polygon export.

PRESERVE (do not break):
- Waypoint auto-pick / re-arm / double-click save
- Track auto-ready on open / no auto-rearm after save
- Polygon draw interaction (Pass C): polygonStartDraw, polygonFinishDraw, polygonCancelDraw
- Polygon render overlay (Pass A): renderGisPolygonsOverlay
- Polygon panel (Pass B): openPolygonPanel, closePolygonPanel, renderPolygonPanelList
- Range Rings, Astro, Measure panels
- All existing pick mode exclusivity logic

IMPLEMENT ONLY:
1. Export state.gisPolygons as GeoJSON FeatureCollection (.geojson file download).
   - Standard RFC 7946 structure.
   - Include feature properties (name, color, created_at).
   - Use existing download helper if present (search for: downloadBlob, downloadFile,
     saveAs, or similar patterns in the codebase).
2. Export state.gisPolygons as KML (.kml file download).
   - Standard KML 2.2 with Document > Placemark > Polygon > outerBoundaryIs > LinearRing.
   - Map polygon color to KML style (hex ABGR).
   - Include polygon name in Placemark/name.
3. Add export UI in polygon panel:
   - Two buttons in polygon panel footer or a small dropdown.
   - Only enabled when state.gisPolygons.length > 0.
   - Labels: "Export GeoJSON" / "Export KML" (or i18n if pattern is clear).

DO NOT IMPLEMENT:
- Import (GeoJSON or KML)
- Edit (vertex drag, rename inline, color change)
- Delete
- Holes / MultiPolygon special handling (export whatever coordinates[] contains)
- CoT polygon
- Broad refactors

STATIC CHECKS (after implementation):
- Confirm 2 <script> blocks (no new ones).
- Confirm 0 <script src= tags.
- Confirm 0 type="module" attributes.
- No new external dependencies.

BROWSER QA CHECKLIST (mark NOT EXECUTED if not run):
1. Open GIS mode, open Polygon panel.
2. Draw and save 2+ polygons.
3. Click "Export GeoJSON" → .geojson file downloads.
4. Open downloaded file → valid GeoJSON FeatureCollection with correct coordinates.
5. Click "Export KML" → .kml file downloads.
6. Open downloaded file → valid KML with Placemark elements.
7. Verify export buttons disabled when no polygons exist.
8. Regression: draw a new polygon after export → still works.
9. Regression: Track pick mode still works.
10. Regression: Waypoint pick mode still works.

DOCS UPDATE:
- Update docs/orchestrator/latest.md with concise entry.
- Create docs/orchestrator/inbox/2026-05-19_HHMM_pass-d-polygon-export.md
  (use actual timestamp).

COMMIT:
- Stage only: coordinate_converter Claude.html + docs files.
- Message: feat: add polygon export
- Push to origin main (authorized).

FINAL REPORT REQUIRED:
- Files changed
- Static check results
- Browser QA status
- Commit hash
- Push result
- Next recommended step
```

---

## Automation note

Before starting Pass D, the `dev-method` repo should validate:

```
node tools/handoff-generate.mjs --repo cursor-coordinate-converter --dry-run
```

This proves the local handoff generator can produce a valid prompt for Pass D
without manual assembly. If the generator is not yet ready, proceed with manual
handoff (this document serves as the manual prompt).

# Browser PASS — T1.1 Pass D Polygon Export GeoJSON/KML

**Data:** 2026-05-20  
**Tipo:** Browser QA (docs-only)  
**Stato:** PASS  
**User quote:** "PASS GIS export"  
**Commit testato:** `4e7d3ff` — `feat: add polygon export`

---

## Test Result: PASS

Test eseguito **manualmente dall’utente**. **Nessuna modifica codice** in questa sessione.

### GeoJSON export — PASS

| Check | Result |
|---|---|
| Download file `.geojson` | ✓ |
| `type: FeatureCollection` | ✓ |
| `features[]` presente | ✓ |
| `geometry.type: Polygon` | ✓ |
| Anello chiuso (primo = ultimo vertice) | ✓ |
| `properties` preservate (`name`, `kind`, ecc.) | ✓ |

**Evidenza utente (estratto):** FeatureCollection con un feature Polygon; ring chiuso su La Spezia area (`9.7887849,44.1053502` … ripetuto al termine); `properties.name` = `"Traccia 20/05/26, 00:32"`, `kind: polygon`.

### KML export — PASS

| Check | Result |
|---|---|
| Download file `.kml` | ✓ |
| Root `<kml>` | ✓ |
| `<Document>` | ✓ |
| `<Placemark>` | ✓ |
| `<Polygon>` / `<outerBoundaryIs>` / `<LinearRing>` / `<coordinates>` | ✓ |
| Coordinate `lon,lat,alt` con alt `0` | ✓ |
| Anello chiuso in `<coordinates>` | ✓ |

**Evidenza utente (estratto):** Placemark con nome poligono; `coordinates` con 6 vertici + chiusura su primo punto.

---

## No code changes

Questo record **non** modifica `coordinate_converter Claude.html` né altro runtime. Aggiorna solo la memoria orchestratore.

---

## Stable GIS flow (post Pass D)

| Feature | Status |
|---|---|
| Waypoint auto-pick / re-arm | PASS |
| Track auto-ready on open | PASS |
| Polygon render (Pass A) | PASS |
| Polygon panel (Pass B) | PASS |
| Polygon draw (Pass C) | PASS |
| Polygon export GeoJSON/KML (Pass D) | **PASS** |

---

## Next recommended step

**T1.1 Pass E — polygon polish / edit / delete** (delete da pannello, rename semplice, visibility polish, azioni lista; scope stretto).

---

## Future Handoff Prompt — T1.1 Pass E: Polygon Polish / Edit / Delete

```markdown
TASK: GIS — T1.1 Pass E — polygon polish/edit/delete
Mode: CODE
Preferred implementer: Cursor
Effort: medium

SESSION / REPO GUARD:
- Repo: mrhz1973/cursor-coordinate-converter
- Local path: C:\Users\mrhz\Documents\AI\GitHub\cursor-coordinate-converter
- Branch: main
- Do NOT touch dev-method, alina-lavoro, or any unrelated repo.

CONTEXT:
- Pass D browser PASS recorded in docs/orchestrator/inbox/2026-05-20_0035_browser-pass-polygon-export.md
- Commit tested for export: 4e7d3ff — feat: add polygon export
- Polygon draw (C), panel (B), render (A), export (D) are stable — preserve them.

LARGE-FILE RULES:
- coordinate_converter Claude.html is monolithic (42000+ lines).
- NEVER read the full file.
- Use marker/grep searches and narrow reads (≤50 lines).
- Targeted edits only. Single-file architecture. No npm/bundlers/TS/modules.

PRESERVE — do not break:
- Waypoint auto-pick / re-arm / double-click save / Enter save
- Track auto-ready on open / no auto-rearm after save
- polygonStartDraw, polygonFinishDraw, polygonCancelDraw, renderPolygonDraftOverlay
- renderGisPolygonsOverlay
- openPolygonPanel, closePolygonPanel, renderPolygonPanelList
- polygonExportGeoJson, polygonExportKml, polygonBuildGeoJson, polygonBuildKml
- Range Rings, Astro, Measure panels
- Pick mode exclusivity, map pan/zoom/tiles

SCOPE (Pass E — implement only):
- Delete support for saved polygons from polygon panel (with in-panel confirm, no window.confirm).
- Simple rename support if low-risk (inline or small editor pattern consistent with monolite).
- Simple visibility toggle polish if needed (list actions).
- Improve panel list row actions for polygons (Modifica/Elimina/Visibilità as appropriate per UI standards).
- Keep implementation narrow; reuse gisFeatureDelete / gisFeatureUpdate / existing patterns.

OUT OF SCOPE:
- GeoJSON/KML import
- Vertex drag
- Advanced polygon editing
- Holes / MultiPolygon advanced handling
- CoT polygon
- Large refactor
- Map provider changes

ALLOWED FILES:
- coordinate_converter Claude.html
- docs/orchestrator/latest.md
- docs/orchestrator/inbox/*.md

FORBIDDEN:
- dev-method repo
- alina-lavoro repo
- package.json / build tooling / deploy / tag / release
- secrets / credentials / .env

STATIC CHECKS (after implementation):
- Confirm 2×`<script>`, 0 new `<script src>`, 0 `type="module"`
- node --check on extracted main script if feasible

BROWSER QA:
- Delete polygon from panel → removed from list and map overlay
- Rename if implemented → persists after reload
- Visibility toggle → overlay respects visible flag
- Export GeoJSON/KML still works after edits
- No regression: draw new polygon, waypoint/track pick, panel float/drag/resize

DOCS:
- Update docs/orchestrator/latest.md and one inbox record for Pass E implementation or PASS.

COMMIT:
- Do not use git add .
- Commit message: feat: add polygon polish controls
- Push to origin main (authorized if checks pass and only allowed files staged).
```

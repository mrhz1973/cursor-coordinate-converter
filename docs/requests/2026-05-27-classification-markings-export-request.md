# Request — Classification markings on exports

Date: 2026-05-27
Repo: mrhz1973/cursor-coordinate-converter
Risk: medium
Requested by: control-plane manual end-to-end validation

## Goal

Add a small, controlled first step toward classification markings on exported products, as listed in roadmap Tier 1 item T1.6.

## Requested change

Ask the implementer to inspect the repository and propose or implement the smallest safe change that helps exported files carry a clear classification marking.

Preferred first step:

1. identify current export flows in the app;
2. determine which export type is safest for a first marking;
3. add a minimal default marking only if it can be done safely;
4. default should be non-sensitive, for example `UNCLASSIFIED`;
5. do not invent a full classification system.

## Constraints

- Do not add secrets.
- Do not use network services.
- Do not touch n8n, control-plane, workflow 40 or workflow 41.
- Do not deploy.
- Do not change unrelated GIS behavior.
- Do not implement CUI/secret handling.
- Do not add user data collection.
- Keep the change small and reviewable.
- If implementation is not safe in one pass, create only a short recommendation in the existing docs.

## Expected control-plane behavior

This commit should trigger workflow 42.
Codex CLI should inspect the request and classify risk.
Cursor should be used for implementation only if Codex recommends a small safe implementation.

## Result

- **Status:** implemented
- **Export type touched:** GeoJSON `FeatureCollection.metadata` (all centralized builders)
- **Default marking:** `classification: "UNCLASSIFIED"` (non-sensitive default only)
- **Files changed:**
  - `coordinate_converter Claude.html` — helper `exportGeoJsonMetadata()`; applied in `buildGeoJSON`, `buildGeoJSONRoute`, `spatialBuildFeatureCollectionFromAppState`, `gisAllAsFeatureCollection`, `savedTrackToFeatureCollection`, waypoint modal GeoJSON export
  - `docs/checkpoint.md`, `docs/session-geolocalizzazione-e-mappa.md`
- **Limitations:** GPX/KML/CSV exports unchanged; no UI, no user preference, no CUI/SECRET handling; `metadata` on FeatureCollection is an app convention (not strict RFC 7946); print/PDF classification flow not extended in this pass

## Browser QA

- **Browser QA:** PASS
- **Date:** 2026-05-27
- **Commit tested:** `c59d2de` (`feat: add minimal export classification marking`)
- **Export type tested:** waypoint GeoJSON (modal waypoint export)
- **Observed metadata:** `classification: "UNCLASSIFIED"`, `kind: "waypoints"`; also `creator: "GOI GIS Tool"`, `generated` ISO timestamp
- **Evidence (metadata excerpt):** `"classification": "UNCLASSIFIED", "kind": "waypoints"`
- **Notes:** file exported correctly; no errors reported; other export formats not re-tested in this QA pass

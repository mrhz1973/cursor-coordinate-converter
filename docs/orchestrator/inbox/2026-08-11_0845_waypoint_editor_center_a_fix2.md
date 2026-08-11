# WAYPOINT-EDITOR-CENTER-A-FIX2 — implementazione

**Data:** 2026-08-11 ~08:45 locale  
**Tipo:** micro-fix UX/JS routine — coordinate input contract  
**Baseline:** `3ac6a4e9adbdcd1bcbac48490fe91464deebc7ad`  
**RUNTIME:** `f4db0016d233879b060b8e5ea03fac98ba789e7e`  
**Subject:** `fix(waypoint): preserve raw coordinate input and center on enter`  
**Blob monolite:** `029b6c1e27d202a22b2601c938a31e51905c4cda`  
**Build:** `WAYPOINT-EDITOR-CENTER-A-FIX2` · **153**  
**Push task:** riuscito  
**Monolite in autosync:** escluso

## Cosa è stato fatto

1. Paste / input debounce / blur: `rewriteField: false` — testo sorgente non riscritto.
2. Cambio `#waypointListCoordFormat`: aggiorna preview via `refreshWaypointEditorCoordConversionPreview` (no rewrite field).
3. Enter su `#wpFieldCoord`: `handleWaypointEditorCoordEnter` — parse, draft, feedback «Conversione: …», `gisMapCenterOnLatLon`; **non** salva.
4. Feedback usa `formatWaypointListCoordinates`.
5. Centra manuale / Salva / `commitWaypointEditor` invariati nel contratto.

## Gate

- Review Claude: non richiesta (ROUTINE)
- Deploy: in corso dopo autosync
- QA: PENDING (ChatGPT)
- `finito`: solo dopo `QA WAYPOINT-EDITOR-CENTER-A-FIX2 PASS operatore`

## Autosync corrente

SHA/push/HEAD = **EXTERNAL_ONLY**

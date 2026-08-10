# WAYPOINT-EDITOR-CENTER-A — autosync post-runtime

**Data:** 2026-08-11 ~01:32  
**Tipo:** BUNDLE RUNTIME ROUTINE — waypoint editor UX  
**Gate:** runtime pushato; deploy GIS-only successivo; **QA FINALE CHATGPT — PENDING**

## Task runtime

- **Commit:** `be97282bdc7749e602d29ea4290191d7a1992c7c`
- **Subject:** `feat(waypoint): add center action to waypoint editor`
- **Push:** riuscito (pre-autosync)
- **Monolite in questo autosync:** **escluso** (policy)

## Identità monolite (task)

- Blob: `13b6855b68fcb4083384c0cff1f12ee1c5c754ab`
- Byte LF/CRLF file: `9851084`
- SHA-256: `e2df7d18e12a7716b7fdda0f8ad44a61d25f3a7f996049435c2d56b19ffebbf7`
- Build: `WAYPOINT-EDITOR-CENTER-A` · **151**
- Detail: center map from current waypoint editor coordinates

## Cosa è stato fatto

1. CTA secondaria `#wpEditorCenter` («Centra») in `#waypointEditor` actions (Nuovo+Modifica, stesso editor).
2. Label i18n esistente `common.center`; tip IT-only `tip.waypointModal.editor.center` (EN/FR frozen).
3. Parser riusato: `parseWaypointEditorCoordText` (stesso path Salva / COORD-MODAL-FORMAT-COPY-A-FIX1).
4. Camera: `gisMapCenterOnLatLon` (viewport-aware `gisMapUsableRect` / `gisMapOffsetVC`).
5. Enabled/disabled da testo `#wpFieldCoord`; **nessun** auto-center su input/paste.
6. Path Centra: **nessun** `saveStore` / `waypointAdd` / mutazione `state.mapWaypoints[]`.

## Controlli

- `node --check` su JS estratto (escluso `application/json` payload): **PASS**
- `git diff --check`: **PASS**
- Payload IGM `feature_count` / `data-feature-count`: **8204** invariato
- Solo file runtime: `coordinate_converter Claude.html`

## Non toccato

Track, poligoni, preferiti (helper condiviso byte-invariato), IGM/CARTO, provider, storage, rete, Workbench FROZEN.

## Prossimo

Deploy GIS-only → TECHNICAL PASS → QA ChatGPT. Auto-`finito` su `QA WAYPOINT-EDITOR-CENTER-A PASS operatore`.

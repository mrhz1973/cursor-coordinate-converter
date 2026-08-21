# GIS POLYGON + WAYPOINT COORD UX — AUDIT + BACKLOG

**Tipo:** READ-ONLY runtime audit → docs-only backlog registration  
**Data:** 2026-08-21  
**origin/main (start = end runtime):** `915d31e748a39fc09cc869cf7f131ee8d2ae47d6`  
**Runtime LIVE:** build **238** · `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2` · blob monolite `c36109d1ebda7470748a3284089bf11b262d01cf`  
**Runtime changes:** **ZERO** (monolite / APP_BUILD / FRONTIER gate invariati)

---

## 1. Identità verificata

| Check | Valore |
| --- | --- |
| `git ls-remote origin refs/heads/main` (pre-audit) | `915d31e748a39fc09cc869cf7f131ee8d2ae47d6` |
| Branch / tree | `main` · clean |
| `HEAD:coordinate_converter Claude.html` | `c36109d1ebda7470748a3284089bf11b262d01cf` |
| `APP_BUILD_NUM` / `APP_BUILD_ID` | **238** / `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2` |

---

## 2. Mappa tecnica — Poligoni

| Area | Path / simboli |
| --- | --- |
| Store | `state.gisPolygons[]` (cap 50) · Feature GeoJSON Polygon `[lon,lat]` |
| Create | `polygonStartDraw` → `_polygonDraftVertices` → `polygonFinishDraw` → `gisFeatureAdd("polygon", …)` → `saveStore` |
| Edit | `polygonEnterEdit` / `polygonSaveEdit` / `polygonCancelEdit` · transient `state._polyEdit` |
| Vertex drag | `mapPolyEditDocDrag*` · `polygonApplyDraggedVertex` · overlay `.poly-edit-handle` |
| Whole move | `polygonToggleMoveMode` · `mapPolyMoveDocDrag*` |
| Insert/delete | `polygonInsertEditVertex` / `polygonDeleteEditVertex` |
| Vertex modal | `#polygonVertexCoordDialog` · `polygonOpenVertexCoordModal` · `polygonVertexCoordFormat` · `polygonParseVertexCoordByFormat` |
| Legs UI | `#polygonPanelEditLegs` (distanza/bearing) — **non** lista lat/lon di tutti i vertici |
| Preset shapes | **ASSENTI** |

**Baseline CLOSED (NON rifare):** P1–P5, P2 drag, P3/P3-ADD, P4, P-VERTEX-MODAL, P-VERTEX-FORMAT, P-UI-UNIFORM, P-UNITS, P-STYLE, list enrichment.

---

## 3. Mappa tecnica — Tracce (pattern riuso)

| Area | Path / simboli |
| --- | --- |
| Editable geometry | `state.track.points[]` (draft); archive = `state.savedTracks[]` read-only fino a `beginEditSavedTrackById` |
| Drag | `mapTrackDocDrag` + `mapTrackDocDragMove/Up` · install in `renderTrackOverlay` su `.trk-handle` |
| Pixel↔LL | `mapClientToLatLonMap` · `trackUpdatePointLatLon` |
| Live HUD | distanza (`updateTrackMapFloatReadout`) — **no** lat/lon live sul vertice |
| Conflict avoidance | `stopPropagation` / CTRL_SEL / document-capture |
| Save | `trackPromptAndSaveCurrent` / `saveCurrentTrackToLibrary` — drag non scrive archive |

**Riuso:** pattern pointer/document-capture + `mapClientToLatLonMap`. **Non** fondere `state.track` con `state.gisPolygons` / `_polyEdit`.

---

## 4. Mappa tecnica — Waypoint

| Area | Path / simboli |
| --- | --- |
| Modal | `openWaypointModal` / `closeWaypointModal` / `requestWaypointModalClose` · `#waypointModal` |
| Store | `state.mapWaypoints[]` · `waypointAdd` / `waypointUpdate` · `saveStore` |
| Format/copy | `#waypointListCoordFormat` · `formatWaypointListCoordinates` · copy lista + `#wpFieldCoordCopyBtn` |
| Parse | `parseWaypointEditorCoordText` → **`autoDetect`** |
| Map pick (GIS) | `waypointPickMode` → draft → `openWaypointEditor({ fromDraft:true })` — **non** chiude |

### Root cause — “click mappa chiude modal”

**GIS basemap click non chiude** la modal (path ~70473–70518).

Close-on-click documentato:

`#waypointModal` listener `click` → `if (ev.target === wm) handleWpClose()` → `requestWaypointModalClose()` (~77794–77796).

Anche Esc / X. Toolbar GIS non chiude; non-GIS può toggle-close (~69696).

Gap = **lifecycle / hit-test floating** da correggere in futuro (**DELICATO**), non rifare coord UX.

---

## 5. Registry FORMAT / PARSE

| Format | format | parse / autoDetect |
| --- | --- | --- |
| DD / signed | `fmtDD` | `parseFreeTextLatLon` / poly format-locked |
| DDM / DMS | `fmtDDM` / `fmtDMS` | idem |
| UTM | `latLonToUTM` + `fmtUTM` | `parseUTMFree` · in `autoDetect` |
| MGRS | `latLonToMGRS` | `mgrsToLatLonExt` · in `autoDetect` |
| Plus / BNG / SK42 GK | convert cards | **in `autoDetect`**; **non** in poly vertex UI |
| Italian / NAD / CH1903… | format-only convert | **no** reverse paste in `autoDetect` |

**Condiviso:** `autoDetect` — Convert, Batch, Track paste, **Waypoint editor**.  
**Poligoni:** `polygonParseVertexCoordByFormat` — **gap** vs auto-detect completo.

---

## 6. Matrice gap

| RICHIESTA | STATO CORRENTE | PATH ESISTENTE | GAP REALE | RIUSO | CATEGORIA | BLOCCO |
| --- | --- | --- | --- | --- | --- | --- |
| Preset quadrato/rettangolo/triangolo | Assente | solo freehand draw | Sì | edit P1–P5 post-create | DELICATO leggero (create) | `GIS-POLYGON-PRESET-SHAPES-A` |
| Vertex drag post-create | **CLOSED** P2 | `mapPolyEditDocDrag*` | No | — | — | BASELINE |
| Live coord + format in drag | Format sì; live lat/lon no | `renderPolygonEditInfo` | Sì (live readout) | format selector | ROUTINE/UX | `GIS-POLYGON-VERTEX-COORD-UX-A` |
| Lista coord ogni vertice in modal | No (solo legs) | `#polygonPanelEditLegs` | Sì | vertex modal/format | ROUTINE | idem |
| Copy per vertice | No | — | Sì | copy waypoint pattern | ROUTINE | idem |
| Paste + autoDetect all formats | Format-locked | `polygonParseVertexCoordByFormat` | Sì | `autoDetect` | DELICATO (editor) | idem |
| WP format/copy/paste/autoDetect | **CLOSED** | COORD-MODAL-FORMAT-COPY-A | No | — | — | BASELINE |
| WP map-click non chiude modal | Path basemap OK; self-target close | `ev.target === wm` | Sì (lifecycle) | — | **DELICATO** | `GIS-WAYPOINT-COORD-UX-A` |

---

## 7. Backlog items registrati

Casa: [`docs/work-units/WU-0005-0009-roadmap.md`](../../work-units/WU-0005-0009-roadmap.md) (sezione Map UX + sottosezioni).

| ID | Stato |
| --- | --- |
| `GIS-POLYGON-PRESET-SHAPES-A` | **BACKLOG / NOT OPENED** |
| `GIS-POLYGON-VERTEX-COORD-UX-A` | **REVIEW PACKAGE READY** (build 239 · branch `review/GIS-POLYGON-VERTEX-COORD-UX-A-239` · **NOT deployed**) |
| `GIS-WAYPOINT-COORD-UX-A` | **BACKLOG / NOT OPENED** (scope primario = lifecycle; coord = baseline) |

**Non** aperti. **Non** FRONTIER. **Non** deploy. ID nuovi: nessun equivalente preesistente nel registry.

---

## 8. Proposta gesture forme (sintesi)

Vedi tabella in roadmap § `GIS-POLYGON-PRESET-SHAPES-A`. Decisioni prodotto necessarie: gesture A vs B per quadrato; rettangolo asse-allineato vs rotazione; triangolo 3-click vs base+apice. Output sempre Feature in `state.gisPolygons[]` + stesso edit mode.

---

## 9. Invarianti

- monolite blob = `c36109d1ebda7470748a3284089bf11b262d01cf`
- build 238 invariato
- FRONTIER idle / gate none (non toccato in questo pass docs)
- `state.mapWaypoints[]` semantics non toccate
- zero runtime changes

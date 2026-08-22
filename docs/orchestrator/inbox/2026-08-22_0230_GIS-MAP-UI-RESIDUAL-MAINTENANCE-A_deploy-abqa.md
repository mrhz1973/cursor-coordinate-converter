# GIS-MAP-UI-RESIDUAL-MAINTENANCE-A — DELICATO + deploy GIS + ABQA PASS

**BLOCK-ID:** `GIS-MAP-UI-RESIDUAL-MAINTENANCE-A`  
**Categoria:** DELICATO — residual UI maintenance (4 finding QA preesistenti)  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE:** **QA FINALE CHATGPT — PENDING**

## Backlog consumati (storico preservato)

| Backlog | Esito nel bundle |
| --- | --- |
| `GIS-WAYPOINT-EDITOR-COORD-FORMAT-FIELD-SYNC-A` | Cambio `Formato coordinate` → rewrite immediato `#wpFieldCoord` da draft lat/lon; no save / no `mapWaypoints` mutate |
| `GIS-POLYGON-PANEL-DISMISS-TOOLBAR-SYNC-A` | No backdrop-self dismiss GIS; `mapToolDeactivate` su finish; `trackSyncPickModeUi` su open/close |
| `GIS-TRACK-TOOLBAR-FLYOUT-AUTOCLOSE-A` | Selezione Poligoni / Range & Bearing → `mapTrackToolbarMenuOpen=false` + `refreshTileMapForTrackUi` |
| `GIS-WAYPOINT-TABLE-COL-RESIZE-A` | Drag fluido Nome/Dettagli; `table-layout:fixed`; min JS-only; session-only |

## A — Runtime candidate

| Campo | Valore |
| --- | --- |
| Tip | `b26409724d8514a14bb84971d24db345635a5574` |
| Catena | `bfb4dbc` (4 item) → `b264097` (openPolygonPanel toolbar sync) |
| Build / ID | **249** / `GIS-MAP-UI-RESIDUAL-MAINTENANCE-A` |
| Blob | `f0bb0be1f7216dd8c708b8210704c2ec518df97b` |
| Byte LF / SHA-256 | `10855216` / `4cff438c3c210556747e65790ef154dd9e6c2481a5da2c7f2cdeadc31199523d` |
| BASE LIVE | tip `aa6e8f5…` / **248** / blob `dadbf8af…` |

## B — Deploy GIS-only — PASS

CMP **PASS** · proxy PID invariato (`1387`) · HTTP 200 su `http://100.114.7.53:8000/…`

**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=b264097`

## C — Automated Browser QA — PASS

**AUTOMATED BROWSER QA GIS-MAP-UI-RESIDUAL-MAINTENANCE-A PASS** · **19/19**  
JSON: [`2026-08-22_0230_GIS-MAP-UI-RESIDUAL-MAINTENANCE-A-abqa.json`](2026-08-22_0230_GIS-MAP-UI-RESIDUAL-MAINTENANCE-A-abqa.json)

Format sync DD↔MGRS↔DMS↔UTM; no WP mutation; polygon finish → map click keeps panel; X → toolbar inactive; reopen active; flyout autoclose Poligoni + R&B; col resize Nome/Dettagli min utile; no overlap; metrics 1dp; narrow; console clean.

## Gate

**QA FINALE CHATGPT — PENDING** (una sola QA operatore per il bundle). **Non** `finito` finché PASS operatore.  
**Oggetti GIS = FROZEN / MAINTENANCE-ONLY** invariato.

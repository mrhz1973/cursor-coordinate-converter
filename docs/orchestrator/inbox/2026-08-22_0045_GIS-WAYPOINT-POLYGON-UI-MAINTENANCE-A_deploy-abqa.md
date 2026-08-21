# GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A — REVIEW N/A (ROUTINE) + deploy GIS + ABQA PASS

**BLOCK-ID:** `GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A`  
**Categoria:** ROUTINE — UI maintenance bundle  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE:** **QA FINALE CHATGPT — PENDING**

## Backlog consumati (storico preservato)

| Backlog | Esito nel bundle |
| --- | --- |
| `GIS-WAYPOINT-MODAL-LAYOUT-A` | Implementato — CSS/layout: no spill lista su «Nome sulla mappa»; radiogroup sopra `#wp-listWrap` |
| `GIS-POLYGON-METRICS-COMPACT-FORMAT-A` | Implementato — `formatPolygonCompactNum` / path `fmtPolygonAreaPlain` + `formatPolygonDistanceMeters` (1 decimale presentation-only) |

## A — Runtime candidate

| Campo | Valore |
| --- | --- |
| Tip | `aa6e8f5a5af7b215fcda7bc7055b2b6472143396` |
| Build / ID | **248** / `GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A` |
| Blob | `dadbf8af428770ef1724bcd6444b17caeb69fdcf` |
| Byte LF / SHA-256 | `10853680` / `d5eb7d8c2e5ff8c1d50dd2fd55be88c7b2fe05c53316031a6d888739a3fa2390` |
| BASE LIVE | tip `ac4789e` / **247** / blob `6e10d568…` |

## B — Deploy GIS-only — PASS

CMP **PASS** · proxy PID invariato (`1387`) · HTTP 200 su `http://100.114.7.53:8000/…` (bind Tailscale; non 127.0.0.1)

**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=aa6e8f5`

## C — Automated Browser QA — PASS

**AUTOMATED BROWSER QA GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A PASS** · **18/18**  
JSON: [`2026-08-22_0045_GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A-abqa.json`](2026-08-22_0045_GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A-abqa.json)

Waypoint: lista lunga, zero overlap radiogroup/righe, scroll, click Modifica, resize, narrow, minimize/restore.  
Poligoni: draft/list/edit/legs a 1 decimale; helper compact; no overflow metrico; precisione interna area non forzata a 1dp.

## Gate

**QA FINALE CHATGPT — PENDING** (una sola QA operatore per il bundle). **Non** `finito` finché PASS operatore.

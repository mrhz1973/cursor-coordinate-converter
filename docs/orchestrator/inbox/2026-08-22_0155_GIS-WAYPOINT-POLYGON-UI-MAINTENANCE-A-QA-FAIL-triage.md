# TRIAGE — QA FAIL GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A (build 248 vs LIVE 247)

**Data:** 2026-08-22  
**Trigger:** `QA GIS-WAYPOINT-POLYGON-UI-MAINTENANCE-A FAIL operatore`  
**Candidate:** tip `aa6e8f5…` · build **248** · blob `dadbf8af…`  
**Baseline LIVE:** tip `ac4789e…` · build **247** · blob `6e10d568…`  
**Esito triage:** **NESSUNA regressione del bundle** → **FIX1 NON aperto** · **non finito** · **non promuovere PASS**

## Diff monolite 247 → 248 (unico)

`git diff ac4789e aa6e8f5 -- coordinate_converter Claude.html` tocco **solo**:

1. CSS/DOM `.wp-map-name-row` / `#wp-listWrap` (overlap layout)
2. `formatPolygonCompactNum` + path metriche poligono (1 dp presentation)
3. `APP_BUILD_*` + selftest triad

## Hash funzioni rilevanti (identici 247 ≡ 248)

| Funzione / area | SHA-256 prefisso chunk |
| --- | --- |
| `syncWaypointListCoordFormatSelect` | `bec65bbc1d5d` |
| `refreshWaypointEditorCoordConversionPreview` | `e968bdcb9696` |
| `ensureWpModalNameColResizeWired` | `064193e0e715` |
| `openPolygonPanel` | `1531595c2c1c` |
| `closePolygonPanel` | `103e1af62bf2` |

Conteggi `wp-name-col-resize` / `Range` invariati.

## Matrice finding

| # | Finding | Introdotto/regredito da bundle 248? | Azione |
| --- | --- | --- | --- |
| 1 | Editor WP: Formato coordinate non riscrive `#wpFieldCoord` | **NO** — comportamento documentato «No field rewrite» in `refreshWaypointEditorCoordConversionPreview` / `wireWaypointListCoordFormatOnce` (identico 247) | Backlog **nuovo** `GIS-WAYPOINT-EDITOR-COORD-FORMAT-FIELD-SYNC-A` — **non** riusare `GIS-WAYPOINT-COORD-UX-A` (lifecycle) né riaprire `COORD-MODAL-FORMAT-COPY-A` CLOSED |
| 2 | Click mappa chiude/sparisce modal Poligoni; toolbar resta blu a modal chiusa | **NO** — `closePolygonPanel` / sync `polygon-open` / `track-map-toggle` identici | Backlog **nuovo** `GIS-POLYGON-PANEL-DISMISS-TOOLBAR-SYNC-A` — **non** fuso in `GIS-POLYGON-WAYPOINT-INTERACTION-A` (scope drawing/snap diverso) |
| 3 | Flyout Traccia (Poligoni / Range & Bearing) non si richiude dopo selezione | **NO** — menu `mapTrackToolbarMenuOpen` / `track-map-menu-toggle` non toccati dal bundle | Backlog **nuovo** `GIS-TRACK-TOOLBAR-FLYOUT-AUTOCLOSE-A` |
| 4 | Resize colonne tabella Waypoint erratico / non restringe al minimo utile | **NO** — `ensureWpModalNameColResizeWired` identico; **non** è `GIS-WAYPOINT-MODAL-LAYOUT-A` (overlap radiogroup, già consumato) | Backlog **nuovo** `GIS-WAYPOINT-TABLE-COL-RESIZE-A` |

## Obiettivi bundle preservati

- No overlap gruppo Nome sulla mappa / lista → **invariato** (candidate 248)
- Metriche poligono 1 decimale presentation-only → **invariato**

## Decisione

- **FIX1 runtime: NON eseguito**
- Candidate **248** resta su VPS come candidate; LIVE resta **247** fino a decisione successiva
- Gate: **QA FAIL / TRIAGE COMPLETE — no FIX1** · **non finito**

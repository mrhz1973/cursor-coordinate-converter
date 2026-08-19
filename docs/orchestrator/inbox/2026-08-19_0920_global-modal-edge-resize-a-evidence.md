# GLOBAL-MODAL-EDGE-RESIZE-A — evidence candidato 232

**BLOCK-ID:** `GLOBAL-MODAL-EDGE-RESIZE-A` (voce backlog già persistita 2026-08-19; **non** nuovo ID)  
**Casa:** roadmap *Estensione backlog — UX poligoni + modal standard*  
**Categoria:** DELICATO / globale  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**NON** deploy · **NON** ABQA live · **NON** QA operatore · **NON** finito

## Baseline LIVE (preservata)

| Campo | Valore |
| --- | --- |
| LIVE | `f90c503355d7c98eaf300f7f1afe647102a2330f` · build **231** · `CARTO-IIM-PROVIDER-A-FIX1` |
| LIVE blob | `52376f48e4f181939ee2ee3c1cdd88d1c2dd3038` |

## Candidate (immutabile post-feat)

| Campo | Valore |
| --- | --- |
| FULL SHA | `942ab73e73fa61870ab85a72d871b35f0105e8f2` |
| Build / APP_BUILD_ID | **232** / `GLOBAL-MODAL-EDGE-RESIZE-A` |
| Blob monolite | `ae5b4df61f76b7b16d4e889a618abf7cf1010c80` |
| Bytes LF | `10807943` |
| SHA-256 LF | `2fbfc107dcb370fd70cb68e792d5e517e5d7b48b376f1506cd86946ba13bbad9` |
| Diff vs LIVE HTML | `+315 / −99` |

## Infrastruttura

- Shared: `gisPanelEnsureEdgeResizeHandles`, `gisPanelResizeCompute`, `gisPanelAttachResize` (Pointer Events, capture, `pointerup`/`pointercancel` cleanup).
- Hit-zone: 8 handle (`n s e w nw ne sw se`); inject automatico se il dialog ha già almeno un handle resize.
- CSS `GLOBAL-MODAL-EDGE-RESIZE-A`: `::after` grip **disattivato**; bordi full-length 8px (12px ≤600px); angoli 14px; cursori `ew-resize` / `ns-resize` / diagonali.
- Header actions `z-index:8` così ×/minimize restano cliccabili sopra la hit-zone.
- **Nessun** `resize:` CSS nativo sui dialog floating.

## Famiglie censite (applicate via attachResize esistente)

Partecipano (già `gisPanelAttachResize` / handle HTML): `#favoritesPanel`, `#historyPanel`, `#searchPanel`, `#layersPanel`, `#measurePanel`, `#rangeRingsPanel`, `#polygonPanel`, `#astroPanel`, `#cartoIgmPanel`, `#dflightPanel`, `#dflightDetailsPanel`, `#gisWorkbenchPanel` (solo chrome resize, **nessuna** logica Oggetti GIS), `#waypointModal`, `#trackModal` (`track-modal-resize`), `#routingPlannerPanel`, `#helpOverlay`, `#convertModal`, `#qrModal`, picker astro se già handle.

**Eccezioni:** dialog nativi browser; drawer/tab non-floating; contenuto interno (scroll, tabelle). Workbench: nessuna modifica al catalogo/oggetti.

## Probe (Node, `gisPanelResizeCompute`)

A RIGHT `e +40` → w 400→440, x invariata **PASS**  
B LEFT `w +40` → w 360, x 100→140 **PASS**  
C BOTTOM `s +50` → h 350, y invariata **PASS**  
D TOP `n +50` → h 250, y 80→130 **PASS**  
E se/sw/ne/nw **PASS**  
min-width clamp **PASS**

Selftest in-app: `gisModalEdgeResizeSelfTest` agganciato a `GOIDflight.selfTest` (EDGE_A…N, 8 handle, no `::after`, drag/min/restore/dock symbols, pointer cleanup, compute indipendente due rect).

## Regression (codice / simboli)

- Drag header: `gisPanelAttachDrag` invariato; ignoreSelector già esclude `[data-role="gis-panel-resize"]`.
- Minimize/restore/close/dock: non toccati.
- Side-by-side: `gisPanelAttachResize` **non** chiama `dflightEnsurePairLayout` (resta sull'`onResizeEnd` D-Flight esistente).
- Oggetti GIS FROZEN: nessun change a store/workbench data.
- CARTO search/filter, D-Flight close-cleanup, UKHO: **non** implementati.

## STOP

**REVIEW GPT-SOSTITUTIVA — PENDING** su FULL SHA `942ab73e73fa61870ab85a72d871b35f0105e8f2`.

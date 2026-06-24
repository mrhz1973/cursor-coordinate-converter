# Riepilogo — POLY-UX-STABILITY-A2-B1 toggle restore-first

**Data:** 2026-06-24  
**Blocco:** POLY-UX-STABILITY-A2-B1  
**Commit runtime:** `db2f6ea` — `fix(gis): restore minimized polygon panel from toolbar`

## Cosa è stato fatto

- Nei due toggle Poligoni (`[data-role="polygon-open"]` e `[data-role="track-map-polygons"]`), `isOpen()` restituisce `false` quando `gisPanelIsMinimized("polygonPanel")`.
- Stato minimizzato (`dlg.open` + `polygonPanelOpen` + classe minimized) → toggle chiama `openPolygonPanel()` → branch restore-first esistente (`gisRestoreMinimizedPanel`).
- Chiuso e aperto-visibile: comportamento invariato.

## File modificati

- `coordinate_converter Claude.html` — sole regioni toggle ~L35401–35408 e ~L35514–35521 (+6 −2 linee).

## Non toccato

- `openPolygonPanel`, `closePolygonPanel`, draw, auto-arm, chip/dock, A1 RAF, P2 drag, edit, P7-B1, `APP_BUILD_ID` (`B5.5Z`).

## QA / deploy

- `node --check`: PASS (2 blocchi inline)
- `git diff --check`: PASS
- Deploy VPS: **pending**
- QA operatore A2-B1: **pending**

## Prossimo passo

- Deploy GIS-only + QA operatore (checklist A2-B1 in prompt blocco).
- Backlog separato: **A2-B2** edit-safe close, **A2-B3** auto-arm/minimize all'apertura.

## Git

- Push runtime: `75f9361` → `db2f6ea` su `origin/main`
- Monolite **incluso** nel commit runtime

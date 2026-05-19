# Pass B — Polygon floating panel shell

**Data:** 2026-05-19
**Pass:** T1.1 Pass B
**Scope:** floating `#polygonPanel` shell + lista UI (no draw mode, no interaction)

## Modifiche

### `coordinate_converter Claude.html`

1. **CSS bbox-selecting:** aggiunto `.tile-map.bbox-selecting .tpoly-btn` alla regola hide durante selezione bbox.
2. **CSS tile-ctrls sizing:** aggiunto `.tile-map .tile-ctrls .tpoly-btn` alla regola dimensionamento controlli mappa.
3. **`attachPolygonPanelFloatingGis(dlg)`** (nuova): wiring drag (`gisPanelAttachDrag`), resize (`gisPanelAttachResize`), layout persistence (`gisPanelApplyLayout`), bring-to-front (`gisPanelAttachBringToFront`). Pattern identico a `attachRangeRingsPanelFloatingGis`.
4. **`openPolygonPanel()`** (fix): sostituito chiamate a funzioni inesistenti `gisInitPanelDrag`/`gisInitPanelResize`/`gisApplyPanelLayout` con `attachPolygonPanelFloatingGis(dlg)`.

### Elementi già presenti a HEAD (non modificati in questa sessione)

- Dialog HTML `#polygonPanel` con head, body, close/minimize, resize handles
- CSS `.tpoly-btn` styling (button + active + hover)
- Map button rendering con SVG hexagon icon (`data-role="polygon-open"`)
- Click handler via `gisToolButtonToggle`
- Close button handler `#polygonPanelClose`
- `closePolygonPanel()`, `_polygonPanelLayoutOpts()`, `renderPolygonPanelList()`

## Static checks

- **`<script>` tags:** 2 (invariato)
- **`<script src>`:** 0 (invariato)
- **`type="module"`:** 0 (invariato)
- **`node --check`:** SYNTAX OK (lines 10119–42599)

## Browser QA

NOT EXECUTED — checklist manuale:

1. Aprire in GIS mode
2. Cliccare pulsante poligono (esagono) sulla mappa
3. Verificare apertura pannello floating "Poligoni"
4. Verificare drag del pannello
5. Verificare resize del pannello
6. Verificare chiusura con × e riapertura
7. Verificare toggle con pulsante mappa (active/inactive)
8. Verificare minimize/restore
9. Verificare lista vuota "Nessun poligono"

## Prossimo

Pass C — map draw interaction (`onUp`, draft vertices)

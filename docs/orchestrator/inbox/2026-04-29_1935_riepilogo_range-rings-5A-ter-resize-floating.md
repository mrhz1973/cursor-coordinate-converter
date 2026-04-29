# Riepilogo operativo — Range Rings **5A-ter** (resize/drag floating)

**Timestamp nome file:** 2026-04-29 19:35 (locale Cursor).

## Problema osservato

Il pannello `#rangeRingsPanel` risultava poco **lavorabile**: drag/resize dichiarati in JS ma **handle di resize non efficaci** / poco visibili rispetto agli altri pannelli GIS.

## Causa

Il markup usava `gis-panel-resize-handle` come **Layers / Favoriti / Cerca**, ma il **CSS** posiziona esplicitamente gli handle solo per `#waypointModal`, `#convertModal`, `#searchPanel`, `#favoritesPanel`, `#layersPanel`, `#trackModal` — **`#rangeRingsPanel` non era incluso**, quindi gli handle restavano senza anchor ai quattro angoli (comportamento visivo/usabilità degradato). Mancava inoltre il blocco `body.gis-mode dialog#rangeRingsPanel…` comune agli altri dialog floating.

## Fix applicato

1. **CSS**
   - `body.gis-mode dialog#rangeRingsPanel.range-rings-panel` — `position:fixed`, `overflow:hidden`, `max-width`/`max-height` viewport, `z-index:24` (sotto Cerca/Favoriti).
   - Regole dedicate `#rangeRingsPanel .gis-panel-resize-handle[data-handle=…]` per **se/nw/ne/sw** (stesso schema Layers/Search) + `::after` per grip visibili agli angoli (NE senza alone, come gli altri).
   - `#rangeRingsPanelHead` in gruppo **cursor: grab** / `dragging` con Waypoint/Convert.
   - `body:not(.gis-mode) #rangeRingsPanel .gis-panel-resize-handle { display:none }`.

2. **JS (`_rangeRingsPanelLayoutOpts`)**
   - `minW` 380, `minH` 300, `defaultW` 500, `defaultHeightFraction` 0.58, `defaultHeightCap` 640, `bodyMinH` 120 per area lista/form più usabile.
   - Drag: `ignoreSelector` esteso con `[data-role="gis-panel-resize"]` per non competere col resize.

## File modificati

- `coordinate_converter Claude.html`
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-29_1935_riepilogo_range-rings-5A-ter-resize-floating.md` (questo)

## Cosa non è stato toccato

Logica dati Range Rings, export, selezione, overlay, Strumenti drawer, Track/Waypoint/Layers/Offline/CoT/geocoding/OPSEC/GPS/coord-cycle.

## Verifiche

- `git diff --check -- "coordinate_converter Claude.html"`: ok.
- `node --check` primo `<script>` inline: ok.

## Nota operativa (futuri tool tattici on-map)

Tutti i **futuri** tool tattici on-map che aprono pannelli floating dovranno riusare lo stesso **pattern**: `gis-panel-floating` + **drag** (`gisPanelAttachDrag` + head `gis-panel-drag-head`) + **resize** (`gis-panel-resize-handle` con `data-role="gis-panel-resize"`) + **regole CSS per-id** che ancorano gli handle ai quattro angoli (come Search/Layers) + **`gisPanelClampRect` / `_…PanelLayoutOpts`** per min/max e viewport.

## Prossimo passo consigliato

Smoke test: trascina titolo, ridimensiona da **se** e **nw** (e altri angoli), verifica clamp dopo resize finestra; Strumenti → Range Rings invariato.

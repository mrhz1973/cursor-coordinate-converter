# Riepilogo finito sessione — B5.5A-1 PASS piano/diagnosi export JPG avanzato

**Data:** 2026-06-20  
**Trigger:** `finito`  
**Commit principale:** `a9cb078` — `docs(memory): register B5.5A-1 PASS piano/diagnosi export JPG avanzato`

## Cosa è stato fatto

- Registrato in OM §7 + WU il blocco **B5.5A-1 — Export JPG avanzato: overlay selezionabili, tab coordinate, risoluzione, zoom — PASS piano/diagnosi**.
- Aggiornamento **puntuale** del bullet B5.5A preesistente (no duplicazioni); bullet separato, mega-bullet WU-0009B **non riflowato**.
- Blocco **solo documentale**: `coordinate_converter Claude.html` non toccato; nessun deploy/restart; Planet-Clone/proxy non toccati.

## Diagnosi registrata (sintesi)

- `exportMapAsJpg(opts)` (~L19719) = DOM-to-canvas **1×** su `.tile-map`; `rasterizeSvgOntoCanvas` (~L19691) rasterizza SVG inline, scalabile via `dw/dh`.
- Dialog `#jpgExportDialog` (~L9890): solo `#jpgExportIncludeScale`; confirm passa `{ includeScale }`; scala via `computeMapScaleModel` + `drawJpgExportScale` (B5.4d/B5.4eB **da preservare**).
- JPG **include**: sfondo, `img.tile`, `.tile-grid` MGRS, `.tile-marker svg`, scala opzionale.
- JPG **NON include**: overlay SVG separati su `.tile-layer` (`.saved-tracks-overlay`, `.waypoints-overlay`, `.range-rings-overlay`, `.gis-polygons-overlay`, + draft/GPS/coverage/bbox); `.tile-readout` (PUNTO+CURSORE) fuori — **cursore escluso per costruzione**.
- Canonici: `state.mapWaypoints[]`/`savedTracks[]`/`track`/`gisPolygons[]`/`rangeRingSets[]`/`lastPoint|viewCenter`/`primary`/`mapZoom`/`mapSize`.

## Decisione tecnica

- WYSIWYG SVG capture overlay live via `rasterizeSvgOntoCanvas`; **no** re-render geometria-per-geometria fase 1.
- **No** fetch rete / **no** tile cache/offline/proxy per B5.5B-E.
- Zoom reale isolato in **B5.5Z** (può richiedere tile diverse → OPSEC strict/forced-offline/cache/proxy opt-in).

## Scomposizione / raccomandazione

- B5.5B scaffolding dialog + config + cattura overlay base (no zoom); B5.5C selezione granulare + label wpt; B5.5D tab coordinate su canvas (cursore escluso); B5.5E risoluzione 1×/2×/3× (no fetch); B5.5Z studio zoom reale.
- **Primo blocco runtime consigliato: B5.5B** (gap principale, rischio minimo, riuso SVG live, no rete, scala intatta).

## File modificati (commit principale)

- `docs/OPERATING_MEMORY.md`
- `docs/work-units/WU-0005-0009-roadmap.md`

## Monolite

- **NON incluso** in `a9cb078` (docs-only). Runtime resta **B6.6C** `41f180b`; deploy VPS `69fa6cf` invariato.

## QA

- `node --check`: non applicabile (sola modifica Markdown, nessun JS toccato).
- QA operatore: n/a (nessuna modifica runtime).

## Push step 2

- **OK** — `be4a0c6..a9cb078 main -> main`

## git status --short (post step 2)

```
(clean)
```

## Prossimo passo

- **B5.5B** — scaffolding dialog + config + cattura overlay SVG base (runtime), oppure **B5.4f** plan etichette scala per-tacca.

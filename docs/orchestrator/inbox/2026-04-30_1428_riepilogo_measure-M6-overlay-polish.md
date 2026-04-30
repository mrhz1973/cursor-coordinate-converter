# Riepilogo — Misura M6: polish overlay e leggibilità tema

**Data:** 2026-04-30 14:28 UTC  
**Blocco:** M6 (overlay readability)  
**Perimetro:** `renderMapMeasureOverlay` + CSS scoped overlay (nessun `finito`)

## Cosa è stato migliorato

- Le label dell’overlay Misura ora hanno una classe dedicata `.mm-label` e un **halo** (stroke + `paint-order`) per rimanere leggibili su tile chiari/scuri e in tema light/dark.
- I colori della label (testo + background + bordo + halo) sono ora controllati da CSS vars scoped a `.tile-measure-overlay` con override per `html[data-theme="light"]` e `html[data-theme="dark"]`.
- Geometria/posizionamento label invariati (nessuna collision detection aggiunta; solo miglioramento contrasto).

## File toccati

- `coordinate_converter Claude.html`
- `docs/orchestrator/latest.md`
- `docs/orchestrator/inbox/2026-04-30_1428_riepilogo_measure-M6-overlay-polish.md`

## Regioni / funzioni toccate

- JS: `renderMapMeasureOverlay` → `addLabel` (classe `.mm-label` e fill/stroke via CSS vars)
- CSS: `.tile-measure-overlay` + `.tile-measure-overlay .mm-label` + override light/dark

## Conferme vincoli

- **M4 storico**: non implementato.
- **M5 export**: non modificato funzionalmente.
- **Geometrie misura**: non persistite (invariato).
- **Matematica**: invariata (solo stile).
- Non toccati Range Rings / Track / Waypoint overlay (selector scoped a `.tile-measure-overlay`).

## QA eseguito

- `git diff --stat`
- `git diff --check -- "coordinate_converter Claude.html"`
- `node --check` su JS estratto dal `<script>`
- Test manuale: da eseguire in browser (linea 2 punti, poligono 3+, direct, dark/light, tile chiaro/scuro, drag/delete, pan/zoom, undo, clear, Esc, export M5, regressioni RR/Track/WP).

## Rischi residui

- Basso: le variabili CSS scoped potrebbero richiedere micro-tuning se emergono casi estremi su tile molto rumorose; il background rect resta come fallback.

## Prossimo passo consigliato

- Fare un passaggio rapido di QA manuale sui due temi (light/dark) e su OSM/sat per confermare contrasto.


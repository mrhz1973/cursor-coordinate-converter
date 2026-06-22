# Riepilogo finito sessione — WU-0007 B4X1 measurement label collision avoidance

**Data:** 2026-06-22  
**Commit task:** `debd5b4` — `feat(measure): WU-0007 B4X1 label collision avoidance su segmenti corti`  
**Push task:** riuscito (`4393641..debd5b4` → `origin/main`)  
**Pre-flight:** branch `main`, working tree pulito, HEAD = `4393641` = seed atteso.

## Implementazione

Micro-blocco localizzato in `renderMapMeasureOverlay()`:

- `mmEstimateLabelPillSize(txt)` — stima pill pre-placement
- `mmMeasurePillDimsFromTextEl(textEl, txtFallback)` — bbox reale post-DOM
- `mmLineLabelNormalOffset(segLenPx, rw, rh)` — offset normale dinamico (base 14px, bump se `seg < rw + 22`, cap 150px)
- `addLabel(..., opts)` — raffinamento `requestAnimationFrame` solo per etichette segmento linea (`lineSegLen`, anchor, normale)
- Etichetta riepilogo poligono (centroide): invariata

## Algoritmo

1. `segLenPx = hypot(dx, dy)` in pixel schermo
2. Stima `rw/rh` pill da testo
3. `off = max(14, rh/2 + stroke + pad)`; se `seg < rw + 22` → `off += (rw + 22 - seg) * 0.42`; cap 150
4. Posizione: midpoint + off × normale; rotazione/flip invariati
5. rAF: rimisura con `getBBox`/`getComputedTextLength`, riapplica offset

## File modificati

- `coordinate_converter Claude.html` (+96/−11 netto regione overlay)
- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md` §WU-0007 B4X1

## Invariato

- Formule distanza/bearing, modelli dati, export, altri overlay
- `APP_BUILD_ID` = `B5.5Z`
- WU-0007 B4 PASS (`54d8586`)

## QA

- `git diff --check` — OK
- `node --check` JS inline — OK
- Nessun `<script src>` aggiunto
- **QA browser operatore: pending** — checklist in roadmap; cache-buster `?v=debd5b4`

## Prossimo passo

QA operatore B4X1: segmento lungo/corto, zoom, drag handle, Esc/clear.

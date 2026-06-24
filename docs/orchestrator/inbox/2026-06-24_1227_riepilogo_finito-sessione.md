# Riepilogo finito — POLY-UX-STABILITY-A2-B3 apertura senza auto-arm

**Data:** 2026-06-24

## Runtime

| Voce | Valore |
|------|--------|
| Commit | **`87cbe64`** |
| Messaggio | `fix(gis): open polygon panel without auto-starting draw` |
| Modifica | `openPolygonPanel()` — rimosso blocco auto-`polygonStartDraw()` (13 righe) |
| Azione esplicita | `#polygonPanelNewBtn` → `onclick="polygonStartDraw()"` |

## Call path

**Prima:** toolbar → toggle → `openPolygonPanel()` → (gate tool) → `polygonStartDraw()` → `polygonDrawMinimizeIfOpen()`

**Dopo:** toolbar → toggle → `openPolygonPanel()` → render lista/barra (pannello visibile, draw false)

**Disegno esplicito invariato:** `#polygonPanelNewBtn` → `polygonStartDraw()` → `polygonDrawMinimizeIfOpen()`

## Invarianti confermati (statico)

- `polygonStartDraw()` byte-invariato
- `polygonDrawMinimizeIfOpen()` byte-invariato
- toggle A2-B1, `closePolygonPanel()` A2-B2-FIX byte-invariati
- nessun nuovo `state.*`
- APP_BUILD_ID `B5.5Z`

## QA

- `node --check`: PASS (2 script inline)
- Deploy VPS: **pending**
- QA operatore: **pending**

## Docs (finito)

- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md`

## Catena A2

- A2-B1: CLOSED / PASS (`db2f6ea`)
- A2-B2-FIX: CLOSED / PASS (`70ed7b3`)
- A2-B3: runtime pubblicato; deploy/QA pending

## Monolite commit runtime

Incluso in `87cbe64`. Autosync esclude monolite.

## Prossimo passo

Deploy VPS GIS-only runtime `87cbe64` + QA operatore A2-B3.

# DOCS-QA-POLYGON-REJECT-TRIGGER — nota QA rifiuto poligono

**Data:** 2026-06-25  
**Tipo:** docs-only routine + autosync orchestratore  
**Monolite:** non toccato (blob `ba8a7f0…` invariato)

## Esito

Aggiunta sezione **«Come innescare il rifiuto canonico del poligono per la QA»** in `docs/QA-CHECKLIST.md`.

## Commit task

- **SHA:** `18f3bfa` — `docs(qa): document polygon rejection trigger`
- **File:** `docs/QA-CHECKLIST.md` (+40 righe)

## Contenuto

- Condizione: < 3 vertici distinti post de-dup → «Geometria non valida», draft preservato
- `gisSameCoord` 1e-7° (~1 cm)
- Zoom 14 ~9–10 m/pixel; punti vicini non bastano
- Procedura mouse: doppio click stesso pixel + terzo punto + doppio clic chiusura
- Riuso QA P5-B1 / P5-B1-FIX / P5-B2-F e futuri

## Non eseguito

- deploy VPS; QA operatore; review Claude; OM §7; roadmap; runtime

## Pre-autosync

```
git rev-parse HEAD:"coordinate_converter Claude.html"
ba8a7f0a8edfee07dff4eb762d0a0309939db43d
```

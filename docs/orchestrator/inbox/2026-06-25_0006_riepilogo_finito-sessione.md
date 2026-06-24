# Riepilogo finito — POLY-PARITY-P3-ADD inserimento vertice su lato

**Data:** 2026-06-25  
**Blocco:** POLY-PARITY-P3-ADD

## Commit task (step 2 finito)

- **SHA:** `5df925f1ef197f448574a25e545cd0888b501a9f`
- **Subject:** `feat(gis): insert polygon vertices during edit`
- **Push task:** riuscito (`0eac9de..5df925f main -> main`)

## Commit finito docs (step 2)

- **SHA:** `dd12d7cdf58ddbe72815f5a8950bd4dd2ba0fdbb`
- **Subject:** `docs: finito — POLY-PARITY-P3-ADD runtime published`
- **Push finito:** riuscito (`5df925f..dd12d7c main -> main`)

## Working tree pre-autosync

```
 M docs/orchestrator/latest.md
```

(dopo commit finito, prima autosync orchestratore)

## git diff --stat pre-autosync

```
 docs/orchestrator/latest.md | 2 ++
```

## Cosa è stato fatto

- **POLY-PARITY-P3-ADD:** inserimento vertice su un lato in Modifica poligono GIS
- `polygonInsertEditVertex(index)` — muta solo `_polyEdit.working`
- `polygonGeodesicMidpointLonLat` — midpoint geodetico Vincenty (metà arco), `normalizeLon` + `round(,7)`
- Pulsante `+` ghost per lato in `#polygonPanelEditLegs` (cella `.poly-edit-leg-actions` con `✕` P3)
- Cap **`POLYGON_RING_VERT_CAP` 500** (coerente `gisSanitizeGeometry slice(0, 500)`)
- i18n IT/EN/FR: `editInsertVertex`, `editMaxVertices`, `editInsertVertexInvalid`
- Dirty + overlay via `polygonRefreshEditUi` / A1 esistente

## File principali

- `coordinate_converter Claude.html` (+79 −1)
- `docs/OPERATING_MEMORY.md` §7
- `docs/work-units/WU-0005-0009-roadmap.md`

## Monolite nel commit task

**Sì** — runtime `5df925f` include monolite.

## Invariati (scope)

- `polygonSaveEdit`, `polygonDeleteEditVertex` (byte-invariati)
- P2 drag / CTRL_SEL; P3-FIX Annulla-close; P7-B1/B2; A1/A2
- `APP_BUILD_ID` `B5.5Z`
- P4/P5/P6/P8 backlog; HUD backlog

## Verifiche

- `git diff --check`: PASS
- `node --check` (2 blocchi script inline): PASS
- Test browser operatore: **non eseguiti**

## Deploy / QA

- Deploy VPS: **pending**
- QA operatore P3-ADD: **pending**

## Prossimo passo

1. Deploy VPS GIS-only runtime `5df925f`
2. QA operatore minima P3-ADD (inserimento lato interno/ultimo, drag, Annulla, Salva, cap, i18n)
3. Chiusura documentale end-to-end dopo QA PASS

## Limiti

- Nessun click su linea mappa; nessun undo stack
- Distinto da backlog P4 traslazione

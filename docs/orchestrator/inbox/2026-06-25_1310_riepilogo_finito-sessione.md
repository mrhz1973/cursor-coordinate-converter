# POLY-PARITY-P5-B2-F — runtime pubblicato (pulizia errore stale draft)

**Data:** 2026-06-25  
**Tipo:** chiusura sessione `finito` — runtime + memoria viva docs + autosync orchestratore

## Esito

**POLY-PARITY-P5-B2-F — runtime pubblicato; deploy/QA pending; non CLOSED end-to-end**

## Commit task runtime

- **SHA:** `739bf49` — `fix(gis): clear stale polygon draft error after geometry change (P5-B2-F)`
- **File:** `coordinate_converter Claude.html` (+2 righe)
- **Blob:** `ba8a7f0a8edfee07dff4eb762d0a0309939db43d`

## Commit task docs

- **SHA:** (post-runtime docs commit — vedi `git log`)

## Implementazione

- `polygonHideDrawErr()` dopo `push` vertice valido in handler polygon draw (`attachPanHandlers`, ramo non dbl-click)
- `polygonHideDrawErr()` dopo `.pop()` riuscita in `polygonRemoveLastDraftPoint()` (prima di `_polygonDraftLastClick = null`)
- Helper esistente riusato; nessuna nuova i18n/HTML/CSS
- `polygonFinishDraw` e ramo `!added` byte-invariati
- Sanitizer/create-path/CRUD/storage invariati
- No-op: click invalidi, rimozione a zero vertici, solo nome draft — errore resta visibile

## Review Claude

**NON RICHIESTA** — stato transiente; sanitizer/create-path/CRUD invariati; nessun nuovo campo persistito

## Gate

- Deploy VPS: **NON ESEGUITO**
- QA operatore: **NON ESEGUITA**
- P5-B2-F CLOSED end-to-end: **no**
- P5 complessivo CLOSED: **no**
- APP_BUILD_ID: **B5.5Z** invariato

## Pre-autosync git (post task push)

```
git rev-parse HEAD (runtime)
739bf496682ae4a3baa998ea2b37265e0e239a73

git rev-parse HEAD:"coordinate_converter Claude.html"
ba8a7f0a8edfee07dff4eb762d0a0309939db43d
```

## Prossimo candidato

Deploy GIS-only runtime `739bf49` → QA operatore P5-B2-F → chiusura documentale se PASS

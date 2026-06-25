# POLY-PARITY-P5-B2-C — chiusura documentale end-to-end

**Data:** 2026-06-25  
**Tipo:** docs-only + autosync orchestratore  
**Monolite:** non toccato nel commit docs (runtime già `d893775`)

## Esito

**POLY-PARITY-P5-B2-C — CLOSED / PASS end-to-end**

**P5 complessivo:** non CLOSED — **P5-B2-D non avviato**

## Commit task (chiusura docs)

- **SHA:** `854fe04776fb16821f421ae77db1389274d9d285` — `docs(gis): close POLY-PARITY-P5-B2-C after operator QA pass`
- **File:** `docs/OPERATING_MEMORY.md` §7; `docs/work-units/WU-0005-0009-roadmap.md`
- **Push task:** riuscito (`d893775..854fe04`)

## Runtime autorevole

| Voce | Valore |
|------|--------|
| Commit | `d893775` (`d893775f00e5fc3b155b2adb4f8ae6209fab61eb`) |
| Messaggio | `feat(gis): edit polygon name during drawing (P5-B2-C)` |
| Blob | `cc759b80f2cd691bd386066bf34429a36e82b451` |
| APP_BUILD_ID | `B5.5Z` |

## Review Claude

**NON RICHIESTA** — stato transiente `_polygonDraftName`; sanitizer/create-path/CRUD invariati; nessun nuovo campo persistito.

## Deploy tecnico

**PASS** — pull FF `b68c774`→`d893775`; HEAD VPS `d893775`; byte **2300677**; SHA **`d5138ab6e2f39cfd0874f149656c1fe2be2028de61b0692fb306b419eac90e8e**; cmp PASS; HTTP **200**; `goi-gis-app` active/enabled; controllo draft e stringhe IT/EN presenti; ramo `!added` senza reset nome.

## QA operatore

**PASS** — «**QA POLY-PARITY-P5-B2-C PASS operatore**».

Verificato: campo Nome solo in drawing; nome manuale in `properties.name`; vuoto/spazi → `polygonBuildNextDefaultName()`; reset nuovo drawing/Annulla/successo; cambio IT↔EN label/placeholder aggiornati valore preservato; nessuna stringa FR nuova; P5-B2-A/P5-B2-B invariati; nomi persistenti dopo reload; nessuna regressione creazione/modifica.

## Contratto P5-B1 (pin)

Nel ramo `!added`: `_polygonDraftName` e `_polygonDraftVertices` non azzerati; drawing attivo; pannello ripristinato; errore visibile; retry possibile; nessuna ghost feature.

## Contratto dati

- `state._polygonDraftName` esclusivamente transiente (non in store/import/export/schema)
- `properties.name` unico campo persistito
- singola `gisFeatureAdd("polygon", feature)` nel drawing
- sanitizer e helper P5-B2-B invariati

## Governance i18n

IT principale; EN mantenuta; FR legacy congelata — nuove chiavi solo IT/EN in P5-B2-C.

## Prossimo candidato

**P5-B2-D** — metriche live durante drawing (vertici/area/perimetro read-only; helper geometrici esistenti; i18n solo IT/EN; Review Claude NO).

## Pre-autosync git (task push)

```text
git rev-parse HEAD
854fe04776fb16821f421ae77db1389274d9d285

git status --short (post-task, pre-autosync)
(vuoto)

git diff --stat (post-task, pre-autosync)
nessun diff

git rev-parse HEAD:"coordinate_converter Claude.html"
cc759b80f2cd691bd386066bf34429a36e82b451

git diff --quiet HEAD -- "coordinate_converter Claude.html"
PASS (exit 0 — monolite invariato nel commit docs)
```

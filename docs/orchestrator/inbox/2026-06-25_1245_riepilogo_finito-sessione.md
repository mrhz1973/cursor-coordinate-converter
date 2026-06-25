# POLY-PARITY-P5-B2-E — chiusura documentale end-to-end

**Data:** 2026-06-25  
**Tipo:** docs-only + autosync orchestratore  
**Monolite:** non toccato nel commit docs (runtime già `aea7434`)

## Esito

**POLY-PARITY-P5-B2-E — CLOSED / PASS end-to-end**

**P5 complessivo:** non CLOSED — **P5-B2-F non avviato**

## Commit task (chiusura docs)

- **SHA:** `d20d653` — `docs(gis): close POLY-PARITY-P5-B2-E after operator QA pass`
- **File:** `docs/OPERATING_MEMORY.md` §7; `docs/work-units/WU-0005-0009-roadmap.md`
- **Push task:** riuscito (`aea7434..d20d653`)

## Runtime autorevole

| Voce | Valore |
|------|--------|
| Commit | `aea7434` (`aea7434cf7f8db6eee29f22d6979774931e47f9c`) |
| Messaggio | `feat(gis): remove last polygon draft point (P5-B2-E)` |
| Blob | `8d17497a556a9be9ab8fa30c27120083e3f2ad06` |
| APP_BUILD_ID | `B5.5Z` |

## Review Claude

**NON RICHIESTA** — mutazione transiente draft (singola `.pop()`); sanitizer/create-path/CRUD invariati; nessun nuovo campo persistito.

## Deploy tecnico

**PASS** — pull FF `c2c4836`→`aea7434`; HEAD VPS `aea7434`; byte **2304409**; SHA **`6bd474632b5ddca79ace586200042d720d755fd20923f9ab02fd1d35fd9cb484**; cmp PASS; HTTP **200**; `goi-gis-app` active/enabled; singola `.pop()` confermata; `_polygonDraftLastClick = null` confermato.

## QA operatore

**PASS** — «**QA POLY-PARITY-P5-B2-E PASS operatore**».

Verificato: pulsante `Rimuovi ultimo punto` solo in drawing; nascosto fuori drawing; disabled a zero vertici; enabled da ≥1; ogni click rimuove solo ultimo vertice; overlay/metriche aggiornati (0/1/2/3/≥4 vertici); click ripetuti fino a zero senza eccezioni; nome draft preservato; Annulla e creazione riuscita invariati; errore non nascosto da rimozione; P5-B2-A/B/C/D senza regressioni.

**Limitazione registrata:** cambio unità di misura non disponibile nel flusso generale — **NON verificato** in QA P5-B2-E (invariata; non blocca chiusura).

## Contratto funzionale

- `#polygonPanelRemoveLastBtn` + `polygonRemoveLastDraftPoint()` + `polygonSyncRemoveLastPointUi()`
- Unica mutazione: `state._polygonDraftVertices.pop()`
- `_polygonDraftLastClick` azzerato a `null` post-rimozione (evita falsi doppi click)
- Refresh: `refreshTileMapForTrackUi()` + `renderPolygonPanelList()`
- Nome draft (`_polygonDraftName`) invariato
- Nessuno stack undo/redo; nessuna persistenza; nessuna chiamata sanitizer/CRUD/storage
- `polygonFinishDraw` e ramo `!added` byte-invariati

## i18n

- Nuova chiave IT/EN: `gis.polygonPanel.removeLastPoint` — IT «Rimuovi ultimo punto», EN «Remove last point»
- Nessuna chiave FR aggiunta; FR legacy congelata

## Prossimo candidato

**P5-B2-F** — pulizia errore stale durante drawing (su aggiunta/rimozione vertice; `polygonFinishDraw`/`!added` invariati; i18n solo IT/EN se serve; Review Claude NO).

## Pre-autosync git (task push)

```text
git rev-parse HEAD
d20d653 (post-task-push)

git status --short (post-task, pre-autosync)
(vuoto)

git rev-parse HEAD:"coordinate_converter Claude.html"
8d17497a556a9be9ab8fa30c27120083e3f2ad06

git diff --quiet HEAD -- "coordinate_converter Claude.html"
PASS (exit 0 — monolite invariato nel commit docs)
```

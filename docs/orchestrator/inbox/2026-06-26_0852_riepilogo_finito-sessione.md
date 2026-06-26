# P-VERTEX-MODAL — runtime pubblicato + deploy PASS (QA pending)

**Data:** 2026-06-26  
**Tipo:** runtime + docs + autosync orchestratore  
**Monolite:** incluso nel commit runtime `a4fa8e7`

## Esito

**P-VERTEX-MODAL — runtime pubblicato; deploy GIS-only PASS tecnico; QA operatore pending; NON CLOSED end-to-end**

## Commit runtime

- **SHA:** `a4fa8e7e5aba59add05623039049c6f2b8db5eb7` — `feat(gis): edit polygon vertex coordinates in modal (P-VERTEX-MODAL)`
- **Blob:** `37b0edba7ccd38030299bdd96c8fbd29d47edf2b`
- **APP_BUILD_ID:** `B5.5Z` (invariato)

## Commit docs (registrazione)

- **SHA:** `e5ed837` — `docs(gis): register P-VERTEX-MODAL runtime published (deploy PASS, QA pending)`
- **File:** `docs/OPERATING_MEMORY.md` §7; `docs/work-units/WU-0005-0009-roadmap.md`; `docs/QA-CHECKLIST.md`

## Review Claude

**NON RICHIESTA** — nessuna escalation; `polygonSaveEdit` / `polygonDeleteEditVertex` / `polygonInsertEditVertex` byte-invariati; una sola `gisFeatureUpdate` su Salva generale; soglia click-vs-drag minima su pipeline P2.

## Deploy tecnico

**PASS** — VPS pull FF `26f73f7`→`a4fa8e7`; HEAD VPS `a4fa8e7`; byte **2325545**; SHA-256 **`d75c03cfbf38b737d7f5aad909f32a685b4572baf100d8e5703f03d1f8b90043`**; blob match repo/servito/tailnet; cmp PASS; HTTP **200**; `goi-gis-app` active/enabled.

## QA operatore

**NON ESEGUITA** — attestazione attesa: «**QA P-VERTEX-MODAL PASS operatore**». URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=a4fa8e7`

## Implementazione (sintesi)

- Modal `#polygonVertexCoordDialog`; apertura da click handle (no drag, soglia 5px) o pulsante `⌖` riga lato (vertice = indice riga `i`)
- Parser punto/virgola; range; `gisSanitizeCoordinate`; mutazione `state._polyEdit.working[idx]` only; `polygonRefreshEditUi`
- i18n IT/EN `vertexModal*`; FR congelato

## Prossimo candidato batch Poligoni

**P-STYLE** — review-gated (review Claude obbligatoria prima deploy). Batch P5 separato non chiuso.

## Pre-autosync git (post-docs commit)

```text
git rev-parse HEAD (post-docs)
e5ed837

git status --short (post-docs, pre-autosync)
(vuoto atteso dopo commit docs)
```

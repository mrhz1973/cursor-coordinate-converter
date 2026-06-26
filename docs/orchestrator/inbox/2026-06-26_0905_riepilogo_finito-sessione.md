# P-VERTEX-MODAL-FIX — ripristino lista Lati

**Data:** 2026-06-26  
**Tipo:** runtime fix + docs + autosync

## Esito

**P-VERTEX-MODAL-FIX — lista «Lati» ripristinata; redeploy PASS; QA re-test pending**

**P-VERTEX-MODAL — non CLOSED end-to-end**

## QA operatore registrata (runtime a4fa8e7)

**FAIL** — «**QA P-VERTEX-MODAL FAIL operatore — lista Lati vuota**»

Sintomo: pannello Lati aperto, nessuna riga, pulsanti `⌖`/`+`/`✕` assenti.

## Causa tecnica confermata

`ReferenceError: vtxNum is not defined` in `renderPolygonEditInfo` — `polygonEditVertexCoordLabel(vtxNum)` alla riga del pulsante `⌖` prima di `const vtxNum = i + 1`.

## Fix runtime

- **SHA:** `5f8f73daf49057e55accf81c9a745fe76b462079` — `fix(gis): restore polygon edit legs list (P-VERTEX-MODAL-FIX)`
- **Patch:** spostare `const vtxNum = i + 1` prima della creazione `coordBtn` (1 riga nel loop)
- **Blob:** `ec297e6d770c385f285a3c141bf11ea5001f514a`

## Review Claude

- Runtime `a4fa8e7`: **review byte eseguita retroattivamente = PASS** (modificava pipeline click-vs-drag P2)
- Fix `5f8f73d`: **NON RICHIESTA** (solo variabile locale in rendering lista)

## Deploy post-fix

**PASS** — VPS pull FF `a4fa8e7`→`5f8f73d`; byte **2325545**; SHA **`d43eae84…`**; cmp PASS; HTTP **200**; `goi-gis-app` active/enabled.

## QA re-test

**Pending** — URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=5f8f73d`

Verificare prima: lista Lati visibile (3 righe per triangolo), pulsanti `⌖`/`+`/`✕`, nessun errore console.

Attestazione attesa: «**QA P-VERTEX-MODAL PASS operatore**»

## Prossimo

**P-STYLE** review-gated; batch P5 non toccato.

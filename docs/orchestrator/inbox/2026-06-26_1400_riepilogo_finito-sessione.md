# Riepilogo finito sessione — chiusura P-VERTEX-MODAL

**Data:** 2026-06-26  
**Tipo:** chiusura documentale (docs-only) — nessuna modifica runtime  
**Attestazione operatore:** «**QA P-VERTEX-MODAL PASS operatore**»

## Stato finale

**P-VERTEX-MODAL: CLOSED / PASS end-to-end**

## Catena runtime (invariata)

| SHA | Ruolo |
|-----|--------|
| `a4fa8e7` | Runtime principale — modal coordinate vertice; pipeline P2 click-vs-drag; **review byte Claude retroattiva = PASS** |
| `5f8f73d` | Fix lista «Lati» — scope `vtxNum`; fix locale rendering; nessuna nuova review Claude |
| `5449cb9` | P-VERTEX-MODAL-FIX2 — **RAMO A** CSS-only (+3 righe `:not([open]){ display:none }`); review Claude **non richiesta** correttamente |

**Blob finale:** `acafd51982ace54524e6dd1ef7cc694a76389568`  
**VPS:** `5449cb9` — deploy già PASS tecnico (nessun redeploy in questa chiusura)

## Causa radice FIX2 (registrata)

`body.gis-mode dialog#polygonPanel.polygon-panel { display: flex }` sovrascriveva `dialog:not([open]) { display: none }`. Il `×` chiudeva logicamente ma il pannello restava visibile e intercettava click; `−` instabile nei cicli successivi. Non causa: listener, drag header, resize, inert, showModal lifecycle, wiring JS.

## Sequenza QA

```text
QA FAIL operatore — lista Lati vuota (a4fa8e7)
→ fix 5f8f73d
QA FAIL operatore — controlli header ×/− non affidabili (5f8f73d)
→ fix CSS 5449cb9
→ deploy GIS-only PASS tecnico
→ QA P-VERTEX-MODAL PASS operatore
```

## File modificati (questo intervento)

* `docs/OPERATING_MEMORY.md` §7
* `docs/work-units/WU-0005-0009-roadmap.md`
* `docs/QA-CHECKLIST.md`
* `docs/runtime/LAST_CURSOR_REPORT.md`

**Monolite:** non toccato — escluso dal commit.

## Non toccato

* P-STYLE (review-gated, non avviato)
* Batch P5 / P5-B2-F
* Backlog: P-VERTEX-FORMAT, P-POLYGON-LIST-ENRICHMENT

## Prossimo candidato

**P-STYLE** (review-gated)

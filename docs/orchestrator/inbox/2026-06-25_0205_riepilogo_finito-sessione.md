# POLY-PARITY-P4-B1 — chiusura documentale end-to-end

**Data:** 2026-06-25  
**Tipo:** docs-only (idempotente) + autosync orchestratore  
**Monolite:** non toccato in questo intervento (runtime già `505e7d0`)

## Esito

**POLY-PARITY-P4-B1 — CLOSED / PASS end-to-end**

## Commit task (chiusura docs)

- **SHA:** `ca88b76` — `docs(gis): close POLY-PARITY-P4-B1 after operator QA pass`
- **File:** `docs/OPERATING_MEMORY.md` §7; `docs/work-units/WU-0005-0009-roadmap.md`

## Runtime autorevole

| Voce | Valore |
|------|--------|
| Commit | `505e7d0` (`505e7d07fc390ea70ffd499d458f473b7d1edac6`) |
| Messaggio | `feat(gis): move whole polygon during edit (P4-B1)` |
| Blob | `7dbe96ef5b68d670d647556a8883039a054d9ad4` |
| APP_BUILD_ID | `B5.5Z` |

## Review byte Claude

**PASS** — GO DEPLOY. Contratti snapshot/offset totale, mutua esclusione P4/P2, working-copy-only, una `gisFeatureUpdate` su Salva verificati.

## Deploy tecnico

**PASS** — runtime VPS `505e7d0`; byte **2294595**; SHA **`2ae34929432600ac4ee75cb065b4690e3d59c408d237118dd4ee1bb4bfc6619e**; cmp PASS; HTTP **200**; `goi-gis-app` active/enabled.

## QA operatore

**PASS** — attestazione «**QA POLY-PARITY-P4-B1 PASS operatore**».

Percorsi: toggle/hint; handle P2 non interattivi in move mode; traslazione intero poligono; zero salto; vertici invariati; move mode persistente; pan fuori fill; P2 post-toggle; Annulla/X/Salva; P3 insert/delete + drag; IT/EN/FR.

## Contratto tecnico (sintesi)

Modalità «Sposta poligono»; toggle `aria-pressed`; pipeline `mapPolyMoveDocDrag*`; snapshot immutabili; offset totale pointer-based; proiezione mappa; ring aperto; working-copy-only; cleanup simmetrico; P2 core byte-invariato.

## Finding non bloccante (backlog tecnico)

Ramo pointerdown P2 in `renderPolygonEditOverlay`: guardia originale `if (mapPolyEditDocDrag) return` non più nella forma originale; secondo pointer touch su altro handle durante drag P2 può sostituire il primo; non raggiungibile mouse singolo; nessuna corruzione geometria/persistenza; **non** impedisce chiusura; micro-fix futuro separato: `if (mapPolyEditDocDrag || mapPolyMoveDocDrag) return`.

## Invariati

P2/P3/P3-ADD/P7/A1/A2; P5/P6/P8/HUD non avviati; monolite escluso da commit autosync.

## Pre-autosync git (task push)

```
git rev-parse HEAD
ca88b76…

git rev-parse origin/main
ca88b76…

git status --short
(vuoto)
```

## Prossimo candidato

P5 creazione poligono (backlog); opzionale micro-fix multi-touch P2 (non urgente).

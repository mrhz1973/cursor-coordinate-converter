# METHOD FIX — CORE BOOT WU-OPTIONAL

**Data:** 2026-08-21  
**Tipo:** docs-only method (`METHOD-CONTEXT-SAFE-BOOTSTRAP`)  
**Runtime:** non toccato

## Finding

CORE BOOT step 4 obbligava hot-header WU anche quando FRONTIER è block-based senza path WU → falso STOP.

## Fix

- README AI-BOOT: step 4 condizionale su `WU ATTIVA` / path esplicito; N/A → COMPLETO; path mancante con WU implicata → STOP; no listing/search.
- Fallback `ls-remote` dichiarato senza autorità fittizia.
- Payload guard: ignorare eccedenza oltre `AI-BOOT: END`.
- FRONTIER: campo **`WU ATTIVA` = `—` (N/A)** per FIX4 (block-based; nessuna WU path inventata).
- OM §4 Regola I allineata.

## Simulazione logica acceptance

| Caso | FRONTIER | Esito CORE BOOT |
| --- | --- | --- |
| A | path WU valido | legge solo hot-header → PASS |
| B | `WU ATTIVA` = N/A | step 4 N/A → PASS (no search) |
| C | WU implicata, path assente | STOP conflitto |

Nessun caso richiede `GitHub.search` / directory listing in CORE BOOT.

## Stato operativo (invariato)

- BLOCK: `GIS-POLYGON-VERTEX-COORD-UX-A-FIX4`
- GATE: review / DELICATO / REVIEW PACKAGE READY / NO DEPLOY
- Candidate: `5857cbb…` / build **243** / blob `04cfdfcc…`
- LIVE: build **242** / tip `ea5b4c1…` / blob `2e0075ba…`
- NEXT: Review GPT-SOSTITUTIVA FIX4

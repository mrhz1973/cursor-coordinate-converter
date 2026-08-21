# SESSION CHECKPOINT — 2026-08-21 (STOP PC attuale)

**Tipo:** handoff sessione / safe stop  
**Runtime:** **non** modificato in questo pass  
**Deploy:** **no** · **finito:** **no** · QA operatore PASS: **no**

## Autorità

| Campo | Valore |
| --- | --- |
| `origin/main` FULL SHA (verificato) | `e627d50df3a6722d2e2a3dddb61e89cb73fa1da1` |
| Working tree al checkpoint | **CLEAN** (dopo push di questa evidence) |
| Clone | canonico `cursor-coordinate-converter` |

## RUNTIME LIVE (testato operatore)

| Campo | Valore |
| --- | --- |
| Build | **242** |
| APP_BUILD_ID | `GIS-POLYGON-VERTEX-COORD-UX-A-FIX3` |
| Runtime tip (promote) | `ea5b4c10366c5a34331f8a62c77efb8ea6aab615` |
| Monolite blob | `2e0075ba344713b17f0888c4e9594f414bb0db94` |
| VPS | serve ancora **242** (FIX4 **non** deployato) |

## QA OPERATORE FIX3

**FAIL** complessivo sul flusso Poligoni (LIVE 242).

**Finding:** durante «Nuovo poligono», prima di «Chiudi poligono», i vertici draft già inseriti **non** sono trascinabili sulla mappa; hover sul vertice **non** mostra grab/manina.

**Requisito per FIX4:** drag su `state._polygonDraftVertices` con aggiornamento live geometria / Coordinate vertici / Area-Perimetro; nessun persist prematuro; nessun vertice aggiunto accidentalmente durante il drag.

## Stato FIX4 (reale)

**REVIEW PACKAGE READY** (review-only · **NO** REVIEW PASS · **NO** deploy)

| Campo | Valore |
| --- | --- |
| Branch | `review/GIS-POLYGON-VERTEX-COORD-UX-A-FIX4-243` |
| Runtime candidate FULL SHA | `5857cbb2c3fc73e688ae26c1e2a359bb76199416` |
| Docs tip sul branch | `105ea07a36244cb10c4e23a42e608c0acb92c608` |
| Build / ID candidate | **243** / `GIS-POLYGON-VERTEX-COORD-UX-A-FIX4` |
| Candidate blob | `04cfdfcc1eed8979e60b9ff176f93ceee79ccfcb` |
| Review package | [`2026-08-21_1330_GIS-POLYGON-VERTEX-COORD-UX-A-FIX4-review-package.md`](2026-08-21_1330_GIS-POLYGON-VERTEX-COORD-UX-A-FIX4-review-package.md) |
| Runtime.diff | [`2026-08-21_1330_GIS-POLYGON-VERTEX-COORD-UX-A-FIX4-runtime.diff`](2026-08-21_1330_GIS-POLYGON-VERTEX-COORD-UX-A-FIX4-runtime.diff) |

## NEXT (ripresa da altro PC)

1. CORE BOOT: `git ls-remote origin refs/heads/main` → `README` AI-BOOT → [`docs/FRONTIER.md`](../../FRONTIER.md).
2. Gate: **review** su `GIS-POLYGON-VERTEX-COORD-UX-A-FIX4` candidate `5857cbb…`.
3. Se Review GPT-SOSTITUTIVA **PASS** → `STANDARD_RUNTIME_BUNDLE` (cherry-pick exact runtime · deploy · ABQA · gate **QA FINALE CHATGPT — PENDING**).
4. Se Review **FAIL** → nuovo FIX secondo finding (non inventare deploy).
5. **Non** `finito` del flusso Poligoni finché non arriva QA operatore PASS sul LIVE dopo promote.

## Backlog aperti (NOT OPENED) — non implementare incidentalmente

- `MAP-CENTER-VIEWPORT-AWARE-A` (estensione POLYGON PANEL)
- `GIS-POLYGON-METRICS-COMPACT-FORMAT-A`
- `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A`
- `GIS-WAYPOINT-MODAL-LAYOUT-A`
- `GIS-POLYGON-WAYPOINT-INTERACTION-A`

(+ correlati già in roadmap: presets, waypoint coord lifecycle, ecc.)

## Non fare al resume

- Non ripartire da chat locale; autorità = GitHub.
- Non mergeare il review branch; promote = cherry-pick exact del runtime commit.
- Non deployare senza Review PASS + bundle.

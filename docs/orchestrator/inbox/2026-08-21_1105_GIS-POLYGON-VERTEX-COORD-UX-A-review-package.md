# REVIEW PACKAGE — GIS-POLYGON-VERTEX-COORD-UX-A (build 239)

BLOCK-ID: GIS-POLYGON-VERTEX-COORD-UX-A  
PHASE: IMPLEMENT → LOCAL QA → REVIEW PACKAGE  
CATEGORY: DELICATO — polygon edit/create-update path  
CLOSURE: NONE  
MAIN WRITE (runtime): FORBIDDEN · DEPLOY: FORBIDDEN · FINITO: FORBIDDEN  
REVIEW ATTESTATION: **NOT PASS** (package ready only)

## Identifiers

- BASE_FULL_SHA: `7ab549d449300480b5e5fe156d4d81415e8ed461`
- CANDIDATE_FULL_SHA: `be49ed2494dbaa9bdf25d55151b3ac15c390fd07`
- BRANCH: `review/GIS-POLYGON-VERTEX-COORD-UX-A-239`
- APP_BUILD_NUM: **239**
- APP_BUILD_ID: `GIS-POLYGON-VERTEX-COORD-UX-A`
- CANDIDATE_BLOB: `cd6a79d612ee613b97f2c620bc3dcb1fce547797`
- LIVE (unchanged): build **238** · blob `c36109d1ebda7470748a3284089bf11b262d01cf` · SHA `d899cff2c7ac24f1b9bba3eb99d10e08d2442b25`
- Monolite bytes (candidate): 10937653
- Full runtime diff: `docs/orchestrator/inbox/2026-08-21_1105_GIS-POLYGON-VERTEX-COORD-UX-A-runtime.diff`
- `git diff --check` BASE…CANDIDATE monolite: **PASS** (exit 0)

## Freeze override (scoped)

**Oggetti GIS FROZEN** derogato **SOLO** per questo blocco e **SOLO** per UX coordinate vertici Poligoni.  
Nessun unfreeze Workbench / Waypoint / Tracce / altri oggetti / preset shapes.

## Runtime commit scope

- **Solo monolite** nel commit candidato: `coordinate_converter Claude.html`
- Nessun nuovo campo persistito / storage / schema `state.gisPolygons[]`
- Nessuna modifica `state.mapWaypoints[]` / Tracce
- Nessun provider/rete/GPS

## Sink / state map (toccati)

| Sink | Ruolo | Persistito? |
| --- | --- | --- |
| `state._polyEdit.working` | working-copy ring `[lon,lat][]` | No (transient edit) |
| `state._polyEdit.dragIdx` | vertice in drag | No |
| `polygonVertexCoordFormat` | DISPLAY format (session) | No |
| `polygonVertexCoordModalIdx` / `Canon` | dialog transient | No |
| `#polygonPanelEditVerts` | lista coordinate | DOM only |
| `.poly-edit-drag-readout` | readout live drag | DOM only |
| `state.gisPolygons[]` | update **solo** via `polygonSaveEdit` esistente | Sì (schema invariato) |

### Schema `state.gisPolygons[]` — prova di non-cambiamento

Feature seed QA: chiavi top-level `geometry`, `id`, `layerId`, `properties`, `type`.  
Nessun nuovo campo aggiunto al modello; patch non tocca sanitize/persist schema.

## Working-copy vs save path

- Drag / Modifica dialog / insert / delete → mutano **solo** `state._polyEdit.working`
- `polygonSaveEdit` / `polygonCancelEdit` semantiche **invariate**
- Nessun auto-save durante drag (confermato: Salva esplicito richiesto)

## Display vs INPUT parse

- **DISPLAY:** `polygonVertexCoordFormat` + `POLY_VERTEX_COORD_FORMATS` + `polygonFormatVertexCoordText` / `polygonFormatVertexCoordDisplay`
- **INPUT:** `polygonParseVertexCoordInputText` → `autoDetect` (Convert-canonical) + `validateLatLon` + `gisSanitizeCoordinate` → `[lon,lat]`
- `polygonParseVertexCoordByFormat` **conservato** (non rimosso); apply/validate modal non lo usano più per INPUT

### Formati realmente parseabili via `autoDetect` (evidenza locale)

| Input | Esito | type |
| --- | --- | --- |
| DD `44.11, 9.83` | PASS | LatLon |
| DMS | PASS | LatLon |
| UTM `32T 566000 4885000` | PASS | UTM |
| MGRS (testo display riga) | PASS | MGRS |
| Plus `8FPF4R6J+22` | PASS | OLC |
| BNG `TQ 3080 8050` | PASS | BNG |
| SK42 GK `7 500000 5500000` | PASS | SK42GK |
| invalid `@@@` / `not-a-coord-xyz` | FAIL closed | — |

### Residui format-only (nessun inverse nuovo)

- Registry display corrente: `dd|signed|ddm|dms|utm|mgrs` — **tutti** già coperti da `autoDetect` / parser esistenti.
- **Nessun** formato display-only nel registry poligono che richieda inverse nuove.
- Plus / BNG / SK42: **parse-only** (non nel selettore display) — accettati in paste; non aggiunti al registry display in questo blocco.

## UX implementata

1. Lista ordinata `#polygonPanelEditVerts` in edit: n°, coordinata (formato selezionato), **Copia**, **Modifica**
2. Cambio `polygonVertexCoordFormat` → refresh immediato lista + readout drag
3. Drag vertice → readout `.poly-edit-drag-readout` (`pointer-events:none`) + riga lista `is-dragging` live
4. Copia = `data-copy` **identico** al testo visualizzato (`copyExact: true`)
5. Modifica → `#polygonVertexCoordDialog`; paste/input via `autoDetect`; FAIL → zero mutazione + err in dialog

## Local QA evidence (A–T sintetico)

| ID | Esito | Nota |
| --- | --- | --- |
| A | PASS | Edit poligono ≥4 vertici |
| B | PASS | 4 righe ordinate |
| C | PASS | dd→mgrs→utm→dms aggiorna tutte le righe |
| D | PASS | drag V0 live row + readout |
| E | PASS | Copia === testo visualizzato |
| F | PASS | Modifica/parse DD |
| G | PASS | DMS |
| H | PASS | UTM |
| I | PASS | MGRS |
| J | PASS | Plus (+ BNG/SK42 smoke) |
| K | PASS | invalid → unchanged |
| L | PASS | `polygonSaveEdit` in-place `geomMatch` |
| M | PASS | Annulla ripristina |
| N | PASS | insert/delete |
| O | PASS | whole-move via `polygonApplyMoveFromSnapshots` |
| P | PASS | overlay/readout/lista coerenti |
| Q | PASS | re-enter edit coerente |
| R | PASS | `mapWaypoints` / `gisTracks` arrays intatti (smoke) |
| S | PASS | harness senza throw; build title 239 |
| T | PASS | resource delta gesture format/modal = **0**; nessun fetch nuovo nel patch |

## Network delta

- Patch: zero nuovi endpoint / `fetch` / provider
- Gesture locale (format change + Plus apply): `performance` resource delta **0**

## Funzioni nuove / toccate (monolite)

Nuove: `polygonFormatVertexCoordText`, `polygonParseVertexCoordInputText`, `polygonCollectVertexCoordModalInputText`, `renderPolygonEditVertsList`, `polygonRefreshEditOverlayForFormat`  
Toccate: `renderPolygonEditInfo`, `polygonOnVertexCoordFormatChange`, `polygonValidateVertexCoordModalInputs`, `polygonVertexCoordModalTryUpdateCanonFromInputs`, `renderPolygonEditOverlay` (readout), build 239, i18n IT (`editVerticesList`, `editVertexCopy`, `editVertexModify`, `vertexModalPasteHint`)

## i18n

- Nuove stringhe **solo IT** (L10N-FREEZE EN/FR)
- EN/FR dizionari non espansi

## Non in scope / non toccato

- Preset shapes
- Waypoint lifecycle (`GIS-WAYPOINT-COORD-UX-A` resta backlog)
- Tracce data model
- Deploy VPS / `?v=` bump LIVE
- Review PASS attestation

## GATE

**STOP pre-deploy.** Candidate su branch review. Main runtime resta build **238**.

---

**GIS-POLYGON-VERTEX-COORD-UX-A REVIEW PACKAGE READY — MAIN RUNTIME NOT DEPLOYED**

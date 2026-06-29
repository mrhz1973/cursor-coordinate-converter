# MAJOR-5A1 — GIS Object Workbench catalogo read-only + filtri + fly-to

**Data:** 2026-06-30  
**Commit task runtime:** `d74cbb736e0543035112601625f8685c8c6fe0fa` (`d74cbb7`)  
**Subject:** `feat(gis): add object workbench catalog`  
**Build:** `B5.5Z · build 26` (`APP_BUILD_NUM = 26`)

---

## 1. Repo guard iniziale

| Check | Esito |
|-------|--------|
| Repo | `mrhz1973/cursor-coordinate-converter` |
| Branch | `main` |
| Workspace | pulito |
| HEAD pre-task | `607946b` (allineato origin/ls-remote) |

## 2. Implementazione (monolite)

**Pannello:** `#gisWorkbenchPanel` — floating map-first, resize/drag/minimize coerente pannelli GIS.

**Stato session-only:** `state._workbench = { filterKind, search, selected }` + `state.workbenchPanelOpen` — **non** in `saveStore`/`coordconv_v2`.

**Adapter:** `workbenchCollectRows()` → waypoint (`mapWaypoints[]`), tracce salvate (`savedTracks[]`), poligoni (`gisPolygons[]`).

**UI:** filtri Tutti/WP/Tracce/Poligoni; ricerca nome+summary; conteggio visibili/totali; lista compatta; messaggi empty/no-results (`aria-live`).

**Azioni:** ⌖ delega `waypointsZoomTo`, `flyToSavedTrackById`, `polygonShowOnMapFromList`; Apri delega `openWaypointModal`, `openTrackModal`, `openPolygonPanel`.

**Entry:** pulsante toolbar mappa `[data-role="workbench-open"]` (GIS hub).

**Escluso da 5A1 (come da piano):** delete, rename, edit, pick mappa, highlight, `gisTracks[]`, range rings, import/export, schema persistito nuovo.

**i18n:** chiavi `workbench.*`, `tip.workbenchPanel`, `gis.minimized.workbench` — IT/EN/FR.

## 3. Controlli statici

| Check | Esito |
|-------|--------|
| `git diff --check` | PASS |
| `node --check` (script block 2) | PASS |
| `<script src>` / module | assenti |
| Scope | solo `coordinate_converter Claude.html` (+ autosync docs separato) |
| OPSEC/tile/cache/sanitizer/import-export | non toccati |
| `saveStore` | invariato (nessun `_workbench`) |

## 4. Deploy tecnico

| Voce | Valore |
|------|--------|
| VPS clone | `/root/local-files/handoff-runtime/cursor-coordinate-converter` |
| VPS HEAD post-pull | `d74cbb7` |
| `goi-gis-app.service` | active / enabled |
| HTTP | **200** |
| Content-Length (HTTP) | **2550551** |
| Byte file VPS (`wc -c`) | **2550551** |
| SHA-256 file VPS | `2ec9a006b2362b5dec18cdadbcd7423e9aa039be97d1d18d5611811c8bfcb314` |
| SHA-256 body HTTP | `2ec9a006b2362b5dec18cdadbcd7423e9aa039be97d1d18d5611811c8bfcb314` |
| CMP | **PASS** (file VPS = body HTTP) |
| Planet-Clone/proxy/n8n | non toccati |

**URL QA:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=d74cbb7`

## 5. QA operatore

**Non attestata.** Attendere attestazione esplicita:

`QA MAJOR-5A1 PASS operatore`

→ trigger auto-`finito` (Regola H): OM §7, WU/HANDOFF, LAST_CURSOR_REPORT, autosync chiusura.

## 6. Prossimo passo

- QA operatore minima su build 26 / workbench.
- Dopo PASS: **MAJOR-5A2** (selezione mappa↔lista + highlight) secondo piano `2026-06-29_maj-5a-plan.md`.

## 7. Limiti

- Hash SHA-256 working tree Windows locale può differire da VPS per normalizzazione LF/CRLF; autorità deploy = file VPS + body HTTP (allineati).
- `finito` / OM §7 / WU update **non** eseguiti in questo step (QA pending).

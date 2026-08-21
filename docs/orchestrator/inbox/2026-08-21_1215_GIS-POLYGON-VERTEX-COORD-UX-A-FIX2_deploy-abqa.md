# GIS-POLYGON-VERTEX-COORD-UX-A-FIX2 — REVIEW PASS + deploy GIS + ABQA PASS

**BLOCK-ID:** `GIS-POLYGON-VERTEX-COORD-UX-A-FIX2`  
**Categoria:** DELICATO — polygon create/edit + vertex modal path  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE uscita:** **QA FINALE CHATGPT — PENDING** (QA operatore **non** attestata · **non** `finito`)

## REVIEW GPT-SOSTITUTIVA

| Campo | Valore |
| --- | --- |
| Reviewed runtime FULL SHA | `b578ec8e11c952bb6a2f99fb6d863e673da2f723` |
| Build / ID | **241** / `GIS-POLYGON-VERTEX-COORD-UX-A-FIX2` |
| Monolite blob | `92ec73f7be579e8616ee83fcab085f1c7c6a426d` |
| Verdetto | **PASS** |

### Checklist DELICATO (attestata)

- persisted schema: invariato
- `_polygonDraftVertices`: transient only
- nessun saveStore/persist prematuro
- `polygonFinishDraw` unico create/finalize path
- `_polyEdit.working` invariato per edit
- vertex dialog: source draft/edit esplicita + reset on close
- invalid/ambiguous input fail-closed
- sanitizer/whitelist: N/A
- cache/storage: N/A
- nuovi field persistiti: nessuno
- network/provider/fetch/GPS: delta 0 attribuibile a FIX2
- offline invariato
- `state.mapWaypoints[]` non toccato

## A — Promozione runtime

- Pre-gate `ls-remote main` = `148f76cf378ef853213c27c90e9d49731e1b2704` (docs oltre BASE candidate) PASS
- LIVE pre-promote blob = `192c3b41543d6bedfbc899e6b3c8d1e3fe427464` (build 240) PASS
- **NON** mergeato review branch
- Cherry-pick exact `b578ec8…` → tip `1d43c795a780380c48a66ad36fac039a9ef93cfa`
- Post-cherry-pick blob = **`92ec73f7be579e8616ee83fcab085f1c7c6a426d`** PASS
- `git diff --check` PASS
- Push HTTPS `main` runtime → `1d43c79…`

## B — Backlog docs-only (entrambi NOT OPENED)

| ID | Stato | Evidence |
| --- | --- | --- |
| `GIS-POLYGON-METRICS-COMPACT-FORMAT-A` | **BACKLOG / NOT OPENED** | [`2026-08-21_1210_GIS-POLYGON-METRICS-COMPACT-FORMAT-A-backlog.md`](2026-08-21_1210_GIS-POLYGON-METRICS-COMPACT-FORMAT-A-backlog.md) |
| `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A` | **BACKLOG / NOT OPENED** | [`2026-08-21_1210_GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-backlog.md`](2026-08-21_1210_GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-backlog.md) |

Casa: [`WU-0005-0009-roadmap.md`](../../work-units/WU-0005-0009-roadmap.md) Map UX / Waypoint-Poligoni.  
Commit docs backlog: `63754b215a18246c1bc3f28f5b261df872c3343c` · monolite blob **invariato** `92ec73f7…`.

Altri backlog **non** implementati: `GIS-WAYPOINT-MODAL-LAYOUT-A`, `GIS-POLYGON-WAYPOINT-INTERACTION-A`.

## C — Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| SSH | `ionos-n8n` |
| VPS path | `/root/local-files/handoff-runtime/cursor-coordinate-converter` |
| VPS HEAD | `63754b215a18246c1bc3f28f5b261df872c3343c` |
| Blob | `92ec73f7be579e8616ee83fcab085f1c7c6a426d` |
| `goi-gis-app` | restart PID `2887632`→`2888989` · **active** |
| Proxy PID | `2481045` **invariato** |
| Bind | `100.114.7.53:8000` (non 127.0.0.1) |
| HTTP | **200** |
| CMP | **PASS** · SHA-256 `a7034a8e4f89023a9d41370e1e5379a14c58b1bebf77ed65fdfe0278f51ebb46` · bytes `10838896` · served ≡ worktree · git-blob = reviewed |
| Markers | APP_BUILD_NUM **241** · ID `GIS-POLYGON-VERTEX-COORD-UX-A-FIX2` |

**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=1d43c79`

## D — Automated Browser QA — PASS

**AUTOMATED BROWSER QA GIS-POLYGON-VERTEX-COORD-UX-A-FIX2 PASS**

URL test: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=1d43c79-abqa`  
Risultato: **34/34 PASS** · pageerrors **0**

| # | Caso | Esito |
| --- | --- | --- |
| 1–2 | Nuovo poligono / no ghost pre-P1 | PASS |
| 3–4 | P1…P4 lista immediata | PASS |
| 5 | DD→DMS→UTM→MGRS | PASS |
| 6 | Copia === testo | PASS |
| 7 | Modifica draft DD + UTM autoDetect | PASS |
| 8 | Input invalido fail-closed | PASS |
| 9 | Rimuovi ultimo | PASS |
| 10 | Annulla drawing → lista sparisce | PASS |
| 11 | Chiudi: geom === draft; no persist pre-close | PASS |
| 12–19 | Edit list/drag/copy/modifica/save/cancel/ins-del/move | PASS |
| 20–21 | Waypoint + Tracce smoke | PASS |
| 22 | Console attribuibili | 0 |
| 23 | Nessun endpoint nuovo FIX2 (ambient tiles/font/elevation preesistenti al load) | PASS |

## Gate

**QA FINALE CHATGPT — PENDING**

Non attestare QA operatore. Non `finito`.

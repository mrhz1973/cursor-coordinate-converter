# GIS-POLYGON-VERTEX-COORD-UX-A-FIX1 — REVIEW PASS + deploy GIS + ABQA PASS

**BLOCK-ID:** `GIS-POLYGON-VERTEX-COORD-UX-A-FIX1`  
**Categoria:** DELICATO — polygon edit/create-update path  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE uscita:** **QA FINALE CHATGPT — PENDING** (QA operatore **non** attestata · **non** `finito`)

## REVIEW GPT-SOSTITUTIVA

| Campo | Valore |
| --- | --- |
| Reviewed runtime FULL SHA | `4fb9c2f30868c0a90dcf745c2e146c34fd598a59` |
| Build / ID | **240** / `GIS-POLYGON-VERTEX-COORD-UX-A-FIX1` |
| Monolite blob | `192c3b41543d6bedfbc899e6b3c8d1e3fe427464` |
| Verdetto | **PASS** |

## A — Promozione runtime

- Pre-gate `ls-remote main` = `dfcf2896a70d0899e513012bcb2df1a6665f8ce4` PASS
- Candidate parent = main atteso PASS
- Diff candidate = **solo** `coordinate_converter Claude.html` PASS
- `git merge --ff-only 4fb9c2f…` → tip esatto candidate
- Push HTTPS `main` → `4fb9c2f…`
- **NON** mergeato review branch evidence docs nel runtime commit

## B — Backlog Waypoint layout (docs-only)

- `GIS-WAYPOINT-MODAL-LAYOUT-A` = **BACKLOG / NOT OPENED**
- Commit docs: `65f6996d2a03f0f4550533bcd4df5eaf55024c95`
- Evidence: [`2026-08-21_1140_GIS-WAYPOINT-MODAL-LAYOUT-A-backlog.md`](2026-08-21_1140_GIS-WAYPOINT-MODAL-LAYOUT-A-backlog.md)
- Monolite blob post-docs: **`192c3b41543d6bedfbc899e6b3c8d1e3fe427464`** (invariato)

## C — Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| SSH | `ionos-n8n` (Tailscale `:22` 502; pubblica OK) |
| VPS path | `/root/local-files/handoff-runtime/cursor-coordinate-converter` |
| VPS HEAD | `65f6996d2a03f0f4550533bcd4df5eaf55024c95` (docs tip; monolite ≡ candidate) |
| Blob | `192c3b41543d6bedfbc899e6b3c8d1e3fe427464` |
| `goi-gis-app` | restart PID `2874580`→`2887632` · **active** |
| Proxy PID | `2481045` **invariato** |
| HTTP | **200** |
| CMP | **PASS** · SHA-256 `26ec40ebe3db657e03bdb10f6c7df62f8c3ef8bbea701ef652cb7a35f6bab196` · bytes `10836721` · git-blob served = reviewed |
| Markers | APP_BUILD_NUM **240** · ID `GIS-POLYGON-VERTEX-COORD-UX-A-FIX1` |

**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=4fb9c2f`

## D — Automated Browser QA — PASS

**AUTOMATED BROWSER QA GIS-POLYGON-VERTEX-COORD-UX-A-FIX1 PASS**

URL test: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=4fb9c2f-abqa`

| # | Caso | Esito |
| --- | --- | --- |
| 1 | Edit poligono ≥4 vertici | PASS |
| 2 | Lista Coordinate vertici ordinata | PASS |
| 3 | Format DD/DMS/UTM/MGRS refresh | PASS (select popolato) |
| 4 | Drag live + readout + handle | PASS |
| 5 | Copia = testo visualizzato | PASS |
| 6 | Paste DD/DMS/UTM/MGRS + Plus/BNG/SK42 | PASS |
| 7 | Invalid fail-closed | PASS |
| 8 | Salva geometria | PASS |
| 9 | Annulla restore | PASS |
| 10 | Insert/delete | PASS |
| 11 | Whole polygon move | PASS |
| 12 | Reopen coerente | PASS |
| 13 | Tracce smoke | PASS |
| 14 | Waypoint smoke | PASS |
| 15 | Network delta 0 | PASS |
| 16 | Console errori attribuibili | 0 |

### D-Flight resize observation

- `F_mvisa_build_199` / `Tf_build_196` / `H_build_214` **PASS** sul deploy.
- Selftest `FIX3_D4_resize_handles_anchored` resta **false** perché attende `ne.right === "42px"`; sul deploy reale i corner handles sono presenti e ancorati (`ne/se/nw/sw` ai vertici, `right/left/top/bottom` coerenti col full-perimeter resize). **Nessuna regressione attribuibile a FIX1** (diff solo vertex-coord UX). Assertion selftest storica vs CSS edge-resize attuale.

### Waypoint layout backlog

Bug `GIS-WAYPOINT-MODAL-LAYOUT-A` **non** corretto in questo pass. Gruppo visibilità ancora presente in modal; build 240 non lo rimuove/peggiora in modo osservabile oltre al finding già registrato.

## Gate

**QA FINALE CHATGPT — PENDING**

Non attestare QA operatore. Non `finito`.

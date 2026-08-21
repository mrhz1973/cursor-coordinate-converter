# GIS-POLYGON-VERTEX-COORD-UX-A-FIX4 — REVIEW PASS + deploy GIS + ABQA PASS

**BLOCK-ID:** `GIS-POLYGON-VERTEX-COORD-UX-A-FIX4`  
**Categoria:** DELICATO — draft vertex drag during Nuovo poligono  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE uscita:** **CLOSED / PASS** (QA operatore PASS · finito Regola H)

## REVIEW GPT-SOSTITUTIVA

| Campo | Valore |
| --- | --- |
| Reviewed runtime FULL SHA (immutable) | `5857cbb2c3fc73e688ae26c1e2a359bb76199416` |
| Reviewed monolite blob | `04cfdfcc1eed8979e60b9ff176f93ceee79ccfcb` |
| BASE FULL SHA | `19a019138b2b23513467813fcb7c460ce88d862f` |
| BRANCH | `review/GIS-POLYGON-VERTEX-COORD-UX-A-FIX4-243` |
| Build / ID | **243** / `GIS-POLYGON-VERTEX-COORD-UX-A-FIX4` |
| Verdetto | **PASS** |
| Backstop reviewer AI esterno | post-hoc quando disponibile — **non** blocca questo bundle |

### Checklist (sintesi)

- Handle draft `.poly-edit-handle` / hit su tutti i vertici (incluso il primo) · grab/grabbing
- Drag via `mapPolyEditDocDrag` `source:"draft"` · no add/remove vertici · no persist prematuro
- Coordinate / Area-Perimetro live · click senza soglia → Modifica vertice
- Cancel/finish cleanup · edit-mode path invariato semanticamente
- Out-of-scope invariati (MAP-CENTER / dock / snap WP / presets / metrics compact / WP layout / text export)

## A — Promozione runtime

- Pre-gate `ls-remote main` = `c80f2803a2737a998eb1abe7bd5ffdbba9293822` (docs oltre BASE) PASS
- LIVE pre-promote blob = `2e0075ba…` (build 242 FIX3) PASS
- **NON** mergeato review branch tip (`105ea07` docs-only)
- Cherry-pick exact `5857cbb…` → tip `ccb41668576686bd96ada4900e11e21f0e07ad3d`
- Post-cherry-pick blob = **`04cfdfcc1eed8979e60b9ff176f93ceee79ccfcb`** PASS
- Markers 243 / FIX4 PASS · Push HTTPS `main` → `ccb4166…`

## B — Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| SSH | `ionos-n8n` |
| VPS path | `/root/local-files/handoff-runtime/cursor-coordinate-converter` |
| VPS HEAD | `ccb41668576686bd96ada4900e11e21f0e07ad3d` |
| Blob | `04cfdfcc1eed8979e60b9ff176f93ceee79ccfcb` |
| `goi-gis-app` | restart PID `2890759`→`2898471` · **active** |
| Proxy PID | `2481045` **invariato** |
| HTTP | **200** |
| CMP | **PASS** · SHA-256 `0cee32f0608f02544d6ec31c2ef731628c86b6e26cb7e823d89ca3e36c61dd5a` · bytes `10845218` · served ≡ worktree · git-blob = reviewed |
| Markers | APP_BUILD_NUM **243** · ID `GIS-POLYGON-VERTEX-COORD-UX-A-FIX4` |

**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=ccb4166`

## C — Automated Browser QA — PASS

**AUTOMATED BROWSER QA GIS-POLYGON-VERTEX-COORD-UX-A-FIX4 PASS**

URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=ccb4166-abqa2`  
**17/17 PASS** · pageerrors **0** · JSON [`2026-08-21_1945_GIS-POLYGON-VERTEX-COORD-UX-A-FIX4-abqa.json`](2026-08-21_1945_GIS-POLYGON-VERTEX-COORD-UX-A-FIX4-abqa.json)

| # | Acceptance | Esito |
| --- | --- | --- |
| 1 | Nuovo poligono ≥4 vertici + handles | PASS |
| 2 | grab/grabbing + primo vertice trascinabile | PASS |
| 3 | drag senza add/remove | PASS |
| 4 | coord / info live | PASS |
| 5 | click → Modifica, no nuovo vertice | PASS |
| 6 | zoom + drag allineamento geometrico | PASS |
| 7 | finish = draft; no persist prematuro | PASS |
| 8 | cancel + nuovo draw clean | PASS |
| 9 | regressione edit handles | PASS |
| 10 | page/console; no net GPS/schema delta | PASS |

## Gate

**QA FINALE CHATGPT — PASS operatore** (2026-08-21) → auto-`finito` Regola H.

Evidence chiusura: [`2026-08-21_2035_riepilogo_finito-GIS-POLYGON-VERTEX-COORD-UX-A-FIX4.md`](2026-08-21_2035_riepilogo_finito-GIS-POLYGON-VERTEX-COORD-UX-A-FIX4.md).

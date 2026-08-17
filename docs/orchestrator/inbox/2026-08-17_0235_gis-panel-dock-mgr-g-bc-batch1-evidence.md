# GIS-PANEL-DOCK-MGR-G-BC-BATCH1 — evidence unica

**BLOCK-ID:** `GIS-PANEL-DOCK-MGR-G-BC-BATCH1`  
**WU:** WU-0021  
**Tipo:** RUNTIME BATCH — 5 lane, one final candidate  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (nessun verdetto in questo pass)

## Candidate

| Campo | Valore |
| --- | --- |
| BASE | `361345d6d330347a0ced6cd57c4a3fcb7d7b173a` · build **211** · `GIS-PANEL-DOCK-MGR-G-B` · blob `a0b8661422d8646ee07ec7ff41ba25c7c67cbb42` |
| FULL SHA finale | `7e984dff49bd7a0a2396f11b028f4f264c90fe52` |
| Build / APP_BUILD_ID | **212** / `GIS-PANEL-DOCK-MGR-G-BC-BATCH1` |
| Blob | `b7919851a867e7b72c06e9115000c8c0f7cb960f` |
| Bytes LF | `10417415` |
| SHA-256 LF | `fb93cdcafa86787d65ecd6f64167b39124baf3c330b0c999bd4433dd8cc98c75` |
| Ancestry | `361345d` (G-B) ← … ← `7e984df` (G-BC-BATCH1) |
| LIVE pre-batch | `525e7df…` / **210** (invariato — **no deploy**) |
| Diff vs BASE | `+367 / −41` · **21 hunk** · **OTHER = 0** |

## Hunk classification (vs `361345d`)

| Lane | Hunks | Note |
| --- | --- | --- |
| BUILD | 16 | `APP_BUILD_*` + pin selftest `211→212` / ID G-BC-BATCH1 |
| L5 CARTO | 4 (+1 mixed) | export `cartoIgmStartAreaPick`; sync `_cartoUi.isMinimized` in `gisMinimizePanel` |
| SELFTEST | 1 (mixed L5) | `gisDockSelfTestGC` + extend chain |
| OTHER | **0** | — |

Raw: sibling JSON `2026-08-17_0235_gis-panel-dock-mgr-g-bc-batch1-verify.json`.

## Lane results

| Lane | Esito | Runtime change | Test |
| --- | --- | --- | --- |
| 1/5 G-B LOCK | **CERTIFIED / NO RUNTIME CHANGE** (semantica) | solo pin build condiviso | workbench min≠no-op, chip, restore, dock reflow, close; ordinary/GB suite PASS |
| 2/5 G-C1 layers bbox | **CERTIFIED / NO CHANGE** | lifecycle invariato | auto-min once + restore; manual pre-min no restore flag; safeTop OK; block helper intact |
| 3/5 G-C2 poly+RR | **CERTIFIED / NO CHANGE** | invariato | poly auto-min/`skipBlockCheck`/manual≠auto; RR pick min + restore via open; RR blocked picker |
| 4/5 G-C3 interaction | **CERTIFIED / NO CHANGE** | invariato | track/wp/fav/astro blocked + roundtrip; routing pick cleanup on minimize |
| 5/5 G-C4 D-Flight+Carto | **PATCHED** (sync only) | carto SoT sync + export start | Zone/Details min/restore/both; pair not in reflow; carto min/restore/`_cartoUi`; area-pick auto-min + manual flag; cancel restore |

## Selftest

- Suite completa: **524 / 524** PASS (`GOIDflight.selfTest()`)
- Baseline G-B era 486; delta = check G-C (+ pin rename)
- `DOCK_GC_*` = 38 check · 0 fail
- `DOCK_GB_*` regressione: 0 fail

## Matrix browser locale

| Viewport | safeTop ≥ max(header,dock)+10 | nMin≥3 |
| --- | --- | --- |
| 1400×900 | PASS | PASS |
| 900×700 | PASS | PASS |
| 360×640 | PASS | PASS |
| resize 1400→360→1400 | PASS | PASS |

G-B smoke workbench: min+chip+restore **PASS**. Single `#gisMinimizedDock` / single `_gisMinimizedPanels[]` **PASS**.

## Invarianti

- Workbench whitelist presente
- Un solo dock / un solo SoT session-only
- G-A1-FIX2 safeTop semantics invariati
- WU-0019: `dflightEnsurePairLayout` **non** in `gisDockReflow` / `gisPanelSafeTop`; restore usa `dflightRestorePanelToSafeTop`
- Helper **0.1.3** (fuori monolite) non toccato
- No nuova rete / GPS / storage / IDB
- `state.mapWaypoints[]` invariato (len 0 in probe)
- G-D / F / overflow +N / WU-0012 / search/convert/qr **NOT OPENED**
- close ≠ minimize; Esc semantics non riscritti

## Scope non toccato

- Lifecycle bbox/poly/RR/D-Flight pair algorithm (solo cooperazione dock già presente + carto sync)
- Overflow +N, G-D, F
- `infra/dflight-helper/**`

## STOP

- **NON** deploy · **NON** ABQA · **NON** QA operatore · **NON** finito  
- Gate: **REVIEW GPT-SOSTITUTIVA — PENDING**

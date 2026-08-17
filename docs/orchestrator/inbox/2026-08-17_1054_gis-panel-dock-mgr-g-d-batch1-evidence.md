# GIS-PANEL-DOCK-MGR-G-D-BATCH1 — evidence unica

**BLOCK-ID:** `GIS-PANEL-DOCK-MGR-G-D-BATCH1`  
**WU:** WU-0021  
**Tipo:** RUNTIME BUNDLE — 10 task G-D (responsive/polish dock)  
**Categoria:** **DELICATO**  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING** (nessun verdetto in questo pass)

## Candidate

| Campo | Valore |
| --- | --- |
| BASE | `7e984dff49bd7a0a2396f11b028f4f264c90fe52` · build **212** · `GIS-PANEL-DOCK-MGR-G-BC-BATCH1` · blob `b7919851a867e7b72c06e9115000c8c0f7cb960f` |
| FULL SHA candidato | `7fb0c202378966a412e454459f2fdf278e14ccee` |
| Build / APP_BUILD_ID | **213** / `GIS-PANEL-DOCK-MGR-G-D-BATCH1` |
| Blob | `bbc9a5c88888b9d0a79fcef2374a252aaf9893b7` |
| Bytes LF | `10447923` |
| SHA-256 LF | `27ed02b50032c5001076aaf0bd1b59d11b3bc59669b095d7eb38832f61fa0949` |
| LIVE (invariato — **no deploy**) | `7e984dff49bd7a0a2396f11b028f4f264c90fe52` / **212** |
| Diff vs BASE | `+821 / −144` · **27 hunk** · **OTHER = 0** |

Raw browser: sibling JSON `2026-08-17_1054_gis-panel-dock-mgr-g-d-batch1-verify.json`.

## 10 task — esito aggregato

| Task | Esito | Evidenza |
| --- | --- | --- |
| 1 DUAL-SIDE HEADER CAPACITY | **PASS** | `gisDockMeasureHeader` via `getBoundingClientRect` su `.brand-main`, `#appTopbar`, `.header-ctrls` |
| 2 RIGHT-SIDE STABILITY | **PASS** | 1920: 4 chip restano `right` all’arrivo del 5° |
| 3 LEFT BEFORE SECOND ROW | **PASS** | 1920: 5° → `left`; 900: `rightAvail=0` → chip su `left` prima della row |
| 4 NO-5TH-CHIP-JUMP | **PASS** (bloccante) | 1920×900: 4 right + 1 left, **row=0**; i primi non saltano sotto la barra |
| 5 BRAND/CONTROLS COLLISION | **PASS** | collision hits `[]` su 1920/1400/900/360; brand non ridotto |
| 6 HEADER-HEIGHT-BUDGET | **PASS** | `headerBudgetExtra=58` px = chipRowH misurata + pad (non costante inventata) |
| 7 OVERFLOW +N USABILE | **PASS** | 360×640: 2 chip row + **Altri 7**; restore da overflow in selftest quando live |
| 8 MOBILE / NARROW | **PASS** | 360: `narrow=true`, lati non forzati, row + `+N` |
| 9 RESIZE STABLE | **PASS** | 1920→1400→900→360→1400; un solo dock; no ghost |
| 10 REGRESSION CONTRACT | **PASS** | selftest 564/564 include GA1/GB/GC + GD; pair non in reflow |

## Selftest

- Suite completa: **564 / 564** PASS (`GOIDflight.selfTest()`)
- Baseline G-BC: 524; delta = **40** check `DOCK_GD_*` (0 fail)
- Planner unit Node: widths `[90×5]`, `rightAvail=420`, `leftAvail=200` → **4 right, 1 left, 0 row, 0 overflow**

## Matrice viewport (Edge headless CDP)

| Viewport | inner | 4→5 / layout | +N | collision |
| --- | --- | --- | --- | --- |
| 1920×900 | 1920×900 | 4 **right** + 1 **left**, row=0 | no | `[]` |
| 1400×900 | 1400×900 | 2 right restano; leftAvail 25px insufficiente; extra in row | no | `[]` |
| 900×700 | 900×700 | rightAvail=0 → left poi row | no (9 chip stanno) | `[]` |
| 360×640 | 360×640 | `narrow`; solo row | **Altri 7** (2+7) | `[]` |
| resize 1920→1400→900→360→1400 | ok | no oscillazione/duplicati | — | `[]` |

**Caso operatore 4→5 desktop largo:** riprodotto a **1920×900** (a 1400 lo spazio destro misurato è 219px → solo 2 chip; non è un salto di massa).

Geometrie 1920 (5 chip): `leftAvail=284.6` · `rightAvail=479.0` · budget extra **58px**.

## Conferme esclusioni / invarianti

- **F** workspace due legende: **NOT OPENED** (zero patch)
- **Oggetti GIS:** **FROZEN / UNTOUCHED** (nessun test/minimize `gisWorkbenchPanel` in G-D; selftest GD asserisce untouched)
- **WU-0012:** invariata
- **WU-0019:** `dflightEnsurePairLayout` **non** in `gisDockReflow` / `gisPanelSafeTop`; nudge FIX2 invariato
- Un solo `#gisMinimizedDock` / un solo `_gisMinimizedPanels[]` · session-only · no nuova persistenza
- Helper **0.1.3** non toccato
- Nessuna nuova rete / GPS / storage / IndexedDB
- `state.mapWaypoints[]` invariato
- vanilla single HTML; no `<script src>` / `type="module"`
- i18n: chiavi overflow **solo IT** (L10N-EN-FR-FREEZE)

## Scope non toccato

- Lifecycle G-C (bbox/poly/RR/D-Flight pair algorithm)
- F, WU-0012, Oggetti GIS, helper
- `infra/dflight-helper/**`

## STOP

**REVIEW GPT-SOSTITUTIVA — PENDING** su FULL SHA `7fb0c202378966a412e454459f2fdf278e14ccee`.

**NON** deploy · **NON** ABQA post-deploy · **NON** QA operatore · **NON** finito.

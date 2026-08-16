# 2026-08-17 — GIS-PANEL-DOCK-MGR-G-A1-FIX2 · REVIEW PASS + deploy + ABQA

## Fatti stabili (EXTERNAL_ONLY)

- **Categoria:** DELICATO
- **REVIEW GPT-SOSTITUTIVA:** **PASS** sul FULL SHA `525e7df50cb4edf768b0da7f59e7414dd79d56de`
- **Runtime LIVE (deployato):** `525e7df50cb4edf768b0da7f59e7414dd79d56de` · build **210** · `APP_BUILD_ID=GIS-PANEL-DOCK-MGR-G-A1-FIX2`
- **Monolite blob:** `9aa5441d48b89968cb388e3a7c61ee6d063a964d`
- **SHA-256 LF / bytes:** `2b136a6f0ab8684a27bd4e29526b2e088499b2f242ff166e706ca5036ca40f3b` · **10386717**
- **Deploy GIS-only:** PASS — VPS FF `20708cf`→`b6c005d` · blob ≡ candidato · `goi-gis-app` restart MainPID `2736276`→`2737400` · proxy/GH/helper PID **invariati** (`2481045` / `2034035` / `2645184`) · HTTP **200** · file↔HTTP SHA MATCH · tip VPS `b6c005dfa07e22dcffadc748b182ae78c8c078c9`
- **URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=525e7df`
- **Helper:** `HELPER_VERSION = "0.1.3"` · PID invariato `2645184`
- **Automated Browser QA:** **PASS** (**39**/39, fail=0) — drag-up originale · critico 360×640/3chip · dock dinamico 0/1/3+removal · matrix 1400/900/360 · resize · i18n IT→EN→FR→IT · coverage 6 pannelli · partial-visible · WU-0019 · G-A1 FIFO/z · negatives
- **FOUNDATION:** PASS · lifecycle completi **G-B/G-C** ancora riservati
- **NO** patch monolite in questo pass · **NO** finito · **NO** istruzioni QA operatore · **G-B/G-C/G-D NOT OPENED** · **F NOT OPENED**

## Critico FIX1 (LIVE)

| Campo | Valore |
| --- | --- |
| viewport | 360×640 · 3 chip · row |
| safeTop ≥ dock.bottom+gap | PASS (vedi ABQA `crit_360_3chip_*`) |
| handle hit | panel |
| drag-down | PASS |

## Gate

**QA FINALE CHATGPT — PENDING**

## ABQA summary

```json
{
  "ok": true,
  "n": 39,
  "pass": 39,
  "fail": 0,
  "fails": [],
  "url": "http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=525e7df-abqa",
  "foundation": "PASS",
  "lifecycle_reserved": ["G-B", "G-C"],
  "GB_GC_GD": "NOT OPENED",
  "F": "NOT OPENED"
}
```

JSON: [`2026-08-17_0130_gis-panel-dock-mgr-g-a1-fix2-abqa.json`](2026-08-17_0130_gis-panel-dock-mgr-g-a1-fix2-abqa.json) · deploy out: [`…-deploy-out.txt`](2026-08-17_0130_gis-panel-dock-mgr-g-a1-fix2-deploy-out.txt).

Evidence FIX2 pre-deploy: [`2026-08-17_0115_gis-panel-dock-mgr-g-a1-fix2-evidence.md`](2026-08-17_0115_gis-panel-dock-mgr-g-a1-fix2-evidence.md).

## Check ABQA (nomi)

`build_id` · `build_num` · `brand_tmart` · `selftest_full` · `op_drag_*` · `crit_360_3chip_*` · `dyn_*` · `geo_*` · `resize_*` · `nudge_preserves_xwh` · `i18n_cycle` · `panel_coverage` · `partial_visible` · `wu0019_regression` · `ga1_*` · `neg_*` · `console_no_severe` · `GB_GC_GD_NOT_OPENED` · `F_NOT_OPENED`

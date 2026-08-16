# 2026-08-17 — GIS-PANEL-DOCK-MGR-G-A1 · REVIEW PASS + deploy + ABQA

## Fatti stabili (EXTERNAL_ONLY)

- **Categoria:** DELICATO — layout/lifecycle trasversale multi-pannello
- **REVIEW GPT-SOSTITUTIVA:** **PASS** sul FULL SHA `7a5c42f3708cfa3dff3f7a7a7e1fdab5e470066c`
- **Runtime LIVE (deployato):** `7a5c42f3708cfa3dff3f7a7a7e1fdab5e470066c` · build **208** · `APP_BUILD_ID=GIS-PANEL-DOCK-MGR-G-A1`
- **Monolite blob:** `d57ead862ef65e894cb637b590650912ff261a16`
- **SHA-256 LF / bytes:** `8be66eacec91291c21fc650f5b3fde6e4b74e44bf265912c03fe4b1a5422c05b` · **10366856**
- **Deploy GIS-only:** PASS — VPS FF `bd7f626`→`20708cf` · blob ≡ candidato · `goi-gis-app` restart MainPID `2733569`→`2736276` · proxy/GH/helper PID **invariati** (`2481045` / `2034035` / `2645184`) · HTTP **200** · file↔HTTP SHA MATCH · tip VPS `20708cfc02a2138bb84aaef104b3f554b695fc80`
- **URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=7a5c42f`
- **Helper:** `HELPER_VERSION = "0.1.3"` · PID invariato `2645184`
- **Automated Browser QA:** **PASS** (**30**/30, fail=0) — shared dock · pilot UI favorites/measure · FIFO 3+ · geometria 1400/900/360 · resize · z-order hit-test · drawer/tools · i18n IT→EN→FR→IT · foundation smoke · WU-0019 · negatives
- **FOUNDATION:** PASS · lifecycle completi **G-B/G-C** ancora riservati
- **NO** patch monolite in questo pass · **NO** finito · **NO** istruzioni QA operatore · **G-B/G-C/G-D NOT OPENED** · **F NOT OPENED**

## Gate

**QA FINALE CHATGPT — PENDING**

## ABQA summary

```json
{
  "ok": true,
  "n": 30,
  "pass": 30,
  "fail": 0,
  "fails": [],
  "url": "http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=7a5c42f",
  "foundation": "PASS",
  "lifecycle_reserved": ["G-B", "G-C"],
  "GB_GC_GD": "NOT OPENED",
  "F": "NOT OPENED"
}
```

JSON completo locale: `C:\tmp\ga1_abqa_live.json` (copiato inbox sibling sotto).

Evidence review precedente: [`2026-08-16_2350_gis-panel-dock-mgr-g-a1-review-evidence-b.md`](2026-08-16_2350_gis-panel-dock-mgr-g-a1-review-evidence-b.md).

## Check ABQA (nomi)

`build_id` · `build_num` · `selftest_444` · `brand_tmart` · `single_dock_dom` · `dock_in_header` · `single_array` · `pilot_fav_*` · `pilot_meas_*` · `fifo_*` · `geo_1400/900/360_layout` · `resize_reflow` · `z_order_hit` · `drawer_tools_above_dock` · `i18n_cycle` · `foundation_smoke` · `wu0019_regression` · `neg_*` · `console_no_severe`

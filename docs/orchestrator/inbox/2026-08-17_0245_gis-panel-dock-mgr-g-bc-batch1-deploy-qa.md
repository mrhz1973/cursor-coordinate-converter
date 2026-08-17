# 2026-08-17 — GIS-PANEL-DOCK-MGR-G-BC-BATCH1 · REVIEW PASS + deploy + ABQA

## Fatti stabili (EXTERNAL_ONLY)

- **Categoria:** DELICATO
- **REVIEW GPT-SOSTITUTIVA:** **PASS** sul FULL SHA `7e984dff49bd7a0a2396f11b028f4f264c90fe52`
- **Runtime LIVE (deployato):** `7e984dff49bd7a0a2396f11b028f4f264c90fe52` · build **212** · `APP_BUILD_ID=GIS-PANEL-DOCK-MGR-G-BC-BATCH1`
- **Monolite blob:** `b7919851a867e7b72c06e9115000c8c0f7cb960f`
- **SHA-256 LF / bytes:** `fb93cdcafa86787d65ecd6f64167b39124baf3c330b0c999bd4433dd8cc98c75` · **10417415**
- **Deploy GIS-only:** PASS — VPS FF `b6c005d`→`6464345` · blob ≡ candidato · `goi-gis-app` restart MainPID `2737400`→`2738253` · proxy/GH/helper PID **invariati** (`2481045` / `2034035` / `2645184`) · HTTP **200** · file↔HTTP SHA MATCH · tip VPS `64643455c303914dc4f11268f17ae961fe205b15`
- **URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=7e984df`
- **Helper:** `HELPER_VERSION = "0.1.3"` · PID invariato `2645184`
- **Automated Browser QA:** **PASS** (**78**/78, fail=0) — G-B workbench · G-C1 layers bbox · G-C2 poly/RR · G-C3 interaction · G-C4 D-Flight/Carto · FIX2 matrix 1400/900/360 · resize · i18n · z/overlay · lifecycle · invarianti · selftest 524/524
- **NO** patch monolite in questo pass · **NO** finito · **NO** istruzioni QA operatore · **G-D NOT OPENED** · **F NOT OPENED**

## Gate

**QA FINALE CHATGPT — PENDING**

## ABQA summary

```json
{
  "ok": true,
  "n": 78,
  "pass": 78,
  "fail": 0,
  "fails": [],
  "url": "http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=7e984df-abqa",
  "selftest": { "ok": true, "total": 524 },
  "build": { "id": "GIS-PANEL-DOCK-MGR-G-BC-BATCH1", "num": 212 },
  "G-D": "NOT OPENED",
  "F": "NOT OPENED"
}
```

JSON: [`2026-08-17_0245_gis-panel-dock-mgr-g-bc-batch1-abqa.json`](2026-08-17_0245_gis-panel-dock-mgr-g-bc-batch1-abqa.json) · deploy out: [`…-deploy-out.txt`](2026-08-17_0245_gis-panel-dock-mgr-g-bc-batch1-deploy-out.txt).

Evidence pre-deploy: [`2026-08-17_0235_gis-panel-dock-mgr-g-bc-batch1-evidence.md`](2026-08-17_0235_gis-panel-dock-mgr-g-bc-batch1-evidence.md).

## Coverage (nomi check)

`build_*` · `selftest_full` · `gb_*` · `gc1_*` · `gc2_*` · `gc3_*` · `gc4_df_*` · `gc4_carto_*` · `fix2_*` · `z_*` · `life_*` · `inv_*` · `viewport_*` · `resize_1400_360_1400` · `console_no_severe`

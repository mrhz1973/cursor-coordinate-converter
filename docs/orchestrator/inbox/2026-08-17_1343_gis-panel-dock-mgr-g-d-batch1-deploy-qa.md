# 2026-08-17 — GIS-PANEL-DOCK-MGR-G-D-BATCH1 · REVIEW PASS + deploy + ABQA

## Fatti stabili (EXTERNAL_ONLY)

- **Categoria:** DELICATO
- **REVIEW GPT-SOSTITUTIVA:** **PASS** sul FULL SHA `7fb0c202378966a412e454459f2fdf278e14ccee` (evidence B già pubblicata)
- **Runtime LIVE (deployato):** `7fb0c202378966a412e454459f2fdf278e14ccee` · build **213** · `APP_BUILD_ID=GIS-PANEL-DOCK-MGR-G-D-BATCH1`
- **Monolite blob:** `bbc9a5c88888b9d0a79fcef2374a252aaf9893b7`
- **SHA-256 LF / bytes:** `27ed02b50032c5001076aaf0bd1b59d11b3bc59669b095d7eb38832f61fa0949` · **10447923**
- **Deploy GIS-only:** PASS — VPS FF `6464345`→`956efa7` · blob ≡ candidato · `goi-gis-app` restart MainPID `2738253`→`2746464` · proxy/GH PID **invariati** (`2481045` / `2034035`) · HTTP **200** · file↔HTTP SHA MATCH · tip VPS `956efa7c89670115f1a31c13e8e256d7f89b5a0f`
- **URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=7fb0c20`
- **Helper:** `HELPER_VERSION = "0.1.3"` · servizio **non** riavviato (GIS-only). Conferma post-deploy systemd MainPID `2645184` / active. Log pgrep in-deploy: `2643028`→`2643028` (invariato sul restart GIS).
- **Automated Browser QA:** **PASS** (**32**/32, fail=0) — build 213 LIVE · 1920 4 right + 5° left · 1400 right prefix stabile · 900 left-before-row · 360 overflow «Altri 9» + restore tastiera · resize no loss/dup · lifecycle min≠close / Esc / automin / pair spy=0 / workbench untouched · safeTop · console vuota · selftest **564/564** su pagina pulita
- **NO** patch monolite in questo pass · **NO** finito · **NO** istruzioni QA operatore · **F NOT OPENED** · Oggetti GIS **FROZEN**

## Gate

**QA FINALE CHATGPT — PENDING**

## ABQA summary

```json
{
  "ok": true,
  "n": 32,
  "pass": 32,
  "fail": 0,
  "fails": [],
  "url": "http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=7fb0c20-abqa",
  "selftest": { "ok": true, "total": 564, "fail": 0 },
  "build": "213 / GIS-PANEL-DOCK-MGR-G-D-BATCH1",
  "F": "NOT OPENED"
}
```

JSON: [`2026-08-17_1343_gis-panel-dock-mgr-g-d-batch1-abqa.json`](2026-08-17_1343_gis-panel-dock-mgr-g-d-batch1-abqa.json) · deploy out: [`…-deploy-out.txt`](2026-08-17_1343_gis-panel-dock-mgr-g-d-batch1-deploy-out.txt).

Evidence pre-deploy: [`2026-08-17_1054_gis-panel-dock-mgr-g-d-batch1-evidence.md`](2026-08-17_1054_gis-panel-dock-mgr-g-d-batch1-evidence.md) · REVIEW-EVIDENCE-B: [`2026-08-17_1215_gis-panel-dock-mgr-g-d-batch1-review-evidence-b.md`](2026-08-17_1215_gis-panel-dock-mgr-g-d-batch1-review-evidence-b.md).

## Coverage (nomi check)

`build_213_live` · `gd1_*` (1920 progressive / 4r+5th left / no mass relocation / no collision) · `gd2_*` (1400 right stable / row only if insufficient / no collision) · `gd3_*` (900 left before row) · `gd4_*` (360 mobile row / overflow reale / Enter / restore keyboard / Space / close restored) · `gd5_*` (single dock / no ghost / no chip loss) · `gd6_*` (min≠close / restore / close chip / Esc modal / Esc help never min / automin / pair spy / workbench) · `gd7_*` (safeTop / handle) · `gd8_console_no_severe` · `selftest_full`

## Conferma LIVE post-ABQA (2026-08-17 13:42 +02)

VPS HEAD `956efa7c89670115f1a31c13e8e256d7f89b5a0f` · blob `bbc9a5c8…` · GIS PID `2746464` · HTTP 200 / SHA MATCH / BUILD 213 OK.

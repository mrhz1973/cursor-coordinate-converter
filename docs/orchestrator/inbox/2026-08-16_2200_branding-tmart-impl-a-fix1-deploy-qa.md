# 2026-08-16 — BRANDING-TMART-IMPL-A-FIX1 · REVIEW PASS + deploy + ABQA

## Fatti stabili (EXTERNAL_ONLY)

- **Categoria:** ROUTINE — branding user-facing
- **REVIEW GPT-SOSTITUTIVA:** **PASS** sul FULL SHA `508dd039981b1878e427c9440033fcad854351b1`
- **Runtime LIVE (deployato):** `508dd039981b1878e427c9440033fcad854351b1` · build **207** · `APP_BUILD_ID=BRANDING-TMART-IMPL-A-FIX1`
- **Monolite blob:** `09fe2b4ac405f874866b19898ee844fe52ea1d8f`
- **SHA-256 LF / bytes:** `9b5ce67fe387a061af318ff2477da26b4f9e31d43821a40a022eb2bcd5f039c0` · **10352304**
- **Deploy GIS-only:** PASS — VPS FF → tip docs `bd7f626` · blob ≡ candidato · `goi-gis-app` restart MainPID `2732682`→`2733569` · helper/proxy/GH PID **invariati** · HTTP **200** · file↔HTTP SHA MATCH · `HEADER_OK` (no `.brand-by`/`.brand-signature` in `<header>`)
- **URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=508dd03`
- **Helper:** `HELPER_VERSION = "0.1.3"` · PID invariato `2645184`
- **Automated Browser QA:** **PASS** (**30**/30, fail=0) — desktop header brand-only · narrow 360×640 · i18n IT/EN/FR · footer T.M. · title/meta · `t("app.title")` · export · negatives · orphan CSS no UI
- **NO** patch monolite in questo pass · **NO** finito · **NO** istruzioni QA operatore · **G NOT OPENED**

## Gate

**QA FINALE CHATGPT — PENDING**

## ABQA summary

```json
{
  "ok": true,
  "fail": [],
  "n": 30,
  "title": "TMART GIS tool · BRANDING-TMART-IMPL-A-FIX1 · build 207",
  "build": { "id": "BRANDING-TMART-IMPL-A-FIX1", "num": 207 },
  "narrow": {
    "title": "TMART GIS tool",
    "brandH": 24.625,
    "ctrlW": 344,
    "overflow": false,
    "noByMarty": true,
    "ok": true
  }
}
```

Evidence FIX1 implementazione: [`2026-08-16_2150_…fix1-evidence.md`](2026-08-16_2150_branding-tmart-impl-a-fix1-evidence.md).

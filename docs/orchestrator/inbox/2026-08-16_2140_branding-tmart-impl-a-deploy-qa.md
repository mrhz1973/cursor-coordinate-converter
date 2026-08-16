# 2026-08-16 — BRANDING-TMART-IMPL-A · REVIEW PASS + deploy + ABQA

## Fatti stabili (EXTERNAL_ONLY)

- **Categoria:** ROUTINE — branding user-facing
- **REVIEW GPT-SOSTITUTIVA:** **PASS** sul FULL SHA `1abc247fd783526531307c7a6997292f103b986d`
- **Runtime LIVE (deployato):** `1abc247fd783526531307c7a6997292f103b986d` · build **206** · `APP_BUILD_ID=BRANDING-TMART-IMPL-A`
- **Monolite blob:** `f0f9d265bd368a62dfb6efc2dc32b4fbe31b51ef`
- **SHA-256 LF / bytes:** `fdf4f770c1bdda487ff7c2be29704b0b28d314e19ef5eccad09c475a21e8608d` · **10352377**
- **Deploy GIS-only:** PASS — VPS FF `4fde856`→`f872e77` · blob ≡ candidato · `goi-gis-app` restart MainPID `2730956`→`2732682` · helper/proxy/GH PID **invariati** · HTTP **200** · file↔HTTP SHA MATCH
- **URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=1abc247`
- **Helper:** `HELPER_VERSION = "0.1.3"` (`/opt/goi-dflight-helper/current`) · PID invariato `2645184`
- **Automated Browser QA:** **PASS** (**33**/33, fail=0) — header · narrow · title/meta · footer · i18n IT/EN/FR · export GPX/KML/GeoJSON/CSV/poly/range/measure · negatives · CTA
- **NO** patch monolite in questo pass · **NO** finito · **NO** istruzioni QA operatore · **G NOT OPENED**

## Gate

**QA FINALE CHATGPT — PENDING**

## ABQA summary

```json
{
  "ok": true,
  "fail": [],
  "n": 33,
  "title": "TMART GIS tool · BRANDING-TMART-IMPL-A · build 206",
  "langResults": ["it:ok", "en:ok", "fr:ok"],
  "highlights": {
    "AB1_header": "TMART GIS tool | by | Marty",
    "AB3_title_meta": "TMART GIS tool · … / application-name=TMART GIS tool",
    "AB4_footer": "TMART GIS tool · Realizzato da T.M. · no dup by Marty",
    "AB6_exports": "GPX/KML/GeoJSON/CSV/poly/range/measure brand OK · no GOI",
    "AB7_negatives": "coordconv_v2 · CoordConvMapTiles · CoordinateConverter/1.0 · mapWaypoints · filename OK",
    "AB2_narrow": "title readable · ctrls reachable · no H-overflow (Emulation 360x640; wrap naturale ammesso)"
  }
}
```

Nota percettiva (non FAIL): su viewport ~360px il titolo può andare a capo aggressivo (`overflow-wrap:anywhere` preesistente); controlli raggiungibili, no overflow orizzontale. Residuo umano se l’operatore lo valuta estetico.

Evidence review: [`2026-08-16_2135_…review-evidence-b.md`](2026-08-16_2135_branding-tmart-impl-a-review-evidence-b.md).

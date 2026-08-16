# 2026-08-16 12:00 — D-FLIGHT-ATM09-LEGEND-UX-IMPL-A · deploy + Automated Browser QA

## Fatti stabili (pre-autosync, EXTERNAL_ONLY)

- **Categoria:** ROUTINE (UI/CSS/HTML + JS a basso rischio)
- **Runtime LIVE:** `016be9e58d33c233e7a2ef01757ee1840e3bc0bb` · build **198** · `APP_BUILD_ID=D-FLIGHT-ATM09-LEGEND-UX-IMPL-A`
- **Catena:** `469b685` (feat 8-row user legend) → `016be9e` (fix technical WMS non-competitive)
- **Baseline pre-patch:** `950d7e9` / review runtime `d2d3ab3` / **197**
- **Logica:** `#dflightAtm09UserLegend` esterna map-anchored; paint-driven via `dflightLegendPaintMode` + `dflightSyncContextualLegends`; EnsureLegend tiene technical details/PNG nascosti; 8 swatch ufficiali inline data-URI
- **Bbox crop (asset 960×422):** `[267,153,280,165)` · `[267,171,280,184)` · `[267,190,280,203)` · `[267,209,280,222)` · `[267,227,280,241)` · `[268,247,279,259)` · `[268,266,280,278)` · `[267,284,280,298)`
- **Statici:** PASS · selftest **356/356** PASS
- **Deploy GIS-only:** PASS — VPS pull `016be9e` · `goi-gis-app` active · HTTP 200 · bytes **10297343** · SHA-256 LF `cdbf06f065154f5e2dced0361cf0b7fab07a77321501abf4a32d65e921ba102e` byte-match · helper **0.1.3** active
- **URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=016be9e`
- **Automated Browser QA:** PASS (AB-1…AB-13 + SELFTEST_LIVE 356/356)
- **Planet-Clone / helper:** non toccati
- **QA operatore:** pending — NON dichiarata PASS · NO finito pre-QA

## Gate

**QA FINALE CHATGPT — PENDING**

## Limiti

Monolite già in commit runtime `016be9e` (escluso da questo autosync). Fatti autosync corrente: **EXTERNAL_ONLY**.

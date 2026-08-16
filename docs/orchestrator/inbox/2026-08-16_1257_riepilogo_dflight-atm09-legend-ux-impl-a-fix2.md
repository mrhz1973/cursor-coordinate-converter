# 2026-08-16 12:57 — D-FLIGHT-ATM09-LEGEND-UX-IMPL-A-FIX2 · presentation stability

## Fatti stabili (pre-autosync, EXTERNAL_ONLY)

- **Categoria:** ROUTINE FIX (legend presentation vs transient READY)
- **Runtime LIVE:** `67d9cc79c4896adc39b7a38a6828bf4d31346305` · build **200** · `APP_BUILD_ID=D-FLIGHT-ATM09-LEGEND-UX-IMPL-A-FIX2`
- **Baseline:** `c1c1b85` / **199** (FIX1) · docs tip pre `787fd91`
- **Root cause:** `dflightLegendPaintMode` richiede READY; pan → `BeginTileGeneration` → READY false → SyncContextual nascondeva user legend
- **Fix:** `dflightLegendPresentationMode` + latch session-only + `_dflightAtm09TileReloadActive` (no timer/debounce/opacity)
- **Invariati:** paint semantics · FIX1 positioning · 8 row/swatch · helper 0.1.3 · no endpoint
- **Selftest:** **392/392** PASS
- **Deploy GIS-only:** PASS — HTTP 200 · bytes **10312508** · SHA-256 LF `10684ae0e32e36d9885f1558d3cba2aa2f7b7b5e3ba4b66cfe6572d3394dd2b3` byte-match
- **URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=67d9cc7`
- **Automated Browser QA:** PASS (AB-PAN-STABILITY campionato durante reload · AB-FALLBACK · AB-OFF · AB-LAYOUT)
- **Feedback operatore:** FIX1 layout/content PASS; FIX2 origin = flicker after pan
- **QA operatore FIX2:** pending — NO finito

## Gate

**QA FINALE CHATGPT — PENDING (FIX2 PAN STABILITY)**

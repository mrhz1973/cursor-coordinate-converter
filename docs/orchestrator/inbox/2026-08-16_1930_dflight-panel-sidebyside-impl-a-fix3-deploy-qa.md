# 2026-08-16 19:30 — D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX3 · REVIEW PASS + deploy + ABQA

## Fatti stabili (EXTERNAL_ONLY)

- **Categoria:** DELICATO — lifecycle/layout dialog
- **REVIEW GPT-SOSTITUTIVA:** **PASS** sul FULL SHA `9643ca0839878b154e68ffa003aa94570375d111`
- **Runtime LIVE (deployato):** `9643ca0839878b154e68ffa003aa94570375d111` · build **204** · `APP_BUILD_ID=D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX3`
- **Monolite blob:** `e89fd070444b62aaab2d0f0a26796286f0036866` (VPS tip docs `fd36f13` · blob ≡ candidato)
- **Deploy GIS-only:** PASS — VPS pull `554f9e6`→`fd36f13` · blob match · `goi-gis-app` active/enabled · MainPID `2729573`→`2730331` · HTTP **200** · bytes **10344255** · SHA-256 file↔HTTP `46e720a891010ee7bd41faa663a9fc5dc96561d6a14190d48b9fbdf7354dea9e`
- **URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=9643ca0`
- **Automated Browser QA:** **PASS** (31 checks, 0 fail) — ATM09 real click path · real pointer drag Zone/Details · resize-end · narrow · wide↔narrow · minimize/restore · legend z=5 · regressions
- **Helper:** `goi-dflight-helper.service` **active** (invariato; proxy/GH PID invariati `2481045` / `2034035`)
- **NO** patch monolite in questo pass · **NO** finito · **NO** istruzioni QA operatore

## Gate

**QA FINALE CHATGPT — PENDING**

## ABQA summary (anti-falso-positivo)

Path Details: fixture hit `.dflight-atm09-info-hit` + **MouseEvent click** → listener `dflightAtm09AttachInteraction` → `dflightAtm09OpenDetails` (atmCalls≥1). **Nessuna** chiamata diretta a `dflightEnsurePairLayout` nel path AB1. Drag/resize: `PointerEvent` reali su head/handle.

```json
{
  "ok": true,
  "fail": [],
  "n": 31,
  "names": [
    "AB_build_204",
    "AB_helper_base_present",
    "AB_open_zone",
    "AB1_atm09_called",
    "AB1_details_open",
    "AB1_desktop_no_overlap",
    "AB2_zone_touched",
    "AB2_zone_kept_after_pair",
    "AB2_no_overlap_after_zone_drag",
    "AB3_details_touched",
    "AB3_details_kept",
    "AB3_no_overlap_after_details_drag",
    "AB4_handle_present",
    "AB4_resize_touched_or_pair",
    "AB4_reachable_no_bad_overlap",
    "AB5_narrow_reachable",
    "AB5_narrow_no_full_cover",
    "AB6_wide_after_narrow",
    "AB7_minimize_restore_zone",
    "AB7_minimize_restore_details",
    "AB7_layout_after_restore",
    "AB8_legend_z5",
    "AB8_legend_pe_none",
    "AB8_dflight_above_legend",
    "AB8_other_floating_above",
    "AB8_drawer_above",
    "AB9_waypoints_stable",
    "AB9_no_new_localStorage_keys",
    "AB9_close_lifecycle_src",
    "AB9_no_gps_calls",
    "AB9_console_page_errors"
  ],
  "coords_ab1": { "zl": 12, "dl": 362, "zt": 95, "dt": 95, "overlap": false },
  "coords_ab2_after_zone_drag": { "zl": 192, "dl": 542, "overlap": false, "touched": true },
  "coords_ab3_after_details_drag": { "zl": 592, "dl": 202, "overlap": false, "touched": true },
  "legend": { "z": 5, "pe": "none", "panelZ": 27, "otherZ": 28, "drawerZ": 30 }
}
```

Evidence tecnica precedente: [`2026-08-16_1915_…fix3-review-evidence-b.md`](2026-08-16_1915_dflight-panel-sidebyside-fix3-review-evidence-b.md).

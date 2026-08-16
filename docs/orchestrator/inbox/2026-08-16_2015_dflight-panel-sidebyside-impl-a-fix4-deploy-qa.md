# 2026-08-16 20:15 — D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX4 · REVIEW PASS + deploy + ABQA

## Fatti stabili (EXTERNAL_ONLY)

- **Categoria:** DELICATO — lifecycle/layout dialog
- **REVIEW GPT-SOSTITUTIVA:** **PASS** sul FULL SHA `9820c8ab9cb0d2103adf955ba3b873bca4c89e08`
- **Runtime LIVE (deployato):** `9820c8ab9cb0d2103adf955ba3b873bca4c89e08` · build **205** · `APP_BUILD_ID=D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX4`
- **Monolite blob:** `689c831d902749d86d12667b18eab2bd84390662` (VPS tip docs `4fde856` · blob ≡ candidato)
- **Deploy GIS-only:** PASS — VPS pull `fd36f13`→`4fde856` · blob match · Wire FIX4 OK (`onDragEnd:` assente) · `goi-gis-app` active/enabled · MainPID `2730331`→`2730956` · HTTP **200** · bytes **10346944** · SHA-256 file↔HTTP `60e797622e543417be1414e91a202137d0192766f1900b73a144fcbaef8b6535`
- **URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=9820c8a`
- **Automated Browser QA:** **PASS** (35 checks, 0 fail) — ATM09 path · Zone/Details pointer-drag sibling invariant · intentional overlap respected · resize-end still pairs · narrow/wide · min/restore · legend z=5 · regressions
- **Helper:** `goi-dflight-helper.service` **active** · proxy/GH PID invariati `2481045` / `2034035`
- **NO** patch monolite in questo pass · **NO** finito · **NO** istruzioni QA operatore

## Gate

**QA FINALE CHATGPT — PENDING**

## ABQA summary (FIX4 anti-falso-positivo)

PointerEvent reali; sibling left/top confrontati PRIMA/DOPO; `dflightEnsurePairLayout` instrumentato (pairCalls=0 su drag-end). Overlap intenzionale = PASS se sibling non auto-spostato.

```json
{
  "ok": true,
  "fail": [],
  "n": 35,
  "highlights": {
    "AB1": { "atmCalls": 1, "overlap": false, "zl": 12, "dl": 362 },
    "AB2_zone_drag": { "touched": true, "detailsInvariant": true, "pairCalls": 0, "zl": 192, "dl": 362 },
    "AB3_details_drag": { "touched": true, "zoneInvariant": true, "pairCalls": 0, "zl": 192, "dl": 212 },
    "AB4_intentional_overlap": { "overlap": true, "zoneNotAutoMoved": true, "pairCalls": 0 },
    "AB5_resize_end": { "pairCalls": 1 },
    "AB8_legend": { "z": 5, "pe": "none" }
  }
}
```

Evidence tecnica precedente: [`2026-08-16_2000_…fix4-evidence.md`](2026-08-16_2000_dflight-panel-sidebyside-impl-a-fix4-evidence.md).

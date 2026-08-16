# 2026-08-16 — D-FLIGHT-PANEL-SIDEBYSIDE-AUDIT-A · WU-0019 OPEN

## Fatti stabili (EXTERNAL_ONLY)

- **Categoria:** DIAGNOSTIC / pre-IMPL DELICATO
- **WU:** WU-0019 **OPEN** (nuovo)
- **Blocco:** D-FLIGHT-PANEL-SIDEBYSIDE-AUDIT-A **AUDIT COMPLETE**
- **BASE:** `349774be06c01aa1a0f3130702dbb8881b3513f7`
- **LIVE (invariato):** `67d9cc7` / build **200** · helper **0.1.3**
- **Monolite:** **byte-invariato** (nessun patch)
- **Root cause:** pin default identico Zone+Details (`dflightPinPanelBelowTopbar`: same safeTop + `left=pad`)
- **Raccomandazione:** B — policy twin locale + riuso `gisPanel*` / geometry D-Flight; G OUT OF SCOPE
- **Blocker:** nessuno
- **Gate:** GPT AUDIT REVIEW — PENDING
- **NEXT:** review GPT → solo dopo PASS definire IMPL-A
- **Deploy / ABQA / QA operatore / finito runtime:** **NO**

## File

- `docs/work-units/WU-0019-dflight-panel-side-by-side.md` (nuovo)
- `docs/OPERATING_MEMORY.md` §7.1–7.3
- `docs/work-units/WU-0005-0009-roadmap.md` (candidato E OPEN)

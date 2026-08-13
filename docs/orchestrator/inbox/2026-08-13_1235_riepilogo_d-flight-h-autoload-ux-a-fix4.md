# D-FLIGHT-H-AUTOLOAD-UX-A-FIX4 — selftest isolation

**Data:** 2026-08-13 ~12:35 +02:00  
**Task:** `6780c8bccddcd21b4ae4cfdf828f0c3932ca75a3`  
**Subject:** fix(dflight): FIX4 isolate FIX3 selftests from network and live panel  
**Build:** `D-FLIGHT-H-AUTOLOAD-UX-A-FIX4` · **175**  
**Baseline:** `ab8c86039bc38eccb949a22f2c9869ab03e1c7d7`  
**Upstream FAIL:** FIX3 review GPT-sostitutiva (selftest side-effects)

## Fix (solo selftest)

1. **D2:** stub `dflightAtm09LegendUrl` → `data:image/png;base64,…`; restore fn + `img.onload`/`onerror` in finally; no http/https/helper.
2. **D3:** rimossa prova dinamica su `#dflightDetailsPanel`; sostituita con check statico source (`dflightWireFloatingPanel` + `dflightPinPanelBelowTopbar`). Browser QA resta autorità viewport/drag.
3. **D4:** invariato (`FIX3_D4_resize_handles_anchored`).
4. **Runtime D2/D3/D4:** frozen (semantica cacfa72).

## Validazione

- node --check PASS
- selfTest **165/165**
- isolation probe: `zeroNetworkPass=true`, `domPreservedPass=true` (title/body/open/flag/class/style/src/handlers)
- browser A/B/C/D PASS
- helper invariato; D1 invariato

## Gate

`D-FLIGHT-H-AUTOLOAD-UX-A-FIX4 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`

**NO deploy / NO QA operatore / NO finito.**

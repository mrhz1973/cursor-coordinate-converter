# FRONTIER — stato vivo

> **Unica fonte canonica LIVE STATE.** Il CORE BOOT legge questo file. **Non** duplicare lo stato operativo in OM §7.1 (pointer soltanto). Non persistire HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | WU-0019 — [`D-FLIGHT-PANEL-SIDE-BY-SIDE`](work-units/WU-0019-dflight-panel-side-by-side.md) (**OPEN**) |
| **BLOCCO ATTIVO** | D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A (**IMPLEMENTED / SELFTEST PASS / REVIEW GPT-SOSTITUTIVA — PENDING**) |
| **STATO BLOCCO** | pair layout `dflightEnsurePairLayout` · candidato `a689fe81` / build **201** · LIVE resta **200** fino a deploy post-review |
| **GATE CORRENTE** | **REVIEW GPT-SOSTITUTIVA — PENDING** |
| **REVIEW BASE** | monolite tip `67d9cc79c4896adc39b7a38a6828bf4d31346305` (build **200** / FIX2) |
| **RUNTIME LIVE** | monolite tip `67d9cc79c4896adc39b7a38a6828bf4d31346305` · build **200** · `APP_BUILD_ID=D-FLIGHT-ATM09-LEGEND-UX-IMPL-A-FIX2` · helper prod **0.1.3** (`http://100.114.7.53:8010`) |
| **NEXT** | REVIEW GPT-SOSTITUTIVA del FULL SHA candidato → solo dopo PASS: deploy GIS + ABQA |
| **ALTRI WORKSTREAM OPEN / READY / PARKED / FROZEN** | WU-0019 **OPEN** · WU-0018 **CLOSED / PASS** · WU-0017 **CLOSED / PASS** · WU-0016 **CLOSED / PASS** · WU-0015 **CLOSED / PASS** · WU-0014 **CLOSED / PASS** · WU-0013 **CLOSED / PASS** · WU-0012 OPEN / NEXT PROVIDER (NO PROVIDER READY) · WU-0010 OPEN (Bundle F futuro) · WU-0011 CLOSED/PASS (INFRA-GH-1A+1B) · Oggetti GIS **FROZEN** |

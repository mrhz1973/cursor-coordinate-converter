# FRONTIER — stato vivo

> **Unica fonte canonica LIVE STATE.** Il CORE BOOT legge questo file. **Non** duplicare lo stato operativo in OM §7.1 (pointer soltanto). Non persistire HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | WU-0019 — [`D-FLIGHT-PANEL-SIDE-BY-SIDE`](work-units/WU-0019-dflight-panel-side-by-side.md) (**OPEN**) |
| **BLOCCO ATTIVO** | D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX3 (**REVIEW GPT-SOSTITUTIVA — PENDING**) |
| **STATO BLOCCO** | Candidato `9643ca0` / build **204** · FIX3 Atm09+drag-end pair · LIVE ancora FIX2/203 · helper **0.1.3** · **NO deploy** |
| **GATE CORRENTE** | **QA FINALE CHATGPT — PENDING** |
| **REVIEW BASE** | monolite tip `67d9cc79c4896adc39b7a38a6828bf4d31346305` (build **200** / FIX2) |
| **RUNTIME LIVE** | monolite tip `a40d216300deefa2c23f6b20585f9543c6ee024c` · build **203** · `APP_BUILD_ID=D-FLIGHT-PANEL-SIDEBYSIDE-IMPL-A-FIX2` · helper prod **0.1.3** (`http://100.114.7.53:8010`) — **QA FAIL operatore**; candidato FIX3 non deployato |
| **NEXT** | REVIEW GPT-SOSTITUTIVA su `9643ca0` / **204** → (se PASS) deploy → ABQA → QA FINALE |
| **ALTRI WORKSTREAM OPEN / READY / PARKED / FROZEN** | WU-0019 **OPEN** · WU-0018 **CLOSED / PASS** · WU-0017 **CLOSED / PASS** · WU-0016 **CLOSED / PASS** · WU-0015 **CLOSED / PASS** · WU-0014 **CLOSED / PASS** · WU-0013 **CLOSED / PASS** · WU-0012 OPEN / NEXT PROVIDER (NO PROVIDER READY) · WU-0010 OPEN (Bundle F futuro) · WU-0011 CLOSED/PASS (INFRA-GH-1A+1B) · Oggetti GIS **FROZEN** |

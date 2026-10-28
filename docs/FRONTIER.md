# FRONTIER — stato vivo

> **Unica fonte canonica LIVE STATE.** Il CORE BOOT legge questo file. **Non** duplicare lo stato operativo in OM §7.1 (pointer soltanto). Non persistere HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | GIS Search |
| **WU ATTIVA** | `—` (N/A) |
| **BLOCCO ATTIVO** | `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX7` |
| **STATO BLOCCO** | **REVIEW FAIL — correzione FIX8 in lavorazione** |
| **GATE CORRENTE** | Review DELICATO — 257–261, FIX5/262 e FIX6/263 **REVIEW GPT-SOSTITUTIVA FAIL**; FIX7 **REVIEW CODEX INDIPENDENTE FAIL** (prefissi formato incoerenti fra ingressi) |
| **RUNTIME LIVE** | tip `f215011d9b725664506a1a155e27b64d5011fb99` · build **256** · `APP-BUILD-LABEL-UX-A` · blob Git `7f9804d5333145552bba65d6570749c070656951` |
| **RUNTIME CANDIDATE** | tip `080e71c161be76e3ff494b1cdee1aed6889f9290` · build **264** · `GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX7` · blob Git `dc1ec34ddb12c37e0502d074559e7a4aab279106` |
| **NEXT** | Correzione scoped FIX8 → review indipendente + QA geodetica mondiale e browser → deploy solo dopo gate e verifica identità SSH VPS. Evidence: [FIX7 FAIL](orchestrator/inbox/2026-10-28_1415_GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX7-review-fail.md) |
| **ALTRI WORKSTREAM** | **Oggetti GIS = FROZEN / MAINTENANCE-ONLY** · GIS VPS **256** · routing land-only audit STOP (nessun candidate) |

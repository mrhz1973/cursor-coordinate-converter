# FRONTIER — stato vivo

> **Unica fonte canonica LIVE STATE.** Il CORE BOOT legge questo file. **Non** duplicare lo stato operativo in OM §7.1 (pointer soltanto). Non persistire HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | [`WU-0021`](work-units/WU-0021-gis-panel-minimized-dock-manager.md) — Global GIS panel / minimized dock manager (candidato **G**) |
| **BLOCCO ATTIVO** | `GIS-PANEL-DOCK-MGR-G-D-BATCH1` |
| **STATO BLOCCO** | **G-D-BATCH1 candidato pushato** · CANDIDATE `7fb0c20` / **213** · LIVE invariato `7e984df` / **212** · **no deploy** |
| **GATE CORRENTE** | **REVIEW GPT-SOSTITUTIVA — PENDING** |
| **RUNTIME LIVE** | `7e984dff49bd7a0a2396f11b028f4f264c90fe52` · build **212** · `GIS-PANEL-DOCK-MGR-G-BC-BATCH1` · helper **0.1.3** · blob `b7919851a867e7b72c06e9115000c8c0f7cb960f` |
| **RUNTIME CANDIDATE** | `7fb0c202378966a412e454459f2fdf278e14ccee` · build **213** · `GIS-PANEL-DOCK-MGR-G-D-BATCH1` · blob `bbc9a5c88888b9d0a79fcef2374a252aaf9893b7` |
| **NEXT** | Review GPT-sostitutiva sul FULL SHA candidato; **non** deployare; **F NOT OPENED** |
| **ALTRI WORKSTREAM OPEN / READY / PARKED / FROZEN** | WU-0021 **OPEN** (G-A…G-C CLOSED / PASS) · WU-0020 **CLOSED / PASS** · WU-0019 **CLOSED / PASS** · WU-0018–0013 CLOSED · WU-0012 OPEN / NEXT PROVIDER · WU-0010 OPEN · **Oggetti GIS FROZEN A TEMPO INDETERMINATO — NON modificare, NON riaprire, NON includere in nuovi blocchi senza decisione esplicita dell’operatore** |

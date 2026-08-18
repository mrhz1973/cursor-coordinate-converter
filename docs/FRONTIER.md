# FRONTIER — stato vivo

> **Unica fonte canonica LIVE STATE.** Il CORE BOOT legge questo file. **Non** duplicare lo stato operativo in OM §7.1 (pointer soltanto). Non persistire HEAD remota qui.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | [`WU-0010`](work-units/WU-0010-outdoor-routing-graphhopper.md) — Outdoor Routing GraphHopper |
| **BLOCCO ATTIVO** | `OUTDOOR-ROUTING-ORS-PROVIDER-A` |
| **STATO BLOCCO** | **INFRA3 STOP** · secret **PRESENT** · **GIS client HTTPS FAIL** (ACL `tcp:443` non applicabile da Cursor) |
| **GATE CORRENTE** | **BLOCKED — Tailscale ACL control-plane (operatore)** |
| **RUNTIME LIVE** | `5477a5e0d8d9a5681dbfab37b3c39e182306fc79` · build **219** · `OUTDOOR-ROUTING-F-AVOID-AREAS-A-FIX1` · helper **0.1.3** · blob `a823ae9b5bb9bebb8606b4221221314186bc9370` |
| **RUNTIME CANDIDATE** | — (nessun build 220) |
| **NEXT** | operatore: grant ACL additivo `tcp:443` → `100.114.7.53/32` in console Tailscale · poi retry verify + capability 1–10 |
| **ALTRI WORKSTREAM** | WU-0021 **CLOSED / PASS** · WU-0012 **OPEN** / waiting provider · WU-0020 **CLOSED / PASS** · **Oggetti GIS FROZEN** · confronto provider **NOT OPENED** |

# VPS-MAINTENANCE-UPGRADE-REBOOT-A — BLOCKED

**Data:** 2026-08-21  
Evidence canonica: [`docs/infra/evidence/2026-08-21_VPS-MAINTENANCE-UPGRADE-REBOOT-A.md`](../../infra/evidence/2026-08-21_VPS-MAINTENANCE-UPGRADE-REBOOT-A.md)

- `apt-get upgrade -y` 21 pacchetti OK · reboot OK · kernel **6.8.0-138-generic**
- Tailscale **1.102.3** online · GOI 5/5 active · n8n UP
- **BLOCKED:** `nginx.service` failed (`bind 100.114.7.53:443` prima di Tailscale IP). Nessun repair.
- GIS runtime invariato `ac4789e` / **247**. FRONTIER/monolite non toccati.

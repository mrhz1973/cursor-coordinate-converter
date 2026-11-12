# Deploy GIS-only Build294 — PASS

Esecuzione 2026-11-12 13:00:58 Europe/Rome, GPT tramite TMAR Desktop Commander Win su AsusDesktop/SSH VPS.
- Base main precedente c4906eef3ba2099ccab8e161baac6b31c6696958, target main deploy 5382a23ae3b89bad6857a35f83d3a81fd217342b; code source dd4bb2a2180c59b32c2259c7016f771a7bda0b16.
- Monolite blob c6aec7daa7330cd501883585d52d5e021a3dee33, SHA256 2556773e442a2822461067df118713375388e71825efc46195ffd12936887743, 11.121.515 byte; CR192 invariati.
- Preflight PASS: branch main clean, origin/main esatta, hash 293 atteso, delta whitelist HTML + FRONTIER + report candidato. Backup originale Build293 verificato: /var/backups/goi-gis-runtime/20261112T115406Z-build294.
- Pull Git --ff-only PASS, unico restart goi-gis-app.service, active; PID dopo restart 298873. Nessun Nginx, ORS, proxy, endpoint o servizio condiviso modificato.
- File HTTP interno 8000 e HTTPS /gis: status 200, byte e SHA256 esatti. Nessun endpoint rete nuovo; mobile e dati preservati.
- Il deploy tecnico non è la QA operatore. QA browser LIVE nativa separata in [QA-LIVE-294.md](QA-LIVE-294.md).

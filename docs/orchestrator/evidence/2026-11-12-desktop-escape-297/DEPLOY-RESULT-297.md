# Deploy GIS-only Build297 - PASS

Data 12 novembre 2026. Repo canonico source 1adf52d26efaaf62da491e3a445f37ce716a8351. VPS IONOS: branch main e working tree clean, base documentale 6b3bc7e7c6ecc2329c767911de995481459c8239, target sorgente 1adf52d26efaaf62da491e3a445f37ce716a8351.

Preflight SSH: base e origin/main attesa, runtime Build296 SHA 380ee97a3cb82feba3592016011e7510b63df7aab4ec82bc786d842d3484e2ff, servizio GIS active. Backup verificato della Build296: /var/backups/goi-gis-runtime/20261112T210823Z-build297 (file runtime precedente e result.json); fast-forward origin/main, verifica monolite Build297 SHA e9be9dc2c694a930cb607d3bd71a56cdff4f8dd6a78b4d4e86d2ab15800b1a96, 11.129.498 byte; unico restart di goi-gis-app.service, PID 1127560 -> 1200974. Nessuna modifica a Nginx, ORS, proxy, endpoint o servizi condivisi effettuata.

Smoke: primo tentativo immediato curl su 100.99.54.93:8000 ha riportato connection refused per listener non ancora pronto; retry automatico previsto ha ottenuto HTML esatto. File VPS, HTTP tailnet e HTTPS /gis hanno tutti SHA256 Build297 e9be9dc2c694a930cb607d3bd71a56cdff4f8dd6a78b4d4e86d2ab15800b1a96. Ricevuta nel backup VPS result.json con DEPLOY_SMOKE_PASS. Nessun secondo restart necessario.

Esito tecnico DEPLOY_SMOKE_PASS dopo retry di readiness. ABQA nativa in QA-LIVE-297.md; QA operatore PENDING.

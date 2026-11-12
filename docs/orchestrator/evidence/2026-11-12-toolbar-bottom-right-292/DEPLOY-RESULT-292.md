# Deploy GIS-only Build 292 — PASS

**Data:** 2026-11-12 11:34:41 Europe/Rome. Esecutore GPT tramite TMAR Desktop Commander Win su AsusDesktop, SSH VPS.

- Base origin/main predeploy: 6b293b05a24bc929697b0aa4b14f11abb49523d2, runtime LIVE 291 SHA 35d5dc79bc6e48e8d8d0558743411311e7fcfeb66db56218c5d07d908b3c46e5.
- Target main deploy: 21efb7e19f2431f6e65f08b03d58dd2e45d0b962. Source code b8a3a6c18e29ba382df0c6e6b3c1a4ea3f9f22c9; blob fc432b1ca383f6abe168286084b7961e96c6908f; SHA-256 a71206104ac0944edac4da5ffecece4321cddea53c9fb016160f2866e2af8917; 11.120.400 byte.
- Preflight: main clean, remote HEAD corrispondente, whitelist delta HTML+FRONTIER+3 dossier, blob esatto. Backup Build 291 verificato: /var/backups/goi-gis-runtime/20261112T102821Z-build292.
- Pull Git fast-forward PASS, un solo restart del servizio goi-gis-app.service, active, PID dopo restart 157384.
- Smoke: GET HTTP 8000 coordinate_converter Claude.html e HTTPS /gis: status 200, byte e SHA corrispondenti. Nessuna modifica Nginx, proxy, ORS, servizi diversi, GPS e dati utente.
- Il deploy non attesta QA operatore. [QA LIVE](QA-LIVE-292.md).

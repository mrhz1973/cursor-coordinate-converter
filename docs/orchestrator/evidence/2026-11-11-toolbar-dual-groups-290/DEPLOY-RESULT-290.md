# Deploy GIS-only Build 290 — PASS

Data 11 novembre 2026, 15:30:22 Europe/Rome (backup UTC 20261111T143022Z). GPT tramite TMAR Desktop Commander Win AsusDesktop e SSH VPS.

- Main prima del pull: 1b1e6b09d956e3171c245148af4f694e786d1318, runtime Build289 SHA19be22d478262c6ad7f1dbb9ef4c7a0706a8d58bf2a39236fb02750129e45107.
- Target main al deploy: 7af5b601a0e010463bb836a4eaa637d2c4879280; source codice 56d336a3942028836924f68af322d36996095b15; HTML blob f8c469e39e2c647b2bde377e5ac1b6b7e90683cc, SHA256 7d69fc145779f223c570e9596e23b497ab678329d4b495ebc03567301f010e69, bytes 11.120.343.
- Preflight whitelist dei cinque file (monolite, FRONTIER, REPORT, QA candidato, review) PASS, branch main clean, FF verificato.
- Backup Build289 verificato: /var/backups/goi-gis-runtime/20261111T143022Z-build290.
- Pull Git fast-forward e unico restart servizio goi-gis-app.service, active, PID nuovo 2413726.
- Smoke HTTP http://100.99.54.93:8000/coordinate_converter%20Claude.html e HTTPS https://ionos-n8n-new.tailc01234.ts.net/gis: HTTP200, 11.120.343 byte, SHA256 corretta.
- Nessun restart di Nginx, proxy, ORS, gateway o altri servizi condivisi.

ABQA HTTPS nativa separata: [QA LIVE](QA-LIVE-290.md). Nessun PASS operatore attribuito.

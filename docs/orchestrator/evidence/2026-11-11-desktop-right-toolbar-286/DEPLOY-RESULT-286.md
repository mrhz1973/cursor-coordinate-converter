# Deploy GIS-only — Build 286

11 novembre 2026, 09:48:31 Europe/Rome. Esito PASS.

- Base VPS prima del pull: 2b64dd0e5e8c8a781acbe8f0268da9589dc139d4 (Build 285).
- Target main deploy: 4c701e797023d9abfd45047cf7b5c1812bb3cdab. Source runtime: 6fc34c2a614728b6acc8a9eeae6270a06427d0fe.
- HTML blob: abed2cd19ca6b3ec7a728345c2c1525d7f4e7be0. SHA-256: af28f2585016c495362a5046ee9d0c4a3a75f0d27cdbf1c750807e1511b4e63c. Byte: 11.115.294.
- Backup verificato: /var/backups/goi-gis-runtime/20261111T084831Z-build286, identico alla Build 285.
- Preflight: main clean, SHA della 285, remote HEAD, whitelist 5 file, blob 286, pull fast-forward PASS.
- Unico servizio riavviato: goi-gis-app.service, active; PID dopo il restart 1852253.
- Smoke HTTP 8000 e HTTPS /gis su VPS: 200, 11.115.294 byte, SHA256 esatta; verificato HTTPS anche da AsusDesktop.
- Nessuna modifica Nginx, proxy, ORS o infrastruttura condivisa.

Deploy tecnico distinto da ABQA e PASS operatore.

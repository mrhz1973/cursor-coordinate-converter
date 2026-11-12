# Deploy GIS-only Build 291

Data rilascio 2026-11-12 10:10:09 Europe/Rome. Preflight/backup/pull FF/restart/smoke **PASS**.

- Clone VPS main iniziale: 9345cec6a9ffe2948f992a3a46cc4a5e065e39a8 (candidato docs). Source runtime: a32bf2b5eede5ffcfbc0307eda8b4a0171edb6e9; blob Git 76211816541dbf54651171f7febe4f5150ff4ae3; SHA256 35d5dc79bc6e48e8d8d0558743411311e7fcfeb66db56218c5d07d908b3c46e5; 11.120.857 byte, 192 CR invariati.
- Backup verificato Build 290: /var/backups/goi-gis-runtime/20261112T091009Z-build291; hash corrispondente a 7d69fc145779f223c570e9596e23b497ab678329d4b495ebc03567301f010e69.
- Preflight: branch main clean, remote GitHub HEAD identica a target, delta limitato a HTML + FRONTIER + dossier, blob atteso confermato. Pull git --ff-only PASS.
- Unico servizio riavviato: goi-gis-app.service, active; PID dopo restart 30305. Nginx, proxy, gateway ORS e servizi condivisi invariati.
- File distribuito SHA256 35d5dc79bc6e48e8d8d0558743411311e7fcfeb66db56218c5d07d908b3c46e5; HTTP interno 8000 e HTTPS /gis status 200, 11.120.857 byte, SHA uguale. Nessuna modifica su mobile.
- La distribuzione non attesta QA operatore né controllo visuale dell'utente. ABQA nativa separata: [QA-LIVE-291.md](QA-LIVE-291.md).

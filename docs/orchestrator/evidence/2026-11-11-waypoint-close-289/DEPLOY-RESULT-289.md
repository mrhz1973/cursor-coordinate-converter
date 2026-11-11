# Deploy GIS-only Build 289

Esito PASS, 11 novembre 2026 15:00:24 Europe/Rome. Base main 288 ad827812c1d52a3875339bd0c4107470dc0a1c48; target main 8f6a283ce9c87b8e0be57722fd561d42bdba872c. Source monolite 214e6ea248f4d390bfd1c79b12b95123f93642f0, blob 6a4a2639e6b2a205ee26ab38778e5b85b3ad6d0b, SHA256 19be22d478262c6ad7f1dbb9ef4c7a0706a8d58bf2a39236fb02750129e45107, 11.116.484 bytes.

Preflight main clean, origin/main atteso, whitelist cinque file, SHA precedente 288 e blob 289 PASS. Backup verificato /var/backups/goi-gis-runtime/20261111T140024Z-build289. Git pull fast-forward, unico restart goi-gis-app.service active (PID 2363512). Smoke HTTP 100.99.54.93:8000 e HTTPS /gis: HTTP 200, 11.116.484 byte, SHA corretta. Nginx/proxy/ORS e servizi condivisi non modificati. Nessuna QA operatore attribuita.

[ABQA](QA-LIVE-289.md).

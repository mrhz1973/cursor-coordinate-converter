# Deploy GIS-only Build295 — PASS

**Registrato:** 2026-11-12 20:22:51 Europe/Rome. Esecutore GPT via TMAR Desktop Commander Win / AsusDesktop e SSH VPS.

- Base main Build294 1ad71c8576d30893475c72f3f3cb1d6515ab6af6; source runtime Build295 b213b80fb8c006508e40d6d50e79a0036f3a8cfe, blob Git 57eb5cedf84982806bdd726c438d4d35acf473eb, SHA256 8bc8ce1bde2e448ba3b6f60f042d371520707c21b5f6cea581eacb8135724840, 11.127.935 byte (192 CR isolati preservati).
- Preflight: branch main pulito, origin/main target corretto, whitelist delta un solo HTML e FRONTIER + 3 evidenze, blob e hash base294 confermati.
- Backup originale Build294 verificato in /var/backups/goi-gis-runtime/20261112T191026Z-build295, monolite precedente recuperabile. Git pull --ff-only a main target PASS, working tree clean.
- Unico riavvio del servizio goi-gis-app.service, active PID dopo restart 1008612. Altri servizi, Nginx, gateway ORS, proxy HTTPS, rete/GPS/storage immutati.
- Smoke HTTP interno 8000 e HTTPS /gis: status200, 11.127.935 byte e SHA256 8bc8ce1bde2e448ba3b6f60f042d371520707c21b5f6cea581eacb8135724840 identici. Verifica HTTPS via curl Windows dello stesso hash PASS.
- Deploy e smoke NON equivalgono a QA operatore. [QA LIVE](QA-LIVE-295.md).

# Build301 - Deploy GIS-only PASS

Data 14 novembre 2026. Parent main source a170dac175b49f5785ef18b28a25d3b83a46b9e0, target source 6bd373f37b2b078cc9868bc6b32012b3ab769821, Git blob 7207ec7893b23bea34d72e512e7513cfd0c80bf1. Runtime SHA256 481ec4124e49526e331fcf90d2b2f970562e987172d0aef50d97ef7aa8e17c0f, 11159053 bytes e CR192.

Preflight VPS verificato: origin/main al target, repo main pulito, SHA HTML precedente a65d6f96a8fbf26050d1a7a782671060c4cc6e723f29f7fd2e8089b5a6b796d7, goi-gis-app.service active. Backup integrale Build300 verificato in /var/backups/goi-gis-runtime/20261114T144206Z-build301/coordinate_converter Claude.html; result.json stesso path. Git pull fast-forward e unico restart GIS PID 233261 -> 1043544. SHA file su VPS, HTTP interno e HTTPS pubblico identici al runtime301. Prima prova HTTP subito dopo restart connection refused mentre il listener era in startup; bounded retry PASS. Nessun secondo restart, nessun cambio a GraphHopper/ORS/nginx/Tailscale, proxy o servizi condivisi. QA HTTPS nativa in QA-LIVE-301.md.

Gate QA operatore su sentiero reale PENDING; accuratezza topografica ground truth non certificata.

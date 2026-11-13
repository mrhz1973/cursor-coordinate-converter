# Deploy GIS-only Build299 - PASS

Data 13 novembre 2026. Source GitHub main 4a9a61f6886f3cedbef83dcf7768db138351f96d, base VPS docs HEAD 676cb2adaf7f6f10d7cd78ff7086b6dc57e02a9c, working tree clean.

- Preflight: origin/main target atteso, monolite Build298 SHA256 deffea948b029fdc030bdf0ccf724e7ce6016ec539c746c1eb74e111ff353fca, servizio goi-gis-app.service active.
- Backup originale Build298 verificato: /var/backups/goi-gis-runtime/20261113T174217Z-build299/coordinate_converter Claude.html; ricevuta result.json stesso percorso.
- git pull fast-forward a source Build299, hash monolite 0b4535fa8acb34cd49176f798774acd812be02a70b6638820e275889f54a802b, 11.135.062 byte / 192 CR.
- Unico restart di goi-gis-app.service, PID 1299971 -> 3203672.
- Smoke HTTP interno e HTTPS pubblico /gis hash identici al monolite Build299; il primo tentativo curl immediato ha ricevuto connection refused per listener non ancora pronto, retry previsto ha completato PASS; nessun secondo restart.
- Nessuna modifica a Nginx, gateway ORS, proxy HTTPS, listener, provider, OPSEC, servizi condivisi o GPS. Nessuna migrazione dati utenti eseguita.

Deploy smoke tecnico PASS; vedi QA-LIVE-299.md per verifica nativa Edge. QA operatore real-route ancora PENDING.

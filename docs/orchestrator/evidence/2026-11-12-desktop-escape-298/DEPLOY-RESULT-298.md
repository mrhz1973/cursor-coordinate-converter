# Deploy GIS-only Build298 - PASS

Data 12 novembre 2026. GitHub main source 651c872b914025d6f0e84b19e51313b92599342b, base VPS docs 7b304e5c9aeb70befe21e4fcb1797e124361b107; working tree clean, runtime base Build297 SHA e9be9dc2c694a930cb607d3bd71a56cdff4f8dd6a78b4d4e86d2ab15800b1a96.

Backup originale Build297: /var/backups/goi-gis-runtime/20261112T220719Z-build298/coordinate_converter Claude.html, SHA precedente verificato. Fast-forward GitHub main a source 651c872, runtime SHA Build298 deffea948b029fdc030bdf0ccf724e7ce6016ec539c746c1eb74e111ff353fca, 11.129.915 byte. Unico riavvio goi-gis-app.service, PID 1200974 -> 1299971. File su disco, HTTP interno http://100.99.54.93:8000/coordinate_converter%20Claude.html e HTTPS https://ionos-n8n-new.tailc01234.ts.net/gis restituiscono tutti SHA Build298. Il primo curl sul listener non ancora pronto ha dato connection refused; successivo retry ha completato smoke PASS, senza ripetere il restart. Ricevuta /var/backups/goi-gis-runtime/20261112T220719Z-build298/result.json con DEPLOY_SMOKE_PASS.

Nessuna modifica operata su Nginx, ORS, proxy, provider o servizi condivisi. QA HTTPS LIVE separata in QA-LIVE-298.md. QA operatore pending.

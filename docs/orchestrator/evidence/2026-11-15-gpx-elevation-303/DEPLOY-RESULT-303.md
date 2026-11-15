# Build303 deploy GIS-only ? PASS

Data 15 novembre 2026. Parent VPS main 1e96f286166ed44486aa37d2deeee790a12ff9a7; source GitHub main 2f02a24c0320ee44f9814f7378a8392f901d7c75. Preflight repo main pulito, source remoto atteso, SHA HTML precedente 35c1af1dcb30c44fa7f136a19f7d3df4618ffbbdf5a64c1722c222f3271c253f e servizio goi-gis-app active.

Backup originale Build302 verificato: /var/backups/goi-gis-runtime/20261115T141311Z-build303/coordinate_converter Claude.html; ricevuta result.json nello stesso percorso. Git pull fast-forward al source Build303 e checksum runtime 0b117c13a96da9f8c421fba3772c19a297bd002ec60409d19703b329ac83b9f7, 11,165,656 byte, CR192. Un restart unico del GIS PID 1427028->3325976. File VPS, HTTP interno 100.99.54.93:8000 e HTTPS pubblico /gis SHA identici al source. Primo curl immediato ricevuto connection refused mentre listener in readiness; bounded retry PASS. Nessun secondo restart; nessuna modifica ad altri servizi, proxy, provider o infrastruttura.

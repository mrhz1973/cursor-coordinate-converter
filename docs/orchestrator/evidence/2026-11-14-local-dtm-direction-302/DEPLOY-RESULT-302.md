# Deploy Build302 GIS-only PASS

Data 2026-11-14. Parent GitHub main ee2ecd4c466840a32fc4d4384d882d0ae430e66b, source target 182b83a32dc9a32fa2a748458a9ad6f7b5b066a5. Preflight: branch main, repo clean, origin/main source atteso, checksum old Build301 481ec4124e49526e331fcf90d2b2f970562e987172d0aef50d97ef7aa8e17c0f, goi-gis-app active. Backup verificato Build301 /var/backups/goi-gis-runtime/20261114T183851Z-build302/coordinate_converter Claude.html e receipt result.json.

Fast-forward main al source Build302. SHA256 runtime 35c1af1dcb30c44fa7f136a19f7d3df4618ffbbdf5a64c1722c222f3271c253f; file HTML 11,160,380 byte e CR192. Unico restart goi-gis-app PID 1043544 -> 1427028. SHA file disco, HTTP interno e HTTPS pubblico identici; primo HTTP prima della readiness connection refused, bounded retry PASS. Nessun secondo restart e nessun cambiamento ai provider GH/ORS, infrastruttura o cache.

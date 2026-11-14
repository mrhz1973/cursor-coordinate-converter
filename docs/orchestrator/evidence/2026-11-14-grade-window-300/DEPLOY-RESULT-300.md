# Build300 GIS-only deploy - PASS

Date 2026-11-14. GitHub origin/main source target b6353ba11fa9bbf8cdb48243aefbec2e8aa59323 from docs base 8245f3f5d27fb119f457927adc5e902fa962224d. Clean VPS working tree and expected old Build299 SHA preflight. Backup of exact Build299 HTML before merge verified: /var/backups/goi-gis-runtime/20261114T000629Z-build300/coordinate_converter Claude.html, prior SHA 0b4535fa8acb34cd49176f798774acd812be02a70b6638820e275889f54a802b. Result receipt in backup folder result.json.

Git fast-forward only main source, expected HTML SHA256 a65d6f96a8fbf26050d1a7a782671060c4cc6e723f29f7fd2e8089b5a6b796d7, 11,140,089 bytes, 192 CR. One restart goi-gis-app.service, PID 3203672 -> 3822418. Internal file SHA, HTTP on 100.99.54.93:8000, HTTPS on ionos-n8n-new.tailc01234.ts.net/gis all identical. First HTTP requested too soon returned connection refused; bounded readiness retry PASS. No extra restart, no changes to nginx/GraphHopper/ORS/proxy/shared services or providers. HTTPS native Edge QA separately in QA-LIVE-300.md.

Runtime QA operator remains PENDING, DEM external ground-truth accuracy HOLD.

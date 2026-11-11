# Rilascio GIS-only Build 288

Data: 2026-11-11 12:40:16 Europe/Rome (backup UTC 20261111T114016Z). ESITO: PASS. GPT via TMAR Desktop Commander Win AsusDesktop e SSH VPS.

- Preflight: main clean, vecchia HEAD 184a42bc6a3231baf48714c1d2d5a050fbe1ffa8, file 287 SHA fdb28dd544a4f138b4e249b6fbc1d2257029e9fecff0fa5fd93fddf27fc559db, origin/main esatto c7521a0eb2f9b510a7971b8d205f2088824710ac, whitelist cinque file, blob 67fb15263fc5a6d2461552f33fd3d6165f66c466 verificato.
- Backup Build 287: /var/backups/goi-gis-runtime/20261111T114016Z-build288, SHA vecchia verificata.
- Pull Git fast-forward main al commit c7521a0eb2f9b510a7971b8d205f2088824710ac, file HTML nuovo 11.116.411 byte SHA256 ce97e3b72e2e17e383417c777509889cd74cebe144f6751f4fda89829f28209b; source code d4e9821e180f82a33bb506c48b5c1d683a8cb82a, blob 67fb15263fc5a6d2461552f33fd3d6165f66c466.
- Unico restart goi-gis-app.service, active; PID dopo restart 2133278. Non toccati Nginx, proxy HTTPS, ORS, altri servizi condivisi.
- HTTP interno VPS http://100.99.54.93:8000/coordinate_converter%20Claude.html e HTTPS https://ionos-n8n-new.tailc01234.ts.net/gis: GET integrali, SHA/byte corrispondenti. Workspace pulito.
- Automated Browser QA LIVE PASS separata. Nessun PASS operatore attribuito.

[QA LIVE](QA-LIVE-288.md).

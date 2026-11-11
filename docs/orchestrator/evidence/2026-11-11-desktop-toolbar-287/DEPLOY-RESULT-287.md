# Deploy GIS-only Build 287 — esito verificato

Registrato 2026-11-11 11:44:57 Europe/Rome. Esecuzione: GPT via TMAR Desktop Commander Win da AsusDesktop, SSH VPS.

- Source codice: d69a21a1cb3f09828a51b342c91bec50f2e88380. Target main deploy: 43b4ad610b56e57e49febe0ec9392e150dee0c26, rispetto al vecchio main 0b8977229e6e42d3853dc3943b1981dc5d4f81e0 (Build 286).
- HTML: blob 71e2931bbff30ea81b5fbbc17d071953618af3d1, SHA-256 fdb28dd544a4f138b4e249b6fbc1d2257029e9fecff0fa5fd93fddf27fc559db, 11.115.745 byte.
- Preflight: main pulito, baseline 286 esatta, remoto ls-remote coerente, delta autorizzato solo monolite, FRONTIER e 3 evidenze. Primo tentativo preflight FAIL prima di backup/pull/restart per due nomi di file errati nello script; launcher corretto e preflight ripetuto PASS.
- Backup verificato: /var/backups/goi-gis-runtime/20261111T103743Z-build287, runtime 286 precedente conservato.
- Una sola esecuzione riuscita git pull --ff-only e unico riavvio goi-gis-app.service. Dopo restart PID GIS 2030359, active.
- GET file HTTP 8000 e HTTPS /gis: status 200, byte/hash attesi; HTTPS completo verificato anche dall'AsusDesktop.
- Nginx, proxy, ORS, endpoint condivisi, configurazioni, GPS e altri servizi non modificati.

Questo rapporto attesta il deploy e smoke, non il PASS operatore. [ABQA nativa](QA-LIVE-287.md).

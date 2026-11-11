# Deploy Build 283 — esito tecnico

**Deploy:** 11 novembre 2026, 03:09:05 Europe/Rome. **Esito file/servizio:** PASS. **Esecuzione:** GPT tramite TMAR Desktop Commander Win sull'AsusDesktop, SSH VPS; nessun Cursor/Codex.

| Identità | Valore |
| --- | --- |
| Source runtime commit | `5795b6711c5690216a2f1862003af29758520101` |
| Base VPS prima del pull | `9f2fe361b249d3b42cddfd5417cc66775d478ebe` |
| HEAD VPS dopo pull | `8a44e608c68ba1ebd4b4b6ffbdfbbb20505f55d6` |
| Build / bytes | 283 / 11.108.965 |
| Blob | `c5d8ee1edaeba2513f897d838b7caa24aa4b4eaa` |
| SHA-256 | `dbdc54753722bee425d9c4e6528455ef7b72d946b69e747ae109621de414ea24` |
| Backup privato 282 | `/var/backups/goi-gis-runtime/20261111T020904Z-build283` |
| Servizio riavviato | solo `goi-gis-app.service` · active |
| SSH | root su VPS con alias `ionos-n8n-new`, exit 0 |

Preflight verificati: branch main/clean, HEAD esatta, baseline 282 SHA, origin/main esatto, fetch e fast-forward, whitelist dei cinque file modificati (monolite, FRONTIER e tre evidenze), blob 283 e backup 282. Una sola applicazione git pull --ff-only e un solo restart GIS.

Postdeploy: file 283 byte/SHA, Git working tree clean; HTTP `http://100.99.54.93:8000/coordinate_converter%20Claude.html` da VPS: hash corretto. HTTPS `https://ionos-n8n-new.tailc01234.ts.net/gis` dal VPS: hash corretto. ASUS: un trasferimento HTTPS iniziale troncato con curl 18 e un HttpClient incompleto; successivo trasferimento HTTPS intero HTTP 200, 11.108.965 byte e SHA corretto. Nessuna azione su Nginx, ORS, proxy, TLS, DNS, listener o servizi condivisi; non si dichiara verificato il PID degli altri servizi.

[ABQA reale](QA-LIVE-283.md). QA operatore ancora pendente.

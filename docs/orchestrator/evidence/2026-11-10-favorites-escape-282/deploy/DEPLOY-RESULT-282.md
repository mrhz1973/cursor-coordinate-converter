# Build 282 — esito tecnico del deploy

**DEPLOY_PASS — 10 novembre 2026, 13:06:57 Europe/Rome** (2026-11-10T12:06:57.487178+00:00).
Preflight PASS alle 13:06:18 Europe/Rome (2026-11-10T12:06:18.594943+00:00). Una sola esecuzione per fase; entrambe concluse con SSH exit 0, senza timeout o rollback.

## Identità e stato osservati

- Source runtime: `6b906869b77a2b3c91c8848012894ffff85399e3`.
- HEAD VPS finale: `2b929e3433b2fbd9d0e0644a90b00e5c25aaccd7`; branch `main`, working tree `clean`.
- Blob runtime: `4636ad186934b0d2f43e8564c9e657cdcdfc652e`.
- Build 282; 11108980 byte; SHA-256 `71267f1a9d95488adf527db40333c811c2beeef0c9051e98ee5673debb5a7399`.
- Backup privato verificato e journal creati prima del fetch: `/var/backups/goi-gis-runtime/20261110T120613696515Z-build282`.

File su disco, HTTP 8000 e HTTPS /gis hanno superato il confronto di build, dimensione e SHA-256. Entrambe le risposte HTTP sono 200; HTTPS usa il normale controllo TLS e hostname.

## Servizi e controlli

- Unico restart: `goi-gis-app.service`; PID 2103860 → 4019379, active/running.
- Nginx (PID 2657254), gateway ORS (1780876) e proxy HTTPS GIS (1780843) invariati nel pass.
- Sei hash di configurazione, listener condivisi ed endpoint/CORS preservati.
- Nessun POST ai provider. Journal finale: 48 eventi.
- Applicazione con fast-forward al commit del GO; nessun reset/clean o checkout forzato.

Endpoint verificati:

- http://100.99.54.93:8000/coordinate_converter%20Claude.html
- https://ionos-n8n-new.tailc01234.ts.net/gis

## File da archiviare

Base esatta sul PC del lavoro: `C:\Users\Utente\Documents\TMAR-GIS\work\gpt-20261110\runtime282-deploy-preparation\frozen-2b929e3433b2`. Copiare questo rapporto e i seguenti file, mantenendo i sottopercorsi:

- `frozen-manifest.json`
- `runtime282-remote.py`
- `runtime282-launch-windows.py`
- `execution-20261110T120613696515Z-preflight\intent.json`
- `execution-20261110T120613696515Z-preflight\process.json`
- `execution-20261110T120613696515Z-preflight\remote-result.json`
- `execution-20261110T120653873776Z-apply\intent.json`
- `execution-20261110T120653873776Z-apply\process.json`
- `execution-20261110T120653873776Z-apply\remote-result.json`

Script effettivi: remote SHA-256 `e633af45cd26fd65e0dc81dd41b81cbb462f58d40d6c5ee3f7c703a55c0be44d`; launcher SHA-256 `7f109fc2f6121951ea68f92d38617fb0084186a4592ec533853d7b166be3c2ee`.

Escludere la copia locale runtime-282.html, il backup privato e qualsiasi chiave. La voce runtime nel frozen-manifest attesta la copia locale usata dal launcher; il runtime canonico resta il blob Git del source commit sopra indicato.

## Limiti e rilascio ownership

Questo rapporto attesta esclusivamente il deploy tecnico. La QA browser postdeploy è separata e affidata al coordinatore. Nessun ulteriore comando VPS dopo il PASS. Processi delle due fasi conclusi (11212 e 3032); nessun PID pendente. File pronti al publisher; ownership del pacchetto rilasciata.

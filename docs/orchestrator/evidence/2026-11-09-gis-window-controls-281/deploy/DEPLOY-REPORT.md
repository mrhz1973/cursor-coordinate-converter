# Build 281 — deploy runtime completato

## Esito corrente

**DEPLOY_PASS il 9 novembre 2026 alle 16:17:38.520901 UTC, 17:17:38 Europe/Rome.** Il clone VPS canonico è sul branch `main`, pulito, alla HEAD autorizzata `cee1c9a1e71a38fc36ba33ab717870730d70036b`.

Il file presente sul disco e le risposte HTTP e HTTPS corrispondono alla Build 281 approvata. È stato riavviato soltanto `goi-gis-app.service`. Non è stato necessario alcun rollback.

| Identità verificata | Valore |
|---|---|
| Commit sorgente runtime | `0c0f6785654dbba279774bb8569788088f0762e9` |
| HEAD distribuita, inclusivo checkpoint documentale | `cee1c9a1e71a38fc36ba33ab717870730d70036b` |
| Blob runtime | `3dcff61081a2f461f8841953986ced17b058eab1` |
| SHA-256 runtime | `e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62` |
| Dimensione | 11.108.861 byte |
| Build | 281 |
| Clone | `/root/local-files/handoff-runtime/cursor-coordinate-converter` |
| Backup privato | `/var/backups/goi-gis-runtime/20261109T161709498200Z-build281` |

## Autorizzazione e codice eseguito

Il GO tecnico del coordinatore autorizzava il preflight e, soltanto dopo PASS, il deploy del runtime sulla HEAD esplicita indicata sopra. Il coordinatore aveva già acquisito autorizzazione dell'operatore, QA candidata, review del runtime, review del deploy e verifica della pubblicazione. Questi gate sono antecedenti comunicati dal coordinatore; questo rapporto attesta autonomamente trasferimento, preflight ed esecuzione.

Sono stati utilizzati senza modifiche i due script congelati:

- `runtime281-remote.py`: SHA-256 `a6f7215d7761bd7f725236605f4ede024d6b1807d85b80fbe379bc2a3920fbea`;
- `runtime281-launch-windows.py`: SHA-256 `502c10cfa0da602483532fd7a9a64479bc2bcf7bb76b1dfeafe35af5f4686dc9`.

La connessione è partita da ASUSDESKTOP con il client e l'identità SSH esistenti, destinazione fissata a `root@31.70.139.73:22`, `BatchMode=yes` e controllo stretto della host key. Il vecchio alias non è stato usato. Nessuna chiave o credenziale è stata esportata.

## Evidenza del preflight

Il trasferimento dei cinque file preparati e del manifest è stato verificato su Windows alle **16:16:58 UTC**, con corrispondenza di dimensioni e SHA-256. È stata verificata anche l'identità del candidato Windows.

Il preflight è terminato alle **16:17:13.979207 UTC**, processo Desktop Commander `41864`, SSH exit code `0`:

- clone pulito su `main`, HEAD iniziale `c33f58c956e9630b03f9ff86eb35eccd35879a4a`;
- runtime iniziale Build 280, 11.108.654 byte, SHA-256 `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde`;
- `ls-remote`, fetch e tracking concordi con la HEAD del GO;
- commit sorgente antenato della HEAD approvata, delta successivo limitato a documentazione e blob runtime identico;
- delta dal clone limitato al singolo runtime e a `docs/`;
- hash delle sei configurazioni infrastrutturali conformi alla baseline;
- servizi attivi, listener condivisi ed endpoint disponibili;
- runtime precedente identico su disco, HTTP e HTTPS, con TLS verificato;
- backup privato 0700, file runtime precedente 0600, byte verificati e registro persistente.

## Applicazione e risultato

L'applicazione ha ripetuto le guardie sullo stato fresco e ha eseguito il fast-forward alla HEAD del GO. Il nuovo runtime è stato verificato su disco prima del restart del solo GIS.

Il processo Desktop Commander `11824` è concluso con SSH exit code `0`; non vi sono stati timeout. Il registro contiene 29 eventi, incluso `deploy_completed`.

| Prova dopo il restart | HTTP 8000 | HTTPS `/gis` |
|---|---|---|
| Status | 200 | 200 |
| Build | 281 | 281 |
| Byte | 11.108.861 | 11.108.861 |
| SHA-256 | `e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62` | `e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62` |
| TLS | Non applicabile | Verificato, trust e hostname normali |

Gli URL controllati sono:

```text
http://100.99.54.93:8000/coordinate_converter%20Claude.html
https://ionos-n8n-new.tailc01234.ts.net/gis
```

| Servizio | PID prima | PID dopo | Esito |
|---|---:|---:|---|
| GIS | 1838127 | 2103860 | Unico restart, active/running |
| Nginx | 209145 | 209145 | Invariato, active/running |
| Gateway ORS | 1780876 | 1780876 | Invariato, active/running |
| Proxy HTTPS GIS | 1780843 | 1780843 | Invariato, active/running |

Indirizzi e PID dei listener condivisi sulle porte 443, 8020, 18080, 8989, 8089 e 8099 sono identici alla baseline. I sei hash di configurazione sono identici. Gli endpoint ORS con vecchio e nuovo Origin, catalogo e VPS mantengono status, dimensione, hash, content type e CORS.

Non sono state apportate modifiche a Nginx, ORS, proxy HTTPS, routing dei provider, Tailscale, DNS, certificati, firewall, account o servizi condivisi. Nessun POST ai provider è stato eseguito. Dopo il PASS non è stato eseguito alcun ulteriore comando VPS.

## Prove salvate e verifica di trasferimento

Le directory `execution-20261109T161709498200Z-preflight` ed `execution-20261109T161735530296Z-apply` contengono i tre file originali Windows di ciascuna fase: `intent.json`, `process.json` e `remote-result.json`. I sei file sono stati trasferiti mantenendo i byte originali, con verifica delle dimensioni e degli SHA-256.

`execution-transfer-manifest.json` registra questi hash e la verifica locale di coerenza: risultato decodificato dallo stdout uguale al risultato salvato, exit code 0 in entrambe le fasi, assenza di timeout, corrispondenza runtime e preservazione degli invarianti. `deployment-summary.json` raccoglie le prove principali senza il lungo elenco dei percorsi documentali.

Il manifest originario e il piano preparatorio restano immutati come evidenza della preparazione. Il manifest delle nuove prove è `execution-artifact-manifest.json`.

## Nota di metodo e gate successivo

La presentazione in chat dell'output completo dell'applicatore ha superato il limite di output ed è stata troncata. La risposta completa era già stata memorizzata prima della presentazione; è stata analizzata con una proiezione limitata ai campi necessari. Sono poi stati acquisiti i file originali delle due esecuzioni. Non vi è stato un errore di trasporto e non è stata ripetuta l'applicazione. Il finding e la correzione sono registrati in `execution-observation.json`.

Il coordinatore ha ricevuto immediatamente il PASS e può aprire il gate ABQA live. **La QA browser postdeploy è un gate distinto e non viene dichiarata conclusa da questo rapporto.**

Fonte delle osservazioni correnti: risultati originali dei processi del 9 novembre 2026 e verifiche locali dei file trasferiti. Ultima prova tecnica VPS di questo pass: **9 novembre 2026, 16:17:38.520901 UTC**.

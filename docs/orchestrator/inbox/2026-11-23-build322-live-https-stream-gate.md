# Build322 T1 — Live tecnicamente distribuita, QA browser HTTPS bloccata

- Source `e707870b7f0b550f2e4ccf61af498e7dd480b8f6`, blob `5b3ddb2700736c6f5d7bed0574179c74929424bc`, runtime SHA `c2c31a2e5bc4b9e702c33283e1d2d0185c5543db86263d3591376ce21d28e31c`, 11.351.420 byte.
- Backup Build321 verificato `/var/backups/goi-gis-runtime/prebuild322-zBb7KfJS`; VPS HEAD `cc398bf20953031645bb4960f660953fa564ee4b`, servizio goi-gis-app active, checkout clean, HTTP/HTTPS200 con file completo e hash esatto. Nessun altro servizio modificato.
- Prima del deploy: statici17/17, candidato browser78/78, review GPT-SOSTITUTIVA18/18 PASS; esterna post-hoc PENDING.
- LIVE Edge158: R1 desktop1440/phone320 completati; tablet768 e phone390 STOP. R2 residuo entrambi STOP; R3 tablet stream `net::ERR_INCOMPLETE_CHUNKED_ENCODING`, 11.340.412 byte osservati invece dei 11.351.420 attesi (11.008 mancanti).
- Download binario nativo Windows via HTTPS: 200 e 11.351.420 byte/sha corretti, circa 10,3 s; non prova la QA prodotto nel browser.
- Diagnostico tunnel CONNECT singolo fallito con `ERR_TUNNEL_CONNECTION_FAILED`; NON prova nuova causa; nessun bypass TLS/OPSEC.
- Stato `DEPLOY_TECHNICAL_PASS / ABQA_LIVE_BLOCKED / QA_OPERATORE_PENDING`; nessun PASS umano richiesto, niente FINITO.
- NEXT: qualificare flusso HTTPS del browser QA e casi residui, senza allentare i controlli; P0 autorizzato ma non applicato, DTM HOLD, P4 FUTURO.

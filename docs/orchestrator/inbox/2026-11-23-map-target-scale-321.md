# Build321 — Rilascio scala nominale 1:N e gate QA umana

- 23/11/2026, fonte canonica source commit `64522d52d102cdd0bcd89f4b671b65dc0ba8e9b2`, runtime SHA `96c2c34eec74f43a1dbc636620d6e54989529d53213e58f31edd2d56203dd971`.
- Nuovo pannello GIS `1:N`, nominale convenzionale, zoom più vicino, scala richiesta/ottenuta/scarto, i18n IT/EN/FR.
- QA candidato: statici77/77 e browser45/45; LIVE HTTPS: driver STOP prima (tempo di reload troppo breve) conservati, R2 con `readyState`/stato effettivo 45/45 PASS su Edge158 desktop1440/phone390/phone320 emulati.
- Backup Build320 `/var/backups/goi-gis-runtime/prebuild321-4jkjgYPN`; service GIS-only riavviato; HTTP/HTTPS byte/hash PASS dopo primo errore di connessione immediata.
- Nessun nuovo campo persistito, endpoint, GPS silenzioso, modifica ai dati dell’operatore o layer switch automatico.
- Stato: DEPLOY_TECHNICAL_PASS / AUTOMATED_BROWSER_QA_PASS / QA_OPERATORE_PENDING. Build321 **non** CLOSED; ultimo CLOSED Build320.
- NEXT: QA umana breve da ChatGPT per scala effettiva/leggibilità/operatività; su attestazione esatta Regola H.
- P0 recupero archivi autorizzato ma non eseguito. DTM5/10m HOLD; MAP-FRACTIONAL-ZOOM-A e P4 futuri.

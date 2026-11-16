# Build307 - rilascio GIS e QA HTTPS nativa

Data 2026-11-16 01:11 CET. **STATO**: Build307 LIVE e deploy GIS-only PASS, review tecnica GPT-SOSTITUTIVA PASS, test HTTP e HTTPS PASS; **QA operatore PENDING**. Reviewer AI esterno NOT_PERFORMED, backstop post-hoc ancora aperto.

## Identita ed evidenza

- HEAD commit sorgente runtime su origin/main: `3ebd1ba5cb4c2584e0a19f7b4fc859b2684a4e9e`; candidato revisionato raw@FULL_SHA `1aaa72ec6c3db7bb944c1b58108e456fb4eee611`; blob Git coincidente `b59bbd89b45ef3c31e8a28395f8d2070ee6c5dfb`.
- HTML SHA-256 `d5274ebdb9358a1fd3675c7688af4a562997f3580f7146ca7c3c4b8b70c16e22`, 11.180.622 byte, CR=192 e CRLF=0, build NUM=307, APP_BUILD_ID `GIS-TRACK-IO-CURRENT-ARCHIVE-A`.
- Backup precedente Build306: `/var/backups/goi-gis-runtime/20261116T000729Z-prebuild307`, predeploy hash verificato.
- Solo servizio GIS riavviato una volta, PID 7891 -> 124169; altri servizi non toccati. Stato di lavoro VPS pulito.
- HTTP interno 200 con hash `d5274ebdb9358a1fd3675c7688af4a562997f3580f7146ca7c3c4b8b70c16e22`, HTTPS nativo 200 con identici byte, hash e Build307. [Apri Build307](https://ionos-n8n-new.tailc01234.ts.net/gis?v=d5274ebd).
- Review completa del bundle DELICATO: [report](REVIEW.md) / [checklist](review-structured.json).
- ABQA Edge candidato [27/27](candidate-qa.json) e ABQA Edge su HTTPS distribuita [27/27](live-qa.json): entrambe 0 POST, eccezioni JS, console errors e harness errors; profili browser temporanei rimossi.
- Journal reale [deploy.json](deploy.json).

## Funzioni distribuite e perimetro

La barra Traccia superiore su desktop contiene Importa corrente ed Esporta corrente (solo draft); la sezione Tracce salvate contiene Importa in archivio (Workbench Import GIS, anteprima/validazione/rollback) ed Esporta selezionate (righe spuntate). Quotes GPX/KML/GeoJSON in archivio restano associate al geometry hash con sanitizer esistente, anche parziali. KML3D soltanto con quote complete, altrimenti KML2D. Fuori GIS dialog modale, su desktop GIS dialog cliccabile modeless livello29; mobile mantiene comportamenti Build306.

## Gate residuo

Operatore desktop deve verificare i quattro comandi e i percorsi realmente visibili, senza sovrascrivere dati personali. Attestazione solo se verificato: `QA GIS-TRACK-IO-CURRENT-ARCHIVE-A PASS operatore`. Non attribuire PASS umano sulla base dei soli 27/27 automatici. A PASS applicare OM sezione 4 Regola H, chiusura documentale. Precisione DTM 5-10m sul terreno HOLD, profilo da soli XY senza quote non implementato, telefono PAUSA.

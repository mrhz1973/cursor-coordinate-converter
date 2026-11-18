# Build311 LIVE — importazione batch nell'archivio tracce

**Data deploy:** 18 novembre 2026, 00:27:03 UTC (01:27 Europe/Rome).
**Blocco:** GIS-TRACK-ARCHIVE-BATCH-10-A.
**CLOSURE:** STANDARD_RUNTIME_BUNDLE.
**GATE:** REVIEW GPT-SOSTITUTIVA PASS; statico JavaScript 2/2; Edge candidato 30/30 PASS; Edge HTTPS LIVE 30/30 PASS. **QA OPERATORE PENDING**. Reviewer AI esterno NOT_PERFORMED/backstop post-hoc.

## Funzionalità

Nella finestra desktop Traccia, il comando Importa file della zona inferiore Tracce salvate ora accetta fino a 10 file GPX/KML/KMZ/GeoJSON in un'operazione, anche più LineString, MultiLineString e segmenti per singolo file. Massimo 10 percorsi totali per batch; non li fonde. Mostra un'anteprima per percorso con nome editabile, file di origine, punti e quote presenti. Importa tutte esegue un commit atomico, con salvataggio verificato per ogni traccia e rollback completo in caso di errore. Le nuove tracce partono nascoste; Mostra e Centra restano azioni esplicite. L'importazione superiore resta singola e modificabile.

Quote importate GPX/KML/GeoJSON valide o mancanti conservate come addon originali. Nuovo modulo non esegue GPS, fetch di rete o creazione waypoint/poligoni. Telefono PAUSA.

## Identità e deploy

- Source commit runtime: 4ddcb641b756ac987f619c2cd7fa09e236734147.
- Source blob Git: da91f41a861b1390bb873d371b108b5539152a56.
- SHA256 runtime: 4381c1930a358fc8ad5842507a40a5d44caaa8466708e66c050991e5b2c0fc4d.
- Dimensione: 11.226.592 byte, CR192/CRLF0.
- Repo GitHub origin/main al deploy: 40f1abea7266968c2bf63e40af7e266c21bd4382.
- VPS prima: HEAD d62b2b51f197f7a37f8ad877ff6c7c68eced0b34 / Build310.
- Backup Build310 verificato prima del deploy: /var/backups/goi-gis-runtime/prebuild311-MUfXTpAv.
- VPS dopo: fast-forward a 40f1abea7266968c2bf63e40af7e266c21bd4382, worktree pulito.
- Servizio: goi-gis-app.service, un solo restart; PID precedente 2370134, successivo 697099, stato running/active.
- VPS file, HTTP interno 100.99.54.93:8000 e HTTPS: hash identico al candidato. HTTPS: 11.226.592 byte.
- URL operativo: https://ionos-n8n-new.tailc01234.ts.net/gis?v=4381c193.
- La precedente segnalazione di blocco nella scrittura di uno script era locale allo strumento; la procedura Git/SSH autorizzata ha consentito il deploy senza forzare quel controllo. Il rapporto DEPLOY-BLOCKED.md resta storico.

## Review e automated browser QA

- [Review DELICATO / GPT-SOSTITUTIVA](REVIEW.md), già pubblicata prima del deploy; reviewer esterno NOT_PERFORMED/backstop.
- [Candidato 30/30 PASS](candidate-qa.json).
- [HTTPS LIVE 30/30 PASS](live-qa.json), 22 clic nativi, 10 eventi selezione file, 0 POST, 0 eccezioni o errori console, cleanup dei dati di prova PASS.
- Fixture in Edge isolato: 4 file → 10 tracce, 10 file distinti → 10 tracce; rifiuto 11 file/11 percorsi; nomi diversi e duplicati; quote originali anche parziali; GPX/KML/GeoJSON; archiviazione inizialmente nascosta; dati conservati al reload; importazione superiore singola; errori di cap, nome, coordinate, lettura persistita, terzo inserimento e QuotaExceeded con rollback.
- [Screenshot reali e manifest](screenshots-manifest.json): preview 1440x900, preview a 1280x600, archivio dopo import. [Runner QA](browser-qa.cjs).
- Due prime esecuzioni HTTPS hanno segnalato 29/30 per il solo evento Annulla: la diagnostica CDP ha evidenziato clickCount=0 per il clic simulato, con archivio/bozza/waypoint/raw localStorage invariati. È stata stabilizzata la sequenza dei clic nativi del runner, senza modificare il runtime. Esecuzione completa successiva: 30/30 PASS. Questo finding del runner non è stato nascosto.
- Rimozione di alcune directory temporanee Edge dopo la QA non completata (profileDirectoryRemoved=false); dati origin del profilo isolato rimossi con successo. Nessun permesso globale modificato.
- Nessuna attestazione di qualità topografica DTM 5–10 m: rimane HOLD.

## Gate umano

**QA FINALE CHATGPT — PENDING**. Il proprietario verifica le due zone Traccia, importa più percorsi nell'archivio, controlla nomi/quote e visibilità inizialmente nascosta. Attestazione valida solo dopo prova: QA GIS-TRACK-ARCHIVE-BATCH-10-A PASS operatore. Non è stata dedotta. Senza PASS non eseguire la chiusura Regola H.

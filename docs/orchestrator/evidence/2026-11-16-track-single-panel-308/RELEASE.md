# Build308 LIVE - Tracce in una sola finestra

Verifica: 16 novembre 2026. Registrazione UTC 2026-11-16T12:24:14.247269+00:00.
Blocco `GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX1`. FIX della Build307 non accettata per usabilita; nessun PASS umano storico modificato.

## Stato verificato

Runtime source `d347ec792d515c1ffaa1f8ddd5f8bf3d51d4d0c8`, blob `6182162db2e39360cd42d33153769c0412df6902`, SHA256 `50dcedce9e51549f36136742bfd0dab4816ce7019710c969f06007ddaed95882`, 11.200.744 byte, CR192/CRLF0.
Deploy GIS-only completato il 2026-11-16T12:21:57.922665+00:00: backup307 `/var/backups/goi-gis-runtime/20261116T122156Z-prebuild308`, un solo restart del servizio GIS, PID 124169 -> 1332131. File VPS, HTTP interno e HTTPS nativa restituiscono lo stesso hash e Build308.
URL: https://ionos-n8n-new.tailc01234.ts.net/gis?v=50dcedce

## Interfaccia distribuita

Traccia in modifica sopra: creazione, importazione, Salva/Aggiorna ed Esporta. Punti e distanza in una riga; Dettagli e punti richiudibili. Tracce salvate sotto: Importa file apre direttamente il selettore e la conferma nella stessa finestra Traccia. Nessuna apertura automatica di Oggetti GIS, nessuna categoria generale. Annulla non salva; nome e quote conservati. Azioni batch solo con selezione, Mostra/Nascondi tutte conservate in Altre azioni.

## Evidence

REVIEW GPT-SOSTITUTIVA PASS su sorgente immutabile; reviewer AI esterno NOT_PERFORMED, backstop post-hoc aperto. [Review](REVIEW.md).
JavaScript inline 2/2 PASS, 12 funzioni canoniche di storage/import/export byte-identiche alla base. [Statici](static-checks.json).
Edge candidato 27/27 PASS e Edge HTTPS LIVE 27/27 PASS. In ciascun run finale: 26 clic nativi, 5 aperture del selettore, zero POST, eccezioni JavaScript e errori console. [Candidata](candidate-qa.json), [HTTPS](live-qa.json), [Identita e deploy](runtime-identity.json).
Screenshot reali ispezionati: flusso di conferma nella stessa finestra e viewport 1440x900/1280x600; manifest di hash incluso. Immagini fuori runtime. Dati sintetici, profili isolati; nessun accesso ai dati operativi dell'utente.

## Limiti dichiarati e gate

La pulizia dei dati applicativi dell'origine di prova e verificata. Windows impedisce la rimozione di alcune directory temporanee isolate: il relativo campo cleanup=false rimane nei rapporti e non e dichiarato PASS di eliminazione. Non sono stati alterati i permessi globali o il profilo personale.
QA OPERATORE PENDING: i test non attestano l'usabilita percepita. Valutare la nuova finestra e un'importazione file senza passare a Oggetti GIS. Solo dopo attestazione esatta `QA GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX1 PASS operatore` applicare Regola H. DTM terreno HOLD, profilo XY senza quote separato, mobile PAUSA.

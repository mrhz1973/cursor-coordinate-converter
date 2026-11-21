# FRONTIER â€” stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui. Storico solo on-demand.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | P0 inventario HTTP/HTTPS — Local Storage HTTP/HTTPS e IndexedDB HTTP già verificati. IndexedDB HTTPS: download dichiarato, file non individuato nella cartella attesa; TMAR nuovamente operativo. P1/P2/P3 CLOSED; Build317 invariata. |
| **WU ATTIVA** | â€” (bundle runtime a livello blocco) |
| **BLOCCO ATTIVO** | GIS-HTTP-ORIGIN-INVENTORY-P0 — audit non distruttivo, nessun bundle runtime. |
| **STATO BLOCCO** | P0 APERTO / HTTPS_IDB_DOWNLOAD_DECLARED / SOURCE_FILE_NOT_LOCATED / ORIGIN_BACKUP_PENDING. Le tre precedenti verifiche restano acquisite. Ricevuta browser HTTPS: 315 tile dichiarate; file e copia ancora NON VERIFICATI. |
| **GATE CORRENTE** | WAIT — localizzare il download IndexedDB HTTPS esistente. TMAR risponde su ASUSDESKTOP; verifier STOP a SOURCE_READ. Nessun nome col timestamp atteso in Download; percorsi configurati alternativi non leggibili (ACCESS_DENIED). Posizione e completamento del download non attestati. |
| **RUNTIME LIVE** | Build317 source aff215323c97a309cbd5c6c7e0c694d35dd45ad0, blob 4578788467822123ea7ad7e929d3bdf0e262b1a8, SHA256 ed760bbd704db0e925f8af7f52a7880d9cffda4be2e2f0af9a2044c9cdf56fec, 11.288.727 byte CR192/CRLF0; GitHub/VPS/file/HTTP/HTTPS concordi. |
| **RUNTIME CANDIDATE** | Build317 già distribuita e verificata; nessun candidato successivo aperto. |
| **ULTIMO BLOCCO CHIUSO** | GIS-SAVED-TRACK-PARTIAL-ALTITUDE-FILL-A — Build317, QA operatore PASS 19/11/2026; [ricevuta](orchestrator/evidence/2026-11-19-qa317-p3-closure/REPORT.md). |
| **NEXT** | Nel browser usato per l’export, individuare il file TMAR-GIS-P0-HTTPS-IndexedDB-20261120T165609715Z.json tramite Ctrl+J e fornire percorso locale esatto oppure stato del download. Poi riprendere il verifier qualificato; chiarire la disponibilità del file prima di un nuovo export. Successivi: contenitori residui e confronto dei contenuti, con controllo variazioni prima di azioni sui dati. P4 FUTURO, DTM5/10m HOLD, mobile PAUSA. |
| **RICHIESTE CHAT49 ANCORA APERTE** | P1/P2/P3 CLOSED. P0 tre backup logici verificati; IndexedDB HTTPS dichiarato ma sorgente non individuata. Contenitori residui, confronto e verifica di attualità prima di azioni sui dati PENDING. P4 SOLO FUTURO, mobile PAUSA. |
| **BACKLOG OPERATORE 16/11** | [Backlog originale](orchestrator/backlog/2026-11-16-operatore-tracce-tabelle-quote-url.md) - [Audit P2](orchestrator/evidence/2026-11-18-table-uniformity-p2-audit/AUDIT.md) - [Matrice P2 finale](orchestrator/evidence/2026-11-18-all-remaining-p2-316/MATRIX.md). P2/P3 CLOSED; [P0 download IndexedDB HTTPS da localizzare](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md); P4 FUTURO. |
| **DTM / ACCURATEZZA** | Ground truth del percorso originale e precisione sul terreno DTM5/10m ancora HOLD; QA operatore Build302 e antecedenti separate. Quote GPX/KML conservate non attestano precisione topografica. |
| **LIMITI QUOTE** | Quote importate originali conservate e non sovrascritte; lacune completabili in addon terrainFill separato, DTM locale 5m o Open-Meteo GLO-90 90m con opt-in. Stime non esportate come quote originali; nessun dislivello totale misto né pendenza tra fonti diverse. Accuratezza DTM5/10m HOLD. |
| **SVILUPPO TELEFONO** | PAUSA fino a nuovo ordine dell'utente. Funzioni mobili preesistenti non disabilitate. |
| **ACCESSO / DEPLOY** | 19/11/2026: Build317 già servita, verificata senza nuovo deploy/riavvio. Backup316 preesistente /var/backups/goi-gis-runtime/prebuild317-FdlskfH8; servizio GIS active/running, PID3001592. [Apri](https://ionos-n8n-new.tailc01234.ts.net/gis?v=ed760bbd). |
| **EVIDENCE** | [P0 backup acquisiti e sorgente HTTPS da localizzare](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md) - [QA operatore P3 CLOSED](orchestrator/evidence/2026-11-19-qa317-p3-closure/REPORT.md) - [Riconciliazione Build317](orchestrator/evidence/2026-11-18-partial-imported-elevation-317/RELEASE.md) - [Identità](orchestrator/evidence/2026-11-18-partial-imported-elevation-317/runtime-identity.json) - [QA HTTPS151](orchestrator/evidence/2026-11-18-partial-imported-elevation-317/live-qa.json) - [Review predeploy](orchestrator/evidence/2026-11-18-partial-imported-elevation-317/REVIEW.md) - [P2 CLOSED](orchestrator/evidence/2026-11-18-qa316-p2-final-closure/REPORT.md). |

## P0 — TMAR ripristinato; download IndexedDB HTTPS da localizzare (21 novembre 2026)

La ricevuta operatore del 20/11 alle 16:56:09.715 UTC dichiara 315 tile HTTPS, 7.984.081 byte binari e JSON da 10.695.152 byte. Il primo tentativo nativo era rimasto non attestato per Session terminated. Il 21/11 TMAR risponde su ASUSDESKTOP, ma il verifier qualificato si arresta a SOURCE_READ/LOCAL_OPERATION_FAILED. Nessun nome col timestamp atteso nella cartella Download; le preferenze dei browser per percorsi alternativi sono ACCESS_DENIED. Non dedurre cancellazione, assenza altrove o completamento del download. File/copia HTTPS IDB NON VERIFICATI; tre evidenze di backup precedenti preservate. [Esiti e perimetro](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/https-indexeddb-verification-blocked.json). NEXT: percorso locale o stato dalla lista download del browser; nessuna modifica permessi, migrazione, pulizia o nuova QA runtime.

## P0 — Local Storage HTTPS verificato; IndexedDB HTTPS pendente (20 novembre 2026)

Snapshot HTTPS del 20/11 alle 12:02:48.832 UTC, verifica TMAR alle 12:04:06.585 UTC: 388.370 byte, 2 chiavi, SHA256 e copia byte per byte PASS. Chiave principale JSON valida: 5 tracce salvate, 0 waypoint, 0 poligoni e impostazioni presenti; UI inclusa. [Ricevuta metadata](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/https-localstorage-verification.json). Il precedente snapshot HTTP aveva 1 traccia e 200 waypoint: confronto limitato ai conteggi, identità e contenuti dei singoli record ancora da confrontare. Tre acquisizioni separate, nessuno snapshot atomico né backup completo origine attestato. Prossimo gate IndexedDB HTTPS, poi contenitori residui e confronto; nessuna migrazione o pulizia. [Rapporto](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md).

## P0 — IndexedDB HTTP verificato; acquisizione HTTPS pendente (20 novembre 2026)

Export reale del 20/11 alle 11:34:39 UTC, verificato tramite TMAR alle 11:39:51 UTC: 1.028 tile, 16.012.203 byte binari, JSON da 21.511.025 byte. SHA256 globale e di tutti i binari PASS; copia locale identica byte per byte. [Ricevuta metadata](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/http-indexeddb-verification.json). Copertura INDEXEDDB_TILES_ONLY, distinta dal Local Storage acquisito alle 02:21:03 UTC: non costituiscono uno snapshot atomico né una garanzia sulle modifiche successive. HTTPS, contenitori residui e confronto ancora da acquisire; backup completo origine non attestato. [Rapporto e prossimo comando](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md).

## P0 — catalogo IndexedDB HTTP acquisito, export pronto (20 novembre 2026)

L’operatore attesta un solo DB HTTP: CoordConvMapTiles v1. Non ancora acquisiti schema/conteggio/contenuti delle tile personali. Predisposto un comando unico readonly con guard schema, abort upgrade e gestione connessioni tardive, seguito da export solo se completo. Review indipendenti PASS;4 test Edge nativi e14 controlli verifier su fixture PASS. Nessun runtime GIS/profilo personale usato nelle prove; download reale IDB non ancora avviato. Local Storage HTTP già verificato; HTTPS e confronto restano aperti. [Rapporto e comando](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md).

## P0 — Local Storage HTTP verificato (20 novembre 2026)

Download e copia locale verificati sul PC: 36.618 byte, 2 chiavi, stesso SHA256 annunciato dalla Console; file e copia coincidono byte per byte. coordconv_v2 conserva 1 traccia, 200 waypoint, 0 poligoni e impostazioni; UI inclusa. Copertura LOCALSTORAGE_ONLY, nessun payload privato pubblicato. Restano catalogo/contenuti IDB, contenitori residui, HTTPS e confronto. Nessuna migrazione, pulizia, modifica runtime o QA ripetuta. [Ricevuta e gate](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md).

## P0 — lettura HTTP attestata, backup in attesa (20 novembre 2026)

La console operatore legge coordconv_v2 sull’origine HTTP: 30.908 unità UTF-16, 1 traccia salvata, 200 waypoint, 0 poligoni e impostazioni presenti. Questi dati non coprono altre chiavi, memoria dell’app, IDB/cache o HTTPS. Copia fisica negata anche da Esplora file. Predisposto export locale LOCALSTORAGE_ONLY con SHA256, revisione statica e verifica sintetica PASS; esecuzione/download e verifica del file ancora da effettuare. P0 resta aperto; nessuna migrazione, pulizia, modifica runtime o nuova QA. [Rapporto e comando](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md).

## P0 — metadati HTTP/HTTPS acquisiti, backup BLOCKED (19 novembre 2026)

Profilo Edge Default su AsusDesktop segnato attivo; presenti directory IDB di entrambe le origini. Nessun conteggio logico o confronto dei record acquisito. Tentativo di copia fermato prima di copiare dati: Win32 ACCESS_DENIED5 su Local Storage; Browser collegato non disponibile nella sessione. Backup INCOMPLETE, zero sorgenti copiate. Nessuna pulizia, migrazione, modifica runtime o riavvio. [Ricevuta e gate di ripresa](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md).

## Build317 — P3 QA operatore PASS / CLOSED (19 novembre 2026)

Attestazione esatta ricevuta: `QA GIS-SAVED-TRACK-PARTIAL-ALTITUDE-FILL-A PASS operatore`. Review sostitutiva, distribuzione verificata e QA HTTPS151/151 già acquisite; chiusura Regola H esclusivamente documentale. Nessun nuovo deploy o ripetizione QA. [Ricevuta](orchestrator/evidence/2026-11-19-qa317-p3-closure/REPORT.md). P0 resta aperto come blocco distinto; DTM5/10m HOLD, mobile PAUSA, P4 FUTURO.

## Build317 — P3 quote parziali LIVE, QA operatore PENDING (19 novembre 2026)

Riconciliata la discrepanza: il runtime Build317 era già servito mentre la tabella LIVE STATE riportava ancora Build316. Verificati source/blob/hash GitHub, file VPS, HTTP e HTTPS; backup316 presente. Nessun nuovo deploy o restart. Review predeploy e candidato151 già acquisiti; eseguita la sola QA HTTPS LIVE151, PASS. Quote originali e stime restano separate; precisione DTM5/10m HOLD. QA umana residua ancora da attestare. [Release e limiti](orchestrator/evidence/2026-11-18-partial-imported-elevation-317/RELEASE.md), [risultati LIVE](orchestrator/evidence/2026-11-18-partial-imported-elevation-317/live-qa.json).

## Build316 — P2 multi-tab LIVE, QA finale operatore PASS / CLOSED (18 novembre 2026)

Range rings, Preferiti, due picker Astro e Batch LIVE; precedenti tabelle P2 già accettate. Review DELICATO GPT-SOSTITUTIVA PASS (esterno NOT_PERFORMED), candidato e HTTPS LIVE 134/134 PASS. QA operatore finale ricevuta il 18/11/2026, [ricevuta CLOSED](orchestrator/evidence/2026-11-18-qa316-p2-final-closure/REPORT.md). [Release](orchestrator/evidence/2026-11-18-all-remaining-p2-316/RELEASE.md) e [matrice](orchestrator/evidence/2026-11-18-all-remaining-p2-316/MATRIX.md).

## Build315 — P2-B3 Aree offline LIVE / QA operatore PASS / CLOSED (18 novembre 2026)

Dieci colonne Aree offline ridimensionabili, otto sort persistiti, storage whitelist senza modifiche tile/OPSEC. REVIEW GPT-SOSTITUTIVA PASS, Edge candidato e HTTPS LIVE 98/98 PASS. P2-B4 e P2-C ancora aperti. [Release](orchestrator/evidence/2026-11-18-offline-areas-table-p2b3-315/RELEASE.md).

## Build314 — P2-B2 Poligoni LIVE, approvazione operatore / CLOSED (18 novembre 2026)

Nove colonne Poligoni ridimensionabili, ordinamento persistito, preferenze whitelisted. Interferenza del resizer Azioni col bordo esterno risolta. Review DELICATO GPT-SOSTITUTIVA PASS, candidato e HTTPS LIVE 82/82 PASS. P2-B3/B4 e P2-C APERTI. [Release](orchestrator/evidence/2026-11-18-polygon-table-p2b2-314/RELEASE.md).

## Build313 — P2-B1 Waypoint LIVE, QA operatore PASS / CLOSED (18 novembre 2026)

Sei colonne Waypoint ridimensionabili, ordinamento Nome/Data/Dettagli, preferenze persistite con whitelist; review GPT-SOSTITUTIVA PASS, Edge candidato 65/65 e HTTPS LIVE 65/65 PASS. QA operatore PASS ricevuta il 18/11/2026; [ricevuta](orchestrator/evidence/2026-11-18-qa313-p2b1-closure/REPORT.md). P2-B2/B3/B4 e P2-C ancora aperti. [Release](orchestrator/evidence/2026-11-18-waypoint-table-p2b1-313/RELEASE.md).

## Build312 — P2-A Tracce salvate LIVE, QA operatore PASS / CLOSED (18 novembre 2026)

Sette colonne ridimensionabili, preferenze persistite nella storage canonica; review GPT-SOSTITUTIVA PASS, candidato 46/46, HTTPS 46/46 PASS. QA operatore PASS 18/11/2026; [ricevuta](orchestrator/evidence/2026-11-18-qa312-p2a-closure/REPORT.md). Questo NON chiude P2 complessivo: P2-B/C rimangono aperti. [Evidenza](orchestrator/evidence/2026-11-18-saved-tracks-columns-p2a-312/RELEASE.md).

## Build311 batch archivio — LIVE, QA operatore PASS / CLOSED (18 novembre 2026)

Review GPT-SOSTITUTIVA DELICATO PASS; candidato Edge e HTTPS LIVE 30/30 PASS. La versione è distribuita sul VPS con backup310 e hash concordi. QA operatore PASS ricevuta il 18/11/2026; [ricevuta](orchestrator/evidence/2026-11-18-qa311-closure/REPORT.md). Reviewer esterno NOT_PERFORMED/backstop. [Release](orchestrator/evidence/2026-11-17-track-archive-batch-311/RELEASE.md). Il precedente [blocco dello script](orchestrator/evidence/2026-11-17-track-archive-batch-311/DEPLOY-BLOCKED.md) è storia superata dall'esito del rilascio.

## Build310 — profili altimetrici XY LIVE, QA operatore PASS / CLOSED (17 novembre 2026)

Review GPT-SOSTITUTIVA PASS, JS 2/2, 30/30 Edge candidato e 30/30 HTTPS LIVE; grafico e persistenza per tracce pennello/XY senza quote. PASS operatore acquisito il 17/11/2026; [ricevuta](orchestrator/evidence/2026-11-17-qa310-closure/REPORT.md). Open-Meteo solo opt-in, DTM locale preferito, pendenze terreno 5–10m non certificate. [Rapporto](orchestrator/evidence/2026-11-16-track-profile-xy-310/RELEASE.md).

## Build309 Centra LIVE - QA operatore PASS, CLOSED (16 novembre 2026)

FIX2 del finding operatore: Centra nella zona corrente, anche prima del salvataggio. Candidato e HTTPS nativo 17/17 PASS. [Rapporto e prove](orchestrator/evidence/2026-11-16-track-center-309/REPORT.md). PASS operatore registrato sul FIX2, senza attribuire PASS alla Build308. [Ricevuta](orchestrator/evidence/2026-11-16-qa309-closure/REPORT.md).

## Build308 single-panel - storico, superseded da Build309

Il 16 novembre l'operatore ha segnalato l'assenza del comando Centra sulla traccia corrente importata; correzione nella Build309, accettazione Build308 non acquisita.

27/27 controlli nativi HTTPS PASS, ispezione screenshot della nuova interfaccia completata. Nessuna approvazione operatore dedotta. [Release](orchestrator/evidence/2026-11-16-track-single-panel-308/RELEASE.md).

## Build307 - QA operatore NON ACCETTATA (16 novembre 2026)

Feedback e screenshot: importazione troppo confusa, apertura Oggetti GIS con categorie e waypoint estranei. Nessun PASS umano307; serve FIX UX single-panel prima di nuova QA. [Ricevuta e delta](orchestrator/evidence/2026-11-16-track-io-current-archive-307/OPERATOR-UX-NOT-ACCEPTED.md).

## Storico tecnico Build307 - prima del feedback operatore

Build307 GIS-TRACK-IO-CURRENT-ARCHIVE-A LIVE dopo review GPT-SOSTITUTIVA, deploy GIS-only e ABQA HTTPS nativa 27/27 PASS. User QA resta da acquisire; reviewer AI esterno NOT_PERFORMED/backstop. [Dossier](orchestrator/evidence/2026-11-16-track-io-current-archive-307/RELEASE.md).

## Build306: QA operatore PASS, blocco CLOSED (16 novembre 2026)

Build306 ROUTINE `GIS-TRACK-SAVE-CTA-DESKTOP-A`, Salva scopribile sul desktop. Candidate + HTTPS nativa 13/13 PASS, zero POST/JS errors; la QA umana per Build306 e stata successivamente attestata il 16/11/2026 (ricevuta nel dossier). [Dossier](orchestrator/evidence/2026-11-15-track-save-cta-desktop-306/REPORT.md).

## Chiusura operatore Build305 - 15 novembre 2026

Attestazione esatta: `QA GIS-SAVED-TRACK-IMPORT-ELEVATION-SAVE-A PASS operatore`. Secondo OM sezione 4 Regola H: review GPT sostitutiva, deploy GIS-only, ABQA HTTPS gia PASS; CLOSED docs-only. Monolite e servizi invariati, DTM terreno HOLD, QA storiche distinte, reviewer esterno NOT_PERFORMED. [Ricevuta](orchestrator/evidence/2026-11-15-chat49-handoff-305/OPERATOR-CLOSURE-305.md).

## Passaggio dalla chat49 â€” 15 novembre 2026

Il CORE BOOT iniziale riportava Build303 in FRONTIER; il successivo confronto del monolite e la verifica HTTPS/VPS hanno identificato **Build304 giÃ  LIVE**, source `938b2b3c601ae61b6c71cf806ae67119537af8aa`. Il profilo importato esistente non Ã¨ stato riscritto. Build305 corregge conservazione della singola quota, salvataggio della traccia corrente e invalidazione della quota del punto spostato.

Le prove consumate delle build precedenti non sono state ripetute. Questo pass ha usato fixture sintetiche in profili Edge temporanei, senza dati del browser personale, file GPX privati, GPS o nuove chiamate a provider. I tentativi incompleti e il candidato inizialmente fallito restano nel dossier.

## Storico e fonti on-demand

- [Checkpoint precedenti, preservati senza modifiche](FRONTIER_HISTORY_20261115.md).
- [Build303 â€” conservazione quote e QA storica](orchestrator/evidence/2026-11-15-gpx-elevation-303/REPORT.md).
- [Build302 â€” DTM bidirezionale e limiti](orchestrator/evidence/2026-11-14-local-dtm-direction-302/REPORT.md).
- [Ultimo rapporto completo](runtime/LAST_CURSOR_REPORT.md), evidenza; questa tabella prevale.

# FRONTIER â€” stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui. Storico solo on-demand.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | P0 recupero selettivo su copie — candidato dati preparato, qualificazione driver bloccata; residui parziali. P1/P2/P3 CLOSED; Build317 invariata. |
| **WU ATTIVA** | â€” (bundle runtime a livello blocco) |
| **BLOCCO ATTIVO** | GIS-HTTP-ORIGIN-INVENTORY-P0 — audit non distruttivo, nessun bundle runtime. |
| **STATO BLOCCO** | P0 APERTO / CANDIDATE_PREPARED_NOT_APPLIED / DRIVER_ISOLATION_NOT_QUALIFIED / PRIVATE_ROUNDTRIP_NOT_RUN / RESIDUALS_PARTIAL / ORIGIN_BACKUP_PENDING. Backup completo origine e compatibilità applicativa NON attestati. |
| **GATE CORRENTE** | STOP — il pilot sintetico del driver fallisce UNEXPECTED_TARGET; diagnostica vuota rileva un target di tipo tab diverso dalla page selezionata e target EXTENSION nello stesso contesto. Nessuna prova con dati reali né applicazione. Residui fisici ancora ACCESS_DENIED; nessuna modifica di protezioni/permessi/estensioni. |
| **RUNTIME LIVE** | Build317 source aff215323c97a309cbd5c6c7e0c694d35dd45ad0, blob 4578788467822123ea7ad7e929d3bdf0e262b1a8, SHA256 ed760bbd704db0e925f8af7f52a7880d9cffda4be2e2f0af9a2044c9cdf56fec, 11.288.727 byte CR192/CRLF0; GitHub/VPS/file/HTTP/HTTPS concordi. |
| **RUNTIME CANDIDATE** | Build317 già distribuita e verificata; nessun candidato successivo aperto. |
| **ULTIMO BLOCCO CHIUSO** | GIS-SAVED-TRACK-PARTIAL-ALTITUDE-FILL-A — Build317, QA operatore PASS 19/11/2026; [ricevuta](orchestrator/evidence/2026-11-19-qa317-p3-closure/REPORT.md). |
| **NEXT** | Qualificare compatibilità e isolamento del driver su profili nuovi e dati sintetici, senza ammettere automaticamente i target osservati. [TASK DELTA proposto, non eseguito](orchestrator/evidence/2026-11-21-selective-recovery-roundtrip/REPORT.md). Solo dopo PASS del gate, qualificare controllo HTTPS/candidato su copie; attualità e residui da risolvere per eventuale azione successiva. Migrazione/pulizia non autorizzate; P4 FUTURO, DTM5/10m HOLD, mobile PAUSA. |
| **RICHIESTE CHAT49 ANCORA APERTE** | P1/P2/P3 CLOSED. P0 candidato dati 6 tracce/200 waypoint preparato e verificato; isolamento del driver, compatibilità applicativa e copertura residui aperti. P4 SOLO FUTURO, mobile PAUSA. |
| **BACKLOG OPERATORE 16/11** | [Backlog originale](orchestrator/backlog/2026-11-16-operatore-tracce-tabelle-quote-url.md) - [Audit P2](orchestrator/evidence/2026-11-18-table-uniformity-p2-audit/AUDIT.md) - [Matrice P2 finale](orchestrator/evidence/2026-11-18-all-remaining-p2-316/MATRIX.md). P2/P3 CLOSED; [P0 candidato e gate driver](orchestrator/evidence/2026-11-21-selective-recovery-roundtrip/REPORT.md); P4 FUTURO. |
| **DTM / ACCURATEZZA** | Ground truth del percorso originale e precisione sul terreno DTM5/10m ancora HOLD; QA operatore Build302 e antecedenti separate. Quote GPX/KML conservate non attestano precisione topografica. |
| **LIMITI QUOTE** | Quote importate originali conservate e non sovrascritte; lacune completabili in addon terrainFill separato, DTM locale 5m o Open-Meteo GLO-90 90m con opt-in. Stime non esportate come quote originali; nessun dislivello totale misto né pendenza tra fonti diverse. Accuratezza DTM5/10m HOLD. |
| **SVILUPPO TELEFONO** | PAUSA fino a nuovo ordine dell'utente. Funzioni mobili preesistenti non disabilitate. |
| **ACCESSO / DEPLOY** | 19/11/2026: Build317 già servita, verificata senza nuovo deploy/riavvio. Backup316 preesistente /var/backups/goi-gis-runtime/prebuild317-FdlskfH8; servizio GIS active/running, PID3001592. [Apri](https://ionos-n8n-new.tailc01234.ts.net/gis?v=ed760bbd). |
| **EVIDENCE** | [P0 candidato e gate driver](orchestrator/evidence/2026-11-21-selective-recovery-roundtrip/REPORT.md) - [Identità e ricevute aggregate](orchestrator/evidence/2026-11-21-selective-recovery-roundtrip/evidence.json) - [Attualità e copia HTTP](orchestrator/evidence/2026-11-21-http-recovery-preparation/REPORT.md) - [Backup/confronto precedenti](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md) - [QA operatore P3 CLOSED](orchestrator/evidence/2026-11-19-qa317-p3-closure/REPORT.md) - [Riconciliazione Build317](orchestrator/evidence/2026-11-18-partial-imported-elevation-317/RELEASE.md). |

## P0 — candidato preparato; gate del driver fallito (21 novembre 2026)

[Rapporto corrente](orchestrator/evidence/2026-11-21-selective-recovery-roundtrip/REPORT.md) e [ricevute aggregate](orchestrator/evidence/2026-11-21-selective-recovery-roundtrip/evidence.json). Alle 14:08:44.560 UTC è stato creato e verificato sul PC il candidato dati: 6 tracce e 200 waypoint, 417.285 byte, SHA256 2cbf48cea7f6baef931018185f031d244f56ba9223924f0cda567c0c983bf865. Aggiunge soltanto la traccia HTTP di 11 punti e i 200 waypoint alla copia HTTPS. Record, ordine, tipi, valori e assenze conservati; altre 12 proprietà main strutturalmente identiche, altra chiave LocalStorage raw identica, input originali invariati. Il main può differire nella formattazione. Stato PREPARED_NOT_APPLIED; nessuna readiness applicativa attribuita.

Review statica indipendente del nuovo driver PASS, ma unico pilot sintetico alle 14:15:35–14:15:36 UTC STOP per UNEXPECTED_TARGET: 0 documenti GIS serviti, seed non confermato, input esclusivamente sintetici. Il valore 12 conta eventi misti, non target unici; il flag post-ack non prova che il comando seed non sia stato trasmesso. Controllo HTTPS e candidato reali NON eseguiti. La suite QA317 da 151 casi non è stata ripetuta.

Una sola diagnostica vuota alle 14:21:08.904–14:21:10.243 UTC: primo inatteso ATTACHED/tab/ABOUT_BLANK, target diverso dalla page selezionata nello stesso browserContext, osservato in AUTOATTACH. Inventario iniziale 3 service_worker EXTENSION, 4 background_page EXTENSION e 1 page selezionata; 9 eventi fino allo STOP. Non dimostra compromissione, provenienza delle estensioni, relazione tab/page o causa di tutti i 12 eventi precedenti. Nessun input, runtime, seed, evaluate o navigazione richiesti nella diagnostica. Browser propri chiusi con exit0; script STOP con exit2; profili e artefatti conservati.

Gate effettivo DRIVER_ISOLATION_NOT_QUALIFIED: qualificare lo strumento preservando le protezioni, poi i due bracci su copie soltanto dopo gate PASS. Nessuna applicazione/migrazione/pulizia, modifica permessi/estensioni, runtime o deploy. Restano quattro contenitori logici e cinque snapshot distinti/non atomici; residui ACCESS_DENIED e backup completo origine non attestato. Build317/P3 CLOSED invariati. Le sezioni successive sono storico dei pass precedenti.

## P0 — attualità, copia HTTP aggiornata e recupero da qualificare (21 novembre 2026)

[Rapporto corrente](orchestrator/evidence/2026-11-21-http-recovery-preparation/REPORT.md). Sonde reali alle 13:05–13:06 UTC: HTTPS LocalStorage/IDB e HTTP IDB coincidono con i backup; HTTP LocalStorage differisce. Nuovo snapshot HTTP 13:08:01.748 UTC, verificato/copiato alle 13:11:08.056 UTC, 36.618 byte/2 chiavi, SHA256 31f21f40771c9114fa15b62bb58740508367b5c3941a947d7b2809f1a0ba04a0. Copia precedente conservata; cinque acquisizioni distinte per quattro contenitori logici, non atomiche.

Audit locale 13:16:27.791 UTC: differenza HTTP limitata a settings; traccia/waypoint e chiave UI identici allo snapshot precedente. Proposta selettiva: 6 tracce e 200 waypoint totali entro i cap, zero collisioni fra ID tracce/waypoint delle origini. Classificazione mirata conclusa alle 13:29:47 UTC: i 396 campi data sono assenti, gli 11 meta dei punti HTTP sono null, l’unico ID punto ripetuto è nelle tracce HTTPS preesistenti. Gli indicatori conservativi del referto originale BLOCKED non dimostrano corruzione/perdite HTTP. Compatibilità completa del caricamento/salvataggio non attestata, nessun candidato dati creato.

Profilo Edge Default identificato dalla UI. Cataloghi fisici residui: ACCESS_DENIED(5) alle 12:57:22 UTC prima dei byte; nessuna mappatura completa o modifica permessi. Proposta e gate nel rapporto: definire trattamento HTTP, qualificare compatibilità su copie e risolvere copertura residua per l’azione prevista. Nessuna migrazione/pulizia autorizzata; runtime Build317, P3 CLOSED e vincoli invariati. Le sezioni successive sono storico dei pass precedenti.

## P0 — quattro backup e confronto completati; residui parziali (21 novembre 2026)

Nuovo IndexedDB HTTPS: snapshot 02:53:25.362 UTC, verifica nativa 02:58:10.144 UTC, 315 record/7.984.081 byte binari, file e copia PASS; [ricevuta](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/https-indexeddb-verification.json). Il vecchio download risultava «Rimossi» nella UI Edge; nuova esecuzione qualificata su pagina neutra tramite TMAR UIAutomation/Win32 e conferma Salva. Quattro backup logici acquisiti in snapshot distinti; nessun backup completo dell’origine.

[Confronto nativo](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/origin-comparison.json) alle 03:10:33.587 UTC, risultato COMPARED e controlli input tutti true: due chiavi Local Storage per origine, entrambe raw diverse; tracce salvate 1 HTTP/5 HTTPS senza occorrenze strutturali esatte comuni; waypoint 200/0. IndexedDB 1.028/315 record, 1.343 chiavi nell’unione e nessuna chiave comune. Non sono attestate identità funzionale, equivalenza geografica o equivalenza di tile con chiavi diverse. ExitCode Node non attestato dal trasporto; output completo acquisito, wrapper proprio chiuso dopo guard, nessuna ripetizione.

Residui HTTPS 03:08 UTC e HTTP 03:09:51 UTC: inventario di soli metadati PARTIAL. Cache/SW HTTPS zero; HTTP UNAVAILABLE/null. Sessione e cookie hanno coperture limitate; OPFS/legacy/WebSQL NOT_INSPECTED/null. Nessuna attestazione di immutabilità dei valori correnti rispetto ai quattro backup. [Rapporto e limiti](orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md). Gate reale: decisione sul trattamento dei dati HTTP, con verifica di attualità e copertura residui prima di qualsiasi azione; migrazione/pulizia bloccate. Le sezioni successive conservano i passaggi storici e i relativi gate.

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

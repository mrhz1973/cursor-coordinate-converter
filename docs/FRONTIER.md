# FRONTIER â€” stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui. Storico solo on-demand.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Profilo altimetrico tracce XY salvate desktop — Build310 LIVE, QA operatore PENDING. |
| **WU ATTIVA** | â€” (bundle runtime a livello blocco) |
| **BLOCCO ATTIVO** | GIS-SAVED-TRACK-PROFILE-XY-A |
| **STATO BLOCCO** | Build310 LIVE: Profilo salvato anche per tracce pennello/XY senza quote, calcolo esplicito DTM locale o Open-Meteo opt-in. Gate tecnico PASS; chiusura umana non ancora acquisita. |
| **GATE CORRENTE** | DELICATO: Review GPT-SOSTITUTIVA PASS (reviewer esterno NOT_PERFORMED); JS 2/2, candidato Edge 30/30, HTTPS LIVE 30/30 PASS. QA operatore PENDING. Cleanup origine test PASS; profili Edge temporanei non tutti rimossi su Windows. |
| **RUNTIME LIVE** | Build310 source e0b7e133dea16e38d083a53a50276a232609e8fd, blob c26828b64ffd100829f031db53027615483065ed, SHA256 ff0c618e089a56cdba221e9f69d35273f0b34996c4e17be4ed6c013152373aea, 11.213.149 byte, CR192/CRLF0. VPS/HTTP/HTTPS identici. |
| **RUNTIME CANDIDATE** | Nessun candidato successivo alla Build310 verificato. |
| **ULTIMO BLOCCO CHIUSO** | GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX2 - Build309, QA PASS operatore 16/11/2026; [ricevuta](orchestrator/evidence/2026-11-16-qa309-closure/REPORT.md). |
| **NEXT** | QA operatore Build310: Traccia > Tracce salvate > Profilo su traccia pennello senza quote > Calcola quote. Verificare DTM locale o consenso esplicito Open-Meteo, sorgente dichiarata e profilo dopo riapertura. Riga prevista: QA GIS-SAVED-TRACK-PROFILE-XY-A PASS operatore. Non chiudere senza attestazione. |
| **RICHIESTE CHAT49 ANCORA APERTE** | Profilo XY ora in Build310 LIVE con QA operatore PENDING. Precisione altimetrica terreno DTM 5/10m HOLD; batch import/tracce e tabelle separati/backlog. |
| **BACKLOG OPERATORE 16/11** | [Menu Nuova traccia FUTURO, tabelle in tutte le tab, batch archivio, profilo XY con provider, unico HTTPS e cleanup sicuro](orchestrator/backlog/2026-11-16-operatore-tracce-tabelle-quote-url.md). Profilo XY disponibile in Build310 in attesa QA umana; altri elementi aperti, non sovrapporre. |
| **DTM / ACCURATEZZA** | Ground truth del percorso originale e precisione sul terreno DTM5/10m ancora HOLD; QA operatore Build302 e antecedenti separate. Quote GPX/KML conservate non attestano precisione topografica. |
| **LIMITI QUOTE** | GPX/KML originali conservate e non sovrascritte. Profili stimati separati, fonte DTM locale 5m oppure Open-Meteo GLO-90 90m; stime non esportate come quote originali. Parziali importati non completati da questo blocco. KML3D solo quote interamente valide; DTM5/10m precisione HOLD. |
| **SVILUPPO TELEFONO** | PAUSA fino a nuovo ordine dell'utente. Funzioni mobili preesistenti non disabilitate. |
| **ACCESSO / DEPLOY** | 16/11/2026: GIS-only Build310 LIVE, backup309 /var/backups/goi-gis-runtime/20261116T225212Z-prebuild310, un restart solo GIS, VPS/HTTP/HTTPS SHA concorde. [Apri](https://ionos-n8n-new.tailc01234.ts.net/gis?v=ff0c618e). |
| **EVIDENCE** | [Build310 LIVE](orchestrator/evidence/2026-11-16-track-profile-xy-310/RELEASE.md) - [Review](orchestrator/evidence/2026-11-16-track-profile-xy-310/REVIEW.md) - [QA op. Build309](orchestrator/evidence/2026-11-16-qa309-closure/REPORT.md). |

## Build310 — profili altimetrici XY salvati LIVE, QA operatore PENDING

Review GPT-SOSTITUTIVA PASS, JS 2/2, 30/30 Edge candidato e 30/30 HTTPS LIVE; grafico e persistenza per tracce pennello/XY senza quote. Nessun PASS umano Build310 dedotto. Open-Meteo solo opt-in, DTM locale preferito, pendenze terreno 5–10m non certificate. [Rapporto](orchestrator/evidence/2026-11-16-track-profile-xy-310/RELEASE.md).

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

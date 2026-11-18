# FRONTIER â€” stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui. Storico solo on-demand.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Tracce desktop — Build311 importazione batch archivio LIVE, QA operatore PASS / CLOSED; prossimo backlog P2 tabelle desktop. |
| **WU ATTIVA** | â€” (bundle runtime a livello blocco) |
| **BLOCCO ATTIVO** | — (nessun nuovo bundle runtime aperto; ultimo GIS-TRACK-ARCHIVE-BATCH-10-A CLOSED). |
| **STATO BLOCCO** | Build311 LIVE e CLOSED con attestazione operatore PASS del 18/11/2026; profilo STANDARD_RUNTIME_BUNDLE, Regola H chiusura docs-only. Nessuna Build312 creata. |
| **GATE CORRENTE** | Build311 DELICATO: REVIEW GPT-SOSTITUTIVA PASS (reviewer esterno NOT_PERFORMED / backstop), JavaScript 2/2, Edge candidato 30/30, HTTPS LIVE 30/30, QA operatore PASS. Regola H completata docs-only; prossimo P2 non ancora aperto/qualificato. |
| **RUNTIME LIVE** | Build311 source 4ddcb641b756ac987f619c2cd7fa09e236734147, blob da91f41a861b1390bb873d371b108b5539152a56, SHA256 4381c1930a358fc8ad5842507a40a5d44caaa8466708e66c050991e5b2c0fc4d, 11.226.592 byte CR192/CRLF0; VPS/file/HTTP/HTTPS concordi. |
| **RUNTIME CANDIDATE** | Nessun candidato successivo alla Build311 verificato. |
| **ULTIMO BLOCCO CHIUSO** | GIS-TRACK-ARCHIVE-BATCH-10-A — Build311, QA PASS operatore 18/11/2026; [ricevuta](orchestrator/evidence/2026-11-18-qa311-closure/REPORT.md). |
| **NEXT** | Backlog P2: uniformità tabelle desktop (ridimensionamento/ordinamento/selezione nelle tabelle richieste), nuovo scope/gate dedicato; nessuna nuova modifica in questa chiusura. Menu Nuova traccia FUTURO, DTM terreno 5/10m HOLD, mobile PAUSA. |
| **RICHIESTE CHAT49 ANCORA APERTE** | P1 batch archivio completato e accettato Build311; P2 uniformità tabelle separata ancora aperta. Profilo XY Build310 CLOSED; accuratezza DTM terreno HOLD. |
| **BACKLOG OPERATORE 16/11** | [Backlog originale batch/tabelle/quote/URL](orchestrator/backlog/2026-11-16-operatore-tracce-tabelle-quote-url.md). P1 batch archivio CLOSED Build311; P2 tabelle ancora aperto; P4 menu Nuova traccia FUTURO, mobile PAUSA. |
| **DTM / ACCURATEZZA** | Ground truth del percorso originale e precisione sul terreno DTM5/10m ancora HOLD; QA operatore Build302 e antecedenti separate. Quote GPX/KML conservate non attestano precisione topografica. |
| **LIMITI QUOTE** | GPX/KML originali conservate e non sovrascritte. Profili stimati separati, fonte DTM locale 5m oppure Open-Meteo GLO-90 90m; stime non esportate come quote originali. Parziali importati non completati da questo blocco. KML3D solo quote interamente valide; DTM5/10m precisione HOLD. |
| **SVILUPPO TELEFONO** | PAUSA fino a nuovo ordine dell'utente. Funzioni mobili preesistenti non disabilitate. |
| **ACCESSO / DEPLOY** | 18/11/2026: GIS-only Build311 LIVE; backup310 /var/backups/goi-gis-runtime/prebuild311-MUfXTpAv, un restart solo GIS (PID 2370134→697099), hash VPS/HTTP/HTTPS concorde. [Apri](https://ionos-n8n-new.tailc01234.ts.net/gis?v=4381c193). |
| **EVIDENCE** | [QA operatore Build311](orchestrator/evidence/2026-11-18-qa311-closure/REPORT.md) - [Build311 LIVE](orchestrator/evidence/2026-11-17-track-archive-batch-311/RELEASE.md) - [Review](orchestrator/evidence/2026-11-17-track-archive-batch-311/REVIEW.md) - [QA HTTPS](orchestrator/evidence/2026-11-17-track-archive-batch-311/live-qa.json). |

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

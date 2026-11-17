# FRONTIER â€” stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui. Storico solo on-demand.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Tracce desktop — importazione batch archivio Build311 candidata, deploy BLOCCATO (tool safety), non LIVE. |
| **WU ATTIVA** | â€” (bundle runtime a livello blocco) |
| **BLOCCO ATTIVO** | GIS-TRACK-ARCHIVE-BATCH-10-A |
| **STATO BLOCCO** | Build311 candidata su origin/main, REVIEW GPT-SOSTITUTIVA PASS e 30/30 Edge candidato; deploy non eseguito per blocco sicurezza dello strumento. LIVE ancora Build310, QA operatore Build311 PENDING. |
| **GATE CORRENTE** | DELICATO: review GPT-SOSTITUTIVA PASS (reviewer esterno NOT_PERFORMED/post-hoc); JS inline 2/2 e Edge candidato 30/30 PASS. DEPLOY BLOCKED — TOOL SAFETY; ABQA HTTPS Build311 NOT_PERFORMED e QA operatore PENDING. Non dichiarare LIVE. |
| **RUNTIME LIVE** | Build310 source e0b7e133dea16e38d083a53a50276a232609e8fd, blob c26828b64ffd100829f031db53027615483065ed, SHA256 ff0c618e089a56cdba221e9f69d35273f0b34996c4e17be4ed6c013152373aea, 11.213.149 byte, CR192/CRLF0. VPS/HTTP/HTTPS identici. |
| **RUNTIME CANDIDATE** | Build311 source 4ddcb641b756ac987f619c2cd7fa09e236734147, blob da91f41a861b1390bb873d371b108b5539152a56, SHA256 4381c1930a358fc8ad5842507a40a5d44caaa8466708e66c050991e5b2c0fc4d, 11.226.592 byte CR192/CRLF0; candidate QA 30/30 PASS. Nessun deploy. |
| **ULTIMO BLOCCO CHIUSO** | GIS-SAVED-TRACK-PROFILE-XY-A — Build310, QA PASS operatore 17/11/2026; [ricevuta](orchestrator/evidence/2026-11-17-qa310-closure/REPORT.md). |
| **NEXT** | GATE BLOCCATO: verificare disponibilità di un ambiente autorizzato per deploy esclusivamente GIS-only Build311; review già acquisita. Eseguire prebackup/hash, deploy e ABQA HTTPS solo quando consentito; poi QA operatore. Nessun nuovo NEXT runtime finché gate fallito. Mobile PAUSA, DTM terreno 5/10m HOLD. |
| **RICHIESTE CHAT49 ANCORA APERTE** | P1 batch archivio implementato solo in candidato Build311, NON distribuito; tabelle da uniformare e precisione DTM terreno separate/HOLD. Profilo XY Build310 CLOSED. |
| **BACKLOG OPERATORE 16/11** | [Backlog operatori batch/tabelle/quote/URL](orchestrator/backlog/2026-11-16-operatore-tracce-tabelle-quote-url.md). P1 batch candidata Build311, attesa deploy e QA; P2 tabelle e P4 menu Nuova traccia FUTURO non anticipati. |
| **DTM / ACCURATEZZA** | Ground truth del percorso originale e precisione sul terreno DTM5/10m ancora HOLD; QA operatore Build302 e antecedenti separate. Quote GPX/KML conservate non attestano precisione topografica. |
| **LIMITI QUOTE** | GPX/KML originali conservate e non sovrascritte. Profili stimati separati, fonte DTM locale 5m oppure Open-Meteo GLO-90 90m; stime non esportate come quote originali. Parziali importati non completati da questo blocco. KML3D solo quote interamente valide; DTM5/10m precisione HOLD. |
| **SVILUPPO TELEFONO** | PAUSA fino a nuovo ordine dell'utente. Funzioni mobili preesistenti non disabilitate. |
| **ACCESSO / DEPLOY** | 17/11/2026 lettura VPS: runtime Build310 LIVE (SHA256 ff0c618e089a56cdba221e9f69d35273f0b34996c4e17be4ed6c013152373aea), servizio GIS active; Build311 deploy BLOCCATO, nessun riavvio. [Apri LIVE Build310](https://ionos-n8n-new.tailc01234.ts.net/gis?v=ff0c618e). |
| **EVIDENCE** | [Build311 review](orchestrator/evidence/2026-11-17-track-archive-batch-311/REVIEW.md) - [Deploy blocked](orchestrator/evidence/2026-11-17-track-archive-batch-311/DEPLOY-BLOCKED.md) - [QA candidato](orchestrator/evidence/2026-11-17-track-archive-batch-311/candidate-qa.json) - [Build310 LIVE](orchestrator/evidence/2026-11-16-track-profile-xy-310/RELEASE.md). |

## Build311 batch archivio — CANDIDATE, deploy TOOL-SAFETY BLOCKED

Codice e review GPT-SOSTITUTIVA DELICATO già pubblicati; JS 2/2 e Edge candidato 30/30 PASS. Nessun deploy né QA HTTPS Build311. La versione LIVE rimane Build310, verificata su VPS. [Rapporto blocker](orchestrator/evidence/2026-11-17-track-archive-batch-311/DEPLOY-BLOCKED.md).

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

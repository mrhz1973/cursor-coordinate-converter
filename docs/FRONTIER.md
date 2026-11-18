# FRONTIER â€” stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui. Storico solo on-demand.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | P2 tabelle desktop — P2-B1 Waypoint Build313 LIVE, QA operatore PENDING; P2-B2/B3/B4 e P2-C ancora aperti. |
| **WU ATTIVA** | â€” (bundle runtime a livello blocco) |
| **BLOCCO ATTIVO** | GIS-WAYPOINT-TABLE-COLUMNS-P2B1 |
| **STATO BLOCCO** | Build313 LIVE: Waypoint desktop 6/6 colonne ridimensionabili, sort Nome/Data/Coordinate, selezione riga/tutte invariata, preferenze persistite/rollback. QA operatore PENDING. |
| **GATE CORRENTE** | DELICATO: review GPT-SOSTITUTIVA PASS (reviewer esterno NOT_PERFORMED/backstop), JS inline 2/2, Edge candidato 65/65, HTTPS LIVE 65/65 PASS. QA FINALE CHATGPT / QA operatore PENDING. Cleanup dati test PASS, directory temporanee Edge non tutte rimosse. |
| **RUNTIME LIVE** | Build313 source 2d4518c297ea977caf79177075ba031053a568b5, blob d1027751adc4e095f70fd064f3c8e491aef1df9c, SHA256 5cb7989947a2095f9f1499a87828b3929e25167c03d1836fe93de763d06ac242, 11.236.623 byte CR192/CRLF0; VPS/file/HTTP/HTTPS identici. |
| **RUNTIME CANDIDATE** | Nessun candidato successivo alla Build313 verificato. |
| **ULTIMO BLOCCO CHIUSO** | GIS-SAVED-TRACKS-COLUMNS-P2A — Build312, QA PASS operatore 18/11/2026; [ricevuta](orchestrator/evidence/2026-11-18-qa312-p2a-closure/REPORT.md). |
| **NEXT** | QA operatore Build313: tabella Waypoint, drag 6 colonne, sort Nome/Data/Dettagli asc/desc, checkbox riga/tutte, reload larghezze/sort, azioni originali presenti. Riga prevista QA GIS-WAYPOINT-TABLE-COLUMNS-P2B1 PASS operatore. Solo dopo PASS/Regola H proseguire P2-B2 Poligoni, poi Aree offline e Range rings. |
| **RICHIESTE CHAT49 ANCORA APERTE** | P1 batch CLOSED Build311, P2-A Tracce salvate CLOSED Build312, P2-B1 Waypoint LIVE Build313 in QA; P2-B2/B3/B4 e P2-C APERTI. Accuratezza DTM terreno HOLD. |
| **BACKLOG OPERATORE 16/11** | [Backlog originale](orchestrator/backlog/2026-11-16-operatore-tracce-tabelle-quote-url.md) - [Audit P2](orchestrator/evidence/2026-11-18-table-uniformity-p2-audit/AUDIT.md). P2-A CLOSED; P2-B1 Waypoint LIVE in QA; P2-B2/B3/B4 e P2-C APERTI. Menu Nuova traccia FUTURO, mobile PAUSA. |
| **DTM / ACCURATEZZA** | Ground truth del percorso originale e precisione sul terreno DTM5/10m ancora HOLD; QA operatore Build302 e antecedenti separate. Quote GPX/KML conservate non attestano precisione topografica. |
| **LIMITI QUOTE** | GPX/KML originali conservate e non sovrascritte. Profili stimati separati, fonte DTM locale 5m oppure Open-Meteo GLO-90 90m; stime non esportate come quote originali. Parziali importati non completati da questo blocco. KML3D solo quote interamente valide; DTM5/10m precisione HOLD. |
| **SVILUPPO TELEFONO** | PAUSA fino a nuovo ordine dell'utente. Funzioni mobili preesistenti non disabilitate. |
| **ACCESSO / DEPLOY** | 18/11/2026: Build313 GIS-only LIVE, backup312 /var/backups/goi-gis-runtime/prebuild313-bwexT3hV, un restart GIS PID821723→961813, hash VPS/HTTP/HTTPS concorde. [Apri](https://ionos-n8n-new.tailc01234.ts.net/gis?v=5cb79899). |
| **EVIDENCE** | [Build313 LIVE](orchestrator/evidence/2026-11-18-waypoint-table-p2b1-313/RELEASE.md) - [Review](orchestrator/evidence/2026-11-18-waypoint-table-p2b1-313/REVIEW.md) - [QA HTTPS](orchestrator/evidence/2026-11-18-waypoint-table-p2b1-313/live-qa.json) - [Matrice audit P2](orchestrator/evidence/2026-11-18-table-uniformity-p2-audit/AUDIT.md). |

## Build313 — P2-B1 Waypoint LIVE, QA operatore PENDING (18 novembre 2026)

Sei colonne Waypoint ridimensionabili, ordinamento Nome/Data/Dettagli, preferenze persistite con whitelist; review GPT-SOSTITUTIVA PASS, Edge candidato 65/65 e HTTPS LIVE 65/65 PASS. P2-B2/B3/B4 e P2-C ancora aperti. [Release](orchestrator/evidence/2026-11-18-waypoint-table-p2b1-313/RELEASE.md).

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

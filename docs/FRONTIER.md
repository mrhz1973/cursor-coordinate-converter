# FRONTIER â€” stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui. Storico solo on-demand.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Tracce desktop - FIX2 Centra Build309 LIVE; valutazione operatore PENDING. |
| **WU ATTIVA** | â€” (bundle runtime a livello blocco) |
| **BLOCCO ATTIVO** | GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX2 |
| **STATO BLOCCO** | Build309 LIVE: pulsante Centra nella traccia corrente, disponibile dopo importazione e prima del salvataggio. Build308 superseded dal finding operatore sul comando mancante; nessun PASS umano308. |
| **GATE CORRENTE** | Bundle ROUTINE: review mirata PASS; JS 2/2, candidato 17/17 e HTTPS LIVE 17/17 PASS con clic nativi e screenshot reali. QA FINALE CHATGPT PENDING. Cleanup dati e profili di prova PASS. Backstop reviewer esterno Build308 resta storico e separato. |
| **RUNTIME LIVE** | Build309 source `8ddb70f1e02f24207c50baa3622b344023e5155c`, blob `263e377652a9445634da253a3074e2175c419d49`, SHA256 `ad07d54d3a9e0242dfc482468feba32f0b3527e2b4101536daae0bc4b842c683`, 11.201.572 byte, CR192/CRLF0. VPS/HTTP/HTTPS concordi. |
| **RUNTIME CANDIDATE** | Nessun candidato successivo alla Build309 verificato. |
| **ULTIMO BLOCCO CHIUSO** | GIS-TRACK-SAVE-CTA-DESKTOP-A - Build306, QA PASS operatore 16/11/2026; [ricevuta](orchestrator/evidence/2026-11-16-qa306-closure/REPORT.md). |
| **NEXT** | QA operatore mirata FIX2: importare la seconda traccia nella zona Traccia in modifica, premere Centra e verificare che l'intero percorso sia visibile nello spazio libero della mappa. Riga prevista: QA GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX2 PASS operatore. Backlog batch/XY/DTM non anticipato. |
| **RICHIESTE CHAT49 ANCORA APERTE** | FIX usabilita distribuito Build309, accettazione umana PENDING. Profilo XY senza quote e accuratezza DTM terreno restano separati/HOLD. |
| **BACKLOG OPERATORE 16/11** | [Menu Nuova traccia FUTURO, tabelle in tutte le tab, batch archivio, profilo XY con provider, unico HTTPS e cleanup sicuro](orchestrator/backlog/2026-11-16-operatore-tracce-tabelle-quote-url.md). Prossimo blocco dopo QA operatore Build309; backlog invariato. |
| **DTM / ACCURATEZZA** | Ground truth del percorso originale e precisione sul terreno DTM5/10m ancora HOLD; QA operatore Build302 e antecedenti separate. Quote GPX/KML conservate non attestano precisione topografica. |
| **LIMITI QUOTE** | GPX conserva quote valide e mancanti; KML3D solo con geometria interamente elevata, altrimenti 2D. Una sola quota si conserva ma non genera profilo/pendenza. Un punto importato spostato perde la propria quota originaria; assegnazioni equivalenti la conservano. |
| **SVILUPPO TELEFONO** | PAUSA fino a nuovo ordine dell'utente. Funzioni mobili preesistenti non disabilitate. |
| **ACCESSO / DEPLOY** | 16/11/2026: GIS-only Build309 LIVE, backup308 `/var/backups/goi-gis-runtime/20261116T202949Z-prebuild309`, restart solo GIS. [Apri](https://ionos-n8n-new.tailc01234.ts.net/gis?v=ad07d54d). |
| **EVIDENCE** | [Build309 Centra LIVE e finding operatore308](orchestrator/evidence/2026-11-16-track-center-309/REPORT.md) - [Build308 storico](orchestrator/evidence/2026-11-16-track-single-panel-308/RELEASE.md) - [Feedback307](orchestrator/evidence/2026-11-16-track-io-current-archive-307/OPERATOR-UX-NOT-ACCEPTED.md). |

## Build309 Centra LIVE - QA operatore PENDING

FIX2 del finding operatore: Centra nella zona corrente, anche prima del salvataggio. Candidato e HTTPS nativo 17/17 PASS. [Rapporto e prove](orchestrator/evidence/2026-11-16-track-center-309/REPORT.md). Nessun PASS umano dedotto.

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

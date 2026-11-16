# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui. Storico solo on-demand.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Tracce desktop - FIX1 single-panel Build308 LIVE; valutazione operatore ancora PENDING. |
| **WU ATTIVA** | — (bundle runtime a livello blocco) |
| **BLOCCO ATTIVO** | GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX1 |
| **STATO BLOCCO** | Build308 LIVE: interfaccia a due zone e importazione archivio nella sola finestra Traccia. Build307 resta storicamente non accettata. FIX non ancora chiuso umanamente. |
| **GATE CORRENTE** | Review GPT-SOSTITUTIVA PASS; JS 2/2, candidato 27/27 e HTTPS LIVE 27/27 PASS con clic nativi e screenshot reali. QA FINALE CHATGPT PENDING. Reviewer esterno NOT_PERFORMED. Cleanup dati test PASS; rimozione directory temporanee parziale (Windows, documentata). |
| **RUNTIME LIVE** | Build308 source `d347ec792d515c1ffaa1f8ddd5f8bf3d51d4d0c8`, blob `6182162db2e39360cd42d33153769c0412df6902`, SHA256 `50dcedce9e51549f36136742bfd0dab4816ce7019710c969f06007ddaed95882`, 11.200.744 byte, CR192/CRLF0. VPS/HTTP/HTTPS concordi. |
| **RUNTIME CANDIDATE** | Nessun candidato successivo alla Build308 verificato. |
| **ULTIMO BLOCCO CHIUSO** | GIS-TRACK-SAVE-CTA-DESKTOP-A - Build306, QA PASS operatore 16/11/2026; [ricevuta](orchestrator/evidence/2026-11-16-qa306-closure/REPORT.md). |
| **NEXT** | QA operatore mirata FIX1: leggibilita delle due zone; Salva nella traccia corrente; Importa file sotto Tracce salvate con conferma nella stessa finestra, senza Oggetti GIS. Riga prevista: QA GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX1 PASS operatore. Nessun avanzamento XY/DTM prima di questo gate. |
| **RICHIESTE CHAT49 ANCORA APERTE** | FIX usabilita distribuito Build308, accettazione umana PENDING. Profilo XY senza quote e accuratezza DTM terreno restano separati/HOLD. |
| **DTM / ACCURATEZZA** | Ground truth del percorso originale e precisione sul terreno DTM5/10m ancora HOLD; QA operatore Build302 e antecedenti separate. Quote GPX/KML conservate non attestano precisione topografica. |
| **LIMITI QUOTE** | GPX conserva quote valide e mancanti; KML3D solo con geometria interamente elevata, altrimenti 2D. Una sola quota si conserva ma non genera profilo/pendenza. Un punto importato spostato perde la propria quota originaria; assegnazioni equivalenti la conservano. |
| **SVILUPPO TELEFONO** | PAUSA fino a nuovo ordine dell'utente. Funzioni mobili preesistenti non disabilitate. |
| **ACCESSO / DEPLOY** | 16/11/2026: GIS-only Build308 LIVE, backup307 `/var/backups/goi-gis-runtime/20261116T122156Z-prebuild308`, restart solo GIS. [Apri](https://ionos-n8n-new.tailc01234.ts.net/gis?v=50dcedce). |
| **EVIDENCE** | [Build308 LIVE](orchestrator/evidence/2026-11-16-track-single-panel-308/RELEASE.md) - [Review](orchestrator/evidence/2026-11-16-track-single-panel-308/REVIEW.md) - [Feedback307](orchestrator/evidence/2026-11-16-track-io-current-archive-307/OPERATOR-UX-NOT-ACCEPTED.md). |

## Build308 single-panel LIVE - QA operatore PENDING

27/27 controlli nativi HTTPS PASS, ispezione screenshot della nuova interfaccia completata. Nessuna approvazione operatore dedotta. [Release](orchestrator/evidence/2026-11-16-track-single-panel-308/RELEASE.md).

## Build307 - QA operatore NON ACCETTATA (16 novembre 2026)

Feedback e screenshot: importazione troppo confusa, apertura Oggetti GIS con categorie e waypoint estranei. Nessun PASS umano307; serve FIX UX single-panel prima di nuova QA. [Ricevuta e delta](orchestrator/evidence/2026-11-16-track-io-current-archive-307/OPERATOR-UX-NOT-ACCEPTED.md).

## Storico tecnico Build307 - prima del feedback operatore

Build307 GIS-TRACK-IO-CURRENT-ARCHIVE-A LIVE dopo review GPT-SOSTITUTIVA, deploy GIS-only e ABQA HTTPS nativa 27/27 PASS. User QA resta da acquisire; reviewer AI esterno NOT_PERFORMED/backstop. [Dossier](orchestrator/evidence/2026-11-16-track-io-current-archive-307/RELEASE.md).

## Build306: QA operatore PASS, blocco CLOSED (16 novembre 2026)

Build306 ROUTINE `GIS-TRACK-SAVE-CTA-DESKTOP-A`, Salva scopribile sul desktop. Candidate + HTTPS nativa 13/13 PASS, zero POST/JS errors; la QA umana per Build306 e stata successivamente attestata il 16/11/2026 (ricevuta nel dossier). [Dossier](orchestrator/evidence/2026-11-15-track-save-cta-desktop-306/REPORT.md).

## Chiusura operatore Build305 - 15 novembre 2026

Attestazione esatta: `QA GIS-SAVED-TRACK-IMPORT-ELEVATION-SAVE-A PASS operatore`. Secondo OM sezione 4 Regola H: review GPT sostitutiva, deploy GIS-only, ABQA HTTPS gia PASS; CLOSED docs-only. Monolite e servizi invariati, DTM terreno HOLD, QA storiche distinte, reviewer esterno NOT_PERFORMED. [Ricevuta](orchestrator/evidence/2026-11-15-chat49-handoff-305/OPERATOR-CLOSURE-305.md).

## Passaggio dalla chat49 — 15 novembre 2026

Il CORE BOOT iniziale riportava Build303 in FRONTIER; il successivo confronto del monolite e la verifica HTTPS/VPS hanno identificato **Build304 già LIVE**, source `938b2b3c601ae61b6c71cf806ae67119537af8aa`. Il profilo importato esistente non è stato riscritto. Build305 corregge conservazione della singola quota, salvataggio della traccia corrente e invalidazione della quota del punto spostato.

Le prove consumate delle build precedenti non sono state ripetute. Questo pass ha usato fixture sintetiche in profili Edge temporanei, senza dati del browser personale, file GPX privati, GPS o nuove chiamate a provider. I tentativi incompleti e il candidato inizialmente fallito restano nel dossier.

## Storico e fonti on-demand

- [Checkpoint precedenti, preservati senza modifiche](FRONTIER_HISTORY_20261115.md).
- [Build303 — conservazione quote e QA storica](orchestrator/evidence/2026-11-15-gpx-elevation-303/REPORT.md).
- [Build302 — DTM bidirezionale e limiti](orchestrator/evidence/2026-11-14-local-dtm-direction-302/REPORT.md).
- [Ultimo rapporto completo](runtime/LAST_CURSOR_REPORT.md), evidenza; questa tabella prevale.

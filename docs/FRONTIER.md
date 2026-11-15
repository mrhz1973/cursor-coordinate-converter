# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui. Storico solo on-demand.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Tracce desktop: Salva reso visibile con Build306; I/O Importa/Esporta corrente vs archivio e profilo solo XY ancora backlog. |
| **WU ATTIVA** | — (bundle runtime a livello blocco) |
| **BLOCCO ATTIVO** | GIS-TRACK-SAVE-CTA-DESKTOP-A |
| **STATO BLOCCO** | **Build306 LIVE**, deploy GIS-only PASS e ABQA HTTPS nativa **13/13 PASS**; **QA operatore PENDING**. |
| **GATE CORRENTE** | ROUTINE UI: JS 2/2 PASS, Edge candidato 13/13 e HTTPS nativo 13/13 PASS, zero POST/eccezioni JS/errori console. **QA FINALE CHATGPT PENDING**. Reviewer esterno N/A. |
| **RUNTIME LIVE** | **Build306** source `287d90c59cf6e77feb7144e79bdaa7087dccc490`, blob `dcf143d899c2c074f32dae03edd0058326c5ebef`, SHA256 `47a770d9cb8ed963e2c8171311f638c1f72ef1bf90090fe18c545d8809480d9b`, 11.172.093 byte, CR192, CRLF0; file VPS, HTTP interno e HTTPS concordi. |
| **RUNTIME CANDIDATE** | Nessun candidato successivo verificato; source branch `task/gis-track-save-cta-desktop-306`. |
| **ULTIMO BLOCCO CHIUSO** | GIS-SAVED-TRACK-IMPORT-ELEVATION-SAVE-A - Build305, QA PASS operatore 15/11/2026; [ricevuta](orchestrator/evidence/2026-11-15-chat49-handoff-305/OPERATOR-CLOSURE-305.md). |
| **NEXT** | QA operatore desktop Build306: 0/1 punti tasto Salva visibile ma disabled; da 2 attivo, salvataggio e in Modifica etichetta Aggiorna. Riga richiesta: `QA GIS-TRACK-SAVE-CTA-DESKTOP-A PASS operatore`. Dopo Regola H: bundle I/O DELICATO separato. |
| **RICHIESTE CHAT49 ANCORA APERTE** | CTA Salva desktop corretta Build306; ancora aperta separazione Importa/Esporta in alto per corrente e in basso per archivio, con QA persistenza. Profilo da soli XY senza quote non disponibile; DTM terreno HOLD. |
| **DTM / ACCURATEZZA** | Ground truth del percorso originale e precisione sul terreno DTM5/10m ancora HOLD; QA operatore Build302 e antecedenti separate. Quote GPX/KML conservate non attestano precisione topografica. |
| **LIMITI QUOTE** | GPX conserva quote valide e mancanti; KML3D solo con geometria interamente elevata, altrimenti 2D. Una sola quota si conserva ma non genera profilo/pendenza. Un punto importato spostato perde la propria quota originaria; assegnazioni equivalenti la conservano. |
| **SVILUPPO TELEFONO** | PAUSA fino a nuovo ordine dell'utente. Funzioni mobili preesistenti non disabilitate. |
| **ACCESSO / DEPLOY** | 15/11/2026: TMAR Desktop Commander Win + SSH ionos-n8n-new, GIS-only deploy Build306 PASS, backup305 /var/backups/goi-gis-runtime/20261115T225548Z-prebuild306, un solo restart GIS. [HTTPS Build306](https://ionos-n8n-new.tailc01234.ts.net/gis?v=47a770d9). |
| **EVIDENCE** | [Build306 e QA](orchestrator/evidence/2026-11-15-track-save-cta-desktop-306/REPORT.md) - [Audit B0](orchestrator/evidence/2026-11-15-track-panel-ux-b0/REPORT.md) - [Chiusura Build305](orchestrator/evidence/2026-11-15-chat49-handoff-305/OPERATOR-CLOSURE-305.md). |

## Build306: QA tecnica PASS, QA operatore PENDING

Build306 ROUTINE `GIS-TRACK-SAVE-CTA-DESKTOP-A`, Salva scopribile sul desktop. Candidate + HTTPS nativa 13/13 PASS, zero POST/JS errors; la QA umana per Build306 non e stata ancora attestata. [Dossier](orchestrator/evidence/2026-11-15-track-save-cta-desktop-306/REPORT.md).

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

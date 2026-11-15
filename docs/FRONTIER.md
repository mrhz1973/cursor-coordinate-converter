# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui. Storico solo on-demand.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Tracce desktop: comandi Importa/Esporta per corrente e archivio, pulsante Salva, profilo XY. |
| **WU ATTIVA** | — (bundle runtime a livello blocco) |
| **BLOCCO ATTIVO** | Nessun bundle runtime attivo: Build305 CLOSED. |
| **STATO BLOCCO** | GIS-SAVED-TRACK-IMPORT-ELEVATION-SAVE-A CLOSED / QA PASS operatore 15/11/2026. Build305 ancora LIVE, chiusura docs-only. |
| **GATE CORRENTE** | REVIEW GPT-SOSTITUTIVA PASS, deploy GIS-only PASS, ABQA HTTPS nativa 49/49 tracce + 16/16 poligoni PASS, QA operatore Build305 PASS esatto. Reviewer esterno NOT_PERFORMED; DTM terreno HOLD, altre QA umane distinte. |
| **RUNTIME LIVE** | Build305 — source `95080bac23a1642c1a2c6f8c0bdd4885b7bac960`; blob `e9b949cdb3d444128f70a6188122bf05fb715d09`; SHA-256 `5ffa64ff3ba9746de9a5463cc4adfc058ceb7de77e095aacdd51259e39d72464`; 11.170.887 byte, CR192, CRLF0. File VPS, HTTP interno, HTTPS e documenti nativi Edge concordi. |
| **RUNTIME CANDIDATE** | Nessun candidato successivo a Build305 verificato. Il candidato preliminare `2664bb1fc1f34732758e6fbf1668e25792744f7a` è superato dal source LIVE; non distribuirlo. |
| **ULTIMO BLOCCO CHIUSO** | GIS-SAVED-TRACK-IMPORT-ELEVATION-SAVE-A - Build305, QA PASS operatore 15/11/2026; [ricevuta](orchestrator/evidence/2026-11-15-chat49-handoff-305/OPERATOR-CLOSURE-305.md). |
| **NEXT** | Audit B0 UX Tracce desktop: Salva archivio visibile/disabilitato quando non ci sono punti; Importa ed Esporta distinti tra traccia corrente e archivio. Definire TASK DELTA e gate prima di aprire una build successiva. Profilo senza quote XY separato; DTM terreno HOLD, mobile PAUSA. |
| **RICHIESTE CHAT49 ANCORA APERTE** | CTA Salva corrente nascosta con zero punti; renderla scopribile. Esporta alto opera sulla selezione archivio: distinguere Importa/Esporta superiori (corrente) e inferiori (lista salvata). Profilo senza quote XY non implementato; nessun DTM automatico. |
| **DTM / ACCURATEZZA** | Ground truth del percorso originale e precisione sul terreno DTM5/10m ancora HOLD; QA operatore Build302 e antecedenti separate. Quote GPX/KML conservate non attestano precisione topografica. |
| **LIMITI QUOTE** | GPX conserva quote valide e mancanti; KML3D solo con geometria interamente elevata, altrimenti 2D. Una sola quota si conserva ma non genera profilo/pendenza. Un punto importato spostato perde la propria quota originaria; assegnazioni equivalenti la conservano. |
| **SVILUPPO TELEFONO** | PAUSA fino a nuovo ordine dell'utente. Funzioni mobili preesistenti non disabilitate. |
| **ACCESSO / DEPLOY** | 15/11/2026: TMAR Desktop Commander Win su AsusDesktop e SSH `ionos-n8n-new` verificati. VPS `31.70.139.73` / tailnet `100.99.54.93`; [HTTPS GIS](https://ionos-n8n-new.tailc01234.ts.net/gis?v=5ffa64ff). Solo restart GIS; backup304 `/var/backups/goi-gis-runtime/20261115T171540Z-build305`. |
| **EVIDENCE** | [Handoff e rapporto305](orchestrator/evidence/2026-11-15-chat49-handoff-305/REPORT.md) · [QA LIVE tracce](orchestrator/evidence/2026-11-15-chat49-handoff-305/live-result.json) · [QA LIVE poligoni](orchestrator/evidence/2026-11-15-chat49-handoff-305/live-polygons-result.json) · [Deploy](orchestrator/evidence/2026-11-15-chat49-handoff-305/deploy-result.json) - [Chiusura 305](orchestrator/evidence/2026-11-15-chat49-handoff-305/OPERATOR-CLOSURE-305.md). |

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

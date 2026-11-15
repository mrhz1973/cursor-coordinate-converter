# FRONTIER — stato vivo

> Unica fonte canonica LIVE STATE. Non persistere HEAD remota qui. Storico solo on-demand.

| Campo | Valore |
| --- | --- |
| **WORKSTREAM ATTIVO** | Tracce desktop — quote importate, salvataggio e profilo altimetrico. |
| **WU ATTIVA** | — (bundle runtime a livello blocco) |
| **BLOCCO ATTIVO** | GIS-SAVED-TRACK-IMPORT-ELEVATION-SAVE-A |
| **STATO BLOCCO** | **Build305 LIVE**, deploy GIS-only e Automated Browser QA HTTPS nativa PASS scoped. Chiusura operatore ancora PENDING. |
| **GATE CORRENTE** | REVIEW GPT-SOSTITUTIVA tecnica PASS; browser candidato e LIVE: 49/49 controlli tracce + 16/16 poligono GIS, zero POST/eccezioni JS/errori console. QA FINALE CHATGPT — PENDING. Reviewer AI esterno formale NOT_PERFORMED/backstop post-hoc. |
| **RUNTIME LIVE** | Build305 — source `95080bac23a1642c1a2c6f8c0bdd4885b7bac960`; blob `e9b949cdb3d444128f70a6188122bf05fb715d09`; SHA-256 `5ffa64ff3ba9746de9a5463cc4adfc058ceb7de77e095aacdd51259e39d72464`; 11.170.887 byte, CR192, CRLF0. File VPS, HTTP interno, HTTPS e documenti nativi Edge concordi. |
| **RUNTIME CANDIDATE** | Nessun candidato successivo a Build305 verificato. Il candidato preliminare `2664bb1fc1f34732758e6fbf1668e25792744f7a` è superato dal source LIVE; non distribuirlo. |
| **ULTIMO BLOCCO CHIUSO** | GIS-MINIMIZED-HELP-TOOLS-ESCAPE-PRIORITY-D — Build297, PASS operatore 12/11/2026. Nessuna chiusura umana successiva dedotta da questo pass. |
| **NEXT** | QA operatore breve sulla Build305: Importa nella traccia corrente → «💾 Salva traccia in archivio…» nell'intestazione Punti → «Profilo» della riga salvata; verificare utilità/leggibilità sul proprio file. Nessun PASS umano automatico. Dopo il gate, riprendere la riorganizzazione dei comandi Tracce richiesta nella chat49. |
| **RICHIESTE CHAT49 ANCORA APERTE** | Distinguere Importa/Esporta della traccia corrente dai comandi Importa/Esporta della lista salvata. Il comando Esporta alto usa ancora la selezione dell'archivio. Profilo da soli punti XY senza quote non implementato da Build305; nessun DTM automatico. |
| **DTM / ACCURATEZZA** | Ground truth del percorso originale e precisione sul terreno DTM5/10m ancora HOLD; QA operatore Build302 e antecedenti separate. Quote GPX/KML conservate non attestano precisione topografica. |
| **LIMITI QUOTE** | GPX conserva quote valide e mancanti; KML3D solo con geometria interamente elevata, altrimenti 2D. Una sola quota si conserva ma non genera profilo/pendenza. Un punto importato spostato perde la propria quota originaria; assegnazioni equivalenti la conservano. |
| **SVILUPPO TELEFONO** | PAUSA fino a nuovo ordine dell'utente. Funzioni mobili preesistenti non disabilitate. |
| **ACCESSO / DEPLOY** | 15/11/2026: TMAR Desktop Commander Win su AsusDesktop e SSH `ionos-n8n-new` verificati. VPS `31.70.139.73` / tailnet `100.99.54.93`; [HTTPS GIS](https://ionos-n8n-new.tailc01234.ts.net/gis?v=5ffa64ff). Solo restart GIS; backup304 `/var/backups/goi-gis-runtime/20261115T171540Z-build305`. |
| **EVIDENCE** | [Handoff e rapporto305](orchestrator/evidence/2026-11-15-chat49-handoff-305/REPORT.md) · [QA LIVE tracce](orchestrator/evidence/2026-11-15-chat49-handoff-305/live-result.json) · [QA LIVE poligoni](orchestrator/evidence/2026-11-15-chat49-handoff-305/live-polygons-result.json) · [Deploy](orchestrator/evidence/2026-11-15-chat49-handoff-305/deploy-result.json). |

## Passaggio dalla chat49 — 15 novembre 2026

Il CORE BOOT iniziale riportava Build303 in FRONTIER; il successivo confronto del monolite e la verifica HTTPS/VPS hanno identificato **Build304 già LIVE**, source `938b2b3c601ae61b6c71cf806ae67119537af8aa`. Il profilo importato esistente non è stato riscritto. Build305 corregge conservazione della singola quota, salvataggio della traccia corrente e invalidazione della quota del punto spostato.

Le prove consumate delle build precedenti non sono state ripetute. Questo pass ha usato fixture sintetiche in profili Edge temporanei, senza dati del browser personale, file GPX privati, GPS o nuove chiamate a provider. I tentativi incompleti e il candidato inizialmente fallito restano nel dossier.

## Storico e fonti on-demand

- [Checkpoint precedenti, preservati senza modifiche](FRONTIER_HISTORY_20261115.md).
- [Build303 — conservazione quote e QA storica](orchestrator/evidence/2026-11-15-gpx-elevation-303/REPORT.md).
- [Build302 — DTM bidirezionale e limiti](orchestrator/evidence/2026-11-14-local-dtm-direction-302/REPORT.md).
- [Ultimo rapporto completo](runtime/LAST_CURSOR_REPORT.md), evidenza; questa tabella prevale.

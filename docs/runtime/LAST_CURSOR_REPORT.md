# P0 — quattro backup verificati, confronto completo, residui parziali

Data: 21/11/2026 04:26 Europe/Rome. FRONTIER è l’unica LIVE STATE.
BLOCK: GIS-HTTP-ORIGIN-INVENTORY-P0; audit non distruttivo, nessun bundle runtime.
GATE: P0 APERTO / FOUR_SCOPED_BACKUPS_VERIFIED / COMPARISON_COMPLETE / RESIDUALS_PARTIAL / ORIGIN_BACKUP_PENDING.
NEXT: Decisione sul trattamento dei dati HTTP distinti nelle copie confrontate; prima di qualsiasi azione sui dati verificare stato attuale e copertura residua. Migrazione e pulizia non autorizzate. Nessun ulteriore copia/incolla richiesto.
RUNTIME LIVE: Build317 source aff215323c97a309cbd5c6c7e0c694d35dd45ad0, blob 4578788467822123ea7ad7e929d3bdf0e262b1a8, SHA256 ed760bbd704db0e925f8af7f52a7880d9cffda4be2e2f0af9a2044c9cdf56fec; P3 CLOSED con PASS operatore del 19/11 già acquisito.
CANDIDATE: nessun nuovo candidato runtime.
RESULT: nuova copia IndexedDB HTTPS VERIFIED; quattro backup logici distinti confrontati sul PC, risultato COMPARED. Inventario residui acquisito per metadati con copertura PARTIAL. Payload personali rimasti sul PC.
WORKING TREE: pulito sul commit task prima dell’autosync; verifica pubblicazione autosync EXTERNAL_ONLY.
EVIDENCE: [Rapporto P0](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md), [ricevuta HTTPS IDB](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/https-indexeddb-verification.json), [confronto nativo](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/origin-comparison.json), [metadati e residui](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/inventory-metadata.json).

## Riepilogo completo

1. **Mandato e fonte di verità.** L’operatore ha richiesto «usa il computer e fallo tu». origin/main riconfermato dbe1cfbe2e10398004b00dcabe9c5badd4c1d61a; CORE BOOT/metodo già acquisiti, WU N/A. Nessun nuovo boot esteso, sviluppo runtime o ripetizione delle QA consumate.

2. **Download precedente chiarito e operazione diretta sul PC.** TMAR ha consentito l’uso di Edge tramite Windows UIAutomation e Win32, senza elevazione, modifica protezioni, riavvio o clipboard. La voce esatta del download 20261120T165609715Z risultava «Rimossi»; questo risolve il gate di disponibilità, senza attribuire un PASS retroattivo né una causa o un autore alla rimozione. Nuova scheda HTTPS neutra, console e stesso exporter qualificato. Inserimento finale confrontato integralmente prima di Enter; gli inserimenti non confermati non sono stati eseguiti. Il nuovo download era in attesa di «Salva»: conferma visiva eseguita, file definitivo presente e .crdownload assente. Chiuse soltanto le due schede neutre create per i controlli, conteggio 5→4→3; tre schede preesistenti preservate.

3. **Nuovo backup HTTPS IndexedDB VERIFIED.** Snapshot 21/11/2026 02:53:25.362 UTC, verifica nativa 02:58:10.144 UTC con il verifier qualificato invariato. File TMAR-GIS-P0-HTTPS-IndexedDB-20261121T025325362Z.json, 10.695.152 byte, SHA256 18edc0d33596f52b0dcbccfe927c3323fbfc022c96446d9d2e7a123e7918ee7a. Schema, 315 record, 7.984.081 byte binari, hash di tutti i binari e copia riletta byte per byte PASS. Ricevuta SHA256 275f1ba91ceb0243452c8bcf3b6c8ccc3e839691c1649faeecf584253d31802c. Local Storage HTTP/HTTPS e IndexedDB HTTP precedenti mantenuti; quattro snapshot separati, non atomici.

4. **Confronto locale completato.** Helper con hash 2b52af8981bcc76927a2129faea8daceeb539f38222930633afde94222a56f3a; quattro copie e relative ricevute vincolate agli hash canonici e rilette in sola lettura. Risultato COMPARED alle 03:10:33.587 UTC, controlli integrità/stabilità tutti true. Due chiavi Local Storage per origine, entrambe raw diverse; oggetti principali con 14 proprietà, 8 comuni identiche e 6 differenti. Tracce salvate 1 HTTP/5 HTTPS senza occorrenze strutturali esatte comuni; waypoint 200/0, aree nominate 1/0, cronologia 3/0. IndexedDB 1.028/315 record, unione 1.343 chiavi e zero chiavi comuni. Si tratta di confronto strutturale delle copie: identità funzionale, equivalenza geografica e contenuto browser corrente non attestati. Nessuna equivalenza dei binari dedotta tra chiavi tile diverse.

5. **Residui e limiti.** Sonda di catalogo eseguita su pagine neutre alle 03:08 UTC HTTPS e 03:09:51 UTC HTTP. Entrambe: due chiavi LS e un DB atteso v1. HTTPS: Cache Storage zero, Service Worker zero e pagina non controllata; HTTP: API non disponibili, conteggi null. Session Storage zero limitato alle nuove schede; cookie visibili zero limitati al percorso, esclusi HttpOnly e altri percorsi. OPFS, filesystem legacy e WebSQL NOT_INSPECTED/null; disponibilità API non interpretata come presenza o assenza di dati. Cataloghi recenti non attestano immutabilità dei valori rispetto agli export. Backup completo origine ancora non attestato.

6. **Qualificazione ed evidenza di esecuzione.** Solo verifiche nuove: comparator 3 gruppi sintetici/30 asserzioni PASS; sonda 4 gruppi PASS; nuovo ramo di generazione sonda 5 asserzioni PASS. Review indipendenti di helper, delta di integrazione, ricevute/confronto e documentazione PASS; nessun test precedente ripetuto. Il comparator ha emesso il risultato completo dopo tutti i controlli e la chiusura degli input. Il trasporto non ha attestato l’exit code Node; nessun Node osservato tra i figli, solo wrapper PowerShell rimasto attivo e chiuso con guard dopo il risultato, causa non determinata. Nessuna riesecuzione del confronto. Finding di metodo sui payload documentali troppo ampi registrati, con recuperi ristretti e senza dati GIS pubblicati.

7. **Commit e pubblicazione.** Task 95f95871c5490a403e7be6b442fb9332b618f396, esattamente sei file docs: FRONTIER, REPORT, metadata, ricevuta HTTPS IDB, helper di confronto e risultato. Runtime blob invariato, scope e diff check PASS. Primo avvio del wrapper di trasporto node -e fermato da errore di quoting prima dell’esecuzione del publisher; ripresa mediante file wrapper con bytes/hash controllati. Stesso commit/tree pubblicato dal Git Windows autorizzato con push normale; HEAD locale, tracking e ls-remote concordi, working tree pulito. Nessun deploy, force push o nuova QA runtime.

8. **Gate effettivo.** Decisione sul trattamento dei dati HTTP distinti nelle copie confrontate; prima di qualsiasi azione sui dati verificare stato attuale e copertura residua. Migrazione e pulizia non autorizzate. Nessun ulteriore copia/incolla richiesto. HTTP conserva dati da valutare e preservare; nessuna deduplicazione o migrazione è autorizzata dai soli conteggi o dall’overlap strutturale. P1/P2/P3 CLOSED, Build317 invariata, DTM5/10m HOLD, mobile PAUSA, P4 FUTURO. Autosync limitato a rolling report/latest/un inbox, senza terzo finalize commit.

## Autosync e identità F3

real_task_commit: 95f95871c5490a403e7be6b442fb9332b618f396
RUNTIME_CANDIDATE_SHA: N/A (nessun nuovo candidato)
RUNTIME_LIVE_SOURCE: aff215323c97a309cbd5c6c7e0c694d35dd45ad0
REMOTE_HEAD_AT_EVIDENCE_TIME: 95f95871c5490a403e7be6b442fb9332b618f396
current_report_container: PENDING_SELF_REFERENCE
Autosync publication verification: EXTERNAL_ONLY
Autosync files: docs/runtime/LAST_CURSOR_REPORT.md; docs/orchestrator/latest.md; docs/orchestrator/inbox/2026-11-21_0426_p0-four-backups-comparison.md.

## Diff task pubblicato

```text
 docs/FRONTIER.md                                   |  22 +-
 .../2026-11-19-http-origin-p0-inventory/REPORT.md  |  72 ++-
 .../compare-origin-backups.cjs                     | 553 ++++++++++++++++++
 .../https-indexeddb-verification.json              |  37 ++
 .../inventory-metadata.json                        | 645 ++++++++++++++++++++-
 .../origin-comparison.json                         | 362 ++++++++++++
 6 files changed, 1655 insertions(+), 36 deletions(-)
```

## Output Git verbatim pre-container

```text
$ git log --oneline -5
95f9587 docs: verify HTTPS backup and compare P0 origin snapshots
dbe1cfb docs(gis): autosync HTTPS source lookup gate
212f549 docs(gis): record HTTPS source lookup gate after TMAR recovery
72e99cc docs(gis): autosync verified HTTPS localStorage and IndexedDB gate
c1a5dcf docs(gis): verify HTTPS localStorage backup and prepare IndexedDB gate
$ git rev-parse HEAD
95f95871c5490a403e7be6b442fb9332b618f396
$ git rev-parse origin/main
95f95871c5490a403e7be6b442fb9332b618f396
$ git branch --show-current
main
$ git ls-remote origin refs/heads/main
95f95871c5490a403e7be6b442fb9332b618f396	refs/heads/main
$ git status --porcelain=v1
```

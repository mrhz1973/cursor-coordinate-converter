# P0 — TMAR ripristinato; sorgente IndexedDB HTTPS da localizzare

BLOCK: GIS-HTTP-ORIGIN-INVENTORY-P0; audit non distruttivo, nessun bundle runtime.
GATE: HTTPS_IDB_DOWNLOAD_DECLARED / SOURCE_FILE_NOT_LOCATED / ORIGIN_BACKUP_PENDING.
NEXT: nel browser usato per l’export, individuare la voce del download con Ctrl+J e fornire percorso locale esatto oppure stato del download. Riprendere poi il verifier qualificato sulla sorgente individuata; chiarire disponibilità/percorso prima di un nuovo export.
RUNTIME LIVE: Build317 source aff215323c97a309cbd5c6c7e0c694d35dd45ad0, blob 4578788467822123ea7ad7e929d3bdf0e262b1a8, SHA256 ed760bbd704db0e925f8af7f52a7880d9cffda4be2e2f0af9a2044c9cdf56fec; P3 CLOSED con PASS operatore acquisito.
CANDIDATE: nessun nuovo candidato runtime.
RESULT: TMAR risponde su ASUSDESKTOP. Verifica HTTPS IDB STOP a SOURCE_READ; nessuna verifica del file/copia attestata. Tre backup logici precedenti restano evidenze acquisite nei rispettivi perimetri.
WORKING TREE: pulito sul commit task prima dell’autosync; pubblicazione finale EXTERNAL_ONLY.
EVIDENCE: [Rapporto P0](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md), [ricevuta del blocco](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/https-indexeddb-verification-blocked.json), [metadati](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/inventory-metadata.json).

## Riepilogo completo

1. **Mandato e refresh minimo.** L’operatore ha richiesto di riprovare con TMAR Desktop Commander. origin/main riconfermato 72e99cce935ce71d1a63d9f537281fffa86084fd; CORE BOOT/metodo già acquisiti, WU N/A. Nessuna nuova lettura estesa, sviluppo runtime o ripetizione delle prove consumate.

2. **Evidenza browser acquisita, file non verificato.** Il 20/11/2026 alle 16:56:09.715 UTC l’helper HTTPS ha dichiarato DOWNLOAD_AVVIATO per TMAR-GIS-P0-HTTPS-IndexedDB-20261120T165609715Z.json: 315 tile, 7.984.081 byte binari, 10.695.152 byte file, SHA256 b9e23683f3b33683586843e72ac27d1c82638d2bf630971d1816a9927ae48211. Sono metadati riferiti dall’operatore, senza verifica del file o della copia. Lo storico comprende il precedente STOP nell’origine HTTP e l’interruzione TMAR Session terminated, con esecuzione/copia allora non determinate.

3. **Ripristino e tentativo reale.** Il 21/11/2026 alle 02:28:21.0695286 UTC la sonda readonly TMAR ha risposto da ASUSDESKTOP. Verifier HTTPS qualificato, hash bc5d8a5fb2ed4e5076645af412aaa5ad34240e21bf9026c64f6daca50246a147, riutilizzato senza test aggiuntivi. Esito STOP / SOURCE_READ / LOCAL_OPERATION_FAILED. Questo non è un giudizio negativo sui contenuti e non attesta quanto della sorgente sia stato letto. Nessun payload GIS restituito, nessuna scrittura sorgente o copia verificata.

4. **Diagnostica circoscritta.** Cartella attesa e Windows Known Folder Download coincidono con C:/Users/mrhz/Downloads. Nessun nome col prefisso/timestamp atteso, comprese eventuali collisioni e suffissi .crdownload nominati; temporanei generici Unconfirmed non enumerati. Le Preferences dei profili Default individuati tramite metadati Edge/Chrome sono ACCESS_DENIED, quindi percorsi alternativi non acquisiti. File e verification.json nei soli due percorsi del backup previsto risultano ABSENT. Non dedurre cancellazione, assenza in altre posizioni o completamento del download. Nessuna scansione ampia, lettura cronologia, modifica permessi, riavvio browser o nuova esportazione.

5. **Documentazione e review.** Task 212f54954da84e3620395527d3dd9a8edec571ae, 4 file docs: FRONTIER, rapporto, metadati e ricevuta del gate. Corretta in review la formulazione sulla lettura: il solo STOP SOURCE_READ non dimostra zero byte letti; resta attestato che nessun payload è stato restituito. Review indipendente receipt/FRONTIER PASS; scope e diff check PASS, runtime blob invariato.

6. **Pubblicazione e autosync.** Stesso commit importato e pubblicato dal Git Windows autorizzato con controllo del tree e push normale; HEAD locale/tracking/ls-remote concordi e working tree pulito. Nessun deploy, nuova QA runtime o force push. Autosync limitato a rolling report/latest/un inbox; current_report_container PENDING_SELF_REFERENCE e verifica finale EXTERNAL_ONLY, senza terzo finalize commit.

7. **Gate effettivo e limiti.** Serve soltanto il percorso locale esatto o lo stato della voce nella lista download del browser dell’operatore. Una sorgente disponibile permetterà di riprendere la verifica qualificata senza riesportare; un eventuale download non completato sarà trattato secondo l’esito reale. Tre precedenti acquisizioni restano distinte e non atomiche; backup origine completo e confronto contenuti non attestati. Contenitori residui e confronto seguono questo gate. Nessuna migrazione/pulizia; P1/P2/P3 CLOSED, DTM5/10m HOLD, mobile PAUSA, P4 FUTURO.

## Autosync e identità F3

real_task_commit: 212f54954da84e3620395527d3dd9a8edec571ae
RUNTIME_CANDIDATE_SHA: N/A (nessun nuovo candidato)
RUNTIME_LIVE_SOURCE: aff215323c97a309cbd5c6c7e0c694d35dd45ad0
REMOTE_HEAD_AT_EVIDENCE_TIME: 212f54954da84e3620395527d3dd9a8edec571ae
current_report_container: PENDING_SELF_REFERENCE
Autosync publication verification: EXTERNAL_ONLY
Autosync files: docs/runtime/LAST_CURSOR_REPORT.md; docs/orchestrator/latest.md; docs/orchestrator/inbox/2026-11-21_0336_p0-https-idb-source-blocked.md.

## Diff task pubblicato

```text
212f549 docs(gis): record HTTPS source lookup gate after TMAR recovery
 docs/FRONTIER.md                                   | 18 +++--
 .../2026-11-19-http-origin-p0-inventory/REPORT.md  | 22 ++++--
 .../https-indexeddb-verification-blocked.json      | 78 +++++++++++++++++++
 .../inventory-metadata.json                        | 89 ++++++++++++++++++++--
 4 files changed, 186 insertions(+), 21 deletions(-)
```

## Output Git verbatim pre-container

```text
$ git log --oneline -5
212f549 docs(gis): record HTTPS source lookup gate after TMAR recovery
72e99cc docs(gis): autosync verified HTTPS localStorage and IndexedDB gate
c1a5dcf docs(gis): verify HTTPS localStorage backup and prepare IndexedDB gate
708ef47 docs(gis): autosync verified HTTP IndexedDB and HTTPS gate
338ab66 docs(gis): verify HTTP IndexedDB backup and prepare HTTPS inventory

$ git rev-parse HEAD
212f54954da84e3620395527d3dd9a8edec571ae

$ git rev-parse origin/main
212f54954da84e3620395527d3dd9a8edec571ae

$ git branch --show-current
main

$ git ls-remote origin refs/heads/main
212f54954da84e3620395527d3dd9a8edec571ae	refs/heads/main

$ git status --short

```

## Stato fresco pre-container

Data: 21/11/2026 03:36 Europe/Rome.
origin/main HEAD: 212f54954da84e3620395527d3dd9a8edec571ae
working tree: pulito prima di questo autosync.
ultimo blocco PASS operatore: GIS-SAVED-TRACK-PARTIAL-ALTITUDE-FILL-A / Build317 CLOSED.
blocco corrente: GIS-HTTP-ORIGIN-INVENTORY-P0 / HTTPS_IDB_DOWNLOAD_DECLARED / SOURCE_FILE_NOT_LOCATED / ORIGIN_BACKUP_PENDING.
prossimo candidato runtime: nessuno.
pubblicazione finale contenitore: EXTERNAL_ONLY.

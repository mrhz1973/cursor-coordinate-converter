# P0 — catalogo IndexedDB HTTP acquisito; export pronto

BLOCK: GIS-HTTP-ORIGIN-INVENTORY-P0; audit non distruttivo, nessun bundle runtime.
GATE: HTTP_LOCALSTORAGE_VERIFIED / IDB_EXPORT_READY / ORIGIN_BACKUP_PENDING. Catalogo IDB riferito dall’operatore; helper qualificati su fixture. Contenuti/schema personali e backup IDB non acquisiti.
NEXT: eseguire il comando preparato nella Console HTTP; TMAR verifica poi file/copia e hash binari. Seguono contenitori residui, HTTPS e confronto. Migrazione/pulizia bloccate.
RUNTIME LIVE: Build317 source aff215323c97a309cbd5c6c7e0c694d35dd45ad0, blob 4578788467822123ea7ad7e929d3bdf0e262b1a8, SHA256 ed760bbd704db0e925f8af7f52a7880d9cffda4be2e2f0af9a2044c9cdf56fec; P3 CLOSED con PASS operatore acquisito.
CANDIDATE: nessun nuovo candidato runtime.
RESULT: comando IDB pronto, esecuzione personale NOT_PERFORMED/download NOT_STARTED; Local Storage HTTP già verificato.
WORKING TREE: pulito sul commit task prima dell’autosync; pubblicazione finale EXTERNAL_ONLY.
EVIDENCE: [Rapporto P0](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md), [comando](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/export-indexeddb.console.js), [verifiche](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/indexeddb-helper-validation.json).

## Riepilogo completo

1. **Mandato e fonte viva.** Prosecuzione P0 autorizzata con «vai avanti», dopo chiarimento sulle capacità TMAR. origin/main verificato a03d7bec53b3f426bdbe555342855f80a5b28ac0e; metodo/bootstrap già acquisiti, WU N/A. Local Storage HTTP e copia verificati nel pass precedente, nessuna loro ripetizione. Build317 invariata, nessuna nuova QA runtime.

2. **Catalogo IDB acquisito.** L’operatore riferisce ELENCO_DATABASE_OK con acquisitoUTC2026-11-20T03:22:30.769Z: origineHTTP attesa, unico DB CoordConvMapTiles v1, altriDB0, aperture0. È un timestamp di acquisizione, non l’ora di ricezione. Non attesta schema degli store, conteggio record, byte, integrità o backup personale. GET con URL redatti non interpretati come inventario delle tile.

3. **Limite di automazione osservato.** TMAR espone25 strumenti file/processi e nessun comando dedicato schede/UI. Browser personale senza connessione utilizzabile; lettura dei file profilo già negata. Probe nuovo:22 processi Edge,0 commandline ispezionabili; debugging esistente NOT_DETERMINED, senza dedurne l’assenza. Nessun riavvio, elevazione, modifica permessi o protezioni. È possibile verificare file via TMAR e avviare fixture isolate, ma non assumere accesso alla scheda personale.

4. **Comando unico preparato.** Per ridurre gli interventi operatore, schema/count e copia binaria sono nello stesso comando. Guard origine e catalogo corrente, apertura v1 esplicita, upgrade/creazione intercettati e abortiti, late success chiuso dopo timeout, versionchange/close anomalo STOP. Solo schema unico tiles/keyPathnull/autoIncrementfalse/nessunindice; valore esatto b:ArrayBuffer/ct:string e chiave stringa. Count+cursor readonly, successo solo oncomplete con cursore finito e conteggi coincidenti; connessione chiusa prima del file. Raw preservato con Base64, lunghezza/hash per binario e SHA globale sui bytes del Blob. Limiti150.000record/64MiBbinari/4MiBtestoUTF16/60s provocano STOP, nessuna omissione. Copertura INDEXEDDB_TILES_ONLY.

5. **Qualificazione nuova, solo sintetica.** Review statiche indipendenti exporter/verifier PASS. Verifier14 controlli sintetici PASS (binari/Unicode, hash, base64 canonico, duplicati, schemi, conflitti copia/receipt, vuoto e limite testuale). Harness separato Node/CDP con Edge headless temporaneo e documento intercettato localmente:4 casi PASS, inclusa integrazione exporter/verifier su4 tile e65.593byte, source preservata; schema inatteso; valore inatteso; cancellazione simulata fra catalogo/apertura, upgrade abortito senza DB ricreato. Nessun runtime GIS/profilo personale, zero richieste documento inoltrate. SHA preesistente copiata identica; non ripetute le sue prove.

6. **Consegna locale e documentazione.** Preparato C:\Users\mrhz\AppData\Local\TMAR-GIS\P0-Aiuto-20261120\P0-HTTP-IDB-Comando.txt:9794byte, SHA25611b29c29b073d3943a633848c98e7165278fb0e984399bc7311b61e7bd3f8826, reread identica. Contiene codice, non dati GIS; preparazione non equivale a esecuzione. Task 2c1cba3b96e01ed964c02231e374dbbee1b4422e:6 file docs (FRONTIER/rapporto/metadati/exporter/verifier/validation). Finding documentale sul timestamp corretto; review finale PASS e diff check PASS. Runtime blob invariato.

7. **Pubblicazione e gate.** Il primo trasporto del task è stato fermato dal controllo locale di lunghezza prima di chiamare il PC; stesso commit poi trasferito a pezzi con lunghezza e SHA verificati, importato dal Git Windows autorizzato e pubblicato con push normale/remote PASS. Nessun nuovo commit sostitutivo o force push. Autosync corrente solo rolling report/latest/un inbox, container PENDING_SELF_REFERENCE/EXTERNAL_ONLY. Gate effettivo: esecuzione operatore nella Console HTTP e ricevuta metadata; poi verifica privata del download/copia con TMAR. Dati IDB personali NOT_ACQUIRED, HTTPS e confronto pending. Nessuna migrazione/pulizia, HTTP tecnico conservato; P1/P2/P3 CLOSED, DTM HOLD, mobile PAUSA, P4 FUTURO.

## Autosync e identità F3

real_task_commit: 2c1cba3b96e01ed964c02231e374dbbee1b4422e
RUNTIME_CANDIDATE_SHA: N/A (nessun nuovo candidato)
RUNTIME_LIVE_SOURCE: aff215323c97a309cbd5c6c7e0c694d35dd45ad0
REMOTE_HEAD_AT_EVIDENCE_TIME: 2c1cba3b96e01ed964c02231e374dbbee1b4422e
current_report_container: PENDING_SELF_REFERENCE
Autosync publication verification: EXTERNAL_ONLY
Autosync files: docs/runtime/LAST_CURSOR_REPORT.md; docs/orchestrator/latest.md; docs/orchestrator/inbox/2026-11-20_0525_p0-idb-export-ready.md.

## Diff task pubblicato

```text
2c1cba3 docs(gis): prepare verified IndexedDB export after HTTP catalog
 docs/FRONTIER.md                                   |  18 +-
 .../2026-11-19-http-origin-p0-inventory/REPORT.md  |  34 +++-
 .../export-indexeddb.console.js                    | 198 +++++++++++++++++++++
 .../indexeddb-helper-validation.json               |  72 ++++++++
 .../inventory-metadata.json                        |  74 +++++++-
 .../verify-indexeddb-backup.cjs                    | 106 +++++++++++
 6 files changed, 487 insertions(+), 15 deletions(-)
```

## Output Git verbatim pre-container

```text
$ git log --oneline -5
2c1cba3 docs(gis): prepare verified IndexedDB export after HTTP catalog
03d7bec docs(gis): autosync verified HTTP storage backup
a613317 docs(gis): verify HTTP localStorage backup and advance P0 gate
ce4908e docs(gis): autosync P0 HTTP storage read and backup gate
a703da6 docs(gis): record HTTP storage inventory and prepare local backup

$ git rev-parse HEAD
2c1cba3b96e01ed964c02231e374dbbee1b4422e

$ git rev-parse origin/main
2c1cba3b96e01ed964c02231e374dbbee1b4422e

$ git branch --show-current
main

$ git ls-remote origin refs/heads/main
2c1cba3b96e01ed964c02231e374dbbee1b4422e	refs/heads/main

$ git status --short

```

## Stato fresco pre-container

Data: 20/11/2026 05:25 Europe/Rome.
origin/main HEAD: 2c1cba3b96e01ed964c02231e374dbbee1b4422e
working tree: pulito prima di questo autosync.
ultimo blocco PASS operatore: GIS-SAVED-TRACK-PARTIAL-ALTITUDE-FILL-A / Build317 CLOSED.
blocco corrente: GIS-HTTP-ORIGIN-INVENTORY-P0 / IDB_EXPORT_READY, origine completa e confronto PENDING.
prossimo candidato runtime: nessuno.
pubblicazione finale contenitore: EXTERNAL_ONLY.

# P0 — backup HTTP verificati; acquisizione HTTPS pronta

BLOCK: GIS-HTTP-ORIGIN-INVENTORY-P0; audit non distruttivo, nessun bundle runtime.
GATE: HTTP_LOCALSTORAGE_AND_IDB_VERIFIED / HTTPS_INVENTORY_PENDING / ORIGIN_BACKUP_PENDING.
NEXT: nella nuova scheda HTTPS neutra, operatore esegue il comando Local Storage preparato; TMAR verifica poi download e copia. Seguono IndexedDB HTTPS, contenitori residui e confronto. Migrazione/pulizia ancora bloccate.
RUNTIME LIVE: Build317 source aff215323c97a309cbd5c6c7e0c694d35dd45ad0, blob 4578788467822123ea7ad7e929d3bdf0e262b1a8, SHA256 ed760bbd704db0e925f8af7f52a7880d9cffda4be2e2f0af9a2044c9cdf56fec; P3 CLOSED con PASS operatore acquisito.
CANDIDATE: nessun nuovo candidato runtime.
RESULT: IndexedDB HTTP acquisito e verificato; Local Storage HTTP già verificato. Sono snapshot distinti, non un backup atomico/completo dell’origine. HTTPS personale NOT_PERFORMED.
WORKING TREE: pulito sul commit task prima dell’autosync; pubblicazione finale EXTERNAL_ONLY.
EVIDENCE: [Rapporto P0](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md), [ricevuta IDB](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/http-indexeddb-verification.json), [metadati e verifiche HTTPS](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/inventory-metadata.json).

## Riepilogo completo

1. **Mandato e fonte viva.** Prosecuzione P0 già autorizzata; ricevuto allegato con il risultato del comando HTTP IndexedDB. origin/main riconfermato 393b15a6a738a76309eb590efe8dd43488d091fa prima del task. CORE BOOT/metodo già acquisiti, WU N/A; nessuna nuova lettura estesa. Esecuzione dell’orchestratore tramite TMAR, senza assumere un pass Cursor o un accesso al browser personale non attestati.

2. **Verifica reale IDB HTTP.** Il download del 20/11/2026 alle 11:34:39.385 UTC contiene 1.028 record di CoordConvMapTiles v1, store tiles: 16.012.203 byte binari, JSON da 21.511.025 byte. SHA256 globale a1f72fd84a9f7f49cb0e0e9cbc023e813841388192f5ccda56b2b34d81919056. Verificatore qualificato eseguito sul PC: file stabile/completo, schema, chiavi univoche, Base64 canonico, SHA di ogni binario e totali PASS; copia non sovrascrivente riletta identica byte per byte. Ricevuta verificata alle 11:39:51.041 UTC, SHA256 e7be9711dd3d3d5d4c9357017486c8a57e31efdada6f47924403af378ffe2a11. Dati privati rimasti sul PC; nel repository solo ricevuta metadata. Nessun test del vecchio helper ripetuto.

3. **Perimetro e consistenza temporale.** INDEXEDDB_TILES_ONLY si aggiunge al LOCALSTORAGE_ONLY del precedente snapshot HTTP delle 02:21:03.176 UTC. I due snapshot sono separati da ore: atomicità e assenza di modifiche successive non attestate. Backup completo origine false; HTTPS e confronto NOT_PERFORMED. Il precedente tentativo fisico ACCESS_DENIED resta storico con zero sorgenti copiate. Nessun dato cancellato o migrato.

4. **Preparazione HTTPS.** Exporter e verifier derivano dai qualificati HTTP con soli delta di origine/filename, ammissione zero chiavi e main assente. Conservano tutte le coppie raw, doppia lettura, hash, copia esclusiva e ricevuta. Main assente resta distinto da raccolte vuote: conteggi null/ABSENT. Review statica indipendente PASS; 3 gruppi exporter e 3 gruppi verifier mirati PASS su fixture. SHA preesistente invariata e prove consumate non ripetute. Comando PC P0-HTTPS-LocalStorage-Comando.txt, 4.173 byte, SHA256 0b22d441474a38fe23df61315ad737cf0e0239f161daa5bb04af9a44ed808910, preparato e verificato; browser execution NOT_PERFORMED. Nessuna nuova QA runtime.

5. **Pagina per l’acquisizione.** GET nativo mirato a https://ionos-n8n-new.tailc01234.ts.net/gis/__tmar_p0_inventory__: 404 application/json, 45 byte, nessun redirect/script/risorsa/Set-Cookie/Clear-Site-Data. Risposta server attestata, senza modifiche VPS. Primo output perso per troncamento e non usato; un recupero mirato con output limitato e ricevuta salvata ha prodotto l’evidenza. Il contesto del browser personale rimane distinto: nuova scheda dello stesso browser/profilo, 404 atteso; se compare GIS o altro avviso, STOP. Guard dell’exporter sull’origine HTTPS esatta; eventuali residui Service Worker non esclusi.

6. **Pubblicazione.** Task 338ab66cc3e36f00308446b577062e72a5d0c23f: 6 file docs, ricevuta reale più due helper HTTPS e aggiornamento FRONTIER/rapporto/metadati. Review receipt/FRONTIER e delta helper PASS; scope e diff check PASS, runtime blob invariato. Trasporto in tre parti con lunghezze/SHA verificati, importazione dello stesso commit dal Git Windows autorizzato e push normale. HEAD locale/tracking/ls-remote concordi, working tree pulito. Nessun force push, deploy, riavvio o modifica protezioni.

7. **Gate effettivo.** TMAR gestisce file e processi; accesso alla Console personale ancora non disponibile. Serve l’esecuzione operatore del singolo comando già predisposto, seguita dalla sola ricevuta metadata/STOP; il file resta locale e sarà verificato da TMAR. Dopo HTTPS Local Storage: IndexedDB HTTPS, contenitori residui e confronto; prima di azioni sui dati anche verifica delle variazioni successive agli snapshot. P1/P2/P3 CLOSED, DTM5/10m HOLD, mobile PAUSA, P4 FUTURO.

## Autosync e identità F3

real_task_commit: 338ab66cc3e36f00308446b577062e72a5d0c23f
RUNTIME_CANDIDATE_SHA: N/A (nessun nuovo candidato)
RUNTIME_LIVE_SOURCE: aff215323c97a309cbd5c6c7e0c694d35dd45ad0
REMOTE_HEAD_AT_EVIDENCE_TIME: 338ab66cc3e36f00308446b577062e72a5d0c23f
current_report_container: PENDING_SELF_REFERENCE
Autosync publication verification: EXTERNAL_ONLY
Autosync files: docs/runtime/LAST_CURSOR_REPORT.md; docs/orchestrator/latest.md; docs/orchestrator/inbox/2026-11-20_1251_p0-http-idb-verified.md.

## Diff task pubblicato

```text
338ab66 docs(gis): verify HTTP IndexedDB backup and prepare HTTPS inventory
 docs/FRONTIER.md                                   |  18 ++-
 .../2026-11-19-http-origin-p0-inventory/REPORT.md  |  32 ++++-
 .../export-https-localstorage.console.js           |  89 ++++++++++++
 .../http-indexeddb-verification.json               |  37 +++++
 .../inventory-metadata.json                        | 150 +++++++++++++++++++--
 .../verify-https-localstorage-backup.cjs           |  68 ++++++++++
 6 files changed, 372 insertions(+), 22 deletions(-)
```

## Output Git verbatim pre-container

```text
$ git log --oneline -5
338ab66 docs(gis): verify HTTP IndexedDB backup and prepare HTTPS inventory
393b15a docs(gis): autosync qualified IndexedDB export gate
2c1cba3 docs(gis): prepare verified IndexedDB export after HTTP catalog
03d7bec docs(gis): autosync verified HTTP storage backup
a613317 docs(gis): verify HTTP localStorage backup and advance P0 gate

$ git rev-parse HEAD
338ab66cc3e36f00308446b577062e72a5d0c23f

$ git rev-parse origin/main
338ab66cc3e36f00308446b577062e72a5d0c23f

$ git branch --show-current
main

$ git ls-remote origin refs/heads/main
338ab66cc3e36f00308446b577062e72a5d0c23f	refs/heads/main

$ git status --short

```

## Stato fresco pre-container

Data: 20/11/2026 12:51 Europe/Rome.
origin/main HEAD: 338ab66cc3e36f00308446b577062e72a5d0c23f
working tree: pulito prima di questo autosync.
ultimo blocco PASS operatore: GIS-SAVED-TRACK-PARTIAL-ALTITUDE-FILL-A / Build317 CLOSED.
blocco corrente: GIS-HTTP-ORIGIN-INVENTORY-P0 / HTTP_LOCALSTORAGE_AND_IDB_VERIFIED / HTTPS_INVENTORY_PENDING / ORIGIN_BACKUP_PENDING.
prossimo candidato runtime: nessuno.
pubblicazione finale contenitore: EXTERNAL_ONLY.

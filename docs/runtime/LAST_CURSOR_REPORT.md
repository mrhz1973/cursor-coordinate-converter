# P0 — backup Local Storage HTTP verificato; gate IndexedDB

BLOCK: GIS-HTTP-ORIGIN-INVENTORY-P0; audit non distruttivo, nessun bundle runtime.
GATE: HTTP_LOCALSTORAGE_VERIFIED / ORIGIN_BACKUP_PENDING. PASS circoscritto al file e alla copia locale Local Storage HTTP; backup completo dell’origine e confronto HTTPS non acquisiti.
NEXT: enumerare il catalogo IndexedDB HTTP senza aprire/creare database; poi acquisire/verificare contenitori residui e HTTPS, infine confronto. Migrazione/pulizia bloccate.
RUNTIME LIVE: Build317 source aff215323c97a309cbd5c6c7e0c694d35dd45ad0, blob 4578788467822123ea7ad7e929d3bdf0e262b1a8, SHA256 ed760bbd704db0e925f8af7f52a7880d9cffda4be2e2f0af9a2044c9cdf56fec; P3 CLOSED con PASS operatore già acquisito.
CANDIDATE: nessun nuovo candidato runtime.
RESULT: file e copia Local Storage HTTP VERIFIED; completeOriginBackup:false, HTTP/HTTPS comparison NOT_PERFORMED.
WORKING TREE: pulito sul commit task prima dell’autosync; pubblicazione finale EXTERNAL_ONLY.
EVIDENCE: [Rapporto](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md) e [ricevuta metadata](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/http-localstorage-verification.json).

## Riepilogo completo

1. **Mandato e fonte viva.** Prosecuzione del P0 già autorizzato. origin/main verificato a ce4908ea534e43f1920778bf74821ca0298e5ee5; bootstrap/metodo già acquisiti, WU N/A. Il runtime Build317 e le prove consumate restano invariati. Il gate iniziale richiedeva il download Local Storage HTTP e la verifica del file reale.

2. **Ricevuta operatore e warning.** Export già revisionato eseguito dall’operatore nella scheda HTTP. Nome TMAR-GIS-P0-HTTP-localStorage-20261120T022103176Z.json; 36.618 byte; 2 chiavi; SHA256 7811e2250e1b18e9651f0cd4467b79eb5a4f0511c8fc1e1602f144081db56a95. Il warning sul Blob HTTP non è stato confuso con un esito del salvataggio; nessun cambio delle protezioni. GET con URL redatti non attribuiti allo snippet, privo di richieste di rete. Nessun nuovo export richiesto o prova precedente ripetuta.

3. **Verificatore preparato e revisionato.** Processo Node locale tramite TMAR: sorgente in sola lettura, dimensione/stabilità/SHA256, UTF-8/schema/origine/data/coppie univoche e ordinate, conteggi. Copia con creazione esclusiva senza sovrascrivere destinazioni divergenti, poi rilettura e confronto byte per byte/SHA256. Errori a codici fissi, output solo metadata. Finding chiuso prima dell’esecuzione reale: ricevute preesistenti non riusate integralmente; confronto esatto con metadata ricostruiti, solo timestamp ISO validato preservato. Test sintetici mirati PASS, inclusa ricevuta con campo extra e falsa copertura respinta senza payload; review finale indipendente PASS.

4. **Esecuzione reale PASS.** File trovato in Downloads e nessun .crdownload. Verifica sorgente e copia PASS alle02:25:39.619 UTC del20/11/2026. Cartella copia: C:\Users\mrhz\AppData\Local\TMAR-GIS\Backups\P0-20261120T022103176Z-HTTP-localStorage. Conserva JSON e verification.json; ricevuta SHA256 2307c79a3e81b32f88fa36e38014df5306cd2dcf24e23b3fc966bf11b07fa6e7. Payload personali rimasti sul PC, sorgente Downloads preservata. Nel repository solo metadata aggregati e codice del verificatore.

5. **Copertura e dati acquisiti.** Tutte le due coppie Local Storage esportate sono conservate esattamente. coordconv_v2 valida, 30.908 unità UTF-16, 1 traccia salvata, 200 waypoint, 0 poligoni e impostazioni presenti. coordconv_ui_v1 inclusa, legacy coordconv_v1 assente nel set. Questo non attesta lo stato in memoria, altri contenitori, tile/IDB, HTTPS o duplicazione/unicità fra origini. Il tentativo fisico precedente conserva zero sorgenti copiate; il nuovo oggetto verificato è un export logico distinto.

6. **Documentazione e pubblicazione.** Task a613317cd050e6fef3f892e35ae3d21be6ac4454:6 file docs, aggiornati FRONTIER/rapporto/metadati, aggiunti ricevuta verificata, verificatore e validazione. Review documentale indipendente e diff check PASS. Runtime blob invariato. Pubblicazione dal Git Windows autorizzato in clone isolato con parent/tree/commit guard, push normale e verifica remota. Autosync corrente limitato a questo report, latest e un inbox; container PENDING_SELF_REFERENCE/EXTERNAL_ONLY, nessun terzo finalize-hash.

7. **Gate effettivo residuo.** Console HTTP: indexedDB.databases() soltanto, senza open/getTileDB o creazione di DB; risultato metadata-only e fallimenti distinti da catalogo vuoto. Poi acquisizione binari e altri contenitori pertinenti, HTTPS e confronto. Nessuna pulizia o migrazione; HTTP tecnico conservato. P1/P2/P3 CLOSED, DTM5/10m HOLD, mobile PAUSA, P4 FUTURO. Non ripetere export Local Storage HTTP già acquisito salvo cambiamenti concreti.

## Autosync e identità F3

real_task_commit: a613317cd050e6fef3f892e35ae3d21be6ac4454
RUNTIME_CANDIDATE_SHA: N/A (nessun nuovo candidato)
RUNTIME_LIVE_SOURCE: aff215323c97a309cbd5c6c7e0c694d35dd45ad0
REMOTE_HEAD_AT_EVIDENCE_TIME: a613317cd050e6fef3f892e35ae3d21be6ac4454
current_report_container: PENDING_SELF_REFERENCE
Autosync publication verification: EXTERNAL_ONLY
Autosync files: docs/runtime/LAST_CURSOR_REPORT.md; docs/orchestrator/latest.md; docs/orchestrator/inbox/2026-11-20_0329_p0-http-localstorage-verified.md.

## Diff task pubblicato

```text
a613317 docs(gis): verify HTTP localStorage backup and advance P0 gate
 docs/FRONTIER.md                                   | 18 +++---
 .../2026-11-19-http-origin-p0-inventory/REPORT.md  | 28 +++++++--
 .../http-localstorage-verification.json            | 38 ++++++++++++
 .../inventory-metadata.json                        | 42 +++++++++++---
 .../verify-localstorage-backup-validation.json     | 17 ++++++
 .../verify-localstorage-backup.cjs                 | 67 ++++++++++++++++++++++
 6 files changed, 190 insertions(+), 20 deletions(-)
```

## Output Git verbatim pre-container

```text
$ git log --oneline -5
a613317 docs(gis): verify HTTP localStorage backup and advance P0 gate
ce4908e docs(gis): autosync P0 HTTP storage read and backup gate
a703da6 docs(gis): record HTTP storage inventory and prepare local backup
1318617 docs(gis): autosync P0 inventory access blocker
3a9ef3c docs(gis): record P0 origin inventory and access blocker

$ git rev-parse HEAD
a613317cd050e6fef3f892e35ae3d21be6ac4454

$ git rev-parse origin/main
a613317cd050e6fef3f892e35ae3d21be6ac4454

$ git branch --show-current
main

$ git ls-remote origin refs/heads/main
a613317cd050e6fef3f892e35ae3d21be6ac4454	refs/heads/main

$ git status --short

```

## Stato fresco pre-container

Data: 20/11/2026 03:29 Europe/Rome.
origin/main HEAD: a613317cd050e6fef3f892e35ae3d21be6ac4454
working tree: pulito prima di questo autosync.
ultimo blocco PASS operatore: GIS-SAVED-TRACK-PARTIAL-ALTITUDE-FILL-A / Build317 CLOSED.
blocco corrente: GIS-HTTP-ORIGIN-INVENTORY-P0 / HTTP_LOCALSTORAGE_VERIFIED, backup origine completo e confronto PENDING.
prossimo candidato runtime: nessuno.
pubblicazione finale contenitore: EXTERNAL_ONLY.

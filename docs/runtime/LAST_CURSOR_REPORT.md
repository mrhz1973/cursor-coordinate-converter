# P0 — Local Storage HTTP leggibile; backup da acquisire

BLOCK: GIS-HTTP-ORIGIN-INVENTORY-P0; audit non distruttivo, nessun bundle runtime.
GATE: HTTP_LOCALSTORAGE_PARTIAL / BACKUP_PENDING. Conteggi coordconv_v2 attestati dall’operatore; export preparato, non eseguito. Backup completo e confronto HTTP/HTTPS non acquisiti.
NEXT: eseguire export locale HTTP LOCALSTORAGE_ONLY, verificare il download/copia per bytes/SHA256/schema; poi contenitori residui, HTTPS e confronto. Migrazione/pulizia bloccate.
RUNTIME LIVE: Build317 source aff215323c97a309cbd5c6c7e0c694d35dd45ad0, blob 4578788467822123ea7ad7e929d3bdf0e262b1a8, SHA256 ed760bbd704db0e925f8af7f52a7880d9cffda4be2e2f0af9a2044c9cdf56fec; P3 CLOSED con PASS operatore già acquisito.
CANDIDATE: nessun nuovo candidato runtime.
RESULT: HTTP_LOCALSTORAGE_PARTIAL; P0 aperto, nessun backup verificato dedotto dalla leggibilità della chiave.
WORKING TREE: pulito sul commit task prima dell’autosync; pubblicazione finale EXTERNAL_ONLY.
EVIDENCE: [P0 rapporto e limiti](../orchestrator/evidence/2026-11-19-http-origin-p0-inventory/REPORT.md).

## Riepilogo completo

1. **Mandato e fonte viva.** Continuazione del P0 già aperto dopo la chiusura P3. origin/main verificato a131861742ae0230d2e70cb1d059d091d4defde9a; CORE BOOT/metodo già acquisiti, WU N/A. Nessuna riapertura di Build317 o ripetizione delle prove runtime consumate.

2. **Prova fisica conclusa.** Dopo il diniego già diagnosticato Win32 5, l’operatore ha provato la copia ordinaria di082968.ldb tramite Esplora file. Screenshot: accesso negato anche lì. Nessuna sorgente copiata o modificata, nessuna elevazione/cambio ACL/chiusura browser. Causa ulteriore non determinata. Il precedente tentativo fisico resta INCOMPLETE, zero sorgenti.

3. **Lettura logica tramite operatore.** Individuata manualmente la scheda GIS sull’origine HTTP. Una IIFE senza scritture o rete legge una sola volta coordconv_v2 e distingue assenza/errori dai conteggi zero. Output ricevuto: LETTURA_OK, 30.908 unità UTF-16, 1 traccia salvata, 200 waypoint, 0 poligoni, impostazioni presenti. Solo questa chiave è qualificata dalla lettura; nessun contenuto privato, inventario IDB, confronto HTTPS o nuova attestazione programmatica del profilo Default.

4. **Export preparato.** Lo snippet export-localstorage.console.js esporta tutte le coppie Local Storage dell’origine HTTP, preservando le stringhe grezze. Guard origine, doppia lettura integrale coincidente, chiavi univoche, UTF-8 usato identicamente per Blob/bytes/SHA256, filename univoco. Nessuna scrittura sorgente, rete o clipboard. Esito DOWNLOAD_AVVIATO distinto da salvataggio verificato. Copertura LOCALSTORAGE_ONLY; IDB/binari, altri contenitori e stato in memoria esclusi. Esecuzione browser NOT_PERFORMED; nessun download effettivo in questo pass.

5. **Verifiche pertinenti.** Review statica indipendente PASS. SHA256 verificato contro Node crypto su19 lunghezze con soglie di padding e1MiB; roundtrip esatto delle coppie sintetiche, inclusi Unicode, surrogate isolate, chiavi speciali e valori JSON non validi. Sei scenari fail-closed (origine errata, lettura negata, instabilità, valore null, chiave principale assente, duplicati), zero scritture sorgente. Review documentale indipendente e git diff check PASS. Non sono QA del runtime o del backup personale.

6. **Modifiche e pubblicazione.** Task a703da6875d53decff2060c465109aec878c30f0: FRONTIER, rapporto P0, metadati e due artefatti dell’export/verifica. Solo5 file docs; runtime blob invariato. Pubblicazione mediante Git Windows autorizzato in clone isolato, guard sullo stesso parent/albero/commit, push normale e verifica remota PASS. Autosync corrente limitato a questo report, latest e un solo inbox; identità del contenitore EXTERNAL_ONLY/PENDING_SELF_REFERENCE, nessun terzo finalize-hash.

7. **Gate effettivo.** L’operatore deve eseguire il comando nella stessa scheda HTTP e fornire soltanto la ricevuta metadata. Tramite TMAR verificare il file realmente scritto e l’eventuale copia locale; non usare read_file sul payload personale. Un esito positivo qualificherà solo Local Storage HTTP. Restano inventario/backup dei contenitori residui, acquisizione HTTPS e confronto prima di qualunque migrazione o pulizia. P1/P2/P3 CLOSED, DTM5/10m HOLD, mobile PAUSA, P4 FUTURO. HTTP tecnico conservato.

## Autosync e identità F3

real_task_commit: a703da6875d53decff2060c465109aec878c30f0
RUNTIME_CANDIDATE_SHA: N/A (nessun nuovo candidato)
RUNTIME_LIVE_SOURCE: aff215323c97a309cbd5c6c7e0c694d35dd45ad0
REMOTE_HEAD_AT_EVIDENCE_TIME: a703da6875d53decff2060c465109aec878c30f0
current_report_container: PENDING_SELF_REFERENCE
Autosync publication verification: EXTERNAL_ONLY
Autosync files: docs/runtime/LAST_CURSOR_REPORT.md; docs/orchestrator/latest.md; docs/orchestrator/inbox/2026-11-20_0309_p0-http-localstorage-read.md.

## Diff task pubblicato

```text
a703da6 docs(gis): record HTTP storage inventory and prepare local backup
 docs/FRONTIER.md                                   | 18 +++--
 .../2026-11-19-http-origin-p0-inventory/REPORT.md  | 27 +++++--
 .../export-localstorage-validation.json            | 13 ++++
 .../export-localstorage.console.js                 | 91 ++++++++++++++++++++++
 .../inventory-metadata.json                        | 39 +++++++++-
 5 files changed, 173 insertions(+), 15 deletions(-)
```

## Output Git verbatim pre-container

```text
$ git log --oneline -5
a703da6 docs(gis): record HTTP storage inventory and prepare local backup
1318617 docs(gis): autosync P0 inventory access blocker
3a9ef3c docs(gis): record P0 origin inventory and access blocker
6dbcd77 docs(gis): autosync operator closure of Build317 P3
736cb51 docs(gis): close Build317 P3 after operator QA PASS

$ git rev-parse HEAD
a703da6875d53decff2060c465109aec878c30f0

$ git rev-parse origin/main
a703da6875d53decff2060c465109aec878c30f0

$ git branch --show-current
main

$ git ls-remote origin refs/heads/main
a703da6875d53decff2060c465109aec878c30f0	refs/heads/main

$ git status --short

```

## Stato fresco pre-container

Data: 20/11/2026 03:09 Europe/Rome.
origin/main HEAD: a703da6875d53decff2060c465109aec878c30f0
working tree: pulito prima di questo autosync.
ultimo blocco PASS operatore: GIS-SAVED-TRACK-PARTIAL-ALTITUDE-FILL-A / Build317 CLOSED.
blocco corrente: GIS-HTTP-ORIGIN-INVENTORY-P0 / HTTP_LOCALSTORAGE_PARTIAL, backup completo e confronto PENDING.
prossimo candidato runtime: nessuno.
pubblicazione finale contenitore: EXTERNAL_ONLY.

# P0 — attualità, copia HTTP aggiornata e recupero da qualificare

Data: 21/11/2026 14:38 Europe/Rome. FRONTIER è l'unica LIVE STATE.
BLOCK: GIS-HTTP-ORIGIN-INVENTORY-P0; audit non distruttivo, nessun bundle runtime.
GATE: P0 APERTO; decisione/qualificazione recupero WAIT; residui BLOCKED da ACCESS_DENIED prima dei byte.
NEXT: definire il perimetro proposto 1 traccia + 200 waypoint HTTP, mantenendo HTTP e archivi; qualificare compatibilità applicativa su copie e risolvere copertura residua per l'azione prevista. Nessun candidato dati creato, migrazione o pulizia autorizzata.
RUNTIME LIVE: Build317 source aff215323c97a309cbd5c6c7e0c694d35dd45ad0, blob 4578788467822123ea7ad7e929d3bdf0e262b1a8, SHA256 ed760bbd704db0e925f8af7f52a7880d9cffda4be2e2f0af9a2044c9cdf56fec; P3 CLOSED con PASS operatore del 19/11 già acquisito.
CANDIDATE: nessun nuovo candidato runtime o di dati.
RESULT: quattro contenitori logici coperti e cinque snapshot distinti conservati. Attualità controllata, nuovo backup HTTP VERIFIED, indicatori conservativi del precontrollo chiariti; roundtrip e backup completo origine NON attestati.
WORKING TREE: pulito sul task pubblicato prima dell'autosync; verifica autosync EXTERNAL_ONLY.
EVIDENCE: [Rapporto e proposta](../evidence/2026-11-21-http-recovery-preparation/REPORT.md), [metadati e review](../evidence/2026-11-21-http-recovery-preparation/evidence.json), [confronto e backup precedenti](../evidence/2026-11-19-http-origin-p0-inventory/REPORT.md).

## Riepilogo completo

1. **Mandato e fonte di verità.** L'operatore ha richiesto di proseguire tramite PC. CORE BOOT/metodo già acquisiti nella chat; refresh minimo, WU N/A. origin/main f536dfacc15457ad569bf97e049bf8c73e1c844d riconfermato prima del pass. Nessun nuovo sviluppo, deploy o QA runtime. TMAR ha operato il browser personale con UIAutomation/Win32 e helper in sola lettura, senza elevazione, permessi modificati, riavvio o clipboard.

2. **Attualità reale.** Probe HTTPS 13:05:54.939–13:05:55.201 UTC: LocalStorage e IndexedDB MATCH delle copie. Probe HTTP 13:06:45.671–13:06:46.114 UTC: IDB MATCH, LocalStorage DIFFERENT, pur con uguali dimensione e numero di chiavi. Due letture LS iniziali e due finali coincidenti; IDB v1 readonly, schema previsto, nessun upgrade. Impronte aggregate; zero rete/download/storage writes da parte delle sonde. Non sono snapshot atomici né garanzia sulle modifiche successive.

3. **Nuova copia HTTP necessaria e verificata.** Nuovo export solo del contenitore cambiato, con helper qualificati invariati. Snapshot 13:08:01.748 UTC; verifier 13:11:08.056 UTC, processo 38508, exit code 0. File TMAR-GIS-P0-HTTP-localStorage-20261121T130801748Z.json, 36.618 byte, 2 chiavi, SHA256 31f21f40771c9114fa15b62bb58740508367b5c3941a947d7b2809f1a0ba04a0. Ricevuta 0b2daf53d6553b828845cd7ca7cf0cb80ce55c1fac78e6730efd2d62366b8475. Schema/hash/stabilità/copia byte per byte PASS. Edge richiedeva Salva: azione confermata sulla voce esatta, file definitivo presente e .crdownload assente. Precedente HTTP e altri snapshot conservati; cinque acquisizioni distinte per quattro contenitori logici.

4. **Delta HTTP e precontrolli.** Audit nativo 13:16:27.791 UTC, processo 18908, exit code 0, sole tre copie LocalStorage con ricevute vincolate. Cambia solo la proprietà principale settings: 13/14 proprietà identiche, savedTracks/mapWaypoints identici e chiave UI raw identica. Valori specifici e causa non acquisiti. Nuovo fingerprint HTTP coincide con il probe. Selezione proposta 1 traccia + 200 waypoint: proiezione 6 tracce / 200 waypoint, entro i limiti 50 tracce / 2.000 punti per traccia / 200 waypoint; nessun margine WP. Zero collisioni tra origini nei domini ID tracce/waypoint. Nessuna identità geografica dedotta.

5. **Indicatori conservativi chiariti.** Il referto iniziale BLOCKED segnalava 1 ID punto ripetuto, 396 campi data non numerici originali e 11 meta non-object; questi ultimi non erano un terzo blocker. Review semantica e classificazione mirata conclusa 13:29:47.160 UTC, processo 50616, exit code 0: tutti i 396 sono campi assenti, altri 4 campi già numerici finiti; tutti gli 11 meta sono null negli 11 punti HTTP, senza ID duplicati. L'unica ripetizione è dentro una delle 5 tracce HTTPS preesistenti, senza identificarne la singola traccia. Il loader può preservare assenza e null. Nessuna corruzione/perdita/riparazione HTTP dimostrata; nessuna simulazione completa load/save. Il referto originale è conservato con la sua interpretazione, non trasformato in errore reale dei dati.

6. **Contratto e gate residuo.** La via UI ordinaria ricostruisce ID/date e non conserva tutti i metadati/addon. saveStore riscrive l'intera coordconv_v2; unione raw non basta a provare il roundtrip o la conservazione delle sezioni HTTPS estranee. Proposta e TASK DELTA preparatorio documentati, non emessi a Cursor. Profilo Edge Default identificato dalla UI; letture OS dei cataloghi WebStorage/QuotaManager, File System/Origins/CURRENT e Service Worker/Database/CURRENT ACCESS_DENIED(5) alle 12:57:22.970 UTC prima dei byte. Nessun parser SQLite/LevelDB aperto sulle sorgenti. Residui non mappati, backup completo origine non attestato; nessuna autorizzazione implicita di migrazione/pulizia.

7. **Qualificazione e limiti.** Nuove logiche soltanto: helper di attualità 44 asserzioni, audit 27 asserzioni e classificazione 11 asserzioni PASS; review statiche indipendenti e review dei metadati/documentazione PASS. Nessuna QA o suite precedente ripetuta. Classificatore eseguito a5841… e archivio 9bd0… differiscono per un solo LF finale in più nell'eseguito: prova byte per byte e review indipendente PASS, nessuna logica cambiata o riesecuzione. Finding di metodo e recuperi ristretti nei metadati. Payload geografici rimasti sul PC; nessun nome/ID/coordinata/hash per record pubblicato.

8. **Stato del browser e conservazione.** Chiusa soltanto la scheda diagnostica identificata: 7→6, altre sei preservate alle 13:12:06.513 UTC. Nessun candidato di dati, scrittura nelle sorgenti, riparazione automatica, pulizia o migrazione. HTTP e backup conservati. P1/P2/P3 CLOSED; DTM5/10m HOLD, mobile PAUSA, P4 FUTURO.

9. **Task pubblicato e autosync.** Task b164e9fea3d866e1634c77da355f358daf94e924, esattamente 6 file docs. Scope e diff check PASS; blob runtime invariato. Trasporto hash-bound, tree/commit ricostruiti identici dal Git Windows autorizzato, push normale; session guard e nativeExitCode 0. HEAD/tracking/ls-remote concordi e working tree pulito sia nativamente sia dopo fetch nel checkout. Autosync limitato ai tre file sotto, senza terzo finalize commit. Verifica della sua pubblicazione solo esterna.

## Autosync e identità F3

real_task_commit: b164e9fea3d866e1634c77da355f358daf94e924
RUNTIME_CANDIDATE_SHA: N/A (nessun nuovo candidato)
RUNTIME_LIVE_SOURCE: aff215323c97a309cbd5c6c7e0c694d35dd45ad0
REMOTE_HEAD_AT_EVIDENCE_TIME: b164e9fea3d866e1634c77da355f358daf94e924
current_report_container: PENDING_SELF_REFERENCE
Autosync publication verification: EXTERNAL_ONLY
Autosync files: docs/runtime/LAST_CURSOR_REPORT.md; docs/orchestrator/latest.md; docs/orchestrator/inbox/2026-11-21_1438_p0-current-content-recovery-gate.md.

## Diff task pubblicato

```text
 docs/FRONTIER.md                                   |   22 +-
 .../2026-11-21-http-recovery-preparation/REPORT.md |  124 ++
 .../audit-selective-recovery.cjs                   |  422 +++++++
 .../classify-recovery-findings.cjs                 |  203 ++++
 .../evidence.json                                  | 1247 ++++++++++++++++++++
 .../prepare-http-recovery.cjs                      |  403 +++++++
 6 files changed, 2414 insertions(+), 7 deletions(-)
```

## Output Git verbatim pre-container

```text
$ git log --oneline -5
b164e9f docs: reconcile P0 current storage and recovery gates
f536dfa docs: autosync verified P0 backups and comparison gate
95f9587 docs: verify HTTPS backup and compare P0 origin snapshots
dbe1cfb docs(gis): autosync HTTPS source lookup gate
212f549 docs(gis): record HTTPS source lookup gate after TMAR recovery
$ git rev-parse HEAD
b164e9fea3d866e1634c77da355f358daf94e924
$ git rev-parse origin/main
b164e9fea3d866e1634c77da355f358daf94e924
$ git branch --show-current
main
$ git ls-remote origin refs/heads/main
b164e9fea3d866e1634c77da355f358daf94e924	refs/heads/main
$ git status --porcelain=v1
```

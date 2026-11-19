# Build317 / P3 — LIVE riconciliata, QA operatore PENDING

BLOCK: GIS-SAVED-TRACK-PARTIAL-ALTITUDE-FILL-A; DELICATO; CLOSURE STANDARD_RUNTIME_BUNDLE.
GATE: identità GitHub/VPS/HTTP/HTTPS PASS; Automated Browser QA HTTPS LIVE 151/151 PASS. QA FINALE CHATGPT — PENDING / QA operatore PENDING.
NEXT: QA umana residua P3 sul comando Calcola quote mancanti e sul profilo misto; chiusura Regola H solo dopo attestazione operatore.
RUNTIME LIVE: Build317, source aff215323c97a309cbd5c6c7e0c694d35dd45ad0, blob 4578788467822123ea7ad7e929d3bdf0e262b1a8, SHA256 ed760bbd704db0e925f8af7f52a7880d9cffda4be2e2f0af9a2044c9cdf56fec, 11.288.727 byte CR192/CRLF0.
CANDIDATE: source aff215323c97a309cbd5c6c7e0c694d35dd45ad0 già distribuito; nessun candidato successivo. Nessun nuovo deploy in questo pass.
RESULT: riconciliazione tecnica e documentale PASS; reviewer AI esterno NOT_PERFORMED/backstop, distinta dalla review GPT-SOSTITUTIVA predeploy già PASS.
WORKING TREE: pulito sul commit task prima dell'autosync; esito finale del contenitore EXTERNAL_ONLY.
EVIDENCE: [Release e limiti](../orchestrator/evidence/2026-11-18-partial-imported-elevation-317/RELEASE.md).

## Riepilogo completo

1. **Mandato e discrepanza.** Ripresa dal CORE BOOT minimo a origin/main 6dc476918a2a6f4c5f1e7971c76ecfe0f9eec4bd. FRONTIER attestava P2 CLOSED/Build316, mentre l'handoff segnalava Build317 già servita. La lettura successiva on-demand di LAST_CURSOR_REPORT mostrava ancora lo stato storico316; la review317 attestava candidato e gate predeploy. Acquisiti soltanto metodo e fonti necessari alla riconciliazione.

2. **Identità verificata.** Il runtime GitHub, il file del clone VPS, l'HTTP8000 e l'HTTPS canonico coincidono nello SHA256 e nella dimensione riportati nell'header. VPS osservato sul branch main, working tree pulito, HEAD/tracking 6dc4769 al momento della ricevuta. URL: https://ionos-n8n-new.tailc01234.ts.net/gis?v=ed760bbd. [Ricevuta indipendente](../orchestrator/evidence/2026-11-18-partial-imported-elevation-317/runtime-identity.json).

3. **Distribuzione preesistente.** Servizio goi-gis-app osservato active/running, PID3001592; avvio registrato 19/11/2026 00:25:03 CET. Backup Build316 presente in /var/backups/goi-gis-runtime/prebuild317-FdlskfH8, SHA256 edf2042254b53852ee7402655b139c698cc09d958be555b397fdc13162525917. Nessun nuovo deploy, pull runtime o riavvio eseguito da questo pass; proxy e servizi condivisi invariati.

4. **Evidenze già consumate.** Review GPT-SOSTITUTIVA predeploy PASS del 18/11, statici32, JS2/2 e candidato151/151 sono stati riutilizzati. Nessuno sviluppo, nessuna nuova review del runtime, nessuna ripetizione di QA candidato o test statici. Reviewer esterno NOT_PERFORMED/backstop rimane tale.

5. **Nuova QA LIVE.** Runner browser-qa.cjs invariato, una sola esecuzione live su Edge Windows in profilo temporaneo: 151/151 PASS, inclusi17 P3 e134 controlli già nel runner;79 clic nativi,10 selettori file, zero POST/eccezioni/errori console. Provider simulato e richieste estranee bloccate: nessun invio reale di coordinate, nessun uso del browser personale. Hash documento HTTPS provato dai GET separati, non dal campo vuoto network.documentHashes del runner. [Risultato integrale](../orchestrator/evidence/2026-11-18-partial-imported-elevation-317/live-qa.json).

6. **Screenshot e cleanup.** Screenshot P3 realmente ispezionato: Originali2/Stimate2, fonte e grafico visibili; la carta esterna è bloccata dalla suite. Un solo PNG persistito con manifest, altri12 screenshot accessori restano temporanei. Pulizia dati sintetici dell'origine PASS; rimozione cartella del profilo temporaneo non riuscita per EPERM, senza forzare permessi o cancellazioni.

7. **Modifiche documentali.** Commit task 4ccb7817706fff0ec5f64cfa584374c9a9674f18: FRONTIER aggiornato in11 righe vive e una sezione317; storia da Build316 in poi byte-preservata. Nuovi RELEASE.md, live-qa.json, runtime-identity.json, screenshots-manifest.json e un PNG nel dossier317. Autosync corrente: latest.md, un solo inbox e sovrascrittura del presente LAST_CURSOR_REPORT. Monolite, funzioni, chiavi i18n, metodo stabile, roadmap, checkpoint e sessioni legacy non modificati.

8. **Validazione documentale.** Diff check PASS e audit indipendente in sola lettura PASS. Corretto prima del commit un riferimento che attribuiva al CORE BOOT la lettura del report, rendendola esplicitamente successiva/on-demand. Identità, conteggi, hash e limiti coerenti; nessuna chiusura o QA umana inventata. I finding di payload della sessione sono registrati nella release, con accessi successivi ristretti.

9. **Pubblicazione.** Il push dal workspace cloud è risultato indisponibile per assenza di credenziali di scrittura. Il contenuto e lo stesso commit task sono stati pubblicati dal Git Windows già autorizzato, in clone temporaneo isolato; albero e commit verificati prima del push. Nessuna modifica di credenziali, permessi o configurazione del repository operativo. Il contenitore autosync segue lo stesso percorso.

10. **Gate e backlog.** P3 resta aperto con QA operatore PENDING. P2 CLOSED conserva il proprio PASS del18/11. Quote originali e addon terrainFill separati, stime non esportate come Z originale, dislivelli misti e pendenze tra fonti omessi. DTM5/10m precisione terreno HOLD, mobile PAUSA, P0 inventario HTTP/backup aperto, P4 SOLO FUTURO. Nessun nuovo blocco runtime avviato.

## Autosync e identità F3

real_task_commit: 4ccb7817706fff0ec5f64cfa584374c9a9674f18
RUNTIME_CANDIDATE_SHA: aff215323c97a309cbd5c6c7e0c694d35dd45ad0
REMOTE_HEAD_AT_EVIDENCE_TIME: 4ccb7817706fff0ec5f64cfa584374c9a9674f18
current_report_container: PENDING_SELF_REFERENCE
Autosync publication verification: EXTERNAL_ONLY
Autosync files: docs/orchestrator/latest.md; docs/orchestrator/inbox/2026-11-19_0202_build317-live-reconciliation.md; docs/runtime/LAST_CURSOR_REPORT.md.

Il commit task è già pubblicato e verificato al momento della stesura. Questo contenitore non riporta autoreferenzialmente il proprio futuro SHA o esito push: HEAD finale, tracking, ls-remote e working tree sono verificati esternamente dopo la pubblicazione. Nessun terzo commit di finalize-hash.

## Diff del task pubblicato

```text
4ccb781 docs(gis): reconcile Build317 live identity and HTTPS QA
 docs/FRONTIER.md                                   |   26 +-
 .../RELEASE.md                                     |   54 +
 .../live-p3-partial-quoted-composite.png           |  Bin 0 -> 296902 bytes
 .../live-qa.json                                   | 2142 ++++++++++++++++++++
 .../runtime-identity.json                          |   94 +
 .../screenshots-manifest.json                      |   25 +
 6 files changed, 2330 insertions(+), 11 deletions(-)
```

## Output Git verbatim pre-container

```text
$ git log --oneline -5
4ccb781 docs(gis): reconcile Build317 live identity and HTTPS QA
6dc4769 docs(gis): review Build317 P3 partial elevation before deploy

$ git rev-parse HEAD
4ccb7817706fff0ec5f64cfa584374c9a9674f18

$ git rev-parse origin/main
4ccb7817706fff0ec5f64cfa584374c9a9674f18

$ git branch --show-current
main

$ git ls-remote origin refs/heads/main
4ccb7817706fff0ec5f64cfa584374c9a9674f18	refs/heads/main

$ git status --short
```

Snapshot locale shallow: git log -5 mostra soltanto gli antenati acquisiti, senza ricostruzione dello storico non necessario al gate.

## Stato fresco pre-container

origin/main HEAD: 4ccb7817706fff0ec5f64cfa584374c9a9674f18
working tree: pulito prima della preparazione di questo autosync.
ultimo blocco PASS operatore: GIS-TABLES-ALL-REMAINING-P2 / Build316, CLOSED.
blocco tecnico corrente: GIS-SAVED-TRACK-PARTIAL-ALTITUDE-FILL-A / Build317 LIVE, Automated Browser QA PASS, operatore PENDING.
prossimo candidato runtime: nessuno.
note operative: preservare il gate umano e i limiti HOLD/PAUSA; final publication verification EXTERNAL_ONLY.

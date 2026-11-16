# LAST_CURSOR_REPORT - Build308 single-panel LIVE

Il nome file è storico: questo pass è stato eseguito da ChatGPT con subagenti, GitHub e TMAR Desktop Commander Win, non da Cursor. [FRONTIER](../FRONTIER.md) resta la sola LIVE STATE.

## A. Header sintetico

| Campo | Valore |
| --- | --- |
| BLOCK | GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX1 |
| GATE | Build308 LIVE; GPT-SOSTITUTIVA, deploy e 27/27 HTTPS PASS. QA operatore PENDING. Reviewer esterno NOT_PERFORMED. |
| NEXT | QA umana della nuova interfaccia single-panel, poi Regola H. |
| Runtime LIVE | Build308 source d347ec792d515c1ffaa1f8ddd5f8bf3d51d4d0c8, blob 6182162db2e39360cd42d33153769c0412df6902, SHA256 50dcedce9e51549f36136742bfd0dab4816ce7019710c969f06007ddaed95882. |
| Candidate FULL SHA | Nessun candidato successivo a Build308 verificato. |
| Deployed state | GIS-only PASS, backup307 e HTTP/HTTPS identici, browser HTTPS 27/27. |
| Result | FIX della UI respinta: importazione archivio resta in Traccia; Save sopra, dettagli chiusi. Nessuna accettazione umana inventata. |
| Working tree | Sorgente e VPS puliti al deploy; post-autosync verificato esternamente. |

### Identità SHA, non autoreferenziali

| Nome | Valore |
| --- | --- |
| RUNTIME_SOURCE_SHA | d347ec792d515c1ffaa1f8ddd5f8bf3d51d4d0c8 |
| RUNTIME_CANDIDATE_SHA | N/A successivo; source LIVE verificato. |
| REMOTE_HEAD_AT_EVIDENCE_TIME | 93e6ba47b362c069eebfb2c29c64c5998641f3f6 |
| real_task_commit | d347ec792d515c1ffaa1f8ddd5f8bf3d51d4d0c8 |
| docs/report HEAD | `PENDING_SELF_REFERENCE` |
| current_report_container | `PENDING_SELF_REFERENCE` |
| final_remote_head_after_report_push | `EXTERNAL_ONLY` |

Evidence: [dossier305](../orchestrator/evidence/2026-11-15-chat49-handoff-305/REPORT.md) · [inbox del pass](../orchestrator/inbox/2026-11-15_1830_chat49-handoff-build305.md).

## B. RIEPILOGO COMPLETO

1. **Handoff ricostruito e lavoro ripreso.** Il repository è stato verificato con `git ls-remote` e CORE BOOT. Il recupero della chat esatta «TMAR GIS TOOL 49 GPT» non ha restituito la trascrizione integrale: sono stati usati gli estratti disponibili e le evidenze GitHub, senza inventare decisioni mancanti.

2. **Stato reale riconciliato.** All'inizio FRONTIER dichiarava Build303, ma GitHub, VPS e HTTPS servivano già Build304, source `938b2b3c601ae61b6c71cf806ae67119537af8aa`. Il profilo da quote importate era già presente ed è stato mantenuto. Ora è LIVE la **Build305**, source `95080bac23a1642c1a2c6f8c0bdd4885b7bac960`, SHA-256 `5ffa64ff3ba9746de9a5463cc4adfc058ceb7de77e095aacdd51259e39d72464`, 11.170.887 byte.

3. **Correzioni distribuite.** Il percorso Importa nella traccia corrente → «💾 Salva traccia in archivio…» conserva le quote originali; anche una sola quota valida viene mantenuta. Il salvataggio sostitutivo conserva l'allegato solo con geometria compatibile. Spostare un punto importato elimina la quota di quel punto; una posizione equivalente dopo normalizzazione la conserva. Una sola quota non viene trasformata in un profilo o in una pendenza. Il delta riguarda tre aree funzionali del solo HTML, più metadati; nessuna nuova chiave i18n, dipendenza, schema persistito, rete o GPS.

4. **Verifiche e deploy.** Review tecnica GPT sostitutiva scoped PASS, con revisione di subagenti distinta dall'implementazione; reviewer esterno formale NOT_PERFORMED. Harness mirato 16/16 PASS sul source definitivo e sette probe numerici dell'implementatore sulla guardia finale. In Edge Windows isolato: **49/49 controlli tracce + 16/16 poligono GIS** sia sul candidato sia sulla pagina HTTPS nativa. Zero POST, eccezioni JavaScript ed errori console nelle sessioni conclusive. Il ciclo poligono usa il vero store GIS, distinto dalle tracce chiuse. Test su fixture sintetiche; nessuna nuova certificazione del terreno o uso di file privati. Tentativi incompleti e candidato fallito restano nel dossier.

5. **Pubblicazione verificata e ripresa documentale.** Deploy GIS-only concluso il 15 novembre 2026 alle **18:15:42 Europe/Rome**, con backup304 verificato, pull fast-forward e un solo restart GIS. File VPS, HTTP interno, HTTPS e corpo dei documenti Edge hanno identità coincidente. HEAD source e commit documentale sono distinti. FRONTIER è ora di 34 righe; 75.967 byte di checkpoint storici sono stati preservati integralmente. Corretti i puntatori HANDOFF; aggiornamento dell'indice e del rapporto completo nel presente autosync. [Dossier ed evidenze](../orchestrator/evidence/2026-11-15-chat49-handoff-305/REPORT.md).

6. **Attività ancora aperte.** La riorganizzazione Importa/Esporta tra traccia corrente e archivio richiesta nella chat49 è ancora da implementare: l'Esporta alto continua a usare la selezione delle tracce salvate. Il profilo da sola geometria XY priva di quote non è introdotto dalla305. La precisione sul terreno DTM5/10m resta HOLD; le QA umane precedenti rimangono separate. Sviluppo telefono in PAUSA.

7. **Gate residuo.** QA operatore Build305 PENDING, secondo OM §4 Regole D2/H. La verifica umana rimasta riguarda leggibilità e uso concreto su un proprio GPX: importazione, salvataggio con un nome riconoscibile, apertura di «Profilo» nella riga salvata; dopo riapertura, la traccia corretta deve essere ancora utilizzabile. Con quote presenti compare «Quote originali GPX/KML»; un file senza quote non acquisisce automaticamente un profilo. Il comando «continua» non è stato interpretato come PASS umano. [Apri Build305](https://ionos-n8n-new.tailc01234.ts.net/gis?v=5ffa64ff).

8. **Chiusura del pass documentale.** Commit operativo `89b2c2621fb64972e47995f29fe3cb65527908e3`, runtime source `95080bac…`. Autosync selettivo di LAST, latest e una inbox, con monolite escluso. Il contenitore corrente resta `PENDING_SELF_REFERENCE`; il suo SHA finale, il PASS remoto e la pulizia conclusiva sono verifiche esterne dopo il push, senza commit di backfill. Dopo il gate umano, il prossimo lavoro è la riorganizzazione dei comandi Tracce già richiesta.

### Stato fresco (nome storico «da Cursor», esecuzione ChatGPT)

```text
origin/main al momento della prova pre-container: 89b2c2621fb64972e47995f29fe3cb65527908e3
working tree pre-container: pulito
ultimo blocco chiuso con PASS operatore: Build297 / GIS-MINIMIZED-HELP-TOOLS-ESCAPE-PRIORITY-D
runtime live: Build305 / source 95080bac23a1642c1a2c6f8c0bdd4885b7bac960
prossimo candidato: nessuno verificato
gate: QA operatore305 PENDING; DTM terreno HOLD; mobile PAUSA
```

## C. OUTPUT GIT — pre-container

Acquisizione effettiva: **2026-11-15T18:30:07.411897+01:00**.

```text
$ git log --oneline -5
89b2c26 docs(gis): reconcile chat49 handoff and record verified build 305
95080ba fix(gis): keep imported height for equivalent normalized longitude
2664bb1 fix(gis): preserve imported heights through current-track save (build 305)
938b2b3 fix(gis): render saved imported GPX elevation profiles (build 304)
caa585f docs(gis): record Build303 GPX elevation review deploy and live QA

$ git rev-parse HEAD
89b2c2621fb64972e47995f29fe3cb65527908e3

$ git rev-parse origin/main
89b2c2621fb64972e47995f29fe3cb65527908e3

$ git branch --show-current
codex/gis-chat49-handoff-20261115

$ git ls-remote origin refs/heads/main
89b2c2621fb64972e47995f29fe3cb65527908e3	refs/heads/main

$ git status --short
```

Il contenitore corrente non prova il proprio push. HEAD finale e PASS remoto: EXTERNAL_ONLY, tramite `git ls-remote origin refs/heads/main` dopo il push. Nessun commit finalize-hash.

## D. Chiusura successiva del gate Build305

Ricevuta il 15 novembre 2026 la riga esatta `QA GIS-SAVED-TRACK-IMPORT-ELEVATION-SAVE-A PASS operatore`. Verificata HEAD remota prima della chiusura `98ed9286668b5b3da3e5df920486ee921adc6ce4` e runtime SHA256 `5ffa64ff3ba9746de9a5463cc4adfc058ceb7de77e095aacdd51259e39d72464`; review GPT sostitutiva, deploy GIS-only e ABQA HTTPS native 49/49+16/16 PASS gia acquisiti. Regola H: CLOSED docs-only. Nessun nuovo deploy, restart o test runtime. Reviewer esterno NOT_PERFORMED; accuratezza DTM e gate storici non chiusi. [Ricevuta](../orchestrator/evidence/2026-11-15-chat49-handoff-305/OPERATOR-CLOSURE-305.md). Il container corrente non prova il proprio SHA; verifica HEAD finale da remoto.

## E. B0 UX Tracce - audit read-only (15/11/2026)

Sul codice LIVE305 risultano confermati: bottone Salva legacy forzato hidden; CTA dinamica Punti non presente con zero punti; Esporta alto dipende dagli ID di archivio; toolbar archivio senza Importa/Esporta. L'Import Hub include gia applicazione transazionale per savedTracks, ma la nuova azione UI deve essere verificata. Nessuna nuova QA browser, build o deploy. [Rapporto B0](../orchestrator/evidence/2026-11-15-track-panel-ux-b0/REPORT.md).

## F. Build306 ROUTINE UI - 2026-11-16 00:03 CET

Source `287d90c59cf6e77feb7144e79bdaa7087dccc490`, blob `dcf143d899c2c074f32dae03edd0058326c5ebef`, SHA256 `47a770d9cb8ed963e2c8171311f638c1f72ef1bf90090fe18c545d8809480d9b`. L'unico file runtime modificato e il monolite HTML: CTA Salva archivio visibile desktop (disabled a 0/1 punti), aiuto IT/EN/FR, CTA header Punti nascosta solo desktop, regressione viewport mobile invariata. No storage/rete/GPS nuovi.

JS syntax 2/2 PASS; candidate Edge 13/13 PASS, HTTPS native 13/13 PASS, zero POST/eccezioni/console/harness, tutti profili isolati rimossi. GIS-only deploy PASS dopo backup305; un solo restart GIS; HTTP e HTTPS hash coincidenti. Reviewer esterno N/A ROUTINE. [Report](../orchestrator/evidence/2026-11-15-track-save-cta-desktop-306/REPORT.md).

QA operatore Build306 PENDING, nessuna chiusura Regola H anticipata. NEXT: QA umana poi bundle I/O DELICATO; DTM terreno HOLD, telefono PAUSA, profilo XY senza quote backlog. Contenitore del presente report PENDING_SELF_REFERENCE; final HEAD EXTERNAL_ONLY.

## G. Chiusura QA operatore Build306 - 2026-11-16 00:32 CET

Riga ricevuta esattamente: `QA GIS-TRACK-SAVE-CTA-DESKTOP-A PASS operatore`. Il blocco attivo in FRONTIER era coincidente. Gate tecnici e deploy gia PASS (node --check 2/2, Edge 13/13 e HTTPS 13/13). Regola H applicata: **CLOSED docs-only** senza modifiche al runtime, nuovo deploy o restart. Il PASS non qualifica gli altri task; DTM terrain HOLD, sviluppo mobile PAUSA, profilo da XY senza quote non implementato. [Ricevuta](../orchestrator/evidence/2026-11-16-qa306-closure/REPORT.md). La HEAD finale del contenitore autosync resta da verificare esternamente.

## H. Build307 LIVE - 2026-11-16 01:11 CET

Fonte origin/main release `3ebd1ba5cb4c2584e0a19f7b4fc859b2684a4e9e`, review raw@FULL_SHA `1aaa72ec6c3db7bb944c1b58108e456fb4eee611`, blob comune `b59bbd89b45ef3c31e8a28395f8d2070ee6c5dfb`, SHA256 `d5274ebdb9358a1fd3675c7688af4a562997f3580f7146ca7c3c4b8b70c16e22`, 11.180.622 byte. Bundle DELICATO: import/export Traccia corrente vs archivio, preservazione delle quote importate con addon hash-bound, Workbench prevalidate/rollback. JS 2/2 PASS; Edge candidato 27/27 e HTTPS LIVE 27/27, zero POST/eccezioni/errori. Reviewer AI esterno NOT_PERFORMED, GPT-SOSTITUTIVA review PASS checklist in dossier. Backup306 e un solo restart GIS, hash HTTP e HTTPS coincidenti. [Report](../orchestrator/evidence/2026-11-16-track-io-current-archive-307/RELEASE.md).

QA operatore Build307 PENDING; dopo PASS Regola H docs-only, nessun PASS umano dedotto dalle prove tecniche. Profilo XY senza quote non implementato, DTM terreno HOLD, mobile PAUSA. Questo report non predice il proprio commit SHA; final HEAD EXTERNAL_ONLY.

## I. Feedback operatore Build307 - usabilita non accettata

Il 16/11/2026 l'operatore ha contestato la confusione dell'interfaccia con screenshot dei pannelli Traccia/Oggetti GIS affiancati. Nessuna attestazione QA PASS307 ricevuta. Il gate passa a NON ACCETTATA / FAIL UX, distinto dai PASS tecnici storici scoped. Registrati problema e TASK DELTA per un unico pannello Traccia con due zone, import diretto nell'archivio e dettaglio progressivo. [Ricevuta](../orchestrator/evidence/2026-11-16-track-io-current-archive-307/OPERATOR-UX-NOT-ACCEPTED.md). Nessun cambio HTML, dato utente, servizio, deploy o build in questo pass.

## Build308 - 16 novembre 2026

# Build308 LIVE - Tracce in una sola finestra

Verifica: 16 novembre 2026. Registrazione UTC 2026-11-16T12:24:14.247269+00:00.
Blocco `GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX1`. FIX della Build307 non accettata per usabilita; nessun PASS umano storico modificato.

## Stato verificato

Runtime source `d347ec792d515c1ffaa1f8ddd5f8bf3d51d4d0c8`, blob `6182162db2e39360cd42d33153769c0412df6902`, SHA256 `50dcedce9e51549f36136742bfd0dab4816ce7019710c969f06007ddaed95882`, 11.200.744 byte, CR192/CRLF0.
Deploy GIS-only completato il 2026-11-16T12:21:57.922665+00:00: backup307 `/var/backups/goi-gis-runtime/20261116T122156Z-prebuild308`, un solo restart del servizio GIS, PID 124169 -> 1332131. File VPS, HTTP interno e HTTPS nativa restituiscono lo stesso hash e Build308.
URL: https://ionos-n8n-new.tailc01234.ts.net/gis?v=50dcedce

## Interfaccia distribuita

Traccia in modifica sopra: creazione, importazione, Salva/Aggiorna ed Esporta. Punti e distanza in una riga; Dettagli e punti richiudibili. Tracce salvate sotto: Importa file apre direttamente il selettore e la conferma nella stessa finestra Traccia. Nessuna apertura automatica di Oggetti GIS, nessuna categoria generale. Annulla non salva; nome e quote conservati. Azioni batch solo con selezione, Mostra/Nascondi tutte conservate in Altre azioni.

## Evidence

REVIEW GPT-SOSTITUTIVA PASS su sorgente immutabile; reviewer AI esterno NOT_PERFORMED, backstop post-hoc aperto. [Review](REVIEW.md).
JavaScript inline 2/2 PASS, 12 funzioni canoniche di storage/import/export byte-identiche alla base. [Statici](static-checks.json).
Edge candidato 27/27 PASS e Edge HTTPS LIVE 27/27 PASS. In ciascun run finale: 26 clic nativi, 5 aperture del selettore, zero POST, eccezioni JavaScript e errori console. [Candidata](candidate-qa.json), [HTTPS](live-qa.json), [Identita e deploy](runtime-identity.json).
Screenshot reali ispezionati: flusso di conferma nella stessa finestra e viewport 1440x900/1280x600; manifest di hash incluso. Immagini fuori runtime. Dati sintetici, profili isolati; nessun accesso ai dati operativi dell'utente.

## Limiti dichiarati e gate

La pulizia dei dati applicativi dell'origine di prova e verificata. Windows impedisce la rimozione di alcune directory temporanee isolate: il relativo campo cleanup=false rimane nei rapporti e non e dichiarato PASS di eliminazione. Non sono stati alterati i permessi globali o il profilo personale.
QA OPERATORE PENDING: i test non attestano l'usabilita percepita. Valutare la nuova finestra e un'importazione file senza passare a Oggetti GIS. Solo dopo attestazione esatta `QA GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX1 PASS operatore` applicare Regola H. DTM terreno HOLD, profilo XY senza quote separato, mobile PAUSA.

Il contenitore report non certifica il proprio commit: HEAD finale EXTERNAL_ONLY dopo push.

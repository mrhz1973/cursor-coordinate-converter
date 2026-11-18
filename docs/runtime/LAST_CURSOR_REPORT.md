# Build311 QA operatore PASS — CLOSED

BLOCK: GIS-TRACK-ARCHIVE-BATCH-10-A
GATE: QA GIS-TRACK-ARCHIVE-BATCH-10-A PASS operatore del 18/11/2026. Review GPT-SOSTITUTIVA DELICATO PASS, JS2/2, candidato30/30 e HTTPS30/30 PASS; review AI esterna NOT_PERFORMED/backstop.
CLOSURE: Regola H, documentazione esclusiva; runtime LIVE non modificato e nessun nuovo riavvio.
RUNTIME LIVE: Build311 source 4ddcb641b756ac987f619c2cd7fa09e236734147; SHA256 4381c1930a358fc8ad5842507a40a5d44caaa8466708e66c050991e5b2c0fc4d.
NEXT: blocco distinto P2 uniformità tabelle desktop; mobile PAUSA, DTM 5/10m accuratezza HOLD.
EVIDENCE: [Ricevuta QA](../orchestrator/evidence/2026-11-18-qa311-closure/REPORT.md).

## Pass runtime precedenti (storico, non LIVE STATE)

# Build311 LIVE — QA operatore PENDING
BLOCK: GIS-TRACK-ARCHIVE-BATCH-10-A
GATE: REVIEW GPT-SOSTITUTIVA PASS, JS2/2, candidato30/30 e HTTPS LIVE30/30 PASS, QA FINALE CHATGPT PENDING. Reviewer esterno NOT_PERFORMED.
RUNTIME LIVE: source 4ddcb641b756ac987f619c2cd7fa09e236734147; SHA256 4381c1930a358fc8ad5842507a40a5d44caaa8466708e66c050991e5b2c0fc4d.
DEPLOY: 18/11/2026 00:27:03 UTC; backup prebuild311-MUfXTpAv, GIS service active PID697099, HTTPS/file/HTTP concordi.
NEXT: QA operatore mirata importazione batch fino a 10 percorsi. DTM accuracy HOLD, mobile PAUSA.
EVIDENCE: [RELEASE](../orchestrator/evidence/2026-11-17-track-archive-batch-311/RELEASE.md).

## Pass precedenti (storico; non LIVE STATE)

# Build311 candidate — deploy BLOCCATO dallo strumento

BLOCK: GIS-TRACK-ARCHIVE-BATCH-10-A.
CANDIDATO: 4ddcb641b756ac987f619c2cd7fa09e236734147 / 4381c1930a358fc8ad5842507a40a5d44caaa8466708e66c050991e5b2c0fc4d.
GATE: REVIEW GPT-SOSTITUTIVA PASS, JavaScript 2/2, Edge candidato 30/30 PASS. Nessuna HTTPS QA Build311, nessun deploy, nessun PASS operatore.
LIVE: Build310, VPS active, SHA ff0c618e089a56cdba221e9f69d35273f0b34996c4e17be4ed6c013152373aea.
NEXT: attendere disponibilità percorso autorizzato per deploy GIS-only; non aggirare tool safety.
EVIDENCE: [Rapporto blocker](../orchestrator/evidence/2026-11-17-track-archive-batch-311/DEPLOY-BLOCKED.md).

## Pass storico (non LIVE STATE)

# Build310 QA operatore PASS — CLOSED

BLOCK: GIS-SAVED-TRACK-PROFILE-XY-A
GATE: QA GIS-SAVED-TRACK-PROFILE-XY-A PASS operatore del 17/11/2026; Regola H docs-only.
RUNTIME LIVE invariato: Build310 source e0b7e133dea16e38d083a53a50276a232609e8fd, SHA256 ff0c618e089a56cdba221e9f69d35273f0b34996c4e17be4ed6c013152373aea.
NEXT: P1 importazione batch archivio fino a 10 (non implementato). Reviewer esterno NOT_PERFORMED/backstop.
EVIDENCE: [QA ricevuta](../orchestrator/evidence/2026-11-17-qa310-closure/REPORT.md).

## Pass runtime precedente (storico, non LIVE STATE)

# Build310 GIS — profilo XY LIVE, QA operatore PENDING
BLOCK: GIS-SAVED-TRACK-PROFILE-XY-A
GATE: Review GPT-SOSTITUTIVA PASS; JS2/2, candidato30/30, HTTPS30/30. Reviewer AI esterno NOT_PERFORMED; QA operatore PENDING.
RUNTIME LIVE: source e0b7e133dea16e38d083a53a50276a232609e8fd; SHA256 ff0c618e089a56cdba221e9f69d35273f0b34996c4e17be4ed6c013152373aea.
NEXT: far provare Profilo > Calcola quote sulla traccia pennello salvata; conferma opt-in Open-Meteo solo quando consentita. DTM5/10m accuracy HOLD.
EVIDENCE: [RELEASE](../orchestrator/evidence/2026-11-16-track-profile-xy-310/RELEASE.md).

## Pass precedenti (storico; non LIVE STATE)

# Chiusura Build309 — QA operatore PASS / CLOSED
BLOCK: GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX2
PASS operatore ricevuto 16/11/2026. Regola H applicata tramite documentazione. Nessun deploy per la sola chiusura.
NEXT: GIS-SAVED-TRACK-PROFILE-XY-A (nuovo incarico profilo altimetrico, non ancora rilasciato).
Vivo Build309 source 8ddb70f1e02f24207c50baa3622b344023e5155c, SHA256 ad07d54d3a9e0242dfc482468feba32f0b3527e2b4101536daae0bc4b842c683.

## Evidenza tecnica del pass precedente (storica, non nuovo LIVE STATE)

# Build309 — Centra corrente
BLOCK: GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX2
GATE: QA FINALE CHATGPT PENDING / QA operatore PENDING.
NEXT: valutazione Centra dopo importazione della seconda traccia; successiva chiusura Regola H soltanto con PASS operatore.
RUNTIME LIVE: 8ddb70f1e02f24207c50baa3622b344023e5155c, Build309, SHA256 ad07d54d3a9e0242dfc482468feba32f0b3527e2b4101536daae0bc4b842c683.
Candidate deployed: YES. Statici 2/2; candidato e HTTPS LIVE 17/17 PASS.

## Riepilogo completo

# Build309 LIVE — Centra la traccia corrente

Data: 16 novembre 2026. Blocco `GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX2`. CLOSURE: STANDARD_RUNTIME_BUNDLE. Tier ROUTINE.

## Finding dell'operatore e scope

L'operatore ha descritto questa sequenza: disegno con pennello e salvataggio della prima traccia; importazione di una seconda traccia nella zona Traccia in modifica; assenza di un comando per ritrovare la seconda traccia sulla mappa. Richiesta esplicita: «ci vuole un pulsante con scritto centra».
Il feedback impedisce la chiusura positiva della Build308; nessun PASS operatore308 e stato dedotto o aggiunto. Questo FIX2 conserva il lavoro single-panel della Build308 e corregge il finding circoscritto.

Aggiunto `Centra` fra Salva ed Esporta nella zona corrente. Il comando e abilitato se esistono punti e richiama `flyMapToTrackPoints`, gia usata dalle tracce salvate. Il fit considera l'area libera dai pannelli e lo zoom. Non richiede il salvataggio preliminare della traccia corrente. Un singolo punto e centrabile; senza punti il comando e disabilitato.

Modifica runtime: 16 righe aggiunte e 4 rimosse, comprese identita Build309 e due sole stringhe IT. Nuovo handler collegato una sola volta alla creazione del pannello; stato del pulsante aggiornato dal sync esistente. L'helper di centratura e byte-identico alla base. Nessuna nuova dipendenza, endpoint, schema dati, parser o traduzione EN/FR.

## Identita e distribuzione

- Runtime source: `8ddb70f1e02f24207c50baa3622b344023e5155c`.
- Blob: `263e377652a9445634da253a3074e2175c419d49`.
- SHA256: `ad07d54d3a9e0242dfc482468feba32f0b3527e2b4101536daae0bc4b842c683`.
- Byte: 11.201.572; CR192 / CRLF0.
- HTTPS: https://ionos-n8n-new.tailc01234.ts.net/gis?v=ad07d54d
- Deploy GIS-only: 16 novembre 2026, 21:29:50 Europe/Rome. Un restart goi-gis-app; PID 1332131 → 2135386.
- Backup308: `/var/backups/goi-gis-runtime/20261116T202949Z-prebuild309`.
- VPS, HTTP interno e HTTPS nativo Windows: HTTP 200 e identita binaria concorde. [Ricevuta](runtime-identity.json).

## Review e verifiche

Review mirata ROUTINE PASS sul diff e sul contenuto corrispondente allo SHA runtime. Reviewer esterno non richiesto per questo intervento; la review sostitutiva/backstop della precedente Build308 resta storica.

- JavaScript inline 2/2 PASS e helper canonico invariato: [statici](static-checks.json).
- Edge candidato 17/17 PASS: [risultati](candidate-qa.json).
- Edge HTTPS LIVE 17/17 PASS: [risultati](live-qa.json).
- Ogni esecuzione usa 11 clic nativi e 2 aperture reali del selettore file. Zero POST, eccezioni JavaScript ed errori console.
- Prova centrale: importazione e salvataggio di una prima traccia GPX sintetica in Italia, importazione di una seconda a Sydney senza salvarla, click su Centra e verifica del fit di tutti i punti nell'area utile. La creazione originaria col pennello riferita dall'utente non e stata ripetuta: il test prepara il medesimo stato archivio/corrente mediante importazione e salvataggio canonici.
- Verificate separazione del target tra Centra archivio e Centra corrente, conservazione byte-identica della geometria corrente, quote originali e archivio, finestra 1280x600, antimeridiano, punto singolo, disabilitazione senza punti e ripristino del layout desktop dopo il breakpoint mobile.
- Screenshot realmente ispezionati: candidato 1280x600 e HTTPS LIVE 1440x900; entrambe le immagini sono conservate in questo dossier. [Manifest](screenshots-manifest.json).
- Test con dati sintetici in profili Edge isolati e richieste esterne intercettate. Nessun dato del profilo personale usato. Pulizia dei dati e rimozione dei profili di test PASS in entrambi i run.
- Nessuna regressione estesa fuori scope rieseguita; le prove Build308 gia consumate restano nel dossier precedente.

## Gate residuo

QA OPERATORE PENDING. Valutare nel proprio uso lo stesso caso di importazione della seconda traccia e il pulsante Centra. Attestazione, esclusivamente dopo esito positivo: `QA GIS-TRACK-IO-CURRENT-ARCHIVE-A-FIX2 PASS operatore`.
Nessun avanzamento del backlog prima della chiusura valida. DTM terreno HOLD, profili XY separati, sviluppo mobile PAUSA.

## Note di esecuzione

Un primo tentativo del controllo statico ha incontrato il limite di buffer del runner Node; corretto il buffer, i due script sono stati verificati. Un'uscita iniziale di git status sul clone --no-checkout era troppo ampia: finding TOOL-PAYLOAD-GUARD, verifiche successive limitate. Il push HTTPS dal workspace cloud non disponeva di credenziali di scrittura: pubblicazione effettuata tramite il Git gia autorizzato del PC Windows. Nessuna modifica di credenziali o permessi.

## Autosync e identita del rapporto

real_task_commit: 8ddb70f1e02f24207c50baa3622b344023e5155c
REMOTE_HEAD_AT_EVIDENCE_TIME: 8ddb70f1e02f24207c50baa3622b344023e5155c
current_report_container: PENDING_SELF_REFERENCE
Autosync publication verification: EXTERNAL_ONLY

Il contenitore documentale include FRONTIER, dossier, latest, inbox e LAST_CURSOR_REPORT; il monolite e escluso. Working tree al momento di stesura: documenti del presente intervento in preparazione. Verifica clean/remoto dopo commit e push: EXTERNAL_ONLY.

## Output Git prima del contenitore documentale

```text
git log --oneline -5:
8ddb70f fix(gis): center current imported track from desktop panel
bfa3ea6 docs(gis): backlog operator table resize batch elevation and single HTTPS
git rev-parse HEAD:
8ddb70f1e02f24207c50baa3622b344023e5155c
git rev-parse origin/main:
8ddb70f1e02f24207c50baa3622b344023e5155c
git branch --show-current:
main
git ls-remote origin refs/heads/main:
8ddb70f1e02f24207c50baa3622b344023e5155c	refs/heads/main
```

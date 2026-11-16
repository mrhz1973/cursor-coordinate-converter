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

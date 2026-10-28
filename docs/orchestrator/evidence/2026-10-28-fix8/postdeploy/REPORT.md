# AUTOMATED BROWSER QA — GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX8 — PASS

Esecuzione 28 ottobre 2026, successiva al VIA deploy dell'orchestratore. Runtime reale HTTP: http://100.99.54.93:8000/coordinate_converter%20Claude.html

Candidate 762fb1605a7c20b3b7bd21a6b0cfa1c04f8e4739, build 265, blob 5da70951b43300f5165448049ba8c20a2f8ae867. SHA-256 HTTP atteso e osservato: 0c39ce77e27b2d0116faa0638eec30020fd0e2865eab14bb024a487c92357145, 10 904 249 byte.

## Evidence runtime reale

Il documento è stato caricato dalla URL HTTP effettiva dal browser, senza mock, route.fulfill o server locale. Un GET HTTP separato prima di ciascun viewport verifica byte/hash; la navigazione browser verifica HTTP200, Content-Length10904249 e Last-Modified identico. Un ulteriore GET dopo tutte le prove riconferma HTTP200, dimensione e SHA attesi, timestamp 2026-10-28T12:15:44.725Z. Last-Modified coerente: Wed, 28 Oct 2026 12:13:32 GMT.

Motivo tecnico dell'adattamento: il body da10.9MB veniva espulso dalla cache inspector Chromium, impedendo response.body(); due tentativi iniziali si sono fermati prima dei test senza alcun finding applicativo. Hash quindi misurato tramite GET HTTP reale separato, prima/dopo, non attribuito al body recuperato dalla cache browser. Metodo accettato dall'orchestratore. Nessun mismatch rilevato.

## Risultati

- 12 punti mondiali per desktop1440x1000 e mobile emulato390x844: 24/24 PASS.
- Campione: Rome, Nairobi, CapeTown, Tokyo, Jakarta, Sydney, Wellington, NewYork, BuenosAires, McMurdo, AntiWest, UTMMax.
- Inserimento DD con azioni browser fill+Invio nel campo Cerca. Controllati lastPoint, viewCenter, testo PUNTO DOM (valori ed emisferi), marker renderizzato e suo centro rispetto alla geometria mappa. Confronti indipendenti con lat/lon campione; lon modulo360.
- Sei gate (strict, geocoding disabilitato, offline ×2viewport): 6/6 PASS; ricerca Roma non muta il punto e genera zero tentativi Nominatim. In questi sei pass non è stata osservata alcuna richiesta esterna.
- Zero errori JavaScript di pagina.
- Screenshot per Rome/McMurdo/AntiWest su entrambi i viewport. desktop-Rome e mobile-AntiWest ispezionati visivamente.

Ogni richiesta diversa dalla navigazione al documento viene registrata e bloccata dall'harness. Il test verifica tentativi e assenza di bypass dei gate nelle azioni esercitate, non salute/live response di servizi provider. Le basemap mostrano placeholder intenzionali perché le tile sono bloccate. Sono test sul runtime HTTP reale; non sono test di percorsi stradali/land-only o successo dei provider. Nessuna mutazione server, deployment, commit o push eseguiti da questo agente.

## Limiti residui

Mobile è emulato, non dispositivo fisico. La UI mobile appare ridotta; il pannello Cerca può sovrapporsi al marker. Le coordinate e la geometria DOM sono corrette, ma leggibilità, comodità touch e performance percepita richiedono valutazione umana. Questo PASS ABQA è distinto da QA operatore, che resta PENDING.

## Etichette verificate sul runtime HTTP

ui-labels.json proviene da una lettura DOM del runtime reale: Converti (barra superiore); Input automatico; Rileva e converti; Input manuale guidato; Testo libero; Converti (azione); Cerca. Il campo Cerca ha placeholder es: Abidjan, Côte d'Ivoire — oppure 'Torre di Pisa'. Non esiste un pulsante denominato Incolla in questa sezione: l'incolla avviene nel campo Input automatico.

## Tre controlli residui proposti all'orchestratore

1. Su desktop e sul dispositivo mobile abituale, aprire Cerca e inserire 41.8908, 12.4922. Valutare visibilità e leggibilità di marker/PUNTO con pannello aperto e minimizzato, dimensioni dei controlli e assenza di sovrapposizioni che impediscano l'uso.
2. Aprire Converti → Input manuale guidato → Testo libero; usare 45,5; 9,2 e Converti. Nel campo Input automatico usare lo stesso testo e Rileva e converti. Valutare accessibilità dei campi/pulsanti, leggibilità dei risultati e fluidità di apertura/scorrimento/chiusura.
3. In Testo libero e Input automatico provare DD 44 6 9 49: valutare chiarezza e visibilità del messaggio di errore; correggere in DD 44.1 9.8 e valutare recupero dell'interazione senza blocchi o ritardi percepiti. Le verifiche numeriche, OPSEC/offline/rete sono già tecniche e non sono richieste all'operatore.

Attestazione da raccogliere soltanto se l'operatore ha completato positivamente i controlli: QA GIS-SEARCH-COORD-VALIDATION-CENTER-A-FIX8 PASS operatore. In alternativa raccogliere finding specifico con dispositivo e schermata coinvolta. Nessuna attestazione dedotta automaticamente.

## File

postdeploy-results.json contiene tutte le24righe,6gate, le richieste intercettate e identità prima dei viewport. postdeploy-hash-after.json contiene verifica finale. postdeploy.cjs e postdeploy-hash-after.cjs sono harness eseguiti; percorsi di input/output relativi alla root della chat, campione in work/geodesy/cases.json, copia candidate attesa in work/qa-fix8-final/candidate.html. Il runtime HTML non è incluso in questa directory evidence: è ricostruibile dal commit candidate. Screenshot postdeploy-*.png e ui-labels.json completano l'evidence.
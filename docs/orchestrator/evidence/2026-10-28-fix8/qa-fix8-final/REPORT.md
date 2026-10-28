# FIX8 finale — verifica locale dopo allineamento endpoint

Candidate commit 762fb1605a7c20b3b7bd21a6b0cfa1c04f8e4739; blob Git 5da70951b43300f5165448049ba8c20a2f8ae867; build 265.
Copia immutabile candidate.html SHA-256 0c39ce77e27b2d0116faa0638eec30020fd0e2865eab14bb024a487c92357145 verificata prima dei test.

## PASS locale nello scope rieseguito

- Diff finale rispetto parent: esattamente 6 righe sostituite (+6/-6), URL/IP e relative asserzioni; nessuna modifica parser o gate logici.
- Arity UI: 41/41 helper, 12/12 interazioni Cerca/Converti/Incolla/routing; zero pageerror. Evidence arity-ui.json.
- Ricerca luogo Roma con strict, geocoding disabilitato, offline: 3/3, zero tentativi Nominatim, punto invariato. Evidence ui-place-gates-results.json, hash finale incluso.
- 12 punti mondiali desktop + mobile: 24/24, numeri/segni PUNTO DOM, lastPoint, viewCenter, posizione CSS marker al centro della mappa; zero pageerror. Evidence world-ui.json e screenshot.
- Boot ?debug runSelfCheck: Self-check passed, zero assert falliti e zero pageerror. Evidence selfcheck.json.

Le regressioni estese e gli editor sul precedente hash coordinate c570bee5 restano conservati in ../qa-fix8; il confronto finale prova assenza di modifiche al codice coordinate. Tutti i test sopra sono nuove esecuzioni sul file finale, non risultati riciclati.

Limiti: richieste esterne intercettate e bloccate, servizi provider e cartografia non collaudati da questo test. Mobile emulato, non hardware; stessi limiti percettivi e di sovrapposizione pannello/marker documentati nel precedente report. Nessun deploy o QA operatore attestati.

## Harness postdeploy pronto, NON eseguito

postdeploy.cjs, sintassi verificata con node --check. Parametro obbligatorio URL documento, nessun mock o server locale del documento: il browser carica realmente l'URL e calcola SHA-256 della response HTTP; richiede HTTP 200 e hash finale atteso prima delle prove. Ogni altra richiesta è registrata e bloccata. Copre 12 punti globali su desktop e mobile, sei prove gate (strict/geocoding-off/offline per viewport), screenshot e exit nonzero per mismatch/fail/errori. Salva postdeploy-results.json.

Solo dopo via dell'orchestratore:

node work/qa-fix8-final/postdeploy.cjs 'http://100.99.54.93:8000/coordinate_converter%20Claude.html'

Il documento verrà recuperato realmente dal runtime HTTP pubblicato. Questo report non attesta l'esito postdeploy: harness preparato soltanto.
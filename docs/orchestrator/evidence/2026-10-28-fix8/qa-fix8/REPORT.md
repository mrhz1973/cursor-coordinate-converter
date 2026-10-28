# FIX8 — QA browser locale indipendente, 28 ottobre 2026

Runtime build 265; copia immutabile candidate.html, SHA-256 LF c570bee51534ccba73352bd650b9bb6be55b414dfbbfd1e568abd323a9368ea3 verificato prima e dopo. Hash confermato finale dall'implementatore. Commit candidate da associare dall'orchestratore.

## Esito delle verifiche completate: PASS locale per scope testato

| Suite | Esito | Evidence |
|---|---|---|
| Matrice storica desktop 1440x2200 | 38/38 helper, 48/48 interazioni | matrix-desktop.json |
| Matrice storica mobile emulato 390x844 | 38/38 helper, 48/48 interazioni | matrix-mobile.json |
| Nuovi prefissi invalidi, desktop | 41/41 helper, 12/12 interazioni | arity-ui.json |
| Editor desktop | waypoint 4/4, poligono 4/4 | editors-desktop.json |
| Editor mobile emulato | waypoint 4/4, vertice poligono 4/4 | editors-mobile.json |
| 12 punti globali su desktop e mobile | 24/24 | world-ui.json |
| Ricerca luogo sotto strict/geocoding-off/offline | 3/3, zero tentativi Nominatim e punto invariato | ui-place-gates-results.json |

Zero pageerror nelle suite coordinate/editor/globali.

Il FAIL FIX7 è risolto nelle interazioni browser: DD 44 6 9 49, DDM 44.1 9.8, DMS 44.1 9.8 sono rifiutati da Cerca, Converti, Incolla e routing; sentinel 10/20 conservato. Lo script arity-ui.cjs e le suite matrix/editors originali sono in ../qa-fix7 e ricevono esplicitamente candidate.html FIX8 come argomento. Non riusano risultati storici.

## Punti globali e DOM realmente reso

Campione proveniente dalla matrice indipendente geodesy/cases.json: Rome, Nairobi, CapeTown, Tokyo, Jakarta, Sydney, Wellington, NewYork, BuenosAires, McMurdo, AntiWest, UTMMax. Inserimento DD mediante fill e Invio nel campo Cerca su entrambi i viewport.

Per ogni punto sono confrontati lastPoint, viewCenter (longitudine modulo 360), testo DOM PUNTO con numeri ed emisferi attesi indipendenti, marker DOM e posizione CSS centrata rispetto alle dimensioni reali della mappa (tolleranza 2 pixel). Non si usa il formatter applicativo come oracolo del testo. Controllo coordinate a 1e-8 gradi, testo a 1e-5 gradi. McMurdo e latitudine 84 sono inclusi; nessuna pretesa di rappresentare i poli esatti con Mercatore.

Screenshot desktop/mobile per Rome, McMurdo e AntiWest. desktop-Rome.png e mobile-AntiWest.png ispezionati visivamente: marker e PUNTO presenti, numeri coerenti. Le basemap mostrano placeholder perché richieste esterne bloccate intenzionalmente. Su mobile emulato la UI appare molto ridotta e il pannello Cerca può sovrapporsi al marker: la qualità percettiva e l'occlusione completa non sono certificate da questa suite. La verifica del centro riguarda il centro geometrico della mappa renderizzata, non una zona libera dal pannello.

## Metodo e limiti

Chromium reale headless locale con Playwright già installato, server HTTP effimero che serve esclusivamente byte della copia candidata. Nessun contatto ai provider esterni: richieste intercettate prima del blocco, conteggiando anche tentativi geocoding. Nella matrice storica l'unica ricerca luogo consentita riceve risposta simulata vuota; nelle prove OPSEC le richieste sono contate e bloccate. I gate sono predisposti via evaluate; input e Invio reali.

Alcuni pannelli e tab sono aperti via evaluate; compilazione e salvataggio avvengono come interazioni browser. Converti può usare Invio sul pulsante focalizzato dopo timeout click perché fuori viewport, come dichiarato in JSON. Emulazione mobile non equivale a dispositivo fisico. L'harness editor mobile con offset desktop crea due vertici invece di tre: sono verificate modifica e validazione del primo vertice, non la chiusura del poligono mobile. Desktop crea correttamente tre vertici.

Nessun deploy, test VPS o ABQA post-deploy; nessuna attestazione QA operatore. PASS locale non autorizza da solo il gate globale. Nessuna modifica runtime effettuata dall'agente QA.

## Riproduzione

Da root della chat: node work/qa-fix7/matrix.cjs work/qa-fix8/candidate.html work/qa-fix8/matrix-desktop.json; analogamente matrix-mobile.cjs, arity-ui.cjs ed editors-ui.cjs. Gli script world-ui.cjs e place-gates.cjs sono nella cartella FIX8. Dipendenze e percorso Chromium sono espliciti negli harness. Output misurati e screenshot rimangono accanto al report.
## Estensione prefissi validi/invalidi mobile

Completata prefix-mobile.json: 44/44 helper e 24/24 interazioni Cerca/Converti/Incolla/routing, zero pageerror. Tre input invalidi sopra più DD 44.1 9.8, DDM 44 6 N 9 48 E e DMS 44 6 0 N 9 48 0 E: validi tutti a 44.1/9.8, invalidi tutti conservano sentinel. Harness prefix-mobile.cjs. Tutti i test FIX8 conclusi sullo stesso hash immutabile.


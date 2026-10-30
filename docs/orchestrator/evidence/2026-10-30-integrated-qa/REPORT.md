# QA browser e self-check sul monolite integrato

30 ottobre 2026. File letto dal checkout `work/mart-gis/coordinate_converter Claude.html`, SHA-256 `e5f01fcdd299c90c559121fc7ee8627f85dedbdae76021a9c1822a3dcbc5c2c5`. L'hash coincide nei risultati dei runner e nella verifica del file dopo le prove. Nessuna modifica al checkout o al VPS.

## Routing

Matrice Chromium, desktop 1440×960 e mobile emulato con touch 390×844: **24/24 casi passati**, nessun errore JavaScript di pagina. I 12 casi per viewport comprendono GraphHopper e ORS con VIA, alternative, andata/ritorno, anello, errore no-land e blocchi OPSEC strict/offline. Risultati dettagliati e screenshot in questa cartella: `results-final.json` e `final-*.png`.

Il runner `routing.cjs` è una copia di `routing-browser-qa/check-final.cjs` adattata solo per leggere il monolite corrente, verificare il nuovo SHA e scrivere qui gli artefatti. I provider e i controlli di disponibilità rispondono con mock deterministici; le altre richieste non locali sono intercettate e abortite. Coordinate sintetiche vengono impostate tramite funzione applicativa, quindi i test verificano payload e gestione UI con risposte simulate, non il comportamento dei provider live o la qualità delle rotte. Il mobile è emulato. Il testo `limits` generato nel JSON afferma erroneamente che i gate strict/offline non sono inclusi: i quattro casi corrispondenti risultano effettivamente presenti e passati. Il controllo ausiliario `providerRequestsStayedMocked` usa un indice derivato dal numero di richieste provider per scorrere l'elenco di richieste esterne, pertanto non è una verifica autonoma affidabile; la policy di intercettazione del runner soddisfa comunque i provider con mock.

## Self-check integrati

I runner usano profili Chromium nuovi e intercettano la rete non locale. Per ogni viewport, il runner verifica il messaggio di debug e invoca `GOIDflight.selfTest()` in una seconda sessione. Risultati in `integrated-results.json` e `integrated-320-results.json`.

| Viewport | Debug | GOIDflight.selfTest |
| --- | --- | --- |
| 1280×720 | Passato, nessuna assertion | 919/919 |
| 1920×900 | Passato, nessuna assertion | 919/919 |
| 390×844 | Passato, nessuna assertion | 922/922 |
| 320×720 | Fallito: assertion D-FLIGHT | 917/922 |

A 320×720, cinque controlli falliti: `HitA_FIX1_info_above_efp`, `HitA_FIX1_single_dispatch_info`, `DOCK_GA1_all_chips_rendered` (`chips=2`), `WSF1_A_both_sbs`, `WSF1_B_solo_df_right`. La ripetizione indipendente sullo stesso SHA ha dato esattamente gli stessi risultati (`integrated-320-repeat-results.json`). Il precedente risultato archiviato `selftest-fix/integrated-320-results.json` sullo SHA `b5a8c27f60f350ef1b914d29de4efefb7aa89d9c5cca4cce5ee972a8c521d6b5` registra la stessa assertion e gli stessi cinque fallimenti: sono quindi coerenti con un limite preesistente, non una regressione dimostrata della patch UI. Non si deve interpretare l'exit code zero del runner 320 come esito positivo: il runner registra gli errori in JSON ma non li traduce in codice di uscita.

La prima esecuzione dei self-check 1280/1920/390 in parallelo al routing ha passato 1280 e 1920 ma ha esaurito il timeout originale di 10 secondi attendendo il messaggio debug a 390; non ha prodotto un risultato completo. La ripetizione separata è passata su tutte e tre le larghezze dopo aver modificato solo il timeout dell'harness da 10 a 30 secondi. I runner sono copie fuori checkout; nessun codice applicativo è stato cambiato per le prove.

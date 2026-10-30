# QA integrato dopo patch touch

30 ottobre 2026. File di checkout letto direttamente dai runner: `work/mart-gis/coordinate_converter Claude.html`, SHA-256 `2cb519c390b21ef5034f8254a44c850e8f474f0d6ba7fae4f1663de8b747d02b`. Entrambi i risultati registrano questo SHA; la verifica del file dopo le prove coincide. Nessuna modifica al checkout o al VPS.

## Self-check

Chromium locale, profili separati e richieste non locali intercettate. Per ciascuna risoluzione il runner attende il messaggio di conclusione di `?debug` (timeout 30 s), quindi avvia il self-test aggregato in un nuovo profilo. Nessun timeout, assertion, errore JavaScript di pagina o errore console registrato nei criteri del runner.

| Viewport | Debug | Aggregato |
| --- | --- | --- |
| 320×720 | Passato | 924/924 |
| 390×844 | Passato | 922/922 |
| 1280×720 | Passato | 919/919 |
| 1920×900 | Passato | 919/919 |

Dettagli `selfcheck-results.json`; `selfcheck.cjs` è una copia del runner precedente con 320×720 aggiunto al ciclo e destinazione degli artefatti spostata in questa cartella. Il runner può restituire exit code zero anche se un'asserzione fallisce: i risultati JSON sono stati controllati esplicitamente.

## Routing

Chromium desktop 1440×960 e mobile emulato con touch 390×844: **24/24 casi superati**, zero errori JavaScript di pagina. Coperti per GraphHopper e ORS: VIA, alternative, andata/ritorno, anello, errore no-land e blocchi OPSEC strict/offline. I provider e i controlli di disponibilità sono simulati; altre richieste non locali sono intercettate e abortite. I dati sono sintetici e le coordinate vengono impostate tramite funzione applicativa; queste prove non attestano la qualità o la topologia delle rotte reali e non sono prove su hardware fisico. Risultati e screenshot: `results-final.json`, `final-*.png`; `routing.cjs` riprende il runner precedente con SHA atteso e destinazione aggiornati.

Il testo `limits` generato nel JSON del runner afferma erroneamente che i gate strict/offline non sono inclusi: i quattro casi sono presenti e passati. Il controllo ausiliario `providerRequestsStayedMocked` usa un indice derivato dal numero di richieste provider per scorrere l'elenco di richieste esterne, quindi non costituisce una verifica autonoma affidabile; il runner intercetta e soddisfa le richieste provider con mock. Non sono stati eseguiti test di servizi live.

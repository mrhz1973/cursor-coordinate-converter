# QA integrata — Workbench e provenienza UTM

30 ottobre 2026. Monolite letto direttamente dal checkout `work/mart-gis/coordinate_converter Claude.html`; SHA-256 prima e dopo le prove: `b6f0fca1937ee2f79375ddd34af0377644982774b9764a62745af2d88d9598fb`. Lo stesso digest è registrato dai runner di nucleo UTM, self-check e routing. Il runner Edge UTM naviga direttamente al file tramite `file:` e l'hash è stato verificato prima e dopo il suo utilizzo. Nessuna modifica al checkout o al VPS.

## Self-check

Chromium headless, profili distinti, richieste non locali intercettate. Ogni prova attende il messaggio finale `?debug` con timeout di 30 s e invoca `GOIDflight.selfTest()` in un altro profilo. Nessun timeout, assertion, errore console registrato o pageerror.

| Viewport | Debug | Aggregato |
| --- | --- | --- |
| 320×720 | Passato | 924/924 |
| 390×844 | Passato | 922/922 |
| 1280×720 | Passato | 919/919 |
| 1920×900 | Passato | 919/919 |

Dettagli in `selfcheck-results.json`. Il runner è una copia della precedente prova integrata, con sola destinazione dei risultati cambiata. Poiché non traduce le assertion in exit code, i risultati JSON sono stati controllati esplicitamente.

## Routing

Chromium desktop 1440×960 e mobile touch emulato 390×844: **24/24 casi superati**, zero errori JavaScript di pagina e nessun timeout. La matrice comprende per GraphHopper e ORS VIA, alternative, andata/ritorno, anello, errore no-land e gate OPSEC strict/offline. Richieste provider e disponibilità sono soddisfatte con mock deterministici; le altre richieste non locali sono intercettate e abortite. Non è stato contattato alcun servizio di routing live. Risultati, payload e screenshot in `results-final.json` e `final-*.png`.

Il runner è copiato dalla precedente prova integrata con SHA atteso e cartella di output aggiornati. Nel JSON il testo `limits` sostiene erroneamente che i gate strict/offline non sono inclusi: i quattro casi sono presenti e passati. Il controllo ausiliario `providerRequestsStayedMocked` usa un indice derivato dal numero di richieste provider per scorrere un elenco diverso e non costituisce verifica autonoma affidabile; la policy di intercettazione soddisfa invece le richieste provider con mock. L'inizializzazione delle coordinate è eseguita tramite funzione applicativa, non tramite immissione manuale. Il mobile è emulato.

## Provenienza UTM

`utm-core.cjs`, adattato soltanto a leggere il monolite e il file di riferimento dai rispettivi percorsi originali, è passato: entrambi gli script inline, 594 vettori GEOTRANS, sei precisioni, due double adiacenti, sorgenti incoerenti e fallback di zona. Dettagli in `utm-core-log.txt`.

`utm-browser.cjs`, adattato per navigare direttamente al monolite anziché al candidato di staging, è passato su Edge headless con profilo isolato e richieste HTTP(S) bloccate. La suite esercita immissione, copia, batch, esportazioni preparate, redraw, punto e centro, GPS simulato, waypoint e tracce, i formati dell'editor, invalidazione della sorgente, salvataggio/rollback e ricarica con record legacy e sorgente corrotta. `utm-browser-log.txt` contiene l'esito, inclusa la persistenza dopo reload. L'attesa di avvio browser e applicazione non ha raggiunto i timeout del runner. Il test usa appunti simulati e dati sintetici; non verifica tutti i file esportati fisicamente, tutte le possibili interazioni mappa o dispositivi fisici. Il rapporto originale UTM documenta ulteriori limiti di zone, confini e provenienza.

# QA finale integrata — toolbar landscape

30 ottobre 2026. Monolite letto direttamente dal checkout `work/mart-gis/coordinate_converter Claude.html`, SHA-256 prima e dopo le prove `fcc92f798b30e9bd0ffb60102f75ba847415c0bb0e5ee89d66b0ad07f9e8eb93`. I runner che calcolano l'hash lo riportano nei rispettivi risultati. Nessuna modifica al checkout o al VPS; profili isolati e dati sintetici.

## Risultati

- **Self-check Chromium:** debug positivo a 320×720, 390×844, 1280×720 e 1920×900; aggregato rispettivamente 924/924, 922/922, 919/919 e 919/919. Nessuna assertion o pageerror. Il JSON `selfcheck-results.json` registra inoltre due errori console `ERR_CONNECTION_REFUSED`, spiegati sotto.
- **UTM:** nucleo positivo con 594 vettori GEOTRANS e controlli di precisione e provenienza (`utm-core-log.txt`); suite Edge positiva con conversione, copie, editor, batch, ricarica e persistenza (`utm-browser-results.json`).
- **Conflitti waypoint:** 83 casi, inclusi 36 cambi di formato, passati in Edge (`conflict-results.json`).
- **Routing:** 24/24 casi mock passati, 12 desktop 1440×960 e 12 mobile emulato 390×844; nessun pageerror (`results-final.json`, screenshot `final-*.png`). Include VIA, alternative, andata/ritorno, anello, no-land e gate strict/offline per i due provider.
- **Smoke toolbar:** a 568×320, apertura dialogo cartografico, attivazione overlay MGRS, chiusura Esc con focus restituito, cambio gruppo e tap su mappa con Traccia in pick sono riusciti (`toolbar-smoke-retry.json`), nessun pageerror.

Nessuna delle esecuzioni finali sopra ha raggiunto un timeout. L'ambiente è stato lento; i runner browser sono stati eseguiti in sequenza. Nel runner routing sono state aumentate le attese a 60 s per avvio/navigazione e 30 s per le azioni; l'attesa della fine richiesta usa ora il parametro timeout corretto e non sopprime eventuali timeout. Self-check usa 60 s per il messaggio finale, runner Edge 60 s per le attese di avvio. Nessun codice dell'app è stato modificato per il test.

## Errori di risorsa

Il primo debug ha registrato `ERR_CONNECTION_REFUSED` a 1280 e 390 px senza URL. Nel replay strumentato (`request-failures.json`) il caso a 1280 si è ripresentato ed è attribuito a `GET http://127.0.0.1:8010/dataset`: il runner lascia passare gli indirizzi loopback e il servizio locale ha rifiutato la connessione. Il sorgente dei self-check usa quell'indirizzo come override D-Flight. Nel replay a 390 il rifiuto non si è ripresentato, quindi non è possibile attribuire con certezza l'errore originario a una specifica richiesta. In entrambi i replay il debug è passato e non ci sono pageerror. Le richieste verso font, Open-Meteo e tile esterni sono state abortite dal blocco di rete e risultano `ERR_FAILED`; i relativi dettagli sono nel JSON.

## Primo esito smoke e confronto

Il primo smoke (`toolbar-smoke.json`) ha letto zero punti dopo 200 ms e ha fallito. L'app differisce intenzionalmente l'aggiunta del punto per 260 ms (`TRACK_PICK_DEFER_MS`) per distinguere il doppio tap: il controllo era prematuro. Nel confronto con il candidato revisionato `cf561136…`, esiti anticipati sono comparsi anche sulla versione precedente; con attesa sufficiente entrambi i file aggiungono il punto con e senza overlay (`toolbar-compare.json`, `toolbar-compare-quick.json`). Il retry attende esplicitamente la comparsa del punto, per massimo 10 s, ed è passato. Il primo risultato e i log sono conservati.

## Limiti

Routing e disponibilità provider sono simulati; nessun provider live è stato contattato. I punti routing vengono predisposti tramite funzione applicativa. Il JSON routing contiene un testo `limits` obsoleto che afferma che i gate strict/offline non siano inclusi: i quattro casi sono presenti e passati. Il controllo ausiliario `providerRequestsStayedMocked` usa un indice derivato da un elenco diverso e non è una verifica autonoma affidabile; le richieste provider sono comunque intercettate e soddisfatte dai mock. I test UTM usano appunti simulati e verificano dati preparati per export, non ogni file fisico. Lo smoke è circoscritto; non sostituisce prove su Android/iPhone/tablet reali, tastiera virtuale, screen reader, GPS, rete, tutti i layer o tutti i flussi di disegno.

# Build 273 — oscillazione orizzontale su iPhone

## Evidenza dell’utente

Il video fornito dura 1,03 s ed è largo 1106×512 pixel. La barra del browser rimane ferma mentre si muovono insieme intestazione e mappa. Nei fotogrammi analizzati, alla riga verticale 155 del video, una banda scura alterna circa 56 pixel a sinistra e 108–112 pixel a destra. Sono pixel del video, non misure CSS o del DOM. Il video mostra una UI del browser che appare Edge; non identifica da solo la versione iOS o il comportamento di Safari.

La Build 273 rimane difettosa secondo il riscontro dell’utente. Il precedente controllo dell’altezza in Chromium non ha verificato il movimento orizzontale visto nel video.

## Indagine sul codice e prova locale

- `visualViewport.resize` e `window.resize` riposizionano il menu Layer se è aperto. Il `ResizeObserver` della mappa è limitato alle variazioni di larghezza e raggruppa i ridisegni con debounce; la review non ha trovato scritture cicliche a larghezza o scroll orizzontale della pagina.
- Su Edge/Chromium con touch emulato, sia Build 271 sia Build 273 hanno `scrollWidth = clientWidth` e `scrollX = 0` sui viewport 844×390 e 667×375, dopo rotazione e apertura Layer. Nel replay delle larghezze alternanti il `ResizeObserver` ha portato a un solo ridisegno dopo il debounce, senza un ciclo successivo. Questi risultati riguardano Chromium emulato e non escludono un difetto WebKit/iOS.
- Il codice landscape usa l’inset sinistro per entrambi i lati dell’header e una regola tablet più specifica cambia il layout dell’header oltre 768 px. Sono rischi individuati nella review, non cause dimostrate dello sfarfallio.

La causa effettiva resta **sconosciuta**: video e test disponibili non distinguono scroll root, cambi del viewport visuale, geometria o compositing su iPhone. Non è stata applicata una patch speculativa al runtime.

## Sonda per iPhone fisico

`diagnostica-viewport-273.html` è una pagina opt-in: scarica il runtime dallo stesso server/origine, ne controlla lo SHA-256 della Build 273 e lo riapre nel documento principale con una sonda aggiunta. La sonda misura per 30 secondi dimensioni, rettangoli DOM, viewport visuale, inset ed eventi. Mostra il risultato da copiare e **non lo invia automaticamente**; il report non contiene coordinate, contenuti delle mappe o dati salvati. Il GIS viene comunque eseguito normalmente e può leggere i propri dati locali e caricare le risorse previste dalle sue impostazioni. La pagina strumentata condivide origine e storage del GIS; l’iniezione e il piccolo indicatore aggiungono un possibile effetto di osservazione, quindi la riproduzione sul dispositivo va confrontata con il video originale.

Il controllo locale della sonda in Edge emulato ha verificato hash del file, caricamento della 273, apertura Layer, stessa origine e percorso, persistenza di una sentinella localStorage, acquisizione automatica, risultato disponibile nel campo testo, assenza di POST della sonda e zero errori JS. Non è una prova su Safari o su un iPhone fisico.

Il replay automatico di 30 secondi ha prodotto tutti i controlli funzionali PASS e il JSON, ma il processo è rimasto fermo nella chiusura del browser ed è stato interrotto. Il runner è stato corretto per chiudere le connessioni locali prima del browser; un successivo replay breve è terminato con exit 0. Questo limite di cleanup non è un esito Safari.

La sonda statica è pubblicata sul VPS all’[indirizzo diagnostico](http://100.99.54.93:8000/diagnostica-viewport-273.html), commit `a4f9a81308ecd776c833402f058d81dc6cad65cd`, SHA-256 `15c48f830341b1237083d90a02690a0a3588e6f721bab1980f6c8b3681462380`. Il deploy ha verificato che il runtime restasse SHA `4d608550a63261c0d7b6d5088c6bd6d1c62c3fe521253341ccad19f99f1d996a`, senza riavviare il servizio GIS; gli altri servizi sono rimasti invariati. Una successiva sessione SSH strict ha confermato worktree pulito e servizio attivo; dal PC la pagina risponde HTTP 200.

Un [replay live](live-diagnostic-smoke-results.json) in Edge touch emulato ha aperto la sonda via HTTP Tailscale, esercitato il calcolo SHA senza WebCrypto e prodotto il campo risultato senza POST o errori JS. Anche questo è un controllo del loader, non una prova fisica.

## Prossimo passo

Raccogliere la telemetria sullo stesso iPhone mentre si verifica il tremolio. Se cambiano `scrollX` o `scrollWidth`, cercare lo scorrimento/elemento responsabile; se cambiano viewport o rettangoli, seguire gli eventi correlati; se le misure restano stabili mentre il video salta, indagare il disegno/compositing. Solo dopo la misura applicare la modifica circoscritta e ripetere la prova sul dispositivo reale.

Evidenze: [`video-edge-timeline.json`](video-edge-timeline.json), [`geometry-results.json`](geometry-results.json), [`diagnostic-smoke-results.json`](diagnostic-smoke-results.json), [`diagnostic-smoke-auto-results.json`](diagnostic-smoke-auto-results.json).

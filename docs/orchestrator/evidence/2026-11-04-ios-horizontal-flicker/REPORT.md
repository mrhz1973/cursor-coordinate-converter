# Build 273 — oscillazione orizzontale su iPhone

## Evidenza dell’utente

Il video fornito dura 1,03 s ed è largo 1106×512 pixel. La barra del browser rimane ferma mentre si muovono insieme intestazione e mappa. Nei fotogrammi analizzati, alla riga verticale 155 del video, una banda scura alterna circa 56 pixel a sinistra e 108–112 pixel a destra. Sono pixel del video, non misure CSS o del DOM. Il video mostra una UI del browser che appare Edge; non identifica da solo la versione iOS o il comportamento di Safari.

La Build 273 rimane difettosa secondo il riscontro dell’utente. Il precedente controllo dell’altezza in Chromium non ha verificato il movimento orizzontale visto nel video.

## Indagine sul codice e prova locale

- `visualViewport.resize` e `window.resize` riposizionano il menu Layer se è aperto. Il `ResizeObserver` della mappa è limitato alle variazioni di larghezza e raggruppa i ridisegni con debounce; la review non ha trovato scritture cicliche a larghezza o scroll orizzontale della pagina.
- Su Edge/Chromium con touch emulato, sia Build 271 sia Build 273 hanno `scrollWidth = clientWidth` e `scrollX = 0` sui viewport 844×390 e 667×375, dopo rotazione e apertura Layer. Nel replay delle larghezze alternanti il `ResizeObserver` ha portato a un solo ridisegno dopo il debounce, senza un ciclo successivo. Questi risultati riguardano Chromium emulato e non escludono un difetto WebKit/iOS.
- Il codice landscape usa l’inset sinistro per entrambi i lati dell’header e una regola tablet più specifica cambia il layout dell’header oltre 768 px. Sono rischi individuati nella review, non cause dimostrate dello sfarfallio.

La causa effettiva resta **sconosciuta**: video e test disponibili non distinguono scroll root, cambi del viewport visuale, geometria o compositing su iPhone. Non è stata applicata una patch speculativa al runtime.

## Riscontro fisico e confronto WebKit — 4 novembre

La sonda Build 273 è stata eseguita dall'utente su iPhone con **Edge iOS**, non Safari. L'utente ha osservato tremolio iniziale in orizzontale, cessato durante le prove; in verticale il pannello Layer non è apparso. La sonda ha registrato, durante più rotazioni, larghezze del root da 832 a 926 CSS px, rispettivi `scrollWidth` da 836 a 930, e `scrollX=0`. In landscape l'elemento che contiene Impostazioni sporge di 4 px. Le 82 notifiche `window.resize` comprendono tre cicli di rotazione; non provano un ciclo continuo né stabiliscono la causa dell'oscillazione. L'ultima misura è in verticale, quindi non documenta 30 secondi continui in orizzontale.

In WebKit Playwright su Windows, con viewport 926×359 emulato, il problema dei 4 px si riproduce: root 926, `scrollWidth` 930 e contenitore Impostazioni con bordo destro 930. Il CSS landscape tenta di impostare `.header-inner` a blocco, ma una vecchia regola tablet più specifica lo mantiene a griglia. Applicando solo un selettore landscape con la stessa specificità, WebKit passa a `display:block`, `scrollWidth` diventa 926 e il bordo destro di Impostazioni rientra a 920. Layer è rimasto interattivo nei controlli emulati portrait e landscape. La differenza 832↔926 può dipendere dal viewport del browser; la correzione dei 4 px non prova da sola la causa del tremolio.

Il Layer verticale non si è riprodotto né in Edge né in WebKit emulati; su iPhone è stato osservato dall'utente. L'ipotesi che il menu venga ritagliato dal contenitore scorrevole è plausibile ma non dimostrata. `diagnostica-layer-273.html` consente un confronto temporaneo A/B sullo stesso runtime: registra eventi, stato e geometria del menu, poi ripete il tocco con il ritaglio del contenitore disattivato soltanto nella pagina strumentata. Il risultato resta sul dispositivo finché l'utente non lo copia. Test touch della sonda in Edge e WebKit emulati: due fasi completate, dati generati, nessun POST della sonda o errore JavaScript; non è una prova su iPhone fisico.

La sonda Layer è stata pubblicata via fast-forward statico, senza riavviare GIS o alterare gli altri servizi; la Build 273 live mantiene lo SHA originale. Il replay via HTTP Tailscale ha completato entrambe le fasi sia con WebKit sia con Edge emulati. La pagina diagnostica verifica lo SHA della 273 e va usata prima di sostituire quel runtime.

Il candidato locale Build 274 modifica la specificità di un solo selettore CSS e aggiorna etichetta e note di rilascio. Nel confronto con la 273, WebKit emulato a 832×359 passa da root/scrollWidth `832/836` a `832/832` e a 926×359 da `926/930` a `926/926`. In Edge emulato, WebKit emulato, portrait 428×926 e landscape 667×375 i controlli testati rimangono utilizzabili: apertura Impostazioni e apertura/chiusura Layer con hit-test del menu. Sono 16 combinazioni versione/motore/dimensione, senza errori JavaScript segnalati. Queste prove non stabiliscono se la correzione elimini il tremolio sul telefono.

Una prova aggiuntiva sul candidato, in entrambi i motori emulati e sia a 428×926 sia a 926×359, ha selezionato la mappa OSM HOT con un tocco e verificato selezione e chiusura del menu: quattro combinazioni PASS, senza errori JavaScript. Le richieste ai provider esterni sono state bloccate: il caricamento reale delle tile non è stato verificato da questo test.

## Prova Layer A/B fisica e candidato aggiornato

L'utente ha eseguito la sonda sulla Build 273 in Edge su iPhone verticale. Nella fase standard il tocco e il click sono arrivati, `aria-expanded=true` e `hidden=false`; il rettangolo del menu era 266,5×478 px, dentro il viewport, e il punto verificato ricadeva sul menu. Ciononostante l'utente ha indicato che **non lo vedeva**. Nella seconda fase, con `overflow-x/y:visible` e `-webkit-overflow-scrolling:auto` applicati temporaneamente alla toolbar, le misure dello stato erano analoghe ma l'utente ha indicato che **il menu era visibile**. La prova sostiene un problema di paint/ritaglio associato alla configurazione della toolbar; poiché la sonda cambia le proprietà insieme, non distingue quale singola dichiarazione sia necessaria. Il solo hit-test DOM non rileva il difetto visivo.

Il candidato 274 ora riproduce la combinazione provata dall'utente soltanto mentre Layer è aperto; alla chiusura ripristina lo scorrimento della colonna. La classe segue apertura, chiusura esterna, Escape, selezione e ricreazione della mappa. Il precedente candidato 274 solo header era locale e non pubblicato: è sostituito da questo byte, SHA-256 `74d2db4ada570a50e59e1bde8879726dd7702bc3cee1c67922ace5da7d5e9c3b`.

La prima esecuzione della nuova suite ha fallito su 926×359 perché la toolbar non scorreva. Un confronto diretto WebKit con la 273 ha mostrato la stessa condizione: `clientHeight=287`, `scrollHeight=379`, overflow visibile e GPS fino a y=439 su un viewport alto 359 px. Il candidato aggiunge quindi lo scroll per viewport GIS landscape corti tra 769 e 926 px, mantenendo il menu Layer fuori dal ritaglio quando aperto. Le otto combinazioni finali Edge/WebKit e quattro viewport passano apertura, chiusura tramite pulsante/tocco esterno/Escape, scorrimento del menu, scelta OSM HOT, ridisegno e verifica dello scroll e dell'hit-test del comando GPS in fondo alla colonna quando necessario; la rotazione emulata è inclusa. La [prima esecuzione](layer-visibility-first-run-results.json) e il [confronto 273/candidato precedente](toolbar-926-comparison.json) restano conservati, senza trasformare il FAIL originale in PASS retroattivo.

La [sonda viewport 274](../../../../diagnostica-viewport-274.html) verifica lo SHA esatto del candidato e produce un report compatto da copiare. Replay locale touch in WebKit ed Edge: caricamento corretto, Layer aperto, campioni in entrambe le orientazioni e nessun POST della sonda o errore JS. Questi controlli non sostituiscono la prova fisica della 274 e non confermano la stabilità in Safari su iPhone.

## Deploy candidato 274

Il 4 novembre la candidata è stata distribuita sul servizio GIS Tailscale con commit `8792f88f68d1d8cdcd0f4528d99c4897be99265c`. Lo script ha verificato branch e stato pulito, base 273, discendenza e hash, poi ha avanzato il checkout in fast-forward. Il server statico non è stato riavviato; l'hash del runtime letto via HTTP è `74d2db4ada570a50e59e1bde8879726dd7702bc3cee1c67922ace5da7d5e9c3b`, identico al file distribuito. Proxy, GraphHopper, ORS e n8n sono risultati invariati. Il primo push GitHub ha ricevuto un errore server, senza avanzare il ramo; il successivo tentativo è riuscito e il deploy ha verificato il tip esatto.

Il replay della sonda 274 tramite l'indirizzo Tailscale live è passato su WebKit e Edge emulati, con hash del runtime corretto, apertura Layer, misure in entrambe le orientazioni e nessun POST della sonda o errore JS ([esiti](viewport-274-helper-live-results.json)).

L'utente ha poi confermato la prova fisica della Build 274 sul proprio iPhone. Alla richiesta di verificare in **Edge** Layer e scelta di una mappa in verticale, due rotazioni, stabilità in orizzontale per circa 15 secondi e scorrimento dei comandi a destra, ha risposto «sì». Alla richiesta separata di verificare in **Safari** visibilità di Layer e stabilità in orizzontale, ha risposto «sì funziona». Il riscontro è positivo per i casi e il dispositivo riportati; non prova ogni dispositivo o una durata maggiore, né dimostra quale modifica sia stata la causa della cessazione del tremolio.

## Sonda per iPhone fisico

`diagnostica-viewport-273.html` è una pagina opt-in: scarica il runtime dallo stesso server/origine, ne controlla lo SHA-256 della Build 273 e lo riapre nel documento principale con una sonda aggiunta. La sonda misura per 30 secondi dimensioni, rettangoli DOM, viewport visuale, inset ed eventi. Mostra il risultato da copiare e **non lo invia automaticamente**; il report non contiene coordinate, contenuti delle mappe o dati salvati. Il GIS viene comunque eseguito normalmente e può leggere i propri dati locali e caricare le risorse previste dalle sue impostazioni. La pagina strumentata condivide origine e storage del GIS; l’iniezione e il piccolo indicatore aggiungono un possibile effetto di osservazione, quindi la riproduzione sul dispositivo va confrontata con il video originale.

Il controllo locale della sonda in Edge emulato ha verificato hash del file, caricamento della 273, apertura Layer, stessa origine e percorso, persistenza di una sentinella localStorage, acquisizione automatica, risultato disponibile nel campo testo, assenza di POST della sonda e zero errori JS. Non è una prova su Safari o su un iPhone fisico.

Il replay automatico di 30 secondi ha prodotto tutti i controlli funzionali PASS e il JSON, ma il processo è rimasto fermo nella chiusura del browser ed è stato interrotto. Il runner è stato corretto per chiudere le connessioni locali prima del browser; un successivo replay breve è terminato con exit 0. Questo limite di cleanup non è un esito Safari.

La sonda statica della 273 è stata pubblicata sul VPS all’[indirizzo diagnostico](http://100.99.54.93:8000/diagnostica-viewport-273.html), commit `a4f9a81308ecd776c833402f058d81dc6cad65cd`, SHA-256 `15c48f830341b1237083d90a02690a0a3588e6f721bab1980f6c8b3681462380`. La sonda è vincolata al runtime 273 e non si avvia ora che è live la 274. Il deploy originario aveva verificato che il runtime restasse SHA `4d608550a63261c0d7b6d5088c6bd6d1c62c3fe521253341ccad19f99f1d996a`, senza riavviare il servizio GIS; gli altri servizi erano rimasti invariati.

Un [replay live](live-diagnostic-smoke-results.json) in Edge touch emulato ha aperto la sonda via HTTP Tailscale, esercitato il calcolo SHA senza WebCrypto e prodotto il campo risultato senza POST o errori JS. Anche questo è un controllo del loader, non una prova fisica.

## Prossimo passo

Il test fisico descritto sopra ha dato esito positivo. Conservare la distinzione tra risultato osservato e causa: se il tremolio ricompare su quel telefono, raccogliere geometria e viewport nel momento in cui si verifica. Il blocco corrente passa alla compattazione di scala e coordinate mobile richiesta successivamente dall'utente.

Evidenze: [`video-edge-timeline.json`](video-edge-timeline.json), [`geometry-results.json`](geometry-results.json), [`diagnostic-smoke-results.json`](diagnostic-smoke-results.json), [`diagnostic-smoke-auto-results.json`](diagnostic-smoke-auto-results.json).

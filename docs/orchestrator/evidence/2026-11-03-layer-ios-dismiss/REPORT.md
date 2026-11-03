# Build 271 — menu Layer su iOS

## Esito

Build 271 è una mitigazione circoscritta candidata al rilascio. Safari e Chrome su iOS hanno mostrato lo stesso sintomo: il menu si apre e si chiude subito. Il codice aveva una sola chiusura automatica basata su `mousedown` in fase capture. Il fix usa `pointerdown` sui browser che lo supportano e mantiene `mousedown` come fallback per quelli più vecchi.

Il cambio è reversibile. La traccia nativa degli eventi su iPhone non è disponibile in questa sessione: la prova di compatibilità in Edge inietta esplicitamente un `mousedown` tardivo dopo l’apertura. Non dimostra quale sequenza produca iOS fisico. Build 271 va quindi riprovata da Nicola su Safari e Chrome iOS prima di dichiarare chiuso il difetto.

## Modifica e provenienza

- File runtime: `coordinate_converter Claude.html`.
- Build: `GIS-IOS-LAYER-DISMISS-A`, Build 271.
- SHA-256 runtime: `7f96e58ea912cd9c017c225b1d12276f5ef397c55b3e4ee6c8bfbd11c5b76ea8`.
- Il solo comportamento modificato è l’evento globale di chiusura esterna del menu Layer. Note di rilascio aggiornate.

## Verifiche

- [Confronto evento mouse tardivo](touch-compat-results.json): Build 270 chiude il menu con l’evento `mousedown` iniettato; Build 271 lo mantiene aperto. Controlli passati su viewport touch 390×844 e 320×568 e desktop 1280×800.
- [Replay interazioni Build 271](selection-results.json): PASS su 390×844, 320×568, desktop 1280×800 e fallback desktop senza Pointer Events.
- In tutti i quattro profili Build 271: un tap apre e mantiene aperto il menu dopo il `mousedown` tardivo simulato; secondo tap chiude; evento pointer esterno chiude (fallback `mousedown` nel profilo senza Pointer Events); selezione OSM HOT attiva il layer e chiude il menu; zero eccezioni JavaScript.
- Browser: Microsoft Edge / Chromium 156 con profilo/touch emulato iPhone 13 Pro. Le richieste cartografiche esterne sono bloccate; non si verifica il caricamento dei tile.

## Limiti e prossimo passo

Non è stata eseguita una prova su dispositivo iOS reale, né una registrazione dell’ordine degli eventi nativi di Safari o Chrome. Dopo la pubblicazione, chiedere a Nicola di ricaricare [Build 271](http://100.99.54.93:8000/coordinate_converter%20Claude.html?v=271), toccare una volta l’icona Layer e verificare che il menu resti visibile e consenta la scelta di una mappa. Se il menu si chiude ancora, acquisire una breve registrazione dello schermo e proseguire con una diagnosi WebKit su dispositivo.

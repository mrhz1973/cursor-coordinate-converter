# ABQA postdeploy — GIS-SEARCH-SIMPLIFY-COUNTRY-A build266

AUTOMATED BROWSER QA PASS nei casi tecnici elencati, non sostituisce QA operatore. Documento reale http://100.99.54.93:8000/coordinate_converter%20Claude.html. Commit runtime ce02321c6a95f729c6b9e1baeabe27077689a9c8, SHA256 85252fa3bb9fd43f9eeca4a5d1ddce8b5e9ee307be94defc5e0b66c61eda23ff.

GET prima/dopo: HTTP200, 10905612 byte, hash identico, Last-Modified identico. Browser ha realmente navigato il documento HTTP, response status/content-length/last-modified coincidenti; altri endpoint intercettati, Nominatim fornito con risposta JSON vuota mock. Nessun server o doc mock locale. Browser Chromium desktop1440x1000 e mobile emulato390x844.

Per entrambi: assente input paese; placeholder Roma; testo Roma invia richiesta Nominatim simulata senza countrycodes; coordinate Roma 41.8908,12.4922 restituite correttamente; strict/geocoding-off/offline impediscono tentativi Nominatim su testo Milano (3x2 casi). Settings → Note di rilascio con click+tastiera apre Guida, details aperto e focus su summary; Invio richiude details, X chiude Guida; il pulsante Guida preesistente riapre e richiude. Zero pageerror. Non testati provider reali.

Screenshot notes-desktop.png e notes-mobile.png ispezionati: pannello mobile appare molto ridotto, richiede valutazione operatore su dispositivo fisico e leggibilità. La pagina contenente le note è scrollabile; visibilità e praticità di navigazione vanno valutate dall'operatore. Le tile sono placeholder poiché le richieste esterne sono bloccate. Molte richieste extra sono state intercettate e bloccate; non è un'attestazione di assenza generale di rete. Il solo gate certificato è assenza Nominatim nelle tre condizioni esercitate.

Riproduzione: node work/abqa-search-266/postdeploy.cjs URL. Files results.json, postdeploy.cjs e screenshot preservano evidence; nessun HTML candidate incluso.
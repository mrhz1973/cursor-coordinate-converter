# Note di rilascio — implementazione e test

Candidate locale build266 SHA256 LF 85252fa3bb9fd43f9eeca4a5d1ddce8b5e9ee307be94defc5e0b66c61eda23ff. Include modifica Paese del bundle.

Accesso diretto «Impostazioni → Note di rilascio» tramite nuovo pulsante; apre Guida esistente in modo context-aware, espande il blocco nativo details e sposta il focus sul summary. Nessun nuovo dialog/lifecycle. Le note sono HTML statico inline, senza injection, storage, network o GPS. Coprono build266 e265, e build256/255 verificate nell'audit; avvertenza esplicita che cronologia precedente è incompleta. Non presentano 257–264 come release.

Test Chromium desktop e mobile emulato su byte finali: pulsante reale Impostazioni e Note, pannello aperto, note espanse con focus corretto, contenuti e versione presenti, Space chiude e Enter riapre, pulsante × chiude. Zero pageerror e zero richieste aggiunte sotto strict/offline. Results JSON e harness adiacenti. Il primo test online dopo boot ha catturato una richiesta meteo asincrona preesistente intercettata/bloccata; ripetuto isolando strict/offline e dopo attesa bootstrap. Nessuna conclusione generale sul traffico online.

Replay browser paese su byte finali: work/search-ux/results-final.json; 2/2 desktop/mobile PASS per campo assente, placeholder Roma, coordinate locali senza Nominatim, ricerca Roma con risposta Nominatim simulata senza countrycodes, gate strict/offline/geocoding off. Selfcheck debug PASS, zero assert e pageerror. Nessun provider reale contattato o valutazione touch hardware. Nessuna review indipendente, deploy o QA operatore attestata.

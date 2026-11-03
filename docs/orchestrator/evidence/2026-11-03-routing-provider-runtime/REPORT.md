# QA routing provider reali — 2026-11-03

## Esito

**NON_VERIFICATO.** Il runtime locale `coordinate_converter Claude.html` è stato verificato con SHA-256 `32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28` (checkout `b6f84fb3c92689c9bc7cd900241016536fbd6ae0`). La UI reale si apre e accetta due coordinate sintetiche; l’azione Calcola non ha prodotto una richiesta/risposta osservabile sugli endpoint GraphHopper/ORS ammessi. Non è possibile concludere se la causa sia un proxy, una dipendenza di metadati bloccata o la configurazione già disponibile.

## Verifica svolta

- Runner [run.cjs](run.cjs) ha caricato i byte del runtime in un browser Playwright isolato e verificato lo SHA prima dell’avvio. Il profilo GraphHopper `hiking` è stato selezionato e sono state inserite le coordinate sintetiche pubbliche `9.8236, 44.1024` → `9.829, 44.107`.
- Il controllo [setup-check.json](setup-check.json) conferma che pannello e profili statici sono visibili. [after-coordinates-check.json](after-coordinates-check.json) conferma due punti validi, profilo `hiking`, policy non offline/strict e pulsante Calcola abilitato.
- Dopo un solo clic su Calcola, il risultato [result.json](result.json) registra zero richieste dirette ai due endpoint consentiti e nessuna risposta HTTP. Non è stata creata un’anteprima e il salvataggio è rimasto disabilitato. Il runner si è fermato senza passare a ORS, senza ripetere la chiamata e senza tentare altre credenziali.
- Sono stati consentiti soltanto POST a `graphhopper.com/api/1/route` e `api.openrouteservice.org/v2/directions/{profile}/geojson`. Tutti gli altri host e gli endpoint ausiliari sono stati bloccati, inclusi mappe, elevazione e font. Query string e header non sono stati acquisiti o registrati. Le richieste non consentite sono conteggiate soltanto, senza conservarne host o URL.
- Non è stato eseguito il caso ferry: non è stata individuata nei materiali di progetto consultati una coppia pubblica già documentata e il primo flusso non ha raggiunto un endpoint provider consentito.

## Limiti e prossimo passo

Questa prova **non attesta** disponibilità, credenziali, accuratezza, snap o dettagli di GraphHopper/ORS. L’endpoint di routing effettivamente usato dal flusso UI potrebbe non coincidere con la whitelist stretta; non l’ho autorizzato né contattato se non consentito. Per proseguire serve identificare, senza esporre segreti, l’endpoint routing già previsto dalla configurazione dell’app e stabilire se rientra nella whitelist autorizzata. Nessun dato runtime o credenziale è stato modificato.

## Riproducibilità

Con Node, Playwright locale e Chromium già presenti, `node docs/orchestrator/evidence/2026-11-03-routing-provider-runtime/run.cjs` verifica nuovamente lo SHA e prova al massimo il flusso GraphHopper seguito da ORS solo se il primo termina con risposta utilizzabile. Interrompe su assenza di risposta, errore HTTP, autorizzazione o quota. Le verifiche UI senza invio provider sono ripetibili con `setup-check.cjs` e `after-coordinates-check.cjs`.

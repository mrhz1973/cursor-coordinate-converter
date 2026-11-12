# TMAR GIS Tool Build298 - audit desktop supplementare read-only

Data 13 novembre 2026. Diagnostica supplementare, non una nuova build e non una QA umana.

## Provenienza
Repository canonico mrhz1973/cursor-coordinate-converter, base origin/main al preflight 2c8475af81bcb85b0551757c521f1a30eb55a15c. Runtime Build298 source commit 651c872b914025d6f0e84b19e51313b92599342b, SHA256 deffea948b029fdc030bdf0ccf724e7ce6016ec539c746c1eb74e111ff353fca. Edge CDP su AsusDesktop tramite TMAR Desktop Commander Windows, pagina HTTPS nativa GIS. Browser con profilo isolato; le richieste verso provider esterni sono state bloccate, senza injection HTML. Zero POST e zero eccezioni Runtime.exceptionThrown.

## Matrice
Per ciascun caso: opener del runtime, attesa di assestamento, pulsante Minimizza, stato del dock, apertura Poligoni, evento Escape CDP, verifica chiusura Poligoni e permanenza del minimizzato, ripristino del pannello con handler GIS.

| Pannello | Escape cede a Poligoni | Ripristino |
| --- | --- | --- |
| Cerca / searchPanel | PASS | PASS |
| Cronologia / historyPanel | PASS | PASS |
| Preferiti / favoritesPanel | PASS | PASS |
| Mappe Offline / layersPanel | PASS | PASS |
| Misura / measurePanel | PASS | PASS |
| Astro / astroPanel | PASS | PASS |
| Range Rings / rangeRingsPanel | PASS | PASS |

Risultato 7/7 scenari PASS, zero POST, zero errori JavaScript, 46 risorse di provider esterni bloccate, nessun finding runtime nuovo.

## Dettagli D-Flight reali
Una seconda sessione Edge isolata, senza dati operatore, ha confermato APP_BUILD_NUM=298, dflightHasSessionDataset()=false, nessuna sessione overlay e nessuna zona selezionata. Nessuna richiesta al provider D-Flight e nessun dato sintetico usato per qualificare il provider reale. Il browser utente sul dispositivo non esponeva porte CDP e non e stato ispezionato. Pertanto la QA su zona D-Flight reale NON ESEGUITA; resta valida la precedente prova lifecycle sintetica 10/10 Build298.

## Gate invariati
QA operatore Build298 PENDING; Build295 footer/HUD e Build294 Escape QA umane PENDING; Build297 CLOSED/PASS. Non inferire una qualifica globale dei 38 dialoghi. Nessuna modifica al monolite, OPSEC, cache, GPS, stato waypoint, mobile, servizi o deploy. Il resto Bundle F routing risulta NOT OPENED / da scegliere nella WU-0010: non viene aperto automaticamente da questo audit.

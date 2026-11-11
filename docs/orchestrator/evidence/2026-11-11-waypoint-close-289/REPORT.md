# Waypoint Close UX — candidata Build 289

Data: 2026-11-11 14:58:38 Europe/Rome. Stato storico: candidata preparata sulla Build 288. Stato corrente: Build 289 LIVE, QA operatore PENDING.

## Stato LIVE postdeploy

Build 289 LIVE, source 214e6ea248f4d390bfd1c79b12b95123f93642f0, SHA 19be22d478262c6ad7f1dbb9ef4c7a0706a8d58bf2a39236fb02750129e45107. Preflight, backup Build 288, solo GIS restart e smoke HTTP/HTTPS PASS; QA nativa Edge 25/25 PASS. QA operatore ancora PENDING; nessun test clic mappa completo attestato. [Deploy](DEPLOY-RESULT-289.md) · [ABQA](QA-LIVE-289.md).

## Obiettivo utente
Quando Waypoint viene aperto e non e stato inserito/modificato alcun punto, cliccare nuovamente Waypoint oppure X deve chiudere senza chiedere Scarta. Se esistono coordinate o modifiche non salvate, deve apparire la conferma; Annulla deve conservare dati, Scarta deve chiudere.

## Correzione
- Base main ad827812c1d52a3875339bd0c4107470dc0a1c48; codice source 214e6ea248f4d390bfd1c79b12b95123f93642f0; blob 6a4a2639e6b2a205ee26ab38778e5b85b3ad6d0b; SHA256 19be22d478262c6ad7f1dbb9ef4c7a0706a8d58bf2a39236fb02750129e45107, 11.116.484 byte.
- Solo coordinate_converter Claude.html; git diff 7 righe aggiunte e 6 rimosse; 192 CR invariati, 2 script inline Node syntax PASS.
- waypointModalUnsavedCloseRisk non considera piu il solo waypointPickMode un rischio, poiche viene attivato automaticamente all apertura del pannello anche senza coordinate.
- Una bozza posizionata in trackWaypointDraft o campi editor con dati/variazioni resta protetta dalla conferma.
- Pulsante Waypoint con pannello gia visibile usa requestWaypointModalClose; chiusura X gia usa lo stesso controllo. Caso minimizzato continua a ripristinare il pannello.
- Nessun cambio a state.mapWaypoints, commit/salvataggio, coordinate, OPSEC, GPS, rete o storage.

## Evidenza e limiti
- QA Edge candidato con HTML iniettato su origin HTTPS: 25/25 PASS UI, apertura/chiusura, campi coordinate, Annulla/Scarta e salvati 0; POST 0.
- Contratto su waypoint gia posizionato simulato nel solo stato browser (trackWaypointDraft), 32/32 PASS. Clic reale sulla mappa non riprodotto dal primo harness; non dichiarato PASS.
- Review routine GPT su source GitHub pinnato 20/20 PASS. Reviewer esterno NOT_PERFORMED, routine scope.
- La toolbar FIX3 288 e LIVE con QA operatore ancora PENDING; feedback estetico del raggruppamento grafico resta backlog distinto.

NEXT: deploy GIS-only dopo preflight, QA HTTPS nativa e QA operatore Waypoint; mobile ancora in pausa salvo esplicito nuovo ordine.

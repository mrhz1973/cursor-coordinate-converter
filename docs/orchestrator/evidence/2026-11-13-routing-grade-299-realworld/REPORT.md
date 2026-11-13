# QA reale delegata Build299 - TMAR Desktop Commander Windows

Data: 13 novembre 2026. Richiesta utente: eseguire direttamente la QA dei valori di pendenza con TMAR Desktop Commander. Stato: QA TECNICA REAL-WORLD ESEGUITA; esito di completamento end-to-end per i tre casi validi PASS, ma ACCURATEZZA ALTIMETRICA ASSOLUTA = HOLD. Non dichiarare il gate QA umano PASS.

## Identity e scope
- Canonico GitHub origin/main al preflight: 7c9b13225f9536677d43eaa02793d33575da256e.
- Runtime LIVE Build299, source 4a9a61f6886f3cedbef83dcf7768db138351f96d, SHA256 HTML 0b4535fa8acb34cd49176f798774acd812be02a70b6638820e275889f54a802b. Nessuna nuova candidata o deploy.
- TMAR Desktop Commander Windows v0.3.1 su AsusDesktop, Edge Chromium CDP in profili nuovi isolati, pagina HTTPS LIVE nativa, nessuna injection HTML.
- Coordinate pubbliche di riferimento delle Cinque Terre, senza geolocalizzazione/GPS, posizione utente, tracce personali o modifiche di dati persistenti. Solo richieste di routing esplicitamente avviate dal click Calcola; il restante traffico verso terzi e stato bloccato.
- Backend GraphHopper VPS v11: GET /info HTTP200, profilo hiking, copertura di area ligure. ORS gateway HTTPS: GET /ors/status HTTP200 ready, profilo foot-hiking. Non sono state esposte o usate chiavi API in output.
- La tratta esatta su cui l operatore ha rilevato valori fuori scala non e presente nelle fonti disponibili. I test usano campioni reali rappresentativi, NON una riproduzione del suo tracciato.

## E2E reali: pulsante Calcola e contratto del GIS
Per ciascuna nuova sessione: openRoutingPlannerPanel del runtime, due coordinate pubbliche, profilo hiking/foot-hiking, gate rete/OPSEC preflight, evento click sul pulsante routingCalculateBtn, risposta finale verificata nel DOM. Solo POST sull endpoint controllato stesso-origin. Nessun GPS, zero nuovi waypoint personali (state.mapWaypoints rimane 0 nel profilo nuovo), zero eccezioni JavaScript osservate.

| Tratta pubblica | Provider e profilo | Esito E2E | Punti | Max grade UI | P95 filtrato | Note |
| --- | --- | --- | ---: | ---: | ---: | --- |
| Riomaggiore -> Manarola | ORS foot-hiking | PASS Percorso pronto | 100 | 48.4% | 25.37% | 7 segmenti suspect, 1 POST |
| Riomaggiore -> Manarola | GH VPS hiking | PASS Percorso pronto | 114 | 39.6% | 23.89% | 0 suspect, punto A snap ~9m, 1 POST |
| Monterosso -> Vernazza | GH VPS hiking | PASS Percorso pronto | 285 | 87.5% | 62.15% | 3 suspect, punto A snap ~35m, 1 POST |
| Monterosso -> Vernazza | ORS foot-hiking | BLOCKED fail-closed | 0 | n/a | n/a | routing.landUnverified, 1 POST, non certificabile |
| Monterosso breve costiera | GH VPS hiking | BLOCKED fail-closed | 0 | n/a | n/a | routing.snapBlocked, 0 POST |
| Monterosso costiera con estremi gia snapped | GH VPS hiking | BLOCKED fail-closed | 0 | n/a | n/a | routing.landSnapFar, 1 POST |

Totale: 6 sessioni E2E, 3 complete e 3 respinte in sicurezza. Nei tre risultati completati nessuna pendenza visualizzata supera 100.01%, tutte le risposte validamente accettate hanno filtro disponibile, grafico e fattori UI popolati. I blocchi non vengono contati come PASS di percorso calcolato: il comportamento fail-closed del software e quello osservato.

## Diagnostico provider (NON E2E)
Da terminale Windows attraverso Desktop Commander sono stati ottenuti alcuni payload GH e ORS reali. Prima richiesta diretta GH mancava dettagli road_environment e custom_model; richiesta ORS diretta mancava extra_info waytype. Queste risposte sono state anche analizzate e passate nel parser del runtime, ma senza il completo controllo land/snap: NON sono percorsi qualificati dall applicazione. Un tentativo su Pisa via GH ha dato HTTP400 point-not-found; una tratta Portovenere-Campiglia ha un endpoint snap superiore a 300m e non va considerata una route valida verso la destinazione.

Dati diagnostici di interesse:
- GH Monterosso-Vernazza: route body diagnostico circa 4.29km, filtro p95 62.15%, massima 87.5%, salita filtrata circa 481m.
- ORS Monterosso-Vernazza: body diagnostico circa 4.00km, filtro p95 25.30%, massima 58.9%, salita filtrata circa 148m; NOT qualified, poiche l E2E ORS land verification rifiuta il percorso.
- GH Vernazza-Corniglia: p95 62.34%, max 90.8%; ORS raw parser max 72.4%. Le geometrie NON coincidono (separazione p95 fino a ~227m); confronto solo indicativo.
- GH/ORS Riomaggiore-Manarola: geometrie molto prossime, p95 distanza geometrica fino a 9m. La stessa applicazione accetta entrambi i risultati E2E con max39.6 e48.4 per differenze dati/strategie del provider.

## Cross-check geometria e altimetria
Per Monterosso-Vernazza i tracciati GH e ORS diagnostici sono quasi coincidenti: distanza mediana dei punti GH dalla polilinea ORS circa 0m, p95 circa 5m, max circa28m. Le quote campionate GH, interpolate sulla polilinea ORS, differiscono di mediana assoluta ~8.9m, p95 assoluto ~52.6m e massimo assoluto ~67.9m. Il differenziale di guadagno filtrato circa 481 vs148 metri non puo essere attribuito con certezza al terreno senza DEM indipendente e stessa geometria/parametrizzazione. I massimi del 87.5% e oltre restano sospetti per un percorso escursionistico, ma non e corretto definirli un bug accertato senza misure altimetriche affidabili.

Pendenze di finestra indipendente (diagnostiche, basate sul DEM originale del provider): su Monterosso-Vernazza, massima assoluta media su 100m circa80% GH, circa85% ORS; su 200m circa44-45% per entrambi. Evidenza che ridurre la finestra cambia molto la metrica ma NON prova quale valore puntuale sia corretto. Nessun clamp artificiale proposto in questa QA.

## Sicurezza e gate
La Build299 resta LIVE e invariata. E stato verificato che il calcolo ORS e GH funzionano dal pulsante reale, previo gate OPSEC normale, con un POST controllato per prova completa; le richieste esterne della mappa sono state bloccate. Nessun silent GPS o tracciamento, nessuna migrazione dati e nessun salvataggio traccia.

Esito del sottogate funzionale: E2E ROUTING su 3 tratte/profili pubblici PASS e filtri >100% coerenti, con 3 casi fail-closed da distinguere. Esito di accuratezza geografica: HOLD per disallineamento del DEM GH/ORS su tratte quasi coincidenti e mancanza di tracciato originario/ground truth. Nessuna attestazione umana PASS 299. QA operatore D-Flight Build298, footer295 e Escape294 rimangono indipendenti e PENDING.

NEXT: diagnostica specifica sui dati altimetrici GH e ORS sulla stessa geometria e confronto con un DEM terzo attendibile o percorso di riferimento georiferito; non aprire Build300 soltanto per arrotondare i picchi o abbassare in modo arbitrario la soglia numerica. Se il tracciato originale dell operatore diventa disponibile, ripetere la stessa suite sul caso esatto. Non chiedere la ripetizione manuale delle prove gia eseguite tramite TMAR Desktop Commander.

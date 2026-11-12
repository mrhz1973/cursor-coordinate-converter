# Automated Browser QA HTTPS LIVE Build298 - PASS 10/10 scoped

Data 2026-11-12. Edge CDP headless con profilo temporaneo su AsusDesktop, pagina HTTPS nativamente servita https://ionos-n8n-new.tailc01234.ts.net/gis?v=deffea94, senza injection di HTML. Hash indipendente file VPS, HTTP tailnet e HTTPS: deffea948b029fdc030bdf0ccf724e7ce6016ec539c746c1eb74e111ff353fca.

| Suite | Esito |
| --- | --- |
| Dettaglio D-Flight minimizzato + Poligoni visibile + Escape | PASS: Poligoni chiuso, dettaglio ancora aperto/minimizzato, dock presente |
| Dettaglio D-Flight visibile + Poligoni + Escape | PASS: dettaglio chiuso, Poligoni resta |
| Dettaglio minimizzato senza altro pannello | PASS: permane minimizzato e ripristinabile |
| Emulazione touch 390x844 | 1/1 parity con Build297 PASS, priorita mobile invariata |
| Guida e Strumenti minimizzati + Poligoni | 2/2 PASS, regressione Build297 |
| Converti, Indice IGM/IIM, Oggetti GIS e Routing minimizzati + Poligoni | 4/4 PASS, regressione Build296 |

Totale 10/10 verifiche scoped attese, zero richieste POST e zero eccezioni JavaScript in tutte le suite. Richieste accessorie di provider esterni intenzionalmente bloccate. Dettaglio zona D-Flight aperto tramite funzione reale del runtime con una zona fittizia in memoria del browser di test: il flusso di dati D-Flight reali NON e stato collaudato. Nessun iPhone fisico testato.

Esito: AUTOMATED BROWSER QA GIS-MINIMIZED-DFLIGHT-DETAILS-ESCAPE-PRIORITY-E PASS. QA FINALE CHATGPT - PENDING. Nessun PASS operatore acquisito per Build298.

# ABQA HTTPS LIVE Build299 - PASS scoped

Data: 13 novembre 2026. Edge Chromium CDP su AsusDesktop tramite TMAR Desktop Commander Windows. Profili temporanei isolati. Pagina HTTPS nativa /gis?v=0b4535fa: nessuna iniezione/sostituzione HTML, nessuna fetch verso provider esterni, zero POST/JS exceptions.

Identita del runtime su VPS: source commit 4a9a61f6886f3cedbef83dcf7768db138351f96d, SHA256 0b4535fa8acb34cd49176f798774acd812be02a70b6638820e275889f54a802b da disco, HTTP interno e HTTPS pubblico. Sono state ripetute le suite candidate convertite per non sostituire il documento e usare sempre la pagina servita.

| Suite | Esito |
| --- | --- |
| Numeric extended: 18 casi (normali, spike, gap, steep, 100% boundary) | 18/18 PASS, zero FAIL |
| Geografia/performance (latitudini, antimeridiano, 3000/20000 campioni, no-elevation) | 9/9 PASS, zero FAIL |
| UI/Tooltip: normale10, rumore, spike250, spike finale, step100/1m, salita80 | 6 scenari coerenti; max filtrato10 quando atteso, unknown se inattendibile, nessun tooltip di pendenza estrema |
| SavedTrack storico | Spikes non piu visualizzati con grado 10010%, max normale 10% |
| SavedTrack addon nuovo | Affidabile salva addon, inattendibile non salva falso zero |
| Escape regressioni Build298 | 1/1 PASS D-Flight Details |
| Escape regressioni Build297 | 2/2 PASS Guida/Strumenti |
| Escape regressioni Build296 | 4/4 PASS Converti/Indice IGM/Oggetti GIS/Routing |

Tutte le suite indicate hanno riportato 0 POST e 0 Runtime.exceptionThrown; risorse esterne bloccate dal CDP. Prestazioni di 20000 punti circa 23.6ms nella specifica esecuzione browser, non SLA o durata garantita. Il benchmark non misura rete o browser fisico mobile.

Risultato QA tecnica: AUTOMATED BROWSER QA ROUTING-GRADE-OUTLIER-GUARD-A PASS sullo scope sintetico. QA OPERATORE SU PERCORSO REALE PENDING. Nessuna route reale di hiking/MTB e stata calcolata con provider o dati della sessione utente. Non si attestano accuratezza del DEM reale o correttezza retroattiva dei riepiloghi salvati.

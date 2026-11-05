# Build 278 — validazione delle fasce MGRS

Il parser precedente accettava `32NNA0000000000` e `32MNF0000050000`, decodificandoli nell'emisfero opposto alla fascia dichiarata. La nuova scelta della riga verifica compatibilità del quadrato da 100 km con la fascia secondo la semantica MGRS di GeographicLib, comprese le eccezioni ai bordi. Il notice MIT e il copyright sono inclusi nell'HTML autonomo.

QA: Search 10/10 e Converti 10/10 nella UI Chromium su SHA 8cb9d27b1a4c8b38d1432fbb0507341f1cf26473e50211d128ed9465aa41d827; nessun errore pagina/HTTP, rete esterna bloccata. Il test Converti ha richiesto trascinamento reale della finestra: la posizione iniziale può lasciare il pulsante fuori schermo, difetto separato aperto. Confronto mirato GeographicLib 8 positivi, 5 negativi, 51 campioni globali e limiti PASS; review indipendente senza blocker, inclusi bordi di fascia/antimeridiano e casi crossing. Non è una certificazione geodetica mondiale, né verifica UPS polare. Mobile 277 rimane invariata.

Deploy VPS PASS: commit 1200000cd852381931e6c5a77b945c16b5f3eaf1, file e HTTP SHA-256 8cb9d27b1a4c8b38d1432fbb0507341f1cf26473e50211d128ed9465aa41d827; GIS attivo e servizi collaterali invariati.

# Build 275 — scala e coordinate mobile

La candidata 275 compatta scala e coordinate su mobile e aggiunge due frecce indipendenti. La lunghezza delle barre viene ricalcolata sulle distanze reali, senza cambiare il modello di esportazione. La riga del cursore è centrata; la riga Punto resta nel DOM ma è nascosta su mobile. Misura e contatore tile restano nel riquadro e vengono solo nascosti temporaneamente quando è minimizzato. Lo stato dei toggle sopravvive ai redraw nella sessione.

I crediti delle mappe sono mantenuti visibili in formato ridotto; la fascia footer è nascosta su mobile e le informazioni di versione rimangono nelle Impostazioni. Su satellite a 320 px data immagine, scala e crediti sono separati.

## Verifiche sul byte `196b23cb090adad35129dab05dda3cefd1aa4b94516274e4007fa9dad26bde84`

- [Frecce e scala](quick-hud-results.json): Edge e WebKit emulati, 320×568, 428×737 e 926×359; toggle indipendenti, ripristino dopo redraw e proporzione metrica al livello osservato PASS. Scarto massimo circa 0,13%, dovuto all'arrotondamento dei pixel.
- [Scala a più latitudini e zoom](scale-multi-results.json): 48 confronti tra distanze mostrate e larghezze effettive delle barre metrica e nautica, latitudini 0°, 44°, 84° e zoom 5, 11, 18, 22, in Edge e WebKit emulati: PASS; scarto massimo circa 0,09%.
- [Formati](quick-formats-results.json): MGRS, UTM, DD, DDM e DMS senza taglio a 320 px; punto, footer e controlli desktop conservati a 1280×800: PASS su entrambi i motori emulati.
- [Rotazione](quick-rotation-results.json): stato minimizzato e ripristino dopo rotazioni emulate, Edge e WebKit a 428×737 e 667×375: PASS.
- [Satellite](satellite-overlay-results.json): scala, freccia, data immagine e crediti non sovrapposti a 320×568 e 926×359 in WebKit emulato: PASS.
- [Layer](layer-regression-results.json): apertura, chiusure, scelta mappa, redraw e scorrimento toolbar in Edge/WebKit a 428×737 e 926×359: PASS.

La [revisione indipendente](QA-INDEPENDENT.md) ha confermato diversi controlli ma il suo runner riporta FAIL complessivo per difetti dell'harness e passaggi incompleti: non è un PASS e i suoi limiti restano documentati. Le prove automatiche usano Windows emulato, bloccano i provider esterni e non attestano Safari/Edge fisici su iPhone. Il comportamento touch del cursore resta quello precedente: segue il dito durante il movimento e torna al punto al rilascio.

La Build 275 è stata distribuita sul VPS via fast-forward, commit `d8c93b2ffcd7f726e8793c89090c2d7b97c6b31a`, e servita via HTTP con SHA `196b23cb090adad35129dab05dda3cefd1aa4b94516274e4007fa9dad26bde84`. I servizi non GIS e n8n sono rimasti invariati; il servizio GIS statico non è stato riavviato. Una prova Edge/WebKit emulata tramite il link Tailscale live ha verificato i due toggle, redraw e proporzione della scala nei profili 320, 428 e 926 px. L'utente ha successivamente richiesto un'ulteriore sistemazione del layout portrait, presa in carico nella Build successiva.

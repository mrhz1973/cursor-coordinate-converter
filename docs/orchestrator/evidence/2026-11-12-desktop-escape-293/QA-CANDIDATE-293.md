# QA candidata Build 293

Metodo: Edge via CDP Windows, URL HTTPS VPS, candidato HTML 293 sostituito solo in memoria; il server LIVE resta 292. Profilo isolato, rete esterna bloccata, 0 POST.

- **Baseline 292 HTTPS nativa:** 21 controlli totali, 18 PASS e 3 FAIL: Offline/Cerca/Cronologia minimizzati impediscono Escape di Poligoni. I tre scenari sono stati riprodotti nuovamente sulla 292, non copiati dalla vecchia 283.
- **Candidata 293:** 21/21 PASS sui medesimi tre scenari, incluso controllo Poligoni da solo e conservazione minimizzazione.
- **D-Flight regression:** 17/17 PASS, pannello aperto/minimizzato, chip, Offline visibile, Escape/×/riapertura e Poligoni davanti a D-Flight minimizzato.
- Tutto condizionato a GIS desktop; i ritorni storici per mobile rimangono in codice. Test con telefoni reali non effettuati, sviluppo mobile in pausa.

Totale candidata 38/38 PASS, 0 POST, senza ABQA nativa della 293. Nessun PASS operatore.

# QA integrata sul file 710d1fc…

File testato e checkout all’inizio e dopo le prove: SHA-256 `710d1fc5003235c89c29ff09d81d9803c124479d2296e95b4c2c6427b6b82d2c`. Copie e runner sono isolati in questa cartella; nessuna modifica al checkout o VPS.

- Nucleo UTM: passato su 594 vettori, sei precisioni, due double adiacenti, controllo provenienza e fallback; il runner è stato adattato a includere `geographicPointMGRSUTM`.
- Equatore: passati 70 punti geografici, 420 controlli precisione, 350 controlli multi-precisione, cinque sorgenti, 30 controlli fonte e tre controlli d’identità.
- Browser UTM: tutti i risultati emessi positivi incluse le verifiche di archiviazione e ricarica, metadati corrotti e record legacy; il processo non ha terminato spontaneamente dopo l’output ed è stato interrotto.
- Browser conflitti waypoint: 83 casi e 36 transizioni di formato emessi come passati; il processo non ha terminato spontaneamente dopo l’output ed è stato interrotto.
- Debug self-check: 1280×720 e 1920×900 919/919, 390×844 922/922, 320×720 924/924; nessuna asserzione, errore console o errore di pagina. Esiti in `selfcheck-results.json`. Il runner ha scritto il JSON ma è rimasto attivo in chiusura ed è stato interrotto.
- Routing simulato: prima esecuzione timeout avvio Chromium a 7 s; retry con avvio 30 s ha eseguito parte degli scenari desktop ma si è fermato a un timeout click di 2,5 s sul pulsante di calcolo durante GH strict gate. Test incompleto, nessun esito complessivo né scenario mobile; la causa non è stabilita.
- Confini estesi: il run a 3.000 punti interni è stato interrotto dopo diversi minuti senza risultato; anche il subset da 100 punti interni, con tutti i casi di confine, è stato interrotto dopo attesa senza risultato; non si può dichiarare il superamento di questa suite.

Le prove usano rete esterna bloccata e profili browser isolati. Non sono verifica globale geodetica, routing reale, o copertura di tutte le interazioni.

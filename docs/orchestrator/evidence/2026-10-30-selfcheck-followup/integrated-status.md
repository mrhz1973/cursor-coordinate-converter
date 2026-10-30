# Stato QA del candidato integrato — 2026-10-30

Copia locale non deployata SHA-256 `b5a8c27f60f350ef1b914d29de4efefb7aa89d9c5cca4cce5ee972a8c521d6b5`: routing candidato, header Strumenti, stabilizzazione numerica MGRS sperimentale e correzioni dei self-check. Non è un PASS complessivo né una nuova versione LIVE.

- Chromium isolato, rete esterna bloccata: aggregato D-Flight 0/919 fallimenti a 1280×720 e 1920×900, 0/922 a 390×844, senza assert debug. A 1280 è stato registrato un `ERR_CONNECTION_REFUSED` non ancora attribuito. Dettagli in `integrated-results.json`.
- A 320×720 rimangono 5/922 controlli rossi, già presenti nella baseline, e l'aggregato segnala correttamente il fallimento; dettagli in `integrated-320-results.json`. Un primo run è scaduto senza risultato e non è PASS.
- Review indipendente self-check e grip: nessun blocco dimostrato nel perimetro esaminato; i cinque controlli a 320 restano aperti. Il controllo dock ha un rischio segnalato per primo chip in overflow; correzione proposta ma non ancora validata end-to-end. Grip testato con mouse in Chromium, non su dispositivo touch reale.
- La correzione MGRS modifica intenzionalmente il punto rappresentativo a 1 m di circa 0,141 micrometri verso l'interno; SW e NE non ricevono il bias, ma la normalizzazione può modificare bit bassi. La verifica indipendente ha rilevato 1.991 roundtrip numerici recuperati e zero peggiorati su 3.000 campioni, senza garanzia generale. Identità ai confini di zona/fascia e caso UTM diretto `46 S 389603 6540383` restano problemi preesistenti aperti, non risolti dalla patch.
- La review routing e i 24 test browser riportati in precedenza si riferiscono al byte precedente `72b92bf76c26203aa28142e2f3a4ce7e65d27dacb7f79afd4acb2ddff81361b2`: occorre verificare il byte finale dopo ogni modifica.
- L'audit statico di uniformità delle finestre è documentato in `modal-ui-static-audit.md`; la verifica visiva è in corso, senza considerare la sola analisi statica prova grafica.

Non distribuire finché i gate applicabili non sono soddisfatti. I problemi ai confini MGRS e UTM non vanno presentati come risolti.

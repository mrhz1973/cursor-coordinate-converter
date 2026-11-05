# Routing terrestre — candidato su Build 277

Candidato in staging, non distribuito: SHA-256 ed7d91fc990c0e3ae0e77ce28135aa6a56cb3bfc32859dae5ca4730072db21da. Il runtime live non garantisce ancora esclusione traghetti.

Chromium locale, provider simulati e rete esterna bloccata: 38 scenari e 4 transizioni strict/offline PASS. Casi includono ferry, alternative miste, dettagli mancanti, snap lontano e assenza collegamento. Due ulteriori prove verificano snap confermato a 150 m, conservazione coordinate originali e rifiuto di snap oltre 50 m dal punto confermato. Questi test non certificano i provider reali o tutte le combinazioni di profili e modalità.

Aperti: controllo snap confermato nel confronto provider, diagnostica HTTPS/LNA e prove effettive provider; Edge non si è avviato, test effettuati con Chromium/Chrome. Nessun deploy del candidato routing.

Variante compare SHA 97cf82211799cb107b3c3fa44bc461783cd2485a221cb6c10fbc478f40c61b60: 6 casi UI mock PASS, stesso punto confermato per GH e ORS, blocchi mismatch e conferma pendente, ORS lontano rifiutato. Prova browser HTTPS temporaneo verso GH reale: caso terrestre snap 1,4/1,9 m senza ferry PASS limitato; caso ferry deviazione senza ferry ma snap finale 407,4 m, gate snap FAIL: non usare il percorso. ORS e UI integrata con provider reali non verificati.

# Routing terrestre — candidato su Build 277

Candidato in staging, non distribuito: SHA-256 ed7d91fc990c0e3ae0e77ce28135aa6a56cb3bfc32859dae5ca4730072db21da. Il runtime live non garantisce ancora esclusione traghetti.

Chromium locale, provider simulati e rete esterna bloccata: 38 scenari e 4 transizioni strict/offline PASS. Casi includono ferry, alternative miste, dettagli mancanti, snap lontano e assenza collegamento. Due ulteriori prove verificano snap confermato a 150 m, conservazione coordinate originali e rifiuto di snap oltre 50 m dal punto confermato. Questi test non certificano i provider reali o tutte le combinazioni di profili e modalità.

Aperti: controllo snap confermato nel confronto provider, diagnostica HTTPS/LNA e prove effettive provider; Edge non si è avviato, test effettuati con Chromium/Chrome. Nessun deploy del candidato routing.

Variante compare SHA 97cf82211799cb107b3c3fa44bc461783cd2485a221cb6c10fbc478f40c61b60: 6 casi UI mock PASS, stesso punto confermato per GH e ORS, blocchi mismatch e conferma pendente, ORS lontano rifiutato. Prova browser HTTPS temporaneo verso GH reale: caso terrestre snap 1,4/1,9 m senza ferry PASS limitato; caso ferry deviazione senza ferry ma snap finale 407,4 m, gate snap FAIL: non usare il percorso. ORS e UI integrata con provider reali non verificati.

Variante SHA 17491204ec21c870b41b95a355cd14ffcb6fac7e71f9e2c35c3894827bf8bba6: 38 scenari e 4 transizioni PASS; QA indipendente punti verified e partial ORS PASS. UI candidata in origin HTTPS sintetica con LNA temporaneamente concesso: GraphHopper GET /info 200 READY; ORS GET status bloccata CORS MissingAllowOriginHeader. Nessun POST o modifica gateway. Gateway reale consente solo origin HTTP della versione attuale, occorre progettare compatibilità HTTPS senza modificare servizi estranei.

Variante ancora in staging SHA 8bada07bf241118fe4e32ecfd3aa214521803ab7092018e98866adfa81414116: suite 38+4 e 13 casi compare dedicati PASS mock; review indipendente senza blocker. Provider esplicito e snap riusabile: ORS può fornire parziale su S con GH offline; auto o anchor incompatibile resta bloccato. ORS reale via UI HTTPS rimane bloccato CORS; nessun deploy.

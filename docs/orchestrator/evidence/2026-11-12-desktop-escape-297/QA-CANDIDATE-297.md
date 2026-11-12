# Edge candidate QA Build297 - HTML sostituito solo in CDP

Candidata SHA256 e9be9dc2c694a930cb607d3bd71a56cdff4f8dd6a78b4d4e86d2ab15800b1a96. Browser Edge Windows CDP con origin HTTPS, profili temporanei isolati, richieste provider esterne bloccate.

- Guida minimizzata + Poligoni + Escape: baseline296 FAIL, candidata297 PASS. Guida resta minimizzata/ripristinabile, Poligoni si chiude.
- Strumenti minimizzati + Poligoni + Escape: baseline296 FAIL, candidata297 PASS. Strumenti resta minimizzato/ripristinabile, Poligoni si chiude.
- Guida e Strumenti visibili: Escape chiude il rispettivo pannello, 2/2 PASS.
- Guida e Strumenti minimizzati senza altri pannelli: restano minimizzati, 2/2 PASS.
- Regressione Converti, Indice IGM/IIM, Oggetti GIS, Pianifica percorso (Build296): 4/4 PASS.
- Mobile touch emulato 390x844: baseline296 e candidata297 2/2 comportamenti identici; il minimizzato viene chiuso prima del visibile sul touch, per scelta di non modificare la piattaforma in pausa. Il flag pass:false dei runner desktop NON rappresenta FAIL di parity.
- Zero POST e zero eccezioni JavaScript rilevate. Nessun test Safari/iPhone fisico.

La QA candidata non sostituisce il deploy o la QA HTTPS nativa live.

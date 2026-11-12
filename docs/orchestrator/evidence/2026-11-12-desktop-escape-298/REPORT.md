# Build298 - desktop Escape e dettagli D-Flight minimizzati

Data 2026-11-12. Categoria DELICATO lifecycle Escape, GIS desktop only.

## Identita sorgente
Base main docs 7b304e5c9aeb70befe21e4fcb1797e124361b107 / Build297 SHA256 e9be9dc2c694a930cb607d3bd71a56cdff4f8dd6a78b4d4e86d2ab15800b1a96.
Source commit Build298 651c872b914025d6f0e84b19e51313b92599342b; blob 2390e70f133e534b76e70e71e3fa30f1946ed94a; SHA256 deffea948b029fdc030bdf0ccf724e7ce6016ec539c746c1eb74e111ff353fca, 11.129.915 byte, 192 CR preservati. Unico file coordinate_converter Claude.html, 6 righe aggiunte / 4 eliminate.

## Baseline e fix
Nella Build297 LIVE, aprendo il pannello Dettaglio zona D-Flight con fixture sintetica session-only, minimizzandolo, aprendo Poligoni e premendo Escape, il dettaglio viene chiuso (pur lasciando dock e classe min presenti) e Poligoni resta visibile. Baseline 1/1 FAIL riprodotta in Edge isolato. Il blocco documentale della Build297 e stato chiuso separatamente su PASS dell'operatore relativo a Guida/Strumenti; non viene riaperto retroattivamente.

Fix circoscritto: la guardia del ramo Escape del dettaglio D-Flight riusa il predicato desktop GIS esistente per saltare il pannello quando minimizzato e lasciare chiudere Poligoni. Apertura, chiusura D-Flight visibile, modal, provider, contenuti e dati invariati. Comportamento mobile preservato e development mobile sospeso.

## Qualifica
Candidata 1 fix +1 visibile+1 minimizzato solo+1 parity touch+2 regressioni297+4 regressioni296 = 10/10 scoped PASS, zero POST/eccezioni. Sintassi inline JS 2/2 PASS, CR192. REVIEW GPT-SOSTITUTIVA statica su source full SHA 18/18 PASS, reviewer esterno NOT_PERFORMED/post-hoc backstop. Deploy GIS-only con backup della 297, unico restart e file/HTTP/HTTPS SHA verificati. ABQA Edge nativa sul runtime 298 senza injection: stessi 10 casi scoped PASS, terze richieste bloccate, zero POST/eccezioni. Non certifica dati o informazioni aeronautiche D-Flight reali. QA OPERATORE DESKTOP 298 PENDING. Le QA precedenti 294 e 295 restano pendenti indipendenti.

[Deploy](DEPLOY-RESULT-298.md) - [QA candidata](QA-CANDIDATE-298.md) - [QA LIVE](QA-LIVE-298.md) - [Review](REVIEW-GPT-298.json).

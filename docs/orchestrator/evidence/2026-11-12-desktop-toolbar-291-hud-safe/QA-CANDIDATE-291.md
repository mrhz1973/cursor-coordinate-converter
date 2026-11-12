# QA candidata Build 291

Edge CDP, origin HTTPS VPS, HTML candidato iniettato solo nel profilo browser isolato (NON runtime LIVE), provider esterni bloccati.

- Anti-overlap: 14/14 PASS a 1440×634, 1366×768, 1024×600, 960×650, 1920×1080, 1280×720, 960×540; ogni viewport scrollbar top e bottom. Nessuna intersezione fra pulsanti visibili e PUNTO/CURSORE/attribuzione; distanza orizzontale 18px; GPS raggiungibile tramite scroll se necessario. POST 0, blocked 323.
- Regresione gruppi 290: 76/76 PASS, POST 0, blocked 488.
- Waypoint: 25/25 PASS, POST 0, blocked 304.
- Sintassi Node inline 2/2 PASS, CSS desktop scoped, CR 192, diff --check PASS.

Non eseguiti QA LIVE 291 o QA operatore per questa fase. Console/pageerror generale non rilevati separatamente.

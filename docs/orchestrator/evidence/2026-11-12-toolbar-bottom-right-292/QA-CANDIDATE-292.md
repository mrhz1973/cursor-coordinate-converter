# QA candidata Build 292

Edge CDP su origin HTTPS VPS, HTML 292 iniettato solo in memoria, nessun deploy; risorse esterne bloccate e POST zero.

- Geometria HUD/GPS: 16/16 PASS su 8 viewport desktop (960×540, 960×650, 1024×600, 1280×720, 1366×768, 1440×634, 1440×900, 1920×1080), scroll top/bottom. Readout e attribuzione ancorati come nella 290; GPS dopo scroll termina almeno 44px prima di PUNTO ove visibile; collisioni zero.
- Branding 9/9 PASS in tutti i viewport: header, footer, meta application-name, titolo scheda TMAR GIS Tool. Layout mobile 390×844 invariato.
- Branding selftest: 17/18 PASS; unico storico BRAND_build_214 = build 234, già stale nella 291.
- Regression toolbar dual-groups 76/76 PASS dopo adeguamento aspettative di test al nuovo bottom 235px; originariamente 73/76 per vecchia attesa bottom 76px, solo harness corretto.
- Waypoint 25/25 PASS, nessuna regressione.
- Syntax JS inline Node 2/2 PASS, CR 192 conservati, git diff --check PASS.

Non QA live e non QA operatore; nessuna prova di provider cartografici esterni.

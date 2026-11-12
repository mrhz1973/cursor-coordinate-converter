# QA candidata Build295 — Edge in origin HTTPS con HTML iniettato

- File: SHA256 8bc8ce1bde2e448ba3b6f60f042d371520707c21b5f6cea581eacb8135724840, 11.127.935 byte. Candidate non LIVE su VPS.
- **86/86 PASS**: desktop 1920x1080,1440x900,1366x768,1024x768,960x650,1440x634,1200x650; mobile 1024x600 landscape e 390x844. Footer 30px/una riga, messaggio superiore nascosto, credits x=7px, cache al centro con asse esatto, attribuzione reale del layer a right=9px. PUNTO/CURSORE terminano 2px sopra footer, nessuna collisione con toolbar o scala; shift a sinistra sui desktop corti e GPS scrollabile.
- Sessione simulata solo in memoria di browser isolato: 107 tile, 1.2 MB -> footer aggiornato senza doppi cache-pill sopra mappa.
- **25/25 PASS** regressione Waypoint, pannelli/draft e chiusure conservate.
- Zero POST in entrambe le suite, provider esterni bloccati. Solo layout desktop scoping, niente telefono reale, niente prova provider Google reale.
- Il primo test 84/86 per gap di 2px (CSS originario 44 anziché 46), corretto source e test completo ri-eseguito 86/86. Dopo guardia fullscreen esplicita, nuovo run integrale 86/86 e Waypoint25/25 PASS.

Nessuna ABQA LIVE o QA operatore dichiarata a questo checkpoint.

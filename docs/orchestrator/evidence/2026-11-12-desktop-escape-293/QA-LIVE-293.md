# Automated Browser QA HTTPS LIVE — Build 293

Metodo: Edge headless via CDP su AsusDesktop, origin HTTPS /gis, **documento HTML nativo realmente servito senza iniezione**; profili temporanei isolati e provider esterni bloccati. File runtime 86d27e7707046ec9829f5be4ef2832aec86f4a6c, SHA256 b4bc346f74be303fa157bc8b7ebc80b532e50fec002edde55adf13ba64e3720e, 11.121.119 byte confermati via smoke HTTP/HTTPS.

- **21/21 PASS** tre scenari indipendenti: Mappe Offline/Cerca/Cronologia aperte da UI, minimizzate con il tasto −, poi Poligoni aperto direttamente dalla toolbar desktop. Escape chiude Poligoni e conserva il pannello minimizzato. Controlli Poligoni da solo e build/versione PASS.
- **17/17 PASS** regressione D-Flight: apri, minimizza/chip, conserva con Escape, Offline visibile, priorità, ripristina, close da Escape e ×, Poligoni visibile davanti a D-Flight minimizzato.
- **38/38 PASS**, zero FAIL, **0 POST**. Richieste a provider esterni bloccate. Nessuna regressione dati o endpoint introdotti dalla patch.
- Il cambiamento di priorità è limitato dalla guardia matchMedia desktop GIS; nessun test telefono reale, sviluppo mobile in pausa.

Limiti: console/pageerror non misurati separatamente, provider esterni non interpellati; 38 sono controlli ripetuti e non rappresentano 38 dialoghi distinti. Review esterna NOT_PERFORMED con backstop, review sostitutiva registrata.

**QA OPERATORE DESKTOP 293 — PENDING**, senza attestazione umana inventata.

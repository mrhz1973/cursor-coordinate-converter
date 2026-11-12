# Automated Browser QA LIVE — Build294

Metodo: Edge headless Windows su AsusDesktop con CDP, URL HTTPS /gis **nativo** servito dal VPS, nessuna HTML injection, profilo temporaneo isolato e richieste verso provider esterni bloccate. Hash sorgente 2556773e442a2822461067df118713375388e71825efc46195ffd12936887743, bytes 11.121.515 e servizio GIS verificati separatamente.

- **42/42 PASS**: sequenze di apertura, minimizzazione, Poligoni visibile, Escape chiude Poligoni e preserva pannello minimizzato per Astro, Range & Bearing, Misura, Offline, Cerca e Cronologia. Sei sessioni browser separate. POST zero; richieste esterne bloccate.
- **17/17 PASS** D-Flight: minimizzazione/chip, pannelli concorrenti, Poligoni davanti a D-Flight minimizzato, ripristino e chiusura ×/Escape. POST zero.
- **Totale 59/59 PASS, 0 FAIL**, 0 POST. Le 59 prove sono controlli di stato ripetuti, non 59 dialoghi distinti.
- Candidata precedente: Edge su PC lavoro DESKTOP-DPIJL64 36/36 PASS con HTML 294 iniettato su origin HTTPS, non prova LIVE. Un tentativo successivo di preparare il test LIVE sul PC lavoro è andato in timeout (Remote Desktop Commander originale non ha risposto alla scrittura); non si rivendica un esito LIVE WorkPC.
- Review DELICATA GPT-SOSTITUTIVA 31/31 PASS, reviewer esterno NOT_PERFORMED/backstop. Console/pageerror generali non raccolti separatamente; nessuna prova del telefono fisico.

Gate residuo: QA OPERATORE DESKTOP Build294 PENDING. Sviluppo telefono in pausa.

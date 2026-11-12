# QA browser LIVE nativa HTTPS — Build 291

**Metodo:** Edge CDP da AsusDesktop su HTTPS /gis, file effettivamente servito dal VPS, nessun HTML iniettato, profili browser temporanei isolati, provider di tile esterni intenzionalmente bloccati. Runtime Build 291, SHA 35d5dc79bc6e48e8d8d0558743411311e7fcfeb66db56218c5d07d908b3c46e5 verificata.

| Suite | Risultato |
| --- | --- |
| Anti-sovrapposizione HUD/colonna strumenti | **14/14 PASS**, viewport 1440×634, 1366×768, 1024×600, 960×650, 1920×1080, 1280×720, 960×540 con scroll top/bottom, 0 POST, 226 esterne bloccate |
| Regressione toolbar dual-groups Build 290 | **76/76 PASS**, gruppi blu alto/teal basso, allineamento Livelli, captions, viewport desktop + mobile emulato, 0 POST, 454 esterne bloccate |
| Regressione Waypoint | **25/25 PASS**, 0 POST, 304 esterne bloccate |
| Totale | **115/115 PASS**, 0 POST, zero FAIL |

Il test geometrico confronta il rettangolo *visibile* dei pulsanti (intersecato con viewport di scroll) con i riquadri PUNTO/CURSORE, attribuzione OpenStreetMap e altre aree map. Nessuna intersezione e almeno 18px fra HUD/attribuzione e bordo sinistro toolbar su tutti i desktop validati; scroll bottom rende GPS accessibile nei viewport corti. Non equivalgono a 115 finestre distinte.

Limiti: console/pageerror non misurati separatamente, provider esterni non esercitati, nessun telefono reale testato (sviluppo mobile in pausa), nessuna attestazione visiva operatore ancora ricevuta.

Gate: QA OPERATORE DESKTOP Build 291 — **PENDING**.

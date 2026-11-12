# Automated Browser QA LIVE — TMAR GIS Tool Build295

**Metodo:** Edge headless sul PC AsusDesktop via Chrome DevTools Protocol, origin HTTPS /gis, HTML **nativamente servito** dal VPS senza injection. Profili temporanei; richieste a provider esterni intenzionalmente bloccate. SHA256 del documento 8bc8ce1bde2e448ba3b6f60f042d371520707c21b5f6cea581eacb8135724840 verificata separatamente con HTTP interno e curl HTTPS Windows.

| Suite | Risultato |
| --- | --- |
| Footer/HUD/cache/attribuzione e responsive | **86/86 PASS**; 7 risoluzioni desktop e 2 mobile emulati. Footer 30px 1 riga, firma/build bordo sinistro, contatore cache centrato, attribuzione provider attivo a destra, PUNTO/CURSORE 2px sopra footer, shift HUD a sinistra se toolbar troppo lunga, nessun overlap con toolbar/scala, GPS scrollabile. Verifica contatore 107 tile e 1.2 MB via stato sintetico limitato alla sessione del browser isolato; POST 0, 558 risorse terze bloccate |
| Waypoint regressione | **25/25 PASS**, POST 0, 271 terze bloccate |
| Escape con pannelli minimizzati | **42/42 PASS** su Offline, Cerca, Cronologia, Astro, Range & Bearing e Misura; POST 0 |
| D-Flight regression | **17/17 PASS**, POST 0, 275 terze bloccate |
| **Totale** | **170/170 PASS, zero FAIL, zero POST** |

Il primo tentativo di ripetere la suite Escape 295 si è fermato per timeout di caricamento dell'HTML nel runner; la soglia di attesa del solo test è stata ampliata e la suite nativa rieseguita integralmente 42/42 PASS, senza modifiche al runtime. I conteggi comprendono verifiche ripetute e non indicano 170 finestre diverse.

Limiti: console/pageerror generali non campionati separatamente, provider tile terzi non interrogati, nessuna prova telefono reale (sviluppo mobile in pausa). La dicitura provider è clonata dall'attribuzione effettiva, ma specifico imagery Google non confermato in rete LIVE.

Review GPT-SOSTITUTIVA 42/42 PASS, reviewer esterno NOT_PERFORMED e backstop post-hoc. Gate residuo: **QA OPERATORE DESKTOP Build295 PENDING**; distinto dal precedente gate Escape294.

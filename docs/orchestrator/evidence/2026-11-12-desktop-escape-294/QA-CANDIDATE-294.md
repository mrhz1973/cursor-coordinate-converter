# QA candidata Build294, Edge sul PC del lavoro

- Baseline Build293 live origin HTTPS: Astro, Range & Bearing e Misura minimizzati, Poligoni visibile, Escape NON chiude Poligoni; **13/16 PASS, 3 FAIL**, POST 0.
- Candidata Build294 da branch GitHub su disco temporaneo PC lavoro, documento inserito in memoria via CDP nell origin HTTPS; nessun file LIVE sostituito e nessun deploy.
- **36/36 PASS**, 0 FAIL: Astro, Range & Bearing, Misura, Offline, Cerca, Cronologia, D-Flight; per ciascuno build verificata, pannello aperto/minimizzato, Poligoni aperto, Escape lo chiude e mantiene minimizzato il pannello.
- **POST 0**; provider esterni bloccati 578. Browser Edge headless 1440x1000 con profilo temporaneo.
- Verifica statica: mobile/fuori GIS mantengono i vecchi early return. Nessun telefono reale, sviluppo mobile in pausa.

Questi sono controlli funzionali ripetuti, non 36 diverse finestre GIS. QA LIVE 294 e QA operatore ancora PENDING.

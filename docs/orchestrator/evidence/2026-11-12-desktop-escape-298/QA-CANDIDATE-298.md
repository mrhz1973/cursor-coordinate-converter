# QA candidata Build298 - Edge HTTPS con HTML isolato CDP

SHA256 candidato deffea948b029fdc030bdf0ccf724e7ce6016ec539c746c1eb74e111ff353fca. Edge Chromium headless su Windows, URL origin HTTPS, HTML sostituito solo nel browser isolato, provider esterni bloccati. Nessun POST, zero Runtime.exceptionThrown.

| Suite | Risultato |
| --- | --- |
| Dettaglio D-Flight minimizzato + Poligoni visibile + Escape | Baseline297 FAIL; candidato298 PASS, Poligoni chiuso e dettaglio ancora minimizzato/dock presente |
| Dettaglio D-Flight visibile + Poligoni + Escape | PASS, chiude dettaglio visibile e lascia Poligoni |
| Dettaglio D-Flight minimizzato senza altro pannello | PASS, rimane minimizzato |
| Touch emulato 390x844 | PASS parity rispetto alla 297: comportamento mobile precedente identico, non una correzione telefono |
| Regressione Guida e Strumenti minimizzati | 2/2 PASS |
| Regressione Converti, Indice carto, Oggetti GIS, Routing minimizzati | 4/4 PASS |

Totale 10/10 risultati attesi. Dettaglio D-Flight alimentato esclusivamente con fixture sintetica locale session-only; nessuna query al provider reale, nessun dato utente alterato. Il runner di test desktop stampa pass:false sul touch per indicare la priorita desktop non applicata: la parity e PASS per identita del comportamento fra Build297 e 298. QA operatore non inferita.

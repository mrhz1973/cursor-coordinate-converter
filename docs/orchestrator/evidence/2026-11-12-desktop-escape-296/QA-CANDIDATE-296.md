# QA candidata Build296 ? Edge origin HTTPS con HTML sostituito solo in sessione CDP

SHA256 sorgente 380ee97a3cb82feba3592016011e7510b63df7aab4ec82bc786d842d3484e2ff. Browser Edge Windows, profilo isolato, risorse esterne bloccate e zero POST.

| Suite | Baseline295 | Candidata296 |
| --- | --- | --- |
| Converti minimizzato + Poligoni, Escape | FAIL | PASS |
| Indice IGM/IIM minimizzato + Poligoni, Escape | FAIL | PASS |
| Oggetti GIS minimizzato + Poligoni, Escape | FAIL | PASS |
| Pianifica percorso minimizzato + Poligoni, Escape | FAIL | PASS |
| Quattro pannelli visibili, Escape | Non ripetuto baseline | 4/4 PASS |
| Quattro pannelli minimizzati senza altro pannello | Non ripetuto baseline | 4/4 preservati |
| Touch emulato 390x844 | quattro stati acquisiti | 4/4 identici alla 295 |

Le prove utilizzano real opener e minimization handler (non soltanto dialog.show sintetico), con assestamento di circa 300ms nei test. Un tentativo di Routing senza attesa sufficiente ? stato etichettato artefatto dell'harness e non PASS/FAIL del prodotto. Nessuna richiesta POST, nessuna eccezione JavaScript nei test target, nessuna prova Safari/iPhone fisico.

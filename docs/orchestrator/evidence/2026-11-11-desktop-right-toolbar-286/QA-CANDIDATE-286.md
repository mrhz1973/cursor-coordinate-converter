# QA candidata 286

Documento candidato iniettato nel browser Edge (origin HTTPS VPS preservato). **NON ABQA live**.
- 33/33 controlli PASS; 0 POST; 424 richieste accessorie bloccate.
- A 1440x900, 1366x768, 1920x1080 e 1024x768: toolbar a due colonne, 12 comandi etichettati visibili, menu frecce desktop non necessari, Poligoni/R&B aprono direttamente, Livelli apre, icona Waypoint SVG inline presente.
- A 390x844: didascalie desktop non visibili, flyout mobile espandibili come prima, IMG mobile originale preservato (senza dichiararne il fetch funzionante).
- L'icona GPS rimane presente e il pulsante Waypoint ha icona visibile in SVG inline nel markup.
- Test geometrico/click via CDP, non valutazione percettiva umana. Nessun certificato generale delle 38 finestre. Console generica non acquisita separatamente.

Candidato source 6fc34c2a614728b6acc8a9eeae6270a06427d0fe; SHA-256 af28f2585016c495362a5046ee9d0c4a3a75f0d27cdbf1c750807e1511b4e63c.

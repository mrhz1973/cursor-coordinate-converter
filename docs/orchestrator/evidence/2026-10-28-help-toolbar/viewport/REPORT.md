# Regression viewport mobile — build 267

Candidate SHA256 `06fed6daf3f4843538eda8f9f0139e7bfc8605c26baae2bfd977f08eb7898f74`, browser Chromium con emulazione `isMobile`/touch a larghezza CSS effettiva 320 e 390. Risultati limitati agli scenari eseguiti, non dispositivo fisico.

- Matrice 38 helper e 48 interazioni Cerca/Converti/Incolla/routing: 38/38 + 48/48 su ciascuna larghezza; nessun errore JavaScript. JSON `matrix320.json`, `matrix390.json`. Alcuni pannelli predisposti via evaluate, inserimento e conferma reali; provider esterni intercettati/bloccati.
- Editor waypoint 4/4 e vertici poligoni 4/4 su 320 e 390. I tre vertici sono creati tramite click reali su punti della mappa identificati con `elementFromPoint`; JSON `editor320.json`, `editor390-adjusted.json`. Lo script storico con offset fissi produceva zero vertici sia baseline build266 sia candidate perché cliccava fuori dall'area utile: non era evidenza di regressione né di PASS.
- Mappe Offline: apertura mediante tab effettivo e chiusura click, hit-test del pulsante di chiusura, PASS su 320 e390; screenshot `offline320.png`, `offline390.png`; harness `offline.cjs`.
- In un candidate intermedio le tab Cerca/Mappe Offline a 320 erano compresse fino a non essere cliccabili; corretto il gruppo con scorrimento orizzontale, poi ripetuti i test sopra sul candidate specificato. Review indipendente richiesta.
- Strumenti, Esporta/JPG, Escape, Guida/FAQ, Note e lifecycle chiusura/minimizzazione verificati inoltre su 1440×900, 1024×768, 390×844, 320×568, 844×390 mobile e 820×420; test `../test.cjs`. Selfcheck debug PASS senza assert/pageerror.

La modifica del meta viewport agisce globalmente: questi controlli non attestano ogni flusso, tutta la cartografia, i provider in rete o modalità non GIS. Test indipendenti e QA operatore restano necessari.

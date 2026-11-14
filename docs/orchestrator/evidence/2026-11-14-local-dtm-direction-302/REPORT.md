# Build302 - ROUTING-LOCAL-DTM-DIRECTION-INVARIANCE-B

Data: 14 novembre 2026. Task svolto da GPT attraverso TMAR Desktop Commander Win; non Cursor. Fonte canonica operativa: GitHub origin/main. Review e QA automatizzata sono distinte dalla QA operatore sul percorso reale.

## Difetto riprodotto Build301

Su un percorso pubblico di circa 43.537 m e un GeoTIFF DTM ufficiale Liguria 2023, grid raster nativa 5m EPSG:3003, il valore assoluto della massima pendenza su 5m cambiava invertendo il percorso:
- A -> B: +85.142980%;
- B -> A: -85.731134%.
La differenza circa 0.588 punti percentuali dipendeva dall allineamento delle finestre 2.5m unicamente all inizio del percorso. Non derivava da un reale cambiamento di pendenza al suolo. Inversione di salita/discesa deve cambiare segno, non valore assoluto o percentile 95.

## Fix Build302

Conserva il raster originale, il parser GeoTIFF, trasformazione EPSG3003, algoritmo di quota bilineare, formule distanza, rete opt-in e divieti OPSEC. La sola routine routingLocalDtmBuildProfile calcola entrambe le griglie di campionamento a passo 2.5m: una ancorata alla partenza, l altra alla fine, con deduplicazione di finestre coincidenti. Entrambe campionano tratti reali di 5/10m e respingono finestre con NoData. Max assoluta, segno, posizione e P95 sono ricavati dalle finestre qualificate. La lettura al cursore sceglie il campione qualificato piu vicino di entrambe le griglie, evitando discrepanze con la massima mostrata; reset memoria confermato.

## Evidenza numerica

Sullo stesso tratto reale DTM in Build302:
- 5m: +85.731134% avanti / -85.731134% indietro; P95 identico 85.572854%.
- 10m: +83.870288% avanti / -83.870288% indietro; P95 coincide entro 0.000001 punti percentuali.
- Test 18/18 su 9 casi (dritto diagonale/east/north, curvo, corto, piano, piano sintetico, buchi quota, tutto NoData) e entrambe le finestre: PASS.
- 4/4 cursor max coherence su avanti/indietro e 5/10m: PASS.
- Regressioni piani inclinati 7/7, GeoTIFF validazione 8/8, offline/OPSEC PASS. Stress 10001 punti con tempo di elaborazione ~52-86 ms nelle esecuzioni Edge, dato descrittivo e non SLA.

## Limite geografico non risolto

Spostando trasversalmente di pochi metri lo stesso breve tracciato sulla griglia DTM, i valori cambiano comunque: con offset da -6m a +6m, massima su 5m compresa in circa 82.9%-98.9% nel nuovo campionamento e massima su 10m circa78.3%-91.7%. Non e una banda di confidenza statistica del territorio, ma una prova di sensibilita al georeferencing e alla posizione della traccia. Griglia5m non significa accuratezza planimetrica/verticale5m, trasformazione del datum nominale ~4m. Nessuna pretesa di qualifica topografica in situ, nessun valore estremo nascosto o tagliato arbitrariamente.

## Identita, review, deploy

Repo mrhz1973/cursor-coordinate-converter, parent main ee2ecd4c466840a32fc4d4384d882d0ae430e66b. Source commit Build302 182b83a32dc9a32fa2a748458a9ad6f7b5b066a5, Git blob a58e1096feccb3df1fb1d24e3b6dccf494c38024, SHA256 HTML 35c1af1dcb30c44fa7f136a19f7d3df4618ffbbdf5a64c1722c222f3271c253f, 11160380 byte, 192 CR, zero CRLF, unico file modificato coordinate_converter Claude.html (69 aggiunte,39 rimozioni). Nessun nuovo GPS, provider, storage, framework, dipendenza o cambio del monolite.

Review GPT-SOSTITUTIVA 34/34 PASS sui byte di source object da Git. Una prima verifica tramite semplice ricerca del nome proiezione aveva prodotto un falso finding; corretta con confronto esatto dei corpi funzione GeoTIFF, EPSG3003, WCS e network listener: identici al parent. Reviewer AI esterno NOT_PERFORMED, backstop post-hoc.

Deploy GIS-only da main source con backup Build301 /var/backups/goi-gis-runtime/20261114T183851Z-build302, restart unico goi-gis-app.service PID 1043544 -> 1427028, SHA file/HTTP/HTTPS matching. Primo HTTP immediato al riavvio connection refused durante la readiness, retry limitato PASS. Nessuna modifica a GH, ORS, proxy, infrastruttura o mobile. QA HTTPS nativa ripete i test di inversione, cursore, offline, GeoTIFF, regressioni20 200m e finestre Escape, zero POST/JS exception. Nessun nuovo download WCS nella QA302: riusato il DTM pubblico campionato in precedenza.

## NEXT
QA operatore sul suo percorso originale con pendenze irregolari, se disponibile, e confronto con rilievi verificati per precisione al suolo. Gate umano PENDING; accuracy DEM HOLD. I gate QA umani precedenti restano separati. Reviewer esterno NOT_PERFORMED. Non sostituire i provider o introdurre GPS/rilevazioni silenziose per superare artificialmente il gate.

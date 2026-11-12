# Desktop toolbar — FIX1 anti-sovrapposizione, Build 291

Data: 2026-11-12 10:07:49 Europe/Rome. Stato storico PREDEPLOY; nuova evidenza LIVE riportata sotto. La Build 290 LIVE ha ricevuto feedback negativo con screenshot: pulsanti verdi Nuovo punto e GPS sopra i due riquadri PUNTO/CURSORE e attribuzione OpenStreetMap. Browser Edge ha riprodotto la collisione reale su 5 viewport (desktop basso incluso) con e senza scroll.

## Stato LIVE dopo il deploy

Build 291 LIVE sul VPS. Review routine 16/16 PASS; deploy GIS-only, backup 290, hash HTTP/HTTPS PASS. ABQA nativa Edge **115/115 PASS** (14 anti-overlap, 76 dual-groups, 25 Waypoint); zero POST. GATE QA OPERATORE DESKTOP **PENDING**. [Deploy](DEPLOY-RESULT-291.md) · [QA LIVE](QA-LIVE-291.md).

## Diagnosi e soluzione
La colonna strumenti destra è larga 68px e dista 10px dal bordo destro. PUNTO/CURSORE e attribuzione erano anch'essi allineati al bordo destro; bottom:76px della toolbar non evita l'intersezione orizzontale. Build 291 applica CSS esclusivamente desktop hover/pointer fine: right:96px per .tile-readout e .tile-attrib e massimo 55% di larghezza per il readout. Restano 18px tra strumenti e dati; toolbar, gruppi blu/verde, scroll e posizione dei pulsanti rimangono inalterati.

## Identità
Base main 9027c9eeedd524119e47f9981b9992312b01237b; source code a32bf2b5eede5ffcfbc0307eda8b4a0171edb6e9; blob HTML 76211816541dbf54651171f7febe4f5150ff4ae3; SHA256 35d5dc79bc6e48e8d8d0558743411311e7fcfeb66db56218c5d07d908b3c46e5; bytes 11.120.857; 192 CR invariati. Differenza nel solo coordinate_converter Claude.html: 13 righe aggiunte e 3 eliminate (CSS + metadati build). Nessuna modifica agli script JS funzionali, OPSEC, rete, mapWaypoints, GPS o mobile.

## Gate e verifiche
Review routine 16/16 PASS, [JSON](REVIEW-291.json). Sintassi due JS inline Node PASS.
QA candidata Edge sull'origin HTTPS con HTML 291 sostituito in memoria (non LIVE): 14/14 anti-overlap, 76/76 regressione dual-groups, 25/25 Waypoint; zero POST in tutte le suite; [QA](QA-CANDIDATE-291.md). I test comprendono ripetizioni fra viewport, non 115 dialoghi diversi.

NEXT: GitHub main fast-forward, preflight/backup 290, unico restart GIS e verifica hash HTTP/HTTPS, ABQA nativa senza iniezione, poi breve QA umana di assenza sovrapposizioni. Il vecchio PASS tecnico 290 non sostituisce la QA visiva negativa.

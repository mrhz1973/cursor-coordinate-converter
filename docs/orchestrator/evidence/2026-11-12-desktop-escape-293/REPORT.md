# Escape priorità pannello visibile — GIS desktop Build 293

Registrazione 2026-11-12 11:57:32 Europe/Rome. Stato: PREDEPLOY, review sostitutiva completata.

## Storia e baseline attuale
Il ramo sperimentale 284 (code commit 274e59c0e972189f937af78ad2c6080150ed8247) derivava dalla Build 283, non è mai stato distribuito ed è incompatibile come monolite con la Build 292 LIVE. Audit ex novo sul runtime 292 native HTTPS, Edge Windows: 21 prove, 18 PASS e tre FAIL indipendenti. Con Mappe Offline, Cerca o Cronologia minimizzata e Poligoni visibile, Escape non chiude Poligoni. Controllo Poligoni da solo PASS. Nessun POST, provider esterni bloccati.

## Correzione 293
Commit codice 86d27e7707046ec9829f5be4ef2832aec86f4a6c basato esattamente sul main 4c7484aa4bb6de7b3ecf70de5a1ad415aea0b706, monolite unico. Modificate tre guardie di Escape in gisInit per ignorare il pannello minimizzato **solo** in GIS desktop con media query min-width 960px, hover e pointer fine. Fuori da GIS e nel mobile il vecchio early-return resta, come pure le funzioni closeSearchPanel, closeHistoryPanel, closeLayersPanel. Funzioni GPS, dati, OPSEC, rete, storage, modali e CSS non toccati. Metadata Build aggiornati al 293.

Source blob f7ef7266bbf6d0b9912bc9f9d6f0c9f0336c7442, SHA256 b4bc346f74be303fa157bc8b7ebc80b532e50fec002edde55adf13ba64e3720e, 11.121.119 byte, 192 CR invariati, delta HTML 13 righe aggiunte, 6 eliminate. JavaScript inline Node 2/2 PASS.

## QA candidata e review
- Browser Edge origin HTTPS con documento candidato iniettato in memoria: 21/21 PASS sui tre scenari, 0 POST; finestra Poligoni chiusa da Escape e pannello minimizzato preservato.
- Regressione D-Flight precedente: 17/17 PASS, 0 POST; minimizzazione, ripristino e Escape preservati.
- REVIEW GPT-SOSTITUTIVA 32/32 PASS sul commit source fissato e relative invarianti; nessuna review esterna effettivamente eseguita, NOT_PERFORMED. Post-hoc backstop aperto quando disponibile. [Review](REVIEW-GPT-293.json) · [QA](QA-CANDIDATE-293.md).

Resta da pubblicare 293 su main, effettuare deploy solo GIS e QA browser **nativa** della Build 293, quindi QA umana breve desktop. I PASS candidati non autorizzano da soli la chiusura.

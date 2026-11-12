# Build295 — footer desktop single-row + HUD anticollisione

**Data:** 2026-11-12 20:07:23 Europe/Rome. **Stato storico:** PREDEPLOY. La Build295 è ora LIVE come da evidenze sottostanti. **Incarico:** schermata annotata operatore, delta desktop.

## Stato LIVE verificato

La Build295 è LIVE su VPS, source b213b80fb8c006508e40d6d50e79a0036f3a8cfe, blob 57eb5cedf84982806bdd726c438d4d35acf473eb, SHA 8bc8ce1bde2e448ba3b6f60f042d371520707c21b5f6cea581eacb8135724840, 11.127.935 byte. Review GPT-SOSTITUTIVA 42/42 PASS, deploy GIS-only/backup294 e smoke HTTP/HTTPS PASS. ABQA HTTPS nativa **170/170 PASS**, 0 POST: footer/HUD 86, Waypoint 25, Escape 42, D-Flight 17. QA operatore PENDING. [Deploy](DEPLOY-RESULT-295.md) · [QA LIVE](QA-LIVE-295.md).

## Richiesta e risultato progettato
La banda nera inferiore deve occupare una riga: credits+build a partire dal bordo sinistro, valore **Cache sessione** al centro, attribuzione reale **Imagery / © OpenStreetMap** del layer in uso a destra. Il punto 2 cerchiato nello screenshot indica la dicitura Imagery © Google — proxy tailnet; non è un nuovo campo/etichetta statico. La frase superiore Applicazione 100% offline... scompare **solo dal footer GIS desktop**; testo preesistente conservato per schermate non-GIS. PUNTO/CURSORE finiscono 2px sopra la banda; la toolbar resta sopra con un pulsante di gap su desktop capiente. Su viewport piccolo, se la colonna completa non entra, il readout scivola a sinistra della toolbar e questa può arrivare vicino al footer, senza overlap. Mobile con viewport 390x844 e 1024x600 landscape resta identico.

## Implementazione
- Source code b213b80fb8c006508e40d6d50e79a0036f3a8cfe, base dbf79751af42039fffef1938d29330a4d0be6b6a; blob 57eb5cedf84982806bdd726c438d4d35acf473eb, SHA256 8bc8ce1bde2e448ba3b6f60f042d371520707c21b5f6cea581eacb8135724840, 11.127.935 byte, 192 CR preservati; unico runtime coordinate_converter Claude.html (124 righe aggiunte, 14 eliminate).
- Footer HTML con contenitore .gis-footer-row e 3 elementi; CSS nuovo sotto media query desktop hover/pointer fine, senza framework o split. Altezza footer GIS 30px, logo/copyright e build in una sola riga.
- Layer attribution acquisito da .tile-attrib già renderizzato usando cloneNode/replaceChildren per conservare testo e link, senza endpoint o nuovi valori; i18n non alterata. Solo UI desktop nasconde il duplicato nella mappa.
- Cache nel centro usa esclusivamente ensureTileCacheSession e label map.cacheSession già presenti. **Nessun mutamento IDB/cache/network/stats/persistenza**. Counter locale del layer map continua sul mobile.
- Predicato desktop esclude mobile landscape e fullscreen; posizionamento HUD fisso sopra footer e shift dinamico con CSS/RAF coalesced, misura scrollHeight/altezza elementi. Stato solo classe CSS temporanea; nessuna modifica a state.mapWaypoints[].

## Gate e prove
QA Edge candidata origin HTTPS con documento sostituito solo in memoria: **86/86 PASS**, viewport da 960x650 a1920x1080, 390x844 e 1024x600; verifica 3 colonne footer, attribuzione reale, cache dinamica, scala/toolbar senza collisioni, GPS accessibile e mobile invariato. POST 0, provider esterni bloccati. Waypoint regressione **25/25 PASS** indipendente. [QA](QA-CANDIDATE-295.md).
Review source full SHA: **REVIEW GPT-SOSTITUTIVA 42/42 PASS**, esterna NOT_PERFORMED con post-hoc backstop, poiché si tocca sola UI del contatore cache; roundtrip dati N/A (nessun nuovo write-path). [Review](REVIEW-GPT-295.json).
No deploy, QA live o PASS operatore Build295 anticipati. Gate Escape294 pendente, distinto.

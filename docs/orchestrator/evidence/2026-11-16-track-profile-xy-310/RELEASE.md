# Build310 LIVE — profilo altimetrico tracce XY salvate

**Verifica:** 16 novembre 2026; deploy UTC 2026-11-16T22:52:12.872219+00:00.
**Block:** GIS-SAVED-TRACK-PROFILE-XY-A.
**GATE:** REVIEW GPT-SOSTITUTIVA PASS; JS inline 2/2 PASS; Edge candidato 30/30 PASS e HTTPS LIVE 30/30 PASS; **QA OPERATORE PENDING**. Reviewer AI esterno NOT_PERFORMED/post-hoc.

## Perché
Le tracce create col pennello o importate senza quota non generavano profilo, pur essendo salvate correttamente come XY. L'operatore ha richiesto la correzione dopo la sua conferma QA del blocco FIX2 Build309.

## Delta Build310
- In Tracce salvate, click Profilo su traccia di almeno 2 punti priva di quote → pulsante Calcola quote dal terreno.
- Se DTM locale EPSG:3003 è già caricato, stima offline con campionamento indicativo 5 m; altrimenti usa Open-Meteo Elevation GLO-90, risoluzione 90 m, esclusivamente con rete consentita e conferma esplicita dei punti inviati. Fino a 300 campioni, richieste da al massimo 100 coordinate.
- Nessun GPS, networking o geolocalizzazione spontanei nel nuovo flusso. Rete non consentita, OPSEC Strict o rifiuto: nessun batch del nuovo profilo inviato.
- Profile source distinta (routing-gh / terrain-open-meteo-glo90 / terrain-local-dtm-5m), provenance leggibile in grafico e warning che DTM non è precisione topografica certificata 5–10m.
- Coordinate e quote originali GPX/KML mai sovrascritte; calcolo solo se non c'è già un profilo/serie importata. Salvataggio atomico con schema/geom hash e read-back; ripristino raw origin su errore.
- Anche le tracce già salvate sono supportate, senza ridisegno. Export XYZ originale non modificato; valori di profilo stimato non esportati come quote reali.
- Sviluppo telefono PAUSA, nessuna nuova UI mobile attiva nel test a 390px.

## Identità attestata
- Source commit: e0b7e133dea16e38d083a53a50276a232609e8fd.
- Blob Git: c26828b64ffd100829f031db53027615483065ed.
- SHA-256 full HTML: ff0c618e089a56cdba221e9f69d35273f0b34996c4e17be4ed6c013152373aea.
- 11.213.149 byte, CR192/CRLF0. Single HTML senza split.
- Backup pre-deploy: /var/backups/goi-gis-runtime/20261116T225212Z-prebuild310.
- Restart SOLO goi-gis-app.service: PID 2135386 → 2370134 (uno). HTTP interno e HTTPS stesso hash e file.
- URL: https://ionos-n8n-new.tailc01234.ts.net/gis?v=ff0c618e

## Test e review
- [Review GPT-SOSTITUTIVA](REVIEW.md) e [review statica](review-static.json).
- [Edge candidata](candidate-qa.json) e [Edge HTTPS LIVE](live-qa.json): ognuna 30/30 PASS, 17 click nativi, zero POST, eccezioni e console errors.
- Salvataggio via funzione canonica pennello, archivio, Profilo, stima locale, mock provider esterno, offline, OPSEC Strict, rifiuto, errore HTTP, errore localStorage, ricaricamento/revisione origin, originali GPX, export/import GeoJSON e polygon sanitizer, limite campioni, viewport mobile.
- [Identità deploy](runtime-identity.json), [manifest screenshot](screenshots-manifest.json), quattro screenshot reali candidato e HTTPS; nessun dato operativo dell'utente e nessun provider esterno realmente contattato dai test API (payload sintetici CDP).
- Cleanup storage dell'origine isolata PASS; cleanup directory temp Edge Windows parziale (profileDirectoryRemoved=false nei run finali), senza alterazione dei permessi del computer.

## QA operatore e HOLD
Aprire la URL sopra → Traccia → Tracce salvate → Profilo su una traccia pennello già salvata senza quota → Calcola quote dal terreno. Il dialogo di rete deve apparire solo in assenza di DTM locale e quando la rete è consentita. Dopo il consenso il grafico deve comparire e restare dopo riapertura.
Solo dopo prova operatore reale: QA GIS-SAVED-TRACK-PROFILE-XY-A PASS operatore.
Resta HOLD l'accuratezza topografica DTM 5–10m; eventuali quote importate parziali non vengono qui integrate, altre richieste batch/tabelle separate nel backlog. Reviewer esterno NOT_PERFORMED/backstop.

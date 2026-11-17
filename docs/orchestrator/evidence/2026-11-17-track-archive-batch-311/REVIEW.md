# Review Build311 — importazione batch archivio tracce

**Block:** GIS-TRACK-ARCHIVE-BATCH-10-A.
**Tier:** DELICATO (file non fidati, storage/persistenza, create-path).
**Gate:** REVIEW GPT-SOSTITUTIVA PASS prima del deploy, 17 novembre 2026.
**Reviewer esterno:** NOT_PERFORMED; backstop post-hoc resta aperto. Non attribuire una review ad altri agenti non utilizzati.

## Identità review immutabile

- Commit sorgente: 4ddcb641b756ac987f619c2cd7fa09e236734147.
- Blob monolite: da91f41a861b1390bb873d371b108b5539152a56.
- SHA256: 4381c1930a358fc8ad5842507a40a5d44caaa8466708e66c050991e5b2c0fc4d.
- File: coordinate_converter Claude.html, 11.226.592 byte, CR192/CRLF0, delta +325/-72, unico file runtime modificato.
- SHA dimostrato con git show FULL_SHA:path e confronto byte-identico al candidato. Metodo canonico AI-BOOT e OM §4.

## Checklist per categorie a rischio

1. Parsing/sanitizer: parser gisImportHubParseOneFile riusato per GPX/KML/KMZ/GeoJSON; comportamento hub generale invariato. Classifier esteso solo con metadati session-only lineNames[] associati ai lineParts[]. Limite 10 file e 10 tracce; abort se zero, oltre 10, coordinate o quote invalide, punti oltre cap.
2. Selezione/visibilità: solo trackArchiveFileInput inferiore è multiple; trackFileInput corrente resta singolo. Ogni segmento è traccia autonoma con nome, file, punti e quote in anteprima. Tutte nascono con visible:false. Bozza, waypoint, poligoni, oggetti GIS e selezioni restano invariati. Solo azione esplicita Mostra/Centra modifica la mappa.
3. Nomi/XSS: nomi da spatialSanitizeImportedTrackLabel, DOM costruito con textContent/value e mai innerHTML contenente file; duplicati disambiguati (2), campi vuoti bloccano il batch.
4. Altitudini: spatialLineToTrackPoints e savedTrackBuildImportedElevations costruiscono addon hash-bound esistente per quote originali e mancanti; nessuna stima né fetch automatico. Profilo XY Build310 indipendente.
5. Transazione/create path: prevalidazione totale, gisImportHubTakeSnapshot con snapshot aggiuntivo bozza/gisTracks/selezione, tutte le creazioni in memoria e unico saveStoreReported; readback per ogni ID con trackVerifyPersistedSavedTrack, savedTrackPersistedEqualCanonical e gisImportHubVerifyPersistedAddedRefs. Errore: restore esatto snapshot e localStorage RAW, rollback FAIL dichiarato senza occultamento.
6. Compatibilità: IT/EN/FR, CSS limitata a UI desktop, mobile in pausa, invariati framework/ES module/GPS/rete/tile/proxy/OPSEC. Nessuna modifica aree fuori perimetro.
7. Browser QA candidata: Edge CDP con fixture sintetiche isolate, 30/30 PASS; 22 clic nativi, 10 selezioni file, zero POST, zero eccezioni/console. 4 file con 10 tracce, 11 percorsi/file e 11 file rifiutati, geometria invalida, nome vuoto, UX 1280×600, cap archivio, annullamento, persistenza/reload, altitudini parziali, duplicati, invisibilità, import superiore singolo.
8. Rollback forzato: terzo inserimento interrotto, readback fallito dopo scrittura, QuotaExceeded; memoria e storage precedenti ripristinati. Cleanup origine browser PASS; alcune directory Edge Windows non eliminate in un run, nessuna modifica permessi.
9. Scope e limiti: DTM e accuratezza pendenza 5–10m HOLD, sviluppo mobile PAUSA. Nessuna regressione estesa fuori scope ripetuta.

## Verdetto

REVIEW GPT-SOSTITUTIVA PASS del bundle DELICATO sulla FULL_SHA indicata. Reviewer AI esterno NOT_PERFORMED; backstop review esterna post-hoc aperto. Gate successivo: deploy GIS-only e QA HTTPS sulla stessa identità. QA operatore Build311 ancora PENDING.

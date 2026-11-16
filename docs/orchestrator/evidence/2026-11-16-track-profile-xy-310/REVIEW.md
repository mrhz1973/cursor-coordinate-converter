# Review Build310 — GIS-SAVED-TRACK-PROFILE-XY-A

**Classificazione:** DELICATO (persistenza quote, consenso rete, DTM).
**Gate pre-deploy:** REVIEW GPT-SOSTITUTIVA PASS, 16 novembre 2026.
**Reviewer AI esterno:** NOT_PERFORMED; backstop esterno post-hoc ancora aperto.

## Identità verificata dal sorgente immutabile
- Commit FULL_SHA: e0b7e133dea16e38d083a53a50276a232609e8fd.
- Blob monolite: c26828b64ffd100829f031db53027615483065ed.
- SHA256: ff0c618e089a56cdba221e9f69d35273f0b34996c4e17be4ed6c013152373aea.
- 11.213.149 byte, CR192/CRLF0. Unico file modificato: coordinate_converter Claude.html, delta +252/-20.
- Verificati git show FULL_SHA:path, comparazione byte-identica al candidato e SHA dei run CDP.

## Checklist di review
1. UI e ambito: Calcola quote solo sul profilo di una traccia archiviata XY con >=2 punti. Handler registrato una sola volta. Apertura profilo senza nuove richieste API. Mobile 390 px: controllo non visualizzato. Nessun GPS, framework, ES module, TypeScript, npm o servizi adiacenti.
2. OPSEC/rete: campionamento DTM locale già caricato prioritario, senza rete. Fallback Open-Meteo solo dopo azione volontaria, controllo internetApiFetchAllowed e navigator.onLine, dialogo di conferma con quantità di coordinate e destinazione. Rifiuto, OPSEC Strict e offline impediscono batch della nuova funzione. Eventi diagnostici registrano il solo host, non coordinate.
3. Provider: endpoint esistente api.open-meteo.com/v1/elevation (GET/CORS, credenziali omesse), al massimo 100 coordinate per batch e 300 campioni totali, fallimento fail-closed. Fonte 90m Copernicus DEM GLO-90 attribuita, pendenza/precisione DTM terreno 5-10m HOLD.
4. Integrità: whitelist nuove fonti terrain-open-meteo-glo90/terrain-local-dtm-5m oltre routing-gh. schema, pointCount, hash geometrico e limiti preesistenti conservati. savedTracks[] e state.mapWaypoints[] canonici. Originali importedElevations GPX/KML separati e non sovrascritti.
5. Persistenza: commit solo dopo risultato valido, saveStoreReported più readback e savedTrackPersistedEqualCanonical, rollback stato e raw storage se write fallisce. Caso errore QuotaExceeded simulato PASS. Reload e conservazione fonte PASS.
6. Concorrenza/lifecycle: request version incrementata alla chiusura/cambio traccia; confronto ID e geometria prima della scrittura. Label e warning con textContent; nessun nuovo input di HTML non fidato, nessuna modifica ad aree non correlate.
7. Regressione: export/import GeoJSON: XY rimane XY, originali GPX conservano quota. Sanitizer poligoni roundtrip invariato. Salvataggio tramite funzione canonica del pennello (fixture review sintetica) e successivo Profilo verificati. DTM locale simulato e Open-Meteo mock isolato.
8. Statica e browser: JS inline 2/2 node --check PASS; git diff --check PASS. Edge CDP candidato 30/30 PASS, 17 click nativi, zero POST, zero eccezioni JavaScript/console. Screenshot 1440x900. Dati test isolati puliti; rimozione directory Edge Windows non sempre completata, non alterare permessi.
9. Limiti: rete esterna reale non invocata durante QA (intercettazione CDP e payload sintetici); quote GPX/KML parziali non arricchite in questo FIX; le quote stimate sono persistite come profilo, non esportate come quote misurate originali; telefono PAUSA.

## Verdetto
REVIEW GPT-SOSTITUTIVA PASS sulla identità immutabile sopra. Non è QA umana e non certifica precisione topografica. Autorizza deploy del SOLO GIS entro l'autorizzazione permanente, seguito da QA HTTPS sullo stesso hash. Reviewer esterno NOT_PERFORMED/backstop.

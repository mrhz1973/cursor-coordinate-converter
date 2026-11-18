# Build317 P3 — review predeploy, quote importate parziali

Data: 18 novembre 2026, riferimento allo stato GitHub origin/main verificato.
BLOCK GIS-SAVED-TRACK-PARTIAL-ALTITUDE-FILL-A. TIER DELICATO: nuovo addon persistito, sanitizer, OPSEC/rete e rollback.
Profilo CLOSURE STANDARD_RUNTIME_BUNDLE. Review GPT-SOSTITUTIVA PASS prima di deploy; reviewer esterno NOT_PERFORMED / backstop post-hoc ancora aperto.

## Identità immutabile

- Source commit aff215323c97a309cbd5c6c7e0c694d35dd45ad0, Git blob 4578788467822123ea7ad7e929d3bdf0e262b1a8.
- Runtime SHA256 ed760bbd704db0e925f8af7f52a7880d9cffda4be2e2f0af9a2044c9cdf56fec.
- 11.288.727 byte, CR192/CRLF0, 275 linee aggiunte/61 eliminate, unico file runtime HTML standalone. Identità raw@FULL_SHA byte-identica al candidato.
- [Controlli statici eseguibili](review-static.json), [Node JS 2/2](static-checks.json), [Edge candidate 151/151](candidate-qa.json), [runner](browser-qa.cjs), [screenshot](candidate-p3-partial-quoted-composite.png).

## Checklist DELICATO e limiti

1. Sanitizer: nuovo addon terrainFill schema 1 con sorgente whitelisted DTM locale 5m o Open-Meteo GLO-90; numero punti, hash geometria, hash quote originali, timestamp ISO e array heights di lunghezza esatta. Ogni quota originale impone terrainFill.heights[i]=null, impedendo shadow dei dati GPX/KML/GeoJSON. Valori stimati solo number finite nei limiti preesistenti.
2. Persistenza: terrainFill salvato come addon separato e riletto con sanitizer da saveStore/ensureSavedTracksState; savedTrackPersistedEqualCanonical verifica ogni campo e quota dopo save. Failure → rollback memoria + localStorage raw con verifica; errore esplicito se rollback non attestato. Nessuna modifica di state.mapWaypoints[], savedTracks geometry, polygon o storage fuori scope.
3. Rete/OPSEC: la richiesta Open-Meteo parte solo da clic su Calcola quote mancanti, internetApiFetchAllowed + navigator.onLine e window.confirm informato. SOLO coordinate ai punti originariamente senza quota, max 300 per chiamata complessiva e batch di max 100 su provider preesistente. Zero rete in OPSEC Strict/offline e in caso di rifiuto. Nessun GPS automatico. Se DTM locale già caricato si usa quello, senza fallback rete silenzioso.
4. Etichettatura: origine GPX/KML originale resta fonte separata, stime terrainFill hanno sorgente e capturedAt; UI segnala conteggio originali e stimate. Nessun export delle stime come Z originale: GeoJSON/GPX/KML continuano a consultare soltanto importedElevations. Sanitizer invalida i dati calcolati se cambiano geometria o altezze originali.
5. Statistiche: profilo misto non espone dislivello positivo/negativo totale; nessuna pendenza calcolata tra campioni da fonti differenti. Accuratezza terreno DTM 5–10m continua HOLD; il grafico misto non è certificazione topografica.
6. Concorrenza: token request per vista, track ID, geometryHash, originalHash e snapshot addon precedente verificati prima della mutazione. Cambio traccia o modifica geometria/quote durante fetch annulla il salvataggio. Riprova parziale mantiene quote già stimate se stessa origine; non mescola sorgenti differenti senza ricampionare le lacune.
7. Test Edge CDP: 151/151 PASS su candidato, 79 clic nativi, 10 selezioni di file, zero POST/errori console/eccezioni JS, cleanup dati origini PASS. Provider fake via Fetch.fulfillRequest, nessuna richiesta reale a Open-Meteo; test con errore HTTP503, rifiuto consent, offline/OPSEC, successo solo 2 coordinate, export GPX/GeoJSON Z originali, reload, local DTM, quota write fail/rollback, limite >300, risposta parziale e retry, race geometria. Regressione Build311–316 134/134.
8. Nuovo source esclusivamente nel monolite: no framework, modules, nuove API/endpoints, GPS, modifica cache o service workers. Mobile PAUSA; nessuna nuova funzione mobile. DTM locale e network opt-in già presenti riutilizzati. Alcune directory temporanee Edge non rimosse (profileDirectoryRemoved=false) dopo pulizia del sito test; permessi e dati reali non modificati.

## Verdict

REVIEW GPT-SOSTITUTIVA PASS sul source FULL_SHA con 32 controlli statici e 151 QA candidato. Reviewer AI esterno NOT_PERFORMED/backstop post-hoc. Gate successivo: backup Build316, deploy solo GIS, confronto hash VPS/HTTP/HTTPS, QA HTTPS LIVE 151/151, QA operatore PENDING. Non dichiarare Build317 LIVE finché non verificata.

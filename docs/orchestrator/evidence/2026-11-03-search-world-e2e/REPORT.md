# Cerca / Converti global E2E

Esito: **FAIL** (scope centratura visiva della mappa).
Runtime SHA-256: `32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28`.
Cerca UI globale: 72/72 coordinate entro 0,01 m; 71/72 flussi completi con marker centrato.
Errore DD WGS84 (m): max 0; media 0; mediana 0; P95 0.
Input Cerca validi: 5; Converti validi: 7 (inclusi strict e offline); invalidi: Cerca 8, Converti 10.
Tentativi Nominatim di Cerca: 0 su input validi, invalidi e 72 punti mondiali.
Converti fresco: input DD `12.345678 S, 179.876543 W`; auto-reverse iniziale true; geocoding true; OPSEC strict false; Nominatim tentato 3 volte, completamenti esterni 0. URL: `https://nominatim.openstreetmap.org/reverse?lat=-12.345678&lon=-179.876543&format=jsonv2&zoom=18&addressdetails=1&X-Client=CoordinateConverter%2F1.0`.
Dopo auto-reverse OFF visibile: 0 tentativi Nominatim nei Converti validi/invalidi, strict e forced-offline.
Dopo l’azione visibile auto-reverse OFF: false; configurazione OPSEC strict: true; forced offline: true.
HTTP(S)/WS(S) tentate: 2432; bloccate con reason `inspector`: 2432; Fetch.requestPaused: 0; completate: 0.

## Fallimenti E2E

- **AntiMinus180** — input `0.0000000000, -180.0000000000`: world-search-dd-AntiMinus180: visible marker tip is not centered in the rendered map: {"map":{"width":1440,"height":843},"marker":{"left":-523568,"top":421.5},"centerDeltaPx":{"x":-524288,"y":0},"centered":false}; delta marker-centro {"x":-524288,"y":0} CSS px.

## Suite MGRS riusate sullo SHA candidato

- Prefissi contro la regola GeographicLib: PASS, 192.000 prefissi (97.920 validi, 94.080 invalidi), 10 fixture ufficiali e 4 fixture valide a precisione 5.
- Core GEOTRANS: PASS, 594 vettori, 6 prove di precisione, 2 test sui double adiacenti, 9 stale-check e fallback di zona.
- UI Cerca/Incolla MGRS: PASS, 6 fixture invalide rifiutate e 4 valide accettate.
- Gli hash nei tre JSON di risultato coincidono con lo SHA runtime sopra. La matrice geodetica PROJ/GeographicLib storica resta separata e non viene attribuita al candidato corrente.

## Criteri e limiti

- Precisione delle coordinate: criterio DD di 0,01 m già adottato dalla matrice geodetica esistente. La distanza è calcolata con Vincenty inverso WGS84 nel runner, tra fixture e risultato del pulsante Cerca.
- Marker: criterio CSS già usato dalla suite FIX8 `world-ui.cjs`, scarto strettamente minore di 2 px tra `left/top` del marker e centro di `#miniMap`.
- Cerca ha zero tentativi Nominatim per input coordinati validi e invalidi. Tutto l’HTTP(S)/WS(S) è stato intercettato; nessuna richiesta esterna è stata completata.
- Il caso Converti col profilo fresco conserva separato il comportamento auto-reverse predefinito. Un tentativo bloccato è un finding di default privacy, non una prova di zero tentativi. Le conversioni successive sono state ripetute con auto-reverse spento visibilmente, poi con OPSEC strict e forced offline visibili.
- Le fonti e la matrice esistente sono documentate in `baseline-geodesy-report.md`; le metriche PROJ/GEOTRANS/GeographicLib in quel report appartengono ai byte storici indicati dal report, non sono state riattribuite a questo runtime. Non è una certificazione geodetica mondiale.
- Il ricalcolo corrente dell’oracolo Python PROJ non è stato possibile nell’ambiente perché mancano i moduli `pyproj` e `mgrs`; il risultato geodetico corrente qui riportato è la prova UI DD su 72 fixture con distanza WGS84 Vincenty, affiancata dalle suite MGRS correnti.
- I controlli Cercai/Converti sono stati aperti nell’interfaccia, input compilati e pulsanti effettivi cliccati; nessun parser o handler è stato invocato direttamente.

Artefatti dettagliati: `results.json`, `network-events.json`, screenshot elencati nel JSON.

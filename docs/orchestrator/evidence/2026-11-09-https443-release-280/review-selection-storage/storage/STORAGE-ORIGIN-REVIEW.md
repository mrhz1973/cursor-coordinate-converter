# HTTP → HTTPS: persistenza e trasferimento dei dati

Verifica del 9 novembre 2026. Analisi statica mirata, senza lettura di profili browser o dati reali dell'utente, senza rete, migrazioni o modifiche al runtime.

## Identità e conclusione

- Base Build 279: SHA-256 `bb6db0079ad5376e256191ef5a32c51b21c53fab8de653454c184d41f673f253`.
- Candidato Build 280: SHA-256 `1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a`.
- **Dieci sezioni mirate sono byte-identiche** fra base e candidato: persistenza principale, layout, export/import sessione, export GIS, classificazione/applicazione/parsing dell'import GIS, contratto IndexedDB, dataset città e ripristino iniziale. Risultato e hash in `storage-contract-comparison.json`.
- Chiavi immutate: `coordconv_v2`, `coordconv_ui_v1`; database IndexedDB `CoordConvMapTiles`, versione 1, store `tiles`.

**Non emerge un blocco dovuto allo storage per aggiornare il runtime mantenendo lo stesso origin HTTP.** Il pacchetto prevede la conservazione dell'accesso HTTP senza redirect: questa verifica non attesta l'applicazione VPS, di competenza dell'esecutore infrastrutturale.

Il nuovo origin HTTPS ha uno spazio browser distinto. Protocollo, hostname e porta concorrono all'identità dell'origin: anche il cambio IP↔hostname è rilevante. Il pacchetto non trasferisce né cancella i dati conservati sul vecchio origin. La persistenza da sola non rende automaticamente condivisi i dati fra URL, browser o dispositivi.

## Copertura effettiva degli strumenti esistenti

| Strumento UI | Contenuto effettivo | Limiti rilevanti |
| --- | --- | --- |
| **Esporta sessione (JSON)** / Importa sessione | Cronologia, preferiti, righe/input batch e un sottoinsieme delle impostazioni: lingua, tema, formato primario, batch chiuso, offline, zoom/layer/griglia, formati compositi e alcune preferenze di report/nome. | Non è un backup completo. Non esporta waypoint della mappa, tracce, poligoni, anelli, aree nominate, archivio cartografico locale, layer GIS, layout o cache. Non include `opsecStrict` e altre impostazioni presenti nel salvataggio principale. Il campo `persist` è esportato ma non viene applicato da `importSessionObject`. |
| **Export GIS** | Categorie selezionate: waypoint di `state.mapWaypoints`, tracce salvate e poligoni. GeoJSON, GPX, KML. | È interscambio di geometrie e proprietà selezionate, non un ripristino del modello interno. Esclude traccia corrente non salvata, `gisTracks` legacy, preferiti, anelli, aree, dataset, cache e impostazioni. |
| **Mission Package JSON** | Snapshot delle medesime tre categorie GIS, con identificazione app e conteggi. | Il codice lo dichiara export-only; **Import GIS lo rifiuta esplicitamente**. Non usarlo come procedura di ripristino. |
| **Export tracce** | Geometria e nome della traccia, con formati individuali e selezioni dedicate. | Il GeoJSON usa coordinate 2D arrotondate a sette decimali; una traccia chiusa è esportata come Polygon. Non serializza stile completo o profilo altimetrico del modello interno. |
| **Range Rings: export/import dedicati GeoJSON** | Set di anelli, centro, distanze, nome e alcune proprietà. | Percorso separato dall'Export GIS. L'import genera nuovi ID e imposta alcuni valori predefiniti di stile/visibilità; non è una copia integrale del modello. |
| **Dataset città offline: Importa dataset città JSON** | Il JSON originale può essere importato nell'IndexedDB del nuovo origin. | Il dataset aggiunto è salvato alla chiave `geo:dataset:cities`; non è incluso nei file sessione o Export GIS. I dati seed incorporati nell'HTML restano invece disponibili con l'app. |
| **Tile/cache offline e file già importati** | Le tile risiedono nell'IndexedDB dell'origin. | Nessun trasferimento della cache nel pacchetto HTTPS o negli export sessione/GIS analizzati. Eventuali file sorgente sul disco non vengono cancellati, ma non si deve presumere che il nuovo origin abbia già il loro contenuto. |

### Il ritorno Export GIS → Import GIS non è una migrazione senza perdite

Il percorso di import esistente mantiene soltanto nome e coordinate dei Point, creando nuovi waypoint con metadata di provenienza `import`. Le proprietà aggiuntive esportate dal waypoint, come simbolo, colore e note, non sono riportate da questo specifico import hub.

Il classifier raccoglie tutte le LineString/MultiLineString di uno stesso file e l'applicazione le concatena in **una sola traccia salvata per file**. I Polygon sono importati come poligoni: una traccia chiusa esportata come Polygon non torna automaticamente nella libreria delle tracce. Il codice conserva proprietà selezionate dei poligoni e crea nuovi ID.

Questi comportamenti sono già presenti nella base 279 e sono byte-identici nel candidato. Non costituiscono una regressione della Build 280, ma impediscono di presentare un unico export/import GIS come una migrazione completa del browser. Per trasferimenti selettivi si possono usare i percorsi esistenti, verificando categorie e risultati; non viene qui attestato un nuovo test end-to-end.

## Comunicazione operativa consigliata

«Il vecchio indirizzo rimane disponibile con i dati salvati in quel browser. Il nuovo HTTPS parte da uno spazio separato: non sposta o cancella i dati precedenti. Gli strumenti attuali consentono trasferimenti parziali, ma non un backup/ripristino completo; prima di usarli va verificato quali dati occorre portare.»

Sul nuovo origin non presumere trasferite preferenze OPSEC, consensi di rete o mappe offline. Nessun automatismo di rete o migrazione è stato aggiunto in questa verifica. La revisione del tooltip preesistente **“Salva tutto in un file”** di Esporta sessione è un possibile intervento futuro: il testo è più ampio della copertura reale, ma non è stato modificato in questo scope.

## Fonti puntuali nel candidato

Funzioni lette: `loadStore`, `saveStore`, `loadUiState`, `saveUiState`, `init`, `getSessionExportObject`, `importSessionObject`, `gisExportHubBuildFeatureCollection`, `gisExportHubRun`, `gisMissionPackageBuild`, `gisMissionPackageExportRun`, `gisImportHubClassifyFeatureCollection`, `gisImportHubMutateApply`, `gisImportHubParseOneFile`, `gisWaypointToFeature`, `savedTrackToFeatureCollection`, `polygonBuildGeoJson`, `exportRangeRingSetsGeoJSON`, `importRangeRingsFromGeoJSONObj`, `loadOfflineCities`, `importOfflineCitiesJSON`, `getTileDB`.

Non sono stati eseguiti nuovi test browser: la separazione degli origin e i limiti descritti sono direttamente determinabili dal contratto di persistenza e dalle funzioni. La QA geodetica/routing già eseguita non è stata ripetuta.

Finding di lettura: l'uso iniziale di `splitlines()` spostava i numeri per i CR isolati presenti nel monolite; le successive letture hanno usato separazione LF. Un batch di output ha superato il budget complessivo e parte del testo è stata omessa; nessuna conclusione dipende dalle parti omesse e le letture successive sono state ristrette.

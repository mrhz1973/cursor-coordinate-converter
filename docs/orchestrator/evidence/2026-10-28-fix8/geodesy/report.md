# Worldwide Geodetic Accuracy QA — FIX7

Candidate immutabile `080e71c161be76e3ff494b1cdee1aed6889f9290`, blob `dc1ec34ddb12c37e0502d074559e7a4aab279106`, build 264. Ogni esecuzione acquisisce i byte con `git show` e richiede SHA-256 LF `d5496fb01873d3748fd1c173f7d4091351f41aec54b7fa37a23947ecd4bcca69`. Nessuna modifica al runtime o al repository.

## Esito

**QA mondiale non PASS: due difetti riproducibili di interoperabilità/equivalenza MGRS.** Non sono stati misurati errori numerici geodetici fuori tolleranza sui casi convertibili. Questa è QA helper indipendente, non ABQA browser e non autorizzazione deploy.

Matrice: 72 punti in Europa, Africa, Asia, Americhe, Oceania e Antartide; entrambi gli emisferi, equatore, Greenwich, antimeridiano, bordi UTM, Norvegia/Svalbard, latitudini ±90 e limiti UTM −80/+84. UTM/MGRS applicabili a 68 punti; quattro punti polari/fuori dominio sono esclusi dalle proiezioni e inclusi nei test DD/DDM/DMS. Fixture complete in `cases.json`.

Riferimenti indipendenti realmente eseguiti: pyproj 3.8.0 / PROJ 9.8.1, mgrs 1.6.0 (GEOTRANS), GeographicLib 2.1 per distanze WGS84. Dipendenze isolate in `work/geodesy/deps`, nessun npm o dipendenza runtime introdotta. La proiezione UTM è confrontata con PROJ sia forward sia inverse usando coordinate generate dal riferimento; MGRS è generato/decodificato da GEOTRANS. Nessuna sola prova round-trip interna.

## Metriche (metri)

| Verifica | Esito | Max | Media | Mediana | P95 |
| --- | --- | --- | --- | --- | --- |
| UTM forward contro PROJ | 68/68 | 4.075e−9 | 1.389e−9 | 1.118e−9 | 3.733e−9 |
| UTM inverse da PROJ | 68/68 | 4.958e−9 | 1.740e−9 | 1.519e−9 | 4.602e−9 |
| MGRS inverse da GEOTRANS, stessa convenzione SW | 68/68 | 3.190e−8 | 5.285e−9 | 2.586e−9 | 1.841e−8 |
| MGRS forward decodificato da GEOTRANS | 67/68 | 0.635695 | 0.421234 | 0.453050 | 0.580950 |
| MGRS 1 m → coordinata sorgente, Cerca/Incolla | 68/68 | 1.341369 | 0.788181 | 0.850185 | 1.218060 |

L'ultima verifica MGRS usa la posizione SW della cella di 1 m, come il runtime; tolleranza 1.43 m = diagonale della cella con margine per fattore di scala e arrotondamento. GEOTRANS restituisce invece il centro cella; il confronto inverse è allineato sottraendo 0.5 m a E/N nel CRS UTM tramite PROJ. Questo rimuove la differenza convenzionale di circa 0.707 m, che non è un errore. Forward GEOTRANS confronta il centro cella con il punto sorgente, tolleranza 0.72 m. Proiezioni numeriche: tolleranza 0.01 m. Test parser a precisione elevata: 0.01 m; editor poligoni 0.02 m per arrotondamento canonico 1e−7 gradi.

DD/DDM/DMS: **72/72 per formato su ciascuno dei sei ingressi** `parseFreeTextLatLon`, `autoDetect`, `classifyGeoSearchInput`, `routingSearchTryParseCoords`, `parseWaypointEditorCoordText`, `polygonParseVertexCoordInputText` (1296 verifiche). UTM: 68/68 sui quattro ingressi compatibili. Routing/testo libero non promettono supporto griglie e sono N/A per UTM/MGRS. Sedici input invalidi/incompleti (segni/emisferi contraddittori, −0 minuti/secondi, fuori range, token estranei, 60 minuti/secondi, emisfero incompleto), sei ingressi: nessuna falsa accettazione. La matrice ordinaria non sostituisce i finding sui prefissi già identificati dal reviewer separato.

## Finding G1 — antimeridiano, MGRS valido rifiutato dagli editor

`mgrsToLatLonExt('01NAA6602100000')` restituisce `(0, −180.00000397635915)`; `mgrsToLatLonExt('01LAG7328571666')` restituisce `(−12.000007333937909, −180.0000038303622)`. Sono celle valide che attraversano l'antimeridiano; la proiezione della posizione SW può ricadere fuori intervallo canonico di longitudine.

Cerca e Incolla (`classifyGeoSearchInput`/`autoDetect`) accettano; gli editor waypoint e poligoni rifiutano perché validano prima di normalizzare. Tre fixture (AntiWest, Anti180, AntiMinus180) falliscono in entrambi gli editor: **65/68**. Il valore canonico equivalente è circa +179.999996°. Righe FIX7: `mgrsToLatLonExt` 28045–28063, `polygonParseVertexCoordInputText` 83714–83733, `parseWaypointEditorCoordText` 99749–99759. Correzione da limitare alle coordinate generate dalla proiezione; non accettare input DD espliciti fuori range per effetto di una normalizzazione indiscriminata.

## Finding G2 — MGRS non interoperabile al limite +84°

`latLonToMGRS(84,30,5)` restituisce `36X VU 65005 29005`. GEOTRANS rifiuta questa stringa (`Convert_MGRS_To_Geodetic: String Error`) e genera `35XNP3499429005`. La zona 36 non è prevista nella fascia X Svalbard. Il runtime ammette latitudine 84 (`lat > 84` rifiutata) ma applica l'override Svalbard solo con `lat < 84`; il limite superiore sfugge. Righe FIX7 27843–27853. Non è un errore metrico della proiezione UTM: è un errore di scelta zona nella stringa MGRS dichiarata valida. Inviare a implementatore/reviewer per correzione coerente del limite accettato.

Le differenze dei prefissi zona con zero iniziale (`1`/`01`) sono solo formattazione. ±180° possono essere rappresentati nelle zone adiacenti 1 e 60: la stringa runtime zona60 a +180 decodifica correttamente entro tolleranza e non viene classificata come difetto.

## Riproduzione ed evidence

Da workspace: `python work/geodesy/reference.py` poi `python work/geodesy/analyze.py`. `run.cjs` estrae intervalli documentati dal candidate immutabile; esegue funzioni reali senza stub numerici. `actual.json` conserva output/errori per fixture e ingresso, `measurements.json` tutte le misure, `summary.json` metriche/fallimenti. `reference.py` genera stringhe da coordinate sorgente indipendenti; il carry DMS è gestito prima della formattazione (evita fixture spurie con secondi 60).

Limitazioni: nessuna UI reale, marker/PUNTO/centro mappa o runtime HTTP controllati da questo incarico; nessuna validazione dei datum nazionali diversi da WGS84; MGRS limitato a precisione 1 m in questa matrice; nessun test continuo delle infinite coordinate possibili. Gate complessivo e deploy restano all'orchestratore.

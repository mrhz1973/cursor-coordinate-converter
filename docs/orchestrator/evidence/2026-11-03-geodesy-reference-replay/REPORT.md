# Geodesy reference replay — 2026-11-03

## Esito

**PASS numerico limitato ai 72 punti e agli helper eseguiti, con un difetto riproducibile di formattazione MGRS canonica.** I confronti indipendenti non hanno errori numerici oltre soglia. Cinque delle 68 stringhe MGRS generate omettono però lo zero iniziale richiesto per i fusi 1–9; dettagli in [MGRS: formato del numero di zona](#finding-mgrs--manca-lo-zero-iniziale).

Questo rapporto riguarda i byte runtime identificati qui sotto. Non è QA browser, ABQA, prova di deploy o verifica di altri datum.

## Identità e metodo

- Git HEAD letto all’avvio: `b9b73dccec92470516a54d9958b9d358a594d7d5`.
- SHA-256 del runtime HTML prima e dopo la prova: `32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28`.
- Runtime non modificato. Script, fixture, misure e rapporto di questa riesecuzione sono confinati in `docs/orchestrator/evidence/2026-11-03-geodesy-reference-replay/`.
- Ambiente numerico isolato temporaneo, Python 3.12.10: pyproj 3.8.0 / PROJ 9.8.1, mgrs 1.6.0 (GEOTRANS), GeographicLib 2.1. Nessuna dipendenza è stata aggiunta al runtime o al repository.
- Datum/geodesia: WGS84, EPSG:4326; distanze ellissoidiche calcolate con `Geodesic.WGS84`. Non sono state applicate trasformazioni da datum locali.
- La matrice riusa i 72 luoghi e casi di bordo già selezionati: Europa, Africa, Asia, America settentrionale e meridionale, Oceania e Antartide; emisferi N/S, equatore, Greenwich, ±180°, limiti di zona UTM, eccezioni Norvegia/Svalbard, poli e limiti −80°/+84°. UTM/MGRS si applicano a 68 punti; i quattro casi fuori dal dominio UTM sono N/A per le griglie e restano nei test DD/DDM/DMS.
- Il runner estrae le funzioni reali dal file HTML tramite confini simbolici, con hash SHA-256 obbligatorio. L’oracolo è separato: PROJ proietta le coordinate UTM, GEOTRANS genera/decodifica MGRS e GeographicLib misura gli scarti WGS84. Non viene usato il parser dell’app come riferimento e non si basa il verdetto solo su un roundtrip interno.

Il fixture di riferimento originale aveva una condizione stretta `72 <= lat < 84` per l’eccezione Svalbard. Per il punto esattamente a +84°, 30°E questo produceva zona UTM 36, mentre GEOTRANS e la tabella delle eccezioni Svalbard in NGA.STND.0037 indicano zona 35 (intervallo 21–33°E nella fascia 72–84°N). Ho corretto **solo la copia locale** del riferimento da `<84` a `<=84`, rigenerato il fixture con PROJ/GEOTRANS e validato poi separatamente il fuso restituito dall’applicazione. Il confronto UTM riguarda ora lo stesso fuso previsto dalla regola pubblicata. Riferimenti: [NGA Coordinate Systems](https://earth-info.nga.mil/index.php?action=coordsys&dir=coordsys) e [NGA.STND.0037, copia del documento](https://www.legallandconverter.com/files/NGA.STND.0037_2.0.0_GRIDS.pdf).

## Tolleranze

| Verifica | Soglia | Motivazione e limite |
| --- | ---: | --- |
| UTM numerico avanti/indietro e input UTM | 0,01 m | Criterio conservativo di equivalenza numerica WGS84/PROJ. Gli input UTM sono serializzati a 1 µm; proiezioni e inverse non subiscono arrotondamenti a metro. Il rapporto precedente dichiarava il centimetro ma non ne derivava formalmente il valore dalla precisione di serializzazione: va letto come soglia numerica di QA, non come accuratezza posizionale certificata. Gli scarti osservati sono inferiori a 0,000001 m. |
| DD, DDM, DMS | 0,01 m | I fixture serializzano DD a 10 decimali, DDM a 10 decimali di minuto e DMS a 8 decimali di secondo; la quantizzazione dichiarata è molto più fine di 1 cm. Il centimetro è un margine numerico ampio, non un’incertezza del datum. |
| Coordinate restituite dal parser poligono | 0,02 m | Il parser canonizza latitudine/longitudine a 7 decimali; la diagonale massima dovuta a tale arrotondamento è inferiore a 0,02 m anche presso l’equatore. |
| MGRS sorgente a 1 m rispetto al punto nella cella | 1,43 m | Precisione MGRS 5+5 cifre = cella 1 m. 1,43 m copre la diagonale teorica √2 m (1,4142 m) più 0,0158 m di margine per fattore di scala e arrotondamenti. |
| MGRS forward decodificato al centro GEOTRANS | 0,72 m | Il riferimento GEOTRANS restituisce il centro della cella; raggio massimo teorico dal centro all’angolo = √2/2 m (0,7071 m), più 0,0129 m di margine. |
| MGRS inverse contro lo stesso angolo SW | 0,02 m | Il riferimento GEOTRANS viene portato all’angolo SW con PROJ; la soglia è un margine numerico di 2 cm, non la risoluzione di cella. Errore massimo misurato: 0,000000165 m. |

Le soglie di 1,43 m e 0,72 m discendono direttamente dalla risoluzione MGRS di 1 m. Le soglie di 1–2 cm sono espresse come margini numerici per trasformazioni/dati WGS84, ma la loro derivazione dalla precisione degli input è meno forte e dichiarata qui senza attribuire al runtime un’accuratezza assoluta al centimetro.

## Risultati (metri)

Gli intervalli di P95 usano il valore ordinato alla posizione `ceil(0,95 × n)`.

| Confronto indipendente | n / pass | Max | Media | Mediana | P95 | Soglia |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| UTM forward app contro PROJ nello stesso fuso restituito | 68 / 68 | 4,075e−9 | 1,389e−9 | 1,118e−9 | 3,733e−9 | 0,01 |
| UTM inverse app da coordinate generate da PROJ | 68 / 68 | 4,958e−9 | 1,740e−9 | 1,518e−9 | 4,602e−9 | 0,01 |
| MGRS inverse app contro angolo SW GEOTRANS allineato con PROJ | 68 / 68 | 1,653e−7 | 1,429e−7 | 1,420e−7 | 1,544e−7 | 0,02 |
| MGRS forward app decodificato dal riferimento GEOTRANS | 68 / 68 | 0,635695 | 0,420238 | 0,447629 | 0,580950 | 0,72 |
| Input DD, sei helper × 72 casi | 432 / 432 | 6,738e−9 | 2,146e−10 | 0 | 1,674e−9 | 0,01; poligono 0,02 |
| Input DDM, sei helper × 72 casi | 432 / 432 | 6,738e−9 | 2,146e−10 | 0 | 1,674e−9 | 0,01; poligono 0,02 |
| Input DMS, sei helper × 72 casi | 432 / 432 | 6,738e−9 | 5,173e−10 | 0 | 2,687e−9 | 0,01; poligono 0,02 |
| Input UTM, quattro helper compatibili × 68 casi | 272 / 272 | 6,211e−7 | 2,689e−7 | 3,210e−7 | 5,707e−7 | 0,01 |
| Input MGRS, quattro helper compatibili × 68 casi | 272 / 272 | 1,342367 | 0,788184 | 0,850331 | 1,218060 | 1,43 |

Totale: 2.112 misure numeriche, **2.112 entro soglia**; 16 input invalidi/incompleti × 6 helper = **96 rifiuti attesi, nessuna accettazione**. I 68 fusi/emisferi UTM restituiti corrispondono ai fixture indipendenti dopo la correzione documentata dell’endpoint a +84°.

## Finding MGRS — manca lo zero iniziale

L’encoder runtime omette lo zero iniziale nei numeri di zona 1–9. La discrepanza compare in cinque fixture; i valori sono decodificabili da GEOTRANS e le misure restano entro la tolleranza metrico-geodetica, ma non sono nella rappresentazione canonica documentata da NGA, che scrive esplicitamente il fuso 9 come `09`.

| Caso | Runtime | Riferimento GEOTRANS |
| --- | --- | --- |
| Samoa | `2LMK1894670582` | `02LMK1894670582` |
| Honolulu | `4QFJ1843556874` | `04QFJ1843556874` |
| Anchorage | `6VUN4424790536` | `06VUN4424790536` |
| AntiWest | `1LAG7328571666` | `01LAG7328571666` |
| AntiMinus180 | `1NAA6602100000` | `01NAA6602100000` |

Un’altra differenza testuale, al punto `Anti180` (+180°, equatore), è `60NZF3397800000` runtime contro `01NAA6602100000` GEOTRANS. È una rappresentazione valida dell’antimeridiano nelle zone contigue 60/01; GEOTRANS decodifica la stringa runtime e la distanza geodetica rimane entro soglia. La tratto come alternativa di zona al confine, distinta dalla mancanza dello zero iniziale.

## File e riproduzione

- `cases.json`: 72 fixture mondiali, stringhe di ingresso e riferimenti UTM/MGRS.
- `reference.py`: fixture indipendenti da PROJ/GEOTRANS; contiene la correzione locale dell’estremo Svalbard a +84°.
- `run.cjs`: estrazione simbolica degli helper dal runtime, SHA-256 atteso fissato al valore riportato qui, output in `actual-current.json`.
- `analyze.py`: distanze GeographicLib, metriche e controlli separati per numero di zona e zeri canonici.
- `actual-current.json`: output di tutti gli helper per i 72 punti e i 16 casi invalidi; registra il SHA runtime.
- `measurements-current.json`, `summary-current.json`: misure individuali, statistiche, versi degli oracoli e finding testuali.
- `MANIFEST.json`: SHA-256 e dimensioni di ogni output, HEAD e runtime.

Esecuzione riproducibile con Node.js, Python 3.12 e un ambiente Python temporaneo isolato: installare esattamente `pyproj==3.8.0`, `mgrs==1.6.0`, `geographiclib==2.1`; impostare `GEODESY_REPO` alla radice del repository; poi eseguire `reference.py` e `analyze.py --current`. `run.cjs` interrompe l’esecuzione se i byte HTML non corrispondono all’hash fissato.

Limiti residui: solo datum WGS84/EPSG:4326, sola precisione MGRS da 1 m, nessuna prova browser/HTTP, marker, geocoding o provider live; nessuna attestazione su ogni possibile coordinata o su altri datum.
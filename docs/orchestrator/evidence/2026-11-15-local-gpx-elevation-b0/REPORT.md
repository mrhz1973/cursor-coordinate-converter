# B0 - Ricerca di tracce locali e conservazione quota GPX/KML

Data: 15 novembre 2026, Europe/Rome. Strumento: TMAR Desktop Commander Windows, Edge CDP isolato per test parser. Base GitHub main: dc816adde5af180070649071a437331326dd58e8. Runtime: Build302, source 182b83a32dc9a32fa2a748458a9ad6f7b5b066a5. Tutte le operazioni sui file utente in sola lettura, senza esportazione coordinate.

## Dati rilevati, privacy minimizzata
Quattro GPX reali con quote altimetriche nei percorsi download/documenti dell account autorizzato: conteggi 877, 198, 706 e 531 punti, distanza percorsi circa 4.38-9.44km, passo mediano XY rispettivamente 10.5, 18.6, 10.6 e 10.6m. Sono tutti fuori estensione WCS DTM Liguria EPSG:3003 5m attualmente integrata. Calcolare finestre di pendenza 5m soltanto da GPX richiederebbe interpolazioni su distanze superiori a 5m nel 100% delle finestre esaminate in tre file e quasi tutte nel quarto; non e una misura DTM 5m. Nessuna quota grezza ha presentato oltre 100% su segmenti originali non duplicati; un massimo prossimo al 98.7% non certifica un errore.

Un KML reale ricade entro l estensione geografica Liguria, ma la LineString contiene 358 punti per circa 7.76km e nessuna quota. La prima scansione di tutte le coordinates includeva anche migliaia di Point styling: la geometria valida per il tracciato e soltanto la LineString. Nessun GeoTIFF gia in cache sul PC copre quella LineString. Non e stata richiesta alla Regione Liguria alcuna area relativa a questo percorso privato.

Due KML esportati da GIS Tool sono 2D, con altitudine scritta zero. Una coppia GPX-KML ha esattamente 198 coordinate XY identiche, ma il GPX include altezza e il KML non la conserva; l altra coppia e un taglio di una traccia piu lunga, non coincidente nei punti iniziali. Non dedurre da questa osservazione che la quota debba necessariamente far parte del contratto storico 2D.

## Verifica runtime effettivo Build302
Il parser spatialGpxToFeatureCollection conserva in ogni punto soltanto [lon,lat] e non legge ele; gli esportatori buildKMLRoute e spatialGeoJSONToKml scrivono esplicitamente z=0. Test con quattro GPX reali nel browser Edge isolato, pagina HTTPS Build302 nativa, con input in memoria: geometria accettata 4/4 con numero di punti esatto (877,198,706,531), zero quote conservate nella FeatureCollection in tutti i file. Zero POST, zero JavaScript exception. Si tratta di una caratteristica del percorso import-export geometrico 2D; la conservazione delle quote e un possibile blocco distinto, non una correzione autorizzata automaticamente.

## Archived browser routes e limiti
L origin HTTPS del GIS ha IndexedDB in Edge Default (~2.24 MB), ma i file di database risultano bloccati dall attuale sessione browser; tentativi di apertura in sola lettura falliti. Nessuna sessione utente terminata, nessun bypass del lock, nessun database copiato o modificato. Nessuna prova che l archivio contenga o meno la traccia originaria.

## Esito e NEXT
Le prove locali sono state svolte autonomamente, senza chiedere il reinvio dei file. Le informazioni qui pubblicate sono aggregate: nessun nome di file o percorso privato, coordinate, traccia, GPX/KML o hash dei file utente salvati nel repository. Il tracciato esatto che originariamente mostrava l errore rimane non identificato con certezza. Build302 LIVE invariata; QA operatore sul caso esatto PENDING, accuratezza del DTM al suolo HOLD. Non dichiarare PASS umano e non introdurre Build303, nuovi provider, rete implicita o modifiche al contratto dei dati in assenza di un incarico separato.

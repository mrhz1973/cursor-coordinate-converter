# QA indipendente provider routing — richieste live sintetiche

## Esito

**PARZIALE: entrambi i provider hanno restituito percorsi terrestri con dettagli completi per gli esempi positivi; GraphHopper ha agganciato tutti i punti entro 50 m. Nessun PASS complessivo o gate deploy.** Il candidato build 269 identificato in FRONTIER ha SHA-256 `231db5825250d3a8ecde184feaf21f41f8d9249282d310f8e5d77f9`. Sono state ispezionate staticamente le parti pertinenti della configurazione e dei contratti di routing, ma non eseguita l'applicazione; questa prova non certifica il comportamento del runtime.

## Ambito e metodo

- Verifica terminata 2026-10-30 14:16:42 +01:00, fuso orario locale Europe/Rome. Fonti preliminari: `work/routing-implementation/REPORT.md` e `mart-gis/docs/FRONTIER.md`. Successivamente lettura statica limitata alle costanti e funzioni di routing del runtime.
- Dopo chiarimento del mandato, eseguite richieste di calcolo read-only agli endpoint tailnet già configurati, usando esclusivamente punti sintetici pubblici in Italia e senza nuove credenziali, configurazioni o processi. Nessun dato utente o risposta completa è stato salvato; riportati solo esiti aggregati. Non sono state modificate infrastruttura o dati del server.
- Totale: 11 POST GraphHopper, 4 POST ORS e una GET GraphHopper `/info`. Gli ultimi tre POST GH riutilizzano i punti sintetici dello script storico `modes_probe.py`. Due richieste al massimo in parallelo. I tempi seguenti sono quelli del client, dalla richiesta alla lettura della risposta, non benchmark.
- Per ogni percorso positivo, il controllo indipendente replica il criterio visibile nel codice: intervalli contigui da 0 all'ultimo indice geometrico, nessun buco o valore non consentito. Per le ultime tre prove GH sono state misurate le distanze tra ogni punto richiesto e il corrispondente `snapped_waypoints`, con formula haversine. Non è stata verificata la distanza di aggancio ORS né l'effettiva esecuzione delle difese del candidato.

## Risultati

| Provider / caso | Esito e tempo client | Osservazione |
| --- | --- | --- |
| ORS percorso terrestre, profilo foot-hiking | HTTP 200, 704 ms | 1 percorso; `waytype` completo, valori 3 e 7 ammessi, nessun 9. |
| ORS con VIA | HTTP 200, 653 ms | 1 percorso; `waytype` completo, valori 3, 7 e 8 ammessi, nessun 9. VIA richiesto, distanza di aggancio non verificata. |
| ORS alternative | HTTP 200, 689 ms | 3 percorsi; tutti con `waytype` completo e soli valori 3, 7 e 8. |
| ORS profilo inesistente sintetico | HTTP 404, 390 ms | Gateway risponde con oggetto contenente campo `error`; categoria e gestione in app non verificate. Non dimostra il caso di assenza di percorso terrestre. |
| GH `/info` | HTTP 200 | Elenca i profili `hiking`, `hiking_easy`, `mtb_touring`, `mtb_trail`; raggiungibilità non dimostra copertura per un punto arbitrario. |
| GH percorso, VIA e alternative, primo insieme di punti | HTTP 400, rispettivamente 717, 784, 353 ms | La richiesta di base aggiuntiva restituisce `PointNotFoundException`; nessun dettaglio di percorso verificabile. |
| GH profilo inesistente con primo insieme | HTTP 400, 336 ms | Errore generico osservato, non isolata la causa dal possibile fallimento sugli stessi punti. |
| GH percorso, punti storici sintetici | HTTP 200, 909 ms | 1 percorso, `road_environment` completo con solo `road`; distanze di aggancio 1,4 e 1,9 m. |
| GH VIA, punti storici sintetici | HTTP 200, 528 ms | Percorso A–B–A, con B come VIA; dettagli completi con solo `road`; distanze di aggancio 1,4, 1,9 e 1,4 m. |
| GH alternative, punti storici sintetici | HTTP 200, 598 ms | 3 percorsi, tutti con dettagli completi con solo `road`; per ciascuno agganci 1,4 e 1,9 m. |
| GH percorso, VIA e alternative, secondo insieme di punti | HTTP 400, rispettivamente 417, 341, 236 ms | Categoria del messaggio: punto non trovato. Non verificati dettagli dei percorsi né loro agganci. |

Le richieste positive ORS includevano `options.avoid_features: ["ferries"]` e `extra_info: ["waytype"]`. Le richieste GH includevano `details: ["road_environment"]`, `snap_preventions: ["ferry"]`, priorità zero per `FERRY` e `ch.disable`; nelle risposte positive i dettagli coprono l'intera geometria e contengono soltanto `road`. Questi percorsi non dimostrano la capacità di evitare un ferry presente sulla rete né la semantica completa dello snap filtrato.

## Limiti

Non sono stati testati un itinerario con ferry effettivamente presente, l'assenza di una deviazione terrestre, dettagli mancanti o corrotti, distanze di aggancio ORS, o l'integrazione fail-closed del candidato con le risposte effettive. Il 404 ORS per profilo inesistente non è attribuibile a mancanza di percorso. Per GraphHopper il controllo positivo riguarda un unico profilo e gli esempi indicati; lo snap senza ferry non è stato messo alla prova vicino a un collegamento marittimo. Le prove precedenti riportate nel report di implementazione non sono state replicate integralmente e restano evidenze separate. I tag forniti dai provider non certificano l'assenza universale di errori cartografici. Nessun deploy, PASS umano o PASS complessivo è implicito.

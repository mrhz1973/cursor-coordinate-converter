# Routing land-only / no-ferry: documentazione ufficiale

Analisi read-only delle fonti ufficiali GraphHopper 11 e openrouteservice. Il preflight è presente nel commit 099d67b ma non era materializzato nello sparse checkout del subagente; questa analisi non si basa sulla sua lettura.

## Risultati

### GraphHopper 11

- `road_environment` è un encoded value e include `FERRY`; la documentazione mostra espressioni di custom model basate su `road_environment`. La sezione `priority` spiega che valori inferiori rendono un arco meno probabile nella route e documenta esplicitamente valore zero come blocco per archi che soddisfano la condizione. Quindi una condizione `road_environment == FERRY` con priorità zero è coerente con la semantica documentata per escludere quei segmenti nella ricerca percorso. L’effetto per ogni profilo concreto e per i dati caricati resta da confermare con richieste reali.
- Per dettagliare l’ambiente del percorso, `/route` accetta `details=road_environment` (se il valore è presente/configurato nel grafo) e restituisce segmenti `[fromRef,toRef,value]`. Questo consente di verificare la route risultante, non costituisce di per sé una restrizione.
- `snap_prevention=ferry` impedisce lo snapping iniziale su un ferry. La documentazione avverte che, dopo lo snapping, la route può ancora attraversare quei tipi di strada; per evitarli nel percorso cita l’uso di `custom_model`. Sono due controlli distinti.
- La doc del parametro non lega snap_prevention a un particolare profilo. Non ho trovato in queste pagine una garanzia specifica per ogni profilo walking/cycling: provare ciascun profilo usato dall’app.

Fonti:
- [GraphHopper 11 custom models](https://github.com/graphhopper/graphhopper/blob/11.0/docs/core/custom-models.md) — encoded values (`road_environment`, `FERRY`), priorità e blocco con zero.
- [GraphHopper 11 Web API](https://github.com/graphhopper/graphhopper/blob/11.0/docs/web/api-doc.md) — parametri `snap_prevention` e `details`.

### openrouteservice

- Le routing options documentano `options.avoid_features` come array stringa e `ferries` come supportato per `driving-*`, `cycling-*`, `foot-*` e `wheelchair`. Gli esempi includono ferries per `foot-*`; per cycling l’esempio usa un’altra feature, mentre la tabella dichiara ferries supportato. Pertanto la documentazione copre profili walking/foot e cycling.
- La stessa pagina documenta `options.round-trip` (`length`, `points`, `seed`) e `avoid_features` in sezioni distinte, ma non afferma esplicitamente l’interazione tra i due. È ragionevole provarli insieme nella stessa richiesta POST, ma l’esito “nessun ferry” nel round-trip va verificato dai dati di risposta.
- La pagina ufficiale Snapping descrive endpoint `/v2/snap/{profile}` con `locations` e `radius`; non documenta `avoid_features` né un’opzione per filtrare ferry nello snapping. Non assumere che l’opzione di directions si applichi al servizio snap. Si può invece verificare il punto restituito e inviare poi directions con `avoid_features`.
- `round-trip` ha un limite pubblico documentato di 100 km; applica il limite alla prova su API pubblica, se usata.

Fonti:
- [ORS Routing Options (documentazione backend corrente)](https://giscience.github.io/openrouteservice/api-reference/endpoints/directions/routing-options) — supporto ferries per profili e opzioni round-trip.
- [ORS Snapping Endpoint, documentazione v8.2](https://giscience.github.io/openrouteservice/v8.2.0/api-reference/endpoints/snapping/) — parametri documentati e risultato snap.
- [ORS API Restrictions](https://openrouteservice.org/restrictions/) — limite round-trip 100 km.

## Test raccomandati (non eseguiti)

1. Scegliere un’area nota con un collegamento ferry nel grafo e coordinate di partenza/arrivo che, senza restrizioni, producano una route con ferry; salvare le richieste e le risposte grezze.
2. GraphHopper 11: per ogni profilo in uso confrontare baseline e modello con `priority=0` quando `road_environment == FERRY`; chiedere anche `details=road_environment` e controllare che nessun segmento restituito abbia valore `FERRY`. Testare lo snapping iniziale con e senza `snap_prevention=ferry`, poi verificare separatamente che il custom model escluda i ferry dal percorso.
3. ORS: per ogni profilo effettivo `foot-*` e `cycling-*`, confrontare directions con e senza `options.avoid_features:["ferries"]`; ripetere con `options.round-trip` nella stessa POST e controllare geometry/extra info disponibili e metadati della richiesta. Un round-trip può variare per seed e lunghezza preferita.
4. ORS snap: effettuare `/snap/{profile}` con radius controllato vicino a un ferry; verificare coordinate e `snapped_distance`. Non passare `avoid_features` come se fosse supportato dal contratto documentato. Poi verificare la route partendo dal punto snapped con directions `avoid_features`.
5. Registrare versione/build, profilo, data del grafo e dati di input. L’esito dipende dalla copertura e dai tag/attributi effettivamente importati; l’assenza di `FERRY` nei dettagli non dimostra da sola che ogni collegamento d’acqua sia modellato correttamente come ferry.

## Limiti

Questo report non esegue richieste agli endpoint, non ispeziona server o grafo applicativo e non conferma il comportamento di un’istanza specifica. La documentazione descrive capacità e parametri; non garantisce completezza o accuratezza dei dati OSM, né prova tutte le combinazioni profilo + round-trip + ferry.

# Prova routing runtime su endpoint tailnet — 2026-11-03

## Esito

**NON_VERIFICATO.** Il test corretto ha caricato l’HTML locale con SHA-256 `32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28` all’origine `http://100.99.54.93:8000/coordinate_converter%20Claude.html` (query univoca solo durante la navigazione, non registrata). Nessun deploy o modifica al runtime.

## Requisiti del gate letti nel runtime

- La verifica dello snap del percorso usa `ROUTING_SNAP_SOFT_DELTA_M = 50 m`; per GraphHopper la geometria deve coincidere con gli snap delle tappe entro `1 m`. Ho usato le funzioni di validazione del runtime stesso (`routingGraphhopperSnapVerified`, `routingOrsSnapVerified`, `routingGraphhopperLandVerified`, `routingOrsLandVerified`) per valutare una risposta, se disponibile.
- Le classificazioni stradali devono coprire tutta la geometria e contenere solo valori terrestri ammessi; il traghetto invalida la risposta. Il runner registra i flag anti-traghetto del payload come booleani, senza conservare il payload.
- L’anteprima e lo stato del pulsante Salva vengono solo letti. Il pulsante Salva non è stato attivato.

## Chiamate permesse e osservate

La pagina è stata servita dai byte verificati, mantenendo l’origine reale per CORS. Il browser ha consentito esclusivamente i metodi `GET`, `POST` e `OPTIONS` necessari verso gli endpoint indicati; ogni altro host, asset cartografico, elevazione e font è stato bloccato. Nessun upstream commerciale GraphHopper/ORS è stato contattato e TLS/CORS non è stato aggirato.

| Provider | Chiamata osservata | Esito HTTP | Payload anti-ferry | UI |
|---|---|---:|---|---|
| GraphHopper `hiking` | `GET /info` su `100.99.54.93:8989` | nessuno status osservabile; errore rete/CORS | Il `POST /route` non è partito, quindi non applicabile | anteprima assente; Salva disabilitato |
| ORS `foot-hiking` | `POST /ors/v2/directions/foot-hiking/geojson` su `ionos-n8n-new.tailc01234.ts.net:443` | nessuno status osservabile; errore rete/CORS | `avoid_features=ferries`: true; `extra_info=waytype`: true | anteprima assente; Salva disabilitato |

Per GraphHopper il flusso si è fermato su `/info`, prima di `/nearest` e `/route`; non è quindi attestato alcuno snap. ORS non ha restituito una risposta leggibile dal browser; non sono disponibili dettagli, snap o classificazione ferry. Ogni provider è stato provato una sola volta, senza fallback o ripetizioni. La causa precisa dell’assenza di risposta non è distinguibile dai soli eventi browser registrati; entrambi i rami restano non verificati.

Sono state usate le coordinate sintetiche già presenti nel runner precedente: `9.8236, 44.1024` → `9.829, 44.107`. Il caso ferry/assenza connessione non è stato eseguito: il primo gate non ha raggiunto un routing GraphHopper e il ramo ORS non ha dato risposta; nessuna altra chiamata è autorizzata da questo incarico.

## Evidenze e ripetibilità

- [Runner limitato agli endpoint tailnet](run.cjs)
- [Risultati sanitizzati](result.json)

Il runner ricontrolla lo SHA del runtime prima di ogni esecuzione. Conserva solo endpoint canonici, metodi, status, flag booleani, metriche di percorso e stati UI; non registra query string, header, credenziali o corpi completi delle richieste/risposte.

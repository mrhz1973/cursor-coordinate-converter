# GraphHopper 11 preflight (read-only)

**Esito aggiornato:** baseline e nearest PASS sui punti liguri indicati in fondo; punti iniziali fuori copertura non provano un guasto. Filtro ferry non verificato. Nessuna modifica a VPS, codice o configurazione; creato solo questo report. Nessun provider esterno di routing/geocoding è stato interrogato. Test HTTP diretti, senza credenziali e con timeout applicativo `timeout_ms=8000`.

## `/info`

`GET http://100.99.54.93:8989/info` → HTTP 200, circa 1 s.

Risposta rilevante (estratto):

```json
{"bbox":[-5.518989,32.903776,13.363759,46.653379],"profiles":[{"name":"hiking"},{"name":"hiking_easy"},{"name":"mtb_touring"},{"name":"mtb_trail"}],"version":"11.0","encoded_values":{"road_environment":["OTHER","ROAD","FERRY","TUNNEL","BRIDGE","FORD"]}}
```

Profili esposti: `hiking`, `hiking_easy`, `mtb_touring`, `mtb_trail`. `road_environment` è presente e include `FERRY`.

## Route baseline

Ho usato coordinate pubbliche sintetiche, nel bbox dichiarato, in formato GET `point=lat,lon`:

```text
GET /route?point=42.925,10.526&point=42.812,10.314&profile=hiking&points_encoded=false&instructions=false&timeout_ms=8000
```

Sono punti nell'area Piombino–Portoferraio. HTTP 400 in 0,155 s; risposta limitata:

```json
{"message":"Cannot find point 0: 42.925,10.526","hints":[{"details":"com.graphhopper.util.exceptions.PointNotFoundException","point_index":0},{"details":"com.graphhopper.util.exceptions.PointNotFoundException","point_index":1}]}
```

Ho provato anche il payload POST documentato, con coordinate `[lon,lat]`, per lo stesso profilo e gli stessi luoghi; il server ha restituito `Cannot find point 0: 42.925,10.526` (HTTP 400, ~0,13 s). Ciò conferma che il fallimento avviene prima di ottenere una route e non fornisce un esito sul tragitto o sul ferry.

## Profili

Per distinguere un problema isolato di profilo da un problema dei punti, ho provato una coppia di coordinate pubbliche sintetiche a Firenze (`43.7696,11.2558` → `43.7710,11.2600`) con ciascun profilo, stesso GET baseline, timeout 8 s. Tutte e quattro le richieste hanno restituito HTTP 400 `Cannot find point 0` e `Cannot find point 1`, in 0,138–0,207 s (tempi curl):

| Profilo | HTTP | Tempo | Esito |
|---|---:|---:|---|
| `hiking` | 400 | 0,207 s | `PointNotFoundException` per entrambi i punti |
| `hiking_easy` | 400 | 0,146 s | `PointNotFoundException` per entrambi i punti |
| `mtb_touring` | 400 | 0,162 s | `PointNotFoundException` per entrambi i punti |
| `mtb_trail` | 400 | 0,138 s | `PointNotFoundException` per entrambi i punti |

Un ulteriore tentativo sintetico Livorno–Pisa con `mtb_touring` ha dato lo stesso errore (HTTP 400, 0,134 s). Non ho continuato con altre richieste dopo la ripetizione dell'errore.

## Filter, path details e snap prevention

Non è stato possibile validarli sul motore: il lookup dei punti iniziali fuori copertura fallisce prima del calcolo del percorso; la successiva baseline ligure riesce ma non prova il filtro. Di conseguenza non attribuisco un esito al payload `custom_model.priority` con `if: "road_environment == FERRY"` e `multiply_by: "0"`, né a `details=road_environment` o `snap_prevention=ferry`. Non concludo nulla sul comportamento globale del grafo verso i ferry o su una garanzia “world/no ferry”.

Per un successivo tentativo, se si risolve la causa del mancato snapping, i riferimenti upstream GraphHopper descrivono: custom model via POST e attributo `road_environment` ([custom models](https://github.com/graphhopper/graphhopper/blob/11.0/docs/core/custom-models.md)); ordine coordinate POST, `details`, `snap_prevention` e semantica di snap prevention ([Web API](https://github.com/graphhopper/graphhopper/blob/11.0/docs/web/api-doc.md)). La documentazione specifica che `snap_prevention` evita lo snapping su certi tipi, mentre la route può ancora percorrerli; l'esclusione in routing va espressa con un custom model.

## Conclusione

`/info` risponde e dichiara GraphHopper 11.0, quattro profili e `road_environment=FERRY`; le richieste iniziali fuori copertura falliscono in fase di snapping; vedere integrazione ligure successiva che verifica baseline e nearest. Il preflight resta inconclusivo per filtro ferry, dettagli e snap prevention. Ho fermato i test e non ho applicato mitigazioni né modifiche lato VPS.


## Verifica mirata dentro la rete nota (integrazione)

A seguito dell'indicazione che il grafo WU-0011 è un estratto Geofabrik del nord-ovest Italia, ho provato due route sintetiche in Liguria, con timeout 8 s. Queste richieste hanno avuto esito positivo:

| Profilo | Coordinate GET (lat,lon) | HTTP / tempo client | Esito |
|---|---|---:|---|
| `hiking` | `44.1024,9.8236` → `44.1070,9.8290` | 200 / 0,164 s | route 749,7 m; `info.took=18 ms`; nessun errore |
| `mtb_touring` | stesse coordinate | 200 / 0,167 s | route 708,3 m; `info.took=9 ms`; nessun errore |

In entrambe le risposte `road_data_timestamp` è `2026-07-24T20:20:51Z` e i punti agganciati sono nel settore richiesto. Ho anche interrogato l'endpoint opzionale:

```text
GET /nearest?point=44.1024,9.8236&profile=hiking&timeout_ms=8000
```

HTTP 200 / 0,136 s; punto restituito `[9.8236104, 44.1024105]`, distanza 1,43 m.

Questo PASS nella Liguria compatibile con l'estratto cambia l'interpretazione dei precedenti `PointNotFoundException`: i test a Firenze, Livorno/Pisa e Piombino/Portoferraio non dimostrano un guasto del router, perché il bbox di `/info` è un limite spaziale e non certifica copertura stradale in ogni località. Il comportamento operativo verificato finora è: baseline e snap funzionano su due profili nella Liguria provata; i precedenti punti fuori copertura non sono instradabili. Filtro ferry e `details=road_environment` restano non verificati.

# WU-0011 — INFRA-GH-1A — GraphHopper 11.0 PoC locale Ryzen

<!-- WU-HOT-HEADER: do not remove -->
**STATUS:** CLOSED / PASS end-to-end (INFRA-GH-1A + INFRA-GH-1B)
**ACTIVE BLOCK:** —
**CURRENT GATE:** —
**RUNTIME LIVE:** `a37b91265a927a8ddfa8325437f34867b9de0570` · build 160 · `APP_BUILD_ID=D-FLIGHT-CDE` (monolite GIS invariato da blocchi infra)
**NEXT:** nessuno — WU chiusa; GraphHopper VPS live via WU-0010 B2+
<!-- /WU-HOT-HEADER -->

**Stato:** **CLOSED / PASS end-to-end** (INFRA-GH-1A + INFRA-GH-1B)
**Blocco:** INFRA-GH-1A (PoC locale) + INFRA-GH-1B (deploy VPS)
**Tipo:** infrastruttura / PoC locale + deploy VPS (fuori repository GIS per esecuzione; docs in repo GIS)
**Data registrazione piano:** 2026-07-25
**Data chiusura 1A+1B:** 2026-07-27
**Esito pianificazione:** **GO INFRA-GH-1A** (revisione 2)
**Esito esecuzione:** **PASS end-to-end** — Fase A + FREEZE-B + Import B + MMAP smoke locale + INFRA-GH-1B WRITE
**Runtime live invariato (monolite GIS):** `ff43878e07acb57b714a3b77c877a1f8a40ae42b` (`ff43878`) — display **B5.5Z · build 59**
**Monolite:** **non toccato** dai blocchi infra; nessun deploy monolite GraphHopper
**Relazione WU-0010:** **OUTDOOR-ROUTING-GH-B2 — READY / NEXT RUNTIME BUNDLE** (endpoint VPS disponibile; B2 **non** implementato)
**Online/gateway:** rinviato a OUTDOOR-ROUTING-API-GATEWAY-A (**BACKLOG / NON APERTO**)

> Fonte primaria esecuzione: report PoC in `C:\Users\mrhz\Documents\AI\Tools\graphhopper-poc\reports\` + verifica VPS read-only 2026-07-27. **INFRA-GH-1A e INFRA-GH-1B CLOSED / PASS.**

---

## Contesto e motivo del blocco B2

OUTDOOR-ROUTING-GH-B1a e B1b sono **CLOSED / PASS end-to-end** (runtime tip `ff43878`, build 59 per monolite live; B1b tip `3a702e1` build 56). Il bundle operativo successivo **OUTDOOR-ROUTING-GH-B2** (GraphHopper endpoint, richiesta `/route`, preview transiente) era **BLOCKED** fino al PASS di INFRA-GH-1A/1B; **ora READY** con endpoint VPS Tailscale. Decisione operatore: **deploy_first** — work-unit infrastrutturale prima del monolite.

---

## Decisioni ratificate (vincolanti)

1. GraphHopper **11.0** (tag ufficiale; **non** master).
2. Macchina PoC: **Ryzen Windows 11** (3900X, 32 GiB, ~14 GiB liberi al censimento).
3. Area: Geofabrik **Nord-Ovest**.
4. **Elevation ON** dal primo import.
5. Endpoint PoC esclusivo: `http://127.0.0.1:8989` (loopback).
6. **Nessun intervento VPS** in 1A; nessun bind LAN/tailnet.
7. Futuro trasferimento graph-cache → VPS solo in **INFRA-GH-1B**.
8. Online/gateway escluso da B2 corrente; **nessuna API key** nel monolite.
9. Monolite **non modificato** finché l'endpoint locale non supera i gate del PoC.
10. Ambiente: **JDK portatile ZIP + script PowerShell** (non JDK di sistema, non Docker, non WSL2).

---

## Vincoli di esecuzione (riassunto operativo)

- **Import A** diagnostico: solo profili ufficiali `hike`/`mtb`; **non** genera la cache definitiva VPS.
- Custom model applicativi (`hiking_easy`, `mtb_touring`, `mtb_trail`) **congelati solo dopo** test diagnostici e casi discriminanti.
- **Import B** definitivo: quattro profili applicativi + preparazioni CH (LM esclusa salvo requisito B2 futuro dimostrato); produce graph-cache candidata al VPS.
- **B2 monolite non implementato** durante 1A.
- Gate: **nessun** requisito che le quattro geometrie debbano sempre differire; usare casi discriminanti semantici.
- Chiavi legacy **vietate:** `graph.flag_encoders`, `prepare.ch.weightings`, `prepare.ch.edge_based`, `server.host`, `graphhopper.cors.allowed_origins`, `vehicle:` nei profili.

---

## Piano tecnico consolidato (revisione 2)

Revisione 2. Rispetto alla revisione 1 sono corretti: gli header CORS realmente emessi, la descrizione di `hike.json`, la struttura del profilo `mtb_trail`, i gate sulle geometrie e la strategia CH/LM. La separazione fra import diagnostico e import definitivo diventa il perno dell'intero piano.

## 0. Esito pre-flight

Verificato read-only, nessuna modifica: repo root `C:/Users/mrhz/Documents/AI/GitHub/cursor-coordinate-converter`, branch `main`, `git status --short` vuoto, `HEAD` = `origin/main` = `ls-remote` = `e91508483b9ed2811bea8cb1f57c7975bd8c9b07`, `git diff --stat` e `git diff --cached --stat` vuoti. Nessun drift. Runtime live VPS `3a702e1...` (B5.5Z build 56) non toccato.

## 1. Fonti ufficiali GraphHopper 11.0

Tutte lette al tag `refs/tags/11.0` di `graphhopper/graphhopper` (commit albero `69e50f6e2cfaf0a8e69752df9953ee5f1ac276a4`). Nessuna fonte da `master`, nessun blog, nessun esempio Docker non pinnato.

- `README.md` — requisito JVM, artefatto, comandi `import` / `server`
- `config-example.yml` — forma YAML esatta
- `docs/core/profiles.md` — profili, `custom_model_files`, `custom_models.directory`, `profiles_ch`, `profiles_lm`, custom model per-richiesta
- `docs/core/custom-models.md` — sintassi delle regole
- `docs/core/elevation.md` — provider, cache, `dataaccess`
- `docs/core/deploy.md` — import esplicito, GC, limiti non-CH, aggiunta di preparazioni dopo l'import
- `docs/web/api-doc.md` — contratto `/route` e `/info`
- `core/src/main/resources/com/graphhopper/custom_models/hike.json`, `mtb.json`, `foot_elevation.json`, `bike_elevation.json`
- `core/src/main/java/com/graphhopper/config/Profile.java` — rifiuto del parametro `vehicle`
- `core/src/main/java/com/graphhopper/routing/ev/DefaultEncodedValueFactory.java` — elenco autorevole degli encoded value built-in (indicato da `profiles.md`)
- `core/src/main/java/com/graphhopper/reader/dem/CGIARProvider.java`, `SRTMProvider.java`
- `web-bundle/src/main/java/com/graphhopper/http/CORSFilter.java`
- `web/src/main/java/com/graphhopper/application/GraphHopperApplication.java`

Fonti non-GraphHopper, usate solo per il pinning degli artefatti: `api.adoptium.net` (metadata release JDK), `download.geofabrik.de/europe/italy/nord-ovest.html` (indice snapshot datati), `repo1.maven.org` (coordinate Maven). Nessun artefatto scaricato.

### 1.1 Citazioni verbatim usate come vincolo

Da `docs/core/deploy.md` @11.0:

> It is also possible to add CH/LM preparations for existing profiles after the initial import. Adding or modifying profiles is not possible and you need to run a new import instead.

> `java [options] -jar *.jar server config.yml # calls the import command implicitly, if not done before`

> If you want to support none-CH requests you should consider enabling landmarks or limit requests to a certain distance via `routing.non_ch.max_waypoint_distance` (in meter, default is 1) or to a node count via `routing.max_visited_nodes`.

Da `docs/core/profiles.md` @11.0:

> only encoded values specified in the `graph.encoded_values` field in the `config.yml` will be available in the graph storage

> with flex- and hybrid mode it is even possible to define the custom model on a per-request basis

> for the query custom model all values of `multiply_by` need to be within the range of `[0, 1]` otherwise an error will be thrown

Queste tre righe determinano rispettivamente: la necessita di due import, i limiti da alzare nell'import A, e il fatto che LM non vada preparata preventivamente.

## 2. Incongruenze documentali rilevate

1. **`docs/OPERATING_MEMORY.md` §7 contro `WU-0010` §5 sulla definizione di "B2"** — OM §7 definisce B2 come calcolo percorso GraphHopper ed endpoint; una sezione storica di WU-0010 lo associa al geocoding multi-riga. Precedenza allo stato vivo OM §7. Documenti non corretti in questa fase (nessuna scrittura).
2. **`docs/core/profiles.md` contro `Profile.java`** — `profiles.md` @11.0 mostra ancora `vehicle: car` in due esempi, ma `Profile.java` @11.0 esegue `throw new IllegalArgumentException("vehicle no longer accepted in profile")`. Precedenza al sorgente: il piano non usa mai `vehicle:`. La documentazione ufficiale e stale su questo punto.
3. **`docs/core/deploy.md` rimanda a `config-example.yml` di `master`** tramite un link `raw.githubusercontent.com/.../master/config-example.yml`. Il piano usa la versione al tag 11.0, non quella linkata.
4. **`docs/INFRA_VPS.md`, `rotational=1` su `/dev/vda`** — falso positivo del driver virtio, smentito dal benchmark diretto (~500 MB/s). Rilevante solo per 1B.
5. **`import.osm.ignored_highways` in `config-example.yml`** — il valore di esempio esclude `footway,cycleway,path,pedestrian,steps`, adatto a un setup car-only e distruttivo per profili outdoor. Va sovrascritto.

## 3. Correzione 1 — CORS

**Correzione rispetto alla revisione 1.** Il piano precedente affermava che `Access-Control-Allow-Headers` fosse assente. E falso. `CORSFilter.java` @11.0, letto integralmente, imposta tre header su **ogni** risposta, poi prosegue la catena:

```java
rsp.setHeader("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS");
rsp.setHeader("Access-Control-Allow-Headers", "Origin,Accept,X-Requested-With,"
        + "Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Range,GH-Client");
rsp.setHeader("Access-Control-Allow-Origin", "*");
chain.doFilter(request, response);
```

`GraphHopperApplication.java` @11.0 registra il filtro su pattern `*`. Quindi, come **fatto di codice**:

- `Access-Control-Allow-Origin: *` — presente;
- `Access-Control-Allow-Methods: GET, POST, HEAD, OPTIONS` — presente;
- `Access-Control-Allow-Headers` — **presente e comprende `Content-Type`**, quindi una POST JSON e nominalmente ammessa;
- `Access-Control-Max-Age` — **non impostato**: nessun caching del preflight, un preflight per ogni POST non-simple;
- `Access-Control-Allow-Private-Network` — **non impostato**;
- il filtro **non** intercetta né conclude la richiesta `OPTIONS`: chiama `chain.doFilter`, quindi lo **status** della preflight lo produce Jersey/Jetty a valle. Lo status non e deducibile dal filtro e va misurato.
- non esiste alcuna chiave YAML per CORS in 11.0; in particolare `graphhopper.cors.allowed_origins` non esiste.

**Il test CORS resta obbligatorio e non e superato finché non viene eseguito realmente.** Ciò che il codice garantisce sono gli header; ciò che il codice non garantisce sono lo status della preflight, il comportamento del browser reale e le restrizioni Private Network Access.

### 3.1 Test CORS empirici

Per ciascun caso registrare: status HTTP, tutti gli header `Access-Control-*` ricevuti, esito reale nella console del browser, messaggio d'errore verbatim se bloccato.

1. `GET /info` diretto (PowerShell `Invoke-WebRequest`), senza `Origin`: baseline degli header.
2. `OPTIONS /info` con `Origin: http://localhost:8000` e `Access-Control-Request-Method: GET`. Verificare lo **status** (non deducibile dal filtro) e gli header.
3. `OPTIONS /route` con `Origin: http://localhost:8000`, `Access-Control-Request-Method: POST`, `Access-Control-Request-Headers: content-type`. Verificare che `Content-Type` compaia in `Access-Control-Allow-Headers`.
4. `POST /route` reale da una pagina servita su `http://localhost:8000`: esito browser, non solo header.
5. `POST /route` da una pagina servita su `http://100.114.7.53:8000`, cioè **l'origine da cui il monolite e realmente servito**. Una richiesta da un'origine con IP privato verso `127.0.0.1` ricade nelle restrizioni Private Network Access / Local Network Access dei browser Chromium, che richiedono un preflight con `Access-Control-Request-Private-Network: true` e una risposta con `Access-Control-Allow-Private-Network: true`, header che `CORSFilter` non emette. Registrare se e quando il browser blocca.
6. `POST /route` da una pagina aperta con schema `file://` (origine opaca).
7. Ripetere 4–6 su Chromium ed Edge nelle versioni realmente in uso, annotando le versioni.

Harness: una singola pagina HTML statica in `graphhopper-poc\reports\cors-harness\index.html`, servita con `python -m http.server 8000`, con tre bottoni (GET /info, POST /route, POST /route con via) e un pannello che stampa status, header leggibili ed errore. **Non creato in questa fase.** Nessuna modifica al monolite.

Se il caso 5 fallisce, le opzioni future — da **decidere, non implementare**, in 1B o in B2 — sono: reverse proxy locale che serva monolite e routing sulla stessa origine; route same-origin sotto il server che gia serve il monolite; proxy server-side sul VPS; gateway dedicato. Il PoC produce la **decisione**, non il codice.

## 4. Configurazione Import A (diagnostico)

Obiettivo dell'import A: verificare encoded values, `/info`, elevation, routing di base, distribuzione dei rating, e abilitare la sperimentazione con custom model inline. **Non** produce la cache destinata al VPS.

```yaml
# config-import-A.yml
graphhopper:
  datareader.file: C:/Users/mrhz/Documents/AI/Tools/graphhopper-poc/data/nord-ovest-260723.osm.pbf
  graph.location:  C:/Users/mrhz/Documents/AI/Tools/graphhopper-poc/graph-cache/diag-A

  # unione degli header ufficiali di hike.json e mtb.json, piu aggiunte diagnostiche
  graph.encoded_values: >
    foot_access, foot_priority, foot_network, foot_average_speed, foot_road_access,
    hike_rating, average_slope,
    mtb_priority, mtb_access, roundabout, mtb_average_speed, bike_road_access,
    mtb_rating, country, road_class,
    surface, track_type, smoothness, road_environment, road_access, max_speed, max_slope

  import.osm.ignored_highways: motorway,trunk

  graph.elevation.provider:   cgiar
  graph.elevation.cache_dir:  C:/Users/mrhz/Documents/AI/Tools/graphhopper-poc/elevation-cache/cgiar
  graph.elevation.dataaccess: RAM_STORE

  graph.dataaccess.default_type: RAM_STORE

  # solo profili ufficiali, nessun custom model proprietario
  profiles:
    - name: hike
      custom_model_files: [hike.json, foot_elevation.json]
    - name: mtb
      custom_model_files: [mtb.json, bike_elevation.json]

  profiles_ch: []
  profiles_lm: []

  # obbligatori in modalita flexible: il default di max_waypoint_distance e 1 metro
  routing.non_ch.max_waypoint_distance: 300000
  routing.max_visited_nodes: 5000000

server:
  application_connectors:
    - type: http
      port: 8989
      bind_host: 127.0.0.1
  admin_connectors:
    - type: http
      port: 8990
      bind_host: 127.0.0.1
  request_log:
    appenders:
      - type: file
        currentLogFilename: C:/Users/mrhz/Documents/AI/Tools/graphhopper-poc/logs/access.log
        archive: false

logging:
  level: INFO
  loggers:
    com.graphhopper: INFO
  appenders:
    - type: console
      threshold: INFO
    - type: file
      currentLogFilename: C:/Users/mrhz/Documents/AI/Tools/graphhopper-poc/logs/graphhopper-A.log
      archive: false
```

Note che distinguono A da B:

- **Nessun custom model proprietario.** `hiking_easy.json`, `mtb_touring.json` e `mtb_trail.json` non compaiono: non sono ancora verificati, e includerli renderebbe l'import A non diagnostico ma già impegnativo.
- **`profiles_ch: []` e `profiles_lm: []`** sono la condizione per usare `custom_model` inline senza vincoli. Con LM il modello di query sarebbe limitato a `multiply_by` in `[0,1]`, che impedirebbe di provare i boost necessari a `mtb_trail`.
- **`routing.non_ch.max_waypoint_distance: 300000`** e necessario, non opzionale: `deploy.md` documenta un default di **1 metro**, che renderebbe inutilizzabile la modalita flexible. Il valore alto ha un costo in RAM per richiesta, accettabile in diagnosi su una macchina con 14 GiB liberi e non trasferito all'import B.
- `graph.location` distinto (`diag-A`) da quello di B, così le due cache coesistono e A resta disponibile per ulteriori diagnosi dopo la produzione di B.

### 4.1 Fonti per ogni chiave

Tutte al tag 11.0, con funzione e incertezza residua.

- `graphhopper:` / `server:` / `logging:` come tre chiavi top-level — `config-example.yml`. Le chiavi `datareader.file`, `graph.*`, `profiles*`, `routing.*` sono **figlie di `graphhopper:`** e non ripetono il prefisso; `server:` e `logging:` sono **fratelli**, non figli. Certezza alta.
- `datareader.file` — `config-example.yml`, `deploy.md`. Sorgente OSM. Alta.
- `graph.location` — `config-example.yml`, `deploy.md`. Directory della graph-cache; se valida, il server la carica invece di reimportare. Alta.
- `graph.encoded_values` — `profiles.md`: "only encoded values specified in the `graph.encoded_values` field in the `config.yml` will be available in the graph storage". L'elenco di base e **copiato dagli header dei modelli ufficiali** (vedi §5), quindi source-anchored; le sette aggiunte diagnostiche servono solo ai `path_details`. Certezza alta sulla chiave, alta sul nucleo, **media sulle aggiunte**: se una non esiste in `DefaultEncodedValueFactory`, l'import fallisce con messaggio esplicito e la si rimuove.
- `import.osm.ignored_highways` — `config-example.yml`. Correzione piu critica dell'intero config: il default di esempio cancellerebbe la rete escursionistica. Alta.
- `graph.elevation.provider` / `.cache_dir` / `.dataaccess` — `elevation.md`, `CGIARProvider.java`. `deploy.md` conferma che MMAP e il default per i dati di elevazione; `RAM_STORE` e raccomandato dalla doc per aree piccole con import piu veloce. Alta.
- `graph.dataaccess.default_type` — `config-example.yml`. `RAM_STORE` su Ryzen. **Da verificare in 1A** che la stessa cache si carichi anche con `MMAP`, perché e il modo previsto per il VPS in 1B. Alta sulla chiave, da verificare l'interoperabilita.
- `custom_models.directory` — **confermata** in `profiles.md` @11.0, che mostra `custom_models.directory: path/to/my/custom/models` accanto a `custom_model_files`. La revisione 1 la dava a certezza media: ora e alta. Non usata nell'import A (che usa solo modelli interni risolti da classpath), necessaria nell'import B.
- `profiles[].name` / `custom_model_files` — `profiles.md`. I file elencati sono concatenati in ordine. Nessun `vehicle:`. Alta.
- `profiles_ch` / `profiles_lm` — `profiles.md`, liste di `- profile: <nome>`. Alta.
- `routing.non_ch.max_waypoint_distance` / `routing.max_visited_nodes` — `deploy.md`, con il default di 1 metro esplicitamente documentato. Alta.
- `server.application_connectors[].bind_host` / `port` e `admin_connectors` — `config-example.yml` (Dropwizard). Alta. Il connettore **admin** va vincolato esplicitamente a `127.0.0.1`, altrimenti resta un secondo listener non controllato sulla 8990.
- `logging` / `request_log` — `config-example.yml` (Dropwizard). Alta.

Nessuna chiave CORS, perché non esiste (§3).

## 5. Profili ufficiali usati nell'Import A

### 5.1 `hike` — descrizione corretta

**Correzione rispetto alla revisione 1**, che attribuiva a `hike.json` una regola `hike_rating > 4 → 0.8` **inesistente**. Il contenuto reale di `core/src/main/resources/com/graphhopper/custom_models/hike.json` @11.0 e:

```json
{
  "priority": [
    { "if": "!foot_access || hike_rating >= 6", "multiply_by": "0"},
    { "else": "", "multiply_by": "foot_priority"},
    { "if": "foot_road_access == PRIVATE", "multiply_by": "0.1" },
    { "if": "foot_network == INTERNATIONAL || foot_network == NATIONAL", "multiply_by": "1.7"},
    { "else_if": "foot_network == REGIONAL || foot_network == LOCAL", "multiply_by": "1.5"}
  ],
  "speed": [
    { "if": "hike_rating < 1", "limit_to": "foot_average_speed" },
    { "else_if": "hike_rating > 2", "limit_to": "1.5" },
    { "else":   "", "limit_to": "4" }
  ]
}
```

Comportamento verificato, e nient'altro:

- **blocco** su accesso pedonale negato oppure `hike_rating >= 6` (`multiply_by 0`);
- altrimenti la priorita e il valore dell'encoded value `foot_priority`;
- **penalita 0.1** su `foot_road_access == PRIVATE`;
- **preferenza per le reti escursionistiche**: 1.7 per rete internazionale o nazionale, 1.5 per regionale o locale;
- **velocita regolata da `hike_rating`**: `foot_average_speed` quando `hike_rating < 1`, 1.5 km/h quando `hike_rating > 2`, 4 km/h negli altri casi.

L'header del file dichiara inoltre gli encoded value richiesti — `foot_access, foot_priority, foot_network, foot_average_speed, foot_road_access, hike_rating, average_slope` — e la composizione del profilo — `custom_model_files: [hike.json, foot_elevation.json]`. Questa e la fonte da cui e derivato l'elenco di §4. `hike.json` non usa direttamente `average_slope`: lo usa `foot_elevation.json`, appeso dopo.

Conseguenza operativa non ovvia: **il limite di 1.5 km/h su `hike_rating > 2` e gia una forte penalizzazione implicita** dei sentieri T3 e superiori, perché il tempo di percorrenza esplode. Il profilo `hiking` ufficiale non e quindi "neutro": sconsiglia gia i tratti tecnici via velocita, pur senza bloccarli fino a T6.

### 5.2 `mtb` — descrizione corretta

Contenuto reale di `mtb.json` @11.0:

```json
{
  "priority": [
    { "if": "true",  "multiply_by": "mtb_priority" },
    { "if": "mtb_rating > 6",  "multiply_by": "0" },
    { "if": "mtb_rating > 3",  "multiply_by": "0.5" },
    { "if": "hike_rating > 4",  "multiply_by": "0" },
    { "if": "country == DEU && road_class == BRIDLEWAY && bike_road_access != YES", "multiply_by": "0" },
    { "if": "!mtb_access && (!backward_mtb_access || roundabout)",  "multiply_by": "0" },
    { "else_if": "!mtb_access && backward_mtb_access",  "multiply_by": "0.2" },
    { "if": "bike_road_access == PRIVATE || bike_road_access == DESTINATION", "multiply_by": "0.1" }
  ],
  "speed": [
    { "if": "true", "limit_to": "mtb_average_speed" },
    { "if": "mtb_rating > 3",  "limit_to": "4" },
    { "if": "!mtb_access && backward_mtb_access", "limit_to": "6" },
    { "if": "bike_road_access == PRIVATE || bike_road_access == DESTINATION", "limit_to": "6" }
  ]
}
```

Header ufficiale degli encoded value richiesti: `mtb_priority, mtb_access, roundabout, mtb_average_speed, bike_road_access, average_slope, mtb_rating, hike_rating, country, road_class`. `backward_mtb_access` e usato nel modello ma non elencato: e la direzione inversa di `mtb_access`, disponibile automaticamente.

Due proprieta di questo modello determinano il §7.4:

- i trail tecnici (`mtb_rating > 3`) subiscono **sia** una penalita di priorita 0.5 **sia** un tetto di velocita a 4 km/h;
- `limit_to` applica un **massimo**: una regola successiva puo solo abbassarlo ulteriormente, mai rialzarlo. Il tetto di 4 km/h e quindi **irreversibile** con un overlay appeso.

## 6. Test diagnostici sull'Import A

Da eseguire nell'ordine, prima di progettare qualunque custom model applicativo.

**D1 — `GET /info`.** Registrare verbatim in `reports/info-A.json`: elenco `profiles` (atteso `hike`, `mtb`), `elevation: true`, `import_date`, `data_date`, `bbox`, versione 11.0, ed **elenco completo degli `encoded_values` con i loro valori possibili**. Questo output e la fonte per congelare, senza inventare nulla: la mappatura intera di `hike_rating` e `mtb_rating`, e i nomi enum esatti di `surface`, `track_type`, `road_class`, `smoothness`, `foot_network`, `road_access`.

**D2 — elevation reale.** Su route in zona collinare (Cinque Terre) e alpina (Courmayeur), con `elevation: true, points_encoded: false`: ogni elemento di `paths[0].points.coordinates` ha lunghezza 3; la terza componente **varia** (deviazione standard > 0); i valori sono plausibili (0–1500 m in Liguria, fino a ~3000 m in Valle d'Aosta); `ascend` e `descend` presenti e > 0; `path_details.average_slope` non nullo. Un array di quote costanti o nulle e **FAIL bloccante**. Controllo da eseguire **subito dopo l'import**, prima di ogni altra misura.

**D3 — routing di base.** A→B e A→via→B su `hike` e `mtb`, con `points_encoded: false`, `elevation: true` e `details` completi. Verificare struttura, distanza, tempo, numero di punti.

**D4 — distribuzione dei rating.** Su un insieme di route escursionistiche e MTB, leggere `path_details.hike_rating` e `path_details.mtb_rating` e calcolare la **percentuale di lunghezza con rating > 0**. E la misura della copertura del tagging `sac_scale` / `mtb:scale` nel Nord-Ovest, e determina se i profili "facile" e "trail" possono funzionare davvero o se il dato e troppo sparso.

**D5 — custom model inline.** POST `/route` con campo `custom_model` aggiuntivo, su profilo `hike`, con una regola banale e verificabile (per esempio `{"priority":[{"if":"road_class == TRACK","multiply_by":"0.1"}]}`). Verificare che la richiesta sia accettata e che il risultato cambi rispetto alla stessa richiesta senza `custom_model`. `profiles.md` documenta la funzione per flex e hybrid mode; con `profiles_ch: []` non serve `ch.disable=true`, ma va provato anche con quel parametro esplicito per registrare il comportamento. **Se il custom model inline non funzionasse**, l'intero metodo di taratura del §7 decade e occorre ripiegare su piu import successivi: e la ragione per cui D5 e un test diagnostico e non un'assunzione.

**D6 — casi limite.** Fuori estratto, punto non raggiungibile, profilo inesistente, JSON malformato (§10.7).

**D7 — `path_details`.** Ogni chiave richiesta in `details` compare in `paths[0].details` con intervalli `[from, to, value]` che coprono l'intera geometria. Una EV assente da `graph.encoded_values` produce errore: e la conferma incrociata che l'elenco di §4 e corretto.

**D8 — `algorithm=alternative_route`.** Verificare che funzioni in modalita flexible e registrare numero e qualita delle alternative. La verifica su CH avverra sull'import B.

**D9 — misure di import A** (§11).

## 7. Strategia custom model

### 7.1 Principio: irrigidire con overlay, rilassare con modello derivato

I custom model si compongono per **appensione**: le regole del file successivo si aggiungono a quelle del precedente, i `multiply_by` si moltiplicano, i `limit_to` prendono il minimo. Da qui una regola di progetto netta:

- se il profilo applicativo deve essere **piu restrittivo** del modello ufficiale, un **overlay appeso** e corretto e sufficiente: aggiungere `multiply_by: 0` o penalita e sempre rappresentabile;
- se il profilo applicativo deve essere **meno restrittivo**, l'overlay **non funziona**: non si puo annullare un `multiply_by: 0.5` gia applicato in modo pulito, e non si puo rialzare un `limit_to`. Serve un **modello derivato standalone**, che sostituisce il file ufficiale invece di seguirlo.

Applicando il principio: `hiking` usa i file ufficiali verbatim; `hiking_easy` e `mtb_touring` sono overlay; `mtb_trail` e un modello derivato standalone.

### 7.2 Sequenza di definizione

I custom model applicativi **non** vengono scritti prima delle misure. La sequenza vincolante e:

1. Import A con i soli profili ufficiali.
2. D1 fissa la mappatura reale dei rating e i nomi enum.
3. D4 misura la copertura del tagging.
4. Si scoprono i segmenti discriminanti (§10).
5. Si tarano i quattro modelli via `custom_model` inline sulla cache A, iterando **senza reimportare**.
6. Si congelano e si versionano i file in `custom-models/`, con un campo `"//version"` e la data.
7. Solo allora si esegue l'import B.

### 7.3 `hiking`, `hiking_easy`, `mtb_touring`

`hiking` = `custom_model_files: [hike.json, foot_elevation.json]`, ufficiale verbatim. Nessun overlay. E il riferimento.

`hiking_easy` = `[hike.json, foot_elevation.json, hiking_easy.json]`. Bozza da tarare:

```json
{
  "priority": [
    { "if": "hike_rating > 2", "multiply_by": "0" },
    { "if": "max_slope > 25 || max_slope < -25", "multiply_by": "0.2" },
    { "if": "average_slope > 12 || average_slope < -12", "multiply_by": "0.6" }
  ]
}
```

Rationale: `hike.json` blocca solo da `hike_rating >= 6` e penalizza i tratti `> 2` via velocita (1.5 km/h). Per un profilo "facile" si trasforma quella penalita in **esclusione**. La soglia 2 corrisponde alla sommita di `mountain_hiking` nella scala SAC, ma **la mappatura intera va confermata da D1**: se `hike_rating` non mappa `sac_scale` con l'ordinale atteso, la soglia cambia. `max_slope > 25` e `average_slope > 12` sono **parametri di calibrazione PoC senza fonte upstream**, da tarare in §7.2 punto 5 e da registrare con il valore finale.

`mtb_touring` = `[mtb.json, bike_elevation.json, mtb_touring.json]`. Bozza da tarare:

```json
{
  "priority": [
    { "if": "mtb_rating > 3", "multiply_by": "0" },
    { "if": "road_class == PRIMARY || road_class == SECONDARY", "multiply_by": "0.3" },
    { "if": "road_class == TRACK", "multiply_by": "1.3" },
    { "if": "surface == GRAVEL || surface == COMPACTED || surface == FINE_GRAVEL", "multiply_by": "1.2" }
  ]
}
```

Rationale: la soglia `mtb_rating > 3` e **source-anchored** (compare in `mtb.json`); qui la penalita 0.5 diventa esclusione. Le altre tre regole sono parametri PoC. I nomi enum `TRACK`, `PRIMARY`, `SECONDARY`, `GRAVEL`, `COMPACTED`, `FINE_GRAVEL` vanno confermati da D1 prima del congelamento.

### 7.4 `mtb_trail` — rivalutazione completa

**Correzione rispetto alla revisione 1.** La revisione 1 proponeva un overlay con `multiply_by: 1.6` appeso a `mtb.json`. E tecnicamente inadeguato, per due ragioni verificate sul sorgente:

1. `mtb.json` applica `{"if": "mtb_rating > 3", "multiply_by": "0.5"}`. Un boost successivo di 1.6 porta il fattore netto a 0.8, quindi il trail tecnico resta **penalizzato** rispetto a un percorso non tecnico. L'overlay non ottiene ciò che dichiara.
2. `mtb.json` applica `{"if": "mtb_rating > 3", "limit_to": "4"}` nella sezione velocita. `limit_to` e un **massimo**, e nessuna regola successiva puo rialzarlo. Un trail S4 resta a 4 km/h qualunque cosa faccia l'overlay, quindi il costo temporale continua a scoraggiarlo. Questo blocco e **strutturalmente irreversibile** per appensione.

Sono state valutate entrambe le soluzioni richieste.

#### Soluzione A — modello derivato standalone (raccomandata, condizionata)

`mtb_trail` = `custom_model_files: [mtb_trail.json, bike_elevation.json]`, dove `mtb_trail.json` **sostituisce** `mtb.json` invece di seguirlo. Ogni clausola e copiata verbatim da `mtb.json` @11.0 tranne tre delta dichiarati.

```json
{
  "priority": [
    { "if": "true",  "multiply_by": "mtb_priority" },
    { "if": "mtb_rating > 6",  "multiply_by": "0" },
    { "if": "hike_rating > 4",  "multiply_by": "0" },
    { "if": "country == DEU && road_class == BRIDLEWAY && bike_road_access != YES", "multiply_by": "0" },
    { "if": "!mtb_access && (!backward_mtb_access || roundabout)",  "multiply_by": "0" },
    { "else_if": "!mtb_access && backward_mtb_access",  "multiply_by": "0.2" },
    { "if": "bike_road_access == PRIVATE || bike_road_access == DESTINATION", "multiply_by": "0.1" },
    { "if": "road_class == PRIMARY || road_class == SECONDARY", "multiply_by": "0.3" }
  ],
  "speed": [
    { "if": "true", "limit_to": "mtb_average_speed" },
    { "if": "mtb_rating > 3",  "limit_to": "8" },
    { "if": "!mtb_access && backward_mtb_access", "limit_to": "6" },
    { "if": "bike_road_access == PRIVATE || bike_road_access == DESTINATION", "limit_to": "6" }
  ]
}
```

Delta rispetto a `mtb.json`, tutti espliciti e nessun altro:

- **D-1, rimozione.** Eliminata `{"if": "mtb_rating > 3", "multiply_by": "0.5"}`. Effetto: i trail tecnici non sono piu dimezzati in priorita. E il senso stesso del profilo.
- **D-2, rilassamento.** `{"if": "mtb_rating > 3", "limit_to": "4"}` diventa `"limit_to": "8"`. **Parametro PoC senza fonte upstream**: 4 km/h e passo d'uomo, 8 km/h e una stima di percorrenza per un rider su terreno tecnico. Da tarare e registrare.
- **D-3, aggiunta.** `{"if": "road_class == PRIMARY || road_class == SECONDARY", "multiply_by": "0.3"}`, per evitare le strade principali. **Parametro PoC.**

Conservati verbatim, e questa e la parte che conta: **tutti i blocchi di accesso** (`!mtb_access` con le sue due varianti direzionali), la regola bridleway per la Germania, le penalita `PRIVATE` e `DESTINATION` in priorita e in velocita, il blocco `mtb_rating > 6`, il blocco `hike_rating > 4`, e l'ordine relativo delle clausole (in particolare l'`else_if` resta immediatamente dopo il proprio `if`).

Dati richiesti dalla soluzione A:

- **encoded values reali**: `mtb_priority`, `mtb_access` (e la sua direzione inversa `backward_mtb_access`), `roundabout`, `mtb_average_speed`, `bike_road_access`, `mtb_rating`, `hike_rating`, `country`, `road_class`, piu `average_slope` per `bike_elevation.json`. Sono esattamente quelli dichiarati dall'header di `mtb.json`, nessuna aggiunta.
- **ordine delle regole**: quello di `mtb.json`, con D-3 appeso in coda alla priorita e D-2 sostituito in posizione.
- **interazione con `mtb_rating`**: blocco sopra 6 conservato, penalita sopra 3 rimossa, tetto di velocita sopra 3 alzato a 8.
- **soglie supportate**: solo 6 e 3, entrambe presenti in `mtb.json`. Nessuna soglia nuova sui rating.
- **access restrictions**: invariate rispetto all'ufficiale. Nessun accesso vietato viene aperto.
- **velocita**: `mtb_average_speed` come base, 8 km/h sui tecnici, 6 km/h su contromano e su private/destination.
- **priorita**: `mtb_priority` come base, penalita 0.3 su primarie e secondarie, 0.1 su private/destination, 0.2 su contromano.
- **casi che restano esclusi**: `mtb_rating > 6`; `hike_rating > 4`; accesso MTB negato in entrambe le direzioni; bridleway tedesche senza accesso esplicito. Restano inoltre non rappresentabili: esposizione e vertigine, presenza di catene o passaggi attrezzati, stagionalita, guadi, chiusure invernali, e la distinzione fra discesa e salita sullo stesso arco.

**Rischio sicurezza per l'operatore, dichiarato esplicitamente.** Rimuovere la penalita 0.5 significa che il router puo instradare su sentieri S4 e S5 trattandoli come percorsi ordinari. Su terreno ligure o alpino questi sono tratti realmente pericolosi in bicicletta. Il rischio e amplificato da due fattori: la copertura del tagging `mtb:scale` e parziale (D4), quindi un tratto tecnico non taggato appare come rating 0 e non viene nemmeno filtrato; e la scala `mtb:scale` descrive la difficolta tecnica, non l'esposizione. **Il profilo `mtb_trail` va quindi presentato all'utente finale come profilo esperto, con avvertenza esplicita, e non deve essere il default.** Questa e una richiesta al futuro bundle di B2, registrata qui.

**Condizione bloccante alla soluzione A.** La mappatura fra `mtb:scale` e i valori interi di `mtb_rating` non e nota con certezza da questa analisi: `mtb.json` usa le soglie 6 e 3, ma non dichiara se `mtb:scale=6` corrisponda a `mtb_rating=6` o `7`. Se corrispondesse a 6, il blocco `> 6` non escluderebbe nulla e `mtb_trail` ammetterebbe S6. **D1 deve risolvere questo punto prima del congelamento.** Finché non e risolto, la soluzione A non va congelata.

#### Soluzione B — profilo conservativo (fallback)

`mtb_trail` = `[mtb.json, bike_elevation.json, mtb_trail_conservative.json]` con il solo overlay:

```json
{
  "priority": [
    { "if": "road_class == PRIMARY || road_class == SECONDARY", "multiply_by": "0.3" }
  ]
}
```

Cioe: modello MTB ufficiale immutato, piu la sola preferenza per evitare le strade principali.

- **Limiti dichiarati**: i trail con `mtb_rating > 3` restano penalizzati 0.5 in priorita e limitati a 4 km/h. Il profilo **non favorisce realmente i trail tecnici**; li tollera come il profilo `mtb` ufficiale. La differenza rispetto a `mtb_touring` si riduce al fatto che `mtb_touring` li **esclude** mentre `mtb_trail` li **ammette penalizzati**. E una differenza reale e verificabile, ma modesta.
- **Vantaggio**: nessun delta rispetto al comportamento validato da GraphHopper, quindi nessun rischio sicurezza introdotto dal PoC oltre a quello gia presente nel modello ufficiale.
- **Encoded values, ordine, soglie, access, velocita, priorita**: identici a `mtb.json` (§5.2), piu la sola regola aggiunta.
- **Casi esclusi**: gli stessi di `mtb.json`.

#### Decisione

**Soluzione A se D1 conferma che il blocco `mtb_rating > 6` esclude effettivamente `mtb:scale=6`; altrimenti soluzione B.** In entrambi i casi il modello scelto va versionato e registrato in `reports/`, con i delta e i parametri PoC elencati uno per uno. La decisione va presa **dopo** l'import A e **prima** dell'import B, ed e un elemento del gate.

## 8. Configurazione Import B (definitivo)

Si esegue solo dopo che D1–D9 sono PASS, i casi discriminanti sono identificati, i quattro modelli sono congelati e la decisione CH/LM/flexible e presa sulle misure.

```yaml
# config-import-B.yml — differenze rispetto ad A
graphhopper:
  datareader.file: .../data/nord-ovest-260723.osm.pbf      # stesso snapshot
  graph.location:  .../graph-cache/nord-ovest-B            # cache distinta

  graph.encoded_values: >
    foot_access, foot_priority, foot_network, foot_average_speed, foot_road_access,
    hike_rating, average_slope,
    mtb_priority, mtb_access, roundabout, mtb_average_speed, bike_road_access,
    mtb_rating, country, road_class,
    surface, track_type, smoothness, road_environment, road_access, max_speed, max_slope

  import.osm.ignored_highways: motorway,trunk

  graph.elevation.provider:   cgiar
  graph.elevation.cache_dir:  .../elevation-cache/cgiar     # gia calda: nessun download
  graph.elevation.dataaccess: RAM_STORE
  graph.dataaccess.default_type: RAM_STORE

  custom_models.directory: C:/Users/mrhz/Documents/AI/Tools/graphhopper-poc/custom-models

  profiles:
    - name: hiking
      custom_model_files: [hike.json, foot_elevation.json]
    - name: hiking_easy
      custom_model_files: [hike.json, foot_elevation.json, hiking_easy.json]
    - name: mtb_touring
      custom_model_files: [mtb.json, bike_elevation.json, mtb_touring.json]
    - name: mtb_trail
      custom_model_files: [mtb_trail.json, bike_elevation.json]     # soluzione A: standalone

  profiles_ch:
    - profile: hiking
    - profile: hiking_easy
    - profile: mtb_touring
    - profile: mtb_trail

  profiles_lm: []

  # con CH attiva questi limiti valgono solo per eventuali richieste ch.disable
  routing.non_ch.max_waypoint_distance: 30000
  routing.max_visited_nodes: 1000000
```

`config-server.yml` e una copia esatta di `config-import-B.yml`: qualunque divergenza nei profili o nei custom model fa fallire il caricamento, che e il comportamento voluto.

Nota: se prevale la soluzione B, la riga di `mtb_trail` diventa `custom_model_files: [mtb.json, bike_elevation.json, mtb_trail_conservative.json]`.

I limiti non-CH sono **abbassati** rispetto ad A: in B la modalita normale e CH, e non si vuole che una richiesta con `ch.disable=true` possa consumare memoria senza controllo.

## 9. Strategia CH / LM / flexible

**Correzione rispetto alla revisione 1**, che proponeva CH e LM su tutti e quattro i profili. La proposta era una duplicazione non giustificata.

### 9.1 Confronto

- **CH, profili fissi.** Tempi di risposta minimi e prevedibili, memoria per richiesta bassissima. Il modello e congelato alla preparazione: nessun `custom_model` inline. Costa una preparazione per profilo in tempo di import e in dimensione di cache; senza `turn_costs` — il caso di tutti e quattro i profili outdoor — `deploy.md` documenta un costo molto inferiore rispetto al caso automobilistico con costi di svolta. **E la modalita giusta per i quattro profili applicativi fissi**, ed e l'unica che rende prevedibile la latenza sul futuro VPS con 2532 MiB liberi e senza swap.
- **LM, modifiche dinamiche.** Consente `custom_model` inline con i due vincoli documentati: `multiply_by` della query entro `[0, 1]`, e `distance_influence` della query non inferiore a quella del profilo. Piu lenta di CH, con cache aggiuntiva. Serve solo se una funzione documentata richiede di modificare il modello a runtime.
- **Flexible.** Nessuna preparazione, liberta totale sul `custom_model` inline (nessun vincolo `[0,1]`), ma memoria e tempo per richiesta elevati; richiede di alzare `routing.non_ch.max_waypoint_distance`, il cui default e 1 metro. **E la modalita giusta per la diagnosi e la taratura**, e per nient'altro.

### 9.2 Decisione per Import A

`profiles_ch: []`, `profiles_lm: []`. **Nessuna preparazione.** Motivi: e la configurazione di import piu economica; e l'unica che consente `custom_model` inline senza il vincolo `[0,1]`, necessario per provare i boost di `mtb_trail`; la cache A non e destinata al VPS, quindi ottimizzarne le prestazioni sarebbe sprecato. Costo: bisogna alzare i limiti non-CH e accettare route lente su lunghe distanze, il che e accettabile in diagnosi.

### 9.3 Decisione per Import B

`profiles_ch` sui quattro profili applicativi. `profiles_lm: []`.

**Perché LM non va preparata.** Lo scope confermato di OUTDOOR-ROUTING-GH-B2 e endpoint, richiesta route e preview transiente: profili fissi, nessuna modifica del modello a runtime, nessuna funzione "evita area". Nessun requisito B2 documentato richiede LM. E soprattutto, `deploy.md` @11.0 afferma che *"It is also possible to add CH/LM preparations for existing profiles after the initial import"*: **LM puo essere aggiunta in seguito senza un nuovo import**, purché i profili non cambino. Preparare LM adesso "per sicurezza" costerebbe tempo di import e dimensione di cache — quest'ultima particolarmente critica per il trasferimento al VPS — a fronte di un beneficio che si puo ottenere piu tardi allo stesso prezzo. Preparazione LM esclusa, con la porta lasciata aperta.

**Condizione.** Se durante il PoC emerge un requisito B2 documentato che richiede `custom_model` per richiesta, LM va aggiunta ai soli profili interessati, non a tutti e quattro, e la decisione va registrata con la motivazione.

### 9.4 Verifiche esplicite richieste

Da eseguire e registrare, alcune su A e altre su B:

- **alternative routes**: `algorithm=alternative_route` in flexible su A (D8) e **con CH** su B. `docs/web/api-doc.md` lo indica come utilizzabile anche senza `ch.disable=true`; va confermato empiricamente sulla build reale, perché una futura funzione alternative dipende da questo.
- **`path_details`**: verificati su A (D7) e ripetuti su B con CH, per escludere differenze fra modalita.
- **elevation**: proprieta del grafo, indipendente dalla preparazione; verificata su entrambe le cache.
- **`custom_model` inline**: atteso funzionante su A (flexible), atteso **rifiutato** su B per i profili con CH salvo `ch.disable=true`, che a sua volta su B ricade in flexible con i limiti abbassati. Registrare il messaggio d'errore esatto: e il comportamento che B2 dovra evitare di innescare.
- **aumento dimensione graph-cache**: misurare `nord-ovest-B` prima e dopo le preparazioni CH, per sottodirectory, e confrontare con `diag-A`. E la voce che decide la fattibilita di 1B.
- **aumento durata import**: differenza fra durata di A (cache DEM fredda, nessuna preparazione) e di B (cache DEM calda, CH x4), scorporando il contributo del download DEM.
- **impatto sulla futura memoria VPS**: dimensione della cache, piu heap del server misurata a regime, contro i 2532 MiB liberi senza swap. Se la somma non ci sta con `RAM_STORE`, e il gate MMAP (§13, gate 20) a stabilire se `MMAP` risolve.

**Gate di degrado.** Se `nord-ovest-B` supera ~8 GiB o l'import B supera 3 ore, ridurre le preparazioni CH ai soli `hiking` e `mtb_touring`, servire gli altri due in flexible con limiti stretti, rimisurare e registrare la scelta.

## 10. Casi discriminanti

**Correzione rispetto alla revisione 1**, che imponeva come gate *"le quattro geometrie A→B devono differire"*. Il gate e sbagliato: due profili possono legittimamente restituire lo stesso percorso quando nel corridoio non esiste alcun arco che li distingua, o quando non c'e alternativa praticabile. Quel gate produrrebbe falsi FAIL. **Eliminato** e sostituito da sei casi mirati.

### 10.1 Metodo di individuazione dei segmenti

I segmenti non vengono inventati né cercati fuori dallo strumento. Si ricavano dall'import A stesso:

1. si esegue una route con il profilo permissivo in un'area a tagging ricco;
2. si legge `path_details` per la proprieta discriminante (`hike_rating`, `mtb_rating`, `surface`, `track_type`, `road_class`, `road_access`);
3. si individua un intervallo con il valore desiderato;
4. si prendono i due punti della geometria che lo delimitano come A' e B' del caso discriminante;
5. si congelano coordinate, tag rilevanti e valore dell'encoded value in `reports/discriminanti.json`.

Così ogni caso e verificabile e riproducibile, e nessun tag OSM viene assunto senza averlo letto dal grafo importato.

Aree candidate, scelte per densita di tagging e per pertinenza operativa:

- **Cinque Terre**, Monterosso `9.6540, 44.1461` → Vernazza `9.6845, 44.1353`: rete SVA, `sac_scale` presente, `foot_network` regionale o nazionale.
- **Alta Via del Golfo / Portovenere** `9.8370, 44.0530` → Riomaggiore `9.7370, 44.0993`: variazione di `sac_scale`.
- **Finale Ligure** `8.3436, 44.1697` → entroterra `8.3100, 44.2100`: densita di `mtb:scale` fra le piu alte d'Italia.
- **Courmayeur** `6.9694, 45.7917`: `sac_scale` alti, per il limite superiore.
- **La Spezia** `9.8236, 44.1024` → **Sarzana** `9.9600, 44.1120`: viabilita mista e vicinanza al confine dell'estratto.

### 10.2 I sei casi

**DC-1 — segmento ammesso da `hiking` ed escluso da `hiking_easy`.**
Segmento candidato: intervallo con `hike_rating >= 3` scoperto sulla Alta Via del Golfo o in Val d'Aosta. Tag OSM rilevanti: `highway=path`, `sac_scale=demanding_mountain_hiking` o superiore. Risultato atteso: `hiking` attraversa il segmento; `hiking_easy` lo evita, oppure restituisce un percorso piu lungo, oppure restituisce 400 perché non esiste alternativa. **PASS** se `hiking_easy` **non** percorre alcun arco con `hike_rating` sopra la soglia congelata, verificato leggendo `path_details.hike_rating` della sua risposta. **FAIL** solo se `hiking_easy` percorre un arco sopra soglia. Geometrie identiche sono **accettabili** solo se `path_details` dimostra che nessun arco del percorso supera la soglia.

**DC-2 — strada principale penalizzata da `mtb_touring`.**
Segmento candidato: tratto con `road_class == PRIMARY` o `SECONDARY` sul corridoio La Spezia → Sarzana, con almeno una parallela minore. Tag: `highway=primary` o `secondary`. Atteso: `mtb` ufficiale usa la principale, `mtb_touring` preferisce la parallela. **PASS** se la percentuale di lunghezza su `road_class` primaria o secondaria in `mtb_touring` e **inferiore** a quella di `mtb`, misurata su `path_details.road_class`. Geometrie identiche accettabili se non esiste parallela, il che va dimostrato mostrando che la deviazione piu breve supera un fattore ragionevole della lunghezza — in tal caso il caso si dichiara **non discriminante in quel corridoio** e si ripete altrove.

**DC-3 — trail con `mtb_rating` noto ammesso o favorito da `mtb_trail`.**
Segmento candidato: intervallo con `mtb_rating` fra 4 e 5 scoperto a Finale Ligure. Tag: `highway=path`, `mtb:scale=3` o `4`. Atteso: `mtb_touring` lo esclude (`mtb_rating > 3 → 0`); `mtb_trail` lo ammette. **PASS** se `mtb_trail` produce una route valida che attraversa il segmento **e** `mtb_touring` sullo stesso A'→B' o lo evita o restituisce 400. Con la soluzione A si attende inoltre che `mtb_trail` preferisca il trail a un aggiramento su strada; con la soluzione B basta l'ammissibilita. **FAIL** se `mtb_trail` non riesce ad attraversare un segmento entro le soglie ammesse.

**DC-4 — `surface` o `track_type` che modifica realmente il costo.**
Segmento candidato: bivio in cui due rami collegano gli stessi estremi con `surface` diversa (per esempio `asphalt` contro `gravel`) o `tracktype` diverso. Atteso: `mtb_touring`, che premia `GRAVEL` e `COMPACTED`, sceglie il ramo sterrato; `hiking` non ha preferenza di superficie e puo scegliere l'altro. **PASS** se la scelta di ramo cambia fra i due profili **oppure** se, a parita di ramo, il `weight` restituito differisce nella direzione attesa. Questo e l'unico caso in cui si accetta come prova una differenza di **costo** e non di geometria.

**DC-5 — accesso privato o vietato correttamente escluso.**
Segmento candidato: arco con `foot_road_access == PRIVATE` o `bike_road_access == PRIVATE` o `DESTINATION`, scoperto tramite `path_details.road_access`. Tag: `access=private`, `foot=no`, `bicycle=no`. Atteso: tutti e quattro i profili lo evitano o lo penalizzano fortemente, coerentemente con le regole verbatim di `hike.json` e `mtb.json`. **PASS** se nessun profilo instrada su un arco con accesso negato, e se gli archi `PRIVATE` compaiono solo quando non esiste alternativa. **FAIL** se un profilo instrada su accesso negato: sarebbe una regressione introdotta dai custom model applicativi, in particolare da `mtb_trail.json` standalone, dove i blocchi di accesso sono stati ricopiati a mano. **Questo caso e il controllo di sicurezza della soluzione A.**

**DC-6 — route equivalente ammessa quando non esiste alternativa significativa.**
Segmento candidato: corridoio urbano o costiero senza varieta di tagging, per esempio La Spezia centro su distanza breve. Atteso: due o piu profili restituiscono la **stessa** geometria. **PASS** se le geometrie coincidono **e** `path_details` dimostra che nel corridoio non esiste alcun arco con la proprieta discriminante. Questo caso esiste per rendere esplicito che l'identita di percorso e un esito legittimo e per impedire che un futuro operatore la interpreti come guasto.

### 10.3 Criterio generale sostitutivo

Il gate non chiede piu che i profili differiscano. Chiede che, **per ogni caso discriminante in cui la proprieta distintiva e presente nel corridoio**, il comportamento osservato sia quello previsto dalle regole del modello, verificato su `path_details` e non sulla forma della geometria. Dove la proprieta distintiva e assente, l'identita di percorso e PASS.

## 11. Misure

**Import** (A e B separatamente): durata wall-clock; picco di `WorkingSet64` e `PrivateMemorySize64` del processo java campionato ogni 5 s; CPU media e di picco; byte letti e scritti; dimensione del PBF; dimensione della elevation-cache prima e dopo; dimensione della graph-cache per sottodirectory, con il contributo CH scorporato in B; conteggio di WARN ed ERROR con i primi 20 messaggi distinti; pause GC rilevanti.

**Server**: tempo dal lancio alla prima risposta 200 su `/info`; heap a regime tramite il connettore admin 8990; working set; memoria mappata se rilevabile; handle e thread; stabilita dopo restart, con `import_date` invariato e latenze entro il 20% delle precedenti.

**Route**: latenza cold e warm; p50, p95 e massimo su almeno 50 ripetizioni per profilo; distanza e durata; numero di punti della geometria; presenza e varianza della quota; presenza dei `path_details`; esito su tutti i profili; comportamento con 10 richieste concorrenti. Su B, confronto diretto CH contro `ch.disable=true` per quantificare il guadagno.

**Copertura dati**: percentuale di lunghezza con `hike_rating > 0` sulle route escursionistiche e con `mtb_rating > 0` su quelle MTB (D4). E la misura che dice se i profili "facile" e "trail" hanno una base dati sufficiente.

Nessuna soglia arbitraria: i valori misurati sono la baseline. I gate sono funzionali o di completezza, con l'unica eccezione derivata dalla capacita VPS nota — 2532 MiB liberi, nessuno swap — contro cui vanno confrontate dimensione della cache B ed heap del server.

## 12. Artefatti, ambiente, comandi

Invariati rispetto alla revisione 1 salvo dove indicato.

**Artefatti pinnati.** GraphHopper `https://repo1.maven.org/maven2/com/graphhopper/graphhopper-web/11.0/graphhopper-web-11.0.jar` con sidecar `.sha1` e `.md5`. JDK Eclipse Temurin `jdk-21.0.11+10` x64 Windows ZIP da `https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.11%2B10/OpenJDK21U-jdk_x64_windows_hotspot_21.0.11_10.zip` con sidecar `.sha256.txt`; requisito ufficiale da `README.md` @11.0 e Java >= 17, la 21 LTS e scelta per parita con la `openjdk-21` disponibile sul VPS in vista di 1B. PBF `https://download.geofabrik.de/europe/italy/nord-ovest-260723.osm.pbf`, 584.910.653 byte, dati fino a 2026-07-23T20:22:05Z, con `.md5` allo stesso path. Nessun URL `latest`. Gli snapshot datati Geofabrik ruotano con retention di circa 90 giorni: lo script di download risolve il piu recente disponibile all'esecuzione e registra tutto in `reports/manifest.json`, che e la fonte di verita del PoC.

**Elevation.** Provider `cgiar` primario (`CGIARProvider.java`: tile 5x5 gradi, 6000x6000 px, download da `srtm.csi.cgiar.org`), `srtm` fallback (`SRTMProvider.java`, tile 1201x1201 da `srtm.kurviger.de`). Nessun checksum pubblicato per i tile DEM: la riproducibilita si ottiene **archiviando la elevation-cache** dopo l'import A, dopo di che B e gli import successivi sono offline rispetto al DEM. Attribuzione SRTM/CGIAR-CSI dovuta, da registrare. Connessione uscente a terze parti durante l'import A: scelta OPSEC consapevole e una tantum, non traffico di runtime. `deploy.md` segnala che l'elevation richiede un numero elevato di file aperti su Linux: irrilevante su Windows, ma da ricordare per 1B.

**Ambiente Windows: confermata l'opzione A, JDK portatile ZIP piu script PowerShell.** Invasivita nulla, nessun PATH o JAVA_HOME di sistema, build esatta verificabile con SHA-256, misura diretta e pulita del working set della JVM, cleanup con la cancellazione di una cartella, compatibilita con l'unico metodo di avvio documentato. JDK installato scartato per la dipendenza permanente; Docker Desktop scartato perché il backend WSL2 inquina la misura di memoria e perché le immagini community sono buildate da `master` e violano il vincolo di pinning; WSL2 scartato per lo stesso problema di misura e per il confine di filesystem che complicherebbe il packaging della cache verso il VPS.

**Directory PoC**, fuori dal repository GIS:

```
C:\Users\mrhz\Documents\AI\Tools\graphhopper-poc\
  bin\ jdk\ config\ custom-models\ data\
  elevation-cache\cgiar\
  graph-cache\diag-A\  graph-cache\nord-ovest-B\
  logs\ metrics\ scripts\ reports\
```

**Comando import** (A mostrato; B identico con `-Xms2g -Xmx8g` e `config-import-B.yml`):

```powershell
$PoC = 'C:\Users\mrhz\Documents\AI\Tools\graphhopper-poc'
$Java = Join-Path $PoC 'jdk\bin\java.exe'
$Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'

& $Java `
  '-Xms1g' '-Xmx4g' '-XX:+UseParallelGC' '-Dfile.encoding=UTF-8' `
  '-jar' (Join-Path $PoC 'bin\graphhopper-web-11.0.jar') `
  'import' (Join-Path $PoC 'config\config-import-A.yml') `
  *>&1 | Tee-Object -FilePath (Join-Path $PoC "logs\import-A-$Stamp.log")
```

`-XX:+UseParallelGC` e la raccomandazione di `deploy.md` per la fase di import. Tutti i percorsi stanno nel config: nessun `-D`, nessun quoting fragile. Heap non assunta a 8–12 GiB: A parte a `-Xmx4g`, B a `-Xmx8g`; metrica osservata il picco di working set; condizione di fallimento `OutOfMemoryError` o exit code non zero; secondo tentativo con raddoppio **una sola volta**, poi passaggio a `MMAP` con degrado registrato. Oltre 12 GiB non si va: la macchina ha ~14.1 GiB liberi e serve headroom off-heap.

**Comando server:**

```powershell
$Cache = Join-Path $PoC 'graph-cache\nord-ovest-B'
if (-not (Test-Path (Join-Path $Cache 'edges'))) { throw 'graph-cache assente: eseguire prima l''import' }

$p = Start-Process -FilePath $Java -PassThru -NoNewWindow `
  -ArgumentList @('-Xms512m','-Xmx2g','-Dfile.encoding=UTF-8',
                  '-jar', (Join-Path $PoC 'bin\graphhopper-web-11.0.jar'),
                  'server', (Join-Path $PoC 'config\config-server.yml')) `
  -RedirectStandardOutput (Join-Path $PoC 'logs\server-out.log') `
  -RedirectStandardError  (Join-Path $PoC 'logs\server-err.log')
$p.Id | Set-Content (Join-Path $PoC 'logs\server.pid')
```

Heap del server inferiore a quella di import, da tarare al ribasso sulla misura. **Protezione contro il re-import implicito**, necessaria perché `deploy.md` documenta che `server` esegue l'import se non gia fatto: precondizione `Test-Path` sui file del grafo; confronto di conteggio file e somma byte prima e dopo l'avvio; verifica che il log non contenga righe di lettura OSM e che `/info` riporti lo stesso `import_date` del run precedente.

**Lifecycle PowerShell.** Undici script `00`–`99` con exit code 0 PASS, 1 FAIL diagnosticato, 2 precondizione non soddisfatta; log in `logs\`, misure in `reports/measures.json`; nessuna modifica a PATH, JAVA_HOME, registro o servizi; nessun comando `git`; nessun accesso al VPS. `00-check-prerequisites`, `10-download-verify` (idempotente, salta i file gia verificati, vieta `latest`), `20-import -Variant A|B` (rifiuta di sovrascrivere una cache esistente senza `-Force`), `30-start-server`, `40-health-check` (verifica anche con `Get-NetTCPConnection` che i soli listener del PID siano `127.0.0.1:8989` e `127.0.0.1:8990`), `50-route-tests`, `60-benchmark`, `70-stop-server` (stop controllato, poi verifica che non resti alcun java sotto `graphhopper-poc\jdk`), `80-restart-without-import` (fallisce se `import_date` cambia o se la cache viene riscritta), `90-package-graph-cache` (zip con SHA-256, **nessun trasferimento**), `99-cleanup-poc` (rimozione selettiva, non tocca nulla fuori dal PoC).

## 13. Gate PASS INFRA-GH-1A

**Fase A — diagnosi**

1. Manifest completo: JAR con SHA-1 Maven verificato, JDK con SHA-256 Adoptium verificato, PBF datato con MD5 Geofabrik verificato.
2. **Import A diagnostico completato** con exit 0, con i soli profili ufficiali `hike` e `mtb`.
3. **Encoded values verificati tramite `/info`**: elenco reale registrato, mappatura intera di `hike_rating` e `mtb_rating` risolta, nomi enum di `surface`, `track_type`, `road_class`, `road_access`, `foot_network` congelati.
4. **Elevation reale verificata** (D2): terne di tre valori, terza componente variabile, `ascend` e `descend` presenti, `average_slope` non nullo, `/info` con `elevation: true`.
5. **Modelli ufficiali testati**: `hike` e `mtb` producono route valide su tutte le aree candidate, con `path_details` popolati.
6. **Custom model inline funzionante** (D5), oppure impossibilita accertata e registrata con il piano alternativo a piu import.
7. **Casi discriminanti identificati**: per ciascuno dei sei casi, segmento reale individuato e congelato in `reports/discriminanti.json`, oppure dichiarazione motivata di non applicabilita nell'estratto.
8. **Copertura del tagging misurata** (D4): percentuali `hike_rating > 0` e `mtb_rating > 0` registrate.

**Fase intermedia — decisioni basate sulle misure**

9. **Custom model applicativi definiti soltanto dopo le misure**: nessun file congelato prima che i gate 3, 4, 7 e 8 siano PASS. Ogni parametro senza fonte upstream elencato esplicitamente con il valore scelto.
10. **Decisione `mtb_trail`** fra soluzione A e soluzione B presa e motivata, con la mappatura di `mtb_rating` risolta e il rischio sicurezza per l'operatore documentato.
11. **Decisione CH/LM/flexible basata sulle misure**, con LM esclusa salvo requisito B2 documentato, e con la motivazione registrata.

**Fase B — definitivo**

12. **Import B definitivo completato** con exit 0, quattro profili applicativi congelati e le sole preparazioni decise al gate 11.
13. I quattro profili compaiono in `/info` di B.
14. **Casi discriminanti PASS** secondo i criteri di §10.2. **Nessun requisito che imponga geometrie diverse fra tutti i profili**: l'identita di percorso e PASS quando `path_details` dimostra assenza della proprieta discriminante nel corridoio.
15. **DC-5 PASS**: nessun profilo instrada su accesso negato. Gate di sicurezza obbligatorio per la soluzione A.
16. `/route` A→B e A→via→B PASS su tutti e quattro i profili.
17. `path_details` popolati su B per tutte le EV richieste, con CH attiva.
18. `algorithm=alternative_route` verificato con CH su B.
19. Outside-area, punto non raggiungibile, profilo inesistente e JSON malformato restituiscono 400 con corpo strutturato e senza stacktrace.
20. **`graph-cache` B riutilizzata senza re-import**: dopo un restart completo, `import_date` invariato e cache non riscritta.
21. **Verifica MMAP**: il server carica `nord-ovest-B` anche con `graph.dataaccess.default_type: MMAP` e serve `/route` correttamente. De-risca 1B a costo quasi nullo.
22. Bind esclusivo loopback: `Get-NetTCPConnection` mostra solo `127.0.0.1:8989` e `127.0.0.1:8990` per il PID del PoC.
23. Nessun processo java orfano dopo lo stop controllato.
24. Concorrenza a 10 richieste senza 500 e senza restart.

**Trasversali**

25. **CORS misurato empiricamente** dalle tre origini (`localhost:8000`, `100.114.7.53:8000`, `file://`) su Chromium ed Edge, con gli header effettivamente ricevuti registrati verbatim e l'esito Private Network Access documentato. Il gate **non richiede** che il CORS nativo basti: richiede una **decisione motivata** su cosa serve prima di B2.
26. `reports/measures.json` completo per import A, import B, server e route.
27. Config e custom model archiviati, versionati e riproducibili; archivio della cache B con SHA-256.
28. Dimensione della cache B ed heap del server confrontate con il budget VPS, con esito PASS oppure eccezione documentata e piano di degrado.
29. `git status --short` nel repo GIS vuoto a fine PoC.
30. Nessuna connessione al VPS eseguita durante 1A.

## 14. Rischi residui

1. **Modifica di un custom model uguale re-import completo** (`deploy.md` verbatim). Mitigato dalla taratura inline sull'import A, ma dopo l'import B ogni ritocco costa un import.
2. **Mappatura `mtb_rating` non risolta** finché D1 non e eseguito: e la condizione bloccante della soluzione A per `mtb_trail`. Se irrisolvibile, si ripiega su B.
3. **Rischio sicurezza del profilo `mtb_trail`**: rimuovendo la penalita ufficiale sui trail tecnici, il router puo instradare su S4–S5. Aggravato dalla copertura parziale del tagging e dal fatto che `mtb:scale` non descrive l'esposizione. Richiede etichettatura "esperto" e avvertenza nel futuro bundle B2, e non deve essere il profilo di default.
4. **Copertura del tagging `sac_scale` e `mtb:scale`** disomogenea: dove manca, i rating valgono 0 e i filtri non proteggono. Misurata da D4, non risolvibile in 1A.
5. **`custom_model` inline potrebbe non comportarsi come documentato** sulla build reale: D5 lo verifica prima di costruirci sopra il metodo di taratura.
6. **Private Network Access dei browser** verso loopback dall'origine tailnet: rischio concreto e potenzialmente decisivo per l'architettura di B2. Gli header CORS ci sono, ma PNA e un meccanismo distinto e `CORSFilter` non emette `Access-Control-Allow-Private-Network`.
7. **Assenza di `Access-Control-Max-Age`**: ogni POST JSON genera una preflight. Su loopback il costo e trascurabile, ma va noto a B2.
8. **Status della preflight OPTIONS non deducibile dal codice**: `CORSFilter` non conclude la richiesta, la passa a valle. Solo il test empirico lo stabilisce.
9. **Disponibilita di `srtm.csi.cgiar.org`** storicamente intermittente. Fallback su `srtm`, ma un cambio di provider impone il re-import.
10. **Rotazione degli snapshot Geofabrik**: mitigata dal manifest e dalla conservazione locale del PBF.
11. **Re-import implicito all'avvio del server**: documentato in `deploy.md`, coperto dai tre controlli di §12.
12. **Porta admin 8990** dimenticata: coperta dal gate 22.
13. **Compatibilita della graph-cache** legata alla versione esatta di GraphHopper: il VPS in 1B dovra eseguire esattamente 11.0 con lo stesso JAR e checksum.
14. **Interoperabilita `RAM_STORE` / `MMAP`** sulla stessa cache non ancora dimostrata: gate 21.
15. **Ryzen non always-on**: l'endpoint locale esiste solo a macchina accesa. Limite noto e accettato, ed e la ragione stessa di 1B.
16. **Errore di trascrizione in `mtb_trail.json` standalone**: avendo ricopiato a mano i blocchi di accesso da `mtb.json`, una svista aprirebbe un percorso vietato. DC-5 e il controllo che intercetta questo caso; va eseguito prima di considerare il profilo utilizzabile.
17. **Egress verso terze parti** durante l'import (Maven, GitHub, Geofabrik, CGIAR): scelta consapevole, una tantum, da registrare.

## 15. Stime

**Durata import.** Stime, non misure. Import A, nessuna preparazione, elevation al primo giro con download DEM: 20–40 minuti, dominato dal DEM. Import A ripetuto con cache DEM calda: 10–20 minuti. Import B, CH x4 senza turn costs, cache DEM calda: 45–120 minuti. Rispetto alla revisione 1 la stima di B scende, perché LM e stata esclusa. Se B supera 3 ore si applica il degrado di §9.4.

**Spazio disco.** JDK ~330 MB, JAR ~50 MB, PBF ~560 MB, elevation-cache 0.2–1.0 GB, cache A 1.0–2.0 GB, cache B con CH x4 2.5–5.0 GB, log e report e zip 0.5–6 GB con duplicazione temporanea durante il packaging. **Totale 5–10 GiB** in regime, picco fino a ~15 GiB, su ~112 GiB liberi. La voce da sorvegliare resta la cache B, perché e quella destinata al VPS.

**Dimensione della futura work-unit.** Undici script PowerShell per ~900–1500 righe; tre `config-*.yml` per ~360 righe; tre o quattro custom model JSON per ~80 righe; harness CORS ~120 righe. **Totale ~1500–2100 righe, tutte fuori dal repository GIS.** Zero righe nel monolite. Diff nel repo `cursor-coordinate-converter`: **zero**, salvo la decisione opzionale di §17.5, che varrebbe ~100–180 righe di sola documentazione.

## 16. Relazione con OUTDOOR-ROUTING-GH-B2 ed elementi rinviati a 1B

B2 resta BLOCKED e non viene implementato in 1A. Il report finale del PoC consegna a B2: URL loopback `http://127.0.0.1:8989` con i path `/info` e `/route`; metodo POST con body JSON per `/route` e GET per `/info`; schema richiesta verificato, con l'ordine **`[lon, lat]`** evidenziato come trappola rispetto al `[lat, lon]` usato ovunque nel monolite; schema risposta verificato; nomi esatti dei quattro profili; `path_details` disponibili; formato della terza componente per l'elevation; esito CORS per ciascuna delle tre origini e soluzione necessaria se serve; timeout osservati come base per il timeout client; errori con status e struttura per il mapping i18n; comportamento outside-area; capacita concorrente come base per generation token e `AbortController`; nota che `mtb_trail` va etichettato come profilo esperto. Modalita Online/gateway fuori scope. Geocoding multi-riga fuori scope.

Rinviati a **INFRA-GH-1B**: trasferimento della graph-cache sul VPS; installazione JVM sul VPS; unit systemd; `MemoryMax`; adozione di `MMAP` in produzione; benchmark random-read sul disco VPS; ACL Tailscale; bind sulla tailnet; CORS o reverse proxy lato VPS; nginx; firewall; monitoraggio; auto-start al boot; verifica di non-regressione su n8n e sul proxy Navionics; deploy produttivo; modalita provider "VPS tramite Tailscale" nel monolite. **`MemoryMax` non va fissato** prima delle misure 1A e 1B.

## 17. Decisioni ancora aperte

Nessuna impedisce l'avvio. Cinque si risolvono all'esecuzione, con criterio gia definito:

1. Build Temurin esatta: si pinna quella disponibile al download e la si registra nel manifest.
2. Snapshot PBF datato esatto: idem.
3. Mappatura intera di `hike_rating` e `mtb_rating` e nomi enum: risolti da D1. Da questa dipende la scelta fra soluzione A e B per `mtb_trail`.
4. Valori definitivi dei parametri PoC senza fonte upstream (`hike_rating > 2`, `max_slope > 25`, `average_slope > 12`, i moltiplicatori degli overlay, il tetto di 8 km/h in `mtb_trail`): tarati in §7.2 punto 5.
5. Se il repo GIS debba ricevere una WU documentale per 1A oppure se 1A resti interamente fuori dal repo: **decisione dell'operatore**, non tecnica.

Aperto e non risolvibile qui: la **review GLM** non e allegata al contesto, quindi non e possibile una correzione punto-per-punto di quel documento. In sostituzione sono state applicate e verificate una per una le "correzioni tecniche vincolanti" ricevute — `graph.flag_encoders`, `prepare.ch.weightings`, `prepare.ch.edge_based`, `server.host`, `graphhopper.cors.allowed_origins` non esistono in 11.0 e non sono usate; le chiavi sotto `graphhopper:` non ripetono il prefisso — piu le quattro correzioni sostanziali di questa revisione 2 (CORS, `hike.json`, `mtb_trail`, CH/LM).

## 18. Esito

**GO INFRA-GH-1A.**

Le fonti sono verificate al tag 11.0, gli artefatti sono pinnabili con checksum ufficiale, la separazione fra import diagnostico e import definitivo elimina il rischio di congelare modelli non verificati, i casi discriminanti sostituiscono un gate che avrebbe prodotto falsi FAIL, la strategia di preparazione e ridotta al minimo giustificato, il perimetro resta isolato dal repository e dal VPS. L'unico blocco e documentale e parziale (review GLM non allegata) e non impedisce l'esecuzione.


---

## Stato esecuzione (aggiornato 2026-07-27)

### Fase A — PASS (2026-07-25/26)

- Report: `reports\INFRA-GH-1A-PHASE-A-REPORT.md`
- **QA CORS operatore:** «**QA CORS INFRA-GH-1A PASS operatore**» (2026-07-26)

### FREEZE-B — PASS (2026-07-27)

- Tre custom model congelati: `hiking_easy.json`, `mtb_touring.json`, `mtb_trail.json` (Soluzione A)
- Report: `reports\INFRA-GH-1A-FREEZE-B-REPORT.md`

### Import B — PASS (2026-07-27)

- Cache `nord-ovest-B`: 16 file, 790681035 byte, 4 profili, CH×4, elevation
- `import_date=2026-07-27T01:04:53Z`; diag-A preservata
- Report: `reports\INFRA-GH-1A-IMPORT-B-REPORT.md`

### MMAP smoke locale — PASS (2026-07-27)

- Cache RAM_STORE compatibile con serving MMAP; no reimport
- Report: `reports\INFRA-GH-1B-MMAP-SMOKE-LOCAL-REPORT.md`

### INFRA-GH-1B WRITE — PASS (2026-07-27)

- Servizio `goi-graphhopper.service`; endpoint `http://100.114.7.53:8989`; soak 30 min PASS
- Report: `reports\INFRA-GH-1B-WRITE-REPORT.md`, `INFRA-GH-1B-WRITE-SOAK.json`
- Dettaglio VPS: [`INFRA_VPS.md`](../INFRA_VPS.md)

### GIS monolite

- **Non modificato** dai blocchi infra — tip `ff43878`, build 59, blob `db0d669…`

### Prossimo (runtime GIS, non infra)

- **OUTDOOR-ROUTING-GH-B2** — READY / NEXT RUNTIME BUNDLE (endpoint resolution + POST `/route` + preview)

---

## Chiusura INFRA-GH-1A + INFRA-GH-1B (registrazione docs 2026-07-27)

**Stato WU:** **CLOSED / PASS end-to-end**. Obiettivi del piano raggiunti:

- PoC locale completo (Import B, profili congelati, cache trasferibile)
- Endpoint VPS Tailscale operativo con collaudo soak
- Contratto API verificato per B2 (`/info`, POST `/route`, CORS, errori)
- Repository GIS monolite invariato; **B2 non implementato**

**Stato corrente di questa WU:** **CLOSED / PASS end-to-end** — vedi anche OM §7 e [`HANDOFF.md`](../HANDOFF.md).

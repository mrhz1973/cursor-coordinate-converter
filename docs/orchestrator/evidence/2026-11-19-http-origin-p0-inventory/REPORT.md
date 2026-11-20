# P0 — Local Storage e IndexedDB HTTP verificati; inventario HTTPS in attesa

Data registrazione: 19/11/2026 20:38:41 Europe/Rome.
Aggiornamento: 20/11/2026; ricevuta IndexedDB reale verificata alle 12:39 Europe/Rome, preparazione HTTPS e risposta neutra attestata da GET nativo. Payload personali conservati sul PC.
BLOCK: GIS-HTTP-ORIGIN-INVENTORY-P0. Tipo: audit non distruttivo, nessun bundle runtime.
**Esito corrente: HTTP_LOCALSTORAGE_AND_IDB_VERIFIED / HTTPS_INVENTORY_PENDING / ORIGIN_BACKUP_PENDING. File e copie locali HTTP verificati nei due perimetri LOCALSTORAGE_ONLY e INDEXEDDB_TILES_ONLY. Non costituiscono uno snapshot atomico né un backup completo dell’origine. HTTPS, contenitori residui e confronto restano PENDING; P0 resta APERTO.**

## Mandato e fonte viva

L'operatore ha richiesto «continua» dopo la chiusura P3. origin/main verificato a 6dbcd7732e1d88d3de733b7a6b9c53b007d46516; FRONTIER indica P0 come prossimo residuo distinto. README AI-BOOT e OM §4 erano già acquisiti nella stessa chat: refresh mirato, WU N/A. Il [backlog P0](../../backlog/2026-11-16-operatore-tracce-tabelle-quote-url.md) richiede inventario, backup verificato e confronto fra le due origini prima di qualsiasi pulizia; il servizio HTTP tecnico va conservato.

URL operativo da usare: https://ionos-n8n-new.tailc01234.ts.net/gis?v=ed760bbd. L'origine HTTP tecnica rimane documentata per questo confronto e per l'infrastruttura.

## IndexedDB HTTP verificato — 20 novembre 2026

[Ricevuta reale](http-indexeddb-verification.json), già acquisita tramite TMAR: snapshot **11:34:39.385 UTC**, verifica **11:39:51.041 UTC** (12:39 Europe/Rome). CoordConvMapTiles v1, store tiles: **1.028 record**, **16.012.203 byte binari**; file JSON **21.511.025 byte**, SHA256 `a1f72fd84a9f7f49cb0e0e9cbc023e813841388192f5ccda56b2b34d81919056`. Dimensione/hash globale, schema, chiavi univoche, Base64 canonico, lunghezza/SHA256 di ogni binario e totali: PASS. Copia locale non sovrascrivente riletta byte per byte: PASS; nessuna nuova prova ripetuta per registrare questa ricevuta.

Cartella: `C:\Users\mrhz\AppData\Local\TMAR-GIS\Backups\P0-20261120T113439385Z-HTTP-IndexedDB`. Ricevuta locale `verification.json`, SHA256 `e7be9711dd3d3d5d4c9357017486c8a57e31efdada6f47924403af378ffe2a11`. Sorgente e payload rimasti sul PC; qui soltanto metadati.

**I due snapshot HTTP sono distinti:** Local Storage alle **02:21:03.176 UTC**, IndexedDB alle **11:34:39.385 UTC**. Non attestano atomicità fra contenitori né assenza di modifiche successive nel browser. Coperture limitate ai due export; `completeOriginBackup:false` e confronto HTTPS `NOT_PERFORMED`.

## Preparazione HTTPS — esecuzione personale ancora NOT_PERFORMED

[Export HTTPS](export-https-localstorage.console.js), SHA256 `0b22d441474a38fe23df61315ad737cf0e0239f161daa5bb04af9a44ed808910`; [verificatore HTTPS](verify-https-localstorage-backup.cjs), SHA256 `22f6a591933a9218ccdd83f59070cd9b9186c7a48b625da53b5f4d9a5360274a`. Guard esclusivo dell’origine HTTPS, schema V1 e copertura LOCALSTORAGE_ONLY invariati; tutte le coppie raw conservate anche con zero chiavi o chiave principale assente, con presenza di quest’ultima indicata separatamente.

Verifiche sintetiche del solo delta: **3 gruppi exporter PASS** (HTTPS con chiavi, HTTPS vuoto/main assente, origine HTTP respinta) e **3 gruppi verifier PASS** (HTTPS con chiavi; vuoto/assenza distinti da zero record; configurazione/nome/payload HTTP respinti prima della copia), senza valori privati nell’output. Review statica indipendente dei soli delta HTTPS PASS. SHA qualificata invariata, sue prove non ripetute. [Metadati e risultati](inventory-metadata.json).

Comando preparato e hash verificato nativamente: `C:\Users\mrhz\AppData\Local\TMAR-GIS\P0-Aiuto-20261120\P0-HTTPS-LocalStorage-Comando.txt`, **4.173 byte**, stesso SHA256 dell’export. Il file contiene soltanto codice: nessuna esecuzione nel browser o apertura di Notepad attestata in questo aggiornamento; download/backup HTTPS non acquisiti.

### Accesso HTTPS: risposta nativa attestata, contesto personale da attestare

GET mirato su `https://ionos-n8n-new.tailc01234.ts.net/gis/__tmar_p0_inventory__`: **HTTP404**, `application/json`, **45 byte**, nessun redirect, script/risorsa, Set-Cookie o Clear-Site-Data; SHA256 corpo `ff8de22dcfc848726255ab059ff25aeb8c957768999e90ebddb99360077b9261`, controllo **11:47:00.968 UTC**. Nessuna modifica server. Il primo risultato GET è stato perso per troncamento e non usato come evidenza; un solo recupero mirato ha salvato questi metadati. Il requestCount1 della ricevuta riguarda il recupero, non l’intera sequenza.

Aprire l’indirizzo in **una nuova scheda dello stesso browser/profilo**: la risposta404 JSON è attesa. **Se compare l’applicazione GIS o un altro avviso, STOP.** La verifica nativa attesta la risposta del server; origine e contesto del browser personale restano da attestare tramite operatore/guard. Eventuali residui Service Worker non sono esclusi. Nessun contenuto HTTPS del profilo è stato acquisito.

## Storico: catalogo IndexedDB HTTP e preparazione prima dell’esecuzione reale — 20 novembre 2026

Output riferito dall’operatore, con acquisitoUTC 2026-11-20T03:22:30.769Z (04:22 Europe/Rome):

```json
{"origine":"http://100.99.54.93:8000","copertura":"IDB_CATALOGO_ONLY","numeroDatabase":1,"databaseAtteso":"CoordConvMapTiles","attesoPresente":true,"attesoVersione":1,"altriDatabase":0,"apertureDatabase":0,"esito":"ELENCO_DATABASE_OK","acquisitoUTC":"2026-11-20T03:22:30.769Z"}
```

Attesta solo il catalogo in quel momento: **un solo database, CoordConvMapTiles versione1**. Nessuna apertura del DB o lettura delle tile in questa ricevuta; conteggio record, schema effettivo degli store e integrità non acquisiti. Le righe GET con URL redatti non sono una misura delle tile memorizzate.

Per ridurre i passaggi manuali, [un solo comando](export-indexeddb.console.js) esegue il prossimo controllo di schema/conteggi e, se conforme, prepara l’export locale. Il guard aggiorna il catalogo prima dell’apertura, usa esclusivamente la versione1 ed abortisce sincronicamente ogni evento di upgrade/creazione; handler tardivi mantenuti per chiudere eventuali connessioni dopo timeout. Schema ammesso dal runtime qualificato: solo store tiles, keyPath null, autoIncrement false, nessun indice. Ogni valore deve contenere esattamente b:ArrayBuffer e ct:string; chiave stringa. Differenze causano STOP senza saltare o troncare record.

Count e cursore sono nella stessa transazione readonly. L’export avviene soltanto dopo oncomplete, cursore esaurito e conteggi coincidenti, con connessione chiusa. File JSON con chiave/MIME originali, binario Base64, lunghezza e SHA256 di ogni ArrayBuffer; hash globale sugli stessi byte UTF-8 del Blob. Limiti dichiarati:150.000 record,64MiB binari,4MiB di byte UTF-16 per chiavi/MIME,60secondi; superamento=STOP, mai backup parziale presentato come completo. Copertura INDEXEDDB_TILES_ONLY. Questi limiti non sono una misura del database personale.

Il [verificatore locale](verify-indexeddb-backup.cjs) controllerà dimensione/hash globale/schema, conteggi, unicità, Base64 canonico, lunghezza/SHA di ogni binario e totali; copia non sovrascrivente, rilettura e ricevuta con soli metadati. Codice e ricevute non promuovono la copertura a backup completo dell’origine.

[Validazione](indexeddb-helper-validation.json): review statica indipendente dei due helper PASS;14 controlli sintetici del verificatore PASS. Nuovo Edge headless con profilo temporaneo separato, documento servito tramite intercettazione locale e zero richieste inoltrate:4 casi PASS (export reale di4 tile sintetiche/65.593 byte binari con verifica Node e sorgente invariata; schema inatteso; valore inatteso; cancellazione simulata fra catalogo e apertura con upgrade abortito e DB non ricreato). Nessun runtime GIS caricato o profilo personale usato. Funzione SHA256 già qualificata riutilizzata identica, senza ripetere le sue prove.

**Esecuzione sul database personale e download IndexedDB: NOT_PERFORMED / NOT_STARTED.** Nessun conteggio tile reale, backup IDB o acquisizione HTTPS dedotti dalle fixture.

Comando preparato sul PC come `C:\Users\mrhz\AppData\Local\TMAR-GIS\P0-Aiuto-20261120\P0-HTTP-IDB-Comando.txt`: 9.794 byte, SHA256 `11b29c29b073d3943a633848c98e7165278fb0e984399bc7311b61e7bd3f8826`, rilettura identica all’helper revisionato e provato. Il file contiene soltanto codice; la preparazione non esegue l’export e non legge dati personali.

### Accesso operativo disponibile

TMAR esegue file, processi, verifiche e copie locali;25 strumenti esposti, nessun comando dedicato a schede/UI. La connessione Browser personale resta indisponibile. Il controllo read-only ha osservato22 processi Edge e zero righe comando ispezionabili: non dimostra l’assenza di un endpoint debugging, che resta non determinato. Nessun riavvio, modifica delle protezioni o del profilo. I test headless usano una nuova istanza isolata e non costituiscono accesso alla scheda personale. Il solo avvio del comando nel contesto GIS corrente richiede quindi l’operatore; verifica del file successiva tramite TMAR.

## Backup Local Storage HTTP verificato — 20 novembre 2026, 03:25 Europe/Rome

L’operatore ha eseguito lo snippet e ricevuto `DOWNLOAD_AVVIATO`: file `TMAR-GIS-P0-HTTP-localStorage-20261120T022103176Z.json`, **36.618 byte**, **2 chiavi**, SHA256 **7811e2250e1b18e9651f0cd4467b79eb5a4f0511c8fc1e1602f144081db56a95**. L’avviso del browser segnala l’origine HTTP del Blob; non è stato trattato come prova di riuscita o fallimento del salvataggio e non sono state modificate protezioni del browser. I messaggi GET con URL redatti nel log operatore non sono stati attribuiti allo snippet, che non contiene richieste di rete.

TMAR ha individuato il file nella cartella Downloads, senza file .crdownload, e ha eseguito il [verificatore locale](verify-localstorage-backup.cjs). Lettura del file con dimensione/stabilità/hash, schema/origine/data, coppie stringa/stringa univoche e ordinate, conteggi e unità UTF-16: **PASS**. Copia non sovrascrivente nella cartella seguente, rilettura byte per byte e confronto dello stesso SHA256: **PASS**.

```text
C:\Users\mrhz\AppData\Local\TMAR-GIS\Backups\P0-20261120T022103176Z-HTTP-localStorage
```

La cartella conserva il JSON e `verification.json`; la ricevuta ha SHA256 `2307c79a3e81b32f88fa36e38014df5306cd2dcf24e23b3fc966bf11b07fa6e7`. [Metadati verificati](http-localstorage-verification.json), acquisizione 02:21:03.176 UTC, verifica 02:25:39.619 UTC del 20 novembre. Il payload resta sul PC; qui sono pubblicati soltanto metadati ed esiti.

Dal file verificato: `coordconv_v2` contiene 30.908 unità UTF-16 e JSON con radice oggetto valida; 1 traccia salvata, 200 waypoint, 0 poligoni e impostazioni presenti. La chiave UI `coordconv_ui_v1` è inclusa; la chiave legacy `coordconv_v1` non è presente nel set acquisito. Nessuna ricostruzione o scrittura delle sorgenti; originale nella cartella Downloads conservato.

[Verifiche del verificatore](verify-localstorage-backup-validation.json): sorgente sintetica preservata, hash errato respinto prima della copia, destinazione esistente divergente preservata, rilettura della copia esatta e nessun valore privato nello stdout. Finding di review corretto prima dell’esecuzione reale: una ricevuta preesistente viene accettata soltanto se coincide integralmente con quella ricostruita dai risultati correnti, con il solo timestamp ISO validato preservato; proprietà extra o copertura alterata causano STOP. Test mirato PASS e revisione statica finale PASS.

**Questo PASS qualifica esclusivamente LOCALSTORAGE_ONLY dell’origine HTTP.** Non attesta un backup completo dell’origine, tile/IndexedDB, memoria non persistita dell’app, dati HTTPS o confronto tra origini. La doppia lettura dello snippet non viene presentata come transazione atomica su tutti i contenitori.

## Lettura e preparazione precedenti all’export — 20 novembre 2026

La copia manuale di `082968.ldb` tramite Esplora file ha restituito anch’essa accesso negato, documentato dallo screenshot operatore. La prova fisica è conclusa; nessuna modifica dei permessi, elevazione o chiusura del browser. Causa del diniego non determinata.

L’operatore ha poi verificato `location.origin` nella scheda GIS e ha eseguito una IIFE di sola lettura della chiave `coordconv_v2`, con guard sull’origine e distinzione fra chiave assente, lettura negata, JSON/radice invalidi e raccolte non-array. Output ricevuto:

```json
{"origine":"http://100.99.54.93:8000","esito":"LETTURA_OK","caratteri":30908,"tracceSalvate":1,"waypoint":200,"poligoni":0,"impostazioni":"PRESENTI"}
```

`caratteri` indica unità UTF-16 del valore grezzo, non byte. I conteggi riguardano soltanto lo stato persistito in questa chiave: **1 traccia salvata, 200 waypoint, 0 poligoni e oggetto impostazioni presente**. Non sono un inventario dello stato ancora in memoria, delle altre chiavi o della cache; non dimostrano unicità o duplicazione rispetto a HTTPS. La lettura è attestata dall’operatore, non da una sessione Browser automatizzata; il collegamento al profilo fisico Default non è stato verificato programmaticamente in questa fase.

Preparato [export Local Storage HTTP](export-localstorage.console.js): tutte le coppie stringa/stringa dell’origine esatta, valori grezzi preservati, doppia lettura coincidente, UTF-8 e SHA256 sugli stessi byte del Blob, nome file univoco. Nessuna scrittura nello storage, richiesta di rete o uso della clipboard. Output limitato a metadati e `DOWNLOAD_AVVIATO`; nessun PASS di salvataggio dedotto. Copertura dichiarata `LOCALSTORAGE_ONLY`.

[Verifica offline](export-localstorage-validation.json): revisione statica indipendente PASS; SHA256 confrontato con Node crypto su 19 lunghezze, inclusi confini di blocco e input da 1 MiB; roundtrip esatto di fixture sintetiche con Unicode, surrogate isolate, chiavi speciali e valori JSON non validi; 6 scenari fail-closed; zero tentativi di scrittura sorgente. Nessun dato personale usato nelle verifiche. **Snippet non ancora eseguito nel browser; nessun download acquisito o backup verificato in questo aggiornamento.**

## Inventario fisico acquisito — 19 novembre 2026

Sul PC **AsusDesktop**, il profilo **Microsoft Edge / Default** risulta `lastUsed=true` e `lastActive=true` nei metadati Local State. Sono presenti entrambe le directory IndexedDB delle origini richieste. Non è stato acquisito il contesto della scheda GIS attualmente aperta: questa evidenza identifica il profilo segnato attivo e gli archivi esistenti, non una nuova osservazione dell'applicazione in uso.

| Contenitore | File | Byte fisici | Ambito e limite |
| --- | ---: | ---: | --- |
| IndexedDB HTTP `http_100.99.54.93_8000.indexeddb.leveldb` | 14 | 15.214.423 | Directory dell'origine HTTP; record attivi non contati. |
| IndexedDB HTTPS `https_ionos-n8n-new.tailc01234.ts.net_0.indexeddb.leveldb` | 10 | 8.043.119 | Directory dell'origine HTTPS; record attivi non contati. |
| Local Storage LevelDB condiviso | 26 | 43.590.705 | Intero profilo Edge/Default, non soltanto GIS. Chiavi delle due origini non enumerate. |

Sono presenti anche contenitori CacheStorage, Service Worker Database, WebStorage/QuotaManager e File System/Origins. Non è stata accertata la loro attribuzione alle due origini: non sono dichiarati vuoti o estranei. Dimensione diversa delle directory HTTP/HTTPS non dimostra dati GIS unici, duplicati o perduti.

## Tentativo di backup fisico e blocco verificato — 19 novembre 2026

Predisposta una copia locale con confronto del set file e degli SHA256 prima/copia/dopo, senza chiudere Edge o scrivere nelle sorgenti. Il tentativo si è fermato durante la lettura iniziale di `Local Storage/leveldb/082968.ldb`, **prima della fase di copia**:

```text
EPERM: operation not permitted, open .../Local Storage/leveldb/082968.ldb
```

La diagnosi successiva con apertura esplicitamente in sola lettura e condivisione ReadWrite/Delete ha restituito **Win32 5 / HRESULT -2147024891: Accesso negato**. Non è il codice32 di condivisione/file in uso. File proprietario dell'utente corrente; token non amministrativo. La causa precisa del diniego non è stata determinata e non viene attribuita automaticamente al browser aperto o alla necessità di privilegi amministrativi. Nessuna modifica ACL, elevazione, arresto del browser o tentativo di aggirare la restrizione.

Cartella locale del tentativo:

```text
C:\Users\mrhz\AppData\Local\TMAR-GIS\Backups\P0-20261119T193419439Z-678f68
```

Contiene la ricevuta `physical-capture-manifest.json` con stato **INCOMPLETE**, zero sorgenti copiate e SHA256 `a6949c820242e6d11b0694b1250745b44605c57da4d48f5eb0ef5d7e7f7fb692`. **Non è un backup utilizzabile dei dati del sito.** Nessun payload geografico è stato trasferito nel workspace cloud o pubblicato su GitHub.

Anche lo strumento Browser ha restituito indisponibilità del contesto d'origine della connessione: `Browser access requires the originating browser context`. Un browser cloud separato non avrebbe accesso a questi archivi locali e non è stato usato come sostituto.

[Metadati, ricevuta del tentativo e diagnosi](inventory-metadata.json). I conteggi logici mancanti sono `null`/NOT_ACQUIRED, non zero.

## Copertura dei backup applicativi: verifica del solo codice

La ricognizione mirata del [runtime qualificato](https://github.com/mrhz1973/cursor-coordinate-converter/blob/aff215323c97a309cbd5c6c7e0c694d35dd45ad0/coordinate_converter%20Claude.html), source `aff215323c97a309cbd5c6c7e0c694d35dd45ad0`, blob `4578788467822123ea7ad7e929d3bdf0e262b1a8`, identifica:

- `coordconv_v2`: stato GIS principale, inclusi savedTracks e addon altimetrici, mapWaypoints, gisPolygons, impostazioni, preferiti, cronologia e metadati aree offline; `loadStore`/`saveStore`.
- `coordconv_ui_v1`: layout dei pannelli; `loadUiState`/`saveUiState`. `coordconv_v1` è una chiave legacy da preservare se presente.
- IndexedDB `CoordConvMapTiles`, versione1, store `tiles`: chiave tile e valore binario ArrayBuffer più MIME. `getTileDB()` può creare un DB assente: non è stato invocato per l'inventario.
- L'export Sessione JSON (`getSessionExportObject`/`exportSessionFile`) omette tracce salvate, waypoint, poligoni, layout UI e tile. Mission Package, GPX/KML/GeoJSON e JPG offline non equivalgono a un ripristino integrale dello stato e della cache.

Questa mappa è una proprietà del codice, **non** un'enumerazione dei dati effettivamente presenti nel profilo personale. I backup runtime presenti sul VPS non coprono gli archivi del browser.

## Gate successivo e limiti

Local Storage e IndexedDB HTTP sono verificati nei rispettivi snapshot e perimetri. Prossimo passo: aprire la risposta neutra HTTPS nella nuova scheda dello stesso browser/profilo e attestare l’origine effettiva; STOP se compare GIS o un altro avviso. Eseguire poi l’export Local Storage HTTPS preparato e far verificare a TMAR il file realmente scritto e la copia. Zero chiavi o main assente restano casi espliciti, non prove di zero record nelle raccolte mancanti. Contenitori residui, IndexedDB HTTPS e confronto restano da acquisire; nessuna migrazione/pulizia. Non ripetere gli export HTTP già verificati senza un cambiamento concreto. Solo metadati nei rapporti, payload personali sul PC.

**Migrazione e pulizia restano bloccate.** Non inferire che HTTP sia vuoto o duplicato. Nessun dato del sito, collegamento browser, servizio HTTP o backup è stato cancellato. P3/Build317 resta CLOSED con il PASS operatore già ricevuto; runtime invariato, nessun deploy o nuova QA. DTM5/10m HOLD, mobile PAUSA, P4 SOLO FUTURO.

Finding di metodo nella ricognizione offline: una ricerca iniziale troppo ampia ha intercettato una riga cartografica embedded e prodotto troncamento; contenuto estraneo ignorato, successive ricerche limitate a simboli/range. Nessun dato personale era coinvolto.

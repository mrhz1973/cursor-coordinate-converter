# P0 — HTTP Local Storage leggibile; backup completo e confronto in attesa

Data registrazione: 19/11/2026 20:38:41 Europe/Rome.
Aggiornamento: 20/11/2026 Europe/Rome; nuovo esito console riferito dall’operatore, senza payload personali.
BLOCK: GIS-HTTP-ORIGIN-INVENTORY-P0. Tipo: audit non distruttivo, nessun bundle runtime.
**Esito corrente: HTTP_LOCALSTORAGE_PARTIAL / BACKUP_PENDING. Acquisiti conteggi della sola chiave HTTP coordconv_v2 tramite console operatore. Backup completo non acquisito/verificato; confronto HTTP/HTTPS non eseguito. P0 resta APERTO.**

## Mandato e fonte viva

L'operatore ha richiesto «continua» dopo la chiusura P3. origin/main verificato a 6dbcd7732e1d88d3de733b7a6b9c53b007d46516; FRONTIER indica P0 come prossimo residuo distinto. README AI-BOOT e OM §4 erano già acquisiti nella stessa chat: refresh mirato, WU N/A. Il [backlog P0](../../backlog/2026-11-16-operatore-tracce-tabelle-quote-url.md) richiede inventario, backup verificato e confronto fra le due origini prima di qualsiasi pulizia; il servizio HTTP tecnico va conservato.

URL operativo da usare: https://ionos-n8n-new.tailc01234.ts.net/gis?v=ed760bbd. L'origine HTTP tecnica rimane documentata per questo confronto e per l'infrastruttura.

## Aggiornamento operativo — 20 novembre 2026

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

La lettura manuale HTTP è ora disponibile. Prossimo passo: eseguire lo snippet di export Local Storage nella stessa scheda e verificare il file effettivamente scritto sul PC per dimensione, SHA256, schema/origine, coppie stringa/stringa univoche e numero di chiavi. Verificare anche l’eventuale copia nella cartella di backup. L’esito potrà qualificare soltanto LOCALSTORAGE_ONLY; IndexedDB/binari, eventuali altri contenitori, acquisizione HTTPS e confronto restano gate distinti. Enumerare senza mutazioni e distinguere record identici, unici, divergenti o non interpretabili. Solo metadati e risultati aggregati nei rapporti condivisi; payload personali conservati localmente.

**Migrazione e pulizia restano bloccate.** Non inferire che HTTP sia vuoto o duplicato. Nessun dato del sito, collegamento browser, servizio HTTP o backup è stato cancellato. P3/Build317 resta CLOSED con il PASS operatore già ricevuto; runtime invariato, nessun deploy o nuova QA. DTM5/10m HOLD, mobile PAUSA, P4 SOLO FUTURO.

Finding di metodo nella ricognizione offline: una ricerca iniziale troppo ampia ha intercettato una riga cartografica embedded e prodotto troncamento; contenuto estraneo ignorato, successive ricerche limitate a simboli/range. Nessun dato personale era coinvolto.
